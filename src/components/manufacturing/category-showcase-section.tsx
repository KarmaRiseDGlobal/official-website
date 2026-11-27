"use client";

import Link from "next/link";

import { CategoryShowcaseStage } from "@/components/manufacturing/category-showcase-stage";
import { MANUFACTURING_CATEGORIES } from "@/data/manufacturing-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

function ArrowIcon() {
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
      className="editorial-arrow-icon shrink-0"
    >
      <path d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5" />
    </svg>
  );
}

export function CategoryShowcaseSection({
  language,
}: {
  readonly language: SiteLanguage;
}) {
  const isEs = language === "es";
  const localizeHref = (href: string) => localizePath(href, language);

  return (
    <section
      className="cat-showcase bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
      id="product-categories"
    >
      <div className="container grid gap-[var(--space-2xl)]">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
          <div className="lg:col-span-6">
            <h2
              data-choreo="manufacturing-section-header"
              className="m-0 max-w-[18ch] text-[length:var(--text-section)] leading-[1.06] font-normal text-[var(--color-forest-deep)]"
            >
              {isEs
                ? "Cuatro categorías en los polos especialistas de la India"
                : "Four categories across India's specialist hubs"}
            </h2>
          </div>
          <div className="lg:col-span-6 lg:justify-self-end">
            <p className="m-0 max-w-[44ch] text-[length:var(--text-md)] leading-[1.64] text-[var(--color-ink-2)]">
              {isEs
                ? "Cada colección se plantea a medida. Explora las piezas que trabajamos en piel, ropa, complementos textiles y hogar."
                : "Every collection is scoped individually. Explore the silhouettes we make across leather, clothing, textile accessories, and home textiles."}
            </p>
          </div>
        </div>

        <div className="cat-chapters">
          {MANUFACTURING_CATEGORIES.map((category) => (
            <article
              key={category.id}
              id={`category-${category.id}`}
              data-cat-chapter
              className="cat-shelf-row"
            >
              <div className="cat-narrative">
                <div className="cat-narrative-head">
                  <h3 className="cat-chapter-title">
                    {category.name[language]}
                  </h3>
                  <p className="cat-chapter-summary">
                    {category.showcaseSummary[language]}
                  </p>
                </div>

                <dl className="m-0 grid gap-2 text-[length:var(--text-xs)] leading-[1.52]">
                  <div className="grid gap-0.5">
                    <dt className="font-semibold text-[var(--color-forest-deep)]">
                      {isEs ? "Materiales" : "Materials"}
                    </dt>
                    <dd className="m-0 max-w-[40ch] text-[var(--color-muted)]">
                      {category.tableMaterials[language]}
                    </dd>
                  </div>
                  <div className="grid gap-0.5">
                    <dt className="font-semibold text-[var(--color-forest-deep)]">
                      {isEs ? "Polos artesanos" : "Craft hubs"}
                    </dt>
                    <dd className="m-0 max-w-[40ch] text-[var(--color-muted)]">
                      {category.tableRegions[language]}
                    </dd>
                  </div>
                  <div className="grid gap-0.5">
                    <dt className="font-semibold text-[var(--color-forest-deep)]">
                      {isEs ? "Verificación" : "Verification"}
                    </dt>
                    <dd className="m-0 max-w-[40ch] text-[var(--color-muted)]">
                      {category.tableVerification[language]}
                    </dd>
                  </div>
                </dl>

                <Link
                  href={localizeHref(
                    `/product-brief?product=${category.querySlug}`,
                  )}
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                >
                  <span>{category.ctaLabel[language]}</span>
                  <ArrowIcon />
                </Link>
              </div>

              <CategoryShowcaseStage
                categoryId={category.id}
                categoryName={category.name[language]}
                items={category.items}
                language={language}
              />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
