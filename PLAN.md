# Implementation Plan

## Source Documents
- Path: `/Users/alexmetelli/source/personal-webpage/docs/hallmark-audit.md`
  - Role: Primary design audit and implementation brief.
  - Summary: Hallmark audit for the personal website Next.js app. It identifies 3 critical issues, 4 major issues, and 2 minor issues across `app/page.tsx`, `app/work/page.tsx`, `app/about/page.tsx`, `app/resume/page.tsx`, `app/work/[slug]/page.tsx`, `app/globals.css`, `src/components/site-shell.tsx`, and `src/components/primitives.tsx`.

## Goals
- Make the site feel less template-like by improving typography, color token discipline, section rhythm, navigation treatment, card composition, and motion consistency.
- Replace pure white and raw local color systems with shared named OKLCH-based tokens where practical inside the audited scope.
- Add a distinct display typography token for hero, section, and card headings while preserving the existing sans stack for body text and UI controls.
- Flatten nested evidence card patterns on the work listing page.
- Reduce repeated uppercase section eyebrows and keep labels only where they carry real context.
- Rework the header into a quieter portfolio masthead rather than a SaaS-style sticky header with a CTA.
- Preserve the audit's verified responsive baseline: no root horizontal overflow at mobile widths and no wrapped clickable labels.

## Non-Goals
- Do not redesign the full information architecture, project content model, resume content, or case-study content.
- Do not add a new design system package, CSS framework, animation library, or runtime dependency.
- Do not replace the existing Next.js App Router structure.
- Do not add new user-facing pages.
- Do not change analytics, metadata, sitemap, robots, security headers, or deployment configuration unless a quality gate requires a minimal fix.
- Do not implement unrelated accessibility, SEO, or performance refactors outside the audited files.

## Definition of Done
- `app/globals.css` defines shared display font, paper/surface/ink, focus, shadow, gradient, duration, and easing tokens, and the audited CSS paths use those tokens instead of ad hoc raw colors and default `ease` transitions wherever practical.
- `html` and `body` both set `overflow-x: clip`.
- Hero, section, and card headings use the display typography token; body copy, navigation, buttons, and tags continue using the sans/UI stack.
- Existing CSS typography tests are updated or expanded to assert the new display token and motion/token invariants.
- Home page section headings no longer emit repeated default eyebrows; remaining eyebrows are contextual and intentionally placed.
- The site header is a quieter portfolio masthead/colophon navigation without a prominent SaaS-style resume CTA button.
- Work listing cards no longer contain nested bordered evidence boxes; proof/evidence is presented as a flattened rule, label row, or inline metadata line.
- Work page SVG colors, page gradients, local shadows, focus values, and motion values are represented through named tokens or CSS custom properties instead of hard-coded values in the render path.
- About page focus content no longer reads as a three-equal-card icon grid; the layout has varied spans or a narrative block, and decorative icon badges are removed or made subordinate.
- Remaining audited resume, case-study, shared primitive, and shell surfaces use the shared token vocabulary enough that raw color usage is limited to documented exceptional cases, if any.
- `PROGRESS.md` and `CHANGELOG.md` exist, are current, and reflect each completed step.
- Quality gates pass, or any pre-existing failure is documented before implementation and not worsened.
- Browser verification covers `/`, `/work`, `/about`, `/resume`, and `/work/agentreceipt` at 320px, 375px, 414px, 768px, and a desktop width such as 1440px.

## Assumptions and Open Questions
- Assumption: A system display stack such as `Georgia, ui-serif, serif` is acceptable for the distinct display face token. This avoids introducing build-time Google font fetching. If a specific brand font is desired, choose it before Step 2.
- Assumption: The header may remain sticky if the visual treatment becomes quiet enough, but removing the prominent CTA button and white SaaS header fingerprint is required.
- Assumption: Some raw colors may remain only where they are semantically exceptional, such as transparent alpha overlays or SVG fallback values, but they must be documented in `PROGRESS.md` and preferably represented by named tokens.
- Assumption: `bun run format` is the repository's formatter gate and mutates files by design. Each step should run it before linting.
- Open question: Whether to preserve the logo image in the masthead or make the masthead text-first. The conservative default is to keep the logo but reduce the brand treatment and CTA prominence.

