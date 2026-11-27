export type CookieConsentLevel = "essential" | "all";

export const COOKIE_CONSENT_STORAGE_KEY = "karmarise_cookie_consent_v1";
export const COOKIE_CONSENT_CHANGE_EVENT = "karmarise:cookie-consent-change";
export const OPEN_COOKIE_SETTINGS_EVENT = "karmarise:open-cookie-settings";

const ATTRIBUTION_STORAGE_KEYS = [
  "karmarise_email_attribution_v1",
  "karmarise_attribution_v1",
] as const;

function parseConsentLevel(raw: string | null): CookieConsentLevel | null {
  if (raw === "essential" || raw === "all") {
    return raw;
  }
  return null;
}

export function readCookieConsent(): CookieConsentLevel | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return parseConsentLevel(
      window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY),
    );
  } catch {
    return null;
  }
}

export function writeCookieConsent(level: CookieConsentLevel): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, level);
    if (level === "essential") {
      for (const key of ATTRIBUTION_STORAGE_KEYS) {
        window.sessionStorage.removeItem(key);
        window.localStorage.removeItem(key);
      }
    }
  } catch {
    // Ignore storage quota or restricted-context errors.
  }

  window.dispatchEvent(
    new CustomEvent<CookieConsentLevel>(COOKIE_CONSENT_CHANGE_EVENT, {
      detail: level,
    }),
  );
}

export function hasAttributionConsent(): boolean {
  return readCookieConsent() === "all";
}

export function openCookieSettings(): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new CustomEvent(OPEN_COOKIE_SETTINGS_EVENT));
}
