# Alex Metelli Developer Website Design Specification

## 1. Goal

Create a clean professional website that helps Alex Metelli get software engineering opportunities by quickly communicating:

* Senior backend and infrastructure capability
* Developer tooling experience
* Blockchain infrastructure experience
* Open-source credibility
* Clear availability for remote roles
* Direct access to resume, GitHub, LinkedIn, and contact

The site should feel serious, technical, and reliable. It should avoid portfolio clutter, gimmicks, fake dashboards, decorative code blocks, and vague startup-style copy.

---

# 2. Brand Positioning

## Primary positioning

**Software Engineer focused on backend systems, developer tooling, and blockchain infrastructure.**

## Supporting message

Alex builds scalable backend systems, developer tools, and correctness-sensitive infrastructure that help teams ship faster and with more confidence.

## Tone

* Direct
* Technical
* Professional
* Minimal
* Evidence-based
* No hype
* No unnecessary personal branding fluff

## Avoid

* “Passionate developer”
* “Building the future”
* “Web3 enthusiast”
* “Cutting-edge solutions”
* Excessive AI buzzwords
* Decorative code snippets
* Fake metrics
* Overloaded animations

---

# 3. Site Structure

## Main pages

```txt
/
  Home

/work
  Selected project case studies

/work/open-maintainer
/work/voyager-verifier
/work/aggsandbox
/work/nogame

/about
  Professional background

/experience
  Work history and technical focus

/contact
  Contact form or direct email

/resume.pdf
  Downloadable resume
```

## Homepage sections

```txt
1. Header
2. Hero
3. Professional summary
4. Selected work
5. Proof bar
6. Footer
```

---

# 4. Homepage Layout

## Header

### Purpose

Give quick navigation and a strong first impression.

### Content

Left side:

```txt
AM
Alex Metelli
```

Right side:

```txt
Work
About
Experience
Contact
Resume
```

### Behavior

* Sticky header optional
* Resume button should be visually stronger than normal nav links
* Header should stay minimal and not dominate the page

---

## Hero Section

### Purpose

Immediately communicate what Alex does and why he is relevant to hiring managers.

### Left column

Eyebrow:

```txt
SOFTWARE ENGINEER
```

Headline:

```txt
Backend systems.
Developer tooling.
Blockchain infrastructure.
```

Body:

```txt
I build scalable backend systems, developer tools, and blockchain infrastructure that help teams ship faster and with confidence.
```

Primary CTA:

```txt
View My Work
```

Secondary links:

```txt
GitHub
LinkedIn
```

### Right column

Professional summary panel:

```txt
Software engineer with experience at Nethermind, working on Starknet tooling, verification systems, cross-chain infrastructure, and developer experience automation.
```

Structured facts:

```txt
Focus
Backend · Dev Tools · Blockchain · AI Workflows

Tech
TypeScript · Rust · Python · Solidity · Cairo · Go

Strengths
System Design · APIs · Smart Contracts · DX · Automation

Interests
Developer Productivity · Open Source · Infrastructure
```

### Design notes

* No code block in hero
* No fake architecture diagrams
* No fake dashboard metrics
* Use the right column as a credibility summary
* Keep the hero text large and calm

---

# 5. Selected Work Section

## Purpose

Show credible projects without overwhelming the visitor.

## Section heading

```txt
SELECTED WORK
```

## Link

```txt
View all projects →
```

## Project cards

Each card should include:

* Icon
* Project name
* One-sentence value
* Tech tags
* View Project link

### Card 1

Title:

```txt
Open Maintainer
```

Description:

```txt
AI-ready repository context, PR review, and issue triage for GitHub projects.
```

Tags:

```txt
TypeScript
GitHub API
AI
CLI
```

### Card 2

Title:

```txt
Voyager Verifier
```

Description:

```txt
Starknet contract verification tooling with compiler integration and status tracking.
```

Tags:

```txt
Cairo
Starknet
TypeScript
API
```

### Card 3

Title:

```txt
AggSandbox
```

Description:

```txt
Cross-chain infrastructure experiments using LayerZero and AggLayer concepts.
```

Tags:

```txt
Solidity
LayerZero
Foundry
Hardhat
```

### Card 4

Title:

```txt
NoGame
```

Description:

```txt
Starknet MMO game with real-time systems, smart contracts, and frontend.
```

Tags:

```txt
Next.js
Cairo
Starknet
WebSocket
```

---

# 6. Proof Bar

## Purpose

End the page with compact credibility signals.

## Items

