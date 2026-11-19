"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import {
  Fragment,
  useEffect,
  useRef,
  useState,
  type TouchEvent as ReactTouchEvent,
} from "react";

import { useLanguage, type SiteLanguage } from "@/context/language-context";

const workingPrinciples: ReadonlyArray<{
  id: string;
  step: string;
  tag: Record<SiteLanguage, string>;
  locationPill: Record<SiteLanguage, string>;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
  image: string;
  imageAlt: Record<SiteLanguage, string>;
}> = [
  {
    id: "talk-to-alma",
    step: "01",
    tag: {
      en: "Direct communication",
      es: "Comunicación directa",
    },
    locationPill: {
      en: "Spain & Europe -> India",
      es: "España y Europa -> India",
    },
    title: {
      en: "Tell Alma what you want to change",
      es: "Comenta cada ajuste directamente con Alma",
    },
    body: {
      en: "Talk through the product in Spanish or English. Alma and Shirish take those notes straight to the workshop in India.",
      es: "Habla del producto en español o en inglés. Alma y Shirish trasladan cada indicación directamente al taller en la India.",
    },
    image: "/images/alam_with_the_warehouse_owners (1).jpeg",
    imageAlt: {
      en: "Alma reviewing a bucket bag tech pack and leather swatches at a workshop table in India",
      es: "Alma revisando la ficha técnica de un bolso y muestras de piel en la mesa de un taller en la India",
    },
  },
  {
    id: "clear-reference",
    step: "02",
    tag: {
      en: "Product Brief specification",
      es: "Especificación en el Product Brief",
    },
    locationPill: {
      en: "Materials & colour swatches",
      es: "Materiales y carta de color",
    },
    title: {
      en: "Give the workshop a clear reference",
      es: "Una referencia clara para el taller",
    },
    body: {
      en: "The Product Brief records decisions like the colour swatch to match, the hardware to use, and the finish to check.",
      es: "El Product Brief recoge decisiones concretas como el tono exacto de la carta de color, los herrajes y el acabado que debe revisarse.",
    },
    image: "/images/alam_with_the_warehouse_owners (5).jpeg",
    imageAlt: {
      en: "Alma and a workshop owner comparing leather colour swatch cards in India",
      es: "Alma y el responsable de un taller comparando muestrarios de color de piel en la India",
    },
  },
  {
    id: "approved-sample",
    step: "03",
    tag: {
      en: "Counter-sample check",
      es: "Control sobre muestra",
    },
    locationPill: {
      en: "On the workshop floor",
      es: "En la planta de producción",
    },
    title: {
      en: "Come back to the approved sample",
      es: "Volver siempre a la muestra aprobada",
    },
    body: {
      en: "If something changes on the floor, we check it in person with the workshop and bring the decision back to you.",
      es: "Si surge cualquier cambio en planta, lo comprobamos en persona con el taller y te consultamos antes de avanzar.",
    },
    image: "/images/shirish_with_workers_at_warehouse (6).jpeg",
    imageAlt: {
      en: "Shirish inspecting a finished brown leather sample bag alongside production pieces in India",
      es: "Shirish revisando una muestra terminada de bolso de piel marrón junto a piezas de producción en la India",
    },
  },
  {
    id: "dispatch-plan",
    step: "04",
    tag: {
      en: "Export & delivery",
      es: "Exportación y entrega",
    },
    locationPill: {
      en: "India warehouse -> Europe",
      es: "Almacén en India -> Europa",
    },
    title: {
      en: "Plan for the day the order leaves",
      es: "Planificar el día en que sale el pedido",
    },
    body: {
      en: "We agree on quantities, export packing requirements, and delivery handling before production starts.",
      es: "Acordamos las cantidades, el embalaje de exportación y la logística de entrega antes de empezar a producir.",
    },
    image: "/images/snoby_order (2).jpeg",
    imageAlt: {
      en: "Numbered and wrapped export cartons prepared for dispatch in the warehouse in India",
      es: "Cajas de exportación numeradas y flejadas listas para su salida desde el almacén en la India",
    },
  },
];

