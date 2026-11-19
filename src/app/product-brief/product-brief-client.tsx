"use client";

import Link from "next/link";

import { ProductBriefForm } from "@/components/product-brief-form";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";

const postSubmissionSteps: ReadonlyArray<{
  number: string;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
}> = [
  {
    number: "01",
    title: {
      en: "Alma reads your brief",
      es: "Alma revisa tu brief",
    },
    body: {
      en: "She replies directly in Spanish or English.",
      es: "Te responde directamente en español o en inglés.",
    },
  },
  {
    number: "02",
    title: {
      en: "We talk it through",
      es: "Lo comentamos en detalle",
    },
    body: {
      en: "On a video call, we ask about your brand, where you sell, and what you need the product to do.",
      es: "En una videollamada hablamos de tu marca, dónde vendes y qué necesitas que cumpla el producto.",
    },
  },
  {
    number: "03",
    title: {
      en: "You get a proposal",
      es: "Recibes una propuesta",
    },
    body: {
      en: "We assess materials, workshop fit in India, sampling, and the likely Bulk Order scope before sending it.",
      es: "Evaluamos materiales, el taller idóneo en la India, el muestreo y el alcance del pedido antes de enviártela.",
    },
  },
  {
    number: "04",
    title: {
      en: "Design gets underway",
      es: "Arranca el desarrollo",
    },
    body: {
      en: "Once you approve the proposal, we work through design approval and physical sampling.",
      es: "Una vez aprobada la propuesta, avanzamos con la aprobación del diseño y las muestras físicas.",
    },
  },
];

const checklistItems: ReadonlyArray<{
  id: string;
  text: Record<SiteLanguage, string>;
}> = [
  {
    id: "quality",
    text: {
      en: "What you want to make and the quality you expect",
      es: "Qué producto quieres fabricar y el nivel de acabado que buscas",
    },
  },
  {
    id: "references",
    text: {
      en: "References such as sketches, sample photos (attachable in the form), or links to existing products",
      es: "Referencias como bocetos, fotos de muestras (puedes adjuntarlas en el formulario) o enlaces a productos existentes",
    },
  },
  {
    id: "materials",
    text: {
      en: "Any materials, trims, or finishes you already have in mind",
      es: "Materiales, fornituras o acabados que ya tengas en mente",
    },
  },
  {
    id: "quantity",
    text: {
      en: "Estimated Bulk Order quantity, including any smaller first run",
      es: "Cantidad estimada del pedido, incluyendo si planteas una primera tirada más corta",
    },
  },
  {
    id: "destination",
    text: {
      en: "Destination country and target launch or delivery date",
      es: "País de destino y fecha objetivo de lanzamiento o entrega",
    },
  },
];

export function ProductBriefPageClient() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-lg)]">
            <h1 className="max-w-[17ch] text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium">
              {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
            </h1>
            <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
              {isEs
                ? "Empieza con lo que tengas hoy. Un boceto, una muestra física o un producto que ya vendas y quieras fabricar en la India nos basta para ponernos a trabajar."
                : "Start with what you have. A sketch, a physical sample, or an existing product you want to make in India gives us something concrete to discuss."}
            </p>
          </div>
        </section>

        <section className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-start gap-[var(--space-2xl)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-xl)] lg:col-span-5">
              <div className="grid gap-4">
                <h2 className="text-[length:var(--text-display-s)] leading-[1.04] font-medium text-[var(--color-paper)]">
                  {isEs ? "Qué conviene incluir" : "What to include"}
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

              <p className="max-w-[46ch] border-t border-[var(--color-paper)]/15 pt-4 text-[length:var(--text-sm)] text-[var(--color-paper-2)]">
                {isEs
                  ? "Únicamente Alma y Shirish revisan tus referencias de producto, diseños y objetivos comerciales durante la evaluación."
                  : "Only Alma and Shirish review your product references, designs, and commercial goals during evaluation."}
              </p>
            </div>

            <div className="lg:col-span-7">
              <h2 className="mb-6 text-[length:var(--text-2xl)] font-medium text-[var(--color-paper)]">
                {isEs ? "Tu Product Brief" : "Your Product Brief"}
              </h2>
              <ProductBriefForm />
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-xl)]">
            <h2 className="text-[length:var(--text-2xl)] font-medium">
              {isEs
                ? "Qué ocurre después de enviar tu brief"
                : "After you send your brief"}
            </h2>

            <ol className="m-0 grid list-none gap-[var(--gap-columns)] p-0 sm:grid-cols-2 lg:grid-cols-4">
              {postSubmissionSteps.map((step) => (
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

        <section className="bg-[var(--color-paper-2)] py-[var(--space-2xl)] text-[var(--color-forest-deep)]">
          <div className="container flex flex-wrap items-center justify-between gap-6">
            <div className="grid gap-1">
              <p className="font-semibold">
                {isEs
                  ? "¿Prefieres llamarnos o escribirnos directamente?"
                  : "Prefer to call or write directly?"}
              </p>
              <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                {isEs
                  ? "Habla con Alma para España y Europa en el +34 611722276, con Shirish en la India en el +91 8530009798 o escribe a hola@karmarisedglobal.com."
                  : "Reach Alma for Spain and Europe on +34 611722276, Shirish in India on +91 8530009798, or write to hola@karmarisedglobal.com."}
              </p>
            </div>
            <Link
              className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              href={localizeHref("/contact")}
            >
              {isEs ? "Ver datos de contacto" : "View contact details"}
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
