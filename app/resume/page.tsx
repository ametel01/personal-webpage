import { ArrowUpRight, Download, Mail } from "lucide-react";
import type { Metadata } from "next";
import { Container, ExternalLink, PageHeader, Section, TagList } from "@/components/primitives";
import { resume } from "@/content/resume";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Resume",
  description:
    "Structured web resume for Alex Metelli, software engineer focused on backend systems, developer tooling, and blockchain infrastructure.",
  path: "/resume"
});

export default function ResumePage() {
  return (
    <main>
      <Section>
        <Container>
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1fr]">
            <PageHeader
              eyebrow="Resume"
              title={resume.heading.name}
              description={resume.heading.summary}
            />
            <div className="self-end">
              <p className="text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
                {resume.heading.role}
              </p>
              <div className="mt-6 flex flex-wrap gap-3 max-[520px]:flex-col">
                {resume.links.map((link) => (
                  <ResumeLink key={link.label} href={link.href} label={link.label} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section muted>
        <Container>
          <ResumeSection title="Experience">
            <div className="grid gap-5">
              {resume.experience.map((entry) => (
                <article
                  className="border border-[var(--color-border)] bg-white p-6 shadow-[var(--shadow-card)]"
                  key={`${entry.company}-${entry.role}`}
                >
                  <div className="grid gap-2 md:grid-cols-[1fr_auto]">
                    <div>
                      <h3 className="text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
                        {entry.company}
                      </h3>
                      <p className="mt-1 text-[length:var(--text-sm)] font-bold text-[var(--color-accent)]">
                        {entry.role}
                      </p>
                    </div>
                    <p className="text-[length:var(--text-sm)] font-semibold text-[var(--color-text-muted)]">
                      {entry.dates}
                    </p>
                  </div>
                  <p className="mt-4 text-[length:var(--text-md)] leading-7 text-[var(--color-text-muted)]">
                    {entry.summary}
                  </p>
                  <ul className="mt-5 grid gap-3 text-[length:var(--text-sm)] leading-6 text-[var(--color-text-muted)]">
                    {entry.bullets.map((bullet) => (
                      <li className="pl-4 before:mr-3 before:content-['-']" key={bullet}>
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Selected Projects">
            <div className="grid gap-5 md:grid-cols-3">
              {resume.selectedProjects.map((project) => (
                <article
                  className="border border-[var(--color-border)] bg-white p-5 shadow-[var(--shadow-card)]"
                  key={project.title}
                >
                  <h3 className="text-[length:var(--text-lg)] font-semibold text-[var(--color-text)]">
                    {project.title}
                  </h3>
                  <p className="mt-3 text-[length:var(--text-sm)] leading-6 text-[var(--color-text-muted)]">
                    {project.description}
                  </p>
                  <div className="mt-4">
                    <TagList items={project.stack} ariaLabel={`${project.title} stack`} />
                  </div>
                </article>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Skills">
            <div className="grid gap-4 md:grid-cols-2">
              {resume.skills.map((skill) => (
                <div className="border-l border-[var(--color-border)] pl-5" key={skill.group}>
                  <h3 className="text-[length:var(--text-lg)] font-semibold text-[var(--color-text)]">
                    {skill.group}
                  </h3>
                  <div className="mt-4">
                    <TagList items={skill.items} ariaLabel={`${skill.group} skills`} />
                  </div>
                </div>
              ))}
            </div>
          </ResumeSection>

          <ResumeSection title="Education / Certifications">
            <div className="grid gap-4">
              {resume.education.map((item) => (
                <div className="border-l border-[var(--color-border)] pl-5" key={item.credential}>
                  <h3 className="text-[length:var(--text-lg)] font-semibold text-[var(--color-text)]">
                    {item.credential}
                  </h3>
                  <p className="mt-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-text-muted)]">
                    {item.institution}
                  </p>
                </div>
              ))}
            </div>
          </ResumeSection>
        </Container>
      </Section>
    </main>
  );
}

function ResumeSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-14 last:mb-0">
      <h2 className="mb-6 text-[length:var(--text-2xl)] font-semibold text-[var(--color-text)]">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ResumeLink({ href, label }: { href: string; label: string }) {
  if (href.startsWith("mailto:")) {
    return (
      <a className="button button-secondary max-[520px]:w-full" href={href}>
        <Mail aria-hidden="true" size={17} strokeWidth={2.3} />
        {label}
      </a>
    );
  }

  if (href.endsWith(".pdf")) {
    return (
      <a className="button max-[520px]:w-full" href={href}>
        <Download aria-hidden="true" size={17} strokeWidth={2.3} />
        {label}
      </a>
    );
  }

  return (
    <ExternalLink className="button button-secondary max-[520px]:w-full" href={href}>
      <ArrowUpRight aria-hidden="true" size={17} strokeWidth={2.3} />
      {label}
    </ExternalLink>
  );
}
