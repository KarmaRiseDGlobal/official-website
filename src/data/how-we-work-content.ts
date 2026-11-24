import type { SiteLanguage } from "@/lib/urls";

export interface HowWeWorkHeroFact {
  readonly number: string;
  readonly label: Record<SiteLanguage, string>;
  readonly detail: Record<SiteLanguage, string>;
}

export interface FounderOperationalRole {
  readonly id: string;
  readonly nameAndRegion: Record<SiteLanguage, string>;
  readonly roleSummary: Record<SiteLanguage, string>;
  readonly standingLabel: Record<SiteLanguage, string>;
  readonly standingValue: Record<SiteLanguage, string>;
  readonly focusLabel: Record<SiteLanguage, string>;
  readonly focusValue: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imageAlt: Record<SiteLanguage, string>;
}

export interface PracticeDecision {
  readonly id: string;
  readonly number: string;
  readonly title: Record<SiteLanguage, string>;
  readonly practice: Record<SiteLanguage, string>;
  readonly proofLabel: Record<SiteLanguage, string>;
  readonly proofNote: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imageAlt: Record<SiteLanguage, string>;
  readonly storyHref?: string;
  readonly storyLabel?: Record<SiteLanguage, string>;
}

export interface ResponsibilityRow {
  readonly id: string;
  readonly stage: Record<SiteLanguage, string>;
  readonly client: Record<SiteLanguage, string>;
  readonly alma: Record<SiteLanguage, string>;
  readonly shirish: Record<SiteLanguage, string>;
  readonly workshop: Record<SiteLanguage, string>;
}

export interface VisibilityHabit {
  readonly id: string;
  readonly number: string;
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
  iso: "2026-11-24",
  en: "24 November 2026",
  es: "24 de noviembre de 2026",
} as const;

