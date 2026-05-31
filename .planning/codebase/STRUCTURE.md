# Codebase Structure

**Analysis Date:** 2026-05-27

## Directory Layout

```
apps/frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (font, metadata, GA4, Navbar)
│   ├── page.tsx            # Home/landing page
│   ├── providers.tsx       # Client providers wrapper (auth + cart init)
│   ├── sitemap.ts          # Sitemap generation
│   ├── robots.ts           # Robots.txt generation
│   ├── auth/               # Auth callback routes
│   │   └── customer/google/callback/
│   ├── cart/               # Cart page
│   ├── checkout/           # Checkout flow
│   ├── login/              # Login page
│   ├── order-confirmation/ # Post-checkout confirmation
│   ├── order-success/      # Order success page
│   ├── product/            # Product pages
│   │   └── [id]/page.tsx   # Dynamic product detail route
│   ├── register/           # Registration page
│   └── shop/               # Product catalog/shop page
├── components/             # React components
│   ├── auth/               # LoginForm, RegisterForm
│   ├── cart/               # CartItemCard, CartSummary
│   ├── checkout/           # CheckoutForm, PaymentForm, AddressForm, etc.
│   ├── landing/           # Landing page sections (Hero, Features, etc.)
│   ├── layout/             # Navbar, Footer
│   ├── product/           # ProductPageClient, ProductGallery, VariantSelector, etc.
│   ├── shop/               # ShopProductCard, ProductGrid, FilterBar, CartSlideOver
│   └── ui/                 # shadcn/ui base components (Button, Input, Label, Card)
├── lib/                    # Utilities and SDK setup
│   ├── sdk.ts              # MedusaJS SDK singleton
│   ├── firebase.ts         # Firebase auth setup
│   ├── utils.ts            # cn() utility (clsx + tailwind-merge)
│   ├── analytics/          # GA4 tracking functions
│   │   └── ga4.ts
│   ├── data/               # Product data fetching
│   │   └── products.ts
│   ├── providers/          # React context providers
│   │   └── MedusaProvider.tsx
│   └── utils/              # Utility functions
│       └── formatPrice.ts
├── store/                  # Zustand state stores
│   ├── authStore.ts         # Authentication state
│   └── cartStore.ts        # Cart state with localStorage persistence
├── types/                  # TypeScript type definitions
│   └── index.ts            # CartItem, Product, ProductVariant, etc.
├── public/                 # Static assets (SVGs, placeholder.jpg)
│   └── images/
├── images/                 # Static product images
├── mocks/                  # Mock data for development
├── .env.local              # Environment variables (not committed)
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
├── components.json         # shadcn/ui component configuration
├── eslint.config.mjs       # ESLint configuration
└── crucible-creations-prd.md  # Product requirements document
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router page structure
- Contains: Route pages, layouts, API route handlers
- Key files: `layout.tsx`, `page.tsx`, `providers.tsx`

**`components/`:**
- Purpose: React UI components organized by feature
- Contains: Feature-specific components and shadcn/ui base components
- Key files: `landing/hero.tsx`, `shop/ShopProductCard.tsx`, `product/ProductPageClient.tsx`

**`lib/`:**
- Purpose: Utilities, SDK initialization, data fetching
- Contains: MedusaJS SDK, Firebase setup, analytics, product data
- Key files: `sdk.ts`, `firebase.ts`, `analytics/ga4.ts`, `data/products.ts`

**`store/`:**
- Purpose: Zustand client-side state management
- Contains: `authStore.ts` (auth state), `cartStore.ts` (cart state with persistence)
- Key files: `authStore.ts`, `cartStore.ts`

**`types/`:**
- Purpose: TypeScript type definitions
- Contains: `CartItem`, `Product`, `ProductVariant`, `ColorVariant`
- Key files: `index.ts`

## Key File Locations

**Entry Points:**
- `app/layout.tsx` — Root layout with font, metadata, GA4, Navbar
- `app/page.tsx` — Home/landing page
- `app/providers.tsx` — Client initialization (auth check + cart init)

**Configuration:**
- `next.config.ts` — Next.js config (image domains)
- `tsconfig.json` — TypeScript with path alias `@/*` → `./`
- `package.json` — Dependencies (Next.js 16, React 19, MedusaJS, Zustand, Firebase, shadcn)

**Core Logic:**
- `lib/sdk.ts` — MedusaJS SDK singleton
- `lib/data/products.ts` — Product fetching functions
- `store/authStore.ts` — Auth state management
- `store/cartStore.ts` — Cart state with Medusa sync

**Testing (none found):**
- No test directory or test files detected

## Naming Conventions

**Files:**
- PascalCase for components: `ShopProductCard.tsx`, `ProductPageClient.tsx`
- camelCase for utilities and stores: `cartStore.ts`, `formatPrice.ts`
- kebab-case for directories: `components/landing/`, `components/product/`

**Functions:**
- camelCase: `getProducts()`, `addItem()`, `trackAddToCart()`
- PascalCase for React components: `ProductGallery`, `VariantSelector`

**Variables:**
- camelCase: `cartId`, `selectedOptions`, `customization`
- PascalCase for types/interfaces: `CartItem`, `ProductVariant`, `AuthStore`

**Types:**
- TypeScript interfaces: `interface CartItem { ... }`
- Exported from: `types/index.ts`

## Where to Add New Code

**New Feature:**
- Primary code: `components/feature-name/` directory
- Tests: No test directory structure exists

**New Component:**
- Implementation: `components/{category}/ComponentName.tsx`
- Follow existing patterns: `"use client"` directive, props interface, motion wrappers

**New Store:**
- Implementation: `store/featureStore.ts`
- Pattern: Zustand with `create<StoreInterface>()((set, get) => ...))`

**New Utility:**
- Implementation: `lib/utils/utilityName.ts`
- Export from: `lib/utils.ts` or keep file-specific

**New Page:**
- Implementation: `app/{route}/page.tsx`
- For dynamic routes: `app/{param}/[id]/page.tsx`

## Special Directories

**`.next/`:**
- Purpose: Next.js build output
- Generated: Yes
- Committed: No (.gitignore)

**`.playwright-mcp/`:**
- Purpose: Playwright browser automation logs
- Generated: Yes
- Committed: No

**`.planning/`:**
- Purpose: Project planning documents
- Generated: No
- Committed: Yes

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-05-27*
