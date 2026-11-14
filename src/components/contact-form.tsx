"use client";

import { useState } from "react";

const contactEmail = "hola@karmarisedglobal.com";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setMailtoHref(null);
      setMessage(
        "Complete your name, email, topic, and message before continuing.",
      );
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const topic = String(data.get("topic") ?? "").trim();
    const note = String(data.get("note") ?? "").trim();
    const companyWebsite = String(data.get("companyWebsite") ?? "").trim();

    const subject = encodeURIComponent(`${topic} · ${name}`);
    const body = encodeURIComponent(
      [`Name: ${name}`, `Email: ${email}`, `Topic: ${topic}`, "", note].join(
        "\n",
      ),
    );
    const fallbackHref = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    setIsSubmitting(true);
    setMailtoHref(null);
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, note, companyWebsite }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setMailtoHref(fallbackHref);
        setMessage(
          result.error ??
            "Direct delivery failed. You can still send your message via your email app.",
        );
        return;
      }

      form.reset();
      setMessage(
        "Your message has been sent to KarmaRise D Global. We will reply to your email shortly.",
      );
    } catch {
      setMailtoHref(fallbackHref);
      setMessage(
        "Unable to reach the server right now. You can still send your message via your email app.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="brief-form"
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
        <div className="field">
          <label htmlFor="contact-name">Your name</label>
          <input id="contact-name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="contact-email">Email</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="contact-topic">Topic</label>
        <select id="contact-topic" name="topic" defaultValue="" required>
          <option value="" disabled>
            Select a topic
          </option>
          <option value="General enquiry">General enquiry</option>
          <option value="Manufacturing Partner introduction">
            Manufacturing Partner introduction
          </option>
          <option value="Almarise">Almarise</option>
          <option value="Women's Training Initiative">
            Women&apos;s Training Initiative
          </option>
          <option value="Stories and editorial">Stories and editorial</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="contact-note">Message</label>
        <textarea id="contact-note" name="note" rows={5} required />
      </div>

      <div className="form-footer">
        <button
          className="primary-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send message"}
        </button>
        <div className="form-message" aria-live="polite">
          {message ? <p>{message}</p> : null}
          {mailtoHref ? (
            <p className="mt-2">
              <a
                className="font-semibold text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)]"
                href={mailtoHref}
              >
                Open prepared email to {contactEmail}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </form>
  );
}
