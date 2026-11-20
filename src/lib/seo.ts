import type { Metadata } from "next";

import type { StoryEntry } from "@/data/stories";

export type SiteLanguage = "en" | "es";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://karmarisedglobal.com"
).replace(/\/$/, "");

export type StaticRouteKey =
  | "home"
  | "about"
  | "almarise"
  | "book-a-call"
  | "contact"
  | "cookie-policy"
  | "legal-notice"
  | "manufacturing-programme"
  | "privacy-policy"
  | "product-brief"
  | "stories"
  | "terms"
  | "womens-training-initiative"
  | "working-across-distance";

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
    key: "manufacturing-programme",
    path: "/manufacturing-programme",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    key: "working-across-distance",
    path: "/working-across-distance",
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
    priority: 0.8,
  },
  { key: "terms", path: "/terms", changeFrequency: "monthly", priority: 0.8 },
  {
    key: "cookie-policy",
    path: "/cookie-policy",
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    key: "legal-notice",
    path: "/legal-notice",
    changeFrequency: "monthly",
    priority: 0.8,
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
      title: { absolute: "KarmaRise D Global | India & Spain" },
      description:
        "KarmaRise D Global develops and delivers own-brand products for Clients in Spain and across Europe through manufacturing across India, from Product Brief to Bulk Order.",
    },
    es: {
      title: { absolute: "KarmaRise D Global | India y España" },
      description:
        "KarmaRise D Global desarrolla y entrega productos de marca propia para empresas en España y Europa desde toda la India, del Product Brief al pedido en serie.",
    },
  },
  about: {
    path: "/about",
    en: {
      title: "About",
      description:
        "The story of Alma and Shirish, the two founders connecting Clients in Spain and Europe with manufacturing across India through KarmaRise D Global.",
    },
    es: {
      title: "Quiénes somos",
      description:
        "Conoce a Alma y Shirish, fundadores de KarmaRise D Global, que conectan clientes en España y Europa con talleres especializados en toda la India.",
    },
  },
  almarise: {
    path: "/almarise",
    en: {
      title: "Almarise",
      description:
        "Almarise is a fashion brand owned by KarmaRise D Global that transforms existing Indian sarees into contemporary women's clothing for Spain and Europe.",
    },
    es: {
      title: "Almarise",
      description:
        "Almarise es una marca de moda de KarmaRise D Global que transforma saris existentes de la India en prendas femeninas contemporáneas para España y Europa.",
    },
  },
  "book-a-call": {
    path: "/book-a-call",
    en: {
      title: "Book a video call",
      description:
        "Schedule a Google Meet video call with Alma at KarmaRise D Global in English, Spanish, or Portuguese to discuss your Product Brief and Indian manufacturing.",
    },
    es: {
      title: "Reservar videollamada",
      description:
        "Reserva una videollamada por Google Meet con Alma de KarmaRise D Global en español, inglés o portugués para hablar sobre tu Product Brief y fabricación en la India.",
    },
  },
  contact: {
    path: "/contact",
    en: {
      title: "Contact",
      description:
        "Reach KarmaRise D Global (operated by Karmarise Global LLP) in India, Spain, and across Europe in English or Spanish for Manufacturing Programmes, workshops, Almarise, or general enquiries.",
    },
    es: {
      title: "Contacto",
      description:
        "Contacta con KarmaRise D Global en español o inglés para Programas de fabricación, talleres colaboradores en la India, Almarise o consultas generales.",
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
  "manufacturing-programme": {
    path: "/manufacturing-programme",
    en: {
      title: "Manufacturing Programme",
      description:
        "See how a KarmaRise D Global Manufacturing Programme moves from the Product Brief through design, sampling, partner selection, production, and delivery.",
    },
    es: {
      title: "Programa de fabricación",
      description:
        "Descubre cómo avanza un Programa de fabricación de KarmaRise D Global en la India desde el Product Brief hasta el muestreo, la producción y la entrega.",
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
        "Cómo trata Karmarise Global LLP (KarmaRise D Global) los datos de contacto y consultas de Product Brief conforme al RGPD europeo, la LOPDGDD y la ley india.",
    },
  },
  "product-brief": {
    path: "/product-brief",
    en: {
      title: "Start a Product Brief",
      description:
        "Prepare and share a Product Brief with KarmaRise D Global to evaluate design, materials, Manufacturing Partner fit, quantity, and delivery.",
    },
    es: {
      title: "Iniciar un Product Brief",
      description:
        "Prepara y comparte tu Product Brief con KarmaRise D Global para evaluar diseño, materiales, taller adecuado en la India, cantidades y plazos de entrega.",
    },
  },
  stories: {
    path: "/stories",
    en: {
      title: "Stories",
      description:
        "Stories from Alma and Shirish on manufacturing across India, life between Spain and India, and vintage Indian sarees for Almarise.",
    },
    es: {
      title: "Historias",
      description:
        "Historias de Alma y Shirish sobre fabricación en toda la India, la vida entre España y la India y los saris reutilizados de Almarise.",
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
        "Condiciones de uso del sitio web de KarmaRise D Global (Karmarise Global LLP), protección de propiedad intelectual del Product Brief y legislación aplicable.",
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
  "working-across-distance": {
    path: "/working-across-distance",
    en: {
      title: "Working across distance",
      description:
        "How Alma and Shirish keep Clients in Spain and across Europe connected to Indian Manufacturing Partners from the Product Brief through Bulk Order delivery.",
    },
    es: {
      title: "Trabajar a distancia",
      description:
        "Cómo Alma y Shirish mantienen conectados a clientes de España y Europa con talleres en la India, del Product Brief a la entrega del pedido en serie.",
    },
  },
};

function splitPathParts(input: string): {
  path: string;
  search: string;
  hash: string;
} {
  const hashIndex = input.indexOf("#");
  const hash = hashIndex >= 0 ? input.slice(hashIndex) : "";
  const beforeHash = hashIndex >= 0 ? input.slice(0, hashIndex) : input;

  const queryIndex = beforeHash.indexOf("?");
  const search = queryIndex >= 0 ? beforeHash.slice(queryIndex) : "";
  const path = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;

  return { path, search, hash };
}

function normalizeBasePath(rawPath: string): string {
  const trimmed = rawPath.trim();
  if (!trimmed) {
    return "/";
  }
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withLeadingSlash.length > 1) {
    return withLeadingSlash.replace(/\/+$/, "") || "/";
  }
  return withLeadingSlash;
}

export function stripLocalePrefix(pathname: string): string {
  const { path, search, hash } = splitPathParts(pathname);
  const normalized = normalizeBasePath(path);

  let stripped = normalized;
  if (normalized === "/es") {
    stripped = "/";
  } else if (normalized.startsWith("/es/")) {
    stripped = normalized.slice(3) || "/";
  }

  return `${stripped}${search}${hash}`;
}

export function localizePath(href: string, lang: SiteLanguage): string {
  const trimmed = href.trim();
  if (
    !trimmed ||
    trimmed.startsWith("#") ||
    /^(mailto:|tel:|https?:\/\/)/i.test(trimmed) ||
    trimmed === "/api" ||
    trimmed.startsWith("/api/")
  ) {
    return href;
  }

  const { path, search, hash } = splitPathParts(trimmed);
  const basePath = stripLocalePrefix(path);

  const localizedBase =
    lang === "es" ? (basePath === "/" ? "/es" : `/es${basePath}`) : basePath;

  return `${localizedBase}${search}${hash}`;
}

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
  };
}

