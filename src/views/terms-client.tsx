import Link from "next/link";

import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import {
  LEGAL_DATES,
  LEGAL_NAV_LINKS,
  LEGAL_REGISTERED_OFFICE,
} from "@/data/legal-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const legalNavLinks = LEGAL_NAV_LINKS.map((item) => ({
  ...item,
  current: item.href === "/terms",
}));

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

const SIX_PROGRAMME_STAGES: ReadonlyArray<{
  readonly stage: string;
  readonly label: Record<SiteLanguage, string>;
}> = [
  {
    stage: "01",
    label: {
      en: "Brief and Product Study",
      es: "Briefing y estudio de producto",
    },
  },
  {
    stage: "02",
    label: {
      en: "Material and Physical Swatch Approval",
      es: "Aprobación de materiales y muestra física de color",
    },
  },
  {
    stage: "03",
    label: {
      en: "Physical Sample Review and Sign-Off",
      es: "Revisión y aprobación de muestra física",
    },
  },
  {
    stage: "04",
    label: {
      en: "Contracts and Pre-Production Prep",
      es: "Contratos y preparación previa a la producción",
    },
  },
  {
    stage: "05",
    label: {
      en: "Supervised Production and On-Site Checks",
      es: "Producción supervisada y controles en planta",
    },
  },
  {
    stage: "06",
    label: {
      en: "EU Labelling, Packing, and Door-to-Door Delivery",
      es: "Etiquetado europeo, embalaje y entrega puerta a puerta",
    },
  },
];

