# AGENTS.md - Crucible Creations Storefront

## Project Context

**Project:** Crucible Creations Storefront
**Core Value:** A visually stunning, high-converting storefront that showcases 3D printed products with premium aesthetic and seamless customization options.

**PRD:** `crucible-creations-prd.md` — Full requirements and design guidelines

## Workflow Commands

- `/gsd-plan-phase 1` — Plan Phase 1 (Foundation & Landing Page)
- `/gsd-plan-phase 2` — Plan Phase 2 (Product Gallery & PDP)
- `/gsd-plan-phase 3` — Plan Phase 3 (Cart, Checkout & Analytics)
- `/gsd-execute-phase 1` — Execute Phase 1
- `/gsd-progress` — Check project progress

## Phase Summary

### Phase 1: Foundation & Landing Page
- Next.js 16 setup, Tailwind, shadcn/ui, Framer Motion
- Dark mode design system with brand colors
- Landing page with hero, benefits, testimonials, newsletter

### Phase 2: Product Gallery & PDP
- Product gallery with filtering and search
- Product detail page with customization input (12-char max)
- Zustand cart store setup

### Phase 3: Cart, Checkout & Analytics
- Cart page with read-only customization display
- Mock checkout flow
- GA4 analytics integration

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS + shadcn/ui
- Framer Motion (animations)
- Zustand (cart state)
- GA4 (analytics)

## Key Constraints

- **No middleware.ts** — Use proxy.ts for redirects/auth
- **Prices in paise** — 44900 = ₹449.00
- **Customization on PDP only** — Cart shows read-only
- **Node.js ≥ 20.9.0** — Required by Next.js 16

## MedusaJS-Ready

Mock data structure mirrors MedusaJS v2 schema. Phase 2 will swap `lib/services/productService.ts` to `@medusajs/js-sdk`.

## Design System

- **Primary:** `#0F172A` (Deep Slate)
- **Accent:** `#14B8A6` (Teal)
- **CTA:** `#F97316` (Orange)
- **Dark mode default**, light mode supported

## Debugging & Fix Workflow

When fixing issues related to backend (Medusa) API responses:

### Step 1: Inspect API Response
Before writing any code, fetch and examine the actual API response:
```bash
curl -s "http://localhost:9000/store/products/<id>?fields=*" \
  -H "x-publishable-api-key: pk_5ccc6cbe53e1b7ca11d15c311915cb67470f731074b4c14ab56d5b857a873951" \
  | jq '.'
```

### Step 2: Verify with Playwright MCP
Navigate to the page and use `playwright_browser_snapshot` to see actual rendered UI:
```
/product/<id> or /cart
```

### Step 3: Identify the Issue
Compare API field names and values with what the UI displays. Common patterns:
- **Price fields:** `calculated_price.calculated_amount` vs `unit_price` (may be in rupees, not paise)
- **Option titles:** Check `options[*].title` vs `variant.options[*].option` (may be ID or object)
- **Null checks:** Always verify nested properties exist before accessing

### Step 4: Implement Fix
Update the relevant component/service to handle the actual API structure.

### Step 5: Verify Fix
Use Playwright MCP to confirm the fix works:
```
playwright_browser_navigate → URL
playwright_browser_snapshot → Verify UI shows correct values
```

### Medusa API Field Patterns

| Data | Field Path | Notes |
|------|-----------|-------|
| Product options | `options[*].title` | Use `*options` in fields param |
| Option ID | `options[*].id` | Use `option_id` from variant options |
| Variant price | `variant.calculated_price.calculated_amount` | Already in rupees |
| Cart item price | `item.unit_price` or `variant.calculated_price.calculated_amount` | Verify units |
| Cart totals | `cart.subtotal/total/shipping_total/tax_total` | May have `.numeric` subfield |

## MedusaJS API Call Guidelines

### Always Use ctx7 for Medusa API Docs
Before making any API call, check the docs to confirm field names, response structure, and behavior:
```bash
npx ctx7@latest library "MedusaJS"
npx ctx7@latest docs /websites/medusajs_resources "<your query>"
```

### Sparse Fields — Always Use `+` Prefix
When you need specific fields from a list response, **append** them with `+` prefix, not replace. Without `+`, the default fields are returned and your requested fields are ignored.

**Correct:**
```ts
sdk.store.customer.listAddress({ fields: "+address_name" });
```

**Wrong — fields are silently ignored:**
```ts
sdk.store.customer.listAddress({ fields: "address_name" });
```

**Why?** Without `+`, the API replaces the default field selection. With `+`, it appends to the default.

### Check All List APIs for This Pattern
Any `list*` or `get*` method that accepts a `fields` query parameter follows this `+` convention. Common cases:
- `sdk.store.customer.listAddress({ fields: "+address_name" })`
- `sdk.store.product.list({ fields: "+custom_field" })`
- Any SDK method with `fields` param for sparse selection

### Before Building UI Around an API Response
1. Make the raw API call and log the response
2. Confirm the field exists and is not null
3. Only then build the UI component

### Quick Debug: Inspect Any Medusa API Response
```bash
curl -s "http://localhost:9000/store/<resource>?fields=*" \
  -H "x-publishable-api-key: pk_5ccc6cbe53e1b7ca11d15c311915cb67470f731074b4c14ab56d5b857a873951" \
  | jq '.'
```

## Code Standards

- **API calls** — Always use `ctx7` to verify field names before writing code
- **Sparse fields** — Always use `+` prefix: `fields: "+fieldname"`
- **Null checks** — Verify nested properties exist before accessing
- **Price values** — Confirm unit (paise vs rupees) before display
- **Test first** — Log raw API response before building UI