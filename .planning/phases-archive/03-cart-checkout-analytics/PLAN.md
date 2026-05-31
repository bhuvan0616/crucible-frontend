# Phase 3 Plan: Cart, Checkout & Analytics

**Phase:** 03-cart-checkout-analytics
**Wave Structure:** 3 waves, 3 plans total

## Wave 1 (Foundation — depends on: none)
- **03-01-PLAN.md** — Cart page with items list, quantity controls, order summary

## Wave 2 (Checkout — depends on: Wave 1)
- **03-02-PLAN.md** — Checkout page with shipping form, delivery, promo, payment

## Wave 3 (Analytics & Finish — depends on: Wave 1 + Wave 2)
- **03-03-PLAN.md** — Order success page, GA4 integration, proxy.ts

## Dependency Graph

```
Wave 1 (03-01)
└── Cart page + CartItemCard + CartSummary + store extensions

Wave 2 (03-02) [depends on Wave 1]
└── CheckoutForm + DeliveryOptions + OrderSummary + PromoCodeInput + PaymentMethods + Checkout page

Wave 3 (03-03) [depends on Wave 1 + Wave 2]
├── GA4 helpers (lib/analytics/ga4.ts)
├── GA4 script injection (layout.tsx)
├── GA4 event wiring (ShopProductCard, AddToCartSection, Checkout)
├── Order success page
└── proxy.ts
```

## Source Coverage Audit

| Requirement ID | Plan |
|---------------|------|
| CART-01 (display items) | 03-01 |
| CART-02 (quantity controls) | 03-01 |
| CART-03 (subtotal) | 03-01 |
| CART-04 (shipping display) | 03-01 |
| CART-05 (proceed to checkout) | 03-01 |
| CHKT-01 (shipping form) | 03-02 |
| CHKT-02 (delivery options) | 03-02 |
| CHKT-03 (order summary) | 03-02 |
| CHKT-04 (promo code) | 03-02 |
| CHKT-05 (payment methods) | 03-02 |
| CHKT-06 (place order) | 03-02 |
| CHKT-07 (checkout navigation) | 03-02 |
| ANLY-01 (GA4 script) | 03-03 |
| ANLY-02 (add_to_cart event) | 03-03 |
| ANLY-03 (begin_checkout event) | 03-03 |
| ANLY-04 (purchase event) | 03-03 |
| ANLY-05 (afterInteractive) | 03-03 |
| ARCH-05 (proxy.ts) | 03-03 |
| ARCH-06 (cart store extensions) | 03-01 |

All 18 requirements covered. All 11 success criteria covered.

## Files Created

| Plan | Files |
|------|-------|
| 03-01 | app/cart/page.tsx, components/cart/CartItemCard.tsx, components/cart/CartSummary.tsx, store/cartStore.ts (extensions) |
| 03-02 | app/checkout/page.tsx, components/checkout/CheckoutForm.tsx, components/checkout/DeliveryOptions.tsx, components/checkout/OrderSummary.tsx, components/checkout/PromoCodeInput.tsx, components/checkout/PaymentMethods.tsx |
| 03-03 | app/order-success/page.tsx, lib/analytics/ga4.ts, app/layout.tsx (GA4), proxy.ts |

## Next Steps

Execute: `/gsd-execute-phase 03`

Or run plans individually:
- `/gsd-execute-phase 03 --plan 03-01`
- `/gsd-execute-phase 03 --plan 03-02`
- `/gsd-execute-phase 03 --plan 03-03`