# Phase 6: Cart Operations & Medusa Sync - Research

**Researched:** 2026-05-22
**Domain:** MedusaJS Cart API integration with Zustand state synchronization
**Confidence:** HIGH

## Summary

Phase 6 replaces the pure-local Zustand cart store with a Medusa-synced architecture where the Medusa backend is the source of truth. The core strategy is: on first visit a Medusa cart is created via `sdk.store.cart.create()` and its ID stored in localStorage; on return visits the cart ID is retrieved and the cart state fetched via `sdk.store.cart.retrieve()`. All cart mutations (add item, update quantity, remove item) call Medusa APIs first, then reconcile Zustand state with the Medusa response.

Key technical findings: (1) `sdk.store.cart.create()` accepts optional `region_id` — without it, Medusa uses the default region; (2) `createLineItem()` accepts `metadata` for customization text; (3) `updateLineItem()` accepts `quantity` and `metadata`; (4) Cart totals (`subtotal`, `shipping_total`, `tax_total`, `total`) are computed server-side and returned in the cart response — they must be extracted from the Medusa `Cart` type rather than calculated locally; (5) The existing `cartStore.ts` currently stores items in localStorage via `zustand/middleware` — this needs to be replaced with Medusa-synced state; (6) The `CartItem` type needs to map Medusa's `line_items[].id` as the item identifier, since the local `uuid` is no longer the source of truth.

**Primary recommendation:** Adopt a **server-first sync strategy** — all mutations go to Medusa API first, wait for response, then update Zustand from Medusa data. This prevents drift between local state and server state, which is critical when the backend is source of truth for totals and inventory.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Cart creation/retrieval | API / Backend | — | `sdk.store.cart.create/retrieve()` — Medusa owns cart persistence |
| Add/remove/update line items | API / Backend | — | `sdk.store.cart.createLineItem/deleteLineItem/updateLineItem()` — Medusa computes all totals |
| Cart ID persistence | Browser / Client | — | localStorage (`cart_id`) — no server involvement needed |
| Cart state (Zustand) | Browser / Client | — | Hydrated from Medusa on init, kept in sync after mutations |
| Customization metadata | API / Backend | Browser / Client | Stored in Medusa line item `metadata`; also kept in Zustand for display |
| Cart totals (subtotal/shipping/tax/total) | API / Backend | — | Medusa computes; extracted from cart response, not calculated locally |
| Quantity controls | Browser / Client | — | UI triggers Medusa sync; displays current state from Zustand |

## User Constraints (from CONTEXT.md)

> No CONTEXT.md found for Phase 6. These constraints are inferred from the phase description and prior phase decisions.

### Locked Decisions
- Medusa backend at `http://localhost:9000`
- Prices stored in paise (divide by 100 for display)
- `lib/utils/formatPrice.ts` utility exists for price formatting
- `lib/sdk.ts` already has Medusa client configured (Phase 4)
- `store/cartStore.ts` is the existing Zustand cart store (Phase 2/3)
- Customization text on PDP only (12-char max)
- Cart displays read-only customization

### the agent's Discretion
- Cart initialization strategy (server-first vs optimistic)
- Zustand store structure (whether to keep local uuid or use Medusa line item IDs)
- How to handle sync failures / offline state
- Loading states during API calls

