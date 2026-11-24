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
