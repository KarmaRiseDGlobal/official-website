import "server-only";

import { createHash, timingSafeEqual } from "node:crypto";

import { getCloudflareContext } from "@opennextjs/cloudflare";

import type { SiteLanguage } from "@/lib/urls";

const RATE_LIMIT_MAX_ENTRIES = 1000;
const RATE_LIMIT_PRUNE_THRESHOLD = 256;
const DEFAULT_MAX_JSON_BYTES = 64 * 1024;
const DEFAULT_MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
const TURNSTILE_VERIFY_URL =
  "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TURNSTILE_TIMEOUT_MS = 5000;

interface FormRateLimitBinding {
  limit: (options: { key: string }) => Promise<{ success: boolean }>;
}

declare global {
  interface CloudflareEnv {
    FORM_RATE_LIMITER?: FormRateLimitBinding;
  }
}

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

function isPlainRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sha256Digest(value: string): Buffer {
  return createHash("sha256").update(value, "utf8").digest();
}

export function timingSafeEqualStrings(a: string, b: string): boolean {
  return timingSafeEqual(sha256Digest(a), sha256Digest(b));
}

async function getFormRateLimiterBinding(): Promise<
  FormRateLimitBinding | undefined
> {
  try {
    const context = await getCloudflareContext({ async: true });
    return context.env?.FORM_RATE_LIMITER;
  } catch {
    return undefined;
  }
}

export function verifyWebhookSecret(
  request: Request,
  envNames: string[],
  headerNames: string[],
): { ok: true } | { ok: false; status: 401 | 500; error: string } {
  let expectedSecret = "";
  for (const envName of envNames) {
    const candidate = process.env[envName]?.trim();
    if (candidate) {
      expectedSecret = candidate;
      break;
    }
  }

  if (!expectedSecret) {
    return {
      ok: false,
      status: 500,
      error: "Webhook authentication is not configured.",
    };
  }

  let providedSecret = "";
  for (const headerName of headerNames) {
    const rawHeader = request.headers.get(headerName)?.trim();
    if (!rawHeader) {
      continue;
    }

    if (headerName.toLowerCase() === "authorization") {
      const bearerMatch = /^bearer\s+(.+)$/i.exec(rawHeader);
      const token = bearerMatch?.[1]?.trim();
      if (token) {
        providedSecret = token;
        break;
      }
      continue;
    }

    providedSecret = rawHeader;
    break;
  }

  if (
    !providedSecret ||
    !timingSafeEqualStrings(providedSecret, expectedSecret)
  ) {
    return {
      ok: false,
      status: 401,
      error: "Unauthorized webhook request.",
    };
  }

  return { ok: true };
}

function combineUint8Chunks(
  chunks: Uint8Array[],
  totalBytes: number,
): Uint8Array {
  const combined = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return combined;
}

export async function readBoundedBodyText(
  request: Request,
  maxBytes = DEFAULT_MAX_JSON_BYTES,
  language: SiteLanguage = "en",
): Promise<
  { ok: true; text: string } | { ok: false; status: 400 | 413; error: string }
> {
  const isEs = language === "es";
  const contentLengthRaw = request.headers.get("content-length")?.trim();
  if (contentLengthRaw && /^\d+$/.test(contentLengthRaw)) {
    const declaredLength = Number(contentLengthRaw);
    if (declaredLength > maxBytes) {
      return {
        ok: false,
        status: 413,
        error: isEs
          ? "El tamaño de la solicitud supera el límite permitido."
          : "Request body is too large.",
      };
    }
  }

  if (request.body) {
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (!value) {
          continue;
        }

        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel().catch(() => {});
          return {
            ok: false,
            status: 413,
            error: isEs
              ? "El tamaño de la solicitud supera el límite permitido."
              : "Request body is too large.",
          };
        }
        chunks.push(value);
      }
    } catch {
      return {
        ok: false,
        status: 400,
        error: isEs
          ? "No se pudo leer el cuerpo de la solicitud."
          : "Unable to read request body.",
      };
    }

    try {
      const combined = combineUint8Chunks(chunks, totalBytes);
      const text = new TextDecoder("utf-8", { fatal: true }).decode(combined);
      return { ok: true, text };
    } catch {
      return {
        ok: false,
        status: 400,
        error: isEs
          ? "El cuerpo de la solicitud debe estar en formato UTF-8 válido."
          : "Request body must be valid UTF-8.",
      };
    }
  }

  let text: string;
  try {
    text = await request.text();
  } catch {
    return {
      ok: false,
      status: 400,
      error: isEs
        ? "No se pudo leer el cuerpo de la solicitud."
        : "Unable to read request body.",
    };
  }

  if (new TextEncoder().encode(text).byteLength > maxBytes) {
    return {
      ok: false,
      status: 413,
      error: isEs
        ? "El tamaño de la solicitud supera el límite permitido."
        : "Request body is too large.",
    };
  }

  return { ok: true, text };
}

