---
status: root_cause_found
trigger: "Add to cart is not working"
created: 2026-05-24
updated: 2026-05-24
symptoms:
  expected_behavior: "Clicking adds item to cart"
  actual_behavior: "Nothing happens"
  error_messages: "No error shown"
  timeline: "Started recently"
  reproduction: "Started recently"
---

## Current Focus

**next_action:** offer fix options

---

## Evidence

- timestamp: 2026-05-24
  finding: |
    cartStore.ts line 97-98: addItem() returns early if cartId is null
    addItem checks: const { cartId } = get(); if (!cartId) return;
  source: store/cartStore.ts

- timestamp: 2026-05-24
  finding: |
    cartStore.ts line 62: initCart() sets isInitialized=true and creates/retrieves cartId
    initCart() is the only place where cartId gets set
  source: store/cartStore.ts

- timestamp: 2026-05-24
  finding: |
    Cart page (app/cart/page.tsx) calls initCart() in useEffect - but PDP never does
    cart page useEffect calls initCart only when !isInitialized
  source: app/cart/page.tsx

- timestamp: 2026-05-24
  finding: |
    Providers (app/providers.tsx) only calls checkAuth() - cart init never called at app level
    ProductPageClient never calls initCart()
  source: app/providers.tsx, components/product/ProductPageClient.tsx

- timestamp: 2026-05-24
  finding: |
    Root cause: When user clicks Add to Cart on PDP without visiting cart page first,
    cartId is null (never initialized), so addItem() returns early silently.
  source: analysis

---

## Eliminated

- SDK client configuration (cart page works after visiting cart page first)
- onClick handler wiring (properly connected through props)
- Zustand store setup (store is correctly configured)

---

## Resolution

**root_cause:** cartStore.initCart() is never called before addItem() on PDP — cartId is null causing silent early return

**fix:** Added initCart() call in app/providers.tsx useEffect alongside checkAuth()

**specialist_hint:** typescript

**verification:** Test Add to Cart on PDP without visiting cart page first