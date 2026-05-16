# PRD — Crucible Creations Storefront (Phase 1)

> **For:** OpenCode AI Agent  
> **Version:** 1.1  
> **Status:** Ready for Implementation

---

## 1. Executive Summary

**Brand Name:** Crucible Creations  
**Tagline:** Premium 3D Printed Products

**First Product:**  
Portable Keychain Phone Stand — A compact, foldable phone holder that doubles as a keychain with custom name engraving.

**Phase 1 Objective:**  
Deliver a high-quality, visually appealing, conversion-focused storefront that is fully compatible with MedusaJS integration in future phases. No MedusaJS backend will be implemented in Phase 1.

**Key Highlights:**
- 3 product variants
- Strong customization (name engraving)
- Premium modern design
- MedusaJS-ready architecture and data structure
- Google Analytics integrated from day one

---

## 2. Product Details

| Field | Value |
|---|---|
| **Product Name** | Portable Keychain Phone Stand |
| **Description** | Foldable, portable phone stand with keychain ring. Perfect for desk use, travel, and on-the-go. |
| **Dimensions** | 73mm × 35mm × 12mm |
| **Material** | Premium PLA / PETG |
| **Base Price** | ₹449 |

**Variants (3):**
- Wakanda Black
- Batman Grey
- Captain Teal

**Customization:** Customer can enter desired name/text (max 12 characters) to be 3D printed on the product. Customization input is on the **Product Description Page (PDP) only**.

**Product Images:**  
All product and lifestyle images are located in the `images/` folder at the root of the project. Reference them from there.

---

## 3. Design & Brand Guidelines

### Color Palette

| Role | Hex | Usage |
|---|---|---|
| Primary | `#0F172A` | Deep Slate — backgrounds, dark surfaces |
| Secondary/Accent | `#14B8A6` | Teal — highlights, links, borders |
| CTA Accent | `#F97316` | Orange — buttons, call-to-action elements |
| Neutral Mid | `#64748B` | Muted text, secondary labels |
| Neutral Light | `#F1F5F9` | Light backgrounds, cards in light mode |
| White | `#FFFFFF` | Text on dark, card backgrounds |

All colors must be managed via **Tailwind config + CSS variables** for easy future changes.

### Mode
- **Dark mode as default**, with light mode support.

### Design Style
Clean, modern, premium tech/accessory aesthetic. Use subtle animations and generous whitespace. Avoid cluttered layouts.

---

## 4. Pages & Features (Phase 1 Scope)

### 4.1 Landing Page (Home)
- Hero banner with lifestyle imagery and strong CTA
- Featured product showcase (3 variants)
- Benefits section
- How it works
- Usage scenarios
- Testimonials (mock)
- Newsletter signup

### 4.2 Product Gallery / Shop Page
- Product grid with variant cards
- Filters (by Edition/Color)
- Search and sort functionality
- Quick add to cart

### 4.3 Product Description Page (PDP)

**Layout:**
- **Left:** High-quality image gallery (multiple angles + lifestyle images, sourced from `images/` folder)
- **Right:** Sticky product details panel

**Elements:**
- Title and subtitle
- Price (₹449 base)
- Variant selector with color swatches
- **Customization Input** *(on PDP only — not in cart)*:
  - Text field: `"Enter name to be printed"`
  - Character counter (max 12)
  - Helper text: `"This text will be 3D printed on your stand"`
  - Inline validation: enforce 12-character limit with live counter feedback
- Quantity selector
- Prominent "Add to Cart" button
- Full description & specifications
- Shipping & delivery information
- "You may also like" section (placeholder)

> ⚠️ **Note:** No 3D model viewer.  
> ⚠️ **Note:** Customization is edited **only on the PDP**. The cart displays the saved customization as read-only.

### 4.4 Cart Page
- List of items showing selected variant + saved custom name (read-only display)
- Quantity controls
- Subtotal and estimated shipping
- Proceed to Checkout CTA

