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
        url: "data:text/javascript,export function getStories(){return globalThis.__m5SanityGetStories();}export function getStorySummaries(){return globalThis.__m5SanityGetStories();}",
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
const {
  getAboutStructuredData,
  getAlmariseStructuredData,
  getBookACallStructuredData,
  getContactStructuredData,
  getHomeStructuredData,
  getHowWeWorkStructuredData,
  getManufacturingProgrammeStructuredData,
  getProductBriefStructuredData,
  getStoriesIndexStructuredData,
  getStoryDetailStructuredData,
  serializeJsonLd,
} = await import("@/lib/structured-data");
const { buildStoriesRssXml } = await import("@/lib/rss");
const { default: nextConfig } = (await import(
  pathToFileURL(path.join(REPO_ROOT, "next.config.ts")).href
)) as typeof import("../next.config");
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
  const esFallbackTitle =
    typeof esFallbackMeta.title === "string"
      ? esFallbackMeta.title
      : (esFallbackMeta.title as { absolute?: string } | undefined)?.absolute ||
        "";
  assert.ok(esFallbackTitle.includes(baseStory.spanishTitle!));
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
    assert.ok(
      story.seo.title.length <= 50,
      `${story.slug} seo.title exceeds 50 chars (${story.seo.title.length})`,
    );
    assert.ok(
      story.seo.spanishTitle.length <= 50,
      `${story.slug} seo.spanishTitle exceeds 50 chars (${story.seo.spanishTitle.length})`,
    );
    assert.ok(
      story.seo.description.length <= 165,
      `${story.slug} seo.description exceeds 165 chars (${story.seo.description.length})`,
    );
    assert.ok(
      story.seo.spanishDescription.length <= 165,
      `${story.slug} seo.spanishDescription exceeds 165 chars (${story.seo.spanishDescription.length})`,
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
    path.join(REPO_ROOT, "src/components/shell/site-footer.tsx"),
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

test("getManufacturingProgrammeStructuredData emits compliant EN and ES graphs with BreadcrumbList, Service, 6-step HowTo, and 9-item FAQPage", () => {
  for (const lang of ["en", "es"] as const) {
    const data = getManufacturingProgrammeStructuredData(lang);
    const serialized = serializeJsonLd(data);
    assert.equal(
      FORBIDDEN_COPY_PATTERN.test(serialized),
      false,
      `Manufacturing structured data (${lang}) violated copy compliance`,
    );
    assert.equal(
      SOCIAL_PATTERN.test(serialized),
      false,
      `Manufacturing structured data (${lang}) violated no-social-links rule`,
    );

    const graph = data["@graph"] as Array<Record<string, unknown>>;
    assert.ok(Array.isArray(graph));

    const types = new Set(graph.map((node) => node["@type"]));
    for (const requiredType of [
      "Organization",
      "WebPage",
      "BreadcrumbList",
      "Service",
      "HowTo",
      "FAQPage",
    ]) {
      assert.ok(
        types.has(requiredType),
        `Missing ${requiredType} node in ${lang} structured data`,
      );
    }

    const howTo = graph.find((node) => node["@type"] === "HowTo");
    assert.equal((howTo?.step as unknown[]).length, 6);

    const faq = graph.find((node) => node["@type"] === "FAQPage");
    assert.equal((faq?.mainEntity as unknown[]).length, 9);

    const homeData = getHomeStructuredData(lang);
    assert.ok(Array.isArray(homeData["@graph"]));
  }
});

test("getHowWeWorkStructuredData emits compliant EN and ES graphs with BreadcrumbList, 5-step HowTo, and 6-item FAQPage", () => {
  for (const lang of ["en", "es"] as const) {
    const data = getHowWeWorkStructuredData(lang);
    const serialized = serializeJsonLd(data);
    assert.equal(
      FORBIDDEN_COPY_PATTERN.test(serialized),
      false,
      `How We Work structured data (${lang}) violated copy compliance`,
    );
    assert.equal(
      /snoby|pedido en serie|socios de fabricaci/i.test(serialized),
      false,
      `How We Work structured data (${lang}) contained confidential or banned terminology`,
    );
    assert.equal(
      SOCIAL_PATTERN.test(serialized),
      false,
      `How We Work structured data (${lang}) violated no-social-links rule`,
    );

    const graph = data["@graph"] as Array<Record<string, unknown>>;
    assert.ok(Array.isArray(graph));

    const types = new Set(graph.map((node) => node["@type"]));
    for (const requiredType of [
      "Organization",
      "WebSite",
      "WebPage",
      "BreadcrumbList",
      "HowTo",
      "FAQPage",
    ]) {
      assert.ok(
        types.has(requiredType),
        `Missing ${requiredType} node in How We Work ${lang} structured data`,
      );
    }

    const howTo = graph.find((node) => node["@type"] === "HowTo");
    assert.equal((howTo?.step as unknown[]).length, 5);

    const faq = graph.find((node) => node["@type"] === "FAQPage");
    assert.equal((faq?.mainEntity as unknown[]).length, 6);
  }
});

test("getAboutStructuredData emits compliant EN and ES graphs with AboutPage, Organization, two Person founders, BreadcrumbList, and 6-item FAQPage", () => {
  for (const lang of ["en", "es"] as const) {
    const data = getAboutStructuredData(lang);
    const serialized = serializeJsonLd(data);
    assert.equal(
      FORBIDDEN_COPY_PATTERN.test(serialized),
      false,
      `About structured data (${lang}) violated copy compliance`,
    );
    assert.equal(
      /snoby|pedido en serie|producci[oó]n en serie|socios? de fabricaci/i.test(
        serialized,
      ),
      false,
      `About structured data (${lang}) contained confidential or banned terminology`,
    );
    assert.equal(
      SOCIAL_PATTERN.test(serialized),
      false,
      `About structured data (${lang}) violated no-social-links rule`,
    );

    const graph = data["@graph"] as Array<Record<string, unknown>>;
    assert.ok(Array.isArray(graph));

    const types = new Set(graph.map((node) => node["@type"]));
    for (const requiredType of [
      "Organization",
      "WebSite",
      "AboutPage",
      "BreadcrumbList",
      "FAQPage",
      "Person",
    ]) {
      assert.ok(
        types.has(requiredType),
        `Missing ${requiredType} node in About ${lang} structured data`,
      );
    }

    const persons = graph.filter((node) => node["@type"] === "Person");
    assert.equal(persons.length, 2);
    const alma = persons.find((node) => node.name === "Alma");
    const shirish = persons.find((node) => node.name === "Shirish");
    assert.deepEqual(alma?.knowsLanguage, ["es", "en", "pt"]);
    assert.deepEqual(shirish?.knowsLanguage, ["en", "mr", "hi"]);
    assert.match(String(shirish?.jobTitle ?? ""), /Bar Council/i);

    const faq = graph.find((node) => node["@type"] === "FAQPage");
    assert.equal((faq?.mainEntity as unknown[]).length, 6);
  }
});

test("getAlmariseStructuredData emits compliant EN and ES graphs with Organization, WebSite, Brand, WebPage, and BreadcrumbList", () => {
  for (const lang of ["en", "es"] as const) {
    const data = getAlmariseStructuredData(lang);
    const serialized = serializeJsonLd(data);
    assert.equal(
      FORBIDDEN_COPY_PATTERN.test(serialized),
      false,
      `AlmaRise structured data (${lang}) violated copy compliance`,
    );
    assert.equal(
      SOCIAL_PATTERN.test(serialized),
      false,
      `AlmaRise structured data (${lang}) violated no-social-links rule`,
    );
    assert.match(serialized, /AlmaRise D Brand/);
    assert.match(serialized, /AlmaRise D Reborn/);
    assert.match(serialized, /AlmaRise D Organic/);
    assert.equal(/(?<!\/)Almarise/.test(serialized), false);
    assert.equal(
      /AlmaRise(?! D (?:Brand|Reborn|Organic|Home Decor))/.test(serialized),
      false,
      `AlmaRise structured data (${lang}) contained standalone AlmaRise without D qualifier`,
    );

    const graph = data["@graph"] as Array<Record<string, unknown>>;
    assert.ok(Array.isArray(graph));
    const types = new Set(graph.map((node) => node["@type"]));
    for (const requiredType of [
      "Organization",
      "WebSite",
      "Brand",
      "WebPage",
      "BreadcrumbList",
    ]) {
      assert.ok(
        types.has(requiredType),
        `Missing ${requiredType} node in AlmaRise ${lang} structured data`,
      );
    }
  }
});

test("conversion pages emit compliant EN and ES structured data (Product Brief, Book a Call, Contact)", () => {
  for (const lang of ["en", "es"] as const) {
    const briefData = getProductBriefStructuredData(lang);
    const briefSerialized = serializeJsonLd(briefData);
    assert.equal(FORBIDDEN_COPY_PATTERN.test(briefSerialized), false);
    assert.equal(SOCIAL_PATTERN.test(briefSerialized), false);
    const briefGraph = briefData["@graph"] as Array<Record<string, unknown>>;
    const briefTypes = new Set(briefGraph.map((node) => node["@type"]));
    for (const required of [
      "Organization",
      "WebSite",
      "WebPage",
      "BreadcrumbList",
      "HowTo",
    ]) {
      assert.ok(
        briefTypes.has(required),
        `Missing ${required} on brief ${lang}`,
      );
    }
    const briefHowTo = briefGraph.find((node) => node["@type"] === "HowTo");
    assert.equal((briefHowTo?.step as unknown[]).length, 4);

    const callData = getBookACallStructuredData(lang);
    const callSerialized = serializeJsonLd(callData);
    assert.equal(FORBIDDEN_COPY_PATTERN.test(callSerialized), false);
    assert.equal(SOCIAL_PATTERN.test(callSerialized), false);
    const callGraph = callData["@graph"] as Array<Record<string, unknown>>;
    const callTypes = new Set(callGraph.map((node) => node["@type"]));
    for (const required of [
      "Organization",
      "WebSite",
      "WebPage",
      "BreadcrumbList",
      "FAQPage",
    ]) {
      assert.ok(callTypes.has(required), `Missing ${required} on call ${lang}`);
    }
    const callFaq = callGraph.find((node) => node["@type"] === "FAQPage");
    assert.equal((callFaq?.mainEntity as unknown[]).length, 4);

    const contactData = getContactStructuredData(lang);
    const contactSerialized = serializeJsonLd(contactData);
    assert.equal(SOCIAL_PATTERN.test(contactSerialized), false);
    assert.equal(/\u2014|&mdash;|&#8212;/.test(contactSerialized), false);
    const contactGraph = contactData["@graph"] as Array<
      Record<string, unknown>
    >;
    const contactTypes = new Set(contactGraph.map((node) => node["@type"]));
    for (const required of [
      "Organization",
      "WebSite",
      "ContactPage",
      "BreadcrumbList",
    ]) {
      assert.ok(
        contactTypes.has(required),
        `Missing ${required} on contact ${lang}`,
      );
    }
    assert.match(contactSerialized, /inquiry@karmarisedglobal\.com/);
    assert.match(contactSerialized, /partners@karmarisedglobal\.com/);
    assert.match(contactSerialized, /accounts@karmarisedglobal\.com/);
    assert.match(contactSerialized, /support@karmarisedglobal\.com/);
  }
});

test("next.config.ts configures 301 redirects from /working-across-distance to /how-we-work in EN and ES", async () => {
  assert.equal(typeof nextConfig.redirects, "function");
  const redirects = await nextConfig.redirects!();
  assert.ok(
    redirects.some(
      (rule) =>
        rule.source === "/working-across-distance" &&
        rule.destination === "/how-we-work" &&
        rule.statusCode === 301,
    ),
    "Missing 301 redirect from /working-across-distance to /how-we-work",
  );
  assert.ok(
    redirects.some(
      (rule) =>
        rule.source === "/es/working-across-distance" &&
        rule.destination === "/es/how-we-work" &&
        rule.statusCode === 301,
    ),
    "Missing 301 redirect from /es/working-across-distance to /es/how-we-work",
  );
});

test("Stories index and Story detail emit compliant EN and ES structured data and RSS feeds", () => {
  for (const lang of ["en", "es"] as const) {
    const indexData = getStoriesIndexStructuredData(lang, stories);
    const indexSerialized = serializeJsonLd(indexData);
    assert.equal(
      FORBIDDEN_COPY_PATTERN.test(indexSerialized),
      false,
      `Stories index structured data (${lang}) violated copy compliance`,
    );
    assert.equal(
      SOCIAL_PATTERN.test(indexSerialized),
      false,
      `Stories index structured data (${lang}) violated no-social-links rule`,
    );
    const indexGraph = indexData["@graph"] as Array<Record<string, unknown>>;
    const indexTypes = new Set(indexGraph.map((node) => node["@type"]));
    for (const required of [
      "Organization",
      "WebSite",
      "CollectionPage",
      "ItemList",
      "BreadcrumbList",
    ]) {
      assert.ok(
        indexTypes.has(required),
        `Missing ${required} on Stories index (${lang})`,
      );
    }
    const itemList = indexGraph.find((node) => node["@type"] === "ItemList");
    assert.equal(
      (itemList?.itemListElement as unknown[]).length,
      stories.length,
    );

    for (const story of stories) {
      const detailData = getStoryDetailStructuredData(lang, story);
      const detailSerialized = serializeJsonLd(detailData);
      assert.equal(
        FORBIDDEN_COPY_PATTERN.test(detailSerialized),
        false,
        `Story detail structured data (${lang}, ${story.slug}) violated copy compliance`,
      );
      assert.equal(
        SOCIAL_PATTERN.test(detailSerialized),
        false,
        `Story detail structured data (${lang}, ${story.slug}) violated no-social-links rule`,
      );
      const detailGraph = detailData["@graph"] as Array<
        Record<string, unknown>
      >;
      const detailTypes = new Set(detailGraph.map((node) => node["@type"]));
      for (const required of [
        "Organization",
        "WebSite",
        "Article",
        "BreadcrumbList",
        "Person",
      ]) {
        assert.ok(
          detailTypes.has(required),
          `Missing ${required} on Story detail (${lang}, ${story.slug})`,
        );
      }
      const article = detailGraph.find((node) => node["@type"] === "Article");
      assert.ok(
        Number(article?.wordCount ?? 0) > 100,
        `Story wordCount too low (${lang}, ${story.slug})`,
      );
    }

    const rss = buildStoriesRssXml(lang, stories);
    assert.match(rss, /<rss version="2\.0"/);
    assert.match(
      rss,
      new RegExp(`<language>${lang === "es" ? "es-ES" : "en-GB"}</language>`),
    );
    assert.equal(
      (rss.match(/<item>/g) ?? []).length,
      stories.length,
      `RSS item count mismatch (${lang})`,
    );
  }
});
