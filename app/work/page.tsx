import {
  ArrowRight,
  ArrowUpRight,
  Braces,
  FileCheck2,
  PackageCheck,
  ShieldCheck
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, ExternalLink, Section, TagList } from "@/components/primitives";
import { StructuredData } from "@/components/structured-data";
import { type Project, projects } from "@/content/projects";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import { createWorkStructuredData } from "@/lib/structured-data";

export const metadata: Metadata = createPageMetadata({
  title: "Selected Work",
  description:
    "Selected engineering case studies by Alex Metelli across AI tooling, developer infrastructure, product systems, Starknet verification, and cross-chain infrastructure.",
  path: "/work"
});

const projectCategories = {
  agentreceipt: "Local-first AI tooling",
  "skills-doctor": "Agent tooling",
  ritualai: "AI workflows",
  scopepilot: "Product engineering",
  aggsandbox: "Cross-chain infrastructure",
  "voyager-verifier": "Developer tooling",
  "horizon-starknet": "Protocol engineering"
} satisfies Record<Project["slug"], string>;

const featuredEvidence = [
  {
    label: "Captured evidence",
    body: "Git, filesystem, instruction, and provider evidence are recorded together.",
    icon: FileCheck2
  },
  {
    label: "Replay contracts",
    body: "Signed receipts emit deterministic replay and focus JSON for review tools.",
    icon: Braces
  },
  {
    label: "Review safeguards",
    body: "Quality gates, policy checks, and ranked agent-review tasks stay linked to evidence.",
    icon: ShieldCheck
  }
] as const;

const workStructuredData = createWorkStructuredData(projects);

