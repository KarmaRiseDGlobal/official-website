"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";

import { StoryMedia } from "@/components/story-media";
import {
  segmentParagraphWithReferences,
  StoryReferenceSegments,
} from "@/components/story-reference-text";
import { useLanguage } from "@/context/language-context";
import {
  formatStoryDate,
  getLocalizedStory,
  type StoryBodyBlock,
  type StoryEntry,
  type StoryImage,
  type StoryLanguage,
  type StoryMarkDef,
  type StoryTextSpan,
} from "@/data/stories";
import { siteUrl } from "@/lib/seo";

interface StoryDetailClientProps {
  story: StoryEntry;
  allStories: StoryEntry[];
}

export function sanitizePortableLinkHref(rawHref: unknown): string | null {
  if (typeof rawHref !== "string") {
    return null;
  }

  if (/[\u0000-\u001F\u007F]/.test(rawHref)) {
    return null;
  }

  const trimmed = rawHref.trim();
  if (!trimmed) {
    return null;
  }

  if (trimmed.startsWith("#")) {
    return trimmed.length > 1 && !/\s/.test(trimmed) ? trimmed : null;
  }

  if (trimmed.startsWith("/")) {
    if (trimmed.startsWith("//") || trimmed.startsWith("/\\")) {
      return null;
    }

    try {
      const resolved = new URL(trimmed, "https://karmarisedglobal.invalid");
      return resolved.origin === "https://karmarisedglobal.invalid"
        ? trimmed
        : null;
    } catch {
      return null;
    }
  }

  if (/^mailto:/i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (
        parsed.protocol === "mailto:" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parsed.pathname)
      ) {
        return trimmed;
      }
    } catch {
      return null;
    }
    return null;
  }

  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      if (
        (parsed.protocol === "http:" || parsed.protocol === "https:") &&
        Boolean(parsed.hostname) &&
        !parsed.username &&
        !parsed.password
      ) {
        return parsed.href;
      }
    } catch {
      return null;
    }
    return null;
  }

  return null;
}

function toSectionId(heading: string, index: number): string {
  const slugified = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return slugified || `section-${index + 1}`;
}

function getImageDimensionsFromUrl(
  url?: string,
): { width: number; height: number } | null {
  if (!url) return null;
  const match = url.match(/-(\d+)x(\d+)\.[a-z0-9]+(?:\?.*)?$/i);
  if (!match) return null;
  const width = Number(match[1]);
  const height = Number(match[2]);
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width <= 0 ||
    height <= 0
  ) {
    return null;
  }
  return { width, height };
}

function resolveAspectRatio(
  url?: string,
  declared?: StoryImage["aspectRatio"],
  fallback: StoryImage["aspectRatio"] = "4:5",
): StoryImage["aspectRatio"] {
  const dims = getImageDimensionsFromUrl(url);
  if (dims) {
    const ratio = dims.width / dims.height;
    if (ratio >= 1.55) return "16:9";
    if (ratio >= 1.15) return "4:3";
    if (ratio <= 0.88) return "4:5";
  }
  return declared ?? fallback;
}

function getAspectConfig(aspectRatio?: StoryImage["aspectRatio"]): {
  aspectClass: string;
  ratioLabel: string;
  singleMaxWidthClass: string;
} {
  if (aspectRatio === "16:9") {
    return {
      aspectClass: "aspect-[16/9]",
      ratioLabel: "16:9 wide",
      singleMaxWidthClass: "w-full",
    };
  }
  if (aspectRatio === "4:3") {
    return {
      aspectClass: "aspect-[4/3]",
      ratioLabel: "4:3 horizontal",
      singleMaxWidthClass: "mx-auto w-full max-w-[44rem] lg:mx-0",
    };
  }
  return {
    aspectClass: "aspect-[4/5]",
    ratioLabel: "4:5 portrait",
    singleMaxWidthClass: "mx-auto w-full max-w-[28rem] lg:mx-0",
  };
}

