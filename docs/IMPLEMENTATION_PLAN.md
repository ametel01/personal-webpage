# Personal Website Implementation Plan

Last updated: 2026-06-12

This plan turns `docs/PRD.md` and `docs/DESIGN.md` into a final deployable Vercel product.

The implementation must move in small, testable steps. Each step ends with a clean working tree commit only after its quality gates pass.

## Working Rules

- Start every step from a clean working tree.
- Read the files being changed and the nearest related caller, data definition, route, or test before editing.
- Keep commits scoped to the step being completed.
- Do not commit if any required gate fails.
- If a gate fails, read the full error, fix the cause, rerun the failed gate, then rerun the full step gate list.
- Do not add placeholder project pages, fake metrics, screenshots, architecture diagrams, code snippets, Open Maintainer, Go, a contact form, copy-email button, exact public geography, public phone number, or dark mode.
- Do not add glassmorphism, particles, typing effects, fake terminal windows, decorative code blocks, heavy gradients, carousels, scroll-reveal animations, skill bars, percentages, or decorative glyph icons.
- Use Bun for installs and scripts. Do not use npm, pnpm, or yarn.
- Use Biome for formatting/linting and TypeScript for type checking.
- After any user-facing frontend step, verify the local app in a browser at desktop and mobile widths before committing.

## Standard Quality Gates

Once the Next.js app exists, every implementation step should run:

```bash
bun run lint
bun run typecheck
bun run build
```

When tests exist, also run:

```bash
bun run test
```

When Playwright or browser verification exists, also run the relevant browser/e2e check. The automated browser smoke suite covers public route structure, link, and overflow checks; use manual browser verification for visual design changes not covered by `bun run test:e2e`.

For documentation-only steps before the app exists, run:

```bash
git diff --check
```

## Step 0: Commit Planning Baseline

Goal: preserve the finalized PRD, design spec, implementation plan, and source assets as the baseline for implementation.

Tasks:

- Review `docs/PRD.md`, `docs/DESIGN.md`, and this plan for internal contradictions.
- Confirm source assets are present:
  - `docs/design.png`
  - `docs/professional-photo.png`
  - `docs/Resume-June2026.pdf`
- Keep original source assets in `docs/`; do not move them.

Acceptance criteria:

- PRD and design spec agree on routes, stack, selected projects, public email, exclusions, and runtime asset handling.
- Implementation plan is present at `docs/IMPLEMENTATION_PLAN.md`.
- The working tree contains only intentional planning/source-asset changes.

Quality gates:

```bash
git diff --check
rg -n "alexmetelli\\.poker|GMT\\+8|/work/open-maintainer|TypeScript · Rust · Python · Solidity · Cairo · Go|GitHub integrations|Code review workflows|Repo automation" docs/PRD.md docs/DESIGN.md
```

The `rg` command should return no matches.

Commit:

```bash
git add docs/PRD.md docs/DESIGN.md docs/IMPLEMENTATION_PLAN.md docs/design.png docs/professional-photo.png docs/Resume-June2026.pdf
git commit -m "Document website implementation plan"
```

## Step 1: Scaffold Next.js App

Goal: create the minimal Next.js App Router project with Bun, TypeScript, Tailwind, Biome, and Vercel-compatible scripts.

Tasks:

- Add `package.json`.
- Add `bun.lock` by running `bun install`.
- Add Next.js App Router structure.
- Add TypeScript config with strict settings.
- Add centralized global CSS entry.
- Add Biome config.
- Add `.gitignore` for `node_modules`, `.next`, `out`, coverage, logs, and local env files.
- Add base scripts:
  - `dev`
  - `build`: `next build`
  - `lint`: `biome check .`
  - `format`: `biome format --write .`
  - `typecheck`: `tsc --noEmit`
- Install required dependencies:
  - `next`
  - `react`
  - `react-dom`
  - `lucide-react`
  - `@vercel/analytics`
- Install required dev dependencies:
  - `typescript`
  - `@biomejs/biome`

Acceptance criteria:

