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

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://karmarisedglobal.com"
).replace(/\/$/, "");

const EMAIL_ASSET_BASE = SITE_URL.includes("localhost")
  ? "https://karmarisedglobal.com"
  : SITE_URL;

async function brevoRequest(endpoint, options = {}, customApiKey) {
  const key = customApiKey || process.env.BREVO_API_KEY?.trim();
  const url = `https://api.brevo.com/v3${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "api-key": key,
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  return { ok: response.ok, status: response.status, data };
}

// 1. Ensure Contact Attributes
async function ensureAttributes() {
  console.log("1. Checking contact attributes...");
  const existingRes = await brevoRequest("/contacts/attributes");
  const existingNames = new Set(
    (existingRes.data?.attributes || []).map((attr) =>
      String(attr.name).toUpperCase(),
    ),
  );

  const desiredAttributes = [
    { name: "FIRSTNAME", type: "text" },
    { name: "COMPANY", type: "text" },
    { name: "LANGUAGE", type: "text" },
    { name: "COUNTRY", type: "text" },
    { name: "CUSTOMER_TYPE", type: "text" },
    { name: "CONSENT_STATUS", type: "text" },
    { name: "CONSENT_DATE", type: "text" },
    { name: "SOURCE", type: "text" },
    { name: "INTEREST", type: "text" },
    { name: "PRIMARY_TRACK", type: "text" },
    { name: "UTM_SOURCE", type: "text" },
    { name: "UTM_MEDIUM", type: "text" },
    { name: "UTM_CAMPAIGN", type: "text" },
    { name: "UTM_CONTENT", type: "text" },
    { name: "REFERRAL_SOURCE", type: "text" },
    { name: "REFERRAL_CODE", type: "text" },
  ];

  for (const attr of desiredAttributes) {
    if (existingNames.has(attr.name)) {
      console.log(`   - Attribute ${attr.name} already exists.`);
      continue;
    }
    const res = await brevoRequest(
      `/contacts/attributes/normal/${encodeURIComponent(attr.name)}`,
      {
        method: "POST",
        body: JSON.stringify({ type: attr.type }),
      },
    );
    if (res.ok || res.status === 204) {
      console.log(`   + Created attribute ${attr.name} (${attr.type}).`);
    } else {
      console.warn(
        `   ! Could not create attribute ${attr.name}:`,
        res.status,
        res.data,
      );
    }
  }
}

// 2. Ensure Folder & Lists (Master, EN, ES, plus 2 topic tracks x 2 languages)
async function ensureFolderAndLists() {
  console.log("\n2. Checking folders and subscriber lists...");
  const folderName =
    process.env.BREVO_FOLDER_NAME?.trim() || "KarmaRise D Global";

  const foldersRes = await brevoRequest("/contacts/folders?limit=50&offset=0");
  const folders = foldersRes.data?.folders || [];
  let folder = folders.find(
    (f) => String(f?.name || "").toLowerCase() === folderName.toLowerCase(),
  );

  if (!folder) {
    const createFolderRes = await brevoRequest("/contacts/folders", {
      method: "POST",
      body: JSON.stringify({ name: folderName }),
    });
    if (createFolderRes.ok && createFolderRes.data?.id) {
      folder = { id: createFolderRes.data.id, name: folderName };
      console.log(`   + Created folder "${folder.name}" (ID: ${folder.id}).`);
    } else {
      folder = folders[0] || { id: 1, name: "Default" };
      console.log(`   - Using existing folder ID ${folder.id}.`);
    }
  } else {
    console.log(
      `   - Found existing folder "${folder.name}" (ID: ${folder.id}).`,
    );
  }

  const listsRes = await brevoRequest("/contacts/lists?limit=50&offset=0");
  const existingLists = listsRes.data?.lists || [];

  const desiredLists = [
    {
      key: "master",
      envId: Number.parseInt(process.env.BREVO_LIST_ID || "", 10),
      name: "KarmaRise Stories Master",
    },
    {
      key: "en",
      envId: Number.parseInt(process.env.BREVO_LIST_ID_EN || "", 10),
      name: "KarmaRise Stories (EN)",
    },
    {
      key: "es",
      envId: Number.parseInt(process.env.BREVO_LIST_ID_ES || "", 10),
      name: "KarmaRise Stories (ES)",
    },
    {
      key: "manufacturingEn",
      envId: Number.parseInt(
        process.env.BREVO_LIST_ID_MANUFACTURING_EN || "",
        10,
      ),
      name: "KarmaRise Stories - Manufacturing (EN)",
    },
    {
      key: "manufacturingEs",
      envId: Number.parseInt(
        process.env.BREVO_LIST_ID_MANUFACTURING_ES || "",
        10,
      ),
      name: "KarmaRise Stories - Manufacturing (ES)",
    },
    {
      key: "almariseEn",
      envId: Number.parseInt(process.env.BREVO_LIST_ID_ALMARISE_EN || "", 10),
      name: "KarmaRise Stories - AlmaRise D Brand & Culture (EN)",
    },
    {
      key: "almariseEs",
      envId: Number.parseInt(process.env.BREVO_LIST_ID_ALMARISE_ES || "", 10),
      name: "KarmaRise Stories - AlmaRise D Brand & Culture (ES)",
    },
  ];

  const resolvedLists = {};

  for (const item of desiredLists) {
    const found =
      existingLists.find(
        (l) => Number.isFinite(item.envId) && l.id === item.envId,
      ) ||
      existingLists.find(
        (l) => String(l?.name || "").toLowerCase() === item.name.toLowerCase(),
      );

    if (found) {
      if (found.name !== item.name) {
        const renameRes = await brevoRequest(`/contacts/lists/${found.id}`, {
          method: "PUT",
          body: JSON.stringify({ name: item.name }),
        });
        if (renameRes.ok || renameRes.status === 204) {
          console.log(
            `   * Renamed list "${found.name}" -> "${item.name}" (ID: ${found.id}).`,
          );
        } else {
          console.warn(
            `   ! Could not rename list "${found.name}" (ID: ${found.id}):`,
            renameRes.status,
            renameRes.data,
          );
        }
      } else {
        console.log(`   - Found list "${found.name}" (ID: ${found.id}).`);
      }
      resolvedLists[item.key] = found.id;
      continue;
    }

    const createListRes = await brevoRequest("/contacts/lists", {
      method: "POST",
      body: JSON.stringify({
        name: item.name,
        folderId: folder.id,
      }),
    });

    if (createListRes.ok && createListRes.data?.id) {
      resolvedLists[item.key] = createListRes.data.id;
      console.log(
        `   + Created list "${item.name}" (ID: ${createListRes.data.id}).`,
      );
    } else {
      console.warn(
        `   ! Could not create list "${item.name}":`,
        createListRes.status,
        createListRes.data,
      );
    }
  }

  return resolvedLists;
}

// 2b. Ensure internal editorial inbox is on the lists so Brevo campaign drafts bind to target lists even before public signups
async function ensureInternalPreviewContact(lists) {
  const email =
    process.env.BREVO_REPLY_TO_EMAIL?.trim() ||
    process.env.BREVO_SENDER_EMAIL?.trim() ||
    "stories@karmarisedglobal.com";
  const allListIds = Object.values(lists).filter(
    (id) => typeof id === "number" && id > 0,
  );
  if (!email || allListIds.length === 0) {
    return;
  }

  const res = await brevoRequest("/contacts", {
    method: "POST",
    body: JSON.stringify({
      email,
      attributes: {
        FIRSTNAME: "KarmaRise Editorial",
        LANGUAGE: "EN",
        CUSTOMER_TYPE: "Internal Preview",
        CONSENT_STATUS: "Yes",
        SOURCE: "Brevo Setup",
        INTEREST: "Manufacturing & AlmaRise D Brand",
      },
      listIds: allListIds,
      updateEnabled: true,
      emailBlacklisted: false,
    }),
  });

  if (res.ok || res.status === 204) {
    console.log(
      `   + Linked internal inbox <${email}> to ${allListIds.length} lists for draft binding & previews.`,
    );
  } else {
    console.warn(
      `   ! Could not link internal inbox <${email}>:`,
      res.status,
      res.data,
    );
  }
}

// 3. Resolve Active Sender
async function resolveSender() {
  console.log("\n3. Checking verified senders in Brevo...");
  const senderKey =
    process.env.BREVO_FULLACESS_API_KEY?.trim() ||
    process.env.BREVO_API_KEY?.trim();
  const sendersRes = await brevoRequest("/senders", {}, senderKey);
  const allSenders = sendersRes.data?.senders || [];
  const activeSenders = allSenders.filter((s) => s.active);

  if (activeSenders.length > 0) {
    const preferred =
      activeSenders.find(
        (s) => s.email.toLowerCase() === "stories@karmarisedglobal.com",
      ) ||
      activeSenders.find(
        (s) => s.email.toLowerCase() === "hola@karmarisedglobal.com",
      ) ||
      activeSenders.find((s) =>
        s.email.toLowerCase().endsWith("@karmarisedglobal.com"),
      ) ||
      activeSenders[0];

    console.log(
      `   - Using active sender: "${preferred.name}" <${preferred.email}> (ID: ${preferred.id})`,
    );
    return preferred;
  }

  return {
    name:
      process.env.BREVO_SENDER_NAME?.trim() ||
      "Alma & Shirish · KarmaRise D Global",
    email:
      process.env.BREVO_SENDER_EMAIL?.trim() || "stories@karmarisedglobal.com",
  };
}

// 3b. Upload email brand assets to Sanity CDN so Brevo previews & emails load them immediately
export async function ensureEmailAssetsOnCdn() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
  const sanityToken = process.env.SANITY_API_KEY?.trim();

  const fallbackAssets = {
    logoUrl: `${EMAIL_ASSET_BASE}/brand/main-logo-transparent.png`,
    heroImageUrl: `${EMAIL_ASSET_BASE}/images/client/client%202.jpeg`,
  };

  if (!projectId || !sanityToken) {
    return fallbackAssets;
  }

  console.log("\n3b. Uploading logo & hero photograph to Sanity CDN...");

  async function uploadAsset(localRelativePath, contentType, filename) {
    const fullPath = path.resolve(process.cwd(), localRelativePath);
    if (!fs.existsSync(fullPath)) {
      return null;
    }
    const buffer = fs.readFileSync(fullPath);
    const url = `https://${projectId}.api.sanity.io/v2025-01-01/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sanityToken}`,
        "Content-Type": contentType,
      },
      body: buffer,
    });
    if (!res.ok) {
      return null;
    }
    const json = await res.json();
    return json.document?.url || null;
  }

  const [logoCdnUrl, heroCdnUrl] = await Promise.all([
    uploadAsset(
      "public/brand/main-logo-transparent.png",
      "image/png",
      "karmarise-main-logo.png",
    ),
    uploadAsset(
      "public/images/client/client 2.jpeg",
      "image/jpeg",
      "alma-shirish-working-together-india.jpg",
    ),
  ]);

  if (logoCdnUrl) {
    console.log(`   + Hosted logo on Sanity CDN: ${logoCdnUrl}`);
  }
  if (heroCdnUrl) {
    console.log(`   + Hosted hero image on Sanity CDN: ${heroCdnUrl}`);
  }

  return {
    logoUrl: logoCdnUrl
      ? `${logoCdnUrl}?w=260&auto=format`
      : fallbackAssets.logoUrl,
    heroImageUrl: heroCdnUrl
      ? `${heroCdnUrl}?w=1100&q=85&auto=format`
      : fallbackAssets.heroImageUrl,
  };
}

