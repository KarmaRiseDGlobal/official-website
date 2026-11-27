import type { ClosingConversationCopy } from "@/components/home/closing-conversation-section";
import type { SiteLanguage } from "@/lib/urls";

export interface HowWeWorkHeroFact {
  readonly id: string;
  readonly label: Record<SiteLanguage, string>;
  readonly detail: Record<SiteLanguage, string>;
}

export interface FounderOperationalRole {
  readonly id: string;
  readonly nameAndRegion: Record<SiteLanguage, string>;
  readonly roleSummary: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imagePosition: string;
  readonly imageAlt: Record<SiteLanguage, string>;
}

export interface PracticeDecision {
  readonly id: string;
  readonly title: Record<SiteLanguage, string>;
  readonly practice: Record<SiteLanguage, string>;
  readonly proofLabel: Record<SiteLanguage, string>;
  readonly proofNote: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imagePosition: string;
  readonly imageAlt: Record<SiteLanguage, string>;
  readonly storyHref?: string;
  readonly storyLabel?: Record<SiteLanguage, string>;
}

export interface ResponsibilityRow {
  readonly id: string;
  readonly stepNumber: string;
  readonly stage: Record<SiteLanguage, string>;
  readonly client: Record<SiteLanguage, string>;
  readonly alma: Record<SiteLanguage, string>;
  readonly shirish: Record<SiteLanguage, string>;
  readonly workshop: Record<SiteLanguage, string>;
}

export interface VisibilityHabit {
  readonly id: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
}

export interface HowWeWorkStep {
  readonly id: string;
  readonly name: Record<SiteLanguage, string>;
  readonly text: Record<SiteLanguage, string>;
  readonly anchor: string;
}

export interface HowWeWorkFaqItem {
  readonly id: string;
  readonly question: Record<SiteLanguage, string>;
  readonly answer: Record<SiteLanguage, string>;
}

export const HOW_WE_WORK_LAST_REVIEWED = {
  iso: "2026-11-27",
  en: "27 November 2026",
  es: "27 de noviembre de 2026",
} as const;

export const HOW_WE_WORK_HERO_FACTS: readonly HowWeWorkHeroFact[] = [
  {
    id: "time-zone-overlap",
    label: {
      en: "3.5 to 4.5 hours of daily overlap",
      es: "De 3,5 a 4,5 horas de coincidencia diaria",
    },
    detail: {
      en: "Spain and the rest of Central Europe share every weekday morning with India, so calls and questions move the same day.",
      es: "España y el resto de Europa central comparten cada mañana laborable con la India, para resolver dudas el mismo día.",
    },
  },
  {
    id: "swatch-and-sample-gate",
    label: {
      en: "Replies in 1–2 business days",
      es: "Respuesta en 1–2 días laborables",
    },
    detail: {
      en: "Alma reads every note personally and sends clear meeting notes in writing straight after each call.",
      es: "Alma lee cada mensaje en persona y envía por escrito las conclusiones de la reunión tras cada llamada.",
    },
  },
  {
    id: "contracts-and-nda",
    label: {
      en: "Zero cutting without your sample",
      es: "Nada se corta sin tu muestra",
    },
    detail: {
      en: "You hold and sign off the physical sample in Europe before production materials are cut.",
      es: "Tienes y apruebas la muestra física en tus manos en Europa antes de empezar a cortar.",
    },
  },
];

