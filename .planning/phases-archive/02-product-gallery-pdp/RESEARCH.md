# Phase 2 Research: Product Gallery & PDP

## 1. Component Architecture

### Routes
- `/shop` — Product gallery page
- `/product/[id]` — Product detail page (PDP)

### Directory Structure
```
app/
├── shop/
│   └── page.tsx              # Gallery page
├── product/
│   └── [id]/
│       └── page.tsx          # PDP
components/
├── shop/
│   ├── ProductGrid.tsx        # Grid container with filters
│   ├── FilterBar.tsx          # Edition/color filters, search, sort
│   └── ShopProductCard.tsx    # Gallery card variant (smaller than showcase)
├── product/
│   ├── ProductGallery.tsx     # Image gallery with thumbnails
│   ├── ProductInfo.tsx        # Title, price, variant selector
│   ├── CustomizationInput.tsx # 12-char max input with live counter
│   ├── VariantSelector.tsx    # Color swatches
│   └── AddToCartSection.tsx  # Quantity selector + Add to Cart button
store/
└── cartStore.ts               # Zustand cart state
lib/
├── data/
│   └── products.ts            # Mock product data
└── services/
    └── productService.ts      # Product fetching utilities
```

### Key Design Decisions
- Gallery card: 280x280px image, compact info stack (smaller than showcase cards at 360px)
- PDP: Two-column layout — image gallery (60%) left, sticky product info (40%) right
- Filter bar: Horizontal scroll on mobile, sticky below navbar
- Customization input: 12-char limit, character counter `0/12`, disabled at limit
- Variant selector: Color swatches with checkmark on selected, tooltip on hover

---

## 2. State Management — Zustand Cart Store

### Store Design
```typescript
interface CartItem {
  id: string;           // cart item id (uuid)
  productId: string;     // original product id
  variant: string;       // color variant selected
  customization: string; // max 12 chars
  quantity: number;
  price: number;         // price in paise
  imageUrl: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;   // derived: sum of (price * quantity)
  itemCount: () => number; // derived: sum of quantities
}
```

### Persistence
- `persist` middleware with `localStorage` — key: `crucible-cart`
- Hydration handled in layout.tsx to avoid SSR mismatch

### Selectors
```typescript
const selectCartTotal = (state) => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
const selectCartItemCount = (state) => state.items.reduce((sum, item) => sum + item.quantity, 0);
```

---

## 3. Product Data Model

### Mock Product Schema (MedusaJS v2 compatible)
```typescript
interface Product {
  id: string;
  title: string;           // "Ender 3 Pro Custom"
  variant: string;         // "Stealth Black"
  description: string;
  price: number;           // in paise (44900 = ₹449.00)
  images: string[];        // URLs
  edition: 'standard' | 'pro' | 'limited';
  colors: ColorVariant[];   // available color options
  specs: Record<string, string>;
  featured: boolean;
}

interface ColorVariant {
  name: string;            // "Stealth Black"
  hex: string;             // "#1a1a1a"
  available: boolean;
}

interface ProductsResponse {
  products: Product[];
  total: number;
}
```

### Products JSON Location
`lib/data/products.ts` — exports `products` array and `getProductById(id)` function

---

## 4. UI Patterns

### Filtering (GALL-02)
- Filter by Edition: Standard | Pro | Limited (pill toggles)
- Filter by Color: Color swatches with count badges
- URL search params for shareable filter state: `/shop?edition=pro&color=stealth-black`

### Search (GALL-04)
- Debounced search input (300ms)
- Searches: title, variant, description
- Clears with X button
- Empty state: "No products match your search"

### Sort (GALL-04)
- Dropdown: "Featured", "Price: Low to High", "Price: High to Low", "Newest"
- Default: "Featured"

### Product Card (Gallery)
- 280x280 product image (aspect-square)
- Title (muted), Variant name (bold), Price (lime accent)
- Quick Add button appears on hover
- Links to `/product/{id}`

### Customization Input (PDP-04)
- Text input, max 12 characters
- Live counter: `5/12` format
- Placeholder: "Your text here..."
- Disabled state when at limit (no more typing)
- Character limit enforced client-side only (Phase 1 mock)

### Variant Selector (PDP-03)
- Color swatches: 32x32px circles
- Selected: white checkmark overlay
- Unavailable: diagonal strikethrough, reduced opacity
- Tooltip on hover showing color name

---

## 5. Routing (App Router)

### File Structure
```
app/
├── shop/
│   └── page.tsx          # /shop
├── product/
│   └── [id]/
│       └── page.tsx      # /product/:id
├── layout.tsx            # Root layout (exists)
└── page.tsx             # / (landing)
```

### Navigation
- Navbar links to `/shop`
- Product card links to `/product/{id}`
- "View Cart" in navbar opens cart slide-over (not a page)

### Cart Slide-over
- Not a separate page — slide-over panel from right
- Triggered by cart icon in navbar
- Shows items, quantities, subtotal
- "Checkout" button navigates to `/checkout` (Phase 3)

---

## 6. Dependencies

### Already Installed (verified in package.json)
- `framer-motion` — animations
- `zustand` — cart state
- `clsx`, `tailwind-merge` — class utilities (via lib/utils.ts)

### Additional Packages Needed
- `uuid` — for cart item ids
  ```bash
  npm install uuid @types/uuid
  ```

### No New Dependencies Required
- shadcn/ui components already available (card, button, input, label)
- App Router already configured
- Tailwind already set up

---

## 7. Implementation Notes

### Phase 2 Scope (no cart page yet)
- Gallery and PDP only
- Add to Cart adds to Zustand store (persisted)
- Cart shown via slide-over, not separate page
- Phase 3 adds `/cart` page, checkout, analytics

### Design System Alignment
- Use `var(--color-lime)` for price, CTAs
- Use `var(--color-ink-deep)` for card backgrounds
- Use `var(--color-hairline-violet)` for borders
- Consistent border-radius: 18px for cards, 8px for buttons
- Typography: Rubik font (loaded via globals.css)

### Mock Data
- 8-10 products across 3 editions
- 4-5 color variants per product
- Realistic price points: ₹449 - ₹1,299
- Sample images: placeholder URLs (Picsum or similar)