- The default app renders locally.
- `bun run build` succeeds.
- No ESLint or Prettier config is introduced.
- The project uses Bun only.

Quality gates:

```bash
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run build
```

Commit:

```bash
git add .
git commit -m "Scaffold Next.js site"
```

## Step 2: Add Design System Foundation

Goal: implement the base visual system before building pages.

Tasks:

- Add global CSS variables for colors, type scale, spacing, shadows, and focus styles using the color and typography tables in `docs/DESIGN.md` as the source of truth.
- Configure Tailwind to use the intended theme where useful.
- Implement the centered container rule from the design spec:
  - `width: min(100% - 48px, 1180px)` on desktop
  - `width: min(100% - 32px, 1180px)` at `max-width: 720px`
- Add global semantic layout primitives:
  - `Container`
  - `Section`
  - `ExternalLink`
  - `TagList`
  - `PageHeader`
- Ensure page sections are full-width bands or unframed layouts with constrained inner content, not decorative cards.
- Allow cards only for project cards, focus groups, resume entries, and case-study metadata blocks; avoid nested cards.
- Add reduced-motion global CSS.
- Add base metadata defaults.
- Add accessible link, button, and focus-visible styles.
- Add motion constraints:
  - hover/focus transitions only
  - maximum lift of `translateY(-2px)`
  - no scroll reveal, parallax, autoplaying carousels, or typing effects

Acceptance criteria:

- Design tokens match the PRD/design direction.
- The app still renders a simple page using the new layout primitives.
- No component library is added.
- No heavy animations or decorative effects are introduced.
- Light theme only; no dark-mode toggle exists.
- Focus-visible styling is clearly visible and follows the design-spec outline treatment.

Quality gates:

```bash
bun run lint
bun run typecheck
bun run build
```

Browser verification:

- Start `bun run dev`.
- Check homepage at desktop width.
- Check homepage at mobile width.
- Confirm focus rings are visible with keyboard navigation.

Commit:

```bash
git add .
git commit -m "Add design system foundation"
```

## Step 3: Add Structured Content and Runtime Assets

Goal: create the content source of truth and runtime public assets.

Tasks:

- Create structured content for:
  - profile/contact links
  - homepage facts
  - technical focus groups
  - proof bar items
  - experience snapshot
  - selected projects
  - project case studies
  - resume data
- Do not create a Writing / Notes route or homepage section unless at least one finished technical note exists.
- Copy runtime assets:
  - `docs/professional-photo.png` to `public/images/professional-photo.png`
  - `docs/Resume-June2026.pdf` to `public/resume.pdf`
- Add initial static OG image at `public/og.png` with simple text-only content:
  - `Alex Metelli`
  - `Software Engineer`
  - `Backend systems · Developer tooling · Blockchain infrastructure`
- Keep all original source assets in `docs/`.

Acceptance criteria:

- No page copy is duplicated unnecessarily across components.
- Public email is `alex-metelli@gmx.com`.
- Go and Open Maintainer do not appear in content.
- AWS does not appear in homepage Technical Focus; AWS Console and CloudWatch appear only where accurate, especially Voyager Verifier and resume content.
- Project case-study records include metadata, current state, and real evidence links where available. Omit evidence links rather than adding fake or placeholder destinations.
- Resume content is structured manually, not extracted from the PDF.
- Public rendered content does not expose phone number or exact geography.

Quality gates:

```bash
bun run lint
bun run typecheck
bun run build
rg -n "Open Maintainer|\\bGo\\b|alexmetelli\\.poker|GMT\\+8" src app public
```

The `rg` command should return no matches except false positives reviewed explicitly.

Commit:

```bash
git add .
git commit -m "Add structured website content"
```

## Step 4: Build Shared Layout, Header, and Footer

Goal: implement the site shell used by every page.

Tasks:

- Build root layout with global metadata.
- Add Vercel Web Analytics.
- Build header:
  - `AM / Alex Metelli` on desktop
  - `AM` on mobile if space requires
  - `Work`, `About`, `Resume`
  - no hamburger menu
