import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

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
const { newsletterIssueDrafts, toSanityNewsletterIssue } =
  await import("@/data/newsletter-issues");
const { renderNewsletterHtml, syncNewsletterIssueToBrevo } =
  await import("@/lib/brevo-campaigns");
const {
  formatNewsletterInterest,
  getTrackForStory,
  getWelcomeTrackCopy,
  normalizeNewsletterTracks,
} = await import("@/lib/newsletter-tracks");
const { resetRateLimitStore } = await import("@/lib/security");
const { POST: newsletterPost } = await import("@/app/api/newsletter/route");

const TRACKED_ENV_KEYS = [
  "NODE_ENV",
  "BREVO_API_KEY",
  "BREVO_LIST_ID",
  "BREVO_LIST_ID_EN",
  "BREVO_LIST_ID_ES",
  "BREVO_LIST_ID_MANUFACTURING_EN",
  "BREVO_LIST_ID_MANUFACTURING_ES",
  "BREVO_LIST_ID_ALMARISE_EN",
  "BREVO_LIST_ID_ALMARISE_ES",
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
  jsonBody: Record<string, unknown> | null;
}

async function withMockedFetch(
  handler: (
    url: string,
    init: RequestInit | undefined,
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
    calls.push({ url, method: init?.method ?? "GET", jsonBody });
    return handler(url, init);
  };

  try {
    await run(calls);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

test("newsletter track helpers normalize inputs, map Stories, and produce EN/ES welcome copy", () => {
  assert.deepEqual(normalizeNewsletterTracks(["manufacturing"]), [
    "manufacturing",
  ]);
  assert.deepEqual(normalizeNewsletterTracks("almarise, manufacturing"), [
    "manufacturing",
    "almarise",
  ]);
  assert.deepEqual(normalizeNewsletterTracks(["unknown", "both"]), [
    "manufacturing",
    "almarise",
  ]);

  assert.equal(
    formatNewsletterInterest(["manufacturing"]),
    "Manufacturing in India",
  );
  assert.equal(
    formatNewsletterInterest(["almarise"]),
    "AlmaRise D Brand & Culture",
  );
  assert.equal(
    formatNewsletterInterest(["manufacturing", "almarise"]),
    "Manufacturing & AlmaRise D Brand",
  );

  assert.equal(
    getTrackForStory({
      slug: "from-spain-to-a-cutting-table-in-india",
      category: "India Meets Europe",
    }),
    "manufacturing",
  );
  assert.equal(
    getTrackForStory({
      slug: "three-biryanis-on-eid",
      category: "India Meets Europe",
    }),
    "almarise",
  );
  assert.equal(
    getTrackForStory({
      slug: "matching-a-workshop-to-the-product",
      category: "People & Craftsmanship",
    }),
    "manufacturing",
  );
  assert.equal(
    getTrackForStory({
      slug: "giving-maharashtrian-sarees-a-second-life",
      category: "Sustainable Fashion",
    }),
    "almarise",
  );

  const unifiedEs = getWelcomeTrackCopy(["manufacturing"], "ES");
  assert.match(unifiedEs.trackLabel, /Historias de KarmaRise/i);
  assert.match(unifiedEs.trackNote, /Cada dos semanas/i);
});

test("POST /api/newsletter routes Track A and Track B into topic+language Brevo lists and personalizes welcome params", async () => {
  const snap = snapshotEnv();
  resetRateLimitStore();
  try {
    setTestEnv({
      NODE_ENV: "production",
      BREVO_API_KEY: "brevo-key",
      BREVO_LIST_ID: "3",
      BREVO_LIST_ID_EN: "6",
      BREVO_LIST_ID_ES: "7",
      BREVO_LIST_ID_MANUFACTURING_EN: "10",
      BREVO_LIST_ID_MANUFACTURING_ES: "11",
      BREVO_LIST_ID_ALMARISE_EN: "12",
      BREVO_LIST_ID_ALMARISE_ES: "13",
      BREVO_WELCOME_TEMPLATE_ID_EN: "3",
      BREVO_WELCOME_TEMPLATE_ID_ES: "4",
      BREVO_SEND_WELCOME_EMAIL: "true",
      TURNSTILE_SECRET_KEY: undefined,
    });

    await withMockedFetch(
      (url, init) => {
        if (
          url.startsWith("https://api.brevo.com/v3/contacts/") &&
          (init?.method ?? "GET") === "GET"
        ) {
          return Response.json({ message: "Not found" }, { status: 404 });
        }
        if (url === "https://api.brevo.com/v3/contacts") {
          return Response.json({ id: 50 }, { status: 201 });
        }
        if (url === "https://api.brevo.com/v3/smtp/email") {
          return Response.json({ messageId: "<welcome>" }, { status: 201 });
        }
        return new Response("Unexpected fetch", { status: 500 });
      },
      async (calls) => {
        const trackARes = await newsletterPost(
          new Request("https://karmarisedglobal.com/api/newsletter", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "198.51.100.70",
            },
            body: JSON.stringify({
              email: "founder@brand.es",
              language: "ES",
              source: "Manufacturing Programme Page",
              tracks: ["manufacturing"],
            }),
          }),
        );
        assert.equal(trackARes.status, 200);
        const contactCallA = calls.find(
          (call) => call.url === "https://api.brevo.com/v3/contacts",
        );
        const welcomeCallA = calls.find(
          (call) => call.url === "https://api.brevo.com/v3/smtp/email",
        );
        assert.deepEqual(contactCallA?.jsonBody?.listIds, [3, 7, 11]);
        assert.equal(
          (contactCallA?.jsonBody?.attributes as Record<string, string>)
            ?.INTEREST,
          "Manufacturing in India",
        );
        assert.equal(welcomeCallA?.jsonBody?.templateId, 4);
        assert.match(
          String(
            (welcomeCallA?.jsonBody?.params as Record<string, string>)
              ?.TRACK_NOTE,
          ),
          /Cada dos semanas/,
        );

        const beforeB = calls.length;
        const bothEnRes = await newsletterPost(
          new Request("https://karmarisedglobal.com/api/newsletter", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "cf-connecting-ip": "198.51.100.71",
            },
            body: JSON.stringify({
              email: "reader@london.co.uk",
              language: "EN",
              source: "Footer",
              tracks: ["manufacturing", "almarise"],
            }),
          }),
        );
        assert.equal(bothEnRes.status, 200);
        const contactCallB = calls
          .slice(beforeB)
          .find((call) => call.url === "https://api.brevo.com/v3/contacts");
        assert.deepEqual(contactCallB?.jsonBody?.listIds, [3, 6, 10, 12]);
      },
    );
  } finally {
    resetRateLimitStore();
    restoreEnv(snap);
  }
});