### 4.5 Checkout Page (Mock)
- Shipping address form
- Delivery options & timeline
- Order summary (including custom name)
- Promo code field
- Mock payment methods (Razorpay, UPI, Cards, etc.)
- Place Order → Success page (mock)

> Validation and error states for checkout forms will be scoped to a later phase.

---

## 5. Technical Requirements

### Stack

| Technology | Version / Notes |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (min v5.1.0) |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Animations** | Framer Motion |
| **State Management** | Zustand (cart state) |
| **Image Optimization** | Next.js `<Image>` component |
| **Analytics** | Google Analytics 4 (GA4) |
| **Node.js** | **≥ 20.9.0** (required by Next.js 16; Node 18 is not supported) |

> ⚠️ **Next.js 16 Breaking Change:** `middleware.ts` has been replaced by `proxy.ts`. Use `proxy.ts` for any middleware logic (e.g., redirects, auth guards). Do not create `middleware.ts`.

### Data Layer (Critical for Medusa Compatibility)
- Use MedusaJS-compatible mock data structure (see Section 6)
- Abstracted services:
  - `lib/services/productService.ts`
  - `lib/services/cartService.ts`
- Easy swap to `@medusajs/js-sdk` in Phase 2

### Analytics

Integrate **Google Analytics 4 (GA4)** at the layout level (`app/layout.tsx`) using the standard `<Script>` component with `strategy="afterInteractive"`.

**Minimum events to track:**
- `page_view` — automatic via GA4
- `add_to_cart` — fire when user clicks "Add to Cart"
- `begin_checkout` — fire when user proceeds to checkout
- `purchase` — fire on mock success page

Store the GA Measurement ID in an environment variable: `NEXT_PUBLIC_GA_MEASUREMENT_ID`.

### Deployment

| Config | Value |
|---|---|
| **Server OS** | Ubuntu Server (latest LTS) |
| **Node.js** | 20.9.0 or higher (22.x LTS recommended for production) |
| **Process Manager** | PM2 |
| **Web Server / Reverse Proxy** | Nginx |
| **Build** | `npm run build` → `pm2 start npm --name "crucible" -- start` |

