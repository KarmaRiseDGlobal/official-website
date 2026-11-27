"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import {
  consumeCrossLayoutTransition,
  isHomeRoute,
  markLanguageSwitchSkip,
  PAGE_TRANSITION_COVER_ATTR,
  PAGE_TRANSITION_EVENT,
  PAGE_TRANSITION_TONE_ATTR,
  resolveRouteTone,
  type PageTransitionEventDetail,
  type TransitionTone,
} from "@/lib/loader";

type TransitionStage = "idle" | "covering" | "covered" | "revealing";

function normalizePath(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

function isSpanishPath(path: string): boolean {
  const normalized = normalizePath(path);
  return normalized === "/es" || normalized.startsWith("/es/");
}

function focusMainLandmark() {
  const main = document.getElementById("main");
  if (!main) {
    return;
  }
  const active = document.activeElement;
  if (
    active &&
    active !== document.body &&
    active !== document.documentElement &&
    main.contains(active)
  ) {
    return;
  }
  if (!main.hasAttribute("tabindex")) {
    main.setAttribute("tabindex", "-1");
  }
  main.focus({ preventScroll: true });
}

function getInternalRouteTarget(event: MouseEvent): {
  readonly href: string;
  readonly crossesLocale: boolean;
  readonly tone: TransitionTone;
  readonly reverse: boolean;
} | null {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  ) {
    return null;
  }

  const target = event.target;
  if (!(target instanceof Element)) {
    return null;
  }

  const anchor = target.closest("a[href]");
  if (!(anchor instanceof HTMLAnchorElement)) {
    return null;
  }

  if (anchor.closest("[data-no-page-transition]")) {
    return null;
  }

  if (
    anchor.hasAttribute("download") ||
    (anchor.target && anchor.target !== "_self")
  ) {
    return null;
  }

  const rawHref = anchor.getAttribute("href");
  if (
    !rawHref ||
    rawHref.startsWith("#") ||
    rawHref.startsWith("mailto:") ||
    rawHref.startsWith("tel:")
  ) {
    return null;
  }

  try {
    const destination = new URL(anchor.href, window.location.href);
    if (destination.origin !== window.location.origin) {
      return null;
    }

    if (
      normalizePath(destination.pathname) ===
      normalizePath(window.location.pathname)
    ) {
      return null;
    }

    const href = `${destination.pathname}${destination.search}${destination.hash}`;

    return {
      href,
      crossesLocale:
        isSpanishPath(window.location.pathname) !==
        isSpanishPath(destination.pathname),
      tone: resolveRouteTone(href),
      reverse: isHomeRoute(href),
    };
  } catch {
    return null;
  }
}

