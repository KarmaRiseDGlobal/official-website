"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  type KeyboardEvent,
  type PointerEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { CategoryShowcaseItem } from "@/data/manufacturing-content";
import type { SiteLanguage } from "@/lib/urls";

interface CategoryShowcaseStageProps {
  readonly categoryId: string;
  readonly categoryName: string;
  readonly items: readonly CategoryShowcaseItem[];
  readonly language: SiteLanguage;
}

interface QuickTiltControls {
  readonly rotateX: gsap.QuickToFunc;
  readonly rotateY: gsap.QuickToFunc;
}

/**
 * Staggered 4-piece wave silhouette:
 * slot 0: low-mid | slot 1: high | slot 2: low | slot 3: tall hero high
 */
const SLOT_ORDER = ["back-left", "mid-left", "mid-right", "front"] as const;

// All 4 pieces in each category lift smoothly together from beneath the shelf edge
const JUMP_START_Y = [150, 195, 130, 210] as const;
const JUMP_START_ROTATIONS = [-4, 3, -2.5, 2.5] as const;
const JUMP_DURATIONS = [0.68, 0.74, 0.64, 0.78] as const;
const JUMP_EASES = [
  "back.out(1.32)",
  "back.out(1.42)",
  "back.out(1.28)",
  "back.out(1.46)",
] as const;
const PARALLAX_AMPLITUDES = [8, -12, 6, -15] as const;

function getTooltipAlign(slotIndex: number): "start" | "center" | "end" {
  if (slotIndex === 0) return "start";
  if (slotIndex === 3) return "end";
  return "center";
}

