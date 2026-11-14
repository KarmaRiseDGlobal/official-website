export { isValidEmail, readTrimmedString } from "@/lib/validation";

const RESEND_API_URL = "https://api.resend.com/emails";
const DEFAULT_FROM_EMAIL = "KarmaRise D Global <onboarding@resend.dev>";
const DEFAULT_TO_EMAIL = "hola@karmarisedglobal.com";

interface SendResendEmailParams {
  subject: string;
  text: string;
  replyTo: string;
}

type SendResendEmailResult =
  { ok: true } | { ok: false; error: string; status: number };

/** Sends a plain-text notification email via the Resend HTTP API. */
export async function sendResendEmail({
  subject,
  text,
  replyTo,
}: SendResendEmailParams): Promise<SendResendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    return {
      ok: false,
      error: "Email delivery is not configured yet.",
      status: 500,
    };
  }

  const from = process.env.RESEND_FROM_EMAIL?.trim() || DEFAULT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL?.trim() || DEFAULT_TO_EMAIL;

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: replyTo,
        subject,
        text,
      }),
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
