import type { Metadata } from "next";
import { defaultDescription, site } from "@/lib/site";

const fallbackSiteUrl = "http://localhost:3000";

export function resolveSiteUrl() {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!configuredUrl) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("NEXT_PUBLIC_SITE_URL is required for production metadata.");
    }

    return new URL(fallbackSiteUrl);
  }

  try {
    return new URL(configuredUrl);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be a valid URL.");
  }
}

export const siteUrl = resolveSiteUrl();

export function getAbsoluteUrl(path: string) {
  return new URL(path, siteUrl).toString();
}

export function createPageMetadata({
  title,
  description,
  path,
  absoluteTitle = false
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical: path
    },
    openGraph: {
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
      ],
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
  "Alex Metelli - Software Engineer | Backend, Developer Tooling, Blockchain Infrastructure";

export const homeMetadata = createPageMetadata({
  title: homeTitle,
  description: defaultDescription,
  path: "/",
  absoluteTitle: true
});
