# Requirements: Crucible Creations Storefront

**Defined:** 2026-05-16
**Updated:** 2026-05-22 for v1.1 milestone
**Core Value:** A visually stunning, high-converting storefront that showcases 3D printed products with premium aesthetic and seamless customization options.

---

## v1 Requirements (Validated — v1.0 MVP Launch)

These requirements shipped in v1.0 and are marked as validated.

### Landing Page

- [x] **LAND-01**: Hero section with lifestyle imagery and prominent CTA — Phase 1
- [x] **LAND-02**: Featured product showcase (3 variants) — Phase 1
- [x] **LAND-03**: Benefits section highlighting product value — Phase 1
- [x] **LAND-04**: How it works section with usage steps — Phase 1
- [x] **LAND-05**: Usage scenarios section — Phase 1
- [x] **LAND-06**: Testimonials section (mock data) — Phase 1
- [x] **LAND-07**: Newsletter signup form — Phase 1

### Product Gallery

- [x] **GALL-01**: Product grid with variant cards — Phase 2
- [x] **GALL-02**: Filter by Edition/Color — Phase 2
- [x] **GALL-03**: Quick add to cart from gallery view — Phase 2
- [x] **GALL-04**: Search and sort functionality — Phase 2

### Product Detail Page (PDP)

- [x] **PDP-01**: Left-side image gallery — Phase 2
- [x] **PDP-02**: Right-side sticky product details panel — Phase 2
- [x] **PDP-03**: Product title, subtitle, and price display — Phase 2
- [x] **PDP-04**: Variant selector with color swatches — Phase 2
- [x] **PDP-05**: Customization text input with 12-char max — Phase 2
- [x] **PDP-06**: Live character counter — Phase 2
- [x] **PDP-07**: Helper text for engraving — Phase 2
- [x] **PDP-08**: Quantity selector — Phase 2
- [x] **PDP-09**: Prominent "Add to Cart" button — Phase 2
- [x] **PDP-10**: Full description and specifications — Phase 2
- [x] **PDP-11**: Shipping and delivery information — Phase 2
- [x] **PDP-12**: "You may also like" section placeholder — Phase 2

### Cart

- [x] **CART-01**: Cart page with variant and read-only customization — Phase 3
- [x] **CART-02**: Quantity controls per item — Phase 3
- [x] **CART-03**: Subtotal calculation — Phase 3
- [x] **CART-04**: Estimated shipping display — Phase 3
- [x] **CART-05**: Proceed to Checkout CTA — Phase 3

### Checkout

- [x] **CHKT-01**: Shipping address form (mock) — Phase 3
- [x] **CHKT-02**: Delivery options display — Phase 3
- [x] **CHKT-03**: Order summary with custom name — Phase 3
- [x] **CHKT-04**: Promo code input (mock) — Phase 3
- [x] **CHKT-05**: Mock payment method selection — Phase 3
- [x] **CHKT-06**: Place Order leading to success page — Phase 3
- [x] **CHKT-07**: Success page confirmation — Phase 3

### Analytics

- [x] **ANLY-01**: GA4 integration at layout level — Phase 3
- [x] **ANLY-02**: page_view event — Phase 3
- [x] **ANLY-03**: add_to_cart event — Phase 3
- [x] **ANLY-04**: begin_checkout event — Phase 3
- [x] **ANLY-05**: purchase event on success page — Phase 3

### Architecture

- [x] **ARCH-01**: MedusaJS-compatible mock data structure — Phase 1
- [x] **ARCH-02**: Abstracted productService.ts for SDK swap — Phase 2
- [x] **ARCH-03**: Abstracted cartService.ts — Phase 2
- [x] **ARCH-04**: Zustand cart store with persistence — Phase 2
- [x] **ARCH-05**: Environment variable management — Phase 1
- [x] **ARCH-06**: proxy.ts for middleware logic — Phase 3

---

## v1.1 Requirements (Active — MedusaJS Backend Integration)

### SDK Setup

- [ ] **SDK-01**: Install @medusajs/js-sdk and @medusajs/types packages
- [ ] **SDK-02**: Create lib/medusa.ts with SDK client singleton configuration
- [ ] **SDK-03**: Configure environment variables (NEXT_PUBLIC_MEDUSA_BACKEND_URL, NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY)
- [ ] **SDK-04**: Create formatPrice() utility for INR paise-to-display conversion

