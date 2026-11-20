"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState } from "react";

import { useLanguage, type SiteLanguage } from "@/context/language-context";
import { LOADER_DONE_ATTR, LOADER_SKIP_ATTR } from "@/lib/loader";

type LoaderPhase =
  | { readonly kind: "active" }
  | { readonly kind: "exiting" }
  | { readonly kind: "done" };

const LOADER_ARIA_LABEL: Record<SiteLanguage, string> = {
  en: "Loading KarmaRise D Global",
  es: "Cargando KarmaRise D Global",
};

const LOGO_SRC = "/brand/main-logo-transparent.png";

const STRIPE_GEOMETRY = {
  inner: {
    archPath: "M 193.5 365 L 193.5 344 A 155.75 143.5 0 0 1 505 344 L 505 365",
    leftDot: { x: 170, y: 369, width: 47, height: 64, rx: 22 },
    rightDot: { x: 482, y: 369, width: 47, height: 64, rx: 22 },
  },
  middle: {
    archPath: "M 114 365 L 114 344 A 234.75 226 0 0 1 583.5 344 L 583.5 365",
    leftDot: { x: 91, y: 369, width: 47, height: 64, rx: 22 },
    rightDot: { x: 560, y: 369, width: 47, height: 64, rx: 22 },
  },
  outer: {
    archPath: "M 34 365 L 34 344 A 315.5 309.5 0 0 1 665 344 L 665 365",
    leftDot: { x: 11, y: 369, width: 47, height: 64, rx: 22 },
    rightDot: { x: 641, y: 369, width: 47, height: 64, rx: 22 },
  },
} as const;

function waitForLogoDecode(src: string, maxWaitMs: number): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      resolve();
    };

    const timer = window.setTimeout(finish, maxWaitMs);
    const img = new window.Image();
    img.src = src;

    if (img.complete) {
      if (typeof img.decode === "function") {
        void img.decode().then(finish, finish);
      } else {
        finish();
      }
      return;
    }

    img.onload = () => {
      if (typeof img.decode === "function") {
        void img.decode().then(finish, finish);
      } else {
        finish();
      }
    };
    img.onerror = finish;
  });
}

function waitForPageReadiness(maxWaitMs: number): Promise<void> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);
      resolve();
    };

    const timer = window.setTimeout(finish, maxWaitMs);

    const checkFontsAndFinish = () => {
      if ("fonts" in document && document.fonts?.ready) {
        void document.fonts.ready.then(finish, finish);
      } else {
        finish();
      }
    };

    const onLoad = () => {
      checkFontsAndFinish();
    };

    if (document.readyState === "complete") {
      checkFontsAndFinish();
    } else {
      window.addEventListener("load", onLoad, { once: true });
    }
  });
}