export const HOW_WE_WORK_FOUNDER_ROLES: readonly FounderOperationalRole[] = [
  {
    id: "alma",
    nameAndRegion: {
      en: "Alma · Spain, the rest of Europe & India",
      es: "Alma · España, el resto de Europa y la India",
    },
    roleSummary: {
      en: "Alma has run her own businesses in Spain and knows what it takes to put own-brand pieces in front of real shoppers. She leads your calls, sends clear meeting notes right after, and reviews comfort, fit, and prototypes in India alongside our own label AlmaRise D Brand.",
      es: "Alma ha dirigido sus propios negocios en España y sabe lo que exige subir el cierre cada mañana. Lleva tus videollamadas, envía por escrito las conclusiones de la reunión al colgar y revisa la comodidad, el ajuste y cada prototipo en la India junto a nuestra marca AlmaRise D Brand.",
    },
    image: "/images/almarise/reviewing-saree-garment-sketches-india.jpeg",
    imagePosition: "50% 25%",
    imageAlt: {
      en: "Alma and a garment designer in India reviewing product sketches and fabric swatches together at a studio table",
      es: "Alma y una diseñadora en la India revisando juntas bocetos y muestras de tejidos sobre una mesa de trabajo",
    },
  },
  {
    id: "shirish",
    nameAndRegion: {
      en: "Shirish · Across India",
      es: "Shirish · En toda la India",
    },
    roleSummary: {
      en: "Shirish is a registered Bar Council advocate in India leading partner visits and production from Maharashtra. He vets family-run factories, leather ateliers, and women artisan collectives in person, puts commitments into written Indian contracts, and oversees export dispatch.",
      es: "Shirish es abogado colegiado en el Bar Council de la India y dirige las visitas y la producción desde Maharashtra. Audita en persona fábricas familiares, marroquineros y colectivos de artesanas, redacta contratos bajo ley india y supervisa la salida de cada envío.",
    },
    image: "/images/workshops/shirish-tan-black-leather-bags-inspection.jpeg",
    imagePosition: "50% 24%",
    imageAlt: {
      en: "Shirish inspecting a finished tan leather bag alongside black production bags and artisans at a production unit in India",
      es: "Shirish revisando un bolso de piel tono tostado junto a piezas de producción negras y artesanos en una unidad de producción en la India",
    },
  },
];

export const HOW_WE_WORK_DECISIONS: readonly PracticeDecision[] = [
  {
    id: "correction-from-europe",
    title: {
      en: "Adjusting a strap, pocket, fabric, or cut from Europe",
      es: "Ajustar un asa, un bolsillo, un tejido o el corte desde Europa",
    },
    practice: {
      en: "Show Alma what feels off on a quick video call. She updates your written brief for confirmation, then sits with the pattern maker in India to dial in the next sample.",
      es: "Enseña a Alma qué no encaja en una videollamada rápida. Actualiza tu briefing para confirmarlo contigo y se sienta con el patronista en la India para ajustar la siguiente muestra.",
    },
    proofLabel: {
      en: "Real example",
      es: "Ejemplo real",
    },
    proofNote: {
      en: "Two physical leather rounds turned a four-line sketch into a balanced backpack silhouette.",
      es: "Dos rondas físicas en piel transformaron un boceto de cuatro líneas en una mochila equilibrada.",
    },
    image: "/images/almarise/alma-kalyan-fashion-studio-briefing.jpeg",
    imagePosition: "50% 25%",
    imageAlt: {
      en: "Alma seated at a studio table reviewing project folders and garment specifications in India",
      es: "Alma sentada a una mesa de estudio revisando carpetas de proyecto y especificaciones de prendas en la India",
    },
    storyHref: "/stories/from-spain-to-a-cutting-table-in-india",
    storyLabel: {
      en: "Read how a first call reaches production in India",
      es: "Cómo una primera llamada llega a producción en la India",
    },
  },
  {
    id: "colour-to-match",
    title: {
      en: "Hitting an exact colour shade and material feel",
      es: "Clavar el color exacto y la textura del material",
    },
    practice: {
      en: "Phone screens distort vegetable-tanned leather and natural linen. Before ordering hides or cloth, we prepare a real colour swatch for you to approve in daylight.",
      es: "Las pantallas distorsionan la piel de curtido vegetal y el lino natural. Antes de encargar pieles o tela, preparamos una muestra física de color para aprobarlo a luz natural.",
    },
    proofLabel: {
      en: "Real example",
      es: "Ejemplo real",
    },
    proofNote: {
      en: "We split tanning in Kolkata, leatherwork in Uttar Pradesh, and oversight in Maharashtra to hit a boutique's soft hide feel.",
      es: "Repartimos curtido en Calcuta, marroquinería en Uttar Pradesh y control en Maharashtra para clavar una piel muy suave.",
    },
    image: "/images/workshops/alma-dark-leather-swatch-binder-review.jpeg",
    imagePosition: "50% 34%",
    imageAlt: {
      en: "Alma examining a dark leather hide swatch beside an open colour-swatch binder with a leather production partner in India",
      es: "Alma examinando una muestra de piel oscura junto a un muestrario abierto de colores con un fabricante de piel en la India",
    },
    storyHref: "/stories/matching-a-workshop-to-the-product",
    storyLabel: {
      en: "Read how we match specialist makers across India",
      es: "Cómo elegimos a cada especialista en la India",
    },
  },
  {
    id: "sample-and-seam-check",
    title: {
      en: "Catching a rough first prototype before it ships",
      es: "Corregir un primer prototipo antes de enviarlo",
    },
    practice: {
      en: "We inspect every prototype ourselves in India and rework weak seams, proportions, or hardware before shipping a clean sample to your door.",
      es: "Revisamos primero cada prototipo en la India y corregimos costuras, proporciones o herrajes antes de enviarte una muestra limpia a tu puerta.",
    },
    proofLabel: {
      en: "Hard rule",
      es: "Regla fija",
    },
    proofNote: {
      en: "Nothing is cut for production until you approve the physical sample in hand.",
      es: "Nada se corta para producción sin tu muestra física aprobada en mano.",
    },
    image: "/images/workshops/shirish-master-cutter-seam-inspection.jpeg",
    imagePosition: "50% 34%",
    imageAlt: {
      en: "Shirish checking cut leather panels and seam allowances with a master cutter in India",
      es: "Shirish comprobando piezas de piel cortadas y márgenes de costura junto a un maestro cortador en la India",
    },
    storyHref: "/stories/why-sample-approval-decides-bulk",
    storyLabel: {
      en: "Read why physical samples decide production quality",
      es: "Por qué aprobar la muestra física decide la calidad",
    },
  },
  {
    id: "launch-date",
    title: {
      en: "Hitting a seasonal shop-window date without freight shocks",
      es: "Cumplir la fecha de escaparate sin sustos de flete",
    },
    practice: {
      en: "We plan quantities, sewn-in EU labels, protective packing, and customs paperwork upfront, then follow your shipment straight to your shop door.",
      es: "Planificamos desde el inicio cantidades, etiquetas europeas cosidas, embalaje protector y aduanas, y seguimos tu envío hasta la puerta de tu negocio.",
    },
    proofLabel: {
      en: "Real example",
      es: "Ejemplo real",
    },
    proofNote: {
      en: "Eleven numbered cartons arrived at a Spanish boutique door ready for the main window that same day.",
      es: "Once cajas numeradas llegaron a la puerta de una boutique española listas para el escaparate ese mismo día.",
    },
    image: "/images/workshops/leather-bags-export-cartons.jpeg",
    imagePosition: "50% 50%",
    imageAlt: {
      en: "Eleven numbered and stretch-wrapped cardboard export cartons stacked for dispatch in India",
      es: "Once cajas de exportación de cartón numeradas y retractiladas apiladas para su envío desde la India",
    },
  },
];

