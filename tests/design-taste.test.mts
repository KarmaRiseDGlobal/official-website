import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);

const LIGHT_SURFACES = new Set(["paper", "dune", "pale-sage"]);
const DARK_SURFACES = new Set(["forest-deep", "wood", "night"]);

function collectCssFiles(dir: string): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectCssFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".css")) {
      results.push(fullPath);
    }
  }
  return results;
}

test("CSS subgrid containers never reset gap or column-gap to 0", () => {
  const cssFiles = collectCssFiles(path.join(REPO_ROOT, "src"));
  const violations: string[] = [];

  for (const filePath of cssFiles) {
    const raw = readFileSync(filePath, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const blockRegex = /([^{}]+)\{([^{}]+)\}/g;
    let match: RegExpExecArray | null;

    while ((match = blockRegex.exec(raw)) !== null) {
      const selector = match[1]?.trim() ?? "";
      const declarations = match[2] ?? "";
      if (!/grid-template-columns\s*:\s*subgrid\b/.test(declarations)) {
        continue;
      }
      if (
        /(?:^|;)\s*(?:column-)?gap\s*:\s*0(?:px|rem|em|%)?\s*(?:;|$)/.test(
          declarations,
        )
      ) {
        violations.push(
          `${path.relative(REPO_ROOT, filePath)} (${selector}) resets subgrid gap to 0`,
        );
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found subgrid containers overriding parent track spacing with gap: 0:\n${violations.join("\n")}`,
  );
});

test("High-contrast SectionBridge gradients use multi-stop oklab S-curve easing", () => {
  const bridgeFile = path.join(
    REPO_ROOT,
    "src",
    "components",
    "shell",
    "section-bridge.tsx",
  );
  const source = readFileSync(bridgeFile, "utf8");
  const entryRegex =
    /"([a-z-]+)->([a-z-]+)"\s*:\s*\n?\s*"(linear-gradient\([^"]+\))"/g;
  const definedHighContrast = new Set<string>();
  const violations: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = entryRegex.exec(source)) !== null) {
    const from = match[1] ?? "";
    const to = match[2] ?? "";
    const gradient = match[3] ?? "";
    const isHighContrast = LIGHT_SURFACES.has(from) !== LIGHT_SURFACES.has(to);
    if (!isHighContrast) continue;

    definedHighContrast.add(`${from}->${to}`);
    const usesOklab = /color-mix\(\s*in\s+oklab\b/.test(gradient);
    const stopCount = (gradient.match(/\b\d+(?:\.\d+)?%(?=\s*(?:,|\)))/g) ?? [])
      .length;

    if (!usesOklab || stopCount < 9) {
      violations.push(
        `${from}->${to} (oklab=${usesOklab}, stops=${stopCount})`,
      );
    }
  }

  for (const light of LIGHT_SURFACES) {
    for (const dark of DARK_SURFACES) {
      for (const pair of [`${light}->${dark}`, `${dark}->${light}`]) {
        if (!definedHighContrast.has(pair)) {
          violations.push(`${pair} (missing explicit 9-stop oklab entry)`);
        }
      }
    }
  }

  assert.equal(
    definedHighContrast.size,
    LIGHT_SURFACES.size * DARK_SURFACES.size * 2,
    "Expected all 18 light<->dark SectionBridge pairs to be explicitly calibrated",
  );
  assert.deepEqual(
    violations,
    [],
    `High-contrast SectionBridge pairs not using 9-stop oklab easing (${violations.length}):\n${violations.join("\n")}`,
  );
});

function collectFilesByExt(
  dir: string,
  extensions: readonly string[],
): string[] {
  const results: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectFilesByExt(fullPath, extensions));
    } else if (
      entry.isFile() &&
      extensions.some((ext) => entry.name.endsWith(ext))
    ) {
      results.push(fullPath);
    }
  }
  return results;
}

test("Top header (.site-header) has no CTA button and no bottom border", () => {
  const siteMenuPath = path.join(
    REPO_ROOT,
    "src",
    "components",
    "shell",
    "site-menu.tsx",
  );
  const siteMenuSource = readFileSync(siteMenuPath, "utf8");
  const headerMatch = /<header\b[\s\S]*?<\/header>/.exec(siteMenuSource);
  assert.ok(
    headerMatch,
    "Expected <header> markup in src/components/shell/site-menu.tsx",
  );
  const headerMarkup = headerMatch[0];

  const violations: string[] = [];
  if (/header-cta|headerCta|\/product-brief|\/book-a-call/.test(headerMarkup)) {
    violations.push(
      "src/components/shell/site-menu.tsx renders a CTA link inside <header>",
    );
  }

  const globalsPath = path.join(REPO_ROOT, "src", "app", "globals.css");
  const globalsRaw = readFileSync(globalsPath, "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  const blockRegex = /([^{}]+)\{([^{}]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(globalsRaw)) !== null) {
    const selector = match[1]?.trim() ?? "";
    const declarations = match[2] ?? "";
    if (!/\.site-header\b/.test(selector)) {
      continue;
    }
    const borderBottomMatch = /(?:^|;)\s*border-bottom\s*:\s*([^;]+)/.exec(
      declarations,
    );
    if (
      borderBottomMatch &&
      !/^(?:0|none)\s*$/i.test(borderBottomMatch[1]?.trim() ?? "")
    ) {
      violations.push(
        `src/app/globals.css (${selector}) declares border-bottom: ${borderBottomMatch[1]?.trim()}`,
      );
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found forbidden CTA or bottom border in .site-header:\n${violations.join("\n")}`,
  );
});

test("Navbar and menu typography uses canonical var(--text-*) tokens only", () => {
  const globalsPath = path.join(REPO_ROOT, "src", "app", "globals.css");
  const globalsRaw = readFileSync(globalsPath, "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  const blockRegex = /([^{}]+)\{([^{}]+)\}/g;
  const violations: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(globalsRaw)) !== null) {
    const selector = match[1]?.trim() ?? "";
    const declarations = match[2] ?? "";
    if (!/\.(?:site-header|header-|menu-)/.test(selector)) {
      continue;
    }
    const fontSizeRegex = /(?:^|;)\s*font-size\s*:\s*([^;]+)/g;
    let fsMatch: RegExpExecArray | null;
    while ((fsMatch = fontSizeRegex.exec(declarations)) !== null) {
      const value = fsMatch[1]?.trim() ?? "";
      if (!/^var\(--text-[a-z0-9-]+\)$/.test(value)) {
        violations.push(
          `src/app/globals.css (${selector}) uses non-token font-size: ${value}`,
        );
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found non-token navbar/menu font-size declarations:\n${violations.join("\n")}`,
  );
});

test("CTA button labels never include repetitive 1 min duration tags", () => {
  const oneMinPattern = /\b1[\s-]?min(?:ute|uto)?s?\b/i;
  const violations: string[] = [];

  const dataFiles = collectFilesByExt(path.join(REPO_ROOT, "src", "data"), [
    ".ts",
  ]);
  for (const filePath of dataFiles) {
    const source = readFileSync(filePath, "utf8");
    const ctaBlockRegex = /\bctaLabel\s*:\s*\{([\s\S]*?)\}/g;
    let match: RegExpExecArray | null;
    while ((match = ctaBlockRegex.exec(source)) !== null) {
      if (oneMinPattern.test(match[1] ?? "")) {
        violations.push(
          `${path.relative(REPO_ROOT, filePath)} contains a 1-min tag inside ctaLabel`,
        );
      }
    }
  }

  const tsxFiles = [
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "views"), [".tsx"]),
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "components"), [".tsx"]),
  ];
  const ctaElementRegex =
    /<(?:Link|a|button)\b[^>]*className=["'`][^"'`]*(?:primary-button|hero-primary|founders-cta-primary)[^"'`]*["'`][^>]*>([\s\S]*?)<\/(?:Link|a|button)>/g;

  for (const filePath of tsxFiles) {
    const source = readFileSync(filePath, "utf8");
    let match: RegExpExecArray | null;
    while ((match = ctaElementRegex.exec(source)) !== null) {
      if (oneMinPattern.test(match[1] ?? "")) {
        violations.push(
          `${path.relative(REPO_ROOT, filePath)} contains a 1-min tag inside a primary CTA button`,
        );
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found repetitive 1-min duration tags inside CTA buttons:\n${violations.join("\n")}`,
  );
});

test("Editorial photo cover scroll cue (.founders-cover-cue) stays boxless and borderless", () => {
  const globalsPath = path.join(REPO_ROOT, "src", "app", "globals.css");
  const globalsRaw = readFileSync(globalsPath, "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  const blockRegex = /([^{}]+)\{([^{}]+)\}/g;
  let match: RegExpExecArray | null;
  let foundBaseRule = false;
  let hasBorderZero = false;
  let hasTransparentBg = false;

  while ((match = blockRegex.exec(globalsRaw)) !== null) {
    const selector = match[1]?.trim() ?? "";
    const declarations = match[2] ?? "";
    if (!/(?:^|,|\s)\.founders-cover-cue\s*$/.test(selector)) {
      continue;
    }
    foundBaseRule = true;
    if (/(?:^|;)\s*border\s*:\s*(?:0|none)\s*(?:;|$)/i.test(declarations)) {
      hasBorderZero = true;
    }
    if (
      /(?:^|;)\s*background(?:-color)?\s*:\s*transparent\s*(?:;|$)/i.test(
        declarations,
      )
    ) {
      hasTransparentBg = true;
    }
  }

  assert.ok(
    foundBaseRule && hasBorderZero && hasTransparentBg,
    `Expected .founders-cover-cue in src/app/globals.css to declare border: 0 and background: transparent (found=${foundBaseRule}, borderZero=${hasBorderZero}, transparentBg=${hasTransparentBg})`,
  );
});

test("Capabilities hover overlays never duplicate the adjacent visible heading", () => {
  const homeClientPath = path.join(
    REPO_ROOT,
    "src",
    "views",
    "home-client.tsx",
  );
  const homeSource = readFileSync(homeClientPath, "utf8");
  assert.equal(
    /cap-overlay-heading/.test(homeSource),
    false,
    "src/views/home-client.tsx must not render a duplicate .cap-overlay-heading inside .cap-overlay",
  );
});

test("Menu showcase keeps at most 4 category cards with zero nav route duplicates", () => {
  const navPath = path.join(REPO_ROOT, "src", "data", "navigation.ts");
  const navSource = readFileSync(navPath, "utf8");

  function extractHrefs(constName: string): string[] {
    const sectionRegex = new RegExp(
      `export const ${constName}[^=]*=\\s*\\[([\\s\\S]*?)\\n\\];`,
    );
    const sectionMatch = sectionRegex.exec(navSource);
    assert.ok(sectionMatch, `Expected ${constName} in src/data/navigation.ts`);
    const body = sectionMatch[1] ?? "";
    const hrefs: string[] = [];
    const hrefRegex = /\bhref\s*:\s*"([^"]+)"/g;
    let match: RegExpExecArray | null;
    while ((match = hrefRegex.exec(body)) !== null) {
      if (match[1]) hrefs.push(match[1]);
    }
    return hrefs;
  }

  const navHrefs = new Set([
    ...extractHrefs("PRIMARY_NAV_LINKS"),
    ...extractHrefs("SECONDARY_NAV_LINKS"),
  ]);
  const cardHrefs = extractHrefs("MENU_SHOWCASE_CARDS");
  const duplicates = cardHrefs.filter((href) => navHrefs.has(href));

  assert.ok(
    cardHrefs.length <= 4,
    `Expected MENU_SHOWCASE_CARDS to contain at most 4 cards, found ${cardHrefs.length}`,
  );
  assert.deepEqual(
    duplicates,
    [],
    `MENU_SHOWCASE_CARDS duplicates existing navigation routes: ${duplicates.join(", ")}`,
  );
});

test("Editorial story-plus-photo split (.ownership-grid) omits top divider lines", () => {
  const globalsPath = path.join(REPO_ROOT, "src", "app", "globals.css");
  const globalsRaw = readFileSync(globalsPath, "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  const blockRegex = /([^{}]+)\{([^{}]+)\}/g;
  const violations: string[] = [];
  let match: RegExpExecArray | null;

  while ((match = blockRegex.exec(globalsRaw)) !== null) {
    const selector = match[1]?.trim() ?? "";
    const declarations = match[2] ?? "";
    if (!/\.ownership-grid\b/.test(selector)) {
      continue;
    }
    const borderTopMatch = /(?:^|;)\s*border-top\s*:\s*([^;]+)/.exec(
      declarations,
    );
    if (
      borderTopMatch &&
      !/^(?:0|none)\s*$/i.test(borderTopMatch[1]?.trim() ?? "")
    ) {
      violations.push(
        `src/app/globals.css (${selector}) declares border-top: ${borderTopMatch[1]?.trim()}`,
      );
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found forbidden horizontal divider border-top on .ownership-grid:\n${violations.join("\n")}`,
  );
});

test("Manufacturing product categories showcase omits textbook divider lines and tethers", () => {
  const sectionPath = path.join(
    REPO_ROOT,
    "src",
    "components",
    "manufacturing",
    "category-showcase-section.tsx",
  );
  const sectionSource = readFileSync(sectionPath, "utf8");
  const globalsPath = path.join(REPO_ROOT, "src", "app", "globals.css");
  const globalsRaw = readFileSync(globalsPath, "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );

  const violations: string[] = [];

  if (
    /category-tether/.test(sectionSource) ||
    /\.category-tether\b/.test(globalsRaw)
  ) {
    violations.push("Found forbidden decorative .category-tether hairline");
  }
  if (/\bborder-(?:t|b)\b/.test(sectionSource)) {
    violations.push(
      "src/components/manufacturing/category-showcase-section.tsx contains textbook border-t/border-b divider classes",
    );
  }

  const blockRegex = /([^{}]+)\{([^{}]+)\}/g;
  let match: RegExpExecArray | null;
  while ((match = blockRegex.exec(globalsRaw)) !== null) {
    const selector = match[1]?.trim() ?? "";
    const declarations = match[2] ?? "";
    if (!/\.cat-(?:showcase|chapters|chapter|facts|fact)\b/.test(selector)) {
      continue;
    }
    const borderMatch = /(?:^|;)\s*border-(?:top|bottom)\s*:\s*([^;]+)/.exec(
      declarations,
    );
    if (borderMatch && !/^(?:0|none)\s*$/i.test(borderMatch[1]?.trim() ?? "")) {
      violations.push(
        `src/app/globals.css (${selector}) declares textbook divider border: ${borderMatch[1]?.trim()}`,
      );
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found textbook horizontal divider lines in manufacturing product categories:\n${violations.join("\n")}`,
  );
});

test("Landing HorizontalShowcase cards omit step numbering and redundant metadata pills", () => {
  const showcasePath = path.join(
    REPO_ROOT,
    "src",
    "components",
    "showcases",
    "horizontal-showcase.tsx",
  );
  const showcaseSource = readFileSync(showcasePath, "utf8");
  const globalsPath = path.join(REPO_ROOT, "src", "app", "globals.css");
  const globalsRaw = readFileSync(globalsPath, "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );

  const violations: string[] = [];
  if (
    /concerns-slice-step/.test(showcaseSource) ||
    /\.concerns-slice-step\b/.test(globalsRaw)
  ) {
    violations.push("Found forbidden .concerns-slice-step card numbering");
  }
  if (
    /concerns-controls-counter/.test(showcaseSource) ||
    /\.concerns-controls-counter\b/.test(globalsRaw)
  ) {
    violations.push(
      "Found forbidden numeric .concerns-controls-counter in showcase controls",
    );
  }
  if (
    /concerns-slice-pills?/.test(showcaseSource) ||
    /\.concerns-slice-pills?\b/.test(globalsRaw)
  ) {
    violations.push(
      "Found forbidden .concerns-slice-pill metadata badge stack inside showcase cards",
    );
  }

  assert.deepEqual(
    violations,
    [],
    `Found forbidden numbering or pill clutter in HorizontalShowcase:\n${violations.join("\n")}`,
  );
});

test("NewsletterForm light/journal variants enforce surface-aware primary button and ink isolation", () => {
  const formPath = path.join(
    REPO_ROOT,
    "src",
    "components",
    "forms",
    "newsletter-form.tsx",
  );
  const source = readFileSync(formPath, "utf8");
  const violations: string[] = [];

  if (!/className="primary-button-light shrink-0"/.test(source)) {
    violations.push(
      "NewsletterForm journal variant must use .primary-button-light on light ground",
    );
  }
  if (
    !/isLight\s*\?\s*"primary-button-light shrink-0"\s*:\s*"primary-button shrink-0"/.test(
      source,
    )
  ) {
    violations.push(
      "NewsletterForm light variant must switch submit CTA to .primary-button-light",
    );
  }
  if (
    !/if\s*\(isJournal\)\s*\{[\s\S]*?bg-\[var\(--color-white\)\][\s\S]*?text-\[var\(--color-forest-deep\)\]/.test(
      source,
    )
  ) {
    violations.push(
      "NewsletterForm journal container must declare explicit dark ink (text-[var(--color-forest-deep)]) to avoid inheriting light ink from dark sections",
    );
  }

  assert.deepEqual(
    violations,
    [],
    `Found NewsletterForm surface/contrast regressions:\n${violations.join("\n")}`,
  );
});

test("About and Stories pages use canonical typography tokens, SectionBridge seams, and light-ground primary buttons", () => {
  const aboutCss = readFileSync(
    path.join(REPO_ROOT, "src", "views", "about.module.css"),
    "utf8",
  ).replace(/\/\*[\s\S]*?\*\//g, "");
  const aboutClient = readFileSync(
    path.join(REPO_ROOT, "src", "views", "about-client.tsx"),
    "utf8",
  );
  const siteMenu = readFileSync(
    path.join(REPO_ROOT, "src", "components", "shell", "site-menu.tsx"),
    "utf8",
  );
  const loaderSource = readFileSync(
    path.join(REPO_ROOT, "src", "lib", "loader.ts"),
    "utf8",
  );
  const storiesBrowser = readFileSync(
    path.join(REPO_ROOT, "src", "views", "stories-browser.tsx"),
    "utf8",
  );
  const globalsCss = readFileSync(
    path.join(REPO_ROOT, "src", "app", "globals.css"),
    "utf8",
  );

  const violations: string[] = [];

  if (/font-size\s*:\s*clamp\(/.test(aboutCss)) {
    violations.push(
      "src/views/about.module.css declares raw font-size: clamp(...) instead of var(--text-*)",
    );
  }
  if (
    !/ClosingConversationSection/.test(aboutClient) ||
    !/SectionBridge/.test(aboutClient)
  ) {
    violations.push(
      "src/views/about-client.tsx must use SectionBridge and ClosingConversationSection",
    );
  }
  const aboutHeroMatch =
    /<section\b[^>]*className="hero about-hero"[\s\S]*?<\/section>/.exec(
      aboutClient,
    );
  if (!aboutHeroMatch) {
    violations.push(
      "src/views/about-client.tsx must render .hero.about-hero section",
    );
  } else {
    const aboutHeroMarkup = aboutHeroMatch[0];
    if (!/data-surface="light"/.test(aboutHeroMarkup)) {
      violations.push(
        'src/views/about-client.tsx .about-hero must declare data-surface="light"',
      );
    }
    if (/<Image\b|<img\b/.test(aboutHeroMarkup)) {
      violations.push(
        "src/views/about-client.tsx .about-hero must use a light tonal banner without a hero photograph",
      );
    }
    if (!/primary-button-light/.test(aboutHeroMarkup)) {
      violations.push(
        "src/views/about-client.tsx .about-hero must use .primary-button-light on light ground",
      );
    }
  }
  const darkRoutesPattern =
    /DARK_HERO_ROUTES\s*=\s*new Set\(\[[\s\S]*?"\/about"[\s\S]*?\]\)/;
  if (
    darkRoutesPattern.test(siteMenu) ||
    darkRoutesPattern.test(loaderSource)
  ) {
    violations.push(
      "/about must not remain in DARK_HERO_ROUTES when using a light header banner",
    );
  }
  const aboutHeroMediaMatch = /\.about-hero-media\s*\{([^}]+)\}/.exec(
    globalsCss,
  );
  if (
    !aboutHeroMediaMatch ||
    !/background\s*:\s*var\(--color-paper\)/.test(aboutHeroMediaMatch[1] ?? "")
  ) {
    violations.push(
      "src/app/globals.css .about-hero-media must use pure var(--color-paper) with no green sage tint",
    );
  }
  if (
    /stories-wave-divider/.test(storiesBrowser) ||
    /stories-wave-divider/.test(globalsCss)
  ) {
    violations.push(
      "Stories page must use SectionBridge rather than bespoke .stories-wave-divider SVG",
    );
  }
  if (!/primary-button-light/.test(storiesBrowser)) {
    violations.push(
      "src/views/stories-browser.tsx must use .primary-button-light for primary CTAs on Warm Parchment",
    );
  }

  assert.deepEqual(
    violations,
    [],
    `Found About/Stories design-system regressions:\n${violations.join("\n")}`,
  );
});

test("No visible image explanations or captions render across website or emails", () => {
  const violations: string[] = [];

  const tsxFiles = [
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "views"), [".tsx"]),
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "components"), [".tsx"]),
  ];
  for (const filePath of tsxFiles) {
    const rel = path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
    const source = readFileSync(filePath, "utf8");
    if (/<figcaption\b/.test(source)) {
      violations.push(`${rel} renders a visible <figcaption> element`);
    }
  }

  const emailLayout = readFileSync(
    path.join(REPO_ROOT, "src", "lib", "email-layout.ts"),
    "utf8",
  );
  if (/heroPhoto\.caption/.test(emailLayout)) {
    violations.push(
      "src/lib/email-layout.ts renders heroPhoto.caption beneath email photographs",
    );
  }

  const brevoCampaigns = readFileSync(
    path.join(REPO_ROOT, "src", "lib", "brevo-campaigns.ts"),
    "utf8",
  );
  if (/\bheroCaption\b|heroImageCaption(?:En|Es)/.test(brevoCampaigns)) {
    violations.push(
      "src/lib/brevo-campaigns.ts renders visible hero photo captions in newsletter HTML",
    );
  }

  const emailSequences = readFileSync(
    path.join(REPO_ROOT, "src", "data", "email-sequences.ts"),
    "utf8",
  );
  if (/\bheroImageCaption\b/.test(emailSequences)) {
    violations.push(
      "src/data/email-sequences.ts defines heroImageCaption explanations for email images",
    );
  }

  const newsletterIssues = readFileSync(
    path.join(REPO_ROOT, "src", "data", "newsletter-issues.ts"),
    "utf8",
  );
  if (/\bheroImageCaption(?:En|Es)?\b/.test(newsletterIssues)) {
    violations.push(
      "src/data/newsletter-issues.ts defines heroImageCaption explanations for newsletter images",
    );
  }

  assert.deepEqual(
    violations,
    [],
    `Found forbidden visible image explanations or captions:\n${violations.join("\n")}`,
  );
});

test("Pages and breadcrumbs omit horizontal dividing lines (matching /manufacturing)", () => {
  const violations: string[] = [];

  const viewFiles = collectFilesByExt(path.join(REPO_ROOT, "src", "views"), [
    ".tsx",
  ]);
  for (const filePath of viewFiles) {
    const rel = path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
    const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index] ?? "";
      if (/<hr\b/.test(line)) {
        violations.push(`${rel}:${index + 1} renders an <hr> dividing line`);
      }
      if (/\bborder-(?:t|b|y)\b/.test(line)) {
        violations.push(
          `${rel}:${index + 1} declares a horizontal dividing line (${line.trim()})`,
        );
      }
    }
  }

  const componentFiles = collectFilesByExt(
    path.join(REPO_ROOT, "src", "components"),
    [".tsx"],
  );
  for (const filePath of [...viewFiles, ...componentFiles]) {
    const rel = path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
    const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index] ?? "";
      if (!/Breadcrumb|Ruta de navegación/.test(line)) {
        continue;
      }
      const surrounding = lines
        .slice(Math.max(0, index - 3), index + 3)
        .join("\n");
      if (/\bborder-(?:t|b|y)\b/.test(surrounding)) {
        violations.push(
          `${rel}:${index + 1} breadcrumb wrapper declares a horizontal dividing line`,
        );
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found forbidden horizontal dividing lines across pages or breadcrumbs:\n${violations.join("\n")}`,
  );
});

test("ClosingConversationSection guards desktop/iPad-landscape scroll pinning safely for touch, reduced motion, and text zoom", () => {
  const closingPath = path.join(
    REPO_ROOT,
    "src",
    "components",
    "home",
    "closing-conversation-section.tsx",
  );
  const closingSource = readFileSync(closingPath, "utf8");

  assert.match(
    closingSource,
    /min-width:\s*64rem/,
    "ClosingConversationSection must stay unpinned on phones and portrait tablets (< 64rem)",
  );
  assert.match(
    closingSource,
    /min-height:\s*35rem/,
    "ClosingConversationSection must stay unpinned on ultra-short landscape viewports",
  );
  assert.match(
    closingSource,
    /prefers-reduced-motion:\s*reduce/,
    "ClosingConversationSection must disable pinning under prefers-reduced-motion",
  );
  assert.match(
    closingSource,
    /useTextZoomGuard/,
    "ClosingConversationSection must unpin under browser text zoom",
  );
});

test("Page views omit Tailwind drop shadows on resting cards and containers", () => {
  const viewFiles = collectFilesByExt(path.join(REPO_ROOT, "src", "views"), [
    ".tsx",
  ]);
  const violations: string[] = [];

  for (const filePath of viewFiles) {
    const rel = path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
    const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index] ?? "";
      if (/\bshadow-/.test(line)) {
        violations.push(
          `${rel}:${index + 1} declares a Tailwind drop shadow (${line.trim()})`,
        );
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found forbidden Tailwind drop shadows in resting page views:\n${violations.join("\n")}`,
  );
});

test("Standard page sections omit uppercase eyebrow kickers above h1, h2, and h3 headings", () => {
  const viewFiles = collectFilesByExt(path.join(REPO_ROOT, "src", "views"), [
    ".tsx",
  ]);
  const violations: string[] = [];

  for (const filePath of viewFiles) {
    const rel = path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
    const source = readFileSync(filePath, "utf8");
    const lines = source.split(/\r?\n/);

    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index] ?? "";
      if (/tracking-\[var\(--tracking-eyebrow\)\]/.test(line)) {
        violations.push(
          `${rel}:${index + 1} uses --tracking-eyebrow for a section eyebrow`,
        );
      }
      const headingMatch = /<(h[123])\b/.exec(line);
      if (headingMatch) {
        const preceding = lines.slice(Math.max(0, index - 5), index).join("\n");
        if (/<p\b[^>]*\buppercase\b[\s\S]*?<\/p>\s*$/.test(preceding.trim())) {
          violations.push(
            `${rel}:${index + 1} renders an uppercase <p> eyebrow immediately before <${headingMatch[1]}>`,
          );
        }
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found forbidden uppercase section eyebrows above <h1>/<h2>/<h3> headings:\n${violations.join("\n")}`,
  );
});

test("Web views and components never use font-mono or raw <code> tags", () => {
  const tsxFiles = [
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "views"), [".tsx"]),
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "components"), [".tsx"]),
  ];
  const violations: string[] = [];

  for (const filePath of tsxFiles) {
    const rel = path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
    const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index] ?? "";
      if (/\bfont-mono\b/.test(line)) {
        violations.push(`${rel}:${index + 1} uses banned font-mono utility`);
      }
      if (/<code\b/.test(line)) {
        violations.push(`${rel}:${index + 1} renders a banned <code> element`);
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found banned font-mono or <code> usage in web UI:\n${violations.join("\n")}`,
  );
});

test("Data, views, and components never reference banned Snoby or AI-generated imagery", () => {
  const bannedAssetPattern =
    /striped-cotton-bag-linings-leather-straps\.jpg|textile-home-decor\.jpg|alma-studio-team-dust-bags-india\.jpeg|cognac-black-leather-pouches-cutting-table\.jpg|export-pallet-delivery-spain\.jpeg|atelier-swatches-table\.jpg|pexels-1433506698-32439566\.jpg|pexels-pavel-danilyuk-6461490\.jpg|pexels-andrzej-gdula-177638374-11441230\.jpg/i;
  const snobyPattern = /\bsnoby\b/i;

  const targetFiles = [
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "data"), [".ts", ".tsx"]),
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "views"), [".ts", ".tsx"]),
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "components"), [
      ".ts",
      ".tsx",
    ]),
  ];
  const violations: string[] = [];

  for (const filePath of targetFiles) {
    const rel = path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
    const source = readFileSync(filePath, "utf8");
    const assetMatch = bannedAssetPattern.exec(source);
    if (assetMatch) {
      violations.push(
        `${rel} references banned or AI-generated image asset: ${assetMatch[0]}`,
      );
    }
    if (snobyPattern.test(source)) {
      violations.push(`${rel} contains confidential client name "snoby"`);
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found banned client-branded or AI assets in src:\n${violations.join("\n")}`,
  );
});

test("High-contrast SectionBridge seams declare size='gentle' site-wide", () => {
  const tsxFiles = [
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "views"), [".tsx"]),
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "components"), [".tsx"]),
  ];
  const violations: string[] = [];

  for (const filePath of tsxFiles) {
    const rel = path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
    const source = readFileSync(filePath, "utf8");
    for (const match of source.matchAll(/<SectionBridge\b([\s\S]*?)\/>/g)) {
      const props = match[1] ?? "";
      const fromMatch = /\bfrom="([^"]+)"/.exec(props);
      const toMatch = /\bto="([^"]+)"/.exec(props);
      if (!fromMatch?.[1] || !toMatch?.[1]) {
        continue;
      }
      const isHighContrast =
        LIGHT_SURFACES.has(fromMatch[1]) !== LIGHT_SURFACES.has(toMatch[1]);
      if (isHighContrast && !/\bsize="gentle"/.test(props)) {
        violations.push(
          `${rel} renders high-contrast SectionBridge (${fromMatch[1]}->${toMatch[1]}) without size="gentle"`,
        );
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found high-contrast SectionBridge seams missing size="gentle":\n${violations.join("\n")}`,
  );
});