test("syncNewsletterIssueToBrevo targets unified EN/ES lists by default, supports track overrides, and sets narrator sender name", async () => {
  const snap = snapshotEnv();
  try {
    setTestEnv({
      BREVO_API_KEY: "brevo-key",
      BREVO_LIST_ID: "3",
      BREVO_LIST_ID_EN: "6",
      BREVO_LIST_ID_ES: "7",
      BREVO_LIST_ID_MANUFACTURING_EN: "10",
      BREVO_LIST_ID_MANUFACTURING_ES: "11",
      BREVO_LIST_ID_ALMARISE_EN: "12",
      BREVO_LIST_ID_ALMARISE_ES: "13",
    });

    let nextId = 800;
    await withMockedFetch(
      () => {
        nextId += 1;
        return Response.json({ id: nextId }, { status: 201 });
      },
      async (calls) => {
        const draft01 = newsletterIssueDrafts[0]!;
        const issue = toSanityNewsletterIssue(draft01);
        const res = await syncNewsletterIssueToBrevo(issue);
        assert.equal(res.ok, true);
        assert.equal(res.brevoCampaignIdEn, 801);
        assert.equal(res.brevoCampaignIdEs, 802);
        assert.equal(calls.length, 2);

        const enBody = calls[0]!.jsonBody as {
          sender?: { name?: string; email?: string };
          recipients?: { listIds?: number[] };
          htmlContent?: string;
        };
        const esBody = calls[1]!.jsonBody as {
          sender?: { name?: string; email?: string };
          recipients?: { listIds?: number[] };
          htmlContent?: string;
        };

        assert.equal(enBody.sender?.name, "Shirish · KarmaRise D Global");
        assert.deepEqual(enBody.recipients?.listIds, [6]);
        assert.equal(esBody.sender?.name, "Shirish · KarmaRise D Global");
        assert.deepEqual(esBody.recipients?.listIds, [7]);
        assert.match(enBody.htmlContent ?? "", /From Shirish/);
        assert.match(esBody.htmlContent ?? "", /Escrito por Shirish/);
        assert.match(
          esBody.htmlContent ?? "",
          /https:\/\/karmarisedglobal\.com\/es\/stories\/matching-a-workshop-to-the-product/,
        );

        // Optional future topic override still routes cleanly to topic lists
        const trackOverrideRes = await syncNewsletterIssueToBrevo({
          ...issue,
          track: "manufacturing",
        });
        assert.equal(trackOverrideRes.ok, true);
        assert.deepEqual(
          (calls[2]!.jsonBody as { recipients?: { listIds?: number[] } })
            .recipients?.listIds,
          [10],
        );
        assert.deepEqual(
          (calls[3]!.jsonBody as { recipients?: { listIds?: number[] } })
            .recipients?.listIds,
          [11],
        );
      },
    );
  } finally {
    restoreEnv(snap);
  }
});