### Product Integration

- [ ] **PROD-01**: Replace lib/data/products.ts mock with Medusa product API calls
- [ ] **PROD-02**: Product list page fetches from Medusa with pagination
- [ ] **PROD-03**: PDP fetches product details from Medusa API
- [ ] **PROD-04**: Variant selection uses Medusa variant data with inventory quantities
- [ ] **PROD-05**: Product images served from Medusa Media module

### Cart Sync

- [ ] **CART-11**: Cart initialized from Medusa on first visit (cart.create or cart retrieval)
- [ ] **CART-12**: Cart ID persisted in localStorage
- [ ] **CART-13**: Add to cart syncs immediately with Medusa cart API
- [ ] **CART-14**: Quantity updates sync with Medusa cart API
- [ ] **CART-15**: Remove item syncs with Medusa cart API
- [ ] **CART-16**: Cart totals fetched from Medusa (not calculated locally)
- [ ] **CART-17**: Customization text stored in line item metadata

### Authentication

- [ ] **AUTH-01**: Customer login via sdk.auth.login()
- [ ] **AUTH-02**: Customer registration via sdk.auth.register()
- [ ] **AUTH-03**: JWT token auto-stored and attached to requests
- [ ] **AUTH-04**: Customer logout (token removal from localStorage)
- [ ] **AUTH-05**: Auth state preserved across page refresh
- [ ] **AUTH-06**: Login/Register UI components

### Checkout & Orders

- [ ] **CHKT-11**: Checkout address form submits to Medusa cart
- [ ] **CHKT-12**: Shipping method selection from Medusa available options
- [ ] **CHKT-13**: Payment step using Medusa payment providers
- [ ] **CHKT-14**: cart.complete() creates Medusa order
- [ ] **CHKT-15**: Order confirmation page displays real order data from Medusa
- [ ] **CHKT-16**: Post-checkout cart cleared for new order

### SEO

- [ ] **SEO-01**: sitemap.xml generated from Medusa product catalog
- [ ] **SEO-02**: robots.txt allowing crawlers
- [ ] **SEO-03**: Open Graph meta tags on all pages
- [ ] **SEO-04**: Twitter Card meta tags
- [ ] **SEO-05**: Product JSON-LD structured data
- [ ] **SEO-06**: Dynamic metadata for product pages

---

## v2 Requirements (Deferred)

- **MEDUSA-01**: Live MedusaJS backend integration — **NOW IN v1.1**
- **PAY-01**: Real payment processing with Razorpay live keys
- **USER-01**: User accounts and order history
- **ADMIN-01**: Admin dashboard and inventory management
- **CHKV-01**: Checkout form validation and error handling
- **SEO-01 to SEO-06**: SEO implementation — **NOW IN v1.1**

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Admin dashboard | Out of scope for frontend milestone |
| Inventory management | Backend admin feature, not storefront |
| User order history page | Deferred to future phase |
| 3D model viewer | PRD explicitly excludes |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| SDK-01, SDK-02, SDK-03, SDK-04 | Phase 4 | Pending |
| PROD-01, PROD-02, PROD-03, PROD-04, PROD-05 | Phase 5 | Pending |
| CART-11, CART-12, CART-13, CART-14, CART-15, CART-16, CART-17 | Phase 6 | Pending |
| AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06 | Phase 7 | Pending |
| CHKT-11, CHKT-12, CHKT-13, CHKT-14, CHKT-15, CHKT-16 | Phase 8 | Pending |
| SEO-01, SEO-02, SEO-03, SEO-04, SEO-05, SEO-06 | Phase 9 | Pending |

**Coverage:**
- v1.1 requirements: 27 total (SDK: 4, PROD: 5, CART: 7, AUTH: 6, CHKT: 6, SEO: 6)
- Mapped to phases: 27
- Unmapped: 0 ✓

---

*Requirements updated: 2026-05-22 for v1.1 MedusaJS Backend Integration milestone*
*Previous update: 2026-05-16 after initial definition*