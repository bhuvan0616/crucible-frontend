# Requirements: Crucible Creations Storefront

**Defined:** 2026-05-16
**Core Value:** A visually stunning, high-converting storefront that showcases 3D printed products with premium aesthetic and seamless customization options.

## v1 Requirements

### Landing Page

- [ ] **LAND-01**: Hero section with lifestyle imagery and prominent CTA
- [ ] **LAND-02**: Featured product showcase (3 variants)
- [ ] **LAND-03**: Benefits section highlighting product value
- [ ] **LAND-04**: How it works section with usage steps
- [ ] **LAND-05**: Usage scenarios section
- [ ] **LAND-06**: Testimonials section (mock data)
- [ ] **LAND-07**: Newsletter signup form

### Product Gallery

- [ ] **GALL-01**: Product grid with variant cards displaying image, title, price
- [ ] **GALL-02**: Filter by Edition/Color (variant filtering)
- [ ] **GALL-03**: Quick add to cart from gallery view
- [ ] **GALL-04**: Search and sort functionality

### Product Detail Page (PDP)

- [ ] **PDP-01**: Left-side image gallery with multiple angles and lifestyle images
- [ ] **PDP-02**: Right-side sticky product details panel
- [ ] **PDP-03**: Product title, subtitle, and price display (₹449 base)
- [ ] **PDP-04**: Variant selector with color swatches (Wakanda Black, Batman Grey, Captain Teal)
- [ ] **PDP-05**: Customization text input field with 12-character max limit
- [ ] **PDP-06**: Live character counter with inline validation
- [ ] **PDP-07**: Helper text: "This text will be 3D printed on your stand"
- [ ] **PDP-08**: Quantity selector
- [ ] **PDP-09**: Prominent "Add to Cart" button
- [ ] **PDP-10**: Full description and specifications section
- [ ] **PDP-11**: Shipping and delivery information
- [ ] **PDP-12**: "You may also like" section (placeholder)

### Cart

- [ ] **CART-01**: Cart page displaying items with variant and read-only custom name
- [ ] **CART-02**: Quantity controls per item
- [ ] **CART-03**: Subtotal calculation
- [ ] **CART-04**: Estimated shipping display
- [ ] **CART-05**: Proceed to Checkout CTA

### Checkout

- [ ] **CHKT-01**: Shipping address form (mock)
- [ ] **CHKT-02**: Delivery options and timeline display
- [ ] **CHKT-03**: Order summary with custom name included
- [ ] **CHKT-04**: Promo code input field (mock)
- [ ] **CHKT-05**: Mock payment method selection (Razorpay, UPI, Cards)
- [ ] **CHKT-06**: Place Order button leading to success page
- [ ] **CHKT-07**: Success page confirmation (mock)

### Analytics

- [ ] **ANLY-01**: GA4 integration at layout level with afterInteractive strategy
- [ ] **ANLY-02**: page_view event (automatic via GA4)
- [ ] **ANLY-03**: add_to_cart event on "Add to Cart" click
- [ ] **ANLY-04**: begin_checkout event when proceeding to checkout
- [ ] **ANLY-05**: purchase event on success page

### Architecture

- [ ] **ARCH-01**: MedusaJS-compatible mock data structure (prices in paise)
- [ ] **ARCH-02**: Abstracted productService.ts with easy SDK swap capability
- [ ] **ARCH-03**: Abstracted cartService.ts
- [ ] **ARCH-04**: Zustand cart store with persistence
- [ ] **ARCH-05**: Environment variable management (NEXT_PUBLIC_GA_MEASUREMENT_ID)
- [ ] **ARCH-06**: proxy.ts for middleware logic (Next.js 16 requirement)

## v2 Requirements

- **MEDUSA-01**: Live MedusaJS backend integration (@medusajs/js-sdk swap)
- **PAY-01**: Real payment processing with Cashfree live keys
- **USER-01**: User accounts and order history
- **ADMIN-01**: Admin dashboard and inventory management
- **CHKV-01**: Checkout form validation and error handling

## Out of Scope

| Feature | Reason |
|---------|--------|
| 3D model viewer | PRD explicitly excludes — not in Phase 1 scope |
| Live MedusaJS backend | Phase 2 — architecture prepared for swap |
| Real payment processing | Mock only in Phase 1 |
| User accounts | Out of scope for Phase 1 |
| Admin dashboard | Out of scope for Phase 1 |
| Checkout validation | PRD notes "validation scoped to later phase" |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| LAND-01 to LAND-07 | Phase 1 | Pending |
| GALL-01 to GALL-04 | Phase 1 | Pending |
| PDP-01 to PDP-12 | Phase 1 | Pending |
| CART-01 to CART-05 | Phase 1 | Pending |
| CHKT-01 to CHKT-07 | Phase 1 | Pending |
| ANLY-01 to ANLY-05 | Phase 1 | Pending |
| ARCH-01 to ARCH-06 | Phase 1 | Pending |

**Coverage:**
- v1 requirements: 35 total
- Mapped to phases: 35
- Unmapped: 0 ✓

---
*Requirements defined: 2026-05-16*
*Last updated: 2026-05-16 after initial definition*