import { createHmac } from "node:crypto";

import { NextResponse } from "next/server";

import { updateBrevoSubscriberLanguage } from "@/lib/brevo";
import {
  checkRateLimit,
  escapeHtml,
  getClientIp,
  guardFormRequest,
  readBoundedBodyText,
  readJsonObject,
  timingSafeEqualStrings,
} from "@/lib/security";
import { isValidEmail, readTrimmedString } from "@/lib/validation";

const MAX_PREFERENCES_BODY_BYTES = 16 * 1024;
const PREFERENCES_RATE_LIMIT = 10;
const PREFERENCES_RATE_WINDOW_MS = 10 * 60 * 1000;

type PreferenceLang = "EN" | "ES";
type PageMode = "confirm" | "updated" | "error";

function getPreferencesSigningSecret(): string {
  return (
    process.env.PREFERENCES_SIGNING_SECRET?.trim() ||
    process.env.BREVO_WEBHOOK_SECRET?.trim() ||
    ""
  );
}

function computePreferencesSignature(
  email: string,
  lang: PreferenceLang,
  secret: string,
): string {
  return createHmac("sha256", secret)
    .update(`newsletter-preferences:v1:${email}:${lang}`, "utf8")
    .digest("hex");
}

function verifyPreferencesSignature(
  email: string,
  lang: PreferenceLang,
  sig: string,
  secret: string,
): boolean {
  if (!secret || !sig || !isValidEmail(email)) {
    return false;
  }

  return timingSafeEqualStrings(
    sig,
    computePreferencesSignature(email, lang, secret),
  );
}

