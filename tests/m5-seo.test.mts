import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import test from "node:test";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const hooksModuleUrl = new URL("./test-hooks.mts", import.meta.url).href;
const hooksModule = (await import(hooksModuleUrl)) as {
  registerTestModuleHooks: () => void;
};
hooksModule.registerTestModuleHooks();

const realSanity = (await import(
  pathToFileURL(path.join(REPO_ROOT, "src/lib/sanity.ts")).href
)) as typeof import("@/lib/sanity");

let mockStoriesOverride: Array<{
  slug: string;
  publishedAt?: string;
}> | null = null;

(globalThis as Record<string, unknown>).__m5SanityGetStories = async () => {
  if (mockStoriesOverride !== null) {
    return mockStoriesOverride;
  }
  return realSanity.getStories();
};

const revalidatedPaths: Array<{ path: string; type?: string }> = [];
const revalidatedTags: Array<{ tag: string; profile?: string }> = [];

(globalThis as Record<string, unknown>).__m5RevalidateRecorder = {
  revalidatePath: (targetPath: string, type?: string) => {
    revalidatedPaths.push({ path: targetPath, type });
  },
  revalidateTag: (tag: string, profile?: string) => {
    revalidatedTags.push({ tag, profile });
  },
};

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "next/cache") {
      return {
        shortCircuit: true,
        url: "data:text/javascript,export function revalidatePath(p,t){globalThis.__m5RevalidateRecorder.revalidatePath(p,t);}export function revalidateTag(t,p){globalThis.__m5RevalidateRecorder.revalidateTag(t,p);}",
      };
    }
    if (specifier === "@/lib/sanity") {
      return {
        shortCircuit: true,
        url: "data:text/javascript,export function getStories(){return globalThis.__m5SanityGetStories();}",
      };
    }
    return nextResolve(specifier, context);
  },
});

const { stories } = await import("@/data/stories");
const {
  STATIC_ROUTES,
  getLayoutMetadata,
  getRouteMetadata,
  getStoryMetadata,
  localizePath,
  siteUrl,
  stripLocalePrefix,
} = await import("@/lib/seo");
const { default: sitemap } = await import("@/app/sitemap");
const { POST: revalidatePost } =
  await import("@/app/api/sanity/revalidate/route");

const SOCIAL_PATTERN =
  /instagram|tiktok|youtube|facebook|linkedin|twitter\.com|x\.com|sameAs/i;
const FORBIDDEN_COPY_PATTERN =
  /\u2014|&mdash;|&#8212;|ulhasnagar|journal|worktable|\bchai\b/i;

test("stripLocalePrefix normalizes EN and ES paths safely", () => {
  assert.equal(stripLocalePrefix("/"), "/");
  assert.equal(stripLocalePrefix(""), "/");
  assert.equal(stripLocalePrefix("/es"), "/");
  assert.equal(stripLocalePrefix("/es/"), "/");
  assert.equal(stripLocalePrefix("/es/about"), "/about");
  assert.equal(
    stripLocalePrefix("/es/stories/three-biryanis-on-eid/"),
    "/stories/three-biryanis-on-eid",
  );
  assert.equal(
    stripLocalePrefix("/es/terms#confidentiality"),
    "/terms#confidentiality",
  );
  assert.equal(stripLocalePrefix("/es-custom"), "/es-custom");
});

test("localizePath prefixes internal routes for ES, strips for EN, and leaves anchors/external/API untouched", () => {
  assert.equal(localizePath("/", "en"), "/");
  assert.equal(localizePath("/", "es"), "/es");
  assert.equal(localizePath("/es", "en"), "/");
  assert.equal(localizePath("/es", "es"), "/es");
  assert.equal(localizePath("/about", "es"), "/es/about");
  assert.equal(localizePath("/es/about", "es"), "/es/about");
  assert.equal(localizePath("/es/about", "en"), "/about");
  assert.equal(
    localizePath("/terms#confidentiality", "es"),
    "/es/terms#confidentiality",
  );
  assert.equal(
    localizePath("/stories/example?ref=nav#top", "es"),
    "/es/stories/example?ref=nav#top",
  );
  assert.equal(localizePath("#stories-list", "es"), "#stories-list");
  assert.equal(
    localizePath("mailto:hola@karmarisedglobal.com", "es"),
    "mailto:hola@karmarisedglobal.com",
  );
  assert.equal(localizePath("/api/contact", "es"), "/api/contact");
});

