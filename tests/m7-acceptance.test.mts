import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

import type { NextConfig } from "next";

const hooksModuleUrl = new URL("./test-hooks.mts", import.meta.url).href;
const hooksModule = (await import(hooksModuleUrl)) as {
  registerTestModuleHooks: () => void;
};
hooksModule.registerTestModuleHooks();

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const { stories } = await import("@/data/stories");
const { normalizeStory } = await import("@/lib/sanity");
const { resetRateLimitStore } = await import("@/lib/security");
const { POST: brevoSyncPost } =
  await import("@/app/api/sanity/brevo-sync/route");
const { POST: brevoWebhookPost } =
  await import("@/app/api/brevo/webhook/route");
const { POST: newsletterPost } = await import("@/app/api/newsletter/route");
const { default: nextConfig } = (await import(
  pathToFileURL(path.join(REPO_ROOT, "next.config.ts")).href
)) as { default: NextConfig };

const TRACKED_ENV_KEYS = [
  "NODE_ENV",
  "SANITY_WEBHOOK_SECRET",
  "SANITY_REVALIDATE_SECRET",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_PROJECT_ID",
  "SANITY_DATASET",
  "SANITY_API_KEY",
  "BREVO_API_KEY",
  "BREVO_LIST_ID",
  "BREVO_LIST_ID_EN",
  "BREVO_LIST_ID_ES",
  "BREVO_WEBHOOK_SECRET",
  "BREVO_WELCOME_TEMPLATE_ID_EN",
  "BREVO_WELCOME_TEMPLATE_ID_ES",
  "BREVO_SEND_WELCOME_EMAIL",
  "TURNSTILE_SECRET_KEY",
  "NEXT_PUBLIC_SITE_URL",
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

function setTestEnv(
  overrides: Partial<Record<TrackedEnvKey, string | undefined>>,
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

interface RecordedFetchCall {
  url: string;
  method: string;
  bodyText: string;
  jsonBody: Record<string, unknown> | null;
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

function listFilesRecursively(dirPath: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFilesRecursively(fullPath));
    } else if (entry.isFile()) {
      results.push(fullPath);
    }
  }
  return results;
}

test("R1: Email, newsletter, and Sanity schema files satisfy voice & copy compliance", () => {
  const targetFiles = [
    "scripts/setup-brevo.mjs",
    "src/lib/brevo.ts",
    "src/lib/brevo-campaigns.ts",
    "src/app/api/newsletter/preferences/route.ts",
    "src/sanity/schemaTypes/story.ts",
    "src/sanity/schemaTypes/newsletterIssue.ts",
  ];
  const bilingualFiles = new Set([
    "scripts/setup-brevo.mjs",
    "src/lib/brevo-campaigns.ts",
    "src/app/api/newsletter/preferences/route.ts",
    "src/sanity/schemaTypes/newsletterIssue.ts",
  ]);
  const bannedPattern =
    /ulhasnagar|maharashtra|\bjournal\b|\bdiario\b|\bworktable\b|\bchai\b|\btable\b/i;

  for (const relPath of targetFiles) {
    const content = readFileSync(path.join(REPO_ROOT, relPath), "utf8");
    const withoutAddressAndLayoutTables = content
      .replace(/<address\b[\s\S]*?<\/address>/gi, " ")
      .replace(/<\/?table\b[^>]*>/gi, " ");

    const match = bannedPattern.exec(withoutAddressAndLayoutTables);
    assert.equal(
      match,
      null,
      `${relPath} contained banned R1 term: ${match?.[0] ?? ""}`,
    );
    assert.match(
      content,
      /\bstories\b/i,
      `${relPath} should reference Stories`,
    );
    if (bilingualFiles.has(relPath)) {
      assert.match(
        content,
        /\bhistorias\b/i,
        `${relPath} should reference Historias`,
      );
    }
  }
});

