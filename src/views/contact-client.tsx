"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

import { ContactForm } from "@/components/forms/contact-form";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";
import { OFFICIAL_SOCIALS } from "@/data/socials";
import { scrollElementIntoViewSafe } from "@/lib/client-handoff";

const WHATSAPP_HREF: Record<SiteLanguage, string> = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma and Shirish, I would like to get in touch with KarmaRise D Global.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma y Shirish, me gustaría ponerme en contacto con KarmaRise D Global.")}`,
};

const SECONDARY_EMAILS: ReadonlyArray<{
  email: string;
  label: Record<SiteLanguage, string>;
}> = [
  {
    email: "hola@karmarisedglobal.com",
    label: {
      en: "Spain, rest of Europe & international",
      es: "España, resto de Europa e internacional",
    },
  },
  {
    email: "namaste@karmarisedglobal.com",
    label: {
      en: "India & general enquiries",
      es: "India y consultas generales",
    },
  },
  {
    email: "stories@karmarisedglobal.com",
    label: {
      en: "AlmaRise D Brand, Stories & press",
      es: "AlmaRise D Brand, Historias y prensa",
    },
  },
  {
    email: "accounts@karmarisedglobal.com",
    label: {
      en: "Billing, invoicing & GST",
      es: "Facturación y documentación GST",
    },
  },
  {
    email: "support@karmarisedglobal.com",
    label: {
      en: "Support, privacy & Grievance Officer",
      es: "Privacidad, soporte y reclamaciones",
    },
  },
];

