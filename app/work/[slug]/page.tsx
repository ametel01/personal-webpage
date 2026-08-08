import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Container, ExternalLink, Section, TagList } from "@/components/primitives";
import { ProjectIcon } from "@/components/project-icon";
import { StructuredData } from "@/components/structured-data";
import { getProject, isProjectSlug, projectSlugs } from "@/content/projects";
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

  return (
    <main id="main-content" tabIndex={-1}>
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
                <p className="page-eyebrow project-detail-eyebrow">Case Study</p>
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
                <ol className="case-study-nav-list">
                  {caseStudySections.map((section) => (
                    <li key={section.id}>
                      <a href={`#${section.id}`}>{section.label}</a>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="case-study-content">
                <CaseSection id="overview" title="Overview">
                  <p>{project.caseStudy.overview}</p>
                </CaseSection>
                <CaseSection id="problem" title="Problem">
                  <p>{project.caseStudy.problem}</p>
                </CaseSection>
                <CaseSection id="role" title="My role">
                  <p>{project.caseStudy.role}</p>
                </CaseSection>
                <CaseSection id="technical-details" title="Technical details">
                  <BulletList items={project.caseStudy.technicalDetails} />
                </CaseSection>
                <CaseSection id="tradeoffs" title="Hard parts and tradeoffs">
                  <BulletList items={project.caseStudy.tradeoffs} />
                </CaseSection>
                <CaseSection id="current-state" title="Current state">
                  <p>{project.caseStudy.currentState}</p>
                </CaseSection>
                <CaseSection id="evidence" title="Evidence">
                  {project.caseStudy.evidence.length > 0 ? (
                    <ul className="case-evidence-list">
                      {project.caseStudy.evidence.map((link) => (
                        <li key={link.href}>
                          <ExternalLink className="case-evidence-link" href={link.href}>
                            {link.label}
                            <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.4} />
                          </ExternalLink>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Evidence links are omitted until there is a defensible public artifact.</p>
                  )}
                </CaseSection>
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
    id: "overview",
    label: "Overview"
  },
  {
    id: "problem",
    label: "Problem"
  },
  {
    id: "role",
    label: "My role"
  },
  {
    id: "technical-details",
    label: "Technical details"
  },
  {
    id: "tradeoffs",
    label: "Hard parts and tradeoffs"
  },
  {
    id: "current-state",
    label: "Current state"
  },
  {
    id: "evidence",
    label: "Evidence"
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
      {children}
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
