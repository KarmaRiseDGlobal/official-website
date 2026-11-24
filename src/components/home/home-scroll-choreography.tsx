"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useEffect } from "react";

function isBelowFold(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top > window.innerHeight * 0.92;
}

/**
 * Choreographs once-only editorial chapter arrivals across the homepage.
 * Elements stay visible in default SSR/CSS state; only below-fold chapters
 * receive restrained motion when prefers-reduced-motion is not active.
 */
export function HomeScrollChoreography() {
  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;

    gsap.registerPlugin(CustomEase, ScrollTrigger, SplitText);
    const capSpreadEase = CustomEase.create(
      "capSpreadOut",
      "0.28, 0.08, 0.2, 1",
    );
    const capSupportEase = CustomEase.create(
      "capSpreadSupport",
      "0.22, 0.06, 0.2, 1",
    );

    const media = gsap.matchMedia();
    const enteredCapabilities = new WeakSet<HTMLElement>();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      let cancelled = false;
      const splits: SplitText[] = [];

      const ctx = gsap.context(() => {
        // 0. Hero arrival (cover scale, SplitText line-masked wave, support blur-in) + scroll parallax & line drift
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
          const runHeroEntrance = () => {
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

              const introTl = gsap.timeline({
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
                introTl.fromTo(
                  heroVideoEl,
                  { scale: 1.09 },
                  {
                    scale: 1,
                    duration: 1.75,
                    ease: "expo.out",
                    clearProps: "transform",
                  },
                  0,
                );
              }

              if (allChars.length > 0) {
                introTl.fromTo(
                  allChars,
                  { yPercent: 112, filter: "blur(5px)" },
                  {
                    yPercent: 0,
                    filter: "blur(0px)",
                    duration: 1.15,
                    ease: "expo.out",
                    stagger: {
                      each: 0.026,
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
                introTl.fromTo(
                  heroSub,
                  { opacity: 0, filter: "blur(5px)", y: 10 },
                  {
                    opacity: 1,
                    filter: "blur(0px)",
                    y: 0,
                    duration: 0.85,
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

          if (document.fonts?.ready) {
            void document.fonts.ready.then(runHeroEntrance);
          } else {
            runHeroEntrance();
          }

          ScrollTrigger.create({
            trigger: heroWrapper,
            start: "top top",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const progress = self.progress;
              const wrapperHeight = heroWrapper.offsetHeight;
              const isShortViewport = window.innerHeight < 560;
              const isFineDesktop =
                window.innerWidth >= 1024 &&
                window.matchMedia("(hover: hover) and (pointer: fine)").matches;

              if (heroContent) {
                const parallaxFactor = isShortViewport
                  ? 0
                  : isFineDesktop
                    ? 0.5
                    : 0.14;
                gsap.set(heroContent, {
                  y: wrapperHeight * parallaxFactor * progress,
                });
              }

              if (heroLines.length >= 2) {
                if (isFineDesktop) {
                  const drift = progress * 4.5;
                  gsap.set(heroLines[0]!, { xPercent: drift });
                  gsap.set(heroLines[1]!, { xPercent: -drift });
                } else {
                  gsap.set(heroLines, { xPercent: 0 });
                }
              }
            },
          });
        }

        // 1. Ownership chapter (#work): Calm editorial arrival (headline leads, prose and studio frame settle smoothly)
        const workSection = main.querySelector<HTMLElement>("#work");
        const workHeader = workSection?.querySelector<HTMLElement>(
          "[data-choreo='work-header']",
        );
        const workMedia = workSection?.querySelector<HTMLElement>(
          "[data-choreo='work-media']",
        );
        const workMediaImg = workMedia?.querySelector<HTMLElement>("img");
        const workCopy = workSection?.querySelector<HTMLElement>(
          "[data-choreo='work-copy']",
        );

        if (workSection && workMedia && workCopy && isBelowFold(workSection)) {
          const workTargets = [workHeader, workCopy, workMedia].filter(
            (el): el is HTMLElement => el !== null,
          );
          if (workHeader) {
            gsap.set(workHeader, { opacity: 0, y: 10 });
          }
          gsap.set(workCopy, { opacity: 0, y: 10 });
          gsap.set(workMedia, { opacity: 0, y: 12 });
          if (workMediaImg) {
            gsap.set(workMediaImg, { scale: 1.02 });
          }

          const workTl = gsap.timeline({
            scrollTrigger: {
              trigger: workSection,
              start: "top 82%",
              once: true,
            },
            onComplete: () => {
              gsap.set(workTargets, {
                clearProps: "transform,opacity",
              });
              if (workMediaImg) {
                gsap.set(workMediaImg, { clearProps: "transform" });
              }
            },
          });

          if (workHeader) {
            workTl.to(
              workHeader,
              {
                opacity: 1,
                y: 0,
                duration: 0.48,
                ease: "power4.out",
              },
              0,
            );
          }
          workTl.to(
            workCopy,
            {
              opacity: 1,
              y: 0,
              duration: 0.48,
              ease: "power4.out",
            },
            0.06,
          );
          workTl.to(
            workMedia,
            {
              opacity: 1,
              y: 0,
              duration: 0.56,
              ease: "power4.out",
            },
            0.09,
          );
          if (workMediaImg) {
            workTl.to(
              workMediaImg,
              {
                scale: 1,
                duration: 0.64,
                ease: "power4.out",
              },
              0.09,
            );
          }
        }

        // 2. Capabilities section header (#capabilities)
        const capSection = main.querySelector<HTMLElement>("#capabilities");
        const capHeader = capSection?.querySelector<HTMLElement>(
          "[data-choreo='cap-header']",
        );

        if (capHeader && isBelowFold(capHeader)) {
          gsap.set(capHeader, { opacity: 0, y: 12 });
          gsap.to(capHeader, {
            opacity: 1,
            y: 0,
            duration: 0.46,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: capHeader,
              start: "top 86%",
              once: true,
            },
          });
        }

        // 3. FAQ section (#faq): One clean arrival for the accordion group
        const faqGroup = main.querySelector<HTMLElement>(
          "[data-choreo='faq-group']",
        );
        if (faqGroup && isBelowFold(faqGroup)) {
          gsap.set(faqGroup, { opacity: 0, y: 14 });
          gsap.to(faqGroup, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: faqGroup,
              start: "top 86%",
              once: true,
            },
          });
        }

        ScrollTrigger.sort();
      }, main);

      return () => {
        cancelled = true;
        for (const split of splits) {
          split.revert();
        }
        ctx.revert();
      };
    });

    // Capabilities interlocking spreads (#capabilities): inside-out opening per breakpoint
    media.add(
      {
        desktop: "(min-width: 64rem)",
        tablet: "(min-width: 40rem) and (max-width: 63.99rem)",
        mobile: "(max-width: 39.99rem)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, tablet, reducedMotion } = context.conditions ?? {};
        if (reducedMotion) {
          return;
        }

        const capSection = main.querySelector<HTMLElement>("#capabilities");
        if (!capSection) {
          return;
        }

        const dirSign = document.documentElement.dir === "rtl" ? -1 : 1;

        const capEntryCtx = gsap.context(() => {
          if (desktop) {
            const capPairs = Array.from(
              capSection.querySelectorAll<HTMLElement>(
                "[data-choreo='cap-pair']",
              ),
            );

            for (const pair of capPairs) {
              if (enteredCapabilities.has(pair) || !isBelowFold(pair)) {
                continue;
              }

              const leadingUnit = pair.querySelector<HTMLElement>(
                "[data-choreo='cap-unit-leading']",
              );
              const trailingUnit = pair.querySelector<HTMLElement>(
                "[data-choreo='cap-unit-trailing']",
              );
              const leadingFigure = leadingUnit?.querySelector<HTMLElement>(
                "[data-choreo='cap-figure-entry']",
              );
              const trailingFigure = trailingUnit?.querySelector<HTMLElement>(
                "[data-choreo='cap-figure-entry']",
              );
              const leadingAside = leadingUnit?.querySelector<HTMLElement>(
                "[data-choreo='cap-aside-entry']",
              );
              const trailingAside = trailingUnit?.querySelector<HTMLElement>(
                "[data-choreo='cap-aside-entry']",
              );

              const leadFigures = [leadingFigure, trailingFigure].filter(
                (el): el is HTMLElement => el !== null && el !== undefined,
              );
              const allEntries = [
                leadingFigure,
                trailingFigure,
                leadingAside,
                trailingAside,
              ].filter(
                (el): el is HTMLElement => el !== null && el !== undefined,
              );

              if (allEntries.length === 0) {
                continue;
              }

              if (leadingFigure) {
                gsap.set(leadingFigure, {
                  opacity: 0,
                  xPercent: 70 * dirSign,
                  scale: 0.94,
                });
              }
              if (trailingFigure) {
                gsap.set(trailingFigure, {
                  opacity: 0,
                  xPercent: -70 * dirSign,
                  scale: 0.94,
                });
              }
              if (leadingAside) {
                gsap.set(leadingAside, { opacity: 0, x: 12 * dirSign });
              }
              if (trailingAside) {
                gsap.set(trailingAside, { opacity: 0, x: -12 * dirSign });
              }

              const pairTl = gsap.timeline({
                scrollTrigger: {
                  trigger: pair,
                  start: "top 75%",
                  once: true,
                },
                onComplete: () => {
                  enteredCapabilities.add(pair);
                  if (leadingUnit) enteredCapabilities.add(leadingUnit);
                  if (trailingUnit) enteredCapabilities.add(trailingUnit);
                  gsap.set(allEntries, { clearProps: "transform,opacity" });
                },
              });

              if (leadFigures.length > 0) {
                pairTl.to(
                  leadFigures,
                  {
                    opacity: 1,
                    duration: 0.48,
                    ease: "power2.out",
                  },
                  0,
                );
                pairTl.to(
                  leadFigures,
                  {
                    xPercent: 0,
                    scale: 1,
                    duration: 1.45,
                    ease: capSpreadEase,
                  },
                  0,
                );
              }

              if (leadingAside) {
                pairTl.to(
                  leadingAside,
                  {
                    opacity: 1,
                    x: 0,
                    duration: 0.72,
                    ease: capSupportEase,
                  },
                  0.56,
                );
              }

              if (trailingAside) {
                pairTl.to(
                  trailingAside,
                  {
                    opacity: 1,
                    x: 0,
                    duration: 0.68,
                    ease: capSupportEase,
                  },
                  0.68,
                );
              }
            }
          } else {
            const capUnits = Array.from(
              capSection.querySelectorAll<HTMLElement>(
                "[data-choreo='cap-unit-leading'], [data-choreo='cap-unit-trailing']",
              ),
            );

            for (const unit of capUnits) {
              if (enteredCapabilities.has(unit) || !isBelowFold(unit)) {
                continue;
              }

              const figure = unit.querySelector<HTMLElement>(
                "[data-choreo='cap-figure-entry']",
              );
              const aside = unit.querySelector<HTMLElement>(
                "[data-choreo='cap-aside-entry']",
              );
              const entries = [figure, aside].filter(
                (el): el is HTMLElement => el !== null,
              );

              if (entries.length === 0) {
                continue;
              }

              if (tablet) {
                if (figure) {
                  gsap.set(figure, {
                    opacity: 0,
                    x: 32 * dirSign,
                    scale: 0.96,
                  });
                }
                if (aside) {
                  gsap.set(aside, { opacity: 0, x: -10 * dirSign });
                }
              } else {
                if (figure) {
                  gsap.set(figure, { opacity: 0, y: 16, scale: 0.95 });
                }
                if (aside) {
                  gsap.set(aside, { opacity: 0, y: 8 });
                }
              }

              const unitTl = gsap.timeline({
                scrollTrigger: {
                  trigger: unit,
                  start: tablet ? "top 78%" : "top 82%",
                  once: true,
                },
                onComplete: () => {
                  enteredCapabilities.add(unit);
                  gsap.set(entries, { clearProps: "transform,opacity" });
                },
              });

              if (figure) {
                unitTl.to(
                  figure,
                  {
                    opacity: 1,
                    duration: tablet ? 0.42 : 0.38,
                    ease: "power2.out",
                  },
                  0,
                );
                unitTl.to(
                  figure,
                  {
                    x: 0,
                    y: 0,
                    scale: 1,
                    duration: tablet ? 1.05 : 0.92,
                    ease: capSpreadEase,
                  },
                  0,
                );
              }

              if (aside) {
                unitTl.to(
                  aside,
                  {
                    opacity: 1,
                    x: 0,
                    y: 0,
                    duration: tablet ? 0.68 : 0.62,
                    ease: capSupportEase,
                  },
                  tablet ? 0.32 : 0.24,
                );
              }
            }
          }

          ScrollTrigger.sort();
        }, capSection);

        return () => capEntryCtx.revert();
      },
    );

    // Desktop-only subtle opposing scroll drift on interlocking portraits and craft names
    media.add(
      "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const capSection = main.querySelector<HTMLElement>("#capabilities");
        if (!capSection) return;

        const dirSign = document.documentElement.dir === "rtl" ? -1 : 1;

        const driftCtx = gsap.context(() => {
          const pairs = Array.from(
            capSection.querySelectorAll<HTMLElement>(
              "[data-choreo='cap-pair']",
            ),
          );

          for (const pair of pairs) {
            const leadingMedia = pair.querySelector<HTMLElement>(
              "[data-choreo='cap-unit-leading'] [data-choreo='cap-drift-media']",
            );
            const trailingMedia = pair.querySelector<HTMLElement>(
              "[data-choreo='cap-unit-trailing'] [data-choreo='cap-drift-media']",
            );
            const leadingName = pair.querySelector<HTMLElement>(
              "[data-choreo='cap-unit-leading'] [data-choreo='cap-drift-name']",
            );
            const trailingName = pair.querySelector<HTMLElement>(
              "[data-choreo='cap-unit-trailing'] [data-choreo='cap-drift-name']",
            );
            const leadingAside = pair.querySelector<HTMLElement>(
              "[data-choreo='cap-unit-leading'] [data-choreo='cap-drift-aside']",
            );
            const trailingAside = pair.querySelector<HTMLElement>(
              "[data-choreo='cap-unit-trailing'] [data-choreo='cap-drift-aside']",
            );
            const leadingImgWrap = pair.querySelector<HTMLElement>(
              "[data-choreo='cap-unit-leading'] [data-choreo='cap-figure-media']",
            );
            const trailingImgWrap = pair.querySelector<HTMLElement>(
              "[data-choreo='cap-unit-trailing'] [data-choreo='cap-figure-media']",
            );

            const driftTl = gsap.timeline({
              defaults: { ease: "none" },
              scrollTrigger: {
                trigger: pair,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.75,
                invalidateOnRefresh: true,
              },
            });

            if (leadingMedia) {
              driftTl.fromTo(leadingMedia, { y: 18 }, { y: -18 }, 0);
            }
            if (trailingMedia) {
              driftTl.fromTo(trailingMedia, { y: -18 }, { y: 18 }, 0);
            }
            if (leadingName) {
              driftTl.fromTo(
                leadingName,
                { y: 12, x: -6 * dirSign },
                { y: -12, x: 6 * dirSign },
                0,
              );
            }
            if (trailingName) {
              driftTl.fromTo(
                trailingName,
                { y: -12, x: 6 * dirSign },
                { y: 12, x: -6 * dirSign },
                0,
              );
            }
            if (leadingAside) {
              driftTl.fromTo(leadingAside, { y: 8 }, { y: -8 }, 0);
            }
            if (trailingAside) {
              driftTl.fromTo(trailingAside, { y: -8 }, { y: 8 }, 0);
            }
            if (leadingImgWrap) {
              driftTl.fromTo(
                leadingImgWrap,
                { scale: 1.08, yPercent: -3 },
                { scale: 1.08, yPercent: 3 },
                0,
              );
            }
            if (trailingImgWrap) {
              driftTl.fromTo(
                trailingImgWrap,
                { scale: 1.08, yPercent: 3 },
                { scale: 1.08, yPercent: -3 },
                0,
              );
            }
          }

          ScrollTrigger.sort();
        }, capSection);

        return () => driftCtx.revert();
      },
    );

    // Calm below-fold arrival for the stacked enquiry card on non-enhanced (touch/compact) viewports
    media.add(
      {
        enhancedViewport:
          "(min-width: 64rem) and (hover: hover) and (pointer: fine)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { enhancedViewport, reducedMotion } = context.conditions ?? {};
        if (enhancedViewport || reducedMotion) {
          return;
        }

        const enquiryCard = main.querySelector<HTMLElement>(
          "[data-choreo='enquiry-fallback-card']",
        );
        if (!enquiryCard || !isBelowFold(enquiryCard)) {
          return;
        }

        const fallbackCtx = gsap.context(() => {
          gsap.set(enquiryCard, { opacity: 0, y: 14 });
          gsap.to(enquiryCard, {
            opacity: 1,
            y: 0,
            duration: 0.52,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: enquiryCard,
              start: "top 86%",
              once: true,
            },
          });
          ScrollTrigger.sort();
        }, enquiryCard);

        return () => fallbackCtx.revert();
      },
    );

    return () => media.revert();
  }, []);

  return null;
}
