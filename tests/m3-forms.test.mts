import assert from "node:assert/strict";
import test from "node:test";

const hooksModuleUrl = new URL("./test-hooks.mts", import.meta.url).href;
const hooksModule = (await import(hooksModuleUrl)) as {
  registerTestModuleHooks: () => void;
};
hooksModule.registerTestModuleHooks();

const { sendResendEmail } = await import("@/lib/resend");
const { resetRateLimitStore } = await import("@/lib/security");
const { POST: contactPost } = await import("@/app/api/contact/route");
const { POST: productBriefPost } =
  await import("@/app/api/product-brief/route");

interface RecordedFetchCall {
  url: string;
  method: string;
  bodyText: string;
  jsonBody: Record<string, unknown> | null;
}

interface EnvSnapshot {
  NODE_ENV?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  CONTACT_TO_EMAIL?: string;
  CONTACT_INQUIRY_EMAIL?: string;
  CONTACT_PARTNERS_EMAIL?: string;
  CONTACT_STORIES_EMAIL?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const TRACKED_ENV_KEYS: ReadonlyArray<keyof EnvSnapshot> = [
  "NODE_ENV",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "CONTACT_TO_EMAIL",
  "CONTACT_INQUIRY_EMAIL",
  "CONTACT_PARTNERS_EMAIL",
  "CONTACT_STORIES_EMAIL",
  "TURNSTILE_SECRET_KEY",
];

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

function setTestEnv(
  overrides: Partial<Record<keyof EnvSnapshot, string>>,
): void {
  const mutableEnv = process.env as Record<string, string | undefined>;
  for (const [key, value] of Object.entries(overrides)) {
    if (value === undefined) {
      delete mutableEnv[key];
    } else {
      mutableEnv[key] = value;
    }
  }
}

function clearOptionalRoutingEnv(): void {
  const mutableEnv = process.env as Record<string, string | undefined>;
  delete mutableEnv.CONTACT_TO_EMAIL;
  delete mutableEnv.CONTACT_INQUIRY_EMAIL;
  delete mutableEnv.CONTACT_PARTNERS_EMAIL;
  delete mutableEnv.CONTACT_STORIES_EMAIL;
  delete mutableEnv.TURNSTILE_SECRET_KEY;
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

function assertCleanVoiceAndCopy(content: string): void {
  assert.equal(content.includes("\u2014"), false, "Must not contain em dash");
  assert.equal(
    /ulhasnagar/i.test(content),
    false,
    "Must not mention Ulhasnagar",
  );
  assert.equal(/\bjournal\b/i.test(content), false, "Must not contain Journal");
  assert.equal(
    /\bworktable\b/i.test(content),
    false,
    "Must not contain worktable",
  );
  assert.equal(/\bchai\b/i.test(content), false, "Must not contain chai");
}

function makeMagicBytes(
  kind: "jpeg" | "png" | "webp" | "pdf",
  size = 32,
): Uint8Array {
  const bytes = new Uint8Array(Math.max(16, size));
  if (kind === "jpeg") {
    bytes.set([0xff, 0xd8, 0xff, 0xe0], 0);
  } else if (kind === "png") {
    bytes.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a], 0);
  } else if (kind === "webp") {
    bytes.set([0x52, 0x49, 0x46, 0x46], 0);
    bytes.set([0x57, 0x45, 0x42, 0x50], 8);
  } else {
    bytes.set([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34], 0);
  }
  return bytes;
}

function makeUploadFile(
  name: string,
  mimeType: string,
  bytes: Uint8Array,
): File {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return new File([buffer], name, { type: mimeType });
}

function buildValidBriefFormData(
  overrides: Record<string, string> = {},
): FormData {
  const formData = new FormData();
  const defaults: Record<string, string> = {
    name: "Lucia Gomez",
    company: "Taller Sol",
    profile: "Fashion brand",
    email: "lucia@tallersol.es",
    language: "Spanish",
    siteLanguage: "es",
    product: "Bags and accessories",
    readiness: "Sketches or early tech pack",
    quantity: "250 units",
    referenceUrl: "https://example.com/lookbook",
    brief: "Vegetable-tanned leather crossbody bags for autumn.",
    companyWebsite: "",
    turnstileToken: "",
  };
  for (const [key, value] of Object.entries({ ...defaults, ...overrides })) {
    formData.append(key, value);
  }
  return formData;
}

