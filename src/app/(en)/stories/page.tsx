import type { Metadata } from "next";

import { SiteFooter } from "@/components/site-footer";
import { StoriesBrowser } from "@/components/stories-browser";
import { getStories } from "@/lib/sanity";
import { getRouteMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata: Metadata = getRouteMetadata("stories", "en");

export default async function StoriesPage() {
  const allStories = await getStories();

  return (
    <>
      <main id="main">
        <StoriesBrowser stories={allStories} />
      </main>

      <SiteFooter />
    </>
  );
}
