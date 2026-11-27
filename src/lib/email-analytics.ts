function isSafeHttpUrl(value: string): boolean {
  if (/[\u0000-\u001F\u007F]/.test(value)) {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      Boolean(parsed.hostname) &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}

export type EmailUtmSource = "brevo" | "resend" | (string & {});

export type CampaignUtmMedium =
  | "email"
  | "podcast"
  | "newsletter-sponsor"
  | "creator"
  | "gifting"
  | "linkedin-partner"
  | "social";

export interface EmailUtmParams {
  source: EmailUtmSource;
  medium?: CampaignUtmMedium | (string & {});
  campaign: string;
  content?: string;
  term?: string;
}

export interface SessionAttribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referralCode?: string;
  referralSource?: string;
  referrerHost?: string;
  landingPath?: string;
}

export const EMAIL_ANALYTICS_EVENTS = {
  newsletterSubscribed: "newsletter_subscribed",
  newsletterLanguageSwitched: "newsletter_language_switched",
  newsletterReengaged: "newsletter_reengaged",
  productBriefSubmitted: "product_brief_submitted",
  callBooked: "call_booked",
  contactSubmitted: "contact_submitted",
} as const;

export type EmailAnalyticsEventName =
  (typeof EMAIL_ANALYTICS_EVENTS)[keyof typeof EMAIL_ANALYTICS_EVENTS];

export const EMAIL_HEALTH_THRESHOLDS = {
  minObservationDays: 7,
  minDeliveriesForRateAlert: 25,
  targetClickRateMin: 0.02,
  targetClickRateMax: 0.05,
  targetWelcomeReplyRateMin: 0.05,
  maxUnsubscribeRate: 0.005,
  maxBounceOrSpamRate: 0.001,
} as const;

/**
 * Normalizes UTM segments to lowercase hyphen-separated tokens with zero PII or special characters.
 */
export function normalizeUtmToken(raw: string, maxLength = 64): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, maxLength);
}

/**
 * Sanitizes human-readable self-reported discovery source text ("How did you hear about us?")
 * while stripping control characters and rejecting email-like values.
 */
export function sanitizeReferralSource(raw: unknown): string | undefined {
  if (typeof raw !== "string") {
    return undefined;
  }
  const cleaned = raw
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 120);
  if (!cleaned || cleaned.includes("@")) {
    return undefined;
  }
  return cleaned;
}

/**
 * Appends standardized lowercase hyphenated UTM parameters to an http(s) URL
 * while preserving existing query parameters and hash fragments.
 */
