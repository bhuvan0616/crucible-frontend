# Walking Skeleton — Crucible Creations Storefront

**Phase:** 1
**Generated:** 2026-05-16

## Capability Proven End-to-End

A user can visit the landing page and see the hero section with the product, navigate to shop, view product details, and see the site is fully functional and styled with the brand design system.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16 (App Router) | App Router, TypeScript, latest stable |
| Styling | Tailwind CSS 4 + CSS variables | Brand colors via CSS vars, dark mode via .dark class |
| UI Components | shadcn/ui | Accessible, composable, dark mode ready |
| Animations | Framer Motion | Subtle, performant animations |
| State Management | Zustand (Phase 2) | Lightweight, TypeScript-friendly |
| Data Layer | MedusaJS-compatible mock (Phase 2 SDK swap) | prices in paise, variant structure mirrors MedusaJS v2 |
| Analytics | GA4 (Phase 3) | afterInteractive strategy |

## Stack Touched in Phase 1

- [x] Project scaffold (existing Next.js 16 + Tailwind 4 + Framer Motion)
- [x] Design system (brand colors, dark mode, CSS variables)
- [x] Routing — landing page at app/page.tsx
- [x] UI components — shadcn/ui button, card, input, label
- [x] Mock data — MedusaJS-compatible products.json
- [ ] Landing page — all sections (hero, benefits, testimonials, newsletter)

## Out of Scope (Deferred to Later Slices)

- Zustand cart store (Phase 2)
- Product gallery / PDP (Phase 2)
- Cart page (Phase 3)
- Checkout flow (Phase 3)
- GA4 analytics (Phase 3)
- Live MedusaJS backend (Phase 2 SDK swap)
- Real payment processing (future)

## Subsequent Slice Plan

- Phase 2: Product Gallery & PDP — full browsing and customization experience
- Phase 3: Cart, Checkout & Analytics — purchase flow and tracking