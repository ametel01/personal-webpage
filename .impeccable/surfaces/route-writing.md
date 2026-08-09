---
version: 1
slug: "route-writing"
primary_target: "route:/writing"
related_targets: ["route:/writing/[slug]"]
---

# Writing surface

- Scope: `/writing` index and `/writing/[slug]` articles.
- Visitor mode: Read.
- Audience: engineers searching for practical answers; engineering managers assessing Alex's technical judgment.
- Job: answer a non-branded systems question clearly, then make adjacent writing and supporting project evidence easy to inspect.
- Primary action: read a field note. Secondary actions: browse by topic and inspect related project evidence.
- Proof/content: four original evergreen guides grounded in the site's existing project work and public evidence. No invented metrics, customers, or deployment claims.
- Constraints: preserve the existing light editorial world, internal links stay same-tab, external evidence links open safely, one `h1`, static routes, responsive reading measure, reduced-motion support.
- Direction: featured-guide topic atlas. Approved comp: `.impeccable/mocks/writing-atlas-featured.png`.
- Memorable moment: a contour-line path leaves the featured guide and resolves into four topic waypoints; it becomes a simple vertical topic list on narrow screens.
- Article composition: a restrained title deck, readable body column, sticky table of contents on wide screens, inline checklists/callouts, and a related-writing close.
- Unresolved decisions: future article cadence and whether topic archive routes are warranted after the initial inventory grows.

## Implementation inventory

| Ingredient | Medium | Commitment |
| --- | --- | --- |
| Site navigation | Existing semantic header | Add Writing between Work and About; preserve active state and mobile behavior. |
| Index headline | Semantic HTML/CSS | Existing Georgia-like display face; max width around 15 characters per major line at desktop. |
| Featured guide | Semantic article/link | Approximately two-thirds of the content width, single 1px blue border, no shadow, real metadata. |
| Contour motif | Authored SVG | 10–12 crisp blue paths over the featured guide's right third; decorative and hidden from accessibility tree. |
| Topic connector | CSS/SVG geometry | One thin blue path and four circular waypoints; no canvas or raster. |
| Topic atlas | Semantic list of anchor links | Four real topics with descriptions and one article each; no inflated counts. |
| Supporting articles | Semantic linked rows | Three horizontal rule-separated rows with title, summary, topic, reading time, date, and directional arrow. |
| Article metadata | Existing Lucide icons + HTML | Clock and calendar icons with text labels; never icon-only. |
| Article detail | Semantic article | 65–75ch body, sticky TOC on wide screens, clear `h2`/`h3`, checklists, callouts, related project and writing links. |
| Responsive adaptation | CSS | Feature and atlas stack; connector becomes vertical; rows collapse without horizontal overflow. |
| Motion | CSS only | A single contour-line draw-in on initial load; disabled under reduced motion. |

## Component grammar

- Corners: mostly square editorial regions; 6px only for small interactive focus/hover surfaces already used by the site.
- Lines: 1px cool-gray separators; blue line reserved for featured-guide contour and active navigation.
- Elevation: none on writing surfaces.
- Type ramp: serif display at `clamp(2.65rem, 5vw, 4.9rem)` for the index headline, serif article titles from 1.55–2.45rem, sans body at 1–1.125rem, small sans metadata at 0.75–0.875rem.
- Color: existing paper, deep navy, restrained blue, and cool-gray rules only.
