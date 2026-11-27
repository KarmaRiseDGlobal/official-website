import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import test from "node:test";

const hooksModuleUrl = new URL("./test-hooks.mts", import.meta.url).href;
const hooksModule = (await import(hooksModuleUrl)) as {
  registerTestModuleHooks: () => void;
};
hooksModule.registerTestModuleHooks();

const { stories, storyCategoryDetails } = await import("@/data/stories");
const {
  fetchSanity,
  getNewsletterIssueById,
  getStories,
  getStoryBySlug,
  normalizeStory,
  resolveCategory,
} = await import("@/lib/sanity");

interface EnvSnapshot {
  NEXT_PUBLIC_SANITY_PROJECT_ID?: string;
  NEXT_PUBLIC_SANITY_DATASET?: string;
  SANITY_PROJECT_ID?: string;
  SANITY_DATASET?: string;
  SANITY_API_KEY?: string;
}

function snapshotSanityEnv(): EnvSnapshot {
  return {
    NEXT_PUBLIC_SANITY_PROJECT_ID: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    NEXT_PUBLIC_SANITY_DATASET: process.env.NEXT_PUBLIC_SANITY_DATASET,
    SANITY_PROJECT_ID: process.env.SANITY_PROJECT_ID,
    SANITY_DATASET: process.env.SANITY_DATASET,
    SANITY_API_KEY: process.env.SANITY_API_KEY,
  };
}

function restoreSanityEnv(snap: EnvSnapshot): void {
  const mutableEnv = process.env as Record<string, string | undefined>;
  for (const [key, value] of Object.entries(snap)) {
    if (value === undefined) {
      delete mutableEnv[key];
    } else {
      mutableEnv[key] = value;
    }
  }
}

test("resolveCategory maps current, legacy, and fallback categories safely", () => {
  assert.equal(resolveCategory("Heritage & Culture"), "Heritage & Culture");
  assert.equal(resolveCategory("KarmaRise Journal"), "Inside KarmaRise");
  assert.equal(resolveCategory("Company progress"), "Inside KarmaRise");
  assert.equal(
    resolveCategory("Working across distance"),
    "India Meets Europe",
  );
  assert.equal(resolveCategory(undefined, "Art & Design"), "Art & Design");
  assert.equal(
    resolveCategory(undefined, "KarmaRise Journal"),
    "Inside KarmaRise",
  );
  assert.equal(resolveCategory("Unknown Category"), "Inside KarmaRise");
});

test("normalizeStory handles Sanity-only bilingual stories, hotspots, and Portable Text blocks", () => {
  const normalized = normalizeStory({
    slug: "custom-sanity-story",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "02",
    publishedAt: "2026-11-18T09:00:00.000Z",
    readingTimeMinutes: 4,
    category: "Inside KarmaRise",
    location: "India & Spain",
    spanishLocation: "India y España",
    title: "Custom Sanity Story",
    spanishTitle: "Historia personalizada en Sanity",
    summary: "Summary from Sanity.",
    spanishSummary: "Resumen desde Sanity.",
    leadImage: {
      url: "https://cdn.sanity.io/images/proj/production/lead.jpg",
      alt: "Studio table",
      spanishAlt: "Mesa del estudio",
      hotspot: { x: 0.25, y: 0.75 },
    },
    body: [
      {
        _key: "h2-0",
        _type: "block",
        style: "h2",
        children: [{ _key: "s1", text: "First heading" }],
      },
      {
        _key: "p-0",
        _type: "block",
        style: "normal",
        children: [{ _key: "s2", text: "First paragraph from Sanity." }],
      },
      {
        _key: "img-0",
        _type: "image",
        url: "https://cdn.sanity.io/images/proj/production/inline.jpg",
        alt: "Inline photo",
        aspectRatio: "4:5",
        hotspot: { x: 0.5, y: 0.2 },
      },
    ],
    spanishSections: [
      {
        _key: "es-0",
        heading: "Primer apartado",
        paragraphs: ["Primer párrafo en español."],
      },
    ],
    takeaway: "Sanity takeaway.",
    spanishTakeaway: "Conclusión en Sanity.",
  });

  assert.ok(normalized);
  assert.equal(normalized.slug, "custom-sanity-story");
  assert.equal(normalized.leadImage?.objectPosition, "25% 75%");
  assert.equal(normalized.spanishLeadAlt, "Mesa del estudio");
  assert.equal(normalized.sections.length, 1);
  assert.equal(normalized.sections[0]?.heading, "First heading");
  assert.equal(normalized.spanishSections?.[0]?.heading, "Primer apartado");
  assert.equal(normalized.body?.length, 3);
  const inlineBlock = normalized.body?.[2];
  assert.equal(inlineBlock?._type, "image");
  if (inlineBlock?._type === "image") {
    assert.equal(inlineBlock.objectPosition, "50% 20%");
    assert.equal(inlineBlock.aspectRatio, "4:5");
  }
});

