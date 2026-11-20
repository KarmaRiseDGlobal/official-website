import { stripLocalePrefix, type SiteLanguage } from "@/lib/seo";

export const LOADER_SKIP_KEY = "karmarise-skip-loader-once";
export const LOADER_SKIP_ATTR = "data-loader-skip";
export const LOADER_DONE_ATTR = "data-loader-done";
export const PAGE_TRANSITION_PENDING_KEY = "karmarise-page-transition-once";
export const PAGE_TRANSITION_LABEL_KEY = "karmarise-page-transition-label";
export const PAGE_TRANSITION_COVER_ATTR = "data-transition-cover";
export const PAGE_TRANSITION_EVENT = "karmarise:navigate";

export interface PageTransitionEventDetail {
  readonly href: string;
  readonly isLanguageSwitch: boolean;
  readonly label?: string;
}

const ROUTE_TRANSITION_LABELS: Readonly<
  Record<string, Record<SiteLanguage, string>>
> = {
  "/": {
    en: "KarmaRise D Global",
    es: "KarmaRise D Global",
  },
  "/manufacturing-programme": {
    en: "Manufacturing Programme",
    es: "Programa de fabricación",
  },
  "/working-across-distance": {
    en: "Working across distance",
    es: "Trabajar a distancia",
  },
  "/product-brief": {
    en: "Product Brief",
    es: "Product Brief",
  },
  "/about": {
    en: "Alma & Shirish",
    es: "Alma y Shirish",
  },
  "/stories": {
    en: "Stories",
    es: "Historias",
  },
  "/almarise": {
    en: "Almarise",
    es: "Almarise",
  },
  "/womens-training-initiative": {
    en: "Women's Training Initiative",
    es: "Formación para mujeres",
  },
  "/book-a-call": {
    en: "Book a video call",
    es: "Reservar videollamada",
  },
  "/contact": {
    en: "Contact",
    es: "Contacto",
  },
  "/privacy-policy": {
    en: "Privacy policy",
    es: "Política de privacidad",
  },
  "/terms": {
    en: "Terms",
    es: "Condiciones",
  },
  "/cookie-policy": {
    en: "Cookie policy",
    es: "Política de cookies",
  },
  "/legal-notice": {
    en: "Legal notice",
    es: "Aviso legal",
  },
};

export const LOADER_PREPAINT_SCRIPT = `(() => {
  try {
    if (window.sessionStorage.getItem("${LOADER_SKIP_KEY}") === "1") {
      window.sessionStorage.removeItem("${LOADER_SKIP_KEY}");
      document.documentElement.setAttribute("${LOADER_SKIP_ATTR}", "true");
    }
    if (window.sessionStorage.getItem("${PAGE_TRANSITION_PENDING_KEY}") === "1") {
      document.documentElement.setAttribute("${PAGE_TRANSITION_COVER_ATTR}", "true");
    }
  } catch {}
})();`;

export const LOADER_CRITICAL_CSS = `
html:not([${LOADER_SKIP_ATTR}="true"]):not([${LOADER_DONE_ATTR}="true"]) {
  background: #111914;
  overflow: hidden;
}
html:not([${LOADER_SKIP_ATTR}="true"]):not([${LOADER_DONE_ATTR}="true"]) body > :not(.site-loader) {
  visibility: hidden;
}
`;

export const LOADER_NOSCRIPT_CSS = `
html { background: #f2ecdf !important; overflow: auto !important; }
body > :not(.site-loader) { visibility: visible !important; }
.site-loader { display: none !important; }
`;

export function resolveTransitionLabel(
  href: string,
  explicitLabel?: string,
): string {
  const trimmedExplicit = explicitLabel?.trim();
  if (trimmedExplicit) {
    return trimmedExplicit;
  }

  let pathname = href;
  try {
    pathname = new URL(href, "https://karmarisedglobal.invalid").pathname;
  } catch {
    pathname = href.split(/[?#]/)[0] || "/";
  }

  const normalizedPath = pathname.replace(/\/+$/, "") || "/";
  const targetLang: SiteLanguage =
    normalizedPath === "/es" || normalizedPath.startsWith("/es/") ? "es" : "en";
  const basePath = stripLocalePrefix(normalizedPath);

  const exactMatch = ROUTE_TRANSITION_LABELS[basePath];
  if (exactMatch) {
    return exactMatch[targetLang];
  }

  if (basePath.startsWith("/stories/")) {
    return targetLang === "es" ? "Historias" : "Stories";
  }

  return "KarmaRise D Global";
}

export function markLanguageSwitchSkip(label?: string): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(LOADER_SKIP_KEY, "1");
    window.sessionStorage.setItem(PAGE_TRANSITION_PENDING_KEY, "1");
    if (label?.trim()) {
      window.sessionStorage.setItem(PAGE_TRANSITION_LABEL_KEY, label.trim());
    }
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export function consumeCrossLayoutTransition(): {
  readonly active: boolean;
  readonly label: string | null;
} {
  if (typeof window === "undefined") {
    return { active: false, label: null };
  }
  try {
    const hadAttr =
      document.documentElement.getAttribute(PAGE_TRANSITION_COVER_ATTR) ===
      "true";
    const hadKey =
      window.sessionStorage.getItem(PAGE_TRANSITION_PENDING_KEY) === "1";
    const storedLabel = window.sessionStorage.getItem(
      PAGE_TRANSITION_LABEL_KEY,
    );
    if (hadKey) {
      window.sessionStorage.removeItem(PAGE_TRANSITION_PENDING_KEY);
    }
    if (storedLabel !== null) {
      window.sessionStorage.removeItem(PAGE_TRANSITION_LABEL_KEY);
    }
    return { active: hadAttr || hadKey, label: storedLabel };
  } catch {
    return { active: false, label: null };
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
