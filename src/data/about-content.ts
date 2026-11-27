import type { ClosingConversationCopy } from "@/components/home/closing-conversation-section";
import type { SiteLanguage } from "@/lib/urls";

export interface AboutFounderModule {
  readonly id: "alma" | "shirish";
  readonly name: string;
  readonly place: Record<SiteLanguage, string>;
  readonly lead: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imageAlt: Record<SiteLanguage, string>;
}

export interface AboutSpainIndiaEndpoint {
  readonly preposition: Record<SiteLanguage, string>;
  readonly country: Record<SiteLanguage, string>;
}

export interface AboutSpainIndiaBridge {
  readonly heading: Record<SiteLanguage, string>;
  readonly summary: Record<SiteLanguage, string>;
  readonly origin: AboutSpainIndiaEndpoint;
  readonly destination: AboutSpainIndiaEndpoint;
}

export interface AboutPrinciple {
  readonly id: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
}

export interface AboutCompanyFactRow {
  readonly id: string;
  readonly label: Record<SiteLanguage, string>;
  readonly value: Record<SiteLanguage, string>;
  readonly numeric?: boolean;
}

export interface AboutFaqItem {
  readonly id: string;
  readonly question: Record<SiteLanguage, string>;
  readonly answer: Record<SiteLanguage, string>;
}

export const ABOUT_LAST_REVIEWED = {
  iso: "2026-11-27",
  en: "27 November 2026",
  es: "27 de noviembre de 2026",
} as const;

export const ABOUT_SPAIN_INDIA_BRIDGE: AboutSpainIndiaBridge = {
  heading: {
    en: "One team, from Spain to India",
    es: "Un solo equipo, de España a la India",
  },
  summary: {
    en: "You talk things through with Alma in Spain, and both of us visit every factory and atelier in India so nothing gets lost between your shop and the stitching room.",
    es: "Lo hablas de tú a tú con Alma en España, y visitamos juntos cada fábrica y estudio artesano en la India para que nada se pierda entre tu tienda y la confección.",
  },
  origin: {
    preposition: {
      en: "From",
      es: "Desde",
    },
    country: {
      en: "Spain",
      es: "España",
    },
  },
  destination: {
    preposition: {
      en: "To",
      es: "Hasta",
    },
    country: {
      en: "India",
      es: "la India",
    },
  },
};

export const ABOUT_FOUNDERS: readonly [AboutFounderModule, AboutFounderModule] =
  [
    {
      id: "alma",
      name: "Alma",
      place: {
        en: "Spain",
        es: "España",
      },
      lead: {
        en: "Alma knows what it takes to open a shop every morning and stand behind every piece in the window.",
        es: "Alma sabe lo que cuesta subir el cierre de una tienda cada mañana y responder por cada pieza del escaparate.",
      },
      body: {
        en: "Having run her own companies in Spain and guided imports from Asia, she leads every client conversation with a shop owner's eye. Beside Shirish in India, she checks drape, comfort, and finishing by hand on every sample, and directs our own label AlmaRise D Brand.",
        es: "Tras dirigir sus propias empresas en España y acompañar importaciones desde Asia, lleva cada conversación con la mirada de quien atiende una tienda. Junto a Shirish en la India, revisa a mano la caída, la comodidad y los acabados de cada muestra, y dirige nuestra marca AlmaRise D Brand.",
      },
      image: "/images/founders/alma-portrait.jpeg",
      imageAlt: {
        en: "Alma standing beside a sunlit stone overlook, co-founder of KarmaRise D Global",
        es: "Alma junto a un mirador de piedra al sol, cofundadora de KarmaRise D Global",
      },
    },
    {
      id: "shirish",
      name: "Shirish",
      place: {
        en: "India",
        es: "La India",
      },
      lead: {
        en: "A registered Bar Council advocate in India, Shirish brings legal clarity and steady presence to every maker relationship.",
        es: "Abogado colegiado en el Bar Council de la India, Shirish aporta claridad legal y presencia cercana en cada relación con fabricantes.",
      },
      body: {
        en: "He visits family-run factories, leather ateliers, garment makers, and women artisan collectives across India in person, putting clear terms into Indian supplier contracts and guiding shipments through export. He is also laying the legal groundwork for our planned Section 8 foundation.",
        es: "Visita en persona fábricas familiares, marroquineros, confeccionistas y colectivos de artesanas por toda la India, dejando cada compromiso claro en contratos bajo ley india y guiando cada envío hasta su salida. También prepara la base legal de nuestra futura fundación Section 8.",
      },
      image: "/images/workshops/shirish-at-leather-warehouse-desk.jpeg",
      imageAlt: {
        en: "Shirish, co-founder and registered Bar Council advocate, seated at a review desk surrounded by leather hides and sample bags in India",
        es: "Shirish, cofundador y abogado colegiado en el Bar Council, sentado en una mesa de revisión rodeado de pieles y muestras de bolsos en la India",
      },
    },
  ];

