import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { writingArticles } from "@/content/writing";
import { getAbsoluteUrl } from "@/lib/metadata";

const staticRoutes = ["/", "/work", "/writing", "/about", "/resume", "/resume.pdf"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    ...staticRoutes,
    ...projects.map((project) => `/work/${project.slug}` as const),
    ...writingArticles.map((article) => `/writing/${article.slug}` as const)
  ];

  return routes.map((route) => ({
    url: getAbsoluteUrl(route),
    lastModified: route.startsWith("/writing/")
      ? new Date(
          writingArticles.find((article) => `/writing/${article.slug}` === route)?.updatedAt ??
            "2026-08-09"
        )
      : route === "/writing"
        ? new Date("2026-08-09")
        : new Date("2026-06-12")
  }));
}