const programmeStages: ReadonlyArray<{
  id: string;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
}> = [
  {
    id: "brief",
    title: {
      en: "The Product Brief",
      es: "El Product Brief",
    },
    body: {
      en: "We agree on what the product should look like, how it should perform, and when you need it.",
      es: "Definimos juntos cómo debe ser el producto, qué uso tendrá y en qué fecha lo necesitas en tienda.",
    },
  },
  {
    id: "workshop",
    title: {
      en: "Choosing a workshop",
      es: "Elección del taller",
    },
    body: {
      en: "We select a Manufacturing Partner in India with the right machinery and experience for your materials and order volume.",
      es: "Seleccionamos un taller en la India con la maquinaria y la experiencia adecuadas para tus materiales y tu volumen de pedido.",
    },
  },
  {
    id: "sampling",
    title: {
      en: "Design and sampling",
      es: "Diseño y muestras",
    },
    body: {
      en: "You review the design and test a physical sample in your hands. We record every adjustment before bulk production begins.",
      es: "Revisas el diseño y pruebas una muestra física en tus manos. Anotamos cada ajuste antes de iniciar la producción en serie.",
    },
  },
  {
    id: "materials",
    title: {
      en: "Materials and preparation",
      es: "Materiales y preparación",
    },
    body: {
      en: "We confirm production quantities, hides or fabrics, trims, and finishes directly with the workshop.",
      es: "Confirmamos directamente con el taller las cantidades, pieles o tejidos, fornituras y acabados.",
    },
  },
  {
    id: "oversight",
    title: {
      en: "Production oversight",
      es: "Seguimiento en taller",
    },
    body: {
      en: "As the workshop produces the Bulk Order, we check workmanship on the floor against the approved sample.",
      es: "Mientras el taller fabrica el pedido, supervisamos en planta que el trabajo cumpla con la muestra aprobada.",
    },
  },
  {
    id: "delivery",
    title: {
      en: "Final checks and delivery",
      es: "Revisión final y entrega",
    },
    body: {
      en: "We inspect the finished pieces and export packing, then coordinate dispatch under the agreed delivery terms.",
      es: "Revisamos las piezas terminadas y el embalaje de exportación, y coordinamos el envío según las condiciones acordadas.",
    },
  },
];

// 8 persistent slots: 2 wrap-around clones on the left (-2, -1), 4 main cards (0..3), 2 wrap-around clones on the right (4, 5)
const PERSISTENT_SLOTS = [-2, -1, 0, 1, 2, 3, 4, 5] as const;

// Timeline progress landmarks (0.00 -> 1.00)
const ACT1_END = 0.36;
const ACT2_START = 0.44;
const ACT2_END = 0.81;
const PAN2_END = 0.89;

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/**
 * Maps normalized progress t in [0, 1] across `steps` items (0 .. steps-1)
 * with flat dwell plateaus on each item and smoothstep transitions between them.
 */
function getSteppedProgress(
  t: number,
  steps: number,
  dwellRatio = 0.46,
): number {
  if (steps <= 1) return 0;
  const clamped = Math.max(0, Math.min(1, t));
  const totalWeight = steps * dwellRatio + (steps - 1) * (1 - dwellRatio);
  const dwellW = dwellRatio / totalWeight;
  const transW = (1 - dwellRatio) / totalWeight;
  const cycleW = dwellW + transW;

  for (let i = 0; i < steps - 1; i += 1) {
    const start = i * cycleW;
    const dwellEnd = start + dwellW;
    const transEnd = dwellEnd + transW;
    if (clamped <= dwellEnd) {
      return i;
    }
    if (clamped <= transEnd) {
      return i + smoothstep((clamped - dwellEnd) / transW);
    }
  }
  return steps - 1;
}

/**
 * Returns the center progress [0, 1] of the plateau for item `index` out of `steps`.
 */
function getPlateauCenterProgress(
  index: number,
  steps: number,
  dwellRatio = 0.46,
): number {
  if (steps <= 1) return 0;
  const clampedIdx = Math.max(0, Math.min(steps - 1, index));
  const totalWeight = steps * dwellRatio + (steps - 1) * (1 - dwellRatio);
  const dwellW = dwellRatio / totalWeight;
  const transW = (1 - dwellRatio) / totalWeight;
  const cycleW = dwellW + transW;
  return clampedIdx * cycleW + dwellW * 0.5;
}

const STOP_PROGRESS: number[] = [
  // Act I: 4 working principle cards
  ...Array.from(
    { length: workingPrinciples.length },
    (_, i) => getPlateauCenterProgress(i, workingPrinciples.length) * ACT1_END,
  ),
  // Act II: 6 programme stages
  ...Array.from(
    { length: programmeStages.length },
    (_, i) =>
      ACT2_START +
      getPlateauCenterProgress(i, programmeStages.length, 0.42) *
        (ACT2_END - ACT2_START),
  ),
  // Act III: What do you want to make?
  0.92,
];