- Build footer:
  - email
  - GitHub
  - LinkedIn
  - Resume
- Ensure external links open in new tab with `rel="noreferrer"`.
- Ensure internal links stay same-tab.

Acceptance criteria:

- Header and footer appear on all pages.
- Header Resume link points to `/resume`.
- PDF download is not the primary header action.
- Mobile nav remains usable without wrapping awkwardly.

Quality gates:

```bash
bun run lint
bun run typecheck
bun run build
```

Browser verification:

- Desktop header/footer.
- Mobile header/footer.
- Keyboard tab order through nav and footer.

Commit:

```bash
git add .
git commit -m "Build site shell"
```

## Step 5: Build Homepage

Goal: implement the full homepage from the PRD and design spec.

Tasks:

- Build hero with:
  - visible `Alex Metelli`
  - `Software Engineer`
  - H1: `Backend systems. Developer tooling. Blockchain infrastructure.`
  - correctness-sensitive hero body
  - `View Work`, `GitHub`, `LinkedIn`
- Build credibility summary panel.
- Build Selected Work with four cards:
  - Voyager Verifier
  - AggSandbox
  - Ask Siargao
  - Horizon Protocol
- Use recommended project icons where they fit:
  - Voyager Verifier: `ShieldCheck` or `FileCode`
  - AggSandbox: `Network` or `GitBranch`
  - Ask Siargao: `MessageCircle` or `Palmtree`
  - Horizon Protocol: `Coins` or `ChartNoAxesCombined`
- Build Technical Focus.
- Build Experience Snapshot.
- Build flat dark Proof Bar.
- Build compact Contact section.
- Use meaningful `lucide-react` icons where useful.
- Implement responsive layout targets:
  - desktop: two-column hero, four-column selected work, four-column proof bar
  - tablet: stacked hero, two-column selected work, two-column proof bar
  - mobile: one-column selected work, one-column technical focus, one-column proof bar, stacked hero actions and summary facts

Acceptance criteria:

- Homepage follows the required section order.
- No headshot appears on the homepage.
- No screenshots, diagrams, fake metrics, or code snippets appear.
- Selected Work has exactly four cards.
- Homepage Technical Focus uses exactly the four PRD groups: Backend & infrastructure, Developer tooling, Blockchain systems, Product engineering.
- AWS is not shown in homepage Technical Focus.
- Contact uses visible `alex-metelli@gmx.com` mailto link plus LinkedIn and GitHub only.
- Project cards use `article` or equivalent semantic grouping.
- All homepage CTAs work.
- Mobile layout does not overlap or clip text.
- No decorative glyph icons, skill bars, percentages, or empty fourth-card space appear.

Quality gates:

```bash
bun run lint
bun run typecheck
bun run build
```

Browser verification:

- Desktop homepage top, middle, and footer.
- Mobile homepage top, selected work, proof bar, and contact.
- Keyboard navigation through all homepage links.
- Verify external links open in a new tab.

Commit:

```bash
git add .
git commit -m "Build homepage"
```

## Step 6: Build Work Index and Case Study Pages

Goal: implement the proof surface for selected projects.

Tasks:

- Build `/work` as a curated index only.
- Build `/work/voyager-verifier`.
- Build `/work/aggsandbox`.
- Build `/work/ask-siargao`.
- Build `/work/horizon-starknet`.
- Use the case-study template:
  - title
  - short description
  - metadata block
  - overview
  - problem
  - my role
  - technical details
  - hard parts and tradeoffs
  - current state
  - evidence
- Add page-specific metadata for each project page.
- Add static route generation if project content is data-driven.

Acceptance criteria:

- No placeholder case-study pages exist.
- Each case-study page uses `article` semantics.
- Project pages use restrained first person.
- Evidence links are real or omitted.
- No screenshots, diagrams, or code snippets appear.
- `/work` links only to real case-study pages and GitHub as the secondary broader archive link.

Quality gates:

```bash
bun run lint
bun run typecheck
bun run build
```

