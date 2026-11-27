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

export const PRODUCT_BRIEF_POST_STEPS: readonly ProductBriefStep[] = [
  {
    number: "01",
    title: {
      en: "Alma reads your brief",
      es: "Alma lee tu briefing",
    },
    body: {
      en: "She replies personally in English, Spanish, or Portuguese with initial thoughts and practical questions.",
      es: "Te contesta personalmente en español, inglés o portugués con primeras impresiones y preguntas prácticas.",
    },
  },
  {
    number: "02",
    title: {
      en: "We talk it through face to face",
      es: "Lo hablamos cara a cara",
    },
    body: {
      en: "On a relaxed video call, we look at your brand, what your customers reach for in your shop, and what the finished piece needs to do.",
      es: "En una videollamada tranquila hablamos de tu marca, de lo que busca la gente en tu tienda y de cómo debe comportarse la pieza.",
    },
  },
  {
    number: "03",
    title: {
      en: "You receive a clear proposal",
      es: "Recibes una propuesta clara",
    },
    body: {
      en: "We check materials, the right Indian production units, physical sampling, and your planned production run before sending anything over.",
      es: "Revisamos materiales, la unidad de producción adecuada en la India, el muestreo y el alcance de la tirada antes de enviarte nada.",
    },
  },
  {
    number: "04",
    title: {
      en: "Swatches and physical samples first",
      es: "Primero muestra física de color y prototipos",
    },
    body: {
      en: "Once you approve the proposal, we match colour from a physical swatch and check samples ourselves in India before cutting starts.",
      es: "Cuando apruebas la propuesta, creamos una muestra física de color para tu aprobación y revisamos cada muestra en la India antes de comenzar con el corte de las piezas.",
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
      en: "Ideal when you have a fresh idea, a piece from your shop you want to upgrade, or open questions about producing your own line in India.",
      es: "Ideal cuando tienes una idea recién salida, una pieza de tu tienda que quieres mejorar o dudas sobre fabricar marca propia en la India.",
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
      en: "Built for walking through sketches, physical reference pieces, leather or fabric options, hardware, EU labels, sampling rounds, and launch dates together.",
      es: "Pensada para repasar juntos bocetos, piezas de referencia, opciones de piel o tela, herrajes, etiquetado europeo, muestras y fechas de campaña.",
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
      en: "Do I need a finished tech pack before booking?",
      es: "¿Necesito una ficha técnica cerrada antes de reservar?",
    },
    answer: {
      en: "No. Bring a rough sketch, phone photos, or an item from your shop. Alma emails clear meeting notes right after the call and helps turn your ideas into a written brief before we quote.",
      es: "No. Trae un boceto rápido, fotos del móvil o una pieza de tu tienda. Alma te envía las conclusiones de la reunión por escrito tras la llamada y te ayuda a dar forma a tu idea antes de presupuestar.",
    },
  },
  {
    id: "quantities",
    question: {
      en: "Can we talk openly about smaller first runs or order quantities?",
      es: "¿Podemos hablar abiertamente de primeras tiradas cortas o cantidades?",
    },
    answer: {
      en: "Yes. Every craft region and material works at its own scale, so we do not publish fixed price lists or rigid minimums. We discuss realistic quantities and lead times openly on the call.",
      es: "Sí. Cada región artesana y cada material tienen sus propios requisitos, así que no publicamos tarifas cerradas ni mínimos rígidos. Valoramos cantidades y plazos realistas con claridad en la llamada.",
    },
  },
  {
    id: "confidentiality",
    question: {
      en: "Will my product ideas and sketches stay confidential?",
      es: "¿Mis ideas y bocetos quedan bajo confidencialidad?",
    },
    answer: {
      en: "Yes. Only Alma and Shirish review your files during evaluation, mutual NDA protection is available whenever you want it, and every sketch and pattern remains yours.",
      es: "Sí. Solo Alma y Shirish revisan tus archivos durante la valoración, dispones de acuerdo NDA cuando quieras y cada boceto o patrón sigue siendo tuyo.",
    },
  },
];

export const CONTACT_DEPARTMENTS: readonly ContactDepartmentEntry[] = [
  {
    id: "product-briefs",
    email: "inquiry@karmarisedglobal.com",
    role: {
      en: "New briefs & project enquiries",
      es: "Nuevos briefings y proyectos",
    },
    areaServed: ["ES", "EU"],
  },
  {
    id: "alma",
    email: "alma@karmarisedglobal.com",
    role: {
      en: "Alma · Spain & rest of Europe (ES, EN, PT)",
      es: "Alma · España y resto de Europa (ES, EN, PT)",
    },
    areaServed: ["ES", "EU"],
  },
  {
    id: "partners",
    email: "partners@karmarisedglobal.com",
    role: {
      en: "Makers & factories in India",
      es: "Fábricas y artesanos en la India",
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
  readonly showInPicker?: boolean;
}

export const CONTACT_TOPICS: readonly ContactTopicEntry[] = [
  {
    value: "General enquiry",
    label: {
      en: "Own-brand project or question",
      es: "Proyecto propio o consulta",
    },
    emailLabels: { en: "General enquiry", es: "Consulta general" },
    directEmail: "inquiry@karmarisedglobal.com",
    envOverrideKey: "CONTACT_INQUIRY_EMAIL",
    showInPicker: true,
  },
  {
    value: "Manufacturing Partner introduction",
    label: {
      en: "Factory or atelier in India",
      es: "Fábrica o unidad de producción en la India",
    },
    emailLabels: {
      en: "Manufacturing Partner introduction",
      es: "Presentación de fábrica o unidad de producción",
    },
    directEmail: "partners@karmarisedglobal.com",
    envOverrideKey: "CONTACT_PARTNERS_EMAIL",
    showInPicker: true,
  },
  {
    value: "AlmaRise D Brand",
    label: {
      en: "AlmaRise D Brand",
      es: "AlmaRise D Brand",
    },
    emailLabels: { en: "AlmaRise D Brand", es: "AlmaRise D Brand" },
    directEmail: "stories@karmarisedglobal.com",
    envOverrideKey: "CONTACT_STORIES_EMAIL",
    showInPicker: true,
  },
  {
    value: "Stories and editorial",
    label: {
      en: "Press, podcasts & collaborations",
      es: "Prensa, pódcasts y colaboraciones",
    },
    emailLabels: {
      en: "Press, podcasts & collaborations",
      es: "Prensa, pódcasts y colaboraciones",
    },
    directEmail: "stories@karmarisedglobal.com",
    envOverrideKey: "CONTACT_STORIES_EMAIL",
    showInPicker: true,
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
    showInPicker: true,
  },
];

export const CONTACT_PICKER_TOPICS: readonly ContactTopicEntry[] =
  CONTACT_TOPICS.filter((item) => item.showInPicker !== false);

export function getLocalizedText(
  text: LocalizedText,
  lang: SiteLanguage,
): string {
  return text[lang];
}
