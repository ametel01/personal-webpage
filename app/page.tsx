import { ArrowRight, ArrowUpRight, Gamepad2, Mail, Network, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Container, ExternalLink, Section, TagList } from "@/components/primitives";
import {
  experienceSnapshot,
  profile,
  proofBarItems,
  technicalFocusGroups
} from "@/content/profile";
import { type Project, projects } from "@/content/projects";
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

const projectIcons = {
  ShieldCheck,
  Network,
  Gamepad2
} satisfies Record<Project["icon"], typeof ShieldCheck>;

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Static JSON-LD generated from local content.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c")
        }}
      />
      <Section className="pt-20 max-[720px]:pt-14">
        <Container>
          <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1.02fr)_minmax(320px,0.62fr)]">
            <div>
              <p className="text-[length:var(--text-sm)] font-bold uppercase text-[var(--color-text-muted)]">
                {profile.hero.eyebrow}
              </p>
              <p className="mt-5 text-[length:var(--text-lg)] font-semibold text-[var(--color-accent)]">
                {profile.hero.role}
              </p>
              <h1 className="text-balance mt-4 max-w-4xl text-[length:var(--text-5xl)] font-semibold leading-[var(--leading-tight)] text-[var(--color-text)] max-[900px]:text-[length:var(--text-4xl)] max-[520px]:text-[length:var(--text-3xl)]">
                {profile.hero.headline}
              </h1>
              <p className="mt-6 max-w-2xl text-[length:var(--text-lg)] leading-8 text-[var(--color-text-muted)]">
                {profile.hero.body}
              </p>
              <div className="mt-8 flex flex-wrap gap-3 max-[520px]:flex-col">
                <a className="button max-[520px]:w-full" href="#selected-work">
                  View Work
                  <ArrowRight aria-hidden="true" size={17} strokeWidth={2.3} />
                </a>
                <ExternalLink
                  className="button button-secondary max-[520px]:w-full"
                  href={profile.links.github}
                >
                  <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.3} />
                  GitHub
                </ExternalLink>
                <ExternalLink
                  className="button button-secondary max-[520px]:w-full"
                  href={profile.links.linkedin}
                >
                  <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.3} />
                  LinkedIn
                </ExternalLink>
              </div>
            </div>

            <aside
              className="border-l border-[var(--color-border)] pl-7 max-[1024px]:border-l-0 max-[1024px]:border-t max-[1024px]:pl-0 max-[1024px]:pt-7"
              aria-label="Credibility summary"
            >
              <p className="text-[length:var(--text-lg)] leading-8 text-[var(--color-text)]">
                {profile.summary}
              </p>
              <dl className="mt-8 grid gap-5 max-[720px]:gap-4">
                {profile.facts.map((fact) => (
                  <div key={fact.label} className="border-t border-[var(--color-border-soft)] pt-4">
                    <dt className="text-[length:var(--text-xs)] font-bold uppercase text-[var(--color-text-soft)]">
                      {fact.label}
                    </dt>
                    <dd className="mt-1 text-[length:var(--text-sm)] font-semibold text-[var(--color-text)]">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </aside>
          </div>
        </Container>
      </Section>

      <Section id="selected-work" muted>
        <Container>
          <SectionHeading
            label="Selected Work"
            title="Concrete systems, tooling, and infrastructure work."
            description="Three focused case studies with real artifacts and technical substance."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            label="Technical Focus"
            title="Backend depth with tooling and blockchain systems."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {technicalFocusGroups.map((group) => (
              <div
                className="border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]"
                key={group.title}
              >
                <h3 className="text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
                  {group.title}
                </h3>
                <div className="mt-5">
                  <TagList items={group.items} ariaLabel={`${group.title} skills`} />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section muted>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1fr]">
            <SectionHeading
              label="Experience Snapshot"
              title="Professional delivery and independent technical work."
            />
            <div className="grid gap-5">
              {experienceSnapshot.map((item) => (
                <div className="border-l border-[var(--color-border)] pl-6" key={item.title}>
                  <h3 className="text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[length:var(--text-md)] leading-7 text-[var(--color-text-muted)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <section className="bg-[var(--color-dark)] py-9 text-white" aria-label="Proof summary">
        <Container>
          <dl className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {proofBarItems.map((item) => (
              <div key={item.label}>
                <dt className="text-[length:var(--text-xs)] font-bold uppercase text-white/70">
                  {item.label}
                </dt>
                <dd className="mt-2 text-[length:var(--text-lg)] font-semibold">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <Section>
        <Container>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1fr]">
            <SectionHeading label="Contact" title="Remote engineering and focused consulting." />
            <div>
              <p className="max-w-2xl text-[length:var(--text-lg)] leading-8 text-[var(--color-text-muted)]">
                {profile.contact}
              </p>
              <div className="mt-7 flex flex-wrap gap-3 max-[520px]:flex-col">
                <a className="button max-[520px]:w-full" href={`mailto:${profile.email}`}>
                  <Mail aria-hidden="true" size={17} strokeWidth={2.3} />
                  {profile.email}
                </a>
                <ExternalLink
                  className="button button-secondary max-[520px]:w-full"
                  href={profile.links.linkedin}
                >
                  <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.3} />
                  LinkedIn
                </ExternalLink>
                <ExternalLink
                  className="button button-secondary max-[520px]:w-full"
                  href={profile.links.github}
                >
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
    <div className="max-w-3xl">
      <p className="text-[length:var(--text-sm)] font-bold uppercase text-[var(--color-text-muted)]">
        {label}
      </p>
      <h2 className="text-balance mt-3 text-[length:var(--text-3xl)] font-semibold leading-[var(--leading-snug)] text-[var(--color-text)] max-[720px]:text-[length:var(--text-2xl)]">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-[length:var(--text-md)] leading-7 text-[var(--color-text-muted)]">
          {description}
        </p>
      ) : null}
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const Icon = projectIcons[project.icon];

  return (
    <article className="flex min-h-[360px] flex-col border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]">
      <div className="flex items-center gap-3">
        <span className="flex size-10 items-center justify-center rounded-[6px] bg-[var(--color-primary-soft)] text-[var(--color-accent)]">
          <Icon aria-hidden="true" size={21} strokeWidth={2.2} />
        </span>
        <h3 className="text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
          {project.title}
        </h3>
      </div>
      <p className="mt-5 text-[length:var(--text-base)] leading-7 text-[var(--color-text-muted)]">
        {project.valueStatement}
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
        View Project
        <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
      </Link>
    </article>
  );
}
