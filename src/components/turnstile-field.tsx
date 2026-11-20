"use client";

import { useEffect, useRef, useState } from "react";

import type { SiteLanguage } from "@/context/language-context";

const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
const TURNSTILE_SCRIPT_SRC =
  "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=__karmaTurnstileOnLoad";

interface TurnstileRenderOptions {
  sitekey: string;
  language?: string;
  theme?: "auto" | "light" | "dark";
  appearance?: "always" | "execute" | "interaction-only";
  size?: "normal" | "compact" | "flexible";
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "timeout-callback"?: () => void;
  "error-callback"?: () => void;
}

interface TurnstileApi {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  reset: (widgetId?: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __karmaTurnstileOnLoad?: () => void;
  }
}

let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") {
    return Promise.reject(
      new Error("Turnstile requires a browser environment."),
    );
  }

  if (window.turnstile) {
    return Promise.resolve();
  }

  if (turnstileScriptPromise) {
    return turnstileScriptPromise;
  }

  turnstileScriptPromise = new Promise<void>((resolve, reject) => {
    window.__karmaTurnstileOnLoad = () => {
      delete window.__karmaTurnstileOnLoad;
      resolve();
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-turnstile-api="true"]',
    );
    if (existingScript) {
      existingScript.addEventListener(
        "error",
        () => {
          turnstileScriptPromise = null;
          delete window.__karmaTurnstileOnLoad;
          reject(new Error("Failed to load Cloudflare Turnstile script."));
        },
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.dataset.turnstileApi = "true";
    script.onerror = () => {
      turnstileScriptPromise = null;
      delete window.__karmaTurnstileOnLoad;
      script.remove();
      reject(new Error("Failed to load Cloudflare Turnstile script."));
    };
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

export interface TurnstileFieldProps {
  onTokenChange: (token: string) => void;
  siteKey?: string;
  language?: SiteLanguage;
  resetSignal?: number;
  theme?: "auto" | "light" | "dark";
  appearance?: "always" | "execute" | "interaction-only";
  size?: "normal" | "compact" | "flexible";
  className?: string;
}

export function TurnstileField({
  onTokenChange,
  siteKey,
  language = "en",
  resetSignal,
  theme = "auto",
  appearance = "always",
  size = "flexible",
  className,
}: TurnstileFieldProps) {
  const resolvedSiteKey = siteKey?.trim() || TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const prevResetSignalRef = useRef(resetSignal);

  const configKey = `${resolvedSiteKey}:${language}:${theme}:${appearance}:${size}`;
  const [errorConfigKey, setErrorConfigKey] = useState<string | null>(null);
  const hasError = errorConfigKey === configKey;

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    if (!resolvedSiteKey) {
      return;
    }

    let cancelled = false;
    onTokenChangeRef.current("");

    void loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) {
          return;
        }

        if (widgetIdRef.current !== null) {
          window.turnstile.remove(widgetIdRef.current);
          widgetIdRef.current = null;
        }

        setErrorConfigKey(null);
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: resolvedSiteKey,
          language: language === "es" ? "es" : "en",
          theme,
          appearance,
          size,
          callback: (token) => {
            setErrorConfigKey(null);
            onTokenChangeRef.current(token);
          },
          "expired-callback": () => {
            onTokenChangeRef.current("");
          },
          "timeout-callback": () => {
            onTokenChangeRef.current("");
          },
          "error-callback": () => {
            onTokenChangeRef.current("");
            setErrorConfigKey(configKey);
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          onTokenChangeRef.current("");
          setErrorConfigKey(configKey);
        }
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [appearance, configKey, language, resolvedSiteKey, size, theme]);

  useEffect(() => {
    if (!resolvedSiteKey) {
      return;
    }

    if (resetSignal !== prevResetSignalRef.current) {
      prevResetSignalRef.current = resetSignal;
      onTokenChangeRef.current("");
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current);
      }
    }
  }, [resetSignal, resolvedSiteKey]);

  if (!resolvedSiteKey) {
    return null;
  }

  return (
    <div
      className={
        className
          ? `grid max-w-full min-w-0 gap-1.5 ${className}`
          : "grid max-w-full min-w-0 gap-1.5"
      }
    >
      <div
        ref={containerRef}
        className={
          appearance === "interaction-only"
            ? "max-w-full overflow-x-auto"
            : "min-h-[65px] max-w-full overflow-x-auto"
        }
      />
      {hasError ? (
        <p
          role="status"
          className={`text-[length:var(--text-xs)] ${
            theme === "dark"
              ? "text-[var(--color-gold)]"
              : "text-[var(--color-clay-ink)]"
          }`}
        >
          {language === "es"
            ? "No se pudo cargar la verificación de seguridad. Recarga la página o revisa los bloqueadores."
            : "Security verification could not load. Please refresh or disable blockers for this site."}
        </p>
      ) : null}
    </div>
  );
}
