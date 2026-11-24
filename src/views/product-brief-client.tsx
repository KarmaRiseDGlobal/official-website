"use client";

import Image from "next/image";
import Link from "next/link";

import { ProductBriefForm } from "@/components/forms/product-brief-form";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";
import { PRODUCT_BRIEF_POST_STEPS } from "@/data/conversion-content";

const checklistItems: ReadonlyArray<{
  id: string;
  text: Record<SiteLanguage, string>;
}> = [
  {
    id: "quality",
    text: {
      en: "The piece you want to build and the hand-feel or finish you expect",
      es: "La pieza que quieres hacer junto con el tacto o acabado que buscas",
    },
  },
  {
    id: "references",
    text: {
      en: "Any reference you already have: sketches, photos of a favourite piece (up to 3 files in the form), or a link",
      es: "Cualquier referencia que ya tengas: bocetos, fotos de una pieza que te guste (hasta 3 archivos en el formulario) o un enlace",
    },
  },
  {
    id: "materials",
    text: {
      en: "Hides, woven fabrics, linings, zippers, or trims you have in mind",
      es: "Pieles, telas planas, forros, cremalleras o herrajes que tengas en mente",
    },
  },
  {
    id: "quantity",
    text: {
      en: "Your rough Bulk Order quantity, including if you are planning a smaller first run",
      es: "Una cantidad aproximada para el pedido de producción, también si planteas una primera tirada corta",
    },
  },
  {
    id: "destination",
    text: {
      en: "Where the shipment needs to land and your target launch season",
      es: "El país de entrega y la temporada en la que te gustaría lanzar",
    },
  },
];

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
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-xl))] pb-[var(--space-2xl)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-lg)]">
            {/* Top 1px Hairline Breadcrumb & Context Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[var(--color-rule)] py-3.5 text-[length:var(--text-xs)] font-semibold tracking-[0.08em] uppercase">
              <nav
                aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
                className="flex items-center gap-2"
              >
                <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                  <li>
                    <Link
                      className="text-[var(--color-muted)] no-underline transition-colors hover:text-[var(--color-forest-deep)]"
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
                    className="text-[var(--color-clay-ink)]"
                  >
                    {isEs ? "Briefing de producto" : "Start a Product Brief"}
                  </li>
                </ol>
              </nav>
              <span className="text-[var(--color-muted)]">
                {isEs
                  ? "Respuesta personal de Alma en 1 o 2 días laborables"
                  : "Personal reply from Alma within 1–2 business days"}
              </span>
            </div>

            <div className="grid gap-[var(--space-md)]">
              <h1 className="max-w-[18ch] text-[clamp(2.25rem,4.8vw,4.5rem)] leading-[0.98] font-medium">
                {isEs
                  ? "Empieza tu briefing de producto para la India."
                  : "Start your Product Brief for India."}
              </h1>
              <p className="lead max-w-[56ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Parte de lo que tengas hoy sobre la mesa. Un boceto rápido de cuatro líneas, una foto hecha con el móvil o un bolso que ya vendes en tu tienda bastan para que Alma y Shirish estudien pieles, tejidos y el taller adecuado en la India."
                  : "Start with whatever sits on your table today. A four-line sketch, a phone photo, or a bag from your shop floor is enough for Alma and Shirish to study hides, woven cloth, and workshop fit across India."}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-1 text-[length:var(--text-sm)]">
                <span className="inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3.5 py-1.5 font-medium text-[var(--color-forest-deep)]">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 rounded-full bg-[var(--color-clay)]"
                  />
                  <span>
                    {isEs
                      ? "3 pasos breves · alrededor de 1 minuto · guardado automático"
                      : "3 quick steps · about 1 minute · saves as you go"}
                  </span>
                </span>
                <Link
                  href={localizeHref("/book-a-call?duration=15")}
                  className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                >
                  {isEs
                    ? "¿Prefieres comentarlo antes? Reserva una llamada gratis de 15 min con Alma"
                    : "Prefer to talk it over first? Book a free 15-min call with Alma"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="wood" />

        <section className="bg-[var(--color-wood)] py-[var(--section-gap-s)] text-[var(--color-paper)] lg:py-[var(--section-gap)]">
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            {/* Form first on mobile so visitors can start immediately; right column on desktop */}
            <div className="order-1 min-w-0 lg:order-2 lg:col-span-7">
              <h2 className="mb-6 text-[length:var(--text-2xl)] font-medium text-[var(--color-paper)]">
                {isEs ? "Tu briefing de producto" : "Your Product Brief"}
              </h2>
              <ProductBriefForm />
            </div>

            {/* Founder trust card + checklist second on mobile; left column on desktop */}
            <div className="order-2 grid min-w-0 gap-[var(--space-xl)] lg:order-1 lg:col-span-5">
              <div className="grid gap-4 rounded-[var(--radius-card)] border border-[var(--color-paper)]/18 bg-[var(--color-night)]/25 p-5">
                <div className="flex items-center gap-3.5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full border border-[var(--color-paper)]/25">
                    <Image
                      src="/images/founders/alma-and-shirish-avatar.jpg"
                      alt={
                        isEs
                          ? "Alma y Shirish, cofundadores de KarmaRise D Global"
                          : "Alma and Shirish, co-founders of KarmaRise D Global"
                      }
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="grid min-w-0 gap-0.5">
                    <p className="m-0 text-[length:var(--text-md)] font-semibold text-[var(--color-paper)]">
                      {isEs ? "Alma y Shirish" : "Alma & Shirish"}
                    </p>
                    <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
                      {isEs
                        ? "España e India · Respuesta personal en 1 o 2 días laborables"
                        : "Spain & India · Personal reply within 1–2 business days"}
                    </p>
                  </div>
                </div>
                <p className="m-0 text-[length:var(--text-xs)] leading-relaxed text-[var(--color-paper-2)]">
                  {isEs
                    ? "Alma lee cada briefing personalmente y te contesta en español, inglés o portugués. Solo Alma y Shirish, abogado colegiado en el Bar Council de la India, ven tus bocetos y referencias comerciales durante la valoración."
                    : "Alma reads every brief herself and writes back in English, Spanish, or Portuguese. Only Alma and Shirish, a registered Bar Council advocate in India, see your sketches, references, and commercial plans during evaluation."}
                </p>
              </div>

              <div className="grid gap-4">
                <h2 className="text-[length:var(--text-display-s)] leading-[1.04] font-medium text-[var(--color-paper)]">
                  {isEs
                    ? "Qué nos ayuda a arrancar"
                    : "What helps us get started"}
                </h2>
                <ul className="m-0 grid list-none gap-3 p-0 text-[var(--color-paper-2)]">
                  {checklistItems.map((item) => (
                    <li
                      key={item.id}
                      className="border-t border-[var(--color-paper)]/15 pt-3 text-[length:var(--text-sm)]"
                    >
                      {item.text[language]}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="wood" to="pale-sage" />

        <section
          id="after-submission"
          className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]"
        >
          <div className="container grid gap-[var(--space-xl)]">
            <h2 className="text-[length:var(--text-2xl)] font-medium">
              {isEs ? "Qué pasa a continuación" : "What happens next"}
            </h2>

            <ol className="m-0 grid list-none gap-[var(--gap-columns)] p-0 sm:grid-cols-2 lg:grid-cols-4">
              {PRODUCT_BRIEF_POST_STEPS.map((step) => (
                <li
                  key={step.number}
                  className="grid content-start gap-3 border-t border-[var(--color-forest)]/25 pt-5"
                >
                  <span className="num text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-ink)]">
                    {step.number}
                  </span>
                  <h3 className="text-[length:var(--text-title)] font-medium">
                    {step.title[language]}
                  </h3>
                  <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    {step.body[language]}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="dune" />

        <section className="bg-[var(--color-paper-2)] py-[var(--space-2xl)] text-[var(--color-forest-deep)]">
          <div className="container flex flex-wrap items-center justify-between gap-6">
            <div className="grid gap-1">
              <p className="font-semibold">
                {isEs
                  ? "¿Prefieres llamarnos o escribirnos directamente?"
                  : "Rather pick up the phone or write directly?"}
              </p>
              <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                {isEs
                  ? "Llama o escribe por WhatsApp a Alma en España y Europa en el +34 611 722 276, llama a Shirish en la India en el +91 8530009798 o escribe a hola@karmarisedglobal.com."
                  : "Call or WhatsApp Alma in Spain and Europe on +34 611 722 276, call Shirish in India on +91 8530009798, or write to hola@karmarisedglobal.com."}
              </p>
            </div>
            <Link
              className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              href={localizeHref("/contact")}
            >
              {isEs
                ? "Ver todos los contactos directos"
                : "See all direct contacts"}
            </Link>
          </div>
        </section>

        <SectionBridge from="dune" to="night" />
      </main>

      <SiteFooter hideNewsletter />
    </>
  );
}
