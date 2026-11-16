import fs from "node:fs";
import path from "node:path";

import {
  getCategoryDetail,
  stories,
  storyCategoryDetails,
} from "../src/data/stories.ts";

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

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
const token = process.env.SANITY_API_KEY?.trim();

if (!projectId || !token) {
  console.error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_KEY must be set in .env.",
  );
  process.exit(1);
}

const uploadedAssetCache = new Map();

async function uploadPublicImageToSanity(publicPath) {
  if (!publicPath) {
    return null;
  }
  if (uploadedAssetCache.has(publicPath)) {
    return uploadedAssetCache.get(publicPath);
  }

  const relativePath = publicPath.replace(/^\//, "");
  const fullPath = path.resolve(process.cwd(), "public", relativePath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`   ! Local image not found: ${fullPath}`);
    return null;
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType =
    ext === ".png"
      ? "image/png"
      : ext === ".webp"
        ? "image/webp"
        : "image/jpeg";
  const filename = path.basename(fullPath);
  const buffer = fs.readFileSync(fullPath);

  const url = `https://${projectId}.api.sanity.io/v2025-01-01/assets/images/${dataset}?filename=${encodeURIComponent(filename)}`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType,
    },
    body: buffer,
  });

  if (!response.ok) {
    console.warn(
      `   ! Asset upload failed for ${filename}:`,
      response.status,
      await response.text().catch(() => ""),
    );
    return null;
  }

  const json = await response.json();
  const assetId = json.document?._id || null;
  if (assetId) {
    uploadedAssetCache.set(publicPath, assetId);
    console.log(`   + Uploaded ${filename} -> ${assetId}`);
  }
  return assetId;
}

function buildPortableBodyFromStory(story) {
  const blocks = [];

  story.sections.forEach((section, sectionIdx) => {
    blocks.push({
      _key: `h2-${sectionIdx}`,
      _type: "block",
      style: "h2",
      children: [
        {
          _key: `h2-span-${sectionIdx}`,
          _type: "span",
          text: section.heading,
          marks: [],
        },
      ],
      markDefs: [],
    });

    section.paragraphs.forEach((paragraph, pIdx) => {
      blocks.push({
        _key: `p-${sectionIdx}-${pIdx}`,
        _type: "block",
        style: "normal",
        children: [
          {
            _key: `p-span-${sectionIdx}-${pIdx}`,
            _type: "span",
            text: paragraph,
            marks: [],
          },
        ],
        markDefs: [],
      });
    });

    if (sectionIdx === 0 && story.pullQuote?.text) {
      blocks.push({
        _key: `quote-${sectionIdx}`,
        _type: "pullQuoteBlock",
        text: story.pullQuote.text,
        attribution: story.pullQuote.attribution,
      });
    }
  });

  return blocks;
}

console.log(
  `1. Uploading editorial photographs to Sanity (${projectId}/${dataset})...`,
);

// Upload category images
const categoryMutations = [];
for (const category of storyCategoryDetails) {
  const assetId = await uploadPublicImageToSanity(category.coverImage);
  categoryMutations.push({
    createOrReplace: {
      _id: `category-${category.slug}`,
      _type: "category",
      number: category.number,
      title: category.title,
      spanishTitle: category.spanishTitle,
      slug: { _type: "slug", current: category.slug },
      description: category.description,
      spanishDescription: category.spanishDescription,
      ...(assetId
        ? {
            coverImage: {
              _type: "image",
              alt: category.coverAlt,
              asset: { _type: "reference", _ref: assetId },
            },
          }
        : {}),
    },
  });
}

// Upload author portraits
const foundersPortraitId = await uploadPublicImageToSanity(
  "/images/alma-and-shirish-founders.jpg",
);
const almaPortraitId = await uploadPublicImageToSanity("/images/alma.jpeg");
const shirishPortraitId = await uploadPublicImageToSanity(
  "/images/shirish.jpeg",
);

