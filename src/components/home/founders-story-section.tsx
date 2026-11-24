"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import {
  addTransitionType,
  startTransition,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  ViewTransition,
  type ViewTransitionClassPerType,
} from "react";

import { requestSmoothScrollTo } from "@/components/motion/smooth-scroll";
import { SectionBridge } from "@/components/shell/section-bridge";
import { HOME_FOUNDERS_COPY, HOME_PROOF_ITEMS } from "@/data/home-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

type FoundersStagePhase = "cover" | "split";

const SPLIT_ENTER_PROGRESS = 0.09;
const COVER_RETURN_PROGRESS = 0.06;
const POINT1_LANDING_PROGRESS = 0.17;
const PARAGRAPH_SCROLL_START = 0.27;
const PARAGRAPH_SCROLL_END = 0.89;

const BEAT_DWELL_MID = 0.34;
const BEAT_TRANSITION_WEIGHT = 1;

function skipActiveViewTransition(): void {
  if (typeof document === "undefined") {
    return;
  }
  document.activeViewTransition?.skipTransition();
}

function mapSteppedThreeBeatIndex(t: number, count: number): number {
  if (count <= 1) return 0;
  const clamped = Math.max(0, Math.min(1, t));
  if (count === 2) return clamped;

  // Point 1 already has its dedicated 0.06 -> 0.26 landing plateau;
  // give middle point(s) a calm dwell plateau so each paragraph reads effortlessly.
  const middleCount = Math.max(0, count - 2);
  const totalWeight =
    (count - 1) * BEAT_TRANSITION_WEIGHT + middleCount * BEAT_DWELL_MID;
  const target = clamped * totalWeight;

  let cursor = 0;
  for (let i = 0; i < count - 1; i += 1) {
    if (i > 0) {
      const dwellEnd = cursor + BEAT_DWELL_MID;
      if (target <= dwellEnd) {
        return i;
      }
      cursor = dwellEnd;
    }

    const transEnd = cursor + BEAT_TRANSITION_WEIGHT;
    if (target <= transEnd) {
      return i + (target - cursor) / BEAT_TRANSITION_WEIGHT;
    }
    cursor = transEnd;
  }

  return count - 1;
}

const PORTRAIT_SHARE = {
  "founders-to-split": "founders-morph",
  "founders-to-cover": "founders-morph",
  default: "none",
} satisfies ViewTransitionClassPerType;

const CTAS_SHARE = {
  "founders-to-split": "founders-ctas-morph",
  "founders-to-cover": "founders-ctas-morph",
  default: "none",
} satisfies ViewTransitionClassPerType;

const COVER_ENTER = {
  "founders-to-cover": "founders-cover-enter",
  default: "none",
} satisfies ViewTransitionClassPerType;

const COVER_EXIT = {
  "founders-to-split": "founders-cover-exit",
  default: "none",
} satisfies ViewTransitionClassPerType;

const STORY_ENTER = {
  "founders-to-split": "founders-story-enter",
  default: "none",
} satisfies ViewTransitionClassPerType;

const STORY_EXIT = {
  "founders-to-cover": "founders-story-exit",
  default: "none",
} satisfies ViewTransitionClassPerType;

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

function smoothstep(t: number): number {
  const c = clamp01(t);
  return c * c * (3 - 2 * c);
}

interface FoundersStorySectionProps {
  readonly language: SiteLanguage;
}

