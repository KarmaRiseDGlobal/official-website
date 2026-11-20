"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useRef, useState } from "react";

import { TurnstileField } from "@/components/turnstile-field";
import { useLanguage, type SiteLanguage } from "@/context/language-context";
import { stripLocalePrefix } from "@/lib/seo";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isFallbackNotice?: boolean;
}

interface StoredChatState {
  messages: ChatMessage[];
  sessionVerified?: boolean;
}

const STORAGE_KEY = "karmarise_chat_thread_v1";
const WHATSAPP_BASE = "https://wa.me/34611722276";
const WHATSAPP_HREF: Record<SiteLanguage, string> = {
  en: `${WHATSAPP_BASE}?text=${encodeURIComponent("Hello Alma and Shirish, I would like to chat about manufacturing with KarmaRise D Global.")}`,
  es: `${WHATSAPP_BASE}?text=${encodeURIComponent("Hola Alma y Shirish, me gustaría hablar sobre fabricación con KarmaRise D Global.")}`,
};
const CONTACT_EMAIL = "hola@karmarisedglobal.com";
const MAX_STORED_MESSAGES = 24;
const MAX_MESSAGE_CHARS = 600;
const BUILD_TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

const KNOWN_INTERNAL_ROUTES = new Set([
  "/product-brief",
  "/manufacturing-programme",
  "/working-across-distance",
  "/about",
  "/stories",
  "/almarise",
  "/womens-training-initiative",
  "/contact",
]);

const PRESET_QUESTIONS: Record<SiteLanguage, readonly string[]> = {
  en: [
    "What kinds of pieces can you manufacture across India?",
    "What do we need before starting a Product Brief?",
    "How do Alma and Shirish oversee samples and quality in person?",
    "How do minimum quantities and launch dates work for a Bulk Order?",
    "How do Almarise and the Women's Training Initiative connect to KarmaRise?",
  ],
  es: [
    "¿Qué tipo de piezas podéis fabricar en la India?",
    "¿Qué necesitamos definir antes de empezar un Product Brief?",
    "¿Cómo supervisan Alma y Shirish las muestras y la calidad en persona?",
    "¿Cómo funcionan las cantidades mínimas y los plazos de un pedido?",
    "¿Cómo encajan Almarise y la formación para mujeres en KarmaRise?",
  ],
};

const LOADING_MESSAGES: Record<SiteLanguage, readonly string[]> = {
  en: [
    "Checking our studio notes...",
    "Looking through the Product Brief notes...",
    "Pulling up the workshop details...",
    "Checking how we handle that in India...",
    "Reviewing our sampling steps...",
    "Checking what Alma and Shirish look for...",
    "Looking over the material notes...",
    "Checking our Bulk Order timeline notes...",
    "Pulling up the production sequence...",
    "Checking how we coordinate across Spain and India...",
    "Looking into the Manufacturing Partner criteria...",
    "Checking the quality check details...",
    "Reviewing our leather and garment notes...",
    "Looking through the Almarise notes...",
    "Checking the delivery and packing details...",
    "Pulling up what goes into a brief...",
    "Checking our notes on small and full runs...",
    "Reviewing how samples move to production...",
    "Checking our studio guidelines...",
    "Looking over the workshop checklist...",
    "Gathering the details for you...",
    "Putting a clear answer together...",
  ],
  es: [
    "Revisando nuestros apuntes del estudio...",
    "Repasando los detalles del Product Brief...",
    "Consultando las notas de taller...",
    "Comprobando cómo lo trabajamos en la India...",
    "Revisando los pasos de muestreo...",
    "Mirando qué revisan Alma y Shirish...",
    "Repasando las notas sobre materiales...",
    "Comprobando los plazos de pedido en serie...",
    "Consultando el orden de producción...",
    "Revisando cómo coordinamos España y la India...",
    "Mirando los criterios para elegir taller...",
    "Repasando los controles de calidad...",
    "Consultando nuestras notas de piel y confección...",
    "Revisando los apuntes sobre Almarise...",
    "Comprobando los detalles de envío y embalaje...",
    "Mirando qué conviene definir en el brief...",
    "Repasando tiradas cortas y pedidos en serie...",
    "Revisando el paso de muestra a producción...",
    "Consultando la guía del estudio...",
    "Repasando la lista de comprobación del taller...",
    "Reuniendo los detalles para ti...",
    "Preparando una respuesta clara...",
  ],
};

