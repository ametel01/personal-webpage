import type { MetadataRoute } from "next";
import { getCrawlPages } from "@/lib/crawl";
import { getAbsoluteUrl } from "@/lib/metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  return getCrawlPages().map(({ path, lastModified }) => ({
    url: getAbsoluteUrl(path),
    lastModified
  }));
}
