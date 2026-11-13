"use client";

import Link from "next/link";
import { useState } from "react";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { stories, storyCategories, type StoryCategory } from "@/data/stories";

export function StoriesBrowser() {
  const [activeCategory, setActiveCategory] = useState<
    "All Stories" | StoryCategory
  >("All Stories");

  const filteredStories =
    activeCategory === "All Stories"
      ? stories
      : stories.filter((story) => story.category === activeCategory);

  const featured =
    filteredStories.find((story) => story.featured) ?? filteredStories[0];
  const remaining = filteredStories.filter(
    (story) => story.slug !== featured?.slug,
  );

  return (
    <div className="grid gap-[var(--space-2xl)]">
      <div
        className="flex flex-wrap gap-3 border-b border-[var(--color-rule)] pb-6"
        role="group"
        aria-label="Filter Stories by topic"
      >
        {storyCategories.map((category) => {
          const isActive = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              aria-pressed={isActive}
              onClick={() => setActiveCategory(category)}
              className={`min-h-[44px] cursor-pointer rounded-[var(--radius-pill)] border px-5 text-[length:var(--text-sm)] font-medium transition-colors ${
                isActive
                  ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                  : "border-[var(--color-rule)] bg-transparent text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)]"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>

      {featured ? (
        <article className="grid items-center gap-[var(--gap-columns)] border-b border-[var(--color-rule)] pb-[var(--space-2xl)] lg:grid-cols-12">
          <div className="lg:col-span-7">
            <MediaPlaceholder
              kind={featured.leadSlot.kind}
              ratio={featured.leadSlot.ratio}
              aspectClass="aspect-[16/10]"
              tone="light"
              title={featured.leadSlot.title}
              description={featured.leadSlot.description}
            />
          </div>
          <div className="grid gap-4 lg:col-span-5">
            <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
              {featured.category} · {featured.location}
            </p>
            <h2 className="text-[length:var(--text-display-s)] leading-[1] font-medium text-[var(--color-forest-deep)]">
              {featured.title}
            </h2>
            <p className="text-[var(--color-muted)]">{featured.summary}</p>
            <div className="pt-2">
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={`/stories/${featured.slug}`}
              >
                Read Story
              </Link>
            </div>
          </div>
        </article>
      ) : null}

      {remaining.length > 0 ? (
        <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
          {remaining.map((story) => (
            <article
              key={story.slug}
              className="grid content-start gap-4 border-b border-[var(--color-rule)] pb-8"
            >
              <MediaPlaceholder
                kind={story.leadSlot.kind}
                ratio={story.leadSlot.ratio}
                aspectClass="aspect-[4/3]"
                tone="light"
                title={story.leadSlot.title}
                description={story.leadSlot.description}
              />
              <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                {story.category} · {story.location}
              </p>
              <h3 className="text-[length:var(--text-2xl)] leading-[1.12] font-medium text-[var(--color-forest-deep)]">
                {story.title}
              </h3>
              <p className="text-[var(--color-muted)]">{story.summary}</p>
              <div>
                <Link
                  className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={`/stories/${story.slug}`}
                >
                  Read Story
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
