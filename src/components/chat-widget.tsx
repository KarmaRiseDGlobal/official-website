"use client";

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
const WHATSAPP_HREF = "https://wa.me/34611722276";
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

const STARTER_PROMPTS: Record<SiteLanguage, readonly string[]> = {
  en: [
    "How does a Manufacturing Programme work?",
    "What goes into a Product Brief?",
    "Tell me about Almarise",
  ],
  es: [
    "¿Cómo funciona un Programa de fabricación?",
    "¿Qué incluye un Product Brief?",
    "Cuéntame sobre Almarise",
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
  const [inputValue, setInputValue] = useState("");
  const [companyWebsite, setCompanyWebsite] = useState("");
  const [isSending, setIsSending] = useState(false);
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

  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const hasSyncedConfigRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        requestAnimationFrame(() => launcherRef.current?.focus());
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !scrollRef.current) return;
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
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  function closeDrawer() {
    setIsOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }

  function clearConversation() {
    setMessages([]);
    setShowFallbackActions(false);
    setStatusError("");
    writeStoredChatState({
      messages: [],
      sessionVerified,
    });
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

    if (mustCheckTurnstile && !turnstileToken) {
      setStatusError(
        isEs
          ? "Completa la verificación de seguridad antes de enviar tu primera pregunta."
          : "Please complete the security check before sending your first question.",
      );
      return;
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
          turnstileToken: sessionVerified ? "" : turnstileToken,
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
        setTurnstileToken("");
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

  function handleTextareaKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>,
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage(inputValue);
    }
  }

  const starterPrompts = STARTER_PROMPTS[language];
  const effectiveSiteKey = runtimeTurnstileSiteKey || BUILD_TURNSTILE_SITE_KEY;
  const needsTurnstile =
    Boolean(effectiveSiteKey) &&
    (turnstileRequired || Boolean(BUILD_TURNSTILE_SITE_KEY)) &&
    !sessionVerified;

  return (
    <div className="fixed right-4 bottom-4 z-[var(--z-sticky)] sm:right-6 sm:bottom-6">
      {!isOpen ? (
        <button
          ref={launcherRef}
          type="button"
          onClick={openDrawer}
          aria-expanded="false"
          aria-controls="karmarise-chat-drawer"
          className="inline-flex min-h-[46px] cursor-pointer items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--color-paper)]/20 bg-[var(--color-forest-deep)] px-5 py-2.5 text-[length:var(--text-sm)] font-medium text-[var(--color-paper)] shadow-[var(--shadow-card)] transition-transform duration-[var(--dur-short)] ease-[var(--ease-out)] hover:-translate-y-0.5 hover:bg-[var(--color-forest)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          <span
            aria-hidden="true"
            className="inline-block h-2 w-2 rounded-full bg-[var(--color-clay-light)]"
          />
          <span>{isEs ? "Pregunta a KarmaRise" : "Ask KarmaRise"}</span>
        </button>
      ) : (
        <section
          id="karmarise-chat-drawer"
          role="dialog"
          aria-modal="false"
          aria-label={
            isEs
              ? "Asistente de KarmaRise D Global"
              : "KarmaRise D Global assistant"
          }
          className="flex max-h-[min(620px,calc(100dvh-2rem))] w-[calc(100vw-2rem)] max-w-[400px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] text-[var(--color-ink)] shadow-[var(--shadow-card)]"
        >
          <header className="flex items-start justify-between gap-3 border-b border-[var(--color-paper)]/15 bg-[var(--color-forest-deep)] px-5 py-4 text-[var(--color-paper)]">
            <div className="grid gap-0.5">
              <p className="font-[family-name:var(--font-display)] text-[length:var(--text-lg)] leading-tight font-normal">
                KarmaRise D Global
              </p>
              <p className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/85">
                {isEs
                  ? "Fabricación en la India para España y Europa"
                  : "Manufacturing across India for Spain and Europe"}
              </p>
            </div>
            <div className="flex items-center gap-1.5">
              {messages.length > 0 ? (
                <button
                  type="button"
                  onClick={clearConversation}
                  className="cursor-pointer rounded-[var(--radius-pill)] border border-[var(--color-paper)]/25 px-2.5 py-1 text-[length:var(--text-xs)] text-[var(--color-paper-2)] transition-colors hover:bg-[var(--color-paper)]/10"
                >
                  {isEs ? "Limpiar" : "Clear"}
                </button>
              ) : null}
              <button
                type="button"
                onClick={closeDrawer}
                aria-label={isEs ? "Cerrar chat" : "Close chat"}
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-[var(--color-paper)]/25 text-[var(--color-paper)] transition-colors hover:bg-[var(--color-paper)]/10"
              >
                <span aria-hidden="true" className="text-base leading-none">
                  ×
                </span>
              </button>
            </div>
          </header>

          <div
            ref={scrollRef}
            data-lenis-prevent
            className="grid flex-1 gap-3 overflow-y-auto overscroll-contain px-4 py-4"
          >
            <div className="rounded-2xl border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-3.5 py-3 text-[length:var(--text-sm)] leading-relaxed text-[var(--color-ink)]">
              {isEs
                ? "Hola. Pregúntanos cómo funciona un Programa de fabricación, qué incluir en un Product Brief, sobre Almarise o cómo Alma y Shirish coordinan la producción en la India."
                : "Hello. Ask us how a Manufacturing Programme works, what goes into a Product Brief, about Almarise, or how Alma and Shirish coordinate production across India."}
            </div>

            {messages.length === 0 ? (
              <div className="flex flex-wrap gap-2">
                {starterPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={isSending}
                    onClick={() => {
                      void sendMessage(prompt);
                    }}
                    className="cursor-pointer rounded-[var(--radius-pill)] border border-[var(--color-rule-2)] bg-[var(--color-white)] px-3 py-1.5 text-left text-[length:var(--text-xs)] font-medium text-[var(--color-forest-deep)] transition-colors hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-paper-2)] disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            ) : null}

            {messages.map((item) => (
              <div
                key={item.id}
                className={
                  item.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-[var(--color-forest-deep)] px-3.5 py-2.5 text-[length:var(--text-sm)] leading-relaxed text-[var(--color-paper)]"
                    : "mr-auto max-w-[90%] rounded-2xl rounded-bl-sm border border-[var(--color-rule)] bg-[var(--color-white)] px-3.5 py-2.5 text-[length:var(--text-sm)] leading-relaxed whitespace-pre-line text-[var(--color-ink)]"
                }
              >
                {item.role === "assistant"
                  ? renderMessageContent(item.content, localizeHref, () =>
                      setIsOpen(false),
                    )
                  : item.content}
              </div>
            ))}

            {isSending ? (
              <div
                role="status"
                className="mr-auto rounded-2xl rounded-bl-sm border border-[var(--color-rule)] bg-[var(--color-white)] px-3.5 py-2 text-[length:var(--text-xs)] text-[var(--color-muted)]"
              >
                {isEs ? "Escribiendo respuesta..." : "Writing reply..."}
              </div>
            ) : null}

            {showFallbackActions ? (
              <div className="flex flex-wrap gap-2 rounded-2xl border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-3">
                <Link
                  href={localizeHref("/product-brief")}
                  onClick={() => setIsOpen(false)}
                  className="rounded-[var(--radius-pill)] bg-[var(--color-forest-deep)] px-3 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-paper)] no-underline"
                >
                  {isEs ? "Iniciar Product Brief" : "Start Product Brief"}
                </Link>
                <Link
                  href={localizeHref("/contact")}
                  onClick={() => setIsOpen(false)}
                  className="rounded-[var(--radius-pill)] border border-[var(--color-forest-deep)] px-3 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-forest-deep)] no-underline"
                >
                  {isEs ? "Contacto" : "Contact"}
                </Link>
                <a
                  href={WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-[var(--radius-pill)] border border-[var(--color-clay-ink)] px-3 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-clay-ink)] no-underline"
                >
                  WhatsApp
                </a>
              </div>
            ) : null}
          </div>

          <form
            onSubmit={handleFormSubmit}
            className="grid gap-2.5 border-t border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-3"
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
                appearance="always"
                size="flexible"
                resetSignal={turnstileResetSignal}
                onTokenChange={setTurnstileToken}
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

            <div className="flex items-end gap-2">
              <label htmlFor="karmarise-chat-input" className="sr-only">
                {isEs ? "Escribe tu pregunta" : "Write your question"}
              </label>
              <textarea
                ref={inputRef}
                id="karmarise-chat-input"
                rows={2}
                maxLength={MAX_MESSAGE_CHARS}
                value={inputValue}
                onChange={(event) => setInputValue(event.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder={
                  isEs
                    ? "Escribe tu consulta..."
                    : "Ask about manufacturing or Product Briefs..."
                }
                className="min-h-[44px] flex-1 resize-none rounded-xl border border-[var(--color-rule-2)] bg-[var(--color-white)] px-3 py-2 text-[length:var(--text-sm)] text-[var(--color-ink)] placeholder:text-[var(--color-muted)]/75 focus:border-[var(--color-forest-deep)] focus:outline-none"
              />
              <button
                type="submit"
                disabled={isSending || !inputValue.trim()}
                className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-xl bg-[var(--color-forest-deep)] px-4 text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] transition-colors hover:bg-[var(--color-forest)] disabled:cursor-not-allowed disabled:opacity-45"
              >
                {isEs ? "Enviar" : "Send"}
              </button>
            </div>

            <div className="flex items-center justify-between gap-2 text-[length:var(--text-xs)] text-[var(--color-muted)]">
              <Link
                href={localizeHref("/product-brief")}
                onClick={() => setIsOpen(false)}
                className="underline underline-offset-2 hover:text-[var(--color-forest-deep)]"
              >
                {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
              </Link>
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="underline underline-offset-2 hover:text-[var(--color-forest-deep)]"
              >
                {isEs ? "Hablar por WhatsApp" : "Message on WhatsApp"}
              </a>
            </div>
          </form>
        </section>
      )}
    </div>
  );
}
