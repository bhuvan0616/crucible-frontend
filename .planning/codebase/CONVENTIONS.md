# Coding Conventions

**Analysis Date:** 2026-05-12

## Naming Patterns

**Files:**
- PascalCase for React components: `page.tsx`, `layout.tsx`, `Home.tsx`
- camelCase for utilities/helpers: Not detected in current codebase
- kebab-case for directories: Not used

**Functions:**
- PascalCase for React component functions: `export default function Home()`
- camelCase for regular functions: Not used yet

**Variables:**
- camelCase: `const geistSans = Geist({...`
- PascalCase for component names and type imports

**Types:**
- PascalCase for TypeScript types/interfaces: `type Metadata`, `Readonly<{children: React.ReactNode}>`

## Code Style

**Formatting:**
- Tool: ESLint (via `eslint-config-next`)
- Tailwind CSS v4 with PostCSS
- No Prettier config detected (uses ESLint defaults)

**Linting:**
- ESLint 9 with `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Strict TypeScript mode enabled (`"strict": true` in tsconfig.json)
- Path alias: `@/*` → `./` (project root)

**Key ESLint rules from Next.js config:**
- `core-web-vitals`: Enforces Next.js performance best practices
- `typescript`: Extended TypeScript linting rules

**Import organization:**
1. React/Next.js imports (e.g., `import Image from "next/image"`)
2. Type imports (e.g., `import type { Metadata } from "next"`)
3. Third-party library imports
4. Local imports (e.g., `./globals.css`)

**Example from `app/layout.tsx`:**
```typescript
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
```

## Error Handling

**Patterns:**
- Type-safe props using TypeScript interfaces (`Readonly<{children: React.ReactNode}>`)
- No try-catch patterns observed in current codebase
- Error boundaries: Not implemented yet

**Validation:**
- Next.js metadata API for type-safe metadata
- Strict TypeScript checks enabled

## Logging

**Framework:** Not detected (no custom logging setup)
- Default: `console.log` for development debugging
- Production logging: Not configured

**Patterns:** No structured logging pattern established

## Comments

**When to Comment:**
- JSDoc for exported functions/components: Not used in current codebase
- Inline comments for complex logic: Not present

**TSDoc:**
- Not used in current codebase

## Function Design

**Size:** Small, focused components (current max ~65 lines)

**Parameters:**
- Typed interface for component props
- No unused parameters

**Return Values:**
- Implicit return for JSX
- Explicit return types for utilities: Not present

## Module Design

**Exports:**
- Default exports for page components: `export default function Home()`
- Named exports for utilities: Not present

**Barrel Files:** Not used (no `index.ts` exports)

## Project Structure

```
crucible/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout with fonts
│   ├── page.tsx            # Home page
│   ├── globals.css         # Global styles
│   └── favicon.ico
├── public/                 # Static assets
├── .next/                  # Build output (generated)
├── node_modules/
├── package.json
├── tsconfig.json           # Path aliases: @/* → ./*
├── eslint.config.mjs       # ESLint 9 flat config
├── next.config.ts
├── postcss.config.mjs      # Tailwind CSS 4
└── .planning/              # Planning documents
```

**Where to Add New Code:**

| Type | Location |
|------|----------|
| New page | `app/[name]/page.tsx` |
| New layout | `app/[name]/layout.tsx` |
| New component | `app/components/[name].tsx` |
| New utility | `app/lib/[name].ts` |
| New style | `app/globals.css` or CSS modules |

## Code Patterns

**Component Pattern:**
```typescript
export default function ComponentName() {
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}
```

**Layout Pattern:**
```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "...",
  description: "...",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
```

**Tailwind CSS v4 Pattern:**
```css
@import "tailwindcss";

:root {
  --background: #ffffff;
  --foreground: #171717;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
}
```

---

*Convention analysis: 2026-05-12*