export function FoundersStorySection({ language }: FoundersStorySectionProps) {
  const localizeHref = (href: string) => localizePath(href, language);
  const itemCount = HOME_PROOF_ITEMS.length;

  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [isEnhanced, setIsEnhanced] = useState(false);
  const [phase, setPhase] = useState<FoundersStagePhase>("cover");

  const phaseRef = useRef<FoundersStagePhase>("cover");
  const isPinActiveRef = useRef(false);
  const transitionGuardUntilRef = useRef(0);
  const progressRef = useRef(0);
  const beatTopsRef = useRef<number[]>([]);
  const beatNodesRef = useRef<HTMLElement[]>([]);

  const applyParagraphProgress = useCallback(
    (scrollProgress: number) => {
      const track = trackRef.current;
      const beatTops = beatTopsRef.current;
      if (!track || beatTops.length === 0) {
        return;
      }

      const paragraphT = clamp01(
        (scrollProgress - PARAGRAPH_SCROLL_START) /
          (PARAGRAPH_SCROLL_END - PARAGRAPH_SCROLL_START),
      );
      const maxIndex = Math.max(1, itemCount - 1);
      const continuousIndex = mapSteppedThreeBeatIndex(paragraphT, itemCount);
      const lower = Math.min(maxIndex, Math.floor(continuousIndex));
      const upper = Math.min(maxIndex, lower + 1);
      const frac = continuousIndex - lower;

      const lowerTop = beatTops[lower] ?? 0;
      const upperTop = beatTops[upper] ?? lowerTop;
      const translateY = lerp(lowerTop, upperTop, frac);

      gsap.set(track, { y: -translateY, force3D: true });

      const beatNodes = beatNodesRef.current;
      for (let idx = 0; idx < beatNodes.length; idx++) {
        const beatEl = beatNodes[idx];
        if (!beatEl) continue;

        const dist = Math.abs(idx - continuousIndex);
        const focus = 1 - smoothstep(Math.min(1, dist * 1.12));
        const opacity = lerp(0.32, 1, focus);
        beatEl.style.opacity = opacity.toFixed(3);
      }
    },
    [itemCount],
  );

  const measureParagraphTrack = useCallback(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) {
      return;
    }

    const beats = Array.from(
      track.querySelectorAll<HTMLElement>("[data-founder-beat]"),
    );
    if (beats.length === 0) {
      return;
    }

    beatNodesRef.current = beats;

    const firstTop = beats[0]?.offsetTop ?? 0;
    const lastBeat = beats[beats.length - 1];
    const viewportHeight = viewport.clientHeight;
    const lastHeight = lastBeat ? lastBeat.offsetHeight : 0;
    const bottomSpacer = Math.max(
      48,
      Math.round(viewportHeight - lastHeight - firstTop),
    );
    track.style.paddingBottom = `${bottomSpacer}px`;

    beatTopsRef.current = beats.map((beat) =>
      Math.max(0, beat.offsetTop - firstTop),
    );
    applyParagraphProgress(progressRef.current);
  }, [applyParagraphProgress]);

  useLayoutEffect(() => {
    if (!isEnhanced) {
      return;
    }

    if (!isPinActiveRef.current) {
      skipActiveViewTransition();
      const rafId = window.requestAnimationFrame(() => {
        if (!isPinActiveRef.current) {
          skipActiveViewTransition();
        }
      });
      return () => window.cancelAnimationFrame(rafId);
    }

    if (phase !== "split") {
      return;
    }

    measureParagraphTrack();

    const viewport = viewportRef.current;
    const track = trackRef.current;
    if (!viewport || !track) {
      return;
    }

    const resizeObserver = new ResizeObserver(() => {
      measureParagraphTrack();
    });
    resizeObserver.observe(viewport);
    resizeObserver.observe(track);

    return () => {
      resizeObserver.disconnect();
      beatTopsRef.current = [];
      beatNodesRef.current = [];
    };
  }, [isEnhanced, phase, language, measureParagraphTrack]);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    if (!root || !pin) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      {
        enhancedViewport:
          "(min-width: 64rem) and (hover: hover) and (pointer: fine)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { enhancedViewport, reducedMotion } = context.conditions ?? {};

        if (!enhancedViewport || reducedMotion) {
          delete root.dataset.enhanced;
          delete root.dataset.pinning;
          phaseRef.current = "cover";
          setIsEnhanced(false);
          setPhase("cover");
          return;
        }

        root.dataset.enhanced = "true";
        setIsEnhanced(true);

        const commitPhase = (
          nextPhase: FoundersStagePhase,
          useViewTransition: boolean,
        ) => {
          if (phaseRef.current === nextPhase) {
            return;
          }
          phaseRef.current = nextPhase;

          if (useViewTransition && isPinActiveRef.current) {
            transitionGuardUntilRef.current = performance.now() + 700;
            const transitionType =
              nextPhase === "split" ? "founders-to-split" : "founders-to-cover";
            startTransition(() => {
              addTransitionType(transitionType);
              setPhase(nextPhase);
            });
          } else {
            skipActiveViewTransition();
            setPhase(nextPhase);
          }
        };

        const st = ScrollTrigger.create({
          trigger: root,
          pin,
          start: "top top",
          end: () =>
            `+=${Math.round(Math.max(window.innerHeight * 2.55, 2000))}`,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            isPinActiveRef.current = self.isActive;
            root.dataset.pinning = self.isActive ? "true" : "false";
            if (!self.isActive) {
              skipActiveViewTransition();
            }
          },
          onRefresh: (self) => {
            isPinActiveRef.current = self.isActive;
            progressRef.current = self.progress;
            const desiredPhase: FoundersStagePhase =
              self.progress >= SPLIT_ENTER_PROGRESS ? "split" : "cover";
            commitPhase(desiredPhase, false);
            measureParagraphTrack();
          },
          onUpdate: (self) => {
            isPinActiveRef.current = self.isActive;
            const p = self.progress;
            progressRef.current = p;

            if (!self.isActive || p <= 0.005 || p >= 0.995) {
              skipActiveViewTransition();
            }

            if (phaseRef.current === "cover" && p >= SPLIT_ENTER_PROGRESS) {
              commitPhase("split", self.isActive);
              if (self.isActive && self.direction >= 0) {
                const point1ScrollTop =
                  self.start +
                  (self.end - self.start) * POINT1_LANDING_PROGRESS;
                requestSmoothScrollTo({
                  top: point1ScrollTop,
                  duration: 0.46,
                  lock: true,
                });
              }
            } else if (
              phaseRef.current === "split" &&
              p <= COVER_RETURN_PROGRESS
            ) {
              // Skip the ViewTransition when already right at the unpin edge so
              // viewport-fixed snapshots never linger while scrolling up past the section.
              commitPhase("cover", self.isActive && p > 0.015);
            }

            if (phaseRef.current === "split") {
              applyParagraphProgress(p);
            }
          },
        });

        const handleWindowScroll = () => {
          if (performance.now() > transitionGuardUntilRef.current) {
            return;
          }
          if (
            !isPinActiveRef.current ||
            window.scrollY <= st.start + 2 ||
            window.scrollY >= st.end - 2
          ) {
            skipActiveViewTransition();
          }
        };

        window.addEventListener("scroll", handleWindowScroll, {
          passive: true,
        });

        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        return () => {
          window.removeEventListener("scroll", handleWindowScroll);
          skipActiveViewTransition();
          st.kill();
          delete root.dataset.enhanced;
          delete root.dataset.pinning;
          isPinActiveRef.current = false;
          phaseRef.current = "cover";
          setIsEnhanced(false);
          setPhase("cover");
          ScrollTrigger.refresh();
        };
      },
    );

    return () => media.revert();
  }, [applyParagraphProgress, measureParagraphTrack]);

  function renderCtaButtons(variant: "cover" | "split" | "static") {
    return (
      <div
        className={`founders-ctas founders-ctas--${variant}`}
        data-founders-ctas={variant}
      >
        <Link
          className="founders-cta-primary press-scale"
          href={localizeHref("/about")}
        >
          {HOME_FOUNDERS_COPY.primaryCta[language]}
        </Link>
        <Link
          className="founders-cta-secondary press-scale"
          href={localizeHref("/almarise")}
        >
          {HOME_FOUNDERS_COPY.secondaryCta[language]}
        </Link>
      </div>
    );
  }

  function renderPortrait(variant: "cover" | "split" | "static") {
    return (
      <figure
        className={`founders-portrait founders-portrait--${variant}`}
        data-founders-portrait={variant}
      >
        <Image
          src={HOME_FOUNDERS_COPY.imageSrc}
          alt={HOME_FOUNDERS_COPY.imageAlt[language]}
          fill
          sizes="100vw"
          loading="eager"
          decoding="sync"
          className="founders-portrait-img object-cover object-[50%_18%]"
        />
      </figure>
    );
  }

  return (
    <section
      className="founders"
      id="company-story"
      ref={rootRef}
      aria-label={HOME_FOUNDERS_COPY.heading[language]}
    >
      <div
        className="founders-stage-pin"
        ref={pinRef}
        data-phase={isEnhanced ? phase : "static"}
      >
        {isEnhanced ? (
          <div className="founders-stage-grid" data-phase={phase}>
            {phase === "cover" ? (
              <ViewTransition
                key="cover-portrait"
                name="founders-portrait"
                share={PORTRAIT_SHARE}
                default="none"
              >
                {renderPortrait("cover")}
              </ViewTransition>
            ) : null}

            {phase === "cover" ? (
              <ViewTransition
                key="cover-chrome"
                enter={COVER_ENTER}
                exit={COVER_EXIT}
                default="none"
              >
                <div className="founders-cover-chrome">
                  <div className="founders-cover-center">
                    <h2 className="founders-cover-heading">
                      {HOME_FOUNDERS_COPY.heading[language]}
                    </h2>
                    <p className="founders-cover-summary">
                      {HOME_FOUNDERS_COPY.coverSummary[language]}
                    </p>
                  </div>
                </div>
              </ViewTransition>
            ) : null}

            {phase === "cover" ? (
              <ViewTransition
                key="cover-ctas"
                name="founders-ctas"
                share={CTAS_SHARE}
                default="none"
              >
                {renderCtaButtons("cover")}
              </ViewTransition>
            ) : null}

            {phase === "split" ? (
              <ViewTransition
                key="split-portrait"
                name="founders-portrait"
                share={PORTRAIT_SHARE}
                default="none"
              >
                {renderPortrait("split")}
              </ViewTransition>
            ) : null}

            {phase === "split" ? (
              <ViewTransition
                key="split-ctas"
                name="founders-ctas"
                share={CTAS_SHARE}
                default="none"
              >
                {renderCtaButtons("split")}
              </ViewTransition>
            ) : null}

            {phase === "split" ? (
              <ViewTransition
                key="split-story"
                enter={STORY_ENTER}
                exit={STORY_EXIT}
                default="none"
              >
                <div className="founders-split-right">
                  <h2 className="sr-only">
                    {HOME_FOUNDERS_COPY.heading[language]}
                  </h2>
                  <div className="founders-reader-viewport" ref={viewportRef}>
                    <div className="founders-reader-track" ref={trackRef}>
                      {HOME_PROOF_ITEMS.map((proof, index) => (
                        <article
                          key={proof.id}
                          className="founders-beat"
                          data-founder-beat={index}
                        >
                          <h3 className="founders-beat-heading">
                            {proof.value[language]}
                          </h3>
                          <p className="founders-beat-detail">
                            {proof.detail[language]}
                          </p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              </ViewTransition>
            ) : null}
          </div>
        ) : (
          <div className="founders-fallback container">
            <div className="founders-fallback-hero">
              {renderPortrait("static")}
              <div className="founders-fallback-hero-content">
                <h2 className="founders-fallback-heading">
                  {HOME_FOUNDERS_COPY.heading[language]}
                </h2>
                <p className="founders-fallback-summary">
                  {HOME_FOUNDERS_COPY.coverSummary[language]}
                </p>
                {renderCtaButtons("static")}
              </div>
            </div>

            <div className="founders-fallback-beats">
              {HOME_PROOF_ITEMS.map((proof) => (
                <article key={proof.id} className="founders-fallback-beat">
                  <h3 className="founders-beat-heading">
                    {proof.value[language]}
                  </h3>
                  <p className="founders-beat-detail">
                    {proof.detail[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
      <SectionBridge
        from="dune"
        to="forest-deep"
        size="gentle"
        className="founders-fallback-bridge"
      />
    </section>
  );
}
