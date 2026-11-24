import type { SiteLanguage } from "@/lib/urls";

export interface LocalizedText {
  readonly en: string;
  readonly es: string;
}

export interface ProductBriefStep {
  readonly number: string;
  readonly title: LocalizedText;
  readonly body: LocalizedText;
}

export interface BookCallOption {
  readonly id: "15" | "30";
  readonly durationLabel: LocalizedText;
  readonly title: LocalizedText;
  readonly summary: LocalizedText;
  readonly bestFor: LocalizedText;
}

export interface ConversionFaqItem {
  readonly id: string;
  readonly question: LocalizedText;
  readonly answer: LocalizedText;
}

export interface ContactDepartmentEntry {
  readonly id: string;
  readonly email: string;
  readonly role: LocalizedText;
  readonly areaServed: string | readonly string[];
}

export const REPLY_SLA: LocalizedText = {
  en: "within 1–2 business days",
  es: "en 1 o 2 días laborables",
};

export const PRODUCT_BRIEF_POST_STEPS: readonly ProductBriefStep[] = [
  {
    number: "01",
    title: {
      en: "Alma reads your brief",
      es: "Alma lee tu briefing",
    },
    body: {
      en: "She replies personally within 1–2 business days in English, Spanish, or Portuguese with initial thoughts and practical questions.",
      es: "Te contesta personalmente en 1 o 2 días laborables en español, inglés o portugués con primeras impresiones y preguntas prácticas.",
    },
  },
  {
    number: "02",
    title: {
      en: "We talk it through face to face",
      es: "Lo hablamos cara a cara",
    },
    body: {
      en: "On a relaxed Google Meet call, we look at your brand, what your customers reach for in your shop, and what the finished piece needs to do.",
      es: "En una videollamada tranquila por Google Meet hablamos de tu marca, de lo que busca la gente que entra en tu tienda y de cómo debe comportarse la pieza terminada.",
    },
  },
  {
    number: "03",
    title: {
      en: "You receive a clear proposal",
      es: "Recibes una propuesta clara",
    },
    body: {
      en: "We check materials, specialist workshop fit across India, physical sampling, and your likely Bulk Order scope before sending anything over.",
      es: "Revisamos materiales, el encaje con talleres colaboradores en la India, el muestreo físico y el alcance del pedido de producción antes de enviarte nada.",
    },
  },
  {
    number: "04",
    title: {
      en: "Swatches and physical samples first",
      es: "Primero retal de color y muestras físicas",
    },
    body: {
      en: "Once you approve the proposal, we match colour from a physical swatch and pre-screen physical samples in India before bulk cutting ever starts.",
      es: "Cuando apruebas la propuesta, fijamos el tono sobre un retal físico de color y preparamos cada muestra para valoración en la India antes de cortar una sola unidad del pedido.",
    },
  },
];

export const BOOK_CALL_OPTIONS: readonly BookCallOption[] = [
  {
    id: "15",
    durationLabel: {
      en: "15 minutes · Google Meet",
      es: "15 minutos · Google Meet",
    },
    title: {
      en: "Quick intro call",
      es: "Consulta rápida",
    },
    summary: {
      en: "Ideal when you have a fresh idea, a piece from your shop floor you want to upgrade, or open questions about producing own-brand goods in India.",
      es: "Ideal cuando tienes una idea recién salida, una pieza de tu tienda que quieres mejorar o dudas abiertas sobre fabricar marca propia en la India.",
    },
    bestFor: {
      en: "Boutique owners, first-time founders, and fast feasibility checks.",
      es: "Tiendas independientes, quienes lanzan su primera marca y consultas rápidas de viabilidad.",
    },
  },
  {
    id: "30",
    durationLabel: {
      en: "30 minutes · Google Meet",
      es: "30 minutos · Google Meet",
    },
    title: {
      en: "Product Brief review",
      es: "Revisión de briefing de producto",
    },
    summary: {
      en: "Built for walking through sketches, physical reference pieces, leather or cloth options, hardware, EU care labels, sampling rounds, and seasonal launch dates together.",
      es: "Pensada para repasar juntos bocetos, piezas de referencia en mano, opciones de piel o tela, herrajes, etiquetado europeo, rondas de muestreo y fechas de campaña.",
    },
    bestFor: {
      en: "Brands with sketches, samples in hand, or an active line moving to India.",
      es: "Marcas con bocetos, muestras físicas listas o una línea activa que pasa a la India.",
    },
  },
];

