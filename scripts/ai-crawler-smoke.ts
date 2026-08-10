import { aiCrawlerUserAgents, retrievalSmokeTargets } from "./ai-crawler-config";

const configuredBaseUrl = process.env.SEO_BASE_URL ?? "https://www.ametel.dev";
const baseUrl = new URL(configuredBaseUrl);

if (!new Set(["http:", "https:"]).has(baseUrl.protocol)) {
  throw new Error(`SEO_BASE_URL must use HTTP or HTTPS, received ${baseUrl.protocol}`);
}

const failures: string[] = [];
let successfulRequests = 0;

for (const crawler of aiCrawlerUserAgents) {
  for (const target of retrievalSmokeTargets) {
    const url = new URL(target.path, baseUrl);
    try {
      const response = await fetch(url, {
        headers: {
          Accept: "*/*",
          "User-Agent": crawler.value
        },
        redirect: "manual"
      });
      const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";

      if (response.status !== 200) {
        failures.push(`${crawler.name} received ${response.status} from ${url.toString()}`);
        continue;
      }

      if (!contentType.startsWith(target.contentType)) {
        failures.push(
          `${crawler.name} received ${contentType || "no content type"} from ${url.toString()}; expected ${target.contentType}`
        );
        continue;
      }

      successfulRequests += 1;
    } catch (error) {
      failures.push(
        `${crawler.name} could not retrieve ${url.toString()}: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }
}

if (failures.length > 0) {
  throw new Error(
    `${successfulRequests} crawler smoke requests passed and ${failures.length} failed:\n- ${failures.join("\n- ")}`
  );
}

console.log(
  `${successfulRequests} AI crawler smoke requests passed for ${aiCrawlerUserAgents.length} user agents across ${retrievalSmokeTargets.length} retrieval targets at ${baseUrl.origin}.`
);
