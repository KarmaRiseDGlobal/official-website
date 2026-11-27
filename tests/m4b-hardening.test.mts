import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  createElement,
  type ComponentType,
  type ReactElement,
  type ReactNode,
} from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const VIRTUAL_STUB_ROOT = pathToFileURL(
  path.join(REPO_ROOT, "tests", "__m4b_virtual__") + path.sep,
).href;

const hooksModuleUrl = new URL("./test-hooks.mts", import.meta.url).href;
const hooksModule = (await import(hooksModuleUrl)) as {
  registerTestModuleHooks: () => void;
};
hooksModule.registerTestModuleHooks();

const VIRTUAL_STUBS: Record<string, string> = {
  "next-link.mjs": `
import { createElement } from "react";
export default function Link({ href, children, ...rest }) {
  return createElement("a", { href: typeof href === "string" ? href : String(href), ...rest }, children);
}
`,
  "next-image.mjs": `
import { createElement } from "react";
export default function Image({ src, alt = "", fill: _fill, priority: _priority, sizes: _sizes, ...rest }) {
  const resolvedSrc = typeof src === "string" ? src : "";
  return createElement("img", { src: resolvedSrc, alt, ...rest });
}
`,
  "next-navigation.mjs": `
export function useRouter() {
  return { push() {}, replace() {}, prefetch() {} };
}
export function usePathname() {
  return "/";
}
export function useSearchParams() {
  return new URLSearchParams();
}
`,
  "null-component.mjs": `
export function SiteFooter() { return null; }
export function StoryMedia() { return null; }
export function NewsletterForm() { return null; }
export function TurnstileField() { return null; }
`,
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "next/link") {
      return { shortCircuit: true, url: `${VIRTUAL_STUB_ROOT}next-link.mjs` };
    }
    if (specifier === "next/image") {
      return { shortCircuit: true, url: `${VIRTUAL_STUB_ROOT}next-image.mjs` };
    }
    if (specifier === "next/navigation") {
      return {
        shortCircuit: true,
        url: `${VIRTUAL_STUB_ROOT}next-navigation.mjs`,
      };
    }
    if (
      specifier === "@/components/shell/site-footer" ||
      specifier === "@/components/stories/story-media" ||
      specifier === "@/components/forms/newsletter-form" ||
      specifier === "@/components/forms/turnstile-field"
    ) {
      return {
        shortCircuit: true,
        url: `${VIRTUAL_STUB_ROOT}null-component.mjs`,
      };
    }
    return nextResolve(specifier, context);
  },
  load(url, context, nextLoad) {
    if (url.startsWith(VIRTUAL_STUB_ROOT)) {
      const key = url.slice(VIRTUAL_STUB_ROOT.length);
      const source = VIRTUAL_STUBS[key];
      if (source !== undefined) {
        return {
          shortCircuit: true,
          format: "module",
          source,
        };
      }
    }

    if (url.startsWith("file:") && url.endsWith(".tsx")) {
      const filePath = fileURLToPath(url);
      const rawSource = readFileSync(filePath, "utf8");
      const transpiled = ts.transpileModule(rawSource, {
        fileName: filePath,
        compilerOptions: {
          jsx: ts.JsxEmit.ReactJSX,
          module: ts.ModuleKind.ESNext,
          target: ts.ScriptTarget.ES2022,
          esModuleInterop: true,
        },
      });
      return {
        shortCircuit: true,
        format: "module",
        source: transpiled.outputText,
      };
    }

    return nextLoad(url, context);
  },
});

const { resetRateLimitStore } = await import("@/lib/security");
const { GET: preferencesGet, POST: preferencesPost } =
  await import("@/app/api/newsletter/preferences/route");
const { renderNewsletterHtml, syncNewsletterIssueToBrevo } =
  await import("@/lib/brevo-campaigns");
const { getNewsletterIssueById } = await import("@/lib/sanity");
const { stories } = await import("@/data/stories");
const { LanguageProvider } = await import("@/context/language-context");
const { StoryDetailClient, sanitizePortableLinkHref } =
  await import("@/views/story-detail-client");
const { ProductBriefPageClient } = await import("@/views/product-brief-client");
const { ProductBriefForm } =
  await import("@/components/forms/product-brief-form");
