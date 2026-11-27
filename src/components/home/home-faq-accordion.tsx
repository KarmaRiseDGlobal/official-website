"use client";

import { useState } from "react";

import type { SiteLanguage } from "@/lib/urls";

export interface FaqAccordionItem {
  readonly id: string;
  readonly question: Record<SiteLanguage, string>;
  readonly answer: Record<SiteLanguage, string>;
}

interface HomeFaqAccordionProps {
  items: readonly FaqAccordionItem[];
  language: SiteLanguage;
  idPrefix?: string;
}

export function HomeFaqAccordion({
  items,
  language,
  idPrefix = "home-faq",
}: HomeFaqAccordionProps) {
  const [openIds, setOpenIds] = useState<ReadonlySet<string>>(
    () => new Set(items[0] ? [items[0].id] : []),
  );

  function toggleItem(id: string) {
    setOpenIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="divide-y divide-[var(--color-rule)] border-y border-[var(--color-rule)]">
      {items.map((item) => {
        const isOpen = openIds.has(item.id);
        const triggerId = `${idPrefix}-trigger-${item.id}`;
        const panelId = `${idPrefix}-panel-${item.id}`;

        return (
          <article key={item.id} className="faq-accordion-item">
            <h3 className="m-0 max-w-none">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(item.id)}
                className="faq-accordion-trigger group flex min-h-[var(--control-height)] w-full cursor-pointer items-center justify-between gap-4 py-5 text-start font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-forest-deep)] transition-colors hover:text-[var(--color-clay-ink)] sm:gap-6 sm:py-6"
              >
                <span className="max-w-[38ch] min-w-0 text-balance break-words">
                  {item.question[language]}
                </span>
                <span
                  aria-hidden="true"
                  className="faq-accordion-icon inline-flex h-9 max-h-[44px] w-9 max-w-[44px] shrink-0 items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)] group-hover:border-[var(--color-clay-ink)] group-hover:bg-[var(--color-clay-ink)]"
                  data-open={isOpen}
                >
                  <svg
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" vectorEffect="non-scaling-stroke" />
                  </svg>
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className="faq-accordion-panel"
              data-open={isOpen}
              inert={!isOpen}
            >
              <div className="faq-accordion-body">
                <p className="max-w-[48ch] pb-6 text-[length:var(--text-md)] leading-[1.64] text-[var(--color-ink-2)] sm:pb-7">
                  {item.answer[language]}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