test("R2: normalizeStory prioritizes Sanity fields over existing src/data/stories.ts fallback while preserving omitted field fallbacks", () => {
  const existingFallback = stories.find(
    (entry) => entry.slug === "giving-maharashtrian-sarees-a-second-life",
  );
  assert.ok(existingFallback);

  const overridden = normalizeStory({
    slug: existingFallback.slug,
    title: "Sanity Override Title",
    summary: "Sanity override summary.",
    spanishTitle: "Título sobrescrito desde Sanity",
    spanishSummary: "Resumen sobrescrito desde Sanity.",
    spanishLocation: "Toda la India y España (Sanity)",
    spanishPullQuote: {
      text: "Cita destacada desde Sanity.",
      attribution: "Alma · Sanity",
    },
    spanishSections: [
      {
        _key: "es-override-0",
        heading: "Sección desde Sanity",
        paragraphs: ["Párrafo desde Sanity en español."],
        images: [
          {
            url: "https://cdn.sanity.io/images/proj/prod/es-section.jpg",
            alt: "Alt en español desde Sanity",
            caption: "Pie de foto en español desde Sanity",
          },
        ],
      },
    ],
    spanishTakeaway: "Conclusión en español desde Sanity.",
    leadImage: {
      url: "https://cdn.sanity.io/images/proj/prod/lead-override.jpg",
      alt: "Sanity lead alt",
      spanishAlt: "Alt principal ES desde Sanity",
      caption: "Sanity lead caption",
      spanishCaption: "Pie principal ES desde Sanity",
    },
    pairImages: [
      {
        url: "https://cdn.sanity.io/images/proj/prod/pair-1.jpg",
        alt: "Sanity pair 1 alt",
        spanishAlt: "Alt par 1 ES desde Sanity",
        caption: "Sanity pair 1 caption",
        spanishCaption: "Pie par 1 ES desde Sanity",
      },
      {
        url: "https://cdn.sanity.io/images/proj/prod/pair-2.jpg",
        alt: "Sanity pair 2 alt",
        spanishAlt: "Alt par 2 ES desde Sanity",
        caption: "Sanity pair 2 caption",
        spanishCaption: "Pie par 2 ES desde Sanity",
      },
    ],
    // Explicitly omit optional fields to verify fallback behavior
    issueNumber: undefined,
    publishedAt: undefined,
    readingTimeMinutes: undefined,
    location: undefined,
    tags: undefined,
    spanishTags: undefined,
    pullQuote: undefined,
    sections: undefined,
    seo: undefined,
  });

  assert.ok(overridden);
  assert.equal(overridden.title, "Sanity Override Title");
  assert.equal(overridden.summary, "Sanity override summary.");
  assert.equal(overridden.spanishTitle, "Título sobrescrito desde Sanity");
  assert.equal(overridden.spanishSummary, "Resumen sobrescrito desde Sanity.");
  assert.equal(overridden.spanishLocation, "Toda la India y España (Sanity)");
  assert.deepEqual(overridden.spanishPullQuote, {
    text: "Cita destacada desde Sanity.",
    attribution: "Alma · Sanity",
  });
  assert.equal(overridden.spanishSections?.length, 1);
  assert.equal(
    overridden.spanishSections?.[0]?.heading,
    "Sección desde Sanity",
  );
  assert.equal(
    overridden.spanishSections?.[0]?.images?.[0]?.caption,
    "Pie de foto en español desde Sanity",
  );
  assert.equal(
    overridden.spanishTakeaway,
    "Conclusión en español desde Sanity.",
  );
  assert.equal(overridden.spanishLeadAlt, "Alt principal ES desde Sanity");
  assert.equal(overridden.spanishLeadCaption, "Pie principal ES desde Sanity");
  assert.deepEqual(overridden.spanishPairAlts, [
    "Alt par 1 ES desde Sanity",
    "Alt par 2 ES desde Sanity",
  ]);
  assert.deepEqual(overridden.spanishPairCaptions, [
    "Pie par 1 ES desde Sanity",
    "Pie par 2 ES desde Sanity",
  ]);

  // Omitted fields fall back cleanly to src/data/stories.ts
  assert.equal(overridden.issueNumber, existingFallback.issueNumber);
  assert.equal(overridden.publishedAt, existingFallback.publishedAt);
  assert.equal(
    overridden.readingTimeMinutes,
    existingFallback.readingTimeMinutes,
  );
  assert.equal(overridden.category, existingFallback.category);
  assert.equal(overridden.location, existingFallback.location);
  assert.deepEqual(overridden.tags, existingFallback.tags);
  assert.deepEqual(overridden.spanishTags, existingFallback.spanishTags);
  assert.deepEqual(overridden.pullQuote, existingFallback.pullQuote);
  assert.deepEqual(overridden.sections, existingFallback.sections);
  assert.deepEqual(overridden.seo, existingFallback.seo);

  // Also verify Spanish fields fall back cleanly when omitted/null on an existing story that defines all of them
  const cuttingTableFallback = stories.find(
    (entry) => entry.slug === "from-spain-to-a-cutting-table-in-india",
  );
  assert.ok(cuttingTableFallback);
  const minimalSanityPayload = normalizeStory({
    slug: cuttingTableFallback.slug,
    title: "Sanity Headline Only",
    spanishTitle: undefined,
    spanishSummary: undefined,
    spanishLocation: undefined,
    spanishPullQuote: undefined,
    spanishSections: undefined,
    spanishTakeaway: undefined,
    leadImage: undefined,
    pairImages: undefined,
  });

  assert.ok(minimalSanityPayload);
  assert.equal(minimalSanityPayload.title, "Sanity Headline Only");
  assert.equal(
    minimalSanityPayload.spanishTitle,
    cuttingTableFallback.spanishTitle,
  );
  assert.equal(
    minimalSanityPayload.spanishSummary,
    cuttingTableFallback.spanishSummary,
  );
  assert.equal(
    minimalSanityPayload.spanishLocation,
    cuttingTableFallback.spanishLocation,
  );
  assert.deepEqual(
    minimalSanityPayload.spanishPullQuote,
    cuttingTableFallback.spanishPullQuote,
  );
  assert.deepEqual(
    minimalSanityPayload.spanishSections,
    cuttingTableFallback.spanishSections,
  );
  assert.equal(
    minimalSanityPayload.spanishTakeaway,
    cuttingTableFallback.spanishTakeaway,
  );
  assert.equal(
    minimalSanityPayload.spanishLeadAlt,
    cuttingTableFallback.spanishLeadAlt,
  );
  assert.equal(
    minimalSanityPayload.spanishLeadCaption,
    cuttingTableFallback.spanishLeadCaption,
  );
  assert.deepEqual(
    minimalSanityPayload.spanishPairAlts,
    cuttingTableFallback.spanishPairAlts,
  );
  assert.deepEqual(
    minimalSanityPayload.spanishPairCaptions,
    cuttingTableFallback.spanishPairCaptions,
  );
});

