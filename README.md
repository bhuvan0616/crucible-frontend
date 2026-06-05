# Crucible Creations Storefront

Next.js storefront for Crucible Creations (Medusa backend, dark-mode commerce UI).

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Configure Medusa in `.env.local` (`NEXT_PUBLIC_MEDUSA_BACKEND_URL`, `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`).

### Contact form (Resend)

The `/contact` page sends messages via [Resend](https://resend.com). Add to `.env.local`:

```bash
RESEND_API_KEY=re_...
CONTACT_FROM_EMAIL=onboarding@resend.dev   # or your verified domain sender
CONTACT_TO_EMAIL=contact@cruciblecreations.studio
```

Without `RESEND_API_KEY`, the form validates but returns a friendly error when submitting.

See [AGENTS.md](./AGENTS.md) for project conventions, Medusa API notes, and phase workflow.

## Product customization

Per-product engraving, selects, and logos are configured in Medusa product metadata (`customization_fields`).

| Setup | Metadata shape | Pricing |
|-------|----------------|---------|
| Always-on fields | JSON **array** of fields | Variant price as usual |
| Standard vs Custom | JSON **object** with `when` + `fields` | Price **Custom** variants higher in Admin |

**Docs:** [docs/product-customization.md](./docs/product-customization.md) — Admin steps (Path A & B), `when` gate, field schema, line item metadata, API `+metadata`, troubleshooting.

## Learn more

- [Next.js documentation](https://nextjs.org/docs)
- [Medusa storefront docs](https://docs.medusajs.com/resources/storefront-development)