export function appendEmailUtm(rawUrl: string, utm: EmailUtmParams): string {
  const trimmed = rawUrl.trim();
  if (!trimmed || !isSafeHttpUrl(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const source = normalizeUtmToken(utm.source, 48) || "brevo";
    const medium = normalizeUtmToken(utm.medium ?? "email", 32) || "email";
    const campaign = normalizeUtmToken(utm.campaign, 64);
    const content = utm.content ? normalizeUtmToken(utm.content, 64) : "";
    const term = utm.term ? normalizeUtmToken(utm.term, 64) : "";

    parsed.searchParams.set("utm_source", source);
    parsed.searchParams.set("utm_medium", medium);
    if (campaign) {
      parsed.searchParams.set("utm_campaign", campaign);
    }
    if (content) {
      parsed.searchParams.set("utm_content", content);
    }
    if (term) {
      parsed.searchParams.set("utm_term", term);
    }

    return parsed.toString();
  } catch {
    return trimmed;
  }
}

/**
 * Sanitizes incoming session attribution payload on API routes.
 * Drops unexpected fields and rejects email-like values so PII never enters analytics properties.
 */
export function sanitizeSessionAttribution(
  raw: unknown,
): SessionAttribution | undefined {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return undefined;
  }

  const record = raw as Record<string, unknown>;
  const cleanToken = (value: unknown, maxLen = 64): string | undefined => {
    if (typeof value !== "string") {
      return undefined;
    }
    const trimmed = value.trim();
    if (!trimmed || trimmed.includes("@")) {
      return undefined;
    }
    const normalized = normalizeUtmToken(trimmed, maxLen);
    return normalized || undefined;
  };

  const utmSource = cleanToken(record.utmSource ?? record.utm_source, 48);
  const utmMedium = cleanToken(record.utmMedium ?? record.utm_medium, 32);
  const utmCampaign = cleanToken(record.utmCampaign ?? record.utm_campaign, 64);
  const utmContent = cleanToken(record.utmContent ?? record.utm_content, 64);
  const utmTerm = cleanToken(record.utmTerm ?? record.utm_term, 64);
  const referralCode = cleanToken(
    record.referralCode ?? record.referral_code ?? record.ref ?? record.code,
    48,
  );
  const referralSource = sanitizeReferralSource(
    record.referralSource ?? record.referral_source,
  );

  let referrerHost: string | undefined;
  const rawHost = record.referrerHost ?? record.referrer_host;
  if (typeof rawHost === "string") {
    const trimmedHost = rawHost.trim().toLowerCase().slice(0, 120);
    if (
      trimmedHost &&
      !trimmedHost.includes("@") &&
      /^[a-z0-9.-]+\.[a-z]{2,}$/.test(trimmedHost)
    ) {
      referrerHost = trimmedHost;
    }
  }

  let landingPath: string | undefined;
  const rawPath = record.landingPath ?? record.landing_path;
  if (
    typeof rawPath === "string" &&
    rawPath.startsWith("/") &&
    !rawPath.startsWith("//") &&
    !rawPath.includes("@")
  ) {
    landingPath = rawPath.split("?")[0]?.split("#")[0]?.slice(0, 120);
  }

  if (
    !utmSource &&
    !utmMedium &&
    !utmCampaign &&
    !utmContent &&
    !utmTerm &&
    !referralCode &&
    !referralSource &&
    !referrerHost &&
    !landingPath
  ) {
    return undefined;
  }

  return {
    ...(utmSource ? { utmSource } : {}),
    ...(utmMedium ? { utmMedium } : {}),
    ...(utmCampaign ? { utmCampaign } : {}),
    ...(utmContent ? { utmContent } : {}),
    ...(utmTerm ? { utmTerm } : {}),
    ...(referralCode ? { referralCode } : {}),
    ...(referralSource ? { referralSource } : {}),
    ...(referrerHost ? { referrerHost } : {}),
    ...(landingPath ? { landingPath } : {}),
  };
}

/**
 * Extracts and merges both nested `payload.attribution` and flat top-level
 * UTM / referral fields plus explicit `attributionConsent` from form API requests.
 */
