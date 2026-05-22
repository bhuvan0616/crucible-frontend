# MedusaJS v2 Backend Integration — Research Summary

**Project:** Crucible Creations Storefront
**Domain:** Ecommerce storefront with headless MedusaJS v2 backend integration
**Researched:** 2026-05-22
**Confidence:** HIGH

---

## Executive Summary

MedusaJS v2 integration replaces the project's mock data layer with live API calls via `@medusajs/js-sdk`. The storefront communicates exclusively through this SDK—no direct REST calls. The mock product data structure already mirrors MedusaJS v2 schema, making the swap straightforward in Phase 2. The primary architectural shift is moving from local Zustand cart state to Medusa's server-persisted cart, with Zustand as a client-side hydration layer.

**Key risks:** Cart state desync between local Zustand and Medusa's server cart is the most critical issue—every cart mutation must sync with the server. Price formatting requires attention since Medusa returns amounts in smallest unit (paise for INR, 44900 = ₹449.00). JWT token lifecycle must be handled for checkout auth. CORS configuration on the Medusa backend must include the storefront origin.

**Build order:** Install SDK → Configure client → Replace product service → Implement Medusa-synced cart → Add auth flow → Checkout completion.

---

## Key Findings

### Recommended Stack Additions

**Core packages:**
- `@medusajs/js-sdk` — Official Storefront API client, replaces mock product service
- `@medusajs/types` — TypeScript types for Medusa types (used alongside existing `HttpTypes`)

**New files required:**

| File | Purpose |
|------|---------|
| `lib/medusa.ts` | SDK client singleton with auth configuration |
| `lib/data/products.ts` | Medusa-backed product service (replaces mock) |
| `lib/auth/provider.tsx` | Auth context for customer JWT state |
| `store/cartStore.ts` | Medusa-synced Zustand cart (replaces pure local state) |
| `app/checkout/actions.ts` | Server Actions for cart.complete() checkout |

**Environment variables:**
```
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_xxxxxxxxxxxx
```

---

### Expected Features (Table Stakes)

**Product Fetching:**
- `sdk.store.product.list()` — List with pagination (limit/offset), variant pricing
- `sdk.store.product.retrieve(id)` — Single product with variants
- Region ID required for tax-inclusive calculated prices
- Fields param `+variants.inventory_quantity` for stock levels

**Cart Operations:**
- Create cart on first visit, store `cart.id` in localStorage
- Add/update/remove line items via SDK
- `metadata` field for customization text (engraving)
- Auto-calculated totals (item_subtotal, shipping_total, tax_total, total)
- No manual price calculation needed—Medusa handles it

**Customer Authentication:**
- `sdk.auth.login("customer", "emailpass", {...})` → JWT token
- Token auto-stored by SDK, included in subsequent request headers
- Logout = localStorage.removeItem("token")
- No server-side logout required

**Checkout Flow:**
```
Product → Address → Shipping → Payment → Complete (cart.complete())
```
- Address required before shipping methods become available
- `cart.complete()` atomically processes payment and creates order
- Returns `{ type: "order", order: {...} }` on success

---

### Architecture Approach

**Single SDK client** (`lib/medusa.ts`) handles all Medusa communication:
- JWT auth auto-attached to requests
- Publishable key for sales channel access
- localStorage for token persistence

**Data flow:**
```
Server Components → SDK calls → Medusa Backend
     ↓                    ↓
Client Components ← Zustand (hydrated from Medusa cart)
```

**Key pattern:** Zustand holds cart ID (localStorage) and syncs with Medusa on every operation. Server cart is source of truth, not local optimistic state.

**New components required:** 6 files (see Stack Additions table above)

---

### Critical Pitfalls to Avoid

1. **Cart State Desync** — Always replace local Zustand state with server response after mutations. Use `refreshCartItemsWorkflow` after cart modifications. Don't rely on optimistic UI without server reconciliation.

2. **Price Display (Paise)** — Medusa returns `44900` for ₹449.00. Create `formatPrice()` utility that divides by 100 for INR/USD. Apply globally to all price displays.

3. **JWT Token Expiry** — Short-lived tokens expire silently causing 401 errors at checkout. Implement token refresh check before payment step. Configure `AUTH_CORS` env var on Medusa backend.