test("sendResendEmail rejects unset or onboarding@resend.dev sender in production", async () => {
  const envSnap = snapshotEnv();
  try {
    clearOptionalRoutingEnv();
    setTestEnv({
      NODE_ENV: "production",
      RESEND_API_KEY: "re_test_key",
    });

    await withMockedFetch(
      () => new Response(JSON.stringify({ id: "1" }), { status: 200 }),
      async (calls) => {
        const unsetResult = await sendResendEmail({
          to: "inquiry@karmarisedglobal.com",
          subject: "Prod test",
          text: "Hello",
        });
        assert.equal(unsetResult.ok, false);
        if (!unsetResult.ok) {
          assert.equal(unsetResult.status, 500);
        }

        setTestEnv({
          RESEND_FROM_EMAIL: "KarmaRise <ONBOARDING@RESEND.DEV>",
        });
        const onboardingEnvResult = await sendResendEmail({
          to: "inquiry@karmarisedglobal.com",
          subject: "Prod test",
          text: "Hello",
        });
        assert.equal(onboardingEnvResult.ok, false);
        if (!onboardingEnvResult.ok) {
          assert.equal(onboardingEnvResult.status, 500);
        }

        setTestEnv({
          RESEND_FROM_EMAIL:
            "KarmaRise D Global <noreply@send.karmarisedglobal.com>",
        });
        const explicitOnboardingResult = await sendResendEmail({
          from: "KarmaRise <onboarding@resend.dev>",
          to: "inquiry@karmarisedglobal.com",
          subject: "Prod test",
          text: "Hello",
        });
        assert.equal(explicitOnboardingResult.ok, false);
        if (!explicitOnboardingResult.ok) {
          assert.equal(explicitOnboardingResult.status, 500);
        }

        assert.equal(calls.length, 0);
      },
    );
  } finally {
    restoreEnv(envSnap);
  }
});

test("sendResendEmail sanitizes headers, validates required fields, and formats HTML + attachments", async () => {
  const envSnap = snapshotEnv();
  try {
    clearOptionalRoutingEnv();
    setTestEnv({
      NODE_ENV: "test",
      RESEND_API_KEY: "re_test_key",
    });

    await withMockedFetch(
      () => new Response(JSON.stringify({ id: "email_1" }), { status: 200 }),
      async (calls) => {
        const emptyTo = await sendResendEmail({
          to: "",
          subject: "Hi",
          text: "Body",
        });
        assert.equal(emptyTo.ok, false);
        if (!emptyTo.ok) {
          assert.equal(emptyTo.status, 400);
        }

        const emptySubject = await sendResendEmail({
          to: "user@example.com",
          subject: " \r\n ",
          text: "Body",
        });
        assert.equal(emptySubject.ok, false);
        if (!emptySubject.ok) {
          assert.equal(emptySubject.status, 400);
        }

        const emptyText = await sendResendEmail({
          to: "user@example.com",
          subject: "Subject",
          text: "   ",
        });
        assert.equal(emptyText.ok, false);
        if (!emptyText.ok) {
          assert.equal(emptyText.status, 400);
        }

        const sent = await sendResendEmail({
          to: ["a@example.com\r\nBcc:evil@example.com", "b@example.com"],
          replyTo: "reply@example.com\r\nX-Test:1",
          subject: "Hello\r\nWorld",
          text: "Plain body",
          html: "<p>HTML body</p>",
          attachments: [
            {
              filename: "sketch\r\n.png",
              content: "AQID",
              contentType: "image/png\r\n",
            },
          ],
        });
        assert.equal(sent.ok, true);
        assert.equal(calls.length, 1);

        const body = calls[0]?.jsonBody;
        assert.ok(body);
        assert.equal(body.from, "KarmaRise D Global <onboarding@resend.dev>");
        assert.deepEqual(body.to, [
          "a@example.com Bcc:evil@example.com",
          "b@example.com",
        ]);
        assert.equal(body.reply_to, "reply@example.com X-Test:1");
        assert.equal(body.subject, "Hello World");
        assert.equal(body.html, "<p>HTML body</p>");
        assert.deepEqual(body.attachments, [
          {
            filename: "sketch .png",
            content: "AQID",
            content_type: "image/png",
          },
        ]);
      },
    );
  } finally {
    restoreEnv(envSnap);
  }
});

