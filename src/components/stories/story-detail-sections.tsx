"use client";

import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SectionBridge } from "@/components/shell/section-bridge";
import { StoryMedia } from "@/components/stories/story-media";
import {
  REFERENCE_KIND_LABELS,
  type StoryReferenceEntry,
} from "@/data/story-references";
import {
  formatStoryDate,
  getLocalizedStory,
  type StoryEntry,
  type StoryLanguage,
  type StorySummary,
} from "@/data/story-types";
import { getTrackForStory } from "@/lib/newsletter-tracks";

export function StoryGlossarySection({
  referencedEntries,
  language,
  isEs,
}: {
  referencedEntries: readonly StoryReferenceEntry[];
  language: StoryLanguage;
  isEs: boolean;
}) {
  if (referencedEntries.length === 0) {
    return null;
  }

  return (
    <section
      id="story-references"
      aria-labelledby="story-references-heading"
      className="grid scroll-mt-32 gap-6 border-t border-[var(--color-rule)] pt-10 lg:grid-cols-12 lg:gap-[var(--gap-columns)] lg:pt-14"
    >
      <div className="grid content-start gap-2 lg:col-span-5 lg:pr-12">
        <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-eyebrow)] text-[var(--color-clay-ink)] uppercase">
          {isEs ? "Notas y contexto" : "Field notes & glossary"}
        </p>
        <h2
          id="story-references-heading"
          className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.18] font-normal text-[var(--color-forest-deep)]"
        >
          {isEs
            ? "Lugares y términos citados en esta historia"
            : "Places and terms referenced in this Story"}
        </h2>
      </div>

      <dl className="m-0 grid gap-4 sm:grid-cols-2 lg:col-span-7">
        {referencedEntries.map((entry) => (
          <div
            key={entry.id}
            className="grid content-start gap-1.5 rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]/55 p-4"
          >
            <span className="text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-clay-ink)] uppercase">
              {REFERENCE_KIND_LABELS[entry.category][language]}
            </span>
            <dt className="font-[family-name:var(--font-display)] text-[length:var(--text-md)] leading-[1.22] font-normal text-[var(--color-forest-deep)]">
              {entry.title[language]}
            </dt>
            <dd className="m-0 text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-ink-2)]">
              {entry.description[language]}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export function StoryAuthorSection({
  authorPortraitUrl,
  authorDisplayName,
  authorRole,
  authorBio,
  authorHref,
  isEs,
  localizeHref,
}: {
  authorPortraitUrl?: string;
  authorDisplayName: string;
  authorRole: string;
  authorBio: string;
  authorHref: string;
  isEs: boolean;
  localizeHref: (href: string) => string;
}) {
  return (
    <section
      aria-labelledby="story-author-heading"
      className="grid gap-6 border-t border-[var(--color-rule)] pt-10 lg:grid-cols-12 lg:items-center lg:gap-[var(--gap-columns)]"
    >
      <div className="flex items-center gap-4 lg:col-span-5 lg:pr-10">
        {authorPortraitUrl ? (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
            <Image
              src={authorPortraitUrl}
              alt={authorDisplayName}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>
        ) : null}
        <div className="grid gap-0.5">
          <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-eyebrow)] text-[var(--color-clay-ink)] uppercase">
            {isEs ? "Sobre la autoría" : "About the author"}
          </p>
          <h2
            id="story-author-heading"
            className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-forest-deep)]"
          >
            {authorDisplayName}
          </h2>
          <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-muted)]">
            {authorRole}
          </p>
        </div>
      </div>

      <div className="grid max-w-[60ch] gap-3 lg:col-span-7">
        <p className="m-0 text-[length:var(--text-sm)] leading-[1.7] text-[var(--color-ink-2)]">
          {authorBio}
        </p>
        <div>
          <Link
            href={localizeHref(authorHref)}
            className="inline-flex min-h-[var(--tap-min)] items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
          >
            {isEs
              ? "Conoce a Alma y Shirish en Quiénes somos →"
              : "Meet Alma and Shirish on About →"}
          </Link>
        </div>
      </div>
    </section>
  );
}

