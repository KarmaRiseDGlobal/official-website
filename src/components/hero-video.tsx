"use client";

import { useEffect, useRef, useState } from "react";

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

interface HeroVideoProps {
  src?: string;
  poster?: string;
  label?: string;
  className?: string;
  videoClassName?: string;
  eager?: boolean;
}

export function HeroVideo({
  src = "/media/demo.mp4",
  poster = "/media/demo-poster.jpg",
  label = "Production footage from a KarmaRise D Global Manufacturing Programme",
  className = "hero-video",
  videoClassName,
  eager = false,
}: HeroVideoProps) {
  const frameRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(eager);

  useEffect(() => {
    if (eager || isSaveDataEnabled()) {
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

    if (isSaveDataEnabled()) {
      video.pause();
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = false;

    const sync = () => {
      const shouldPlay =
        visible && !reducedMotion.matches && !isSaveDataEnabled();

      if (shouldPlay) {
        if (
          video.readyState === 0 &&
          video.networkState !== HTMLMediaElement.NETWORK_LOADING
        ) {
          video.load();
        }
        void video.play().catch(() => {});
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? false;
      sync();
    });

    observer.observe(frame);
    reducedMotion.addEventListener("change", sync);
    sync();

    return () => {
      observer.disconnect();
      reducedMotion.removeEventListener("change", sync);
    };
  }, [shouldLoad, src]);

  return (
    <figure ref={frameRef} className={className} data-loop>
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
    </figure>
  );
}
