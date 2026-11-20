"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { NewsletterForm } from "@/components/newsletter-form";
import { SectionBridge } from "@/components/section-bridge";
import { StoryMedia } from "@/components/story-media";
import { useLanguage } from "@/context/language-context";
import {
  formatStoryDate,
  getLocalizedCategory,
  getLocalizedStory,
  storyCategories,
  storyCategoryDetails,
  type StoryCategory,
  type StoryEntry,
} from "@/data/stories";

interface StoriesBrowserProps {
  stories: StoryEntry[];
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

function smoothstep(t: number): number {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
}

/**
 * Draws the Sombr ("back to friends" 2:15-2:17) inspired organic watercolor
 * wave rising from the bottom of the viewport on a fixed full-screen canvas.
 * The uncovered upper area remains 100% transparent so the wave washes
 * directly over the upper Hero section with zero box clipping.
 */
function drawWatercolorWave(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  waveProgress: number,
) {
  ctx.clearRect(0, 0, width, height);

  if (waveProgress <= 0.001) {
    return;
  }

  const riseT = smoothstep(clamp(waveProgress, 0, 1));
  const deepT = smoothstep(clamp((waveProgress - 0.14) / 0.86, 0, 1));

  // Fast path: once deep forest covers the entire viewport, single fill
  if (deepT >= 0.995) {
    ctx.fillStyle = "#182d20";
    ctx.fillRect(0, 0, width, height);
    return;
  }

  // 5 layered smooth watercolor pigment fronts rising from bottom (height + 90) past top (-180)
  const layers: ReadonlyArray<{
    color: string;
    alpha: number;
    lead: number;
    lobeAmp: number;
    fingerAmp: number;
    archHeight: number;
    phase: number;
  }> = [
    {
      // 1. Soft pale-sage watercolor capillary wash leading the wave
      color: "#d9dfd3",
      alpha: 0.94,
      lead: clamp(riseT * 1.24, 0, 1.2),
      lobeAmp: 28 * (1 - riseT * 0.4),
      fingerAmp: 18 * (1 - riseT * 0.45),
      archHeight: height * 0.22 * (1 - riseT * 0.5),
      phase: 0.3,
    },
    {
      // 2. Smooth rounded sage viscous plumes
      color: "#788d72",
      alpha: 0.96,
      lead: clamp((riseT - 0.05) * 1.22, 0, 1.18),
      lobeAmp: 34 * (1 - riseT * 0.35),
      fingerAmp: 24 * (1 - riseT * 0.4),
      archHeight: height * 0.2 * (1 - riseT * 0.45),
      phase: 1.1,
    },
    {
      // 3. Rich watercolor forest body
      color: "#35563a",
      alpha: 0.98,
      lead: clamp((riseT - 0.11) * 1.2, 0, 1.16),
      lobeAmp: 26 * (1 - deepT * 0.45),
      fingerAmp: 16 * (1 - deepT * 0.5),
      archHeight: height * 0.18 * (1 - deepT * 0.5),
      phase: 2.0,
    },
    {
      // 4. Lush forest pigment wash
      color: "#29482f",
      alpha: 0.99,
      lead: clamp((riseT - 0.18) * 1.22, 0, 1.15),
      lobeAmp: 20 * (1 - deepT * 0.6),
      fingerAmp: 12 * (1 - deepT * 0.65),
      archHeight: height * 0.15 * (1 - deepT * 0.6),
      phase: 2.9,
    },
    {
      // 5. Deep forest base at the bottom, overtaking the full viewport by waveProgress=1
      color: "#182d20",
      alpha: 1,
      lead: clamp(deepT * 1.18, 0, 1.16),
      lobeAmp: 14 * (1 - deepT * 0.75),
      fingerAmp: 8 * (1 - deepT * 0.8),
      archHeight: height * 0.12 * (1 - deepT * 0.75),
      phase: 3.8,
    },
  ];

  const steps = 240;

  for (const layer of layers) {
    if (layer.lead <= 0.002) continue;

    // Base Y travels from below the bottom of the screen (height + 80) to above the top (-180)
    const centerCrestY = lerp(height + 80, -180, clamp(layer.lead, 0, 1.12));

    ctx.save();
    ctx.globalAlpha = layer.alpha;
    ctx.fillStyle = layer.color;

    ctx.beginPath();
    ctx.moveTo(-20, height + 40);
    ctx.lineTo(-20, centerCrestY + layer.archHeight);

    for (let i = 0; i <= steps; i += 1) {
      const u = i / steps;
      const px = -20 + u * (width + 40);

      // Gentle dome arch higher in the center, sloping softly toward the edges
      const centered = (u - 0.5) * 2;
      const archOffset = centered * centered * layer.archHeight;

      // Smooth rounded multi-octave fluid plumes (10+ points per wave cycle, zero jagged polygon corners)
      const slowWave =
        Math.sin(u * Math.PI * 5 + layer.phase + waveProgress * 1.8) * 0.6 +
        Math.cos(u * Math.PI * 9 - layer.phase * 0.8) * 0.4;
      const roundedFingers = Math.pow(
        0.5 +
          0.5 *
            Math.cos(u * Math.PI * 19 + layer.phase * 1.4 + waveProgress * 2.4),
        0.65,
      );

      const py =
        centerCrestY +
        archOffset +
        slowWave * layer.lobeAmp -
        roundedFingers * layer.fingerAmp;

      ctx.lineTo(px, py);
    }

    ctx.lineTo(width + 20, height + 40);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

export function StoriesBrowser({ stories }: StoriesBrowserProps) {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  const [activeCategory, setActiveCategory] = useState<
    "All Stories" | StoryCategory
  >("All Stories");

  const runwayRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const corridorStageRef = useRef<HTMLDivElement>(null);
  const floatingBtnWrapRef = useRef<HTMLDivElement>(null);
  const progressStrokeRef = useRef<SVGRectElement>(null);
  const settledNewsletterRef = useRef<HTMLDivElement>(null);
  const mobileListTopRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  const filteredStories = useMemo(
    () =>
      activeCategory === "All Stories"
        ? stories
        : stories.filter((story) => story.category === activeCategory),
    [activeCategory, stories],
  );

  const heroStory = useMemo(
    () => stories.find((s) => s.featured) ?? stories[0],
    [stories],
  );
  const heroStoryLocalized = heroStory
    ? getLocalizedStory(heroStory, language)
    : null;

  const activeCategoryLocalized =
    activeCategory === "All Stories"
      ? null
      : getLocalizedCategory(activeCategory, language);

  // Scroll to the settled newsletter state at the end of the corridor and focus the email input
  const scrollToNewsletterAndFocus = useCallback(() => {
    const st = triggerRef.current;
    const focusEmail = () => {
      const rootEl =
        settledNewsletterRef.current ??
        document.getElementById("stories-newsletter");
      const emailInput = rootEl?.querySelector<HTMLInputElement>(
        'input[type="email"]',
      );
      emailInput?.focus({ preventScroll: true });
    };

    if (st && runwayRef.current?.dataset.enhanced === "true") {
      const targetScroll = st.end - 12;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
      window.setTimeout(focusEmail, 700);
      return;
    }

    const fallbackEl = document.getElementById("stories-newsletter-mobile");
    if (fallbackEl) {
      fallbackEl.scrollIntoView({ behavior: "smooth", block: "center" });
      window.setTimeout(focusEmail, 650);
    }
  }, []);

  function selectCategoryAndBrowse(category: "All Stories" | StoryCategory) {
    setActiveCategory(category);

    const st = triggerRef.current;
    if (st && runwayRef.current?.dataset.enhanced === "true") {
      const targetScroll = st.start + (st.end - st.start) * 0.04;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
      return;
    }

    mobileListTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  useEffect(() => {
    const runway = runwayRef.current;
    const pin = pinRef.current;
    const canvas = canvasRef.current;
    const corridorStage = corridorStageRef.current;
    const floatingBtnWrap = floatingBtnWrapRef.current;
    const progressStroke = progressStrokeRef.current;
    const settledNewsletter = settledNewsletterRef.current;

    if (
      !runway ||
      !pin ||
      !canvas ||
      !corridorStage ||
      !floatingBtnWrap ||
      !progressStroke ||
      !settledNewsletter
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add(
      {
        desktop: "(min-width: 80rem) and (hover: hover) and (pointer: fine)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, reducedMotion } = context.conditions ?? {};

        if (!desktop || reducedMotion) {
          delete runway.dataset.enhanced;
          triggerRef.current = null;
          return;
        }

        runway.dataset.enhanced = "true";

        const cards = Array.from(
          corridorStage.querySelectorAll<HTMLElement>("[data-corridor-card]"),
        );

        const count = Math.max(1, cards.length);
        const CORRIDOR_START = 0.02;
        const CORRIDOR_END = 0.74;
        const SETTLE_START = 0.74;
        const SETTLE_END = 0.95;

        const floatingDarkLayer = floatingBtnWrap.querySelector<HTMLElement>(
          "[data-floating-dark-layer]",
        );
        const floatingGoldLayer = floatingBtnWrap.querySelector<HTMLElement>(
          "[data-floating-gold-layer]",
        );
        const targetSubmitBtn = settledNewsletter.querySelector<HTMLElement>(
          "[data-newsletter-submit-btn]",
        );

        let dockMetrics = {
          dx: 280,
          dy: -260,
          w: 128,
          h: 54,
        };
        let lastDrawnWaveP = -1;

        // Snap stops: each story in the corridor + the settled newsletter finale
        const snapStops: number[] = [
          ...Array.from({ length: count }, (_, i) =>
            count === 1
              ? (CORRIDOR_START + CORRIDOR_END) * 0.5
              : CORRIDOR_START +
                (i / (count - 1)) * (CORRIDOR_END - CORRIDOR_START),
          ),
          0.97,
        ];

        const measureDockTarget = () => {
          if (!targetSubmitBtn) return;
          const prevNewsletterTransform = settledNewsletter.style.transform;
          settledNewsletter.style.transform = "translate3d(0, 0px, 0) scale(1)";
          const pinRect = pin.getBoundingClientRect();
          const btnRect = targetSubmitBtn.getBoundingClientRect();
          settledNewsletter.style.transform = prevNewsletterTransform;

          if (btnRect.width > 0 && btnRect.height > 0) {
            const startCenterX = pinRect.width * 0.5;
            const startCenterY = pinRect.height - 26 - 31;
            const targetCenterX =
              btnRect.left - pinRect.left + btnRect.width * 0.5;
            const targetCenterY =
              btnRect.top - pinRect.top + btnRect.height * 0.5;
            dockMetrics = {
              dx: targetCenterX - startCenterX,
              dy: targetCenterY - startCenterY,
              w: btnRect.width,
              h: btnRect.height,
            };
            if (floatingGoldLayer) {
              floatingGoldLayer.style.width = `${btnRect.width.toFixed(1)}px`;
              floatingGoldLayer.style.height = `${btnRect.height.toFixed(1)}px`;
            }
          }
        };

        const renderWave = (waveP: number) => {
          if (
            Math.abs(waveP - lastDrawnWaveP) <= 0.0015 &&
            lastDrawnWaveP >= 0
          ) {
            return;
          }
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            drawWatercolorWave(
              ctx,
              window.innerWidth,
              window.innerHeight,
              waveP,
            );
            lastDrawnWaveP = waveP;
          }
        };

        const syncCanvasSize = () => {
          const dpr = Math.min(window.devicePixelRatio || 1, 2);
          const w = window.innerWidth;
          const h = window.innerHeight;
          const targetW = Math.round(w * dpr);
          const targetH = Math.round(h * dpr);
          if (canvas.width !== targetW || canvas.height !== targetH) {
            canvas.width = targetW;
            canvas.height = targetH;
          }
          measureDockTarget();
          lastDrawnWaveP = -1;
          const pinnedP = triggerRef.current?.progress ?? 0;
          if (pinnedP > 0) {
            renderWave(1);
          } else {
            const rect = runway.getBoundingClientRect();
            const preT = clamp(1 - rect.top / h, 0, 1);
            renderWave(preT);
          }
        };

        const renderFrame = (p: number) => {
          // Once pinned (p >= 0), the rising wave has covered the viewport (waveP = 1)
          renderWave(1);

          const settleT = smoothstep(
            clamp((p - SETTLE_START) / (SETTLE_END - SETTLE_START), 0, 1),
          );
          const corridorVisibility =
            1 - smoothstep(clamp(settleT / 0.42, 0, 1));

          // Digital Cover-style 3D Z-depth corridor for Stories (100% GPU transform + opacity)
          const rawCorridorT = clamp(
            (p - CORRIDOR_START) / (CORRIDOR_END - CORRIDOR_START),
            0,
            1,
          );
          const continuousIdx = rawCorridorT * Math.max(0, count - 1);

          // Push corridor cards forward & out during the final newsletter settle
          const exitPush = settleT * 1.2;
          const effectiveIdx = continuousIdx + exitPush;

          cards.forEach((card, idx) => {
            const rel = idx - effectiveIdx; // >0 upcoming in back, 0 active midground, <0 exiting foreground
            const side = idx % 2 === 0 ? -1 : 1;

            if (rel > 2.15 || rel < -1.05) {
              card.style.opacity = "0";
              card.style.visibility = "hidden";
              card.style.pointerEvents = "none";
              return;
            }

            card.style.visibility = "visible";

            let z = 0;
            let x = 0;
            let y = 0;
            let rotY = 0;
            let rotX = 0;
            let alpha = 1;
            let scale = 1;

            if (rel >= 0) {
              // Emerging from the upper-center distance into alternating left/right midground
              const depthT = clamp(rel / 2.15, 0, 1);
              z = -rel * 430;
              x = side * lerp(32, 118, clamp(rel, 0, 1)) * (1 - depthT * 0.45);
              y = -12 - rel * 48;
              rotY = -side * lerp(2.2, 6.5, clamp(rel, 0, 1));
              rotX = lerp(0, 3.2, depthT);
              scale = lerp(1, 0.75, smoothstep(depthT));
              alpha = Math.pow(1 - clamp(rel / 2.05, 0, 1), 2.15);
            } else {
              // Passing forward past the camera on the bottom-left / bottom-right
              const passT = clamp(-rel / 1.0, 0, 1);
              z = passT * 310;
              x = side * lerp(32, 148, passT);
              y = -12 + passT * 135;
              rotY = -side * lerp(2.2, 8.5, passT);
              rotX = -passT * 4;
              scale = lerp(1, 1.12, passT);
              alpha = 1 - smoothstep(passT);
            }

            alpha *= corridorVisibility;

            card.style.opacity = alpha.toFixed(3);
            card.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, ${z.toFixed(1)}px) rotateY(${rotY.toFixed(2)}deg) rotateX(${rotX.toFixed(2)}deg) scale(${scale.toFixed(3)})`;
            card.style.pointerEvents =
              Math.abs(rel) < 0.42 && settleT < 0.2 ? "auto" : "none";
            card.style.zIndex = String(100 - idx);
          });

          // Settled Newsletter Card section rising into place
          const cardAppearT = smoothstep(clamp((settleT - 0.14) / 0.58, 0, 1));
          const newsletterY = lerp(52, 0, cardAppearT);
          const newsletterScale = lerp(0.95, 1, cardAppearT);
          settledNewsletter.style.opacity = cardAppearT.toFixed(3);
          settledNewsletter.style.transform = `translate3d(0, ${newsletterY.toFixed(1)}px, 0) scale(${newsletterScale.toFixed(3)})`;
          settledNewsletter.style.pointerEvents =
            cardAppearT > 0.7 ? "auto" : "none";

          // Floating Newsletter Button: 100% GPU-composited flight onto the STORIES BY EMAIL card
          const strokeProgress = clamp(
            (p - CORRIDOR_START) / (CORRIDOR_END - CORRIDOR_START),
            0.05,
            1,
          );
          progressStroke.style.strokeDashoffset = (
            100 -
            strokeProgress * 100
          ).toFixed(2);

          const flightT = smoothstep(clamp((settleT - 0.12) / 0.82, 0, 1));
          const docked = flightT >= 0.97;

          if (targetSubmitBtn) {
            targetSubmitBtn.style.opacity = docked ? "1" : "0";
            targetSubmitBtn.style.pointerEvents = docked ? "auto" : "none";
          }

          const flyX = lerp(0, dockMetrics.dx, flightT);
          const flyY = lerp(0, dockMetrics.dy + newsletterY, flightT);

          floatingBtnWrap.style.opacity = docked ? "0" : "1";
          floatingBtnWrap.style.pointerEvents = docked ? "none" : "auto";
          floatingBtnWrap.style.transform = `translate3d(calc(-50% + ${flyX.toFixed(1)}px), ${flyY.toFixed(1)}px, 0)`;

          if (floatingDarkLayer) {
            const darkAlpha = clamp(1 - flightT * 1.65, 0, 1);
            const scaleX = lerp(1, dockMetrics.w / 316, flightT);
            const scaleY = lerp(1, dockMetrics.h / 62, flightT);
            floatingDarkLayer.style.opacity = darkAlpha.toFixed(3);
            floatingDarkLayer.style.transform = `scale3d(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)}, 1)`;
          }
          if (floatingGoldLayer) {
            const goldAlpha = clamp((flightT - 0.2) / 0.65, 0, 1);
            const scaleX = lerp(316 / dockMetrics.w, 1, flightT);
            const scaleY = lerp(62 / dockMetrics.h, 1, flightT);
            floatingGoldLayer.style.opacity = goldAlpha.toFixed(3);
            floatingGoldLayer.style.transform = `translate3d(-50%, -50%, 0) scale3d(${scaleX.toFixed(3)}, ${scaleY.toFixed(3)}, 1)`;
          }
        };

        syncCanvasSize();
        renderFrame(0);
        // Re-apply initial pre-pin wave state based on actual scroll position
        const initRect = runway.getBoundingClientRect();
        renderWave(clamp(1 - initRect.top / window.innerHeight, 0, 1));
        window.addEventListener("resize", syncCanvasSize);

        // Full-viewport rising watercolor wave: washes upward over the Hero section as user scrolls down to #stories-list
        const entryWaveTrigger = ScrollTrigger.create({
          trigger: runway,
          start: "top bottom",
          end: "top top",
          scrub: true,
          onUpdate: (self) => {
            renderWave(self.progress);
          },
        });

        const st = ScrollTrigger.create({
          trigger: runway,
          pin,
          start: "top top",
          end: () =>
            `+=${Math.max(window.innerHeight * (count * 0.68 + 1.45), 2550)}`,
          scrub: true,
          snap: {
            snapTo: snapStops,
            duration: { min: 0.25, max: 0.55 },
            delay: 0.04,
            ease: "power3.out",
            directional: true,
          },
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            renderFrame(self.progress);
          },
        });

        triggerRef.current = st;

        return () => {
          window.removeEventListener("resize", syncCanvasSize);
          entryWaveTrigger.kill();
          st.kill();
          triggerRef.current = null;
          delete runway.dataset.enhanced;
        };
      },
    );

    return () => media.revert();
  }, [filteredStories]);

  return (
    <div className="relative bg-[var(--color-paper)]">
      {/* Full-viewport fixed watercolor wave canvas (rises over the Hero with zero box clipping) */}
      <canvas
        ref={canvasRef}
        className="stories-wave-canvas"
        aria-hidden="true"
      />

      {/* 1. Light Editorial Hero (matching /manufacturing-programme light palette) */}
      <section className="relative z-[1] bg-transparent pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
        <div className="container grid gap-[var(--space-2xl)]">
          <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.12em] text-[var(--color-clay-ink)] uppercase">
                {isEs
                  ? "HISTORIAS · INDIA, ESPAÑA Y EUROPA"
                  : "STORIES · INDIA, SPAIN & EUROPE"}
              </p>
              <h1 className="max-w-[15ch] text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium text-[var(--color-forest-deep)]">
                {isEs
                  ? "Historias de nuestro trabajo entre la India, España y Europa."
                  : "Stories from our work across India, Spain, and Europe."}
              </h1>
              <p className="lead max-w-[50ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Alma y Shirish fundaron KarmaRise D Global juntos en la India. Aquí compartimos cómo trabajamos con talleres especializados en todo el país, cómo damos una nueva vida a los saris indios con Almarise y el día a día entre España y la India."
                  : "Alma and Shirish started KarmaRise D Global together in India. Here we share how we partner with specialist workshops across the country, how we recut vintage Indian sarees for Almarise, and life between Spain and India."}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2">
                <a className="primary-button" href="#stories-list">
                  {isEs ? "Explorar las historias" : "Browse Stories"}
                </a>
                <button
                  type="button"
                  onClick={scrollToNewsletterAndFocus}
                  className="inline-flex min-h-[44px] cursor-pointer items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                >
                  {isEs
                    ? "Recibir nuevas historias por correo"
                    : "Receive new Stories by email"}
                </button>
              </div>
            </div>

            {heroStory && heroStoryLocalized?.leadImage?.url ? (
              <div className="lg:col-span-5">
                <Link
                  href={localizeHref(`/stories/${heroStory.slug}`)}
                  data-transition-title={heroStoryLocalized.title}
                  className="group block overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] shadow-[var(--shadow-card)]"
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={heroStoryLocalized.leadImage.url}
                      alt={
                        heroStoryLocalized.leadImage.alt ||
                        heroStoryLocalized.title
                      }
                      fill
                      priority
                      sizes="(max-width: 64rem) 100vw, 42vw"
                      style={
                        heroStoryLocalized.leadImage.objectPosition
                          ? {
                              objectPosition:
                                heroStoryLocalized.leadImage.objectPosition,
                            }
                          : undefined
                      }
                      className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="grid gap-2 px-5 py-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)]">
                      <span className="font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
                        {heroStoryLocalized.categoryLabel}
                      </span>
                      <span className="font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4">
                        {isEs
                          ? "Leer historia destacada"
                          : "Read featured Story"}
                      </span>
                    </div>
                    <p className="font-[family-name:var(--font-display)] text-[length:var(--text-lg)] leading-[1.2] font-medium text-[var(--color-forest-deep)] transition-colors group-hover:text-[var(--color-clay-ink)]">
                      {heroStoryLocalized.title}
                    </p>
                  </div>
                </Link>
              </div>
            ) : null}
          </div>

          {/* Centered six-category wrapped pills (44px touch targets, zero orphaned dividers) */}
          <div className="flex flex-wrap items-center justify-center gap-2 border-t border-[var(--color-rule)] pt-6 text-center">
            {storyCategoryDetails.map((pillar) => {
              const localized = getLocalizedCategory(pillar.title, language);
              const isSelected = activeCategory === pillar.title;
              return (
                <button
                  key={pillar.slug}
                  type="button"
                  onClick={() =>
                    selectCategoryAndBrowse(
                      isSelected ? "All Stories" : pillar.title,
                    )
                  }
                  className={`inline-flex min-h-[44px] cursor-pointer items-center rounded-full border px-3.5 text-[length:var(--text-sm)] font-semibold transition-colors ${
                    isSelected
                      ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                      : "border-[var(--color-rule)] bg-[var(--color-paper-2)]/60 text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:text-[var(--color-clay-ink)]"
                  }`}
                >
                  {localized.title}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Desktop/Laptop Pinned Digital Cover 3D Stories Corridor + Settling Newsletter Section */}
      <section
        id="stories-list"
        ref={runwayRef}
        className="stories-depth-runway relative z-[10]"
      >
        <div ref={pinRef} className="stories-depth-pin">
          <div className="stories-depth-overlay">
            {/* Center 3D Perspective Depth Corridor (Digital Cover homage) */}
            <div
              ref={corridorStageRef}
              className="stories-corridor-stage"
              role="region"
              aria-label={
                isEs
                  ? "Galería en profundidad de historias"
                  : "Stories depth gallery"
              }
            >
              {filteredStories.map((story, idx) => {
                const localized = getLocalizedStory(story, language);
                return (
                  <article
                    key={story.slug}
                    data-corridor-card
                    className="stories-corridor-card"
                  >
                    <Link
                      href={localizeHref(`/stories/${story.slug}`)}
                      data-transition-title={localized.title}
                      className="stories-corridor-media"
                      aria-label={localized.title}
                    >
                      {localized.leadImage?.url ? (
                        <Image
                          src={localized.leadImage.url}
                          alt={localized.leadImage.alt || localized.title}
                          fill
                          sizes="(max-width: 80rem) 100vw, 520px"
                          priority={idx < 2}
                          style={
                            localized.leadImage.objectPosition
                              ? {
                                  objectPosition:
                                    localized.leadImage.objectPosition,
                                }
                              : undefined
                          }
                        />
                      ) : null}
                      <span className="stories-corridor-badge">
                        {localized.categoryLabel}
                      </span>
                    </Link>

                    <div className="stories-corridor-copy">
                      <div className="stories-corridor-copy-top">
                        <p className="stories-corridor-meta num">
                          <span>
                            {String(idx + 1).padStart(2, "0")} /{" "}
                            {String(filteredStories.length).padStart(2, "0")}
                          </span>
                          <span>·</span>
                          <span>{localized.location}</span>
                          <span>·</span>
                          <span>
                            {isEs
                              ? `${story.readingTimeMinutes} min`
                              : `${story.readingTimeMinutes} min read`}
                          </span>
                        </p>

                        <h3>
                          <Link
                            href={localizeHref(`/stories/${story.slug}`)}
                            data-transition-title={localized.title}
                          >
                            {localized.title}
                          </Link>
                        </h3>

                        <p className="stories-corridor-summary">
                          {localized.summary}
                        </p>
                      </div>

                      <div className="stories-corridor-footer">
                        <span className="stories-corridor-author">
                          {isEs
                            ? `Por ${story.author.name}`
                            : `By ${story.author.name}`}{" "}
                          · {formatStoryDate(story.publishedAt, language)}
                        </span>

                        <Link
                          href={localizeHref(`/stories/${story.slug}`)}
                          data-transition-title={localized.title}
                          className="stories-corridor-link"
                        >
                          {isEs ? "Leer historia" : "Read Story"}
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Bottom-Center Floating Newsletter Subscribe Button with SVG Perimeter Progress Stroke */}
            <div
              ref={floatingBtnWrapRef}
              className="stories-floating-newsletter-wrap"
            >
              <button
                type="button"
                onClick={scrollToNewsletterAndFocus}
                className="stories-floating-newsletter-cta"
              >
                <span
                  data-floating-dark-layer
                  className="stories-floating-newsletter-dark"
                >
                  <svg
                    className="stories-floating-newsletter-svg"
                    viewBox="0 0 320 64"
                    fill="none"
                    aria-hidden="true"
                  >
                    <rect
                      x="2"
                      y="2"
                      width="316"
                      height="60"
                      rx="30"
                      className="stories-floating-newsletter-track"
                    />
                    <rect
                      ref={progressStrokeRef}
                      x="2"
                      y="2"
                      width="316"
                      height="60"
                      rx="30"
                      pathLength="100"
                      className="stories-floating-newsletter-stroke"
                    />
                  </svg>

                  <span
                    className="stories-floating-newsletter-icon"
                    aria-hidden="true"
                  >
                    <svg viewBox="0 0 20 20" fill="none">
                      <path
                        d="M2.5 5.5A1.5 1.5 0 0 1 4 4h12a1.5 1.5 0 0 1 1.5 1.5v9A1.5 1.5 0 0 1 16 16H4a1.5 1.5 0 0 1-1.5-1.5v-9Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="m3 6 7 4.75L17 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>

                  <span className="stories-floating-newsletter-text">
                    <span className="stories-floating-newsletter-kicker">
                      {isEs ? "Historias por correo" : "Stories by email"}
                    </span>
                    <span className="stories-floating-newsletter-label">
                      {isEs ? "Suscribirme al boletín" : "Subscribe to Stories"}
                    </span>
                  </span>
                </span>

                <span
                  data-floating-gold-layer
                  className="stories-floating-newsletter-gold"
                  aria-hidden="true"
                >
                  {isEs ? "Suscribirme" : "Subscribe"}
                </span>
              </button>
            </div>

            {/* Settled Newsletter Section at the end of the desktop runway (expanded from the floating button) */}
            <div
              id="stories-newsletter"
              ref={settledNewsletterRef}
              className="stories-settled-newsletter"
            >
              <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
                <div className="grid gap-4 text-[var(--color-paper)] lg:col-span-5">
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.1em] text-[var(--color-gold)] uppercase">
                    {isEs ? "Mantente al día" : "Stay connected"}
                  </p>
                  <h2 className="max-w-[15ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium text-[var(--color-paper)]">
                    {isEs
                      ? "Recibe nuestras nuevas historias por correo."
                      : "Receive new Stories by email."}
                  </h2>
                  <p className="max-w-[48ch] text-[var(--color-paper-2)]">
                    {isEs
                      ? "Cada pocas semanas enviamos un correo con nuestras últimas historias desde la India y España. Puedes responder directamente a Alma y Shirish siempre que quieras."
                      : "Every few weeks, we send an email with our latest Stories from India and Spain. You can reply directly to Alma and Shirish anytime."}
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-6 pt-2">
                    <Link
                      className="font-semibold text-[var(--color-gold)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
                      href={localizeHref("/contact")}
                    >
                      {isEs
                        ? "Escribir directamente a Alma y Shirish"
                        : "Write directly to Alma & Shirish"}
                    </Link>
                  </div>
                </div>

                <div className="lg:col-span-7">
                  <NewsletterForm variant="journal" source="Stories Page" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Tablet & Mobile Fallback (<= 64rem): Simple palette colors + watercolor wave SVG illustration + stacked editorial cards */}
        <div ref={mobileListTopRef} className="stories-mobile-fallback">
          <div className="stories-mobile-wave-divider" aria-hidden="true">
            <svg
              viewBox="0 0 1440 160"
              preserveAspectRatio="none"
              className="block h-24 w-full sm:h-32"
            >
              <path
                d="M0,96 C240,148 420,28 720,76 C1020,124 1220,36 1440,84 L1440,160 L0,160 Z"
                fill="var(--color-pale-sage)"
              />
              <path
                d="M0,118 C310,64 580,152 910,98 C1140,60 1310,114 1440,96 L1440,160 L0,160 Z"
                fill="var(--color-sage)"
                fillOpacity="0.45"
              />
              <path
                d="M0,138 C360,104 720,158 1080,122 C1260,104 1360,128 1440,118 L1440,160 L0,160 Z"
                fill="var(--color-forest-deep)"
              />
            </svg>
          </div>

          <div className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]">
            <div className="container grid gap-[var(--space-2xl)]">
              <div className="grid gap-5 border-b border-[var(--color-paper)]/15 pb-6">
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="grid gap-1">
                    <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-gold)] uppercase">
                      {isEs ? "Filtrar por categoría" : "Filter by category"}
                    </p>
                    <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-paper)]">
                      {activeCategory === "All Stories"
                        ? isEs
                          ? "Todas las historias"
                          : "All Stories"
                        : activeCategoryLocalized?.title}
                    </h2>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {storyCategories.map((category) => {
                    const isActive = category === activeCategory;
                    const label =
                      category === "All Stories"
                        ? isEs
                          ? "Todas"
                          : "All Stories"
                        : getLocalizedCategory(category, language).title;
                    return (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setActiveCategory(category)}
                        className={`rounded-full border px-4 py-2 text-[length:var(--text-xs)] font-semibold transition-colors ${
                          isActive
                            ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-night)]"
                            : "border-[var(--color-paper)]/25 bg-[var(--color-paper)]/10 text-[var(--color-paper)]"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div
                key={activeCategory}
                className="stories-category-grid grid gap-8 md:grid-cols-2"
              >
                {filteredStories.map((story) => {
                  const localized = getLocalizedStory(story, language);
                  return (
                    <article
                      key={story.slug}
                      className="flex flex-col justify-between gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-5 text-[var(--color-forest-deep)]"
                    >
                      <div className="grid gap-4">
                        <Link
                          href={localizeHref(`/stories/${story.slug}`)}
                          data-transition-title={localized.title}
                          className="block"
                        >
                          <StoryMedia
                            image={localized.leadImage}
                            kind={story.leadSlot.kind}
                            ratio={story.leadSlot.ratio}
                            aspectClass="aspect-[16/10]"
                            title={story.leadSlot.title}
                            description={story.leadSlot.description}
                            sizes="(max-width: 64rem) 100vw, 50vw"
                            interactive
                          />
                        </Link>
                        <div className="flex items-center justify-between gap-2 text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                          <span>{localized.categoryLabel}</span>
                          <span className="num text-[var(--color-muted)]">
                            {isEs
                              ? `${story.readingTimeMinutes} min`
                              : `${story.readingTimeMinutes} min read`}
                          </span>
                        </div>
                        <h3 className="text-[length:var(--text-xl)] leading-[1.15] font-medium">
                          <Link
                            href={localizeHref(`/stories/${story.slug}`)}
                            data-transition-title={localized.title}
                          >
                            {localized.title}
                          </Link>
                        </h3>
                        <p className="text-[length:var(--text-sm)] text-[var(--color-ink-2)]">
                          {localized.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-[var(--color-rule)] pt-3 text-[length:var(--text-xs)]">
                        <span className="text-[var(--color-muted)]">
                          {story.author.name} ·{" "}
                          {formatStoryDate(story.publishedAt, language)}
                        </span>
                        <Link
                          href={localizeHref(`/stories/${story.slug}`)}
                          data-transition-title={localized.title}
                          className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                        >
                          {isEs ? "Leer historia" : "Read Story"}
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div
                id="stories-newsletter-mobile"
                className="grid items-center gap-8 border-t border-[var(--color-paper)]/15 pt-10"
              >
                <div className="grid gap-3">
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.1em] text-[var(--color-gold)] uppercase">
                    {isEs ? "Mantente al día" : "Stay connected"}
                  </p>
                  <h2 className="text-[length:var(--text-display-s)] leading-[1.06] font-medium text-[var(--color-paper)]">
                    {isEs
                      ? "Recibe nuestras nuevas historias por correo."
                      : "Receive new Stories by email."}
                  </h2>
                  <p className="text-[var(--color-paper-2)]">
                    {isEs
                      ? "Cada pocas semanas enviamos un correo con nuestras últimas historias desde la India y España."
                      : "Every few weeks, we send an email with our latest Stories from India and Spain."}
                  </p>
                </div>
                <NewsletterForm variant="journal" source="Stories Page" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Six Themes Directory on Deep Forest Green (--color-forest-deep) */}
      <section
        aria-labelledby="story-categories-heading"
        className="relative z-[10] bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]"
      >
        <div className="container grid gap-[var(--space-2xl)] border-t border-[var(--color-paper)]/15 pt-[var(--space-2xl)]">
          <div className="grid items-end gap-6 lg:grid-cols-12">
            <div className="grid gap-2 lg:col-span-7">
              <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.1em] text-[var(--color-gold)] uppercase">
                {isEs ? "Categorías" : "Categories"}
              </p>
              <h2
                id="story-categories-heading"
                className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium text-[var(--color-paper)]"
              >
                {isEs
                  ? "Seis temas que recorren nuestras historias."
                  : "Six themes across our Stories."}
              </h2>
            </div>
            <p className="max-w-[46ch] text-[var(--color-paper-2)] lg:col-span-5">
              {isEs
                ? "Explora lo que escribimos sobre fabricación en toda la India, desarrollo de muestras, cultura entre España y la India, Almarise y nuestros avances como empresa."
                : "Explore our writing on manufacturing across India, material sampling, culture between Spain and India, Almarise, and our company progress."}
            </p>
          </div>

          <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-3">
            {storyCategoryDetails.map((pillar) => {
              const isSelected = activeCategory === pillar.title;
              const storyCount = stories.filter(
                (story) => story.category === pillar.title,
              ).length;
              const localized = getLocalizedCategory(pillar.title, language);

              return (
                <article
                  key={pillar.slug}
                  className={`group flex flex-col justify-between gap-5 rounded-[var(--radius-card)] border p-6 transition-colors ${
                    isSelected
                      ? "border-[var(--color-gold)] bg-[var(--color-paper)] text-[var(--color-forest-deep)]"
                      : "border-[var(--color-paper)]/18 bg-[var(--color-forest-lush)]/55 text-[var(--color-paper)] hover:border-[var(--color-gold)]/70"
                  }`}
                >
                  <div className="grid gap-4">
                    <div className="relative aspect-[16/10] overflow-hidden rounded-[0.85rem] bg-[var(--color-night)]">
                      <Image
                        src={pillar.coverImage}
                        alt={localized.coverAlt}
                        fill
                        sizes="(max-width: 48rem) 100vw, (max-width: 75rem) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                      />
                    </div>

                    <div className="flex items-baseline justify-between gap-2">
                      <h3
                        className={`text-[length:var(--text-xl)] font-medium ${
                          isSelected
                            ? "text-[var(--color-forest-deep)]"
                            : "text-[var(--color-paper)]"
                        }`}
                      >
                        {localized.title}
                      </h3>
                      <span
                        className={`num text-[length:var(--text-xs)] font-semibold uppercase ${
                          isSelected
                            ? "text-[var(--color-clay-ink)]"
                            : "text-[var(--color-gold)]"
                        }`}
                      >
                        {isEs
                          ? `${storyCount} ${
                              storyCount === 1 ? "historia" : "historias"
                            }`
                          : `${storyCount} ${
                              storyCount === 1 ? "Story" : "Stories"
                            }`}
                      </span>
                    </div>

                    <p
                      className={`text-[length:var(--text-sm)] leading-[1.55] ${
                        isSelected
                          ? "text-[var(--color-ink-2)]"
                          : "text-[var(--color-paper-2)]"
                      }`}
                    >
                      {localized.description}
                    </p>
                  </div>

                  <div
                    className={`border-t pt-3 ${
                      isSelected
                        ? "border-[var(--color-rule)]"
                        : "border-[var(--color-paper)]/15"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => selectCategoryAndBrowse(pillar.title)}
                      className={`cursor-pointer text-[length:var(--text-sm)] font-semibold underline underline-offset-4 ${
                        isSelected
                          ? "text-[var(--color-forest-deep)] decoration-[var(--color-clay)]"
                          : "text-[var(--color-gold)] decoration-[var(--color-gold)] hover:text-[var(--color-paper)]"
                      }`}
                    >
                      {isSelected
                        ? isEs
                          ? "Viendo esta categoría"
                          : "Viewing this category"
                        : isEs
                          ? `Ver historias de ${localized.title.toLowerCase()}`
                          : `Explore ${localized.title}`}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <SectionBridge from="forest-deep" to="night" className="z-[10]" />
    </div>
  );
}