export const HOW_WE_WORK_HERO_FACTS: readonly HowWeWorkHeroFact[] = [
  {
    number: "01",
    label: {
      en: "3.5 to 4.5 hours of daily overlap",
      es: "De 3,5 a 4,5 horas de coincidencia diaria",
    },
    detail: {
      en: "Spain and the rest of Central Europe share every working morning and early afternoon with India. Right after each call, Alma emails clear meeting conclusions so every decision stays in writing.",
      es: "España y el resto de Europa central comparten cada mañana y primera hora de la tarde con la India, de lunes a viernes. Nada más colgar con Alma recibes por escrito las conclusiones de la reunión. Todo queda claro.",
    },
  },
  {
    number: "02",
    label: {
      en: "Physical swatch and sample before cutting starts",
      es: "Muestra física de color y prototipo antes de cortar",
    },
    detail: {
      en: "We tell you what each dye batch requires, create a physical colour swatch for your approval, and review every prototype in India first. Cutting starts only after you hold and approve the physical sample in hand.",
      es: "Te indicamos qué requiere cada tintada, creamos una muestra física de color para tu aprobación y revisamos primero cada prototipo en la India. No comenzamos con el corte de las piezas hasta que sostienes tu muestra física en mano y das el visto bueno.",
    },
  },
  {
    number: "03",
    label: {
      en: "Written Indian supplier contracts and mutual NDA",
      es: "Contratos bajo ley india y acuerdos NDA",
    },
    detail: {
      en: "Co-founder Shirish is a registered Bar Council advocate in India who puts material specs, quality tolerances, and delivery dates into written contracts with every Manufacturing Partner, alongside mutual NDA and NNN confidentiality agreements.",
      es: "Shirish, abogado colegiado en el Bar Council de la India, cierra especificaciones, tolerancias de calidad y plazos en contratos escritos con cada punto de producción bajo ley india. Ponemos acuerdos mutuos de confidencialidad NDA y NNN a tu disposición desde el primer día.",
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
      en: "Alma has run her own companies in Spain and knows what it feels like to lift a shop shutter every morning and put a piece in front of real buyers. She leads your video calls, sends clear meeting conclusions straight after, and turns what you notice in your shop into a written Product Brief. When working on the ground in India beside Shirish, she checks every detail the way a shopper in your boutique will test it: strap drop, bag weight, smooth high-quality Japanese plastic YKK zippers, light cotton linings, comfortable garment cuts, and clean finishing across leather goods, clothing, sewn accessories, and home decor before any sample leaves for Europe. Working directly on our owned label AlmaRise D Brand (spanning AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor) keeps her hands on Indian materials and construction every week.",
      es: "Alma ha levantado sus propios negocios en España. Sabe de sobra lo que supone subir el cierre de tu tienda cada día y querer ofrecer moda a medida en vez de comprar a un mayorista lo mismo que vende la calle de al lado. Ella lleva tus videollamadas, te manda las conclusiones de la reunión al terminar y traduce lo que observas sobre el terreno en tu comercio a un briefing de producto claro. Cuando viaja a la India junto a Shirish, repasa a mano cada detalle tal como lo probará quien entre en tu escaparate: la caída del asa, el peso del bolso, cremalleras japonesas YKK de plástico de alta calidad, forros claros de algodón, cortes cómodos y buenos acabados en marroquinería, ropa de tejidos naturales, complementos confeccionados a medida y decoración del hogar. Dirigir nuestra firma propia AlmaRise D Brand, que abarca AlmaRise D Reborn, AlmaRise D Organic y decoración del hogar, la mantiene en contacto directo con tejidos, cueros y patrones cada semana.",
    },
    standingLabel: {
      en: "Where she works",
      es: "Dónde trabaja",
    },
    standingValue: {
      en: "Spain, the rest of Europe, and on the ground in India",
      es: "En España, el resto de Europa y sobre el terreno en la India",
    },
    focusLabel: {
      en: "Direct lane",
      es: "Responsabilidad directa",
    },
    focusValue: {
      en: "Client calls, written Product Briefs, retail wearability checks, sample reviews, and AlmaRise D Brand product direction",
      es: "Llamadas con clientes, briefings de producto, ergonomía de uso diario, muestras para valoración y dirección de producto en AlmaRise D Brand",
    },
    image: "/images/workshops/alma-crossbody-bag-indian-workshop.jpeg",
    imageAlt: {
      en: "Alma inspecting cognac leather hides and a finished crossbody bag at a leather production unit in India",
      es: "Alma revisando pieles color coñac y un bolso bandolera terminado en una unidad de producción de marroquinería en la India",
    },
  },
  {
    id: "shirish",
    nameAndRegion: {
      en: "Shirish · Across India",
      es: "Shirish · En toda la India",
    },
    roleSummary: {
      en: "Shirish is a registered advocate and Bar Council member in India who leads our operations and quality oversight across Indian craft regions. From Maharashtra, he travels to audit established family-run factories, leather ateliers, tanneries, garment makers, and women artisan collectives in person across hubs including Kolkata, Kanpur, Agra, and Chennai, talking directly with the artisans beside the stitching lines rather than only with owners. He walks away from any facility that keeps closed doors, structures written Indian supplier contracts and mutual NDA and NNN protections, inspects hides, fabrics, and seams on site, and sees your export cartons and customs paperwork cleanly to your business door.",
      es: "Shirish es abogado colegiado y miembro del Bar Council de la India, al frente de nuestras operaciones a pie de obra. Desde Maharashtra recorre el país para auditar en persona fábricas de corte familiar consolidadas, marroquineros, curtidurías, confeccionistas y colectivos de artesanas en polos especialistas como Calcuta, Kanpur, Agra y Chennai. Habla cara a cara con quienes cosen y cortan, nunca solo con los dueños. Si un lugar de producción mantiene las puertas cerradas o siembra dudas, damos media vuelta. Redacta contratos escritos con las unidades de producción bajo ley india, prepara acuerdos mutuos NDA y NNN, controla pieles, telas y costuras en planta y supervisa el embalaje y la documentación de aduanas hasta la puerta de tu negocio.",
    },
    standingLabel: {
      en: "Legal standing",
      es: "Respaldo legal",
    },
    standingValue: {
      en: "Registered Bar Council advocate in India",
      es: "Abogado colegiado en el Bar Council de la India",
    },
    focusLabel: {
      en: "Direct lane",
      es: "Responsabilidad directa",
    },
    focusValue: {
      en: "Partner audits across Kolkata, Kanpur, Agra, and Chennai, written Indian contracts, NDA and NNN terms, on-site checks, and export logistics",
      es: "Auditorías en Calcuta, Kanpur, Agra y Chennai, contratos bajo ley india, acuerdos NDA y NNN, controles en planta y exportación",
    },
    image: "/images/workshops/shirish-inspecting-leather-cutting-table.jpeg",
    imageAlt: {
      en: "Shirish inspecting cut leather panels with a leather artisan at a production unit in India",
      es: "Shirish revisando piezas de piel cortadas junto a un artesano marroquinero en una unidad de producción en la India",
    },
  },
];

