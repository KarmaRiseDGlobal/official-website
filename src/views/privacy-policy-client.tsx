import Link from "next/link";

import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { LEGAL_NAV_LINKS } from "@/data/legal-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const legalNavLinks = LEGAL_NAV_LINKS.map((item) => ({
  ...item,
  current: item.href === "/privacy-policy",
}));

export function PrivacyPolicyPageClient({
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
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container">
            <div className="mx-auto grid max-w-[76ch] gap-[var(--space-2xl)]">
              <div className="grid gap-5">
                <p className="section-index">
                  {isEs ? "Protección de datos" : "Legal notice"}
                </p>
                <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-normal">
                  {isEs ? "Política de privacidad" : "Privacy policy"}
                </h1>
                <p className="lead text-[var(--color-ink-2)]">
                  {isEs
                    ? "Esta Política de privacidad explica cómo Karmarise Global LLP, titular de la marca KarmaRise D Global, trata los datos de contacto y las consultas de proyectos compartidas a través de este sitio web."
                    : "This Privacy Policy explains how Karmarise Global LLP, operating the KarmaRise D Global brand, handles contact information and project enquiries shared through this website."}
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
                          ? "inline-flex min-h-[44px] items-center rounded-full bg-[var(--color-forest-deep)] px-4 py-2.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-paper)] no-underline"
                          : "inline-flex min-h-[44px] items-center rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-2.5 text-[length:var(--text-xs)] font-medium text-[var(--color-forest-deep)] no-underline hover:border-[var(--color-forest-deep)]"
                      }
                    >
                      {item.label[language]}
                    </Link>
                  ))}
                </nav>
              </div>

              <section
                className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
                id="controller"
              >
                <h2 className="text-[length:var(--text-2xl)] font-normal">
                  {isEs
                    ? "1. Entidad responsable del tratamiento"
                    : "1. Responsible entity (Data Controller)"}
                </h2>
                <p className="text-[var(--color-muted)]">
                  {isEs
                    ? "De conformidad con el Reglamento General de Protección de Datos de la Unión Europea (RGPD), la Ley Orgánica 3/2018 de España (LOPDGDD) y la Ley de Protección de Datos Personales Digitales de la India de 2023, la entidad responsable del tratamiento de los datos recogidos en este sitio web es:"
                    : "In accordance with the European Union General Data Protection Regulation (GDPR), Spain's Organic Law 3/2018 (LOPDGDD), and India's Digital Personal Data Protection Act, 2023, the entity responsible for processing data collected through this website is:"}
                </p>
                <dl className="m-0 grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)] sm:grid-cols-2">
                  <div>
                    <dt className="font-semibold text-[var(--color-forest-deep)]">
                      {isEs ? "Denominación social" : "Legal entity name"}
                    </dt>
                    <dd className="m-0 text-[var(--color-muted)]">
                      {isEs
                        ? "Karmarise Global LLP (operando como KarmaRise D Global)"
                        : "Karmarise Global LLP (trading as KarmaRise D Global)"}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-semibold text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Registro (LLPIN y GSTIN)"
                        : "Registration (LLPIN & GSTIN)"}
                    </dt>
                    <dd className="m-0 text-[var(--color-muted)]">
                      LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-semibold text-[var(--color-forest-deep)]">
                      {isEs ? "Domicilio social" : "Registered address"}
                    </dt>
                    <dd className="m-0 text-[var(--color-muted)]">
                      2nd floor, Guru Charan Apartment, Ulhasnagar, Maharashtra,
                      India, 421002
                    </dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="font-semibold text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Contacto de privacidad y reclamaciones"
                        : "Privacy & Grievance Contact"}
                    </dt>
                    <dd className="m-0 text-[var(--color-muted)]">
                      {isEs
                        ? "Shirish (Socio director y responsable de reclamaciones)"
                        : "Shirish (Designated Partner & Grievance Officer)"}{" "}
                      ·{" "}
                      <a
                        className="[overflow-wrap:anywhere] break-words underline decoration-[var(--color-clay)] underline-offset-4"
                        href="mailto:support@karmarisedglobal.com"
                      >
                        support@karmarisedglobal.com
                      </a>{" "}
                      ·{" "}
                      <a
                        className="underline decoration-[var(--color-clay)] underline-offset-4"
                        href="tel:+918530009798"
                      >
                        +91 8530009798
                      </a>
                      <br />
                      {isEs
                        ? "Contacto para clientes en España y Europa: Alma"
                        : "European Client Contact (Spain): Alma"}{" "}
                      ·{" "}
                      <a
                        className="[overflow-wrap:anywhere] break-words underline decoration-[var(--color-clay)] underline-offset-4"
                        href="mailto:hola@karmarisedglobal.com"
                      >
                        hola@karmarisedglobal.com
                      </a>{" "}
                      ·{" "}
                      <a
                        className="underline decoration-[var(--color-clay)] underline-offset-4"
                        href="tel:+34611722276"
                      >
                        +34 611722276
                      </a>
                    </dd>
                  </div>
                </dl>
              </section>

              <section
                className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
                id="data-collected"
              >
                <h2 className="text-[length:var(--text-2xl)] font-normal">
                  {isEs
                    ? "2. Datos que recogemos y finalidad del tratamiento"
                    : "2. Information we collect and purpose of use"}
                </h2>
                <p className="text-[var(--color-muted)]">
                  {isEs
                    ? "Únicamente recogemos los datos de contacto y del proyecto que nos facilitas de forma voluntaria:"
                    : "We only collect the contact and project details that you voluntarily share with us:"}
                </p>
                <ul className="m-0 grid gap-3 pl-5 text-[var(--color-muted)]">
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Product Brief y consultas comerciales:"
                        : "Product Brief and commercial enquiries:"}
                    </strong>{" "}
                    {isEs
                      ? "Tu nombre, empresa o marca, correo electrónico, idioma preferido, categoría de producto y notas del proyecto para evaluar tu solicitud, concertar una reunión y preparar una propuesta de Programa de fabricación (tratados sobre la base de medidas precontractuales e interés legítimo empresarial)."
                      : "Your name, company or brand name, email address, preferred language, product category, and project notes shared to evaluate your request, schedule a consultation, and prepare a Manufacturing Programme proposal (processed on the basis of pre-contractual measures and legitimate business interest)."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Contacto general y presentaciones de talleres:"
                        : "General contact and partner introductions:"}
                    </strong>{" "}
                    {isEs
                      ? "Información compartida por visitantes, medios o talleres colaboradores en la India para responder a tu consulta y gestionar relaciones profesionales."
                      : "Information shared by visitors, press, or prospective Manufacturing Partners in India to respond to your enquiry and manage professional relationships."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Suscripción a Historias y novedades:"
                        : "Stories and updates subscription:"}
                    </strong>{" "}
                    {isEs
                      ? "Tu dirección de correo electrónico cuando te suscribes para recibir nuestras Historias y avances de la empresa (tratada sobre la base de tu consentimiento, que puedes retirar en cualquier momento)."
                      : "Your email address when you subscribe to receive occasional Stories and company updates (processed on the basis of your consent, which you may withdraw at any time)."}
                  </li>
                </ul>
              </section>

              <section
                className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
                id="confidentiality"
              >
                <h2 className="text-[length:var(--text-2xl)] font-normal">
                  {isEs
                    ? "3. Confidencialidad y comunicación de datos"
                    : "3. Confidentiality and data sharing"}
                </h2>
                <p className="text-[var(--color-muted)]">
                  {isEs
                    ? "No vendemos, alquilamos ni cedemos tu información personal o comercial a terceros. Las notas de tu Product Brief, bocetos y datos de contacto son revisados directamente por nuestro equipo entre España y la India con el único fin de evaluar tu proyecto y coordinar los Programas de fabricación."
                    : "We do not sell, rent, or trade your personal or commercial information to third parties. Product Brief notes, sketches, and contact details are reviewed directly by our team across Spain and India solely to evaluate your project and coordinate Manufacturing Programmes."}
                </p>
                <p className="text-[var(--color-muted)]">
                  {isEs
                    ? "El acceso a tus datos está restringido al personal autorizado de Karmarise Global LLP y a proveedores esenciales (como servicios seguros de correo, comunicación y alojamiento web) sujetos a estrictas obligaciones de confidencialidad y protección de datos, o cuando así lo exija la ley."
                    : "Access to your data is restricted to authorized personnel of Karmarise Global LLP and essential service providers (such as secure email, communication, and hosting providers) bound by strict confidentiality and data protection obligations, or where disclosure is required by law."}
                </p>
              </section>

              <section
                className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
                id="retention"
              >
                <h2 className="text-[length:var(--text-2xl)] font-normal">
                  {isEs ? "4. Conservación de los datos" : "4. Data retention"}
                </h2>
                <p className="text-[var(--color-muted)]">
                  {isEs
                    ? "Los datos de las consultas se conservan únicamente durante el tiempo necesario para atender tu solicitud, gestionar una relación comercial activa o cumplir con las obligaciones legales, fiscales y contables aplicables. Las suscripciones a Historias por correo se mantienen hasta que te des de baja o solicites su eliminación."
                    : "Enquiry information is retained only for as long as necessary to attend to your request, manage an active commercial relationship, or comply with applicable legal, tax, and accounting obligations. Newsletter subscriptions are kept until you unsubscribe or request removal."}
                </p>
              </section>

              <section
                className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
                id="rights"
              >
                <h2 className="text-[length:var(--text-2xl)] font-normal">
                  {isEs ? "5. Tus derechos" : "5. Your rights"}
                </h2>
                <p className="text-[var(--color-muted)]">
                  {isEs ? (
                    <>
                      Puedes solicitar el acceso, rectificación, supresión,
                      limitación o portabilidad de tus datos personales, así
                      como oponerte a su tratamiento o retirar tu consentimiento
                      en cualquier momento escribiendo a{" "}
                      <a
                        className="font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                        href="mailto:support@karmarisedglobal.com"
                      >
                        support@karmarisedglobal.com
                      </a>{" "}
                      o a{" "}
                      <a
                        className="font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                        href="mailto:hola@karmarisedglobal.com"
                      >
                        hola@karmarisedglobal.com
                      </a>
                      .
                    </>
                  ) : (
                    <>
                      You may request access to, rectification of, deletion of,
                      restriction of, or portability of your personal data, or
                      object to its processing and withdraw consent at any time
                      by writing to{" "}
                      <a
                        className="font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                        href="mailto:support@karmarisedglobal.com"
                      >
                        support@karmarisedglobal.com
                      </a>{" "}
                      or{" "}
                      <a
                        className="font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                        href="mailto:hola@karmarisedglobal.com"
                      >
                        hola@karmarisedglobal.com
                      </a>
                      .
                    </>
                  )}
                </p>
                <p className="text-[var(--color-muted)]">
                  {isEs ? (
                    <>
                      Acusamos recibo de las solicitudes de privacidad en un
                      plazo de 24 horas y las resolvemos en un máximo de 15
                      días. Los usuarios en España y la Unión Europea también
                      tienen derecho a presentar una reclamación ante la Agencia
                      Española de Protección de Datos (
                      <a
                        className="underline decoration-[var(--color-clay)] underline-offset-4"
                        href="https://www.aepd.es"
                        rel="noreferrer"
                        target="_blank"
                      >
                        www.aepd.es
                      </a>
                      ) o su autoridad de control local, y los usuarios en la
                      India pueden dirigirse al Data Protection Board of India.
                    </>
                  ) : (
                    <>
                      We acknowledge privacy and grievance requests within 24
                      hours and resolve them within 15 days. European visitors
                      also have the right to lodge a complaint with the Spanish
                      Data Protection Agency (
                      <em>Agencia Española de Protección de Datos</em>,{" "}
                      <a
                        className="underline decoration-[var(--color-clay)] underline-offset-4"
                        href="https://www.aepd.es"
                        rel="noreferrer"
                        target="_blank"
                      >
                        www.aepd.es
                      </a>
                      ) or their local supervisory authority, and Indian
                      visitors may approach the Data Protection Board of India.
                    </>
                  )}
                </p>
              </section>

              <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--color-rule)] pt-4">
                <Link
                  className="inline-flex min-h-[44px] items-center font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/cookie-policy")}
                >
                  {isEs ? "Ver Política de cookies" : "View Cookie Policy"}
                </Link>
                <Link
                  className="inline-flex min-h-[44px] items-center font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/legal-notice")}
                >
                  {isEs ? "Ver Aviso legal" : "View Corporate & Legal Notice"}
                </Link>
                <Link
                  className="inline-flex min-h-[44px] items-center font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/terms")}
                >
                  {isEs ? "Ver Condiciones de uso" : "View Website Terms"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="night" />
      </main>

      <SiteFooter hideNewsletter />
    </>
  );
}
