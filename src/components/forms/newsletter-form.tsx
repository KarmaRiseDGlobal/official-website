"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";

import { TurnstileField } from "@/components/forms/turnstile-field";
import { useLanguage } from "@/context/language-context";
import { buildFormAttributionPayload } from "@/lib/client-handoff";
import type {
  NewsletterFormMode,
  NewsletterTrack,
} from "@/lib/newsletter-tracks";
import { isValidEmail } from "@/lib/validation";

const IS_TURNSTILE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
);

type NewsletterErrorKind = "none" | "email" | "turnstile" | "server";

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
  const helperId = useId();
  const feedbackId = useId();
  const honeypotId = useId();
  const { language, localizeHref } = useLanguage();

  const [message, setMessage] = useState("");
  const [errorKind, setErrorKind] = useState<NewsletterErrorKind>("none");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEngaged, setIsEngaged] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [turnstileFailed, setTurnstileFailed] = useState(false);

  const turnstileTokenRef = useRef("");

  const isLight = variant === "light" || variant === "journal";
  const isJournal = variant === "journal";
  const isEs = language === "es";
  const isError = errorKind !== "none";
  const hasEmailError = errorKind === "email";

  function handleTurnstileTokenChange(token: string) {
    turnstileTokenRef.current = token;
    setTurnstileToken(token);
    if (token) {
      setTurnstileFailed(false);
      if (errorKind === "turnstile") {
        setErrorKind("none");
        setMessage("");
      }
    }
  }

  async function waitForTurnstileToken(timeoutMs = 2000): Promise<string> {
    if (turnstileTokenRef.current) {
      return turnstileTokenRef.current;
    }
    const maxAttempts = Math.max(1, Math.ceil(timeoutMs / 120));
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      if (turnstileTokenRef.current) {
        return turnstileTokenRef.current;
      }
    }
    return turnstileTokenRef.current;
  }

  function handleEmailChange() {
    if (isError) {
      setErrorKind("none");
      setMessage("");
    }
  }

  // Unified campaign: every subscriber joins KarmaRise Stories (EN) or Historias de KarmaRise (ES),
  // while page context is recorded silently in Brevo for future segmentation if needed.
  const backgroundTracks: NewsletterTrack[] =
    defaultTrack === "choose" ? ["manufacturing", "almarise"] : [defaultTrack];

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const email = String(data.get("email") ?? "").trim();
    const companyWebsite = String(data.get("companyWebsite") ?? "").trim();

    if (!form.checkValidity() || !isValidEmail(email)) {
      setErrorKind("email");
      setMessage(
        isEs
          ? "Introduce un correo electrónico válido, como nombre@ejemplo.com."
          : "Enter a valid email address, such as name@example.com.",
      );
      form.querySelector<HTMLInputElement>('input[name="email"]')?.focus();
      return;
    }

    let activeTurnstileToken = turnstileTokenRef.current || turnstileToken;
    if (IS_TURNSTILE_ENABLED && !activeTurnstileToken) {
      setIsEngaged(true);
      setIsSubmitting(true);
      activeTurnstileToken = await waitForTurnstileToken(2000);
      if (!activeTurnstileToken) {
        setIsSubmitting(false);
        setErrorKind("turnstile");
        setMessage(
          turnstileFailed
            ? isEs
              ? "La verificación de seguridad no ha podido cargarse. Escríbenos a hola@karmarisedglobal.com si deseas recibir las cartas."
              : "The security check could not load. Email hola@karmarisedglobal.com if you would like to join the letters."
            : isEs
              ? "Completa la verificación de seguridad antes de suscribirte."
              : "Complete the security check before subscribing.",
        );
        return;
      }
    }

    setIsSubmitting(true);
    setErrorKind("none");
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
          ...buildFormAttributionPayload(),
          companyWebsite,
          turnstileToken: activeTurnstileToken,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        language?: "EN" | "ES";
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setErrorKind("server");
        setMessage(
          result.error ??
            (isEs
              ? "No hemos podido registrar tu correo ahora mismo. Inténtalo de nuevo en unos segundos."
              : "We could not save your email right now. Try again in a moment."),
        );
        return;
      }

      form.reset();
      setErrorKind("none");
      setMessage(
        isEs
          ? "Ya estás en la lista. Te llegará una breve nota de bienvenida de Alma y Shirish; respóndenos cuando quieras."
          : "You are on the list. Look out for a short welcome note from Alma and Shirish, and reply anytime.",
      );
    } catch {
      setErrorKind("server");
      setMessage(
        isEs
          ? "No hemos podido conectar con el servidor. Inténtalo de nuevo."
          : "We could not reach the server right now. Try again.",
      );
    } finally {
      setIsSubmitting(false);
      if (didAttemptRequest && IS_TURNSTILE_ENABLED) {
        turnstileTokenRef.current = "";
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
      ? "Guardando tu correo…"
      : "Saving your email…"
    : isJournal
      ? isEs
        ? "Envíame la próxima carta"
        : "Send me the next letter"
      : isEs
        ? "Recibir las cartas"
        : "Send me the letters";
  const describedBy = message ? `${helperId} ${feedbackId}` : helperId;

  if (isJournal) {
    return (
      <div className="rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] p-6 text-[var(--color-forest-deep)] sm:p-8">
        <p className="m-0 mb-4 text-[length:var(--text-sm)] text-[var(--color-muted)]">
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
                aria-invalid={hasEmailError || undefined}
                aria-describedby={describedBy}
                disabled={isSubmitting}
                onChange={handleEmailChange}
                className="min-h-[var(--control-height)] w-full flex-1 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)] px-4 text-[var(--color-forest-deep)] transition-colors placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-clay-ink)] focus-visible:bg-[var(--color-white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:opacity-55"
              />
              <button
                className="primary-button-light shrink-0"
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
                  onTokenChange={handleTurnstileTokenChange}
                  onError={setTurnstileFailed}
                  language={language}
                  resetSignal={turnstileResetSignal}
                  theme="light"
                />
              ) : (
                <p className="inline-flex items-center gap-1.5 text-[length:var(--text-xs)] leading-tight text-[var(--color-muted)]">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-[var(--radius-pill)] bg-[var(--color-sage)]"
                  />
                  <span>
                    {isEs
                      ? "Protección contra spam activa"
                      : "Spam protection active"}
                  </span>
                </p>
              )}
            </div>
          ) : null}

          <div
            id={feedbackId}
            role={isError ? "alert" : "status"}
            aria-live={isError ? "assertive" : "polite"}
            className={
              message
                ? `text-[length:var(--text-xs)] font-medium ${
                    isError
                      ? "text-[var(--color-clay-ink)]"
                      : "text-[var(--color-forest-deep)]"
                  }`
                : "sr-only"
            }
          >
            {message}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)]">
            <p id={helperId} className="m-0 text-[var(--color-muted)]">
              {isEs
                ? "Baja en un clic. Nunca compartimos tu correo."
                : "Unsubscribe in one click. We never share your email."}
            </p>
            <Link
              className="inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
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
              : "text-[length:var(--text-xs)] font-semibold text-[var(--color-paper-2)]"
          }
          htmlFor={emailId}
        >
          {isEs ? "Correo electrónico" : "Email"}
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
            aria-invalid={hasEmailError || undefined}
            aria-describedby={describedBy}
            disabled={isSubmitting}
            onChange={handleEmailChange}
            className={
              isLight
                ? "min-h-[var(--control-height)] w-full flex-1 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)] px-4 text-[var(--color-forest-deep)] transition-colors placeholder:text-[var(--color-muted)] focus-visible:border-[var(--color-clay-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] disabled:opacity-55"
                : "min-h-[var(--control-height)] w-full flex-1 rounded-[var(--radius-input)] border border-[var(--color-paper)]/55 bg-[var(--color-paper)]/10 px-4 text-[var(--color-paper)] transition-colors placeholder:text-[var(--color-paper-2)]/75 hover:border-[var(--color-paper-2)]/78 focus-visible:border-[var(--color-gold)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)] disabled:opacity-55"
            }
          />

          <button
            className={
              isLight
                ? "primary-button-light shrink-0"
                : "primary-button shrink-0"
            }
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
              onTokenChange={handleTurnstileTokenChange}
              onError={setTurnstileFailed}
              language={language}
              resetSignal={turnstileResetSignal}
              theme={isLight ? "light" : "dark"}
            />
          ) : (
            <p
              className={`inline-flex items-center gap-1.5 text-[length:var(--text-xs)] leading-tight ${
                isLight
                  ? "text-[var(--color-muted)]"
                  : "text-[var(--color-paper-2)]/70"
              }`}
            >
              <span
                aria-hidden="true"
                className={`inline-block h-1.5 w-1.5 rounded-[var(--radius-pill)] ${
                  isLight
                    ? "bg-[var(--color-sage)]"
                    : "bg-[var(--color-paper-2)]/40"
                }`}
              />
              <span>
                {isEs
                  ? "Protección contra spam activa"
                  : "Spam protection active"}
              </span>
            </p>
          )}
        </div>
      ) : null}

      <div
        id={feedbackId}
        role={isError ? "alert" : "status"}
        aria-live={isError ? "assertive" : "polite"}
        className={
          message
            ? `text-[length:var(--text-xs)] font-medium ${
                isError
                  ? isLight
                    ? "text-[var(--color-clay-ink)]"
                    : "text-[var(--color-gold)]"
                  : isLight
                    ? "text-[var(--color-forest-deep)]"
                    : "text-[var(--color-paper-2)]"
              }`
            : "sr-only"
        }
      >
        {message}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)]">
        <p
          id={helperId}
          className={
            isLight
              ? "m-0 text-[var(--color-forest-deep)]"
              : "m-0 text-[var(--color-paper-2)]"
          }
        >
          {isEs
            ? "Historias de KarmaRise. Una carta cada dos semanas, baja en un clic."
            : "KarmaRise Stories. One letter every two weeks, unsubscribe in one click."}
        </p>
        <Link
          className={
            isLight
              ? "inline-flex min-h-[var(--tap-min)] items-center underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              : "inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-paper-2)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-gold)]"
          }
          href={localizeHref("/privacy-policy")}
        >
          {isEs ? "Privacidad" : "Privacy policy"}
        </Link>
      </div>
    </form>
  );
}
