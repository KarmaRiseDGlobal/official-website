"use client";

import { useState } from "react";

const contactEmail = "hola@karmarisedglobal.com";

export function ProductBriefForm() {
  const [message, setMessage] = useState("");
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setMailtoHref(null);
      setMessage("Complete the required fields before continuing.");
      form.reportValidity();
      return;
    }

    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const profile = String(data.get("profile") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const language = String(data.get("language") ?? "").trim();
    const product = String(data.get("product") ?? "").trim();
    const readiness = String(data.get("readiness") ?? "").trim();
    const quantity = String(data.get("quantity") ?? "").trim();
    const brief = String(data.get("brief") ?? "").trim();
    const companyWebsite = String(data.get("companyWebsite") ?? "").trim();

    const subject = encodeURIComponent(
      `Product Brief: ${company} (${product})`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Company: ${company}`,
        `Profile: ${profile}`,
        `Work email: ${email}`,
        `Preferred language: ${language}`,
        `Product type: ${product}`,
        `Current stage: ${readiness}`,
        quantity ? `Estimated Bulk Order quantity: ${quantity}` : null,
        "",
        "Project notes:",
        brief,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    );
    const fallbackHref = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    setIsSubmitting(true);
    setMailtoHref(null);
    setMessage("");

    try {
      const response = await fetch("/api/product-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          company,
          profile,
          email,
          language,
          product,
          readiness,
          quantity,
          brief,
          companyWebsite,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setMailtoHref(fallbackHref);
        setMessage(
          result.error ??
            "Direct delivery failed. You can still send your Product Brief via your email app.",
        );
        return;
      }

      form.reset();
      setMessage(
        "Your Product Brief has been sent to KarmaRise D Global. We will reply to your work email shortly.",
      );
    } catch {
      setMailtoHref(fallbackHref);
      setMessage(
        "Unable to reach the server right now. You can still send your Product Brief via your email app.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="brief-form"
      data-endpoint="/api/product-brief"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="hidden" aria-hidden="true">
        <label htmlFor="brief-company-website">Company website</label>
        <input
          id="brief-company-website"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="field-row">
        <div className="field">
          <label htmlFor="brief-name">Your name</label>
          <input id="brief-name" name="name" autoComplete="name" required />
        </div>
        <div className="field">
          <label htmlFor="brief-company">Company or brand</label>
          <input
            id="brief-company"
            name="company"
            autoComplete="organization"
            required
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="brief-profile">Company profile</label>
          <select id="brief-profile" name="profile" defaultValue="" required>
            <option value="" disabled>
              Select one
            </option>
            <option value="Retail chain">Retail chain</option>
            <option value="Independent retailer">Independent retailer</option>
            <option value="Fashion brand">Fashion brand</option>
            <option value="Other business">Other business</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="brief-email">Work email</label>
          <input
            id="brief-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="brief-language">Preferred language</label>
          <select
            id="brief-language"
            name="language"
            defaultValue="English"
            required
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="Portuguese">Portuguese</option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="brief-product">Product type</label>
          <select id="brief-product" name="product" defaultValue="" required>
            <option value="" disabled>
              Select one
            </option>
            <option value="Bags and accessories">Bags and accessories</option>
            <option value="Garments and clothing">Garments and clothing</option>
            <option value="Another product">Another product</option>
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="brief-readiness">Current stage</label>
          <select
            id="brief-readiness"
            name="readiness"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Select one
            </option>
            <option value="Concept or reference items only">
              Concept or reference items only
            </option>
            <option value="Sketches or early tech pack">
              Sketches or early tech pack
            </option>
            <option value="Physical sample ready">Physical sample ready</option>
            <option value="Existing product moving to India">
              Existing product moving to India
            </option>
          </select>
        </div>
        <div className="field">
          <label htmlFor="brief-quantity">
            Estimated Bulk Order quantity (optional)
          </label>
          <input
            id="brief-quantity"
            name="quantity"
            placeholder="For example, 300 units per style"
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="brief-notes">What do you want to make?</label>
        <textarea
          id="brief-notes"
          name="brief"
          rows={5}
          placeholder="Describe materials, construction details, destination market, target timeline, or reference links."
          required
        />
      </div>

      <div className="form-footer">
        <button
          className="primary-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Sending..." : "Send Product Brief"}
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
