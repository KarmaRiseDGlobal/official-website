import { existsSync, statSync } from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const SRC_ROOT = path.join(REPO_ROOT, "src");
const CANDIDATE_EXTENSIONS = [
  "",
  ".ts",
  ".tsx",
  ".mts",
  ".mjs",
  ".js",
  "/index.ts",
  "/index.tsx",
  "/index.mts",
  "/index.mjs",
  "/index.js",
];

let registered = false;

function resolveCandidateFile(basePath: string): string | null {
  for (const suffix of CANDIDATE_EXTENSIONS) {
    const candidate = `${basePath}${suffix}`;
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return pathToFileURL(candidate).href;
    }
  }
  return null;
}

export function registerTestModuleHooks(): void {
  if (registered) {
    return;
  }
  registered = true;

  registerHooks({
    resolve(specifier, context, nextResolve) {
      if (specifier === "server-only") {
        return {
          shortCircuit: true,
          url: "data:text/javascript,export {};",
        };
      }

      if (specifier === "next/server") {
        return nextResolve("next/server.js", context);
      }

      if (specifier.startsWith("@/")) {
        const target = path.join(SRC_ROOT, specifier.slice(2));
        const resolvedUrl = resolveCandidateFile(target);
        if (resolvedUrl) {
          return {
            shortCircuit: true,
            url: resolvedUrl,
          };
        }
      }

      if (
        (specifier.startsWith("./") || specifier.startsWith("../")) &&
        context.parentURL?.startsWith(pathToFileURL(SRC_ROOT).href)
      ) {
        const parentDir = path.dirname(fileURLToPath(context.parentURL));
        const target = path.resolve(parentDir, specifier);
        const resolvedUrl = resolveCandidateFile(target);
        if (resolvedUrl) {
          return {
            shortCircuit: true,
            url: resolvedUrl,
          };
        }
      }

      return nextResolve(specifier, context);
    },
  });
}