const { ContactForm } = await import("@/components/forms/contact-form");

const FORBIDDEN_COPY_PATTERN =
  /\u2014|&mdash;|&#8212;|ulhasnagar|maharashtra|\bjournal\b|\bdiario\b|worktable|\bchai\b/i;

function assertCleanVoiceAndCopy(html: string, label: string): void {
  const match = FORBIDDEN_COPY_PATTERN.exec(html);
  assert.equal(
    match,
    null,
    `${label} contained forbidden M1 R1 copy: ${match?.[0] ?? ""}`,
  );
}

function assertCleanPreferencesHtml(html: string, label: string): void {
  assertCleanVoiceAndCopy(html, label);
  assert.equal(
    /<table\b/i.test(html),
    false,
    `${label} must not contain <table> tags`,
  );
}

interface RecordedFetchCall {
  url: string;
  method: string;
  bodyText: string;
  jsonBody: Record<string, unknown> | null;
}

const TRACKED_ENV_KEYS = [
  "NODE_ENV",
  "BREVO_API_KEY",
  "BREVO_LIST_ID",
  "BREVO_LIST_ID_EN",
  "BREVO_LIST_ID_ES",
  "BREVO_SENDER_NAME",
  "BREVO_SENDER_EMAIL",
  "BREVO_REPLY_TO_EMAIL",
  "BREVO_WEBHOOK_SECRET",
  "PREFERENCES_SIGNING_SECRET",
  "TURNSTILE_SECRET_KEY",
  "NEXT_PUBLIC_TURNSTILE_SITE_KEY",
  "NEXT_PUBLIC_SITE_URL",
  "SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "SANITY_DATASET",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_KEY",
] as const;

type TrackedEnvKey = (typeof TRACKED_ENV_KEYS)[number];
type EnvSnapshot = Partial<Record<TrackedEnvKey, string | undefined>>;

function snapshotEnv(): EnvSnapshot {
  const mutableEnv = process.env as Record<string, string | undefined>;
  const snap: EnvSnapshot = {};
  for (const key of TRACKED_ENV_KEYS) {
    snap[key] = mutableEnv[key];
  }
  return snap;
}

function restoreEnv(snap: EnvSnapshot): void {
  const mutableEnv = process.env as Record<string, string | undefined>;
  for (const key of TRACKED_ENV_KEYS) {
    const previous = snap[key];
    if (previous === undefined) {
      delete mutableEnv[key];
    } else {
      mutableEnv[key] = previous;
    }
  }
}

function setTestEnv(overrides: Partial<Record<TrackedEnvKey, string>>): void {
  const mutableEnv = process.env as Record<string, string | undefined>;
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete mutableEnv[key];
    } else {
      mutableEnv[key] = value;
    }
  }
}

