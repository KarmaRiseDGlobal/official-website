import {
  COOKIE_CONSENT_CHANGE_EVENT,
  hasAttributionConsent,
} from "@/lib/consent";
import {
  normalizeUtmToken,
  sanitizeSessionAttribution,
  type SessionAttribution,
} from "@/lib/email-analytics";

export type { SessionAttribution };

export interface StoredAttribution extends SessionAttribution {
  utmTerm?: string;
  referralCode?: string;
  referrerHost?: string;
  capturedAt?: number;
}

export type HandoffLanguage = "en" | "es" | "pt";

export interface ClientHandoff {
  name?: string;
  email?: string;
  company?: string;
  preferredLanguage?: HandoffLanguage;
}

export interface ProductBriefDraft {
  step: 1 | 2 | 3;
  product: string;
  readiness: string;
  quantityPreset: string;
  quantityCustom: string;
  referenceUrl: string;
  brief: string;
  name: string;
  email: string;
  company: string;
  profile: string;
  referralSource?: string;
  language: "English" | "Spanish" | "Portuguese" | "";
  updatedAt: number;
}

const HANDOFF_STORAGE_KEY = "karmarise_client_handoff_v1";
const PERSISTENT_ATTRIBUTION_KEY = "karmarise_attribution_v1";
const LEGACY_SESSION_ATTRIBUTION_KEY = "karmarise_email_attribution_v1";
const BRIEF_DRAFT_STORAGE_KEY = "karmarise_product_brief_draft_v1";
const DRAFT_TTL_MS = 14 * 24 * 60 * 60 * 1000;
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

let inMemoryAttribution: StoredAttribution | null = null;
let consentListenerBound = false;

export type ProductCategorySlug =
  "bags" | "garments" | "textile-accessories" | "home-decor";

export const PRODUCT_QUERY_TO_VALUE: Record<ProductCategorySlug, string> = {
  bags: "Bags and accessories",
  garments: "Garments and clothing",
  "textile-accessories": "Textile accessories",
  "home-decor": "Textile home decor",
};

export const PRODUCT_CATEGORY_LABELS: Record<
  ProductCategorySlug,
  Record<"en" | "es", string>
> = {
  bags: {
    en: "Leather goods",
    es: "Bolsos y artículos de piel",
  },
  garments: {
    en: "Clothing",
    es: "Ropa y prendas",
  },
  "textile-accessories": {
    en: "Textile accessories",
    es: "Complementos textiles",
  },
  "home-decor": {
    en: "Textile home decor",
    es: "Decoración textil del hogar",
  },
};

export function resolveProductSlugFromQueryParam(
  raw: string | null,
): ProductCategorySlug | null {
  if (!raw) return null;
  const normalized = raw.trim().toLowerCase();
  if (normalized === "other") {
    return "textile-accessories";
  }
  if (normalized in PRODUCT_CATEGORY_LABELS) {
    return normalized as ProductCategorySlug;
  }
  return null;
}

export function resolveProductFromQueryParam(raw: string | null): string {
  const slug = resolveProductSlugFromQueryParam(raw);
  return slug ? PRODUCT_QUERY_TO_VALUE[slug] : "";
}

export function readClientHandoff(): ClientHandoff {
  if (typeof window === "undefined") {
    return {};
  }
  try {
    const raw = window.sessionStorage.getItem(HANDOFF_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<ClientHandoff>;
    const result: ClientHandoff = {};
    if (typeof parsed.name === "string" && parsed.name.trim()) {
      result.name = parsed.name.trim().slice(0, 160);
    }
    if (typeof parsed.email === "string" && parsed.email.trim()) {
      result.email = parsed.email.trim().slice(0, 320);
    }
    if (typeof parsed.company === "string" && parsed.company.trim()) {
      result.company = parsed.company.trim().slice(0, 200);
    }
    if (
      parsed.preferredLanguage === "en" ||
      parsed.preferredLanguage === "es" ||
      parsed.preferredLanguage === "pt"
    ) {
      result.preferredLanguage = parsed.preferredLanguage;
    }
    return result;
  } catch {
    return {};
  }
}

export function saveClientHandoff(patch: Partial<ClientHandoff>): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const existing = readClientHandoff();
    const merged: ClientHandoff = { ...existing };

    if (typeof patch.name === "string" && patch.name.trim()) {
      merged.name = patch.name.trim().slice(0, 160);
    }
    if (typeof patch.email === "string" && patch.email.trim()) {
      merged.email = patch.email.trim().slice(0, 320);
    }
    if (typeof patch.company === "string" && patch.company.trim()) {
      merged.company = patch.company.trim().slice(0, 200);
    }
    if (
      patch.preferredLanguage === "en" ||
      patch.preferredLanguage === "es" ||
      patch.preferredLanguage === "pt"
    ) {
      merged.preferredLanguage = patch.preferredLanguage;
    }

    window.sessionStorage.setItem(HANDOFF_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    // Ignore storage quota or private browsing errors.
  }
}

