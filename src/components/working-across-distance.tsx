"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const bulkOrderImage = "/bulk_order/bulk-order-dispatch-readiness-v2.webp";

const workingPrinciples = [
  {
    title: "Tell Alma what you want to change",
    body: "Talk through the product in Spanish, English or Portuguese. Shirish follows up with the people making it in India.",
    image: "/warehouse visit images/at_the_plant.jpeg",
    imageAlt:
      "A group reviewing leather and finished bags during a factory visit",
  },
  {
    title: "Give the workshop a clear reference",
    body: "The Product Brief records decisions like the colour to match, the hardware to use and the finish to check.",
    image: "/warehouse visit images/working.jpeg",
    imageAlt: "Two people reviewing patterned textiles at a worktable",
  },
  {
    title: "Come back to the approved sample",
    body: "If something changes on the floor, we check it with the workshop and bring the decision back to you.",
    image: "/warehouse visit images/working_together.jpeg",
    imageAlt: "People working with garments in a production studio",
  },
  {
    title: "Plan for the day the order leaves",
    body: "We agree the quantity, packing requirements and who handles delivery before production starts.",
    image: bulkOrderImage,
    imageAlt:
      "Finished packaged goods beside export cartons and a packing checklist before dispatch",
  },
] as const;

export function WorkingAcrossDistance() {
  const rootRef = useRef<HTMLElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);
    root.dataset.enhanced = "true";

    const context = gsap.context(() => {
      const entries = gsap.utils.toArray<HTMLElement>("[data-working-entry]");

      entries.forEach((entry, index) => {
        ScrollTrigger.create({
          trigger: entry,
          start: "top 58%",
          end: "bottom 42%",
          onEnter: () => setActiveIndex(index),
          onEnterBack: () => setActiveIndex(index),
        });
      });
    }, root);

    return () => {
      delete root.dataset.enhanced;
      context.revert();
    };
  }, []);

  return (
    <section className="concerns" id="working-across-distance" ref={rootRef}>
      <div className="section-intro concerns-intro container">
        <h2>When your workshop is in another country</h2>
        <p>
          <Link
            className="text-[length:var(--text-md)] font-semibold text-[var(--color-paper)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-light)]"
            href="/working-across-distance"
          >
            How we work across distance
          </Link>
        </p>
      </div>

      <div className="concerns-layout container">
        <div className="concerns-visual" aria-hidden="true">
          <div className="concerns-image-stack">
            {workingPrinciples.map((principle, index) => (
              <div
                className={
                  index === activeIndex
                    ? "concerns-image is-active"
                    : "concerns-image"
                }
                key={principle.title}
              >
                <Image
                  src={principle.image}
                  alt=""
                  fill
                  sizes="(max-width: 60rem) 100vw, 45vw"
                />
              </div>
            ))}
          </div>
          <p className="concerns-image-note">
            {workingPrinciples[activeIndex]?.imageAlt}
          </p>
        </div>

        <div className="concerns-list">
          {workingPrinciples.map((principle, index) => (
            <article
              className={
                index === activeIndex
                  ? "concern-item is-active"
                  : "concern-item"
              }
              data-working-entry
              key={principle.title}
            >
              <h3>{principle.title}</h3>
              <p>{principle.body}</p>
              {principle.image === bulkOrderImage && (
                <Image
                  className="mt-[var(--space-xl)] hidden h-auto w-full max-w-md rounded-[var(--radius-card)] motion-reduce:block [@media(max-width:44rem)]:block"
                  src={principle.image}
                  alt={principle.imageAlt}
                  width={1120}
                  height={1400}
                  sizes="(max-width: 28rem) 100vw, 28rem"
                />
              )}
            </article>
          ))}
        </div>
      </div>

      <div className="concerns-color-bridge" aria-hidden="true" />
    </section>
  );
}
