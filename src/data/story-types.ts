export type StoryCategory =
  | "Heritage & Culture"
  | "Sustainable Fashion"
  | "People & Craftsmanship"
  | "Art & Design"
  | "India Meets Europe"
  | "Inside KarmaRise"
  | "KarmaRise Journal";

export type StoryLanguage = "en" | "es";

export interface StoryCategoryDetail {
  slug: string;
  title: StoryCategory;
  displayTitle: string;
  spanishTitle: string;
  shortLabel: string;
  description: string;
  spanishDescription: string;
  coverImage: string;
  coverAlt: string;
  spanishCoverAlt?: string;
}

export interface StoryImage {
  url: string;
  alt: string;
  caption?: string;
  aspectRatio?: "16:9" | "4:3" | "4:5";
  objectPosition?: string;
}

export interface StoryAuthor {
  name: string;
  role: string;
  spanishRole?: string;
  location: string;
  spanishLocation?: string;
  portraitUrl?: string;
}

export interface StoryPullQuote {
  text: string;
  attribution?: string;
}

export interface StoryTextSpan {
  _key: string;
  text: string;
  marks?: string[];
}

export interface StoryMarkDef {
  _key: string;
  _type: "link";
  href: string;
  blank?: boolean;
}

export type StoryBodyBlock =
  | {
      _key: string;
      _type: "block";
      style: "normal" | "h2" | "h3" | "blockquote";
      listItem?: "bullet" | "number";
      children: StoryTextSpan[];
      markDefs?: StoryMarkDef[];
    }
  | {
      _key: string;
      _type: "image";
      url: string;
      alt: string;
      caption?: string;
      aspectRatio?: "16:9" | "4:3" | "4:5";
      objectPosition?: string;
    }
  | {
      _key: string;
      _type: "pullQuoteBlock";
      text: string;
      attribution?: string;
    };

export interface StorySection {
  heading: string;
  paragraphs: string[];
  images?: StoryImage[];
}

export interface StorySummary {
  slug: string;
  featured?: boolean;
  newsletterEligible?: boolean;
  language: StoryLanguage;
  issueNumber: string;
  publishedAt: string;
  updatedAt?: string;
  readingTimeMinutes: number;
  category: StoryCategory;
  location: string;
  spanishLocation?: string;
  title: string;
  spanishTitle?: string;
  summary: string;
  spanishSummary?: string;
  author: StoryAuthor;
  tags: string[];
  spanishTags?: string[];
  leadImage?: StoryImage;
  spanishLeadAlt?: string;
  spanishLeadCaption?: string;
  leadSlot: {
    kind: "Photo" | "Video" | "Photo or video";
    ratio: string;
    title: string;
    description: string;
  };
  pairSlots: [
    {
      title: string;
      description: string;
    },
    {
      title: string;
      description: string;
    },
  ];
}

export interface StoryEntry extends StorySummary {
  pullQuote?: StoryPullQuote;
  spanishPullQuote?: StoryPullQuote;
  pairImages?: StoryImage[];
  spanishPairAlts?: string[];
  spanishPairCaptions?: string[];
  body?: StoryBodyBlock[];
  spanishBody?: StoryBodyBlock[];
  sections: StorySection[];
  spanishSections?: StorySection[];
  takeaway: string;
  spanishTakeaway?: string;
  seo?: {
    title?: string;
    description?: string;
    spanishTitle?: string;
    spanishDescription?: string;
  };
}