test("R2: src/sanity/schemaTypes/story.ts defines required Spanish schema and caption fields", () => {
  const storySchemaSource = readFileSync(
    path.join(REPO_ROOT, "src/sanity/schemaTypes/story.ts"),
    "utf8",
  );

  for (const fieldName of [
    'name: "spanishSections"',
    'name: "spanishPullQuote"',
    'name: "spanishTakeaway"',
    'name: "spanishCaption"',
    'name: "spanishAlt"',
    'title: isSpanish ? "Caption (Spanish)" : "Caption"',
    "buildSectionMember(true)",
  ]) {
    assert.equal(
      storySchemaSource.includes(fieldName),
      true,
      `story.ts schema missing expected field definition: ${fieldName}`,
    );
  }
});

test("R3: POST /api/sanity/brevo-sync fails closed in production and syncs approved newsletter issues", async () => {
  const snap = snapshotEnv();
  try {
    setTestEnv({
      NODE_ENV: "production",
      SANITY_WEBHOOK_SECRET: undefined,
      SANITY_REVALIDATE_SECRET: undefined,
      NEXT_PUBLIC_SANITY_PROJECT_ID: "proj1234",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      SANITY_API_KEY: "sanity-token",
      BREVO_API_KEY: "brevo-key",
      BREVO_LIST_ID: "10",
      BREVO_LIST_ID_EN: "11",
      BREVO_LIST_ID_ES: "12",
    });

    const missingSecretRes = await brevoSyncPost(
      new Request("https://karmarisedglobal.com/api/sanity/brevo-sync", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _type: "newsletterIssue", _id: "issue-1" }),
      }),
    );
    assert.equal(missingSecretRes.status, 500);

    setTestEnv({ SANITY_WEBHOOK_SECRET: "sync-secret-123" });

    const missingHeaderRes = await brevoSyncPost(
      new Request("https://karmarisedglobal.com/api/sanity/brevo-sync", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ _type: "newsletterIssue", _id: "issue-1" }),
      }),
    );
    assert.equal(missingHeaderRes.status, 401);

    const invalidHeaderRes = await brevoSyncPost(
      new Request("https://karmarisedglobal.com/api/sanity/brevo-sync", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-sanity-secret": "wrong-secret",
        },
        body: JSON.stringify({ _type: "newsletterIssue", _id: "issue-1" }),
      }),
    );
    assert.equal(invalidHeaderRes.status, 401);

    let nextCampaignId = 700;
    await withMockedFetch(
      (url) => {
        if (url.includes("/data/query/")) {
          return Response.json(
            {
              result: {
                _id: "issue-1",
                internalName: "Issue #001",
                issueNumber: "Issue #001",
                status: "approved",
                targetAudience: "both",
                titleEn: "Stories from India & Spain",
                subjectEn: "Issue #001 EN",
                titleEs: "Historias entre España y la India",
                subjectEs: "Edición #001 ES",
              },
            },
            { status: 200 },
          );
        }
        if (url === "https://api.brevo.com/v3/emailCampaigns") {
          nextCampaignId += 1;
          return Response.json({ id: nextCampaignId }, { status: 201 });
        }
        if (url.includes("/data/mutate/")) {
          return Response.json({ transactionId: "tx-1" }, { status: 200 });
        }
        return new Response("Unexpected fetch", { status: 500 });
      },
      async (calls) => {
        // Non-newsletterIssue documents are safely skipped without calling Sanity/Brevo
        const skippedRes = await brevoSyncPost(
          new Request("https://karmarisedglobal.com/api/sanity/brevo-sync", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-sanity-secret": "sync-secret-123",
            },
            body: JSON.stringify({ _type: "story", _id: "story-1" }),
          }),
        );
        assert.equal(skippedRes.status, 200);
        assert.equal((await skippedRes.json()).skipped, true);
        assert.equal(calls.length, 0);

        // Approved newsletterIssue syncs EN & ES drafts and patches Sanity
        const syncedRes = await brevoSyncPost(
          new Request("https://karmarisedglobal.com/api/sanity/brevo-sync", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: "Bearer sync-secret-123",
            },
            body: JSON.stringify({
              _type: "newsletterIssue",
              _id: "issue-1",
            }),
          }),
        );
        assert.equal(syncedRes.status, 200);
        const syncedJson = (await syncedRes.json()) as {
          ok: boolean;
          synced?: boolean;
          brevoCampaignIdEn?: number;
          brevoCampaignIdEs?: number;
        };
        assert.equal(syncedJson.ok, true);
        assert.equal(syncedJson.synced, true);
        assert.equal(syncedJson.brevoCampaignIdEn, 701);
        assert.equal(syncedJson.brevoCampaignIdEs, 702);
        assert.equal(calls.length, 4);
        assert.match(calls[3]!.url, /\/data\/mutate\//);
      },
    );
  } finally {
    restoreEnv(snap);
  }
});

