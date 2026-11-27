import fs from "node:fs";
import { registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const REPO_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const SRC_ROOT = path.join(REPO_ROOT, "src");
const PREVIEW_DIR = path.join(REPO_ROOT, "output", "newsletter-previews");

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
      return {
        shortCircuit: true,
        url: "data:text/javascript,export {};",
      };
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
const { newsletterIssueDrafts, toSanityNewsletterIssue } =
  await import("@/data/newsletter-issues");
const { renderNewsletterHtml, syncNewsletterIssueToBrevo } =
  await import("@/lib/brevo-campaigns");
const { renderAutomatedSequenceEmail } = await import("@/lib/brevo-sequences");
const {
  buildContactConfirmationEmail,
  buildPreCallPrepEmail,
  buildProductBriefConfirmationEmail,
} = await import("@/lib/transactional-emails");

const args = new Set(process.argv.slice(2));
const previewOnly = args.has("--preview-only");

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

function toLocalPreviewAssetPath(localPublicPath) {
  return `../../public${localPublicPath
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/")}`;
}

async function uploadImageToSanity(localPublicPath) {
  if (!sanityProjectId || !sanityToken) {
    return null;
  }

  const relativePath = localPublicPath.replace(/^\/+/, "");
  const fullPath = path.join(REPO_ROOT, "public", relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`   ! Missing local image: ${fullPath}`);
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
    console.warn(
      `   ! Failed uploading ${localPublicPath} to Sanity (${res.status})`,
    );
    return null;
  }

  const json = await res.json();
  const doc = json.document;
  if (!doc?._id || !doc?.url) {
    return null;
  }

  return {
    assetId: doc._id,
    url: doc.url,
  };
}

async function fetchExistingSanityIssues() {
  if (!sanityProjectId || !sanityToken) {
    return new Map();
  }

  const query = encodeURIComponent(
    '*[_type == "newsletterIssue"]{ _id, brevoCampaignIdEn, brevoCampaignIdEs }',
  );
  const url = `https://${sanityProjectId}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${sanityDataset}?query=${query}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${sanityToken}` },
  });
  if (!res.ok) {
    return new Map();
  }

  const json = await res.json();
  const map = new Map();
  for (const item of json.result || []) {
    if (item?._id) {
      map.set(item._id, item);
    }
  }
  return map;
}

async function fetchExistingSanityStoryIds() {
  if (!sanityProjectId || !sanityToken) {
    return new Set();
  }

  const query = encodeURIComponent('*[_type == "story"]{ _id }');
  const url = `https://${sanityProjectId}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${sanityDataset}?query=${query}`;
  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${sanityToken}` },
  });
  if (!res.ok) {
    return new Set();
  }

  const json = await res.json();
  return new Set((json.result || []).map((item) => item._id).filter(Boolean));
}

async function commitSanityMutations(mutations) {
  if (!sanityProjectId || !sanityToken || mutations.length === 0) {
    return false;
  }

  const url = `https://${sanityProjectId}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${sanityDataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sanityToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mutations }),
  });

  if (!res.ok) {
    console.error(
      `Sanity mutation failed (${res.status}):`,
      await res.text().catch(() => ""),
    );
    return false;
  }

  return true;
}

