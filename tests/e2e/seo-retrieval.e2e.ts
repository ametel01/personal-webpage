import { type APIRequestContext, expect, type Page, test } from "@playwright/test";
import { aiCrawlerUserAgents, retrievalSmokeTargets } from "../../scripts/ai-crawler-config";
import { getCrawlPages } from "../../src/lib/crawl";
import { seoEntity } from "../../src/lib/seo";

const canonicalOrigin = new URL(seoEntity.canonicalUrl);
const crawlPages = getCrawlPages();
const indexableHtmlPages = crawlPages.filter(({ path }) => !path.endsWith(".pdf"));
const personReferenceProperties = new Set(["author", "creator", "publisher"]);

type SitemapEntry = {
  location: string;
  lastModified: string;
};

function decodeHtml(value: string) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16))
    )
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 10)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function normalizeText(value: string) {
  return decodeHtml(
    value
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
      .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/\s+/g, " ")
    .trim();
}

function getAttribute(markup: string, name: string) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = markup.match(
    new RegExp(`\\s${escapedName}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "i")
  );

  return match ? decodeHtml(match[1] ?? match[2] ?? match[3] ?? "") : undefined;
}

function getTags(html: string, tagName: string) {
  return html.match(new RegExp(`<${tagName}\\b[^>]*>`, "gi")) ?? [];
}

function getElementContents(html: string, tagName: string) {
  return [
    ...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>([\\s\\S]*?)<\\/${tagName}>`, "gi"))
  ].map((match) => match[1] ?? "");
}

function getMetadataContent(html: string, name: string) {
  const tag = getTags(html, "meta").find(
    (candidate) => getAttribute(candidate, "name")?.toLowerCase() === name
  );

  return tag ? getAttribute(tag, "content") : undefined;
}

function getJsonLdScripts(html: string) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(
      (match) =>
        getAttribute(`<script${match[1] ?? ""}>`, "type")?.toLowerCase() === "application/ld+json"
    )
    .map((match) => match[2] ?? "");
}

function getSitemapEntries(xml: string): SitemapEntry[] {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/gi)].map((match) => {
    const block = match[1] ?? "";
    const location = block.match(/<loc>([\s\S]*?)<\/loc>/i)?.[1];
    const lastModified = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/i)?.[1];

    if (!location || !lastModified) {
      throw new Error(`Sitemap entry is missing loc or lastmod: ${block}`);
    }

    return {
      location: decodeHtml(location.trim()),
      lastModified: normalizeText(lastModified)
    };
  });
}

function collectPersonReferenceIds(value: unknown, property?: string): string[] {
  if (Array.isArray(value)) {
    return value.flatMap((item) => collectPersonReferenceIds(item, property));
  }

  if (!value || typeof value !== "object") {
    return [];
  }

  const record = value as Record<string, unknown>;
  const ids: string[] = [];

  if (record["@type"] === "Person" && typeof record["@id"] === "string") {
    ids.push(record["@id"]);
  }

  if (property && personReferenceProperties.has(property) && typeof record["@id"] === "string") {
    ids.push(record["@id"]);
  }

  for (const [key, child] of Object.entries(record)) {
    ids.push(...collectPersonReferenceIds(child, key));
  }

  return ids;
}

async function getInitialHtml(request: APIRequestContext, path: string) {
  const response = await request.get(path, { maxRedirects: 0 });
  const html = await response.text();

  expect(response.status(), `${path} should return 200 without redirecting`).toBe(200);
  expect(response.headers()["content-type"], `${path} should return HTML`).toContain("text/html");
  expect(
    response.headers()["x-robots-tag"]?.toLowerCase() ?? "",
    `${path} should not send noindex in X-Robots-Tag`
  ).not.toContain("noindex");

  return html;
}

async function assertVisibleH1(page: Page, path: string, initialHtml: string) {
  const response = await page.goto(path);

  expect(response?.status(), `${path} should render with a 200 response`).toBe(200);
  await expect(page.locator("h1:visible"), `${path} should expose one visible h1`).toHaveCount(1);

  const visibleH1 = normalizeText(await page.locator("h1:visible").innerText());
  const initialH1s = getElementContents(initialHtml, "h1").map(normalizeText);

  expect(initialH1s, `${path} should render its h1 in the initial HTML`).toEqual([visibleH1]);
}