export function getLayoutMetadata(lang: SiteLanguage): Metadata {
  const isEs = lang === "es";
  const title = isEs
    ? "KarmaRise D Global · India y España"
    : "KarmaRise D Global · India & Spain";
  const description = isEs
    ? "KarmaRise D Global conecta empresas de España y Europa con talleres especializados en toda la India, del Product Brief a la entrega del pedido en serie."
    : "KarmaRise D Global connects product businesses in Spain and across Europe with manufacturing across India, from Product Brief through Bulk Order delivery.";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: "KarmaRise D Global",
      template: "%s | KarmaRise D Global",
    },
    description,
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

  return {
    title: localized.title,
    description: localized.description,
    alternates: buildAlternates(config.path, lang),
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
    url: encodeURI(trimmed),
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
  const ogTitle = `${title} | KarmaRise D Global`;
  const shareImageAlt =
    (isEs ? story.spanishLeadAlt?.trim() : undefined) ||
    story.leadImage?.alt ||
    title;
  const shareImage = buildStoryShareImage(story.leadImage?.url, shareImageAlt);
  const storyTags = isEs ? story.spanishTags || story.tags : story.tags;

  return {
    title,
    description,
    alternates: buildAlternates(path, lang),
    openGraph: {
      type: "article",
      siteName: "KarmaRise D Global",
      title: ogTitle,
      description,
      url: localizePath(path, lang),
      locale: isEs ? "es_ES" : "en_GB",
      alternateLocale: [isEs ? "en_GB" : "es_ES"],
      publishedTime: story.publishedAt,
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
