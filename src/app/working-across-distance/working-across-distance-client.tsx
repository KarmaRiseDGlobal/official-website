"use client";

import Image from "next/image";
import Link from "next/link";

import { HeroVideo } from "@/components/hero-video";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";

const principlesInPractice: ReadonlyArray<{
  id: string;
  title: Record<SiteLanguage, string>;
  practice: Record<SiteLanguage, string>;
  image: string;
  imageAlt: Record<SiteLanguage, string>;
}> = [
  {
    id: "correction-from-europe",
    title: {
      en: "A correction comes in from Europe",
      es: "Llega un ajuste desde España o Europa",
    },
    practice: {
      en: "You talk through the change with Alma in Spanish or English. Alma and Shirish take it straight to the pattern maker or workshop in India, using the same Product Brief.",
      es: "Comentas el cambio con Alma en español o en inglés. Alma y Shirish lo trasladan en persona al patronista o al taller en la India sobre el mismo Product Brief.",
    },
    image: "/images/alam_with_the_warehouse_owners (4).jpeg",
    imageAlt: {
      en: "Alma reviewing dark brown and purple leather hides with workshop specialists in India",
      es: "Alma revisando pieles en tonos marrón oscuro y morado junto a especialistas del taller en la India",
    },
  },
  {
    id: "colour-to-match",
    title: {
      en: "The workshop needs a colour to match",
      es: "El taller necesita clavar un color",
    },
    practice: {
      en: "We put the physical colour reference in the Product Brief alongside the material, dimensions, and tolerances. That gives the workshop something precise to check before ordering bulk materials.",
      es: "Incluimos la referencia física de color en el Product Brief junto con el material, las medidas y las tolerancias. Así el taller cuenta con un criterio exacto antes de pedir el material del pedido.",
    },
    image: "/images/alam_with_the_warehouse_owners (6).jpeg",
    imageAlt: {
      en: "Alma and three workshop specialists examining cognac leather hides on a cutting table in India",
      es: "Alma y tres especialistas del taller examinando pieles de color coñac sobre una mesa de corte en la India",
    },
  },
  {
    id: "seam-reinforcing",
    title: {
      en: "A seam needs reinforcing",
      es: "Una costura necesita refuerzo",
    },
    practice: {
      en: "We examine the seam on site with the Manufacturing Partner in India. If the construction needs to change, we agree on the adjustment with you before production moves ahead.",
      es: "Revisamos la costura en persona con el taller en la India. Si conviene modificar la construcción, acordamos el ajuste contigo antes de que avance la producción.",
    },
    image: "/images/shirish_with_workers_at_warehouse (7).jpeg",
    imageAlt: {
      en: "Shirish inspecting cut leather panels and seam allowances with a master cutter in India",
      es: "Shirish revisando piezas de piel cortadas y márgenes de costura junto a un maestro cortador en la India",
    },
  },
  {
    id: "launch-date",
    title: {
      en: "The Bulk Order has a launch date to meet",
      es: "El pedido tiene una fecha de llegada a tienda",
    },
    practice: {
      en: "We discuss feasible quantities, export packing, and delivery handling at the proposal stage so you can plan your launch around what the workshop can reliably deliver.",
      es: "Hablamos de cantidades realistas, embalaje de exportación y transporte desde la propuesta inicial para que planifiques tu lanzamiento sobre plazos que el taller puede cumplir.",
    },
    image: "/images/snoby_order (3).jpeg",
    imageAlt: {
      en: "Wrapped pallet of export cartons delivered directly outside a retail storefront in Spain",
      es: "Palé flejado con cajas de exportación entregado directamente frente a una tienda en España",
    },
  },
];

const communicationHabits: ReadonlyArray<{
  id: string;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
}> = [
  {
    id: "video-reviews",
    title: {
      en: "Scheduled video reviews",
      es: "Revisiones por videollamada",
    },
    body: {
      en: "Regular calls with Alma to walk through progress, sample adjustments, and open questions in Spanish or English.",
      es: "Llamadas periódicas con Alma en español o en inglés para repasar avances, ajustes de muestras y cualquier duda abierta.",
    },
  },
  {
    id: "physical-samples",
    title: {
      en: "Physical samples",
      es: "Muestras físicas en mano",
    },
    body: {
      en: "We send physical samples to your team in Spain or across Europe so you can test them in the hand before approving the Bulk Order.",
      es: "Enviamos muestras físicas a tu equipo en España o Europa para que las probéis en mano antes de aprobar el pedido en serie.",
    },
  },
  {
    id: "workshop-media",
    title: {
      en: "Photos and video from the workshop",
      es: "Fotos y vídeo desde el propio taller",
    },
    body: {
      en: "See materials as they arrive in India, the first pieces off the line, and how the finished Bulk Order is packed for export.",
      es: "Ve los materiales cuando llegan al taller en la India, las primeras piezas terminadas y cómo se embala el pedido antes de salir.",
    },
  },
];

