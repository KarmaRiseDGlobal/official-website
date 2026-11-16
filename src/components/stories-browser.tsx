"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { StoryMedia } from "@/components/story-media";
import {
  formatStoryDate,
  getCategoryDetail,
  storyCategories,
  storyCategoryDetails,
  type StoryCategory,
  type StoryEntry,
} from "@/data/stories";

interface StoriesBrowserProps {
  stories: StoryEntry[];
}

export function StoriesBrowser({ stories }: StoriesBrowserProps) {
  const [activeCategory, setActiveCategory] = useState<
    "All Stories" | StoryCategory
  >("All Stories");
  const browserTopRef = useRef<HTMLDivElement>(null);

  const filteredStories =
    activeCategory === "All Stories"
      ? stories
      : stories.filter((story) => story.category === activeCategory);

  const featured =
    filteredStories.find((story) => story.featured) ?? filteredStories[0];
  const remaining = filteredStories.filter(
    (story) => story.slug !== featured?.slug,
  );

  const pairStories = remaining.slice(0, 2);
  const trioStories = remaining.slice(2);

  const activeCategoryDetail =
    activeCategory === "All Stories" ? null : getCategoryDetail(activeCategory);

  function selectCategoryAndScroll(category: "All Stories" | StoryCategory) {
    setActiveCategory(category);
    browserTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div
      ref={browserTopRef}
      className="grid scroll-mt-32 gap-[var(--space-3xl)]"
    >
      {/* Category filter bar */}
      <div className="grid gap-6 border-b border-[var(--color-rule)] pb-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-1">
            <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)] uppercase">
              Browse by editorial pillar
            </p>
            <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]">
              {activeCategory === "All Stories"
                ? "All published Stories"
                : `${activeCategoryDetail?.number}. ${activeCategory}`}
            </h2>
          </div>
          <p className="num text-[length:var(--text-sm)] text-[var(--color-muted)]">
            Showing {filteredStories.length}{" "}
            {filteredStories.length === 1 ? "Story" : "Stories"} · EN / ES
            editions
          </p>
        </div>

        <div
          className="flex flex-wrap gap-2.5"
          role="group"
          aria-label="Filter Stories by editorial pillar"
        >
          {storyCategories.map((category) => {
            const isActive = category === activeCategory;
            const detail =
              category === "All Stories" ? null : getCategoryDetail(category);
            const count =
              category === "All Stories"
                ? stories.length
                : stories.filter((story) => story.category === category).length;

            return (
              <button
                key={category}
                type="button"
                aria-pressed={isActive}
                onClick={() => setActiveCategory(category)}
                className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-[var(--radius-pill)] border px-4 py-2 text-[length:var(--text-sm)] font-medium transition-colors ${
                  isActive
                    ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                    : "border-[var(--color-rule)] bg-[var(--color-paper-2)]/45 text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-paper-2)]"
                }`}
              >
                {detail ? (
                  <span
                    className={`num text-[length:var(--text-xs)] font-semibold ${
                      isActive
                        ? "text-[var(--color-gold)]"
                        : "text-[var(--color-clay-ink)]"
                    }`}
                  >
                    {detail.number}
                  </span>
                ) : null}
                <span>{category}</span>
                <span
                  className={`num text-[length:var(--text-xs)] ${
                    isActive
                      ? "text-[var(--color-paper-2)]"
                      : "text-[var(--color-muted)]"
                  }`}
                >
                  ({count})
                </span>
              </button>
            );
          })}
        </div>

        {activeCategoryDetail ? (
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]/65 px-6 py-5">
            <div className="grid gap-1">
              <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
                Pillar {activeCategoryDetail.number} ·{" "}
                {activeCategoryDetail.spanishTitle}
              </p>
              <p className="max-w-[62ch] text-[length:var(--text-md)] text-[var(--color-ink-2)]">
                {activeCategoryDetail.description}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveCategory("All Stories")}
              className="cursor-pointer text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
            >
              Show all pillars
            </button>
          </div>
        ) : null}
      </div>

      {/* Lead cover story */}
      {featured ? (
        <article className="group grid items-center gap-[var(--gap-columns)] border-b border-[var(--color-rule)] pb-[var(--space-3xl)] lg:grid-cols-12">
          <Link
            href={`/stories/${featured.slug}`}
            className="block lg:col-span-7"
            aria-label={`Read cover story: ${featured.title}`}
          >
            <StoryMedia
              image={featured.leadImage}
              kind={featured.leadSlot.kind}
              ratio={featured.leadSlot.ratio}
              aspectClass="aspect-[16/10]"
              title={featured.leadSlot.title}
              description={featured.leadSlot.description}
              sizes="(max-width: 64rem) 100vw, 58vw"
              priority
              interactive
            />
          </Link>

          <div className="grid gap-5 lg:col-span-5 lg:pl-4">
            <div className="flex flex-wrap items-center gap-3 text-[length:var(--text-xs)] font-semibold tracking-[0.05em] uppercase">
              <span className="rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-3 py-1 text-[var(--color-paper)]">
                {featured.featured ? "Cover Story" : featured.issueNumber}
              </span>
              <span className="text-[var(--color-clay-ink)]">
                {getCategoryDetail(featured.category).number} ·{" "}
                {featured.category}
              </span>
            </div>

            <p className="num text-[length:var(--text-xs)] font-medium tracking-[0.03em] text-[var(--color-muted)] uppercase">
              {featured.location} · {featured.readingTimeMinutes} min read ·{" "}
              {formatStoryDate(featured.publishedAt)}
            </p>

            <h3 className="text-[clamp(2rem,3.4vw,3.35rem)] leading-[1.04] font-medium text-[var(--color-forest-deep)]">
              <Link
                href={`/stories/${featured.slug}`}
                className="no-underline transition-colors group-hover:text-[var(--color-clay-ink)]"
              >
                {featured.title}
              </Link>
            </h3>

            <p className="text-[length:var(--text-lg)] leading-[1.5] text-[var(--color-ink-2)]">
              {featured.summary}
            </p>

            {featured.spanishTitle ? (
              <p className="border-l-2 border-[var(--color-clay)] pl-3 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                <strong className="font-semibold text-[var(--color-forest-deep)]">
                  ES:
                </strong>{" "}
                {featured.spanishTitle}
              </p>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-rule)] pt-4">
              <div className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                <span className="font-semibold text-[var(--color-forest-deep)]">
                  By {featured.author.name}
                </span>{" "}
                · {featured.author.location}
              </div>
              <Link
                className="inline-flex items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={`/stories/${featured.slug}`}
              >
                Read Story
              </Link>
            </div>
          </div>
        </article>
      ) : null}

      {/* Secondary two-column editorial spread */}
      {pairStories.length > 0 ? (
        <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
          {pairStories.map((story) => {
            const categoryDetail = getCategoryDetail(story.category);
            return (
              <article
                key={story.slug}
                className="group flex flex-col justify-between gap-5 border-b border-[var(--color-rule)] pb-10"
              >
                <div className="grid content-start gap-4">
                  <Link
                    href={`/stories/${story.slug}`}
                    className="block"
                    aria-label={story.title}
                  >
                    <StoryMedia
                      image={story.leadImage}
                      kind={story.leadSlot.kind}
                      ratio={story.leadSlot.ratio}
                      aspectClass="aspect-[4/3]"
                      title={story.leadSlot.title}
                      description={story.leadSlot.description}
                      sizes="(max-width: 48rem) 100vw, 50vw"
                      interactive
                    />
                  </Link>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[length:var(--text-xs)] font-semibold tracking-[0.04em] uppercase">
                    <span className="text-[var(--color-clay-ink)]">
                      {categoryDetail.number} · {story.category}
                    </span>
                    <span className="num text-[var(--color-muted)]">
                      {story.location} · {story.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h3 className="text-[clamp(1.6rem,2.4vw,2.25rem)] leading-[1.12] font-medium text-[var(--color-forest-deep)]">
                    <Link
                      href={`/stories/${story.slug}`}
                      className="no-underline transition-colors group-hover:text-[var(--color-clay-ink)]"
                    >
                      {story.title}
                    </Link>
                  </h3>

                  <p className="text-[var(--color-muted)]">{story.summary}</p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-rule)]/70 pt-4 text-[length:var(--text-sm)]">
                  <span className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    {formatStoryDate(story.publishedAt)} · {story.author.name}
                  </span>
                  <Link
                    className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={`/stories/${story.slug}`}
                  >
                    Read Story
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {/* Editorial interlude when browsing all stories */}
      {activeCategory === "All Stories" && trioStories.length > 0 ? (
        <div className="grid items-center gap-8 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-8 sm:p-12 lg:grid-cols-12">
          <div className="grid gap-3 lg:col-span-8">
            <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)] uppercase">
              Editorial principle · Write once, share with care
            </p>
            <blockquote className="m-0 font-[family-name:var(--font-display)] text-[clamp(1.5rem,2.5vw,2.35rem)] leading-[1.18] text-[var(--color-forest-deep)]">
              &ldquo;Every Story in the KarmaRise Journal starts on a real
              worktable in Spain or Maharashtra. We publish only when there is a
              material decision, a craft lesson, or an honest milestone worth
              sharing.&rdquo;
            </blockquote>
          </div>
          <div className="grid gap-3 lg:col-span-4 lg:justify-items-end">
            <p className="text-[length:var(--text-sm)] text-[var(--color-muted)] lg:text-right">
              Selected Stories are curated into our bilingual English and
              Spanish newsletter editions.
            </p>
            <a
              href="#journal-newsletter"
              className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
            >
              Receive the Journal by email
            </a>
          </div>
        </div>
      ) : null}

      {/* Three-column portrait journal dispatches */}
      {trioStories.length > 0 ? (
        <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
          {trioStories.map((story) => {
            const categoryDetail = getCategoryDetail(story.category);
            return (
              <article
                key={story.slug}
                className="group flex flex-col justify-between gap-4 border-b border-[var(--color-rule)] pb-8"
              >
                <div className="grid content-start gap-4">
                  <Link
                    href={`/stories/${story.slug}`}
                    className="block"
                    aria-label={story.title}
                  >
                    <StoryMedia
                      image={story.leadImage}
                      kind={story.leadSlot.kind}
                      ratio="4:5 portrait"
                      aspectClass="aspect-[4/5]"
                      title={story.leadSlot.title}
                      description={story.leadSlot.description}
                      sizes="(max-width: 48rem) 100vw, 33vw"
                      interactive
                    />
                  </Link>

                  <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)] font-semibold tracking-[0.04em] uppercase">
                    <span className="text-[var(--color-clay-ink)]">
                      {categoryDetail.number} · {story.category}
                    </span>
                    <span className="num text-[var(--color-muted)]">
                      {story.readingTimeMinutes} min read
                    </span>
                  </div>

                  <h3 className="text-[length:var(--text-xl)] leading-[1.16] font-medium text-[var(--color-forest-deep)]">
                    <Link
                      href={`/stories/${story.slug}`}
                      className="no-underline transition-colors group-hover:text-[var(--color-clay-ink)]"
                    >
                      {story.title}
                    </Link>
                  </h3>

                  <p className="text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-muted)]">
                    {story.summary}
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-rule)]/70 pt-3 text-[length:var(--text-xs)]">
                  <span className="text-[var(--color-muted)]">
                    {story.location} · {formatStoryDate(story.publishedAt)}
                  </span>
                  <Link
                    className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={`/stories/${story.slug}`}
                  >
                    Read Story
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      ) : null}

      {/* Six Permanent Editorial Pillars Directory */}
      <section
        aria-labelledby="editorial-pillars-heading"
        className="grid gap-[var(--space-xl)] border-t border-[var(--color-rule)] pt-[var(--space-2xl)]"
      >
        <div className="grid items-end gap-6 lg:grid-cols-12">
          <div className="grid gap-2 lg:col-span-7">
            <p className="section-index">Editorial architecture</p>
            <h2
              id="editorial-pillars-heading"
              className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium text-[var(--color-forest-deep)]"
            >
              Six permanent categories guiding the KarmaRise Journal.
            </h2>
          </div>
          <p className="max-w-[46ch] text-[var(--color-muted)] lg:col-span-5">
            Each Story belongs to one of six editorial pillars, linking Indian
            heritage, sustainable saree upcycling, workshop craftsmanship, and
            European retail collaboration.
          </p>
        </div>

        <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-3">
          {storyCategoryDetails.map((pillar) => {
            const isSelected = activeCategory === pillar.title;
            const storyCount = stories.filter(
              (story) => story.category === pillar.title,
            ).length;

            return (
              <article
                key={pillar.slug}
                className={`group flex flex-col justify-between gap-5 rounded-[var(--radius-card)] border p-6 transition-colors ${
                  isSelected
                    ? "border-[var(--color-forest-deep)] bg-[var(--color-paper-2)]"
                    : "border-[var(--color-rule)] bg-[var(--color-paper)] hover:border-[var(--color-forest-deep)]"
                }`}
              >
                <div className="grid gap-4">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[0.85rem] bg-[var(--color-paper-2)]">
                    <Image
                      src={pillar.coverImage}
                      alt={pillar.coverAlt}
                      fill
                      sizes="(max-width: 48rem) 100vw, (max-width: 75rem) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                    />
                  </div>

                  <div className="flex items-baseline justify-between gap-2 text-[length:var(--text-xs)] font-semibold tracking-[0.05em] uppercase">
                    <span className="num text-[var(--color-clay-ink)]">
                      {pillar.number} · {pillar.spanishTitle}
                    </span>
                    <span className="num text-[var(--color-muted)]">
                      {storyCount} {storyCount === 1 ? "Story" : "Stories"}
                    </span>
                  </div>

                  <h3 className="text-[length:var(--text-xl)] font-medium text-[var(--color-forest-deep)]">
                    {pillar.title}
                  </h3>

                  <p className="text-[length:var(--text-sm)] leading-[1.55] text-[var(--color-muted)]">
                    {pillar.description}
                  </p>
                </div>

                <div className="border-t border-[var(--color-rule)]/70 pt-3">
                  <button
                    type="button"
                    onClick={() => selectCategoryAndScroll(pillar.title)}
                    className="cursor-pointer text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  >
                    {isSelected
                      ? "Currently viewing this pillar"
                      : `Explore ${pillar.title}`}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
