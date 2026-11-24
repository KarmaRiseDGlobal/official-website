"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import {
  getAspectConfig,
  getImageDimensionsFromUrl,
  renderPortableProseBlocks,
  resolveAspectRatio,
  resolveStoryChapters,
  sanitizePortableLinkHref,
  splitChapterIntoRows,
} from "@/components/stories/story-detail-helpers";
import {
  StoryAuthorSection,
  StoryGlossarySection,
  StoryRelatedSection,
  StoryShareUtilityStrip,
} from "@/components/stories/story-detail-sections";
import { StoryMedia } from "@/components/stories/story-media";
import { useLanguage } from "@/context/language-context";
import type { StoryReferenceEntry } from "@/data/story-references";
import {
  formatStoryDate,
  getCategoryDetail,
  getLocalizedStory,
  type StoryEntry,
  type StoryLanguage,
  type StorySummary,
} from "@/data/story-types";
import { siteUrl } from "@/lib/urls";

export { sanitizePortableLinkHref };

interface StoryDetailClientProps {
  story: StoryEntry;
  allStories: StorySummary[];
  lang?: StoryLanguage;
}

function subscribeNoop(): () => void {
  return () => {};
}

function getCanNativeShareSnapshot(): boolean {
  return (
    typeof navigator !== "undefined" && typeof navigator.share === "function"
  );
}

function getCanNativeShareServerSnapshot(): boolean {
  return false;
}

