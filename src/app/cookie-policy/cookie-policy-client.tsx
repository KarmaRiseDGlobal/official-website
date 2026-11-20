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
    current: true,
  },
  {
    href: "/legal-notice",
    label: { en: "Legal notice", es: "Aviso legal" },
    current: false,
  },
];

const cookieCategories: ReadonlyArray<{
  id: string;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
}> = [
  {
    id: "technical",
    title: {
      en: "Technical and session cookies",
      es: "Cookies técnicas y de sesión",
    },
    body: {
      en: "Allow visitors to navigate the website and use its core features, such as loading pages reliably, maintaining session stability, ensuring secure browsing, and submitting enquiry forms.",
      es: "Permiten navegar por el sitio web y utilizar sus funciones básicas, como cargar las páginas de forma estable, mantener la seguridad de la sesión y enviar formularios de consulta.",
    },
  },
  {
    id: "preference",
    title: {
      en: "Preference and customization cookies",
      es: "Cookies de preferencia e idioma",
    },
    body: {
      en: "Remember basic browsing preferences (such as your chosen language between English and Spanish) so your experience remains consistent across pages.",
      es: "Recuerdan preferencias básicas de navegación (como el idioma seleccionado entre español e inglés) para mantener una experiencia coherente en todas las páginas.",
    },
  },
  {
    id: "statistical",
    title: {
      en: "Statistical and performance cookies",
      es: "Cookies estadísticas y de rendimiento",
    },
    body: {
      en: "Help us understand in aggregate how visitors navigate our pages so we can improve the structure and clarity of our content without identifying individual users.",
      es: "Nos ayudan a comprender de forma agregada cómo se navega por las páginas para mejorar la estructura y claridad de los contenidos sin identificar a usuarios individuales.",
    },
  },
];

const browserGuides: ReadonlyArray<{
  browser: string;
  steps: Record<SiteLanguage, string>;
}> = [
  {
    browser: "Google Chrome",
    steps: {
      en: "Settings -> Privacy and security -> Cookies and other site data",
      es: "Configuración -> Privacidad y seguridad -> Cookies y otros datos de sitios",
    },
  },
  {
    browser: "Mozilla Firefox",
    steps: {
      en: "Settings -> Privacy & Security -> Cookies and Site Data",
      es: "Ajustes -> Privacidad y seguridad -> Cookies y datos del sitio",
    },
  },
  {
    browser: "Apple Safari",
    steps: {
      en: "Preferences / Settings -> Privacy -> Manage Website Data",
      es: "Ajustes / Preferencias -> Privacidad -> Gestionar datos de sitios web",
    },
  },
  {
    browser: "Microsoft Edge",
    steps: {
      en: "Settings -> Cookies and site permissions -> Manage and delete cookies and site data",
      es: "Configuración -> Cookies y permisos del sitio -> Administrar y eliminar cookies y datos del sitio",
    },
  },
];

