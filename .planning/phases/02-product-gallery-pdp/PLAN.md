---
phase: "02-product-gallery-pdp"
plan: "MASTER"
type: "execute"
wave: "0"
depends_on: []
files_modified: []
autonomous: false
requirements: ["GALL-01", "GALL-02", "GALL-03", "GALL-04", "PDP-01", "PDP-02", "PDP-03", "PDP-04", "PDP-05", "PDP-06", "PDP-07", "PDP-08", "PDP-09", "PDP-10", "PDP-11", "PDP-12", "ARCH-02", "ARCH-03", "ARCH-04"]
must_haves:
  truths:
    - "User can browse all products in a grid layout"
    - "User can filter products by Edition and Color"
    - "User can search and sort products"
    - "User can quick-add a product to cart from the gallery"
    - "User can view full product details on PDP"
    - "User can select a color variant on PDP"
    - "User can enter custom text (max 12 chars) on PDP"
    - "User can add product with variant, customization, and quantity to cart"
  artifacts:
    - path: "store/cartStore.ts"
      provides: "Zustand cart state with persistence"
      min_lines: 50
    - path: "lib/data/products.ts"
      provides: "Product data access layer"
      exports: ["products", "getProductById"]
    - path: "app/shop/page.tsx"
      provides: "Product gallery route at /shop"
    - path: "app/product/[id]/page.tsx"
      provides: "Product detail page route at /product/:id"
    - path: "components/shop/ProductGrid.tsx"
      provides: "Gallery grid container with filter integration"
    - path: "components/product/ProductGallery.tsx"
      provides: "PDP image gallery with thumbnails"
    - path: "components/product/AddToCartSection.tsx"
      provides: "Quantity selector and cart submission"
  key_links:
    - from: "components/shop/ProductGrid.tsx"
      to: "lib/data/products.ts"
      via: "import products, getProductById"
    - from: "app/shop/page.tsx"
      to: "components/shop/ProductGrid.tsx"
      via: "render ProductGrid"
    - from: "app/product/[id]/page.tsx"
      to: "store/cartStore.ts"
      via: "useCartStore hook"
    - from: "components/product/AddToCartSection.tsx"
      to: "store/cartStore.ts"
      via: "addItem action"
---

<objective>
Build the complete Phase 2 scope: product gallery with filtering/search/sort, product detail page with variant selection and 12-char customization input, and Zustand cart store with quick-add integration from gallery.

Purpose: Enable product browsing, selection, customization, and cart addition.
Output: 4 PLAN files across 3 waves covering Foundation → Gallery + PDP → Integration.
</objective>

<dependency_graph>

## Task Dependency Graph

```
Wave 1 (Foundation — runs first, no dependencies)
├── T1.1: Define type definitions (ColorVariant, Product, CartItem)
├── T1.2: Create Zustand cart store (cartStore.ts)
└── T1.3: Create product data access (products.ts, getProductById)

Wave 2 (Gallery + PDP — parallel, depends on Wave 1)
├── T2.1 Gallery: Create ProductGrid + FilterBar + ShopProductCard + /shop route
└── T2.2 PDP: Create ProductGallery + ProductInfo + VariantSelector + CustomizationInput + AddToCartSection + /product/[id] route

Wave 3 (Integration — depends on Wave 2)
└── T3.1: Wire quick-add from ShopProductCard → cartStore, wire full PDP → cartStore
```

## File Ownership (no overlap per wave)

| Plan | Files Modified | Wave |
|------|----------------|------|
| 02-01 | `lib/data/products.ts`, `store/cartStore.ts`, `types/` | 1 |
| 02-02 | `components/shop/*.tsx`, `app/shop/page.tsx` | 2 |
| 02-03 | `components/product/*.tsx`, `app/product/[id]/page.tsx` | 2 |
| 02-04 | `components/shop/ShopProductCard.tsx`, `components/product/AddToCartSection.tsx` | 3 |

## Why Parallelization Works
- 02-02 (Gallery) and 02-03 (PDP) touch disjoint file sets — zero overlap
- Both depend only on types/services from 02-01 (Wave 1)
- 02-04 (Integration) touches files modified by 02-02 and 02-03 → runs last

</dependency_graph>

<wave_structure>

## Wave Structure

| Wave | Plans | Autonomous | Files Touched |
|------|-------|------------|---------------|
| 1 | 02-01-PLAN.md (Foundation) | yes | 3 files in `lib/`, `store/`, `types/` |
| 2 | 02-02-PLAN.md (Gallery), 02-03-PLAN.md (PDP) | yes | 6 files, 2 routes |
| 3 | 02-04-PLAN.md (Integration) | yes | 2 component files |

