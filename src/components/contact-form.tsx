"use client";

import Link from "next/link";
import { useState } from "react";

import { TurnstileField } from "@/components/turnstile-field";
import { useLanguage } from "@/context/language-context";
import { isValidEmail } from "@/lib/validation";

const IS_TURNSTILE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
);

function getFallbackEmailForTopic(topic: string): string {
  switch (topic) {
    case "Manufacturing Partner introduction":
      return "partners@karmarisedglobal.com";
    case "Stories and editorial":
    case "Almarise":
      return "stories@karmarisedglobal.com";
    case "General enquiry":
    case "Women's Training Initiative":
      return "inquiry@karmarisedglobal.com";
    default:
      return "hola@karmarisedglobal.com";
  }
}

export function ContactForm() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [mailtoFallback, setMailtoFallback] = useState<{
    href: string;
    email: string;
  } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "").trim();
    const note = String(data.get("note") ?? "").trim();
    const companyWebsite = String(data.get("companyWebsite") ?? "").trim();

    if (
      !form.checkValidity() ||
      !name ||
      !isValidEmail(email) ||
      !topic ||
      !note
    ) {
      setIsError(true);
      setMailtoFallback(null);
      setMessage(
        isEs
          ? "Completa tu nombre, un correo electrónico válido, el asunto y tu mensaje antes de continuar."
          : "Complete your name, a valid email, topic, and message before continuing.",
      );
      form.reportValidity();
      return;
    }

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

    const fallbackEmail = getFallbackEmailForTopic(topic);
    const subject = encodeURIComponent(`${topic} · ${name}`);
    const body = encodeURIComponent(
      [`Name: ${name}`, `Email: ${email}`, `Topic: ${topic}`, "", note].join(
        "\n",
      ),
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
          name,
          email,
          topic,
          note,
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

      form.reset();
      setIsError(false);
      setMailtoFallback(null);
      setMessage(
        result.confirmationSent === false
          ? isEs
            ? "Hemos recibido tu mensaje en KarmaRise D Global. Te responderemos muy pronto a tu correo."
            : "Your message has been sent to KarmaRise D Global. We will reply to your email shortly."
          : isEs
            ? "Hemos recibido tu mensaje en KarmaRise D Global. Te hemos enviado un correo de confirmación y te responderemos muy pronto."
            : "Your message has been sent to KarmaRise D Global. We have sent a confirmation email and will reply shortly.",
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

  return (
    <form
      className="brief-form min-w-0"
      data-endpoint="/api/contact"
      noValidate
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
        />
      </div>
      <div className="field-row">
        <div className="field min-w-0">
          <label htmlFor="contact-name">
            {isEs ? "Tu nombre" : "Your name"}
          </label>
          <input
            id="contact-name"
            name="name"
            autoComplete="name"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="field min-w-0">
          <label htmlFor="contact-email">
            {isEs ? "Correo electrónico" : "Email"}
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="field min-w-0">
        <label htmlFor="contact-topic">{isEs ? "Asunto" : "Topic"}</label>
        <select
          id="contact-topic"
          name="topic"
          defaultValue=""
          required
          disabled={isSubmitting}
          className="min-w-0"
        >
          <option value="" disabled>
            {isEs ? "Selecciona un asunto" : "Select a topic"}
          </option>
          <option value="General enquiry">
            {isEs ? "Consulta general" : "General enquiry"}
          </option>
          <option value="Manufacturing Partner introduction">
            {isEs
              ? "Presentación de taller o socio de fabricación"
              : "Manufacturing Partner introduction"}
          </option>
          <option value="Almarise">Almarise</option>
          <option value="Women's Training Initiative">
            {isEs
              ? "Iniciativa de formación para mujeres"
              : "Women's Training Initiative"}
          </option>
          <option value="Stories and editorial">
            {isEs ? "Historias y prensa" : "Stories and editorial"}
          </option>
        </select>
      </div>

      <div className="field min-w-0">
        <label htmlFor="contact-note">{isEs ? "Mensaje" : "Message"}</label>
        <textarea
          id="contact-note"
          name="note"
          rows={5}
          required
          disabled={isSubmitting}
        />
      </div>

      <TurnstileField
        onTokenChange={setTurnstileToken}
        language={language}
        resetSignal={turnstileResetSignal}
        theme="dark"
      />

      <div className="form-footer">
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
              ? "Enviar mensaje"
              : "Send message"}
        </button>
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
                className="inline-flex min-h-[44px] items-center font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)]"
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