const authorMutations = [
  {
    createOrReplace: {
      _id: "author-alma-and-shirish",
      _type: "author",
      name: "Alma & Shirish",
      slug: { _type: "slug", current: "alma-and-shirish" },
      role: "Co-founders, KarmaRise D Global",
      spanishRole: "Cofundadores, KarmaRise D Global",
      location: "Spain & Maharashtra",
      bio: "Alma works with European Clients from Spain while Shirish coordinates directly with Manufacturing Partners and workshops across Maharashtra and India.",
      ...(foundersPortraitId
        ? {
            portrait: {
              _type: "image",
              alt: "Alma and Shirish at the studio table",
              asset: { _type: "reference", _ref: foundersPortraitId },
            },
          }
        : {}),
    },
  },
  {
    createOrReplace: {
      _id: "author-alma",
      _type: "author",
      name: "Alma",
      slug: { _type: "slug", current: "alma" },
      role: "Co-founder & Creative Lead",
      spanishRole: "Cofundadora y Directora Creativa",
      location: "Madrid & Ulhasnagar",
      bio: "From Spain and Maharashtra, Alma guides Product Briefs, material selections, and the creative direction of Almarise.",
      ...(almaPortraitId
        ? {
            portrait: {
              _type: "image",
              alt: "Alma",
              asset: { _type: "reference", _ref: almaPortraitId },
            },
          }
        : {}),
    },
  },
  {
    createOrReplace: {
      _id: "author-shirish",
      _type: "author",
      name: "Shirish",
      slug: { _type: "slug", current: "shirish" },
      role: "Co-founder & India Operations Lead",
      spanishRole: "Cofundador y Director de Operaciones en India",
      location: "Ulhasnagar, Maharashtra",
      bio: "A lawyer by training based in Maharashtra, Shirish visits workshops, reviews sample construction, and oversees Manufacturing Partner agreements.",
      ...(shirishPortraitId
        ? {
            portrait: {
              _type: "image",
              alt: "Shirish",
              asset: { _type: "reference", _ref: shirishPortraitId },
            },
          }
        : {}),
    },
  },
];

const settingsMutation = {
  createOrReplace: {
    _id: "newsletterSettings",
    _type: "newsletterSettings",
    senderName: "Alma & Shirish · KarmaRise",
    senderEmail: "stories@karmarisedglobal.com",
    replyToEmail: "stories@karmarisedglobal.com",
    brevoMasterListId: Number(process.env.BREVO_LIST_ID) || 6,
    brevoEnglishListId: Number(process.env.BREVO_LIST_ID_EN) || 7,
    brevoSpanishListId: Number(process.env.BREVO_LIST_ID_ES) || 8,
    defaultFooterEn:
      "KarmaRise D Global is a brand of Karmarise Global LLP · Ulhasnagar, Maharashtra, India & Madrid, Spain.",
    defaultFooterEs:
      "KarmaRise D Global es una marca de Karmarise Global LLP · Ulhasnagar, Maharashtra, India y Madrid, España.",
  },
};

// Build Story mutations with uploaded images and Portable Text body
const storyMutations = [];
for (const story of stories) {
  const leadAssetId = await uploadPublicImageToSanity(story.leadImage?.url);

  const pairImageObjects = [];
  for (const [idx, pairImg] of (story.pairImages ?? []).entries()) {
    const pairAssetId = await uploadPublicImageToSanity(pairImg.url);
    if (pairAssetId) {
      pairImageObjects.push({
        _key: `pair-img-${idx}`,
        _type: "image",
        alt: pairImg.alt,
        caption: pairImg.caption,
        asset: { _type: "reference", _ref: pairAssetId },
      });
    }
  }

  const categoryDetail = getCategoryDetail(story.category);
  const authorRefId =
    story.author.name === "Alma"
      ? "author-alma"
      : story.author.name === "Shirish"
        ? "author-shirish"
        : "author-alma-and-shirish";

  storyMutations.push({
    createOrReplace: {
      _id: `story-${story.slug}`,
      _type: "story",
      title: story.title,
      spanishTitle: story.spanishTitle,
      slug: { _type: "slug", current: story.slug },
      language: story.language,
      featured: Boolean(story.featured),
      newsletterEligible: story.newsletterEligible ?? true,
      issueNumber: story.issueNumber,
      publishedAt: new Date(story.publishedAt).toISOString(),
      readingTimeMinutes: story.readingTimeMinutes,
      category: story.category,
      categoryRef: {
        _type: "reference",
        _ref: `category-${categoryDetail.slug}`,
      },
      authorRef: {
        _type: "reference",
        _ref: authorRefId,
      },
      author: {
        name: story.author.name,
        role: story.author.role,
        location: story.author.location,
      },
      location: story.location,
      summary: story.summary,
      spanishSummary: story.spanishSummary,
      tags: story.tags,
      ...(leadAssetId
        ? {
            leadImage: {
              _type: "image",
              alt: story.leadImage?.alt || story.title,
              caption: story.leadImage?.caption,
              asset: { _type: "reference", _ref: leadAssetId },
            },
          }
        : {}),
      ...(pairImageObjects.length > 0 ? { pairImages: pairImageObjects } : {}),
      body: buildPortableBodyFromStory(story),
      leadSlot: story.leadSlot,
      pullQuote: story.pullQuote,
      pairSlots: story.pairSlots.map((slot, slotIndex) => ({
        _key: `slot-${slotIndex}`,
        ...slot,
      })),
      sections: story.sections.map((section, sectionIndex) => ({
        _key: `section-${sectionIndex}`,
        heading: section.heading,
        paragraphs: section.paragraphs,
      })),
      takeaway: story.takeaway,
      seo: story.seo,
    },
  });
}

