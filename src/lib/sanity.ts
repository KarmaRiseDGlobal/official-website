import {
  stories as fallbackStories,
  type StoryBodyBlock,
  type StoryCategory,
  type StoryEntry,
  type StoryImage,
  type StoryLanguage,
} from "@/data/stories";

const SANITY_API_VERSION = "2025-01-01";

const VALID_CATEGORIES = new Set<StoryCategory>([
  "Heritage & Culture",
  "Sustainable Fashion",
  "People & Craftsmanship",
  "Art & Design",
  "India Meets Europe",
  "KarmaRise Journal",
]);

const LEGACY_CATEGORY_MAP: Record<string, StoryCategory> = {
  "Working across distance": "India Meets Europe",
  "Materials and sampling": "Art & Design",
  "Manufacturing and people": "People & Craftsmanship",
  "Company progress": "KarmaRise Journal",
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
  text?: string;
  attribution?: string;
}

interface SanityRawStory {
  slug?: string;
  featured?: boolean;
  newsletterEligible?: boolean;
  language?: string;
  issueNumber?: string;
  publishedAt?: string;
  readingTimeMinutes?: number;
  category?: string;
  location?: string;
  title?: string;
  spanishTitle?: string;
  summary?: string;
  spanishSummary?: string;
  author?: {
    name?: string;
    role?: string;
    location?: string;
    portraitUrl?: string;
  };
  tags?: string[];
  leadImage?: { url?: string; alt?: string; caption?: string };
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
  pairImages?: Array<{ url?: string; alt?: string; caption?: string }>;
  pairSlots?: Array<{ title?: string; description?: string }>;
  body?: SanityRawBodyBlock[];
  sections?: Array<{ heading?: string; paragraphs?: string[] }>;
  takeaway?: string;
  seo?: {
    title?: string;
    description?: string;
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
    readingTimeMinutes?: number;
    leadImageUrl?: string;
  }>;
}

const STORY_PROJECTION = `{
  "slug": slug.current,
  featured,
  newsletterEligible,
  language,
  issueNumber,
  publishedAt,
  readingTimeMinutes,
  category,
  location,
  title,
  spanishTitle,
  summary,
  spanishSummary,
  "author": {
    "name": coalesce(authorRef->name, author.name, "Alma & Shirish"),
    "role": coalesce(authorRef->role, author.role, "Co-founders, KarmaRise D Global"),
    "location": coalesce(authorRef->location, author.location, location, "Spain & Maharashtra"),
    "portraitUrl": authorRef->portrait.asset->url
  },
  tags,
  "leadImage": select(
    defined(leadImage.asset->url) => {
      "url": leadImage.asset->url,
      "alt": coalesce(leadImage.alt, title),
      "caption": leadImage.caption
    }
  ),
  leadSlot,
  pullQuote,
  "pairImages": pairImages[]{
    "url": asset->url,
    "alt": coalesce(alt, ^.title),
    "caption": caption
  },
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
    text,
    attribution
  },
  sections,
  takeaway,
  seo
}`;

