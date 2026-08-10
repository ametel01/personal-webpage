export const aiCrawlerUserAgents = [
  {
    name: "OpenAI search",
    value: "OAI-SearchBot/1.0"
  },
  {
    name: "OpenAI training",
    value: "GPTBot/1.2"
  },
  {
    name: "ChatGPT user retrieval",
    value: "ChatGPT-User/1.0"
  },
  {
    name: "Anthropic",
    value: "ClaudeBot/1.0"
  },
  {
    name: "Perplexity search",
    value:
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)"
  },
  {
    name: "Perplexity user retrieval",
    value:
      "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Perplexity-User/1.0; +https://perplexity.ai/perplexity-user)"
  }
] as const;

export const retrievalSmokeTargets = [
  {
    path: "/",
    contentType: "text/html"
  },
  {
    path: "/robots.txt",
    contentType: "text/plain"
  },
  {
    path: "/sitemap.xml",
    contentType: "application/xml"
  },
  {
    path: "/llms.txt",
    contentType: "text/plain"
  }
] as const;
