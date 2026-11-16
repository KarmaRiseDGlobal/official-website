"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const programmeStages = [
  {
    title: "The Product Brief",
    body: "We agree on what the product should look like, how it should perform and when you need it.",
  },
  {
    title: "Choosing a workshop",
    body: "We look for a Manufacturing Partner with the right equipment and experience for your materials and order size.",
  },
  {
    title: "Design and sampling",
    body: "You review the design and handle a physical sample. We record any changes before the Bulk Order goes into production.",
  },
  {
    title: "Materials and preparation",
    body: "We confirm the production quantities, materials, trims and finishes with the workshop.",
  },
  {
    title: "Production oversight",
    body: "As the workshop makes the Bulk Order, we check workmanship against the approved sample and specifications.",
  },
  {
    title: "Final checks and delivery",
    body: "We check the finished pieces and packing, then coordinate dispatch under the agreed delivery terms.",
  },
] as const;

export function ManufacturingProgramme() {
  const rootRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLOListElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const [activeStage, setActiveStage] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    const progress = progressRef.current;

    if (!root || !pin || !track || !progress) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 64.001rem) and (prefers-reduced-motion: no-preference)",
      () => {
        root.dataset.enhanced = "true";

        const styles = getComputedStyle(document.documentElement);
        const dune = styles.getPropertyValue("--color-dune").trim();
        const paleSage = styles.getPropertyValue("--color-pale-sage").trim();
        const scrollDistance = () =>
          Math.max(
            track.scrollWidth - window.innerWidth,
            window.innerHeight * 2,
          );
        let currentStage = 0;

        const context = gsap.context(() => {
          gsap.set(progress, { scaleX: 0, transformOrigin: "left center" });

          const timeline = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: root,
              start: "top top",
              end: () => `+=${scrollDistance()}`,
              pin,
              pinSpacing: true,
              scrub: 0.65,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onUpdate: ({ progress: scrollProgress }) => {
                const nextStage = Math.min(
                  programmeStages.length - 1,
                  Math.round(scrollProgress * (programmeStages.length - 1)),
                );

                if (nextStage !== currentStage) {
                  currentStage = nextStage;
                  setActiveStage(nextStage);
                }
              },
            },
          });

          timeline
            .to(
              track,
              {
                x: () => -scrollDistance(),
                duration: 1,
              },
              0,
            )
            .to(progress, { scaleX: 1, duration: 1 }, 0)
            .to(root, { backgroundColor: dune, duration: 0.48 }, 0)
            .to(root, { backgroundColor: paleSage, duration: 0.52 }, 0.48);
        }, root);

        return () => {
          context.revert();
          delete root.dataset.enhanced;
          setActiveStage(0);
        };
      },
    );

    return () => media.revert();
  }, []);

  return (
    <section className="programme" id="programme" ref={rootRef}>
      <div className="programme-pin" ref={pinRef}>
        <div className="programme-intro container">
          <div className="programme-intro-copy">
            <h2>What happens to your Product Brief</h2>
            <div className="pb-2">
              <Link
                className="w-fit font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/manufacturing-programme"
              >
                Explore the Manufacturing Programme
              </Link>
            </div>
          </div>
        </div>

        <div className="programme-progress container" aria-hidden="true">
          <p className="programme-counter">
            <span>{String(activeStage + 1).padStart(2, "0")}</span>
            <span> / {String(programmeStages.length).padStart(2, "0")}</span>
          </p>
          <div className="programme-progress-rule">
            <span ref={progressRef} />
          </div>
        </div>

        <div className="programme-window">
          <ol className="programme-track" ref={trackRef}>
            {programmeStages.map((stage, index) => (
              <li
                className={
                  index === activeStage
                    ? "programme-stage is-active"
                    : "programme-stage"
                }
                key={stage.title}
              >
                <p className="programme-stage-number">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <div>
                  <h3>{stage.title}</h3>
                  <p>{stage.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="programme-color-bridge" aria-hidden="true" />
    </section>
  );
}
