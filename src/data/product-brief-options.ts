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
}> = [
  {
    value: "Bags and accessories",
    title: { en: "Bags & leather goods", es: "Bolsos y artículos de piel" },
    hint: {
      en: "Leather bags, soft carryalls, backpacks, small leather goods",
      es: "Bolsos de piel, bolsones, mochilas y pequeña marroquinería",
    },
  },
  {
    value: "Garments and clothing",
    title: { en: "Garments & clothing", es: "Prendas y confección" },
    hint: {
      en: "Dresses, shirts, kimonos, designer garments in natural and varied fabrics",
      es: "Vestidos, camisas, kimonos y prendas en diversos tejidos naturales y con mezcla",
    },
  },
  {
    value: "Another product",
    title: { en: "Custom sewn accessories", es: "Complementos a medida" },
    hint: {
      en: "Textile pouches, sewn accessories, branded dust bags, woven labels",
      es: "Neceseres, complementos confeccionados, bolsas guardapolvo y etiquetas",
    },
  },
  {
    value: "Home decor",
    title: { en: "Home decor", es: "Decoración del hogar" },
    hint: {
      en: "Own-brand home decor pieces crafted with vetted Indian production units",
      es: "Artículos de decoración del hogar con unidades de producción auditadas en la India",
    },
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
      en: "Photos, shop-floor notes, or an existing item you want to improve",
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
      en: "Already selling well and looking for a vetted Indian workshop",
      es: "Ya lo vendes bien y buscas un taller colaborador auditado en la India",
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
    value: "300 to 1,000 units",
    label: { en: "300 to 1,000", es: "300 a 1.000" },
  },
  { value: "1,000+ units", label: { en: "1,000+", es: "Más de 1.000" } },
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
    value: "Fashion brand",
    label: { en: "Fashion brand", es: "Marca de moda" },
  },
  {
    value: "Independent retailer",
    label: { en: "Independent shop", es: "Tienda independiente" },
  },
  {
    value: "Retail chain",
    label: { en: "Retail chain", es: "Cadena comercial" },
  },
  {
    value: "Starting a new brand",
    label: { en: "Starting out", es: "Empezando marca" },
  },
  { value: "Other business", label: { en: "Other", es: "Otro" } },
];

export const NOTE_PROMPTS: ReadonlyArray<{
  label: Record<SiteLanguage, string>;
  snippet: Record<SiteLanguage, string>;
}> = [
  {
    label: { en: "+ Materials", es: "+ Materiales" },
    snippet: {
      en: "Materials in mind: ",
      es: "Materiales que tengo en mente: ",
    },
  },
  {
    label: { en: "+ Target date", es: "+ Fecha objetivo" },
    snippet: {
      en: "Target launch or delivery: ",
      es: "Fecha prevista de entrega: ",
    },
  },
  {
    label: {
      en: "+ Changes to an existing piece",
      es: "+ Cambios sobre una pieza",
    },
    snippet: {
      en: "What I want to improve: ",
      es: "Qué me gustaría mejorar: ",
    },
  },
];

const SPANISH_OPTION_LABELS = new Map<string, string>([
  ...PRODUCT_OPTIONS.map((item) => [item.value, item.title.es] as const),
  ...STAGE_OPTIONS.map((item) => [item.value, item.title.es] as const),
  ...PROFILE_OPTIONS.map((item) => [item.value, item.label.es] as const),
]);

export function localizeOptionForConfirmation(
  value: string,
  confirmationLanguage: SiteLanguage,
): string {
  if (confirmationLanguage === "es") {
    return SPANISH_OPTION_LABELS.get(value) ?? value;
  }
  return value;
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
