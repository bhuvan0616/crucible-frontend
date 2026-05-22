# Technology Stack: MedusaJS v2 Integration

**Project:** Crucible Creations Storefront
**Researched:** 2025-05-22
**Confidence:** HIGH (verified via Context7 official documentation)

---

## Stack Additions for MedusaJS Integration

### Required Packages

| Library | Version | Purpose | Integration |
|---------|---------|---------|-------------|
| `@medusajs/js-sdk` | latest | Official Storefront API client | Replaces mock product service |
| `@medusajs/types` | latest | TypeScript types for Medusa types | Used alongside existing `HttpTypes` |

```bash
npm install @medusajs/js-sdk@latest @medusajs/types@latest
```

---

## New Files Required

### `lib/sdk.ts` — SDK Configuration

```typescript
import Medusa from "@medusajs/js-sdk"

const MEDUSA_BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_URL || "http://localhost:9000"

export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

### `lib/services/productService.ts` — Replace Mock with Real API

```typescript
import { sdk } from "@/lib/sdk"
import { HttpTypes } from "@medusajs/types"

export async function getProducts(): Promise<HttpTypes.StoreProduct[]> {
  const { products } = await sdk.store.product.list()
  return products
}

export async function getProduct(id: string): Promise<HttpTypes.StoreProduct> {
  const { product } = await sdk.store.product.retrieve(id)
  return product
}
```

---

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `NEXT_PUBLIC_MEDUSA_URL` | Yes (dev) | Backend URL (default: `http://localhost:9000`) |
| `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` | Yes | Publishable API key for sales channel product access |

```bash
# .env.local
NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxx
```

---

## Authentication Flow

### Customer JWT Authentication

MedusaJS v2 uses JWT tokens for customer authentication.

**Login:**
```typescript
// Create session cookie from JWT token
await sdk.auth.session(token)
```

**Logout:**
```typescript
// Token stored in localStorage/sessionStorage
localStorage.removeItem("token")
```

**Customer Context:**
```typescript
// Include JWT in all authenticated requests (cart, checkout)
sdk.auth.token // access stored token
```

### Auth Configuration for Storefront

```typescript
export const sdk = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  debug: process.env.NODE_ENV === "development",
  auth: {
    type: "jwt",
    jwtTokenStorageMethod: "custom",
    storage: localStorage, // or AsyncStorage for React Native
  },
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
})
```

---

## Cart Integration with MedusaJS

### Cart Creation (First Visit)

```typescript
useEffect(() => {
  const cartId = localStorage.getItem("cart_id")
  if (cartId) return

  sdk.store.cart.create({ region_id: regionId })
    .then(({ cart }) => {
      localStorage.setItem("cart_id", cart.id)
    })
}, [])
```

### Cart Operations via SDK

| Operation | SDK Method |
|-----------|------------|
| Retrieve cart | `sdk.store.cart.retrieve(cartId)` |
| Add line item | `sdk.store.cart.addLineItem(cartId, { variant_id, quantity })` |
| Update line item | `sdk.store.cart.updateLineItem(cartId, lineItemId, { quantity })` |
| Remove line item | `sdk.store.cart.removeLineItem(cartId, lineItemId)` |

### Cart → Zustand Migration

Existing Zustand cart store remains for UI state. Medusa cart becomes source of truth:

```typescript
// In Zustand store — sync with Medusa
cartId: localStorage.getItem("cart_id"),

async syncWithMedusa() {
  const medusaCart = await sdk.store.cart.retrieve(this.cartId)
  this.items = medusaCart.items
  this.total = medusaCart.total
}
```

---

## Product Listing: Mock → Real API

### Current Mock (replace in Phase 2)

```typescript
// lib/services/productService.ts (current)
export const products = [...]
export function getProducts() {...}
```

### MedusaJS Real Implementation

```typescript
// lib/services/productService.ts (new)
import { sdk } from "@/lib/sdk"
import { HttpTypes } from "@medusajs/types"

export async function getProducts(params?: {
  limit?: number
  offset?: number
  category_id?: string
}): Promise<{ products: HttpTypes.StoreProduct[]; count: number }> {
  return sdk.store.product.list(params)
}

export async function getProduct(id: string): Promise<HttpTypes.StoreProduct> {
  const { product } = await sdk.store.product.retrieve(id)
  return product
}
```

---

## No Architecture Changes Required

| Existing | MedusaJS Integration | Notes |
|----------|---------------------|-------|
| Next.js 16 App Router | Compatible | SDK works with Server Components + Client Components |
| Tailwind + shadcn/ui | Compatible | No CSS changes needed |
| Zustand | Compatible | Wraps Medusa cart, doesn't replace it |
| Framer Motion | Compatible | No animation changes |
| GA4 | Compatible | Fire events on Medusa cart/checkout actions |
| Dark mode | Compatible | No theme changes |

---

## Integration Order

1. **Install:** `npm install @medusajs/js-sdk@latest @medusajs/types@latest`
2. **Configure:** Create `lib/sdk.ts` with backend URL
3. **Env vars:** Add `NEXT_PUBLIC_MEDUSA_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`
4. **Product service:** Swap mock data for `sdk.store.product.list()`
5. **Cart:** Create cart on first visit, sync with Zustand
6. **Auth:** Add JWT login/logout flow before checkout

---

## Sources

- [Medusa JS SDK Installation](https://docs.medusajs.com/resources/js-sdk) — HIGH confidence
- [Medusa Storefront JS SDK Configuration](https://docs.medusajs.com/resources/storefront-development/publishable-api-keys) — HIGH confidence
- [Medusa Product Listing](https://docs.medusajs.com/resources/storefront-development/products/list) — HIGH confidence
- [Medusa Cart Integration](https://docs.medusajs.com/resources/storefront-development/cart/create) — HIGH confidence