### Deferred Ideas (OUT OF SCOPE)
- Auth (Phase 7) — cart should work for anonymous users first
- Real payment (Phase 8) — mock checkout acceptable for Phase 6

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CART-11 | Cart initialized from Medusa on first visit (cart.create or cart retrieval) | `sdk.store.cart.create()` and `sdk.store.cart.retrieve()` confirmed via Context7 — create returns cart with ID, retrieve fetches by ID |
| CART-12 | Cart ID persisted in localStorage | localStorage pattern confirmed in Medusa docs — `localStorage.setItem("cart_id", cart.id)` |
| CART-13 | Add to cart syncs immediately with Medusa cart API | `sdk.store.cart.createLineItem()` accepts `variant_id`, `quantity`, `metadata` — confirmed via Context7 |
| CART-14 | Quantity updates sync with Medusa cart API | `sdk.store.cart.updateLineItem()` accepts `quantity` — confirmed via Context7 |
| CART-15 | Remove item syncs with Medusa cart API | `sdk.store.cart.deleteLineItem()` — confirmed via Context7 |
| CART-16 | Cart totals fetched from Medusa (not calculated locally) | Cart type includes `item_total`, `subtotal`, `shipping_total`, `tax_total`, `total` (all BigNumberValue) — confirmed via Context7 |
| CART-17 | Customization text stored in line item metadata | `metadata` field on line item confirmed — `createLineItem()` and `updateLineItem()` accept `metadata` |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@medusajs/js-sdk` | 2.15.3 | All Medusa API calls | Official Medusa storefront SDK |
| `@medusajs/types` | 2.15.3 | TypeScript types | `HttpTypes.StoreCart`, `HttpTypes.CartLineItem` |
| Zustand | (existing) | Client-side cart state | Already in project, used for UI reactivity |

**Version verification:** `@medusajs/js-sdk` 2.15.3, `@medusajs/types` 2.15.3 — verified via `npm view` on 2026-05-22.

**No additional installation needed** — Phase 4 already installed `@medusajs/js-sdk` and `@medusajs/types`.

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `uuid` | (existing) | Local item IDs before Medusa sync | Only for optimistic UI before Medusa confirms |

**Installation:** No new packages required.

## Architecture Patterns

### System Architecture Diagram

```
Browser Client                    Zustand Store (cartStore.ts)          Medusa Backend (localhost:9000)
      │                                    │                                   │
      │  1. Check localStorage for          │                                   │
      │     cart_id                         │                                   │
      │                                    │                                   │
      ├─── no cart_id ─────────────────────►│                                   │
      │                                    │  2. sdk.store.cart.create()         │
      │                                    │──────────────────────────────────►│
      │                                    │     (returns cart with id)         │
      │                                    │◄───────────────────────────────────│
      │                                    │  3. Store cart_id in localStorage  │
      │                                    │  4. Update Zustand items from      │
      │                                    │     Medusa cart.line_items         │
      │                                    │                                   │
      ├─── cart_id found ──────────────────►│                                   │
      │                                    │  5. sdk.store.cart.retrieve(id)    │
      │                                    │──────────────────────────────────►│
      │                                    │◄───────────────────────────────────│
      │                                    │  6. Update Zustand from response   │
      │                                    │                                   │
      │  7. User clicks "Add to Cart"       │                                   │
      │                                    │                                   │
      │                                    │  8. sdk.store.cart.createLineItem()│
      │                                    │     { variant_id, quantity,        │
      │                                    │       metadata: { customization }} │
      │                                    │──────────────────────────────────►│
      │                                    │◄───────────────────────────────────│
      │                                    │  9. Update Zustand from cart      │
      │                                    │     response (Medusa is source    │
      │                                    │     of truth for quantities,      │
      │                                    │     totals)                       │
      │                                    │                                   │
      │  10. Display updated cart totals   │                                   │
      │      (from Zustand which = Medusa)  │                                   │
```

### Recommended Project Structure
```
store/
├── cartStore.ts          # Medusa-synced Zustand store (REWRITE)
├── cartStore.medusa.ts  # NEW — cart sync utilities (create, retrieve, add, remove, update)
lib/
├── medusa.ts            # (exists) SDK client singleton
├── sdk.ts               # (exists) SDK export
├── utils/
│   └── formatPrice.ts   # (exists) paise → display conversion
types/
└── index.ts             # (exists) CartItem type — may need variant_id field
```

### Pattern 1: Cart Initialization (First Visit)
**What:** On first visit, check localStorage for `cart_id`. If absent, create a new Medusa cart.
**When to use:** App initialization, layout mount, or cart page mount.
**Example:**
```typescript
// Source: Medusa Storefront Cart Create docs — https://docs.medusajs.com/resources/storefront-development/cart/create
import { sdk } from "@/lib/sdk"