// 4. Create or Update the Two Welcome Templates via canonical `renderAutomatedSequenceEmail()`
async function ensureWelcomeTemplates(sender, assets) {
  console.log(
    "\n4. Syncing Welcome Email 1 templates via canonical renderer...",
  );

  const welcomeTemplate = automatedEmailTemplates.find(
    (tpl) => tpl.id === "welcome-01",
  );
  if (!welcomeTemplate) {
    console.error("   ! Could not locate welcome-01 in email-sequences.ts");
    return {};
  }

  const existingRes = await brevoRequest("/smtp/templates?limit=50&offset=0");
  const existingTemplates = existingRes.data?.templates || [];

  const syncedIds = {};

  for (const lang of ["en", "es"]) {
    const rendered = renderAutomatedSequenceEmail(welcomeTemplate, lang, {
      siteBaseUrl: EMAIL_ASSET_BASE,
      logoUrl: assets.logoUrl,
      heroImageUrl: assets.heroImageUrl,
      previewMode: false,
    });

    const envKey =
      lang === "es" ? welcomeTemplate.envIdKeyEs : welcomeTemplate.envIdKeyEn;
    const envId = envKey
      ? Number.parseInt(process.env[envKey] || "", 10)
      : Number.NaN;

    const existing =
      existingTemplates.find((t) => Number.isFinite(envId) && t.id === envId) ||
      existingTemplates.find(
        (t) =>
          String(t?.name || "").toLowerCase() ===
          rendered.templateName.toLowerCase(),
      );

    const payload = {
      templateName: rendered.templateName,
      subject: rendered.subject,
      sender: {
        name: rendered.senderName,
        email: sender.email,
      },
      replyTo: sender.email,
      htmlContent: rendered.html,
      isActive: true,
    };

    if (existing) {
      const updateRes = await brevoRequest(`/smtp/templates/${existing.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (updateRes.ok || updateRes.status === 204) {
        syncedIds[lang] = existing.id;
        console.log(
          `   * Updated & activated template "${rendered.templateName}" (ID: ${existing.id}).`,
        );
      } else {
        console.error(
          `   ! Failed to update template "${rendered.templateName}":`,
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
        syncedIds[lang] = createRes.data.id;
        console.log(
          `   + Created & activated template "${rendered.templateName}" (ID: ${createRes.data.id}).`,
        );
      } else {
        console.error(
          `   ! Failed to create template "${rendered.templateName}":`,
          createRes.status,
          createRes.data,
        );
      }
    }
  }

  return syncedIds;
}

export async function runBrevoSetup() {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    console.error("BREVO_API_KEY is missing in .env");
    process.exit(1);
  }

  await ensureAttributes();
  const lists = await ensureFolderAndLists();
  await ensureInternalPreviewContact(lists);
  const sender = await resolveSender();
  const assets = await ensureEmailAssetsOnCdn();
  const templates = await ensureWelcomeTemplates(sender, assets);

  console.log("\n--- Brevo Setup Summary ---");
  console.log(`Master List ID (BREVO_LIST_ID): ${lists.master ?? "N/A"}`);
  console.log(`English List ID (BREVO_LIST_ID_EN): ${lists.en ?? "N/A"}`);
  console.log(`Spanish List ID (BREVO_LIST_ID_ES): ${lists.es ?? "N/A"}`);
  console.log(
    `Manufacturing EN List ID (BREVO_LIST_ID_MANUFACTURING_EN): ${lists.manufacturingEn ?? "N/A"}`,
  );
  console.log(
    `Manufacturing ES List ID (BREVO_LIST_ID_MANUFACTURING_ES): ${lists.manufacturingEs ?? "N/A"}`,
  );
  console.log(
    `AlmaRise D Brand & Culture EN List ID (BREVO_LIST_ID_ALMARISE_EN): ${lists.almariseEn ?? "N/A"}`,
  );
  console.log(
    `AlmaRise D Brand & Culture ES List ID (BREVO_LIST_ID_ALMARISE_ES): ${lists.almariseEs ?? "N/A"}`,
  );
  console.log(`Welcome Template EN ID: ${templates.en ?? "N/A"}`);
  console.log(`Welcome Template ES ID: ${templates.es ?? "N/A"}`);

  const envFilePath = path.resolve(process.cwd(), ".env");
  if (fs.existsSync(envFilePath)) {
    let envContent = fs.readFileSync(envFilePath, "utf8");
    const envUpdates = {
      ...(lists.master ? { BREVO_LIST_ID: String(lists.master) } : {}),
      ...(lists.en ? { BREVO_LIST_ID_EN: String(lists.en) } : {}),
      ...(lists.es ? { BREVO_LIST_ID_ES: String(lists.es) } : {}),
      ...(lists.manufacturingEn
        ? { BREVO_LIST_ID_MANUFACTURING_EN: String(lists.manufacturingEn) }
        : {}),
      ...(lists.manufacturingEs
        ? { BREVO_LIST_ID_MANUFACTURING_ES: String(lists.manufacturingEs) }
        : {}),
      ...(lists.almariseEn
        ? { BREVO_LIST_ID_ALMARISE_EN: String(lists.almariseEn) }
        : {}),
      ...(lists.almariseEs
        ? { BREVO_LIST_ID_ALMARISE_ES: String(lists.almariseEs) }
        : {}),
      ...(templates.en
        ? { BREVO_WELCOME_TEMPLATE_ID_EN: String(templates.en) }
        : {}),
      ...(templates.es
        ? { BREVO_WELCOME_TEMPLATE_ID_ES: String(templates.es) }
        : {}),
    };

    for (const [key, val] of Object.entries(envUpdates)) {
      const regex = new RegExp(`^${key}=.*$`, "m");
      if (regex.test(envContent)) {
        envContent = envContent.replace(regex, `${key}=${val}`);
      } else {
        envContent = `${envContent.trimEnd()}\n${key}=${val}\n`;
      }
    }
    fs.writeFileSync(envFilePath, envContent, "utf8");
    console.log("Synced list and template IDs into .env.");
  }

  return { lists, sender, assets, templates };
}

const isDirectExecution =
  process.argv[1] &&
  import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href;

if (isDirectExecution) {
  await runBrevoSetup();
}
