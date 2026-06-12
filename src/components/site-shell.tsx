import Link from "next/link";
import type { ReactNode } from "react";
import { Container, ExternalLink } from "@/components/primitives";
import { site } from "@/lib/site";

const navItems = [
  {
    label: "Work",
    href: "/work"
  },
  {
    label: "About",
    href: "/about"
  },
  {
    label: "Resume",
    href: site.resumePath
  }
] as const;

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
    <header className="sticky top-0 z-20 border-b border-[var(--color-border-soft)] bg-white">
      <Container className="flex min-h-16 items-center justify-between gap-6">
        <Link
          className="flex min-w-0 items-center gap-3 font-semibold text-[var(--color-text)]"
          href="/"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-[6px] border border-[var(--color-border)] text-[length:var(--text-sm)]">
            AM
          </span>
          <span className="truncate text-[length:var(--text-sm)] max-[520px]:hidden">
            {site.name}
          </span>
        </Link>
        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-1 max-[420px]:gap-0">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  className="rounded-[6px] px-3 py-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)] max-[420px]:px-2"
                  href={item.href}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
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
