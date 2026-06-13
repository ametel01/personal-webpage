import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  ClipboardList,
  Code2,
  Coins,
  Crosshair,
  GitBranch,
  Layers3,
  Mail,
  Network,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";
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

const personJsonLdScript = JSON.stringify(personJsonLd).replace(/</g, "\\u003c");

const projectIcons = {
  ShieldCheck,
  Network,
  ClipboardList,
  Coins
} satisfies Record<Project["icon"], typeof ShieldCheck>;

const factIcons = [Crosshair, Code2, Layers3, Sparkles] as const;
const proofIcons = [BriefcaseBusiness, Code2, GitBranch, UsersRound] as const;

export default function Home() {
  return (
    <main>
      <script type="application/ld+json">{personJsonLdScript}</script>
      <div className="intro-page">
        <Section className="hero-section">
          <Container>
            <div className="grid items-start gap-14 lg:grid-cols-[minmax(0,1.22fr)_minmax(430px,0.78fr)]">
              <div>
                <p className="text-[length:var(--text-sm)] font-bold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                  {profile.hero.role}
                </p>
                <h1 className="text-balance mt-5 max-w-4xl text-[length:var(--text-5xl)] font-bold leading-[var(--leading-tight)] text-[var(--color-text)] max-[900px]:text-[length:var(--text-4xl)] max-[520px]:text-[length:var(--text-3xl)]">
                  {profile.hero.headline}
                </h1>
                <p className="mt-5 max-w-[620px] text-[length:var(--text-md)] leading-7 text-[var(--color-text)]">
                  {profile.hero.body}
                </p>
                <div className="mt-6 flex flex-wrap items-center gap-8 max-[520px]:flex-col max-[520px]:items-stretch">
                  <a className="button max-[520px]:w-full" href="#selected-work">
                    View My Work
                    <ArrowRight aria-hidden="true" size={17} strokeWidth={2.3} />
                  </a>
                  <ExternalLink
                    className="inline-flex items-center gap-2 text-[length:var(--text-md)] font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] max-[520px]:justify-center"
                    href={profile.links.github}
                  >
                    GitHub
                    <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.3} />
                  </ExternalLink>
                  <ExternalLink
                    className="inline-flex items-center gap-2 text-[length:var(--text-md)] font-medium text-[var(--color-text)] hover:text-[var(--color-accent)] max-[520px]:justify-center"
                    href={profile.links.linkedin}
                  >
                    LinkedIn
                    <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.3} />
                  </ExternalLink>
                </div>
              </div>

              <aside
                className="border-l border-[var(--color-border)] pl-14 max-[1024px]:border-l-0 max-[1024px]:border-t max-[1024px]:pl-0 max-[1024px]:pt-8"
                aria-label="Credibility summary"
              >
                <p className="max-w-[560px] text-[length:var(--text-md)] leading-7 text-[var(--color-text)]">
                  {profile.summary}
                </p>
                <dl className="mt-7 grid gap-5 max-[720px]:gap-4">
                  {profile.facts.map((fact, index) => {
                    const Icon = factIcons[index] ?? Crosshair;

                    return (
                      <div
                        key={fact.label}
                        className="grid grid-cols-[24px_88px_1fr] items-center gap-4 max-[560px]:grid-cols-[24px_1fr] max-[560px]:gap-y-1"
                      >
                        <Icon
                          aria-hidden="true"
                          className="text-[var(--color-text)]"
                          size={21}
                          strokeWidth={2.2}
                        />
                        <dt className="text-[length:var(--text-sm)] font-bold text-[var(--color-text)]">
                          {fact.label}
                        </dt>
                        <dd className="text-[length:var(--text-sm)] leading-6 text-[var(--color-text)] max-[560px]:col-start-2">
                          {fact.value}
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
            <div className="flex items-center justify-between gap-6">
              <p className="text-[length:var(--text-sm)] font-bold uppercase tracking-[0.08em] text-[var(--color-text)]">
                Selected Work
              </p>
              <Link
                className="inline-flex items-center gap-2 text-[length:var(--text-sm)] font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
                href="/work"
              >
                View all projects
                <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
              </Link>
            </div>
            <div className="mt-4 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </Container>
        </section>

        <section className="proof-band" aria-label="Proof summary">
          <Container>
            <dl className="grid gap-0 md:grid-cols-2 xl:grid-cols-4">
              {proofBarItems.map((item, index) => {
                const Icon = proofIcons[index] ?? BriefcaseBusiness;

                return (
                  <div className="proof-item" key={item.label}>
                    <Icon aria-hidden="true" size={22} strokeWidth={2.1} />
                    <div>
                      <dt className="text-[length:var(--text-xs)] text-white/82">{item.label}</dt>
                      <dd className="mt-0.5 text-[length:var(--text-sm)] font-bold text-white">
                        {item.value}
                      </dd>
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

      <Section id="experience" muted>
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

      <Section id="contact">
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
    <article className="avoid-break flex min-h-[190px] flex-col rounded-[6px] border border-[var(--color-border)] bg-white p-3.5 shadow-[var(--shadow-card)] transition hover:-translate-y-0.5 hover:border-[var(--color-accent)]">
      <span className="flex size-9 items-center justify-center rounded-[6px] bg-[var(--color-primary)] text-white shadow-[var(--shadow-button)]">
        <Icon aria-hidden="true" size={17} strokeWidth={2.2} />
      </span>
      <h3 className="mt-2.5 text-[length:var(--text-md)] font-bold text-[var(--color-text)]">
        {project.title}
      </h3>
      <p className="mt-1.5 line-clamp-2 text-[length:var(--text-sm)] leading-5 text-[var(--color-text)]">
        {project.valueStatement}
      </p>
      <div className="mt-2.5">
        <TagList items={project.tags.slice(0, 4)} ariaLabel={`${project.title} technologies`} />
      </div>
      <Link
        className="mt-auto inline-flex items-center gap-2 pt-3 text-[length:var(--text-sm)] font-bold text-[var(--color-accent)] hover:text-[var(--color-accent-hover)]"
        href={`/work/${project.slug}`}
      >
        View Project
        <ArrowRight aria-hidden="true" size={16} strokeWidth={2.4} />
      </Link>
    </article>
  );
}
