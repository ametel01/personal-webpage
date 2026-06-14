"use client";

import { BriefcaseBusiness, CodeXml, Download, FileText, Mail } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Container, ExternalLink } from "@/components/primitives";
import { primaryNavItems } from "@/lib/navigation";
import { site } from "@/lib/site";

const footerLinks = [
  {
    label: "Email",
    href: `mailto:${site.email}`,
    external: false,
    icon: Mail
  },
  {
    label: "GitHub",
    href: site.githubUrl,
    external: true,
    icon: CodeXml
  },
  {
    label: "LinkedIn",
    href: site.linkedinUrl,
    external: true,
    icon: BriefcaseBusiness
  },
  {
    label: "Resume",
    href: site.resumePath,
    external: false,
    icon: FileText
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
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--color-border)] bg-white/95 backdrop-blur">
      <Container className="site-shell-container flex min-h-16 items-center justify-between gap-8">
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
                  aria-current={isActivePath(pathname, item.href) ? "page" : undefined}
                  className="nav-link"
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

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SiteFooter() {
  return (
    <footer className="border-t border-[var(--color-border-soft)] bg-white">
      <Container className="site-shell-container flex items-center justify-between gap-6 py-8 max-[720px]:flex-col max-[720px]:items-start">
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
                  <ExternalLink className="footer-link" href={item.href}>
                    <item.icon aria-hidden="true" size={17} strokeWidth={2.2} />
                    {item.label}
                  </ExternalLink>
                ) : (
                  <Link className="footer-link" href={item.href}>
                    <item.icon aria-hidden="true" size={17} strokeWidth={2.2} />
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
