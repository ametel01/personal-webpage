import { Container, ExternalLink, PageHeader, Section, TagList } from "@/components/primitives";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <main>
      <Section>
        <Container>
          <PageHeader
            eyebrow={site.name}
            title="Software Engineer"
            description="Backend systems. Developer tooling. Blockchain infrastructure."
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <a className="button" href="/work">
              View work
            </a>
            <ExternalLink className="button button-secondary" href={site.githubUrl}>
              GitHub
            </ExternalLink>
          </div>
        </Container>
      </Section>
      <Section muted tight>
        <Container>
          <div className="max-w-3xl border-l border-[var(--color-border)] pl-6">
            <h2 className="text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
              Design foundation
            </h2>
            <p className="mt-3 text-[length:var(--text-md)] text-[var(--color-text-muted)]">
              A restrained system for an evidence-first engineering website.
            </p>
            <div className="mt-5">
              <TagList items={["Backend", "Developer tooling", "Blockchain infrastructure"]} />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
