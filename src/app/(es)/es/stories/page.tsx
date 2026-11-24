import type { Metadata } from "next";

import { SiteFooter } from "@/components/shell/site-footer";
import { StoriesBrowser } from "@/views/stories-browser";
import { getStorySummaries } from "@/lib/sanity";
import { getRouteMetadata } from "@/lib/seo";
import {
  getStoriesIndexStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";

export const revalidate = 300;

export const metadata: Metadata = getRouteMetadata("stories", "es");

export default async function SpanishStoriesPage() {
  const allStories = await getStorySummaries();
  const structuredData = getStoriesIndexStructuredData("es", allStories);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <main id="main">
        <StoriesBrowser lang="es" stories={allStories} />
      </main>

      <SiteFooter hideNewsletter />
    </>
  );
}
