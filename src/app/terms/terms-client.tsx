"use client";

import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";

const legalNavLinks: ReadonlyArray<{
  href: string;
  label: Record<SiteLanguage, string>;
  current: boolean;
}> = [
  {
    href: "/privacy-policy",
    label: { en: "Privacy policy", es: "Política de privacidad" },
    current: false,
  },
  {
    href: "/terms",
    label: { en: "Website terms", es: "Condiciones de uso" },
    current: true,
  },
  {
    href: "/cookie-policy",
    label: { en: "Cookie policy", es: "Política de cookies" },
    current: false,
  },
  {
    href: "/legal-notice",
    label: { en: "Legal notice", es: "Aviso legal" },
    current: false,
  },
];

export function TermsPageClient() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid max-w-[76ch] gap-[var(--space-2xl)]">
            <div className="grid gap-5">
              <p className="section-index">
                {isEs
                  ? "Condiciones de uso y propiedad intelectual"
                  : "Terms of use & IP notice"}
              </p>
              <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-normal">
                {isEs ? "Condiciones de uso del sitio web" : "Website terms"}
              </h1>
              <p className="lead text-[var(--color-ink-2)]">
                {isEs
                  ? "Estas Condiciones regulan el acceso y uso del sitio web de KarmaRise D Global, el envío precontractual de Product Briefs y los activos de marca operados por Karmarise Global LLP."
                  : "These Website Terms govern access to and use of the KarmaRise D Global website, pre-agreement Product Brief submissions, and brand assets operated by Karmarise Global LLP."}
              </p>
              <p className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                {isEs
                  ? "Fecha de entrada en vigor: 15 de mayo de 2025 · Última actualización: 17 de noviembre de 2026"
                  : "Effective date: 15 May 2025 · Last updated: 17 November 2026"}
              </p>

              <nav
                aria-label={isEs ? "Documentos legales" : "Legal documents"}
                className="flex flex-wrap gap-2 border-y border-[var(--color-rule)] py-4"
              >
                {legalNavLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={localizeHref(item.href)}
                    aria-current={item.current ? "page" : undefined}
                    className={
                      item.current
                        ? "rounded-full bg-[var(--color-forest-deep)] px-4 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-paper)] no-underline"
                        : "rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-1.5 text-[length:var(--text-xs)] font-medium text-[var(--color-forest-deep)] no-underline hover:border-[var(--color-forest-deep)]"
                    }
                  >
                    {item.label[language]}
                  </Link>
                ))}
              </nav>
            </div>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="operator"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "1. Entidad titular y ámbito societario"
                  : "1. Legal operator and entity scope"}
              </h2>
              <p className="text-[var(--color-muted)]">
                {isEs ? (
                  <>
                    Este sitio web es titularidad y está operado por{" "}
                    <strong className="text-[var(--color-forest-deep)]">
                      Karmarise Global LLP
                    </strong>{" "}
                    (LLPIN: <code>ACO-3878</code> · GSTIN:{" "}
                    <code>27ABDFK8128R1ZL</code>), una Limited Liability
                    Partnership constituida conforme a las leyes de la India el
                    15 de mayo de 2025 con domicilio social en 2nd floor, Guru
                    Charan Apartment, Ulhasnagar, Maharashtra, India, 421002.{" "}
                    <strong className="text-[var(--color-forest-deep)]">
                      KarmaRise D Global
                    </strong>{" "}
                    es la marca comercial principal de Karmarise Global LLP y{" "}
                    <strong className="text-[var(--color-forest-deep)]">
                      Almarise
                    </strong>{" "}
                    es una marca de moda propiedad de Karmarise Global LLP. La
                    información registral completa figura en nuestro{" "}
                    <Link
                      className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
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
                    (LLPIN: <code>ACO-3878</code> · GSTIN:{" "}
                    <code>27ABDFK8128R1ZL</code>), a Limited Liability
                    Partnership incorporated under the laws of India on 15 May
                    2025 with its registered office at 2nd floor, Guru Charan
                    Apartment, Ulhasnagar, Maharashtra, India, 421002.{" "}
                    <strong className="text-[var(--color-forest-deep)]">
                      KarmaRise D Global
                    </strong>{" "}
                    is the primary commercial brand of Karmarise Global LLP, and{" "}
                    <strong className="text-[var(--color-forest-deep)]">
                      Almarise
                    </strong>{" "}
                    is a fashion brand owned by Karmarise Global LLP. Full
                    statutory registration disclosures are published on our{" "}
                    <Link
                      className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                      href={localizeHref("/legal-notice")}
                    >
                      Legal notice
                    </Link>{" "}
                    page.
                  </>
                )}
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="confidentiality"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "2. Propiedad intelectual del cliente y confidencialidad del Product Brief"
                  : "2. Client intellectual property and Product Brief confidentiality"}
              </h2>
              <p className="text-[var(--color-muted)]">
                {isEs ? (
                  <>
                    Sabemos que las cadenas comerciales, tiendas independientes
                    y marcas de moda comparten ideas de producto propias al
                    iniciar un Product Brief. Cuando envías bocetos, fichas
                    técnicas, medidas, fotografías de muestras, especificaciones
                    de materiales o planes comerciales a través de{" "}
                    <Link
                      className="underline decoration-[var(--color-clay)] underline-offset-4"
                      href={localizeHref("/product-brief")}
                    >
                      /product-brief
                    </Link>{" "}
                    o a cualquier correo oficial{" "}
                    <code>@karmarisedglobal.com</code>:
                  </>
                ) : (
                  <>
                    We recognize that retail chains, independent retailers, and
                    fashion brands share proprietary product ideas when
                    initiating a Product Brief. When you submit sketches,
                    technical packs, measurements, sample photographs, material
                    specifications, or commercial plans through{" "}
                    <Link
                      className="underline decoration-[var(--color-clay)] underline-offset-4"
                      href={localizeHref("/product-brief")}
                    >
                      /product-brief
                    </Link>{" "}
                    or to any official <code>@karmarisedglobal.com</code> email
                    address:
                  </>
                )}
              </p>
              <ul className="m-0 grid gap-3 pl-5 text-[var(--color-muted)]">
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    {isEs
                      ? "Titularidad exclusiva del cliente:"
                      : "Client ownership preserved:"}
                  </strong>{" "}
                  {isEs
                    ? "Todos los diseños previos, marcas, bocetos, patrones y especificaciones enviados por un cliente pertenecen única y exclusivamente a dicho cliente. El envío de un Product Brief no otorga a Karmarise Global LLP licencia alguna para comercializar tus diseños para terceros."
                    : "All pre-existing designs, trademarks, sketches, patterns, and product specifications submitted by a prospective Client remain the sole and exclusive intellectual property of that Client. Submitting a Product Brief does not grant Karmarise Global LLP any license to commercialize your designs for third parties."}
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    {isEs
                      ? "Evaluación directa por los fundadores:"
                      : "Founder-level evaluation confidentiality:"}
                  </strong>{" "}
                  {isEs
                    ? "Durante la evaluación inicial, tu Product Brief es revisado exclusivamente por Alma y Shirish para valorar la viabilidad, los materiales y el taller adecuado."
                    : "During initial evaluation, your Product Brief is reviewed strictly by Shirish and Alma to assess feasibility, material sourcing, and Manufacturing Partner fit."}
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    {isEs
                      ? "Comunicación controlada a talleres:"
                      : "Controlled disclosure to Manufacturing Partners:"}
                  </strong>{" "}
                  {isEs
                    ? "No publicamos tus diseños en directorios abiertos ni portales de subastas. Las especificaciones solo se comparten con los talleres seleccionados en la India en la medida necesaria para preparar presupuestos de muestras o producción, y firmamos un Acuerdo de Confidencialidad y No Circunvención (NDA) mutuo a petición del cliente antes de intercambiar fichas técnicas detalladas."
                    : "We do not broadcast your designs to public factory directories or open bidding boards. Specifications are shared only with shortlisted Indian Manufacturing Partners as needed to prepare sampling or production quotes, and we execute a formal Mutual Non-Disclosure & Non-Circumvention Agreement (NDA) upon request prior to detailed technical pack or sample exchange."}
                </li>
              </ul>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="pre-agreement-scope"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "3. Alcance precontractual frente a contratos comerciales"
                  : "3. Separation from commercial Manufacturing Programme contracts"}
              </h2>
              <p className="text-[var(--color-muted)]">
                {isEs
                  ? "Las descripciones de los Programas de fabricación, las cuatro fases del proceso (aprobación del diseño, aprobación de la muestra, producción e inspección/envío), las categorías de producto y los controles de calidad en este sitio web tienen carácter informativo y no constituyen una oferta vinculante ni un contrato de suministro."
                  : "Descriptions of Manufacturing Programmes, the four programme phases (Design approval, Sample approval, Production, and Shipping), product categories, and quality checks on this website serve as general commercial orientation and do not constitute a legally binding offer or supply contract."}
              </p>
              <p className="text-[var(--color-muted)]">
                {isEs
                  ? "Los compromisos comerciales específicos, incluidos costes de muestreo, titularidad de patrones y moldes, precios unitarios, cantidades mínimas, límites de calidad aceptables (AQL), tolerancias, plazos de producción, hitos de pago e Incoterms de entrega (EXW, FOB o DDP), solo entran en vigor cuando se acuerdan por escrito en una Propuesta de Product Brief y Muestreo y en un Contrato Marco de Programa de Fabricación firmado entre Karmarise Global LLP y el cliente."
                  : "Specific commercial commitments, including sample fees, pattern and tooling ownership, unit pricing, minimum order quantities, acceptable quality limits (AQL), construction tolerances, production lead times, payment milestones, delivery Incoterms (EXW, FOB, or DDP), and liability caps, take effect only when agreed in a written Product Brief & Sampling Proposal and a signed Master Manufacturing Programme Agreement between Karmarise Global LLP and the Client."}
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="brand-ownership"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "4. Propiedad del sitio web, marcas y contenidos editoriales"
                  : "4. Website, brand, and editorial content ownership"}
              </h2>
              <p className="text-[var(--color-muted)]">
                {isEs ? (
                  <>
                    Salvo que se indique lo contrario, Karmarise Global LLP es
                    titular de todos los derechos sobre este sitio web, el
                    nombre y logotipo de <strong>KarmaRise D Global</strong>, la
                    marca de moda <strong>Almarise</strong>, los materiales de
                    la <strong>Iniciativa de formación para mujeres</strong> y
                    todas las <strong>Historias</strong>, fotografías, vídeos y
                    textos publicados.
                  </>
                ) : (
                  <>
                    Unless otherwise stated, Karmarise Global LLP owns all
                    rights, title, and interest in this website, the{" "}
                    <strong>KarmaRise D Global</strong> name and logo, the{" "}
                    <strong>Almarise</strong> fashion brand, the{" "}
                    <strong>Women&apos;s Training Initiative</strong> programme
                    materials, and all published editorial{" "}
                    <strong>Stories</strong>, photographs, video footage, and
                    text.
                  </>
                )}
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="governing-law"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "5. Legislación aplicable y jurisdicción"
                  : "5. Governing law and jurisdiction"}
              </h2>
              <p className="text-[var(--color-muted)]">
                {isEs
                  ? "Estas Condiciones de uso se rigen por las leyes de la India, sin perjuicio de los derechos imperativos de protección de datos o normativos que correspondan a los visitantes de España y la Unión Europea en su país de residencia. Los tribunales competentes de Thane y Mumbai (Maharashtra, India) tendrán jurisdicción sobre las controversias no contractuales derivadas del sitio web, mientras que los contratos de fabricación se rigen por lo pactado en cada acuerdo firmado."
                  : "These Website Terms and any non-contractual dispute arising out of the use of this website are governed by and construed in accordance with the laws of India, without prejudice to mandatory data-protection or statutory rights applicable to visitors in Spain and the European Union. The competent courts in Thane and Mumbai, Maharashtra, India shall have jurisdiction over website disputes, while active Manufacturing Programmes are governed by the signed agreement."}
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="contact"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "6. Contacto para cuestiones legales y contractuales"
                  : "6. Contact for legal, contractual, and billing questions"}
              </h2>
              <ul className="m-0 grid gap-2 pl-5 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    {isEs ? "Legal y soporte:" : "Legal & support:"}
                  </strong>{" "}
                  <a
                    className="underline decoration-[var(--color-clay)] underline-offset-4"
                    href="mailto:support@karmarisedglobal.com"
                  >
                    support@karmarisedglobal.com
                  </a>
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    {isEs
                      ? "Consultas de clientes y contratos:"
                      : "Client & contract enquiries:"}
                  </strong>{" "}
                  <a
                    className="underline decoration-[var(--color-clay)] underline-offset-4"
                    href="mailto:hola@karmarisedglobal.com"
                  >
                    hola@karmarisedglobal.com
                  </a>{" "}
                  /{" "}
                  <a
                    className="underline decoration-[var(--color-clay)] underline-offset-4"
                    href="mailto:inquiry@karmarisedglobal.com"
                  >
                    inquiry@karmarisedglobal.com
                  </a>
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    {isEs
                      ? "Contabilidad, facturación y GST:"
                      : "Accounts, billing & GST documentation:"}
                  </strong>{" "}
                  <a
                    className="underline decoration-[var(--color-clay)] underline-offset-4"
                    href="mailto:accounts@karmarisedglobal.com"
                  >
                    accounts@karmarisedglobal.com
                  </a>
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    {isEs ? "Domicilio social:" : "Registered office:"}
                  </strong>{" "}
                  Karmarise Global LLP, 2nd floor, Guru Charan Apartment,
                  Ulhasnagar, Maharashtra, India, 421002
                </li>
              </ul>
            </section>

            <div className="flex flex-wrap gap-6 border-t border-[var(--color-rule)] pt-6">
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/legal-notice")}
              >
                {isEs ? "Ver Aviso legal" : "View Corporate & Legal Notice"}
              </Link>
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/privacy-policy")}
              >
                {isEs ? "Ver Política de privacidad" : "View Privacy Policy"}
              </Link>
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/cookie-policy")}
              >
                {isEs ? "Ver Política de cookies" : "View Cookie Policy"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
