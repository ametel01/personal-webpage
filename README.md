# personal-webpage

Personal website for Alex Metelli, built with Next.js App Router, TypeScript, Tailwind, Biome, Bun, and Vercel Web Analytics.

## Local Development

Install dependencies:

```bash
bun install
```

Run the development server:

```bash
bun run dev
```

Run local quality gates:

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

The GitHub Actions CI workflow runs the same lint, typecheck, test, and build gates on
pull requests and pushes to `main`.
CI uses Bun 1.3.13. Use the same major/minor locally when investigating CI-only
install or test failures.

## Vercel Deployment

Canonical production URL: https://www.ametel.dev/

Use Bun for install and build:

```text
Install Command: bun install
Build Command: bun run build
```

Canonical metadata, sitemap, robots, and structured-data URLs are sourced from the reusable
SEO entity configuration in `src/lib/seo.ts` so previews and production builds describe the
same public identity.
