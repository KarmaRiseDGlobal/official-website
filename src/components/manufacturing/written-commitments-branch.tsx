"use client";

import gsap from "gsap";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import type { PreProductionAgreement } from "@/data/manufacturing-content";
import type { SiteLanguage } from "@/lib/urls";

interface BranchNodeGeometry {
  readonly id: string;
  readonly side: "left" | "right";
  readonly path: string;
  readonly tipX: number;
  readonly tipY: number;
  readonly joinX: number;
  readonly joinY: number;
}

interface TreeBranchGeometry {
  readonly width: number;
  readonly height: number;
  readonly stemPath: string;
  readonly stemTopX: number;
  readonly stemTopY: number;
  readonly stemBottomX: number;
  readonly stemBottomY: number;
  readonly branches: readonly BranchNodeGeometry[];
}

function roundCoord(value: number): string {
  return value.toFixed(1);
}

/**
 * Measures live rendered positions of the staggered commitment headings so the
 * central botanical stem and upward-forking branches stay aligned across
 * desktop, tablet, mobile, en-GB, es-ES, and font-size scaling.
 */
function measureBranchGeometry(
  container: HTMLElement,
  anchors: readonly HTMLElement[],
): TreeBranchGeometry | null {
  const rootRect = container.getBoundingClientRect();
  const width = rootRect.width;
  const height = rootRect.height;

  if (width < 120 || height < 120 || anchors.length === 0) {
    return null;
  }

  const isSplitDesktop = window.matchMedia("(min-width: 48rem)").matches;
  const isRtl = window.getComputedStyle(container).direction === "rtl";

  const anchorPoints = anchors.map((anchor, index) => {
    const rect = anchor.getBoundingClientRect();
    const anchorCenterX = rect.left - rootRect.left + rect.width * 0.5;
    const side: "left" | "right" = isSplitDesktop
      ? anchorCenterX < width * 0.5
        ? "left"
        : "right"
      : isRtl
        ? "left"
        : "right";

    const computed = window.getComputedStyle(anchor);
    const lineHeight = Number.parseFloat(computed.lineHeight);
    const firstLineMidOffset = Number.isFinite(lineHeight)
      ? Math.min(lineHeight * 0.52, rect.height * 0.5)
      : Math.min(15, rect.height * 0.5);

    const tipY = rect.top - rootRect.top + firstLineMidOffset;
    const tipX = isSplitDesktop
      ? side === "left"
        ? rect.right - rootRect.left + 16
        : rect.left - rootRect.left - 16
      : isRtl
        ? Math.min(width - 24, rect.right - rootRect.left + 14)
        : Math.max(24, rect.left - rootRect.left - 14);

    return {
      id: anchor.dataset.branchId ?? String(index),
      side,
      tipX,
      tipY,
    };
  });

  if (anchorPoints.length === 0) {
    return null;
  }

  const firstPoint = anchorPoints[0]!;
  const lastPoint = anchorPoints[anchorPoints.length - 1]!;

  const baseStemX = isSplitDesktop ? width * 0.5 : isRtl ? width - 10 : 10;
  const stemTopY = Math.max(0, firstPoint.tipY - (isSplitDesktop ? 24 : 16));
  const stemBottomY = Math.min(
    height,
    lastPoint.tipY + (isSplitDesktop ? 52 : 34),
  );
  const swayAmplitude = isSplitDesktop ? 4.5 : 1.5;

  const stemXAt = (y: number): number => {
    const span = Math.max(1, stemBottomY - stemTopY);
    const t = Math.max(0, Math.min(1, (y - stemTopY) / span));
    return baseStemX + Math.sin(t * Math.PI * 1.5) * swayAmplitude;
  };

  const stemSampleCount = 6;
  const stemSamples: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= stemSampleCount; i += 1) {
    const t = i / stemSampleCount;
    const y = stemTopY + (stemBottomY - stemTopY) * t;
    stemSamples.push({ x: stemXAt(y), y });
  }

  const stemSegments: string[] = [
    `M ${roundCoord(stemSamples[0]!.x)} ${roundCoord(stemSamples[0]!.y)}`,
  ];
  for (let i = 0; i < stemSamples.length - 1; i += 1) {
    const p0 = stemSamples[Math.max(0, i - 1)]!;
    const p1 = stemSamples[i]!;
    const p2 = stemSamples[i + 1]!;
    const p3 = stemSamples[Math.min(stemSamples.length - 1, i + 2)]!;

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;
    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    stemSegments.push(
      `C ${roundCoord(cp1x)} ${roundCoord(cp1y)}, ${roundCoord(cp2x)} ${roundCoord(cp2y)}, ${roundCoord(p2.x)} ${roundCoord(p2.y)}`,
    );
  }

  const forkDrop = isSplitDesktop ? 36 : 22;

  const branches: BranchNodeGeometry[] = anchorPoints.map((point) => {
    const joinY = Math.min(stemBottomY - 6, point.tipY + forkDrop);
    const joinX = stemXAt(joinY);
    const dx = point.tipX - joinX;

    const cp1x = joinX;
    const cp1y = point.tipY + forkDrop * 0.18;
    const cp2x = joinX + dx * 0.46;
    const cp2y = point.tipY;

    const path = [
      `M ${roundCoord(joinX)} ${roundCoord(joinY)}`,
      `C ${roundCoord(cp1x)} ${roundCoord(cp1y)},`,
      `${roundCoord(cp2x)} ${roundCoord(cp2y)},`,
      `${roundCoord(point.tipX)} ${roundCoord(point.tipY)}`,
    ].join(" ");

    return {
      id: point.id,
      side: point.side,
      path,
      tipX: point.tipX,
      tipY: point.tipY,
      joinX,
      joinY,
    };
  });

  const stemTopPoint = stemSamples[0]!;
  const stemBottomPoint = stemSamples[stemSamples.length - 1]!;

  return {
    width,
    height,
    stemPath: stemSegments.join(" "),
    stemTopX: stemTopPoint.x,
    stemTopY: stemTopPoint.y,
    stemBottomX: stemBottomPoint.x,
    stemBottomY: stemBottomPoint.y,
    branches,
  };
}