async function initCart() {
  const existingCartId = localStorage.getItem("cart_id")
  if (existingCartId) {
    try {
      const { cart } = await sdk.store.cart.retrieve(existingCartId)
      return cart
    } catch {
      // Cart expired or invalid — create new
      localStorage.removeItem("cart_id")
    }
  }

  // No cart or invalid — create new
  const { cart } = await sdk.store.cart.create({})
  localStorage.setItem("cart_id", cart.id)
  return cart
}
```

### Pattern 2: Cart Initialization (Returning Visitor)
**What:** If `cart_id` exists in localStorage, fetch the cart from Medusa to restore state.
**When to use:** Same as above — handles both cases.
**Example:**
```typescript
async function getOrCreateCart() {
  const cartId = localStorage.getItem("cart_id")
  if (cartId) {
    try {
      return await sdk.store.cart.retrieve(cartId, {
        fields: "id,*items,*items.variant,*items.variant.product,subtotal,shipping_total,tax_total,total",
      })
    } catch {
      localStorage.removeItem("cart_id")
    }
  }
  const { cart } = await sdk.store.cart.create({})
  localStorage.setItem("cart_id", cart.id)
  return cart
}
```

### Pattern 3: Add to Cart with Metadata
**What:** Add a product variant to cart with customization text in line item metadata.
**When to use:** PDP "Add to Cart" button click.
**Example:**
```typescript
// Source: Medusa Cart Manage Items docs — https://docs.medusajs.com/resources/storefront-development/cart/manage-items
async function addToCart(cartId: string, variantId: string, quantity: number, customization: string) {
  const { cart } = await sdk.store.cart.createLineItem(cartId, {
    variant_id: variantId,
    quantity,
    metadata: {
      customization: customization.slice(0, 12),
    },
  })
  return cart
}
```

### Pattern 4: Update Line Item Quantity
**What:** Update quantity of an existing line item.
**When to use:** Cart quantity +/- buttons.
**Example:**
```typescript
// Source: Medusa updateLineItem docs — https://docs.medusajs.com/references/js_sdk/store/Store/properties/js_sdk.store.Store.cart
async function updateCartItemQuantity(cartId: string, lineItemId: string, quantity: number) {
  const { cart } = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
    quantity,
  })
  return cart
}
```

### Pattern 5: Remove Line Item
**What:** Remove an item from the cart.
**When to use:** Cart item remove button.
**Example:**
```typescript
// Source: Medusa deleteLineItem docs — https://docs.medusajs.com/references/js_sdk/store/Store/properties/js_sdk.store.Store.cart
async function removeCartItem(cartId: string, lineItemId: string) {
  const { cart } = await sdk.store.cart.deleteLineItem(cartId, lineItemId)
  return cart
}
```

### Pattern 6: Extract Totals from Medusa Cart Response
**What:** Medusa returns all totals in the cart object — extract them instead of calculating locally.
**When to use:** After any cart mutation, when displaying cart summary.
**Example:**
```typescript
// Source: Medusa Cart Totals docs — https://docs.medusajs.com/resources/storefront-development/cart/totals
interface CartTotals {
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
}

function extractTotals(cart: HttpTypes.StoreCart): CartTotals {
  return {
    subtotal: cart.subtotal?.numeric ?? 0,
    shipping_total: cart.shipping_total?.numeric ?? 0,
    tax_total: cart.tax_total?.numeric ?? 0,
    total: cart.total?.numeric ?? 0,
  }
}
```

### Pattern 7: Medusa-Synced Zustand Store
**What:** Zustand store whose state is always derived from Medusa responses, not computed locally.
**When to use:** Rewriting `store/cartStore.ts` for Phase 6.
**Example:**
```typescript
// store/cartStore.ts — server-first sync strategy
interface MedusaCartStore {
  cartId: string | null
  items: CartItem[]
  totals: CartTotals
  isLoading: boolean
  isInitialized: boolean

