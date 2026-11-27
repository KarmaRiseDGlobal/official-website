"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SectionBridge } from "@/components/shell/section-bridge";
import { StoriesScrollChoreography } from "@/components/stories/stories-scroll-choreography";
import { StoryMedia } from "@/components/stories/story-media";
import { useLanguage } from "@/context/language-context";
import {
  formatStoryDate,
  getCategoryBySlug,
  getCategoryDetail,
  getLocalizedCategory,
  getLocalizedStory,
  storyCategories,
  type StoryCategory,
  type StorySummary,
} from "@/data/story-types";

interface StoriesBrowserProps {
  stories: StorySummary[];
  lang?: "en" | "es";
}

type StoryCardArchetype =
  | "lead-horizontal"
  | "wide-landscape"
  | "tall-portrait"
  | "square-editorial"
  | "open-landscape"
  | "panoramic-forest"
  | "slim-vertical";

type StoryCardSurface = "alabaster" | "dune" | "forest";

interface StoryCardLayoutPreset {
  readonly archetype: StoryCardArchetype;
  readonly surface: StoryCardSurface;
  readonly colSpanClass: string;
  readonly aspectClass: string;
  readonly sizes: string;
  readonly titleClass: string;
  readonly summaryClass: string;
  readonly defaultObjectPosition?: string;
}

const PAIRED_CARD_PRESETS: readonly StoryCardLayoutPreset[] = [
  {
    archetype: "wide-landscape",
    surface: "dune",
    colSpanClass: "md:col-span-7 lg:col-span-7",
    aspectClass: "aspect-[16/10]",
    sizes: "(max-width: 48rem) 100vw, 58vw",
    titleClass: "text-[length:var(--text-xl)] leading-[1.16]",
    summaryClass: "text-[length:var(--text-md)] leading-[1.62]",
  },
  {
    archetype: "tall-portrait",
    surface: "alabaster",
    colSpanClass: "md:col-span-5 lg:col-span-5",
    aspectClass: "aspect-[5/6]",
    sizes: "(max-width: 48rem) 100vw, 40vw",
    titleClass: "text-[length:var(--text-title)] leading-[1.18]",
    summaryClass: "text-[length:var(--text-sm)] leading-[1.62]",
    defaultObjectPosition: "62% 36%",
  },
  {
    archetype: "square-editorial",
    surface: "alabaster",
    colSpanClass: "md:col-span-5 lg:col-span-5",
    aspectClass: "aspect-[1/1]",
    sizes: "(max-width: 48rem) 100vw, 40vw",
    titleClass: "text-[length:var(--text-title)] leading-[1.18]",
    summaryClass: "text-[length:var(--text-sm)] leading-[1.62]",
    defaultObjectPosition: "62% 35%",
  },
  {
    archetype: "open-landscape",
    surface: "dune",
    colSpanClass: "md:col-span-7 lg:col-span-7",
    aspectClass: "aspect-[3/2]",
    sizes: "(max-width: 48rem) 100vw, 58vw",
    titleClass: "text-[length:var(--text-xl)] leading-[1.16]",
    summaryClass: "text-[length:var(--text-md)] leading-[1.62]",
    defaultObjectPosition: "60% 40%",
  },
  {
    archetype: "panoramic-forest",
    surface: "forest",
    colSpanClass: "md:col-span-7 lg:col-span-8",
    aspectClass: "aspect-[16/9]",
    sizes: "(max-width: 48rem) 100vw, 66vw",
    titleClass: "text-[length:var(--text-xl)] leading-[1.16]",
    summaryClass: "text-[length:var(--text-md)] leading-[1.62]",
    defaultObjectPosition: "50% 52%",
  },
  {
    archetype: "slim-vertical",
    surface: "alabaster",
    colSpanClass: "md:col-span-5 lg:col-span-4",
    aspectClass: "aspect-[4/5] lg:aspect-[3/4]",
    sizes: "(max-width: 48rem) 100vw, 33vw",
    titleClass: "text-[length:var(--text-title)] leading-[1.18]",
    summaryClass: "text-[length:var(--text-sm)] leading-[1.62]",
    defaultObjectPosition: "50% 50%",
  },
];

