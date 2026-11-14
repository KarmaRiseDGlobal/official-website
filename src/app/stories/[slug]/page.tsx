import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/site-footer";
import { StoryMedia } from "@/components/story-media";
import { getStories, getStoryBySlug } from "@/lib/sanity";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story) {
    return { title: "Story" };
  }

  return {
    title: story.title,
    description: story.summary,
  };
}

export default async function StoryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [story, allStories] = await Promise.all([
    getStoryBySlug(slug),
    getStories(),
  ]);

  if (!story) {
    notFound();
  }

  const currentIndex = allStories.findIndex((entry) => entry.slug === slug);
  const nextStory =
    allStories.length > 1 && currentIndex >= 0
      ? allStories[(currentIndex + 1) % allStories.length]
      : undefined;

  return (
    <>
      <main id="main">
        <article className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-2xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-lg)]">
              <Link
                className="w-fit text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/stories"
              >
                Back to Stories
              </Link>

              <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                {story.category} · {story.location}
              </p>

              <h1 className="max-w-[18ch] text-[clamp(2.75rem,5.5vw,5.25rem)] leading-[0.94] font-medium">
                {story.title}
              </h1>

              <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
                {story.summary}
              </p>
            </div>

            <StoryMedia
              image={story.leadImage}
              kind={story.leadSlot.kind}
              ratio="16:9 wide"
              aspectClass="aspect-[16/9]"
              title={story.leadSlot.title}
              description={story.leadSlot.description}
              sizes="(max-width: 80rem) 100vw, 1200px"
              priority
            />

            <div className="mx-auto grid w-full max-w-[64ch] gap-[var(--space-xl)]">
              {story.sections.map((section) => (
                <section key={section.heading} className="grid gap-4">
                  <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="text-[length:var(--text-md)] leading-[1.7] text-[var(--color-ink)]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </section>
              ))}
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              {story.pairSlots.map((slot, index) => (
                <StoryMedia
                  key={slot.title}
                  image={story.pairImages?.[index]}
                  kind="Photo"
                  ratio="4:5 portrait"
                  aspectClass="aspect-[4/5]"
                  title={slot.title}
                  description={slot.description}
                  sizes="(max-width: 48rem) 100vw, 50vw"
                />
              ))}
            </div>

            <div className="mx-auto grid w-full max-w-[64ch] gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-8">
              <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                Key takeaway
              </p>
              <p className="font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.15] font-medium text-[var(--color-forest-deep)]">
                {story.takeaway}
              </p>
              <div className="flex flex-wrap gap-6 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)] font-semibold">
                <Link
                  className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href="/product-brief"
                >
                  Discuss a similar product
                </Link>
                {nextStory ? (
                  <Link
                    className="underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={`/stories/${nextStory.slug}`}
                  >
                    Next Story: {nextStory.title}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </article>
      </main>

      <SiteFooter />
    </>
  );
}
