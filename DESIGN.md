---
name: Alex Metelli Personal Website
description: A calm editorial proof surface for inspectable software engineering work.
colors:
  paper: "oklch(98.6% 0.007 84)"
  surface: "oklch(97.2% 0.009 84)"
  surface-raised: "oklch(99.1% 0.005 84)"
  surface-muted: "oklch(95.8% 0.01 86)"
  on-dark: "oklch(98.6% 0.007 84)"
  ink: "oklch(18.5% 0.04 259)"
  ink-muted: "oklch(43.5% 0.035 258)"
  ink-soft: "oklch(52% 0.03 257)"
  border: "oklch(87.5% 0.012 255)"
  border-soft: "oklch(92.8% 0.009 255)"
  primary: "oklch(23% 0.068 258)"
  primary-hover: "oklch(29% 0.08 258)"
  primary-soft: "oklch(94.5% 0.024 259)"
  accent: "oklch(38% 0.135 263)"
  accent-hover: "oklch(31% 0.12 263)"
  dark: "oklch(18.5% 0.04 259)"
  dark-muted: "oklch(23.5% 0.045 259)"
  tag-bg: "oklch(93.5% 0.012 255)"
  tag-text: "oklch(32% 0.036 258)"
  header-surface: "oklch(98.6% 0.007 84 / 0.88)"
  focus-ring: "oklch(52% 0.14 263 / 0.36)"
typography:
  display:
    fontFamily: 'Georgia, "Times New Roman", ui-serif, serif'
    fontSize: "clamp(3rem, 4.45vw, 4.25rem)"
    fontWeight: 850
    lineHeight: 0.96
    letterSpacing: "-0.055em"
  editorial-display:
    fontFamily: 'Georgia, "Times New Roman", ui-serif, serif'
    fontSize: "clamp(3.15rem, 6.15vw, 5.15rem)"
    fontWeight: 500
    lineHeight: 0.99
    letterSpacing: "-0.032em"
  headline:
    fontFamily: 'Georgia, "Times New Roman", ui-serif, serif'
    fontSize: "2.25rem"
    fontWeight: 850
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  title:
    fontFamily: 'Georgia, "Times New Roman", ui-serif, serif'
    fontSize: "1.375rem"
    fontWeight: 850
    lineHeight: 1.08
    letterSpacing: "-0.035em"
  lead:
    fontFamily: 'Inter, Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "clamp(1rem, 1.2vw, 1.12rem)"
    fontWeight: 560
    lineHeight: 1.6
  body:
    fontFamily: 'Inter, Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: 'Inter, Geist, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
    fontSize: "0.75rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "0.08em"
  code:
    fontFamily: 'ui-monospace, "SFMono-Regular", Consolas, "Liberation Mono", monospace'
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.65
rounded:
  interactive: "6px"
  interactive-lg: "7px"
  panel: "8px"
  card: "10px"
  feature: "12px"
  mark: "18px"
  pill: "999px"
spacing:
  section: "clamp(4.25rem, 7vw, 6.5rem)"
  section-tight: "clamp(3.25rem, 6vw, 5rem)"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-dark}"
    typography: "{typography.label}"
    rounded: "{rounded.interactive}"
    padding: "0.68rem 1rem"
    height: "44px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-dark}"
    rounded: "{rounded.interactive}"
  button-secondary:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.primary}"
    typography: "{typography.label}"
    rounded: "{rounded.interactive}"
    padding: "0.68rem 1rem"
    height: "44px"
  tech-tag:
    backgroundColor: "{colors.tag-bg}"
    textColor: "{colors.tag-text}"
    typography: "{typography.label}"
    rounded: "{rounded.interactive}"
    padding: "0.22rem 0.48rem"
    height: "26px"
  surface-card:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.panel}"
    padding: "1.55rem 1.45rem"
  writing-featured-guide:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "clamp(1.65rem, 3vw, 2.25rem)"
    height: "460px"
  homepage-featured-case-file:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "0"
    padding: "clamp(1.65rem, 3vw, 2.25rem)"
    height: "460px"
---

# Design System: Alex Metelli Personal Website

## Overview

**Creative North Star: "The Evidence Fieldbook"**

