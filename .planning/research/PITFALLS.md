# Domain Pitfalls: MedusaJS v2 + Next.js Integration

**Project:** Crucible Creations Storefront
**Domain:** Backend integration (replacing mock data with live MedusaJS)
**Researched:** 2026-05-22
**Confidence:** MEDIUM-HIGH

## Executive Summary

Integrating MedusaJS v2 with an existing Next.js storefront introduces several categories of pitfalls that can cause data inconsistency, auth failures, performance issues, and UX problems. The most critical issues involve **cart state synchronization** between local Zustand state and Medusa's server-side cart, **price formatting** (Medusa returns amounts in smallest unit like paise), and **JWT token lifecycle management**. These pitfalls are well-documented in Medusa's own storefront development guides and community discussions.

## Critical Pitfalls

### 1. Cart State Desync (Local vs Server)

**What goes wrong:** Zustand store holds local cart state that diverges from Medusa's server cart after operations like add/update/remove. Users see stale items, incorrect quantities, or prices that don't match what Medusa calculated.

**Why it happens:** Optimistic UI updates modify local state immediately, but if the Medusa API call fails or returns different data, the local state isn't reconciled. Concurrent operations (rapidly clicking "Add to Cart" twice) can create race conditions where the server cart state doesn't match what the client expects.

**Consequences:** 
- Item appears added but isn't in Medusa's cart
- Quantity updates lost or doubled
- Price calculations inconsistent between UI and checkout
- `refreshCartItemsWorkflow` not called, causing stale promo/tax calculations

**Prevention:**
```typescript
// Always sync with server after cart operations
const addToCart = async (variantId: string, quantity: number) => {
  let currentCart = cart
  
  if (!currentCart) {
    currentCart = await loadCart() // Create/get cart from Medusa first
    if (!currentCart) throw new Error("Could not create cart")
  }

  try {
    setLoading(true)
    const { cart: updatedCart } = await sdk.store.cart.createLineItem(
      currentCart.id,
      { variant_id: variantId, quantity },
      { fields: "+items.*" }  // Always fetch full items
    )
    setCart(updatedCart)  // Replace local state with server state
  } catch (err) {
    setError(err.message)
    throw err
  } finally {
    setLoading(false)
  }
}
```

**Use `refreshCartItemsWorkflow`:** After cart modifications, trigger a refresh to ensure prices, promotions, and taxes are recalculated correctly. Medusa's docs explicitly mention this workflow for ensuring cart data is consistent.

**Detection:**
- Log cart ID (`_medusa_cart_id` cookie) vs actual cart state
- Compare `cart.version` if available
- Check for 409 conflicts in API responses

---

### 2. JWT Token Handling and Refresh

**What goes wrong:** Auth tokens expire silently, causing 401 errors on protected endpoints (customer data, orders). Token refresh not implemented, or refresh token also expired.

**Why it happens:** Medusa issues short-lived JWT tokens. The JS SDK stores tokens but doesn't automatically refresh them before expiry. If the backend restarts, existing tokens may become invalid.

**Consequences:**
- "Unauthorized" errors on customer retrieval
- Checkout fails at payment step
- Order history inaccessible

**Prevention:**
```typescript
// Configure SDK with auth token handling
import Medusa from "@medusajs/js-sdk"

const sdk = new Medusa({
  baseUrl: process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000",
  publishableKey: process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY,
  auth: {
    tokenStorage: typeof window !== "undefined" ? localStorage : undefined,
   飞来: true, // Automatically include auth header
  },
})

// Handle token refresh manually if needed
const refreshToken = async () => {
  try {
    const { token } = await sdk.auth.refresh()
    // Token is automatically stored by the SDK
    return token
  } catch (err) {
    // Refresh failed - force re-login
    localStorage.removeItem("medusa_auth_token")
    window.location.href = "/login"
  }
}

// Use a check before protected operations
const withAuth = async (operation: () => Promise<any>) => {
  const token = localStorage.getItem("medusa_auth_token")
  if (token && isTokenExpiringSoon(token)) {
    await refreshToken()
  }
  return operation()
}
```

