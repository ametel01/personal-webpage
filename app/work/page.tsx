import {
  ArrowRight,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarDays,
  ClipboardList,
  CodeXml,
  Database,
  FileText,
  Network,
  ShieldCheck,
  Star
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, ExternalLink, Section, TagList } from "@/components/primitives";
import { ProjectIcon } from "@/components/project-icon";
import { type Project, projects } from "@/content/projects";
import { createPageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = createPageMetadata({
  title: "Selected Work",
  description:
    "Selected engineering case studies by Alex Metelli across AI tooling, developer infrastructure, product systems, Starknet verification, and cross-chain infrastructure.",
  path: "/work"
});

const projectCategories = {
  agentreceipt: "AI Tooling",
  "skills-doctor": "Agent Tooling",
  ritualai: "AI Workflows",
  scopepilot: "Product Engineering",
  aggsandbox: "Cross-chain Infra",
  "voyager-verifier": "Developer Tooling",
  "horizon-starknet": "DeFi"
} satisfies Record<Project["slug"], string>;

const metrics = [
  {
    value: "7",
    label: "Case studies",
    icon: ClipboardList
  },
  {
    value: "5+",
    label: "Years experience",
    icon: CalendarDays
  },
  {
    value: "Backend + infra",
    label: "Core focus",
    icon: Database
  },
  {
    value: "Blockchain + AI tooling",
    label: "Domain expertise",
    icon: Network
  }
] as const;

export default function WorkPage() {
  const featuredProject = projects[0];
  const supportingProjects = projects.slice(1);

  return (
    <main className="work-page">
      <Section className="work-showcase-section">
        <Container>
          <WorkHero />
          <MetricStrip />
          <FeaturedProjectCard project={featuredProject} />
          <div className="work-card-grid">
            {supportingProjects.map((project) => (
              <SupportingProjectCard key={project.slug} project={project} />
            ))}
          </div>
          <WorkCallout />
        </Container>
      </Section>
    </main>
  );
}

function WorkHero() {
  return (
    <header className="work-hero">
      <div className="work-hero-copy">
        <p className="work-eyebrow">Selected Work</p>
        <h1 className="hero-title">Engineering case studies with real technical depth.</h1>
        <p>
          AI tooling, backend infrastructure, developer tooling, blockchain systems, and product
          engineering projects with concrete evidence, tradeoffs, and outcomes.
        </p>
      </div>
      <TechnicalHeroVisual />
    </header>
  );
}

function TechnicalHeroVisual() {
  return (
    <div className="work-visual" aria-hidden="true">
      <svg className="work-blueprint" viewBox="0 0 620 360" focusable="false">
        <title>Decorative technical blueprint illustration</title>
        <defs>
          <linearGradient id="work-cube-top" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--work-cube-top-start)" />
            <stop offset="1" stopColor="var(--work-cube-top-end)" />
          </linearGradient>
          <linearGradient id="work-cube-side" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--work-cube-side-start)" />
            <stop offset="1" stopColor="var(--work-cube-side-end)" />
          </linearGradient>
          <filter id="work-soft-shadow" x="-30%" y="-30%" width="160%" height="170%">
            <feDropShadow
              dx="0"
              dy="22"
              stdDeviation="18"
              floodColor="var(--work-shadow-blue)"
              floodOpacity="0.2"
            />
          </filter>
        </defs>

        <g className="work-map-lines">
          <path d="M58 158 210 70 412 176 260 272Z" />
          <path d="M118 196 270 108 472 214 320 310Z" />
          <path d="M170 104 376 214" />
          <path d="M86 236 292 128" />
          <path d="M252 54 540 206" />
          <path d="M396 92 188 214" />
          <path d="M492 126 354 210 452 262 590 176Z" />
          <path d="M214 292 382 192 520 266 352 336Z" />
        </g>

        <g className="work-dotted-lines">
          <path d="M238 86V206l114 60" />
          <path d="M408 72v114l92 48" />
          <path d="M128 186h118l88 48" />
        </g>

        <g className="work-nodes">
          <circle cx="118" cy="196" r="5" />
          <circle cx="238" cy="86" r="5" />
          <circle cx="408" cy="72" r="5" />
          <circle cx="500" cy="234" r="5" />
          <circle cx="548" cy="150" r="5" />
          <circle cx="318" cy="286" r="5" />
        </g>

        <g className="work-floating-card work-floating-card-left" filter="url(#work-soft-shadow)">
          <path d="M55 190 90 170l36 21v41l-36 21-35-21Z" />
          <path d="m76 215 12-24m17 0-12 24" />
        </g>

        <g className="work-floating-card work-floating-card-top" filter="url(#work-soft-shadow)">
          <path d="M240 58 294 28l54 31v62l-54 31-54-31Z" />
          <path d="M270 78 294 92l24-14" />
          <path d="M270 78v26l24 14 24-14V78" />
        </g>

        <g className="work-floating-card work-floating-card-right" filter="url(#work-soft-shadow)">
          <path d="M510 102 548 80l38 22v44l-38 22-38-22Z" />
          <path d="m530 114 18-10 18 10v20l-18 10-18-10Z" />
        </g>

        <g className="work-floating-card work-floating-card-bottom" filter="url(#work-soft-shadow)">
          <path d="M462 252 505 227l43 25v50l-43 25-43-25Z" />
          <path d="m484 264 21-12 21 12v24l-21 12-21-12Z" />
        </g>

        <g className="work-platform" filter="url(#work-soft-shadow)">
          <path d="M318 196 408 144l92 52v74l-92 52-90-52Z" />
          <path d="M318 226 408 174l92 52" />
          <path d="M318 256 408 204l92 52" />
          <path d="M408 174v148" />
        </g>

        <g className="work-cube" filter="url(#work-soft-shadow)">
          <path d="M360 94 432 52l72 42-72 42Z" fill="url(#work-cube-top)" />
          <path d="M360 94v74l72 42v-74Z" fill="url(#work-cube-side)" />
          <path d="M504 94v74l-72 42v-74Z" fill="var(--work-cube-face)" />
          <path d="M360 94 432 136l72-42" />
          <path d="M432 136v74" />
          <text x="432" y="118" textAnchor="middle">
            M
          </text>
        </g>
      </svg>
    </div>
  );
}

