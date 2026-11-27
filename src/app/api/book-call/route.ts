import { NextResponse } from "next/server";

import { trackBrevoEvent } from "@/lib/brevo";
import {
  createCalBooking,
  getCalEventConfig,
  isValidIanaTimeZone,
  mapCallLanguageOptionValue,
  normalizeCallDuration,
  normalizeCallLanguage,
} from "@/lib/cal";
import {
  attributionToCalMetadata,
  attributionToEventProperties,
  EMAIL_ANALYTICS_EVENTS,
  extractRequestAttribution,
} from "@/lib/email-analytics";
import { sendResendEmail } from "@/lib/resend";
import { guardFormRequest, readJsonObject } from "@/lib/security";
import type { SiteLanguage } from "@/lib/seo";
import { buildPreCallPrepEmail } from "@/lib/transactional-emails";
import { isValidEmail, readTrimmedString } from "@/lib/validation";

const MAX_FUTURE_MS = 120 * 24 * 60 * 60 * 1000;

function normalizeSiteLanguage(raw: unknown): SiteLanguage {
  if (typeof raw !== "string") {
    return "en";
  }
  const normalized = raw.trim().toLowerCase();
  return normalized === "es" || normalized.startsWith("es-") ? "es" : "en";
}

function localizeGuardError(
  status: 400 | 403 | 429,
  fallbackError: string,
  isEs: boolean,
): string {
  if (!isEs) {
    return fallbackError;
  }
  if (status === 429) {
    return "Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.";
  }
  if (status === 400) {
    return "Completa la verificación de seguridad antes de confirmar.";
  }
  return "No pudimos completar la verificación de seguridad. Inténtalo de nuevo.";
}

