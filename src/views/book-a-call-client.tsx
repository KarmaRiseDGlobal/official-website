import Link from "next/link";

import { BookCallScheduler } from "@/components/forms/book-call-scheduler";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { BOOK_CALL_FAQS, BOOK_CALL_OPTIONS } from "@/data/conversion-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const WHATSAPP_HREF = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma, I would like to arrange a video call about KarmaRise D Global.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma, me gustaría concertar una videollamada con KarmaRise D Global.")}`,
};

export function BookACallPageClient({
  lang = "en",
}: {
  lang?: SiteLanguage;
} = {}) {
  const language = lang;
  const localizeHref = (href: string) => localizePath(href, language);
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-xl)]">
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
                    {isEs ? "Reservar videollamada" : "Book a video call"}
                  </li>
                </ol>
              </nav>
              <span className="text-[var(--color-muted)]">
                {isEs
                  ? "Google Meet gratis con Alma · ES, EN o PT · Notas por escrito al terminar"
                  : "Free Google Meet with Alma · EN, ES, or PT · Written notes afterwards"}
              </span>
            </div>

            <div className="grid gap-[var(--space-md)]">
              <h1 className="max-w-[16ch] text-[clamp(2.25rem,4.8vw,4.5rem)] leading-[0.98] font-medium">
                {isEs
                  ? "Hablemos sobre tu idea de producto."
                  : "Let's talk through your product idea."}
              </h1>
              <p className="lead max-w-[56ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Elige un hueco gratuito de 15 o 30 minutos por Google Meet con Alma. Comenta sin compromiso materiales, ergonomía, muestras físicas o plazos en la India y recibe notas por escrito justo después."
                  : "Pick a free 15-minute or 30-minute Google Meet slot with Alma. Talk openly about materials, ergonomics, physical sampling, or timelines across India, and receive written call notes straight after."}
              </p>
            </div>

            <BookCallScheduler />
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* Static SSR Call Format Comparison (CRO + SEO + Agent Readiness AR-READ-01) */}
        <section
          id="call-formats"
          className="bg-[var(--color-dune)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]"
        >
          <div className="container grid gap-[var(--space-xl)]">
            <div className="grid gap-3 lg:grid-cols-12 lg:items-end">
              <div className="grid gap-2 lg:col-span-7">
                <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-ink)] uppercase">
                  {isEs
                    ? "Elige el ritmo que mejor te encaje"
                    : "Pick the pace that suits you"}
                </p>
                <h2 className="m-0 text-[length:var(--text-display-s)] leading-[1.05] font-medium">
                  {isEs
                    ? "Dos opciones gratuitas según el punto de tu proyecto."
                    : "Two free call options depending on where your idea stands."}
                </h2>
              </div>
              <p className="m-0 max-w-[46ch] text-[length:var(--text-sm)] text-[var(--color-ink-2)] lg:col-span-5">
                {isEs
                  ? "Todas las sesiones son en directo por Google Meet en español, inglés o portugués, reservando con al menos 12 horas de antelación para que Alma pueda preparar bien la reunión."
                  : "Every call happens live on Google Meet in English, Spanish, or Portuguese, with 12-hour advance booking notice so Alma can prepare properly."}
              </p>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              {BOOK_CALL_OPTIONS.map((option) => (
                <article
                  key={option.id}
                  className="grid content-start gap-3 rounded-[var(--radius-card)] border border-[var(--color-rule-2)]/50 bg-[var(--color-paper)] p-6 sm:p-7"
                >
                  <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)] uppercase">
                    {option.durationLabel[language]}
                  </p>
                  <h3 className="m-0 text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]">
                    {option.title[language]}
                  </h3>
                  <p className="m-0 text-[length:var(--text-sm)] leading-relaxed text-[var(--color-ink-2)]">
                    {option.summary[language]}
                  </p>
                  <p className="m-0 border-t border-[var(--color-rule)] pt-3 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    <strong className="font-semibold text-[var(--color-forest-deep)]">
                      {isEs ? "Recomendada para: " : "Best for: "}
                    </strong>
                    {option.bestFor[language]}
                  </p>
                </article>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-rule-2)]/45 bg-[var(--color-paper)]/75 px-6 py-4 text-[length:var(--text-sm)] text-[var(--color-ink-2)]">
              <p className="m-0">
                {isEs
                  ? "¿No ves ningún hueco que encaje con tu semana? Escribe a "
                  : "Cannot find a time that suits your week? Email "}
                <a
                  href="mailto:alma@karmarisedglobal.com"
                  className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                >
                  alma@karmarisedglobal.com
                </a>
                {isEs ? " o mándanos un " : " directly or message us on "}
                <a
                  href={WHATSAPP_HREF[language]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                >
                  WhatsApp (+34 611 722 276)
                </a>
                .
              </p>
              <Link
                href={localizeHref("/product-brief")}
                className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              >
                {isEs
                  ? "¿Prefieres escribir primero? Enviar briefing en 1 min →"
                  : "Prefer to write first? Send a 1-min Product Brief →"}
              </Link>
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* Call FAQs */}
        <section
          id="faq"
          className="bg-[var(--color-paper)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]"
        >
          <div className="container grid gap-[var(--space-xl)] lg:grid-cols-12">
            <div className="grid content-start gap-3 lg:col-span-4">
              <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-ink)] uppercase">
                {isEs ? "Antes de vernos" : "Before we meet"}
              </p>
              <h2 className="m-0 text-[length:var(--text-2xl)] font-medium">
                {isEs
                  ? "Preguntas habituales antes de reservar."
                  : "Questions founders usually ask before booking."}
              </h2>
            </div>

            <div className="grid gap-4 lg:col-span-8">
              {BOOK_CALL_FAQS.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-2 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] p-5 sm:p-6"
                >
                  <h3 className="m-0 text-[length:var(--text-lg)] font-medium text-[var(--color-forest-deep)]">
                    {item.question[language]}
                  </h3>
                  <p className="m-0 text-[length:var(--text-sm)] leading-relaxed text-[var(--color-ink-2)]">
                    {item.answer[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="night" />
      </main>

      <SiteFooter hideNewsletter />
    </>
  );
}