function buildPreviewGalleryHtml(entries) {
  const itemsJson = JSON.stringify(entries);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>KarmaRise D Global · Email &amp; Newsletter Preview Desk</title>
  <style>
    :root {
      --bg: #eef1ea;
      --panel: #faf6ee;
      --ink: #182d20;
      --muted: #584b44;
      --accent: #833e28;
      --rule: #d4c4aa;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: var(--bg);
      color: var(--ink);
      display: grid;
      grid-template-columns: 360px 1fr;
      min-height: 100vh;
    }
    aside {
      background: var(--panel);
      border-right: 1px solid var(--rule);
      padding: 20px 16px;
      overflow-y: auto;
      max-height: 100vh;
      position: sticky;
      top: 0;
    }
    h1 { font-size: 16px; margin: 0 0 6px; }
    .sub {
      font-size: 12px;
      color: var(--muted);
      margin: 0 0 14px;
      line-height: 1.5;
    }
    .filters {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 14px;
    }
    .filter-btn {
      border: 1px solid var(--rule);
      background: #fff;
      color: var(--ink);
      font-size: 11px;
      font-weight: 600;
      padding: 6px 10px;
      border-radius: 999px;
      cursor: pointer;
    }
    .filter-btn.active {
      background: var(--ink);
      color: #fff;
      border-color: var(--ink);
    }
    .list { display: grid; gap: 8px; }
    .card {
      text-align: left;
      border: 1px solid var(--rule);
      background: #fff;
      border-radius: 10px;
      padding: 10px 12px;
      cursor: pointer;
      display: grid;
      gap: 4px;
    }
    .card.active {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px rgba(189, 112, 87, 0.22);
    }
    .meta {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--accent);
    }
    .subject { font-size: 13px; font-weight: 600; color: var(--ink); }
    .preview-txt { font-size: 11.5px; color: var(--muted); }
    main {
      display: flex;
      flex-direction: column;
      padding: 18px 24px 32px;
      gap: 14px;
    }
    .toolbar {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      background: var(--panel);
      border: 1px solid var(--rule);
      border-radius: 12px;
      padding: 12px 16px;
    }
    .inbox-bar { display: grid; gap: 2px; }
    .inbox-sender { font-size: 12px; color: var(--muted); }
    .inbox-subject { font-size: 15px; font-weight: 700; }
    .inbox-preview { font-size: 12.5px; color: var(--muted); }
    .viewport-btns { display: flex; gap: 6px; align-items: center; }
    .stage {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }
    iframe {
      border: 1px solid var(--rule);
      border-radius: 14px;
      background: #d9dfd3;
      height: calc(100vh - 140px);
      min-height: 640px;
      transition: width 180ms ease;
      width: 680px;
    }
    iframe.mobile { width: 390px; }
    @media (max-width: 960px) {
      body { grid-template-columns: 1fr; }
      aside { position: static; max-height: none; }
      iframe { width: 100% !important; }
    }
  </style>
