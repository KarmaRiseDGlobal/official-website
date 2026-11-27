import type { SiteLanguage } from "@/lib/urls";

export const PRODUCT_BRIEF_CONTACT_EMAIL = "inquiry@karmarisedglobal.com";
export const MAX_UPLOAD_FILES = 3;
export const MAX_FILE_BYTES = 4 * 1024 * 1024;
export const MAX_TOTAL_UPLOAD_BYTES = 10 * 1024 * 1024;

export const ALLOWED_MIME_BY_EXT = new Map<string, string>([
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
  ["pdf", "application/pdf"],
]);

export type StepNumber = 1 | 2 | 3;

export const PRODUCT_OPTIONS: ReadonlyArray<{
  value: string;
  title: Record<SiteLanguage, string>;
  hint: Record<SiteLanguage, string>;
  image: string;
  imagePosition: string;
}> = [
  {
    value: "Bags and accessories",
    title: { en: "Leather goods", es: "Bolsos y artículos de piel" },
    hint: {
      en: "Hobo bags, stylish backpacks, crossbodies, pouches, wallets, travel bags",
      es: "Bolsos hobo, mochilas urbanas, bandoleras, estuches, carteras y bolsas de viaje",
    },
    image: "/images/capabilities/leather-hides.jpg",
    imagePosition: "50% 45%",
  },
  {
    value: "Garments and clothing",
    title: { en: "Clothing", es: "Ropa y prendas" },
    hint: {
      en: "Cotton and linen midi dresses and skirts, unique denim, blouses, jumpsuits, outerwear",
      es: "Vestidos y faldas midi en algodón y lino, denim, blusas, monos y prendas exteriores",
    },
    image: "/images/capabilities/natural-fabrics.jpg",
    imagePosition: "50% 35%",
  },
  {
    value: "Textile accessories",
    title: { en: "Textile accessories", es: "Complementos textiles" },
    hint: {
      en: "Pashminas, scarves, canvas and quilted totes, clutches, toiletry cases, sleeves",
      es: "Pashminas, pañuelos, totes de loneta y acolchados, clutches, neceseres y fundas",
    },
    image: "/images/capabilities/textile-accessories.jpg",
    imagePosition: "50% 45%",
  },
  {
    value: "Textile home decor",
    title: { en: "Textile home decor", es: "Decoración textil del hogar" },
    hint: {
      en: "Cushion covers, wall hangings, Kantha bedspreads, dhurries, table linens",
      es: "Fundas de cojín, tapices, colchas estilo Kantha, alfombras dhurrie y ropa de mesa",
    },
    image: "/images/culture/maharashtra-handloom-zari-border.jpg",
    imagePosition: "50% 45%",
  },
];

export const STAGE_OPTIONS: ReadonlyArray<{
  value: string;
  title: Record<SiteLanguage, string>;
  hint: Record<SiteLanguage, string>;
}> = [
  {
    value: "Concept or reference items only",
    title: {
      en: "Just an idea or reference pieces",
      es: "Solo una idea o piezas de referencia",
    },
    hint: {
      en: "Photos, shop notes, or an existing item you want to improve",
      es: "Fotos, notas de tienda o una pieza que quieres mejorar",
    },
  },
  {
    value: "Sketches or early tech pack",
    title: {
      en: "Sketches or early tech pack",
      es: "Bocetos o ficha técnica inicial",
    },
    hint: {
      en: "Drawings, rough measurements, or material direction",
      es: "Dibujos, medidas aproximadas o dirección de materiales",
    },
  },
  {
    value: "Physical sample ready",
    title: {
      en: "Physical sample ready",
      es: "Muestra física lista",
    },
    hint: {
      en: "You already hold a piece we can build from",
      es: "Ya tienes una pieza en la mano sobre la que trabajar",
    },
  },
  {
    value: "Existing product moving to India",
    title: {
      en: "Moving an existing product to India",
      es: "Pasar un producto existente a la India",
    },
    hint: {
      en: "Already selling well and looking for a reliable Indian production unit",
      es: "Ya lo vendes bien y buscas una unidad de producción de confianza en la India",
    },
  },
];

export const QUANTITY_PRESETS: ReadonlyArray<{
  value: string;
  label: Record<SiteLanguage, string>;
}> = [
  { value: "Under 100 units", label: { en: "Under 100", es: "Menos de 100" } },
  { value: "100 to 300 units", label: { en: "100 to 300", es: "100 a 300" } },
  {
    value: "300+ units",
    label: { en: "300+ units", es: "Más de 300" },
  },
  {
    value: "Not sure yet",
    label: { en: "Not sure yet", es: "Aún no lo sé" },
  },
];

export const PROFILE_OPTIONS: ReadonlyArray<{
  value: string;
  label: Record<SiteLanguage, string>;
}> = [
  {
    value: "Independent retailer",
    label: { en: "Independent shop", es: "Tienda independiente" },
  },
  {
    value: "Fashion brand",
    label: { en: "Fashion brand", es: "Marca de moda" },
  },
  {
    value: "Retail chain",
    label: { en: "Retail chain", es: "Cadena comercial" },
  },
  {
    value: "Starting a new brand",
    label: { en: "Starting out", es: "Empezando marca" },
  },
];

const ENGLISH_OPTION_LABELS = new Map<string, string>([
  ...PRODUCT_OPTIONS.map((item) => [item.value, item.title.en] as const),
  ...STAGE_OPTIONS.map((item) => [item.value, item.title.en] as const),
  ...QUANTITY_PRESETS.map((item) => [item.value, item.label.en] as const),
  ...PROFILE_OPTIONS.map((item) => [item.value, item.label.en] as const),
]);

const SPANISH_OPTION_LABELS = new Map<string, string>([
  ...PRODUCT_OPTIONS.map((item) => [item.value, item.title.es] as const),
  ...STAGE_OPTIONS.map((item) => [item.value, item.title.es] as const),
  ...QUANTITY_PRESETS.map((item) => [item.value, item.label.es] as const),
  ...PROFILE_OPTIONS.map((item) => [item.value, item.label.es] as const),
]);

export function localizeOptionForConfirmation(
  value: string,
  confirmationLanguage: SiteLanguage,
): string {
  if (confirmationLanguage === "es") {
    return SPANISH_OPTION_LABELS.get(value) ?? value;
  }
  return ENGLISH_OPTION_LABELS.get(value) ?? value;
}

export function normalizeOptionalReferenceUrl(rawValue: string): string {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return "";
  }
  if (/^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(trimmed)) {
    return trimmed;
  }
  if (/^[^\s/]+\.[^\s/]+/.test(trimmed)) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

export function isClientSafeHttpUrl(rawValue: string): boolean {
  if (/[\u0000-\u001F\u007F]/.test(rawValue)) {
    return false;
  }

  const trimmed = rawValue.trim();
  if (!trimmed || trimmed.length > 2000) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      Boolean(parsed.hostname) &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === filename.length - 1) {
    return "";
  }
  return filename.slice(lastDot + 1).toLowerCase();
}
