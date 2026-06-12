# Alex Metelli Personal Website Design Specification

Last updated: 2026-06-12

## 1. Design Goal

Create a clean, technical, evidence-first website for a serious software engineer.

The design should help hiring managers quickly understand:

- Alex works on backend systems, developer tooling, and blockchain infrastructure
- Alex has real professional experience at Nethermind
- Alex can work on correctness-sensitive systems
- Alex is available for remote roles and selected consulting
- The selected projects are concrete and reviewable

The site should feel:

- Direct
- Technical
- Calm
- Professional
- Editorial
- Evidence-based

It should not feel like:

- A junior portfolio template
- A startup landing page
- A Web3 hype site
- A fake dashboard
- A decorative code playground

## 2. Visual Direction

Use a restrained editorial layout:

- Light theme only for v1
- White and near-white surfaces
- Deep navy text
- One restrained blue accent
- Thin borders
- Strong typography
- Spacious sections
- Compact proof elements
- Minimal motion
- Meaningful icons only

Do not use:

- Glassmorphism
- Particles
- Typing effects
- Fake terminal windows
- Decorative code blocks
- Heavy gradients
- Dark mode toggle
- Hero headshot
- Screenshots
- Architecture diagrams
- Code snippets

## 3. Site Structure

```text
/
  Home

/work
  Curated selected work

/work/voyager-verifier
/work/aggsandbox
/work/nogame

/about
  Professional narrative and headshot

/resume
  Rendered web resume

/resume.pdf
  Optional PDF download
```

No dedicated `/contact` page in v1.

## 4. Layout System

Use a centered container:

```css
:root {
  --container: 1180px;
}

.container {
  width: min(100% - 48px, var(--container));
  margin-inline: auto;
}

@media (max-width: 720px) {
  .container {
    width: min(100% - 32px, var(--container));
  }
}
```

Prefer full-width page sections with constrained inner content. Do not put page sections inside decorative cards.

Cards are allowed for:

- Project cards
- Focus groups
- Resume entries
- Case-study metadata blocks

Avoid nested cards.

## 5. Color System

Use a mostly neutral palette with one blue accent.

```css
:root {
  --color-bg: #ffffff;
  --color-surface: #ffffff;
  --color-surface-muted: #f7f8fb;

  --color-text: #071024;
  --color-text-muted: #4b5870;
  --color-text-soft: #6b7280;

  --color-border: #dce2ea;
  --color-border-soft: #edf0f5;

  --color-primary: #0b1b3a;
  --color-primary-hover: #102952;
  --color-primary-soft: #eef3ff;

  --color-accent: #1f3a93;
  --color-accent-hover: #172d73;

  --color-dark: #071024;
  --color-dark-muted: #101c35;

  --color-tag-bg: #f1f4f8;
  --color-tag-text: #263348;

  --shadow-card: 0 1px 2px rgba(7, 16, 36, 0.04), 0 8px 24px rgba(7, 16, 36, 0.04);
  --shadow-button: 0 8px 18px rgba(7, 16, 36, 0.16);
}
```

The proof bar should use a flat dark background, not a radial gradient.

## 6. Typography

Recommended fonts:

```text
Primary: Inter or Geist Sans
Mono: Geist Mono only for small technical labels if needed
```

Use normal letter spacing for body text. Avoid strong negative tracking. Slight tightening is acceptable only on large display text if it improves rendering.

Suggested type scale:

```css
:root {
  --font-sans: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-md: 1.0625rem;
  --text-lg: 1.125rem;
  --text-xl: 1.375rem;
  --text-2xl: 1.75rem;
  --text-3xl: 2.25rem;
  --text-4xl: 3.25rem;
  --text-5xl: 4.5rem;

  --leading-tight: 0.98;
  --leading-snug: 1.15;
  --leading-normal: 1.55;
}
```

Usage:

```text
Hero name: medium, strong
Hero eyebrow: small uppercase
Hero H1: large display
Hero body: 18px
Section heading: 13px uppercase
Card title: 20px
Card body: 15-16px
Tag text: 13px
```

## 7. Header

Desktop:

```text
AM
Alex Metelli
Work
About
Resume
```

Mobile:

