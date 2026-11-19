"use client";

import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";

const departmentEmails: ReadonlyArray<{
  email: string;
  label: Record<SiteLanguage, string>;
}> = [
  {
    email: "hola@karmarisedglobal.com",
    label: {
      en: "Spain, Europe & international Clients",
      es: "Clientes en España, Europa e internacional",
    },
  },
  {
    email: "namaste@karmarisedglobal.com",
    label: {
      en: "India Client & general intake",
      es: "Atención general y clientes en la India",
    },
  },
  {
    email: "inquiry@karmarisedglobal.com",
    label: {
      en: "New project & Product Brief enquiries",
      es: "Nuevos proyectos y consultas de Product Brief",
    },
  },
  {
    email: "partners@karmarisedglobal.com",
    label: {
      en: "Manufacturing Partners & workshops in India",
      es: "Talleres y socios de fabricación en la India",
    },
  },
  {
    email: "stories@karmarisedglobal.com",
    label: {
      en: "Editorial Stories, press & Almarise",
      es: "Historias, prensa y Almarise",
    },
  },
  {
    email: "support@karmarisedglobal.com",
    label: {
      en: "Support, privacy & Grievance Officer",
      es: "Soporte, privacidad y responsable de reclamaciones",
    },
  },
  {
    email: "accounts@karmarisedglobal.com",
    label: {
      en: "Billing, invoicing & GST accounts",
      es: "Facturación, contabilidad y documentación GST",
    },
  },
  {
    email: "alma@karmarisedglobal.com",
    label: {
      en: "Alma (European Client Operations, Spain & India)",
      es: "Alma (Operaciones con clientes europeos, España e India)",
    },
  },
  {
    email: "shirish@karmarisedglobal.com",
    label: {
      en: "Shirish (Designated Partner, India)",
      es: "Shirish (Socio director, India)",
    },
  },
];

