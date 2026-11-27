import { NextResponse } from "next/server";

import {
  resolveCountryName,
  resolveSubscriberLanguage,
  subscribeToBrevoNewsletter,
} from "@/lib/brevo";
import { extractRequestAttribution } from "@/lib/email-analytics";
import { normalizeNewsletterTracks } from "@/lib/newsletter-tracks";
import { guardFormRequest, readJsonObject } from "@/lib/security";
import { isValidEmail, readTrimmedString } from "@/lib/validation";

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
    return "Completa la verificación de seguridad antes de enviar.";
  }
  return "No pudimos completar la verificación de seguridad. Inténtalo de nuevo.";
}

export async function POST(request: Request) {
  const parsed = await readJsonObject(request, 16 * 1024);
  if (!parsed.ok) {
    const acceptEs =
      request.headers.get("accept-language")?.toLowerCase().startsWith("es") ??
      false;
    return NextResponse.json(
      {
        ok: false,
        error: acceptEs
          ? parsed.status === 413
            ? "La solicitud supera el tamaño permitido."
            : "Los datos enviados no son válidos."
          : parsed.error,
      },
      { status: parsed.status },
    );
  }

  const payload = parsed.data;
  const explicitLanguage = readTrimmedString(payload.language, 10);
  const browserLocale = readTrimmedString(payload.browserLocale, 32);
  const cfIpCountry = request.headers.get("cf-ipcountry");
  const acceptLanguage = request.headers.get("accept-language");

  const language = resolveSubscriberLanguage({
    explicitLanguage,
    browserLocale,
    acceptLanguageHeader: acceptLanguage,
    cfIpCountryHeader: cfIpCountry,
  });
  const isEs = language === "ES";

  const guard = await guardFormRequest(
    request,
    {
      companyWebsite: payload.companyWebsite,
      turnstileToken: payload.turnstileToken,
    },
    { scope: "newsletter", limit: 10, windowMs: 10 * 60 * 1000 },
  );

  if (!guard.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: localizeGuardError(guard.status, guard.error, isEs),
      },
      { status: guard.status },
    );
  }

  // Silently accept honeypot submissions so automated bots do not retry.
  if (guard.honeypotTriggered) {
    return NextResponse.json({ ok: true });
  }

  const email = readTrimmedString(payload.email, 320).toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json(
      {
        ok: false,
        error: isEs
          ? "Introduce un correo electrónico válido."
          : "Enter a valid email address.",
      },
      { status: 400 },
    );
  }

  const firstName = readTrimmedString(payload.firstName, 80) || undefined;
  const country = resolveCountryName(cfIpCountry);
  const interest = readTrimmedString(payload.interest, 100) || undefined;
  const source = readTrimmedString(payload.source, 80) || "Website";
  const tracks = normalizeNewsletterTracks(payload.tracks ?? payload.track);
  const {
    attribution,
    referralSource,
    referralCode,
    attributionConsent,
    hasExplicitConsentField,
  } = extractRequestAttribution(payload);

  const result = await subscribeToBrevoNewsletter({
    email,
    firstName,
    language,
    country,
    interest,
    source,
    ...(tracks.length > 0 ? { tracks } : {}),
    ...(attribution ? { attribution } : {}),
    ...(referralSource ? { referralSource } : {}),
    ...(referralCode ? { referralCode } : {}),
    ...(hasExplicitConsentField ? { attributionConsent } : {}),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({
    ok: true,
    language: result.language,
    welcomeSent: result.welcomeSent,
  });
}
