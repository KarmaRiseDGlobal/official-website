"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { requestSmoothScrollTo } from "@/components/motion/smooth-scroll";
import {
  HOME_CLOSING_CONVERSATION,
  type HomeClosingOption,
} from "@/data/home-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";
import { useTextZoomGuard } from "@/lib/use-text-zoom-guard";

const WHATSAPP_CTA_HREF = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma, I would like to ask about manufacturing with KarmaRise D Global.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma, me gustaría consultar sobre fabricación con KarmaRise D Global.")}`,
} as const;

const STATEMENT_EXIT_START = 0.06;
const STATEMENT_EXIT_END = 0.26;

// Non-uniform, distance-scaled stacking wave for the three concentric logo arches.
// Arch 1 travels furthest from offscreen bottom to the top crest (top: 7%),
// Arch 2 overlaps mid-ascent and stacks onto Arch 1 (top: 38%),
// Arch 3 closes with a shorter gap and shortest rise, stacking onto Arch 2 (top: 68%).
const ARCH_STACK_WINDOWS = [
  { start: 0.12, end: 0.44, travelVh: 0.96 },
  { start: 0.34, end: 0.62, travelVh: 0.66 },
  { start: 0.52, end: 0.76, travelVh: 0.36 },
] as const;

const SETTLE_PHASE1_PROGRESS = 0.02;
const SETTLE_PHASE2_PROGRESS = 0.82;
const IDLE_SETTLE_DELAY_MS = 320;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function easeOutCubic(t: number): number {
  const c = clamp01(t);
  return 1 - Math.pow(1 - c, 3);
}

function easeInOutQuad(t: number): number {
  const c = clamp01(t);
  return c < 0.5 ? 2 * c * c : 1 - Math.pow(-2 * c + 2, 2) / 2;
}

function getOptionHref(
  option: HomeClosingOption,
  language: SiteLanguage,
  whatsappHref: Record<SiteLanguage, string>,
): string {
  if (option.id === "product-brief") {
    return localizePath("/product-brief", language);
  }
  if (option.id === "book-call") {
    return localizePath("/book-a-call?duration=15", language);
  }
  return whatsappHref[language];
}

export interface ClosingConversationCopy {
  readonly heading: Record<SiteLanguage, string>;
  readonly confidentialityNote: Record<SiteLanguage, string>;
  readonly advanceCue: Record<SiteLanguage, string>;
  readonly optionsAriaLabel: Record<SiteLanguage, string>;
  readonly options: readonly HomeClosingOption[];
}

interface ClosingConversationSectionProps {
  readonly language: SiteLanguage;
  readonly copy?: ClosingConversationCopy;
  readonly whatsappHref?: Record<SiteLanguage, string>;
  readonly enableScrollPin?: boolean;
}