export function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();

  const rootRef = useRef<HTMLDivElement>(null);
  const band0Ref = useRef<HTMLDivElement>(null);
  const band1Ref = useRef<HTMLDivElement>(null);
  const band2Ref = useRef<HTMLDivElement>(null);

  const stageRef = useRef<TransitionStage>("idle");
  const reverseRef = useRef(false);
  const lastCommittedPathnameRef = useRef<string>(pathname);
  const committedWhileCoveringRef = useRef<string | null>(null);
  const activeTlRef = useRef<gsap.core.Timeline | null>(null);
  const pushTimerRef = useRef<number | null>(null);
  const safetyTimerRef = useRef<number | null>(null);

  const clearTimers = useCallback(() => {
    if (pushTimerRef.current !== null) {
      window.clearTimeout(pushTimerRef.current);
      pushTimerRef.current = null;
    }
    if (safetyTimerRef.current !== null) {
      window.clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  }, []);

  const setStage = useCallback((nextStage: TransitionStage) => {
    stageRef.current = nextStage;
    const root = rootRef.current;
    if (root) {
      root.dataset.blocking =
        nextStage === "covering" || nextStage === "covered" ? "true" : "false";
    }
  }, []);

  const getOrderedBands = (reverse: boolean): HTMLDivElement[] => {
    const bands = [band0Ref.current, band1Ref.current, band2Ref.current].filter(
      (el): el is HTMLDivElement => el !== null,
    );
    return reverse ? [...bands].reverse() : bands;
  };

  const revealIncomingPage = (overrideTone?: TransitionTone) => {
    const root = rootRef.current;
    const bands = getOrderedBands(reverseRef.current);
    const main = document.getElementById("main");

    clearTimers();
    committedWhileCoveringRef.current = null;
    activeTlRef.current?.kill();
    setStage("revealing");

    if (root && overrideTone) {
      root.dataset.tone = overrideTone;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const heroTargets = main
      ? Array.from(
          main.querySelectorAll<HTMLElement>(
            "section:first-of-type h1, section:first-of-type .hero-lead, section:first-of-type .lead",
          ),
        ).slice(0, 2)
      : [];

    document.documentElement.removeAttribute(PAGE_TRANSITION_COVER_ATTR);
    document.documentElement.removeAttribute(PAGE_TRANSITION_TONE_ATTR);

    const tl = gsap.timeline({
      onComplete: () => {
        setStage("idle");
        if (bands.length > 0) {
          gsap.set(bands, { autoAlpha: 0, clearProps: "transform" });
        }
        if (heroTargets.length > 0) {
          gsap.set(heroTargets, { clearProps: "transform,opacity" });
        }
        requestAnimationFrame(() => {
          ScrollTrigger.refresh();
        });
      },
    });

    activeTlRef.current = tl;

    if (reducedMotion) {
      if (bands.length > 0) {
        gsap.set(bands, { autoAlpha: 0, clearProps: "transform" });
      }
      if (heroTargets.length > 0) {
        tl.fromTo(
          heroTargets,
          { opacity: 0.25 },
          { opacity: 1, duration: 0.14, ease: "power1.out" },
          0,
        );
      }
      return;
    }

    if (bands.length > 0) {
      tl.fromTo(
        bands,
        { autoAlpha: 1, y: 0, yPercent: 0 },
        {
          yPercent: -100,
          duration: 0.38,
          stagger: 0.04,
          ease: "power4.inOut",
          force3D: true,
        },
        0,
      );
    }

    if (heroTargets.length > 0) {
      tl.fromTo(
        heroTargets,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.34,
          stagger: 0.05,
          ease: "power3.out",
          force3D: true,
        },
        0.1,
      );
    }
  };

  const revealRef = useRef(revealIncomingPage);
  useEffect(() => {
    revealRef.current = revealIncomingPage;
  });

  // Intercept cross-page links and language switches to sweep the 3 tone-matched bands while initiating routing early.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const startCoverAndNavigate = (
      href: string,
      isLanguageSwitch: boolean,
      tone: TransitionTone,
      reverse: boolean,
    ) => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        if (isLanguageSwitch) {
          markLanguageSwitchSkip(tone);
        }
        router.push(href);
        return;
      }

      const root = rootRef.current;
      const bands = getOrderedBands(reverse);
      if (!root || bands.length === 0) {
        if (isLanguageSwitch) {
          markLanguageSwitchSkip(tone);
        }
        router.push(href);
        return;
      }

      clearTimers();
      committedWhileCoveringRef.current = null;
      activeTlRef.current?.kill();

      reverseRef.current = reverse;
      root.dataset.tone = tone;
      setStage("covering");

      let pushed = false;
      const triggerPush = () => {
        if (pushed) return;
        pushed = true;
        if (isLanguageSwitch) {
          markLanguageSwitchSkip(tone);
        }
        router.push(href);
      };

      // Begin same-layout route push early (~100ms) so navigation feels brisk while bands glide into place.
      if (!isLanguageSwitch) {
        pushTimerRef.current = window.setTimeout(() => {
          pushTimerRef.current = null;
          triggerPush();
        }, 100);
      }

      const coverTl = gsap.timeline({
        onComplete: () => {
          setStage("covered");
          triggerPush();

          if (committedWhileCoveringRef.current !== null) {
            const committedPath = committedWhileCoveringRef.current;
            committedWhileCoveringRef.current = null;
            revealRef.current(resolveRouteTone(committedPath));
            return;
          }

          safetyTimerRef.current = window.setTimeout(() => {
            if (
              stageRef.current === "covered" ||
              stageRef.current === "covering"
            ) {
              revealRef.current();
            }
          }, 2200);
        },
      });

      activeTlRef.current = coverTl;

      coverTl.fromTo(
        bands,
        { autoAlpha: 1, y: 0, yPercent: 100 },
        {
          yPercent: 0,
          duration: 0.26,
          stagger: 0.035,
          ease: "power3.inOut",
          force3D: true,
        },
        0,
      );
    };

    const onCaptureClick = (event: MouseEvent) => {
      const target = getInternalRouteTarget(event);
      if (!target) {
        return;
      }

      if (stageRef.current === "covering") {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      startCoverAndNavigate(
        target.href,
        target.crossesLocale,
        target.tone,
        target.reverse,
      );
    };

    const onCustomNavigate = (event: Event) => {
      if (!(event instanceof CustomEvent)) {
        return;
      }
      const detail = event.detail as PageTransitionEventDetail | undefined;
      if (!detail?.href) {
        return;
      }
      event.preventDefault();
      const tone = resolveRouteTone(detail.href);
      startCoverAndNavigate(
        detail.href,
        Boolean(detail.isLanguageSwitch),
        tone,
        isHomeRoute(detail.href),
      );
    };

    document.addEventListener("click", onCaptureClick, true);
    window.addEventListener(PAGE_TRANSITION_EVENT, onCustomNavigate);

    return () => {
      clearTimers();
      document.removeEventListener("click", onCaptureClick, true);
      window.removeEventListener(PAGE_TRANSITION_EVENT, onCustomNavigate);
    };
  }, [router, setStage, clearTimers]);

  // Trigger incoming reveal when cross-layout EN/ES switch mounts (bands pre-painted via data-transition-cover).
  useEffect(() => {
    const crossLayout = consumeCrossLayoutTransition();
    if (!crossLayout.active) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      revealRef.current(crossLayout.tone);
      focusMainLandmark();
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  // Trigger incoming reveal and restore focus to #main whenever pathname changes after SPA navigation.
  useEffect(() => {
    if (pathname === lastCommittedPathnameRef.current) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      lastCommittedPathnameRef.current = pathname;
      focusMainLandmark();

      if (stageRef.current === "covering") {
        committedWhileCoveringRef.current = pathname;
        return;
      }

      if (stageRef.current === "covered") {
        revealRef.current(resolveRouteTone(pathname));
      }
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      ref={rootRef}
      className="page-transition"
      data-blocking="false"
      data-tone="dark"
      aria-hidden="true"
    >
      <div className="page-transition-bands">
        <div ref={band0Ref} className="page-transition-band" />
        <div ref={band1Ref} className="page-transition-band" />
        <div ref={band2Ref} className="page-transition-band" />
      </div>
    </div>
  );
}
