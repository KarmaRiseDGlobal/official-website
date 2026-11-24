import type { StoryCategory } from "@/data/story-types";

export const NEWSLETTER_TRACKS = ["manufacturing", "almarise"] as const;

export type NewsletterTrack = (typeof NEWSLETTER_TRACKS)[number];
export type NewsletterFormMode = NewsletterTrack | "choose";
export type NewsletterIssueTrack = NewsletterTrack | "all";
export type NewsletterNarrator = "alma" | "shirish" | "both";
export type NewsletterIssueFormat = "letter" | "digest";

export function isNewsletterTrack(value: unknown): value is NewsletterTrack {
  return value === "manufacturing" || value === "almarise";
}

export function normalizeNewsletterTracks(raw: unknown): NewsletterTrack[] {
  const candidates: string[] = [];

  if (Array.isArray(raw)) {
    for (const item of raw) {
      if (typeof item === "string") {
        candidates.push(item.trim().toLowerCase());
      }
    }
  } else if (typeof raw === "string") {
    for (const part of raw.split(",")) {
      const trimmed = part.trim().toLowerCase();
      if (trimmed) {
        candidates.push(trimmed);
      }
    }
  }

  const seen = new Set<NewsletterTrack>();
  for (const item of candidates) {
    if (
      item === "manufacturing" ||
      item === "track-a" ||
      item === "track_a" ||
      item === "manufacturing in india" ||
      item === "fabricacion"
    ) {
      seen.add("manufacturing");
    } else if (
      item === "almarise" ||
      item === "almarise d brand" ||
      item === "track-b" ||
      item === "track_b" ||
      item === "almarise & culture" ||
      item === "almarise d brand & culture" ||
      item === "culture"
    ) {
      seen.add("almarise");
    } else if (item === "both" || item === "all") {
      seen.add("manufacturing");
      seen.add("almarise");
    }
  }

  return NEWSLETTER_TRACKS.filter((track) => seen.has(track));
}

export function formatNewsletterInterest(
  tracks: readonly NewsletterTrack[],
): string {
  const hasManufacturing = tracks.includes("manufacturing");
  const hasAlmarise = tracks.includes("almarise");

  if (hasManufacturing && hasAlmarise) {
    return "Manufacturing & AlmaRise D Brand";
  }
  if (hasManufacturing) {
    return "Manufacturing in India";
  }
  if (hasAlmarise) {
    return "AlmaRise D Brand & Culture";
  }
  return "KarmaRise Stories";
}

export function getTrackForStory(story: {
  slug: string;
  category: StoryCategory;
}): NewsletterTrack {
  if (story.slug === "from-spain-to-a-cutting-table-in-india") {
    return "manufacturing";
  }
  if (
    story.category === "People & Craftsmanship" ||
    story.category === "Art & Design"
  ) {
    return "manufacturing";
  }
  return "almarise";
}

export function getWelcomeTrackCopy(
  _tracks: readonly NewsletterTrack[],
  language: "EN" | "ES",
): {
  trackLabel: string;
  trackNote: string;
} {
  const isEs = language === "ES";

  return isEs
    ? {
        trackLabel: "Historias de KarmaRise",
        trackNote:
          "Cada dos semanas te escribimos una carta breve firmada por Alma o por Shirish: alternamos historias reales desde talleres de fabricación en la India con relatos de AlmaRise D Brand, cultura cotidiana entre España e India y avances honestos de nuestra futura formación textil.",
      }
    : {
        trackLabel: "KarmaRise Stories",
        trackNote:
          "Every two weeks we send one short letter signed by Alma or Shirish, alternating between real fieldwork with Indian artisans and our Stories on AlmaRise D Brand, everyday life between Spain and India, and honest updates on our planned training work.",
      };
}
