# Implementation Plan

## Source Document
- Path: `/Users/alexmetelli/source/personal-webpage/current.png`, `/Users/alexmetelli/source/personal-webpage/improved.png`, and the prior design-review findings in this conversation.
- Summary: Redesign the About page to match the proposed visual direction: wider editorial layout, active About navigation, profile/sidebar card, capability chips, card-based About sections, a "What matters to me" section, centered contact CTAs, and typography that remains consistent across the site's other pages.

## Goals
- Rebuild `/about` so it visually matches the proposed design while preserving the existing content strategy and professional tone.
- Make the About page feel like the same system as `/`, `/work`, `/resume`, and project detail pages by using shared typography tokens and reusable page-level styles.
- Add the new visual sections shown in the proposed design: chip row, three main About cards, right-side profile summary card, and "What matters to me" cards.
- Preserve accessibility basics: semantic landmarks, one visible `h1`, descriptive image alt text, keyboard-visible focus states, no empty links, no horizontal overflow.
- Keep the page responsive across desktop, tablet, and mobile without text overlap or layout shifts.

## Non-Goals
- Do not change the site's core copy beyond the small labels and short value-card copy required by the proposed design.
- Do not replace the existing portrait image or resume asset.
- Do not introduce a new design system dependency, CSS framework, icon library, or animation library.
- Do not redesign `/work`, `/resume`, homepage content, or project detail layouts beyond shared typography/navigation adjustments required for consistency.
- Do not add a full visual-regression screenshot framework unless the current Playwright e2e coverage proves insufficient during implementation.

## Assumptions and Open Questions
- Assumption: The source of truth for the target visual state is `improved.png`; exact pixel parity is not required, but spacing, hierarchy, composition, and section inventory should be close.
- Assumption: The duplicated About content in the proposed right sidebar should be shortened in implementation to avoid feeling repetitive while preserving the visual structure.
- Assumption: The desired aesthetic is refined, minimal, engineering-focused, and editorial, not a marketing landing page. Use restrained blue accents, crisp borders, generous spacing, and precise typography.
- Assumption: Existing font loading should not be changed unless typography consistency requires it. The current `--font-sans` stack includes Inter/Geist/system; typography work should first normalize scale, weight, line-height, and letter-spacing across pages.
- Open question: Should the About page use GitHub's brand icon instead of the current arrow/external-link icon in the CTA row? The proposed design shows brand-style icons, but the repo already uses `lucide-react` for consistency.
- Open question: Should the "5+ years" chip be derived from content data or hardcoded in the About page? Prefer content data if this is likely to be reused.

## Quality Gates
- Setup status: Existing Bun, Biome, TypeScript, Playwright, and Next build gates are configured in `package.json` and `.github/workflows/ci.yml`.
- Baseline command: `bun install --frozen-lockfile && bun run lint && bun run typecheck && bun run test && bun run test:e2e && NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run build`
- Format command: `bun run format`
- Lint command: `bun run lint`
- Test command: `bun run test && bun run test:e2e`
- Additional gates: `bun run typecheck` and `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run build`
- Visual verification: run `bun run dev`, inspect `/about` at desktop and mobile widths, and compare against `improved.png` for layout, spacing, typography hierarchy, and non-overlap.

## Incremental Steps

### Step 1: Normalize Shared Typography and Navigation State
Goal: Establish a consistent page typography hierarchy and active navigation behavior before the About layout changes.

Changes:
- Inspect and update `app/globals.css` typography tokens and shared page classes so hero/page titles, eyebrows, descriptions, section headings, card titles, and body copy have consistent scale, weight, line-height, and letter-spacing across pages.
- Update `src/components/primitives.tsx` so `PageHeader` uses the shared page typography treatment needed by the About page: blue eyebrow option, balanced title, consistent title weight, and body copy sizing.
- Update `src/components/site-shell.tsx` to support active navigation styling for the current route, including the About underline shown in `improved.png`.
- Add a small client-safe helper if needed, or split the header into a client component only if route detection cannot be handled cleanly in the existing structure.
- Preserve existing header/footer layout and focus states.

Dependencies:
- None.

Acceptance Criteria:
- `/about` can show an active underline under `About`.
- Existing `/work` navigation can also show active state when appropriate.
- Page-level typography uses shared classes/tokens instead of one-off values where practical.
- The About H1, Work H1, Resume H1, and project detail H1 still feel like one typographic system even if their layouts differ.
- No horizontal overflow is introduced.

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run build`.
- Fix any failures before proceeding.

Commit:
- `Normalize page typography and active navigation`

### Step 2: Add Structured About Content Data
Goal: Move the proposed About-page chips, cards, sidebar summaries, and value statements into maintainable content structures.

Changes:
- Update `src/content/profile.ts` to add About-specific arrays for:
  - capability chips: `5+ years`, `Backend systems`, `Developer tooling`, `Blockchain infra`, `Remote-friendly`
  - main cards: `What I work on`, `How I work`, `What I am looking for`
  - right-sidebar compact summaries, derived from or shortened versions of the main card copy
  - values: `Correctness`, `Clarity`, `Delivery`
- Keep existing `profile.about.narrative`, `work`, `style`, and `lookingFor` available until the page has been migrated.
- Add or update `src/content/content.test.ts` to assert the new About content arrays are non-empty and contain usable labels/body text.

Dependencies:
- Step 1 preferred, but this can be developed independently if needed.

Acceptance Criteria:
- About page content required by `improved.png` lives in `src/content/profile.ts`, not scattered through JSX.
- Existing content consumers keep passing without type errors.
- Tests cover the new structured content enough to catch accidental empty labels or copy.

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run build`.
- Fix any failures before proceeding.

