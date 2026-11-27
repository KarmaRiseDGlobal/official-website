import Image from "next/image";
import Link from "next/link";

import { ClosingConversationSection } from "@/components/home/closing-conversation-section";
import { HomeFaqAccordion } from "@/components/home/home-faq-accordion";
import { CategoryShowcaseSection } from "@/components/manufacturing/category-showcase-section";
import { ManufacturingScrollChoreography } from "@/components/manufacturing/manufacturing-scroll-choreography";
import { ProductStudyArtwork } from "@/components/manufacturing/product-study-artwork";
import { WrittenCommitmentsBranch } from "@/components/manufacturing/written-commitments-branch";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { PhaseJourney } from "@/components/showcases/phase-journey";
import {
  MANUFACTURING_CLOSING_CONVERSATION,
  MANUFACTURING_FAQS,
  MANUFACTURING_PRE_PRODUCTION_AGREEMENTS,
  MANUFACTURING_PRODUCT_STUDY_PILLARS,
  MANUFACTURING_SELECTION_CRITERIA,
} from "@/data/manufacturing-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const WHATSAPP_CTA_HREF = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma, I would like to discuss a product study and manufacturing in India with KarmaRise D Global.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma, me gustaría hablar sobre un estudio de producto y fabricación en la India con KarmaRise D Global.")}`,
} as const;

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

export function ManufacturingProgrammePageClient({
  lang = "en",
}: {
  lang?: SiteLanguage;
} = {}) {
  const language = lang;
  const localizeHref = (href: string) => localizePath(href, language);
  const isEs = language === "es";

  return (
    <>
      <ManufacturingScrollChoreography />
      <main className="programme-detail" id="main">
        {/* 1. Full-Bleed Dark Editorial Banner Hero */}
        <section
          className="hero manufacturing-hero"
          data-chat-avoid
          data-surface="dark"
          id="top"
        >
          <div className="hero-wrapper" data-hero-wrapper>
            <div
              className="hero-cover manufacturing-hero-media"
              data-hero-media
              data-slot="manufacturing-hero-banner"
            >
              <Image
                src="/images/workshops/brown-black-leather-panels-brass-hardware.jpg"
                alt={
                  isEs
                    ? "Paneles cortados de piel marrón y negra con anillas de latón envejecido sobre una mesa de producción en la India"
                    : "Cut brown and black vegetable-tanned leather panels fitted with antique brass D-rings on a production bench in India"
                }
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="hero-scrim" aria-hidden="true" />

            <div className="hero-content container" data-hero-content>
              <h1 data-hero-title>
                <span className="hero-headline-line" data-hero-line>
                  {isEs
                    ? "Fabricación para tu marca"
                    : "Own-brand manufacturing"}
                </span>{" "}
                <span className="hero-headline-line" data-hero-line>
                  {isEs ? "en la India." : "across India."}
                </span>
              </h1>

              <div className="hero-sub" data-hero-sub>
                <p className="hero-lead">
                  {isEs
                    ? "Del estudio de producto y las muestras físicas hasta la producción supervisada y la entrega en Europa, dirigida directamente por nosotros en la India."
                    : "From product study and physical samples to supervised production and European delivery, managed directly by us in India."}
                </p>
                <div className="hero-actions">
                  <Link
                    className="hero-primary"
                    href={localizeHref("/product-brief")}
                  >
                    {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
                  </Link>
                  <Link
                    className="hero-secondary-cta press-scale inline-flex min-h-[var(--control-height)] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-paper)]/55 bg-[var(--color-night)]/40 px-6 py-3 text-center text-[length:var(--text-md)] font-semibold text-[var(--color-paper)] no-underline backdrop-blur-sm transition-colors hover:border-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-night)]"
                    href={localizeHref("/book-a-call?duration=15")}
                  >
                    {isEs
                      ? "Reserva una llamada gratis con Alma"
                      : "Book a free call with Alma"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Breadcrumb + Product Study, Feasibility, and Product Design */}
        <section
          className="bg-[var(--color-dune)] pt-[var(--space-md)] pb-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="product-study-and-design"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] uppercase">
              <nav
                aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
                className="flex items-center"
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
                    {isEs ? "Fabricación" : "Manufacturing"}
                  </li>
                </ol>
              </nav>
            </div>

            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="lg:col-span-6">
                <h2
                  data-choreo="manufacturing-section-header"
                  className="m-0 max-w-[20ch] text-[length:var(--text-section)] leading-[1.06] font-normal text-[var(--color-forest-deep)]"
                >
                  {isEs
                    ? "Estudiamos cómo usará la pieza tu cliente antes de cortar una sola muestra"
                    : "We study how your customer uses the piece before a single sample is cut"}
                </h2>
              </div>
              <p className="m-0 max-w-[40ch] text-[length:var(--text-md)] leading-[1.64] text-[var(--color-ink-2)] lg:col-span-6 lg:justify-self-end">
                {isEs
                  ? "La mayoría de las fábricas copian un boceto sin preguntar. Nosotros nos sentamos contigo antes, afinamos cada detalle práctico y creamos piezas que tus clientes eligen."
                  : "Most factories copy a sketch without speaking up. We sit down with you first, refine every practical detail, and build pieces your customers reach for."}
              </p>
            </div>

            <div className="grid items-start gap-[var(--space-xl)] lg:grid-cols-[minmax(0,5.8fr)_minmax(0,6.2fr)] lg:gap-[var(--gap-columns)]">
              <div className="study-media-sticky grid gap-5">
                <figure className="m-0">
                  <div className="study-sharp-photo">
                    <Image
                      src="/images/workshops/alma-purple-leather-hide-drape-check.jpeg"
                      alt={
                        isEs
                          ? "Alma y tres especialistas marroquineros inspeccionando la caída y textura de pieles sobre una mesa en la India"
                          : "Alma and three leather specialists inspecting supple leather hides together across a table in India"
                      }
                      fill
                      sizes="(max-width: 64rem) 100vw, 48vw"
                      className="object-cover object-[50%_32%]"
                    />
                  </div>
                </figure>
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref(
                    "/stories/from-spain-to-a-cutting-table-in-india",
                  )}
                >
                  <span>
                    {isEs
                      ? "Lee cómo una primera llamada en España llega a la producción en la India"
                      : "Read how a first call in Spain reaches production in India"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>

              <div className="study-cards-stack" data-study-stack>
                {MANUFACTURING_PRODUCT_STUDY_PILLARS.map((pillar, index) => (
                  <article
                    key={pillar.id}
                    data-stack-index={index}
                    data-study-card
                    className="study-stack-card"
                  >
                    <div
                      aria-hidden="true"
                      className="study-stack-card-veil"
                      data-study-card-veil
                    />
                    <div className="study-stack-card-head">
                      <h3 className="study-stack-card-title">
                        {pillar.title[language]}
                      </h3>
                      <p className="study-stack-card-body">
                        {pillar.body[language]}
                      </p>
                    </div>
                    <ProductStudyArtwork
                      language={language}
                      pillarId={pillar.id}
                    />
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* 3. Four Manufacturing Categories & Interactive Atelier Showcase */}
        <CategoryShowcaseSection language={language} />

        {/* 4. Vetted Indian Artisans & Family-Run Production Units */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="artisans-and-workshops"
        >
          <div className="container grid gap-[var(--space-xl)] md:gap-[var(--space-2xl)]">
            <div className="grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-md)] lg:col-span-5">
                <h2
                  data-choreo="manufacturing-section-header"
                  className="m-0 max-w-[18ch] text-[length:var(--text-section)] leading-[1.06] font-normal text-[var(--color-forest-deep)]"
                >
                  {isEs
                    ? "Encontrar fabricantes fiables en la India exige recorrer muchos kilómetros sobre el terreno"
                    : "Finding reliable makers in India takes kilometres on the ground"}
                </h2>
                <p className="m-0 max-w-[44ch] text-[length:var(--text-md)] leading-[1.64] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Descartamos las plantas masivas y auditamos en persona fábricas de corte familiar, marroquineros y colectivos de artesanas por toda la India. Pasamos días junto a las líneas de costura hablando con el equipo, no solo con los propietarios. Si una instalación cierra sus puertas o incumple nuestra tolerancia cero ante la explotación, nos marchamos."
                    : "We skip anonymous mass-production plants and audit family-run factories, leather ateliers, and women artisan collectives across India in person. We spend days beside the stitching lines speaking directly with the makers. If a site keeps doors closed or breaches our zero-exploitation standard, we walk away."}
                </p>
              </div>
              <div className="lg:col-span-7">
                <figure className="m-0">
                  <div className="editorial-photo-frame aspect-[4/3]">
                    <Image
                      src="/images/workshops/alma-leather-manufacturing-partner-team-india.jpg"
                      alt={
                        isEs
                          ? "Alma sonriendo junto al equipo de nuestra unidad colaboradora de marroquinería frente a los expositores de muestras en la India"
                          : "Alma smiling beside our leather manufacturing partner team in front of sample bag racks in India"
                      }
                      fill
                      sizes="(max-width: 64rem) calc(100vw - 2rem), 54vw"
                      className="object-cover object-[50%_34%]"
                    />
                  </div>
                </figure>
              </div>
            </div>

            {/* Borderless Audit Standards on Shared 12-Column Spine */}
            <dl className="m-0 grid gap-x-[var(--gap-columns)] gap-y-8 md:grid-cols-12">
              {MANUFACTURING_SELECTION_CRITERIA.map((item) => (
                <div
                  key={item.id}
                  className="grid content-start gap-2 md:col-span-6"
                >
                  <dt className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[1.2] font-normal text-[var(--color-forest-deep)]">
                    {item.title[language]}
                  </dt>
                  <dd className="m-0 max-w-[44ch] text-[length:var(--text-sm)] leading-[1.62] text-[var(--color-ink-2)]">
                    {item.body[language]}
                  </dd>
                </div>
              ))}
            </dl>

            <div data-chat-avoid className="pt-2">
              <Link
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                href={localizeHref(
                  "/stories/matching-a-workshop-to-the-product",
                )}
              >
                <span>
                  {isEs
                    ? "Lee cómo elegimos al fabricante adecuado para cada producto"
                    : "Read how we match the right maker to each product"}
                </span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="night" size="gentle" />

        {/* 5. Uniform 6-Stage Manufacturing Process Showcase */}
        <PhaseJourney />

        <SectionBridge from="night" to="paper" size="gentle" />

        {/* 7. What We Put in Writing Before Production */}
        <section
          aria-labelledby="quality-and-compliance-heading"
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="quality-and-compliance"
        >
          <div className="container">
            <div className="mx-auto grid max-w-[58rem] gap-[var(--space-xl)]">
              <div className="mx-auto grid max-w-[46ch] justify-items-center gap-4 text-center">
                <h2
                  id="quality-and-compliance-heading"
                  data-choreo="manufacturing-section-header"
                  className="m-0 max-w-[26ch] text-[length:var(--text-section)] leading-[1.08] font-normal text-[var(--color-forest-deep)]"
                >
                  {isEs
                    ? "Lo que dejamos por escrito"
                    : "What we put in writing"}
                </h2>
                <p className="m-0 text-[length:var(--text-lead)] leading-[1.5] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Cuatro compromisos que dejamos por escrito antes de producir, para que nada quede en el aire."
                    : "Four commitments we put on paper before production starts, so nothing depends on guesswork."}
                </p>
              </div>

              <WrittenCommitmentsBranch
                items={MANUFACTURING_PRE_PRODUCTION_AGREEMENTS}
                language={language}
              />

              <div className="flex justify-center">
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/terms")}
                >
                  <span>
                    {isEs
                      ? "Confidencialidad y propiedad intelectual"
                      : "Intellectual property and confidentiality terms"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* 8. Frequently Asked Questions (Shared Interactive Accordion, Full SSR HTML) */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="faq"
        >
          <div className="container grid gap-[var(--space-2xl)] lg:grid-cols-12 lg:items-start lg:gap-[var(--gap-columns)]">
            <div className="grid content-start gap-4 lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:col-span-4">
              <h2
                data-choreo="manufacturing-section-header"
                className="m-0 max-w-[16ch] text-[length:var(--text-section)] leading-[1.06] font-normal text-[var(--color-forest-deep)]"
              >
                {isEs
                  ? "Respuestas claras antes de dar el salto a la India"
                  : "Straight answers before you manufacture in India"}
              </h2>
              <p className="m-0 max-w-[36ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-muted)]">
                {isEs
                  ? "Respuestas prácticas sobre cómo empezar sin ficha técnica, cantidades, respaldo legal, envíos e idiomas."
                  : "Practical answers on starting without a tech pack, quantities, legal backing, shipping, and working languages."}
              </p>
              <div className="grid gap-1 text-[length:var(--text-sm)]">
                <Link
                  href={localizeHref("/contact")}
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                >
                  <span>
                    {isEs
                      ? "Escribe directamente a Alma y Shirish"
                      : "Write directly to Alma and Shirish"}
                  </span>
                  <ArrowIcon />
                </Link>
                <Link
                  href={localizeHref(
                    "/stories/why-sample-approval-decides-bulk",
                  )}
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                >
                  <span>
                    {isEs
                      ? "Historia: Por qué decide la muestra física"
                      : "Story: Why physical samples decide quality"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <HomeFaqAccordion
                idPrefix="manufacturing-faq"
                items={MANUFACTURING_FAQS}
                language={language}
              />
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="pale-sage" />

        {/* 9. Progressive Botanical Closing Arches (Shared Signature Conversion Band) */}
        <ClosingConversationSection
          copy={MANUFACTURING_CLOSING_CONVERSATION}
          language={language}
          whatsappHref={WHATSAPP_CTA_HREF}
        />
      </main>

      <SiteFooter />
    </>
  );
}