const sampleNewsletterIssueMutation = {
  createOrReplace: {
    _id: "newsletter-issue-001",
    _type: "newsletterIssue",
    internalName:
      "Newsletter Issue #001 · Giving Maharashtrian Sarees a Second Life",
    issueNumber: "Issue #001",
    status: "draft",
    campaignDate: "2026-11-25T10:00:00.000Z",
    targetAudience: "both",
    ...(foundersPortraitId
      ? {
          heroImage: {
            _type: "image",
            alt: "Alma and Shirish at the studio table",
            asset: { _type: "reference", _ref: foundersPortraitId },
          },
        }
      : {}),
    titleEn: "Giving Maharashtrian Sarees a Second Life",
    subjectEn: "From Madrid to Maharashtra: what is on our worktable this week",
    previewTextEn:
      "Vintage silk sarees, workshop visits across India, and how one Product Brief connects two continents.",
    introEn:
      "Here are three Stories from our tables in Spain and Maharashtra. We have been unrolling vintage sarees for Almarise, visiting workshops, and refining how our Product Briefs travel from Europe to India.",
    closingEn:
      "Hit reply anytime and tell us what caught your eye or what you are dreaming of making. Every message comes straight to the two of us.",
    ctaTextEn: "Read our latest Stories",
    titleEs: "Una segunda vida para los saris de Maharashtra",
    subjectEs: "De Madrid a Maharashtra: lo que tenemos hoy sobre la mesa",
    previewTextEs:
      "Saris antiguos con historia, visitas a talleres en la India y cómo trabajamos entre dos continentes.",
    introEs:
      "Queríamos compartir contigo tres historias que resumen muy bien nuestros últimos días entre Madrid y Ulhasnagar: desde cómo elegimos saris antiguos para darles otra vida en Almarise hasta cómo trabajamos a pie de taller.",
    closingEs:
      "Y oye, dale a responder cuando quieras y cuéntanos qué te ha parecido o qué tienes en mente crear. Te leemos nosotros dos directamente.",
    ctaTextEs: "Ven a leer nuestras historias",
    ctaUrl: "https://karmarisedglobal.com/stories",
    selectedStories: [
      {
        _key: "ref-1",
        _type: "reference",
        _ref: "story-giving-maharashtrian-sarees-a-second-life",
      },
      {
        _key: "ref-2",
        _type: "reference",
        _ref: "story-matching-a-workshop-to-the-product",
      },
      {
        _key: "ref-3",
        _type: "reference",
        _ref: "story-from-spain-to-a-cutting-table-in-india",
      },
    ],
  },
};

console.log("\n2. Committing 17 editorial documents to Sanity...");

const mutations = [
  ...categoryMutations,
  ...authorMutations,
  settingsMutation,
  ...storyMutations,
  sampleNewsletterIssueMutation,
];

const url = `https://${projectId}.api.sanity.io/v2025-01-01/data/mutate/${dataset}`;
const response = await fetch(url, {
  method: "POST",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ mutations }),
});

if (!response.ok) {
  console.error("Sanity seed failed:", response.status, await response.text());
  process.exit(1);
}

const result = await response.json();
console.log(
  `\nSeeded ${result.results?.length ?? 0} editorial documents with ${uploadedAssetCache.size} Sanity CDN photographs into ${projectId}/${dataset}.`,
);
