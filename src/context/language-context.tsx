"use client";

import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { captureSessionAttributionFromUrl } from "@/lib/client-handoff";
import {
  COOKIE_CONSENT_CHANGE_EVENT,
  COOKIE_CONSENT_STORAGE_KEY,
  hasAttributionConsent,
} from "@/lib/consent";
import {
  markLanguageSwitchSkip,
  requestPageTransition,
  resolveRouteTone,
} from "@/lib/loader";
import { localizePath, stripLocalePrefix, type SiteLanguage } from "@/lib/urls";

export type { SiteLanguage };

export interface LanguageOption {
  readonly code: SiteLanguage;
  readonly label: string;
  readonly shortLabel: string;
}

export const SUPPORTED_LANGUAGES: readonly LanguageOption[] = [
  { code: "en", label: "English", shortLabel: "EN" },
  { code: "es", label: "Español", shortLabel: "ES" },
];

const STORAGE_KEY = "karmarise-language";
const CHANGE_EVENT = "karmarise-language-change";

function isSiteLanguage(value: unknown): value is SiteLanguage {
  return (
    typeof value === "string" &&
    SUPPORTED_LANGUAGES.some((lang) => lang.code === value)
  );
}

function subscribeLanguage(onStoreChange: () => void): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(CHANGE_EVENT, onStoreChange);
  };
}

function getClientLanguageSnapshot(): SiteLanguage {
  try {
    const path = window.location.pathname;
    if (path === "/es" || path.startsWith("/es/")) {
      return "es";
    }
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (isSiteLanguage(saved)) {
      return saved;
    }
    const browserLocale = (
      navigator.language ||
      navigator.languages?.[0] ||
      "en"
    ).toLowerCase();
    return browserLocale.startsWith("es") ? "es" : "en";
  } catch {
    return "en";
  }
}

function getServerLanguageSnapshot(): SiteLanguage {
  return "en";
}

interface LanguageContextValue {
  language: SiteLanguage;
  setLanguage: (next: SiteLanguage) => void;
  languages: readonly LanguageOption[];
  localizeHref: (href: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: "en",
  setLanguage: () => {},
  languages: SUPPORTED_LANGUAGES,
  localizeHref: (href) => localizePath(href, "en"),
});

export function LanguageProvider({
  children,
  initialLanguage,
}: {
  children: ReactNode;
  initialLanguage?: SiteLanguage;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const storeLanguage = useSyncExternalStore(
    subscribeLanguage,
    getClientLanguageSnapshot,
    () => initialLanguage ?? getServerLanguageSnapshot(),
  );

  const language = initialLanguage ?? storeLanguage;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const syncAttribution = () => {
      if (hasAttributionConsent()) {
        captureSessionAttributionFromUrl();
      }
    };

    syncAttribution();

    const onConsentChange = () => {
      syncAttribution();
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === COOKIE_CONSENT_STORAGE_KEY) {
        syncAttribution();
      }
    };

    window.addEventListener(COOKIE_CONSENT_CHANGE_EVENT, onConsentChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(COOKIE_CONSENT_CHANGE_EVENT, onConsentChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [pathname]);

  const setLanguage = useCallback(
    (next: SiteLanguage) => {
      try {
        window.localStorage.setItem(STORAGE_KEY, next);
        window.dispatchEvent(new Event(CHANGE_EVENT));
      } catch {
        // Ignore storage errors in restricted environments
      }

      if (typeof window !== "undefined") {
        const currentPath = window.location.pathname || "/";
        const targetPath = localizePath(stripLocalePrefix(currentPath), next);
        if (targetPath !== currentPath) {
          const targetUrl = `${targetPath}${window.location.search}${window.location.hash}`;
          const handled = requestPageTransition({
            href: targetUrl,
            isLanguageSwitch: true,
          });
          if (!handled) {
            markLanguageSwitchSkip(resolveRouteTone(targetUrl));
            router.push(targetUrl);
          }
        }
      }
    },
    [router],
  );

  const localizeHref = useCallback(
    (href: string) => localizePath(href, language),
    [language],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      languages: SUPPORTED_LANGUAGES,
      localizeHref,
    }),
    [language, setLanguage, localizeHref],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