export function HorizontalShowcase() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const sliceTrackRef = useRef<HTMLDivElement>(null);
  const paginationRef = useRef<HTMLDivElement>(null);
  const programmeTrackRef = useRef<HTMLOListElement>(null);
  const programmeProgressRef = useRef<HTMLSpanElement>(null);
  const programmeCounterCurrentRef = useRef<HTMLSpanElement>(null);
  const enquiryShellRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);
  const mobileSwipeRef = useRef<{ x: number; y: number } | null>(null);

  // Used for mobile fallback (< 48rem) and initial aria state
  const [activeSlice, setActiveSlice] = useState(0);
  const [activeStage, setActiveStage] = useState(0);

  const principlesCount = workingPrinciples.length;

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const world = worldRef.current;
    const glow = glowRef.current;
    const sliceTrack = sliceTrackRef.current;
    const pagination = paginationRef.current;
    const programmeTrack = programmeTrackRef.current;
    const programmeProgress = programmeProgressRef.current;
    const programmeCounterCurrent = programmeCounterCurrentRef.current;
    const enquiryShell = enquiryShellRef.current;

    if (
      !root ||
      !pin ||
      !world ||
      !glow ||
      !sliceTrack ||
      !pagination ||
      !programmeTrack ||
      !programmeProgress ||
      !programmeCounterCurrent ||
      !enquiryShell
    ) {
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add(
      {
        enhancedViewport: "(min-width: 48rem)",
        reducedMotion: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { enhancedViewport, reducedMotion } = context.conditions ?? {};

        if (!enhancedViewport || reducedMotion) {
          delete root.dataset.enhanced;
          triggerRef.current = null;
          return;
        }

        root.dataset.enhanced = "true";

        const sliceCards = Array.from(
          sliceTrack.querySelectorAll<HTMLElement>("[data-slice-slot]"),
        );
        const sliceCopies = sliceCards.map((card) =>
          card.querySelector<HTMLElement>(".concerns-slice-copy"),
        );
        const sliceCopyInners = sliceCards.map((card) =>
          card.querySelector<HTMLElement>(".concerns-slice-copy-inner"),
        );
        const sliceCaptions = sliceCards.map((card) =>
          card.querySelector<HTMLElement>(".concerns-slice-caption"),
        );
        const sliceScrims = sliceCards.map((card) =>
          card.querySelector<HTMLElement>(".concerns-slice-media-scrim"),
        );
        const sliceBridges = Array.from(
          sliceTrack.querySelectorAll<HTMLElement>("[data-slice-bridge]"),
        );
        const paginationDots = Array.from(
          pagination.querySelectorAll<HTMLElement>(".concerns-pagination-dot"),
        );
        const paginationFills = paginationDots.map((dot) =>
          dot.querySelector<HTMLElement>(".concerns-pagination-fill"),
        );
        const stageCards = Array.from(
          programmeTrack.querySelectorAll<HTMLElement>(".programme-stage"),
        );

        const interpolateBg = gsap.utils.interpolate([
          "#182d20", // 0.00: --color-forest-deep (Act I start)
          "#1e3526", // 0.16: Rich forest (Act I end)
          "#d9dfd3", // 0.33: --color-pale-sage (Horizontal pan 1 arrival)
          "#e6dac4", // 0.50: --color-dune (Mid programme track)
          "#f2ecdf", // 0.66: --color-paper (End of programme track)
          "#9c8172", // 0.83: Warm clay-wood bridge (Horizontal pan 2)
          "#4d342f", // 1.00: --color-wood (Panel 3: What do you want to make?)
        ]);

        const applyContinuousSliceLayout = (continuousIdx: number) => {
          const vw = window.innerWidth;
          const vh = window.innerHeight;
          const isCompactTablet = vw < 1024;

          // Responsive card dimensions for both iPad Portrait (768-1023px) and iPad Landscape / Laptop / Desktop (>=1024px)
          const activeW = isCompactTablet
            ? Math.min(vw * 0.68, 620)
            : Math.min(vw * 0.62, 880);
          const activeH = isCompactTablet
            ? Math.max(336, Math.min(vh * 0.5, 430))
            : Math.max(352, Math.min(vh * 0.58, 490));
          const nearW = isCompactTablet
            ? Math.max(50, Math.min(vw * 0.06, 68))
            : Math.max(78, Math.min(vw * 0.07, 104));
          const nearH = isCompactTablet
            ? Math.max(240, Math.min(vh * 0.38, 320))
            : Math.max(264, Math.min(vh * 0.44, 368));
          const farW = isCompactTablet
            ? Math.max(32, Math.min(vw * 0.04, 46))
            : Math.max(54, Math.min(vw * 0.048, 72));
          const farH = isCompactTablet
            ? Math.max(170, Math.min(vh * 0.27, 224))
            : Math.max(188, Math.min(vh * 0.31, 256));

          const activeInnerW = Math.max(240, Math.round((activeW - 24) * 0.5));

          sliceCards.forEach((card, idx) => {
            const slotOffset = PERSISTENT_SLOTS[idx] ?? 0;
            const d = slotOffset - continuousIdx;
            const absD = Math.abs(d);

            let w = 0;
            let h = farH * 0.75;
            let pad = 0;
            let copyOpenRatio = 0;
            let copyAlpha = 0;
            let cardAlpha = 1;

            if (absD <= 1) {
              const t = smoothstep(absD);
              w = lerp(activeW, nearW, t);
              h = lerp(activeH, nearH, t);
              pad = lerp(12, 7.5, t);
              copyOpenRatio = 1 - t;
              copyAlpha = smoothstep(Math.max(0, 1 - absD * 1.35));
            } else if (absD <= 2) {
              const t = smoothstep(absD - 1);
              w = lerp(nearW, farW, t);
              h = lerp(nearH, farH, t);
              pad = lerp(7.5, 6.5, t);
            } else if (absD < 2.85) {
              const t = smoothstep((absD - 2) / 0.85);
              w = lerp(farW, 0, t);
              h = lerp(farH, farH * 0.72, t);
              pad = lerp(6.5, 0, t);
              cardAlpha = lerp(1, 0, t);
            } else {
              w = 0;
              h = farH * 0.72;
              pad = 0;
              cardAlpha = 0;
            }

            card.style.width = `${w.toFixed(1)}px`;
            card.style.height = `${h.toFixed(1)}px`;
            card.style.padding = `${pad.toFixed(1)}px`;
            card.style.opacity = cardAlpha.toFixed(3);
            card.style.pointerEvents = w < 12 ? "none" : "auto";

            const copyEl = sliceCopies[idx];
            if (copyEl) {
              const copyWidthPx = activeInnerW * copyOpenRatio;
              copyEl.style.flexBasis = `${copyWidthPx.toFixed(1)}px`;
              copyEl.style.width = `${copyWidthPx.toFixed(1)}px`;
              copyEl.style.opacity = copyAlpha.toFixed(3);
            }

            const copyInnerEl = sliceCopyInners[idx];
            if (copyInnerEl) {
              const shiftX = (1 - copyOpenRatio) * -14;
              copyInnerEl.style.width = `${activeInnerW}px`;
              copyInnerEl.style.minWidth = `${activeInnerW}px`;
              copyInnerEl.style.transform = `translate3d(${shiftX.toFixed(1)}px, 0, 0)`;
            }

            const captionEl = sliceCaptions[idx];
            if (captionEl) {
              captionEl.style.opacity = (copyAlpha * 0.94).toFixed(3);
            }

            const scrimEl = sliceScrims[idx];
            if (scrimEl) {
              scrimEl.style.opacity = copyAlpha.toFixed(3);
            }
          });

          const bridgeBaseW = isCompactTablet ? 12 : 18;
          sliceBridges.forEach((bridge, bIdx) => {
            const leftSlot = PERSISTENT_SLOTS[bIdx] ?? 0;
            const rightSlot = PERSISTENT_SLOTS[bIdx + 1] ?? 0;
            const maxAbs = Math.max(
              Math.abs(leftSlot - continuousIdx),
              Math.abs(rightSlot - continuousIdx),
            );

            let bw = bridgeBaseW;
            let bAlpha = 1;
            if (maxAbs <= 2) {
              bw = bridgeBaseW;
              bAlpha = 1;
            } else if (maxAbs < 2.75) {
              const t = smoothstep((maxAbs - 2) / 0.75);
              bw = lerp(bridgeBaseW, 0, t);
              bAlpha = lerp(1, 0, t);
            } else {
              bw = 0;
              bAlpha = 0;
            }

            bridge.style.width = `${bw.toFixed(1)}px`;
            bridge.style.marginInline = bw > 2 ? "-2px" : "0px";
            bridge.style.opacity = bAlpha.toFixed(3);
          });
        };

        const applyContinuousProgrammeLayout = (continuousStage: number) => {
          const firstCard = stageCards[0];
          const lastCard = stageCards[stageCards.length - 1];
          if (!firstCard || !lastCard) return;

          const maxStageIdx = Math.max(1, stageCards.length - 1);
          const act2T = Math.max(0, Math.min(1, continuousStage / maxStageIdx));

          const firstCenter = firstCard.offsetLeft + firstCard.offsetWidth / 2;
          const lastCenter = lastCard.offsetLeft + lastCard.offsetWidth / 2;
          const currentCenter =
            firstCenter + (lastCenter - firstCenter) * act2T;
          const viewportCenter = window.innerWidth / 2;
          const translateX = viewportCenter - currentCenter;

          gsap.set(programmeTrack, { x: translateX });

          stageCards.forEach((stageCard, idx) => {
            const dist = Math.abs(idx - continuousStage);
            const t = Math.min(1, dist);
            const scale = lerp(1, 0.94, smoothstep(t));
            const alpha = lerp(1, 0.48, smoothstep(t));
            const lift = lerp(-8, 0, smoothstep(t));
            stageCard.style.opacity = alpha.toFixed(3);
            stageCard.style.transform = `translate3d(0, ${lift.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
          });
        };

        const updatePaginationDOM = (nearestIdx: number, fillRatio: number) => {
          paginationDots.forEach((dot, idx) => {
            const isActive = idx === nearestIdx;
            dot.dataset.active = String(isActive);
            dot.setAttribute("aria-selected", String(isActive));
            const fill = paginationFills[idx];
            if (fill) {
              fill.style.opacity = isActive ? "1" : "0";
              fill.style.transform = `scaleX(${isActive ? Math.max(0.28, fillRatio).toFixed(2) : "0"})`;
            }
          });
        };

        let lastRenderedSliceIdx = 0;
        let lastRenderedStageIdx = 0;
        let lastCounterIdx = -1;

        applyContinuousSliceLayout(0);
        applyContinuousProgrammeLayout(0);
        updatePaginationDOM(0, 1);

        gsap.set(programmeProgress, {
          scaleX: 1 / programmeStages.length,
          transformOrigin: "left center",
        });

        const entranceTl = gsap.timeline({
          scrollTrigger: {
            trigger: root,
            start: "top 92%",
            end: "top top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        });
        entranceTl
          .fromTo(
            pin,
            { scale: 0.94, borderRadius: "2rem" },
            { scale: 1, borderRadius: "0rem", ease: "power2.out" },
            0,
          )
          .fromTo(
            sliceTrack,
            { scale: 0.94 },
            { scale: 0.98, ease: "power2.out" },
            0,
          );

        const onResize = () => {
          applyContinuousSliceLayout(lastRenderedSliceIdx);
          applyContinuousProgrammeLayout(lastRenderedStageIdx);
        };
        window.addEventListener("resize", onResize);

        // Support horizontal two-finger touchpad scrolling inside the pinned showcase
        const onHorizontalWheel = (event: WheelEvent) => {
          const stInstance = triggerRef.current;
          if (!stInstance || !stInstance.isActive) return;
          if (
            Math.abs(event.deltaX) > Math.abs(event.deltaY) * 1.15 &&
            Math.abs(event.deltaX) > 0.5
          ) {
            event.preventDefault();
            window.scrollBy({
              top: event.deltaX,
              behavior: "instant",
            });
          }
        };
        root.addEventListener("wheel", onHorizontalWheel, { passive: false });

        // Support horizontal finger drag (touch-to-scroll sideways) on iPad / touch screens
        let touchTrackState: {
          startX: number;
          startY: number;
          lastX: number;
          mode: "undecided" | "horizontal" | "vertical";
        } | null = null;

        const onTouchStart = (event: TouchEvent) => {
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
            window.scrollBy({
              top: stepDx * 1.65,
              behavior: "instant",
            });
          }
        };

        const onTouchEnd = () => {
          touchTrackState = null;
        };

        root.addEventListener("touchstart", onTouchStart, { passive: true });
        root.addEventListener("touchmove", onTouchMove, { passive: false });
        root.addEventListener("touchend", onTouchEnd, { passive: true });
        root.addEventListener("touchcancel", onTouchEnd, { passive: true });

        const st = ScrollTrigger.create({
          trigger: root,
          pin,
          start: "top top",
          end: () => `+=${Math.max(window.innerHeight * 3.8, 3200)}`,
          scrub: 0.35,
          invalidateOnRefresh: true,
          snap: {
            snapTo: (value) => {
              // Never snap at the top entrance or anywhere in/after "What do you want to make?" (#enquire)
              if (value < 0.015 || value >= PAN2_END - 0.01) {
                return value;
              }

              // Act I: If already resting inside a card's open plateau, do not snap
              if (value <= ACT1_END) {
                const cardIdx = getSteppedProgress(
                  value / ACT1_END,
                  workingPrinciples.length,
                );
                if (Math.abs(cardIdx - Math.round(cardIdx)) < 0.06) {
                  return value;
                }
                const nearestCard = Math.round(cardIdx);
                return (
                  getPlateauCenterProgress(
                    nearestCard,
                    workingPrinciples.length,
                  ) * ACT1_END
                );
              }

              // Between Act I and Act II (Horizontal Pan 1): finish the pan cleanly
              if (value < ACT2_START) {
                const panMid = (ACT1_END + ACT2_START) * 0.5;
                return value < panMid
                  ? STOP_PROGRESS[workingPrinciples.length - 1]!
                  : STOP_PROGRESS[workingPrinciples.length]!;
              }

              // Act II: If already resting inside a stage's open plateau, do not snap
              if (value <= ACT2_END) {
                const normAct2 = (value - ACT2_START) / (ACT2_END - ACT2_START);
                const stageIdx = getSteppedProgress(
                  normAct2,
                  programmeStages.length,
                  0.42,
                );
                if (Math.abs(stageIdx - Math.round(stageIdx)) < 0.06) {
                  return value;
                }
                const nearestStage = Math.round(stageIdx);
                return (
                  ACT2_START +
                  getPlateauCenterProgress(
                    nearestStage,
                    programmeStages.length,
                    0.42,
                  ) *
                    (ACT2_END - ACT2_START)
                );
              }

              // Between Act II and Act III (Horizontal Pan 2): finish the pan cleanly
              const pan2Mid = (ACT2_END + PAN2_END) * 0.5;
              return value < pan2Mid
                ? STOP_PROGRESS[
                    workingPrinciples.length + programmeStages.length - 1
                  ]!
                : PAN2_END;
            },
            delay: 0.16,
            duration: { min: 0.18, max: 0.42 },
            directional: false,
            ease: "power2.out",
          },
          onUpdate: (self) => {
            const p = self.progress;

            // Continuous lock zoom settle (0.98 -> 1.0 over the first 6% of pinned scroll)
            const lockZoomT = smoothstep(Math.min(1, p / 0.06));
            gsap.set(sliceTrack, { scale: lerp(0.98, 1, lockZoomT) });

            // 1. Act I: Continuous stepped-plateau card progression (0.00 -> 3.00)
            const act1Raw = Math.min(1, Math.max(0, p / ACT1_END));
            const continuousSliceIdx = getSteppedProgress(
              act1Raw,
              workingPrinciples.length,
            );
            lastRenderedSliceIdx = continuousSliceIdx;
            applyContinuousSliceLayout(continuousSliceIdx);

            const nearestSlice = Math.round(continuousSliceIdx);
            const sliceFill =
              1 - Math.min(1, Math.abs(continuousSliceIdx - nearestSlice));
            updatePaginationDOM(nearestSlice, sliceFill);

            // 2. Horizontal Pan 1 (#distance -> #programme) & Horizontal Pan 2 (#programme -> #enquire)
            const pan1T =
              p <= ACT1_END
                ? 0
                : p >= ACT2_START
                  ? 1
                  : smoothstep((p - ACT1_END) / (ACT2_START - ACT1_END));

            const pan2T =
              p <= ACT2_END
                ? 0
                : p >= PAN2_END
                  ? 1
                  : smoothstep((p - ACT2_END) / (PAN2_END - ACT2_END));

            const worldXPercent = -33.3333 * pan1T - 33.3334 * pan2T;
            gsap.set(world, { xPercent: worldXPercent });

            // 3. Act II: Continuous stepped-plateau programme stages (0.00 -> 5.00)
            const act2Raw =
              p <= ACT2_START
                ? 0
                : p >= ACT2_END
                  ? 1
                  : (p - ACT2_START) / (ACT2_END - ACT2_START);
            const continuousStageIdx = getSteppedProgress(
              act2Raw,
              programmeStages.length,
              0.42,
            );
            lastRenderedStageIdx = continuousStageIdx;
            applyContinuousProgrammeLayout(continuousStageIdx);

            const nearestStage = Math.round(continuousStageIdx);
            if (nearestStage !== lastCounterIdx) {
              lastCounterIdx = nearestStage;
              programmeCounterCurrent.textContent = String(
                nearestStage + 1,
              ).padStart(2, "0");
              stageCards.forEach((stageCard, idx) => {
                stageCard.classList.toggle("is-active", idx === nearestStage);
              });
            }

            const progressScale =
              (1 + continuousStageIdx) / programmeStages.length;
            gsap.set(programmeProgress, {
              scaleX: Math.max(
                1 / programmeStages.length,
                Math.min(1, progressScale),
              ),
            });

            // 4. Act III: Enquiry shell entrance during Pan 2
            gsap.set(enquiryShell, {
              scale: lerp(0.94, 1, pan2T),
              opacity: lerp(0.35, 1, pan2T),
              y: lerp(18, 0, pan2T),
            });

            // 5. Ambient background color & glow progression
            let bgStop = 0;
            if (p <= ACT1_END) {
              bgStop =
                (continuousSliceIdx /
                  Math.max(1, workingPrinciples.length - 1)) *
                0.16;
            } else if (p < ACT2_START) {
              bgStop = lerp(0.16, 0.33, pan1T);
            } else if (p <= ACT2_END) {
              bgStop = lerp(
                0.33,
                0.66,
                continuousStageIdx / Math.max(1, programmeStages.length - 1),
              );
            } else {
              bgStop = lerp(0.66, 1, pan2T);
            }
            pin.style.backgroundColor = interpolateBg(bgStop);

            const glowOpacity =
              p <= ACT1_END
                ? 1
                : p < ACT2_START
                  ? 1 - pan1T
                  : p <= ACT2_END
                    ? 0
                    : pan2T * 0.65;
            glow.style.opacity = glowOpacity.toFixed(3);
          },
        });

        triggerRef.current = st;

        return () => {
          window.removeEventListener("resize", onResize);
          root.removeEventListener("wheel", onHorizontalWheel);
          root.removeEventListener("touchstart", onTouchStart);
          root.removeEventListener("touchmove", onTouchMove);
          root.removeEventListener("touchend", onTouchEnd);
          root.removeEventListener("touchcancel", onTouchEnd);
          entranceTl.scrollTrigger?.kill();
          entranceTl.kill();
          st.kill();
          triggerRef.current = null;
          gsap.set(
            [
              pin,
              world,
              sliceTrack,
              programmeTrack,
              programmeProgress,
              enquiryShell,
            ],
            {
              clearProps: "all",
            },
          );
          sliceCards.forEach((c) => c.removeAttribute("style"));
          sliceCopies.forEach((c) => c?.removeAttribute("style"));
          sliceCopyInners.forEach((c) => c?.removeAttribute("style"));
          sliceCaptions.forEach((c) => c?.removeAttribute("style"));
          sliceScrims.forEach((c) => c?.removeAttribute("style"));
          sliceBridges.forEach((b) => b.removeAttribute("style"));
          stageCards.forEach((s) => s.removeAttribute("style"));
          pin.style.removeProperty("background-color");
          glow.style.removeProperty("opacity");
          delete root.dataset.enhanced;
        };
      },
    );

    return () => media.revert();
  }, []);

  function scrollToStopIndex(stopIdx: number) {
    const st = triggerRef.current;
    const bounded = Math.max(0, Math.min(STOP_PROGRESS.length - 1, stopIdx));
    const targetProgress = STOP_PROGRESS[bounded] ?? 0;

    if (st && rootRef.current?.dataset.enhanced === "true") {
      const targetScroll = st.start + (st.end - st.start) * targetProgress;
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    }
  }

  function selectSliceIndex(targetIndex: number) {
    const clamped = Math.max(
      0,
      Math.min(workingPrinciples.length - 1, targetIndex),
    );
    setActiveSlice(clamped);
    scrollToStopIndex(clamped);
  }

  function selectStage(index: number) {
    const clamped = Math.max(0, Math.min(programmeStages.length - 1, index));
    setActiveStage(clamped);
    scrollToStopIndex(workingPrinciples.length + clamped);
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
      if (dx < 0) {
        selectSliceIndex(activeSlice + 1);
      } else {
        selectSliceIndex(activeSlice - 1);
      }
    }
  }

  return (
    <section className="horizontal-showcase" ref={rootRef}>
      <div className="horizontal-showcase-pin" ref={pinRef}>
        <div
          className="horizontal-showcase-glow"
          ref={glowRef}
          aria-hidden="true"
        />

        <div className="horizontal-showcase-viewport">
          <div className="horizontal-showcase-world" ref={worldRef}>
            {/* PANEL 1: You are in Europe. The workshop is in India. */}
            <div className="horizontal-panel concerns-panel" id="distance">
              <div className="concerns-header container">
                <h2>
                  {isEs
                    ? "Tú estás en España o Europa. El taller está en la India."
                    : "You are in Europe. The workshop is in India."}
                </h2>
                <p className="concerns-subtitle">
                  {isEs
                    ? "Alma y Shirish mantienen ambos lados conectados a través de un único Product Brief."
                    : "Alma and Shirish keep both sides connected through one Product Brief."}{" "}
                  <Link
                    className="concerns-inline-link"
                    href={localizeHref("/working-across-distance")}
                  >
                    {isEs
                      ? "Cómo trabajamos entre España y la India"
                      : "How we work across distance"}
                  </Link>
                </p>
              </div>

              <div className="concerns-carousel-stage container">
                <div
                  ref={sliceTrackRef}
                  className="concerns-slice-track"
                  role="region"
                  aria-label={
                    isEs
                      ? "Pasos de coordinación entre Europa y la India"
                      : "Coordination steps between Europe and India"
                  }
                  onTouchStart={handleMobileSliceTouchStart}
                  onTouchEnd={handleMobileSliceTouchEnd}
                >
                  {PERSISTENT_SLOTS.map((slotOffset, slotIdx) => {
                    const itemIndex =
                      ((slotOffset % principlesCount) + principlesCount) %
                      principlesCount;
                    const principle = workingPrinciples[itemIndex]!;
                    const isCurrentMobile =
                      itemIndex === activeSlice &&
                      slotOffset >= 0 &&
                      slotOffset < principlesCount;
                    const initialDistance = Math.abs(slotOffset - activeSlice);
                    const initialTier =
                      initialDistance === 0
                        ? "active"
                        : initialDistance === 1
                          ? "near"
                          : initialDistance === 2
                            ? "far"
                            : "hidden";

                    const prevSlot =
                      slotIdx > 0 ? PERSISTENT_SLOTS[slotIdx - 1]! : slotOffset;
                    const bridgeVisible =
                      Math.abs(prevSlot - activeSlice) <= 2 &&
                      initialDistance <= 2;

                    return (
                      <Fragment key={slotOffset}>
                        {slotIdx > 0 ? (
                          <span
                            className="concerns-slice-bridge"
                            data-slice-bridge
                            data-bridge-active={bridgeVisible}
                            aria-hidden="true"
                          />
                        ) : null}

                        <article
                          className="concerns-slice-card"
                          data-slice-slot={slotOffset}
                          data-active={isCurrentMobile}
                          data-tier={initialTier}
                          onClick={() => {
                            const target = Math.max(
                              0,
                              Math.min(
                                principlesCount - 1,
                                slotOffset < 0
                                  ? 0
                                  : slotOffset >= principlesCount
                                    ? principlesCount - 1
                                    : slotOffset,
                              ),
                            );
                            selectSliceIndex(target);
                          }}
                        >
                          <div
                            className="concerns-slice-copy"
                            aria-hidden={!isCurrentMobile}
                          >
                            <div className="concerns-slice-copy-inner">
                              <div className="concerns-slice-copy-top">
                                <h3>{principle.title[language]}</h3>
                              </div>

                              <div className="concerns-slice-copy-bottom">
                                <p className="concerns-slice-body">
                                  {principle.body[language]}
                                </p>
                                <div className="concerns-slice-pills">
                                  <span className="concerns-slice-pill">
                                    {principle.tag[language]}
                                  </span>
                                  <span className="concerns-slice-pill">
                                    {principle.locationPill[language]}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="concerns-slice-media">
                            <Image
                              src={principle.image}
                              alt={principle.imageAlt[language]}
                              fill
                              sizes="(max-width: 56rem) 100vw, 480px"
                            />
                            <div
                              className="concerns-slice-media-scrim"
                              aria-hidden="true"
                            />
                            <p className="concerns-slice-caption">
                              {principle.imageAlt[language]}
                            </p>
                          </div>
                        </article>
                      </Fragment>
                    );
                  })}
                </div>

                <div
                  ref={paginationRef}
                  className="concerns-pagination"
                  role="tablist"
                  aria-label={
                    isEs ? "Seleccionar paso" : "Select coordination principle"
                  }
                >
                  {workingPrinciples.map((principle, index) => {
                    const isActive = index === activeSlice;
                    return (
                      <button
                        key={principle.id}
                        type="button"
                        role="tab"
                        aria-selected={isActive}
                        aria-label={principle.title[language]}
                        className="concerns-pagination-dot"
                        data-active={isActive}
                        onClick={() => selectSliceIndex(index)}
                      >
                        <span
                          className="concerns-pagination-fill"
                          style={{
                            opacity: isActive ? 1 : 0,
                            transform: `scaleX(${isActive ? 1 : 0})`,
                          }}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* PANEL 2: What happens to your Product Brief */}
            <div className="horizontal-panel programme-panel" id="programme">
              <div className="programme-intro container">
                <div className="programme-intro-copy">
                  <div>
                    <p className="programme-eyebrow">
                      {isEs
                        ? "PROGRAMA DE FABRICACIÓN"
                        : "MANUFACTURING PROGRAMME"}
                    </p>
                    <h2>
                      {isEs
                        ? "Qué ocurre con tu Product Brief"
                        : "What happens to your Product Brief"}
                    </h2>
                  </div>
                  <div className="pb-1">
                    <Link
                      className="w-fit font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                      href={localizeHref("/manufacturing-programme")}
                    >
                      {isEs
                        ? "Ver el Programa de fabricación"
                        : "Explore the Manufacturing Programme"}
                    </Link>
                  </div>
                </div>
              </div>

              <div className="programme-progress container" aria-hidden="true">
                <p className="programme-counter">
                  <span ref={programmeCounterCurrentRef}>
                    {String(activeStage + 1).padStart(2, "0")}
                  </span>
                  <span>
                    {" "}
                    / {String(programmeStages.length).padStart(2, "0")}
                  </span>
                </p>
                <div className="programme-progress-rule">
                  <span ref={programmeProgressRef} />
                </div>
              </div>

              <div className="programme-window">
                <ol className="programme-track" ref={programmeTrackRef}>
                  {programmeStages.map((stage, index) => (
                    <li
                      className={
                        index === activeStage
                          ? "programme-stage is-active"
                          : "programme-stage"
                      }
                      key={stage.id}
                      onClick={() => selectStage(index)}
                    >
                      <p className="programme-stage-number">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <div className="programme-stage-card">
                        <span className="programme-stage-badge">
                          {String(index + 1).padStart(2, "0")} / 06
                        </span>
                        <h3>{stage.title[language]}</h3>
                        <p>{stage.body[language]}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* PANEL 3: What do you want to make? */}
            <div className="horizontal-panel enquiry-panel" id="enquire">
              <div
                className="enquiry-panel-shell container"
                ref={enquiryShellRef}
              >
                <div className="enquiry-panel-card">
                  <div className="enquiry-copy">
                    <p className="enquiry-eyebrow">
                      {isEs ? "TU PRODUCT BRIEF" : "YOUR PRODUCT BRIEF"}
                    </p>
                    <h2>
                      {isEs
                        ? "¿Qué producto quieres fabricar?"
                        : "What do you want to make?"}
                    </h2>
                    <p className="lead">
                      {isEs
                        ? "Un boceto, una pieza que ya vendas o una muestra física nos basta para empezar a hablar."
                        : "A sketch, a piece you already sell, or a sample you can point to is enough to start."}
                    </p>
                  </div>

                  <div className="enquiry-actions">
                    <Link
                      className="primary-button"
                      href={localizeHref("/product-brief")}
                    >
                      {isEs
                        ? "Iniciar un Product Brief"
                        : "Start a Product Brief"}
                    </Link>
                    <Link
                      className="enquiry-secondary-link"
                      href={localizeHref("/contact")}
                    >
                      {isEs ? "Contactar" : "Contact us"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