export const HOW_WE_WORK_RESPONSIBILITY_ROWS: readonly ResponsibilityRow[] = [
  {
    id: "discovery-brief",
    stepNumber: "01",
    stage: {
      en: "Brief & call",
      es: "Briefing y llamada",
    },
    client: {
      en: "Share a sketch, photo, or shop piece",
      es: "Compartes un boceto, foto o pieza de tu tienda",
    },
    alma: {
      en: "Leads call, advises on daily wear, sends written notes and NDA",
      es: "Lleva la llamada, aconseja sobre uso diario, envía notas y NDA",
    },
    shirish: {
      en: "Checks regional craft hubs and realistic lead times",
      es: "Valora polos artesanos y plazos realistas",
    },
    workshop: {
      en: "Confirms technical feasibility",
      es: "Confirma viabilidad técnica",
    },
  },
  {
    id: "workshop-vetting",
    stepNumber: "02",
    stage: {
      en: "Vetting & proposal",
      es: "Visitas y propuesta",
    },
    client: {
      en: "Review your custom proposal",
      es: "Revisas tu propuesta a medida",
    },
    alma: {
      en: "Visits family-run factories and artisan collectives in person",
      es: "Visita fábricas familiares y colectivos de artesanas",
    },
    shirish: {
      en: "Audits machinery, open doors, and fair working conditions",
      es: "Verifica maquinaria, puertas abiertas y condiciones justas",
    },
    workshop: {
      en: "Opens lines for technical trials",
      es: "Abre sus líneas para pruebas técnicas",
    },
  },
  {
    id: "colour-and-sampling",
    stepNumber: "03",
    stage: {
      en: "Swatch & samples",
      es: "Color y muestras",
    },
    client: {
      en: "Approve physical colour swatch and sample in hand",
      es: "Apruebas la muestra de color y el prototipo en mano",
    },
    alma: {
      en: "Reviews every prototype first and flags refinements openly",
      es: "Revisa primero cada prototipo y señala ajustes con claridad",
    },
    shirish: {
      en: "Oversees dye swatches, hides, fabrics, and hardware checks",
      es: "Supervisa pruebas de color, pieles, tejidos y herrajes",
    },
    workshop: {
      en: "Prepares dye swatches and refines prototypes",
      es: "Prepara pruebas de color y ajusta prototipos",
    },
  },
  {
    id: "contracts-signoff",
    stepNumber: "04",
    stage: {
      en: "Pre-production sign-off",
      es: "Cierre previo",
    },
    client: {
      en: "Give final sign-off on the sample before cutting",
      es: "Das el visto bueno final antes de cortar",
    },
    alma: {
      en: "Locks EU labels, presentation details, and seasonal dates",
      es: "Cierra etiquetas europeas, presentación y fechas",
    },
    shirish: {
      en: "Drafts written Indian supplier contracts and NDA/NNN terms",
      es: "Redacta contratos bajo ley india y acuerdos NDA/NNN",
    },
    workshop: {
      en: "Reserves approved leather, fabric, and hardware stock",
      es: "Reserva piel, tejido y herrajes aprobados",
    },
  },
  {
    id: "floor-supervision",
    stepNumber: "05",
    stage: {
      en: "Production checks",
      es: "Supervisión en producción",
    },
    client: {
      en: "Join live video calls with the makers whenever you wish",
      es: "Entras en videollamadas en directo cuando te apetece",
    },
    alma: {
      en: "Shares progress clips and introduces you to the makers live",
      es: "Comparte vídeos de avance y te presenta al equipo en directo",
    },
    shirish: {
      en: "Checks dye lots, cutting, stitching, and finishing in person",
      es: "Inspecciona tintadas, corte, costura y acabados en persona",
    },
    workshop: {
      en: "Produces the run matched to your counter-sample",
      es: "Confecciona el pedido fiel a tu contramuestra",
    },
  },
  {
    id: "export-delivery",
    stepNumber: "06",
    stage: {
      en: "Export & delivery",
      es: "Envío y entrega",
    },
    client: {
      en: "Unpack boxes at your door, ready for the shop window",
      es: "Recibes las cajas en tu puerta, listas para exponer",
    },
    alma: {
      en: "Tracks delivery to arrival and notes tweaks for next season",
      es: "Sigue el pedido hasta la llegada y anota mejoras futuras",
    },
    shirish: {
      en: "Verifies final pieces, EU labels, packing, and customs",
      es: "Comprueba piezas finales, etiquetas europeas, bultos y aduanas",
    },
    workshop: {
      en: "Packs numbered, stretch-wrapped cartons",
      es: "Embala en cajas numeradas y retractiladas",
    },
  },
];