export const BOOK_CALL_FAQS: readonly ConversionFaqItem[] = [
  {
    id: "prepare",
    question: {
      en: "Do I need a finished tech pack before booking a call?",
      es: "¿Necesito una ficha técnica cerrada antes de reservar la llamada?",
    },
    answer: {
      en: "No. Bring a rough sketch, phone photos, or an existing bag or dress from your shop. Alma writes up clear minutes right after the call and helps turn your ideas into a written Product Brief.",
      es: "No. Trae un boceto rápido, fotos del móvil o un bolso o vestido de tu tienda. Alma te envía notas por escrito nada más terminar y te ayuda a dar forma a tu idea en un briefing de producto.",
    },
  },
  {
    id: "after-call",
    question: {
      en: "What happens after the video call with Alma?",
      es: "¿Qué pasa después de la videollamada con Alma?",
    },
    answer: {
      en: "Alma sends written call notes summarizing your product, materials, and practical next steps. When you are ready to move forward, we check specialist Manufacturing Partners across India and send an individual proposal.",
      es: "Alma te manda un resumen por escrito con tu pieza, los materiales comentados y los pasos siguientes. Cuando quieras seguir adelante, buscamos el taller colaborador en la India y te enviamos una propuesta a medida.",
    },
  },
  {
    id: "quantities",
    question: {
      en: "Can we talk openly about smaller first runs or order quantities?",
      es: "¿Podemos hablar abiertamente de primeras tiradas cortas o cantidades?",
    },
    answer: {
      en: "Yes. Every workshop cluster and material behaves differently, so we do not publish fixed price lists or rigid minimums. We talk through realistic quantities and lead times openly on the call.",
      es: "Sí. Cada región artesana y cada material tienen sus propios requisitos, por eso no publicamos tarifas cerradas ni mínimos rígidos. En la llamada valoramos cantidades y plazos realistas con total claridad.",
    },
  },
  {
    id: "confidentiality",
    question: {
      en: "Will my product ideas and sketches stay confidential?",
      es: "¿Mis ideas y bocetos quedan bajo confidencialidad?",
    },
    answer: {
      en: "Yes. Only Alma and Shirish review your designs during evaluation, and every sketch, pattern, and reference stays your sole intellectual property.",
      es: "Sí. Solo Alma y Shirish revisan tus diseños durante la valoración, y cada boceto, patrón o referencia sigue siendo de tu exclusiva propiedad intelectual.",
    },
  },
];

export const CONTACT_DEPARTMENTS: readonly ContactDepartmentEntry[] = [
  {
    id: "product-briefs",
    email: "inquiry@karmarisedglobal.com",
    role: {
      en: "New Product Briefs & project enquiries",
      es: "Nuevos briefings de producto y proyectos",
    },
    areaServed: ["ES", "EU"],
  },
  {
    id: "alma",
    email: "alma@karmarisedglobal.com",
    role: {
      en: "Alma · Spain & Europe Clients (ES, EN, PT)",
      es: "Alma · Clientes en España y Europa (ES, EN, PT)",
    },
    areaServed: ["ES", "EU"],
  },
  {
    id: "partners",
    email: "partners@karmarisedglobal.com",
    role: {
      en: "Manufacturing Partners & artisans in India",
      es: "Talleres colaboradores y artesanos en la India",
    },
    areaServed: "IN",
  },
  {
    id: "shirish",
    email: "shirish@karmarisedglobal.com",
    role: {
      en: "Shirish · India operations & legal",
      es: "Shirish · Operaciones y legal en la India",
    },
    areaServed: "IN",
  },
  {
    id: "stories",
    email: "stories@karmarisedglobal.com",
    role: {
      en: "AlmaRise D Brand, Stories & press",
      es: "AlmaRise D Brand, Historias y prensa",
    },
    areaServed: ["ES", "EU", "IN"],
  },
];

export interface ContactTopicEntry {
  readonly value: string;
  readonly label: LocalizedText;
  readonly emailLabels: LocalizedText;
  readonly directEmail: string;
  readonly envOverrideKey:
    | "CONTACT_INQUIRY_EMAIL"
    | "CONTACT_PARTNERS_EMAIL"
    | "CONTACT_STORIES_EMAIL";
}

export const CONTACT_TOPICS: readonly ContactTopicEntry[] = [
  {
    value: "General enquiry",
    label: { en: "General question", es: "Consulta general" },
    emailLabels: { en: "General enquiry", es: "Consulta general" },
    directEmail: "inquiry@karmarisedglobal.com",
    envOverrideKey: "CONTACT_INQUIRY_EMAIL",
  },
  {
    value: "Manufacturing Partner introduction",
    label: { en: "Workshop in India", es: "Taller en la India" },
    emailLabels: {
      en: "Manufacturing Partner introduction",
      es: "Presentación de taller o socio de fabricación",
    },
    directEmail: "partners@karmarisedglobal.com",
    envOverrideKey: "CONTACT_PARTNERS_EMAIL",
  },
  {
    value: "AlmaRise D Brand",
    label: { en: "AlmaRise D Brand", es: "AlmaRise D Brand" },
    emailLabels: { en: "AlmaRise D Brand", es: "AlmaRise D Brand" },
    directEmail: "stories@karmarisedglobal.com",
    envOverrideKey: "CONTACT_STORIES_EMAIL",
  },
  {
    value: "Stories and editorial",
    label: { en: "Stories & press", es: "Historias y prensa" },
    emailLabels: { en: "Stories and editorial", es: "Historias y prensa" },
    directEmail: "stories@karmarisedglobal.com",
    envOverrideKey: "CONTACT_STORIES_EMAIL",
  },
  {
    value: "Women's Training Initiative",
    label: { en: "Training Initiative", es: "Formación para mujeres" },
    emailLabels: {
      en: "Women's Training Initiative",
      es: "Iniciativa de formación para mujeres",
    },
    directEmail: "inquiry@karmarisedglobal.com",
    envOverrideKey: "CONTACT_INQUIRY_EMAIL",
  },
];

export function getLocalizedText(
  text: LocalizedText,
  lang: SiteLanguage,
): string {
  return text[lang];
}
