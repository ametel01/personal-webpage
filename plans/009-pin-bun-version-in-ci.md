# Plan 009: Pin the Bun version used by CI

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat f992468..HEAD -- .github/workflows/ci.yml README.md package.json bun.lock`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding. If they no longer match, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: dx
- **Planned at**: commit `f992468`, 2026-06-14

## Why this matters

The lockfile makes dependencies reproducible, but CI currently installs the latest Bun runtime on every run. A Bun release can change install, test, or lockfile behavior without any repository change. Pinning Bun to the version used during local verification makes CI failures easier to reproduce.

## Current state

Relevant files:

- `.github/workflows/ci.yml` - CI setup.
- `README.md` - local development docs.
- `package.json` / `bun.lock` - Bun project signals.

Current CI excerpt:

```yaml
.github/workflows/ci.yml:16 - name: Setup Bun
.github/workflows/ci.yml:17   uses: oven-sh/setup-bun@v2
.github/workflows/ci.yml:18   with:
.github/workflows/ci.yml:19     bun-version: latest
```

Current local command evidence:

```text
Recent audit output used bun v1.3.13.
package.json:6 "scripts": {
package.json:12 "test": "bun test"
```

Repo conventions:

- Use Bun only. Do not introduce npm, pnpm, or yarn.
- CI mirrors local quality gates: install, lint, typecheck, test, build.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint workflow YAML through Biome | `bun run lint` | exit 0 |
| Unit tests | `bun run test` | exit 0 |

## Scope

**In scope**:

- `.github/workflows/ci.yml`
- `README.md` if documenting the pinned version.

**Out of scope**:

- Changing dependency versions.
- Changing `bun.lock`.
- Adding new CI jobs.
- Changing React Doctor workflow unless explicitly requested.

## Git workflow

- Suggested branch: `advisor/009-pin-bun-version`
- Commit message: `Pin Bun version in CI`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Pin CI to the current verified Bun version

In `.github/workflows/ci.yml`, replace:

```yaml
bun-version: latest
```

with:

```yaml
bun-version: 1.3.13
```

If the repository has since adopted a different Bun version, use the version from the current local `bun --version` output and document it in your final notes.

**Verify**: `bun run lint` -> exits 0.

### Step 2: Document the CI runtime if desired

If maintainers expect contributors to match CI exactly, add a short README note under Local Development:

```text
CI uses Bun 1.3.13. Use the same major/minor locally when investigating CI-only install or test failures.
```

Do not add a new version manager unless the repo already uses one.

**Verify**: `git diff --check` -> exits 0.

### Step 3: Run focused gates

**Verify**:

- `bun run lint` -> exits 0.
- `bun run test` -> exits 0.

## Test plan

No new tests are needed. This is a CI reproducibility change. Existing lint and tests should continue passing.

## Done criteria

- [ ] `.github/workflows/ci.yml` no longer uses `bun-version: latest`.
- [ ] The pinned version matches a currently verified Bun runtime.
- [ ] `bun run lint` exits 0.
- [ ] `bun run test` exits 0.
- [ ] No files outside the in-scope list are modified except `plans/README.md` status if the executor updates it.

## STOP conditions

Stop and report back if:

- The repo has adopted a version manager or documented Bun version that conflicts with `1.3.13`.
- Pinning Bun causes `bun install --frozen-lockfile` to fail in CI or locally.
- The fix appears to require lockfile churn.

## Maintenance notes

When upgrading Bun intentionally, update the CI pin in the same PR as any lockfile or script changes that require the new runtime. Reviewers should treat unplanned Bun-version changes as build-system changes, not incidental YAML cleanup.