export function ContactPageClient() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-lg)]">
              <h1 className="max-w-[15ch] text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium">
                {isEs ? "Contacto" : "Contact"}
              </h1>
              <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Escríbenos directamente en español o en inglés."
                  : "Reach KarmaRise D Global directly in English or Spanish."}
              </p>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              <article className="grid content-between gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-7">
                <div className="grid gap-3">
                  <h2 className="text-[length:var(--text-2xl)] font-medium">
                    {isEs
                      ? "¿Quieres fabricar un producto?"
                      : "Commissioning a product?"}
                  </h2>
                  <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    {isEs ? (
                      <>
                        Comparte tu Product Brief online o escríbenos
                        directamente a{" "}
                        <a
                          className="underline decoration-[var(--color-clay)] underline-offset-4"
                          href="mailto:hola@karmarisedglobal.com"
                        >
                          hola@karmarisedglobal.com
                        </a>{" "}
                        o a{" "}
                        <a
                          className="underline decoration-[var(--color-clay)] underline-offset-4"
                          href="mailto:namaste@karmarisedglobal.com"
                        >
                          namaste@karmarisedglobal.com
                        </a>
                        .
                      </>
                    ) : (
                      <>
                        Share your Product Brief online or write directly to{" "}
                        <a
                          className="underline decoration-[var(--color-clay)] underline-offset-4"
                          href="mailto:hola@karmarisedglobal.com"
                        >
                          hola@karmarisedglobal.com
                        </a>{" "}
                        or{" "}
                        <a
                          className="underline decoration-[var(--color-clay)] underline-offset-4"
                          href="mailto:namaste@karmarisedglobal.com"
                        >
                          namaste@karmarisedglobal.com
                        </a>
                        .
                      </>
                    )}
                  </p>
                </div>
                <Link
                  className="primary-button w-fit"
                  href={localizeHref("/product-brief")}
                >
                  {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
                </Link>
              </article>

              <article className="grid content-between gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-7">
                <div className="grid gap-3">
                  <h2 className="text-[length:var(--text-2xl)] font-medium">
                    {isEs
                      ? "Talleres y artesanos en la India"
                      : "Workshops and artisans in India"}
                  </h2>
                  <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    {isEs
                      ? "Cuéntanos dónde trabajas, en qué tipo de producto estás especializado y qué volúmenes de pedido manejas."
                      : "Tell us where you work, what you make, and the order sizes you can handle."}
                  </p>
                </div>
                <a
                  className="w-fit font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href="mailto:partners@karmarisedglobal.com?subject=Manufacturing%20Partner%20Introduction"
                >
                  {isEs
                    ? "Escribir a partners@karmarisedglobal.com"
                    : "Email partners@karmarisedglobal.com"}
                </a>
              </article>

              <article className="grid content-between gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-7">
                <div className="grid gap-3">
                  <h2 className="text-[length:var(--text-2xl)] font-medium">
                    {isEs ? "Otras consultas" : "Other enquiries"}
                  </h2>
                  <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    {isEs ? (
                      <>
                        Para prensa, Historias (
                        <a
                          className="underline decoration-[var(--color-clay)] underline-offset-4"
                          href="mailto:stories@karmarisedglobal.com"
                        >
                          stories@karmarisedglobal.com
                        </a>
                        ), Almarise o la futura Iniciativa de formación para
                        mujeres, envíanos un mensaje.
                      </>
                    ) : (
                      <>
                        For press, Stories (
                        <a
                          className="underline decoration-[var(--color-clay)] underline-offset-4"
                          href="mailto:stories@karmarisedglobal.com"
                        >
                          stories@karmarisedglobal.com
                        </a>
                        ), Almarise, or the planned Women&apos;s Training
                        Initiative, send us a note.
                      </>
                    )}
                  </p>
                </div>
                <a
                  className="w-fit font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href="#general-note"
                >
                  {isEs ? "Enviar un mensaje" : "Send a message"}
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-4 lg:col-span-5">
              <h2 className="text-[length:var(--text-display-s)] leading-[1.04] font-medium text-[var(--color-paper)]">
                {isEs
                  ? "Teléfono, correo y domicilio social"
                  : "Phone, email, and registered address"}
              </h2>
              <p className="max-w-[40ch] text-[length:var(--text-sm)] text-[var(--color-paper-2)]">
                {isEs ? (
                  <>
                    KarmaRise D Global está operada por{" "}
                    <strong className="text-[var(--color-paper)]">
                      Karmarise Global LLP
                    </strong>{" "}
                    (LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL), constituida en
                    la India el 15 de mayo de 2025.
                  </>
                ) : (
                  <>
                    KarmaRise D Global is operated by{" "}
                    <strong className="text-[var(--color-paper)]">
                      Karmarise Global LLP
                    </strong>{" "}
                    (LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL), incorporated in
                    India on 15 May 2025.
                  </>
                )}
              </p>
            </div>

            <dl className="m-0 grid gap-6 text-[var(--color-paper-2)] lg:col-span-7">
              <div className="grid gap-1 border-t border-[var(--color-paper)]/15 pt-4">
                <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                  {isEs
                    ? "Domicilio social registrado (India)"
                    : "Registered office address (India)"}
                </dt>
                <dd className="m-0">
                  <a
                    className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-paper)]"
                    href="https://www.google.com/maps/place/Guru+Charan/@19.2324905,73.1534675,49m/data=!3m1!1e3!4m6!3m5!1s0x3be7943c1ba890cf:0x3c332f2cfae05f64!8m2!3d19.2325!4d73.1536!16s%2Fg%2F1pyqv_7by?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D"
                  >
                    2nd floor, Guru Charan Apartment, Ulhasnagar, Maharashtra,
                    India, 421002
                  </a>
                </dd>
              </div>

              <div className="grid gap-6 border-t border-[var(--color-paper)]/15 pt-4 sm:grid-cols-2">
                <div className="grid gap-1">
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                    {isEs
                      ? "Teléfono en la India (Shirish)"
                      : "India phone (Shirish)"}
                  </dt>
                  <dd className="m-0">
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-paper)]"
                      href="tel:+918530009798"
                    >
                      +91 8530009798
                    </a>
                  </dd>
                </div>
                <div className="grid gap-1">
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                    {isEs
                      ? "Teléfono para España y Europa (Alma)"
                      : "Spain and Europe phone (Alma)"}
                  </dt>
                  <dd className="m-0">
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-paper)]"
                      href="tel:+34611722276"
                    >
                      +34 611722276
                    </a>
                  </dd>
                </div>
              </div>

              <div className="grid gap-3 border-t border-[var(--color-paper)]/15 pt-4">
                <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                  {isEs
                    ? "Directorio de correos oficiales"
                    : "Official email directory"}
                </dt>
                <dd className="m-0 grid gap-3 sm:grid-cols-2">
                  {departmentEmails.map((item) => (
                    <div
                      key={item.email}
                      className="grid gap-0.5 rounded-xl border border-[var(--color-paper)]/12 bg-[var(--color-night)]/30 p-3.5 text-[length:var(--text-sm)]"
                    >
                      <span className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
                        {item.label[language]}
                      </span>
                      <a
                        className="font-medium text-[var(--color-paper)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-gold)]"
                        href={`mailto:${item.email}`}
                      >
                        {item.email}
                      </a>
                    </div>
                  ))}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]"
          id="general-note"
        >
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-4 lg:col-span-5">
              <h2 className="text-[length:var(--text-display-s)] leading-[1.04] font-medium text-[var(--color-paper)]">
                {isEs ? "Envíanos un mensaje" : "Send a message"}
              </h2>
              <p className="text-[var(--color-paper-2)]">
                {isEs ? (
                  <>
                    Si quieres valorar la fabricación de un producto,{" "}
                    <Link
                      className="underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-paper)]"
                      href={localizeHref("/product-brief")}
                    >
                      inicia un Product Brief
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    For a manufacturing enquiry,{" "}
                    <Link
                      className="underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-paper)]"
                      href={localizeHref("/product-brief")}
                    >
                      start a Product Brief
                    </Link>
                    .
                  </>
                )}
              </p>
            </div>

            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
