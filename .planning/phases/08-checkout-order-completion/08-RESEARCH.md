# Phase 08: Checkout & Order Completion — Research

**Phase:** 08-checkout-order-completion
**Status:** Research Complete
**Gathered:** 2026-05-22

---

## Overview

Phase 8 implements the full checkout flow with Medusa payment processing and order creation. The checkout has 5 steps: cart review, shipping address, shipping method, payment, and completion.

---

## Key Patterns

### 1. Update Cart Shipping Address

```typescript
await sdk.store.cart.update(cartId, {
  shipping_address: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Main St",
    city: "Mumbai",
    country_code: "IN",
    postal_code: "400001",
    phone: "+91 9876543210",
  },
})
```

### 2. List Shipping Methods

```typescript
const { cart } = await sdk.store.cart.retrieve(cartId, {
  fields: "id,shipping_methods,available_shipping_options",
})
// cart.available_shipping_options - array of shipping options
```

### 3. Add Shipping Method to Cart

```typescript
await sdk.store.cart.addShippingMethod(cartId, {
  option_id: selectedOptionId,
  data: {},
})
```

### 4. Complete Cart (Place Order)

```typescript
const { type, order, error, cart: failedCart } = await sdk.store.cart.complete(cartId)

// type === "order" → success, redirect to confirmation
// type === "cart" → failure, show error
```

### 5. After Successful Order

```typescript
// Unset cart ID from localStorage
localStorage.removeItem("cart_id")

// Reset cart store state
useCartStore.getState().clearCart()
```

---

## Checkout Flow (5 Steps)

1. **Cart Review** — Review items, quantities, totals (existing cart page)
2. **Shipping Address** — Form to collect customer address → `sdk.store.cart.update()`
3. **Shipping Method** — Select from `available_shipping_options` → `sdk.store.cart.addShippingMethod()`
4. **Payment** — Select payment provider → `initiatePaymentSession()` → `sdk.store.cart.complete()`
5. **Confirmation** — Show order details, clear cart

---

## Files to Create/Modify

| File | Purpose |
|------|---------|
| `app/checkout/page.tsx` | Multi-step checkout page |
| `components/checkout/AddressForm.tsx` | Shipping address form |
| `components/checkout/ShippingMethodForm.tsx` | Shipping method selection |
| `components/checkout/PaymentForm.tsx` | Payment provider selection |
| `components/checkout/OrderSummary.tsx` | Order summary sidebar |
| `app/order-confirmation/page.tsx` | Order confirmation page |
| `store/cartStore.ts` | Already exists (Phase 6) — may need `clearCart()` update |

---

## Requirements Coverage

| ID | Requirement | Implementation |
|----|-------------|----------------|
| CHKT-11 | Shipping address form submits to Medusa cart | `AddressForm` → `sdk.store.cart.update()` |
| CHKT-12 | Shipping method selection from `available_shipping_methods` | `ShippingMethodForm` → `sdk.store.cart.addShippingMethod()` |
| CHKT-13 | Payment step with Medusa payment providers | `PaymentForm` → `initiatePaymentSession()` |
| CHKT-14 | `cart.complete()` creates Medusa order | `sdk.store.cart.complete()` |
| CHKT-15 | Order confirmation page displays real order data | `app/order-confirmation/page.tsx` |
| CHKT-16 | Post-checkout cart cleared | `clearCart()` + localStorage removal |

---

## Success Criteria

1. Shipping address form submits to Medusa cart via `sdk.store.cart.update()`
2. Shipping method selection displays options from `sdk.store.cart.retrieve()` `available_shipping_methods`
3. Payment step shows configured Medusa payment providers
4. `cart.complete()` atomically processes payment and creates Medusa order
5. Order confirmation page displays real order data from Medusa response
6. Post-checkout cart cleared and localStorage cart ID removed

---

## Medusa SDK Reference

- `sdk.store.cart.update(cartId, { shipping_address })` — Set shipping address
- `sdk.store.cart.retrieve(cartId, { fields: "*,shipping_methods,available_shipping_options" })` — Get shipping options
- `sdk.store.cart.addShippingMethod(cartId, { option_id, data })` — Add shipping method
- `sdk.store.cart.complete(cartId)` — Complete cart, create order
- Payment collection: `sdk.payment.createPaymentCollection()` + `initiatePaymentSession()`

---

## Notes

- Checkout requires authenticated user (Phase 7) — add auth check
- Use System Payment Provider (default) for MVP — no Stripe integration needed yet
- Handle "zero total" edge case (free shipping, etc.)
- Mobile-responsive layout for checkout forms