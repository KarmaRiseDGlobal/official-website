"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { TurnstileField } from "@/components/turnstile-field";
import { useLanguage } from "@/context/language-context";

const IS_TURNSTILE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
);

interface NewsletterFormProps {
  variant?: "footer" | "light" | "journal";
  source?: string;
}

export function NewsletterForm({
  variant = "footer",
  source = "Website",
}: NewsletterFormProps) {
  const emailId = useId();
  const honeypotId = useId();
  const { language, localizeHref } = useLanguage();

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);

  const isLight = variant === "light" || variant === "journal";
  const isJournal = variant === "journal";
  const isEs = language === "es";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setIsError(true);
      setMessage(
        isEs
          ? "Introduce un correo electrónico válido."
          : "Enter a valid email address.",
      );
      form.reportValidity();
      return;
    }

    if (IS_TURNSTILE_ENABLED && !turnstileToken) {
      setIsError(true);
      setMessage(
        isEs
          ? "Completa la verificación de seguridad antes de suscribirte."
          : "Please complete the security check before subscribing.",
      );
      return;
    }

    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const companyWebsite = String(data.get("companyWebsite") ?? "").trim();

    setIsSubmitting(true);
    setIsError(false);
    setMessage("");

    let didAttemptRequest = false;
    try {
      didAttemptRequest = true;
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          language: isEs ? "ES" : "EN",
          browserLocale: language,
          source,
          companyWebsite,
          turnstileToken,
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
              ? "No hemos podido registrar tu correo ahora mismo. Inténtalo de nuevo en unos segundos."
              : "We could not save your email right now. Please try again in a moment."),
        );
        return;
      }

      form.reset();
      setIsError(false);
      setMessage(
        isEs
          ? "¡Gracias por suscribirte! Revisa tu bandeja de entrada."
          : "Thank you for subscribing. Check your inbox for our welcome note.",
      );
    } catch {
      setIsError(true);
      setMessage(
        isEs
          ? "No hemos podido conectar con el servidor. Inténtalo de nuevo."
          : "We could not reach the server right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
      if (didAttemptRequest && IS_TURNSTILE_ENABLED) {
        setTurnstileToken("");
        setTurnstileResetSignal((value) => value + 1);
      }
    }
  }

  if (isJournal) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-4 sm:p-6 lg:p-8">
        <div className="mb-5 grid gap-1 border-b border-[var(--color-rule)] pb-4">
          <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.05em] text-[var(--color-clay-ink)] uppercase">
            {isEs ? "Historias por correo" : "Stories by email"}
          </p>
          <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
            {isEs
              ? "Nuevas historias de Alma y Shirish sobre fabricación en la India, cultura entre España y la India, y Almarise."
              : "New Stories from Alma and Shirish on Indian manufacturing, life between Spain and India, and Almarise."}
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
              placeholder={isEs ? "tu@correo.com" : "your@email.com"}
              required
              disabled={isSubmitting}
              className="min-h-[var(--control-height)] w-full min-w-0 flex-1 rounded-[0.75rem] border border-[var(--color-rule)] bg-[var(--color-paper)] px-4 text-[var(--color-forest-deep)] transition-colors placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-clay-ink)] focus-visible:outline-none disabled:opacity-55"
            />
            <button
              className="primary-button shrink-0 sm:w-auto"
              type="submit"
              disabled={isSubmitting}
              data-newsletter-submit-btn
            >
              {isSubmitting
                ? isEs
                  ? "Suscribiendo..."
                  : "Subscribing..."
                : isEs
                  ? "Suscribirme"
                  : "Subscribe"}
            </button>
          </div>

          <TurnstileField
            onTokenChange={setTurnstileToken}
            language={language}
            resetSignal={turnstileResetSignal}
            theme="light"
          />

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
                  ? "Solo escribimos cuando publicamos nuevas historias. Puedes darte de baja en cualquier momento."
                  : "We only write when we publish new Stories. Unsubscribe anytime.")}
            </p>
            <Link
              className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              href={localizeHref("/privacy-policy")}
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
          placeholder={isEs ? "tu@correo.com" : "your@email.com"}
          required
          disabled={isSubmitting}
          className={
            isLight
              ? "min-h-[var(--control-height)] w-full min-w-0 flex-1 rounded-[0.75rem] border border-[var(--color-rule)] bg-[var(--color-paper)] px-4 text-[var(--color-forest-deep)] transition-colors placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-clay-ink)] focus-visible:outline-none disabled:opacity-55"
              : "min-h-[var(--control-height)] w-full min-w-0 flex-1 rounded-[0.75rem] border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/10 px-4 text-[var(--color-paper)] transition-colors placeholder:text-[var(--color-paper-2)]/65 hover:border-[var(--color-paper-2)]/50 focus-visible:border-[var(--color-gold)] focus-visible:outline-none disabled:opacity-55"
          }
        />

        <button
          className="primary-button shrink-0 sm:w-auto"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEs
              ? "Suscribiendo..."
              : "Subscribing..."
            : isEs
              ? "Suscribirme"
              : "Subscribe"}
        </button>
      </div>

      <TurnstileField
        onTokenChange={setTurnstileToken}
        language={language}
        resetSignal={turnstileResetSignal}
        theme={isLight ? "light" : "dark"}
      />

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
              ? "Nuevas historias de KarmaRise D Global. Puedes darte de baja en un clic."
              : "New Stories from KarmaRise D Global. Unsubscribe in one click anytime.")}
        </p>
        <Link
          className={
            isLight
              ? "underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              : "text-[var(--color-paper-2)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-gold)]"
          }
          href={localizeHref("/privacy-policy")}
        >
          {isEs ? "Privacidad" : "Privacy policy"}
        </Link>
      </div>
    </form>
  );
}
