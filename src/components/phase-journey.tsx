"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const phases = [
  {
    number: "01",
    title: "Design approval",
    body: "You review the design against the Product Brief and approve it before the first sample is made.",
    locked:
      "We agree on shape, dimensions, materials, trims, colours and target cost.",
    video: "/phases/Design.mp4",
    videoLabel:
      "Alma and Shirish reviewing a product design during development",
  },
  {
    number: "02",
    title: "Sample approval",
    body: "Try the fit, check the stitching and see how the finish looks in your hands.",
    locked:
      "We compare sample revisions with the written notes. Your approval sets the standard for the Bulk Order.",
    video: "/phases/Approval.mp4",
    videoLabel: "Finished samples being reviewed at a worktable",
  },
  {
    number: "03",
    title: "Production",
    body: "The Manufacturing Partner makes the Bulk Order. Our team in India checks the work on the production floor.",
    locked:
      "We compare dye batches, watch for changes in stitching or hardware and track the production schedule.",
    video: "/phases/Manufacturing.mp4",
    videoLabel: "A Manufacturing Partner producing leather goods",
  },
  {
    number: "04",
    title: "Shipping",
    body: "We inspect the finished pieces before the order leaves the workshop.",
    locked:
      "We check packing, labels and export paperwork against the agreed delivery terms before handing over for dispatch.",
    video: "/phases/Logistics.mp4",
    videoLabel: "Finished products being packed for delivery",
  },
] as const;

const phaseTotal = String(phases.length).padStart(2, "0");

export function PhaseJourney() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const videos = Array.from(root.querySelectorAll("video"));
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const desktop = window.matchMedia("(min-width: 64.001rem)").matches;

    videos.forEach((video) => video.pause());

    if (reducedMotion) return;

    if (!desktop) {
      const visibilityObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target.querySelector("video");
            if (!video) return;

            if (entry.isIntersecting) {
              void video.play().catch(() => undefined);
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0.25 },
      );

      root
        .querySelectorAll<HTMLElement>("[data-mobile-phase-step]")
        .forEach((step) => visibilityObserver.observe(step));

      return () => {
        visibilityObserver.disconnect();
        videos.forEach((video) => video.pause());
      };
    }

    const scrollSection = root.querySelector<HTMLElement>(
      "[data-phase-scroll]",
    );
    const stage = root.querySelector<HTMLElement>("[data-phase-stage]");
    const videoViewport = root.querySelector<HTMLElement>(
      "[data-phase-video-viewport]",
    );
    const videoTrack = root.querySelector<HTMLElement>(
      "[data-phase-video-track]",
    );
    const copyPanels = Array.from(
      root.querySelectorAll<HTMLElement>("[data-phase-copy]"),
    );
    const desktopVideos = Array.from(
      root.querySelectorAll<HTMLVideoElement>("[data-desktop-phase-video]"),
    );

    if (!scrollSection || !stage || !videoViewport || !videoTrack) return;

    gsap.registerPlugin(ScrollTrigger);
    root.dataset.enhanced = "true";

    const context = gsap.context(() => {
      let activeIndex = -1;

      const setActivePhase = (nextIndex: number) => {
        const boundedIndex = Math.max(
          0,
          Math.min(phases.length - 1, nextIndex),
        );
        if (boundedIndex === activeIndex) return;

        activeIndex = boundedIndex;
        copyPanels.forEach((panel, index) => {
          panel.classList.toggle("is-active", index === activeIndex);
        });
        desktopVideos.forEach((video, index) => {
          if (index === activeIndex) {
            void video.play().catch(() => undefined);
          } else {
            video.pause();
          }
        });
      };

      copyPanels.forEach((panel, index) => {
        gsap.set(panel, {
          autoAlpha: index === 0 ? 1 : 0,
          yPercent: index === 0 ? 0 : 12,
        });
      });
      setActivePhase(0);

      const sequence = gsap.timeline({
        scrollTrigger: {
          trigger: scrollSection,
          start: "top top",
          end: () => `+=${window.innerHeight * (phases.length - 1)}`,
          pin: stage,
          pinSpacing: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            setActivePhase(Math.round(self.progress * (phases.length - 1)));
          },
        },
      });

      for (let index = 1; index < phases.length; index += 1) {
        const transitionStart = index - 1;
        const outgoingCopy = copyPanels[index - 1];
        const incomingCopy = copyPanels[index];

        if (!outgoingCopy || !incomingCopy) continue;

        sequence
          .to(
            videoTrack,
            {
              y: () => -videoViewport.clientHeight * index,
              duration: 1,
              ease: "power2.inOut",
            },
            transitionStart,
          )
          .to(
            outgoingCopy,
            {
              autoAlpha: 0,
              yPercent: -10,
              duration: 0.3,
              ease: "power2.in",
            },
            transitionStart,
          )
          .fromTo(
            incomingCopy,
            { autoAlpha: 0, yPercent: 10 },
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.38,
              ease: "power2.out",
            },
            transitionStart + 0.48,
          );
      }
    }, root);

    return () => {
      delete root.dataset.enhanced;
      context.revert();
      videos.forEach((video) => video.pause());
    };
  }, []);

  return (
    <section className="phase-journey" id="phases" ref={rootRef}>
      <div className="section-intro phase-journey-heading container">
        <h2>From design approval to delivery</h2>
      </div>

      <div className="phase-scroll" data-phase-scroll>
        <div className="phase-stage container" data-phase-stage>
          <div className="phase-visual">
            <div className="phase-video-viewport" data-phase-video-viewport>
              <div className="phase-video-track" data-phase-video-track>
                {phases.map((phase) => (
                  <figure className="phase-video-panel" key={phase.title}>
                    <video
                      aria-label={phase.videoLabel}
                      data-desktop-phase-video
                      loop
                      muted
                      playsInline
                      preload="metadata"
                    >
                      <source
                        media="(min-width: 64.001rem)"
                        src={phase.video}
                        type="video/mp4"
                      />
                    </video>
                  </figure>
                ))}
              </div>
            </div>
            <div className="phase-frame-overlay" aria-hidden="true" />
          </div>

          <div className="phase-copy-viewport">
            {phases.map((phase, index) => (
              <article
                className={
                  index === 0
                    ? "phase-copy-panel is-active"
                    : "phase-copy-panel"
                }
                data-phase-copy
                key={phase.title}
              >
                <p className="phase-number">
                  {phase.number} / {phaseTotal}
                </p>
                <h3>{phase.title}</h3>
                <p className="phase-body">{phase.body}</p>
                <p className="mt-2 max-w-[40ch] border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)] text-[var(--color-forest-deep)]">
                  {phase.locked}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>

      <ol className="phase-mobile-list container">
        {phases.map((phase) => (
          <li
            className="phase-mobile-step"
            data-mobile-phase-step
            key={phase.title}
          >
            <figure className="phase-mobile-frame">
              <video
                aria-label={phase.videoLabel}
                loop
                muted
                playsInline
                preload="metadata"
              >
                <source
                  media="(max-width: 64rem)"
                  src={phase.video}
                  type="video/mp4"
                />
              </video>
            </figure>

            <div className="phase-mobile-copy">
              <p className="phase-number">
                {phase.number} / {phaseTotal}
              </p>
              <h3>{phase.title}</h3>
              <p className="phase-body">{phase.body}</p>
              <p className="max-w-[40ch] border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)] text-[var(--color-forest-deep)]">
                {phase.locked}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