**CORS for auth routes:** Set `AUTH_CORS` environment variable to allow your storefront origin:
```
AUTH_CORS=http://localhost:3000,https://yourstore.com
```

---

### 3. Price Display (Smallest Unit - Paise)

**What goes wrong:** Prices display as raw numbers like `44900` instead of `₹449.00`. Products show `4999` instead of `₹49.99`.

**Why it happens:** Medusa returns prices in the smallest currency unit (paise for INR, cents for USD). The frontend mock data was in display format (rupees/dollars), but Medusa's API returns the integer amount in the smallest unit.

**Consequences:**
- Customers see meaningless numbers
- Trust issues at checkout
- Cart total appears 100x higher than expected

**Prevention:** Create a price formatting utility:
```typescript
// lib/utils/price.ts
export const formatPrice = (
  amount: number | null | undefined,
  currencyCode: string = "INR"
): string => {
  if (amount === null || amount === undefined) {
    return "Price unavailable"
  }
  
  // For INR/paise - divide by 100
  // For USD/cents - divide by 100
  // For currencies with 0 decimal places (JPY), don't divide
  const decimalPlaces = ["JPY", "KRW"].includes(currencyCode) ? 0 : 2
  
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currencyCode,
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  })
  
  return formatter.format(amount / (decimalPlaces === 0 ? 1 : 100))
}

// Usage in components
const PriceDisplay = ({ amount, currency = "INR" }) => (
  <span>{formatPrice(amount, currency)}</span>
)

// Medusa returns: { "amount": 44900 } for ₹449.00
// formatPrice(44900, "INR") → "₹449.00"
```

**In Next.js component:**
```tsx
// Display calculated price from Medusa (already smallest unit)
<span className="text-lg font-semibold">
  {formatPrice(variant.calculated_price?.calculated_amount, region?.currency_code)}
</span>
```

---

### 4. CORS Configuration

**What goes wrong:** Browser blocks requests to Medusa API with CORS error: `Access to fetch at 'http://localhost:9000' from origin 'http://localhost:3000' has been blocked by CORS policy`.

**Why it happens:** Medusa's default CORS configuration doesn't include your storefront origin. `storeCors`, `adminCors`, and `authCors` must be explicitly configured.

**Prevention:** In `medusa.config.ts`:
```typescript
module.exports = defineConfig({
  projectConfig: {
    http: {
      storeCors: process.env.STORE_CORS || "http://localhost:3000",
      adminCors: process.env.ADMIN_CORS || "http://localhost:7000,http://localhost:7001",
      authCors: process.env.AUTH_CORS || "http://localhost:3000",
    },
  },
})
```

In `.env`:
```env
STORE_CORS=http://localhost:3000,https://production-store.com
ADMIN_CORS=http://localhost:7000
AUTH_CORS=http://localhost:3000
```

**Note:** Multiple origins can be comma-separated. For production, always use HTTPS origins.

---

### 5. Race Conditions in Cart Operations

**What goes wrong:** Rapid clicks on "Add to Cart" cause duplicate line items, quantity miscalculations, or 409 conflicts. User sees "Item already in cart" or cart total is wrong.

**Why it happens:** Each click triggers an API call, but responses may arrive out of order. Without operation queuing or idempotency keys, concurrent requests cause inconsistent state.

**Prevention:**
```typescript
// Option 1: Disable button during loading
const AddToCartButton = ({ variantId }) => {
  const [isAdding, setIsAdding] = useState(false)
  
  const handleAddToCart = async () => {
    if (isAdding) return
    setIsAdding(true)
    try {
      await addToCart(variantId, 1)
    } finally {
      setIsAdding(false)
    }
  }
  
  return (
    <button disabled={isAdding} onClick={handleAddToCart}>
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  )
}

// Option 2: Use TanStack Query mutations with queue
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useAddToCart = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ variantId, quantity }) => {
      const cart = await retrieveCart()
      return sdk.store.cart.createLineItem(cart.id, {
        variant_id: variantId,
        quantity,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["cart"])
    },
  })
}

// Option 3: Use optimistic updates with rollback
// (See Medusa docs production-optimizations page for full implementation)
```

