import { Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container, ExternalLink } from "@/components/primitives";
import { primaryNavItems } from "@/lib/navigation";
import { site } from "@/lib/site";

const footerLinks = [
  {
    label: "Email",
    href: `mailto:${site.email}`,
    external: false
  },
  {
    label: "GitHub",
    href: site.githubUrl,
    external: true
  },
  {
    label: "LinkedIn",
    href: site.linkedinUrl,
    external: true
  },
  {
    label: "Resume",
    href: site.resumePath,
    external: false
  }
] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
      <Container className="flex min-h-16 items-center justify-between gap-8">
        <Link
          aria-label="Alex Metelli home"
          className="flex min-w-0 items-center gap-6 font-semibold text-[var(--color-text)]"
          href="/"
        >
          <Image
            className="site-logo-mark"
            src="/images/logo-mark.png"
            alt=""
            width={54}
            height={28}
            priority
            aria-hidden="true"
          />
          <span className="truncate text-[length:var(--text-sm)] font-bold uppercase tracking-[0.02em] max-[620px]:hidden">
            Alex Metelli
          </span>
        </Link>
        <nav className="flex items-center gap-7 max-[760px]:gap-3" aria-label="Primary navigation">
          <ul className="flex items-center gap-5 max-[760px]:gap-3">
            {primaryNavItems.map((item) => (
              <li key={item.href}>
                <Link
                  className="text-[length:var(--text-sm)] font-medium text-[var(--color-text)] hover:text-[var(--color-accent)]"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link className="button button-compact" href={site.resumePath}>
            Resume
            <Download aria-hidden="true" size={15} strokeWidth={2.3} />
          </Link>
        </nav>
      </Container>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-soft)] bg-white">
      <Container className="flex items-center justify-between gap-6 py-8 max-[720px]:flex-col max-[720px]:items-start">
        <div>
          <p className="text-[length:var(--text-sm)] font-semibold text-[var(--color-text)]">
            {site.name}
          </p>
          <a
            className="mt-1 inline-flex text-[length:var(--text-sm)] text-[var(--color-text-muted)] hover:text-[var(--color-accent)]"
            href={`mailto:${site.email}`}
          >
            {site.email}
          </a>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="flex flex-wrap gap-1">
            {footerLinks.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <ExternalLink
                    className="rounded-[6px] px-3 py-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                    href={item.href}
                  >
                    {item.label}
                  </ExternalLink>
                ) : (
                  <Link
                    className="rounded-[6px] px-3 py-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </footer>
  );
}
