# Phase 5: Product Integration - Research

**Researched:** 2026-05-22
**Domain:** MedusaJS Product API integration (list, retrieve, variants, inventory, images)
**Confidence:** HIGH

## Summary

Phase 5 replaces mock product data in `lib/data/products.ts` with live MedusaJS API calls. The shop page (`app/shop/page.tsx`) currently imports static mock data and filters client-side — it needs to fetch from `sdk.store.product.list()` with pagination. The PDP (`app/product/[id]/page.tsx`) currently uses `getProductById()` from mock data — it needs to use `sdk.store.product.retrieve(id)` with SSR via `generateMetadata` as per D-01. Product images must come from Medusa's Media module. Variant selection must use Medusa's variant data with inventory quantities.

**Primary recommendation:** Transform `app/shop/page.tsx` into a Server Component that fetches products with pagination, then passes data to a Client Component for filtering/sorting. Transform `app/product/[id]/page.tsx` into a Server Component with `generateMetadata`, fetching product via `sdk.store.product.retrieve(id)` with `fields: "*variants.calculated_price,+variants.inventory_quantity"`.

## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Use SSR with `generateMetadata` for PDP — Server Component fetches product data, generates SEO-friendly metadata (title, description, og:image), and renders full page server-side. Client Components used only for interactive elements (variant selector, quantity, add-to-cart).

### the agent's Discretion
- Fetch strategy for product list page (SSR or client-side with SWR pattern)
- Image fallback behavior when Medusa returns no images
- Loading skeleton design for product list
- Error boundary design for failed product fetches
- Whether to use `generateStaticParams` for PDP paths (depends on product count stability)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within Phase 5 scope.

## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PROD-01 | Replace lib/data/products.ts mock with Medusa product API calls | `lib/data/products.ts` → `sdk.store.product.list()` / `retrieve()` |
| PROD-02 | Product list page fetches from Medusa with pagination | `sdk.store.product.list({ limit, offset })` pattern |
| PROD-03 | PDP fetches product details from Medusa API | `sdk.store.product.retrieve(id)` with `generateMetadata` |
| PROD-04 | Variant selection uses Medusa variant data with inventory quantities | `fields: "*variants.calculated_price,+variants.inventory_quantity"` |
| PROD-05 | Product images served from Medusa Media module | `product.images[].url` from Medusa Media |

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Product list data fetch | API / Backend | — | SDK calls to Medusa backend |
| Product list filtering/sorting | Browser / Client | — | Client-side after data fetch |
| PDP data fetch + metadata | Frontend Server (SSR) | — | `generateMetadata` requires Server Component |
| PDP interactive elements | Browser / Client | — | Variant selector, quantity, add-to-cart |
| Image serving | CDN / Static | — | Medusa Media module URLs |
| Variant selection logic | Browser / Client | — | Option matching against Medusa variants |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@medusajs/js-sdk` | 2.15.3 | Product API calls | Official Medusa storefront SDK |
| `@medusajs/types` | 2.15.3 | TypeScript types | `HttpTypes.StoreProduct`, `HttpTypes.StoreProductVariant` |
| `lib/sdk.ts` | — | SDK singleton | Already configured with JWT auth, auth is per D-02 |
| `lib/utils/formatPrice.ts` | — | Price formatting | Already exists, converts paise → INR display |

**Version verification:** `@medusajs/js-sdk` 2.15.3, `@medusajs/types` 2.15.3 — verified via `npm view @medusajs/js-sdk version` on 2026-05-22

### No New Packages Required
Phase 5 only replaces data fetching — no new libraries needed. Existing SDK, types, and utilities cover all requirements.

### Installation
No additional installation needed — Phase 4 already installed `@medusajs/js-sdk` and `@medusajs/types`.

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BROWSER / CLIENT                            │
├─────────────────────────────────────────────────────────────────────┤
│  Shop Page (Client Component)                                       │
│  └── FilterBar (interactive) + ProductGrid (display)                │
│      │                                                               │
│      │ receives: Product[] (from server)                           │
│      │ fetches: filter/sort state (no API calls)                   │
│                                                                     │
│  PDP (Server Component with generateMetadata)                       │
│  └── fetches product + metadata server-side                         │
│      │                                                            │
│      └── VariantSelector (Client) │ AddToCartSection (Client)       │
└─────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      MEDUSA BACKEND (localhost:9000)                 │
├─────────────────────────────────────────────────────────────────────┤
│  sdk.store.product.list({ limit, offset, fields })                  │
│  sdk.store.product.retrieve(id, { fields })                         │
│  Product Media module (images[].url)                                │
│  Inventory module (inventory_quantity per variant)                 │
└─────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
lib/
├── data/
│   └── products.ts       # REPLACE: mock → Medusa API calls
├── sdk.ts                # EXISTS: SDK singleton
└── utils/
    └── formatPrice.ts    # EXISTS: paise → INR conversion

app/
├── shop/
│   └── page.tsx          # MODIFY: static mock → fetch from Medusa
├── product/
│   └── [id]/
│       └── page.tsx     # MODIFY: getProductById() → sdk.retrieve()
```

