import "server-only";

import { sanitizeHeaderValue } from "@/lib/security";

export { isValidEmail, readTrimmedString } from "@/lib/validation";

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_FROM_EMAIL = "KarmaRise D Global <onboarding@resend.dev>";
const DEFAULT_TO_EMAIL = "hola@karmarisedglobal.com";

export interface ResendAttachment {
  filename: string;
  content: string;
  contentType?: string;
}

export interface SendResendEmailParams {
  to?: string | string[];
  from?: string;
  replyTo?: string;
  subject: string;
  text: string;
  html?: string;
  attachments?: ResendAttachment[];
}

export type SendResendEmailResult =
  { ok: true } | { ok: false; error: string; status: number };

function resolveFromEmail(explicitFrom?: string): string | null {
  const rawFrom = sanitizeHeaderValue(
    explicitFrom?.trim() || process.env.RESEND_FROM_EMAIL?.trim() || "",
  );

  if (process.env.NODE_ENV === "production") {
    if (!rawFrom || rawFrom.toLowerCase().includes("onboarding@resend.dev")) {
      return null;
    }
    return rawFrom;
  }

  return rawFrom || DEFAULT_FROM_EMAIL;
}

/** Sends a transactional email via the Resend HTTP API. */
export async function sendResendEmail({
  to,
  from,
  replyTo,
  subject,
  text,
  html,
  attachments,
}: SendResendEmailParams): Promise<SendResendEmailResult> {
  const rawRecipients =
    to === undefined
      ? [process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO_EMAIL]
      : Array.isArray(to)
        ? to
        : [to];

  const recipients = rawRecipients
    .map((entry) => sanitizeHeaderValue(entry))
    .filter((entry) => entry.length > 0);
  const cleanSubject = sanitizeHeaderValue(subject);
  const cleanText = text.trim();

  if (recipients.length === 0 || !cleanSubject || !cleanText) {
    return {
      ok: false,
      error: "Email recipient, subject, and body are required.",
      status: 400,
    };
  }

  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      error: "Email delivery is not configured yet.",
      status: 500,
    };
  }

  const resolvedFrom = resolveFromEmail(from);
  if (!resolvedFrom) {
    return {
      ok: false,
      error: "Sender email address is not configured for production.",
      status: 500,
    };
  }

  const cleanReplyTo = replyTo ? sanitizeHeaderValue(replyTo) : "";
  const cleanHtml = html?.trim() ?? "";
  const cleanAttachments = (attachments ?? [])
    .map((attachment) => {
      const filename = sanitizeHeaderValue(attachment.filename);
      const content = attachment.content.trim();
      const contentType = attachment.contentType
        ? sanitizeHeaderValue(attachment.contentType)
        : "";
      if (!filename || !content) {
        return null;
      }
      return contentType
        ? { filename, content, content_type: contentType }
        : { filename, content };
    })
    .filter(
      (
        item,
      ): item is
        | { filename: string; content: string; content_type: string }
        | { filename: string; content: string } => item !== null,
    );

  const payload: Record<string, unknown> = {
    from: resolvedFrom,
    to: recipients,
    subject: cleanSubject,
    text: cleanText,
  };

  if (cleanReplyTo) {
    payload.reply_to = cleanReplyTo;
  }
  if (cleanHtml) {
    payload.html = cleanHtml;
  }
  if (cleanAttachments.length > 0) {
    payload.attachments = cleanAttachments;
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("Resend API error:", response.status, errorBody);
      return {
        ok: false,
        error:
          "Unable to deliver email right now. Please try again or email us directly.",
        status: 502,
      };
    }

    return { ok: true };
  } catch (error) {
    console.error("Resend request failed:", error);
    return {
      ok: false,
      error:
        "Network error while sending email. Please try again or email us directly.",
      status: 502,
    };
  }
}
