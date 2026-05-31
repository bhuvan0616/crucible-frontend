# Phase 4: SDK Foundation - Context

**Gathered:** 2026-05-22
**Status:** Ready for planning

<domain>
## Phase Boundary

Install and configure the MedusaJS SDK client (`@medusajs/js-sdk`) with foundational utilities. This phase creates the infrastructure for all subsequent MedusaJS API calls. No UI changes — purely SDK setup.

</domain>

<decisions>
## Implementation Decisions

### SDK File Naming
- **D-01:** SDK client file named `lib/sdk.ts` (not `lib/medusa.ts` — shorter imports, standard pattern)

### SDK Singleton Approach
- **D-02:** Use React Context provider pattern for SDK instance — best for Next.js 16 App Router SSR/Edge compatibility, enables easy testing/mocking

### the agent's Discretion
- Exact Context provider file location (suggest `lib/providers/MedusaProvider.tsx` or inline in `lib/sdk.ts`)
- `formatPrice()` utility location and export style (named export vs utility class)
- Env var validation approach
- Whether to use a `useMedusa()` hook or just `<MedusaProvider>` + `useContext()`

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Research & Stack
- `.planning/research/SUMMARY.md` — Executive summary of MedusaJS integration
- `.planning/research/STACK.md` — SDK installation, env vars, authentication patterns
- `.planning/research/PITFALLS.md` — Cart desync, price formatting, JWT expiry, CORS, race conditions

### Project
- `.planning/PROJECT.md` — Project context and constraints
- `.planning/ROADMAP.md` — Phase 4 goal and success criteria

### MedusaJS Docs (verify current)
- `https://docs.medusajs.com/resources/js-sdk` — Official SDK documentation

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `store/cartStore.ts`: Current Zustand cart — will be extended to sync with Medusa cart
- `lib/data/products.ts`: Current mock product service — to be replaced in Phase 5

### Established Patterns
- Environment variables use `NEXT_PUBLIC_` prefix for client-accessible values
- Prices stored in paise (44900 = ₹449.00) — formatPrice utility must convert

### Integration Points
- `lib/sdk.ts` (new): Will be imported by `lib/data/products.ts` (Phase 5), `store/cartStore.ts` (Phase 6), auth provider (Phase 7)

</code_context>

<specifics>
## Specific Ideas

No specific examples or references from discussion — decisions captured are implementation choices.

</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within Phase 4 scope

</deferred>

---

*Phase: 04-SDK-Foundation*
*Context gathered: 2026-05-22*