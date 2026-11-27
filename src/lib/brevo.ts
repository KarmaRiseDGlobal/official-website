import "server-only";

import {
  attributionToEventProperties,
  EMAIL_ANALYTICS_EVENTS,
  type EmailAnalyticsEventName,
  type SessionAttribution,
} from "@/lib/email-analytics";
import {
  formatNewsletterInterest,
  getWelcomeTrackCopy,
  normalizeNewsletterTracks,
  type NewsletterTrack,
} from "@/lib/newsletter-tracks";

const BREVO_CONTACTS_API_URL = "https://api.brevo.com/v3/contacts";
const BREVO_SMTP_EMAIL_API_URL = "https://api.brevo.com/v3/smtp/email";
const BREVO_EVENTS_API_URL = "https://api.brevo.com/v3/events";

export interface BrevoSubscriberInput {
  email: string;
  firstName?: string;
  language?: "EN" | "ES";
  country?: string;
  interest?: string;
  source?: string;
  tracks?: readonly NewsletterTrack[];
  attribution?: SessionAttribution;
  referralSource?: string;
  referralCode?: string;
  attributionConsent?: boolean;
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
 * Sends a non-blocking custom event to Brevo Events API (`/v3/events`) to drive
 * automation triggers, exit conditions, and zero-PII conversion attribution.
 */
export async function trackBrevoEvent(options: {
  email: string;
  eventName: EmailAnalyticsEventName;
  eventProperties?: Record<string, string | number | boolean>;
  contactProperties?: Record<string, string | number | boolean>;
}): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey || !options.email.trim()) {
    return false;
  }

  try {
    const response = await fetch(BREVO_EVENTS_API_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        event_name: options.eventName,
        identifiers: {
          email_id: options.email.trim().toLowerCase(),
        },
        ...(options.contactProperties &&
        Object.keys(options.contactProperties).length > 0
          ? { contact_properties: options.contactProperties }
          : {}),
        ...(options.eventProperties &&
        Object.keys(options.eventProperties).length > 0
          ? { event_properties: options.eventProperties }
          : {}),
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error(
        `Brevo event "${options.eventName}" failed:`,
        response.status,
        errorBody,
      );
      return false;
    }

    return true;
  } catch (error) {
    console.error(`Brevo event "${options.eventName}" request error:`, error);
    return false;
  }
}

async function fetchContactListIds(
  apiKey: string,
  email: string,
): Promise<{ listIds: number[]; emailBlacklisted: boolean } | null> {
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
      return null;
    }

    const data = (await response.json()) as {
      listIds?: number[];
      emailBlacklisted?: boolean;
    };

    return {
      listIds: Array.isArray(data.listIds) ? data.listIds : [],
      emailBlacklisted: Boolean(data.emailBlacklisted),
    };
  } catch {
    return null;
  }
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
  const existing = await fetchContactListIds(apiKey, email);
  if (!existing || existing.emailBlacklisted) {
    return false;
  }
  return existing.listIds.includes(masterListId);
}

/**
 * Triggers the language-matched Welcome Email 1 template in Brevo (Template #3 for EN, Template #4 for ES).
 */
