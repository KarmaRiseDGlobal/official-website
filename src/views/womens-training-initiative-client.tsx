"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { localizePath, type SiteLanguage } from "@/lib/urls";

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="editorial-arrow-icon shrink-0"
    >
      <path d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5" />
    </svg>
  );
}

const trainingTopics: ReadonlyArray<{
  id: string;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
  image: string;
  imagePosition: string;
  imageAlt: Record<SiteLanguage, string>;
}> = [
  {
    id: "sewing-machine",
    title: {
      en: "At the sewing machine",
      es: "En la máquina de coser",
    },
    body: {
      en: "Practise guiding fabric through studio and industrial machines, keeping a seam even, pressing it, and finishing the inside of a garment cleanly.",
      es: "Practicar el manejo del tejido en máquinas de estudio e industriales, mantener una costura regular, plancharla y rematar con limpieza el interior de cada prenda.",
    },
    image: "/images/almarise/almarise-sewing-studio-wide-view-india.jpg",
    imagePosition: "50% 52%",
    imageAlt: {
      en: "Sunlit garment studio in India with industrial sewing machines, a dressmaker form, and a woman maker seated at the sewing table",
      es: "Estudio textil soleado en la India con máquinas de coser industriales, un maniquí y una confeccionista sentada en la mesa de costura",
    },
  },
  {
    id: "cutting-table",
    title: {
      en: "At the cutting table",
      es: "En la mesa de patronaje y corte",
    },
    body: {
      en: "Draft a pattern, place it on natural cloth or an existing saree, then adjust the fit on a form and see what that changes in the finished piece.",
      es: "Trazar un patrón, situarlo sobre tela natural o sobre un sari existente y ajustar después la caída sobre el maniquí para comprobar cómo responde la prenda terminada.",
    },
    image: "/images/almarise/alma-draping-saree-dress-form-studio.jpeg",
    imagePosition: "50% 45%",
    imageAlt: {
      en: "Adjusting draped teal embroidered fabric on a dress form beside an industrial sewing machine in India",
      es: "Ajustando un tejido bordado sobre el maniquí junto a una máquina de coser industrial en la India",
    },
  },
];

const roadmapStages: ReadonlyArray<{
  id: string;
  stage: Record<SiteLanguage, string>;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
}> = [
  {
    id: "now",
    stage: {
      en: "Now",
      es: "Ahora",
    },
    title: {
      en: "Build up garment work",
      es: "Consolidar el trabajo textil",
    },
    body: {
      en: "We are developing AlmaRise D Brand in India and growing our client manufacturing work at KarmaRise D Global. That real studio work shapes what we will teach.",
      es: "Estamos desarrollando AlmaRise D Brand en la India e impulsando nuestros encargos de confección en KarmaRise D Global. Esa actividad real marcará el contenido de la formación.",
    },
  },
  {
    id: "next",
    stage: {
      en: "Next",
      es: "Siguiente paso",
    },
    title: {
      en: "Prepare the training studio",
      es: "Preparar el espacio formativo",
    },
    body: {
      en: "We are completing the legal groundwork for a non-profit Section 8 foundation in India, structuring practical lessons with experienced instructors and master tailors, and equipping an accessible learning studio.",
      es: "Estamos preparando la constitución legal de una fundación Section 8 sin ánimo de lucro en la India, el plan práctico de aprendizaje con formadoras y maestros sastres y el acondicionamiento de un espacio de estudio accesible.",
    },
  },
  {
    id: "long-term",
    stage: {
      en: "Long-term aim",
      es: "Objetivo a largo plazo",
    },
    title: {
      en: "Open training and connect graduates with work",
      es: "Abrir la formación y conectar con el empleo",
    },
    body: {
      en: "The aim is to help graduates move into paid work through future AlmaRise D Brand production, KarmaRise D Global studio work, or partner garment houses in India.",
      es: "El objetivo es que quienes completen la formación accedan a trabajo remunerado en la producción de AlmaRise D Brand, en el estudio de KarmaRise D Global o en confeccionistas colaboradores en la India.",
    },
  },
];

function isBelowFold(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return rect.top > window.innerHeight * 0.94;
}

