"use client";

import Image from "next/image";
import Link from "next/link";

import {
  formatConfirmedDateTime,
  WHATSAPP_BOOK_CALL_HREF,
  type BookingResult,
} from "@/components/forms/book-call-calendar-utils";
import type { SiteLanguage } from "@/lib/urls";

export function BookCallEditorialSidebar({
  language,
  isEs,
  localizeHref,
}: {
  language: SiteLanguage;
  isEs: boolean;
  localizeHref: (href: string) => string;
}) {
  return (
    <aside className="order-2 grid min-w-0 gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-5 sm:p-7 xl:sticky xl:top-32 xl:order-1 xl:col-span-4">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[var(--color-rule-2)]/50">
          <Image
            src="/images/founders/alma-spain-hillside-portrait.jpeg"
            alt="Alma"
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <div className="grid min-w-0 gap-0.5">
          <p className="font-display text-[length:var(--text-xl)] leading-tight font-normal text-[var(--color-forest-deep)]">
            Alma
          </p>
          <p className="text-[length:var(--text-xs)] font-medium text-[var(--color-muted)]">
            {isEs
              ? "Cofundadora · España e India"
              : "Co-founder · Spain & India"}
          </p>
        </div>
      </div>

      <p className="text-[length:var(--text-sm)] leading-relaxed text-[var(--color-ink-2)]">
        {isEs
          ? "Soy de España y fundé KarmaRise D Global junto a Shirish en la India. Paso la semana recorriendo talleres familiares, revisando pieles y tejidos a mano para dar forma contigo a un briefing de producto claro."
          : "I am from Spain and co-founded KarmaRise D Global with Shirish in India. I spend my weeks visiting family-run makers across India, checking hides and woven cloth by hand, and helping turn your early notes into a clear Product Brief."}
      </p>

      <ul className="m-0 grid list-none gap-2.5 border-t border-[var(--color-rule)] p-0 pt-4 text-[length:var(--text-xs)] text-[var(--color-ink-2)]">
        <li className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-clay)]"
          />
          <span>
            {isEs
              ? "Videollamada gratuita por Google Meet con invitación automática al calendario"
              : "Free Google Meet call with an instant calendar invite"}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-clay)]"
          />
          <span>
            {isEs
              ? "Hablamos con total comodidad en español, inglés o portugués"
              : "Speak comfortably in English, Spanish, or Portuguese"}
          </span>
        </li>
        <li className="flex items-start gap-2">
          <span
            aria-hidden="true"
            className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-clay)]"
          />
          <span>
            {isEs
              ? "Trae un boceto sencillo, un bolso de tu tienda o simplemente la idea"
              : "Bring a rough sketch, a bag from your shop, or just an idea"}
          </span>
        </li>
      </ul>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-[var(--color-rule)] pt-3 text-[length:var(--text-xs)]">
        <a
          href={WHATSAPP_BOOK_CALL_HREF[language]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
        >
          {isEs ? "Escribir por WhatsApp" : "Message on WhatsApp"}
        </a>
        <Link
          href={localizeHref("/product-brief")}
          className="inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
        >
          {isEs ? "Empezar briefing de producto" : "Start a Product Brief"}
        </Link>
      </div>
    </aside>
  );
}

export function BookCallConfirmedCard({
  confirmedBooking,
  isEs,
  locale,
  localizeHref,
  onReset,
}: {
  confirmedBooking: BookingResult;
  isEs: boolean;
  locale: string;
  localizeHref: (href: string) => string;
  onReset: () => void;
}) {
  return (
    <div className="grid gap-6 py-4" aria-live="polite">
      <div className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-pale-sage)] px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)]">
        <span
          aria-hidden="true"
          className="h-2 w-2 rounded-full bg-[var(--color-forest)]"
        />
        <span>{isEs ? "Videollamada confirmada" : "Video call confirmed"}</span>
      </div>

      <div className="grid gap-2">
        <h2 className="text-[length:var(--text-2xl)] font-normal text-[var(--color-forest-deep)]">
          {isEs
            ? "Tu llamada con Alma queda reservada. Nos vemos pronto."
            : "You are booked with Alma. Looking forward to speaking with you."}
        </h2>
        <p className="text-[length:var(--text-md)] text-[var(--color-ink-2)]">
          {formatConfirmedDateTime(
            confirmedBooking.startTime,
            locale,
            confirmedBooking.timeZone,
          )}{" "}
          <span className="text-[var(--color-muted)]">
            ({confirmedBooking.timeZone.replaceAll("_", " ")})
          </span>
        </p>
        <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
          {isEs
            ? "La invitación de Google Calendar y el recordatorio desde alma@karmarisedglobal.com ya van camino de tu correo."
            : "Your Google Calendar invite and reminder from alma@karmarisedglobal.com are on their way to your inbox."}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-rule)] pt-5">
        {confirmedBooking.meetingUrl ? (
          <a
            href={confirmedBooking.meetingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[var(--tap-min)] items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-5 py-2.5 text-center text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] no-underline transition-colors hover:bg-[var(--color-forest)]"
          >
            {isEs ? "Enlace de Google Meet" : "Open Google Meet link"}
          </a>
        ) : null}
        <Link
          href={localizeHref("/product-brief")}
          className="inline-flex min-h-[var(--tap-min)] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-rule-2)] px-5 py-2.5 text-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] no-underline transition-colors hover:border-[var(--color-forest-deep)]"
        >
          {isEs
            ? "Enviar referencias de briefing de producto"
            : "Share Product Brief references"}
        </Link>
        <button
          type="button"
          onClick={onReset}
          className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-3 py-2 text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
        >
          {isEs ? "Reservar otra hora" : "Schedule another time"}
        </button>
      </div>
    </div>
  );
}
