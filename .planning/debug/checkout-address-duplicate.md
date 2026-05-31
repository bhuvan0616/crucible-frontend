---
status: resolved
trigger: "On checkout page, selecting a saved address and clicking 'Continue to Shipping' duplicates the address. Save address is being called again."
created: 2026-05-30T00:00:00.000Z
updated: 2026-05-30T00:00:00.000Z
symptoms:
  expected_behavior: "Selecting a saved address should only apply it to the cart, not create a duplicate customer address"
  actual_behavior: "A duplicate saved address appears in the customer's address list"
  error_messages: "None reported"
  timeline: "Observed during checkout with saved addresses"
  reproduction: "Login → checkout → select saved address card → Continue to Shipping"
---

## Current Focus

hypothesis: "CONFIRMED — handleSubmit always calls addAddress() when formData has first_name, address_1, and address_name. Selecting a saved address copies those fields into formData, so submit re-creates the same address via sdk.store.customer.createAddress()."
test: "Trace handleSubmit in AddressForm.tsx when selectedAddressId is set"
expecting: "addAddress runs unconditionally for any populated formData, including saved-address selection"
next_action: "Skip addAddress when using an existing saved address (selectedAddressId set or !showNewAddressForm with selection)"

---

## Evidence

- `components/checkout/AddressForm.tsx:109-120` — `addAddress()` called if authenticated and form fields populated, with no check for existing saved selection
- `handleAddressSelect` copies saved address into `formData` including `address_name`
- `store/authStore.ts:139` — `addAddress` always calls `sdk.store.customer.createAddress()`

---

## Resolution

root_cause: Submit handler saves address on every continue click when form fields are filled, including when those fields came from an existing saved address selection.
fix: Only call addAddress when entering a new address (showNewAddressForm or no saved addresses) and no selectedAddressId.
verification: Select saved address → Continue → address list count unchanged; add new address → Continue → one new address added.
files_changed:
  - components/checkout/AddressForm.tsx