**Nginx proxy config (minimum):**
```nginx
server {
  listen 80;
  server_name yourdomain.com;

  location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

**Environment variables to prepare** (`.env.local`):
```env
# Phase 1 — mock only
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Phase 2 — Medusa backend (leave empty for now)
NEXT_PUBLIC_MEDUSA_BACKEND_URL=
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=
```

---

## 6. MedusaJS-Compatible Mock Data

**File:** `mocks/products.json`

> ⚠️ **Price encoding:** Medusa stores all prices in the **smallest currency unit**. For INR, this means paise. Therefore `44900` = ₹449.00. All display logic must divide `amount` by `100` before rendering the price to the user.

```json
{
  "id": "prod_01keychain_phone_stand",
  "title": "Portable Keychain Phone Stand",
  "subtitle": "Foldable • Compact • Customizable",
  "description": "The ultimate portable phone stand that doubles as a keychain. Engineered for everyday carry with a premium 3D-printed finish.",
  "handle": "portable-keychain-phone-stand",
  "status": "published",
  "thumbnail": "/images/products/keychain-stand-thumbnail.jpg",
  "images": [
    { "id": "img_01", "url": "/images/products/keychain-stand-front.jpg" },
    { "id": "img_02", "url": "/images/products/keychain-stand-side.jpg" },
    { "id": "img_03", "url": "/images/products/keychain-stand-lifestyle.jpg" }
  ],
  "options": [
    {
      "id": "opt_color",
      "title": "Edition",
      "product_id": "prod_01keychain_phone_stand",
      "values": [
        { "id": "optval_black", "value": "Wakanda Black", "option_id": "opt_color" },
        { "id": "optval_grey",  "value": "Batman Grey",   "option_id": "opt_color" },
        { "id": "optval_teal", "value": "Captain Teal",  "option_id": "opt_color" }
      ]
    }
  ],
  "variants": [
    {
      "id": "var_black",
      "title": "Wakanda Black",
      "sku": "PKS-BLK-001",
      "manage_inventory": true,
      "inventory_quantity": 100,
      "allow_backorder": false,
      "prices": [
        { "id": "price_blk_inr", "amount": 44900, "currency_code": "inr" }
      ],
      "options": [
        { "option_id": "opt_color", "value": "Wakanda Black" }
      ]
    },
    {
      "id": "var_grey",
      "title": "Batman Grey",
      "sku": "PKS-GRY-002",
      "manage_inventory": true,
      "inventory_quantity": 100,
      "allow_backorder": false,
      "prices": [
        { "id": "price_gry_inr", "amount": 44900, "currency_code": "inr" }
      ],
      "options": [
        { "option_id": "opt_color", "value": "Batman Grey" }
      ]
    },
    {
      "id": "var_teal",
      "title": "Captain Teal",
      "sku": "PKS-TEL-003",
      "manage_inventory": true,
      "inventory_quantity": 100,
      "allow_backorder": false,
      "prices": [
        { "id": "price_tel_inr", "amount": 44900, "currency_code": "inr" }
      ],
      "options": [
        { "option_id": "opt_color", "value": "Captain Teal" }
      ]
    }
  ],
  "metadata": {
    "dimensions": "73mm x 35mm x 12mm",
    "material": "Premium PLA / PETG",
    "customization": true,
    "max_chars": 12,
    "customization_label": "Name / Text to Engrave",
    "customization_helper": "This text will be 3D printed on your stand"
  }
}
```

This structure mirrors the **MedusaJS v2 Product schema** closely, enabling a near-zero-effort swap to the live SDK in Phase 2.

---

## 7. Non-Functional Requirements

| Requirement | Detail |
|---|---|
| **Responsive** | Mobile-first. Fully responsive across all screen sizes. |
| **Performance** | Optimized images, lazy loading, minimal JS bundle. Target LCP < 2.5s. |
| **Accessibility** | Semantic HTML, ARIA labels, keyboard navigable. |
| **SEO** | Meta tags, Open Graph, structured data for product pages. |
| **Dark Mode** | Default dark, light mode supported via Tailwind `dark:` classes and CSS variables. |
| **UX States** | Loading skeletons and error boundaries on all data-dependent components. |
| **Analytics** | GA4 with key e-commerce events (see Section 5). |

---

## 8. Project Structure (Recommended)

```
crucible-creations/
├── app/
│   ├── layout.tsx           # GA4 script injected here
│   ├── page.tsx             # Landing page
│   ├── shop/
│   │   └── page.tsx         # Product gallery
│   ├── product/
│   │   └── [handle]/
│   │       └── page.tsx     # PDP
│   ├── cart/
│   │   └── page.tsx
│   └── checkout/
│       └── page.tsx
├── components/
│   ├── ui/                  # shadcn/ui primitives
│   ├── product/             # ProductCard, VariantSelector, CustomizationInput, etc.
│   ├── cart/                # CartItem, CartSummary
│   └── layout/              # Navbar, Footer
├── lib/
│   ├── services/
│   │   ├── productService.ts
│   │   └── cartService.ts
│   └── analytics.ts         # GA4 event helpers
├── mocks/
│   └── products.json
├── store/
│   └── cartStore.ts         # Zustand store
├── images/                  # All product & lifestyle images
├── proxy.ts                 # Next.js 16 proxy (replaces middleware.ts)
├── .env.local
└── next.config.ts
```

---

## 9. Phase 2 Preview (Out of Scope for Phase 1)

The following are explicitly **not** in scope for Phase 1 but should be kept in mind during architecture decisions:

- Live MedusaJS backend (`@medusajs/js-sdk` swap in `productService.ts`)
- Real payment processing (Cashfree live keys)
- User accounts & order history
- Admin dashboard / inventory management
- Checkout form validation & error handling
