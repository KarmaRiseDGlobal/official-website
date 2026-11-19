"use client";

import Image from "next/image";
import Link from "next/link";

import { PhaseJourney } from "@/components/phase-journey";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";

const productCategories: ReadonlyArray<{
  id: string;
  name: Record<SiteLanguage, string>;
  summary: Record<SiteLanguage, string>;
  image: string;
  imageAlt: Record<SiteLanguage, string>;
}> = [
  {
    id: "bags",
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
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
}> = [
  {
    id: "materials",
    title: {
      en: "Materials and construction",
      es: "Materiales y construcción",
    },
    body: {
      en: "Has the workshop worked with this material and construction before?",
      es: "¿Tiene el taller experiencia real trabajando este material y este tipo de costura?",
    },
  },
  {
    id: "capacity",
    title: {
      en: "Capacity",
      es: "Capacidad productiva",
    },
    body: {
      en: "Does the order meet the workshop's minimum, and can it fit cleanly into the production schedule?",
      es: "¿Encaja el volumen del pedido con el mínimo del taller y con su calendario de producción?",
    },
  },
  {
    id: "sampling",
    title: {
      en: "Sampling",
      es: "Desarrollo de muestras",
    },
    body: {
      en: "Can the team revise samples and agree on tolerances before cutting bulk materials?",
      es: "¿Puede el equipo ajustar prototipos y fijar tolerancias claras antes de cortar el material definitivo?",
    },
  },
  {
    id: "visits",
    title: {
      en: "Workshop visits",
      es: "Visitas presenciales",
    },
    body: {
      en: "What do we see for ourselves when we walk the production floor in India?",
      es: "¿Qué comprobamos por nosotros mismos cuando recorremos la planta de producción en la India?",
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
      en: "Yes. Sample approval is Phase 02 of every Manufacturing Programme. Bulk production starts only after physical samples are inspected and signed off.",
      es: "Sí. La aprobación de la muestra es la Fase 02 de cada Programa de fabricación. La producción en serie solo arranca cuando has revisado y aprobado la muestra física.",
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

  return (
    <>
      <main className="programme-detail" id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <h1 className="text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium break-words text-[var(--color-forest-deep)]">
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
                  {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
                </Link>
                <Link
                  className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/working-across-distance")}
                >
                  {isEs
                    ? "Cómo trabajamos a distancia"
                    : "How we work across distance"}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <figure className="m-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
                <video
                  aria-label={
                    isEs
                      ? "Mesa de trabajo con revisión de patrones, pieles y tejidos para un Product Brief"
                      : "Product Brief and material bench, with close-ups of hands working with patterns, leather, and fabric"
                  }
                  autoPlay
                  className="block aspect-[3/4] w-full object-cover"
                  loop
                  muted
                  playsInline
                  src="/images/working_on_the_table.mp4"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container">
            <p className="max-w-[32ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-s)] leading-[1.12]">
              {isEs
                ? "El mismo equipo que recoge tu Product Brief acompaña el trabajo en persona durante la aprobación de muestras, la producción y la entrega del pedido."
                : "The same team that takes your Product Brief follows the work through sample approval, production, and Bulk Order delivery."}
            </p>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs ? "Qué fabricamos" : "What we make"}
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              {productCategories.map((category) => (
                <article key={category.id} className="grid content-start gap-5">
                  <figure className="relative m-0 aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
                    <Image
                      src={category.image}
                      alt={category.imageAlt[language]}
                      fill
                      sizes="(max-width: 48rem) 100vw, 33vw"
                      className="object-cover"
                    />
                  </figure>
                  <h3 className="text-[length:var(--text-2xl)] font-medium">
                    {category.name[language]}
                  </h3>
                  <p className="text-[var(--color-muted)]">
                    {category.summary[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PhaseJourney />

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-md)] lg:col-span-6">
                <h2 className="max-w-[15ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                  {isEs
                    ? "Cómo elegimos el taller adecuado"
                    : "How we choose a workshop"}
                </h2>
                <p className="text-[var(--color-ink-2)]">
                  {isEs
                    ? "Una tienda independiente que encarga su primera colección cápsula necesita un taller distinto al de una cadena que repite un pedido de gran volumen. Alma y Shirish visitan talleres en toda la India para comprobar cuál encaja mejor con cada proyecto."
                    : "An independent retailer commissioning a first capsule needs a different workshop setup from a retailer placing a high-volume repeat Bulk Order. Alma and Shirish visit workshops across India to see which ones fit the work."}
                </p>
              </div>
              <div className="lg:col-span-6">
                <figure className="m-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-forest)]/25 bg-[var(--color-paper)]">
                  <video
                    aria-label={
                      isEs
                        ? "Recorrido por el estudio y taller de confección en la India"
                        : "A walkthrough of the studio and garment workshop space in India"
                    }
                    autoPlay
                    className="aspect-[16/9] h-full w-full object-cover"
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    src="/media (ai generated)/Drone_flying_through_room_walkth…_ece39998_1080p.mp4"
                  />
                </figure>
              </div>
            </div>

            <dl className="m-0 grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-4">
              {selectionCriteria.map((item) => (
                <div
                  key={item.id}
                  className="grid content-start gap-3 border-t border-[var(--color-forest)]/25 pt-5"
                >
                  <dt className="text-[length:var(--text-title)] font-medium">
                    {item.title[language]}
                  </dt>
                  <dd className="m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    {item.body[language]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs
                  ? "Qué dejamos acordado antes de producir"
                  : "What we agree before production"}
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              <article className="grid content-start gap-3 border-t border-[var(--color-rule)] pt-5">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  {isEs ? "La muestra de referencia" : "The reference sample"}
                </h3>
                <p className="text-[var(--color-muted)]">
                  {isEs
                    ? "Antes de embalar, comprobamos el pedido frente a la muestra que aprobaste: costuras, color, herrajes y remates."
                    : "Before packing, we check the Bulk Order against the sample you approved, looking at stitching, colour, hardware, and finishing."}
                </p>
              </article>

              <article className="grid content-start gap-3 border-t border-[var(--color-rule)] pt-5">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  {isEs
                    ? "Pruebas y documentación de destino"
                    : "Testing and market documentation"}
                </h3>
                <p className="text-[var(--color-muted)]">
                  {isEs
                    ? "El Product Brief recoge lo que exige tu producto y el país de destino: ensayos de laboratorio, etiquetas de composición, instrucciones de cuidado y documentos de exportación."
                    : "The Product Brief records what your product and destination require, such as lab tests, fibre labels, care instructions, and export documents."}
                </p>
              </article>

              <article className="grid content-start gap-3 border-t border-[var(--color-rule)] pt-5">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  {isEs
                    ? "Cantidades y plazos de entrega"
                    : "Order quantities and lead times"}
                </h3>
                <p className="text-[var(--color-muted)]">
                  {isEs
                    ? "Los herrajes a medida o las tintadas especiales influyen en las cantidades mínimas y en los tiempos. Lo hablamos desde la primera llamada teniendo en cuenta los materiales y la capacidad real del taller."
                    : "Custom hardware or dyeing can affect minimum quantities and lead times. We discuss both on the first call, taking material availability and workshop capacity into account."}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs ? "Antes de empezar" : "Before you start"}
              </h2>
            </div>

            <dl className="m-0 grid gap-6 md:grid-cols-2">
              {commonQuestions.map((item) => (
                <div
                  key={item.id}
                  className="grid content-start gap-3 border-t border-[var(--color-rule-2)]/45 pt-5"
                >
                  <dt className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.22] font-medium">
                    {item.question[language]}
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    {item.answer[language]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <h2 className="max-w-[13ch] text-[length:var(--text-display)] leading-[1.02] font-medium text-[var(--color-paper)]">
                {isEs
                  ? "Veamos tu próximo producto."
                  : "Let's look at your product."}
              </h2>
              <p className="lead text-[var(--color-paper-2)]">
                {isEs
                  ? "Cuéntanos qué quieres fabricar y en qué fase del proyecto te encuentras."
                  : "Tell us what you want to make and how far along you are."}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 lg:col-span-5 lg:justify-end">
              <Link
                className="primary-button"
                href={localizeHref("/product-brief")}
              >
                {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
