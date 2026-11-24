import type { SiteLanguage } from "@/lib/urls";

export interface ManufacturingHeroFact {
  readonly number: string;
  readonly label: Record<SiteLanguage, string>;
  readonly detail: Record<SiteLanguage, string>;
}

export interface ProductStudyPillar {
  readonly id: string;
  readonly number: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
}

export interface ManufacturingCategory {
  readonly id: string;
  readonly querySlug: "bags" | "garments" | "other" | "home-decor";
  readonly number: string;
  readonly name: Record<SiteLanguage, string>;
  readonly summary: Record<SiteLanguage, string>;
  readonly details: Record<SiteLanguage, string>;
  readonly tableMaterials: Record<SiteLanguage, string>;
  readonly tableRegions: Record<SiteLanguage, string>;
  readonly tableVerification: Record<SiteLanguage, string>;
  readonly ctaLabel: Record<SiteLanguage, string>;
  readonly ctaMicrocopy: Record<SiteLanguage, string>;
  readonly image?: string;
  readonly imageAlt?: Record<SiteLanguage, string>;
  readonly placeholderTitle?: Record<SiteLanguage, string>;
  readonly placeholderDescription?: Record<SiteLanguage, string>;
}

export interface ManufacturingProofMetric {
  readonly id: string;
  readonly label: Record<SiteLanguage, string>;
  readonly value: Record<SiteLanguage, string>;
  readonly detail: Record<SiteLanguage, string>;
}

export interface WorkshopCriterion {
  readonly id: string;
  readonly number: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
}

export interface SourcingComparisonRow {
  readonly id: string;
  readonly criterion: Record<SiteLanguage, string>;
  readonly karmarise: Record<SiteLanguage, string>;
  readonly brokers: Record<SiteLanguage, string>;
  readonly diy: Record<SiteLanguage, string>;
}

export interface ManufacturingStage {
  readonly id: string;
  readonly stepNumber: string;
  readonly shortLabel: Record<SiteLanguage, string>;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
  readonly video: string;
  readonly poster: string;
  readonly videoLabel: Record<SiteLanguage, string>;
  readonly x: number;
  readonly y: number;
  readonly labelPosition: "above" | "below";
}

export interface PreProductionAgreement {
  readonly id: string;
  readonly number: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
}

export interface ManufacturingFaqItem {
  readonly id: string;
  readonly question: Record<SiteLanguage, string>;
  readonly answer: Record<SiteLanguage, string>;
}

export const MANUFACTURING_LAST_REVIEWED = {
  iso: "2026-11-24",
  en: "24 November 2026",
  es: "24 de noviembre de 2026",
} as const;

export const MANUFACTURING_HERO_FACTS: readonly ManufacturingHeroFact[] = [
  {
    number: "01",
    label: {
      en: "Product study before you spend on samples",
      es: "Estudio de producto antes de invertir en muestras",
    },
    detail: {
      en: "Bring a four-line sketch or a bag already sitting in your shop. We check ergonomics, materials, and production feasibility before anyone cuts leather or cloth.",
      es: "Trae un boceto de cuatro líneas o un bolso que ya vendas en tu tienda. Revisamos contigo la ergonomía, los materiales y la viabilidad en planta antes de que nadie corte piel ni tela.",
    },
  },
  {
    number: "02",
    label: {
      en: "Vetted Indian production units and craft makers",
      es: "Unidades de producción y artesanos auditados en la India",
    },
    detail: {
      en: "We travel across India in person to audit family-run factories, tanneries, leather ateliers, garment makers, and women artisan collectives, matching each stage of your product to the specialist city suited to it.",
      es: "Recorremos el país en persona para auditar fábricas de corte familiar, curtidurías, marroquineros, confeccionistas y colectivos de artesanas. Así cada fase de tu producto va al lugar de producción con más oficio para ello.",
    },
  },
  {
    number: "03",
    label: {
      en: "Physical sample in hand and Indian legal backing",
      es: "Muestra física en mano y respaldo legal en la India",
    },
    detail: {
      en: "Cutting never begins until you hold and approve a physical sample in Spain or the rest of Europe. Co-founder Shirish, a registered Bar Council advocate, puts every production commitment into a written Indian contract.",
      es: "No comenzamos con el corte de las piezas hasta que tienes y apruebas la muestra física en España o en el resto de Europa. Shirish, abogado colegiado en el Bar Council de la India, deja cada compromiso recogido en contratos escritos con unidades de producción bajo ley india.",
    },
  },
];

