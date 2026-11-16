import { NextResponse } from "next/server";

import { updateBrevoSubscriberLanguage } from "@/lib/brevo";
import { isValidEmail, readTrimmedString } from "@/lib/validation";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderPreferenceConfirmationHtml(options: {
  email: string;
  lang: "EN" | "ES";
  updated: boolean;
}): string {
  const isEs = options.lang === "ES";
  const otherLang = isEs ? "EN" : "ES";
  const switchUrl = `/api/newsletter/preferences?email=${encodeURIComponent(options.email)}&lang=${otherLang}`;

  const heading = isEs
    ? "¡Listo! Te escribiremos en español."
    : "All set! We will write to you in English.";
  const body = isEs
    ? `Hemos guardado tu preferencia para ${options.email}. A partir de ahora recibirás nuestras cartas e historias de KarmaRise en español.`
    : `We updated the preference for ${options.email}. From now on, you will receive our KarmaRise letters and stories in English.`;
  const ctaLabel = isEs
    ? "Ir a leer nuestras historias"
    : "Explore the KarmaRise Journal";
  const switchLabel = isEs
    ? "Prefiero leer en inglés (Switch to English)"
    : "Prefiero leer en español (Cambiar a Español)";

  return `<!DOCTYPE html>
<html lang="${isEs ? "es" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(heading)}</title>
</head>
<body style="margin:0;padding:40px 16px;background-color:#D9DFD3;font-family:Georgia,'Times New Roman',serif;color:#182D20;display:flex;align-items:center;justify-content:center;min-height:85vh;">
  <div style="max-width:520px;width:100%;background-color:#F2ECDF;border-radius:24px;padding:44px 36px;text-align:center;box-shadow:0 14px 38px rgba(24,45,32,0.08);">
    <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#BD7057;font-weight:bold;">
      KarmaRise Journal &middot; ${isEs ? "Preferencia de idioma" : "Language preference"}
    </p>
    <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:normal;font-style:italic;color:#182D20;">
      ${escapeHtml(heading)}
    </h1>
    <p style="margin:0 0 28px;font-size:17px;line-height:1.7;color:#25201D;">
      ${escapeHtml(body)}
    </p>
    <div style="margin-bottom:24px;">
      <a href="/stories" style="display:inline-block;padding:14px 32px;background-color:#BD7057;color:#FAF6EE;text-decoration:none;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">
        ${escapeHtml(ctaLabel)}
      </a>
    </div>
    ${
      options.email
        ? `<p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#584B44;">
            <a href="${escapeHtml(switchUrl)}" style="color:#833E28;text-decoration:underline;">${escapeHtml(switchLabel)}</a>
          </p>`
        : ""
    }
  </div>
</body>
</html>`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawEmail = readTrimmedString(
    url.searchParams.get("email"),
    320,
  ).toLowerCase();
  const rawLang = readTrimmedString(
    url.searchParams.get("lang"),
    10,
  ).toUpperCase();
  const lang: "EN" | "ES" = rawLang === "ES" ? "ES" : "EN";

  let updated = false;
  if (isValidEmail(rawEmail)) {
    updated = await updateBrevoSubscriberLanguage(rawEmail, lang);
  }

  return new NextResponse(
    renderPreferenceConfirmationHtml({
      email: isValidEmail(rawEmail) ? rawEmail : "",
      lang,
      updated,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    },
  );
}

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

  const email = readTrimmedString(payload.email, 320).toLowerCase();
  if (!isValidEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const rawLang = readTrimmedString(
    payload.lang ?? payload.language,
    10,
  ).toUpperCase();
  const lang: "EN" | "ES" = rawLang === "ES" ? "ES" : "EN";

  const updated = await updateBrevoSubscriberLanguage(email, lang);
  if (!updated) {
    return NextResponse.json(
      { ok: false, error: "Unable to update language preference right now." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, language: lang });
}
