"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const programmeStages = [
  {
    title: "The Product Brief",
    body: "The client and KarmaRise D Global agree the product, design, materials, quantity, quality and delivery expectations. The Product Brief becomes the common reference for the work ahead.",
  },
  {
    title: "Manufacturing fit",
    body: "The programme is matched with an Indian Manufacturing Partner suited to the product, material and intended production quantity.",
  },
  {
    title: "Design and sampling",
    body: "Product decisions are developed and tested through sampling before the Bulk Order begins, keeping the intended design and the realities of making connected.",
  },
  {
    title: "Materials and preparation",
    body: "Materials, trims, finishes, quantities and timing are aligned with the Product Brief so production begins from decisions everyone can see.",
  },
  {
    title: "Production oversight",
    body: "Workmanship, approvals and production decisions remain tied to the Product Brief while the Manufacturing Partner makes the Bulk Order.",
  },
  {
    title: "Quality and Bulk Delivery",
    body: "Quality and delivery responsibilities stay visible until the finished Bulk Order is ready for the client.",
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
          <p className="section-index">The Manufacturing Programme</p>
          <div className="programme-intro-copy">
            <h2>One Product Brief. Six connected stages.</h2>
            <div className="grid gap-4 pb-2">
              <p className="max-w-[38ch] text-[length:var(--text-lg)] text-[var(--color-forest-deep)]/80">
                Product direction, manufacturing decisions and delivery stay
                connected instead of becoming separate jobs.
              </p>
              <Link
                className="w-fit font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/manufacturing-programme"
              >
                See the four phases in detail
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