export function WorkingAcrossDistancePageClient() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-forest-deep)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-paper)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-lg)] lg:col-span-7">
                <h1 className="max-w-[16ch] text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium text-[var(--color-paper)]">
                  {isEs ? "Trabajar a distancia" : "Working across distance"}
                </h1>
              </div>
              <p className="lead text-[var(--color-paper-2)] lg:col-span-5">
                {isEs
                  ? "Si cambias un detalle desde España, ¿quién comprueba que se aplique en el taller en la India? Alma y Shirish mantienen ambos lados conectados mediante un único Product Brief."
                  : "If you change a detail in Spain, who checks it on the workshop floor in India? Alma and Shirish keep that conversation connected through one Product Brief."}
              </p>
            </div>

            <HeroVideo
              className="m-0 overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-night)]"
              videoClassName="block aspect-video w-full object-cover"
              label={
                isEs
                  ? "Trabajo conjunto entre España y los talleres en la India"
                  : "Working across Spain, Europe, and workshops in India"
              }
              src="/media (ai generated)/banner_fa054e39.mp4"
            />
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs ? "Con quién trabajas" : "Who you work with"}
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              <article className="grid content-start gap-5">
                <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-2)]">
                  <Image
                    src="/images/alma_at_the_warehouse (1).jpeg"
                    alt={
                      isEs
                        ? "Alma revisando pieles color coñac y un bolso bandolera terminado en un taller en la India"
                        : "Alma inspecting cognac leather hides and a finished crossbody bag in an Indian workshop"
                    }
                    fill
                    className="object-cover"
                    sizes="(max-width: 48rem) 100vw, 48vw"
                  />
                </figure>
                <h3 className="text-[length:var(--text-2xl)] font-medium">
                  {isEs ? "Alma · España e India" : "Alma · Spain & India"}
                </h3>
                <p className="text-[var(--color-muted)]">
                  {isEs
                    ? "Hablas directamente con Alma en español o en inglés. Ella recoge lo que necesita tu equipo en tienda, desde el corte y el acabado hasta las fechas de entrega, y lo traslada junto a Shirish a los talleres en la India."
                    : "You speak with Alma in Spanish or English. She brings the details that matter to your retail team, such as fit, finish, and launch dates, into the Product Brief and reviews them on the ground in India."}
                </p>
              </article>

              <article className="grid content-start gap-5">
                <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-2)]">
                  <Image
                    src="/images/shirish_with_workers_at_warehouse (4).jpeg"
                    alt={
                      isEs
                        ? "Shirish revisando piezas de piel en la mesa de corte junto a un artesano en la India"
                        : "Shirish inspecting cut leather pieces at a workshop table in India"
                    }
                    fill
                    className="object-cover"
                    sizes="(max-width: 48rem) 100vw, 48vw"
                  />
                </figure>
                <h3 className="text-[length:var(--text-2xl)] font-medium">
                  {isEs
                    ? "Shirish · En toda la India"
                    : "Shirish · Across India"}
                </h3>
                <p className="text-[var(--color-muted)]">
                  {isEs
                    ? "Shirish trabaja en persona con los socios de fabricación y artesanos en la India. Abogado de profesión, deja cerrados los acuerdos, los compromisos de materiales y el seguimiento en planta donde se hacen las muestras y los pedidos."
                    : "Shirish works directly with Manufacturing Partners and artisans across India. A lawyer by profession, he structures clear agreements, material commitments, and floor inspections where samples and Bulk Orders are made."}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid gap-[var(--space-3xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.02] font-medium text-[var(--color-paper)]">
                {isEs
                  ? "Decisiones entre España y la India"
                  : "Decisions between Spain and India"}
              </h2>
            </div>

            <div className="grid gap-[var(--space-3xl)]">
              {principlesInPractice.map((item, index) => (
                <article
                  key={item.id}
                  className="grid items-center gap-[var(--gap-columns)] border-t border-[var(--color-paper)]/15 pt-[var(--space-2xl)] lg:grid-cols-12"
                >
                  <div
                    className={`grid gap-4 lg:col-span-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <h3 className="text-[length:var(--text-2xl)] leading-[1.14] font-medium text-[var(--color-paper)]">
                      {item.title[language]}
                    </h3>
                    <p className="max-w-[48ch] text-[length:var(--text-lg)] text-[var(--color-paper-2)]">
                      {item.practice[language]}
                    </p>
                  </div>

                  <div
                    className={`lg:col-span-6 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                  >
                    <figure className="relative m-0 aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-night)]">
                      <Image
                        src={item.image}
                        alt={item.imageAlt[language]}
                        fill
                        className="object-cover"
                        sizes="(max-width: 64rem) 100vw, 48vw"
                      />
                    </figure>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-6">
              <h2 className="max-w-[14ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs
                  ? "Qué puedes ver desde España y Europa"
                  : "What you can see from Europe"}
              </h2>
              <ul className="m-0 grid list-none gap-5 p-0">
                {communicationHabits.map((habit) => (
                  <li
                    key={habit.id}
                    className="grid gap-1 border-t border-[var(--color-forest)]/25 pt-4"
                  >
                    <h3 className="text-[length:var(--text-title)] font-medium">
                      {habit.title[language]}
                    </h3>
                    <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {habit.body[language]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6">
              <HeroVideo
                className="m-0 overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper)]"
                videoClassName="block aspect-video w-full object-cover"
                label={
                  isEs
                    ? "Artesanas trabajando en el estudio textil en la India"
                    : "Women artisans working on garment construction in the studio in India"
                }
                src="/media (ai generated)/Women_artisans_working_in_studio_7a067d98_1080p.mp4"
              />
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <h2 className="max-w-[13ch] text-[length:var(--text-display)] leading-[1.02] font-medium text-[var(--color-paper)]">
                {isEs
                  ? "Hablemos sobre tu producto."
                  : "Let's talk about your product."}
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-6 lg:col-span-5 lg:justify-end">
              <Link
                className="primary-button"
                href={localizeHref("/product-brief")}
              >
                {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
              </Link>
              <Link
                className="font-semibold text-[var(--color-paper)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-clay-light)]"
                href={localizeHref("/manufacturing-programme")}
              >
                {isEs
                  ? "Ver el Programa de fabricación"
                  : "See the Manufacturing Programme"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