This system feels like a carefully maintained engineering fieldbook: warm paper carries precise navy ink, restrained blue marks the paths worth following, and serif headings give evidence enough gravity to be read rather than skimmed as marketing. It is calm, technical, and editorial, with the interface serving the work instead of competing with it.

The density is generous at the page level and compact inside proof-bearing elements. Thin rules, small labels, structured grids, and modest tonal shifts establish hierarchy. The writing surface established the clearest expression of the world; the homepage extends it into a proof ledger, linking one inspectable case file to a four-waypoint engineering index before continuing through project, contribution, writing, and experience evidence.

**Key Characteristics:**

- Warm paper and near-paper surfaces, never clinical white or dark-mode chrome.
- Deep navy text with a single restrained blue path for actions, topics, and active state.
- Strong Georgia-led display hierarchy paired with compact Inter/Geist/system sans text.
- Hairline rules and grid relationships as the primary organizing devices.
- Evidence-first cards and rows with restrained depth and no decorative excess.
- Motion limited to short state feedback and authored arrival moments, with reduced-motion fallbacks.

## Colors

The palette is a warm neutral field with cool navy structure and one disciplined engineering blue.

### Primary

- **Deep Engineering Navy** (`primary`): primary actions, dark controls, and high-authority emphasis.
- **Resolved Navy** (`primary-hover`): the primary action hover state; it is lighter enough to signal response without changing the system's voice.
- **Blueprint Wash** (`primary-soft`): selection, hover washes, and quiet highlighted regions.

### Secondary

- **Evidence Blue** (`accent`): links, active navigation, topic paths, technical markers, and small emphasis.
- **Evidence Blue Deep** (`accent-hover`): hover state for text links and directional actions.

### Neutral

- **Warm Paper** (`paper`): the default canvas and the writing surface.
- **Quiet Surface** (`surface`): secondary controls and subtle tonal separation.
- **Raised Paper** (`surface-raised`): cards, structured panels, and the footer.
- **Muted Paper** (`surface-muted`): full-width bands and article reading fields.
- **Navy Ink** (`ink`): primary text and dark foundations.
- **Muted Ink** (`ink-muted`): body copy, explanations, and supporting metadata.
- **Soft Ink** (`ink-soft`): lower-priority labels and tertiary context.
- **Cool Rule** (`border`) and **Soft Rule** (`border-soft`): one-pixel separators, card outlines, and shell boundaries.
- **Technical Tag Wash** (`tag-bg`) and **Technical Tag Ink** (`tag-text`): compact technology tags.
- **Translucent Paper** (`header-surface`): the sticky header over scrolling content.
- **Visible Focus Blue** (`focus-ring`): the universal keyboard focus outline.

### Named Rules

**The Blue Path Rule.** Blue identifies navigation, action, or technical relationship; it is not ambient decoration.

**The Paper Continuity Rule.** Full-width sections may change paper tone, but they stay within the warm neutral family and remain visually continuous with the page.

## Typography

**Display Font:** Georgia (with Times New Roman and system serif fallbacks)

**Body Font:** Inter or Geist (with system sans-serif fallbacks)

**Label/Mono Font:** The body sans for labels; system monospace only for real implementation examples.

**Character:** The serif carries editorial authority and makes technical titles feel authored. The sans-serif keeps evidence, metadata, and long explanations neutral, compact, and operational.

### Hierarchy

- **Display** (850, fluid `display`, 0.96): primary page and hero statements; tightly tracked and balanced.
- **Editorial Display** (500, fluid `editorial-display`, 0.99): writing index and article titles; deliberately lighter than the rest of the site's display hierarchy.
- **Headline** (850, `headline`, 1.08): major section titles.
- **Title** (850, `title`, 1.08): project, card, and evidence headings.
- **Lead** (560, fluid `lead`, 1.6): page descriptions and positioning copy.
- **Body** (400, `body`, 1.55): general reading; technical articles extend line-height to 1.78 and hold the content column to 75ch.
- **Label** (800, `label`, 0.08em): uppercase topics, kickers, and compact evidence labels.
- **Code** (400, `code`, 1.65): genuine code and implementation examples only.

### Named Rules