function createMessageId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function BrandMarkBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const boxClass = size === "sm" ? "h-7 w-7 p-1" : "h-9 w-9 p-1.5";
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--color-forest)]/30 bg-[var(--color-forest-deep)] ${boxClass}`}
    >
      <Image
        src="/brand/main-logo-transparent.png"
        alt=""
        width={701}
        height={815}
        className="h-full w-full object-contain [filter:brightness(0)_invert(96%)_sepia(12%)_saturate(349%)_hue-rotate(344deg)_brightness(103%)_contrast(93%)]"
      />
    </span>
  );
}

function WhatsAppBrandIcon({
  className = "h-3.5 w-3.5",
}: {
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block shrink-0 bg-current ${className}`}
      style={{
        maskImage: "url(/brand/icons/whatsapp.svg)",
        WebkitMaskImage: "url(/brand/icons/whatsapp.svg)",
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
      }}
    />
  );
}

function ProductBriefIcon({
  className = "h-3.5 w-3.5",
}: {
  className?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
    >
      <path d="M5.5 3.25h6.25L15.5 7v9.75a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-12.5a1 1 0 0 1 1-1Z" />
      <path d="M11.75 3.25V7h3.75" />
      <path d="M7.5 10.5h5" />
      <path d="M7.5 13.5h3.5" />
    </svg>
  );
}

function readStoredChatState(): StoredChatState {
  if (typeof window === "undefined") {
    return { messages: [] };
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { messages: [] };
    }
    const parsed = JSON.parse(raw) as Partial<StoredChatState>;
    if (!Array.isArray(parsed.messages)) {
      return { messages: [] };
    }

    const validMessages: ChatMessage[] = [];
    for (const item of parsed.messages.slice(-MAX_STORED_MESSAGES)) {
      if (
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim()
      ) {
        validMessages.push({
          id: typeof item.id === "string" ? item.id : createMessageId(),
          role: item.role,
          content: item.content,
          isFallbackNotice: Boolean(item.isFallbackNotice),
        });
      }
    }

    return {
      messages: validMessages,
      sessionVerified: Boolean(parsed.sessionVerified),
    };
  } catch {
    return { messages: [] };
  }
}

function writeStoredChatState(state: StoredChatState): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        messages: state.messages.slice(-MAX_STORED_MESSAGES),
        sessionVerified: Boolean(state.sessionVerified),
      }),
    );
  } catch {
    // Ignore storage quota or private browsing errors.
  }
}

