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

Production URL: https://personal-webpage-three-woad.vercel.app

Use Bun for install and build:

```text
Install Command: bun install
Build Command: bun run build
```

Required production environment variable:

```text
NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app
```

Set `NEXT_PUBLIC_SITE_URL` for production builds so metadata, sitemap, and robots URLs use
the public site origin. Local development and tests fall back to `http://localhost:3000`
when the variable is not set.
