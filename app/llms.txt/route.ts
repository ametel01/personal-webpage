import { createLlmsText } from "@/lib/crawl";

export const dynamic = "force-static";

export function GET() {
  return new Response(createLlmsText(), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
