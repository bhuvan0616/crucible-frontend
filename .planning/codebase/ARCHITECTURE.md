# Architecture

**Analysis Date:** 2026-05-12

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Next.js App Router                   │
│                   (React 19, Next.js 16.2.6)                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    app/layout.tsx                     │   │
│  │            (Root Layout + Fonts + Metadata)           │   │
│  └──────────────────────────┬───────────────────────────┘   │
│                             │                                │
│                             ▼                                │
│  ┌──────────────────────────────────────────────────────┐   │
│  │                    app/page.tsx                       │   │
│  │                  (Home Page - RSC)                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │               app/globals.css (Tailwind v4)          │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## Component Responsibilities

| Component | Responsibility | File |
|-----------|----------------|------|
| RootLayout | Defines HTML structure, loads fonts, exports metadata | `app/layout.tsx` |
| HomePage | Default landing page (Server Component) | `app/page.tsx` |
| GlobalStyles | Tailwind v4 CSS imports and theme configuration | `app/globals.css` |
| NextConfig | Next.js configuration (currently minimal) | `next.config.ts` |

## Pattern Overview

**Overall:** Next.js App Router with React Server Components

**Key Characteristics:**
- App Router uses file-system based routing in `app/` directory
- Default to Server Components (RSC) - no "use client" directive needed
- Tailwind CSS v4 with `@import "tailwindcss"` (no separate config file)
- CSS custom properties for theming with `@theme inline` block
- Path alias `@/*` maps to project root for clean imports

## Layers

**Pages Layer:**
- Purpose: Route definitions and page components
- Location: `app/` directory
- Contains: `layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`
- Depends on: Next.js framework, React
- Used by: Next.js router

**Static Assets:**
- Purpose: Public files served directly
- Location: `public/` directory
- Contains: Static images, fonts

## Data Flow

### Page Request Path

1. **Request** → Next.js router matches URL to `app/page.tsx`
2. **Layout** → `app/layout.tsx` wraps page, loads fonts (`Geist`, `Geist_Mono`)
3. **Render** → `page.tsx` returns React Server Component tree
4. **Styles** → Tailwind v4 processes `globals.css` with `@theme inline` variables

### Font Loading

1. `layout.tsx` imports `Geist`, `Geist_Mono` from `next/font/google`
2. CSS variables `--font-geist-sans` and `--font-geist-mono` injected
3. Applied via `className` on `<html>` element

## Key Abstractions

**Metadata API:**
- Export `metadata` object from `layout.tsx` for page metadata
- Type: `Metadata` from `next`

**CSS Theme System:**
- CSS custom properties defined in `:root` and `@media (prefers-color-scheme: dark)`
- Tailwind v4 `@theme inline` block maps CSS vars to Tailwind tokens

## Entry Points

**Root Layout:**
- Location: `app/layout.tsx`
- Triggers: Every page request (wraps all pages)
- Responsibilities: HTML structure, font loading, metadata export, dark mode class

**Home Page:**
- Location: `app/page.tsx`
- Triggers: `GET /` (root URL)
- Responsibilities: Landing page content with Next.js Image components

## Architectural Constraints

- **Rendering:** Default to React Server Components (no client-side JS unless explicitly marked)
- **Styling:** Tailwind v4 only (no traditional CSS classes or CSS-in-JS)
- **No custom components:** Project is barebones scaffold from `create-next-app`
- **No API routes:** Currently no `app/api/` directory
- **No lib/ or utils/:** No shared utility code yet

## Error Handling

**Strategy:** Next.js default error boundaries and React error handling

**Patterns:**
- Next.js provides default error pages (`error.tsx`, `not-found.tsx`)
- ESLint configured with `eslint-config-next` for TypeScript and core web vitals

## Cross-Cutting Concerns

**Styling:** Tailwind CSS v4 with PostCSS plugin (`@tailwindcss/postcss`)
**Linting:** ESLint flat config with `eslint-config-next`
**Type Safety:** TypeScript strict mode enabled

---

*Architecture analysis: 2026-05-12*