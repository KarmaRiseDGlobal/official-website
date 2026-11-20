import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import {
  buildChatSystemPrompt,
  CHAT_SESSION_COOKIE,
  createChatSessionToken,
  extractAiReplyText,
  getChatCloudflareBindings,
  isQuotaOrRateError,
  MAX_CHAT_MESSAGE_CHARS,
  MAX_SESSION_TURNS,
  normalizeChatLanguage,
  normalizeCurrentPath,
  readCookieFromHeader,
  resolveChatModel,
  resolveChatSessionSecret,
  sanitizeChatHistory,
  SESSION_TTL_SECONDS,
  verifyChatSessionToken,
  type ChatSessionPayload,
} from "@/lib/chat";
import {
  checkRateLimit,
  getClientIp,
  readJsonObject,
  verifyTurnstileToken,
} from "@/lib/security";
import { readTrimmedString } from "@/lib/validation";

const CHAT_RATE_LIMIT_PER_MINUTE = 12;
const CHAT_RATE_WINDOW_MS = 60_000;

function getLocalizedError(
  language: "en" | "es",
  code:
    | "empty_message"
    | "rate_limited"
    | "turnstile_required"
    | "turnstile_failed"
    | "session_limit"
    | "quota_exceeded"
    | "ai_unavailable",
): string {
  if (language === "es") {
    switch (code) {
      case "empty_message":
        return "Escribe una pregunta antes de enviarla.";
      case "rate_limited":
        return "Has enviado varios mensajes seguidos. Espera un minuto o escríbenos por WhatsApp o correo.";
      case "turnstile_required":
        return "Completa la verificación de seguridad antes de iniciar el chat.";
      case "turnstile_failed":
        return "No pudimos validar la verificación de seguridad. Inténtalo de nuevo.";
      case "session_limit":
        return "Has alcanzado el límite de mensajes de esta sesión. Continúa con nuestro equipo mediante un Product Brief, contacto o WhatsApp.";
      case "quota_exceeded":
        return "El asistente ha alcanzado su límite diario. Puedes continuar directamente por WhatsApp, contacto o enviando un Product Brief.";
      case "ai_unavailable":
        return "El asistente no está disponible en este momento. Puedes escribirnos por WhatsApp, usar la página de contacto o iniciar un Product Brief.";
    }
  }

  switch (code) {
    case "empty_message":
      return "Please write a message before sending.";
    case "rate_limited":
      return "You have sent several messages in a row. Wait a minute, or reach us directly on WhatsApp or email.";
    case "turnstile_required":
      return "Please complete the security check before starting the chat.";
    case "turnstile_failed":
      return "Security verification failed. Please try again.";
    case "session_limit":
      return "You have reached the message limit for this session. Continue directly with our team via Product Brief, Contact, or WhatsApp.";
    case "quota_exceeded":
      return "The assistant has reached its daily capacity. You can continue directly via WhatsApp, Contact, or a Product Brief.";
    case "ai_unavailable":
      return "The assistant is unavailable right now. You can reach our team directly via WhatsApp, Contact, or a Product Brief.";
  }
}

export async function GET(request: Request) {
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
  const sessionSecret = resolveChatSessionSecret();

  let sessionVerified = false;
  if (sessionSecret) {
    const rawCookie = readCookieFromHeader(
      request.headers.get("cookie"),
      CHAT_SESSION_COOKIE,
    );
    const session = verifyChatSessionToken(rawCookie, sessionSecret);
    sessionVerified = Boolean(session && session.turns < MAX_SESSION_TURNS);
  }

  return NextResponse.json({
    ok: true,
    turnstileRequired: Boolean(turnstileSecret),
    turnstileSiteKey,
    sessionVerified,
  });
}

