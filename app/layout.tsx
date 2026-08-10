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
        {/*
          THESIS: Technical answers form a navigable evidence atlas, refusing the generic reverse-chronological blog feed.
          OWN-WORLD: Warm paper, navy ink, restrained blue paths, serif reading hierarchy, and precise hairline rules.
          STORY: A search visitor finds one answer, understands the implementation tradeoffs, and follows adjacent evidence.
          FIRST VIEWPORT: Large title above a two-thirds featured guide bridged to a four-topic rail; article rows continue below.
          FORM: Topic atlas, ordered candidate 7; seed 1eecc62e.
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        <SiteShell>{children}</SiteShell>
        <Analytics />
      </body>
    </html>
  );
}
