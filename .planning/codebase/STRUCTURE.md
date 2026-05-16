# Codebase Structure

**Analysis Date:** 2026-05-12

## Directory Layout

```
crucible/
├── app/                 # Next.js App Router (pages, layouts, styles)
├── public/              # Static assets (served as-is)
├── .next/               # Next.js build output (generated, not committed)
├── .planning/           # GSD planning documents
├── node_modules/        # Dependencies (generated)
├── package.json        # Project manifest
├── package-lock.json   # Dependency lockfile
├── tsconfig.json       # TypeScript configuration
├── next.config.ts       # Next.js configuration
├── postcss.config.mjs   # PostCSS (Tailwind v4)
├── eslint.config.mjs    # ESLint flat config
└── .gitignore           # Git ignore rules
```

## Directory Purposes

**`app/`:**
- Purpose: Next.js App Router directory - contains all pages, layouts, and global styles
- Contains: `layout.tsx`, `page.tsx`, `globals.css`, `favicon.ico`
- Key files: `layout.tsx` (root layout), `page.tsx` (home page)

**`public/`:**
- Purpose: Static assets served directly
- Contains: Static images and files
- Note: Currently has `next.svg` and `vercel.svg`

**`.planning/`:**
- Purpose: GSD planning artifacts and codebase maps
- Contains: `codebase/` subdirectory with architecture documentation

## Key File Locations

**Entry Points:**
- `app/page.tsx`: Home page route (`/`)
- `app/layout.tsx`: Root layout (wraps all pages)

**Configuration:**
- `tsconfig.json`: TypeScript with path alias `@/*` → `./*`
- `next.config.ts`: Next.js configuration (empty config object)
- `postcss.config.mjs`: PostCSS with `@tailwindcss/postcss` plugin
- `eslint.config.mjs`: ESLint flat config extending `eslint-config-next`

**Core Logic:**
- `app/page.tsx`: Main landing page (65 lines)
- `app/layout.tsx`: Root layout with font loading and metadata (33 lines)

**Styling:**
- `app/globals.css`: Tailwind v4 import and theme variables (26 lines)

## Naming Conventions

**Files:**
- PascalCase for React components: `layout.tsx`, `page.tsx`
- kebab-case for config files: `postcss.config.mjs`, `eslint.config.mjs`
- camelCase for JSON configs: `tsconfig.json`

**Directories:**
- lowercase for standard dirs: `app/`, `public/`, `node_modules/`
- kebab-case for config dirs: `.next/`, `.planning/`

**TypeScript:**
- Uppercase types when applicable: `Metadata`, `React.ReactNode`
- Interface colocation in same file as usage

## Where to Add New Code

**New Page:**
- Location: `app/[route]/page.tsx`
- Create directory under `app/` matching route segment
- Example: `app/about/page.tsx` for `/about` route

**New Layout (nested route):**
- Location: `app/[route]/layout.tsx`
- Creates shared layout for that route segment

**New API Route:**
- Location: `app/api/[route]/route.ts`
- Example: `app/api/users/route.ts` for `/api/users`

**New Component:**
- Recommended: `components/` directory at root
- Example: `components/Button.tsx`
- Import path: `@/components/Button`

**New Utility/Library:**
- Recommended: `lib/` directory at root
- Example: `lib/utils.ts`
- Import path: `@/lib/utils`

**New Styles:**
- Component-scoped: Use Tailwind classes directly in components
- Page-level: Add to `app/globals.css` or create route-specific CSS
- Global: Edit `app/globals.css`

## Special Directories

**`node_modules/`:**
- Purpose: npm dependencies
- Generated: Yes (managed by npm/yarn/pnpm)
- Committed: No (.gitignore excludes it)

**`.next/`:**
- Purpose: Next.js build cache and output
- Generated: Yes (by `next dev` or `next build`)
- Committed: No (.gitignore excludes it)

**`public/`:**
- Purpose: Static assets served at root URL
- Generated: No (manually maintained)
- Committed: Yes (version controlled)

---

*Structure analysis: 2026-05-12*