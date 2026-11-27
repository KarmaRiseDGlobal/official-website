"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect } from "react";

import { scheduleHeroAfterLoader } from "@/lib/loader";
import { useTextZoomGuard } from "@/lib/use-text-zoom-guard";

function isBelowFold(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top > window.innerHeight * 0.92;
}

/**
 * Choreographs restrained editorial motion on /about across desktop, iPad, and iPhone:
 * - Full-bleed banner hero SplitText word-masked wave, support blur-in,
 *   responsive scroll parallax, and horizontal line counter-drift on >= 64rem
 * - One-shot below-fold entrances for #alma and #shirish (never dimming text at rest)
 * - Flanking Spain/India silhouettes gated on >= 75rem + useTextZoomGuard() + live
 *   corridor clearance so maps never collide with text at 150%-200% zoom
 * - Calm once-only arrivals on below-fold editorial section headers
 */
export function AboutScrollChoreography() {
  const isTextZoomed = useTextZoomGuard();

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;

    gsap.registerPlugin(ScrollTrigger, SplitText);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      let cancelled = false;
      const splits: SplitText[] = [];
      let cancelHeroSchedule: (() => void) | null = null;

      const ctx = gsap.context(() => {
        // 0. Hero arrival (SplitText word-masked wave, support blur-in, responsive scroll parallax & line drift)
        const heroWrapper = main.querySelector<HTMLElement>(
          "[data-hero-wrapper]",
        );
        const heroContent = heroWrapper?.querySelector<HTMLElement>(
          "[data-hero-content]",
        );
        const heroLines = Array.from(
          heroWrapper?.querySelectorAll<HTMLElement>("[data-hero-line]") ?? [],
        );
        const heroSub =
          heroWrapper?.querySelector<HTMLElement>("[data-hero-sub]");

        if (heroWrapper) {
          const runHeroEntrance = ({ introDelay }: { introDelay: number }) => {
            if (cancelled) return;

            ctx.add(() => {
              const allChars: Element[] = [];
              for (const line of heroLines) {
                const split = SplitText.create(line, {
                  type: "words, chars",
                  mask: "words",
                  wordsClass: "hero-split-word",
                  aria: "auto",
                });
                splits.push(split);
                allChars.push(...split.chars);
              }

              const isCompactPhone = window.innerWidth < 736;

              if (allChars.length > 0) {
                gsap.set(allChars, {
                  yPercent: isCompactPhone ? 96 : 112,
                  filter: isCompactPhone ? "blur(3px)" : "blur(5px)",
                });
              }
              if (heroSub) {
                gsap.set(heroSub, {
                  opacity: 0,
                  filter: isCompactPhone ? "blur(3px)" : "blur(5px)",
                  y: isCompactPhone ? 10 : 14,
                });
              }

              const introTl = gsap.timeline({
                delay: introDelay,
                onComplete: () => {
                  for (const split of splits) {
                    split.revert();
                  }
                  splits.length = 0;
                  if (heroSub) {
                    gsap.set(heroSub, {
                      clearProps: "opacity,filter,transform",
                    });
                  }
                },
              });

              if (allChars.length > 0) {
                introTl.to(
                  allChars,
                  {
                    yPercent: 0,
                    filter: "blur(0px)",
                    duration: isCompactPhone ? 0.92 : 1.15,
                    ease: "expo.out",
                    stagger: {
                      each: isCompactPhone ? 0.018 : 0.026,
                      ease: "power2.out",
                    },
                    onComplete: () => {
                      gsap.set(allChars, { clearProps: "filter,transform" });
                    },
                  },
                  0.04,
                );
              }

              if (heroSub) {
                introTl.to(
                  heroSub,
                  {
                    opacity: 1,
                    filter: "blur(0px)",
                    y: 0,
                    duration: isCompactPhone ? 0.72 : 0.85,
                    ease: "power3.out",
                    onComplete: () => {
                      gsap.set(heroSub, {
                        clearProps: "opacity,filter,transform",
                      });
                    },
                  },
                  0.2,
                );
              }

              ScrollTrigger.refresh();
            });
          };

          cancelHeroSchedule = scheduleHeroAfterLoader(runHeroEntrance);

          const [firstLine, secondLine] = heroLines;

          ScrollTrigger.create({
            trigger: heroWrapper,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const wrapperHeight = heroWrapper.offsetHeight;
              const isShortViewport = window.innerHeight < 500;
              const isWideViewport = window.innerWidth >= 1024;
              const isTabletViewport = window.innerWidth >= 768;
              const isFinePointer = window.matchMedia(
                "(hover: hover) and (pointer: fine)",
              ).matches;

              if (heroContent) {
                const parallaxFactor = isShortViewport
                  ? 0
                  : isWideViewport && isFinePointer
                    ? 0.5
                    : isTabletViewport
                      ? 0.24
                      : 0.12;
                gsap.set(heroContent, {
                  y: wrapperHeight * parallaxFactor * progress,
                });
              }

              if (firstLine && secondLine) {
                if (isWideViewport && !isShortViewport) {
                  const drift = progress * (isFinePointer ? 4.5 : 3.2);
                  gsap.set(firstLine, { xPercent: drift });
                  gsap.set(secondLine, { xPercent: -drift });
                } else {
                  gsap.set(heroLines, { xPercent: 0 });
                }
              }
            },
          });
        }

        // 1. Centered founder story blocks (#alma, #shirish): calm one-shot below-fold entrance (never scrubbed dimness)
        const founderStories = Array.from(
          main.querySelectorAll<HTMLElement>(
            "[data-choreo='founder-story-spain'], [data-choreo='founder-story-india']",
          ),
        );

        const isCompactPhone = window.innerWidth < 736;
        for (const story of founderStories) {
          if (!isBelowFold(story)) {
            continue;
          }

          gsap.set(story, { opacity: 0, y: isCompactPhone ? 18 : 28 });
          gsap.to(story, {
            opacity: 1,
            y: 0,
            duration: isCompactPhone ? 0.54 : 0.72,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: story,
              start: "top 86%",
              once: true,
            },
          });
        }

        // 2. Below-fold editorial section headers
        const sectionHeaders = Array.from(
          main.querySelectorAll<HTMLElement>(
            "[data-choreo='about-section-header']",
          ),
        );

        for (const header of sectionHeaders) {
          if (!isBelowFold(header)) {
            continue;
          }

          gsap.set(header, { opacity: 0, y: 22 });
          gsap.to(header, {
            opacity: 1,
            y: 0,
            duration: 0.64,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: header,
              start: "top 86%",
              once: true,
            },
          });
        }

        ScrollTrigger.sort();
      }, main);

      return () => {
        cancelled = true;
        cancelHeroSchedule?.();
        for (const split of splits) {
          split.revert();
        }
        ctx.revert();
      };
    });

    // 3. Wide desktop (>= 75rem) flanking Spain/India maps with zoom & corridor clearance guard
    media.add(
      "(min-width: 75rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const geoStage = main.querySelector<HTMLElement>(
          "[data-choreo='geo-bridge-stage']",
        );
        const spainMap = geoStage?.querySelector<HTMLElement>(
          "[data-choreo='geo-map-spain']",
        );
        const indiaMap = geoStage?.querySelector<HTMLElement>(
          "[data-choreo='geo-map-india']",
        );
        const corridor = geoStage?.querySelector<HTMLElement>(
          "[data-choreo='geo-corridor']",
        );
        if (!geoStage || !spainMap || !indiaMap || !corridor) return;

        const hasSafeCorridorClearance = (): boolean => {
          if (isTextZoomed) return false;
          const corridorRect = corridor.getBoundingClientRect();
          const spainRect = spainMap.getBoundingClientRect();
          const indiaRect = indiaMap.getBoundingClientRect();
          const leftGap = corridorRect.left - spainRect.right;
          const rightGap = indiaRect.left - corridorRect.right;
          return leftGap >= 24 && rightGap >= 24;
        };

        const syncZoomSafeFlag = () => {
          if (hasSafeCorridorClearance()) {
            delete geoStage.dataset.zoomSafe;
          } else {
            geoStage.dataset.zoomSafe = "true";
          }
        };

        syncZoomSafeFlag();
        window.addEventListener("resize", syncZoomSafeFlag, { passive: true });

        if (!hasSafeCorridorClearance()) {
          return () => {
            window.removeEventListener("resize", syncZoomSafeFlag);
            delete geoStage.dataset.zoomSafe;
          };
        }

        const mapCtx = gsap.context(() => {
          // Gentle vertical counter-drift across the full founders corridor
          const driftTl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: geoStage,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
              invalidateOnRefresh: true,
            },
          });

          driftTl.fromTo(spainMap, { y: 32 }, { y: -32 }, 0);
          driftTl.fromTo(indiaMap, { y: -32 }, { y: 32 }, 0);

          // Balanced intro -> Spain leads for Alma -> India leads for Shirish
          const focusTl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: geoStage,
              start: "top 60%",
              end: "bottom 75%",
              scrub: 0.5,
              invalidateOnRefresh: true,
              onRefresh: syncZoomSafeFlag,
            },
          });

          focusTl
            .fromTo(
              spainMap,
              { opacity: 0.88, x: 0 },
              { opacity: 0.94, x: 10, duration: 0.35 },
              0,
            )
            .fromTo(
              indiaMap,
              { opacity: 0.88, x: 0 },
              { opacity: 0.34, x: 8, duration: 0.35 },
              0,
            )
            .to(spainMap, { opacity: 0.34, x: -8, duration: 0.45 }, 0.42)
            .to(indiaMap, { opacity: 0.94, x: -10, duration: 0.45 }, 0.42)
            .to(spainMap, { opacity: 0.72, x: 0, duration: 0.13 }, 0.87)
            .to(indiaMap, { opacity: 0.72, x: 0, duration: 0.13 }, 0.87);

          ScrollTrigger.sort();
        }, geoStage);

        return () => {
          window.removeEventListener("resize", syncZoomSafeFlag);
          delete geoStage.dataset.zoomSafe;
          mapCtx.revert();
        };
      },
    );

    // Ensure zoom-safe flag also protects text when zoomed under reduced-motion or below 75rem
    const geoStageGlobal = main.querySelector<HTMLElement>(
      "[data-choreo='geo-bridge-stage']",
    );
    if (geoStageGlobal) {
      if (isTextZoomed) {
        geoStageGlobal.dataset.zoomSafe = "true";
      } else if (!window.matchMedia("(min-width: 75rem)").matches) {
        delete geoStageGlobal.dataset.zoomSafe;
      }
    }

    return () => {
      media.revert();
    };
  }, [isTextZoomed]);

  return null;
}
