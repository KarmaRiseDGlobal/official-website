"use client";

import Image from "next/image";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
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
  readonly left: number;
  readonly top?: number;
  readonly bottom?: number;
  readonly arrowLeft: number;
  readonly placement: "above" | "below";
}

const CARD_WIDTH_PX = 288;
const VIEWPORT_MARGIN_PX = 12;

function measureTooltipCoords(
  anchor: HTMLElement,
  hasVisual: boolean,
): TooltipCoords {
  const clientRect =
    anchor.getClientRects()[0] ?? anchor.getBoundingClientRect();
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

  // Flip below the word if too close to the top viewport / fixed header
  const minTopSpace = hasVisual ? 320 : 165;
  if (clientRect.top < minTopSpace) {
    return {
      left: clampedLeft,
      top: clientRect.bottom + 10,
      arrowLeft,
      placement: "below",
    };
  }

  return {
    left: clampedLeft,
    bottom: window.innerHeight - clientRect.top + 10,
    arrowLeft,
    placement: "above",
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
            sizes="288px"
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
            sizes="288px"
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

function getTopArrowSurfaceClass(
  visual: StoryReferenceVisual | undefined,
): string {
  if (!visual) {
    return "bg-[var(--color-white)]";
  }
  switch (visual.kind) {
    case "map":
      return "bg-[#e6dfd1]";
    case "photo":
      return visual.fit === "contain"
        ? "bg-[#f4ede0]"
        : "bg-[var(--color-paper-2)]";
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
    setCoords(measureTooltipCoords(el, hasVisual));
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
      if (anchorRef.current) {
        setCoords(measureTooltipCoords(anchorRef.current, hasVisual));
      }
    };

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

  return (
    <>
      <span
        ref={anchorRef}
        role="button"
        tabIndex={0}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? tooltipId : undefined}
        onPointerDown={handlePointerDownTrigger}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={handleFocus}
        onBlur={scheduleClose}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className="cursor-help underline decoration-[var(--color-clay)] decoration-dotted decoration-2 underline-offset-[0.26em] transition-colors hover:bg-[var(--color-clay)]/14 hover:text-[var(--color-forest-deep)] focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
      >
        {text}
      </span>

      {isOpen && coords && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={cardRef}
              id={tooltipId}
              role="tooltip"
              onMouseEnter={clearCloseTimer}
              onMouseLeave={scheduleClose}
              style={{
                position: "fixed",
                left: `${coords.left}px`,
                top: coords.top !== undefined ? `${coords.top}px` : undefined,
                bottom:
                  coords.bottom !== undefined
                    ? `${coords.bottom}px`
                    : undefined,
                width: `${CARD_WIDTH_PX}px`,
              }}
              className="z-[var(--z-tooltip)] rounded-[1rem] border border-[var(--color-rule)] bg-[var(--color-white)] text-[var(--color-ink)] shadow-[0_18px_44px_rgba(24,45,32,0.2)]"
            >
              <div className="overflow-hidden rounded-[calc(1rem-1px)]">
                {renderReferenceVisual(entry.visual, lang)}

                <div className="grid gap-1 p-3.5">
                  <p className="m-0 text-[0.68rem] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)] uppercase">
                    {REFERENCE_KIND_LABELS[entry.category][lang]}
                  </p>
                  <p className="m-0 font-[family-name:var(--font-display)] text-[1rem] leading-[1.2] font-medium text-[var(--color-forest-deep)]">
                    {entry.title[lang]}
                  </p>
                  <p className="m-0 text-[0.8125rem] leading-[1.45] text-[var(--color-muted)]">
                    {entry.description[lang]}
                  </p>
                </div>
              </div>

              <span
                aria-hidden="true"
                style={{ left: `${coords.arrowLeft}px` }}
                className={`pointer-events-none absolute h-2.5 w-2.5 -translate-x-1/2 rotate-45 border-[var(--color-rule)] ${
                  coords.placement === "above"
                    ? "-bottom-[6px] border-r border-b bg-[var(--color-white)]"
                    : `-top-[6px] border-t border-l ${getTopArrowSurfaceClass(entry.visual)}`
                }`}
              />
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
