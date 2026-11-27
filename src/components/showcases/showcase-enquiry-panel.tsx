"use client";

import Link from "next/link";
import {
  addTransitionType,
  startTransition,
  useState,
  ViewTransition,
  type RefObject,
  type ViewTransitionClassPerType,
} from "react";

import type { SiteLanguage } from "@/lib/urls";

type EnquiryCategorySlug =
  "bags" | "garments" | "textile-accessories" | "home-decor";

interface CategoryOption {
  readonly slug: EnquiryCategorySlug;
  readonly chipLabel: Record<SiteLanguage, string>;
  readonly ctaLabel: Record<SiteLanguage, string>;
}

const ENQUIRY_CATEGORIES: readonly CategoryOption[] = [
  {
    slug: "bags",
    chipLabel: {
      en: "Leather goods",
      es: "Bolsos y artículos de piel",
    },
    ctaLabel: {
      en: "Start leather goods brief",
      es: "Empezar briefing de piel",
    },
  },
  {
    slug: "garments",
    chipLabel: {
      en: "Clothing",
      es: "Ropa y prendas",
    },
    ctaLabel: {
      en: "Start clothing brief",
      es: "Empezar briefing de ropa",
    },
  },
  {
    slug: "textile-accessories",
    chipLabel: {
      en: "Textile accessories",
      es: "Complementos textiles",
    },
    ctaLabel: {
      en: "Start textile accessories brief",
      es: "Briefing de complementos",
    },
  },
  {
    slug: "home-decor",
    chipLabel: {
      en: "Textile home decor",
      es: "Decoración textil del hogar",
    },
    ctaLabel: {
      en: "Start textile decor brief",
      es: "Briefing de decoración textil",
    },
  },
];

const CHIP_SHARE = {
  "enquiry-category": "enquiry-chip-glide",
  default: "none",
} satisfies ViewTransitionClassPerType;

const CHIP_ENTER = {
  "enquiry-category": "enquiry-chip-in",
  default: "none",
} satisfies ViewTransitionClassPerType;

const CHIP_EXIT = {
  "enquiry-category": "enquiry-chip-out",
  default: "none",
} satisfies ViewTransitionClassPerType;

const CTA_UPDATE = {
  "enquiry-category": "enquiry-cta-morph",
  default: "none",
} satisfies ViewTransitionClassPerType;

interface ShowcaseEnquiryPanelProps {
  enquiryShellRef: RefObject<HTMLDivElement | null>;
  language: SiteLanguage;
  isEs: boolean;
  localizeHref: (href: string) => string;
  onFocusCapture?: () => void;
}

export function ShowcaseEnquiryPanel({
  enquiryShellRef,
  language,
  isEs,
  localizeHref,
  onFocusCapture,
}: ShowcaseEnquiryPanelProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<EnquiryCategorySlug | null>(null);

  const activeCategory = ENQUIRY_CATEGORIES.find(
    (item) => item.slug === selectedCategory,
  );
  const briefHref = activeCategory
    ? localizeHref(`/product-brief?product=${activeCategory.slug}`)
    : localizeHref("/product-brief");
  const callHref = activeCategory
    ? localizeHref(`/book-a-call?duration=15&product=${activeCategory.slug}`)
    : localizeHref("/book-a-call?duration=15");
  const primaryLabel = activeCategory
    ? activeCategory.ctaLabel[language]
    : isEs
      ? "Cuéntanos tu idea"
      : "Share your product idea";

  function handleCategoryToggle(slug: EnquiryCategorySlug) {
    startTransition(() => {
      addTransitionType("enquiry-category");
      setSelectedCategory((current) => (current === slug ? null : slug));
    });
  }

  return (
    <div
      className="horizontal-panel enquiry-panel"
      id="enquire"
      data-chat-avoid
      onFocusCapture={onFocusCapture}
    >
      <div className="enquiry-panel-shell container" ref={enquiryShellRef}>
        <div className="enquiry-panel-card" data-choreo="enquiry-fallback-card">
          <div className="enquiry-copy">
            <h2>
              {isEs
                ? "¿Con ganas de ver tu propia marca hacerse realidad?"
                : "Ready to see your own collection come to life?"}
            </h2>
            <p className="lead max-w-[44ch]">
              {isEs
                ? "Elige una categoría para contarnos tu idea o reserva una llamada tranquila con Alma."
                : "Pick a category to share your idea, or book a relaxed call with Alma."}
            </p>
            <div
              className="mt-1 flex flex-wrap gap-2.5"
              role="group"
              aria-label={
                isEs
                  ? "Seleccionar categoría de producto"
                  : "Select product category"
              }
            >
              {ENQUIRY_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.slug}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => handleCategoryToggle(cat.slug)}
                    className={`enquiry-category-chip press-scale relative inline-flex min-h-[var(--tap-min)] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border px-4 py-2 text-center text-[length:var(--text-xs)] font-semibold ${
                      isSelected
                        ? "border-transparent bg-transparent text-[var(--color-night)]"
                        : "border-[var(--color-paper)]/52 bg-[var(--color-paper)]/10 text-[var(--color-paper)] hover:border-[var(--color-gold)] hover:bg-[var(--color-paper)]/18"
                    }`}
                  >
                    <span className={isSelected ? "opacity-0" : undefined}>
                      {cat.chipLabel[language]}
                    </span>
                    {isSelected ? (
                      <ViewTransition
                        name="enquiry-chip-active"
                        share={CHIP_SHARE}
                        enter={CHIP_ENTER}
                        exit={CHIP_EXIT}
                        default="none"
                      >
                        <span
                          aria-hidden="true"
                          className="enquiry-chip-active-pill pointer-events-none absolute -inset-px inline-flex items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-gold)] bg-[var(--color-gold)] px-4 py-2 text-center text-[length:var(--text-xs)] font-semibold text-[var(--color-night)]"
                        >
                          {cat.chipLabel[language]}
                        </span>
                      </ViewTransition>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="enquiry-actions">
            <ViewTransition update={CTA_UPDATE} default="none">
              <Link className="primary-button" href={briefHref}>
                <span>{primaryLabel}</span>
              </Link>
            </ViewTransition>
            <Link className="enquiry-secondary-link" href={callHref}>
              {isEs ? "Reserva una llamada con Alma" : "Book a call with Alma"}
            </Link>
            <p className="m-0 max-w-[36ch] text-start text-[length:var(--text-xs)] leading-[1.55] tracking-[0.008em] text-[var(--color-paper-2)]/85 lg:text-end">
              {isEs
                ? "Se guarda mientras escribes. Tus diseños son confidenciales (NDA)."
                : "Saves as you go. Your designs stay confidential (NDA)."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
