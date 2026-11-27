import Image from "next/image";
import Link from "next/link";

import { BookCallScheduler } from "@/components/forms/book-call-scheduler";
import { HomeFaqAccordion } from "@/components/home/home-faq-accordion";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { BOOK_CALL_FAQS } from "@/data/conversion-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const ALMA_MEETING_PORTRAIT = "/images/founders/alma-swing-laughing.jpeg";

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
        {/* Band 1: Warm Parchment Editorial Invitation Header */}
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
                  {isEs ? "Reservar videollamada" : "Book a video call"}
                </li>
              </ol>
            </nav>

            <div className="grid items-center gap-[var(--space-lg)] lg:grid-cols-12 lg:gap-[var(--gap-columns)]">
              <div className="grid gap-3 lg:col-span-7">
                <h1 className="m-0 max-w-[15ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                  {isEs
                    ? "Siéntate a charlar con Alma."
                    : "Pull up a chair with Alma."}
                </h1>
                <p className="lead m-0 max-w-[46ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Elige un hueco gratuito por Google Meet para hablar de materiales, muestras físicas o plazos en la India, con las conclusiones de la reunión por escrito al terminar."
                    : "Pick a free Google Meet time to talk through materials, physical samples, or timelines in India, with clear meeting notes emailed straight after."}
                </p>
                <p className="m-0 text-[length:var(--text-sm)] font-medium text-[var(--color-muted)]">
                  {isEs
                    ? "Google Meet gratuito · Español, inglés o portugués · Acuerdo NDA disponible"
                    : "Free Google Meet · English, Spanish, or Portuguese · Mutual NDA available"}
                </p>
              </div>

              <figure className="editorial-photo-frame m-0 aspect-[16/10] w-full max-w-[360px] lg:col-span-5 lg:ms-auto">
                <Image
                  src={ALMA_MEETING_PORTRAIT}
                  alt={
                    isEs
                      ? "Alma riendo con cercanía en un columpio de madera en la India"
                      : "Alma laughing warmly on a wooden porch swing in India"
                  }
                  fill
                  priority
                  sizes="(max-width: 64rem) 100vw, 360px"
                  className="object-cover object-[50%_45%]"
                />
              </figure>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* Band 2: Centered Single-Screen Sunlit Scheduler + Companion Below on Warm Dune */}
        <section className="bg-[var(--color-dune)] pt-[var(--space-lg)] pb-[var(--space-2xl)] text-[var(--color-forest-deep)]">
          <div className="container">
            <BookCallScheduler />
          </div>
        </section>

        <SectionBridge from="dune" to="pale-sage" />

        {/* Band 3: Warm Editorial Call FAQs using shared dark-toggle accordion */}
        <section
          id="faq"
          className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]"
        >
          <div className="container grid items-start gap-[var(--space-xl)] lg:grid-cols-12 lg:gap-[var(--gap-columns)]">
            <div className="grid content-start gap-6 lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:col-span-5">
              <div className="grid gap-3">
                <h2 className="m-0 max-w-[16ch] text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "Dudas habituales antes de vernos."
                    : "Questions founders usually ask before we talk."}
                </h2>
                <p className="m-0 max-w-[38ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Qué traer a la llamada, cómo valoramos tiradas cortas y cómo protegemos tus diseños."
                    : "What to bring, how we look at first runs, and how your sketches stay yours."}
                </p>
                <Link
                  href={localizeHref("/how-we-work")}
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                >
                  <span>
                    {isEs
                      ? "Ver cómo trabajamos entre España y la India"
                      : "See how we work between Spain and India"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>

              <figure className="editorial-photo-frame m-0 aspect-[4/3] w-full">
                <Image
                  src="/images/almarise/alma-kalyan-fashion-studio-briefing.jpeg"
                  alt={
                    isEs
                      ? "Alma sentada a una mesa de estudio revisando carpetas de proyecto y notas en la India"
                      : "Alma seated at a studio table reviewing project folders and briefing notes in India"
                  }
                  fill
                  sizes="(max-width: 64rem) 100vw, 38vw"
                  className="object-cover object-[50%_25%]"
                />
              </figure>
            </div>

            <div className="lg:col-span-7">
              <HomeFaqAccordion
                idPrefix="book-call-faq"
                items={BOOK_CALL_FAQS}
                language={language}
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