export const MANUFACTURING_PRODUCT_STUDY_PILLARS: readonly ProductStudyPillar[] =
  [
    {
      id: "ergonomics-and-design",
      number: "01",
      title: {
        en: "Ergonomic and commercial design study",
        es: "Estudio ergonómico y comercial del diseño",
      },
      body: {
        en: "We review strap drop, bag weight, pocket placement, hardware, and garment drape from the point of view of a European wearer. On a flagship leather backpack for a Spanish boutique, we started from a four-line sketch and tapered a boxy rectangle into a balanced pyramid silhouette with a top grab handle. We replaced metal teeth with smooth, high-quality Japanese plastic YKK zippers to protect hands and winter coats, and lined the interior in light cotton so keys stay easy to spot.",
        es: "Revisamos la caída del asa, el peso del bolso, la colocación de los bolsillos, los herrajes y el movimiento de la prenda pensando en quien la va a llevar cada día. En la mochila principal de una boutique española partimos de un boceto de cuatro líneas y afinamos una caja cuadrada hasta darle un perfil piramidal equilibrado con asa superior de agarre. Cambiamos los dientes metálicos por cremalleras japonesas YKK de plástico de alta calidad para cuidar manos y abrigos de invierno. Elegimos forro claro de algodón para encontrar las llaves a la primera.",
      },
    },
    {
      id: "material-and-cluster-feasibility",
      number: "02",
      title: {
        en: "Material and regional feasibility across India",
        es: "Materiales y viabilidad por centros especialistas de la India",
      },
      body: {
        en: "Before you spend money on prototypes, we check in person which Indian craft hub holds the hides, textiles, and machinery your design calls for. For leather goods, clothing, custom sewn accessories, and home decor, we work across specialist Indian hubs including Kolkata, Kanpur, Agra, and Chennai, with coordination and quality supervision from Maharashtra. When a Spanish boutique asked for silky, soft leather they called goxo-goxo in Basque, we paid for exploratory samples first and tested multiple vegetable-tanning rounds. To hold that exact hand-feel, we split the work across three regions: vegetable tanning in Kolkata, bag construction in Uttar Pradesh, and quality supervision from Maharashtra.",
        es: "Antes de invertir en prototipos, comprobamos en persona qué polo artesano de la India reúne la piel, el tejido y la maquinaria que pide tu diseño. Trabajamos en ciudades especialistas como Calcuta, Kanpur, Agra y Chennai, junto a puntos de producción textiles y de decoración del hogar repartidos por el país, con supervisión desde Maharashtra. Cuando una boutique en España nos pidió una piel sedosa y blandita que en euskera llamaban goxo-goxo, pagamos primero muestras de prueba y ensayamos varias rondas de curtido vegetal. Para mantener ese tacto exacto repartimos el trabajo entre tres regiones: curtido vegetal en Calcuta, confección marroquinera en Uttar Pradesh y seguimiento de calidad desde Maharashtra.",
      },
    },
    {
      id: "written-brief-and-colour-swatch",
      number: "03",
      title: {
        en: "Written Product Brief and physical colour swatch",
        es: "Briefing de producto por escrito y muestra física de color",
      },
      body: {
        en: "Alma emails clear written meeting conclusions right after every video call so both sides confirm every point agreed. Because phone screens shift shades such as tan leather or natural linen toward mustard or dark brown under different light, we never dye from screen photos alone. We tell you what is needed for each dye batch and create a physical colour swatch for your approval before cutting starts.",
        es: "Alma envía por correo las conclusiones de la reunión nada más colgar cada videollamada, para que ambas partes confirmemos cada punto acordado. Como la pantalla del móvil altera tonos como la piel tostada o el lino crudo hacia matices mostaza o marrón oscuro según la luz, nunca teñimos a partir de fotos. Te indicamos lo que necesitamos para cada tintada y preparamos una muestra física de color para tu aprobación antes de comenzar con el corte de las piezas.",
      },
    },
    {
      id: "eu-presentation-and-compliance",
      number: "04",
      title: {
        en: "EU labelling, packaging, and customs from day one",
        es: "Etiquetado europeo, presentación y aduanas desde el primer día",
      },
      body: {
        en: "Garments, leather goods, and home items entering Spain and the rest of Europe carry clear compliance rules, from sewn-in textile fibre tags to permanent leather origin markings for EU customs clearance. Planning woven brand labels, cotton dust bags, unbleached chemical-free recycled cardboard care hangtags, and numbered export cartons from the outset keeps customs holds and unexpected air-freight quotes from ambushing you at dispatch.",
        es: "Las prendas, los artículos de piel y las piezas de hogar que entran en España y el resto de Europa cumplen reglas claras de etiquetado, desde las etiquetas cosidas de composición textil hasta los marcajes permanentes de origen y piel para aduanas. Dejar cerradas desde el inicio las etiquetas tejidas con tu marca, las bolsas guardapolvo de algodón, las etiquetas de cartón reciclado sin blanquear, libre de químicos, y las cajas de exportación evita retrasos en frontera y sustos con el flete aéreo.",
      },
    },
  ];