export async function readJsonObject(
  request: Request,
  maxBytes = DEFAULT_MAX_JSON_BYTES,
  language: SiteLanguage = "en",
): Promise<
  | { ok: true; data: Record<string, unknown> }
  | { ok: false; status: 400 | 413; error: string }
> {
  const isEs = language === "es";
  const bodyResult = await readBoundedBodyText(request, maxBytes, language);
  if (!bodyResult.ok) {
    return bodyResult;
  }

  if (!bodyResult.text.trim()) {
    return {
      ok: false,
      status: 400,
      error: isEs ? "Datos de envío no válidos." : "Invalid JSON payload.",
    };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(bodyResult.text);
  } catch {
    return {
      ok: false,
      status: 400,
      error: isEs ? "Datos de envío no válidos." : "Invalid JSON payload.",
    };
  }

  if (!isPlainRecord(parsed)) {
    return {
      ok: false,
      status: 400,
      error: isEs
        ? "Formato de solicitud no válido."
        : "Expected a JSON object payload.",
    };
  }

  return { ok: true, data: parsed };
}

export function getClientIp(request: Request): string {
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  const xRealIp = request.headers.get("x-real-ip");
  const xForwardedFor = request.headers.get("x-forwarded-for");

  const forwardedFirst = xForwardedFor?.split(",")[0];
  const rawCandidate = cfConnectingIp ?? xRealIp ?? forwardedFirst ?? "";
  const sanitized = rawCandidate
    .replace(/[\u0000-\u001F\u007F]+/g, "")
    .trim()
    .slice(0, 64);

  return sanitized || "unknown";
}

function pruneExpiredRateLimits(now: number): void {
  for (const [entryKey, entry] of rateLimitStore.entries()) {
    if (entry.resetAt <= now) {
      rateLimitStore.delete(entryKey);
    }
  }
}

export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}

export function checkRateLimit(
  key: string,
  limit: number,
  windowMs: number,
): { ok: boolean; remaining: number; retryAfterSeconds: number } {
  const effectiveWindowMs = Math.max(1, windowMs);
  if (limit <= 0) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil(effectiveWindowMs / 1000)),
    };
  }

  const now = Date.now();
  if (rateLimitStore.size >= RATE_LIMIT_PRUNE_THRESHOLD) {
    pruneExpiredRateLimits(now);
  }

  const existing = rateLimitStore.get(key);
  if (!existing || existing.resetAt <= now) {
    if (existing) {
      rateLimitStore.delete(key);
    }

    if (rateLimitStore.size >= RATE_LIMIT_MAX_ENTRIES) {
      pruneExpiredRateLimits(now);
      while (rateLimitStore.size >= RATE_LIMIT_MAX_ENTRIES) {
        const oldestKey = rateLimitStore.keys().next().value;
        if (oldestKey === undefined) {
          break;
        }
        rateLimitStore.delete(oldestKey);
      }
    }

    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + effectiveWindowMs,
    });
    return {
      ok: true,
      remaining: limit - 1,
      retryAfterSeconds: 0,
    };
  }

  // Refresh insertion order for bounded LRU eviction.
  rateLimitStore.delete(key);
  rateLimitStore.set(key, existing);

  if (existing.count >= limit) {
    return {
      ok: false,
      remaining: 0,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((existing.resetAt - now) / 1000),
      ),
    };
  }

  existing.count += 1;
  return {
    ok: true,
    remaining: limit - existing.count,
    retryAfterSeconds: 0,
  };
}