export const HOW_WE_WORK_VISIBILITY_HABITS: readonly VisibilityHabit[] = [
  {
    id: "live-workshop-calls",
    title: {
      en: "Live video calls with the makers",
      es: "Videollamadas en directo con quienes confeccionan tus piezas",
    },
    body: {
      en: "Catch up with Alma on Google Meet whenever you want a check-in, and join live video calls from India to meet the leatherworkers, garment makers, or women artisan collectives crafting your collection.",
      es: "Conecta con Alma por Google Meet cuando quieras repasar avances, y entra por videollamada en directo para saludar a los marroquineros, confeccionistas o colectivos de artesanas que dan forma a tu colección.",
    },
  },
  {
    id: "milestone-media",
    title: {
      en: "Photos and short clips at every milestone",
      es: "Fotos y vídeos cortos en cada hito",
    },
    body: {
      en: "See your hides or fabrics arrive, watch the first pieces come off the stitching line, and confirm sewn-in EU labels before anything goes into cartons.",
      es: "Ves llegar tus pieles o tejidos, compruebas las primeras piezas que salen de costura y verificas el etiquetado europeo antes de embalar nada.",
    },
  },
  {
    id: "final-carton-check",
    title: {
      en: "Final counter-sample and packing check",
      es: "Control final frente a tu contramuestra",
    },
    body: {
      en: "We inspect finished pieces against your approved counter-sample, check protective packaging and hangtags, and photograph your numbered cartons before they leave India.",
      es: "Revisamos las piezas terminadas frente a tu contramuestra aprobada, comprobamos el embalaje protector y las etiquetas, y fotografiamos las cajas numeradas antes de su salida.",
    },
  },
];