export const MANUFACTURING_CATEGORIES: readonly ManufacturingCategory[] = [
  {
    id: "bags",
    querySlug: "bags",
    number: "01",
    name: {
      en: "Leather bags and other leather goods",
      es: "Bolsos de piel y otros artículos de piel",
    },
    summary: {
      en: "Structured handbags, soft carryalls, backpacks, leather-and-canvas styles, and small leather goods produced with specialist Indian tanneries, leather ateliers, and vetted leather production units across Kolkata, Kanpur, Agra, and Chennai.",
      es: "Bolsos estructurados, bolsones, mochilas, modelos combinados de piel y lona y pequeña marroquinería producidos con curtidurías, marroquineros y unidades de producción especializadas en Calcuta, Kanpur, Agra y Chennai.",
    },
    details: {
      en: "Vegetable-tanned hides, antique brass hardware, high-quality Japanese plastic YKK zippers, light cotton linings, accurate strap drop, and custom cotton dust bags built for daily wear and clean shop display.",
      es: "Pieles de curtido vegetal, herrajes de latón envejecido, cremalleras japonesas YKK de plástico de alta calidad, forros claros de algodón, caída del asa medida al detalle y bolsas guardapolvo de algodón pensadas para el trote diario y para colocar directamente en el escaparate.",
    },
    tableMaterials: {
      en: "Vegetable-tanned leather, canvas, light cotton linings, antique brass hardware, high-quality Japanese plastic YKK zippers",
      es: "Piel de curtido vegetal, lona, forros claros de algodón, herrajes de latón envejecido, cremalleras japonesas YKK de plástico de alta calidad",
    },
    tableRegions: {
      en: "Tanneries, leather ateliers, and production units in Kolkata, Kanpur, Agra, and Chennai; quality oversight from Maharashtra",
      es: "Curtidurías, marroquineros y unidades de producción en Calcuta, Kanpur, Agra y Chennai; supervisión de calidad desde Maharashtra",
    },
    tableVerification: {
      en: "Physical colour swatch approved by you, strap drop and zipper ergonomics check, reviewed physical sample in hand",
      es: "Muestra física de color aprobada por ti, revisión de caída del asa y cremalleras, muestra para valoración en mano",
    },
    ctaLabel: {
      en: "Share your leather bag idea",
      es: "Cuéntanos tu idea de bolsos",
    },
    ctaMicrocopy: {
      en: "Opens your brief in the leather category. No tech pack needed.",
      es: "Abre el briefing en la categoría de piel. Sin ficha técnica previa.",
    },
    image: "/images/workshops/alma-black-leather-tote-inspection.jpeg",
    imageAlt: {
      en: "Alma holding a finished black leather handbag inside the sample room of a vetted Indian leather production unit",
      es: "Alma sosteniendo un bolso terminado de piel negra en la sala de muestras de una unidad de producción marroquinera auditada en la India",
    },
  },
  {
    id: "garments",
    querySlug: "garments",
    number: "02",
    name: {
      en: "Clothing in natural and varied fabrics and capsule collections",
      es: "Prendas de diversos tejidos y colecciones cápsula",
    },
    summary: {
      en: "Shirts, dresses, kimonos, shrugs, light jackets, trousers, and seasonal capsule collections cut and stitched by established family-run factories, garment makers, and women artisan collectives across India.",
      es: "Camisas, vestidos, kimonos, shrugs, chaquetas finas, pantalones, prendas de uso diario y colecciones cápsula de temporada cortados y cosidos en fábricas de corte familiar, confeccionistas y colectivos de artesanas por toda la India.",
    },
    details: {
      en: "Breathable cotton, linen, silk, blended fabrics, organic dyes, and plant-based textiles finished with comfortable cuts and sewn-in EU fibre and care labels ready for shop rails.",
      es: "Algodón transpirable, lino, seda, tejidos con mezcla, tintes orgánicos y tejidos de fibra vegetal con cortes cómodos y etiquetas cosidas indicando la composición y el cuidado conforme a la normativa europea.",
    },
    tableMaterials: {
      en: "Cotton, linen, silk, blended fabrics, organic dyes, plant-based textiles, sewn-in EU fibre and care labels",
      es: "Algodón, lino, seda, tejidos con mezcla, tintes orgánicos, tejidos de fibra vegetal y etiquetas cosidas UE",
    },
    tableRegions: {
      en: "Family-run garment makers, production units, and women artisan collectives across India",
      es: "Fábricas de corte familiar, confeccionistas y colectivos de artesanas por toda la India",
    },
    tableVerification: {
      en: "Drape check on dressmaker forms, fabric weight and finishes review, physical sample fit sign-off",
      es: "Prueba de caída en maniquí, control de gramaje y acabados, muestra física previamente revisada y aprobada por ti",
    },
    ctaLabel: {
      en: "Share your clothing idea",
      es: "Cuéntanos tu idea de prendas",
    },
    ctaMicrocopy: {
      en: "Opens your brief in the clothing category. No tech pack needed.",
      es: "Comparte con nosotros la prenda que te ronda en la cabeza. Sin ficha técnica previa.",
    },
    image:
      "/images/almarise/almarise-reborn-olive-pallu-shrug-madrid-street.jpeg",
    imageAlt: {
      en: "Model wearing an embroidered sheer purple and olive outer garment tailored in India",
      es: "Modelo vistiendo una chaqueta ligera bordada en tonos ciruela y oliva confeccionada en la India",
    },
  },
  {
    id: "other-crafted",
    querySlug: "other",
    number: "03",
    name: {
      en: "Custom sewn accessories and brand presentation",
      es: "Complementos confeccionados a medida y presentación de marca",
    },
    summary: {
      en: "Textile pouches, custom sewn accessories, woven brand labels, cotton dust bags, and unbleached chemical-free recycled cardboard care hangtags that carry your brand identity from the moment a shopper picks up the piece.",
      es: "Neceseres textiles, complementos confeccionados a medida, etiquetas tejidas con tu marca, bolsas guardapolvo de algodón y etiquetas de cartón reciclado sin blanquear, libre de químicos, que cuidan tu identidad desde que el cliente abre el paquete.",
    },
    details: {
      en: "Heavy cotton canvas, natural trims, custom sewn labels, and numbered stretch-wrapped export cartons prepared for smooth EU customs arrival.",
      es: "Loneta gruesa de algodón, fornituras naturales, etiquetas personalizadas y cajas de exportación numeradas y retractiladas listas para llegar sin tropiezos a aduanas europeas.",
    },
    tableMaterials: {
      en: "Heavy cotton canvas, natural trims, woven brand labels, cotton dust bags, unbleached chemical-free recycled cardboard hangtags",
      es: "Loneta gruesa de algodón, fornituras naturales, etiquetas tejidas con tu marca, bolsas guardapolvo de algodón y etiquetas de cartón reciclado sin blanquear, libre de químicos",
    },
    tableRegions: {
      en: "Matched in person across specialist Indian textile, print, and craft production units",
      es: "Selección presencial entre especialistas textiles, gráficos y artesanales de la India",
    },
    tableVerification: {
      en: "On-site feasibility check and physical prototype approval before cutting starts",
      es: "Comprobación presencial en el punto de producción y aprobación del prototipo físico antes de comenzar el corte",
    },
    ctaLabel: {
      en: "Share your brand accessory idea",
      es: "Cuéntanos tu idea de complementos",
    },
    ctaMicrocopy: {
      en: "We verify production-unit feasibility in person before sampling begins.",
      es: "Comprobamos en persona la viabilidad en planta antes de hacer muestras.",
    },
    image:
      "/images/workshops/shirish-woman-artisan-striped-cotton-linings.jpeg",
    imageAlt: {
      en: "Shirish and an Indian artisan inspecting striped cotton bag linings and zippers before assembly at a production unit",
      es: "Shirish y una artesana revisando forros de algodón a rayas y cremalleras antes del montaje en un punto de producción de la India",
    },
  },
  {
    id: "home-decor",
    querySlug: "home-decor",
    number: "04",
    name: {
      en: "Home decor",
      es: "Decoración del hogar",
    },
    summary: {
      en: "Own-brand home decor developed and crafted with vetted Indian production units, family-run factories, and artisan collectives across India. Bring the role, look, and textures you want in your store or brand collection, and we verify materials and specialist maker fit on the ground before moving into prototypes.",
      es: "Artículos de decoración del hogar con tu propia marca, desarrollados y producidos con lugares de producción, fábricas de corte familiar y colectivos de artesanas auditados en la India. Cuéntanos el estilo, las texturas y el papel que buscan estas piezas en tu comercio o colección, y verificamos materiales y capacidad sobre el terreno antes de pasar a prototipos.",
    },
    details: {
      en: "Material selection, physical colour swatches, finish checks, custom packaging, and export carton protection scoped around your Product Brief and European retail requirements.",
      es: "Selección de materiales, muestra física de color, revisión de acabados, presentación con tu marca y embalaje de exportación adaptados a tu briefing de producto y a tus requisitos en Europa.",
    },
    tableMaterials: {
      en: "Natural and crafted home-decor materials, finishes, custom brand tags, and protective export packing per brief",
      es: "Materiales y acabados de decoración del hogar, etiquetas con tu marca y embalaje protector de exportación según briefing",
    },
    tableRegions: {
      en: "Vetted Indian production units, family-run factories, and artisan collectives across India, overseen from Maharashtra",
      es: "Unidades de producción, fábricas de corte familiar y colectivos de artesanas en la India, con supervisión desde Maharashtra",
    },
    tableVerification: {
      en: "On-site feasibility check, physical swatch sign-off, and reviewed physical sample in hand",
      es: "Estudio presencial de viabilidad, aprobación de muestra física de color y muestra para valoración en mano",
    },
    ctaLabel: {
      en: "Share your home decor idea",
      es: "Tu idea de decoración del hogar",
    },
    ctaMicrocopy: {
      en: "Opens your brief in the home decor category. No tech pack needed.",
      es: "Abre el briefing en decoración del hogar. Sin ficha técnica previa.",
    },
    placeholderTitle: {
      en: "Home decor photography coming soon",
      es: "Fotografía de decoración del hogar en preparación",
    },
    placeholderDescription: {
      en: "Reserved for verified on-ground photographs of own-brand home decor samples and Indian production units from Alma and Shirish.",
      es: "Espacio reservado para fotografías reales de muestras de decoración del hogar y unidades de producción en la India tomadas por Alma y Shirish.",
    },
  },
];

