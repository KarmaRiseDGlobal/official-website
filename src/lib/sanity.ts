import { cache } from "react";

import {
  stories as fallbackStories,
  type StoryBodyBlock,
  type StoryCategory,
  type StoryEntry,
  type StoryImage,
  type StoryLanguage,
  type StorySection,
} from "@/data/stories";

const SANITY_API_VERSION = "2025-01-01";

const VALID_CATEGORIES = new Set<StoryCategory>([
  "Heritage & Culture",
  "Sustainable Fashion",
  "People & Craftsmanship",
  "Art & Design",
  "India Meets Europe",
  "Inside KarmaRise",
]);

const LEGACY_CATEGORY_MAP: Record<string, StoryCategory> = {
  "Working across distance": "India Meets Europe",
  "Materials and sampling": "Art & Design",
  "Manufacturing and people": "People & Craftsmanship",
  "Company progress": "Inside KarmaRise",
  "KarmaRise Journal": "Inside KarmaRise",
};

interface SanityRawBodyBlock {
  _key?: string;
  _type?: string;
  style?: string;
  listItem?: "bullet" | "number";
  children?: Array<{
    _key?: string;
    text?: string;
    marks?: string[];
  }>;
  markDefs?: Array<{
    _key?: string;
    _type?: string;
    href?: string;
    blank?: boolean;
  }>;
  url?: string;
  alt?: string;
  caption?: string;
  aspectRatio?: "16:9" | "4:3" | "4:5";
  objectPosition?: string;
  hotspot?: { x?: number; y?: number };
  text?: string;
  attribution?: string;
}

export interface SanityRawSectionImage {
  url?: string;
  alt?: string;
  caption?: string;
  aspectRatio?: "16:9" | "4:3" | "4:5";
  objectPosition?: string;
  hotspot?: { x?: number; y?: number };
}

export interface SanityRawSection {
  _key?: string;
  heading?: string;
  paragraphs?: string[];
  images?: SanityRawSectionImage[];
}

export interface SanityRawStory {
  slug?: string;
  featured?: boolean;
  newsletterEligible?: boolean;
  language?: string;
  issueNumber?: string;
  publishedAt?: string;
  readingTimeMinutes?: number;
  category?: string;
  location?: string;
  spanishLocation?: string;
  title?: string;
  spanishTitle?: string;
  summary?: string;
  spanishSummary?: string;
  author?: {
    name?: string;
    role?: string;
    spanishRole?: string;
    location?: string;
    spanishLocation?: string;
    portraitUrl?: string;
  };
  tags?: string[];
  spanishTags?: string[];
  leadImage?: {
    url?: string;
    alt?: string;
    spanishAlt?: string;
    caption?: string;
    spanishCaption?: string;
    objectPosition?: string;
    hotspot?: { x?: number; y?: number };
  };
  spanishLeadAlt?: string;
  spanishLeadCaption?: string;
  leadSlot?: {
    kind?: "Photo" | "Video" | "Photo or video";
    ratio?: string;
    title?: string;
    description?: string;
  };
  pullQuote?: {
    text?: string;
    attribution?: string;
  };
  spanishPullQuote?: {
    text?: string;
    attribution?: string;
  };
  pairImages?: Array<{
    url?: string;
    alt?: string;
    spanishAlt?: string;
    caption?: string;
    spanishCaption?: string;
    objectPosition?: string;
    hotspot?: { x?: number; y?: number };
  }>;
  spanishPairAlts?: string[];
  spanishPairCaptions?: string[];
  pairSlots?: Array<{ title?: string; description?: string }>;
  body?: SanityRawBodyBlock[];
  sections?: SanityRawSection[];
  spanishSections?: SanityRawSection[];
  takeaway?: string;
  spanishTakeaway?: string;
  seo?: {
    title?: string;
    description?: string;
    spanishTitle?: string;
    spanishDescription?: string;
  };
}