export function StoryDetailClient({
  story,
  allStories,
  lang,
}: StoryDetailClientProps) {
  const { language: contextLanguage, localizeHref } = useLanguage();
  const language = lang ?? contextLanguage;
  const isEs = language === "es";
  const [copiedLink, setCopiedLink] = useState(false);
  const canNativeShare = useSyncExternalStore(
    subscribeNoop,
    getCanNativeShareSnapshot,
    getCanNativeShareServerSnapshot,
  );

  const localized = getLocalizedStory(story, language);
  const categorySlug = getCategoryDetail(story.category).slug;
  const storyTagSet = new Set(story.tags.map((tag) => tag.toLowerCase()));

  // Rank related Stories by same category first, then shared tags, then recency.
  const orderedRelatedStories = [...allStories]
    .filter((entry) => entry.slug !== story.slug)
    .map((entry) => {
      let score = 0;
      if (entry.category === story.category) {
        score += 10;
      }
      for (const tag of entry.tags) {
        if (storyTagSet.has(tag.toLowerCase())) {
          score += 2;
        }
      }
      return { entry, score };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return b.entry.publishedAt.localeCompare(a.entry.publishedAt);
    })
    .slice(0, 3)
    .map((item) => item.entry);

  const nextStory = orderedRelatedStories[0];
  const nextStoryLocalized = nextStory
    ? getLocalizedStory(nextStory, language)
    : undefined;

  const chapters = resolveStoryChapters(
    story,
    localized.sections,
    localized.pullQuote,
    language,
  );

  const seenReferenceIds = new Set<string>();
  const referencedEntries: StoryReferenceEntry[] = [];
  const firstParagraphState = { rendered: false };

  const renderedChapters = chapters.map((chapter, chapterIndex) => {
    const rows = splitChapterIntoRows(
      chapter.blocks,
      chapter.imageGrid,
      chapter.id,
    );
    return {
      chapter,
      chapterIndex,
      rows: rows.map((row) =>
        row.kind === "prose"
          ? {
              ...row,
              renderedBlocks: renderPortableProseBlocks(
                row.blocks,
                language,
                seenReferenceIds,
                firstParagraphState,
                referencedEntries,
              ),
            }
          : row,
      ),
    };
  });

  const shareUrl = `${siteUrl}${localizeHref(`/stories/${story.slug}`)}`;
  const whatsappShareHref = `https://wa.me/?text=${encodeURIComponent(`${localized.title} ${shareUrl}`)}`;
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

  const handleNativeShare = async () => {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({
        title: localized.title,
        text: localized.summary,
        url: shareUrl,
      });
    } catch {
      // User dismissed the OS share sheet.
    }
  };

  const authorDisplayName = isEs
    ? story.author.name.replace(/\s*&\s*/g, " y ")
    : story.author.name;

  const authorHref = /alma.*shirish|shirish.*alma/i.test(story.author.name)
    ? "/about"
    : /shirish/i.test(story.author.name)
      ? "/about#shirish"
      : /alma/i.test(story.author.name)
        ? "/about#alma"
        : "/about";

  const authorBio = (() => {
    if (/alma.*shirish|shirish.*alma/i.test(story.author.name)) {
      return isEs
        ? "Alma (España y el resto de Europa) y Shirish (abogado colegiado en el Bar Council de la India) fundaron KarmaRise D Global para acompañar a comercios y marcas de España y el resto de Europa sobre el terreno en toda la India."
        : "Alma (Spain and the rest of Europe) and Shirish (registered Bar Council advocate in India) co-founded KarmaRise D Global to guide retail shops and brands from Spain and the rest of Europe on the ground across India.";
    }
    if (/shirish/i.test(story.author.name)) {
      return isEs
        ? "Shirish es cofundador de KarmaRise D Global y abogado colegiado en el Bar Council de la India. Redacta los contratos con unidades de producción bajo ley india, audita fábricas de corte familiar en toda la India y supervisa el control de calidad y la exportación."
        : "Shirish is co-founder of KarmaRise D Global and a registered Bar Council advocate in India. He structures production unit contracts under Indian law, audits family-run factories across India, and supervises on-site quality checks and export dispatch.";
    }
    return isEs
      ? "Alma es cofundadora de KarmaRise D Global. Trabaja entre España y la India ayudando a comercios y marcas de España y el resto de Europa a convertir sus ideas en muestras físicas y colecciones propias, y dirige AlmaRise D Brand."
      : "Alma is co-founder of KarmaRise D Global. Working between Spain and India, she guides retail shops and brands in Spain and the rest of Europe from early ideas to approved physical samples and directs AlmaRise D Brand.";
  })();

  const contextualGuideLinks: ReadonlyArray<{
    href: string;
    label: string;
  }> = (() => {
    if (story.category === "Sustainable Fashion") {
      return [
        {
          href: "/almarise",
          label: isEs
            ? "Conocer AlmaRise D Reborn y AlmaRise D Organic"
            : "Explore AlmaRise D Reborn & AlmaRise D Organic",
        },
        {
          href: "/manufacturing",
          label: isEs
            ? "Programa de producción en la India"
            : "Manufacturing Programme in India",
        },
        {
          href: "/contact",
          label: isEs
            ? "Preguntarnos por AlmaRise D Brand"
            : "Ask us about AlmaRise D Brand",
        },
      ];
    }
    if (story.slug === "preparing-womens-garment-training-maharashtra") {
      return [
        {
          href: "/womens-training-initiative",
          label: isEs
            ? "Leer sobre la Iniciativa de formación para mujeres"
            : "Read about the Women's Training Initiative",
        },
        {
          href: "/almarise",
          label: isEs ? "Conocer AlmaRise D Brand" : "Explore AlmaRise D Brand",
        },
        {
          href: "/contact",
          label: isEs
            ? "Escribirnos sobre la iniciativa"
            : "Contact us about the initiative",
        },
      ];
    }
    return [
      {
        href: "/manufacturing",
        label: isEs
          ? "Explorar el Programa de producción"
          : "Explore the Manufacturing Programme",
      },
      {
        href: "/how-we-work",
        label: isEs
          ? "Cómo trabajamos España-India"
          : "How we work Spain-India",
      },
      {
        href: "/product-brief",
        label: isEs ? "Empieza tu briefing" : "Start a Product Brief",
      },
      {
        href: "/book-a-call?duration=15",
        label: isEs
          ? "Llamada gratis de 15 min con Alma"
          : "Book a free 15-min call with Alma",
      },
      {
        href: "/contact",
        label: isEs ? "Escribir a Alma y Shirish" : "Write to Alma and Shirish",
      },
    ];
  })();

  const showUpdatedDate = Boolean(
    story.updatedAt &&
    story.updatedAt.slice(0, 10) !== story.publishedAt.slice(0, 10),
  );

  const authorPortraitUrl = (() => {
    const rawUrl = story.author.portraitUrl;
    if (!rawUrl) return undefined;
    if (/alma.*shirish/i.test(story.author.name)) {
      const dims = getImageDimensionsFromUrl(rawUrl);
      if (
        rawUrl.includes("alma-and-shirish-founders") ||
        (dims && dims.width / dims.height > 1.35)
      ) {
        return "/images/founders/alma-and-shirish-avatar.jpg";
      }
    }
    return rawUrl;
  })();

  return (
    <>
      <article className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-2xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)] lg:pt-[calc(var(--nav-height)+var(--space-3xl))]">
        <div className="container grid gap-[var(--space-xl)] lg:gap-[var(--space-2xl)]">
          {/* Top Hairline Semantic Breadcrumb & Reading Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[var(--color-rule)] py-2 text-[length:var(--text-xs)] font-semibold tracking-[0.06em] uppercase">
            <nav
              aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
              className="flex items-center"
            >
              <ol className="m-0 flex list-none flex-wrap items-center gap-2.5 p-0">
                <li>
                  <Link
                    className="inline-flex min-h-[44px] items-center text-[var(--color-muted)] no-underline transition-colors hover:text-[var(--color-forest-deep)]"
                    href={localizeHref("/")}
                  >
                    {isEs ? "Inicio" : "Home"}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-[var(--color-rule-2)]">
                  /
                </li>
                <li>
                  <Link
                    className="inline-flex min-h-[44px] items-center text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={localizeHref("/stories")}
                  >
                    {isEs ? "Historias" : "Stories"}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-[var(--color-rule-2)]">
                  /
                </li>
                <li>
                  <Link
                    className="inline-flex min-h-[44px] items-center text-[var(--color-clay-ink)] no-underline transition-colors hover:underline"
                    href={localizeHref(`/stories?category=${categorySlug}`)}
                  >
                    {localized.categoryLabel}
                  </Link>
                </li>
              </ol>
            </nav>

            <div className="num flex flex-wrap items-center gap-3 font-medium text-[var(--color-muted)]">
              <span>
                {isEs
                  ? `${story.readingTimeMinutes} min de lectura`
                  : `${story.readingTimeMinutes} min read`}
              </span>
              <span aria-hidden="true">·</span>
              <time dateTime={story.publishedAt}>
                {formatStoryDate(story.publishedAt, language)}
              </time>
              {showUpdatedDate && story.updatedAt ? (
                <>
                  <span aria-hidden="true">·</span>
                  <span>
                    {isEs ? "Actualizado " : "Updated "}
                    <time dateTime={story.updatedAt}>
                      {formatStoryDate(story.updatedAt, language)}
                    </time>
                  </span>
                </>
              ) : null}
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
                      alt={authorDisplayName}
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className="grid gap-0.5 text-[length:var(--text-xs)]">
                  <p className="font-semibold text-[var(--color-forest-deep)]">
                    <Link
                      href={localizeHref(
                        /alma.*shirish|shirish.*alma/i.test(story.author.name)
                          ? "/about"
                          : /shirish/i.test(story.author.name)
                            ? "/about#shirish"
                            : /alma/i.test(story.author.name)
                              ? "/about#alma"
                              : "/about",
                      )}
                      className="text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)]/60 underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                    >
                      {isEs
                        ? `Por ${authorDisplayName}`
                        : `By ${authorDisplayName}`}
                    </Link>
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
                <div className="grid lg:grid-cols-12 lg:gap-[var(--gap-columns)]">
                  <div className="lg:col-span-7 lg:col-start-6">
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
                      />
                    </div>
                  </div>
                </div>
              );
            }

            return (
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
              />
            );
          })()}

          {/* Asymmetric 5/7 Marginalia Reading Flow */}
          <div className="grid gap-14 pt-4 lg:gap-20">
            {renderedChapters.map(({ chapter, chapterIndex, rows }) => (
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
                    const { aspectClass, ratioLabel, singleMaxWidthClass } =
                      getAspectConfig(resolvedAr);

                    return (
                      <div
                        key={row.key}
                        className="grid lg:grid-cols-12 lg:gap-[var(--gap-columns)]"
                      >
                        <div className="lg:col-span-7 lg:col-start-6">
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
                              description={row.block.caption || row.block.alt}
                              sizes="(max-width: 64rem) 100vw, 720px"
                              variant="editorial"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }

                  if (row.kind === "imageGrid") {
                    return (
                      <div
                        key={row.key}
                        className="grid items-start gap-[var(--gap-columns)] sm:grid-cols-2"
                      >
                        {row.images.map((img) => {
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
                            />
                          );
                        })}
                      </div>
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
                        {row.renderedBlocks}
                      </div>
                    </div>
                  );
                })}
              </section>
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

            <StoryGlossarySection
              referencedEntries={referencedEntries}
              language={language}
              isEs={isEs}
            />

            <StoryAuthorSection
              authorPortraitUrl={authorPortraitUrl}
              authorDisplayName={authorDisplayName}
              authorRole={localized.authorRole}
              authorBio={authorBio}
              authorHref={authorHref}
              isEs={isEs}
              localizeHref={localizeHref}
            />

            <StoryShareUtilityStrip
              story={story}
              tags={localized.tags}
              isEs={isEs}
              whatsappShareHref={whatsappShareHref}
              xShareHref={xShareHref}
              emailShareHref={emailShareHref}
              canNativeShare={canNativeShare}
              copiedLink={copiedLink}
              contextualGuideLinks={contextualGuideLinks}
              localizeHref={localizeHref}
              onNativeShare={() => void handleNativeShare()}
              onCopyLink={() => void handleCopyLink()}
            />
          </div>
        </div>
      </article>

      <StoryRelatedSection
        orderedRelatedStories={orderedRelatedStories}
        language={language}
        isEs={isEs}
        localizeHref={localizeHref}
      />
    </>
  );
}
