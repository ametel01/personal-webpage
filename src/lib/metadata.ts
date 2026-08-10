import type { Metadata } from "next";
import { seoEntity } from "@/lib/seo";
import { site } from "@/lib/site";

export function resolveSiteUrl() {
  return new URL(seoEntity.canonicalUrl);
}

export const siteUrl = resolveSiteUrl();

export function getAbsoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  publishedTime,
  modifiedTime
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  const canonicalUrl = getAbsoluteUrl(path);
  const openGraphImageUrl = getAbsoluteUrl("/og.png");
  const sharedOpenGraph = {
    title: fullTitle,
    description,
    url: canonicalUrl,
    siteName: site.name,
    images: [
      {
        url: openGraphImageUrl,
        width: 1200,
        height: 630,
        alt: fullTitle
      }
    ]
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: publishedTime
      ? {
          ...sharedOpenGraph,
          type: "article",
          publishedTime,
          modifiedTime,
          authors: [site.name]
        }
      : {
          ...sharedOpenGraph,
          type: "website"
        },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [openGraphImageUrl]
    }
  };
}

export const homeTitle =
  "Software Engineer — Backend, Developer Infrastructure, and AI Tooling | Alex Metelli";

export const homeMetadata = createPageMetadata({
  title: homeTitle,
  description:
    "Selected backend, developer infrastructure, AI tooling, and blockchain engineering projects, with technical case studies, field notes, and experience.",
  path: "/",
  absoluteTitle: true
});