export function StoryShareUtilityStrip({
  story,
  tags,
  isEs,
  whatsappShareHref,
  xShareHref,
  emailShareHref,
  canNativeShare,
  copiedLink,
  contextualGuideLinks,
  localizeHref,
  onNativeShare,
  onCopyLink,
}: {
  story: StoryEntry;
  tags: readonly string[];
  isEs: boolean;
  whatsappShareHref: string;
  xShareHref: string;
  emailShareHref: string;
  canNativeShare: boolean;
  copiedLink: boolean;
  contextualGuideLinks: ReadonlyArray<{ href: string; label: string }>;
  localizeHref: (href: string) => string;
  onNativeShare: () => void;
  onCopyLink: () => void;
}) {
  return (
    <div className="grid gap-6 border-t border-[var(--color-rule)] pt-8 lg:grid-cols-12 lg:items-center lg:gap-[var(--gap-columns)]">
      <div className="flex flex-wrap items-center gap-2 lg:col-span-5 lg:pr-10">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-[var(--radius-pill)] border border-[var(--color-rule)] px-3 py-1 text-[length:var(--text-xs)] text-[var(--color-muted)]"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-5 lg:col-span-7">
        <div
          aria-label={isEs ? "Compartir esta historia" : "Share this Story"}
          className="flex flex-wrap items-center gap-2"
          role="group"
        >
          <span className="mr-1 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-muted)] uppercase">
            {isEs ? "Compartir" : "Share"}
          </span>

          <a
            aria-label={isEs ? "Compartir por WhatsApp" : "Share on WhatsApp"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-rule-2)]/60 text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
            href={whatsappShareHref}
            rel="noopener noreferrer"
            target="_blank"
            title="WhatsApp"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
            </svg>
          </a>

          <a
            aria-label={isEs ? "Compartir en X" : "Share on X"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-rule-2)]/60 text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
            href={xShareHref}
            rel="noopener noreferrer"
            target="_blank"
            title="X"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          <a
            aria-label={isEs ? "Compartir por correo" : "Share by email"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-rule-2)]/60 text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
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

          {canNativeShare ? (
            <button
              type="button"
              onClick={onNativeShare}
              aria-label={
                isEs
                  ? "Compartir en Instagram u otras apps"
                  : "Share to Instagram or other apps"
              }
              title={isEs ? "Instagram y otras apps" : "Instagram & other apps"}
              className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-rule-2)]/60 bg-transparent px-3.5 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-forest-deep)] uppercase transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
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
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" x2="12" y1="2" y2="15" />
              </svg>
              <span>{isEs ? "Apps" : "Share"}</span>
            </button>
          ) : null}

          <button
            type="button"
            onClick={onCopyLink}
            className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-rule-2)]/60 bg-transparent px-3.5 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-forest-deep)] uppercase transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
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

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          {contextualGuideLinks.map((guide) => (
            <Link
              key={guide.href}
              href={localizeHref(guide.href)}
              className="inline-flex min-h-[var(--tap-min)] items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
            >
              {guide.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 max-w-[60ch] lg:col-span-7 lg:col-start-6">
        <NewsletterForm
          variant="journal"
          source={`Story: ${story.slug}`}
          defaultTrack={getTrackForStory(story)}
        />
      </div>
    </div>
  );
}

export function StoryRelatedSection({
  orderedRelatedStories,
  language,
  isEs,
  localizeHref,
}: {
  orderedRelatedStories: readonly StorySummary[];
  language: StoryLanguage;
  isEs: boolean;
  localizeHref: (href: string) => string;
}) {
  if (orderedRelatedStories.length === 0) {
    return <SectionBridge from="paper" to="night" />;
  }

  return (
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
            <p className="text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-eyebrow)] text-[var(--color-clay-ink)] uppercase">
              {isEs ? "Seguir leyendo" : "Continue reading"}
            </p>
            <h2 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-display-s)] leading-[1.06] font-normal text-[var(--color-forest-deep)]">
              {isEs ? "Más historias" : "Up next"}
            </h2>
          </div>

          <Link
            href={localizeHref("/stories")}
            className="inline-flex min-h-[var(--tap-min)] items-center text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-forest-deep)] uppercase underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
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
                  aria-label={entryLocalized.title}
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
                  <p className="num text-[length:var(--text-xs)] font-medium tracking-[var(--tracking-label)] text-[var(--color-muted)] uppercase">
                    <time dateTime={entry.publishedAt}>
                      {formatStoryDate(entry.publishedAt, language)}
                    </time>
                    <span aria-hidden="true"> · </span>
                    <span className="text-[var(--color-clay-ink)]">
                      {entryLocalized.categoryLabel}
                    </span>
                  </p>

                  <h3 className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[1.18] font-normal">
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

      <SectionBridge from="dune" to="night" />
    </section>
  );
}
