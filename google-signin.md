# Google Sign-In Implementation Steps

## 1. Authenticate User

Call this function when user clicks "Sign in with Google":

```typescript
const loginWithGoogle = async () => {
  const result = await sdk.auth.login("customer", "google", {})

  if (typeof result === "object" && result.location) {
    window.location.href = result.location
    return
  }

  if (typeof result !== "string") {
    alert("Authentication failed")
    return
  }

  // User already authenticated, token stored in SDK
  const { customer } = await sdk.store.customer.retrieve()
  console.log(customer)
}
```

## 2. Handle OAuth Callback

Create a page/component at `/auth/callback/google` (or your callback route):

```typescript
import { sdk } from "@/lib/sdk"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function GoogleCallback() {
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const queryParams = Object.fromEntries(searchParams.entries())

    sdk.auth.callback("customer", "google", queryParams)
      .then(() => {
        window.location.href = "/" // redirect to home/dashboard
      })
      .catch(() => {
        window.location.href = "/login?error=auth_failed"
      })
  }, [searchParams])

  return <div>Signing in...</div>
}
```

## 3. Update Google Cloud Console

Add this callback URL in Google Cloud Console > APIs & Services > Credentials > OAuth client:

```
http://localhost:3000/auth/customer/google/callback
```

## 4. Verify Authentication

After login, include the token in requests:

```typescript
// SDK automatically includes token in headers after login
// For manual verification:

const { customer } = await sdk.store.customer.retrieve()
```

## Endpoint Summary

| Action | Endpoint | Method |
|--------|----------|--------|
| Start Google Auth | `/auth/customer/google` | POST |
| Handle Callback | `/auth/customer/google/callback` | POST |