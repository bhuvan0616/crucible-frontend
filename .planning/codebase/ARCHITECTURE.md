# Architecture

**Analysis Date:** 2026-05-27

## System Overview

This is a Next.js 16 storefront for "Crucible Creations" — a premium 3D printed products e-commerce site. The application follows the **Next.js App Router** architecture with a clear separation between server and client components.

```text
┌─────────────────────────────────────────────────────────────┐
│                      Browser / Client                       │
├─────────────────────────────────────────────────────────────┤
│  React 19 (Client Components) + Zustand (State)             │
│  └── components/ (UI layer)                                  │
│      └── shop/, product/, cart/, checkout/, landing/        │
├─────────────────────────────────────────────────────────────┤
│                    Next.js App Router                        │
│  └── app/ (Pages + Server Components)                       │
│      ├── page.tsx (Landing)                                 │
│      ├── shop/, product/[id]/, cart/, checkout/            │
│      └── auth/customer/google/callback/                     │
├─────────────────────────────────────────────────────────────┤
│                      API Layer                               │
│  └── lib/sdk.ts (MedusaJS SDK)                             │
│  └── lib/firebase.ts (Google Auth)                         │
├─────────────────────────────────────────────────────────────┤
│                   External Services                          │
│  └── Medusa Backend (localhost:9000)                        │
│  └── Firebase Auth                                          │
│  └── Google Analytics 4                                     │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| `useAuthStore` | Authentication state (login, register, logout, checkAuth) | `store/authStore.ts` |
| `useCartStore` | Cart state with Medusa sync (add, update, remove items) | `store/cartStore.ts` |
| `sdk` | MedusaJS SDK singleton for API calls | `lib/sdk.ts` |
| `getProducts`, `getProductById` | Product data fetching with Medusa API transformation | `lib/data/products.ts` |
| `Providers` | Client-side initialization wrapper (auth check + cart init) | `app/providers.tsx` |

## Pattern Overview

**Overall:** Next.js App Router + MedusaJS + Zustand

**Key Characteristics:**
- Server Components for data fetching (product pages, layouts)
- Client Components for interactivity ("use client" directive)
- Zustand stores for client-side state (cart persisted to localStorage)
- MedusaJS SDK for type-safe backend communication
- shadcn/ui + Tailwind for UI components

## Layers

**UI Components Layer:**
- Purpose: Render pages and handle user interaction
- Location: `components/`
- Contains: Landing, shop, product, cart, checkout, auth components
- Depends on: Zustand stores, lib utilities
- Used by: App Router pages

**Page/Route Layer (Next.js App Router):**
- Purpose: Define routes and coordinate data fetching
- Location: `app/`
- Contains: `page.tsx`, `[id]/page.tsx`, `shop/page.tsx`, etc.
- Depends on: `lib/data/products.ts`, component layer
- Used by: Next.js routing

**State Management Layer:**
- Purpose: Client-side state (auth, cart) with persistence
- Location: `store/`
- Contains: `authStore.ts`, `cartStore.ts`
- Depends on: `lib/sdk.ts` (for API calls)
- Used by: Client components

**API/Service Layer:**
- Purpose: Backend communication abstraction
- Location: `lib/sdk.ts`, `lib/firebase.ts`, `lib/data/products.ts`
- Contains: MedusaJS SDK instance, Firebase auth, product transformers
- Depends on: External Medusa backend, Firebase
- Used by: Stores, pages, components

## Data Flow

### Primary Request Path (Product Page)

1. **Server Component** (`app/product/[id]/page.tsx:54`)
   - Calls `getProductById(id)` to fetch product data from Medusa
   - Generates metadata (SEO) and JSON-LD structured data
   - Renders `ProductPageClient` with product data

2. **Client Component** (`components/product/ProductPageClient.tsx:129`)
   - Receives product as prop
   - Manages local state: `selectedOptions`, `customization`, `quantity`
   - Calls `useCartStore.addItem()` to add to cart

3. **Zustand Store** (`store/cartStore.ts:96`)
   - Calls `sdk.store.cart.createLineItem()` via MedusaJS SDK
   - Updates local state with cart items and totals

### Cart Initialization Flow

1. `app/providers.tsx` mounts → calls `checkAuth()` and `initCart()`
2. `initCart()` checks localStorage for existing `cart_id`
3. If exists, retrieves cart from Medusa; if not, creates new cart
4. Cart ID persisted to localStorage for session continuity

## Key Abstractions

**MedusaJS SDK Singleton:**
- Purpose: Centralized API client for all backend operations
- Examples: `lib/sdk.ts`
- Pattern: Singleton export with auth token storage via localStorage

**Zustand Stores:**
- Purpose: Client-side state management with persistence
- Examples: `store/authStore.ts`, `store/cartStore.ts`
- Pattern: `create<StoreType>()((set, get) => ...))` with persist middleware for cart

**Product Data Transformers:**
- Purpose: Transform Medusa API responses to internal types
- Examples: `lib/data/products.ts:transformProduct()`
- Pattern: Accept Medusa types, return internal `Product` type

**GA4 Analytics Wrapper:**
- Purpose: Type-safe analytics tracking
- Examples: `lib/analytics/ga4.ts`
- Pattern: `trackAddToCart()`, `trackPurchase()` functions

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every page navigation
- Responsibilities: Font loading (Rubik), metadata, GA4 script injection, Navbar render

**Home Page:**
- Location: `app/page.tsx`
- Triggers: Navigation to `/`
- Responsibilities: Render landing page sections (Hero, Showcase, Features, etc.)

**Product Page:**
- Location: `app/product/[id]/page.tsx`
- Triggers: Navigation to `/product/{id}`
- Responsibilities: SEO metadata, JSON-LD, product data fetch, render ProductPageClient

**Shop Page:**
- Location: `app/shop/page.tsx`
- Triggers: Navigation to `/shop`
- Responsibilities: Product listing with client-side filtering

**Checkout Page:**
- Location: `app/checkout/page.tsx`
- Triggers: Navigation to `/checkout`
- Responsibilities: Multi-step checkout form (address, shipping, payment)

## Architectural Constraints

- **Server Components default:** Pages are server-rendered unless marked "use client"
- **Client state:** Only cart and auth use Zustand; no global client state library
- **Cart persistence:** Cart ID stored in localStorage, synced with Medusa on init
- **No middleware.ts:** Auth redirects handled via `proxy.ts`
- **Prices in paise:** Internal calculations use paise (₹449.00 = 44900), formatted on display

## Anti-Patterns

### Direct Store Access in Server Components

**What happens:** Stores like `useCartStore` are imported and accessed directly in server contexts
**Why it's wrong:** Zustand stores use client-side APIs (localStorage); server components run on the server where these APIs don't exist
**Do this instead:** Pass data as props from server components to client components

### Mixed Responsibility in Pages

**What happens:** Some pages both fetch data and manage client state
**Why it's wrong:** Makes testing and caching harder
**Do this instead:** Separate data fetching (server component) from interactivity (child client component)

## Error Handling

**Strategy:** Try-catch with user-facing error messages

**Patterns:**
- Auth errors: Parse error messages and show specific feedback ("Invalid email or password")
- Cart errors: Silently fail cart operations, log to console
- Product fetch errors: Show 404 page via `notFound()`

## Cross-Cutting Concerns

**SEO:** Metadata exported from pages with OpenGraph, Twitter cards, JSON-LD

**Analytics:** GA4 configured globally in `app/layout.tsx`, event tracking functions in `lib/analytics/ga4.ts`

**Authentication:** Firebase for Google OAuth, Medusa for email/password auth

---

*Architecture analysis: 2026-05-27*