export function CategoryShowcaseStage({
  categoryId,
  categoryName,
  items,
  language,
}: CategoryShowcaseStageProps) {
  const isEs = language === "es";
  const stageRef = useRef<HTMLDivElement>(null);
  const skylineRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const tilterRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const quickTiltMapRef = useRef<Map<string, QuickTiltControls>>(new Map());
  const closeTimerRef = useRef<number | null>(null);
  const prefersReducedMotionRef = useRef(false);
  const isFinePointerRef = useRef(false);

  // Roving tabIndex keeps keyboard navigation to 1 tab stop per shelf (4 total instead of 16)
  const [rovingIndex, setRovingIndex] = useState(0);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [isJumping, setIsJumping] = useState(false);

  const activeId = pinnedId ?? hoveredId;

  const orderedItems = useMemo(() => {
    const byPlane = new Map(items.map((item) => [item.plane, item]));
    const arranged = SLOT_ORDER.map((plane) => byPlane.get(plane)).filter(
      (item): item is CategoryShowcaseItem => item !== undefined,
    );
    return arranged.length === items.length ? arranged : items;
  }, [items]);

  const cancelPendingClose = useCallback(() => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleHoverClose = useCallback(() => {
    cancelPendingClose();
    closeTimerRef.current = window.setTimeout(() => {
      closeTimerRef.current = null;
      setHoveredId(null);
    }, 150);
  }, [cancelPendingClose]);

  useEffect(() => {
    return () => cancelPendingClose();
  }, [cancelPendingClose]);

  // Dismiss open disclosure panel on outside pointer down or Escape
  useEffect(() => {
    if (!activeId) return;
    const handleOutside = (event: globalThis.PointerEvent) => {
      const stage = stageRef.current;
      if (
        stage &&
        event.target instanceof Node &&
        !stage.contains(event.target)
      ) {
        setPinnedId(null);
        setHoveredId(null);
      }
    };
    const handleKey = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setPinnedId(null);
        setHoveredId(null);
      }
    };
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, [activeId]);

  // Smooth GSAP entrance across desktop, iPad, and iPhone + gentle opposing scroll float on >= 64rem
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const rowEl = stage.closest<HTMLElement>("[data-cat-chapter]") ?? stage;

    gsap.registerPlugin(ScrollTrigger);

    const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const syncFlags = () => {
      prefersReducedMotionRef.current = reducedQuery.matches;
      isFinePointerRef.current = fineQuery.matches && !reducedQuery.matches;
    };

    syncFlags();
    reducedQuery.addEventListener("change", syncFlags);
    fineQuery.addEventListener("change", syncFlags);

    const tiltControls = new Map<string, QuickTiltControls>();
    for (const item of orderedItems) {
      const tilterEl = tilterRefs.current.get(item.id);
      if (tilterEl) {
        tiltControls.set(item.id, {
          rotateX: gsap.quickTo(tilterEl, "rotateX", {
            duration: 0.26,
            ease: "power3.out",
          }),
          rotateY: gsap.quickTo(tilterEl, "rotateY", {
            duration: 0.26,
            ease: "power3.out",
          }),
        });
      }
    }
    quickTiltMapRef.current = tiltControls;

    const media = gsap.matchMedia();

    // 1. Desktop & iPad (>= 48rem): Every piece lifts up together from beneath the shelf baseline
    media.add(
      "(min-width: 48rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          const jumpNodes = Array.from(
            stage.querySelectorAll<HTMLElement>("[data-cat-jump]"),
          );
          if (jumpNodes.length === 0) return;

          const rect = rowEl.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.92) {
            return;
          }

          jumpNodes.forEach((node, idx) => {
            gsap.set(node, {
              y: JUMP_START_Y[idx] ?? 160,
              scale: 0.78,
              rotateX: 14,
              rotateZ: JUMP_START_ROTATIONS[idx] ?? 0,
              opacity: 0,
              transformOrigin: "50% 85%",
              transformPerspective: 1000,
            });
          });

          const jumpTl = gsap.timeline({
            scrollTrigger: {
              trigger: rowEl,
              start: "top 76%",
              once: true,
              onEnter: () => setIsJumping(true),
            },
            onComplete: () => {
              gsap.set(jumpNodes, { clearProps: "transform,opacity" });
              setIsJumping(false);
            },
          });

          jumpNodes.forEach((node, idx) => {
            jumpTl.to(
              node,
              {
                opacity: 1,
                duration: 0.16,
                ease: "power1.out",
              },
              0,
            );
            jumpTl.to(
              node,
              {
                y: 0,
                scale: 1,
                rotateX: 0,
                rotateZ: 0,
                duration: JUMP_DURATIONS[idx] ?? 0.72,
                ease: JUMP_EASES[idx] ?? "back.out(1.38)",
              },
              0,
            );
          });

          ScrollTrigger.sort();
        }, stage);

        return () => {
          setIsJumping(false);
          ctx.revert();
        };
      },
    );

    // 2. iPhone / compact mobile (< 48rem): Crisp staggered rise without overflow clipping
    media.add(
      "(max-width: 47.99rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          const jumpNodes = Array.from(
            stage.querySelectorAll<HTMLElement>("[data-cat-jump]"),
          );
          if (jumpNodes.length === 0) return;

          const rect = rowEl.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.92) {
            return;
          }

          gsap.set(jumpNodes, {
            y: 22,
            scale: 0.94,
            opacity: 0,
          });

          gsap.to(jumpNodes, {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.46,
            stagger: 0.06,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: rowEl,
              start: "top 86%",
              once: true,
            },
          });

          ScrollTrigger.sort();
        }, stage);

        return () => ctx.revert();
      },
    );

    // 3. Wide desktop & iPad landscape (>= 64rem): Gentle weightless opposing scroll float
    media.add(
      "(min-width: 64rem) and (prefers-reduced-motion: no-preference)",
      () => {
        const ctx = gsap.context(() => {
          const depthNodes = Array.from(
            stage.querySelectorAll<HTMLElement>("[data-cat-depth]"),
          );
          if (depthNodes.length === 0) return;

          const scaleFactor = fineQuery.matches ? 1 : 0.55;

          const floatTl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: rowEl,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
              invalidateOnRefresh: true,
            },
          });

          depthNodes.forEach((node, idx) => {
            const amp = (PARALLAX_AMPLITUDES[idx] ?? 8) * scaleFactor;
            floatTl.fromTo(node, { y: amp }, { y: -amp }, 0);
          });

          ScrollTrigger.sort();
        }, stage);

        return () => {
          setIsJumping(false);
          ctx.revert();
        };
      },
    );

    return () => {
      reducedQuery.removeEventListener("change", syncFlags);
      fineQuery.removeEventListener("change", syncFlags);
      media.revert();
      quickTiltMapRef.current.clear();
    };
  }, [orderedItems]);

  // Choreograph selection / hover lift + subtle sibling recession
  useEffect(() => {
    if (prefersReducedMotionRef.current) {
      for (const item of orderedItems) {
        const el = tilterRefs.current.get(item.id);
        if (el) gsap.set(el, { clearProps: "transform,opacity" });
      }
      return;
    }

    const hasFocus = activeId !== null;

    for (const item of orderedItems) {
      const el = tilterRefs.current.get(item.id);
      if (!el) continue;

      if (hasFocus && item.id === activeId) {
        gsap.to(el, {
          y: -10,
          scale: 1.07,
          opacity: 1,
          duration: 0.26,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else if (hasFocus) {
        gsap.to(el, {
          y: 0,
          scale: 0.96,
          opacity: 0.58,
          rotateX: 0,
          rotateY: 0,
          duration: 0.22,
          ease: "power3.out",
          overwrite: "auto",
        });
      } else {
        gsap.to(el, {
          y: 0,
          scale: 1,
          opacity: 1,
          rotateX: 0,
          rotateY: 0,
          duration: 0.22,
          ease: "power3.out",
          overwrite: "auto",
        });
      }
    }
  }, [activeId, orderedItems]);

  const handlePointerEnter = (
    itemId: string,
    event: PointerEvent<HTMLButtonElement>,
  ) => {
    if (event.pointerType === "mouse") {
      cancelPendingClose();
      setHoveredId(itemId);
    }
  };

  const handlePointerMove = (
    itemId: string,
    event: PointerEvent<HTMLButtonElement>,
  ) => {
    if (
      event.pointerType !== "mouse" ||
      !isFinePointerRef.current ||
      prefersReducedMotionRef.current
    ) {
      return;
    }
    const controls = quickTiltMapRef.current.get(itemId);
    if (!controls) return;

    const rect = event.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const relX = (event.clientX - rect.left) / rect.width - 0.5;
    const relY = (event.clientY - rect.top) / rect.height - 0.5;
    controls.rotateY(relX * 10);
    controls.rotateX(-relY * 10);
  };

  const handlePointerLeave = (
    itemId: string,
    event: PointerEvent<HTMLButtonElement>,
  ) => {
    if (event.pointerType !== "mouse") return;
    const controls = quickTiltMapRef.current.get(itemId);
    if (controls) {
      controls.rotateX(0);
      controls.rotateY(0);
    }
    scheduleHoverClose();
  };

  const handleKeyDown = (
    index: number,
    event: KeyboardEvent<HTMLButtonElement>,
  ) => {
    const isRtl =
      typeof document !== "undefined" && document.documentElement.dir === "rtl";
    const nextKey = isRtl ? "ArrowLeft" : "ArrowRight";
    const prevKey = isRtl ? "ArrowRight" : "ArrowLeft";

    let targetIndex: number | null = null;
    if (event.key === nextKey) {
      targetIndex = (index + 1) % orderedItems.length;
    } else if (event.key === prevKey) {
      targetIndex = (index - 1 + orderedItems.length) % orderedItems.length;
    } else if (event.key === "Home") {
      targetIndex = 0;
    } else if (event.key === "End") {
      targetIndex = orderedItems.length - 1;
    }

    if (targetIndex === null) return;
    event.preventDefault();
    const targetItem = orderedItems[targetIndex];
    if (!targetItem) return;
    setRovingIndex(targetIndex);
    setPinnedId(targetItem.id);
    buttonRefs.current[targetIndex]?.focus();
  };

  return (
    <div
      className="cat-shelf-stage"
      ref={stageRef}
      role="group"
      aria-label={
        isEs
          ? `Piezas que fabricamos en ${categoryName}`
          : `Pieces we craft in ${categoryName}`
      }
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse") {
          scheduleHoverClose();
        }
      }}
    >
      <div
        className="cat-shelf-pop-mask"
        data-jumping={isJumping ? "true" : undefined}
      >
        <div className="cat-shelf-skyline" ref={skylineRef}>
          {orderedItems.map((item, index) => {
            const isActive = activeId === item.id;
            const tooltipAlign = getTooltipAlign(index);
            const panelId = `cat-panel-${categoryId}-${item.id}`;

            return (
              <div
                key={item.id}
                className={`cat-sky-item cat-sky-item--${index}`}
                data-active={isActive ? "true" : "false"}
              >
                <div className="cat-sky-jump" data-cat-jump>
                  <div className="cat-sky-depth" data-cat-depth>
                    <div className="cat-sky-drag">
                      <button
                        ref={(node) => {
                          buttonRefs.current[index] = node;
                        }}
                        type="button"
                        className="cat-piece-trigger press-scale cursor-pointer"
                        data-active={isActive ? "true" : "false"}
                        tabIndex={index === rovingIndex ? 0 : -1}
                        aria-expanded={isActive}
                        aria-controls={panelId}
                        onPointerEnter={(event) =>
                          handlePointerEnter(item.id, event)
                        }
                        onPointerMove={(event) =>
                          handlePointerMove(item.id, event)
                        }
                        onPointerLeave={(event) =>
                          handlePointerLeave(item.id, event)
                        }
                        onFocus={() => {
                          setRovingIndex(index);
                          setHoveredId(item.id);
                        }}
                        onBlur={(event) => {
                          if (
                            !stageRef.current?.contains(
                              event.relatedTarget as Node | null,
                            )
                          ) {
                            setHoveredId(null);
                            setPinnedId(null);
                          }
                        }}
                        onClick={() => {
                          setRovingIndex(index);
                          setPinnedId((current) =>
                            current === item.id ? null : item.id,
                          );
                        }}
                        onKeyDown={(event) => handleKeyDown(index, event)}
                      >
                        <div
                          className="cat-piece-tilter"
                          ref={(node) => {
                            if (node) {
                              tilterRefs.current.set(item.id, node);
                            } else {
                              tilterRefs.current.delete(item.id);
                            }
                          }}
                        >
                          <div className="cat-piece-media">
                            <Image
                              src={item.image}
                              alt=""
                              fill
                              draggable={false}
                              sizes="(max-width: 48rem) 112px, (max-width: 64rem) 136px, 180px"
                              className="cat-piece-img object-contain"
                            />
                          </div>
                        </div>
                        <span className="cat-piece-label">
                          {item.shortLabel[language]}
                        </span>
                      </button>

                      <div
                        id={panelId}
                        role="region"
                        aria-label={item.name[language]}
                        className={`cat-tooltip cat-tooltip--${tooltipAlign} pointer-events-auto`}
                        data-open={isActive ? "true" : "false"}
                        aria-hidden={!isActive}
                        onPointerEnter={(event) => {
                          if (event.pointerType === "mouse") {
                            cancelPendingClose();
                            setHoveredId(item.id);
                          }
                        }}
                        onPointerLeave={(event) => {
                          if (event.pointerType === "mouse") {
                            scheduleHoverClose();
                          }
                        }}
                      >
                        <p className="cat-tooltip-title">
                          {item.name[language]}
                        </p>
                        <p className="cat-tooltip-body">
                          {item.tooltip[language]}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