**The Serif Means Structure Rule.** Use the display serif for authored hierarchy, never as a novelty treatment for metadata or controls.

**The Reading Measure Rule.** Explanatory content stops at roughly 65–75 characters; a wide viewport creates margins and navigation space, not wider prose.

## Layout

The default content container is centered at a maximum of 1180px with 24px side gutters; gutters reduce to 16px at 720px and below. The wider site shell and About composition use a 1328px maximum with 64px gutters, returning to the standard container below 1120px. Sections use fluid vertical spacing from `section` and `section-tight` rather than stacking decorative wrappers.

Grids respond by preserving reading order: four-column project groups move to two and then one column; two-column heroes and evidence panels stack; sticky case-study and article navigation becomes a horizontally scrollable row. Primary breakpoints in the built system are 1280px, 1120px, 1080px, 1024px, 980px, 880px, 860px, 820px, 768px, 720px, 640px, 620px, 560px, 520px, and 430px, applied locally to the component whose composition changes.

The writing index uses a roughly two-thirds featured guide beside a narrow topic rail. At 820px the atlas stacks and its bridge disappears while the waypoint line remains vertical. Article detail uses a 190px sticky table of contents beside a 75ch reading column; below 820px the table of contents becomes an inline horizontal scroller.

The homepage uses the same broad-column-to-waypoint relationship without cloning the writing surface. A roughly two-thirds featured case file leads into a narrow engineering index through one blue bridge. At 980px the pair stacks, the bridge disappears, and the waypoint line stays vertical. Project ledger rows collapse from four aligned evidence columns into compact stacked records below 760px; the writing and experience split stacks at the same compact composition while retaining its dividing rule.

**The Full-Width Field Rule.** Page bands span the viewport; containers constrain their content. Do not place entire sections inside ornamental cards.

## Elevation & Depth

The system is structurally flat first. Hairline borders, paper tones, grids, and whitespace create most depth. A very low ambient card shadow appears on evidence panels; stronger shadows are reserved for dark buttons and small project marks. Writing surfaces and homepage proof ledgers use no shadow at all, allowing blue borders, contour paths, and rules to carry hierarchy.

### Shadow Vocabulary

- **Card Ambient** (`0 1px 2px oklch(18.5% 0.04 259 / 0.03), 0 12px 28px oklch(18.5% 0.04 259 / 0.035)`): quiet lift for project, resume, and profile panels.
- **Button Authority** (`0 10px 18px oklch(18.5% 0.04 259 / 0.18)`): compact depth beneath filled primary actions.
- **Project Mark** (`0 10px 22px oklch(38% 0.135 263 / 0.12)`): restrained blue cast under logo marks; the hover form increases to `0 14px 28px oklch(38% 0.135 263 / 0.16)`.

### Named Rules

**The Rule-Before-Shadow Rule.** Establish hierarchy with a one-pixel border or tonal field before introducing elevation.

**The Proof Ledger Stays Flat Rule.** Featured guides, homepage case files, waypoint indices, project rows, contribution rows, callouts, and reading content use no shadow.

## Shapes

The default editorial geometry is square or gently rounded. Full reading regions and row lists remain square; controls use a 6–7px radius; ordinary panels use 8–10px; featured cards and project marks may reach 12–18px. Pills are limited to badges and active-line terminals, while circles identify waypoints, timeline nodes, or compact icon marks.

Borders are one pixel and cool gray unless a blue border communicates selection, feature status, or a path relationship. Content should not be clipped into novelty silhouettes.

**The Small-Corner Rule.** Radius softens interaction and containment; it never turns the editorial system bubbly.

## Components

### Buttons

- **Shape:** compact rectangular control with a gently curved interactive radius (`interactive`) and a minimum 44px target.
- **Primary:** deep navy field, warm-paper text, 1px matching border, label-weight sans text, and compact horizontal padding.
- **Hover / Focus:** move upward 2px and shift to resolved navy; active state returns to the baseline with a slight 0.985 scale. Every variant receives the universal 3px visible focus outline with 4px offset.
- **Secondary:** quiet paper field, navy text, no shadow; hover uses the blueprint wash.

### Chips

