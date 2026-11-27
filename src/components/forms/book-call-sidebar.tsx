"use client";

import Image from "next/image";
import Link from "next/link";
import type { RefObject } from "react";

import {
  formatConfirmedDateTime,
  WHATSAPP_BOOK_CALL_HREF,
  type BookingResult,
} from "@/components/forms/book-call-calendar-utils";
import type { ProductCategorySlug } from "@/lib/client-handoff";
import type { SiteLanguage } from "@/lib/urls";

const ALMA_MEETING_PORTRAIT = "/images/founders/alma-swing-laughing.jpeg";

export function BookCallCompanion({
  language,
  isEs,
  localizeHref,
  productSlug,
}: {
  language: SiteLanguage;
  isEs: boolean;
  localizeHref: (href: string) => string;
  productSlug?: ProductCategorySlug | null;
}) {
  const briefHref = productSlug
    ? localizeHref(`/product-brief?product=${productSlug}`)
    : localizeHref("/product-brief");

  return (
    <aside className="mx-auto grid w-full max-w-[54rem] min-w-0 items-start gap-[var(--space-xl)] md:grid-cols-2 lg:gap-[var(--gap-columns)]">
      <div className="grid min-w-0 gap-3">
        <h2 className="m-0 text-[length:var(--text-2xl)] leading-[1.16] font-normal text-[var(--color-forest-deep)]">
          {isEs ? "Con Alma, cara a cara" : "Face to face with Alma"}
        </h2>
        <p className="m-0 max-w-[44ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
          {isEs
            ? "Sin presentaciones ni guiones comerciales. Enséñale un boceto rápido o una pieza de tu tienda, y te envía las conclusiones de la reunión por escrito al colgar."
            : "No slides and no sales script. Show a rough sketch, a bag from your shop, or tell Alma what is on your mind. She emails clear meeting notes straight after."}
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[length:var(--text-sm)]">
          <a
            href="mailto:alma@karmarisedglobal.com"
            className="inline-flex min-h-[var(--tap-min)] max-w-full min-w-0 items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
          >
            <span className="min-w-0 [overflow-wrap:anywhere] break-words">
              alma@karmarisedglobal.com
            </span>
          </a>
          <a
            href={WHATSAPP_BOOK_CALL_HREF[language]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
          >
            WhatsApp (+34 611 722 276)
          </a>
        </div>
      </div>

      <div className="grid min-w-0 gap-3.5">
        <h2 className="m-0 text-[length:var(--text-2xl)] leading-[1.16] font-normal text-[var(--color-forest-deep)]">
          {isEs ? "¿Prefieres escribirlo primero?" : "Prefer to write first?"}
        </h2>
        <p className="m-0 max-w-[44ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
          {isEs
            ? "Envía un briefing de producto con fotos o notas aproximadas. Solo Alma y Shirish ven tus archivos, y puedes pedir acuerdo NDA en cualquier momento."
            : "Send a Product Brief with photos or rough notes instead. Only Alma and Shirish see your files, and mutual NDA protection is available anytime."}
        </p>
        <Link
          href={briefHref}
          className="secondary-button-light w-full sm:w-fit"
        >
          {isEs ? "Empezar briefing de producto" : "Start a Product Brief"}
        </Link>
      </div>
    </aside>
  );
}

export function BookCallConfirmedCard({
  confirmedBooking,
  headingRef,
  isEs,
  locale,
  localizeHref,
  onReset,
}: {
  confirmedBooking: BookingResult;
  headingRef?: RefObject<HTMLHeadingElement | null>;
  isEs: boolean;
  locale: string;
  localizeHref: (href: string) => string;
  onReset: () => void;
}) {
  return (
    <div className="mx-auto grid w-full max-w-[44rem] gap-6 py-2">
      <div className="flex flex-wrap items-center gap-4">
        <div className="editorial-photo-frame h-14 w-14 shrink-0 rounded-[var(--radius-pill)]">
          <Image
            src={ALMA_MEETING_PORTRAIT}
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
            {isEs ? "Videollamada confirmada" : "Video call confirmed"}
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
            ? "Tu charla con Alma queda reservada. Nos vemos pronto."
            : "You are booked with Alma. Looking forward to speaking with you."}
        </h2>
        <p className="num m-0 text-[length:var(--text-md)] font-semibold text-[var(--color-ink-2)]">
          {formatConfirmedDateTime(
            confirmedBooking.startTime,
            locale,
            confirmedBooking.timeZone,
          )}{" "}
          <span className="font-normal text-[var(--color-muted)]">
            ({confirmedBooking.timeZone.replaceAll("_", " ")})
          </span>
        </p>
        <p className="m-0 max-w-[54ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-muted)]">
          {isEs
            ? "La invitación de Google Calendar y el recordatorio desde alma@karmarisedglobal.com ya van camino de tu correo."
            : "Your Google Calendar invite and reminder from alma@karmarisedglobal.com are on their way to your inbox."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 pt-2">
        {confirmedBooking.meetingUrl ? (
          <a
            href={confirmedBooking.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="primary-button-light"
          >
            {isEs ? "Abrir enlace de Google Meet" : "Open Google Meet link"}
          </a>
        ) : null}
        <Link
          href={localizeHref("/product-brief")}
          className="secondary-button-light"
        >
          {isEs
            ? "Compartir referencias del producto"
            : "Share Product Brief references"}
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-3 py-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
        >
          {isEs ? "Reservar otra hora" : "Schedule another time"}
        </button>
      </div>
    </div>
  );
}