export const storyCategoryDetails: StoryCategoryDetail[] = [
  {
    slug: "heritage-and-culture",
    title: "Heritage & Culture",
    displayTitle: "Heritage & Culture",
    spanishTitle: "Cultura y raíces",
    shortLabel: "Heritage",
    description:
      "India's craft regions, handloom towns in Maharashtra, and local history that still shapes how we work today.",
    spanishDescription:
      "Regiones artesanas de la India, pueblos de telar manual en Maharashtra e historia local que explica cómo trabajamos hoy.",
    coverImage: "/images/culture/maharashtra-basalt-fort-valley.jpg",
    coverAlt:
      "Historic basalt fort walls and courtyard rising above the valley in Maharashtra, India",
    spanishCoverAlt:
      "Murallas y patio de un fuerte histórico de basalto sobre el valle en Maharashtra, India",
  },
  {
    slug: "sustainable-fashion",
    title: "Sustainable Fashion",
    displayTitle: "Sustainable Fashion",
    spanishTitle: "Moda sostenible",
    shortLabel: "Sustainability",
    description:
      "How we build AlmaRise D Brand for Spain and the rest of Europe: AlmaRise D Reborn from kept Indian sarees, AlmaRise D Home Decor, and AlmaRise D Organic with organic dyes and plant or fruit-waste fabrics, among others.",
    spanishDescription:
      "Cómo levantamos AlmaRise D Brand para España y el resto de Europa: AlmaRise D Reborn con saris que mujeres indias han guardado, decoración del hogar y AlmaRise D Organic con tintes orgánicos y tejidos de residuos de fruta y plantas, entre otros.",
    coverImage:
      "/images/almarise/almarise-reborn-olive-pallu-shrug-madrid-street.jpeg",
    coverAlt:
      "Contemporary everyday garment cut from an Indian saree with striped purple sleeves and paisley border worn in Spain",
    spanishCoverAlt:
      "Prenda de uso diario confeccionada a partir de un sari indio con mangas listadas y cenefa de cachemira en España",
  },
  {
    slug: "people-and-craftsmanship",
    title: "People & Craftsmanship",
    displayTitle: "People & Craftsmanship",
    spanishTitle: "Oficios y artesanía",
    shortLabel: "Craftsmanship",
    description:
      "Inside the tanneries, leather ateliers, family-run factories, production units, and women artisan collectives we audit in person across Kolkata, Kanpur, Agra, Chennai, and Maharashtra.",
    spanishDescription:
      "Por dentro de las curtidurías, marroquineros, fábricas de corte familiar, unidades de producción y colectivos de artesanas que auditamos en persona entre Calcuta, Kanpur, Agra, Chennai y Maharashtra.",
    coverImage: "/images/workshops/shirish-leather-strap-workshop-india.jpg",
    coverAlt:
      "Shirish standing beside a master machinist stitching a leather strap inside an Indian leather atelier",
    spanishCoverAlt:
      "Shirish junto a un maestro marroquinero cosiendo una correa de piel en un punto de producción en la India",
  },
  {
    slug: "art-and-design",
    title: "Art & Design",
    displayTitle: "Art & Design",
    spanishTitle: "Diseño y materiales",
    shortLabel: "Design",
    description:
      "How a Product Brief turns into an approved physical sample in hand, from physical colour swatches and ergonomic hardware choices to pattern fitting on the ground in India.",
    spanishDescription:
      "El camino que recorre un briefing de producto hasta convertirse en muestra física aprobada en tu mano, pasando por la muestra física de color, los herrajes y los ajustes de patrón.",
    coverImage: "/images/workshops/alma-reviewing-leather-hides-workshop.jpeg",
    coverAlt:
      "Alma inspecting a leather bag prototype against full-grain hides at an Indian production site",
    spanishCoverAlt:
      "Alma revisando un prototipo de bolso sobre pieles naturales en un punto de producción en la India",
  },
  {
    slug: "india-meets-europe",
    title: "India Meets Europe",
    displayTitle: "India Meets Europe",
    spanishTitle: "Entre India y Europa",
    shortLabel: "India & Europe",
    description:
      "How Alma and Shirish work with retail shops and brands in Spain and the rest of Europe, alongside meals, schedules, and hospitality across both countries.",
    spanishDescription:
      "Cómo coordinamos proyectos con comercios y marcas de España y el resto de Europa, junto a comidas, horarios y hospitalidad en ambos lados.",
    coverImage: "/images/founders/alma-and-shirish-founders.jpg",
    coverAlt:
      "Shirish and Alma reviewing written Product Brief notes alongside leather and fabric swatches in India",
    spanishCoverAlt:
      "Shirish y Alma revisando anotaciones de un briefing de producto junto a muestras de piel y telas en la India",
  },
  {
    slug: "inside-karmarise",
    title: "Inside KarmaRise",
    displayTitle: "Inside KarmaRise",
    spanishTitle: "Día a día en KarmaRise",
    shortLabel: "Inside KarmaRise",
    description:
      "Honest notes from our studio in India, completed Bulk Order dispatches, and our groundwork for the planned Women's Training Initiative.",
    spanishDescription:
      "Avances reales desde nuestro estudio en la India, pedidos de producción entregados y los preparativos de nuestra futura Iniciativa de formación para mujeres.",
    coverImage: "/images/founders/shirish-co-founder-office-india.jpeg",
    coverAlt:
      "Shirish at the review desk in an Indian leather production unit surrounded by samples",
    spanishCoverAlt:
      "Shirish en la mesa de revisión de una unidad de producción de marroquinería en la India rodeado de muestras",
  },
];

