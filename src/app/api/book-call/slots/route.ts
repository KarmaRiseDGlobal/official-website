import { NextResponse } from "next/server";

import {
  fetchCalSlots,
  getCalEventConfig,
  isValidIanaTimeZone,
  normalizeCallDuration,
} from "@/lib/cal";
import { checkRateLimit, getClientIp } from "@/lib/security";
import type { SiteLanguage } from "@/lib/seo";

const MAX_RANGE_MS = 45 * 24 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

function normalizeSiteLanguage(raw: string | null): SiteLanguage {
  return raw?.trim().toLowerCase() === "es" ? "es" : "en";
}

function resolveMonthRange(monthParam: string | null): {
  start: string;
  end: string;
} | null {
  if (!monthParam) {
    return null;
  }
  const match = /^(\d{4})-(\d{2})$/.exec(monthParam.trim());
  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  if (year < 2025 || year > 2100 || month < 1 || month > 12) {
    return null;
  }

  // Pad by 1 day on each edge so timezone shifts around midnight are included.
  const paddedStartMs = Date.UTC(year, month - 1, 0, 0, 0, 0);
  const paddedEndMs = Date.UTC(year, month, 2, 23, 59, 59);
  const floorMs = Date.now() - DAY_MS;
  const effectiveStartMs = Math.max(paddedStartMs, floorMs);

  if (paddedEndMs <= effectiveStartMs) {
    return {
      start: new Date(effectiveStartMs).toISOString(),
      end: new Date(effectiveStartMs + DAY_MS).toISOString(),
    };
  }

  return {
    start: new Date(effectiveStartMs).toISOString(),
    end: new Date(
      Math.min(paddedEndMs, effectiveStartMs + MAX_RANGE_MS),
    ).toISOString(),
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const siteLanguage = normalizeSiteLanguage(searchParams.get("language"));
  const duration = normalizeCallDuration(searchParams.get("duration"));
  const isEs = siteLanguage === "es";

  const clientIp = getClientIp(request);
  const rate = checkRateLimit(`cal-slots:${clientIp}`, 40, 60_000);
  if (!rate.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: isEs
          ? "Has consultado demasiados horarios seguidos. Espera un momento o escríbenos por WhatsApp o correo."
          : "Too many schedule checks in a row. Wait a moment, or message us on WhatsApp or email.",
      },
      { status: 429, headers: { "Cache-Control": "no-store" } },
    );
  }

  const rawTimeZone = searchParams.get("timeZone")?.trim() || "Europe/Madrid";
  const timeZone = isValidIanaTimeZone(rawTimeZone)
    ? rawTimeZone
    : "Europe/Madrid";

  let range = resolveMonthRange(searchParams.get("month"));
  if (!range) {
    const startParam = searchParams.get("start")?.trim();
    const endParam = searchParams.get("end")?.trim();
    if (startParam && endParam) {
      const startMs = Date.parse(startParam);
      const endMs = Date.parse(endParam);
      if (
        !Number.isNaN(startMs) &&
        !Number.isNaN(endMs) &&
        endMs > startMs &&
        endMs - startMs <= MAX_RANGE_MS
      ) {
        range = {
          start: new Date(startMs).toISOString(),
          end: new Date(endMs).toISOString(),
        };
      }
    }
  }

  if (!range) {
    const now = Date.now();
    range = {
      start: new Date(now).toISOString(),
      end: new Date(now + 35 * DAY_MS).toISOString(),
    };
  }

  const eventConfig = getCalEventConfig(siteLanguage, duration);
  const result = await fetchCalSlots({
    eventTypeId: eventConfig.id,
    start: range.start,
    end: range.end,
    timeZone,
  });

  if (!result.ok) {
    return NextResponse.json(
      {
        ok: false,
        code: result.code,
        error: isEs
          ? "No pudimos cargar los horarios disponibles ahora mismo. Puedes escribirnos por WhatsApp o por correo."
          : "Unable to load available call times right now. You can still message us on WhatsApp or email.",
      },
      { status: result.status, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(
    {
      ok: true,
      timeZone,
      duration,
      slotsByDate: result.slotsByDate,
      turnstileSiteKey:
        process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "",
    },
    { status: 200, headers: { "Cache-Control": "no-store" } },
  );
}
