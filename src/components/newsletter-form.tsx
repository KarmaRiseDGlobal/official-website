"use client";

import Link from "next/link";
import { useId, useState, useSyncExternalStore } from "react";

interface NewsletterFormProps {
  variant?: "footer" | "light" | "journal";
  source?: string;
}

function subscribeNoop() {
  return () => {};
}

function getBrowserLocaleSnapshot(): string {
  return navigator.language || navigator.languages?.[0] || "en";
}

function getServerLocaleSnapshot(): string {
  return "en";
}

export function NewsletterForm({
  variant = "footer",
  source = "Website",
}: NewsletterFormProps) {
  const emailId = useId();
  const honeypotId = useId();

  const browserLocale = useSyncExternalStore(
    subscribeNoop,
    getBrowserLocaleSnapshot,
    getServerLocaleSnapshot,
  );
  const [manualLanguage, setManualLanguage] = useState<"EN" | "ES" | null>(
    null,
  );
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const detectedLanguage: "EN" | "ES" = browserLocale
    .toLowerCase()
    .startsWith("es")
    ? "ES"
    : "EN";
  const language: "EN" | "ES" = manualLanguage ?? detectedLanguage;
  const hasManualChoice = manualLanguage !== null;

  const isLight = variant === "light" || variant === "journal";
  const isJournal = variant === "journal";
  const isEs = language === "ES";

  function selectLanguage(next: "EN" | "ES") {
    setManualLanguage(next);
    setMessage("");
    setIsError(false);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setIsError(true);
      setMessage(
        isEs
          ? "Pon un correo válido antes de apuntarte."
          : "Enter a valid email address before subscribing.",
      );
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const companyWebsite = String(data.get("companyWebsite") ?? "").trim();

    setIsSubmitting(true);
    setIsError(false);
    setMessage("");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          // Pass explicit language if user toggled or browser detected ES; server also checks cf-ipcountry when not manually overridden.
          language: hasManualChoice || isEs ? language : undefined,
          browserLocale,
          source,
          companyWebsite,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        language?: "EN" | "ES";
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setIsError(true);
        setMessage(
          result.error ??
            (isEs
              ? "No hemos podido guardarlo ahora mismo. Prueba otra vez en unos segundos."
              : "Unable to subscribe right now. Please try again shortly."),
        );
        return;
      }

      const resolvedLang = result.language ?? language;
      setManualLanguage(resolvedLang);
      form.reset();
      setIsError(false);
      setMessage(
        resolvedLang === "ES"
          ? "¡Ya estás dentro! Mira tu bandeja de entrada, te acabamos de mandar una nota."
          : "You are in! Check your inbox for a personal note from Alma & Shirish.",
      );
    } catch {
      setIsError(true);
      setMessage(
        isEs
          ? "No hemos podido conectar con el servidor. Inténtalo de nuevo."
          : "Unable to reach the server right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isJournal) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-6 sm:p-8">
        {/* Top bar with live EN / ES tab switcher */}
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-rule)] pb-4">
          <div className="grid gap-0.5">
            <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
              {isEs
                ? "De nuestra mesa a tu correo"
                : "From our table to your inbox"}
            </p>
            <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
              {isEs
                ? " Te escribiremos en español (puedes cambiar cuando quieras)."
                : "We will write to you in English (switch anytime in one click)."}
            </p>
          </div>

          <div
            role="group"
            aria-label="Choose newsletter language"
            className="inline-flex items-center rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-1"
          >
            <button
              type="button"
              aria-pressed={!isEs}
              onClick={() => selectLanguage("EN")}
              className={`cursor-pointer rounded-[var(--radius-pill)] px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold transition-colors ${
                !isEs
                  ? "bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                  : "text-[var(--color-forest-deep)] hover:text-[var(--color-clay-ink)]"
              }`}
            >
              EN · English
            </button>
            <button
              type="button"
              aria-pressed={isEs}
              onClick={() => selectLanguage("ES")}
              className={`cursor-pointer rounded-[var(--radius-pill)] px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold transition-colors ${
                isEs
                  ? "bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                  : "text-[var(--color-forest-deep)] hover:text-[var(--color-clay-ink)]"
              }`}
            >
              ES · Español
            </button>
          </div>
        </div>

        {/* Live sample issue preview */}
        <div className="mb-6 grid gap-1.5 rounded-[0.85rem] border border-[var(--color-rule)]/80 bg-[var(--color-paper-2)]/65 px-4 py-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)] text-[var(--color-muted)]">
            <span>
              <strong className="font-semibold text-[var(--color-forest-deep)]">
                {isEs ? "De:" : "From:"}
              </strong>{" "}
              Alma &amp; Shirish &lt;stories@karmarisedglobal.com&gt;
            </span>
            <span className="rounded-[var(--radius-pill)] bg-[var(--color-paper)] px-2.5 py-0.5 text-[11px] font-semibold text-[var(--color-clay-ink)]">
              {isEs ? "Vista previa · ES" : "Sample issue · EN"}
            </span>
          </div>
          <p className="font-[family-name:var(--font-display)] text-[length:var(--text-md)] leading-[1.35] text-[var(--color-forest-deep)]">
            {isEs
              ? "«Con un pie en España y otro en Maharashtra: saris con historia, chai en el taller y lo que estamos cosiendo esta semana.»"
              : "“Between Madrid and Maharashtra: forgotten silk sarees, chai with master tailors, and what is on our cutting table this week.”"}
          </p>
        </div>

        <form
          className="grid gap-3"
          data-endpoint="/api/newsletter"
          noValidate
          onSubmit={handleSubmit}
        >
          <div className="hidden" aria-hidden="true">
            <label htmlFor={honeypotId}>Company website</label>
            <input
              id={honeypotId}
              name="companyWebsite"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="sr-only" htmlFor={emailId}>
              {isEs ? "Tu correo electrónico" : "Your email address"}
            </label>
            <input
              id={emailId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder={isEs ? "tu@empresa.com" : "you@company.com"}
              required
              disabled={isSubmitting}
              className="min-h-[var(--control-height)] w-full flex-1 rounded-[0.75rem] border border-[var(--color-rule)] bg-[var(--color-paper)] px-4 text-[var(--color-forest-deep)] transition-colors placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-clay-ink)] focus-visible:outline-none disabled:opacity-55"
            />
            <button
              className="primary-button shrink-0"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEs
                  ? "Apuntándote..."
                  : "Subscribing..."
                : isEs
                  ? "Suscribirse"
                  : "Subscribe"}
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)]">
            <p
              aria-live="polite"
              className={
                isError
                  ? "text-[var(--color-clay-ink)]"
                  : "text-[var(--color-forest-deep)]"
              }
            >
              {message ||
                (isEs
                  ? "Sin ruido ni envíos automáticos. Solo escribimos cuando hay una buena historia."
                  : "No automated noise. We only write when we have a real story to share.")}
            </p>
            <Link
              className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              href="/privacy-policy"
            >
              {isEs ? "Privacidad" : "Privacy policy"}
            </Link>
          </div>
        </form>
      </div>
    );
  }

  return (
    <form
      className="grid gap-2.5"
      data-endpoint="/api/newsletter"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="hidden" aria-hidden="true">
        <label htmlFor={honeypotId}>Company website</label>
        <input
          id={honeypotId}
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* Inline pill / text toggle above the single-field input */}
      <div className="flex items-center gap-2 text-[length:var(--text-xs)]">
        <span
          className={
            isLight
              ? "text-[var(--color-muted)]"
              : "text-[var(--color-paper-2)]/80"
          }
        >
          {isEs ? "Edición:" : "Edition:"}
        </span>
        <button
          type="button"
          aria-pressed={!isEs}
          onClick={() => selectLanguage("EN")}
          className={`cursor-pointer font-semibold transition-colors ${
            !isEs
              ? isLight
                ? "text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] decoration-2 underline-offset-4"
                : "text-[var(--color-gold)] underline decoration-[var(--color-gold)] decoration-2 underline-offset-4"
              : isLight
                ? "text-[var(--color-muted)] hover:text-[var(--color-forest-deep)]"
                : "text-[var(--color-paper-2)]/70 hover:text-[var(--color-paper)]"
          }`}
        >
          English
        </button>
        <span
          aria-hidden="true"
          className={
            isLight
              ? "text-[var(--color-rule-2)]"
              : "text-[var(--color-paper-2)]/40"
          }
        >
          &middot;
        </span>
        <button
          type="button"
          aria-pressed={isEs}
          onClick={() => selectLanguage("ES")}
          className={`cursor-pointer font-semibold transition-colors ${
            isEs
              ? isLight
                ? "text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] decoration-2 underline-offset-4"
                : "text-[var(--color-gold)] underline decoration-[var(--color-gold)] decoration-2 underline-offset-4"
              : isLight
                ? "text-[var(--color-muted)] hover:text-[var(--color-forest-deep)]"
                : "text-[var(--color-paper-2)]/70 hover:text-[var(--color-paper)]"
          }`}
        >
          Español
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="sr-only" htmlFor={emailId}>
          {isEs
            ? "Correo electrónico para historias y novedades"
            : "Email address for Stories and updates"}
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder={isEs ? "tu@empresa.com" : "you@company.com"}
          required
          disabled={isSubmitting}
          className={
            isLight
              ? "min-h-[var(--control-height)] w-full flex-1 rounded-[0.75rem] border border-[var(--color-rule)] bg-[var(--color-paper)] px-4 text-[var(--color-forest-deep)] transition-colors placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-clay-ink)] focus-visible:outline-none disabled:opacity-55"
              : "min-h-[var(--control-height)] w-full flex-1 rounded-[0.75rem] border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/10 px-4 text-[var(--color-paper)] transition-colors placeholder:text-[var(--color-paper-2)]/65 hover:border-[var(--color-paper-2)]/50 focus-visible:border-[var(--color-gold)] focus-visible:outline-none disabled:opacity-55"
          }
        />

        <button
          className="primary-button shrink-0"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEs
              ? "Apuntándote..."
              : "Subscribing..."
            : isEs
              ? "Suscribirse"
              : "Subscribe"}
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)]">
        <p
          aria-live="polite"
          className={
            isError
              ? isLight
                ? "text-[var(--color-clay-ink)]"
                : "text-[var(--color-gold)]"
              : isLight
                ? "text-[var(--color-forest-deep)]"
                : "text-[var(--color-paper-2)]"
          }
        >
          {message ||
            (isEs
              ? "Cartas de Alma y Shirish en español o inglés. Darte de baja en un clic."
              : "Letters from Alma & Shirish in English or Spanish. Unsubscribe anytime.")}
        </p>
        <Link
          className={
            isLight
              ? "underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              : "text-[var(--color-paper-2)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-gold)]"
          }
          href="/privacy-policy"
        >
          {isEs ? "Privacidad" : "Privacy policy"}
        </Link>
      </div>
    </form>
  );
}
