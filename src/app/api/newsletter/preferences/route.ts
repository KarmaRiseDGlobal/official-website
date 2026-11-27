import { createHmac } from "node:crypto";

import { NextResponse } from "next/server";

import { updateBrevoSubscriberLanguage } from "@/lib/brevo";
import { normalizeUtmToken } from "@/lib/email-analytics";
import {
  EMAIL_COLORS,
  EMAIL_FONT_SANS,
  EMAIL_FONT_SERIF,
} from "@/lib/email-layout";
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
type PreferenceAction = "language" | "stay";
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

function parsePreferenceAction(raw: unknown): PreferenceAction {
  return readTrimmedString(raw, 24, { singleLine: true }).toLowerCase() ===
    "stay"
    ? "stay"
    : "language";
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
  action: PreferenceAction;
  email: string;
  lang: PreferenceLang;
  campaign?: string;
  errorMessage?: string;
}): string {
  const isEs = options.lang === "ES";
  const isStay = options.action === "stay";
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
    if (isStay) {
      heading = isEs
        ? "¡Qué alegría que sigas con nosotros!"
        : "Glad you are staying with us!";
      body = hasValidEmail
        ? isEs
          ? `Hemos mantenido ${options.email} activo en Historias de KarmaRise en español. Te llegará nuestra próxima carta desde España y la India.`
          : `We have kept ${options.email} active on KarmaRise Stories in English. Look out for our next letter from Spain and India.`
        : isEs
          ? "Hemos confirmado tu suscripción a Historias de KarmaRise en español."
          : "We have confirmed your subscription to KarmaRise Stories in English.";
    } else {
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
    }
  } else if (options.mode === "error") {
    heading = isEs
      ? "No hemos podido guardar tu preferencia."
      : "We could not update your preference.";
    body =
      options.errorMessage?.trim() ||
      (isEs
        ? "Comprueba el correo electrónico e inténtalo de nuevo."
        : "Check your email address and try again.");
  } else if (isStay) {
    heading = isEs
      ? "Confirma que quieres seguir recibiendo las cartas"
      : "Confirm you want to keep receiving our letters";
    body = hasValidEmail
      ? isEs
        ? `Confirma debajo para mantener ${options.email} en Historias de KarmaRise en español y seguir recibiendo nuestras cartas cada dos semanas.`
        : `Confirm below to keep ${options.email} active on KarmaRise Stories in English and keep receiving our letters every two weeks.`
      : isEs
        ? "Escribe tu correo electrónico para seguir recibiendo Historias de KarmaRise en español."
        : "Enter your email address below to keep receiving KarmaRise Stories in English.";
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
  const submitLabel = isStay
    ? isEs
      ? "Seguir recibiendo las cartas"
      : "Keep sending the letters"
    : isEs
      ? "Confirmar español"
      : "Confirm English";
  const emailLabel = isEs ? "Correo electrónico" : "Email address";
  const emailPlaceholder = isEs ? "tu@empresa.com" : "you@company.com";
  const switchLabel = isEs
    ? "Prefiero leer en inglés (Switch to English)"
    : "Prefiero leer en español (Cambiar a español)";

  const emailFieldHtml = hasValidEmail
    ? `<input type="hidden" name="email" value="${escapeHtml(options.email)}" />`
    : `<div style="margin:0 0 18px;text-align:left;">
        <label for="pref-email" style="display:block;margin:0 0 6px;font-family:${EMAIL_FONT_SANS};font-size:13px;font-weight:600;color:${EMAIL_COLORS.forestDeep};">${escapeHtml(emailLabel)}</label>
        <input id="pref-email" type="email" name="email" required autocomplete="email" placeholder="${escapeHtml(emailPlaceholder)}" style="width:100%;box-sizing:border-box;min-height:48px;padding:12px 14px;border-radius:12px;border:1px solid #9A816F;background-color:#FFFDF8;font-family:${EMAIL_FONT_SANS};font-size:16px;color:${EMAIL_COLORS.forestDeep};" />
      </div>`;

  const turnstileHtml =
    hasTurnstile && turnstileSiteKey
      ? `<div class="cf-turnstile" data-sitekey="${escapeHtml(turnstileSiteKey)}" data-language="${isEs ? "es" : "en"}" style="margin:0 auto 20px;display:flex;justify-content:center;"></div>`
      : "";

  const actionFieldHtml = isStay
    ? `<input type="hidden" name="action" value="stay" />`
    : "";
  const campaignFieldHtml = options.campaign
    ? `<input type="hidden" name="campaign" value="${escapeHtml(options.campaign)}" />`
    : "";

  const formHtml =
    options.mode === "confirm"
      ? `<form method="POST" action="/api/newsletter/preferences" style="margin:0 0 22px;">
          ${emailFieldHtml}
          <input type="hidden" name="lang" value="${escapeHtml(options.lang)}" />
          ${actionFieldHtml}
          ${campaignFieldHtml}
          <div style="position:absolute;left:-9999px;opacity:0;height:0;overflow:hidden;" aria-hidden="true">
            <label>Website <input type="text" name="companyWebsite" tabindex="-1" autocomplete="off" /></label>
          </div>
          ${turnstileHtml}
          <button type="submit" class="kr-btn" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:14px 32px;background-color:${EMAIL_COLORS.buttonBg};color:${EMAIL_COLORS.buttonText};border:0;border-radius:999px;font-family:${EMAIL_FONT_SANS};font-size:14px;font-weight:600;letter-spacing:0.3px;cursor:pointer;">
            ${escapeHtml(submitLabel)}
          </button>
        </form>
        <p style="margin:0 0 14px;font-family:${EMAIL_FONT_SANS};font-size:13px;line-height:1.6;color:${EMAIL_COLORS.bodyMuted};">
          <a href="${escapeHtml(switchUrl)}" style="display:inline-block;padding:8px 4px;color:${EMAIL_COLORS.clayInk};font-weight:600;text-decoration:underline;">${escapeHtml(switchLabel)}</a>
        </p>
        <p style="margin:0;font-family:${EMAIL_FONT_SANS};font-size:13.5px;line-height:1.6;">
          <a href="${escapeHtml(storiesHref)}" style="display:inline-block;padding:8px 4px;color:${EMAIL_COLORS.forestDeep};font-weight:600;text-decoration:underline;">${escapeHtml(ctaLabel)}</a>
        </p>`
      : `<div style="margin-bottom:22px;">
          <a href="${escapeHtml(storiesHref)}" class="kr-btn" style="display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:14px 32px;background-color:${EMAIL_COLORS.buttonBg};color:${EMAIL_COLORS.buttonText};text-decoration:none;border-radius:999px;font-family:${EMAIL_FONT_SANS};font-size:14px;font-weight:600;letter-spacing:0.3px;">
            ${escapeHtml(ctaLabel)}
          </a>
        </div>
        ${
          options.mode === "updated" && hasValidEmail
            ? `<p style="margin:0;font-family:${EMAIL_FONT_SANS};font-size:13px;line-height:1.6;color:${EMAIL_COLORS.bodyMuted};">
                <a href="${escapeHtml(switchUrl)}" style="display:inline-block;padding:8px 4px;color:${EMAIL_COLORS.clayInk};font-weight:600;text-decoration:underline;">${escapeHtml(switchLabel)}</a>
              </p>`
            : ""
        }`;

  const turnstileScriptTag =
    options.mode === "confirm" && hasTurnstile
      ? `<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>`
      : "";

  const eyebrowRight = isStay
    ? isEs
      ? "Confirmar suscripción"
      : "Keep subscription active"
    : isEs
      ? "Preferencia de idioma"
      : "Language preference";

  return `<!DOCTYPE html>
<html lang="${isEs ? "es" : "en"}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${escapeHtml(heading)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root { color-scheme: light; }
    .kr-btn:hover { background-color: ${EMAIL_COLORS.clayInk} !important; }
    a:focus-visible, button:focus-visible, input:focus-visible {
      outline: 2px solid #44693D;
      outline-offset: 2px;
    }
    @media (max-width: 560px) {
      body { padding: 20px 12px !important; }
      main { padding: 28px 20px !important; }
      h1 { font-size: 24px !important; }
    }
  </style>
  ${turnstileScriptTag}
</head>
<body style="margin:0;padding:40px 16px;background-color:${EMAIL_COLORS.outerBg};font-family:${EMAIL_FONT_SERIF};color:${EMAIL_COLORS.forestDeep};display:flex;align-items:center;justify-content:center;min-height:100svh;box-sizing:border-box;">
  <main style="max-width:520px;width:100%;box-sizing:border-box;background-color:${EMAIL_COLORS.paper};border:1px solid ${EMAIL_COLORS.paperBorder};border-radius:20px;padding:40px 36px;text-align:center;">
    <p style="margin:0 0 12px;font-family:${EMAIL_FONT_SANS};font-size:13px;letter-spacing:1.2px;text-transform:uppercase;color:${EMAIL_COLORS.clayInk};font-weight:600;">
      ${isEs ? "Historias de KarmaRise" : "KarmaRise Stories"} &middot; ${eyebrowRight}
    </p>
    <h1 style="margin:0 0 16px;font-family:${EMAIL_FONT_SERIF};font-size:28px;line-height:1.22;font-weight:400;font-style:italic;color:${EMAIL_COLORS.forestDeep};">
      ${escapeHtml(heading)}
    </h1>
    <p style="margin:0 0 28px;font-family:${EMAIL_FONT_SERIF};font-size:17px;line-height:1.7;color:${EMAIL_COLORS.bodyInk};">
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
  action?: PreferenceAction;
  email?: string;
  lang?: PreferenceLang;
}): NextResponse {
  if (options.wantsHtml) {
    return htmlResponse(
      renderPreferencesHtml({
        mode: "error",
        action: options.action ?? "language",
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
  const action = parsePreferenceAction(url.searchParams.get("action"));
  const campaign =
    normalizeUtmToken(url.searchParams.get("utm_campaign") ?? "", 64) ||
    undefined;
  const sig = readTrimmedString(url.searchParams.get("sig"), 128, {
    singleLine: true,
  });
  const secret = getPreferencesSigningSecret();

  if (sig && secret) {
    if (!verifyPreferencesSignature(rawEmail, lang, sig, secret)) {
      return htmlResponse(
        renderPreferencesHtml({
          mode: "error",
          action,
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
          action,
          email: rawEmail,
          lang,
          errorMessage:
            lang === "ES"
              ? "Demasiadas solicitudes. Espera un momento antes de volver a intentarlo."
              : "Too many requests. Wait a moment and try again.",
        }),
        429,
      );
    }

    const updated = await updateBrevoSubscriberLanguage(
      rawEmail,
      lang,
      action === "stay"
        ? { markReengaged: true, campaign }
        : campaign
          ? { campaign }
          : undefined,
    );
    if (!updated) {
      return htmlResponse(
        renderPreferencesHtml({
          mode: "error",
          action,
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
        action,
        email: rawEmail,
        lang,
      }),
      200,
    );
  }

  return htmlResponse(
    renderPreferencesHtml({
      mode: "confirm",
      action,
      email: isValidEmail(rawEmail) ? rawEmail : "",
      lang,
      campaign,
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
  let rawActionValue: unknown;
  let rawCampaignValue: unknown;
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
    rawActionValue = params.get("action");
    rawCampaignValue = params.get("campaign");
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
    rawActionValue = jsonResult.data.action;
    rawCampaignValue = jsonResult.data.campaign;
    companyWebsite = jsonResult.data.companyWebsite;
    turnstileToken = jsonResult.data.turnstileToken;
  }

  const parsedLang = readTrimmedString(rawLangValue, 10, {
    singleLine: true,
  }).toUpperCase();
  const displayLang: PreferenceLang = parsedLang === "ES" ? "ES" : "EN";
  const action = parsePreferenceAction(rawActionValue);
  const campaign =
    normalizeUtmToken(
      readTrimmedString(rawCampaignValue, 64, { singleLine: true }),
      64,
    ) || undefined;
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
    const localizedGuardError =
      displayLang === "ES"
        ? guard.status === 429
          ? "Demasiadas solicitudes. Espera un momento antes de volver a intentarlo."
          : guard.status === 400
            ? "Completa la verificación de seguridad antes de confirmar."
            : "No pudimos completar la verificación de seguridad."
        : guard.error;
    return respondError({
      wantsHtml,
      status: guard.status,
      error: localizedGuardError,
      action,
      email: isValidEmail(email) ? email : "",
      lang: displayLang,
    });
  }

  if (guard.honeypotTriggered) {
    if (wantsHtml) {
      return htmlResponse(
        renderPreferencesHtml({
          mode: "updated",
          action,
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
      action,
      lang: displayLang,
    });
  }

  if (parsedLang !== "EN" && parsedLang !== "ES") {
    return respondError({
      wantsHtml,
      status: 400,
      error: "Select a valid language preference (EN or ES).",
      action,
      email,
      lang: "EN",
    });
  }

  const lang: PreferenceLang = parsedLang;
  const updated = await updateBrevoSubscriberLanguage(
    email,
    lang,
    action === "stay"
      ? { markReengaged: true, campaign }
      : campaign
        ? { campaign }
        : undefined,
  );
  if (!updated) {
    return respondError({
      wantsHtml,
      status: 502,
      error:
        lang === "ES"
          ? "No pudimos actualizar tu preferencia en este momento."
          : "Unable to update language preference right now.",
      action,
      email,
      lang,
    });
  }

  if (wantsHtml) {
    return htmlResponse(
      renderPreferencesHtml({
        mode: "updated",
        action,
        email,
        lang,
      }),
      200,
    );
  }

  return NextResponse.json({ ok: true, language: lang });
}
