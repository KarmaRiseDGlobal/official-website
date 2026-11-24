import type { SiteLanguage } from "@/lib/urls";

export interface HomeCapability {
  readonly id: string;
  readonly querySlug: "bags" | "garments" | "other" | "home-decor";
  readonly title: Record<SiteLanguage, string>;
  readonly summary: Record<SiteLanguage, string>;
  readonly ctaLabel: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imageAlt: Record<SiteLanguage, string>;
}

export interface HomeProofItem {
  readonly id: string;
  readonly label: Record<SiteLanguage, string>;
  readonly value: Record<SiteLanguage, string>;
  readonly detail: Record<SiteLanguage, string>;
}

export interface HomeFaqItem {
  readonly id: string;
  readonly question: Record<SiteLanguage, string>;
  readonly answer: Record<SiteLanguage, string>;
}

export const HOME_CAPABILITIES: readonly HomeCapability[] = [
  {
    id: "leather-bags",
    querySlug: "bags",
    title: {
      en: "Leather bags and other leather goods",
      es: "Bolsos y otros artículos de piel",
    },
    summary: {
      en: "Structured handbags, soft carryalls, backpacks, and small leather goods in vegetable-tanned hide, antique brass, and high-quality Japanese plastic YKK zippers.",
      es: "Bolsos estructurados, bolsones, mochilas y pequeña marroquinería en piel de curtido vegetal, latón envejecido y cremalleras japonesas YKK de plástico de alta calidad.",
    },
    ctaLabel: {
      en: "Start a leather brief",
      es: "Empezar briefing de piel",
    },
    image: "/images/capabilities/leather-hides.jpg",
    imageAlt: {
      en: "Smooth brown, slate, and burgundy vegetable-tanned leather hides layered on a wooden table",
      es: "Pieles lisas de curtido vegetal en tonos marrón, pizarra y burdeos sobre una mesa de madera",
    },
  },
  {
    id: "clothing-capsules",
    querySlug: "garments",
    title: {
      en: "Clothing in varied fabrics",
      es: "Prendas de diversos tejidos",
    },
    summary: {
      en: "Shirts, dresses, kimonos, shrugs, light jackets, and seasonal capsules in cotton, linen, silk, blended, and plant-based fabrics.",
      es: "Camisas, vestidos, kimonos, shrugs, chaquetas finas y colecciones cápsula en algodón, lino, seda, mezclas y fibras vegetales.",
    },
    ctaLabel: {
      en: "Start a clothing brief",
      es: "Empezar briefing de ropa",
    },
    image: "/images/capabilities/natural-fabrics.jpg",
    imageAlt: {
      en: "Folded stack of olive, terracotta, linen, ochre, and slate fabrics",
      es: "Pila doblada de tejidos naturales en tonos oliva, terracota, lino, ocre y pizarra",
    },
  },
  {
    id: "custom-sewn-goods",
    querySlug: "other",
    title: {
      en: "Custom sewn accessories",
      es: "Complementos a medida",
    },
    summary: {
      en: "Textile pouches, sewn accessories, woven brand labels, cotton dust bags, and unbleached chemical-free recycled cardboard care hangtags.",
      es: "Neceseres textiles, complementos a medida, etiquetas tejidas con tu marca, bolsas guardapolvo y cartón reciclado sin blanquear, libre de químicos.",
    },
    ctaLabel: {
      en: "Start an accessories brief",
      es: "Briefing de complementos",
    },
    image: "/images/capabilities/sewn-accessories-machine.jpg",
    imageAlt: {
      en: "Cast-iron stitching machine in a sunlit sewing studio",
      es: "Máquina de coser de hierro fundido en un espacio de confección soleado",
    },
  },
  {
    id: "home-decor",
    querySlug: "home-decor",
    title: {
      en: "Home decor",
      es: "Decoración del hogar",
    },
    summary: {
      en: "Own-brand home decor in natural textiles, artisan trims, and custom finishes, prepared with EU labelling for export.",
      es: "Decoración del hogar con tu marca en tejidos naturales, fornituras artesanas y acabados a medida con etiquetado europeo.",
    },
    ctaLabel: {
      en: "Start a home decor brief",
      es: "Briefing de decoración",
    },
    image: "/images/capabilities/home-decor-ceramics.jpg",
    imageAlt: {
      en: "Matte ceramic vessels, dried grasses, and linen books on a sunlit table",
      es: "Jarrones cerámicos mate, espigas secas y libros de lino sobre una mesa soleada",
    },
  },
];

