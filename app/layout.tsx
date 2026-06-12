import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";
import { siteUrl } from "@/lib/metadata";
import { defaultDescription, site } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: `${site.name} - ${site.role}`,
    template: `%s | ${site.name}`
  },
  description: defaultDescription,
  openGraph: {
    title: `${site.name} - ${site.role}`,
    description: defaultDescription,
    url: "/",
    siteName: site.name,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} - ${site.role}`
      }
    ],
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} - ${site.role}`,
    description: defaultDescription,
    images: ["/og.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
