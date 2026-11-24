import { stripLocalePrefix } from "@/lib/urls";

export const LOADER_SKIP_KEY = "karmarise-skip-loader-once";
export const LOADER_SKIP_ATTR = "data-loader-skip";
export const LOADER_DONE_ATTR = "data-loader-done";
export const LOADER_EXITING_EVENT = "karmarise:loader-exiting";

export const PAGE_TRANSITION_PENDING_KEY = "karmarise-page-transition-once";
export const PAGE_TRANSITION_TONE_KEY = "karmarise-page-transition-tone";
export const PAGE_TRANSITION_COVER_ATTR = "data-transition-cover";
export const PAGE_TRANSITION_TONE_ATTR = "data-transition-tone";
export const PAGE_TRANSITION_EVENT = "karmarise:navigate";

export type TransitionTone = "dark" | "light";

export interface PageTransitionEventDetail {
  readonly href: string;
  readonly isLanguageSwitch: boolean;
}

const DARK_HERO_ROUTES = new Set(["/", "/about", "/how-we-work", "/almarise"]);

export const LOADER_PREPAINT_SCRIPT = `(() => {
  try {
    document.documentElement.setAttribute("${LOADER_DONE_ATTR}", "true");
    if (window.sessionStorage.getItem("${LOADER_SKIP_KEY}") === "1") {
      window.sessionStorage.removeItem("${LOADER_SKIP_KEY}");
      document.documentElement.setAttribute("${LOADER_SKIP_ATTR}", "true");
    }
    if (window.sessionStorage.getItem("${PAGE_TRANSITION_PENDING_KEY}") === "1") {
      document.documentElement.setAttribute("${PAGE_TRANSITION_COVER_ATTR}", "true");
      const tone = window.sessionStorage.getItem("${PAGE_TRANSITION_TONE_KEY}");
      if (tone === "dark" || tone === "light") {
        document.documentElement.setAttribute("${PAGE_TRANSITION_TONE_ATTR}", tone);
      }
    }
  } catch {}
})();`;

export const LOADER_CRITICAL_CSS = "";

export const LOADER_NOSCRIPT_CSS = "";

export function resolveRouteTone(href: string): TransitionTone {
  let pathname = href;
  try {
    pathname = new URL(href, "https://karmarisedglobal.invalid").pathname;
  } catch {
    pathname = href.split(/[?#]/)[0] || "/";
  }
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const basePath = stripLocalePrefix(normalizedPath);
  return DARK_HERO_ROUTES.has(basePath) ? "dark" : "light";
}

export function isHomeRoute(href: string): boolean {
  let pathname = href;
  try {
    pathname = new URL(href, "https://karmarisedglobal.invalid").pathname;
  } catch {
    pathname = href.split(/[?#]/)[0] || "/";
  }
  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  return stripLocalePrefix(normalizedPath) === "/";
}

export function markLanguageSwitchSkip(tone?: TransitionTone): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(LOADER_SKIP_KEY, "1");
    window.sessionStorage.setItem(PAGE_TRANSITION_PENDING_KEY, "1");
    if (tone) {
      window.sessionStorage.setItem(PAGE_TRANSITION_TONE_KEY, tone);
    }
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export function consumeCrossLayoutTransition(): {
  readonly active: boolean;
  readonly tone: TransitionTone;
} {
  if (typeof window === "undefined") {
    return { active: false, tone: "dark" };
  }
  try {
    const hadAttr =
      document.documentElement.getAttribute(PAGE_TRANSITION_COVER_ATTR) ===
      "true";
    const attrTone = document.documentElement.getAttribute(
      PAGE_TRANSITION_TONE_ATTR,
    );
    const hadKey =
      window.sessionStorage.getItem(PAGE_TRANSITION_PENDING_KEY) === "1";
    const storedTone = window.sessionStorage.getItem(PAGE_TRANSITION_TONE_KEY);

    if (hadKey) {
      window.sessionStorage.removeItem(PAGE_TRANSITION_PENDING_KEY);
    }
    if (storedTone !== null) {
      window.sessionStorage.removeItem(PAGE_TRANSITION_TONE_KEY);
    }

    const rawTone = attrTone ?? storedTone;
    const tone: TransitionTone = rawTone === "light" ? "light" : "dark";
    return { active: hadAttr || hadKey, tone };
  } catch {
    return { active: false, tone: "dark" };
  }
}

export function requestPageTransition(
  detail: PageTransitionEventDetail,
): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  const event = new CustomEvent<PageTransitionEventDetail>(
    PAGE_TRANSITION_EVENT,
    {
      detail,
      cancelable: true,
    },
  );
  return !window.dispatchEvent(event);
}
