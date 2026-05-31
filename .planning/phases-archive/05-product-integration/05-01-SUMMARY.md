# Phase 5 Plan 01: Product Integration - Medusa API

**Plan:** 05-01
**Phase:** 05-product-integration
**Status:** ✅ Complete

## One-liner

Replaced mock product data in `lib/data/products.ts` with Medusa SDK calls — shop page is now a Server Component that fetches from `sdk.store.product.list()`, with a Client Component for filter UI.

---

## What was done

### Tasks Executed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Replace `lib/data/products.ts` mock with Medusa API | `dca236e` | lib/data/products.ts |
| 2 | Transform `app/shop/page.tsx` to Server Component | `58225eb` | app/shop/page.tsx |
| 3 | Create `app/shop/ShopClient.tsx` with filter UI | `3446bd6` | app/shop/ShopClient.tsx, components/shop/ShopProductCard.tsx, components/shop/ProductGrid.tsx |

---

## Key Changes

### `lib/data/products.ts` — Replaced with Medusa SDK
- `getProducts()` → calls `sdk.store.product.list({ limit: 100, fields: "*variants.calculated_price,+variants.inventory_quantity" })`
- `getProductById(id)` → calls `sdk.store.product.retrieve(id, { fields: "..." })`
- `getFeaturedProducts()` → filters from all products via tag
- `transformProduct()` maps `HttpTypes.StoreProduct` to internal `Product` type
- No mock data, no `picsum.photos` URLs

### `app/shop/page.tsx` — Server Component
- Removed `"use client"` directive
- Removed `useState`, `useMemo` imports
- Async `ShopPage()` fetches from `getProducts()` (Medusa)
- Renders `<ShopClient initialProducts={products} />`
- No inline filtering logic

### `app/shop/ShopClient.tsx` — New Client Component
- `"use client"` with filter state (search, edition, color, sortBy)
- `useMemo` filtering on `initialProducts` using Medusa fields (`title`, `description`, `collection.title`, `variants`)
- Renders `<FilterBar>` and `<ProductGrid>`

### Component Updates (for Medusa types)
- `components/shop/ProductGrid.tsx` → uses `HttpTypes.StoreProduct[]`
- `components/shop/ShopProductCard.tsx` → uses `HttpTypes.StoreProduct`, `formatPrice()` for paise conversion

---

## Verification

| Check | Result |
|-------|--------|
| `picsum.photos` in products.ts | 0 (PASS) |
| `use client` in page.tsx | Not found (PASS — Server Component) |
| `ShopClient.tsx` exists with `"use client"` | Found (PASS) |
| `sdk.store.product` in products.ts | 2 calls (PASS) |

---

## PROD Coverage

| Requirement | Implementation |
|-------------|----------------|
| PROD-01 | `lib/data/products.ts` now uses `sdk.store.product.list()` / `retrieve()` |
| PROD-02 | Shop page is async Server Component with pagination support via SDK |
| PROD-05 | Product images from Medusa Media URLs (`product.thumbnail`, `product.images[0].url`) with `/placeholder-product.png` fallback |

---

## Decisions Made

1. **Medusa types used throughout** — `HttpTypes.StoreProduct` flows through `ProductGrid` → `ShopProductCard` instead of internal `Product` type. This avoids transform layers and keeps type consistency with the SDK.

2. **Edition from collection/tags** — Filter logic checks `product.collection.title` and `product.tags` for "pro" / "limited" markers rather than a dedicated field.

3. **Color hex mapping** — Derived from variant title via simple string matching. Not from Medusa attributes — keeps it simple.

4. **`formatPrice()` for price display** — All price displays use the existing utility to convert paise → INR display (`₹449`).

---

## Deviations from Plan

- **ShopProductCard and ProductGrid updated to use Medusa types** — Plan mentioned these as "receives products prop" but didn't specify internal type updates. Done to avoid type mismatches when `ShopClient` passes Medusa products.

---

## Files Created/Modified

| File | Change |
|------|--------|
| `lib/data/products.ts` | Replaced mock with SDK calls |
| `app/shop/page.tsx` | Converted to async Server Component |
| `app/shop/ShopClient.tsx` | Created — filter UI client component |
| `components/shop/ProductGrid.tsx` | Updated for Medusa types |
| `components/shop/ShopProductCard.tsx` | Updated for Medusa types + formatPrice |

---

## Commits

- `dca236e` — feat(05-01): replace mock product data with Medusa SDK calls
- `58225eb` — feat(05-01): transform shop page to Server Component
- `3446bd6` — feat(05-01): create ShopClient with filter UI and update components for Medusa types

**Duration:** ~10 minutes
**Completed:** 2026-05-22T06:35:05Z