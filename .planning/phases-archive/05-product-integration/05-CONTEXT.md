# Phase 5: Product Integration - Context

**Gathered:** 2026-05-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace mock product data in `lib/data/products.ts` with live Medusa product API calls. The product listing page fetches from `sdk.store.product.list()` with pagination. The PDP fetches via `sdk.store.product.retrieve(id)` with variants and inventory. Product images load from Medusa Media module URLs. No UI changes — only data layer replacement.

</domain>

<decisions>
## Implementation Decisions

### PDP Fetch Strategy
- **D-01:** Use SSR with `generateMetadata` for PDP — Server Component fetches product data, generates SEO-friendly metadata (title, description, og:image), and renders full page server-side. Client Components used only for interactive elements (variant selector, quantity, add-to-cart).

### the agent's Discretion
- Fetch strategy for product list page (SSR or client-side with SWR pattern)
- Image fallback behavior when Medusa returns no images
- Loading skeleton design for product list
- Error boundary design for failed product fetches
- Whether to use `generateStaticParams` for PDP paths (depends on product count stability)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project
- `.planning/PROJECT.md` — Project context, constraints, design tokens
- `.planning/ROADMAP.md` — Phase 5 goal and success criteria
- `.planning/REQUIREMENTS.md` — PROD-01 through PROD-05 requirements

### Prior Phase Context
- `.planning/phases/04-sdk-foundation/04-CONTEXT.md` — SDK file naming (lib/sdk.ts), singleton approach, auth config

### Research & Stack
- `.planning/research/SUMMARY.md` — Executive summary of MedusaJS integration
- `.planning/research/STACK.md` — SDK installation, env vars, authentication patterns
- `.planning/research/PITFALLS.md` — Cart desync, price formatting, JWT expiry, CORS, race conditions

### MedusaJS Docs (verify current)
- `https://docs.medusajs.com/resources/js-sdk` — Official SDK documentation
- `https://docs.medusajs.com/resources/storefront-development/products/list` — Product listing with pagination
- `https://docs.medusajs.com/resources/storefront-development/products/retrieve` — Single product retrieval

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `lib/sdk.ts`: Already configured Medusa client with JWT auth — imported by product service
- `lib/providers/MedusaProvider.tsx`: Context provider with `useMedusa()` hook
- `lib/utils/formatPrice.ts`: Already exists — use for displaying Medusa prices (paise → INR)
- `store/cartStore.ts`: Zustand cart store — product data flows through it

### Established Patterns
- `NEXT_PUBLIC_` prefix for client-accessible env vars (already in `.env.local`)
- Prices in paise (divide by 100 for display) — Medusa returns smallest currency unit
- `"use client"` directive on interactive components; Server Components for data fetching

### Integration Points
- `lib/data/products.ts` (replace): Currently returns mock `Product[]` — will call `sdk.store.product.list()`
- `app/shop/page.tsx`: Product listing page — will fetch from Medusa
- `app/shop/[slug]/page.tsx`: PDP — SSR with `generateMetadata`, calls `sdk.store.product.retrieve(slug)`
- `store/cartStore.ts`: Will need `addToCart` updated to use variant_id from Medusa

</code_context>

<specifics>
## Specific Ideas

No specific examples or references from discussion — decisions captured are implementation choices.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 5 scope.

</deferred>

---

*Phase: 05-Product-Integration*
*Context gathered: 2026-05-22*