import Link from "next/link";

import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import {
  DATA_PROCESSORS,
  LEGAL_DATES,
  LEGAL_NAV_LINKS,
  LEGAL_REGISTERED_OFFICE,
} from "@/data/legal-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const legalNavLinks = LEGAL_NAV_LINKS.map((item) => ({
  ...item,
  current: item.href === "/privacy-policy",
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
        {/* Band 1: Warm Parchment, Header, Document Nav, and Section 1 Data Controller */}
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
                      {isEs ? "Política de privacidad" : "Privacy policy"}
                    </li>
                  </ol>
                </nav>

                <h1 className="max-w-[22ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                  {isEs ? "Política de privacidad" : "Privacy policy"}
                </h1>

                <p className="lead max-w-[65ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Esta Política de privacidad explica cómo Karmarise Global LLP, titular de la marca KarmaRise D Global, recoge, utiliza, transfiere y protege los datos personales que usted comparte a través de este sitio web."
                    : "This Privacy Policy explains how Karmarise Global LLP, operating the KarmaRise D Global brand, collects, uses, transfers, and safeguards personal information shared through this website."}
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

              <section className="grid gap-5" id="controller">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "1. Entidad responsable del tratamiento"
                    : "1. Responsible entity (Data Controller)"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs
                    ? "De conformidad con el Reglamento General de Protección de Datos de la Unión Europea (RGPD), la Ley Orgánica 3/2018 de España (LOPDGDD) y la Ley de Protección de Datos Personales Digitales de la India de 2023 (DPDP Act), la entidad responsable del tratamiento de los datos recogidos en este sitio web es:"
                    : "In accordance with the European Union General Data Protection Regulation (GDPR), Spain's Organic Law 3/2018 (LOPDGDD), and India's Digital Personal Data Protection Act, 2023 (DPDP Act), the entity responsible for processing data collected through this website is:"}
                </p>

                <dl className="m-0 grid gap-5 text-[length:var(--text-sm)] sm:grid-cols-2">
                  <div className="grid content-start gap-1">
                    <dt className="text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-clay-ink)] uppercase">
                      {isEs ? "Denominación social" : "Legal entity name"}
                    </dt>
                    <dd className="m-0 font-semibold text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Karmarise Global LLP (operando como KarmaRise D Global)"
                        : "Karmarise Global LLP (trading as KarmaRise D Global)"}
                    </dd>
                  </div>

                  <div className="grid content-start gap-1">
                    <dt className="text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-clay-ink)] uppercase">
                      {isEs
                        ? "Registro (LLPIN y GSTIN)"
                        : "Registration (LLPIN and GSTIN)"}
                    </dt>
                    <dd className="m-0 text-[var(--color-ink-2)]">
                      LLPIN:{" "}
                      <span className="num font-semibold text-[var(--color-forest-deep)]">
                        <bdi dir="ltr">ACO-3878</bdi>
                      </span>{" "}
                      · GSTIN:{" "}
                      <span className="num font-semibold text-[var(--color-forest-deep)]">
                        <bdi dir="ltr">27ABDFK8128R1ZL</bdi>
                      </span>
                    </dd>
                  </div>

                  <div className="grid content-start gap-1 sm:col-span-2">
                    <dt className="text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-clay-ink)] uppercase">
                      {isEs ? "Domicilio social" : "Registered office"}
                    </dt>
                    <dd className="m-0">
                      <address className="m-0 text-[var(--color-ink-2)] not-italic">
                        {LEGAL_REGISTERED_OFFICE}
                      </address>
                    </dd>
                  </div>

                  <div className="grid content-start gap-2 sm:col-span-2">
                    <dt className="text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-clay-ink)] uppercase">
                      {isEs
                        ? "Contacto de privacidad y reclamaciones"
                        : "Privacy and Grievance Contact"}
                    </dt>
                    <dd className="m-0 grid gap-2 text-[var(--color-ink-2)]">
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="font-semibold text-[var(--color-forest-deep)]">
                          {isEs
                            ? "Shirish (socio director y responsable de reclamaciones)"
                            : "Shirish (Designated Partner and Grievance Officer)"}
                        </span>
                        <a
                          className="inline-flex min-h-[var(--tap-min)] items-center [overflow-wrap:anywhere] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                          href="mailto:support@karmarisedglobal.com"
                        >
                          <bdi dir="ltr">support@karmarisedglobal.com</bdi>
                        </a>
                        <a
                          className="num inline-flex min-h-[var(--tap-min)] items-center underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                          href="tel:+918530009798"
                        >
                          <bdi dir="ltr">+91 8530009798</bdi>
                        </a>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                        <span className="font-semibold text-[var(--color-forest-deep)]">
                          {isEs
                            ? "Contacto en España y el resto de Europa: Alma"
                            : "Contact in Spain and the rest of Europe: Alma"}
                        </span>
                        <a
                          className="inline-flex min-h-[var(--tap-min)] items-center [overflow-wrap:anywhere] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                          href="mailto:hola@karmarisedglobal.com"
                        >
                          <bdi dir="ltr">hola@karmarisedglobal.com</bdi>
                        </a>
                        <a
                          className="num inline-flex min-h-[var(--tap-min)] items-center underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                          href="tel:+34611722276"
                        >
                          <bdi dir="ltr">+34 611 722 276</bdi>
                        </a>
                      </div>
                    </dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* Band 2: Warm Dune, Section 2 Data Collected & Purposes, Section 3 Processors & International Transfers */}
        <section className="bg-[var(--color-dune)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container">
            <div className="mx-auto grid max-w-[56rem] gap-[var(--space-2xl)]">
              <section className="grid gap-4" id="data-collected">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "2. Datos que recogemos, finalidades y bases jurídicas"
                    : "2. Information we collect, purposes, and lawful bases"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Recogemos únicamente la información que usted nos facilite voluntariamente, junto con los datos técnicos estrictamente necesarios para proteger el sitio web y prestar la función solicitada:"
                    : "We collect only the information that you voluntarily provide, alongside the technical data strictly necessary to secure the website and deliver the feature you request:"}
                </p>

                <ul className="m-0 grid max-w-[65ch] gap-4 pl-5 text-[var(--color-muted)]">
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Briefing de producto y archivos adjuntos:"
                        : "Product Brief submissions and uploaded files:"}
                    </strong>{" "}
                    {isEs
                      ? "Su nombre, empresa o marca, correo electrónico, idioma preferido, categoría de producto, notas del proyecto, enlaces de referencia y hasta 3 archivos adjuntos (JPG, PNG, WebP o PDF hasta 10 MB en total), utilizados para evaluar su solicitud, proponer una reunión y preparar un Programa de producción. Base jurídica: aplicación de medidas precontractuales a petición suya (art. 6.1.b RGPD)."
                      : "Your name, company or brand name, email address, preferred language, product category, project notes, reference URLs, and up to 3 uploaded files (JPG, PNG, WebP, or PDF up to 10 MB total), used to assess feasibility, arrange a consultation, and prepare a Manufacturing Programme proposal. Lawful basis: pre-contractual measures taken at your request (GDPR Art. 6(1)(b))."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Reserva de videollamadas:"
                        : "Video call scheduling:"}
                    </strong>{" "}
                    {isEs
                      ? "Su nombre, correo electrónico, zona horaria, idioma preferido para la llamada, empresa y notas previas al reservar una sesión con Alma, utilizados para confirmar la disponibilidad, generar el enlace de videollamada y enviarle la confirmación. Base jurídica: medidas precontractuales (art. 6.1.b RGPD)."
                      : "Your name, email address, timezone, preferred call language, company, and preparation notes when scheduling a call with Alma, used to confirm availability, generate your video meeting link, and send confirmation details. Lawful basis: pre-contractual measures (GDPR Art. 6(1)(b))."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Asistente del sitio web:"
                        : "Website Assistant chat:"}
                    </strong>{" "}
                    {isEs
                      ? "Cuando usted inicia una conversación en el asistente del sitio web, enviamos su consulta, el contexto reciente de la misma conversación, la página visitada y el idioma seleccionado a nuestro proveedor de inferencia para ofrecer respuestas informativas. Por favor, evite introducir datos confidenciales o sensibles en el chat. Base jurídica: interés legítimo en prestar asistencia en el sitio (art. 6.1.f RGPD)."
                      : "When you send a message in the Website Assistant chat, we pass your question, recent context from that conversation, the page you are viewing, and your active language to our inference provider to generate helpful answers. Please avoid entering sensitive personal data into the chat. Lawful basis: legitimate interest in providing site guidance (GDPR Art. 6(1)(f))."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Contacto general y presentaciones de unidades de producción:"
                        : "General contact and Manufacturing Partner introductions:"}
                    </strong>{" "}
                    {isEs
                      ? "Información enviada por visitantes, prensa, entidades o unidades de producción en la India mediante el formulario de contacto o correo electrónico para atender su consulta. Base jurídica: medidas precontractuales o interés legítimo empresarial (art. 6.1.b y 6.1.f RGPD)."
                      : "Information shared by visitors, press, or prospective Manufacturing Partners in India via our contact form or email to answer your enquiry and manage professional relationships. Lawful basis: pre-contractual measures or legitimate business interest (GDPR Art. 6(1)(b) and 6(1)(f))."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Suscripción a Historias quincenales y estadísticas del boletín:"
                        : "Biweekly Stories subscription and newsletter metrics:"}
                    </strong>{" "}
                    {isEs
                      ? "Su correo electrónico, idioma, tema de interés y país aproximado cuando usted se suscribe expresamente a nuestras Historias quincenales. Nuestro proveedor de boletines registra entregas, aperturas y clics en forma de totales agregados y no individuales para mejorar nuestras cartas. Base jurídica: su consentimiento expreso (art. 6.1.a RGPD), que puede retirar en cualquier momento."
                      : "Your email address, language, chosen track, and approximate country when you explicitly subscribe to our biweekly Stories. Our newsletter provider records delivery, open, and click metrics aggregated into non-individual totals to improve our letters. Lawful basis: your explicit consent (GDPR Art. 6(1)(a)), which you may withdraw at any time."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Atribución comercial opcional y seguridad técnica:"
                        : "Optional referral attribution and technical security:"}
                    </strong>{" "}
                    {isEs
                      ? "Nuestro proveedor de seguridad trata su dirección IP y señales de verificación antibots en los formularios, el chat y la gestión de preferencias para prevenir abusos (interés legítimo, art. 6.1.f RGPD). Únicamente cuando usted activa las cookies opcionales en el panel de preferencias de cookies, conservamos referencias de campaña o colaboradores para saber qué carta o presentación le trajo hasta aquí sobre la base de su consentimiento (art. 6.1.a RGPD)."
                      : "Our security provider processes your IP address and anti-bot verification signals across forms, chat, and preference controls to prevent abuse (legitimate interest, GDPR Art. 6(1)(f)). Only when you enable optional cookies via the Cookie preferences banner do we retain campaign or partner referral parameters to understand which letter or introduction brought you here on the basis of your consent (GDPR Art. 6(1)(a))."}
                  </li>
                </ul>
              </section>

              <section className="grid gap-5" id="confidentiality">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "3. Encargados del tratamiento y transferencias internacionales"
                    : "3. Data processors and international transfers"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "No vendemos, alquilamos ni cedemos sus datos personales o comerciales a terceros. Los datos de su briefing de producto, archivos adjuntos y bocetos son revisados directamente por Alma y Shirish entre España y la India exclusivamente para evaluar su proyecto y coordinar los Programas de producción."
                    : "We do not sell, rent, or trade your personal or commercial information to third parties. Your Product Brief notes, uploaded files, and sketches are reviewed directly by Alma and Shirish across Spain and India solely to evaluate your project and coordinate Manufacturing Programmes."}
                </p>

                {/* Desktop & Tablet Processor Table */}
                <div className="hidden overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] md:block">
                  <table className="w-full border-collapse text-start text-[length:var(--text-sm)]">
                    <caption className="sr-only">
                      {isEs
                        ? "Lista de proveedores tecnológicos que tratan datos en nombre de Karmarise Global LLP y garantías de transferencia internacional"
                        : "Technology processors handling data for Karmarise Global LLP and international transfer safeguards"}
                    </caption>
                    <thead className="bg-[var(--color-paper)] text-[length:var(--text-xs)] tracking-[var(--tracking-label)] text-[var(--color-forest-deep)] uppercase">
                      <tr>
                        <th
                          scope="col"
                          className="w-[22%] px-4 py-3.5 text-start font-semibold"
                        >
                          {isEs ? "Categoría de servicio" : "Service category"}
                        </th>
                        <th
                          scope="col"
                          className="w-[26%] px-4 py-3.5 text-start font-semibold"
                        >
                          {isEs ? "Función" : "Purpose"}
                        </th>
                        <th
                          scope="col"
                          className="w-[28%] px-4 py-3.5 text-start font-semibold"
                        >
                          {isEs ? "Datos tratados" : "Data processed"}
                        </th>
                        <th
                          scope="col"
                          className="w-[24%] px-4 py-3.5 text-start font-semibold"
                        >
                          {isEs
                            ? "Ubicación y garantías"
                            : "Location and safeguards"}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--color-rule)]">
                      {DATA_PROCESSORS.map((item) => (
                        <tr key={item.id}>
                          <th
                            scope="row"
                            className="px-4 py-4 text-start align-top font-semibold text-[var(--color-forest-deep)]"
                          >
                            <span className="break-words">
                              {item.processor[language]}
                            </span>
                          </th>
                          <td className="px-4 py-4 align-top leading-[1.55] text-[var(--color-ink-2)]">
                            {item.role[language]}
                          </td>
                          <td className="px-4 py-4 align-top leading-[1.55] text-[var(--color-muted)]">
                            {item.dataProcessed[language]}
                          </td>
                          <td className="px-4 py-4 align-top leading-[1.55] text-[var(--color-muted)]">
                            {item.locationAndSafeguard[language]}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Stacked Processor List */}
                <dl className="m-0 grid divide-y divide-[var(--color-rule)] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] md:hidden">
                  {DATA_PROCESSORS.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-2 px-4 py-4 text-[length:var(--text-sm)]"
                    >
                      <dt className="font-semibold break-words text-[var(--color-forest-deep)]">
                        {item.processor[language]}
                      </dt>
                      <dd className="m-0 grid gap-1.5 text-[var(--color-muted)]">
                        <p className="m-0 text-[var(--color-ink-2)]">
                          {item.role[language]}
                        </p>
                        <p className="m-0">
                          <strong className="text-[var(--color-forest-deep)]">
                            {isEs ? "Datos:" : "Data:"}
                          </strong>{" "}
                          {item.dataProcessed[language]}
                        </p>
                        <p className="m-0">
                          <strong className="text-[var(--color-forest-deep)]">
                            {isEs ? "Garantías:" : "Safeguards:"}
                          </strong>{" "}
                          {item.locationAndSafeguard[language]}
                        </p>
                      </dd>
                    </div>
                  ))}
                </dl>

                <div className="grid gap-3" id="international-transfers">
                  <h3 className="text-[length:var(--text-title)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                    {isEs
                      ? "Transferencias internacionales fuera del Espacio Económico Europeo (art. 13.1.f RGPD)"
                      : "International transfers outside the European Economic Area (GDPR Art. 13(1)(f))"}
                  </h3>
                  <p className="max-w-[65ch] text-[var(--color-muted)]">
                    {isEs
                      ? "Karmarise Global LLP está constituida y opera en la India, país que no cuenta actualmente con una decisión de adecuación de la Comisión Europea, y utiliza proveedores tecnológicos con infraestructura en Estados Unidos y redes globales. Cuando usted solicita un briefing de producto, una videollamada o un Programa de producción, la transferencia de sus datos a nuestro equipo en la India se realiza sobre la base de la necesidad precontractual o contractual (art. 49.1.b RGPD). Para nuestros proveedores tecnológicos fuera del EEE aplicamos Cláusulas Contractuales Tipo (SCC) aprobadas por la Comisión Europea y, cuando corresponde, certificaciones bajo el Marco de Privacidad de Datos UE-EE. UU. Puede solicitar información adicional sobre estas garantías escribiendo a support@karmarisedglobal.com."
                      : "Karmarise Global LLP is incorporated and operates in India, which does not currently hold a European Commission adequacy decision, and relies on infrastructure sub-processors operating in the United States and globally. When you submit a Product Brief, schedule a call, or commission a Manufacturing Programme, transfers to our team in India rely on pre-contractual and contractual necessity under GDPR Article 49(1)(b). Transfers to non-EEA technology processors are protected by European Commission Standard Contractual Clauses (SCCs) and, where applicable, the EU-US Data Privacy Framework. You may request details of these safeguards by writing to support@karmarisedglobal.com."}
                  </p>
                </div>
              </section>
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* Band 3: Warm Parchment, Section 4 Retention, Section 5 Rights, and Cross-Links */}
        <section className="bg-[var(--color-paper)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container">
            <div className="mx-auto grid max-w-[56rem] gap-[var(--space-2xl)]">
              <section className="grid gap-4" id="retention">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs
                    ? "4. Plazos de conservación de los datos (art. 13.2.a RGPD)"
                    : "4. Data retention periods (GDPR Art. 13(2)(a))"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Conservamos los datos personales únicamente durante el plazo necesario para cumplir la finalidad para la que fueron recogidos y las obligaciones legales aplicables:"
                    : "We retain personal information only for as long as needed to fulfil the purpose for which it was collected and to meet statutory obligations:"}
                </p>
                <ul className="m-0 grid max-w-[65ch] gap-3 pl-5 text-[var(--color-muted)]">
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Briefings de producto, archivos adjuntos, reservas de llamadas y consultas:"
                        : "Product Briefs, uploaded files, call bookings, and enquiries:"}
                    </strong>{" "}
                    {isEs
                      ? "Hasta 24 meses desde el último contacto si no se formaliza un Programa de producción. Si se inicia una relación comercial, los expedientes contractuales y fiscales se conservan durante la vigencia del contrato y durante 8 años conforme a la legislación fiscal y GST de la India (y hasta 6 años según la normativa mercantil española cuando proceda)."
                      : "Up to 24 months from the last interaction where no Manufacturing Programme proceeds. Where a commercial relationship is established, contractual and tax records are retained for the life of the contract plus 8 years under Indian statutory tax and GST law (and up to 6 years under Spanish commercial code where applicable)."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Suscripciones a Historias quincenales:"
                        : "Biweekly Stories subscriptions:"}
                    </strong>{" "}
                    {isEs
                      ? "Mientras usted mantenga su suscripción activa y hasta que solicite darse de baja o la supresión de sus datos desde cualquier correo o escribiendo a nuestro equipo."
                      : "For as long as you remain subscribed, until you unsubscribe via any letter footer or ask us to delete your subscriber record."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Asistente del sitio web y seguridad técnica:"
                        : "Website Assistant chat and technical security:"}
                    </strong>{" "}
                    {isEs
                      ? "Las consultas del chat se procesan de forma transitoria sin almacenamiento en base de datos; la cookie de sesión caduca en 2 horas y el historial local se borra al cerrar la pestaña. Los contadores de protección frente a abusos se reinician automáticamente en ventanas breves."
                      : "Chat prompts are processed transiently with no long-term server database storage; the session cookie expires after 2 hours and the local tab thread clears when you close the tab. Abuse-prevention counters reset automatically in short operational windows."}
                  </li>
                  <li>
                    <strong className="text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Borradores locales y atribución en su navegador:"
                        : "Local browser drafts and attribution:"}
                    </strong>{" "}
                    {isEs
                      ? "Los borradores locales del briefing de producto se conservan únicamente en su dispositivo durante un máximo de 14 días (o hasta el envío del formulario). Los parámetros de atribución opcionales, cuando hayan sido aceptados, caducan en un máximo de 30 días."
                      : "Local Product Brief drafts remain strictly on your device for up to 14 days (or until submitted). Optional referral attribution parameters, when consented, expire within 30 days."}
                  </li>
                </ul>
              </section>

              <section className="grid gap-4" id="rights">
                <h2 className="text-[length:var(--text-section)] leading-[1.06] font-normal">
                  {isEs ? "5. Sus derechos" : "5. Your rights"}
                </h2>
                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Usted puede ejercer en cualquier momento sus derechos de acceso, rectificación, supresión, limitación del tratamiento, oposición y portabilidad, así como retirar su consentimiento (incluida la gestión de cookies opcionales o la baja de Historias) sin que ello afecte a la licitud del tratamiento previo, escribiéndonos a cualquiera de los siguientes buzones:"
                    : "You may request access to, rectification of, deletion of, restriction of, or portability of your personal data, object to processing, or withdraw consent (including optional cookie choices or newsletter subscriptions) at any time without affecting prior lawful processing by writing to either mailbox below:"}
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

                <p className="max-w-[65ch] text-[var(--color-muted)]">
                  {isEs ? (
                    <>
                      Acusamos recibo de las solicitudes de privacidad en un
                      plazo de <span className="num">24</span> horas y las
                      resolvemos en un máximo de <span className="num">15</span>{" "}
                      días. Si usted reside en España o en el resto de la Unión
                      Europea, también tiene derecho a presentar una reclamación
                      ante la Agencia Española de Protección de Datos (
                      <a
                        className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href="https://www.aepd.es"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        www.aepd.es
                        <span className="sr-only">
                          {" "}
                          (se abre en una pestaña nueva)
                        </span>
                      </a>
                      ) o ante su autoridad de control local, y los residentes
                      en la India pueden dirigirse al Data Protection Board of
                      India.
                    </>
                  ) : (
                    <>
                      We acknowledge privacy and grievance requests within{" "}
                      <span className="num">24</span> hours and resolve them
                      within <span className="num">15</span> days. Visitors in
                      Spain and the rest of the European Union also have the
                      right to lodge a complaint with the Spanish Data
                      Protection Agency (
                      <em>Agencia Española de Protección de Datos</em>,{" "}
                      <a
                        className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href="https://www.aepd.es"
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        www.aepd.es
                        <span className="sr-only"> (opens in a new tab)</span>
                      </a>
                      ) or their local supervisory authority, and visitors in
                      India may approach the Data Protection Board of India.
                    </>
                  )}
                </p>
              </section>

              <nav
                aria-label={
                  isEs ? "Otros documentos legales" : "Related legal pages"
                }
                className="flex flex-wrap gap-x-6 gap-y-2 pt-2 text-[length:var(--text-sm)]"
              >
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/cookie-policy")}
                >
                  <span>
                    {isEs ? "Ver política de cookies" : "View cookie policy"}
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
