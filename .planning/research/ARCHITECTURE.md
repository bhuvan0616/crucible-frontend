# MedusaJS v2 Integration Architecture

**Project:** Crucible Creations Storefront
**Researched:** 2026-05-22
**Confidence:** HIGH

## Executive Summary

MedusaJS v2 integrates with Next.js 16 via the `@medusajs/js-sdk` as the exclusive API client. The storefront communicates with the Medusa backend exclusively through this SDK — no direct REST calls. Data fetching uses Next.js Server Components with fetch abstraction and React cache, replacing the Zustand-based cart with Medusa's server-persisted cart accessed via SDK. Authentication uses JWT tokens stored client-side, obtained via `sdk.auth.login()`. New components required: SDK client singleton, Medusa-aware product service, cart hydration layer, and auth context provider.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Next.js 16 (Storefront)                       │
├─────────────────────────────────────────────────────────────────────────┤
│  app/                    components/              lib/                   │
│  ├── layout.tsx         ├── Header/              ├── medusa.ts          │
│  ├── page.tsx           ├── ProductCard/         ├── data/             │
│  ├── products/          └── CartButton/           │   └── products.ts   │
│  └── checkout/                                  └── store/             │
│                                                  └── cartStore.ts       │
├─────────────────────────────────────────────────────────────────────────┤
│                         @medusajs/js-sdk                                │
│                         (single client, auth-aware)                    │
└─────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Medusa Backend (port 9000)                         │
├─────────────────────────────────────────────────────────────────────────┤
│  Store API    │  Admin API  │  Auth  │  Cart  │  Payment  │  Orders   │
└─────────────────────────────────────────────────────────────────────────┘
```

**Key architectural principle:** The `@medusajs/js-sdk` is the only allowed HTTP client between storefront and Medusa backend. All data flows through this SDK, which handles auth headers, retry logic, and typed responses.

## SDK Client Setup

### New File: `lib/medusa.ts`

```typescript
import Medusa from "@medusajs/js-sdk"

export const medusaClient = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    type: "jwt",
    jwtTokenStorageKey: "medusa_jwt_token",
    jwtTokenStorageMethod: "local",
  },
})
```

**Required environment variables:**
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
MEDUSA_ADMIN_API_KEY=your_secret_admin_key  (for admin operations only)
```

## Integration Point 1: Product Service (`lib/data/products.ts` → Medusa)

### Current Mock Implementation

```typescript
// lib/data/products.ts - mock data
export const products = [...]
export async function getProducts() {...}
```

### MedusaJS Replacement

```typescript
// lib/data/products.ts - Medusa-backed
import { medusaClient } from "@/lib/medusa"

export async function getProducts(options?: {
  limit?: number
  offset?: number
  category_id?: string
}) {
  const { products, count } = await medusaClient.store.product.list(options)
  return { products, count }
}

export async function getProductByHandle(handle: string) {
  const { products } = await medusaClient.store.product.list({
    handle,
    limit: 1,
  })
  return products[0] || null
}

export async function getProductsByCategory(categoryId: string) {
  return medusaClient.store.product.list({
    category_id: categoryId,
  })
}
```

**Integration pattern:** Use `sdk.store.product.*` methods for storefront product browsing. Admin operations use `sdk.admin.product.*` with a separate admin-only SDK instance.

### Product Data Shape (Medusa v2)

```typescript
interface MedusaProduct {
  id: string
  title: string
  handle: string
  description: string
  thumbnail?: string
  images?: { url: string; alt_text?: string }[]
  variants: MedusaVariant[]
  options: { id: string; title: string; values: string[] }[]
  categories?: { id: string; name: string }[]
  metadata?: Record<string, unknown>
}

interface MedusaVariant {
  id: string
  title: string
  sku?: string
  prices: { amount: number; currency_code: string }[]
  inventory_quantity?: number
  options: { option_id: string; value: string }[]
}
```

**Note:** Price amounts in Medusa are in smallest currency unit (paise for INR). The Crucible convention of `44900 = ₹449.00` maps directly — no conversion needed.

---

## Integration Point 2: Cart Store (`store/cartStore.ts` → Medusa Cart API)

### Architectural Shift

**Current approach:** Client-side Zustand store with localStorage persistence
**Medusa approach:** Server-persisted cart accessed via SDK, hydrated into client state

This is the most significant architectural change. Medusa maintains cart state server-side. The client reads cart from Medusa on page load and syncs mutations through the SDK.

### New Cart Layer

