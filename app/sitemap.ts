import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { getAbsoluteUrl } from "@/lib/metadata";

const staticRoutes = ["/", "/work", "/about", "/resume", "/resume.pdf"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [...staticRoutes, ...projects.map((project) => `/work/${project.slug}` as const)];

  return routes.map((route) => ({
    url: getAbsoluteUrl(route),
    lastModified: new Date("2026-06-12")
  }));
}