export const HOW_WE_WORK_DECISIONS: readonly PracticeDecision[] = [
  {
    id: "correction-from-europe",
    number: "01",
    title: {
      en: "You want to adjust a strap drop, pocket, fabric, or cut from Europe",
      es: "Quieres ajustar un asa, un bolsillo, un tejido o el corte desde Europa",
    },
    practice: {
      en: "Show Alma what feels off on a quick video call. She sends updated meeting conclusions, folds the revision into your single written Product Brief, and emails it back for your nod. Alma and Shirish then take that same brief directly to the pattern maker at the production site in India.",
      es: "Le enseñas a Alma qué no termina de encajar en una videollamada rápida. Ella te manda las conclusiones de la reunión actualizadas, anota el cambio en tu mismo briefing de producto y espera tu confirmación por correo. Con ese documento cerrado en mano, Alma y Shirish se sientan directamente con el patronista en el punto de producción en la India.",
    },
    proofLabel: {
      en: "Real example",
      es: "Ejemplo real",
    },
    proofNote: {
      en: "On a leather backpack for an independent Spanish boutique, we took a four-line sketch through two leather sample rounds to turn a boxy rectangle into a tapered pyramid profile with a top grab handle, light cotton lining, antique brass hardware, and high-quality Japanese plastic YKK zippers that protect hands and winter coats.",
      es: "En una mochila de cuero para una boutique española, partimos de un boceto de cuatro líneas y en dos rondas de pruebas convertimos una caja cuadrada en un perfil piramidal equilibrado, con asa superior de agarre, forro claro de algodón, herrajes de latón envejecido y cremalleras japonesas YKK de plástico de alta calidad que no arañan las manos ni estropean los abrigos de invierno.",
    },
    image: "/images/workshops/alma-reviewing-leather-hides-workshop.jpeg",
    imageAlt: {
      en: "Alma reviewing dark brown and purple leather hides with specialists at a leather production unit in India",
      es: "Alma revisando pieles en tonos marrón oscuro y morado junto a especialistas de una unidad de producción de piel en la India",
    },
    storyHref: "/stories/from-spain-to-a-cutting-table-in-india",
    storyLabel: {
      en: "Read how a first call in Spain reaches an Indian cutting table",
      es: "Lee cómo una primera llamada en España llega a una mesa de corte india",
    },
  },
  {
    id: "colour-to-match",
    number: "02",
    title: {
      en: "A production unit needs to hit an exact colour shade and material feel",
      es: "Una unidad de producción tiene que clavar el color y la textura",
    },
    practice: {
      en: '"Tan" looks like six different colours across six phone screens, and natural linen shifts under store spotlights. Before ordering hides or cloth for production, we explain exactly what each dye batch needs and create a physical colour swatch with our Manufacturing Partners for you to hold and approve in daylight. That approved swatch stays pinned to your Product Brief on site.',
      es: "El color tostado cambia según el móvil que mires, y el lino natural reacciona distinto bajo los focos de una tienda. Antes de encargar pieles o telas para la fabricación, te indicamos exactamente qué necesitamos para cada tintada y creamos una muestra física de color junto a nuestros colaboradores para que compruebes tono y textura a luz natural. Esa referencia aprobada acompaña tu briefing durante todo el proceso.",
    },
    proofLabel: {
      en: "Real example",
      es: "Ejemplo real",
    },
    proofNote: {
      en: "When a Spanish boutique asked for silky, ultra-soft leather they described as goxo-goxo in Basque, we paid for exploratory samples first and coordinated specialist regions across India: vegetable tanning in Kolkata, leather stitching in Uttar Pradesh, and quality supervision from Maharashtra, working within the wider hub network we audit across Kolkata, Kanpur, Agra, and Chennai.",
      es: "Cuando un comercio de España nos pidió una piel sedosa y ultrasuave que en euskera llamaban goxo-goxo, pagamos primero pruebas exploratorias y repartimos el trabajo según el oficio de cada ciudad: curtido vegetal en Calcuta, confección de marroquinería en Uttar Pradesh y control de calidad desde Maharashtra, dentro de la red que auditamos también en Kanpur, Agra y Chennai.",
    },
    image: "/images/workshops/alma-cognac-leather-cutting-table.jpeg",
    imageAlt: {
      en: "Alma and three leather specialists examining cognac hides together at an Indian production site",
      es: "Alma y tres especialistas en marroquinería examinando pieles color coñac en un punto de producción en la India",
    },
    storyHref: "/stories/matching-a-workshop-to-the-product",
    storyLabel: {
      en: "Read how we match specialist makers across India",
      es: "Lee cómo elegimos a cada especialista en toda la India",
    },
  },
  {
    id: "sample-and-seam-check",
    number: "03",
    title: {
      en: "A first prototype misses the mark",
      es: "Un primer prototipo no da la talla",
    },
    practice: {
      en: "Remote sourcing agents often forward the first rough draft straight to Europe and leave you paying courier fees for crooked seams, stiff cuts, or weak hardware. We inspect every prototype in India first and rework anything that falls short at the production unit before sending a clean physical sample for your review. Even on strong samples, Alma flags tiny details she thinks we can improve before you sign off.",
      es: "Muchos agentes a distancia reenvían el primer borrador tal cual a Europa y te hacen perder semanas y mensajería con costuras torcidas, un corte incómodo o herrajes flojos. Nosotros revisamos primero cada prototipo en la India y corregimos en la unidad de producción todo lo que no encaje con tu briefing antes de enviarte una muestra para valoración. Incluso cuando el resultado convence, Alma te comenta cualquier pequeño retoque que merezca la pena pulir antes de aprobarlo.",
    },
    proofLabel: {
      en: "Hard rule",
      es: "Regla inamovible",
    },
    proofNote: {
      en: "Cutting never starts until you hold the reviewed physical sample in your hands and approve it.",
      es: "No comenzamos con el corte de las piezas ni procedemos a la producción hasta que tienes en tus manos la muestra física previamente revisada y aprobada por ti.",
    },
    image: "/images/workshops/shirish-master-cutter-seam-inspection.jpeg",
    imageAlt: {
      en: "Shirish checking cut leather panels and seam allowances with a master cutter at a production unit in India",
      es: "Shirish comprobando piezas de piel cortadas y márgenes de costura junto a un maestro cortador en una unidad de producción en la India",
    },
    storyHref: "/stories/why-sample-approval-decides-bulk",
    storyLabel: {
      en: "Read why physical sample approval decides production quality",
      es: "Por qué aprobar la muestra física decide la calidad del pedido",
    },
  },
  {
    id: "launch-date",
    number: "04",
    title: {
      en: "Your Bulk Order has a seasonal shop-window date",
      es: "Tu pedido de producción tiene fecha de escaparate",
    },
    practice: {
      en: "Custom antique brass hardware, multi-round vegetable tanning, natural and varied fabrics, sewn accessories, and home decor pieces all carry real calendar time. We scope every Manufacturing Programme individually and plan realistic quantities, sewn-in EU labels, branded cotton dust bags, unbleached chemical-free recycled cardboard care hangtags, export cartons, and customs documents upfront so arrival day brings zero freight shocks. We follow your order right to your business door.",
      es: "Los herrajes de latón envejecido a medida, el curtido vegetal por rondas, las prendas de diversos tejidos, los complementos confeccionados a medida y la decoración del hogar tienen su calendario real. Estudiamos cada Programa de producción de forma individual y dejamos previstos desde el principio las cantidades viables, el etiquetado europeo cosido, las bolsas guardapolvo de algodón con tu marca, las etiquetas de cartón reciclado sin blanquear, libre de químicos, las cajas de exportación y la documentación de aduanas. Seguimos tu pedido hasta la puerta de tu negocio, sin sustos de última hora con el flete.",
    },
    proofLabel: {
      en: "Real example",
      es: "Ejemplo real",
    },
    proofNote: {
      en: 'After spending 10 to 15 days hunting unbleached chemical-free recycled cardboard for Spanish care hangtags and checking 11 numbered, stretch-wrapped export cartons in person, our Client sent a doorstep photo the minute the pallet arrived: "We got it! They\'re here!" All eight bags in black and tan went straight into the main downtown shop window that afternoon.',
      es: "Tras dedicar entre 10 y 15 días a encontrar cartón reciclado sin blanquear, libre de químicos, para las etiquetas de cuidado en español y comprobar en persona 11 cajas de exportación numeradas y retractiladas, nuestro cliente nos mandó una foto desde la puerta de su tienda nada más bajar el palé: «¡Nos han llegado! ¡Ya están aquí!». Esa misma tarde pudo colocar directamente en el escaparate principal del centro los ocho bolsos en negro y tostado.",
    },
    image: "/images/workshops/export-pallet-delivery-spain.jpeg",
    imageAlt: {
      en: "Stretch-wrapped pallet of numbered export cartons delivered directly outside a retail shop in Spain",
      es: "Palé retractilado con cajas de exportación numeradas entregado directamente en la puerta de una tienda en España",
    },
  },
];

