"use client";

import Link from "next/link";

import { SectionBridge } from "@/components/section-bridge";
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
    current: false,
  },
  {
    href: "/cookie-policy",
    label: { en: "Cookie policy", es: "Política de cookies" },
    current: false,
  },
  {
    href: "/legal-notice",
    label: { en: "Legal notice", es: "Aviso legal" },
    current: true,
  },
];

const officialEmails: ReadonlyArray<{
  email: string;
  department: Record<SiteLanguage, string>;
}> = [
  {
    email: "hola@karmarisedglobal.com",
    department: {
      en: "Spain, Europe & international Client intake (Spanish & English)",
      es: "Atención a clientes en España, Europa e internacional (español e inglés)",
    },
  },
  {
    email: "namaste@karmarisedglobal.com",
    department: {
      en: "India Client & general commercial intake",
      es: "Atención comercial general y clientes en la India",
    },
  },
  {
    email: "inquiry@karmarisedglobal.com",
    department: {
      en: "Product Brief & new Manufacturing Programme enquiries",
      es: "Consultas de Product Brief y nuevos Programas de fabricación",
    },
  },
  {
    email: "partners@karmarisedglobal.com",
    department: {
      en: "Manufacturing Partners, workshops & artisans in India",
      es: "Socios de fabricación, talleres y artesanos en la India",
    },
  },
  {
    email: "stories@karmarisedglobal.com",
    department: {
      en: "Editorial Stories, press, media & Almarise enquiries",
      es: "Historias editoriales, prensa, medios y consultas sobre Almarise",
    },
  },
  {
    email: "support@karmarisedglobal.com",
    department: {
      en: "Client support, data protection & Statutory Grievance Officer",
      es: "Soporte a clientes, protección de datos y responsable de reclamaciones",
    },
  },
  {
    email: "accounts@karmarisedglobal.com",
    department: {
      en: "Billing, invoicing, export paperwork & GST documentation",
      es: "Facturación, documentación de exportación y gestión GST",
    },
  },
  {
    email: "alma@karmarisedglobal.com",
    department: {
      en: "Alma · Co-Founder & European Client Operations (Spain & India)",
      es: "Alma · Cofundadora y operaciones con clientes europeos (España e India)",
    },
  },
  {
    email: "shirish@karmarisedglobal.com",
    department: {
      en: "Shirish · Designated Partner & India Operations",
      es: "Shirish · Socio director y operaciones en la India",
    },
  },
];

