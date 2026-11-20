import type { MetadataRoute } from "next";

import { getStorySummaries } from "@/lib/sanity";
import { localizePath, siteUrl, STATIC_ROUTES } from "@/lib/seo";

export const revalidate = 300;

function parseLastModified(value: string | undefined, fallback: Date): Date {
  if (!value) {
    return fallback;
  }
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? fallback : parsed;
}

function toAbsoluteUrl(path: string): string {
  return path === "/" ? siteUrl : `${siteUrl}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const stories = await getStorySummaries();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap(
    (route) => {
      const enUrl = toAbsoluteUrl(localizePath(route.path, "en"));
      const esUrl = toAbsoluteUrl(localizePath(route.path, "es"));
      const alternates = {
        languages: {
          en: enUrl,
          es: esUrl,
          "x-default": enUrl,
        },
      };

      return [
        {
          url: enUrl,
          lastModified: now,
          changeFrequency: route.changeFrequency,
          priority: route.priority,
          alternates,
        },
        {
          url: esUrl,
          lastModified: now,
          changeFrequency: route.changeFrequency,
          priority: route.priority,
          alternates,
        },
      ];
    },
  );

  const seenSlugs = new Set<string>();
  const storyEntries: MetadataRoute.Sitemap = [];

  for (const story of stories) {
    const slug = typeof story.slug === "string" ? story.slug.trim() : "";
    if (!slug || seenSlugs.has(slug)) {
      continue;
    }
    seenSlugs.add(slug);

    const storyPath = `/stories/${slug}`;
    const enUrl = toAbsoluteUrl(localizePath(storyPath, "en"));
    const esUrl = toAbsoluteUrl(localizePath(storyPath, "es"));
    const lastModified = parseLastModified(story.publishedAt, now);
    const alternates = {
      languages: {
        en: enUrl,
        es: esUrl,
        "x-default": enUrl,
      },
    };

    storyEntries.push(
      {
        url: enUrl,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates,
      },
      {
        url: esUrl,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates,
      },
    );
  }

  return [...staticEntries, ...storyEntries];
}