export function extractRequestAttribution(payload: Record<string, unknown>): {
  attribution?: SessionAttribution;
  referralSource?: string;
  referralCode?: string;
  attributionConsent: boolean;
  hasExplicitConsentField: boolean;
} {
  const nested =
    payload.attribution &&
    typeof payload.attribution === "object" &&
    !Array.isArray(payload.attribution)
      ? (payload.attribution as Record<string, unknown>)
      : {};

  const merged: Record<string, unknown> = {
    ...nested,
    ...(payload.utmSource !== undefined
      ? { utmSource: payload.utmSource }
      : {}),
    ...(payload.utm_source !== undefined
      ? { utm_source: payload.utm_source }
      : {}),
    ...(payload.utmMedium !== undefined
      ? { utmMedium: payload.utmMedium }
      : {}),
    ...(payload.utm_medium !== undefined
      ? { utm_medium: payload.utm_medium }
      : {}),
    ...(payload.utmCampaign !== undefined
      ? { utmCampaign: payload.utmCampaign }
      : {}),
    ...(payload.utm_campaign !== undefined
      ? { utm_campaign: payload.utm_campaign }
      : {}),
    ...(payload.utmContent !== undefined
      ? { utmContent: payload.utmContent }
      : {}),
    ...(payload.utm_content !== undefined
      ? { utm_content: payload.utm_content }
      : {}),
    ...(payload.utmTerm !== undefined ? { utmTerm: payload.utmTerm } : {}),
    ...(payload.utm_term !== undefined ? { utm_term: payload.utm_term } : {}),
    ...(payload.landingPath !== undefined
      ? { landingPath: payload.landingPath }
      : {}),
    ...(payload.landing_path !== undefined
      ? { landing_path: payload.landing_path }
      : {}),
    ...(payload.referralCode !== undefined
      ? { referralCode: payload.referralCode }
      : {}),
    ...(payload.referral_code !== undefined
      ? { referral_code: payload.referral_code }
      : {}),
    ...(payload.ref !== undefined ? { ref: payload.ref } : {}),
    ...(payload.code !== undefined ? { code: payload.code } : {}),
    ...(payload.referralSource !== undefined
      ? { referralSource: payload.referralSource }
      : {}),
    ...(payload.referral_source !== undefined
      ? { referral_source: payload.referral_source }
      : {}),
    ...(payload.referrerHost !== undefined
      ? { referrerHost: payload.referrerHost }
      : {}),
    ...(payload.referrer_host !== undefined
      ? { referrer_host: payload.referrer_host }
      : {}),
  };

  const attribution = sanitizeSessionAttribution(merged);
  const rawConsent = payload.attributionConsent;
  const hasExplicitConsentField =
    rawConsent !== undefined && rawConsent !== null && rawConsent !== "";
  const attributionConsent =
    rawConsent === true ||
    (typeof rawConsent === "string" &&
      rawConsent.trim().toLowerCase() === "true");

  return {
    attribution,
    referralSource: attribution?.referralSource,
    referralCode: attribution?.referralCode,
    attributionConsent,
    hasExplicitConsentField,
  };
}

export function formatAttributionLine(
  attribution: SessionAttribution | undefined,
): string | null {
  if (!attribution) {
    return null;
  }

  const segments: string[] = [];
  const utmParts = [
    attribution.utmSource,
    attribution.utmMedium,
    attribution.utmCampaign,
  ].filter(Boolean);
  if (utmParts.length > 0) {
    const contentSuffix = attribution.utmContent
      ? ` (${attribution.utmContent})`
      : "";
    segments.push(`${utmParts.join(" / ")}${contentSuffix}`);
  }
  if (attribution.utmTerm) {
    segments.push(`term: ${attribution.utmTerm}`);
  }
  if (attribution.referralCode) {
    segments.push(`ref: ${attribution.referralCode}`);
  }
  if (attribution.referralSource) {
    segments.push(`heard via: ${attribution.referralSource}`);
  }
  if (attribution.referrerHost) {
    segments.push(`referrer: ${attribution.referrerHost}`);
  }
  if (attribution.landingPath) {
    segments.push(
      segments.length === 0
        ? `Landing path: ${attribution.landingPath}`
        : `landing: ${attribution.landingPath}`,
    );
  }

  return segments.length > 0 ? segments.join(" | ") : null;
}

export function attributionToEventProperties(
  attribution: SessionAttribution | undefined,
): Record<string, string> {
  if (!attribution) {
    return {};
  }
  return {
    ...(attribution.utmSource ? { utm_source: attribution.utmSource } : {}),
    ...(attribution.utmMedium ? { utm_medium: attribution.utmMedium } : {}),
    ...(attribution.utmCampaign
      ? { utm_campaign: attribution.utmCampaign }
      : {}),
    ...(attribution.utmContent ? { utm_content: attribution.utmContent } : {}),
    ...(attribution.utmTerm ? { utm_term: attribution.utmTerm } : {}),
    ...(attribution.referralCode
      ? { referral_code: attribution.referralCode }
      : {}),
    ...(attribution.referralSource
      ? { referral_source: attribution.referralSource }
      : {}),
    ...(attribution.referrerHost
      ? { referrer_host: attribution.referrerHost }
      : {}),
    ...(attribution.landingPath
      ? { landing_path: attribution.landingPath }
      : {}),
  };
}

