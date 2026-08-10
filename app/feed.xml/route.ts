import { createRssFeed } from "@/lib/feed";

export const dynamic = "force-static";

export function GET() {
  return new Response(createRssFeed(), {
    headers: {
      "Cache-Control": "public, max-age=0, s-maxage=3600",
      "Content-Type": "application/rss+xml; charset=utf-8"
    }
  });
}
