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
const TURNSTILE_SCRIPT_TIMEOUT_MS = 12_000;
const NARROW_CONTAINER_THRESHOLD_PX = 316;

function resolveResponsiveTurnstileSize(
  requestedSize: "normal" | "compact" | "flexible",
  element: HTMLElement,
): "normal" | "compact" | "flexible" {
  if (requestedSize !== "flexible") {
    return requestedSize;
  }
  const containerWidth =
    element.clientWidth || element.parentElement?.clientWidth || 0;
  if (containerWidth > 0 && containerWidth < NARROW_CONTAINER_THRESHOLD_PX) {
    return "compact";
  }
  return "flexible";
}

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
    let settled = false;
    const cleanupTimeout = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      turnstileScriptPromise = null;
      delete window.__karmaTurnstileOnLoad;
      reject(new Error("Timed out loading Cloudflare Turnstile script."));
    }, TURNSTILE_SCRIPT_TIMEOUT_MS);

    const finishResolve = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(cleanupTimeout);
      delete window.__karmaTurnstileOnLoad;
      resolve();
    };

    const finishReject = (scriptElement?: HTMLScriptElement) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(cleanupTimeout);
      turnstileScriptPromise = null;
      delete window.__karmaTurnstileOnLoad;
      scriptElement?.remove();
      reject(new Error("Failed to load Cloudflare Turnstile script."));
    };

    window.__karmaTurnstileOnLoad = finishResolve;

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-turnstile-api="true"]',
    );
    if (existingScript) {
      if (window.turnstile) {
        finishResolve();
        return;
      }
      existingScript.addEventListener(
        "load",
        () => {
          if (window.turnstile) {
            finishResolve();
          }
        },
        { once: true },
      );
      existingScript.addEventListener(
        "error",
        () => finishReject(existingScript),
        { once: true },
      );
      return;
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.dataset.turnstileApi = "true";
    script.onload = () => {
      if (window.turnstile) {
        finishResolve();
      }
    };
    script.onerror = () => finishReject(script);
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
  appearance = "interaction-only",
  size = "flexible",
  className,
}: TurnstileFieldProps) {
  const resolvedSiteKey = siteKey?.trim() || TURNSTILE_SITE_KEY;
  const containerRef = useRef<HTMLDivElement | null>(null);
  const widgetIdRef = useRef<string | null>(null);
  const onTokenChangeRef = useRef(onTokenChange);
  const prevResetSignalRef = useRef(resetSignal);

  const [retryNonce, setRetryNonce] = useState(0);
  const configKey = `${resolvedSiteKey}:${language}:${theme}:${appearance}:${size}:${retryNonce}`;
  const activeKey = `${configKey}:${resetSignal ?? 0}`;
  const activeKeyRef = useRef(activeKey);
  const [errorConfigKey, setErrorConfigKey] = useState<string | null>(null);
  const [verifiedKey, setVerifiedKey] = useState<string | null>(null);
  const hasError = errorConfigKey === configKey;
  const isVerified = verifiedKey === activeKey;

  useEffect(() => {
    onTokenChangeRef.current = onTokenChange;
  }, [onTokenChange]);

  useEffect(() => {
    activeKeyRef.current = activeKey;
  }, [activeKey]);

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

        const effectiveSize = resolveResponsiveTurnstileSize(
          size,
          containerRef.current,
        );

        setErrorConfigKey(null);
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: resolvedSiteKey,
          language: language === "es" ? "es" : "en",
          theme,
          appearance,
          size: effectiveSize,
          callback: (token) => {
            setErrorConfigKey(null);
            setVerifiedKey(activeKeyRef.current);
            onTokenChangeRef.current(token);
          },
          "expired-callback": () => {
            setVerifiedKey(null);
            onTokenChangeRef.current("");
            if (widgetIdRef.current !== null && window.turnstile) {
              window.turnstile.reset(widgetIdRef.current);
            }
          },
          "timeout-callback": () => {
            setVerifiedKey(null);
            onTokenChangeRef.current("");
            if (widgetIdRef.current !== null && window.turnstile) {
              window.turnstile.reset(widgetIdRef.current);
            }
          },
          "error-callback": () => {
            setVerifiedKey(null);
            onTokenChangeRef.current("");
            setErrorConfigKey(configKey);
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          setVerifiedKey(null);
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
            ? "cf-turnstile-host w-full min-w-0 overflow-visible"
            : "cf-turnstile-host min-h-[65px] w-full min-w-0 overflow-visible"
        }
      />
      {!hasError && appearance === "interaction-only" ? (
        <p
          aria-live="polite"
          className={`inline-flex items-center gap-1.5 text-xs leading-tight ${
            theme === "dark"
              ? "text-[var(--color-paper-2)]/70"
              : "text-[var(--color-muted)]"
          }`}
        >
          <span
            aria-hidden="true"
            className={`inline-block h-1.5 w-1.5 rounded-full transition-colors ${
              isVerified
                ? "bg-[var(--color-sage)]"
                : theme === "dark"
                  ? "bg-[var(--color-paper-2)]/40"
                  : "bg-[var(--color-muted)]/45"
            }`}
          />
          <span>
            {isVerified
              ? language === "es"
                ? "Verificado · Cloudflare"
                : "Verified · Cloudflare"
              : language === "es"
                ? "Protegido por Cloudflare"
                : "Protected by Cloudflare"}
          </span>
        </p>
      ) : null}
      {hasError ? (
        <div
          role="status"
          className={`flex flex-wrap items-center gap-2 text-[length:var(--text-xs)] ${
            theme === "dark"
              ? "text-[var(--color-gold)]"
              : "text-[var(--color-clay-ink)]"
          }`}
        >
          <span>
            {language === "es"
              ? "No se pudo cargar la verificación de seguridad."
              : "Security verification could not load."}
          </span>
          <button
            type="button"
            onClick={() => {
              setErrorConfigKey(null);
              setVerifiedKey(null);
              setRetryNonce((value) => value + 1);
            }}
            className="cursor-pointer font-semibold underline underline-offset-4 hover:opacity-80"
          >
            {language === "es" ? "Reintentar" : "Retry check"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
