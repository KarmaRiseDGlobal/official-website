"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { ContactForm } from "@/components/forms/contact-form";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";
import { CONTACT_DEPARTMENTS } from "@/data/conversion-content";

type ContactIntent = "product" | "call" | "workshop" | "general";

const WHATSAPP_HREF: Record<SiteLanguage, string> = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma and Shirish, I would like to get in touch with KarmaRise D Global.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma y Shirish, me gustaría ponerme en contacto con KarmaRise D Global.")}`,
};

const STANDARD_EMAILS: ReadonlyArray<{
  email: string;
  label: Record<SiteLanguage, string>;
}> = [
  {
    email: "hola@karmarisedglobal.com",
    label: {
      en: "Spain, Europe & international",
      es: "España, Europa e internacional",
    },
  },
  {
    email: "namaste@karmarisedglobal.com",
    label: {
      en: "India & general enquiries",
      es: "India y consultas generales",
    },
  },
];

const INTENT_CARDS: ReadonlyArray<{
  id: ContactIntent;
  title: Record<SiteLanguage, string>;
  subtitle: Record<SiteLanguage, string>;
  relevantEmails: ReadonlyArray<{
    email: string;
    note: Record<SiteLanguage, string>;
  }>;
}> = [
  {
    id: "product",
    title: { en: "Make a product", es: "Fabricar un producto" },
    subtitle: {
      en: "Own-brand leather bags, clothing, or custom sewn goods in India",
      es: "Bolsos de piel, prendas o piezas confeccionadas a medida en la India",
    },
    relevantEmails: [
      {
        email: "inquiry@karmarisedglobal.com",
        note: {
          en: "New Product Briefs & project enquiries",
          es: "Nuevos briefings de producto y proyectos",
        },
      },
      {
        email: "alma@karmarisedglobal.com",
        note: {
          en: "Alma (Spain & Europe Clients)",
          es: "Alma (clientes en España y Europa)",
        },
      },
    ],
  },
  {
    id: "call",
    title: { en: "Talk to Alma live", es: "Hablar con Alma en directo" },
    subtitle: {
      en: "Free 15 or 30 min Google Meet in EN, ES, or PT",
      es: "Videollamada gratis de 15 o 30 min por Google Meet en ES, EN o PT",
    },
    relevantEmails: [
      {
        email: "alma@karmarisedglobal.com",
        note: {
          en: "Alma (Spain & Europe)",
          es: "Alma (España y Europa)",
        },
      },
    ],
  },
  {
    id: "workshop",
    title: {
      en: "I run a workshop in India",
      es: "Tengo un taller en la India",
    },
    subtitle: {
      en: "Introduce your family-run factory or artisan collective",
      es: "Presenta tu fábrica familiar o tu colectivo de artesanas",
    },
    relevantEmails: [
      {
        email: "partners@karmarisedglobal.com",
        note: {
          en: "Manufacturing Partners & artisans in India",
          es: "Talleres colaboradores y artesanos en la India",
        },
      },
      {
        email: "shirish@karmarisedglobal.com",
        note: {
          en: "Shirish (India operations)",
          es: "Shirish (operaciones en la India)",
        },
      },
    ],
  },
  {
    id: "general",
    title: {
      en: "AlmaRise D Brand, Stories, or general",
      es: "AlmaRise D Brand, Historias o general",
    },
    subtitle: {
      en: "Saree and organic pieces, press, training, or any other question",
      es: "Prendas de sari y línea orgánica, prensa, formación o cualquier otra duda",
    },
    relevantEmails: [
      {
        email: "stories@karmarisedglobal.com",
        note: {
          en: "AlmaRise D Brand, Stories & press",
          es: "AlmaRise D Brand, Historias y prensa",
        },
      },
      {
        email: "hola@karmarisedglobal.com",
        note: {
          en: "General enquiries",
          es: "Consultas generales",
        },
      },
    ],
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

  const formSectionRef = useRef<HTMLElement | null>(null);
  const [selectedIntent, setSelectedIntent] = useState<ContactIntent | null>(
    null,
  );
  const [selectedTopic, setSelectedTopic] = useState<string>("General enquiry");

  const activeIntentCard = selectedIntent
    ? (INTENT_CARDS.find((card) => card.id === selectedIntent) ?? null)
    : null;

  function handleChooseIntent(intent: ContactIntent) {
    setSelectedIntent(intent);
    if (intent === "workshop") {
      setSelectedTopic("Manufacturing Partner introduction");
    } else if (intent === "general") {
      setSelectedTopic("AlmaRise D Brand");
    } else {
      setSelectedTopic("General enquiry");
    }
  }

  function jumpToMessageForm(topicValue: string) {
    setSelectedTopic(topicValue);
    formSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-xl)]">
            {/* Top 1px Hairline Breadcrumb & Context Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[var(--color-rule)] py-3.5 text-[length:var(--text-xs)] font-semibold tracking-[0.08em] uppercase">
              <nav
                aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
                className="flex items-center gap-2"
              >
                <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                  <li>
                    <Link
                      className="text-[var(--color-muted)] no-underline transition-colors hover:text-[var(--color-forest-deep)]"
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
                    className="text-[var(--color-clay-ink)]"
                  >
                    {isEs ? "Contacto" : "Contact"}
                  </li>
                </ol>
              </nav>
              <span className="text-[var(--color-muted)]">
                {isEs
                  ? "España e India · Respuesta personal en 1 o 2 días laborables"
                  : "Spain & India · Personal reply within 1–2 business days"}
              </span>
            </div>

            <div className="grid gap-[var(--space-md)]">
              <h1 className="max-w-[15ch] text-[clamp(2.25rem,4.8vw,4.5rem)] leading-[0.98] font-medium">
                {isEs
                  ? "Habla con Alma y Shirish."
                  : "Say hello to Alma and Shirish."}
              </h1>
              <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Elige el motivo de tu consulta para ir directo al camino más rápido, o mándanos una nota abajo en español o en inglés."
                  : "Choose what brings you here to jump straight to the right path, or send us a note below in English or Spanish."}
              </p>
            </div>

            {/* Guided 4-intent chooser */}
            <div className="grid gap-5">
              <div
                role="group"
                aria-label={
                  isEs ? "¿En qué podemos ayudarte?" : "How can we help?"
                }
                className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
              >
                {INTENT_CARDS.map((card) => {
                  const active = selectedIntent === card.id;
                  return (
                    <button
                      key={card.id}
                      type="button"
                      aria-pressed={active}
                      onClick={() => handleChooseIntent(card.id)}
                      className={`grid min-h-[44px] cursor-pointer content-start gap-1.5 rounded-[var(--radius-card)] border p-5 text-left transition-colors ${
                        active
                          ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                          : "border-[var(--color-rule)] bg-[var(--color-paper-2)]/70 text-[var(--color-forest-deep)] hover:border-[var(--color-forest)] hover:bg-[var(--color-paper-2)]"
                      }`}
                    >
                      <span className="font-display text-[length:var(--text-xl)] leading-snug font-medium">
                        {card.title[language]}
                      </span>
                      <span
                        className={`text-[length:var(--text-xs)] leading-relaxed ${
                          active
                            ? "text-[var(--color-paper-2)]"
                            : "text-[var(--color-muted)]"
                        }`}
                      >
                        {card.subtitle[language]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Contextual recommendation panel with relevant emails only */}
              {activeIntentCard ? (
                <div
                  aria-live="polite"
                  className="grid gap-6 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] p-6 shadow-[var(--shadow-card)] sm:p-7 lg:grid-cols-12 lg:items-center"
                >
                  <div className="grid gap-3 lg:col-span-7">
                    {activeIntentCard.id === "product" ? (
                      <>
                        <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]">
                          {isEs
                            ? "Empieza con un briefing de producto de 1 minuto o una llamada"
                            : "Start with a 1-minute Product Brief or a quick call"}
                        </h2>
                        <p className="max-w-[54ch] text-[length:var(--text-sm)] text-[var(--color-muted)]">
                          {isEs
                            ? "No necesitas fichas técnicas cerradas. Comparte el tipo de pieza y en qué punto estás, o reserva 15 minutos con Alma para comentarlo."
                            : "No finished tech pack required. Share what you want to make in 3 quick steps, or book 15 minutes with Alma to talk it through."}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <Link
                            className="primary-button"
                            href={localizeHref("/product-brief")}
                          >
                            {isEs
                              ? "Empezar briefing de producto"
                              : "Start a Product Brief"}
                          </Link>
                          <Link
                            className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-forest-deep)] px-5 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] no-underline transition-colors hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                            href={localizeHref("/book-a-call?duration=15")}
                          >
                            {isEs
                              ? "Videollamada de 15 min"
                              : "Book a 15-min call"}
                          </Link>
                        </div>
                      </>
                    ) : null}

                    {activeIntentCard.id === "call" ? (
                      <>
                        <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]">
                          {isEs
                            ? "Elige un hueco por Google Meet con Alma"
                            : "Pick a Google Meet time with Alma"}
                        </h2>
                        <p className="max-w-[54ch] text-[length:var(--text-sm)] text-[var(--color-muted)]">
                          {isEs
                            ? "Elige 15 minutos para una consulta rápida o 30 minutos para repasar tu briefing de producto, materiales y plazos en la India."
                            : "Choose 15 minutes for a quick intro or 30 minutes to go through your Product Brief, materials, and timelines in India."}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <Link
                            className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-6 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] no-underline transition-colors hover:bg-[var(--color-forest)]"
                            href={localizeHref("/book-a-call?duration=15")}
                          >
                            {isEs
                              ? "Consulta rápida (15 min)"
                              : "Quick intro (15 min)"}
                          </Link>
                          <Link
                            className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-forest-deep)] px-5 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] no-underline transition-colors hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                            href={localizeHref("/book-a-call?duration=30")}
                          >
                            {isEs
                              ? "Repasar briefing de producto (30 min)"
                              : "Product Brief call (30 min)"}
                          </Link>
                          <a
                            href={WHATSAPP_HREF[language]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                          >
                            WhatsApp
                          </a>
                        </div>
                      </>
                    ) : null}

                    {activeIntentCard.id === "workshop" ? (
                      <>
                        <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]">
                          {isEs
                            ? "Presenta tu taller en la India"
                            : "Introduce your workshop in India"}
                        </h2>
                        <p className="max-w-[54ch] text-[length:var(--text-sm)] text-[var(--color-muted)]">
                          {isEs
                            ? "Cuéntanos dónde trabajas, en qué materiales y acabados estás especializado y qué volúmenes de pedido puedes asumir."
                            : "Tell us where you are based, what materials and products you specialize in, and the run sizes your floor can handle."}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              jumpToMessageForm(
                                "Manufacturing Partner introduction",
                              )
                            }
                            className="primary-button cursor-pointer"
                          >
                            {isEs
                              ? "Escribir desde el formulario"
                              : "Send workshop details below"}
                          </button>
                          <a
                            href="tel:+918530009798"
                            className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                          >
                            {isEs
                              ? "Llamar a Shirish (+91 8530009798)"
                              : "Call Shirish (+91 8530009798)"}
                          </a>
                        </div>
                      </>
                    ) : null}

                    {activeIntentCard.id === "general" ? (
                      <>
                        <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]">
                          {isEs
                            ? "AlmaRise D Brand, Historias o cualquier otra consulta"
                            : "AlmaRise D Brand, Stories, or any other question"}
                        </h2>
                        <p className="max-w-[54ch] text-[length:var(--text-sm)] text-[var(--color-muted)]">
                          {isEs
                            ? "Escríbenos abajo en el formulario con el asunto que prefieras o envía un correo directo."
                            : "Send us a short note in the form below or email the right inbox directly."}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 pt-1">
                          <button
                            type="button"
                            onClick={() =>
                              jumpToMessageForm("AlmaRise D Brand")
                            }
                            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-5 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] transition-colors hover:bg-[var(--color-forest)]"
                          >
                            {isEs
                              ? "Escribir sobre AlmaRise D Brand"
                              : "Write about AlmaRise D Brand"}
                          </button>
                          <button
                            type="button"
                            onClick={() => jumpToMessageForm("General enquiry")}
                            className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-forest-deep)] px-5 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] transition-colors hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                          >
                            {isEs ? "Consulta general" : "General question"}
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>

                  {/* Relevant email(s) specifically for the chosen enquiry */}
                  <div className="grid gap-3 border-t border-[var(--color-rule)] pt-4 lg:col-span-5 lg:border-t-0 lg:border-l lg:pt-0 lg:pl-6">
                    <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
                      {isEs
                        ? "Correo directo para esta consulta"
                        : "Direct email for this enquiry"}
                    </p>
                    <ul className="m-0 grid list-none gap-2.5 p-0">
                      {activeIntentCard.relevantEmails.map((item) => (
                        <li
                          key={item.email}
                          className="grid gap-0.5 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)]/70 px-3.5 py-2.5"
                        >
                          <span className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                            {item.note[language]}
                          </span>
                          <a
                            href={`mailto:${item.email}`}
                            className="inline-flex min-h-[38px] items-center text-[length:var(--text-sm)] font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                          >
                            {item.email}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                /* Default compact prompt before an intent is clicked */
                <div className="flex flex-wrap items-center justify-between gap-4 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]/60 px-6 py-4 text-[length:var(--text-sm)] text-[var(--color-ink-2)]">
                  <span>
                    {isEs
                      ? "¿Quieres empezar ya? Manda un briefing de producto en 1 minuto o reserva una llamada gratis de 15 minutos con Alma."
                      : "Ready to get moving? Start a 1-minute Product Brief or book a free 15-minute call with Alma."}
                  </span>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href={localizeHref("/product-brief")}
                      className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    >
                      {isEs ? "Briefing de producto" : "Product Brief"}
                    </Link>
                    <Link
                      href={localizeHref("/book-a-call?duration=15")}
                      className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    >
                      {isEs ? "Videollamada de 15 min" : "15-min call"}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="wood" />

        <section
          ref={formSectionRef}
          className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]"
          id="general-note"
        >
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid min-w-0 gap-4 lg:col-span-5">
              <h2 className="text-[length:var(--text-display-s)] leading-[1.04] font-medium text-[var(--color-paper)]">
                {isEs ? "Mándanos una nota" : "Send us a note"}
              </h2>
              <p className="text-[var(--color-paper-2)]">
                {isEs ? (
                  <>
                    Elige un asunto para ver el correo directo o escríbenos
                    desde aquí. Alma o Shirish lee cada mensaje y responde
                    personalmente en 1 o 2 días laborables. Si ya tienes un
                    producto en mente,{" "}
                    <Link
                      className="underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-paper)]"
                      href={localizeHref("/product-brief")}
                    >
                      empieza un briefing de producto
                    </Link>
                    .
                  </>
                ) : (
                  <>
                    Choose a topic to see the direct inbox, or write straight to
                    us here. Alma or Shirish reads every message and replies
                    personally within 1–2 business days. If you already have a
                    product in mind,{" "}
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

            <div className="min-w-0 lg:col-span-7">
              <ContactForm
                selectedTopic={selectedTopic}
                onTopicChange={setSelectedTopic}
              />
            </div>
          </div>
        </section>

        <SectionBridge from="wood" to="forest-deep" />

        {/* Standard direct details (uncluttered, standard emails only) */}
        <section className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-4 lg:col-span-5">
              <h2 className="text-[length:var(--text-display-s)] leading-[1.04] font-medium text-[var(--color-paper)]">
                {isEs
                  ? "Contacto directo y domicilio social"
                  : "Direct contacts and registered office"}
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

            <dl className="m-0 grid min-w-0 gap-6 text-[var(--color-paper-2)] lg:col-span-7">
              <div className="grid min-w-0 gap-3 border-t border-[var(--color-paper)]/15 pt-4">
                <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                  {isEs ? "Correos generales" : "General email"}
                </dt>
                <dd className="m-0 grid min-w-0 gap-3 sm:grid-cols-2">
                  {STANDARD_EMAILS.map((item) => (
                    <div
                      key={item.email}
                      className="grid min-w-0 gap-0.5 rounded-xl border border-[var(--color-paper)]/12 bg-[var(--color-night)]/30 p-3.5 text-[length:var(--text-sm)]"
                    >
                      <span className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
                        {item.label[language]}
                      </span>
                      <a
                        className="inline-flex min-h-[44px] min-w-0 items-center font-medium [overflow-wrap:anywhere] break-words text-[var(--color-paper)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-gold)]"
                        href={`mailto:${item.email}`}
                      >
                        {item.email}
                      </a>
                    </div>
                  ))}
                </dd>
              </div>

              <div className="grid gap-6 border-t border-[var(--color-paper)]/15 pt-4 sm:grid-cols-2">
                <div className="grid min-w-0 gap-1">
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                    {isEs
                      ? "España y Europa · Alma (teléfono y WhatsApp)"
                      : "Spain & Europe · Alma (phone & WhatsApp)"}
                  </dt>
                  <dd className="m-0 flex flex-wrap items-center gap-x-4">
                    <a
                      className="inline-flex min-h-[44px] items-center underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-paper)]"
                      href="tel:+34611722276"
                    >
                      +34 611722276
                    </a>
                    <a
                      href={WHATSAPP_HREF[language]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)]"
                    >
                      WhatsApp
                    </a>
                  </dd>
                </div>
                <div className="grid min-w-0 gap-1">
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                    {isEs ? "India · Shirish" : "India · Shirish"}
                  </dt>
                  <dd className="m-0">
                    <a
                      className="inline-flex min-h-[44px] items-center underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-paper)]"
                      href="tel:+918530009798"
                    >
                      +91 8530009798
                    </a>
                  </dd>
                </div>
              </div>

              <div className="grid min-w-0 gap-1 border-t border-[var(--color-paper)]/15 pt-4">
                <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                  {isEs
                    ? "Domicilio social registrado (India)"
                    : "Registered office address (India)"}
                </dt>
                <dd className="m-0">
                  <a
                    className="inline-flex min-h-[44px] items-center py-1 underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-paper)]"
                    href="https://www.google.com/maps/place/Guru+Charan/@19.2324905,73.1534675,49m/data=!3m1!1e3!4m6!3m5!1s0x3be7943c1ba890cf:0x3c332f2cfae05f64!8m2!3d19.2325!4d73.1536!16s%2Fg%2F1pyqv_7by?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D"
                  >
                    2nd floor, Guru Charan Apartment, Ulhasnagar, Maharashtra,
                    India, 421002
                  </a>
                </dd>
              </div>

              <div className="grid min-w-0 gap-3 border-t border-[var(--color-paper)]/15 pt-4">
                <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                  {isEs
                    ? "Correos por área y cofundadores"
                    : "Department & founder emails"}
                </dt>
                <dd className="m-0 grid min-w-0 gap-3 sm:grid-cols-2">
                  {CONTACT_DEPARTMENTS.map((dept) => (
                    <div
                      key={dept.id}
                      className="grid min-w-0 gap-0.5 rounded-xl border border-[var(--color-paper)]/12 bg-[var(--color-night)]/30 p-3.5 text-[length:var(--text-sm)]"
                    >
                      <span className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
                        {dept.role[language]}
                      </span>
                      <a
                        className="inline-flex min-h-[44px] min-w-0 items-center font-medium [overflow-wrap:anywhere] break-words text-[var(--color-paper)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-gold)]"
                        href={`mailto:${dept.email}`}
                      >
                        {dept.email}
                      </a>
                    </div>
                  ))}
                </dd>
              </div>

              <div className="grid min-w-0 gap-2 border-t border-[var(--color-paper)]/15 pt-4">
                <details className="group grid gap-2">
                  <summary className="inline-flex min-h-[40px] w-fit cursor-pointer list-none items-center text-[length:var(--text-xs)] font-semibold text-[var(--color-paper-2)]/85 underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]">
                    {isEs
                      ? "Facturación, privacidad y reclamaciones (desplegar)"
                      : "Billing, privacy, and support emails"}
                  </summary>
                  <div className="grid gap-2 pt-2 text-[length:var(--text-xs)] text-[var(--color-paper-2)] sm:grid-cols-2">
                    <p className="m-0">
                      <span className="block text-[var(--color-paper-2)]/70">
                        {isEs
                          ? "Facturación y documentación GST"
                          : "Billing, invoicing & GST"}
                      </span>
                      <a
                        href="mailto:accounts@karmarisedglobal.com"
                        className="font-semibold text-[var(--color-paper)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-gold)]"
                      >
                        accounts@karmarisedglobal.com
                      </a>
                    </p>
                    <p className="m-0">
                      <span className="block text-[var(--color-paper-2)]/70">
                        {isEs
                          ? "Privacidad, soporte y reclamaciones"
                          : "Support, privacy & Grievance Officer"}
                      </span>
                      <a
                        href="mailto:support@karmarisedglobal.com"
                        className="font-semibold text-[var(--color-paper)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-gold)]"
                      >
                        support@karmarisedglobal.com
                      </a>
                    </p>
                  </div>
                </details>
              </div>
            </dl>
          </div>
        </section>

        <SectionBridge from="forest-deep" to="night" />
      </main>

      <SiteFooter hideNewsletter />
    </>
  );
}
