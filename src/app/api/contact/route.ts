import { NextResponse } from "next/server";

import type { SiteLanguage } from "@/context/language-context";
import { sendResendEmail } from "@/lib/resend";
import { escapeHtml, guardFormRequest, readJsonObject } from "@/lib/security";
import { isValidEmail, readTrimmedString } from "@/lib/validation";

interface ContactTopicConfig {
  resolveRecipient: () => string;
  labels: Record<SiteLanguage, string>;
}

const CONTACT_TOPIC_ROUTES = new Map<string, ContactTopicConfig>([
  [
    "Manufacturing Partner introduction",
    {
      resolveRecipient: () =>
        process.env.CONTACT_PARTNERS_EMAIL?.trim() ||
        "partners@karmarisedglobal.com",
      labels: {
        en: "Manufacturing Partner introduction",
        es: "Presentación de taller o socio de fabricación",
      },
    },
  ],
  [
    "Stories and editorial",
    {
      resolveRecipient: () =>
        process.env.CONTACT_STORIES_EMAIL?.trim() ||
        "stories@karmarisedglobal.com",
      labels: {
        en: "Stories and editorial",
        es: "Historias y prensa",
      },
    },
  ],
  [
    "Almarise",
    {
      resolveRecipient: () =>
        process.env.CONTACT_STORIES_EMAIL?.trim() ||
        "stories@karmarisedglobal.com",
      labels: {
        en: "Almarise",
        es: "Almarise",
      },
    },
  ],
  [
    "General enquiry",
    {
      resolveRecipient: () =>
        process.env.CONTACT_INQUIRY_EMAIL?.trim() ||
        "inquiry@karmarisedglobal.com",
      labels: {
        en: "General enquiry",
        es: "Consulta general",
      },
    },
  ],
  [
    "Women's Training Initiative",
    {
      resolveRecipient: () =>
        process.env.CONTACT_INQUIRY_EMAIL?.trim() ||
        "inquiry@karmarisedglobal.com",
      labels: {
        en: "Women's Training Initiative",
        es: "Iniciativa de formación para mujeres",
      },
    },
  ],
]);

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

