"use client";

import Image from "next/image";
import Link from "next/link";

import { ProductBriefForm } from "@/components/forms/product-brief-form";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";
import { PRODUCT_BRIEF_POST_STEPS } from "@/data/conversion-content";

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

export function ProductBriefPageClient({
  lang,
}: {
  lang?: SiteLanguage;
} = {}) {
  const { language: contextLanguage, localizeHref } = useLanguage();
  const language = lang ?? contextLanguage;
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        {/* Band 1: Warm Parchment Atelier Header */}
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-sm))] pb-[var(--space-lg)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-md)]">
            <nav
              aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
              className="flex items-center text-[length:var(--text-xs)] font-medium"
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
                  className="inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-clay-ink)]"
                >
                  {isEs ? "Briefing de producto" : "Product Brief"}
                </li>
              </ol>
            </nav>

            <div className="grid items-center gap-[var(--space-lg)] lg:grid-cols-12 lg:gap-[var(--gap-columns)]">
              <div className="grid gap-3 lg:col-span-7">
                <h1 className="m-0 max-w-[14ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                  {isEs
                    ? "Trae tu idea a la mesa."
                    : "Bring your idea to the table."}
                </h1>
                <p className="lead m-0 max-w-[46ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Parte de lo que tengas hoy sobre la mesa. Un boceto rápido, una foto del móvil o una pieza de tu tienda bastan para que Alma y Shirish valoren materiales y la unidad de producción adecuada en la India."
                    : "Start with whatever sits on your table today. A four-line sketch, a phone photo, or a bag from your shop is enough for Alma and Shirish to check materials and the right makers across India."}
                </p>
                <p className="m-0 text-[length:var(--text-sm)] font-medium text-[var(--color-muted)]">
                  {isEs
                    ? "3 pasos breves · Guardado automático · Acuerdo NDA disponible"
                    : "3 short steps · Saves as you go · Mutual NDA available"}
                </p>
              </div>

              <figure className="editorial-photo-frame m-0 aspect-[16/10] w-full max-w-[380px] lg:col-span-5 lg:ms-auto">
                <Image
                  src="/images/founders/alma-shirish-planning-table-window-india.jpeg"
                  alt={
                    isEs
                      ? "Alma y Shirish sentados frente a frente con una tableta junto a una ventana luminosa en la India"
                      : "Alma and Shirish seated face to face across a table with a tablet by a sunlit window in India"
                  }
                  fill
                  priority
                  sizes="(max-width: 64rem) 100vw, 380px"
                  className="object-cover object-[50%_38%]"
                />
              </figure>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* Band 2: Single-Screen Sunlit Swatch Desk Workspace on Warm Dune */}
        <section className="bg-[var(--color-dune)] pt-[var(--space-lg)] pb-[var(--space-2xl)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-3xl)]">
            <div className="min-w-0">
              <ProductBriefForm />
            </div>

            {/* Companion CTA & design protection placed calmly below the form on all larger screens */}
            <aside className="mx-auto grid w-full max-w-[58rem] min-w-0 items-center gap-[var(--space-xl)] md:grid-cols-12 lg:gap-[var(--gap-columns)]">
              <div className="editorial-photo-frame aspect-[5/6] w-full max-w-[260px] md:col-span-4 md:max-w-none lg:col-span-3">
                <Image
                  src="/images/founders/alma-swing-laughing.jpeg"
                  alt={
                    isEs
                      ? "Alma riendo con cercanía en un columpio de madera en la India"
                      : "Alma laughing warmly on a wooden porch swing in India"
                  }
                  fill
                  sizes="(max-width: 48rem) 260px, 24vw"
                  className="object-cover object-[50%_42%]"
                />
              </div>

              <div className="grid min-w-0 gap-3.5 md:col-span-4 lg:col-span-5">
                <h2 className="m-0 text-[length:var(--text-2xl)] leading-[1.16] font-normal text-[var(--color-forest-deep)]">
                  {isEs
                    ? "¿Prefieres comentarlo primero?"
                    : "Prefer to talk it through first?"}
                </h2>
                <p className="m-0 max-w-[44ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Charla con Alma en una videollamada gratuita por Google Meet en español, inglés o portugués antes de escribir una sola línea."
                    : "Sit down with Alma on a free Google Meet call in English, Spanish, or Portuguese before writing a single word."}
                </p>
                <Link
                  href={localizeHref("/book-a-call?duration=15")}
                  className="secondary-button-light w-full sm:w-fit"
                >
                  {isEs ? "Reservar llamada con Alma" : "Book a call with Alma"}
                </Link>
              </div>

              <div className="grid min-w-0 content-start gap-2.5 md:col-span-4 lg:col-span-4">
                <h2 className="m-0 text-[length:var(--text-xl)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                  {isEs
                    ? "Cómo protegemos tus diseños"
                    : "How your designs stay yours"}
                </h2>
                <p className="m-0 max-w-[42ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Alma lee cada briefing personalmente y te escribe en 1 o 2 días laborables. Solo Alma y Shirish, abogado colegiado en el Bar Council de la India, ven tus bocetos y archivos durante la valoración."
                    : "Alma reads every brief herself and writes back within 1 to 2 business days. Only Alma and Shirish, a registered Bar Council advocate in India, see your sketches and files during evaluation."}
                </p>
                <Link
                  href={localizeHref("/contact")}
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                >
                  <span>
                    {isEs
                      ? "Escribir una consulta general"
                      : "Send a general note instead"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>
            </aside>
          </div>
        </section>

        <SectionBridge from="dune" to="pale-sage" />

        {/* Band 3: Editorial What Happens Next Spread on Pale Sage */}
        <section
          id="after-submission"
          className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]"
        >
          <div className="container grid items-start gap-[var(--space-xl)] lg:grid-cols-12 lg:gap-[var(--gap-columns)]">
            <div className="grid gap-7 lg:col-span-7">
              <h2 className="m-0 max-w-[18ch] text-[length:var(--text-section)] leading-[1.06] font-normal">
                {isEs
                  ? "Qué ocurre cuando envías tu briefing."
                  : "What happens after you send your brief."}
              </h2>

              <ol className="m-0 grid list-none gap-x-8 gap-y-7 p-0 sm:grid-cols-2">
                {PRODUCT_BRIEF_POST_STEPS.map((item) => (
                  <li key={item.number} className="grid content-start gap-2">
                    <span className="num text-[length:var(--text-xs)] font-semibold text-[var(--color-clay-ink)]">
                      {item.number} / 04
                    </span>
                    <h3 className="m-0 text-[length:var(--text-title)] leading-[1.2] font-normal text-[var(--color-forest-deep)]">
                      {item.title[language]}
                    </h3>
                    <p className="m-0 max-w-[44ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
                      {item.body[language]}
                    </p>
                  </li>
                ))}
              </ol>

              <Link
                href={localizeHref("/manufacturing")}
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
              >
                <span>
                  {isEs
                    ? "Explorar el Programa de producción completo"
                    : "Explore the full Manufacturing Programme"}
                </span>
                <ArrowIcon />
              </Link>
            </div>

            <figure className="editorial-photo-frame m-0 aspect-[4/3] w-full lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:col-span-5">
              <Image
                src="/images/Leather/pexels-vlada-karpovich-4452603.jpg"
                alt={
                  isEs
                    ? "Piezas de piel cortadas junto a cuchilla de marroquinería, lezna y herramientas de costura"
                    : "Cut vegetable-tanned leather panels beside skiving knives, awls, and stitching tools"
                }
                fill
                sizes="(max-width: 64rem) 100vw, 38vw"
                className="object-cover object-center"
              />
            </figure>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="night" size="gentle" />
      </main>

      <SiteFooter hideNewsletter />
    </>
  );
}
