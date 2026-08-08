"use client";

import { RefreshCw } from "lucide-react";
import { useEffect } from "react";
import { Container, Section } from "@/components/primitives";

export default function ErrorPage({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" tabIndex={-1}>
      <Section className="status-section">
        <Container>
          <div className="status-panel" role="alert">
            <p className="status-code">Unable to load</p>
            <h1 className="hero-title page-title">The page hit an unexpected problem.</h1>
            <p className="page-description">
              Your navigation is still available. Try loading this page again; if the problem
              continues, return to another section of the portfolio.
            </p>
            <div className="status-actions">
              <button className="button" onClick={reset} type="button">
                <RefreshCw aria-hidden="true" size={17} strokeWidth={2.3} />
                Try again
              </button>
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
