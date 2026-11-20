"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { HeroVideo } from "@/components/hero-video";
import { PhaseJourney } from "@/components/phase-journey";
import { SectionBridge } from "@/components/section-bridge";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";

const heroFacts: ReadonlyArray<{
  number: string;
  label: Record<SiteLanguage, string>;
  detail: Record<SiteLanguage, string>;
}> = [
  {
    number: "01",
    label: {
      en: "Single team end to end",
      es: "Un solo equipo de principio a fin",
    },
    detail: {
      en: "Alma and Shirish carry your Product Brief directly onto the workshop floor.",
      es: "Alma y Shirish llevan tu Product Brief en persona hasta la nave del taller.",
    },
  },
  {
    number: "02",
    label: {
      en: "Physical sample first",
      es: "Muestra física antes de producir",
    },
    detail: {
      en: "Bulk cutting starts only after you hold and sign off the reference sample.",
      es: "No se corta material para serie hasta que revisas y apruebas la muestra en mano.",
    },
  },
  {
    number: "03",
    label: {
      en: "Spain, Europe & India",
      es: "España, Europa e India",
    },
    detail: {
      en: "Direct communication in Spanish and English with Manufacturing Partners across India.",
      es: "Trato directo en español e inglés con talleres especializados en toda la India.",
    },
  },
];

const productCategories: ReadonlyArray<{
  id: string;
  number: string;
  name: Record<SiteLanguage, string>;
  summary: Record<SiteLanguage, string>;
  image: string;
  imageAlt: Record<SiteLanguage, string>;
}> = [
  {
    id: "bags",
    number: "01",
    name: {
      en: "Bags and accessories",
      es: "Bolsos y accesorios de piel",
    },
    summary: {
      en: "Structured leather bags, soft carryalls, and small leather goods. We work with specialist workshops across India on leather-and-canvas construction, custom linings, and hardware.",
      es: "Bolsos de piel estructurada, bolsos flexibles y pequeña marroquinería. Trabajamos con talleres especializados en la India en construcciones de piel y lona, forros personalizados y herrajes.",
    },
    image: "/images/alma_at_the_warehouse (2).jpeg",
    imageAlt: {
      en: "Alma holding up a finished black leather bag inside the showroom of an Indian leather workshop",
      es: "Alma sosteniendo un bolso terminado de piel negra en la sala de muestras de un taller en la India",
    },
  },
  {
    id: "garments",
    number: "02",
    name: {
      en: "Garments and clothing",
      es: "Prendas y colecciones textiles",
    },
    summary: {
      en: "Woven apparel and seasonal capsule collections. We match the cut, fabric weight, finish, and run size to the right garment workshop in India.",
      es: "Prendas de tejido plano y colecciones cápsula de temporada. Conectamos el corte, el gramaje, el acabado y el tamaño de la tirada con el taller de confección adecuado en la India.",
    },
    image: "/images/maria_7.jpeg",
    imageAlt: {
      en: "Model wearing an embroidered sheer purple and olive outer garment tailored in India",
      es: "Modelo vistiendo una chaqueta ligera bordada en tonos ciruela y oliva confeccionada en la India",
    },
  },
  {
    id: "other-crafted",
    number: "03",
    name: {
      en: "Other sewn or crafted products",
      es: "Otros productos confeccionados o artesanales",
    },
    summary: {
      en: "Show us what you want to make. During the Product Brief review, we verify in person whether a Manufacturing Partner in India can build it to your specifications.",
      es: "Enséñanos qué quieres fabricar. Al revisar el Product Brief, comprobamos en persona qué taller especializado en la India puede producirlo según tus especificaciones.",
    },
    image: "/images/shirish_with_workers_at_warehouse (2).jpeg",
    imageAlt: {
      en: "Shirish and a master cutter inspecting cut brown leather panels and templates at a workbench",
      es: "Shirish y un maestro cortador revisando piezas de piel marrón y patrones sobre la mesa de corte",
    },
  },
];

