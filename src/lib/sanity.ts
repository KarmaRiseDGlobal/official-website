import {
  stories as fallbackStories,
  type StoryCategory,
  type StoryEntry,
  type StoryImage,
} from "@/data/stories";

const SANITY_API_VERSION = "2025-01-01";

const VALID_CATEGORIES = new Set<StoryCategory>([
  "Manufacturing and people",
  "Materials and sampling",
  "Working across distance",
  "Company progress",
]);

interface SanityRawStory {
  slug?: string;
  featured?: boolean;
  category?: string;
  location?: string;
  title?: string;
  summary?: string;
  leadImage?: { url?: string; alt?: string };
  leadSlot?: {
    kind?: "Photo" | "Video" | "Photo or video";
    ratio?: string;
    title?: string;
    description?: string;
  };
  pairImages?: Array<{ url?: string; alt?: string }>;
  pairSlots?: Array<{ title?: string; description?: string }>;
  sections?: Array<{ heading?: string; paragraphs?: string[] }>;
  takeaway?: string;
}

const STORY_PROJECTION = `{
  "slug": slug.current,
  featured,
  category,
  location,
  title,
  summary,
  "leadImage": select(
    defined(leadImage.asset->url) => {
      "url": leadImage.asset->url,
      "alt": coalesce(leadImage.alt, title)
    }
  ),
  leadSlot,
  "pairImages": pairImages[]{
    "url": asset->url,
    "alt": coalesce(alt, ^.title)
  },
  pairSlots,
  sections,
  takeaway
}`;

const ALL_STORIES_QUERY = `*[_type == "story" && defined(slug.current)] | order(coalesce(featured, false) desc, coalesce(publishedAt, _createdAt) desc) ${STORY_PROJECTION}`;
const STORY_BY_SLUG_QUERY = `*[_type == "story" && slug.current == $slug][0] ${STORY_PROJECTION}`;

function normalizeStory(
  raw: SanityRawStory | null | undefined,
): StoryEntry | null {
  if (
    !raw?.slug ||
    !raw.title ||
    !raw.summary ||
    !raw.location ||
    !raw.takeaway
  ) {
    return null;
  }

  const category: StoryCategory = VALID_CATEGORIES.has(
    raw.category as StoryCategory,
  )
    ? (raw.category as StoryCategory)
    : "Company progress";

  const leadImage: StoryImage | undefined = raw.leadImage?.url
    ? {
        url: raw.leadImage.url,
        alt: raw.leadImage.alt || raw.title,
      }
    : undefined;

  const pairImages = (raw.pairImages ?? [])
    .filter((img): img is { url: string; alt?: string } => Boolean(img?.url))
    .map((img) => ({
      url: img.url,
      alt: img.alt || raw.title || "Story image",
    }));

  const firstSlot = raw.pairSlots?.[0];
  const secondSlot = raw.pairSlots?.[1];

  return {
    slug: raw.slug,
    featured: Boolean(raw.featured),
    category,
    location: raw.location,
    title: raw.title,
    summary: raw.summary,
    leadImage,
    leadSlot: {
      kind: raw.leadSlot?.kind ?? "Photo",
      ratio: raw.leadSlot?.ratio ?? "16:10 horizontal",
      title: raw.leadSlot?.title || raw.title,
      description: raw.leadSlot?.description || raw.summary,
    },
    pairImages: pairImages.length > 0 ? pairImages : undefined,
    pairSlots: [
      {
        title: firstSlot?.title || `${raw.title} detail one`,
        description: firstSlot?.description || raw.summary,
      },
      {
        title: secondSlot?.title || `${raw.title} detail two`,
        description: secondSlot?.description || raw.summary,
      },
    ],
    sections: (raw.sections ?? [])
      .filter((section) =>
        Boolean(section.heading && section.paragraphs?.length),
      )
      .map((section) => ({
        heading: section.heading ?? "",
        paragraphs: (section.paragraphs ?? []).filter(Boolean),
      })),
    takeaway: raw.takeaway,
  };
}

async function fetchSanity<T>(
  query: string,
  params: Record<string, string> = {},
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
      next: { revalidate: 60, tags: ["stories"] },
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

/** Fetches published Stories from Sanity, falling back to static Stories if empty. */
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
