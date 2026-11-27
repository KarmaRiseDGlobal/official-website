import { NextResponse } from "next/server";

import { CONTACT_TOPICS } from "@/data/conversion-content";
import { trackBrevoEvent } from "@/lib/brevo";
import {
  attributionToEventProperties,
  EMAIL_ANALYTICS_EVENTS,
  extractRequestAttribution,
  formatAttributionLine,
} from "@/lib/email-analytics";
import { sendResendEmail } from "@/lib/resend";
import { escapeHtml, guardFormRequest, readJsonObject } from "@/lib/security";
import { buildContactConfirmationEmail } from "@/lib/transactional-emails";
import type { SiteLanguage } from "@/lib/urls";
import { isValidEmail, readTrimmedString } from "@/lib/validation";

interface ContactTopicConfig {
  resolveRecipient: () => string;
  labels: Record<SiteLanguage, string>;
}

const CONTACT_TOPIC_ROUTES = new Map<string, ContactTopicConfig>(
  CONTACT_TOPICS.map((topic) => [
    topic.value,
    {
      resolveRecipient: () =>
        process.env[topic.envOverrideKey]?.trim() || topic.directEmail,
      labels: topic.emailLabels,
    },
  ]),
);

function normalizeLanguage(rawLanguage: unknown): SiteLanguage {
  const normalized = readTrimmedString(rawLanguage, 24, {
    singleLine: true,
  }).toLowerCase();

  if (
    normalized === "es" ||
    normalized.startsWith("es-") ||
    normalized === "spanish" ||
    normalized === "español" ||
    normalized === "espanol"
  ) {
    return "es";
  }

  return "en";
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
    return "Completa la verificación de seguridad antes de enviar.";
  }
  return "No pudimos completar la verificación de seguridad. Inténtalo de nuevo.";
}

export async function POST(request: Request) {
  const parsed = await readJsonObject(request, 32 * 1024);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.error },
      { status: parsed.status },
    );
  }

  const payload = parsed.data;
  const language = normalizeLanguage(payload.language);
  const isEs = language === "es";

  const guard = await guardFormRequest(
    request,
    {
      companyWebsite: payload.companyWebsite,
      turnstileToken: payload.turnstileToken,
    },
    {
      scope: "contact",
      limit: 10,
      windowMs: 10 * 60 * 1000,
    },
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

  const name = readTrimmedString(payload.name, 160, { singleLine: true });
  const email = readTrimmedString(payload.email, 320, { singleLine: true });
  const topic = readTrimmedString(payload.topic, 160, { singleLine: true });
  const note = readTrimmedString(payload.note, 5000);
  const { attribution, referralSource, referralCode, attributionConsent } =
    extractRequestAttribution(payload);

  if (!name || !isValidEmail(email) || !topic || !note) {
    return NextResponse.json(
      {
        ok: false,
        error: isEs
          ? "Completa tu nombre, un correo electrónico válido, el asunto y tu mensaje antes de enviar."
          : "Complete your name, valid email, topic, and message before sending.",
      },
      { status: 400 },
    );
  }

  const topicConfig = CONTACT_TOPIC_ROUTES.get(topic);
  if (!topicConfig) {
    return NextResponse.json(
      {
        ok: false,
        error: isEs
          ? "Selecciona un asunto válido antes de enviar."
          : "Select a valid topic before sending.",
      },
      { status: 400 },
    );
  }

  const routedDepartmentEmail = topicConfig.resolveRecipient();
  const attributionLine = formatAttributionLine(attribution);

  const internalText = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topic}`,
    `Language: ${language.toUpperCase()}`,
    `Routed to: ${routedDepartmentEmail}`,
    referralSource ? `How did you hear about us: ${referralSource}` : null,
    referralCode ? `Referral code: ${referralCode}` : null,
    attributionLine ? `Attribution: ${attributionLine}` : null,
    "",
    note,
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const internalHtml = `<!doctype html>
<html lang="en">
  <body style="font-family:Arial,sans-serif;color:#182D20;line-height:1.6;">
    <h2 style="margin:0 0 12px;color:#182D20;">New contact message</h2>
    <p style="margin:0 0 6px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p style="margin:0 0 6px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p style="margin:0 0 6px;"><strong>Topic:</strong> ${escapeHtml(topic)}</p>
    <p style="margin:0 0 6px;"><strong>Language:</strong> ${escapeHtml(language.toUpperCase())}</p>
    <p style="margin:0 0 6px;"><strong>Routed to:</strong> ${escapeHtml(routedDepartmentEmail)}</p>
    ${referralSource ? `<p style="margin:0 0 6px;"><strong>How did you hear about us:</strong> ${escapeHtml(referralSource)}</p>` : ""}
    ${referralCode ? `<p style="margin:0 0 6px;"><strong>Referral code:</strong> ${escapeHtml(referralCode)}</p>` : ""}
    ${attributionLine ? `<p style="margin:0 0 16px;color:#584B44;"><strong>Attribution:</strong> ${escapeHtml(attributionLine)}</p>` : ""}
    <div style="padding:14px;background:#F2ECDF;border-left:3px solid #833E28;">
      ${escapeHtml(note).replaceAll("\n", "<br />")}
    </div>
  </body>
</html>`;

  const internalResult = await sendResendEmail({
    to: routedDepartmentEmail,
    replyTo: email,
    subject: `${topic} · ${name}`,
    text: internalText,
    html: internalHtml,
  });

  if (!internalResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: isEs
          ? "No pudimos enviar tu mensaje ahora mismo. Inténtalo de nuevo o escríbenos directamente por correo."
          : internalResult.error,
      },
      { status: internalResult.status },
    );
  }

  const confirmation = buildContactConfirmationEmail({
    language,
    name,
    topicValue: topic,
    topicLabel: topicConfig.labels[language],
    note,
    routedDepartmentEmail,
  });

  const confirmationResult = await sendResendEmail({
    to: email,
    replyTo: routedDepartmentEmail,
    subject: confirmation.subject,
    text: confirmation.text,
    html: confirmation.html,
  });

  if (process.env.BREVO_API_KEY?.trim() && attributionConsent === true) {
    await trackBrevoEvent({
      email,
      eventName: EMAIL_ANALYTICS_EVENTS.contactSubmitted,
      contactProperties: {
        FIRSTNAME: name,
        ...(referralCode ? { REFERRAL_CODE: referralCode } : {}),
        ...(referralSource ? { REFERRAL_SOURCE: referralSource } : {}),
      },
      eventProperties: {
        language,
        topic,
        ...attributionToEventProperties(attribution),
      },
    });
  }

  if (!confirmationResult.ok) {
    console.error(
      "Contact confirmation email failed:",
      confirmationResult.error,
    );
    return NextResponse.json({ ok: true, confirmationSent: false });
  }

  return NextResponse.json({ ok: true, confirmationSent: true });
}