```txt
Professional Experience
Nethermind

Projects
10+

Open Source
Active Contributor

Focus
Remote · Async · Global
```

## Design notes

* Dark background
* Strong contrast
* Compact layout
* No inflated metrics
* If possible, replace “10+” later with a stronger factual proof point

Better future variants:

```txt
Professional Experience
Nethermind, 2024–2026

Open Source
Starknet · Cairo · Dev Tools

Availability
Remote · GMT+8 · Async

Core Work
Backend · Infra · Tooling
```

---

# 7. Visual Style

## Overall style

Minimal technical editorial layout.

## Keywords

```txt
Clean
Precise
Structured
Calm
Professional
Technical
Spacious
```

## Design principles

* Large typography
* Strong hierarchy
* Plenty of white space
* Light borders
* Limited accent color
* Few icons
* No unnecessary illustrations
* No glassmorphism
* No fake terminal windows
* No excessive gradients

---

# 8. Color System

## CSS variables

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

---

# 9. Typography

## Recommended fonts

Primary:

```txt
Inter
```

Alternative:

```txt
Geist Sans
```

Monospace, only for tiny labels if needed:

```txt
Geist Mono
```

## Type scale

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

  --leading-tight: 0.96;
  --leading-snug: 1.15;
  --leading-normal: 1.55;

  --tracking-tight: -0.045em;
  --tracking-normal: -0.015em;
  --tracking-wide: 0.12em;
}
```

## Usage

```txt
Hero eyebrow: 14px uppercase, letter-spaced
Hero headline: 64–72px desktop, 42–48px tablet, 36–40px mobile
Hero body: 18px
Section heading: 13px uppercase
Card title: 20px
Card body: 15–16px
Tag text: 13px
```

---

# 10. Spacing System

```css
:root {
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-10: 2.5rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  --container: 1320px;
}
```

---

# 11. Radius System

```css
:root {
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;
  --radius-xl: 18px;
  --radius-full: 999px;
}
```

---

# 12. Base CSS

```css
* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: var(--font-sans);
  background: var(--color-bg);
  color: var(--color-text);
  line-height: var(--leading-normal);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

a {
  color: inherit;
  text-decoration: none;
}

button,
input,
textarea {
  font: inherit;
}

img,
svg {
  display: block;
  max-width: 100%;
}

::selection {
  background: var(--color-primary);
  color: white;
}
```

---

# 13. Container

```css
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

---

# 14. Header CSS

```css
.site-header {
  height: 72px;
  border-bottom: 1px solid var(--color-border-soft);
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);
  position: sticky;
  top: 0;
  z-index: 20;
}

.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.brand {
  display: inline-flex;
  align-items: center;
  gap: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.brand-mark {
  font-size: 1.35rem;
  font-weight: 900;
  letter-spacing: -0.08em;
}

.brand-name {
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.nav {
  display: flex;
  align-items: center;
  gap: 34px;
}

.nav-link {
  font-size: var(--text-sm);
  color: var(--color-text);
  transition: color 160ms ease;
}

.nav-link:hover {
  color: var(--color-accent);
}

.resume-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 20px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: white;
  font-size: var(--text-sm);
  font-weight: 700;
  box-shadow: var(--shadow-button);
  transition: background 160ms ease, transform 160ms ease;
}

.resume-button:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

@media (max-width: 820px) {
  .nav {
    gap: 18px;
  }

  .nav-link:nth-child(2),
  .nav-link:nth-child(3) {
    display: none;
  }
}

@media (max-width: 560px) {
  .brand-name {
    display: none;
  }

  .nav-link {
    display: none;
  }
}
```

---

# 15. Hero CSS