test("R3: POST /api/brevo/webhook fails closed in production and records tracked events in Sanity", async () => {
  const snap = snapshotEnv();
  try {
    setTestEnv({
      NODE_ENV: "production",
      BREVO_WEBHOOK_SECRET: undefined,
      NEXT_PUBLIC_SANITY_PROJECT_ID: "proj1234",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      SANITY_API_KEY: "sanity-token",
    });

    const missingSecretRes = await brevoWebhookPost(
      new Request("https://karmarisedglobal.com/api/brevo/webhook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ event: "opened", camp_id: 701 }),
      }),
    );
    assert.equal(missingSecretRes.status, 500);

    setTestEnv({ BREVO_WEBHOOK_SECRET: "brevo-webhook-secret" });

    const missingHeaderRes = await brevoWebhookPost(
      new Request("https://karmarisedglobal.com/api/brevo/webhook", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ event: "opened", camp_id: 701 }),
      }),
    );
    assert.equal(missingHeaderRes.status, 401);

    const invalidHeaderRes = await brevoWebhookPost(
      new Request("https://karmarisedglobal.com/api/brevo/webhook", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-brevo-secret": "wrong",
        },
        body: JSON.stringify({ event: "opened", camp_id: 701 }),
      }),
    );
    assert.equal(invalidHeaderRes.status, 401);

    await withMockedFetch(
      (url) => {
        if (url.includes("/data/query/")) {
          return Response.json(
            { result: { _id: "newsletter-issue-001" } },
            { status: 200 },
          );
        }
        if (url.includes("/data/mutate/")) {
          return Response.json({ transactionId: "tx-2" }, { status: 200 });
        }
        return new Response("Unexpected fetch", { status: 500 });
      },
      async (calls) => {
        const trackedRes = await brevoWebhookPost(
          new Request("https://karmarisedglobal.com/api/brevo/webhook", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-brevo-secret": "brevo-webhook-secret",
            },
            body: JSON.stringify({ event: "opened", camp_id: 701 }),
          }),
        );
        assert.equal(trackedRes.status, 200);
        assert.deepEqual(await trackedRes.json(), {
          ok: true,
          issueId: "newsletter-issue-001",
          recordedEvent: "opened",
        });
        assert.equal(calls.length, 2);
        const mutateBody = calls[1]!.jsonBody as {
          mutations?: Array<{ patch?: { inc?: Record<string, number> } }>;
        } | null;
        assert.deepEqual(mutateBody?.mutations?.[0]?.patch?.inc, {
          "analytics.openedCount": 1,
        });

        const ignoredRes = await brevoWebhookPost(
          new Request("https://karmarisedglobal.com/api/brevo/webhook", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              authorization: "Bearer brevo-webhook-secret",
            },
            body: JSON.stringify({ event: "deferred", camp_id: 701 }),
          }),
        );
        assert.equal(ignoredRes.status, 200);
        assert.equal((await ignoredRes.json()).ignored, true);
        assert.equal(calls.length, 2);
      },
    );
  } finally {
    restoreEnv(snap);
  }
});

