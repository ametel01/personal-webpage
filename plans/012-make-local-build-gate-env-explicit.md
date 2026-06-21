# Plan 012: Make the local production build gate executable

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 7610aeb..HEAD -- README.md package.json src/lib/metadata.ts .github/workflows/ci.yml`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding. If they no longer match, treat it as a STOP condition.
>
> **Workspace safety check**: also run `git status --short -- README.md package.json src/lib/metadata.ts .github/workflows/ci.yml`. At plan time the worktree already had unrelated uncommitted changes in `package.json`; preserve them unless this plan explicitly changes the same script line.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `7610aeb`, 2026-06-21

## Why this matters

The README currently tells a contributor to run `bun run build` as a local quality gate, but a plain production build fails when `NEXT_PUBLIC_SITE_URL` is not configured. The failure is intentional in `src/lib/metadata.ts` because production metadata must use the public origin, and CI already passes the environment variable. The improvement is to make the local build gate explicit and reproducible without weakening the production metadata guard.

## Current state

Relevant files:

- `README.md` - local development and deployment instructions.
- `package.json` - Bun scripts used by contributors and CI.
- `src/lib/metadata.ts` - throws in production when `NEXT_PUBLIC_SITE_URL` is absent.
- `.github/workflows/ci.yml` - shows the CI build already sets the production site URL.

Current README excerpt:

```text
README.md:19 Run local quality gates:
README.md:21 ```bash
README.md:22 bun run lint
README.md:23 bun run typecheck
README.md:24 bun run test
README.md:25 bun run build
README.md:26 ```
```

Current package script excerpt:

```json
package.json:6 "scripts": {
package.json:7   "dev": "next dev",
package.json:8   "build": "next build",
package.json:9   "lint": "biome check .",
package.json:10  "format": "biome format --write .",
package.json:11  "typecheck": "tsc --noEmit",
package.json:12  "test": "bun test",
package.json:13  "verify": "bun run format && bun run lint && bun run typecheck && bun run test",
package.json:14  "test:e2e": "playwright test"
}
```

Current metadata excerpt:

```ts
src/lib/metadata.ts:6 export function resolveSiteUrl() {
src/lib/metadata.ts:7   const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;
src/lib/metadata.ts:9   if (!configuredUrl) {
src/lib/metadata.ts:10    if (process.env.NODE_ENV === "production") {
src/lib/metadata.ts:11      throw new Error("NEXT_PUBLIC_SITE_URL is required for production metadata.");
```

Current CI excerpt:

```yaml
.github/workflows/ci.yml:42 - name: Build
.github/workflows/ci.yml:43   run: bun run build
.github/workflows/ci.yml:44   env:
.github/workflows/ci.yml:45     NEXT_TELEMETRY_DISABLED: "1"
.github/workflows/ci.yml:46     NEXT_PUBLIC_SITE_URL: https://personal-webpage-three-woad.vercel.app
```

Observed command behavior during the advisor audit:

- `bun run build` failed without `NEXT_PUBLIC_SITE_URL`.
- `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build` passed.

Repo conventions:

- Use Bun scripts and commands only.
- `format` is a write command. Do not put it in a "verify" or "quality gate" script unless the script is intentionally allowed to mutate files.
- Production metadata should continue to require `NEXT_PUBLIC_SITE_URL`; do not replace the production error with a localhost fallback.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `bun run lint` | exit 0, no fixes applied |
| Typecheck | `bun run typecheck` | exit 0, no errors |
| Unit tests | `bun run test` | exit 0, all tests pass |
| Local build | `bun run build:local` | exit 0, static pages generated |
| CI-style build | `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build` | exit 0 |

## Scope

**In scope**:

- `package.json`
- `README.md`

**Out of scope**:

- `src/lib/metadata.ts` - keep the production guard.
- `.github/workflows/ci.yml` - CI already sets the production URL.
- Any dependency changes.
- Any formatting sweep across source files.

## Git workflow

- Suggested branch: `advisor/012-local-build-gate`
- Commit message: `Document local production build gate`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Add a local build script

In `package.json`, add a script named `build:local`:

```json
"build:local": "NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 next build"
```

Keep the existing `build` script as `next build`; CI and Vercel should continue using it with a production `NEXT_PUBLIC_SITE_URL`.

If the `verify` script is still present and still uses `bun run format`, change it to a non-mutating quality gate:

```json
"verify": "bun run lint && bun run typecheck && bun run test && bun run build:local"
```

If the `verify` script is absent, do not add it unless the user asked for one.

**Verify**: `bun run build:local` -> exits 0.

### Step 2: Update the README quality gates

Update `README.md` so the local quality gate block uses `bun run build:local`, not plain `bun run build`.

Also update the sentence that says CI runs the same gates. The accurate wording should say CI runs lint, typecheck, tests, browser smoke tests, and a production build with `NEXT_PUBLIC_SITE_URL` set.

Do not remove the Vercel deployment section that documents the required production environment variable.

**Verify**: `git diff --check README.md package.json` -> exits 0.

### Step 3: Run final gates

Run:

```bash
bun run lint
bun run typecheck
bun run test
bun run build:local
NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build
```

Expected result: every command exits 0.

## Test plan

No new test file is needed. The regression is covered by a machine-checkable script and README command:

- `bun run build:local` proves a contributor can run the documented local build gate without a private `.env` file.
- The CI-style build proves the production metadata guard still works when the public origin is configured.

## Done criteria

- [ ] `package.json` has a `build:local` script that sets `NEXT_PUBLIC_SITE_URL=http://localhost:3000`.
- [ ] `package.json` keeps `build` as `next build`.
- [ ] If `verify` exists, it is non-mutating and includes `build:local`.
- [ ] `README.md` local quality gates list `bun run build:local`.
- [ ] `README.md` still documents production `NEXT_PUBLIC_SITE_URL`.
- [ ] `bun run lint` exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run test` exits 0.
- [ ] `bun run build:local` exits 0.
- [ ] `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build` exits 0.
- [ ] No files outside the in-scope list are modified except `plans/README.md` status.

## STOP conditions

Stop and report back if:

- `src/lib/metadata.ts` no longer requires `NEXT_PUBLIC_SITE_URL` in production; this plan's premise has drifted.
- `bun run build:local` fails twice after correcting obvious script syntax.
- A fix appears to require changing metadata behavior or Vercel settings.
- The operator requires Windows shell compatibility for scripts; adding a cross-platform env helper would be a separate dependency decision.

## Maintenance notes

Keep local and production builds distinct. Local builds can use `http://localhost:3000`; CI and Vercel builds must use the public production URL so sitemap, robots, Open Graph, and canonical metadata stay crawler-safe.