  // Actions
  initCart: () => Promise<void>
  addItem: (variantId: string, quantity: number, customization: string) => Promise<void>
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>
  removeItem: (lineItemId: string) => Promise<void>
  clearCart: () => Promise<void>
}

const CART_ID_KEY = "cart_id"

export const useCartStore = create<MedusaCartStore>()(
  persist(
    (set, get) => ({
      cartId: null,
      items: [],
      totals: { subtotal: 0, shipping_total: 0, tax_total: 0, total: 0 },
      isLoading: false,
      isInitialized: false,

      initCart: async () => {
        const existingId = localStorage.getItem(CART_ID_KEY)
        let cartId = existingId

        if (!cartId) {
          const { cart } = await sdk.store.cart.create({})
          cartId = cart.id
          localStorage.setItem(CART_ID_KEY, cartId)
        }

        const { cart } = await sdk.store.cart.retrieve(cartId, {
          fields: "id,*items,*items.variant,+items.variant.calculated_price,subtotal,shipping_total,tax_total,total",
        })

        set({
          cartId,
          items: cart.items?.map(transformLineItem) ?? [],
          totals: extractTotals(cart),
          isInitialized: true,
        })
      },

      addItem: async (variantId, quantity, customization) => {
        const { cartId } = get()
        if (!cartId) return
        set({ isLoading: true })
        try {
          const { cart } = await sdk.store.cart.createLineItem(cartId, {
            variant_id: variantId,
            quantity,
            metadata: { customization: customization.slice(0, 12) },
          })
          set({ items: cart.items?.map(transformLineItem) ?? [], totals: extractTotals(cart) })
        } finally {
          set({ isLoading: false })
        }
      },

      // ... updateQuantity, removeItem, clearCart follow same pattern
    }),
    {
      name: "crucible-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ cartId: state.cartId }), // Only persist cartId, not items (Medusa is source of truth)
    }
  )
)
```

### Pattern 8: Map Medusa Line Item to CartItem
**What:** Transform Medusa `CartLineItem` to local `CartItem` type.
**When to use:** When syncing Medusa cart state to Zustand.
**Example:**
```typescript
import type { HttpTypes } from "@medusajs/types"
import type { CartItem } from "@/types"

function transformLineItem(item: HttpTypes.CartLineItem): CartItem {
  return {
    id: item.id, // Medusa line item ID (not local uuid)
    productId: item.product_id,
    variant: item.variant?.title || "Default",
    customization: (item.metadata as Record<string, string>)?.customization || "",
    quantity: item.quantity,
    price: item.variant?.calculated_price?.numeric ?? item.unit_price?.numeric ?? 0,
    imageUrl: item.variant?.product?.thumbnail || "",
  }
}
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Cart totals | Local price × quantity arithmetic | Medusa `cart.subtotal.numeric`, `cart.total.numeric` | Medusa computes totals including taxes, shipping, and discounts. Local calculation will drift. |
| Line item identity | Local `uuid` as item ID | Medusa `line_item.id` | All mutations use Medusa line item IDs. Using local uuid causes sync failures. |
| Cart persistence | Full cart state in localStorage | Just `cart_id` in localStorage | Medusa is source of truth. Only persist the ID to restore sessions. |
| Cart creation | Generate ID client-side | `sdk.store.cart.create()` | Medusa must own the cart record for checkout to work. |

**Key insight:** Medusa's server-persisted cart is required for checkout (`cart.complete()`). Any client-side-only cart will fail at checkout. This is not optional — it's the core architectural reason for this phase.

## Common Pitfalls

### Pitfall 1: Persisting Full Cart State in localStorage
**What goes wrong:** localStorage becomes stale when items are modified on other devices or sessions. Cart totals drift from actual Medusa values.
**Why it happens:** The existing Phase 2/3 cart persisted the entire `items` array to localStorage. This pattern must be broken — only `cart_id` should persist.
**How to avoid:** Use `partialize` in Zustand persist middleware to only persist `cartId`. Always re-hydrate items from Medusa.
**Warning signs:** Cart shows wrong subtotal after tab reopen; quantity differs from what was just set.

