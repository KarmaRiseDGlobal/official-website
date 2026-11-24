import type { SiteLanguage } from "@/lib/urls";

export interface AboutHeroFact {
  readonly number: string;
  readonly label: Record<SiteLanguage, string>;
  readonly detail: Record<SiteLanguage, string>;
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
}

export interface AboutFounderQuote {
  readonly id: string;
  readonly quote: Record<SiteLanguage, string>;
  readonly attribution: Record<SiteLanguage, string>;
}

export interface AboutFaqItem {
  readonly id: string;
  readonly question: Record<SiteLanguage, string>;
  readonly answer: Record<SiteLanguage, string>;
}

export const ABOUT_LAST_REVIEWED = {
  iso: "2026-11-24",
  en: "24 November 2026",
  es: "24 de noviembre de 2026",
} as const;

export const ABOUT_HERO_FACTS: readonly AboutHeroFact[] = [
  {
    number: "01",
    label: {
      en: "One team across both countries",
      es: "Un solo equipo entre ambos países",
    },
    detail: {
      en: "Alma leads your calls and product feedback from Spain and the rest of Europe, then works beside Shirish at production sites across India so every detail survives the trip from your shop to delivery.",
      es: "Alma atiende tus llamadas y aporta criterio comercial desde España y el resto de Europa. Después trabaja codo con codo junto a Shirish a pie de obra en la India para que ningún detalle se pierda por el camino.",
    },
  },
  {
    number: "02",
    label: {
      en: "Registered Indian LLP",
      es: "LLP registrada en la India",
    },
    detail: {
      en: "Karmarise Global LLP legally operates KarmaRise D Global, incorporated on 15 May 2025 (LLPIN ACO-3878, GSTIN 27ABDFK8128R1ZL). Shirish puts written Indian supplier contracts in place before any Manufacturing Partner buys hides or cloth.",
      es: "Karmarise Global LLP opera legalmente KarmaRise D Global, constituida el 15 de mayo de 2025 (LLPIN ACO-3878, GSTIN 27ABDFK8128R1ZL). Antes de comprar piel o tejido, dejamos firmados contratos escritos bajo legislación india.",
    },
  },
  {
    number: "03",
    label: {
      en: "Open-door partner audits",
      es: "Auditorías externas",
    },
    detail: {
      en: "We audit family-run factories, specialist production units, and women artisan collectives across India in person. If a facility keeps its doors closed or falls short of our zero-exploitation standard, we walk away.",
      es: "Auditamos en persona fábricas de corte familiar, unidades de producción especializadas y colectivos de artesanas por toda la India. Puertas abiertas, o nos marchamos. Si una instalación incumple nuestra tolerancia cero ante la explotación, no trabajamos con ella.",
    },
  },
];

export const ABOUT_PRINCIPLES: readonly AboutPrinciple[] = [
  {
    id: "feasible-early",
    title: {
      en: "Tell you what is feasible early",
      es: "Decirte qué es viable desde el principio",
    },
    body: {
      en: "If a leather finish, fabric blend, hardware piece, quantity, or launch date needs rethinking, we say so plainly before you spend money on samples.",
      es: "Si un acabado en piel, un tejido, un herraje, un volumen o una fecha de campaña piden cambios, te lo decimos sin rodeos antes de que inviertas en prototipos.",
    },
  },
  {
    id: "clear-terms",
    title: {
      en: "Write clear terms for both sides",
      es: "Pactar condiciones claras para ambas partes",
    },
    body: {
      en: "A Manufacturing Partner produces their cleanest work with fair pay, a binding contract under Indian law, and a written Product Brief. We lock material tolerances, NDA confidentiality, and delivery expectations before cutting starts.",
      es: "Una unidad de producción rinde al máximo con una retribución justa, un contrato sólido bajo ley india y un briefing de producto preciso. Cerramos cada tolerancia, los acuerdos mutuos NDA y los plazos antes de comenzar con el corte de las piezas.",
    },
  },
  {
    id: "stay-involved",
    title: {
      en: "Approve physical colour swatches and reviewed samples",
      es: "Aprobar muestras físicas de color y muestras para valoración",
    },
    body: {
      en: "Phone photos distort tan leather and natural dyes. We tell you what each dye batch requires and create a physical colour swatch for your approval. In India, we review every prototype first, flag tiny refinements openly, and check stitching, EU labels, and export cartons on site before dispatch.",
      es: "Las fotos del móvil engañan con la piel tostada y los tintes naturales. Te indicamos qué hace falta para cada tintada y creamos una muestra física de color para tu aprobación. Revisamos cada prototipo allí, avisamos de frente sobre cualquier ajuste mínimo y comprobamos en planta las costuras, el etiquetado europeo y el embalaje antes de embarcar.",
    },
  },
  {
    id: "repeat-work",
    title: {
      en: "Build for your second and third Bulk Order",
      es: "Construir para tu segundo y tercer pedido de producción",
    },
    body: {
      en: "We spend full days at open-door production sites talking directly with the artisans beside the stitching lines. That steady relationship is why your second and third Bulk Order run smoother every season.",
      es: "Pasamos jornadas enteras en puntos de producción de puertas abiertas charlando de tú a tú con los artesanos y artesanas. Esa cercanía es lo que hace que tu segundo y tercer pedido de producción salgan todavía más rodados.",
    },
  },
];

