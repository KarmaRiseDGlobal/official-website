import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { StoryDetailClient } from "@/components/story-detail-client";
import { getStoryBySlug, getStorySummaries } from "@/lib/sanity";
import { getStoryMetadata } from "@/lib/seo";

export const revalidate = 300;
export const dynamicParams = true;

export async function generateStaticParams() {
  const stories = await getStorySummaries();
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  return getStoryMetadata(story, "es");
}

export default async function SpanishStoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [story, allStories] = await Promise.all([
    getStoryBySlug(slug),
    getStorySummaries(),
  ]);

  if (!story) {
    notFound();
  }

  return (
    <>
      <main id="main">
        <StoryDetailClient story={story} allStories={allStories} />
      </main>

      <SiteFooter />
    </>
  );
}