function MetricStrip() {
  return (
    <ul className="work-metrics" aria-label="Selected work summary">
      {metrics.map((metric) => (
        <li key={metric.value}>
          <span className="work-metric-icon">
            <metric.icon aria-hidden="true" size={22} strokeWidth={2.15} />
          </span>
          <span>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

function FeaturedProjectCard({ project }: { project: Project }) {
  return (
    <article className="work-featured-card">
      <div className="work-featured-icon">
        <ProjectIcon icon={project.icon} size="large" />
      </div>
      <div className="work-featured-main">
        <div className="work-title-row">
          <span className="work-featured-badge">Featured</span>
          <h2>{project.title}</h2>
          <span className="work-category-badge">{projectCategories[project.slug]}</span>
        </div>
        <p className="work-featured-summary">{project.shortDescription}</p>
        <div className="work-featured-meta">
          <div>
            <span>
              <BriefcaseBusiness aria-hidden="true" size={14} strokeWidth={2.2} />
              Role
            </span>
            <strong>{project.metadata.role}</strong>
          </div>
          <div>
            <span>
              <Star aria-hidden="true" size={14} strokeWidth={2.2} />
              Impact / proof
            </span>
            <strong>{project.proof}</strong>
          </div>
        </div>
      </div>
      <div className="work-featured-side">
        <TagList items={project.tags} ariaLabel={`${project.title} technologies`} />
        <Link className="work-primary-cta" href={`/work/${project.slug}`}>
          Read full case study
          <ArrowRight aria-hidden="true" size={18} strokeWidth={2.4} />
        </Link>
      </div>
    </article>
  );
}

function SupportingProjectCard({ project }: { project: Project }) {
  return (
    <article className="work-project-card">
      <div className="work-project-heading">
        <ProjectIcon icon={project.icon} />
        <span className="work-category-badge">{projectCategories[project.slug]}</span>
      </div>
      <h2>{project.title}</h2>
      <p className="work-project-summary">{project.shortDescription}</p>
      <div className="work-evidence-line">
        <span>
          <ShieldCheck aria-hidden="true" size={16} strokeWidth={2.1} />
          Proof / evidence
        </span>
        <strong>{project.proof}</strong>
      </div>
      <div className="work-project-tags">
        <TagList items={project.tags} ariaLabel={`${project.title} technologies`} />
      </div>
      <Link className="work-text-cta" href={`/work/${project.slug}`}>
        View case study
        <ArrowRight aria-hidden="true" size={17} strokeWidth={2.4} />
      </Link>
    </article>
  );
}

function WorkCallout() {
  return (
    <aside className="work-callout" aria-label="Additional links">
      <div className="work-callout-block">
        <span className="work-callout-icon">
          <CodeXml aria-hidden="true" size={30} strokeWidth={2.2} />
        </span>
        <div>
          <h2>Explore more on GitHub</h2>
          <p>Browse additional projects, experiments, and contributions.</p>
        </div>
        <ExternalLink className="work-secondary-cta" href={site.githubUrl}>
          View GitHub
          <ArrowUpRight aria-hidden="true" size={16} strokeWidth={2.4} />
        </ExternalLink>
      </div>
      <div className="work-callout-divider" />
      <div className="work-callout-block work-callout-block-resume">
        <span className="work-callout-icon">
          <FileText aria-hidden="true" size={29} strokeWidth={2.1} />
        </span>
        <div>
          <h2>Let's connect</h2>
          <p>Open to backend, infra, and product engineering opportunities.</p>
        </div>
        <Link className="work-primary-cta" href={site.resumePath}>
          View resume
          <ArrowRight aria-hidden="true" size={17} strokeWidth={2.4} />
        </Link>
      </div>
    </aside>
  );
}
