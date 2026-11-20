"use client";

import Image from "next/image";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";

import type { StoryLanguage } from "@/data/stories";
import {
  REFERENCE_KIND_LABELS,
  STORY_REFERENCES,
  type StoryReferenceEntry,
  type StoryReferenceVisual,
} from "@/data/story-references";

export type TextSegment =
  | { readonly kind: "text"; readonly text: string }
  | {
      readonly kind: "ref";
      readonly text: string;
      readonly entry: StoryReferenceEntry;
    };

interface CompiledLanguageMatcher {
  readonly regex: RegExp;
  readonly byExactPhrase: ReadonlyMap<string, StoryReferenceEntry>;
}

function escapeRegex(literal: string): string {
  return literal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function compileMatcher(lang: StoryLanguage): CompiledLanguageMatcher {
  const pairs: Array<{ phrase: string; entry: StoryReferenceEntry }> = [];
  for (const entry of STORY_REFERENCES) {
    for (const phrase of entry.terms[lang]) {
      if (phrase.trim().length > 0) {
        pairs.push({ phrase, entry });
      }
    }
  }

  // Longest phrases first so "Shivneri Fort" wins before shorter substrings
  pairs.sort((a, b) => b.phrase.length - a.phrase.length);

  const byExactPhrase = new Map<string, StoryReferenceEntry>();
  const escapedPhrases: string[] = [];

  for (const pair of pairs) {
    if (!byExactPhrase.has(pair.phrase)) {
      byExactPhrase.set(pair.phrase, pair.entry);
      escapedPhrases.push(escapeRegex(pair.phrase));
    }
  }

  const pattern = `(?<![\\p{L}\\p{N}])(${escapedPhrases.join("|")})(?![\\p{L}\\p{N}])`;
  return {
    regex: new RegExp(pattern, "gu"),
    byExactPhrase,
  };
}

const MATCHERS: Readonly<Record<StoryLanguage, CompiledLanguageMatcher>> = {
  en: compileMatcher("en"),
  es: compileMatcher("es"),
};

/**
 * Purely segments a paragraph into plain text and first-occurrence reference triggers.
 * Pass a shared `seenIds` Set within a single pure pass across an article's paragraphs
 * so each reference term is highlighted only on its first appearance.
 */
export function segmentParagraphWithReferences(
  paragraph: string,
  lang: StoryLanguage,
  seenIds: Set<string>,
): TextSegment[] {
  const matcher = MATCHERS[lang];
  const segments: TextSegment[] = [];
  let lastIndex = 0;

  for (const match of paragraph.matchAll(matcher.regex)) {
    const matchedText = match[0];
    const matchIndex = match.index ?? 0;
    const entry = matcher.byExactPhrase.get(matchedText);

    if (!entry || seenIds.has(entry.id)) {
      continue;
    }

    seenIds.add(entry.id);

    if (matchIndex > lastIndex) {
      segments.push({
        kind: "text",
        text: paragraph.slice(lastIndex, matchIndex),
      });
    }

    segments.push({
      kind: "ref",
      text: matchedText,
      entry,
    });

    lastIndex = matchIndex + matchedText.length;
  }

  if (lastIndex < paragraph.length) {
    segments.push({
      kind: "text",
      text: paragraph.slice(lastIndex),
    });
  }

  return segments.length > 0 ? segments : [{ kind: "text", text: paragraph }];
}

// Coordinate so only one tooltip stays open at a time across the page
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

  // Respect fixed header clearance (TOP_SAFE_PX = 124) and clamp rendered card height within the viewport
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
        <div className="relative h-48 w-full overflow-hidden border-b border-[var(--color-rule)]/70 bg-[#d3e2e6]">
          <Image
            src={visual.mapSrc}
            alt={visual.alt[lang]}
            fill
            unoptimized
            loading="eager"
            sizes="(max-width: 767px) 100vw, 480px"
            className="object-cover"
          />
        </div>
      );

    case "photo": {
      const isContain = visual.fit === "contain";
      return (
        <div
          className={`relative h-48 w-full overflow-hidden border-b border-[var(--color-rule)]/70 ${
            isContain ? "bg-[#f4ede0]" : "bg-[var(--color-paper-2)]"
          }`}
        >
          <Image
            src={visual.src}
            alt={visual.alt[lang]}
            fill
            unoptimized
            loading="eager"
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
  const [coords, setCoords] = useState<TooltipCoords | null>(null);
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const wasOpenBeforePointerDownRef = useRef(false);
  const lastPointerDownAtRef = useRef(0);
  const lastHoverOpenAtRef = useRef(0);
  const tooltipId = useId();
  const hasVisual = entry.visual !== undefined;
  const isSpanish = lang === "es";

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current !== null) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const closeNow = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
  }, [clearCloseTimer]);

  const openNow = useCallback(() => {
    clearCloseTimer();
    const el = anchorRef.current;
    if (!el) {
      return;
    }
    notifyTooltipOpened(closeNow);
    setCoords(
      measureTooltipCoords(el, hasVisual, cardRef.current?.offsetHeight),
    );
    setIsOpen(true);
  }, [clearCloseTimer, closeNow, hasVisual]);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    closeTimerRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 120);
  }, [clearCloseTimer]);

  useEffect(() => {
    openTooltipDismissers.add(closeNow);
    return () => {
      openTooltipDismissers.delete(closeNow);
      clearCloseTimer();
    };
  }, [clearCloseTimer, closeNow]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const updatePosition = () => {
      const anchor = anchorRef.current;
      if (!anchor) {
        return;
      }
      const rect = anchor.getBoundingClientRect();
      if (rect.bottom < TOP_SAFE_PX - 12 || rect.top > window.innerHeight) {
        closeNow();
        return;
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
      closeNow();
    };

    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNow();
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

  const handlePointerDownTrigger = () => {
    lastPointerDownAtRef.current = Date.now();
    wasOpenBeforePointerDownRef.current = isOpen;
  };

  const handlePointerEnter = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "mouse") {
      if (!isOpen) {
        lastHoverOpenAtRef.current = Date.now();
      }
      openNow();
    }
  };

  const handlePointerLeave = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (event.pointerType === "mouse") {
      scheduleClose();
    }
  };

  const handleFocus = () => {
    if (Date.now() - lastPointerDownAtRef.current > 250) {
      openNow();
    }
  };

  const handleBlur = (event: FocusEvent<HTMLSpanElement>) => {
    const nextTarget = event.relatedTarget;
    if (nextTarget instanceof Node && cardRef.current?.contains(nextTarget)) {
      return;
    }
    if (!isSheetViewport()) {
      scheduleClose();
    }
  };

  const handleClick = (event: MouseEvent<HTMLSpanElement>) => {
    event.stopPropagation();
    if (Date.now() - lastHoverOpenAtRef.current < 450) {
      openNow();
      return;
    }
    if (wasOpenBeforePointerDownRef.current) {
      closeNow();
    } else {
      openNow();
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) {
        closeNow();
      } else {
        openNow();
      }
    } else if (event.key === "Escape" && isOpen) {
      event.preventDefault();
      closeNow();
    }
  };

  const isSheet = coords?.mode === "sheet";

  return (
    <>
      <span
        ref={anchorRef}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-controls={isOpen ? tooltipId : undefined}
        onPointerDown={handlePointerDownTrigger}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={`cursor-help rounded-xs underline decoration-[var(--color-clay)] decoration-2 underline-offset-[0.26em] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ${
          isOpen
            ? "bg-[var(--color-clay)]/20 text-[var(--color-forest-deep)] decoration-solid"
            : "decoration-dotted hover:bg-[var(--color-clay)]/14 hover:text-[var(--color-forest-deep)]"
        }`}
      >
        {text}
      </span>

      {isOpen && coords && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={cardRef}
              id={tooltipId}
              role="dialog"
              aria-label={entry.title[lang]}
              onMouseEnter={isSheet ? undefined : clearCloseTimer}
              onMouseLeave={isSheet ? undefined : scheduleClose}
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
                  ? "fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[var(--z-tooltip)] mx-auto max-h-[68dvh] max-w-[30rem] overflow-y-auto rounded-[1rem] border border-[var(--color-rule)] bg-[var(--color-white)] text-[var(--color-ink)] shadow-[0_18px_44px_rgba(24,45,32,0.28)]"
                  : "z-[var(--z-tooltip)] rounded-[1rem] border border-[var(--color-rule)] bg-[var(--color-white)] text-[var(--color-ink)] shadow-[0_18px_44px_rgba(24,45,32,0.2)]"
              }
            >
              <div
                className={
                  isSheet
                    ? "rounded-[calc(1rem-1px)]"
                    : "max-h-[calc(100dvh-10rem)] overflow-y-auto rounded-[calc(1rem-1px)]"
                }
              >
                <div className="sticky top-0 z-10 flex items-center justify-between gap-2 border-b border-[var(--color-rule)]/70 bg-[var(--color-white)] py-0.5 pr-1 pl-3.5">
                  <p className="m-0 text-[0.68rem] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)] uppercase">
                    {REFERENCE_KIND_LABELS[entry.category][lang]}
                  </p>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      closeNow();
                    }}
                    aria-label={
                      isSpanish ? "Cerrar referencia" : "Close reference"
                    }
                    className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-transparent text-[1.25rem] leading-none text-[var(--color-forest-deep)] transition-colors hover:bg-[var(--color-paper-2)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>

                {renderReferenceVisual(entry.visual, lang)}

                <div className="grid gap-1.5 p-3.5">
                  <p className="m-0 font-[family-name:var(--font-display)] text-[1rem] leading-[1.2] font-medium text-[var(--color-forest-deep)]">
                    {entry.title[lang]}
                  </p>
                  <p className="m-0 text-[0.8125rem] leading-[1.45] text-[var(--color-muted)]">
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
                      ? "-bottom-[6px] border-r border-b"
                      : "-top-[6px] border-t border-l"
                  }`}
                />
              ) : null}
            </div>,
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