async function withMockedFetch(
  handler: (
    url: string,
    init: RequestInit | undefined,
    callIndex: number,
  ) => Response | Promise<Response>,
  run: (calls: RecordedFetchCall[]) => Promise<void>,
): Promise<void> {
  const originalFetch = globalThis.fetch;
  const calls: RecordedFetchCall[] = [];

  globalThis.fetch = async (
    input: string | URL | Request,
    init?: RequestInit,
  ): Promise<Response> => {
    const url =
      typeof input === "string"
        ? input
        : input instanceof URL
          ? input.toString()
          : input.url;
    const bodyText = typeof init?.body === "string" ? init.body : "";
    let jsonBody: Record<string, unknown> | null = null;
    if (bodyText.startsWith("{")) {
      try {
        jsonBody = JSON.parse(bodyText) as Record<string, unknown>;
      } catch {
        jsonBody = null;
      }
    }

    const callIndex = calls.length;
    calls.push({
      url,
      method: init?.method ?? "GET",
      bodyText,
      jsonBody,
    });

    return handler(url, init, callIndex);
  };

  try {
    await run(calls);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

function signPreferences(
  email: string,
  lang: "EN" | "ES",
  secret: string,
): string {
  return createHmac("sha256", secret)
    .update(`newsletter-preferences:v1:${email}:${lang}`, "utf8")
    .digest("hex");
}

test("GET /api/newsletter/preferences is non-mutating without signature, renders POST form, localizes Stories links, and escapes XSS", async () => {
  const snap = snapshotEnv();
  resetRateLimitStore();

  try {
    setTestEnv({
      BREVO_API_KEY: "brevo-test-key",
      BREVO_LIST_ID: "10",
      BREVO_LIST_ID_EN: "11",
      BREVO_LIST_ID_ES: "12",
    });
    delete (process.env as Record<string, string | undefined>)
      .TURNSTILE_SECRET_KEY;
    delete (process.env as Record<string, string | undefined>)
      .NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    delete (process.env as Record<string, string | undefined>)
      .PREFERENCES_SIGNING_SECRET;
    delete (process.env as Record<string, string | undefined>)
      .BREVO_WEBHOOK_SECRET;

    await withMockedFetch(
      () => Response.json({ id: 1 }, { status: 200 }),
      async (calls) => {
        const esRes = await preferencesGet(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences?email=reader%40example.es&lang=ES",
          ),
        );
        assert.equal(esRes.status, 200);
        assert.equal(
          esRes.headers.get("content-type"),
          "text/html; charset=utf-8",
        );
        assert.equal(esRes.headers.get("cache-control"), "no-store, max-age=0");
        assert.equal(esRes.headers.get("x-content-type-options"), "nosniff");

        const esHtml = await esRes.text();
        assert.match(
          esHtml,
          /<form method="POST" action="\/api\/newsletter\/preferences"/,
        );
        assert.match(
          esHtml,
          /<input type="hidden" name="email" value="reader@example\.es"/,
        );
        assert.match(esHtml, /<input type="hidden" name="lang" value="ES"/);
        assert.match(esHtml, /name="companyWebsite"/);
        assert.match(esHtml, /href="\/es\/stories"/);
        assert.equal(/<script\b/i.test(esHtml), false);
        assert.equal(/\son[a-z]+\s*=/i.test(esHtml), false);
        assertCleanPreferencesHtml(esHtml, "GET preferences ES");

        const enRes = await preferencesGet(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences?email=reader%40example.com&lang=EN",
          ),
        );
        const enHtml = await enRes.text();
        assert.match(enHtml, /href="\/stories"/);
        assert.equal(enHtml.includes("/es/stories"), false);
        assertCleanPreferencesHtml(enHtml, "GET preferences EN");

        const xssRes = await preferencesGet(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences?email=%22%3E%3Cscript%3Ealert(1)%3C%2Fscript%3E'%40example.com&lang=ES",
          ),
        );
        assert.equal(xssRes.status, 200);
        const xssHtml = await xssRes.text();
        assert.equal(xssHtml.includes("<script>alert(1)"), false);
        assert.match(xssHtml, /<input id="pref-email" type="email"/);

        assert.equal(
          calls.length,
          0,
          "Unsigned GET requests must never call Brevo",
        );
      },
    );
  } finally {
    resetRateLimitStore();
    restoreEnv(snap);
  }
});

