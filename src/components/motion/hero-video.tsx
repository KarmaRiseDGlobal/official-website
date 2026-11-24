"use client";

import { useEffect, useRef, useState } from "react";

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

export function HeroVideo({
  src = "/videos/hero/spain-india-workshop-banner.mp4",
  poster = "/videos/posters/spain-india-workshop-banner.jpg",
  label = "Production footage from a KarmaRise D Global Manufacturing Programme",
  className = "hero-video",
  videoClassName,
  eager = false,
  stickyCurtain = false,
}: HeroVideoProps) {
  const frameRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

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
    let visible = false;
    let loaderCleared =
      document.documentElement.getAttribute(LOADER_DONE_ATTR) === "true" ||
      document.documentElement.getAttribute(LOADER_SKIP_ATTR) === "true";

    const sync = () => {
      const shouldPlay = visible && loaderCleared && !reducedMotion.matches;

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
  }, [shouldLoad, src]);

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
      </div>
    );
  }

  return (
    <figure ref={frameRef} className={className} data-loop>
      {videoElement}
    </figure>
  );
}
