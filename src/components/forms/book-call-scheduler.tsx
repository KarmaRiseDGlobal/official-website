"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  buildMonthGrid,
  CURATED_TIMEZONES,
  formatDateHeading,
  formatMonthTitle,
  formatShortDatePill,
  formatSlotTime,
  getMonthKey,
  getSlotHour,
  shiftMonthKey,
  WHATSAPP_BOOK_CALL_HREF as WHATSAPP_HREF,
  type BookingApiResponse,
  type BookingResult,
  type SlotsApiResponse,
} from "@/components/forms/book-call-calendar-utils";
import {
  BookCallCompanion,
  BookCallConfirmedCard,
} from "@/components/forms/book-call-sidebar";
import { TurnstileField } from "@/components/forms/turnstile-field";
import { useLanguage } from "@/context/language-context";
import { BOOK_CALL_OPTIONS } from "@/data/conversion-content";
import type { CallDuration, CallLanguage } from "@/lib/cal";
import {
  buildFormAttributionPayload,
  PRODUCT_CATEGORY_LABELS,
  readClientHandoff,
  resolveProductSlugFromQueryParam,
  saveClientHandoff,
  scrollElementIntoViewSafe,
  type ProductCategorySlug,
} from "@/lib/client-handoff";
import { isValidEmail } from "@/lib/validation";

const BUILD_TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

const ALMA_MEETING_PORTRAIT = "/images/founders/alma-swing-laughing.jpeg";

const REFERRAL_SUGGESTIONS = {
  en: [
    "LinkedIn",
    "Instagram",
    "Podcast",
    "Newsletter",
    "Word of mouth",
    "Web search",
  ],
  es: [
    "LinkedIn",
    "Instagram",
    "Pódcast",
    "Boletín de Historias",
    "Recomendación personal",
    "Buscador",
  ],
} as const;

function BookCallQuerySync({
  onQuerySync,
}: {
  onQuerySync: (query: {
    duration: CallDuration | null;
    productSlug: ProductCategorySlug | null;
  }) => void;
}) {
  const searchParams = useSearchParams();
  const rawDuration = searchParams.get("duration");
  const rawProduct =
    searchParams.get("product") ?? searchParams.get("category");

  useEffect(() => {
    const parsedDuration: CallDuration | null =
      rawDuration === "15" || rawDuration === "30" ? rawDuration : null;
    const parsedProduct = resolveProductSlugFromQueryParam(rawProduct);
    onQuerySync({ duration: parsedDuration, productSlug: parsedProduct });
  }, [rawDuration, rawProduct, onQuerySync]);

  return null;
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="13"
      height="13"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.2 8.4 6.5 11.7 13 4.8" />
    </svg>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {direction === "left" ? (
        <path d="M10 3.5 5.5 8l4.5 4.5" />
      ) : (
        <path d="M6 3.5 10.5 8 6 12.5" />
      )}
    </svg>
  );
}