Browser verification:

- `/work` desktop and mobile.
- Each case-study page desktop and mobile.
- External evidence link behavior.

Commit:

```bash
git add .
git commit -m "Build selected work pages"
```

## Step 7: Build About and Resume Pages

Goal: implement the personal credibility and structured CV surfaces.

Tasks:

- Build `/about` with:
  - professional headshot
  - professional narrative
  - what Alex works on
  - remote/async/timezone-flexible working style
  - what roles and consulting work Alex is open to
  - links to email, GitHub, LinkedIn, and resume
- Build `/resume` as a rendered web resume from structured content.
- Include resume links for GitHub, LinkedIn, Email, and Download PDF.
- Add `Download PDF` action pointing to `/resume.pdf`.
- Add page-specific metadata.

Acceptance criteria:

- Headshot appears on `/about`, not the homepage.
- `/resume` is not a PDF embed.
- `/resume.pdf` downloads or opens the copied PDF.
- Rendered web pages do not expose phone number or exact geography.
- Dates appear only where accurate on `/resume`.

Quality gates:

```bash
bun run lint
bun run typecheck
bun run build
```

Browser verification:

- `/about` desktop and mobile.
- `/resume` desktop and mobile.
- PDF link behavior.
- Image loads and is not distorted.

Commit:

```bash
git add .
git commit -m "Build about and resume pages"
```

## Step 8: Add SEO, Sitemap, Robots, and Structured Data

Goal: make the site crawlable, understandable, and shareable.

Tasks:

- Add homepage `Person` JSON-LD.
- Add `app/sitemap.ts`.
- Add `app/robots.ts`.
- Add shared site metadata helper with configurable site URL.
- Ensure no custom production domain is hard-coded.
- Configure static `/og.png` for shared OG image.
- Ensure the static OG image is text-only and does not include the headshot.
- Add page-specific title and description for:
  - `/`
  - `/work`
  - each project page
  - `/about`
  - `/resume`

Acceptance criteria:

- Build emits valid metadata for every route.
- Homepage title is `Alex Metelli - Software Engineer | Backend, Developer Tooling, Blockchain Infrastructure`.
- Homepage description is `Alex Metelli is a software engineer focused on backend systems, developer tooling, blockchain infrastructure, Starknet tooling, and AI-assisted engineering workflows.`
- Sitemap includes all v1 routes.
- Robots file allows crawling.
- JSON-LD contains name, job title, url, email, sameAs, and knowsAbout.
- JSON-LD knowsAbout includes backend systems, developer tooling, blockchain infrastructure, Starknet, Cairo, Solidity, TypeScript, Rust, and Python.
- Metadata does not publish exact geography or phone number.

Quality gates:

```bash
bun run lint
bun run typecheck
bun run build
```

Manual verification:

- Inspect rendered page source or built output for metadata.
- Open `/sitemap.xml` locally if available through dev/build server.
- Open `/robots.txt` locally if available through dev/build server.

Commit:

```bash
git add .
git commit -m "Add SEO metadata"
```

## Step 9: Add Automated Tests and Route Smoke Coverage

Goal: add lightweight tests that catch regressions before deployment.

Tasks:

- Add a test runner only if it fits the app simply.
- Prefer Bun test for pure content/route helpers.
- Add tests for:
  - project slugs and routes
  - required project fields
  - no Open Maintainer
  - no Go in public content
  - public email consistency
  - internal/external link metadata helper behavior if abstracted
- Consider Playwright only if manual browser checks become too repetitive or fragile.

Acceptance criteria:

- Tests cover critical content invariants without coupling to component internals.
- Tests are deterministic and do not need network access.
- The test script is part of `package.json`.

Quality gates:

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

Commit:

```bash
git add .
git commit -m "Add website regression tests"
```

## Step 10: Responsive, Accessibility, and Content QA Pass

Goal: do a full product-quality pass before deployment.

Tasks:

