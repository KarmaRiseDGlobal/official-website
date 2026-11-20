"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

declare global {
  interface Window {
    __lenis?: undefined;
  }
}

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({
      ignoreMobileResize: true,
    });
    ScrollTrigger.refresh();

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
      window.removeEventListener("orientationchange", handleOrientationChange);
      if (orientationTimer !== null) {
        window.clearTimeout(orientationTimer);
      }
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    const id = requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return null;
}