export function TermsPageClient({
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
        {/* Band 1: Warm Parchment, Header, Document Nav, Section 1 Operator, Section 2 IP & Confidentiality */}
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-md))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container">
            <div className="mx-auto grid max-w-[56rem] gap-[var(--space-2xl)]">
              <div className="grid gap-5">
                <nav
                  aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
                  className="flex items-center text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] uppercase"
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
                    <li
                      aria-hidden="true"
                      className="text-[var(--color-muted)]"
                    >
                      /
                    </li>
                    <li
                      aria-current="page"
                      className="inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-clay-ink)]"
                    >
                      {isEs ? "Condiciones de uso" : "Website terms"}
                    </li>
                  </ol>
                </nav>

                <h1 className="max-w-[22ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                  {isEs ? "Condiciones de uso del sitio web" : "Website terms"}
                </h1>

                <p className="lead max-w-[65ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Estas Condiciones regulan el acceso y uso del sitio web de KarmaRise D Global, el envío precontractual de briefings de producto y los activos de marca operados por Karmarise Global LLP."
                    : "These Website Terms govern access to and use of the KarmaRise D Global website, pre-agreement Product Brief submissions, and brand assets operated by Karmarise Global LLP."}
                </p>

                <p className="num text-[length:var(--text-xs)] text-[var(--color-muted)]">
                  {isEs
                    ? `Fecha de entrada en vigor: ${LEGAL_DATES.effective.es} · Última actualización: ${LEGAL_DATES.updated.es}`
                    : `Effective date: ${LEGAL_DATES.effective.en} · Last updated: ${LEGAL_DATES.updated.en}`}
                </p>

                <nav
                  aria-label={isEs ? "Documentos legales" : "Legal documents"}
                  className="flex flex-wrap gap-2 py-2"
                >
                  {legalNavLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={localizeHref(item.href)}
                      aria-current={item.current ? "page" : undefined}
                      className={
                        item.current
                          ? "inline-flex min-h-[var(--tap-min)] items-center rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-4 py-2.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-paper)] no-underline"
                          : "inline-flex min-h-[var(--tap-min)] items-center rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-2.5 text-[length:var(--text-xs)] font-medium text-[var(--color-forest-deep)] no-underline transition-colors hover:border-[var(--color-forest-deep)]"
                      }
                    >
                      {item.label[language]}
                    </Link>
                  ))}
                </nav>
              </div>

              <section className="grid gap-4" id="operator">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "1. Entidad titular y ámbito societario"
                    : "1. Legal operator and entity scope"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs ? (
                    <>
                      Este sitio web es titularidad y está operado por{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        Karmarise Global LLP
                      </strong>{" "}
                      (LLPIN:{" "}
                      <span className="num font-semibold text-[var(--color-forest-deep)]">
                        <bdi dir="ltr">ACO-3878</bdi>
                      </span>{" "}
                      · GSTIN:{" "}
                      <span className="num font-semibold text-[var(--color-forest-deep)]">
                        <bdi dir="ltr">27ABDFK8128R1ZL</bdi>
                      </span>
                      ), una Limited Liability Partnership constituida conforme
                      a las leyes de la India el{" "}
                      <span className="num">{LEGAL_DATES.effective.es}</span>{" "}
                      con domicilio social en {LEGAL_REGISTERED_OFFICE}.{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        KarmaRise D Global
                      </strong>{" "}
                      es la marca comercial principal de Karmarise Global LLP y{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        AlmaRise D Brand
                      </strong>{" "}
                      es una marca de moda y estilo de vida (que integra
                      AlmaRise D Reborn, AlmaRise D Organic y AlmaRise D Home
                      Decor) propiedad de Karmarise Global LLP. La información
                      registral completa figura en nuestro{" "}
                      <Link
                        className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href={localizeHref("/legal-notice")}
                      >
                        Aviso legal
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      This website is owned and operated by{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        Karmarise Global LLP
                      </strong>{" "}
                      (LLPIN:{" "}
                      <span className="num font-semibold text-[var(--color-forest-deep)]">
                        <bdi dir="ltr">ACO-3878</bdi>
                      </span>{" "}
                      · GSTIN:{" "}
                      <span className="num font-semibold text-[var(--color-forest-deep)]">
                        <bdi dir="ltr">27ABDFK8128R1ZL</bdi>
                      </span>
                      ), a Limited Liability Partnership incorporated under the
                      laws of India on{" "}
                      <span className="num">{LEGAL_DATES.effective.en}</span>{" "}
                      with its registered office at {LEGAL_REGISTERED_OFFICE}.{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        KarmaRise D Global
                      </strong>{" "}
                      is the primary commercial brand of Karmarise Global LLP,
                      and{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        AlmaRise D Brand
                      </strong>{" "}
                      is a fashion and lifestyle brand (spanning AlmaRise D
                      Reborn, AlmaRise D Organic, and AlmaRise D Home Decor)
                      owned by Karmarise Global LLP. Full statutory registration
                      disclosures are published on our{" "}
                      <Link
                        className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href={localizeHref("/legal-notice")}
                      >
                        Legal notice
                      </Link>{" "}
                      page.
                    </>
                  )}
                </p>
              </section>

              <section className="grid gap-4" id="confidentiality">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "2. Propiedad intelectual del cliente y confidencialidad del briefing de producto"
                    : "2. Client intellectual property and Product Brief confidentiality"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs ? (
                    <>
                      Sabemos que los comercios, cadenas comerciales y marcas
                      comparten ideas de producto propias al iniciar un briefing
                      de producto. Cuando usted envíe bocetos, fichas técnicas,
                      medidas, fotografías de muestras, especificaciones de
                      materiales o planes comerciales a través de{" "}
                      <Link
                        className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href={localizeHref("/product-brief")}
                      >
                        nuestro formulario de briefing de producto
                      </Link>{" "}
                      o a cualquier dirección oficial{" "}
                      <span className="font-semibold [overflow-wrap:anywhere] text-[var(--color-forest-deep)]">
                        <bdi dir="ltr">@karmarisedglobal.com</bdi>
                      </span>
                      :
                    </>
                  ) : (
                    <>
                      We recognize that independent shops, retail chains, and
                      brands share proprietary product ideas when initiating a
                      Product Brief. When you submit sketches, technical packs,
                      measurements, sample photographs, material specifications,
                      or commercial plans through{" "}
                      <Link
                        className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href={localizeHref("/product-brief")}
                      >
                        our Product Brief form
                      </Link>{" "}
                      or to any official{" "}
                      <span className="font-semibold [overflow-wrap:anywhere] text-[var(--color-forest-deep)]">
                        <bdi dir="ltr">@karmarisedglobal.com</bdi>
                      </span>{" "}
                      email address:
                    </>
                  )}
                </p>
                <ul className="m-0 grid max-w-[65ch] gap-3 pl-5 text-[var(--color-muted)]">
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Titularidad exclusiva del cliente:"
                        : "Client ownership preserved:"}
                    </strong>{" "}
                    {isEs
                      ? "Todos los diseños previos, marcas, bocetos, patrones y especificaciones enviados por un cliente pertenecen única y exclusivamente a dicho cliente. El envío de un briefing de producto no otorga a Karmarise Global LLP licencia alguna para comercializar sus diseños para terceros ni para sus marcas propias."
                      : "All pre-existing designs, trademarks, sketches, patterns, and product specifications submitted by a prospective Client remain the sole and exclusive intellectual property of that Client. Submitting a Product Brief does not grant Karmarise Global LLP any license to commercialize your designs for third parties or for its own brands."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Evaluación directa por los fundadores:"
                        : "Founder-level evaluation confidentiality:"}
                    </strong>{" "}
                    {isEs
                      ? "Durante la evaluación inicial, su briefing de producto es revisado exclusivamente por Alma y Shirish para valorar la viabilidad, los materiales y la unidad de producción adecuada en la India."
                      : "During initial evaluation, your Product Brief is reviewed strictly by Shirish and Alma to assess feasibility, material sourcing, and Manufacturing Partner fit in India."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Comunicación controlada a unidades de producción:"
                        : "Controlled disclosure to Manufacturing Partners:"}
                    </strong>{" "}
                    {isEs
                      ? "No publicamos sus diseños en directorios abiertos ni portales de subastas. Las especificaciones solo se comparten con las unidades de producción seleccionadas en la India en la medida necesaria para preparar presupuestos de muestras o producción, y firmamos un Acuerdo mutuo de Confidencialidad y No Circunvención (NDA y NNN) a petición suya antes de intercambiar fichas técnicas detalladas."
                      : "We do not broadcast your designs to public factory directories or open bidding boards. Specifications are shared only with shortlisted Indian Manufacturing Partners as needed to prepare sampling or production quotes, and we execute a formal Mutual Non-Disclosure and Non-Circumvention Agreement (NDA and NNN) upon request prior to detailed technical pack or sample exchange."}
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* Band 2: Warm Dune, Section 3 Six-Stage Pre-Agreement Scope & Section 4 Brand Ownership */}
        <section className="bg-[var(--color-dune)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container">
            <div className="mx-auto grid max-w-[56rem] gap-[var(--space-2xl)]">
              <section className="grid gap-4" id="pre-agreement-scope">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "3. Alcance precontractual frente a contratos comerciales"
                    : "3. Separation from commercial Manufacturing Programme contracts"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Las descripciones de los Programas de producción, las cuatro categorías de producto (bolsos y artículos de piel, ropa y prendas, complementos textiles y decoración textil del hogar), los controles de calidad y las seis etapas del proceso publicadas en este sitio web tienen carácter orientativo y no constituyen una oferta vinculante ni un contrato de suministro:"
                    : "Descriptions of Manufacturing Programmes, our four product categories (leather goods, clothing, textile accessories, and textile home decor), quality checks, and the six programme stages published on this website serve as general commercial orientation and do not constitute a legally binding offer or supply contract:"}
                </p>
                <ol className="m-0 grid max-w-[65ch] list-none gap-2.5 p-0 text-[length:var(--text-sm)] text-[var(--color-ink-2)] sm:grid-cols-2">
                  {SIX_PROGRAMME_STAGES.map((item) => (
                    <li key={item.stage} className="flex items-baseline gap-3">
                      <span className="num inline-flex shrink-0 rounded-[var(--radius-pill)] bg-[var(--color-paper)] px-2.5 py-0.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)]">
                        {item.stage}
                      </span>
                      <span>{item.label[language]}</span>
                    </li>
                  ))}
                </ol>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Los compromisos comerciales específicos, incluidos costes de muestreo, titularidad de patrones y moldes, precios unitarios, cantidades mínimas, límites de calidad aceptables (AQL), tolerancias, plazos de producción, hitos de pago e Incoterms de entrega (EXW, FOB, CIF o DDP), solo entran en vigor cuando se acuerdan por escrito en una Propuesta de briefing de producto y muestreo y en un Contrato marco de Programa de producción firmado entre Karmarise Global LLP y el cliente."
                    : "Specific commercial commitments, including sample fees, pattern and tooling ownership, unit pricing, minimum order quantities, acceptable quality limits (AQL), construction tolerances, production lead times, payment milestones, delivery Incoterms (EXW, FOB, CIF, or DDP), and liability caps, take effect only when agreed in a written Product Brief and Sampling Proposal and a signed Master Manufacturing Programme Agreement between Karmarise Global LLP and the Client."}
                </p>
              </section>

              <section className="grid gap-4" id="brand-ownership">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "4. Propiedad del sitio web, marcas y contenidos editoriales"
                    : "4. Website, brand, and editorial content ownership"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs ? (
                    <>
                      Salvo que se indique lo contrario, Karmarise Global LLP es
                      titular de todos los derechos sobre este sitio web, el
                      nombre y logotipo de{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        KarmaRise D Global
                      </strong>
                      , la marca de moda y estilo de vida{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        AlmaRise D Brand
                      </strong>{" "}
                      (incluidas AlmaRise D Reborn, AlmaRise D Organic y
                      AlmaRise D Home Decor), los materiales de la{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        Iniciativa de formación para mujeres
                      </strong>{" "}
                      y todas las{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        Historias
                      </strong>
                      , fotografías, vídeos y textos publicados.
                    </>
                  ) : (
                    <>
                      Unless otherwise stated, Karmarise Global LLP owns all
                      rights, title, and interest in this website, the{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        KarmaRise D Global
                      </strong>{" "}
                      name and logo, the{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        AlmaRise D Brand
                      </strong>{" "}
                      fashion and lifestyle label (including AlmaRise D Reborn,
                      AlmaRise D Organic, and AlmaRise D Home Decor), the{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        Women&apos;s Training Initiative
                      </strong>{" "}
                      programme materials, and all published editorial{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        Stories
                      </strong>
                      , photographs, video footage, and text.
                    </>
                  )}
                </p>
              </section>
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* Band 3: Warm Parchment, Section 5 Governing Law, Section 6 Contact, Cross-Links */}
        <section className="bg-[var(--color-paper)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container">
            <div className="mx-auto grid max-w-[56rem] gap-[var(--space-2xl)]">
              <section className="grid gap-4" id="governing-law">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "5. Legislación aplicable y jurisdicción"
                    : "5. Governing law and jurisdiction"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Estas Condiciones de uso se rigen por las leyes de la India, sin perjuicio de los derechos imperativos de protección de datos o normativos que correspondan a los visitantes en España y el resto de la Unión Europea en su país de residencia. Los tribunales competentes de Thane y Mumbai (Maharashtra, India) tendrán jurisdicción sobre las controversias no contractuales derivadas del sitio web, mientras que los contratos de producción se rigen por lo pactado en cada acuerdo firmado."
                    : "These Website Terms and any non-contractual dispute arising out of the use of this website are governed by and construed in accordance with the laws of India, without prejudice to mandatory data-protection or statutory rights applicable to visitors in Spain and the rest of the European Union. The competent courts in Thane and Mumbai, Maharashtra, India shall have jurisdiction over website disputes, while active Manufacturing Programmes are governed by the signed agreement."}
                </p>
              </section>

              <section className="grid gap-4" id="contact">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "6. Contacto para cuestiones legales y contractuales"
                    : "6. Contact for legal, contractual, and billing questions"}
                </h2>
                <dl className="m-0 grid gap-3 text-[length:var(--text-sm)]">
                  <div className="grid gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                    <dt className="font-semibold text-[var(--color-forest-deep)] sm:col-span-5">
                      {isEs ? "Legal y soporte" : "Legal and support"}
                    </dt>
                    <dd className="m-0 sm:col-span-7">
                      <a
                        className="inline-flex min-h-[var(--tap-min)] items-center [overflow-wrap:anywhere] text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href="mailto:support@karmarisedglobal.com"
                      >
                        <bdi dir="ltr">support@karmarisedglobal.com</bdi>
                      </a>
                    </dd>
                  </div>

                  <div className="grid gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                    <dt className="font-semibold text-[var(--color-forest-deep)] sm:col-span-5">
                      {isEs
                        ? "Consultas de clientes y contratos"
                        : "Client and contract enquiries"}
                    </dt>
                    <dd className="m-0 flex flex-wrap items-center gap-x-5 gap-y-1 sm:col-span-7">
                      <a
                        className="inline-flex min-h-[var(--tap-min)] items-center [overflow-wrap:anywhere] text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href="mailto:hola@karmarisedglobal.com"
                      >
                        <bdi dir="ltr">hola@karmarisedglobal.com</bdi>
                      </a>
                      <a
                        className="inline-flex min-h-[var(--tap-min)] items-center [overflow-wrap:anywhere] text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href="mailto:inquiry@karmarisedglobal.com"
                      >
                        <bdi dir="ltr">inquiry@karmarisedglobal.com</bdi>
                      </a>
                    </dd>
                  </div>

                  <div className="grid gap-1 sm:grid-cols-12 sm:items-center sm:gap-4">
                    <dt className="font-semibold text-[var(--color-forest-deep)] sm:col-span-5">
                      {isEs
                        ? "Contabilidad, facturación y GST"
                        : "Accounts, billing, and GST documentation"}
                    </dt>
                    <dd className="m-0 sm:col-span-7">
                      <a
                        className="inline-flex min-h-[var(--tap-min)] items-center [overflow-wrap:anywhere] text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href="mailto:accounts@karmarisedglobal.com"
                      >
                        <bdi dir="ltr">accounts@karmarisedglobal.com</bdi>
                      </a>
                    </dd>
                  </div>

                  <div className="grid gap-1 sm:grid-cols-12 sm:items-baseline sm:gap-4">
                    <dt className="font-semibold text-[var(--color-forest-deep)] sm:col-span-5">
                      {isEs ? "Domicilio social" : "Registered office"}
                    </dt>
                    <dd className="m-0 sm:col-span-7">
                      <address className="m-0 text-[var(--color-muted)] not-italic">
                        Karmarise Global LLP, {LEGAL_REGISTERED_OFFICE}
                      </address>
                    </dd>
                  </div>
                </dl>
              </section>

              <nav
                aria-label={
                  isEs ? "Otros documentos legales" : "Related legal pages"
                }
                className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[length:var(--text-sm)]"
              >
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/legal-notice")}
                >
                  <span>{isEs ? "Ver aviso legal" : "View legal notice"}</span>
                  <ArrowIcon />
                </Link>
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                  href={localizeHref("/privacy-policy")}
                >
                  <span>
                    {isEs
                      ? "Ver política de privacidad"
                      : "View privacy policy"}
                  </span>
                  <ArrowIcon />
                </Link>
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                  href={localizeHref("/cookie-policy")}
                >
                  <span>
                    {isEs ? "Ver política de cookies" : "View cookie policy"}
                  </span>
                  <ArrowIcon />
                </Link>
              </nav>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="night" size="gentle" />
      </main>

      <SiteFooter hideNewsletter />
    </>
  );
}