Commit:
- `Add structured About page content`

### Step 3: Build the New About Layout
Goal: Replace the current left-border About blocks with the proposed two-column editorial layout.

Changes:
- Update `app/about/page.tsx` to render:
  - wider two-column top grid
  - blue About eyebrow
  - large balanced H1 and intro copy
  - capability chip row below the intro
  - three equal main About cards with icon badges, heading, blue accent rule, and body copy
  - right profile card wrapping the existing portrait image
  - compact sidebar summary rows below the portrait
- Use `lucide-react` icons already available in the project, selecting icons that match the proposed design without adding dependencies.
- Create small local components inside `app/about/page.tsx` only where they keep the page readable: `AboutChip`, `AboutCard`, `ProfileSummaryRow`, and icon mapping helpers.
- Use existing `Container`, `Section`, `ExternalLink`, and `Link` primitives.
- Add About-specific CSS classes in `app/globals.css` only when inline utility classes become repetitive or hurt consistency.

Dependencies:
- Step 2 for structured content.

Acceptance Criteria:
- Desktop `/about` visually matches the proposed design's top composition: left content column, right profile/sidebar card, chip row, and three cards.
- The portrait is inside a bordered rounded card and keeps explicit image dimensions.
- Text does not overlap or overflow in the chip row, cards, or sidebar.
- The page still has exactly one visible `h1`.
- The portrait remains discoverable by its existing accessible name.

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run build`.
- Run `bun run dev` and visually inspect `/about` at approximately 1440px, 1024px, 768px, and 390px widths.
- Fix any failures before proceeding.

Commit:
- `Redesign About hero and profile layout`

### Step 4: Add the "What Matters to Me" Section and CTA Alignment
Goal: Complete the lower half of the proposed About design with value cards and centered contact actions.

Changes:
- Update `app/about/page.tsx` to add a `What matters to me` section below the main About cards.
- Render three horizontal value cards for `Correctness`, `Clarity`, and `Delivery`, each with a blue icon badge and concise supporting copy.
- Restyle the About CTA row to match `improved.png`: centered row on desktop, full-width stacked buttons on small mobile screens, filled Email primary button, bordered secondary buttons for GitHub, LinkedIn, and Resume.
- Prefer existing `.button` and `.button-secondary` classes; add small About-specific wrapper classes only for layout and width.
- Ensure footer spacing still feels connected to the wider About content.

Dependencies:
- Step 3.

Acceptance Criteria:
- The lower About page includes the new `What matters to me` section.
- CTA buttons are visually balanced and keyboard focus remains visible.
- The footer aligns cleanly under the redesigned About page.
- Mobile layout stacks without clipped text or horizontal scrolling.

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run build`.
- Run `bun run dev` and visually inspect `/about` at desktop and mobile widths.
- Fix any failures before proceeding.

Commit:
- `Add About values section and contact actions`

### Step 5: Strengthen About Page E2E Coverage
Goal: Lock in the redesigned page structure and protect against responsive regressions.

Changes:
- Update `tests/e2e/public-routes.e2e.ts` with focused About assertions:
  - capability chips render
  - the three main About cards render
  - the `What matters to me` section renders all three values
  - the portrait image remains visible with the existing alt text
  - there is no horizontal overflow at desktop and mobile viewport sizes
- If useful, add a route-specific test loop for `/about` at multiple viewport widths rather than broad screenshot snapshots.
- Keep tests resilient to minor copy changes by querying stable headings and accessible labels where possible.

Dependencies:
- Steps 3 and 4.

Acceptance Criteria:
- Playwright coverage fails if the new core About sections disappear.
- The existing public routes e2e tests continue to pass.
- No brittle pixel-based snapshots are introduced unless explicitly needed later.

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run build`.
- Fix any failures before proceeding.

Commit:
- `Cover redesigned About page structure`

### Step 6: Final Visual Polish Across Pages
Goal: Confirm the About redesign did not make typography or spacing inconsistent with the rest of the site.

Changes:
- Review `/`, `/work`, `/about`, `/resume`, and one project detail page in the browser.
- Adjust shared typography tokens or page classes in `app/globals.css` if the About H1, Work H1, Resume H1, and project detail H1 no longer feel cohesive.
- Make only targeted polish changes: spacing, line-height, card radius, icon badge size, border contrast, active nav underline position, and button width.
- Avoid broad redesigns of pages outside `/about`.

Dependencies:
- Steps 1 through 5.

Acceptance Criteria:
- `/about` closely matches `improved.png` while staying coherent with the rest of the site.
- Typography hierarchy is consistent across top-level pages.
- All responsive breakpoints avoid clipped text, card overlap, and horizontal scrolling.
- All configured quality gates pass.

Validation:
- Run `bun run format`.
- Run `bun run lint`.
- Run `bun run typecheck`.
- Run `bun run test`.
- Run `bun run test:e2e`.
- Run `NEXT_TELEMETRY_DISABLED=1 NEXT_PUBLIC_SITE_URL=http://localhost:3000 bun run build`.
- Run `bun run dev` and manually verify `/`, `/work`, `/about`, `/resume`, and one `/work/[slug]` page.
- Fix any failures before proceeding.

Commit:
- `Polish About redesign across responsive pages`
