import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { StoriesBrowser } from "@/components/stories-browser";
import { getStorySummaries } from "@/lib/sanity";
import { getRouteMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = getRouteMetadata("stories", "en");

export default async function StoriesPage() {
  const allStories = await getStorySummaries();

  return (
    <>
      <main id="main">
        <StoriesBrowser stories={allStories} />
      </main>

      <SiteFooter />
    </>
  );
}