export const HOME_PROOF_ITEMS: readonly HomeProofItem[] = [
  {
    id: "multi-cluster",
    label: {
      en: "Multi-region Indian craft",
      es: "Oficio regional en toda la India",
    },
    value: {
      en: "Three Indian states for one Spanish handbag line",
      es: "Tres estados de la India para una línea española de bolsos",
    },
    detail: {
      en: "We vegetable-tanned hides in Kolkata, stitched the bags in Uttar Pradesh, and supervised quality from Maharashtra. All 11 export cartons reached the shop door, and all eight bags went straight into the main downtown window.",
      es: "Curtimos la piel al vegetal en Calcuta, confeccionamos los bolsos en Uttar Pradesh y supervisamos la calidad desde Maharashtra. Las 11 cajas de exportación llegaron a la tienda y los ocho bolsos pasaron directos al escaparate principal.",
    },
  },
  {
    id: "physical-gate",
    label: {
      en: "Proactive product care",
      es: "Cuidado real del producto",
    },
    value: {
      en: "Details tested for daily wear",
      es: "Detalles puestos a prueba en el uso diario",
    },
    detail: {
      en: "We catch friction before cutting starts: high-quality Japanese plastic YKK zippers that spare hands and winter coats, light cotton linings, and 10 to 15 days spent sourcing unbleached chemical-free recycled cardboard for hangtags.",
      es: "Atajamos las molestias antes de comenzar con el corte de las piezas: cremalleras japonesas YKK de plástico de alta calidad que no arañan manos ni abrigos, forros claros de algodón y 10 a 15 días buscando cartón reciclado sin blanquear, libre de químicos.",
    },
  },
  {
    id: "legal-and-language",
    label: {
      en: "Straight dealing and open doors",
      es: "Trato honesto y puertas abiertas",
    },
    value: {
      en: "Enforceable contracts and audited units",
      es: "Contratos claros y unidades auditadas",
    },
    detail: {
      en: "Shirish structures Indian supplier contracts as a registered Bar Council advocate, while both founders audit production sites in person. Any facility that closes its doors or falls short of zero exploitation comes off our list.",
      es: "Shirish redacta los contratos bajo legislación india como abogado colegiado en el Bar Council, y los dos fundadores auditan cada punto de producción en persona. Cualquier instalación opaca o fuera de nuestra tolerancia cero queda descartada.",
    },
  },
];

export const HOME_FOUNDERS_COPY = {
  heading: {
    en: "Two founders, two countries, one team standing behind your collection.",
    es: "Dos fundadores, dos países y un solo equipo detrás de tu colección.",
  },
  coverSummary: {
    en: "Alma works with Clients across Spain and the rest of Europe. Shirish leads contracts, audits, and production on the ground in India.",
    es: "Alma acompaña a comercios y marcas en España y el resto de Europa. Shirish dirige contratos, auditorías y producción sobre el terreno en la India.",
  },
  imageSrc: "/images/client/client.jpg.jpeg",
  imageAlt: {
    en: "Alma and Shirish working together at a wooden desk in India, reviewing collection details on a tablet",
    es: "Alma y Shirish trabajando juntos frente a una mesa de madera en la India, revisando los detalles de una colección en una tableta",
  },
  primaryCta: {
    en: "Meet Alma and Shirish",
    es: "Conoce a Alma y Shirish",
  },
  secondaryCta: {
    en: "Explore AlmaRise D Brand",
    es: "Conoce AlmaRise D Brand",
  },
} as const;

