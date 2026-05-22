# Phase 4: SDK Foundation - Discussion Log

**Phase:** 04-sdk-foundation
**Date:** 2026-05-22
**Areas Discussed:** SDK Naming, SDK Singleton Approach

---

## Area: SDK Naming

**Options Presented:**
- `lib/medusa.ts` — explicit brand, clear purpose
- `lib/sdk.ts` — standard pattern, shorter imports

**User Selected:** `lib/sdk.ts`

**Notes:** User chose shorter imports and standard pattern over explicit naming.

---

## Area: SDK Singleton Approach

**Options Presented:**
- `export const sdk = new Medusa(...)` — single exported instance, simplest
- `getSdk()` factory function — testable, lazy initialization
- `React Context provider` — best for SSR/Edge, enables easy testing/mocking

**User Selected:** React Context provider

**Notes:** User selected React Context for Next.js 16 App Router compatibility and testability.

---

## Summary

2 areas discussed:
1. SDK Naming → `lib/sdk.ts`
2. SDK Singleton Approach → React Context provider pattern

Agent discretion on:
- Exact Context provider file location
- `formatPrice()` utility details
- Env var validation approach

**Commit:** docs(04): capture phase context