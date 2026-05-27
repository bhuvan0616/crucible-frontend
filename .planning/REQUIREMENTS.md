# Requirements: Crucible Creations Storefront

**Defined:** 2026-05-16
**Updated:** 2026-05-27 for v1.3 milestone
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

## v1.1 Requirements (Validated — MedusaJS Backend Integration)

### SDK Setup

- [x] **SDK-01**: Install @medusajs/js-sdk and @medusajs/types packages — Phase 4
- [x] **SDK-02**: Create lib/medusa.ts with SDK client singleton configuration — Phase 4
- [x] **SDK-03**: Configure environment variables — Phase 4
- [x] **SDK-04**: Create formatPrice() utility for INR paise-to-display conversion — Phase 4

### Product Integration

- [x] **PROD-01**: Replace mock with Medusa product API calls — Phase 5
- [x] **PROD-02**: Product list page fetches from Medusa with pagination — Phase 5
- [x] **PROD-03**: PDP fetches product details from Medusa API — Phase 5
- [x] **PROD-04**: Variant selection uses Medusa variant data — Phase 5
- [x] **PROD-05**: Product images served from Medusa Media module — Phase 5

### Cart Sync

- [x] **CART-11**: Cart initialized from Medusa on first visit — Phase 6
- [x] **CART-12**: Cart ID persisted in localStorage — Phase 6
- [x] **CART-13**: Add to cart syncs immediately with Medusa cart API — Phase 6
- [x] **CART-14**: Quantity updates sync with Medusa cart API — Phase 6
- [x] **CART-15**: Remove item syncs with Medusa cart API — Phase 6
- [x] **CART-16**: Cart totals fetched from Medusa — Phase 6
- [x] **CART-17**: Customization text stored in line item metadata — Phase 6

### Authentication

- [x] **AUTH-01**: Customer login via sdk.auth.login() — Phase 7
- [x] **AUTH-02**: Customer registration via sdk.auth.register() — Phase 7
- [x] **AUTH-03**: JWT token auto-stored and attached to requests — Phase 7
- [x] **AUTH-04**: Customer logout — Phase 7
- [x] **AUTH-05**: Auth state preserved across page refresh — Phase 7
- [x] **AUTH-06**: Login/Register UI components — Phase 7

### Checkout & Orders

- [x] **CHKT-11**: Checkout address form submits to Medusa cart — Phase 8
- [x] **CHKT-12**: Shipping method selection from Medusa — Phase 8
- [x] **CHKT-13**: Payment step using Medusa payment providers — Phase 8
- [x] **CHKT-14**: cart.complete() creates Medusa order — Phase 8
- [x] **CHKT-15**: Order confirmation page displays real order data — Phase 8
- [x] **CHKT-16**: Post-checkout cart cleared — Phase 8

---

## v1.3 Requirements (Active — Order History)

### Order List

- [ ] **ORDR-01**: Order history page with paginated list of user orders
- [ ] **ORDR-02**: Order card displays order number, date, status badge, and total
- [ ] **ORDR-03**: Status filtering (All, Pending, Processing, Shipped, Delivered, Cancelled)
- [ ] **ORDR-04**: Search orders by order number

### Order Detail

- [ ] **ORDR-05**: Order detail page with full order information
- [ ] **ORDR-06**: Line items display (product name, variant, customization, quantity, price)
- [ ] **ORDR-07**: Order totals (subtotal, shipping, tax, total)
- [ ] **ORDR-08**: Shipping address display
- [ ] **ORDR-09**: Payment method display

### Order Status

- [ ] **ORDR-10**: Status badge component with color coding (Medusa statuses)
- [ ] **ORDR-11**: Order timeline showing fulfillment progress

### UI/UX

- [ ] **ORDR-12**: Industry-standard order list design with table/card hybrid layout
- [ ] **ORDR-13**: Mobile-responsive order history views
- [ ] **ORDR-14**: Loading skeleton states for order list/detail pages

---

## v2 Requirements (Deferred)

- **PAY-01**: Real payment processing with Razorpay live keys
- **ADMIN-01**: Admin dashboard and inventory management
- **CHKV-01**: Checkout form validation and error handling
- **SEO-01 to SEO-06**: SEO implementation

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Order cancellation | Not requested by user |
| Return/refund requests | Separate feature, not in scope |
| Admin dashboard | Out of scope for frontend milestone |
| Inventory management | Backend admin feature, not storefront |
| 3D model viewer | PRD explicitly excludes |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| ORDR-01, ORDR-02, ORDR-03, ORDR-04 | Phase 1 | Pending |
| ORDR-05, ORDR-06, ORDR-07, ORDR-08, ORDR-09 | Phase 2 | Pending |
| ORDR-10, ORDR-11 | Phase 3 | Pending |
| ORDR-12, ORDR-13, ORDR-14 | Phase 4 | Pending |

**Coverage:**
- v1.3 requirements: 14 total (List: 4, Detail: 5, Status: 2, UI/UX: 3)
- Mapped to phases: 14
- Unmapped: 0 ✓

---

*Requirements updated: 2026-05-27 for v1.3 Order History milestone*
*Previous update: 2026-05-22 for v1.1 MedusaJS Backend Integration milestone*