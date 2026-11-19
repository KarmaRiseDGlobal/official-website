import { createHmac, randomUUID } from "node:crypto";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import type { SiteLanguage } from "@/lib/seo";
import { timingSafeEqualStrings } from "@/lib/security";
import { readTrimmedString } from "@/lib/validation";

export interface WorkersAiBinding {
  run: (
    model: string,
    inputs: {
      messages: Array<{
        role: "system" | "user" | "assistant";
        content: string;
      }>;
      max_tokens?: number;
      temperature?: number;
    },
  ) => Promise<unknown>;
}

export interface RateLimitBinding {
  limit: (options: { key: string }) => Promise<{ success: boolean }>;
}

declare global {
  interface CloudflareEnv {
    AI?: WorkersAiBinding;
    CHAT_RATE_LIMITER?: RateLimitBinding;
  }
}

export interface ChatTurn {
  role: "user" | "assistant";
  content: string;
}

export interface ChatSessionPayload {
  sid: string;
  turns: number;
  exp: number;
}

export const DEFAULT_CLOUDFLARE_AI_MODEL = "@cf/meta/llama-3.1-8b-instruct-fp8";
export const MAX_CHAT_MESSAGE_CHARS = 600;
export const MAX_HISTORY_TURNS = 8;
export const MAX_HISTORY_ITEM_CHARS = 800;
export const MAX_HISTORY_TOTAL_CHARS = 3200;
export const MAX_SESSION_TURNS = 16;
export const SESSION_TTL_SECONDS = 2 * 60 * 60;
export const CHAT_SESSION_COOKIE = "kr_chat_session";

export function resolveChatModel(): string {
  return process.env.CLOUDFLARE_AI_MODEL?.trim() || DEFAULT_CLOUDFLARE_AI_MODEL;
}

export function resolveChatSessionSecret(): string {
  return (
    process.env.CHAT_SESSION_SECRET?.trim() ||
    process.env.TURNSTILE_SECRET_KEY?.trim() ||
    ""
  );
}

export function normalizeChatLanguage(rawLanguage: unknown): SiteLanguage {
  const normalized = readTrimmedString(rawLanguage, 24, {
    singleLine: true,
  }).toLowerCase();

  if (
    normalized === "es" ||
    normalized.startsWith("es-") ||
    normalized === "spanish" ||
    normalized === "español" ||
    normalized === "espanol"
  ) {
    return "es";
  }

  return "en";
}

export function normalizeCurrentPath(rawPath: unknown): string {
  const candidate = readTrimmedString(rawPath, 160, { singleLine: true });
  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return "/";
  }
  return candidate;
}

export function sanitizeChatHistory(rawHistory: unknown): ChatTurn[] {
  if (!Array.isArray(rawHistory)) {
    return [];
  }

  const cleaned: ChatTurn[] = [];
  for (const item of rawHistory.slice(-MAX_HISTORY_TURNS)) {
    if (typeof item !== "object" || item === null) {
      continue;
    }

    const record = item as { role?: unknown; content?: unknown };
    const role =
      record.role === "user" || record.role === "assistant"
        ? record.role
        : null;
    if (!role) {
      continue;
    }

    const content = readTrimmedString(record.content, MAX_HISTORY_ITEM_CHARS);
    if (!content) {
      continue;
    }

    cleaned.push({ role, content });
  }

  const bounded: ChatTurn[] = [];
  let totalChars = 0;
  for (let index = cleaned.length - 1; index >= 0; index -= 1) {
    const entry = cleaned[index];
    if (!entry) {
      continue;
    }
    if (totalChars + entry.content.length > MAX_HISTORY_TOTAL_CHARS) {
      break;
    }
    totalChars += entry.content.length;
    bounded.unshift(entry);
  }

  return bounded;
}

