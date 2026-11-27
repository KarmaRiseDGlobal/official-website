"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { OFFICIAL_SOCIALS } from "@/data/socials";
import { stripLocalePrefix, type SiteLanguage } from "@/lib/urls";

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isFallbackNotice?: boolean;
}

export interface StoredChatState {
  messages: ChatMessage[];
  sessionVerified?: boolean;
}

const STORAGE_KEY = "karmarise_chat_thread_v1";
const WHATSAPP_BASE = "https://wa.me/34611722276";
export const WHATSAPP_HREF: Record<SiteLanguage, string> = {
  en: `${WHATSAPP_BASE}?text=${encodeURIComponent("Hello Alma and Shirish, I would like to chat about manufacturing with KarmaRise D Global.")}`,
  es: `${WHATSAPP_BASE}?text=${encodeURIComponent("Hola Alma y Shirish, me gustaría hablar sobre fabricación con KarmaRise D Global.")}`,
};
export const MAX_STORED_MESSAGES = 24;
export const MAX_MESSAGE_CHARS = 600;

const LEGACY_ROUTE_MAP: Readonly<Record<string, string>> = {
  "/manufacturing-programme": "/manufacturing",
  "/working-across-distance": "/how-we-work",
};

const KNOWN_INTERNAL_ROUTES = new Set([
  "/book-a-call",
  "/product-brief",
  "/manufacturing",
  "/how-we-work",
  "/about",
  "/stories",
  "/almarise",
  "/womens-training-initiative",
  "/contact",
]);

const INTERNAL_ROUTE_LABELS: Readonly<
  Record<string, Record<SiteLanguage, string>>
> = {
  "/book-a-call": {
    en: "Book a call with Alma",
    es: "Reservar llamada con Alma",
  },
  "/product-brief": {
    en: "Product Brief",
    es: "Briefing de producto",
  },
  "/manufacturing": {
    en: "Manufacturing Programme",
    es: "Programa de producción",
  },
  "/how-we-work": {
    en: "How we work",
    es: "Cómo trabajamos",
  },
  "/about": {
    en: "About us",
    es: "Nosotros",
  },
  "/stories": {
    en: "KarmaRise Stories",
    es: "Historias de KarmaRise",
  },
  "/almarise": {
    en: "AlmaRise D Brand",
    es: "AlmaRise D Brand",
  },
  "/womens-training-initiative": {
    en: "Women's Training Initiative",
    es: "Iniciativa de formación para mujeres",
  },
  "/contact": {
    en: "Contact",
    es: "Contacto",
  },
};

function normalizeUrlForLookup(url: string): string {
  return url.trim().toLowerCase().replace(/\/+$/, "");
}

const SOCIAL_LINK_LABELS: ReadonlyArray<{
  normalizedUrl: string;
  canonicalHref: string;
  label: Record<SiteLanguage, string>;
}> = [
  {
    normalizedUrl: normalizeUrlForLookup(OFFICIAL_SOCIALS.karmariseLinkedIn),
    canonicalHref: OFFICIAL_SOCIALS.karmariseLinkedIn,
    label: {
      en: "KarmaRise D Global on LinkedIn",
      es: "KarmaRise D Global en LinkedIn",
    },
  },
  {
    normalizedUrl: normalizeUrlForLookup(OFFICIAL_SOCIALS.karmariseInstagram),
    canonicalHref: OFFICIAL_SOCIALS.karmariseInstagram,
    label: {
      en: "KarmaRise D Global on Instagram",
      es: "KarmaRise D Global en Instagram",
    },
  },
  {
    normalizedUrl: normalizeUrlForLookup(OFFICIAL_SOCIALS.almariseInstagram),
    canonicalHref: OFFICIAL_SOCIALS.almariseInstagram,
    label: {
      en: "AlmaRise D Brand on Instagram",
      es: "AlmaRise D Brand en Instagram",
    },
  },
  {
    normalizedUrl: normalizeUrlForLookup(OFFICIAL_SOCIALS.almaLinkedIn),
    canonicalHref: OFFICIAL_SOCIALS.almaLinkedIn,
    label: {
      en: "Alma on LinkedIn",
      es: "Alma en LinkedIn",
    },
  },
  {
    normalizedUrl: normalizeUrlForLookup(OFFICIAL_SOCIALS.shirishLinkedIn),
    canonicalHref: OFFICIAL_SOCIALS.shirishLinkedIn,
    label: {
      en: "Shirish on LinkedIn",
      es: "Shirish en LinkedIn",
    },
  },
];