export interface SanityNewsletterIssue {
  _id: string;
  internalName?: string;
  issueNumber?: string;
  status?: string;
  campaignDate?: string;
  targetAudience?: "both" | "en" | "es";
  titleEn?: string;
  subjectEn?: string;
  previewTextEn?: string;
  introEn?: string;
  closingEn?: string;
  ctaTextEn?: string;
  titleEs?: string;
  subjectEs?: string;
  previewTextEs?: string;
  introEs?: string;
  closingEs?: string;
  ctaTextEs?: string;
  ctaUrl?: string;
  heroImageUrl?: string;
  brevoCampaignIdEn?: number;
  brevoCampaignIdEs?: number;
  selectedStories?: Array<{
    slug?: string;
    title?: string;
    spanishTitle?: string;
    summary?: string;
    spanishSummary?: string;
    category?: string;
    location?: string;
    spanishLocation?: string;
    readingTimeMinutes?: number;
    leadImageUrl?: string;
  }>;
}

export const STORY_PROJECTION = `{
  "slug": slug.current,
  featured,
  newsletterEligible,
  language,
  issueNumber,
  publishedAt,
  readingTimeMinutes,
  category,
  location,
  spanishLocation,
  title,
  spanishTitle,
  summary,
  spanishSummary,
  "author": {
    "name": coalesce(authorRef->name, author.name),
    "role": coalesce(authorRef->role, author.role),
    "spanishRole": coalesce(authorRef->spanishRole, author.spanishRole),
    "location": coalesce(authorRef->location, author.location),
    "spanishLocation": coalesce(authorRef->spanishLocation, author.spanishLocation),
    "portraitUrl": authorRef->portrait.asset->url
  },
  tags,
  spanishTags,
  "leadImage": {
    "url": leadImage.asset->url,
    "alt": leadImage.alt,
    "spanishAlt": leadImage.spanishAlt,
    "caption": leadImage.caption,
    "spanishCaption": leadImage.spanishCaption,
    "objectPosition": leadImage.objectPosition,
    "hotspot": leadImage.hotspot
  },
  spanishLeadAlt,
  spanishLeadCaption,
  leadSlot,
  pullQuote,
  spanishPullQuote,
  "pairImages": pairImages[]{
    "url": asset->url,
    "alt": alt,
    "spanishAlt": spanishAlt,
    "caption": caption,
    "spanishCaption": spanishCaption,
    "objectPosition": objectPosition,
    "hotspot": hotspot
  },
  spanishPairAlts,
  spanishPairCaptions,
  pairSlots,
  "body": body[]{
    _key,
    _type,
    style,
    listItem,
    children,
    markDefs,
    "url": select(_type == "image" => asset->url),
    alt,
    caption,
    aspectRatio,
    objectPosition,
    hotspot,
    text,
    attribution
  },
  "sections": sections[]{
    _key,
    heading,
    paragraphs,
    "images": images[]{
      "url": asset->url,
      alt,
      caption,
      aspectRatio,
      objectPosition,
      hotspot
    }
  },
  "spanishSections": spanishSections[]{
    _key,
    heading,
    paragraphs,
    "images": images[]{
      "url": asset->url,
      alt,
      caption,
      aspectRatio,
      objectPosition,
      hotspot
    }
  },
  takeaway,
  spanishTakeaway,
  "seo": seo{
    title,
    description,
    spanishTitle,
    spanishDescription
  }
}`;

export const STORY_SUMMARY_PROJECTION = `{
  "slug": slug.current,
  featured,
  newsletterEligible,
  language,
  issueNumber,
  publishedAt,
  readingTimeMinutes,
  category,
  location,
  spanishLocation,
  title,
  spanishTitle,
  summary,
  spanishSummary,
  "author": {
    "name": coalesce(authorRef->name, author.name),
    "role": coalesce(authorRef->role, author.role),
    "spanishRole": coalesce(authorRef->spanishRole, author.spanishRole),
    "location": coalesce(authorRef->location, author.location),
    "spanishLocation": coalesce(authorRef->spanishLocation, author.spanishLocation),
    "portraitUrl": authorRef->portrait.asset->url
  },
  tags,
  spanishTags,
  "leadImage": {
    "url": leadImage.asset->url,
    "alt": leadImage.alt,
    "spanishAlt": leadImage.spanishAlt,
    "caption": leadImage.caption,
    "spanishCaption": leadImage.spanishCaption,
    "objectPosition": leadImage.objectPosition,
    "hotspot": leadImage.hotspot
  },
  spanishLeadAlt,
  spanishLeadCaption,
  leadSlot
}`;

