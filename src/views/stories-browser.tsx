"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useMemo, useRef, useSyncExternalStore } from "react";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SectionBridge } from "@/components/shell/section-bridge";
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

  const filteredStories = useMemo(
    () =>
      activeCategory === "All Stories"
        ? stories
        : stories.filter((story) => story.category === activeCategory),
    [activeCategory, stories],
  );

  const heroStory = useMemo(
    () => stories.find((story) => story.featured) ?? stories[0],
    [stories],
  );
  const heroStoryLocalized = heroStory
    ? getLocalizedStory(heroStory, language)
    : null;

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
        window.history.replaceState(null, "", `${url.pathname}${url.search}`);
        window.dispatchEvent(new Event(CATEGORY_EVENT));
      }

      if (scrollToList) {
        listTopRef.current?.scrollIntoView({
          behavior: "smooth",
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
    target.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => {
      const emailInput = target.querySelector<HTMLInputElement>(
        'input[type="email"]',
      );
      emailInput?.focus({ preventScroll: true });
    }, 550);
  }, []);

  const rssHref = isEs ? "/es/stories/rss.xml" : "/stories/rss.xml";

  return (
    <div className="relative bg-[var(--color-paper)]">
      {/* 1. Semantic Breadcrumb + Light Editorial Hero */}
      <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-2xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
        <div className="container grid gap-[var(--space-xl)] lg:gap-[var(--space-2xl)]">
          {/* Top 1px Hairline Breadcrumb & Editorial Freshness Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[var(--color-rule)] py-3.5 text-[length:var(--text-xs)] font-semibold tracking-[0.08em] uppercase">
            <nav
              aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
              className="flex items-center gap-2"
            >
              <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                <li>
                  <Link
                    className="text-[var(--color-muted)] no-underline transition-colors hover:text-[var(--color-forest-deep)]"
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
                  className="text-[var(--color-clay-ink)]"
                >
                  {isEs ? "Historias" : "Stories"}
                </li>
              </ol>
            </nav>

            <span className="num text-[var(--color-muted)]">
              {isEs
                ? `${stories.length} historias${latestStoryDate ? ` · Última el ${formatStoryDate(latestStoryDate, "es")}` : ""}`
                : `${stories.length} Stories${latestStoryDate ? ` · Latest ${formatStoryDate(latestStoryDate, "en")}` : ""}`}
            </span>
          </div>

          <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[0.12em] text-[var(--color-clay-ink)] uppercase">
                {isEs ? "Por Alma y Shirish" : "By Alma and Shirish"}
              </p>
              <h1 className="m-0 max-w-[16ch] text-[clamp(2.35rem,5vw,4.75rem)] leading-[0.99] font-normal text-[var(--color-forest-deep)]">
                {isEs
                  ? "Historias desde puntos de producción en la India y nuestra vida en España."
                  : "Stories from production sites in India and our life in Spain."}
              </h1>
              <p className="lead m-0 max-w-[54ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Las escribimos nosotros mismos semana a semana entre ambos países. Visitamos marroquineros, fábricas de corte familiar, confeccionistas y unidades de producción especializadas en Calcuta, Kanpur, Agra y Chennai, coordinadas desde Maharashtra. También salimos a fotografiar prendas por las calles de Madrid. Unas veces seguimos una tintada, una muestra de color o el pulso de AlmaRise D Brand en AlmaRise D Reborn, AlmaRise D Organic y decoración del hogar. Otras nos quedamos en la cocina hablando de comida, historia y rutina diaria."
                  : "We write these ourselves across working weeks in Spain and India. Our visits take us to leather ateliers, family-run factories, garment makers, and specialist production units in Kolkata, Kanpur, Agra, and Chennai, coordinated from Maharashtra. We also take finished pieces onto the streets of Madrid for photo shoots. Some Stories follow a dye batch, a physical colour swatch, or AlmaRise D Brand across AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor. Others stay at the kitchen table with food, history, and daily habits across both countries."}
              </p>

              <div className="flex flex-wrap items-center gap-5 pt-1">
                <a className="primary-button" href="#stories-list">
                  {isEs
                    ? `Ver las ${stories.length} historias`
                    : `Browse all ${stories.length} Stories`}
                </a>
                <button
                  type="button"
                  onClick={scrollToNewsletterAndFocus}
                  className="inline-flex min-h-[44px] cursor-pointer items-center border-0 bg-transparent p-0 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                >
                  {isEs
                    ? "Envíame la próxima carta"
                    : "Send me the next letter"}
                </button>
              </div>
            </div>

            {heroStory && heroStoryLocalized?.leadImage?.url ? (
              <div className="lg:col-span-5">
                <article className="group overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] shadow-[var(--shadow-card)]">
                  <Link
                    href={localizeHref(`/stories/${heroStory.slug}`)}
                    data-transition-title={heroStoryLocalized.title}
                    className="block no-underline"
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden">
                      <Image
                        src={heroStoryLocalized.leadImage.url}
                        alt={
                          heroStoryLocalized.leadImage.alt ||
                          heroStoryLocalized.title
                        }
                        fill
                        priority
                        sizes="(max-width: 64rem) 100vw, 42vw"
                        style={
                          heroStoryLocalized.leadImage.objectPosition
                            ? {
                                objectPosition:
                                  heroStoryLocalized.leadImage.objectPosition,
                              }
                            : undefined
                        }
                        className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                      />
                    </div>
                    <div className="grid gap-2 px-5 py-4">
                      <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)]">
                        <span className="font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
                          {isEs ? "Empieza por aquí" : "Start here"} ·{" "}
                          {heroStoryLocalized.categoryLabel}
                        </span>
                        <span className="num text-[var(--color-muted)]">
                          {isEs
                            ? `${heroStory.readingTimeMinutes} min de lectura`
                            : `${heroStory.readingTimeMinutes} min read`}
                        </span>
                      </div>
                      <p className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-lg)] leading-[1.2] font-normal text-[var(--color-forest-deep)] transition-colors group-hover:text-[var(--color-clay-ink)]">
                        {heroStoryLocalized.title}
                      </p>
                      <p className="m-0 line-clamp-2 text-[length:var(--text-xs)] leading-[1.55] text-[var(--color-muted)]">
                        {heroStoryLocalized.summary}
                      </p>
                      <p className="m-0 pt-1 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors group-hover:text-[var(--color-clay-ink)]">
                        {isEs
                          ? `Leer la historia de ${heroStory.author.name.replace(/\s*&\s*/g, " y ")} →`
                          : `Read ${heroStory.author.name.replace(/\s*&\s*/g, " and ")}'s Story →`}
                      </p>
                    </div>
                  </Link>
                </article>
              </div>
            ) : null}
          </div>

          {/* Category Filter Pills (44px touch targets, URL query synced, canonical stays /stories) */}
          <div
            role="group"
            aria-label={
              isEs
                ? "Filtrar historias por categoría"
                : "Filter Stories by category"
            }
            className="flex flex-wrap items-center gap-2 border-t border-[var(--color-rule)] pt-6"
          >
            {storyCategories.map((category) => {
              const isSelected = activeCategory === category;
              const count =
                category === "All Stories"
                  ? stories.length
                  : stories.filter((item) => item.category === category).length;
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
                  className={`inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 text-[length:var(--text-sm)] font-semibold transition-colors ${
                    isSelected
                      ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                      : "border-[var(--color-rule)] bg-[var(--color-paper-2)]/65 text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:text-[var(--color-clay-ink)]"
                  }`}
                >
                  <span>{label}</span>
                  <span
                    className={`num text-[length:var(--text-xs)] ${
                      isSelected
                        ? "text-[var(--color-gold)]"
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
      </section>

      {/* Organic Watercolor Wave Divider into Deep Forest Green */}
      <div className="stories-wave-divider" aria-hidden="true">
        <svg
          viewBox="0 0 1440 140"
          preserveAspectRatio="none"
          className="block h-20 w-full sm:h-28"
        >
          <path
            d="M0,84 C240,132 420,24 720,66 C1020,108 1220,30 1440,74 L1440,140 L0,140 Z"
            fill="var(--color-pale-sage)"
          />
          <path
            d="M0,104 C310,56 580,136 910,86 C1140,52 1310,100 1440,84 L1440,140 L0,140 Z"
            fill="var(--color-sage)"
            fillOpacity="0.45"
          />
          <path
            d="M0,122 C360,92 720,138 1080,108 C1260,92 1360,114 1440,104 L1440,140 L0,140 Z"
            fill="var(--color-forest-deep)"
          />
        </svg>
      </div>

      {/* 2. Single Canonical Scannable Stories Archive Grid */}
      <section
        id="stories-list"
        ref={listTopRef}
        aria-labelledby="stories-archive-heading"
        className="scroll-mt-24 bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]"
      >
        <div className="container grid gap-[var(--space-2xl)]">
          <div className="grid items-end gap-5 border-b border-[var(--color-paper)]/15 pb-6 lg:grid-cols-12">
            <div className="grid gap-2 lg:col-span-6">
              <h2
                id="stories-archive-heading"
                className="m-0 text-[length:var(--text-display-s)] leading-[1.06] font-normal text-[var(--color-paper)]"
              >
                {activeCategory === "All Stories"
                  ? isEs
                    ? `Las ${stories.length} historias`
                    : `All ${stories.length} Stories`
                  : activeCategoryLocalized?.title}
              </h2>
              <p
                aria-live="polite"
                className={
                  activeCategoryLocalized
                    ? "m-0 text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-gold)] uppercase"
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
                <p className="m-0 max-w-[48ch] text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-paper-2)] lg:text-right">
                  {activeCategoryLocalized.description}
                </p>
              ) : (
                <p className="m-0 max-w-[48ch] text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-paper-2)] lg:text-right">
                  {isEs
                    ? "Cada relato nace de nuestras semanas reales de trabajo. Aquí encuentras descartes de piel, diez días buscando cartón reciclado sin blanquear, libre de químicos, para etiquetas y tres platos de biryani en Eid."
                    : "Every Story comes straight out of our real working weeks. You will find rejected hides, a ten-day search for unbleached chemical-free recycled hangtag cardboard, and three plates of biryani on Eid."}
                </p>
              )}

              {activeCategory !== "All Stories" ? (
                <button
                  type="button"
                  onClick={() => updateCategory("All Stories", false)}
                  className="inline-flex min-h-[44px] cursor-pointer items-center rounded-full border border-[var(--color-paper)]/30 bg-transparent px-4 text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-gold)] uppercase transition-colors hover:border-[var(--color-gold)] hover:bg-[var(--color-gold)] hover:text-[var(--color-night)]"
                >
                  {isEs
                    ? `Ver las ${stories.length} historias`
                    : `Show all ${stories.length} Stories`}
                </button>
              ) : null}
            </div>
          </div>

          {activeCategory === "All Stories" ? (
            <p className="m-0 max-w-[70ch] text-[length:var(--text-sm)] leading-[1.68] text-[var(--color-paper-2)]/90">
              {isEs
                ? "Firmamos nosotros mismos cada relato que lees aquí, unas veces como Alma y otras como Shirish. Sin redactores externos ni frases de catálogo. Contamos lo que ha pasado de verdad, incluso cuando toca corregir el rumbo. Puede ser apartar una piel demasiado rígida en Uttar Pradesh, medir la caída del asa en una tienda española, comprobar pieles de curtido vegetal en Calcuta o sentarnos a compartir biryani casero en Eid."
                : "One of us signs every piece you read here, either Alma or Shirish. No ghostwriters and no hired agency copy. We write down what actually happened during the week, even when something had to be redone. That might mean rejecting stiff leather in Uttar Pradesh, testing strap drop inside a Spanish shop, checking vegetable-tanned hides in Kolkata, or sharing home-cooked biryani on Eid."}
            </p>
          ) : null}

          {filteredStories.length === 0 ? (
            <div className="grid justify-items-start gap-4 rounded-[var(--radius-card)] border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/5 p-8 text-[var(--color-paper)]">
              <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-paper)]">
                {isEs
                  ? "Todavía no hay historias publicadas en esta categoría."
                  : "No Stories published in this category yet."}
              </h3>
              <p className="m-0 max-w-[58ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-paper-2)]">
                {isEs
                  ? `Solo escribimos cuando tenemos trabajo real, una muestra terminada o una escena sobre el terreno que merezca la pena compartir. Recorre las ${stories.length} historias publicadas o apúntate a la carta quincenal para recibir las próximas en cuanto salgan.`
                  : `We only publish when we have real work, a finished sample, or a scene from the ground worth sharing. Browse all ${stories.length} published Stories below, or join our biweekly letter to read new pieces as we write them.`}
              </p>
              <button
                type="button"
                onClick={() => updateCategory("All Stories", false)}
                className="primary-button"
              >
                {isEs
                  ? `Ver las ${stories.length} historias`
                  : `Show all ${stories.length} Stories`}
              </button>
            </div>
          ) : (
            <div
              key={activeCategory}
              className="stories-category-grid grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
            >
              {filteredStories.map((story) => {
                const localized = getLocalizedStory(story, language);
                const storyHref = localizeHref(`/stories/${story.slug}`);
                const authorHref = localizeHref(
                  getAuthorHref(story.author.name),
                );

                return (
                  <article
                    key={story.slug}
                    className="group flex flex-col justify-between gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-5 text-[var(--color-forest-deep)] shadow-[var(--shadow-card)] transition-transform duration-300 hover:-translate-y-0.5"
                  >
                    <div className="grid gap-4">
                      <Link
                        href={storyHref}
                        data-transition-title={localized.title}
                        aria-label={localized.title}
                        className="block"
                      >
                        <StoryMedia
                          image={localized.leadImage}
                          kind={story.leadSlot.kind}
                          ratio={story.leadSlot.ratio}
                          aspectClass="aspect-[16/10]"
                          title={story.leadSlot.title}
                          description={story.leadSlot.description}
                          sizes="(max-width: 48rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                          interactive
                        />
                      </Link>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)] font-semibold tracking-[0.04em] uppercase">
                        <span className="text-[var(--color-clay-ink)]">
                          {localized.categoryLabel}
                        </span>
                        <span className="num shrink-0 text-[var(--color-muted)]">
                          {localized.location} ·{" "}
                          {isEs
                            ? `${story.readingTimeMinutes} min de lectura`
                            : `${story.readingTimeMinutes} min read`}
                        </span>
                      </div>

                      <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.18] font-normal">
                        <Link
                          href={storyHref}
                          data-transition-title={localized.title}
                          className="text-[var(--color-forest-deep)] no-underline transition-colors group-hover:text-[var(--color-clay-ink)]"
                        >
                          {localized.title}
                        </Link>
                      </h3>

                      <p className="m-0 text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-ink-2)]">
                        {localized.summary}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-rule)] pt-3.5 text-[length:var(--text-xs)]">
                      <div className="flex flex-wrap items-center gap-1.5 text-[var(--color-muted)]">
                        <Link
                          href={authorHref}
                          className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                        >
                          {isEs
                            ? `Por ${story.author.name.replace(/\s*&\s*/g, " y ")}`
                            : `By ${story.author.name.replace(/\s*&\s*/g, " and ")}`}
                        </Link>
                        <span aria-hidden="true">·</span>
                        <time dateTime={story.publishedAt}>
                          {formatStoryDate(story.publishedAt, language)}
                        </time>
                      </div>

                      <Link
                        href={storyHref}
                        data-transition-title={localized.title}
                        aria-label={
                          isEs
                            ? `Leer historia: ${localized.title}`
                            : `Read Story: ${localized.title}`
                        }
                        className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                      >
                        {isEs ? "Leer" : "Read"} →
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. Single Bilingual Newsletter Section */}
      <section
        id="stories-newsletter"
        ref={newsletterRef}
        aria-labelledby="stories-newsletter-heading"
        className="bg-[var(--color-forest-deep)] py-[var(--section-gap-s)] text-[var(--color-paper)]"
      >
        <div className="container grid items-start gap-[var(--gap-columns)] border-t border-[var(--color-paper)]/15 pt-[var(--space-2xl)] lg:grid-cols-12">
          <div className="grid gap-4 lg:col-span-5">
            <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[0.1em] text-[var(--color-gold)] uppercase">
              {isEs ? "Por correo" : "By email"}
            </p>
            <h2
              id="stories-newsletter-heading"
              className="m-0 max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal text-[var(--color-paper)]"
            >
              {isEs
                ? "Una carta desde la India y España, cada dos semanas."
                : "A letter from India and Spain, every two weeks."}
            </h2>
            <p className="m-0 max-w-[48ch] text-[var(--color-paper-2)]">
              {isEs
                ? "Nos turnamos entre Alma y Shirish para escribir cada entrega desde el lugar donde estemos esa semana. Una quincena te acercamos la fabricación en planta: lotes de tinte, muestras de color y controles en puntos de producción auditados. La siguiente recorre AlmaRise D Brand en AlmaRise D Reborn, AlmaRise D Organic y decoración del hogar, junto a sobremesas entre España y la India y avances honestos de nuestra futura Iniciativa de formación para mujeres. Dale a responder y tu correo entra directo en nuestra bandeja."
                : "We take turns writing each issue from wherever we are working that week, signed by Alma or Shirish. One fortnight covers on-site manufacturing in India: dye batches, physical colour swatches, and quality checks across audited production sites. The next follows AlmaRise D Brand across AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor, along with shared meals between Spain and India and honest progress on our planned Women's Training Initiative. Hit reply and your message goes straight to our inbox."}
            </p>

            <ul className="m-0 grid list-none gap-3 border-t border-[var(--color-paper)]/15 p-0 pt-4 text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-paper-2)]">
              <li>
                <strong className="font-semibold text-[var(--color-gold)]">
                  {isEs
                    ? "Fabricación en la India."
                    : "Manufacturing in India."}
                </strong>{" "}
                {isEs
                  ? "Auditorías presenciales en Calcuta, Kanpur, Agra, Chennai y Maharashtra, revisión de muestras para valoración antes de comenzar con el corte de las piezas, pruebas de textura y aprendizajes de pedidos reales para Europa."
                  : "In-person audits across Kolkata, Kanpur, Agra, Chennai, and Maharashtra, sample reviews before cutting starts, leather and textile hand-feel checks, and lessons from real European Bulk Orders."}
              </li>
              <li>
                <strong className="font-semibold text-[var(--color-gold)]">
                  {isEs
                    ? "AlmaRise D Brand y vida cotidiana."
                    : "AlmaRise D Brand and everyday life."}
                </strong>{" "}
                {isEs
                  ? "Saris guardados transformados en prendas de uso diario para AlmaRise D Reborn, ensayos con fibras vegetales para AlmaRise D Organic, piezas de decoración del hogar en pruebas, recetas y sobremesas de nuestras dos casas y novedades de la futura formación para mujeres."
                  : "Kept sarees recut into everyday garments for AlmaRise D Reborn, plant and fruit-waste fabric trials for AlmaRise D Organic, AlmaRise D Home Decor pieces in progress, food and hospitality between Spain and India, and updates on our planned Women's Training Initiative."}
              </li>
            </ul>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-[length:var(--text-sm)]">
              <Link
                className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-gold)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
                href={localizeHref("/contact")}
              >
                {isEs
                  ? "Escribe a Alma y Shirish"
                  : "Write to Alma and Shirish"}
              </Link>
              <a
                className="inline-flex min-h-[44px] items-center font-medium text-[var(--color-paper-2)] underline decoration-[var(--color-paper)]/35 underline-offset-4 hover:text-[var(--color-paper)]"
                href={rssHref}
              >
                {isEs ? "Canal RSS" : "RSS feed"}
              </a>
            </div>
            <p className="m-0 max-w-[48ch] text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-paper-2)]/80">
              {isEs ? (
                <>
                  ¿Prefieres seguirnos desde un lector RSS? Añade{" "}
                  <a
                    className="text-[var(--color-paper)] underline decoration-[var(--color-paper)]/40 underline-offset-4 hover:text-[var(--color-gold)]"
                    href="/es/stories/rss.xml"
                  >
                    /es/stories/rss.xml
                  </a>{" "}
                  para recibir cada publicación en español, o cambia a English
                  si prefieres{" "}
                  <a
                    className="text-[var(--color-paper)] underline decoration-[var(--color-paper)]/40 underline-offset-4 hover:text-[var(--color-gold)]"
                    href="/stories/rss.xml"
                  >
                    /stories/rss.xml
                  </a>
                  .
                </>
              ) : (
                <>
                  Prefer a feed reader over email? Follow every new Story
                  automatically at{" "}
                  <a
                    className="text-[var(--color-paper)] underline decoration-[var(--color-paper)]/40 underline-offset-4 hover:text-[var(--color-gold)]"
                    href="/stories/rss.xml"
                  >
                    /stories/rss.xml
                  </a>
                  , or switch to Español for{" "}
                  <a
                    className="text-[var(--color-paper)] underline decoration-[var(--color-paper)]/40 underline-offset-4 hover:text-[var(--color-gold)]"
                    href="/es/stories/rss.xml"
                  >
                    /es/stories/rss.xml
                  </a>
                  .
                </>
              )}
            </p>
          </div>

          <div className="lg:col-span-7">
            <NewsletterForm
              variant="journal"
              source="Stories Page"
              defaultTrack="choose"
            />
          </div>
        </div>
      </section>

      {/* 4. Quiet Bridge to the Rest of KarmaRise */}
      <section
        aria-labelledby="stories-explore-heading"
        className="bg-[var(--color-forest-deep)] py-[var(--section-gap-s)] text-[var(--color-paper)]"
      >
        <div className="container grid gap-[var(--space-xl)] border-t border-[var(--color-paper)]/15 pt-[var(--space-2xl)] lg:grid-cols-12 lg:items-end">
          <div className="grid gap-4 lg:col-span-7">
            <h2
              id="stories-explore-heading"
              className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal text-[var(--color-paper)]"
            >
              {isEs
                ? "Cuando te apetezca ver qué hay detrás de las historias"
                : "Whenever you want to look past the Stories"}
            </h2>
            <p className="m-0 max-w-[54ch] text-[var(--color-paper-2)]">
              {isEs ? (
                <>
                  Si ya te ronda una idea para tu comercio o marca en España o
                  en el resto de Europa, desarrollamos y producimos en la India
                  bolsos de piel y otros artículos de piel, prendas de diversos
                  tejidos, complementos confeccionados a medida y decoración del
                  hogar. Lee{" "}
                  <Link
                    href={localizeHref("/how-we-work")}
                    className="text-[var(--color-paper)] underline decoration-[var(--color-paper)]/45 underline-offset-4 hover:text-[var(--color-gold)]"
                  >
                    cómo trabajamos
                  </Link>{" "}
                  a pie de obra con unidades de producción auditadas o reserva
                  una videollamada breve con Alma para comentarlo sin
                  compromiso.
                </>
              ) : (
                <>
                  If an idea is taking shape for your shop or brand in Spain or
                  the rest of Europe, we develop and produce leather bags and
                  other leather goods, clothing in natural and varied fabrics,
                  custom sewn accessories, and home decor across India. Read{" "}
                  <Link
                    href={localizeHref("/how-we-work")}
                    className="text-[var(--color-paper)] underline decoration-[var(--color-paper)]/45 underline-offset-4 hover:text-[var(--color-gold)]"
                  >
                    how we work
                  </Link>{" "}
                  on the ground with audited production units, or book a short
                  video call with Alma to talk it through.
                </>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-[length:var(--text-sm)] font-semibold">
              <Link
                href={localizeHref("/manufacturing")}
                className="inline-flex min-h-[44px] items-center text-[var(--color-gold)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
              >
                {isEs ? "Programa de producción" : "Manufacturing Programme"}
              </Link>
              <Link
                href={localizeHref("/almarise")}
                className="inline-flex min-h-[44px] items-center text-[var(--color-paper)] underline decoration-[var(--color-paper)]/40 underline-offset-4 hover:text-[var(--color-gold)]"
              >
                AlmaRise D Brand
              </Link>
              <Link
                href={localizeHref("/product-brief")}
                className="inline-flex min-h-[44px] items-center text-[var(--color-paper)] underline decoration-[var(--color-paper)]/40 underline-offset-4 hover:text-[var(--color-gold)]"
              >
                {isEs ? "Empieza tu briefing" : "Start a Product Brief"}
              </Link>
            </div>
          </div>

          <div className="grid justify-items-start gap-2.5 lg:col-span-5 lg:justify-items-end">
            <Link
              className="primary-button"
              href={localizeHref("/book-a-call?duration=15")}
            >
              {isEs
                ? "Reserva una llamada con Alma (15 min)"
                : "Book a free 15-min call with Alma"}
            </Link>
            <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-paper-2)] lg:text-right">
              {isEs
                ? "No hace falta ficha técnica. Acuerdos mutuos NDA disponibles. Escríbenos cuando te venga bien."
                : "No tech pack needed. Mutual NDA available. Write whenever the timing fits."}
            </p>
          </div>
        </div>
      </section>

      <SectionBridge from="forest-deep" to="night" />
    </div>
  );
}