export function SiteLoader() {
  const { language } = useLanguage();
  const [phase, setPhase] = useState<LoaderPhase>({ kind: "active" });

  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const innerArchRef = useRef<SVGPathElement>(null);
  const middleArchRef = useRef<SVGPathElement>(null);
  const outerArchRef = useRef<SVGPathElement>(null);

  const innerLeftDotRef = useRef<SVGRectElement>(null);
  const innerRightDotRef = useRef<SVGRectElement>(null);
  const middleLeftDotRef = useRef<SVGRectElement>(null);
  const middleRightDotRef = useRef<SVGRectElement>(null);
  const outerLeftDotRef = useRef<SVGRectElement>(null);
  const outerRightDotRef = useRef<SVGRectElement>(null);

  const skippedRef = useRef(false);

  useEffect(() => {
    if (phase.kind === "active") {
      document.body.dataset.loaderActive = "true";
      return () => {
        delete document.body.dataset.loaderActive;
      };
    }

    // Reveal the page DOM underneath the curtain as soon as exiting or done
    document.documentElement.setAttribute(LOADER_DONE_ATTR, "true");
    delete document.body.dataset.loaderActive;

    if (phase.kind === "done") {
      document.documentElement.removeAttribute(LOADER_SKIP_ATTR);
    }
    return undefined;
  }, [phase.kind]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (
      skippedRef.current ||
      document.documentElement.getAttribute(LOADER_SKIP_ATTR) === "true"
    ) {
      skippedRef.current = true;
      document.documentElement.setAttribute(LOADER_DONE_ATTR, "true");
      const frame = requestAnimationFrame(() => {
        setPhase({ kind: "done" });
      });
      return () => cancelAnimationFrame(frame);
    }

    const root = rootRef.current;
    const curtain = curtainRef.current;
    const veil = veilRef.current;
    const stage = stageRef.current;

    const stripeItems = [
      {
        arch: innerArchRef.current,
        leftDot: innerLeftDotRef.current,
        rightDot: innerRightDotRef.current,
      },
      {
        arch: middleArchRef.current,
        leftDot: middleLeftDotRef.current,
        rightDot: middleRightDotRef.current,
      },
      {
        arch: outerArchRef.current,
        leftDot: outerLeftDotRef.current,
        rightDot: outerRightDotRef.current,
      },
    ];

    if (
      !root ||
      !curtain ||
      !veil ||
      !stage ||
      stripeItems.some((item) => !item.arch || !item.leftDot || !item.rightDot)
    ) {
      return undefined;
    }

    let cancelled = false;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const safetyTimeout = window.setTimeout(() => {
      if (!cancelled) {
        document.documentElement.setAttribute(LOADER_DONE_ATTR, "true");
        setPhase({ kind: "done" });
      }
    }, 6800);

    const ctx = gsap.context(() => {
      const arches = stripeItems.map((item) => item.arch);
      const dots = stripeItems.flatMap((item) => [item.leftDot, item.rightDot]);

      if (prefersReducedMotion) {
        gsap.set(arches, { strokeDashoffset: 0 });
        gsap.set(dots, { opacity: 1 });

        void waitForPageReadiness(320).then(() => {
          if (cancelled) return;
          setPhase({ kind: "exiting" });
          gsap.to(root, {
            opacity: 0,
            duration: 0.24,
            ease: "power1.out",
            onComplete: () => {
              if (!cancelled) {
                setPhase({ kind: "done" });
                ScrollTrigger.refresh();
              }
            },
          });
        });
        return;
      }

      let isPageReady = false;
      let isExiting = false;

      void waitForPageReadiness(4800).then(() => {
        isPageReady = true;
      });

      const playExit = () => {
        if (cancelled || isExiting) return;
        isExiting = true;

        const exitTl = gsap.timeline({
          onComplete: () => {
            if (!cancelled) {
              setPhase({ kind: "done" });
              requestAnimationFrame(() => {
                ScrollTrigger.refresh();
              });
            }
          },
        });

        exitTl
          .to(
            stage,
            {
              scale: 1.025,
              duration: 0.18,
              ease: "power2.out",
            },
            0.04,
          )
          .to(
            stage,
            {
              y: -26,
              opacity: 0,
              duration: 0.34,
              ease: "power2.in",
            },
            0.22,
          )
          .add(() => {
            if (!cancelled) {
              document.documentElement.setAttribute(LOADER_DONE_ATTR, "true");
              setPhase({ kind: "exiting" });
            }
          }, 0.36)
          .to(
            curtain,
            {
              yPercent: -100,
              duration: 0.72,
              ease: "power4.inOut",
            },
            0.4,
          )
          .to(
            veil,
            {
              yPercent: -100,
              duration: 0.7,
              ease: "power4.inOut",
            },
            0.49,
          );
      };

      const runCycle = () => {
        if (cancelled || isExiting) return;

        gsap.set(arches, { strokeDashoffset: 104 });
        gsap.set(dots, { opacity: 0 });

        const fillTl = gsap.timeline({
          onComplete: () => {
            if (cancelled || isExiting) return;

            if (isPageReady) {
              playExit();
              return;
            }

            const drainTl = gsap.timeline({
              onComplete: () => {
                if (cancelled || isExiting) return;
                runCycle();
              },
            });

            stripeItems.forEach((item, index) => {
              const offset = index * 0.1;
              drainTl
                .to(
                  item.leftDot,
                  { opacity: 0, duration: 0.16, ease: "power2.in" },
                  offset,
                )
                .to(
                  item.arch,
                  {
                    strokeDashoffset: -104,
                    duration: 0.56,
                    ease: "power2.inOut",
                  },
                  offset + 0.04,
                )
                .to(
                  item.rightDot,
                  { opacity: 0, duration: 0.16, ease: "power2.in" },
                  offset + 0.44,
                );
            });
          },
        });

        stripeItems.forEach((item, index) => {
          const offset = index * 0.14;
          fillTl
            .to(
              item.leftDot,
              { opacity: 1, duration: 0.18, ease: "power2.out" },
              offset,
            )
            .to(
              item.arch,
              { strokeDashoffset: 0, duration: 0.68, ease: "power2.inOut" },
              offset + 0.06,
            )
            .to(
              item.rightDot,
              { opacity: 1, duration: 0.18, ease: "power2.out" },
              offset + 0.58,
            );
        });
      };

      void waitForLogoDecode(LOGO_SRC, 450).then(() => {
        if (!cancelled) {
          runCycle();
        }
      });
    }, rootRef);

    return () => {
      cancelled = true;
      window.clearTimeout(safetyTimeout);
      ctx.revert();
    };
  }, []);

  if (phase.kind === "done") {
    return null;
  }

  return (
    <div
      ref={rootRef}
      className="site-loader"
      data-phase={phase.kind}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1000,
        pointerEvents: phase.kind === "exiting" ? "none" : "auto",
      }}
      role={phase.kind === "active" ? "status" : undefined}
      aria-live={phase.kind === "active" ? "polite" : undefined}
      aria-label={
        phase.kind === "active" ? LOADER_ARIA_LABEL[language] : undefined
      }
      aria-hidden={phase.kind === "exiting"}
    >
      <div
        ref={veilRef}
        className="site-loader-veil"
        style={{ position: "absolute", inset: 0, backgroundColor: "#182d20" }}
        aria-hidden="true"
      />

      <div
        ref={curtainRef}
        className="site-loader-curtain"
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "#111914",
          display: "grid",
          placeItems: "center",
        }}
      >
        <div className="site-loader-glow" aria-hidden="true" />

        <div ref={stageRef} className="site-loader-stage">
          <svg
            className="site-loader-mark"
            viewBox="0 0 701 815"
            role="img"
            aria-label="KarmaRise D Global"
          >
            <defs>
              <filter
                id="kr-loader-parchment"
                x="0%"
                y="0%"
                width="100%"
                height="100%"
              >
                <feFlood floodColor="#f2ecdf" result="flood" />
                <feComposite in="flood" in2="SourceAlpha" operator="in" />
              </filter>

              <mask
                id="kr-loader-base-mask"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="701"
                height="815"
              >
                <rect x="0" y="0" width="701" height="815" fill="#ffffff" />
                <path
                  d={STRIPE_GEOMETRY.inner.archPath}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="48"
                  strokeLinecap="butt"
                />
                <path
                  d={STRIPE_GEOMETRY.middle.archPath}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="48"
                  strokeLinecap="butt"
                />
                <path
                  d={STRIPE_GEOMETRY.outer.archPath}
                  fill="none"
                  stroke="#000000"
                  strokeWidth="48"
                  strokeLinecap="butt"
                />
                <rect {...STRIPE_GEOMETRY.inner.leftDot} fill="#000000" />
                <rect {...STRIPE_GEOMETRY.inner.rightDot} fill="#000000" />
                <rect {...STRIPE_GEOMETRY.middle.leftDot} fill="#000000" />
                <rect {...STRIPE_GEOMETRY.middle.rightDot} fill="#000000" />
                <rect {...STRIPE_GEOMETRY.outer.leftDot} fill="#000000" />
                <rect {...STRIPE_GEOMETRY.outer.rightDot} fill="#000000" />
              </mask>

              <mask
                id="kr-loader-stripes-mask"
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="701"
                height="815"
              >
                <rect x="0" y="0" width="701" height="815" fill="#000000" />
                <path
                  ref={innerArchRef}
                  className="site-loader-stripe-stroke"
                  d={STRIPE_GEOMETRY.inner.archPath}
                  pathLength={100}
                />
                <path
                  ref={middleArchRef}
                  className="site-loader-stripe-stroke"
                  d={STRIPE_GEOMETRY.middle.archPath}
                  pathLength={100}
                />
                <path
                  ref={outerArchRef}
                  className="site-loader-stripe-stroke"
                  d={STRIPE_GEOMETRY.outer.archPath}
                  pathLength={100}
                />
                <rect
                  ref={innerLeftDotRef}
                  className="site-loader-stripe-dot"
                  {...STRIPE_GEOMETRY.inner.leftDot}
                />
                <rect
                  ref={innerRightDotRef}
                  className="site-loader-stripe-dot"
                  {...STRIPE_GEOMETRY.inner.rightDot}
                />
                <rect
                  ref={middleLeftDotRef}
                  className="site-loader-stripe-dot"
                  {...STRIPE_GEOMETRY.middle.leftDot}
                />
                <rect
                  ref={middleRightDotRef}
                  className="site-loader-stripe-dot"
                  {...STRIPE_GEOMETRY.middle.rightDot}
                />
                <rect
                  ref={outerLeftDotRef}
                  className="site-loader-stripe-dot"
                  {...STRIPE_GEOMETRY.outer.leftDot}
                />
                <rect
                  ref={outerRightDotRef}
                  className="site-loader-stripe-dot"
                  {...STRIPE_GEOMETRY.outer.rightDot}
                />
              </mask>
            </defs>

            {/* Unfilled subtle track silhouette for the three stripes */}
            <image
              href={LOGO_SRC}
              width="701"
              height="815"
              filter="url(#kr-loader-parchment)"
              opacity="0.16"
            />

            {/* Solid KarmaRise tower, leaves, and wordmark */}
            <image
              href={LOGO_SRC}
              width="701"
              height="815"
              filter="url(#kr-loader-parchment)"
              mask="url(#kr-loader-base-mask)"
            />

            {/* Animated filling stripes */}
            <image
              href={LOGO_SRC}
              width="701"
              height="815"
              filter="url(#kr-loader-parchment)"
              mask="url(#kr-loader-stripes-mask)"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