function htmlResponse(html: string, status = 200): NextResponse {
  return new NextResponse(html, {
    status,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function renderPreferencesHtml(options: {
  mode: PageMode;
  email: string;
  lang: PreferenceLang;
  errorMessage?: string;
}): string {
  const isEs = options.lang === "ES";
  const otherLang: PreferenceLang = isEs ? "EN" : "ES";
  const hasValidEmail = isValidEmail(options.email);
  const storiesHref = isEs ? "/es/stories" : "/stories";
  const switchUrl = hasValidEmail
    ? `/api/newsletter/preferences?email=${encodeURIComponent(options.email)}&lang=${otherLang}`
    : `/api/newsletter/preferences?lang=${otherLang}`;

  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim();
  const hasTurnstile = Boolean(
    turnstileSiteKey && process.env.TURNSTILE_SECRET_KEY?.trim(),
  );

  let heading: string;
  let body: string;

  if (options.mode === "updated") {
    heading = isEs
      ? "¡Listo! Te escribiremos en español."
      : "All set! We will write to you in English.";
    body = hasValidEmail
      ? isEs
        ? `Hemos guardado tu preferencia para ${options.email}. A partir de ahora recibirás nuestras cartas e historias de KarmaRise en español.`
        : `We updated the preference for ${options.email}. From now on, you will receive our KarmaRise letters and Stories in English.`
      : isEs
        ? "Hemos guardado tu preferencia de idioma para recibir nuestras cartas e historias de KarmaRise en español."
        : "We updated your language preference for our KarmaRise letters and Stories.";
  } else if (options.mode === "error") {
    heading = isEs
      ? "No hemos podido guardar tu preferencia."
      : "We could not update your preference.";
    body =
      options.errorMessage?.trim() ||
      (isEs
        ? "Comprueba el correo electrónico e inténtalo de nuevo."
        : "Please check your email address and try again.");
  } else {
    heading = isEs
      ? "Confirma tu preferencia de idioma"
      : "Confirm your language preference";
    body = hasValidEmail
      ? isEs
        ? `Vamos a guardar tu preferencia para ${options.email} y enviarte nuestras cartas e historias de KarmaRise en español.`
        : `Confirm below to update the preference for ${options.email} and receive our KarmaRise letters and Stories in English.`
      : isEs
        ? "Escribe tu correo electrónico para recibir nuestras cartas e historias de KarmaRise en español."
        : "Enter your email address below to receive our KarmaRise letters and Stories in English.";
  }

  const ctaLabel = isEs
    ? "Ir a leer nuestras historias"
    : "Read our KarmaRise Stories";
  const submitLabel = isEs ? "Confirmar español" : "Confirm English";
  const emailLabel = isEs ? "Correo electrónico" : "Email address";
  const emailPlaceholder = isEs ? "tu@empresa.com" : "you@company.com";
  const switchLabel = isEs
    ? "Prefiero leer en inglés (Switch to English)"
    : "Prefiero leer en español (Cambiar a español)";

  const emailFieldHtml = hasValidEmail
    ? `<input type="hidden" name="email" value="${escapeHtml(options.email)}" />`
    : `<div style="margin:0 0 18px;text-align:left;">
        <label for="pref-email" style="display:block;margin:0 0 6px;font-family:Arial,sans-serif;font-size:12px;font-weight:bold;color:#182D20;">${escapeHtml(emailLabel)}</label>
        <input id="pref-email" type="email" name="email" required autocomplete="email" placeholder="${escapeHtml(emailPlaceholder)}" style="width:100%;box-sizing:border-box;padding:12px 14px;border-radius:12px;border:1px solid #CDBB9C;background-color:#FAF6EE;font-family:Arial,sans-serif;font-size:16px;color:#182D20;" />
      </div>`;

  const turnstileHtml =
    hasTurnstile && turnstileSiteKey
      ? `<div class="cf-turnstile" data-sitekey="${escapeHtml(turnstileSiteKey)}" data-language="${isEs ? "es" : "en"}" style="margin:0 auto 20px;display:flex;justify-content:center;"></div>`
      : "";

  const formHtml =
    options.mode === "confirm"
      ? `<form method="POST" action="/api/newsletter/preferences" style="margin:0 0 22px;">
          ${emailFieldHtml}
          <input type="hidden" name="lang" value="${escapeHtml(options.lang)}" />
          <div style="position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden;" aria-hidden="true">
            <label>Website <input type="text" name="companyWebsite" tabindex="-1" autocomplete="off" /></label>
          </div>
          ${turnstileHtml}
          <button type="submit" style="display:inline-block;padding:14px 32px;background-color:#BD7057;color:#FAF6EE;border:0;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;cursor:pointer;">
            ${escapeHtml(submitLabel)}
          </button>
        </form>
        <p style="margin:0 0 18px;font-family:Arial,sans-serif;font-size:12px;color:#584B44;">
          <a href="${escapeHtml(switchUrl)}" style="color:#833E28;text-decoration:underline;">${escapeHtml(switchLabel)}</a>
        </p>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;">
          <a href="${escapeHtml(storiesHref)}" style="color:#182D20;text-decoration:underline;">${escapeHtml(ctaLabel)}</a>
        </p>`
      : `<div style="margin-bottom:24px;">
          <a href="${escapeHtml(storiesHref)}" style="display:inline-block;padding:14px 32px;background-color:#BD7057;color:#FAF6EE;text-decoration:none;border-radius:999px;font-family:Arial,sans-serif;font-size:14px;font-weight:bold;">
            ${escapeHtml(ctaLabel)}
          </a>
        </div>
        ${
          options.mode === "updated" && hasValidEmail
            ? `<p style="margin:0;font-family:Arial,sans-serif;font-size:12px;color:#584B44;">
                <a href="${escapeHtml(switchUrl)}" style="color:#833E28;text-decoration:underline;">${escapeHtml(switchLabel)}</a>
              </p>`
            : ""
        }`;

  const turnstileScriptTag =
    options.mode === "confirm" && hasTurnstile
      ? `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`
      : "";

  return `<!DOCTYPE html>
<html lang="${isEs ? "es" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(heading)}</title>
  ${turnstileScriptTag}
</head>
<body style="margin:0;padding:40px 16px;background-color:#D9DFD3;font-family:Georgia,'Times New Roman',serif;color:#182D20;display:flex;align-items:center;justify-content:center;min-height:85vh;">
  <main style="max-width:520px;width:100%;box-sizing:border-box;background-color:#F2ECDF;border-radius:24px;padding:44px 36px;text-align:center;box-shadow:0 14px 38px rgba(24,45,32,0.08);">
    <p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#BD7057;font-weight:bold;">
      ${isEs ? "Historias de KarmaRise" : "KarmaRise Stories"} &middot; ${isEs ? "Preferencia de idioma" : "Language preference"}
    </p>
    <h1 style="margin:0 0 16px;font-size:28px;line-height:1.2;font-weight:normal;font-style:italic;color:#182D20;">
      ${escapeHtml(heading)}
    </h1>
    <p style="margin:0 0 28px;font-size:17px;line-height:1.7;color:#25201D;">
      ${escapeHtml(body)}
    </p>
    ${formHtml}
  </main>
</body>
</html>`;
}

function respondError(options: {
  wantsHtml: boolean;
  status: number;
  error: string;
  email?: string;
  lang?: PreferenceLang;
}): NextResponse {
  if (options.wantsHtml) {
    return htmlResponse(
      renderPreferencesHtml({
        mode: "error",
        email: options.email ?? "",
        lang: options.lang ?? "EN",
        errorMessage: options.error,
      }),
      options.status,
    );
  }

  return NextResponse.json(
    { ok: false, error: options.error },
    { status: options.status },
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const rawEmail = readTrimmedString(url.searchParams.get("email"), 320, {
    singleLine: true,
  }).toLowerCase();
  const rawLang = readTrimmedString(url.searchParams.get("lang"), 10, {
    singleLine: true,
  }).toUpperCase();
  const lang: PreferenceLang = rawLang === "ES" ? "ES" : "EN";
  const sig = readTrimmedString(url.searchParams.get("sig"), 128, {
    singleLine: true,
  });
  const secret = getPreferencesSigningSecret();

  if (sig && secret) {
    if (!verifyPreferencesSignature(rawEmail, lang, sig, secret)) {
      return htmlResponse(
        renderPreferencesHtml({
          mode: "error",
          email: "",
          lang,
          errorMessage:
            lang === "ES"
              ? "Este enlace de preferencia no es válido o ha caducado."
              : "This preference link is invalid or expired.",
        }),
        403,
      );
    }

    const rate = checkRateLimit(
      `preferences-get:${getClientIp(request)}`,
      PREFERENCES_RATE_LIMIT,
      PREFERENCES_RATE_WINDOW_MS,
    );
    if (!rate.ok) {
      return htmlResponse(
        renderPreferencesHtml({
          mode: "error",
          email: rawEmail,
          lang,
          errorMessage:
            lang === "ES"
              ? "Demasiadas solicitudes. Espera un momento antes de volver a intentarlo."
              : "Too many requests. Please wait a moment and try again.",
        }),
        429,
      );
    }

    const updated = await updateBrevoSubscriberLanguage(rawEmail, lang);
    if (!updated) {
      return htmlResponse(
        renderPreferencesHtml({
          mode: "error",
          email: rawEmail,
          lang,
          errorMessage:
            lang === "ES"
              ? "No pudimos actualizar tu preferencia en este momento."
              : "Unable to update language preference right now.",
        }),
        502,
      );
    }

    return htmlResponse(
      renderPreferencesHtml({
        mode: "updated",
        email: rawEmail,
        lang,
      }),
      200,
    );
  }

  return htmlResponse(
    renderPreferencesHtml({
      mode: "confirm",
      email: isValidEmail(rawEmail) ? rawEmail : "",
      lang,
    }),
    200,
  );
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  const accept = request.headers.get("accept")?.toLowerCase() ?? "";
  const isFormUrlEncoded = contentType.includes(
    "application/x-www-form-urlencoded",
  );
  const wantsHtml = isFormUrlEncoded && !accept.includes("application/json");

  let rawEmailValue: unknown;
  let rawLangValue: unknown;
  let companyWebsite: unknown;
  let turnstileToken: unknown;

  if (isFormUrlEncoded) {
    const bodyResult = await readBoundedBodyText(
      request,
      MAX_PREFERENCES_BODY_BYTES,
    );
    if (!bodyResult.ok) {
      return respondError({
        wantsHtml,
        status: bodyResult.status,
        error: bodyResult.error,
      });
    }

    const params = new URLSearchParams(bodyResult.text);
    rawEmailValue = params.get("email");
    rawLangValue = params.get("lang") ?? params.get("language");
    companyWebsite = params.get("companyWebsite");
    turnstileToken =
      params.get("turnstileToken") ?? params.get("cf-turnstile-response");
  } else {
    const jsonResult = await readJsonObject(
      request,
      MAX_PREFERENCES_BODY_BYTES,
    );
    if (!jsonResult.ok) {
      return respondError({
        wantsHtml,
        status: jsonResult.status,
        error: jsonResult.error,
      });
    }

    rawEmailValue = jsonResult.data.email;
    rawLangValue = jsonResult.data.lang ?? jsonResult.data.language;
    companyWebsite = jsonResult.data.companyWebsite;
    turnstileToken = jsonResult.data.turnstileToken;
  }

  const parsedLang = readTrimmedString(rawLangValue, 10, {
    singleLine: true,
  }).toUpperCase();
  const displayLang: PreferenceLang = parsedLang === "ES" ? "ES" : "EN";
  const email = readTrimmedString(rawEmailValue, 320, {
    singleLine: true,
  }).toLowerCase();

  const guard = await guardFormRequest(
    request,
    { companyWebsite, turnstileToken },
    {
      scope: "preferences",
      limit: PREFERENCES_RATE_LIMIT,
      windowMs: PREFERENCES_RATE_WINDOW_MS,
    },
  );
  if (!guard.ok) {
    return respondError({
      wantsHtml,
      status: guard.status,
      error: guard.error,
      email: isValidEmail(email) ? email : "",
      lang: displayLang,
    });
  }

  if (guard.honeypotTriggered) {
    if (wantsHtml) {
      return htmlResponse(
        renderPreferencesHtml({
          mode: "updated",
          email: isValidEmail(email) ? email : "",
          lang: displayLang,
        }),
        200,
      );
    }
    return NextResponse.json({ ok: true });
  }

  if (!isValidEmail(email)) {
    return respondError({
      wantsHtml,
      status: 400,
      error:
        displayLang === "ES"
          ? "Introduce un correo electrónico válido."
          : "Enter a valid email address.",
      lang: displayLang,
    });
  }

  if (parsedLang !== "EN" && parsedLang !== "ES") {
    return respondError({
      wantsHtml,
      status: 400,
      error: "Select a valid language preference (EN or ES).",
      email,
      lang: "EN",
    });
  }

  const lang: PreferenceLang = parsedLang;
  const updated = await updateBrevoSubscriberLanguage(email, lang);
  if (!updated) {
    return respondError({
      wantsHtml,
      status: 502,
      error:
        lang === "ES"
          ? "No pudimos actualizar tu preferencia en este momento."
          : "Unable to update language preference right now.",
      email,
      lang,
    });
  }

  if (wantsHtml) {
    return htmlResponse(
      renderPreferencesHtml({
        mode: "updated",
        email,
        lang,
      }),
      200,
    );
  }

  return NextResponse.json({ ok: true, language: lang });
}
