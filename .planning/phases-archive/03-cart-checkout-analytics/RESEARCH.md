# Phase 3 Research: Cart, Checkout & Analytics

## 1. Component Architecture

### Routes
- `/cart` — Cart page (read-only customization display)
- `/checkout` — Checkout page (shipping form, delivery, payment)
- `/order-success` — Order confirmation page

### Directory Structure
```
app/
├── cart/
│   └── page.tsx              # Cart page
├── checkout/
│   └── page.tsx              # Checkout page
├── order-success/
│   └── page.tsx              # Order success confirmation
lib/
└── analytics/
    └── ga4.ts                # GA4 event helpers
proxy.ts                      # Next.js 16 middleware replacement
```

### Key Design Decisions
- Cart page: read-only customization display, quantity controls, subtotal/shipping
- Checkout: mock shipping form, delivery options, payment method selection
- Cart state already in Zustand (`crucible-cart` persisted)
- GA4 injected in layout.tsx with `afterInteractive` strategy

---

## 2. Cart Page (`/cart`)

### Requirements (CART-01 to CART-05)
- Display all cart items with product image, name, variant, customization text
- Read-only customization display (no edit on cart page)
- Quantity controls (+/-) that update Zustand store
- Subtotal calculation per item and total
- Estimated shipping display
- "Proceed to Checkout" button → `/checkout`

### Component Structure
- `CartItemCard` — line item with image, info, quantity controls, remove
- `CartSummary` — subtotal, shipping estimate, total, checkout button

### Data Flow
- Read from `useCartStore()` — items, selectors for total
- Quantity changes call `updateQuantity(id, quantity)`
- Remove calls `removeItem(id)`
- No server sync (Phase 3 mock)

---

## 3. Checkout Page (`/checkout`)

### Requirements (CHKT-01 to CHKT-07)
1. Shipping form — name, address, phone (mock validation)
2. Delivery options — Standard (free >₹499), Express (₹99)
3. Order summary sidebar — items, quantities, subtotal, shipping, total
4. Promo code field — mock validation ("SAVE10" for 10% off)
5. Payment method selection — Razorpay, UPI, Cards (visual only)
6. "Place Order" button → `/order-success`

### Component Structure
- `CheckoutForm` — shipping inputs with validation
- `DeliveryOptions` — radio buttons for shipping
- `OrderSummary` — sticky sidebar with cart items
- `PromoCodeInput` — text field with apply button
- `PaymentMethods` — radio group for Razorpay/UPI/Cards
- `PlaceOrderButton` — submits form, navigates to success

### Form Validation (mock)
- Required: name, address, phone
- Phone: 10 digits
- "Apply" button for promo — validates against hardcoded codes

### Promo Codes (mock)
- `SAVE10` — 10% off
- `FREESHIP` — free shipping
- Invalid code shows error message

---

## 4. Order Success Page (`/order-success`)

### Requirements
- Display "Order Placed Successfully" message
- Show order number (generated UUID)
- Show order summary
- "Continue Shopping" button → `/shop`

### Implementation
- Generate random order ID on mount
- Display order details in a success card
- No cart clearing (user can continue shopping while order processes)

---

## 5. GA4 Analytics Integration

### Requirements (ANLY-01 to ANLY-05)
1. GA4 script injected in layout.tsx with afterInteractive
2. `add_to_cart` event — fires when item added to cart
3. `begin_checkout` event — fires when user navigates to `/checkout`
4. `purchase` event — fires on order success page

### Implementation

**GA4 Script Injection (`app/layout.tsx`):**
```typescript
// In RootLayout, after <Navbar />
<script
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
  strategy="afterInteractive"
/>
<script dangerouslySetInnerHTML={{
  __html: `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
  `
}} />
```

**Event Helpers (`lib/analytics/ga4.ts`):**
```typescript
export function trackAddToCart(product: Product, quantity: number) {
  gtag('event', 'add_to_cart', {
    currency: 'INR',
    value: product.price * quantity / 100,
    items: [{
      item_id: product.id,
      item_name: product.title,
      item_category: product.edition,
      quantity: quantity,
    }]
  });
}

export function trackBeginCheckout(cartItems: CartItem[], total: number) {
  gtag('event', 'begin_checkout', {
    currency: 'INR',
    value: total / 100,
    items: cartItems.map(item => ({
      item_id: item.productId,
      item_name: item.productId,
      quantity: item.quantity,
    }))
  });
}

export function trackPurchase(orderId: string, cartItems: CartItem[], total: number) {
  gtag('event', 'purchase', {
    transaction_id: orderId,
    currency: 'INR',
    value: total / 100,
    items: cartItems.map(item => ({
      item_id: item.productId,
      item_name: item.productId,
      quantity: item.quantity,
    }))
  });
}
```

---

## 6. proxy.ts (Next.js 16 Middleware Replacement)

### Why needed
- Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`
- Used for redirects, auth checks, header modifications

### Location
- `proxy.ts` at root (same level as `app/`)

### Initial Implementation
```typescript
// proxy.ts — Phase 3 scope only
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const url = new URL(request.url);

  // Redirect /cart to /checkout if cart is empty
  if (url.pathname === '/cart') {
    // Allow cart access — no redirect
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/cart', '/checkout', '/order-success'],
};
```

### Expanded scope (future phases)
- Auth middleware
- Analytics headers
- Feature flags

---

## 7. State Management

### Cart Store (existing)
- `useCartStore` — items, addItem, removeItem, updateQuantity, clearCart
- `selectCartTotal` — sum of price * quantity
- `selectCartItemCount` — sum of quantities

### New Selectors Needed
```typescript
// Shipping calculation
const selectShippingCost = (state) => {
  const total = selectCartTotal(state);
  return total >= 49900 ? 0 : 9900; // Free over ₹499, else ₹99
};

// Cart items with formatted data
interface CartItemDisplay {
  id: string;
  productId: string;
  variant: string;
  customization: string;
  quantity: number;
  price: number;
  imageUrl: string;
  subtotal: number;
}
```

---

## 8. Design System Alignment

- Use `var(--color-lime)` for CTAs and prices
- Use `var(--color-ink-deep)` for card backgrounds
- Use `var(--color-hairline-violet)` for borders
- Consistent border-radius: 18px for cards, 12px for inputs, 8px for buttons
- Typography: Rubik font (loaded via globals.css)

### Cart Page Styling
- Full-width container with centered content
- Cart items in a vertical stack
- Sticky order summary sidebar on desktop (right side)
- Mobile: stacked layout, summary below items

### Checkout Page Styling
- Two-column layout: form left (60%), summary right (40%)
- Sticky summary panel on desktop
- Mobile: single column, summary collapsed at top

---

## 9. Dependencies

### Already Installed
- `framer-motion` — animations
- `zustand` — cart state (with persist)
- `uuid` — order IDs

### No New Dependencies Required
- GA4 via script tag (no npm package)
- All components use existing shadcn/ui primitives

---

## 10. Implementation Notes

### Phase 3 Scope
- Cart page, checkout page, order success page
- GA4 integration (script + event helpers)
- proxy.ts for middleware replacement
- No real payment processing — mock only

### Mock Data
- Hardcoded promo codes: `SAVE10`, `FREESHIP`
- Shipping: free over ₹499, else ₹99
- Payment methods: visual selection only (no integration)

### Testing Checklist
- [ ] Add to cart fires GA4 event
- [ ] Checkout page fires GA4 event
- [ ] Order success fires GA4 purchase event
- [ ] Cart quantity controls work
- [ ] Promo code validation works
- [ ] Order success shows generated order ID