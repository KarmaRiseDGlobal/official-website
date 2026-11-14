const BREVO_CONTACTS_API_URL = "https://api.brevo.com/v3/contacts";

type BrevoSubscribeResult =
  { ok: true } | { ok: false; error: string; status: number };

/** Adds or updates a newsletter subscriber in the configured Brevo list. */
export async function subscribeToBrevoNewsletter(
  email: string,
): Promise<BrevoSubscribeResult> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const listIdRaw = process.env.BREVO_LIST_ID?.trim();
  const listId = listIdRaw ? Number.parseInt(listIdRaw, 10) : Number.NaN;

  if (!apiKey || !Number.isFinite(listId) || listId <= 0) {
    return {
      ok: false,
      error: "Newsletter subscription is not configured yet.",
      status: 500,
    };
  }

  try {
    const response = await fetch(BREVO_CONTACTS_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        listIds: [listId],
        updateEnabled: true,
      }),
    });

    if (response.ok) {
      return { ok: true };
    }

    const errorBody = await response.text().catch(() => "");
    console.error("Brevo API error:", response.status, errorBody);

    return {
      ok: false,
      error:
        "Unable to subscribe right now. Please try again or write to hola@karmarisedglobal.com.",
      status: 502,
    };
  } catch (error) {
    console.error("Brevo request failed:", error);
    return {
      ok: false,
      error: "Network error while subscribing. Please try again shortly.",
      status: 502,
    };
  }
}
