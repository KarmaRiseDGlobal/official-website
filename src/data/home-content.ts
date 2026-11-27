import type { SiteLanguage } from "@/lib/urls";

export interface HomeCapability {
  readonly id: string;
  readonly querySlug:
    "bags" | "garments" | "textile-accessories" | "home-decor";
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
      en: "Leather goods",
      es: "Bolsos y artículos de piel",
    },
    summary: {
      en: "Contemporary hobo bags, stylish everyday backpacks, small crossbodies, makeup pouches, wallets, and travel bags in supple vegetable-tanned leather.",
      es: "Bolsos hobo actuales, mochilas urbanas, bandoleras pequeñas, estuches de maquillaje, carteras y bolsas de viaje en piel suave de curtido vegetal.",
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
      en: "Clothing",
      es: "Ropa y prendas",
    },
    summary: {
      en: "Cotton and linen midi dresses and skirts, unique denim pieces, blouses, jumpsuits, and outerwear made with family-run garment makers and artisan collectives.",
      es: "Vestidos y faldas midi en algodón y lino, piezas singulares en denim, blusas, monos y prendas exteriores con confeccionistas familiares y colectivos de artesanas.",
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
    id: "textile-accessories",
    querySlug: "textile-accessories",
    title: {
      en: "Textile accessories",
      es: "Complementos textiles",
    },
    summary: {
      en: "Pashminas, scarves, shawls, thick canvas and quilted totes, embroidered clutches, toiletry cases, padded headbands, sashes, and fabric sleeves.",
      es: "Pashminas, pañuelos, chales, totes de loneta y bolsos acolchados, clutches bordados, neceseres de viaje, diademas, fajines y fundas textiles.",
    },
    ctaLabel: {
      en: "Start an accessories brief",
      es: "Briefing de complementos",
    },
    image: "/images/capabilities/textile-accessories.jpg",
    imageAlt: {
      en: "Woven pashmina scarf, quilted cotton-linen tote bag, embroidered evening clutch, and padded linen headband on a sunlit stone surface",
      es: "Pashmina tejida, tote acolchado de algodón y lino, clutch bordado y diadema de lino sobre una superficie de piedra soleada",
    },
  },
  {
    id: "home-decor",
    querySlug: "home-decor",
    title: {
      en: "Textile home decor",
      es: "Decoración textil del hogar",
    },
    summary: {
      en: "Cushion covers, wall hangings, Kantha-style bedspreads, recycled-cotton flat-weave dhurries, table runners, tablecloths, and placemats.",
      es: "Fundas de cojín, tapices de pared, colchas estilo Kantha, alfombras dhurrie de algodón reciclado, caminos de mesa, manteles e individuales.",
    },
    ctaLabel: {
      en: "Start a home decor brief",
      es: "Briefing de decoración textil",
    },
    image: "/images/culture/maharashtra-handloom-zari-border.jpg",
    imageAlt: {
      en: "Artisan hands weaving a gold and crimson patterned cloth border on a wooden handloom with wooden shuttles beside skeins of natural yarn",
      es: "Manos artesanas tejiendo una cenefa dorada y carmesí en un telar de madera con lanzaderas junto a madejas de hilo natural",
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
      en: "We vegetable-tanned hides in Kolkata, stitched the bags in Uttar Pradesh, and checked every piece from Maharashtra. All 11 cartons reached the shop door, and all eight designs (four models in black and tan) went straight into the main window.",
      es: "Curtimos la piel al vegetal en Calcuta, confeccionamos los bolsos en Uttar Pradesh y revisamos cada pieza desde Maharashtra. Las 11 cajas llegaron a la tienda y las ocho versiones (cuatro modelos en negro y cuero) pasaron directas al escaparate.",
    },
  },
  {
    id: "physical-gate",
    label: {
      en: "Proactive product care",
      es: "Cuidado real del producto",
    },
    value: {
      en: "Small details fixed before production",
      es: "Pequeños detalles resueltos a tiempo",
    },
    detail: {
      en: "We think like the person wearing the piece every day: comfortable straps, smooth closures that spare hands and winter coats, light linings so keys are easy to spot, and hangtags in unbleached recycled cardboard.",
      es: "Pensamos en quien llevará la pieza cada día: asas cómodas, cierres suaves que no arañan manos ni abrigos, forros claros donde todo se ve y etiquetas de cartón reciclado sin blanquear.",
    },
  },
  {
    id: "legal-and-language",
    label: {
      en: "Straight dealing and open doors",
      es: "Trato honesto y puertas abiertas",
    },
    value: {
      en: "Written Indian contracts and open doors",
      es: "Contratos bajo ley india y puertas abiertas",
    },
    detail: {
      en: "Shirish is a registered Bar Council advocate who puts every maker's terms into a written Indian contract. We visit every atelier and family-run factory in person; if a door stays closed, we walk away.",
      es: "Shirish es abogado colegiado en el Bar Council y recoge los compromisos de cada fabricante por escrito bajo ley india. Visitamos cada fábrica familiar y marroquinería en persona; si nos cierran una puerta, nos marchamos.",
    },
  },
];