export function WomensTrainingInitiativePageClient({
  lang = "en",
}: {
  lang?: SiteLanguage;
} = {}) {
  const language = lang;
  const localizeHref = (href: string) => localizePath(href, language);
  const isEs = language === "es";

  useEffect(() => {
    const main = document.getElementById("main");
    if (!main) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const targets = Array.from(
          main.querySelectorAll<HTMLElement>("[data-wti-reveal]"),
        );

        for (const el of targets) {
          if (!isBelowFold(el)) {
            continue;
          }

          gsap.set(el, { opacity: 0, y: 14 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.52,
            ease: "power3.out",
            clearProps: "transform,opacity",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              once: true,
            },
          });
        }

        ScrollTrigger.refresh();
      }, main);

      return () => ctx.revert();
    });

    return () => media.revert();
  }, []);

  return (
    <>
      <main id="main">
        {/* Band 1: Warm Parchment, Opening, Status Badge, Section 8 Groundwork, Hero Studio Photo */}
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-md))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <nav
              aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
              className="flex items-center text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] uppercase"
            >
              <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                <li>
                  <Link
                    className="inline-flex min-h-[var(--tap-min)] min-w-[var(--tap-min)] items-center text-[var(--color-muted)] no-underline transition-colors hover:text-[var(--color-forest-deep)]"
                    href={localizeHref("/")}
                  >
                    {isEs ? "Inicio" : "Home"}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-[var(--color-muted)]">
                  /
                </li>
                <li
                  aria-current="page"
                  className="inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-clay-ink)]"
                >
                  {isEs
                    ? "Iniciativa de formación para mujeres"
                    : "Women's Training Initiative"}
                </li>
              </ol>
            </nav>

            <div className="grid gap-[var(--space-lg)]">
              <h1 className="max-w-[18ch] text-[length:var(--text-display)] leading-[1.06] font-normal">
                {isEs
                  ? "Iniciativa de formación para mujeres"
                  : "Women's Training Initiative"}
              </h1>
              <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Estamos preparando un programa en la India para formar a mujeres en diseño de prendas y confección, con el trabajo digno y remunerado como objetivo a largo plazo."
                  : "We are planning garment design and stitching training for women in India, with dignified paid work as the long-term aim."}
              </p>
              <p className="max-w-[60ch] text-[var(--color-muted)]">
                {isEs
                  ? "En paralelo a nuestra actividad comercial, Shirish y Alma están preparando la estructura legal de una fundación Section 8 sin ánimo de lucro en la India para que el programa nazca con continuidad, transparencia y salidas reales de empleo."
                  : "Alongside our commercial work, Shirish and Alma are laying the legal groundwork for a non-profit Section 8 foundation in India so the programme opens with clear governance and practical routes into paid employment."}
              </p>
              <p className="m-0 inline-flex w-fit items-center gap-2.5 rounded-[var(--radius-pill)] bg-[var(--color-pale-sage)] px-4 py-2 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)]">
                <span
                  aria-hidden="true"
                  className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-forest)]"
                />
                <span>
                  {isEs
                    ? "Inscripciones aún no abiertas"
                    : "Applications have yet to open"}
                </span>
              </p>
            </div>

            <figure className="editorial-photo-frame m-0 aspect-[16/10]">
              <Image
                src="/images/almarise/karmarise-studio-sewing-tables-preparation-india.jpeg"
                alt={
                  isEs
                    ? "Sala soleada de nuestro estudio en la India con mesas de costura y un maniquí bajo fundas protectoras mientras preparamos el espacio"
                    : "Sunlit room in our studio in India with sewing tables and a dressmaker form under protective covers while the space is prepared"
                }
                fill
                priority
                sizes="(max-width: 80rem) 100vw, 1280px"
                className="object-cover object-[50%_55%]"
              />
            </figure>
          </div>
        </section>

        <SectionBridge from="paper" to="forest-deep" size="gentle" />

        {/* Band 2: Deep Forest, Origin Statement */}
        <section
          className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]"
          data-surface="dark"
        >
          <div className="container grid gap-[var(--space-xl)]">
            <p
              data-wti-reveal
              className="max-w-[32ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-s)] leading-[1.12] text-[var(--color-paper)]"
            >
              {isEs
                ? "La idea nació visitando estudios y fábricas de confección en la India. Alma y Shirish comprobaron lo difícil que resulta encontrar una formación que enseñe tanto costura como diseño y que conecte directamente a las mujeres con un trabajo remunerado."
                : "The idea came out of visiting garment makers in India. Alma and Shirish saw how hard it can be to find training that teaches both stitching and design and gives women a clear route into paid work."}
            </p>
          </div>
        </section>

        <SectionBridge from="forest-deep" to="dune" size="gentle" />

        {/* Band 3: Warm Dune, What the Training Will Cover */}
        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2
                data-wti-reveal
                className="max-w-[18ch] text-[length:var(--text-section)] leading-[1.06] font-normal"
              >
                {isEs
                  ? "Qué abarcará la formación"
                  : "What the training will cover"}
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2">
              {trainingTopics.map((topic) => (
                <article
                  key={topic.id}
                  data-wti-reveal
                  className="grid content-start gap-4"
                >
                  <figure className="editorial-photo-frame mx-auto my-0 aspect-[4/3] w-full max-w-[32rem] sm:max-w-none">
                    <Image
                      src={topic.image}
                      alt={topic.imageAlt[language]}
                      fill
                      sizes="(max-width: 40rem) 100vw, 48vw"
                      className="object-cover"
                      style={{ objectPosition: topic.imagePosition }}
                    />
                  </figure>
                  <h3 className="text-[length:var(--text-title)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                    {topic.title[language]}
                  </h3>
                  <p className="max-w-[54ch] text-[var(--color-muted)]">
                    {topic.body[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* Band 4: Warm Parchment, Roadmap and Help Shape the Training */}
        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--section-gap-s)]">
            <div className="grid gap-[var(--space-2xl)]">
              <div className="grid gap-[var(--space-md)]">
                <h2
                  data-wti-reveal
                  className="max-w-[18ch] text-[length:var(--text-section)] leading-[1.06] font-normal"
                >
                  {isEs
                    ? "Qué pasos damos primero"
                    : "What needs to happen first"}
                </h2>
              </div>

              <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-3">
                {roadmapStages.map((item) => (
                  <article
                    key={item.id}
                    data-wti-reveal
                    className="grid content-start gap-3"
                  >
                    <p className="m-0 inline-flex w-fit items-center rounded-[var(--radius-pill)] bg-[var(--color-pale-sage)] px-3.5 py-1 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)]">
                      {item.stage[language]}
                    </p>
                    <h3 className="text-[length:var(--text-title)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                      {item.title[language]}
                    </h3>
                    <p className="text-[var(--color-muted)]">
                      {item.body[language]}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            <div
              data-wti-reveal
              className="grid items-start gap-[var(--gap-columns)] lg:grid-cols-12"
            >
              <div className="grid gap-4 lg:col-span-7">
                <h2 className="max-w-[18ch] text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "Colabora en el diseño de la formación"
                    : "Help shape the training"}
                </h2>
                <p className="max-w-[54ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Nos encantará escuchar a formadoras textiles, patronistas y profesionales en la India que quieran colaborar en la puesta en marcha del programa."
                    : "We would like to hear from garment trainers, pattern makers, and others in India who can help develop the programme."}
                </p>
                <div className="pt-2">
                  <Link
                    className="primary-button-light"
                    href={localizeHref("/contact")}
                  >
                    {isEs
                      ? "Escribirnos sobre la iniciativa"
                      : "Contact us about the initiative"}
                  </Link>
                </div>
              </div>

              <nav
                aria-label={isEs ? "Lecturas relacionadas" : "Related reading"}
                className="grid content-start gap-1 text-[length:var(--text-sm)] lg:col-span-5 lg:pt-2"
              >
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref(
                    "/stories/preparing-womens-garment-training-maharashtra",
                  )}
                >
                  <span>
                    {isEs
                      ? "Leer por qué la formación aún no ha empezado"
                      : "Read why the training has not started yet"}
                  </span>
                  <ArrowIcon />
                </Link>
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                  href={localizeHref("/almarise")}
                >
                  <span>
                    {isEs
                      ? "Conocer AlmaRise D Brand"
                      : "Learn about AlmaRise D Brand"}
                  </span>
                  <ArrowIcon />
                </Link>
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                  href={localizeHref("/about")}
                >
                  <span>
                    {isEs
                      ? "Conocer a Alma y Shirish"
                      : "Meet Alma and Shirish"}
                  </span>
                  <ArrowIcon />
                </Link>
              </nav>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="pale-sage" />

        {/* Band 5: Pale Sage, Dedicated Newsletter Updates Section with Own H2 */}
        <section
          className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]"
          id="training-updates"
        >
          <div
            data-wti-reveal
            className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12"
          >
            <div className="grid gap-3 lg:col-span-5">
              <h2 className="m-0 max-w-[18ch] text-[length:var(--text-section)] leading-[1.06] font-normal text-[var(--color-forest-deep)]">
                {isEs
                  ? "Sigue nuestros avances mientras preparamos el espacio formativo"
                  : "Follow our progress as the training studio takes shape"}
              </h2>
              <p className="m-0 max-w-[46ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-ink-2)]">
                {isEs
                  ? "Historias de KarmaRise llega cada dos semanas con notas desde nuestro trabajo en la India, AlmaRise D Brand y pasos concretos mientras preparamos la Iniciativa de formación para mujeres."
                  : "KarmaRise Stories arrives every two weeks with notes from our work in India, AlmaRise D Brand, and concrete updates as we prepare the Women's Training Initiative."}
              </p>
            </div>
            <div className="lg:col-span-7">
              <NewsletterForm
                variant="light"
                source="Womens Training Initiative Page"
                defaultTrack="almarise"
              />
            </div>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="night" size="gentle" />
      </main>

      <SiteFooter hideNewsletter />
    </>
  );
}