## Implementation Approach
- Work in small visual-quality slices and keep the repository working after every step.
- Start with tracking files and a baseline quality/visual pass so later regressions can be separated from existing behavior.
- Build a token foundation before page-specific edits. Add shared tokens in `app/globals.css`, then migrate page-local tokens to aliases that reference the shared vocabulary.
- Prefer CSS custom properties and existing component APIs over new abstractions. Add or loosen component props only where repeated markup currently forces the audited pattern.
- Keep changes scoped to audited routes and shared primitives/shell. Do not rename content fields or change project data unless required for markup.
- Pair visual changes with focused regression tests in `src/content/content.test.ts` when the behavior can be asserted from source, especially typography, motion, overflow, and proof-card flattening.
- Use Playwright screenshots/manual viewport checks for final visual acceptance because several Hallmark findings are visual composition issues that unit tests cannot fully verify.

## Quality Gates
- Setup status: Existing gates are configured in `package.json`, `biome.json`, `tsconfig.json`, `playwright.config.ts`, and `.github/workflows/ci.yml`; no separate quality-gate setup step is required.
- Baseline command: `bun run lint && bun run typecheck && bun run test && NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run test:e2e && NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build`
- Format command: `bun run format`
- Lint command: `bun run lint`
- Test command: `bun run test`
- Additional gates: `bun run typecheck`; `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run test:e2e`; `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build`

## Progress Tracking
- File: `PROGRESS.md`
- Requirement: Create `PROGRESS.md` before any quality-gate setup or implementation work begins.
- Update rule: After each step is completed, update `PROGRESS.md` with the completed step, validation results, commit reference if available, current status, and next step.

## Changelog Tracking
- File: `CHANGELOG.md`
- Standard: Keep a Changelog 1.0.0, <https://keepachangelog.com/en/1.0.0/>
- Requirement: Create `CHANGELOG.md` before any quality-gate setup or implementation work begins.
- Initial content: Include `# Changelog`, the standard preamble, and an `## [Unreleased]` section.
- Update rule: After each step is completed and validated, update `CHANGELOG.md` with human-readable notable changes under the appropriate `Unreleased` change-type headings before creating that step's commit.

## Goal Handoff
- Readiness: This plan is ready to be used as a `/goal` payload.
- Scope: The `/goal` should execute only the work described in this plan unless the user explicitly expands it.
- Done: The `/goal` is complete only when every item in `## Definition of Done` is satisfied, all incremental steps are complete, required quality gates pass or documented pre-existing failures are handled, `PROGRESS.md` and `CHANGELOG.md` are current, and the final state is summarized for the user.

## Incremental Steps

### Step 0: Progress and Changelog Tracking Setup
Goal: Create durable progress and changelog files the user can consult while the plan is being executed.

Depends on:
- Nothing.

Changes:
- Create `PROGRESS.md` in the project root.
- Add the plan title, source document path, step checklist, current status, and a short update log.
- Document that `PROGRESS.md` must be updated after every completed step.
- Create `CHANGELOG.md` in the project root before implementation work begins.
- Add Keep a Changelog 1.0.0 structure: `# Changelog`, the standard preamble, and `## [Unreleased]`.
- Document that `CHANGELOG.md` must be updated after each step is completed and validated, before that step is committed.

Acceptance Criteria:
- `PROGRESS.md` exists and includes every incremental step in this plan.
- `CHANGELOG.md` exists and follows the required Keep a Changelog 1.0.0 structure.
- No application behavior changes are introduced in this step.

