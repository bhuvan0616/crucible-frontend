---
status: fix_applied
trigger: "Customer email address missing in orders when using email/password sign-in. Works fine with Google sign-in."
created: 2026-05-27T00:00:00.000Z
updated: 2026-05-30T00:00:00.000Z
---

## Resolution

**Root cause:** Email/password registration called `auth.login()` after `customer.create()`, which could bind the session to a different customer record than the one just created. Google sign-in correctly used `auth.refresh()` after customer creation.

**Fix applied:** Commit `4378729` — `store/authStore.ts` register flow now calls `sdk.auth.refresh()` after `customer.create()`, matching the Google flow.

```typescript
await sdk.auth.register("customer", "emailpass", data);
const { customer } = await sdk.store.customer.create({ ... });
await sdk.auth.refresh(); // was auth.login()
```

**Verification:** Manual UAT pending — register new email/password account, place order, confirm customer email appears on order record.

---

## Historical Notes

hypothesis: CONFIRMED — login() after register created wrong customer binding; refresh() aligns JWT with created customer.
test: Compare Google flow (refresh) vs email/password flow (was login)
fix_commit: 4378729
