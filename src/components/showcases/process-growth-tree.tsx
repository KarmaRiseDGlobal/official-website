"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import type { SiteLanguage } from "@/lib/urls";

interface StageRowBox {
  readonly left: number;
  readonly right: number;
  readonly top: number;
  readonly bottom: number;
}

interface ProcessLineGeometry {
  readonly width: number;
  readonly height: number;
  readonly startX: number;
  readonly startY: number;
  readonly endX: number;
  readonly endY: number;
  readonly path: string;
  readonly strokeWidth: number;
}

function r(value: number): string {
  return value.toFixed(1);
}

/**
 * Computes a single continuous serpentine guide line that begins centered below
 * the process header, sweeps around the outer left edge of Stage 01, glides
 * across the inter-stage gap to the outer right edge of Stage 02, and weaves
 * cleanly around all six stages (mirroring automatically in RTL).
 */
function measureProcessLine(
  container: HTMLElement,
): ProcessLineGeometry | null {
  const rootRect = container.getBoundingClientRect();
  const width = rootRect.width;
  const height = rootRect.height;
  if (width < 160 || height < 240) return null;

  const originEl =
    container.querySelector<HTMLElement>("[data-process-origin]") ??
    container.querySelector<HTMLElement>("[data-process-intro]");
  const rows = Array.from(
    container.querySelectorAll<HTMLElement>("[data-process-row]"),
  );
  if (rows.length === 0) return null;

  const isDesktopSplit = window.matchMedia("(min-width: 48rem)").matches;
  const isRtl = window.getComputedStyle(container).direction === "rtl";

  const boxes: StageRowBox[] = rows.map((row) => {
    const rowRect = row.getBoundingClientRect();
    const mediaEl = row.querySelector<HTMLElement>("[data-stage-media]");
    const contentEl = row.querySelector<HTMLElement>("[data-stage-content]");
    const mediaRect = mediaEl?.getBoundingClientRect();
    const contentRect = contentEl?.getBoundingClientRect();

    const left =
      (mediaRect && contentRect
        ? Math.min(mediaRect.left, contentRect.left)
        : rowRect.left) - rootRect.left;
    const right =
      (mediaRect && contentRect
        ? Math.max(mediaRect.right, contentRect.right)
        : rowRect.right) - rootRect.left;

    return {
      left,
      right,
      top: rowRect.top - rootRect.top,
      bottom: rowRect.bottom - rootRect.top,
    };
  });

  const firstBox = boxes[0]!;
  const lastBox = boxes[boxes.length - 1]!;

  const minContentLeft = Math.min(...boxes.map((b) => b.left));
  const maxContentRight = Math.max(...boxes.map((b) => b.right));

  const railOffset = isDesktopSplit ? 30 : 11;
  const leftRailX = Math.max(8, minContentLeft - railOffset);
  const rightRailX = Math.min(width - 8, maxContentRight + railOffset);
  const railSpan = Math.max(40, rightRailX - leftRailX);

  const originRect = originEl?.getBoundingClientRect();
  const startX = originRect
    ? originRect.left + originRect.width * 0.5 - rootRect.left
    : width * 0.5;
  const startY = originRect
    ? Math.max(
        10,
        originRect.bottom - rootRect.top + (isDesktopSplit ? 16 : 12),
      )
    : Math.max(10, firstBox.top - (isDesktopSplit ? 48 : 28));

  const cornerR = Math.min(
    isDesktopSplit ? 42 : 16,
    railSpan * 0.18,
    Math.max(12, (firstBox.bottom - firstBox.top) * 0.16),
  );

  const sideForIndex = (idx: number): "left" | "right" =>
    (idx % 2 === 0) !== isRtl ? "left" : "right";
  const railXForSide = (side: "left" | "right"): number =>
    side === "left" ? leftRailX : rightRailX;

  const firstSide = sideForIndex(0);
  const firstRailX = railXForSide(firstSide);
  const firstDir = firstRailX < startX ? -1 : 1;

  // Sweep horizontally from directly below the header button over Stage 01 into its outer rail
  const entryY = Math.max(
    startY + 4,
    Math.min(
      firstBox.top - (isDesktopSplit ? 22 : 12),
      startY + (isDesktopSplit ? 16 : 10),
    ),
  );
  const entrySpan = Math.abs(firstRailX - startX);
  const entryCornerR = Math.min(cornerR, Math.max(10, entrySpan * 0.42));
  const entryEndX = firstRailX - firstDir * entryCornerR;
  const entryArchLift = isDesktopSplit ? 7 : 2;

  const commands: string[] = [
    `M ${r(startX)} ${r(startY)}`,
    `C ${r(startX + firstDir * entrySpan * 0.34)} ${r(startY + 2)}, ${r(entryEndX - firstDir * entrySpan * 0.24)} ${r(entryY - entryArchLift)}, ${r(entryEndX)} ${r(entryY)}`,
    `C ${r(firstRailX - firstDir * entryCornerR * 0.22)} ${r(entryY)}, ${r(firstRailX)} ${r(entryY + entryCornerR * 0.22)}, ${r(firstRailX)} ${r(entryY + entryCornerR)}`,
  ];

  const verticalBow = isDesktopSplit ? 6 : 2;
  let endX = width * 0.5;
  let endY = Math.min(height - 10, lastBox.bottom + (isDesktopSplit ? 34 : 20));

  for (let i = 0; i < boxes.length; i += 1) {
    const box = boxes[i]!;
    const side = sideForIndex(i);
    const railX = railXForSide(side);
    const outDir = side === "left" ? -1 : 1;

    const segTopY =
      i === 0
        ? entryY + entryCornerR
        : (boxes[i - 1]!.bottom + box.top) * 0.5 + cornerR;

    const isLast = i === boxes.length - 1;
    const nextBox = !isLast ? boxes[i + 1]! : null;
    const rawGap = nextBox
      ? nextBox.top - box.bottom
      : isDesktopSplit
        ? 68
        : 40;
    const turnR = Math.min(cornerR, Math.max(10, rawGap * 0.42));

    const targetTurnY = nextBox
      ? box.bottom + rawGap * 0.5
      : Math.min(height - 10, box.bottom + (isDesktopSplit ? 34 : 20));
    const segBottomY = Math.max(segTopY + 8, targetTurnY - turnR);
    const segH = segBottomY - segTopY;

    // Gentle organic vertical descent along the outer edge of stage i
    commands.push(
      `C ${r(railX + outDir * verticalBow)} ${r(segTopY + segH * 0.33)}, ${r(railX + outDir * verticalBow)} ${r(segTopY + segH * 0.67)}, ${r(railX)} ${r(segBottomY)}`,
    );

    if (nextBox) {
      const nextSide = sideForIndex(i + 1);
      const nextRailX = railXForSide(nextSide);
      const crossDir = nextRailX > railX ? 1 : -1;

      const crossStartX = railX + crossDir * turnR;
      const crossEndX = nextRailX - crossDir * turnR;
      const crossDx = crossEndX - crossStartX;
      const waveAmp = isDesktopSplit
        ? Math.min(20, Math.max(6, rawGap * 0.24))
        : Math.min(7, Math.max(2, rawGap * 0.16));

      // Turn out from stage i's outer edge into the open inter-stage gap
      commands.push(
        `C ${r(railX)} ${r(targetTurnY - turnR * 0.22)}, ${r(railX + crossDir * turnR * 0.22)} ${r(targetTurnY)}, ${r(crossStartX)} ${r(targetTurnY)}`,
      );

      // Gentle undulating wave crossing through the gap to the opposite side
      commands.push(
        `C ${r(crossStartX + crossDx * 0.34)} ${r(targetTurnY + waveAmp)}, ${r(crossStartX + crossDx * 0.68)} ${r(targetTurnY - waveAmp * 0.55)}, ${r(crossEndX)} ${r(targetTurnY)}`,
      );

      // Turn cleanly down onto stage i+1's outer edge
      commands.push(
        `C ${r(nextRailX - crossDir * turnR * 0.22)} ${r(targetTurnY)}, ${r(nextRailX)} ${r(targetTurnY + turnR * 0.22)}, ${r(nextRailX)} ${r(targetTurnY + turnR)}`,
      );
    } else {
      // Graceful inward finish beneath Stage 06
      const inDir = side === "left" ? 1 : -1;
      endY = targetTurnY;
      endX = width * 0.5;
      const tailStartX = railX + inDir * turnR;
      const tailDx = endX - tailStartX;

      commands.push(
        `C ${r(railX)} ${r(endY - turnR * 0.22)}, ${r(railX + inDir * turnR * 0.22)} ${r(endY)}, ${r(tailStartX)} ${r(endY)}`,
      );
      commands.push(
        `C ${r(tailStartX + tailDx * 0.45)} ${r(endY + (isDesktopSplit ? 6 : 2))}, ${r(endX - tailDx * 0.25)} ${r(endY)}, ${r(endX)} ${r(endY)}`,
      );
    }
  }

  return {
    width,
    height,
    startX,
    startY,
    endX,
    endY,
    path: commands.join(" "),
    strokeWidth: isDesktopSplit ? 2 : 1.65,
  };
}