export const HOW_WE_WORK_STEPS: readonly HowWeWorkStep[] = [
  {
    id: "align-in-your-language",
    anchor: "#founders-roles",
    name: {
      en: "Share your product idea or chat with Alma for 15 minutes",
      es: "Comparte tu idea o charla 15 minutos con Alma",
    },
    text: {
      en: "Send your brief or book a free 15-minute video call with Alma. Mutual NDA is available, Alma replies within 1–2 business days, and she emails clear meeting notes right after every call.",
      es: "Envía tu briefing o reserva una videollamada gratuita de 15 minutos con Alma. Hay acuerdo NDA disponible, Alma responde en 1–2 días laborables y envía por escrito las conclusiones de la reunión tras cada llamada.",
    },
  },
  {
    id: "lock-physical-swatch",
    anchor: "#decisions-in-practice",
    name: {
      en: "Approve a physical colour swatch created for your dye batch",
      es: "Aprueba una muestra física de color creada para tu tintada",
    },
    text: {
      en: "Before ordering hides or cloth for production, we prepare a physical colour swatch with our Indian makers so you can hold and approve the shade in daylight.",
      es: "Antes de encargar pieles o telas para la fabricación, preparamos una muestra física de color con nuestros fabricantes en la India para que apruebes tono y textura a luz natural.",
    },
  },
  {
    id: "pre-screen-and-approve-sample",
    anchor: "#decisions-in-practice",
    name: {
      en: "Review prototypes in India first and approve your sample in hand",
      es: "Revisamos los prototipos en la India y apruebas tu muestra en mano",
    },
    text: {
      en: "Alma and Shirish inspect every prototype in India first, rework drafts that miss your brief, and start cutting only after you approve the physical sample in Europe.",
      es: "Alma y Shirish comprueban primero cada prototipo en la India, corrigen lo que no encaje con tu briefing y empiezan a cortar solo tras aprobar la muestra física en Europa.",
    },
  },
  {
    id: "sign-indian-supplier-contract",
    anchor: "#responsibility-matrix",
    name: {
      en: "Put specs and dates into written Indian supplier contracts",
      es: "Cerramos especificaciones y fechas en contratos bajo ley india",
    },
    text: {
      en: "Co-founder Shirish, a registered Bar Council advocate in India, puts specs, quality tolerances, and delivery dates into written Indian supplier contracts alongside mutual NDA and NNN terms.",
      es: "Shirish, abogado colegiado en el Bar Council de la India, recoge especificaciones, tolerancias de calidad y fechas en contratos bajo ley india junto a acuerdos NDA y NNN.",
    },
  },
  {
    id: "verify-export-and-deliver",
    anchor: "#client-visibility",
    name: {
      en: "Follow production milestones, EU labelling, and delivery to your door",
      es: "Seguimos cada hito, el etiquetado europeo y la entrega en tu puerta",
    },
    text: {
      en: "Receive milestone photos, short clips, and live video calls with the makers as finished pieces are checked against your counter-sample, packed with EU labels, and delivered to your business door.",
      es: "Recibes fotos, vídeos cortos y videollamadas en directo con los artesanos mientras cada pieza se revisa frente a tu contramuestra, se etiqueta según normativa europea y llega a tu negocio.",
    },
  },
];

