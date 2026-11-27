"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { useLanguage } from "@/context/language-context";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  OPEN_COOKIE_SETTINGS_EVENT,
  readCookieConsent,
  writeCookieConsent,
  type CookieConsentLevel,
} from "@/lib/consent";
import {
  LOADER_DONE_ATTR,
  LOADER_EXITING_EVENT,
  LOADER_SKIP_ATTR,
} from "@/lib/loader";

const BANNER_COPY = {
  en: {
    dialogLabel: "Cookie and storage preferences",
    heading: "Cookies and local storage",
    body: "Essential storage runs the site, language, local brief drafts, and anti-bot checks. Optional attribution measures which letters or partners brought you here.",
    acceptAll: "Accept all",
    essentialOnly: "Essential only",
    policyLink: "Cookie policy",
    closeAria: "Close cookie preferences",
    currentAll: "Current: All accepted",
    currentEssential: "Current: Essential only",
  },
  es: {
    dialogLabel: "Preferencias de cookies y almacenamiento",
    heading: "Cookies y almacenamiento local",
    body: "El almacenamiento esencial gestiona la web, el idioma, tus borradores locales y el control antispam. La atribución opcional mide qué cartas o colaboradores te trajeron aquí.",
    acceptAll: "Aceptar todas",
    essentialOnly: "Solo esenciales",
    policyLink: "Política de cookies",
    closeAria: "Cerrar preferencias de cookies",
    currentAll: "Actual: Todas aceptadas",
    currentEssential: "Actual: Solo esenciales",
  },
} as const;

function subscribeConsent(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  const onStorage = (event: StorageEvent) => {
    if (event.key === null || event.key === COOKIE_CONSENT_STORAGE_KEY) {
      onStoreChange();
    }
  };
  window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, onStoreChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, onStoreChange);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerConsentSnapshot(): CookieConsentLevel | null {
  return null;
}