```css
.hero {
  padding: 72px 0 72px;
  border-bottom: 1px solid var(--color-border-soft);
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 72px;
  align-items: center;
}

.eyebrow {
  margin: 0 0 24px;
  color: var(--color-accent);
  font-size: var(--text-sm);
  font-weight: 800;
  letter-spacing: var(--tracking-wide);
  text-transform: uppercase;
}

.hero-title {
  margin: 0;
  max-width: 760px;
  font-size: clamp(2.5rem, 6vw, var(--text-5xl));
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
  font-weight: 850;
}

.hero-copy {
  max-width: 680px;
  margin: 28px 0 0;
  color: var(--color-text-muted);
  font-size: var(--text-lg);
  line-height: 1.55;
}

.hero-actions {
  display: flex;
  align-items: center;
  gap: 28px;
  margin-top: 32px;
}

.primary-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  padding: 0 24px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: white;
  font-weight: 750;
  box-shadow: var(--shadow-button);
  transition: background 160ms ease, transform 160ms ease;
}

.primary-button:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.text-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--color-text);
  font-weight: 600;
}

.text-link:hover {
  color: var(--color-accent);
}

.summary-panel {
  border-left: 1px solid var(--color-border);
  padding-left: 64px;
}

.summary-copy {
  margin: 0 0 36px;
  color: var(--color-text);
  font-size: var(--text-lg);
  line-height: 1.55;
}

.fact-list {
  display: grid;
  gap: 24px;
}

.fact-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 18px;
  align-items: start;
}

.fact-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: var(--text-sm);
  font-weight: 800;
}

.fact-value {
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  line-height: 1.7;
}

@media (max-width: 980px) {
  .hero-grid {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .summary-panel {
    border-left: 0;
    padding-left: 0;
    padding-top: 40px;
    border-top: 1px solid var(--color-border-soft);
  }
}

@media (max-width: 560px) {
  .hero {
    padding: 48px 0 56px;
  }

  .hero-actions {
    align-items: flex-start;
    flex-direction: column;
    gap: 18px;
  }

  .fact-item {
    grid-template-columns: 1fr;
    gap: 8px;
  }
}
```

---

# 16. Selected Work CSS

```css
.work-section {
  padding: 32px 0 40px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.section-title {
  margin: 0;
  font-size: var(--text-sm);
  font-weight: 850;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.work-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.project-card {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  padding: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  box-shadow: var(--shadow-card);
  transition: border-color 160ms ease, transform 160ms ease, box-shadow 160ms ease;
}

.project-card:hover {
  transform: translateY(-3px);
  border-color: #c8d2e1;
  box-shadow: 0 12px 34px rgba(7, 16, 36, 0.08);
}

.project-icon {
  width: 46px;
  height: 46px;
  display: grid;
  place-items: center;
  margin-bottom: 26px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: white;
}

.project-title {
  margin: 0;
  font-size: var(--text-xl);
  line-height: 1.2;
  letter-spacing: -0.03em;
}

.project-copy {
  margin: 10px 0 0;
  color: var(--color-text-muted);
  font-size: var(--text-sm);
  line-height: 1.55;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 20px;
}

.tag {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 10px;
  border-radius: var(--radius-sm);
  background: var(--color-tag-bg);
  color: var(--color-tag-text);
  font-size: var(--text-xs);
  font-weight: 600;
}

.project-link {
  margin-top: auto;
  padding-top: 24px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-size: var(--text-sm);
  font-weight: 750;
  color: var(--color-primary);
}

.project-link:hover {
  color: var(--color-accent);
}

@media (max-width: 1120px) {
  .work-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .section-header {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }

  .work-grid {
    grid-template-columns: 1fr;
  }

  .project-card {
    min-height: auto;
  }
}
```

---

# 17. Proof Bar CSS

```css
.proof-bar {
  background: radial-gradient(circle at top left, #10234a 0%, var(--color-dark) 42%, #050b18 100%);
  color: white;
  padding: 34px 0;
}

.proof-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
}

.proof-item {
  display: grid;
  grid-template-columns: 44px 1fr;
  gap: 20px;
  align-items: center;
  padding: 0 32px;
  border-right: 1px solid rgba(255, 255, 255, 0.18);
}

.proof-item:first-child {
  padding-left: 0;
}

.proof-item:last-child {
  border-right: 0;
  padding-right: 0;
}

.proof-icon {
  color: white;
  opacity: 0.92;
}

.proof-label {
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
  font-size: var(--text-sm);
}

.proof-value {
  margin: 4px 0 0;
  font-size: var(--text-lg);
  font-weight: 800;
}

@media (max-width: 920px) {
  .proof-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 28px 0;
  }

  .proof-item:nth-child(2) {
    border-right: 0;
  }

  .proof-item:nth-child(3),
  .proof-item:nth-child(4) {
    padding-top: 28px;
    border-top: 1px solid rgba(255, 255, 255, 0.18);
  }
}

@media (max-width: 560px) {
  .proof-grid {
    grid-template-columns: 1fr;
  }

  .proof-item {
    padding: 22px 0;
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.18);
  }

  .proof-item:first-child {
    padding-top: 0;
  }

  .proof-item:last-child {
    padding-bottom: 0;
    border-bottom: 0;
  }

  .proof-item:nth-child(3),
  .proof-item:nth-child(4) {
    padding-top: 22px;
    border-top: 0;
  }
}
```

---

# 18. Footer CSS

