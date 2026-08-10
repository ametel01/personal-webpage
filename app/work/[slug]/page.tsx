import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Container, ExternalLink, Section, TagList } from "@/components/primitives";
import { ProjectIcon } from "@/components/project-icon";
import { StructuredData } from "@/components/structured-data";
import { getProject, isProjectSlug, type Project, projectSlugs } from "@/content/projects";
import { getAdjacentProjects, getRelatedArticlesForProject } from "@/content/relationships";
import { createPageMetadata } from "@/lib/metadata";
import { createProjectStructuredData } from "@/lib/structured-data";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return projectSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!isProjectSlug(slug)) {
    return {
      title: "Project Not Found"
    };
  }

  const project = getProject(slug);

  if (!project) {
    return {
      title: "Project Not Found"
    };
  }

  return createPageMetadata({
    title: project.title,
    description: project.shortDescription,
    path: `/work/${project.slug}`
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  if (!isProjectSlug(slug)) {
    notFound();
  }

  const project = getProject(slug);

  if (!project) {
    notFound();
  }

  const relatedArticles = getRelatedArticlesForProject(project.slug);
  const adjacentProjects = getAdjacentProjects(project.slug);

  return (
    <main className="project-detail-page" id="main-content" tabIndex={-1}>
      <StructuredData data={createProjectStructuredData(project)} />
      <article>
        <Section className="project-detail-hero-section">
          <Container>
            <Link className="case-back-link" href="/work">
              <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.4} />
              Work
            </Link>
            <header className="page-header project-detail-header">
              <div>
                <h1 className="hero-title page-title">{project.title}</h1>
                <p className="page-description">{project.shortDescription}</p>
              </div>
              <ProjectIcon className="project-detail-logo" icon={project.icon} size="large" />
            </header>

            <dl className="case-metadata-grid">
              <MetadataItem label="Role" value={project.metadata.role} />
              <MetadataItem label="Stack">
                <TagList items={project.metadata.stack} ariaLabel={`${project.title} stack`} />
              </MetadataItem>
              <MetadataItem label="Current state" value={project.metadata.currentState} />
            </dl>
          </Container>
        </Section>

        <Section className="case-body-section" muted>
          <Container>
            <div className="case-study-layout">
              <nav aria-label={`${project.title} case study sections`}>
                <p className="case-study-nav-title">In this case study</p>
                <ol className="case-study-nav-list">
                  {caseStudySections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`}>{section.label}</a>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="case-study-content">
                <CaseSection id="definition" title="One-sentence definition">
                  <p>{project.caseStudy.definition}</p>
                </CaseSection>
                <CaseSection id="problem" title="Problem being solved">
                  <p>{project.caseStudy.problem}</p>
                </CaseSection>
                <CaseSection id="role" title="My specific role">
                  <p>{project.caseStudy.role}</p>
                </CaseSection>
                <CaseSection id="architecture" title="Architecture or implementation">
                  <BulletList items={project.caseStudy.architecture} />
                  {project.caseStudy.implementationExample ? (
                    <figure className="case-implementation-example">
                      <figcaption>{project.caseStudy.implementationExample.label}</figcaption>
                      <pre>
                        <code>{project.caseStudy.implementationExample.code}</code>
                      </pre>
                    </figure>
                  ) : null}
                </CaseSection>
                <CaseSection id="design-decisions" title="Important design decisions">
                  <BulletList items={project.caseStudy.decisions} />
                </CaseSection>
                <CaseSection id="hard-problems" title="Hard technical problems">
                  <BulletList items={project.caseStudy.hardProblems} />
                </CaseSection>
                <CaseSection id="tradeoffs" title="Tradeoffs and limitations">
                  <BulletList items={project.caseStudy.tradeoffs} />
                </CaseSection>
                <CaseSection id="current-state" title="Current state">
                  <p>{project.caseStudy.currentState}</p>
                </CaseSection>
                <CaseSection id="evidence" title="Verifiable evidence">
                  <EvidenceList links={project.caseStudy.evidence} />
                </CaseSection>
                <CaseSection id="project-documentation" title="Project documentation">
                  <EvidenceList
                    emptyMessage="No separate public project documentation is available."
                    links={project.caseStudy.relatedWriting}
                  />
                </CaseSection>
                <CaseSection id="last-updated" title="Last-updated date">
                  <p>
                    <time dateTime={project.caseStudy.lastUpdated}>
                      {formatCaseStudyDate(project.caseStudy.lastUpdated)}
                    </time>
                  </p>
                </CaseSection>
                <RelatedWork
                  adjacentProjects={adjacentProjects}
                  project={project}
                  relatedArticles={relatedArticles}
                />
              </div>
            </div>
          </Container>
        </Section>
      </article>
    </main>
  );
}

const caseStudySections = [
  {
    id: "definition",
    label: "Definition"
  },
  {
    id: "problem",
    label: "Problem being solved"
  },
  {
    id: "role",
    label: "My specific role"
  },
  {
    id: "architecture",
    label: "Architecture or implementation"
  },
  {
    id: "design-decisions",
    label: "Important design decisions"
  },
  {
    id: "hard-problems",
    label: "Hard technical problems"
  },
  {
    id: "tradeoffs",
    label: "Tradeoffs and limitations"
  },
  {
    id: "current-state",
    label: "Current state"
  },
  {
    id: "evidence",
    label: "Verifiable evidence"
  },
  {
    id: "project-documentation",
    label: "Project documentation"
  },
  {
    id: "last-updated",
    label: "Last-updated date"
  },
  {
    id: "related-work",
    label: "Related work"
  }
] as const;

function MetadataItem({
  label,
  value,
  children
}: {
  label: string;
  value?: string;
  children?: ReactNode;
}) {
  return (
    <div className="case-metadata-card">
      <dt className="case-metadata-label">{label}</dt>
      <dd className="case-metadata-value">{children ?? value}</dd>
    </div>
  );
}

function CaseSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="body-copy case-section" id={id}>
      <h2 className="card-title">{title}</h2>
      <div className="case-section-body">{children}</div>
    </section>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="case-bullet-list">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function EvidenceList({
  links,
  emptyMessage = "Evidence links are omitted until there is a defensible public artifact."
}: {
  links: readonly { label: string; href: string }[];
  emptyMessage?: string;
}) {
  if (links.length === 0) {
    return <p>{emptyMessage}</p>;
  }

  return (
    <ul className="case-evidence-list">
      {links.map((link) => (
        <li key={link.href}>
          <ExternalLink className="case-evidence-link" href={link.href}>
            {link.label}
            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.4} />
          </ExternalLink>
        </li>
      ))}
    </ul>
  );
}

function RelatedWork({
  adjacentProjects,
  project,
  relatedArticles
}: {
  adjacentProjects: readonly Project[];
  project: Project;
  relatedArticles: ReturnType<typeof getRelatedArticlesForProject>;
}) {
  return (
    <aside className="case-related-work" id="related-work" aria-labelledby="related-work-title">
      <header>
        <h2 id="related-work-title">Related work</h2>
        <p>
          Continue from {project.title} into the technical guides and adjacent systems that share
          its engineering concerns.
        </p>
      </header>

      <div className="case-related-work-grid">
        <section aria-labelledby="related-articles-title">
          <h3 id="related-articles-title">Relevant technical articles</h3>
          <ul>
            {relatedArticles.map((article) => (
              <li key={article.slug}>
                <Link href={`/writing/${article.slug}`}>
                  <span>{article.topic}</span>
                  <strong>{article.title}</strong>
                  <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="adjacent-projects-title">
          <h3 id="adjacent-projects-title">Adjacent case studies</h3>
          <ul>
            {adjacentProjects.map((adjacentProject) => (
              <li key={adjacentProject.slug}>
                <Link href={`/work/${adjacentProject.slug}`} prefetch={false}>
                  <span>{adjacentProject.metadata.role}</span>
                  <strong>{adjacentProject.title}</strong>
                  <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </aside>
  );
}

const caseStudyDateFormatter = new Intl.DateTimeFormat("en", {
  dateStyle: "long",
  timeZone: "UTC"
});

function formatCaseStudyDate(date: string) {
  return caseStudyDateFormatter.format(new Date(`${date}T00:00:00Z`));
}