export function LegalNoticePageClient() {
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
                  ? "Información societaria · Aviso legal"
                  : "Statutory disclosures · Legal notice"}
              </p>
              <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-normal">
                {isEs
                  ? "Aviso legal y datos societarios"
                  : "Corporate & legal notice"}
              </h1>
              <p className="lead text-[var(--color-ink-2)]">
                {isEs
                  ? "Datos registrales e identificación legal publicados en cumplimiento de la Ley de Sociedades de Responsabilidad Limitada de la India de 2008 (LLP Act), la Ley de Tecnologías de la Información de la India de 2000 y el artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE) de España."
                  : "Statutory identification and registration disclosures published in compliance with the Indian Limited Liability Partnership Act, 2008, the Indian Information Technology Act, 2000, and Article 10 of Spain's Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE)."}
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
              id="entity-registration"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "1. Datos de la entidad jurídica registrada"
                  : "1. Registered legal entity details"}
              </h2>
              <dl className="m-0 grid gap-4 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)] sm:grid-cols-2">
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    {isEs ? "Denominación social" : "Registered legal name"}
                  </dt>
                  <dd className="m-0 mt-1 font-semibold text-[var(--color-forest-deep)]">
                    Karmarise Global LLP
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    {isEs
                      ? "Marcas comerciales y públicas"
                      : "Commercial & public brands"}
                  </dt>
                  <dd className="m-0 mt-1 text-[var(--color-muted)]">
                    {isEs
                      ? "KarmaRise D Global (Programas de fabricación) · Almarise (Marca de moda)"
                      : "KarmaRise D Global (Manufacturing Programmes) · Almarise (Fashion brand)"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    {isEs
                      ? "Forma jurídica y registro"
                      : "Legal form & registry"}
                  </dt>
                  <dd className="m-0 mt-1 text-[var(--color-muted)]">
                    {isEs
                      ? "Limited Liability Partnership (Ministerio de Asuntos Corporativos, Gobierno de la India)"
                      : "Limited Liability Partnership (Ministry of Corporate Affairs, Government of India)"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    {isEs
                      ? "Número de identificación LLP (LLPIN)"
                      : "LLP Identification Number (LLPIN)"}
                  </dt>
                  <dd className="m-0 mt-1 font-mono font-semibold text-[var(--color-forest-deep)]">
                    ACO-3878
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    {isEs ? "Fecha de constitución" : "Date of incorporation"}
                  </dt>
                  <dd className="m-0 mt-1 text-[var(--color-muted)]">
                    {isEs ? "15 de mayo de 2025" : "15 May 2025"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    {isEs
                      ? "Identificación fiscal GST (GSTIN)"
                      : "Goods & Services Tax ID (GSTIN)"}
                  </dt>
                  <dd className="m-0 mt-1 font-mono font-semibold text-[var(--color-forest-deep)]">
                    27ABDFK8128R1ZL
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    {isEs
                      ? "Domicilio social y sede principal"
                      : "Registered office & principal place of business"}
                  </dt>
                  <dd className="m-0 mt-1 text-[var(--color-muted)]">
                    2nd floor, Guru Charan Apartment, Ulhasnagar, Maharashtra,
                    India, 421002
                  </dd>
                </div>
              </dl>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="governance-and-operations"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "2. Dirección, representación y estructura operativa"
                  : "2. Management, representation, and operational structure"}
              </h2>
              <p className="text-[var(--color-muted)]">
                {isEs ? (
                  <>
                    Todos los acuerdos comerciales, Programas de fabricación,
                    propuestas de muestreo y facturas son emitidos y suscritos
                    por{" "}
                    <strong className="text-[var(--color-forest-deep)]">
                      Karmarise Global LLP
                    </strong>{" "}
                    como única entidad jurídica contratante:
                  </>
                ) : (
                  <>
                    All commercial agreements, Manufacturing Programmes,
                    sampling proposals, and invoices are issued and executed by{" "}
                    <strong className="text-[var(--color-forest-deep)]">
                      Karmarise Global LLP
                    </strong>{" "}
                    as the sole legal contracting entity:
                  </>
                )}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid content-start gap-2 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)]">
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    {isEs
                      ? "India · Representación legal y producción"
                      : "India · Legal representation & production"}
                  </p>
                  <p className="font-semibold text-[var(--color-forest-deep)]">
                    {isEs
                      ? "Shirish · Socio director y responsable de reclamaciones"
                      : "Shirish · Designated Partner & Grievance Officer"}
                  </p>
                  <p className="text-[var(--color-muted)]">
                    {isEs
                      ? "Supervisa el cumplimiento societario de Karmarise Global LLP, la verificación presencial de talleres en la India, las revisiones de muestras, el seguimiento en planta y las inspecciones previas al envío."
                      : "Oversees statutory governance of Karmarise Global LLP, in-person Manufacturing Partner verification, sampling reviews, production floor supervision, and pre-shipment inspections across India."}
                  </p>
                  <p className="pt-1 text-[var(--color-muted)]">
                    {isEs ? "Teléfono:" : "Phone:"}{" "}
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4"
                      href="tel:+918530009798"
                    >
                      +91 8530009798
                    </a>
                  </p>
                </div>

                <div className="grid content-start gap-2 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)]">
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    {isEs
                      ? "España y Europa · Operaciones con clientes"
                      : "Spain & Europe · Client operations"}
                  </p>
                  <p className="font-semibold text-[var(--color-forest-deep)]">
                    {isEs
                      ? "Alma · Cofundadora y operaciones con clientes europeos"
                      : "Alma · Co-Founder & European Client Operations"}
                  </p>
                  <p className="text-[var(--color-muted)]">
                    {isEs
                      ? "Dirige la relación con clientes en España y Europa, la recepción de Product Briefs, las consultas comerciales y la coordinación de proyectos entre España y la India en español e inglés."
                      : "Leads European Client relations, Product Brief intake, commercial consultations, and project coordination between Spain and India in Spanish and English."}
                  </p>
                  <p className="pt-1 text-[var(--color-muted)]">
                    {isEs ? "Teléfono:" : "Phone:"}{" "}
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4"
                      href="tel:+34611722276"
                    >
                      +34 611722276
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="official-emails"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "3. Directorio de correos oficiales"
                  : "3. Official email directory"}
              </h2>
              <p className="text-[var(--color-muted)]">
                {isEs ? (
                  <>
                    Todas las comunicaciones electrónicas oficiales de Karmarise
                    Global LLP proceden exclusivamente del dominio{" "}
                    <code>@karmarisedglobal.com</code>. A continuación se
                    detallan los buzones autorizados:
                  </>
                ) : (
                  <>
                    All official electronic communications from Karmarise Global
                    LLP originate exclusively from the{" "}
                    <code>@karmarisedglobal.com</code> domain. Below is the
                    directory of authorized mailboxes:
                  </>
                )}
              </p>
              <dl className="m-0 grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)]">
                {officialEmails.map((item) => (
                  <div
                    key={item.email}
                    className="grid gap-1 border-b border-[var(--color-rule)] pb-3 last:border-b-0 last:pb-0 sm:grid-cols-12 sm:items-baseline sm:gap-4"
                  >
                    <dt className="font-semibold text-[var(--color-forest-deep)] sm:col-span-5">
                      <a
                        className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href={`mailto:${item.email}`}
                      >
                        {item.email}
                      </a>
                    </dt>
                    <dd className="m-0 text-[var(--color-muted)] sm:col-span-7">
                      {item.department[language]}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="flex flex-wrap gap-6 border-t border-[var(--color-rule)] pt-6">
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/terms")}
              >
                {isEs ? "Ver Condiciones de uso" : "View Website Terms"}
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
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/contact")}
              >
                {isEs ? "Ir a Contacto" : "Go to Contact page"}
              </Link>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="night" />
      </main>

      <SiteFooter />
    </>
  );
}