export const MANUFACTURING_PROOF_METRICS: readonly ManufacturingProofMetric[] =
  [
    {
      id: "three-states",
      label: {
        en: "Multi-region craft matching",
        es: "Coordinación entre regiones artesanas",
      },
      value: {
        en: "3 Indian states coordinated for one Spanish handbag line",
        es: "3 estados de la India coordinados para una colección española de bolsos",
      },
      detail: {
        en: "We vegetable-tanned soft hides in Kolkata, stitched four bag styles in black and tan in Uttar Pradesh, and supervised quality from Maharashtra. Each stage went to the hub known for that craft.",
        es: "Curtimos al vegetal pieles suaves en Calcuta, confeccionamos cuatro modelos de bolso en negro y tostado en Uttar Pradesh y supervisamos la producción desde Maharashtra. Cada fase fue al lugar con más oficio para ella.",
      },
    },
    {
      id: "sample-refinement",
      label: {
        en: "Detail-level product study",
        es: "Estudio de producto al detalle",
      },
      value: {
        en: "2 leather sample rounds and 10 to 15 days sourcing natural hangtags",
        es: "2 rondas de muestras en piel y de 10 a 15 días buscando etiquetas naturales",
      },
      detail: {
        en: "After paper drafts, two physical leather iterations locked the tapered backpack silhouette, antique brass hardware, high-quality Japanese plastic YKK zippers, and distinct casual and dressy bag sizes. Our Manufacturing Partner also spent 10 to 15 days hunting down unbleached chemical-free recycled cardboard for the Spanish care hangtags.",
        es: "Tras los bocetos en papel, dos iteraciones físicas en piel cerraron el perfil piramidal de la mochila, los herrajes de latón envejecido, las cremalleras japonesas YKK de plástico de alta calidad y dos tamaños distintos para uso diario y más de vestir. Nuestra fábrica colaboradora dedicó también entre 10 y 15 días a localizar cartón reciclado sin blanquear, libre de químicos, para las etiquetas de cuidado en español.",
      },
    },
    {
      id: "export-delivery",
      label: {
        en: "Doorstep European arrival",
        es: "Llegada a la puerta del negocio",
      },
      value: {
        en: "11 numbered export cartons straight into a downtown shop window",
        es: "11 cajas de exportación numeradas directas al escaparate",
      },
      detail: {
        en: 'The minute the stretch-wrapped cartons landed outside the Spanish boutique, the Client sent a doorstep photo saying "We got it! They are here!" All eight bags in black and tan went straight into his main shop window that same day.',
        es: "En cuanto las cajas retractiladas llegaron a la puerta de la boutique en España, el cliente nos mandó una foto desde la calle: «¡Nos han llegado! ¡Ya están aquí!». Pudo colocar directamente en el escaparate principal los ocho bolsos en negro y tostado ese mismo día.",
      },
    },
  ];

export const MANUFACTURING_SELECTION_CRITERIA: readonly WorkshopCriterion[] = [
  {
    id: "materials",
    number: "01",
    title: {
      en: "Craft skill and the right machines",
      es: "Oficio y maquinaria adecuada",
    },
    body: {
      en: "Does the production unit already make this material and construction every day, with clean skiving and stitching machines running on site?",
      es: "¿Trabaja ya esta unidad de producción con ese material y esa construcción cada día, con máquinas bien cuidadas de rebajado y costura en planta?",
    },
  },
  {
    id: "capacity",
    number: "02",
    title: {
      en: "A scale that respects your order",
      es: "Una escala que respete tu pedido",
    },
    body: {
      en: "An independent boutique commissioning its first own-brand capsule needs a different manufacturing unit from a retail chain placing larger repeat Bulk Orders. We match you to a facility where your order fits cleanly into the schedule.",
      es: "Un comercio independiente que lanza su primera cápsula propia necesita una planta distinta a la de una cadena que repite pedidos de producción mayores. Buscamos el punto de producción donde tu encargo encaje sin quedar relegado.",
    },
  },
  {
    id: "sampling",
    number: "03",
    title: {
      en: "Accurate sample revisions and written tolerances",
      es: "Ajustes fieles de muestras y tolerancias por escrito",
    },
    body: {
      en: "Can the pattern maker refine prototypes accurately and hold those exact linings, finishes, and stitch counts once production begins?",
      es: "¿Sabe el patronista corregir los prototipos con precisión y mantener exactamente esos forros, puntadas y acabados una vez que empieza la producción?",
    },
  },
  {
    id: "open-floors",
    number: "04",
    title: {
      en: "Open doors and human dignity",
      es: "Puertas abiertas y trato digno",
    },
    body: {
      en: "We walk active production sites in person, spend days working elbow to elbow beside the makers, and speak directly with artisans rather than only facility owners. Zero exploitation is non-negotiable across every Manufacturing Partner we work with.",
      es: "Recorremos líneas activas en persona, pasamos días a pie de obra junto a quienes cosen las piezas y hablamos directamente con artesanos y artesanas, no solo con la dirección. La tolerancia cero ante la explotación es innegociable en cada fábrica colaboradora con la que trabajamos.",
    },
  },
];