const ALL_STORIES_QUERY = `*[_type == "story" && defined(slug.current)] | order(coalesce(featured, false) desc, coalesce(publishedAt, _createdAt) desc) ${STORY_PROJECTION}`;
const ALL_STORY_SUMMARIES_QUERY = `*[_type == "story" && defined(slug.current)] | order(coalesce(featured, false) desc, coalesce(publishedAt, _createdAt) desc) ${STORY_SUMMARY_PROJECTION}`;
const STORY_BY_SLUG_QUERY = `*[_type == "story" && slug.current == $slug][0] ${STORY_PROJECTION}`;

const NEWSLETTER_ISSUE_BY_ID_QUERY = `*[_type == "newsletterIssue" && _id == $id][0]{
  _id,
  internalName,
  issueNumber,
  status,
  campaignDate,
  targetAudience,
  titleEn,
  subjectEn,
  previewTextEn,
  introEn,
  closingEn,
  ctaTextEn,
  titleEs,
  subjectEs,
  previewTextEs,
  introEs,
  closingEs,
  ctaTextEs,
  ctaUrl,
  "heroImageUrl": heroImage.asset->url,
  brevoCampaignIdEn,
  brevoCampaignIdEs,
  "selectedStories": selectedStories[]->{
    "slug": slug.current,
    title,
    spanishTitle,
    summary,
    spanishSummary,
    category,
    location,
    spanishLocation,
    readingTimeMinutes,
    "leadImageUrl": leadImage.asset->url
  }
}`;

export function resolveCategory(
  rawCategory: string | undefined,
  fallbackCategory?: StoryCategory,
): StoryCategory {
  if (rawCategory && VALID_CATEGORIES.has(rawCategory as StoryCategory)) {
    return rawCategory as StoryCategory;
  }
  if (rawCategory && Object.hasOwn(LEGACY_CATEGORY_MAP, rawCategory)) {
    return LEGACY_CATEGORY_MAP[rawCategory]!;
  }
  if (fallbackCategory) {
    if (fallbackCategory === "KarmaRise Journal") {
      return "Inside KarmaRise";
    }
    if (VALID_CATEGORIES.has(fallbackCategory)) {
      return fallbackCategory;
    }
  }
  return "Inside KarmaRise";
}

function hotspotToObjectPosition(hotspot?: {
  x?: number;
  y?: number;
}): string | undefined {
  if (typeof hotspot?.x === "number" && typeof hotspot?.y === "number") {
    return `${Math.round(hotspot.x * 100)}% ${Math.round(hotspot.y * 100)}%`;
  }
  return undefined;
}

function matchFallbackSection(
  heading: string,
  rawKey: string | undefined,
  fallbackList: StorySection[] | undefined,
): StorySection | undefined {
  if (!fallbackList?.length) {
    return undefined;
  }
  const normalizedHeading = heading.trim().toLowerCase();
  const byHeading = fallbackList.find(
    (fb) => fb.heading.trim().toLowerCase() === normalizedHeading,
  );
  if (byHeading) {
    return byHeading;
  }
  if (rawKey) {
    const keyMatch = /^(?:es-)?section-(\d+)$/.exec(rawKey);
    if (keyMatch) {
      const keyIndex = Number(keyMatch[1]);
      if (Number.isInteger(keyIndex) && fallbackList[keyIndex]) {
        return fallbackList[keyIndex];
      }
    }
  }
  return undefined;
}

function normalizeSectionList(
  rawSections: SanityRawSection[] | undefined,
  fallbackSections: StorySection[] | undefined,
  fallbackTitle: string,
): StorySection[] {
  const validRaw = (rawSections ?? []).filter(
    (section) =>
      Boolean(section?.heading?.trim()) &&
      Array.isArray(section.paragraphs) &&
      section.paragraphs.some((p) => Boolean(p?.trim())),
  );

  return validRaw.map((section) => {
    const heading = section.heading!.trim();
    const paragraphs = (section.paragraphs ?? []).filter(
      (p): p is string => typeof p === "string" && p.length > 0,
    );
    const fbSection = matchFallbackSection(
      heading,
      section._key,
      fallbackSections,
    );

    const rawImages = (section.images ?? [])
      .map((img, imgIdx): StoryImage | null => {
        const fbImg = fbSection?.images?.[imgIdx];
        const url = img?.url || fbImg?.url;
        if (!url) {
          return null;
        }
        const resolved: StoryImage = {
          url,
          alt: img?.alt || fbImg?.alt || fallbackTitle,
        };
        const caption = img?.caption ?? fbImg?.caption ?? undefined;
        if (caption !== undefined) {
          resolved.caption = caption;
        }
        const aspectRatio = img?.aspectRatio ?? fbImg?.aspectRatio ?? undefined;
        if (aspectRatio !== undefined) {
          resolved.aspectRatio = aspectRatio;
        }
        const objectPosition =
          img?.objectPosition ??
          hotspotToObjectPosition(img?.hotspot) ??
          fbImg?.objectPosition ??
          undefined;
        if (objectPosition !== undefined) {
          resolved.objectPosition = objectPosition;
        }
        return resolved;
      })
      .filter((img): img is StoryImage => img !== null);

    const images =
      rawImages.length > 0
        ? rawImages
        : fbSection?.images?.length
          ? fbSection.images
          : undefined;

    return {
      heading,
      paragraphs,
      ...(images ? { images } : {}),
    };
  });
}