**Optimistic UI pattern** (recommended by Medusa docs):
```typescript
// optimistic-cart.ts utility for immediate UI feedback
export const createOptimisticCartItem = (
  variant: HttpTypes.StoreProductVariant,
  product: HttpTypes.StoreProduct,
  quantity: number = 1
): OptimisticCartItem => {
  const unitPrice = variant.calculated_price?.calculated_amount || 0
  
  return {
    id: `optimistic-${variant.id}-${Date.now()}`,
    variant_id: variant.id,
    quantity,
    title: product.title,
    thumbnail: product.thumbnail,
    unit_price: unitPrice,
    total: unitPrice * quantity,
    isOptimistic: true,
  }
}
```

---

### 6. Error Handling for Offline/Unavailable Backend

**What goes wrong:** User adds items to cart, backend becomes unreachable, no error shown, cart appears empty on reload. Or: Checkout hangs indefinitely instead of showing error.

**Why it happens:** No retry logic, no fallback states, no offline detection. API errors aren't caught or surfaced to the user.

**Prevention:**
```typescript
// fetchWithRetry from Medusa's best-practices docs
const MAX_RETRIES = 3
const RETRY_DELAY_MS = 1000

async function fetchWithRetry(
  url: string,
  retries = MAX_RETRIES
): Promise<Response> {
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

      const response = await fetch(url, {
        signal: controller.signal,
        headers: { "Connection": "keep-alive" },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      return response
    } catch (error: any) {
      lastError = error
      const isRetryable =
        error.code === "UND_ERR_SOCKET" ||
        error.code === "ECONNREFUSED" ||
        error.code === "ECONNRESET" ||
        error.code === "ETIMEDOUT" ||
        error.name === "AbortError"

      if (isRetryable && attempt < retries) {
        const delay = RETRY_DELAY_MS * Math.pow(2, attempt - 1)
        await new Promise((resolve) => setTimeout(resolve, delay))
      } else {
        break
      }
    }
  }

  throw lastError
}

// Cart context with offline handling
interface CartState {
  cart: HttpTypes.StoreCart | null
  isLoading: boolean
  error: string | null
  isOffline: boolean
}

const CartProvider = ({ children }) => {
  const [state, setState] = useState<CartState>({
    cart: null,
    isLoading: false,
    error: null,
    isOffline: false,
  })

  // Detect offline
  useEffect(() => {
    const handleOnline = () => setState(s => ({ ...s, isOffline: false }))
    const handleOffline = () => setState(s => ({ ...s, isOffline: true }))
    
    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)
    
    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  const addToCart = async (variantId: string, quantity: number) => {
    if (state.isOffline) {
      throw new Error("You appear to be offline. Please check your connection.")
    }

    setState(s => ({ ...s, isLoading: true, error: null }))
    try {
      const result = await fetchWithRetry(
        `/api/cart/add?variantId=${variantId}&quantity=${quantity}`
      )
      setState(s => ({ ...s, cart: result.cart, isLoading: false }))
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add item"
      setState(s => ({ ...s, error: message, isLoading: false }))
      throw err  // Re-throw so component can show toast/notification
    }
  }

  return (
    <CartContext.Provider value={{ ...state, addToCart }}>
      {children}
    </CartContext.Provider>
  )
}
```

**User-facing error states:**
```tsx
const CartError = ({ error, onRetry }) => (
  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
    <div className="flex items-center gap-2 text-red-800">
      <AlertCircle className="w-5 h-5" />
      <span>{error}</span>
    </div>
    <button
      onClick={onRetry}
      className="mt-2 text-sm text-red-600 hover:text-red-700"
    >
      Try Again
    </button>
  </div>
)

// Usage in cart page
{cartState.error && (
  <CartError error={cartState.error} onRetry={refetchCart} />
)}
```

---

### 7. Pagination with Large Product Catalogs

**What goes wrong:** Product listing page loads all products or fails with timeout. Navigation jumps or shows duplicate items. Performance degrades as catalog grows.

