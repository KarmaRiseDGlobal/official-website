"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { TurnstileField } from "@/components/forms/turnstile-field";
import { useLanguage } from "@/context/language-context";
import type {
  NewsletterFormMode,
  NewsletterTrack,
} from "@/lib/newsletter-tracks";

const IS_TURNSTILE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
);

interface NewsletterFormProps {
  variant?: "footer" | "light" | "journal";
  source?: string;
  defaultTrack?: NewsletterFormMode;
}

export function NewsletterForm({
  variant = "footer",
  source = "Website",
  defaultTrack = "choose",
}: NewsletterFormProps) {
  const emailId = useId();
  const feedbackId = useId();
  const honeypotId = useId();
  const { language, localizeHref } = useLanguage();

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEngaged, setIsEngaged] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);

  const isLight = variant === "light" || variant === "journal";
  const isJournal = variant === "journal";
  const isEs = language === "es";

  // Unified campaign: every subscriber joins KarmaRise Stories (EN) or Historias de KarmaRise (ES),
  // while page context is recorded silently in Brevo for future segmentation if needed.
  const backgroundTracks: NewsletterTrack[] =
    defaultTrack === "choose" ? ["manufacturing", "almarise"] : [defaultTrack];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setIsError(true);
      setMessage(
        isEs
          ? "Introduce un correo electrónico válido, como nombre@ejemplo.com."
          : "Enter a valid email address, such as name@example.com.",
      );
      form.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      return;
    }

    if (IS_TURNSTILE_ENABLED && !turnstileToken) {
      setIsEngaged(true);
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
          tracks: backgroundTracks,
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
          ? "Ya estás en la lista. Te llegará una breve nota de bienvenida de Alma y Shirish; respóndenos cuando quieras."
          : "You are on the list. Look out for a short welcome note from Alma and Shirish, and reply anytime.",
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

  const formLabel = isEs
    ? `Suscripción a Historias de KarmaRise (${source})`
    : `Subscribe to KarmaRise Stories (${source})`;
  const submitLabel = isSubmitting
    ? isEs
      ? "Guardando tu correo..."
      : "Saving your email..."
    : isJournal
      ? isEs
        ? "Envíame la próxima carta"
        : "Send me the next letter"
      : isEs
        ? "Recibir las cartas"
        : "Send me the letters";

  if (isJournal) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-6 sm:p-8">
        <p className="m-0 mb-5 border-b border-[var(--color-rule)] pb-4 text-[length:var(--text-sm)] text-[var(--color-muted)]">
          {isEs
            ? "Edición en español. Cambia el idioma a English para recibir las cartas en inglés."
            : "English edition. Switch the site to Español for the Spanish letters."}
        </p>

        <form
          aria-label={formLabel}
          className="grid gap-3"
          data-endpoint="/api/newsletter"
          noValidate
          onFocus={() => setIsEngaged(true)}
          onPointerEnter={() => setIsEngaged(true)}
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

          <div className="grid gap-1.5">
            <label
              className="text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)]"
              htmlFor={emailId}
            >
              {isEs ? "Correo electrónico" : "Email address"}
            </label>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                id={emailId}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder={isEs ? "nombre@ejemplo.com" : "name@example.com"}
                required
                aria-invalid={isError || undefined}
                aria-describedby={feedbackId}
                disabled={isSubmitting}
                className="min-h-[var(--control-height)] w-full flex-1 rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper)] px-4 text-[var(--color-forest-deep)] transition-colors placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-clay-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:opacity-55"
              />
              <button
                className="primary-button shrink-0"
                type="submit"
                disabled={isSubmitting}
                data-newsletter-submit-btn
              >
                {submitLabel}
              </button>
            </div>
          </div>

          {IS_TURNSTILE_ENABLED ? (
            <div className="min-h-[20px]">
              {isEngaged ? (
                <TurnstileField
                  onTokenChange={setTurnstileToken}
                  language={language}
                  resetSignal={turnstileResetSignal}
                  theme="light"
                />
              ) : (
                <p className="inline-flex items-center gap-1.5 text-xs leading-tight text-[var(--color-muted)]">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-muted)]/45"
                  />
                  <span>
                    {isEs
                      ? "Protegido por Cloudflare"
                      : "Protected by Cloudflare"}
                  </span>
                </p>
              )}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)]">
            <p
              id={feedbackId}
              aria-live="polite"
              className={
                isError
                  ? "text-[var(--color-clay-ink)]"
                  : "text-[var(--color-forest-deep)]"
              }
            >
              {message ||
                (isEs
                  ? "Baja en un clic. Nunca compartimos tu correo."
                  : "Unsubscribe in one click. We never share your email.")}
            </p>
            <Link
              className="inline-flex min-h-[var(--tap-min)] items-center underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
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
      aria-label={formLabel}
      className="grid gap-2.5"
      data-endpoint="/api/newsletter"
      noValidate
      onFocus={() => setIsEngaged(true)}
      onPointerEnter={() => setIsEngaged(true)}
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

      <div className="grid gap-1.5">
        <label
          className={
            isLight
              ? "text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)]"
              : "sr-only"
          }
          htmlFor={emailId}
        >
          {isEs ? "Tu correo electrónico" : "Your email address"}
        </label>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <input
            id={emailId}
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder={isEs ? "tu@correo.com" : "your@email.com"}
            required
            aria-invalid={isError || undefined}
            aria-describedby={feedbackId}
            disabled={isSubmitting}
            className={
              isLight
                ? "min-h-[var(--control-height)] w-full flex-1 rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper)] px-4 text-[var(--color-forest-deep)] transition-colors placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-clay-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:opacity-55"
                : "min-h-[var(--control-height)] w-full flex-1 rounded-[var(--radius-input)] border border-[var(--color-paper)]/25 bg-[var(--color-paper)]/10 px-4 text-[var(--color-paper)] transition-colors placeholder:text-[var(--color-paper-2)]/75 hover:border-[var(--color-paper-2)]/50 focus-visible:border-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)] disabled:opacity-55"
            }
          />

          <button
            className="primary-button shrink-0"
            type="submit"
            disabled={isSubmitting}
          >
            {submitLabel}
          </button>
        </div>
      </div>

      {IS_TURNSTILE_ENABLED ? (
        <div className="min-h-[20px]">
          {isEngaged ? (
            <TurnstileField
              onTokenChange={setTurnstileToken}
              language={language}
              resetSignal={turnstileResetSignal}
              theme={isLight ? "light" : "dark"}
            />
          ) : (
            <p
              className={`inline-flex items-center gap-1.5 text-xs leading-tight ${
                isLight
                  ? "text-[var(--color-muted)]"
                  : "text-[var(--color-paper-2)]/70"
              }`}
            >
              <span
                aria-hidden="true"
                className={`inline-block h-1.5 w-1.5 rounded-full ${
                  isLight
                    ? "bg-[var(--color-muted)]/45"
                    : "bg-[var(--color-paper-2)]/40"
                }`}
              />
              <span>
                {isEs ? "Protegido por Cloudflare" : "Protected by Cloudflare"}
              </span>
            </p>
          )}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)]">
        <p
          id={feedbackId}
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
              ? "Historias de KarmaRise. Una carta cada dos semanas, baja en un clic."
              : "KarmaRise Stories. One letter every two weeks, unsubscribe in one click.")}
        </p>
        <Link
          className={
            isLight
              ? "inline-flex min-h-[var(--tap-min)] items-center underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              : "inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-paper-2)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-gold)]"
          }
          href={localizeHref("/privacy-policy")}
        >
          {isEs ? "Privacidad" : "Privacy policy"}
        </Link>
      </div>
    </form>
  );
}