const LEAD_HORIZONTAL_PRESET: StoryCardLayoutPreset = {
  archetype: "lead-horizontal",
  surface: "alabaster",
  colSpanClass: "md:col-span-12 lg:col-span-12",
  aspectClass: "aspect-[16/10]",
  sizes: "(max-width: 64rem) 100vw, 56vw",
  titleClass: "text-[length:var(--text-2xl)] leading-[1.14]",
  summaryClass: "text-[length:var(--text-md)] leading-[1.62]",
};

/**
 * Assigns an asymmetric editorial magazine layout across any number of stories
 * so every row sums cleanly to 12 columns with varied widths, image ratios, and
 * surface tones, leaving zero uniform 3-up grids and zero orphan holes.
 */
function getStoryCardLayoutPreset(
  index: number,
  totalCount: number,
): StoryCardLayoutPreset {
  const hasOddLeadSpread = totalCount % 2 === 1;
  if (hasOddLeadSpread && index === 0) {
    return LEAD_HORIZONTAL_PRESET;
  }

  const pairIndex = hasOddLeadSpread ? index - 1 : index;
  return (
    PAIRED_CARD_PRESETS[pairIndex % PAIRED_CARD_PRESETS.length] ??
    PAIRED_CARD_PRESETS[0]!
  );
}

interface CardSurfaceTheme {
  readonly cardClass: string;
  readonly categoryClass: string;
  readonly metaClass: string;
  readonly titleLinkClass: string;
  readonly summaryClass: string;
  readonly footerRuleClass: string;
  readonly authorWrapClass: string;
  readonly authorLinkClass: string;
  readonly readCueClass: string;
  readonly isDark: boolean;
}

function getCardSurfaceTheme(surface: StoryCardSurface): CardSurfaceTheme {
  switch (surface) {
    case "forest":
      return {
        cardClass:
          "border border-[var(--color-paper)]/12 bg-[var(--color-forest-deep)] text-[var(--color-paper)]",
        categoryClass: "text-[var(--color-clay-light)]",
        metaClass: "text-[var(--color-paper-2)]",
        titleLinkClass:
          "text-[var(--color-paper)] no-underline transition-colors after:absolute after:inset-0 after:z-0 after:rounded-[var(--radius-card)] after:content-[''] group-hover:text-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-4",
        summaryClass: "text-[var(--color-paper-2)]",
        footerRuleClass: "",
        authorWrapClass: "text-[var(--color-paper-2)]",
        authorLinkClass:
          "relative z-10 inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-paper)] underline decoration-[var(--color-paper)]/45 underline-offset-4 transition-colors hover:text-[var(--color-gold)]",
        readCueClass:
          "inline-flex min-h-[var(--tap-min)] items-center gap-2 font-semibold text-[var(--color-gold)] underline decoration-[var(--color-clay-light)] underline-offset-4 transition-colors group-hover:text-[var(--color-paper)]",
        isDark: true,
      };
    case "dune":
      return {
        cardClass: "bg-[var(--color-paper-2)] text-[var(--color-forest-deep)]",
        categoryClass: "text-[var(--color-clay-ink)]",
        metaClass: "text-[var(--color-muted)]",
        titleLinkClass:
          "text-[var(--color-forest-deep)] no-underline transition-colors after:absolute after:inset-0 after:z-0 after:rounded-[var(--radius-card)] after:content-[''] group-hover:text-[var(--color-clay-ink)] focus-visible:outline-2 focus-visible:outline-offset-4",
        summaryClass: "text-[var(--color-ink-2)]",
        footerRuleClass: "",
        authorWrapClass: "text-[var(--color-muted)]",
        authorLinkClass:
          "relative z-10 inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]",
        readCueClass:
          "inline-flex min-h-[var(--tap-min)] items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors group-hover:text-[var(--color-clay-ink)]",
        isDark: false,
      };
    case "alabaster":
      return {
        cardClass:
          "border border-[var(--color-rule)] bg-[var(--color-white)] text-[var(--color-forest-deep)]",
        categoryClass: "text-[var(--color-clay-ink)]",
        metaClass: "text-[var(--color-muted)]",
        titleLinkClass:
          "text-[var(--color-forest-deep)] no-underline transition-colors after:absolute after:inset-0 after:z-0 after:rounded-[var(--radius-card)] after:content-[''] group-hover:text-[var(--color-clay-ink)] focus-visible:outline-2 focus-visible:outline-offset-4",
        summaryClass: "text-[var(--color-ink-2)]",
        footerRuleClass: "",
        authorWrapClass: "text-[var(--color-muted)]",
        authorLinkClass:
          "relative z-10 inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]",
        readCueClass:
          "inline-flex min-h-[var(--tap-min)] items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors group-hover:text-[var(--color-clay-ink)]",
        isDark: false,
      };
    default: {
      const _exhaustive: never = surface;
      return _exhaustive;
    }
  }
}