export async function verifyTurnstileToken(
  token: string,
  ip?: string,
  language: SiteLanguage = "en",
): Promise<{ ok: boolean; error?: string }> {
  const isEs = language === "es";
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    return {
      ok: false,
      error: isEs
        ? "La verificación de seguridad no está configurada."
        : "Security verification is not configured.",
    };
  }

  const trimmedToken = token.trim();
  if (!trimmedToken) {
    return {
      ok: false,
      error: isEs
        ? "Completa la verificación de seguridad antes de enviar."
        : "Complete the security verification before submitting.",
    };
  }

  const body = new URLSearchParams({
    secret,
    response: trimmedToken,
  });
  if (ip && ip !== "unknown") {
    body.set("remoteip", ip);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, TURNSTILE_TIMEOUT_MS);

  try {
    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        ok: false,
        error: isEs
          ? "El servicio de verificación de seguridad devolvió un error."
          : "Security verification service returned an error.",
      };
    }

    const result: unknown = await response.json();
    if (isPlainRecord(result) && result.success === true) {
      return { ok: true };
    }

    return {
      ok: false,
      error: isEs
        ? "No se pudo completar la verificación de seguridad."
        : "Security verification failed.",
    };
  } catch {
    return {
      ok: false,
      error: isEs
        ? "No pudimos completar la verificación de seguridad."
        : "Unable to complete security verification.",
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function guardFormRequest(
  request: Request,
  payload: { companyWebsite?: unknown; turnstileToken?: unknown },
  options?: {
    scope?: string;
    limit?: number;
    windowMs?: number;
    language?: SiteLanguage;
  },
): Promise<
  | { ok: true; honeypotTriggered?: boolean }
  | { ok: false; status: 400 | 403 | 429; error: string }
> {
  const language: SiteLanguage = options?.language ?? "en";
  const isEs = language === "es";

  if (
    typeof payload.companyWebsite === "string" &&
    payload.companyWebsite.trim().length > 0
  ) {
    return { ok: true, honeypotTriggered: true };
  }

  const scope = options?.scope?.trim() || "form";
  const limit = options?.limit ?? 10;
  const windowMs = options?.windowMs ?? 60_000;
  const clientIp = getClientIp(request);

  const edgeRateLimiter = await getFormRateLimiterBinding();
  if (edgeRateLimiter) {
    try {
      const edgeRate = await edgeRateLimiter.limit({
        key: `${scope}:${clientIp}`,
      });
      if (!edgeRate.success) {
        return {
          ok: false,
          status: 429,
          error: isEs
            ? "Has enviado demasiadas solicitudes seguidas. Espera un momento e inténtalo de nuevo."
            : "Too many requests. Wait a moment and try again.",
        };
      }
    } catch (error) {
      console.error("Cloudflare form rate limiter failed:", error);
    }
  }

  const rate = checkRateLimit(`${scope}:${clientIp}`, limit, windowMs);
  if (!rate.ok) {
    return {
      ok: false,
      status: 429,
      error: isEs
        ? "Has enviado demasiadas solicitudes seguidas. Espera un momento e inténtalo de nuevo."
        : "Too many requests. Wait a moment and try again.",
    };
  }

  if (process.env.TURNSTILE_SECRET_KEY?.trim()) {
    const token =
      typeof payload.turnstileToken === "string"
        ? payload.turnstileToken.trim()
        : "";
    if (!token) {
      return {
        ok: false,
        status: 400,
        error: isEs
          ? "Completa la verificación de seguridad antes de enviar."
          : "Complete the security verification before submitting.",
      };
    }

    const verification = await verifyTurnstileToken(token, clientIp, language);
    if (!verification.ok) {
      return {
        ok: false,
        status: 403,
        error:
          verification.error ??
          (isEs
            ? "No se pudo completar la verificación de seguridad."
            : "Security verification failed."),
      };
    }
  }

  return { ok: true };
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function sanitizeHeaderValue(value: string): string {
  return value.replace(/[\r\n\u0000-\u001F\u007F]+/g, " ").trim();
}

export function isSafeHttpUrl(value: string): boolean {
  if (/[\u0000-\u001F\u007F]/.test(value)) {
    return false;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      Boolean(parsed.hostname) &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}

interface AllowedUploadFormat {
  mimeType: string;
  matchesMagic: (bytes: Uint8Array) => boolean;
}

function hasBytePrefix(bytes: Uint8Array, prefix: readonly number[]): boolean {
  if (bytes.length < prefix.length) {
    return false;
  }
  for (let index = 0; index < prefix.length; index += 1) {
    if (bytes[index] !== prefix[index]) {
      return false;
    }
  }
  return true;
}

function isJpegBytes(bytes: Uint8Array): boolean {
  return hasBytePrefix(bytes, [0xff, 0xd8, 0xff]);
}

function isPngBytes(bytes: Uint8Array): boolean {
  return hasBytePrefix(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
}

function isWebpBytes(bytes: Uint8Array): boolean {
  if (bytes.length < 12) {
    return false;
  }
  return (
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  );
}

function isPdfBytes(bytes: Uint8Array): boolean {
  return hasBytePrefix(bytes, [0x25, 0x50, 0x44, 0x46, 0x2d]);
}

const ALLOWED_UPLOAD_FORMATS = new Map<string, AllowedUploadFormat>([
  ["jpg", { mimeType: "image/jpeg", matchesMagic: isJpegBytes }],
  ["jpeg", { mimeType: "image/jpeg", matchesMagic: isJpegBytes }],
  ["png", { mimeType: "image/png", matchesMagic: isPngBytes }],
  ["webp", { mimeType: "image/webp", matchesMagic: isWebpBytes }],
  ["pdf", { mimeType: "application/pdf", matchesMagic: isPdfBytes }],
]);

function sanitizeUploadFilename(rawName: string): string {
  const pathParts = rawName.split(/[\\/]/);
  const basename = pathParts[pathParts.length - 1] ?? "";
  const cleaned = basename
    .replace(/[\u0000-\u001F\u007F]+/g, "")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^\.+/, "")
    .replace(/-+/g, "-")
    .slice(0, 120)
    .trim();

  return cleaned;
}

function encodeBytesToBase64(bytes: Uint8Array): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }

  let binary = "";
  const chunkSize = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    const slice = bytes.subarray(offset, offset + chunkSize);
    for (const byte of slice) {
      binary += String.fromCharCode(byte);
    }
  }
  return btoa(binary);
}

export async function validateUploadedFile(
  file: File,
  options?: { maxBytes?: number; language?: SiteLanguage },
): Promise<
  | {
      ok: true;
      filename: string;
      contentType: string;
      base64Content: string;
      size: number;
    }
  | { ok: false; error: string }
> {
  const maxBytes = options?.maxBytes ?? DEFAULT_MAX_UPLOAD_BYTES;
  const isEs = options?.language === "es";

  if (
    !file ||
    typeof file.name !== "string" ||
    typeof file.type !== "string" ||
    typeof file.size !== "number" ||
    typeof file.arrayBuffer !== "function"
  ) {
    return {
      ok: false,
      error: isEs ? "Archivo adjunto no válido." : "Invalid uploaded file.",
    };
  }

  if (file.size <= 0) {
    return {
      ok: false,
      error: isEs
        ? "El archivo adjunto está vacío."
        : "Uploaded file is empty.",
    };
  }

  if (file.size > maxBytes) {
    const limitMb = Math.floor(maxBytes / (1024 * 1024));
    return {
      ok: false,
      error: isEs
        ? `El archivo adjunto supera el límite de ${limitMb} MB.`
        : `Uploaded file exceeds the ${limitMb} MB limit.`,
    };
  }

  const filename = sanitizeUploadFilename(file.name);
  const lastDot = filename.lastIndexOf(".");
  if (!filename || lastDot <= 0 || lastDot === filename.length - 1) {
    return {
      ok: false,
      error: isEs
        ? "El archivo adjunto debe tener una extensión válida."
        : "Uploaded file must have a valid extension.",
    };
  }

  const extension = filename.slice(lastDot + 1).toLowerCase();
  const format = ALLOWED_UPLOAD_FORMATS.get(extension);
  const rawMimeType = file.type.trim().toLowerCase();
  const normalizedMimeType =
    rawMimeType === "image/jpg" ? "image/jpeg" : rawMimeType;

  // Allow an empty browser MIME type when the extension is allowed, relying on
  // strict magic-byte verification below to verify genuine file contents.
  if (
    !format ||
    (normalizedMimeType !== "" && normalizedMimeType !== format.mimeType)
  ) {
    return {
      ok: false,
      error: isEs
        ? "Solo se admiten archivos JPG, PNG, WebP y PDF."
        : "Only JPG, PNG, WebP, and PDF files are supported.",
    };
  }

  let bytes: Uint8Array;
  try {
    bytes = new Uint8Array(await file.arrayBuffer());
  } catch {
    return {
      ok: false,
      error: isEs
        ? "No pudimos leer el archivo adjunto."
        : "Unable to read uploaded file.",
    };
  }

  if (bytes.byteLength <= 0 || bytes.byteLength > maxBytes) {
    return {
      ok: false,
      error: isEs
        ? "El tamaño del archivo adjunto no es válido o supera el límite permitido."
        : "Uploaded file size is invalid or exceeds the allowed limit.",
    };
  }

  if (!format.matchesMagic(bytes)) {
    return {
      ok: false,
      error: isEs
        ? "El contenido del archivo no coincide con el formato declarado."
        : "File contents do not match the declared file type.",
    };
  }

  return {
    ok: true,
    filename,
    contentType: format.mimeType,
    base64Content: encodeBytesToBase64(bytes),
    size: bytes.byteLength,
  };
}
