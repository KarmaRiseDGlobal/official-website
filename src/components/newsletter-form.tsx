"use client";

import Link from "next/link";
import { useId, useState } from "react";

interface NewsletterFormProps {
  variant?: "footer" | "light";
}

export function NewsletterForm({ variant = "footer" }: NewsletterFormProps) {
  const emailId = useId();
  const honeypotId = useId();
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLight = variant === "light";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setIsError(true);
      setMessage("Enter a valid email address before subscribing.");
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
        body: JSON.stringify({ email, companyWebsite }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setIsError(true);
        setMessage(
          result.error ??
            "Unable to subscribe right now. Please try again shortly.",
        );
        return;
      }

      form.reset();
      setIsError(false);
      setMessage(
        "Subscribed. You will receive new Stories and updates from KarmaRise D Global.",
      );
    } catch {
      setIsError(true);
      setMessage("Unable to reach the server right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
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
          Email address for Stories and updates
        </label>
        <input
          id={emailId}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
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
          {isSubmitting ? "Subscribing..." : "Subscribe"}
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
            "Occasional Stories on materials, sampling, and Manufacturing Programmes."}
        </p>
        <Link
          className={
            isLight
              ? "underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              : "text-[var(--color-paper-2)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-gold)]"
          }
          href="/privacy-policy"
        >
          Privacy policy
        </Link>
      </div>
    </form>
  );
}