export async function POST(request: Request) {
  const jsonResult = await readJsonObject(request, 32 * 1024);
  if (!jsonResult.ok) {
    return NextResponse.json(
      { ok: false, error: jsonResult.error },
      { status: jsonResult.status },
    );
  }

  const payload = jsonResult.data;
  const siteLanguage = normalizeSiteLanguage(payload.siteLanguage);
  const isEs = siteLanguage === "es";

  const guard = await guardFormRequest(request, payload, {
    scope: "cal-book",
    limit: 6,
    windowMs: 10 * 60_000,
  });

  if (!guard.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: localizeGuardError(guard.status, guard.error, isEs),
      },
      { status: guard.status },
    );
  }

  if (guard.honeypotTriggered) {
    return NextResponse.json({
      ok: true,
      booking: {
        uid: "",
        title: "",
        status: "ACCEPTED",
        startTime: "",
        endTime: "",
        timeZone: "Europe/Madrid",
        duration: "30",
        callLanguage: siteLanguage,
        meetingUrl: null,
      },
    });
  }

  const duration = normalizeCallDuration(payload.duration);
  const callLanguage = normalizeCallLanguage(
    payload.callLanguage,
    siteLanguage,
  );
  const name = readTrimmedString(payload.name, 120, { singleLine: true });
  const email = readTrimmedString(payload.email, 320, {
    singleLine: true,
  }).toLowerCase();
  const company = readTrimmedString(payload.company, 120, { singleLine: true });
  const notes = readTrimmedString(payload.notes, 1500);
  const rawStart = readTrimmedString(payload.start, 64, { singleLine: true });
  const rawTimeZone = readTrimmedString(payload.timeZone, 80, {
    singleLine: true,
  });
  const { attribution, referralSource, referralCode, attributionConsent } =
    extractRequestAttribution(payload);

  if (!name || !isValidEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        error: isEs
          ? "Introduce tu nombre y un correo electrónico válido."
          : "Enter your name and a valid email address.",
      },
      { status: 400 },
    );
  }

  if (!rawTimeZone || !isValidIanaTimeZone(rawTimeZone)) {
    return NextResponse.json(
      {
        ok: false,
        error: isEs
          ? "Selecciona una zona horaria válida antes de confirmar."
          : "Select a valid timezone before confirming.",
      },
      { status: 400 },
    );
  }

  const parsedStartMs = Date.parse(rawStart);
  const nowMs = Date.now();
  if (
    !rawStart ||
    Number.isNaN(parsedStartMs) ||
    parsedStartMs < nowMs ||
    parsedStartMs > nowMs + MAX_FUTURE_MS
  ) {
    return NextResponse.json(
      {
        ok: false,
        code: "slot_unavailable",
        error: isEs
          ? "Ese horario ya no es válido. Selecciona otra hora disponible."
          : "That time slot is no longer valid. Pick another open time.",
      },
      { status: 400 },
    );
  }

  const eventConfig = getCalEventConfig(siteLanguage, duration);
  const result = await createCalBooking({
    eventTypeId: eventConfig.id,
    start: new Date(parsedStartMs).toISOString(),
    attendee: {
      name,
      email,
      timeZone: rawTimeZone,
      language: callLanguage,
    },
    bookingFieldsResponses: {
      company: company || undefined,
      callLanguageLabel: mapCallLanguageOptionValue(siteLanguage, callLanguage),
      notes: notes || undefined,
    },
    metadata: {
      source: "karmarisedglobal-website",
      siteLanguage,
      preferredCallLanguage: callLanguage,
      ...attributionToCalMetadata(attribution),
    },
  });

  if (!result.ok) {
    if (result.code === "slot_unavailable") {
      return NextResponse.json(
        {
          ok: false,
          code: "slot_unavailable",
          error: isEs
            ? "Ese hueco se acaba de ocupar. Actualiza los horarios y elige otra hora."
            : "That time slot was just taken. Pick another open slot.",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        code: result.code,
        error: isEs
          ? "No pudimos confirmar la videollamada ahora mismo. Puedes escribirnos por WhatsApp o enviarnos un briefing de producto."
          : "Unable to confirm your video call right now. You can reach us on WhatsApp or send a Product Brief.",
      },
      { status: result.status },
    );
  }

  // Match Pre-Call Prep email language to the attendee's chosen spoken callLanguage (Portuguese keeps siteLanguage).
  const prepEmailLanguage: SiteLanguage =
    callLanguage === "es" ? "es" : callLanguage === "en" ? "en" : siteLanguage;

  let prepEmailSent = false;
  if (process.env.RESEND_API_KEY?.trim()) {
    const prepEmail = buildPreCallPrepEmail({
      siteLanguage: prepEmailLanguage,
      name,
      company: company || undefined,
      duration,
      callLanguage,
      startTime: result.booking.startTime,
      timeZone: rawTimeZone,
      meetingUrl: result.booking.meetingUrl,
      notes: notes || undefined,
    });
    const prepResult = await sendResendEmail({
      to: email,
      replyTo: "alma@karmarisedglobal.com",
      subject: prepEmail.subject,
      text: prepEmail.text,
      html: prepEmail.html,
    });
    prepEmailSent = prepResult.ok;
    if (!prepResult.ok) {
      console.error("Pre-call prep email failed:", prepResult.error);
    }
  }

  if (process.env.BREVO_API_KEY?.trim() && attributionConsent === true) {
    await trackBrevoEvent({
      email,
      eventName: EMAIL_ANALYTICS_EVENTS.callBooked,
      contactProperties: {
        FIRSTNAME: name,
        ...(company ? { COMPANY: company } : {}),
        ...(referralCode ? { REFERRAL_CODE: referralCode } : {}),
        ...(referralSource ? { REFERRAL_SOURCE: referralSource } : {}),
      },
      eventProperties: {
        language: prepEmailLanguage,
        site_language: siteLanguage,
        call_language: callLanguage,
        duration_minutes: Number(duration),
        ...attributionToEventProperties(attribution),
      },
    });
  }

  return NextResponse.json({
    ok: true,
    prepEmailSent,
    booking: {
      ...result.booking,
      timeZone: rawTimeZone,
      duration,
      callLanguage,
    },
  });
}
