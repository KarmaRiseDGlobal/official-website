"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/context/language-context";
import { MANUFACTURING_STAGES } from "@/data/manufacturing-content";

const WAVE_WIDTH = 1200;
const WAVE_HEIGHT = 280;

// Smooth sinusoidal wave passing through the exact center of all 6 staggered milestone nodes.
const WAVE_PATH =
  "M 0 160 C 35 160, 55 175, 90 175 C 168 175, 216 85, 294 85 C 372 85, 420 185, 498 185 C 576 185, 624 85, 702 85 C 780 85, 828 175, 906 175 C 984 175, 1032 95, 1110 95 C 1148 95, 1172 110, 1200 110";

const stages = MANUFACTURING_STAGES;

function StageIcon({ id }: { id: string }) {
  switch (id) {
    case "product-brief":
      return (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
        >
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      );
    case "product-study-match":
      return (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
        >
          <path d="M3 10.5L12 4l9 6.5" />
          <path d="M5 9.5V20h14V9.5" />
          <circle cx="12" cy="14" r="2.2" />
          <path d="M12 16.2V20" />
        </svg>
      );
    case "sample-approval":
      return (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
        >
          <rect height="16" rx="1.5" width="16" x="4" y="4" />
          <path d="M8.5 12.2l2.4 2.4 4.8-5.1" />
        </svg>
      );
    case "materials-contracts":
      return (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
        >
          <path d="M12 3l7 3v5.5c0 4.6-3 7.9-7 9.5-4-1.6-7-4.9-7-9.5V6l7-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "production":
      return (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
        >
          <path d="M19 5L8.5 15.5" />
          <circle cx="19" cy="5" r="1.5" />
          <path d="M4 19c2.5-2.5 5.5-2.5 8 0s5.5 2.5 8 0" />
        </svg>
      );
    default:
      return (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.6"
          viewBox="0 0 24 24"
        >
          <path d="M3.5 8.5L12 4l8.5 4.5-8.5 4.5z" />
          <path d="M3.5 8.5V16L12 20.5 20.5 16V8.5" />
          <path d="M12 13v7.5" />
        </svg>
      );
  }
}

interface NetworkInformationLike {
  saveData?: boolean;
}

function isSaveDataEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
  };
  return nav.connection?.saveData === true;
}

const DESKTOP_WAVE_QUERY =
  "(min-width: 64rem) and (hover: hover) and (pointer: fine)";

function findLengthAtX(path: SVGPathElement, targetX: number): number {
  const total = path.getTotalLength();
  let low = 0;
  let high = total;
  for (let i = 0; i < 18; i += 1) {
    const mid = (low + high) * 0.5;
    const pt = path.getPointAtLength(mid);
    if (pt.x < targetX) {
      low = mid;
    } else {
      high = mid;
    }
  }
  return (low + high) * 0.5;
}

