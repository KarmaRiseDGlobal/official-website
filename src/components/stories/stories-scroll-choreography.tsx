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
 * Choreographs the full-bleed botanical forest Stories hero arrival
 * (SplitText word-masked char wave with descender headroom, support reveal,
 * scroll parallax, and horizontal line counter-drift) plus calm once-only
 * arrivals for below-fold editorial headings and spreads across Desktop, iPad,
 * and iPhone. Elements remain visible in default SSR/CSS state and bypass
 * motion cleanly under prefers-reduced-motion: reduce.
 */
export function StoriesScrollChoreography() {
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
        const isCompactPhone = window.innerWidth < 768;
        const heroWrapper = main.querySelector<HTMLElement>(
          "[data-hero-wrapper]",
        );
        const heroMediaEl = heroWrapper?.querySelector<HTMLElement>(
          "[data-hero-media] img, [data-hero-media] video",
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

              if (heroMediaEl) {
                gsap.set(heroMediaEl, {
                  scale: isCompactPhone ? 1.06 : 1.08,
                  force3D: true,
                });
              }
              if (allChars.length > 0) {
                gsap.set(
                  allChars,
                  isCompactPhone
                    ? { yPercent: 108, opacity: 0, force3D: true }
                    : { yPercent: 112, filter: "blur(5px)", force3D: true },
                );
              }
              if (heroSub) {
                gsap.set(
                  heroSub,
                  isCompactPhone
                    ? { opacity: 0, y: 12, force3D: true }
                    : { opacity: 0, filter: "blur(5px)", y: 14, force3D: true },
                );
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

              if (heroMediaEl) {
                introTl.to(
                  heroMediaEl,
                  {
                    scale: 1,
                    duration: isCompactPhone ? 1.25 : 1.75,
                    ease: "expo.out",
                    clearProps: "transform",
                  },
                  0,
                );
              }

              if (allChars.length > 0) {
                introTl.to(
                  allChars,
                  isCompactPhone
                    ? {
                        yPercent: 0,
                        opacity: 1,
                        duration: 0.9,
                        ease: "expo.out",
                        stagger: {
                          each: 0.018,
                          ease: "power2.out",
                        },
                        onComplete: () => {
                          gsap.set(allChars, {
                            clearProps: "opacity,transform",
                          });
                        },
                      }
                    : {
                        yPercent: 0,
                        filter: "blur(0px)",
                        duration: 1.15,
                        ease: "expo.out",
                        stagger: {
                          each: 0.026,
                          ease: "power2.out",
                        },
                        onComplete: () => {
                          gsap.set(allChars, {
                            clearProps: "filter,transform",
                          });
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
                    ...(isCompactPhone ? {} : { filter: "blur(0px)" }),
                    y: 0,
                    duration: isCompactPhone ? 0.68 : 0.85,
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
                  force3D: true,
                });
              }

              if (firstLine && secondLine) {
                if (isWideViewport && !isShortViewport) {
                  const drift = progress * (isFinePointer ? 4.5 : 3.2);
                  gsap.set(firstLine, { xPercent: drift, force3D: true });
                  gsap.set(secondLine, { xPercent: -drift, force3D: true });
                } else {
                  gsap.set(heroLines, { xPercent: 0 });
                }
              }
            },
          });
        }

        const sectionHeaders = Array.from(
          main.querySelectorAll<HTMLElement>(
            "[data-choreo='stories-section-header']",
          ),
        );

        for (const header of sectionHeaders) {
          if (!isBelowFold(header)) {
            continue;
          }

          gsap.fromTo(
            header,
            { opacity: 0, y: isCompactPhone ? 16 : 22, force3D: true },
            {
              opacity: 1,
              y: 0,
              duration: isCompactPhone ? 0.5 : 0.64,
              ease: "power3.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: header,
                start: "top 90%",
                once: true,
              },
            },
          );
        }

        const revealBlocks = Array.from(
          main.querySelectorAll<HTMLElement>("[data-choreo='stories-reveal']"),
        );

        for (const block of revealBlocks) {
          if (!isBelowFold(block)) {
            continue;
          }

          gsap.fromTo(
            block,
            { opacity: 0, y: isCompactPhone ? 18 : 26, force3D: true },
            {
              opacity: 1,
              y: 0,
              duration: isCompactPhone ? 0.52 : 0.66,
              ease: "power3.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: block,
                start: "top 92%",
                once: true,
              },
            },
          );
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