async function sendBrevoWelcomeEmail(options: {
  apiKey: string;
  email: string;
  firstName?: string;
  language: "EN" | "ES";
  tracks: readonly NewsletterTrack[];
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
    process.env.BREVO_SENDER_NAME?.trim() ||
    (options.language === "ES"
      ? "Alma y Shirish · KarmaRise D Global"
      : "Alma & Shirish · KarmaRise D Global");
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() || "stories@karmarisedglobal.com";
  const replyToEmail = process.env.BREVO_REPLY_TO_EMAIL?.trim() || senderEmail;
  const trackCopy = getWelcomeTrackCopy(options.tracks, options.language);

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
          FIRSTNAME: options.firstName || "",
          LANGUAGE: options.language,
          EMAIL: options.email,
          TRACK_LABEL: trackCopy.trackLabel,
          TRACK_NOTE: trackCopy.trackNote,
          PRIMARY_TRACK: trackCopy.primaryTrack,
        },
        tags: [
          "welcome-automation",
          "welcome-01",
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
 * Adds or updates a newsletter subscriber in Brevo with language, track, and consent attributes,
 * triggers the immediate welcome email (W1), and logs `newsletter_subscribed` for W2-W5 automation.
 */
export async function subscribeToBrevoNewsletter(
  input: string | BrevoSubscriberInput,
): Promise<BrevoSubscribeResult> {
  const subscriber: BrevoSubscriberInput =
    typeof input === "string" ? { email: input } : input;

  const language = subscriber.language === "ES" ? "ES" : "EN";
  const isEs = language === "ES";

  const apiKey = process.env.BREVO_API_KEY?.trim();
  const masterListId = parsePositiveInt(process.env.BREVO_LIST_ID);
  const enListId = parsePositiveInt(process.env.BREVO_LIST_ID_EN);
  const esListId = parsePositiveInt(process.env.BREVO_LIST_ID_ES);
  const mfgEnListId = parsePositiveInt(
    process.env.BREVO_LIST_ID_MANUFACTURING_EN,
  );
  const mfgEsListId = parsePositiveInt(
    process.env.BREVO_LIST_ID_MANUFACTURING_ES,
  );
  const almariseEnListId = parsePositiveInt(
    process.env.BREVO_LIST_ID_ALMARISE_EN,
  );
  const almariseEsListId = parsePositiveInt(
    process.env.BREVO_LIST_ID_ALMARISE_ES,
  );

  if (!apiKey || !masterListId) {
    return {
      ok: false,
      error: isEs
        ? "La suscripción al boletín todavía no está configurada."
        : "Newsletter subscription is not configured yet.",
      status: 500,
    };
  }

  const resolvedTracks = normalizeNewsletterTracks(subscriber.tracks);
  const trackCopy = getWelcomeTrackCopy(resolvedTracks, language);

  const listIds = new Set<number>([masterListId]);
  if (language === "EN" && enListId) {
    listIds.add(enListId);
  }
  if (language === "ES" && esListId) {
    listIds.add(esListId);
  }

  const removeListIds = new Set<number>();
  if (language === "EN" && esListId) {
    removeListIds.add(esListId);
  }
  if (language === "ES" && enListId) {
    removeListIds.add(enListId);
  }

  if (resolvedTracks.length > 0) {
    const wantsManufacturing = resolvedTracks.includes("manufacturing");
    const wantsAlmarise = resolvedTracks.includes("almarise");

    if (language === "EN") {
      if (wantsManufacturing && mfgEnListId) listIds.add(mfgEnListId);
      if (wantsAlmarise && almariseEnListId) listIds.add(almariseEnListId);
      if (mfgEsListId) removeListIds.add(mfgEsListId);
      if (almariseEsListId) removeListIds.add(almariseEsListId);
    } else {
      if (wantsManufacturing && mfgEsListId) listIds.add(mfgEsListId);
      if (wantsAlmarise && almariseEsListId) listIds.add(almariseEsListId);
      if (mfgEnListId) removeListIds.add(mfgEnListId);
      if (almariseEnListId) removeListIds.add(almariseEnListId);
    }
  }

  const unlinkListIds = Array.from(removeListIds).filter(
    (id) => !listIds.has(id),
  );

  const resolvedInterest =
    subscriber.interest ||
    (resolvedTracks.length > 0
      ? formatNewsletterInterest(resolvedTracks)
      : "KarmaRise Stories");

  const allowMarketingAttribution = subscriber.attributionConsent !== false;
  const referralSource =
    subscriber.referralSource || subscriber.attribution?.referralSource;
  const referralCode =
    subscriber.referralCode || subscriber.attribution?.referralCode;

  const attributes: Record<string, string> = {
    LANGUAGE: language,
    CUSTOMER_TYPE: "Subscriber",
    CONSENT_STATUS: "Yes",
    CONSENT_DATE: new Date().toISOString(),
    SOURCE: subscriber.source || "Website",
    PRIMARY_TRACK: trackCopy.primaryTrack,
    INTEREST: resolvedInterest,
  };

  if (subscriber.firstName) {
    attributes.FIRSTNAME = subscriber.firstName;
  }
  if (subscriber.country) {
    attributes.COUNTRY = subscriber.country;
  }
  if (referralSource) {
    attributes.REFERRAL_SOURCE = referralSource;
  }
  if (referralCode) {
    attributes.REFERRAL_CODE = referralCode;
  }
  if (allowMarketingAttribution && subscriber.attribution) {
    if (subscriber.attribution.utmSource) {
      attributes.UTM_SOURCE = subscriber.attribution.utmSource;
    }
    if (subscriber.attribution.utmMedium) {
      attributes.UTM_MEDIUM = subscriber.attribution.utmMedium;
    }
    if (subscriber.attribution.utmCampaign) {
      attributes.UTM_CAMPAIGN = subscriber.attribution.utmCampaign;
    }
    if (subscriber.attribution.utmContent) {
      attributes.UTM_CONTENT = subscriber.attribution.utmContent;
    }
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
        ...(unlinkListIds.length > 0 ? { unlinkListIds } : {}),
        updateEnabled: true,
        emailBlacklisted: false,
      }),
    });

    let contactSaved = response.ok;

    if (!contactSaved && response.status === 400) {
      const fallbackAttributes: Record<string, string> = {
        LANGUAGE: language,
        SOURCE: subscriber.source || "Website",
        INTEREST: resolvedInterest,
      };
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
          attributes: fallbackAttributes,
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
        error: isEs
          ? "No pudimos completar tu suscripción ahora mismo. Inténtalo de nuevo o escríbenos a hola@karmarisedglobal.com."
          : "Unable to subscribe right now. Please try again or write to hola@karmarisedglobal.com.",
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
        tracks: resolvedTracks,
      });

      const eventAttribution = allowMarketingAttribution
        ? attributionToEventProperties(subscriber.attribution)
        : {
            ...(referralSource ? { referral_source: referralSource } : {}),
            ...(referralCode ? { referral_code: referralCode } : {}),
          };

      await trackBrevoEvent({
        email: subscriber.email,
        eventName: EMAIL_ANALYTICS_EVENTS.newsletterSubscribed,
        eventProperties: {
          language: language.toLowerCase(),
          signup_source: subscriber.source || "Website",
          primary_track: trackCopy.primaryTrack,
          tracks: resolvedTracks.join(",") || "all",
          ...eventAttribution,
        },
      });
    }

    return { ok: true, welcomeSent, language };
  } catch (error) {
    console.error("Brevo request failed:", error);
    return {
      ok: false,
      error: isEs
        ? "Error de conexión al completar tu suscripción. Inténtalo de nuevo en unos minutos."
        : "Network error while subscribing. Please try again shortly.",
      status: 502,
    };
  }
}

