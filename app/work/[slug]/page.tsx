import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Container, ExternalLink, Section, TagList } from "@/components/primitives";
import { getProject, isProjectSlug, projectSlugs } from "@/content/projects";
import { createPageMetadata } from "@/lib/metadata";

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
    <main>
      <article>
        <Section>
          <Container>
            <Link
              className="mb-8 inline-flex items-center gap-2 text-[length:var(--text-sm)] font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              href="/work"
            >
              <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.4} />
              Work
            </Link>
            <header className="max-w-4xl">
              <p className="text-[length:var(--text-sm)] font-bold uppercase text-[var(--color-text-muted)]">
                Case Study
              </p>
              <h1 className="text-balance mt-4 text-[length:var(--text-5xl)] font-semibold leading-[var(--leading-tight)] text-[var(--color-text)] max-[900px]:text-[length:var(--text-4xl)] max-[520px]:text-[length:var(--text-3xl)]">
                {project.title}
              </h1>
              <p className="mt-6 text-[length:var(--text-lg)] leading-8 text-[var(--color-text-muted)]">
                {project.shortDescription}
              </p>
            </header>

            <dl className="mt-10 grid gap-4 md:grid-cols-3">
              <MetadataItem label="Role" value={project.metadata.role} />
              <MetadataItem label="Stack">
                <TagList items={project.metadata.stack} ariaLabel={`${project.title} stack`} />
              </MetadataItem>
              <MetadataItem label="Current state" value={project.metadata.currentState} />
            </dl>
          </Container>
        </Section>

        <Section muted>
          <Container>
            <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)]">
              <nav aria-label={`${project.title} case study sections`}>
                <ol className="sticky top-24 grid gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-text-muted)]">
                  {caseStudySections.map((section) => (
                    <li key={section.id}>
                      <a className="hover:text-[var(--color-accent)]" href={`#${section.id}`}>
                        {section.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
              <div className="grid gap-10">
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
                    <ul className="grid gap-3">
                      {project.caseStudy.evidence.map((link) => (
                        <li key={link.href}>
                          <ExternalLink
                            className="inline-flex items-center gap-2 font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                            href={link.href}
                          >
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
    <div className="border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]">
      <dt className="text-[length:var(--text-xs)] font-bold uppercase text-[var(--color-text-soft)]">
        {label}
      </dt>
      <dd className="mt-2 text-[length:var(--text-sm)] font-semibold leading-6 text-[var(--color-text)]">
        {children ?? value}
      </dd>
    </div>
  );
}

function CaseSection({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section
      className="border-l border-[var(--color-border)] py-1 pl-6 text-[length:var(--text-md)] leading-8 text-[var(--color-text-muted)]"
      id={id}
    >
      <h2 className="mb-3 text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li className="pl-4 before:mr-3 before:content-['-']" key={item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