test("getLayoutMetadata sets localized OpenGraph locales and card-only Twitter metadata", () => {
  const enMeta = getLayoutMetadata("en");
  const esMeta = getLayoutMetadata("es");

  assert.equal(enMeta.openGraph?.locale, "en_GB");
  assert.deepEqual(enMeta.openGraph?.alternateLocale, ["es_ES"]);
  assert.equal(esMeta.openGraph?.locale, "es_ES");
  assert.deepEqual(esMeta.openGraph?.alternateLocale, ["en_GB"]);

  assert.deepEqual(Object.keys(enMeta.twitter ?? {}), [
    "card",
    "title",
    "description",
  ]);
  assert.deepEqual(Object.keys(esMeta.twitter ?? {}), [
    "card",
    "title",
    "description",
  ]);
  assert.equal(
    (enMeta.twitter as { card?: string } | undefined)?.card,
    "summary_large_image",
  );
  assert.equal(
    (esMeta.twitter as { card?: string } | undefined)?.card,
    "summary_large_image",
  );
});

test("getRouteMetadata returns compliant EN/ES titles, descriptions, and hreflang alternates for all 14 static routes", () => {
  assert.equal(STATIC_ROUTES.length, 14);

  for (const route of STATIC_ROUTES) {
    const enMeta = getRouteMetadata(route.key, "en");
    const esMeta = getRouteMetadata(route.key, "es");

    const enTitleText =
      typeof enMeta.title === "string"
        ? enMeta.title
        : (enMeta.title as { absolute?: string } | undefined)?.absolute || "";
    const esTitleText =
      typeof esMeta.title === "string"
        ? esMeta.title
        : (esMeta.title as { absolute?: string } | undefined)?.absolute || "";

    assert.ok(enTitleText.length > 0, `${route.key} EN title missing`);
    assert.ok(esTitleText.length > 0, `${route.key} ES title missing`);
    assert.ok(
      (enMeta.description ?? "").length > 20,
      `${route.key} EN description missing`,
    );
    assert.ok(
      (esMeta.description ?? "").length > 20,
      `${route.key} ES description missing`,
    );
    assert.notEqual(
      enMeta.description,
      esMeta.description,
      `${route.key} EN and ES descriptions must differ`,
    );

    if (typeof enMeta.title === "string") {
      assert.equal(
        enTitleText.includes("KarmaRise D Global"),
        false,
        `${route.key} EN string title must not duplicate brand suffix`,
      );
    }
    if (typeof esMeta.title === "string") {
      assert.equal(
        esTitleText.includes("KarmaRise D Global"),
        false,
        `${route.key} ES string title must not duplicate brand suffix`,
      );
    }

    const expectedEn = localizePath(route.path, "en");
    const expectedEs = localizePath(route.path, "es");

    assert.equal(enMeta.alternates?.canonical, expectedEn);
    assert.equal(esMeta.alternates?.canonical, expectedEs);
    assert.deepEqual(enMeta.alternates?.languages, {
      en: expectedEn,
      es: expectedEs,
      "x-default": expectedEn,
    });
    assert.deepEqual(esMeta.alternates?.languages, {
      en: expectedEn,
      es: expectedEs,
      "x-default": expectedEn,
    });

    assert.equal(enMeta.openGraph?.locale, "en_GB");
    assert.equal(esMeta.openGraph?.locale, "es_ES");

    for (const value of [
      enTitleText,
      esTitleText,
      enMeta.description ?? "",
      esMeta.description ?? "",
    ]) {
      assert.equal(
        FORBIDDEN_COPY_PATTERN.test(value),
        false,
        `${route.key} metadata violated copy compliance: ${value}`,
      );
      assert.equal(
        SOCIAL_PATTERN.test(value),
        false,
        `${route.key} metadata violated no-social-links rule: ${value}`,
      );
    }
  }
});

