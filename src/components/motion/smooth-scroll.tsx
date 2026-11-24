"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export const SCROLL_TOP_EVENT = "karmarise:scroll-top";
export const SCROLL_TO_EVENT = "karmarise:scroll-to";
export const SCROLL_BY_EVENT = "karmarise:scroll-by";

export interface SmoothScrollToDetail {
  readonly top: number;
  readonly duration?: number;
  readonly immediate?: boolean;
  readonly lock?: boolean;
}

export interface SmoothScrollByDetail {
  readonly delta: number;
  readonly duration?: number;
  readonly immediate?: boolean;
}

function isSmoothScrollToDetail(value: unknown): value is SmoothScrollToDetail {
  return (
    typeof value === "object" &&
    value !== null &&
    "top" in value &&
    typeof value.top === "number" &&
    Number.isFinite(value.top)
  );
}

function isSmoothScrollByDetail(value: unknown): value is SmoothScrollByDetail {
  return (
    typeof value === "object" &&
    value !== null &&
    "delta" in value &&
    typeof value.delta === "number" &&
    Number.isFinite(value.delta)
  );
}

export function requestSmoothScrollTo(detail: SmoothScrollToDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<SmoothScrollToDetail>(SCROLL_TO_EVENT, { detail }),
  );
}

export function requestSmoothScrollBy(detail: SmoothScrollByDetail): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<SmoothScrollByDetail>(SCROLL_BY_EVENT, { detail }),
  );
}

export function SmoothScroll() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let lenis: Lenis | null = null;
    let onTick: ((time: number) => void) | null = null;

    const mountLenis = () => {
      if (lenis || reducedMotionQuery.matches) {
        return;
      }

      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        syncTouch: false,
        touchMultiplier: 2,
        prevent: (node) =>
          node instanceof Element &&
          node.closest(
            "[data-lenis-prevent], .menu-surface, .karmarise-chat-scroll",
          ) !== null,
      });

      lenisRef.current = lenis;
      lenis.on("scroll", ScrollTrigger.update);

      onTick = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(onTick);
      gsap.ticker.lagSmoothing(0);

      if (document.body.dataset.menuOpen === "true") {
        lenis.stop();
      }
    };

    const destroyLenis = () => {
      if (onTick) {
        gsap.ticker.remove(onTick);
        onTick = null;
      }
      if (lenis) {
        lenis.destroy();
        lenis = null;
      }
      lenisRef.current = null;
      gsap.ticker.lagSmoothing(500, 33);
    };

    mountLenis();
    ScrollTrigger.refresh();

    const onReducedMotionChange = () => {
      if (reducedMotionQuery.matches) {
        destroyLenis();
      } else {
        mountLenis();
        ScrollTrigger.refresh();
      }
    };

    const bodyObserver = new MutationObserver(() => {
      if (!lenis) return;
      if (document.body.dataset.menuOpen === "true") {
        lenis.stop();
      } else {
        lenis.start();
      }
    });

    bodyObserver.observe(document.body, {
      attributes: true,
      attributeFilter: ["data-menu-open"],
    });

    const handleScrollTopEvent = () => {
      if (lenis && !reducedMotionQuery.matches) {
        lenis.scrollTo(0, { duration: 1 });
      } else {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: reducedMotionQuery.matches ? "auto" : "smooth",
        });
      }
    };

    const handleScrollToEvent = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      if (!isSmoothScrollToDetail(event.detail)) return;
      const detail = event.detail;

      if (lenis && !reducedMotionQuery.matches) {
        const clampedTop = Math.max(0, Math.min(lenis.limit, detail.top));
        lenis.scrollTo(clampedTop, {
          duration: detail.immediate ? 0 : (detail.duration ?? 0.78),
          immediate: detail.immediate ?? false,
          lock: detail.lock ?? false,
        });
      } else {
        window.scrollTo({
          top: Math.max(0, detail.top),
          left: 0,
          behavior:
            detail.immediate || reducedMotionQuery.matches ? "auto" : "smooth",
        });
      }
    };

    const handleScrollByEvent = (event: Event) => {
      if (!(event instanceof CustomEvent)) return;
      if (!isSmoothScrollByDetail(event.detail)) return;
      const detail = event.detail;

      if (lenis && !reducedMotionQuery.matches) {
        const nextTop = Math.max(
          0,
          Math.min(lenis.limit, lenis.targetScroll + detail.delta),
        );
        lenis.scrollTo(nextTop, {
          duration: detail.immediate ? 0 : (detail.duration ?? 0.45),
          immediate: detail.immediate ?? false,
        });
      } else {
        window.scrollBy({
          top: detail.delta,
          behavior: "instant",
        });
      }
    };

    let isMounted = true;
    let orientationTimer: number | null = null;

    const handleOrientationChange = () => {
      if (orientationTimer !== null) {
        window.clearTimeout(orientationTimer);
      }
      orientationTimer = window.setTimeout(() => {
        orientationTimer = null;
        if (isMounted) {
          ScrollTrigger.refresh();
        }
      }, 250);
    };

    reducedMotionQuery.addEventListener("change", onReducedMotionChange);
    window.addEventListener(SCROLL_TOP_EVENT, handleScrollTopEvent);
    window.addEventListener(SCROLL_TO_EVENT, handleScrollToEvent);
    window.addEventListener(SCROLL_BY_EVENT, handleScrollByEvent);
    window.addEventListener("orientationchange", handleOrientationChange);

    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (isMounted) {
          ScrollTrigger.refresh();
        }
      });
    }

    return () => {
      isMounted = false;
      bodyObserver.disconnect();
      reducedMotionQuery.removeEventListener("change", onReducedMotionChange);
      window.removeEventListener(SCROLL_TOP_EVENT, handleScrollTopEvent);
      window.removeEventListener(SCROLL_TO_EVENT, handleScrollToEvent);
      window.removeEventListener(SCROLL_BY_EVENT, handleScrollByEvent);
      window.removeEventListener("orientationchange", handleOrientationChange);
      if (orientationTimer !== null) {
        window.clearTimeout(orientationTimer);
      }
      destroyLenis();
    };
  }, []);

  useEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const id = window.requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => window.cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
