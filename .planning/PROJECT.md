# Crucible Creations Storefront

## What This Is

A premium 3D printed product storefront for "Crucible Creations" selling the Portable Keychain Phone Stand. Dark-mode-first, conversion-focused shopping experience with MedusaJS-ready architecture for future backend integration.

## Core Value

A visually stunning, high-converting storefront that showcases 3D printed products with premium aesthetic and seamless customization options.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Premium landing page with hero, testimonials, newsletter
- [ ] Product gallery with variant filtering and search
- [ ] Product detail page with customization input (12 char max name engraving)
- [ ] Shopping cart with read-only customization display
- [ ] Mock checkout flow with success confirmation
- [ ] GA4 analytics integration (page_view, add_to_cart, begin_checkout, purchase)
- [ ] MedusaJS-compatible mock data structure
- [ ] Dark mode default with light mode support

### Out of Scope

- Live MedusaJS backend integration — MedusaJS v2 SDK swap planned for Phase 2
- Real payment processing — mock only in Phase 1
- User accounts and order history
- Admin dashboard / inventory management
- Checkout form validation & error handling

## Context

**Product:** Portable Keychain Phone Stand — foldable, compact phone holder with custom name engraving (max 12 characters). 3 variants: Wakanda Black, Batman Grey, Captain Teal. Base price ₹449.

**Design:** Dark mode as default, teal (#14B8A6) accent, orange (#F97316) CTA buttons, deep slate (#0F172A) backgrounds. Premium tech/accessory aesthetic with subtle animations.

**Tech:** Next.js 16 (App Router), TypeScript, Tailwind CSS + shadcn/ui, Framer Motion, Zustand (cart), GA4. Node.js ≥ 20.9.0 required.

**Medusa Note:** All prices in mock data use smallest currency unit (paise) — 44900 = ₹449.00. Product service abstracted for easy SDK swap in Phase 2.

## Constraints

- **Tech stack**: Next.js 16, TypeScript, Tailwind, Framer Motion, Zustand — no alternatives
- **Node.js**: ≥ 20.9.0 required (Next.js 16 requirement)
- **No middleware.ts**: Use proxy.ts instead for redirects/auth guards
- **Price encoding**: Always store in smallest currency unit (paise)
- **Customization**: On PDP only, max 12 chars, read-only in cart

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Dark mode default | Premium 3D product aesthetic suits dark theme | — Pending |
| MedusaJS mock data | Enable zero-effort SDK swap in Phase 2 | — Pending |
| Zustand for cart | Lightweight, TypeScript-friendly state management | — Pending |
| Coarse granularity | Single product storefront, focused execution | — Pending |

---

*Last updated: 2026-05-16 after initialization*

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