import { writingArticles } from "@/content/writing";
import { getAbsoluteUrl } from "@/lib/metadata";
import { defaultDescription, site } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toRssDate(date: string) {
  return new Date(`${date}T00:00:00.000Z`).toUTCString();
}

export function createRssFeed() {
  const feedUrl = getAbsoluteUrl("/feed.xml");
  const writingUrl = getAbsoluteUrl("/writing");
  const lastBuildDate = toRssDate(
    writingArticles.reduce<string>(
      (latest, article) => (article.updatedAt > latest ? article.updatedAt : latest),
      writingArticles[0].updatedAt
    )
  );

  const items = writingArticles.map((article) => {
    const articleUrl = getAbsoluteUrl(`/writing/${article.slug}`);

    return [
      "    <item>",
      `      <title>${escapeXml(article.title)}</title>`,
      `      <link>${escapeXml(articleUrl)}</link>`,
      `      <guid isPermaLink="true">${escapeXml(articleUrl)}</guid>`,
      `      <description>${escapeXml(article.description)}</description>`,
      `      <pubDate>${toRssDate(article.publishedAt)}</pubDate>`,
      "    </item>"
    ].join("\n");
  });

  return `${[
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(`${site.name} — Technical Writing`)}</title>`,
    `    <link>${escapeXml(writingUrl)}</link>`,
    `    <description>${escapeXml(defaultDescription)}</description>`,
    "    <language>en</language>",
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />`,
    ...items,
    "  </channel>",
    "</rss>"
  ].join("\n")}\n`;
}