</head>
<body>
  <aside>
    <h1>KarmaRise D Global · Email Desk</h1>
    <p class="sub">Complete bilingual library (${entries.length} EN &amp; ES previews): Welcome sequence (W1 to W5), B2B follow-up &amp; transactional receipts, Re-engagement (R1 to R3), and 16 biweekly newsletters.</p>
    <div class="filters">
      <button class="filter-btn active" data-filter="all">All (${entries.length})</button>
      <button class="filter-btn" data-filter="welcome">Welcome</button>
      <button class="filter-btn" data-filter="transactional">Transactional</button>
      <button class="filter-btn" data-filter="lead-followup">Follow-up</button>
      <button class="filter-btn" data-filter="reengagement">Re-engagement</button>
      <button class="filter-btn" data-filter="season-1">Issues #01-#08</button>
      <button class="filter-btn" data-filter="season-2">Issues #09-#16</button>
      <button class="filter-btn" data-filter="en">EN</button>
      <button class="filter-btn" data-filter="es">ES</button>
      <button class="filter-btn" data-filter="alma">Alma</button>
      <button class="filter-btn" data-filter="shirish">Shirish</button>
    </div>
    <div class="list" id="email-list"></div>
  </aside>
  <main>
    <div class="toolbar">
      <div class="inbox-bar">
        <div class="inbox-sender" id="tb-sender"></div>
        <div class="inbox-subject" id="tb-subject"></div>
        <div class="inbox-preview" id="tb-preview"></div>
      </div>
      <div class="viewport-btns">
        <button class="filter-btn active" id="btn-desktop">Desktop (680px)</button>
        <button class="filter-btn" id="btn-mobile">Mobile (390px)</button>
        <a class="filter-btn" id="btn-raw" target="_blank" style="text-decoration:none;">Open file</a>
      </div>
    </div>
    <div class="stage">
      <iframe id="preview-frame" title="Email preview"></iframe>
    </div>
  </main>
  <script>
    const ITEMS = ${itemsJson};
    let activeFilter = "all";
    let activeIndex = 0;

    const listEl = document.getElementById("email-list");
    const frameEl = document.getElementById("preview-frame");
    const senderEl = document.getElementById("tb-sender");
    const subjectEl = document.getElementById("tb-subject");
    const previewEl = document.getElementById("tb-preview");
    const rawLink = document.getElementById("btn-raw");

    function renderList() {
      listEl.innerHTML = "";
      ITEMS.forEach((item, idx) => {
        const matches =
          activeFilter === "all" ||
          item.kind === activeFilter ||
          item.season === activeFilter ||
          item.narrator === activeFilter ||
          item.lang === activeFilter;
        if (!matches) return;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "card" + (idx === activeIndex ? " active" : "");
        btn.innerHTML =
          '<span class="meta">' + item.badge + '</span>' +
          '<span class="subject">' + item.subject + '</span>' +
          '<span class="preview-txt">' + item.preview + '</span>';
        btn.addEventListener("click", () => selectItem(idx));
        listEl.appendChild(btn);
      });
    }

    function selectItem(idx) {
      activeIndex = idx;
      const item = ITEMS[idx];
      if (!item) return;
      senderEl.textContent = "From: " + item.sender + " · " + item.timing + (item.brevoId ? " · Brevo Draft #" + item.brevoId : "");
      subjectEl.textContent = item.subject + " (" + item.subject.length + " chars)";
      previewEl.textContent = "Preview (" + item.preview.length + " chars): " + item.preview;
      frameEl.src = item.filename;
      rawLink.href = item.filename;
      renderList();
    }

    document.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.getAttribute("data-filter");
        document.querySelectorAll("[data-filter]").forEach((b) => b.classList.toggle("active", b === btn));
        renderList();
      });
    });

    const btnDesktop = document.getElementById("btn-desktop");
    const btnMobile = document.getElementById("btn-mobile");
    btnDesktop.addEventListener("click", () => {
      frameEl.classList.remove("mobile");
      btnDesktop.classList.add("active");
      btnMobile.classList.remove("active");
    });
    btnMobile.addEventListener("click", () => {
      frameEl.classList.add("mobile");
      btnMobile.classList.add("active");
      btnDesktop.classList.remove("active");
    });

    selectItem(0);
  </script>