export const HOME_FOUNDERS_COPY = {
  heading: {
    en: "Two founders, two countries, one team behind your collection.",
    es: "Dos fundadores, dos países y un solo equipo detrás de tu colección.",
  },
  coverSummary: {
    en: "Alma works with shop owners and brands across Spain and the rest of Europe. Shirish leads contracts, visits, and production in India.",
    es: "Alma acompaña a comercios y marcas en España y el resto de Europa. Shirish dirige contratos, visitas y producción en la India.",
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
  coverCue: {
    en: "Read how we back every order",
    es: "Cómo respaldamos cada pedido",
  },
  proofRegionAria: {
    en: "How Alma and Shirish protect your production",
    es: "Cómo Alma y Shirish protegen tu producción",
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
      en: "No. Start with a rough sketch, reference photos, or a piece from your shop. Book a free 15-minute video call with Alma in English, Spanish, or Portuguese, and we build the specification together.",
      es: "No. Empieza con un boceto a mano, fotos de referencia o una pieza de tu tienda. Reserva una videollamada gratuita de 15 minutos con Alma en español, inglés o portugués y construimos juntos las especificaciones.",
    },
  },
  {
    id: "scoping-and-quantities",
    question: {
      en: "Do you have fixed minimum orders or price lists?",
      es: "¿Tenéis cantidades mínimas fijas o tarifas cerradas?",
    },
    answer: {
      en: "No. Every project is quoted from your brief because a leather atelier and a cotton weaving house operate at very different scales. We handle first-time boutique capsules as well as repeat retail runs.",
      es: "No. Cada proyecto se valora según tu idea porque una marroquinería y un tejedor de algodón trabajan a escalas muy distintas. Acompañamos tanto primeras cápsulas de comercio como reposiciones más amplias.",
    },
  },
  {
    id: "quality-and-colour-control",
    question: {
      en: "How do I trust colour and quality across continents?",
      es: "¿Cómo puedo fiarme del color y la calidad a tanta distancia?",
    },
    answer: {
      en: "You approve a real colour swatch and hold the finished physical sample before production begins. Mutual NDA protection is ready whenever you want it, backed by written Indian contracts.",
      es: "Apruebas una muestra física de color y tienes la muestra terminada en tus manos antes de producir. Dispones de acuerdo mutuo NDA cuando quieras y de contratos escritos bajo ley india.",
    },
  },
  {
    id: "ethical-workshops-and-export",
    question: {
      en: "Do you handle ethical checks and delivery to Europe?",
      es: "¿Os encargáis de las comprobaciones éticas y del envío a Europa?",
    },
    answer: {
      en: "Yes. We visit every factory and artisan collective in person under a strict zero-exploitation standard, and your proposal includes EU labelling and door-to-door delivery across Spain and the rest of Europe.",
      es: "Sí. Visitamos personalmente cada fábrica y colectivo de artesanas bajo tolerancia cero ante la explotación, y tu propuesta incluye el etiquetado europeo y la entrega hasta tu puerta en España o el resto de Europa.",
    },
  },
];

