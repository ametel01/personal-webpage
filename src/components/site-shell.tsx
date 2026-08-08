"use client";

import { BriefcaseBusiness, CodeXml, FileText, Mail } from "lucide-react";
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
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <SiteHeader />
      {children}
      <SiteFooter />
    </>
  );
}

function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Container className="site-shell-container site-header-inner">
        <Link aria-label="Alex Metelli home" className="site-brand-link" href="/">
          <Image
            className="site-logo-mark"
            src="/images/logo-mark.png"
            alt=""
            width={54}
            height={28}
            priority
            aria-hidden="true"
          />
          <span className="site-brand-name">Alex Metelli</span>
        </Link>
        <nav className="site-primary-nav" aria-label="Primary navigation">
          <ul className="site-nav-list">
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
    <footer className="site-footer">
      <Container className="site-shell-container site-footer-inner">
        <div>
          <p className="site-footer-name">{site.name}</p>
          <a className="site-footer-email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
        </div>
        <nav aria-label="Footer navigation">
          <ul className="site-footer-links">
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