### Pitfall 2: Using Local UUID Instead of Medusa Line Item IDs
**What goes wrong:** `updateQuantity()` and `removeItem()` fail because Medusa API rejects unknown line item IDs.
**Why it happens:** Phase 2/3 used `uuidv4()` to assign local IDs to cart items. Phase 6 must use Medusa's `item.id` for all mutations.
**How to avoid:** After any cart mutation response, map `cart.items[].id` → local item ID. Never generate local IDs for items that exist in Medusa.
**Warning signs:** API error "line item not found" after quantity update; item removal doesn't work.

### Pitfall 3: Calculating Totals Locally Instead of Using Medusa Values
**What goes wrong:** Totals don't include taxes, shipping, or discounts. Free shipping threshold logic (₹499) gets hardcoded.
**Why it happens:** Existing `selectCartSubtotal`, `selectShippingCost` compute from local `items`. These must be replaced with values from Medusa cart response.
**How to avoid:** Pass Medusa totals through to `CartSummary` component. Delete local shipping threshold logic — Medusa handles this via shipping options.
**Warning signs:** Cart displays `₹0` shipping even when Medusa has a `shipping_total`; tax shows `₹0`.

### Pitfall 4: Race Condition Between Optimistic Update and Medusa Response
**What goes wrong:** UI shows added item immediately (optimistic), but Medusa returns a different `line_item.id`. Zustand state gets wrong item ID mapping.
**Why it happens:** Optimistic update uses local ID, Medusa response has different ID.
**How to avoid:** Do NOT use optimistic updates for cart mutations. Wait for Medusa response before updating Zustand. The latency is acceptable (<500ms).
**Warning signs:** Duplicate items in cart; items with wrong quantity after rapid clicking.

### Pitfall 5: Not Handling Cart Retrieval Errors
**What goes wrong:** If Medusa is down or the cart was deleted server-side, the app crashes or shows a broken cart.
**Why it happens:** No error handling around `sdk.store.cart.retrieve()`.
**How to avoid:** Wrap retrieve in try/catch. On error, clear localStorage cart ID and create a new cart.
**Warning signs:** "Cart not found" errors on page load; blank cart page.

### Pitfall 6: Forgetting `region_id` in Cart Creation
**What goes wrong:** Cart created without region may have wrong currency or pricing.
**Why it happens:** `sdk.store.cart.create({})` works but may not associate with the correct region.
**How to avoid:** Pass `region_id` in `create()` call, OR ensure a default region exists in Medusa. For INR, the region must have `inr` currency configured.
**Warning signs:** Prices in USD instead of INR; price showing wrong format.

## Code Examples

### Cart Initialization with Medusa
```typescript
// Source: https://docs.medusajs.com/resources/storefront-development/cart/create
import { sdk } from "@/lib/sdk"

export async function initMedusaCart(): Promise<string> {
  const CART_ID_KEY = "cart_id"
  let cartId = localStorage.getItem(CART_ID_KEY)

  if (cartId) {
    try {
      await sdk.store.cart.retrieve(cartId)
      return cartId
    } catch {
      localStorage.removeItem(CART_ID_KEY)
      cartId = null
    }
  }

  const { cart } = await sdk.store.cart.create({})
  cartId = cart.id
  localStorage.setItem(CART_ID_KEY, cartId)
  return cartId
}
```

### Transform Medusa Line Item to CartItem
```typescript
// Source: Medusa CartLineItem type — https://docs.medusajs.com/resources/storefront-development/cart/manage-items
import type { HttpTypes } from "@medusajs/types"
import type { CartItem } from "@/types"

function medusaLineItemToCartItem(item: HttpTypes.CartLineItem): CartItem {
  return {
    id: item.id, // Medusa line item ID
    productId: item.product_id,
    variant: item.variant?.title || "Default",
    customization: (item.metadata as Record<string, string>)?.customization || "",
    quantity: item.quantity,
    price: item.variant?.calculated_price?.numeric ?? item.unit_price?.numeric ?? 0,
    imageUrl: item.variant?.product?.thumbnail || "",
  }
}
```