Validation:
- Confirm `PROGRESS.md` exists and contains the step checklist.
- Confirm `CHANGELOG.md` exists and contains `# Changelog`, the standard preamble, and `## [Unreleased]`.
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build`.

Progress:
- Mark Step 0 complete in `PROGRESS.md`, record validation results, set the current status, and identify Step 1 as next.

Changelog:
- Add an `Added` entry under `## [Unreleased]` for establishing progress and changelog tracking.

Commit:
- `chore: add hallmark remediation tracking`

Completion Checklist:
1. Run all quality gates listed for this step.
2. Fix any failures before proceeding.
3. Update `PROGRESS.md` with the completed step, validation results, commit reference if available, current status, and next step.
4. Update `CHANGELOG.md` with notable completed work under `## [Unreleased]`, using the appropriate Keep a Changelog change-type heading.
5. Create a commit for this completed step.

### Step 1: Baseline Gates and Visual Reference
Goal: Establish a pre-implementation quality and viewport baseline for the audited pages.

Depends on:
- Step 0.

Changes:
- Do not change app source unless required to document pre-existing failures.
- Run the baseline command from `## Quality Gates`.
- Run or manually perform viewport checks for `/`, `/work`, `/about`, `/resume`, and `/work/agentreceipt` at 320px, 375px, 414px, 768px, and 1440px.
- Record baseline results, screenshots or screenshot paths if captured, and any pre-existing failures in `PROGRESS.md`.

Acceptance Criteria:
- Baseline quality gate results are recorded before visual remediation begins.
- Baseline viewport status is recorded for all audited routes and widths.
- Any failure is clearly identified as pre-existing or fixed before proceeding.

Advances Definition of Done:
- Creates the comparison point needed to prove later changes preserve responsive behavior and do not worsen existing quality gates.

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build`.

Progress:
- Update `PROGRESS.md` with baseline gate results, viewport results, commit reference if available, current status, and Step 2 as next.

Changelog:
- Update `CHANGELOG.md` under `## [Unreleased]` with a notable `Added` or `Changed` entry for the baseline verification record.

Commit:
- `test: record hallmark baseline verification`

Completion Checklist:
1. Run all quality gates listed for this step.
2. Fix any failures before proceeding.
3. Update `PROGRESS.md` with the completed step, validation results, commit reference if available, current status, and next step.
4. Update `CHANGELOG.md` with notable completed work under `## [Unreleased]`, using the appropriate Keep a Changelog change-type heading.
5. Create a commit for this completed step.

### Step 2: Global Token, Typography, Motion, and Overflow Foundation
Goal: Fix the site-wide design-token foundation that causes the Inter-everywhere, pure white, motion drift, and mobile overflow findings.

Depends on:
- Step 0.
- Step 1.

Changes:
- Update `app/globals.css`.
- Add a distinct `--font-display` token and apply it to `.hero-title`, `.section-title`, `.card-title`, and page-specific heading selectors that currently define heading styles separately.
- Keep `--font-sans` for `body`, navigation, buttons, tags, metadata, and form-like UI.
- Replace root pure `#ffffff`/near-pure surface values with slightly tinted OKLCH paper and surface tokens, such as `--color-paper`, `--color-surface`, `--color-surface-raised`, and `--color-surface-muted`.
- Replace root text tokens with named OKLCH ink tokens where practical.
- Add named tokens for focus rings, shadows, gradient stops, durations, and easing, such as `--focus-ring`, `--duration-fast`, `--duration-base`, and `--ease-standard`.
- Replace default `ease` in shared transitions with the named easing token.
- Add `overflow-x: clip` to both `html` and `body`.
- Update `src/content/content.test.ts` to assert that hero/section/card headings use `--font-display`, that `html` and `body` set `overflow-x: clip`, and that shared transitions reference named motion tokens.