function ArrowIcon({ cardCue = false }: { cardCue?: boolean }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={
        cardCue
          ? "editorial-arrow-icon shrink-0 motion-safe:transition-transform motion-safe:duration-[180ms] motion-safe:ease-[var(--ease-out)] motion-safe:group-hover:translate-x-[3px] rtl:motion-safe:group-hover:-translate-x-[3px]"
          : "editorial-arrow-icon shrink-0"
      }
    >
      <path d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5" />
    </svg>
  );
}

function SelectedCheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M3.2 8.4 6.5 11.6 12.8 4.8" />
    </svg>
  );
}

function getAuthorHref(authorName: string): string {
  if (/alma.*shirish|shirish.*alma/i.test(authorName)) {
    return "/about";
  }
  if (/shirish/i.test(authorName)) {
    return "/about#shirish";
  }
  if (/alma/i.test(authorName)) {
    return "/about#alma";
  }
  return "/about";
}

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const CATEGORY_EVENT = "karmarise:stories-category-change";

function subscribeCategoryUrl(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener("popstate", onStoreChange);
  window.addEventListener(CATEGORY_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("popstate", onStoreChange);
    window.removeEventListener(CATEGORY_EVENT, onStoreChange);
  };
}

function getCategorySlugSnapshot(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  return new URLSearchParams(window.location.search).get("category");
}

function getCategorySlugServerSnapshot(): string | null {
  return null;
}

