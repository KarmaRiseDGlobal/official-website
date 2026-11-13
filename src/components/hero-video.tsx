"use client";

import { useEffect, useRef } from "react";

export function HeroVideo() {
  const frameRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    const video = videoRef.current;

    if (!frame || !video) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;

    const sync = () => {
      const shouldPlay = visible && !reducedMotion.matches;

      if (shouldPlay) {
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
  }, []);

  return (
    <figure ref={frameRef} className="hero-video" data-loop>
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        preload="auto"
        poster="/media/demo-poster.jpg"
        aria-label="Production footage from a KarmaRise D Global Manufacturing Programme"
      >
        <source src="/media/demo.mp4" type="video/mp4" />
      </video>
    </figure>
  );
}
