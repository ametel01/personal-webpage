# Alex Metelli Personal Website PRD

Last updated: 2026-06-12

## 1. Product Goal

Build a professional software engineering website that helps Alex Metelli earn serious remote engineering opportunities.

The site is not a generic portfolio. It is a proof page for why a technical hiring manager should trust Alex with backend, infrastructure, developer tooling, and blockchain systems work.

Primary conversion goal:

- Remote software engineering roles
- Selected consulting work with concrete technical scope

Primary reader:

- Engineering managers first
- Recruiters second
- Technical peers third

The site should make someone think:

> Alex can take ambiguous engineering problems, structure them, build the system, document it, and ship.

## 2. Positioning

Primary identity:

```text
Software Engineer

Backend systems.
Developer tooling.
Blockchain infrastructure.
```

Hero body:

```text
I build backend systems, developer tools, and blockchain infrastructure for teams working on correctness-sensitive software.
```

Supporting positioning:

- Generalist software engineer with blockchain depth
- Backend and infrastructure capability
- Developer tooling and engineering automation
- Starknet, Cairo, Solidity, verification, and cross-chain systems experience
- AI-assisted engineering workflows as a supporting strength, not the headline

Avoid:

- Blockchain/Web3-only positioning
- "Passionate developer"
- "Building the future"
- "Web3 enthusiast"
- "Cutting-edge solutions"
- Fake metrics
- Junior portfolio aesthetics

## 3. V1 Site Map

```text
/
  Home

/work
  Curated selected work index

/work/voyager-verifier
  Voyager Verifier case study

/work/aggsandbox
  AggSandbox case study

/work/ask-siargao
  Ask Siargao case study

/work/horizon-starknet
  Horizon Protocol case study

/about
  Professional narrative, headshot, working style, links

/resume
  Rendered web resume

/resume.pdf
  Optional downloadable PDF resume
```

There is no dedicated `/contact` page in v1. Contact appears on the homepage, footer, about page, and resume page.

## 4. Homepage Requirements

Homepage order:

```text
1. Header
2. Hero
3. Selected Work
4. Technical Focus
5. Experience Snapshot
6. Proof Bar
7. Contact
8. Footer
```

### Header

Desktop navigation:

```text
AM / Alex Metelli
Work
About
Resume
```

Mobile navigation:

```text
AM
Work
About
Resume
```

Hide the full brand name on small screens if needed. Do not add a hamburger menu for v1.

### Hero

The hero must answer, within seconds:

- Who Alex is
- What systems he works on
- Why the work is credible

Hero content:

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

External hero links open in a new tab with `rel="noreferrer"`.

Do not include the headshot in the homepage hero. Use the right side for a credibility summary panel.

### Hero Summary Panel

Include:

```text
Previously at Nethermind, working on Starknet tooling, verification workflows, cross-chain infrastructure, and developer experience automation.
```

Structured facts:

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

Do not include Go anywhere in v1.

## 5. Selected Work

V1 uses four strong case studies only:

```text
1. Voyager Verifier
2. AggSandbox
3. Ask Siargao
4. Horizon Protocol
```

Do not mention Open Maintainer. It is incomplete and not suitable as proof.

Do not add another project unless it has real evidence and defensible technical substance.

Each homepage project card must include:

- Project name
- One-sentence value statement
- One-line proof signal
- Tech tags
- Link to full case study or strongest external artifact

No card should link to a placeholder or thin page.

### Project Card Copy

Voyager Verifier:

```text
Starknet contract verification tooling with compiler integration and status tracking.
Proof: Built for Starknet verification workflows at Nethermind.
```

AggSandbox:

```text
Cross-chain infrastructure experiments using LayerZero, AggLayer concepts, and executable contract scripts.
Proof: Cross-chain protocol experiments with executable contracts and scripts.
```

Ask Siargao:

```text
AI travel decision desk that turns Siargao plans into evidence-backed keep, change, avoid, or confirm-locally calls.
Proof: Live product and public source with governed tool use and server-validated Reality Checks.
```

Horizon Protocol:

```text
Starknet yield tokenization protocol with SY/PT/YT assets, AMM markets, router flows, frontend, and indexer.
Proof: Alpha mainnet deployment with live SplitYield product and documented Starknet contract addresses.
```

## 6. Project Case Study Template

Every v1 project page must be a real case study, not a placeholder.

Template:

```text
Overview
Problem
My role
Technical details
Hard parts and tradeoffs
Current state
Evidence
```

Include a top metadata block:

```text
Role
Stack
Current state
```

Write case studies in restrained first person:

- "I built..."
- "I owned..."
- "I integrated..."
- "I chose..."

Avoid inflated or vague claims.

Do not include screenshots, architecture diagrams, or code snippets in v1.

Evidence links should be real and open in a new tab with `rel="noreferrer"`.

## 7. Technical Focus

Homepage Technical Focus should include four groups:

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

AWS should not appear in the homepage Technical Focus. Include AWS Console and CloudWatch only where relevant, especially the Voyager Verifier case study and resume.

## 8. Experience Snapshot

Include a compact homepage Experience Snapshot without dates:

```text
Nethermind
Starknet tooling, contract verification workflows, cross-chain infrastructure, developer experience automation.

Independent / Open Source
Protocol experiments, full-stack product prototypes, CLI tooling, engineering automation, and AI-assisted engineering workflows.
```

Dates belong on `/resume`, not on the homepage.

## 9. Proof Bar

Use a compact proof bar with no fake metrics.

