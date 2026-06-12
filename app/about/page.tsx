import { ArrowUpRight, FileText, Mail } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, ExternalLink, PageHeader, Section } from "@/components/primitives";
import { profile } from "@/content/profile";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "About Alex Metelli, a software engineer focused on backend systems, developer tooling, blockchain infrastructure, and correctness-sensitive software.",
  path: "/about"
});

export default function AboutPage() {
  return (
    <main>
      <Section>
        <Container>
          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.9fr)_360px]">
            <div>
              <PageHeader
                eyebrow="About"
                title="Engineering work built around correctness, clarity, and delivery."
                description={profile.about.narrative}
              />
              <div className="mt-10 grid gap-8">
                <AboutBlock title="What I work on">{profile.about.work}</AboutBlock>
                <AboutBlock title="How I work">{profile.about.style}</AboutBlock>
                <AboutBlock title="What I am looking for">{profile.about.lookingFor}</AboutBlock>
              </div>
              <div className="mt-10 flex flex-wrap gap-3 max-[520px]:flex-col">
                <a className="button max-[520px]:w-full" href={`mailto:${profile.email}`}>
                  <Mail aria-hidden="true" size={17} strokeWidth={2.3} />
                  Email
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
                <Link
                  className="button button-secondary max-[520px]:w-full"
                  href={profile.links.resume}
                >
                  <FileText aria-hidden="true" size={17} strokeWidth={2.3} />
                  Resume
                </Link>
              </div>
            </div>
            <figure className="max-w-[360px] justify-self-end max-[1024px]:justify-self-start">
              <Image
                alt={profile.about.imageAlt}
                className="aspect-square w-full border border-[var(--color-border)] object-cover shadow-[var(--shadow-card)]"
                height={720}
                priority
                sizes="(max-width: 720px) 80vw, 360px"
                src={profile.about.image}
                width={720}
              />
            </figure>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function AboutBlock({ title, children }: { title: string; children: string }) {
  return (
    <section className="border-l border-[var(--color-border)] pl-6">
      <h2 className="text-[length:var(--text-xl)] font-semibold text-[var(--color-text)]">
        {title}
      </h2>
      <p className="mt-3 text-[length:var(--text-md)] leading-8 text-[var(--color-text-muted)]">
        {children}
      </p>
    </section>
  );
}