export const storyCategories: ("All Stories" | StoryCategory)[] = [
  "All Stories",
  ...storyCategoryDetails.map((item) => item.title),
];

export function getCategoryDetail(
  category: StoryCategory,
): StoryCategoryDetail {
  const normalizedCategory: StoryCategory =
    category === "KarmaRise Journal" ? "Inside KarmaRise" : category;
  return (
    storyCategoryDetails.find((item) => item.title === normalizedCategory) ??
    storyCategoryDetails[5]!
  );
}

export function getCategoryBySlug(
  rawSlug: string | null,
): StoryCategory | null {
  if (!rawSlug) {
    return null;
  }
  const normalized = rawSlug.trim().toLowerCase();
  if (!normalized) {
    return null;
  }
  if (normalized === "karmarise-journal") {
    return "Inside KarmaRise";
  }
  const match = storyCategoryDetails.find((item) => item.slug === normalized);
  return match ? match.title : null;
}

export function getLocalizedCategory(
  category: StoryCategory,
  lang: StoryLanguage,
): {
  title: string;
  description: string;
  coverAlt: string;
} {
  const detail = getCategoryDetail(category);
  if (lang === "es") {
    return {
      title: detail.spanishTitle,
      description: detail.spanishDescription,
      coverAlt: detail.spanishCoverAlt || detail.coverAlt,
    };
  }
  return {
    title: detail.displayTitle,
    description: detail.description,
    coverAlt: detail.coverAlt,
  };
}

export function getLocalizedStory(
  story: StorySummary & Partial<StoryEntry>,
  lang: StoryLanguage,
): {
  title: string;
  summary: string;
  location: string;
  categoryLabel: string;
  authorRole: string;
  authorLocation: string;
  tags: string[];
  leadImage: StoryImage | undefined;
  pullQuote: StoryPullQuote | undefined;
  pairImages: StoryImage[] | undefined;
  sections: StorySection[];
  takeaway: string;
} {
  const isEs = lang === "es";
  const categoryLabel = getLocalizedCategory(story.category, lang).title;

  const leadImage = story.leadImage
    ? {
        ...story.leadImage,
        alt: isEs
          ? story.spanishLeadAlt || story.leadImage.alt
          : story.leadImage.alt,
        caption: isEs
          ? story.spanishLeadCaption || story.leadImage.caption
          : story.leadImage.caption,
      }
    : undefined;

  const pairImages = story.pairImages?.map((img, index) => ({
    ...img,
    alt: isEs ? story.spanishPairAlts?.[index] || img.alt : img.alt,
    caption: isEs
      ? story.spanishPairCaptions?.[index] || img.caption
      : img.caption,
  }));

  const defaultSections = story.sections ?? [];

  return {
    title: isEs ? story.spanishTitle || story.title : story.title,
    summary: isEs ? story.spanishSummary || story.summary : story.summary,
    location: isEs ? story.spanishLocation || story.location : story.location,
    categoryLabel,
    authorRole: isEs
      ? story.author.spanishRole || story.author.role
      : story.author.role,
    authorLocation: isEs
      ? story.author.spanishLocation || story.author.location
      : story.author.location,
    tags: isEs ? story.spanishTags || story.tags : story.tags,
    leadImage,
    pullQuote: isEs
      ? story.spanishPullQuote || story.pullQuote
      : story.pullQuote,
    pairImages,
    sections: isEs
      ? story.spanishSections && story.spanishSections.length > 0
        ? story.spanishSections
        : defaultSections
      : defaultSections,
    takeaway: isEs
      ? story.spanishTakeaway || (story.takeaway ?? "")
      : (story.takeaway ?? ""),
  };
}

export function formatStoryDate(
  isoDate: string,
  lang: StoryLanguage = "en",
): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
