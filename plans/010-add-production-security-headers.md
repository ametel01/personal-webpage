# Plan 010: Add baseline production security headers

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat f992468..HEAD -- next.config.ts src/content/content.test.ts README.md`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding. If they no longer match, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `f992468`, 2026-06-14

## Why this matters

This is a static public site, so the security risk is modest, but explicit baseline headers reduce browser attack surface and make production behavior less dependent on hosting defaults. The site currently has an empty Next config, so there is a clean place to add headers. This should be done conservatively to avoid breaking Vercel Analytics, images, or normal navigation.

## Current state

Relevant files:

- `next.config.ts` - currently empty Next config.
- `src/content/content.test.ts` - existing metadata/route tests, suitable for a small config test if desired.
- `README.md` - deployment notes if maintainers want documented headers.

Current config excerpt:

```ts
next.config.ts:1 import type { NextConfig } from "next";
next.config.ts:3 const nextConfig: NextConfig = {};
next.config.ts:5 export default nextConfig;
```

Repo conventions:

- Keep config minimal.
- Avoid production environment changes unless they are reproducible in code.
- Use TypeScript and existing `NextConfig` typing.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Typecheck | `bun run typecheck` | exit 0 |
| Lint | `bun run lint` | exit 0 |
| Tests | `bun run test` | exit 0 |

## Scope

**In scope**:

- `next.config.ts`
- `src/content/content.test.ts` if adding a header-config regression test.
- `README.md` if documenting production headers.

**Out of scope**:

- Adding a strict Content Security Policy in this plan.
- Changing Vercel project settings.
- Changing application pages or metadata.
- Blocking analytics, image optimization, or external profile links.

## Git workflow

- Suggested branch: `advisor/010-security-headers`
- Commit message: `Add baseline security headers`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Add conservative global headers

Update `next.config.ts` to define `headers()` on `nextConfig`. Apply headers to all routes with `source: "/(.*)"`.

Use conservative baseline headers:

```ts
const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  }
] as const;

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders]
      }
    ];
  }
};
```

Do not add CSP here. A CSP requires separate validation for Vercel Analytics, Next scripts, images, and future embeds.

**Verify**: `bun run typecheck` -> exits 0.

### Step 2: Add a config regression test if practical

If `bun test` can import `next.config.ts` without side effects, add a test in `src/content/content.test.ts` or a new config test that imports the config and asserts:

- `headers` exists.
- Calling `headers()` returns a route with `source: "/(.*)"`.
- Header keys include `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy`.

If importing Next config from the test runner is awkward, skip the test and document that the typecheck covers config shape; do not build a custom parser.

**Verify**: `bun run test` -> exits 0.

### Step 3: Run final gates

**Verify**:

- `bun run lint` -> exits 0.
- `bun run typecheck` -> exits 0.
- `bun run test` -> exits 0.

Avoid `bun run build` unless asked; in this repo Next build can rewrite generated route type files.

## Test plan

- Prefer a small unit test around `nextConfig.headers()` if importable.
- Otherwise rely on TypeScript validation and manual review of `next.config.ts`.
- No browser test is required for this plan.

## Done criteria

- [ ] `next.config.ts` defines conservative global security headers.
- [ ] No CSP is added in this plan.
- [ ] `bun run lint` exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run test` exits 0.
- [ ] No files outside the in-scope list are modified except `plans/README.md` status if the executor updates it.

## STOP conditions

Stop and report back if:

- A required header breaks Vercel Analytics, images, or navigation.
- A strict CSP appears necessary to satisfy the request.
- The Next config API has changed and the documented `headers()` shape no longer typechecks.

## Maintenance notes

If the site later adds embeds, forms, third-party scripts, or a custom analytics stack, revisit these headers. A CSP should be a separate plan with browser verification, not a small hardening drive-by.