test("GET /api/newsletter/preferences verifies optional HMAC sig and renders implicit Turnstile when configured", async () => {
  const snap = snapshotEnv();
  resetRateLimitStore();

  try {
    setTestEnv({
      BREVO_API_KEY: "brevo-test-key",
      BREVO_LIST_ID: "10",
      BREVO_LIST_ID_EN: "11",
      BREVO_LIST_ID_ES: "12",
      PREFERENCES_SIGNING_SECRET: "signing-secret-123",
      TURNSTILE_SECRET_KEY: "turnstile-secret",
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "0x4AAAAAAA_sitekey",
    });

    await withMockedFetch(
      () => new Response(null, { status: 204 }),
      async (calls) => {
        const unsignedRes = await preferencesGet(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences?email=alma%40example.es&lang=ES",
          ),
        );
        assert.equal(unsignedRes.status, 200);
        const unsignedHtml = await unsignedRes.text();
        assert.match(
          unsignedHtml,
          /src="https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js"/,
        );
        assert.match(
          unsignedHtml,
          /class="cf-turnstile" data-sitekey="0x4AAAAAAA_sitekey"/,
        );
        assert.equal(calls.length, 0);

        const badSigRes = await preferencesGet(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences?email=alma%40example.es&lang=ES&sig=tampered",
            { headers: { "x-forwarded-for": "198.51.100.10" } },
          ),
        );
        assert.equal(badSigRes.status, 403);
        assert.equal(calls.length, 0);

        const sig = signPreferences(
          "alma@example.es",
          "ES",
          "signing-secret-123",
        );
        const validSigRes = await preferencesGet(
          new Request(
            `https://karmarisedglobal.com/api/newsletter/preferences?email=alma%40example.es&lang=ES&sig=${sig}`,
            { headers: { "x-forwarded-for": "198.51.100.11" } },
          ),
        );
        assert.equal(validSigRes.status, 200);
        const updatedHtml = await validSigRes.text();
        assert.match(updatedHtml, /href="\/es\/stories"/);
        assert.match(updatedHtml, /¡Listo!/);
        assert.equal(calls.length, 2);
        assert.equal(calls[0]?.url, "https://api.brevo.com/v3/contacts");
        assert.deepEqual(calls[0]?.jsonBody?.attributes, { LANGUAGE: "ES" });
        assert.equal(calls[1]?.url, "https://api.brevo.com/v3/events");
        assert.equal(
          calls[1]?.jsonBody?.event_name,
          "newsletter_language_switched",
        );
      },
    );
  } finally {
    resetRateLimitStore();
    restoreEnv(snap);
  }
});

test("POST /api/newsletter/preferences supports JSON and form-urlencoded, validates inputs, and enforces guardFormRequest", async () => {
  const snap = snapshotEnv();
  resetRateLimitStore();

  try {
    setTestEnv({
      BREVO_API_KEY: "brevo-test-key",
      BREVO_LIST_ID: "10",
      BREVO_LIST_ID_EN: "11",
      BREVO_LIST_ID_ES: "12",
    });
    delete (process.env as Record<string, string | undefined>)
      .TURNSTILE_SECRET_KEY;

    await withMockedFetch(
      (url) => {
        if (
          url === "https://challenges.cloudflare.com/turnstile/v0/siteverify"
        ) {
          return Response.json({ success: true }, { status: 200 });
        }
        return new Response(null, { status: 204 });
      },
      async (calls) => {
        const jsonOk = await preferencesPost(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "x-forwarded-for": "203.0.113.1",
              },
              body: JSON.stringify({
                email: "client@example.es",
                lang: "ES",
              }),
            },
          ),
        );
        assert.equal(jsonOk.status, 200);
        assert.deepEqual(await jsonOk.json(), { ok: true, language: "ES" });
        assert.equal(calls.length, 2);

        const formOk = await preferencesPost(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences",
            {
              method: "POST",
              headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-forwarded-for": "203.0.113.2",
              },
              body: new URLSearchParams({
                email: "client@example.es",
                lang: "ES",
              }).toString(),
            },
          ),
        );
        assert.equal(formOk.status, 200);
        assert.equal(
          formOk.headers.get("content-type"),
          "text/html; charset=utf-8",
        );
        assert.equal(
          formOk.headers.get("cache-control"),
          "no-store, max-age=0",
        );
        const formHtml = await formOk.text();
        assert.match(formHtml, /href="\/es\/stories"/);
        assertCleanPreferencesHtml(formHtml, "POST form-urlencoded ES");
        assert.equal(calls.length, 4);

        const invalidLangRes = await preferencesPost(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "x-forwarded-for": "203.0.113.3",
              },
              body: JSON.stringify({
                email: "client@example.es",
                lang: "FR",
              }),
            },
          ),
        );
        assert.equal(invalidLangRes.status, 400);

        const invalidEmailRes = await preferencesPost(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "x-forwarded-for": "203.0.113.4",
              },
              body: JSON.stringify({
                email: "not-an-email",
                lang: "EN",
              }),
            },
          ),
        );
        assert.equal(invalidEmailRes.status, 400);

        const oversizedRes = await preferencesPost(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "x-forwarded-for": "203.0.113.5",
              },
              body: JSON.stringify({
                email: "client@example.com",
                lang: "EN",
                padding: "x".repeat(20 * 1024),
              }),
            },
          ),
        );
        assert.equal(oversizedRes.status, 413);

        const honeypotRes = await preferencesPost(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences",
            {
              method: "POST",
              headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-forwarded-for": "203.0.113.6",
              },
              body: new URLSearchParams({
                email: "bot@example.com",
                lang: "EN",
                companyWebsite: "https://spam.invalid",
              }).toString(),
            },
          ),
        );
        assert.equal(honeypotRes.status, 200);
        assert.equal(
          calls.length,
          4,
          "Honeypot should skip Brevo update silently",
        );

        setTestEnv({ TURNSTILE_SECRET_KEY: "turnstile-secret" });
        const missingTurnstileRes = await preferencesPost(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences",
            {
              method: "POST",
              headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-forwarded-for": "203.0.113.7",
              },
              body: new URLSearchParams({
                email: "client@example.es",
                lang: "ES",
              }).toString(),
            },
          ),
        );
        assert.equal(missingTurnstileRes.status, 400);

        const validTurnstileRes = await preferencesPost(
          new Request(
            "https://karmarisedglobal.com/api/newsletter/preferences",
            {
              method: "POST",
              headers: {
                "content-type": "application/x-www-form-urlencoded",
                "x-forwarded-for": "203.0.113.8",
              },
              body: new URLSearchParams({
                email: "client@example.es",
                lang: "ES",
                "cf-turnstile-response": "valid-cf-token",
              }).toString(),
            },
          ),
        );
        assert.equal(validTurnstileRes.status, 200);
        assert.equal(calls.length, 7);

        delete (process.env as Record<string, string | undefined>)
          .TURNSTILE_SECRET_KEY;

        let rateLimitedStatus = 200;
        for (let attempt = 0; attempt < 11; attempt += 1) {
          const res = await preferencesPost(
            new Request(
              "https://karmarisedglobal.com/api/newsletter/preferences",
              {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  "x-forwarded-for": "203.0.113.99",
                },
                body: JSON.stringify({
                  email: "client@example.com",
                  lang: "EN",
                }),
              },
            ),
          );
          rateLimitedStatus = res.status;
        }
        assert.equal(rateLimitedStatus, 429);
      },
    );
  } finally {
    resetRateLimitStore();
    restoreEnv(snap);
  }
});

