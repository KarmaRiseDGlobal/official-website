import type { Metadata } from "next";

import type { StoryEntry } from "@/data/story-types";
import {
  localizePath,
  siteUrl,
  stripLocalePrefix,
  type SiteLanguage,
} from "@/lib/urls";

export { localizePath, siteUrl, stripLocalePrefix, type SiteLanguage };

export type StaticRouteKey =
  | "home"
  | "about"
  | "almarise"
  | "book-a-call"
  | "contact"
  | "cookie-policy"
  | "legal-notice"
  | "manufacturing"
  | "privacy-policy"
  | "product-brief"
  | "stories"
  | "terms"
  | "womens-training-initiative"
  | "how-we-work";

export type RouteKey = StaticRouteKey | "story-detail";

export interface StaticRouteEntry {
  readonly key: StaticRouteKey;
  readonly path: string;
  readonly changeFrequency: "weekly" | "monthly";
  readonly priority: number;
}

export const STATIC_ROUTES: readonly StaticRouteEntry[] = [
  { key: "home", path: "/", changeFrequency: "weekly", priority: 1 },
  {
    key: "manufacturing",
    path: "/manufacturing",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    key: "how-we-work",
    path: "/how-we-work",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  { key: "about", path: "/about", changeFrequency: "monthly", priority: 0.8 },
  {
    key: "stories",
    path: "/stories",
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    key: "almarise",
    path: "/almarise",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    key: "womens-training-initiative",
    path: "/womens-training-initiative",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    key: "product-brief",
    path: "/product-brief",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    key: "book-a-call",
    path: "/book-a-call",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    key: "contact",
    path: "/contact",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    key: "privacy-policy",
    path: "/privacy-policy",
    changeFrequency: "monthly",
    priority: 0.3,
  },
  { key: "terms", path: "/terms", changeFrequency: "monthly", priority: 0.3 },
  {
    key: "cookie-policy",
    path: "/cookie-policy",
    changeFrequency: "monthly",
    priority: 0.3,
  },
  {
    key: "legal-notice",
    path: "/legal-notice",
    changeFrequency: "monthly",
    priority: 0.3,
  },
];

interface LocalizedRouteMeta {
  readonly title: string | { readonly absolute: string };
  readonly description: string;
}

interface RouteMetaConfig {
  readonly path: string;
  readonly en: LocalizedRouteMeta;
  readonly es: LocalizedRouteMeta;
}

const ROUTE_METADATA: Record<StaticRouteKey, RouteMetaConfig> = {
  home: {
    path: "/",
    en: {
      title: {
        absolute: "Own-brand manufacturing in India | KarmaRise D Global",
      },
      description:
        "Manufacture own-brand leather bags, clothing, sewn accessories, and home decor in India with Alma and Shirish on site. Samples first. Start your brief.",
    },
    es: {
      title: {
        absolute: "Fabricación de marca propia en la India | KarmaRise",
      },
      description:
        "Fabrica en la India tus bolsos de piel, ropa, complementos y decoración del hogar con Alma y Shirish sobre el terreno. Muestra física primero. Empieza hoy.",
    },
  },
  about: {
    path: "/about",
    en: {
      title: {
        absolute: "Alma & Shirish: Spain-India Founders | KarmaRise",
      },
      description:
        "Meet Alma in Spain and Bar Council advocate Shirish in India, founders of KarmaRise D Global (Karmarise Global LLP). Book a free call or send your brief.",
    },
    es: {
      title: {
        absolute: "Quiénes somos: Alma y Shirish | KarmaRise D Global",
      },
      description:
        "Conoce a Alma en España y a Shirish, abogado del Bar Council en la India, fundadores de KarmaRise D Global (Karmarise Global LLP). Pide llamada o briefing.",
    },
  },
  almarise: {
    path: "/almarise",
    en: {
      title: {
        absolute: "AlmaRise D Brand: D Reborn, D Organic & Decor | KarmaRise",
      },
      description:
        "AlmaRise D Brand by KarmaRise D Global: AlmaRise D Reborn sarees, AlmaRise D Organic fabrics, and D Home Decor, made in India for Spain and the rest of Europe.",
    },
    es: {
      title: {
        absolute: "AlmaRise D Brand: D Reborn, D Organic y hogar | KarmaRise",
      },
      description:
        "AlmaRise D Brand de KarmaRise D Global: prendas AlmaRise D Reborn de saris, tejidos AlmaRise D Organic y decoración del hogar para España y el resto de Europa.",
    },
  },
  "book-a-call": {
    path: "/book-a-call",
    en: {
      title: {
        absolute: "Book an India Manufacturing Call with Alma | KarmaRise",
      },
      description:
        "Book a free 15-min or 30-min Google Meet call with Alma in English, Spanish, or Portuguese to discuss your Product Brief and manufacturing in India.",
    },
    es: {
      title: {
        absolute: "Reservar videollamada: fabricación en la India | KarmaRise",
      },
      description:
        "Reserva una videollamada gratuita de 15 o 30 min por Google Meet con Alma en español, inglés o portugués para hablar de tu briefing de producto en la India.",
    },
  },
  contact: {
    path: "/contact",
    en: {
      title: {
        absolute: "Contact KarmaRise D Global | Spain & India Manufacturing",
      },
      description:
        "Contact KarmaRise D Global (Karmarise Global LLP) in Spain and India in English or Spanish for Manufacturing Programmes, partners, or AlmaRise D Brand.",
    },
    es: {
      title: {
        absolute: "Contacto KarmaRise D Global | España y la India",
      },
      description:
        "Contacta con KarmaRise D Global en español o inglés para Programas de producción, unidades en la India, AlmaRise D Brand o consultas generales.",
    },
  },
  "cookie-policy": {
    path: "/cookie-policy",
    en: {
      title: "Cookie policy",
      description:
        "Information about cookies, how they are used on the KarmaRise D Global website, and how to manage or disable them in your browser.",
    },
    es: {
      title: "Política de cookies",
      description:
        "Información sobre las cookies utilizadas en el sitio web de KarmaRise D Global, sus finalidades y cómo puedes gestionarlas o desactivarlas en tu navegador.",
    },
  },
  "legal-notice": {
    path: "/legal-notice",
    en: {
      title: "Legal notice",
      description:
        "Statutory corporate registration disclosures (India LLP Act 2008 and Spain LSSI-CE Law 34/2002 Aviso Legal) and official communication channels for Karmarise Global LLP (operating KarmaRise D Global).",
    },
    es: {
      title: "Aviso legal",
      description:
        "Datos registrales e identificación legal de Karmarise Global LLP (titular de KarmaRise D Global) conforme a la LLP Act de la India y la LSSI-CE española.",
    },
  },
  manufacturing: {
    path: "/manufacturing",
    en: {
      title: {
        absolute: "Manufacturing in India for Europe | KarmaRise D Global",
      },
      description:
        "Develop own-brand leather goods, clothing, sewn accessories, and home decor in India. Product study, vetted production units, samples, and EU delivery.",
    },
    es: {
      title: {
        absolute: "Diseño y fabricación en la India | KarmaRise D Global",
      },
      description:
        "Diseña y fabrica bolsos de piel, ropa, complementos y decoración del hogar en la India. Unidades auditadas, muestra física y entrega en tu negocio.",
    },
  },
  "privacy-policy": {
    path: "/privacy-policy",
    en: {
      title: "Privacy policy",
      description:
        "How Karmarise Global LLP (operating KarmaRise D Global) handles contact details, Product Brief enquiries, and personal data under European and Indian data protection laws.",
    },
    es: {
      title: "Política de privacidad",
      description:
        "Cómo trata Karmarise Global LLP (KarmaRise D Global) los datos de contacto y consultas de briefing de producto conforme al RGPD europeo, la LOPDGDD y la ley india.",
    },
  },
  "product-brief": {
    path: "/product-brief",
    en: {
      title: {
        absolute: "Start a Product Brief: India Manufacturing | KarmaRise",
      },
      description:
        "Share your Product Brief in 3 quick steps to scope leather bags, clothing, sewn goods, or home decor in India. Alma replies within 1 to 2 business days.",
    },
    es: {
      title: {
        absolute: "Briefing de producto: fabricación en la India | KarmaRise",
      },
      description:
        "Comparte tu briefing de producto en 3 pasos para valorar bolsos de piel, ropa, complementos o decoración en la India. Alma responde en 1 o 2 días.",
    },
  },
  stories: {
    path: "/stories",
    en: {
      title: {
        absolute: "India Manufacturing & AlmaRise D Brand Stories | KarmaRise",
      },
      description:
        "First-person Stories by Alma and Shirish from Indian production sites, leather ateliers, AlmaRise D Reborn & D Organic, and shared tables in India and Spain.",
    },
    es: {
      title: {
        absolute: "Historias de fabricación y AlmaRise D Brand | KarmaRise",
      },
      description:
        "Historias de Alma y Shirish desde puntos de producción y marroquineros en la India, las líneas de AlmaRise D Brand y el día a día entre España y la India.",
    },
  },
  terms: {
    path: "/terms",
    en: {
      title: "Website terms",
      description:
        "Terms of use, Product Brief intellectual property and confidentiality protections, pre-contractual scope, and governing law for the KarmaRise D Global website operated by Karmarise Global LLP.",
    },
    es: {
      title: "Condiciones de uso",
      description:
        "Condiciones de uso del sitio web de KarmaRise D Global (Karmarise Global LLP), propiedad intelectual del briefing de producto y legislación aplicable.",
    },
  },
  "womens-training-initiative": {
    path: "/womens-training-initiative",
    en: {
      title: "Women's Training Initiative",
      description:
        "A planned programme by KarmaRise D Global in India to train women in garment design and stitching, with paid employment opportunities as a long-term aim.",
    },
    es: {
      title: "Iniciativa de formación para mujeres",
      description:
        "Programa en preparación de KarmaRise D Global en la India para formar a mujeres en diseño de prendas y confección, con el empleo remunerado como meta.",
    },
  },
  "how-we-work": {
    path: "/how-we-work",
    en: {
      title: {
        absolute: "How We Work: Spain & India Manufacturing | KarmaRise",
      },
      description:
        "See how Alma and Shirish manage India manufacturing for Europe: call conclusions, physical colour swatches, reviewed samples, on-site checks, and EU delivery.",
    },
    es: {
      title: {
        absolute: "Cómo trabajamos entre España y la India | KarmaRise",
      },
      description:
        "Descubre cómo Alma y Shirish dirigen tu producción en la India: conclusiones de reunión, muestras de color, revisión previa, control en planta y envío.",
    },
  },
};

export function buildAlternates(
  path: string,
  lang: SiteLanguage,
): NonNullable<Metadata["alternates"]> {
  const enPath = localizePath(path, "en");
  const esPath = localizePath(path, "es");
  return {
    canonical: lang === "es" ? esPath : enPath,
    languages: {
      en: enPath,
      es: esPath,
      "x-default": enPath,
    },
    types: {
      "text/plain": "/llms.txt",
    },
  };
}

export function getLayoutMetadata(lang: SiteLanguage): Metadata {
  const isEs = lang === "es";
  const title = isEs
    ? "KarmaRise D Global | India y España"
    : "KarmaRise D Global | India & Spain";
  const description = isEs
    ? "KarmaRise D Global desarrolla y fabrica bolsos de piel, ropa en tejidos naturales y variados, complementos y decoración del hogar en unidades de producción auditadas de la India para España y el resto de Europa."
    : "KarmaRise D Global develops and manufactures own-brand leather goods, clothing in natural and varied fabrics, sewn accessories, and home decor across vetted production units in India for Spain and the rest of Europe.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "KarmaRise D Global",
      template: "%s | KarmaRise D Global",
    },
    description,
    other: {
      "content-language": isEs ? "es-ES" : "en-GB",
    },
    openGraph: {
      type: "website",
      siteName: "KarmaRise D Global",
      title,
      description,
      locale: isEs ? "es_ES" : "en_GB",
      alternateLocale: [isEs ? "en_GB" : "es_ES"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function getRouteMetadata(
  routeKey: StaticRouteKey,
  lang: SiteLanguage,
): Metadata {
  const config = ROUTE_METADATA[routeKey];
  const localized = config[lang];
  const ogTitle =
    typeof localized.title === "string"
      ? `${localized.title} | KarmaRise D Global`
      : localized.title.absolute;
  const isEs = lang === "es";

  const baseAlternates = buildAlternates(config.path, lang);
  const alternates: NonNullable<Metadata["alternates"]> =
    routeKey === "stories"
      ? {
          ...baseAlternates,
          types: {
            ...baseAlternates.types,
            "application/rss+xml": isEs
              ? "/es/stories/rss.xml"
              : "/stories/rss.xml",
          },
        }
      : baseAlternates;

  return {
    title: localized.title,
    description: localized.description,
    alternates,
    openGraph: {
      type: "website",
      siteName: "KarmaRise D Global",
      title: ogTitle,
      description: localized.description,
      url: localizePath(config.path, lang),
      locale: isEs ? "es_ES" : "en_GB",
      alternateLocale: [isEs ? "en_GB" : "es_ES"],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: localized.description,
    },
  };
}

function buildStoryShareImage(
  rawUrl: string | undefined,
  alt: string,
): {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  type?: string;
} {
  if (!rawUrl?.trim()) {
    return {
      url: "/opengraph-image.jpg",
      width: 1200,
      height: 630,
      type: "image/jpeg",
      alt: alt || "KarmaRise D Global",
    };
  }

  const trimmed = rawUrl.trim();
  if (/^https:\/\/cdn\.sanity\.io\/images\//i.test(trimmed)) {
    try {
      const parsed = new URL(trimmed);
      parsed.searchParams.set("w", "1200");
      parsed.searchParams.set("h", "630");
      parsed.searchParams.set("fit", "crop");
      parsed.searchParams.set("crop", "focalpoint");
      parsed.searchParams.set("q", "80");
      parsed.searchParams.set("fm", "jpg");
      return {
        url: parsed.toString(),
        width: 1200,
        height: 630,
        type: "image/jpeg",
        alt,
      };
    } catch {
      return { url: trimmed, alt };
    }
  }

  return {
    url: encodeURI(trimmed).replace(/\(/g, "%28").replace(/\)/g, "%29"),
    alt,
  };
}

export function getStoryMetadata(
  story: StoryEntry | undefined,
  lang: SiteLanguage,
): Metadata {
  const isEs = lang === "es";

  if (!story) {
    return {
      title: isEs ? "Historia no encontrada" : "Story not found",
      description: isEs
        ? "No hemos encontrado esta historia en KarmaRise D Global."
        : "This Story could not be found on KarmaRise D Global.",
      robots: { index: false, follow: false },
    };
  }

  const title = isEs
    ? story.seo?.spanishTitle?.trim() ||
      story.spanishTitle?.trim() ||
      story.seo?.title?.trim() ||
      story.title
    : story.seo?.title?.trim() || story.title;

  const description = isEs
    ? story.seo?.spanishDescription?.trim() ||
      story.spanishSummary?.trim() ||
      story.seo?.description?.trim() ||
      story.summary
    : story.seo?.description?.trim() || story.summary;

  const path = `/stories/${story.slug}`;
  const titleField: Metadata["title"] =
    title.length > 38 && !/karmarise/i.test(title)
      ? { absolute: `${title} | KarmaRise` }
      : title;
  const ogTitle =
    typeof titleField === "string"
      ? `${titleField} | KarmaRise D Global`
      : titleField.absolute;
  const shareImageAlt =
    (isEs ? story.spanishLeadAlt?.trim() : undefined) ||
    story.leadImage?.alt ||
    title;
  const shareImage = buildStoryShareImage(story.leadImage?.url, shareImageAlt);
  const storyTags = isEs ? story.spanishTags || story.tags : story.tags;
  const baseAlternates = buildAlternates(path, lang);

  return {
    title: titleField,
    description,
    alternates: {
      ...baseAlternates,
      types: {
        ...baseAlternates.types,
        "application/rss+xml": isEs
          ? "/es/stories/rss.xml"
          : "/stories/rss.xml",
      },
    },
    openGraph: {
      type: "article",
      siteName: "KarmaRise D Global",
      title: ogTitle,
      description,
      url: localizePath(path, lang),
      locale: isEs ? "es_ES" : "en_GB",
      alternateLocale: [isEs ? "en_GB" : "es_ES"],
      publishedTime: story.publishedAt,
      modifiedTime: story.updatedAt || story.publishedAt,
      authors: [story.author.name],
      tags: storyTags,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [shareImage.url],
    },
  };
}