export async function POST(request: Request) {
  const parsed = await readJsonObject(request, 16 * 1024);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, error: parsed.error },
      { status: parsed.status },
    );
  }

  const payload = parsed.data;
  const language = normalizeChatLanguage(payload.language);

  // Silently accept honeypot triggers so automated bots do not retry.
  if (
    typeof payload.companyWebsite === "string" &&
    payload.companyWebsite.trim().length > 0
  ) {
    return NextResponse.json({
      ok: true,
      reply:
        language === "es"
          ? "Gracias por tu mensaje. Si quieres iniciar un Product Brief, visita /product-brief."
          : "Thank you for your message. To start a Product Brief, visit /product-brief.",
    });
  }

  const message = readTrimmedString(payload.message, MAX_CHAT_MESSAGE_CHARS);
  if (!message) {
    return NextResponse.json(
      { ok: false, error: getLocalizedError(language, "empty_message") },
      { status: 400 },
    );
  }

  const clientIp = getClientIp(request);
  const bindings = await getChatCloudflareBindings();

  if (bindings.CHAT_RATE_LIMITER) {
    try {
      const edgeRate = await bindings.CHAT_RATE_LIMITER.limit({
        key: `chat:${clientIp}`,
      });
      if (!edgeRate.success) {
        return NextResponse.json(
          {
            ok: false,
            code: "rate_limited",
            fallback: true,
            error: getLocalizedError(language, "rate_limited"),
          },
          { status: 429, headers: { "Retry-After": "60" } },
        );
      }
    } catch (error) {
      console.error("Cloudflare rate limiter failed:", error);
    }
  }

  const memoryRate = checkRateLimit(
    `chat:${clientIp}`,
    CHAT_RATE_LIMIT_PER_MINUTE,
    CHAT_RATE_WINDOW_MS,
  );
  if (!memoryRate.ok) {
    return NextResponse.json(
      {
        ok: false,
        code: "rate_limited",
        fallback: true,
        error: getLocalizedError(language, "rate_limited"),
      },
      {
        status: 429,
        headers: { "Retry-After": String(memoryRate.retryAfterSeconds) },
      },
    );
  }

  const sessionSecret = resolveChatSessionSecret();
  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY?.trim() ?? "";
  let activeSession: ChatSessionPayload | null = null;

  if (sessionSecret) {
    const rawCookie = readCookieFromHeader(
      request.headers.get("cookie"),
      CHAT_SESSION_COOKIE,
    );
    activeSession = verifyChatSessionToken(rawCookie, sessionSecret);

    if (activeSession) {
      if (activeSession.turns >= MAX_SESSION_TURNS) {
        return NextResponse.json(
          {
            ok: false,
            code: "session_limit",
            fallback: true,
            error: getLocalizedError(language, "session_limit"),
          },
          { status: 429 },
        );
      }
    } else {
      if (turnstileSecret) {
        const token = readTrimmedString(payload.turnstileToken, 2048, {
          singleLine: true,
        });
        if (!token) {
          return NextResponse.json(
            {
              ok: false,
              code: "turnstile_required",
              error: getLocalizedError(language, "turnstile_required"),
            },
            { status: 400 },
          );
        }

        const verification = await verifyTurnstileToken(token, clientIp);
        if (!verification.ok) {
          return NextResponse.json(
            {
              ok: false,
              code: "turnstile_failed",
              error: getLocalizedError(language, "turnstile_failed"),
            },
            { status: 403 },
          );
        }
      }

      activeSession = {
        sid: randomUUID(),
        turns: 0,
        exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
      };
    }
  }

  if (!bindings.AI) {
    return NextResponse.json(
      {
        ok: false,
        code: "ai_unavailable",
        fallback: true,
        error: getLocalizedError(language, "ai_unavailable"),
      },
      { status: 503 },
    );
  }

  const currentPath = normalizeCurrentPath(payload.currentPath);
  const history = sanitizeChatHistory(payload.history);
  const systemPrompt = buildChatSystemPrompt(language, currentPath);

  let aiResult: unknown;
  try {
    aiResult = await bindings.AI.run(resolveChatModel(), {
      messages: [
        { role: "system", content: systemPrompt },
        ...history,
        { role: "user", content: message },
      ],
      max_tokens: 320,
      temperature: 0.3,
    });
  } catch (error) {
    console.error("Workers AI chat error:", error);
    if (isQuotaOrRateError(error)) {
      return NextResponse.json(
        {
          ok: false,
          code: "quota_exceeded",
          fallback: true,
          error: getLocalizedError(language, "quota_exceeded"),
        },
        { status: 429 },
      );
    }

    return NextResponse.json(
      {
        ok: false,
        code: "ai_unavailable",
        fallback: true,
        error: getLocalizedError(language, "ai_unavailable"),
      },
      { status: 503 },
    );
  }

  const reply = extractAiReplyText(aiResult);
  if (!reply) {
    return NextResponse.json(
      {
        ok: false,
        code: "ai_unavailable",
        fallback: true,
        error: getLocalizedError(language, "ai_unavailable"),
      },
      { status: 503 },
    );
  }

  const nextTurns = (activeSession?.turns ?? 0) + 1;
  const remainingTurns = Math.max(0, MAX_SESSION_TURNS - nextTurns);

  const response = NextResponse.json({
    ok: true,
    reply,
    remainingTurns,
  });

  if (sessionSecret && activeSession) {
    const signedCookie = createChatSessionToken(
      {
        sid: activeSession.sid,
        turns: nextTurns,
        exp: activeSession.exp,
      },
      sessionSecret,
    );
    response.cookies.set({
      name: CHAT_SESSION_COOKIE,
      value: signedCookie,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });
  }

  return response;
}
