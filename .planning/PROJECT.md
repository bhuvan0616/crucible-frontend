# Crucible Creations Storefront

## What This Is

A premium 3D printed product storefront for "Crucible Creations" selling the Portable Keychain Phone Stand. Dark-mode-first, conversion-focused shopping experience with MedusaJS backend integration for production-grade e-commerce.

## Core Value

A visually stunning, high-converting storefront that showcases 3D printed products with premium aesthetic and seamless customization options.

## Requirements

### Validated

- ✓ Premium landing page with hero, testimonials, newsletter — Phase 1
- ✓ Product gallery with variant filtering and search — Phase 2
- ✓ Product detail page with customization input (12 char max) — Phase 2
- ✓ Shopping cart with read-only customization display — Phase 3
- ✓ Mock checkout flow with success confirmation — Phase 3
- ✓ GA4 analytics integration (add_to_cart, begin_checkout, purchase) — Phase 3
- ✓ MedusaJS-compatible mock data structure — Phase 1
- ✓ Dark mode default with light mode support — Phase 1

### Active

- [ ] MedusaJS backend integration (store/cart sync, product fetch, auth, real checkout)
- [ ] Real payment processing via MedusaJS payment endpoints
- [ ] SEO implementation (sitemap, robots, OG tags, structured data)
- [ ] Order history and status tracking

### Out of Scope

- Real payment processing — mock only in Phase 1
- Admin dashboard / inventory management
- Checkout form validation & error handling
- 3D model viewer

## Context

**Product:** Portable Keychain Phone Stand — foldable, compact phone holder with custom name engraving (max 12 characters). 3 variants: Wakanda Black, Batman Grey, Captain Teal. Base price ₹449.

**Design:** Dark mode as default, teal (#14B8A6) accent, orange (#F97316) CTA buttons, deep slate (#0F172A) backgrounds. Premium tech/accessory aesthetic with subtle animations.

**Tech:** Next.js 16 (App Router), TypeScript, Tailwind CSS + shadcn/ui, Framer Motion, Zustand (cart), GA4. Node.js ≥ 20.9.0 required.

**Medusa Note:** All prices in mock data use smallest currency unit (paise) — 44900 = ₹449.00. Product service abstracted for easy SDK swap.

## Constraints

- **Tech stack**: Next.js 16, TypeScript, Tailwind, Framer Motion, Zustand — no alternatives
- **Node.js**: ≥ 20.9.0 required (Next.js 16 requirement)
- **No middleware.ts**: Use proxy.ts instead for redirects/auth guards
- **Price encoding**: Always store in smallest currency unit (paise)
- **Customization**: On PDP only, max 12 chars, read-only in cart
- **MedusaJS**: Backend available at http://localhost:9000

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dark mode default | Premium 3D product aesthetic suits dark theme | ✓ Good |
| MedusaJS mock data | Enable zero-effort SDK swap | ✓ Good |
| Zustand for cart | Lightweight, TypeScript-friendly state management | ✓ Good |
| Coarse granularity | Single product storefront, focused execution | ✓ Good |
| @medusajs/js-sdk | Official MedusaJS v2 Storefront SDK | ✓ Good |
| MedusaJS payment | Use MedusaJS existing payment plugins | ✓ Good |

---

*Last updated: 2026-05-27 after v1.3 milestone start*

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

## Current Milestone: v1.3 Order History

**Goal:** Display user's order history with status tracking, using industry-standard UI/UX patterns.

**Target features:**
- Order list view with status badges
- Order detail page with line items and totals
- Status filtering and search
- Industry-standard order management UI