export const HOW_WE_WORK_RESPONSIBILITY_ROWS: readonly ResponsibilityRow[] = [
  {
    id: "discovery-brief",
    stage: {
      en: "01 · Brief & call",
      es: "01 · Briefing y llamada",
    },
    client: {
      en: "Share a sketch, shop piece, or 1-min brief across leather goods, clothing, sewn accessories, or home decor",
      es: "Compartes un boceto, una pieza o un briefing de 1 min (piel, ropa, complementos o decoración del hogar)",
    },
    alma: {
      en: "Leads video call, advises on wearability, emails meeting conclusions, arranges mutual NDA",
      es: "Lleva la videollamada, aconseja sobre uso diario, manda las conclusiones de la reunión y tramita el NDA",
    },
    shirish: {
      en: "Checks specialist hubs (Kolkata, Kanpur, Agra, Chennai) and realistic timelines",
      es: "Valora centros especialistas (Calcuta, Kanpur, Agra, Chennai) y plazos realistas",
    },
    workshop: {
      en: "Confirms technical feasibility",
      es: "Confirma la viabilidad técnica",
    },
  },
  {
    id: "workshop-vetting",
    stage: {
      en: "02 · Vetting & proposal",
      es: "02 · Auditoría y propuesta",
    },
    client: {
      en: "Review your custom proposal",
      es: "Revisas tu propuesta a medida",
    },
    alma: {
      en: "Audits family-run factories and women artisan collectives in person",
      es: "Audita en persona fábricas de corte familiar y colectivos de artesanas",
    },
    shirish: {
      en: "Verifies machinery, open doors, and zero-exploitation standards",
      es: "Comprueba maquinaria, puertas abiertas y tolerancia cero ante la explotación",
    },
    workshop: {
      en: "Opens production lines for technical tests",
      es: "Abre sus líneas para pruebas técnicas",
    },
  },
  {
    id: "colour-and-sampling",
    stage: {
      en: "03 · Swatch & samples",
      es: "03 · Color y muestras",
    },
    client: {
      en: "Approve physical colour swatch and review physical sample in hand",
      es: "Apruebas la muestra física de color y valoras la muestra física en mano",
    },
    alma: {
      en: "Guides dye requirements, reviews every sample first, flags fine tweaks openly",
      es: "Indica qué necesita la tintada, revisa cada muestra primero y señala ajustes con claridad",
    },
    shirish: {
      en: "Coordinates physical swatches with makers and inspects materials, seams, and hardware",
      es: "Coordina la muestra física de color y verifica pieles, tejidos, costuras y herrajes",
    },
    workshop: {
      en: "Prepares dye swatches and refines prototypes",
      es: "Prepara pruebas de color y ajusta prototipos",
    },
  },
  {
    id: "contracts-signoff",
    stage: {
      en: "04 · Pre-production sign-off",
      es: "04 · Cierre antes de producir",
    },
    client: {
      en: "Approve reviewed physical sample before cutting starts",
      es: "Das tu visto bueno a la muestra revisada antes de comenzar con el corte de las piezas",
    },
    alma: {
      en: "Locks EU labels, recycled cardboard hangtags, cotton dust bags, and dates",
      es: "Fija etiquetas UE, etiquetas de cartón reciclado, bolsas guardapolvo y fechas",
    },
    shirish: {
      en: "Structures written Indian supplier contracts and NDA/NNN terms",
      es: "Redacta contratos escritos con la unidad de producción bajo ley india y acuerdos NDA y NNN",
    },
    workshop: {
      en: "Reserves approved leather, fabric, and hardware stock",
      es: "Reserva la piel, el tejido y los herrajes aprobados",
    },
  },
  {
    id: "floor-supervision",
    stage: {
      en: "05 · On-site supervision",
      es: "05 · Supervisión en planta",
    },
    client: {
      en: "Join live video calls with the makers when needed",
      es: "Entras en videollamadas en directo con el equipo cuando te apetece",
    },
    alma: {
      en: "Shares progress clips from the production site and introduces makers live",
      es: "Envía vídeos desde el punto de producción y te presenta a los artesanos en directo",
    },
    shirish: {
      en: "Inspects dye lots, cutting, stitching, and finishing on site",
      es: "Inspecciona tintadas, corte, costura y acabados sobre el terreno",
    },
    workshop: {
      en: "Produces Bulk Order matched to your approved counter-sample",
      es: "Confecciona tu pedido de producción fiel a la contramuestra aprobada",
    },
  },
  {
    id: "export-delivery",
    stage: {
      en: "06 · Export & delivery",
      es: "06 · Exportación y entrega",
    },
    client: {
      en: "Receive boxes at your business door, ready for the shop window",
      es: "Recibes las cajas en la puerta de tu negocio, listas para el escaparate",
    },
    alma: {
      en: "Follows your order to arrival and captures notes for future runs",
      es: "Sigue tu pedido hasta la entrega y recoge notas para futuras tiradas",
    },
    shirish: {
      en: "Checks final pieces, sewn-in EU labels, export cartons, and customs",
      es: "Revisa piezas finales, etiquetas UE cosidas, cajas de exportación y aduanas",
    },
    workshop: {
      en: "Packs numbered, stretch-wrapped export cartons",
      es: "Embala en cajas de exportación numeradas y retractiladas",
    },
  },
];