const selectionCriteria: ReadonlyArray<{
  id: string;
  number: string;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
}> = [
  {
    id: "materials",
    number: "01",
    title: {
      en: "Materials and construction",
      es: "Materiales y construcción",
    },
    body: {
      en: "Has the workshop worked with this material and construction before, and does it own the right machines for clean finishing?",
      es: "¿Tiene el taller experiencia real trabajando este material y este tipo de costura, con la maquinaria adecuada para un buen remate?",
    },
  },
  {
    id: "capacity",
    number: "02",
    title: {
      en: "Capacity",
      es: "Capacidad productiva",
    },
    body: {
      en: "Does the order meet the workshop's minimum, and can it fit cleanly into the production schedule without rushing?",
      es: "¿Encaja el volumen del pedido con el mínimo del taller y con su calendario real de producción sin prisas?",
    },
  },
  {
    id: "sampling",
    number: "03",
    title: {
      en: "Sampling",
      es: "Desarrollo de muestras",
    },
    body: {
      en: "Can the team revise samples accurately and agree on written tolerances before cutting bulk materials?",
      es: "¿Puede el equipo ajustar prototipos con rigor y fijar tolerancias por escrito antes de cortar el material definitivo?",
    },
  },
  {
    id: "visits",
    number: "04",
    title: {
      en: "Workshop visits",
      es: "Visitas presenciales",
    },
    body: {
      en: "What do we see for ourselves when we walk the production floor in India, check active lines, and speak with the floor leads?",
      es: "¿Qué comprobamos por nosotros mismos al recorrer la planta en la India, revisar las líneas activas y hablar con los encargados?",
    },
  },
];

const preProductionAgreements: ReadonlyArray<{
  id: string;
  number: string;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
}> = [
  {
    id: "reference-sample",
    number: "01",
    title: {
      en: "The reference sample",
      es: "La muestra de referencia",
    },
    body: {
      en: "Before packing, we check the Bulk Order against the sample you approved, looking at stitching, colour, hardware, and finishing.",
      es: "Antes de embalar, comprobamos el pedido frente a la muestra que aprobaste: costuras, color, herrajes y remates.",
    },
  },
  {
    id: "documentation",
    number: "02",
    title: {
      en: "Testing and market documentation",
      es: "Pruebas y documentación de destino",
    },
    body: {
      en: "The Product Brief records what your product and destination require, such as lab tests, fibre labels, care instructions, and export documents.",
      es: "El Product Brief recoge lo que exige tu producto y el país de destino: ensayos de laboratorio, etiquetas de composición, instrucciones de cuidado y documentos de exportación.",
    },
  },
  {
    id: "lead-times",
    number: "03",
    title: {
      en: "Order quantities and lead times",
      es: "Cantidades y plazos de entrega",
    },
    body: {
      en: "Custom hardware or dyeing can affect minimum quantities and lead times. We discuss both on the first call, taking material availability and workshop capacity into account.",
      es: "Los herrajes a medida o las tintadas especiales influyen en las cantidades mínimas y en los tiempos. Lo hablamos desde la primera llamada teniendo en cuenta los materiales y la capacidad real del taller.",
    },
  },
];

