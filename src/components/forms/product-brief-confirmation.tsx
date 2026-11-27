"use client";

import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";

interface ProductBriefConfirmationProps {
  formTopRef: RefObject<HTMLDivElement | null>;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  isEs: boolean;
  recipientName: string;
  confirmationSent: boolean;
  localizeHref: (href: string) => string;
  onResetDraft: () => void;
}

export function ProductBriefConfirmation({
  formTopRef,
  headingRef,
  isEs,
  recipientName,
  confirmationSent,
  localizeHref,
  onResetDraft,
}: ProductBriefConfirmationProps) {
  return (
    <div ref={formTopRef} className="grid scroll-mt-0 gap-6 py-2">
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
          <span>
            {isEs ? "Briefing de producto recibido" : "Product Brief received"}
          </span>
        </div>
      </div>

      <div className="grid gap-2.5">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="m-0 text-[length:var(--text-2xl)] leading-[1.16] font-normal text-[var(--color-forest-deep)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          {isEs
            ? `Gracias, ${recipientName}. Tu briefing ya está con Alma.`
            : `Thank you, ${recipientName}. Your brief is with Alma.`}
        </h2>
        <p className="m-0 max-w-[54ch] text-[length:var(--text-md)] leading-relaxed text-[var(--color-ink-2)]">
          {confirmationSent
            ? isEs
              ? "Alma leerá tus notas y te escribirá personalmente en 1 o 2 días laborables. También te hemos enviado una copia a tu correo."
              : "Alma will read through your notes and reply personally within 1 to 2 business days. We also sent a copy to your inbox."
            : isEs
              ? "Alma leerá tus notas y te escribirá personalmente a tu correo en 1 o 2 días laborables."
              : "Alma will read through your notes and reply personally to your email within 1 to 2 business days."}
        </p>
      </div>

      <div className="grid gap-3.5 pt-2">
        <p className="m-0 text-[length:var(--text-sm)] text-[var(--color-ink-2)]">
          {isEs
            ? "¿Te apetece comentarlo cara a cara? Tus datos de contacto ya están listos."
            : "Want to talk it through face to face? Your contact details are already filled in."}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <Link
            className="primary-button-light"
            href={localizeHref("/book-a-call?duration=15")}
          >
            {isEs ? "Reservar llamada con Alma" : "Book a call with Alma"}
          </Link>
          <button
            type="button"
            onClick={onResetDraft}
            className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
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
