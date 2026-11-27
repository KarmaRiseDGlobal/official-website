"use client";

import Link from "next/link";
import { Fragment } from "react";

import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import {
  BROWSER_GUIDES,
  COOKIE_INVENTORY,
  LEGAL_DATES,
  LEGAL_NAV_LINKS,
} from "@/data/legal-content";
import { openCookieSettings } from "@/lib/consent";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const legalNavLinks = LEGAL_NAV_LINKS.map((item) => ({
  ...item,
  current: item.href === "/cookie-policy",
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

const COOKIE_CATEGORIES: ReadonlyArray<{
  readonly id: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
}> = [
  {
    id: "necessary",
    title: {
      en: "Strictly necessary security and preference storage",
      es: "Almacenamiento de seguridad y preferencias estrictamente necesario",
    },
    body: {
      en: "Enables core site security and functions you directly request: anti-bot verification on forms and chat, active Website Assistant sessions, remembering your English or Spanish language selection, recording your cookie choice, saving your unfinished Product Brief draft locally on your device, and keeping form details across steps inside the open tab.",
      es: "Permite garantizar la seguridad básica del sitio y las funciones que usted solicita expresamente: verificación antibots en formularios y chat, sesiones activas del asistente del sitio web, recuerdo de su preferencia de idioma entre español e inglés, registro de su elección de cookies, guardado local del borrador del briefing de producto en su dispositivo y continuidad temporal de la pestaña abierta.",
    },
  },
  {
    id: "optional-attribution",
    title: {
      en: "Optional referral and campaign attribution (consent-gated)",
      es: "Atribución opcional de referencias y campañas (sujeta a consentimiento)",
    },
    body: {
      en: "Activated only if you choose to accept optional cookies in the Cookie preferences banner. Remembers which biweekly letter or partner introduction brought you to KarmaRise D Global for up to 30 days. We do not load third-party behavioural advertising cookies or cross-site ad trackers.",
      es: "Se activa únicamente si usted acepta las cookies opcionales en el panel de preferencias de cookies. Recuerda durante un máximo de 30 días qué carta quincenal o colaborador le presentó KarmaRise D Global. No instalamos cookies de publicidad comportamental ni rastreadores publicitarios de terceros.",
    },
  },
];

export function CookiePolicyPageClient({
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
        {/* Band 1: Warm Parchment, Header, Document Nav, Section 1 What Are Cookies + Manage Preferences CTA */}
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
                      {isEs ? "Política de cookies" : "Cookie policy"}
                    </li>
                  </ol>
                </nav>

                <h1 className="max-w-[22ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                  {isEs ? "Política de cookies" : "Cookie policy"}
                </h1>

                <p className="lead max-w-[65ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "En cumplimiento del artículo 22.2 de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), el Reglamento General de Protección de Datos (RGPD) y la legislación aplicable en la India, esta página detalla qué cookies y almacenamiento del navegador utiliza KarmaRise D Global, con qué finalidad y cómo puede gestionarlos."
                    : "In compliance with Article 22.2 of Spain's Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), European Union data protection regulations, and applicable Indian law, this page explains what cookies and browser storage KarmaRise D Global uses, why they are used, and how you can manage them."}
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

              <section className="grid gap-4" id="what-are-cookies">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "1. ¿Qué son las cookies y el almacenamiento local?"
                    : "1. What are cookies and browser storage?"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Una cookie es un pequeño archivo de texto que un sitio web guarda en su ordenador, tableta o teléfono móvil al visitar determinadas páginas. Junto con el almacenamiento local estándar de su navegador, permite mantener la seguridad de los formularios, recordar su idioma preferido, conservar borradores locales solicitados por usted y respetar su consentimiento. Estos datos no dañan su dispositivo ni permiten leer archivos personales guardados en él."
                    : "A cookie is a small text file stored on your computer, tablet, or mobile device when you visit a website. Alongside standard browser storage, it keeps enquiry forms secure, remembers your chosen language, saves unfinished local drafts you enter, and records your consent decision. These entries cannot damage your device or read personal files stored on it."}
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => openCookieSettings()}
                    className="primary-button-light"
                  >
                    {isEs
                      ? "Gestionar preferencias de cookies"
                      : "Manage cookie preferences"}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* Band 2: Warm Dune, Section 2 Categories and Full AEPD/LSSI-CE Storage Inventory Table */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]"
          id="types-of-cookies"
        >
          <div className="container">
            <div className="mx-auto grid max-w-[70rem] gap-[var(--space-2xl)]">
              <div className="grid gap-5">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "2. Categorías y resumen de cookies y almacenamiento"
                    : "2. Categories and cookie and storage summary"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Este sitio web no instala cookies analíticas ni rastreadores publicitarios de terceros. A continuación figuran las dos únicas categorías utilizadas y el resumen de cada elemento:"
                    : "This website does not load third-party analytics cookies or advertising trackers. Below are the only two storage categories used and a clear summary of every item:"}
                </p>

                <div className="grid gap-[var(--gap-columns)] pt-1 sm:grid-cols-2">
                  {COOKIE_CATEGORIES.map((item) => (
                    <article
                      key={item.id}
                      className="grid content-start gap-2.5"
                    >
                      <h3 className="text-[length:var(--text-title)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                        {item.title[language]}
                      </h3>
                      <p className="max-w-[54ch] text-[length:var(--text-sm)] text-[var(--color-muted)]">
                        {item.body[language]}
                      </p>
                    </article>
                  ))}
                </div>
              </div>

              <div className="grid gap-4" id="cookie-inventory">
                <h3 className="text-[length:var(--text-title)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                  {isEs
                    ? "Resumen de cookies y almacenamiento (LSSI-CE y AEPD)"
                    : "Cookie and storage summary (LSSI-CE and AEPD)"}
                </h3>

                {/* Desktop Inventory Table */}
                <div className="hidden overflow-x-auto rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] lg:block">
                  <table className="w-full border-collapse text-start text-[length:var(--text-sm)]">
                    <caption className="sr-only">
                      {isEs
                        ? "Resumen de cookies y almacenamiento del navegador utilizados en karmarisedglobal.com"
                        : "Summary of cookies and browser storage used on karmarisedglobal.com"}
                    </caption>
                    <thead className="bg-[var(--color-paper)] text-[length:var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-forest-deep)] uppercase">
                      <tr>
                        <th
                          scope="col"
                          className="w-[21%] px-4 py-3.5 text-start font-semibold"
                        >
                          {isEs ? "Elemento" : "Item"}
                        </th>
                        <th
                          scope="col"
                          className="w-[15%] px-4 py-3.5 text-start font-semibold"
                        >
                          {isEs ? "Tipo" : "Storage type"}
                        </th>
                        <th
                          scope="col"
                          className="w-[12%] px-4 py-3.5 text-start font-semibold"
                        >
                          {isEs ? "Proveedor" : "Provider"}
                        </th>
                        <th
                          scope="col"
                          className="w-[25%] px-4 py-3.5 text-start font-semibold"
                        >
                          {isEs ? "Finalidad" : "Purpose"}
                        </th>
                        <th
                          scope="col"
                          className="w-[11%] px-4 py-3.5 text-start font-semibold"
                        >
                          {isEs ? "Duración" : "Duration"}
                        </th>
                        <th
                          scope="col"
                          className="w-[16%] px-4 py-3.5 text-start font-semibold"
                        >
                          {isEs ? "Categoría" : "Category"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-rule)]">
                      {COOKIE_INVENTORY.map((item) => (
                        <tr key={item.id}>
                          <th
                            scope="row"
                            className="px-4 py-4 text-start align-top font-semibold text-[var(--color-forest-deep)]"
                          >
                            {item.name[language]}
                          </th>
                          <td className="px-4 py-4 align-top leading-[1.55] text-[var(--color-muted)]">
                            {item.storageType[language]}
                          </td>
                          <td className="px-4 py-4 align-top leading-[1.55] text-[var(--color-ink-2)]">
                            {item.provider[language]}
                          </td>
                          <td className="px-4 py-4 align-top leading-[1.55] text-[var(--color-ink-2)]">
                            {item.purpose[language]}
                          </td>
                          <td className="num px-4 py-4 align-top leading-[1.55] text-[var(--color-muted)]">
                            {item.duration[language]}
                          </td>
                          <td className="px-4 py-4 align-top">
                            <span
                              className={
                                item.isOptional
                                  ? "inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--color-paper-2)] px-3 py-1 text-[length:var(--text-xs)] leading-snug font-semibold whitespace-nowrap text-[var(--color-clay-ink)]"
                                  : "inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--color-pale-sage)] px-3 py-1 text-[length:var(--text-xs)] leading-snug font-semibold whitespace-nowrap text-[var(--color-forest-deep)]"
                              }
                            >
                              {item.category[language]}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile & Tablet Stacked Definition List */}
                <dl className="m-0 grid divide-y divide-[var(--color-rule)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] lg:hidden">
                  {COOKIE_INVENTORY.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-2 px-4 py-4 text-[length:var(--text-sm)]"
                    >
                      <dt className="flex flex-wrap items-start justify-between gap-2">
                        <span className="font-semibold text-[var(--color-forest-deep)]">
                          {item.name[language]}
                        </span>
                        <span
                          className={
                            item.isOptional
                              ? "inline-flex shrink-0 items-center rounded-[var(--radius-pill)] bg-[var(--color-paper-2)] px-2.5 py-0.5 text-[length:var(--text-xs)] leading-snug font-semibold whitespace-nowrap text-[var(--color-clay-ink)]"
                              : "inline-flex shrink-0 items-center rounded-[var(--radius-pill)] bg-[var(--color-pale-sage)] px-2.5 py-0.5 text-[length:var(--text-xs)] leading-snug font-semibold whitespace-nowrap text-[var(--color-forest-deep)]"
                          }
                        >
                          {item.category[language]}
                        </span>
                      </dt>
                      <dd className="m-0 grid gap-1.5 text-[var(--color-muted)]">
                        <p className="m-0 text-[var(--color-ink-2)]">
                          {item.purpose[language]}
                        </p>
                        <p className="m-0">
                          <strong className="text-[var(--color-forest-deep)]">
                            {isEs ? "Tipo:" : "Storage:"}
                          </strong>{" "}
                          {item.storageType[language]}
                        </p>
                        <p className="m-0">
                          <strong className="text-[var(--color-forest-deep)]">
                            {isEs ? "Proveedor:" : "Provider:"}
                          </strong>{" "}
                          {item.provider[language]} ·{" "}
                          <strong className="text-[var(--color-forest-deep)]">
                            {isEs ? "Duración:" : "Duration:"}
                          </strong>{" "}
                          <span className="num">{item.duration[language]}</span>
                        </p>
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* Band 3: Warm Parchment, Section 3 Browser Settings, Section 4 Updates and Contact, Cross-Links */}
        <section className="bg-[var(--color-paper)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container">
            <div className="mx-auto grid max-w-[56rem] gap-[var(--space-2xl)]">
              <section className="grid gap-5" id="browser-settings">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "3. Cómo desactivar, bloquear o eliminar cookies y datos del navegador"
                    : "3. How to disable, block, or delete cookies and site data"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Además del botón de preferencias de cookies situado al inicio de esta página y en el pie del sitio web, usted puede permitir, bloquear o eliminar en cualquier momento las cookies y el almacenamiento local desde los ajustes de su navegador. Tenga en cuenta que bloquear los mecanismos técnicos y de seguridad puede impedir el envío protegido de formularios o el uso del asistente."
                    : "In addition to the cookie preferences button on this page and in the site footer, you may allow, block, or delete cookies and local storage at any time through your browser settings. Please note that disabling strictly necessary technical and security storage may prevent protected form submissions or the Website Assistant from functioning."}
                </p>

                <dl className="m-0 grid gap-x-[var(--gap-columns)] gap-y-5 text-[length:var(--text-sm)] sm:grid-cols-2">
                  {BROWSER_GUIDES.map((item) => (
                    <div
                      key={item.browser}
                      className="grid content-start gap-1"
                    >
                      <dt className="font-semibold text-[var(--color-forest-deep)]">
                        {item.browser}
                      </dt>
                      <dd className="m-0 text-[var(--color-muted)]">
                        {item.steps[language].map((step, index) => (
                          <Fragment key={step}>
                            {index > 0 ? (
                              <span
                                aria-hidden="true"
                                className="mx-1.5 text-[var(--color-clay-ink)]"
                              >
                                ›
                              </span>
                            ) : null}
                            <span>{step}</span>
                          </Fragment>
                        ))}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>

              <section className="grid gap-4" id="updates-and-contact">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "4. Actualizaciones y contacto"
                    : "4. Updates and contact"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Karmarise Global LLP puede actualizar esta Política de cookies para reflejar cambios normativos o técnicos en el sitio web. Si tiene cualquier duda sobre el uso de cookies o almacenamiento local, escríbanos a cualquiera de los siguientes buzones:"
                    : "Karmarise Global LLP may update this Cookie Policy to reflect regulatory requirements or technical changes to the website. If you have any questions about our use of cookies or browser storage, please write to either mailbox below:"}
                </p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-[length:var(--text-sm)]">
                  <a
                    className="inline-flex min-h-[var(--tap-min)] items-center font-semibold [overflow-wrap:anywhere] text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href="mailto:support@karmarisedglobal.com"
                  >
                    <bdi dir="ltr">support@karmarisedglobal.com</bdi>
                  </a>
                  <a
                    className="inline-flex min-h-[var(--tap-min)] items-center font-semibold [overflow-wrap:anywhere] text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href="mailto:hola@karmarisedglobal.com"
                  >
                    <bdi dir="ltr">hola@karmarisedglobal.com</bdi>
                  </a>
                </div>
              </section>

              <nav
                aria-label={
                  isEs ? "Otros documentos legales" : "Related legal pages"
                }
                className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[length:var(--text-sm)]"
              >
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
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
                  href={localizeHref("/legal-notice")}
                >
                  <span>{isEs ? "Ver aviso legal" : "View legal notice"}</span>
                  <ArrowIcon />
                </Link>
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                  href={localizeHref("/terms")}
                >
                  <span>
                    {isEs ? "Ver condiciones de uso" : "View website terms"}
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
