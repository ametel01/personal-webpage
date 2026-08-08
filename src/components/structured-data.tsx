import { type StructuredDataGraph, serializeStructuredData } from "@/lib/structured-data";

export function StructuredData({ data }: { data: StructuredDataGraph }) {
  return <script type="application/ld+json">{serializeStructuredData(data)}</script>;
}
