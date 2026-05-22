# Feature Landscape: MedusaJS v2 Storefront Integration

**Domain:** Ecommerce storefront with MedusaJS v2 backend integration
**Researched:** 2026-05-22
**Overall confidence:** HIGH

## Executive Summary

MedusaJS v2 provides a headless commerce platform with a modular Store API and `@medusajs/js-sdk` for frontend integration. The architecture separates the storefront (any frontend framework) from the Medusa backend, communicating via REST API. Key integration points include product fetching, cart management with persistent cart IDs, customer authentication with JWT tokens, and a checkout flow that culminates in `cart.complete()` to place orders.

The mock data structure currently in the project mirrors MedusaJS v2 schema, making Phase 2 backend swap straightforward.

---

## Product Fetching

### Table Stakes

| Feature | Expected Behavior | Complexity |
|---------|-------------------|------------|
| List products | `GET /store/products` returns products with variants, optional `fields` param for `+variants.inventory_quantity` | Low |
| Get product by ID | `GET /store/products/:id` returns single product with variants | Low |
| Get variant details | `GET /store/variants/:id` returns variant with inventory and calculated pricing | Low |
| Variant pricing | `calculated_price` object includes `calculated_amount`, `calculated_amount_with_tax`, `price_list_type` | Medium |

### JS SDK Methods

```typescript
// List products with variants
sdk.store.product.list({ fields: "*variants.calculated_price,+variants.inventory_quantity" })

// Get single product
sdk.store.product.retrieve(productId)

// Get variant with calculated price (requires region_id for tax-inclusive pricing)
sdk.store.variant.retrieve(variantId, { region_id: "reg_xxx", country_code: "US" })
```

### Key Behavior

- Products require a **region_id** for calculated pricing with tax
- Inventory quantity retrieval requires `+variants.inventory_quantity` in fields
- Published API key scope determines accessible sales channels and stock locations
- Medusa manages inventory only when `manage_inventory: true` on variant

---

## Cart Operations

### Table Stakes

| Feature | Expected Behavior | Complexity |
|---------|-------------------|------------|
| Create cart | `POST /store/carts` with `region_id` creates cart, store `cart.id` in localStorage | Low |
| Add item | `POST /store/carts/:id/line-items` with `variant_id` + `quantity` | Low |
| Update quantity | `POST /store/carts/:id/line-items/:line_id` with new `quantity` | Low |
| Remove item | `DELETE /store/carts/:id/line-items/:line_id` | Low |
| Calculate totals | Automatic on every cart mutation (subtotal, shipping, tax, total) | Low |

### JS SDK Methods

```typescript
// Create cart
sdk.store.cart.create({ region_id: regionId }).then(({ cart }) => {
  localStorage.setItem("cart_id", cart.id)
})

// Add item to cart
sdk.store.cart.createLineItem(cartId, {
  variant_id: variantId,
  quantity: 1,
  metadata: { customization: "NAME" }  // optional custom data
})

// Update line item quantity
sdk.store.cart.updateLineItem(cartId, lineItemId, { quantity: 3 })

// Remove line item
sdk.store.cart.deleteLineItem(cartId, lineItemId)
```

### Key Behavior

- **Cart ID persistence**: Store `cart.id` in localStorage, check on app load and create new cart if missing
- **Metadata support**: Line items accept `metadata` for custom fields (e.g., engraving text)
- **Cart calculation**: Medusa auto-calculates `item_subtotal`, `shipping_total`, `tax_total`, `total` on every mutation
- **No manual calculation needed**: Totals are returned in cart response

### Cart Response Shape

```typescript
{
  cart: {
    id: string,
    items: Array<{
      id: string,
      variant_id: string,
      quantity: number,
      product_id: string,
      product_title: string,
      variant_title: string,
      thumbnail: string,
      unit_price: number,
      metadata: Record<string, unknown>
    }>,
    item_subtotal: number,
    shipping_total: number,
    tax_total: number,
    total: number,
    shipping_address: Address | null,
    billing_address: Address | null,
    shipping_methods: ShippingMethod[]
  }
}
```

---

## Customer Authentication

### Table Stakes

| Feature | Expected Behavior | Complexity |
|---------|-------------------|------------|
| Register | `POST /auth/customer/emailpass` → JWT token, then `sdk.store.customer.create()` | Medium |
| Login | `POST /auth/customer/emailpass` → JWT token auto-stored for subsequent requests | Low |
| Logout | Remove JWT from localStorage (client-side, no API call) | Low |
| Retrieve customer | `sdk.store.customer.retrieve()` returns authenticated customer | Low |
| JWT handling | Token auto-managed by SDK, included in subsequent request headers | Low |

### JS SDK Methods

```typescript
// Register (Step 1: get token)
await sdk.auth.register("customer", "emailpass", {
  email: "customer@example.com",
  password: "password123"
})

// Register (Step 2: create customer profile)
const { customer } = await sdk.store.customer.create({
  email: "customer@example.com",
  password: "password123"
})

// Login
const token = await sdk.auth.login("customer", "emailpass", {
  email: "customer@example.com",
  password: "password123"
})

// Retrieve authenticated customer
const { customer } = await sdk.store.customer.retrieve()

// Logout (client-side token removal)
localStorage.removeItem("token")
```