test("Inline editorial navigation links use shipped SVG arrows instead of Unicode arrows", () => {
  const targetFiles = [
    ...collectFilesByExt(path.join(REPO_ROOT, "src", "views"), [".tsx"]),
    ...collectFilesByExt(
      path.join(REPO_ROOT, "src", "components", "showcases"),
      [".tsx"],
    ),
  ];
  const violations: string[] = [];
  const linkRegex = /<(?:Link|a)\b[\s\S]*?<\/(?:Link|a)>/g;

  for (const filePath of targetFiles) {
    const rel = path.relative(REPO_ROOT, filePath).replaceAll("\\", "/");
    const source = readFileSync(filePath, "utf8");
    for (const match of source.matchAll(linkRegex)) {
      if (/[→←]/.test(match[0])) {
        violations.push(
          `${rel} uses a raw Unicode arrow inside an inline link instead of .editorial-arrow-link SVG`,
        );
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found raw Unicode arrows inside editorial navigation links:\n${violations.join("\n")}`,
  );
});

test("Editorial photo frames tint inset outlines with --color-night instead of neutral black", () => {
  const globalsPath = path.join(REPO_ROOT, "src", "app", "globals.css");
  const globalsRaw = readFileSync(globalsPath, "utf8").replace(
    /\/\*[\s\S]*?\*\//g,
    "",
  );
  const violations: string[] = [];

  if (/oklch\(\s*0\s+0\s+0\b/.test(globalsRaw)) {
    violations.push(
      "src/app/globals.css uses neutral black oklch(0 0 0 / ...) instead of color-mix() over --color-night",
    );
  }

  for (const selectorName of [".editorial-photo-frame", ".study-sharp-photo"]) {
    const regex = new RegExp(
      `${selectorName.replace(".", "\\.")}\\s*\\{([^}]+)\\}`,
    );
    const match = regex.exec(globalsRaw);
    const declarations = match?.[1] ?? "";
    if (
      !/outline\s*:\s*1px\s+solid\s+color-mix\([^;]*var\(--color-night\)/.test(
        declarations,
      )
    ) {
      violations.push(
        `src/app/globals.css (${selectorName}) must use a warm 1px color-mix(--color-night) inset outline`,
      );
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found neutral-black or missing warm inset outlines on editorial photo frames:\n${violations.join("\n")}`,
  );
});

test("Public policies and form badges never expose internal keys or vendor stacks", () => {
  const checkedFiles = [
    "src/data/legal-content.ts",
    "src/views/cookie-policy-client.tsx",
    "src/views/privacy-policy-client.tsx",
    "src/components/forms/turnstile-field.tsx",
    "src/components/forms/contact-form.tsx",
    "src/components/forms/newsletter-form.tsx",
  ];
  const forbidden =
    /\b(?:kr_chat_session|karmarise-language|karmarise-cookie-consent|cf-ipcountry|@cf\/meta\/llama|Protected by Cloudflare|Protegido por Cloudflare|Verified · Cloudflare|Verificado · Cloudflare)\b/;
  const violations: string[] = [];

  for (const rel of checkedFiles) {
    const src = readFileSync(path.join(REPO_ROOT, rel), "utf8");
    const hit = forbidden.exec(src);
    if (hit) {
      violations.push(`${rel} contains forbidden public token: ${hit[0]}`);
    }
  }

  assert.deepEqual(
    violations,
    [],
    `Found internal keys or vendor names in public copy:\n${violations.join("\n")}`,
  );
});

test("ResponsibilityStages clears inline panel props and hides inactive pinned panels", () => {
  const src = readFileSync(
    path.join(
      REPO_ROOT,
      "src",
      "components",
      "how-we-work",
      "responsibility-stages.tsx",
    ),
    "utf8",
  );
  assert.match(src, /clearProps:\s*"transform,opacity"/);
  assert.match(src, /\binvisible\b/);
  assert.match(src, /\bpointer-events-none\b/);
});