test("POST /api/contact routes by strict topic allowlist and honors env overrides", async () => {
  const envSnap = snapshotEnv();
  resetRateLimitStore();
  try {
    clearOptionalRoutingEnv();
    setTestEnv({
      NODE_ENV: "production",
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM_EMAIL:
        "KarmaRise D Global <noreply@send.karmarisedglobal.com>",
    });

    const cases: Array<{ topic: string; expectedTo: string }> = [
      {
        topic: "Manufacturing Partner introduction",
        expectedTo: "partners@karmarisedglobal.com",
      },
      {
        topic: "Stories and editorial",
        expectedTo: "stories@karmarisedglobal.com",
      },
      { topic: "AlmaRise D Brand", expectedTo: "stories@karmarisedglobal.com" },
      { topic: "General enquiry", expectedTo: "inquiry@karmarisedglobal.com" },
      {
        topic: "Women's Training Initiative",
        expectedTo: "inquiry@karmarisedglobal.com",
      },
    ];

    for (const item of cases) {
      resetRateLimitStore();
      await withMockedFetch(
        () => new Response(JSON.stringify({ id: "ok" }), { status: 200 }),
        async (calls) => {
          const req = new Request("https://karmarisedglobal.com/api/contact", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "203.0.113.10",
            },
            body: JSON.stringify({
              name: "Marta Ruiz",
              email: "marta@example.es",
              topic: item.topic,
              note: "Hello team",
              language: "en",
            }),
          });
          const res = await contactPost(req);
          assert.equal(res.status, 200);
          assert.equal(calls.length, 2);
          assert.deepEqual(calls[0]?.jsonBody?.to, [item.expectedTo]);
          assert.deepEqual(calls[1]?.jsonBody?.to, ["marta@example.es"]);
          assert.equal(calls[1]?.jsonBody?.reply_to, item.expectedTo);
        },
      );
    }

    // Verify env overrides & rejection of unknown/prototype topics
    resetRateLimitStore();
    setTestEnv({
      CONTACT_PARTNERS_EMAIL: "custom-partners@karmarisedglobal.com",
      CONTACT_STORIES_EMAIL: "custom-stories@karmarisedglobal.com",
      CONTACT_INQUIRY_EMAIL: "custom-inquiry@karmarisedglobal.com",
    });

    await withMockedFetch(
      () => new Response(JSON.stringify({ id: "ok" }), { status: 200 }),
      async (calls) => {
        for (const badTopic of ["Unknown", "toString", "constructor", ""]) {
          const badReq = new Request(
            "https://karmarisedglobal.com/api/contact",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "cf-connecting-ip": "203.0.113.11",
              },
              body: JSON.stringify({
                name: "Marta Ruiz",
                email: "marta@example.es",
                topic: badTopic,
                note: "Hello team",
              }),
            },
          );
          const badRes = await contactPost(badReq);
          assert.equal(badRes.status, 400);
        }
        assert.equal(calls.length, 0);

        const overrideReq = new Request(
          "https://karmarisedglobal.com/api/contact",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "203.0.113.12",
            },
            body: JSON.stringify({
              name: "Workshop Lead",
              email: "lead@workshop.in",
              topic: "Manufacturing Partner introduction",
              note: "Sample workshop profile.",
              language: "es",
            }),
          },
        );
        const overrideRes = await contactPost(overrideReq);
        assert.equal(overrideRes.status, 200);
        assert.equal(calls.length, 2);
        assert.deepEqual(calls[0]?.jsonBody?.to, [
          "custom-partners@karmarisedglobal.com",
        ]);
        assert.equal(
          calls[1]?.jsonBody?.reply_to,
          "custom-partners@karmarisedglobal.com",
        );
      },
    );
  } finally {
    resetRateLimitStore();
    restoreEnv(envSnap);
  }
});

