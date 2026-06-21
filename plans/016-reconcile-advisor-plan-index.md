# Plan 016: Reconcile the advisor plan index with existing plan files

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 7610aeb..HEAD -- plans/README.md plans`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding. If they no longer match, treat it as a STOP condition.
>
> **Workspace safety check**: also run `git status --short -- plans`. Preserve any in-progress plan edits.

## Status

- **Priority**: P2
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: docs
- **Planned at**: commit `7610aeb`, 2026-06-21

## Why this matters

`plans/README.md` is the dispatch index for future executors. It currently lists plans `001` through `005` as active rows even though their plan files are not present in `plans/`. That makes handoff state unreliable: an executor can be told to read a plan that no longer exists. The index should clearly separate existing executable plan files from historical completed plans whose files were removed.

## Current state

Relevant files:

- `plans/README.md` - plan index and dependency notes.
- `plans/006-show-homepage-project-proof.md` through `plans/016-reconcile-advisor-plan-index.md` - executable plan files that exist locally after the 2026-06-21 advisor pass.

Current index excerpt:

```text
plans/README.md:9  | 001 | Require a production site URL for public metadata | P1 | S | - | DONE |
plans/README.md:10 | 002 | Align the site header with the v1 navigation contract | P1 | S | - | DONE |
plans/README.md:11 | 003 | Add a GitHub Actions quality gate for the Bun site | P1 | S | - | DONE |
plans/README.md:12 | 004 | Add route-level regression tests for rendered pages and metadata routes | P2 | M | 002 | DONE |
plans/README.md:13 | 005 | Resolve the PostCSS audit advisory without broad dependency churn | P2 | S/M | - | DONE |
```

Current file listing at plan time:

```text
plans/006-show-homepage-project-proof.md
plans/007-align-design-system-css.md
plans/008-add-browser-smoke-tests.md
plans/009-pin-bun-version-in-ci.md
plans/010-add-production-security-headers.md
plans/011-clean-up-selected-work-docs.md
plans/012-make-local-build-gate-env-explicit.md
plans/013-use-project-role-for-featured-work.md
plans/014-decide-agentreceipt-vercel-redirect.md
plans/015-expand-browser-smoke-tests-for-deploy-routes.md
plans/016-reconcile-advisor-plan-index.md
```

Repo conventions:

- Plan files are named `NNN-short-slug.md`.
- `plans/README.md` is the execution-order index and status table.
- Existing completed plans should not be renumbered.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| List plan files | `find plans -maxdepth 1 -type f -name '[0-9][0-9][0-9]-*.md' | sort` | shows existing executable plan files |
| Check stale references | `for n in 001 002 003 004 005; do test -e plans/${n}-*.md; done` | expected to fail before reconciliation; do not use as final gate |
| Markdown diff check | `git diff --check plans/README.md` | exit 0 |

## Scope

**In scope**:

- `plans/README.md`

**Out of scope**:

- Recreating deleted plan files `001` through `005`.
- Renumbering existing plans.
- Editing source code.
- Changing the content of other plan files.

## Git workflow

- Suggested branch: `advisor/016-plan-index-reconcile`
- Commit message: `Reconcile advisor plan index`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Inventory existing plan files

Run:

```bash
find plans -maxdepth 1 -type f -name '[0-9][0-9][0-9]-*.md' | sort
```

Confirm which numbered plan files exist. Do not use BSD-incompatible `find -printf`.

**Verify**: output includes `006` through `016` and does not include `001` through `005`.

### Step 2: Split executable and historical plan sections

Edit `plans/README.md` so the main "Execution order & status" table contains only plan files that exist locally.

Move the `001` through `005` rows into a separate section named `Historical completed plans without local files`. Preserve their titles and DONE status, and add a one-line note that their plan files were removed after completion.

Do not change the status of executable plans `006` through `016`.

**Verify**: `rg -n "001|002|003|004|005" plans/README.md` -> matches only the historical section, not the main execution table.

### Step 3: Update dependency notes

Review dependency notes that mention `001` through `005`.

For notes that are purely historical, move them under the historical section or delete them if they no longer help a future executor. Keep dependency notes for active TODO plans:

- `015` depends on `014` because browser smoke coverage should follow the redirect decision.
- `012`, `013`, `014`, and `016` have no active dependencies.

**Verify**: `rg -n "depends on 00[1-5]|001|002|003|004|005" plans/README.md` -> any remaining matches are clearly historical.

### Step 4: Run final checks

Run:

```bash
git diff --check plans/README.md
```

Expected result: exits 0.

## Test plan

This is a docs-only plan. Verification is:

- File inventory confirms which plan files exist.
- `plans/README.md` no longer sends executors to missing files in the active execution table.
- `git diff --check plans/README.md` catches whitespace issues.

## Done criteria

- [ ] Main execution table in `plans/README.md` lists only existing local plan files.
- [ ] Plans `001` through `005` are preserved only in a historical section.
- [ ] Dependencies for active TODO plans are accurate.
- [ ] `git diff --check plans/README.md` exits 0.
- [ ] No files outside `plans/README.md` are modified except this plan's status row.

## STOP conditions

Stop and report back if:

- A missing plan file `001` through `005` reappears while executing this plan.
- Another executor is concurrently editing `plans/README.md`.
- The operator wants deleted historical plan files recreated rather than indexed as historical.

## Maintenance notes

Future advisor runs should keep numbering monotonic and should not delete plan files without also updating the index. If a plan is obsolete, mark it `REJECTED` or `DONE` with rationale rather than leaving a dangling row.
