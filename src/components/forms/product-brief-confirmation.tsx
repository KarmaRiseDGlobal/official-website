"use client";

import Link from "next/link";
import type { RefObject } from "react";

interface ProductBriefConfirmationProps {
  formTopRef: RefObject<HTMLDivElement | null>;
  isEs: boolean;
  recipientName: string;
  confirmationSent: boolean;
  localizeHref: (href: string) => string;
  onResetDraft: () => void;
}

export function ProductBriefConfirmation({
  formTopRef,
  isEs,
  recipientName,
  confirmationSent,
  localizeHref,
  onResetDraft,
}: ProductBriefConfirmationProps) {
  return (
    <div
      ref={formTopRef}
      aria-live="polite"
      className="grid gap-6 rounded-[var(--radius-card)] border border-[var(--color-paper)]/20 bg-[var(--color-night)]/25 p-6 sm:p-8"
    >
      <div className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-gold)]/20 px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-gold)]">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-[var(--color-gold)]"
        />
        <span>
          {isEs ? "Briefing de producto recibido" : "Product Brief received"}
        </span>
      </div>

      <div className="grid gap-2">
        <h3 className="text-[length:var(--text-2xl)] font-normal text-[var(--color-paper)]">
          {isEs
            ? `Gracias, ${recipientName}. Tu briefing ya está con Alma.`
            : `Thank you, ${recipientName}. Your brief is with Alma.`}
        </h3>
        <p className="text-[length:var(--text-md)] leading-relaxed text-[var(--color-paper-2)]">
          {confirmationSent
            ? isEs
              ? "Alma leerá tus notas y te escribirá personalmente en 1 o 2 días laborables. También te hemos enviado una copia a tu correo."
              : "Alma will read through your notes and reply personally within 1–2 business days. We also sent a copy to your inbox."
            : isEs
              ? "Alma leerá tus notas y te escribirá personalmente a tu correo en 1 o 2 días laborables."
              : "Alma will read through your notes and reply personally to your email within 1–2 business days."}
        </p>
      </div>

      <div className="grid gap-3 border-t border-[var(--color-paper)]/15 pt-5">
        <p className="text-[length:var(--text-sm)] text-[var(--color-paper-2)]">
          {isEs
            ? "¿Te apetece comentarlo cara a cara? Tus datos de contacto ya están rellenos."
            : "Ready to talk it through face to face? Your contact details are already filled in."}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            className="primary-button"
            href={localizeHref("/book-a-call?duration=15")}
          >
            {isEs
              ? "Llamada gratis de 15 min con Alma"
              : "Book a free 15-min call with Alma"}
          </Link>
          <button
            type="button"
            onClick={onResetDraft}
            className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-2 text-[length:var(--text-sm)] font-medium text-[var(--color-paper-2)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
          >
            {isEs
              ? "Enviar otro briefing de producto"
              : "Send another Product Brief"}
          </button>
        </div>
      </div>
    </div>
  );
}