interface ProcessGrowthTreeProps {
  readonly language: SiteLanguage;
}

export function ProcessGrowthTree({ language }: ProcessGrowthTreeProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `process-line-grad-${uid}`;

  const layerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [geometry, setGeometry] = useState<ProcessLineGeometry | null>(null);

  useLayoutEffect(() => {
    const container = layerRef.current?.parentElement;
    if (!container) return;

    let rafId: number | null = null;
    let cancelled = false;

    const measure = () => {
      if (cancelled) return;
      setGeometry(measureProcessLine(container));
    };

    const scheduleMeasure = () => {
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        rafId = null;
        measure();
      });
    };

    measure();

    const observer = new ResizeObserver(scheduleMeasure);
    observer.observe(container);

    const dirObserver = new MutationObserver(scheduleMeasure);
    dirObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    if (document.fonts?.ready) {
      void document.fonts.ready.then(scheduleMeasure);
    }

    return () => {
      cancelled = true;
      if (rafId !== null) window.cancelAnimationFrame(rafId);
      observer.disconnect();
      dirObserver.disconnect();
    };
  }, [language]);

  useEffect(() => {
    const container = layerRef.current?.parentElement;
    const svg = svgRef.current;
    if (!container || !svg || !geometry) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const activePath = svg.querySelector<SVGPathElement>(
          "[data-process-line-active]",
        );
        if (!activePath) return;

        const totalLength = activePath.getTotalLength();
        gsap.set(activePath, {
          strokeDasharray: totalLength,
          strokeDashoffset: totalLength,
        });

        gsap.to(activePath, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top 64%",
            end: "bottom 78%",
            scrub: 0.35,
            invalidateOnRefresh: true,
          },
        });

        ScrollTrigger.sort();
      }, svg);

      return () => ctx.revert();
    });

    return () => {
      media.revert();
    };
  }, [geometry]);

  return (
    <div aria-hidden="true" className="process-tree-layer" ref={layerRef}>
      {geometry ? (
        <svg
          className="process-tree-svg"
          fill="none"
          ref={svgRef}
          viewBox={`0 0 ${r(geometry.width)} ${r(geometry.height)}`}
        >
          <defs>
            <linearGradient
              gradientUnits="userSpaceOnUse"
              id={gradId}
              x1="0"
              x2="0"
              y1={r(geometry.startY)}
              y2={r(geometry.endY)}
            >
              <stop offset="0%" stopColor="var(--color-gold)" />
              <stop offset="55%" stopColor="var(--color-clay-light)" />
              <stop offset="100%" stopColor="var(--color-gold)" />
            </linearGradient>
          </defs>

          <path
            className="process-line-track"
            d={geometry.path}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={Math.max(1.25, geometry.strokeWidth - 0.5).toFixed(2)}
          />

          <path
            className="process-line-stroke"
            d={geometry.path}
            data-process-line-active
            stroke={`url(#${gradId})`}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={geometry.strokeWidth.toFixed(2)}
          />
        </svg>
      ) : null}
    </div>
  );
}
