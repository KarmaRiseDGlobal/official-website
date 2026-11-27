"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { TurnstileField } from "@/components/forms/turnstile-field";
import { useLanguage } from "@/context/language-context";
import {
  CONTACT_PICKER_TOPICS,
  CONTACT_TOPICS,
} from "@/data/conversion-content";
import {
  buildFormAttributionPayload,
  readClientHandoff,
  saveClientHandoff,
  scrollElementIntoViewSafe,
} from "@/lib/client-handoff";
import { isValidEmail } from "@/lib/validation";

export { CONTACT_TOPICS };

const IS_TURNSTILE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
);

const REFERRAL_SUGGESTIONS = {
  en: [
    "LinkedIn",
    "Instagram",
    "Podcast",
    "Newsletter",
    "Word of mouth",
    "Web search",
  ],
  es: [
    "LinkedIn",
    "Instagram",
    "Pódcast",
    "Boletín de Historias",
    "Recomendación personal",
    "Buscador",
  ],
} as const;

function getFallbackEmailForTopic(topic: string): string {
  const match = CONTACT_TOPICS.find((item) => item.value === topic);
  return match?.directEmail ?? "inquiry@karmarisedglobal.com";
}

interface ContactFormProps {
  selectedTopic?: string;
  onTopicChange?: (topic: string) => void;
}