function buildConfirmationEmail({
  language,
  name,
  topicLabel,
  note,
  routedDepartmentEmail,
}: {
  language: SiteLanguage;
  name: string;
  topicLabel: string;
  note: string;
  routedDepartmentEmail: string;
}): { subject: string; text: string; html: string } {
  const safeName = escapeHtml(name);
  const safeTopic = escapeHtml(topicLabel);
  const safeDepartment = escapeHtml(routedDepartmentEmail);
  const safeNoteHtml = escapeHtml(note).replaceAll("\n", "<br />");

  if (language === "es") {
    const subject = "Hemos recibido tu mensaje · KarmaRise D Global";
    const text = [
      `Hola ${name},`,
      "",
      `Gracias por escribirnos sobre "${topicLabel}". Hemos dirigido tu mensaje a nuestro equipo en ${routedDepartmentEmail}.`,
      "",
      "Alma o Shirish lo revisarán y te responderán directamente a este correo. Si mientras tanto quieres añadir algún detalle, puedes responder sin problema a este mismo mensaje.",
      "",
      `Asunto: ${topicLabel}`,
      "Tu mensaje:",
      note,
      "",
      "Un saludo cercano,",
      "Alma y Shirish",
      "KarmaRise D Global · España e India",
    ].join("\n");

    const html = `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background-color:#F2ECDF;color:#182D20;font-family:Georgia, 'Times New Roman', serif;">
    <div style="max-width:600px;margin:0 auto;background-color:#FFFFFF;border:1px solid #CDBB9C;border-radius:12px;padding:32px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#833E28;font-family:Arial,sans-serif;font-weight:700;">
        KarmaRise D Global · España e India
      </p>
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#182D20;font-weight:500;">
        Gracias por escribirnos, ${safeName}.
      </h1>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#182D20;">
        Hemos recibido tu mensaje sobre <strong>${safeTopic}</strong> y lo hemos dirigido a nuestro equipo en <a href="mailto:${safeDepartment}" style="color:#833E28;">${safeDepartment}</a>.
      </p>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#182D20;">
        Alma o Shirish lo revisarán y te responderán directamente a este correo. Si quieres añadir algo más mientras tanto, puedes responder a este mismo mensaje.
      </p>
      <div style="background-color:#F2ECDF;border-left:3px solid #833E28;padding:16px 18px;border-radius:6px;margin:0 0 22px;">
        <p style="margin:0 0 8px;font-size:13px;font-family:Arial,sans-serif;color:#833E28;font-weight:700;">
          Resumen de tu consulta
        </p>
        <p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#182D20;">
          <strong>Asunto:</strong> ${safeTopic}
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#182D20;">
          ${safeNoteHtml}
        </p>
      </div>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#182D20;">
        Un saludo cercano,<br />
        <strong>Alma y Shirish</strong><br />
        <span style="color:#833E28;font-size:13px;">KarmaRise D Global · España e India</span>
      </p>
    </div>
  </body>
</html>`;

    return { subject, text, html };
  }

  const subject = "We received your message · KarmaRise D Global";
  const text = [
    `Hello ${name},`,
    "",
    `Thank you for writing to us about "${topicLabel}". We have routed your message to ${routedDepartmentEmail}.`,
    "",
    "Alma or Shirish will review it and reply directly to your email address. If you want to add any further detail in the meantime, simply reply to this message.",
    "",
    `Topic: ${topicLabel}`,
    "Your message:",
    note,
    "",
    "Warm regards,",
    "Alma and Shirish",
    "KarmaRise D Global · India & Spain",
  ].join("\n");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background-color:#F2ECDF;color:#182D20;font-family:Georgia, 'Times New Roman', serif;">
    <div style="max-width:600px;margin:0 auto;background-color:#FFFFFF;border:1px solid #CDBB9C;border-radius:12px;padding:32px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#833E28;font-family:Arial,sans-serif;font-weight:700;">
        KarmaRise D Global · India &amp; Spain
      </p>
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#182D20;font-weight:500;">
        Thank you for writing, ${safeName}.
      </h1>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#182D20;">
        We have received your message on <strong>${safeTopic}</strong> and routed it to <a href="mailto:${safeDepartment}" style="color:#833E28;">${safeDepartment}</a>.
      </p>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#182D20;">
        Alma or Shirish will review your note and reply directly to your email address. If you would like to add anything while we review it, feel free to reply to this email.
      </p>
      <div style="background-color:#F2ECDF;border-left:3px solid #833E28;padding:16px 18px;border-radius:6px;margin:0 0 22px;">
        <p style="margin:0 0 8px;font-size:13px;font-family:Arial,sans-serif;color:#833E28;font-weight:700;">
          Summary of your message
        </p>
        <p style="margin:0 0 8px;font-size:14px;line-height:1.5;color:#182D20;">
          <strong>Topic:</strong> ${safeTopic}
        </p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#182D20;">
          ${safeNoteHtml}
        </p>
      </div>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#182D20;">
        Warm regards,<br />
        <strong>Alma and Shirish</strong><br />
        <span style="color:#833E28;font-size:13px;">KarmaRise D Global · India &amp; Spain</span>
      </p>
    </div>
  </body>
</html>`;

  return { subject, text, html };
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
      { ok: false, error: guard.error },
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

  if (!name || !isValidEmail(email) || !topic || !note) {
    return NextResponse.json(
      {
        ok: false,
        error:
          language === "es"
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
        error:
          language === "es"
            ? "Selecciona un asunto válido antes de enviar."
            : "Select a valid topic before sending.",
      },
      { status: 400 },
    );
  }

  const routedDepartmentEmail = topicConfig.resolveRecipient();

  const internalText = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Topic: ${topic}`,
    `Language: ${language.toUpperCase()}`,
    `Routed to: ${routedDepartmentEmail}`,
    "",
    note,
  ].join("\n");

  const internalHtml = `<!doctype html>
<html lang="en">
  <body style="font-family:Arial,sans-serif;color:#182D20;line-height:1.6;">
    <h2 style="margin:0 0 12px;color:#182D20;">New contact message</h2>
    <p style="margin:0 0 6px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p style="margin:0 0 6px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p style="margin:0 0 6px;"><strong>Topic:</strong> ${escapeHtml(topic)}</p>
    <p style="margin:0 0 6px;"><strong>Language:</strong> ${escapeHtml(language.toUpperCase())}</p>
    <p style="margin:0 0 16px;"><strong>Routed to:</strong> ${escapeHtml(routedDepartmentEmail)}</p>
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
      { ok: false, error: internalResult.error },
      { status: internalResult.status },
    );
  }

  const confirmation = buildConfirmationEmail({
    language,
    name,
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

  if (!confirmationResult.ok) {
    console.error(
      "Contact confirmation email failed:",
      confirmationResult.error,
    );
    return NextResponse.json({ ok: true, confirmationSent: false });
  }

  return NextResponse.json({ ok: true, confirmationSent: true });
}
