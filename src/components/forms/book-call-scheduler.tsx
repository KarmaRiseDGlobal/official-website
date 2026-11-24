"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  buildMonthGrid,
  CURATED_TIMEZONES,
  formatDateHeading,
  formatMonthTitle,
  formatSlotTime,
  getMonthKey,
  shiftMonthKey,
  WHATSAPP_BOOK_CALL_HREF as WHATSAPP_HREF,
  type BookingApiResponse,
  type BookingResult,
  type SlotsApiResponse,
} from "@/components/forms/book-call-calendar-utils";
import {
  BookCallConfirmedCard,
  BookCallEditorialSidebar,
} from "@/components/forms/book-call-sidebar";
import { TurnstileField } from "@/components/forms/turnstile-field";
import { useLanguage } from "@/context/language-context";
import type { CallDuration, CallLanguage } from "@/lib/cal";
import { readClientHandoff, saveClientHandoff } from "@/lib/client-handoff";
import { isValidEmail } from "@/lib/validation";

const BUILD_TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

export function BookCallScheduler() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";
  const locale = isEs ? "es-ES" : "en-GB";

  const cardTopRef = useRef<HTMLDivElement | null>(null);
  const slotsPanelRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);

  const [step, setStep] = useState<1 | 2>(1);
  const [duration, setDuration] = useState<CallDuration>("15");
  const [timeZone, setTimeZone] = useState<string>("Europe/Madrid");
  const [timeZoneReady, setTimeZoneReady] = useState<boolean>(false);
  const [showTimeZonePicker, setShowTimeZonePicker] = useState<boolean>(false);
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
  const [showOptionalDetails, setShowOptionalDetails] =
    useState<boolean>(false);
  const [prefilledFromSession, setPrefilledFromSession] =
    useState<boolean>(false);
  const [companyWebsite, setCompanyWebsite] = useState<string>("");

  const [runtimeTurnstileSiteKey, setRuntimeTurnstileSiteKey] =
    useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] =
    useState<BookingResult | null>(null);

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) {
        return;
      }

      // Check optional ?duration=15 or ?duration=30 query parameter.
      try {
        const params = new URLSearchParams(window.location.search);
        const requestedDuration = params.get("duration");
        if (requestedDuration === "15" || requestedDuration === "30") {
          setDuration(requestedDuration);
        }
      } catch {
        // Ignore URL parsing errors.
      }

      // Hydrate non-sensitive contact details from shared session handoff.
      const handoff = readClientHandoff();
      if (handoff.name || handoff.email || handoff.company) {
        if (handoff.name) setName(handoff.name);
        if (handoff.email) setEmail(handoff.email);
        if (handoff.company) {
          setCompany(handoff.company);
          setShowOptionalDetails(true);
        }
        if (handoff.preferredLanguage) {
          setCallLanguageOverride(handoff.preferredLanguage);
        }
        setPrefilledFromSession(true);
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

  function handleSelectSlot(slotIso: string) {
    setSelectedSlotIso(slotIso);
    setSubmitError("");
    setStep(2);
    cardTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedCompany = company.trim();

    if (!selectedSlotIso) {
      setStep(1);
      setSubmitError(
        isEs
          ? "Elige primero un día y una hora disponibles."
          : "Pick an open date and time first.",
      );
      return;
    }

    const nextErrors: { name?: string; email?: string } = {};
    if (!trimmedName) {
      nextErrors.name = isEs
        ? "Introduce tu nombre para confirmar la reserva."
        : "Enter your name to confirm your booking.";
    }
    if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = isEs
        ? "Introduce un correo electrónico válido para recibir la invitación."
        : "Enter a valid email address so we can send your calendar invite.";
    }
    if (nextErrors.name || nextErrors.email) {
      setFieldErrors(nextErrors);
      setSubmitError(
        isEs
          ? "Revisa los campos marcados antes de confirmar la videollamada."
          : "Check the highlighted fields before confirming your video call.",
      );
      if (nextErrors.name) {
        nameInputRef.current?.focus();
      } else if (nextErrors.email) {
        emailInputRef.current?.focus();
      }
      return;
    }

    setFieldErrors({});

    if (effectiveTurnstileSiteKey && !turnstileToken) {
      setSubmitError(
        isEs
          ? "Completa la verificación de seguridad antes de confirmar."
          : "Please complete the security check before confirming.",
      );
      return;
    }

    // Store in shared session handoff so switching to Product Brief pre-fills details.
    saveClientHandoff({
      name: trimmedName,
      email: trimmedEmail,
      company: trimmedCompany,
      preferredLanguage: callLanguage,
    });

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
          company: trimmedCompany,
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
          setStep(1);
          void loadSlots(monthKey, duration, timeZone);
        }
        return;
      }

      setConfirmedBooking(payload.booking);
      setNotes("");
      cardTopRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
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
    setStep(1);
    void loadSlots(monthKey, duration, timeZone);
  }

  return (
    <div className="grid items-start gap-[var(--gap-columns)] xl:grid-cols-12">
      {/* Editorial column: second on mobile/tablet so calendar is above the fold; sticky left column on desktop */}
      <BookCallEditorialSidebar
        language={language}
        isEs={isEs}
        localizeHref={localizeHref}
      />

      {/* Interactive 2-step scheduler card: first on mobile/tablet; right column on desktop */}
      <div
        ref={cardTopRef}
        className="order-1 min-w-0 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-white)] p-4 shadow-[var(--shadow-card)] sm:p-6 md:p-8 xl:order-2 xl:col-span-8"
      >
        {/* Compact mobile/tablet host strip so visitors immediately see who they are booking with */}
        <div className="mb-4 flex items-center gap-3 border-b border-[var(--color-rule)] pb-3.5 xl:hidden">
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border border-[var(--color-rule-2)]/50">
            <Image
              src="/images/founders/alma-spain-hillside-portrait.jpeg"
              alt="Alma"
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="m-0 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
              {isEs
                ? "Videollamada gratis con Alma"
                : "Free video call with Alma"}
            </p>
            <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-muted)]">
              {isEs
                ? "Google Meet · Español, inglés o portugués"
                : "Google Meet · English, Spanish, or Portuguese"}
            </p>
          </div>
        </div>
        {confirmedBooking ? (
          <BookCallConfirmedCard
            confirmedBooking={confirmedBooking}
            isEs={isEs}
            locale={locale}
            localizeHref={localizeHref}
            onReset={handleResetForAnotherCall}
          />
        ) : (
          <div className="grid gap-6">
            {/* Step header */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-rule)] pb-4">
              <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitError("");
                      setStep(1);
                    }}
                    aria-current={step === 1 ? "step" : undefined}
                    className={`inline-flex min-h-[var(--tap-min)] cursor-pointer items-center gap-2 rounded-[var(--radius-pill)] border px-3.5 py-1 text-[length:var(--text-xs)] font-semibold transition-colors ${
                      step === 1
                        ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                        : "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-forest-deep)] hover:border-[var(--color-forest)]"
                    }`}
                  >
                    <span className="num">1</span>
                    <span>{isEs ? "Elige día y hora" : "Choose a time"}</span>
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    disabled={!selectedSlotIso}
                    onClick={() => {
                      if (selectedSlotIso) {
                        setStep(2);
                      }
                    }}
                    aria-current={step === 2 ? "step" : undefined}
                    className={`inline-flex min-h-[var(--tap-min)] items-center gap-2 rounded-[var(--radius-pill)] border px-3.5 py-1 text-[length:var(--text-xs)] font-semibold transition-colors ${
                      step === 2
                        ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                        : selectedSlotIso
                          ? "cursor-pointer border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-forest-deep)] hover:border-[var(--color-forest)]"
                          : "cursor-default border-[var(--color-rule)]/70 bg-transparent text-[var(--color-muted)]/65"
                    }`}
                  >
                    <span className="num">2</span>
                    <span>{isEs ? "Tus datos" : "Your details"}</span>
                  </button>
                </li>
              </ol>

              <span className="num text-[length:var(--text-xs)] font-medium text-[var(--color-muted)]">
                {step} / 2
              </span>
            </div>

            {step === 1 ? (
              <div className="grid gap-6">
                {/* Duration switcher right at top of scheduler */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div
                    role="group"
                    aria-label={isEs ? "Duración de la llamada" : "Call length"}
                    className="grid w-full grid-cols-2 gap-2 sm:inline-grid sm:w-auto"
                  >
                    {(
                      [
                        {
                          id: "15" as const,
                          title: "15 min",
                          subtitle: isEs ? "Consulta rápida" : "Quick intro",
                        },
                        {
                          id: "30" as const,
                          title: "30 min",
                          subtitle: isEs ? "Briefing" : "Product Brief",
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
                            if (duration === option.id) return;
                            setIsLoadingSlots(true);
                            setSlotsError("");
                            setDuration(option.id);
                            setSelectedSlotIso("");
                            setConfirmedBooking(null);
                          }}
                          className={`flex min-h-[var(--tap-min)] cursor-pointer items-center justify-center gap-2 rounded-[var(--radius-pill)] border px-4 py-2 text-[length:var(--text-xs)] transition-colors ${
                            active
                              ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                              : "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-forest-deep)] hover:border-[var(--color-forest)]"
                          }`}
                        >
                          <span className="num font-semibold">
                            {option.title}
                          </span>
                          <span
                            className={
                              active
                                ? "text-[var(--color-paper-2)]"
                                : "text-[var(--color-muted)]"
                            }
                          >
                            · {option.subtitle}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Quiet detected timezone label with optional Change toggle */}
                  <div className="flex flex-wrap items-center gap-2 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    <span>
                      {isEs ? "Hora local:" : "Times in"}{" "}
                      <strong className="font-semibold text-[var(--color-forest-deep)]">
                        {timeZone.replaceAll("_", " ")}
                      </strong>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowTimeZonePicker((prev) => !prev)}
                      className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-1 font-semibold text-[var(--color-clay-ink)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                    >
                      {showTimeZonePicker
                        ? isEs
                          ? "Cerrar"
                          : "Done"
                        : isEs
                          ? "Cambiar"
                          : "Change"}
                    </button>
                  </div>
                </div>

                {showTimeZonePicker ? (
                  <label className="grid gap-1.5 rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper)]/65 p-3 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    <span className="font-semibold text-[var(--color-forest-deep)]">
                      {isEs
                        ? "Selecciona tu zona horaria"
                        : "Select your timezone"}
                    </span>
                    <select
                      aria-label={isEs ? "Tu zona horaria" : "Your timezone"}
                      value={timeZone}
                      onChange={(event) => {
                        setIsLoadingSlots(true);
                        setSlotsError("");
                        setTimeZone(event.target.value);
                        setSelectedSlotIso("");
                        setShowTimeZonePicker(false);
                      }}
                      className="min-h-[var(--tap-min)] w-full rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-white)] px-3 py-2 text-[length:var(--text-sm)] font-medium text-[var(--color-forest-deep)] focus:border-[var(--color-forest)] focus:outline-none"
                    >
                      {timeZoneOptions.map((tz) => (
                        <option key={tz} value={tz}>
                          {tz.replaceAll("_", " ")}
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}

                {slotsError ? (
                  <div
                    role="alert"
                    className="grid gap-3 rounded-[var(--radius-input)] border border-[var(--color-clay)]/40 bg-[var(--color-paper)] p-5 text-[length:var(--text-sm)] text-[var(--color-ink-2)]"
                  >
                    <p>{slotsError}</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          void loadSlots(monthKey, duration, timeZone)
                        }
                        className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-4 py-2 text-[length:var(--text-xs)] font-semibold text-[var(--color-paper)]"
                      >
                        {isEs ? "Reintentar" : "Try again"}
                      </button>
                      <a
                        href={WHATSAPP_HREF[language]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[var(--tap-min)] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-rule-2)] px-4 py-2 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)] no-underline"
                      >
                        {isEs ? "Escribir por WhatsApp" : "Message on WhatsApp"}
                      </a>
                    </div>
                  </div>
                ) : null}

                {/* Month switcher + Calendar + Time slots grid */}
                <div className="grid gap-6 md:grid-cols-12">
                  <div className="grid min-w-0 gap-3 md:col-span-7">
                    <div className="flex items-center justify-between gap-2 pb-1">
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
                      <h2 className="min-w-0 text-center text-[length:var(--text-lg)] font-normal text-[var(--color-forest-deep)]">
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
                          return (
                            <span key={`empty-${index}`} className="h-11" />
                          );
                        }
                        const slotsForDay = slotsByDate[cell.dateKey] ?? [];
                        const hasSlots = slotsForDay.length > 0;
                        const isSelected = cell.dateKey === selectedDateKey;
                        const readableDate = formatDateHeading(
                          cell.dateKey,
                          locale,
                          timeZone,
                        );
                        const dayAriaLabel = hasSlots
                          ? isEs
                            ? `${readableDate}, ${slotsForDay.length} horas disponibles`
                            : `${readableDate}, ${slotsForDay.length} open times`
                          : isEs
                            ? `${readableDate}, sin horas disponibles`
                            : `${readableDate}, unavailable`;

                        return (
                          <button
                            key={cell.dateKey}
                            type="button"
                            disabled={isLoadingSlots || !hasSlots}
                            aria-pressed={isSelected}
                            aria-label={dayAriaLabel}
                            onClick={() => {
                              setSelectedDateKey(cell.dateKey);
                              setSelectedSlotIso("");
                              setSubmitError("");
                              if (
                                typeof window !== "undefined" &&
                                window.innerWidth < 768
                              ) {
                                requestAnimationFrame(() => {
                                  slotsPanelRef.current?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "nearest",
                                  });
                                });
                              }
                            }}
                            className={`num relative flex h-11 min-h-[var(--tap-min)] cursor-pointer items-center justify-center rounded-[var(--radius-input)] text-[length:var(--text-sm)] transition-colors ${
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

                    {!isLoadingSlots &&
                    !slotsError &&
                    availableDayCount === 0 ? (
                      <p className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                        {isEs
                          ? "No quedan huecos libres este mes. Prueba con el mes siguiente o escríbenos por WhatsApp."
                          : "No open slots remain this month. Check the next month or message us on WhatsApp."}
                      </p>
                    ) : null}
                  </div>

                  <div
                    ref={slotsPanelRef}
                    className="grid min-w-0 content-start gap-3 border-t border-[var(--color-rule)] pt-5 md:col-span-5 md:border-t-0 md:border-l md:pt-0 md:pl-6"
                  >
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
                      <div className="grid max-h-72 grid-cols-2 gap-2 overflow-y-auto pr-1">
                        {daySlots.map((slotIso) => {
                          const active = slotIso === selectedSlotIso;
                          return (
                            <button
                              key={slotIso}
                              type="button"
                              aria-pressed={active}
                              onClick={() => handleSelectSlot(slotIso)}
                              className={`num inline-flex min-h-[var(--tap-min)] cursor-pointer items-center justify-center rounded-[var(--radius-input)] border px-3 py-2.5 text-[length:var(--text-sm)] font-medium transition-colors ${
                                active
                                  ? "border-[var(--color-clay-ink)] bg-[var(--color-clay-ink)] text-[var(--color-paper)]"
                                  : "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-forest-deep)] hover:border-[var(--color-forest)] hover:bg-[var(--color-pale-sage)]/45"
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

                    <p className="pt-1 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                      {isEs
                        ? "Toca una hora libre y confirma tu hueco con solo dos datos."
                        : "Pick any open time to confirm your seat in two quick fields."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Step 2: Confirm attendee details */
              <form
                aria-label={
                  isEs
                    ? "Confirmar datos de la videollamada"
                    : "Confirm video call details"
                }
                onSubmit={handleSubmit}
                noValidate
                className="grid gap-5"
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

                {/* Selected slot summary strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper)] px-4 py-3">
                  <div className="grid gap-0.5">
                    <span className="num text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
                      {selectedDateKey
                        ? formatDateHeading(selectedDateKey, locale, timeZone)
                        : ""}{" "}
                      ·{" "}
                      {selectedSlotIso
                        ? formatSlotTime(selectedSlotIso, locale, timeZone)
                        : ""}
                    </span>
                    <span className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                      {duration} min · Google Meet ·{" "}
                      {timeZone.replaceAll("_", " ")}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={() => {
                      setSubmitError("");
                      setStep(1);
                    }}
                    className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-2 text-[length:var(--text-xs)] font-semibold text-[var(--color-clay-ink)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  >
                    {isEs ? "← Cambiar hora" : "← Change time"}
                  </button>
                </div>

                {prefilledFromSession ? (
                  <p className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    {isEs
                      ? "Hemos prellenado tus datos de esta visita. Revísalos antes de confirmar."
                      : "We filled in your details from earlier in your visit. Confirm or edit below."}
                  </p>
                ) : null}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid min-w-0 content-start gap-1.5">
                    <label
                      htmlFor="book-name"
                      className="text-[length:var(--text-xs)] font-semibold text-[var(--color-ink-2)]"
                    >
                      {isEs ? "Tu nombre" : "Your name"}
                    </label>
                    <input
                      ref={nameInputRef}
                      id="book-name"
                      type="text"
                      name="name"
                      autoComplete="name"
                      required
                      aria-invalid={Boolean(fieldErrors.name) || undefined}
                      aria-describedby={
                        fieldErrors.name ? "book-name-error" : undefined
                      }
                      disabled={isSubmitting}
                      value={name}
                      onChange={(event) => {
                        setName(event.target.value);
                        if (fieldErrors.name) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            name: undefined,
                          }));
                        }
                      }}
                      placeholder={
                        isEs ? "Ej. Lucía Navarro" : "e.g. Elena Ruiz"
                      }
                      className="min-h-[var(--tap-min)] w-full rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper)]/70 px-3.5 text-[length:var(--text-md)] font-normal text-[var(--color-forest-deep)] focus:border-[var(--color-forest)] focus:bg-[var(--color-white)] focus:outline-none disabled:opacity-55"
                    />
                    {fieldErrors.name ? (
                      <p
                        id="book-name-error"
                        role="alert"
                        className="m-0 text-[length:var(--text-xs)] font-medium text-[var(--color-clay-ink)]"
                      >
                        {fieldErrors.name}
                      </p>
                    ) : null}
                  </div>

                  <div className="grid min-w-0 content-start gap-1.5">
                    <label
                      htmlFor="book-email"
                      className="text-[length:var(--text-xs)] font-semibold text-[var(--color-ink-2)]"
                    >
                      {isEs ? "Correo electrónico" : "Email"}
                    </label>
                    <input
                      ref={emailInputRef}
                      id="book-email"
                      type="email"
                      name="email"
                      inputMode="email"
                      autoComplete="email"
                      required
                      aria-invalid={Boolean(fieldErrors.email) || undefined}
                      aria-describedby={
                        fieldErrors.email ? "book-email-error" : undefined
                      }
                      disabled={isSubmitting}
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value);
                        if (fieldErrors.email) {
                          setFieldErrors((prev) => ({
                            ...prev,
                            email: undefined,
                          }));
                        }
                      }}
                      placeholder={isEs ? "tu@correo.com" : "you@example.com"}
                      className="min-h-[var(--tap-min)] w-full rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper)]/70 px-3.5 text-[length:var(--text-md)] font-normal text-[var(--color-forest-deep)] focus:border-[var(--color-forest)] focus:bg-[var(--color-white)] focus:outline-none disabled:opacity-55"
                    />
                    {fieldErrors.email ? (
                      <p
                        id="book-email-error"
                        role="alert"
                        className="m-0 text-[length:var(--text-xs)] font-medium text-[var(--color-clay-ink)]"
                      >
                        {fieldErrors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Call language pills */}
                <fieldset className="m-0 grid gap-2 border-0 p-0">
                  <legend className="mb-1 text-[length:var(--text-xs)] font-semibold text-[var(--color-ink-2)]">
                    {isEs ? "Idioma de la llamada" : "Call language"}
                  </legend>
                  <div className="flex flex-wrap gap-2">
                    {(
                      [
                        { id: "es" as const, label: "Español" },
                        { id: "en" as const, label: "English" },
                        { id: "pt" as const, label: "Português" },
                      ] as const
                    ).map((langOpt) => {
                      const active = callLanguage === langOpt.id;
                      return (
                        <button
                          key={langOpt.id}
                          type="button"
                          aria-pressed={active}
                          disabled={isSubmitting}
                          onClick={() => setCallLanguageOverride(langOpt.id)}
                          className={`inline-flex min-h-[var(--tap-min)] cursor-pointer items-center rounded-[var(--radius-pill)] border px-4 py-1.5 text-[length:var(--text-xs)] font-semibold transition-colors ${
                            active
                              ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                              : "border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-forest-deep)] hover:border-[var(--color-forest)]"
                          }`}
                        >
                          {langOpt.label}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>

                {/* Collapsible optional company & notes */}
                <div className="grid gap-3">
                  <button
                    type="button"
                    aria-expanded={showOptionalDetails}
                    onClick={() => setShowOptionalDetails((prev) => !prev)}
                    className="inline-flex min-h-[var(--tap-min)] w-fit cursor-pointer items-center gap-1.5 bg-transparent text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  >
                    <span>
                      {showOptionalDetails
                        ? isEs
                          ? "− Ocultar empresa y notas"
                          : "− Hide company and notes"
                        : isEs
                          ? "+ Añadir empresa o un breve comentario (opcional)"
                          : "+ Add company or a quick note (optional)"}
                    </span>
                  </button>

                  {showOptionalDetails ? (
                    <div className="grid gap-4 rounded-[var(--radius-input)] border border-[var(--color-rule)]/80 bg-[var(--color-paper)]/45 p-4">
                      <label className="grid min-w-0 gap-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-ink-2)]">
                        <span>
                          {isEs
                            ? "Empresa, tienda o marca (opcional)"
                            : "Company, shop, or brand (optional)"}
                        </span>
                        <input
                          type="text"
                          name="company"
                          autoComplete="organization"
                          disabled={isSubmitting}
                          value={company}
                          onChange={(event) => setCompany(event.target.value)}
                          className="min-h-[var(--tap-min)] w-full rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-white)] px-3.5 text-[length:var(--text-md)] font-normal text-[var(--color-forest-deep)] focus:border-[var(--color-forest)] focus:outline-none disabled:opacity-55"
                        />
                      </label>

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
                          className="w-full rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-white)] p-3.5 text-[length:var(--text-md)] font-normal text-[var(--color-forest-deep)] focus:border-[var(--color-forest)] focus:outline-none disabled:opacity-55"
                        />
                      </label>
                    </div>
                  ) : null}
                </div>

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

                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-rule)] pt-4">
                  <p className="max-w-[44ch] text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    {isEs
                      ? "Videollamada gratuita por Google Meet, sin compromiso. Alma envía notas por escrito al terminar (con 12 horas de antelación). "
                      : "Free Google Meet call, no obligation. Alma sends written notes straight after (12-hour advance booking notice). "}
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
                    disabled={isSubmitting}
                    className="inline-flex min-h-[var(--control-height)] w-full cursor-pointer items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-6 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] transition-colors hover:bg-[var(--color-forest)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                  >
                    {isSubmitting
                      ? isEs
                        ? "Confirmando..."
                        : "Confirming..."
                      : isEs
                        ? "Confirmar mi llamada gratis"
                        : "Confirm my free video call"}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