function getInternalRouteLabel(
  canonicalPath: string,
  queryPart: string | undefined,
  language: SiteLanguage,
): string {
  if (canonicalPath === "/book-a-call" && queryPart) {
    const params = new URLSearchParams(queryPart);
    if (params.get("duration") === "30") {
      return language === "es"
        ? "Reservar revisión de briefing"
        : "Book a Product Brief review";
    }
    if (params.get("duration") === "15") {
      return language === "es"
        ? "Reservar llamada inicial con Alma"
        : "Book an intro call with Alma";
    }
  }
  if (canonicalPath.startsWith("/stories/") && canonicalPath.length > 9) {
    return language === "es" ? "Leer esta Historia" : "Read this Story";
  }
  return INTERNAL_ROUTE_LABELS[canonicalPath]?.[language] ?? canonicalPath;
}

export function getGreetingForRoute(
  basePath: string,
  lang: SiteLanguage,
): string {
  if (basePath === "/almarise") {
    return lang === "es"
      ? "Hola desde la India y España. Pregúntanos sobre las prendas de sari de AlmaRise D Reborn, los tejidos de AlmaRise D Organic, AlmaRise D Home Decor o próximas piezas."
      : "Hello from India and Spain. Ask us about AlmaRise D Reborn saree garments, AlmaRise D Organic fabrics, AlmaRise D Home Decor, or upcoming pieces.";
  }
  if (basePath === "/womens-training-initiative") {
    return lang === "es"
      ? "Hola desde la India y España. Pregúntanos sobre nuestra futura Iniciativa de formación para mujeres, qué incluirá o cómo colaborar desde la India."
      : "Hello from India and Spain. Ask us about our planned Women's Training Initiative, what it will teach, or how trainers in India can get in touch.";
  }
  return lang === "es"
    ? "Hola desde la India y España. Cuéntanos qué pieza estás pensando fabricar y te orientamos sobre el siguiente paso."
    : "Hello from India and Spain. Tell us what you are thinking of making and we will point you to the right next step.";
}

export function getPresetsForRoute(
  basePath: string,
  lang: SiteLanguage,
): readonly string[] {
  if (basePath === "/almarise") {
    return lang === "es"
      ? [
          "¿En qué se diferencian AlmaRise D Reborn y AlmaRise D Organic?",
          "¿Cómo se confeccionan las prendas a partir de saris guardados?",
          "¿Cómo puedo preguntar por disponibilidad o piezas de AlmaRise D Brand?",
        ]
      : [
          "How do AlmaRise D Reborn and AlmaRise D Organic differ?",
          "How are kept Indian sarees turned into everyday garments?",
          "How can I ask about AlmaRise D Brand pieces or availability?",
        ];
  }
  if (basePath === "/womens-training-initiative") {
    return lang === "es"
      ? [
          "¿Cuándo se abrirán las inscripciones de la iniciativa?",
          "¿Qué aprenderán las participantes en diseño y confección?",
          "¿Cómo pueden colaborar formadoras o patronistas en la India?",
        ]
      : [
          "When will applications open for the training initiative?",
          "What will the training cover in design and stitching?",
          "How can trainers or pattern makers in India get involved?",
        ];
  }
  return lang === "es"
    ? [
        "¿Qué productos podéis desarrollar y fabricar en la India?",
        "¿Qué necesito tener listo antes de enviar un briefing de producto?",
        "¿Cómo funcionan las cantidades, las muestras y los plazos?",
      ]
    : [
        "What products can you develop and make in India?",
        "What do I need before starting a Product Brief?",
        "How do order quantities, samples, and timelines work?",
      ];
}

