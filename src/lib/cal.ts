import "server-only";

import type { SiteLanguage } from "@/lib/urls";

const CAL_API_BASE = "https://api.cal.com/v2";
const CAL_SLOTS_API_VERSION = "2024-09-04";
const CAL_BOOKINGS_API_VERSION = "2024-08-13";
const CAL_TIMEOUT_MS = 12_000;

export type CallDuration = "15" | "30";
export type CallLanguage = "en" | "es" | "pt";

export interface CalEventConfig {
  readonly id: number;
  readonly slug: string;
  readonly durationMinutes: 15 | 30;
  readonly siteLanguage: SiteLanguage;
}

const DEFAULT_EVENT_IDS: Record<SiteLanguage, Record<CallDuration, number>> = {
  en: {
    "30": 8003648,
    "15": 8003653,
  },
  es: {
    "30": 8003654,
    "15": 8003655,
  },
};

const EVENT_SLUGS: Record<SiteLanguage, Record<CallDuration, string>> = {
  en: {
    "30": "product-brief-call",
    "15": "quick-intro-call",
  },
  es: {
    "30": "reunion-product-brief",
    "15": "llamada-rapida",
  },
};

const CALL_LANGUAGE_LABELS: Record<
  SiteLanguage,
  Record<CallLanguage, string>
> = {
  en: {
    en: "English",
    es: "Spanish",
    pt: "Portuguese",
  },
  es: {
    en: "Inglés",
    es: "Español",
    pt: "Portugués",
  },
};

function parsePositiveIntEnv(name: string): number | null {
  const raw = process.env[name]?.trim();
  if (!raw || !/^\d+$/.test(raw)) {
    return null;
  }
  const parsed = Number(raw);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export function resolveCalApiKey(): string {
  return process.env.CAL_ALMA_API_KEY?.trim() || "";
}

export function normalizeCallDuration(raw: unknown): CallDuration {
  return raw === "15" || raw === 15 ? "15" : "30";
}

export function normalizeCallLanguage(
  raw: unknown,
  fallback: SiteLanguage = "en",
): CallLanguage {
  if (typeof raw !== "string") {
    return fallback;
  }
  const normalized = raw.trim().toLowerCase();
  if (
    normalized === "es" ||
    normalized === "spanish" ||
    normalized === "español" ||
    normalized === "espanol"
  ) {
    return "es";
  }
  if (
    normalized === "pt" ||
    normalized === "portuguese" ||
    normalized === "portugués" ||
    normalized === "portugues"
  ) {
    return "pt";
  }
  if (
    normalized === "en" ||
    normalized === "english" ||
    normalized === "inglés" ||
    normalized === "ingles"
  ) {
    return "en";
  }
  return fallback;
}

export function getCalEventConfig(
  siteLanguage: SiteLanguage,
  duration: CallDuration,
): CalEventConfig {
  const envName = `CAL_EVENT_ID_${siteLanguage.toUpperCase()}_${duration}`;
  const overrideId = parsePositiveIntEnv(envName);

  return {
    id: overrideId ?? DEFAULT_EVENT_IDS[siteLanguage][duration],
    slug: EVENT_SLUGS[siteLanguage][duration],
    durationMinutes: duration === "15" ? 15 : 30,
    siteLanguage,
  };
}

export function mapCallLanguageOptionValue(
  siteLanguage: SiteLanguage,
  callLanguage: CallLanguage,
): string {
  return CALL_LANGUAGE_LABELS[siteLanguage][callLanguage];
}

export function isValidIanaTimeZone(timeZone: string): boolean {
  const trimmed = timeZone.trim();
  if (!trimmed || trimmed.length > 80) {
    return false;
  }
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: trimmed });
    return true;
  } catch {
    return false;
  }
}

export interface CalSlotsResult {
  ok: true;
  slotsByDate: Record<string, string[]>;
}

export interface CalApiFailure {
  ok: false;
  status: number;
  code:
    "not_configured" | "slot_unavailable" | "bad_request" | "upstream_error";
  error: string;
}

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractCalErrorMessage(payload: unknown): string {
  if (!isPlainRecord(payload)) {
    return "";
  }
  if (typeof payload.message === "string" && payload.message.trim()) {
    return payload.message.trim();
  }
  if (
    isPlainRecord(payload.error) &&
    typeof payload.error.message === "string"
  ) {
    return payload.error.message.trim();
  }
  if (typeof payload.error === "string" && payload.error.trim()) {
    return payload.error.trim();
  }
  return "";
}