function normalizeBodyBlocks(
  rawBlocks: SanityRawBodyBlock[] | undefined,
  fallbackTitle: string,
): StoryBodyBlock[] | undefined {
  if (!rawBlocks?.length) {
    return undefined;
  }

  const result: StoryBodyBlock[] = [];

  for (const [index, block] of rawBlocks.entries()) {
    const key = block._key || `block-${index}`;

    if (block._type === "block" && block.children?.length) {
      const style =
        block.style === "h2" ||
        block.style === "h3" ||
        block.style === "blockquote"
          ? block.style
          : "normal";

      const children = block.children
        .filter((span) => typeof span.text === "string")
        .map((span, spanIdx) => ({
          _key: span._key || `${key}-span-${spanIdx}`,
          text: span.text ?? "",
          marks: span.marks,
        }));

      if (children.length === 0) {
        continue;
      }

      const markDefs = (block.markDefs ?? [])
        .filter((def) => def._type === "link" && typeof def.href === "string")
        .map((def, defIdx) => ({
          _key: def._key || `${key}-mark-${defIdx}`,
          _type: "link" as const,
          href: def.href ?? "#",
          blank: Boolean(def.blank),
        }));

      result.push({
        _key: key,
        _type: "block",
        style,
        listItem: block.listItem,
        children,
        markDefs: markDefs.length > 0 ? markDefs : undefined,
      });
    } else if (block._type === "image" && block.url) {
      const objectPosition =
        block.objectPosition ?? hotspotToObjectPosition(block.hotspot);
      result.push({
        _key: key,
        _type: "image",
        url: block.url,
        alt: block.alt || fallbackTitle,
        caption: block.caption,
        aspectRatio: block.aspectRatio || "16:9",
        ...(objectPosition ? { objectPosition } : {}),
      });
    } else if (block._type === "pullQuoteBlock" && block.text) {
      result.push({
        _key: key,
        _type: "pullQuoteBlock",
        text: block.text,
        attribution: block.attribution,
      });
    }
  }

  return result.length > 0 ? result : undefined;
}

function deriveSectionsFromBody(
  body: StoryBodyBlock[] | undefined,
): Array<{ heading: string; paragraphs: string[] }> {
  if (!body?.length) {
    return [];
  }

  const sections: Array<{ heading: string; paragraphs: string[] }> = [];
  let currentSection: { heading: string; paragraphs: string[] } | null = null;

  for (const block of body) {
    if (block._type !== "block") {
      continue;
    }
    const plainText = block.children
      .map((c) => c.text)
      .join("")
      .trim();
    if (!plainText) {
      continue;
    }

    if (block.style === "h2") {
      currentSection = { heading: plainText, paragraphs: [] };
      sections.push(currentSection);
    } else if (block.style === "normal") {
      if (!currentSection) {
        currentSection = { heading: "Overview", paragraphs: [] };
        sections.push(currentSection);
      }
      currentSection.paragraphs.push(plainText);
    }
  }

  return sections.filter((s) => Boolean(s.heading) && s.paragraphs.length > 0);
}

