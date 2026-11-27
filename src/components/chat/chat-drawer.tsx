"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  BrandMarkBadge,
  createMessageId,
  getGreetingForRoute,
  getPresetsForRoute,
  LOADING_MESSAGES,
  MAX_MESSAGE_CHARS,
  MAX_STORED_MESSAGES,
  readStoredChatState,
  renderMessageContent,
  WHATSAPP_HREF,
  writeStoredChatState,
  type ChatMessage,
} from "@/components/chat/chat-drawer-helpers";
import { TurnstileField } from "@/components/forms/turnstile-field";
import { useLanguage } from "@/context/language-context";

const BUILD_TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";

interface ChatDrawerProps {
  pathname: string;
  basePath: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onClose: () => void;
}

export function ChatDrawer({
  pathname,
  basePath,
  containerRef,
  onClose,
}: ChatDrawerProps) {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  const [messages, setMessages] = useState<ChatMessage[]>(
    () => readStoredChatState().messages,
  );
  const [clearedSnapshot, setClearedSnapshot] = useState<ChatMessage[] | null>(
    null,
  );
  const [assistantAnnouncement, setAssistantAnnouncement] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [showFallbackActions, setShowFallbackActions] = useState<boolean>(
    () => {
      const stored = readStoredChatState();
      return Boolean(
        stored.messages[stored.messages.length - 1]?.isFallbackNotice,
      );
    },
  );
  const [sessionVerified, setSessionVerified] = useState<boolean>(() =>
    Boolean(readStoredChatState().sessionVerified),
  );
  const [runtimeTurnstileSiteKey, setRuntimeTurnstileSiteKey] = useState(
    BUILD_TURNSTILE_SITE_KEY,
  );
  const [turnstileRequired, setTurnstileRequired] = useState(
    Boolean(BUILD_TURNSTILE_SITE_KEY),
  );
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [drawerMaxHeight, setDrawerMaxHeight] = useState<number | null>(null);

  const closeRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const latestAnswerRef = useRef<HTMLDivElement>(null);
  const lastAnnouncedAnswerIdRef = useRef<string | null>(null);
  const hasSyncedConfigRef = useRef(false);
  const turnstileTokenRef = useRef("");

  function handleTurnstileTokenChange(token: string) {
    turnstileTokenRef.current = token;
    setTurnstileToken(token);
    if (token) {
      setTurnstileFailed(false);
    }
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

  useEffect(() => {
    const initialLast = readStoredChatState().messages.at(-1);
    if (initialLast?.role === "assistant") {
      lastAnnouncedAnswerIdRef.current = initialLast.id;
    }
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
    let active = true;
    void fetch("/api/chat", { method: "GET", cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          data: {
            ok?: boolean;
            turnstileRequired?: boolean;
            turnstileSiteKey?: string;
            sessionVerified?: boolean;
          } | null,
        ) => {
          if (!active || !data?.ok) return;
          hasSyncedConfigRef.current = true;
          if (
            typeof data.turnstileSiteKey === "string" &&
            data.turnstileSiteKey
          ) {
            setRuntimeTurnstileSiteKey(data.turnstileSiteKey);
          }
          if (typeof data.turnstileRequired === "boolean") {
            setTurnstileRequired(data.turnstileRequired);
          }
          if (typeof data.sessionVerified === "boolean") {
            setSessionVerified(data.sessionVerified);
          }
        },
      )
      .catch(() => {
        // Ignore config sync error on mount.
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const onPointerDownOutside = (event: PointerEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDownOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDownOutside);
    };
  }, [containerRef, onClose]);

  useEffect(() => {
    const viewport = window.visualViewport;
    const updateMaxHeight = () => {
      const availableHeight = viewport?.height ?? window.innerHeight;
      const bottomInset = containerRef.current
        ? Number.parseFloat(getComputedStyle(containerRef.current).bottom) || 16
        : 16;
      setDrawerMaxHeight(
        Math.max(
          220,
          Math.min(660, Math.floor(availableHeight - bottomInset - 16)),
        ),
      );
    };

    updateMaxHeight();
    viewport?.addEventListener("resize", updateMaxHeight);
    viewport?.addEventListener("scroll", updateMaxHeight);
    window.addEventListener("resize", updateMaxHeight);
    window.addEventListener("orientationchange", updateMaxHeight);

    return () => {
      viewport?.removeEventListener("resize", updateMaxHeight);
      viewport?.removeEventListener("scroll", updateMaxHeight);
      window.removeEventListener("resize", updateMaxHeight);
      window.removeEventListener("orientationchange", updateMaxHeight);
    };
  }, [containerRef]);

  useEffect(() => {
    if (!isSending) return;
    const count = LOADING_MESSAGES[language].length;
    const intervalId = window.setInterval(() => {
      setLoadingMessageIndex((prev) => (prev + 1) % count);
    }, 2400);
    return () => window.clearInterval(intervalId);
  }, [isSending, language]);

  useEffect(() => {
    if (!scrollRef.current) return;
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
      const containerRect = container.getBoundingClientRect();
      const answerRect = latestAnswerRef.current.getBoundingClientRect();
      const targetTop = Math.max(
        0,
        container.scrollTop + (answerRect.top - containerRect.top) - 12,
      );
      container.scrollTop = targetTop;

      if (lastAnnouncedAnswerIdRef.current !== lastMessage.id) {
        lastAnnouncedAnswerIdRef.current = lastMessage.id;
        setAssistantAnnouncement(lastMessage.content);
      }
      return;
    }

    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isSending]);

  function clearConversation() {
    if (messages.length > 0) {
      setClearedSnapshot(messages);
    }
    setMessages([]);
    setInputValue("");
    setShowFallbackActions(false);
    setStatusError("");
    setAssistantAnnouncement(
      isEs ? "Conversación borrada." : "Conversation cleared.",
    );
    writeStoredChatState({
      messages: [],
      sessionVerified,
    });
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function undoClearConversation() {
    if (!clearedSnapshot || clearedSnapshot.length === 0) {
      return;
    }
    const restored = clearedSnapshot;
    const lastRestored = restored.at(-1);
    if (lastRestored?.role === "assistant") {
      lastAnnouncedAnswerIdRef.current = lastRestored.id;
    }
    setMessages(restored);
    setClearedSnapshot(null);
    setShowFallbackActions(Boolean(lastRestored?.isFallbackNotice));
    setAssistantAnnouncement(
      isEs ? "Conversación restaurada." : "Conversation restored.",
    );
    writeStoredChatState({
      messages: restored,
      sessionVerified,
    });
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  async function sendMessage(rawText: string) {
    const trimmed = rawText.trim().slice(0, MAX_MESSAGE_CHARS);
    if (!trimmed || isSending) {
      return;
    }

    setClearedSnapshot(null);

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
          ? "La verificación de seguridad no está configurada en este entorno. Usa el briefing de producto, Contacto o WhatsApp."
          : "Security verification is not configured on this environment. Use Product Brief, Contact, or WhatsApp.",
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
        setShowFallbackActions(turnstileFailed);
        setStatusError(
          turnstileFailed
            ? isEs
              ? "La verificación de seguridad no ha podido cargarse. Usa el briefing de producto, reserva una llamada o escríbenos por WhatsApp."
              : "The security check could not load. Use the Product Brief, book a call, or message us on WhatsApp."
            : isEs
              ? "Completa la verificación de seguridad antes de enviar tu primera pregunta."
              : "Complete the security check before sending your first question.",
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
              : "Complete the security check to continue."),
        );
        return;
      }

      const fallbackText =
        payload?.error ||
        (isEs
          ? "El asistente no está disponible en este momento. Puedes escribirnos por WhatsApp, usar la página de contacto o empezar un briefing de producto."
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
    if (!inputValue.trim()) {
      setStatusError(
        isEs
          ? "Escribe una pregunta antes de enviarla."
          : "Write a question before sending.",
      );
      inputRef.current?.focus();
      return;
    }
    void sendMessage(inputValue);
  }

  const presetQuestions = getPresetsForRoute(basePath, language);
  const greetingText = getGreetingForRoute(basePath, language);
  const loadingMessages = LOADING_MESSAGES[language];
  const activeLoadingMessage =
    loadingMessages[loadingMessageIndex % loadingMessages.length] ??
    loadingMessages[0];
  const whatsappHref = WHATSAPP_HREF[language];
  const effectiveSiteKey = runtimeTurnstileSiteKey || BUILD_TURNSTILE_SITE_KEY;
  const needsTurnstile =
    Boolean(effectiveSiteKey) &&
    (turnstileRequired || Boolean(BUILD_TURNSTILE_SITE_KEY)) &&
    !sessionVerified;

  return (
    <section
      id="karmarise-chat-drawer"
      role="dialog"
      aria-modal="false"
      aria-label={
        isEs ? "Guía de KarmaRise D Global" : "KarmaRise D Global guide"
      }
      style={
        drawerMaxHeight !== null
          ? { maxHeight: `${drawerMaxHeight}px` }
          : undefined
      }
      className="flex max-h-[min(660px,calc(100dvh-2.5rem))] min-h-0 w-full max-w-[400px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)] shadow-[var(--shadow-card)]"
    >
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {assistantAnnouncement}
      </div>

      <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[var(--color-rule)]/70 px-5 py-2.5">
        <div className="flex min-w-0 items-center gap-2.5">
          <BrandMarkBadge size="sm" />
          <p className="font-[family-name:var(--font-display)] text-[length:var(--text-md)] leading-none font-normal text-[var(--color-ink)]">
            KarmaRise D Global
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          {messages.length > 0 ? (
            <button
              type="button"
              onClick={clearConversation}
              className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center px-2.5 text-[length:var(--text-xs)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-ink)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
            >
              {isEs ? "Limpiar" : "Clear"}
            </button>
          ) : null}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={isEs ? "Cerrar chat" : "Close chat"}
            className="inline-flex h-11 min-h-[var(--tap-min)] w-11 min-w-[var(--tap-min)] cursor-pointer items-center justify-center rounded-full border border-[var(--color-control-border)] text-[var(--color-ink-2)] transition-colors hover:border-[var(--color-wood)] hover:bg-[var(--color-white)]/70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
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
        className="karmarise-chat-scroll relative min-h-0 flex-auto touch-pan-y overflow-y-auto overscroll-y-contain px-5 py-4"
      >
        <div className="flex flex-col gap-3.5">
          {clearedSnapshot && messages.length === 0 ? (
            <div className="flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-white)]/85 px-3.5 py-2 text-[length:var(--text-xs)] text-[var(--color-ink-2)]">
              <span>
                {isEs ? "Conversación borrada." : "Conversation cleared."}
              </span>
              <button
                type="button"
                onClick={undoClearConversation}
                className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center px-1 font-semibold text-[var(--color-clay-ink)] underline decoration-[var(--color-clay)]/60 underline-offset-4 transition-colors hover:text-[var(--color-wood)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                {isEs ? "Deshacer" : "Undo"}
              </button>
            </div>
          ) : null}

          <p className="text-[length:var(--text-sm)] leading-relaxed text-[var(--color-ink-2)]">
            {greetingText}
          </p>

          {messages.map((item, index) => {
            const isLatestAssistant =
              item.role === "assistant" && index === messages.length - 1;
            return (
              <div
                key={item.id}
                ref={isLatestAssistant ? latestAnswerRef : undefined}
                className={
                  item.role === "user"
                    ? "ms-auto max-w-[85%] rounded-[var(--radius-panel)] rounded-ee-sm bg-[var(--color-wood)] px-3.5 py-2.5 text-[length:var(--text-sm)] leading-relaxed text-[var(--color-paper)]"
                    : "me-auto max-w-[92%] rounded-[var(--radius-panel)] rounded-es-sm border border-[var(--color-rule)]/80 bg-[var(--color-white)]/90 px-3.5 py-2.5 text-[length:var(--text-sm)] leading-relaxed whitespace-pre-line text-[var(--color-ink)]"
                }
              >
                {item.role === "assistant"
                  ? renderMessageContent(
                      item.content,
                      localizeHref,
                      onClose,
                      language,
                    )
                  : item.content}
              </div>
            );
          })}

          <div
            role="status"
            aria-live="polite"
            className={
              isSending
                ? "me-auto inline-flex items-center gap-2 rounded-[var(--radius-panel)] rounded-es-sm border border-[var(--color-rule)]/80 bg-[var(--color-white)]/90 px-3.5 py-2.5 text-[length:var(--text-xs)] text-[var(--color-muted)]"
                : "sr-only"
            }
          >
            {isSending ? (
              <>
                <span
                  aria-hidden="true"
                  className="inline-flex items-center gap-1"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-clay)] motion-safe:animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-clay)] [animation-delay:var(--dur-micro)] motion-safe:animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-clay)] [animation-delay:var(--dur-short)] motion-safe:animate-pulse" />
                </span>
                <span>{activeLoadingMessage}</span>
              </>
            ) : null}
          </div>

          {messages.length === 0 && !isSending ? (
            <div className="divide-y divide-[var(--color-rule)]/55 overflow-hidden rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-white)]/75">
              {presetQuestions.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  disabled={isSending}
                  onClick={() => {
                    void sendMessage(prompt);
                  }}
                  className="group flex min-h-[var(--tap-min)] w-full cursor-pointer touch-pan-y items-center justify-between gap-3 px-3.5 py-2.5 text-start text-[length:var(--text-xs)] leading-snug font-medium text-[var(--color-ink)] transition-colors hover:bg-[var(--color-white)] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  <span>{prompt}</span>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-[15px] w-[15px] shrink-0 text-[var(--color-muted)] transition-transform group-hover:text-[var(--color-wood)] motion-safe:group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:motion-safe:group-hover:-translate-x-0.5"
                  >
                    <path d="M3.5 8h9M8.5 4l4 4-4 4" />
                  </svg>
                </button>
              ))}
            </div>
          ) : null}

          {showFallbackActions ? (
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href={localizeHref("/product-brief")}
                onClick={onClose}
                className="inline-flex min-h-[var(--tap-min)] items-center rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-paper)] no-underline"
              >
                {isEs
                  ? "Empezar briefing de producto"
                  : "Start a Product Brief"}
              </Link>
              <Link
                href={localizeHref("/book-a-call?duration=15")}
                onClick={onClose}
                className="inline-flex min-h-[var(--tap-min)] items-center rounded-[var(--radius-pill)] bg-[var(--color-wood)] px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-paper)] no-underline"
              >
                {isEs ? "Reservar llamada con Alma" : "Book a call with Alma"}
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[var(--tap-min)] items-center rounded-[var(--radius-pill)] border border-[var(--color-forest)]/45 bg-[var(--color-white)]/85 px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)] no-underline"
              >
                WhatsApp
              </a>
            </div>
          ) : null}
        </div>
      </div>

      <form
        aria-label={
          isEs ? "Preguntar a KarmaRise D Global" : "Ask KarmaRise D Global"
        }
        onSubmit={handleFormSubmit}
        className="grid max-h-[52%] shrink-0 touch-pan-y gap-2 overflow-y-auto overscroll-y-contain border-t border-[var(--color-rule)]/70 px-5 py-3"
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
            onError={setTurnstileFailed}
          />
        ) : null}

        <p
          role="alert"
          aria-live="assertive"
          className={
            statusError
              ? "text-[length:var(--text-xs)] font-medium text-[var(--color-clay-ink)]"
              : "sr-only"
          }
        >
          {statusError}
        </p>

        <div className="flex items-center gap-1 rounded-[var(--radius-pill)] border border-[var(--color-control-border)] bg-[var(--color-white)] p-1 ps-4 has-[:focus-visible]:border-[var(--color-wood)] has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--color-focus)]">
          <label htmlFor="karmarise-chat-input" className="sr-only">
            {isEs ? "Escribe tu pregunta" : "Write your question"}
          </label>
          <input
            ref={inputRef}
            id="karmarise-chat-input"
            type="text"
            maxLength={MAX_MESSAGE_CHARS}
            value={inputValue}
            onChange={(event) => {
              setInputValue(event.target.value);
              if (statusError) setStatusError("");
            }}
            placeholder={
              isEs
                ? "Ej.: ¿Necesito ficha técnica?"
                : "e.g. Do I need a tech pack?"
            }
            className="h-11 min-w-0 flex-1 bg-transparent text-[length:var(--text-md)] text-[var(--color-ink)] placeholder:text-[var(--color-muted)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isSending}
            aria-label={isEs ? "Enviar" : "Send"}
            className="inline-flex h-11 min-h-[var(--tap-min)] w-11 min-w-[var(--tap-min)] shrink-0 cursor-pointer items-center justify-center rounded-full bg-[var(--color-wood)] text-[var(--color-paper)] transition-colors hover:bg-[var(--color-ink)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4 rtl:-scale-x-100"
            >
              <path d="M3 8h10M9 4l4 4-4 4" />
            </svg>
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-0 px-1 text-[length:var(--text-xs)]">
          <Link
            href={localizeHref("/product-brief")}
            onClick={onClose}
            className="inline-flex min-h-[var(--tap-min)] items-center font-medium text-[var(--color-clay-ink)] underline decoration-[var(--color-clay)]/50 underline-offset-4 hover:text-[var(--color-wood)]"
          >
            {isEs ? "Empezar briefing de producto" : "Start a Product Brief"}
          </Link>
          <Link
            href={localizeHref("/book-a-call?duration=15")}
            onClick={onClose}
            className="inline-flex min-h-[var(--tap-min)] items-center font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-ink)]"
          >
            {isEs ? "Reservar llamada con Alma" : "Book a call with Alma"}
          </Link>
        </div>
      </form>
    </section>
  );
}
