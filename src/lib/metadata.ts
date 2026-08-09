import type { Metadata } from "next";
import { seoEntity } from "@/lib/seo";
import { defaultDescription, site } from "@/lib/site";

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
  const sharedOpenGraph = {
    title: fullTitle,
    description,
    url: getAbsoluteUrl(path),
    siteName: site.name,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.name} - ${site.role}`
      }
    ]
  };

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path
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
      images: ["/og.png"]
    }
  };
}

export const homeTitle =
  "Alex Metelli - Software Engineer | Backend, Developer Infrastructure, AI Tooling";

export const homeMetadata = createPageMetadata({
  title: homeTitle,
  description: defaultDescription,
  path: "/",
  absoluteTitle: true
});