export const MANUFACTURING_COMPARISON_ROWS: readonly SourcingComparisonRow[] = [
  {
    id: "product-study",
    criterion: {
      en: "Product study and design",
      es: "Estudio y diseño de producto",
    },
    karmarise: {
      en: "Proactive ergonomic advice, material search, and written Product Brief from a sketch or shop piece",
      es: "Consejo ergonómico proactivo, búsqueda de materiales y briefing de producto por escrito desde un boceto o una pieza de tu tienda",
    },
    brokers: {
      en: "Passive email handoff with little European retail or usability feedback",
      es: "Reenvío pasivo por correo con poco criterio de uso o venta en España y el resto de Europa",
    },
    diy: {
      en: "Factories expect finished technical drawings and build flaws blindly",
      es: "Las fábricas piden fichas técnicas cerradas y fabrican los fallos sin avisar",
    },
  },
  {
    id: "artisans-vetting",
    criterion: {
      en: "Artisan and facility vetting",
      es: "Auditoría de artesanos y unidades",
    },
    karmarise: {
      en: "In-person audits of production units, family-run factories, leather ateliers, and women artisan collectives across Kolkata, Kanpur, Agra, Chennai, and wider India",
      es: "Auditorías presenciales de unidades de producción, fábricas de corte familiar, marroquineros y colectivos de artesanas en Calcuta, Kanpur, Agra, Chennai y el resto del país",
    },
    brokers: {
      en: "Often tied to a fixed pool of commission factories with limited on-site visits",
      es: "A menudo ligados a una lista cerrada de fábricas a comisión y pocas visitas a planta",
    },
    diy: {
      en: 'Hard to verify listings remotely; polite "yes" answers can hide missing machines',
      es: "Difícil de comprobar a distancia; un «sí» amable puede ocultar falta de maquinaria",
    },
  },
  {
    id: "colour-samples",
    criterion: {
      en: "Colour and sample control",
      es: "Control de color y muestras",
    },
    karmarise: {
      en: "Physical colour swatches created for your approval, every prototype reviewed in India first, and final physical sample approved in your hands",
      es: "Muestra física de color creada para tu aprobación, cada prototipo revisado primero en la India y muestra física previamente revisada y aprobada por ti en mano",
    },
    brokers: {
      en: "Relies on phone photos and forwards unreviewed samples at your cost",
      es: "Depende de fotos de móvil y reenvía muestras sin revisar a tu costa",
    },
    diy: {
      en: "High risk of tan or dye drift, silent lining swaps, and wasted courier rounds",
      es: "Alto riesgo de desviación en tonos tostados o tintadas, cambios de forro sin aviso y mensajería desperdiciada",
    },
  },
  {
    id: "legal-protection",
    criterion: {
      en: "Legal and payment safety",
      es: "Seguridad legal y de pagos",
    },
    karmarise: {
      en: "Written Indian supplier contracts structured by Bar Council advocate Shirish, plus mutual NDA and NNN confidentiality available",
      es: "Contratos escritos con unidades de producción bajo ley india estructurados por Shirish (Bar Council), con acuerdos mutuos NDA y NNN disponibles",
    },
    brokers: {
      en: "Informal broker assurances with thin accountability after transfer",
      es: "Garantías informales del intermediario con poca responsabilidad tras la transferencia",
    },
    diy: {
      en: "Slow, costly cross-border disputes without local Indian legal supervision",
      es: "Disputas internacionales lentas y caras sin respaldo legal sobre el terreno en la India",
    },
  },
  {
    id: "communication",
    criterion: {
      en: "Continuity and visibility",
      es: "Continuidad y visibilidad",
    },
    karmarise: {
      en: "Direct calls with Alma, written meeting conclusions straight after, and live video updates from the production site",
      es: "Llamadas directas con Alma, conclusiones de la reunión por escrito justo después y videollamadas en directo desde el punto de producción",
    },
    brokers: {
      en: "Multiple handoffs between your European team and the production line",
      es: "Varios intermediarios entre tu equipo en Europa y la línea de costura",
    },
    diy: {
      en: "Time-zone friction, misunderstandings, and silent production periods",
      es: "Fricción horaria, malentendidos y periodos de silencio durante la producción",
    },
  },
  {
    id: "eu-export",
    criterion: {
      en: "EU labelling and export",
      es: "Etiquetado europeo y exportación",
    },
    karmarise: {
      en: "Sewn-in EU leather and fibre labels, care tags, export cartons, and customs planned in your proposal through doorstep delivery",
      es: "Etiquetas cosidas europeas de piel y composición, etiquetas de cuidado, cajas de exportación y aduanas previstos en tu propuesta hasta la puerta de tu negocio",
    },
    brokers: {
      en: "Compliance tags and air-freight shocks often surface right before dispatch",
      es: "Las etiquetas obligatorias y los sustos de flete aéreo suelen aparecer justo antes de enviar",
    },
    diy: {
      en: "You coordinate freight forwarders, EU labelling rules, and customs clearance alone",
      es: "Tienes que coordinar por tu cuenta transitarios, normativa europea de etiquetado y aduanas",
    },
  },
];