export function BookCallScheduler() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";
  const locale = isEs ? "es-ES" : "en-GB";

  const cardTopRef = useRef<HTMLDivElement | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const confirmedHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const slotsPanelRef = useRef<HTMLDivElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const userChangedMonthRef = useRef(false);
  const appliedAutoPrefixRef = useRef<string>("");
  const turnstileTokenRef = useRef<string>("");
  const turnstileFailedRef = useRef<boolean>(false);

  const [step, setStep] = useState<1 | 2>(1);
  const [duration, setDuration] = useState<CallDuration>("15");
  const [timeZone, setTimeZone] = useState<string>("Europe/Madrid");
  const [timeZoneReady, setTimeZoneReady] = useState<boolean>(false);
  const [detectedTimeZone, setDetectedTimeZone] = useState<string>("");
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
  const [upcomingQuickDates, setUpcomingQuickDates] = useState<
    Array<{ dateKey: string; monthKey: string; slots: string[] }>
  >([]);
  const [slotPeriod, setSlotPeriod] = useState<"morning" | "afternoon">(
    "morning",
  );
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
  const [referralSource, setReferralSource] = useState<string>("");
  const [productSlug, setProductSlug] = useState<ProductCategorySlug | null>(
    null,
  );
  const [companyWebsite, setCompanyWebsite] = useState<string>("");

  const [runtimeTurnstileSiteKey, setRuntimeTurnstileSiteKey] =
    useState<string>("");
  const [turnstileToken, setTurnstileToken] = useState<string>("");
  const [turnstileFailed, setTurnstileFailed] = useState<boolean>(false);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState<number>(0);

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
  }>({});
  const [submitError, setSubmitError] = useState<string>("");
  const [confirmedBooking, setConfirmedBooking] =
    useState<BookingResult | null>(null);

  const handleTurnstileTokenChange = useCallback((token: string) => {
    turnstileTokenRef.current = token;
    setTurnstileToken(token);
  }, []);

  const handleTurnstileError = useCallback((failed: boolean) => {
    turnstileFailedRef.current = failed;
    setTurnstileFailed(failed);
  }, []);

  async function waitForTurnstileToken(timeoutMs = 2000): Promise<string> {
    if (turnstileTokenRef.current || turnstileFailedRef.current) {
      return turnstileTokenRef.current;
    }
    const maxAttempts = Math.max(1, Math.ceil(timeoutMs / 120));
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      if (turnstileTokenRef.current || turnstileFailedRef.current) {
        return turnstileTokenRef.current;
      }
    }
    return turnstileTokenRef.current;
  }

  const handleQuerySync = useCallback(
    ({
      duration: nextDuration,
      productSlug: nextProduct,
    }: {
      duration: CallDuration | null;
      productSlug: ProductCategorySlug | null;
    }) => {
      if (nextDuration) {
        setDuration((current) => {
          if (current !== nextDuration) {
            setSelectedSlotIso("");
          }
          return nextDuration;
        });
      }
      if (nextProduct) {
        const categoryLabel = PRODUCT_CATEGORY_LABELS[nextProduct][language];
        const notePrefix = isEs
          ? `Categoría de interés: ${categoryLabel}`
          : `Product focus: ${categoryLabel}`;
        setProductSlug(nextProduct);
        setNotes((current) => {
          const trimmed = current.trim();
          if (!trimmed || trimmed === appliedAutoPrefixRef.current) {
            appliedAutoPrefixRef.current = notePrefix;
            return notePrefix;
          }
          return current;
        });
      }
    },
    [isEs, language],
  );

  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;

      const handoff = readClientHandoff();
      if (handoff.name || handoff.email || handoff.company) {
        if (handoff.name) setName(handoff.name);
        if (handoff.email) setEmail(handoff.email);
        if (handoff.company) setCompany(handoff.company);
        if (handoff.preferredLanguage) {
          setCallLanguageOverride(handoff.preferredLanguage);
        }
      }

      try {
        const detected = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const now = new Date();
        setCurrentMonthKey(getMonthKey(now.getFullYear(), now.getMonth()));
        if (detected) {
          setDetectedTimeZone(detected);
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

  const requestMonthSlots = useCallback(
    async (
      targetMonth: string,
      targetDuration: CallDuration,
      targetZone: string,
      signal?: AbortSignal,
    ): Promise<{ ok: boolean; payload: SlotsApiResponse }> => {
      const params = new URLSearchParams({
        language,
        duration: targetDuration,
        month: targetMonth,
        timeZone: targetZone,
      });
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
      return { ok: response.ok && Boolean(payload.ok), payload };
    },
    [language],
  );

  const fetchAndApplySlots = useCallback(
    async (
      targetMonth: string,
      targetDuration: CallDuration,
      targetZone: string,
      signal?: AbortSignal,
    ) => {
      try {
        const primary = await requestMonthSlots(
          targetMonth,
          targetDuration,
          targetZone,
          signal,
        );

        if (!primary.ok) {
          setSlotsByDate({});
          setUpcomingQuickDates([]);
          setSelectedDateKey("");
          setSelectedSlotIso("");
          setSlotsError(
            primary.payload.error ||
              (isEs
                ? "No pudimos cargar los horarios ahora mismo."
                : "Unable to load open times right now."),
          );
          return;
        }

        if (primary.payload.turnstileSiteKey) {
          setRuntimeTurnstileSiteKey(primary.payload.turnstileSiteKey);
        }

        const primarySlots = primary.payload.slotsByDate ?? {};
        const primaryDays = Object.keys(primarySlots).sort();

        let combinedQuick: Array<{
          dateKey: string;
          monthKey: string;
          slots: string[];
        }> = primaryDays.map((dateKey) => ({
          dateKey,
          monthKey: targetMonth,
          slots: primarySlots[dateKey] ?? [],
        }));

        if (
          targetMonth === currentMonthKey &&
          primaryDays.length < 4 &&
          !signal?.aborted
        ) {
          const nextMonth = shiftMonthKey(targetMonth, 1);
          const secondary = await requestMonthSlots(
            nextMonth,
            targetDuration,
            targetZone,
            signal,
          ).catch(() => null);

          if (secondary?.ok) {
            const nextSlots = secondary.payload.slotsByDate ?? {};
            const seenDates = new Set(primaryDays);
            const nextDays = Object.keys(nextSlots)
              .filter((dateKey) => !seenDates.has(dateKey))
              .sort();
            combinedQuick = [
              ...combinedQuick,
              ...nextDays.map((dateKey) => ({
                dateKey,
                monthKey: nextMonth,
                slots: nextSlots[dateKey] ?? [],
              })),
            ].sort((a, b) => a.dateKey.localeCompare(b.dateKey));

            if (
              primaryDays.length === 0 &&
              !userChangedMonthRef.current &&
              nextDays.length > 0
            ) {
              setMonthKey(nextMonth);
              setSlotsByDate(nextSlots);
              setUpcomingQuickDates(combinedQuick.slice(0, 4));
              setSelectedDateKey(nextDays[0] ?? "");
              setSelectedSlotIso("");
              return;
            }
          }
        }

        setSlotsByDate(primarySlots);
        if (targetMonth === currentMonthKey || combinedQuick.length > 0) {
          setUpcomingQuickDates(combinedQuick.slice(0, 4));
        }

        setSelectedDateKey((prev) => {
          if (prev && (primarySlots[prev]?.length ?? 0) > 0) {
            return prev;
          }
          return primaryDays[0] ?? "";
        });
        setSelectedSlotIso((prev) => {
          if (!prev) return "";
          const stillPresent = Object.values(primarySlots).some((list) =>
            list.includes(prev),
          );
          return stillPresent ? prev : "";
        });
      } catch (err) {
        if ((err as { name?: string })?.name === "AbortError") {
          return;
        }
        setSlotsByDate({});
        setUpcomingQuickDates([]);
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
    [currentMonthKey, isEs, requestMonthSlots],
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

  const { morningSlots, afternoonSlots } = useMemo(() => {
    const morning: string[] = [];
    const afternoon: string[] = [];
    for (const iso of daySlots) {
      if (getSlotHour(iso, timeZone) < 13) {
        morning.push(iso);
      } else {
        afternoon.push(iso);
      }
    }
    return { morningSlots: morning, afternoonSlots: afternoon };
  }, [daySlots, timeZone]);

  const effectivePeriod: "morning" | "afternoon" =
    morningSlots.length > 0 && afternoonSlots.length > 0
      ? slotPeriod
      : morningSlots.length > 0
        ? "morning"
        : "afternoon";

  const visibleSlots =
    morningSlots.length > 0 && afternoonSlots.length > 0
      ? effectivePeriod === "morning"
        ? morningSlots
        : afternoonSlots
      : daySlots;

  const availableDayCount = Object.keys(slotsByDate).length;
  const effectiveTurnstileSiteKey =
    runtimeTurnstileSiteKey || BUILD_TURNSTILE_SITE_KEY;

  const weekdayLabels = isEs
    ? ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"]
    : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  const canGoPrevMonth = monthKey > currentMonthKey;

  const liveScheduleAnnouncement = isLoadingSlots
    ? isEs
      ? "Consultando horarios libres con Alma..."
      : "Checking Alma's open times..."
    : selectedDateKey && daySlots.length > 0
      ? isEs
        ? `${formatDateHeading(selectedDateKey, locale)}: ${daySlots.length} horas libres.`
        : `${formatDateHeading(selectedDateKey, locale)}: ${daySlots.length} open times.`
      : "";

  function scrollCardToTop(
    focusTarget: "step" | "confirmed" | "none" = "none",
  ) {
    requestAnimationFrame(() => {
      scrollElementIntoViewSafe(cardTopRef.current, "start");
      if (focusTarget === "step") {
        stepHeadingRef.current?.focus({ preventScroll: true });
      } else if (focusTarget === "confirmed") {
        confirmedHeadingRef.current?.focus({ preventScroll: true });
      }
    });
  }

  function handleSelectQuickDate(entry: {
    dateKey: string;
    monthKey: string;
    slots: string[];
  }) {
    setSubmitError("");
    setSelectedSlotIso("");
    if (entry.monthKey !== monthKey) {
      userChangedMonthRef.current = true;
      setIsLoadingSlots(true);
      setSlotsError("");
      setMonthKey(entry.monthKey);
      setSelectedDateKey(entry.dateKey);
      return;
    }
    setSelectedDateKey(entry.dateKey);
  }

  function handleSelectSlot(slotIso: string) {
    setSelectedSlotIso(slotIso);
    setSubmitError("");
    setStep(2);
    scrollCardToTop("step");
  }

  function handleReturnToStep1() {
    setSubmitError("");
    setStep(1);
    scrollCardToTop("step");
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
      scrollCardToTop("step");
      return;
    }

    const nextErrors: { name?: string; email?: string } = {};
    if (!trimmedName) {
      nextErrors.name = isEs
        ? "Introduce tu nombre para confirmar la reserva."
        : "Enter your name to confirm your call.";
    }
    if (!isValidEmail(trimmedEmail)) {
      nextErrors.email = isEs
        ? "Introduce un correo electrónico válido (ej. lucia@tutienda.es)."
        : "Enter a valid email address (e.g. name@company.com).";
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

    let activeTurnstileToken = turnstileTokenRef.current || turnstileToken;
    if (effectiveTurnstileSiteKey && !activeTurnstileToken) {
      setIsSubmitting(true);
      activeTurnstileToken = await waitForTurnstileToken(2000);
      if (!activeTurnstileToken) {
        setIsSubmitting(false);
        setSubmitError(
          turnstileFailed || turnstileFailedRef.current
            ? isEs
              ? "No se pudo cargar la verificación de seguridad. Pulsa Reintentar o escribe a Alma por WhatsApp (+34 611 722 276) o a alma@karmarisedglobal.com."
              : "Security verification could not load. Retry the check, or message Alma on WhatsApp (+34 611 722 276) or alma@karmarisedglobal.com."
            : isEs
              ? "Completa la verificación de seguridad antes de confirmar."
              : "Complete the security check before confirming.",
        );
        return;
      }
    }

    saveClientHandoff({
      name: trimmedName,
      email: trimmedEmail,
      company: trimmedCompany,
      preferredLanguage: callLanguage,
    });

    const attributionPayload = buildFormAttributionPayload(referralSource);

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
          ...attributionPayload,
          companyWebsite,
          turnstileToken: activeTurnstileToken,
        }),
      });

      const payload = (await response
        .json()
        .catch(() => ({}))) as BookingApiResponse;
      if (!response.ok || !payload.ok || !payload.booking) {
        setSubmitError(
          payload.error ||
            (isEs
              ? "No se pudo completar la reserva. Inténtalo de nuevo o escribe a Alma por WhatsApp."
              : "Could not complete the booking. Try again or message Alma on WhatsApp."),
        );
        if (payload.code === "slot_unavailable" || response.status === 409) {
          setSelectedSlotIso("");
          setStep(1);
          scrollCardToTop("step");
          void loadSlots(monthKey, duration, timeZone);
        }
        return;
      }

      setConfirmedBooking(payload.booking);
      setNotes("");
      setReferralSource("");
      scrollCardToTop("confirmed");
    } catch {
      setSubmitError(
        isEs
          ? "No pudimos conectar con el servidor. Puedes escribirnos por WhatsApp."
          : "Unable to reach the server. Message Alma on WhatsApp instead.",
      );
    } finally {
      setIsSubmitting(false);
      if (didAttempt && effectiveTurnstileSiteKey) {
        handleTurnstileTokenChange("");
        setTurnstileResetSignal((value) => value + 1);
      }
    }
  }

  function handleResetForAnotherCall() {
    setConfirmedBooking(null);
    setSelectedSlotIso("");
    setSubmitError("");
    setStep(1);
    scrollCardToTop("step");
    void loadSlots(monthKey, duration, timeZone);
  }

  const stepMeta = [
    {
      num: 1 as const,
      shortLabel: isEs ? "Hora" : "Time",
      heading: isEs ? "Elige día y hora" : "Pick a day and time",
      subtitle: "",
    },
    {
      num: 2 as const,
      shortLabel: isEs ? "Datos" : "Details",
      heading: isEs
        ? "¿Dónde te envía Alma la invitación?"
        : "Where should Alma send your invite?",
      subtitle: isEs
        ? "Invitación de Google Calendar con enlace de Google Meet."
        : "Google Calendar invite with your Google Meet link.",
    },
  ] as const;

  const activeStepMeta = stepMeta[step - 1] ?? stepMeta[0];

  return (
    <div className="grid gap-[var(--space-3xl)]">
      <Suspense fallback={null}>
        <BookCallQuerySync onQuerySync={handleQuerySync} />
      </Suspense>

      {/* Centered, symmetrical single-screen booking workspace directly on Warm Dune */}
      <div
        ref={cardTopRef}
        data-scheduler-workspace
        className="mx-auto grid w-full max-w-[54rem] min-w-0 scroll-mt-0 gap-3"
      >
        <div role="status" aria-live="polite" className="sr-only">
          {confirmedBooking
            ? isEs
              ? "Videollamada confirmada con Alma."
              : "Video call confirmed with Alma."
            : liveScheduleAnnouncement}
        </div>

        {confirmedBooking ? (
          <BookCallConfirmedCard
            confirmedBooking={confirmedBooking}
            headingRef={confirmedHeadingRef}
            isEs={isEs}
            locale={locale}
            localizeHref={localizeHref}
            onReset={handleResetForAnotherCall}
          />
        ) : (
          <>
            {/* Single calm, symmetrical 2-column step tracker */}
            <div className="grid gap-2.5">
              <ol className="m-0 mx-auto grid w-full max-w-[20rem] list-none grid-cols-2 gap-3 p-0">
                {stepMeta.map((item) => {
                  const isCurrent = step === item.num;
                  const isComplete = step > item.num;
                  const canJump =
                    item.num === 1 ||
                    (item.num === 2 && Boolean(selectedSlotIso));

                  return (
                    <li key={item.num} className="min-w-0">
                      <button
                        type="button"
                        disabled={!canJump || isSubmitting}
                        onClick={() => {
                          if (item.num === 1) {
                            handleReturnToStep1();
                          } else if (selectedSlotIso) {
                            setStep(2);
                            scrollCardToTop("step");
                          }
                        }}
                        aria-current={isCurrent ? "step" : undefined}
                        className={`grid min-h-[var(--tap-min)] w-full content-end gap-2 bg-transparent pb-1 text-center transition-colors ${
                          canJump && !isSubmitting
                            ? "cursor-pointer"
                            : "cursor-default"
                        }`}
                      >
                        <span
                          className={`num text-[length:var(--text-xs)] font-semibold ${
                            isCurrent
                              ? "text-[var(--color-forest-deep)]"
                              : isComplete
                                ? "text-[var(--color-clay-ink)]"
                                : "text-[var(--color-muted)]"
                          }`}
                        >
                          {item.num}. {item.shortLabel}
                        </span>
                        <span
                          aria-hidden="true"
                          className={`block h-[2.5px] w-full rounded-[var(--radius-pill)] transition-colors ${
                            isCurrent || isComplete
                              ? "bg-[var(--color-forest-deep)]"
                              : "bg-[var(--color-forest-deep)]/16"
                          }`}
                        />
                      </button>
                    </li>
                  );
                })}
              </ol>

              <div className="grid justify-items-center gap-1 text-center">
                <h2
                  ref={stepHeadingRef}
                  tabIndex={-1}
                  className="m-0 text-[length:var(--text-2xl)] leading-[1.16] font-normal text-[var(--color-forest-deep)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
                >
                  {activeStepMeta.heading}
                </h2>
                {activeStepMeta.subtitle ? (
                  <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    {activeStepMeta.subtitle}
                  </p>
                ) : null}
              </div>

              {productSlug ? (
                <div className="mx-auto flex flex-wrap items-center justify-center gap-2 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)]/85 px-4 py-0.5 text-[length:var(--text-xs)] text-[var(--color-forest-deep)]">
                  <span>
                    <span className="font-semibold text-[var(--color-clay-ink)]">
                      {isEs ? "Categoría:" : "Category:"}
                    </span>{" "}
                    {PRODUCT_CATEGORY_LABELS[productSlug][language]}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const prevPrefix = isEs
                        ? `Categoría de interés: ${PRODUCT_CATEGORY_LABELS[productSlug].es}`
                        : `Product focus: ${PRODUCT_CATEGORY_LABELS[productSlug].en}`;
                      setProductSlug(null);
                      setNotes((current) =>
                        current.trim() === prevPrefix ? "" : current,
                      );
                    }}
                    className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-1 font-semibold text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  >
                    {isEs ? "Quitar" : "Clear"}
                  </button>
                </div>
              ) : null}
            </div>

            {/* Pre-mounted persistent error banner visible across Step 1 and Step 2 (preserves 409 slot_unavailable messages) */}
            <div
              role="alert"
              aria-live="assertive"
              className={
                submitError
                  ? "mx-auto grid w-full max-w-[46rem] gap-2 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)] px-4 py-2.5 text-center text-[length:var(--text-sm)] font-medium text-[var(--color-clay-ink)]"
                  : "sr-only"
              }
            >
              {submitError ? <p className="m-0">{submitError}</p> : null}
            </div>

            {step === 1 ? (
              <div className="grid min-w-0 gap-3.5">
                {/* Row 1: Symmetrical 50/50 Call-Length Toggle */}
                <div
                  role="group"
                  aria-label={isEs ? "Tipo de llamada" : "Call length"}
                  className="grid gap-3 sm:grid-cols-2"
                >
                  {BOOK_CALL_OPTIONS.map((option) => {
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
                          setSubmitError("");
                          setDuration(option.id);
                          setSelectedSlotIso("");
                          setConfirmedBooking(null);
                        }}
                        className={`flex min-h-[56px] cursor-pointer items-center justify-between gap-3 rounded-[var(--radius-input)] border px-4 py-2.5 text-start transition-colors ${
                          active
                            ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                            : "border-[var(--color-control-border)] bg-[var(--color-paper)]/85 text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-paper)]"
                        }`}
                      >
                        <span className="grid gap-0.5">
                          <span className="text-[length:var(--text-sm)] font-semibold">
                            {option.title[language]}
                          </span>
                          <span
                            className={`num text-[length:var(--text-xs)] ${
                              active
                                ? "text-[var(--color-paper-2)]"
                                : "text-[var(--color-muted)]"
                            }`}
                          >
                            {option.durationLabel[language]}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-pill)] ${
                            active
                              ? "bg-[var(--color-paper)] text-[var(--color-forest-deep)]"
                              : "border border-[var(--color-control-border)] bg-[var(--color-white)]"
                          }`}
                        >
                          {active ? <CheckIcon /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Row 2: Single Balanced Utility Bar (Next Open Days + Compact Inline Timezone Pill) */}
                <div className="flex flex-wrap items-center justify-between gap-2.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {!isLoadingSlots && upcomingQuickDates.length > 0 ? (
                      <>
                        <span className="text-[length:var(--text-xs)] font-semibold text-[var(--color-muted)]">
                          {isEs ? "Próximos:" : "Next open:"}
                        </span>
                        {upcomingQuickDates.map((entry) => {
                          const isSelected = entry.dateKey === selectedDateKey;
                          return (
                            <button
                              key={entry.dateKey}
                              type="button"
                              aria-pressed={isSelected}
                              onClick={() => handleSelectQuickDate(entry)}
                              className={`num inline-flex min-h-[var(--tap-min)] cursor-pointer items-center gap-1.5 rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold transition-colors ${
                                isSelected
                                  ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                                  : "border-[var(--color-control-border)] bg-[var(--color-paper)]/85 text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-paper)]"
                              }`}
                            >
                              {formatShortDatePill(entry.dateKey, locale)}
                            </button>
                          );
                        })}
                      </>
                    ) : null}
                  </div>

                  <div className="relative inline-flex max-w-full items-center">
                    <label htmlFor="book-timezone" className="sr-only">
                      {isEs ? "Zona horaria" : "Timezone"}
                    </label>
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="pointer-events-none absolute start-3.5 text-[var(--color-muted)]"
                    >
                      <circle cx="8" cy="8" r="6" />
                      <path d="M2 8h12" />
                      <path d="M8 2a9.5 9.5 0 0 1 2.4 6A9.5 9.5 0 0 1 8 14a9.5 9.5 0 0 1-2.4-6A9.5 9.5 0 0 1 8 2Z" />
                    </svg>
                    <select
                      id="book-timezone"
                      value={timeZone}
                      onChange={(event) => {
                        setIsLoadingSlots(true);
                        setSlotsError("");
                        setTimeZone(event.target.value);
                        setSelectedSlotIso("");
                      }}
                      className="atelier-select-pill"
                    >
                      <optgroup label={isEs ? "Habituales" : "Common"}>
                        {Array.from(
                          new Set([
                            timeZone,
                            ...(detectedTimeZone ? [detectedTimeZone] : []),
                            ...CURATED_TIMEZONES,
                          ]),
                        ).map((tz) => (
                          <option key={tz} value={tz}>
                            {tz.replaceAll("_", " ")}
                          </option>
                        ))}
                      </optgroup>
                      {timeZoneOptions.length > CURATED_TIMEZONES.length ? (
                        <optgroup
                          label={isEs ? "Todas las zonas" : "All timezones"}
                        >
                          {timeZoneOptions
                            .filter(
                              (tz) =>
                                tz !== timeZone &&
                                tz !== detectedTimeZone &&
                                !CURATED_TIMEZONES.includes(tz),
                            )
                            .map((tz) => (
                              <option key={tz} value={tz}>
                                {tz.replaceAll("_", " ")}
                              </option>
                            ))}
                        </optgroup>
                      ) : null}
                    </select>
                    <svg
                      aria-hidden="true"
                      width="14"
                      height="14"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="pointer-events-none absolute end-3 text-[var(--color-forest-deep)]"
                    >
                      <path d="M4 6l4 4 4-4" />
                    </svg>
                  </div>
                </div>

                {slotsError ? (
                  <div
                    role="alert"
                    className="grid gap-3 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)]/85 p-5 text-[length:var(--text-sm)] text-[var(--color-ink-2)]"
                  >
                    <p className="m-0">{slotsError}</p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          void loadSlots(monthKey, duration, timeZone)
                        }
                        className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center justify-center rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-5 py-2 text-[length:var(--text-xs)] font-semibold text-[var(--color-paper)]"
                      >
                        {isEs ? "Reintentar" : "Try again"}
                      </button>
                      <a
                        href={WHATSAPP_HREF[language]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex min-h-[var(--tap-min)] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-control-border)] px-5 py-2 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)] no-underline hover:border-[var(--color-forest-deep)]"
                      >
                        {isEs ? "Escribir por WhatsApp" : "Message on WhatsApp"}
                      </a>
                    </div>
                  </div>
                ) : null}

                {/* Row 3: Exact 50/50 Symmetrical Calendar & Open Times Columns */}
                <div className="grid min-w-0 items-start gap-6 md:grid-cols-2 lg:gap-8">
                  {/* Left 50%: Month Calendar */}
                  <div className="grid min-w-0 content-start gap-2">
                    <div className="flex min-h-[44px] items-center justify-between gap-2">
                      <button
                        type="button"
                        disabled={!canGoPrevMonth || isLoadingSlots}
                        aria-label={isEs ? "Mes anterior" : "Previous month"}
                        onClick={() => {
                          userChangedMonthRef.current = true;
                          setIsLoadingSlots(true);
                          setSlotsError("");
                          setSelectedSlotIso("");
                          setSelectedDateKey("");
                          setMonthKey((prev) => shiftMonthKey(prev, -1));
                        }}
                        className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-control-border)] bg-[var(--color-paper)]/85 text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-paper)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronIcon direction="left" />
                      </button>
                      <h3 className="m-0 min-w-0 text-center text-[length:var(--text-lg)] leading-[1.2] font-normal text-[var(--color-forest-deep)]">
                        {formatMonthTitle(monthKey, locale)}
                      </h3>
                      <button
                        type="button"
                        disabled={isLoadingSlots}
                        aria-label={isEs ? "Mes siguiente" : "Next month"}
                        onClick={() => {
                          userChangedMonthRef.current = true;
                          setIsLoadingSlots(true);
                          setSlotsError("");
                          setSelectedSlotIso("");
                          setSelectedDateKey("");
                          setMonthKey((prev) => shiftMonthKey(prev, 1));
                        }}
                        className="inline-flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-control-border)] bg-[var(--color-paper)]/85 text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-paper)] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronIcon direction="right" />
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-[length:var(--text-xs)] font-semibold text-[var(--color-muted)]">
                      {weekdayLabels.map((dayLabel) => (
                        <span key={dayLabel} className="py-1">
                          {dayLabel}
                        </span>
                      ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
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
                                  scrollElementIntoViewSafe(
                                    slotsPanelRef.current,
                                    "nearest",
                                  );
                                });
                              }
                            }}
                            className={`num relative flex h-11 min-h-[var(--tap-min)] cursor-pointer items-center justify-center rounded-[var(--radius-input)] text-[length:var(--text-sm)] transition-colors ${
                              isSelected
                                ? "border border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] font-semibold text-[var(--color-paper)]"
                                : hasSlots
                                  ? "border border-[var(--color-control-border)] bg-[var(--color-paper)]/90 font-semibold text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-pale-sage)]"
                                  : "cursor-default border border-transparent text-[var(--color-muted)]/70"
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
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                          {isEs
                            ? "No quedan huecos este mes."
                            : "No open times left this month."}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            userChangedMonthRef.current = true;
                            setIsLoadingSlots(true);
                            setMonthKey((prev) => shiftMonthKey(prev, 1));
                          }}
                          className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center rounded-[var(--radius-pill)] border border-[var(--color-control-border)] bg-[var(--color-paper)]/85 px-4 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                        >
                          {isEs ? "Ver mes siguiente" : "Next month"}
                        </button>
                      </div>
                    ) : null}
                  </div>

                  {/* Right 50%: Open Times */}
                  <div
                    ref={slotsPanelRef}
                    className="grid min-w-0 content-start gap-2"
                  >
                    <div className="flex min-h-[44px] flex-wrap items-center justify-between gap-2">
                      <p className="m-0 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
                        {selectedDateKey
                          ? formatDateHeading(selectedDateKey, locale)
                          : isEs
                            ? "Elige un día"
                            : "Pick a day"}
                      </p>

                      {!isLoadingSlots &&
                      morningSlots.length > 0 &&
                      afternoonSlots.length > 0 ? (
                        <div
                          role="group"
                          aria-label={isEs ? "Franja horaria" : "Time of day"}
                          className="grid grid-cols-2 gap-1 rounded-[var(--radius-pill)] border border-[var(--color-control-border)] bg-[var(--color-paper)]/85 p-1"
                        >
                          {(
                            [
                              {
                                id: "morning" as const,
                                label: isEs ? "Mañana" : "Morning",
                              },
                              {
                                id: "afternoon" as const,
                                label: isEs ? "Tarde" : "Afternoon",
                              },
                            ] as const
                          ).map((period) => {
                            const active = effectivePeriod === period.id;
                            return (
                              <button
                                key={period.id}
                                type="button"
                                aria-pressed={active}
                                onClick={() => setSlotPeriod(period.id)}
                                className={`min-h-[var(--tap-min)] cursor-pointer rounded-[var(--radius-pill)] px-3.5 text-[length:var(--text-xs)] font-semibold whitespace-nowrap transition-colors ${
                                  active
                                    ? "bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                                    : "bg-transparent text-[var(--color-forest-deep)] hover:bg-[var(--color-paper-2)]"
                                }`}
                              >
                                {period.label}
                              </button>
                            );
                          })}
                        </div>
                      ) : null}
                    </div>

                    {isLoadingSlots ? (
                      <div
                        aria-hidden="true"
                        className="grid grid-cols-2 gap-2 pt-1 sm:grid-cols-3"
                      >
                        {Array.from({ length: 9 }).map((_, idx) => (
                          <span
                            key={idx}
                            className="h-11 rounded-[var(--radius-input)] bg-[var(--color-paper)]/70"
                          />
                        ))}
                      </div>
                    ) : visibleSlots.length > 0 ? (
                      <div
                        data-lenis-prevent
                        className="grid max-h-[16.5rem] grid-cols-2 gap-2 overflow-y-auto overscroll-contain pe-1 pt-1 sm:grid-cols-3"
                      >
                        {visibleSlots.map((slotIso) => {
                          const active = slotIso === selectedSlotIso;
                          return (
                            <button
                              key={slotIso}
                              type="button"
                              aria-pressed={active}
                              onClick={() => handleSelectSlot(slotIso)}
                              className={`num inline-flex min-h-[var(--tap-min)] cursor-pointer items-center justify-center rounded-[var(--radius-input)] border px-3 py-2 text-[length:var(--text-sm)] font-semibold transition-colors ${
                                active
                                  ? "border-[var(--color-clay-ink)] bg-[var(--color-clay-ink)] text-[var(--color-paper)]"
                                  : "border-[var(--color-control-border)] bg-[var(--color-paper)]/90 text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                              }`}
                            >
                              {formatSlotTime(slotIso, locale, timeZone)}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="m-0 pt-2 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                        {isEs
                          ? "Selecciona un día disponible en el calendario."
                          : "Select an available day on the calendar."}
                      </p>
                    )}

                    <p className="m-0 pt-1 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                      {isEs
                        ? "Elige una hora para confirmar con tu nombre y correo."
                        : "Select a time to confirm with your name and email."}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* STEP 2: Symmetrical centered 50/50 booking form */
              <form
                aria-label={
                  isEs
                    ? "Confirmar datos de la videollamada"
                    : "Confirm video call details"
                }
                onSubmit={handleSubmit}
                noValidate
                className="mx-auto grid w-full max-w-[46rem] min-w-0 gap-3"
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

                {/* Single clean selected-slot recap strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)]/85 px-4 py-1.5">
                  <div className="flex items-center gap-3">
                    <div className="editorial-photo-frame hidden h-9 w-9 shrink-0 rounded-[var(--radius-pill)] sm:block">
                      <Image
                        src={ALMA_MEETING_PORTRAIT}
                        alt="Alma"
                        fill
                        sizes="36px"
                        className="object-cover object-[50%_42%]"
                      />
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[length:var(--text-xs)]">
                      <span className="num font-semibold text-[var(--color-forest-deep)]">
                        {selectedDateKey
                          ? formatDateHeading(selectedDateKey, locale)
                          : ""}{" "}
                        ·{" "}
                        {selectedSlotIso
                          ? formatSlotTime(selectedSlotIso, locale, timeZone)
                          : ""}
                      </span>
                      <span
                        aria-hidden="true"
                        className="text-[var(--color-clay)]"
                      >
                        ·
                      </span>
                      <span className="text-[var(--color-muted)]">
                        {duration} min · Google Meet ·{" "}
                        {timeZone.replaceAll("_", " ")}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleReturnToStep1}
                    className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-1 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  >
                    {isEs ? "Cambiar hora" : "Change time"}
                  </button>
                </div>

                {/* Row 1: 50/50 Name & Email */}
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="atelier-field min-w-0">
                    <label htmlFor="book-name">
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
                      className="atelier-input"
                    />
                    {fieldErrors.name ? (
                      <p
                        id="book-name-error"
                        role="alert"
                        className="m-0 text-[length:var(--text-xs)] font-semibold text-[var(--color-clay-ink)]"
                      >
                        {fieldErrors.name}
                      </p>
                    ) : null}
                  </div>

                  <div className="atelier-field min-w-0">
                    <label htmlFor="book-email">
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
                      placeholder={
                        isEs ? "lucia@tutienda.es" : "you@example.com"
                      }
                      className="atelier-input"
                    />
                    {fieldErrors.email ? (
                      <p
                        id="book-email-error"
                        role="alert"
                        className="m-0 text-[length:var(--text-xs)] font-semibold text-[var(--color-clay-ink)]"
                      >
                        {fieldErrors.email}
                      </p>
                    ) : null}
                  </div>
                </div>

                {/* Row 2: 50/50 Company & Call language (matching 54px control height) */}
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="atelier-field min-w-0">
                    <label htmlFor="book-company">
                      {isEs
                        ? "Tienda o empresa (opcional)"
                        : "Shop or company (optional)"}
                    </label>
                    <input
                      id="book-company"
                      type="text"
                      name="company"
                      autoComplete="organization"
                      disabled={isSubmitting}
                      value={company}
                      onChange={(event) => setCompany(event.target.value)}
                      placeholder={
                        isEs
                          ? "Ej. Boutique Sol, Donostia"
                          : "e.g. Boutique Sol, Donostia"
                      }
                      className="atelier-input"
                    />
                  </div>

                  <div className="atelier-field min-w-0">
                    <span className="text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
                      {isEs ? "Idioma de la llamada" : "Call language"}
                    </span>
                    <div
                      role="group"
                      aria-label={
                        isEs ? "Idioma de la llamada" : "Call language"
                      }
                      className="grid min-h-[var(--control-height)] grid-cols-3 items-center gap-1 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)] p-1"
                    >
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
                            className={`min-h-[var(--tap-min)] cursor-pointer rounded-[calc(var(--radius-input)-4px)] px-2 text-[length:var(--text-xs)] font-semibold transition-colors ${
                              active
                                ? "bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                                : "bg-transparent text-[var(--color-forest-deep)] hover:bg-[var(--color-paper-2)]"
                            }`}
                          >
                            {langOpt.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Row 3: Compact 50/50 Optional Note & How did you hear about us */}
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <div className="atelier-field min-w-0">
                    <label htmlFor="book-notes">
                      {isEs
                        ? "Qué te gustaría comentar (opcional)"
                        : "What would you like to discuss? (optional)"}
                    </label>
                    <input
                      id="book-notes"
                      type="text"
                      name="notes"
                      maxLength={1500}
                      disabled={isSubmitting}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder={
                        isEs
                          ? "Ej. Bolsos de piel vegetal para otoño"
                          : "e.g. Vegetable-tanned bags for autumn"
                      }
                      className="atelier-input"
                    />
                  </div>

                  <div className="atelier-field min-w-0">
                    <label htmlFor="book-referral-source">
                      {isEs
                        ? "¿Cómo nos conociste? (opcional)"
                        : "How did you hear about us? (optional)"}
                    </label>
                    <input
                      id="book-referral-source"
                      type="text"
                      name="referralSource"
                      list="book-referral-suggestions"
                      maxLength={160}
                      disabled={isSubmitting}
                      value={referralSource}
                      onChange={(event) =>
                        setReferralSource(event.target.value)
                      }
                      placeholder={
                        isEs
                          ? "Pódcast, boletín, LinkedIn o recomendación"
                          : "Podcast, newsletter, LinkedIn, or referral"
                      }
                      className="atelier-input"
                    />
                    <datalist id="book-referral-suggestions">
                      {REFERRAL_SUGGESTIONS[language].map((option) => (
                        <option key={option} value={option} />
                      ))}
                    </datalist>
                  </div>
                </div>

                {effectiveTurnstileSiteKey ? (
                  <TurnstileField
                    siteKey={effectiveTurnstileSiteKey}
                    language={language}
                    resetSignal={turnstileResetSignal}
                    theme="light"
                    onTokenChange={handleTurnstileTokenChange}
                    onError={handleTurnstileError}
                  />
                ) : null}

                <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleReturnToStep1}
                    className="secondary-button-light gap-2"
                  >
                    <ChevronIcon direction="left" />
                    <span>{isEs ? "Atrás" : "Back"}</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="primary-button-light w-full sm:w-auto"
                  >
                    {isSubmitting
                      ? isEs
                        ? "Confirmando..."
                        : "Confirming..."
                      : isEs
                        ? "Confirmar mi llamada con Alma"
                        : "Confirm my call with Alma"}
                  </button>
                </div>

                <p className="m-0 flex flex-wrap items-center justify-center gap-x-1 text-center text-[length:var(--text-xs)] leading-relaxed text-[var(--color-muted)]">
                  {isEs ? (
                    <>
                      <span>
                        Videollamada gratuita por Google Meet, sin compromiso ·
                      </span>
                      <Link
                        href={localizeHref("/privacy-policy")}
                        className="inline-flex min-h-[var(--tap-min)] items-center font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                      >
                        Privacidad
                      </Link>
                      <span>.</span>
                    </>
                  ) : (
                    <>
                      <span>Free Google Meet call, no obligation ·</span>
                      <Link
                        href={localizeHref("/privacy-policy")}
                        className="inline-flex min-h-[var(--tap-min)] items-center font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                      >
                        Privacy
                      </Link>
                      <span>.</span>
                    </>
                  )}
                </p>
              </form>
            )}
          </>
        )}
      </div>

      {/* Companion info & secondary CTAs placed calmly below the scheduler */}
      <BookCallCompanion
        language={language}
        isEs={isEs}
        localizeHref={localizeHref}
        productSlug={productSlug}
      />
    </div>
  );
}