export const LOADING_MESSAGES: Record<SiteLanguage, readonly string[]> = {
  en: [
    "Checking our studio notes…",
    "Looking through the Product Brief notes…",
    "Pulling up the maker details…",
    "Checking how we handle that in India…",
    "Reviewing our sampling steps…",
    "Checking what Alma and Shirish look for…",
    "Looking over the material notes…",
    "Checking our production timeline notes…",
    "Pulling up the production sequence…",
    "Checking how we coordinate across Spain and India…",
    "Looking into our maker vetting criteria…",
    "Checking the quality check details…",
    "Reviewing our leather and garment notes…",
    "Looking through the AlmaRise D Brand notes…",
    "Checking the delivery and packing details…",
    "Pulling up what goes into a brief…",
    "Checking our notes on small and full runs…",
    "Reviewing how samples move to production…",
    "Checking our studio guidelines…",
    "Looking over our quality checklist…",
    "Gathering the details for you…",
    "Putting a clear answer together…",
  ],
  es: [
    "Revisando nuestros apuntes del estudio…",
    "Repasando los detalles del briefing de producto…",
    "Consultando las notas de producción…",
    "Comprobando cómo lo trabajamos en la India…",
    "Revisando los pasos de muestreo…",
    "Mirando qué revisan Alma y Shirish…",
    "Repasando las notas sobre materiales…",
    "Comprobando los plazos de fabricación…",
    "Consultando el orden de producción…",
    "Revisando cómo coordinamos España y la India…",
    "Mirando cómo elegimos a cada fabricante…",
    "Repasando los controles de calidad…",
    "Consultando nuestras notas de piel y confección…",
    "Revisando los apuntes sobre AlmaRise D Brand…",
    "Comprobando los detalles de envío y embalaje…",
    "Mirando qué conviene definir en el briefing…",
    "Repasando tiradas cortas y pedidos mayores…",
    "Revisando el paso de muestra física a producción…",
    "Consultando la guía del estudio…",
    "Repasando la lista de comprobación de calidad…",
    "Reuniendo los detalles para ti…",
    "Preparando una respuesta clara…",
  ],
};

