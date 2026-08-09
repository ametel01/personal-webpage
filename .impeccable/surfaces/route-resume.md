---
version: 1
slug: "route-resume"
primary_target: "route:/resume"
related_targets: []
---

## Scope and mode

- Surface: `/resume`
- Primary target: `app/resume/page.tsx`
- Mode: Read

## Audience and job

Engineering managers should be able to scan Alex's professional position and range, verify experience and project evidence, and decide whether to download the concise PDF or start a conversation. Recruiters are the secondary audience, followed by technical peers who want direct paths into the supporting case studies.

## Content, actions, and constraints

- Preserve factual resume content from `src/content/resume.ts`; do not invent employers, dates, metrics, technologies, credentials, project states, or claims.
- Lead with name and position beside a concise summary, primary PDF-download action, conversation path, and professional-profile links.
- Follow with the complete four-field evidence index, professional experience, all seven selected projects, skill groups, education, and a closing PDF action.
- Keep one `h1`, semantic reading order, visible keyboard focus, 44px minimum interactive targets, safe external links, and reduced-motion behavior.
- Inherit the site's warm paper, navy ink, editorial serif hierarchy, restrained evidence blue, square records, and precise hairline rules.
- Do not expose a phone number or exact location, and do not turn proof-bearing sections into cards.

## Chosen direction

**Career proof register.** A compact identity deck opens into one continuous career proof register, refusing the generic resume card stack. Candidate 6 was selected from seed `5d5e2afc`.

The memorable moment is the first viewport resolving from name, position, summary, and PDF action into a four-column evidence index, then continuing through a single blue path beside the complete career record.

Reviewer disposition: **PASS** across thesis, own-world fit, story, first viewport, and form.

## Primary and secondary actions

- Primary: download the PDF resume.
- Secondary: start a conversation by email, inspect GitHub or LinkedIn, navigate within the resume, and open project case studies.
- Closing action: download the PDF after reviewing the complete record.

## Responsive behavior

- Above 1080px, retain the two-column identity deck, four-column evidence index, 220px sticky section index, and continuous career record marked by one blue vertical path.
- At 1080px, stack the masthead and record, turn the section index into a four-column horizontal band, and remove the decorative blue path without losing navigation.
- At 760px, reduce the evidence index to two columns, make the section index horizontally scrollable, stack experience detail below employer information, and compact project rows while preserving accessible case-study names.
- At 520px, stack primary actions and evidence fields into one column, keep three equal profile-link targets, move project technology evidence below each project, and stack the education and closing records.
- Reduced motion renders the career path resolved immediately and removes directional-arrow transitions.

## Implementation inventory

| Region | Commitment | Medium |
| --- | --- | --- |
| Identity deck | Name and position beside factual summary and actions | Semantic React/CSS |
| Primary action group | PDF download leads; conversation path remains visible | Semantic links/Lucide icons |
| Profile register | Email, GitHub, and LinkedIn in a rule-separated row | Semantic links/Lucide icons |
| Evidence index | Four complete summary facts | Semantic definition list and existing tags |
| Section index | Experience, projects, skills, and education | Semantic aside/navigation |
| Career path | One fine blue vertical guide on wide layouts | CSS pseudo-element |
| Experience record | Employer, role, dates, summary, and factual bullets | Semantic article and existing logo asset |
| Project register | All seven selected projects with technology and case-study access | Semantic articles, existing project marks, and links |
| Skills and education | Flat rule-separated evidence rows | Semantic sections and existing education asset |
| Close | Concise prompt and repeated PDF action | Semantic footer/link |

## Component grammar

- Geometry: square facts, records, and register rows; gentle corners only on controls, tags, and existing project marks.
- Lines: 1px cool hairlines define every record; evidence blue is reserved for the career path and actions.
- Elevation: none throughout the identity deck and career proof register.
- Type: editorial serif for the name and section hierarchy; compact sans for summaries, metadata, evidence labels, and controls.
- Interaction: quiet blueprint wash for navigational and project-row hover, 4px directional-arrow travel, visible focus, and no motion under reduced-motion preference.

## Unresolved decisions

None. The shipped direction and five-part finish review are approved.
