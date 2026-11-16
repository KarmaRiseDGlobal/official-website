import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { NewsletterForm } from "@/components/newsletter-form";
import { SiteFooter } from "@/components/site-footer";
import { StoryMedia } from "@/components/story-media";
import {
  formatStoryDate,
  getCategoryDetail,
  type StoryBodyBlock,
  type StoryMarkDef,
  type StoryTextSpan,
} from "@/data/stories";
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
    return { title: "Story · KarmaRise Journal" };
  }

  return {
    title: story.seo?.title || `${story.title} · KarmaRise Journal`,
    description: story.seo?.description || story.summary,
  };
}

function toSectionId(heading: string, index: number): string {
  const slugified = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slugified || `section-${index + 1}`;
}

function renderSpanWithMarks(
  span: StoryTextSpan,
  markDefs: StoryMarkDef[] | undefined,
): ReactNode {
  let content: ReactNode = span.text;
  const marks = span.marks ?? [];

  for (const mark of marks) {
    if (mark === "strong") {
      content = (
        <strong
          key={`${span._key}-strong`}
          className="font-semibold text-[var(--color-forest-deep)]"
        >
          {content}
        </strong>
      );
    } else if (mark === "em") {
      content = <em key={`${span._key}-em`}>{content}</em>;
    } else {
      const linkDef = markDefs?.find((def) => def._key === mark);
      if (linkDef?.href) {
        const isExternal = /^https?:\/\//i.test(linkDef.href);
        content = (
          <a
            key={`${span._key}-${mark}`}
            href={linkDef.href}
            target={linkDef.blank || isExternal ? "_blank" : undefined}
            rel={
              linkDef.blank || isExternal ? "noopener noreferrer" : undefined
            }
            className="font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
          >
            {content}
          </a>
        );
      }
    }
  }

  return <span key={span._key}>{content}</span>;
}

