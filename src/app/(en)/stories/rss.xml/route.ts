import { buildStoriesRssXml } from "@/lib/rss";
import { getStorySummaries } from "@/lib/sanity";

export const revalidate = 300;

export async function GET() {
  const stories = await getStorySummaries();
  const xml = buildStoriesRssXml("en", stories);

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