export function attributionToCalMetadata(
  attribution: SessionAttribution | undefined,
): Record<string, string> {
  if (!attribution) {
    return {};
  }
  return {
    ...(attribution.utmSource ? { utmSource: attribution.utmSource } : {}),
    ...(attribution.utmMedium ? { utmMedium: attribution.utmMedium } : {}),
    ...(attribution.utmCampaign
      ? { utmCampaign: attribution.utmCampaign }
      : {}),
    ...(attribution.utmContent ? { utmContent: attribution.utmContent } : {}),
    ...(attribution.utmTerm ? { utmTerm: attribution.utmTerm } : {}),
    ...(attribution.landingPath
      ? { landingPath: attribution.landingPath }
      : {}),
    ...(attribution.referralCode
      ? { referralCode: attribution.referralCode }
      : {}),
    ...(attribution.referralSource
      ? { referralSource: attribution.referralSource }
      : {}),
  };
}

export interface CampaignRowInput {
  id: string;
  label: string;
  language: "en" | "es";
  sentAtIso?: string;
  sent: number;
  delivered: number;
  uniqueOpened: number;
  uniqueClicked: number;
  bounced: number;
  unsubscribed: number;
  spam: number;
}

export interface ComputedCampaignMetrics {
  id: string;
  label: string;
  language: "en" | "es";
  windowStatus: "closed" | "pending";
  daysSinceSend: number | null;
  sent: number;
  delivered: number;
  deliveryRate: number | null;
  uniqueOpened: number;
  uniqueOpenRate: number | null;
  uniqueClicked: number;
  clickRate: number | null;
  clickToOpenRate: number | null;
  bounced: number;
  bounceRate: number | null;
  unsubscribed: number;
  unsubscribeRate: number | null;
  spam: number;
  spamRate: number | null;
  alerts: string[];
}

function safeRate(numerator: number, denominator: number): number | null {
  if (!Number.isFinite(denominator) || denominator <= 0) {
    return null;
  }
  return numerator / denominator;
}

/**
 * Computes closed-window campaign metrics from raw integer counts (never eyeballed)
 * and marks sends still inside the 7-day observation window as pending.
 */
export function computeCampaignMetrics(
  row: CampaignRowInput,
  now: Date = new Date(),
): ComputedCampaignMetrics {
  const sentMs = row.sentAtIso ? Date.parse(row.sentAtIso) : Number.NaN;
  const daysSinceSend = Number.isFinite(sentMs)
    ? Math.max(0, (now.getTime() - sentMs) / (24 * 60 * 60 * 1000))
    : null;
  const windowStatus: "closed" | "pending" =
    daysSinceSend === null ||
    daysSinceSend >= EMAIL_HEALTH_THRESHOLDS.minObservationDays
      ? "closed"
      : "pending";

  const deliveryRate = safeRate(row.delivered, row.sent);
  const uniqueOpenRate = safeRate(row.uniqueOpened, row.delivered);
  const clickRate = safeRate(row.uniqueClicked, row.delivered);
  const clickToOpenRate = safeRate(row.uniqueClicked, row.uniqueOpened);
  const bounceRate = safeRate(row.bounced, row.sent);
  const unsubscribeRate = safeRate(row.unsubscribed, row.delivered);
  const spamRate = safeRate(row.spam, row.delivered);

  const alerts: string[] = [];
  if (
    windowStatus === "closed" &&
    row.delivered >= EMAIL_HEALTH_THRESHOLDS.minDeliveriesForRateAlert
  ) {
    if (
      unsubscribeRate !== null &&
      unsubscribeRate > EMAIL_HEALTH_THRESHOLDS.maxUnsubscribeRate
    ) {
      alerts.push(
        `Unsubscribe rate ${(unsubscribeRate * 100).toFixed(2)}% exceeds 0.50% limit.`,
      );
    }
    const bouncePlusSpam = safeRate(row.bounced + row.spam, row.sent);
    if (
      bouncePlusSpam !== null &&
      bouncePlusSpam > EMAIL_HEALTH_THRESHOLDS.maxBounceOrSpamRate
    ) {
      alerts.push(
        `Bounce + spam rate ${(bouncePlusSpam * 100).toFixed(2)}% exceeds 0.10% limit.`,
      );
    }
    if (
      clickRate !== null &&
      clickRate < EMAIL_HEALTH_THRESHOLDS.targetClickRateMin
    ) {
      alerts.push(
        `Click rate ${(clickRate * 100).toFixed(2)}% is below 2.00% benchmark.`,
      );
    }
  }

  return {
    id: row.id,
    label: row.label,
    language: row.language,
    windowStatus,
    daysSinceSend:
      daysSinceSend === null ? null : Math.round(daysSinceSend * 10) / 10,
    sent: row.sent,
    delivered: row.delivered,
    deliveryRate,
    uniqueOpened: row.uniqueOpened,
    uniqueOpenRate,
    uniqueClicked: row.uniqueClicked,
    clickRate,
    clickToOpenRate,
    bounced: row.bounced,
    bounceRate,
    unsubscribed: row.unsubscribed,
    unsubscribeRate,
    spam: row.spam,
    spamRate,
    alerts,
  };
}

