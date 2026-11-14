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
  const company = readTrimmedString(payload.company, 200);
  const profile = readTrimmedString(payload.profile, 160);
  const email = readTrimmedString(payload.email, 320);
  const language = readTrimmedString(payload.language, 80);
  const product = readTrimmedString(payload.product, 160);
  const readiness = readTrimmedString(payload.readiness, 200);
  const quantity = readTrimmedString(payload.quantity, 160);
  const brief = readTrimmedString(payload.brief, 8000);

  if (
    !name ||
    !company ||
    !profile ||
    !isValidEmail(email) ||
    !language ||
    !product ||
    !readiness ||
    !brief
  ) {
    return NextResponse.json(
      { ok: false, error: "Complete the required fields before sending." },
      { status: 400 },
    );
  }

  const text = [
    `Name: ${name}`,
    `Company: ${company}`,
    `Profile: ${profile}`,
    `Work email: ${email}`,
    `Preferred language: ${language}`,
    `Product type: ${product}`,
    `Current stage: ${readiness}`,
    quantity ? `Estimated Bulk Order quantity: ${quantity}` : null,
    "",
    "Project notes:",
    brief,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const result = await sendResendEmail({
    subject: `Product Brief: ${company} (${product})`,
    replyTo: email,
    text,
  });

  if (!result.ok) {
    return NextResponse.json(
      { ok: false, error: result.error },
      { status: result.status },
    );
  }

  return NextResponse.json({ ok: true });
}