export function readProductBriefDraft(): ProductBriefDraft | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(BRIEF_DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<ProductBriefDraft>;
    if (
      typeof parsed.updatedAt === "number" &&
      Date.now() - parsed.updatedAt > DRAFT_TTL_MS
    ) {
      window.localStorage.removeItem(BRIEF_DRAFT_STORAGE_KEY);
      return null;
    }
    const step = parsed.step === 2 || parsed.step === 3 ? parsed.step : 1;
    const language =
      parsed.language === "English" ||
      parsed.language === "Spanish" ||
      parsed.language === "Portuguese"
        ? parsed.language
        : "";
    return {
      step,
      product: typeof parsed.product === "string" ? parsed.product : "",
      readiness: typeof parsed.readiness === "string" ? parsed.readiness : "",
      quantityPreset:
        typeof parsed.quantityPreset === "string" ? parsed.quantityPreset : "",
      quantityCustom:
        typeof parsed.quantityCustom === "string" ? parsed.quantityCustom : "",
      referenceUrl:
        typeof parsed.referenceUrl === "string" ? parsed.referenceUrl : "",
      brief: typeof parsed.brief === "string" ? parsed.brief : "",
      name: typeof parsed.name === "string" ? parsed.name : "",
      email: typeof parsed.email === "string" ? parsed.email : "",
      company: typeof parsed.company === "string" ? parsed.company : "",
      profile: typeof parsed.profile === "string" ? parsed.profile : "",
      referralSource:
        typeof parsed.referralSource === "string" ? parsed.referralSource : "",
      language,
      updatedAt:
        typeof parsed.updatedAt === "number" ? parsed.updatedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

export function saveProductBriefDraft(
  draft: Omit<ProductBriefDraft, "updatedAt">,
): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    const hasContent = Boolean(
      draft.product ||
      draft.readiness ||
      draft.quantityPreset ||
      draft.quantityCustom.trim() ||
      draft.referenceUrl.trim() ||
      draft.brief.trim() ||
      draft.name.trim() ||
      draft.email.trim() ||
      draft.company.trim() ||
      draft.profile ||
      draft.referralSource?.trim(),
    );
    if (!hasContent) {
      window.localStorage.removeItem(BRIEF_DRAFT_STORAGE_KEY);
      return;
    }
    const payload: ProductBriefDraft = {
      ...draft,
      updatedAt: Date.now(),
    };
    window.localStorage.setItem(
      BRIEF_DRAFT_STORAGE_KEY,
      JSON.stringify(payload),
    );
  } catch {
    // Ignore storage quota or private browsing errors.
  }
}

export function clearProductBriefDraft(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(BRIEF_DRAFT_STORAGE_KEY);
  } catch {
    // Ignore storage errors.
  }
}

function sanitizeOptionalToken(
  raw: unknown,
  maxLength = 64,
): string | undefined {
  if (typeof raw !== "string") {
    return undefined;
  }
  const trimmed = raw.trim();
  if (!trimmed || trimmed.includes("@")) {
    return undefined;
  }
  const normalized = normalizeUtmToken(trimmed, maxLength);
  return normalized || undefined;
}

function sanitizeReferrerHost(raw: unknown): string | undefined {
  if (typeof raw !== "string") {
    return undefined;
  }
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed || trimmed.includes("@")) {
    return undefined;
  }
  const cleaned = trimmed
    .replace(/^www\./, "")
    .replace(/[^a-z0-9.-]+/g, "")
    .slice(0, 120);
  if (!cleaned || !cleaned.includes(".")) {
    return undefined;
  }
  return cleaned;
}

function readExternalReferrerHost(): string | undefined {
  if (typeof document === "undefined" || typeof window === "undefined") {
    return undefined;
  }
  const rawReferrer = document.referrer?.trim();
  if (!rawReferrer) {
    return undefined;
  }
  try {
    const parsed = new URL(rawReferrer);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return undefined;
    }
    const currentHost = window.location.hostname
      .toLowerCase()
      .replace(/^www\./, "");
    const refHost = parsed.hostname.toLowerCase().replace(/^www\./, "");
    if (!refHost || refHost === currentHost) {
      return undefined;
    }
    return sanitizeReferrerHost(refHost);
  } catch {
    return undefined;
  }
}

