import { NextResponse } from "next/server";

import { isValidEmail, readTrimmedString, sendResendEmail } from "@/lib/resend";

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

  const name = readTrimmedString(payload.name, 160);
  const email = readTrimmedString(payload.email, 320);
  const topic = readTrimmedString(payload.topic, 160);
  const note = readTrimmedString(payload.note, 5000);

  if (!name || !isValidEmail(email) || !topic || !note) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Complete your name, valid email, topic, and message before sending.",
      },
      { status: 400 },
    );
  }

  const result = await sendResendEmail({
    subject: `${topic} · ${name}`,
    replyTo: email,
    text: [
      `Name: ${name}`,
      `Email: ${email}`,
      `Topic: ${topic}`,
      "",
      note,
    ].join("\n"),
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ ok: true });
}
