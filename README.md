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

## Vercel Deployment

Production URL: https://personal-webpage-three-woad.vercel.app

Use Bun for install and build:

```text
Install Command: bun install
Build Command: bun run build
```

Optional environment variable:

```text
NEXT_PUBLIC_SITE_URL
```

Set `NEXT_PUBLIC_SITE_URL` only when a production domain is assigned. The app does not hard-code a production domain; metadata, sitemap, and robots URLs use this variable when present and fall back to localhost for local development.
