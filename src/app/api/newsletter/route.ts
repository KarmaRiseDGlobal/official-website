import { NextResponse } from "next/server";

import { subscribeToBrevoNewsletter } from "@/lib/brevo";
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

  const result = await subscribeToBrevoNewsletter(email);
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ ok: true });
}
