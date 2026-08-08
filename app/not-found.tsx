import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { Container, Section } from "@/components/primitives";
import { site } from "@/lib/site";

export default function NotFound() {
  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="status-section">
        <Container>
          <div className="status-panel">
            <p className="status-code">404</p>
            <h1 className="hero-title page-title">This page is not part of the portfolio.</h1>
            <p className="page-description">
              The address may be outdated or incomplete. Return to the selected work, or email Alex
              if you were looking for a specific project.
            </p>
            <div className="status-actions">
              <Link className="button" href="/work">
                <ArrowLeft aria-hidden="true" size={17} strokeWidth={2.3} />
                Review selected work
              </Link>
              <a className="button button-secondary" href={`mailto:${site.email}`}>
                <Mail aria-hidden="true" size={17} strokeWidth={2.3} />
                Email Alex
              </a>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