export const HOW_WE_WORK_VISIBILITY_HABITS: readonly VisibilityHabit[] = [
  {
    id: "live-workshop-calls",
    number: "01",
    title: {
      en: "Live video calls with the makers",
      es: "Videollamadas en directo con quienes dan forma a tus piezas",
    },
    body: {
      en: "Catch up with Alma on Google Meet whenever you want a progress check, and join live video calls straight from the production site or stitching line to meet the artisans and women artisan collectives making your leather goods, clothing, custom sewn accessories, or home decor.",
      es: "Conecta con Alma por Google Meet siempre que te apetezca repasar avances. Cuando quieras, entras por videollamada en directo desde el punto de producción para saludar a los artesanos, marroquineros, confeccionistas o colectivos de artesanas que trabajan en tus bolsos, prendas, complementos o artículos de decoración del hogar.",
    },
  },
  {
    id: "milestone-media",
    number: "02",
    title: {
      en: "Milestone photos and short clips at every step",
      es: "Fotos y vídeos cortos en cada paso del pedido",
    },
    body: {
      en: "See your vegetable-tanned hides, natural and varied fabrics, or home decor materials as they arrive at the production unit. Watch the first finished pieces come off the stitching line, and check your sewn-in EU care and composition labels before packing starts.",
      es: "Ves tus pieles de curtido vegetal, tus tejidos naturales o con mezcla, o los materiales de decoración del hogar en cuanto llegan a la unidad de producción. Compruebas las primeras piezas que salen de costura y revisas el etiquetado europeo de composición y cuidado antes de embalar nada.",
    },
  },
  {
    id: "final-carton-check",
    number: "03",
    title: {
      en: "Final counter-sample and carton check before dispatch",
      es: "Control final frente a tu contramuestra antes del envío",
    },
    body: {
      en: "We inspect every finished piece against your approved counter-sample, verify custom cotton dust bags and unbleached chemical-free recycled cardboard care hangtags, and photograph your numbered, stretch-wrapped export cartons before they leave India for your business door.",
      es: "Revisamos cada pieza terminada frente a tu contramuestra aprobada. Comprobamos las bolsas guardapolvo de algodón y las etiquetas de cartón reciclado sin blanquear, libre de químicos, y fotografiamos las cajas de exportación numeradas y retractiladas antes de que salgan hacia la puerta de tu negocio.",
    },
  },
];