test("renderNewsletterHtml sanitizes URLs, escapes attributes, uses spanishLocation, and preserves M1 R1 copy", () => {
  const snap = snapshotEnv();
  try {
    setTestEnv({ NEXT_PUBLIC_SITE_URL: "https://karmarisedglobal.com" });

    const unsafeHtml = renderNewsletterHtml(
      {
        _id: "issue-unsafe",
        issueNumber: "Issue #002",
        titleEn: "Notes from India & Spain",
        titleEs: "Historias entre España y la India",
        ctaUrl: "javascript:alert(1)",
        heroImageUrl: "data:text/html,<script>alert(1)</script>",
        selectedStories: [
          {
            slug: "spanish-loc-story",
            title: "Workshop visit",
            spanishTitle: "Visita al taller",
            summary: "Summary EN",
            spanishSummary: "Resumen ES",
            category: "Inside KarmaRise",
            location: "Across India",
            spanishLocation: "Por toda la India desde Madrid",
            leadImageUrl: "vbscript:msgbox(1)",
          },
        ],
      },
      "es",
    );

    assert.equal(unsafeHtml.includes("javascript:alert"), false);
    assert.equal(unsafeHtml.includes("data:text/html"), false);
    assert.equal(unsafeHtml.includes("vbscript:"), false);
    assert.match(unsafeHtml, /href="https:\/\/karmarisedglobal\.com\/es"/);
    assert.match(
      unsafeHtml,
      /href="https:\/\/karmarisedglobal\.com\/es\/stories\/spanish-loc-story\?utm_source=brevo&amp;utm_medium=email/,
    );
    assert.match(
      unsafeHtml,
      /src="https:\/\/karmarisedglobal\.com\/images\/founders\/alma-shirish-planning-table-window-india\.jpeg"/,
    );
    assert.match(unsafeHtml, /Por toda la India desde Madrid/);
    assertCleanVoiceAndCopy(unsafeHtml, "renderNewsletterHtml ES unsafe");

    const escapedAttrHtml = renderNewsletterHtml(
      {
        _id: "issue-escape",
        issueNumber: "Issue #003",
        titleEn: "Craft & Material",
        ctaUrl: "https://karmarisedglobal.com/stories?tag=craft&lang=en",
        heroImageUrl:
          'https://cdn.sanity.io/images/proj/prod/hero.jpg?fit=max&q="90"',
        selectedStories: [
          {
            slug: "valid-story",
            title: "Valid Story",
            summary: "Summary",
            leadImageUrl:
              "https://cdn.sanity.io/images/proj/prod/story.jpg?fit=crop",
          },
        ],
      },
      "en",
    );

    assert.match(
      escapedAttrHtml,
      /src="https:\/\/cdn\.sanity\.io\/images\/proj\/prod\/hero\.jpg\?fit=max&amp;q=&quot;90&quot;&amp;w=1100&amp;q=85&amp;auto=format"/,
    );
    assert.match(
      escapedAttrHtml,
      /src="https:\/\/cdn\.sanity\.io\/images\/proj\/prod\/story\.jpg\?fit=crop&amp;w=960&amp;q=82&amp;auto=format"/,
    );
    assert.match(
      escapedAttrHtml,
      /href="https:\/\/karmarisedglobal\.com\/stories\?tag=craft&amp;lang=en&amp;utm_source=brevo&amp;utm_medium=email/,
    );
    assertCleanVoiceAndCopy(escapedAttrHtml, "renderNewsletterHtml EN escaped");
  } finally {
    restoreEnv(snap);
  }
});

