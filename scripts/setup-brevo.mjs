import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

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
    name: process.env.BREVO_SENDER_NAME?.trim() || "Alma & Shirish · KarmaRise",
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
    heroImageUrl: `${EMAIL_ASSET_BASE}/images/founders/alma-and-shirish-founders.jpg`,
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
      "public/images/founders/alma-and-shirish-founders.jpg",
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

// 4. Build Human Letter HTML for Welcome Templates (matching the single-letter editorial design)
export function buildWelcomeHtml({ lang, assets, previewTrackNote }) {
  const isEs = lang === "es";

  const defaultTrackNote = isEs
    ? "Cada carta sale firmada por uno de los dos, Alma o Shirish, centrada en una sola escena real: o bien cómo fabricamos bolsos y prendas en talleres de toda la India, o bien cómo transformamos saris antiguos con AlmaRise D Brand y vivimos entre España e India."
    : "Each letter is written by one of us, Alma or Shirish, around a single real moment: either how we build leather goods and garments with workshops across India, or how we recut kept Indian sarees for AlmaRise D Brand and split everyday life between Spain and India.";

  const trackNoteExpression = previewTrackNote
    ? previewTrackNote
    : `{{ params.TRACK_NOTE | default:"${defaultTrackNote}" }}`;

  const copy = isEs
    ? {
        preheader:
          "Gracias por pasarte por aquí. Cuéntanos desde dónde nos lees y qué te trajo hasta KarmaRise.",
        brandTitle: "Historias de KarmaRise",
        issueTag: "Bienvenida · España e India",
        heading: "Qué alegría tenerte por aquí.",
        dateline: "De Alma y Shirish · Desde nuestro estudio en la India",
        greeting: 'Hola {{ contact.FIRSTNAME | default:"" }},',
        p1: "Ver tu correo en nuestra lista nos alegra el día de verdad. Cuando Alma voló desde España a la India para levantar KarmaRise D Global junto a Shirish, nos prometimos una cosa muy sencilla: contar cómo funciona este trabajo de puertas adentro, sin humo corporativo ni fotos de catálogo.",
        p2: trackNoteExpression,
        photoCaption:
          "Revisando muestras de piel y tejidos juntos en nuestro estudio en la India antes de salir a visitar talleres.",
        p3: "No enviamos boletines llenos de enlaces ni correos de relleno cada semana. Escribimos una o dos veces al mes cuando hay una muestra que falló al tacto, un hallazgo en un taller, una historia detrás de un sari de AlmaRise D Brand o un avance honesto de nuestra futura formación textil.",
        replyQuestion:
          "Antes de nuestra próxima carta: ¿desde dónde nos lees, y qué fue lo que te llamó la atención para apuntarte?",
        replyHelper:
          "Dale a responder a este correo. Nos llega directamente a Alma y a Shirish y contestamos a todo el mundo.",
        signoff: "Un abrazo,",
        founders: "Alma y Shirish",
        locations: "España · India",
        psText:
          "Si te apetece empezar ya, hemos publicado nuestras primeras historias en primera persona, desde tres biryanis seguidos en Eid hasta cómo dividimos un pedido de bolsos de piel entre dos estados de la India.",
        ctaLabel: "Leer nuestras primeras historias",
        heroAlt:
          "Alma y Shirish revisando muestras de piel y tejidos en nuestro estudio en la India",
        footerNote:
          "Te escribimos porque te apuntaste a Historias de KarmaRise.",
        unsubscribeLabel: "Darte de baja cuando quieras",
      }
    : {
        preheader:
          "Glad you are here. Hit reply and tell us where you are reading from.",
        brandTitle: "KarmaRise Stories",
        issueTag: "Welcome · Spain & India",
        heading: "Glad you are here.",
        dateline: "From Alma & Shirish · Our studio in India",
        greeting: 'Hi {{ contact.FIRSTNAME | default:"there" }},',
        p1: "Seeing your name arrive here genuinely makes our day. When Alma flew from Spain to India to build KarmaRise D Global alongside Shirish, we made one plain rule: talk about the real work on the ground, without brochure filler or stock claims.",
        p2: trackNoteExpression,
        photoCaption:
          "Reviewing leather hides and fabric swatches together in our studio in India before heading out to workshops.",
        p3: "We do not send crowded link roundups or weekly filler. We write once or twice a month when a sample catches a real snag in the hand, a factory visit teaches us something concrete, a kept Indian saree turns into a new AlmaRise D Brand piece, or our planned training groundwork moves forward.",
        replyQuestion:
          "Before our next letter lands: where are you reading from, and what drew you to KarmaRise?",
        replyHelper:
          "Hit reply right now. Every answer lands straight in our inbox, and we read and answer each one.",
        signoff: "Warmly,",
        founders: "Alma & Shirish",
        locations: "Spain · India",
        psText:
          "If you want to read now, our first Stories are live on the site, from three biryanis on Eid to splitting one leather bag run across Indian states.",
        ctaLabel: "Read our first Stories",
        heroAlt:
          "Alma and Shirish reviewing fabric and leather swatches in our studio in India",
        footerNote:
          "You are receiving this letter because you signed up for KarmaRise Stories.",
        unsubscribeLabel: "Unsubscribe anytime",
      };

  const storiesUrl = isEs
    ? `${EMAIL_ASSET_BASE}/es/stories`
    : `${EMAIL_ASSET_BASE}/stories`;
  const prefEnUrl = `${EMAIL_ASSET_BASE}/api/newsletter/preferences?email={{ contact.EMAIL }}&lang=EN`;
  const prefEsUrl = `${EMAIL_ASSET_BASE}/api/newsletter/preferences?email={{ contact.EMAIL }}&lang=ES`;
  const logoUrl = assets.logoUrl;
  const heroImageUrl = assets.heroImageUrl;

  const fontSerif =
    "'Lora', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif";
  const fontSans =
    "'Plus Jakarta Sans', 'Trebuchet MS', 'Gill Sans', Helvetica, sans-serif";

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
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${copy.preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#D9DFD3;padding:34px 14px 40px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:#F2ECDF;border:1px solid #DDD2BD;border-radius:20px;overflow:hidden;box-shadow:0 12px 34px rgba(24,45,32,0.08);">
          <tr>
            <td style="padding:22px 44px 18px;border-bottom:1px solid #DFD4BF;background-color:#F2ECDF;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="left" valign="middle">
                    <a href="${EMAIL_ASSET_BASE}" style="text-decoration:none;display:inline-block;">
                      <img src="${logoUrl}" alt="KarmaRise D Global" width="52" style="display:block;width:52px;height:auto;border:0;" />
                    </a>
                  </td>
                  <td align="right" valign="middle" style="font-family:${fontSans};font-size:11px;line-height:1.55;color:#584B44;">
                    <span style="display:block;letter-spacing:1.5px;text-transform:uppercase;color:#833E28;font-weight:600;">${copy.brandTitle}</span>
                    <span style="display:block;color:#584B44;">${copy.issueTag}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 44px 36px;background-color:#F2ECDF;">
              <h1 style="margin:0 0 12px;font-family:${fontSerif};font-size:30px;line-height:1.22;font-weight:400;font-style:italic;color:#182D20;">
                ${copy.heading}
              </h1>
              <p style="margin:0 0 26px;padding-bottom:18px;border-bottom:1px solid #DFD4BF;font-family:${fontSans};font-size:12px;letter-spacing:0.3px;color:#584B44;">
                ${copy.dateline}
              </p>

              <p style="margin:0 0 18px;font-family:${fontSerif};font-size:17px;line-height:1.78;color:#182D20;">
                ${copy.greeting}
              </p>
              <p style="margin:0 0 18px;font-family:${fontSerif};font-size:17px;line-height:1.78;color:#25201D;">
                ${copy.p1}
              </p>
              <p style="margin:0 0 22px;font-family:${fontSerif};font-size:17px;line-height:1.78;color:#25201D;">
                ${copy.p2}
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 26px;">
                <tr>
                  <td style="padding:0;line-height:0;">
                    <a href="${storiesUrl}" style="display:block;text-decoration:none;">
                      <img src="${heroImageUrl}" alt="${copy.heroAlt}" width="512" style="display:block;width:100%;max-width:512px;height:auto;border-radius:12px;border:0;" />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:10px 4px 0;font-family:${fontSerif};font-size:13.5px;font-style:italic;line-height:1.58;color:#584B44;">
                    ${copy.photoCaption}
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 24px;font-family:${fontSerif};font-size:17px;line-height:1.78;color:#25201D;">
                ${copy.p3}
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 28px;background-color:#E8DEC9;border-radius:12px;">
                <tr>
                  <td style="padding:20px 22px;border-left:3px solid #BD7057;border-radius:12px;">
                    <p style="margin:0 0 8px;font-family:${fontSerif};font-size:17px;line-height:1.65;color:#182D20;font-weight:500;">
                      ${copy.replyQuestion}
                    </p>
                    <p style="margin:0;font-family:${fontSans};font-size:12.5px;line-height:1.55;color:#584B44;">
                      ${copy.replyHelper}
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-family:${fontSerif};font-size:16px;font-style:italic;color:#4D342F;">
                      ${copy.signoff}
                    </p>
                    <p style="margin:0 0 4px;font-family:${fontSerif};font-size:23px;line-height:1.2;color:#182D20;">
                      ${copy.founders}
                    </p>
                    <p style="margin:0;font-family:${fontSans};font-size:12px;letter-spacing:0.5px;color:#833E28;">
                      ${copy.locations}
                    </p>
                  </td>
                </tr>
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:26px;border-top:1px solid #CDBB9C;">
                <tr>
                  <td style="padding-top:22px;font-family:${fontSerif};font-size:15.5px;line-height:1.72;color:#3E332C;">
                    <p style="margin:0 0 12px;">
                      <strong style="font-family:${fontSans};font-size:12px;letter-spacing:0.8px;color:#833E28;text-transform:uppercase;">${isEs ? "P.D." : "P.S."}</strong>&nbsp; ${copy.psText}
                    </p>
                    <p style="margin:0;font-family:${fontSans};font-size:13.5px;line-height:1.6;">
                      <a href="${storiesUrl}" style="color:#833E28;font-weight:600;text-decoration:underline;">${copy.ctaLabel} &rarr;</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:560px;padding:22px 18px 6px;">
          <tr>
            <td align="center" style="font-family:${fontSans};font-size:12px;line-height:1.7;color:#29482F;">
              <p style="margin:0 0 6px;">
                ${
                  isEs
                    ? `Leyendo en español &nbsp;&middot;&nbsp; <a href="${prefEnUrl}" style="color:#833E28;font-weight:600;text-decoration:underline;">Prefer English? Switch here</a>`
                    : `Reading in English &nbsp;&middot;&nbsp; <a href="${prefEsUrl}" style="color:#833E28;font-weight:600;text-decoration:underline;">¿Prefieres español? Cambia aquí</a>`
                }
              </p>
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
      subject: "Glad you are here · Alma & Shirish",
      htmlContent: buildWelcomeHtml({ lang: "en", assets }),
    },
    {
      key: "es",
      envId: Number.parseInt(
        process.env.BREVO_WELCOME_TEMPLATE_ID_ES || "",
        10,
      ),
      templateName: "Bienvenida - Historias KarmaRise (ES)",
      subject: "Qué alegría tenerte por aquí · Alma y Shirish",
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
        name: "Alma & Shirish · KarmaRise D Global",
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
