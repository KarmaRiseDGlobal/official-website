import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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

const isDryRun = process.argv.includes("--dry-run");
const isJson = process.argv.includes("--json");
const isEntrypoint =
  Boolean(process.argv[1]) &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

const uploadedAssetCache = new Map();

function resolveLocalPublicPath(publicPath) {
  const relativePath = publicPath.replace(/^\//, "");
  return path.resolve(process.cwd(), "public", relativePath);
}

async function resolveDryRunAsset(publicPath) {
  if (!publicPath) {
    return null;
  }
  if (uploadedAssetCache.has(publicPath)) {
    return uploadedAssetCache.get(publicPath);
  }
  const fullPath = resolveLocalPublicPath(publicPath);
  if (!fs.existsSync(fullPath)) {
    console.warn(`   ! Local image not found: ${fullPath}`);
    return null;
  }
  const assetId = `dry-run-asset:${publicPath}`;
  uploadedAssetCache.set(publicPath, assetId);
  return assetId;
}

async function uploadPublicImageToSanity(
  publicPath,
  { projectId, dataset, token },
) {
  if (!publicPath) {
    return null;
  }
  if (uploadedAssetCache.has(publicPath)) {
    return uploadedAssetCache.get(publicPath);
  }

  const fullPath = resolveLocalPublicPath(publicPath);
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

export async function buildPortableBodyFromStory(
  story,
  uploadAsset = resolveDryRunAsset,
) {
  const blocks = [];

  for (const [sectionIdx, section] of story.sections.entries()) {
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

    for (const [imgIdx, img] of (section.images ?? []).entries()) {
      const imgAssetId = await uploadAsset(img.url);
      if (imgAssetId) {
        blocks.push({
          _key: `sec-img-${sectionIdx}-${imgIdx}`,
          _type: "image",
          alt: img.alt,
          ...(img.caption ? { caption: img.caption } : {}),
          ...(img.aspectRatio ? { aspectRatio: img.aspectRatio } : {}),
          ...(img.objectPosition ? { objectPosition: img.objectPosition } : {}),
          asset: { _type: "reference", _ref: imgAssetId },
        });
      }
    }
  }

  return blocks;
}

async function mapSectionsForSanity(
  sections,
  keyPrefix,
  uploadAsset = resolveDryRunAsset,
) {
  const mapped = [];

  for (const [sectionIndex, section] of sections.entries()) {
    const sectionImages = [];
    for (const [imgIdx, img] of (section.images ?? []).entries()) {
      const imgAssetId = await uploadAsset(img.url);
      if (imgAssetId) {
        sectionImages.push({
          _key: `${keyPrefix}-img-${sectionIndex}-${imgIdx}`,
          _type: "image",
          alt: img.alt,
          ...(img.caption ? { caption: img.caption } : {}),
          ...(img.aspectRatio ? { aspectRatio: img.aspectRatio } : {}),
          ...(img.objectPosition ? { objectPosition: img.objectPosition } : {}),
          asset: { _type: "reference", _ref: imgAssetId },
        });
      }
    }

    mapped.push({
      _key: `${keyPrefix}-${sectionIndex}`,
      heading: section.heading,
      paragraphs: section.paragraphs,
      ...(sectionImages.length > 0 ? { images: sectionImages } : {}),
    });
  }

  return mapped;
}

export async function buildSeedMutations({
  uploadAsset = resolveDryRunAsset,
} = {}) {
  // Upload category images
  const categoryMutations = [];
  for (const category of storyCategoryDetails) {
    const assetId = await uploadAsset(category.coverImage);
    categoryMutations.push({
      createOrReplace: {
        _id: `category-${category.slug}`,
        _type: "category",
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
  const foundersPortraitId = await uploadAsset(
    "/images/alma-and-shirish-founders.jpg",
  );
  const almaPortraitId = await uploadAsset("/images/alma.jpeg");
  const shirishPortraitId = await uploadAsset("/images/shirish.jpeg");

  const authorMutations = [
    {
      createOrReplace: {
        _id: "author-alma-and-shirish",
        _type: "author",
        name: "Alma & Shirish",
        slug: { _type: "slug", current: "alma-and-shirish" },
        role: "Co-founders, KarmaRise D Global",
        spanishRole: "Cofundadores, KarmaRise D Global",
        location: "India & Spain",
        spanishLocation: "India y España",
        bio: "Alma works with Clients in Spain and across Europe while living and working on the ground in India alongside Shirish to oversee Manufacturing Partners across the country.",
        ...(foundersPortraitId
          ? {
              portrait: {
                _type: "image",
                alt: "Alma and Shirish at their studio desk in India",
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
        role: "Co-founder, KarmaRise D Global",
        spanishRole: "Cofundadora de KarmaRise D Global",
        location: "Spain & India",
        spanishLocation: "España e India",
        bio: "Between Spain and India, Alma guides Product Briefs, material selections, and the creative direction of Almarise.",
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
        role: "Co-founder, KarmaRise D Global",
        spanishRole: "Cofundador de KarmaRise D Global",
        location: "India",
        spanishLocation: "India",
        bio: "A lawyer by profession in India, Shirish visits workshops across the country, reviews sample construction, and structures Manufacturing Partner agreements.",
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
        "KarmaRise D Global is a brand of Karmarise Global LLP · India & Spain.",
      defaultFooterEs:
        "KarmaRise D Global es una marca de Karmarise Global LLP · India y España.",
    },
  };

  // Build Story mutations with uploaded images and Portable Text body
  const storyMutations = [];
  for (const story of stories) {
    const leadAssetId = await uploadAsset(story.leadImage?.url);

    const pairImageObjects = [];
    for (const [idx, pairImg] of (story.pairImages ?? []).entries()) {
      const pairAssetId = await uploadAsset(pairImg.url);
      if (pairAssetId) {
        pairImageObjects.push({
          _key: `pair-img-${idx}`,
          _type: "image",
          alt: pairImg.alt,
          ...(story.spanishPairAlts?.[idx]
            ? { spanishAlt: story.spanishPairAlts[idx] }
            : {}),
          caption: pairImg.caption,
          ...(story.spanishPairCaptions?.[idx]
            ? { spanishCaption: story.spanishPairCaptions[idx] }
            : {}),
          ...(pairImg.objectPosition
            ? { objectPosition: pairImg.objectPosition }
            : {}),
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

    const [body, mappedSections, mappedSpanishSections] = await Promise.all([
      buildPortableBodyFromStory(story, uploadAsset),
      mapSectionsForSanity(story.sections, "section", uploadAsset),
      story.spanishSections?.length
        ? mapSectionsForSanity(story.spanishSections, "es-section", uploadAsset)
        : Promise.resolve(undefined),
    ]);

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
          ...(story.author.spanishRole
            ? { spanishRole: story.author.spanishRole }
            : {}),
          location: story.author.location,
          ...(story.author.spanishLocation
            ? { spanishLocation: story.author.spanishLocation }
            : {}),
        },
        location: story.location,
        ...(story.spanishLocation
          ? { spanishLocation: story.spanishLocation }
          : {}),
        summary: story.summary,
        spanishSummary: story.spanishSummary,
        tags: story.tags,
        ...(story.spanishTags?.length
          ? { spanishTags: story.spanishTags }
          : {}),
        ...(leadAssetId
          ? {
              leadImage: {
                _type: "image",
                alt: story.leadImage?.alt || story.title,
                ...(story.spanishLeadAlt
                  ? { spanishAlt: story.spanishLeadAlt }
                  : {}),
                caption: story.leadImage?.caption,
                ...(story.spanishLeadCaption
                  ? { spanishCaption: story.spanishLeadCaption }
                  : {}),
                ...(story.leadImage?.objectPosition
                  ? { objectPosition: story.leadImage.objectPosition }
                  : {}),
                asset: { _type: "reference", _ref: leadAssetId },
              },
            }
          : {}),
        ...(pairImageObjects.length > 0
          ? { pairImages: pairImageObjects }
          : {}),
        body,
        leadSlot: story.leadSlot,
        pullQuote: story.pullQuote,
        ...(story.spanishPullQuote
          ? { spanishPullQuote: story.spanishPullQuote }
          : {}),
        pairSlots: story.pairSlots.map((slot, slotIndex) => ({
          _key: `slot-${slotIndex}`,
          ...slot,
        })),
        sections: mappedSections,
        ...(mappedSpanishSections?.length
          ? { spanishSections: mappedSpanishSections }
          : {}),
        takeaway: story.takeaway ?? "",
        spanishTakeaway: story.spanishTakeaway ?? "",
        ...(story.seo ? { seo: { ...story.seo } } : {}),
      },
    });
  }

  const sampleNewsletterIssueMutation = {
    createOrReplace: {
      _id: "newsletter-issue-001",
      _type: "newsletterIssue",
      internalName:
        "Newsletter Issue #001 · Giving Indian Silk Sarees a Second Life",
      issueNumber: "Issue #001",
      status: "draft",
      campaignDate: "2026-11-25T10:00:00.000Z",
      targetAudience: "both",
      ...(foundersPortraitId
        ? {
            heroImage: {
              _type: "image",
              alt: "Alma and Shirish at their studio desk in India",
              asset: { _type: "reference", _ref: foundersPortraitId },
            },
          }
        : {}),
      titleEn: "Giving Indian Sarees a Second Life",
      subjectEn: "From Spain to India: our latest Stories",
      previewTextEn:
        "Vintage silk sarees, workshop visits across India, and how one Product Brief connects two continents.",
      introEn:
        "Here are three Stories from our work across Spain and India. We have been unrolling vintage sarees for Almarise, visiting workshops across the country, and refining how our Product Briefs travel from Europe to India.",
      closingEn:
        "Hit reply anytime and tell us what caught your eye or what you are dreaming of making. Every message comes straight to the two of us.",
      ctaTextEn: "Read our latest Stories",
      titleEs: "Una segunda vida para los saris de la India",
      subjectEs: "Entre España y la India: nuestras últimas historias",
      previewTextEs:
        "Saris antiguos con historia, visitas a talleres por toda la India y cómo trabajamos entre dos continentes.",
      introEs:
        "Queríamos compartir contigo tres historias que resumen muy bien nuestros últimos días entre España y la India: desde cómo elegimos saris antiguos para darles otra vida en Almarise hasta cómo trabajamos a pie de taller.",
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

  const mutations = [
    ...categoryMutations,
    ...authorMutations,
    settingsMutation,
    ...storyMutations,
    sampleNewsletterIssueMutation,
  ];

  return {
    categoryMutations,
    authorMutations,
    settingsMutation,
    storyMutations,
    sampleNewsletterIssueMutation,
    mutations,
  };
}

async function main() {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
    (isDryRun ? "dry-run" : "");
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
  const token = process.env.SANITY_API_KEY?.trim() || "";

  if (!isDryRun && (!projectId || !token)) {
    console.error(
      "NEXT_PUBLIC_SANITY_PROJECT_ID and SANITY_API_KEY must be set in .env.",
    );
    process.exit(1);
  }

  const uploadAsset = isDryRun
    ? resolveDryRunAsset
    : (publicPath) =>
        uploadPublicImageToSanity(publicPath, { projectId, dataset, token });

  if (!isJson) {
    console.log(
      isDryRun
        ? `1. Dry-run: validating editorial photographs and building Sanity mutations (${projectId}/${dataset})...`
        : `1. Uploading editorial photographs to Sanity (${projectId}/${dataset})...`,
    );
  }

  const { categoryMutations, authorMutations, storyMutations, mutations } =
    await buildSeedMutations({ uploadAsset });

  if (isDryRun) {
    if (isJson) {
      console.log(JSON.stringify(mutations, null, 2));
      return;
    }
    console.log(
      `Dry-run complete: ${mutations.length} mutations (${categoryMutations.length} categories, ${authorMutations.length} authors, 1 settings, ${storyMutations.length} stories, 1 newsletterIssue) with ${uploadedAssetCache.size} verified local photographs.`,
    );
    return;
  }

  console.log(
    `\n2. Committing ${mutations.length} editorial documents to Sanity...`,
  );

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
    console.error(
      "Sanity seed failed:",
      response.status,
      await response.text(),
    );
    process.exit(1);
  }

  const result = await response.json();
  console.log(
    `\nSeeded ${result.results?.length ?? 0} editorial documents with ${uploadedAssetCache.size} Sanity CDN photographs into ${projectId}/${dataset}.`,
  );

  const deleteAssetQuery = encodeURIComponent(
    '*[_type == "sanity.imageAsset" && originalFilename == "alma_with_a_woman (1).jpeg"]._id',
  );
  const assetQueryRes = await fetch(
    `https://${projectId}.api.sanity.io/v2025-01-01/data/query/${dataset}?query=${deleteAssetQuery}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );
  if (assetQueryRes.ok) {
    const assetQueryJson = await assetQueryRes.json();
    const assetIds = assetQueryJson.result ?? [];
    if (assetIds.length > 0) {
      await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mutations: assetIds.map((id) => ({ delete: { id } })),
        }),
      });
      console.log(`Purged removed Sanity asset(s): ${assetIds.join(", ")}`);
    }
  }
}

if (isEntrypoint) {
  await main();
}