test("R3: POST /api/newsletter enforces honeypot, validation, Turnstile, rate limit, and EN/ES Brevo subscriptions", async () => {
  const snap = snapshotEnv();
  resetRateLimitStore();
  try {
    setTestEnv({
      NODE_ENV: "production",
      BREVO_API_KEY: "brevo-key",
      BREVO_LIST_ID: "10",
      BREVO_LIST_ID_EN: "11",
      BREVO_LIST_ID_ES: "12",
      BREVO_WELCOME_TEMPLATE_ID_EN: "30",
      BREVO_WELCOME_TEMPLATE_ID_ES: "40",
      BREVO_SEND_WELCOME_EMAIL: "true",
      TURNSTILE_SECRET_KEY: "ts-secret",
    });

    await withMockedFetch(
      (url, init) => {
        if (url.includes("turnstile")) {
          const ok = String(init?.body ?? "").includes("response=valid-ts");
          return Response.json({ success: ok }, { status: 200 });
        }
        if (
          url.startsWith("https://api.brevo.com/v3/contacts/") &&
          (init?.method ?? "GET") === "GET"
        ) {
          return Response.json({ message: "Not found" }, { status: 404 });
        }
        if (url === "https://api.brevo.com/v3/contacts") {
          return Response.json({ id: 99 }, { status: 201 });
        }
        if (url === "https://api.brevo.com/v3/smtp/email") {
          return Response.json({ messageId: "<msg-1>" }, { status: 201 });
        }
        return new Response("Unexpected fetch", { status: 500 });
      },
      async (calls) => {
        // 1. Honeypot triggers silent 200 without Brevo or Turnstile calls
        const hpRes = await newsletterPost(
          new Request("https://karmarisedglobal.com/api/newsletter", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "198.51.100.50",
            },
            body: JSON.stringify({
              email: "bot@example.com",
              companyWebsite: "https://spam.example",
            }),
          }),
        );
        assert.equal(hpRes.status, 200);
        assert.deepEqual(await hpRes.json(), { ok: true });
        assert.equal(calls.length, 0);

        // 2. Missing Turnstile returns 400; invalid Turnstile returns 403
        const missingTsRes = await newsletterPost(
          new Request("https://karmarisedglobal.com/api/newsletter", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "198.51.100.51",
            },
            body: JSON.stringify({
              email: "reader@example.com",
              language: "EN",
            }),
          }),
        );
        assert.equal(missingTsRes.status, 400);

        const badTsRes = await newsletterPost(
          new Request("https://karmarisedglobal.com/api/newsletter", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "198.51.100.52",
            },
            body: JSON.stringify({
              email: "reader@example.com",
              language: "EN",
              turnstileToken: "bad-token",
            }),
          }),
        );
        assert.equal(badTsRes.status, 403);

        // 3. Invalid email returns 400
        const badEmailRes = await newsletterPost(
          new Request("https://karmarisedglobal.com/api/newsletter", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "198.51.100.53",
            },
            body: JSON.stringify({
              email: "not-an-email",
              turnstileToken: "valid-ts",
            }),
          }),
        );
        assert.equal(badEmailRes.status, 400);

        // 4. Valid EN subscription
        const callsBeforeEn = calls.length;
        const enRes = await newsletterPost(
          new Request("https://karmarisedglobal.com/api/newsletter", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "198.51.100.54",
            },
            body: JSON.stringify({
              email: "claire@example.co.uk",
              firstName: "Claire",
              language: "en",
              turnstileToken: "valid-ts",
            }),
          }),
        );
        assert.equal(enRes.status, 200);
        assert.deepEqual(await enRes.json(), {
          ok: true,
          language: "EN",
          welcomeSent: true,
        });
        const enCalls = calls.slice(callsBeforeEn);
        const enContactCreate = enCalls.find(
          (call) => call.url === "https://api.brevo.com/v3/contacts",
        );
        const enWelcome = enCalls.find(
          (call) => call.url === "https://api.brevo.com/v3/smtp/email",
        );
        assert.deepEqual(enContactCreate?.jsonBody?.listIds, [10, 11]);
        assert.equal(enWelcome?.jsonBody?.templateId, 30);

        // 5. Valid ES subscription
        const callsBeforeEs = calls.length;
        const esRes = await newsletterPost(
          new Request("https://karmarisedglobal.com/api/newsletter", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "198.51.100.55",
            },
            body: JSON.stringify({
              email: "lucia@example.es",
              firstName: "Lucia",
              language: "es",
              turnstileToken: "valid-ts",
            }),
          }),
        );
        assert.equal(esRes.status, 200);
        assert.deepEqual(await esRes.json(), {
          ok: true,
          language: "ES",
          welcomeSent: true,
        });
        const esCalls = calls.slice(callsBeforeEs);
        const esContactCreate = esCalls.find(
          (call) => call.url === "https://api.brevo.com/v3/contacts",
        );
        const esWelcome = esCalls.find(
          (call) => call.url === "https://api.brevo.com/v3/smtp/email",
        );
        assert.deepEqual(esContactCreate?.jsonBody?.listIds, [10, 12]);
        assert.equal(esWelcome?.jsonBody?.templateId, 40);

        // 6. Rate limit: 10 requests succeed, 11th returns 429
        for (let i = 0; i < 10; i += 1) {
          const okRes = await newsletterPost(
            new Request("https://karmarisedglobal.com/api/newsletter", {
              method: "POST",
              headers: {
                "content-type": "application/json",
                "cf-connecting-ip": "198.51.100.56",
              },
              body: JSON.stringify({
                email: "spamcheck@example.com",
                language: "EN",
                turnstileToken: "valid-ts",
              }),
            }),
          );
          assert.equal(okRes.status, 200);
        }
        const limitedRes = await newsletterPost(
          new Request("https://karmarisedglobal.com/api/newsletter", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "198.51.100.56",
            },
            body: JSON.stringify({
              email: "spamcheck@example.com",
              language: "EN",
              turnstileToken: "valid-ts",
            }),
          }),
        );
        assert.equal(limitedRes.status, 429);
      },
    );
  } finally {
    resetRateLimitStore();
    restoreEnv(snap);
  }
});