### Key Behavior

- **JWT auto-storage**: After login/register, SDK automatically stores token and includes in headers
- **Third-party auth**: Google OAuth returns `{ location: string }` instead of token, requires callback handling
- **No server-side logout**: JWT removal is client-side only
- **Session vs JWT**: SDK supports both `session` (server-managed) and `jwt` (client-managed) auth types

---

## Checkout Flow

### Table Stakes

| Step | Expected Behavior | Complexity |
|------|-------------------|------------|
| Address | Set `shipping_address` and `billing_address` on cart | Low |
| Shipping | `GET /store/shipping-options` + select shipping method | Medium |
| Payment | `GET /store/payment-providers` + select payment provider | Medium |
| Complete order | `sdk.store.cart.complete(cartId)` → order placement | Low |

### JS SDK Methods

```typescript
// Update shipping address
sdk.store.cart.update(cartId, {
  shipping_address: {
    first_name: "John",
    last_name: "Doe",
    address_1: "123 Main St",
    city: "Mumbai",
    country_code: "IN",
    postal_code: "400001"
  }
})

// Update billing address (or use { use_shipping_as_billing: true })
sdk.store.cart.update(cartId, {
  billing_address: { ... }
})

// Get shipping options
sdk.store.cart.retrieve(cartId).then(({ cart }) => {
  // cart.shipping_methods available after address set
})

// Add shipping method
sdk.store.cart.addShippingMethod(cartId, {
  option_id: shippingOptionId
})

// Get payment providers
sdk.store.paymentProviders()

// Complete cart (place order)
sdk.store.cart.complete(cartId).then((data) => {
  if (data.type === "order") {
    // Success - redirect to confirmation
    router.push(`/confirmation/${data.order.id}`)
  } else {
    // Error - data.error.message contains reason
    alert(data.error.message)
  }
})
```

### Key Behavior

- **Address validation**: Cart requires shipping_address and billing_address before shipping methods available
- **Shipping methods**: Only available after addresses are set; `cart.shipping_methods` array
- **Order placement**: `cart.complete()` handles payment collection and creates order atomically
- **Payment redirect**: External payment providers (Stripe, PayPal) return redirect location for payment flow
- **Order confirmation**: Success response includes `{ type: "order", order: { id, ... } }`

### Checkout Step Sequence

```
Product → Address → Shipping → Payment → Complete
```

- Each step validates previous step data
- `cart.complete()` atomically processes payment and creates order
- Redirect to `/confirmation/:orderId` on success

---

## Order Placement

### Table Stakes

| Feature | Expected Behavior | Complexity |
|---------|-------------------|------------|
| Complete cart | `cart.complete()` creates order from cart | Low |
| Order retrieval | `GET /store/orders/:id` for order details | Low |
| Order confirmation | Display order summary, ID, status | Low |

### Key Behavior

- **Atomic operation**: `cart.complete()` handles payment processing and order creation in one transaction
- **Payment capture**: For mock checkout (Razorpay/UPI/Cards), payment is collected before calling `complete()`
- **Post-checkout**: Medusa handles inventory deduction, order creation, notifications

---

## Anti-Features

| Anti-Pattern | Why Avoid | What To Do Instead |
|--------------|-----------|---------------------|
| Server-side cart storage | Medusa expects cart_id from client | Store in localStorage/sessionStorage |
| Direct price calculation | Prices vary by region, tax context | Use `calculated_price` from API |
| Storing JWT in cookies | XSS vulnerable | SDK handles secure storage |
| Bypassing `cart.complete()` | Payment won't be captured | Use official checkout flow |
| Hardcoding variant IDs | Products can be unpublished | Fetch from `/store/products` |

---

## Feature Dependencies

```
Product List → Product Detail ( PDP ) → Add to Cart → Checkout Flow
                    ↓                       ↓              ↓
              Variant Selection     Create/Update Cart   Address
                                                         ↓
                                                   Shipping Method
                                                         ↓
                                                   Payment Provider
                                                         ↓
                                                   Complete Order
```

---

## MVP Recommendation

### Phase 2 Priorities (MedusaJS Integration)

1. **Product fetch** - Replace mock `productService.ts` with `@medusajs/js-sdk`
2. **Cart create on first access** - Implement localStorage cart_id persistence
3. **Add to cart with metadata** - Pass engraving text in line item metadata
4. **Cart display** - Read-only customization from line item metadata

### Phase 3 Priorities (Checkout Completion)

1. **Address step** - Set shipping/billing on cart
2. **Shipping step** - Fetch and select shipping options
3. **Payment step** - Integrate payment provider (Medusa handles collection)
4. **Order completion** - Call `cart.complete()`, redirect to confirmation

---

## Sources

- [Medusa Storefront Development](https://docs.medusajs.com/resources/storefront-development) — HIGH (official docs)
- [Medusa JS SDK Reference](https://docs.medusajs.com/references/js_sdk) — HIGH (official docs)
- [Express Checkout Guide](https://docs.medusajs.com/resources/storefront-development/guides/express-checkout) — HIGH
- [Cart Management](https://docs.medusajs.com/resources/storefront-development/cart/manage-items) — HIGH
- [Customer Authentication](https://docs.medusajs.com/resources/storefront-development/customers/login) — HIGH