const ALL_STORIES_QUERY = `*[_type == "story" && defined(slug.current)] | order(coalesce(featured, false) desc, coalesce(publishedAt, _createdAt) desc) ${STORY_PROJECTION}`;
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
    readingTimeMinutes,
    "leadImageUrl": leadImage.asset->url
  }
}`;

function resolveCategory(rawCategory: string | undefined): StoryCategory {
  if (rawCategory && VALID_CATEGORIES.has(rawCategory as StoryCategory)) {
    return rawCategory as StoryCategory;
  }
  if (rawCategory && rawCategory in LEGACY_CATEGORY_MAP) {
    return LEGACY_CATEGORY_MAP[rawCategory]!;
  }
  return "KarmaRise Journal";
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
      result.push({
        _key: key,
        _type: "image",
        url: block.url,
        alt: block.alt || fallbackTitle,
        caption: block.caption,
        aspectRatio: block.aspectRatio || "16:9",
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

function normalizeStory(
  raw: SanityRawStory | null | undefined,
): StoryEntry | null {
  if (!raw?.slug || !raw.title) {
    return null;
  }

  const fallbackMatch = fallbackStories.find(
    (entry) => entry.slug === raw.slug,
  );

  const category = resolveCategory(raw.category ?? fallbackMatch?.category);
  const language: StoryLanguage = raw.language === "es" ? "es" : "en";
  const summary =
    raw.summary ||
    fallbackMatch?.summary ||
    "Notes from our worktables in Spain and Maharashtra.";
  const location =
    raw.location || fallbackMatch?.location || "Spain & Maharashtra";

  const leadImage: StoryImage | undefined = raw.leadImage?.url
    ? {
        url: raw.leadImage.url,
        alt: raw.leadImage.alt || raw.title,
        caption: raw.leadImage.caption,
      }
    : fallbackMatch?.leadImage;

  const sanityPairImages = (raw.pairImages ?? [])
    .filter((img): img is { url: string; alt?: string; caption?: string } =>
      Boolean(img?.url),
    )
    .map((img) => ({
      url: img.url,
      alt: img.alt || raw.title || "Story image",
      caption: img.caption,
    }));

  const pairImages =
    sanityPairImages.length > 0 ? sanityPairImages : fallbackMatch?.pairImages;

  const firstSlot = raw.pairSlots?.[0] ?? fallbackMatch?.pairSlots[0];
  const secondSlot = raw.pairSlots?.[1] ?? fallbackMatch?.pairSlots[1];

  const body = normalizeBodyBlocks(raw.body, raw.title);

  const explicitSections = (raw.sections ?? [])
    .filter((section) => Boolean(section.heading && section.paragraphs?.length))
    .map((section) => ({
      heading: section.heading ?? "",
      paragraphs: (section.paragraphs ?? []).filter(Boolean),
    }));

  const sections =
    explicitSections.length > 0
      ? explicitSections
      : deriveSectionsFromBody(body).length > 0
        ? deriveSectionsFromBody(body)
        : (fallbackMatch?.sections ?? []);

  return {
    slug: raw.slug,
    featured: Boolean(raw.featured),
    newsletterEligible: raw.newsletterEligible ?? true,
    language,
    issueNumber: raw.issueNumber || fallbackMatch?.issueNumber || "Edition 01",
    publishedAt:
      raw.publishedAt ||
      fallbackMatch?.publishedAt ||
      new Date().toISOString().slice(0, 10),
    readingTimeMinutes:
      raw.readingTimeMinutes || fallbackMatch?.readingTimeMinutes || 5,
    category,
    location,
    title: raw.title,
    spanishTitle: raw.spanishTitle || fallbackMatch?.spanishTitle,
    summary,
    spanishSummary: raw.spanishSummary || fallbackMatch?.spanishSummary,
    author: {
      name: raw.author?.name || fallbackMatch?.author.name || "Alma & Shirish",
      role:
        raw.author?.role ||
        fallbackMatch?.author.role ||
        "Co-founders, KarmaRise D Global",
      location:
        raw.author?.location || fallbackMatch?.author.location || location,
      portraitUrl:
        raw.author?.portraitUrl ||
        fallbackMatch?.author.portraitUrl ||
        "/images/alma-and-shirish-founders.jpg",
    },
    tags:
      raw.tags && raw.tags.length > 0
        ? raw.tags
        : (fallbackMatch?.tags ?? [category]),
    leadImage,
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
    pullQuote: raw.pullQuote?.text
      ? {
          text: raw.pullQuote.text,
          attribution: raw.pullQuote.attribution,
        }
      : fallbackMatch?.pullQuote,
    pairImages,
    pairSlots: [
      {
        title: firstSlot?.title || `${raw.title} detail one`,
        description: firstSlot?.description || summary,
      },
      {
        title: secondSlot?.title || `${raw.title} detail two`,
        description: secondSlot?.description || summary,
      },
    ],
    body,
    sections,
    takeaway: raw.takeaway || fallbackMatch?.takeaway || "",
    seo: raw.seo ?? fallbackMatch?.seo,
  };
}

export async function fetchSanity<T>(
  query: string,
  params: Record<string, string | number> = {},
): Promise<T | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim();
  if (!projectId || !dataset) {
    return null;
  }

  const searchParams = new URLSearchParams({ query });
  for (const [key, value] of Object.entries(params)) {
    searchParams.set(`$${key}`, JSON.stringify(value));
  }

  const token = process.env.SANITY_API_KEY?.trim();
  const url = `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${dataset}?${searchParams.toString()}`;

  try {
    const response = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      next: { revalidate: 30, tags: ["stories"] },
    });

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
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim();
  const dataset =
    process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
  const token = process.env.SANITY_API_KEY?.trim();

  if (!projectId || !token) {
    return false;
  }

  const url = `https://${projectId}.api.sanity.io/v${SANITY_API_VERSION}/data/mutate/${dataset}`;
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
  return fetchSanity<SanityNewsletterIssue>(NEWSLETTER_ISSUE_BY_ID_QUERY, {
    id,
  });
}

/** Fetches published Stories from Sanity, falling back to static Stories only when Sanity has no published Stories. */
export async function getStories(): Promise<StoryEntry[]> {
  const rawStories = await fetchSanity<SanityRawStory[]>(ALL_STORIES_QUERY);
  if (!rawStories?.length) {
    return fallbackStories;
  }

  const normalized = rawStories
    .map((entry) => normalizeStory(entry))
    .filter((entry): entry is StoryEntry => entry !== null);

  return normalized.length > 0 ? normalized : fallbackStories;
}

/** Fetches one Story by slug from Sanity, falling back to static Stories if unavailable. */
export async function getStoryBySlug(
  slug: string,
): Promise<StoryEntry | undefined> {
  const rawStory = await fetchSanity<SanityRawStory>(STORY_BY_SLUG_QUERY, {
    slug,
  });
  const normalized = normalizeStory(rawStory);
  if (normalized) {
    return normalized;
  }

  return fallbackStories.find((entry) => entry.slug === slug);
}
