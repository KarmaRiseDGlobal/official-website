"use client";

import { useEffect, useState } from "react";

const TEXT_ZOOM_FONT_THRESHOLD_PX = 20;

function readIsTextZoomed(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const rootFontSize = parseFloat(
    window.getComputedStyle(document.documentElement).fontSize,
  );
  return (
    Number.isFinite(rootFontSize) && rootFontSize > TEXT_ZOOM_FONT_THRESHOLD_PX
  );
}

/**
 * Returns true when root font scaling exceeds 125% (e.g., 200% browser text zoom),
 * signaling fixed-height pinned scroll sections to drop into fluid vertical flow
 * so resized text never clips (WCAG 2.1 AA SC 1.4.4).
 */
export function useTextZoomGuard(): boolean {
  const [isTextZoomed, setIsTextZoomed] = useState(false);

  useEffect(() => {
    const sync = () => {
      const next = readIsTextZoomed();
      setIsTextZoomed((prev) => (prev === next ? prev : next));
    };

    sync();

    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    window.addEventListener("resize", sync, { passive: true });
    window.visualViewport?.addEventListener("resize", sync, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", sync);
      window.visualViewport?.removeEventListener("resize", sync);
    };
  }, []);

  return isTextZoomed;
}
