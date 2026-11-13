"use client";

import { useState } from "react";

const contactEmail = "hola@karmarisedglobal.com";

export function ContactForm() {
  const [message, setMessage] = useState("");
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
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

    const subject = encodeURIComponent(`${topic} · ${name}`);
    const body = encodeURIComponent(
      [`Name: ${name}`, `Email: ${email}`, `Topic: ${topic}`, "", note].join(
        "\n",
      ),
    );

    setMailtoHref(`mailto:${contactEmail}?subject=${subject}&body=${body}`);
    setMessage(
      "Direct web delivery is not wired yet. Your note is ready to send via your email app or directly to hola@karmarisedglobal.com.",
    );
  }

  return (
    <form
      className="brief-form"
      data-endpoint=""
      noValidate
      onSubmit={handleSubmit}
    >
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
        <button className="primary-button" type="submit">
          Prepare my message
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
