import fs from "node:fs";
import path from "node:path";
import { defineCliConfig } from "sanity/cli";

function readEnvValue(key: string): string {
  const fromProcess = process.env[key]?.trim();
  if (fromProcess) {
    return fromProcess;
  }

  const envPath = path.resolve(process.cwd(), ".env");
  if (!fs.existsSync(envPath)) {
    return "";
  }

  for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const index = line.indexOf("=");
    if (line.slice(0, index).trim() === key) {
      return line
        .slice(index + 1)
        .trim()
        .replace(/^['"]|['"]$/g, "");
    }
  }

  return "";
}

const projectId =
  readEnvValue("SANITY_STUDIO_PROJECT_ID") ||
  readEnvValue("NEXT_PUBLIC_SANITY_PROJECT_ID");
const dataset =
  readEnvValue("SANITY_STUDIO_DATASET") ||
  readEnvValue("NEXT_PUBLIC_SANITY_DATASET") ||
  "production";

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  vite: (config) => ({
    ...config,
    define: {
      ...config.define,
      "process.env.NEXT_PUBLIC_SANITY_PROJECT_ID": JSON.stringify(projectId),
      "process.env.NEXT_PUBLIC_SANITY_DATASET": JSON.stringify(dataset),
      "process.env.SANITY_STUDIO_PROJECT_ID": JSON.stringify(projectId),
      "process.env.SANITY_STUDIO_DATASET": JSON.stringify(dataset),
    },
  }),
});
