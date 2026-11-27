import Image from "next/image";
import Link from "next/link";

import { AboutScrollChoreography } from "@/components/about/about-scroll-choreography";
import { SpainIndiaFoundersSection } from "@/components/about/spain-india-founders-section";
import { ClosingConversationSection } from "@/components/home/closing-conversation-section";
import { HomeFaqAccordion } from "@/components/home/home-faq-accordion";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import {
  ABOUT_CLOSING_CONVERSATION,
  ABOUT_COMPANY_FACTS,
  ABOUT_FAQS,
  ABOUT_PRINCIPLES,
} from "@/data/about-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

import styles from "./about.module.css";

const WHATSAPP_CTA_HREF = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma, I read about you and Shirish on KarmaRise D Global and would like to discuss a product idea.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma, acabo de leer vuestra historia en KarmaRise D Global y me gustaría hablar sobre una idea de producto.")}`,
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

export function AboutPageClient({
  lang = "en",
}: {
  lang?: SiteLanguage;
} = {}) {
  const language = lang;
  const localizeHref = (href: string) => localizePath(href, language);
  const isEs = language === "es";

  return (
    <>
      <AboutScrollChoreography />
      <main className={styles.about} id="main">
        {/* 1. Full-Bleed Light Editorial Banner Hero */}
        <section
          className="hero about-hero"
          data-chat-avoid
          data-surface="light"
          id="top"
        >
          <div className="hero-wrapper" data-hero-wrapper>
            <div
              className="hero-cover about-hero-media"
              data-hero-media
              aria-hidden="true"
            />
            <div className="hero-content container" data-hero-content>
              <h1 data-hero-title>
                <span className="hero-headline-line" data-hero-line>
                  {isEs ? "Conoce a Alma y Shirish," : "Meet Alma and Shirish,"}
                </span>{" "}
                <span className="hero-headline-line" data-hero-line>
                  {isEs
                    ? "fundadores de KarmaRise D Global."
                    : "founders of KarmaRise D Global."}
                </span>
              </h1>
              <div className="hero-sub" data-hero-sub>
                <p className="hero-lead">
                  {isEs
                    ? "Trabajamos entre España y la India para que comercios y marcas puedan producir sus propias colecciones con dos fundadores sobre el terreno."
                    : "We work between Spain and India so independent shops and brands can produce their own collections with two founders on the ground."}
                </p>
                <div className="hero-actions">
                  <Link
                    className="primary-button-light"
                    href={localizeHref("/product-brief")}
                  >
                    {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
                  </Link>
                  <Link
                    className="hero-secondary-cta secondary-button-light"
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

        {/* 2. Semantic Breadcrumb + Spain-to-India Geographic Bridge + Distilled Alma (#alma) & Shirish (#shirish) Modules */}
        <SpainIndiaFoundersSection language={language} />

        <SectionBridge from="paper" to="pale-sage" />

        {/* 3. Why KarmaRise + Team Photo */}
        <section className={styles.meaning} id="why-karmarise">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className={styles.meaningGrid}>
              <div className={styles.meaningTitle}>
                <h2 data-choreo="about-section-header">
                  {isEs ? "¿Por qué KarmaRise?" : "Why KarmaRise?"}
                </h2>
              </div>
              <div className={styles.meaningCopy}>
                <p className={styles.largeCopy}>
                  {isEs
                    ? "Quienes suben el cierre de su tienda cada día pelean contra la comodidad de comprar online y contra comprar a un mayorista exactamente lo mismo que vende toda la calle. Fundamos KarmaRise D Global para que tiendas independientes, cadenas y nuevas marcas puedan ofrecer moda y decoración a medida, abrir cajas en la puerta de su negocio y colocar en el escaparate una colección que no tiene nadie más."
                    : "Independent shops face daily pressure from online marketplaces and copy-paste wholesale catalogues. We started KarmaRise D Global so boutique owners, retail chains, and emerging brands can offer tailor-made fashion and home decor, open boxes at their shop door, and place a collection straight into the window that nobody down the street carries."}
                </p>
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/stories/three-biryanis-on-eid")}
                >
                  <span>
                    {isEs
                      ? "Leer a Alma sobre la vida cotidiana entre España y la India"
                      : "Read Alma on daily life and hospitality between Spain and India"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <figure className="editorial-photo-frame m-0 aspect-[16/9]">
              <Image
                src="/images/workshops/alma-shirish-india-office-meeting.jpg"
                alt={
                  isEs
                    ? "Alma, Shirish y su equipo reunidos alrededor de una mesa de madera en la India revisando carpetas y cuadernos"
                    : "Alma, Shirish, and their team seated around a wooden office table in India reviewing folders and notebooks"
                }
                fill
                sizes="(max-width: 80rem) 100vw, 1280px"
                className="object-cover object-[50%_38%]"
              />
            </figure>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="paper" />

        {/* 5. Principles */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="principles"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)] lg:flex lg:items-end lg:justify-between">
              <h2
                data-choreo="about-section-header"
                className="m-0 max-w-[16ch] text-[length:var(--text-section)] leading-[1.06] font-normal tracking-[var(--tracking-display)]"
              >
                {isEs
                  ? "Cómo trabajamos con las personas"
                  : "How we work with people"}
              </h2>
              <Link
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/how-we-work")}
              >
                <span>
                  {isEs
                    ? "Ver cómo coordinamos España y la India día a día"
                    : "See how we coordinate Spain and India day to day"}
                </span>
                <ArrowIcon />
              </Link>
            </div>

            <div className="grid gap-x-[var(--gap-columns)] gap-y-[var(--space-2xl)] sm:grid-cols-2">
              {ABOUT_PRINCIPLES.map((principle) => (
                <article
                  key={principle.id}
                  className="grid content-start gap-3"
                >
                  <h3 className="m-0 text-[length:var(--text-title)] font-normal text-[var(--color-forest-deep)]">
                    {principle.title[language]}
                  </h3>
                  <p className="m-0 text-[var(--color-muted)]">
                    {principle.body[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* 6. Multi-Region Partner Matching */}
        <section className={styles.india} id="workshops">
          <div className="container grid gap-[var(--space-xl)] md:gap-[var(--space-2xl)]">
            <div className={styles.indiaGrid}>
              <figure className={styles.indiaImage}>
                <Image
                  src="/images/workshops/alma-shirish-leather-partner-family-india.jpg"
                  alt={
                    isEs
                      ? "Alma y Shirish sonriendo junto a la familia de su unidad colaboradora de marroquinería en la India"
                      : "Alma and Shirish smiling together with their Indian leather manufacturing partner family"
                  }
                  fill
                  sizes="(max-width: 64rem) 100vw, 54vw"
                />
              </figure>
              <div className={styles.indiaCopy}>
                <h2 data-choreo="about-section-header">
                  {isEs
                    ? "Encajar cada producto con la región india que mejor domina su oficio"
                    : "Matching every product to the Indian hub that knows it best"}
                </h2>
                <p className="m-0 max-w-[46ch] text-[var(--color-muted)]">
                  {isEs
                    ? "La marroquinería, la ropa, los complementos textiles y la decoración del hogar exigen maquinaria y oficios distintos. Conectamos tu idea con la región india que mejor domina ese oficio y seguimos cada fase desde nuestro estudio en Maharashtra."
                    : "Leather goods, clothing, textile accessories, and home decor each demand different machinery and craft skill. We match your idea to the Indian craft region that knows it best, and oversee every step from our studio in Maharashtra."}
                </p>
                <div className="grid gap-1">
                  <Link
                    className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                    href={localizeHref("/manufacturing#artisans-and-workshops")}
                  >
                    <span>
                      {isEs
                        ? "Descubre cómo elegimos a cada fabricante"
                        : "See how we vet makers across India"}
                    </span>
                    <ArrowIcon />
                  </Link>
                  <Link
                    className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                    href={localizeHref(
                      "/stories/matching-a-workshop-to-the-product",
                    )}
                  >
                    <span>
                      {isEs
                        ? "Lee la Historia sobre cómo elegimos al especialista para cada pieza"
                        : "Read the Story on matching each maker to your product"}
                    </span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* 7. Where We Work + Structured Company & Founders Fact Table */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="company-structure"
        >
          <div className="container grid gap-[var(--space-xl)] md:gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--gap-columns)] lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-5">
                <h2
                  data-choreo="about-section-header"
                  className="m-0 max-w-[16ch] text-[length:var(--text-section)] leading-[1.06] font-normal tracking-[var(--tracking-display)]"
                >
                  {isEs
                    ? "Dónde trabajamos y cómo estamos organizados"
                    : "Where we work and how we are set up"}
                </h2>
              </div>

              <div className="grid gap-3 lg:col-span-7">
                <p className="m-0 max-w-[54ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Nuestro estudio está en Maharashtra, cerca de Mumbai, bien conectado con los polos artesanos que visitamos en la India mientras acompañamos a comercios y marcas de España y el resto de Europa."
                    : "Our studio sits in Maharashtra, near Mumbai, close to the craft hubs we visit across India while we work directly with shops and brands across Spain and the rest of Europe."}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[length:var(--text-sm)]">
                  <Link
                    className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                    href={localizeHref("/contact")}
                  >
                    <span>
                      {isEs ? "Ver datos de contacto" : "View contact details"}
                    </span>
                    <ArrowIcon />
                  </Link>
                  <Link
                    className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                    href={localizeHref("/legal-notice")}
                  >
                    <span>
                      {isEs
                        ? "Aviso legal y registro"
                        : "Legal notice & registration"}
                    </span>
                    <ArrowIcon />
                  </Link>
                  <Link
                    className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                    href={localizeHref("/terms")}
                  >
                    <span>
                      {isEs
                        ? "Confidencialidad y propiedad intelectual"
                        : "Confidentiality & IP terms"}
                    </span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-normal text-[var(--color-forest-deep)]">
                {isEs
                  ? "KarmaRise D Global y sus fundadores de un vistazo"
                  : "KarmaRise D Global and founders at a glance"}
              </h3>

              {/* Desktop & Tablet Structured Fact Table */}
              <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] md:block">
                <table className="w-full border-collapse text-start text-[length:var(--text-sm)]">
                  <caption className="sr-only">
                    {isEs
                      ? "Datos clave de KarmaRise D Global, Karmarise Global LLP, cofundadores, idiomas de trabajo, categorías B2B e iniciativas"
                      : "Key company facts for KarmaRise D Global, Karmarise Global LLP, co-founders, working languages, B2B categories, and initiatives"}
                  </caption>
                  <tbody className="divide-y divide-[var(--color-rule)]">
                    {ABOUT_COMPANY_FACTS.map((row) => (
                      <tr key={row.id}>
                        <th
                          scope="row"
                          className="w-[30%] bg-[var(--color-paper)]/75 px-5 py-4 text-start align-top font-semibold text-[var(--color-forest-deep)]"
                        >
                          {row.label[language]}
                        </th>
                        <td
                          className={`px-5 py-4 align-top leading-[1.6] text-[var(--color-ink-2)] ${row.numeric ? "num" : ""}`}
                        >
                          <span className="block max-w-[60ch]">
                            {row.value[language]}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Stacked Definition List (Zero Horizontal Scroll Down to 320px) */}
              <dl className="m-0 grid divide-y divide-[var(--color-rule)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] md:hidden">
                {ABOUT_COMPANY_FACTS.map((row) => (
                  <div key={row.id} className="grid gap-1.5 px-4 py-4">
                    <dt className="text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-forest-deep)] uppercase">
                      {row.label[language]}
                    </dt>
                    <dd
                      className={`m-0 text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-ink-2)] ${row.numeric ? "num" : ""}`}
                    >
                      {row.value[language]}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* 8. Owned Brand & Planned Initiative */}
        <section className={styles.future} id="initiatives">
          <div className={`${styles.futureGrid} container`}>
            <div className={styles.futureHeading}>
              <h2 data-choreo="about-section-header">
                {isEs
                  ? "Qué más estamos desarrollando en la India"
                  : "What else we are building in India"}
              </h2>
            </div>
            <article>
              <figure className="editorial-photo-frame m-0 aspect-[4/3]">
                <Image
                  src="/images/almarise/almarise-reborn-magenta-saree-garment.jpeg"
                  alt={
                    isEs
                      ? "Prenda exterior fucsia con bordado dorado zari confeccionada por AlmaRise D Brand a partir de un sari indio guardado"
                      : "Magenta and gold zari everyday outer garment tailored by AlmaRise D Brand from a kept Indian saree"
                  }
                  fill
                  sizes="(max-width: 46rem) 100vw, (max-width: 80rem) 50vw, 33vw"
                  className="object-cover object-top"
                />
              </figure>
              <h3>AlmaRise D Brand</h3>
              <p>
                {isEs ? (
                  <>
                    Cortar, probar y rematar nuestras propias piezas cada semana
                    afina el ojo para cada colección comercial que supervisamos.
                    AlmaRise D Brand reúne <strong>AlmaRise D Reborn</strong>{" "}
                    (prendas de uso diario únicas a partir de saris guardados,{" "}
                    <em>thevnitlya sadya</em>),{" "}
                    <strong>AlmaRise D Organic</strong> (tintes orgánicos y
                    fibras de residuos vegetales) y{" "}
                    <strong>AlmaRise D Home Decor</strong>.
                  </>
                ) : (
                  <>
                    Cutting, fitting, and finishing our own pieces every week
                    sharpens our eye for every client collection we supervise.
                    AlmaRise D Brand brings together{" "}
                    <strong>AlmaRise D Reborn</strong> (one-of-a-kind everyday
                    garments cut from kept Indian sarees,{" "}
                    <em>thevnitlya sadya</em>),{" "}
                    <strong>AlmaRise D Organic</strong> (organic dyes and
                    plant-waste fibres), and{" "}
                    <strong>AlmaRise D Home Decor</strong>.
                  </>
                )}
              </p>
              <div className="grid gap-1">
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/almarise")}
                >
                  <span>
                    {isEs
                      ? "Conocer AlmaRise D Brand"
                      : "Explore AlmaRise D Brand"}
                  </span>
                  <ArrowIcon />
                </Link>
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                  href={localizeHref(
                    "/stories/giving-maharashtrian-sarees-a-second-life",
                  )}
                >
                  <span>
                    {isEs
                      ? "Leer la Historia detrás de AlmaRise D Brand"
                      : "Read the Story behind AlmaRise D Brand"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>
            </article>
            <article>
              <figure className="editorial-photo-frame m-0 aspect-[4/3]">
                <Image
                  src="/images/almarise/almarise-sewing-studio-wide-view-india.jpg"
                  alt={
                    isEs
                      ? "Estudio textil luminoso en la India con máquinas de coser industriales, un maniquí y una confeccionista en la mesa de trabajo"
                      : "Sunlit garment studio in India with industrial sewing machines, a dressmaker form, and a woman maker seated at the studio table"
                  }
                  fill
                  sizes="(max-width: 46rem) 100vw, (max-width: 80rem) 50vw, 33vw"
                  className="object-cover object-[50%_52%]"
                />
              </figure>
              <h3>
                {isEs
                  ? "Iniciativa de formación para mujeres"
                  : "Women's Training Initiative"}
              </h3>
              <p>
                {isEs
                  ? "En paralelo a nuestra actividad comercial, preparamos en la India un programa formativo en diseño de prendas y costura bajo una futura fundación Section 8. Su meta es enseñar un oficio real que abra una segunda oportunidad mediante trabajo digno y remunerado. Las inscripciones todavía no están abiertas y publicamos avances sinceros conforme madura el proyecto."
                  : "Alongside our commercial work, we are preparing a garment design and stitching training programme in India under a planned Section 8 foundation. Its goal is practical skills and a real second chance through dignified paid work. Applications are not open yet, and we post candid progress updates as the groundwork moves forward."}
              </p>
              <div className="grid gap-1">
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/womens-training-initiative")}
                >
                  <span>
                    {isEs
                      ? "Leer sobre la iniciativa en preparación"
                      : "Read about the planned initiative"}
                  </span>
                  <ArrowIcon />
                </Link>
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                  href={localizeHref(
                    "/stories/preparing-womens-garment-training-maharashtra",
                  )}
                >
                  <span>
                    {isEs
                      ? "Por qué aún no hemos abierto plazas"
                      : "Why applications have not opened yet"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>
            </article>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* 9. Entity & Founder Trust FAQs (Shared Interactive Accordion with Dark Filled Toggles) */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="faq"
          data-chat-avoid
        >
          <div className="container grid gap-[var(--space-2xl)] lg:grid-cols-12 lg:items-start lg:gap-[var(--gap-columns)]">
            <div className="grid content-start gap-4 lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:col-span-4">
              <h2
                data-choreo="about-section-header"
                className="m-0 max-w-[16ch] text-[length:var(--text-section)] leading-[1.06] font-normal tracking-[var(--tracking-display)]"
              >
                {isEs
                  ? "Respuestas claras antes de trabajar juntos"
                  : "Straight answers before we work together"}
              </h2>
              <p className="m-0 max-w-[38ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-muted)]">
                {isEs
                  ? "Cómo trabajamos sobre el terreno en la India, cómo nuestra marca propia afina los encargos y en qué punto está la iniciativa formativa."
                  : "How we work on the ground in India, how our own label sharpens client work, and where the planned training initiative stands."}
              </p>

              <div className="grid gap-1 text-[length:var(--text-sm)]">
                <Link
                  href={localizeHref(
                    "/stories/from-spain-to-a-cutting-table-in-india",
                  )}
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                >
                  <span>
                    {isEs
                      ? "Leer: De una primera llamada en España a producción en la India"
                      : "Read: How a first call in Spain moves into production in India"}
                  </span>
                  <ArrowIcon />
                </Link>
                <Link
                  href={localizeHref("/stories")}
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                >
                  <span>
                    {isEs
                      ? "Leer todas las Historias de Alma y Shirish"
                      : "Read all Stories by Alma and Shirish"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <HomeFaqAccordion
                idPrefix="about-faq"
                items={ABOUT_FAQS}
                language={language}
              />
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="pale-sage" />

        {/* 10. Progressive Botanical Closing Arches (Shared Signature Conversion Band) */}
        <ClosingConversationSection
          copy={ABOUT_CLOSING_CONVERSATION}
          language={language}
          whatsappHref={WHATSAPP_CTA_HREF}
        />
      </main>

      <SiteFooter />
    </>
  );
}
