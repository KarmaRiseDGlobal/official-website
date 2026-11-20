"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";

import {
  consumeCrossLayoutTransition,
  markLanguageSwitchSkip,
  PAGE_TRANSITION_COVER_ATTR,
  PAGE_TRANSITION_EVENT,
  resolveTransitionLabel,
  type PageTransitionEventDetail,
} from "@/lib/loader";

type TransitionStage = "idle" | "covering" | "covered" | "revealing";

function normalizePath(path: string): string {
  return path.replace(/\/+$/, "") || "/";
}

function isSpanishPath(path: string): boolean {
  const normalized = normalizePath(path);
  return normalized === "/es" || normalized.startsWith("/es/");
}

function buildCoverPaths(
  edgeY: number,
  curve: number,
): {
  readonly fill: string;
  readonly stroke: string;
} {
  const ctrlY = edgeY + curve;
  return {
    fill: `M 0 100 L 0 ${edgeY.toFixed(2)} Q 50 ${ctrlY.toFixed(2)} 100 ${edgeY.toFixed(2)} L 100 100 Z`,
    stroke: `M 0 ${edgeY.toFixed(2)} Q 50 ${ctrlY.toFixed(2)} 100 ${edgeY.toFixed(2)}`,
  };
}

function buildRevealPaths(
  bottomY: number,
  curve: number,
): {
  readonly fill: string;
  readonly stroke: string;
} {
  const ctrlY = bottomY + curve;
  return {
    fill: `M 0 0 L 100 0 L 100 ${bottomY.toFixed(2)} Q 50 ${ctrlY.toFixed(2)} 0 ${bottomY.toFixed(2)} Z`,
    stroke: `M 0 ${bottomY.toFixed(2)} Q 50 ${ctrlY.toFixed(2)} 100 ${bottomY.toFixed(2)}`,
  };
}

function getInternalRouteTarget(event: MouseEvent): {
  readonly href: string;
  readonly crossesLocale: boolean;
  readonly label: string;
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

  // Respect explicit opt-outs for in-page / component-level links
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

    // Same-pathname query/hash changes are component-level updates, not full-page transitions
    if (
      normalizePath(destination.pathname) ===
      normalizePath(window.location.pathname)
    ) {
      return null;
    }

    const href = `${destination.pathname}${destination.search}${destination.hash}`;
    const explicitTitle =
      anchor.getAttribute("data-transition-title") ?? undefined;

    return {
      href,
      crossesLocale:
        isSpanishPath(window.location.pathname) !==
        isSpanishPath(destination.pathname),
      label: resolveTransitionLabel(href, explicitTitle),
    };
  } catch {
    return null;
  }
}