Acceptance Criteria:
- The global CSS no longer presents the root palette as pure black/pure white.
- Heading typography is clearly separated from body/UI typography.
- Mobile root overflow clipping is explicit on both `html` and `body`.
- Motion tokens exist and shared transitions use them.
- Tests cover the new token invariants.

Advances Definition of Done:
- Establishes the shared vocabulary every later page-level cleanup can use.

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build`.

Progress:
- Update `PROGRESS.md` with completion notes, validation results, commit reference if available, current status, and Step 3 as next.

Changelog:
- Update `CHANGELOG.md` under `## [Unreleased]` with notable `Changed` and `Fixed` entries for global typography, color, motion, and overflow cleanup.

Commit:
- `style: establish hallmark design tokens`

Completion Checklist:
1. Run all quality gates listed for this step.
2. Fix any failures before proceeding.
3. Update `PROGRESS.md` with the completed step, validation results, commit reference if available, current status, and next step.
4. Update `CHANGELOG.md` with notable completed work under `## [Unreleased]`, using the appropriate Keep a Changelog change-type heading.
5. Create a commit for this completed step.

### Step 3: Home Page Section Rhythm and Eyebrow Reduction
Goal: Remove the repeated generated-editorial eyebrow rhythm from the home page while preserving useful context.

Depends on:
- Step 0.
- Step 1.
- Step 2.

Changes:
- Update `app/page.tsx`.
- Change the local `SectionHeading` helper so `label` is optional, or replace it with markup that only renders an eyebrow when explicitly needed.
- Remove nonessential section eyebrow labels from Technical Focus, Experience Snapshot, and Contact.
- Keep contextual labels only where they meaningfully orient the page, such as the hero role or the selected-work band if it remains useful as a compact section label.
- Update `app/globals.css` spacing rules so headings without eyebrows still have balanced rhythm.
- Add or update tests in `src/content/content.test.ts` if practical to prevent `SectionHeading` from requiring/defaulting labels.

Acceptance Criteria:
- The home page no longer has an uppercase eyebrow before nearly every section.
- Section spacing remains visually coherent when labels are absent.
- Links, buttons, and headings remain accessible and semantically correct.

Advances Definition of Done:
- Addresses the audit's "Eyebrow on every section" major finding.

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build`.

Progress:
- Update `PROGRESS.md` with completion notes, validation results, commit reference if available, current status, and Step 4 as next.

Changelog:
- Update `CHANGELOG.md` under `## [Unreleased]` with a notable `Changed` entry for the home page section rhythm.

Commit:
- `style: reduce home section eyebrow repetition`

Completion Checklist:
1. Run all quality gates listed for this step.
2. Fix any failures before proceeding.
3. Update `PROGRESS.md` with the completed step, validation results, commit reference if available, current status, and next step.
4. Update `CHANGELOG.md` with notable completed work under `## [Unreleased]`, using the appropriate Keep a Changelog change-type heading.
5. Create a commit for this completed step.

### Step 4: Quiet Portfolio Masthead
Goal: Replace the SaaS-like sticky white header and CTA treatment with a quieter portfolio masthead.

Depends on:
- Step 0.
- Step 1.
- Step 2.

Changes:
- Update `src/components/site-shell.tsx`.
- Replace the prominent header resume CTA button with a quieter text nav item or secondary inline link.
- Keep primary navigation accessible with `aria-current` and the existing `primaryNavItems`.
- Keep the logo only if it supports a compact masthead; otherwise use a text-first brand/role treatment based on existing `site` data.
- Update `app/globals.css` header styles:
  - Use tokenized tinted paper/background instead of sticky pure white.
  - Reduce border and CTA prominence.
  - Avoid uppercase wordmark styling unless it is intentionally subtle.
  - Use named motion tokens for hover/current states.
- Ensure mobile widths do not introduce horizontal overflow or wrapped clickable labels.