export function ContactPageClient({
  lang,
}: {
  lang?: SiteLanguage;
} = {}) {
  const { language: contextLanguage, localizeHref } = useLanguage();
  const language = lang ?? contextLanguage;
  const isEs = language === "es";

  const formContainerRef = useRef<HTMLDivElement | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<string>("General enquiry");

  function jumpToMessageForm(topicValue: string) {
    setSelectedTopic(topicValue);
    scrollElementIntoViewSafe(formContainerRef.current, "start");
  }

  return (
    <>
      <main id="main">
        {/* Band 1: Warm Parchment Two Open Doors: Spain & India */}
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-md))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-xl)]">
            <nav
              aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
              className="flex items-center text-[length:var(--text-xs)] font-medium"
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
                <li aria-hidden="true" className="text-[var(--color-muted)]">
                  /
                </li>
                <li
                  aria-current="page"
                  className="inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-clay-ink)]"
                >
                  {isEs ? "Contacto" : "Contact"}
                </li>
              </ol>
            </nav>

            <div className="grid gap-3">
              <h1 className="m-0 max-w-[15ch] text-[length:var(--text-display)] leading-[1.06] font-normal">
                {isEs
                  ? "Habla con Alma y Shirish."
                  : "Say hello to Alma and Shirish."}
              </h1>
              <p className="lead m-0 max-w-[46ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Una cofundadora en España para marcas y tiendas europeas, un cofundador en la India junto a las unidades de producción. Elige la puerta que mejor encaje contigo."
                  : "One co-founder in Spain for European brands and boutiques, one co-founder in India alongside our makers. Reach whichever door fits best."}
              </p>
            </div>

            <div className="grid gap-x-[var(--gap-columns)] gap-y-[var(--space-2xl)] lg:grid-cols-2">
              {/* Door 1: Alma, Spain & rest of Europe */}
              <article className="grid min-w-0 content-between gap-6">
                <div className="grid min-w-0 gap-5">
                  <div className="editorial-photo-frame aspect-[5/4] w-full">
                    <Image
                      src="/images/founders/alma-swing-laughing.jpeg"
                      alt={
                        isEs
                          ? "Alma riendo en un columpio de madera en la India"
                          : "Alma laughing warmly on a wooden porch swing in India"
                      }
                      fill
                      priority
                      sizes="(max-width: 64rem) 100vw, 44vw"
                      className="object-cover object-[50%_42%]"
                    />
                  </div>

                  <div className="grid min-w-0 gap-2">
                    <h2 className="m-0 text-[length:var(--text-2xl)] leading-[1.15] font-normal text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Alma · España y resto de Europa"
                        : "Alma · Spain & rest of Europe"}
                    </h2>
                    <p className="m-0 text-[length:var(--text-xs)] font-semibold text-[var(--color-clay-ink)]">
                      {isEs
                        ? "Producción propia, tiendas y AlmaRise D Brand (ES, EN, PT)"
                        : "Own-brand production, boutiques, and AlmaRise D Brand (EN, ES, PT)"}
                    </p>
                    <p className="m-0 max-w-[46ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
                      {isEs
                        ? "Empieza por aquí si quieres fabricar bolsos y artículos de piel, ropa, complementos textiles o decoración del hogar en la India, o preguntar por las piezas de AlmaRise D Brand."
                        : "Start here if you want to make leather goods, clothing, textile accessories, or textile home decor in India, or ask about AlmaRise D Brand pieces."}
                    </p>
                  </div>
                </div>

                <div className="grid min-w-0 gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <Link
                      className="primary-button-light"
                      href={localizeHref("/book-a-call?duration=15")}
                    >
                      {isEs
                        ? "Reservar llamada con Alma"
                        : "Book a call with Alma"}
                    </Link>
                    <Link
                      className="secondary-button-light"
                      href={localizeHref("/product-brief")}
                    >
                      {isEs
                        ? "Empezar briefing de producto"
                        : "Start a Product Brief"}
                    </Link>
                  </div>

                  <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 text-[length:var(--text-sm)]">
                    <a
                      href="mailto:alma@karmarisedglobal.com"
                      className="inline-flex min-h-[var(--tap-min)] max-w-full min-w-0 items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    >
                      <span className="min-w-0 [overflow-wrap:anywhere] break-words">
                        alma@karmarisedglobal.com
                      </span>
                    </a>
                    <a
                      href={WHATSAPP_HREF[language]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[var(--tap-min)] max-w-full items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    >
                      WhatsApp (+34 611 722 276)
                      <span className="sr-only">
                        {isEs
                          ? " (se abre en una nueva pestaña)"
                          : " (opens in a new tab)"}
                      </span>
                    </a>
                    <a
                      href={OFFICIAL_SOCIALS.almaLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[var(--tap-min)] max-w-full items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    >
                      LinkedIn
                      <span className="sr-only">
                        {isEs
                          ? " de Alma (se abre en una nueva pestaña)"
                          : " (Alma, opens in a new tab)"}
                      </span>
                    </a>
                  </div>
                </div>
              </article>

              {/* Door 2: Shirish, India & Makers */}
              <article className="grid min-w-0 content-between gap-6">
                <div className="grid min-w-0 gap-5">
                  <div className="editorial-photo-frame aspect-[5/4] w-full">
                    <Image
                      src="/images/workshops/shirish-at-leather-warehouse-desk.jpeg"
                      alt={
                        isEs
                          ? "Shirish, cofundador en la India y abogado colegiado, sentado en una mesa de revisión rodeado de pieles y muestras de bolsos"
                          : "Shirish, co-founder in India and registered Bar Council advocate, seated at a review desk surrounded by leather hides and sample bags"
                      }
                      fill
                      priority
                      sizes="(max-width: 64rem) 100vw, 44vw"
                      className="object-cover object-[50%_20%]"
                    />
                  </div>

                  <div className="grid min-w-0 gap-2">
                    <h2 className="m-0 text-[length:var(--text-2xl)] leading-[1.15] font-normal text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Shirish · India y producción"
                        : "Shirish · India & makers"}
                    </h2>
                    <p className="m-0 text-[length:var(--text-xs)] font-semibold text-[var(--color-clay-ink)]">
                      {isEs
                        ? "Fábricas familiares, colectivos de artesanas y supervisión legal"
                        : "Family-run factories, artisan collectives, and legal oversight"}
                    </p>
                    <p className="m-0 max-w-[46ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
                      {isEs
                        ? "Escribe a Shirish si diriges una fábrica familiar de piel, una unidad de confección o un colectivo de artesanas en la India, o si tienes dudas sobre contratos y control sobre el terreno."
                        : "Write to Shirish if you run a family-run leather factory, garment unit, or women's artisan collective in India, or have questions on Indian contracts and on-ground checks."}
                    </p>
                  </div>
                </div>

                <div className="grid min-w-0 gap-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        jumpToMessageForm("Manufacturing Partner introduction")
                      }
                      className="secondary-button-light"
                    >
                      {isEs
                        ? "Presentar tu unidad de producción"
                        : "Introduce your production unit"}
                    </button>
                  </div>

                  <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 text-[length:var(--text-sm)]">
                    <a
                      href="mailto:shirish@karmarisedglobal.com"
                      className="inline-flex min-h-[var(--tap-min)] max-w-full min-w-0 items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    >
                      <span className="min-w-0 [overflow-wrap:anywhere] break-words">
                        shirish@karmarisedglobal.com
                      </span>
                    </a>
                    <a
                      href="tel:+918530009798"
                      className="inline-flex min-h-[var(--tap-min)] max-w-full items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    >
                      +91 8530009798
                    </a>
                    <a
                      href={OFFICIAL_SOCIALS.shirishLinkedIn}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[var(--tap-min)] max-w-full items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    >
                      LinkedIn
                      <span className="sr-only">
                        {isEs
                          ? " de Shirish (se abre en una nueva pestaña)"
                          : " (Shirish, opens in a new tab)"}
                      </span>
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* Band 2: Warm Dune Note Composer */}
        <section
          className="bg-[var(--color-dune)] py-[var(--space-2xl)] text-[var(--color-forest-deep)]"
          id="general-note"
        >
          <div
            ref={formContainerRef}
            className="container grid scroll-mt-0 items-start gap-[var(--space-xl)] lg:grid-cols-12 lg:gap-[var(--gap-columns)]"
          >
            <div className="grid min-w-0 content-start gap-6 lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:col-span-5">
              <div className="grid gap-3">
                <h2 className="m-0 max-w-[14ch] text-[length:var(--text-section)] leading-[1.06] font-normal text-[var(--color-forest-deep)]">
                  {isEs ? "Escríbenos una nota." : "Write us a note."}
                </h2>
                <p className="m-0 max-w-[44ch] text-[length:var(--text-md)] leading-[1.64] text-[var(--color-ink-2)]">
                  {isEs ? (
                    <>
                      Elige un asunto y escríbenos directamente desde aquí. Alma
                      o Shirish lee cada mensaje y responde en 1 o 2 días
                      laborables. ¿Ya tienes una pieza en mente?{" "}
                      <Link
                        className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href={localizeHref("/product-brief")}
                      >
                        Empieza un briefing de producto
                      </Link>
                      .
                    </>
                  ) : (
                    <>
                      Choose a topic and write straight to us here. Alma or
                      Shirish reads every message and replies within 1 to 2
                      business days. Already have a product in mind?{" "}
                      <Link
                        className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href={localizeHref("/product-brief")}
                      >
                        Start a Product Brief
                      </Link>
                      .
                    </>
                  )}
                </p>
              </div>

              <figure className="editorial-photo-frame m-0 aspect-[16/10] w-full">
                <Image
                  src="/images/workshops/alma-shirish-india-office-meeting.jpg"
                  alt={
                    isEs
                      ? "Alma, Shirish y su equipo reunidos alrededor de la mesa en la oficina de KarmaRise en la India"
                      : "Alma, Shirish, and their team seated around the meeting table at the KarmaRise office in India"
                  }
                  fill
                  sizes="(max-width: 64rem) 100vw, 38vw"
                  className="object-cover object-[50%_46%]"
                />
              </figure>
            </div>

            <div className="min-w-0 lg:col-span-7">
              <ContactForm
                selectedTopic={selectedTopic}
                onTopicChange={setSelectedTopic}
              />
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="forest-deep" size="gentle" />

        {/* Band 3: Compact Statutory Deep Forest Strip + Single Collapsible Email Directory */}
        <section
          data-surface="dark"
          className="bg-[var(--color-forest-deep)] py-[var(--section-gap-s)] text-[var(--color-paper)]"
        >
          <div className="container grid items-start gap-[var(--space-xl)] lg:grid-cols-12 lg:gap-[var(--gap-columns)]">
            <div className="grid min-w-0 gap-3 lg:col-span-5">
              <h2 className="m-0 text-[length:var(--text-2xl)] leading-[1.15] font-normal text-[var(--color-paper)]">
                {isEs
                  ? "Domicilio social y datos de la empresa"
                  : "Registered office and company details"}
              </h2>
              <p className="m-0 max-w-[44ch] text-[length:var(--text-sm)] leading-relaxed text-[var(--color-paper-2)]">
                {isEs ? (
                  <>
                    KarmaRise D Global está operada por{" "}
                    <strong className="font-semibold text-[var(--color-paper)]">
                      Karmarise Global LLP
                    </strong>{" "}
                    (LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL), constituida en
                    la India el 15 de mayo de 2025.
                  </>
                ) : (
                  <>
                    KarmaRise D Global is operated by{" "}
                    <strong className="font-semibold text-[var(--color-paper)]">
                      Karmarise Global LLP
                    </strong>{" "}
                    (LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL), incorporated in
                    India on 15 May 2025.
                  </>
                )}
              </p>
            </div>

            <div className="grid min-w-0 gap-6 lg:col-span-7">
              <address className="grid min-w-0 gap-1 not-italic">
                <span className="text-[length:var(--text-xs)] font-semibold text-[var(--color-paper-2)]">
                  {isEs
                    ? "Domicilio social registrado (India)"
                    : "Registered office address (India)"}
                </span>
                <a
                  className="inline-flex min-h-[var(--tap-min)] max-w-full min-w-0 items-center py-1 text-[length:var(--text-sm)] text-[var(--color-paper)] underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-gold)]"
                  href="https://www.google.com/maps/place/Guru+Charan/@19.2324905,73.1534675,49m/data=!3m1!1e3!4m6!3m5!1s0x3be7943c1ba890cf:0x3c332f2cfae05f64!8m2!3d19.2325!4d73.1536!16s%2Fg%2F1pyqv_7by?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="min-w-0 [overflow-wrap:anywhere] break-words">
                    2nd floor, Guru Charan Apartment, Ulhasnagar, Maharashtra,
                    India, 421002
                  </span>
                  <span className="sr-only">
                    {isEs
                      ? " (se abre en Google Maps en una nueva pestaña)"
                      : " (opens in Google Maps in a new tab)"}
                  </span>
                </a>
              </address>

              <div className="min-w-0">
                <details className="group grid min-w-0 gap-4">
                  <summary className="inline-flex min-h-[var(--tap-min)] w-fit max-w-full cursor-pointer list-none items-center gap-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-gold)]">
                    <span className="min-w-0">
                      {isEs
                        ? "Correos generales, prensa y facturación"
                        : "General, press, and billing emails"}
                    </span>
                    <svg
                      aria-hidden="true"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="shrink-0 duration-[var(--dur-short)] group-open:rotate-180 motion-safe:transition-transform"
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </summary>

                  <div className="grid min-w-0 gap-3 sm:grid-cols-2">
                    {SECONDARY_EMAILS.map((item) => (
                      <div
                        key={item.email}
                        className="grid min-w-0 gap-0.5 rounded-[var(--radius-input)] bg-[var(--color-night)]/35 p-3.5 text-[length:var(--text-sm)]"
                      >
                        <span className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]">
                          {item.label[language]}
                        </span>
                        <a
                          href={`mailto:${item.email}`}
                          className="inline-flex min-h-[var(--tap-min)] max-w-full min-w-0 items-center font-semibold text-[var(--color-paper)] underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-gold)]"
                        >
                          <span className="min-w-0 [overflow-wrap:anywhere] break-words">
                            {item.email}
                          </span>
                        </a>
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="forest-deep" to="night" />
      </main>

      <SiteFooter hideNewsletter />
    </>
  );
}
