# Plan 006: Show proof signals on homepage project cards

> **Executor instructions**: Follow this plan step by step. Run every verification command and confirm the expected result before moving to the next step. If anything in the "STOP conditions" section occurs, stop and report; do not improvise. When done, update the status row for this plan in `plans/README.md` unless a reviewer told you they maintain the index.
>
> **Drift check (run first)**: `git diff --stat f992468..HEAD -- app/page.tsx src/content/projects.ts src/content/content.test.ts docs/PRD.md`
> If any in-scope file changed since this plan was written, compare the "Current state" excerpts against the live code before proceeding. If they no longer match, treat it as a STOP condition.

## Status

- **Priority**: P1
- **Effort**: S
- **Risk**: LOW
- **Depends on**: none
- **Category**: bug
- **Planned at**: commit `f992468`, 2026-06-14

## Why this matters

The PRD says each homepage selected-work card must include a one-line proof signal. The current homepage card renders the project title, value statement, tags, and link, but omits `project.proof`. That weakens the site's evidence-first positioning and creates a contract drift that the current tests do not catch.

## Current state

Relevant files:

- `app/page.tsx` - homepage and `ProjectCard` implementation.
- `src/content/projects.ts` - project data source, including `proof`.
- `src/content/content.test.ts` - content and route invariant tests.
- `docs/PRD.md` - product contract for homepage project cards.

Current PRD excerpt:

```text
docs/PRD.md:206 Each homepage project card must include:
docs/PRD.md:208 - Project name
docs/PRD.md:209 - One-sentence value statement
docs/PRD.md:210 - One-line proof signal
docs/PRD.md:211 - Tech tags
```

Current homepage card excerpt:

```tsx
app/page.tsx:294 function ProjectCard({ project }: { project: Project }) {
app/page.tsx:298   <article className="avoid-break flex min-h-[190px] flex-col ...">
app/page.tsx:302     <h3 ...>{project.title}</h3>
app/page.tsx:305     <p className="mt-1.5 line-clamp-2 ...">
app/page.tsx:306       {project.valueStatement}
app/page.tsx:307     </p>
app/page.tsx:308     <div className="mt-2.5">
app/page.tsx:309       <TagList items={project.tags.slice(0, 4)} ... />
app/page.tsx:311     <Link ... href={`/work/${project.slug}`}>
```

Current content invariant excerpt:

```tsx
src/content/content.test.ts:92 test("projects have required case study fields and real evidence links", () => {
src/content/content.test.ts:98   assert.ok(project.proof.length > 0);
```

Repo conventions:

- Data-driven project rendering uses `Project` from `src/content/projects.ts`; do not duplicate copy inline in the component.
- Homepage cards use compact Tailwind utility classes, 6px radius, restrained borders, and no nested cards.
- Tests use `node:test` plus `node:assert/strict`; follow the existing helper style in `src/content/content.test.ts`.

## Commands you will need

| Purpose | Command | Expected on success |
|---|---|---|
| Lint | `bun run lint` | exit 0, "No fixes applied" |
| Typecheck | `bun run typecheck` | exit 0, no TypeScript errors |
| Tests | `bun run test` | exit 0, all content tests pass |

## Scope

**In scope**:

- `app/page.tsx`
- `src/content/content.test.ts`

**Out of scope**:

- `src/content/projects.ts` copy changes.
- Redesigning cards, changing project order, changing `/work` cards, or adding new projects.
- Creating browser/e2e tests; that is covered by `plans/008-add-browser-smoke-tests.md`.

## Git workflow

- Suggested branch: `advisor/006-homepage-project-proof`
- Commit message style: imperative sentence matching recent history, e.g. `Show homepage project proof signals`
- Do not push or open a PR unless instructed.

## Steps

### Step 1: Render the proof line on homepage project cards

In `app/page.tsx`, update `ProjectCard` so each card displays `project.proof` after the value statement and before tags or the link. Keep it compact and evidence-first. A suitable shape is a small left-border paragraph:

```tsx
<p className="mt-2 border-l border-[var(--color-border)] pl-3 text-[length:var(--text-xs)] font-semibold leading-5 text-[var(--color-text)]">
  Proof: {project.proof}
</p>
```

Adjust only the card's minimum height/spacing if needed to avoid cramped content with four cards. Preserve semantic `article`, the icon, title, value statement, tags, and `View Project` link.

**Verify**: `bun run typecheck` -> exits 0.

### Step 2: Add a regression test for homepage proof copy

In `src/content/content.test.ts`, extend the existing "static page routes render route-critical content" test or add a nearby test that renders `HomePage()` and asserts every `project.proof` appears in the collected homepage text.

Use the existing `collectText` helper. Example pattern:

```tsx
const homeText = collectText(HomePage());
for (const project of projects) {
  assert.match(homeText, new RegExp(project.proof.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
}
```

If you add escaping, prefer a tiny local helper in the test file rather than adding a dependency.

**Verify**: `bun run test` -> exits 0 and includes the new assertion.

### Step 3: Run final gates

Run the standard focused gates.

**Verify**:

- `bun run lint` -> exits 0.
- `bun run typecheck` -> exits 0.
- `bun run test` -> exits 0.

## Test plan

- Existing project data tests already assert `project.proof` is non-empty.
- Add or update a render-level test so the homepage output includes every project proof string.
- Do not rely only on visual inspection; the done criteria require an automated assertion.

## Done criteria

- [ ] `ProjectCard` renders `Proof: {project.proof}` for every homepage project.
- [ ] `src/content/content.test.ts` fails if homepage project proof text is removed.
- [ ] `bun run lint` exits 0.
- [ ] `bun run typecheck` exits 0.
- [ ] `bun run test` exits 0.
- [ ] No files outside the in-scope list are modified except `plans/README.md` status if the executor updates it.

## STOP conditions

Stop and report back if:

- `ProjectCard` no longer exists in `app/page.tsx` or no longer receives a `Project`.
- The PRD no longer requires a proof signal on homepage cards.
- Adding proof text requires changing project copy in `src/content/projects.ts`.
- The homepage card cannot fit the proof line without broader layout redesign.

## Maintenance notes

Future project-card changes should preserve the project-name, value-statement, proof, tags, and case-study link contract from `docs/PRD.md`. Reviewers should check that proof text stays concise and does not duplicate the value statement.