export function normalizeStory(
  raw: SanityRawStory | null | undefined,
): StoryEntry | null {
  if (!raw?.slug || !raw.title) {
    return null;
  }

  const fallbackMatch = fallbackStories.find(
    (entry) => entry.slug === raw.slug,
  );

  const category = resolveCategory(
    raw.category ?? undefined,
    fallbackMatch?.category,
  );
  const language: StoryLanguage =
    raw.language === "es"
      ? "es"
      : raw.language === "en"
        ? "en"
        : (fallbackMatch?.language ?? "en");
  const summary =
    raw.summary ||
    fallbackMatch?.summary ||
    "Stories from our work across India, Spain, and Europe.";
  const location = raw.location || fallbackMatch?.location || "India & Spain";

  const leadImageUrl = raw.leadImage?.url || fallbackMatch?.leadImage?.url;
  const leadImage: StoryImage | undefined = leadImageUrl
    ? {
        url: leadImageUrl,
        alt: raw.leadImage?.alt || fallbackMatch?.leadImage?.alt || raw.title,
        caption:
          raw.leadImage?.caption ??
          fallbackMatch?.leadImage?.caption ??
          undefined,
        objectPosition:
          raw.leadImage?.objectPosition ??
          hotspotToObjectPosition(raw.leadImage?.hotspot) ??
          fallbackMatch?.leadImage?.objectPosition ??
          undefined,
      }
    : undefined;

  const spanishLeadAlt =
    raw.leadImage?.spanishAlt ||
    raw.spanishLeadAlt ||
    fallbackMatch?.spanishLeadAlt ||
    undefined;
  const spanishLeadCaption =
    raw.leadImage?.spanishCaption ??
    raw.spanishLeadCaption ??
    fallbackMatch?.spanishLeadCaption ??
    undefined;

  const sanityPairItems = (raw.pairImages ?? [])
    .map((img, originalIdx) => {
      const fbImg = fallbackMatch?.pairImages?.[originalIdx];
      const url = img?.url || fbImg?.url;
      if (!url) {
        return null;
      }
      return {
        image: {
          url,
          alt: img?.alt || fbImg?.alt || raw.title || "Story image",
          caption: img?.caption ?? fbImg?.caption ?? undefined,
          objectPosition:
            img?.objectPosition ??
            hotspotToObjectPosition(img?.hotspot) ??
            fbImg?.objectPosition ??
            undefined,
        } satisfies StoryImage,
        spanishAlt:
          img?.spanishAlt ||
          raw.spanishPairAlts?.[originalIdx] ||
          fallbackMatch?.spanishPairAlts?.[originalIdx] ||
          "",
        spanishCaption:
          img?.spanishCaption ||
          raw.spanishPairCaptions?.[originalIdx] ||
          fallbackMatch?.spanishPairCaptions?.[originalIdx] ||
          "",
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  const pairImages =
    sanityPairItems.length > 0
      ? sanityPairItems.map((item) => item.image)
      : fallbackMatch?.pairImages;

  const resolvedSpanishPairAlts =
    sanityPairItems.length > 0
      ? sanityPairItems.map((item) => item.spanishAlt)
      : fallbackMatch?.pairImages?.map(
          (_, idx) =>
            raw.spanishPairAlts?.[idx] ||
            fallbackMatch?.spanishPairAlts?.[idx] ||
            "",
        );
  const spanishPairAlts = resolvedSpanishPairAlts?.some(Boolean)
    ? resolvedSpanishPairAlts
    : undefined;

  const resolvedSpanishPairCaptions =
    sanityPairItems.length > 0
      ? sanityPairItems.map((item) => item.spanishCaption)
      : fallbackMatch?.pairImages?.map(
          (_, idx) =>
            raw.spanishPairCaptions?.[idx] ||
            fallbackMatch?.spanishPairCaptions?.[idx] ||
            "",
        );
  const spanishPairCaptions = resolvedSpanishPairCaptions?.some(Boolean)
    ? resolvedSpanishPairCaptions
    : undefined;

  const firstSlot = raw.pairSlots?.[0];
  const secondSlot = raw.pairSlots?.[1];

  const body =
    normalizeBodyBlocks(raw.body ?? undefined, raw.title) ??
    fallbackMatch?.body;

  const explicitSections = normalizeSectionList(
    raw.sections ?? undefined,
    fallbackMatch?.sections,
    raw.title,
  );

  const derivedFromBody =
    explicitSections.length === 0 ? deriveSectionsFromBody(body) : [];
  const enrichedFromBody: StorySection[] = derivedFromBody.map((sec) => {
    const fbSection = matchFallbackSection(
      sec.heading,
      undefined,
      fallbackMatch?.sections,
    );
    return fbSection?.images?.length
      ? { ...sec, images: fbSection.images }
      : sec;
  });

  const sections =
    explicitSections.length > 0
      ? explicitSections
      : enrichedFromBody.length > 0
        ? enrichedFromBody
        : (fallbackMatch?.sections ?? []);

  const explicitSpanishSections = normalizeSectionList(
    raw.spanishSections ?? undefined,
    fallbackMatch?.spanishSections,
    raw.spanishTitle || raw.title,
  );
  const spanishSections =
    explicitSpanishSections.length > 0
      ? explicitSpanishSections
      : fallbackMatch?.spanishSections;

  const rawTags = (raw.tags ?? []).filter(
    (tag): tag is string => typeof tag === "string" && tag.trim().length > 0,
  );
  const tags =
    rawTags.length > 0
      ? rawTags
      : fallbackMatch?.tags?.length
        ? fallbackMatch.tags
        : [category];

  const rawSpanishTags = (raw.spanishTags ?? []).filter(
    (tag): tag is string => typeof tag === "string" && tag.trim().length > 0,
  );
  const spanishTags =
    rawSpanishTags.length > 0 ? rawSpanishTags : fallbackMatch?.spanishTags;

  const pullQuote = raw.pullQuote?.text
    ? {
        text: raw.pullQuote.text,
        attribution:
          raw.pullQuote.attribution ??
          fallbackMatch?.pullQuote?.attribution ??
          undefined,
      }
    : fallbackMatch?.pullQuote;

  const spanishPullQuote = raw.spanishPullQuote?.text
    ? {
        text: raw.spanishPullQuote.text,
        attribution:
          raw.spanishPullQuote.attribution ??
          fallbackMatch?.spanishPullQuote?.attribution ??
          undefined,
      }
    : fallbackMatch?.spanishPullQuote;

  const seoTitle = raw.seo?.title ?? fallbackMatch?.seo?.title ?? undefined;
  const seoDescription =
    raw.seo?.description ?? fallbackMatch?.seo?.description ?? undefined;
  const seoSpanishTitle =
    raw.seo?.spanishTitle ?? fallbackMatch?.seo?.spanishTitle ?? undefined;
  const seoSpanishDescription =
    raw.seo?.spanishDescription ??
    fallbackMatch?.seo?.spanishDescription ??
    undefined;
  const seo =
    seoTitle || seoDescription || seoSpanishTitle || seoSpanishDescription
      ? {
          ...(seoTitle ? { title: seoTitle } : {}),
          ...(seoDescription ? { description: seoDescription } : {}),
          ...(seoSpanishTitle ? { spanishTitle: seoSpanishTitle } : {}),
          ...(seoSpanishDescription
            ? { spanishDescription: seoSpanishDescription }
            : {}),
        }
      : undefined;

  return {
    slug: raw.slug,
    featured: raw.featured ?? fallbackMatch?.featured ?? false,
    newsletterEligible:
      raw.newsletterEligible ?? fallbackMatch?.newsletterEligible ?? true,
    language,
    issueNumber: raw.issueNumber || fallbackMatch?.issueNumber || "01",
    publishedAt:
      raw.publishedAt ||
      fallbackMatch?.publishedAt ||
      new Date().toISOString().slice(0, 10),
    readingTimeMinutes:
      raw.readingTimeMinutes ?? fallbackMatch?.readingTimeMinutes ?? 5,
    category,
    location,
    spanishLocation:
      raw.spanishLocation ?? fallbackMatch?.spanishLocation ?? undefined,
    title: raw.title,
    spanishTitle: raw.spanishTitle ?? fallbackMatch?.spanishTitle ?? undefined,
    summary,
    spanishSummary:
      raw.spanishSummary ?? fallbackMatch?.spanishSummary ?? undefined,
    author: {
      name: raw.author?.name || fallbackMatch?.author.name || "Alma & Shirish",
      role:
        raw.author?.role ||
        fallbackMatch?.author.role ||
        "Co-founders, KarmaRise D Global",
      spanishRole:
        raw.author?.spanishRole ??
        fallbackMatch?.author.spanishRole ??
        undefined,
      location:
        raw.author?.location || fallbackMatch?.author.location || location,
      spanishLocation:
        raw.author?.spanishLocation ??
        fallbackMatch?.author.spanishLocation ??
        undefined,
      portraitUrl:
        raw.author?.portraitUrl ||
        fallbackMatch?.author.portraitUrl ||
        "/images/alma-and-shirish-avatar.jpg",
    },
    tags,
    spanishTags,
    leadImage,
    spanishLeadAlt,
    spanishLeadCaption,
    leadSlot: {
      kind: raw.leadSlot?.kind ?? fallbackMatch?.leadSlot.kind ?? "Photo",
      ratio:
        raw.leadSlot?.ratio ??
        fallbackMatch?.leadSlot.ratio ??
        "16:10 horizontal",
      title: raw.leadSlot?.title || fallbackMatch?.leadSlot.title || raw.title,
      description:
        raw.leadSlot?.description ||
        fallbackMatch?.leadSlot.description ||
        summary,
    },
    pullQuote,
    spanishPullQuote,
    pairImages,
    spanishPairAlts,
    spanishPairCaptions,
    pairSlots: [
      {
        title:
          firstSlot?.title ||
          fallbackMatch?.pairSlots[0].title ||
          `${raw.title} detail one`,
        description:
          firstSlot?.description ||
          fallbackMatch?.pairSlots[0].description ||
          summary,
      },
      {
        title:
          secondSlot?.title ||
          fallbackMatch?.pairSlots[1].title ||
          `${raw.title} detail two`,
        description:
          secondSlot?.description ||
          fallbackMatch?.pairSlots[1].description ||
          summary,
      },
    ],
    body,
    sections,
    spanishSections,
    takeaway: raw.takeaway ?? fallbackMatch?.takeaway ?? "",
    spanishTakeaway:
      raw.spanishTakeaway ?? fallbackMatch?.spanishTakeaway ?? undefined,
    seo,
  };
}

export interface FetchSanityOptions {
  cache?: RequestCache;
  revalidate?: number;
  tags?: string[];
}

function getSanityProjectConfig(): {
  projectId: string;
  dataset: string;
} | null {
  const projectId =
    process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() ||
    process.env.SANITY_PROJECT_ID?.trim() ||
    "";
  if (!projectId) {
    return null;
  }
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() ||
    process.env.SANITY_DATASET?.trim() ||
    "production";
  return { projectId, dataset };
}

function compareStoryPublishDatesDesc(a: StoryEntry, b: StoryEntry): number {
  const timeA = Date.parse(a.publishedAt);
  const timeB = Date.parse(b.publishedAt);
  if (!Number.isNaN(timeA) && !Number.isNaN(timeB) && timeA !== timeB) {
    return timeB - timeA;
  }
  return b.publishedAt.localeCompare(a.publishedAt);
}

export async function fetchSanity<T>(
  query: string,
  params: Record<string, string | number> = {},
  options: FetchSanityOptions = {},
): Promise<T | null> {
  const config = getSanityProjectConfig();
  if (!config) {
    return null;
  }

  const searchParams = new URLSearchParams({
    query,
    perspective: "published",
  });
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const token = process.env.SANITY_API_KEY?.trim();
  const useCdn = options.cache !== "no-store";
  const host = useCdn
    ? `${config.projectId}.apicdn.sanity.io`
    : `${config.projectId}.api.sanity.io`;
  const url = `https://${host}/v${SANITY_API_VERSION}/data/query/${config.dataset}?${searchParams.toString()}`;

  const fetchInit: RequestInit & {
    next?: { revalidate?: number; tags?: string[] };
  } = {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  };

  if (options.cache === "no-store") {
    fetchInit.cache = "no-store";
  } else {
    fetchInit.next = {
      revalidate: options.revalidate ?? 300,
      tags: options.tags ?? ["stories"],
    };
  }

  try {
    const response = await fetch(url, fetchInit);

    if (!response.ok) {
      console.error("Sanity query failed:", response.status);
      return null;
    }

    const data = (await response.json()) as { result?: T };
    return data.result ?? null;
  } catch (error) {
    console.error("Sanity request error:", error);
    return null;
  }
}

/** Patches fields on a Sanity document using SANITY_API_KEY. */
export async function patchSanityDocument(
  documentId: string,
  setFields: Record<string, unknown>,
  incFields?: Record<string, number>,
): Promise<boolean> {
  const config = getSanityProjectConfig();
  const token = process.env.SANITY_API_KEY?.trim();

  if (!config || !token) {
    return false;
  }

  const url = `https://${config.projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${config.dataset}`;
  const patch: Record<string, unknown> = {
    id: documentId,
    set: setFields,
  };
  if (incFields && Object.keys(incFields).length > 0) {
    patch.inc = incFields;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ mutations: [{ patch }] }),
    });
    return response.ok;
  } catch (error) {
    console.error("Sanity mutation failed:", error);
    return false;
  }
}