**Why it happens:** Not using Medusa's cursor-based pagination (offset/limit), fetching full catalog, or not implementing proper infinite scroll.

**Prevention:**
```typescript
// Product listing with proper pagination
const PRODUCTS_PER_PAGE = 12

export const useProducts = (categoryId?: string) => {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await sdk.store.product.list({
        limit: PRODUCTS_PER_PAGE,
        offset: pageParam,
        fields: "+variants.calculated_price,*category",
        // Filter by category if provided
        ...(categoryId && { category_id: [categoryId] }),
      })
      return {
        products: response.data.products,
        nextPageParam: response.data.count > (pageParam + PRODUCTS_PER_PAGE)
          ? pageParam + PRODUCTS_PER_PAGE
          : undefined,
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPageParam,
  })
}

// In component with infinite scroll
const ProductGrid = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useProducts()

  return (
    <div>
      <div className="grid grid-cols-3 gap-4">
        {data?.pages.flatMap(page => page.products).map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {hasNextPage && (
        <button onClick={fetchNextPage} disabled={isFetchingNextPage}>
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  )
}
```

**Alternative: Cursor-based pagination** (more efficient for large datasets):
```typescript
// Using 'cursor' parameter instead of offset
const response = await sdk.store.product.list({
  limit: 12,
  cursor: lastCursor,
  fields: "+variants.calculated_price",
})
// Response includes: response.data.nextCursor, response.data.previousCursor
```

**Server-side rendering with ISR** (recommended by Medusa docs):
```tsx
// app/store/products/page.tsx
export const revalidate = 3600 // Revalidate every hour

async function getProducts() {
  const response = await sdk.store.product.list({
    limit: 12,
    offset: 0,
    fields: "+variants.calculated_price",
  })
  return response.data
}

export default async function ProductsPage() {
  const { products, count } = await getProducts()
  
  return (
    <div>
      <h1>Products ({count})</h1>
      <ProductGrid initialProducts={products} />
    </div>
  )
}
```

---

## Moderate Pitfalls

### 8. Not Invalidating Queries After Mutations

**What goes wrong:** After adding item to cart, cart count in header still shows old number. UI shows stale data after operations.

**Why it happens:** TanStack Query (or your data fetching layer) caches product/cart data and doesn't know to refetch after mutations.

**Prevention:**
```typescript
export const useAddToCart = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ variantId, quantity }) => {
      const cart = await retrieveCart()
      return sdk.store.cart.createLineItem(cart.id, {
        variant_id: variantId,
        quantity,
      })
    },
    onSuccess: () => {
      // Invalidate cart queries to refetch fresh data
      queryClient.invalidateQueries(["cart"])
      // Also invalidate product cache if showing stock levels
      queryClient.invalidateQueries(["products"])
    },
  })
}
```

---

### 9. Stale Time Configuration for Dynamic Data

**What goes wrong:** Product prices don't update after admin changes them. Stock levels show as available when out of stock.

**Why it happens:** TanStack Query caches product data with long `staleTime`, so dynamic fields (price, inventory) aren't refreshed.

**Prevention** (from Medusa docs):
```typescript
// queryClient.ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes - OK for static data
    },
  },
})

// For dynamic data, override staleTime to 0
export const useProductPrice = (id: string) => {
  return useQuery(
    ["product-price", id],
    async () => {
      const response = await sdk.store.products.retrieve(id, {
        fields: "*variants.calculated_price",
      })
      return response.data.variants[0].price
    },
    {
      staleTime: 0, // Always fetch fresh price data
    }
  )
}
```

---

### 10. Forgetting `_medusa_cart_id` Cookie Sync

**What goes wrong:** Cart ID not properly stored/retrieved, so operations create new carts instead of updating existing one. User loses cart on page reload.

**Why it happens:** Relying on localStorage only, not syncing with `_medusa_cart_id` cookie that Medusa uses.

