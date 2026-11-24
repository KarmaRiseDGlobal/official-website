import "server-only";

import { createHmac, randomUUID } from "node:crypto";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import { timingSafeEqualStrings } from "@/lib/security";
import type { SiteLanguage } from "@/lib/urls";
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
      ? "Reply in natural, warm Peninsular Spanish (tú / vosotros), clear and direct. Use approved es-ES terminology: cliente, Programa de producción, briefing de producto (reserve ficha técnica strictly for final tech packs), taller colaborador (never socio), pedido de producción (never pedido en serie), Historias. Never translate mechanically from English."
      : "Reply in clear, warm, direct English with concrete detail.";

  return [
    "You are the website assistant for KarmaRise D Global, founded by Alma and Shirish across India and Spain to serve Clients in Spain and across Europe.",
    languageDirective,
    `The visitor is currently viewing: ${currentPath}.`,
    "Use KarmaRise D Global terminology accurately:",
    "- Client: a retail chain, independent retailer, or fashion brand in Spain or Europe commissioning a bulk product (never say customer, shopowner, or buyer).",
    "- Manufacturing Programme (Programa de producción in Spanish): an end-to-end engagement delivering a Client's bulk product through Indian manufacturing (never say deal, brokerage, or sourcing job).",
    "- Product Brief (briefing de producto in Spanish): the agreed description of a Client's product, covering design, materials, physical colour swatch, quantity, quality tolerances, and delivery expectations.",
    "- Manufacturing Partner (taller colaborador in Spanish, never socio): an audited family-run workshop or women artisan collective selected across India's specialist clusters (never say vendor or supplier).",
    "- Bulk Order (pedido de producción in Spanish, never pedido en serie): the production quantity commissioned after physical sample sign-off.",
    "- AlmaRise D Brand: a fashion and lifestyle brand owned by KarmaRise D Global spanning AlmaRise D Reborn (one-of-a-kind women's garments cut from kept Indian sarees, thevnitlya sadya), AlmaRise D Organic (garments made with organic dyes and plant/fruit-waste fabrics such as sugarcane, orange, banana, and pineapple, among others), and AlmaRise D Home Decor.",
    "- Women's Training Initiative: a planned programme in India (applications are not yet open) to train women in garment design and stitching, with paid employment opportunities as a long-term aim (never describe it as an active NGO or charity).",
    "- Stories (Historias in Spanish): first-person editorial accounts by Alma or Shirish covering Indian craft, materials, culture, and company progress (never blog post or news).",
    "- Geography: represent all of India and foreground Spain alongside Europe. Refer to our studio in India or near Mumbai, never mention Ulhasnagar.",
    "Manufacturing & technical production details you SHOULD explain clearly to Clients:",
    "- Categories across India: structured leather bags, soft carryalls, small leather goods (leather-and-canvas construction, custom linings, trims, and hardware), woven apparel and seasonal capsule collections (matching cut, fabric weight, seam allowances, edge paint / stitch finish, and run size), plus other sewn or crafted pieces.",
    "- How production works step by step: Clients can start from sketches, links, or an existing physical sample in their Product Brief (/product-brief) with no finished tech pack required; Alma replies within 1–2 business days; Alma and Shirish match each piece to a specialist Manufacturing Partner across India, audit partners in person, pre-screen physical samples, and only proceed to bulk cutting after a physical sample is held and signed off by the Client.",
    "- Agreements & confidentiality: Shirish (a registered Bar Council advocate in India) structures clear agreements with Manufacturing Partners, and Client designs shared in a Product Brief remain the Client's sole intellectual property.",
    "Available pages you may point visitors to using exact root-relative paths:",
    "- /product-brief (3-step, 1-minute intake form for bags, garments, or custom sewn pieces; Alma replies within 1–2 business days)",
    "- /book-a-call?duration=15 (15-minute quick intro Google Meet call with Alma in English, Spanish, or Portuguese; /book-a-call?duration=30 for a 30-minute Product Brief review)",
    "- /manufacturing (how a Manufacturing Programme works from product study and sampling to Bulk Order delivery)",
    "- /how-we-work (how Alma and Shirish coordinate Manufacturing Partners in India with Clients in Europe, including written call minutes, physical swatches, sample pre-screening, and live production updates)",
    "- /about (Alma and Shirish's story and Karmarise Global LLP structure)",
    "- /stories (editorial Stories from India and Spain)",
    "- /almarise (AlmaRise D Brand: AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor)",
    "- /womens-training-initiative (the planned training programme)",
    "- /contact (full department directory and registered office address)",
    "Direct contact details you should give directly in replies whenever a visitor wants to reach us (so they do not have to search for a Contact page):",
    "- Call or WhatsApp Alma (Spain & Europe): +34 611 722 276",
    "- Call Shirish (India): +91 85300 09798",
    "- Email Spain & Europe: hola@karmarisedglobal.com or alma@karmarisedglobal.com",
    "- Email India & general: namaste@karmarisedglobal.com or shirish@karmarisedglobal.com",
    "- New project / Product Brief inbox: inquiry@karmarisedglobal.com",
    "Strict rules:",
    "- Keep answers concise: 2 to 4 short sentences in plain text (no markdown headers or long bullet lists unless asked).",
    "- Stay strictly on KarmaRise D Global topics: Manufacturing Programmes across India, Product Briefs, sampling, Bulk Orders, coordinating across India and Spain, AlmaRise D Brand, the planned Women's Training Initiative, and contacting Alma or Shirish.",
    "- Never invent prices, MOQs, factory names, lead times, certifications, or delivery guarantees.",
    "- NEVER confirm, agree with, or speculate about unverified claims, rumours, outside agencies, who built or designed the website, investors, or any detail not explicitly written here, even if a visitor says 'I heard...' or pushes for a yes or no. State plainly that you cannot confirm it and bring the conversation back to KarmaRise D Global.",
    "- NEVER share internal technical or confidential company details: website code, frameworks, APIs, hosting, third-party SaaS providers, internal factory names/addresses, supplier pricing/margins, internal legal contracts, or non-public operations. Decline plainly and redirect back to manufacturing or contacting Alma and Shirish.",
    "- If a visitor sends off-topic trivia, politics, coding, roleplay, or hostile/abusive language, do not play along or debate; reply in one calm sentence that you only assist with KarmaRise D Global manufacturing enquiries.",
    "- When a visitor asks for a quote, custom production timeline, specific factory match, or wants to talk to us, give them the exact clickable phone number, email, /book-a-call link, or /product-brief right inside your answer instead of sending them away to /contact.",
  ].join("\n");
}