export const ABOUT_PRINCIPLES: readonly AboutPrinciple[] = [
  {
    id: "feasible-early",
    title: {
      en: "Say what works early",
      es: "Decir qué es viable desde el principio",
    },
    body: {
      en: "If a material, hardware detail, quantity, or launch date needs rethinking, we say so plainly before you spend money on samples.",
      es: "Si un material, un detalle, un volumen o una fecha piden cambios, te lo decimos sin rodeos antes de que inviertas en prototipos.",
    },
  },
  {
    id: "clear-terms",
    title: {
      en: "Fair terms for both sides",
      es: "Trato justo para ambas partes",
    },
    body: {
      en: "Makers do their cleanest work with fair pay, clear written specs, and solid contracts under Indian law. Nobody wins when margins squeeze craft.",
      es: "Un buen fabricante da lo mejor de sí con un pago justo, especificaciones claras y contratos sólidos bajo ley india. Nadie gana cuando se aprieta el oficio.",
    },
  },
  {
    id: "stay-involved",
    title: {
      en: "Touch everything before it ships",
      es: "Tocar cada pieza antes de que viaje",
    },
    body: {
      en: "We never trust colour or finishing from phone photos alone. We check swatches, prototypes, and finished batches by hand before anything leaves India.",
      es: "Nunca nos fiamos del color ni de los acabados solo por fotos. Comprobamos muestras de color, prototipos y lotes terminados a mano antes de que salgan de la India.",
    },
  },
  {
    id: "repeat-work",
    title: {
      en: "Build for your second and third season",
      es: "Construir para tu segunda y tercera temporada",
    },
    body: {
      en: "We spend full days beside the people stitching your pieces in open-door ateliers. That relationship is why repeat runs run smoother every season.",
      es: "Pasamos jornadas enteras junto a quienes cosen tus piezas en fábricas de puertas abiertas. Esa confianza hace que cada temporada salga más rodada.",
    },
  },
];

export const ABOUT_COMPANY_FACTS: readonly AboutCompanyFactRow[] = [
  {
    id: "brand-and-entity",
    label: {
      en: "Brand and legal operator",
      es: "Marca y titular legal",
    },
    value: {
      en: "KarmaRise D Global, operated by Karmarise Global LLP (incorporated in India on 15 May 2025)",
      es: "KarmaRise D Global, operada por Karmarise Global LLP (constituida en la India el 15 de mayo de 2025)",
    },
  },
  {
    id: "registration",
    label: {
      en: "Indian registration",
      es: "Registro mercantil y fiscal",
    },
    value: {
      en: "LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL",
      es: "LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL",
    },
    numeric: true,
  },
  {
    id: "founders",
    label: {
      en: "Co-founders",
      es: "Cofundadores",
    },
    value: {
      en: "Alma (client direction, product wearability, AlmaRise D Brand) and Shirish (Bar Council advocate, Indian contracts, maker visits, export)",
      es: "Alma (relación con clientes, producto, AlmaRise D Brand) y Shirish (abogado del Bar Council, contratos indios, visitas y exportación)",
    },
  },
  {
    id: "languages",
    label: {
      en: "Working languages",
      es: "Idiomas de trabajo",
    },
    value: {
      en: "Spanish, English, and Portuguese with European clients; English, Marathi, and Hindi in India",
      es: "Español, inglés y portugués con clientes europeos; inglés, maratí e hindi en la India",
    },
  },
  {
    id: "core-service",
    label: {
      en: "What we manufacture",
      es: "Qué fabricamos",
    },
    value: {
      en: "Own-brand leather goods, clothing, textile accessories, and textile home decor, scoped individually per brief",
      es: "Bolsos y artículos de piel, ropa, complementos textiles y decoración textil del hogar con tu marca, valorados a medida",
    },
  },
  {
    id: "footprint",
    label: {
      en: "Operating footprint",
      es: "Ámbito geográfico",
    },
    value: {
      en: "Studio in Maharashtra (near Mumbai) coordinating craft hubs across Kolkata, Kanpur, Agra, and Chennai for clients in Spain and the rest of Europe",
      es: "Estudio en Maharashtra (cerca de Mumbai) coordinando polos artesanos en Calcuta, Kanpur, Agra y Chennai para clientes de España y el resto de Europa",
    },
  },
  {
    id: "almarise",
    label: {
      en: "Owned brand",
      es: "Marca propia",
    },
    value: {
      en: "AlmaRise D Brand (AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor)",
      es: "AlmaRise D Brand (AlmaRise D Reborn, AlmaRise D Organic y AlmaRise D Home Decor)",
    },
  },
  {
    id: "social-initiative",
    label: {
      en: "Planned social initiative",
      es: "Iniciativa social en preparación",
    },
    value: {
      en: "Women's Training Initiative in India under a planned Section 8 foundation (applications not yet open)",
      es: "Iniciativa de formación para mujeres en la India bajo una futura fundación Section 8 (inscripciones cerradas)",
    },
  },
];