test("R3: next.config.ts configures required security headers and API no-store cache control", async () => {
  assert.equal(typeof nextConfig.headers, "function");
  const headerRules = await nextConfig.headers!();

  const rootRule = headerRules.find((rule) => rule.source === "/(.*)");
  assert.ok(rootRule, "Missing /(.*) security header rule");
  const rootHeaderMap = new Map(
    rootRule.headers.map((header) => [header.key, header.value]),
  );

  assert.ok(rootHeaderMap.get("Content-Security-Policy"));
  assert.equal(rootHeaderMap.get("X-Content-Type-Options"), "nosniff");
  assert.equal(rootHeaderMap.get("X-Frame-Options"), "DENY");
  assert.equal(
    rootHeaderMap.get("Referrer-Policy"),
    "strict-origin-when-cross-origin",
  );
  assert.equal(
    rootHeaderMap.get("Permissions-Policy"),
    "camera=(), microphone=(), geolocation=()",
  );

  const apiRule = headerRules.find((rule) => rule.source === "/api/:path*");
  assert.ok(apiRule, "Missing /api/:path* header rule");
  const apiHeaderMap = new Map(
    apiRule.headers.map((header) => [header.key, header.value]),
  );
  assert.equal(apiHeaderMap.get("Cache-Control"), "no-store, max-age=0");
});

