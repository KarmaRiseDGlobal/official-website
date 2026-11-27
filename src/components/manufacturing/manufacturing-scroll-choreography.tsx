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
 * Choreographs the full-bleed hero arrival (SplitText masked line wave,
 * support blur-in, media cover settle, scroll parallax, and horizontal
 * line counter-drift), the scroll-linked card stacking recession in
 * #product-study-and-design, and once-only below-fold section header arrivals
 * on /manufacturing. Elements stay visible in default SSR/CSS state and
 * bypass motion cleanly under prefers-reduced-motion: reduce.
 */
export function ManufacturingScrollChoreography() {
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
        // 0. Hero arrival (optional banner media settle, SplitText line-masked wave, support blur-in) + scroll parallax & line drift
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

              const isCompactPhone = window.innerWidth < 736;

              if (heroMediaEl) {
                gsap.set(heroMediaEl, { scale: isCompactPhone ? 1.05 : 1.08 });
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

              if (heroMediaEl) {
                introTl.to(
                  heroMediaEl,
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

        // 1. Below-fold editorial section headers (matches Home section header arrival)
        const sectionHeaders = Array.from(
          main.querySelectorAll<HTMLElement>(
            "[data-choreo='manufacturing-section-header']",
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

    // 3. #product-study-and-design Jitter-adapted card stacking (measured uniform card height + compensating sticky fan + gentle depth recession)
    media.add(
      "(min-width: 64rem) and (min-height: 35rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const sectionEl = main.querySelector<HTMLElement>(
          "#product-study-and-design",
        );
        const stackRoot = main.querySelector<HTMLElement>("[data-study-stack]");
        if (!sectionEl || !stackRoot) return;

        const cards = Array.from(
          stackRoot.querySelectorAll<HTMLElement>("[data-study-card]"),
        );
        if (cards.length < 2) return;

        const veils = cards.map((card) =>
          card.querySelector<HTMLElement>("[data-study-card-veil]"),
        );

        let isStickyActive = false;
        const arrivalProgress = new Array<number>(cards.length).fill(0);

        const resetDeckVisuals = () => {
          for (let i = 0; i < cards.length; i += 1) {
            arrivalProgress[i] = 0;
            gsap.set(cards[i]!, { clearProps: "transform" });
            const veil = veils[i];
            if (veil) {
              veil.style.removeProperty("opacity");
            }
          }
        };

        const syncEqualCardHeight = () => {
          const rootFontSize =
            Number.parseFloat(
              window.getComputedStyle(document.documentElement).fontSize,
            ) || 16;

          delete sectionEl.dataset.studySticky;
          stackRoot.style.removeProperty("--study-card-height");

          let maxNaturalHeight = 0;
          for (const card of cards) {
            const h = card.getBoundingClientRect().height;
            if (h > maxNaturalHeight) {
              maxNaturalHeight = h;
            }
          }

          const stackTopPx = Math.min(
            Math.max(4.25 * rootFontSize, window.innerHeight * 0.08),
            5.5 * rootFontSize,
          );
          const stepPx = window.innerHeight < 720 ? 18 : 24;
          const maxStickyTop = stackTopPx + (cards.length - 1) * stepPx;
          const availableHeight = Math.floor(
            window.innerHeight - maxStickyTop - 16,
          );
          const naturalCeil = Math.ceil(maxNaturalHeight);

          // Disable sticky stacking under text zoom (> 20px root) or when the tallest card
          // cannot fit completely inside the viewport below the final sticky offset.
          if (rootFontSize > 20 || naturalCeil > availableHeight) {
            isStickyActive = false;
            resetDeckVisuals();
            return;
          }

          const preferredHeight = Math.round(
            Math.min(
              Math.max(
                window.innerHeight * 0.6,
                window.innerHeight < 720 ? 360 : 448,
              ),
              580,
            ),
          );
          const targetHeight = Math.max(
            naturalCeil,
            Math.min(preferredHeight, availableHeight),
          );

          isStickyActive = true;
          sectionEl.dataset.studySticky = "true";
          stackRoot.style.setProperty("--study-stack-step", `${stepPx}px`);
          stackRoot.style.setProperty(
            "--study-card-height",
            `${targetHeight}px`,
          );
        };

        const stackCtx = gsap.context(() => {
          syncEqualCardHeight();
          if (document.fonts?.ready) {
            void document.fonts.ready.then(() => {
              syncEqualCardHeight();
              ScrollTrigger.refresh();
            });
          }

          const onResize = () => {
            syncEqualCardHeight();
            ScrollTrigger.refresh();
          };
          window.addEventListener("resize", onResize, { passive: true });

          const syncDeckDepth = () => {
            if (!isStickyActive) {
              resetDeckVisuals();
              return;
            }

            for (let i = 0; i < cards.length - 1; i += 1) {
              let buriedDepth = 0;
              for (let j = i + 1; j < cards.length; j += 1) {
                buriedDepth += arrivalProgress[j] ?? 0;
              }

              // Subtle Jitter-inspired recession: preserve crisp full-width edges while adding quiet physical depth
              const scale = Math.max(0.95, 1 - buriedDepth * 0.016);
              const veilOpacity = Math.min(0.14, buriedDepth * 0.045);

              gsap.set(cards[i]!, {
                scale,
                force3D: true,
              });

              const veil = veils[i];
              if (veil) {
                veil.style.opacity = veilOpacity.toFixed(3);
              }
            }
          };

          syncDeckDepth();

          for (let idx = 1; idx < cards.length; idx += 1) {
            const incomingCard = cards[idx]!;
            ScrollTrigger.create({
              trigger: incomingCard,
              start: "top 85%",
              end: () => {
                const topPx = Number.parseFloat(
                  window.getComputedStyle(incomingCard).top,
                );
                return `top ${Number.isFinite(topPx) ? Math.round(topPx) : 96}px`;
              },
              scrub: true,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                arrivalProgress[idx] = self.progress;
                syncDeckDepth();
              },
            });
          }

          ScrollTrigger.sort();

          return () => {
            window.removeEventListener("resize", onResize);
          };
        }, stackRoot);

        return () => {
          stackCtx.revert();
          delete sectionEl.dataset.studySticky;
          stackRoot.style.removeProperty("--study-card-height");
          resetDeckVisuals();
        };
      },
    );

    // 4. Calm below-fold arrival for study cards on iPad portrait & iPhone (< 64rem)
    media.add(
      "(max-width: 63.99rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const stackRoot = main.querySelector<HTMLElement>("[data-study-stack]");
        if (!stackRoot) return;

        const cards = Array.from(
          stackRoot.querySelectorAll<HTMLElement>("[data-study-card]"),
        );
        if (cards.length === 0) return;

        const mobileStackCtx = gsap.context(() => {
          const isCompactPhone = window.innerWidth < 736;
          for (const card of cards) {
            if (!isBelowFold(card)) continue;
            gsap.set(card, { opacity: 0, y: isCompactPhone ? 14 : 20 });
            gsap.to(card, {
              opacity: 1,
              y: 0,
              duration: isCompactPhone ? 0.44 : 0.52,
              ease: "power3.out",
              clearProps: "transform,opacity",
              scrollTrigger: {
                trigger: card,
                start: "top 86%",
                once: true,
              },
            });
          }
          ScrollTrigger.sort();
        }, stackRoot);

        return () => mobileStackCtx.revert();
      },
    );

    return () => {
      media.revert();
    };
  }, []);

  return null;
}
