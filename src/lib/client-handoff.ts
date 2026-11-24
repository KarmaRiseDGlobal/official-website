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
  language: "English" | "Spanish" | "";
  updatedAt: number;
}

const HANDOFF_STORAGE_KEY = "karmarise_client_handoff_v1";
const BRIEF_DRAFT_STORAGE_KEY = "karmarise_product_brief_draft_v1";
const DRAFT_TTL_MS = 14 * 24 * 60 * 60 * 1000;

export const PRODUCT_QUERY_TO_VALUE: Record<string, string> = {
  bags: "Bags and accessories",
  garments: "Garments and clothing",
  other: "Another product",
  "home-decor": "Home decor",
};

export function resolveProductFromQueryParam(raw: string | null): string {
  if (!raw) return "";
  const normalized = raw.trim().toLowerCase();
  if (normalized in PRODUCT_QUERY_TO_VALUE) {
    return PRODUCT_QUERY_TO_VALUE[normalized] ?? "";
  }
  return "";
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
      parsed.language === "English" || parsed.language === "Spanish"
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
      draft.profile,
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
