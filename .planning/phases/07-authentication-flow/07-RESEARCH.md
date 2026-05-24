# Phase 07: Authentication Flow — Research

**Phase:** 07-authentication-flow
**Status:** Research Complete
**Gathered:** 2026-05-22

---

## Overview

Phase 7 implements customer authentication using MedusaJS SDK's auth module. The SDK handles JWT token storage and auto-attaches tokens to all subsequent requests — no manual header management needed.

---

## Key Patterns

### 1. Login (`sdk.auth.login`)

```typescript
// Login customer with email/password
const { success, authToken, location } = await sdk.auth.login(
  "customer",           // actor type
  "emailpass",          // auth provider
  { email, password }
)
```

- Returns `authToken` (JWT) on success
- `location` header indicates if user needs registration step
- SDK auto-stores JWT and attaches to subsequent requests
- Throws on failure → catch and display error

### 2. Registration (`sdk.auth.register`)

```typescript
// Register new customer
const { success, authToken } = await sdk.auth.register(
  "customer",
  "emailpass",
  { email, password, first_name, last_name, ... }
)
```

- Creates customer account in Medusa
- Auto-logs in after registration
- Returns JWT token

### 3. Logout (`sdk.auth.logout`)

```typescript
// Clear JWT from storage
await sdk.auth.logout()
```

- Clears stored JWT from localStorage
- All subsequent requests become unauthenticated

### 4. Auth State Check

```typescript
// Check if user is authenticated
const isAuthenticated = await sdk.auth.isAuthenticated()

// Get current user
const { user } = await sdk.auth.getSession()
```

### 5. Manual Token Management

```typescript
// Set token manually (if needed)
sdk.client.setToken("jwt-token")

// Clear token manually
sdk.client.clearToken()
```

---

## Architecture

### Auth Store (Zustand)

```typescript
interface AuthStore {
  isAuthenticated: boolean
  user: MedusaCustomer | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterInput) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}
```

### Files to Create/Modify

| File | Purpose |
|------|---------|
| `store/authStore.ts` | Zustand auth store with login/register/logout/checkAuth |
| `app/login/page.tsx` | Login form component |
| `app/register/page.tsx` | Registration form component |
| `components/auth/LoginForm.tsx` | Login form with email/password fields |
| `components/auth/RegisterForm.tsx` | Registration form with all fields |
| `components/auth/AuthCallback.tsx` | Handle post-auth redirect (if needed) |
| `lib/auth.ts` | Auth utilities (isAuthenticated check, getUser) |
| `middleware.ts` | Protect routes requiring auth (if needed) |

### Auth Flow

1. **Login:** User submits form → `sdk.auth.login()` → success → store user → redirect
2. **Register:** User submits form → `sdk.auth.register()` → success → store user → redirect
3. **Persist:** On app load, call `sdk.auth.isAuthenticated()` → restore session if valid
4. **Logout:** User clicks logout → `sdk.auth.logout()` → clear store → redirect to login

### Cart Merge on Login

When a logged-in user has items in local cart (stored with cartId in localStorage), after login the cart should be merged or the user's saved cart should take priority. Phase 6 used server-as-source-of-truth so no merge needed — just use the authenticated user's cart.

---

## Requirements Coverage

| ID | Requirement | Implementation |
|----|-------------|----------------|
| AUTH-01 | Customer login via `sdk.auth.login()` | `store/authStore.ts` `login()` action |
| AUTH-02 | Customer registration via `sdk.auth.register()` | `store/authStore.ts` `register()` action |
| AUTH-03 | JWT token auto-stored and attached to requests | SDK handles automatically via `jwtTokenStorageMethod: "custom"` |
| AUTH-04 | Customer logout (token removal from localStorage) | `store/authStore.ts` `logout()` action calls `sdk.auth.logout()` |
| AUTH-05 | Auth state preserved across page refresh | On app init, check `sdk.auth.isAuthenticated()` and restore session |
| AUTH-06 | Login/Register UI components | `app/login/page.tsx`, `app/register/page.tsx` with forms |

---

## Edge Cases

1. **Existing account on register:** Medusa returns error on duplicate email → catch and show "Email already registered" message
2. **Failed login:** Show "Invalid email or password" message (don't reveal which field is wrong for security)
3. **Token expiry:** SDK will return 401 → handle by redirecting to login
4. **Cart ownership:** After login, cart operations use authenticated user's cart ID

---

## Medusa Auth API Reference

- `sdk.auth.login(actorType, provider, credentials)` → `{ authToken, location }`
- `sdk.auth.register(actorType, provider, credentials)` → `{ authToken }`
- `sdk.auth.logout()` → clears token
- `sdk.auth.isAuthenticated()` → `Promise<boolean>`
- `sdk.auth.getSession()` → `{ user }`
- `sdk.client.setToken(token)` → manual token setting
- `sdk.client.clearToken()` → manual token clearing

---

## Dependencies

- Phase 6 completed (cart store with Medusa sync)
- No additional npm packages needed — `@medusajs/js-sdk` already installed
- Uses existing `lib/sdk.ts` singleton

---

## Notes

- Auth state stored in Zustand for React reactivity
- JWT token stored via SDK's custom storage (localStorage via lib/sdk.ts config)
- No middleware needed for client-side auth — check auth on app load and protect routes in components
- Registration flow: `auth.register()` creates customer, then auto-login