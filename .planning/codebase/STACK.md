# Technology Stack

**Analysis Date:** 2026-05-12

## Languages

**Primary:**
- TypeScript 5 - Primary development language for Next.js application

**Secondary:**
- CSS - Styling via Tailwind CSS v4

## Runtime

**Environment:**
- Node.js (implied by Next.js)
- Next.js 16.2.6 runtime (Edge/Node.js)

**Package Manager:**
- npm 10+ (implied by package-lock.json presence)

## Frameworks

**Core:**
- Next.js 16.2.6 - React full-stack framework with App Router
- React 19.2.4 - UI library

**Styling:**
- Tailwind CSS 4 - Utility-first CSS framework via `@tailwindcss/postcss`
- PostCSS - CSS processing

**Animation:**
- framer-motion 12.38.0 - Motion/animation library for React

**Build/Dev:**
- ESLint 9 - JavaScript/TypeScript linting
- eslint-config-next 16.2.6 - Next.js ESLint configuration

## Key Dependencies

**Critical:**
- `next` 16.2.6 - React framework
- `react` 19.2.4 - React UI library
- `react-dom` 19.2.4 - React DOM renderer
- `framer-motion` 12.38.0 - Animation library

**Dev Dependencies:**
- `typescript` 5 - TypeScript compiler
- `tailwindcss` 4 - CSS framework
- `@tailwindcss/postcss` 4 - Tailwind PostCSS plugin
- `eslint` 9 - Linter
- `eslint-config-next` 16.2.6 - Next.js lint config

## Configuration

**TypeScript:**
- Config: `tsconfig.json`
- Target: ES2017
- Module: esnext with bundler resolution
- Path alias: `@/*` maps to `./`

**Build:**
- `next.config.ts` - Next.js configuration (minimal, no custom config)
- PostCSS: `postcss.config.mjs` with `@tailwindcss/postcss`
- ESLint: `eslint.config.mjs` with next core-web-vitals and typescript rules

**Environment:**
- No `.env` files detected in project
- Standard Next.js env pattern (process.env.NEXT_PUBLIC_* for client-exposed vars)

## Platform Requirements

**Development:**
- Node.js 20+ recommended
- npm, yarn, pnpm, or bun package managers

**Production:**
- Node.js or Edge runtime (Vercel, or self-hosted)
- No database or external services detected

---

*Stack analysis: 2026-05-12*