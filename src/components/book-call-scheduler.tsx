"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

import { TurnstileField } from "@/components/turnstile-field";
import { useLanguage } from "@/context/language-context";
import type { CallDuration, CallLanguage } from "@/lib/cal";
import { isValidEmail } from "@/lib/validation";

const BUILD_TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

const WHATSAPP_HREF = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma, I would like to arrange a video call about KarmaRise D Global.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma, me gustaría concertar una videollamada con KarmaRise D Global.")}`,
};

const CURATED_TIMEZONES: readonly string[] = [
  "Europe/Madrid",
  "Europe/Lisbon",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Rome",
  "Europe/Amsterdam",
  "Asia/Kolkata",
  "America/New_York",
  "UTC",
];

interface SlotsApiResponse {
  ok?: boolean;
  timeZone?: string;
  slotsByDate?: Record<string, string[]>;
  turnstileSiteKey?: string;
  error?: string;
}

interface BookingResult {
  uid: string;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  timeZone: string;
  duration: CallDuration;
  callLanguage: CallLanguage;
  meetingUrl: string | null;
}

interface BookingApiResponse {
  ok?: boolean;
  code?: string;
  booking?: BookingResult;
  error?: string;
}

interface CalendarCell {
  dateKey: string;
  dayNumber: number;
}

function getMonthKey(year: number, monthIndexZero: number): string {
  return `${year}-${String(monthIndexZero + 1).padStart(2, "0")}`;
}

function parseMonthKey(monthKey: string): { year: number; month: number } {
  const [yStr, mStr] = monthKey.split("-");
  const year = Number(yStr);
  const month = Number(mStr);
  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    const now = new Date();
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
  }
  return { year, month };
}

function buildMonthGrid(monthKey: string): Array<CalendarCell | null> {
  const { year, month } = parseMonthKey(monthKey);
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  // Monday-first grid: Monday=0 ... Sunday=6
  const startOffset = (firstDay.getUTCDay() + 6) % 7;

  const cells: Array<CalendarCell | null> = [];
  for (let i = 0; i < startOffset; i += 1) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      dateKey: `${monthKey}-${String(day).padStart(2, "0")}`,
      dayNumber: day,
    });
  }
  return cells;
}

function shiftMonthKey(monthKey: string, delta: number): string {
  const { year, month } = parseMonthKey(monthKey);
  const shifted = new Date(Date.UTC(year, month - 1 + delta, 1));
  return getMonthKey(shifted.getUTCFullYear(), shifted.getUTCMonth());
}

function formatMonthTitle(monthKey: string, locale: string): string {
  const { year, month } = parseMonthKey(monthKey);
  const date = new Date(Date.UTC(year, month - 1, 15));
  const label = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function formatDateHeading(
  dateKey: string,
  locale: string,
  timeZone: string,
): string {
  const [yStr, mStr, dStr] = dateKey.split("-");
  const date = new Date(
    Date.UTC(Number(yStr), Number(mStr) - 1, Number(dStr), 12, 0, 0),
  );
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  }).format(date);
  void timeZone;
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

function formatSlotTime(
  isoString: string,
  locale: string,
  timeZone: string,
): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  return new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
}

function formatConfirmedDateTime(
  isoString: string,
  locale: string,
  timeZone: string,
): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return isoString;
  }
  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
}

