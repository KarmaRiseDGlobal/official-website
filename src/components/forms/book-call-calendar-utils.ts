import type { CallDuration, CallLanguage } from "@/lib/cal";

export const WHATSAPP_BOOK_CALL_HREF = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma, I would like to arrange a video call about KarmaRise D Global.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma, me gustaría concertar una videollamada con KarmaRise D Global.")}`,
} as const;

export const CURATED_TIMEZONES: readonly string[] = [
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

export interface SlotsApiResponse {
  ok?: boolean;
  timeZone?: string;
  slotsByDate?: Record<string, string[]>;
  turnstileSiteKey?: string;
  error?: string;
}

export interface BookingResult {
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

export interface BookingApiResponse {
  ok?: boolean;
  code?: string;
  booking?: BookingResult;
  error?: string;
}

export interface CalendarCell {
  dateKey: string;
  dayNumber: number;
}

export function getMonthKey(year: number, monthIndexZero: number): string {
  return `${year}-${String(monthIndexZero + 1).padStart(2, "0")}`;
}

export function parseMonthKey(monthKey: string): {
  year: number;
  month: number;
} {
  const [yStr, mStr] = monthKey.split("-");
  const year = Number(yStr);
  const month = Number(mStr);
  if (!Number.isFinite(year) || !Number.isFinite(month)) {
    const now = new Date();
    return { year: now.getUTCFullYear(), month: now.getUTCMonth() + 1 };
  }
  return { year, month };
}

export function buildMonthGrid(monthKey: string): Array<CalendarCell | null> {
  const { year, month } = parseMonthKey(monthKey);
  const firstDay = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
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

export function shiftMonthKey(monthKey: string, delta: number): string {
  const { year, month } = parseMonthKey(monthKey);
  const shifted = new Date(Date.UTC(year, month - 1 + delta, 1));
  return getMonthKey(shifted.getUTCFullYear(), shifted.getUTCMonth());
}

export function formatMonthTitle(monthKey: string, locale: string): string {
  const { year, month } = parseMonthKey(monthKey);
  const date = new Date(Date.UTC(year, month - 1, 15));
  const label = new Intl.DateTimeFormat(locale, {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function formatDateHeading(dateKey: string, locale: string): string {
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
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatShortDatePill(dateKey: string, locale: string): string {
  const [yStr, mStr, dStr] = dateKey.split("-");
  const date = new Date(
    Date.UTC(Number(yStr), Number(mStr) - 1, Number(dStr), 12, 0, 0),
  );
  const formatted = new Intl.DateTimeFormat(locale, {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function getSlotHour(isoString: string, timeZone: string): number {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) {
    return 12;
  }
  const hourPart = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
  const parsed = Number.parseInt(hourPart, 10);
  return Number.isFinite(parsed) ? parsed : 12;
}

export function formatSlotTime(
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

export function formatConfirmedDateTime(
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
