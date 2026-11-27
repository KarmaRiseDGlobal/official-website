"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

import { requestSmoothScrollTo } from "@/components/motion/smooth-scroll";
import type { ResponsibilityRow } from "@/data/how-we-work-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";
import { useTextZoomGuard } from "@/lib/use-text-zoom-guard";

interface ResponsibilityStagesProps {
  readonly rows: readonly ResponsibilityRow[];
  readonly language: SiteLanguage;
}

function StepArrowIcon({ direction }: { direction: "prev" | "next" }) {
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
      {direction === "next" ? (
        <path d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5" />
      ) : (
        <path d="M12.5 8h-9m0 0L7 4.5M3.5 8 7 11.5" />
      )}
    </svg>
  );
}

export function ResponsibilityStages({
  rows,
  language,
}: ResponsibilityStagesProps) {
  const isEs = language === "es";
  const localizeHref = (href: string) => localizePath(href, language);
  const baseId = useId();
  const isTextZoomed = useTextZoomGuard();

  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Array<HTMLDivElement | null>>([]);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const activeIndexRef = useRef(0);
  const isScrollPinnedRef = useRef(false);
  const hasInteractedRef = useRef(false);
  const ignoreScrollSyncRef = useRef(false);
  const ignoreScrollTimerRef = useRef<number | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isScrollPinned, setIsScrollPinned] = useState(false);
  const [isVerticalTabs, setIsVerticalTabs] = useState(false);
  const [overflowBlockedKey, setOverflowBlockedKey] = useState<string | null>(
    null,
  );
  const [viewportKey, setViewportKey] = useState("");
  const isOverflowBlocked =
    overflowBlockedKey !== null && overflowBlockedKey === viewportKey;

  const total = rows.length;

  useEffect(() => {
    const syncViewport = () => {
      setViewportKey(`${window.innerWidth}x${window.innerHeight}`);
      setIsVerticalTabs(window.matchMedia("(min-width: 64rem)").matches);
    };
    syncViewport();
    window.addEventListener("resize", syncViewport, { passive: true });
    return () => window.removeEventListener("resize", syncViewport);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const pin = pinRef.current;
    if (!section || !pin || total <= 1) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    // Allow scroll-through pinning on desktop & iPad landscape (>= 64rem and >= 35rem tall)
    // ONLY when neither text zoom nor live viewport height overflow is active.
    // iPad portrait, iPhone, ultra-short screens, reduced motion, and zoomed views stay cleanly unpinned.
    media.add(
      {
        canScrollPin: "(min-width: 64rem) and (min-height: 35rem)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { canScrollPin, reducedMotion } = context.conditions ?? {};

        if (
          !canScrollPin ||
          reducedMotion ||
          isTextZoomed ||
          isOverflowBlocked
        ) {
          isScrollPinnedRef.current = false;
          triggerRef.current = null;
          setIsScrollPinned(false);
          return;
        }

        const checkPinOverflow = () => {
          const pinRect = pin.getBoundingClientRect();
          if (
            pin.scrollHeight >
            Math.max(window.innerHeight, pinRect.height) + 28
          ) {
            setOverflowBlockedKey(`${window.innerWidth}x${window.innerHeight}`);
            return true;
          }
          return false;
        };

        if (checkPinOverflow()) {
          isScrollPinnedRef.current = false;
          triggerRef.current = null;
          setIsScrollPinned(false);
          return;
        }

        isScrollPinnedRef.current = true;
        setIsScrollPinned(true);

        const syncStageFromProgress = (progress: number) => {
          if (ignoreScrollSyncRef.current) {
            return;
          }
          const nextIdx = Math.min(
            total - 1,
            Math.max(0, Math.floor(progress * total)),
          );
          if (nextIdx !== activeIndexRef.current) {
            activeIndexRef.current = nextIdx;
            setActiveIndex(nextIdx);
          }
        };

        const trigger = ScrollTrigger.create({
          trigger: pin,
          pin,
          pinSpacing: true,
          anticipatePin: 1,
          start: "top top",
          end: () => `+=${Math.round(Math.max(window.innerHeight * 3, 2100))}`,
          invalidateOnRefresh: true,
          onRefresh: () => {
            checkPinOverflow();
          },
          onEnter: () => syncStageFromProgress(0),
          onEnterBack: () => syncStageFromProgress(0.999),
          onUpdate: (self) => syncStageFromProgress(self.progress),
        });

        triggerRef.current = trigger;

        const rafId = window.requestAnimationFrame(() => {
          if (!checkPinOverflow()) {
            ScrollTrigger.refresh();
          }
        });
        let cancelled = false;
        if (document.fonts?.ready) {
          void document.fonts.ready.then(() => {
            if (!cancelled && !checkPinOverflow()) {
              ScrollTrigger.refresh();
            }
          });
        }

        return () => {
          cancelled = true;
          window.cancelAnimationFrame(rafId);
          trigger.kill();
          triggerRef.current = null;
          isScrollPinnedRef.current = false;
          setIsScrollPinned(false);
        };
      },
    );

    return () => {
      if (ignoreScrollTimerRef.current !== null) {
        window.clearTimeout(ignoreScrollTimerRef.current);
        ignoreScrollTimerRef.current = null;
      }
      ignoreScrollSyncRef.current = false;
      media.revert();
      triggerRef.current = null;
      isScrollPinnedRef.current = false;
    };
  }, [isOverflowBlocked, isTextZoomed, total]);

  // Clear any residual inline GSAP opacity/transform whenever pinned mode changes
  // so Tailwind visibility/opacity classes always remain authoritative.
  useEffect(() => {
    for (const panel of panelRefs.current) {
      if (panel) {
        gsap.set(panel, { clearProps: "transform,opacity" });
      }
    }
  }, [isScrollPinned]);

  // Smooth GPU-accelerated panel entrance on user tap/click for iPad portrait, iPhone, and unpinned views
  useEffect(() => {
    if (isScrollPinned || !hasInteractedRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const panel = panelRefs.current[activeIndex];
    if (!panel) return;
    const tween = gsap.fromTo(
      panel,
      { opacity: 0.72, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.24,
        ease: "power2.out",
        clearProps: "transform,opacity",
      },
    );
    return () => {
      tween.kill();
      gsap.set(panel, { clearProps: "transform,opacity" });
    };
  }, [activeIndex, isScrollPinned]);

  if (total === 0) {
    return null;
  }

  function selectStage(index: number, focusTab = false) {
    hasInteractedRef.current = true;
    const clamped = Math.max(0, Math.min(total - 1, index));
    const st = triggerRef.current;
    if (st && isScrollPinnedRef.current) {
      const targetProgress = (clamped + 0.5) / total;
      const targetTop = st.start + (st.end - st.start) * targetProgress;
      ignoreScrollSyncRef.current = true;
      if (ignoreScrollTimerRef.current !== null) {
        window.clearTimeout(ignoreScrollTimerRef.current);
      }
      ignoreScrollTimerRef.current = window.setTimeout(() => {
        ignoreScrollSyncRef.current = false;
        ignoreScrollTimerRef.current = null;
      }, 560);
      requestSmoothScrollTo({ top: targetTop, duration: 0.45 });
    }
    activeIndexRef.current = clamped;
    setActiveIndex(clamped);
    if (focusTab) {
      tabRefs.current[clamped]?.focus();
    }
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowRight":
        event.preventDefault();
        selectStage((index + 1) % total, true);
        break;
      case "ArrowUp":
      case "ArrowLeft":
        event.preventDefault();
        selectStage((index - 1 + total) % total, true);
        break;
      case "Home":
        event.preventDefault();
        selectStage(0, true);
        break;
      case "End":
        event.preventDefault();
        selectStage(total - 1, true);
        break;
      default:
        break;
    }
  }

  return (
    <section
      ref={sectionRef}
      id="responsibility-matrix"
      data-chat-avoid
      data-scroll-pinned={isScrollPinned ? "true" : "false"}
      className="bg-[var(--color-paper)] text-[var(--color-forest-deep)]"
    >
      <div
        ref={pinRef}
        className="grid pt-[var(--section-gap)] pb-[var(--space-lg)] lg:min-h-[100svh] lg:content-center lg:pt-[calc(var(--nav-height)+var(--space-sm))] lg:pb-[var(--space-lg)] [@media(max-height:46rem)]:lg:pt-[calc(var(--nav-height)+0.35rem)] [@media(max-height:46rem)]:lg:pb-3"
      >
        <div className="container grid gap-[var(--space-lg)] lg:gap-[clamp(1rem,2vh,1.85rem)] [@media(max-height:46rem)]:lg:gap-3.5">
          <div className="grid gap-3 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
            <div className="lg:col-span-7">
              <h2
                data-choreo="how-we-work-section-header"
                className="m-0 max-w-[24ch] text-[length:var(--text-section)] leading-[1.06] font-normal tracking-[var(--tracking-display)] text-[var(--color-forest-deep)]"
              >
                {isEs
                  ? "Tú llevas tu negocio y tu marca. Nosotros seguimos tu pedido sobre el terreno en la India."
                  : "You run your shop and your brand. We run production on the ground in India."}
              </h2>
            </div>
            <p className="m-0 max-w-[46ch] text-[length:var(--text-md)] leading-[1.58] text-[var(--color-muted)] lg:col-span-5">
              {isEs
                ? "Cada fase, de la primera llamada a la entrega, con tu parte en Europa y lo que llevamos sobre el terreno en la India."
                : "Every stage from first call to delivery, showing how you, Alma, Shirish, and the makers move each piece forward together."}
            </p>
          </div>

          <div className="grid items-start gap-[var(--space-lg)] lg:grid-cols-12 lg:gap-[var(--gap-columns)]">
            {/* Left stage rail (desktop/iPad landscape) / wrapping pill selector (iPad portrait & phones) */}
            <div
              role="tablist"
              aria-orientation={isVerticalTabs ? "vertical" : "horizontal"}
              aria-label={
                isEs
                  ? "Fases del programa de fabricación"
                  : "Manufacturing Programme stages"
              }
              className="flex flex-wrap gap-2 lg:col-span-4 lg:grid lg:gap-1"
            >
              {rows.map((row, index) => {
                const selected = index === activeIndex;
                const tabId = `${baseId}-tab-${row.id}`;
                const panelId = `${baseId}-panel-${row.id}`;
                return (
                  <button
                    key={row.id}
                    ref={(el) => {
                      tabRefs.current[index] = el;
                    }}
                    id={tabId}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls={panelId}
                    tabIndex={selected ? 0 : -1}
                    onClick={() => selectStage(index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                    className={`press-scale inline-flex min-h-[var(--tap-min)] cursor-pointer items-center rounded-[var(--radius-pill)] px-4 py-2 text-start text-[length:var(--text-sm)] leading-snug transition-colors lg:w-full lg:rounded-[var(--radius-input)] lg:px-4 lg:py-2.5 ${
                      selected
                        ? "bg-[var(--color-forest-deep)] font-semibold text-[var(--color-paper)]"
                        : "bg-[var(--color-paper-2)]/70 font-medium text-[var(--color-forest-deep)] hover:bg-[var(--color-dune)] lg:bg-transparent lg:text-[var(--color-muted)] lg:hover:bg-[var(--color-paper-2)] lg:hover:text-[var(--color-forest-deep)]"
                    }`}
                  >
                    {row.stage[language]}
                  </button>
                );
              })}
            </div>

            {/* Right unified, borderless, single-plane stage view */}
            <div className="grid rounded-[var(--radius-card)] bg-[var(--color-dune)]/65 lg:col-span-8">
              {rows.map((row, index) => {
                const selected = index === activeIndex;
                const prevRow = index > 0 ? rows[index - 1] : null;
                const nextRow = index < total - 1 ? rows[index + 1] : null;
                const tabId = `${baseId}-tab-${row.id}`;
                const panelId = `${baseId}-panel-${row.id}`;

                return (
                  <div
                    key={row.id}
                    ref={(el) => {
                      panelRefs.current[index] = el;
                    }}
                    id={panelId}
                    role="tabpanel"
                    aria-labelledby={tabId}
                    aria-hidden={!selected || undefined}
                    hidden={!isScrollPinned && !selected}
                    inert={isScrollPinned && !selected ? true : undefined}
                    className={`grid gap-6 p-6 sm:p-8 lg:gap-7 lg:p-9 [@media(max-height:46rem)]:lg:gap-4 [@media(max-height:46rem)]:lg:p-6 ${
                      isScrollPinned
                        ? `col-start-1 row-start-1 transition-[opacity,transform,visibility] duration-200 ease-[var(--ease-out)] ${
                            selected
                              ? "pointer-events-auto visible translate-y-0 opacity-100"
                              : "pointer-events-none invisible translate-y-2 opacity-0 select-none"
                          }`
                        : ""
                    }`}
                  >
                    <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.15] font-normal tracking-[var(--tracking-display)] text-[var(--color-forest-deep)]">
                      {row.stage[language]}
                    </h3>

                    {/* All four partners side by side on one unified warm surface */}
                    <dl className="m-0 grid gap-x-8 gap-y-6 sm:grid-cols-2">
                      <div className="grid content-start gap-1.5">
                        <dt className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-ink)]">
                            {isEs ? "Tú" : "You"}
                          </span>
                          <span className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                            {isEs
                              ? "España y resto de Europa"
                              : "Spain & rest of Europe"}
                          </span>
                        </dt>
                        <dd className="m-0 max-w-[34ch] text-[length:var(--text-md)] leading-[1.58] font-medium text-[var(--color-forest-deep)]">
                          {row.client[language]}
                        </dd>
                      </div>

                      <div className="grid content-start gap-1.5">
                        <dt className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
                            Alma
                          </span>
                          <span className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                            {isEs ? "España y la India" : "Spain & India"}
                          </span>
                        </dt>
                        <dd className="m-0 max-w-[34ch] text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-ink-2)]">
                          {row.alma[language]}
                        </dd>
                      </div>

                      <div className="grid content-start gap-1.5">
                        <dt className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
                            Shirish
                          </span>
                          <span className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                            {isEs ? "En toda la India" : "Across India"}
                          </span>
                        </dt>
                        <dd className="m-0 max-w-[34ch] text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-ink-2)]">
                          {row.shirish[language]}
                        </dd>
                      </div>

                      <div className="grid content-start gap-1.5">
                        <dt className="flex flex-wrap items-baseline gap-x-2">
                          <span className="text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
                            {isEs ? "Artesanos y fábrica" : "The makers"}
                          </span>
                          <span className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                            {isEs ? "India" : "India"}
                          </span>
                        </dt>
                        <dd className="m-0 max-w-[34ch] text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-ink-2)]">
                          {row.workshop[language]}
                        </dd>
                      </div>
                    </dl>

                    {/* Linear step navigation */}
                    <div className="flex flex-wrap items-center justify-between gap-4 text-[length:var(--text-sm)]">
                      {prevRow ? (
                        <button
                          type="button"
                          tabIndex={selected ? 0 : -1}
                          onClick={() => selectStage(index - 1)}
                          className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-medium text-[var(--color-muted)] transition-colors hover:text-[var(--color-forest-deep)]"
                        >
                          <StepArrowIcon direction="prev" />
                          <span>
                            {isEs
                              ? `Anterior: ${prevRow.stage[language]}`
                              : `Previous: ${prevRow.stage[language]}`}
                          </span>
                        </button>
                      ) : (
                        <span aria-hidden="true" />
                      )}

                      {nextRow ? (
                        <button
                          type="button"
                          tabIndex={selected ? 0 : -1}
                          onClick={() => selectStage(index + 1)}
                          className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] cursor-pointer items-center gap-2 border-0 bg-transparent p-0 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                        >
                          <span>
                            {isEs
                              ? `Siguiente: ${nextRow.stage[language]}`
                              : `Next: ${nextRow.stage[language]}`}
                          </span>
                          <StepArrowIcon direction="next" />
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="container pt-[var(--space-xs)] pb-[var(--section-gap)]">
        <div className="flex flex-wrap items-center justify-between gap-4 text-[length:var(--text-sm)]">
          <Link
            className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
            href={localizeHref("/manufacturing#quality-and-compliance")}
          >
            <span>
              {isEs
                ? "Ver qué dejamos por escrito antes de producir"
                : "See what we put in writing before cutting starts"}
            </span>
            <StepArrowIcon direction="next" />
          </Link>
          <Link
            className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
            href={localizeHref("/manufacturing#process")}
          >
            <span>
              {isEs
                ? "Ver las seis fases, del boceto a tu puerta"
                : "See the six stages from sketch to your door"}
            </span>
            <StepArrowIcon direction="next" />
          </Link>
        </div>
      </div>
    </section>
  );
}