```typescript
// store/cartStore.ts - Medusa-synced Zustand
import { create } from "zustand"
import { medusaClient } from "@/lib/medusa"

interface CartState {
  cart: any | null
  cartId: string | null
  loading: boolean
  initialized: boolean

  // Actions
  initializeCart: () => Promise<void>
  addLineItem: (variantId: string, quantity: number) => Promise<void>
  updateLineItem: (lineItemId: string, quantity: number) => Promise<void>
  removeLineItem: (lineItemId: string) => Promise<void>
  updateCustomer: (customerId: string) => Promise<void>
}

export const useCartStore = create<CartState>((set, get) => ({
  cart: null,
  cartId: typeof window !== "undefined" ? localStorage.getItem("cart_id") : null,
  loading: false,
  initialized: false,

  initializeCart: async () => {
    const cartId = get().cartId
    if (!cartId) {
      // Create new cart - requires region_id
      const regionId = "reg_default" // TODO: resolve from geo
      const { cart } = await medusaClient.store.cart.create({ region_id: regionId })
      set({ cart, cartId: cart.id })
      localStorage.setItem("cart_id", cart.id)
    } else {
      // Retrieve existing cart
      try {
        const { cart } = await medusaClient.store.cart.retrieve(cartId)
        set({ cart })
      } catch {
        // Cart expired, create new
        localStorage.removeItem("cart_id")
        await get().initializeCart()
      }
    }
    set({ initialized: true })
  },

  addLineItem: async (variantId: string, quantity: number) => {
    const { cartId } = get()
    if (!cartId) return

    set({ loading: true })
    try {
      const { cart } = await medusaClient.store.cart.addLineItems(cartId, {
        items: [{ variant_id: variantId, quantity }]
      })
      set({ cart })
    } finally {
      set({ loading: false })
    }
  },

  updateLineItem: async (lineItemId: string, quantity: number) => {
    const { cartId } = get()
    if (!cartId) return

    set({ loading: true })
    try {
      const { cart } = await medusaClient.store.cart.updateLineItems(cartId, lineItemId, {
        quantity
      })
      set({ cart })
    } finally {
      set({ loading: false })
    }
  },

  removeLineItem: async (lineItemId: string) => {
    const { cartId } = get()
    if (!cartId) return

    set({ loading: true })
    try {
      const { cart } = await medusaClient.store.cart.removeLineItems(cartId, {
        items: [lineItemId]
      })
      set({ cart })
    } finally {
      set({ loading: false })
    }
  },

  updateCustomer: async (customerId: string) => {
    const { cartId } = get()
    if (!cartId) return

    const { cart } = await medusaClient.store.cart.update(cartId, {
      customer_id: customerId
    })
    set({ cart })
  }
}))
```

### Cart SDK Methods Reference

| Operation | SDK Method |
|-----------|------------|
| Create cart | `sdk.store.cart.create({ region_id })` |
| Retrieve cart | `sdk.store.cart.retrieve(cartId)` |
| Add line items | `sdk.store.cart.addLineItems(cartId, { items: [{ variant_id, quantity }] })` |
| Update line item | `sdk.store.cart.updateLineItems(cartId, lineItemId, { quantity })` |
| Remove line item | `sdk.store.cart.removeLineItems(cartId, { items: [lineItemId] })` |
| Update cart | `sdk.store.cart.update(cartId, { region_id, customer_id })` |
| Complete cart | `sdk.store.cart.complete(cartId)` |

---

## Integration Point 3: Checkout (`app/checkout/page.tsx` → Medusa Checkout)

### Checkout Flow

```
Cart (Server Persisted)
    │
    ▼
┌─────────────────────────┐
│  1. Initialize Payment   │
│  sdk.store.payment...    │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  2. Complete Cart        │
│  sdk.store.cart.complete │
│  (creates order)         │
└─────────────────────────┘
    │
    ▼
┌─────────────────────────┐
│  3. Payment Capture      │
│  (via payment provider)   │
└─────────────────────────┘
```

### Checkout Implementation Pattern

```typescript
// app/checkout/actions.ts - Server Action
"use server"

import { medusaClient } from "@/lib/medusa"

export async function completeOrder(cartId: string) {
  "use server"

  // Step 1: Complete cart (authorizes payment, creates order)
  const result = await medusaClient.store.cart.complete(cartId)

  if (result.type === "order") {
    // Success - clear local cart reference
    localStorage.removeItem("cart_id")
    return { success: true, orderId: result.order.id }
  } else {
    // Failure - cart has error details
    return { success: false, error: result.error?.message }
  }
}

export async function initiatePaymentSession(cartId: string, providerId: string = "stripe") {
  "use server"

  return medusaClient.store.payment.initiatePaymentSession(cartId, {
    provider_id: providerId
  })
}
```

### Checkout Component Integration