export const HOME_FAQS: readonly HomeFaqItem[] = [
  {
    id: "no-tech-pack",
    question: {
      en: "Do I need a finished tech pack before reaching out?",
      es: "¿Necesito tener una ficha técnica cerrada antes de escribiros?",
    },
    answer: {
      en: "No. Start with a rough sketch, reference photos, an item from your shop, or a free 15-minute video call with Alma in English, Spanish, or Portuguese. We send clear written meeting notes right after and build your Product Brief and physical sample before production begins.",
      es: "No. Empieza con un boceto a mano, fotos de referencia, una pieza de tu tienda o una videollamada gratuita de 15 minutos con Alma en español, inglés o portugués. Te enviamos las conclusiones de la reunión por escrito y preparamos tu briefing de producto y muestra física antes de producir.",
    },
  },
  {
    id: "what-we-manufacture",
    question: {
      en: "What kinds of products can KarmaRise manufacture in India?",
      es: "¿Qué tipo de productos puede fabricar KarmaRise en la India?",
    },
    answer: {
      en: "We produce own-brand leather bags and other leather goods, clothing in natural and varied fabrics, custom sewn accessories with branded labels, dust bags, and unbleached chemical-free recycled cardboard hangtags, and home decor, matching each Product Brief to audited production units across India.",
      es: "Fabricamos con tu marca bolsos y otros artículos de piel, prendas de diversos tejidos, complementos confeccionados a medida con etiquetas tejidas, bolsas guardapolvo y etiquetas de cartón reciclado sin blanquear, libre de químicos, y decoración del hogar en unidades de producción auditadas de la India.",
    },
  },
  {
    id: "scoping-and-quantities",
    question: {
      en: "How do you handle quantities, timelines, and proposals?",
      es: "¿Cómo gestionáis las cantidades, los plazos y las propuestas?",
    },
    answer: {
      en: "Every Manufacturing Programme is scoped individually from your Product Brief. Because leather, garment, and home decor hubs across Kolkata, Kanpur, Agra, and Chennai operate at different scales, we match your collection to the right facility and lay out realistic timelines in a custom proposal.",
      es: "Cada Programa de producción se valora a medida según tu briefing de producto. Como cada centro especialista en Calcuta, Kanpur, Agra o Chennai trabaja a su escala, conectamos tu colección con la unidad adecuada y detallamos plazos y condiciones en una propuesta personalizada.",
    },
  },
  {
    id: "quality-and-colour-control",
    question: {
      en: "How do you protect colour accuracy, confidentiality, and quality across distance?",
      es: "¿Cómo protegéis el color, la confidencialidad y la calidad a distancia?",
    },
    answer: {
      en: "Screens distort shades, so we guide what is needed for each dye batch and create a physical colour swatch for your approval. Production begins only after you approve a reviewed physical sample in your hands, backed by mutual NDA and NNN agreements and Shirish's written Indian supplier contracts.",
      es: "Las pantallas distorsionan los tonos, así que te indicamos qué hace falta para cada tintada y preparamos un retal físico de color para tu aprobación. No procedemos a la producción hasta que apruebas una muestra revisada en tus manos, con acuerdos mutuos NDA y NNN y contratos escritos bajo ley india.",
    },
  },
  {
    id: "ethical-workshops-and-export",
    question: {
      en: "How do you verify ethical working conditions and manage export delivery?",
      es: "¿Cómo comprobáis las condiciones éticas y gestionáis la exportación?",
    },
    answer: {
      en: "Both founders audit family-run factories, production units, and women artisan collectives in person, speaking directly with makers under a strict zero-exploitation standard. We verify EU labelling before packing and include export delivery to your business door in Spain or the rest of Europe in your proposal.",
      es: "Los dos fundadores auditan en persona fábricas de corte familiar, unidades de producción y colectivos de artesanas bajo tolerancia cero ante la explotación. Verificamos el etiquetado europeo antes del embalaje e incluimos el envío hasta la puerta de tu negocio en España o el resto de Europa.",
    },
  },
];

export interface HomeWorkingPrinciple {
  readonly id: string;
  readonly step: string;
  readonly tag: Record<SiteLanguage, string>;
  readonly locationPill: Record<SiteLanguage, string>;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imagePosition?: string;
  readonly imageScale?: number;
  readonly imageOrigin?: string;
  readonly imageAlt: Record<SiteLanguage, string>;
}