export function PhaseJourney() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const rootRef = useRef<HTMLElement>(null);
  const waveTriggerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const leadDotRef = useRef<SVGCircleElement>(null);
  const leadHaloRef = useRef<SVGCircleElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const nodeScrollFractionsRef = useRef<number[]>([0, 0.2, 0.4, 0.6, 0.8, 1]);
  const setWaveProgressRef = useRef<((progress: number) => void) | null>(null);

  const [activeIndex, setActiveIndex] = useState(0);
  const [canLoadVideos, setCanLoadVideos] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const desktopQuery = window.matchMedia(DESKTOP_WAVE_QUERY);
    let nearViewport = false;

    const syncCanLoad = () => {
      if (desktopQuery.matches && nearViewport && !isSaveDataEnabled()) {
        setCanLoadVideos(true);
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          nearViewport = true;
          syncCanLoad();
          observer.disconnect();
        }
      },
      { rootMargin: "650px 0px" },
    );

    observer.observe(root);
    desktopQuery.addEventListener("change", syncCanLoad);

    return () => {
      observer.disconnect();
      desktopQuery.removeEventListener("change", syncCanLoad);
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const desktopQuery = window.matchMedia(DESKTOP_WAVE_QUERY);
    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const fallbackVideos = Array.from(
      root.querySelectorAll<HTMLVideoElement>("[data-fallback-journey-video]"),
    );

    if (fallbackVideos.length === 0) return;

    let observer: IntersectionObserver | null = null;

    const pauseAll = () => {
      fallbackVideos.forEach((video) => video.pause());
    };

    const syncFallbackVideos = () => {
      observer?.disconnect();
      observer = null;

      if (
        desktopQuery.matches ||
        reducedMotionQuery.matches ||
        isSaveDataEnabled()
      ) {
        pauseAll();
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
              const videoSrc = video.dataset.src;
              if (videoSrc && !video.getAttribute("src")) {
                video.src = videoSrc;
              }
              void video.play().catch(() => undefined);
            } else {
              video.pause();
            }
          });
        },
        { rootMargin: "120px 0px", threshold: 0.25 },
      );

      fallbackVideos.forEach((video) => observer?.observe(video));
    };

    syncFallbackVideos();
    desktopQuery.addEventListener("change", syncFallbackVideos);
    reducedMotionQuery.addEventListener("change", syncFallbackVideos);

    return () => {
      observer?.disconnect();
      desktopQuery.removeEventListener("change", syncFallbackVideos);
      reducedMotionQuery.removeEventListener("change", syncFallbackVideos);
      pauseAll();
    };
  }, []);

  useEffect(() => {
    if (!canLoadVideos) return;
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>("[data-journey-video]"),
    );

    videos.forEach((video, idx) => {
      if (!reducedMotion && !isSaveDataEnabled() && idx === activeIndex) {
        if (
          video.readyState === 0 &&
          video.networkState !== HTMLMediaElement.NETWORK_LOADING &&
          video.getAttribute("src")
        ) {
          video.load();
        }
        void video.play().catch(() => undefined);
      } else {
        video.pause();
      }
    });
  }, [activeIndex, canLoadVideos]);

  useEffect(() => {
    const waveTrigger = waveTriggerRef.current;
    const pin = pinRef.current;
    const progressPath = progressPathRef.current;
    if (!waveTrigger || !pin || !progressPath) return;

    const videos = Array.from(
      waveTrigger.querySelectorAll<HTMLVideoElement>("[data-journey-video]"),
    );

    const playOnlyVideo = (index: number) => {
      if (isSaveDataEnabled()) return;
      videos.forEach((video, idx) => {
        if (idx === index) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      });
    };

    const totalLen = progressPath.getTotalLength();
    const nodeLengths = stages.map((stage) =>
      findLengthAtX(progressPath, stage.x),
    );
    const firstLen = nodeLengths[0] ?? 0;
    const lastLen = nodeLengths[nodeLengths.length - 1] ?? totalLen;
    const spanLen = Math.max(1, lastLen - firstLen);

    nodeScrollFractionsRef.current = nodeLengths.map((len) =>
      Math.max(0, Math.min(1, (len - firstLen) / spanLen)),
    );

    const setWaveAtScrollProgress = (scrollProgress: number) => {
      const clamped = Math.max(0, Math.min(1, scrollProgress));
      const currentLen = firstLen + (totalLen - firstLen) * clamped;
      progressPath.style.strokeDasharray = `${totalLen}`;
      progressPath.style.strokeDashoffset = `${Math.max(0, totalLen - currentLen)}`;

      if (progressBarRef.current) {
        const scale = Math.max(0.06, clamped);
        progressBarRef.current.style.transform = `scaleX(${scale.toFixed(4)})`;
      }

      const tip = progressPath.getPointAtLength(
        Math.max(0, Math.min(totalLen, currentLen)),
      );
      if (leadDotRef.current) {
        leadDotRef.current.setAttribute("cx", tip.x.toFixed(1));
        leadDotRef.current.setAttribute("cy", tip.y.toFixed(1));
      }
      if (leadHaloRef.current) {
        leadHaloRef.current.setAttribute("cx", tip.x.toFixed(1));
        leadHaloRef.current.setAttribute("cy", tip.y.toFixed(1));
      }

      let nextIdx = 0;
      for (let i = 0; i < nodeLengths.length; i += 1) {
        if (currentLen >= (nodeLengths[i] ?? 0) - 24) {
          nextIdx = i;
        }
      }
      return nextIdx;
    };

    setWaveProgressRef.current = (progress: number) => {
      setWaveAtScrollProgress(progress);
    };
    setWaveAtScrollProgress(0);

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      {
        desktop: DESKTOP_WAVE_QUERY,
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, reducedMotion } = context.conditions ?? {};

        if (!desktop || reducedMotion) {
          triggerRef.current = null;
          videos.forEach((v) => v.pause());
          return;
        }

        let currentActive = 0;
        setActiveIndex(0);
        setWaveAtScrollProgress(0);
        playOnlyVideo(0);

        const st = ScrollTrigger.create({
          trigger: waveTrigger,
          pin,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 3.8, 2700)}`,
          scrub: 0.25,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const nextIdx = setWaveAtScrollProgress(self.progress);
            if (nextIdx !== currentActive) {
              currentActive = nextIdx;
              setActiveIndex(nextIdx);
              playOnlyVideo(nextIdx);
            }
          },
        });

        triggerRef.current = st;

        return () => {
          triggerRef.current = null;
          st.kill();
          videos.forEach((v) => v.pause());
        };
      },
    );

    return () => {
      media.revert();
      videos.forEach((v) => v.pause());
    };
  }, []);

  const handleSelectStage = (index: number) => {
    const st = triggerRef.current;
    const frac =
      nodeScrollFractionsRef.current[index] ?? index / (stages.length - 1);
    const targetProgress = Math.min(
      0.96,
      frac * 0.92 + (index === 0 ? 0 : 0.015),
    );
    if (st) {
      const targetY = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: targetY, behavior: "smooth" });
      return;
    }
    setActiveIndex(index);
    setWaveProgressRef.current?.(
      index === stages.length - 1 ? 1 : targetProgress,
    );
  };

  const activeStage = stages[activeIndex] ?? stages[0]!;

  return (
    <section
      aria-labelledby="process-heading"
      className="relative bg-[var(--color-night)] text-[var(--color-paper)]"
      id="process"
      ref={rootRef}
    >
      {/* Single semantic section header shared across desktop and mobile */}
      <div className="container grid gap-5 pt-[var(--section-gap-s)] pb-10 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
        <div className="grid gap-3 lg:col-span-7">
          <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-eyebrow)] text-[var(--color-gold)] uppercase">
            {isEs ? "Proceso en seis fases" : "Six-stage process"}
          </p>
          <h2
            className="m-0 max-w-[20ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-s)] leading-[1.04] font-normal text-[var(--color-paper)]"
            id="process-heading"
          >
            {isEs
              ? "Seis fases desde tu primer boceto hasta las cajas en la puerta de tu negocio"
              : "Six stages from your first sketch to boxes at your business door"}
          </h2>
        </div>
        <p className="m-0 max-w-[46ch] text-[length:var(--text-md)] leading-[1.65] text-[var(--color-paper-2)] lg:col-span-5">
          {isEs
            ? "Crear tu propia colección con KarmaRise D Global es ofrecer moda a medida en lugar de comprar a un mayorista. Sigues cada decisión, conoces en videollamada en directo a quienes elaboran tus piezas y apruebas por escrito cada fase antes de pasar a la siguiente."
            : "Building your own collection with KarmaRise D Global is closer to offering tailor-made fashion than pulling ready-made stock from a wholesaler. You stay close to every decision, meet the makers on live video calls, and sign off each stage in writing before the next begins."}
        </p>
      </div>

      {/* Desktop Pinned Full-Bleed Scroll-Scrubbed Wave */}
      <div
        className="relative hidden [@media(min-width:64rem)_and_(hover:hover)_and_(pointer:fine)]:block"
        ref={waveTriggerRef}
      >
        <div
          className="relative flex min-h-[100svh] flex-col justify-between overflow-clip"
          ref={pinRef}
        >
          {/* Cross-fading full-bleed workshop video backdrop */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[var(--z-base)]"
          >
            {stages.map((stage, index) => {
              const shouldAttachVideo =
                canLoadVideos && Math.abs(index - activeIndex) <= 1;
              return (
                <video
                  aria-label={stage.videoLabel[language]}
                  className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-out)] ${
                    index === activeIndex ? "opacity-45" : "opacity-0"
                  }`}
                  data-journey-video
                  key={stage.id}
                  loop
                  muted
                  playsInline
                  poster={stage.poster}
                  preload={
                    shouldAttachVideo && index === activeIndex
                      ? "metadata"
                      : "none"
                  }
                  src={shouldAttachVideo ? stage.video : undefined}
                />
              );
            })}

            {/* Deep atmospheric forest-night gradient scrim */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, color-mix(in srgb, var(--color-night) 92%, transparent) 0%, color-mix(in srgb, var(--color-forest-deep) 68%, transparent) 48%, color-mix(in srgb, var(--color-night) 94%, transparent) 100%)",
              }}
            />
          </div>

          {/* Quiet Top Progress Indicator */}
          <div className="relative z-[var(--z-raised)] container flex items-center justify-between pt-[calc(var(--nav-height)+var(--space-md))]">
            <p className="num m-0 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-eyebrow)] text-[var(--color-gold)] uppercase">
              {isEs
                ? `Fase ${activeStage.stepNumber} de 06`
                : `Stage ${activeStage.stepNumber} of 06`}
            </p>
            <p className="m-0 text-[length:var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-paper-2)]/80 uppercase">
              {isEs
                ? "Desplázate o haz clic en cada fase"
                : "Scroll or select any stage"}
            </p>
          </div>

          {/* Centerpiece: Sinusoidal SVG Wave + 6 Staggered Milestone Nodes */}
          <div className="relative z-[var(--z-raised)] container my-auto py-6">
            <div className="relative mx-auto aspect-[1200/280] w-full max-w-[1280px]">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                viewBox={`0 0 ${WAVE_WIDTH} ${WAVE_HEIGHT}`}
              >
                <defs>
                  <linearGradient
                    id="karmariseWaveGrad"
                    x1="0%"
                    x2="100%"
                    y1="0%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="var(--color-clay)" />
                    <stop offset="50%" stopColor="var(--color-gold)" />
                    <stop offset="100%" stopColor="var(--color-pale-sage)" />
                  </linearGradient>
                </defs>

                <path
                  d={WAVE_PATH}
                  fill="none"
                  stroke="var(--color-paper)"
                  strokeOpacity="0.22"
                  strokeDasharray="4 6"
                  strokeWidth="1.75"
                />

                <path
                  d={WAVE_PATH}
                  fill="none"
                  ref={progressPathRef}
                  stroke="url(#karmariseWaveGrad)"
                  strokeLinecap="round"
                  strokeWidth="3"
                />

                <circle
                  cx={stages[0]!.x}
                  cy={stages[0]!.y}
                  fill="var(--color-gold)"
                  fillOpacity="0.26"
                  r="13"
                  ref={leadHaloRef}
                />
                <circle
                  cx={stages[0]!.x}
                  cy={stages[0]!.y}
                  fill="var(--color-paper)"
                  r="4.5"
                  ref={leadDotRef}
                />
              </svg>

              {/* 6 Interactive Nodes */}
              {stages.map((stage, index) => {
                const isActive = index === activeIndex;
                const isCompleted = index < activeIndex;
                const leftPct = (stage.x / WAVE_WIDTH) * 100;
                const topPct = (stage.y / WAVE_HEIGHT) * 100;

                return (
                  <div
                    className="pointer-events-none absolute flex w-36 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
                    key={stage.id}
                    style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                  >
                    <button
                      aria-current={isActive ? "step" : undefined}
                      aria-label={`${stage.stepNumber}. ${stage.title[language]}`}
                      className={`peer pointer-events-auto relative grid h-14 w-14 cursor-pointer place-items-center rounded-full border backdrop-blur-md transition-all duration-[var(--dur-short)] ease-[var(--ease-out)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] ${
                        isActive
                          ? "scale-110 border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-night)] ring-4 ring-[var(--color-gold)]/25"
                          : isCompleted
                            ? "border-[var(--color-gold)]/70 bg-[var(--color-forest-deep)]/90 text-[var(--color-gold)]"
                            : "border-[var(--color-paper)]/28 bg-[var(--color-night)]/82 text-[var(--color-paper)]/60 hover:border-[var(--color-paper)]/65 hover:text-[var(--color-paper)]"
                      }`}
                      onClick={() => handleSelectStage(index)}
                      type="button"
                    >
                      <StageIcon id={stage.id} />
                    </button>

                    <span
                      aria-hidden="true"
                      className={`pointer-events-none absolute inset-x-0 font-[family-name:var(--font-display)] text-[length:var(--text-md)] leading-[1.15] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] ${
                        stage.labelPosition === "above"
                          ? "bottom-[calc(100%+var(--space-md))]"
                          : "top-[calc(100%+var(--space-md))]"
                      } ${
                        isActive
                          ? "text-[var(--color-paper)]"
                          : isCompleted
                            ? "text-[var(--color-paper)]/82"
                            : "text-[var(--color-paper)]/52 peer-hover:text-[var(--color-paper)]/88"
                      }`}
                    >
                      {stage.shortLabel[language]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Stage Readout Bar */}
          <div className="relative z-[var(--z-raised)] border-t border-[var(--color-paper)]/15 bg-[var(--color-night)]/76 backdrop-blur-md">
            <div className="container grid gap-5 py-7 lg:grid-cols-12 lg:items-center lg:gap-[var(--gap-columns)] lg:pr-44">
              <p className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.16] font-normal text-[var(--color-paper)] md:text-[length:var(--text-2xl)] lg:col-span-5">
                {activeStage.title[language]}
              </p>

              <p className="m-0 max-w-[56ch] text-[length:var(--text-md)] leading-[1.68] text-[var(--color-paper-2)] lg:col-span-7">
                {activeStage.body[language]}
              </p>
            </div>

            <div
              aria-hidden="true"
              className="h-[var(--space-3xs)] w-full overflow-hidden bg-[var(--color-paper)]/10"
            >
              <div
                className="h-full w-full origin-left bg-[var(--color-gold)] will-change-transform"
                ref={progressBarRef}
                style={{ transform: "scaleX(0.06)" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Always-visible semantic 6-stage ordered list (cards with video on touch/compact; crisp 3x2 summary grid on desktop) */}
      <div
        className="py-[var(--section-gap-s)]"
        style={{
          background:
            "linear-gradient(180deg, var(--color-night) 0%, var(--color-forest-deep) 6%, var(--color-forest-deep) 94%, var(--color-night) 100%)",
        }}
      >
        <div className="container grid gap-8">
          <div className="hidden items-center justify-between border-b border-[var(--color-paper)]/15 pb-4 [@media(min-width:64rem)_and_(hover:hover)_and_(pointer:fine)]:flex">
            <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-eyebrow)] text-[var(--color-gold)] uppercase">
              {isEs
                ? "Resumen completo de las seis fases"
                : "All six stages at a glance"}
            </p>
            <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-paper-2)]/75">
              {isEs
                ? "Cada fase deja acuerdos claros por escrito antes de pasar a la siguiente."
                : "Each stage closes with written confirmation before the next begins."}
            </p>
          </div>

          <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 lg:grid-cols-3">
            {stages.map((stage) => (
              <li
                className="flex flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-paper)]/15 bg-[var(--color-night)]/62 p-5"
                id={`stage-${stage.id}`}
                key={stage.id}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[var(--radius-input)] bg-[var(--color-night)] [@media(min-width:64rem)_and_(hover:hover)_and_(pointer:fine)]:hidden">
                  <video
                    aria-label={stage.videoLabel[language]}
                    className="h-full w-full object-cover"
                    data-fallback-journey-video
                    data-src={stage.video}
                    loop
                    muted
                    playsInline
                    poster={stage.poster}
                    preload="none"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[var(--color-night)]/55 via-transparent to-transparent"
                  />
                </div>

                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[var(--color-gold)]/75 bg-[var(--color-night)] text-[var(--color-gold)]">
                      <StageIcon id={stage.id} />
                    </span>
                    <span className="num text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-gold)] uppercase">
                      {stage.stepNumber} · {stage.shortLabel[language]}
                    </span>
                  </div>

                  <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.18] font-normal text-[var(--color-paper)]">
                    {stage.title[language]}
                  </h3>

                  <p className="m-0 text-[length:var(--text-sm)] leading-[1.68] text-[var(--color-paper-2)]">
                    {stage.body[language]}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