export default function WorkPage() {
  const featuredProject = projects[0];
  const supportingProjects = projects.slice(1);

  return (
    <main className="work-page" id="main-content" tabIndex={-1}>
      <script id="impeccable-work-direction-contract" type="application/json">
        {JSON.stringify({
          thesis:
            "A project index opens into a continuous evidence register, refusing the generic portfolio card grid.",
          ownWorld:
            "Warm paper, navy ink, editorial serif hierarchy, blue provenance contours, square plates, and fine registration rules inherited from Home and Writing.",
          story:
            "An engineering manager scans all seven systems, compares role, state, technology, and proof, then opens the case study that best demonstrates fit.",
          firstViewport:
            "A sticky thesis and seven-project index sit beside an expanded AgentReceipt specimen with a factual proof rail and case-study action.",
          form: "Vertical evidence register with featured proof specimen; seed 0d82c2f8.",
          finish:
            "unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md"
        })}
      </script>
      <StructuredData data={workStructuredData} />

      <Section className="work-register-section">
        <Container>
          <div className="work-register-layout">
            <WorkIndex />

            <div className="work-register">
              <header className="work-register-header">
                <span>Evidence register</span>
                <span>Seven case-study plates</span>
              </header>

              <FeaturedProject project={featuredProject} />

              <div className="work-register-list">
                {supportingProjects.map((project, index) => (
                  <ProjectRecord index={index + 2} key={project.slug} project={project} />
                ))}
              </div>

              <WorkClose />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function WorkIndex() {
  return (
    <aside className="work-index-rail">
      <header className="work-index-intro">
        <h1>Work that leaves an evidence trail.</h1>
        <p>
          Seven systems spanning local-first AI tooling, developer infrastructure, product
          workflows, and blockchain engineering.
        </p>
      </header>

      <nav className="work-project-index" aria-label="Case study index">
        <ol>
          {projects.map((project, index) => (
            <li key={project.slug}>
              <a className={index === 0 ? "is-featured" : undefined} href={`#${project.slug}`}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{project.title}</span>
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="work-registration-scale" aria-hidden="true">
        <span>AM—WORK—2026</span>
        <span className="work-scale-line" />
      </div>
    </aside>
  );
}

function FeaturedProject({ project }: { project: Project }) {
  return (
    <article className="work-featured-specimen" id={project.slug}>
      <span className="work-plate-number">01</span>

      <div className="work-featured-specimen-layout">
        <div className="work-featured-specimen-main">
          <WorkTraceLines />
          <div className="work-featured-copy">
            <p className="work-project-category">{projectCategories[project.slug]}</p>
            <h2>{project.title}</h2>
            <p className="work-featured-summary">{project.shortDescription}</p>

            <dl className="work-featured-facts">
              <div>
                <dt>Current state</dt>
                <dd>{project.metadata.currentState}</dd>
              </div>
              <div>
                <dt>Role</dt>
                <dd>{project.metadata.role}</dd>
              </div>
            </dl>

            <div className="work-featured-technologies">
              <p>Technologies</p>
              <TagList
                ariaLabel={`${project.title} technologies`}
                items={project.tags.slice(0, 5)}
              />
            </div>

            <Link className="work-case-study-link" href={`/work/${project.slug}`} prefetch={false}>
              Explore the {project.title} case study
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2.2} />
            </Link>
          </div>
        </div>

        <aside className="work-proof-rail" aria-labelledby="featured-proof-title">
          <h3 id="featured-proof-title">Evidence on record</h3>
          <ul>
            {featuredEvidence.map((item) => (
              <li key={item.label}>
                <item.icon aria-hidden="true" size={22} strokeWidth={1.75} />
                <span>
                  <strong>{item.label}</strong>
                  <span>{item.body}</span>
                </span>
              </li>
            ))}
            <li>
              <PackageCheck aria-hidden="true" size={22} strokeWidth={1.75} />
              <span>
                <strong>Public state</strong>
                <span>{project.metadata.currentState}</span>
              </span>
            </li>
          </ul>
        </aside>
      </div>

      <div className="work-measurement-rule" aria-hidden="true">
        <span>0</span>
        <span>297</span>
        <span>mm</span>
      </div>
    </article>
  );
}

function ProjectRecord({ index, project }: { index: number; project: Project }) {
  return (
    <article className="work-project-record" id={project.slug}>
      <span className="work-project-number">{String(index).padStart(2, "0")}</span>

      <div className="work-record-heading">
        <p className="work-project-category">{projectCategories[project.slug]}</p>
        <h2>{project.title}</h2>
        <p>{project.shortDescription}</p>
      </div>

      <div className="work-record-evidence">
        <dl>
          <div>
            <dt>Role</dt>
            <dd>{project.metadata.role}</dd>
          </div>
          <div>
            <dt>Current state</dt>
            <dd>{project.metadata.currentState}</dd>
          </div>
        </dl>

        <TagList ariaLabel={`${project.title} technologies`} items={project.tags.slice(0, 3)} />

        <p className="work-record-proof">
          <span>Proof</span>
          {project.proof}
        </p>
      </div>

      <Link className="work-record-link" href={`/work/${project.slug}`} prefetch={false}>
        <span>Explore the {project.title} case study</span>
        <ArrowRight aria-hidden="true" size={21} strokeWidth={1.9} />
      </Link>
    </article>
  );
}

function WorkClose() {
  return (
    <section className="work-close" aria-label="More ways to inspect Alex's work">
      <ExternalLink className="work-close-link" href={site.githubUrl}>
        <span>
          <strong className="work-close-title">Continue through the source.</strong>
          <span className="work-close-description">
            Browse public repositories, experiments, and contributions on GitHub.
          </span>
        </span>
        <span className="work-close-action">
          Browse Alex's GitHub repositories
          <ArrowUpRight aria-hidden="true" size={18} strokeWidth={2.1} />
        </span>
      </ExternalLink>

      <Link className="work-close-link" href={site.resumePath}>
        <span>
          <strong className="work-close-title">Place the work in context.</strong>
          <span className="work-close-description">
            Review professional experience, capabilities, and availability.
          </span>
        </span>
        <span className="work-close-action">
          Review Alex's engineering resume
          <ArrowRight aria-hidden="true" size={18} strokeWidth={2.1} />
        </span>
      </Link>
    </section>
  );
}

function WorkTraceLines() {
  return (
    <svg aria-hidden="true" className="work-specimen-traces" viewBox="0 0 320 560">
      <path d="M52 0c98 92 98 176 16 258-82 83-82 168 16 302" />
      <path d="M86 0c92 94 92 178 14 258-78 81-78 166 16 302" />
      <path d="M120 0c86 96 86 180 12 258-74 79-74 164 16 302" />
      <path d="M154 0c80 98 80 182 10 258-70 77-70 162 16 302" />
      <path d="M188 0c74 100 74 184 8 258-66 75-66 160 16 302" />
      <path d="M222 0c68 102 68 186 6 258-62 73-62 158 16 302" />
    </svg>
  );
}
