# Roadmap: Crucible Creations Storefront

**Phases:** 3 | **Requirements:** 35 | **Mode:** mvp

## Phase 1: Foundation & Landing Page

**Goal:** Set up project infrastructure, design system, and landing page with hero, benefits, testimonials, and newsletter.

**Mode:** mvp

**Success Criteria:**
1. Next.js 16 project with Tailwind CSS and shadcn/ui configured
2. Dark mode design system with brand colors (deep slate, teal, orange)
3. Framer Motion animations working on landing page
4. Hero section with lifestyle imagery and CTA button
5. Benefits, How it Works, and Usage Scenarios sections
6. Testimonials section with mock data
7. Newsletter signup form (UI only)
8. Mock products.json with MedusaJS-compatible data structure

**Plans:** 3 plans

Plans:
- [ ] 01-foundation-landing-page/01-01-PLAN.md — Design system, CSS variables, mock data
- [ ] 01-foundation-landing-page/01-02-PLAN.md — Hero, Featured Products, Benefits sections
- [ ] 01-foundation-landing-page/01-03-PLAN.md — How It Works, Testimonials, Newsletter sections

---

## Phase 2: Product Gallery & PDP

**Goal:** Implement product browsing and product detail page with customization.

**Mode:** mvp

**Success Criteria:**
1. Product gallery page with grid layout and variant cards
2. Filter by Edition/Color working
3. Quick add to cart from gallery
4. Search and sort functionality
5. PDP with two-column layout (image gallery left, details right)
6. Sticky product details panel
7. Variant selector with color swatches
8. Customization input with 12-char limit and live counter
9. Quantity selector and Add to Cart button
10. Product description, specs, shipping info displayed

**Requirements:** GALL-01, GALL-02, GALL-03, GALL-04, PDP-01, PDP-02, PDP-03, PDP-04, PDP-05, PDP-06, PDP-07, PDP-08, PDP-09, PDP-10, PDP-11, PDP-12, ARCH-02, ARCH-03, ARCH-04

---

## Phase 3: Cart, Checkout & Analytics

**Goal:** Implement shopping cart, mock checkout flow, and GA4 analytics integration.

**Mode:** mvp

**Success Criteria:**
1. Cart page displaying items with variant and read-only custom name
2. Quantity controls and subtotal calculation working
3. Estimated shipping display
4. Proceed to Checkout button navigates to checkout
5. Checkout page with shipping form (mock), delivery options, order summary
6. Promo code field (mock validation)
7. Payment method selection (Razorpay, UPI, Cards)
8. Place Order leads to success confirmation page
9. GA4 script injected in layout.tsx with afterInteractive
10. add_to_cart, begin_checkout, purchase events firing correctly
11. proxy.ts configured for Next.js 16 middleware replacement

**Requirements:** CART-01, CART-02, CART-03, CART-04, CART-05, CHKT-01, CHKT-02, CHKT-03, CHKT-04, CHKT-05, CHKT-06, CHKT-07, ANLY-01, ANLY-02, ANLY-03, ANLY-04, ANLY-05, ARCH-05, ARCH-06

---

## Execution Summary

| Phase | Status | Requirements | Success Criteria |
|-------|--------|--------------|------------------|
| 1 | ○ Pending | 8 | 8 |
| 2 | ○ Pending | 18 | 10 |
| 3 | ○ Pending | 17 | 12 |

---
*Roadmap created: 2026-05-16*
*Last updated: 2026-05-16 after initial roadmap creation*