export const ABOUT_FOUNDER_QUOTES: readonly AboutFounderQuote[] = [
  {
    id: "alma-checks",
    quote: {
      en: "I cannot assure you that nothing will go off plan, because that is not in my hand. I can assure you everything will be checked two, three, five times.",
      es: "No puedo asegurarte que nunca surgirá un imprevisto, porque eso no está en mi mano. Puedo asegurarte que todo se revisará dos, tres y cinco veces.",
    },
    attribution: {
      en: "Alma, Co-founder of KarmaRise D Global",
      es: "Alma, cofundadora de KarmaRise D Global",
    },
  },
  {
    id: "shirish-straight-dealing",
    quote: {
      en: "Whether we are producing leather bags for a Client in Spain or giving a family saree a second life, we carry our history, our straight dealing, and our people into everything that leaves our hands.",
      es: "Tanto si fabricamos bolsos de piel para un cliente en España como si damos una segunda vida a un sari familiar, ponemos nuestra historia, nuestro trato limpio y a nuestra gente en cada pieza que sale de nuestras manos.",
    },
    attribution: {
      en: "Shirish, Co-founder and registered Bar Council advocate in India",
      es: "Shirish, cofundador y abogado colegiado en el Bar Council de la India",
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
      en: "Indian registration numbers",
      es: "Registro mercantil y fiscal",
    },
    value: {
      en: "LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL (full statutory disclosures on Legal notice)",
      es: "LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL (datos registrales completos en Aviso legal)",
    },
  },
  {
    id: "founders",
    label: {
      en: "Co-founders and roles",
      es: "Cofundadores y reparto",
    },
    value: {
      en: "Alma (Spanish entrepreneur leading Client alignment, product ergonomics, and AlmaRise D Brand) and Shirish (registered Bar Council advocate in India leading Indian supplier contracts, NDA/NNN terms, partner audits, and on-site supervision)",
      es: "Alma (empresaria española al frente de clientes, ergonomía y AlmaRise D Brand) y Shirish (abogado colegiado en el Bar Council de la India al frente de contratos, acuerdos NDA y NNN, auditorías externas y controles en planta)",
    },
  },
  {
    id: "languages",
    label: {
      en: "Working languages",
      es: "Idiomas de trabajo",
    },
    value: {
      en: "Spanish, English, and Portuguese for Client calls and briefings in Spain and the rest of Europe; English, Marathi, and Hindi on the ground in India",
      es: "Español, inglés y portugués en llamadas y briefings con España y el resto de Europa; inglés, maratí e hindi sobre el terreno en la India",
    },
  },
  {
    id: "core-service",
    label: {
      en: "Core B2B categories",
      es: "Categorías B2B principales",
    },
    value: {
      en: "End-to-end Manufacturing Programmes across India in four categories: leather bags and other leather goods, clothing in natural and varied fabrics and capsule collections, custom sewn accessories and brand presentation, and home decor",
      es: "Programas de producción integrales en cuatro áreas: bolsos de piel y otros artículos de piel, prendas de diversos tejidos en colecciones cápsula, complementos confeccionados a medida con presentación de marca y decoración del hogar",
    },
  },
  {
    id: "footprint",
    label: {
      en: "Operating footprint",
      es: "Ámbito geográfico",
    },
    value: {
      en: "Studio in Maharashtra (near Mumbai) with in-person audits across Indian craft hubs including Kolkata, Kanpur, Agra, and Chennai; serving boutiques, brands, and retail chains in Spain and the rest of Europe",
      es: "Estudio en Maharashtra (cerca de Mumbai) con auditorías presenciales en Calcuta, Kanpur, Agra y Chennai; clientes en España y el resto de Europa",
    },
  },
  {
    id: "scoping",
    label: {
      en: "Scoping and minimums",
      es: "Valoración y cantidades",
    },
    value: {
      en: "Every Manufacturing Programme is scoped individually from your Product Brief after an initial call, with no fixed public price lists or rigid minimums",
      es: "Cada Programa de producción se estudia de forma individual a partir de tu briefing de producto tras una primera llamada, sin tarifas públicas cerradas ni mínimos rígidos",
    },
  },
  {
    id: "almarise",
    label: {
      en: "Owned brand",
      es: "Marca propia",
    },
    value: {
      en: "AlmaRise D Brand, spanning AlmaRise D Reborn (one-of-a-kind everyday garments cut from kept Indian sarees), AlmaRise D Organic (organic dyes and plant or fruit-waste fabrics such as sugarcane, orange, banana, and pineapple, among others), and AlmaRise D Home Decor",
      es: "AlmaRise D Brand, que abarca AlmaRise D Reborn (prendas de uso diario únicas a partir de saris indios guardados), AlmaRise D Organic (tintes orgánicos y tejidos de residuos vegetales como caña de azúcar, naranja, plátano y piña, entre otros) y decoración del hogar",
    },
  },
  {
    id: "social-initiative",
    label: {
      en: "Planned social initiative",
      es: "Iniciativa social en preparación",
    },
    value: {
      en: "Women's Training Initiative in India (in preparation under a planned Section 8 foundation; applications are not yet open)",
      es: "Iniciativa de formación para mujeres en la India (en preparación bajo una futura fundación Section 8; inscripciones aún no abiertas)",
    },
  },
];