export const HOW_WE_WORK_NEXT_STEPS: readonly Record<SiteLanguage, string>[] = [
  {
    en: "Send a 1-minute Product Brief or book a free 15-minute video call with Alma across leather goods, clothing in natural and varied fabrics, custom sewn accessories, or home decor.",
    es: "Completa tu briefing de producto en 1 minuto o reserva una videollamada gratuita de 15 minutos con Alma para bolsos y artículos de piel, ropa, complementos confeccionados a medida o decoración del hogar.",
  },
  {
    en: "Alma usually replies within one working day and sends clear written meeting conclusions right after you talk.",
    es: "Alma suele responder en un día laborable y te envía por escrito las conclusiones de la reunión nada más hablar.",
  },
  {
    en: "Alma and Shirish check feasibility with vetted production units across India and send a custom proposal only if you want to move ahead.",
    es: "Alma y Shirish comprueban la viabilidad con unidades de producción auditadas en la India y te envían una propuesta a medida solo si decides avanzar.",
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
      en: "Send a 1-minute Product Brief or book a free 15-minute video call with Alma across leather goods, clothing in natural and varied fabrics, custom sewn accessories, or home decor. Mutual NDA confidentiality is available, Alma usually replies within one working day, and she sends clear written meeting conclusions straight after every call.",
      es: "Completa tu briefing de producto en 1 minuto o reserva una videollamada gratuita de 15 minutos con Alma para bolsos y artículos de piel, prendas de diversos tejidos, complementos confeccionados a medida o decoración del hogar. Hay acuerdo mutuo NDA disponible, Alma suele responder en un día laborable y te envía las conclusiones de la reunión por escrito nada más colgar.",
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
      en: "Before ordering hides or cloth for production, KarmaRise explains what each dye batch requires and creates a physical colour swatch with vetted Manufacturing Partners for you to hold and approve in daylight.",
      es: "Antes de encargar pieles o telas para la fabricación, te indicamos qué necesita cada tintada y preparamos una muestra física de color junto a nuestros colaboradores para que compruebes tono y textura a luz natural.",
    },
  },
  {
    id: "pre-screen-and-approve-sample",
    anchor: "#decisions-in-practice",
    name: {
      en: "Review physical samples in India first and approve your sample in hand",
      es: "Revisamos los prototipos en la India y apruebas tu muestra para valoración en mano",
    },
    text: {
      en: "Alma and Shirish inspect every prototype in India first, rework drafts that miss your Product Brief at the production unit, and begin cutting only after you hold and approve the physical sample in Europe.",
      es: "Alma y Shirish comprueban primero cada prototipo en la India, corrigen en la unidad de producción lo que no encaje con tu briefing y no comienzan con el corte de las piezas hasta que tienes en tus manos la muestra física previamente revisada y aprobada por ti.",
    },
  },
  {
    id: "sign-indian-supplier-contract",
    anchor: "#responsibility-matrix",
    name: {
      en: "Put specs and dates into written Indian supplier contracts",
      es: "Cerramos especificaciones y fechas en contratos escritos bajo ley india",
    },
    text: {
      en: "Co-founder Shirish, a registered Bar Council advocate in India, puts material specs, quality tolerances, and delivery dates into written Indian supplier contracts alongside mutual NDA and NNN protections, while auditing specialist production units across Kolkata, Kanpur, Agra, and Chennai with supervision from Maharashtra.",
      es: "El cofundador Shirish, abogado colegiado en el Bar Council de la India, recoge especificaciones, tolerancias de calidad y fechas de entrega en contratos escritos con las unidades de producción bajo ley india junto a acuerdos mutuos NDA y NNN, auditando polos como Calcuta, Kanpur, Agra y Chennai con supervisión desde Maharashtra.",
    },
  },
  {
    id: "verify-export-and-deliver",
    anchor: "#client-visibility",
    name: {
      en: "Follow site milestones, EU labelling, and export delivery to your door",
      es: "Seguimos cada fase en planta, el etiquetado europeo y la entrega en tu negocio",
    },
    text: {
      en: "Receive milestone photos, short progress clips, and live video calls with the makers as finished pieces are checked against your approved counter-sample, packed with cotton dust bags and unbleached chemical-free recycled cardboard care hangtags into numbered stretch-wrapped export cartons, and cleared to your business door.",
      es: "Recibes fotos, vídeos cortos y videollamadas en directo con los artesanos mientras cada pieza se revisa frente a tu contramuestra aprobada, se prepara con bolsas guardapolvo de algodón y etiquetas de cartón reciclado sin blanquear, libre de químicos, y sale en cajas de exportación numeradas y retractiladas hacia la puerta de tu negocio.",
    },
  },
];

