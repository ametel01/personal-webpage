import type { LucideIcon } from "lucide-react";
import { ArrowRight, ArrowUpRight, BriefcaseBusiness, CodeXml, Download, Mail } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container, ExternalLink, Section, TagList } from "@/components/primitives";
import { ProjectIcon } from "@/components/project-icon";
import { resume } from "@/content/resume";
import { createPageMetadata } from "@/lib/metadata";

type ResumeLinkLabel = (typeof resume.links)[number]["label"];
type ResumePdfLink = (typeof resume.links)[number] & { resumeLabel: string };

const resumeLinkIcons: Partial<Record<ResumeLinkLabel, LucideIcon>> = {
  GitHub: CodeXml,
  LinkedIn: BriefcaseBusiness,
  Email: Mail
};

const resumePdfLink = resume.links.find((link): link is ResumePdfLink => "resumeLabel" in link);
const profileLinks = resume.links.filter((link) => !("resumeLabel" in link));

const resumeSections = [
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Selected projects" },
  { href: "#skills", label: "Skills" },
  { href: "#education", label: "Education" }
] as const;

export const metadata: Metadata = createPageMetadata({
  title: "Software Engineering Resume",
  description:
    "Alex Metelli's software engineering experience, selected projects, technical skills, education, and downloadable resume.",
  path: "/resume"
});

export default function ResumePage() {
  return (
    <main className="resume-page" id="main-content" tabIndex={-1}>
      <script id="impeccable-resume-direction-contract" type="application/json">
        {JSON.stringify({
          thesis:
            "A compact identity deck opens into one continuous career proof register, refusing the generic resume card stack.",
          ownWorld:
            "Warm paper, navy ink, editorial serif hierarchy, restrained blue paths, square records, and precise hairline rules inherited from the site.",
          story:
            "An engineering manager scans Alex's position and range, verifies professional experience and projects, then downloads the PDF or starts a conversation.",
          firstViewport:
            "Alex's name and positioning sit beside a concise summary and primary PDF action, followed by a four-column evidence index.",
          form: "Career proof register; ordered candidate 6; seed 5d5e2afc.",
          finish:
            "unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md"
        })}
      </script>

      <Section className="resume-field-section">
        <Container>
          <header className="resume-masthead">
            <div className="resume-hero-copy">
              <h1 className="hero-title">{resume.heading.name}</h1>
              <p className="resume-role">{resume.heading.role}</p>
            </div>

            <div className="resume-introduction">
              <p className="resume-summary">{resume.heading.summary}</p>
              <div className="resume-primary-actions">
                {resumePdfLink ? <ResumePdfLink link={resumePdfLink} /> : null}
                <a
                  className="resume-email-link"
                  href={profileLinks.find((link) => link.label === "Email")?.href}
                >
                  Start a conversation
                  <ArrowRight aria-hidden="true" size={17} strokeWidth={2.2} />
                </a>
              </div>
              <nav className="resume-profile-links" aria-label="Professional profiles">
                {profileLinks.map((link) => (
                  <ResumeProfileLink key={link.label} href={link.href} label={link.label} />
                ))}
              </nav>
            </div>
          </header>

          <dl className="resume-fact-register" aria-label="Resume summary facts">
            {resume.heroFacts.map((fact) => (
              <div key={fact.label}>
                <dt>{fact.label}</dt>
                <dd>
                  {"stack" in fact ? (
                    <TagList items={fact.stack} ariaLabel={`${fact.label} technologies`} />
                  ) : (
                    fact.detail
                  )}
                </dd>
              </div>
            ))}
          </dl>

          <div className="resume-record-layout">
            <ResumeIndex />

            <div className="resume-record">
              <ResumeSection id="experience" title="Experience">
                <div className="resume-experience-list">
                  {resume.experience.map((entry) => (
                    <article
                      className="resume-experience-item"
                      key={`${entry.company}-${entry.role}`}
                    >
                      <div className="resume-employer">
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
                        <h3>{entry.company}</h3>
                        <p>{entry.role}</p>
                        <time>{entry.dates}</time>
                      </div>

                      <div className="resume-experience-detail">
                        <p className="resume-experience-summary">{entry.summary}</p>
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

              <ResumeSection id="projects" title="Selected projects">
                <p className="resume-section-intro">
                  Seven public case studies spanning local-first AI tooling, developer
                  infrastructure, and blockchain systems.
                </p>
                <div className="resume-project-register">
                  {resume.selectedProjects.map((project) => (
                    <article className="resume-project-row" key={project.title}>
                      <ProjectIcon icon={project.icon} size="resume" />
                      <div className="resume-project-copy">
                        <h3>{project.title}</h3>
                        <p>{project.description}</p>
                      </div>
                      <div className="resume-project-stack">
                        <TagList items={project.stack} ariaLabel={`${project.title} stack`} />
                      </div>
                      <Link
                        aria-label={`Open the ${project.title} case study`}
                        className="resume-project-link"
                        href={`/work/${project.slug}`}
                        prefetch={false}
                      >
                        <span>{project.title} case study</span>
                        <ArrowRight aria-hidden="true" size={17} strokeWidth={2.2} />
                      </Link>
                    </article>
                  ))}
                </div>
              </ResumeSection>

              <ResumeSection id="skills" title="Skills">
                <div className="resume-skills-register">
                  {resume.skills.map((skill) => (
                    <section className="resume-skill-row" key={skill.group}>
                      <h3>{skill.group}</h3>
                      <TagList items={skill.items} ariaLabel={`${skill.group} skills`} />
                    </section>
                  ))}
                </div>
              </ResumeSection>

              <ResumeSection id="education" title="Education">
                <div className="resume-education-row">
                  <span className="resume-education-mark">
                    <Image
                      className="resume-education-logo"
                      src={resume.education[0].logo}
                      alt={resume.education[0].logoAlt}
                      width="180"
                      height="91"
                    />
                  </span>
                  <div>
                    <h3>{resume.education[0].credential}</h3>
                    <p>{resume.education[0].institution}</p>
                  </div>
                </div>
              </ResumeSection>

              <footer className="resume-close">
                <p>Need the concise version?</p>
                {resumePdfLink ? <ResumePdfLink link={resumePdfLink} /> : null}
              </footer>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function ResumeIndex() {
  return (
    <aside className="resume-index" aria-labelledby="resume-index-title">
      <div>
        <h2 id="resume-index-title">Resume index</h2>
        <nav aria-label="Resume sections">
          {resumeSections.map((item) => (
            <a href={item.href} key={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      </div>
      <p>Available for remote engineering roles and selected consulting engagements.</p>
    </aside>
  );
}

function ResumeSection({
  children,
  id,
  title
}: {
  children: ReactNode;
  id: string;
  title: string;
}) {
  return (
    <section className="resume-section" id={id}>
      <h2>{title}</h2>
      {children}
    </section>
  );
}

function ResumePdfLink({ link }: { link: ResumePdfLink }) {
  return (
    <a className="button resume-download-link" download href={link.href}>
      <Download aria-hidden="true" size={17} strokeWidth={2.3} />
      {link.resumeLabel}
    </a>
  );
}

function ResumeProfileLink({ href, label }: { href: string; label: ResumeLinkLabel }) {
  const Icon = resumeLinkIcons[label] ?? ArrowUpRight;
  const content = (
    <>
      <Icon aria-hidden="true" size={15} strokeWidth={2.2} />
      {label}
    </>
  );

  if (href.startsWith("mailto:")) {
    return <a href={href}>{content}</a>;
  }

  return <ExternalLink href={href}>{content}</ExternalLink>;
}