/** Fetches a NewsletterIssue document by ID from Sanity. */
export async function getNewsletterIssueById(
  id: string,
): Promise<SanityNewsletterIssue | null> {
  return fetchSanity<SanityNewsletterIssue>(
    NEWSLETTER_ISSUE_BY_ID_QUERY,
    { id },
    { cache: "no-store" },
  );
}

function toStorySummary(story: StoryEntry): StoryEntry {
  return {
    slug: story.slug,
    featured: story.featured,
    newsletterEligible: story.newsletterEligible,
    language: story.language,
    issueNumber: story.issueNumber,
    publishedAt: story.publishedAt,
    readingTimeMinutes: story.readingTimeMinutes,
    category: story.category,
    location: story.location,
    spanishLocation: story.spanishLocation,
    title: story.title,
    spanishTitle: story.spanishTitle,
    summary: story.summary,
    spanishSummary: story.spanishSummary,
    author: story.author,
    tags: story.tags,
    spanishTags: story.spanishTags,
    leadImage: story.leadImage,
    spanishLeadAlt: story.spanishLeadAlt,
    spanishLeadCaption: story.spanishLeadCaption,
    leadSlot: story.leadSlot,
    pairSlots: story.pairSlots,
    sections: [],
    takeaway: "",
  };
}

