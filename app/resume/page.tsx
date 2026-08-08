import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Blocks,
  Box,
  BriefcaseBusiness,
  CalendarDays,
  CodeXml,
  Download,
  FileText,
  Globe2,
  Mail,
  MonitorCog,
  ServerCog,
  SquareTerminal,
  Workflow
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Container, ExternalLink, Section, TagList } from "@/components/primitives";
import { ProjectIcon } from "@/components/project-icon";
import { resume } from "@/content/resume";
import { createPageMetadata } from "@/lib/metadata";

type ResumeLinkLabel = (typeof resume.links)[number]["label"];
type ResumePdfLink = (typeof resume.links)[number] & { resumeLabel: string };

const factIcons: Record<string, LucideIcon> = {
  Box,
  Calendar: CalendarDays,
  Globe: Globe2,
  MonitorCog
};

const skillIcons: Record<string, LucideIcon> = {
  Blocks,
  ServerCog,
  SquareTerminal,
  Workflow
};

const resumeLinkIcons: Partial<Record<ResumeLinkLabel, LucideIcon>> = {
  GitHub: CodeXml,
  LinkedIn: BriefcaseBusiness
};

const resumePdfLink = resume.links.find((link): link is ResumePdfLink => "resumeLabel" in link);

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description:
    "Structured web resume for Alex Metelli, software engineer focused on backend systems, developer tooling, and blockchain infrastructure.",
  path: "/resume"
});

export default function ResumePage() {
  return (
    <main className="resume-page">
      <Section className="resume-hero-section">
        <Container>
          <div className="resume-hero-grid">
            <header className="resume-hero-copy">
              <p className="resume-section-kicker">Software Engineer</p>
              <h1 className="hero-title">{resume.heading.name}</h1>
              <p className="resume-role">{resume.heading.role}</p>
              <p className="resume-summary">{resume.heading.summary}</p>
              <div className="resume-cta-row">
                {resume.links.map((link) => (
                  <ResumeLink key={link.label} href={link.href} label={link.label} />
                ))}
              </div>
            </header>

            <aside className="resume-facts-card" aria-label="Resume summary facts">
              {resume.heroFacts.map((fact) => {
                const Icon = factIcons[fact.icon] ?? FileText;

                return (
                  <div className="resume-fact-row" key={fact.label}>
                    <span className="resume-icon-badge">
                      <Icon aria-hidden="true" />
                    </span>
                    <div>
                      <h2>{fact.label}</h2>
                      {"stack" in fact ? (
                        <TagList items={fact.stack} ariaLabel={`${fact.label} technologies`} />
                      ) : (
                        <p>{fact.detail}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </aside>
          </div>
        </Container>
      </Section>

      <Section muted className="resume-body-section">
        <Container>
          <ResumeSection title="Experience">
            <div className="resume-experience-list">
              {resume.experience.map((entry) => (
                <article className="resume-experience-card" key={`${entry.company}-${entry.role}`}>
                  <div className="resume-timeline" aria-hidden="true">
                    <span />
                  </div>
                  <div className="resume-company-block">
                    <span className="resume-company-logo-frame" aria-hidden="true">
                      <Image
                        className="resume-company-logo"
                        src="/images/nethermind-logo-horizontal-light.svg"
                        alt=""
                        width="478"
                        height="81"
                        unoptimized
                      />
                    </span>
                    <div>
                      <h3>{entry.company}</h3>
                      <p>{entry.role}</p>
                    </div>
                  </div>
                  <div className="resume-experience-detail">
                    <div className="resume-experience-header">
                      <p>{entry.summary}</p>
                      <time>{entry.dates}</time>
                    </div>
                    <ul className="resume-bullet-list">
                      {entry.bullets.map((bullet) => (
                        <li key={bullet}>{bullet}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Selected Projects">
            <div className="resume-project-grid">
              {resume.selectedProjects.map((project) => (
                <article className="resume-project-card" key={project.title}>
                  <ProjectIcon icon={project.icon} size="resume" />
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="resume-project-stack">
                    <TagList items={project.stack} ariaLabel={`${project.title} stack`} />
                  </div>
                </article>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Skills">
            <div className="resume-skills-panel">
              {resume.skills.map((skill) => (
                <div className="resume-skill-group" key={skill.group}>
                  <h3>
                    <SkillIcon icon={skill.icon} />
                    {skill.group}
                  </h3>
                  <div className="resume-skill-tags">
                    <TagList items={skill.items} ariaLabel={`${skill.group} skills`} />
                  </div>
                </div>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Education / Certifications">
            <div className="resume-education-list">
              {resume.education.map((item) => (
                <div className="resume-education-card" key={item.credential}>
                  <span className="resume-education-icon">
                    <Image
                      className="resume-education-logo"
                      src={item.logo}
                      alt={item.logoAlt}
                      width="180"
                      height="91"
                    />
                  </span>
                  <div>
                    <h3>{item.credential}</h3>
                    <p>{item.institution}</p>
                  </div>
                </div>
              ))}
            </div>
          </ResumeSection>
        </Container>
      </Section>
    </main>
  );
}

function ResumeSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="resume-section">
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function SkillIcon({ icon }: { icon: string }) {
  const Icon = skillIcons[icon] ?? FileText;

  return <Icon aria-hidden="true" size={17} strokeWidth={2.25} />;
}

function ResumeLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith("mailto:")) {
    return (
      <a className="button button-secondary resume-cta" href={href}>
        <Mail aria-hidden="true" size={17} strokeWidth={2.3} />
        {label}
      </a>
    );
  }

  if (href.endsWith(".pdf")) {
    return (
      <a className="button resume-cta" href={href}>
        <Download aria-hidden="true" size={17} strokeWidth={2.3} />
        {resumePdfLink?.href === href ? resumePdfLink.resumeLabel : label}
      </a>
    );
  }

  const Icon = resumeLinkIcons[label as ResumeLinkLabel] ?? ArrowUpRight;

  return (
    <ExternalLink className="button button-secondary resume-cta" href={href}>
      <Icon aria-hidden="true" size={17} strokeWidth={2.3} />
      {label}
    </ExternalLink>
  );
}
