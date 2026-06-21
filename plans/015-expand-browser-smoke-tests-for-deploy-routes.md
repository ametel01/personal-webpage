# Plan 015: Expand browser smoke tests to deployment-facing routes

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 7610aeb..HEAD -- tests/e2e/public-routes.e2e.ts playwright.config.ts app/sitemap.ts app/robots.ts next.config.ts src/content/content.test.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding. If they no longer match, treat it as a STOP condition.
>
> **Workspace safety check**: also run `git status --short -- tests/e2e/public-routes.e2e.ts playwright.config.ts app/sitemap.ts app/robots.ts next.config.ts src/content/content.test.ts`. Preserve unrelated user changes.

## Status

- **Priority**: P2
- **Effort**: S/M
- **Risk**: LOW
- **Depends on**: plans/014-decide-agentreceipt-vercel-redirect.md
- **Category**: tests
- **Planned at**: commit `7610aeb`, 2026-06-21

## Why this matters

The Playwright smoke suite covers public HTML routes, but deployment-facing routes such as `/resume.pdf`, `/robots.txt`, `/sitemap.xml`, and runtime security headers are only partially covered by unit tests or not exercised through the running app. These are crawler, hiring-manager, and deployment surfaces. Expanding the smoke tests gives CI a better signal before Vercel deploys a broken PDF, sitemap, robots file, or header configuration.

## Current state

Relevant files:

- `tests/e2e/public-routes.e2e.ts` - existing Playwright smoke suite.
- `playwright.config.ts` - starts `next dev` with `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
- `app/sitemap.ts` - includes static pages and `/resume.pdf`.
- `app/robots.ts` - points crawlers at `/sitemap.xml`.
- `next.config.ts` - defines global security headers.
- `src/content/content.test.ts` - unit tests for metadata routes and header config.

Current Playwright route list:

```ts
tests/e2e/public-routes.e2e.ts:4 const projectRoutes = projects.map((project) => `/work/${project.slug}`);
tests/e2e/public-routes.e2e.ts:5 const publicRoutes = ["/", "/work", ...projectRoutes, "/about", "/resume"] as const;
```

Current sitemap/robots excerpts:

```ts
app/sitemap.ts:5 const staticRoutes = ["/", "/work", "/about", "/resume", "/resume.pdf"] as const;
app/robots.ts:10 sitemap: getAbsoluteUrl("/sitemap.xml")
```

Current header config excerpt:

```ts
next.config.ts:22 const nextConfig: NextConfig = {
next.config.ts:23   async headers() {
next.config.ts:26     source: "/(.*)",
next.config.ts:27     headers: [...securityHeaders]
```

Current unit test coverage excerpt:

```ts
src/content/content.test.ts:288 test("Next config applies conservative global security headers", async () => {
src/content/content.test.ts:473 test("metadata routes include public pages and project routes", async () => {
```

Repo conventions:

- Playwright tests should not depend on external websites being available.
- Import route/project data from source where it avoids duplicating route lists.
- Keep this as smoke coverage, not visual snapshot testing.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Browser tests | `bun run test:e2e` | exit 0, all Playwright tests pass |
| Unit tests | `bun run test` | exit 0 |
| Lint | `bun run lint` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |

## Scope

**In scope**:

- `tests/e2e/public-routes.e2e.ts`
- `src/content/content.test.ts` only if a route/config assertion is easier or more deterministic as a unit test.

**Out of scope**:

- Changing route implementation in `app/sitemap.ts`, `app/robots.ts`, or `next.config.ts` unless a test exposes a real bug.
- Testing external evidence links by navigating away from the site.
- Visual regression snapshots.
- Testing Vercel-only redirects from `vercel.json`; plan 014 owns that surface.

## Git workflow

- Suggested branch: `advisor/015-deploy-route-smoke-tests`
- Commit message: `Expand browser smoke tests for deployment routes`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Add non-HTML public route tests

In `tests/e2e/public-routes.e2e.ts`, add tests using Playwright's request API for:

- `/resume.pdf`
- `/robots.txt`
- `/sitemap.xml`

Suggested assertions:

```ts
const response = await page.request.get("/resume.pdf");
expect(response.ok()).toBe(true);
expect(response.headers()["content-type"]).toContain("application/pdf");
```

For `/robots.txt`, assert the response is OK and its text contains `Sitemap:`.

For `/sitemap.xml`, assert the response is OK and its text includes:

- `<loc>http://localhost:3000/</loc>`
- `<loc>http://localhost:3000/resume.pdf</loc>`
- every `/work/${project.slug}` path from `projects`

Do not request external URLs from inside the sitemap.

**Verify**: `bun run test:e2e` -> exits 0.

### Step 2: Add runtime header smoke coverage

Add a Playwright test that navigates to `/` and reads the response headers from `page.goto("/")`.

Assert:

- `x-content-type-options` is `nosniff`.
- `referrer-policy` is `strict-origin-when-cross-origin`.
- `x-frame-options` is `DENY`.
- `permissions-policy` contains `camera=()`, `microphone=()`, and `geolocation=()`.

If Next dev does not apply `next.config.ts` headers and this test fails for that reason, STOP and report. Do not delete the existing unit test in `src/content/content.test.ts`; it still verifies the config shape.

**Verify**: `bun run test:e2e` -> exits 0.

### Step 3: Keep unit tests aligned

If the Playwright tests duplicate logic already in `src/content/content.test.ts`, leave the unit tests in place. They are fast and catch config/data regressions without starting a browser.

Only edit `src/content/content.test.ts` if you need a deterministic assertion that Playwright cannot express in the local dev server.

**Verify**: `bun run test` -> exits 0.

### Step 4: Run final gates

Run:

```bash
bun run lint
bun run typecheck
bun run test
bun run test:e2e
```

Expected result: every command exits 0.

## Test plan

- Playwright covers HTML routes, PDF availability, robots text, sitemap XML, and runtime headers.
- Unit tests continue to cover metadata route generation and Next config header definitions.
- No test should depend on external websites being reachable.

## Done criteria

- [ ] `tests/e2e/public-routes.e2e.ts` checks `/resume.pdf`.
- [ ] `tests/e2e/public-routes.e2e.ts` checks `/robots.txt`.
- [ ] `tests/e2e/public-routes.e2e.ts` checks `/sitemap.xml`.
- [ ] `tests/e2e/public-routes.e2e.ts` checks runtime security headers on `/`, or the executor reports that Next dev cannot expose them.
- [ ] `bun run lint` exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run test` exits 0.
- [ ] `bun run test:e2e` exits 0.
- [ ] No files outside the in-scope list are modified except `plans/README.md` status.

## STOP conditions

Stop and report back if:

- Plan 014 has not resolved whether `vercel.json` remains.
- Next dev does not serve the header behavior being tested and a production-server test would be required.
- Testing `/resume.pdf`, `/robots.txt`, or `/sitemap.xml` requires changing app code outside the test scope.
- Any test attempts to navigate to external evidence links.

## Maintenance notes

When adding future public assets or metadata routes, update this smoke suite if the route is user-facing, crawler-facing, or deployment-critical. Keep assertions structural and deterministic so CI failures point to concrete regressions.
