import { getLocalizedStory, type StorySummary } from "@/data/story-types";
import { localizePath, siteUrl, type SiteLanguage } from "@/lib/urls";

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function toRfc2822(isoDate: string | undefined): string {
  const parsed = isoDate ? new Date(isoDate) : new Date();
  return Number.isNaN(parsed.getTime())
    ? new Date().toUTCString()
    : parsed.toUTCString();
}

export function buildStoriesRssXml(
  lang: SiteLanguage,
  stories: readonly StorySummary[],
): string {
  const isEs = lang === "es";
  const channelLink = `${siteUrl}${localizePath("/stories", lang)}`;
  const feedUrl = `${siteUrl}${isEs ? "/es/stories/rss.xml" : "/stories/rss.xml"}`;
  const channelTitle = isEs
    ? "Historias de KarmaRise D Global"
    : "KarmaRise D Global Stories";
  const channelDescription = isEs
    ? "Relatos en primera persona de Alma y Shirish sobre unidades de producción y marroquineros en la India, pruebas físicas, AlmaRise D Reborn, AlmaRise D Organic y costumbres compartidas entre España y la India."
    : "First-person Stories by Alma and Shirish from Indian production units and leather ateliers, physical sample reviews, AlmaRise D Reborn, AlmaRise D Organic, and everyday life between Spain and India.";

  const latestDate = stories.reduce<string>((latest, story) => {
    const candidate = story.updatedAt || story.publishedAt || "";
    return candidate > latest ? candidate : latest;
  }, stories[0]?.publishedAt || new Date().toISOString());

  const itemsXml = stories
    .map((story) => {
      const localized = getLocalizedStory(story, lang);
      const itemUrl = `${siteUrl}${localizePath(`/stories/${story.slug}`, lang)}`;
      const categories = [localized.categoryLabel, ...localized.tags]
        .filter(Boolean)
        .map((cat) => `      <category>${escapeXml(cat)}</category>`)
        .join("\n");

      return `    <item>
      <title>${escapeXml(localized.title)}</title>
      <link>${escapeXml(itemUrl)}</link>
      <guid isPermaLink="true">${escapeXml(itemUrl)}</guid>
      <pubDate>${escapeXml(toRfc2822(story.publishedAt))}</pubDate>
      <author>stories@karmarisedglobal.com (${escapeXml(story.author.name)})</author>
      <description>${escapeXml(localized.summary)}</description>
${categories}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(channelTitle)}</title>
    <link>${escapeXml(channelLink)}</link>
    <description>${escapeXml(channelDescription)}</description>
    <language>${isEs ? "es-ES" : "en-GB"}</language>
    <lastBuildDate>${escapeXml(toRfc2822(latestDate))}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${itemsXml}
  </channel>
</rss>
`;
}
