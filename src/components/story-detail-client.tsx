"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { NewsletterForm } from "@/components/newsletter-form";
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
  type StoryLanguage,
  type StoryMarkDef,
  type StoryTextSpan,
} from "@/data/stories";

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

function renderPortableBody(
  blocks: StoryBodyBlock[],
  lang: StoryLanguage,
): ReactNode[] {
  const elements: ReactNode[] = [];
  const seenReferenceIds = new Set<string>();
  let h2Counter = 0;
  let normalParagraphCounter = 0;

  for (const block of blocks) {
    if (block._type === "block") {
      const plainText = block.children.map((c) => c.text).join("");
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

      if (block.style === "h2") {
        const currentIndex = h2Counter;
        h2Counter += 1;
        elements.push(
          <h2
            key={block._key}
            id={toSectionId(plainText, currentIndex)}
            className="max-w-[64ch] scroll-mt-32 pt-4 text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]"
          >
            {renderedChildren}
          </h2>,
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
              objectPosition: block.objectPosition,
            }}
            kind="Photo"
            ratio={block.aspectRatio || "16:9"}
            aspectClass={aspectClass}
            title={block.alt}
            description={block.caption || block.alt}
            sizes="(max-width: 64rem) 100vw, 760px"
            showCaption
          />
        </div>,
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

  const relatedStories = allStories
    .filter((entry) => entry.slug !== story.slug)
    .slice(0, 3);

  const usePortableBody =
    Boolean(story.body && story.body.length > 0) &&
    (!isEs ||
      (story.language === "es" &&
        (!story.spanishSections || story.spanishSections.length === 0)));

  const tocHeadings = usePortableBody
    ? (story.body ?? [])
        .filter(
          (b): b is Extract<StoryBodyBlock, { _type: "block" }> =>
            b._type === "block" && b.style === "h2",
        )
        .map((b) => b.children.map((c) => c.text).join(""))
        .filter(Boolean)
    : localized.sections.map((s) => s.heading);

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

  return (
    <>
      <article className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-2xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
        <div className="container grid gap-[var(--space-2xl)]">
          {/* Top Breadcrumb Bar (no numbers) */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-rule)] pb-5 text-[length:var(--text-xs)] font-semibold tracking-[0.05em] uppercase">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                className="text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
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

          {/* Article Title & Intro */}
          <header className="grid gap-[var(--space-xl)] lg:grid-cols-12 lg:items-end">
            <div className="grid gap-[var(--space-lg)] lg:col-span-8">
              <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
                {localized.location}
              </p>

              <h1 className="max-w-[18ch] text-[clamp(2.45rem,4.8vw,4.5rem)] leading-[1.01] font-medium text-[var(--color-forest-deep)]">
                {localized.title}
              </h1>

              <p className="lead max-w-[56ch] text-[var(--color-ink-2)]">
                {localized.summary}
              </p>
            </div>

            {/* Author Card */}
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
                    {isEs
                      ? `Escrito por ${story.author.name}`
                      : `Written by ${story.author.name}`}
                  </p>
                  <p className="text-[var(--color-muted)]">
                    {localized.authorRole}
                  </p>
                  <p className="text-[var(--color-clay-ink)]">
                    {localized.authorLocation}
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Lead Photograph */}
          <StoryMedia
            image={localized.leadImage}
            kind={story.leadSlot.kind}
            ratio="16:9 wide"
            aspectClass="aspect-[16/9]"
            title={story.leadSlot.title}
            description={story.leadSlot.description}
            sizes="(max-width: 80rem) 100vw, 1280px"
            priority
            showCaption
          />

          {/* Two-column Reading Layout */}
          <div className="grid items-start gap-[var(--gap-columns)] pt-4 lg:grid-cols-12">
            {/* Left Sticky Sidebar */}
            <aside className="grid gap-6 lg:sticky lg:top-32 lg:col-span-4">
              {tocHeadings.length > 0 ? (
                <div className="grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]/45 p-6">
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
                    {isEs ? "En esta historia" : "In this Story"}
                  </p>
                  <ol className="m-0 grid list-none gap-2.5 p-0 text-[length:var(--text-sm)]">
                    {tocHeadings.map((heading, idx) => (
                      <li key={`${heading}-${idx}`}>
                        <a
                          href={`#${toSectionId(heading, idx)}`}
                          className="inline-flex items-baseline gap-2.5 text-[var(--color-forest-deep)] underline decoration-[var(--color-rule)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        >
                          {heading}
                        </a>
                      </li>
                    ))}
                    {localized.takeaway ? (
                      <li>
                        <a
                          href="#story-takeaway"
                          className="inline-flex items-baseline gap-2.5 text-[var(--color-forest-deep)] underline decoration-[var(--color-rule)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        >
                          {isEs ? "En resumen" : "Key takeaway"}
                        </a>
                      </li>
                    ) : null}
                  </ol>
                </div>
              ) : null}

              {localized.tags.length > 0 ? (
                <div className="grid gap-2.5 border-t border-[var(--color-rule)] pt-4">
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-muted)] uppercase">
                    {isEs ? "Temas" : "Topics"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {localized.tags.map((tag) => (
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
                  {isEs ? "Contacto directo" : "Direct conversation"}
                </p>
                <p className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.15]">
                  {isEs
                    ? "Hablemos sobre tu próximo proyecto."
                    : "Looking to develop a product in India?"}
                </p>
                <p className="text-[length:var(--text-sm)] text-[var(--color-paper-2)]">
                  {isEs
                    ? "Escríbenos directamente para comentar tu idea, cantidades o dudas sobre cómo trabajamos entre España, Europa y toda la India."
                    : "Write directly to Alma and Shirish to discuss your product, quantities, or how we work across Spain, Europe, and India."}
                </p>
                <div className="pt-1">
                  <Link
                    href={localizeHref("/contact")}
                    className="inline-flex items-center font-semibold text-[var(--color-gold)] underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-paper)]"
                  >
                    {isEs
                      ? "Escribir a Alma y Shirish"
                      : "Write to Alma & Shirish"}
                  </Link>
                </div>
              </div>
            </aside>

            {/* Main Reading Column */}
            <div className="grid gap-[var(--space-xl)] lg:col-span-8">
              {usePortableBody && story.body ? (
                <div className="grid gap-5">
                  {renderPortableBody(story.body, language)}
                </div>
              ) : (
                segmentedSections.map((section, sectionIndex) => (
                  <div
                    key={section.heading}
                    className="grid gap-[var(--space-2xl)]"
                  >
                    <section
                      id={toSectionId(section.heading, sectionIndex)}
                      className="grid max-w-[64ch] scroll-mt-32 gap-5"
                    >
                      <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]">
                        {section.heading}
                      </h2>

                      {section.segmentedParagraphs.map((paragraph, pIndex) => (
                        <p
                          key={paragraph.raw}
                          className={`text-[length:var(--text-md)] leading-[1.78] text-[var(--color-ink)] ${
                            sectionIndex === 0 && pIndex === 0
                              ? "first-letter:float-left first-letter:mr-3 first-letter:font-[family-name:var(--font-display)] first-letter:text-[3.35rem] first-letter:leading-[0.88] first-letter:text-[var(--color-forest-deep)]"
                              : ""
                          }`}
                        >
                          <StoryReferenceSegments
                            segments={paragraph.segments}
                            lang={language}
                          />
                        </p>
                      ))}
                    </section>

                    {sectionIndex === 0 && localized.pullQuote ? (
                      <blockquote className="m-0 my-2 grid max-w-[60ch] gap-3 border-l-4 border-[var(--color-clay)] bg-[var(--color-paper-2)]/55 py-6 pr-6 pl-6 sm:pl-8">
                        <p className="font-[family-name:var(--font-display)] text-[clamp(1.35rem,2.2vw,1.95rem)] leading-[1.24] text-[var(--color-forest-deep)]">
                          &ldquo;{localized.pullQuote.text}&rdquo;
                        </p>
                        {localized.pullQuote.attribution ? (
                          <cite className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase not-italic">
                            {localized.pullQuote.attribution}
                          </cite>
                        ) : null}
                      </blockquote>
                    ) : null}

                    {section.images && section.images.length > 0 ? (
                      <div
                        className={
                          section.images.length > 1
                            ? "grid gap-[var(--gap-columns)] pt-2 md:grid-cols-2"
                            : "max-w-[32rem] pt-2"
                        }
                      >
                        {section.images.map((img) => {
                          const imgAspect =
                            img.aspectRatio === "4:3"
                              ? "aspect-[4/3]"
                              : img.aspectRatio === "16:9"
                                ? "aspect-[16/9]"
                                : "aspect-[4/5]";
                          const imgRatioLabel =
                            img.aspectRatio === "4:3"
                              ? "4:3 horizontal"
                              : img.aspectRatio === "16:9"
                                ? "16:9 wide"
                                : "4:5 portrait";
                          return (
                            <StoryMedia
                              key={img.url}
                              image={img}
                              kind="Photo"
                              ratio={imgRatioLabel}
                              aspectClass={imgAspect}
                              title={img.alt || `${localized.title} detail`}
                              description={img.caption || localized.summary}
                              sizes="(max-width: 48rem) 100vw, 38vw"
                              showCaption
                            />
                          );
                        })}
                      </div>
                    ) : null}
                  </div>
                ))
              )}

              {/* Paired Documentary Photographs */}
              {localized.pairImages && localized.pairImages.length > 0 ? (
                <div className="grid gap-[var(--gap-columns)] pt-4 md:grid-cols-2">
                  {localized.pairImages.map((img, index) => (
                    <StoryMedia
                      key={img.url}
                      image={img}
                      kind="Photo"
                      ratio="4:5 portrait"
                      aspectClass="aspect-[4/5]"
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
                      sizes="(max-width: 48rem) 100vw, 38vw"
                      showCaption
                    />
                  ))}
                </div>
              ) : null}

              {/* Key Takeaway Card */}
              {localized.takeaway ? (
                <div
                  id="story-takeaway"
                  className="grid max-w-[64ch] scroll-mt-32 gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-8"
                >
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
                    {isEs ? "En resumen" : "Key takeaway"} ·{" "}
                    {localized.categoryLabel}
                  </p>
                  <p className="font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.22] font-medium text-[var(--color-forest-deep)]">
                    {localized.takeaway}
                  </p>
                  <div className="flex flex-wrap items-center justify-between gap-6 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)] font-semibold">
                    <Link
                      className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                      href={localizeHref("/contact")}
                    >
                      {isEs
                        ? "Hablar con Alma y Shirish"
                        : "Speak with Alma & Shirish"}
                    </Link>
                    {nextStory && nextStoryLocalized ? (
                      <Link
                        className="underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href={localizeHref(`/stories/${nextStory.slug}`)}
                      >
                        {isEs
                          ? `Siguiente historia: ${nextStoryLocalized.title}`
                          : `Next Story: ${nextStoryLocalized.title}`}
                      </Link>
                    ) : null}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </article>

      {/* Continue Reading */}
      {relatedStories.length > 0 ? (
        <section className="border-t border-[var(--color-rule)] bg-[var(--color-dune)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="grid gap-2">
                <p className="section-index">
                  {isEs ? "Seguir leyendo" : "Continue reading"}
                </p>
                <h2 className="text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                  {isEs ? "Más historias" : "More Stories"}
                </h2>
              </div>
              <Link
                href={localizeHref("/stories")}
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              >
                {isEs ? "Ver todas las historias" : "View all Stories"}
              </Link>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              {relatedStories.map((entry) => {
                const entryLocalized = getLocalizedStory(entry, language);
                return (
                  <article
                    key={entry.slug}
                    className="group flex flex-col justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-rule-2)]/35 bg-[var(--color-paper)] p-5"
                  >
                    <div className="grid gap-4">
                      <Link
                        href={localizeHref(`/stories/${entry.slug}`)}
                        className="block"
                      >
                        <StoryMedia
                          image={entryLocalized.leadImage}
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
                        {entryLocalized.categoryLabel} ·{" "}
                        {isEs
                          ? `${entry.readingTimeMinutes} min de lectura`
                          : `${entry.readingTimeMinutes} min read`}
                      </p>
                      <h3 className="text-[length:var(--text-xl)] leading-[1.15] font-medium">
                        <Link
                          href={localizeHref(`/stories/${entry.slug}`)}
                          className="no-underline group-hover:text-[var(--color-clay-ink)]"
                        >
                          {entryLocalized.title}
                        </Link>
                      </h3>
                    </div>

                    <div className="border-t border-[var(--color-rule)] pt-3">
                      <Link
                        href={localizeHref(`/stories/${entry.slug}`)}
                        className="text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                      >
                        {isEs ? "Leer historia" : "Read Story"}
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
            <p className="section-index">
              {isEs ? "Mantente al día" : "Stay connected"}
            </p>
            <h2 className="text-[length:var(--text-2xl)] font-medium">
              {isEs
                ? "Recibe nuestras nuevas historias por correo."
                : "Receive new Stories by email."}
            </h2>
            <p className="max-w-[48ch] text-[var(--color-muted)]">
              {isEs
                ? "Cada pocas semanas enviamos nuestras últimas historias sobre fabricación en la India, Almarise y nuestro trabajo entre España y la India."
                : "Every few weeks, we send our latest Stories on Indian manufacturing, Almarise, and our work across India and Spain."}
            </p>
          </div>
          <div className="lg:col-span-7">
            <NewsletterForm variant="journal" source={`Story: ${story.slug}`} />
          </div>
        </div>
      </section>
    </>
  );
}
