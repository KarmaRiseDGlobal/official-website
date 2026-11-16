import { NextResponse } from "next/server";

import {
  resolveCountryName,
  resolveSubscriberLanguage,
  subscribeToBrevoNewsletter,
} from "@/lib/brevo";
import { isValidEmail, readTrimmedString } from "@/lib/validation";

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request payload." },
      { status: 400 },
    );
  }

  // Silently accept honeypot submissions so automated bots do not retry.
  if (readTrimmedString(payload.companyWebsite, 200)) {
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

  const result = await subscribeToBrevoNewsletter({
    email,
    firstName,
    language,
    country,
    interest,
    source,
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
