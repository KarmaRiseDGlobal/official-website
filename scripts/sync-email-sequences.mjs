import fs from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const SRC_ROOT = path.join(REPO_ROOT, "src");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }
  const lines = fs.readFileSync(filePath, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const index = line.indexOf("=");
    const key = line.slice(0, index).trim();
    const rawValue = line.slice(index + 1).trim();
    const value = rawValue.replace(/^['"]|['"]$/g, "");
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.join(REPO_ROOT, ".env"));
loadEnvFile(path.join(REPO_ROOT, ".env.local"));

const CANDIDATE_EXTENSIONS = [
  "",
  ".ts",
  ".tsx",
  ".mts",
  ".mjs",
  ".js",
  "/index.ts",
  "/index.tsx",
];

function resolveCandidateFile(basePath) {
  for (const suffix of CANDIDATE_EXTENSIONS) {
    const candidate = `${basePath}${suffix}`;
    if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
      return pathToFileURL(candidate).href;
    }
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return { shortCircuit: true, url: "data:text/javascript,export {};" };
    }
    if (specifier.startsWith("@/")) {
      const resolvedUrl = resolveCandidateFile(
        path.join(SRC_ROOT, specifier.slice(2)),
      );
      if (resolvedUrl) {
        return { shortCircuit: true, url: resolvedUrl };
      }
    }
    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      context.parentURL?.startsWith(pathToFileURL(SRC_ROOT).href)
    ) {
      const parentDir = path.dirname(fileURLToPath(context.parentURL));
      const resolvedUrl = resolveCandidateFile(
        path.resolve(parentDir, specifier),
      );
      if (resolvedUrl) {
        return { shortCircuit: true, url: resolvedUrl };
      }
    }
    return nextResolve(specifier, context);
  },
});

const { automatedEmailTemplates } = await import("@/data/email-sequences");
const { renderAutomatedSequenceEmail } = await import("@/lib/brevo-sequences");

const dryRun = process.argv.includes("--dry-run");
const SANITY_API_VERSION = "2025-01-01";
const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const sanityDataset =
  process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
const sanityToken = process.env.SANITY_API_KEY?.trim();

function inferContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  return "image/jpeg";
}

async function uploadImageToSanity(localPublicPath) {
  if (!sanityProjectId || !sanityToken) {
    return null;
  }
  const fullPath = path.join(
    REPO_ROOT,
    "public",
    localPublicPath.replace(/^\/+/, ""),
  );
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  const filename = path.basename(fullPath).replace(/[^a-zA-Z0-9._-]+/g, "-");
  const buffer = fs.readFileSync(fullPath);
  const url = `https://${sanityProjectId}.api.sanity.io/v${SANITY_API_VERSION}/assets/images/${sanityDataset}?filename=${encodeURIComponent(filename)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sanityToken}`,
      "Content-Type": inferContentType(fullPath),
    },
    body: buffer,
  });
  if (!res.ok) {
    return null;
  }
  const json = await res.json();
  return json.document?.url || null;
}

async function brevoRequest(endpoint, options = {}) {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const res = await fetch(`https://api.brevo.com/v3${endpoint}`, {
    ...options,
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }
  return { ok: res.ok, status: res.status, data };
}

async function main() {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!dryRun && !apiKey) {
    console.error("BREVO_API_KEY is missing in .env");
    process.exit(1);
  }

  console.log(
    dryRun
      ? `Dry-run validating ${automatedEmailTemplates.length * 2} automated email templates...`
      : `Syncing ${automatedEmailTemplates.length * 2} automated email templates to Brevo...`,
  );

  let logoCdnUrl = null;
  const heroCdnMap = new Map();

  if (!dryRun && sanityProjectId && sanityToken) {
    const uploadedLogo = await uploadImageToSanity(
      "/brand/main-logo-transparent.png",
    );
    if (uploadedLogo) {
      logoCdnUrl = `${uploadedLogo}?w=260&auto=format`;
    }

    for (const tpl of automatedEmailTemplates) {
      if (!tpl.localHeroImage || heroCdnMap.has(tpl.localHeroImage)) {
        continue;
      }
      const uploadedHero = await uploadImageToSanity(tpl.localHeroImage);
      if (uploadedHero) {
        heroCdnMap.set(
          tpl.localHeroImage,
          `${uploadedHero}?w=1100&q=85&auto=format`,
        );
      }
    }
  }

  const existingTemplates = dryRun
    ? []
    : (await brevoRequest("/smtp/templates?limit=100&offset=0")).data
        ?.templates || [];
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() || "stories@karmarisedglobal.com";

  const synced = [];

  for (const tpl of automatedEmailTemplates) {
    for (const lang of ["en", "es"]) {
      const rendered = renderAutomatedSequenceEmail(tpl, lang, {
        logoUrl: logoCdnUrl || undefined,
        heroImageUrl: tpl.localHeroImage
          ? heroCdnMap.get(tpl.localHeroImage)
          : undefined,
        previewMode: false,
      });

      const replyTo =
        tpl.footerMode === "transactional"
          ? "alma@karmarisedglobal.com"
          : process.env.BREVO_REPLY_TO_EMAIL?.trim() || senderEmail;

      if (dryRun) {
        synced.push({
          key: rendered.templateIdKey,
          name: rendered.templateName,
          subject: rendered.subject,
          id: "dry-run",
        });
        continue;
      }

      const envKey = lang === "es" ? tpl.envIdKeyEs : tpl.envIdKeyEn;
      const envId = envKey
        ? Number.parseInt(process.env[envKey] || "", 10)
        : Number.NaN;

      const existing =
        existingTemplates.find(
          (item) => Number.isFinite(envId) && item.id === envId,
        ) ||
        existingTemplates.find(
          (item) =>
            String(item?.name || "").toLowerCase() ===
            rendered.templateName.toLowerCase(),
        );

      const payload = {
        templateName: rendered.templateName,
        subject: rendered.subject,
        sender: {
          name: rendered.senderName,
          email: senderEmail,
        },
        replyTo,
        htmlContent: rendered.html,
        isActive: true,
      };

      if (existing) {
        const updateRes = await brevoRequest(`/smtp/templates/${existing.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        if (updateRes.ok || updateRes.status === 204) {
          console.log(
            `   * Updated "${rendered.templateName}" (ID: ${existing.id})`,
          );
          synced.push({
            key: rendered.templateIdKey,
            name: rendered.templateName,
            subject: rendered.subject,
            id: existing.id,
          });
        } else {
          console.error(
            `   ! Failed updating "${rendered.templateName}":`,
            updateRes.status,
            updateRes.data,
          );
        }
      } else {
        const createRes = await brevoRequest("/smtp/templates", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        if (createRes.ok && createRes.data?.id) {
          console.log(
            `   + Created "${rendered.templateName}" (ID: ${createRes.data.id})`,
          );
          synced.push({
            key: rendered.templateIdKey,
            name: rendered.templateName,
            subject: rendered.subject,
            id: createRes.data.id,
          });
        } else {
          console.error(
            `   ! Failed creating "${rendered.templateName}":`,
            createRes.status,
            createRes.data,
          );
        }
      }
    }
  }

  console.log(`\nProcessed ${synced.length} automated email templates.`);
}

main().catch((error) => {
  console.error("Automated sequence sync failed:", error);
  process.exit(1);
});