const commonQuestions: ReadonlyArray<{
  id: string;
  question: Record<SiteLanguage, string>;
  answer: Record<SiteLanguage, string>;
}> = [
  {
    id: "drawings",
    question: {
      en: "Do I need finished technical drawings before reaching out?",
      es: "¿Necesito fichas técnicas cerradas antes de escribir?",
    },
    answer: {
      en: "No. A clear product idea, a physical reference item, or material and design direction is enough to open the conversation. Detailed specifications are shaped with you before sampling begins.",
      es: "No. Basta con una idea clara del producto, una prenda o bolso de referencia o indicaciones sobre materiales y diseño. Definimos juntos las especificaciones detalladas antes de pasar al muestreo.",
    },
  },
  {
    id: "samples",
    question: {
      en: "Can we review physical samples before committing to a Bulk Order?",
      es: "¿Podemos revisar muestras físicas antes de confirmar el pedido en serie?",
    },
    answer: {
      en: "Yes. Sample approval happens before any bulk material is cut. Bulk production starts only after physical samples are inspected and signed off.",
      es: "Sí. La aprobación de la muestra siempre va antes de cortar material para serie. La producción solo arranca cuando has revisado y aprobado la muestra física.",
    },
  },
  {
    id: "languages",
    question: {
      en: "What languages can we work in?",
      es: "¿En qué idiomas podemos trabajar?",
    },
    answer: {
      en: "Alma works directly with Clients in Spanish and English, while both Alma and Shirish coordinate directly on the ground with workshops across India.",
      es: "Alma trabaja directamente con los clientes en español e inglés, mientras ambos coordinan en persona el trabajo con los talleres en la India.",
    },
  },
  {
    id: "scale",
    question: {
      en: "Can you work with both independent retailers and larger retail chains?",
      es: "¿Trabajáis tanto con tiendas independientes como con cadenas comerciales?",
    },
    answer: {
      en: "Yes, provided the intended Bulk Order quantity and product scope fit a Manufacturing Partner's realistic line capacity, which we evaluate openly from the first call.",
      es: "Sí, siempre que la cantidad prevista y el tipo de producto encajen con la capacidad real de un taller especializado, algo que valoramos con total transparencia desde la primera llamada.",
    },
  },
  {
    id: "visits",
    question: {
      en: "Can we visit Manufacturing Partners in India?",
      es: "¿Podemos visitar los talleres en la India?",
    },
    answer: {
      en: "Visits to workshops and Manufacturing Partners in India can be discussed and arranged around active Manufacturing Programmes.",
      es: "Sí, podemos organizar visitas a los talleres y socios de fabricación en la India dentro de los programas en curso.",
    },
  },
];