test("getStoryMetadata prioritizes Spanish SEO/story fields on ES and handles missing stories", () => {
  const missingEn = getStoryMetadata(undefined, "en");
  const missingEs = getStoryMetadata(undefined, "es");
  assert.equal(missingEn.title, "Story not found");
  assert.equal(missingEs.title, "Historia no encontrada");
  assert.deepEqual(missingEn.robots, { index: false, follow: false });
  assert.deepEqual(missingEs.robots, { index: false, follow: false });

  const baseStory = stories[0]!;
  const withSpanishSeo = {
    ...baseStory,
    seo: {
      title: "EN SEO Title",
      description: "EN SEO Description",
      spanishTitle: "Título SEO en español",
      spanishDescription: "Descripción SEO en español",
    },
  };

  const esSeoMeta = getStoryMetadata(withSpanishSeo, "es");
  assert.equal(esSeoMeta.title, "Título SEO en español");
  assert.equal(esSeoMeta.description, "Descripción SEO en español");
  assert.equal(
    esSeoMeta.alternates?.canonical,
    `/es/stories/${baseStory.slug}`,
  );
  assert.deepEqual(esSeoMeta.alternates?.languages, {
    en: `/stories/${baseStory.slug}`,
    es: `/es/stories/${baseStory.slug}`,
    "x-default": `/stories/${baseStory.slug}`,
  });
  assert.equal(esSeoMeta.openGraph?.locale, "es_ES");

  const withoutSpanishSeo = {
    ...baseStory,
    seo: {
      title: "EN SEO Title",
      description: "EN SEO Description",
    },
  };
  const esFallbackMeta = getStoryMetadata(withoutSpanishSeo, "es");
  assert.equal(esFallbackMeta.title, baseStory.spanishTitle);
  assert.equal(esFallbackMeta.description, baseStory.spanishSummary);

  const enMeta = getStoryMetadata(withoutSpanishSeo, "en");
  assert.equal(enMeta.title, "EN SEO Title");
  assert.equal(enMeta.description, "EN SEO Description");
  assert.equal(enMeta.alternates?.canonical, `/stories/${baseStory.slug}`);
  assert.equal(enMeta.openGraph?.locale, "en_GB");
});

test("every story defines EN and ES SEO metadata without duplicating the brand suffix", () => {
  for (const story of stories) {
    assert.ok(story.seo?.title, `${story.slug} missing seo.title`);
    assert.ok(story.seo?.description, `${story.slug} missing seo.description`);
    assert.ok(
      story.seo?.spanishTitle,
      `${story.slug} missing seo.spanishTitle`,
    );
    assert.ok(
      story.seo?.spanishDescription,
      `${story.slug} missing seo.spanishDescription`,
    );
    assert.equal(
      story.seo.title.includes("KarmaRise D Global"),
      false,
      `${story.slug} seo.title must not duplicate brand suffix`,
    );
    assert.equal(
      story.seo.spanishTitle.includes("KarmaRise D Global"),
      false,
      `${story.slug} seo.spanishTitle must not duplicate brand suffix`,
    );
    if (story.leadImage) {
      assert.ok(
        story.spanishLeadAlt?.trim(),
        `${story.slug} missing spanishLeadAlt`,
      );
    }
    if (story.pairImages?.length) {
      assert.equal(
        story.spanishPairAlts?.length,
        story.pairImages.length,
        `${story.slug} spanishPairAlts count mismatch`,
      );
    }
  }
});

