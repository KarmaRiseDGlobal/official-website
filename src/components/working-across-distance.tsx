"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const bulkOrderImage = "/bulk_order/bulk-order-dispatch-readiness-v2.webp";

const workingPrinciples = [
  {
    title: "One conversation across countries",
    body: "Alma works directly with clients in Spanish, English and Portuguese. Shirish works with manufacturing partners and artisans in India. The Product Brief remains the common reference between them.",
    image: "/warehouse visit images/at_the_plant.jpeg",
    imageAlt:
      "A group reviewing leather and finished bags during a factory visit",
  },
  {
    title: "A Product Brief the factory can work from",
    body: "Design, materials, quantity, quality and delivery expectations are made clear before bulk production. Any documentation or testing scope can be agreed around the product being made.",
    image: "/warehouse visit images/working.jpeg",
    imageAlt: "Two people reviewing patterned textiles at a worktable",
  },
  {
    title: "Production decisions remain connected",
    body: "KarmaRise D Global stays involved while materials, samples and workmanship are reviewed. The client is not left to manage those conversations from a distance.",
    image: "/warehouse visit images/working_together.jpeg",
    imageAlt: "People working with garments in a production studio",
  },
  {
    title: "Quantities and delivery are discussed early",
    body: "The intended order quantity, available flexibility and delivery responsibilities are considered before production begins, not after the product has already been committed.",
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
        <p className="section-index">Working across distance</p>
        <h2>The work stays connected.</h2>
        <p>
          A Manufacturing Programme keeps the people defining the product close
          to the people making it.
        </p>
        <p>
          <Link
            className="text-[length:var(--text-md)] font-semibold text-[var(--color-paper)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-light)]"
            href="/working-across-distance"
          >
            Explore how Spain and India stay connected
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