test("POST /api/contact sends clean EN/ES confirmation emails, escapes HTML, and handles failures safely", async () => {
  const envSnap = snapshotEnv();
  resetRateLimitStore();
  try {
    clearOptionalRoutingEnv();
    setTestEnv({
      NODE_ENV: "production",
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM_EMAIL:
        "KarmaRise D Global <noreply@send.karmarisedglobal.com>",
    });

    await withMockedFetch(
      () => new Response(JSON.stringify({ id: "ok" }), { status: 200 }),
      async (calls) => {
        const esReq = new Request("https://karmarisedglobal.com/api/contact", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "cf-connecting-ip": "203.0.113.20",
          },
          body: JSON.stringify({
            name: 'Elena <script>alert("x")</script> & Co',
            email: "elena@example.es",
            topic: "General enquiry",
            note: "Queremos <fabricar> bolsos & carteras.",
            language: "es",
          }),
        });
        const esRes = await contactPost(esReq);
        assert.equal(esRes.status, 200);
        const esJson = (await esRes.json()) as {
          ok: boolean;
          confirmationSent?: boolean;
        };
        assert.equal(esJson.ok, true);
        assert.equal(esJson.confirmationSent, true);
        assert.equal(calls.length, 2);

        const internalHtml = String(calls[0]?.jsonBody?.html ?? "");
        const confirmSubject = String(calls[1]?.jsonBody?.subject ?? "");
        const confirmText = String(calls[1]?.jsonBody?.text ?? "");
        const confirmHtml = String(calls[1]?.jsonBody?.html ?? "");

        assert.equal(internalHtml.includes("<script>"), false);
        assert.equal(internalHtml.includes("&lt;script&gt;"), true);
        assert.equal(confirmHtml.includes("<script>"), false);
        assert.equal(confirmHtml.includes("&lt;script&gt;"), true);
        assert.equal(confirmHtml.includes("&lt;fabricar&gt;"), true);
        assert.match(confirmSubject, /Hemos recibido tu mensaje/i);
        assert.match(confirmText, /\bte responderán\b/i);
        assertCleanVoiceAndCopy(confirmSubject);
        assertCleanVoiceAndCopy(confirmText);
        assertCleanVoiceAndCopy(confirmHtml);

        // Verify EN confirmation copy as well
        const enReq = new Request("https://karmarisedglobal.com/api/contact", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "cf-connecting-ip": "203.0.113.23",
          },
          body: JSON.stringify({
            name: "Claire",
            email: "claire@example.co.uk",
            topic: "Stories and editorial",
            note: "Following up on your latest Story.",
            language: "en",
          }),
        });
        const enRes = await contactPost(enReq);
        assert.equal(enRes.status, 200);
        assert.equal(calls.length, 4);
        const enSubject = String(calls[3]?.jsonBody?.subject ?? "");
        const enText = String(calls[3]?.jsonBody?.text ?? "");
        const enHtml = String(calls[3]?.jsonBody?.html ?? "");
        assert.match(enSubject, /We received your message/i);
        assert.match(enText, /Alma or Shirish will review/i);
        assertCleanVoiceAndCopy(enSubject);
        assertCleanVoiceAndCopy(enText);
        assertCleanVoiceAndCopy(enHtml);
      },
    );

    // Confirmation failure after internal success returns 200 confirmationSent: false
    resetRateLimitStore();
    await withMockedFetch(
      (_url, _init, idx) => {
        if (idx === 0) {
          return new Response(JSON.stringify({ id: "internal" }), {
            status: 200,
          });
        }
        return new Response("Resend error", { status: 500 });
      },
      async () => {
        const req = new Request("https://karmarisedglobal.com/api/contact", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "cf-connecting-ip": "203.0.113.21",
          },
          body: JSON.stringify({
            name: "Elena",
            email: "elena@example.es",
            topic: "General enquiry",
            note: "Details",
            language: "en",
          }),
        });
        const res = await contactPost(req);
        assert.equal(res.status, 200);
        const json = (await res.json()) as {
          ok: boolean;
          confirmationSent?: boolean;
        };
        assert.equal(json.ok, true);
        assert.equal(json.confirmationSent, false);
      },
    );

    // Internal failure returns 502 and does not dispatch confirmation
    resetRateLimitStore();
    await withMockedFetch(
      () => new Response("Fail", { status: 500 }),
      async (calls) => {
        const req = new Request("https://karmarisedglobal.com/api/contact", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "cf-connecting-ip": "203.0.113.22",
          },
          body: JSON.stringify({
            name: "Elena",
            email: "elena@example.es",
            topic: "General enquiry",
            note: "Details",
            language: "en",
          }),
        });
        const res = await contactPost(req);
        assert.equal(res.status, 502);
        assert.equal(calls.length, 1);
      },
    );
  } finally {
    resetRateLimitStore();
    restoreEnv(envSnap);
  }
});

