import {
  ArrowRight,
  BriefcaseBusiness,
  CodeXml,
  FileText,
  ListChecks,
  Mail,
  Rocket,
  ShieldCheck
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, ExternalLink, Section } from "@/components/primitives";
import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "An overview of Alex Metelli's engineering principles, technical background, current focus, selected projects, and approach to software delivery.",
  path: "/about"
});

const valueIcons = {
  shield: ShieldCheck,
  list: ListChecks,
  rocket: Rocket
} satisfies Record<string, typeof ShieldCheck>;

const supportingCaseStudySlugs = new Set([
  "agentreceipt",
  "skills-doctor",
  "scopepilot",
  "horizon-starknet"
]);

const supportingCaseStudies = projects.filter((project) =>
  supportingCaseStudySlugs.has(project.slug)
);

export default function AboutPage() {
  return (
    <main className="about-page" id="main-content" tabIndex={-1}>
      <script id="impeccable-about-direction-contract" type="application/json">
        {JSON.stringify({
          thesis:
            "A portrait and capability rail opens into a sequential account of engineering practice, refusing the generic biography card grid.",
          ownWorld:
            "Warm paper, navy ink, editorial serif hierarchy, a single blue waypoint path, square portrait geometry, and fine rules inherited from Home, Work, and Writing.",
          story:
            "An engineering manager understands Alex's focus, working style, availability, principles, and direct paths to inspect or discuss the work.",
          firstViewport:
            "A tall portrait and five-part capability index sit beside a large engineering thesis and three numbered answers connected by one vertical blue path.",
          form: "Waypoint interview field; approved comp about-interview-c; seed 642b9290.",
          finish:
            "unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md"
        })}
      </script>

      <Section className="about-field-section">
        <Container className="about-field-container">
          <div className="about-field-layout">
            <IdentityRail />

            <div className="about-reading-field">
              <header className="about-intro">
                <h1>Engineering work built around correctness, clarity, and delivery.</h1>
                <p>{profile.about.narrative}</p>
              </header>

              <section className="about-interview" aria-label="Engineering practice">
                <ol>
                  {profile.about.focusCards.map((item, index) => (
                    <li key={item.title}>
                      <span className="about-waypoint" aria-hidden="true">
                        {index + 1}
                      </span>
                      <article>
                        <h2>{item.title}</h2>
                        <p>{item.body}</p>
                      </article>
                    </li>
                  ))}
                </ol>
              </section>

              <WorkingPrinciples />
              <SupportingCaseStudies />
              <ContactRegister />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}

function IdentityRail() {
  return (
    <aside className="about-identity-rail" aria-labelledby="about-identity-title">
      <figure className="about-identity-figure">
        <div className="about-portrait-frame">
          <Image
            alt={profile.about.imageAlt}
            className="about-portrait"
            height={900}
            priority
            sizes="(max-width: 640px) 100vw, (max-width: 1120px) 40vw, 330px"
            src={profile.about.image}
            width={720}
          />
        </div>
        <figcaption>
          <strong id="about-identity-title">{profile.name}</strong>
          <span>{profile.role}</span>
        </figcaption>
      </figure>

      <section className="about-capability-index" aria-labelledby="about-capability-title">
        <h2 id="about-capability-title">Engineering range</h2>
        <ol>
          {profile.about.capabilityChips.map((item, index) => (
            <li key={item.label}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <span>{item.label}</span>
            </li>
          ))}
        </ol>
      </section>
    </aside>
  );
}

function WorkingPrinciples() {
  return (
    <section className="about-principles" aria-labelledby="about-principles-title">
      <h2 id="about-principles-title">Working principles</h2>
      <ul>
        {profile.about.values.map((value) => {
          const Icon = valueIcons[value.icon];

          return (
            <li key={value.title}>
              <Icon aria-hidden="true" size={24} strokeWidth={1.8} />
              <div>
                <h3>{value.title}</h3>
                <p>{value.body}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function SupportingCaseStudies() {
  return (
    <section className="about-supporting-work" aria-labelledby="about-supporting-work-title">
      <header>
        <h2 id="about-supporting-work-title">Supporting case studies</h2>
        <p>Inspect the project evidence behind the engineering range described on this page.</p>
      </header>
      <ul>
        {supportingCaseStudies.map((project) => (
          <li key={project.slug}>
            <Link href={`/work/${project.slug}`} prefetch={false}>
              <span>{project.tags.slice(0, 3).join(" · ")}</span>
              <strong>{project.title}</strong>
              <ArrowRight aria-hidden="true" size={18} strokeWidth={2} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ContactRegister() {
  return (
    <nav className="about-contact-register" aria-label="Contact and profile links">
      <a href={`mailto:${profile.email}`}>
        <Mail aria-hidden="true" size={18} strokeWidth={2} />
        Email
      </a>
      <ExternalLink href={profile.links.github}>
        <CodeXml aria-hidden="true" size={18} strokeWidth={2} />
        GitHub
      </ExternalLink>
      <ExternalLink href={profile.links.linkedin}>
        <BriefcaseBusiness aria-hidden="true" size={18} strokeWidth={2} />
        LinkedIn
      </ExternalLink>
      <Link href={profile.links.resume}>
        <FileText aria-hidden="true" size={18} strokeWidth={2} />
        Resume
      </Link>
    </nav>
  );
}