- **Style:** technical tags use the tag wash and tag ink, 6px corners, 26px minimum height, a small icon when evidence supports one, and compact bold text.
- **State:** tags are descriptive, not interactive filters. Category and featured badges may use a pill silhouette, but do not imply click behavior.

### Cards / Containers

- **Corner Style:** most evidence cards use 8–12px corners; editorial rows and writing regions stay square.
- **Background:** raised paper over paper or muted-paper bands.
- **Shadow Strategy:** low ambient depth for profile, resume, and project cards; none for writing.
- **Border:** one-pixel cool rules remain visible even where a shadow is present.
- **Internal Padding:** generally 1.15–2.3rem, adjusted by content density and viewport.

### Navigation

The site header is sticky, translucent warm paper with blur, and separated by a soft one-pixel rule. Navigation uses 14px semibold sans text and full-height 44px-or-larger targets. The current route gains navy text and a 3px blue underline; hover changes text only. The brand name disappears below 620px, while the primary links remain visible without a hamburger menu.

### Writing Topic Atlas

The writing index is the system's signature editorial component. A square, blue-outlined featured guide occupies the broad column and carries ten fine contour paths across its right side. A thin blue bridge resolves into a four-waypoint topic rail; the first waypoint is double-stroked, and each topic includes a real description and count. Supporting articles continue as rule-separated rows with serif titles, restrained metadata, and a directional arrow.

The detail view preserves the same grammar: a restrained title deck, question strip, sticky table of contents, 75ch reading measure, blue-ruled key points and project callouts, square checklist markers, and rule-separated related writing. Contour and arrow motion use the existing arrival and standard easing, then resolve immediately when reduced motion is requested.

### Homepage Proof Ledger

The homepage opens with one square, blue-outlined featured case file rather than a card grid. Its broad column keeps the case title, factual state, summary, and action legible while fine provenance contours occupy the right edge. One short blue bridge connects the case file to a four-waypoint engineering index; the first waypoint is double-stroked, descriptions stay factual, and the vertical path remains when the layout stacks.

Supporting projects and open-source contributions continue as flat, rule-separated ledger rows. Wide rows align title, summary, current state or contribution status, technology metadata, and a directional arrow; narrow rows preserve that reading order as stacked records and may suppress repeated metadata. Hover uses only a quiet blueprint wash or a blue text shift, never lift or a shadow.

Writing and experience share one split proof region instead of separate cards. The writing side uses a serif proposition, one restrained contour fragment, and a directional link; the experience side uses compact rule-separated entries. On compact layouts the split becomes a vertical sequence and the divider changes from a left rule to a top rule.

Only one authored trace animates on homepage arrival: the featured case-file contours draw once with the arrival easing, while arrows use short state motion. Reduced motion renders the trace resolved immediately and removes nonessential transitions.

## Do's and Don'ts

### Do:

- **Do** lead with reviewable engineering evidence and let layout clarify its relationship to projects, artifacts, and adjacent writing.
- **Do** use warm paper, navy ink, restrained blue paths, serif hierarchy, and precise hairline rules as one coherent world.
- **Do** preserve 44px minimum interactive targets, visible keyboard focus, semantic labels, and reduced-motion behavior.
- **Do** keep technical prose within a 65–75ch measure and turn wide space into useful navigation or calm margins.
- **Do** use authored SVG linework only when it explains structure, as the writing contours and work blueprint do.
- **Do** use a featured case file and rule-separated ledgers when a homepage needs to establish one lead proof and several adjacent evidence paths.

### Don't:

- **Don't** turn the writing index into a generic reverse-chronological blog feed; preserve the featured-guide atlas and adjacent evidence paths.
- **Don't** turn the homepage into a uniform portfolio card grid; preserve the hierarchy between the featured case file, engineering index, and supporting ledgers.
- **Don't** introduce glassmorphism, particles, typing effects, fake terminals, decorative code blocks, heavy gradients, or dashboard chrome.
- **Don't** use blue as ambient decoration or scatter multiple competing accents through a surface.
- **Don't** nest cards or wrap full page sections in decorative containers.
- **Don't** fabricate metrics, testimonials, customer claims, or ornamental proof.
- **Don't** add motion that survives the reduced-motion preference or distracts from reading.