export const HOME_WORKING_PRINCIPLES: readonly HomeWorkingPrinciple[] = [
  {
    id: "talk-to-alma",
    step: "01",
    tag: {
      en: "Direct conversation",
      es: "Trato directo",
    },
    locationPill: {
      en: "Spain & rest of Europe → India",
      es: "España y resto de Europa → India",
    },
    title: {
      en: "Start with a face-to-face video call with Alma",
      es: "Empieza con una videollamada cara a cara con Alma",
    },
    body: {
      en: "Talk freely about the piece you have in mind. Alma sends clear meeting notes straight after and takes every detail with Shirish to the production unit.",
      es: "Cuéntanos con libertad la pieza que tienes en mente. Alma te envía las conclusiones de la reunión nada más colgar y lleva cada detalle con Shirish a la unidad de producción.",
    },
    image: "/images/founders/alma-portrait.jpeg",
    imagePosition: "68% 42%",
    imageScale: 1.85,
    imageOrigin: "89% 46%",
    imageAlt: {
      en: "Portrait of Alma, co-founder of KarmaRise D Global",
      es: "Retrato de Alma, cofundadora de KarmaRise D Global",
    },
  },
  {
    id: "clear-reference",
    step: "02",
    tag: {
      en: "Written Product Brief",
      es: "Briefing de producto",
    },
    locationPill: {
      en: "Physical swatches & trims",
      es: "Muestras físicas y fornituras",
    },
    title: {
      en: "Approve colour and texture with something you can touch",
      es: "Aprueba el color y la textura en tus manos",
    },
    body: {
      en: "We tell you what is needed for each dye batch and prepare a physical colour swatch alongside hardware, linings, and finishing so everyone works from one reference.",
      es: "Te indicamos qué hace falta para cada tintada y preparamos un retal físico de color junto a herrajes, forro y acabados para que todo el equipo parta de la misma referencia.",
    },
    image: "/images/workshops/alma-dark-leather-swatch-binder-review.jpeg",
    imageAlt: {
      en: "Alma and a production unit owner comparing leather colour swatch cards in India",
      es: "Alma y el responsable de una unidad de producción comparando muestrarios de color de piel en la India",
    },
  },
  {
    id: "approved-sample",
    step: "03",
    tag: {
      en: "Reviewed samples",
      es: "Muestras para valoración",
    },
    locationPill: {
      en: "On the ground in India",
      es: "Sobre el terreno en la India",
    },
    title: {
      en: "Approve the physical sample before cutting starts",
      es: "Aprueba la muestra física antes de cortar",
    },
    body: {
      en: "We inspect every sample first in India, rework weak prototypes early, and connect you by live video from the production site whenever a decision comes up.",
      es: "Revisamos cada muestra primero en la India, descartamos prototipos flojos a tiempo y te llamamos en directo desde el punto de producción ante cualquier ajuste.",
    },
    image: "/images/workshops/shirish-tan-black-leather-bags-inspection.jpeg",
    imageAlt: {
      en: "Shirish inspecting a finished brown leather sample bag alongside production pieces in India",
      es: "Shirish revisando una muestra terminada de bolso de piel marrón junto a piezas de producción en la India",
    },
  },
  {
    id: "dispatch-plan",
    step: "04",
    tag: {
      en: "Export & delivery",
      es: "Exportación y entrega",
    },
    locationPill: {
      en: "India → Spain & rest of Europe",
      es: "India → España y resto de Europa",
    },
    title: {
      en: "We follow your order to your shop door",
      es: "Seguimos tu pedido hasta la puerta de tu tienda",
    },
    body: {
      en: "EU care and leather labels, cotton dust bags, numbered export cartons, and customs documents are planned upfront so pieces arrive ready for your shop window.",
      es: "Planificamos desde el inicio el etiquetado europeo, bolsas guardapolvo, cajas numeradas y aduanas para que tus piezas lleguen listas para el escaparate.",
    },
    image: "/images/workshops/leather-bags-export-cartons.jpeg",
    imageAlt: {
      en: "Numbered and wrapped export cartons prepared for dispatch in India",
      es: "Cajas de exportación numeradas y retractiladas listas para su salida desde la India",
    },
  },
];

export type ClosingOptionTier = "arch-1" | "arch-2" | "arch-3";

export interface HomeClosingOption {
  readonly id: "product-brief" | "book-call" | "whatsapp";
  readonly tier: ClosingOptionTier;
  readonly primary?: boolean;
  readonly eyebrow: Record<SiteLanguage, string>;
  readonly title: Record<SiteLanguage, string>;
  readonly detail: Record<SiteLanguage, string>;
  readonly external?: boolean;
}

export const HOME_CLOSING_CONVERSATION = {
  heading: {
    en: "Still weighing it up? Start with a relaxed conversation.",
    es: "¿Todavía dándole vueltas? Empieza con una charla tranquila.",
  },
  confidentialityNote: {
    en: "Your designs stay confidential under a mutual NDA. Zero obligation and no tech pack required.",
    es: "Tus diseños son confidenciales (NDA). Sin compromiso ni ficha técnica previa.",
  },
  advanceCue: {
    en: "Choose how to start",
    es: "Elige cómo empezar",
  },
  optionsAriaLabel: {
    en: "Three ways to start a conversation with KarmaRise D Global",
    es: "Tres formas de empezar una conversación con KarmaRise D Global",
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
        en: "No form needed. Ask directly and hear straight back from Alma.",
        es: "Sin formularios. Escribe directamente y te responde Alma.",
      },
      external: true,
    },
    {
      id: "book-call",
      tier: "arch-2",
      primary: true,
      eyebrow: {
        en: "Want to talk it through",
        es: "Prefieres hablarlo primero",
      },
      title: {
        en: "Book a free 15-minute call with Alma",
        es: "Reserva una llamada gratis de 15 min con Alma",
      },
      detail: {
        en: "Zero obligation. Talk face to face and receive written meeting notes.",
        es: "Sin compromiso. Habla cara a cara y recibe las conclusiones por escrito.",
      },
    },
    {
      id: "product-brief",
      tier: "arch-3",
      eyebrow: {
        en: "Ready with an idea",
        es: "Ya tienes una idea",
      },
      title: {
        en: "Share your product idea",
        es: "Cuéntanos tu idea",
      },
      detail: {
        en: "1-minute brief from a sketch or reference. Confidential under a mutual NDA.",
        es: "Briefing en 1 min desde un boceto o referencia. Confidencial bajo NDA.",
      },
    },
  ] as readonly HomeClosingOption[],
} as const;