function renderSpanWithMarks(
  span: StoryTextSpan,
  markDefs: StoryMarkDef[] | undefined,
  lang: StoryLanguage,
  seenReferenceIds: Set<string> | undefined,
): ReactNode {
  const marks = span.marks ?? [];
  let content: ReactNode =
    marks.length === 0 && seenReferenceIds ? (
      <StoryReferenceSegments
        segments={segmentParagraphWithReferences(
          span.text,
          lang,
          seenReferenceIds,
        )}
        lang={lang}
      />
    ) : (
      span.text
    );

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
      const safeHref = linkDef ? sanitizePortableLinkHref(linkDef.href) : null;
      if (linkDef && safeHref) {
        const isExternal = /^https?:\/\//i.test(safeHref);
        content = (
          <a
            key={`${span._key}-${mark}`}
            href={safeHref}
            target={linkDef.blank || isExternal ? "_blank" : undefined}
            rel={
              linkDef.blank || isExternal ? "noopener noreferrer" : undefined
            }
            className="font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
          >
            {content}
          </a>
        );
      } else {
        content = <span key={`${span._key}-${mark}`}>{content}</span>;
      }
    }
  }

  return <span key={span._key}>{content}</span>;
}

interface PortableChapter {
  id: string;
  heading?: string;
  headingNodes?: ReactNode;
  blocks: StoryBodyBlock[];
}

function groupPortableBlocksIntoChapters(
  blocks: StoryBodyBlock[],
  lang: StoryLanguage,
): PortableChapter[] {
  const chapters: PortableChapter[] = [];
  let current: PortableChapter = { id: "opening", blocks: [] };
  let h2Counter = 0;

  for (const block of blocks) {
    if (block._type === "block" && block.style === "h2") {
      if (current.heading || current.blocks.length > 0) {
        chapters.push(current);
      }
      const plainText = block.children.map((c) => c.text).join("");
      const idx = h2Counter;
      h2Counter += 1;
      current = {
        id: toSectionId(plainText, idx),
        heading: plainText,
        headingNodes: block.children.map((span) =>
          renderSpanWithMarks(span, block.markDefs, lang, undefined),
        ),
        blocks: [],
      };
    } else {
      current.blocks.push(block);
    }
  }

  if (current.heading || current.blocks.length > 0) {
    chapters.push(current);
  }

  return chapters;
}

interface PortableChapterRow {
  kind: "prose";
  key: string;
  blocks: Exclude<StoryBodyBlock, { _type: "image" }>[];
}

interface PortableImageRow {
  kind: "image";
  key: string;
  block: Extract<StoryBodyBlock, { _type: "image" }>;
}

type PortableRenderRow = PortableChapterRow | PortableImageRow;

function splitChapterIntoRows(blocks: StoryBodyBlock[]): PortableRenderRow[] {
  const rows: PortableRenderRow[] = [];
  let proseBuffer: Exclude<StoryBodyBlock, { _type: "image" }>[] = [];

  const flushProse = () => {
    if (proseBuffer.length === 0) return;
    rows.push({
      kind: "prose",
      key: `prose-${proseBuffer[0]!._key}`,
      blocks: proseBuffer,
    });
    proseBuffer = [];
  };

  for (const block of blocks) {
    if (block._type === "image") {
      flushProse();
      rows.push({
        kind: "image",
        key: block._key,
        block,
      });
    } else {
      proseBuffer.push(block);
    }
  }
  flushProse();

  return rows;
}