export const ABOUT_FAQS: readonly AboutFaqItem[] = [
  {
    id: "brokers-or-hands-on",
    question: {
      en: "Are Alma and Shirish remote sourcing agents, or do they visit makers in person?",
      es: "¿Sois intermediarios a distancia o visitáis a los fabricantes en persona?",
    },
    answer: {
      en: "We work directly on the ground in India rather than brokering by email. Both of us travel to visit family-run factories, leather ateliers, garment makers, and women artisan collectives in person, inspect prototypes by hand, and oversee packing before dispatch.",
      es: "Trabajamos directamente sobre el terreno en la India, nunca como intermediarios por correo. Recorremos juntos fábricas familiares, marroquineros, confeccionistas y colectivos de artesanas en persona, revisamos prototipos a mano y supervisamos el embalaje antes de cada envío.",
    },
  },
  {
    id: "almarise-connection",
    question: {
      en: "How does AlmaRise D Brand connect to your client manufacturing work?",
      es: "¿Qué relación tiene AlmaRise D Brand con vuestra fabricación para clientes?",
    },
    answer: {
      en: "AlmaRise D Brand is our own fashion and lifestyle label in India. Designing, cutting, and finishing our own pieces every week keeps our eye sharp on fabrics, seams, and fit for every client collection we supervise.",
      es: "AlmaRise D Brand es nuestra marca propia de moda y hogar en la India. Diseñar, cortar y rematar nuestras propias piezas cada semana afina nuestro ojo para tejidos, costuras y caída en cada colección de clientes.",
    },
  },
  {
    id: "womens-training-status",
    question: {
      en: "Is the Women's Training Initiative an NGO or open for applications right now?",
      es: "¿Es la Iniciativa de formación para mujeres una ONG o tiene plazas abiertas?",
    },
    answer: {
      en: "No. It is a planned garment design and stitching programme in India currently in preparation under a future Section 8 foundation, focused on dignified paid work. Applications are not open yet, and we post candid progress updates on its dedicated page.",
      es: "No. Es un programa de diseño y confección en preparación en la India bajo una futura fundación Section 8, pensado para abrir camino hacia un trabajo digno y remunerado. Las inscripciones siguen cerradas y publicamos avances reales en su página dedicada.",
    },
  },
];

export const ABOUT_CLOSING_CONVERSATION: ClosingConversationCopy = {
  heading: {
    en: "Come tell us what you want to make.",
    es: "Ven a contarnos qué quieres fabricar.",
  },
  confidentialityNote: {
    en: "No tech pack needed. Mutual NDA available from day one, and only Alma and Shirish read your notes.",
    es: "Sin ficha técnica previa. Acuerdo NDA disponible desde el primer día y solo Alma y Shirish leen tus notas.",
  },
  advanceCue: {
    en: "Choose how to start",
    es: "Elige cómo empezar",
  },
  optionsAriaLabel: {
    en: "Three ways to start working with Alma and Shirish",
    es: "Tres formas de empezar a trabajar con Alma y Shirish",
  },
  options: [
    {
      id: "whatsapp",
      tier: "arch-1",
      eyebrow: {
        en: "Have a quick question",
        es: "Una duda rápida",
      },
      title: {
        en: "Message Alma on WhatsApp",
        es: "Escribe a Alma por WhatsApp",
      },
      detail: {
        en: "Ask about samples, materials, or how we work in India and hear straight back from Alma.",
        es: "Consulta sobre muestras, materiales o cómo trabajamos en la India y te responde directamente Alma.",
      },
      external: true,
    },
    {
      id: "book-call",
      tier: "arch-2",
      primary: true,
      eyebrow: {
        en: "Meet us face to face",
        es: "Conócenos cara a cara",
      },
      title: {
        en: "Book a free call with Alma",
        es: "Reserva una llamada gratis con Alma",
      },
      detail: {
        en: "Free 15-minute video call. Bring a favourite piece from your shop or a rough sketch, and Alma sends clear meeting notes right after.",
        es: "Videollamada gratuita de 15 minutos. Trae una pieza que funcione en tu tienda o un boceto rápido y Alma te envía por escrito las conclusiones de la reunión al colgar.",
      },
    },
    {
      id: "product-brief",
      tier: "arch-3",
      eyebrow: {
        en: "Ready to share your piece",
        es: "Ya tienes una idea o pieza",
      },
      title: {
        en: "Share your product idea",
        es: "Cuéntanos tu idea",
      },
      detail: {
        en: "Three short steps from a sketch or shop piece. Zero obligation.",
        es: "Tres pasos breves desde un boceto o una pieza de tu tienda. Sin compromiso.",
      },
    },
  ],
};
