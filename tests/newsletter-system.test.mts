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

/**
 * Blocks AI-generated founder/scene images and photos displaying third-party client
 * branding from being used in automated emails or biweekly newsletters.
 */
const DISALLOWED_EMAIL_IMAGE_PATHS = new Set([
  "/images/founders/alma-and-shirish-founders.jpg",
  "/images/workshops/shirish-leather-strap-workshop-india.jpg",
  "/images/capabilities/textile-home-decor.jpg",
  "/images/workshops/alma-studio-team-dust-bags-india.jpeg",
  "/images/workshops/export-pallet-delivery-spain.jpeg",
  "/images/workshops/cognac-leather-backpack-workshop-sample.jpg",
  "/images/workshops/black-leather-bags-brass-hardware-batch.jpg",
  "/images/workshops/black-leather-bag-panels-stack-workshop.jpg",
  "/images/workshops/striped-cotton-bag-linings-leather-straps.jpg",
]);

const { stories } = await import("@/data/stories");
const { ALLOWED_SOCIAL_URLS } = await import("@/data/socials");
const { automatedEmailTemplates } = await import("@/data/email-sequences");
const { newsletterIssueDrafts, toSanityNewsletterIssue } =
  await import("@/data/newsletter-issues");
const { updateBrevoSubscriberLanguage } = await import("@/lib/brevo");
const { renderNewsletterHtml, syncNewsletterIssueToBrevo } =
  await import("@/lib/brevo-campaigns");
const { renderAutomatedSequenceEmail } = await import("@/lib/brevo-sequences");
const {
  appendEmailUtm,
  computeCampaignMetrics,
  reconcileLanguageSegments,
  sanitizeSessionAttribution,
} = await import("@/lib/email-analytics");
const {
  formatNewsletterInterest,
  getTrackForStory,
  getWelcomeTrackCopy,
  normalizeNewsletterTracks,
} = await import("@/lib/newsletter-tracks");
const { resetRateLimitStore } = await import("@/lib/security");
const { POST: newsletterPost } = await import("@/app/api/newsletter/route");
const { POST: brevoWebhookPost } =
  await import("@/app/api/brevo/webhook/route");

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
  "BREVO_WEBHOOK_SECRET",
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_KEY",
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

const ALLOWED_SOCIAL_URL_SET = new Set(ALLOWED_SOCIAL_URLS);

const FORBIDDEN_EMAIL_COPY_PATTERN =
  /snoby|ulhasnagar|\u2014|&mdash;|&#8212;|\bjournal\b|\bdiario\b|\bworktable\b|\bchai\b|tiktok|facebook|twitter\.com|\bx\.com\b|workshop floor|sales floor|bulk cutting|cortar la producci[oó]n|pedido en serie|espa[nñ]a y europa|feel free to|\bdelve\b|\btapestry\b|\bpivotal\b|\bvibrant\b|\belevate\b|\bseamless\b|unlock the power|take it to the next level|hope this email finds you|just checking in/i;