interface WrittenCommitmentsBranchProps {
  readonly items: readonly PreProductionAgreement[];
  readonly language: SiteLanguage;
}

export function WrittenCommitmentsBranch({
  items,
  language,
}: WrittenCommitmentsBranchProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const hasPlayedDrawRef = useRef(false);
  const [geometry, setGeometry] = useState<TreeBranchGeometry | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateGeometry = () => {
      const anchors = Array.from(
        container.querySelectorAll<HTMLElement>("[data-branch-anchor]"),
      );
      const measured = measureBranchGeometry(container, anchors);
      setGeometry(measured);
    };

    updateGeometry();

    const observer = new ResizeObserver(() => {
      updateGeometry();
    });
    observer.observe(container);

    const dirObserver = new MutationObserver(() => {
      updateGeometry();
    });
    dirObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["dir"],
    });

    let cancelled = false;
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!cancelled) {
          updateGeometry();
        }
      });
    }

    return () => {
      cancelled = true;
      observer.disconnect();
      dirObserver.disconnect();
    };
  }, [items, language]);

  // One-shot IntersectionObserver draw for the botanical SVG lines only.
  // Commitment copy stays permanently visible in SSR/DOM so resizing or jump-scrolling
  // can never leave text stranded hidden.
  useEffect(() => {
    const container = containerRef.current;
    const svg = svgRef.current;
    if (!container || !svg || !geometry || hasPlayedDrawRef.current) {
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      hasPlayedDrawRef.current = true;
      return;
    }

    let revealTimeline: gsap.core.Timeline | null = null;

    const playDraw = () => {
      if (hasPlayedDrawRef.current) return;
      hasPlayedDrawRef.current = true;

      const currentSvg = svgRef.current;
      if (!currentSvg) return;

      const stemPath =
        currentSvg.querySelector<SVGPathElement>("[data-branch-stem]");
      const branchPaths = Array.from(
        currentSvg.querySelectorAll<SVGPathElement>("[data-branch-twig]"),
      );
      const buds = Array.from(
        currentSvg.querySelectorAll<SVGCircleElement>("[data-branch-bud]"),
      );

      const tl = gsap.timeline({
        onComplete: () => {
          if (stemPath) {
            gsap.set(stemPath, {
              clearProps: "strokeDasharray,strokeDashoffset",
            });
          }
          if (branchPaths.length > 0) {
            gsap.set(branchPaths, {
              clearProps: "strokeDasharray,strokeDashoffset",
            });
          }
          if (buds.length > 0) {
            gsap.set(buds, { clearProps: "opacity,transform" });
          }
        },
      });
      revealTimeline = tl;

      if (stemPath) {
        const stemLen = stemPath.getTotalLength();
        tl.fromTo(
          stemPath,
          { strokeDasharray: stemLen, strokeDashoffset: stemLen },
          { strokeDashoffset: 0, duration: 0.85, ease: "power2.out" },
          0,
        );
      }

      branchPaths.forEach((path, index) => {
        const len = path.getTotalLength();
        tl.fromTo(
          path,
          { strokeDasharray: len, strokeDashoffset: len },
          { strokeDashoffset: 0, duration: 0.42, ease: "power2.out" },
          0.16 + index * 0.1,
        );
      });

      if (buds.length > 0) {
        tl.fromTo(
          buds,
          { opacity: 0, scale: 0.65, transformOrigin: "center" },
          {
            opacity: 1,
            scale: 1,
            duration: 0.32,
            stagger: 0.1,
            ease: "power3.out",
          },
          0.32,
        );
      }
    };

    const rect = container.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.92 && rect.bottom > 0) {
      hasPlayedDrawRef.current = true;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          playDraw();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(container);

    return () => {
      observer.disconnect();
      revealTimeline?.kill();
      revealTimeline = null;
    };
  }, [geometry]);

  return (
    <div ref={containerRef} className="written-branch-wrap relative">
      {geometry ? (
        <svg
          ref={svgRef}
          aria-hidden="true"
          className="written-branch-svg pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox={`0 0 ${geometry.width} ${geometry.height}`}
          fill="none"
        >
          {/* Main organic botanical stem */}
          <path
            data-branch-stem
            d={geometry.stemPath}
            className="written-branch-stem"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Subtle rounded caps on top and base of the stem */}
          <circle
            cx={geometry.stemTopX}
            cy={geometry.stemTopY}
            r="2.25"
            className="written-branch-stem-cap"
          />
          <circle
            cx={geometry.stemBottomX}
            cy={geometry.stemBottomY}
            r="2.25"
            className="written-branch-stem-cap"
          />

          {/* Four smooth upward-forking branches connecting each commitment */}
          {geometry.branches.map((branch) => (
            <g key={branch.id}>
              <path
                data-branch-twig
                d={branch.path}
                className="written-branch-twig"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                data-branch-bud
                cx={branch.tipX}
                cy={branch.tipY}
                r="3.25"
                className="written-branch-bud"
              />
            </g>
          ))}
        </svg>
      ) : null}

      <ul role="list" className="written-branch-list">
        {items.map((item, index) => {
          const side = index % 2 === 0 ? "left" : "right";
          return (
            <li
              key={item.id}
              data-branch-item
              data-branch-side={side}
              data-branch-index={index}
              className="written-branch-item"
            >
              <h3
                data-branch-anchor
                data-branch-id={item.id}
                className="written-branch-title"
              >
                {item.title[language]}
              </h3>
              <p className="written-branch-body">{item.body[language]}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