test("syncNewsletterIssueToBrevo does not mask re-sync or partial failures with stale campaign IDs", async () => {
  const snap = snapshotEnv();
  try {
    setTestEnv({
      BREVO_API_KEY: "brevo-test-key",
      BREVO_LIST_ID: "10",
      BREVO_LIST_ID_EN: "11",
      BREVO_LIST_ID_ES: "12",
    });

    await withMockedFetch(
      () => Response.json({ message: "Server error" }, { status: 500 }),
      async (calls) => {
        const res = await syncNewsletterIssueToBrevo({
          _id: "issue-resync-fail",
          targetAudience: "en",
          brevoCampaignIdEn: 101,
          titleEn: "Re-sync test",
        });
        assert.equal(res.ok, false);
        assert.match(res.error ?? "", /EN:/);
        assert.equal(
          calls.length,
          1,
          "Non-404 PUT error must not fall back to POST",
        );
        assert.equal(calls[0]?.method, "PUT");
      },
    );

    await withMockedFetch(
      (_url, init) => {
        if (init?.method === "PUT") {
          return Response.json({ message: "Not found" }, { status: 404 });
        }
        return Response.json({ message: "Create failed" }, { status: 500 });
      },
      async (calls) => {
        const res = await syncNewsletterIssueToBrevo({
          _id: "issue-404-then-500",
          targetAudience: "en",
          brevoCampaignIdEn: 101,
          titleEn: "404 then 500 test",
        });
        assert.equal(res.ok, false);
        assert.equal(calls.length, 2);
        assert.equal(calls[0]?.method, "PUT");
        assert.equal(calls[1]?.method, "POST");
      },
    );

    await withMockedFetch(
      (url) => {
        if (url.endsWith("/101")) {
          return new Response(null, { status: 204 });
        }
        return Response.json({ message: "ES update failed" }, { status: 500 });
      },
      async () => {
        const res = await syncNewsletterIssueToBrevo({
          _id: "issue-partial-fail",
          targetAudience: "both",
          brevoCampaignIdEn: 101,
          brevoCampaignIdEs: 202,
          titleEn: "EN title",
          titleEs: "ES title",
        });
        assert.equal(res.ok, false);
        assert.equal(res.brevoCampaignIdEn, 101);
        assert.equal(res.brevoCampaignIdEs, 202);
        assert.match(res.error ?? "", /ES:/);
      },
    );

    await withMockedFetch(
      (_url, init) => {
        if (init?.method === "PUT") {
          return Response.json({ message: "Not found" }, { status: 404 });
        }
        return Response.json({ id: 303 }, { status: 201 });
      },
      async () => {
        const res = await syncNewsletterIssueToBrevo({
          _id: "issue-404-recover",
          targetAudience: "en",
          brevoCampaignIdEn: 101,
          titleEn: "Recover via POST",
        });
        assert.equal(res.ok, true);
        assert.equal(res.brevoCampaignIdEn, 303);
      },
    );
  } finally {
    restoreEnv(snap);
  }
});