export function CookieConsentBanner() {
  const { language, localizeHref } = useLanguage();
  const copy = BANNER_COPY[language];

  const savedChoice = useSyncExternalStore(
    subscribeConsent,
    readCookieConsent,
    getServerConsentSnapshot,
  );

  const [isOpen, setIsOpen] = useState(false);
  const [wasReopened, setWasReopened] = useState(false);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dismissedForSessionRef = useRef(false);

  const restoreFocusIfNeeded = useCallback(() => {
    const previous = previousFocusRef.current;
    previousFocusRef.current = null;
    if (previous && previous.isConnected) {
      previous.focus();
    }
  }, []);

  const dismissBanner = useCallback(() => {
    dismissedForSessionRef.current = true;
    setIsOpen(false);
    setWasReopened(false);
    restoreFocusIfNeeded();
  }, [restoreFocusIfNeeded]);

  const handleChoose = useCallback(
    (level: CookieConsentLevel) => {
      writeCookieConsent(level);
      dismissedForSessionRef.current = true;
      setIsOpen(false);
      setWasReopened(false);
      restoreFocusIfNeeded();
    },
    [restoreFocusIfNeeded],
  );

  // Show smoothly after initial loader clears when no consent decision has been recorded yet.
  useEffect(() => {
    if (savedChoice !== null || dismissedForSessionRef.current) {
      return undefined;
    }

    let openTimer: number | null = null;
    const scheduleOpen = (delayMs: number) => {
      if (openTimer !== null) {
        window.clearTimeout(openTimer);
      }
      openTimer = window.setTimeout(() => {
        openTimer = null;
        if (readCookieConsent() === null && !dismissedForSessionRef.current) {
          setWasReopened(false);
          setIsOpen(true);
        }
      }, delayMs);
    };

    const loaderAlreadyDone =
      document.documentElement.getAttribute(LOADER_DONE_ATTR) === "true" ||
      document.documentElement.getAttribute(LOADER_SKIP_ATTR) === "true";

    if (loaderAlreadyDone) {
      scheduleOpen(280);
    }

    const onLoaderExiting = () => {
      scheduleOpen(340);
    };

    window.addEventListener(LOADER_EXITING_EVENT, onLoaderExiting, {
      once: true,
    });

    // Failsafe in case loader event fired before effect subscribed
    const fallbackTimer = window.setTimeout(() => {
      if (readCookieConsent() === null && !dismissedForSessionRef.current) {
        setWasReopened(false);
        setIsOpen(true);
      }
    }, 3400);

    return () => {
      if (openTimer !== null) {
        window.clearTimeout(openTimer);
      }
      window.clearTimeout(fallbackTimer);
      window.removeEventListener(LOADER_EXITING_EVENT, onLoaderExiting);
    };
  }, [savedChoice]);

  // Listen for reopen requests from footer or /cookie-policy and external tab changes.
  useEffect(() => {
    const onOpenSettings = () => {
      if (document.activeElement instanceof HTMLElement) {
        previousFocusRef.current = document.activeElement;
      }
      setWasReopened(true);
      setIsOpen(true);
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === COOKIE_CONSENT_STORAGE_KEY && readCookieConsent()) {
        setIsOpen(false);
        setWasReopened(false);
      }
    };

    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, onOpenSettings);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // Move focus cleanly when reopened explicitly by the user and support Escape dismissal.
  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    let frameId: number | null = null;
    if (wasReopened) {
      frameId = window.requestAnimationFrame(() => {
        headingRef.current?.focus();
      });
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        dismissBanner();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, wasReopened, dismissBanner]);

  if (!isOpen) {
    return null;
  }

  const policyArrowSvg = (
    <svg
      aria-hidden="true"
      className="editorial-arrow-icon shrink-0"
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8h9" />
      <path d="m8.75 4.25 3.75 3.75-3.75 3.75" />
    </svg>
  );

  return (
    <aside
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
      aria-label={copy.dialogLabel}
      data-cookie-banner="true"
      className="cookie-consent-banner fixed inset-x-3 bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] z-[calc(var(--z-modal)+20)] md:inset-x-auto md:start-4 md:end-20 md:bottom-2 lg:start-1/2 lg:end-auto lg:w-[min(62rem,calc(100vw-11rem))] lg:-translate-x-1/2"
    >
      <div className="cookie-consent-card relative flex flex-col gap-3 rounded-[var(--radius-card)] border border-[var(--color-control-border)] bg-[var(--color-paper)] p-4 text-[var(--color-ink)] shadow-[var(--shadow-popover)] md:flex-row md:items-center md:justify-between md:gap-5 md:px-5 md:py-2">
        <div className="min-w-0 flex-1 space-y-1 md:space-y-0.5">
          <div className="flex items-start justify-between gap-2 md:flex-wrap md:items-center md:justify-start md:gap-x-3 md:gap-y-0">
            <h2
              ref={headingRef}
              id="cookie-consent-title"
              tabIndex={-1}
              className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-md)] leading-[1.16] font-normal tracking-[var(--tracking-display)] text-[var(--color-forest-deep)] outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              {copy.heading}
            </h2>
            <Link
              href={localizeHref("/cookie-policy")}
              onClick={() => {
                if (savedChoice !== null) {
                  dismissBanner();
                }
              }}
              className="editorial-arrow-link hidden min-h-[var(--tap-min)] items-center gap-1.5 text-[length:var(--text-xs)] font-semibold whitespace-nowrap text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)] md:-my-3 md:inline-flex"
            >
              <span>{copy.policyLink}</span>
              {policyArrowSvg}
            </Link>
            {savedChoice !== null ? (
              <span className="hidden text-[length:var(--text-xs)] font-semibold text-[var(--color-forest)] md:inline">
                ·{" "}
                {savedChoice === "all"
                  ? copy.currentAll
                  : copy.currentEssential}
              </span>
            ) : null}
            {savedChoice !== null ? (
              <button
                type="button"
                onClick={dismissBanner}
                aria-label={copy.closeAria}
                className="-me-2 -mt-2 inline-grid h-[var(--tap-min)] w-[var(--tap-min)] shrink-0 cursor-pointer place-items-center rounded-[var(--radius-pill)] border-0 bg-transparent text-[var(--color-muted)] transition-colors hover:bg-[var(--color-dune)] hover:text-[var(--color-forest-deep)] md:hidden"
              >
                <svg
                  aria-hidden="true"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            ) : null}
          </div>

          <p
            id="cookie-consent-desc"
            className="m-0 text-[length:var(--text-xs)] leading-[1.42] text-[var(--color-ink-2)] md:leading-[1.34]"
          >
            {copy.body}
          </p>

          {savedChoice !== null ? (
            <p className="m-0 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest)] md:hidden">
              {savedChoice === "all" ? copy.currentAll : copy.currentEssential}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1 md:shrink-0 md:flex-row md:items-center md:gap-2">
          <div className="grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 md:flex md:items-center md:gap-2">
            <button
              type="button"
              onClick={() => handleChoose("all")}
              className="primary-button-light cookie-consent-btn"
            >
              {copy.acceptAll}
            </button>
            <button
              type="button"
              onClick={() => handleChoose("essential")}
              className="secondary-button-light cookie-consent-btn"
            >
              {copy.essentialOnly}
            </button>
          </div>

          <Link
            href={localizeHref("/cookie-policy")}
            onClick={() => {
              if (savedChoice !== null) {
                dismissBanner();
              }
            }}
            className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)] md:hidden"
          >
            <span>{copy.policyLink}</span>
            {policyArrowSvg}
          </Link>

          {savedChoice !== null ? (
            <button
              type="button"
              onClick={dismissBanner}
              aria-label={copy.closeAria}
              className="hidden h-[var(--tap-min)] w-[var(--tap-min)] shrink-0 cursor-pointer place-items-center rounded-[var(--radius-pill)] border-0 bg-transparent text-[var(--color-muted)] transition-colors hover:bg-[var(--color-dune)] hover:text-[var(--color-forest-deep)] md:inline-grid"
            >
              <svg
                aria-hidden="true"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
