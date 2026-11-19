import fs from "node:fs";
import path from "node:path";

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

loadEnvFile(path.resolve(process.cwd(), ".env"));
loadEnvFile(path.resolve(process.cwd(), ".env.local"));

const apiKey = process.env.BREVO_API_KEY?.trim();
if (!apiKey) {
  console.error("BREVO_API_KEY is missing in .env");
  process.exit(1);
}

const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://karmarisedglobal.com"
).replace(/\/$/, "");

const EMAIL_ASSET_BASE = SITE_URL.includes("localhost")
  ? "https://karmarisedglobal.com"
  : SITE_URL;

const HEADERS = {
  "api-key": apiKey,
  "Content-Type": "application/json",
  Accept: "application/json",
};

async function brevoRequest(endpoint, options = {}) {
  const url = `https://api.brevo.com/v3${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...HEADERS,
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
    { name: "LANGUAGE", type: "text" },
    { name: "COUNTRY", type: "text" },
    { name: "CUSTOMER_TYPE", type: "text" },
    { name: "CONSENT_STATUS", type: "text" },
    { name: "CONSENT_DATE", type: "text" },
    { name: "SOURCE", type: "text" },
    { name: "INTEREST", type: "text" },
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

// 2. Ensure Folder & Lists
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

// 3. Resolve Active Sender
async function resolveSender() {
  console.log("\n3. Checking verified senders in Brevo...");
  const sendersRes = await brevoRequest("/senders");
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
    name: process.env.BREVO_SENDER_NAME?.trim() || "Alma & Shirish · KarmaRise",
    email:
      process.env.BREVO_SENDER_EMAIL?.trim() || "stories@karmarisedglobal.com",
  };
}

// 3b. Upload email brand assets to Sanity CDN so Brevo previews & emails load them immediately
async function ensureEmailAssetsOnCdn() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
  const sanityToken = process.env.SANITY_API_KEY?.trim();

  const fallbackAssets = {
    logoUrl: `${EMAIL_ASSET_BASE}/brand/main-logo-transparent.png`,
    heroImageUrl: `${EMAIL_ASSET_BASE}/images/alma-and-shirish-founders.jpg`,
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
      "public/images/alma-and-shirish-founders.jpg",
      "image/jpeg",
      "alma-and-shirish-founders.jpg",
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

// 4. Build Warm, Soothing Letter HTML for Welcome Templates
function buildWelcomeHtml({ lang, assets }) {
  const isEs = lang === "es";

  const copy = isEs
    ? {
        preheader:
          "De España a la India: qué alegría tenerte por aquí. Respóndenos y cuéntanos desde dónde nos lees.",
        eyebrowNote: "Una carta de Alma y Shirish · España e India",
        heading: "¡Pasa, estás en tu casa!",
        greeting: '¡Hola {{ contact.FIRSTNAME | default:"" }}! ¿Qué tal todo?',
        p1: "Nos ha hecho una ilusión enorme ver tu correo por aquí. Si te somos sinceros, todo esto empezó casi sin planearlo: nos conocimos, conectamos desde el minuto uno y, a los pocos meses, Alma ya estaba subiéndose a un avión rumbo a la India. Desde aquel viaje no hemos parado quietos ni un segundo.",
        p2: "Hoy trabajamos entre España y toda la India, recorriendo talleres de piel y confección, revisando materiales sobre el terreno y rescatando saris antiguos para darles otra vida con Almarise. Queríamos un espacio cercano donde contarte cómo se hacen las cosas por dentro, sin filtros ni rollos corporativos.",
        pillarsIntro:
          "Por aquí nos va a encantar charlar contigo de todo lo que nos mueve:",
        pillars: [
          { title: "Cultura y raíces" },
          { title: "Moda sostenible" },
          { title: "Oficios y talleres" },
          { title: "Diseño y materiales" },
          { title: "Entre India y Europa" },
          { title: "Día a día en KarmaRise" },
        ],
        p3: "Y oye, que esto no sea un monólogo. Antes de mandarte la próxima carta, nos morimos de curiosidad por saber quién anda al otro lado: dale a responder ahora mismo y cuéntanos desde dónde nos lees y qué te llamó la atención para apuntarte. ¿Te pierde el mundo textil, te tira la India o andas con ganas de dar forma a algo tuyo?",
        p4: "Los correos nos llegan directamente a nosotros dos, así que te leemos y te contestamos seguro.",
        primaryCta: "Ven a leer nuestras historias",
        signoff: "Un abrazo enorme,",
        founders: "Alma y Shirish",
        locations: "España · India",
        heroAlt:
          "Alma y Shirish revisando muestras de tejido en nuestro estudio en la India",
        footerNote:
          "Te escribimos porque te apuntaste para recibir nuestras historias en KarmaRise.",
        unsubscribeLabel: "Darte de baja cuando quieras",
      }
    : {
        preheader:
          "From Spain to India: we are thrilled you are here. Hit reply and tell us where you are reading from.",
        eyebrowNote: "A note from Alma & Shirish · Spain & India",
        heading: "You are in. Glad you are here.",
        greeting: 'Hey {{ contact.FIRSTNAME | default:"there" }},',
        p1: "Seeing your name pop up here honestly makes our day. A few months after we first connected, Alma got on a plane from Spain to India, and our lives have been a whirlwind of colours, workshops, and late-night ideas ever since.",
        p2: "Working across Spain, Europe, and India, we spend our days visiting leather and garment workshops, selecting existing silk sarees for Almarise, and turning raw sketches into physical samples you can hold in your hands. Through these Stories, we bring you straight into that work.",
        pillarsIntro:
          "Over the coming weeks, we would love talking to you about:",
        pillars: [
          { title: "Heritage & Culture" },
          { title: "Sustainable Fashion" },
          { title: "People & Craftsmanship" },
          { title: "Art & Design" },
          { title: "India Meets Europe" },
          { title: "Inside KarmaRise" },
        ],
        p3: "Before we send our next Story, we would love to know who is on the other side of this screen. Hit reply right now and tell us: where are you reading this from, and what drew you to our world? Was it Indian textiles, sustainable fashion, or making something of your own?",
        p4: "Every reply lands straight in our inbox, and we read and answer every single one.",
        primaryCta: "Read our first Stories",
        signoff: "Can't wait to hear from you,",
        founders: "Alma & Shirish",
        locations: "Spain · India",
        heroAlt:
          "Alma and Shirish reviewing fabric swatches in our studio in India",
        footerNote:
          "You are receiving this letter because you signed up for KarmaRise Stories.",
        unsubscribeLabel: "Unsubscribe anytime",
      };

  const storiesUrl = `${EMAIL_ASSET_BASE}/stories`;
  const prefEnUrl = `${EMAIL_ASSET_BASE}/api/newsletter/preferences?email={{ contact.EMAIL }}&lang=EN`;
  const prefEsUrl = `${EMAIL_ASSET_BASE}/api/newsletter/preferences?email={{ contact.EMAIL }}&lang=ES`;
  const logoUrl = assets.logoUrl;
  const heroImageUrl = assets.heroImageUrl;

  const fontSerif =
    "'Lora', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif";
  const fontSans =
    "'Plus Jakarta Sans', 'Trebuchet MS', 'Gill Sans', Helvetica, sans-serif";

  const pillarsLeft = copy.pillars.slice(0, 3);
  const pillarsRight = copy.pillars.slice(3, 6);

  const pillarsRowsHtml = pillarsLeft
    .map((leftPillar, index) => {
      const rightPillar = pillarsRight[index];
      return `
                <tr>
                  <td valign="middle" width="50%" style="padding:6px 12px 6px 0;font-family:${fontSerif};font-size:16px;line-height:1.5;color:#182D20;">
                    <span style="color:#BD7057;font-size:18px;padding-right:8px;">&bull;</span>${leftPillar.title}
                  </td>
                  <td valign="middle" width="50%" style="padding:6px 0 6px 12px;font-family:${fontSerif};font-size:16px;line-height:1.5;color:#182D20;">
                    ${
                      rightPillar
                        ? `<span style="color:#BD7057;font-size:18px;padding-right:8px;">&bull;</span>${rightPillar.title}`
                        : ""
                    }
                  </td>
                </tr>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${copy.heading}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#D9DFD3;font-family:${fontSerif};color:#25201D;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${copy.preheader}
  </div>

  <!-- Pale sage outer canvas -->
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#D9DFD3;padding:40px 14px;">
    <tr>
      <td align="center">

        <!-- Warm paper letter card (no top border strip) -->
        <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:580px;background-color:#F2ECDF;border-radius:24px;overflow:hidden;box-shadow:0 14px 38px rgba(24,45,32,0.08);">

          <!-- Airy natural logo header on warm paper -->
          <tr>
            <td align="center" style="padding:28px 36px 20px;background-color:#F2ECDF;">
              <p style="margin:0 0 22px;font-family:${fontSans};font-size:12px;line-height:1.5;color:#584B44;">
                ${
                  isEs
                    ? `Leyendo en español &nbsp;&middot;&nbsp; <a href="${prefEnUrl}" style="color:#833E28;font-weight:600;text-decoration:underline;">Prefer English? Switch in one click</a>`
                    : `Reading in English &nbsp;&middot;&nbsp; <a href="${prefEsUrl}" style="color:#833E28;font-weight:600;text-decoration:underline;">¿Prefieres español? Cambia con un clic</a>`
                }
              </p>
              <a href="${EMAIL_ASSET_BASE}" style="text-decoration:none;display:inline-block;">
                <img src="${logoUrl}" alt="KarmaRise" width="84" style="display:block;width:84px;height:auto;margin:0 auto;border:0;" />
              </a>
              <p style="margin:14px 0 0;font-family:${fontSans};font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#BD7057;font-weight:600;">
                ${copy.eyebrowNote}
              </p>
            </td>
          </tr>

          <!-- Greeting & opening personal note -->
          <tr>
            <td style="padding:10px 44px 32px;background-color:#F2ECDF;">
              <h1 style="margin:0 0 24px;font-family:${fontSerif};font-size:31px;line-height:1.22;font-weight:400;font-style:italic;color:#182D20;text-align:center;">
                ${copy.heading}
              </h1>

              <p style="margin:0 0 18px;font-family:${fontSerif};font-size:18px;line-height:1.75;color:#182D20;">
                ${copy.greeting}
              </p>
              <p style="margin:0 0 18px;font-family:${fontSerif};font-size:17px;line-height:1.8;color:#25201D;">
                ${copy.p1}
              </p>
              <p style="margin:0;font-family:${fontSerif};font-size:17px;line-height:1.8;color:#25201D;">
                ${copy.p2}
              </p>
            </td>
          </tr>

          <!-- Full-bleed edge-to-edge photograph (no background box, no subtitle) -->
          <tr>
            <td style="padding:0;line-height:0;font-size:0;">
              <a href="${storiesUrl}" style="display:block;text-decoration:none;">
                <img src="${heroImageUrl}" alt="${copy.heroAlt}" width="580" style="display:block;width:100%;max-width:580px;height:auto;border:0;" />
              </a>
            </td>
          </tr>

          <!-- Warm dune & sage-tinted section for the short side-by-side Editorial Pillars -->
          <tr>
            <td style="padding:28px 44px;background-color:#E6DAC4;">
              <p style="margin:0 0 14px;font-family:${fontSerif};font-size:17px;font-style:italic;line-height:1.6;color:#182D20;">
                ${copy.pillarsIntro}
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                ${pillarsRowsHtml}
              </table>
            </td>
          </tr>

          <!-- Closing paragraph, warm clay/gold button & personal sign-off on warm paper -->
          <tr>
            <td style="padding:34px 44px 42px;background-color:#F2ECDF;">
              <p style="margin:0 0 16px;font-family:${fontSerif};font-size:17px;line-height:1.8;color:#25201D;">
                ${copy.p3}
              </p>
              <p style="margin:0 0 30px;font-family:${fontSerif};font-size:17px;font-style:italic;line-height:1.75;color:#833E28;">
                ${copy.p4}
              </p>

              <!-- Warm terracotta clay pill button with pale cream text -->
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 36px;">
                <tr>
                  <td align="center" bgcolor="#BD7057" style="border-radius:999px;background-color:#BD7057;">
                    <a href="${storiesUrl}" style="display:inline-block;padding:15px 36px;font-family:${fontSans};font-size:14px;font-weight:600;letter-spacing:0.4px;color:#FAF6EE;text-decoration:none;border-radius:999px;">
                      ${copy.primaryCta}
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Sign-off with warm gold divider rule -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #CDBB9C;padding-top:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-family:${fontSerif};font-size:16px;font-style:italic;color:#4D342F;">
                      ${copy.signoff}
                    </p>
                    <p style="margin:0 0 4px;font-family:${fontSerif};font-size:22px;color:#182D20;">
                      ${copy.founders}
                    </p>
                    <p style="margin:0;font-family:${fontSans};font-size:12px;letter-spacing:0.6px;color:#833E28;">
                      ${copy.locations}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>

        <!-- Minimal, friendly footer on the pale sage background -->
        <table role="presentation" width="540" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:540px;padding:24px 20px 8px;">
          <tr>
            <td align="center" style="font-family:${fontSans};font-size:12px;line-height:1.7;color:#29482F;">
              <p style="margin:0 0 4px;">
                ${copy.footerNote}
              </p>
              <p style="margin:0;">
                <a href="mailto:stories@karmarisedglobal.com" style="color:#833E28;text-decoration:underline;">stories@karmarisedglobal.com</a>
                &nbsp;&middot;&nbsp;
                <a href="{{ unsubscribe }}" style="color:#29482F;text-decoration:underline;">${copy.unsubscribeLabel}</a>
              </p>
            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>
</body>
</html>`;
}

// 5. Create or Update the Two Welcome Templates
async function ensureWelcomeTemplates(sender, assets) {
  console.log("\n4. Creating / updating welcome email templates in Brevo...");

  const existingRes = await brevoRequest("/smtp/templates?limit=50&offset=0");
  const existingTemplates = existingRes.data?.templates || [];

  const templatesToSync = [
    {
      key: "en",
      envId: Number.parseInt(
        process.env.BREVO_WELCOME_TEMPLATE_ID_EN || "",
        10,
      ),
      templateName: "Welcome - KarmaRise Stories (EN)",
      subject: "A warm welcome from Alma & Shirish",
      htmlContent: buildWelcomeHtml({ lang: "en", assets }),
    },
    {
      key: "es",
      envId: Number.parseInt(
        process.env.BREVO_WELCOME_TEMPLATE_ID_ES || "",
        10,
      ),
      templateName: "Bienvenida - Historias KarmaRise (ES)",
      subject: "¡Qué ilusión tenerte por aquí! · Alma y Shirish",
      htmlContent: buildWelcomeHtml({ lang: "es", assets }),
    },
  ];

  const syncedIds = {};

  for (const tpl of templatesToSync) {
    const existing =
      existingTemplates.find(
        (t) => Number.isFinite(tpl.envId) && t.id === tpl.envId,
      ) ||
      existingTemplates.find(
        (t) =>
          String(t?.name || "").toLowerCase() ===
          tpl.templateName.toLowerCase(),
      );

    const payload = {
      templateName: tpl.templateName,
      subject: tpl.subject,
      sender: {
        name: sender.name || "Alma & Shirish · KarmaRise",
        email: sender.email,
      },
      replyTo: sender.email,
      htmlContent: tpl.htmlContent,
      isActive: true,
    };

    if (existing) {
      const updateRes = await brevoRequest(`/smtp/templates/${existing.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      if (updateRes.ok || updateRes.status === 204) {
        syncedIds[tpl.key] = existing.id;
        console.log(
          `   * Updated & activated template "${tpl.templateName}" (ID: ${existing.id}).`,
        );
      } else {
        console.error(
          `   ! Failed to update template "${tpl.templateName}":`,
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
        syncedIds[tpl.key] = createRes.data.id;
        console.log(
          `   + Created & activated template "${tpl.templateName}" (ID: ${createRes.data.id}).`,
        );
      } else {
        console.error(
          `   ! Failed to create template "${tpl.templateName}":`,
          createRes.status,
          createRes.data,
        );
      }
    }
  }

  return syncedIds;
}

const attributesPromise = ensureAttributes();
await attributesPromise;
const lists = await ensureFolderAndLists();
const sender = await resolveSender();
const assets = await ensureEmailAssetsOnCdn();
const templates = await ensureWelcomeTemplates(sender, assets);

console.log("\n--- Brevo Setup Summary ---");
console.log(`Master List ID (BREVO_LIST_ID): ${lists.master ?? "N/A"}`);
console.log(`English List ID (BREVO_LIST_ID_EN): ${lists.en ?? "N/A"}`);
console.log(`Spanish List ID (BREVO_LIST_ID_ES): ${lists.es ?? "N/A"}`);
console.log(`Welcome Template EN ID: ${templates.en ?? "N/A"}`);
console.log(`Welcome Template ES ID: ${templates.es ?? "N/A"}`);

const envFilePath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envFilePath)) {
  let envContent = fs.readFileSync(envFilePath, "utf8");
  const envUpdates = {
    ...(lists.master ? { BREVO_LIST_ID: String(lists.master) } : {}),
    ...(lists.en ? { BREVO_LIST_ID_EN: String(lists.en) } : {}),
    ...(lists.es ? { BREVO_LIST_ID_ES: String(lists.es) } : {}),
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