function mergeWithFallbackStories(normalized: StoryEntry[]): StoryEntry[] {
  const seenSlugs = new Set(normalized.map((entry) => entry.slug));
  const missingLocalStories = fallbackStories.filter(
    (entry) => !seenSlugs.has(entry.slug),
  );

  if (missingLocalStories.length === 0) {
    return normalized;
  }

  return [...normalized, ...missingLocalStories].sort((a, b) => {
    if (Boolean(a.featured) !== Boolean(b.featured)) {
      return a.featured ? -1 : 1;
    }
    return compareStoryPublishDatesDesc(a, b);
  });
}

/** Fetches published Stories from Sanity merged with any local static Stories not yet synced to Sanity. */
export const getStories = cache(async (): Promise<StoryEntry[]> => {
  const rawStories = await fetchSanity<SanityRawStory[]>(ALL_STORIES_QUERY);
  if (!rawStories?.length) {
    return fallbackStories;
  }

  const normalized = rawStories
    .map((entry) => normalizeStory(entry))
    .filter((entry): entry is StoryEntry => entry !== null);

  if (normalized.length === 0) {
    return fallbackStories;
  }

  return mergeWithFallbackStories(normalized);
});

/** Fetches lightweight Story summaries (without body/sections) for index grids, related strips, and sitemaps. */
export const getStorySummaries = cache(async (): Promise<StoryEntry[]> => {
  const rawStories = await fetchSanity<SanityRawStory[]>(
    ALL_STORY_SUMMARIES_QUERY,
  );
  if (!rawStories?.length) {
    return fallbackStories.map(toStorySummary);
  }

  const normalized = rawStories
    .map((entry) => normalizeStory(entry))
    .filter((entry): entry is StoryEntry => entry !== null);

  if (normalized.length === 0) {
    return fallbackStories.map(toStorySummary);
  }

  return mergeWithFallbackStories(normalized).map(toStorySummary);
});

/** Fetches one Story by slug from Sanity, falling back to static Stories if unavailable. */
export const getStoryBySlug = cache(
  async (slug: string): Promise<StoryEntry | undefined> => {
    const rawStory = await fetchSanity<SanityRawStory>(STORY_BY_SLUG_QUERY, {
      slug,
    });
    const normalized = normalizeStory(rawStory);
    if (normalized) {
      return normalized;
    }

    return fallbackStories.find((entry) => entry.slug === slug);
  },
);