test("sitemap emits paired EN and ES URLs with hreflang alternates for all static routes and stories", async () => {
  const mutableEnv = process.env as Record<string, string | undefined>;
  const prevProjectId = mutableEnv.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const prevServerProjectId = mutableEnv.SANITY_PROJECT_ID;
  delete mutableEnv.NEXT_PUBLIC_SANITY_PROJECT_ID;
  delete mutableEnv.SANITY_PROJECT_ID;

  try {
    const entries = await sitemap();
    assert.equal(entries.length, (STATIC_ROUTES.length + stories.length) * 2);

    const urlSet = new Set(entries.map((entry) => entry.url));
    for (const route of STATIC_ROUTES) {
      const enPath = localizePath(route.path, "en");
      const esPath = localizePath(route.path, "es");
      const enUrl = enPath === "/" ? siteUrl : `${siteUrl}${enPath}`;
      const esUrl = `${siteUrl}${esPath}`;
      assert.ok(urlSet.has(enUrl), `Missing EN sitemap URL: ${enUrl}`);
      assert.ok(urlSet.has(esUrl), `Missing ES sitemap URL: ${esUrl}`);

      const esEntry = entries.find((entry) => entry.url === esUrl);
      assert.deepEqual(esEntry?.alternates?.languages, {
        en: enUrl,
        es: esUrl,
        "x-default": enUrl,
      });
    }

    for (const story of stories) {
      const enUrl = `${siteUrl}/stories/${story.slug}`;
      const esUrl = `${siteUrl}/es/stories/${story.slug}`;
      assert.ok(urlSet.has(enUrl), `Missing EN story URL: ${enUrl}`);
      assert.ok(urlSet.has(esUrl), `Missing ES story URL: ${esUrl}`);
    }
  } finally {
    if (prevProjectId !== undefined) {
      mutableEnv.NEXT_PUBLIC_SANITY_PROJECT_ID = prevProjectId;
    }
    if (prevServerProjectId !== undefined) {
      mutableEnv.SANITY_PROJECT_ID = prevServerProjectId;
    }
  }
});

test("sanity revalidate endpoint fails closed when secret is unset or invalid and revalidates both EN and ES story paths", async () => {
  const mutableEnv = process.env as Record<string, string | undefined>;
  const prevNodeEnv = mutableEnv.NODE_ENV;
  const prevSecret = mutableEnv.SANITY_REVALIDATE_SECRET;
  revalidatedPaths.length = 0;
  revalidatedTags.length = 0;

  try {
    mutableEnv.NODE_ENV = "production";
    delete mutableEnv.SANITY_REVALIDATE_SECRET;

    const missingSecretRes = await revalidatePost(
      new Request("http://localhost/api/sanity/revalidate", {
        method: "POST",
        body: JSON.stringify({ slug: "test-story" }),
      }),
    );
    assert.equal(missingSecretRes.status, 500);

    mutableEnv.SANITY_REVALIDATE_SECRET = "super-secret-value";
    const badSecretRes = await revalidatePost(
      new Request("http://localhost/api/sanity/revalidate", {
        method: "POST",
        headers: { "x-sanity-secret": "wrong-secret" },
        body: JSON.stringify({ slug: "test-story" }),
      }),
    );
    assert.equal(badSecretRes.status, 401);

    const validRes = await revalidatePost(
      new Request("http://localhost/api/sanity/revalidate", {
        method: "POST",
        headers: { "x-sanity-secret": "super-secret-value" },
        body: JSON.stringify({ slug: "test-story" }),
      }),
    );
    assert.equal(validRes.status, 200);
    assert.deepEqual(revalidatedPaths, [
      { path: "/stories", type: undefined },
      { path: "/es/stories", type: undefined },
      { path: "/stories/[slug]", type: "page" },
      { path: "/es/stories/[slug]", type: "page" },
      { path: "/stories/test-story", type: undefined },
      { path: "/es/stories/test-story", type: undefined },
    ]);
    assert.deepEqual(revalidatedTags, [{ tag: "stories", profile: "max" }]);
  } finally {
    if (prevNodeEnv === undefined) {
      delete mutableEnv.NODE_ENV;
    } else {
      mutableEnv.NODE_ENV = prevNodeEnv;
    }
    if (prevSecret === undefined) {
      delete mutableEnv.SANITY_REVALIDATE_SECRET;
    } else {
      mutableEnv.SANITY_REVALIDATE_SECRET = prevSecret;
    }
  }
});