export function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();

  const rootRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const fillPathRef = useRef<SVGPathElement>(null);
  const strokePathRef = useRef<SVGPathElement>(null);
  const labelWrapRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLParagraphElement>(null);
  const ruleRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);

  const stageRef = useRef<TransitionStage>("idle");
  const lastCommittedPathnameRef = useRef<string>(pathname);
  const activeTlRef = useRef<gsap.core.Timeline | null>(null);
  const pendingBarTweenRef = useRef<gsap.core.Tween | null>(null);
  const safetyTimerRef = useRef<number | null>(null);

  const setStage = useCallback((next: TransitionStage) => {
    stageRef.current = next;
    rootRef.current?.setAttribute(
      "data-blocking",
      next === "covering" || next === "covered" ? "true" : "false",
    );
  }, []);

  const clearTimers = () => {
    if (safetyTimerRef.current !== null) {
      window.clearTimeout(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }
  };

  const applyArchPaths = (paths: {
    readonly fill: string;
    readonly stroke: string;
  }) => {
    fillPathRef.current?.setAttribute("d", paths.fill);
    strokePathRef.current?.setAttribute("d", paths.stroke);
  };

  const revealIncomingPage = (overrideLabel?: string | null) => {
    const dim = dimRef.current;
    const svg = svgRef.current;
    const labelWrap = labelWrapRef.current;
    const labelEl = labelRef.current;
    const rule = ruleRef.current;
    const bar = barRef.current;
    const main = document.getElementById("main");

    clearTimers();
    pendingBarTweenRef.current?.kill();
    activeTlRef.current?.kill();
    setStage("revealing");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (overrideLabel && labelEl) {
      labelEl.textContent = overrideLabel;
    }

    const heroTargets = main
      ? Array.from(
          main.querySelectorAll<HTMLElement>(
            "section:first-of-type h1, section:first-of-type .hero-lead, section:first-of-type .lead",
          ),
        ).slice(0, 2)
      : [];

    const tl = gsap.timeline({
      onComplete: () => {
        setStage("idle");
        document.documentElement.removeAttribute(PAGE_TRANSITION_COVER_ATTR);
        if (dim) {
          gsap.set(dim, { autoAlpha: 0 });
        }
        if (svg) {
          gsap.set(svg, { autoAlpha: 0 });
        }
        if (labelWrap) {
          gsap.set(labelWrap, { autoAlpha: 0 });
        }
        if (labelEl) {
          gsap.set(labelEl, { clearProps: "transform,opacity" });
        }
        if (rule) {
          gsap.set(rule, { scaleX: 0, opacity: 0 });
        }
        if (bar) {
          gsap.set(bar, { opacity: 0, scaleX: 0 });
        }
        if (main) {
          gsap.set(main, { clearProps: "transform,opacity,filter" });
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

    if (bar) {
      tl.to(
        bar,
        {
          opacity: 1,
          scaleX: 1,
          duration: 0.18,
          ease: "power2.out",
        },
        0,
      ).to(
        bar,
        {
          opacity: 0,
          duration: 0.16,
          ease: "power1.out",
        },
        0.18,
      );
    }

    if (reducedMotion) {
      document.documentElement.removeAttribute(PAGE_TRANSITION_COVER_ATTR);
      if (dim) gsap.set(dim, { autoAlpha: 0 });
      if (svg) gsap.set(svg, { autoAlpha: 0 });
      if (labelWrap) gsap.set(labelWrap, { autoAlpha: 0 });
      if (main) {
        tl.fromTo(
          main,
          { opacity: 0.2 },
          { opacity: 1, duration: 0.15, ease: "power1.out" },
          0,
        );
      }
      return;
    }

    // Lock full-screen SVG arch cover immediately, then remove CSS pre-paint fallback
    applyArchPaths(buildRevealPaths(100, 0));
    if (svg) {
      gsap.set(svg, { autoAlpha: 1 });
    }
    if (dim) {
      gsap.set(dim, { autoAlpha: 0 });
    }
    document.documentElement.removeAttribute(PAGE_TRANSITION_COVER_ATTR);

    // Lift destination label softly out before pulling the arch curtain away
    if (labelWrap && labelEl) {
      tl.to(
        labelEl,
        {
          y: -18,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        },
        0.04,
      );
    }
    if (rule) {
      tl.to(
        rule,
        {
          scaleX: 0,
          opacity: 0,
          duration: 0.18,
          ease: "power2.in",
        },
        0.04,
      );
    }

    const archProxy = { bottomY: 100, curve: 0 };
    const updateReveal = () => {
      applyArchPaths(buildRevealPaths(archProxy.bottomY, archProxy.curve));
    };

    tl.to(
      archProxy,
      {
        bottomY: 0,
        duration: 0.5,
        ease: "power4.inOut",
        onUpdate: updateReveal,
      },
      0.06,
    )
      .to(
        archProxy,
        {
          curve: -20,
          duration: 0.2,
          ease: "power2.out",
          onUpdate: updateReveal,
        },
        0.06,
      )
      .to(
        archProxy,
        {
          curve: 0,
          duration: 0.3,
          ease: "power2.in",
          onUpdate: updateReveal,
        },
        0.26,
      );

    if (main) {
      tl.fromTo(
        main,
        { opacity: 0.01, y: 24, scale: 1, filter: "none" },
        {
          opacity: 1,
          y: 0,
          duration: 0.46,
          ease: "power3.out",
        },
        0.16,
      );
    }

    if (heroTargets.length > 0) {
      tl.fromTo(
        heroTargets,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.42,
          stagger: 0.07,
          ease: "power3.out",
        },
        0.22,
      );
    }
  };

  const revealRef = useRef(revealIncomingPage);
  useEffect(() => {
    revealRef.current = revealIncomingPage;
  });

  // Intercept cross-page link clicks and language switch events to play the convex arch curtain before routing.
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const startCoverAndNavigate = (
      href: string,
      isLanguageSwitch: boolean,
      label: string,
    ) => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      if (reducedMotion) {
        if (isLanguageSwitch) {
          markLanguageSwitchSkip(label);
        }
        router.push(href);
        return;
      }

      const dim = dimRef.current;
      const svg = svgRef.current;
      const labelWrap = labelWrapRef.current;
      const labelEl = labelRef.current;
      const rule = ruleRef.current;
      const bar = barRef.current;
      const main = document.getElementById("main");

      if (!svg || !fillPathRef.current || !strokePathRef.current) {
        if (isLanguageSwitch) {
          markLanguageSwitchSkip(label);
        }
        router.push(href);
        return;
      }

      clearTimers();
      pendingBarTweenRef.current?.kill();
      activeTlRef.current?.kill();

      setStage("covering");

      if (labelEl) {
        labelEl.textContent = label;
      }

      applyArchPaths(buildCoverPaths(100, 0));
      gsap.set(svg, { autoAlpha: 1 });
      if (labelWrap) {
        gsap.set(labelWrap, { autoAlpha: 1 });
      }
      if (labelEl) {
        gsap.set(labelEl, { y: 26, opacity: 0 });
      }
      if (rule) {
        gsap.set(rule, { scaleX: 0, opacity: 1 });
      }

      if (bar) {
        gsap.set(bar, {
          opacity: 1,
          scaleX: 0.06,
          transformOrigin: "left center",
        });
        pendingBarTweenRef.current = gsap.to(bar, {
          scaleX: 0.84,
          duration: 1.05,
          ease: "power2.out",
        });
      }

      const archProxy = { edgeY: 100, curve: 0 };
      const updateCover = () => {
        applyArchPaths(buildCoverPaths(archProxy.edgeY, archProxy.curve));
      };

      const coverTl = gsap.timeline({
        onComplete: () => {
          setStage("covered");
          if (isLanguageSwitch) {
            markLanguageSwitchSkip(label);
          }
          router.push(href);

          safetyTimerRef.current = window.setTimeout(() => {
            if (
              stageRef.current === "covered" ||
              stageRef.current === "covering"
            ) {
              revealRef.current();
            }
          }, 2400);
        },
      });

      activeTlRef.current = coverTl;

      if (main) {
        coverTl.to(
          main,
          {
            y: -30,
            scale: 0.988,
            filter: "blur(3px)",
            duration: 0.34,
            ease: "power2.inOut",
          },
          0,
        );
      }

      if (dim) {
        coverTl.fromTo(
          dim,
          { autoAlpha: 0 },
          {
            autoAlpha: 0.34,
            duration: 0.3,
            ease: "power2.out",
          },
          0,
        );
      }

      coverTl
        .to(
          archProxy,
          {
            edgeY: 0,
            duration: 0.38,
            ease: "power3.inOut",
            onUpdate: updateCover,
          },
          0,
        )
        .to(
          archProxy,
          {
            curve: -24,
            duration: 0.18,
            ease: "power2.out",
            onUpdate: updateCover,
          },
          0,
        )
        .to(
          archProxy,
          {
            curve: 0,
            duration: 0.2,
            ease: "power2.in",
            onUpdate: updateCover,
          },
          0.18,
        );

      if (labelEl) {
        coverTl.to(
          labelEl,
          {
            y: 0,
            opacity: 1,
            duration: 0.24,
            ease: "power3.out",
          },
          0.16,
        );
      }

      if (rule) {
        coverTl.to(
          rule,
          {
            scaleX: 1,
            duration: 0.26,
            ease: "power2.out",
          },
          0.18,
        );
      }
    };

    const onCaptureClick = (event: MouseEvent) => {
      if (stageRef.current === "covering" || stageRef.current === "covered") {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      const target = getInternalRouteTarget(event);
      if (!target) {
        return;
      }

      event.preventDefault();
      startCoverAndNavigate(target.href, target.crossesLocale, target.label);
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
      const label = resolveTransitionLabel(detail.href, detail.label);
      startCoverAndNavigate(
        detail.href,
        Boolean(detail.isLanguageSwitch),
        label,
      );
    };

    document.addEventListener("click", onCaptureClick, true);
    window.addEventListener(PAGE_TRANSITION_EVENT, onCustomNavigate);

    return () => {
      document.removeEventListener("click", onCaptureClick, true);
      window.removeEventListener(PAGE_TRANSITION_EVENT, onCustomNavigate);
    };
  }, [router, setStage]);

  // Trigger incoming reveal when cross-layout language switch mounts (curtain already pre-painted via data-transition-cover).
  useEffect(() => {
    const crossLayout = consumeCrossLayoutTransition();
    if (!crossLayout.active) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      revealRef.current(crossLayout.label);
    });

    return () => cancelAnimationFrame(frame);
  }, []);

  // Trigger incoming reveal whenever pathname changes after navigation (StrictMode-safe).
  useEffect(() => {
    if (pathname === lastCommittedPathnameRef.current) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      lastCommittedPathnameRef.current = pathname;
      revealRef.current();
    });

    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <div
      ref={rootRef}
      className="page-transition"
      data-blocking="false"
      aria-hidden="true"
    >
      <div ref={barRef} className="page-transition-bar" />
      <div ref={dimRef} className="page-transition-dim" />
      <div className="page-transition-cover-fallback" />

      <svg
        ref={svgRef}
        className="page-transition-svg"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient
            id="kr-arch-transition-grad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#111914" />
            <stop offset="100%" stopColor="#182d20" />
          </linearGradient>
        </defs>
        <path
          ref={fillPathRef}
          className="page-transition-arch-fill"
          d="M 0 100 L 0 100 Q 50 100 100 100 L 100 100 Z"
          fill="url(#kr-arch-transition-grad)"
        />
        <path
          ref={strokePathRef}
          className="page-transition-arch-stroke"
          d="M 0 100 Q 50 100 100 100"
          fill="none"
          stroke="#b99a58"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div ref={labelWrapRef} className="page-transition-label-wrap">
        <div className="page-transition-label-mask">
          <p ref={labelRef} className="page-transition-label" />
        </div>
        <span ref={ruleRef} className="page-transition-rule" />
      </div>
    </div>
  );
}
