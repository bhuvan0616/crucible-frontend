# AGENTS.md - Crucible Creations Storefront

## Project Context

**Project:** Crucible Creations Storefront
**Core Value:** A visually stunning, high-converting storefront that showcases 3D printed products with premium aesthetic and seamless customization options.

**PRD:** `crucible-creations-prd.md` — Full requirements and design guidelines

## Workflow Commands

- `/gsd-plan-phase 1` — Plan Phase 1 (Foundation & Landing Page)
- `/gsd-plan-phase 2` — Plan Phase 2 (Product Gallery & PDP)
- `/gsd-plan-phase 3` — Plan Phase 3 (Cart, Checkout & Analytics)
- `/gsd-execute-phase 1` — Execute Phase 1
- `/gsd-progress` — Check project progress

## Phase Summary

### Phase 1: Foundation & Landing Page
- Next.js 16 setup, Tailwind, shadcn/ui, Framer Motion
- Dark mode design system with brand colors
- Landing page with hero, benefits, testimonials, newsletter

### Phase 2: Product Gallery & PDP
- Product gallery with filtering and search
- Product detail page with customization input (12-char max)
- Zustand cart store setup

### Phase 3: Cart, Checkout & Analytics
- Cart page with read-only customization display
- Mock checkout flow
- GA4 analytics integration

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Zustand (cart state)
- GA4 (analytics)

## Key Constraints

- **No middleware.ts** — Use proxy.ts for redirects/auth
- **Prices in paise** — 44900 = ₹449.00
- **Customization on PDP only** — Cart shows read-only
- **Node.js ≥ 20.9.0** — Required by Next.js 16

## MedusaJS-Ready

Mock data structure mirrors MedusaJS v2 schema. Phase 2 will swap `lib/services/productService.ts` to `@medusajs/js-sdk`.

## Design System

- **Primary:** `#0F172A` (Deep Slate)
- **Accent:** `#14B8A6` (Teal)
- **CTA:** `#F97316` (Orange)
- **Dark mode default**, light mode supported