export function BookCallScheduler() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";
  const locale = isEs ? "es-ES" : "en-GB";

  const [duration, setDuration] = useState<CallDuration>("30");
  const [timeZone, setTimeZone] = useState<string>("Europe/Madrid");
  const [timeZoneReady, setTimeZoneReady] = useState<boolean>(false);
  const [timeZoneOptions, setTimeZoneOptions] =
    useState<readonly string[]>(CURATED_TIMEZONES);

  const [currentMonthKey, setCurrentMonthKey] = useState<string>(() => {
    const now = new Date();
    return getMonthKey(now.getFullYear(), now.getMonth());
  });
  const [monthKey, setMonthKey] = useState<string>(() => {
    const now = new Date();
    return getMonthKey(now.getFullYear(), now.getMonth());
  });

  const [slotsByDate, setSlotsByDate] = useState<Record<string, string[]>>({});
  const [isLoadingSlots, setIsLoadingSlots] = useState<boolean>(true);
  const [slotsError, setSlotsError] = useState<string>("");
  const [selectedDateKey, setSelectedDateKey] = useState<string>("");
  const [selectedSlotIso, setSelectedSlotIso] = useState<string>("");

  const [callLanguageOverride, setCallLanguageOverride] =
    useState<CallLanguage | null>(null);
  const callLanguage: CallLanguage =
    callLanguageOverride ?? (isEs ? "es" : "en");
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [company, setCompany] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [companyWebsite, setCompanyWebsite] = useState<string>("");

  const [runtimeTurnstileSiteKey, setRuntimeTurnstileSiteKey] =
    useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] =
    useState<BookingResult | null>(null);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) {
        return;
      }
      try {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date();
        setCurrentMonthKey(getMonthKey(now.getFullYear(), now.getMonth()));
        if (detected) {
          setTimeZone(detected);
        }

        const supported =
          typeof Intl.supportedValuesOf === "function"
            ? Intl.supportedValuesOf("timeZone")
            : [];

        const merged = Array.from(
          new Set([
            ...(detected ? [detected] : []),
            ...CURATED_TIMEZONES,
            ...supported,
          ]),
        );
        setTimeZoneOptions(merged);
      } catch {
        // Keep safe default Europe/Madrid if Intl inspection fails.
      } finally {
        setTimeZoneReady(true);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  const fetchAndApplySlots = useCallback(
    async (
      targetMonth: string,
      targetDuration: CallDuration,
      targetZone: string,
      signal?: AbortSignal,
    ) => {
      const params = new URLSearchParams({
        language,
        duration: targetDuration,
        month: targetMonth,
        timeZone: targetZone,
      });

      try {
        const response = await fetch(
          `/api/book-call/slots?${params.toString()}`,
          {
            method: "GET",
            signal,
            cache: "no-store",
          },
        );
        const payload = (await response
          .json()
          .catch(() => ({}))) as SlotsApiResponse;

        if (!response.ok || !payload.ok) {
          setSlotsByDate({});
          setSelectedDateKey("");
          setSelectedSlotIso("");
          setSlotsError(
            payload.error ||
              (isEs
                ? "No pudimos cargar los horarios ahora mismo."
                : "Unable to load open times right now."),
          );
          return;
        }

        if (payload.turnstileSiteKey) {
          setRuntimeTurnstileSiteKey(payload.turnstileSiteKey);
        }

        const nextSlots = payload.slotsByDate ?? {};
        setSlotsByDate(nextSlots);

        const availableDays = Object.keys(nextSlots).sort();
        setSelectedDateKey((prev) => {
          if (prev && (nextSlots[prev]?.length ?? 0) > 0) {
            return prev;
          }
          return availableDays[0] ?? "";
        });
        setSelectedSlotIso((prev) => {
          if (!prev) {
            return "";
          }
          const stillPresent = Object.values(nextSlots).some((list) =>
            list.includes(prev),
          );
          return stillPresent ? prev : "";
        });
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") {
          return;
        }
        setSlotsByDate({});
        setSelectedDateKey("");
        setSelectedSlotIso("");
        setSlotsError(
          isEs
            ? "No hemos podido conectar con el calendario ahora mismo."
            : "Unable to connect to the calendar right now.",
        );
      } finally {
        setIsLoadingSlots(false);
      }
    },
    [isEs, language],
  );

  const loadSlots = useCallback(
    (targetMonth: string, targetDuration: CallDuration, targetZone: string) => {
      setIsLoadingSlots(true);
      setSlotsError("");
      void fetchAndApplySlots(targetMonth, targetDuration, targetZone);
    },
    [fetchAndApplySlots],
  );

  useEffect(() => {
    if (!timeZoneReady) {
      return undefined;
    }
    const controller = new AbortController();
    void Promise.resolve().then(() => {
      if (!controller.signal.aborted) {
        return fetchAndApplySlots(
          monthKey,
          duration,
          timeZone,
          controller.signal,
        );
      }
      return undefined;
    });
    return () => controller.abort();
  }, [timeZoneReady, monthKey, duration, timeZone, fetchAndApplySlots]);

  const calendarCells = useMemo(() => buildMonthGrid(monthKey), [monthKey]);
  const daySlots = useMemo(
    () => (selectedDateKey ? (slotsByDate[selectedDateKey] ?? []) : []),
    [selectedDateKey, slotsByDate],
  );
  const availableDayCount = Object.keys(slotsByDate).length;
  const effectiveTurnstileSiteKey =
    runtimeTurnstileSiteKey || BUILD_TURNSTILE_SITE_KEY;

  const weekdayLabels = isEs
    ? ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const canGoPrevMonth = monthKey > currentMonthKey;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!selectedSlotIso) {
      setSubmitError(
        isEs
          ? "Elige primero un día y una hora disponibles."
          : "Pick an open date and time first.",
      );
      return;
    }

    if (!trimmedName || !isValidEmail(trimmedEmail)) {
      setSubmitError(
        isEs
          ? "Introduce tu nombre y un correo electrónico válido."
          : "Enter your name and a valid email address.",
      );
      return;
    }

    if (effectiveTurnstileSiteKey && !turnstileToken) {
      setSubmitError(
        isEs
          ? "Completa la verificación de seguridad antes de confirmar."
          : "Please complete the security check before confirming.",
      );
      return;
    }

    setIsSubmitting(true);
    let didAttempt = false;

    try {
      didAttempt = true;
      const response = await fetch("/api/book-call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteLanguage: language,
          duration,
          start: selectedSlotIso,
          timeZone,
          name: trimmedName,
          email: trimmedEmail,
          company: company.trim(),
          callLanguage,
          notes: notes.trim(),
          companyWebsite,
          turnstileToken,
        }),
      });

      const payload = (await response
        .json()
        .catch(() => ({}))) as BookingApiResponse;
      if (!response.ok || !payload.ok || !payload.booking) {
        setSubmitError(
          payload.error ||
            (isEs
              ? "No se pudo completar la reserva. Inténtalo de nuevo."
              : "Could not complete the booking. Please try again."),
        );
        if (payload.code === "slot_unavailable" || response.status === 409) {
          setSelectedSlotIso("");
          void loadSlots(monthKey, duration, timeZone);
        }
        return;
      }

      setConfirmedBooking(payload.booking);
      setNotes("");
    } catch {
      setSubmitError(
        isEs
          ? "No pudimos conectar con el servidor. Puedes escribirnos por WhatsApp."
          : "Unable to reach the server. You can message us on WhatsApp instead.",
      );
    } finally {
      setIsSubmitting(false);
      if (didAttempt && effectiveTurnstileSiteKey) {
        setTurnstileToken("");
        setTurnstileResetSignal((value) => value + 1);
      }
    }
  }

  function handleResetForAnotherCall() {
    setConfirmedBooking(null);
    setSelectedSlotIso("");
    setSubmitError("");
    void loadSlots(monthKey, duration, timeZone);
  }

  return (
    <div className="grid items-start gap-[var(--gap-columns)] xl:grid-cols-12">
      {/* Editorial left column: Alma profile + call format */}
      <aside className="grid min-w-0 gap-6 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-5 sm:p-7 md:grid-cols-2 md:items-start xl:sticky xl:top-32 xl:col-span-4 xl:grid-cols-1">
        <div className="grid min-w-0 gap-5">
          <div className="flex items-center gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-[var(--color-rule-2)]/50">
              <Image
                src="/images/alma (1).jpeg"
                alt="Alma"
                fill
                sizes="64px"
                className="object-cover"
              />
            </div>
            <div className="grid min-w-0 gap-0.5">
              <p className="font-display text-[length:var(--text-xl)] leading-tight font-medium text-[var(--color-forest-deep)]">
                Alma
              </p>
              <p className="text-[length:var(--text-xs)] font-medium text-[var(--color-muted)]">
                {isEs
                  ? "Cofundadora · KarmaRise D Global"
                  : "Co-founder · KarmaRise D Global"}
              </p>
            </div>
          </div>

          <p className="text-[length:var(--text-sm)] leading-relaxed text-[var(--color-ink-2)]">
            {isEs
              ? "Soy de España y cofundé KarmaRise D Global con Shirish en la India. Paso la semana recorriendo talleres, revisando pieles y tejidos a mano y ayudándote a dar forma a tu Product Brief."
              : "Originally from Spain, I co-founded KarmaRise D Global with Shirish in India. I spend my weeks walking workshop floors, checking hides and textiles by hand, and helping bring your Product Brief to life."}
          </p>
        </div>

        <div className="grid min-w-0 gap-5 border-t border-[var(--color-rule)] pt-5 md:border-t-0 md:border-l md:pt-0 md:pl-6 xl:border-t xl:border-l-0 xl:pt-5 xl:pl-0">
          <div className="grid gap-2.5">
            <span className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-muted)] uppercase">
              {isEs ? "Duración de la llamada" : "Call length"}
            </span>
            <div
              role="group"
              aria-label={isEs ? "Duración de la llamada" : "Call length"}
              className="grid grid-cols-2 gap-2"
            >
              {(
                [
                  {
                    id: "30" as const,
                    title: isEs ? "30 min" : "30 min",
                    subtitle: isEs ? "Product Brief" : "Product Brief",
                  },
                  {
                    id: "15" as const,
                    title: isEs ? "15 min" : "15 min",
                    subtitle: isEs ? "Consulta rápida" : "Quick intro",
                  },
                ] as const
              ).map((option) => {
                const active = duration === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setIsLoadingSlots(true);
                      setSlotsError("");
                      setDuration(option.id);
                      setSelectedSlotIso("");
                      setConfirmedBooking(null);
                    }}
                    className={`grid min-h-[44px] cursor-pointer gap-0.5 rounded-xl border px-3.5 py-2.5 text-left transition-colors ${
                      active
                        ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                        : "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-forest-deep)] hover:border-[var(--color-forest)]"
                    }`}
                  >
                    <span className="num text-[length:var(--text-sm)] font-semibold">
                      {option.title}
                    </span>
                    <span
                      className={`text-[length:var(--text-xs)] ${
                        active
                          ? "text-[var(--color-paper-2)]"
                          : "text-[var(--color-muted)]"
                      }`}
                    >
                      {option.subtitle}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <ul className="m-0 grid list-none gap-2.5 border-t border-[var(--color-rule)] p-0 pt-5 text-[length:var(--text-xs)] text-[var(--color-ink-2)]">
            <li className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-clay)]"
              />
              <span>
                {isEs
                  ? "Videollamada por Google Meet con invitación de calendario automática."
                  : "Google Meet call with an automatic calendar invite and reminder."}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-clay)]"
              />
              <span>
                {isEs
                  ? "Podemos hablar en español, inglés o portugués."
                  : "Speak in English, Spanish, or Portuguese."}
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span
                aria-hidden="true"
                className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-clay)]"
              />
              <span>
                {isEs
                  ? "Los horarios se convierten automáticamente a tu zona horaria."
                  : "Available slots convert automatically to your local timezone."}
              </span>
            </li>
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-[var(--color-rule)] pt-3 text-[length:var(--text-xs)] md:col-span-2 xl:col-span-1">
          <a
            href={WHATSAPP_HREF[language]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
          >
            {isEs ? "Escribir por WhatsApp" : "Message on WhatsApp"}
          </a>
          <Link
            href={localizeHref("/product-brief")}
            className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
          >
            {isEs ? "Enviar Product Brief" : "Start a Product Brief"}
          </Link>
        </div>
      </aside>

      {/* Interactive scheduler card */}
      <div className="min-w-0 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] p-4 shadow-[var(--shadow-card)] sm:p-6 md:p-8 xl:col-span-8">
        {confirmedBooking ? (
          <div className="grid gap-6 py-4" aria-live="polite">
            <div className="inline-flex w-fit items-center gap-2 rounded-[var(--radius-pill)] bg-[var(--color-pale-sage)] px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)]">
              <span
                aria-hidden="true"
                className="h-2 w-2 rounded-full bg-[var(--color-forest)]"
              />
              <span>
                {isEs ? "Videollamada confirmada" : "Video call confirmed"}
              </span>
            </div>

            <div className="grid gap-2">
              <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-forest-deep)]">
                {isEs
                  ? "Nos vemos pronto con Alma"
                  : "You are booked with Alma"}
              </h2>
              <p className="text-[length:var(--text-md)] text-[var(--color-ink-2)]">
                {formatConfirmedDateTime(
                  confirmedBooking.startTime,
                  locale,
                  confirmedBooking.timeZone,
                )}{" "}
                <span className="text-[var(--color-muted)]">
                  ({confirmedBooking.timeZone})
                </span>
              </p>
              <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                {isEs
                  ? "Hemos enviado la invitación de Google Calendar y el recordatorio desde alma@karmarisedglobal.com a tu correo."
                  : "A Google Calendar invite and reminder email from alma@karmarisedglobal.com are on the way to your inbox."}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 border-t border-[var(--color-rule)] pt-5">
              {confirmedBooking.meetingUrl ? (
                <a
                  href={confirmedBooking.meetingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-5 py-2.5 text-center text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] no-underline transition-colors hover:bg-[var(--color-forest)]"
                >
                  {isEs ? "Enlace de Google Meet" : "Open Google Meet link"}
                </a>
              ) : null}
              <Link
                href={localizeHref("/product-brief")}
                className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-rule-2)] px-5 py-2.5 text-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] no-underline transition-colors hover:border-[var(--color-forest-deep)]"
              >
                {isEs
                  ? "Compartir referencias de Product Brief"
                  : "Share Product Brief references"}
              </Link>
              <button
                type="button"
                onClick={handleResetForAnotherCall}
                className="inline-flex min-h-[44px] cursor-pointer items-center bg-transparent px-3 py-2 text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
              >
                {isEs ? "Reservar otra hora" : "Schedule another time"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-7">
            {/* Top bar: Month + Timezone */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-rule)] pb-5">
              <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start sm:gap-3">
                <button
                  type="button"
                  disabled={!canGoPrevMonth || isLoadingSlots}
                  aria-label={isEs ? "Mes anterior" : "Previous month"}
                  onClick={() => {
                    setIsLoadingSlots(true);
                    setSlotsError("");
                    setSelectedSlotIso("");
                    setSelectedDateKey("");
                    setMonthKey((prev) => shiftMonthKey(prev, -1));
                  }}
                  className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ←
                </button>
                <h2 className="min-w-0 flex-1 text-center text-[length:var(--text-lg)] font-medium text-[var(--color-forest-deep)] sm:min-w-[11rem] sm:flex-none">
                  {formatMonthTitle(monthKey, locale)}
                </h2>
                <button
                  type="button"
                  disabled={isLoadingSlots}
                  aria-label={isEs ? "Mes siguiente" : "Next month"}
                  onClick={() => {
                    setIsLoadingSlots(true);
                    setSlotsError("");
                    setSelectedSlotIso("");
                    setSelectedDateKey("");
                    setMonthKey((prev) => shiftMonthKey(prev, 1));
                  }}
                  className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  →
                </button>
              </div>

              <label className="flex w-full flex-wrap items-center gap-2 text-[length:var(--text-xs)] text-[var(--color-muted)] sm:w-auto">
                <span className="font-semibold whitespace-nowrap">
                  {isEs ? "Tu zona horaria" : "Timezone"}
                </span>
                <select
                  aria-label={isEs ? "Tu zona horaria" : "Your timezone"}
                  value={timeZone}
                  onChange={(event) => {
                    setIsLoadingSlots(true);
                    setSlotsError("");
                    setTimeZone(event.target.value);
                    setSelectedSlotIso("");
                  }}
                  className="min-h-[44px] w-full min-w-0 flex-1 rounded-lg border border-[var(--color-rule)] bg-[var(--color-paper)] px-2.5 py-2 text-[length:var(--text-md)] font-medium text-[var(--color-forest-deep)] focus:border-[var(--color-forest)] focus:outline-none sm:w-auto sm:max-w-[15rem] sm:flex-none"
                >
                  {timeZoneOptions.map((tz) => (
                    <option key={tz} value={tz}>
                      {tz.replaceAll("_", " ")}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {slotsError ? (
              <div
                role="alert"
                className="grid gap-3 rounded-xl border border-[var(--color-clay)]/40 bg-[var(--color-paper)] p-5 text-[length:var(--text-sm)] text-[var(--color-ink-2)]"
              >
                <p>{slotsError}</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => void loadSlots(monthKey, duration, timeZone)}
                    className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-4 py-2 text-[length:var(--text-xs)] font-semibold text-[var(--color-paper)]"
                  >
                    {isEs ? "Reintentar" : "Try again"}
                  </button>
                  <a
                    href={WHATSAPP_HREF[language]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[44px] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-rule-2)] px-4 py-2 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)] no-underline"
                  >
                    {isEs ? "Escribir por WhatsApp" : "Message on WhatsApp"}
                  </a>
                </div>
              </div>
            ) : null}

            {/* Calendar + Time slots grid */}
            <div className="grid gap-6 md:grid-cols-12">
              <div className="grid min-w-0 gap-3 md:col-span-7">
                <div className="grid grid-cols-7 gap-1 text-center text-[length:var(--text-xs)] font-semibold text-[var(--color-muted)] sm:gap-1.5">
                  {weekdayLabels.map((dayLabel) => (
                    <span key={dayLabel} className="py-1">
                      {dayLabel}
                    </span>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
                  {calendarCells.map((cell, index) => {
                    if (!cell) {
                      return <span key={`empty-${index}`} className="h-11" />;
                    }
                    const slotsForDay = slotsByDate[cell.dateKey] ?? [];
                    const hasSlots = slotsForDay.length > 0;
                    const isSelected = cell.dateKey === selectedDateKey;

                    return (
                      <button
                        key={cell.dateKey}
                        type="button"
                        disabled={isLoadingSlots || !hasSlots}
                        aria-pressed={isSelected}
                        aria-label={cell.dateKey}
                        onClick={() => {
                          setSelectedDateKey(cell.dateKey);
                          setSelectedSlotIso("");
                          setSubmitError("");
                        }}
                        className={`num relative flex h-11 min-h-[44px] cursor-pointer items-center justify-center rounded-xl text-[length:var(--text-sm)] transition-colors ${
                          isSelected
                            ? "bg-[var(--color-forest-deep)] font-semibold text-[var(--color-paper)]"
                            : hasSlots
                              ? "border border-[var(--color-rule)] bg-[var(--color-paper)] font-medium text-[var(--color-forest-deep)] hover:border-[var(--color-forest)] hover:bg-[var(--color-pale-sage)]/55"
                              : "cursor-default text-[var(--color-muted)]/40"
                        }`}
                      >
                        {cell.dayNumber}
                      </button>
                    );
                  })}
                </div>

                {!isLoadingSlots && !slotsError && availableDayCount === 0 ? (
                  <p className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    {isEs
                      ? "No quedan huecos libres este mes. Prueba con el mes siguiente o escríbenos por WhatsApp."
                      : "No open slots remain this month. Check the next month or message us on WhatsApp."}
                  </p>
                ) : null}
              </div>

              <div className="grid min-w-0 content-start gap-3 border-t border-[var(--color-rule)] pt-5 md:col-span-5 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                <p className="text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
                  {selectedDateKey
                    ? formatDateHeading(selectedDateKey, locale, timeZone)
                    : isEs
                      ? "Elige un día"
                      : "Pick a day"}
                </p>

                {isLoadingSlots ? (
                  <p className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    {isEs
                      ? "Consultando horarios libres..."
                      : "Checking open times..."}
                  </p>
                ) : daySlots.length > 0 ? (
                  <div className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                    {daySlots.map((slotIso) => {
                      const active = slotIso === selectedSlotIso;
                      return (
                        <button
                          key={slotIso}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            setSelectedSlotIso(slotIso);
                            setSubmitError("");
                          }}
                          className={`num inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-[length:var(--text-sm)] font-medium transition-colors ${
                            active
                              ? "border-[var(--color-clay-ink)] bg-[var(--color-clay-ink)] text-[var(--color-paper)]"
                              : "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-forest-deep)] hover:border-[var(--color-forest)]"
                          }`}
                        >
                          {formatSlotTime(slotIso, locale, timeZone)}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    {isEs
                      ? "Selecciona un día marcado para ver las horas disponibles."
                      : "Select a highlighted day to see open times."}
                  </p>
                )}
              </div>
            </div>

            {/* Attendee details form */}
            <form
              onSubmit={handleSubmit}
              noValidate
              className="grid gap-4 border-t border-[var(--color-rule)] pt-6"
            >
              <div className="hidden" aria-hidden="true">
                <label htmlFor="book-company-website">Company website</label>
                <input
                  id="book-company-website"
                  name="companyWebsite"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={companyWebsite}
                  onChange={(event) => setCompanyWebsite(event.target.value)}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-[length:var(--text-base)] font-semibold text-[var(--color-forest-deep)]">
                  {isEs ? "Tus datos para la llamada" : "Your details"}
                </h3>
                {selectedSlotIso && selectedDateKey ? (
                  <span className="num rounded-[var(--radius-pill)] bg-[var(--color-pale-sage)] px-3 py-1 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)]">
                    {formatDateHeading(selectedDateKey, locale, timeZone)} ·{" "}
                    {formatSlotTime(selectedSlotIso, locale, timeZone)}
                  </span>
                ) : null}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid min-w-0 gap-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-ink-2)]">
                  <span>{isEs ? "Tu nombre" : "Your name"}</span>
                  <input
                    type="text"
                    name="name"
                    autoComplete="name"
                    required
                    disabled={isSubmitting}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={isEs ? "Ej. Lucía Navarro" : "e.g. Elena Ruiz"}
                    className="min-h-[44px] w-full rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)]/70 px-3.5 text-[length:var(--text-md)] font-normal text-[var(--color-forest-deep)] focus:border-[var(--color-forest)] focus:bg-[var(--color-white)] focus:outline-none disabled:opacity-55"
                  />
                </label>

                <label className="grid min-w-0 gap-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-ink-2)]">
                  <span>{isEs ? "Correo electrónico" : "Work email"}</span>
                  <input
                    type="email"
                    name="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    disabled={isSubmitting}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="name@company.com"
                    className="min-h-[44px] w-full rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)]/70 px-3.5 text-[length:var(--text-md)] font-normal text-[var(--color-forest-deep)] focus:border-[var(--color-forest)] focus:bg-[var(--color-white)] focus:outline-none disabled:opacity-55"
                  />
                </label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid min-w-0 gap-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-ink-2)]">
                  <span>
                    {isEs
                      ? "Empresa o marca (opcional)"
                      : "Company or brand (optional)"}
                  </span>
                  <input
                    type="text"
                    name="company"
                    autoComplete="organization"
                    disabled={isSubmitting}
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    className="min-h-[44px] w-full rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)]/70 px-3.5 text-[length:var(--text-md)] font-normal text-[var(--color-forest-deep)] focus:border-[var(--color-forest)] focus:bg-[var(--color-white)] focus:outline-none disabled:opacity-55"
                  />
                </label>

                <label className="grid min-w-0 gap-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-ink-2)]">
                  <span>
                    {isEs ? "Idioma de la llamada" : "Preferred call language"}
                  </span>
                  <select
                    name="callLanguage"
                    disabled={isSubmitting}
                    value={callLanguage}
                    onChange={(event) =>
                      setCallLanguageOverride(
                        event.target.value as CallLanguage,
                      )
                    }
                    className="min-h-[44px] w-full min-w-0 rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)]/70 px-3.5 text-[length:var(--text-md)] font-normal text-[var(--color-forest-deep)] focus:border-[var(--color-forest)] focus:bg-[var(--color-white)] focus:outline-none disabled:opacity-55"
                  >
                    <option value="en">
                      {isEs ? "Inglés (English)" : "English"}
                    </option>
                    <option value="es">
                      {isEs ? "Español" : "Spanish (Español)"}
                    </option>
                    <option value="pt">
                      {isEs
                        ? "Portugués (Português)"
                        : "Portuguese (Português)"}
                    </option>
                  </select>
                </label>
              </div>

              <label className="grid min-w-0 gap-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-ink-2)]">
                <span>
                  {isEs
                    ? "Sobre qué pieza te gustaría hablar (opcional)"
                    : "What would you like to talk through? (optional)"}
                </span>
                <textarea
                  name="notes"
                  rows={3}
                  maxLength={1500}
                  disabled={isSubmitting}
                  value={notes}
                  onChange={(event) => setNotes(event.target.value)}
                  placeholder={
                    isEs
                      ? "Producto, materiales, cantidades aproximadas o plazos."
                      : "Product category, materials, rough quantity, or target launch."
                  }
                  className="w-full rounded-xl border border-[var(--color-rule)] bg-[var(--color-paper)]/70 p-3.5 text-[length:var(--text-md)] font-normal text-[var(--color-forest-deep)] focus:border-[var(--color-forest)] focus:bg-[var(--color-white)] focus:outline-none disabled:opacity-55"
                />
              </label>

              {effectiveTurnstileSiteKey ? (
                <TurnstileField
                  siteKey={effectiveTurnstileSiteKey}
                  language={language}
                  resetSignal={turnstileResetSignal}
                  theme="light"
                  onTokenChange={setTurnstileToken}
                />
              ) : null}

              {submitError ? (
                <p
                  role="alert"
                  className="text-[length:var(--text-sm)] font-medium text-[var(--color-clay-ink)]"
                >
                  {submitError}
                </p>
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <p className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                  {isEs
                    ? "Antelación mínima de 12 horas. Tratamos tus datos conforme a nuestra "
                    : "12-hour minimum notice. Handled under our "}
                  <Link
                    href={localizeHref("/privacy-policy")}
                    className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  >
                    {isEs ? "Política de privacidad" : "Privacy policy"}
                  </Link>
                  .
                </p>

                <button
                  type="submit"
                  disabled={isSubmitting || !selectedSlotIso}
                  className="inline-flex min-h-[46px] w-full cursor-pointer items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-6 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] transition-colors hover:bg-[var(--color-forest)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                >
                  {isSubmitting
                    ? isEs
                      ? "Confirmando..."
                      : "Confirming..."
                    : isEs
                      ? "Confirmar videollamada"
                      : "Confirm video call"}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