export function CookiePolicyPageClient() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid max-w-[76ch] gap-[var(--space-2xl)]">
            <div className="grid gap-5">
              <p className="section-index">
                {isEs ? "Información legal" : "Legal notice"}
              </p>
              <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-normal">
                {isEs ? "Política de cookies" : "Cookie policy"}
              </h1>
              <p className="lead text-[var(--color-ink-2)]">
                {isEs
                  ? "En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE), la normativa europea de protección de datos y la legislación aplicable en la India, esta página explica qué son las cookies, cómo se utilizan en el sitio web de KarmaRise D Global y cómo puedes gestionarlas."
                  : "In compliance with Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), European Union data protection regulations, and applicable Indian law, this page explains what cookies are, how they are used on the KarmaRise D Global website, and how you can manage them."}
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
              id="what-are-cookies"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs ? "1. ¿Qué son las cookies?" : "1. What are cookies?"}
              </h2>
              <p className="text-[var(--color-muted)]">
                {isEs
                  ? "Una cookie es un pequeño archivo de texto que un sitio web descarga y almacena en tu ordenador, tableta o teléfono móvil al visitar determinadas páginas. Permite recordar información básica sobre la sesión de navegación, reconocer el navegador entre páginas y garantizar que el sitio funcione con seguridad y fluidez. Las cookies no dañan tu dispositivo ni pueden leer archivos personales almacenados en él."
                  : "A cookie is a small text file that a website downloads and stores on your computer, tablet, or mobile device when you visit certain pages. Cookies allow a website to store and retrieve basic information about your browsing session, recognize your browser across pages, and ensure the website functions smoothly and securely. Cookies do not damage your device and cannot read personal files stored on your computer."}
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="types-of-cookies"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "2. Tipos de cookies utilizadas en este sitio web"
                  : "2. Types of cookies used on this website"}
              </h2>
              <p className="text-[var(--color-muted)]">
                {isEs
                  ? "Este sitio web utiliza cookies y almacenamiento local exclusivamente para garantizar una navegación fluida, la seguridad y el recuerdo de tu idioma preferido. No utilizamos cookies para recopilar información personal sensible ni para mostrar publicidad comportamental de terceros."
                  : "This website uses cookies and local storage solely to ensure smooth navigation, security, and language preference persistence. We do not use cookies to collect sensitive personal information or to serve third-party behavioral advertising."}
              </p>

              <div className="grid gap-4">
                {cookieCategories.map((item) => (
                  <div
                    key={item.id}
                    className="grid gap-2 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)]"
                  >
                    <p className="font-semibold text-[var(--color-forest-deep)]">
                      {item.title[language]}
                    </p>
                    <p className="text-[var(--color-muted)]">
                      {item.body[language]}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="browser-settings"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "3. Cómo desactivar, bloquear o eliminar las cookies"
                  : "3. How to disable, block, or delete cookies"}
              </h2>
              <p className="text-[var(--color-muted)]">
                {isEs
                  ? "Puedes permitir, bloquear o eliminar las cookies instaladas en tu dispositivo en cualquier momento configurando las opciones de tu navegador web. Ten en cuenta que desactivar las cookies técnicas puede afectar al funcionamiento de algunas secciones del sitio."
                  : "You can allow, block, or delete the cookies installed on your device at any time by configuring the options in your web browser. Please note that disabling technical cookies may affect the proper functioning of certain sections of the website."}
              </p>

              <dl className="m-0 grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)] sm:grid-cols-2">
                {browserGuides.map((item) => (
                  <div key={item.browser} className="grid gap-1">
                    <dt className="font-semibold text-[var(--color-forest-deep)]">
                      {item.browser}
                    </dt>
                    <dd className="m-0 text-[var(--color-muted)]">
                      {item.steps[language]}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="updates-and-contact"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                {isEs
                  ? "4. Actualizaciones y contacto"
                  : "4. Updates and contact"}
              </h2>
              <p className="text-[var(--color-muted)]">
                {isEs ? (
                  <>
                    Karmarise Global LLP puede actualizar esta Política de
                    cookies para reflejar cambios normativos o técnicos en el
                    sitio web. Si tienes cualquier duda sobre el uso de cookies,
                    escríbenos a{" "}
                    <a
                      className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                      href="mailto:support@karmarisedglobal.com"
                    >
                      support@karmarisedglobal.com
                    </a>{" "}
                    o a{" "}
                    <a
                      className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                      href="mailto:hola@karmarisedglobal.com"
                    >
                      hola@karmarisedglobal.com
                    </a>
                    .
                  </>
                ) : (
                  <>
                    Karmarise Global LLP may update this Cookie Policy to
                    reflect regulatory requirements or changes to the website.
                    If you have any questions about our use of cookies, please
                    contact us at{" "}
                    <a
                      className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                      href="mailto:support@karmarisedglobal.com"
                    >
                      support@karmarisedglobal.com
                    </a>{" "}
                    or{" "}
                    <a
                      className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                      href="mailto:hola@karmarisedglobal.com"
                    >
                      hola@karmarisedglobal.com
                    </a>
                    .
                  </>
                )}
              </p>
            </section>

            <div className="flex flex-wrap gap-6 border-t border-[var(--color-rule)] pt-6">
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/privacy-policy")}
              >
                {isEs ? "Ver Política de privacidad" : "View Privacy Policy"}
              </Link>
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/legal-notice")}
              >
                {isEs ? "Ver Aviso legal" : "View Corporate & Legal Notice"}
              </Link>
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/terms")}
              >
                {isEs ? "Ver Condiciones de uso" : "View Website Terms"}
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