```typescript
// app/checkout/page.tsx
import { completeOrder } from "./actions"

export default async function CheckoutPage() {
  const cart = await getServerCart() // Fetch from Medusa via SDK in server component

  return (
    <form action={async () => {
      "use server"
      const result = await completeOrder(cart.id)
      if (result.success) {
        redirect(`/order-confirmation/${result.orderId}`)
      }
    }}>
      {/* Checkout form fields */}
      <button type="submit">Place Order</button>
    </form>
  )
}
```

**Note:** Medusa's cart completion returns `{ type: "order" | "cart", order?: Order, cart?: Cart, error?: Error }`. The `type` field indicates whether the operation succeeded (order created) or failed (cart returned with error).

---

## Integration Point 4: Authentication (JWT + Customer Context)

### Auth Flow

```
1. Customer logs in
   └─► sdk.auth.login("customer", "emailpass", { email, password })
       └─► Returns JWT token, SDK auto-attaches to subsequent requests

2. Token stored in localStorage (key: "medusa_jwt_token")

3. Subsequent requests include Authorization: Bearer <token>

4. Retrieve customer:
   └─► sdk.store.customer.retrieve()
       └─► Returns authenticated customer object
```

### Auth Provider Implementation

```typescript
// lib/auth/provider.tsx
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { medusaClient } from "@/lib/medusa"

interface AuthContextType {
  customer: any | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  customer: null,
  loading: true,
  login: async () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [customer, setCustomer] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if JWT exists, retrieve customer
    const token = localStorage.getItem("medusa_jwt_token")
    if (token) {
      medusaClient.store.customer.retrieve()
        .then(({ customer }) => setCustomer(customer))
        .catch(() => localStorage.removeItem("medusa_jwt_token"))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { token } = await medusaClient.auth.login("customer", "emailpass", {
      email,
      password,
    })
    // Token is auto-stored by SDK based on jwtTokenStorageMethod config
    const { customer } = await medusaClient.store.customer.retrieve()
    setCustomer(customer)
  }

  const logout = () => {
    localStorage.removeItem("medusa_jwt_token")
    setCustomer(null)
  }

  return (
    <AuthContext.Provider value={{ customer, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

### Auth Route Protection

```typescript
// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Example: Protect checkout routes
  if (request.nextUrl.pathname.startsWith("/checkout")) {
    const token = request.cookies.get("medusa_jwt_token")
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ["/checkout/:path*"]
}
```

---

## New Components Required

| Component | Location | Purpose |
|-----------|----------|---------|
| `lib/medusa.ts` | `lib/` | SDK client singleton export |
| `lib/data/products.ts` | `lib/data/` | Medusa product service (replaces mock) |
| `lib/auth/provider.tsx` | `lib/auth/` | Auth context for customer state |
| `lib/data/cart.ts` | `lib/data/` | Server-side cart helpers |
| `store/cartStore.ts` | Updated | Medusa-synced Zustand store |
| `app/checkout/actions.ts` | `app/checkout/` | Server Actions for checkout |

## Environment Variables

```env
# Required
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...

# Payment (Stripe)
NEXT_PUBLIC_STRIPE_KEY=pk_...

# Optional - for admin features
MEDUSA_ADMIN_API_KEY=your_secret_key
```

---

## Data Flow Summary

```
┌────────────────────────────────────────────────────────────────────┐
│  Server Components (app/)                                         │
│  - Fetch products via sdk.store.product.list()                     │
│  - Fetch cart via sdk.store.cart.retrieve()                       │
│  - Pass data as props to client components                        │
└────────────────────────────────────────────────────────────────────┘
                              │
                    props / Server Actions
                              │
┌────────────────────────────────────────────────────────────────────┐
│  Client Components (components/)                                   │
│  - useCartStore for local cart state + Medusa sync                │
│  - useAuth for customer authentication                              │
│  - Server Actions for mutations (add to cart, checkout)           │
└────────────────────────────────────────────────────────────────────┘
                              │
                         SDK calls
                              │
┌────────────────────────────────────────────────────────────────────┐
│  @medusajs/js-sdk                                                  │
│  - Attaches JWT auth header                                        │
│  - Handles baseUrl, publishableKey                                 │
└────────────────────────────────────────────────────────────────────┘
```

---

## Sources

- [Medusa Next.js Starter](https://github.com/medusajs/nextjs-starter-medusa) — Official starter template (HIGH)
- [Medusa JS SDK Documentation](https://docs.medusajs.com/resources/js-sdk) — SDK reference (HIGH)
- [Server Components Transition Blog](https://medusajs.com/blog/client-server-transition-learnings-nextjs-14-server-components) — Architecture patterns (HIGH)
- [Store API Reference](https://docs.medusajs.com/api/store) — Cart, product, auth endpoints (HIGH)
- [Next.js Starter Docs](https://docs.medusajs.com/resources/nextjs-starter) — Setup guide (MEDIUM)