**Parallel execution:** Wave 2's two plans (Gallery + PDP) can run in parallel — they touch completely different files and both depend only on Wave 1 outputs.

</wave_structure>

<source_coverage>

## Source → Plan Coverage Audit

### From ROADMAP.md (Phase 2 Success Criteria)

| # | Criterion | Plan |
|---|-----------|------|
| 1 | Product gallery page with grid layout and variant cards | 02-02 |
| 2 | Filter by Edition/Color working | 02-02 |
| 3 | Quick add to cart from gallery | 02-04 |
| 4 | Search and sort functionality | 02-02 |
| 5 | PDP with two-column layout (image gallery left, details right) | 02-03 |
| 6 | Sticky product details panel | 02-03 |
| 7 | Variant selector with color swatches | 02-03 |
| 8 | Customization input with 12-char limit and live counter | 02-03 |
| 9 | Quantity selector and Add to Cart button | 02-03 |
| 10 | Product description, specs, shipping info displayed | 02-03 |

### From ROADMAP.md (Phase 2 Requirements)

| ID | Requirement | Plan |
|----|-------------|------|
| GALL-01 | Product grid layout | 02-02 |
| GALL-02 | Filter by Edition/Color | 02-02 |
| GALL-03 | Quick add to cart | 02-04 |
| GALL-04 | Search and sort | 02-02 |
| PDP-01 | PDP route /product/[id] | 02-03 |
| PDP-02 | Image gallery with thumbnails | 02-03 |
| PDP-03 | Variant selector (color swatches) | 02-03 |
| PDP-04 | Customization input (12-char max) | 02-03 |
| PDP-05 | Live character counter | 02-03 |
| PDP-06 | Quantity selector | 02-03 |
| PDP-07 | Add to Cart button | 02-03 |
| PDP-08 | Product description | 02-03 |
| PDP-09 | Product specs | 02-03 |
| PDP-10 | Shipping info | 02-03 |
| PDP-11 | Sticky product details panel | 02-03 |
| PDP-12 | Read-only customization in cart | 02-04 (Phase 3 scope) |
| ARCH-02 | Zustand cart store | 02-01 |
| ARCH-03 | Product data access layer | 02-01 |
| ARCH-04 | URL search params for filter state | 02-02 |

**All 18 requirements covered. No gaps.**

</source_coverage>

<verification>
1. `grep -r "useCartStore" components/ --include="*.tsx"` — cart store consumed
2. `grep -r "addItem\|removeItem\|updateQuantity" store/cartStore.ts` — actions defined
3. `ls app/shop/page.tsx app/product/[id]/page.tsx` — routes exist
4. `grep -c "12" components/product/CustomizationInput.tsx` — character limit enforced
5. `grep "localStorage" store/cartStore.ts` — persistence configured
</verification>

<success_criteria>
Phase complete when:
- [ ] `/shop` renders product grid with all variants visible
- [ ] Filter pills (Edition: Standard/Pro/Limited) and color swatches filter the grid
- [ ] Search input debounces 300ms and filters by title/variant/description
- [ ] Sort dropdown changes grid order (Featured/Price Low-High/High-Low/Newest)
- [ ] Hover on ShopProductCard reveals "Quick Add" button → adds to cart
- [ ] `/product/[id]` renders two-column layout (60% gallery / 40% sticky info)
- [ ] VariantSelector shows color swatches with checkmark on selected
- [ ] CustomizationInput limits to 12 chars with live "N/12" counter
- [ ] AddToCartSection submits to Zustand store with productId, variant, customization, quantity
- [ ] Cart slide-over (navbar icon) shows added items with correct details
</success_criteria>

<output>
After all 4 plans complete, create `.planning/phases/02-product-gallery-pdp/02-SUMMARY.md` synthesizing all plan summaries.
</output>

---

## PLAN FILES TO CREATE

| File | Wave | Contents |
|------|------|----------|
| `02-01-PLAN.md` | 1 | Foundation: types, cart store, product data |
| `02-02-PLAN.md` | 2 | Gallery: shop page, ProductGrid, FilterBar, search, sort |
| `02-03-PLAN.md` | 2 | PDP: image gallery, ProductInfo, variants, customization |
| `02-04-PLAN.md` | 3 | Integration: quick-add wiring, cart store connection |