import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import { Container, ExternalLink, Section } from "@/components/primitives";
import { ProjectIcon } from "@/components/project-icon";
import { experienceSnapshot, profile } from "@/content/profile";
import { openSourceContributions, type Project, projects } from "@/content/projects";
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

const featuredSlugs = new Set<Project["slug"]>([
  "agentreceipt",
  "scopepilot",
  "aggsandbox",
  "voyager-verifier"
]);

const featuredProjects = projects.filter((project) => featuredSlugs.has(project.slug));

export default function Home() {
  return (
    <main>
      <script type="application/ld+json">{personJsonLdScript}</script>

      <Section className="hero-section">
        <Container>
          <div className="home-hero">
            <h1 className="hero-title home-hero-title">{profile.hero.headline}</h1>
            <p className="page-description home-hero-description">{profile.hero.body}</p>
            <div className="home-hero-actions">
              <a className="button" href="#selected-work">
                Explore selected work
                <ArrowRight aria-hidden="true" size={17} strokeWidth={2.3} />
              </a>
              <Link className="home-resume-link" href="/resume">
                Read resume
                <ArrowRight aria-hidden="true" size={16} strokeWidth={2.3} />
              </Link>
            </div>
          </div>
        </Container>
      </Section>

      <section id="selected-work" className="work-band">
        <Container>
          <div className="work-band-header">
            <h2 className="section-title">Selected work</h2>
            <Link className="section-text-link" href="/work">
              View all 7 case studies
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
            </Link>
          </div>
          <div className="home-project-grid">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </section>

      <section className="open-source-band" aria-labelledby="open-source-title">
        <Container>
          <div className="open-source-header">
            <h2 className="section-title" id="open-source-title">
              Open-source contributions
            </h2>
            <p className="body-copy">
              Merged work across data systems and developer infrastructure.
            </p>
          </div>
          <ul className="open-source-list">
            {openSourceContributions.map((contribution) => (
              <li key={contribution.project}>
                <ExternalLink className="open-source-row" href={contribution.href}>
                  <span className="open-source-title">{contribution.project}</span>
                  <span className="open-source-summary">{contribution.summary}</span>
                  <span className="open-source-action">
                    <span>{contribution.status ?? "View contribution"}</span>
                    <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.4} />
                  </span>
                </ExternalLink>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Section id="experience">
        <Container>
          <div className="home-section-header">
            <h2 className="section-title">Professional and independent delivery</h2>
            <Link className="section-text-link" href="/resume">
              Read full resume
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
            </Link>
          </div>
          <div className="home-experience-list">
            {experienceSnapshot.map((item) => (
              <article className="home-experience-item" key={item.title}>
                <h3 className="card-title">{item.title}</h3>
                <p className="body-copy home-experience-copy">{item.body}</p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <Section id="contact" muted>
        <Container>
          <div className="home-contact-grid">
            <h2 className="section-title">Remote engineering and focused consulting</h2>
            <div>
              <p className="page-description home-contact-description">{profile.contact}</p>
              <a className="button home-contact-action" href={`mailto:${profile.email}`}>
                <Mail aria-hidden="true" size={17} strokeWidth={2.3} />
                {profile.email}
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="avoid-break">
      <Link className="home-project-card" href={`/work/${project.slug}`}>
        <div className="home-project-card-header">
          <ProjectIcon icon={project.icon} size="home" />
          <h3 className="card-title home-project-title">{project.title}</h3>
        </div>
        <p className="body-copy home-project-summary">{project.valueStatement}</p>
        <p className="home-project-state">{project.metadata.currentState}</p>
        <p className="home-project-tags">{project.tags.slice(0, 3).join(" · ")}</p>
        <span className="home-project-link">
          {project.title} case study
          <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
        </span>
      </Link>
    </article>
  );
}