test("POST /api/contact enforces honeypot, rate limits, Turnstile, and body bounds", async () => {
  const envSnap = snapshotEnv();
  resetRateLimitStore();
  try {
    clearOptionalRoutingEnv();
    setTestEnv({
      NODE_ENV: "production",
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM_EMAIL:
        "KarmaRise D Global <noreply@send.karmarisedglobal.com>",
      TURNSTILE_SECRET_KEY: "turnstile_secret",
    });

    await withMockedFetch(
      (url, init) => {
        if (url.includes("turnstile")) {
          const body = String(init?.body ?? "");
          const ok = body.includes("response=valid-token");
          return new Response(JSON.stringify({ success: ok }), { status: 200 });
        }
        return new Response(JSON.stringify({ id: "ok" }), { status: 200 });
      },
      async (calls) => {
        // Honeypot returns 200 with zero fetch calls
        const hpReq = new Request("https://karmarisedglobal.com/api/contact", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "cf-connecting-ip": "203.0.113.30",
          },
          body: JSON.stringify({
            name: "Bot",
            email: "bot@example.com",
            topic: "General enquiry",
            note: "Spam",
            companyWebsite: "https://spam.example",
          }),
        });
        const hpRes = await contactPost(hpReq);
        assert.equal(hpRes.status, 200);
        assert.equal(calls.length, 0);

        // Oversized JSON (>32 KB) returns 413
        const bigReq = new Request("https://karmarisedglobal.com/api/contact", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "cf-connecting-ip": "203.0.113.31",
          },
          body: JSON.stringify({
            name: "Alice",
            email: "alice@example.com",
            topic: "General enquiry",
            note: "a".repeat(34 * 1024),
          }),
        });
        const bigRes = await contactPost(bigReq);
        assert.equal(bigRes.status, 413);

        // Missing Turnstile token returns 400
        const missingTsReq = new Request(
          "https://karmarisedglobal.com/api/contact",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "203.0.113.32",
            },
            body: JSON.stringify({
              name: "Alice",
              email: "alice@example.com",
              topic: "General enquiry",
              note: "Hello",
            }),
          },
        );
        const missingTsRes = await contactPost(missingTsReq);
        assert.equal(missingTsRes.status, 400);

        // Invalid Turnstile token returns 403
        const badTsReq = new Request(
          "https://karmarisedglobal.com/api/contact",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "203.0.113.33",
            },
            body: JSON.stringify({
              name: "Alice",
              email: "alice@example.com",
              topic: "General enquiry",
              note: "Hello",
              turnstileToken: "bad-token",
            }),
          },
        );
        const badTsRes = await contactPost(badTsReq);
        assert.equal(badTsRes.status, 403);

        // Rate limit: 10 requests pass/consume, 11th returns 429
        for (let i = 0; i < 10; i += 1) {
          const okReq = new Request(
            "https://karmarisedglobal.com/api/contact",
            {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "cf-connecting-ip": "203.0.113.34",
              },
              body: JSON.stringify({
                name: "Alice",
                email: "alice@example.com",
                topic: "General enquiry",
                note: "Hello",
                turnstileToken: "valid-token",
              }),
            },
          );
          const res = await contactPost(okReq);
          assert.equal(res.status, 200);
        }
        const limitedReq = new Request(
          "https://karmarisedglobal.com/api/contact",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "203.0.113.34",
            },
            body: JSON.stringify({
              name: "Alice",
              email: "alice@example.com",
              topic: "General enquiry",
              note: "Hello",
              turnstileToken: "valid-token",
            }),
          },
        );
        const limitedRes = await contactPost(limitedReq);
        assert.equal(limitedRes.status, 429);
      },
    );
  } finally {
    resetRateLimitStore();
    restoreEnv(envSnap);
  }
});

