"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

import { useLanguage, type SiteLanguage } from "@/context/language-context";

const phases: ReadonlyArray<{
  number: string;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
  locked: Record<SiteLanguage, string>;
  video: string;
  videoLabel: Record<SiteLanguage, string>;
}> = [
  {
    number: "01",
    title: {
      en: "Design approval",
      es: "Aprobación del diseño",
    },
    body: {
      en: "You review the design against the Product Brief and approve it before the first sample is made.",
      es: "Revisas el diseño frente al Product Brief y lo apruebas antes de confeccionar la primera muestra.",
    },
    locked: {
      en: "We agree on shape, dimensions, materials, trims, colours, and target cost.",
      es: "Dejamos cerrados la forma, las dimensiones, los materiales, las fornituras, los colores y el coste objetivo.",
    },
    video: "/phases/phases (1).mp4",
    videoLabel: {
      en: "Alma reviewing product designs and specifications during development",
      es: "Alma revisando diseños y especificaciones de producto durante la fase de desarrollo",
    },
  },
  {
    number: "02",
    title: {
      en: "Sample approval",
      es: "Aprobación de la muestra",
    },
    body: {
      en: "Test the fit, check the stitching, and see how the finish feels in your hands.",
      es: "Prueba el corte, comprueba las costuras y valora en tus propias manos el acabado de la pieza.",
    },
    locked: {
      en: "We compare sample revisions with the written notes. Your approval sets the physical standard for the Bulk Order.",
      es: "Contrastamos cada ajuste con las notas escritas. Tu aprobación fija el estándar físico para todo el pedido.",
    },
    video: "/phases/phases (2).mp4",
    videoLabel: {
      en: "Shirish inspecting sample details and construction at a workshop table in India",
      es: "Shirish revisando los detalles y la confección de una muestra en la mesa del taller en la India",
    },
  },
  {
    number: "03",
    title: {
      en: "Production",
      es: "Producción en taller",
    },
    body: {
      en: "The Manufacturing Partner makes the Bulk Order while we check the work on the production floor in India.",
      es: "El taller fabrica el pedido mientras supervisamos el trabajo a pie de línea en la India.",
    },
    locked: {
      en: "We compare dye batches, watch for changes in stitching or hardware, and track the production schedule.",
      es: "Comparamos tintadas, vigilamos que no varíen las costuras ni los herrajes y seguimos de cerca el calendario de fabricación.",
    },
    video: "/phases/phases (3).mp4",
    videoLabel: {
      en: "A craftsman stitching a leather strap on an industrial machine in India",
      es: "Un artesano cosiendo una correa de piel en una máquina industrial en la India",
    },
  },
  {
    number: "04",
    title: {
      en: "Shipping",
      es: "Inspección y envío",
    },
    body: {
      en: "We inspect the finished pieces in India before the order leaves the workshop.",
      es: "Inspeccionamos las piezas terminadas en la India antes de que el pedido salga del taller.",
    },
    locked: {
      en: "We check packing, labels, and export paperwork against the agreed delivery terms before handing over for dispatch.",
      es: "Comprobamos el embalaje, el etiquetado y la documentación de exportación según los términos acordados antes de la salida.",
    },
    video: "/phases/phases (4).mp4",
    videoLabel: {
      en: "Finished textile pieces being inspected and stacked for packing in India",
      es: "Piezas textiles terminadas siendo revisadas y apiladas para su embalaje en la India",
    },
  },
];

const phaseTotal = String(phases.length).padStart(2, "0");

export function PhaseJourney() {
  const { language } = useLanguage();
  const isEs = language === "es";

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
          scrub: true,
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
              duration: 0.56,
              ease: "power3.inOut",
            },
            transitionStart + 0.22,
          )
          .to(
            outgoingCopy,
            {
              autoAlpha: 0,
              yPercent: -8,
              duration: 0.32,
              ease: "power2.in",
            },
            transitionStart + 0.22,
          )
          .to(
            incomingCopy,
            {
              autoAlpha: 1,
              yPercent: 0,
              duration: 0.34,
              ease: "power2.out",
            },
            transitionStart + 0.44,
          );
      }
      sequence.to({}, { duration: 0.22 });
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
        <h2>
          {isEs
            ? "De la aprobación del diseño a la entrega"
            : "From design approval to delivery"}
        </h2>
      </div>

      <div className="phase-scroll" data-phase-scroll>
        <div className="phase-stage container" data-phase-stage>
          <div className="phase-visual">
            <div className="phase-video-viewport" data-phase-video-viewport>
              <div className="phase-video-track" data-phase-video-track>
                {phases.map((phase) => (
                  <figure className="phase-video-panel" key={phase.number}>
                    <video
                      aria-label={phase.videoLabel[language]}
                      data-desktop-phase-video
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      src={phase.video}
                    />
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
                key={phase.number}
              >
                <p className="phase-number">
                  {phase.number} / {phaseTotal}
                </p>
                <h3>{phase.title[language]}</h3>
                <p className="phase-body">{phase.body[language]}</p>
                <p className="mt-2 max-w-[40ch] border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)] text-[var(--color-forest-deep)]">
                  {phase.locked[language]}
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
            key={phase.number}
          >
            <figure className="phase-mobile-frame">
              <video
                aria-label={phase.videoLabel[language]}
                loop
                muted
                playsInline
                preload="metadata"
                src={phase.video}
              />
            </figure>

            <div className="phase-mobile-copy">
              <p className="phase-number">
                {phase.number} / {phaseTotal}
              </p>
              <h3>{phase.title[language]}</h3>
              <p className="phase-body">{phase.body[language]}</p>
              <p className="max-w-[40ch] border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)] text-[var(--color-forest-deep)]">
                {phase.locked[language]}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