export const ABOUT_FAQS: readonly AboutFaqItem[] = [
  {
    id: "registered-company",
    question: {
      en: "Who founded KarmaRise D Global, and is it a registered company in India?",
      es: "¿Quién fundó KarmaRise D Global y es una empresa registrada en la India?",
    },
    answer: {
      en: "KarmaRise D Global was co-founded by Alma, a Spanish business owner working between Spain and India, and Shirish, a registered Bar Council advocate in India. The business is legally operated by Karmarise Global LLP, incorporated in India on 15 May 2025 under LLPIN ACO-3878 and GSTIN 27ABDFK8128R1ZL. Full statutory registration details appear on our Legal notice page.",
      es: "KarmaRise D Global nació de la mano de Alma, empresaria española que trabaja entre España y la India, y Shirish, abogado colegiado en el Bar Council de la India. La actividad opera legalmente mediante Karmarise Global LLP, constituida el 15 de mayo de 2025 con LLPIN ACO-3878 y GSTIN 27ABDFK8128R1ZL. Todos los datos registrales constan en nuestro Aviso legal.",
    },
  },
  {
    id: "brokers-or-hands-on",
    question: {
      en: "Are Alma and Shirish remote sourcing brokers, or do they supervise production in person?",
      es: "¿Sois intermediarios a distancia o supervisáis la producción en persona?",
    },
    answer: {
      en: "We work directly on the ground in India rather than acting as distant email brokers. Together we travel across specialist hubs such as Kolkata, Kanpur, Agra, and Chennai to audit family-run factories, leather ateliers, garment makers, and women artisan collectives in person. We talk directly with the people sewing your pieces, inspect hides and fabrics by hand, review prototypes before sending physical samples for your approval, and supervise production and export packing on site.",
      es: "Trabajamos directamente sobre el terreno. Nunca actuamos como intermediarios lejanos por correo. Recorremos juntos centros especialistas como Calcuta, Kanpur, Agra y Chennai para auditar fábricas de corte familiar, marroquineros, confeccionistas y colectivos de artesanas. Hablamos cara a cara con quienes cosen cada artículo, palpamos pieles y tejidos a mano, preparamos muestras para valoración antes de que las apruebes y seguimos tu pedido en planta hasta la exportación.",
    },
  },
  {
    id: "communication-and-languages",
    question: {
      en: "Who do we speak with during a project, and in what languages?",
      es: "¿Con quién hablo durante el proyecto y en qué idiomas?",
    },
    answer: {
      en: "Alma is your direct point of contact from the first video call through doorstep delivery. You can speak with her in Spanish, English, or Portuguese, and she emails written meeting conclusions straight after every call so every agreement stays clear. On the ground in India, Shirish coordinates with Manufacturing Partners in English, Marathi, and Hindi and joins technical or production calls whenever helpful.",
      es: "Alma es tu contacto directo desde la primera videollamada hasta la entrega en la puerta de tu negocio. Puedes hablar con ella en español, inglés o portugués. Nada más colgar, te manda por correo las conclusiones de la reunión para que cada decisión quede clara. En la India, Shirish coordina con las unidades de producción en inglés, maratí e hindi y entra en las llamadas técnicas siempre que convenga.",
    },
  },
  {
    id: "contracts-and-ip",
    question: {
      en: "How do KarmaRise D Global and Shirish protect our designs and supplier commitments?",
      es: "¿Cómo protegéis mis diseños y los compromisos con las unidades de producción?",
    },
    answer: {
      en: "Your sketches, Product Brief, patterns, and specifications stay confidential, and mutual NDA and NNN agreements are available before you share sensitive details. Shirish puts partner obligations, material tolerances, and delivery schedules into binding contracts under Indian law before any production unit buys hides or cloth. We also prepare a physical colour swatch for your approval, and cutting never starts until you hold and sign off the physical sample.",
      es: "Tus bocetos, tu briefing de producto, los patrones y las especificaciones se tratan con estricta confidencialidad, con acuerdos mutuos NDA y NNN disponibles antes de compartir detalles sensibles. Shirish recoge los compromisos de cada instalación, las tolerancias de materiales y los plazos en contratos vinculantes bajo ley india antes de comprar piel o tejido. Antes de teñir, preparamos una muestra física de color para tu visto bueno. Nunca comenzamos con el corte de las piezas sin una muestra física previamente revisada y aprobada por ti.",
    },
  },
  {
    id: "almarise-connection",
    question: {
      en: "How does AlmaRise D Brand connect to your B2B Manufacturing Programmes?",
      es: "¿Qué relación tiene AlmaRise D Brand con vuestros Programas de producción B2B?",
    },
    answer: {
      en: "AlmaRise D Brand is our own fashion and lifestyle label, covering AlmaRise D Reborn (one-of-a-kind everyday garments cut from kept Indian sarees), AlmaRise D Organic (organic dyes and plant or fruit-waste fabrics such as sugarcane, orange, banana, and pineapple, among others), and AlmaRise D Home Decor. Developing, cutting, and finishing our own pieces in India gives us first-hand production knowledge that directly sharpens how we advise B2B Clients across leather goods, clothing, custom sewn accessories, and home decor.",
      es: "AlmaRise D Brand es nuestra marca propia de moda y estilo de vida. Reúne AlmaRise D Reborn (prendas de uso diario únicas a partir de saris indios guardados), AlmaRise D Organic (tintes orgánicos y tejidos de residuos vegetales como caña de azúcar, naranja, plátano y piña, entre otros) y decoración del hogar. Diseñar, cortar y rematar nuestras propias colecciones en la India nos aporta criterio práctico de confección que afina nuestro asesoramiento con cada cliente B2B en marroquinería, ropa, complementos y decoración del hogar.",
    },
  },
  {
    id: "womens-training-status",
    question: {
      en: "Is the Women's Training Initiative an NGO or open for applications right now?",
      es: "¿Es la Iniciativa de formación para mujeres una ONG o tiene plazas abiertas ahora mismo?",
    },
    answer: {
      en: "No. The Women's Training Initiative is a planned garment design and stitching training programme in India currently in preparation alongside a future Section 8 foundation, with dignified paid work as its long-term aim. It is neither a charity nor an NGO, and applications are not yet open. We post candid progress updates on its dedicated page.",
      es: "No. La Iniciativa de formación para mujeres es un programa planificado en la India para formar en diseño de prendas y confección, en preparación junto a una futura fundación Section 8, con el empleo digno y remunerado como horizonte. No es una ONG ni caridad. Las inscripciones siguen cerradas y publicamos avances reales en su página dedicada.",
    },
  },
];
