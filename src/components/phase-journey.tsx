"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

import { useLanguage, type SiteLanguage } from "@/context/language-context";

interface JourneyStage {
  id: string;
  shortLabel: Record<SiteLanguage, string>;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
  video: string;
  poster: string;
  videoLabel: Record<SiteLanguage, string>;
  x: number;
  y: number;
  labelPosition: "above" | "below";
}

const WAVE_WIDTH = 1200;
const WAVE_HEIGHT = 280;

// Smooth sinusoidal wave passing through the exact center of all 5 staggered milestone nodes.
const WAVE_PATH =
  "M 0 155 C 45 155, 65 175, 110 175 C 210 175, 255 85, 355 85 C 455 85, 500 185, 600 185 C 700 185, 745 85, 845 85 C 945 85, 990 175, 1090 175 C 1135 175, 1155 155, 1200 155";

const stages: ReadonlyArray<JourneyStage> = [
  {
    id: "product-brief",
    shortLabel: {
      en: "Product Brief",
      es: "Product Brief",
    },
    title: {
      en: "The Product Brief",
      es: "El Product Brief",
    },
    body: {
      en: "We sit down with your idea, reference piece, or sketches and put materials, quantities, and dates in writing.",
      es: "Partimos de tu idea, una prenda de referencia o unos bocetos, y dejamos por escrito materiales, cantidades y fechas.",
    },
    video:
      "/media (ai generated)/People_working_at_wooden_table_a667bec6_1080p.mp4",
    poster: "/media/posters/wooden-table.jpg",
    videoLabel: {
      en: "Overhead view of hands reviewing patterns, leather hides, and fabric swatches at a wooden table for a Product Brief",
      es: "Vista cenital de manos revisando patrones, pieles y muestras de tejido en una mesa de madera para un Product Brief",
    },
    x: 110,
    y: 175,
    labelPosition: "below",
  },
  {
    id: "workshop-match",
    shortLabel: {
      en: "Workshop",
      es: "Taller",
    },
    title: {
      en: "Choosing the workshop",
      es: "Elegir el taller",
    },
    body: {
      en: "We walk the floor across India in person to find a Manufacturing Partner with the right machines and room on the line.",
      es: "Visitamos talleres en persona por toda la India hasta dar con el que tiene la maquinaria y la capacidad que pide tu producto.",
    },
    video: "/phases/phases (1).mp4",
    poster: "/media/posters/phase-1.jpg",
    videoLabel: {
      en: "Alma reviewing product specifications and matching designs to a specialist workshop in India",
      es: "Alma revisando especificaciones de producto y seleccionando el taller adecuado en la India",
    },
    x: 355,
    y: 85,
    labelPosition: "above",
  },
  {
    id: "sample-approval",
    shortLabel: {
      en: "Sample",
      es: "Muestra",
    },
    title: {
      en: "The sample in your hands",
      es: "La muestra en tus manos",
    },
    body: {
      en: "You check the cut, stitching, hide or cloth, and hardware yourself. Nothing moves to bulk until you sign it off.",
      es: "Pruebas el corte, las costuras, la piel o el tejido y los herrajes. No se corta nada en serie hasta que das el visto bueno.",
    },
    video: "/phases/phases (2).mp4",
    poster: "/media/posters/phase-2.jpg",
    videoLabel: {
      en: "Shirish inspecting sample stitching and construction at a workshop table in India",
      es: "Shirish revisando costuras y acabados de una muestra en la mesa de un taller en la India",
    },
    x: 600,
    y: 185,
    labelPosition: "below",
  },
  {
    id: "production",
    shortLabel: {
      en: "Production",
      es: "Producción",
    },
    title: {
      en: "On the workshop floor",
      es: "A pie de taller",
    },
    body: {
      en: "While the Bulk Order runs, we stay on site checking dye batches, seams, and finishes against your approved sample.",
      es: "Mientras avanza el pedido, revisamos en planta tintadas, costuras y remates comparándolos con la muestra aprobada.",
    },
    video: "/phases/phases (3).mp4",
    poster: "/media/posters/phase-3.jpg",
    videoLabel: {
      en: "Craftsman stitching a leather strap on an industrial machine during bulk production in India",
      es: "Artesano cosiendo una correa de piel en máquina industrial durante la producción en la India",
    },
    x: 845,
    y: 85,
    labelPosition: "above",
  },
  {
    id: "bulk-delivery",
    shortLabel: {
      en: "Delivery",
      es: "Entrega",
    },
    title: {
      en: "Before it leaves India",
      es: "Antes de salir de la India",
    },
    body: {
      en: "We check finished pieces, labels, export cartons, and paperwork in person before the order ships to Spain or Europe.",
      es: "Revisamos en persona las piezas terminadas, el etiquetado, las cajas y los papeles de exportación antes del envío a España o Europa.",
    },
    video: "/phases/phases (4).mp4",
    poster: "/media/posters/phase-4.jpg",
    videoLabel: {
      en: "Finished pieces inspected and stacked for export packing in India",
      es: "Piezas terminadas revisadas y preparadas para el embalaje de exportación en la India",
    },
    x: 1090,
    y: 175,
    labelPosition: "below",
  },
];

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
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6" />
          <path d="M9 17h4" />
        </svg>
      );
    case "workshop-match":
      return (
        <svg
          aria-hidden="true"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
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
          strokeWidth="1.5"
          viewBox="0 0 24 24"
        >
          <rect height="16" rx="1.5" width="16" x="4" y="4" />
          <path d="M8.5 12.2l2.4 2.4 4.8-5.1" />
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
          strokeWidth="1.5"
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
          strokeWidth="1.5"
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
  "(min-width: 80rem) and (hover: hover) and (pointer: fine)";

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
  const pinRef = useRef<HTMLDivElement>(null);
  const progressPathRef = useRef<SVGPathElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const leadDotRef = useRef<SVGCircleElement>(null);
  const leadHaloRef = useRef<SVGCircleElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const nodeScrollFractionsRef = useRef<number[]>([0, 0.25, 0.5, 0.75, 1]);
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
    const root = rootRef.current;
    const pin = pinRef.current;
    const progressPath = progressPathRef.current;
    if (!root || !pin || !progressPath) return;

    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>("[data-journey-video]"),
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
          trigger: root,
          pin,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 3.4, 2400)}`,
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
      aria-label={
        isEs
          ? "Del Product Brief a la entrega del pedido"
          : "From Product Brief to Bulk Order delivery"
      }
      className="relative bg-[var(--color-night)] text-[var(--color-paper)]"
      id="phases"
      ref={rootRef}
    >
      {/* Desktop Pinned Full-Bleed Scroll-Scrubbed Wave */}
      <div
        className="relative hidden min-h-[100svh] overflow-clip [@media(min-width:80rem)_and_(hover:hover)_and_(pointer:fine)]:flex [@media(min-width:80rem)_and_(hover:hover)_and_(pointer:fine)]:flex-col [@media(min-width:80rem)_and_(hover:hover)_and_(pointer:fine)]:justify-between"
        ref={pinRef}
      >
        {/* Cross-fading full-bleed workshop video backdrop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0"
        >
          {stages.map((stage, index) => {
            const shouldAttachVideo =
              canLoadVideos && Math.abs(index - activeIndex) <= 1;
            return (
              <video
                aria-label={stage.videoLabel[language]}
                className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-out ${
                  stage.id === "product-brief" ? "scale-[1.34]" : ""
                } ${index === activeIndex ? "opacity-48" : "opacity-0"}`}
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
                "linear-gradient(180deg, rgba(17,25,20,0.9) 0%, rgba(24,45,32,0.68) 48%, rgba(17,25,20,0.94) 100%)",
            }}
          />
        </div>

        {/* Quiet Top Heading */}
        <div className="relative z-10 container pt-[calc(var(--nav-height)+var(--space-lg))]">
          <h2 className="m-0 max-w-[20ch] font-[family-name:var(--font-display)] text-[clamp(2rem,3.2vw,3.25rem)] leading-[1.04] font-normal text-[var(--color-paper)]">
            {isEs
              ? "Del Product Brief al pedido"
              : "From Product Brief to Bulk Order"}
          </h2>
        </div>

        {/* Centerpiece: Sinusoidal SVG Wave + 5 Staggered Milestone Nodes */}
        <div className="relative z-10 container my-auto py-6">
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
                  <stop offset="0%" stopColor="#bd7057" />
                  <stop offset="50%" stopColor="#b99a58" />
                  <stop offset="100%" stopColor="#d9dfd3" />
                </linearGradient>
              </defs>

              <path
                d={WAVE_PATH}
                fill="none"
                stroke="rgba(242, 236, 223, 0.22)"
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
                fill="rgba(185, 154, 88, 0.26)"
                r="13"
                ref={leadHaloRef}
              />
              <circle
                cx={stages[0]!.x}
                cy={stages[0]!.y}
                fill="#f2ecdf"
                r="4.5"
                ref={leadDotRef}
              />
            </svg>

            {/* 5 Interactive Nodes — Icon + Clean Label (zero duplicate numbers) */}
            {stages.map((stage, index) => {
              const isActive = index === activeIndex;
              const isCompleted = index < activeIndex;
              const leftPct = (stage.x / WAVE_WIDTH) * 100;
              const topPct = (stage.y / WAVE_HEIGHT) * 100;

              return (
                <div
                  className="pointer-events-none absolute flex w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
                  key={stage.id}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                >
                  <button
                    aria-current={isActive ? "step" : undefined}
                    aria-label={stage.title[language]}
                    className={`peer pointer-events-auto relative grid h-14 w-14 cursor-pointer place-items-center rounded-full border backdrop-blur-md transition-all duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] ${
                      isActive
                        ? "scale-110 border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-night)] shadow-[0_0_0_8px_rgba(185,154,88,0.18)]"
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
                    className={`pointer-events-none absolute inset-x-0 font-[family-name:var(--font-display)] text-[1.1rem] leading-[1.15] transition-colors duration-300 ${
                      stage.labelPosition === "above"
                        ? "bottom-[calc(100%+18px)]"
                        : "top-[calc(100%+18px)]"
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

        {/* Calm, Single-Sentence Active Readout Bar */}
        <div className="relative z-10 border-t border-[var(--color-paper)]/15 bg-[var(--color-night)]/76 backdrop-blur-md">
          <div className="container grid gap-5 py-7 xl:grid-cols-12 xl:items-center xl:gap-[var(--gap-columns)] xl:pr-44">
            <h3 className="m-0 font-[family-name:var(--font-display)] text-[clamp(1.45rem,2.1vw,2rem)] leading-[1.14] font-normal text-[var(--color-paper)] xl:col-span-4">
              {activeStage.title[language]}
            </h3>

            <p className="m-0 max-w-[54ch] text-[length:var(--text-md)] leading-[1.68] text-[var(--color-paper-2)] xl:col-span-8">
              {activeStage.body[language]}
            </p>
          </div>

          <div
            aria-hidden="true"
            className="h-[2px] w-full overflow-hidden bg-[var(--color-paper)]/10"
          >
            <div
              className="h-full w-full origin-left bg-[var(--color-gold)] will-change-transform"
              ref={progressBarRef}
              style={{ transform: "scaleX(0.06)" }}
            />
          </div>
        </div>
      </div>

      {/* Touch & Compact Viewport Fallback: Responsive Editorial Timeline Grid */}
      <div
        className="py-[var(--section-gap-s)] [@media(min-width:80rem)_and_(hover:hover)_and_(pointer:fine)]:hidden"
        style={{
          background:
            "linear-gradient(180deg, var(--color-night) 0%, var(--color-forest-deep) 5%, var(--color-forest-deep) 95%, var(--color-night) 100%)",
        }}
      >
        <div className="container grid gap-8 md:gap-10">
          <h2 className="m-0 max-w-[20ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-s)] leading-[1.06] font-normal text-[var(--color-paper)]">
            {isEs
              ? "Del Product Brief al pedido"
              : "From Product Brief to Bulk Order"}
          </h2>

          <ol className="m-0 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-2 md:gap-7">
            {stages.map((stage, index) => {
              const isClosingStage = index === stages.length - 1;
              return (
                <li
                  className={`flex flex-col gap-4 overflow-hidden rounded-[1.25rem] border border-[var(--color-paper)]/15 bg-[var(--color-night)]/58 p-4 sm:p-5 ${
                    isClosingStage
                      ? "md:col-span-2 md:grid md:grid-cols-2 md:items-center md:gap-6"
                      : ""
                  }`}
                  key={stage.id}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-[var(--color-night)]">
                    <video
                      aria-label={stage.videoLabel[language]}
                      className={`h-full w-full object-cover ${
                        stage.id === "product-brief" ? "scale-[1.34]" : ""
                      }`}
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
                      <span className="text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-gold)] uppercase">
                        {stage.shortLabel[language]}
                      </span>
                    </div>

                    <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.15] font-normal text-[var(--color-paper)] sm:text-[length:var(--text-2xl)]">
                      {stage.title[language]}
                    </h3>

                    <p className="m-0 max-w-[46ch] text-[length:var(--text-md)] leading-[1.65] text-[var(--color-paper-2)]">
                      {stage.body[language]}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
