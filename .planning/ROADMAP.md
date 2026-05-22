# Roadmap: v1.1 MedusaJS Backend Integration

**Milestone:** v1.1
**Status:** In Progress
**Started:** 2026-05-22
**Granularity:** Coarse

---

## Phases

- [ ] **Phase 4: SDK Foundation** — Install and configure MedusaJS SDK client
- [ ] **Phase 5: Product Integration** — Replace mock data with live Medusa product API
- [ ] **Phase 6: Cart Operations & Medusa Sync** — Real-time cart state sync with Medusa backend
- [ ] **Phase 7: Authentication Flow** — Customer login, register, logout with JWT management
- [ ] **Phase 8: Checkout & Order Completion** — Full checkout flow with Medusa payment
- [ ] **Phase 9: SEO Implementation** — sitemap, robots, OG tags, structured data

---

## Phase Details

### Phase 4: SDK Foundation

**Goal:** Install and configure the MedusaJS SDK client with foundational utilities

**Depends on:** Phase 3 (v1.0 completion)

**Requirements:** SDK-01, SDK-02, SDK-03, SDK-04

**Success Criteria** (what must be TRUE):
1. `@medusajs/js-sdk` and `@medusajs/types` packages are installed and importable
2. `lib/medusa.ts` exports a configured SDK client singleton with auth and publishable key config
3. Environment variables `NEXT_PUBLIC_MEDUSA_BACKEND_URL` and `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY` are documented and validated
4. `formatPrice()` utility correctly converts paise amounts (44900 → "₹449") for INR display

**Plans:** TBD

**UI hint:** no

---

### Phase 5: Product Integration

**Goal:** Replace mock product data with live Medusa product API calls

**Depends on:** Phase 4

**Requirements:** PROD-01, PROD-02, PROD-03, PROD-04, PROD-05

**Success Criteria** (what must be TRUE):
1. Product listing page fetches from `sdk.store.product.list()` with pagination
2. PDP fetches single product via `sdk.store.product.retrieve(id)` with variants
3. Variant selector displays Medusa inventory quantities (when available)
4. Product images load from Medusa Media module URLs
5. `lib/data/products.ts` no longer imports mock data — all calls go to Medusa API

**Plans:** 1 plan

**Plan list:**
- [ ] 05-01-PLAN.md — Replace mock data with Medusa SDK calls (lib/data/products.ts, shop page to Server Component)

**UI hint:** yes

---

### Phase 6: Cart Operations & Medusa Sync

**Goal:** Cart state synced with Medusa backend — server is source of truth

**Depends on:** Phase 5

**Requirements:** CART-11, CART-12, CART-13, CART-14, CART-15, CART-16, CART-17

**Success Criteria** (what must be TRUE):
1. New visitors get a Medusa cart created via `sdk.store.cart.create()`
2. Returning visitors' cart ID restored from localStorage
3. "Add to Cart" immediately calls Medusa API and reconciles Zustand state with response
4. Quantity changes sync with `sdk.store.cart.updateLineItem()` — no local-only state
5. Item removal calls `sdk.store.cart.removeLineItem()`
6. Cart totals (subtotal, shipping, tax, total) come from Medusa response, not local calculation
7. Customization text stored in line item `metadata` and displayed in cart

**Plans:** TBD

**UI hint:** yes

---

### Phase 7: Authentication Flow

**Goal:** Customers can create accounts, log in, and maintain auth state across sessions

**Depends on:** Phase 6

**Requirements:** AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06

**Success Criteria** (what must be TRUE):
1. Login form submits to `sdk.auth.login("customer", email, password)` and receives JWT
2. Registration form submits to `sdk.auth.register()` and creates customer account
3. JWT token auto-attached to subsequent SDK requests via SDK client interceptors
4. Logout removes token from localStorage and clears auth context
5. Page refresh preserves auth state by rehydrating token from localStorage
6. Login/Register UI components display appropriate form and error states

**Plans:** TBD

**UI hint:** yes

---

### Phase 8: Checkout & Order Completion

**Goal:** Full checkout flow with real Medusa payment processing and order creation

**Depends on:** Phase 7

**Requirements:** CHKT-11, CHKT-12, CHKT-13, CHKT-14, CHKT-15, CHKT-16

**Success Criteria** (what must be TRUE):
1. Shipping address form submits to Medusa cart via `sdk.store.cart.update()`
2. Shipping method selection displays options from `sdk.store.cart.retrieve()` available_shipping_methods
3. Payment step shows configured Medusa payment providers (not mock selection)
4. `cart.complete()` atomically processes payment and creates Medusa order
5. Order confirmation page displays real order data from Medusa response
6. Post-checkout cart cleared and localStorage cart ID removed for fresh cart on next visit

**Plans:** TBD

**UI hint:** yes

---

### Phase 9: SEO Implementation

**Goal:** Search engine visibility via sitemap, robots, OG tags, and structured data

**Depends on:** Phase 8

**Requirements:** SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06

**Success Criteria** (what must be TRUE):
1. `sitemap.xml` includes all product pages fetched from Medusa product list
2. `robots.txt` allows crawlers and points to sitemap location
3. All pages have Open Graph meta tags (og:title, og:description, og:image, og:url)
4. All pages have Twitter Card meta tags (twitter:card, twitter:title, twitter:description)
5. PDP renders JSON-LD Product schema with name, image, price, availability
6. Product pages have dynamic `<title>` and `<meta name="description">` from Medusa product data

**Plans:** TBD

**UI hint:** yes

---

## Progress Table

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| Phase 4: SDK Foundation | 1/1 | ✓ Complete | 2026-05-22 |
| Phase 5: Product Integration | 1/1 | ✓ Complete | 2026-05-22 |
| 6. Cart Operations & Medusa Sync | 0/1 | Not started | - |
| 7. Authentication Flow | 0/1 | Not started | - |
| 8. Checkout & Order Completion | 0/1 | Not started | - |
| 9. SEO Implementation | 0/1 | Not started | - |

---

*Created: 2026-05-22 for v1.1 MedusaJS Backend Integration*