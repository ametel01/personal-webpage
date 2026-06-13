# Plan 011: Clean up stale selected-work documentation

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat f992468..HEAD -- docs/IMPLEMENTATION_PLAN.md docs/PRD.md docs/DESIGN.md plans/README.md`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding. If they no longer match, treat it as a STOP condition.

## Status

- **Priority**: P3
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `f992468`, 2026-06-14

## Why this matters

Most docs now describe four selected-work projects, but one production-verification line still used old three-project wording. Stale docs are worse than missing docs for this repo because future agents use these files as implementation contracts. This plan removes the remaining contradiction and refreshes old rejected-plan notes that still mention the prior three-project PRD.

## Current state

Relevant files:

- `docs/IMPLEMENTATION_PLAN.md` - living implementation/deployment checklist.
- `plans/README.md` - advisor plan index and rejected findings.
- `docs/PRD.md` and `docs/DESIGN.md` - current source of truth for selected-work route count.

Current selected-work docs:

```text
docs/PRD.md:190 V1 uses four strong case studies only:
docs/DESIGN.md:316 Use four cards in v1:
docs/IMPLEMENTATION_PLAN.md:708 Selected Work includes exactly Voyager Verifier, AggSandbox, ScopePilot, and Horizon Protocol.
```

Historical stale excerpt from the original audit:

```text
docs/IMPLEMENTATION_PLAN.md:686 Production verification:
docs/IMPLEMENTATION_PLAN.md:690 - All three case studies render.
```

Historical potentially stale rejected-finding note from the original audit:

```text
plans/README.md:31 Dedicated direction plan for adding more project pages: rejected for now because `docs/PRD.md` says v1 should use three strong case studies only...
```

These quoted examples are intentionally preserved here as audit history for this plan. Living
documentation and plan-index rationale should not keep the stale selected-work count.

Repo conventions:

- Docs should be factual and restrained.
- Do not add unsupported metrics or new project recommendations.
- Keep historical plan statuses, but update clearly stale rationale when current docs supersede it.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Diff whitespace check | `git diff --check` | exit 0 |
| Stale text audit | `rg -n "all three case studies|three strong case studies|three cards|NoGame|nogame|Gamepad2" docs plans --glob '!plans/011-clean-up-selected-work-docs.md'` | no stale selected-work matches in living docs or other plans |

## Scope

**In scope**:

- `docs/IMPLEMENTATION_PLAN.md`
- `plans/README.md`
- `docs/PRD.md` and `docs/DESIGN.md` only if the audit finds additional stale selected-work contradictions.

**Out of scope**:

- Source code changes.
- Project content changes.
- Adding or removing case studies.
- Rewriting the full implementation plan.

## Git workflow

- Suggested branch: `advisor/011-selected-work-doc-cleanup`
- Commit message: `Clean up selected work docs`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Fix the stale production-verification count

In `docs/IMPLEMENTATION_PLAN.md`, replace:

```text
- All three case studies render.
```

with either:

```text
- All four case studies render.
```

or a route-explicit line:

```text
- Voyager Verifier, AggSandbox, ScopePilot, and Horizon Protocol case studies render.
```

Prefer the route-explicit line if it makes future regressions easier to spot.

**Verify**: `git diff --check` -> exits 0.

### Step 2: Refresh stale rejected-plan rationale

In `plans/README.md`, update the rejected finding that says the PRD has "three strong case studies only." The current PRD has four. Keep the original rejection intent: do not add additional project pages without evidence.

Target meaning:

```text
Dedicated direction plan for adding more project pages: rejected for now because the current PRD limits v1 to the four evidence-backed selected-work case studies and says to add another project only when it has real evidence and defensible technical substance.
```

Do not change statuses for existing plans 001-005.

**Verify**: `git diff --check` -> exits 0.

### Step 3: Audit docs for old selected-work vocabulary

Run against living docs and other plans:

```bash
rg -n "all three case studies|three strong case studies|three cards|NoGame|nogame|Gamepad2" docs plans --glob '!plans/011-clean-up-selected-work-docs.md'
```

Expected result: no stale selected-work references. If matches remain, inspect each one and update only if it is a living instruction rather than a historical record.

**Verify**: the command exits 1 for no matches, or any remaining matches are documented as intentional in the final notes.

## Test plan

This is docs-only. No app tests are required. Use `git diff --check` and the stale-text audit as the verification gates.

## Done criteria

- [ ] `docs/IMPLEMENTATION_PLAN.md` no longer says "All three case studies render."
- [ ] `plans/README.md` rejected-finding rationale no longer describes the current PRD as three-project.
- [ ] `git diff --check` exits 0.
- [ ] Stale selected-work text audit has no unintended matches.
- [ ] No source files outside docs/plans are modified.

## STOP conditions

Stop and report back if:

- The current PRD has changed again and no longer clearly defines the selected-work route set.
- The audit finds many stale docs beyond selected-work count/name drift.
- Fixing the docs would require changing source code or project content.

## Maintenance notes

When selected-work projects change, update PRD, design spec, implementation plan, tests, and plan-index rationale together. This repo uses docs as instructions for future agents, so stale counts tend to become repeat regressions.
