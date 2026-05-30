# Milestones: Crucible Creations Storefront

## v1.0 — MVP Launch (Initial)

**Completed:** 2026-05-19

**Goal:** Launch MVP storefront with mock data, demonstrating product gallery, PDP, cart, checkout, and analytics.

**Phases completed:** 3 (all)

**What shipped:**
- Landing page with hero, testimonials, newsletter
- Product gallery with filtering and search
- Product detail page with 12-char name engraving customization
- Shopping cart with read-only customization display
- Mock checkout flow with Razorpay/UPI/Cards payment selection
- GA4 analytics (add_to_cart, begin_checkout, purchase events)
- Dark mode design system with brand colors
- MedusaJS-compatible mock data structure

---

## v1.1 — MedusaJS Backend Integration

**Completed:** 2026-05-22

**Goal:** Integrate live MedusaJS backend at http://localhost:9000 to replace mock data with real product catalog, cart sync, authentication, and payment processing.

**Phases:** 4–8 (archived in `phases-archive/`)

**What shipped:**
- `@medusajs/js-sdk` client with auth interceptors
- Live product catalog and PDP
- Medusa cart sync (add, update, remove, totals)
- Customer login/register/logout
- Real checkout with address, shipping, payment, order completion

---

## v1.2 — Bug Fixes & Profile Page

**Status:** Partially complete

**Started:** 2026-05-27

**Goal:** Fix critical UX bugs and add user account page

**Completed (quick task 260527-jdf):**
- [x] Checkout back button preserves return URL via sessionStorage
- [x] India country field read-only (fixes region error)
- [ ] Cart side drawer product image not showing until reload
- [ ] Account page with logout (in progress — uncommitted `app/account/`)

---

## v1.3 — Order History

**Completed:** 2026-05-27
**Archived:** 2026-05-30
**Tag:** v1.3

**Goal:** Display user's order history with status tracking, using industry-standard UI/UX patterns.

**Stats:** 4 phases, 4 plans, 19 commits (`363e3ef` → `80220a1`), ~2,400 LOC in order components

**What shipped:**
- `/orders` — paginated list with status tabs, search, empty/error states
- `/orders/[id]` — line items, totals, shipping address, payment info
- `StatusBadge` — color-coded Medusa status labels (dark-mode aware)
- `OrderTimeline` — horizontal desktop / vertical mobile fulfillment stages
- UI polish — shimmer skeletons, responsive layout, design system consistency

**Key accomplishments:**
1. Paginated order list with status filtering and client-side search
2. Full order detail page with Medusa `order.retrieve` integration
3. Reusable StatusBadge and OrderTimeline components
4. Shimmer skeleton loading and mobile-first responsive polish

**Follow-up fixes (post-milestone):**
- `4378729` — registration uses `auth.refresh()` instead of `login()` to fix missing customer email on orders

**Known deferred items at close:** 6 (see STATE.md Deferred Items)

**Archives:**
- `.planning/milestones/v1.3-ROADMAP.md`
- `.planning/milestones/v1.3-REQUIREMENTS.md`
- `.planning/milestones/v1.3-phases/`

---

*Last synced: 2026-05-30*
