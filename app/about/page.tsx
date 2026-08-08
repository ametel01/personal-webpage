import {
  BriefcaseBusiness,
  CalendarDays,
  Code2,
  CodeXml,
  FileText,
  Globe2,
  ListChecks,
  Mail,
  Package,
  Rocket,
  Server,
  ShieldCheck,
  Target,
  UsersRound
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container, ExternalLink, PageHeader, Section } from "@/components/primitives";
import { profile } from "@/content/profile";
import { createPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "About",
  description:
    "About Alex Metelli, a software engineer focused on backend systems, developer tooling, blockchain infrastructure, and correctness-sensitive software.",
  path: "/about"
});

const chipIcons = {
  calendar: CalendarDays,
  server: Server,
  code: Code2,
  cube: Package,
  globe: Globe2
} satisfies Record<string, typeof CalendarDays>;

const aboutIcons = {
  code: CodeXml,
  team: UsersRound,
  target: Target,
  shield: ShieldCheck,
  list: ListChecks,
  rocket: Rocket
} satisfies Record<string, typeof CodeXml>;

export default function AboutPage() {
  return (
    <main className="about-page" id="main-content" tabIndex={-1}>
      <Section className="about-section">
        <Container className="about-container">
          <div className="about-hero-grid">
            <div className="about-hero-copy">
              <PageHeader
                eyebrow="About"
                title="Engineering work built around correctness, clarity, and delivery."
                description={profile.about.narrative}
              />

              <ul className="about-chip-list" aria-label="About summary">
                {profile.about.capabilityChips.map((chip) => (
                  <AboutChip icon={chip.icon} key={chip.label}>
                    {chip.label}
                  </AboutChip>
                ))}
              </ul>

              <div className="about-focus-grid">
                {profile.about.focusCards.map((card, index) => (
                  <AboutCard
                    body={card.body}
                    key={card.title}
                    title={card.title}
                    variant={index === 0 ? "feature" : "supporting"}
                  />
                ))}
              </div>
            </div>

            <aside className="about-profile-card" aria-label="Profile summary">
              <figure className="about-portrait-frame">
                <Image
                  alt={profile.about.imageAlt}
                  className="about-portrait"
                  height={720}
                  priority
                  sizes="(max-width: 720px) 88vw, 360px"
                  src={profile.about.image}
                  width={720}
                />
              </figure>
              <div className="about-profile-summary">
                {profile.about.focusCards.map((card) => (
                  <ProfileSummaryRow
                    body={"sidebarBody" in card ? card.sidebarBody : card.body}
                    icon={card.icon}
                    key={card.title}
                    title={"sidebarTitle" in card ? card.sidebarTitle : card.title}
                  />
                ))}
              </div>
            </aside>
          </div>

          <section className="about-values-section" aria-labelledby="about-values-title">
            <h2 id="about-values-title">What matters to me</h2>
            <div className="about-values-grid">
              {profile.about.values.map((value) => (
                <ValueCard
                  body={value.body}
                  icon={value.icon}
                  key={value.title}
                  title={value.title}
                />
              ))}
            </div>
          </section>

          <nav className="about-cta-row" aria-label="Contact links">
            <a className="button about-cta-primary" href={`mailto:${profile.email}`}>
              <Mail aria-hidden="true" size={18} strokeWidth={2.3} />
              Email
            </a>
            <ExternalLink className="button button-secondary about-cta" href={profile.links.github}>
              <CodeXml aria-hidden="true" size={18} strokeWidth={2.3} />
              GitHub
            </ExternalLink>
            <ExternalLink
              className="button button-secondary about-cta"
              href={profile.links.linkedin}
            >
              <BriefcaseBusiness aria-hidden="true" size={18} strokeWidth={2.3} />
              LinkedIn
            </ExternalLink>
            <Link className="button button-secondary about-cta" href={profile.links.resume}>
              <FileText aria-hidden="true" size={18} strokeWidth={2.3} />
              Resume
            </Link>
          </nav>
        </Container>
      </Section>
    </main>
  );
}

function AboutChip({ children, icon }: { children: ReactNode; icon: keyof typeof chipIcons }) {
  const Icon = chipIcons[icon];

  return (
    <li className="about-chip">
      <Icon aria-hidden="true" size={17} strokeWidth={2.1} />
      <span>{children}</span>
    </li>
  );
}

function AboutCard({
  body,
  title,
  variant
}: {
  body: string;
  title: string;
  variant: "feature" | "supporting";
}) {
  return (
    <article className={`about-card about-card-${variant}`}>
      <h2>{title}</h2>
      <span className="about-card-rule" aria-hidden="true" />
      <p>{body}</p>
    </article>
  );
}

function ProfileSummaryRow({
  body,
  icon,
  title
}: {
  body: string;
  icon: keyof typeof aboutIcons;
  title: string;
}) {
  const Icon = aboutIcons[icon];

  return (
    <article className="about-summary-row">
      <span className="about-summary-icon">
        <Icon aria-hidden="true" size={24} strokeWidth={2.05} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}

function ValueCard({
  body,
  icon,
  title
}: {
  body: string;
  icon: keyof typeof aboutIcons;
  title: string;
}) {
  const Icon = aboutIcons[icon];

  return (
    <article className="about-value-card">
      <span className="about-icon-badge">
        <Icon aria-hidden="true" size={27} strokeWidth={2.05} />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{body}</p>
      </div>
    </article>
  );
}