test("POST /api/product-brief handles JSON + multipart attachments, referenceUrl, and EN/ES confirmations", async () => {
  const envSnap = snapshotEnv();
  resetRateLimitStore();
  try {
    clearOptionalRoutingEnv();
    setTestEnv({
      NODE_ENV: "production",
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM_EMAIL:
        "KarmaRise D Global <noreply@send.karmarisedglobal.com>",
      CONTACT_INQUIRY_EMAIL: "briefs@karmarisedglobal.com",
    });

    await withMockedFetch(
      () => new Response(JSON.stringify({ id: "ok" }), { status: 200 }),
      async (calls) => {
        // 1. JSON mode in English
        const jsonReq = new Request(
          "https://karmarisedglobal.com/api/product-brief",
          {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "203.0.113.40",
            },
            body: JSON.stringify({
              name: "Claire",
              company: "Maison <Nord>",
              profile: "Fashion brand",
              email: "claire@maisonnord.fr",
              language: "English",
              product: "Bags and accessories",
              readiness: "Physical sample ready",
              referenceUrl: "https://example.com/brief?ref=1&kind=bag",
              brief: "Structured tote in pebbled leather.",
            }),
          },
        );
        const jsonRes = await productBriefPost(jsonReq);
        assert.equal(jsonRes.status, 200);
        assert.equal(calls.length, 2);
        assert.deepEqual(calls[0]?.jsonBody?.to, [
          "briefs@karmarisedglobal.com",
        ]);
        assert.deepEqual(calls[1]?.jsonBody?.to, ["claire@maisonnord.fr"]);
        assert.match(
          String(calls[1]?.jsonBody?.subject ?? ""),
          /We received your Product Brief/i,
        );
        assert.equal(
          String(calls[1]?.jsonBody?.html ?? "").includes(
            "Maison &lt;Nord&gt;",
          ),
          true,
        );
        assertCleanVoiceAndCopy(String(calls[1]?.jsonBody?.text ?? ""));
        assertCleanVoiceAndCopy(String(calls[1]?.jsonBody?.html ?? ""));

        // 2. Multipart mode in Spanish with JPEG, PNG, and PDF attachments
        const fd = buildValidBriefFormData();
        fd.append(
          "attachments",
          makeUploadFile(
            "sketch.jpg",
            "image/jpeg",
            makeMagicBytes("jpeg", 64),
          ),
        );
        fd.append(
          "attachments",
          makeUploadFile("swatch.png", "image/png", makeMagicBytes("png", 64)),
        );
        fd.append(
          "attachments",
          makeUploadFile(
            "techpack.pdf",
            "application/pdf",
            makeMagicBytes("pdf", 64),
          ),
        );

        const mpReq = new Request(
          "https://karmarisedglobal.com/api/product-brief",
          {
            method: "POST",
            headers: {
              "cf-connecting-ip": "203.0.113.41",
            },
            body: fd,
          },
        );
        const mpRes = await productBriefPost(mpReq);
        assert.equal(mpRes.status, 200);
        assert.equal(calls.length, 4);

        const internalAttachments = calls[2]?.jsonBody?.attachments as
          | Array<{ filename: string; content: string; content_type: string }>
          | undefined;
        assert.ok(Array.isArray(internalAttachments));
        assert.equal(internalAttachments.length, 3);
        assert.equal(internalAttachments[0]?.content_type, "image/jpeg");
        assert.equal(internalAttachments[1]?.content_type, "image/png");
        assert.equal(internalAttachments[2]?.content_type, "application/pdf");

        // Confirmation email must NOT echo binary attachments back
        assert.equal(calls[3]?.jsonBody?.attachments, undefined);
        const esConfirmText = String(calls[3]?.jsonBody?.text ?? "");
        const esConfirmHtml = String(calls[3]?.jsonBody?.html ?? "");
        assert.match(
          String(calls[3]?.jsonBody?.subject ?? ""),
          /Hemos recibido tu briefing de producto/i,
        );
        assert.match(esConfirmText, /\bresponderte\b/i);
        assert.match(esConfirmHtml, /te escribirá/i);
        assert.equal(
          /feel free to/i.test(String(calls[1]?.jsonBody?.text ?? "")),
          false,
        );
        assertCleanVoiceAndCopy(esConfirmText);
        assertCleanVoiceAndCopy(esConfirmHtml);
      },
    );
  } finally {
    resetRateLimitStore();
    restoreEnv(envSnap);
  }
});

