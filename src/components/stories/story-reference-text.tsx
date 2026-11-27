"use client";

import Image from "next/image";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

import {
  REFERENCE_KIND_LABELS,
  segmentParagraphWithReferences,
  type StoryReferenceEntry,
  type StoryReferenceVisual,
  type TextSegment,
} from "@/data/story-references";
import type { StoryLanguage } from "@/data/story-types";

export { segmentParagraphWithReferences, type TextSegment };

// Coordinate so only one reference dialog stays open at a time across the page.
const openTooltipDismissers = new Set<() => void>();

function notifyTooltipOpened(currentDismiss: () => void): void {
  for (const dismiss of openTooltipDismissers) {
    if (dismiss !== currentDismiss) {
      dismiss();
    }
  }
}

interface TooltipCoords {
  readonly mode: "popover" | "sheet";
  readonly left: number;
  readonly top: number;
  readonly arrowLeft: number;
  readonly placement: "above" | "below";
}

const CARD_WIDTH_PX = 288;
const VIEWPORT_MARGIN_PX = 12;
const TOP_SAFE_PX = 124;
const BOTTOM_SAFE_PX = 16;

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isSheetViewport(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return (
    window.innerWidth < 768 || window.matchMedia("(pointer: coarse)").matches
  );
}

function measureTooltipCoords(
  anchor: HTMLElement,
  hasVisual: boolean,
  measuredHeight?: number,
): TooltipCoords {
  if (isSheetViewport()) {
    return {
      mode: "sheet",
      left: 0,
      top: 0,
      arrowLeft: 0,
      placement: "below",
    };
  }

  const clientRect =
    anchor.getClientRects()[0] ?? anchor.getBoundingClientRect();
  const vh = window.innerHeight;
  const centerX = clientRect.left + clientRect.width / 2;
  const maxLeft = Math.max(
    VIEWPORT_MARGIN_PX,
    window.innerWidth - CARD_WIDTH_PX - VIEWPORT_MARGIN_PX,
  );
  const clampedLeft = Math.min(
    Math.max(VIEWPORT_MARGIN_PX, centerX - CARD_WIDTH_PX / 2),
    maxLeft,
  );
  const arrowLeft = Math.min(
    Math.max(18, centerX - clampedLeft),
    CARD_WIDTH_PX - 18,
  );

  // Respect fixed header clearance (TOP_SAFE_PX = 124) and clamp rendered card height within the viewport.
  const maxCardH = Math.max(160, vh - 160);
  const cardH = Math.min(
    measuredHeight && measuredHeight > 0
      ? measuredHeight
      : hasVisual
        ? 380
        : 196,
    maxCardH,
  );

  const availableAbove = clientRect.top - TOP_SAFE_PX - 10;
  const availableBelow = vh - clientRect.bottom - BOTTOM_SAFE_PX - 10;
  const placement: "above" | "below" =
    availableAbove >= cardH
      ? "above"
      : availableBelow >= cardH
        ? "below"
        : availableBelow >= availableAbove
          ? "below"
          : "above";

  const rawTop =
    placement === "below"
      ? clientRect.bottom + 10
      : clientRect.top - cardH - 10;
  const maxTop = Math.max(TOP_SAFE_PX, vh - cardH - BOTTOM_SAFE_PX);
  const clampedTop = Math.min(Math.max(TOP_SAFE_PX, rawTop), maxTop);

  return {
    mode: "popover",
    left: clampedLeft,
    top: clampedTop,
    arrowLeft,
    placement,
  };
}

function renderReferenceVisual(
  visual: StoryReferenceVisual | undefined,
  lang: StoryLanguage,
) {
  if (!visual) {
    return null;
  }

  switch (visual.kind) {
    case "map":
      return (
        <div className="relative h-48 w-full overflow-hidden bg-[var(--color-pale-sage)]">
          <Image
            src={visual.mapSrc}
            alt={visual.alt[lang]}
            fill
            sizes="(max-width: 767px) 100vw, 480px"
            className="object-cover"
          />
        </div>
      );

    case "photo": {
      const isContain = visual.fit === "contain";
      return (
        <div
          className={`relative h-48 w-full overflow-hidden ${
            isContain ? "bg-[var(--color-paper)]" : "bg-[var(--color-paper-2)]"
          }`}
        >
          <Image
            src={visual.src}
            alt={visual.alt[lang]}
            fill
            sizes="(max-width: 767px) 100vw, 480px"
            style={
              isContain
                ? undefined
                : { objectPosition: visual.objectPosition ?? "50% 50%" }
            }
            className={isContain ? "object-contain p-1.5" : "object-cover"}
          />
        </div>
      );
    }

    default: {
      const _exhaustive: never = visual;
      return _exhaustive;
    }
  }
}

