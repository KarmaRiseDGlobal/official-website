const BREVO_CONTACTS_API_URL = "https://api.brevo.com/v3/contacts";
const BREVO_SMTP_EMAIL_API_URL = "https://api.brevo.com/v3/smtp/email";

export interface BrevoSubscriberInput {
  email: string;
  firstName?: string;
  language?: "EN" | "ES";
  country?: string;
  interest?: string;
  source?: string;
}

type BrevoSubscribeResult =
  | { ok: true; welcomeSent: boolean; language: "EN" | "ES" }
  | { ok: false; error: string; status: number };

const SPANISH_SPEAKING_COUNTRIES = new Set([
  "ES",
  "MX",
  "AR",
  "CO",
  "CL",
  "PE",
  "UY",
  "PY",
  "BO",
  "EC",
  "VE",
  "CR",
  "PA",
  "DO",
  "GT",
  "HN",
  "SV",
  "NI",
  "PR",
  "GQ",
]);

const COUNTRY_NAMES: Record<string, string> = {
  ES: "Spain",
  IN: "India",
  MX: "Mexico",
  AR: "Argentina",
  CO: "Colombia",
  CL: "Chile",
  PE: "Peru",
  UY: "Uruguay",
  PT: "Portugal",
  FR: "France",
  DE: "Germany",
  IT: "Italy",
  GB: "United Kingdom",
  US: "United States",
};