test("R4: Every Spanish route exports localized metadata and src/ contains zero social media links", () => {
  const esRoot = path.join(REPO_ROOT, "src/app/(es)/es");
  const esPages = listFilesRecursively(esRoot).filter((file) =>
    file.endsWith(`${path.sep}page.tsx`),
  );
  assert.ok(
    esPages.length >= 14,
    `Expected >=14 ES pages, got ${esPages.length}`,
  );

  for (const pagePath of esPages) {
    const content = readFileSync(pagePath, "utf8");
    const hasStaticMeta =
      /export const metadata\b/.test(content) &&
      /getRouteMetadata\([\s\S]*?,\s*"es",?\s*\)/.test(content);
    const hasDynamicMeta =
      /export async function generateMetadata\b/.test(content) &&
      /getStoryMetadata\([\s\S]*?,\s*"es",?\s*\)/.test(content);
    assert.equal(
      hasStaticMeta || hasDynamicMeta,
      true,
      `${path.relative(REPO_ROOT, pagePath)} must export Spanish metadata via getRouteMetadata/getStoryMetadata`,
    );
  }

  const socialPattern =
    /instagram|tiktok|facebook|linkedin|twitter\.com|\bx\.com\b/i;
  const srcFiles = listFilesRecursively(path.join(REPO_ROOT, "src"));
  for (const srcFile of srcFiles) {
    if (!/\.(ts|tsx|mts|mjs|js|jsx|css)$/i.test(srcFile)) {
      continue;
    }
    const content = readFileSync(srcFile, "utf8");
    const match = socialPattern.exec(content);
    assert.equal(
      match,
      null,
      `${path.relative(REPO_ROOT, srcFile)} contains disallowed social media reference: ${match?.[0] ?? ""}`,
    );
  }
});

test("R5: Dead components are deleted with zero imports, eslint ignores .agents/**, and docs reflect current stack", () => {
  const deletedComponents = [
    "src/components/manufacturing-programme.tsx",
    "src/components/working-across-distance.tsx",
  ];
  for (const relPath of deletedComponents) {
    assert.equal(
      existsSync(path.join(REPO_ROOT, relPath)),
      false,
      `Deleted dead component must not exist: ${relPath}`,
    );
  }

  const srcFiles = listFilesRecursively(path.join(REPO_ROOT, "src"));
  const deadImportPattern =
    /components\/(?:manufacturing-programme|working-across-distance)/;
  for (const srcFile of srcFiles) {
    if (!/\.(ts|tsx|mts|mjs|js|jsx)$/i.test(srcFile)) {
      continue;
    }
    const content = readFileSync(srcFile, "utf8");
    assert.equal(
      deadImportPattern.test(content),
      false,
      `${path.relative(REPO_ROOT, srcFile)} still imports a deleted dead component`,
    );
  }

  const eslintConfigSource = readFileSync(
    path.join(REPO_ROOT, "eslint.config.mjs"),
    "utf8",
  );
  assert.match(
    eslintConfigSource,
    /globalIgnores\([\s\S]*["']\.agents\/\*\*["']/,
  );

  for (const docFile of ["README.md", "AGENTS.md"]) {
    const content = readFileSync(path.join(REPO_ROOT, docFile), "utf8");
    assert.match(content, /Sanity/i, `${docFile} must document Sanity`);
    assert.match(content, /Brevo/i, `${docFile} must document Brevo`);
    assert.match(
      content,
      /\/es\b/,
      `${docFile} must document /es localization`,
    );
    assert.match(
      content,
      /Cloudflare Workers/i,
      `${docFile} must document Cloudflare Workers`,
    );
    assert.match(
      content,
      /wrangler\.jsonc/,
      `${docFile} must document wrangler.jsonc`,
    );
  }
});
