"use client";

import { useEffect, useRef, useState } from "react";

import { ProcessGrowthTree } from "@/components/showcases/process-growth-tree";
import { useLanguage } from "@/context/language-context";
import { MANUFACTURING_STAGES } from "@/data/manufacturing-content";

const stages = MANUFACTURING_STAGES;

interface NetworkInformationLike {
  saveData?: boolean;
}

function isSaveDataEnabled(): boolean {
  if (typeof navigator === "undefined") return false;
  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
  };
  return nav.connection?.saveData === true;
}

function CheckSealIcon() {
  return (
    <svg
      aria-hidden="true"
      className="process-gate-icon shrink-0"
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.6"
      viewBox="0 0 16 16"
      width="16"
    >
      <circle cx="8" cy="8" r="6.25" />
      <path d="m5.5 8.1 1.7 1.7 3.3-3.5" />
    </svg>
  );
}

export function PhaseJourney() {
  const { language } = useLanguage();
  const isEs = language === "es";

  const rootRef = useRef<HTMLElement>(null);
  const [userPlaybackPref, setUserPlaybackPref] = useState<
    "auto" | "paused" | "playing"
  >("auto");
  const [systemPrefersPaused, setSystemPrefersPaused] = useState(false);

  const isPaused =
    userPlaybackPref === "paused" ||
    (userPlaybackPref === "auto" && systemPrefersPaused);

  // Lazy video src attachment + off-screen pause respecting Save-Data, prefers-reduced-motion, and user toggle
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    const videos = Array.from(
      root.querySelectorAll<HTMLVideoElement>("[data-process-video]"),
    );
    if (videos.length === 0) return;

    let loadObserver: IntersectionObserver | null = null;
    let playObserver: IntersectionObserver | null = null;

    const pauseAll = () => {
      for (const video of videos) {
        video.pause();
      }
    };

    const syncObservers = () => {
      loadObserver?.disconnect();
      playObserver?.disconnect();
      loadObserver = null;
      playObserver = null;

      const systemPaused = reducedMotionQuery.matches || isSaveDataEnabled();
      setSystemPrefersPaused(systemPaused);

      const shouldPause =
        userPlaybackPref === "paused" ||
        (userPlaybackPref === "auto" && systemPaused);

      if (shouldPause) {
        pauseAll();
        return;
      }

      loadObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            const video = entry.target as HTMLVideoElement;
            const src = video.dataset.src;
            if (src && !video.getAttribute("src")) {
              video.src = src;
            }
            loadObserver?.unobserve(video);
          }
        },
        { rootMargin: "320px 0px" },
      );

      playObserver = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
              const src = video.dataset.src;
              if (src && !video.getAttribute("src")) {
                video.src = src;
              }
              void video.play().catch(() => undefined);
            } else {
              video.pause();
            }
          }
        },
        { rootMargin: "80px 0px", threshold: 0.12 },
      );

      for (const video of videos) {
        loadObserver.observe(video);
        playObserver.observe(video);
      }
    };

    syncObservers();
    reducedMotionQuery.addEventListener("change", syncObservers);

    return () => {
      loadObserver?.disconnect();
      playObserver?.disconnect();
      reducedMotionQuery.removeEventListener("change", syncObservers);
      pauseAll();
    };
  }, [userPlaybackPref]);

  function handleTogglePlayback() {
    setUserPlaybackPref(isPaused ? "playing" : "paused");
  }

  return (
    <section
      aria-labelledby="process-heading"
      className="process-section relative bg-[var(--color-night)] text-[var(--color-paper)]"
      data-surface="dark"
      id="process"
      ref={rootRef}
    >
      <div className="container pb-[var(--section-gap-s)]">
        {/* Unified canvas spanning from the centered heading down through Stage 06 for the growing tree */}
        <div className="process-canvas" data-chat-avoid>
          <ProcessGrowthTree language={language} />

          {/* Distilled centered section header */}
          <div className="process-header">
            <h2 className="process-heading" id="process-heading">
              {isEs
                ? "Seis fases, del boceto a tu puerta"
                : "Six stages from sketch to your door"}
            </h2>
            <p className="process-intro" data-process-intro>
              {isEs
                ? "Conoces a quienes elaboran tus piezas en directo y apruebas por escrito cada fase antes de la siguiente."
                : "You meet the makers on live calls and sign off each stage in writing before the next begins."}
            </p>
            <button
              type="button"
              className="process-motion-toggle"
              data-process-origin
              aria-pressed={isPaused}
              onClick={handleTogglePlayback}
            >
              {isPaused ? (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="currentColor"
                >
                  <path d="M4.5 3.25 12.25 8 4.5 12.75V3.25Z" />
                </svg>
              ) : (
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="currentColor"
                >
                  <rect x="3.5" y="3" width="3" height="10" rx="0.75" />
                  <rect x="9.5" y="3" width="3" height="10" rx="0.75" />
                </svg>
              )}
              <span>
                {isPaused
                  ? isEs
                    ? "Reproducir vídeos"
                    : "Play stage clips"
                  : isEs
                    ? "Pausar vídeos"
                    : "Pause stage clips"}
              </span>
            </button>
          </div>

          {/* Six uniform 2-column editorial rows flanking the central growing botanical tree */}
          <ol className="process-stage-list">
            {stages.map((stage, index) => (
              <li
                className="process-stage-row"
                data-process-row
                data-stage-index={index}
                id={`stage-${stage.id}`}
                key={stage.id}
              >
                <div className="process-media-frame" data-stage-media>
                  <video
                    aria-label={stage.mediaLabel[language]}
                    className="process-stage-media"
                    data-process-video
                    data-src={stage.video}
                    loop
                    muted
                    playsInline
                    poster={stage.poster}
                    preload="none"
                  />
                </div>

                <div className="process-stage-content" data-stage-content>
                  <p className="process-stage-eyebrow num" data-stage-eyebrow>
                    {isEs
                      ? `Fase ${stage.stepNumber} / 06`
                      : `Stage ${stage.stepNumber} / 06`}
                  </p>
                  <h3 className="process-stage-title">
                    {stage.title[language]}
                  </h3>
                  <p className="process-stage-body">{stage.body[language]}</p>

                  <div className="process-stage-gate">
                    <CheckSealIcon />
                    <div className="process-gate-copy">
                      <span className="process-gate-label">
                        {isEs ? "Aprobación por escrito" : "Written sign-off"}
                      </span>
                      <span className="process-gate-value">
                        {stage.signOff[language]}
                      </span>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
