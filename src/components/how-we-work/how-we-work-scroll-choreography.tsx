"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect } from "react";

import { scheduleHeroAfterLoader } from "@/lib/loader";

function isBelowFold(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top > window.innerHeight * 0.92;
}

/**
 * Choreographs the full-bleed looping video hero arrival (cover scale settle,
 * SplitText word-masked char wave with descender headroom, support blur-in,
 * scroll parallax, and horizontal line counter-drift) plus once-only below-fold
 * editorial section header arrivals on /how-we-work.
 * Elements stay visible in default SSR/CSS state and bypass motion cleanly
 * under prefers-reduced-motion: reduce.
 */
export function HowWeWorkScrollChoreography() {
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
        // 0. Hero arrival (video cover scale, SplitText masked line wave, support blur-in) + scroll parallax & line drift
        const heroWrapper = main.querySelector<HTMLElement>(
          "[data-hero-wrapper]",
        );
        const heroVideoEl = heroWrapper?.querySelector<HTMLElement>("video");
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

              if (heroVideoEl) {
                gsap.set(heroVideoEl, { scale: isCompactPhone ? 1.05 : 1.08 });
              }
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

              if (heroVideoEl) {
                introTl.to(
                  heroVideoEl,
                  {
                    scale: 1,
                    duration: isCompactPhone ? 1.35 : 1.75,
                    ease: "expo.out",
                    clearProps: "transform",
                  },
                  0,
                );
              }

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

              if (heroLines.length >= 2) {
                if (isWideViewport && !isShortViewport) {
                  const drift = progress * (isFinePointer ? 4.5 : 3.2);
                  gsap.set(heroLines[0]!, { xPercent: drift });
                  gsap.set(heroLines[1]!, { xPercent: -drift });
                } else {
                  gsap.set(heroLines, { xPercent: 0 });
                }
              }
            },
          });
        }

        // 1. Below-fold editorial section headers (matches Home and Manufacturing section header arrivals)
        const sectionHeaders = Array.from(
          main.querySelectorAll<HTMLElement>(
            "[data-choreo='how-we-work-section-header']",
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

    return () => {
      media.revert();
    };
  }, []);

  return null;
}
