# Plan 014: Decide and harden the AgentReceipt Vercel redirect

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat 7610aeb..HEAD -- vercel.json README.md src/content/content.test.ts`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding. If they no longer match, treat it as a STOP condition.
>
> **Workspace safety check**: also run `git status --short -- vercel.json README.md src/content/content.test.ts`. At plan time `vercel.json` was untracked. Do not assume it is safe to delete without following the decision step below.

## Status

- **Priority**: P1
- **Effort**: S/M
- **Risk**: MED
- **Depends on**: none
- **Category**: security
- **Planned at**: commit `7610aeb`, 2026-06-21

## Why this matters

The workspace contains an untracked `vercel.json` that would make the personal website serve `/agentreceipt/install.sh` by redirecting to a raw GitHub file on the `main` branch. That creates a deployment and supply-chain surface unrelated to the documented personal website unless it is intentional. The redirect should either be removed or made explicit, pinned, documented, and covered by a regression test.

## Current state

Relevant files:

- `vercel.json` - untracked deployment config at plan time.
- `README.md` - deployment notes and the right place to document intentional production redirects.
- `src/content/content.test.ts` - existing config/content regression tests.

Current redirect excerpt:

```json
vercel.json:3 "redirects": [
vercel.json:5   "source": "/agentreceipt/install.sh",
vercel.json:6   "destination": "https://raw.githubusercontent.com/ametel01/agentreceipt/main/scripts/install.sh",
vercel.json:7   "permanent": false
```

Current docs signal:

```text
README.md:33 ## Vercel Deployment
README.md:35 Production URL: https://personal-webpage-three-woad.vercel.app
README.md:37 Use Bun for install and build:
```

There is currently no README mention of AgentReceipt or an install-script redirect.

Repo conventions:

- Keep deployment behavior reproducible in committed files.
- Avoid hidden production surfaces that are not documented.
- Existing tests already import config-like files where practical, for example `next.config.ts`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Inspect redirect config | `git status --short -- vercel.json README.md src/content/content.test.ts` | shows only expected in-scope changes |
| Optional upstream pin lookup | `git ls-remote https://github.com/ametel01/agentreceipt refs/heads/main` | prints a commit SHA and ref |
| Unit tests | `bun run test` | exit 0 |
| Lint | `bun run lint` | exit 0 |
| Typecheck | `bun run typecheck` | exit 0 |
| Production build | `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build` | exit 0 |

## Scope

**In scope**:

- `vercel.json`
- `README.md`
- `src/content/content.test.ts`

**Out of scope**:

- Changing Vercel project settings outside the repo.
- Editing the AgentReceipt repository.
- Adding shell install instructions to this personal website beyond documenting the redirect if it remains.
- Testing external network availability in Playwright.

## Git workflow

- Suggested branch: `advisor/014-agentreceipt-redirect`
- Commit message: `Harden AgentReceipt Vercel redirect`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Choose one redirect policy

Choose exactly one of these policies before editing:

1. **Remove the redirect** if AgentReceipt distribution is not an intentional part of this website deployment.
2. **Keep and harden the redirect** if the operator confirms this site should expose `/agentreceipt/install.sh`.

If there is no explicit operator instruction and no product/deployment doc explaining why the redirect belongs on this website, use policy 1 and remove `vercel.json`.

**Verify**: `git status --short -- vercel.json` -> reflects the chosen policy: either `D/M vercel.json` if it was tracked, no `vercel.json` if removed while untracked, or `A/M vercel.json` if kept and hardened.

### Step 2A: If removing, delete only the redirect config

If using policy 1, remove `vercel.json`. Do not touch `README.md` or tests unless they already mention the redirect by the time you execute this plan.

**Verify**: `test ! -f vercel.json` -> exits 0.

### Step 2B: If keeping, pin and document the redirect

If using policy 2, replace the mutable `main` destination with an immutable commit or release tag URL.

Use this command to get the current `main` commit if a commit pin is acceptable:

```bash
git ls-remote https://github.com/ametel01/agentreceipt refs/heads/main
```

Then change the destination shape from:

```text
https://raw.githubusercontent.com/ametel01/agentreceipt/main/scripts/install.sh
```

to:

```text
https://raw.githubusercontent.com/ametel01/agentreceipt/<commit-sha-or-release-tag>/scripts/install.sh
```

Do not paste or mirror the install script contents into this repo.

Add a short README note under Vercel Deployment:

- The public source path: `/agentreceipt/install.sh`
- The upstream repo: `ametel01/agentreceipt`
- The pin type: commit SHA or release tag
- The update rule: update the pin intentionally when a new installer version is approved

**Verify**: `rg -n "raw.githubusercontent.com/ametel01/agentreceipt/main|agentreceipt/install.sh" vercel.json README.md` -> no `main` match; documented source path is visible.

### Step 3: Add a regression test if the redirect remains

If `vercel.json` remains, add a unit test in `src/content/content.test.ts` that reads and parses `vercel.json` with `readFileSync` and `JSON.parse`.

Assert:

- A redirect with `source === "/agentreceipt/install.sh"` exists.
- Its `destination` starts with `https://raw.githubusercontent.com/ametel01/agentreceipt/`.
- Its `destination` does not contain `/main/`.
- Its `permanent` value is `false`.

If `vercel.json` is removed, do not add this test.

**Verify**: `bun run test` -> exits 0.

### Step 4: Run final gates

Run:

```bash
bun run lint
bun run typecheck
bun run test
NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build
```

Expected result: every command exits 0.

## Test plan

- Removal path: no new test is needed; absence of `vercel.json` removes the deployment surface.
- Keep path: unit test parses `vercel.json` and rejects mutable `main` redirects.
- Production build confirms the Vercel config shape does not break Next's build.

## Done criteria

- [ ] The repo no longer contains a mutable raw GitHub redirect to `agentreceipt/main`.
- [ ] If `vercel.json` remains, the AgentReceipt redirect destination is pinned to an immutable commit SHA or release tag.
- [ ] If `vercel.json` remains, README documents why the redirect exists and how to update it.
- [ ] If `vercel.json` remains, a unit test rejects `/main/` in the destination.
- [ ] `bun run lint` exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run test` exits 0.
- [ ] Env-backed `bun run build` exits 0.
- [ ] No files outside the in-scope list are modified except `plans/README.md` status.

## STOP conditions

Stop and report back if:

- The operator cannot confirm whether the redirect belongs on the personal website and removing it would be risky.
- The upstream AgentReceipt repo does not have a stable commit or release to pin.
- Vercel's redirect schema rejects the pinned destination shape.
- The fix appears to require editing the AgentReceipt repo or Vercel dashboard settings.

## Maintenance notes

Install-script redirects are production distribution surfaces. Treat updates to the destination as security-sensitive: reviewers should check the upstream pin, the target path, and whether the website should continue hosting the redirect at all.