export const HOW_WE_WORK_FAQS: readonly HowWeWorkFaqItem[] = [
  {
    id: "time-zones-and-communication",
    question: {
      en: "How do time zones and call languages work?",
      es: "¿Cómo funcionan los husos horarios y los idiomas?",
    },
    answer: {
      en: "Spain and the rest of Central Europe overlap with India for 3.5 hours in summer (CEST) and 4.5 hours in winter (CET), leaving a shared weekday morning. You talk with Alma in Spanish, English, or Portuguese; she replies within 1–2 business days and sends clear meeting notes right after every call.",
      es: "España y el resto de Europa central coinciden con la India 3,5 horas en verano (CEST) y 4,5 horas en invierno (CET), dejando una mañana laborable en común. Hablas con Alma en español, inglés o portugués; responde en 1–2 días laborables y envía por escrito las conclusiones de la reunión tras cada llamada.",
    },
  },
  {
    id: "mid-sampling-changes",
    question: {
      en: "What if I want to adjust a strap, pocket, fabric, or cut mid-sample?",
      es: "¿Qué ocurre si quiero ajustar un asa, un tejido o una medida durante el muestreo?",
    },
    answer: {
      en: "Show Alma on a quick video call. She updates your written brief for your confirmation, then sits with the pattern maker in India over the physical piece so the change lands cleanly in the next sample.",
      es: "Enseña el ajuste a Alma en una videollamada rápida. Actualiza tu briefing para que lo confirmes y repasa los cambios en persona con el patronista en la India, con la pieza delante, para que el siguiente prototipo salga clavado.",
    },
  },
  {
    id: "sample-pre-screening",
    question: {
      en: "Do you ship rough drafts to Europe, or check prototypes in India first?",
      es: "¿Enviáis prototipos sin revisar o comprobáis las muestras primero en la India?",
    },
    answer: {
      en: "We inspect every prototype in India first and rework weak seams, proportions, or hardware before shipping, saving you wasted weeks and courier fees. Even on strong samples, Alma flags tiny refinements openly before you approve.",
      es: "Revisamos primero cada prototipo en la India y corregimos costuras, proporciones o herrajes antes de enviar nada, ahorrándote semanas y portes. Incluso cuando una muestra sale bien, Alma te comenta pequeños ajustes con sinceridad antes de aprobar.",
    },
  },
  {
    id: "live-visibility-without-travelling",
    question: {
      en: "Can I see my collection being made without flying to India?",
      es: "¿Puedo seguir la fabricación sin viajar a la India?",
    },
    answer: {
      en: "Yes. We share photos and short clips as materials arrive, first pieces finish stitching, and numbered cartons are packed. Whenever a practical decision comes up or you want to greet the artisans, we bring you on a live video call.",
      es: "Sí. Enviamos fotos y vídeos cortos cuando llegan los materiales, cuando salen las primeras piezas y cuando embalamos las cajas numeradas. Si surge una decisión práctica o te apetece saludar a los artesanos, conectamos por videollamada en directo.",
    },
  },
];

export const HOW_WE_WORK_CLOSING_CONVERSATION: ClosingConversationCopy = {
  heading: {
    en: "Tell us what you have in mind. We will tell you plainly what it takes in India.",
    es: "Cuéntanos qué tienes en mente. Te diremos con claridad qué hace falta en la India.",
  },
  confidentialityNote: {
    en: "No tech pack needed. Mutual NDA available, and only Alma and Shirish read your notes.",
    es: "Sin ficha técnica previa. Acuerdo NDA disponible y solo Alma y Shirish leen tus notas.",
  },
  advanceCue: {
    en: "Choose how to start",
    es: "Elige cómo empezar",
  },
  optionsAriaLabel: {
    en: "Three ways to start working with KarmaRise D Global",
    es: "Tres formas de empezar a trabajar con KarmaRise D Global",
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
        en: "Ask about timelines, samples, or Indian craft hubs and hear straight back from Alma.",
        es: "Consulta plazos, muestras o polos artesanos en la India y te responde directamente Alma.",
      },
      external: true,
    },
    {
      id: "book-call",
      tier: "arch-2",
      primary: true,
      eyebrow: {
        en: "Talk it through face to face",
        es: "Prefieres hablarlo cara a cara",
      },
      title: {
        en: "Book a free call with Alma",
        es: "Reserva una llamada gratis con Alma",
      },
      detail: {
        en: "Free 15-minute video call. Bring a rough sketch or shop item, and Alma sends clear meeting notes right after.",
        es: "Videollamada gratuita de 15 minutos. Trae un boceto o una pieza de tu tienda y Alma te envía por escrito las conclusiones de la reunión al colgar.",
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
        en: "Three quick steps from a sketch or reference piece. Zero obligation.",
        es: "Tres pasos breves desde un boceto o pieza de referencia. Sin compromiso.",
      },
    },
  ],
};