export function ClosingConversationSection({
  language,
  copy = HOME_CLOSING_CONVERSATION,
  whatsappHref = WHATSAPP_CTA_HREF,
  enableScrollPin = true,
}: ClosingConversationSectionProps) {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const statementRef = useRef<HTMLDivElement>(null);
  const statementHeadingRef = useRef<HTMLHeadingElement>(null);
  const statementFooterRef = useRef<HTMLDivElement>(null);
  const advanceButtonRef = useRef<HTMLButtonElement>(null);
  const choicesLayerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const progressRef = useRef(0);
  const isTextZoomed = useTextZoomGuard();
  const [overflowBlockedKey, setOverflowBlockedKey] = useState<string | null>(
    null,
  );
  const [viewportKey, setViewportKey] = useState("");
  const isOverflowBlocked =
    overflowBlockedKey !== null && overflowBlockedKey === viewportKey;

  useEffect(() => {
    const syncViewportKey = () => {
      setViewportKey(`${window.innerWidth}x${window.innerHeight}`);
    };
    syncViewportKey();
    window.addEventListener("resize", syncViewportKey, { passive: true });
    return () => window.removeEventListener("resize", syncViewportKey);
  }, []);

  const scrollToChoices = useCallback(() => {
    const st = triggerRef.current;
    if (!st || rootRef.current?.dataset.enhanced !== "true") {
      return;
    }
    const targetTop = st.start + (st.end - st.start) * SETTLE_PHASE2_PROGRESS;
    requestSmoothScrollTo({
      top: targetTop,
      duration: 0.85,
    });
  }, []);

  const handleOptionFocus = useCallback(() => {
    const st = triggerRef.current;
    if (
      !st ||
      rootRef.current?.dataset.enhanced !== "true" ||
      progressRef.current >= 0.76
    ) {
      return;
    }
    const targetTop = st.start + (st.end - st.start) * SETTLE_PHASE2_PROGRESS;
    requestSmoothScrollTo({
      top: targetTop,
      duration: 0.48,
    });
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const statement = statementRef.current;
    const statementHeading = statementHeadingRef.current;
    const statementFooter = statementFooterRef.current;
    const advanceButton = advanceButtonRef.current;
    const choicesLayer = choicesLayerRef.current;

    if (
      !root ||
      !pin ||
      !statement ||
      !statementHeading ||
      !statementFooter ||
      !advanceButton ||
      !choicesLayer
    ) {
      return;
    }

    const clearClosingInlineStyles = () => {
      const archItems = Array.from(
        choicesLayer.querySelectorAll<HTMLElement>("[data-closing-choice]"),
      );
      statement.removeAttribute("style");
      statement.removeAttribute("aria-hidden");
      statementHeading.removeAttribute("style");
      statementFooter.removeAttribute("style");
      advanceButton.removeAttribute("tabindex");
      choicesLayer.removeAttribute("style");
      for (const arch of archItems) {
        arch.removeAttribute("style");
        arch
          .querySelector<HTMLElement>("[data-closing-body]")
          ?.removeAttribute("style");
      }
    };

    if (!enableScrollPin) {
      delete root.dataset.enhanced;
      delete root.dataset.pinning;
      delete root.dataset.settled;
      triggerRef.current = null;
      progressRef.current = 0;
      clearClosingInlineStyles();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      {
        enhancedViewport: "(min-width: 64rem) and (min-height: 35rem)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { enhancedViewport, reducedMotion } = context.conditions ?? {};

        if (
          !enhancedViewport ||
          reducedMotion ||
          isTextZoomed ||
          isOverflowBlocked
        ) {
          delete root.dataset.enhanced;
          delete root.dataset.pinning;
          delete root.dataset.settled;
          triggerRef.current = null;
          progressRef.current = 0;
          clearClosingInlineStyles();
          return;
        }

        root.dataset.enhanced = "true";

        const archItems = Array.from(
          choicesLayer.querySelectorAll<HTMLElement>("[data-closing-choice]"),
        );
        const archBodies = archItems.map((el) =>
          el.querySelector<HTMLElement>("[data-closing-body]"),
        );

        const hasBodyOverflow = () => {
          const maxBandHeight = Math.max(window.innerHeight * 0.34, 210);
          return archBodies.some(
            (body) => body !== null && body.scrollHeight > maxBandHeight + 20,
          );
        };

        if (hasBodyOverflow()) {
          delete root.dataset.enhanced;
          delete root.dataset.pinning;
          delete root.dataset.settled;
          triggerRef.current = null;
          progressRef.current = 0;
          setOverflowBlockedKey(`${window.innerWidth}x${window.innerHeight}`);
          return;
        }

        let viewportH = window.innerHeight;
        let lastStatementInteractive: boolean | null = null;
        let lastStatementHidden: boolean | null = null;
        let lastChoicesLayerInteractive: boolean | null = null;
        let lastChoicesSettled: boolean | null = null;
        const lastChoiceInteractive = new Array<boolean | null>(
          archItems.length,
        ).fill(null);

        const syncFromProgress = (p: number) => {
          progressRef.current = p;

          // 1. Opening statement retreats simultaneously ahead of Arch 1 rising into the crest
          const exitRaw = clamp01(
            (p - STATEMENT_EXIT_START) /
              (STATEMENT_EXIT_END - STATEMENT_EXIT_START),
          );
          const exitT = easeInOutQuad(exitRaw);

          gsap.set(statementHeading, {
            opacity: 1 - exitT,
            y: -34 * exitT,
            scale: 1 - 0.035 * exitT,
            force3D: true,
          });
          gsap.set(statementFooter, {
            opacity: 1 - Math.min(1, exitT * 1.18),
            y: 12 * exitT,
            force3D: true,
          });

          const statementInteractive = p < 0.2;
          if (statementInteractive !== lastStatementInteractive) {
            lastStatementInteractive = statementInteractive;
            statement.style.pointerEvents = statementInteractive
              ? "auto"
              : "none";
            advanceButton.tabIndex = statementInteractive ? 0 : -1;
          }

          const statementHidden = p >= 0.25;
          if (statementHidden !== lastStatementHidden) {
            lastStatementHidden = statementHidden;
            statement.setAttribute("aria-hidden", String(statementHidden));
          }

          // 2. Three concentric logo arches rise and stack sequentially on top of one another.
          // Each arched sheet carries its own copy as one single object (one entrance per container).
          let anyChoiceInteractive = false;
          for (let idx = 0; idx < archItems.length; idx += 1) {
            const win = ARCH_STACK_WINDOWS[idx] ?? ARCH_STACK_WINDOWS[0];
            const rawT = clamp01((p - win.start) / (win.end - win.start));
            const easedT = easeOutCubic(rawT);
            const offsetY = viewportH * win.travelVh * (1 - easedT);
            // Keep completely parked sheets invisible so upward box-shadow never peeks during Phase 1
            const sheetOpacity = rawT <= 0.002 ? 0 : Math.min(1, rawT * 12);

            const archEl = archItems[idx];
            if (archEl) {
              gsap.set(archEl, {
                y: offsetY,
                opacity: sheetOpacity,
                force3D: true,
              });
            }

            const bodyEl = archBodies[idx];
            if (bodyEl) {
              const bodyAlpha =
                rawT <= 0.002 ? 0 : 0.28 + 0.72 * easeOutCubic(rawT);
              bodyEl.style.opacity = bodyAlpha.toFixed(3);
            }

            // Hard Rule #4: Each arch becomes clickable as soon as it enters the visible viewport
            const isInteractive = rawT > 0.24;
            if (isInteractive) {
              anyChoiceInteractive = true;
            }
            if (isInteractive !== lastChoiceInteractive[idx]) {
              lastChoiceInteractive[idx] = isInteractive;
              if (archEl) {
                archEl.style.pointerEvents = isInteractive ? "auto" : "none";
              }
            }
          }

          if (anyChoiceInteractive !== lastChoicesLayerInteractive) {
            lastChoicesLayerInteractive = anyChoiceInteractive;
            choicesLayer.style.pointerEvents = anyChoiceInteractive
              ? "auto"
              : "none";
          }

          const choicesSettled = p >= 0.76;
          if (choicesSettled !== lastChoicesSettled) {
            lastChoicesSettled = choicesSettled;
            root.dataset.settled = choicesSettled ? "true" : "false";
          }
        };

        syncFromProgress(0);

        // Gentle post-idle settle routed through Lenis so a partial stack finishes cleanly
        let idleSettleTimer: number | null = null;
        let settleResetTimer: number | null = null;
        let lastScrollDirection = 0;
        let isPointerDown = false;
        let isSettlingProgrammatically = false;

        const clearIdleSettle = () => {
          if (idleSettleTimer !== null) {
            window.clearTimeout(idleSettleTimer);
            idleSettleTimer = null;
          }
          if (settleResetTimer !== null) {
            window.clearTimeout(settleResetTimer);
            settleResetTimer = null;
          }
        };

        const cancelSettleOnUserInput = () => {
          isSettlingProgrammatically = false;
          clearIdleSettle();
        };

        const onPointerDown = () => {
          isPointerDown = true;
          cancelSettleOnUserInput();
        };

        const onPointerUp = () => {
          isPointerDown = false;
        };

        const scheduleIdleSettle = (stInstance: ScrollTrigger) => {
          clearIdleSettle();
          if (
            !stInstance.isActive ||
            isPointerDown ||
            isSettlingProgrammatically
          ) {
            return;
          }

          const currentP = stInstance.progress;
          if (currentP <= 0.05 || currentP >= 0.78) {
            return;
          }

          idleSettleTimer = window.setTimeout(() => {
            idleSettleTimer = null;
            if (!stInstance.isActive || isPointerDown) return;

            const p = stInstance.progress;
            if (p <= 0.05 || p >= 0.78) return;

            const targetProgress =
              lastScrollDirection >= 0 || p >= 0.18
                ? SETTLE_PHASE2_PROGRESS
                : SETTLE_PHASE1_PROGRESS;

            const targetScroll =
              stInstance.start +
              (stInstance.end - stInstance.start) * targetProgress;
            if (Math.abs(targetScroll - window.scrollY) < 6) return;

            isSettlingProgrammatically = true;
            requestSmoothScrollTo({
              top: targetScroll,
              duration: 0.56,
            });
            settleResetTimer = window.setTimeout(() => {
              settleResetTimer = null;
              isSettlingProgrammatically = false;
            }, 600);
          }, IDLE_SETTLE_DELAY_MS);
        };

        window.addEventListener("wheel", cancelSettleOnUserInput, {
          passive: true,
        });
        window.addEventListener("touchstart", cancelSettleOnUserInput, {
          passive: true,
        });
        window.addEventListener("pointerdown", onPointerDown, {
          passive: true,
        });
        window.addEventListener("pointerup", onPointerUp, { passive: true });
        window.addEventListener("pointercancel", onPointerUp, {
          passive: true,
        });
        window.addEventListener("keydown", cancelSettleOnUserInput, {
          passive: true,
        });

        // Recalculate trigger offsets when the FAQ accordion above changes height
        const faqSection = document.getElementById("faq");
        let faqRefreshTimer: number | null = null;
        let lastFaqHeight = faqSection?.offsetHeight ?? 0;
        let faqObserver: ResizeObserver | null = null;

        if (faqSection && typeof ResizeObserver !== "undefined") {
          faqObserver = new ResizeObserver(() => {
            const nextHeight = faqSection.offsetHeight;
            if (Math.abs(nextHeight - lastFaqHeight) < 2) {
              return;
            }
            lastFaqHeight = nextHeight;
            if (faqRefreshTimer !== null) {
              window.clearTimeout(faqRefreshTimer);
            }
            faqRefreshTimer = window.setTimeout(() => {
              faqRefreshTimer = null;
              ScrollTrigger.refresh();
            }, 180);
          });
          faqObserver.observe(faqSection);
        }

        const st = ScrollTrigger.create({
          trigger: root,
          pin,
          start: "top top",
          end: () =>
            `+=${Math.round(Math.max(window.innerHeight * 2.1, 1650))}`,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            root.dataset.pinning = self.isActive ? "true" : "false";
            if (!self.isActive) {
              clearIdleSettle();
            }
          },
          onRefresh: (self) => {
            viewportH = window.innerHeight;
            if (hasBodyOverflow()) {
              setOverflowBlockedKey(
                `${window.innerWidth}x${window.innerHeight}`,
              );
              return;
            }
            syncFromProgress(self.progress);
          },
          onUpdate: (self) => {
            if (self.direction !== 0) {
              lastScrollDirection = self.direction;
            }
            syncFromProgress(self.progress);
            scheduleIdleSettle(self);
          },
        });

        triggerRef.current = st;
        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        return () => {
          clearIdleSettle();
          if (faqRefreshTimer !== null) {
            window.clearTimeout(faqRefreshTimer);
          }
          faqObserver?.disconnect();
          window.removeEventListener("wheel", cancelSettleOnUserInput);
          window.removeEventListener("touchstart", cancelSettleOnUserInput);
          window.removeEventListener("pointerdown", onPointerDown);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("pointercancel", onPointerUp);
          window.removeEventListener("keydown", cancelSettleOnUserInput);

          st.kill();
          triggerRef.current = null;
          progressRef.current = 0;
          clearClosingInlineStyles();

          delete root.dataset.enhanced;
          delete root.dataset.pinning;
          delete root.dataset.settled;
          ScrollTrigger.refresh();
        };
      },
    );

    return () => {
      media.revert();
      clearClosingInlineStyles();
      delete root.dataset.enhanced;
      delete root.dataset.pinning;
      delete root.dataset.settled;
    };
  }, [enableScrollPin, isTextZoomed, isOverflowBlocked]);

  const headingId = "closing-conversation-heading";

  return (
    <section
      ref={rootRef}
      id="start-conversation"
      data-chat-avoid
      aria-labelledby={headingId}
      className="closing-cta"
    >
      <div ref={pinRef} className="closing-stage-pin">
        <div className="closing-ambient-glow" aria-hidden="true" />

        <div ref={statementRef} className="closing-statement">
          <div className="closing-statement-inner container">
            <h2
              ref={statementHeadingRef}
              id={headingId}
              className="closing-statement-title"
            >
              {copy.heading[language]}
            </h2>

            <div ref={statementFooterRef} className="closing-statement-foot">
              <p className="closing-statement-note">
                {copy.confidentialityNote[language]}
              </p>
              <button
                ref={advanceButtonRef}
                type="button"
                onClick={scrollToChoices}
                className="closing-advance-cue"
              >
                <span>{copy.advanceCue[language]}</span>
                <svg
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M8 3.5v9m0 0-3.5-3.5M8 12.5 11.5 9" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <div
          ref={choicesLayerRef}
          className="closing-choices-layer"
          role="group"
          aria-label={copy.optionsAriaLabel[language]}
        >
          {copy.options.map((option) => {
            const href = getOptionHref(option, language, whatsappHref);
            const content = (
              <>
                <span className="closing-choice-surface" aria-hidden="true" />
                <span className="closing-choice-body" data-closing-body>
                  <span className="closing-choice-eyebrow">
                    {option.eyebrow[language]}
                  </span>
                  <span className="closing-choice-title-row">
                    <span className="closing-choice-title">
                      {option.title[language]}
                    </span>
                    <span className="closing-choice-arrow" aria-hidden="true">
                      <svg
                        viewBox="0 0 16 16"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5" />
                      </svg>
                    </span>
                  </span>
                  <span className="closing-choice-detail">
                    {option.detail[language]}
                  </span>
                </span>
              </>
            );

            const sharedClassName = `closing-choice closing-choice--${option.tier}${option.primary ? " closing-choice--primary" : ""}`;

            if (option.external) {
              return (
                <a
                  key={option.id}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-closing-choice={option.id}
                  onFocus={handleOptionFocus}
                  className={sharedClassName}
                >
                  {content}
                </a>
              );
            }

            return (
              <Link
                key={option.id}
                href={href}
                data-closing-choice={option.id}
                onFocus={handleOptionFocus}
                className={sharedClassName}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