Recommended content:

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

Do not use:

```text
Projects
10+
```

## 10. Contact

Include a compact homepage Contact section.

Contact positioning:

```text
Open to remote software engineering roles focused on backend systems, developer tooling, and blockchain infrastructure. Also open to selected consulting work where the scope is technical and concrete.
```

Public email:

```text
alex-metelli@gmx.com
```

Show the email visibly and make it a `mailto:` link.

Do not add a copy-email button in v1.

Public web contact should be limited to:

- Email
- LinkedIn
- GitHub

Do not publish phone number or exact location on rendered web pages.

## 11. About Page

The about page should be mostly professional.

Include:

- `professional-photo.png`
- Short professional narrative
- What Alex works on
- How Alex works
- What roles or consulting work Alex is open to
- Links to GitHub, LinkedIn, email, and resume

Use the headshot on `/about` only for v1.

Working style sentence:

```text
I work well in remote, async teams and can adapt my schedule across time zones when collaboration needs it.
```

Do not publish exact geography.

## 12. Resume

The web resume is `/resume`.

The optional PDF download is `/resume.pdf`.

Header Resume link should point to `/resume`, not directly to the PDF.

The web resume should be rendered from structured content, not generated from PDF extraction.

Recommended structure:

```text
Experience
Nethermind

Selected Projects
Voyager Verifier
AggSandbox
Ask Siargao
Horizon Protocol

Skills
Backend & infrastructure
Developer tooling
Blockchain systems
Product engineering

Education / Certifications
If relevant and accurate

Links
GitHub
LinkedIn
Email
Download PDF
```

Dates should appear on `/resume` where accurate. Dates should not appear on the homepage.

The PDF source currently lives at:

```text
docs/Resume-June2026.pdf
```

For implementation, copy it to:

```text
public/resume.pdf
```

Keep the original PDF in `docs/`.

## 13. Writing / Notes

Include Writing / Notes only if at least one finished technical note is ready.

Good topics:

- Starknet verification workflows
- Cairo tooling
- Cross-chain infrastructure
- AI-assisted engineering workflows
- Developer tooling tradeoffs

Do not ship an empty or thin writing section.

## 14. SEO and Metadata

Homepage title:

```text
Alex Metelli - Software Engineer | Backend, Developer Tooling, Blockchain Infrastructure
```

Meta description:

```text
Alex Metelli is a software engineer focused on backend systems, developer tooling, blockchain infrastructure, Starknet tooling, and AI-assisted engineering workflows.
```

Target keywords:

```text
Alex Metelli software engineer
Alex Metelli backend engineer
Alex Metelli blockchain engineer
Alex Metelli Starknet
Alex Metelli Cairo developer
developer tooling engineer
blockchain infrastructure engineer
AI tooling engineer
```

Add homepage `Person` JSON-LD:

- `name`
- `jobTitle`
- `url`
- `sameAs`: GitHub, LinkedIn
- `knowsAbout`: backend systems, developer tooling, blockchain infrastructure, Starknet, Cairo, Solidity, TypeScript, Rust, Python
- `email`

Add page-specific metadata for each project page. V1 can share one static Open Graph image:

```text
public/og.png
```

Add:

```text
app/sitemap.ts
app/robots.ts
```

Do not hard-code a custom canonical domain yet. The production domain is an open decision. Use a configurable site URL later.

## 15. Stack and Tooling

Use:

```text
Next.js App Router
TypeScript
Tailwind
Bun
MDX or structured static content
lucide-react
Vercel Web Analytics
Biome
```

Do not use a component library in v1.

Quality scripts:

```json
{
  "format": "biome format --write .",
  "lint": "biome check .",
  "typecheck": "tsc --noEmit",
  "build": "next build"
}
```

Vercel deployment should be optimized for Bun:

```text
Install Command: bun install
Build Command: bun run build
```

Local quality gates come before GitHub Actions. Add CI later after the app structure is stable.

## 16. Runtime Assets

Keep planning/source files in `docs/`:

```text
docs/PRD.md
docs/DESIGN.md
docs/design.png
docs/professional-photo.png
docs/Resume-June2026.pdf
```

Copy runtime assets into `public/` during implementation:

```text
docs/professional-photo.png -> public/images/professional-photo.png
docs/Resume-June2026.pdf -> public/resume.pdf
```

Do not move the docs source artifacts.

## 17. Accessibility

Requirements:

- Semantic HTML
- One `h1` per page
- Real links for CTAs
- Clear focus-visible styles
- Minimum 4.5:1 contrast for normal text
- Icons must not be the only source of meaning
- Respect `prefers-reduced-motion`
- External links that open in a new tab need clear behavior and `rel="noreferrer"`

## 18. Do Not Include in V1

- Open Maintainer
- Go
- Dedicated contact page
- Contact form
- Hero headshot
- Dark mode
- Component library
- Screenshots
- Architecture diagrams
- Code snippets
- Placeholder case-study pages
- Fake metrics
- `Projects 10+`
- Heavy animations
- Typing animations
- Particles
- Carousels
- Decorative code blocks
- Fake terminal windows
- Exact public geography
- Public phone number on rendered pages

## 19. Open Decisions

- Final production domain and canonical URL
- Exact evidence links for Voyager Verifier
- Exact evidence links for AggSandbox
- Exact evidence links for Ask Siargao
- Exact evidence links for Horizon Protocol
- Exact structured resume transcription
- Whether Writing / Notes ships in v1
- Final static Open Graph image design