export interface SegmentSummary {
  closedCampaignCount: number;
  pendingCampaignCount: number;
  closedSent: number;
  closedDelivered: number;
  closedUniqueOpened: number;
  closedUniqueClicked: number;
  closedBounced: number;
  closedUnsubscribed: number;
  closedSpam: number;
  closedDeliveryRate: number | null;
  closedUniqueOpenRate: number | null;
  closedClickRate: number | null;
  closedUnsubscribeRate: number | null;
}

/**
 * Aggregates metrics for one segment strictly across closed observation windows
 * so pending in-flight sends are never counted against conversion or click rates.
 */
export function summarizeClosedSegment(
  metrics: readonly ComputedCampaignMetrics[],
): SegmentSummary {
  let closedCampaignCount = 0;
  let pendingCampaignCount = 0;
  let closedSent = 0;
  let closedDelivered = 0;
  let closedUniqueOpened = 0;
  let closedUniqueClicked = 0;
  let closedBounced = 0;
  let closedUnsubscribed = 0;
  let closedSpam = 0;

  for (const item of metrics) {
    if (item.windowStatus === "pending") {
      pendingCampaignCount += 1;
      continue;
    }
    closedCampaignCount += 1;
    closedSent += item.sent;
    closedDelivered += item.delivered;
    closedUniqueOpened += item.uniqueOpened;
    closedUniqueClicked += item.uniqueClicked;
    closedBounced += item.bounced;
    closedUnsubscribed += item.unsubscribed;
    closedSpam += item.spam;
  }

  return {
    closedCampaignCount,
    pendingCampaignCount,
    closedSent,
    closedDelivered,
    closedUniqueOpened,
    closedUniqueClicked,
    closedBounced,
    closedUnsubscribed,
    closedSpam,
    closedDeliveryRate: safeRate(closedDelivered, closedSent),
    closedUniqueOpenRate: safeRate(closedUniqueOpened, closedDelivered),
    closedClickRate: safeRate(closedUniqueClicked, closedDelivered),
    closedUnsubscribeRate: safeRate(closedUnsubscribed, closedDelivered),
  };
}

/**
 * Cross-checks EN and ES segment totals against a combined roll-up so
 * silent dropped rows are surfaced immediately.
 */
export function reconcileLanguageSegments(
  allRows: readonly ComputedCampaignMetrics[],
): {
  en: SegmentSummary;
  es: SegmentSummary;
  combined: SegmentSummary;
  reconciled: boolean;
} {
  const en = summarizeClosedSegment(
    allRows.filter((row) => row.language === "en"),
  );
  const es = summarizeClosedSegment(
    allRows.filter((row) => row.language === "es"),
  );
  const combined = summarizeClosedSegment(allRows);

  const reconciled =
    en.closedDelivered + es.closedDelivered === combined.closedDelivered &&
    en.closedUniqueClicked + es.closedUniqueClicked ===
      combined.closedUniqueClicked &&
    en.closedUnsubscribed + es.closedUnsubscribed ===
      combined.closedUnsubscribed &&
    en.closedCampaignCount + es.closedCampaignCount ===
      combined.closedCampaignCount;

  return { en, es, combined, reconciled };
}