### Pattern 1: Product List Fetch with Server Component
**What:** Transform shop page into Server Component that fetches from Medusa, pass to Client Component for filtering.
**When to use:** PROD-02 (pagination-enabled product list)

```tsx
// app/shop/page.tsx — Server Component (data fetching)
import { sdk } from "@/lib/sdk"
import { HttpTypes } from "@medusajs/types"
import { ShopClient } from "./ShopClient" // Client Component for filter UI

export default async function ShopPage() {
  const { products, count } = await sdk.store.product.list({
    limit: 12,
    offset: 0,
    fields: "*variants.calculated_price,+variants.inventory_quantity",
  })

  return <ShopClient initialProducts={products} totalCount={count} />
}

// app/shop/ShopClient.tsx — Client Component (filter UI)
"use client"
import { useState, useMemo } from "react"
import { ProductGrid } from "@/components/shop/ProductGrid"
import { FilterBar } from "@/components/shop/FilterBar"
import type { HttpTypes } from "@medusajs/types"

export function ShopClient({
  initialProducts,
  totalCount,
}: {
  initialProducts: HttpTypes.StoreProduct[]
  totalCount: number
}) {
  const [products] = useState(initialProducts)
  // ... filtering logic unchanged since structure matches Medusa schema
}
```

**Source:** [Medusa List Products](https://docs.medusajs.com/resources/storefront-development/products/list) — verified via official docs

### Pattern 2: PDP with generateMetadata (SSR)
**What:** Server Component fetches product and generates SEO metadata.
**When to use:** PROD-03 + D-01 (PDP with SSR)

```tsx
// app/product/[id]/page.tsx — Server Component with generateMetadata
import { sdk } from "@/lib/sdk"
import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { ProductDetailClient } from "./ProductDetailClient"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  try {
    const { product } = await sdk.store.product.retrieve(id)
    return {
      title: product.title,
      description: product.description,
      openGraph: {
        title: product.title,
        description: product.description,
        images: product.images?.[0] ? [{ url: product.images[0].url }] : [],
      },
    }
  } catch {
    return { title: "Product Not Found" }
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  try {
    const { product } = await sdk.store.product.retrieve(id, {
      fields: "*variants.calculated_price,+variants.inventory_quantity",
    })
    return <ProductDetailClient product={product} />
  } catch {
    notFound()
  }
}
```

**Source:** [Medusa Retrieve Product](https://docs.medusajs.com/resources/storefront-development/products/retrieve) — verified via official docs

### Pattern 3: Variant Selection with Inventory
**What:** Match selected option values to Medusa variant, display inventory status.
**When to use:** PROD-04 (variant selection with inventory)

```tsx
// Inside ProductDetailClient (Client Component)
const selectedVariant = useMemo(() => {
  if (
    !product?.variants ||
    !product.options ||
    Object.keys(selectedOptions).length !== product.options?.length
  ) {
    return undefined
  }

  return product.variants.find((variant) =>
    variant.options?.every(
      (optionValue) => optionValue.value === selectedOptions[optionValue.option_id!]
    )
  )
}, [selectedOptions, product])

const isInStock =
  selectedVariant?.manage_inventory === false ||
  (selectedVariant?.inventory_quantity || 0) > 0
```

**Source:** [Medusa Variant Selection](https://docs.medusajs.com/resources/storefront-development/products/variants) + [Medusa Inventory](https://docs.medusajs.com/resources/storefront-development/products/inventory) — verified via official docs

### Pattern 4: Image Fallback Behavior
**What:** Handle products with no images from Medusa.
**When to use:** Agent discretion — image fallback

```tsx
// In ProductGallery / image display
const imageUrl = product.images?.[0]?.url || "/placeholder-product.png"

// For listing grid, could use:
// const thumbnail = product.thumbnail || product.images?.[0]?.url || "/placeholder.png"
```

### Anti-Patterns to Avoid

- **Don't use mock data in production:** `lib/data/products.ts` mock must be replaced entirely — no dual-mode (mock + live)
- **Don't fetch product list client-side for initial render:** Use Server Component for SEO and first-paint performance
- **Don't forget `fields` parameter for inventory:** Without `+variants.inventory_quantity`, inventory_quantity is not returned
- **Don't use `getProductById` pattern on PDP:** `sdk.store.product.retrieve(id)` is the correct API — not `list()` with filter

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Product API calls | Custom fetch wrapper | `sdk.store.product.list/retrieve` | Official SDK handles auth, CORS, error handling |
| Variant matching | Custom option-to-variant matching | Medusa's `variant.options` + `option_id` | SDK returns full variant structure |
| Inventory check | Manual inventory API call | `+variants.inventory_quantity` in fields | Built into product retrieve/list |
| Image URLs | Custom CDN logic | Medusa Media module URLs | `product.images[].url` is canonical |

**Key insight:** The MedusaJS SDK is the official, supported way to interact with the Store API. Hand-rolling fetch calls bypasses SDK features like automatic auth token handling, CORS configuration, and error normalization.

## Runtime State Inventory

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — products are Medusa master data, not stored in frontend | None |
| Live service config | None — no external services configured for products | None |
| OS-registered state | None — no OS-level registrations | None |
| Secrets/env vars | None — `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` already set in .env.local | None |
| Build artifacts | None — only code changes | None |

**Nothing found in category:** Verified by grep audit — no runtime state depends on product data strings.

## Common Pitfalls

### Pitfall 1: Forgetting `fields` Parameter for Inventory
**What goes wrong:** `inventory_quantity` returns `null` or undefined even when inventory exists.
**Why it happens:** Medusa only returns fields explicitly requested in `fields` parameter. Without `+variants.inventory_quantity`, the field is omitted.
**How to avoid:** Always include `+variants.inventory_quantity` in `fields` when inventory display is needed:
```tsx
sdk.store.product.retrieve(id, {
  fields: "*variants.calculated_price,+variants.inventory_quantity",
})
```
**Warning signs:** `selectedVariant.inventory_quantity` is `null` when it should have a value.

### Pitfall 2: PDP is Client Component with `generateMetadata`
**What goes wrong:** Attempting to export `generateMetadata` from a `"use client"` component causes build error.
**Why it happens:** `generateMetadata` is a Server Components feature — cannot be used in Client Components.
**How to avoid:** Keep data-fetching component as Server Component; extract only interactive elements (VariantSelector, AddToCartSection) to Client Components.
**Warning signs:** Build error "generateMetadata is not supported in Client Components".

### Pitfall 3: Price Display Without formatPrice
**What goes wrong:** Prices show as raw paise (e.g., `44900` instead of `₹449.00`).
**Why it happens:** Medusa returns prices in smallest unit (paise). The mock data was already in display format.
**How to avoid:** Use existing `formatPrice()` utility from `lib/utils/formatPrice.ts` on all price displays from Medusa data. Do not assume Medusa prices are in display format.
**Warning signs:** Prices like `44900` appearing in UI.

### Pitfall 4: Wrong Product ID Field
**What goes wrong:** Product lookup fails with 404.
**Why it happens:** Medusa uses `id` (e.g., `prod_123`) but mock data used `id` fields. Checking wrong field or using handle-based lookup instead of ID.
**How to avoid:** Use `sdk.store.product.retrieve(id)` with the actual Medusa product ID. If using handle, use `sdk.store.product.list({ handle: "my-product" })`.
**Warning signs:** `notFound()` being triggered on valid product IDs.

### Pitfall 5: Missing Loading/Error States for Product Fetch
**What goes wrong:** Page flashes empty or shows error without user-friendly loading indicator.
**Why it happens:** Server Component fetches without Suspense boundaries or error boundaries.
**How to avoid:** Wrap product fetch in ` Suspense` with fallback, or implement `error.tsx` in the route segment.
**Warning signs:** White flash on navigation, console errors for failed fetches.

## Code Examples

Verified patterns from official sources:

### Product List Fetch (Server Component)
```tsx
// Source: https://docs.medusajs.com/resources/storefront-development/products/list
const { products, count } = await sdk.store.product.list({
  limit: 12,
  offset: 0,
  fields: "*variants.calculated_price,+variants.inventory_quantity",
})
```

### Product Retrieve with Inventory
```tsx
// Source: https://docs.medusajs.com/resources/storefront-development/products/retrieve
const { product } = await sdk.store.product.retrieve(id, {
  fields: "*variants.calculated_price,+variants.inventory_quantity",
})
```

### Variant Selection Logic
```tsx
// Source: https://docs.medusajs.com/resources/storefront-development/products/variants
const selectedVariant = product.variants.find((variant) =>
  variant.options?.every(
    (optionValue) => optionValue.value === selectedOptions[optionValue.option_id!]
  )
)
```

### Inventory Check
```tsx
// Source: https://docs.medusajs.com/resources/storefront-development/products/inventory
const isInStock =
  selectedVariant?.manage_inventory === false ||
  (selectedVariant?.inventory_quantity || 0) > 0
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Mock static product array | `sdk.store.product.list()` API call | Phase 5 | Live data, inventory-aware |
| Client-side `getProductById()` | Server Component `sdk.store.product.retrieve()` + `generateMetadata` | Phase 5 | SEO-friendly, SSR |
| Static color array | Medusa `options` + `variants` | Phase 5 | Inventory-quantity aware |
| `picsum.photos` placeholder images | Medusa Media module URLs | Phase 5 | Live product photography |

**Deprecated/outdated:**
- `lib/data/products.ts` mock array — replaced by Medusa API calls
- Client-side product fetching for initial render — replaced by Server Component

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Medusa backend is running at `http://localhost:9000` | All API calls | Phase blocks — verify backend is running before execution |
| A2 | `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` is valid and has product read access | All API calls | Empty results returned — need valid key |
| A3 | Products have been created in Medusa admin | Data layer | No products to display — Medusa needs seeded data |
| A4 | Product `id` in Medusa matches what `app/product/[id]/page.tsx` expects | PDP routing | 404 on product pages — may need handle-based routing |
| A5 | Medusa Media module is configured and products have images | PROD-05 | Fallback placeholder will be used |

## Open Questions

1. **Product ID format:** Is the Medusa product ID the same format as the existing mock IDs (`prod_01keychain_phone_stand`)? If not, the routing in `app/product/[id]/page.tsx` may need adjustment.
   - What we know: PDP uses `params.id` directly as product ID
   - What's unclear: Whether Medusa product IDs match mock ID format
   - Recommendation: Verify ID format when Medusa is running; if different, may need to use handle-based routing

2. **Product count stability:** Should `generateStaticParams` be used for PDP paths?
   - What we know: D-01 mentions this is agent discretion, depends on product count stability
   - What's unclear: How often do products change? Is ISR more appropriate?
   - Recommendation: Start without `generateStaticParams` (ISR via `revalidate`), add if SEO performance requires

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| `@medusajs/js-sdk` | All product API calls | ✓ | 2.15.3 | — |
| `@medusajs/types` | TypeScript types | ✓ | 2.15.3 | — |
| `lib/sdk.ts` | SDK singleton | ✓ | — | — |
| `lib/utils/formatPrice.ts` | Price display | ✓ | — | — |
| Medusa backend | Product data | ? | — | Will fail with 404/empty — need to verify backend running |

**Missing dependencies with no fallback:**
- Medusa backend at `localhost:9000` — if not running, product pages show loading/error state. Must verify backend is running before Phase 5 execution.

**Missing dependencies with fallback:**
- None identified — all required packages already installed.

## Validation Architecture

> Skipped — `workflow.nyquist_validation` is explicitly `false` in `.planning/config.json`

## Security Domain

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V5 Input Validation | yes | Sanitize product IDs before API calls — `encodeURIComponent(id)` |
| V4 Access Control | no | Product listing is public — no auth required |
| V2 Authentication | no | Not in scope for Phase 5 (Phase 7) |

### Known Threat Patterns for Medusa Product API

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Product ID injection | Tampering | Use parameterized SDK calls, not string interpolation |
| Large offset/limit DoS | Denial | Set reasonable limits (max 100 per page) |
| Sensitive data exposure | Information Disclosure | Products are public storefront data — no sensitive fields |

## Sources

### Primary (HIGH confidence)
- [Medusa List Products](https://docs.medusajs.com/resources/storefront-development/products/list) — Verified via Firecrawl scrape on 2026-05-22
- [Medusa Retrieve Product](https://docs.medusajs.com/resources/storefront-development/products/retrieve) — Verified via Firecrawl scrape on 2026-05-22
- [Medusa Variant Selection](https://docs.medusajs.com/resources/storefront-development/products/variants) — Verified via Firecrawl scrape on 2026-05-22
- [Medusa Inventory](https://docs.medusajs.com/resources/storefront-development/products/inventory) — Verified via Firecrawl scrape on 2026-05-22

### Secondary (MEDIUM confidence)
- [Medusa v2 Store API Reference](https://docs.medusajs.com/api/store) — API structure confirmed
- `.planning/research/STACK.md` — SDK installation and configuration patterns

### Tertiary (LOW confidence)
- `.planning/research/PITFALLS.md` — Community-validated patterns, not all official docs

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — `@medusajs/js-sdk` 2.15.3 verified via npm registry
- Architecture: HIGH — SSR patterns confirmed via official Medusa docs
- Pitfalls: MEDIUM-HIGH — Mix of official docs and community-validated patterns

**Research date:** 2026-05-22
**Valid until:** 2026-06-22 (30 days — Medusa v2 API is stable, SDK changes infrequent)