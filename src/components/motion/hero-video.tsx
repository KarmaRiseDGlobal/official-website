"use client";

import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/context/language-context";
import {
  LOADER_DONE_ATTR,
  LOADER_EXITING_EVENT,
  LOADER_SKIP_ATTR,
} from "@/lib/loader";

interface HeroVideoProps {
  src?: string;
  poster?: string;
  label?: string;
  className?: string;
  videoClassName?: string;
  eager?: boolean;
  stickyCurtain?: boolean;
}

const VIDEO_CONTROL_LABELS = {
  en: {
    pause: "Pause background video",
    play: "Play background video",
  },
  es: {
    pause: "Pausar vídeo de fondo",
    play: "Reproducir vídeo de fondo",
  },
} as const;

export function HeroVideo({
  src = "/videos/hero/spain-india-workshop-banner.mp4",
  poster = "/videos/posters/spain-india-workshop-banner.jpg",
  label = "Production footage from a KarmaRise D Global Manufacturing Programme",
  className = "hero-video",
  videoClassName,
  eager = false,
  stickyCurtain = false,
}: HeroVideoProps) {
  const { language } = useLanguage();
  const frameRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);
  const [userPausePref, setUserPausePref] = useState<
    "paused" | "playing" | null
  >(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const userPausePrefRef = useRef<"paused" | "playing" | null>(userPausePref);
  useEffect(() => {
    userPausePrefRef.current = userPausePref;
  }, [userPausePref]);

  const isPaused =
    userPausePref === "paused" ||
    (userPausePref === null && prefersReducedMotion);

  useEffect(() => {
    if (eager) {
      return;
    }

    const frame = frameRef.current;
    if (!frame) return;

    const loadObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoad(true);
          loadObserver.disconnect();
        }
      },
      { rootMargin: "500px 0px" },
    );

    loadObserver.observe(frame);
    return () => loadObserver.disconnect();
  }, [eager]);

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;

    if (!frame || !video || !shouldLoad) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(reducedMotion.matches);

    let visible = false;
    let loaderCleared =
      document.documentElement.getAttribute(LOADER_DONE_ATTR) === "true" ||
      document.documentElement.getAttribute(LOADER_SKIP_ATTR) === "true";

    const sync = () => {
      setPrefersReducedMotion(reducedMotion.matches);
      const override = userPausePrefRef.current;
      const allowedByMotion =
        override === "playing"
          ? true
          : override === "paused"
            ? false
            : !reducedMotion.matches;
      const shouldPlay = visible && loaderCleared && allowedByMotion;

      if (shouldPlay) {
        if (video.readyState === 0) {
          video.load();
        }
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const onLoaderExiting = () => {
      loaderCleared = true;
      sync();
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    });

    observer.observe(frame);
    reducedMotion.addEventListener("change", sync);
    window.addEventListener(LOADER_EXITING_EVENT, onLoaderExiting);
    sync();

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
      window.removeEventListener(LOADER_EXITING_EVENT, onLoaderExiting);
    };
  }, [shouldLoad, src, userPausePref]);

  function handleTogglePlayback() {
    setShouldLoad(true);
    setUserPausePref(isPaused ? "playing" : "paused");
  }

  const toggleLabels = VIDEO_CONTROL_LABELS[language];

  const toggleButton = (
    <button
      type="button"
      className="hero-video-toggle"
      aria-pressed={isPaused}
      aria-label={isPaused ? toggleLabels.play : toggleLabels.pause}
      onClick={handleTogglePlayback}
    >
      {isPaused ? (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="7 4 20 12 7 20 7 4" />
        </svg>
      ) : (
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="9" y1="5" x2="9" y2="19" />
          <line x1="15" y1="5" x2="15" y2="19" />
        </svg>
      )}
    </button>
  );

  const videoElement = (
    <video
      ref={videoRef}
      className={videoClassName}
      muted
      loop
      playsInline
      preload={eager ? "metadata" : "none"}
      poster={poster}
      aria-label={label}
    >
      {shouldLoad ? <source src={src} type="video/mp4" /> : null}
    </video>
  );

  if (stickyCurtain) {
    return (
      <div className="hero-cover" data-hero-cover>
        <figure ref={frameRef} className={className} data-loop>
          <div className="hero-video-sticky">{videoElement}</div>
        </figure>
        {toggleButton}
      </div>
    );
  }

  return (
    <figure ref={frameRef} className={className} data-loop>
      {videoElement}
      {toggleButton}
    </figure>
  );
}