export const MANUFACTURING_STAGES: readonly ManufacturingStage[] = [
  {
    id: "product-brief",
    stepNumber: "01",
    shortLabel: {
      en: "Product Brief",
      es: "Briefing",
    },
    title: {
      en: "Product Brief and discovery call",
      es: "Briefing de producto y primera llamada",
    },
    body: {
      en: "Bring a rough sketch, a favourite piece from your shop, or book a free 15-minute video call with Alma. Your designs stay confidential, with mutual NDA available, and clear written meeting conclusions land in your inbox straight after we talk.",
      es: "Trae un boceto rápido, una pieza que ya vendes en tu tienda o reserva una videollamada gratuita de 15 minutos con Alma. Tus diseños son confidenciales, con acuerdos mutuos NDA disponibles, y nada más colgar recibes en tu correo las conclusiones de la reunión por escrito.",
    },
    video: "/videos/phases/step-01-brief-review.mp4",
    poster: "/images/almarise/alma-draping-saree-dress-form-studio.jpeg",
    videoLabel: {
      en: "Reviewing patterns, leather hides, and fabric swatches for a Product Brief",
      es: "Revisión de patrones, pieles y muestras de tejido para preparar un briefing de producto",
    },
    x: 90,
    y: 175,
    labelPosition: "below",
  },
  {
    id: "product-study-match",
    stepNumber: "02",
    shortLabel: {
      en: "Study & match",
      es: "Estudio y selección",
    },
    title: {
      en: "Product study and partner matching across India",
      es: "Estudio de producto y selección de unidad de producción",
    },
    body: {
      en: "We study ergonomics, materials, and EU requirements, then visit tanneries, leather ateliers, family-run factories, production units, and artisan collectives across India in person to pair your Product Brief with the right Manufacturing Partner. From that groundwork, we send you a clear custom proposal.",
      es: "Estudiamos ergonomía, materiales y requisitos europeos antes de visitar en persona curtidurías, marroquineros, fábricas de corte familiar, lugares de producción y colectivos de artesanas de la India para elegir el equipo adecuado. Con ese trabajo previo te enviamos una propuesta a medida clara.",
    },
    video: "/videos/phases/step-02-study-match.mp4",
    poster: "/videos/posters/step-02-study-match.jpg",
    videoLabel: {
      en: "Alma reviewing product specifications and matching designs to a specialist production unit in India",
      es: "Alma revisando especificaciones de producto y seleccionando la unidad de producción adecuada en la India",
    },
    x: 294,
    y: 85,
    labelPosition: "above",
  },
  {
    id: "sample-approval",
    stepNumber: "03",
    shortLabel: {
      en: "Physical sample",
      es: "Muestra física",
    },
    title: {
      en: "Physical colour swatch and reviewed sampling",
      es: "Muestra física de color y muestras para valoración",
    },
    body: {
      en: "We never guess colours from phone photos. We tell you what is needed for each dye batch and create a physical colour swatch for your approval. Alma inspects every prototype in India first, sets aside weak drafts before shipping, flags even minor refinements openly, and sends a physical sample for you to test in your hands.",
      es: "Nunca dejamos el color en manos de una foto de móvil. Te indicamos lo que necesitamos para cada tintada y creamos una muestra física de color para tu aprobación. Alma revisa primero cada prototipo en la India, descarta los borradores que no dan la talla antes de enviártelos, te señala abiertamente hasta los ajustes mínimos y te manda la muestra para valoración para que la pruebes en mano.",
    },
    video: "/videos/phases/step-03-sample-approval.mp4",
    poster: "/videos/posters/step-03-sample-approval.jpg",
    videoLabel: {
      en: "Shirish inspecting sample stitching and finishes at an Indian production site",
      es: "Shirish revisando costuras y acabados de una muestra física en un punto de producción de la India",
    },
    x: 498,
    y: 185,
    labelPosition: "below",
  },
  {
    id: "materials-contracts",
    stepNumber: "04",
    shortLabel: {
      en: "Materials & terms",
      es: "Materiales y acuerdo",
    },
    title: {
      en: "Materials, contracts, and pre-production sign-off",
      es: "Materiales, contratos y cierre previo a producción",
    },
    body: {
      en: "No production unit begins cutting until you sign off the physical sample in hand. Once approved, Shirish locks hides, fabrics, hardware, EU labels, and written Indian supplier contracts.",
      es: "Ninguna unidad de producción comienza con el corte de las piezas hasta que apruebas la muestra física en mano. Con tu visto bueno, Shirish deja cerrados pieles, tejidos, herrajes, etiquetas europeas y los contratos escritos bajo legislación india.",
    },
    video: "/videos/phases/step-04-materials-contracts.mp4",
    poster:
      "/images/workshops/shirish-woman-artisan-striped-cotton-linings.jpeg",
    videoLabel: {
      en: "Shirish verifying materials, linings, and written production specifications with manufacturing specialists",
      es: "Shirish comprobando materiales, forros y especificaciones escritas junto al equipo de producción",
    },
    x: 702,
    y: 85,
    labelPosition: "above",
  },
  {
    id: "production",
    stepNumber: "05",
    shortLabel: {
      en: "On-site checks",
      es: "Supervisión",
    },
    title: {
      en: "In-person production supervision",
      es: "Supervisión presencial de la producción",
    },
    body: {
      en: "While your Bulk Order runs, Alma and Shirish check dye batches, cutting, stitching, and finishes on the ground against your approved reference sample. We follow your order closely and keep you connected through live video calls and progress photos.",
      es: "Mientras avanza tu pedido de producción, comprobamos a pie de obra las tintadas, el corte, las costuras y los acabados frente a tu contramuestra aprobada. Seguimos tu pedido de cerca y lo ves tú también con videollamadas en directo y fotos de avance.",
    },
    video: "/videos/phases/step-05-production-checks.mp4",
    poster: "/videos/posters/step-05-production-checks.jpg",
    videoLabel: {
      en: "Artisan stitching a leather strap on a heavy-duty machine during production in India",
      es: "Artesano cosiendo una correa de piel en máquina durante un pedido de producción en la India",
    },
    x: 906,
    y: 175,
    labelPosition: "below",
  },
  {
    id: "bulk-delivery",
    stepNumber: "06",
    shortLabel: {
      en: "Export delivery",
      es: "Exportación",
    },
    title: {
      en: "Final inspection, export packing, and delivery",
      es: "Control final, embalaje de exportación y entrega",
    },
    body: {
      en: "We inspect finished pieces, sewn-in EU labels, custom cotton dust bags, numbered stretch-wrapped export cartons, and customs documents in person before your consignment ships to your business door in Spain or the rest of Europe.",
      es: "Revisamos en persona las piezas terminadas, las etiquetas cosidas europeas, las bolsas guardapolvo de algodón, las cajas de exportación numeradas y retractiladas y la documentación aduanera antes de que salga tu envío hasta la puerta de tu negocio en España o el resto de Europa.",
    },
    video: "/videos/phases/step-06-export-delivery.mp4",
    poster: "/videos/posters/step-06-export-delivery.jpg",
    videoLabel: {
      en: "Finished pieces inspected and stacked for export packing in India",
      es: "Piezas terminadas revisadas y preparadas para el embalaje de exportación en la India",
    },
    x: 1110,
    y: 95,
    labelPosition: "above",
  },
];

