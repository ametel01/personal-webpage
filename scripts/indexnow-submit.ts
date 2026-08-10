const indexNowEndpoint = "https://api.indexnow.org/indexnow";
const indexNowKey = "2d8c3949176588cdca597e71fddc0753";
const maximumUrlsPerRequest = 10_000;

export function extractSitemapUrls(xml: string, siteUrl: URL) {
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => {
    const value = (match[1] ?? "").replaceAll("&amp;", "&");
    return new URL(value);
  });

  if (urls.length === 0) {
    throw new Error("The production sitemap did not contain any URLs.");
  }

  if (urls.length > maximumUrlsPerRequest) {
    throw new Error(`The sitemap exceeds IndexNow's ${maximumUrlsPerRequest}-URL request limit.`);
  }

  for (const url of urls) {
    if (url.protocol !== "https:" || url.hostname !== siteUrl.hostname) {
      throw new Error(`Refusing to submit an out-of-scope sitemap URL: ${url.toString()}`);
    }
  }

  return urls.map((url) => url.toString());
}

export function createIndexNowPayload(siteUrl: URL, urlList: readonly string[]) {
  return {
    host: siteUrl.hostname,
    key: indexNowKey,
    keyLocation: new URL(`/${indexNowKey}.txt`, siteUrl).toString(),
    urlList
  };
}

export async function submitIndexNow(siteUrlValue = "https://www.ametel.dev") {
  const siteUrl = new URL(siteUrlValue);
  const sitemapUrl = new URL("/sitemap.xml", siteUrl);
  const sitemapResponse = await fetch(sitemapUrl);

  if (!sitemapResponse.ok) {
    throw new Error(`Could not fetch ${sitemapUrl}: HTTP ${sitemapResponse.status}`);
  }

  const urlList = extractSitemapUrls(await sitemapResponse.text(), siteUrl);
  const response = await fetch(indexNowEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8"
    },
    body: JSON.stringify(createIndexNowPayload(siteUrl, urlList))
  });

  if (response.status !== 200 && response.status !== 202) {
    const detail = (await response.text()).trim();
    throw new Error(
      `IndexNow rejected ${urlList.length} URLs with HTTP ${response.status}${detail ? `: ${detail}` : ""}`
    );
  }

  console.log(`IndexNow accepted ${urlList.length} URLs with HTTP ${response.status}.`);
}

if (import.meta.main) {
  await submitIndexNow(process.env.INDEXNOW_SITE_URL);
}
