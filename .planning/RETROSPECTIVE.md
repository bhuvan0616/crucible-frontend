# Retrospective: Crucible Creations Storefront

Living document of milestone learnings. Updated at each milestone close.

---

## Milestone: v1.3 — Order History

**Shipped:** 2026-05-27
**Archived:** 2026-05-30
**Phases:** 4 | **Plans:** 4

### What Was Built

1. Paginated order list with status tabs, search, pagination, empty/error states
2. Order detail page with line items, totals, shipping address, and payment info
3. Reusable `StatusBadge` and `OrderTimeline` components with Medusa status mapping
4. UI polish — shimmer skeletons, mobile vertical timeline, dark-mode badge variants

### What Worked

- Vertical slice per phase (list → detail → status → polish) kept dependencies clear
- TDD on order detail (RED/GREEN commits) caught integration issues early
- Consolidating inline status colors into `StatusBadge` reduced duplication in Phase 3
- Fine-grained phase summaries made milestone close straightforward

### What Was Inefficient

- GSD planning docs drifted from codebase until manual sync before close
- No milestone audit run before archive (accepted as deferred)
- v1.2 work overlapped timeline without its own milestone close

### Patterns Established

- `sdk.store.order.retrieve(id, { fields: '*' })` for full order payloads
- Shared order components in `components/orders/`
- Shimmer animation via `animate-shimmer-lime` Tailwind utility
- Mobile/desktop layout split with `flex md:hidden` / `hidden md:flex`

### Key Lessons

- Always use `auth.refresh()` after `customer.create()` — not `login()` — to keep JWT aligned
- Phase summaries are the source of truth for milestone accomplishments
- Sync STATE/ROADMAP/REQUIREMENTS immediately after phase execution, not at close

---

## Cross-Milestone Trends

| Milestone | Phases | Plans | Theme |
|-----------|--------|-------|-------|
| v1.0 | 3 | — | Mock MVP |
| v1.1 | 5 | — | Medusa integration |
| v1.3 | 4 | 4 | Order history UX |

---

*Last updated: 2026-05-30*