export function ManufacturingProgrammePageClient() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";
  const [openFaqId, setOpenFaqId] = useState<string | null>(
    commonQuestions[0]?.id ?? null,
  );

  return (
    <>
      <main className="programme-detail" id="main">
        {/* 1. Architectural Hero */}
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-2xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-xl)] lg:gap-[var(--space-2xl)]">
            {/* Top 1px Hairline Context Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[var(--color-rule)] py-4 text-[length:var(--text-xs)] font-semibold tracking-[0.08em] uppercase">
              <span className="text-[var(--color-clay-ink)]">
                {isEs
                  ? "España, Europa e India · Programa de fabricación"
                  : "Spain, Europe & India · Manufacturing Programme"}
              </span>
              <span className="text-[var(--color-muted)]">
                {isEs
                  ? "Del Product Brief a la entrega del pedido"
                  : "Product Brief to Bulk Order delivery"}
              </span>
            </div>

            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-lg)] lg:col-span-7 xl:col-span-6">
                <h1 className="max-w-[13ch] text-[clamp(2.2rem,3.8vw+0.5rem,4.75rem)] leading-[0.98] font-normal text-[var(--color-forest-deep)]">
                  {isEs
                    ? "El Programa de fabricación"
                    : "The Manufacturing Programme"}
                </h1>
                <p className="lead max-w-[46ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Todo empieza con una conversación sobre qué quieres fabricar. Evaluamos qué hace falta para producirlo en la India y te enviamos una propuesta clara."
                    : "It starts with a call about what you want to make. We then assess what it would take to produce in India and send you a clear proposal."}
                </p>
                <div className="flex flex-wrap items-center gap-6 pt-2">
                  <Link
                    className="primary-button"
                    href={localizeHref("/product-brief")}
                  >
                    {isEs
                      ? "Iniciar un Product Brief"
                      : "Start a Product Brief"}
                  </Link>
                  <Link
                    className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={localizeHref("/working-across-distance")}
                  >
                    {isEs
                      ? "Cómo trabajamos a distancia"
                      : "How we work across distance"}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 xl:col-span-6">
                <HeroVideo
                  eager
                  className="m-0 overflow-hidden border border-[var(--color-rule)] bg-[var(--color-paper-2)]"
                  videoClassName="block aspect-[4/3] w-full object-cover"
                  poster="/media/posters/wooden-table.jpg"
                  label={
                    isEs
                      ? "Vista cenital de una mesa de trabajo de madera con patrones, pieles y tejidos para un Product Brief"
                      : "Overhead view of a wooden workbench with hands working on patterns, leather, and fabric for a Product Brief"
                  }
                  src="/media (ai generated)/People_working_at_wooden_table_a667bec6_1080p.mp4"
                />
              </div>
            </div>

            {/* 1px Architectural Quick-Facts Strip */}
            <dl className="m-0 grid border-t border-l border-[var(--color-rule)] md:grid-cols-3">
              {heroFacts.map((fact) => (
                <div
                  key={fact.number}
                  className="grid content-start gap-2.5 border-r border-b border-[var(--color-rule)] p-6"
                >
                  <dt className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-forest-deep)]">
                    {fact.label[language]}
                  </dt>
                  <dd className="m-0 text-[length:var(--text-sm)] leading-[1.58] text-[var(--color-muted)]">
                    {fact.detail[language]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* 2. Continuity Manifesto Band */}
        <section className="bg-[var(--color-dune)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-6 lg:grid-cols-12 lg:items-start lg:gap-[var(--gap-columns)]">
            <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-ink)] uppercase lg:col-span-4 lg:pt-2">
              {isEs ? "Continuidad real" : "Direct continuity"}
            </p>
            <p className="m-0 max-w-[30ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-s)] leading-[1.12] lg:col-span-8">
              {isEs
                ? "El mismo equipo que recoge tu Product Brief acompaña el trabajo en persona durante la aprobación de muestras, la producción y la entrega del pedido."
                : "The same team that takes your Product Brief follows the work through sample approval, production, and Bulk Order delivery."}
            </p>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* 3. What We Make — 1px Architectural 3-Column Grid */}
        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="grid gap-2 lg:col-span-6">
                <p className="section-index">
                  {isEs ? "Categorías de producto" : "Product scope"}
                </p>
                <h2 className="m-0 max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs ? "Qué fabricamos" : "What we make"}
                </h2>
              </div>
              <p className="m-0 max-w-[46ch] text-[var(--color-muted)] lg:col-span-6 lg:justify-self-end">
                {isEs
                  ? "Trabajamos con talleres especializados en toda la India en marroquinería, confección textil y piezas desarrolladas a medida."
                  : "We partner with specialist production clusters across India for leather goods, woven garments, and bespoke sewn items."}
              </p>
            </div>

            <div className="grid border-t border-l border-[var(--color-rule)] md:grid-cols-2 lg:grid-cols-3">
              {productCategories.map((category) => (
                <article
                  key={category.id}
                  className="grid content-start gap-5 border-r border-b border-[var(--color-rule)] p-6 lg:p-7"
                >
                  <figure className="relative m-0 aspect-[4/5] overflow-hidden bg-[var(--color-paper-2)]">
                    <Image
                      src={category.image}
                      alt={category.imageAlt[language]}
                      fill
                      sizes="(max-width: 48rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                      className="object-cover"
                    />
                  </figure>
                  <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.16] font-normal">
                    {category.name[language]}
                  </h3>
                  <p className="m-0 text-[length:var(--text-sm)] leading-[1.68] text-[var(--color-muted)]">
                    {category.summary[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="night" />

        {/* 4. Interactive 5-Step Scroll-Scrubbed Wave (Product Brief -> Bulk Order) */}
        <PhaseJourney />

        <SectionBridge from="night" to="pale-sage" />

        {/* 5. How We Choose a Workshop */}
        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-md)] lg:col-span-6">
                <p className="section-index">
                  {isEs ? "Selección en persona" : "On-ground vetting"}
                </p>
                <h2 className="m-0 max-w-[15ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Cómo elegimos el taller adecuado"
                    : "How we choose a workshop"}
                </h2>
                <p className="m-0 max-w-[50ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Una tienda independiente que encarga su primera colección cápsula necesita un taller distinto al de una cadena que repite un pedido de gran volumen. Alma y Shirish visitan talleres en toda la India para comprobar cuál encaja mejor con cada proyecto."
                    : "An independent retailer commissioning a first capsule needs a different workshop setup from a retailer placing a high-volume repeat Bulk Order. Alma and Shirish visit workshops across India to see which ones fit the work."}
                </p>
              </div>
              <div className="lg:col-span-6">
                <HeroVideo
                  className="m-0 overflow-hidden border border-[var(--color-forest)]/25 bg-[var(--color-paper)]"
                  videoClassName="aspect-[16/9] h-full w-full object-cover"
                  poster="/media/posters/studio-walkthrough.jpg"
                  label={
                    isEs
                      ? "Recorrido por el estudio y taller de confección en la India"
                      : "A walkthrough of the studio and garment workshop space in India"
                  }
                  src="/media (ai generated)/Drone_flying_through_room_walkth…_ece39998_1080p.mp4"
                />
              </div>
            </div>

            <dl className="m-0 grid border-t border-l border-[var(--color-forest)]/25 md:grid-cols-2 xl:grid-cols-4">
              {selectionCriteria.map((item) => (
                <div
                  key={item.id}
                  className="grid content-start gap-3 border-r border-b border-[var(--color-forest)]/25 bg-[var(--color-paper)]/45 p-6"
                >
                  <dt className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[1.2] font-normal">
                    {item.title[language]}
                  </dt>
                  <dd className="m-0 text-[length:var(--text-sm)] leading-[1.62] text-[var(--color-muted)]">
                    {item.body[language]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="paper" />

        {/* 6. What We Agree Before Production — 4/8 Architectural Spec List */}
        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)] lg:grid-cols-12 lg:items-start lg:gap-[var(--gap-columns)]">
            <div className="grid gap-4 lg:sticky lg:top-32 lg:col-span-5">
              <p className="section-index">
                {isEs ? "Antes de cortar" : "Before cutting"}
              </p>
              <h2 className="m-0 max-w-[15ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                {isEs
                  ? "Qué dejamos acordado antes de producir"
                  : "What we agree before production"}
              </h2>
              <p className="m-0 max-w-[40ch] text-[var(--color-muted)]">
                {isEs
                  ? "Todo queda por escrito entre tu equipo y el taller antes de encargar pieles, tejidos o herrajes."
                  : "Every standard is agreed in writing between your team and the Manufacturing Partner before bulk materials are ordered."}
              </p>
            </div>

            <div className="grid border-t border-[var(--color-rule)] lg:col-span-7">
              {preProductionAgreements.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-2.5 border-b border-[var(--color-rule)] py-8"
                >
                  <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.18] font-normal">
                    {item.title[language]}
                  </h3>
                  <p className="m-0 max-w-[54ch] text-[length:var(--text-md)] leading-[1.7] text-[var(--color-muted)]">
                    {item.body[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* 7. Before You Start — Expandable Accessible FAQ Accordions */}
        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)] lg:grid-cols-12 lg:items-start lg:gap-[var(--gap-columns)]">
            <div className="grid gap-4 lg:sticky lg:top-32 lg:col-span-4">
              <p className="section-index">
                {isEs ? "Preguntas frecuentes" : "Common questions"}
              </p>
              <h2 className="m-0 max-w-[14ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                {isEs ? "Antes de empezar" : "Before you start"}
              </h2>
              <p className="m-0 max-w-[34ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-muted)]">
                {isEs
                  ? "¿Tienes una duda más concreta sobre tu producto o volumen?"
                  : "Have a specific question about your product category or volume?"}
              </p>
              <Link
                href={localizeHref("/contact")}
                className="inline-flex min-h-[44px] w-fit items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              >
                {isEs ? "Escribir a Alma y Shirish" : "Write to Alma & Shirish"}
              </Link>
            </div>

            <div className="grid border-t border-[var(--color-rule-2)]/50 lg:col-span-8">
              {commonQuestions.map((item) => {
                const isOpen = openFaqId === item.id;
                const panelId = `faq-panel-${item.id}`;
                const buttonId = `faq-button-${item.id}`;
                return (
                  <div
                    key={item.id}
                    className="border-b border-[var(--color-rule-2)]/50"
                  >
                    <h3 className="m-0">
                      <button
                        aria-controls={panelId}
                        aria-expanded={isOpen}
                        className="group flex w-full cursor-pointer items-center justify-between gap-6 border-0 bg-transparent py-6 text-left text-[var(--color-forest-deep)]"
                        id={buttonId}
                        onClick={() => setOpenFaqId(isOpen ? null : item.id)}
                        type="button"
                      >
                        <span className="font-[family-name:var(--font-display)] text-[clamp(1.2rem,1.8vw,1.5rem)] leading-[1.25] font-normal transition-colors group-hover:text-[var(--color-clay-ink)]">
                          {item.question[language]}
                        </span>

                        <span
                          aria-hidden="true"
                          className={`relative grid h-8 w-8 shrink-0 place-items-center border border-[var(--color-rule-2)]/60 text-[1.1rem] leading-none transition-colors ${
                            isOpen
                              ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                              : "text-[var(--color-forest-deep)] group-hover:border-[var(--color-forest-deep)]"
                          }`}
                        >
                          {isOpen ? "−" : "+"}
                        </span>
                      </button>
                    </h3>

                    <div
                      aria-labelledby={buttonId}
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                      id={panelId}
                      role="region"
                    >
                      <div className="overflow-hidden">
                        <p className="m-0 max-w-[58ch] pb-6 text-[length:var(--text-md)] leading-[1.72] text-[var(--color-ink-2)]">
                          {item.answer[language]}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="forest-deep" />

        {/* 8. Closing Conversion Band with Crosshair-Bracketed CTA */}
        <section className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.12em] text-[var(--color-gold)] uppercase">
                {isEs ? "Siguiente paso" : "Next step"}
              </p>
              <h2 className="m-0 max-w-[13ch] text-[length:var(--text-display)] leading-[1.02] font-normal text-[var(--color-paper)]">
                {isEs
                  ? "Veamos tu próximo producto."
                  : "Let's look at your product."}
              </h2>
              <p className="lead m-0 max-w-[44ch] text-[var(--color-paper-2)]">
                {isEs
                  ? "Cuéntanos qué quieres fabricar, qué cantidades prevés y en qué fase del proyecto te encuentras."
                  : "Tell us what you want to make, your rough quantity range, and how far along you are."}
              </p>
            </div>

            <div className="grid justify-items-start gap-5 lg:col-span-5 lg:justify-items-end">
              {/* 3D Discovery-inspired corner crosshair bracket frame */}
              <Link
                className="group relative mx-1 inline-flex min-h-[68px] items-center justify-center bg-[var(--color-gold)] px-6 py-4 text-[length:var(--text-md)] font-semibold text-[var(--color-night)] no-underline transition-colors duration-300 hover:bg-[var(--color-paper)] sm:mx-0 sm:px-9"
                href={localizeHref("/product-brief")}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2.5 -left-2.5 h-3.5 w-3.5 border-t-2 border-l-2 border-[var(--color-gold)] transition-all duration-300 group-hover:-top-3.5 group-hover:-left-3.5 group-hover:h-4 group-hover:w-4"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2.5 -right-2.5 h-3.5 w-3.5 border-t-2 border-r-2 border-[var(--color-gold)] transition-all duration-300 group-hover:-top-3.5 group-hover:-right-3.5 group-hover:h-4 group-hover:w-4"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-2.5 -left-2.5 h-3.5 w-3.5 border-b-2 border-l-2 border-[var(--color-gold)] transition-all duration-300 group-hover:-bottom-3.5 group-hover:-left-3.5 group-hover:h-4 group-hover:w-4"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2.5 -bottom-2.5 h-3.5 w-3.5 border-r-2 border-b-2 border-[var(--color-gold)] transition-all duration-300 group-hover:-right-3.5 group-hover:-bottom-3.5 group-hover:h-4 group-hover:w-4"
                />
                <span>
                  {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
                </span>
              </Link>

              <Link
                className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-medium text-[var(--color-paper-2)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
                href={localizeHref("/contact")}
              >
                {isEs
                  ? "O escribir directamente a Alma y Shirish"
                  : "Or write directly to Alma & Shirish"}
              </Link>
            </div>
          </div>
        </section>

        <SectionBridge from="forest-deep" to="night" />
      </main>

      <SiteFooter />
    </>
  );
}