export interface HomeWorkingPrinciple {
  readonly id: string;
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
    title: {
      en: "Start with a face-to-face call with Alma",
      es: "Empieza con una llamada cara a cara con Alma",
    },
    body: {
      en: "Talk through your idea without a technical file. Alma sends clear meeting notes right after and takes every detail with Shirish to the makers.",
      es: "Cuéntanos tu idea sin necesidad de ficha técnica. Alma te envía por escrito las conclusiones de la reunión nada más colgar y traslada cada detalle con Shirish al equipo en la India.",
    },
    image: "/images/founders/alma-swing-laughing.jpeg",
    imagePosition: "50% 42%",
    imageAlt: {
      en: "Alma laughing warmly on a wooden porch swing in India, ready for a face-to-face call",
      es: "Alma riendo con cercanía en un columpio de madera en la India, lista para una videollamada cara a cara",
    },
  },
  {
    id: "clear-reference",
    title: {
      en: "Approve colour and texture in your hands",
      es: "Aprueba color y textura en tus manos",
    },
    body: {
      en: "Screens distort shades, so we prepare a real colour swatch alongside hardware and lining before dyeing starts.",
      es: "Las pantallas distorsionan los tonos, así que preparamos una muestra física de color junto a herrajes y forro antes de teñir.",
    },
    image: "/images/workshops/cognac-leather-bag-bodies-brass-zippers.jpg",
    imagePosition: "50% 50%",
    imageAlt: {
      en: "Stacked cognac vegetable-tanned leather bag panels stitched with zippers beside cut black leather straps",
      es: "Paneles apilados de piel de curtido vegetal en tono coñac cosidos con cremalleras junto a correas de piel negra cortadas",
    },
  },
  {
    id: "approved-sample",
    title: {
      en: "Sign off the sample before cutting starts",
      es: "Aprueba la muestra antes de cortar",
    },
    body: {
      en: "We inspect the first prototype ourselves in India, rework weak drafts early, and bring you on live video whenever a choice comes up.",
      es: "Revisamos el primer prototipo en la India, corregimos fallos antes de enviártelo y te llamamos en directo ante cualquier decisión.",
    },
    image: "/images/workshops/shirish-tan-black-leather-bags-inspection.jpeg",
    imagePosition: "50% 24%",
    imageAlt: {
      en: "Shirish inspecting a finished brown leather sample bag alongside production pieces in India",
      es: "Shirish revisando una muestra terminada de bolso de piel marrón junto a piezas de producción en la India",
    },
  },
  {
    id: "dispatch-plan",
    title: {
      en: "Delivered ready for your shop window",
      es: "Entregado listo para tu escaparate",
    },
    body: {
      en: "EU care labels, protective packing, and customs paperwork are planned upfront so cartons arrive ready to unpack and display.",
      es: "Planificamos desde el inicio el etiquetado europeo, el embalaje protector y las aduanas para que las cajas lleguen listas para exponer.",
    },
    image: "/images/workshops/leather-bags-export-cartons.jpeg",
    imageAlt: {
      en: "Numbered and wrapped cartons prepared for dispatch in India",
      es: "Cajas numeradas y retractiladas listas para su salida desde la India",
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
    en: "Mutual NDA available from day one. Zero obligation and no tech pack needed.",
    es: "Acuerdo NDA disponible desde el primer día. Sin compromiso ni ficha técnica previa.",
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
        en: "Book a free call with Alma",
        es: "Reserva una llamada gratis con Alma",
      },
      detail: {
        en: "Free 15-minute video call face to face, with clear meeting notes sent right after.",
        es: "Videollamada gratuita de 15 minutos cara a cara, con las conclusiones de la reunión por escrito justo después.",
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
        en: "Send a sketch, photo, or reference piece in three short steps.",
        es: "Envíanos un boceto, foto o pieza de referencia en tres pasos breves.",
      },
    },
  ] as readonly HomeClosingOption[],
} as const;