**Prevention:**
```typescript
// lib/data/cart.ts (from Next.js starter)
import { cookies } from "next/headers"

export const retrieveCart = async () => {
  const cookieStore = await cookies()
  const cartId = cookieStore.get("_medusa_cart_id")?.value
  
  if (!cartId) {
    return null
  }
  
  try {
    const { cart } = await sdk.store.cart.retrieve(cartId)
    return cart
  } catch (error) {
    // Cart ID in cookie but not found on backend - clear it
    return null
  }
}

export const getOrSetCart = async (countryCode: string = "us") => {
  let cart = await retrieveCart()
  
  if (!cart) {
    const { cart: newCart } = await sdk.store.cart.create({
      country_code: countryCode,
    })
    cart = newCart
    
    // Set cookie for server-side access
    const cookieStore = await cookies()
    cookieStore.set("_medusa_cart_id", cart.id, {
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      httpOnly: false, // Need client-side access
      sameSite: "lax",
    })
  }
  
  return cart
}
```

---

## Minor Pitfalls

### 11. Not Handling `null` Cart States

**What goes wrong:** Component tries to access `cart.items[0]` when `cart` is `null`, causing runtime errors.

**Prevention:**
```tsx
// Always handle null/undefined cart
const CartItems = ({ cart }) => {
  if (!cart) {
    return <EmptyCart message="Your cart is empty" />
  }
  
  return (
    <div>
      {cart.items?.length === 0 ? (
        <EmptyCart message="No items in cart" />
      ) : (
        cart.items.map(item => <CartItem key={item.id} item={item} />)
      )}
    </div>
  )
}
```

---

### 12. Missing `fields` Parameter Optimization

**What goes wrong:** Fetching full product/cart objects when only a few fields needed, causing slow page loads and large bundle sizes.

**Prevention:**
```typescript
// Good: Only fetch needed fields
const { cart } = await sdk.store.cart.retrieve(cartId, {
  fields: "+items.*,subtotal,shipping_total",
})

// Good: Only fetch needed variant fields
const { product } = await sdk.store.products.retrieve(productId, {
  fields: "id,title,thumbnail,*variants.calculated_price,*variants.inventory_quantity",
})
```

---

## Phase-Specific Warnings

| Phase | Topic | Likely Pitfall | Mitigation |
|-------|-------|---------------|------------|
| Phase 2 | Product Gallery | Pagination not implemented, all products loaded at once | Use offset/limit or cursor pagination from start |
| Phase 2 | Product Detail Page | Price display shows raw paise amounts | Create `formatPrice()` utility and apply globally |
| Phase 2 | Cart Store Setup | Zustand state not synced with Medusa cart | Use server cart as source of truth, not local state |
| Phase 3 | Checkout | JWT expiration during checkout | Implement token refresh check before payment |
| Phase 3 | Analytics | GA4 not receiving cart events | Sync cart mutations with analytics calls |

---

## Sources

- [Medusa Storefront Production Optimization Tips](https://docs.medusajs.com/resources/storefront-development/production-optimizations) — HIGH confidence
- [Medusa Cart Management](https://docs.medusajs.com/resources/storefront-development/cart/manage-items) — HIGH confidence
- [Medusa Auth Token Refresh API](https://docs.medusajs.com/resources/references/js_sdk/auth/Auth/methods/js_sdk.auth.Auth.refresh) — HIGH confidence
- [Medusa CORS Configuration](https://docs.medusajs.com/resources/troubleshooting/_sections/other/cors-errors.mdx) — HIGH confidence
- [Medusa Next.js Starter Cart Server Actions](https://context7.com/medusajs/nextjs-starter-medusa/llms.txt) — HIGH confidence
- [Third-Party Sync Best Practices (retry logic)](https://docs.medusajs.com/learn/best-practices/third-party-sync) — HIGH confidence
- [Next.js Starter Cart Issues (GitHub)](https://github.com/medusajs/nextjs-starter-medusa/issues/280) — MEDIUM confidence (community issue)
- [Medusa v2 Price Type Definition](https://docs.medusajs.com/resources/references/types/IndexTypes/interfaces/types.IndexTypes.IndexServiceEntryPoints) — HIGH confidence