function sanitizeStoredAttribution(raw: unknown): StoredAttribution | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }
  const record = raw as Record<string, unknown>;
  const capturedAt =
    typeof record.capturedAt === "number" && Number.isFinite(record.capturedAt)
      ? record.capturedAt
      : undefined;
  if (
    capturedAt !== undefined &&
    Date.now() - capturedAt > ATTRIBUTION_TTL_MS
  ) {
    return null;
  }

  const base = sanitizeSessionAttribution(record);
  const utmTerm = sanitizeOptionalToken(record.utmTerm ?? record.utm_term, 64);
  const referralCode = sanitizeOptionalToken(
    record.referralCode ?? record.referral_code ?? record.ref ?? record.code,
    64,
  );
  const referrerHost = sanitizeReferrerHost(
    record.referrerHost ?? record.referrer_host,
  );

  if (!base && !utmTerm && !referralCode && !referrerHost) {
    return null;
  }

  return {
    ...(base ?? {}),
    ...(utmTerm ? { utmTerm } : {}),
    ...(referralCode ? { referralCode } : {}),
    ...(referrerHost ? { referrerHost } : {}),
    ...(capturedAt !== undefined ? { capturedAt } : {}),
  };
}

export function clearStoredAttribution(): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.removeItem(PERSISTENT_ATTRIBUTION_KEY);
    window.sessionStorage.removeItem(LEGACY_SESSION_ATTRIBUTION_KEY);
  } catch {
    // Ignore storage errors.
  }
}

function bindConsentListenerOnce(): void {
  if (typeof window === "undefined" || consentListenerBound) {
    return;
  }
  consentListenerBound = true;
  window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, () => {
    try {
      if (!hasAttributionConsent()) {
        clearStoredAttribution();
      } else if (inMemoryAttribution) {
        window.localStorage.setItem(
          PERSISTENT_ATTRIBUTION_KEY,
          JSON.stringify({
            ...inMemoryAttribution,
            capturedAt: inMemoryAttribution.capturedAt ?? Date.now(),
          }),
        );
      }
    } catch {
      // Ignore storage errors.
    }
  });
}

function extractCurrentPageUrlAttribution(
  override?: Partial<StoredAttribution>,
): StoredAttribution | null {
  if (typeof window === "undefined") {
    return null;
  }
  const params = new URLSearchParams(window.location.search);
  const refParam = params.get("ref") ?? params.get("code") ?? undefined;
  const externalReferrer = readExternalReferrerHost();

  const hasExplicitParams =
    params.has("utm_source") ||
    params.has("utm_medium") ||
    params.has("utm_campaign") ||
    params.has("utm_content") ||
    params.has("utm_term") ||
    params.has("ref") ||
    params.has("code") ||
    Boolean(
      override?.utmSource ||
      override?.utmMedium ||
      override?.utmCampaign ||
      override?.utmContent ||
      override?.utmTerm ||
      override?.referralCode,
    );

  if (!hasExplicitParams && !externalReferrer) {
    return null;
  }

  return sanitizeStoredAttribution({
    utmSource: params.get("utm_source") ?? override?.utmSource,
    utmMedium: params.get("utm_medium") ?? override?.utmMedium,
    utmCampaign: params.get("utm_campaign") ?? override?.utmCampaign,
    utmContent: params.get("utm_content") ?? override?.utmContent,
    utmTerm: params.get("utm_term") ?? override?.utmTerm,
    referralCode: refParam ?? override?.referralCode,
    referrerHost: externalReferrer ?? override?.referrerHost,
    landingPath: override?.landingPath || window.location.pathname || "/",
    capturedAt: Date.now(),
  });
}

/**
 * Captures non-PII marketing attribution from the current URL or partner override.
 * Persists for 30 days in localStorage ONLY when the visitor has granted full
 * cookie/storage consent ("all"). Without consent, clears any persisted marketing
 * keys and keeps only current-page in-memory params.
 */
export function captureSessionAttributionFromUrl(
  override?: Partial<StoredAttribution>,
): StoredAttribution | null {
  if (typeof window === "undefined") {
    return null;
  }
  bindConsentListenerOnce();

  const consented = hasAttributionConsent();
  if (!consented) {
    clearStoredAttribution();
  }

  try {
    const extracted = extractCurrentPageUrlAttribution(override);
    if (extracted) {
      inMemoryAttribution = extracted;
      if (consented) {
        window.localStorage.setItem(
          PERSISTENT_ATTRIBUTION_KEY,
          JSON.stringify(extracted),
        );
      }
      return extracted;
    }
  } catch {
    // Ignore storage quota or private browsing errors.
  }

  return readSessionAttribution();
}