Acceptance Criteria:
- The header reads as a restrained portfolio masthead, not a SaaS marketing header.
- Resume remains reachable without a prominent button-shaped CTA in the main nav.
- Active navigation and keyboard focus still work.
- Header styling uses shared tokens and named motion values.

Advances Definition of Done:
- Addresses the audit's "AI nav" major finding and contributes to the color/token cleanup.

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build`.

Progress:
- Update `PROGRESS.md` with completion notes, validation results, commit reference if available, current status, and Step 5 as next.

Changelog:
- Update `CHANGELOG.md` under `## [Unreleased]` with a notable `Changed` entry for the masthead/navigation treatment.

Commit:
- `style: quiet the portfolio masthead`

Completion Checklist:
1. Run all quality gates listed for this step.
2. Fix any failures before proceeding.
3. Update `PROGRESS.md` with the completed step, validation results, commit reference if available, current status, and next step.
4. Update `CHANGELOG.md` with notable completed work under `## [Unreleased]`, using the appropriate Keep a Changelog change-type heading.
5. Create a commit for this completed step.

### Step 5: Work Page Tokenization and Evidence Flattening
Goal: Fix the work page's nested card evidence pattern and page-local token improvisation.

Depends on:
- Step 0.
- Step 1.
- Step 2.

Changes:
- Update `app/work/page.tsx`.
- Replace `.work-evidence-box` markup in `SupportingProjectCard` with a flattened evidence row, inline proof line, or top/bottom rule treatment.
- Keep proof text visible and scannable.
- Update `app/globals.css`.
- Remove `.work-evidence-box` bordered-card styling and replace it with flattened `.work-evidence-line` or equivalent styles.
- Convert work page local colors, shadows, gradients, SVG `stopColor` values, SVG fills/strokes, and animation easings into named CSS variables that alias the shared token vocabulary.
- Ensure inline SVG values reference CSS variables or classes rather than hard-coded blues and whites where browser support allows.
- Update `src/content/content.test.ts` to assert that `app/work/page.tsx` no longer renders `work-evidence-box` and that the work page CSS uses named motion tokens.

Acceptance Criteria:
- Supporting work cards do not contain nested bordered evidence boxes.
- Work page proof/evidence remains readable and semantically associated with each project.
- Work page color, shadow, gradient, and motion values are tokenized enough that the render path no longer improvises its own mini color system.
- Desktop and mobile work page layouts remain stable.

Advances Definition of Done:
- Addresses the audit's "Card-in-card" critical finding and work page portion of "Mid-render token improvisation."

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build`.

Progress:
- Update `PROGRESS.md` with completion notes, validation results, commit reference if available, current status, and Step 6 as next.

Changelog:
- Update `CHANGELOG.md` under `## [Unreleased]` with notable `Changed` and `Fixed` entries for work page evidence and token cleanup.

Commit:
- `style: flatten work evidence cards`

Completion Checklist:
1. Run all quality gates listed for this step.
2. Fix any failures before proceeding.
3. Update `PROGRESS.md` with the completed step, validation results, commit reference if available, current status, and next step.
4. Update `CHANGELOG.md` with notable completed work under `## [Unreleased]`, using the appropriate Keep a Changelog change-type heading.
5. Create a commit for this completed step.

### Step 6: About Page Focus Layout and Token Cleanup
Goal: Break the three-equal-icon-card pattern on the about page and align its visual system with shared tokens.

Depends on:
- Step 0.
- Step 1.
- Step 2.

Changes:
- Update `app/about/page.tsx`.
- Adjust `AboutCard` markup so decorative icon badges are removed, made inline/subordinate, or replaced with a quieter text/rule treatment.
- Keep the focus card content accessible and preserve existing text from `profile.about.focusCards`.
- Update `app/globals.css`.
- Change `.about-focus-grid` from three equal cards into a varied composition, such as one wider narrative block plus two supporting rows/cards, with responsive behavior at tablet and mobile widths.
- Migrate `--about-*` colors, borders, shadows, gradients, and surface values to shared token aliases.
- Use the display heading token for about card headings and named motion/focus tokens where applicable.
- Add source tests if practical to assert the absence of `.about-icon-badge` or the presence of varied about card classes.

