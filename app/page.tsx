import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Crosshair,
  GitBranch,
  Layers3,
  Mail,
  Sparkles,
  UsersRound
} from "lucide-react";
import Link from "next/link";
import { Container, ExternalLink, Section, TagList } from "@/components/primitives";
import { ProjectIcon } from "@/components/project-icon";
import {
  experienceSnapshot,
  profile,
  proofBarItems,
  technicalFocusGroups
} from "@/content/profile";
import {
  type OpenSourceContribution,
  openSourceContributions,
  type Project,
  projects
} from "@/content/projects";
import { getAbsoluteUrl, homeMetadata } from "@/lib/metadata";

export const metadata = homeMetadata;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  url: getAbsoluteUrl("/"),
  email: `mailto:${profile.email}`,
  sameAs: [profile.links.github, profile.links.linkedin],
  knowsAbout: [
    "backend systems",
    "AI tooling",
    "agent workflows",
    "developer tooling",
    "blockchain infrastructure",
    "Starknet",
    "Cairo",
    "Solidity",
    "TypeScript",
    "Rust",
    "Python"
  ]
} as const;

const personJsonLdScript = JSON.stringify(personJsonLd).replace(/</g, "\\u003c");

const factIcons = [Crosshair, Code2, Layers3, Sparkles] as const;
const proofIcons = [BriefcaseBusiness, Code2, GitBranch, UsersRound] as const;

export default function Home() {
  return (
    <main>
      <script type="application/ld+json">{personJsonLdScript}</script>
      <div className="intro-page">
        <Section className="hero-section">
          <Container>
            <div className="home-hero-grid">
              <div>
                <p className="page-eyebrow">{profile.hero.role}</p>
                <h1 className="hero-title home-hero-title">{profile.hero.headline}</h1>
                <p className="page-description home-hero-description">{profile.hero.body}</p>
                <div className="home-hero-actions">
                  <a className="button" href="#selected-work">
                    View My Work
                    <ArrowRight aria-hidden="true" size={17} strokeWidth={2.3} />
                  </a>
                  <ExternalLink className="home-social-link" href={profile.links.github}>
                    GitHub
                    <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.3} />
                  </ExternalLink>
                  <ExternalLink className="home-social-link" href={profile.links.linkedin}>
                    LinkedIn
                    <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.3} />
                  </ExternalLink>
                </div>
              </div>

              <aside className="home-credibility-panel" aria-label="Credibility summary">
                <p className="body-copy home-summary-copy">{profile.summary}</p>
                <dl className="home-fact-list">
                  {profile.facts.map((fact, index) => {
                    const Icon = factIcons[index] ?? Crosshair;

                    return (
                      <div key={fact.label} className="home-fact-row">
                        <Icon aria-hidden="true" size={21} strokeWidth={2.2} />
                        <dt className="home-fact-label">{fact.label}</dt>
                        <dd className="home-fact-value">
                          {fact.label === "Tech" ? (
                            <TagList
                              items={fact.value.split(" · ")}
                              ariaLabel="Core technologies"
                            />
                          ) : (
                            fact.value
                          )}
                        </dd>
                      </div>
                    );
                  })}
                </dl>
              </aside>
            </div>
          </Container>
        </Section>

        <section id="selected-work" className="work-band">
          <Container>
            <div className="work-band-header">
              <p className="section-eyebrow">Selected Work</p>
              <Link className="section-text-link" href="/work">
                View all projects
                <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
              </Link>
            </div>
            <div className="home-project-grid">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </Container>
        </section>

        <section className="open-source-band" aria-label="Open source contributions">
          <Container>
            <div className="open-source-header">
              <SectionHeading
                label="Open Source Contributions"
                title="Merged work across data systems, Starknet tooling, and developer infrastructure."
              />
            </div>
            <div className="open-source-grid">
              {openSourceContributions.map((contribution) => (
                <ContributionCard contribution={contribution} key={contribution.project} />
              ))}
            </div>
          </Container>
        </section>

        <section className="proof-band" aria-label="Proof summary">
          <Container>
            <dl className="proof-grid">
              {proofBarItems.map((item, index) => {
                const Icon = proofIcons[index] ?? BriefcaseBusiness;

                return (
                  <div className="proof-item" key={item.label}>
                    <Icon aria-hidden="true" size={22} strokeWidth={2.1} />
                    <div>
                      <dt className="proof-label">{item.label}</dt>
                      <dd className="proof-value">{item.value}</dd>
                    </div>
                  </div>
                );
              })}
            </dl>
          </Container>
        </section>
      </div>

      <Section>
        <Container>
          <SectionHeading
            label="Technical Focus"
            title="Backend depth with tooling and blockchain systems."
          />
          <div className="home-focus-grid">
            {technicalFocusGroups.map((group) => (
              <div className="home-focus-card" key={group.title}>
                <h3 className="card-title">{group.title}</h3>
                <div className="home-focus-tags">
                  <TagList items={group.items} ariaLabel={`${group.title} skills`} />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="experience" muted>
        <Container>
          <div className="home-experience-grid">
            <SectionHeading
              label="Experience Snapshot"
              title="Professional delivery and independent technical work."
            />
            <div className="home-experience-list">
              {experienceSnapshot.map((item) => (
                <div className="home-experience-item" key={item.title}>
                  <h3 className="card-title">{item.title}</h3>
                  <p className="body-copy home-experience-copy">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <Section id="contact">
        <Container>
          <div className="home-contact-grid">
            <SectionHeading label="Contact" title="Remote engineering and focused consulting." />
            <div>
              <p className="page-description home-contact-description">{profile.contact}</p>
              <div className="home-contact-actions">
                <a className="button" href={`mailto:${profile.email}`}>
                  <Mail aria-hidden="true" size={17} strokeWidth={2.3} />
                  {profile.email}
                </a>
                <ExternalLink className="button button-secondary" href={profile.links.linkedin}>
                  <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.3} />
                  LinkedIn
                </ExternalLink>
                <ExternalLink className="button button-secondary" href={profile.links.github}>
                  <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.3} />
                  GitHub
                </ExternalLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function SectionHeading({
  label,
  title,
  description
}: {
  label: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="section-heading">
      <p className="section-eyebrow">{label}</p>
      <h2 className="section-title">{title}</h2>
      {description ? <p className="body-copy section-heading-description">{description}</p> : null}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="home-project-card avoid-break">
      <div className="home-project-card-header">
        <h3 className="card-title home-project-title">{project.title}</h3>
        <ProjectIcon icon={project.icon} size="home" />
      </div>
      <p className="body-copy home-project-summary">{project.valueStatement}</p>
      <p className="home-project-proof">Proof: {project.proof}</p>
      <div className="home-project-tags">
        <TagList items={project.tags.slice(0, 4)} ariaLabel={`${project.title} technologies`} />
      </div>
      <Link className="home-project-link" href={`/work/${project.slug}`}>
        View Project
        <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
      </Link>
    </article>
  );
}

function ContributionCard({ contribution }: { contribution: OpenSourceContribution }) {
  return (
    <article className="open-source-card avoid-break">
      <div className="open-source-card-header">
        <div>
          <p className="open-source-status">{contribution.status}</p>
          <h3 className="card-title open-source-title">{contribution.project}</h3>
        </div>
        <ExternalLink className="open-source-link" href={contribution.href}>
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.4} />
          <span className="sr-only">View {contribution.project}</span>
        </ExternalLink>
      </div>
      <p className="body-copy open-source-summary">{contribution.summary}</p>
    </article>
  );
}
