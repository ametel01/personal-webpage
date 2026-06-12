import { ArrowRight, ArrowUpRight, Gamepad2, Network, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, ExternalLink, PageHeader, Section, TagList } from "@/components/primitives";
import { type Project, projects } from "@/content/projects";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Selected Work",
  description:
    "Selected engineering case studies by Alex Metelli across Starknet verification, cross-chain infrastructure, and on-chain game systems."
};

const projectIcons = {
  ShieldCheck,
  Network,
  Gamepad2
} satisfies Record<Project["icon"], typeof ShieldCheck>;

export default function WorkPage() {
  return (
    <main>
      <Section>
        <Container>
          <PageHeader
            eyebrow="Selected Work"
            title="Focused case studies with concrete engineering evidence."
            description="A curated set of backend, tooling, and blockchain infrastructure projects. Each page covers the problem, role, technical details, tradeoffs, current state, and evidence."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article
                className="flex min-h-[380px] flex-col border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]"
                key={project.slug}
              >
                <ProjectIcon project={project} />
                <h2 className="mt-5 text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
                  {project.title}
                </h2>
                <p className="mt-4 text-[length:var(--text-base)] leading-7 text-[var(--color-text-muted)]">
                  {project.shortDescription}
                </p>
                <p className="mt-4 border-l border-[var(--color-border)] pl-4 text-[length:var(--text-sm)] font-semibold leading-6 text-[var(--color-text)]">
                  Proof: {project.proof}
                </p>
                <div className="mt-5">
                  <TagList items={project.tags} ariaLabel={`${project.title} technologies`} />
                </div>
                <Link
                  className="mt-auto inline-flex items-center gap-2 pt-7 text-[length:var(--text-sm)] font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                  href={`/work/${project.slug}`}
                >
                  View Case Study
                  <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
                </Link>
              </article>
            ))}
          </div>
          <div className="mt-12 border-t border-[var(--color-border)] pt-8">
            <ExternalLink
              className="inline-flex items-center gap-2 text-[length:var(--text-sm)] font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
              href={site.githubUrl}
            >
              Browse broader GitHub archive
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.4} />
            </ExternalLink>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function ProjectIcon({ project }: { project: Project }) {
  const Icon = projectIcons[project.icon];

  return (
    <span className="flex size-11 items-center justify-center rounded-[6px] bg-[var(--color-primary-soft)] text-[var(--color-accent)]">
      <Icon aria-hidden="true" size={22} strokeWidth={2.2} />
    </span>
  );
}