export function StoriesBrowser({ stories, lang }: StoriesBrowserProps) {
  const { language: contextLanguage, localizeHref } = useLanguage();
  const language = lang ?? contextLanguage;
  const isEs = language === "es";

  const categorySlugFromUrl = useSyncExternalStore(
    subscribeCategoryUrl,
    getCategorySlugSnapshot,
    getCategorySlugServerSnapshot,
  );
  const activeCategory: "All Stories" | StoryCategory =
    getCategoryBySlug(categorySlugFromUrl) ?? "All Stories";

  const listTopRef = useRef<HTMLElement>(null);
  const newsletterRef = useRef<HTMLElement>(null);
  const focusCleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      focusCleanupRef.current?.();
      focusCleanupRef.current = null;
    };
  }, []);

  const filteredStories = useMemo(
    () =>
      activeCategory === "All Stories"
        ? stories
        : stories.filter((story) => story.category === activeCategory),
    [activeCategory, stories],
  );

  const latestStoryDate = useMemo(() => {
    return stories.reduce<string>((latest, entry) => {
      const candidate = entry.updatedAt || entry.publishedAt || "";
      return candidate > latest ? candidate : latest;
    }, stories[0]?.publishedAt || "");
  }, [stories]);

  const activeCategoryLocalized =
    activeCategory === "All Stories"
      ? null
      : getLocalizedCategory(activeCategory, language);

  const updateCategory = useCallback(
    (category: "All Stories" | StoryCategory, scrollToList: boolean) => {
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        if (category === "All Stories") {
          url.searchParams.delete("category");
        } else {
          url.searchParams.set("category", getCategoryDetail(category).slug);
        }
        const nextRelativeUrl = `${url.pathname}${url.search}`;
        const currentRelativeUrl = `${window.location.pathname}${window.location.search}`;
        if (nextRelativeUrl !== currentRelativeUrl) {
          window.history.pushState(null, "", nextRelativeUrl);
          window.dispatchEvent(new Event(CATEGORY_EVENT));
        }
      }

      if (scrollToList) {
        listTopRef.current?.scrollIntoView({
          behavior: prefersReducedMotion() ? "auto" : "smooth",
          block: "start",
        });
      }
    },
    [],
  );

  const scrollToNewsletterAndFocus = useCallback(() => {
    const target = newsletterRef.current;
    if (!target) {
      return;
    }

    focusCleanupRef.current?.();
    focusCleanupRef.current = null;

    const reduced = prefersReducedMotion();
    target.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });

    let finished = false;
    const focusEmailInput = () => {
      if (finished) {
        return;
      }
      finished = true;
      focusCleanupRef.current?.();
      focusCleanupRef.current = null;
      const emailInput = target.querySelector<HTMLInputElement>(
        'input[type="email"]',
      );
      emailInput?.focus({ preventScroll: true });
    };

    if (reduced) {
      const rafId = window.requestAnimationFrame(focusEmailInput);
      focusCleanupRef.current = () => {
        window.cancelAnimationFrame(rafId);
      };
      return;
    }

    const onScrollEnd = () => {
      focusEmailInput();
    };
    window.addEventListener("scrollend", onScrollEnd, { once: true });
    const fallbackTimer = window.setTimeout(focusEmailInput, 650);
    focusCleanupRef.current = () => {
      window.removeEventListener("scrollend", onScrollEnd);
      window.clearTimeout(fallbackTimer);
    };
  }, []);

  const rssHref = isEs ? "/es/stories/rss.xml" : "/stories/rss.xml";

  return (
    <div className="relative bg-[var(--color-paper)]">
      <StoriesScrollChoreography />

      {/* 1. Full-Bleed Botanical Forest Editorial Hero Banner */}
      <section
        className="hero stories-hero"
        id="top"
        data-surface="dark"
        data-chat-avoid
      >
        <div className="hero-wrapper" data-hero-wrapper>
          <div className="hero-content container" data-hero-content>
            <h1 data-hero-title>
              <span className="hero-headline-line" data-hero-line>
                {isEs ? "Historias desde la India" : "Stories from India"}
              </span>{" "}
              <span className="hero-headline-line" data-hero-line>
                {isEs ? "y la vida en España." : "and our life in Spain."}
              </span>
            </h1>
            <div className="hero-sub" data-hero-sub>
              <p className="hero-lead">
                {isEs
                  ? "Escritas por Alma y Shirish entre la India y España, entre pieles y muestras de AlmaRise D Brand, sobremesas, historia y vida cotidiana."
                  : "Written by Alma and Shirish between India and Spain, from leather hides and AlmaRise D Brand samples to shared tables and local history."}
              </p>
              <div className="hero-actions">
                <a className="hero-primary" href="#stories-list">
                  {isEs ? "Ver todas las historias" : "Browse all Stories"}
                </a>
                <button
                  type="button"
                  onClick={scrollToNewsletterAndFocus}
                  className="hero-secondary-cta press-scale inline-flex min-h-[var(--control-height)] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-paper)]/55 bg-[var(--color-night)]/40 px-6 py-3 text-center text-[length:var(--text-md)] font-semibold text-[var(--color-paper)] no-underline backdrop-blur-sm transition-colors hover:border-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-night)]"
                >
                  {isEs
                    ? "Envíame la próxima carta"
                    : "Send me the next letter"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Breadcrumb, Category Filters, and Varied-Scale Editorial Stories Archive */}
      <section
        id="stories-list"
        ref={listTopRef}
        aria-labelledby="stories-archive-heading"
        className="scroll-mt-24 bg-[var(--color-paper)] pt-[var(--space-md)] pb-[var(--section-gap)] text-[var(--color-forest-deep)]"
      >
        <div className="container grid gap-[var(--space-xl)] lg:gap-[var(--space-2xl)]">
          {/* Breadcrumb & Latest Date Mark */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-1 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] uppercase">
            <nav
              aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
              className="flex items-center"
            >
              <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                <li>
                  <Link
                    className="inline-flex min-h-[var(--tap-min)] min-w-[var(--tap-min)] items-center text-[var(--color-muted)] no-underline transition-colors hover:text-[var(--color-forest-deep)]"
                    href={localizeHref("/")}
                  >
                    {isEs ? "Inicio" : "Home"}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-[var(--color-muted)]">
                  /
                </li>
                <li
                  aria-current="page"
                  className="inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-clay-ink)]"
                >
                  {isEs ? "Historias" : "Stories"}
                </li>
              </ol>
            </nav>

            {latestStoryDate ? (
              <span className="num text-[var(--color-muted)]">
                {isEs
                  ? `Última el ${formatStoryDate(latestStoryDate, "es")}`
                  : `Latest ${formatStoryDate(latestStoryDate, "en")}`}
              </span>
            ) : null}
          </div>

          {/* Archive Heading + Editorial Context + Category Filter Chips */}
          <div className="grid gap-[var(--space-lg)]">
            <div className="grid items-end gap-5 lg:grid-cols-12">
              <div className="grid gap-2 lg:col-span-6">
                <h2
                  id="stories-archive-heading"
                  data-choreo="stories-section-header"
                  className="m-0 text-[length:var(--text-section)] leading-[1.06] font-normal tracking-[var(--tracking-display)] text-[var(--color-forest-deep)]"
                >
                  {activeCategory === "All Stories"
                    ? isEs
                      ? "Todas las historias"
                      : "All Stories"
                    : activeCategoryLocalized?.title}
                </h2>
                <p
                  aria-live="polite"
                  className={
                    activeCategoryLocalized
                      ? "m-0 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-clay-ink)] uppercase"
                      : "sr-only"
                  }
                >
                  {activeCategoryLocalized
                    ? isEs
                      ? filteredStories.length === 1
                        ? `Mostrando 1 historia en ${activeCategoryLocalized.title}.`
                        : `Mostrando ${filteredStories.length} historias en ${activeCategoryLocalized.title}.`
                      : filteredStories.length === 1
                        ? `Showing 1 Story in ${activeCategoryLocalized.title}.`
                        : `Showing ${filteredStories.length} Stories in ${activeCategoryLocalized.title}.`
                    : isEs
                      ? `Mostrando las ${stories.length} historias.`
                      : `Showing all ${stories.length} Stories.`}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 lg:col-span-6 lg:justify-end">
                {activeCategoryLocalized ? (
                  <p className="m-0 max-w-[48ch] text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-muted)] lg:text-end">
                    {activeCategoryLocalized.description}
                  </p>
                ) : (
                  <p className="m-0 max-w-[48ch] text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-muted)] lg:text-end">
                    {isEs
                      ? "Firmadas por Alma o Shirish, sin redactores externos. Pieles descartadas, diez días buscando cartón reciclado y tres platos de biryani en Eid."
                      : "Signed by Alma or Shirish, with no ghostwriters. Rejected hides, ten days hunting for the right recycled cardboard, and three plates of biryani on Eid."}
                  </p>
                )}

                {activeCategory !== "All Stories" ? (
                  <button
                    type="button"
                    onClick={() => updateCategory("All Stories", false)}
                    className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center rounded-[var(--radius-pill)] border border-[var(--color-forest-deep)] bg-transparent px-4 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-forest-deep)] uppercase transition-colors hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                  >
                    {isEs ? "Ver todas las historias" : "Show all Stories"}
                  </button>
                ) : null}
              </div>
            </div>

            {/* Category Filter Chips (44px touch targets, DESIGN.md chip tokens, WCAG 1.4.11 & 1.4.1) */}
            <div
              role="group"
              aria-label={
                isEs
                  ? "Filtrar historias por categoría"
                  : "Filter Stories by category"
              }
              className="flex flex-wrap items-center gap-2 pt-1"
            >
              {storyCategories.map((category) => {
                const isSelected = activeCategory === category;
                const count =
                  category === "All Stories"
                    ? stories.length
                    : stories.filter((item) => item.category === category)
                        .length;
                const label =
                  category === "All Stories"
                    ? isEs
                      ? "Todas las historias"
                      : "All Stories"
                    : getLocalizedCategory(category, language).title;
                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => updateCategory(category, false)}
                    className={`inline-flex min-h-[var(--tap-min)] cursor-pointer items-center gap-1.5 rounded-[var(--radius-pill)] border px-3.5 py-2 text-[length:var(--text-xs)] font-semibold tracking-[0.03em] transition-colors ${
                      isSelected
                        ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)] forced-colors:border-2"
                        : "border-[var(--color-rule-2)] bg-[var(--color-paper-2)] text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:text-[var(--color-clay-ink)]"
                    }`}
                  >
                    {isSelected ? <SelectedCheckIcon /> : null}
                    <span>{label}</span>
                    <span
                      className={`num ${
                        isSelected
                          ? "text-[var(--color-paper-2)]"
                          : "text-[var(--color-muted)]"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {filteredStories.length === 0 ? (
            <div className="grid justify-items-start gap-4 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] p-8 text-[var(--color-forest-deep)]">
              <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-forest-deep)]">
                {isEs
                  ? "Todavía no hay historias publicadas en esta categoría."
                  : "No Stories published in this category yet."}
              </h3>
              <p className="m-0 max-w-[58ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-ink-2)]">
                {isEs
                  ? "Solo escribimos cuando tenemos trabajo real, una muestra terminada o una escena sobre el terreno que merezca la pena compartir. Recorre todas las historias publicadas o apúntate a la carta quincenal para recibir las próximas en cuanto salgan."
                  : "We only publish when we have real work, a finished sample, or a scene from the ground worth sharing. Browse all published Stories below, or join our biweekly letter to read new pieces as we write them."}
              </p>
              <button
                type="button"
                onClick={() => updateCategory("All Stories", false)}
                className="primary-button-light"
              >
                {isEs ? "Ver todas las historias" : "Show all Stories"}
              </button>
            </div>
          ) : (
            <div
              key={activeCategory}
              className="stories-category-grid grid grid-cols-1 items-start gap-[var(--gap-columns)] md:grid-cols-12"
            >
              {filteredStories.map((story, index) => {
                const localized = getLocalizedStory(story, language);
                const storyHref = localizeHref(`/stories/${story.slug}`);
                const authorHref = localizeHref(
                  getAuthorHref(story.author.name),
                );
                const preset = getStoryCardLayoutPreset(
                  index,
                  filteredStories.length,
                );
                const theme = getCardSurfaceTheme(preset.surface);
                const cardImage = localized.leadImage
                  ? {
                      ...localized.leadImage,
                      objectPosition:
                        localized.leadImage.objectPosition ??
                        preset.defaultObjectPosition,
                    }
                  : undefined;

                if (preset.archetype === "lead-horizontal") {
                  const showFeaturedCue =
                    activeCategory === "All Stories" && story.featured;

                  return (
                    <article
                      key={story.slug}
                      className={`group relative grid min-w-0 gap-6 rounded-[var(--radius-card)] p-5 sm:p-6 lg:grid-cols-12 lg:items-center lg:gap-[var(--gap-columns)] lg:p-7 ${preset.colSpanClass} ${theme.cardClass}`}
                    >
                      <div aria-hidden="true" className="block lg:col-span-7">
                        <StoryMedia
                          image={cardImage}
                          kind={story.leadSlot.kind}
                          ratio={story.leadSlot.ratio}
                          aspectClass={preset.aspectClass}
                          title={story.leadSlot.title}
                          sizes={preset.sizes}
                          dark={theme.isDark}
                          interactive
                        />
                      </div>

                      <div className="grid min-w-0 content-between gap-4 lg:col-span-5">
                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] uppercase">
                          <span className={theme.categoryClass}>
                            {showFeaturedCue
                              ? `${isEs ? "Empieza por aquí" : "Start here"} · ${localized.categoryLabel}`
                              : localized.categoryLabel}
                          </span>
                          <span className={`num min-w-0 ${theme.metaClass}`}>
                            {localized.location} ·{" "}
                            {isEs
                              ? `${story.readingTimeMinutes} min de lectura`
                              : `${story.readingTimeMinutes} min read`}
                          </span>
                        </div>

                        <h3
                          className={`m-0 font-[family-name:var(--font-display)] font-normal tracking-[var(--tracking-display)] ${preset.titleClass}`}
                        >
                          <Link
                            href={storyHref}
                            data-transition-title={localized.title}
                            className={theme.titleLinkClass}
                          >
                            {localized.title}
                          </Link>
                        </h3>

                        <p
                          className={`m-0 max-w-[50ch] ${preset.summaryClass} ${theme.summaryClass}`}
                        >
                          {localized.summary}
                        </p>

                        <div
                          className={`flex flex-wrap items-center justify-between gap-3 pt-2 text-[length:var(--text-xs)] ${theme.footerRuleClass}`}
                        >
                          <div
                            className={`flex flex-wrap items-center gap-x-2 ${theme.authorWrapClass}`}
                          >
                            <Link
                              href={authorHref}
                              className={theme.authorLinkClass}
                            >
                              {isEs
                                ? `Por ${story.author.name.replace(/\s*&\s*/g, " y ")}`
                                : `By ${story.author.name.replace(/\s*&\s*/g, " and ")}`}
                            </Link>
                            <span aria-hidden="true">·</span>
                            <time className="num" dateTime={story.publishedAt}>
                              {formatStoryDate(story.publishedAt, language)}
                            </time>
                          </div>

                          <span
                            aria-hidden="true"
                            className={`${theme.readCueClass} text-[length:var(--text-sm)]`}
                          >
                            <span>{isEs ? "Leer" : "Read"}</span>
                            <ArrowIcon cardCue />
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                }

                return (
                  <article
                    key={story.slug}
                    data-surface={theme.isDark ? "dark" : undefined}
                    className={`group relative flex min-w-0 flex-col justify-between gap-5 rounded-[var(--radius-card)] p-5 sm:p-6 ${preset.colSpanClass} ${theme.cardClass}`}
                  >
                    <div className="grid min-w-0 gap-4">
                      <div aria-hidden="true" className="block">
                        <StoryMedia
                          image={cardImage}
                          kind={story.leadSlot.kind}
                          ratio={story.leadSlot.ratio}
                          aspectClass={preset.aspectClass}
                          title={story.leadSlot.title}
                          sizes={preset.sizes}
                          dark={theme.isDark}
                          interactive
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] uppercase">
                        <span className={theme.categoryClass}>
                          {localized.categoryLabel}
                        </span>
                        <span className={`num min-w-0 ${theme.metaClass}`}>
                          {localized.location} ·{" "}
                          {isEs
                            ? `${story.readingTimeMinutes} min de lectura`
                            : `${story.readingTimeMinutes} min read`}
                        </span>
                      </div>

                      <h3
                        className={`m-0 font-[family-name:var(--font-display)] font-normal tracking-[var(--tracking-display)] ${preset.titleClass}`}
                      >
                        <Link
                          href={storyHref}
                          data-transition-title={localized.title}
                          className={theme.titleLinkClass}
                        >
                          {localized.title}
                        </Link>
                      </h3>

                      <p
                        className={`m-0 max-w-[60ch] ${preset.summaryClass} ${theme.summaryClass}`}
                      >
                        {localized.summary}
                      </p>
                    </div>

                    <div
                      className={`flex flex-wrap items-center justify-between gap-2 pt-2 text-[length:var(--text-xs)] ${theme.footerRuleClass}`}
                    >
                      <div
                        className={`flex flex-wrap items-center gap-x-2 ${theme.authorWrapClass}`}
                      >
                        <Link
                          href={authorHref}
                          className={theme.authorLinkClass}
                        >
                          {isEs
                            ? `Por ${story.author.name.replace(/\s*&\s*/g, " y ")}`
                            : `By ${story.author.name.replace(/\s*&\s*/g, " and ")}`}
                        </Link>
                        <span aria-hidden="true">·</span>
                        <time className="num" dateTime={story.publishedAt}>
                          {formatStoryDate(story.publishedAt, language)}
                        </time>
                      </div>

                      <span aria-hidden="true" className={theme.readCueClass}>
                        <span>{isEs ? "Leer" : "Read"}</span>
                        <ArrowIcon cardCue />
                      </span>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <SectionBridge from="paper" to="dune" />

      {/* 3. Single Bilingual Newsletter Section (Sunlit Warm Dune Tonal Shift) */}
      <section
        id="stories-newsletter"
        ref={newsletterRef}
        aria-labelledby="stories-newsletter-heading"
        data-chat-avoid
        className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
      >
        <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
          <div className="grid gap-4 lg:col-span-5">
            <h2
              id="stories-newsletter-heading"
              data-choreo="stories-section-header"
              className="m-0 max-w-[16ch] text-[length:var(--text-section)] leading-[1.06] font-normal tracking-[var(--tracking-display)] text-[var(--color-forest-deep)]"
            >
              {isEs
                ? "Una carta desde la India y España, cada dos semanas."
                : "A letter from India and Spain, every two weeks."}
            </h2>
            <p className="m-0 max-w-[46ch] text-[var(--color-ink-2)]">
              {isEs
                ? "Nos turnamos entre Alma y Shirish para escribir cada entrega desde donde estemos esa semana, alternando fabricación en la India, AlmaRise D Brand y sobremesas entre ambos países. Si respondes, tu mensaje llega directo a nuestra bandeja."
                : "We take turns writing each issue from wherever we are that week, alternating between craft and manufacturing in India, AlmaRise D Brand, and shared tables between both countries. Hit reply and your message comes straight to our inbox."}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-[length:var(--text-sm)]">
              <Link
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/contact")}
              >
                <span>
                  {isEs
                    ? "Escribe a Alma y Shirish"
                    : "Write to Alma and Shirish"}
                </span>
                <ArrowIcon />
              </Link>
              <a
                className="inline-flex min-h-[var(--tap-min)] items-center font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                href={rssHref}
              >
                {isEs ? "Canal RSS" : "RSS feed"}
              </a>
            </div>
          </div>

          <div data-choreo="stories-reveal" className="lg:col-span-7">
            <NewsletterForm
              variant="journal"
              source="Stories Page"
              defaultTrack="choose"
            />
          </div>
        </div>
      </section>

      <SectionBridge from="dune" to="forest-deep" size="gentle" />

      {/* 4. Quiet Bridge to the Rest of KarmaRise */}
      <section
        aria-labelledby="stories-explore-heading"
        data-surface="dark"
        data-chat-avoid
        className="bg-[var(--color-forest-deep)] py-[var(--section-gap-s)] text-[var(--color-paper)]"
      >
        <div className="container grid gap-[var(--space-xl)] lg:grid-cols-12 lg:items-end">
          <div className="grid gap-4 lg:col-span-7">
            <h2
              id="stories-explore-heading"
              data-choreo="stories-section-header"
              className="m-0 max-w-[20ch] text-[length:var(--text-section)] leading-[1.06] font-normal tracking-[var(--tracking-display)] text-[var(--color-paper)]"
            >
              {isEs
                ? "Cuando te apetezca ver qué hay detrás de las historias"
                : "Whenever you want to look past the Stories"}
            </h2>
            <p className="m-0 max-w-[52ch] text-[var(--color-paper-2)]">
              {isEs ? (
                <>
                  Si te ronda crear tu propia línea en la India, lee{" "}
                  <Link
                    href={localizeHref("/how-we-work")}
                    className="text-[var(--color-paper)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-gold)]"
                  >
                    cómo trabajamos
                  </Link>{" "}
                  sobre el terreno o reserva una llamada breve con Alma cuando
                  te venga bien.
                </>
              ) : (
                <>
                  If an idea is taking shape for your own line in India, read{" "}
                  <Link
                    href={localizeHref("/how-we-work")}
                    className="text-[var(--color-paper)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-gold)]"
                  >
                    how we work
                  </Link>{" "}
                  on the ground or book a short call with Alma whenever the
                  timing fits.
                </>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-[length:var(--text-sm)] font-semibold">
              <Link
                href={localizeHref("/manufacturing")}
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 text-[var(--color-gold)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
              >
                <span>{isEs ? "Fabricación" : "Manufacturing"}</span>
                <ArrowIcon />
              </Link>
              <Link
                href={localizeHref("/almarise")}
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 text-[var(--color-paper)] underline decoration-[var(--color-paper)]/40 underline-offset-4 hover:text-[var(--color-gold)]"
              >
                <span>AlmaRise D Brand</span>
                <ArrowIcon />
              </Link>
              <Link
                href={localizeHref("/product-brief")}
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 text-[var(--color-paper)] underline decoration-[var(--color-paper)]/40 underline-offset-4 hover:text-[var(--color-gold)]"
              >
                <span>
                  {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
                </span>
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <div
            data-choreo="stories-reveal"
            className="grid justify-items-start gap-2.5 lg:col-span-5 lg:justify-items-end"
          >
            <Link
              className="primary-button"
              href={localizeHref("/book-a-call?duration=15")}
            >
              {isEs
                ? "Reserva una llamada gratis con Alma"
                : "Book a free call with Alma"}
            </Link>
            <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-paper-2)] lg:text-end">
              {isEs
                ? "15 minutos, sin ficha técnica previa. Escríbenos cuando te venga bien."
                : "15 minutes, no tech pack needed. Write whenever the timing fits."}
            </p>
          </div>
        </div>
      </section>

      <SectionBridge from="forest-deep" to="night" />
    </div>
  );
}
