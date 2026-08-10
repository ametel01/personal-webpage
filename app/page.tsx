import { ArrowRight, ArrowUpRight, Mail } from "lucide-react";
import Link from "next/link";
import { Container, ExternalLink, Section } from "@/components/primitives";
import { StructuredData } from "@/components/structured-data";
import { experienceSnapshot, profile } from "@/content/profile";
import { openSourceContributions, type Project, projects } from "@/content/projects";
import { writingArticles } from "@/content/writing";
import { homeMetadata } from "@/lib/metadata";
import { createHomepageStructuredData } from "@/lib/structured-data";

export const metadata = homeMetadata;

const homepageStructuredData = createHomepageStructuredData();

const featuredSlugs = new Set<Project["slug"]>([
  "agentreceipt",
  "scopepilot",
  "aggsandbox",
  "voyager-verifier"
]);

const featuredProjects = projects.filter((project) => featuredSlugs.has(project.slug));
const featuredProject = featuredProjects[0];
const supportingProjects = featuredProjects.slice(1);

const engineeringIndex = [
  {
    title: "Developer infrastructure",
    description: "Local-first CLIs, automation, and agent workflows."
  },
  {
    title: "Verification systems",
    description: "Contract artifacts, audit trails, and reproducible evidence."
  },
  {
    title: "Blockchain infrastructure",
    description: "Starknet tooling, protocol systems, and cross-chain work."
  },
  {
    title: "Product workflows",
    description: "Proposal, approval, revision, and delivery systems."
  }
] as const;

