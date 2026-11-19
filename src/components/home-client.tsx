"use client";

import Image from "next/image";
import Link from "next/link";

import { HeroVideo } from "@/components/hero-video";
import { HorizontalShowcase } from "@/components/horizontal-showcase";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/context/language-context";

export function HomeClient() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        <section className="hero" id="top">
          <HeroVideo
            label={
              isEs
                ? "Imágenes de producción de un programa de fabricación de KarmaRise D Global"
                : "Production footage from a KarmaRise D Global Manufacturing Programme"
            }
          />
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-content container">
            <p className="hero-context">
              {isEs
                ? "Del Product Brief al pedido en serie"
                : "From Product Brief to Bulk Order"}
            </p>
            <h1>
              {isEs
                ? "Convierte tu criterio en un producto propio."
                : "Turn your point of view into a product."}
            </h1>
            <p className="hero-lead">
              {isEs
                ? "KarmaRise D Global desarrolla y entrega productos de marca propia para empresas en España y Europa a través de talleres especializados en toda la India."
                : "KarmaRise D Global develops and delivers own-brand products for businesses in Spain and across Europe through manufacturing across India."}
            </p>
            <div className="hero-actions">
              <Link
                className="hero-primary"
                href={localizeHref("/product-brief")}
              >
                {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
              </Link>
              <Link
                className="hero-secondary"
                href={localizeHref("/manufacturing-programme")}
              >
                {isEs
                  ? "Ver cómo funciona la fabricación"
                  : "See how manufacturing works"}
              </Link>
            </div>
          </div>
        </section>

        <section className="ownership" id="work">
          <div className="ownership-grid container">
            <div className="ownership-copy">
              <h2>
                {isEs
                  ? "¿Qué cambiarías de las piezas que tienes hoy en tienda?"
                  : "What would you change about the pieces on your shelves?"}
              </h2>
              <p className="lead">
                {isEs
                  ? "Quizá al bolso le falta un asa más larga. Quizá la tela convence pero el corte no termina de sentar bien. Cuéntanos qué buscan tus clientes y qué vuelven a dejar en la estantería. Esas pistas dicen mucho sobre qué fabricar bajo tu propia marca."
                  : "Maybe the bag needs a longer strap. Maybe the fabric is right, but the fit is wrong. Tell us what people reach for and what they put back. Those are good clues for what to make under your own label."}
              </p>
              <p className="max-w-[var(--measure-narrow)] text-[var(--color-muted)]">
                {isEs
                  ? "Convertimos esas observaciones en un Product Brief claro con el que el taller en la India puede trabajar, definiendo diseño, materiales, cantidades, calidades y entrega."
                  : "We turn those clues into a Product Brief the workshop can use, with clear decisions on design, materials, quantity, quality, and delivery."}
              </p>
            </div>

            <figure className="ownership-image">
              <Image
                src="/images/alma_taking_a_look_at_design (1).jpeg"
                alt={
                  isEs
                    ? "Alma y una sastre ajustando un tejido bordado en color turquesa sobre un maniquí en el estudio en la India"
                    : "Alma and a garment maker draping embroidered teal fabric on a dressmaker form in our studio in India"
                }
                fill
                sizes="(max-width: 60rem) 100vw, 52vw"
              />
              <figcaption>
                {isEs
                  ? "Revisión de prenda en nuestro estudio en la India"
                  : "Garment development in our studio in India"}
              </figcaption>
            </figure>
          </div>
        </section>

        <HorizontalShowcase />

        <section className="founders" id="company-story">
          <div className="founders-media py-[clamp(8.5rem,18svh,13rem)]">
            <Image
              className="object-cover object-[50%_40%]"
              src="/images/alma_and_shirish_sitting_at_table (1).jpeg"
              alt={
                isEs
                  ? "Shirish y Alma conversando frente a una mesa junto a la ventana con una tableta y muestras de tejido y piel"
                  : "Shirish and Alma in discussion across a sunlit studio table with a tablet and fabric and leather swatches"
              }
              fill
              sizes="100vw"
            />
            <div className="founders-scrim" aria-hidden="true" />

            <div className="relative z-10 container flex flex-col items-center text-center">
              <div className="flex max-w-lg flex-col items-center gap-[var(--space-lg)]">
                <p className="lead text-[var(--color-paper)]">
                  {isEs
                    ? "Alma voló desde España a la India pocos meses después de conocer a Shirish y allí fundaron juntos KarmaRise D Global. Hoy hablan directamente con clientes en España y Europa mientras supervisan en persona el trabajo con los talleres en toda la India."
                    : "Alma flew from Spain to India a few months after she and Shirish met, and they started KarmaRise D Global together there. Today they speak directly with Clients in Spain and across Europe while working on the ground with workshops across India."}
                </p>

                <Link
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-paper)]/60 bg-[var(--color-night)]/35 px-7 py-3 text-[length:var(--text-sm)] font-semibold tracking-[0.02em] text-[var(--color-paper)] backdrop-blur-sm transition-colors hover:border-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-night)]"
                  href={localizeHref("/about")}
                >
                  {isEs ? "Conoce a Alma y Shirish" : "Meet Alma and Shirish"}
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
