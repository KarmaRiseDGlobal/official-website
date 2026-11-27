import Link from "next/link";

import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import {
  LEGAL_DATES,
  LEGAL_NAV_LINKS,
  LEGAL_REGISTERED_OFFICE,
  OFFICIAL_EMAIL_GROUPS,
} from "@/data/legal-content";
import { OFFICIAL_SOCIALS } from "@/data/socials";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const legalNavLinks = LEGAL_NAV_LINKS.map((item) => ({
  ...item,
  current: item.href === "/legal-notice",
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

interface EntityFactRow {
  readonly id: string;
  readonly label: Record<SiteLanguage, string>;
  readonly type: "text" | "code" | "date" | "address";
  readonly value: Record<SiteLanguage, string>;
}

const ENTITY_FACT_ROWS: readonly EntityFactRow[] = [
  {
    id: "legal-name",
    label: { en: "Registered legal name", es: "Denominación social" },
    type: "text",
    value: { en: "Karmarise Global LLP", es: "Karmarise Global LLP" },
  },
  {
    id: "domain",
    label: { en: "Official website domain", es: "Dominio web oficial" },
    type: "code",
    value: { en: "karmarisedglobal.com", es: "karmarisedglobal.com" },
  },
  {
    id: "brands",
    label: {
      en: "Commercial and public brands",
      es: "Marcas comerciales y públicas",
    },
    type: "text",
    value: {
      en: "KarmaRise D Global (Manufacturing Programmes) · AlmaRise D Brand (Fashion and lifestyle brand: AlmaRise D Reborn, AlmaRise D Organic, AlmaRise D Home Decor)",
      es: "KarmaRise D Global (Programas de producción) · AlmaRise D Brand (Marca de moda y estilo de vida: AlmaRise D Reborn, AlmaRise D Organic, AlmaRise D Home Decor)",
    },
  },
  {
    id: "registry",
    label: { en: "Legal form and registry", es: "Forma jurídica y registro" },
    type: "text",
    value: {
      en: "Limited Liability Partnership registered with the Registrar of Companies, Mumbai (Ministry of Corporate Affairs, Government of India)",
      es: "Limited Liability Partnership inscrita ante el Registrar of Companies, Mumbai (Ministerio de Asuntos Corporativos, Gobierno de la India)",
    },
  },
  {
    id: "llpin",
    label: {
      en: "LLP Identification Number (LLPIN)",
      es: "Número de identificación LLP (LLPIN)",
    },
    type: "code",
    value: { en: "ACO-3878", es: "ACO-3878" },
  },
  {
    id: "incorporation",
    label: { en: "Date of incorporation", es: "Fecha de constitución" },
    type: "date",
    value: {
      en: LEGAL_DATES.effective.en,
      es: LEGAL_DATES.effective.es,
    },
  },
  {
    id: "gstin",
    label: {
      en: "Goods and Services Tax ID (GSTIN)",
      es: "Identificación fiscal GST (GSTIN)",
    },
    type: "code",
    value: { en: "27ABDFK8128R1ZL", es: "27ABDFK8128R1ZL" },
  },
  {
    id: "registered-office",
    label: {
      en: "Registered office and principal place of business",
      es: "Domicilio social y sede principal",
    },
    type: "address",
    value: {
      en: LEGAL_REGISTERED_OFFICE,
      es: LEGAL_REGISTERED_OFFICE,
    },
  },
];

const OFFICIAL_SOCIAL_DIRECTORY: ReadonlyArray<{
  readonly id: string;
  readonly href: string;
  readonly label: Record<SiteLanguage, string>;
  readonly note: Record<SiteLanguage, string>;
}> = [
  {
    id: "karmarise-linkedin",
    href: OFFICIAL_SOCIALS.karmariseLinkedIn,
    label: {
      en: "KarmaRise D Global on LinkedIn",
      es: "KarmaRise D Global en LinkedIn",
    },
    note: {
      en: "Company updates and B2B manufacturing notes",
      es: "Actualizaciones corporativas y notas de producción B2B",
    },
  },
  {
    id: "karmarise-instagram",
    href: OFFICIAL_SOCIALS.karmariseInstagram,
    label: {
      en: "KarmaRise D Global on Instagram",
      es: "KarmaRise D Global en Instagram",
    },
    note: {
      en: "Materials, samples, and studio work in India",
      es: "Materiales, muestras y trabajo sobre el terreno en la India",
    },
  },
  {
    id: "almarise-instagram",
    href: OFFICIAL_SOCIALS.almariseInstagram,
    label: {
      en: "AlmaRise D Brand on Instagram",
      es: "AlmaRise D Brand en Instagram",
    },
    note: {
      en: "AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor",
      es: "AlmaRise D Reborn, AlmaRise D Organic y AlmaRise D Home Decor",
    },
  },
  {
    id: "alma-linkedin",
    href: OFFICIAL_SOCIALS.almaLinkedIn,
    label: {
      en: "Alma on LinkedIn",
      es: "Alma en LinkedIn",
    },
    note: {
      en: "Co-Founder and European Client operations",
      es: "Cofundadora y operaciones con clientes en España y el resto de Europa",
    },
  },
  {
    id: "shirish-linkedin",
    href: OFFICIAL_SOCIALS.shirishLinkedIn,
    label: {
      en: "Shirish on LinkedIn",
      es: "Shirish en LinkedIn",
    },
    note: {
      en: "Designated Partner, Bar Council advocate, and India operations",
      es: "Socio director, abogado colegiado en el Bar Council y operaciones en la India",
    },
  },
];

function renderFactValue(row: EntityFactRow, language: SiteLanguage) {
  const text = row.value[language];
  if (row.type === "code") {
    return (
      <span className="num font-semibold text-[var(--color-forest-deep)]">
        <bdi dir="ltr">{text}</bdi>
      </span>
    );
  }
  if (row.type === "date") {
    return <span className="num text-[var(--color-ink-2)]">{text}</span>;
  }
  if (row.type === "address") {
    return (
      <address className="m-0 text-[var(--color-ink-2)] not-italic">
        {text}
      </address>
    );
  }
  if (row.id === "legal-name") {
    return (
      <span className="font-semibold text-[var(--color-forest-deep)]">
        {text}
      </span>
    );
  }
  return <span className="text-[var(--color-ink-2)]">{text}</span>;
}

export function LegalNoticePageClient({
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
        {/* Band 1: Warm Parchment, Header, Document Nav, and Section 1 Statutory Table */}
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
                      {isEs ? "Aviso legal" : "Legal notice"}
                    </li>
                  </ol>
                </nav>

                <h1 className="max-w-[22ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                  {isEs
                    ? "Aviso legal y datos societarios"
                    : "Corporate and legal notice"}
                </h1>

                <p className="lead max-w-[65ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Datos registrales e identificación legal publicados en cumplimiento de la Ley de Sociedades de Responsabilidad Limitada de la India de 2008 (LLP Act), la Ley de Tecnologías de la Información de la India de 2000 y el artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE) de España."
                    : "Statutory identification and registration disclosures published in compliance with the Indian Limited Liability Partnership Act, 2008, the Indian Information Technology Act, 2000, and Article 10 of Spain's Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE)."}
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

              <section className="grid gap-5" id="entity-registration">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "1. Datos de la entidad jurídica registrada"
                    : "1. Registered legal entity details"}
                </h2>

                {/* Desktop & Tablet Structured LLP Fact Table */}
                <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] md:block">
                  <table className="w-full border-collapse text-start text-[length:var(--text-sm)]">
                    <caption className="sr-only">
                      {isEs
                        ? "Datos registrales y fiscales de Karmarise Global LLP"
                        : "Statutory registration and tax details for Karmarise Global LLP"}
                    </caption>
                    <tbody className="divide-y divide-[var(--color-rule)]">
                      {ENTITY_FACT_ROWS.map((row) => (
                        <tr key={row.id}>
                          <th
                            scope="row"
                            className="w-[34%] bg-[var(--color-paper)]/75 px-5 py-4 text-start align-top font-semibold text-[var(--color-forest-deep)]"
                          >
                            {row.label[language]}
                          </th>
                          <td className="px-5 py-4 align-top leading-[1.6]">
                            <span className="block max-w-[58ch]">
                              {renderFactValue(row, language)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked Definition List */}
                <dl className="m-0 grid divide-y divide-[var(--color-rule)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] md:hidden">
                  {ENTITY_FACT_ROWS.map((row) => (
                    <div key={row.id} className="grid gap-1.5 px-4 py-4">
                      <dt className="text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-forest-deep)] uppercase">
                        {row.label[language]}
                      </dt>
                      <dd className="m-0 text-[length:var(--text-sm)] leading-[1.6]">
                        {renderFactValue(row, language)}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* Band 2: Warm Dune, Section 2 Governance and Operational Structure */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]"
          id="governance-and-operations"
        >
          <div className="container">
            <div className="mx-auto grid max-w-[56rem] gap-[var(--space-xl)]">
              <div className="grid gap-4">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "2. Dirección, representación y estructura operativa"
                    : "2. Management, representation, and operational structure"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-ink-2)]">
                  {isEs ? (
                    <>
                      Todos los acuerdos comerciales, Programas de producción,
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
                      sampling proposals, and invoices are issued and executed
                      by{" "}
                      <strong className="text-[var(--color-forest-deep)]">
                        Karmarise Global LLP
                      </strong>{" "}
                      as the sole legal contracting entity:
                    </>
                  )}
                </p>
              </div>

              <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2">
                <article className="grid content-start gap-3">
                  <h3 className="text-[length:var(--text-title)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                    {isEs
                      ? "Shirish · Socio director y responsable de reclamaciones"
                      : "Shirish · Designated Partner and Grievance Officer"}
                  </h3>
                  <p className="text-[length:var(--text-xs)] font-semibold text-[var(--color-clay-ink)]">
                    {isEs
                      ? "India · Representación legal y supervisión en producción"
                      : "India · Legal representation and on-site production"}
                  </p>
                  <p className="max-w-[54ch] text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    {isEs
                      ? "Abogado colegiado en el Bar Council de la India. Supervisa el cumplimiento societario de Karmarise Global LLP, los contratos escritos bajo legislación india, la verificación presencial de unidades de producción, las revisiones de muestras, la supervisión presencial en planta y las inspecciones previas al envío."
                      : "Registered Bar Council advocate in India. Oversees statutory governance of Karmarise Global LLP, enforceable Indian supplier contracts, in-person Manufacturing Partner verification, sampling reviews, on-site production supervision, and pre-shipment inspections across India."}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 text-[length:var(--text-sm)] text-[var(--color-ink-2)]">
                    <span>{isEs ? "Teléfono:" : "Phone:"}</span>
                    <a
                      className="num inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                      href="tel:+918530009798"
                    >
                      <bdi dir="ltr">+91 8530009798</bdi>
                    </a>
                  </div>
                </article>

                <article className="grid content-start gap-3">
                  <h3 className="text-[length:var(--text-title)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                    {isEs
                      ? "Alma · Cofundadora y operaciones con clientes europeos"
                      : "Alma · Co-Founder and European Client Operations"}
                  </h3>
                  <p className="text-[length:var(--text-xs)] font-semibold text-[var(--color-clay-ink)]">
                    {isEs
                      ? "España y el resto de Europa · Operaciones con clientes"
                      : "Spain and the rest of Europe · Client operations"}
                  </p>
                  <p className="max-w-[54ch] text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    {isEs
                      ? "Dirige la relación con clientes en España y el resto de Europa, la recepción de briefings de producto, las consultas comerciales y la coordinación de proyectos entre España y la India en español, inglés y portugués."
                      : "Leads Client relations across Spain and the rest of Europe, Product Brief intake, commercial consultations, and project coordination between Spain and India in Spanish, English, and Portuguese."}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 text-[length:var(--text-sm)] text-[var(--color-ink-2)]">
                    <span>{isEs ? "Teléfono:" : "Phone:"}</span>
                    <a
                      className="num inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                      href="tel:+34611722276"
                    >
                      <bdi dir="ltr">+34 611 722 276</bdi>
                    </a>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* Band 3: Warm Parchment, Section 3 Email Directory, Section 4 Official Socials, and Cross-Links */}
        <section className="bg-[var(--color-paper)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container">
            <div className="mx-auto grid max-w-[56rem] gap-[var(--space-2xl)]">
              <section className="grid gap-6" id="official-emails">
                <div className="grid gap-4">
                  <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                    {isEs
                      ? "3. Directorio de correos oficiales"
                      : "3. Official email directory"}
                  </h2>
                  <p className="max-w-[65ch] text-[var(--color-muted)]">
                    {isEs ? (
                      <>
                        Todas las comunicaciones electrónicas oficiales de
                        Karmarise Global LLP proceden exclusivamente del dominio{" "}
                        <span className="font-semibold [overflow-wrap:anywhere] text-[var(--color-forest-deep)]">
                          <bdi dir="ltr">@karmarisedglobal.com</bdi>
                        </span>
                        . A continuación figuran los buzones autorizados,
                        agrupados por área:
                      </>
                    ) : (
                      <>
                        All official electronic communications from Karmarise
                        Global LLP originate exclusively from the{" "}
                        <span className="font-semibold [overflow-wrap:anywhere] text-[var(--color-forest-deep)]">
                          <bdi dir="ltr">@karmarisedglobal.com</bdi>
                        </span>{" "}
                        domain. Authorized mailboxes are grouped by function
                        below:
                      </>
                    )}
                  </p>
                </div>

                <div className="grid gap-[var(--space-xl)]">
                  {OFFICIAL_EMAIL_GROUPS.map((group) => (
                    <div key={group.id} className="grid gap-3">
                      <h3 className="text-[length:var(--text-title)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                        {group.heading[language]}
                      </h3>
                      <dl className="m-0 grid gap-2 text-[length:var(--text-sm)]">
                        {group.items.map((item) => (
                          <div
                            key={item.email}
                            className="grid gap-1 sm:grid-cols-12 sm:items-center sm:gap-4"
                          >
                            <dt className="font-semibold text-[var(--color-forest-deep)] sm:col-span-5">
                              <a
                                className="inline-flex min-h-[var(--tap-min)] items-center [overflow-wrap:anywhere] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                                href={`mailto:${item.email}`}
                              >
                                <bdi dir="ltr">{item.email}</bdi>
                              </a>
                            </dt>
                            <dd className="m-0 text-[var(--color-muted)] sm:col-span-7">
                              {item.department[language]}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  ))}
                </div>
              </section>

              <section className="grid gap-4" id="official-socials">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "4. Canales sociales oficiales"
                    : "4. Official social channels"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Karmarise Global LLP únicamente mantiene presencia oficial en los perfiles verificados de LinkedIn e Instagram indicados a continuación. Ninguna otra cuenta en redes sociales está autorizada para actuar en nombre de KarmaRise D Global o AlmaRise D Brand."
                    : "Karmarise Global LLP maintains official public profiles strictly on the verified LinkedIn and Instagram channels listed below. No other social media account is authorized to represent KarmaRise D Global or AlmaRise D Brand."}
                </p>
                <ul className="m-0 grid list-none gap-2 p-0 text-[length:var(--text-sm)]">
                  {OFFICIAL_SOCIAL_DIRECTORY.map((profile) => (
                    <li
                      key={profile.id}
                      className="grid gap-0.5 sm:grid-cols-12 sm:items-center sm:gap-4"
                    >
                      <div className="sm:col-span-5">
                        <a
                          href={profile.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                        >
                          <span>{profile.label[language]}</span>
                          <ArrowIcon />
                          <span className="sr-only">
                            {isEs
                              ? " (se abre en una pestaña nueva)"
                              : " (opens in a new tab)"}
                          </span>
                        </a>
                      </div>
                      <p className="m-0 text-[var(--color-muted)] sm:col-span-7">
                        {profile.note[language]}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>

              <nav
                aria-label={
                  isEs ? "Otros documentos legales" : "Related legal pages"
                }
                className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[length:var(--text-sm)]"
              >
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/terms")}
                >
                  <span>
                    {isEs ? "Ver condiciones de uso" : "View website terms"}
                  </span>
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
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                  href={localizeHref("/contact")}
                >
                  <span>{isEs ? "Ir a contacto" : "Go to contact page"}</span>
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