Acceptance Criteria:
- The about focus area no longer reads as a generic three-column icon-card grid.
- About page cards and profile summary use shared surface, border, shadow, typography, and color tokens.
- The profile image/sidebar and CTA row remain responsive and accessible.

Advances Definition of Done:
- Addresses the audit's "3-column feature grid / icon-tile feature card" major finding and about page portion of "Mid-render token improvisation."

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build`.

Progress:
- Update `PROGRESS.md` with completion notes, validation results, commit reference if available, current status, and Step 7 as next.

Changelog:
- Update `CHANGELOG.md` under `## [Unreleased]` with notable `Changed` entries for about page layout and token cleanup.

Commit:
- `style: reshape about focus layout`

Completion Checklist:
1. Run all quality gates listed for this step.
2. Fix any failures before proceeding.
3. Update `PROGRESS.md` with the completed step, validation results, commit reference if available, current status, and next step.
4. Update `CHANGELOG.md` with notable completed work under `## [Unreleased]`, using the appropriate Keep a Changelog change-type heading.
5. Create a commit for this completed step.

### Step 7: Audited Scope Token Pass and Final Verification
Goal: Finish the remaining scoped cleanup and verify the Hallmark audit findings are resolved without regressions.

Depends on:
- Step 0.
- Step 1.
- Step 2.
- Step 3.
- Step 4.
- Step 5.
- Step 6.

Changes:
- Review `app/globals.css`, `app/resume/page.tsx`, `app/work/[slug]/page.tsx`, `src/components/primitives.tsx`, and any audited selectors not already touched.
- Replace remaining raw pure whites, raw dark values, raw focus values, raw shadows, raw gradient stops, and default `ease` transitions inside the audited scope with shared tokens or page-local aliases that point to shared tokens.
- Keep intentionally exceptional values only if they are documented in `PROGRESS.md` with a reason.
- Update `src/content/content.test.ts` with final source-level invariants where useful:
  - `html` and `body` include `overflow-x: clip`.
  - shared transitions use motion tokens.
  - heading selectors use the display font token.
  - nested work evidence boxes do not exist.
- Run final browser checks for `/`, `/work`, `/about`, `/resume`, and `/work/agentreceipt` at 320px, 375px, 414px, 768px, and 1440px.
- Specifically check for root horizontal overflow, wrapped clickable labels, incoherent text overlap, broken SVG rendering, and visually nested cards.

Acceptance Criteria:
- All critical, major, and minor findings from `docs/hallmark-audit.md` are either fixed or explicitly documented as intentionally deferred with user-visible rationale.
- Audited routes pass the same responsive discipline the audit originally verified.
- The final CSS token usage is coherent enough that future page work has an obvious token vocabulary.
- Final quality gates pass.

Advances Definition of Done:
- Completes the audit remediation and validates the whole audited surface.

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=https://personal-webpage-three-woad.vercel.app bun run build`.

Progress:
- Update `PROGRESS.md` with final validation results, browser verification notes, commit reference if available, current status, and final completion state.

Changelog:
- Update `CHANGELOG.md` under `## [Unreleased]` with final notable `Changed` and `Fixed` entries for the audit remediation before committing.

Commit:
- `style: complete hallmark audit cleanup`

Completion Checklist:
1. Run all quality gates listed for this step.
2. Fix any failures before proceeding.
3. Update `PROGRESS.md` with the completed step, validation results, commit reference if available, current status, and next step.
4. Update `CHANGELOG.md` with notable completed work under `## [Unreleased]`, using the appropriate Keep a Changelog change-type heading.
5. Create a commit for this completed step.
