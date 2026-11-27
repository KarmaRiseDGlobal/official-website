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

export const DARK_HERO_ROUTES: ReadonlySet<string> = new Set([
  "/",
  "/how-we-work",
  "/almarise",
  "/manufacturing",
  "/stories",
]);

export const LOADER_PREPAINT_SCRIPT = `(() => {
  try {
    const reducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const skipOnce =
      window.sessionStorage.getItem("${LOADER_SKIP_KEY}") === "1";
    if (skipOnce) {
      window.sessionStorage.removeItem("${LOADER_SKIP_KEY}");
    }
    const pendingTransition =
      window.sessionStorage.getItem("${PAGE_TRANSITION_PENDING_KEY}") === "1";
    if (pendingTransition) {
      document.documentElement.setAttribute("${PAGE_TRANSITION_COVER_ATTR}", "true");
      const tone = window.sessionStorage.getItem("${PAGE_TRANSITION_TONE_KEY}");
      if (tone === "dark" || tone === "light") {
        document.documentElement.setAttribute("${PAGE_TRANSITION_TONE_ATTR}", tone);
      }
    }
    if (reducedMotion || skipOnce || pendingTransition) {
      document.documentElement.setAttribute("${LOADER_SKIP_ATTR}", "true");
      document.documentElement.setAttribute("${LOADER_DONE_ATTR}", "true");
    } else {
      window.setTimeout(() => {
        if (document.documentElement.getAttribute("${LOADER_DONE_ATTR}") !== "true") {
          document.documentElement.setAttribute("${LOADER_SKIP_ATTR}", "true");
          document.documentElement.setAttribute("${LOADER_DONE_ATTR}", "true");
        }
      }, 5500);
    }
  } catch {
    document.documentElement.setAttribute("${LOADER_SKIP_ATTR}", "true");
    document.documentElement.setAttribute("${LOADER_DONE_ATTR}", "true");
  }
})();`;

export const LOADER_CRITICAL_CSS = `
html:not([${LOADER_SKIP_ATTR}="true"]):not([${LOADER_DONE_ATTR}="true"]) {
  background: #111914;
  overflow: clip;
}
html[${LOADER_SKIP_ATTR}="true"] .site-loader {
  display: none !important;
}
.site-loader {
  position: fixed;
  inset: 0;
  z-index: 1000;
}
.site-loader-veil {
  position: absolute;
  inset: 0;
  background: #182d20;
}
.site-loader-curtain {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  background: #111914;
}
.site-loader-flood {
  flood-color: #f2ecdf;
}
`;

export const LOADER_NOSCRIPT_CSS = `
html { background: #f2ecdf !important; overflow: auto !important; }
.site-loader { display: none !important; }
`;

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

/**
 * Runs a hero entrance choreography only after web fonts are ready AND the
 * initial SiteLoader curtain has begun lifting (preventing hero animations
 * from finishing unseen behind the opaque curtain). Returns a cleanup callback.
 */
export function scheduleHeroAfterLoader(
  run: (options: { readonly introDelay: number }) => void,
): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  let cancelled = false;
  let fired = false;
  let fontsReady = !document.fonts?.ready;
  let loaderReleased =
    document.documentElement.getAttribute(LOADER_DONE_ATTR) === "true" ||
    document.documentElement.getAttribute(LOADER_SKIP_ATTR) === "true";
  const waitedForLoader = !loaderReleased;

  const tryRun = () => {
    if (cancelled || fired || !fontsReady || !loaderReleased) {
      return;
    }
    fired = true;
    window.clearTimeout(safetyTimer);
    window.removeEventListener(LOADER_EXITING_EVENT, onLoaderExiting);
    // Start immediately behind the still-closed curtain at LOADER_EXITING_EVENT
    // so SplitText masks initialize with zero flash, while the tween delay lets
    // the motion play right as the dark curtain and botanical veil lift across
    // the hero. Client navigations (already done) start with zero delay.
    run({ introDelay: waitedForLoader ? 0.3 : 0 });
  };

  const onLoaderExiting = () => {
    loaderReleased = true;
    tryRun();
  };

  const safetyTimer = window.setTimeout(() => {
    fontsReady = true;
    loaderReleased = true;
    tryRun();
  }, 5000);

  if (!loaderReleased) {
    window.addEventListener(LOADER_EXITING_EVENT, onLoaderExiting, {
      once: true,
    });
  }

  if (document.fonts?.ready) {
    void document.fonts.ready.then(
      () => {
        fontsReady = true;
        tryRun();
      },
      () => {
        fontsReady = true;
        tryRun();
      },
    );
  } else {
    tryRun();
  }

  return () => {
    cancelled = true;
    window.clearTimeout(safetyTimer);
    window.removeEventListener(LOADER_EXITING_EVENT, onLoaderExiting);
  };
}