export function ContactForm({
  selectedTopic,
  onTopicChange,
}: ContactFormProps = {}) {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  const formTopRef = useRef<HTMLDivElement | null>(null);
  const confirmationHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const noteInputRef = useRef<HTMLTextAreaElement | null>(null);
  const turnstileTokenRef = useRef("");
  const turnstileFailedRef = useRef(false);

  const [internalTopic, setInternalTopic] = useState("General enquiry");
  const topic = selectedTopic ?? internalTopic;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [isEngaged, setIsEngaged] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    note?: string;
  }>({});
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [mailtoFallback, setMailtoFallback] = useState<{
    href: string;
    email: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedState, setSubmittedState] = useState<{
    recipientName: string;
    confirmationSent: boolean;
  } | null>(null);
  const [statusAnnouncement, setStatusAnnouncement] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);

  const handleTurnstileTokenChange = useCallback((token: string) => {
    turnstileTokenRef.current = token;
    setTurnstileToken(token);
  }, []);

  const handleTurnstileError = useCallback((failed: boolean) => {
    turnstileFailedRef.current = failed;
    setTurnstileFailed(failed);
  }, []);

  async function waitForTurnstileToken(timeoutMs = 2000): Promise<string> {
    if (turnstileTokenRef.current || turnstileFailedRef.current) {
      return turnstileTokenRef.current;
    }
    const maxAttempts = Math.max(1, Math.ceil(timeoutMs / 120));
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      if (turnstileTokenRef.current || turnstileFailedRef.current) {
        return turnstileTokenRef.current;
      }
    }
    return turnstileTokenRef.current;
  }

  // Hydrate handoff details and immediately mount Turnstile if pre-filled.
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      const handoff = readClientHandoff();
      if (handoff.name) setName(handoff.name);
      if (handoff.email) setEmail(handoff.email);
      if (handoff.name || handoff.email) {
        setIsEngaged(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Mount Turnstile as soon as the contact form nears the viewport so the
  // first submit never races an unmounted widget.
  useEffect(() => {
    if (!IS_TURNSTILE_ENABLED || isEngaged) {
      return;
    }
    const target = formTopRef.current;
    if (!target || typeof IntersectionObserver === "undefined") {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsEngaged(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [isEngaged]);

  function handleSelectTopic(nextTopic: string) {
    setIsEngaged(true);
    setInternalTopic(nextTopic);
    onTopicChange?.(nextTopic);
  }

  function handleSendAnother() {
    setSubmittedState(null);
    setStatusAnnouncement("");
    setMessage("");
    setIsError(false);
    setMailtoFallback(null);
    requestAnimationFrame(() => noteInputRef.current?.focus());
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsEngaged(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedNote = note.trim();
    const trimmedReferralSource = referralSource.trim();

    const nextErrors: { name?: string; email?: string; note?: string } = {};
    if (!trimmedName) {
      nextErrors.name = isEs ? "Introduce tu nombre." : "Enter your name.";
    }
    if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = isEs
        ? "Introduce un correo electrónico válido (ej. nombre@empresa.com)."
        : "Enter a valid email address (e.g. name@company.com).";
    }
    if (!trimmedNote) {
      nextErrors.note = isEs
        ? "Escribe brevemente en qué podemos ayudarte."
        : "Write a short message so we know how to help.";
    }

    if (nextErrors.name || nextErrors.email || nextErrors.note || !topic) {
      setFieldErrors(nextErrors);
      setIsError(true);
      setMailtoFallback(null);
      setMessage(
        isEs
          ? "Revisa los campos marcados antes de enviar tu mensaje."
          : "Check the highlighted fields before sending your message.",
      );
      if (nextErrors.name) {
        nameInputRef.current?.focus();
      } else if (nextErrors.email) {
        emailInputRef.current?.focus();
      } else if (nextErrors.note) {
        noteInputRef.current?.focus();
      }
      return;
    }

    setFieldErrors({});

    const activeTopicEntry = CONTACT_TOPICS.find(
      (item) => item.value === topic,
    );
    const localizedTopicLabel = activeTopicEntry?.label[language] ?? topic;
    const fallbackEmail = getFallbackEmailForTopic(topic);
    const subject = encodeURIComponent(
      `${localizedTopicLabel} · ${trimmedName}`,
    );
    const body = encodeURIComponent(
      (isEs
        ? [
            `Nombre: ${trimmedName}`,
            `Correo: ${trimmedEmail}`,
            `Asunto: ${localizedTopicLabel}`,
            trimmedReferralSource
              ? `Cómo nos conociste: ${trimmedReferralSource}`
              : null,
            "",
            trimmedNote,
          ]
        : [
            `Name: ${trimmedName}`,
            `Email: ${trimmedEmail}`,
            `Topic: ${localizedTopicLabel}`,
            trimmedReferralSource
              ? `How you heard about us: ${trimmedReferralSource}`
              : null,
            "",
            trimmedNote,
          ]
      )
        .filter((line): line is string => line !== null)
        .join("\n"),
    );
    const fallbackHref = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;

    let activeTurnstileToken = turnstileTokenRef.current || turnstileToken;
    if (IS_TURNSTILE_ENABLED && !activeTurnstileToken) {
      setIsSubmitting(true);
      activeTurnstileToken = await waitForTurnstileToken(2000);
      if (!activeTurnstileToken) {
        setIsSubmitting(false);
        setIsError(true);
        setMailtoFallback({ href: fallbackHref, email: fallbackEmail });
        setMessage(
          turnstileFailed || turnstileFailedRef.current
            ? isEs
              ? "No se pudo cargar la verificación de seguridad. Pulsa Reintentar o envíanos el mensaje desde tu aplicación de correo."
              : "Security verification could not load. Retry the check or send your message via your email app."
            : isEs
              ? "Completa la verificación de seguridad antes de enviar, o usa tu aplicación de correo."
              : "Complete the security check before submitting, or send via your email app.",
        );
        return;
      }
    }

    saveClientHandoff({
      name: trimmedName,
      email: trimmedEmail,
      preferredLanguage: isEs ? "es" : "en",
    });

    const attributionPayload = buildFormAttributionPayload(
      trimmedReferralSource,
    );

    setIsSubmitting(true);
    setIsError(false);
    setMailtoFallback(null);
    setMessage("");

    let didAttemptRequest = false;
    try {
      didAttemptRequest = true;
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          topic,
          note: trimmedNote,
          language,
          ...attributionPayload,
          companyWebsite,
          turnstileToken: activeTurnstileToken,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        confirmationSent?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setIsError(true);
        if (response.status >= 500) {
          setMailtoFallback({ href: fallbackHref, email: fallbackEmail });
          setMessage(
            result.error ??
              (isEs
                ? "No se ha podido enviar directamente. Puedes enviarnos el mensaje desde tu aplicación de correo."
                : "Direct delivery failed. You can still send your message via your email app."),
          );
        } else {
          setMailtoFallback(null);
          setMessage(
            result.error ??
              (isEs
                ? "Revisa los datos introducidos e inténtalo de nuevo."
                : "Check your details and try again."),
          );
        }
        return;
      }

      setNote("");
      setReferralSource("");
      setIsError(false);
      setMailtoFallback(null);
      setMessage("");
      setStatusAnnouncement(
        isEs
          ? `Mensaje recibido. Gracias, ${trimmedName}.`
          : `Note received. Thank you, ${trimmedName}.`,
      );
      setSubmittedState({
        recipientName: trimmedName,
        confirmationSent: result.confirmationSent !== false,
      });
      requestAnimationFrame(() => {
        scrollElementIntoViewSafe(formTopRef.current, "start");
        confirmationHeadingRef.current?.focus({ preventScroll: true });
      });
    } catch {
      setIsError(true);
      setMailtoFallback({ href: fallbackHref, email: fallbackEmail });
      setMessage(
        isEs
          ? "No hemos podido conectar con el servidor ahora mismo. Puedes enviarnos el mensaje desde tu aplicación de correo."
          : "Unable to reach the server right now. You can still send your message via your email app.",
      );
    } finally {
      setIsSubmitting(false);
      if (didAttemptRequest && IS_TURNSTILE_ENABLED) {
        handleTurnstileTokenChange("");
        setTurnstileResetSignal((value) => value + 1);
      }
    }
  }

  const activeDirectEmail = getFallbackEmailForTopic(topic);

  return (
    <div ref={formTopRef} className="grid min-w-0 scroll-mt-0 gap-3.5">
      {/* Persistent pre-mounted status region for confirmation announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {statusAnnouncement}
      </div>

      {submittedState ? (
        <div className="grid gap-6 py-2">
          <div className="flex flex-wrap items-center gap-4">
            <div className="editorial-photo-frame h-14 w-14 shrink-0 rounded-[var(--radius-pill)]">
              <Image
                src="/images/founders/alma-swing-laughing.jpeg"
                alt="Alma"
                fill
                sizes="56px"
                className="object-cover object-[50%_42%]"
              />
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-pale-sage)] px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)]">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-[var(--radius-pill)] bg-[var(--color-forest)]"
              />
              <span>{isEs ? "Mensaje recibido" : "Note received"}</span>
            </div>
          </div>

          <div className="grid gap-2.5">
            <h2
              ref={confirmationHeadingRef}
              tabIndex={-1}
              className="m-0 text-[length:var(--text-2xl)] leading-[1.16] font-normal text-[var(--color-forest-deep)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              {isEs
                ? `Gracias, ${submittedState.recipientName}. Tu mensaje ya está con Alma y Shirish.`
                : `Thank you, ${submittedState.recipientName}. Your note is with Alma and Shirish.`}
            </h2>
            <p className="m-0 max-w-[54ch] text-[length:var(--text-md)] leading-relaxed text-[var(--color-ink-2)]">
              {submittedState.confirmationSent
                ? isEs
                  ? "Te hemos enviado un correo de confirmación y te responderemos personalmente en 1 o 2 días laborables."
                  : "We sent a confirmation email and will reply personally within 1 to 2 business days."
                : isEs
                  ? "Te responderemos personalmente a tu correo en 1 o 2 días laborables."
                  : "We will reply personally to your email within 1 to 2 business days."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              className="primary-button-light"
              href={localizeHref("/book-a-call?duration=15")}
            >
              {isEs ? "Reservar llamada con Alma" : "Book a call with Alma"}
            </Link>
            <button
              type="button"
              onClick={handleSendAnother}
              className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
            >
              {isEs ? "Enviar otro mensaje" : "Send another note"}
            </button>
          </div>
        </div>
      ) : (
        <form
          aria-label={
            isEs ? "Formulario de contacto" : "Contact KarmaRise D Global form"
          }
          className="grid min-w-0 gap-3.5"
          data-endpoint="/api/contact"
          noValidate
          onFocus={() => setIsEngaged(true)}
          onPointerEnter={() => setIsEngaged(true)}
          onSubmit={handleSubmit}
        >
          <div className="hidden" aria-hidden="true">
            <label htmlFor="contact-company-website">Company website</label>
            <input
              id="contact-company-website"
              name="companyWebsite"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={companyWebsite}
              onChange={(event) => setCompanyWebsite(event.target.value)}
            />
          </div>

          <fieldset className="m-0 grid min-w-0 gap-2.5 border-0 p-0">
            <legend className="mb-1 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
              {isEs ? "¿Sobre qué quieres escribirnos?" : "What is this about?"}
            </legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CONTACT_PICKER_TOPICS.map((item, idx) => {
                const active = topic === item.value;
                const isLastOdd =
                  CONTACT_PICKER_TOPICS.length % 2 === 1 &&
                  idx === CONTACT_PICKER_TOPICS.length - 1;
                return (
                  <button
                    key={item.value}
                    type="button"
                    aria-pressed={active}
                    disabled={isSubmitting}
                    onClick={() => handleSelectTopic(item.value)}
                    className={`inline-flex min-h-[var(--tap-min)] w-full cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border px-4 py-1.5 text-center text-[length:var(--text-xs)] font-semibold transition-colors ${
                      isLastOdd ? "sm:col-span-2" : ""
                    } ${
                      active
                        ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                        : "border-[var(--color-control-border)] bg-[var(--color-paper)]/85 text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-paper)]"
                    }`}
                  >
                    {item.label[language]}
                  </button>
                );
              })}
            </div>
            <p className="m-0 flex flex-wrap items-center gap-x-1.5 text-[length:var(--text-xs)] text-[var(--color-muted)]">
              <span>
                {isEs ? "O escríbenos directamente a" : "Or email directly at"}
              </span>
              <a
                href={`mailto:${activeDirectEmail}`}
                className="inline-flex min-h-[var(--tap-min)] max-w-full min-w-0 items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              >
                <span className="min-w-0 [overflow-wrap:anywhere] break-words">
                  {activeDirectEmail}
                </span>
              </a>
            </p>
          </fieldset>

          <div className="field-row">
            <div className="atelier-field min-w-0">
              <label htmlFor="contact-name">
                {isEs ? "Tu nombre" : "Your name"}
              </label>
              <input
                ref={nameInputRef}
                id="contact-name"
                name="name"
                autoComplete="name"
                required
                aria-invalid={Boolean(fieldErrors.name) || undefined}
                aria-describedby={
                  fieldErrors.name ? "contact-name-error" : undefined
                }
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                disabled={isSubmitting}
                className="atelier-input"
                placeholder={isEs ? "Ej. Lucía Navarro" : "e.g. Elena Ruiz"}
              />
              {fieldErrors.name ? (
                <p
                  id="contact-name-error"
                  role="alert"
                  className="m-0 text-[length:var(--text-xs)] font-medium text-[var(--color-clay-ink)]"
                >
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>
            <div className="atelier-field min-w-0">
              <label htmlFor="contact-email">
                {isEs ? "Correo electrónico" : "Email"}
              </label>
              <input
                ref={emailInputRef}
                id="contact-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                aria-invalid={Boolean(fieldErrors.email) || undefined}
                aria-describedby={
                  fieldErrors.email ? "contact-email-error" : undefined
                }
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                disabled={isSubmitting}
                className="atelier-input"
                placeholder={isEs ? "tu@correo.com" : "you@example.com"}
              />
              {fieldErrors.email ? (
                <p
                  id="contact-email-error"
                  role="alert"
                  className="m-0 text-[length:var(--text-xs)] font-medium text-[var(--color-clay-ink)]"
                >
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>
          </div>

          <div className="atelier-field min-w-0">
            <label htmlFor="contact-note">{isEs ? "Mensaje" : "Message"}</label>
            <textarea
              ref={noteInputRef}
              id="contact-note"
              name="note"
              rows={3}
              required
              aria-invalid={Boolean(fieldErrors.note) || undefined}
              aria-describedby={
                fieldErrors.note ? "contact-note-error" : undefined
              }
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                if (fieldErrors.note) {
                  setFieldErrors((prev) => ({ ...prev, note: undefined }));
                }
              }}
              disabled={isSubmitting}
              className="atelier-textarea atelier-textarea-compact"
              placeholder={
                isEs
                  ? "Ej. Tenemos una tienda en Valencia y queremos desarrollar tres bolsos bandolera en piel para la próxima primavera."
                  : "e.g. We run a boutique in Valencia and would love to develop three vegetable-tanned crossbody bags for spring."
              }
            />
            {fieldErrors.note ? (
              <p
                id="contact-note-error"
                role="alert"
                className="m-0 text-[length:var(--text-xs)] font-medium text-[var(--color-clay-ink)]"
              >
                {fieldErrors.note}
              </p>
            ) : null}
          </div>

          <div className="atelier-field min-w-0">
            <label htmlFor="contact-referral-source">
              {isEs
                ? "¿Cómo nos conociste? (opcional)"
                : "How did you hear about us? (optional)"}
            </label>
            <input
              id="contact-referral-source"
              name="referralSource"
              type="text"
              list="contact-referral-suggestions"
              maxLength={160}
              disabled={isSubmitting}
              value={referralSource}
              onChange={(event) => setReferralSource(event.target.value)}
              placeholder={
                isEs
                  ? "Pódcast, boletín, LinkedIn, creadora o recomendación"
                  : "Podcast, newsletter, LinkedIn, creator, or word of mouth"
              }
              className="atelier-input"
            />
            <datalist id="contact-referral-suggestions">
              {REFERRAL_SUGGESTIONS[language].map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>

          {IS_TURNSTILE_ENABLED ? (
            <div className="min-h-[20px]">
              {isEngaged ? (
                <TurnstileField
                  onTokenChange={handleTurnstileTokenChange}
                  onError={handleTurnstileError}
                  language={language}
                  resetSignal={turnstileResetSignal}
                  theme="light"
                />
              ) : (
                <p className="m-0 inline-flex items-center gap-1.5 text-[length:var(--text-xs)] leading-tight text-[var(--color-muted)]">
                  <span
                    aria-hidden="true"
                    className="inline-block h-1.5 w-1.5 rounded-[var(--radius-pill)] bg-[var(--color-forest)]"
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
            role={isError ? "alert" : "status"}
            aria-live={isError ? "assertive" : "polite"}
            className={
              message
                ? isError
                  ? "grid gap-2 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)] px-4 py-3 text-[length:var(--text-sm)] font-medium text-[var(--color-clay-ink)]"
                  : "grid gap-2 rounded-[var(--radius-input)] bg-[var(--color-pale-sage)]/55 px-4 py-3 text-[length:var(--text-sm)] text-[var(--color-forest-deep)]"
                : "sr-only"
            }
          >
            {message ? <p className="m-0">{message}</p> : null}
            {mailtoFallback ? (
              <p className="m-0">
                <a
                  className="inline-flex min-h-[var(--tap-min)] items-center font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={mailtoFallback.href}
                >
                  {isEs
                    ? `Abrir correo preparado para ${mailtoFallback.email}`
                    : `Open prepared email to ${mailtoFallback.email}`}
                </a>
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-0.5">
            <span className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
              {isEs
                ? "Respuesta personal en 1 o 2 días laborables."
                : "Personal reply within 1 to 2 business days."}
            </span>
            <button
              className="primary-button-light"
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? isEs
                  ? "Enviando..."
                  : "Sending..."
                : isEs
                  ? "Enviar a Alma y Shirish"
                  : "Send note to Alma and Shirish"}
            </button>
          </div>

          <p className="m-0 flex flex-wrap items-center gap-x-1 text-[length:var(--text-xs)] leading-relaxed text-[var(--color-muted)]">
            {isEs ? (
              <>
                <span>
                  Tu mensaje es gestionado por Karmarise Global LLP conforme a
                  nuestra
                </span>
                <Link
                  className="inline-flex min-h-[var(--tap-min)] items-center font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/privacy-policy")}
                >
                  Política de privacidad
                </Link>
                <span>.</span>
              </>
            ) : (
              <>
                <span>
                  Your message is handled by Karmarise Global LLP in accordance
                  with our
                </span>
                <Link
                  className="inline-flex min-h-[var(--tap-min)] items-center font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/privacy-policy")}
                >
                  Privacy policy
                </Link>
                <span>.</span>
              </>
            )}
          </p>
        </form>
      )}
    </div>
  );
}
