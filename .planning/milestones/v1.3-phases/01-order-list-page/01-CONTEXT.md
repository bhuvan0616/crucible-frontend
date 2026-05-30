# Phase 1: Order List Page - Context

**Gathered:** 2026-05-27
**Status:** Ready for planning

<domain>
## Phase Boundary

Display user's order history with pagination, status badges, and filtering. Key requirements:
- `/orders` page with paginated list (10 per page)
- Order cards showing: order number, date, status badge, total
- Status filter: All, Pending, Processing, Shipped, Delivered, Cancelled
- Search by order number
- Empty state when no orders
- Error state with retry option
</domain>

<decisions>
## Implementation Decisions

### Layout Style
- **D-01:** Use card-based layout for order list items
  - Reuses existing `Card` component from `components/ui/`
  - Consistent with the shop's product card pattern
  - Shows order number, date, status badge, total clearly
  - Responsive: stacks vertically on mobile

### Pagination
- **D-02:** Page-based pagination with 10 orders per page
  - Standard e-commerce pattern (Amazon, Flipkart style)
  - Clear "Previous" / "Next" navigation
  - Page numbers visible

### Status Filter
- **D-03:** Tab-based filter UI (horizontal tabs above list)
  - Tabs: All | Pending | Processing | Shipped | Delivered | Cancelled
  - Active tab highlighted with teal accent color
  - Industry standard - familiar to users

### Search
- **D-04:** Search input above list for order number filtering
  - Client-side search (filter existing loaded orders)
  - Clear button when text present

### Status Badge Colors (from Medusa)
- pending: yellow/amber
- processing: blue
- shipped: purple
- delivered: green
- cancelled: red

### Loading State
- **D-05:** Skeleton loading states matching card layout
- **D-06:** Spinner for pagination transitions

### Empty State
- **D-07:** "No orders yet" message with CTA to browse products

### Error State
- **D-08:** Error message with retry button

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Planning Documents
- `.planning/ROADMAP.md` — Phase 1 goals and success criteria
- `.planning/REQUIREMENTS.md` — ORDR-01, ORDR-02, ORDR-03, ORDR-04 requirements
- `.planning/PROJECT.md` — Project context and core value

### Codebase References
- `components/shop/ShopProductCard.tsx` — Card pattern reference
- `store/authStore.ts` — Auth state for customer ID
- `lib/sdk.ts` — MedusaJS SDK client for order fetching

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Card` component (`components/ui/card.tsx`): Use for order cards
- `Button` component: Primary actions
- `Badge` component: Status badges
- `Input` component: Search field

### Established Patterns
- Card-based layout: Used for products, consistent in this app
- StatusBadge: Need to create (similar to existing badge patterns)
- Pagination: Standard shadcn/ui pagination pattern

### Integration Points
- `/orders` page → Medusa SDK `sdk.store.order.list()` with customer_id filter
- Auth state → `authStore.customer?.id` for customer orders
- Status filtering → Client-side or server-side based on volume
</code_context>

<specifics>
## Specific Ideas

No specific references from user — using industry-standard approaches for e-commerce order pages.

Default to: Amazon/Flipkart order list style (card-based, tab filters, pagination)
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope

</deferred>

---

*Phase: 1-Order List Page*
*Context gathered: 2026-05-27*
*Auto mode — all gray areas auto-resolved with recommended defaults*