export const MANUFACTURING_PRE_PRODUCTION_AGREEMENTS: readonly PreProductionAgreement[] =
  [
    {
      id: "reference-sample",
      number: "01",
      title: {
        en: "Your approved physical sample and colour swatch",
        es: "Tu muestra física aprobada y tu muestra de color",
      },
      body: {
        en: "The physical sample you approve in Spain or the rest of Europe and your signed-off colour swatch stay at the Indian production site as the binding counter-sample. Before packing, we inspect finished pieces against that sample for stitching, shade, texture, hardware, and finishes.",
        es: "La muestra física que apruebas en España o el resto de Europa y tu muestra de color firmada permanecen en el punto de producción de la India como contramuestra vinculante. Antes de embalar, comprobamos las piezas terminadas frente a esa referencia en costuras, tono, textura, herrajes y acabados.",
      },
    },
    {
      id: "contracts-and-ip",
      number: "02",
      title: {
        en: "Written tolerances, Indian supplier contracts, and confidentiality",
        es: "Tolerancias escritas, contratos bajo ley india y confidencialidad con NDA",
      },
      body: {
        en: "Only Alma and Shirish review your sketches and references during evaluation, with mutual NDA and NNN agreements available. Shirish puts partner commitments, quality tolerances, and delivery dates into enforceable written contracts under Indian law.",
        es: "Durante la evaluación solo Alma y Shirish ven tus bocetos y referencias, con acuerdos mutuos NDA y NNN disponibles. Shirish recoge por escrito los compromisos de la unidad de producción, las tolerancias de calidad y las fechas de entrega en contratos vinculantes bajo legislación india.",
      },
    },
    {
      id: "documentation",
      number: "03",
      title: {
        en: "EU labelling, testing, and export documentation",
        es: "Etiquetado europeo, pruebas y documentación de exportación",
      },
      body: {
        en: "Your Product Brief locks destination rules from day one: sewn-in real leather and origin tags, textile fibre composition and care labels, REACH or lab checks where applicable, export carton packing, and customs paperwork. Getting labels and documents right before dispatch prevents customs holds and surprise repacking fees on arrival in Spain or the rest of Europe.",
        es: "Tu briefing de producto fija desde el primer día lo que exige tu destino: etiquetas cosidas de piel auténtica y origen, composición textil y símbolos de cuidado, ensayos REACH o de laboratorio cuando corresponda, embalaje de exportación y documentación aduanera. Dejarlo cerrado antes del envío evita retenciones en aduanas y costes imprevistos de reembalaje al llegar a España o al resto de Europa.",
      },
    },
    {
      id: "lead-times",
      number: "04",
      title: {
        en: "Tailored order quantities and realistic timelines",
        es: "Cantidades a medida y plazos realistas",
      },
      body: {
        en: "Because custom antique brass hardware, vegetable tanning rounds, natural textiles, and regional production-unit capacities vary widely, we do not publish fixed price lists or rigid minimums. We assess realistic quantities and seasonal launch windows openly on your first call.",
        es: "Como los herrajes de latón envejecido a medida, las rondas de curtido vegetal, los tejidos naturales y la capacidad de cada planta regional varían mucho, no publicamos tarifas cerradas ni mínimos rígidos. Valoramos contigo desde la primera llamada cantidades realistas y el calendario de tu temporada.",
      },
    },
  ];