test("sanity revalidate endpoint rejects invalid explicit slugs with 400 without revalidating and preserves full-index 200 for empty payloads", async () => {
  const mutableEnv = process.env as Record<string, string | undefined>;
  const prevNodeEnv = mutableEnv.NODE_ENV;
  const prevSecret = mutableEnv.SANITY_REVALIDATE_SECRET;

  try {
    mutableEnv.NODE_ENV = "production";
    mutableEnv.SANITY_REVALIDATE_SECRET = "super-secret-value";

    const invalidPayloads = [
      { slug: "../evil" },
      { slug: { current: "bad slug!" } },
      { slug: 12345 },
      { slug: "" },
      { slug: { current: "" } },
    ];

    for (const payload of invalidPayloads) {
      revalidatedPaths.length = 0;
      revalidatedTags.length = 0;

      const res = await revalidatePost(
        new Request("http://localhost/api/sanity/revalidate", {
          method: "POST",
          headers: { "x-sanity-secret": "super-secret-value" },
          body: JSON.stringify(payload),
        }),
      );
      assert.equal(
        res.status,
        400,
        `Expected 400 for payload ${JSON.stringify(payload)}, got ${res.status}`,
      );
      assert.deepEqual(revalidatedPaths, []);
      assert.deepEqual(revalidatedTags, []);
    }

    for (const rawBody of [
      "",
      JSON.stringify({}),
      JSON.stringify({ slug: null }),
    ]) {
      revalidatedPaths.length = 0;
      revalidatedTags.length = 0;

      const res = await revalidatePost(
        new Request("http://localhost/api/sanity/revalidate", {
          method: "POST",
          headers: { "x-sanity-secret": "super-secret-value" },
          body: rawBody,
        }),
      );
      assert.equal(
        res.status,
        200,
        `Expected 200 for full-index payload ${rawBody || "<empty>"}, got ${res.status}`,
      );
      assert.deepEqual(revalidatedPaths, [
        { path: "/stories", type: undefined },
        { path: "/es/stories", type: undefined },
        { path: "/stories/[slug]", type: "page" },
        { path: "/es/stories/[slug]", type: "page" },
      ]);
      assert.deepEqual(revalidatedTags, [{ tag: "stories", profile: "max" }]);
    }
  } finally {
    if (prevNodeEnv === undefined) {
      delete mutableEnv.NODE_ENV;
    } else {
      mutableEnv.NODE_ENV = prevNodeEnv;
    }
    if (prevSecret === undefined) {
      delete mutableEnv.SANITY_REVALIDATE_SECRET;
    } else {
      mutableEnv.SANITY_REVALIDATE_SECRET = prevSecret;
    }
  }
});

test("sitemap skips empty or whitespace slugs and deduplicates duplicate story slugs", async () => {
  mockStoriesOverride = [
    { slug: "" },
    { slug: "   " },
    { slug: "dup-story", publishedAt: "2026-01-01T00:00:00Z" },
    { slug: " dup-story ", publishedAt: "2026-02-01T00:00:00Z" },
    { slug: "unique-story" },
  ];

  try {
    const entries = await sitemap();
    assert.equal(entries.length, (STATIC_ROUTES.length + 2) * 2);

    const urls = entries.map((entry) => entry.url);
    const urlSet = new Set(urls);
    assert.equal(urlSet.size, entries.length);
    assert.equal(urls.filter((url) => url === `${siteUrl}/stories`).length, 1);
    assert.equal(
      urls.filter((url) => url === `${siteUrl}/es/stories`).length,
      1,
    );
    assert.ok(urlSet.has(`${siteUrl}/stories/dup-story`));
    assert.ok(urlSet.has(`${siteUrl}/es/stories/dup-story`));
    assert.ok(urlSet.has(`${siteUrl}/stories/unique-story`));
    assert.ok(urlSet.has(`${siteUrl}/es/stories/unique-story`));
  } finally {
    mockStoriesOverride = null;
  }
});

test("site footer and root layouts enforce no-social-media-links compliance", () => {
  const footerSource = readFileSync(
    path.join(REPO_ROOT, "src/components/site-footer.tsx"),
    "utf8",
  );
  assert.equal(SOCIAL_PATTERN.test(footerSource), false);
  assert.equal(/Contact and social channels/i.test(footerSource), false);
  assert.equal(/Canales de contacto y redes/i.test(footerSource), false);
  assert.match(footerSource, /"Contact channels"/);
  assert.match(footerSource, /"Canales de contacto"/);

  const enLayoutSource = readFileSync(
    path.join(REPO_ROOT, "src/app/(en)/layout.tsx"),
    "utf8",
  );
  const esLayoutSource = readFileSync(
    path.join(REPO_ROOT, "src/app/(es)/layout.tsx"),
    "utf8",
  );
  assert.match(enLayoutSource, /getLayoutMetadata\("en"\)/);
  assert.match(esLayoutSource, /getLayoutMetadata\("es"\)/);
});