test("getNewsletterIssueById projects spanishLocation inside selectedStories[]->", async () => {
  const snap = snapshotEnv();
  try {
    setTestEnv({
      SANITY_PROJECT_ID: "testproj",
      SANITY_DATASET: "production",
    });

    await withMockedFetch(
      () =>
        Response.json(
          {
            result: {
              _id: "issue-1",
              titleEs: "Edición 1",
              selectedStories: [
                {
                  slug: "story-1",
                  title: "Story 1",
                  spanishTitle: "Historia 1",
                  location: "India & Spain",
                  spanishLocation: "India y España desde taller",
                },
              ],
            },
          },
          { status: 200 },
        ),
      async (calls) => {
        const issue = await getNewsletterIssueById("issue-1");
        assert.ok(issue);
        assert.equal(
          issue.selectedStories?.[0]?.spanishLocation,
          "India y España desde taller",
        );

        const requestUrl = new URL(calls[0]!.url);
        const query = requestUrl.searchParams.get("query") ?? "";
        assert.match(
          query,
          /"selectedStories":\s*selectedStories\[\]->\{[\s\S]*spanishLocation[\s\S]*\}/,
        );
      },
    );
  } finally {
    restoreEnv(snap);
  }
});

function renderWithLanguage(
  initialLanguage: "en" | "es",
  child: ReactElement,
): string {
  const Provider = LanguageProvider as ComponentType<{
    initialLanguage?: "en" | "es";
    children?: ReactNode;
  }>;
  return renderToStaticMarkup(
    createElement(Provider, { initialLanguage }, child),
  );
}