export function readSessionAttribution(): StoredAttribution | null {
  if (typeof window === "undefined") {
    return null;
  }
  bindConsentListenerOnce();

  if (!hasAttributionConsent()) {
    clearStoredAttribution();
    if (!inMemoryAttribution) {
      try {
        inMemoryAttribution = extractCurrentPageUrlAttribution();
      } catch {
        // Ignore URL parsing errors.
      }
    }
    return inMemoryAttribution;
  }

  try {
    const rawLocal = window.localStorage.getItem(PERSISTENT_ATTRIBUTION_KEY);
    if (rawLocal) {
      const parsedLocal = sanitizeStoredAttribution(JSON.parse(rawLocal));
      if (parsedLocal) {
        inMemoryAttribution = parsedLocal;
        return parsedLocal;
      }
      window.localStorage.removeItem(PERSISTENT_ATTRIBUTION_KEY);
    }

    const rawLegacy = window.sessionStorage.getItem(
      LEGACY_SESSION_ATTRIBUTION_KEY,
    );
    if (rawLegacy) {
      const parsedLegacy = sanitizeStoredAttribution(JSON.parse(rawLegacy));
      window.sessionStorage.removeItem(LEGACY_SESSION_ATTRIBUTION_KEY);
      if (parsedLegacy) {
        const migrated: StoredAttribution = {
          ...parsedLegacy,
          capturedAt: parsedLegacy.capturedAt ?? Date.now(),
        };
        window.localStorage.setItem(
          PERSISTENT_ATTRIBUTION_KEY,
          JSON.stringify(migrated),
        );
        inMemoryAttribution = migrated;
        return migrated;
      }
    }

    if (inMemoryAttribution) {
      window.localStorage.setItem(
        PERSISTENT_ATTRIBUTION_KEY,
        JSON.stringify({
          ...inMemoryAttribution,
          capturedAt: inMemoryAttribution.capturedAt ?? Date.now(),
        }),
      );
      return inMemoryAttribution;
    }
  } catch {
    return inMemoryAttribution;
  }

  return null;
}

export interface FormAttributionPayload {
  attribution?: StoredAttribution;
  attributionConsent: boolean;
  referralSource?: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  landingPath?: string;
}

export function buildFormAttributionPayload(
  rawReferralSource?: string,
): FormAttributionPayload {
  const attributionConsent = hasAttributionConsent();
  const attribution = readSessionAttribution() ?? undefined;
  const referralSource = rawReferralSource?.trim().slice(0, 160) || undefined;
  const referralCode = attribution?.referralCode || undefined;

  return {
    ...(attribution ? { attribution } : {}),
    attributionConsent,
    ...(referralSource ? { referralSource } : {}),
    ...(referralCode ? { referralCode } : {}),
    ...(attribution?.utmSource ? { utmSource: attribution.utmSource } : {}),
    ...(attribution?.utmMedium ? { utmMedium: attribution.utmMedium } : {}),
    ...(attribution?.utmCampaign
      ? { utmCampaign: attribution.utmCampaign }
      : {}),
    ...(attribution?.utmContent ? { utmContent: attribution.utmContent } : {}),
    ...(attribution?.landingPath
      ? { landingPath: attribution.landingPath }
      : {}),
  };
}

export function scrollElementIntoViewSafe(
  element: HTMLElement | null,
  block: ScrollLogicalPosition = "nearest",
): void {
  if (!element || typeof window === "undefined") {
    return;
  }
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (block === "start") {
    const computed = window.getComputedStyle(element);
    const scrollMarginTop = Number.parseFloat(computed.scrollMarginTop);
    const rootPaddingTop = Number.parseFloat(
      window.getComputedStyle(document.documentElement).scrollPaddingTop,
    );
    const offset =
      Number.isFinite(scrollMarginTop) && scrollMarginTop > 0
        ? scrollMarginTop
        : Number.isFinite(rootPaddingTop) && rootPaddingTop > 0
          ? rootPaddingTop
          : 72;
    const targetTop = Math.max(
      0,
      Math.round(element.getBoundingClientRect().top + window.scrollY - offset),
    );
    window.dispatchEvent(
      new CustomEvent("karmarise:scroll-to", {
        detail: {
          top: targetTop,
          duration: prefersReducedMotion ? 0 : 0.55,
          immediate: prefersReducedMotion,
        },
      }),
    );
    return;
  }

  element.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
    block,
  });
}