function parsePositiveInt(raw: string | undefined): number | null {
  if (!raw) return null;
  const parsed = Number.parseInt(raw.trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/**
 * Resolves the subscriber's language ("EN" | "ES") using explicit choice,
 * browser locale, Accept-Language header, and Cloudflare cf-ipcountry header.
 */
export function resolveSubscriberLanguage(options: {
  explicitLanguage?: string;
  browserLocale?: string;
  acceptLanguageHeader?: string | null;
  cfIpCountryHeader?: string | null;
}): "EN" | "ES" {
  const explicit = options.explicitLanguage?.trim().toUpperCase();
  if (explicit === "ES" || explicit === "EN") {
    return explicit;
  }

  const browser = options.browserLocale?.trim().toLowerCase() ?? "";
  if (browser.startsWith("es")) {
    return "ES";
  }

  const countryCode = options.cfIpCountryHeader?.trim().toUpperCase() ?? "";
  if (SPANISH_SPEAKING_COUNTRIES.has(countryCode)) {
    return "ES";
  }

  const acceptLang = options.acceptLanguageHeader?.trim().toLowerCase() ?? "";
  if (acceptLang.startsWith("es")) {
    return "ES";
  }

  return "EN";
}

export function resolveCountryName(
  cfIpCountryHeader: string | null | undefined,
): string | undefined {
  const code = cfIpCountryHeader?.trim().toUpperCase();
  if (!code || code === "XX" || code === "T1") {
    return undefined;
  }
  return COUNTRY_NAMES[code] || code;
}

/**
 * Checks whether the contact is already subscribed to the master list in Brevo
 * so repeat form submissions do not trigger duplicate welcome emails.
 */
async function isAlreadyInMasterList(
  apiKey: string,
  email: string,
  masterListId: number,
): Promise<boolean> {
  try {
    const response = await fetch(
      `${BREVO_CONTACTS_API_URL}/${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "api-key": apiKey,
          Accept: "application/json",
        },
      },
    );

    if (!response.ok) {
      return false;
    }

    const data = (await response.json()) as {
      listIds?: number[];
      emailBlacklisted?: boolean;
    };

    if (data.emailBlacklisted) {
      return false;
    }

    return Array.isArray(data.listIds) && data.listIds.includes(masterListId);
  } catch {
    return false;
  }
}

/**
 * Triggers the language-matched Welcome Email template in Brevo (Template #3 for EN, Template #4 for ES).
 */
async function sendBrevoWelcomeEmail(options: {
  apiKey: string;
  email: string;
  firstName?: string;
  language: "EN" | "ES";
}): Promise<boolean> {
  const sendWelcomeFlag = process.env.BREVO_SEND_WELCOME_EMAIL?.trim();
  if (sendWelcomeFlag && sendWelcomeFlag.toLowerCase() === "false") {
    return false;
  }

  const templateIdEn =
    parsePositiveInt(process.env.BREVO_WELCOME_TEMPLATE_ID_EN) ?? 3;
  const templateIdEs =
    parsePositiveInt(process.env.BREVO_WELCOME_TEMPLATE_ID_ES) ?? 4;
  const templateId = options.language === "ES" ? templateIdEs : templateIdEn;

  const senderName =
    process.env.BREVO_SENDER_NAME?.trim() || "Alma & Shirish · KarmaRise";
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() || "stories@karmarisedglobal.com";
  const replyToEmail = process.env.BREVO_REPLY_TO_EMAIL?.trim() || senderEmail;

  try {
    const response = await fetch(BREVO_SMTP_EMAIL_API_URL, {
      method: "POST",
      headers: {
        "api-key": options.apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        templateId,
        sender: {
          name: senderName,
          email: senderEmail,
        },
        replyTo: {
          name: senderName,
          email: replyToEmail,
        },
        to: [
          {
            email: options.email,
            ...(options.firstName ? { name: options.firstName } : {}),
          },
        ],
        params: {
          FIRSTNAME:
            options.firstName || (options.language === "ES" ? "" : "there"),
          LANGUAGE: options.language,
          EMAIL: options.email,
        },
        tags: [
          "welcome-automation",
          options.language === "ES" ? "welcome-es" : "welcome-en",
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(
        "Brevo welcome email send failed:",
        response.status,
        errorBody,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error("Brevo welcome email request error:", error);
    return false;
  }
}

/**
 * Adds or updates a newsletter subscriber in Brevo with language and consent attributes,
 * and triggers the automated welcome email in English or Spanish for new subscribers.
 */
export async function subscribeToBrevoNewsletter(
  input: string | BrevoSubscriberInput,
): Promise<BrevoSubscribeResult> {
  const subscriber: BrevoSubscriberInput =
    typeof input === "string" ? { email: input } : input;

  const apiKey = process.env.BREVO_API_KEY?.trim();
  const masterListId = parsePositiveInt(process.env.BREVO_LIST_ID);
  const enListId = parsePositiveInt(process.env.BREVO_LIST_ID_EN);
  const esListId = parsePositiveInt(process.env.BREVO_LIST_ID_ES);

  if (!apiKey || !masterListId) {
    return {
      ok: false,
      error: "Newsletter subscription is not configured yet.",
      status: 500,
    };
  }

  const language = subscriber.language === "ES" ? "ES" : "EN";
  const listIds = new Set<number>([masterListId]);
  if (language === "EN" && enListId) {
    listIds.add(enListId);
  }
  if (language === "ES" && esListId) {
    listIds.add(esListId);
  }

  const removeListIds: number[] = [];
  if (language === "EN" && esListId) {
    removeListIds.push(esListId);
  }
  if (language === "ES" && enListId) {
    removeListIds.push(enListId);
  }

  const attributes: Record<string, string> = {
    LANGUAGE: language,
    CUSTOMER_TYPE: "Subscriber",
    CONSENT_STATUS: "Yes",
    CONSENT_DATE: new Date().toISOString(),
    SOURCE: subscriber.source || "Website",
    INTEREST: subscriber.interest || "KarmaRise Stories",
  };

  if (subscriber.firstName) {
    attributes.FIRSTNAME = subscriber.firstName;
  }
  if (subscriber.country) {
    attributes.COUNTRY = subscriber.country;
  }

  try {
    const alreadySubscribed = await isAlreadyInMasterList(
      apiKey,
      subscriber.email,
      masterListId,
    );

    const response = await fetch(BREVO_CONTACTS_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        email: subscriber.email,
        attributes,
        listIds: Array.from(listIds),
        ...(removeListIds.length > 0 ? { unlinkListIds: removeListIds } : {}),
        updateEnabled: true,
        emailBlacklisted: false,
      }),
    });

    let contactSaved = response.ok;

    if (!contactSaved && response.status === 400) {
      const fallbackAttributes: Record<string, string> = {};
      if (subscriber.firstName) {
        fallbackAttributes.FIRSTNAME = subscriber.firstName;
      }

      const fallbackResponse = await fetch(BREVO_CONTACTS_API_URL, {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: subscriber.email,
          ...(Object.keys(fallbackAttributes).length > 0
            ? { attributes: fallbackAttributes }
            : {}),
          listIds: Array.from(listIds),
          updateEnabled: true,
        }),
      });

      contactSaved = fallbackResponse.ok;
    }

    if (!contactSaved) {
      const errorBody = await response.text().catch(() => "");
      console.error("Brevo API error:", response.status, errorBody);

      return {
        ok: false,
        error:
          "Unable to subscribe right now. Please try again or write to hola@karmarisedglobal.com.",
        status: 502,
      };
    }

    let welcomeSent = false;
    if (!alreadySubscribed) {
      welcomeSent = await sendBrevoWelcomeEmail({
        apiKey,
        email: subscriber.email,
        firstName: subscriber.firstName,
        language,
      });
    }

    return { ok: true, welcomeSent, language };
  } catch (error) {
    console.error("Brevo request failed:", error);
    return {
      ok: false,
      error: "Network error while subscribing. Please try again shortly.",
      status: 502,
    };
  }
}

/**
 * Updates an existing subscriber's preferred language ("EN" | "ES") in Brevo
 * when they click the one-click language switch link inside a welcome or newsletter email.
 */
export async function updateBrevoSubscriberLanguage(
  email: string,
  language: "EN" | "ES",
): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const masterListId = parsePositiveInt(process.env.BREVO_LIST_ID);
  const enListId = parsePositiveInt(process.env.BREVO_LIST_ID_EN);
  const esListId = parsePositiveInt(process.env.BREVO_LIST_ID_ES);

  if (!apiKey || !masterListId) {
    return false;
  }

  const listIds = new Set<number>([masterListId]);
  const unlinkListIds: number[] = [];

  if (language === "ES") {
    if (esListId) listIds.add(esListId);
    if (enListId) unlinkListIds.push(enListId);
  } else {
    if (enListId) listIds.add(enListId);
    if (esListId) unlinkListIds.push(esListId);
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
        attributes: {
          LANGUAGE: language,
        },
        listIds: Array.from(listIds),
        ...(unlinkListIds.length > 0 ? { unlinkListIds } : {}),
        updateEnabled: true,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Failed to update subscriber language in Brevo:", error);
    return false;
  }
}
