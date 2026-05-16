# Phase 1: Foundation & Landing Page - Context

**Gathered:** 2026-05-16
**Status:** Ready for planning
**Source:** PRD Express Path (crucible-creations-prd.md)

## Phase Boundary

Set up project infrastructure, design system, and landing page with hero, benefits, testimonials, and newsletter.

## Implementation Decisions

### Project Setup
- Next.js 16 with App Router, TypeScript
- Tailwind CSS 4 + shadcn/ui component library
- Framer Motion for animations
- Dark mode as default with CSS variables

### Design System (from PRD)
- Primary: `#0F172A` (Deep Slate)
- Accent: `#14B8A6` (Teal)
- CTA: `#F97316` (Orange)
- All colors via Tailwind config + CSS variables

### Landing Page Sections
- Hero banner with lifestyle imagery and CTA
- Featured product showcase (3 variants)
- Benefits section
- How it works section
- Usage scenarios section
- Testimonials (mock data)
- Newsletter signup

### Mock Data
- MedusaJS-compatible products.json structure
- Prices in paise (44900 = ₹449.00)

## Canonical References

### Project
- `crucible-creations-prd.md` — Full PRD with design system, page specs
- `AGENTS.md` — Project guide with tech stack and constraints

### Tech Stack
- Next.js 16 (App Router) — No middleware.ts, use proxy.ts
- TypeScript (min v5.1.0)
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Node.js ≥ 20.9.0

## Specific Ideas

### Landing Page Implementation
1. Use `app/page.tsx` as landing page with Server Components where possible
2. Hero section: full-width banner with background image, headline, subheadline, CTA button
3. Product showcase: 3-column grid showing 3 variants
4. Benefits: icon + text cards (compact, informative)
5. Newsletter: form with email input + submit button (UI only, no backend)

### Design System Setup
1. Configure Tailwind with brand colors in `tailwind.config.ts`
2. Set dark mode as default via `class` strategy
3. Create CSS variables in `app/globals.css`

### Project Structure
```
app/
├── layout.tsx       # GA4 injected here later
├── page.tsx          # Landing page
├── shop/
│   └── page.tsx      # Product gallery
├── product/
│   └── [handle]/
│       └── page.tsx  # PDP
├── cart/
│   └── page.tsx
└── checkout/
    └── page.tsx
components/
├── ui/               # shadcn primitives
├── product/          # ProductCard, VariantSelector, etc.
├── cart/             # CartItem, CartSummary
└── layout/           # Navbar, Footer
lib/
├── services/
│   ├── productService.ts
│   └── cartService.ts
└── analytics.ts     # GA4 helpers
mocks/
└── products.json
store/
└── cartStore.ts      # Zustand
images/              # Product + lifestyle images
proxy.ts             # Next.js 16 middleware replacement
```

## Deferred Ideas

- GA4 integration (Phase 3)
- MedusaJS backend swap (Phase 2)
- Real payment processing (future)

---

*Phase: 01-foundation-landing-page*
*Context gathered: 2026-05-16 via PRD Express Path*