test("fetchSanity enforces perspective=published, supports server env fallback, and uses no-store for newsletter issues", async () => {
  const envSnap = snapshotSanityEnv();
  const originalFetch = globalThis.fetch;
  const recordedCalls: Array<{
    url: string;
    cache?: RequestCache;
    next?: { revalidate?: number; tags?: string[] };
  }> = [];

  try {
    const mutableEnv = process.env as Record<string, string | undefined>;
    delete mutableEnv.NEXT_PUBLIC_SANITY_PROJECT_ID;
    delete mutableEnv.NEXT_PUBLIC_SANITY_DATASET;
    mutableEnv.SANITY_PROJECT_ID = "proj1234";
    delete mutableEnv.SANITY_DATASET;
    mutableEnv.SANITY_API_KEY = "sk_test";

    globalThis.fetch = (async (
      input: string | URL | Request,
      init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
    ) => {
      recordedCalls.push({
        url: typeof input === "string" ? input : input.toString(),
        cache: init?.cache,
        next: init?.next,
      });
      return new Response(JSON.stringify({ result: { _id: "issue-1" } }), {
        status: 200,
      });
    }) as typeof fetch;

    await fetchSanity('*[_type == "story"]', {});
    await getNewsletterIssueById("newsletter-issue-001");

    assert.equal(recordedCalls.length, 2);
    assert.match(
      recordedCalls[0]!.url,
      /^https:\/\/proj1234\.apicdn\.sanity\.io\/v2025-01-01\/data\/query\/production\?/,
    );
    assert.match(recordedCalls[0]!.url, /perspective=published/);
    assert.deepEqual(recordedCalls[0]!.next, {
      revalidate: 300,
      tags: ["stories"],
    });

    assert.match(
      recordedCalls[1]!.url,
      /^https:\/\/proj1234\.api\.sanity\.io\/v2025-01-01\/data\/query\/production\?/,
    );
    assert.match(recordedCalls[1]!.url, /perspective=published/);
    assert.equal(recordedCalls[1]!.cache, "no-store");
    assert.equal(recordedCalls[1]!.next, undefined);
  } finally {
    globalThis.fetch = originalFetch;
    restoreSanityEnv(envSnap);
  }
});

test("getStories merges Sanity entries with unseeded local fallback stories and getStoryBySlug resolves both", async () => {
  const envSnap = snapshotSanityEnv();
  const originalFetch = globalThis.fetch;

  try {
    const mutableEnv = process.env as Record<string, string | undefined>;
    mutableEnv.NEXT_PUBLIC_SANITY_PROJECT_ID = "proj1234";
    mutableEnv.NEXT_PUBLIC_SANITY_DATASET = "production";

    globalThis.fetch = (async (input: string | URL | Request) => {
      const url = typeof input === "string" ? input : input.toString();
      if (url.includes("%24slug=")) {
        return new Response(
          JSON.stringify({
            result: {
              slug: "brand-new-sanity-story",
              title: "Brand New Sanity Story",
              summary: "Published directly in Sanity Studio.",
              publishedAt: "2026-11-19T08:00:00.000Z",
              category: "Inside KarmaRise",
            },
          }),
          { status: 200 },
        );
      }

      return new Response(
        JSON.stringify({
          result: [
            {
              slug: "brand-new-sanity-story",
              title: "Brand New Sanity Story",
              summary: "Published directly in Sanity Studio.",
              publishedAt: "2026-11-19T08:00:00.000Z",
              category: "Inside KarmaRise",
              featured: false,
            },
          ],
        }),
        { status: 200 },
      );
    }) as typeof fetch;

    const merged = await getStories();
    assert.equal(merged.length, stories.length + 1);
    assert.ok(merged.some((entry) => entry.slug === "brand-new-sanity-story"));
    assert.equal(merged[0]?.featured, true);

    const sanityOnly = await getStoryBySlug("brand-new-sanity-story");
    assert.equal(sanityOnly?.title, "Brand New Sanity Story");
  } finally {
    globalThis.fetch = originalFetch;
    restoreSanityEnv(envSnap);
  }
});

test("buildSeedMutations stays aligned with every Story and Category in src/data/stories.ts", () => {
  const rawJson = execFileSync(
    process.execPath,
    ["scripts/seed-sanity-stories.mjs", "--dry-run", "--json"],
    { encoding: "utf8" },
  );
  const mutations = JSON.parse(rawJson) as Array<{
    createOrReplace: {
      _id: string;
      _type: string;
      title?: string;
      category?: string;
      body?: unknown[];
      spanishSections?: unknown[];
    };
  }>;

  const categoryDocs = mutations.filter(
    (item) => item.createOrReplace._type === "category",
  );
  const storyDocs = mutations.filter(
    (item) => item.createOrReplace._type === "story",
  );

  assert.equal(categoryDocs.length, storyCategoryDetails.length);
  assert.equal(storyDocs.length, stories.length);

  for (const story of stories) {
    const mutation = storyDocs.find(
      (item) => item.createOrReplace._id === `story-${story.slug}`,
    );
    assert.ok(mutation, `Missing Sanity seed mutation for ${story.slug}`);
    assert.equal(mutation.createOrReplace.title, story.title);
    assert.equal(mutation.createOrReplace.category, story.category);
    assert.ok(
      Array.isArray(mutation.createOrReplace.body) &&
        mutation.createOrReplace.body.length > 0,
      `Missing Portable Text body for ${story.slug}`,
    );
    assert.equal(
      mutation.createOrReplace.spanishSections?.length ?? 0,
      story.spanishSections?.length ?? 0,
    );
  }
});
