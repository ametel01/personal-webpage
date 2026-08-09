---
version: 1
slug: "route-work"
primary_target: "route:/work"
related_targets: []
---

# Work index surface

- Scope: `/work`.
- Visitor mode: Experience.
- Audience: engineering managers first, recruiters second, technical peers third.
- Job: make seven projects quickly comparable while exposing enough role, current-state, technology, and proof detail to justify opening a case study.
- Primary action: read a case study. Secondary actions: scan the project index, inspect GitHub, and view the resume.
- Proof/content: the seven canonical records in `src/content/projects.ts`; no generated-comp copy or invented metrics may reach production.
- Constraints: inherit the Evidence Fieldbook world from Home and Writing, preserve one `h1`, keep links and evidence factual, retain all seven case studies plus GitHub and resume paths, respect reduced motion, and keep the page usable without decorative linework.
- Direction: vertical evidence register, approved comp `.impeccable/mocks/work-evidence-register.png`, enriched with the AgentReceipt proof rail and contour treatment from `.impeccable/mocks/work-specimen-book.png`.
- Memorable moment: the first project expands into a bordered evidence specimen whose blue contour resolves into four factual proof annotations; the remaining projects continue as a compact, rule-separated register.
- Responsive adaptation: the index becomes a two-column then horizontal project directory; the featured proof rail stacks below the specimen; register rows become compact vertical records without horizontal overflow.
- Unresolved decisions: none for this pass.

## Implementation inventory

| Ingredient | Medium | Commitment |
| --- | --- | --- |
| Page index and thesis | Semantic heading, copy, and anchor navigation | Narrow left rail on desktop; every project remains reachable and the rail loses stickiness on compact layouts. |
| Register header | Semantic text and 1px rules | Names the evidence register and seven-plate count without a decorative hero wrapper. |
| AgentReceipt specimen | Semantic article and links | Oversized serif title, verified summary, role, state, technologies, and case-study action. |
| Featured proof rail | Semantic aside + Lucide icons | Four factual annotations from the canonical project record; square rule-separated rows, no shadow. |
| Provenance contour | Authored SVG | Six fine blue paths spanning roughly one-third of the featured specimen; draws once, then resolves immediately for reduced motion. |
| Supporting register | Semantic articles | Six rule-separated project records with title, category, summary, role, state, technologies, proof, and directional action. |
| Registration marks | CSS geometry | Fine measurement ticks and plate labels clarify the specimen-book structure; decorative only. |
| GitHub and resume close | Semantic links | Flat two-column close preserving both existing destinations and restrained action copy. |

## Component grammar

- Corners: square register regions and proof rows; 6px only for existing focus treatment and compact technology tags.
- Lines: 1px cool rules; blue only for the selected specimen, contour, active index entry, and actions.
- Elevation: none throughout the Work index.
- Type ramp: 3.4–4rem serif thesis, 3–3.9rem featured title, 2–2.55rem supporting titles, sans body and 0.72–0.78rem proof labels.
- Density: generous thesis and featured specimen, then compact proof-bearing register rows.