4. **CORS Misconfiguration** — Medusa backend must include storefront origin in `storeCors`, `adminCors`, `authCors`. Without this, browser blocks all API calls.

5. **Race Conditions (Rapid Clicks)** — Disable buttons during loading, use mutation queuing, or implement optimistic updates with rollback. Duplicate line items and quantity miscalculations occur without this.

---

## Implications for Roadmap

### Phase 1: Foundation & SDK Setup (Current Phase)
**Rationale:** Must install packages and create SDK config before any Medusa API calls
**Delivers:** `@medusajs/js-sdk` installed, `lib/medusa.ts` configured, env vars set
**Avoids:** CORS issues, SDK misconfiguration

### Phase 2: Product Gallery & Medusa Integration
**Rationale:** Replace mock data with live API—straightforward swap due to schema alignment
**Delivers:** Product listing, PDP with Medusa data, cart creation on first visit
**Uses:** `@medusajs/js-sdk`, `lib/data/products.ts`, `store/cartStore.ts` (Medusa-synced)
**Implements:** Product fetch integration, cart initialization
**Avoids:** Pitfall: Price display showing raw paise—must implement `formatPrice()` utility

### Phase 3: Cart Operations & Medusa Sync
**Rationale:** Cart is the most stateful integration—must sync properly with server
**Delivers:** Add/update/remove cart items, Zustand hydration from Medusa cart
**Avoids:** Pitfall: Cart desync—every mutation must reconcile with server cart

### Phase 4: Authentication Flow
**Rationale:** Auth required before checkout can complete order
**Delivers:** Login/register/logout, JWT token management, customer context
**Avoids:** Pitfall: JWT expiry during checkout—implement token refresh check

### Phase 5: Checkout & Order Completion
**Rationale:** Final step requires address → shipping → payment → complete
**Delivers:** Full checkout flow, `cart.complete()`, order confirmation
**Avoids:** Pitfall: Race conditions on payment submit—disable buttons, handle errors

### Phase Ordering Rationale

- **Phase 1 → 2:** SDK must exist before any Medusa API calls
- **Phase 2 → 3:** Product data needed before cart operations make sense
- **Phase 3 → 4:** Cart must exist before associating with customer
- **Phase 4 → 5:** Auth required for order creation

---

### Research Flags

**Needs deeper research during planning:**
- **Phase 4 (Auth):** Third-party OAuth (Google) has different flow—returns `{ location: string }` not token, requires callback handling. May need separate research.
- **Phase 5 (Payment):** External payment providers (Stripe, Razorpay) integration patterns for redirect-based payment flow.

**Standard patterns (skip research-phase):**
- **Phase 2 (Product fetch):** Well-documented, cursor/offset pagination is standard pattern
- **Phase 3 (Cart):** Medusa cart API is stable, patterns well-documented in official docs

---

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Verified via official MedusaJS documentation (Context7) |
| Features | HIGH | Official Store API reference, well-established patterns |
| Architecture | HIGH | Official Next.js starter template confirms patterns |
| Pitfalls | MEDIUM-HIGH | Mix of official docs + community-validated issues |

**Overall confidence:** HIGH

### Gaps to Address

- **Payment provider integration:** Specific patterns for Razorpay/UPI not deeply researched—may need Phase 5 planning research
- **Region/currency handling:** Multiple regions may require dynamic region_id resolution (currently hardcoded placeholder)
- **Admin API:** Not in scope for frontend milestone but `lib/medusa.ts` should separate admin SDK instance for future use

---

## Sources

### Primary (HIGH confidence)
- [Medusa JS SDK Installation](https://docs.medusajs.com/resources/js-sdk) — Stack recommendations
- [Medusa Storefront Development](https://docs.medusajs.com/resources/storefront-development) — Features & architecture
- [Medusa Next.js Starter](https://github.com/medusajs/nextjs-starter-medusa) — Architecture patterns

### Secondary (MEDIUM-HIGH confidence)
- [Medusa Cart Management](https://docs.medusajs.com/resources/storefront-development/cart/manage-items) — Cart integration
- [Medusa Storefront Production Optimizations](https://docs.medusajs.com/resources/storefront-development/production-optimizations) — Pitfall prevention

---

*Research completed: 2026-05-22*
*Ready for roadmap: yes*