test("POST /api/product-brief validates WebP, unsafe URLs, upload limits, spoofed files, honeypot, Turnstile, and rate limits", async () => {
  const envSnap = snapshotEnv();
  resetRateLimitStore();
  try {
    clearOptionalRoutingEnv();
    setTestEnv({
      NODE_ENV: "production",
      RESEND_API_KEY: "re_test_key",
      RESEND_FROM_EMAIL:
        "KarmaRise D Global <noreply@send.karmarisedglobal.com>",
      TURNSTILE_SECRET_KEY: "turnstile_secret",
    });

    await withMockedFetch(
      (url, init) => {
        if (url.includes("turnstile")) {
          const body = String(init?.body ?? "");
          const ok = body.includes("response=valid-token");
          return new Response(JSON.stringify({ success: ok }), { status: 200 });
        }
        return new Response(JSON.stringify({ id: "ok" }), { status: 200 });
      },
      async (calls) => {
        // Valid WebP upload passes with Turnstile
        const webpFd = buildValidBriefFormData({
          turnstileToken: "valid-token",
        });
        webpFd.append(
          "attachments",
          makeUploadFile(
            "sample.webp",
            "image/webp",
            makeMagicBytes("webp", 48),
          ),
        );
        const webpRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: { "cf-connecting-ip": "203.0.113.50" },
            body: webpFd,
          }),
        );
        assert.equal(webpRes.status, 200);
        const resendIndex = calls.findIndex((c) => c.url.includes("resend"));
        assert.ok(resendIndex >= 0);

        const resendCallsBefore = calls.filter((c) =>
          c.url.includes("resend"),
        ).length;

        // Unsafe referenceUrl values -> 400
        for (const unsafeUrl of [
          "javascript:alert(1)",
          "ftp://files.example.com/ref",
          "https://user:pass@example.com/ref",
        ]) {
          const badUrlFd = buildValidBriefFormData({
            referenceUrl: unsafeUrl,
            turnstileToken: "valid-token",
          });
          const res = await productBriefPost(
            new Request("https://karmarisedglobal.com/api/product-brief", {
              method: "POST",
              headers: { "cf-connecting-ip": "203.0.113.51" },
              body: badUrlFd,
            }),
          );
          assert.equal(res.status, 400);
        }

        // >3 files -> 400
        const fourFilesFd = buildValidBriefFormData({
          turnstileToken: "valid-token",
        });
        for (let i = 0; i < 4; i += 1) {
          fourFilesFd.append(
            "attachments",
            makeUploadFile(`f${i}.png`, "image/png", makeMagicBytes("png", 32)),
          );
        }
        const fourFilesRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: { "cf-connecting-ip": "203.0.113.52" },
            body: fourFilesFd,
          }),
        );
        assert.equal(fourFilesRes.status, 400);

        // Single file > 4 MB -> 413
        const bigFileFd = buildValidBriefFormData({
          turnstileToken: "valid-token",
        });
        bigFileFd.append(
          "attachments",
          makeUploadFile(
            "huge.png",
            "image/png",
            makeMagicBytes("png", 4 * 1024 * 1024 + 128),
          ),
        );
        const bigFileRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: { "cf-connecting-ip": "203.0.113.53" },
            body: bigFileFd,
          }),
        );
        assert.equal(bigFileRes.status, 413);

        // Total > 10 MB across 3 files (3 x 3.6 MB) -> 413
        const totalOverflowFd = buildValidBriefFormData({
          turnstileToken: "valid-token",
        });
        const eachBytes = makeMagicBytes("png", Math.floor(3.6 * 1024 * 1024));
        for (let i = 0; i < 3; i += 1) {
          totalOverflowFd.append(
            "attachments",
            makeUploadFile(`part${i}.png`, "image/png", eachBytes),
          );
        }
        const totalOverflowRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: { "cf-connecting-ip": "203.0.113.54" },
            body: totalOverflowFd,
          }),
        );
        assert.equal(totalOverflowRes.status, 413);

        // Spoofed PNG magic bytes & disallowed SVG -> 400
        const spoofedFd = buildValidBriefFormData({
          turnstileToken: "valid-token",
        });
        spoofedFd.append(
          "attachments",
          makeUploadFile(
            "fake.png",
            "image/png",
            new TextEncoder().encode("<svg onload=alert(1)></svg>"),
          ),
        );
        const spoofedRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: { "cf-connecting-ip": "203.0.113.55" },
            body: spoofedFd,
          }),
        );
        assert.equal(spoofedRes.status, 400);

        const svgFd = buildValidBriefFormData({
          turnstileToken: "valid-token",
        });
        svgFd.append(
          "attachments",
          makeUploadFile(
            "icon.svg",
            "image/svg+xml",
            new TextEncoder().encode("<svg></svg>"),
          ),
        );
        const svgRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: { "cf-connecting-ip": "203.0.113.56" },
            body: svgFd,
          }),
        );
        assert.equal(svgRes.status, 400);

        // Honeypot on multipart with invalid file returns 200 without Resend or Turnstile calls
        const hpFd = buildValidBriefFormData({
          companyWebsite: "https://bot.example",
        });
        hpFd.append(
          "attachments",
          makeUploadFile(
            "bad.svg",
            "image/svg+xml",
            new TextEncoder().encode("<svg></svg>"),
          ),
        );
        const hpRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: { "cf-connecting-ip": "203.0.113.57" },
            body: hpFd,
          }),
        );
        assert.equal(hpRes.status, 200);

        // Missing & invalid Turnstile -> 400 / 403
        const missingTsRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: { "cf-connecting-ip": "203.0.113.58" },
            body: buildValidBriefFormData({ turnstileToken: "" }),
          }),
        );
        assert.equal(missingTsRes.status, 400);

        const badTsRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: { "cf-connecting-ip": "203.0.113.59" },
            body: buildValidBriefFormData({ turnstileToken: "invalid-token" }),
          }),
        );
        assert.equal(badTsRes.status, 403);

        // Oversized multipart Content-Length (> 11 MB) -> 413
        const oversizedMpRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: {
              "content-type": "multipart/form-data; boundary=----testboundary",
              "content-length": String(12 * 1024 * 1024),
              "cf-connecting-ip": "203.0.113.59",
            },
            body: "invalid",
          }),
        );
        assert.equal(oversizedMpRes.status, 413);

        // Malformed multipart payload -> 400
        const malformedMpRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: {
              "content-type": "multipart/form-data; boundary=----testboundary",
              "cf-connecting-ip": "203.0.113.59",
            },
            body: "not-a-valid-multipart-body",
          }),
        );
        assert.equal(malformedMpRes.status, 400);

        const resendCallsAfter = calls.filter((c) =>
          c.url.includes("resend"),
        ).length;
        assert.equal(resendCallsAfter, resendCallsBefore);

        // Rate limit: 8 allowed, 9th -> 429
        for (let i = 0; i < 8; i += 1) {
          const okRes = await productBriefPost(
            new Request("https://karmarisedglobal.com/api/product-brief", {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "cf-connecting-ip": "203.0.113.60",
              },
              body: JSON.stringify({
                name: "Claire",
                company: "Maison Nord",
                profile: "Fashion brand",
                email: "claire@maisonnord.fr",
                language: "English",
                product: "Bags and accessories",
                readiness: "Physical sample ready",
                brief: "Tote run.",
                turnstileToken: "valid-token",
              }),
            }),
          );
          assert.equal(okRes.status, 200);
        }
        const rateLimitedRes = await productBriefPost(
          new Request("https://karmarisedglobal.com/api/product-brief", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "203.0.113.60",
            },
            body: JSON.stringify({
              name: "Claire",
              company: "Maison Nord",
              profile: "Fashion brand",
              email: "claire@maisonnord.fr",
              language: "English",
              product: "Bags and accessories",
              readiness: "Physical sample ready",
              brief: "Tote run.",
              turnstileToken: "valid-token",
            }),
          }),
        );
        assert.equal(rateLimitedRes.status, 429);
      },
    );
  } finally {
    resetRateLimitStore();
    restoreEnv(envSnap);
  }
});