```text
AM
Work
About
Resume
```

Rules:

- Keep header minimal
- Sticky header is acceptable
- Hide full name on small screens
- Do not add a hamburger menu in v1
- Header Resume link points to `/resume`, not `/resume.pdf`
- External profile links do not belong in the primary header for v1

Recommended behavior:

```text
Internal links: same tab
External links: new tab with rel="noreferrer"
```

## 8. Homepage Hero

Purpose:

- Communicate positioning immediately
- Establish credibility without noise
- Move the reader into selected work

Hero text:

```text
Alex Metelli
Software Engineer

Backend systems.
Developer tooling.
Blockchain infrastructure.

I build backend systems, developer tools, and blockchain infrastructure for teams working on correctness-sensitive software.
```

Hero actions:

```text
View Work
GitHub
LinkedIn
```

Recommended layout:

- Two columns on desktop
- Left column: name, eyebrow, H1, body, actions
- Right column: credibility summary panel
- Stack columns on tablet and mobile

Do not include the headshot in the hero.

## 9. Hero Summary Panel

Use the right column for concrete credibility.

Summary copy:

```text
Previously at Nethermind, working on Starknet tooling, verification workflows, cross-chain infrastructure, and developer experience automation.
```

Facts:

```text
Focus
Backend · Dev Tools · Blockchain · AI Workflows

Tech
TypeScript · Rust · Python · Solidity · Cairo

Strengths
System Design · APIs · Smart Contracts · DX · Automation

Availability
Remote · Async · Timezone flexible
```

Do not include Go.

Visual style:

- Use a left border or top border, not a heavy card
- Keep labels short
- Keep content scan-friendly
- No fake metrics

## 10. Selected Work

Use three cards in v1:

```text
Voyager Verifier
AggSandbox
NoGame
```

Do not mention Open Maintainer.

Project cards should include:

- Meaningful icon from `lucide-react`
- Project name
- Value statement
- Proof line
- Tech tags
- View Project link

Use meaningful icons only. Avoid decorative glyphs such as:

```text
◇
◎
▣
◌
```

Recommended icons:

```text
Voyager Verifier: ShieldCheck or FileCode
AggSandbox: Network or GitBranch
NoGame: Gamepad2 or Boxes
```

Card grid:

```text
Desktop: 3 columns
Tablet: 2 columns
Mobile: 1 column
```

Do not create empty space for a fourth card.

## 11. Technical Focus

Show four compact groups.

```text
Backend & infrastructure
TypeScript · Node.js · Python · Rust · PostgreSQL · Redis · Docker · Linux

Developer tooling
CLI tools · Engineering automation · AI-assisted engineering workflows

Blockchain systems
Starknet · Cairo · Solidity · EVM · LayerZero · AggLayer · Cross-chain infrastructure · Aztec experiments

Product engineering
Next.js · React · APIs · Deployment · Observability
```

Design:

- Use simple grouped panels or rows
- Keep Product engineering visually secondary
- Do not over-style as a skills dashboard
- Do not use skill bars or percentages

## 12. Experience Snapshot

Homepage section, no dates:

```text
Nethermind
Starknet tooling, contract verification workflows, cross-chain infrastructure, developer experience automation.

Independent / Open Source
Protocol experiments, full-stack product prototypes, CLI tooling, engineering automation, and AI-assisted engineering workflows.
```

This section should bridge to `/resume`, not replace it.

## 13. Proof Bar

Use a flat dark bar with four compact items.

```text
Professional Experience
Nethermind

Core Work
Backend · Infra · Tooling

Open Source
Starknet · Cairo · Dev Tools

Availability
Remote · Async · Timezone flexible
```

Rules:

- No dates
- No `Projects 10+`
- No inflated metrics
- No radial gradient
- Strong contrast
- Compact layout

Responsive:

```text
Desktop: 4 columns
Tablet: 2 columns
Mobile: 1 column
```

## 14. Contact Section

Use a compact final homepage section.

Copy:

```text
Open to remote software engineering roles focused on backend systems, developer tooling, and blockchain infrastructure. Also open to selected consulting work where the scope is technical and concrete.
```

Links:

