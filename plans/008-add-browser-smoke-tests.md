# Plan 008: Add automated browser smoke tests for public routes

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat f992468..HEAD -- package.json .github/workflows/ci.yml docs/IMPLEMENTATION_PLAN.md app src`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding. If they no longer match, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: M
- **Risk**: MED
- **Depends on**: plans/006-show-homepage-project-proof.md, plans/007-align-design-system-css.md
- **Category**: tests
- **Planned at**: commit `f992468`, 2026-06-14

## Why this matters

The implementation plan requires browser-level checks for mobile/desktop layout, one `h1` per page, broken links, image alt text, external-link behavior, and route usability. Playwright is already installed, but there is no browser test script or CI step using it. Automating a small smoke suite will catch regressions that the current content-only tests cannot see.

## Current state

Relevant files:

- `package.json` - scripts and existing Playwright dependency.
- `.github/workflows/ci.yml` - current quality gate.
- `src/content/content.test.ts` - current non-browser invariant coverage.
- `docs/IMPLEMENTATION_PLAN.md` - manual QA expectations.
- `app/**` and `src/**` - public routes/components under test.

Current package excerpt:

```json
package.json:6 "scripts": {
package.json:7   "dev": "next dev",
package.json:8   "build": "next build",
package.json:9   "lint": "biome check .",
package.json:11  "typecheck": "tsc --noEmit",
package.json:12  "test": "bun test",
package.json:24  "@playwright/test": "^1.60.0"
```

Current CI excerpt:

```yaml
.github/workflows/ci.yml:21 - name: Install dependencies
.github/workflows/ci.yml:22   run: bun install --frozen-lockfile
.github/workflows/ci.yml:24 - name: Lint
.github/workflows/ci.yml:27 - name: Typecheck
.github/workflows/ci.yml:30 - name: Test
.github/workflows/ci.yml:33 - name: Build
```

Manual QA excerpts:

```text
docs/IMPLEMENTATION_PLAN.md:38 Until an automated browser suite exists, perform manual browser verification...
docs/IMPLEMENTATION_PLAN.md:570 - Verify all links.
docs/IMPLEMENTATION_PLAN.md:572 - Verify all pages have exactly one `h1`.
docs/IMPLEMENTATION_PLAN.md:580 - All pages are usable on mobile and desktop.
docs/IMPLEMENTATION_PLAN.md:581 - No route has broken links.
```

Repo conventions:

- Use Bun scripts.
- Keep tests deterministic and avoid real external network assertions.
- Existing unit tests use `bun test`; browser tests can use `@playwright/test` because it is already installed.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Install browsers if needed | `bunx playwright install chromium` | exit 0 |
| Browser tests | `bun run test:e2e` | exit 0, all Playwright tests pass |
| Lint | `bun run lint` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Unit tests | `bun run test` | exit 0 |

## Scope

**In scope**:

- `package.json`
- `playwright.config.ts` (create)
- `tests/e2e/public-routes.spec.ts` or `e2e/public-routes.spec.ts` (create one clear location)
- `.github/workflows/ci.yml`
- `docs/IMPLEMENTATION_PLAN.md` only to replace the stale manual-only wording if needed.

**Out of scope**:

- Visual snapshot testing.
- Testing external websites' availability.
- Rewriting existing `bun test` content tests.
- Adding accessibility libraries unless the executor confirms they are already present; keep this plan as a smoke suite.

## Git workflow

- Suggested branch: `advisor/008-browser-smoke-tests`
- Commit message: `Add browser smoke tests for public routes`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Add a Playwright config

Create `playwright.config.ts` using `@playwright/test`. Configure:

- `testDir` to the chosen e2e directory.
- `webServer.command` to `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run dev`.
- `webServer.url` to `http://localhost:3000`.
- `reuseExistingServer` to `!process.env.CI`.
- Projects for desktop Chromium and mobile Chromium, using a mobile viewport such as 390x900.

Keep reporter output simple, e.g. `list`.

**Verify**: `bun run typecheck` -> exits 0.

### Step 2: Add route smoke tests

Create a browser spec covering these routes:

- `/`
- `/work`
- `/work/voyager-verifier`
- `/work/aggsandbox`
- `/work/scopepilot`
- `/work/horizon-starknet`
- `/about`
- `/resume`

For each route:

- Navigate with `page.goto(path)`.
- Assert status is OK if using the response from `goto`.
- Assert exactly one visible `h1`.
- Assert no horizontal overflow: `document.documentElement.scrollWidth <= window.innerWidth + 1`.
- Assert there are no links with empty `href`.

Add specific checks:

- Homepage includes all project titles and proof strings after plan 006 lands.
- `/about` has an image with non-empty `alt`.
- External links with `target="_blank"` have `rel` containing `noreferrer`.
- Evidence links on project pages have HTTPS `href` values, but do not request those external URLs.

Use route/project data from `src/content/projects.ts` where practical so the test tracks the data source.

**Verify**: `bun run test:e2e` -> exits 0.

### Step 3: Add package and CI scripts

Update `package.json`:

```json
"test:e2e": "playwright test"
```

Update `.github/workflows/ci.yml` after the unit `Test` step or after `Build`:

```yaml
- name: Install Playwright browsers
  run: bunx playwright install --with-deps chromium

- name: Browser smoke tests
  run: bun run test:e2e
  env:
    NEXT_TELEMETRY_DISABLED: "1"
    NEXT_PUBLIC_SITE_URL: http://localhost:3000
```

If `--with-deps` is too slow or fails in CI, use the official Playwright guidance for Ubuntu runners and document the reason in the plan status notes.

**Verify**: `bun run lint` -> exits 0.

### Step 4: Update docs

In `docs/IMPLEMENTATION_PLAN.md`, replace stale "until an automated browser suite exists" language only if it is now false. Also fix the stale production verification line saying "All three case studies render" to match the four current project routes.

Do not rewrite the whole implementation plan.

**Verify**: `git diff --check` -> exits 0.

### Step 5: Run final gates

**Verify**:

- `bun run lint` -> exits 0.
- `bun run typecheck` -> exits 0.
- `bun run test` -> exits 0.
- `bun run test:e2e` -> exits 0.

Do not run `bun run build` unless instructed; in this repo Next can rewrite generated route type files.

## Test plan

- New Playwright tests should cover route availability, one-H1 invariant, no horizontal overflow on desktop/mobile projects, external-link rel behavior, about image alt, and project proof rendering.
- Existing `bun test` content invariants should stay unchanged unless route data import paths require adjustment.

## Done criteria

- [ ] `package.json` has a `test:e2e` script.
- [ ] A Playwright config starts the local Next dev server with deterministic env.
- [ ] Browser smoke tests cover all public HTML routes listed above.
- [ ] CI runs browser smoke tests.
- [ ] `bun run lint` exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run test` exits 0.
- [ ] `bun run test:e2e` exits 0.
- [ ] No files outside the in-scope list are modified except `plans/README.md` status if the executor updates it.

## STOP conditions

Stop and report back if:

- Installing/running Playwright browsers is not possible in the execution environment.
- The test suite requires external network calls to pass.
- The browser tests require changing app code beyond tiny accessibility fixes.
- Plan 006 has not landed and homepage proof assertions would freeze the current missing-proof bug.

## Maintenance notes

Keep this suite as smoke coverage, not a visual regression framework. If it becomes slow, reduce assertions before removing whole routes. Future project additions should only require updating `src/content/projects.ts` if tests import the project list.