- Review all routes at desktop, tablet, and mobile widths.
- Verify text does not overlap, clip, or overflow.
- Verify keyboard navigation and focus-visible styles.
- Verify color contrast for text, buttons, and dark proof bar.
- Verify reduced-motion behavior.
- Verify all links.
- Verify image alt text.
- Verify all pages have exactly one `h1`.
- Verify project cards and case studies use semantic `article` markup.
- Verify icons are never the only source of meaning.
- Verify allowed motion is limited to hover/focus transitions and at most `translateY(-2px)`.
- Search for excluded content.

Acceptance criteria:

- All pages are usable on mobile and desktop.
- No route has broken links.
- No forbidden v1 content appears.
- Visual design remains restrained and evidence-first.
- Writing / Notes is either absent or contains at least one finished technical note.

Quality gates:

```bash
bun run lint
bun run typecheck
bun run test
bun run build
rg -n "Open Maintainer|\\bGo\\b|alexmetelli\\.poker|GMT\\+8|Projects 10\\+|Web3 enthusiast|Passionate developer" app src public -g '!**/*.test.*' -g '!**/*.spec.*'
```

Browser verification:

- `/`
- `/work`
- `/work/voyager-verifier`
- `/work/aggsandbox`
- `/work/ask-siargao`
- `/work/horizon-starknet`
- `/about`
- `/resume`
- `/resume.pdf`

Commit:

```bash
git add .
git commit -m "Polish responsive and accessibility details"
```

## Step 11: Prepare Vercel Deployment

Goal: make deployment reproducible and ready for Vercel.

Tasks:

- Confirm Vercel can use:
  - install command: `bun install`
  - build command: `bun run build`
- Add Vercel notes to `README.md`.
- Document required environment variables:
  - `NEXT_PUBLIC_SITE_URL` if/when a production domain exists
- Confirm no production domain is hard-coded.
- Confirm `.env*` files are ignored.
- Run a local production build.

Acceptance criteria:

- README includes local development and Vercel deployment notes.
- Build works from a clean install.
- The app is ready for Vercel import or CLI deployment.

Quality gates:

```bash
bun install --frozen-lockfile
bun run lint
bun run typecheck
bun run test
bun run build
```

Commit:

```bash
git add .
git commit -m "Document Vercel deployment"
```

## Step 12: Deploy and Verify Production

Goal: deploy to Vercel and verify the live product.

Tasks:

- Deploy to Vercel preview.
- Inspect build logs.
- Open the preview URL.
- Verify all public routes.
- Verify metadata, OG image, sitemap, robots, analytics loading, and PDF link.
- Fix any production-only issues in a follow-up commit.
- Promote to production when preview passes.

Acceptance criteria:

- Preview deployment succeeds.
- Production deployment succeeds.
- All routes render correctly.
- PDF download works.
- No excluded content appears in production.
- The final deployed URL is recorded in `README.md`.

Quality gates before deployment:

```bash
bun run lint
bun run typecheck
bun run test
bun run build
```

Production verification:

- Homepage renders.
- Work index renders.
- Voyager Verifier, AggSandbox, Ask Siargao, and Horizon Protocol case studies render.
- About page renders with headshot.
- Resume page renders.
- `/resume.pdf` works.
- `/sitemap.xml` works.
- `/robots.txt` works.
- Social metadata is present.

Commit if deployment notes or fixes changed:

```bash
git add .
git commit -m "Finalize Vercel deployment"
```

## Final Done Definition

The product is final and deployable when:

- Every route in the PRD exists and is non-placeholder.
- Writing / Notes is excluded unless a finished technical note exists.
- Homepage is evidence-first and matches the positioning.
- Selected Work includes exactly Voyager Verifier, AggSandbox, Ask Siargao, and Horizon Protocol.
- `/about` uses the professional headshot.
- `/resume` is rendered from structured content.
- `/resume.pdf` is available.
- SEO metadata, JSON-LD, sitemap, robots, and OG image exist.
- Vercel Web Analytics is installed.
- The site passes lint, typecheck, tests, and build.
- Desktop and mobile browser verification pass.
- Production Vercel deployment is live and verified.