function renderPortableProseBlocks(
  blocks: Exclude<StoryBodyBlock, { _type: "image" }>[],
  lang: StoryLanguage,
  seenReferenceIds: Set<string>,
  firstParagraphState: { rendered: boolean },
): ReactNode[] {
  const elements: ReactNode[] = [];

  for (const block of blocks) {
    if (block._type === "block") {
      const isAnnotatable =
        block.style !== "h2" &&
        block.style !== "h3" &&
        block.style !== "blockquote";
      const renderedChildren = block.children.map((span) =>
        renderSpanWithMarks(
          span,
          block.markDefs,
          lang,
          isAnnotatable ? seenReferenceIds : undefined,
        ),
      );

      if (block.style === "h3") {
        elements.push(
          <h3
            key={block._key}
            className="max-w-[60ch] pt-3 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-forest-deep)]"
          >
            {renderedChildren}
          </h3>,
        );
      } else if (block.style === "blockquote") {
        elements.push(
          <blockquote
            key={block._key}
            className="m-0 my-4 grid max-w-[56ch] gap-3 border-l-2 border-[var(--color-clay)] py-2 pl-6 sm:pl-8"
          >
            <p className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.1vw,1.9rem)] leading-[1.28] text-[var(--color-forest-deep)]">
              &ldquo;{renderedChildren}&rdquo;
            </p>
          </blockquote>,
        );
      } else if (block.listItem === "bullet" || block.listItem === "number") {
        elements.push(
          <div
            key={block._key}
            className="flex max-w-[60ch] items-baseline gap-3 pl-1 text-[1.0625rem] leading-[1.82] text-[var(--color-ink)]"
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
        const isFirst = !firstParagraphState.rendered;
        firstParagraphState.rendered = true;
        elements.push(
          <p
            key={block._key}
            className={`max-w-[60ch] text-[1.0625rem] leading-[1.82] text-[var(--color-ink)] ${
              isFirst
                ? "first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[3.4rem] first-letter:leading-[0.94] first-letter:text-[var(--color-forest-deep)]"
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
          className="m-0 my-4 grid max-w-[56ch] gap-3 border-l-2 border-[var(--color-clay)] py-2 pl-6 sm:pl-8"
        >
          <p className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.1vw,1.9rem)] leading-[1.28] text-[var(--color-forest-deep)]">
            &ldquo;{block.text}&rdquo;
          </p>
          {block.attribution ? (
            <cite className="text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)] uppercase not-italic">
              {block.attribution}
            </cite>
          ) : null}
        </blockquote>,
      );
    }
  }

  return elements;
}

export function StoryDetailClient({
  story,
  allStories,
}: StoryDetailClientProps) {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";
  const [copiedLink, setCopiedLink] = useState(false);

  const localized = getLocalizedStory(story, language);
  const currentIndex = allStories.findIndex(
    (entry) => entry.slug === story.slug,
  );
  const nextStory =
    allStories.length > 1 && currentIndex >= 0
      ? allStories[(currentIndex + 1) % allStories.length]
      : undefined;
  const nextStoryLocalized = nextStory
    ? getLocalizedStory(nextStory, language)
    : undefined;

  // Put the immediate next Story first in the "Up Next" strip, then fill up to 3 unique Stories.
  const orderedRelatedStories = [
    ...(nextStory ? [nextStory] : []),
    ...allStories.filter(
      (entry) => entry.slug !== story.slug && entry.slug !== nextStory?.slug,
    ),
  ].slice(0, 3);

  const usePortableBody =
    Boolean(story.body && story.body.length > 0) &&
    (!isEs ||
      (story.language === "es" &&
        (!story.spanishSections || story.spanishSections.length === 0)));

  const portableChapters =
    usePortableBody && story.body
      ? groupPortableBlocksIntoChapters(story.body, language)
      : [];

  const portableSeenRefs = new Set<string>();
  const portableFirstParagraphState = { rendered: false };

  const seenSectionReferenceIds = new Set<string>();
  const segmentedSections = localized.sections.map((section) => ({
    ...section,
    segmentedParagraphs: section.paragraphs.map((paragraph) => ({
      raw: paragraph,
      segments: segmentParagraphWithReferences(
        paragraph,
        language,
        seenSectionReferenceIds,
      ),
    })),
  }));

  const shareUrl = `${siteUrl}${localizeHref(`/stories/${story.slug}`)}`;
  const whatsappShareHref = `https://wa.me/?text=${encodeURIComponent(`${localized.title} ${shareUrl}`)}`;
  const linkedinShareHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
  const xShareHref = `https://x.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(localized.title)}`;
  const emailShareHref = `mailto:?subject=${encodeURIComponent(localized.title)}&body=${encodeURIComponent(`${localized.summary}\n\n${shareUrl}`)}`;

  const handleCopyLink = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      window.setTimeout(() => setCopiedLink(false), 2400);
    } catch {
      setCopiedLink(false);
    }
  };

  const authorPortraitUrl = (() => {
    const rawUrl = story.author.portraitUrl;
    if (!rawUrl) return undefined;
    if (/alma.*shirish/i.test(story.author.name)) {
      const dims = getImageDimensionsFromUrl(rawUrl);
      if (
        rawUrl.includes("alma-and-shirish-founders") ||
        (dims && dims.width / dims.height > 1.35)
      ) {
        return "/images/alma-and-shirish-avatar.jpg";
      }
    }
    return rawUrl;
  })();

  return (
    <>
      <article className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-2xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)] lg:pt-[calc(var(--nav-height)+var(--space-3xl))]">
        <div className="container grid gap-[var(--space-xl)] lg:gap-[var(--space-2xl)]">
          {/* Top Hairline Breadcrumb & Reading Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[var(--color-rule)] py-2 text-[length:var(--text-xs)] font-medium tracking-[0.06em] uppercase">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="inline-flex min-h-[44px] items-center text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/stories")}
              >
                {isEs ? "Historias" : "Stories"}
              </Link>
              <span aria-hidden="true" className="text-[var(--color-rule-2)]">
                /
              </span>
              <span className="text-[var(--color-clay-ink)]">
                {localized.categoryLabel}
              </span>
            </div>

            <div className="num flex flex-wrap items-center gap-3 text-[var(--color-muted)]">
              <span>
                {isEs
                  ? `${story.readingTimeMinutes} min de lectura`
                  : `${story.readingTimeMinutes} min read`}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={story.publishedAt}>
                {formatStoryDate(story.publishedAt, language)}
              </time>
            </div>
          </div>

          {/* Studio DADO-inspired Asymmetric 5/7 Monograph Header */}
          <header className="grid gap-8 pt-2 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
            <div className="grid content-between gap-6 lg:col-span-5 lg:pr-10">
              <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-ink)] uppercase">
                {localized.location}
              </p>

              <div className="flex items-center gap-3.5 pt-1">
                {authorPortraitUrl ? (
                  <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
                    <Image
                      src={authorPortraitUrl}
                      alt={story.author.name}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="grid gap-0.5 text-[length:var(--text-xs)]">
                  <p className="font-semibold text-[var(--color-forest-deep)]">
                    {isEs
                      ? `Por ${story.author.name}`
                      : `By ${story.author.name}`}
                  </p>
                  <p className="text-[var(--color-muted)]">
                    {localized.authorRole}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-6 lg:col-span-7">
              <h1 className="max-w-[17ch] text-[clamp(1.85rem,3.8vw+0.75rem,4.65rem)] leading-[1.02] font-normal tracking-[-0.015em] text-balance text-[var(--color-forest-deep)]">
                {localized.title}
              </h1>

              <p className="max-w-[52ch] font-[family-name:var(--font-display)] text-[clamp(1.18rem,1.55vw,1.45rem)] leading-[1.44] text-[var(--color-ink-2)]">
                {localized.summary}
              </p>
            </div>
          </header>

          {/* Lead Photograph (adapts automatically if Sanity cover is portrait vs landscape) */}
          {(() => {
            const leadDims = getImageDimensionsFromUrl(
              localized.leadImage?.url,
            );
            const isPortraitLead = Boolean(
              leadDims && leadDims.height > leadDims.width,
            );

            if (isPortraitLead && localized.leadImage) {
              return (
                <figure className="m-0 grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
                  <figcaption className="order-2 grid gap-2 lg:order-1 lg:col-span-5 lg:pr-12">
                    <span className="text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)] uppercase">
                      {isEs ? "Fotografía de portada" : "Lead photograph"}
                    </span>
                    {localized.leadImage.caption ? (
                      <span className="text-[length:var(--text-xs)] leading-[1.65] text-[var(--color-muted)]">
                        {localized.leadImage.caption}
                      </span>
                    ) : null}
                  </figcaption>
                  <div className="order-1 lg:order-2 lg:col-span-7">
                    <div className="mx-auto w-full max-w-[34rem] lg:mx-0">
                      <StoryMedia
                        image={{
                          ...localized.leadImage,
                          objectPosition:
                            localized.leadImage.objectPosition || "50% 18%",
                        }}
                        kind={story.leadSlot.kind}
                        ratio="4:5 portrait"
                        aspectClass="aspect-[4/5]"
                        title={story.leadSlot.title}
                        description={story.leadSlot.description}
                        sizes="(max-width: 64rem) 100vw, 560px"
                        variant="editorial"
                        priority
                        showCaption={false}
                      />
                    </div>
                  </div>
                </figure>
              );
            }

            return (
              <div className="grid gap-4">
                <StoryMedia
                  image={localized.leadImage}
                  kind={story.leadSlot.kind}
                  ratio="16:10 wide"
                  aspectClass="aspect-[16/10]"
                  title={story.leadSlot.title}
                  description={story.leadSlot.description}
                  sizes="(max-width: 80rem) 100vw, 1312px"
                  variant="editorial"
                  priority
                  showCaption={false}
                />

                {localized.leadImage?.caption ? (
                  <div className="grid gap-2 pt-1 lg:grid-cols-12 lg:gap-[var(--gap-columns)]">
                    <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)] uppercase lg:col-span-5 lg:pr-10">
                      {isEs ? "Fotografía de portada" : "Lead photograph"}
                    </p>
                    <p className="max-w-[60ch] text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-muted)] lg:col-span-7">
                      {localized.leadImage.caption}
                    </p>
                  </div>
                ) : null}
              </div>
            );
          })()}

          {/* Asymmetric 5/7 Marginalia Reading Flow */}
          <div className="grid gap-14 pt-4 lg:gap-20">
            {usePortableBody && portableChapters.length > 0
              ? portableChapters.map((chapter, chapterIndex) => {
                  const rows = splitChapterIntoRows(chapter.blocks);
                  return (
                    <section
                      key={chapter.id}
                      id={chapter.id}
                      className={`grid scroll-mt-32 gap-10 lg:gap-14 ${
                        chapterIndex > 0 || chapter.heading
                          ? "border-t border-[var(--color-rule)] pt-10 lg:pt-14"
                          : ""
                      }`}
                    >
                      {rows.map((row, rowIndex) => {
                        if (row.kind === "image") {
                          const resolvedAr = resolveAspectRatio(
                            row.block.url,
                            row.block.aspectRatio,
                            "16:9",
                          );
                          const {
                            aspectClass,
                            ratioLabel,
                            singleMaxWidthClass,
                          } = getAspectConfig(resolvedAr);

                          return (
                            <figure
                              key={row.key}
                              className="m-0 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]"
                            >
                              <figcaption className="order-2 text-[length:var(--text-xs)] leading-[1.65] text-[var(--color-muted)] lg:order-1 lg:col-span-5 lg:pr-12">
                                {row.block.caption || row.block.alt}
                              </figcaption>
                              <div className="order-1 lg:order-2 lg:col-span-7">
                                <div className={singleMaxWidthClass}>
                                  <StoryMedia
                                    image={{
                                      url: row.block.url,
                                      alt: row.block.alt,
                                      caption: row.block.caption,
                                      objectPosition: row.block.objectPosition,
                                    }}
                                    kind="Photo"
                                    ratio={ratioLabel}
                                    aspectClass={aspectClass}
                                    title={row.block.alt}
                                    description={
                                      row.block.caption || row.block.alt
                                    }
                                    sizes="(max-width: 64rem) 100vw, 720px"
                                    variant="editorial"
                                    showCaption={false}
                                  />
                                </div>
                              </div>
                            </figure>
                          );
                        }

                        return (
                          <div
                            key={row.key}
                            className="grid gap-6 lg:grid-cols-12 lg:gap-[var(--gap-columns)]"
                          >
                            <div className="lg:col-span-5 lg:pr-12">
                              {rowIndex === 0 && chapter.heading ? (
                                <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.45rem,2.1vw,2.05rem)] leading-[1.16] font-normal text-[var(--color-forest-deep)] lg:sticky lg:top-32">
                                  {chapter.headingNodes}
                                </h2>
                              ) : null}
                            </div>

                            <div className="grid gap-6 lg:col-span-7">
                              {renderPortableProseBlocks(
                                row.blocks,
                                language,
                                portableSeenRefs,
                                portableFirstParagraphState,
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </section>
                  );
                })
              : segmentedSections.map((section, sectionIndex) => (
                  <div key={section.heading} className="grid gap-12 lg:gap-16">
                    <section
                      id={toSectionId(section.heading, sectionIndex)}
                      className="grid scroll-mt-32 gap-6 border-t border-[var(--color-rule)] pt-10 lg:grid-cols-12 lg:gap-[var(--gap-columns)] lg:pt-14"
                    >
                      {/* Left Margin Heading */}
                      <div className="lg:col-span-5 lg:pr-12">
                        <h2 className="font-[family-name:var(--font-display)] text-[clamp(1.45rem,2.1vw,2.05rem)] leading-[1.16] font-normal text-[var(--color-forest-deep)] lg:sticky lg:top-32">
                          {section.heading}
                        </h2>
                      </div>

                      {/* Right Reading Track */}
                      <div className="grid gap-6 lg:col-span-7">
                        {section.segmentedParagraphs.map(
                          (paragraph, pIndex) => (
                            <p
                              key={paragraph.raw}
                              className={`max-w-[60ch] text-[1.0625rem] leading-[1.82] text-[var(--color-ink)] ${
                                sectionIndex === 0 && pIndex === 0
                                  ? "first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[3.4rem] first-letter:leading-[0.94] first-letter:text-[var(--color-forest-deep)]"
                                  : ""
                              }`}
                            >
                              <StoryReferenceSegments
                                segments={paragraph.segments}
                                lang={language}
                              />
                            </p>
                          ),
                        )}
                      </div>
                    </section>

                    {/* Editorial Pull Quote */}
                    {sectionIndex === 0 && localized.pullQuote ? (
                      <div className="grid lg:grid-cols-12 lg:gap-[var(--gap-columns)]">
                        <div className="hidden lg:col-span-5 lg:block" />
                        <blockquote className="m-0 grid max-w-[56ch] gap-4 border-l-2 border-[var(--color-clay)] py-2 pl-6 sm:pl-8 lg:col-span-7">
                          <p className="font-[family-name:var(--font-display)] text-[clamp(1.4rem,2.2vw,2rem)] leading-[1.28] text-[var(--color-forest-deep)]">
                            &ldquo;{localized.pullQuote.text}&rdquo;
                          </p>
                          {localized.pullQuote.attribution ? (
                            <cite className="text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-ink)] uppercase not-italic">
                              {localized.pullQuote.attribution}
                            </cite>
                          ) : null}
                        </blockquote>
                      </div>
                    ) : null}

                    {/* Section Photographs */}
                    {section.images && section.images.length === 1 ? (
                      (() => {
                        const img = section.images[0]!;
                        const { aspectClass, ratioLabel, singleMaxWidthClass } =
                          getAspectConfig(
                            resolveAspectRatio(img.url, img.aspectRatio),
                          );
                        return (
                          <figure className="m-0 grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
                            {/* Left-margin caption on desktop (generous right padding prevents clipping) */}
                            <figcaption className="order-2 text-[length:var(--text-xs)] leading-[1.65] text-[var(--color-muted)] lg:order-1 lg:col-span-5 lg:pr-12">
                              {img.caption || img.alt}
                            </figcaption>
                            <div className="order-1 lg:order-2 lg:col-span-7">
                              <div className={singleMaxWidthClass}>
                                <StoryMedia
                                  image={img}
                                  kind="Photo"
                                  ratio={ratioLabel}
                                  aspectClass={aspectClass}
                                  title={img.alt || `${localized.title} detail`}
                                  description={img.caption || localized.summary}
                                  sizes="(max-width: 64rem) 100vw, 720px"
                                  variant="editorial"
                                  showCaption={false}
                                />
                              </div>
                            </div>
                          </figure>
                        );
                      })()
                    ) : section.images && section.images.length > 1 ? (
                      <div className="grid items-start gap-[var(--gap-columns)] sm:grid-cols-2">
                        {section.images.map((img) => {
                          const { aspectClass, ratioLabel } = getAspectConfig(
                            resolveAspectRatio(img.url, img.aspectRatio),
                          );
                          return (
                            <StoryMedia
                              key={img.url}
                              image={img}
                              kind="Photo"
                              ratio={ratioLabel}
                              aspectClass={aspectClass}
                              title={img.alt || `${localized.title} detail`}
                              description={img.caption || localized.summary}
                              sizes="(max-width: 40rem) 100vw, 48vw"
                              variant="editorial"
                              showCaption
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                ))}

            {/* Paired Documentary Photographs */}
            {localized.pairImages && localized.pairImages.length > 0 ? (
              <div className="grid items-start gap-[var(--gap-columns)] border-t border-[var(--color-rule)] pt-12 sm:grid-cols-2 lg:pt-14">
                {localized.pairImages.map((img, index) => {
                  const { aspectClass, ratioLabel } = getAspectConfig(
                    resolveAspectRatio(img.url, img.aspectRatio),
                  );
                  return (
                    <StoryMedia
                      key={img.url}
                      image={img}
                      kind="Photo"
                      ratio={ratioLabel}
                      aspectClass={aspectClass}
                      title={
                        story.pairSlots[index]?.title ||
                        img.alt ||
                        `${localized.title} detail`
                      }
                      description={
                        img.caption ||
                        story.pairSlots[index]?.description ||
                        localized.summary
                      }
                      sizes="(max-width: 40rem) 100vw, 48vw"
                      variant="editorial"
                      showCaption
                    />
                  );
                })}
              </div>
            ) : null}

            {/* Closing Reflection (only when takeaway text is present) */}
            {localized.takeaway ? (
              <div
                id="story-takeaway"
                className="grid scroll-mt-32 gap-6 border-t border-[var(--color-rule)] pt-10 lg:grid-cols-12 lg:gap-[var(--gap-columns)] lg:pt-14"
              >
                <div className="grid content-start gap-1.5 lg:col-span-5 lg:pr-12">
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-ink)] uppercase">
                    {isEs ? "En resumen" : "Key takeaway"}
                  </p>
                  <p className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    {localized.categoryLabel}
                  </p>
                </div>

                <div className="grid max-w-[60ch] gap-6 lg:col-span-7">
                  <p className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.1vw,1.85rem)] leading-[1.3] font-normal text-[var(--color-forest-deep)]">
                    {localized.takeaway}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[length:var(--text-sm)] font-semibold">
                    <Link
                      className="inline-flex min-h-[44px] items-center text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                      href={localizeHref("/contact")}
                    >
                      {isEs
                        ? "Hablar con Alma y Shirish"
                        : "Speak with Alma & Shirish"}
                    </Link>
                    {nextStory && nextStoryLocalized ? (
                      <Link
                        className="inline-flex min-h-[44px] items-center text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                        href={localizeHref(`/stories/${nextStory.slug}`)}
                        data-transition-title={nextStoryLocalized.title}
                      >
                        {isEs
                          ? `Siguiente: ${nextStoryLocalized.title}`
                          : `Next: ${nextStoryLocalized.title}`}
                      </Link>
                    ) : null}
                  </div>
                </div>
              </div>
            ) : null}

            {/* Quiet Topics & Share Utility Strip */}
            <div className="grid gap-6 border-t border-[var(--color-rule)] pt-8 lg:grid-cols-12 lg:items-center lg:gap-[var(--gap-columns)]">
              <div className="flex flex-wrap items-center gap-2 lg:col-span-5 lg:pr-10">
                {localized.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-[var(--color-rule)] px-3 py-1 text-[length:var(--text-xs)] text-[var(--color-muted)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-5 lg:col-span-7">
                <div
                  aria-label={
                    isEs ? "Compartir esta historia" : "Share this Story"
                  }
                  className="flex flex-wrap items-center gap-2"
                  role="group"
                >
                  <span className="mr-1 text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-muted)] uppercase">
                    {isEs ? "Compartir" : "Share"}
                  </span>

                  <a
                    aria-label={
                      isEs ? "Compartir por WhatsApp" : "Share on WhatsApp"
                    }
                    className="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-rule-2)]/60 text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                    href={whatsappShareHref}
                    rel="noopener noreferrer"
                    target="_blank"
                    title="WhatsApp"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-[17px] w-[17px]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                  </a>

                  <a
                    aria-label={
                      isEs ? "Compartir en LinkedIn" : "Share on LinkedIn"
                    }
                    className="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-rule-2)]/60 text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                    href={linkedinShareHref}
                    rel="noopener noreferrer"
                    target="_blank"
                    title="LinkedIn"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-[17px] w-[17px]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002ZM7 8.48H3V21h4V8.48Zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68Z" />
                    </svg>
                  </a>

                  <a
                    aria-label={isEs ? "Compartir en X" : "Share on X"}
                    className="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-rule-2)]/60 text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                    href={xShareHref}
                    rel="noopener noreferrer"
                    target="_blank"
                    title="X"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-[15px] w-[15px]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>

                  <a
                    aria-label={
                      isEs ? "Compartir por correo" : "Share by email"
                    }
                    className="inline-flex h-11 w-11 items-center justify-center border border-[var(--color-rule-2)]/60 text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                    href={emailShareHref}
                    title={isEs ? "Correo electrónico" : "Email"}
                  >
                    <svg
                      aria-hidden="true"
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.6"
                      viewBox="0 0 24 24"
                    >
                      <rect height="14" rx="1.5" width="18" x="3" y="5" />
                      <path d="m4 7 8 6 8-6" />
                    </svg>
                  </a>

                  <button
                    type="button"
                    onClick={() => void handleCopyLink()}
                    className="inline-flex h-11 cursor-pointer items-center gap-2 border border-[var(--color-rule-2)]/60 bg-transparent px-3.5 text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-forest-deep)] uppercase transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                  >
                    <svg
                      aria-hidden="true"
                      className="h-3.5 w-3.5"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.6"
                      viewBox="0 0 24 24"
                    >
                      <path d="M10 13a5 5 0 0 0 7.07 0l2.83-2.83a5 5 0 0 0-7.07-7.07L11.4 4.5" />
                      <path d="M14 11a5 5 0 0 0-7.07 0L4.1 13.83a5 5 0 0 0 7.07 7.07l1.42-1.42" />
                    </svg>
                    <span>
                      {copiedLink
                        ? isEs
                          ? "Enlace copiado"
                          : "Link copied"
                        : isEs
                          ? "Copiar enlace"
                          : "Copy link"}
                    </span>
                  </button>
                </div>

                <Link
                  href={localizeHref("/product-brief")}
                  className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                >
                  {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>

      {/* More Stories Band with Continuous Color Flow into SiteFooter */}
      {orderedRelatedStories.length > 0 ? (
        <section
          className="text-[var(--color-forest-deep)]"
          style={{
            background:
              "linear-gradient(180deg, var(--color-paper) 0%, var(--color-dune) 14%, var(--color-dune) 100%)",
          }}
        >
          <div className="container grid gap-[var(--space-2xl)] pt-[var(--section-gap-s)] pb-[var(--space-2xl)]">
            <div className="flex flex-wrap items-end justify-between gap-6 border-b border-[var(--color-rule-2)]/40 pb-6">
              <div className="grid gap-2">
                <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-ink)] uppercase">
                  {isEs ? "Seguir leyendo" : "Continue reading"}
                </p>
                <h2 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-display-s)] leading-[1.06] font-normal text-[var(--color-forest-deep)]">
                  {isEs ? "Más historias" : "Up next"}
                </h2>
              </div>

              <Link
                href={localizeHref("/stories")}
                className="inline-flex min-h-[44px] items-center text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-forest-deep)] uppercase underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              >
                {isEs ? "Ver todas las historias" : "See all Stories"}
              </Link>
            </div>

            <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-3">
              {orderedRelatedStories.map((entry) => {
                const entryLocalized = getLocalizedStory(entry, language);
                return (
                  <article
                    key={entry.slug}
                    className="group grid content-start gap-4"
                  >
                    <Link
                      href={localizeHref(`/stories/${entry.slug}`)}
                      data-transition-title={entryLocalized.title}
                      className="block"
                    >
                      <StoryMedia
                        image={entryLocalized.leadImage}
                        kind={entry.leadSlot.kind}
                        ratio="4:3 horizontal"
                        aspectClass="aspect-[4/3]"
                        title={entry.leadSlot.title}
                        description={entry.leadSlot.description}
                        sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                        variant="editorial"
                        interactive
                      />
                    </Link>

                    <div className="grid gap-2 pt-1">
                      <p className="num text-[length:var(--text-xs)] font-medium tracking-[0.05em] text-[var(--color-muted)] uppercase">
                        <time dateTime={entry.publishedAt}>
                          {formatStoryDate(entry.publishedAt, language)}
                        </time>
                        <span aria-hidden="true"> · </span>
                        <span className="text-[var(--color-clay-ink)]">
                          {entryLocalized.categoryLabel}
                        </span>
                      </p>

                      <h3 className="font-[family-name:var(--font-display)] text-[clamp(1.3rem,1.8vw,1.65rem)] leading-[1.18] font-normal">
                        <Link
                          href={localizeHref(`/stories/${entry.slug}`)}
                          data-transition-title={entryLocalized.title}
                          className="text-[var(--color-forest-deep)] no-underline transition-colors group-hover:text-[var(--color-clay-ink)]"
                        >
                          {entryLocalized.title}
                        </Link>
                      </h3>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Smooth Color Bridge into SiteFooter (--color-night) */}
          <div
            aria-hidden="true"
            className="h-[clamp(96px,15svh,168px)] w-full"
            style={{
              background:
                "linear-gradient(180deg, var(--color-dune) 0%, color-mix(in srgb, var(--color-forest-deep) 42%, var(--color-dune)) 48%, var(--color-forest-deep) 78%, var(--color-night) 100%)",
            }}
          />
        </section>
      ) : (
        <div
          aria-hidden="true"
          className="h-[clamp(96px,15svh,168px)] w-full"
          style={{
            background:
              "linear-gradient(180deg, var(--color-paper) 0%, var(--color-forest-deep) 75%, var(--color-night) 100%)",
          }}
        />
      )}
    </>
  );
}