function renderPortableBody(blocks: StoryBodyBlock[]): ReactNode[] {
  const elements: ReactNode[] = [];
  let h2Counter = 0;
  let normalParagraphCounter = 0;
  let inlineImageCounter = 1;

  for (const block of blocks) {
    if (block._type === "block") {
      const plainText = block.children.map((c) => c.text).join("");
      const renderedChildren = block.children.map((span) =>
        renderSpanWithMarks(span, block.markDefs),
      );

      if (block.style === "h2") {
        const currentIndex = h2Counter;
        h2Counter += 1;
        elements.push(
          <div
            key={block._key}
            id={toSectionId(plainText, currentIndex)}
            className="flex max-w-[64ch] scroll-mt-32 items-baseline gap-3 pt-4"
          >
            <span className="num text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)]">
              0{currentIndex + 1}
            </span>
            <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]">
              {renderedChildren}
            </h2>
          </div>,
        );
      } else if (block.style === "h3") {
        elements.push(
          <h3
            key={block._key}
            className="max-w-[64ch] pt-2 text-[length:var(--text-xl)] font-medium text-[var(--color-forest-deep)]"
          >
            {renderedChildren}
          </h3>,
        );
      } else if (block.style === "blockquote") {
        elements.push(
          <blockquote
            key={block._key}
            className="m-0 my-2 grid max-w-[60ch] gap-3 border-l-4 border-[var(--color-clay)] bg-[var(--color-paper-2)]/55 py-6 pr-6 pl-6 sm:pl-8"
          >
            <p className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.2vw,1.95rem)] leading-[1.24] text-[var(--color-forest-deep)]">
              &ldquo;{renderedChildren}&rdquo;
            </p>
          </blockquote>,
        );
      } else if (block.listItem === "bullet" || block.listItem === "number") {
        elements.push(
          <div
            key={block._key}
            className="flex max-w-[64ch] items-baseline gap-3 pl-2 text-[length:var(--text-md)] leading-[1.75] text-[var(--color-ink)]"
          >
            <span
              aria-hidden="true"
              className="font-semibold text-[var(--color-clay-ink)]"
            >
              &bull;
            </span>
            <p className="m-0">{renderedChildren}</p>
          </div>,
        );
      } else {
        const isFirstParagraph = normalParagraphCounter === 0;
        normalParagraphCounter += 1;
        elements.push(
          <p
            key={block._key}
            className={`max-w-[64ch] text-[length:var(--text-md)] leading-[1.78] text-[var(--color-ink)] ${
              isFirstParagraph
                ? "first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[3.35rem] first-letter:leading-[0.88] first-letter:text-[var(--color-forest-deep)]"
                : ""
            }`}
          >
            {renderedChildren}
          </p>,
        );
      }
    } else if (block._type === "pullQuoteBlock") {
      elements.push(
        <blockquote
          key={block._key}
          className="m-0 my-2 grid max-w-[60ch] gap-3 border-l-4 border-[var(--color-clay)] bg-[var(--color-paper-2)]/55 py-6 pr-6 pl-6 sm:pl-8"
        >
          <p className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.2vw,1.95rem)] leading-[1.24] text-[var(--color-forest-deep)]">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.attribution ? (
            <cite className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase not-italic">
              {block.attribution}
            </cite>
          ) : null}
        </blockquote>,
      );
    } else if (block._type === "image") {
      inlineImageCounter += 1;
      const aspectClass =
        block.aspectRatio === "4:5"
          ? "aspect-[4/5] max-w-[32rem]"
          : block.aspectRatio === "4:3"
            ? "aspect-[4/3]"
            : "aspect-[16/9]";

      elements.push(
        <div key={block._key} className="my-2">
          <StoryMedia
            image={{
              url: block.url,
              alt: block.alt,
              caption: block.caption,
            }}
            kind="Photo"
            ratio={block.aspectRatio || "16:9"}
            aspectClass={aspectClass}
            title={block.alt}
            description={block.caption || block.alt}
            sizes="(max-width: 64rem) 100vw, 760px"
            showCaption
            figureNumber={`Fig. 0${inlineImageCounter}`}
          />
        </div>,
      );
    }
  }

  return elements;
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

  const categoryDetail = getCategoryDetail(story.category);
  const currentIndex = allStories.findIndex((entry) => entry.slug === slug);
  const nextStory =
    allStories.length > 1 && currentIndex >= 0
      ? allStories[(currentIndex + 1) % allStories.length]
      : undefined;

  const relatedStories = allStories
    .filter((entry) => entry.slug !== slug)
    .slice(0, 3);

  const tocHeadings =
    story.body && story.body.length > 0
      ? story.body
          .filter(
            (b): b is Extract<StoryBodyBlock, { _type: "block" }> =>
              b._type === "block" && b.style === "h2",
          )
          .map((b) => b.children.map((c) => c.text).join(""))
          .filter(Boolean)
      : story.sections.map((s) => s.heading);

  return (
    <>
      <main id="main">
        <article className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-2xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            {/* Top Journal Masthead Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-rule)] pb-5 text-[length:var(--text-xs)] font-semibold tracking-[0.05em] uppercase">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  className="text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href="/stories"
                >
                  The KarmaRise Journal
                </Link>
                <span aria-hidden="true" className="text-[var(--color-rule-2)]">
                  /
                </span>
                <span className="text-[var(--color-clay-ink)]">
                  {categoryDetail.number} · {story.category}
                </span>
              </div>

              <div className="num flex flex-wrap items-center gap-3 text-[var(--color-muted)]">
                <span>{story.issueNumber}</span>
                <span aria-hidden="true">·</span>
                <span>{story.readingTimeMinutes} min read</span>
                <span aria-hidden="true">·</span>
                <time dateTime={story.publishedAt}>
                  {formatStoryDate(story.publishedAt)}
                </time>
              </div>
            </div>

            {/* Article Title & Editorial Deck */}
            <header className="grid gap-[var(--space-xl)] lg:grid-cols-12 lg:items-end">
              <div className="grid gap-[var(--space-lg)] lg:col-span-8">
                <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
                  {story.location} · {categoryDetail.spanishTitle}
                </p>

                <h1 className="max-w-[18ch] text-[clamp(2.45rem,4.8vw,4.5rem)] leading-[1.01] font-medium text-[var(--color-forest-deep)]">
                  {story.title}
                </h1>

                <p className="lead max-w-[56ch] text-[var(--color-ink-2)]">
                  {story.summary}
                </p>
              </div>

              {/* Author & Bilingual Edition Meta Card */}
              <div className="grid gap-4 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]/65 p-5 lg:col-span-4">
                <div className="flex items-center gap-3.5">
                  {story.author.portraitUrl ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-[var(--color-rule)] bg-[var(--color-paper)]">
                      <Image
                        src={story.author.portraitUrl}
                        alt={story.author.name}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    </div>
                  ) : null}
                  <div className="grid gap-0.5 text-[length:var(--text-xs)]">
                    <p className="font-semibold text-[var(--color-forest-deep)]">
                      Written by {story.author.name}
                    </p>
                    <p className="text-[var(--color-muted)]">
                      {story.author.role}
                    </p>
                    <p className="text-[var(--color-clay-ink)]">
                      {story.author.location}
                    </p>
                  </div>
                </div>

                {story.spanishTitle ? (
                  <div className="border-t border-[var(--color-rule)] pt-3 text-[length:var(--text-xs)] leading-[1.5] text-[var(--color-muted)]">
                    <span className="font-semibold text-[var(--color-forest-deep)]">
                      En español:
                    </span>{" "}
                    {story.spanishTitle}
                  </div>
                ) : null}
              </div>
            </header>

            {/* Lead Photograph */}
            <StoryMedia
              image={story.leadImage}
              kind={story.leadSlot.kind}
              ratio="16:9 wide"
              aspectClass="aspect-[16/9]"
              title={story.leadSlot.title}
              description={story.leadSlot.description}
              sizes="(max-width: 80rem) 100vw, 1280px"
              priority
              showCaption
              figureNumber="Fig. 01"
            />

            {/* Two-column Magazine Reading Layout */}
            <div className="grid items-start gap-[var(--gap-columns)] pt-4 lg:grid-cols-12">
              {/* Left Sticky Editorial Sidebar */}
              <aside className="grid gap-6 lg:sticky lg:top-32 lg:col-span-4">
                {tocHeadings.length > 0 ? (
                  <div className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]/45 p-6">
                    <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
                      In this Story
                    </p>
                    <ol className="m-0 grid list-none gap-2.5 p-0 text-[length:var(--text-sm)]">
                      {tocHeadings.map((heading, idx) => (
                        <li key={`${heading}-${idx}`}>
                          <a
                            href={`#${toSectionId(heading, idx)}`}
                            className="inline-flex items-baseline gap-2.5 text-[var(--color-forest-deep)] no-underline hover:text-[var(--color-clay-ink)]"
                          >
                            <span className="num text-[length:var(--text-xs)] font-semibold text-[var(--color-clay-ink)]">
                              0{idx + 1}
                            </span>
                            <span className="underline decoration-[var(--color-rule)] underline-offset-4">
                              {heading}
                            </span>
                          </a>
                        </li>
                      ))}
                      {story.takeaway ? (
                        <li>
                          <a
                            href="#story-takeaway"
                            className="inline-flex items-baseline gap-2.5 text-[var(--color-forest-deep)] no-underline hover:text-[var(--color-clay-ink)]"
                          >
                            <span className="num text-[length:var(--text-xs)] font-semibold text-[var(--color-clay-ink)]">
                              0{tocHeadings.length + 1}
                            </span>
                            <span className="underline decoration-[var(--color-rule)] underline-offset-4">
                              Key takeaway
                            </span>
                          </a>
                        </li>
                      ) : null}
                    </ol>
                  </div>
                ) : null}

                {story.tags.length > 0 ? (
                  <div className="grid gap-2.5 border-t border-[var(--color-rule)] pt-4">
                    <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-muted)] uppercase">
                      Topics &amp; keywords
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {story.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper)] px-3 py-1 text-[length:var(--text-xs)] text-[var(--color-forest-deep)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-3 rounded-[var(--radius-card)] bg-[var(--color-forest-deep)] p-6 text-[var(--color-paper)]">
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-gold)] uppercase">
                    Manufacturing Programme
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.15]">
                    Developing an own-brand product?
                  </p>
                  <p className="text-[length:var(--text-sm)] text-[var(--color-paper-2)]">
                    Share a sketch, reference sample, or target quantity with
                    Alma and Shirish.
                  </p>
                  <div className="pt-1">
                    <Link
                      href="/product-brief"
                      className="inline-flex items-center font-semibold text-[var(--color-gold)] underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-paper)]"
                    >
                      Start a Product Brief
                    </Link>
                  </div>
                </div>
              </aside>

              {/* Main Reading Column */}
              <div className="grid gap-[var(--space-xl)] lg:col-span-8">
                {story.body && story.body.length > 0 ? (
                  <div className="grid gap-5">
                    {renderPortableBody(story.body)}
                  </div>
                ) : (
                  story.sections.map((section, sectionIndex) => (
                    <div
                      key={section.heading}
                      className="grid gap-[var(--space-2xl)]"
                    >
                      <section
                        id={toSectionId(section.heading, sectionIndex)}
                        className="grid max-w-[64ch] scroll-mt-32 gap-5"
                      >
                        <div className="flex items-baseline gap-3">
                          <span className="num text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)]">
                            0{sectionIndex + 1}
                          </span>
                          <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]">
                            {section.heading}
                          </h2>
                        </div>

                        {section.paragraphs.map((paragraph, pIndex) => (
                          <p
                            key={paragraph}
                            className={`text-[length:var(--text-md)] leading-[1.78] text-[var(--color-ink)] ${
                              sectionIndex === 0 && pIndex === 0
                                ? "first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[3.35rem] first-letter:leading-[0.88] first-letter:text-[var(--color-forest-deep)]"
                                : ""
                            }`}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </section>

                      {sectionIndex === 0 && story.pullQuote ? (
                        <blockquote className="m-0 my-2 grid max-w-[60ch] gap-3 border-l-4 border-[var(--color-clay)] bg-[var(--color-paper-2)]/55 py-6 pr-6 pl-6 sm:pl-8">
                          <p className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.2vw,1.95rem)] leading-[1.24] text-[var(--color-forest-deep)]">
                            &ldquo;{story.pullQuote.text}&rdquo;
                          </p>
                          {story.pullQuote.attribution ? (
                            <cite className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase not-italic">
                              {story.pullQuote.attribution}
                            </cite>
                          ) : null}
                        </blockquote>
                      ) : null}
                    </div>
                  ))
                )}

                {/* Paired Documentary Photographs */}
                {story.pairImages && story.pairImages.length > 0 ? (
                  <div className="grid gap-[var(--gap-columns)] pt-4 md:grid-cols-2">
                    {story.pairImages.map((img, index) => (
                      <StoryMedia
                        key={img.url}
                        image={img}
                        kind="Photo"
                        ratio="4:5 portrait"
                        aspectClass="aspect-[4/5]"
                        title={
                          story.pairSlots[index]?.title ||
                          img.alt ||
                          `${story.title} detail`
                        }
                        description={
                          img.caption ||
                          story.pairSlots[index]?.description ||
                          story.summary
                        }
                        sizes="(max-width: 48rem) 100vw, 38vw"
                        showCaption
                        figureNumber={`Fig. 0${index + 2}`}
                      />
                    ))}
                  </div>
                ) : null}

                {/* Key Takeaway Card */}
                {story.takeaway ? (
                  <div
                    id="story-takeaway"
                    className="grid max-w-[64ch] scroll-mt-32 gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-8"
                  >
                    <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
                      Key takeaway · {story.category}
                    </p>
                    <p className="font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.22] font-medium text-[var(--color-forest-deep)]">
                      {story.takeaway}
                    </p>
                    <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)] font-semibold">
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
                ) : null}
              </div>
            </div>
          </div>
        </article>

        {/* Continue Reading in the Journal */}
        {relatedStories.length > 0 ? (
          <section className="border-t border-[var(--color-rule)] bg-[var(--color-dune)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
            <div className="container grid gap-[var(--space-2xl)]">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="grid gap-2">
                  <p className="section-index">Continue reading</p>
                  <h2 className="text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                    More from the KarmaRise Journal
                  </h2>
                </div>
                <Link
                  href="/stories"
                  className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                >
                  View all Stories
                </Link>
              </div>

              <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
                {relatedStories.map((entry) => {
                  const detail = getCategoryDetail(entry.category);
                  return (
                    <article
                      key={entry.slug}
                      className="group flex flex-col justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-rule-2)]/35 bg-[var(--color-paper)] p-5"
                    >
                      <div className="grid gap-4">
                        <Link href={`/stories/${entry.slug}`} className="block">
                          <StoryMedia
                            image={entry.leadImage}
                            kind={entry.leadSlot.kind}
                            ratio="4:3 horizontal"
                            aspectClass="aspect-[4/3]"
                            title={entry.leadSlot.title}
                            description={entry.leadSlot.description}
                            sizes="(max-width: 48rem) 100vw, 33vw"
                            interactive
                          />
                        </Link>
                        <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                          {detail.number} · {entry.category} ·{" "}
                          {entry.readingTimeMinutes} min read
                        </p>
                        <h3 className="text-[length:var(--text-xl)] leading-[1.15] font-medium">
                          <Link
                            href={`/stories/${entry.slug}`}
                            className="no-underline group-hover:text-[var(--color-clay-ink)]"
                          >
                            {entry.title}
                          </Link>
                        </h3>
                      </div>

                      <div className="border-t border-[var(--color-rule)] pt-3">
                        <Link
                          href={`/stories/${entry.slug}`}
                          className="text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        >
                          Read Story
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>
        ) : null}

        {/* Article Footer Newsletter Signup */}
        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-3 lg:col-span-5">
              <p className="section-index">Follow the Journal</p>
              <h2 className="text-[length:var(--text-2xl)] font-medium">
                Come sit at our table in English or Spanish.
              </h2>
              <p className="max-w-[48ch] text-[var(--color-muted)]">
                Every few weeks, we send a personal letter with our latest
                Stories from Spain and Maharashtra. Reply anytime.
              </p>
            </div>
            <div className="lg:col-span-7">
              <NewsletterForm
                variant="journal"
                source={`Story: ${story.slug}`}
              />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