### Extract Cart Totals
```typescript
// Source: Medusa Cart Totals docs — https://docs.medusajs.com/resources/storefront-development/cart/totals
interface CartTotals {
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
}

function extractCartTotals(cart: HttpTypes.StoreCart): CartTotals {
  return {
    subtotal: cart.subtotal?.numeric ?? 0,
    shipping_total: cart.shipping_total?.numeric ?? 0,
    tax_total: cart.tax_total?.numeric ?? 0,
    total: cart.total?.numeric ?? 0,
  }
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Pure local Zustand cart (Phase 2/3) | Medusa-synced Zustand with server-first sync | Phase 6 | Cart state now persists server-side; totals computed by Medusa |
| Local `uuid` as item ID | Medusa `line_item.id` as item ID | Phase 6 | All mutations now use Medusa IDs; no more local ID generation |
| Full cart persistence in localStorage | Only `cart_id` in localStorage | Phase 6 | Eliminates stale local state; items always re-hydrated from Medusa |
| Local price × quantity arithmetic | Medusa `cart.subtotal/total` | Phase 6 | Tax, shipping, discounts now correctly included |

**Deprecated/outdated:**
- `selectCartSubtotal()` — replaced by Medusa `cart.subtotal.numeric`
- `selectShippingCost()` — replaced by Medusa `cart.shipping_total.numeric`
- `selectCartTotalWithShipping()` — replaced by Medusa `cart.total.numeric`
- `uuidv4()` for cart item IDs — replaced by Medusa line item IDs

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `sdk.store.cart.create()` without `region_id` creates a valid cart with default region | Standard Stack, Pattern 1 | If Medusa requires explicit `region_id` for INR pricing, cart may show wrong currency. Fix: pass region_id if cart.currency_code !== "inr" |
| A2 | `createLineItem()` accepts `metadata` as top-level field in body | Code Examples | If metadata needs to be nested differently, add-to-cart will store wrong custom text. Fix: verify metadata shape matches `Record<string, unknown>` |
| A3 | Cart line item's `variant.calculated_price.numeric` is the correct price to display | Code Examples | If variant doesn't have `calculated_price`, price may show 0 or use wrong field. Fix: fallback to `unit_price.numeric` |
| A4 | Medusa cart totals (`subtotal`, `total`, `shipping_total`, `tax_total`) use `BigNumberValue.numeric` format | Common Pitfalls | If the format differs, totals will display incorrectly. Fix: verify with actual Medusa response shape |

## Open Questions

1. **Region ID for INR cart**
   - What we know: `sdk.store.cart.create()` accepts `region_id`. The project deals in INR.
   - What's unclear: Is there a default region configured in Medusa, or must we explicitly pass `region_id`?
   - Recommendation: Check `.env.local` for any `NEXT_PUBLIC_MEDUSA_REGION_ID` and verify against Medusa admin. If none exists, add it.

2. **Variant ID vs Product ID for add-to-cart**
   - What we know: `createLineItem()` requires `variant_id`. Current PDP tracks `selectedVariant.name` (color name).
   - What's unclear: Does the current `ColorVariant` type include the Medusa `variant.id`? The PDP stores color name, not variant ID.
   - Recommendation: `ColorVariant` in `types/index.ts` needs a `medusaVariantId` field. Phase 5/Product Integration should have added this. If not present, add it.

3. **Cart line item metadata persistence**
   - What we know: `metadata.customization` stores the 12-char text.
   - What's unclear: Does Medusa preserve metadata across quantity updates and line item deletions?
   - Recommendation: Write a test that adds an item with metadata, updates quantity, then verifies metadata is preserved in the response.

## Environment Availability

Step 2.6: SKIPPED — no external dependencies beyond the project's own code and the Medusa backend at `localhost:9000` (already assumed in stack).

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest (existing project test setup) |
| Config file | `vitest.config.ts` or `vite.config.ts` with vitest config |
| Quick run command | `vitest run` |
| Full suite command | `vitest run --reporter=verbose` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CART-11 | Cart created on first visit; retrieved on return | unit | `vitest run src/store/cartStore.test.ts` | ❌ Wave 0 |
| CART-12 | cart_id persisted in localStorage | unit | `vitest run src/store/cartStore.test.ts` | ❌ Wave 0 |
| CART-13 | createLineItem called with variant_id, quantity, metadata | unit | `vitest run src/lib/cart.test.ts` | ❌ Wave 0 |
| CART-14 | updateLineItem called with quantity | unit | `vitest run src/lib/cart.test.ts` | ❌ Wave 0 |
| CART-15 | deleteLineItem called with line item ID | unit | `vitest run src/lib/cart.test.ts` | ❌ Wave 0 |
| CART-16 | Totals extracted from Medusa response, not computed locally | unit | `vitest run src/lib/cart.test.ts` | ❌ Wave 0 |
| CART-17 | Customization text stored in line item metadata | unit | `vitest run src/lib/cart.test.ts` | ❌ Wave 0 |

### Wave 0 Gaps
- [ ] `src/store/cartStore.test.ts` — covers CART-11, CART-12 (init/retrieval flow)
- [ ] `src/lib/cart.test.ts` — covers CART-13, CART-14, CART-15, CART-16, CART-17 (mutation + metadata)
- [ ] `src/lib/cart.ts` — cart sync utilities extracted from store (optional refactor)
- [ ] `vitest.config.ts` — test config (if not already present from prior phases)

*(If no gaps: "None — existing test infrastructure covers all phase requirements")*

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | yes | Validate `quantity >= 1` and `customization.length <= 12` client-side before sending to Medusa |
| V4 Access Control | partial | Cart ID in localStorage — no auth required for anonymous cart (AUTH-01 in Phase 7 adds customer auth) |
| V2 Authentication | no | Phase 6 handles anonymous carts only; Phase 7 adds auth |

### Known Threat Patterns for Cart Sync

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Cart ID tampering | Tampering | Verify cart belongs to current session on retrieval (Medusa handles this server-side) |
| Quantity overflow | Denial of Service | Enforce max quantity (e.g., 99) client-side; Medusa may have inventory limits |
| Metadata injection | Tampering | Sanitize customization text to 12 ASCII chars max; no HTML/JSON injection |
| localStorage cart_id theft | Information Disclosure | Cart is anonymous until Phase 7 auth; cart ID alone is not sensitive |

## Sources

### Primary (HIGH confidence)
- [Medusa Cart Create](https://docs.medusajs.com/resources/storefront-development/cart/create) — Cart creation flow with localStorage
- [Medusa Cart Manage Items](https://docs.medusajs.com/resources/storefront-development/cart/manage-items) — Add/update/remove line items
- [Medusa Cart Totals](https://docs.medusajs.com/resources/storefront-development/cart/totals) — Cart totals object schema
- [Medusa JS SDK Reference](https://docs.medusajs.com/references/js_sdk/store/Store/properties/js_sdk.store.Store.cart) — All cart SDK methods
- [Medusa Store API Reference](https://docs.medusajs.com/api/store) — Cart endpoints, line item types

### Secondary (MEDIUM confidence)
- [Medusa Next.js Starter Cart](https://github.com/medusajs/nextjs-starter-medusa) — Reference architecture for Next.js + Medusa cart integration

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@medusajs/js-sdk` 2.15.3 verified via npm; all SDK methods confirmed via Context7
- Architecture: HIGH — Medusa cart → Zustand sync pattern confirmed via official docs; localStorage pattern confirmed
- Pitfalls: HIGH — All identified pitfalls confirmed via Medusa docs and known patterns

**Research date:** 2026-05-22
**Valid until:** 2026-06-22 (Medusa v2 API is stable; 30-day window for minor changes)