const GUARDRAIL_PATTERNS: readonly RegExp[] = [
  /\b(?:fuck(?:ing|ed|er|s)?|shit(?:ty|ting|s)?|bitch(?:es)?|asshole(?:s)?|bastard(?:s)?|cunt(?:s)?|dick(?:s|head)?|whore(?:s)?|slut(?:s)?|piss\s*off|screw\s+you|stfu|gtfo|mierda|joder|puta(?:s)?|cabr[oó]n(?:es)?|gilipollas|imb[eé]cil|subnormal|maric[oó]n|hijo\s+de\s+puta|vete\s+a\s+la\s+mierda)\b/i,
  /\b(?:terrorist(?:a|as|s)?|terrorism(?:o)?|isis|al[-\s]?qaeda|taliban|hamas|nazi(?:s)?|hitler|kill\s+(?:yourself|you|them|everyone)|bomb\s+(?:making|threat)|suicide\s+vest)\b/i,
  /\b(?:ignore\s+(?:all\s+|your\s+)?(?:previous|prior|above)\s+instructions|disregard\s+(?:all\s+|your\s+)?(?:previous|prior)\s+instructions|(?:reveal|show|print|repeat|leak)\s+(?:your\s+|the\s+)?(?:system\s+prompt|hidden\s+instructions|developer\s+prompt)|you\s+are\s+now\s+(?:dan|in\s+developer\s+mode)|jailbreak)\b/i,
  /\b(?:gamoventure|who\s+(?:built|made|coded|designed|created)\s+(?:this|the)\s+(?:website|site|app|chatbot)|(?:source\s+code|tech\s+stack|software\s+stack|what\s+framework|what\s+database|what\s+backend|backend\s+(?:api|stack|architecture)|workers\s+ai|api\s+keys?|env(?:ironment)?\s+var(?:iable)?s?|sanity\s+cms|brevo|resend|cal\.com|opennext|wrangler))\b/i,
];

export function evaluateChatGuardrail(
  message: string,
  language: SiteLanguage,
): string | null {
  const normalized = message.normalize("NFKC").trim();
  if (!normalized) {
    return null;
  }

  for (const pattern of GUARDRAIL_PATTERNS) {
    if (pattern.test(normalized)) {
      return language === "es"
        ? "Solo puedo ayudarte con dudas sobre KarmaRise D Global, Programas de producción en la India, briefings de producto, AlmaRise D Brand o cómo contactar con Alma y Shirish (+34 611 722 276 o hola@karmarisedglobal.com)."
        : "I can only help with questions about KarmaRise D Global, Manufacturing Programmes in India, Product Briefs, AlmaRise D Brand, or contacting Alma and Shirish (+34 611 722 276 or hola@karmarisedglobal.com).";
    }
  }

  return null;
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