```text
alex-metelli@gmx.com
LinkedIn
GitHub
```

Email should be visible and use `mailto:alex-metelli@gmx.com`.

Do not add a copy-email button in v1.

## 15. Footer

Footer links:

```text
Email
GitHub
LinkedIn
Resume
```

Use the public email:

```text
alex-metelli@gmx.com
```

Footer should be quiet and functional.

## 16. About Page

Purpose:

- Add human credibility
- Explain professional direction
- Show the headshot in the right context

Use:

```text
public/images/professional-photo.png
```

Source asset:

```text
docs/professional-photo.png
```

Content sections:

```text
Professional narrative
What I work on
How I work
What I am looking for
Links
```

Working style copy:

```text
I work well in remote, async teams and can adapt my schedule across time zones when collaboration needs it.
```

Do not publish exact geography.

## 17. Resume Page

`/resume` should be a polished web resume, not a PDF embed.

Use structured content for:

```text
Experience
Selected Projects
Skills
Education / Certifications
Links
```

Include a secondary PDF action:

```text
Download PDF
```

The PDF should be copied during implementation:

```text
docs/Resume-June2026.pdf -> public/resume.pdf
```

Do not expose phone or exact location on the rendered web resume.

Dates are acceptable on `/resume` where accurate.

## 18. Project Pages

Each project page uses the same structure:

```text
Title
Short description
Metadata block: Role, Stack, Current state
Overview
Problem
My role
Technical details
Hard parts and tradeoffs
Current state
Evidence
```

Writing style:

- First person
- Restrained
- Specific
- Evidence-based

Do not include:

- Screenshots
- Architecture diagrams
- Code snippets
- Decorative media

Evidence links should open in a new tab with `rel="noreferrer"`.

## 19. Motion and Interaction

Allowed:

- Button hover
- Link color transition
- Subtle card lift
- Border-color change
- Slight shadow increase

Maximum card/button lift:

```text
translateY(-2px)
```

Avoid:

- Scroll reveal animations
- Typing effects
- Moving particles
- Auto-playing carousels
- Large parallax effects

Respect reduced motion:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.001ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
    transition-duration: 0.001ms !important;
  }
}
```

## 20. Accessibility

Requirements:

- Semantic HTML
- One `h1` per page
- `article` for project cards and case studies
- Real links for CTAs
- Icons cannot be the only source of meaning
- Minimum 4.5:1 contrast for normal text
- Clear hover states
- Clear keyboard focus states

Focus style:

```css
:focus-visible {
  outline: 3px solid rgba(31, 58, 147, 0.35);
  outline-offset: 4px;
  border-radius: 6px;
}
```

## 21. SEO and Social Preview

Homepage title:

```text
Alex Metelli - Software Engineer | Backend, Developer Tooling, Blockchain Infrastructure
```

Meta description:

```text
Alex Metelli is a software engineer focused on backend systems, developer tooling, blockchain infrastructure, Starknet tooling, and AI-assisted engineering workflows.
```

Use one static OG image for v1:

```text
public/og.png
```

The OG image should be simple:

```text
Alex Metelli
Software Engineer
Backend systems · Developer tooling · Blockchain infrastructure
```

Do not include the headshot in the OG image for v1.

Each page should still have page-specific metadata.

Add:

```text
app/sitemap.ts
app/robots.ts
```

Use configurable site URL metadata later. Do not hard-code a custom domain yet.

## 22. Implementation Notes

Use:

```text
Next.js App Router
TypeScript
Tailwind
Bun
lucide-react
Vercel Web Analytics
Biome
```

No component library in v1.

Runtime assets should be copied from `docs/` into `public/`, not moved.

## 23. Responsive Rules

Desktop:

- Two-column hero
- Three-column selected work
- Four-column proof bar

Tablet:

- Hero stacks
- Selected work becomes two columns
- Proof bar becomes two columns

Mobile:

- Full brand name hidden in header
- Keep Work, About, Resume visible if they fit
- Hero actions can stack
- Selected work one column
- Technical focus one column
- Proof bar one column
- Summary facts stacked

## 24. Final Standard

Every design choice should support trust.

If an element does not help a hiring manager understand Alex's engineering credibility, remove it.