interface ReferenceTriggerProps {
  readonly text: string;
  readonly entry: StoryReferenceEntry;
  readonly lang: StoryLanguage;
}

function ReferenceTrigger({ text, entry, lang }: ReferenceTriggerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [coords, setCoords] = useState<TooltipCoords | null>(null);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isActivatedRef = useRef(false);
  const tooltipId = useId();
  const hasVisual = entry.visual !== undefined;
  const isSpanish = lang === "es";

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeNow = useCallback(
    (restoreFocus = false) => {
      clearCloseTimer();
      isActivatedRef.current = false;
      setIsActivated(false);
      setIsOpen(false);
      if (restoreFocus) {
        window.requestAnimationFrame(() => {
          anchorRef.current?.focus({ preventScroll: true });
        });
      }
    },
    [clearCloseTimer],
  );

  const dismissPassive = useCallback(() => {
    closeNow(false);
  }, [closeNow]);

  const openNow = useCallback(
    (activated: boolean) => {
      clearCloseTimer();
      const el = anchorRef.current;
      if (!el) {
        return;
      }
      notifyTooltipOpened(dismissPassive);
      setCoords(
        measureTooltipCoords(el, hasVisual, cardRef.current?.offsetHeight),
      );
      if (activated) {
        isActivatedRef.current = true;
        setIsActivated(true);
      }
      setIsOpen(true);
    },
    [clearCloseTimer, dismissPassive, hasVisual],
  );

  const schedulePassiveClose = useCallback(() => {
    if (isActivatedRef.current) {
      return;
    }
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      if (!isActivatedRef.current) {
        setIsOpen(false);
      }
    }, 140);
  }, [clearCloseTimer]);

  useEffect(() => {
    openTooltipDismissers.add(dismissPassive);
    return () => {
      openTooltipDismissers.delete(dismissPassive);
      clearCloseTimer();
    };
  }, [clearCloseTimer, dismissPassive]);

  useEffect(() => {
    if (!isOpen || !isActivated) {
      return;
    }
    const rafId = window.requestAnimationFrame(() => {
      const target = closeButtonRef.current ?? cardRef.current;
      target?.focus({ preventScroll: true });
    });
    return () => {
      window.cancelAnimationFrame(rafId);
    };
  }, [isActivated, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }
      if (!isSheetViewport()) {
        const rect = anchor.getBoundingClientRect();
        if (rect.bottom < TOP_SAFE_PX - 12 || rect.top > window.innerHeight) {
          closeNow(false);
          return;
        }
      }
      setCoords(
        measureTooltipCoords(anchor, hasVisual, cardRef.current?.offsetHeight),
      );
    };

    const rafId = window.requestAnimationFrame(() => {
      if (anchorRef.current && cardRef.current) {
        setCoords(
          measureTooltipCoords(
            anchorRef.current,
            hasVisual,
            cardRef.current.offsetHeight,
          ),
        );
      }
    });

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) {
        return;
      }
      if (
        anchorRef.current?.contains(target) ||
        cardRef.current?.contains(target)
      ) {
        return;
      }
      closeNow(false);
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeNow(true);
      }
    };

    window.addEventListener("scroll", updatePosition, { passive: true });
    window.addEventListener("resize", updatePosition);
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [closeNow, hasVisual, isOpen]);

  const handlePointerEnter = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" && !isSheetViewport()) {
      openNow(false);
    }
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.pointerType === "mouse" && !isActivatedRef.current) {
      schedulePassiveClose();
    }
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (isOpen && isActivatedRef.current) {
      closeNow(true);
    } else {
      openNow(true);
    }
  };

  const handleDialogKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      closeNow(true);
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const container = cardRef.current;
    if (!container) {
      return;
    }

    const focusables = Array.from(
      container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
    );
    if (focusables.length === 0) {
      event.preventDefault();
      container.focus({ preventScroll: true });
      return;
    }

    const first = focusables[0]!;
    const last = focusables[focusables.length - 1]!;
    const active = document.activeElement;

    if (event.shiftKey) {
      if (
        active === first ||
        active === container ||
        !container.contains(active)
      ) {
        event.preventDefault();
        last.focus({ preventScroll: true });
      }
    } else if (active === last || !container.contains(active)) {
      event.preventDefault();
      first.focus({ preventScroll: true });
    }
  };

  const isSheet = coords?.mode === "sheet";

  return (
    <>
      <button
        ref={anchorRef}
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls={isOpen ? tooltipId : undefined}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
        className={`inline cursor-help appearance-none rounded-[var(--space-2xs)] border-0 bg-transparent p-0 text-start text-inherit underline decoration-[var(--color-clay)] decoration-2 underline-offset-[0.26em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${
          isOpen
            ? "bg-[var(--color-clay)]/20 text-[var(--color-forest-deep)] decoration-solid"
            : "decoration-dotted hover:bg-[var(--color-clay)]/14 hover:text-[var(--color-forest-deep)]"
        }`}
      >
        {text}
      </button>

      {isOpen && coords && typeof document !== "undefined"
        ? createPortal(
            <>
              {isSheet ? (
                <div
                  aria-hidden="true"
                  onClick={() => closeNow(true)}
                  className="fixed inset-0 z-[var(--z-tooltip)] bg-[var(--color-night)]/35"
                />
              ) : null}

              <div
                ref={cardRef}
                id={tooltipId}
                role="dialog"
                aria-modal={isSheet ? "true" : undefined}
                aria-label={entry.title[lang]}
                tabIndex={-1}
                data-lenis-prevent
                onKeyDown={handleDialogKeyDown}
                onMouseEnter={isSheet ? undefined : clearCloseTimer}
                onMouseLeave={
                  isSheet || isActivated ? undefined : schedulePassiveClose
                }
                style={
                  isSheet
                    ? undefined
                    : {
                        position: "fixed",
                        left: `${coords.left}px`,
                        top: `${coords.top}px`,
                        width: `${CARD_WIDTH_PX}px`,
                      }
                }
                className={
                  isSheet
                    ? "fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[var(--z-tooltip)] mx-auto max-h-[68dvh] max-w-[30rem] overflow-y-auto overscroll-contain rounded-[var(--radius-panel)] border border-[var(--color-rule)] bg-[var(--color-white)] text-[var(--color-ink)] shadow-[var(--shadow-popover)] focus:outline-none"
                    : "z-[var(--z-tooltip)] rounded-[var(--radius-panel)] border border-[var(--color-rule)] bg-[var(--color-white)] text-[var(--color-ink)] shadow-[var(--shadow-popover)] focus:outline-none"
                }
              >
                <div
                  data-lenis-prevent
                  className={
                    isSheet
                      ? "rounded-[calc(var(--radius-panel)-1px)]"
                      : "max-h-[calc(100dvh-10rem)] overflow-y-auto overscroll-contain rounded-[calc(var(--radius-panel)-1px)]"
                  }
                >
                  <div className="sticky top-0 z-[var(--z-raised)] flex items-center justify-between gap-2 bg-[var(--color-white)] py-0.5 ps-3.5 pe-1">
                    <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-clay-ink)] uppercase">
                      {REFERENCE_KIND_LABELS[entry.category][lang]}
                    </p>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        closeNow(true);
                      }}
                      aria-label={
                        isSpanish ? "Cerrar referencia" : "Close reference"
                      }
                      className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border-0 bg-transparent text-[var(--color-forest-deep)] transition-colors hover:bg-[var(--color-paper-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
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
                        aria-hidden="true"
                      >
                        <path d="M6 6l12 12M18 6 6 18" />
                      </svg>
                    </button>
                  </div>

                  {renderReferenceVisual(entry.visual, lang)}

                  <div className="grid gap-1.5 p-3.5">
                    <p className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-md)] leading-[1.2] font-normal text-[var(--color-forest-deep)]">
                      {entry.title[lang]}
                    </p>
                    <p className="m-0 text-[length:var(--text-xs)] leading-[1.45] text-[var(--color-muted)]">
                      {entry.description[lang]}
                    </p>
                  </div>
                </div>

                {!isSheet ? (
                  <span
                    aria-hidden="true"
                    style={{ left: `${coords.arrowLeft}px` }}
                    className={`pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-[var(--color-rule)] bg-[var(--color-white)] ${
                      coords.placement === "above"
                        ? "-bottom-[6px] border-e border-b"
                        : "-top-[6px] border-s border-t"
                    }`}
                  />
                ) : null}
              </div>
            </>,
            document.body,
          )
        : null}
    </>
  );
}

interface StoryReferenceSegmentsProps {
  readonly segments: readonly TextSegment[];
  readonly lang: StoryLanguage;
}

export function StoryReferenceSegments({
  segments,
  lang,
}: StoryReferenceSegmentsProps) {
  return (
    <>
      {segments.map((segment, index) =>
        segment.kind === "ref" ? (
          <ReferenceTrigger
            key={`${segment.entry.id}-${index}`}
            text={segment.text}
            entry={segment.entry}
            lang={lang}
          />
        ) : (
          <Fragment key={`txt-${index}`}>{segment.text}</Fragment>
        ),
      )}
    </>
  );
}