/**
 * Updates an existing subscriber's preferred language ("EN" | "ES") in Brevo
 * when they use the language switch link inside a welcome, newsletter, or re-engagement email.
 * Migrates any configured topic-track lists cleanly to the chosen language and emits
 * `newsletter_language_switched` (or `newsletter_reengaged` for legacy stay links).
 */
export async function updateBrevoSubscriberLanguage(
  email: string,
  language: "EN" | "ES",
  options?: { markReengaged?: boolean; campaign?: string },
): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const masterListId = parsePositiveInt(process.env.BREVO_LIST_ID);
  const enListId = parsePositiveInt(process.env.BREVO_LIST_ID_EN);
  const esListId = parsePositiveInt(process.env.BREVO_LIST_ID_ES);
  const mfgEnListId = parsePositiveInt(
    process.env.BREVO_LIST_ID_MANUFACTURING_EN,
  );
  const mfgEsListId = parsePositiveInt(
    process.env.BREVO_LIST_ID_MANUFACTURING_ES,
  );
  const almariseEnListId = parsePositiveInt(
    process.env.BREVO_LIST_ID_ALMARISE_EN,
  );
  const almariseEsListId = parsePositiveInt(
    process.env.BREVO_LIST_ID_ALMARISE_ES,
  );

  if (!apiKey || !masterListId) {
    return false;
  }

  const listIds = new Set<number>([masterListId]);
  const unlinkListIds = new Set<number>();

  if (language === "ES") {
    if (esListId) listIds.add(esListId);
    if (enListId) unlinkListIds.add(enListId);
  } else {
    if (enListId) listIds.add(enListId);
    if (esListId) unlinkListIds.add(esListId);
  }

  const hasTrackLists = Boolean(
    mfgEnListId || mfgEsListId || almariseEnListId || almariseEsListId,
  );
  if (hasTrackLists) {
    const existing = await fetchContactListIds(apiKey, email);
    const currentIds = new Set(existing?.listIds ?? []);

    const hadManufacturing = Boolean(
      (mfgEnListId && currentIds.has(mfgEnListId)) ||
      (mfgEsListId && currentIds.has(mfgEsListId)),
    );
    const hadAlmarise = Boolean(
      (almariseEnListId && currentIds.has(almariseEnListId)) ||
      (almariseEsListId && currentIds.has(almariseEsListId)),
    );

    if (language === "ES") {
      if (hadManufacturing && mfgEsListId) listIds.add(mfgEsListId);
      if (hadAlmarise && almariseEsListId) listIds.add(almariseEsListId);
      if (mfgEnListId) unlinkListIds.add(mfgEnListId);
      if (almariseEnListId) unlinkListIds.add(almariseEnListId);
    } else {
      if (hadManufacturing && mfgEnListId) listIds.add(mfgEnListId);
      if (hadAlmarise && almariseEnListId) listIds.add(almariseEnListId);
      if (mfgEsListId) unlinkListIds.add(mfgEsListId);
      if (almariseEsListId) unlinkListIds.add(almariseEsListId);
    }
  }

  const finalUnlink = Array.from(unlinkListIds).filter(
    (id) => !listIds.has(id),
  );

  const attributes: Record<string, string> = {
    LANGUAGE: language,
    ...(options?.markReengaged
      ? { REENGAGED_AT: new Date().toISOString() }
      : {}),
  };

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
        attributes,
        listIds: Array.from(listIds),
        ...(finalUnlink.length > 0 ? { unlinkListIds: finalUnlink } : {}),
        updateEnabled: true,
        ...(options?.markReengaged ? { emailBlacklisted: false } : {}),
      }),
    });

    if (response.ok) {
      await trackBrevoEvent({
        email,
        eventName: options?.markReengaged
          ? EMAIL_ANALYTICS_EVENTS.newsletterReengaged
          : EMAIL_ANALYTICS_EVENTS.newsletterLanguageSwitched,
        eventProperties: {
          language: language.toLowerCase(),
          ...(options?.campaign ? { utm_campaign: options.campaign } : {}),
        },
      });
    }

    return response.ok;
  } catch (error) {
    console.error("Failed to update subscriber language in Brevo:", error);
    return false;
  }
}
