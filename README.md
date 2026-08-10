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
bun run test:seo
bun run build
```

The GitHub Actions CI workflow runs lint, typecheck, unit tests, the full browser suite (including
the SEO retrieval audit), and the production build on pull requests and pushes to `main`.
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

## SEO and retrieval checks

`bun run test:seo` starts the site through Playwright and audits every content-derived indexable
route. It checks response status, canonical and robots metadata, unique titles and descriptions,
visible and server-rendered page structure, JSON-LD identity consistency, sitemap coverage and
dates, internal links, and the media types and bodies of `robots.txt`, `sitemap.xml`, and
`llms.txt`.

Run the AI crawler smoke check against any deployed environment with:

```bash
SEO_BASE_URL=https://www.ametel.dev bun run test:ai-crawlers
```

The scheduled `Live SEO retrieval smoke` GitHub Actions workflow runs that command daily against
the canonical production site so CDN, bot-protection, or firewall regressions are detected outside
the local application server.