test("sanitizePortableLinkHref and StoryDetailClient SSR block unsafe Portable Text link schemes while keeping M5 localizeHref", () => {
  assert.equal(
    sanitizePortableLinkHref("https://karmarisedglobal.com/stories?a=1"),
    "https://karmarisedglobal.com/stories?a=1",
  );
  assert.equal(
    sanitizePortableLinkHref("http://example.com/path"),
    "http://example.com/path",
  );
  assert.equal(
    sanitizePortableLinkHref("mailto:hola@karmarisedglobal.com"),
    "mailto:hola@karmarisedglobal.com",
  );
  assert.equal(sanitizePortableLinkHref("/product-brief"), "/product-brief");
  assert.equal(sanitizePortableLinkHref("#section-1"), "#section-1");

  const rejectedInputs = [
    "javascript:alert(1)",
    "JAVASCRIPT:alert(1)",
    "java\tscript:alert(1)",
    "java\nscript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "file:///etc/passwd",
    "blob:https://example.com/123",
    "//evil.example/path",
    "/\\evil.example/path",
    "https:javascript:alert(1)",
    "https://user:pass@example.com",
    "#",
    "#bad fragment",
    "",
    "   ",
    null,
    123,
  ];
  for (const candidate of rejectedInputs) {
    assert.equal(
      sanitizePortableLinkHref(candidate),
      null,
      `Expected rejection for ${String(candidate)}`,
    );
  }

  const baseStory = stories[0]!;
  const otherStory = stories[1] ?? baseStory;
  const storyWithPortableLinks = {
    ...baseStory,
    language: "es" as const,
    spanishSections: [],
    body: [
      {
        _key: "blk-1",
        _type: "block" as const,
        style: "normal" as const,
        markDefs: [
          {
            _key: "safe-https",
            _type: "link" as const,
            href: "https://example.com/doc",
          },
          {
            _key: "safe-mailto",
            _type: "link" as const,
            href: "mailto:hola@karmarisedglobal.com",
          },
          { _key: "safe-rel", _type: "link" as const, href: "/product-brief" },
          { _key: "safe-hash", _type: "link" as const, href: "#top" },
          {
            _key: "bad-js",
            _type: "link" as const,
            href: "javascript:alert(1)",
          },
          {
            _key: "bad-data",
            _type: "link" as const,
            href: "data:text/html,evil",
          },
          {
            _key: "bad-proto-rel",
            _type: "link" as const,
            href: "//evil.example",
          },
        ],
        children: [
          { _key: "s1", text: "Safe HTTPS", marks: ["safe-https"] },
          { _key: "s2", text: "Safe Mailto", marks: ["safe-mailto"] },
          { _key: "s3", text: "Safe Rel", marks: ["safe-rel"] },
          { _key: "s4", text: "Safe Hash", marks: ["safe-hash"] },
          { _key: "s5", text: "Blocked JS", marks: ["bad-js"] },
          { _key: "s6", text: "Blocked Data", marks: ["bad-data"] },
          { _key: "s7", text: "Blocked ProtoRel", marks: ["bad-proto-rel"] },
        ],
      },
    ],
  };

  const html = renderWithLanguage(
    "es",
    createElement(StoryDetailClient, {
      story: storyWithPortableLinks,
      allStories: [storyWithPortableLinks, otherStory],
    }),
  );

  assert.match(
    html,
    /<a href="https:\/\/example\.com\/doc" target="_blank" rel="noopener noreferrer"[^>]*>Safe HTTPS<\/a>/,
  );
  assert.match(
    html,
    /<a href="mailto:hola@karmarisedglobal\.com"[^>]*>Safe Mailto<\/a>/,
  );
  assert.match(html, /<a href="\/product-brief"[^>]*>Safe Rel<\/a>/);
  assert.match(html, /<a href="#top"[^>]*>Safe Hash<\/a>/);

  assert.equal(html.includes("javascript:alert"), false);
  assert.equal(html.includes("data:text/html"), false);
  assert.equal(html.includes('href="//evil.example"'), false);
  assert.match(html, /<span>Blocked JS<\/span>/);
  assert.match(html, /<span>Blocked Data<\/span>/);
  assert.match(html, /<span>Blocked ProtoRel<\/span>/);

  assert.match(html, /href="\/es\/stories"/);
  assert.match(html, /href="\/es\/contact"/);
  assert.match(html, new RegExp(`href="/es/stories/${otherStory.slug}"`));
});

test("M3 ProductBriefPageClient, ProductBriefForm, and ContactForm localize all internal <Link> elements for EN and ES", () => {
  const briefPageEn = renderWithLanguage(
    "en",
    createElement(ProductBriefPageClient),
  );
  const briefPageEs = renderWithLanguage(
    "es",
    createElement(ProductBriefPageClient),
  );

  assert.match(briefPageEn, /href="\/contact"/);
  assert.equal(briefPageEn.includes('href="/es/contact"'), false);
  assert.match(briefPageEs, /href="\/es\/contact"/);

  const briefFormEn = renderWithLanguage("en", createElement(ProductBriefForm));
  const briefFormEs = renderWithLanguage("es", createElement(ProductBriefForm));

  assert.match(briefFormEn, /href="\/terms#confidentiality"/);
  assert.match(briefFormEn, /href="\/privacy-policy"/);
  assert.match(briefFormEs, /href="\/es\/terms#confidentiality"/);
  assert.match(briefFormEs, /href="\/es\/privacy-policy"/);
  assert.match(briefFormEs, /data-endpoint="\/api\/product-brief"/);
  assert.match(briefFormEs, /name="language"/);
  assert.match(briefFormEs, /name="referenceUrl"/);
  assert.match(briefFormEs, /name="attachments"/);
  assert.match(briefFormEs, /name="companyWebsite"/);

  const contactFormEn = renderWithLanguage("en", createElement(ContactForm));
  const contactFormEs = renderWithLanguage("es", createElement(ContactForm));

  assert.match(contactFormEn, /href="\/privacy-policy"/);
  assert.equal(contactFormEn.includes('href="/es/privacy-policy"'), false);
  assert.match(contactFormEs, /href="\/es\/privacy-policy"/);
  assert.match(contactFormEs, /data-endpoint="\/api\/contact"/);
  assert.match(contactFormEs, /name="companyWebsite"/);
});