export const HOW_WE_WORK_FAQS: readonly HowWeWorkFaqItem[] = [
  {
    id: "time-zones-and-communication",
    question: {
      en: "How do time zones, communication, and call languages work between Spain, the rest of Europe, and India?",
      es: "¿Cómo funcionan los husos horarios, la comunicación y los idiomas entre España, el resto de Europa y la India?",
    },
    answer: {
      en: "Spain and the rest of Central Europe overlap with India for 3.5 hours in summer (CEST) and 4.5 hours in winter (CET), leaving a shared morning and early afternoon every weekday. You talk with Alma in English, Spanish, or Portuguese on Google Meet, email, or WhatsApp. She usually replies within one working day and sends clear written meeting conclusions straight after every call.",
      es: "España y el resto de Europa central coinciden con la India durante 3,5 horas en horario de verano (CEST) y 4,5 horas en invierno (CET), lo que nos deja una franja común cada mañana y primera hora de la tarde de lunes a viernes. Hablas con Alma en español, inglés o portugués por Google Meet, correo o WhatsApp. Suele responder en un día laborable y te envía por escrito las conclusiones de la reunión nada más colgar.",
    },
  },
  {
    id: "mid-sampling-changes",
    question: {
      en: "What happens if I want to change a strap drop, pocket, fabric, or measurement during sampling?",
      es: "¿Qué ocurre si quiero ajustar la caída del asa, un bolsillo, un tejido o una medida durante el muestreo?",
    },
    answer: {
      en: "Show Alma what you want to adjust on a quick video call. She updates your single written Product Brief and emails the revised points back for your confirmation. Alma and Shirish then sit down with the pattern maker at the production unit in India over the physical sample so the change lands accurately in the next prototype.",
      es: "Le enseñas el cambio a Alma en una videollamada rápida. Ella actualiza tu mismo briefing de producto por escrito y te manda los ajustes por correo para que los confirmes. Después, Alma y Shirish repasan esos puntos en persona con el patronista en la unidad de producción en la India, con la muestra física delante, para que el siguiente prototipo salga clavado.",
    },
  },
  {
    id: "prevent-colour-drift",
    question: {
      en: "How do you control colour and material feel if I cannot visit the tannery or dye house?",
      es: "¿Cómo aseguráis el color y la textura si no puedo visitar la curtiduría ni el centro de tintado?",
    },
    answer: {
      en: "Screens shift vegetable-tanned leather, natural linen, and organic dyes under different lighting. We tell you exactly what each dye batch requires and create a physical colour swatch with our Manufacturing Partners for you to hold and approve in daylight. Once you approve that swatch, we check incoming hides, fabrics, and finishes on site in India against it before cutting starts.",
      es: "Las pantallas engañan con la piel de curtido vegetal, el lino natural y los tintes orgánicos según la luz del día. Te indicamos qué necesitamos para cada tintada y preparamos una muestra física de color junto a nuestros colaboradores para que compruebes tono y textura en tus manos. Cuando das tu aprobación, verificamos en persona cada lote frente a esa referencia antes de comenzar con el corte de las piezas.",
    },
  },
  {
    id: "sample-pre-screening",
    question: {
      en: "Do you ship rough first drafts to Europe, or review physical samples in India first?",
      es: "¿Enviáis los primeros prototipos sin revisar a Europa o comprobáis antes la muestra para valoración en la India?",
    },
    answer: {
      en: "We inspect every sample in India first across leather goods, clothing in natural and varied fabrics, custom sewn accessories, and home decor. If stitching, material feel, proportions, fit, or hardware miss your Product Brief, we rework that draft at the production site so you avoid wasted weeks and courier fees. Even on strong samples, Alma flags tiny refinements openly before you approve, and production begins only after you sign off the physical sample in hand.",
      es: "Revisamos primero cada muestra en la India, ya sean bolsos y otros artículos de piel, prendas de diversos tejidos, complementos confeccionados a medida o decoración del hogar. Si las costuras, la textura, un corte incómodo o los herrajes no encajan con tu briefing, corregimos ese prototipo en el punto de producción para ahorrarte semanas y portes innecesarios. Incluso cuando una muestra sale bien, Alma te comenta pequeños ajustes con sinceridad, y no procedemos a la producción hasta que tienes en tu mano la muestra física previamente revisada y aprobada por ti.",
    },
  },
  {
    id: "payment-and-legal-safety",
    question: {
      en: "How are my designs, payments, and partner commitments protected from a distance?",
      es: "¿Cómo se protegen mis diseños, mis pagos y los compromisos de fabricación a distancia?",
    },
    answer: {
      en: "Co-founder Shirish is a registered Bar Council advocate in India who puts material specs, quality tolerances, and delivery dates into written Indian supplier contracts with each Manufacturing Partner. Only Alma and Shirish see your sketches during evaluation, mutual NDA and NNN confidentiality agreements are available before you share sensitive designs, and cutting begins only after you approve the physical sample.",
      es: "Nuestro cofundador Shirish es abogado colegiado en el Bar Council de la India y deja cerradas las especificaciones, tolerancias de calidad y fechas de entrega en contratos escritos con las unidades de producción bajo ley india. Durante la valoración solo Alma y Shirish ven tus bocetos. Tienes acuerdos mutuos de confidencialidad NDA y NNN disponibles antes de compartir diseños sensibles, y solo comenzamos con el corte de las piezas cuando apruebas la muestra física en mano.",
    },
  },
  {
    id: "live-visibility-without-travelling",
    question: {
      en: "Can I see my collection being made in India without travelling for every run?",
      es: "¿Puedo ver cómo avanza mi pedido en la India sin viajar en cada producción?",
    },
    answer: {
      en: "Yes. Whether we produce in Kolkata, Kanpur, Agra, Chennai, or another specialist hub overseen from Maharashtra, we follow your order on site and share photos and short clips as materials arrive, first pieces leave the stitching line, and finished goods go into numbered export cartons. Whenever a practical decision comes up or you want to meet the artisans crafting your collection, we connect you by live video call from the production site.",
      es: "Sí. Tanto si fabricamos en Calcuta, Kanpur, Agra o Chennai como en otro polo especialista supervisado desde Maharashtra, seguimos tu pedido a pie de obra y te mandamos fotos y vídeos cortos cuando llegan los materiales, cuando salen las primeras piezas de costura y cuando embalamos todo en cajas de exportación numeradas. Siempre que surja una decisión práctica o te apetezca saludar a los artesanos y artesanas que dan forma a tu colección, conectamos por videollamada en directo desde el lugar de producción.",
    },
  },
];