export async function fetchCalSlots(options: {
  eventTypeId: number;
  start: string;
  end: string;
  timeZone: string;
  apiKey?: string;
}): Promise<CalSlotsResult | CalApiFailure> {
  const apiKey = options.apiKey?.trim() || resolveCalApiKey();
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      code: "not_configured",
      error: "Scheduling is not configured in this environment.",
    };
  }

  const params = new URLSearchParams({
    eventTypeId: String(options.eventTypeId),
    start: options.start,
    end: options.end,
    timeZone: options.timeZone,
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CAL_TIMEOUT_MS);

  try {
    const response = await fetch(`${CAL_API_BASE}/slots?${params.toString()}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "cal-api-version": CAL_SLOTS_API_VERSION,
      },
      signal: controller.signal,
      cache: "no-store",
    });

    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok || !isPlainRecord(payload)) {
      const detail = extractCalErrorMessage(payload);
      return {
        ok: false,
        status: response.status >= 400 && response.status < 500 ? 400 : 502,
        code:
          response.status >= 400 && response.status < 500
            ? "bad_request"
            : "upstream_error",
        error: detail || "Unable to fetch available call slots.",
      };
    }

    const rawData = isPlainRecord(payload.data) ? payload.data : {};
    const slotsByDate: Record<string, string[]> = {};

    for (const [dateKey, entries] of Object.entries(rawData)) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateKey) || !Array.isArray(entries)) {
        continue;
      }

      const validTimes: string[] = [];
      for (const entry of entries) {
        if (
          isPlainRecord(entry) &&
          typeof entry.start === "string" &&
          !Number.isNaN(Date.parse(entry.start))
        ) {
          validTimes.push(entry.start);
        }
      }

      if (validTimes.length > 0) {
        slotsByDate[dateKey] = validTimes;
      }
    }

    return { ok: true, slotsByDate };
  } catch {
    return {
      ok: false,
      status: 502,
      code: "upstream_error",
      error: "Unable to reach the scheduling service right now.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export interface CalCreatedBooking {
  uid: string;
  id: number | null;
  title: string;
  status: string;
  startTime: string;
  endTime: string;
  meetingUrl: string | null;
}

export interface CalCreateBookingSuccess {
  ok: true;
  booking: CalCreatedBooking;
}

export async function createCalBooking(options: {
  eventTypeId: number;
  start: string;
  attendee: {
    name: string;
    email: string;
    timeZone: string;
    language: CallLanguage;
  };
  bookingFieldsResponses: {
    company?: string;
    callLanguageLabel: string;
    notes?: string;
  };
  metadata?: Record<string, string>;
  apiKey?: string;
}): Promise<CalCreateBookingSuccess | CalApiFailure> {
  const apiKey = options.apiKey?.trim() || resolveCalApiKey();
  if (!apiKey) {
    return {
      ok: false,
      status: 503,
      code: "not_configured",
      error: "Scheduling is not configured in this environment.",
    };
  }

  const bookingFieldsResponses: Record<string, string> = {
    "call-language": options.bookingFieldsResponses.callLanguageLabel,
  };
  if (options.bookingFieldsResponses.company) {
    bookingFieldsResponses.company = options.bookingFieldsResponses.company;
  }
  if (options.bookingFieldsResponses.notes) {
    bookingFieldsResponses.notes = options.bookingFieldsResponses.notes;
  }

  const requestBody = {
    eventTypeId: options.eventTypeId,
    start: options.start,
    attendee: {
      name: options.attendee.name,
      email: options.attendee.email,
      timeZone: options.attendee.timeZone,
      language: options.attendee.language,
    },
    bookingFieldsResponses,
    metadata: options.metadata ?? { source: "karmarisedglobal-website" },
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), CAL_TIMEOUT_MS);

  try {
    const response = await fetch(`${CAL_API_BASE}/bookings`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "cal-api-version": CAL_BOOKINGS_API_VERSION,
      },
      body: JSON.stringify(requestBody),
      signal: controller.signal,
    });

    const payload: unknown = await response.json().catch(() => null);
    if (
      !response.ok ||
      !isPlainRecord(payload) ||
      !isPlainRecord(payload.data)
    ) {
      const detail = extractCalErrorMessage(payload);
      const lowerDetail = detail.toLowerCase();
      const isSlotConflict =
        response.status === 409 ||
        lowerDetail.includes("not available") ||
        lowerDetail.includes("already booked") ||
        lowerDetail.includes("busy") ||
        lowerDetail.includes("notice") ||
        lowerDetail.includes("slot");

      return {
        ok: false,
        status: isSlotConflict
          ? 409
          : response.status >= 400 && response.status < 500
            ? 400
            : 502,
        code: isSlotConflict
          ? "slot_unavailable"
          : response.status >= 400 && response.status < 500
            ? "bad_request"
            : "upstream_error",
        error: detail || "Unable to confirm booking right now.",
      };
    }

    const data = payload.data;
    const rawMeetingUrl =
      typeof data.meetingUrl === "string" &&
      data.meetingUrl.startsWith("https://")
        ? data.meetingUrl
        : null;

    const startTime =
      (typeof data.start === "string" && data.start) ||
      (typeof data.startTime === "string" && data.startTime) ||
      options.start;
    const endTime =
      (typeof data.end === "string" && data.end) ||
      (typeof data.endTime === "string" && data.endTime) ||
      options.start;

    return {
      ok: true,
      booking: {
        uid: typeof data.uid === "string" ? data.uid : "",
        id: typeof data.id === "number" ? data.id : null,
        title: typeof data.title === "string" ? data.title : "",
        status: typeof data.status === "string" ? data.status : "ACCEPTED",
        startTime,
        endTime,
        meetingUrl: rawMeetingUrl,
      },
    };
  } catch {
    return {
      ok: false,
      status: 502,
      code: "upstream_error",
      error: "Unable to reach the scheduling service right now.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}
