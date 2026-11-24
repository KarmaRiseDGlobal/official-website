import { NextResponse } from "next/server";

import {
  resolveCountryName,
  resolveSubscriberLanguage,
  subscribeToBrevoNewsletter,
} from "@/lib/brevo";
import { normalizeNewsletterTracks } from "@/lib/newsletter-tracks";
import { guardFormRequest, readJsonObject } from "@/lib/security";
import { isValidEmail, readTrimmedString } from "@/lib/validation";

export async function POST(request: Request) {
  const parsed = await readJsonObject(request, 16 * 1024);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.error },
      { status: parsed.status },
    );
  }

  const payload = parsed.data;
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
      { ok: false, error: guard.error },
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
      { ok: false, error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const firstName = readTrimmedString(payload.firstName, 80) || undefined;
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

  const country = resolveCountryName(cfIpCountry);
  const interest = readTrimmedString(payload.interest, 100) || undefined;
  const source = readTrimmedString(payload.source, 80) || "Website";
  const tracks = normalizeNewsletterTracks(payload.tracks ?? payload.track);

  const result = await subscribeToBrevoNewsletter({
    email,
    firstName,
    language,
    country,
    interest,
    source,
    ...(tracks.length > 0 ? { tracks } : {}),
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