</body>
</html>`;
}

async function main() {
  fs.mkdirSync(PREVIEW_DIR, { recursive: true });
  for (const file of fs.readdirSync(PREVIEW_DIR)) {
    if (file.endsWith(".html")) {
      fs.unlinkSync(path.join(PREVIEW_DIR, file));
    }
  }

  console.log(
    previewOnly
      ? "Generating complete offline KarmaRise email preview desk..."
      : "Syncing KarmaRise Stories newsletter drafts to Sanity CDN, Sanity CMS, Brevo, and local previews...",
  );

  let logoCdnUrl = null;
  const uploadedHeroMap = new Map();

  if (!previewOnly && sanityProjectId && sanityToken) {
    console.log("\n1. Uploading newsletter photos & logo to Sanity CDN...");
    const logoAsset = await uploadImageToSanity(
      "/brand/main-logo-transparent.png",
    );
    if (logoAsset) {
      logoCdnUrl = `${logoAsset.url}?w=260&auto=format`;
      process.env.BREVO_LOGO_CDN_URL = logoCdnUrl;
      console.log(`   + Logo CDN: ${logoAsset.url}`);
    }

    for (const draft of newsletterIssueDrafts) {
      if (uploadedHeroMap.has(draft.localHeroImage)) {
        continue;
      }
      const asset = await uploadImageToSanity(draft.localHeroImage);
      if (asset) {
        uploadedHeroMap.set(draft.localHeroImage, asset);
        console.log(`   + ${draft.issueNumber} image CDN: ${asset.url}`);
      }
    }
  }

  const existingIssues = previewOnly
    ? new Map()
    : await fetchExistingSanityIssues();
  const existingStoryIds = previewOnly
    ? new Set()
    : await fetchExistingSanityStoryIds();

  const previewEntries = [];
  const localLogo =
    logoCdnUrl || "../../public/brand/main-logo-transparent.png";

  // 1. Render all automated sequence previews (Welcome W1-W5, B2B Follow-Up, Re-Engagement R1-R3)
  for (const tpl of automatedEmailTemplates) {
    for (const lang of ["en", "es"]) {
      const rendered = renderAutomatedSequenceEmail(tpl, lang, {
        logoUrl: localLogo,
        heroImageUrl: tpl.localHeroImage
          ? toLocalPreviewAssetPath(tpl.localHeroImage)
          : undefined,
        previewMode: true,
      });
      const filename = `seq-${tpl.id}-${lang}.html`;
      fs.writeFileSync(path.join(PREVIEW_DIR, filename), rendered.html, "utf8");
      previewEntries.push({
        badge: `${tpl.family.toUpperCase()} · ${tpl.id} · ${lang.toUpperCase()}`,
        kind: tpl.family,
        season: "",
        narrator: tpl.narrator,
        lang,
        sender: rendered.senderName,
        timing: tpl.sendTiming,
        subject: rendered.subject,
        preview: rendered.previewText,
        filename,
        brevoId: null,
      });
    }
  }

  // 2. Render transactional Resend confirmation previews (Product Brief, Contact, Pre-Call Prep)
  const transactionalPreviews = [
    {
      id: "tx-product-brief",
      label: "Product Brief receipt",
      timing: "Immediate (Resend)",
      narrator: "both",
      build: (lang) =>
        buildProductBriefConfirmationEmail({
          confirmationLanguage: lang,
          fields: {
            name: lang === "es" ? "Lucía" : "Claire",
            company: lang === "es" ? "Casa Sol" : "Atelier Nord",
            profile: "Independent boutique",
            email: "founder@example.com",
            language: lang === "es" ? "Spanish" : "English",
            siteLanguage: lang,
            product: "Bags and accessories",
            readiness: "Sketches or early tech pack",
            quantity: "150–250 units",
            referenceUrl: "https://karmarisedglobal.com/manufacturing",
            brief:
              lang === "es"
                ? "Bolso bandolera blando en piel de curtido vegetal color coñac, forro claro de algodón y cremallera YKK de plástico."
                : "Soft vegetable-tanned cognac crossbody bag with light cotton lining and smooth Japanese plastic YKK zipper.",
          },
          attachmentNames: ["bag-sketch.jpg", "tan-swatch.png"],
          recipientEmail: "inquiry@karmarisedglobal.com",
        }),
    },
    {
      id: "tx-book-call-prep",
      label: "Book a Call prep note",
      timing: "Immediate (Resend)",
      narrator: "alma",
      build: (lang) =>
        buildPreCallPrepEmail({
          siteLanguage: lang,
          name: lang === "es" ? "Lucía" : "Claire",
          company: lang === "es" ? "Casa Sol" : "Atelier Nord",
          duration: "15",
          callLanguage: lang,
          startTime: "2026-12-03T10:30:00.000Z",
          timeZone: "Europe/Madrid",
          meetingUrl: "https://meet.google.com/abc-defg-hij",
          notes:
            lang === "es"
              ? "Categoría de interés: Bolsos y artículos de piel"
              : "Product focus: Leather goods",
        }),
    },
    {
      id: "tx-contact-receipt",
      label: "Contact form receipt",
      timing: "Immediate (Resend)",
      narrator: "both",
      build: (lang) =>
        buildContactConfirmationEmail({
          language: lang,
          name: lang === "es" ? "Marta" : "Hannah",
          topicValue: "AlmaRise D Brand",
          topicLabel: "AlmaRise D Brand",
          note:
            lang === "es"
              ? "Me encantaría conocer las próximas piezas de AlmaRise D Organic y AlmaRise D Home Decor."
              : "I would love to hear when the next AlmaRise D Organic and AlmaRise D Home Decor pieces are ready.",
          routedDepartmentEmail: "stories@karmarisedglobal.com",
        }),
    },
  ];

  for (const tx of transactionalPreviews) {
    for (const lang of ["en", "es"]) {
      const built = tx.build(lang);
      const htmlWithLocalLogo = built.html.replaceAll(
        "https://karmarisedglobal.com/brand/main-logo-transparent.png",
        localLogo,
      );
      const filename = `${tx.id}-${lang}.html`;
      fs.writeFileSync(
        path.join(PREVIEW_DIR, filename),
        htmlWithLocalLogo,
        "utf8",
      );
      previewEntries.push({
        badge: `TRANSACTIONAL · ${tx.label} · ${lang.toUpperCase()}`,
        kind: "transactional",
        season: "",
        narrator: tx.narrator,
        lang,
        sender:
          tx.narrator === "alma"
            ? "Alma · KarmaRise D Global"
            : lang === "es"
              ? "Alma y Shirish · KarmaRise D Global"
              : "Alma & Shirish · KarmaRise D Global",
        timing: tx.timing,
        subject: built.subject,
        preview: built.preheader,
        filename,
        brevoId: null,
      });
    }
  }

  // 3. Process all 16 biweekly newsletter issues (EN + ES = 32 drafts)
  const sanityMutations = [];
  const summaryRows = [];

  for (const [index, draft] of newsletterIssueDrafts.entries()) {
    const uploadedAsset = uploadedHeroMap.get(draft.localHeroImage);
    const existing = existingIssues.get(draft.id);
    const seasonTag = index < 8 ? "season-1" : "season-2";

    const issueForSync = toSanityNewsletterIssue(draft, {
      heroImageUrl: uploadedAsset?.url || draft.localHeroImage,
      brevoCampaignIdEn: existing?.brevoCampaignIdEn,
      brevoCampaignIdEs: existing?.brevoCampaignIdEs,
    });

    let brevoCampaignIdEn = existing?.brevoCampaignIdEn;
    let brevoCampaignIdEs = existing?.brevoCampaignIdEs;

    if (!previewOnly) {
      console.log(
        `\n2. Syncing ${draft.issueNumber} (${draft.track}) drafts to Brevo...`,
      );
      const syncResult = await syncNewsletterIssueToBrevo(issueForSync);
      if (!syncResult.ok) {
        console.error(
          `   ! Brevo sync failed for ${draft.issueNumber}: ${syncResult.error}`,
        );
      } else {
        brevoCampaignIdEn = syncResult.brevoCampaignIdEn;
        brevoCampaignIdEs = syncResult.brevoCampaignIdEs;
        console.log(
          `   + Brevo drafts ready -> EN #${brevoCampaignIdEn ?? "N/A"}, ES #${brevoCampaignIdEs ?? "N/A"}`,
        );
      }
    }

    const localPreviewImage = uploadedAsset?.url
      ? uploadedAsset.url
      : toLocalPreviewAssetPath(draft.localHeroImage);
    const previewIssue = toSanityNewsletterIssue(draft, {
      heroImageUrl: uploadedAsset?.url || draft.localHeroImage,
    });

    for (const lang of ["en", "es"]) {
      let html = renderNewsletterHtml(previewIssue, lang);
      if (!uploadedAsset?.url) {
        const remoteBase = "https://karmarisedglobal.com";
        html = html
          .replaceAll(
            `${remoteBase}/brand/main-logo-transparent.png`,
            localLogo,
          )
          .replaceAll(
            `${remoteBase}${draft.localHeroImage
              .split("/")
              .map((seg) => encodeURIComponent(seg))
              .join("/")}`,
            localPreviewImage,
          );
      }

      const code = draft.issueNumber
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      const filename = `${code}-${lang}.html`;
      fs.writeFileSync(path.join(PREVIEW_DIR, filename), html, "utf8");

      const senderLabel =
        draft.narrator === "alma"
          ? "Alma · KarmaRise D Global"
          : draft.narrator === "shirish"
            ? "Shirish · KarmaRise D Global"
            : lang === "es"
              ? "Alma y Shirish · KarmaRise D Global"
              : "Alma & Shirish · KarmaRise D Global";

      previewEntries.push({
        badge: `${draft.issueNumber} · ${draft.narrator === "alma" ? "Alma" : draft.narrator === "shirish" ? "Shirish" : "Alma & Shirish"} · ${lang.toUpperCase()}`,
        kind: "issue",
        season: seasonTag,
        narrator: draft.narrator,
        lang,
        sender: senderLabel,
        timing: "Biweekly newsletter",
        subject: lang === "es" ? draft.subjectEs : draft.subjectEn,
        preview: lang === "es" ? draft.previewTextEs : draft.previewTextEn,
        filename,
        brevoId:
          lang === "es"
            ? (brevoCampaignIdEs ?? null)
            : (brevoCampaignIdEn ?? null),
      });
    }

    summaryRows.push({
      issue: draft.issueNumber,
      track: draft.track,
      narrator: draft.narrator,
      brevoEn: brevoCampaignIdEn ?? null,
      brevoEs: brevoCampaignIdEs ?? null,
    });

    if (!previewOnly && sanityProjectId && sanityToken) {
      const storyRefId = draft.storySlug ? `story-${draft.storySlug}` : null;
      const doc = {
        _id: draft.id,
        _type: "newsletterIssue",
        internalName: draft.internalName,
        issueNumber: draft.issueNumber,
        track: draft.track,
        format: "letter",
        narrator: draft.narrator,
        status:
          brevoCampaignIdEn && brevoCampaignIdEs ? "synced_to_brevo" : "draft",
        targetAudience: "both",
        titleEn: draft.titleEn,
        subjectEn: draft.subjectEn,
        previewTextEn: draft.previewTextEn,
        narratorLocationEn: draft.narratorLocationEn,
        introEn: draft.introEn,
        bodyEn: draft.bodyEn,
        replyPromptEn: draft.replyPromptEn,
        psEn: draft.psEn,
        ctaTextEn: draft.ctaTextEn,
        titleEs: draft.titleEs,
        subjectEs: draft.subjectEs,
        previewTextEs: draft.previewTextEs,
        narratorLocationEs: draft.narratorLocationEs,
        introEs: draft.introEs,
        bodyEs: draft.bodyEs,
        replyPromptEs: draft.replyPromptEs,
        psEs: draft.psEs,
        ctaTextEs: draft.ctaTextEs,
        ctaUrl: issueForSync.ctaUrl,
        ctaUrlEs: issueForSync.ctaUrlEs,
        ...(uploadedAsset
          ? {
              heroImage: {
                _type: "image",
                asset: { _type: "reference", _ref: uploadedAsset.assetId },
                alt: draft.heroImageAltEn,
                spanishAlt: draft.heroImageAltEs,
              },
            }
          : {}),
        ...(storyRefId && existingStoryIds.has(storyRefId)
          ? {
              selectedStories: [
                {
                  _key: `ref-${draft.storySlug}`,
                  _type: "reference",
                  _ref: storyRefId,
                },
              ],
            }
          : {}),
        ...(brevoCampaignIdEn ? { brevoCampaignIdEn } : {}),
        ...(brevoCampaignIdEs ? { brevoCampaignIdEs } : {}),
        ...(brevoCampaignIdEn || brevoCampaignIdEs
          ? { lastSyncedAt: new Date().toISOString() }
          : {}),
      };

      sanityMutations.push({ createOrReplace: doc });
    }
  }

  if (!previewOnly && sanityProjectId && sanityToken) {
    const parseIntOrUndef = (raw) => {
      const n = Number.parseInt(raw || "", 10);
      return Number.isFinite(n) && n > 0 ? n : undefined;
    };

    const settingsDoc = {
      _id: "newsletterSettings",
      _type: "newsletterSettings",
      senderName: "Alma & Shirish · KarmaRise D Global",
      senderEmail: "stories@karmarisedglobal.com",
      replyToEmail: "stories@karmarisedglobal.com",
      ...(parseIntOrUndef(process.env.BREVO_LIST_ID)
        ? { brevoMasterListId: parseIntOrUndef(process.env.BREVO_LIST_ID) }
        : {}),
      ...(parseIntOrUndef(process.env.BREVO_LIST_ID_EN)
        ? { brevoEnglishListId: parseIntOrUndef(process.env.BREVO_LIST_ID_EN) }
        : {}),
      ...(parseIntOrUndef(process.env.BREVO_LIST_ID_ES)
        ? { brevoSpanishListId: parseIntOrUndef(process.env.BREVO_LIST_ID_ES) }
        : {}),
      ...(parseIntOrUndef(process.env.BREVO_LIST_ID_MANUFACTURING_EN)
        ? {
            brevoManufacturingEnListId: parseIntOrUndef(
              process.env.BREVO_LIST_ID_MANUFACTURING_EN,
            ),
          }
        : {}),
      ...(parseIntOrUndef(process.env.BREVO_LIST_ID_MANUFACTURING_ES)
        ? {
            brevoManufacturingEsListId: parseIntOrUndef(
              process.env.BREVO_LIST_ID_MANUFACTURING_ES,
            ),
          }
        : {}),
      ...(parseIntOrUndef(process.env.BREVO_LIST_ID_ALMARISE_EN)
        ? {
            brevoAlmariseEnListId: parseIntOrUndef(
              process.env.BREVO_LIST_ID_ALMARISE_EN,
            ),
          }
        : {}),
      ...(parseIntOrUndef(process.env.BREVO_LIST_ID_ALMARISE_ES)
        ? {
            brevoAlmariseEsListId: parseIntOrUndef(
              process.env.BREVO_LIST_ID_ALMARISE_ES,
            ),
          }
        : {}),
      defaultFooterEn:
        "KarmaRise D Global · Spain & India · stories@karmarisedglobal.com",
      defaultFooterEs:
        "KarmaRise D Global · España e India · stories@karmarisedglobal.com",
    };

    sanityMutations.push({ createOrReplace: settingsDoc });

    console.log(
      `\n3. Committing ${sanityMutations.length} documents to Sanity CMS...`,
    );
    const committed = await commitSanityMutations(sanityMutations);
    console.log(
      committed
        ? "   + Sanity newsletterIssue documents and newsletterSettings synced."
        : "   ! Sanity mutation did not complete.",
    );
  }

  const galleryHtml = buildPreviewGalleryHtml(previewEntries);
  const indexPath = path.join(PREVIEW_DIR, "index.html");
  fs.writeFileSync(indexPath, galleryHtml, "utf8");

  console.log(`\nPreview Desk ready: ${indexPath}`);
  console.log(
    `Generated ${previewEntries.length} total email previews (${automatedEmailTemplates.length * 2} automated sequence + ${transactionalPreviews.length * 2} transactional + ${summaryRows.length * 2} biweekly newsletter drafts).`,
  );
}

main().catch((error) => {
  console.error("Newsletter seed/preview failed:", error);
  process.exit(1);
});
