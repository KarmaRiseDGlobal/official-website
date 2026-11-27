"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import {
  addTransitionType,
  startTransition,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  ViewTransition,
  type CSSProperties,
  type TouchEvent as ReactTouchEvent,
  type ViewTransitionClassPerType,
} from "react";

import {
  requestSmoothScrollBy,
  requestSmoothScrollTo,
} from "@/components/motion/smooth-scroll";
import { SectionBridge } from "@/components/shell/section-bridge";
import { ShowcaseEnquiryPanel } from "@/components/showcases/showcase-enquiry-panel";
import {
  ACT1_END,
  ACT1_PACING,
  getNearestSettleProgress,
  getSteppedProgress,
  lerp,
  PAN_END,
  smoothstep,
  STOP_PROGRESS,
} from "@/components/showcases/showcase-math";
import { useLanguage } from "@/context/language-context";
import { HOME_WORKING_PRINCIPLES as workingPrinciples } from "@/data/home-content";
import { useTextZoomGuard } from "@/lib/use-text-zoom-guard";

const IDLE_SETTLE_DELAY_MS = 280;

interface SliceImageStyle extends CSSProperties {
  "--slice-img-scale"?: number;
}

const MOBILE_SLICE_UPDATE = {
  "showcase-slice-next": "showcase-slice-next",
  "showcase-slice-prev": "showcase-slice-prev",
  default: "none",
} satisfies ViewTransitionClassPerType;