function assertEmailHtmlStandards(
  html: string,
  lang: "en" | "es",
  label: string,
): void {
  const forbidden = FORBIDDEN_EMAIL_COPY_PATTERN.exec(html);
  assert.equal(
    forbidden,
    null,
    `${label} HTML contained forbidden copy: ${forbidden?.[0]}`,
  );

  // Every LinkedIn/Instagram URL must strictly be in ALLOWED_SOCIAL_URLS.
  const socialUrls =
    html.match(/https?:\/\/[^"'\s<>\\]*(?:linkedin|instagram)[^"'\s<>\\]*/gi) ??
    [];
  for (const url of socialUrls) {
    assert.ok(
      ALLOWED_SOCIAL_URL_SET.has(url),
      `${label} contains unapproved social URL: ${url}`,
    );
  }

  // Zero standalone AlmaRise (must always carry D Brand / D Reborn / D Organic / D Home Decor).
  const textWithoutUrls = html
    .replace(/https?:\/\/[^"'\s<>]+/gi, " ")
    .replace(/\/almarise\b/gi, " ");
  const standaloneAlmaRise =
    /AlmaRise(?! D (?:Brand|Reborn|Organic|Home Decor))/i.exec(textWithoutUrls);
  assert.equal(
    standaloneAlmaRise,
    null,
    `${label} contains standalone AlmaRise without D qualifier: ${standaloneAlmaRise?.[0]}`,
  );

  // WCAG-compliant Deep Forest #182D20 primary CTA buttons (zero #BD7057 button fills).
  assert.equal(
    /bgcolor=["']#BD7057["']/i.test(html),
    false,
    `${label} must not use terracotta #BD7057 CTA button fill (use Deep Forest #182D20)`,
  );
  assert.equal(
    /border-radius:999px;[^"]*background-color:#BD7057/i.test(html),
    false,
    `${label} must not style pill CTA buttons with #BD7057 background`,
  );
  if (/border-radius:999px;/.test(html)) {
    assert.match(
      html,
      /bgcolor="#182D20"/i,
      `${label} primary pill CTA must use WCAG-compliant Deep Forest #182D20 fill`,
    );
  }

  // Spanish emails must link header logo to /es; English emails to /.
  if (lang === "es") {
    assert.match(
      html,
      /href="https:\/\/karmarisedglobal\.com\/es"[^>]*>\s*(?:<span[^>]*>\s*)?<img[^>]+main-logo-transparent\.png/i,
      `${label} Spanish email header logo must link to https://karmarisedglobal.com/es`,
    );
  } else {
    assert.match(
      html,
      /href="https:\/\/karmarisedglobal\.com"[^>]*>\s*(?:<span[^>]*>\s*)?<img[^>]+main-logo-transparent\.png/i,
      `${label} English email header logo must link to https://karmarisedglobal.com`,
    );
  }

  // Zero visible image captions.
  assert.equal(
    html.includes("font-size:13.5px;font-style:italic"),
    false,
    `${label} must not render visible italic photo captions`,
  );
  assert.equal(
    /<figcaption\b/i.test(html),
    false,
    `${label} must not render <figcaption>`,
  );
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
  assert.equal(unifiedEs.primaryTrack, "manufacturing");
});

test("POST /api/newsletter routes lists, personalizes welcome params, and tracks Brevo newsletter_subscribed event", async () => {
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
        if (url === "https://api.brevo.com/v3/events") {
          return new Response(null, { status: 204 });
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
              attribution: {
                utmSource: "brevo",
                utmMedium: "email",
                utmCampaign: "welcome-02-es",
                utmContent: "primary-cta",
              },
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
        const eventCallA = calls.find(
          (call) => call.url === "https://api.brevo.com/v3/events",
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
        assert.equal(eventCallA?.jsonBody?.event_name, "newsletter_subscribed");
        const eventProps = eventCallA?.jsonBody?.event_properties as Record<
          string,
          string
        >;
        assert.equal(eventProps?.language, "es");
        assert.equal(eventProps?.primary_track, "manufacturing");
        assert.equal(eventProps?.utm_campaign, "welcome-02-es");
        assert.equal(
          JSON.stringify(eventProps).includes("founder@brand.es"),
          false,
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

test("updateBrevoSubscriberLanguage migrates topic track lists when switching between EN and ES", async () => {
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

    await withMockedFetch(
      (url, init) => {
        if (
          url.startsWith("https://api.brevo.com/v3/contacts/") &&
          (init?.method ?? "GET") === "GET"
        ) {
          return Response.json({ listIds: [3, 6, 10] }, { status: 200 });
        }
        if (url === "https://api.brevo.com/v3/contacts") {
          return new Response(null, { status: 204 });
        }
        return new Response("Unexpected", { status: 500 });
      },
      async (calls) => {
        const ok = await updateBrevoSubscriberLanguage("buyer@shop.es", "ES");
        assert.equal(ok, true);
        const postCall = calls.find((c) => c.method === "POST");
        assert.deepEqual(postCall?.jsonBody?.listIds, [3, 7, 11]);
        assert.deepEqual(postCall?.jsonBody?.unlinkListIds, [6, 10, 12]);
      },
    );
  } finally {
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
          /https:\/\/karmarisedglobal\.com\/es\/stories\/matching-a-workshop-to-the-product\?utm_source=brevo&amp;utm_medium=email&amp;utm_campaign=issue-01-es/,
        );

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

test("all 16 bilingual newsletter drafts pass length, voice, anti-slop, UTM, asset, and HTML rendering checks", () => {
  assert.equal(newsletterIssueDrafts.length, 16);
  const validSlugs = new Set(stories.map((story) => story.slug));

  for (const draft of newsletterIssueDrafts) {
    if (draft.storySlug) {
      assert.ok(
        validSlugs.has(draft.storySlug),
        `${draft.issueNumber} references unknown story slug: ${draft.storySlug}`,
      );
    } else {
      assert.ok(
        draft.ctaPathEn?.startsWith("/") && draft.ctaPathEs?.startsWith("/es"),
        `${draft.issueNumber} without storySlug must define localized ctaPathEn and ctaPathEs`,
      );
    }

    assert.ok(
      draft.subjectEn.length <= 50,
      `${draft.issueNumber} EN subject exceeds 50 chars (${draft.subjectEn.length}): ${draft.subjectEn}`,
    );
    assert.ok(
      draft.subjectEs.length <= 50,
      `${draft.issueNumber} ES subject exceeds 50 chars (${draft.subjectEs.length}): ${draft.subjectEs}`,
    );
    assert.ok(
      draft.previewTextEn.length >= 70 && draft.previewTextEn.length <= 150,
      `${draft.issueNumber} EN preview length out of range (${draft.previewTextEn.length})`,
    );
    assert.ok(
      draft.previewTextEs.length >= 70 && draft.previewTextEs.length <= 150,
      `${draft.issueNumber} ES preview length out of range (${draft.previewTextEs.length})`,
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
    assert.equal(
      DISALLOWED_EMAIL_IMAGE_PATHS.has(draft.localHeroImage),
      false,
      `${draft.issueNumber} must not use AI-generated founder or client-branded imagery: ${draft.localHeroImage}`,
    );

    const issue = toSanityNewsletterIssue(draft);
    const htmlEn = renderNewsletterHtml(issue, "en");
    const htmlEs = renderNewsletterHtml(issue, "es");

    assertEmailHtmlStandards(htmlEn, "en", `${draft.issueNumber} EN`);
    assertEmailHtmlStandards(htmlEs, "es", `${draft.issueNumber} ES`);

    assert.match(htmlEn, /KarmaRise Stories/);
    assert.match(htmlEs, /Historias de KarmaRise/);
    assert.match(htmlEn, /utm_source=brevo&amp;utm_medium=email/);
    assert.match(htmlEs, /utm_source=brevo&amp;utm_medium=email/);
    assert.match(htmlEn, /P\.S\./);
    assert.match(htmlEs, /P\.D\./);
    assert.match(htmlEn, /\{\{\s*unsubscribe\s*\}\}/);
    assert.match(htmlEs, /\{\{\s*unsubscribe\s*\}\}/);
  }
});

test("all 10 automated bilingual sequence templates (20 EN/ES emails) pass voice, anti-slop, greeting, UTM, and asset checks", () => {
  assert.equal(automatedEmailTemplates.length, 10);

  for (const tpl of automatedEmailTemplates) {
    if (tpl.localHeroImage) {
      const imgPath = path.join(
        REPO_ROOT,
        "public",
        tpl.localHeroImage.replace(/^\/+/, ""),
      );
      assert.equal(
        existsSync(imgPath),
        true,
        `${tpl.id} image missing on disk: ${imgPath}`,
      );
      assert.equal(
        DISALLOWED_EMAIL_IMAGE_PATHS.has(tpl.localHeroImage),
        false,
        `${tpl.id} must not use AI-generated founder or client-branded imagery: ${tpl.localHeroImage}`,
      );
    }

    for (const lang of ["en", "es"] as const) {
      const copy = lang === "es" ? tpl.es : tpl.en;
      assert.ok(
        copy.subject.length <= 50,
        `${tpl.id} (${lang}) subject exceeds 50 chars (${copy.subject.length}): ${copy.subject}`,
      );
      assert.ok(
        copy.previewText.length >= 70 && copy.previewText.length <= 150,
        `${tpl.id} (${lang}) preview length out of range (${copy.previewText.length})`,
      );

      const rendered = renderAutomatedSequenceEmail(tpl, lang, {
        previewMode: false,
      });
      assertEmailHtmlStandards(rendered.html, lang, `${tpl.id} (${lang})`);
      assert.equal(
        rendered.html.includes("Hola ,"),
        false,
        `${tpl.id} (${lang}) must not contain blank-name "Hola ," bug`,
      );
      assert.match(rendered.html, /utm_source=brevo&amp;utm_medium=email/);

      if (tpl.footerMode === "marketing") {
        assert.match(rendered.html, /\{\{\s*unsubscribe\s*\}\}/);
      } else {
        assert.equal(rendered.html.includes("{{ unsubscribe }}"), false);
      }
    }
  }
});

test("email analytics helpers enforce UTM conventions, strip PII, respect 7-day closed windows, and reconcile EN/ES segments", () => {
  const tagged = appendEmailUtm(
    "https://karmarisedglobal.com/es/manufacturing#faq",
    {
      source: "brevo",
      campaign: "Issue #15 ES",
      content: "Primary CTA",
    },
  );
  assert.equal(
    tagged,
    "https://karmarisedglobal.com/es/manufacturing?utm_source=brevo&utm_medium=email&utm_campaign=issue-15-es&utm_content=primary-cta#faq",
  );

  const sanitized = sanitizeSessionAttribution({
    utmSource: "Brevo",
    utmMedium: "EMAIL",
    utmCampaign: "welcome_05_es",
    utmContent: "user@secret.com",
    landingPath: "/es/product-brief?foo=bar",
  });
  assert.deepEqual(sanitized, {
    utmSource: "brevo",
    utmMedium: "email",
    utmCampaign: "welcome-05-es",
    landingPath: "/es/product-brief",
  });

  const now = new Date("2026-11-27T12:00:00Z");
  const closedEn = computeCampaignMetrics(
    {
      id: "1",
      label: "[EN] Issue #01",
      language: "en",
      sentAtIso: "2026-11-10T09:30:00Z",
      sent: 100,
      delivered: 100,
      uniqueOpened: 50,
      uniqueClicked: 4,
      bounced: 0,
      unsubscribed: 0,
      spam: 0,
    },
    now,
  );
  const pendingEs = computeCampaignMetrics(
    {
      id: "2",
      label: "[ES] Issue #02",
      language: "es",
      sentAtIso: "2026-11-25T09:30:00Z",
      sent: 100,
      delivered: 98,
      uniqueOpened: 30,
      uniqueClicked: 1,
      bounced: 2,
      unsubscribed: 1,
      spam: 0,
    },
    now,
  );
  const alertEs = computeCampaignMetrics(
    {
      id: "3",
      label: "[ES] Issue #01",
      language: "es",
      sentAtIso: "2026-11-10T09:30:00Z",
      sent: 100,
      delivered: 100,
      uniqueOpened: 40,
      uniqueClicked: 1,
      bounced: 0,
      unsubscribed: 1,
      spam: 0,
    },
    now,
  );

  assert.equal(closedEn.windowStatus, "closed");
  assert.equal(closedEn.alerts.length, 0);
  assert.equal(pendingEs.windowStatus, "pending");
  assert.equal(pendingEs.alerts.length, 0);
  assert.equal(alertEs.windowStatus, "closed");
  assert.equal(alertEs.alerts.length, 2);

  const summary = reconcileLanguageSegments([closedEn, pendingEs, alertEs]);
  assert.equal(summary.reconciled, true);
  assert.equal(summary.es.pendingCampaignCount, 1);
  assert.equal(summary.es.closedCampaignCount, 1);
  assert.equal(summary.combined.closedDelivered, 200);
});

test("POST /api/brevo/webhook separates unique_opened vs raw opened and segments EN vs ES counts in Sanity", async () => {
  const snap = snapshotEnv();
  try {
    setTestEnv({
      BREVO_WEBHOOK_SECRET: "wh-secret-123",
      NEXT_PUBLIC_SANITY_PROJECT_ID: "proj123",
      NEXT_PUBLIC_SANITY_DATASET: "production",
      SANITY_API_KEY: "sanity-token",
    });

    await withMockedFetch(
      (url, init) => {
        if (url.includes("/data/query/")) {
          return Response.json({
            result: {
              _id: "newsletter-issue-a1",
              brevoCampaignIdEn: 501,
              brevoCampaignIdEs: 502,
            },
          });
        }
        if (url.includes("/data/mutate/") && init?.method === "POST") {
          return Response.json({ transactionId: "tx1" });
        }
        return new Response("Unexpected", { status: 500 });
      },
      async (calls) => {
        const uniqueOpenRes = await brevoWebhookPost(
          new Request("https://karmarisedglobal.com/api/brevo/webhook", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-brevo-secret": "wh-secret-123",
            },
            body: JSON.stringify({ event: "unique_opened", camp_id: 502 }),
          }),
        );
        assert.equal(uniqueOpenRes.status, 200);
        const mutateUnique = calls.find((c) => c.url.includes("/data/mutate/"));
        const uniqueInc = (
          mutateUnique?.jsonBody?.mutations as Array<{
            patch?: { inc?: Record<string, number> };
          }>
        )?.[0]?.patch?.inc;
        assert.deepEqual(uniqueInc, {
          "analytics.openedCount": 1,
          "analytics.es.openedCount": 1,
        });

        const rawOpenRes = await brevoWebhookPost(
          new Request("https://karmarisedglobal.com/api/brevo/webhook", {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "x-brevo-secret": "wh-secret-123",
            },
            body: JSON.stringify({ event: "opened", camp_id: 501 }),
          }),
        );
        assert.equal(rawOpenRes.status, 200);
        const mutateCalls = calls.filter((c) =>
          c.url.includes("/data/mutate/"),
        );
        const rawInc = (
          mutateCalls[1]?.jsonBody?.mutations as Array<{
            patch?: { inc?: Record<string, number> };
          }>
        )?.[0]?.patch?.inc;
        assert.deepEqual(rawInc, {
          "analytics.totalOpenedCount": 1,
          "analytics.en.totalOpenedCount": 1,
        });
      },
    );
  } finally {
    restoreEnv(snap);
  }
});

test("re-engagement emails stay warm with zero passive-aggressive removal language, and AI joint founder photo is unused across src and scripts", async () => {
  const { readdirSync, readFileSync } = await import("node:fs");

  const passiveAggressivePattern =
    /(take you off our list|damos de baja de nuestra lista|tidy up our mailing list|limpiar nuestra lista|pause sending you)/i;

  for (const tpl of automatedEmailTemplates) {
    if (tpl.family !== "reengagement") continue;
    for (const lang of ["en", "es"] as const) {
      const rendered = renderAutomatedSequenceEmail(tpl, lang, {
        previewMode: true,
      });
      const hit = passiveAggressivePattern.exec(
        `${rendered.subject} ${rendered.html}`,
      );
      assert.equal(
        hit,
        null,
        `${tpl.id} (${lang}) must not use passive-aggressive removal phrasing: ${hit?.[0]}`,
      );
    }
  }

  function walkCodeFiles(dir: string): string[] {
    const out: string[] = [];
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        out.push(...walkCodeFiles(full));
      } else if (/\.(ts|tsx|mjs)$/.test(entry.name)) {
        out.push(full);
      }
    }
    return out;
  }

  const codeFiles = [
    ...walkCodeFiles(path.join(REPO_ROOT, "src")),
    ...walkCodeFiles(path.join(REPO_ROOT, "scripts")),
  ];
  for (const filePath of codeFiles) {
    const rel = path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
    if (rel === "src/views/story-detail-client.tsx") continue;
    const content = readFileSync(filePath, "utf8");
    assert.equal(
      content.includes("alma-and-shirish-founders.jpg"),
      false,
      `${rel} must not reference AI-generated joint photo alma-and-shirish-founders.jpg`,
    );
  }

  // Company-wide rule: never render visible explanatory captions under images in emails or newsletters.
  for (const draft of newsletterIssueDrafts) {
    assert.equal(
      "heroImageCaptionEn" in draft,
      false,
      `${draft.issueNumber} must not define stripped heroImageCaptionEn field`,
    );
    assert.equal(
      "heroImageCaptionEs" in draft,
      false,
      `${draft.issueNumber} must not define stripped heroImageCaptionEs field`,
    );
    const issue = toSanityNewsletterIssue(draft);
    for (const lang of ["en", "es"] as const) {
      const html = renderNewsletterHtml(issue, lang);
      assert.equal(
        html.includes("font-size:13.5px;font-style:italic"),
        false,
        `${draft.issueNumber} (${lang}) must not render visible image captions`,
      );
      assert.equal(
        /<figcaption\b/i.test(html),
        false,
        `${draft.issueNumber} (${lang}) must not render <figcaption>`,
      );
    }
  }

  for (const tpl of automatedEmailTemplates) {
    for (const lang of ["en", "es"] as const) {
      const rendered = renderAutomatedSequenceEmail(tpl, lang, {
        previewMode: true,
      });
      assert.equal(
        rendered.html.includes("font-size:13.5px;font-style:italic"),
        false,
        `${tpl.id} (${lang}) must not render visible image captions`,
      );
      assert.equal(
        /<figcaption\b/i.test(rendered.html),
        false,
        `${tpl.id} (${lang}) must not render <figcaption>`,
      );
    }
  }

  const setupBrevoSource = readFileSync(
    path.join(REPO_ROOT, "scripts", "setup-brevo.mjs"),
    "utf8",
  );
  assert.equal(
    setupBrevoSource.includes("photoCaption"),
    false,
    "scripts/setup-brevo.mjs must not render visible photo captions",
  );

  const sequencesSource = readFileSync(
    path.join(REPO_ROOT, "src", "data", "email-sequences.ts"),
    "utf8",
  );
  assert.equal(
    /balcony in Mumbai|balcón histórico en Bombay/i.test(sequencesSource),
    false,
    "email-sequences.ts must not label the heritage balcony photo as Mumbai/Bombay",
  );
});