export function createMessageId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function BrandMarkBadge({ size = "md" }: { size?: "sm" | "md" }) {
  const boxClass = size === "sm" ? "h-7 w-7 p-1" : "h-9 w-9 p-1.5";
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full border border-[var(--color-forest)]/30 bg-[var(--color-forest-deep)] ${boxClass}`}
    >
      <Image
        src="/brand/main-logo-transparent.png"
        alt=""
        width={701}
        height={815}
        sizes="36px"
        className="h-full w-full object-contain [filter:var(--filter-logo-light)]"
      />
    </span>
  );
}

export function readStoredChatState(): StoredChatState {
  if (typeof window === "undefined") {
    return { messages: [] };
  }

  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { messages: [] };
    }
    const parsed = JSON.parse(raw) as Partial<StoredChatState>;
    if (!Array.isArray(parsed.messages)) {
      return { messages: [] };
    }

    const validMessages: ChatMessage[] = [];
    for (const item of parsed.messages.slice(-MAX_STORED_MESSAGES)) {
      if (
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string" &&
        item.content.trim()
      ) {
        validMessages.push({
          id: typeof item.id === "string" ? item.id : createMessageId(),
          role: item.role,
          content: item.content,
          isFallbackNotice: Boolean(item.isFallbackNotice),
        });
      }
    }

    return {
      messages: validMessages,
      sessionVerified: Boolean(parsed.sessionVerified),
    };
  } catch {
    return { messages: [] };
  }
}

export function writeStoredChatState(state: StoredChatState): void {
  if (typeof window === "undefined") {
    return;
  }
  try {
    window.sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        messages: state.messages.slice(-MAX_STORED_MESSAGES),
        sessionVerified: Boolean(state.sessionVerified),
      }),
    );
  } catch {
    // Ignore storage quota or private browsing errors.
  }
}

export function renderMessageContent(
  text: string,
  localizeHref: (href: string) => string,
  onNavigate: () => void,
  language: SiteLanguage = "en",
): ReactNode[] {
  const tokenPattern =
    /(https:\/\/wa\.me\/\d+|https:\/\/(?:www\.)?(?:linkedin\.com\/(?:company|in)\/[A-Za-z0-9_-]+\/?|instagram\.com\/[A-Za-z0-9._-]+\/?)|[A-Za-z0-9._%+-]+@karmarisedglobal\.com|\+34[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}|\+91[\s-]?\d{5}[\s-]?\d{5}|\+91[\s-]?\d{10}|(?:\/es)?\/(?:book-a-call(?:\?(?:duration=(?:15|30)|(?:product|category)=[a-z0-9_-]+)(?:&(?:duration=(?:15|30)|(?:product|category)=[a-z0-9_-]+))*)?|product-brief(?:\?(?:product|category)=[a-z0-9_-]+)?|manufacturing-programme|manufacturing|how-we-work|working-across-distance|about|stories(?:\/[a-z0-9-]+)?|almarise|womens-training-initiative|contact)(?=$|[\s.,;:!?)]))/g;

  const newTabSrText =
    language === "es" ? " (abre en nueva pestaña)" : " (opens in a new tab)";

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let matchIndex = 0;

  for (const match of text.matchAll(tokenPattern)) {
    const token = match[0];
    const start = match.index ?? 0;

    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }

    if (token.startsWith("https://wa.me/")) {
      nodes.push(
        <a
          key={`wa-${matchIndex}`}
          href={token}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold underline decoration-current underline-offset-2"
        >
          WhatsApp
          <span className="sr-only">{newTabSrText}</span>
        </a>,
      );
    } else if (token.startsWith("https://")) {
      const normalized = normalizeUrlForLookup(token);
      const socialMatch = SOCIAL_LINK_LABELS.find(
        (entry) => entry.normalizedUrl === normalized,
      );
      if (socialMatch) {
        nodes.push(
          <a
            key={`social-${matchIndex}`}
            href={socialMatch.canonicalHref}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline decoration-current underline-offset-2"
          >
            {socialMatch.label[language]}
            <span className="sr-only">{newTabSrText}</span>
          </a>,
        );
      } else {
        nodes.push(token);
      }
    } else if (token.includes("@")) {
      nodes.push(
        <a
          key={`email-${matchIndex}`}
          href={`mailto:${token.toLowerCase()}`}
          className="font-semibold underline decoration-current underline-offset-2"
        >
          {token}
        </a>,
      );
    } else if (token.startsWith("+")) {
      const normalizedTel = token.replace(/[\s-]+/g, "");
      nodes.push(
        <a
          key={`tel-${matchIndex}`}
          href={`tel:${normalizedTel}`}
          className="font-semibold whitespace-nowrap underline decoration-current underline-offset-2"
        >
          {token}
        </a>,
      );
    } else {
      const stripped = stripLocalePrefix(token);
      const [pathOnly, queryPart] = stripped.split("?");
      const rawPath = pathOnly ?? "";
      const canonicalPath = LEGACY_ROUTE_MAP[rawPath] ?? rawPath;
      const isKnownStoryDetail = /^\/stories\/[a-z0-9-]+$/.test(canonicalPath);

      if (KNOWN_INTERNAL_ROUTES.has(canonicalPath) || isKnownStoryDetail) {
        const targetHref = queryPart
          ? `${localizeHref(canonicalPath)}?${queryPart}`
          : localizeHref(canonicalPath);
        nodes.push(
          <Link
            key={`link-${matchIndex}`}
            href={targetHref}
            onClick={onNavigate}
            className="font-semibold underline decoration-current underline-offset-2"
          >
            {getInternalRouteLabel(canonicalPath, queryPart, language)}
          </Link>,
        );
      } else {
        nodes.push(token);
      }
    }

    lastIndex = start + token.length;
    matchIndex += 1;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