function renderMessageContent(
  text: string,
  localizeHref: (href: string) => string,
  onNavigate: () => void,
): ReactNode[] {
  const tokenPattern =
    /(hola@karmarisedglobal\.com|(?:\/es)?\/(?:product-brief|manufacturing-programme|working-across-distance|about|stories|almarise|womens-training-initiative|contact)(?=$|[\s.,;:!?)]))/g;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  for (const match of text.matchAll(tokenPattern)) {
    const token = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    if (token === CONTACT_EMAIL) {
      nodes.push(
        <a
          key={`email-${matchIndex}`}
          href={`mailto:${CONTACT_EMAIL}`}
          className="underline decoration-current underline-offset-2"
        >
          {token}
        </a>,
      );
    } else {
      const normalized = stripLocalePrefix(token);
      if (KNOWN_INTERNAL_ROUTES.has(normalized)) {
        nodes.push(
          <Link
            key={`link-${matchIndex}`}
            href={localizeHref(normalized)}
            onClick={onNavigate}
            className="font-semibold underline decoration-current underline-offset-2"
          >
            {token}
          </Link>,
        );
      } else {
        nodes.push(token);
      }
    }

    lastIndex = start + token.length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

export function ChatWidget() {
  const { language, localizeHref } = useLanguage();
  const pathname = usePathname() || "/";
  const isEs = language === "es";

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [allowCustomInput, setAllowCustomInput] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [showFallbackActions, setShowFallbackActions] = useState(false);
  const [sessionVerified, setSessionVerified] = useState(false);
  const [runtimeTurnstileSiteKey, setRuntimeTurnstileSiteKey] = useState(
    BUILD_TURNSTILE_SITE_KEY,
  );
  const [turnstileRequired, setTurnstileRequired] = useState(
    Boolean(BUILD_TURNSTILE_SITE_KEY),
  );
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [statusError, setStatusError] = useState("");

  const containerRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestAnswerRef = useRef<HTMLDivElement>(null);
  const lastFocusedAnswerIdRef = useRef<string | null>(null);
  const hasSyncedConfigRef = useRef(false);
  const turnstileTokenRef = useRef("");

  function handleTurnstileTokenChange(token: string) {
    turnstileTokenRef.current = token;
    setTurnstileToken(token);
  }

  async function waitForTurnstileToken(timeoutMs = 2500): Promise<string> {
    if (turnstileTokenRef.current) {
      return turnstileTokenRef.current;
    }
    const maxAttempts = Math.max(1, Math.ceil(timeoutMs / 120));
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      if (turnstileTokenRef.current) {
        return turnstileTokenRef.current;
      }
    }
    return turnstileTokenRef.current;
  }

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        requestAnimationFrame(() => launcherRef.current?.focus());
      }
    };

    const onPointerDownOutside = (event: PointerEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDownOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDownOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isSending) return;
    const count = LOADING_MESSAGES[language].length;
    const intervalId = window.setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % count);
    }, 2400);
    return () => window.clearInterval(intervalId);
  }, [isSending, language]);

  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;
    if (messages.length === 0 && !isSending) {
      scrollRef.current.scrollTop = 0;
      return;
    }

    if (isSending) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      return;
    }

    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant" && latestAnswerRef.current) {
      const container = scrollRef.current;
      const targetTop = Math.max(
        0,
        latestAnswerRef.current.offsetTop - container.offsetTop - 12,
      );
      container.scrollTop = targetTop;

      if (lastFocusedAnswerIdRef.current !== lastMessage.id) {
        lastFocusedAnswerIdRef.current = lastMessage.id;
        if (document.activeElement !== inputRef.current) {
          latestAnswerRef.current.focus({ preventScroll: true });
        }
      }
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [isOpen, messages, isSending]);

  async function syncChatConfig(): Promise<{
    turnstileRequired: boolean;
    turnstileSiteKey: string;
    sessionVerified: boolean;
  } | null> {
    try {
      const response = await fetch("/api/chat", {
        method: "GET",
        cache: "no-store",
      });
      if (!response.ok) return null;

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        turnstileRequired?: boolean;
        turnstileSiteKey?: string;
        sessionVerified?: boolean;
      } | null;

      if (!data?.ok) return null;

      hasSyncedConfigRef.current = true;
      const nextSiteKey =
        typeof data.turnstileSiteKey === "string" && data.turnstileSiteKey
          ? data.turnstileSiteKey
          : runtimeTurnstileSiteKey;
      const nextRequired =
        typeof data.turnstileRequired === "boolean"
          ? data.turnstileRequired
          : turnstileRequired;
      const nextVerified =
        typeof data.sessionVerified === "boolean"
          ? data.sessionVerified
          : sessionVerified;

      if (nextSiteKey !== runtimeTurnstileSiteKey) {
        setRuntimeTurnstileSiteKey(nextSiteKey);
      }
      if (nextRequired !== turnstileRequired) {
        setTurnstileRequired(nextRequired);
      }
      if (nextVerified !== sessionVerified) {
        setSessionVerified(nextVerified);
      }

      return {
        turnstileRequired: nextRequired,
        turnstileSiteKey: nextSiteKey,
        sessionVerified: nextVerified,
      };
    } catch {
      return null;
    }
  }

  function openDrawer() {
    const stored = readStoredChatState();
    setMessages(stored.messages);
    setSessionVerified(Boolean(stored.sessionVerified));
    setShowFallbackActions(
      Boolean(stored.messages[stored.messages.length - 1]?.isFallbackNotice),
    );
    setIsOpen(true);
    void syncChatConfig();
    requestAnimationFrame(() => {
      if (allowCustomInput) {
        inputRef.current?.focus();
      } else {
        closeRef.current?.focus();
      }
    });
  }

  function closeDrawer() {
    setIsOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }

  function clearConversation() {
    setMessages([]);
    setAllowCustomInput(false);
    setInputValue("");
    setShowFallbackActions(false);
    setStatusError("");
    writeStoredChatState({
      messages: [],
      sessionVerified,
    });
    requestAnimationFrame(() => closeRef.current?.focus());
  }

  function enableCustomInput() {
    setAllowCustomInput(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  async function sendMessage(rawText: string) {
    const trimmed = rawText.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!trimmed || isSending) {
      return;
    }

    let synced: {
      turnstileRequired: boolean;
      turnstileSiteKey: string;
      sessionVerified: boolean;
    } | null = null;
    if (!hasSyncedConfigRef.current) {
      synced = await syncChatConfig();
    }

    const effectiveSiteKey =
      synced?.turnstileSiteKey ||
      runtimeTurnstileSiteKey ||
      BUILD_TURNSTILE_SITE_KEY;
    const effectiveRequired = synced?.turnstileRequired ?? turnstileRequired;
    const effectiveVerified = synced?.sessionVerified ?? sessionVerified;
    const mustCheckTurnstile =
      (effectiveRequired || Boolean(effectiveSiteKey)) && !effectiveVerified;

    if (mustCheckTurnstile && !effectiveSiteKey) {
      setStatusError(
        isEs
          ? "La verificación de seguridad no está configurada en este entorno. Usa Product Brief, Contacto o WhatsApp."
          : "Security verification is not configured on this environment. Please use Product Brief, Contact, or WhatsApp.",
      );
      setShowFallbackActions(true);
      return;
    }

    let activeTurnstileToken = turnstileTokenRef.current || turnstileToken;
    if (mustCheckTurnstile && !activeTurnstileToken) {
      setStatusError("");
      setIsSending(true);
      activeTurnstileToken = await waitForTurnstileToken();
      if (!activeTurnstileToken) {
        setIsSending(false);
        setStatusError(
          isEs
            ? "Completa la verificación de seguridad antes de enviar tu primera pregunta."
            : "Please complete the security check before sending your first question.",
        );
        return;
      }
    }

    const userMessage: ChatMessage = {
      id: createMessageId(),
      role: "user",
      content: trimmed,
    };

    const nextMessages = [...messages, userMessage].slice(-MAX_STORED_MESSAGES);
    setMessages(nextMessages);
    setInputValue("");
    setStatusError("");
    setLoadingMessageIndex(
      (prev) => (prev + 1) % LOADING_MESSAGES[language].length,
    );
    setIsSending(true);
    writeStoredChatState({
      messages: nextMessages,
      sessionVerified,
    });

    const historyForApi = messages
      .filter((item) => !item.isFallbackNotice)
      .slice(-8)
      .map((item) => ({ role: item.role, content: item.content }));

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          language,
          currentPath: pathname,
          history: historyForApi,
          companyWebsite,
          turnstileToken: effectiveVerified ? "" : activeTurnstileToken,
        }),
      });

      const payload = (await response.json().catch(() => null)) as {
        ok?: boolean;
        reply?: string;
        error?: string;
        code?: string;
        fallback?: boolean;
      } | null;

      if (response.ok && payload?.ok && typeof payload.reply === "string") {
        const assistantMessage: ChatMessage = {
          id: createMessageId(),
          role: "assistant",
          content: payload.reply,
        };
        const updatedMessages = [...nextMessages, assistantMessage].slice(
          -MAX_STORED_MESSAGES,
        );
        setMessages(updatedMessages);
        setSessionVerified(true);
        setShowFallbackActions(false);
        writeStoredChatState({
          messages: updatedMessages,
          sessionVerified: true,
        });
        return;
      }

      if (
        payload?.code === "turnstile_required" ||
        payload?.code === "turnstile_failed"
      ) {
        setSessionVerified(false);
        handleTurnstileTokenChange("");
        setTurnstileResetSignal((prev) => prev + 1);
        setStatusError(
          payload.error ||
            (isEs
              ? "Completa la verificación de seguridad para continuar."
              : "Please complete the security check to continue."),
        );
        return;
      }

      const fallbackText =
        payload?.error ||
        (isEs
          ? "El asistente no está disponible en este momento. Puedes escribirnos por WhatsApp, usar la página de contacto o iniciar un Product Brief."
          : "The assistant is unavailable right now. You can reach our team via WhatsApp, Contact, or a Product Brief.");

      const fallbackMessage: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        content: fallbackText,
        isFallbackNotice: true,
      };
      const updatedMessages = [...nextMessages, fallbackMessage].slice(
        -MAX_STORED_MESSAGES,
      );
      setMessages(updatedMessages);
      if (payload?.fallback || response.status >= 429) {
        setShowFallbackActions(true);
      }
      writeStoredChatState({
        messages: updatedMessages,
        sessionVerified,
      });
    } catch {
      const networkFallback: ChatMessage = {
        id: createMessageId(),
        role: "assistant",
        content: isEs
          ? "No pudimos conectar con el asistente ahora mismo. Puedes continuar directamente por WhatsApp o desde la página de contacto."
          : "We could not reach the assistant right now. You can continue directly via WhatsApp or our Contact page.",
        isFallbackNotice: true,
      };
      const updatedMessages = [...nextMessages, networkFallback].slice(
        -MAX_STORED_MESSAGES,
      );
      setMessages(updatedMessages);
      setShowFallbackActions(true);
      writeStoredChatState({
        messages: updatedMessages,
        sessionVerified,
      });
    } finally {
      setIsSending(false);
    }
  }

  function handleFormSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(inputValue);
  }

  const presetQuestions = PRESET_QUESTIONS[language];
  const loadingMessages = LOADING_MESSAGES[language];
  const activeLoadingMessage =
    loadingMessages[loadingMessageIndex % loadingMessages.length] ??
    loadingMessages[0];
  const whatsappHref = WHATSAPP_HREF[language];
  const assistantReplyCount = messages.filter(
    (item) => item.role === "assistant" && !item.isFallbackNotice,
  ).length;
  const effectiveSiteKey = runtimeTurnstileSiteKey || BUILD_TURNSTILE_SITE_KEY;
  const needsTurnstile =
    Boolean(effectiveSiteKey) &&
    (turnstileRequired || Boolean(BUILD_TURNSTILE_SITE_KEY)) &&
    !sessionVerified;

  return (
    <div
      ref={containerRef}
      className="fixed right-4 bottom-4 z-[calc(var(--z-modal)+50)] sm:right-6 sm:bottom-6"
    >
      {!isOpen ? (
        <button
          ref={launcherRef}
          type="button"
          onClick={openDrawer}
          aria-expanded="false"
          aria-controls="karmarise-chat-drawer"
          className="inline-flex min-h-[48px] cursor-pointer items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--color-rule-2)] bg-[var(--color-paper)] pr-4 pl-2.5 text-[length:var(--text-sm)] font-medium text-[var(--color-ink)] shadow-[var(--shadow-card)] transition-transform duration-[var(--dur-short)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:border-[var(--color-wood)] hover:bg-[var(--color-white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          <BrandMarkBadge size="sm" />
          <span>{isEs ? "¿Alguna duda?" : "Questions?"}</span>
        </button>
      ) : (
        <section
          id="karmarise-chat-drawer"
          role="dialog"
          aria-modal="false"
          aria-label={
            isEs ? "Guía de KarmaRise D Global" : "KarmaRise D Global guide"
          }
          className="flex max-h-[min(660px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)] shadow-[var(--shadow-card)]"
        >
          <header className="flex items-center justify-between gap-3 border-b border-[var(--color-rule)]/70 px-5 py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <BrandMarkBadge size="sm" />
              <p className="font-[family-name:var(--font-display)] text-[length:var(--text-md)] leading-none font-normal text-[var(--color-ink)]">
                KarmaRise D Global
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              {messages.length > 0 ? (
                <button
                  type="button"
                  onClick={clearConversation}
                  className="cursor-pointer px-1.5 py-1 text-[length:var(--text-xs)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
                >
                  {isEs ? "Limpiar" : "Clear"}
                </button>
              ) : null}
              <button
                ref={closeRef}
                type="button"
                onClick={closeDrawer}
                aria-label={isEs ? "Cerrar chat" : "Close chat"}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--color-rule)] text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-wood)] hover:bg-[var(--color-white)]/70 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  className="h-3.5 w-3.5"
                >
                  <path d="M4 4l8 8M12 4l-8 8" />
                </svg>
              </button>
            </div>
          </header>

          <div
            ref={scrollRef}
            data-lenis-prevent
            className="grid flex-1 content-start gap-3.5 overflow-y-auto overscroll-contain px-5 py-4"
          >
            <p className="text-[length:var(--text-sm)] leading-relaxed text-[var(--color-ink-2)]">
              {isEs
                ? "Hola, desde la India y España. ¿Qué pieza tienes en mente?"
                : "Hello, from India and Spain. What are you looking to make?"}
            </p>

            {messages.map((item, index) => {
              const isLatestAssistant =
                item.role === "assistant" && index === messages.length - 1;
              return (
                <div
                  key={item.id}
                  ref={isLatestAssistant ? latestAnswerRef : undefined}
                  tabIndex={isLatestAssistant ? -1 : undefined}
                  className={
                    item.role === "user"
                      ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--color-wood)] px-3.5 py-2.5 text-[length:var(--text-sm)] leading-relaxed text-[var(--color-paper)]"
                      : "mr-auto max-w-[92%] rounded-2xl rounded-bl-sm border border-[var(--color-rule)]/80 bg-[var(--color-white)]/90 px-3.5 py-2.5 text-[length:var(--text-sm)] leading-relaxed whitespace-pre-line text-[var(--color-ink)] focus:outline-none"
                  }
                >
                  {item.role === "assistant"
                    ? renderMessageContent(item.content, localizeHref, () =>
                        setIsOpen(false),
                      )
                    : item.content}
                </div>
              );
            })}

            {isSending ? (
              <div
                role="status"
                className="mr-auto inline-flex items-center gap-2 rounded-2xl rounded-bl-sm border border-[var(--color-rule)]/80 bg-[var(--color-white)]/90 px-3.5 py-2.5 text-[length:var(--text-xs)] text-[var(--color-muted)]"
              >
                <span
                  aria-hidden="true"
                  className="inline-flex items-center gap-1"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-clay)]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-clay)] [animation-delay:180ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--color-clay)] [animation-delay:360ms]" />
                </span>
                <span>{activeLoadingMessage}</span>
              </div>
            ) : null}

            {!isSending ? (
              <div className="divide-y divide-[var(--color-rule)]/55 overflow-hidden rounded-xl border border-[var(--color-rule)]/80 bg-[var(--color-white)]/65">
                {presetQuestions.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={isSending}
                    onClick={() => {
                      void sendMessage(prompt);
                    }}
                    className="group flex w-full cursor-pointer items-center justify-between gap-3 px-3.5 py-2.5 text-left text-[length:var(--text-xs)] leading-snug font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-white)] disabled:opacity-50"
                  >
                    <span>{prompt}</span>
                    <span
                      aria-hidden="true"
                      className="shrink-0 text-[var(--color-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--color-wood)]"
                    >
                      →
                    </span>
                  </button>
                ))}
              </div>
            ) : null}

            {assistantReplyCount >= 4 && !isSending && !showFallbackActions ? (
              <div className="grid gap-2 border-t border-[var(--color-rule)]/60 pt-3 text-[length:var(--text-xs)] leading-relaxed text-[var(--color-ink-2)]">
                <p>
                  {isEs
                    ? "Cuando quieras comentar una pieza directamente, puedes escribir a Alma o Shirish por WhatsApp o compartirnos un Product Brief."
                    : "Whenever you are ready to talk a piece through directly, you can message Alma or Shirish on WhatsApp or send us a Product Brief."}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-forest)]/35 bg-[var(--color-white)]/85 px-3 py-1.5 font-medium text-[var(--color-forest-deep)] no-underline transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-white)]"
                  >
                    <WhatsAppBrandIcon className="h-3.5 w-3.5 text-[var(--color-forest)]" />
                    <span>
                      {isEs
                        ? "WhatsApp con Alma o Shirish"
                        : "WhatsApp Alma or Shirish"}
                    </span>
                  </a>
                  <Link
                    href={localizeHref("/product-brief")}
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-clay)]/45 bg-[var(--color-white)]/85 px-3 py-1.5 font-medium text-[var(--color-clay-ink)] no-underline transition-colors hover:border-[var(--color-clay-ink)] hover:bg-[var(--color-white)]"
                  >
                    <ProductBriefIcon className="h-3.5 w-3.5 text-[var(--color-clay-ink)]" />
                    <span>
                      {isEs
                        ? "Iniciar un Product Brief"
                        : "Start a Product Brief"}
                    </span>
                  </Link>
                </div>
              </div>
            ) : null}

            {showFallbackActions ? (
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href={localizeHref("/product-brief")}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] bg-[var(--color-wood)] px-3 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-paper)] no-underline"
                >
                  <ProductBriefIcon className="h-3.5 w-3.5 text-[var(--color-clay-light)]" />
                  <span>
                    {isEs ? "Iniciar Product Brief" : "Start Product Brief"}
                  </span>
                </Link>
                <Link
                  href={localizeHref("/contact")}
                  onClick={() => setIsOpen(false)}
                  className="rounded-[var(--radius-pill)] border border-[var(--color-rule-2)] bg-[var(--color-white)]/80 px-3 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-ink)] no-underline"
                >
                  {isEs ? "Contacto" : "Contact"}
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-forest)]/35 bg-[var(--color-white)]/85 px-3 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)] no-underline"
                >
                  <WhatsAppBrandIcon className="h-3.5 w-3.5 text-[var(--color-forest)]" />
                  <span>
                    {isEs
                      ? "WhatsApp con Alma o Shirish"
                      : "WhatsApp Alma or Shirish"}
                  </span>
                </a>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="grid gap-2.5 border-t border-[var(--color-rule)]/70 px-5 py-3"
          >
            <input
              type="text"
              name="companyWebsite"
              value={companyWebsite}
              onChange={(event) => setCompanyWebsite(event.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="sr-only"
            />

            {needsTurnstile ? (
              <TurnstileField
                siteKey={effectiveSiteKey}
                language={language}
                theme="light"
                appearance="interaction-only"
                size="flexible"
                resetSignal={turnstileResetSignal}
                onTokenChange={handleTurnstileTokenChange}
              />
            ) : null}

            {statusError ? (
              <p
                role="status"
                className="text-[length:var(--text-xs)] font-medium text-[var(--color-clay-ink)]"
              >
                {statusError}
              </p>
            ) : null}

            {allowCustomInput ? (
              <div className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-[var(--color-rule-2)] bg-[var(--color-white)] pr-1.5 pl-3.5 focus-within:border-[var(--color-wood)]">
                <label htmlFor="karmarise-chat-input" className="sr-only">
                  {isEs ? "Escribe tu pregunta" : "Write your question"}
                </label>
                <input
                  ref={inputRef}
                  id="karmarise-chat-input"
                  type="text"
                  maxLength={MAX_MESSAGE_CHARS}
                  value={inputValue}
                  onChange={(event) => setInputValue(event.target.value)}
                  placeholder={
                    isEs ? "Escribe tu pregunta..." : "Ask a question..."
                  }
                  className="h-10 min-w-0 flex-1 bg-transparent text-[length:var(--text-sm)] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/75 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setAllowCustomInput(false)}
                  aria-label={isEs ? "Ocultar teclado" : "Close text input"}
                  className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full text-[var(--color-muted)] transition-colors hover:bg-[var(--color-paper)] hover:text-[var(--color-ink)]"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    className="h-3 w-3"
                  >
                    <path d="M4 4l8 8M12 4l-8 8" />
                  </svg>
                </button>
                <button
                  type="submit"
                  disabled={isSending || !inputValue.trim()}
                  aria-label={isEs ? "Enviar" : "Send"}
                  className="inline-flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--color-wood)] text-[var(--color-paper)] transition-colors hover:bg-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M3 8h10M9 4l4 4-4 4" />
                  </svg>
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between gap-3 text-[length:var(--text-xs)]">
                <button
                  type="button"
                  onClick={enableCustomInput}
                  className="cursor-pointer font-medium text-[var(--color-ink-2)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-ink)]"
                >
                  {isEs ? "Escribir otra pregunta" : "Ask something else"}
                </button>
                <Link
                  href={localizeHref("/product-brief")}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 font-medium text-[var(--color-clay-ink)] underline decoration-[var(--color-clay)]/50 underline-offset-4 hover:text-[var(--color-wood)]"
                >
                  <ProductBriefIcon className="h-3.5 w-3.5" />
                  <span>
                    {isEs
                      ? "Iniciar un Product Brief"
                      : "Start a Product Brief"}
                  </span>
                </Link>
              </div>
            )}
          </form>
        </section>
      )}
    </div>
  );
}
