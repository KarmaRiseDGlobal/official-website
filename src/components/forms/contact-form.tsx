"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { TurnstileField } from "@/components/forms/turnstile-field";
import { useLanguage } from "@/context/language-context";
import { CONTACT_TOPICS } from "@/data/conversion-content";
import { readClientHandoff, saveClientHandoff } from "@/lib/client-handoff";
import { isValidEmail } from "@/lib/validation";

export { CONTACT_TOPICS };

const IS_TURNSTILE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
);

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

  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const noteInputRef = useRef<HTMLTextAreaElement | null>(null);

  const [internalTopic, setInternalTopic] = useState("General enquiry");
  const topic = selectedTopic ?? internalTopic;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
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
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;
      const handoff = readClientHandoff();
      if (handoff.name) setName(handoff.name);
      if (handoff.email) setEmail(handoff.email);
    });
    return () => {
      active = false;
    };
  }, []);

  function handleSelectTopic(nextTopic: string) {
    setIsEngaged(true);
    setInternalTopic(nextTopic);
    onTopicChange?.(nextTopic);
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsEngaged(true);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedNote = note.trim();

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

    if (IS_TURNSTILE_ENABLED && !turnstileToken) {
      setIsError(true);
      setMailtoFallback(null);
      setMessage(
        isEs
          ? "Completa la verificación de seguridad antes de enviar el mensaje."
          : "Please complete the security check before submitting.",
      );
      return;
    }

    saveClientHandoff({
      name: trimmedName,
      email: trimmedEmail,
      preferredLanguage: isEs ? "es" : "en",
    });

    const fallbackEmail = getFallbackEmailForTopic(topic);
    const subject = encodeURIComponent(`${topic} · ${trimmedName}`);
    const body = encodeURIComponent(
      [
        `Name: ${trimmedName}`,
        `Email: ${trimmedEmail}`,
        `Topic: ${topic}`,
        "",
        trimmedNote,
      ].join("\n"),
    );
    const fallbackHref = `mailto:${fallbackEmail}?subject=${subject}&body=${body}`;

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
          companyWebsite,
          turnstileToken,
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
                : "Please check your details and try again."),
          );
        }
        return;
      }

      setNote("");
      setIsError(false);
      setMailtoFallback(null);
      setMessage(
        result.confirmationSent === false
          ? isEs
            ? "Hemos recibido tu mensaje en KarmaRise D Global. Te responderemos a tu correo en 1 o 2 días laborables."
            : "Your message has been sent to KarmaRise D Global. We will reply to your email within 1–2 business days."
          : isEs
            ? "Hemos recibido tu mensaje en KarmaRise D Global. Te hemos enviado un correo de confirmación y te responderemos en 1 o 2 días laborables."
            : "Your message has been sent to KarmaRise D Global. We have sent a confirmation email and will reply within 1–2 business days.",
      );
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
        setTurnstileToken("");
        setTurnstileResetSignal((value) => value + 1);
      }
    }
  }

  const activeDirectEmail = getFallbackEmailForTopic(topic);

  return (
    <form
      aria-label={
        isEs ? "Formulario de contacto" : "Contact KarmaRise D Global form"
      }
      className="brief-form min-w-0"
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

      {/* Topic pills first */}
      <fieldset className="m-0 grid min-w-0 gap-3 border-0 p-0">
        <legend className="mb-1 text-[length:var(--text-sm)] font-medium text-[var(--color-paper-2)]">
          {isEs ? "¿Sobre qué quieres escribirnos?" : "What is this about?"}
        </legend>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TOPICS.map((item) => {
            const active = topic === item.value;
            return (
              <button
                key={item.value}
                type="button"
                aria-pressed={active}
                disabled={isSubmitting}
                onClick={() => handleSelectTopic(item.value)}
                className={`inline-flex min-h-[var(--tap-min)] cursor-pointer items-center rounded-[var(--radius-pill)] border px-4 py-1.5 text-[length:var(--text-xs)] font-semibold transition-colors ${
                  active
                    ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-night)]"
                    : "border-[var(--color-paper)]/25 bg-[var(--color-paper)]/8 text-[var(--color-paper)] hover:border-[var(--color-paper-2)]"
                }`}
              >
                {item.label[language]}
              </button>
            );
          })}
        </div>
        <p className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
          {isEs
            ? "También puedes escribir directamente a "
            : "Or email directly at "}
          <a
            href={`mailto:${activeDirectEmail}`}
            className="font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)]"
          >
            {activeDirectEmail}
          </a>
        </p>
      </fieldset>

      <div className="field-row">
        <div className="field min-w-0">
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
          />
          {fieldErrors.name ? (
            <p
              id="contact-name-error"
              role="alert"
              className="text-[length:var(--text-xs)] text-[var(--color-gold)]"
            >
              {fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div className="field min-w-0">
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
          />
          {fieldErrors.email ? (
            <p
              id="contact-email-error"
              role="alert"
              className="text-[length:var(--text-xs)] text-[var(--color-gold)]"
            >
              {fieldErrors.email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="field min-w-0">
        <label htmlFor="contact-note">{isEs ? "Mensaje" : "Message"}</label>
        <textarea
          ref={noteInputRef}
          id="contact-note"
          name="note"
          rows={4}
          required
          aria-invalid={Boolean(fieldErrors.note) || undefined}
          aria-describedby={fieldErrors.note ? "contact-note-error" : undefined}
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            if (fieldErrors.note) {
              setFieldErrors((prev) => ({ ...prev, note: undefined }));
            }
          }}
          disabled={isSubmitting}
          placeholder={
            isEs
              ? "Cuéntanos brevemente en qué podemos ayudarte."
              : "Tell us briefly how we can help."
          }
        />
        {fieldErrors.note ? (
          <p
            id="contact-note-error"
            role="alert"
            className="text-[length:var(--text-xs)] text-[var(--color-gold)]"
          >
            {fieldErrors.note}
          </p>
        ) : null}
      </div>

      {IS_TURNSTILE_ENABLED ? (
        <div className="min-h-[20px]">
          {isEngaged ? (
            <TurnstileField
              onTokenChange={setTurnstileToken}
              language={language}
              resetSignal={turnstileResetSignal}
              theme="dark"
            />
          ) : (
            <p className="inline-flex items-center gap-1.5 text-xs leading-tight text-[var(--color-paper-2)]/70">
              <span
                aria-hidden="true"
                className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-paper-2)]/40"
              />
              <span>
                {isEs ? "Protegido por Cloudflare" : "Protected by Cloudflare"}
              </span>
            </p>
          )}
        </div>
      ) : null}

      <div className="form-footer">
        <div className="grid justify-items-start gap-2">
          <button
            className="primary-button"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? isEs
                ? "Enviando..."
                : "Sending..."
              : isEs
                ? "Enviar nota al equipo"
                : "Send note to the team"}
          </button>
          <span className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
            {isEs
              ? "Alma o Shirish responde personalmente en 1 o 2 días laborables."
              : "Alma or Shirish replies personally within 1–2 business days."}
          </span>
        </div>
        <div
          className={
            isError
              ? "form-message min-w-0 text-[var(--color-gold)]"
              : "form-message min-w-0"
          }
          aria-live="polite"
        >
          {message ? <p>{message}</p> : null}
          {mailtoFallback ? (
            <p className="mt-2">
              <a
                className="inline-flex min-h-[var(--tap-min)] items-center font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)]"
                href={mailtoFallback.href}
              >
                {isEs
                  ? `Abrir correo preparado para ${mailtoFallback.email}`
                  : `Open prepared email to ${mailtoFallback.email}`}
              </a>
            </p>
          ) : null}
        </div>
      </div>

      <p className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
        {isEs ? (
          <>
            Tu mensaje es gestionado por Karmarise Global LLP conforme a nuestra{" "}
            <Link
              className="underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
              href={localizeHref("/privacy-policy")}
            >
              Política de privacidad
            </Link>
            .
          </>
        ) : (
          <>
            Your message is handled by Karmarise Global LLP in accordance with
            our{" "}
            <Link
              className="underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
              href={localizeHref("/privacy-policy")}
            >
              Privacy policy
            </Link>
            .
          </>
        )}
      </p>
    </form>
  );
}