test.describe("SEO and retrieval gates", () => {
  test("every indexable page has unique metadata and crawlable initial HTML", async ({
    page,
    request
  }) => {
    const seenTitles = new Map<string, string>();
    const seenDescriptions = new Map<string, string>();
    const personIds: string[] = [];

    for (const { path } of indexableHtmlPages) {
      const html = await getInitialHtml(request, path);
      const title = normalizeText(getElementContents(html, "title")[0] ?? "");
      const description = getMetadataContent(html, "description")?.trim() ?? "";
      const canonicalTags = getTags(html, "link").filter((tag) =>
        getAttribute(tag, "rel")?.toLowerCase().split(/\s+/).includes("canonical")
      );
      const expectedCanonical = new URL(path, canonicalOrigin).toString();
      const robotsContent = getMetadataContent(html, "robots")?.toLowerCase() ?? "";
      const mainText = normalizeText(getElementContents(html, "main")[0] ?? "");

      expect(canonicalTags, `${path} should have exactly one canonical link`).toHaveLength(1);
      expect(
        getAttribute(canonicalTags[0] ?? "", "href"),
        `${path} canonical should be stable`
      ).toBeDefined();
      expect(
        new URL(getAttribute(canonicalTags[0] ?? "", "href") ?? "", canonicalOrigin).toString(),
        `${path} canonical should resolve to its public URL`
      ).toBe(expectedCanonical);
      expect(title, `${path} should have a title`).not.toBe("");
      expect(description, `${path} should have a meta description`).not.toBe("");
      expect(
        seenTitles.get(title),
        `${path} duplicates the title used by ${seenTitles.get(title)}`
      ).toBe(undefined);
      expect(
        seenDescriptions.get(description),
        `${path} duplicates the description used by ${seenDescriptions.get(description)}`
      ).toBe(undefined);
      expect(robotsContent, `${path} should not contain noindex`).not.toContain("noindex");
      expect(
        mainText.length,
        `${path} should render substantive content in its initial HTML`
      ).toBeGreaterThan(250);

      seenTitles.set(title, path);
      seenDescriptions.set(description, path);

      for (const json of getJsonLdScripts(html)) {
        const data = JSON.parse(json) as unknown;
        personIds.push(...collectPersonReferenceIds(data));
      }

      await assertVisibleH1(page, path, html);
    }

    expect(
      personIds.length,
      "structured data should contain person entities or references"
    ).toBeGreaterThan(0);
    expect(
      new Set(personIds),
      "all structured-data person references should share one @id"
    ).toEqual(new Set([seoEntity.personId]));
  });

  test("initial HTML does not expose internal design contracts", async ({ request }) => {
    for (const { path } of indexableHtmlPages) {
      const html = await getInitialHtml(request, path);

      expect(html, `${path} should not expose internal direction-contract payloads`).not.toMatch(
        /<script\b[^>]*\bid=["']impeccable(?:-[^"']+)?-direction-contract["']/i
      );
      expect(html, `${path} should not expose internal finish instructions`).not.toContain(
        "unreviewed and undocumented is unfinished"
      );
    }
  });

  test("every sitemap URL resolves and its modification date matches content metadata", async ({
    request
  }) => {
    const response = await request.get("/sitemap.xml", { maxRedirects: 0 });
    const xml = await response.text();
    const sitemapEntries = getSitemapEntries(xml);
    const expectedDates = new Map(crawlPages.map(({ path, lastModified }) => [path, lastModified]));

    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("application/xml");
    expect(sitemapEntries).toHaveLength(crawlPages.length);

    for (const entry of sitemapEntries) {
      const url = new URL(entry.location);
      const path = url.pathname;

      expect(url.origin, `${entry.location} should use the canonical origin`).toBe(
        canonicalOrigin.origin
      );
      expect(
        expectedDates.get(path),
        `${path} should be declared in content-derived crawl metadata`
      ).toBe(entry.lastModified);

      const pageResponse = await request.get(`${path}${url.search}`, { maxRedirects: 0 });
      expect(pageResponse.status(), `${entry.location} should resolve with 200`).toBe(200);
    }

    expect(new Set(sitemapEntries.map(({ location }) => new URL(location).pathname))).toEqual(
      new Set(crawlPages.map(({ path }) => path))
    );
  });

  test("all internal links in initial HTML resolve", async ({ request }) => {
    const links = new Map<string, { source: string; fragment: string }>();

    for (const { path } of indexableHtmlPages) {
      const html = await getInitialHtml(request, path);

      for (const anchor of getTags(html, "a")) {
        const href = getAttribute(anchor, "href");

        if (!href) {
          continue;
        }

        const url = new URL(href, new URL(path, canonicalOrigin));

        if (url.origin !== canonicalOrigin.origin) {
          continue;
        }

        const target = `${url.pathname}${url.search}`;
        links.set(`${target}${url.hash}`, {
          source: path,
          fragment: decodeURIComponent(url.hash.slice(1))
        });
      }
    }

    expect(links.size, "the crawlable pages should expose internal links").toBeGreaterThan(0);

    for (const [href, { source, fragment }] of links) {
      const url = new URL(href, canonicalOrigin);
      const response = await request.get(`${url.pathname}${url.search}`);

      expect(response.ok(), `${source} links to unresolved internal URL ${href}`).toBe(true);

      if (fragment && response.headers()["content-type"]?.includes("text/html")) {
        const targetHtml = await response.text();
        const targetIds = getTags(targetHtml, "[a-z][a-z0-9-]*")
          .map((tag) => getAttribute(tag, "id"))
          .filter(Boolean);

        expect(targetIds, `${source} links to missing fragment ${href}`).toContain(fragment);
      }
    }
  });

  test("retrieval files have stable media types and content", async ({ request }) => {
    const expectedContent = new Map([
      ["/robots.txt", ["User-Agent: *", "Allow: /", "Sitemap:"]],
      ["/sitemap.xml", ["<urlset", "<loc>", "<lastmod>"]],
      ["/llms.txt", ["# Alex Metelli", "## Canonical pages", "## Technical articles"]]
    ]);

    for (const target of retrievalSmokeTargets.filter(({ path }) => path !== "/")) {
      const response = await request.get(target.path, { maxRedirects: 0 });
      const body = await response.text();

      expect(response.status(), `${target.path} should return 200`).toBe(200);
      expect(
        response.headers()["content-type"],
        `${target.path} should use ${target.contentType}`
      ).toContain(target.contentType);

      for (const marker of expectedContent.get(target.path) ?? []) {
        expect(body, `${target.path} should contain ${marker}`).toContain(marker);
      }
    }
  });

  test("AI crawler user agents can retrieve HTML and discovery files", async ({ request }) => {
    for (const crawler of aiCrawlerUserAgents) {
      for (const target of retrievalSmokeTargets) {
        const response = await request.get(target.path, {
          headers: {
            "User-Agent": crawler.value
          },
          maxRedirects: 0
        });

        expect(response.status(), `${crawler.name} should receive 200 from ${target.path}`).toBe(
          200
        );
        expect(
          response.headers()["content-type"],
          `${crawler.name} should receive ${target.contentType} from ${target.path}`
        ).toContain(target.contentType);
      }
    }
  });
});