export function buildChatSystemPrompt(
  language: SiteLanguage,
  currentPath = "/",
): string {
  const languageDirective =
    language === "es"
      ? "Reply in natural, warm Peninsular Spanish (de tú a tú), clear and direct. Never translate mechanically from English."
      : "Reply in clear, warm, direct English with concrete detail.";

  return [
    "You are the website assistant for KarmaRise D Global, founded by Alma and Shirish across India and Spain to serve Clients in Spain and across Europe.",
    languageDirective,
    `The visitor is currently viewing: ${currentPath}.`,
    "Use KarmaRise D Global terminology accurately:",
    "- Client: a retail chain, independent retailer, or fashion brand in Spain or Europe commissioning a bulk product (never say customer, shopowner, or buyer).",
    "- Manufacturing Programme: an end-to-end engagement delivering a Client's bulk product through Indian manufacturing (never say deal, brokerage, or sourcing job).",
    "- Product Brief: the agreed description of a Client's product, covering design, materials, quantity, quality, and delivery expectations.",
    "- Manufacturing Partner: an Indian workshop or factory selected across India's specialist clusters (never say vendor or supplier).",
    "- Bulk Order: the production quantity commissioned under a Manufacturing Programme.",
    "- Almarise: a fashion brand owned by KarmaRise D Global transforming existing Indian sarees into contemporary women's clothing for Spain and Europe.",
    "- Women's Training Initiative: a planned programme in India to train women in garment design and stitching, with paid employment opportunities as a long-term aim (never describe it as an active NGO or charity).",
    "- Stories (Historias in Spanish): editorial accounts of workshops, materials, culture, and company progress.",
    "- Geography: represent all of India and foreground Spain alongside Europe. Refer to our studio in India or near Mumbai, never mention Ulhasnagar.",
    "Available pages you may point visitors to using exact root-relative paths:",
    "- /product-brief (to start a Product Brief with materials, quantities, and timelines)",
    "- /manufacturing-programme (how a Manufacturing Programme works from sampling to Bulk Order delivery)",
    "- /working-across-distance (how Alma and Shirish coordinate workshops in India with Clients in Europe)",
    "- /about (Alma and Shirish's story)",
    "- /stories (editorial Stories from workshops and travels)",
    "- /almarise (the Almarise clothing line)",
    "- /womens-training-initiative (the planned training programme)",
    "- /contact (direct routing via email at hola@karmarisedglobal.com or WhatsApp at +34 611 722 276)",
    "Strict rules:",
    "- Keep answers concise: 2 to 4 short sentences in plain text (no markdown headers or long bullet lists unless asked).",
    "- Never invent prices, MOQs, factory names, lead times, certifications, or delivery guarantees.",
    "- If a visitor asks for a quote, custom production timeline, or specific factory match, invite them to submit a Product Brief at /product-brief or reach the team at /contact.",
  ].join("\n");
}

function signSessionPayload(encodedPayload: string, secret: string): string {
  return createHmac("sha256", secret)
    .update(encodedPayload, "utf8")
    .digest("base64url");
}

export function createChatSessionToken(
  payload: Omit<ChatSessionPayload, "exp"> & { exp?: number },
  secret: string,
): string {
  const fullPayload: ChatSessionPayload = {
    sid: payload.sid || randomUUID(),
    turns: Math.max(0, Math.floor(payload.turns)),
    exp: payload.exp ?? Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const encodedPayload = Buffer.from(
    JSON.stringify(fullPayload),
    "utf8",
  ).toString("base64url");
  const signature = signSessionPayload(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function verifyChatSessionToken(
  token: string,
  secret: string,
  nowSeconds = Math.floor(Date.now() / 1000),
): ChatSessionPayload | null {
  if (!token || !secret) {
    return null;
  }

  const dotIndex = token.indexOf(".");
  if (dotIndex <= 0 || dotIndex === token.length - 1) {
    return null;
  }

  const encodedPayload = token.slice(0, dotIndex);
  const signature = token.slice(dotIndex + 1);
  const expectedSignature = signSessionPayload(encodedPayload, secret);

  if (!timingSafeEqualStrings(signature, expectedSignature)) {
    return null;
  }

  try {
    const parsed = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<ChatSessionPayload>;
    if (
      typeof parsed.sid !== "string" ||
      !parsed.sid ||
      typeof parsed.turns !== "number" ||
      !Number.isFinite(parsed.turns) ||
      parsed.turns < 0 ||
      typeof parsed.exp !== "number" ||
      !Number.isFinite(parsed.exp) ||
      parsed.exp <= nowSeconds
    ) {
      return null;
    }

    return {
      sid: parsed.sid,
      turns: Math.floor(parsed.turns),
      exp: Math.floor(parsed.exp),
    };
  } catch {
    return null;
  }
}

export function readCookieFromHeader(
  cookieHeader: string | null,
  cookieName: string,
): string {
  if (!cookieHeader) {
    return "";
  }

  const prefix = `${cookieName}=`;
  for (const part of cookieHeader.split(";")) {
    const trimmed = part.trim();
    if (trimmed.startsWith(prefix)) {
      return trimmed.slice(prefix.length).trim();
    }
  }
  return "";
}

export async function getChatCloudflareBindings(): Promise<{
  AI?: WorkersAiBinding;
  CHAT_RATE_LIMITER?: RateLimitBinding;
}> {
  try {
    const context = await getCloudflareContext({ async: true });
    return {
      AI: context.env?.AI,
      CHAT_RATE_LIMITER: context.env?.CHAT_RATE_LIMITER,
    };
  } catch {
    return {};
  }
}

export function extractAiReplyText(result: unknown): string {
  if (typeof result === "string") {
    return result.trim();
  }
  if (typeof result !== "object" || result === null) {
    return "";
  }

  const record = result as {
    response?: unknown;
    result?: { response?: unknown };
    choices?: Array<{ message?: { content?: unknown } }>;
  };

  if (typeof record.response === "string") {
    return record.response.trim();
  }
  if (typeof record.result?.response === "string") {
    return record.result.response.trim();
  }

  const choiceContent = record.choices?.[0]?.message?.content;
  if (typeof choiceContent === "string") {
    return choiceContent.trim();
  }

  return "";
}

export function isQuotaOrRateError(error: unknown): boolean {
  const message =
    error instanceof Error
      ? error.message.toLowerCase()
      : String(error ?? "").toLowerCase();

  return (
    message.includes("quota") ||
    message.includes("neuron") ||
    message.includes("rate limit") ||
    message.includes("429") ||
    message.includes("exceeded")
  );
}