```css
.site-footer {
  padding: 28px 0;
  border-top: 1px solid var(--color-border-soft);
  color: var(--color-text-soft);
  font-size: var(--text-sm);
}

.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.footer-links {
  display: flex;
  align-items: center;
  gap: 24px;
}

.footer-links a:hover {
  color: var(--color-accent);
}

@media (max-width: 640px) {
  .footer-inner {
    align-items: flex-start;
    flex-direction: column;
  }
}
```

---

# 19. Example HTML Structure

```html
<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/">
      <span class="brand-mark">AM</span>
      <span class="brand-name">Alex Metelli</span>
    </a>

    <nav class="nav">
      <a class="nav-link" href="/work">Work</a>
      <a class="nav-link" href="/about">About</a>
      <a class="nav-link" href="/experience">Experience</a>
      <a class="nav-link" href="/contact">Contact</a>
      <a class="resume-button" href="/resume.pdf">Resume ↓</a>
    </nav>
  </div>
</header>

<main>
  <section class="hero">
    <div class="container hero-grid">
      <div>
        <p class="eyebrow">Software Engineer</p>
        <h1 class="hero-title">Backend systems.<br>Developer tooling.<br>Blockchain infrastructure.</h1>
        <p class="hero-copy">I build scalable backend systems, developer tools, and blockchain infrastructure that help teams ship faster and with confidence.</p>

        <div class="hero-actions">
          <a class="primary-button" href="/work">View My Work →</a>
          <a class="text-link" href="https://github.com/ametel01">GitHub ↗</a>
          <a class="text-link" href="https://linkedin.com/in/alex-metelli-344169182">LinkedIn ↗</a>
        </div>
      </div>

      <aside class="summary-panel">
        <p class="summary-copy">Software engineer with experience at Nethermind, working on Starknet tooling, verification systems, cross-chain infrastructure, and developer experience automation.</p>

        <div class="fact-list">
          <div class="fact-item">
            <div class="fact-label">Focus</div>
            <div class="fact-value">Backend · Dev Tools · Blockchain · AI Workflows</div>
          </div>

          <div class="fact-item">
            <div class="fact-label">Tech</div>
            <div class="fact-value">TypeScript · Rust · Python · Solidity · Cairo · Go</div>
          </div>

          <div class="fact-item">
            <div class="fact-label">Strengths</div>
            <div class="fact-value">System Design · APIs · Smart Contracts · DX · Automation</div>
          </div>

          <div class="fact-item">
            <div class="fact-label">Interests</div>
            <div class="fact-value">Developer Productivity · Open Source · Infrastructure</div>
          </div>
        </div>
      </aside>
    </div>
  </section>

  <section class="work-section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Selected Work</h2>
        <a class="text-link" href="/work">View all projects →</a>
      </div>

      <div class="work-grid">
        <article class="project-card">
          <div class="project-icon">◇</div>
          <h3 class="project-title">Open Maintainer</h3>
          <p class="project-copy">AI-ready repository context, PR review, and issue triage for GitHub projects.</p>
          <div class="tag-list">
            <span class="tag">TypeScript</span>
            <span class="tag">GitHub API</span>
            <span class="tag">AI</span>
            <span class="tag">CLI</span>
          </div>
          <a class="project-link" href="/work/open-maintainer">View Project →</a>
        </article>

        <article class="project-card">
          <div class="project-icon">◇</div>
          <h3 class="project-title">Voyager Verifier</h3>
          <p class="project-copy">Starknet contract verification tooling with compiler integration and status tracking.</p>
          <div class="tag-list">
            <span class="tag">Cairo</span>
            <span class="tag">Starknet</span>
            <span class="tag">TypeScript</span>
            <span class="tag">API</span>
          </div>
          <a class="project-link" href="/work/voyager-verifier">View Project →</a>
        </article>

        <article class="project-card">
          <div class="project-icon">◇</div>
          <h3 class="project-title">AggSandbox</h3>
          <p class="project-copy">Cross-chain infrastructure experiments using LayerZero and AggLayer concepts.</p>
          <div class="tag-list">
            <span class="tag">Solidity</span>
            <span class="tag">LayerZero</span>
            <span class="tag">Foundry</span>
            <span class="tag">Hardhat</span>
          </div>
          <a class="project-link" href="/work/aggsandbox">View Project →</a>
        </article>

        <article class="project-card">
          <div class="project-icon">◇</div>
          <h3 class="project-title">NoGame</h3>
          <p class="project-copy">Starknet MMO game with real-time systems, smart contracts, and frontend.</p>
          <div class="tag-list">
            <span class="tag">Next.js</span>
            <span class="tag">Cairo</span>
            <span class="tag">Starknet</span>
            <span class="tag">WebSocket</span>
          </div>
          <a class="project-link" href="/work/nogame">View Project →</a>
        </article>
      </div>
    </div>
  </section>

  <section class="proof-bar">
    <div class="container proof-grid">
      <div class="proof-item">
        <div class="proof-icon">▣</div>
        <div>
          <p class="proof-label">Professional Experience</p>
          <p class="proof-value">Nethermind</p>
        </div>
      </div>

      <div class="proof-item">
        <div class="proof-icon">⌘</div>
        <div>
          <p class="proof-label">Projects</p>
          <p class="proof-value">10+</p>
        </div>
      </div>

      <div class="proof-item">
        <div class="proof-icon">◎</div>
        <div>
          <p class="proof-label">Open Source</p>
          <p class="proof-value">Active Contributor</p>
        </div>
      </div>

      <div class="proof-item">
        <div class="proof-icon">◌</div>
        <div>
          <p class="proof-label">Focus</p>
          <p class="proof-value">Remote · Async · Global</p>
        </div>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="container footer-inner">
    <span>© 2026 Alex Metelli</span>
    <div class="footer-links">
      <a href="https://github.com/ametel01">GitHub</a>
      <a href="https://linkedin.com/in/alex-metelli-344169182">LinkedIn</a>
      <a href="mailto:alexmetelli.poker@gmail.com">Email</a>
    </div>
  </div>
</footer>
```