export function HorizontalShowcase() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const concernsPanelRef = useRef<HTMLDivElement>(null);
  const sliceTrackRef = useRef<HTMLDivElement>(null);
  const enquiryShellRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const mobileSwipeRef = useRef<{ x: number; y: number } | null>(null);

  const [activeSlice, setActiveSlice] = useState(0);
  const [optimisticSlice, setOptimisticSlice] = useOptimistic(activeSlice);
  const activeSliceRef = useRef(0);
  const programmaticTargetRef = useRef<number | null>(null);
  const programmaticTimerRef = useRef<number | null>(null);
  const isTextZoomed = useTextZoomGuard();
  const [overflowBlockedKey, setOverflowBlockedKey] = useState<string | null>(
    null,
  );
  const [viewportKey, setViewportKey] = useState("");
  const isOverflowBlocked =
    overflowBlockedKey !== null && overflowBlockedKey === viewportKey;

  useEffect(() => {
    const syncViewportKey = () => {
      setViewportKey(`${window.innerWidth}x${window.innerHeight}`);
    };
    syncViewportKey();
    window.addEventListener("resize", syncViewportKey, { passive: true });
    return () => window.removeEventListener("resize", syncViewportKey);
  }, []);

  useEffect(() => {
    activeSliceRef.current = activeSlice;
  }, [activeSlice]);

  const principlesCount = workingPrinciples.length;

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const world = worldRef.current;
    const glow = glowRef.current;
    const concernsPanel = concernsPanelRef.current;
    const sliceTrack = sliceTrackRef.current;
    const enquiryShell = enquiryShellRef.current;

    if (
      !root ||
      !pin ||
      !world ||
      !glow ||
      !concernsPanel ||
      !sliceTrack ||
      !enquiryShell
    ) {
      return;
    }

    const clearShowcaseInlineStyles = () => {
      const sliceCards = Array.from(
        sliceTrack.querySelectorAll<HTMLElement>("[data-slice-index]"),
      );
      pin.removeAttribute("style");
      world.removeAttribute("style");
      glow.removeAttribute("style");
      concernsPanel.removeAttribute("style");
      sliceTrack.removeAttribute("style");
      enquiryShell.removeAttribute("style");
      sliceCards.forEach((card, idx) => {
        card.removeAttribute("style");
        card
          .querySelector<HTMLElement>(".concerns-slice-copy")
          ?.removeAttribute("style");
        card
          .querySelector<HTMLElement>(".concerns-slice-copy-inner")
          ?.removeAttribute("style");
        card
          .querySelector<HTMLElement>(".concerns-slice-media")
          ?.removeAttribute("style");
        const triggerEl = card.querySelector<HTMLElement>(
          ".concerns-slice-trigger",
        );
        triggerEl?.removeAttribute("style");
        const isActive = idx === activeSliceRef.current;
        const dist = Math.abs(idx - activeSliceRef.current);
        card.dataset.active = String(isActive);
        card.dataset.tier =
          dist === 0
            ? "active"
            : dist === 1
              ? "near"
              : dist === 2
                ? "far"
                : "hidden";
      });
    };

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add(
      {
        enhancedViewport: "(min-width: 64rem) and (min-height: 35rem)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { enhancedViewport, reducedMotion } = context.conditions ?? {};

        if (
          !enhancedViewport ||
          reducedMotion ||
          isTextZoomed ||
          isOverflowBlocked
        ) {
          delete root.dataset.enhanced;
          delete root.dataset.pinning;
          triggerRef.current = null;
          clearShowcaseInlineStyles();
          return;
        }

        root.dataset.enhanced = "true";

        const sliceCards = Array.from(
          sliceTrack.querySelectorAll<HTMLElement>("[data-slice-index]"),
        );
        const sliceCopies = sliceCards.map((card) =>
          card.querySelector<HTMLElement>(".concerns-slice-copy"),
        );
        const sliceCopyInners = sliceCards.map((card) =>
          card.querySelector<HTMLElement>(".concerns-slice-copy-inner"),
        );
        const sliceMedias = sliceCards.map((card) =>
          card.querySelector<HTMLElement>(".concerns-slice-media"),
        );
        const sliceTriggers = sliceCards.map((card) =>
          card.querySelector<HTMLElement>(".concerns-slice-trigger"),
        );

        const rootStyles = getComputedStyle(document.documentElement);
        const cardRadius =
          rootStyles.getPropertyValue("--radius-card").trim() || "1.25rem";
        const mediaRadius =
          rootStyles.getPropertyValue("--radius-input").trim() || "0.75rem";

        // Preallocated buffers so scroll updates trigger zero layout passes or allocations
        const slotCount = sliceCards.length;
        const slotW = new Float64Array(slotCount);
        const slotH = new Float64Array(slotCount);
        const slotPad = new Float64Array(slotCount);
        const slotOpen = new Float64Array(slotCount);
        const slotCopyAlpha = new Float64Array(slotCount);
        const slotCardAlpha = new Float64Array(slotCount);
        const railCenter = new Float64Array(slotCount);
        const cardPointerActive = new Array<boolean>(slotCount).fill(false);
        const triggerClickableState = new Array<boolean>(slotCount).fill(false);
        let pointerStatesInitialized = false;

        let cachedViewportW = window.innerWidth;
        let cachedViewportH = window.innerHeight;
        let cachedDirSign = document.documentElement.dir === "rtl" ? -1 : 1;
        let dimActiveW = 960;
        let dimActiveH = 510;
        let dimNearW = 108;
        let dimNearH = 398;
        let dimFarW = 68;
        let dimFarH = 296;
        let dimCardGap = 16;
        let dimActivePad = 14;
        const dimNearPad = 8;
        const dimFarPad = 6;
        let dimActiveInnerW = 466;
        let dimMediaLeft = 480;
        let dimMediaRight = 946;
        let dimMediaCenterX = 713;

        const measureLayout = () => {
          cachedViewportW = window.innerWidth;
          cachedViewportH = window.innerHeight;
          cachedDirSign = document.documentElement.dir === "rtl" ? -1 : 1;
          const isCompactDesktop = cachedViewportW < 1200;
          const isShortLaptop = cachedViewportH < 740;

          dimActiveW = Math.round(
            Math.min(cachedViewportW * (isCompactDesktop ? 0.7 : 0.68), 980),
          );
          const verticalBudget =
            cachedViewportH -
            (isShortLaptop ? 256 : cachedViewportH < 820 ? 344 : 424);
          const minCardH = isShortLaptop ? 284 : 356;
          dimActiveH = Math.round(
            Math.max(
              minCardH,
              Math.min(cachedViewportH * 0.53, verticalBudget, 476),
            ),
          );
          dimCardGap = isCompactDesktop ? 12 : 16;

          const sideBudget = Math.max(
            104,
            (cachedViewportW - dimActiveW) * 0.5 - 20,
          );
          const usableSide = Math.max(80, sideBudget - dimCardGap * 2);
          dimNearW = Math.round(Math.max(60, Math.min(116, usableSide * 0.6)));
          dimFarW = Math.round(Math.max(38, Math.min(72, usableSide * 0.38)));
          dimNearH = Math.round(dimActiveH * 0.78);
          dimFarH = Math.round(dimActiveH * 0.58);

          dimActivePad = isShortLaptop ? 12 : 14;
          dimActiveInnerW = Math.max(
            260,
            Math.round((dimActiveW - dimActivePad * 2) * 0.5),
          );
          if (cachedDirSign === 1) {
            dimMediaLeft = dimActivePad + dimActiveInnerW;
            dimMediaRight = dimActiveW - dimActivePad;
          } else {
            dimMediaLeft = dimActivePad;
            dimMediaRight = dimActiveW - dimActivePad - dimActiveInnerW;
          }
          dimMediaCenterX = (dimMediaLeft + dimMediaRight) * 0.5;

          sliceTrack.style.height = `${dimActiveH}px`;
          const halfW = (-dimActiveW * 0.5).toFixed(2);
          const halfH = (-dimActiveH * 0.5).toFixed(2);
          const activeWStr = `${dimActiveW}px`;
          const activeHStr = `${dimActiveH}px`;
          const activeInnerStr = `${dimActiveInnerW}px`;

          sliceCards.forEach((card, idx) => {
            card.style.width = activeWStr;
            card.style.height = activeHStr;
            card.style.marginLeft = `${halfW}px`;
            card.style.marginTop = `${halfH}px`;
            card.style.padding = `${dimActivePad}px`;

            const copyEl = sliceCopies[idx];
            if (copyEl) {
              copyEl.style.flexBasis = activeInnerStr;
              copyEl.style.width = activeInnerStr;
            }

            const copyInnerEl = sliceCopyInners[idx];
            if (copyInnerEl) {
              copyInnerEl.style.width = activeInnerStr;
              copyInnerEl.style.minWidth = activeInnerStr;
            }
          });

          const hasCopyOverflow = sliceCopyInners.some(
            (copyInnerEl) =>
              copyInnerEl !== null &&
              copyInnerEl.clientHeight > 0 &&
              copyInnerEl.scrollHeight > copyInnerEl.clientHeight + 24,
          );
          const hasPinOverflow = pin.scrollHeight > cachedViewportH + 24;
          if (hasCopyOverflow || hasPinOverflow) {
            setOverflowBlockedKey(`${cachedViewportW}x${cachedViewportH}`);
          }
        };

        const applyContinuousSliceLayout = (continuousIdx: number) => {
          const cardCenterX = dimActiveW * 0.5;
          const cardCenterY = dimActiveH * 0.5;
          const mediaBottomEdge = dimActiveH - dimActivePad;
          const mediaW = Math.max(1, dimMediaRight - dimMediaLeft);
          const mediaH = Math.max(1, mediaBottomEdge - dimActivePad);

          for (let idx = 0; idx < slotCount; idx++) {
            const absD = Math.abs(idx - continuousIdx);

            let w = 0;
            let h = dimFarH * 0.78;
            let pad = 0;
            let copyOpenRatio = 0;
            let copyAlpha = 0;
            let cardAlpha = 0;

            if (absD <= 1) {
              const t = smoothstep(absD);
              w = lerp(dimActiveW, dimNearW, t);
              h = lerp(dimActiveH, dimNearH, t);
              pad = lerp(dimActivePad, dimNearPad, t);
              cardAlpha = lerp(1, 0.56, t);
              copyOpenRatio = 1 - t;
              // Copy exits cleanly before the card compresses past half-width,
              // and enters after space opens so text never collides or clips.
              copyAlpha = smoothstep(Math.max(0, 1 - absD * 2.5));
            } else if (absD <= 2) {
              const t = smoothstep(absD - 1);
              w = lerp(dimNearW, dimFarW, t);
              h = lerp(dimNearH, dimFarH, t);
              pad = lerp(dimNearPad, dimFarPad, t);
              cardAlpha = lerp(0.56, 0.28, t);
            } else if (absD < 2.65) {
              const t = smoothstep((absD - 2) / 0.65);
              w = lerp(dimFarW, 0, t);
              h = lerp(dimFarH, dimFarH * 0.78, t);
              pad = lerp(dimFarPad, 0, t);
              cardAlpha = lerp(0.28, 0, t);
            }

            slotW[idx] = w;
            slotH[idx] = h;
            slotPad[idx] = pad;
            slotOpen[idx] = copyOpenRatio;
            slotCopyAlpha[idx] = copyAlpha;
            slotCardAlpha[idx] = cardAlpha;
          }

          // Linear rail layout: Card 1 starts with empty space on its leading side,
          // Card 4 finishes with empty space on its trailing side, and the active
          // focus card stays anchored cleanly at viewport center (x = 0).
          let railX = 0;
          const gapVisibilityFloor = Math.max(1, dimFarW * 0.55);
          for (let idx = 0; idx < slotCount; idx++) {
            const w = slotW[idx]!;
            railCenter[idx] = railX + w * 0.5;
            railX += w;
            if (idx < slotCount - 1) {
              const leftVis = Math.min(1, w / gapVisibilityFloor);
              const rightVis = Math.min(
                1,
                (slotW[idx + 1] ?? 0) / gapVisibilityFloor,
              );
              railX += dimCardGap * Math.min(leftVis, rightVis);
            }
          }

          const lowerIdx = Math.min(
            slotCount - 1,
            Math.max(0, Math.floor(continuousIdx)),
          );
          const upperIdx = Math.min(slotCount - 1, lowerIdx + 1);
          const focusFrac = smoothstep(continuousIdx - lowerIdx);
          const focusRailX = lerp(
            railCenter[lowerIdx]!,
            railCenter[upperIdx]!,
            focusFrac,
          );

          for (let idx = 0; idx < slotCount; idx++) {
            const card = sliceCards[idx]!;
            const signedD = idx - continuousIdx;
            const absD = Math.abs(signedD);
            const w = slotW[idx]!;
            const h = slotH[idx]!;
            const pad = slotPad[idx]!;
            const copyOpenRatio = slotOpen[idx]!;
            const copyAlpha = slotCopyAlpha[idx]!;
            const cardAlpha = slotCardAlpha[idx]!;

            const targetCenterX =
              (railCenter[idx]! - focusRailX) * cachedDirSign;
            const sliceCenter = lerp(
              dimMediaCenterX,
              cardCenterX,
              copyOpenRatio,
            );
            const tx =
              cardAlpha > 0 ? targetCenterX - (sliceCenter - cardCenterX) : 0;

            const boxLeft = Math.max(0, sliceCenter - w * 0.5);
            const boxRight = Math.min(dimActiveW, sliceCenter + w * 0.5);
            const boxTop = Math.max(0, cardCenterY - h * 0.5);
            const boxBottom = Math.min(dimActiveH, cardCenterY + h * 0.5);

            const clipTop = boxTop;
            const clipRight = Math.max(0, dimActiveW - boxRight);
            const clipBottom = Math.max(0, dimActiveH - boxBottom);
            const clipLeft = boxLeft;

            card.style.transform = `translate3d(${tx.toFixed(2)}px, 0, 0)`;
            card.style.clipPath = `inset(${clipTop.toFixed(2)}px ${clipRight.toFixed(2)}px ${clipBottom.toFixed(2)}px ${clipLeft.toFixed(2)}px round ${cardRadius})`;
            card.style.opacity = cardAlpha.toFixed(3);

            const pointerOn = w >= 12 && cardAlpha > 0.05;
            if (
              !pointerStatesInitialized ||
              cardPointerActive[idx] !== pointerOn
            ) {
              cardPointerActive[idx] = pointerOn;
              card.style.pointerEvents = pointerOn ? "auto" : "none";
            }

            const triggerBtn = sliceTriggers[idx];
            if (triggerBtn) {
              const isSideClickable = absD > 0.35 && w >= 24 && cardAlpha > 0.1;
              if (
                !pointerStatesInitialized ||
                triggerClickableState[idx] !== isSideClickable
              ) {
                triggerClickableState[idx] = isSideClickable;
                triggerBtn.style.pointerEvents = isSideClickable
                  ? "auto"
                  : "none";
              }
            }

            const mediaEl = sliceMedias[idx];
            if (mediaEl) {
              const rawMLeft = Math.max(0, boxLeft + pad - dimMediaLeft);
              const rawMRight = Math.max(0, dimMediaRight - (boxRight - pad));
              const mLeft = Math.min(mediaW * 0.5, rawMLeft);
              const mRight = Math.min(mediaW - mLeft, rawMRight);

              const rawMTop = Math.max(0, boxTop + pad - dimActivePad);
              const rawMBottom = Math.max(
                0,
                mediaBottomEdge - (boxBottom - pad),
              );
              const mTop = Math.min(mediaH * 0.5, rawMTop);
              const mBottom = Math.min(mediaH - mTop, rawMBottom);

              mediaEl.style.clipPath = `inset(${mTop.toFixed(2)}px ${mRight.toFixed(2)}px ${mBottom.toFixed(2)}px ${mLeft.toFixed(2)}px round ${mediaRadius})`;
            }

            const copyEl = sliceCopies[idx];
            if (copyEl) {
              copyEl.style.opacity = copyAlpha.toFixed(3);
            }

            const copyInnerEl = sliceCopyInners[idx];
            if (copyInnerEl) {
              const directionalWhisper = signedD * 10 * cachedDirSign;
              copyInnerEl.style.transform = `translate3d(${directionalWhisper.toFixed(2)}px, 0, 0)`;
            }
          }

          pointerStatesInitialized = true;
        };

        let lastActiveSliceIdx = -1;

        const updateActiveSliceState = (nearestIdx: number) => {
          const pendingTarget = programmaticTargetRef.current;
          if (pendingTarget !== null) {
            if (nearestIdx === pendingTarget) {
              programmaticTargetRef.current = null;
              if (programmaticTimerRef.current !== null) {
                window.clearTimeout(programmaticTimerRef.current);
                programmaticTimerRef.current = null;
              }
            } else {
              return;
            }
          }

          if (nearestIdx === lastActiveSliceIdx) return;
          lastActiveSliceIdx = nearestIdx;
          activeSliceRef.current = nearestIdx;
          setActiveSlice(nearestIdx);

          sliceCards.forEach((card, idx) => {
            const isActive = idx === nearestIdx;
            const dist = Math.abs(idx - nearestIdx);
            card.dataset.active = String(isActive);
            card.dataset.tier =
              dist === 0
                ? "active"
                : dist === 1
                  ? "near"
                  : dist === 2
                    ? "far"
                    : "hidden";
          });
        };

        let lastRenderedSliceIdx = -1;
        let lastPanT = -1;
        let lastBgValue = "";
        let lastGlowOpacity = -1;

        const applyPanChoreography = (panT: number) => {
          // Lead: Horizontal camera pans Panel 1 (#distance) off to the leading side
          // and brings Panel 2 (#enquire) cleanly into viewport center.
          gsap.set(world, {
            xPercent: -50 * panT * cachedDirSign,
            force3D: true,
          });

          // Support (Exit): Outgoing #distance panel recedes simultaneously as one unit
          // over the first 65% of the pan so it clears attention ahead of arrival.
          const exitT = smoothstep(Math.min(1, panT / 0.65));
          gsap.set(concernsPanel, {
            opacity: lerp(1, 0.14, exitT),
            scale: lerp(1, 0.965, exitT),
            force3D: true,
          });

          // Support (Arrival): Incoming #enquire card shell overlaps the pan (0.18 -> 0.96)
          // as a single container carrying all inner copy, chips, and CTAs with zero nested stagger.
          const enterT = smoothstep(
            Math.max(0, Math.min(1, (panT - 0.18) / 0.78)),
          );
          gsap.set(enquiryShell, {
            opacity: lerp(0.12, 1, enterT),
            scale: lerp(0.94, 1, enterT),
            x: lerp(42 * cachedDirSign, 0, enterT),
            y: lerp(18, 0, enterT),
            force3D: true,
          });
        };

        const applyAtmosphere = (continuousSliceIdx: number, panT: number) => {
          let bgValue: string;
          if (panT <= 0.001) {
            const act1Frac =
              continuousSliceIdx / Math.max(1, workingPrinciples.length - 1);
            bgValue =
              act1Frac <= 0.001
                ? "var(--color-forest-deep)"
                : `color-mix(in oklab, var(--color-forest-deep), var(--color-forest-lush) ${(act1Frac * 42).toFixed(1)}%)`;
          } else if (panT >= 0.999) {
            bgValue = "var(--color-wood)";
          } else {
            bgValue = `color-mix(in oklab, color-mix(in oklab, var(--color-forest-deep), var(--color-forest-lush) 42%), var(--color-wood) ${(panT * 100).toFixed(1)}%)`;
          }

          if (bgValue !== lastBgValue) {
            lastBgValue = bgValue;
            pin.style.backgroundColor = bgValue;
          }

          const glowOpacity = lerp(1, 0.72, panT);
          if (Math.abs(glowOpacity - lastGlowOpacity) > 0.001) {
            lastGlowOpacity = glowOpacity;
            glow.style.opacity = glowOpacity.toFixed(3);
          }
        };

        const syncFromProgress = (p: number) => {
          const act1Raw = Math.min(1, Math.max(0, p / ACT1_END));
          const continuousSliceIdx = getSteppedProgress(
            act1Raw,
            workingPrinciples.length,
            ACT1_PACING,
          );
          if (Math.abs(continuousSliceIdx - lastRenderedSliceIdx) > 0.0003) {
            lastRenderedSliceIdx = continuousSliceIdx;
            applyContinuousSliceLayout(continuousSliceIdx);
            updateActiveSliceState(Math.round(continuousSliceIdx));
          }

          const panT =
            p <= ACT1_END
              ? 0
              : p >= PAN_END
                ? 1
                : smoothstep((p - ACT1_END) / (PAN_END - ACT1_END));

          if (Math.abs(panT - lastPanT) > 0.0002) {
            lastPanT = panT;
            applyPanChoreography(panT);
          }

          applyAtmosphere(continuousSliceIdx, panT);
        };

        measureLayout();
        applyContinuousSliceLayout(0);
        lastRenderedSliceIdx = 0;
        updateActiveSliceState(0);
        applyPanChoreography(0);
        lastPanT = 0;
        applyAtmosphere(0, 0);

        const onResize = () => {
          measureLayout();
          applyContinuousSliceLayout(Math.max(0, lastRenderedSliceIdx));
          applyPanChoreography(Math.max(0, lastPanT));
        };
        window.addEventListener("resize", onResize);

        // Gentle post-idle settle routed through Lenis so it never fights active scrolling
        let idleSettleTimer: number | null = null;
        let settleResetTimer: number | null = null;
        let lastScrollDirection = 0;
        let isPointerDown = false;
        let isSettlingProgrammatically = false;

        const clearIdleSettle = () => {
          if (idleSettleTimer !== null) {
            window.clearTimeout(idleSettleTimer);
            idleSettleTimer = null;
          }
          if (settleResetTimer !== null) {
            window.clearTimeout(settleResetTimer);
            settleResetTimer = null;
          }
        };

        const cancelSettleOnUserInput = () => {
          isSettlingProgrammatically = false;
          clearIdleSettle();
        };

        const onPointerDown = () => {
          isPointerDown = true;
          cancelSettleOnUserInput();
        };

        const onPointerUp = () => {
          isPointerDown = false;
        };

        const scheduleIdleSettle = (stInstance: ScrollTrigger) => {
          clearIdleSettle();
          if (
            !stInstance.isActive ||
            isPointerDown ||
            isSettlingProgrammatically
          ) {
            return;
          }

          idleSettleTimer = window.setTimeout(() => {
            idleSettleTimer = null;
            if (!stInstance.isActive || isPointerDown) return;

            const settleProgress = getNearestSettleProgress(
              stInstance.progress,
              lastScrollDirection,
            );
            if (settleProgress === null) return;

            const targetScroll =
              stInstance.start +
              (stInstance.end - stInstance.start) * settleProgress;
            if (Math.abs(targetScroll - window.scrollY) < 6) return;

            isSettlingProgrammatically = true;
            requestSmoothScrollTo({
              top: targetScroll,
              duration: 0.44,
            });
            settleResetTimer = window.setTimeout(() => {
              settleResetTimer = null;
              isSettlingProgrammatically = false;
            }, 480);
          }, IDLE_SETTLE_DELAY_MS);
        };

        // Support horizontal two-finger touchpad scrolling inside the pinned showcase
        const onHorizontalWheel = (event: WheelEvent) => {
          cancelSettleOnUserInput();
          const stInstance = triggerRef.current;
          if (!stInstance || !stInstance.isActive) return;
          if (
            Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.15 &&
            Math.abs(event.deltaX) > 0.5
          ) {
            event.preventDefault();
            requestSmoothScrollBy({
              delta: event.deltaX * 1.35 * cachedDirSign,
              duration: 0.42,
            });
          }
        };
        root.addEventListener("wheel", onHorizontalWheel, { passive: false });

        // Support horizontal finger drag (touch-to-scroll sideways) on hybrid devices
        let touchTrackState: {
          startX: number;
          startY: number;
          lastX: number;
          mode: "undecided" | "horizontal" | "vertical";
        } | null = null;

        const onTouchStart = (event: TouchEvent) => {
          cancelSettleOnUserInput();
          const touch = event.touches[0];
          if (!touch) return;
          touchTrackState = {
            startX: touch.clientX,
            startY: touch.clientY,
            lastX: touch.clientX,
            mode: "undecided",
          };
        };

        const onTouchMove = (event: TouchEvent) => {
          if (!touchTrackState) return;
          const stInstance = triggerRef.current;
          if (!stInstance || !stInstance.isActive) return;
          const touch = event.touches[0];
          if (!touch) return;

          const totalDx = touch.clientX - touchTrackState.startX;
          const totalDy = touch.clientY - touchTrackState.startY;

          if (touchTrackState.mode === "undecided") {
            if (Math.abs(totalDx) < 8 && Math.abs(totalDy) < 8) return;
            touchTrackState.mode =
              Math.abs(totalDx) > Math.abs(totalDy) * 1.15
                ? "horizontal"
                : "vertical";
          }

          if (touchTrackState.mode === "horizontal") {
            if (event.cancelable) event.preventDefault();
            const stepDx = touchTrackState.lastX - touch.clientX;
            touchTrackState.lastX = touch.clientX;
            requestSmoothScrollBy({
              delta: stepDx * 1.65 * cachedDirSign,
              duration: 0.35,
            });
          }
        };

        const onTouchEnd = () => {
          touchTrackState = null;
        };

        const onKeyDown = () => {
          cancelSettleOnUserInput();
        };

        root.addEventListener("touchstart", onTouchStart, { passive: true });
        root.addEventListener("touchmove", onTouchMove, { passive: false });
        root.addEventListener("touchend", onTouchEnd, { passive: true });
        root.addEventListener("touchcancel", onTouchEnd, { passive: true });
        window.addEventListener("pointerdown", onPointerDown, {
          passive: true,
        });
        window.addEventListener("pointerup", onPointerUp, { passive: true });
        window.addEventListener("pointercancel", onPointerUp, {
          passive: true,
        });
        window.addEventListener("keydown", onKeyDown, { passive: true });

        // Single pinned ScrollTrigger with direct scrub (Lenis already smooths scroll input;
        // avoiding double-scrub lag and native ScrollTrigger snap eliminates jaggedness).
        const st = ScrollTrigger.create({
          trigger: root,
          pin,
          start: "top top",
          end: () =>
            `+=${Math.round(Math.max(window.innerHeight * 3.25, 2900))}`,
          scrub: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            root.dataset.pinning = self.isActive ? "true" : "false";
            if (!self.isActive) {
              clearIdleSettle();
            }
          },
          onRefresh: (self) => {
            measureLayout();
            lastRenderedSliceIdx = -1;
            lastPanT = -1;
            lastBgValue = "";
            syncFromProgress(self.progress);
          },
          onUpdate: (self) => {
            if (self.direction !== 0) {
              lastScrollDirection = self.direction;
            }
            syncFromProgress(self.progress);
            scheduleIdleSettle(self);
          },
        });

        triggerRef.current = st;
        ScrollTrigger.sort();
        ScrollTrigger.refresh();

        return () => {
          clearIdleSettle();
          window.removeEventListener("resize", onResize);
          window.removeEventListener("pointerdown", onPointerDown);
          window.removeEventListener("pointerup", onPointerUp);
          window.removeEventListener("pointercancel", onPointerUp);
          window.removeEventListener("keydown", onKeyDown);
          root.removeEventListener("wheel", onHorizontalWheel);
          root.removeEventListener("touchstart", onTouchStart);
          root.removeEventListener("touchmove", onTouchMove);
          root.removeEventListener("touchend", onTouchEnd);
          root.removeEventListener("touchcancel", onTouchEnd);
          st.kill();
          triggerRef.current = null;
          clearShowcaseInlineStyles();
          lastActiveSliceIdx = -1;
          delete root.dataset.enhanced;
          delete root.dataset.pinning;
          ScrollTrigger.refresh();
        };
      },
    );

    return () => {
      if (programmaticTimerRef.current !== null) {
        window.clearTimeout(programmaticTimerRef.current);
        programmaticTimerRef.current = null;
      }
      programmaticTargetRef.current = null;
      media.revert();
      clearShowcaseInlineStyles();
      delete root.dataset.enhanced;
      delete root.dataset.pinning;
    };
  }, [isTextZoomed, isOverflowBlocked]);

  function scrollToStopIndex(stopIdx: number) {
    const st = triggerRef.current;
    const bounded = Math.max(0, Math.min(STOP_PROGRESS.length - 1, stopIdx));
    const targetProgress = STOP_PROGRESS[bounded] ?? 0;

    if (st && rootRef.current?.dataset.enhanced === "true") {
      const targetScroll = st.start + (st.end - st.start) * targetProgress;
      requestSmoothScrollTo({ top: targetScroll, duration: 0.78 });
    }
  }

  function selectSliceIndex(targetIndex: number) {
    const clamped = Math.max(0, Math.min(principlesCount - 1, targetIndex));

    if (rootRef.current?.dataset.enhanced === "true") {
      if (programmaticTimerRef.current !== null) {
        window.clearTimeout(programmaticTimerRef.current);
      }
      programmaticTargetRef.current = clamped;
      programmaticTimerRef.current = window.setTimeout(() => {
        programmaticTargetRef.current = null;
        programmaticTimerRef.current = null;
      }, 920);
      activeSliceRef.current = clamped;
      setActiveSlice(clamped);
      scrollToStopIndex(clamped);
      return;
    }

    if (clamped === activeSliceRef.current) return;
    const directionSign = clamped > activeSliceRef.current ? 1 : -1;
    const directionType =
      directionSign > 0 ? "showcase-slice-next" : "showcase-slice-prev";

    startTransition(() => {
      setOptimisticSlice(clamped);
      addTransitionType(directionType);
      setActiveSlice(clamped);
    });

    // Crisp GPU slide-in on iPad portrait & iPhone where ViewTransition may be absent
    if (
      typeof window !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      window.requestAnimationFrame(() => {
        const nextCard = sliceTrackRef.current?.querySelector<HTMLElement>(
          `[data-slice-index="${clamped}"]`,
        );
        if (!nextCard) return;
        gsap.fromTo(
          nextCard,
          { opacity: 0.72, x: 16 * directionSign },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            ease: "power2.out",
            clearProps: "transform,opacity",
            overwrite: "auto",
          },
        );
      });
    }
  }

  function handleDistanceFocusCapture() {
    const st = triggerRef.current;
    if (!st || rootRef.current?.dataset.enhanced !== "true") return;
    if (st.progress > ACT1_END) {
      scrollToStopIndex(activeSliceRef.current);
    }
  }

  function handleEnquireFocusCapture() {
    const st = triggerRef.current;
    if (!st || rootRef.current?.dataset.enhanced !== "true") return;
    if (st.progress < PAN_END) {
      scrollToStopIndex(workingPrinciples.length);
    }
  }

  function handleMobileSliceTouchStart(e: ReactTouchEvent<HTMLDivElement>) {
    if (rootRef.current?.dataset.enhanced === "true") return;
    const t = e.touches[0];
    if (!t) return;
    mobileSwipeRef.current = { x: t.clientX, y: t.clientY };
  }

  function handleMobileSliceTouchEnd(e: ReactTouchEvent<HTMLDivElement>) {
    if (rootRef.current?.dataset.enhanced === "true") return;
    const start = mobileSwipeRef.current;
    mobileSwipeRef.current = null;
    const t = e.changedTouches[0];
    if (!start || !t) return;
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    if (Math.abs(dx) > 36 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0 && optimisticSlice < principlesCount - 1) {
        selectSliceIndex(optimisticSlice + 1);
      } else if (dx > 0 && optimisticSlice > 0) {
        selectSliceIndex(optimisticSlice - 1);
      }
    }
  }

  function handleMobileSliceTouchCancel() {
    mobileSwipeRef.current = null;
  }

  const activePrinciple = workingPrinciples[optimisticSlice];

  return (
    <section className="horizontal-showcase" data-surface="dark" ref={rootRef}>
      <a
        href="#enquire"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-24 focus:z-[var(--z-modal)] focus:rounded-[var(--radius-pill)] focus:bg-[var(--color-gold)] focus:px-4 focus:py-2.5 focus:text-[length:var(--text-sm)] focus:font-semibold focus:text-[var(--color-night)] focus:no-underline"
      >
        {isEs ? "Ir al formulario de idea" : "Skip to product enquiry"}
      </a>

      <div className="horizontal-showcase-pin" ref={pinRef}>
        <div
          className="horizontal-showcase-glow"
          ref={glowRef}
          aria-hidden="true"
        />

        <div className="horizontal-showcase-viewport">
          <div className="horizontal-showcase-world" ref={worldRef}>
            {/* PANEL 1: Spain / Europe & India on-ground coordination */}
            <div
              className="horizontal-panel concerns-panel"
              id="distance"
              data-chat-avoid
              ref={concernsPanelRef}
              onFocusCapture={handleDistanceFocusCapture}
            >
              <div className="concerns-header container">
                <h2>
                  {isEs
                    ? "Cuatro pasos claros antes de que salga tu pedido."
                    : "Four checkpoints before a single order ships."}
                </h2>
                <p className="concerns-subtitle">
                  {isEs
                    ? "Sin avanzar a ciegas entre dos continentes. Ves cada tono, muestra y costura antes de dar el sí."
                    : "No blind faith across continents. You see every shade, sample, and seam before giving the nod."}
                </p>
              </div>

              <div
                className="concerns-carousel-stage container"
                onTouchStart={handleMobileSliceTouchStart}
                onTouchEnd={handleMobileSliceTouchEnd}
                onTouchCancel={handleMobileSliceTouchCancel}
              >
                <ViewTransition update={MOBILE_SLICE_UPDATE} default="none">
                  <div
                    ref={sliceTrackRef}
                    className="concerns-slice-track"
                    role="region"
                    aria-label={
                      isEs
                        ? "Pasos de coordinación entre España, el resto de Europa y la India"
                        : "Coordination steps between Spain, the rest of Europe, and India"
                    }
                  >
                    <div className="concerns-slice-canvas">
                      {workingPrinciples.map((principle, index) => {
                        const isCurrent = index === activeSlice;
                        const initialDistance = Math.abs(index - activeSlice);
                        const initialTier =
                          initialDistance === 0
                            ? "active"
                            : initialDistance === 1
                              ? "near"
                              : initialDistance === 2
                                ? "far"
                                : "hidden";

                        return (
                          <article
                            key={principle.id}
                            id={`principle-panel-${principle.id}`}
                            aria-label={principle.title[language]}
                            aria-hidden={!isCurrent}
                            className="concerns-slice-card"
                            data-slice-index={index}
                            data-active={isCurrent}
                            data-tier={initialTier}
                          >
                            <div
                              aria-hidden="true"
                              className="concerns-slice-trigger"
                              onClick={() => selectSliceIndex(index)}
                            />

                            <div className="concerns-slice-copy">
                              <div className="concerns-slice-copy-inner">
                                <h3>{principle.title[language]}</h3>
                                <p className="concerns-slice-body">
                                  {principle.body[language]}
                                </p>
                              </div>
                            </div>

                            <div className="concerns-slice-media">
                              <Image
                                src={principle.image}
                                alt={principle.imageAlt[language]}
                                fill
                                sizes="(max-width: 56rem) 100vw, 520px"
                                style={
                                  {
                                    ...(principle.imagePosition
                                      ? {
                                          objectPosition:
                                            principle.imagePosition,
                                        }
                                      : {}),
                                    ...(principle.imageOrigin
                                      ? {
                                          transformOrigin:
                                            principle.imageOrigin,
                                        }
                                      : {}),
                                    ...(principle.imageScale
                                      ? {
                                          "--slice-img-scale":
                                            principle.imageScale,
                                        }
                                      : {}),
                                  } satisfies SliceImageStyle
                                }
                              />
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                </ViewTransition>
              </div>

              <div className="concerns-footer container">
                <div className="concerns-controls">
                  <button
                    type="button"
                    className="concerns-nav-btn press-scale"
                    aria-label={isEs ? "Anterior" : "Previous"}
                    disabled={optimisticSlice === 0}
                    onClick={() => selectSliceIndex(optimisticSlice - 1)}
                  >
                    <svg
                      aria-hidden="true"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <span className="concerns-controls-dots" aria-hidden="true">
                    {workingPrinciples.map((principle, index) => (
                      <span
                        key={principle.id}
                        className="concerns-controls-dot"
                        data-active={index === optimisticSlice}
                      />
                    ))}
                  </span>

                  <span
                    className="sr-only"
                    aria-live="polite"
                    aria-atomic="true"
                  >
                    {isEs
                      ? `Paso ${optimisticSlice + 1} de ${principlesCount}: ${activePrinciple?.title.es ?? ""}`
                      : `Step ${optimisticSlice + 1} of ${principlesCount}: ${activePrinciple?.title.en ?? ""}`}
                  </span>

                  <button
                    type="button"
                    className="concerns-nav-btn press-scale"
                    aria-label={isEs ? "Siguiente" : "Next"}
                    disabled={optimisticSlice === principlesCount - 1}
                    onClick={() => selectSliceIndex(optimisticSlice + 1)}
                  >
                    <svg
                      aria-hidden="true"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </div>

                <Link
                  className="concerns-inline-link editorial-arrow-link"
                  href={localizeHref("/how-we-work")}
                >
                  <span>
                    {isEs
                      ? "Ver cómo nos organizamos"
                      : "See how we split the work"}
                  </span>
                  <svg
                    viewBox="0 0 16 16"
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                    className="editorial-arrow-icon shrink-0"
                  >
                    <path d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5" />
                  </svg>
                </Link>
              </div>
            </div>

            <SectionBridge
              from="forest-deep"
              to="wood"
              className="showcase-fallback-bridge"
            />

            {/* PANEL 2: Focused Product Brief / Call Enquiry */}
            <ShowcaseEnquiryPanel
              enquiryShellRef={enquiryShellRef}
              language={language}
              isEs={isEs}
              localizeHref={localizeHref}
              onFocusCapture={handleEnquireFocusCapture}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
