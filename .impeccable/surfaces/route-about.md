---
version: 1
slug: "route-about"
primary_target: "route:/about"
related_targets: []
---

## Scope and mode

- Surface: `/about`
- Primary target: `app/about/page.tsx`
- Mode: Read

## Audience and job

Engineering managers and recruiters should understand how Alex works, where his engineering depth sits, and what kind of opportunity fits. The page should make personal context as inspectable as the project evidence elsewhere on the site.

## Content, action, and constraints

- Preserve factual copy from `src/content/profile.ts`; do not invent metrics, employers, or claims.
- Lead with the professional portrait, positioning statement, three work questions, capability summary, principles, and contact paths.
- Keep the global header, warm paper / navy / blue visual system, one `h1`, semantic reading order, visible focus, and 44px targets.
- Internal links stay in-tab; GitHub and LinkedIn remain safe external links.

## Chosen direction

**Waypoint interview field.** A narrow identity rail holds the portrait and five-item capability index. A broad reading field uses a vertical evidence-blue path to connect “What I work on,” “How I work,” and “What I’m looking for.” Three principles and a rule-separated contact register close the page.

Approved comp: `.impeccable/mocks/about-interview-c.png`

The memorable moment is the blue waypoint line turning a conventional biography into a precise, sequential account of engineering practice.

## Implementation inventory

| Region | Commitment | Medium |
| --- | --- | --- |
| Header | Existing site shell and active About underline | Existing React/CSS |
| Identity rail | Tall rectangular portrait, caption, five numbered capabilities | Existing raster via `next/image`; semantic HTML/CSS |
| Title deck | Small blue label, large serif headline, factual lead | Semantic HTML/CSS |
| Interview path | Three numbered nodes joined by a fine vertical blue line; generous rule-separated reading rhythm | Semantic HTML/CSS pseudo-elements |
| Principles | Three equal columns with line icons and concise factual copy | React/Lucide/CSS |
| Contact register | Email, GitHub, LinkedIn, and Resume with 44px targets | Semantic links/Lucide/CSS |
| Responsive | Rail becomes an intro plate; interview line remains vertical; principles and actions stack cleanly | CSS media queries |

Component grammar: structurally flat regions, square geometry, 1px rules, no cards or shadows. Type follows the established Georgia display / system sans body ramp. Blue communicates path and action only. No new generated production asset is required beyond the approved composition probe.

## Unresolved decisions

None. The selected comp is a north star; exact generated spacing and incidental mock text are not literal requirements.