---

# 20. Interaction Rules

## Hover states

* Cards lift slightly
* Buttons move up 1px
* Text links change to accent color
* No aggressive animations

## Motion

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

## Animation limits

Allowed:

* Button hover
* Card hover
* Link color transition

Avoid:

* Hero typing animations
* Code rain
* Moving background particles
* Excessive scroll effects
* Auto-playing carousels

---

# 21. Responsive Rules

## Desktop

* Two-column hero
* Four project cards in one row
* Proof bar in four columns

## Tablet

* Hero stacks into one column
* Project grid becomes two columns
* Proof bar becomes two columns

## Mobile

* Hero title reduced
* CTA buttons stacked
* Project grid one column
* Hide secondary nav links
* Keep resume button visible
* Summary facts stacked

---

# 22. Accessibility Requirements

* Minimum contrast ratio: 4.5:1 for normal text
* All links must have clear hover/focus states
* Use semantic HTML
* Use one `h1` only
* Project cards should use `article`
* CTAs should be real links, not divs
* Icons must not be the only source of meaning
* Resume link should include accessible label if using an icon

Focus style:

```css
:focus-visible {
  outline: 3px solid rgba(31, 58, 147, 0.35);
  outline-offset: 4px;
  border-radius: 6px;
}
```

---

# 23. SEO Definitions

## Homepage title

```txt
Alex Metelli — Software Engineer | Backend, Developer Tooling, Blockchain Infrastructure
```

## Meta description

```txt
Alex Metelli is a software engineer focused on backend systems, developer tooling, blockchain infrastructure, Starknet tooling, and AI-assisted engineering workflows.
```

## Open Graph title

```txt
Alex Metelli — Software Engineer
```

## Open Graph description

```txt
Backend systems, developer tooling, blockchain infrastructure, and open-source engineering.
```

## Target keywords

```txt
Alex Metelli software engineer
Alex Metelli backend engineer
Alex Metelli blockchain engineer
Alex Metelli Starknet
Alex Metelli Cairo developer
developer tooling engineer
blockchain infrastructure engineer
AI tooling engineer
```

---

# 24. Project Page Template

Each project page should follow this structure:

```txt
Project name
Short one-line description

Overview
What the project does

Problem
Why it needed to exist

My role
What Alex personally built or owned

Technical details
Architecture, stack, integrations, tradeoffs

Hard parts
What was technically difficult

Result
What shipped, what improved, what was learned

Links
GitHub, demo, docs, PRs, articles
```

## Project page design

* No big decorative hero
* Use a clear technical case study format
* Include screenshots only if they help explain the project
* Include architecture diagrams only if real
* Include code snippets only inside project pages, and only when they prove a technical decision

---

# 25. Final Implementation Direction

This site should optimize for hiring, not visual noise.

The homepage should make a recruiter or engineering manager understand within seconds:

```txt
Alex is a backend/infrastructure engineer.
He has real professional experience.
He has worked on serious blockchain tooling.
He builds developer-facing systems.
He is available for remote technical work.
His projects are concrete and reviewable.
```

Everything else should be removed.