export default function Home() {
  return (
    <main className="home-page" id="main-content" tabIndex={-1}>
      <script id="impeccable-home-direction-contract" type="application/json">
        {JSON.stringify({
          thesis:
            "One inspectable case file opens into a structured evidence ledger, refusing the generic portfolio card grid.",
          ownWorld:
            "Warm paper, navy ink, editorial serif hierarchy, blue provenance paths, square regions, and hairline rules inherited from writing.",
          story:
            "An engineering manager understands the position, inspects one substantial project, then follows adjacent project, contribution, writing, and experience evidence.",
          firstViewport:
            "A concise engineering thesis and two actions sit above a two-thirds AgentReceipt case file bridged to a four-waypoint engineering index.",
          form: "Featured case file; approved comp home-proof-ledger-b; seed a1f31ee8.",
          finish:
            "unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md"
        })}
      </script>
      <StructuredData data={homepageStructuredData} />

      <Section className="home-hero-section">
        <Container>
          <header className="home-hero">
            <h1 className="home-hero-title">
              Backend and developer-infrastructure engineering, backed by inspectable work.
            </h1>
            <p className="home-hero-description">{profile.hero.body}</p>
            <div className="home-hero-actions">
              <a className="button home-primary-action" href="#selected-work">
                Review selected work
                <ArrowRight aria-hidden="true" size={17} strokeWidth={2.3} />
              </a>
              <Link className="home-resume-link" href="/resume">
                Review engineering experience
                <ArrowRight aria-hidden="true" size={16} strokeWidth={2.3} />
              </Link>
            </div>
          </header>

          <div className="home-evidence-atlas" id="selected-work">
            <FeaturedProject project={featuredProject} />
            <EngineeringIndex />
          </div>
        </Container>
      </Section>

      <section className="work-band" aria-labelledby="selected-work-title">
        <Container>
          <div className="work-band-header">
            <h2 className="section-title" id="selected-work-title">
              Selected work
            </h2>
            <Link className="section-text-link" href="/work">
              Browse all 7 engineering case studies
              <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
            </Link>
          </div>
          <div className="home-project-grid">
            {supportingProjects.map((project) => (
              <ProjectRow key={project.slug} project={project} />
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
              Merged contributions to data systems and developer infrastructure.
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

      <Section className="home-proof-section">
        <Container>
          <div className="home-proof-bridge">
            <section className="home-writing-bridge" aria-labelledby="technical-writing-title">
              <div className="home-writing-header">
                <h2 id="technical-writing-title">Technical writing</h2>
                <Link href="/writing">
                  Browse the writing atlas
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={2.2} />
                </Link>
              </div>
              <p className="home-writing-introduction">
                Practical guides to verification, agent workflows, developer infrastructure, and
                product systems.
              </p>
              <ul className="home-writing-list">
                {writingArticles.map((article) => (
                  <li key={article.slug}>
                    <Link href={`/writing/${article.slug}`}>
                      <span>{article.topic}</span>
                      <strong>{article.title}</strong>
                      <ArrowRight aria-hidden="true" size={17} strokeWidth={2.1} />
                    </Link>
                  </li>
                ))}
              </ul>
              <HomeTraceLines className="home-writing-traces" />
            </section>

            <section className="home-experience" aria-labelledby="experience-title">
              <div className="home-section-header">
                <h2 id="experience-title">Engineering experience</h2>
                <Link className="section-text-link" href="/resume" prefetch={false}>
                  Review the engineering resume
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
                </Link>
              </div>
              <div className="home-experience-list">
                {experienceSnapshot.map((item) => (
                  <article className="home-experience-item" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </Container>
      </Section>

      <Section className="home-contact-section" id="contact" muted>
        <Container>
          <div className="home-contact-grid">
            <h2>Discuss a role or consulting project.</h2>
            <div>
              <p className="home-contact-description">{profile.contact}</p>
              <a className="button home-contact-action" href={`mailto:${profile.email}`}>
                <Mail aria-hidden="true" size={17} strokeWidth={2.3} />
                Email Alex
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="home-featured-project">
      <Link className="home-featured-link" href={`/work/${project.slug}`} prefetch={false}>
        <HomeTraceLines className="home-featured-traces" />
        <div className="home-featured-copy">
          <h2>{project.title}</h2>
          <p className="home-featured-label">Featured case study · Local-first AI tooling</p>
          <p className="home-featured-summary">{project.shortDescription}</p>
          <p className="home-featured-state">{project.metadata.currentState}</p>
          <span className="home-featured-action">
            Explore the {project.title} case study
            <ArrowRight aria-hidden="true" size={18} strokeWidth={2.2} />
          </span>
        </div>
      </Link>
    </article>
  );
}

function EngineeringIndex() {
  return (
    <aside className="home-engineering-index" aria-labelledby="engineering-index-title">
      <div className="home-engineering-index-heading">
        <h2 id="engineering-index-title">Engineering index</h2>
        <p>Four connected areas of practice, each backed by work on this site.</p>
      </div>
      <span aria-hidden="true" className="home-index-bridge" />
      <ol className="home-engineering-index-list">
        {engineeringIndex.map((item) => (
          <li key={item.title}>
            <span className="home-engineering-index-title">{item.title}</span>
            <span className="home-engineering-index-description">{item.description}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function ProjectRow({ project }: { project: Project }) {
  return (
    <article className="home-project-row">
      <Link className="home-project-card" href={`/work/${project.slug}`} prefetch={false}>
        <div className="home-project-row-title">
          <h3>{project.title}</h3>
          <p>{project.tags.slice(0, 2).join(" · ")}</p>
        </div>
        <p className="home-project-summary">{project.valueStatement}</p>
        <div className="home-project-meta">
          <p>{project.metadata.currentState}</p>
          <span>{project.tags.slice(0, 3).join(" · ")}</span>
        </div>
        <ArrowRight aria-hidden="true" className="home-project-arrow" size={25} strokeWidth={1.8} />
      </Link>
    </article>
  );
}

function HomeTraceLines({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" className={className} focusable="false" viewBox="0 0 420 520">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <path d="M76-24c68 58 95 96 83 147-13 58-83 67-88 130-5 61 57 86 52 146-4 48-47 77-53 125-4 31 6 58 29 79" />
        <path d="M105-24c64 55 89 93 77 143-13 55-79 69-82 130-3 57 55 83 51 142-3 50-43 80-47 127-3 32 9 57 31 78" />
        <path d="M134-24c60 52 84 91 72 139-13 53-74 70-76 130-2 53 53 80 50 138-2 52-39 83-41 130-1 31 12 56 34 77" />
        <path d="M163-24c57 50 79 89 67 135-13 51-69 72-70 130-1 49 51 77 49 134-1 54-35 87-35 134 0 31 15 55 37 75" />
        <path d="M192-24c53 47 73 87 62 131-13 49-65 74-64 130 1 46 49 74 48 130 0 56-31 90-29 137 1 31 17 54 39 74" />
        <path d="M221-24c49 45 68 84 57 127-13 47-60 76-58 130 2 43 47 71 47 126 1 58-27 94-23 141 3 30 20 53 42 72" />
        <path d="M250-24c45 42 63 82 52 123-13 45-55 78-52 130 3 39 45 68 46 122 2 61-23 98-17 144 4 30 23 52 45 70" />
        <path d="M279-24c41 39 57 79 47 119-13 43-51 80-46 130 4 36 43 65 45 118 3 63-19 101-11 147 5 30 25 51 47 68" />
        <path d="M308-24c37 37 52 77 42 115-13 41-46 82-40 130 5 33 41 62 44 114 4 65-15 105-5 151 6 29 28 49 50 66" />
        <path d="M337-24c33 34 47 74 37 111-13 39-41 84-34 130 6 29 39 59 43 110 5 67-11 109 1 154 8 29 31 48 53 64" />
      </g>
    </svg>
  );
}