export const MANUFACTURING_FAQS: readonly ManufacturingFaqItem[] = [
  {
    id: "product-study-without-tech-pack",
    question: {
      en: "Can I start a product study or design development without a finished tech pack?",
      es: "¿Puedo empezar un estudio de producto o un diseño sin tener una ficha técnica cerrada?",
    },
    answer: {
      en: "Yes. Many Clients in Spain and the rest of Europe start with a four-line sketch, an item already selling in their shop, or a free 15-minute video call with Alma. She sends clear written meeting conclusions straight after, mutual NDA protection is available, and we build your written Product Brief and physical sample before discussing a production run.",
      es: "Sí. Muchos clientes de España y el resto de Europa empiezan con un boceto de cuatro líneas, un artículo que ya funciona en su tienda o una videollamada gratuita de 15 minutos con Alma. Justo después recibes las conclusiones de la reunión por escrito, dispones de acuerdos mutuos NDA y preparamos tu briefing de producto y tu muestra física antes de hablar del pedido de producción.",
    },
  },
  {
    id: "product-categories-and-hubs",
    question: {
      en: "What product categories can we manufacture in India, and which Indian cities do you work in?",
      es: "¿Qué categorías fabricáis en la India y en qué ciudades trabajáis?",
    },
    answer: {
      en: "We develop and manufacture across four core categories: leather bags and other leather goods, clothing in natural and varied fabrics and capsule collections, custom sewn accessories and brand presentation, and home decor. Rather than forcing every craft into one factory, we coordinate specialist hubs across India including Kolkata, Kanpur, Agra, and Chennai, alongside garment, accessory, and home-decor production units, with supervision and quality oversight from Maharashtra.",
      es: "Desarrollamos y fabricamos cuatro categorías principales: bolsos y otros artículos de piel, prendas de diversos tejidos y colecciones cápsula, complementos confeccionados a medida con presentación de marca y decoración del hogar. En lugar de forzar todos los oficios en una sola planta, coordinamos centros especialistas de la India como Calcuta, Kanpur, Agra y Chennai, junto a unidades textiles, de complementos y de decoración del hogar por todo el país, con supervisión desde Maharashtra.",
    },
  },
  {
    id: "vetted-artisans-and-workshops",
    question: {
      en: "How do you find and vet reliable artisans and production units across India?",
      es: "¿Cómo buscáis y auditáis artesanos y unidades de producción fiables en la India?",
    },
    answer: {
      en: "We never pick facilities from online B2B directories. Alma and Shirish travel across India to audit family-run factories, leather ateliers, production units, and women artisan collectives in person, check their machinery and active stitching lines, and speak directly with the artisans making the pieces. If a site keeps its doors closed or falls short of our zero-exploitation standard, we walk away immediately.",
      es: "Nunca elegimos fábricas en directorios B2B por internet. Recorremos el país para auditar en persona fábricas de corte familiar, marroquineros, puntos de producción y colectivos de artesanas, comprobar su maquinaria y líneas activas y hablar directamente con quienes cosen las piezas. Si una instalación cierra sus puertas o incumple nuestra tolerancia cero ante la explotación, nos marchamos al momento.",
    },
  },
  {
    id: "product-design-and-ergonomics",
    question: {
      en: "Do you help with product design, ergonomics, and material sourcing?",
      es: "¿Ayudáis con el diseño de producto, la ergonomía y la búsqueda de materiales?",
    },
    answer: {
      en: "Yes. Rather than copying a rough sketch blindly, we advise upfront on how European buyers handle and wear each piece. On client collections that has meant reshaping boxy backpacks, checking strap drop, adding top grab handles, switching to high-quality Japanese plastic YKK zippers, using light cotton linings, and testing garment drape on dressmaker forms. We also source finishing details such as antique brass hardware and unbleached chemical-free recycled cardboard care hangtags.",
      es: "Sí. En lugar de copiar un boceto sin criterio, te aconsejamos desde el inicio sobre cómo manejarán y llevarán la pieza tus clientes en España y el resto de Europa. En colecciones anteriores eso ha supuesto estilizar mochilas cuadradas, ajustar la caída del asa, añadir asas superiores, pasarnos a cremalleras japonesas YKK de plástico de alta calidad, usar forros claros de algodón y revisar la caída de las prendas en maniquí. También localizamos herrajes de latón envejecido y etiquetas de cartón reciclado sin blanquear, libre de químicos.",
    },
  },
  {
    id: "colour-accuracy-and-samples",
    question: {
      en: "How do you control colour accuracy and sample quality before production begins?",
      es: "¿Cómo aseguráis el color y la calidad de la muestra antes de proceder a la producción?",
    },
    answer: {
      en: "Screen photos and video calls distort shades like tan leather or natural linen, so we tell you what is needed for each dye batch and create a physical colour swatch for your approval before dyeing begins. Alma inspects every prototype in India first, sets aside weak drafts before shipping, notes even minor refinements openly, and we never begin cutting until you hold and sign off the physical reference sample.",
      es: "Las fotos de móvil y las videollamadas distorsionan tonos como la piel tostada o el lino natural. Por eso te indicamos lo que necesitamos para cada tintada y creamos una muestra física de color para tu aprobación antes de teñir el lote. Alma revisa primero cada prototipo en la India, deja fuera cualquier borrador que no cumpla antes de enviártelo, te comenta con transparencia hasta los ajustes mínimos y nunca comenzamos con el corte de las piezas hasta que tienes en mano y apruebas la muestra física de referencia.",
    },
  },
  {
    id: "legal-and-payment-protection",
    question: {
      en: "How are my payments and designs protected when manufacturing in India?",
      es: "¿Cómo están protegidos mis pagos y mis diseños al fabricar en la India?",
    },
    answer: {
      en: "Co-founder Shirish is a registered Bar Council advocate in India who puts production-unit commitments, quality tolerances, and delivery dates into written contracts under Indian law. During evaluation, only Alma and Shirish see your designs, mutual NDA and NNN agreements are available, and production never starts without your approved physical sample in hand.",
      es: "Shirish es abogado colegiado en el Bar Council de la India y recoge los compromisos de cada fabricante, las especificaciones y las fechas de entrega en contratos por escrito bajo legislación india. Durante la valoración solo Alma y Shirish ven tus diseños, puedes firmar acuerdos mutuos NDA y NNN y nunca procedemos a la producción sin tu muestra física previamente revisada y aprobada por ti.",
    },
  },
  {
    id: "moq-and-pricing",
    question: {
      en: "What are your minimum order quantities and how is pricing structured?",
      es: "¿Cuáles son las cantidades mínimas y cómo se plantean los presupuestos?",
    },
    answer: {
      en: "Every Manufacturing Programme is scoped individually from your Product Brief after an initial call. Because leather constructions, natural and varied fabrics, custom hardware, home decor specifications, and regional production-unit capacities vary widely, we do not publish fixed price lists or rigid minimums. We work with independent boutiques launching a first own-brand capsule as well as established retail chains placing larger repeat Bulk Orders.",
      es: "Cada Programa de producción se estudia a medida a partir de tu briefing de producto tras una primera llamada. Como las construcciones en piel, los tejidos naturales y variados, los herrajes a medida, las piezas de decoración del hogar y la capacidad de cada planta cambian mucho, no publicamos tarifas fijas ni mínimos rígidos. Trabajamos tanto con comercios independientes que lanzan su primera cápsula como con cadenas consolidadas que repiten pedidos de producción más amplios.",
    },
  },
  {
    id: "eu-labelling-and-export",
    question: {
      en: "Do you handle EU labelling, export packing, and customs delivery to Spain and the rest of Europe?",
      es: "¿Os encargáis del etiquetado europeo, el embalaje de exportación y la entrega en España y el resto de Europa?",
    },
    answer: {
      en: "Yes. Sewn-in EU leather and fibre labels, care tags, custom cotton dust bags, numbered stretch-wrapped export cartons, and customs paperwork are planned in your proposal from the start so your order arrives at your business door ready for your shop window or warehouse.",
      es: "Sí. Las etiquetas cosidas europeas de piel y composición textil, las etiquetas de cuidado, las bolsas guardapolvo de algodón a medida, las cajas de exportación numeradas y retractiladas y la documentación aduanera quedan planificadas en tu propuesta desde el principio para que el pedido llegue a la puerta de tu negocio listo para el escaparate o el almacén.",
    },
  },
  {
    id: "languages-and-visits",
    question: {
      en: "What languages can we work in, and can European Clients visit production in India?",
      es: "¿En qué idiomas podemos trabajar y pueden los clientes europeos visitar la producción en la India?",
    },
    answer: {
      en: "Alma works directly with Clients in Spain and the rest of Europe in Spanish, English, and Portuguese. On the ground in India, we coordinate in English, Hindi, and Marathi. In-person visits to production sites in India can be arranged around active Manufacturing Programmes.",
      es: "Alma trabaja directamente con clientes de España y el resto de Europa en español, inglés y portugués. Sobre el terreno en la India nos coordinamos en inglés, hindi y maratí. También se pueden organizar visitas presenciales a los puntos de producción cuando hay un Programa de producción en marcha.",
    },
  },
];