test("all 8 bilingual newsletter drafts pass length, confidentiality, voice, asset, and HTML rendering checks", () => {
  assert.equal(newsletterIssueDrafts.length, 8);
  const validSlugs = new Set(stories.map((story) => story.slug));

  const forbiddenPattern =
    /snoby|ulhasnagar|\u2014|&mdash;|\bjournal\b|\bdiario\b|\bworktable\b|\bchai\b|instagram|tiktok|facebook|linkedin|twitter\.com|\bx\.com\b/i;

  for (const draft of newsletterIssueDrafts) {
    assert.ok(
      validSlugs.has(draft.storySlug),
      `${draft.issueNumber} references unknown story slug: ${draft.storySlug}`,
    );
    assert.ok(
      draft.subjectEn.length <= 50,
      `${draft.issueNumber} EN subject exceeds 50 chars (${draft.subjectEn.length}): ${draft.subjectEn}`,
    );
    assert.ok(
      draft.subjectEs.length <= 50,
      `${draft.issueNumber} ES subject exceeds 50 chars (${draft.subjectEs.length}): ${draft.subjectEs}`,
    );

    const localImagePath = path.join(
      REPO_ROOT,
      "public",
      draft.localHeroImage.replace(/^\/+/, ""),
    );
    assert.equal(
      existsSync(localImagePath),
      true,
      `${draft.issueNumber} hero image missing on disk: ${localImagePath}`,
    );

    const issue = toSanityNewsletterIssue(draft);
    const htmlEn = renderNewsletterHtml(issue, "en");
    const htmlEs = renderNewsletterHtml(issue, "es");

    assert.equal(
      forbiddenPattern.exec(htmlEn),
      null,
      `${draft.issueNumber} EN HTML contained forbidden term`,
    );
    assert.equal(
      forbiddenPattern.exec(htmlEs),
      null,
      `${draft.issueNumber} ES HTML contained forbidden term`,
    );

    assert.match(htmlEn, /KarmaRise Stories/);
    assert.match(htmlEs, /Historias de KarmaRise/);
    assert.match(htmlEn, /P\.S\./);
    assert.match(htmlEs, /P\.D\./);
    assert.match(htmlEn, /\{\{\s*unsubscribe\s*\}\}/);
    assert.match(htmlEs, /\{\{\s*unsubscribe\s*\}\}/);
  }
});
