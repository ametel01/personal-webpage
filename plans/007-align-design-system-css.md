# Plan 007: Align CSS tokens and proof bar with the design spec

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat f992468..HEAD -- app/globals.css docs/DESIGN.md src/content/content.test.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding. If they no longer match, treat it as a STOP condition.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: tech-debt
- **Planned at**: commit `f992468`, 2026-06-14

## Why this matters

The design docs are the source of truth for this site, but two global CSS decisions have drifted: the container width and the proof-bar background. This creates ambiguity for future agents and makes visual changes harder to review. The fix is small: either bring CSS back to the documented design or deliberately update the docs if the wider layout was an intentional product decision.

## Current state

Relevant files:

- `app/globals.css` - global design tokens and proof-band styles.
- `docs/DESIGN.md` - documented design-system constraints.
- `src/content/content.test.ts` - current invariant tests, if a small CSS-text invariant is desired.

Design spec excerpts:

```text
docs/DESIGN.md:91 Use a centered container:
docs/DESIGN.md:94 :root {
docs/DESIGN.md:95   --container: 1180px;
docs/DESIGN.md:404 Use a flat dark bar with four compact items.
```

Current CSS excerpts:

```css
app/globals.css:3 :root {
app/globals.css:4   --container: 1390px;

app/globals.css:133 .proof-band {
app/globals.css:134   background:
app/globals.css:135     radial-gradient(circle at 15% 20%, rgba(39, 64, 112, 0.34), transparent 38%),
app/globals.css:136     linear-gradient(135deg, #071024 0%, #091a35 48%, #071024 100%);
```

Repo/design conventions:

- Light theme only, restrained editorial layout, no heavy gradients.
- Page sections are full-width bands with constrained inner content.
- Avoid broad visual redesigns; keep changes close to the documented tokens.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `bun run lint` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Tests | `bun run test` | exit 0 |

## Scope

**In scope**:

- `app/globals.css`
- `docs/DESIGN.md` only if you determine the current CSS is intentionally preferred and needs documentation instead of reversal.
- `src/content/content.test.ts` only if adding a low-maintenance invariant around the documented proof-band rule.

**Out of scope**:

- Redesigning the homepage, selected-work cards, typography scale, color palette, or spacing beyond the two documented drifts.
- Adding new visual effects.
- Changing project content.

## Git workflow

- Suggested branch: `advisor/007-align-design-system-css`
- Commit message: `Align design system CSS with docs`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Decide source of truth for container width

Compare current layout needs against `docs/DESIGN.md`. Prefer restoring `--container: 1180px` unless a human has explicitly decided the four-project grid needs `1390px`.

If restoring the docs:

```css
:root {
  --container: 1180px;
}
```

If preserving `1390px`, update `docs/DESIGN.md` so the documented container token matches the live CSS and add one concise sentence explaining that the wider container supports four selected-work cards.

**Verify**: `bun run lint` -> exits 0.

### Step 2: Make the proof bar flat dark

In `app/globals.css`, replace the gradient `.proof-band` background with a flat dark color from the existing variables, for example:

```css
.proof-band {
  background: var(--color-dark);
  color: #ffffff;
  padding-block: clamp(0.55rem, 1vw, 0.75rem);
}
```

Do not add a new decorative effect. Keep the existing proof item layout and borders.

**Verify**: `bun run lint` -> exits 0.

### Step 3: Add a lightweight regression guard if useful

If this repo is likely to drift again, add a small test in `src/content/content.test.ts` that reads `app/globals.css` and asserts `.proof-band` does not include `gradient(`. Use Node's filesystem APIs in the existing `node:test` style. Keep it simple; do not parse CSS.

If you skip this test, mention why in the final implementation notes.

**Verify**: `bun run test` -> exits 0.

### Step 4: Run final gates

**Verify**:

- `bun run lint` -> exits 0.
- `bun run typecheck` -> exits 0.
- `bun run test` -> exits 0.

## Test plan

- Existing tests should continue passing.
- Optional new CSS-text invariant: `.proof-band` contains no `gradient(`.
- Browser/visual verification is not required by this plan, but if the executor is already running the app, inspect the homepage proof bar at desktop and mobile widths.

## Done criteria

- [ ] The live CSS and `docs/DESIGN.md` no longer contradict each other on container width.
- [ ] `.proof-band` uses a flat dark background, or the design docs have been intentionally updated to match a human-approved exception.
- [ ] `bun run lint` exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run test` exits 0.
- [ ] No files outside the in-scope list are modified except `plans/README.md` status if the executor updates it.

## STOP conditions

Stop and report back if:

- A human says the current gradient proof bar is intentional.
- Changing `--container` to 1180px visibly breaks the four-card selected-work layout and there is no approved design decision for the tradeoff.
- Fixing layout after the token change requires touching page components.

## Maintenance notes

If the container stays wider than 1180px, future design docs should explain why. Reviewers should reject new decorative gradients unless they are explicitly added to `docs/DESIGN.md`.
