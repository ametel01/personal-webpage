# Plan 013: Render the featured work role from project data

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 7610aeb..HEAD -- app/work/page.tsx src/content/projects.ts src/content/content.test.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding. If they no longer match, treat it as a STOP condition.
>
> **Workspace safety check**: also run `git status --short -- app/work/page.tsx src/content/projects.ts src/content/content.test.ts`. Preserve unrelated user changes in these files.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `7610aeb`, 2026-06-21

## Why this matters

The `/work` page hardcodes the featured project role as `Lead Backend Engineer`, while the structured project data says Voyager Verifier's role is `Software Engineer at Nethermind`. This is a correctness and credibility issue on a site whose PRD emphasizes restrained, evidence-backed claims. The UI should render the role from the same content record that powers the case study metadata.

## Current state

Relevant files:

- `app/work/page.tsx` - renders the selected work page and featured project card.
- `src/content/projects.ts` - structured project source of truth.
- `src/content/content.test.ts` - route/content invariant tests that can lock this behavior.

Current UI excerpt:

```tsx
app/work/page.tsx:223 <div className="work-featured-meta">
app/work/page.tsx:224   <div>
app/work/page.tsx:225     <span>
app/work/page.tsx:227       Role
app/work/page.tsx:229     <strong>Lead Backend Engineer</strong>
```

Current structured content excerpt:

```ts
src/content/projects.ts:49 metadata: {
src/content/projects.ts:50   role: "Software Engineer at Nethermind",
src/content/projects.ts:51   stack: ["Rust", "Starknet", "Cairo", "Scarb", "AWS Console", "CloudWatch"],
src/content/projects.ts:52   currentState: "Open-source verifier tooling maintained under Nethermind."
```

Current PRD constraint:

```text
docs/PRD.md:270 Write case studies in restrained first person:
docs/PRD.md:277 Avoid inflated or vague claims.
```

Repo conventions:

- Keep public content in `src/content/*` when possible.
- Page components should render from structured content rather than duplicating claims.
- Tests use `bun test` with Node's built-in `node:test` and `node:assert/strict`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Unit tests | `bun run test` | exit 0, all tests pass |
| Lint | `bun run lint` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Browser smoke tests | `bun run test:e2e` | exit 0, all Playwright tests pass |

## Scope

**In scope**:

- `app/work/page.tsx`
- `src/content/content.test.ts`
- `src/content/projects.ts` only if the operator confirms the hardcoded role is accurate and the source data is wrong.

**Out of scope**:

- Rewriting `/work` layout or visual design.
- Changing project order or selected project slugs.
- Changing resume experience titles.
- Adding new projects or evidence claims.

## Git workflow

- Suggested branch: `advisor/013-featured-work-role`
- Commit message: `Render featured work role from project data`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Replace the hardcoded role with project metadata

In `FeaturedProjectCard` in `app/work/page.tsx`, replace:

```tsx
<strong>Lead Backend Engineer</strong>
```

with:

```tsx
<strong>{project.metadata.role}</strong>
```

This keeps `/work` aligned with the project detail pages, which already render `project.metadata.role`.

If a human operator confirms that `Lead Backend Engineer` is the accurate public role, STOP before editing the component and update `src/content/projects.ts` instead. The goal is one source of truth, not a different hardcoded string.

**Verify**: `bun run typecheck` -> exits 0.

### Step 2: Add a regression assertion

In `src/content/content.test.ts`, extend the existing `static page routes render route-critical content` test or add a nearby test for the `/work` page.

Assert that:

- `collectText(WorkPage())` contains `projects[0].metadata.role`.
- `collectText(WorkPage())` does not contain `Lead Backend Engineer` unless `projects[0].metadata.role` is exactly `Lead Backend Engineer`.

Keep the test data-driven. Do not duplicate the expected role in the test.

**Verify**: `bun run test` -> exits 0.

### Step 3: Run final gates

Run:

```bash
bun run lint
bun run typecheck
bun run test
bun run test:e2e
```

Expected result: every command exits 0.

## Test plan

- Unit coverage: `src/content/content.test.ts` should verify the `/work` render output uses the featured project's structured metadata role.
- Browser coverage: existing Playwright route smoke tests should still pass for `/work`.

## Done criteria

- [ ] `app/work/page.tsx` renders `{project.metadata.role}` in the featured project role field.
- [ ] No hardcoded `Lead Backend Engineer` remains in `app/work/page.tsx` unless it is also the structured role.
- [ ] `src/content/content.test.ts` covers the featured role rendering.
- [ ] `bun run lint` exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run test` exits 0.
- [ ] `bun run test:e2e` exits 0.
- [ ] No files outside the in-scope list are modified except `plans/README.md` status.

## STOP conditions

Stop and report back if:

- The current `/work` page no longer has a featured project role field.
- `projects[0]` is no longer the featured project source.
- The operator says the hardcoded role is intentionally different from the case study metadata.
- Fixing the issue requires broad content rewrites outside the selected work page.

## Maintenance notes

Future selected-work UI should render from `src/content/projects.ts` whenever it presents role, stack, current state, proof, or evidence. Avoid one-off public claims in page components because they drift from case study records and are harder to audit.
