"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

const phases = [
  {
    number: "01",
    title: "Design approval",
    body: "The Product Brief is translated into design decisions the client can review and approve before sampling begins.",
    locked:
      "Locked here: silhouettes, dimensions, material qualities, hardware or trim direction, colourways, and target cost framework.",
    video: "/phases/Design.mp4",
    videoLabel:
      "Alma and Shirish reviewing a product design during development",
  },
  {
    number: "02",
    title: "Sample approval",
    body: "The sample gives the client a tangible point of review before the Bulk Order moves into production.",
    locked:
      "Locked here: physical fit, stitch density, construction tolerances, finish quality, and any revisions documented before bulk materials are ordered.",
    video: "/phases/Approval.mp4",
    videoLabel: "Finished samples being reviewed at a worktable",
  },
  {
    number: "03",
    title: "Production",
    body: "The Manufacturing Partner makes the Bulk Order while KarmaRise D Global stays close to workmanship and the decisions recorded in the Product Brief.",
    locked:
      "Checked here: material batch consistency, in-line floor supervision by our team in India, defect prevention, and schedule tracking.",
    video: "/phases/Manufacturing.mp4",
    videoLabel: "A Manufacturing Partner producing leather goods",
  },
  {
    number: "04",
    title: "Shipping",
    body: "The finished Bulk Order is prepared for the delivery responsibilities agreed with the client.",
    locked:
      "Verified here: final piece-level inspection, packaging and labelling accuracy, export paperwork alignment, and handover for dispatch.",
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
        <p className="section-index">From approval to delivery</p>
        <h2>Four phases keep the programme moving.</h2>
        <p>
          Each phase gives the client a clear point of review before the work
          moves forward.
        </p>
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
