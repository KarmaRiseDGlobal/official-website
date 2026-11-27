import type { ClosingConversationCopy } from "@/components/home/closing-conversation-section";
import type { SiteLanguage } from "@/lib/urls";

export type ProductStudyPillarId =
  | "ergonomics-and-design"
  | "material-and-cluster-feasibility"
  | "written-brief-and-colour-swatch"
  | "eu-presentation-and-compliance";

export interface ProductStudyPillar {
  readonly id: ProductStudyPillarId;
  readonly number: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
}

export type CategoryDepthPlane =
  "front" | "mid-left" | "mid-right" | "back-left";

export interface CategoryShowcaseItem {
  readonly id: string;
  readonly plane: CategoryDepthPlane;
  readonly name: Record<SiteLanguage, string>;
  readonly shortLabel: Record<SiteLanguage, string>;
  readonly tooltip: Record<SiteLanguage, string>;
  readonly description: Record<SiteLanguage, string>;
  readonly specs: readonly Record<SiteLanguage, string>[];
  readonly image: string;
  readonly imageAlt: Record<SiteLanguage, string>;
}

export interface ManufacturingCategory {
  readonly id: string;
  readonly querySlug:
    "bags" | "garments" | "textile-accessories" | "home-decor";
  readonly number: string;
  readonly jumpLabel: Record<SiteLanguage, string>;
  readonly name: Record<SiteLanguage, string>;
  readonly showcaseSummary: Record<SiteLanguage, string>;
  readonly showcaseProof: Record<SiteLanguage, string>;
  readonly summary: Record<SiteLanguage, string>;
  readonly details: Record<SiteLanguage, string>;
  readonly tableMaterials: Record<SiteLanguage, string>;
  readonly tableRegions: Record<SiteLanguage, string>;
  readonly tableVerification: Record<SiteLanguage, string>;
  readonly ctaLabel: Record<SiteLanguage, string>;
  readonly ctaMicrocopy: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imageAlt: Record<SiteLanguage, string>;
  readonly imagePosition?: string;
  readonly items: readonly CategoryShowcaseItem[];
}

export interface WorkshopCriterion {
  readonly id: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
}

export type ManufacturingStageId =
  | "product-brief"
  | "product-study-match"
  | "sample-approval"
  | "materials-contracts"
  | "production"
  | "bulk-delivery";

export interface ManufacturingStage {
  readonly id: ManufacturingStageId;
  readonly stepNumber: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
  readonly signOff: Record<SiteLanguage, string>;
  readonly video: string;
  readonly poster: string;
  readonly mediaLabel: Record<SiteLanguage, string>;
}

export interface PreProductionAgreement {
  readonly id: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
}

export interface ManufacturingFaqItem {
  readonly id: string;
  readonly question: Record<SiteLanguage, string>;
  readonly answer: Record<SiteLanguage, string>;
}

export const MANUFACTURING_LAST_REVIEWED = {
  iso: "2026-11-27",
  en: "27 November 2026",
  es: "27 de noviembre de 2026",
} as const;

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
        en: "We check strap drop, bag weight, pocket placement, hardware, and garment drape for European shoppers. From a four-line sketch, we refine silhouette, fit high-quality Japanese plastic YKK zippers that spare hands and coats, and pair light cotton linings so keys stay easy to find.",
        es: "Revisamos la caída del asa, el peso, los bolsillos, los herrajes y la caída de cada prenda pensando en quien la lleva a diario. Desde un boceto de cuatro líneas afinamos el corte, montamos cremalleras japonesas YKK de plástico de alta calidad y elegimos forros claros de algodón.",
      },
    },
    {
      id: "material-and-cluster-feasibility",
      number: "02",
      title: {
        en: "Material and regional feasibility across India",
        es: "Materiales y viabilidad por polos artesanos",
      },
      body: {
        en: "Before you spend on prototypes, we verify in person which Indian city holds the hides, fabrics, and machinery your design needs. We coordinate specialist makers across Kolkata, Kanpur, Agra, and Chennai with quality oversight led from Maharashtra.",
        es: "Antes de invertir en prototipos, comprobamos en persona qué polo artesano de la India reúne la piel, el tejido y la maquinaria que pide tu diseño. Coordinamos especialistas en Calcuta, Kanpur, Agra y Chennai con supervisión desde Maharashtra.",
      },
    },
    {
      id: "written-brief-and-colour-swatch",
      number: "03",
      title: {
        en: "Written notes and physical colour swatch",
        es: "Conclusiones por escrito y muestra física de color",
      },
      body: {
        en: "Alma sends clear meeting notes straight after every call so every detail stays agreed. Because screens distort leather and linen shades, we prepare a physical colour swatch for your approval before dyeing begins.",
        es: "Alma envía por escrito las conclusiones de la reunión tras cada llamada para que cada detalle quede acordado. Como las pantallas alteran los tonos de piel y lino, preparamos una muestra física de color para tu aprobación antes de teñir.",
      },
    },
    {
      id: "eu-presentation-and-compliance",
      number: "04",
      title: {
        en: "EU labelling, packaging, and customs from day one",
        es: "Etiquetado europeo, presentación y aduanas",
      },
      body: {
        en: "Items entering Spain and the rest of Europe need accurate fibre tags, leather origin markings, and export paperwork. Planning woven brand labels, cotton dust bags, unbleached chemical-free recycled cardboard hangtags, and packing early prevents customs delays.",
        es: "Las piezas que entran en España y el resto de Europa exigen etiquetas de composición, marcajes de origen y papeles de aduanas. Dejar cerradas desde el inicio tus etiquetas tejidas, bolsas guardapolvo de algodón y etiquetas de cartón reciclado sin blanquear, libre de químicos, evita retrasos.",
      },
    },
  ];

export const MANUFACTURING_CATEGORIES: readonly ManufacturingCategory[] = [
  {
    id: "bags",
    querySlug: "bags",
    number: "01",
    jumpLabel: {
      en: "Leather goods",
      es: "Bolsos y piel",
    },
    name: {
      en: "Leather goods",
      es: "Bolsos y artículos de piel",
    },
    showcaseSummary: {
      en: "Relaxed yet refined hobo bags, everyday backpacks, small crossbodies, makeup pouches, wallets, belts, and travel bags made with Indian tanneries and leather ateliers.",
      es: "Bolsos hobo actuales, mochilas urbanas, bandoleras pequeñas, estuches, carteras, cinturones y bolsas de viaje hechos con curtidurías y marroquinerías indias.",
    },
    showcaseProof: {
      en: "Physical colour swatch and reviewed sample in hand before cutting starts.",
      es: "Muestra física de color y muestra para valoración en mano antes de cortar.",
    },
    summary: {
      en: "Contemporary leather goods that feel relaxed yet polished for European daily wear: hobo bags, stylish everyday backpacks, small crossbodies, wallets, makeup and lipstick pouches, belts, and travel bags crafted across Kolkata, Kanpur, Agra, and Chennai.",
      es: "Marroquinería actual, informal y cuidada para el día a día en Europa: bolsos hobo, mochilas urbanas, bandoleras pequeñas, carteras, estuches de maquillaje y labial, cinturones y bolsas de viaje hechos en Calcuta, Kanpur, Agra y Chennai.",
    },
    details: {
      en: "Supple vegetable-tanned hides, brushed antique brass hardware, high-quality Japanese plastic YKK zippers, light cotton linings, and well-balanced strap drop built for effortless everyday use.",
      es: "Pieles suaves de curtido vegetal, herrajes de latón envejecido, cremalleras japonesas YKK de plástico de alta calidad, forros claros de algodón y caída del asa pensada para el uso diario.",
    },
    tableMaterials: {
      en: "Supple vegetable-tanned hides, light cotton linings, brushed antique brass hardware, high-quality Japanese plastic YKK zippers",
      es: "Piel suave de curtido vegetal, forros claros de algodón, herrajes de latón envejecido y cremalleras japonesas YKK de plástico de alta calidad",
    },
    tableRegions: {
      en: "Tanneries, leather ateliers, and production units in Kolkata, Kanpur, Agra, and Chennai; quality oversight from Maharashtra",
      es: "Curtidurías, marroquineros y unidades de producción en Calcuta, Kanpur, Agra y Chennai; supervisión desde Maharashtra",
    },
    tableVerification: {
      en: "Physical colour swatch approved by you, strap drop and zipper ergonomics check, reviewed physical sample in hand",
      es: "Muestra física de color aprobada por ti, revisión de caída del asa y cremalleras, muestra para valoración en mano",
    },
    ctaLabel: {
      en: "Share your leather goods idea",
      es: "Cuéntanos tu idea de piel",
    },
    ctaMicrocopy: {
      en: "Opens your brief in the leather goods category. No tech pack needed.",
      es: "Abre el briefing en artículos de piel. Sin ficha técnica previa.",
    },
    image: "/images/workshops/alma-black-leather-tote-inspection.jpeg",
    imagePosition: "50% 22%",
    imageAlt: {
      en: "Alma holding a finished black leather bag inside the sample room of a vetted Indian leather production unit",
      es: "Alma sosteniendo un bolso terminado de piel negra en la sala de muestras de una unidad de producción marroquinera auditada en la India",
    },
    items: [
      {
        id: "leather-hobo-bag",
        plane: "front",
        shortLabel: { en: "Hobo bags", es: "Bolsos hobo" },
        name: {
          en: "Slouchy leather hobo bags",
          es: "Bolsos hobo de piel",
        },
        tooltip: {
          en: "Relaxed everyday crescent drape in supple vegetable-tanned hide.",
          es: "Caída suave y actual en piel de curtido vegetal para el día a día.",
        },
        description: {
          en: "Soft, informal shoulder bags with sculpted strap drop, light cotton lining, and understated hardware sized for European everyday wear.",
          es: "Bolsos hobo informales y cuidados con caída del asa cómoda, forro claro de algodón y herrajes discretos para diario.",
        },
        specs: [
          { en: "Supple pebbled hide", es: "Piel suave graneada" },
          { en: "Balanced strap drop", es: "Caída del asa cómoda" },
        ],
        image: "/images/categories-3d/leather/hobo-bag.webp",
        imageAlt: {
          en: "Illustrative 3D render of a contemporary slouchy caramel leather hobo bag with wide shoulder strap",
          es: "Ilustración 3D de un bolso hobo actual de piel caramelo suave con asa ancha al hombro",
        },
      },
      {
        id: "everyday-leather-backpack",
        plane: "mid-left",
        shortLabel: { en: "Everyday backpacks", es: "Mochilas urbanas" },
        name: {
          en: "Stylish everyday backpacks",
          es: "Mochilas urbanas de piel",
        },
        tooltip: {
          en: "Streamlined modern leather backpacks with top grab handle and YKK zips.",
          es: "Mochilas estilizadas en piel con asa superior y cremalleras YKK suaves.",
        },
        description: {
          en: "Clean curved profiles that balance daily practicality with quiet polish, fitted with smooth high-quality Japanese plastic YKK zippers.",
          es: "Siluetas curvas y ligeras que unen comodidad diaria y acabado cuidado con cremalleras japonesas YKK de plástico de alta calidad.",
        },
        specs: [
          { en: "Refined dome profile", es: "Perfil urbano limpio" },
          { en: "Japanese plastic YKK zips", es: "Cremalleras YKK suaves" },
        ],
        image: "/images/categories-3d/leather/everyday-backpack.webp",
        imageAlt: {
          en: "Illustrative 3D render of a sleek contemporary espresso leather everyday backpack",
          es: "Ilustración 3D de una mochila urbana actual en piel color café espresso",
        },
      },
      {
        id: "small-leather-crossbody",
        plane: "back-left",
        shortLabel: { en: "Small crossbodies", es: "Bandoleras pequeñas" },
        name: {
          en: "Small crossbody bags",
          es: "Bandoleras pequeñas de piel",
        },
        tooltip: {
          en: "Compact hands-free silhouettes that stay relaxed yet polished.",
          es: "Formatos compactos manos libres con aire informal y elegante.",
        },
        description: {
          en: "Compact half-moon and softly structured crossbody shapes sized for phone, keys, and daily essentials without excess weight.",
          es: "Bandoleras pequeñas de líneas limpias pensadas para llevar móvil, llaves y lo esencial con ligereza.",
        },
        specs: [
          { en: "Lightweight daily size", es: "Tamaño ligero de diario" },
          { en: "Adjustable slim strap", es: "Correa fina regulable" },
        ],
        image: "/images/categories-3d/leather/small-crossbody.webp",
        imageAlt: {
          en: "Illustrative 3D render of a small contemporary warm taupe half-moon leather crossbody bag",
          es: "Ilustración 3D de una bandolera pequeña actual de piel topo cálido en forma de media luna",
        },
      },
      {
        id: "leather-pouches-wallets",
        plane: "mid-right",
        shortLabel: { en: "Pouches & wallets", es: "Estuches y carteras" },
        name: {
          en: "Pouches, wallets & travel goods",
          es: "Estuches, carteras y viaje",
        },
        tooltip: {
          en: "Makeup and lipstick pouches, slim wallets, belts, and weekend travel bags.",
          es: "Neceseres de maquillaje, fundas de labial, carteras, cinturones y bolsas de viaje.",
        },
        description: {
          en: "Small zip pouches for makeup or lipstick inside an everyday bag, paired with slim card wallets, belts, and coordinated leather travel bags.",
          es: "Estuches pequeños para maquillaje o labial dentro del bolso diario, junto a carteras finas, cinturones y bolsas de viaje en piel.",
        },
        specs: [
          {
            en: "Makeup & lipstick pouches",
            es: "Estuches de maquillaje y labial",
          },
          {
            en: "Wallets, belts & travel bags",
            es: "Carteras, cinturones y viaje",
          },
        ],
        image: "/images/categories-3d/leather/pouches-wallets.webp",
        imageAlt: {
          en: "Illustrative 3D render of a terracotta leather makeup pouch, tan lipstick pouch, and olive card wallet",
          es: "Ilustración 3D de un estuche de maquillaje en piel terracota, una funda de labial tostada y una cartera fina oliva",
        },
      },
    ],
  },
  {
    id: "garments",
    querySlug: "garments",
    number: "02",
    jumpLabel: {
      en: "Clothing",
      es: "Ropa",
    },
    name: {
      en: "Clothing",
      es: "Ropa y prendas",
    },
    showcaseSummary: {
      en: "Cotton and linen midi dresses and skirts, distinctive denim pieces, blouses, jumpsuits, and outerwear made with family-run garment makers and women artisan collectives.",
      es: "Vestidos y faldas midi en algodón y lino, piezas singulares en denim, blusas, monos y prendas exteriores con confeccionistas familiares y colectivos de artesanas.",
    },
    showcaseProof: {
      en: "Drape checked on dressmaker forms with sewn-in EU fibre labels.",
      es: "Caída revisada en maniquí con etiquetas europeas de composición.",
    },
    summary: {
      en: "Contemporary women's clothing collections in breathable cotton, linen, and distinctive denim: midi dresses and skirts, unique denim pieces, blouses, jumpsuits, and outerwear jackets stitched by audited family-run production units and women artisan collectives.",
      es: "Colecciones actuales en algodón, lino transpirable y denim singular: vestidos y faldas midi, prendas únicas de denim, blusas, monos y chaquetas confeccionados con unidades familiares y colectivos de artesanas auditados.",
    },
    details: {
      en: "Physical dye swatches, dressmaker-form fit checks, clean seam finishing, and sewn-in EU composition and care labels ready for European boutiques.",
      es: "Muestras físicas de color, pruebas de caída en maniquí, costuras cuidadas y etiquetas europeas cosidas de composición y cuidado.",
    },
    tableMaterials: {
      en: "Breathable cotton, slub linen, raw and washed denim, natural horn and mother-of-pearl buttons, sewn-in EU labels",
      es: "Algodón transpirable, lino natural, denim crudo y lavado, botones naturales y etiquetas europeas cosidas",
    },
    tableRegions: {
      en: "Vetted family-run garment makers, denim specialists, and women artisan collectives across India; supervision from Maharashtra",
      es: "Confeccionistas familiares, especialistas en denim y colectivos de artesanas en la India; supervisión desde Maharashtra",
    },
    tableVerification: {
      en: "Physical fabric and dye swatch approval, dressmaker-form fit review, reviewed garment sample before cutting",
      es: "Aprobación de muestra física de tejido y color, ajuste en maniquí y muestra física revisada antes de cortar",
    },
    ctaLabel: {
      en: "Share your clothing idea",
      es: "Cuéntanos tu idea de colección",
    },
    ctaMicrocopy: {
      en: "Opens your brief in the clothing category. No tech pack needed.",
      es: "Abre el briefing en la categoría de ropa. Sin ficha técnica previa.",
    },
    image: "/images/almarise/almarise-saree-design-review.jpeg",
    imagePosition: "52% 28%",
    imageAlt: {
      en: "Alma reviewing fabric drape and garment proportions on a dressmaker form in India",
      es: "Alma revisando la caída de un tejido y el corte sobre un maniquí en nuestro estudio en la India",
    },
    items: [
      {
        id: "cotton-linen-midi-dress",
        plane: "front",
        shortLabel: {
          en: "Midi dresses & skirts",
          es: "Vestidos y faldas midi",
        },
        name: {
          en: "Cotton & linen midi dresses and skirts",
          es: "Vestidos y faldas midi en algodón y lino",
        },
        tooltip: {
          en: "Breathable cotton and linen midi dresses and skirts with clean fluid drape.",
          es: "Vestidos y faldas midi en algodón y lino transpirables con caída fluida.",
        },
        description: {
          en: "Effortless European summer silhouettes in washed cotton and slub linen with clean necklines, deep side pockets, and relaxed movement.",
          es: "Siluetas actuales en algodón lavado y lino natural con escotes limpios, bolsillos laterales y movimiento ligero.",
        },
        specs: [
          { en: "Cotton & slub linen", es: "Algodón y lino natural" },
          { en: "Clean summer drape", es: "Caída fresca de verano" },
        ],
        image: "/images/categories-3d/clothing/midi-dress.webp",
        imageAlt: {
          en: "Illustrative 3D render of a contemporary terracotta-clay linen A-line midi dress",
          es: "Ilustración 3D de un vestido midi actual en lino color terracota",
        },
      },
      {
        id: "unique-denim-outerwear",
        plane: "back-left",
        shortLabel: { en: "Denim & outerwear", es: "Denim y chaquetas" },
        name: {
          en: "Unique denim pieces & outerwear",
          es: "Piezas singulares en denim y chaquetas",
        },
        tooltip: {
          en: "Sculptural denim jackets and distinctive separates with crisp topstitching.",
          es: "Chaquetas y piezas singulares en denim con pespunte marcado y corte actual.",
        },
        description: {
          en: "Characterful raw and washed denim jackets and separates with contrast stitching, curved sleeve geometry, and refined natural buttons.",
          es: "Prendas exteriores y piezas especiales en denim índigo o lavado con pespunte visto, mangas con forma y botones naturales.",
        },
        specs: [
          { en: "Distinctive denim washes", es: "Lavados cuidados en denim" },
          { en: "Tailored outerwear cuts", es: "Cortes actuales de chaqueta" },
        ],
        image: "/images/categories-3d/clothing/denim-jacket.webp",
        imageAlt: {
          en: "Illustrative 3D render of a sculptural indigo cropped denim outerwear jacket with cream topstitching",
          es: "Ilustración 3D de una chaqueta actual en denim índigo con pespunte crudo",
        },
      },
      {
        id: "cotton-linen-blouse",
        plane: "mid-left",
        shortLabel: { en: "Blouses", es: "Blusas" },
        name: {
          en: "Cotton & linen blouses",
          es: "Blusas de algodón y lino",
        },
        tooltip: {
          en: "Airy cotton and linen blouses with clean collars and soft sleeve volume.",
          es: "Blusas frescas en algodón y lino con cuellos limpios y volumen suave.",
        },
        description: {
          en: "Breathable everyday blouses featuring neat band collars, delicate sleeve tucks, and natural mother-of-pearl buttons.",
          es: "Blusas ligeras para diario con cuello limpio, mangas con pliegues suaves y botones naturales de nácar.",
        },
        specs: [
          { en: "Airy voile & slub linen", es: "Algodón ligero y lino" },
          { en: "Mother-of-pearl buttons", es: "Botones de nácar natural" },
        ],
        image: "/images/categories-3d/clothing/linen-blouse.webp",
        imageAlt: {
          en: "Illustrative 3D render of a contemporary ivory cotton-linen blouse with softly pleated sleeves",
          es: "Ilustración 3D de una blusa actual en algodón y lino color crudo con mangas suaves",
        },
      },
      {
        id: "linen-jumpsuit",
        plane: "mid-right",
        shortLabel: { en: "Jumpsuits", es: "Monos" },
        name: {
          en: "Tailored linen jumpsuits",
          es: "Monos de lino y algodón",
        },
        tooltip: {
          en: "Fluid wide-leg belted jumpsuits cut for comfort from morning to dinner.",
          es: "Monos fluidos de pierna recta con cinturón pensados para llevar todo el día.",
        },
        description: {
          en: "Clean wide-leg jumpsuits in breathable olive, ecru, or sand linen with tonal waist ties and relaxed tailored structure.",
          es: "Monos de corte limpio en lino transpirable con lazada al tono y caída fluida para diario o cenas.",
        },
        specs: [
          { en: "Fluid wide-leg fit", es: "Corte recto y fluido" },
          { en: "Breathable natural linen", es: "Lino natural transpirable" },
        ],
        image: "/images/categories-3d/clothing/linen-jumpsuit.webp",
        imageAlt: {
          en: "Illustrative 3D render of a contemporary muted olive-sage belted wide-leg linen jumpsuit",
          es: "Ilustración 3D de un mono actual de lino verde salvia con cinturón y pierna recta",
        },
      },
    ],
  },
  {
    id: "textile-accessories",
    querySlug: "textile-accessories",
    number: "03",
    jumpLabel: {
      en: "Textile accessories",
      es: "Complementos textiles",
    },
    name: {
      en: "Textile accessories",
      es: "Complementos textiles",
    },
    showcaseSummary: {
      en: "Pashminas, scarves, thick canvas and quilted totes, embroidered clutches, toiletry cases, padded headbands, sashes, and fabric sleeves crafted with Indian textile makers.",
      es: "Pashminas, pañuelos, totes de loneta y bolsos acolchados, clutches bordados, neceseres de viaje, diademas, fajines y fundas textiles hechos con especialistas de la India.",
    },
    showcaseProof: {
      en: "Natural weaves, clean quilting, and embroidery matched to your palette.",
      es: "Tejidos naturales, acolchados limpios y bordados en tu paleta.",
    },
    summary: {
      en: "Wearable and everyday textile accessories and add-ons made across specialist Indian weaving, quilting, and embroidery units: pashminas, scarves, shawls, thick cotton canvas and linen tote bags, quilted bags, embroidered evening clutches, toiletry bags and travel cases, padded headbands, turban headwraps, hair scrunchies, braided or embroidered fabric belts, kimono or obi sashes, and fabric sleeves for laptops, books, or eyeglasses.",
      es: "Complementos textiles de uso diario y ocasiones especiales elaborados en unidades indias de telar, acolchado y bordado: pashminas, pañuelos, chales, totes de loneta gruesa y lino, bolsos acolchados, clutches y bolsos de noche bordados, neceseres de viaje, diademas con volumen, turbantes, coleteros, cinturones textiles trenzados o bordados, fajines estilo kimono u obi y fundas para portátil, libros o gafas.",
    },
    details: {
      en: "Thick cotton canvas, linen, fine woven pashminas, soft cotton quilting, refined embroidery, and smooth zippers checked piece by piece before export.",
      es: "Loneta gruesa de algodón, lino, pashminas finas, acolchados suaves, bordado cuidado y cremalleras revisadas pieza a pieza antes de exportar.",
    },
    tableMaterials: {
      en: "Pashmina weaves, thick cotton canvas, linen, quilted cotton, silk-linen embroidery, braided trims",
      es: "Pashmina tejida, loneta gruesa de algodón, lino, algodón acolchado, bordado en seda-lino y trenzados",
    },
    tableRegions: {
      en: "Specialist Indian weaving, quilting, embroidery, and textile sewing units; quality oversight from Maharashtra",
      es: "Unidades indias especializadas en telar, acolchado, bordado y confección textil; supervisión desde Maharashtra",
    },
    tableVerification: {
      en: "Fabric weight and dye swatch check, embroidery and quilting review on physical samples before production",
      es: "Control de gramaje y muestra física de color, revisión de bordado y acolchado en muestra antes de producir",
    },
    ctaLabel: {
      en: "Share your textile accessories idea",
      es: "Cuéntanos tu idea de complementos",
    },
    ctaMicrocopy: {
      en: "Opens your brief in textile accessories. No tech pack needed.",
      es: "Abre el briefing en complementos textiles. Sin ficha técnica previa.",
    },
    image: "/images/capabilities/textile-accessories.jpg",
    imagePosition: "50% 50%",
    imageAlt: {
      en: "Woven pashmina scarf, quilted cotton-linen tote bag, embroidered evening clutch, and padded linen headband on a sunlit stone table",
      es: "Pashmina tejida, tote acolchado de algodón y lino, clutch bordado y diadema de lino sobre una mesa de piedra soleada",
    },
    items: [
      {
        id: "quilted-canvas-tote",
        plane: "front",
        shortLabel: { en: "Canvas & quilted totes", es: "Totes y acolchados" },
        name: {
          en: "Canvas, linen & quilted tote bags",
          es: "Totes de loneta, lino y bolsos acolchados",
        },
        tooltip: {
          en: "Thick cotton canvas, linen totes, and soft quilted bags for daily errands.",
          es: "Totes en loneta gruesa o lino y bolsos acolchados suaves para diario.",
        },
        description: {
          en: "Generous everyday totes in heavy cotton canvas, slub linen, or lightly padded cotton quilting with sturdy flat straps.",
          es: "Bolsos tote amplios en loneta gruesa de algodón, lino natural o algodón acolchado con asas cómodas.",
        },
        specs: [
          { en: "Thick canvas & linen", es: "Loneta gruesa y lino" },
          { en: "Soft quilted construction", es: "Acolchado suave" },
        ],
        image: "/images/categories-3d/textile-accessories/quilted-tote.webp",
        imageAlt: {
          en: "Illustrative 3D render of a contemporary cream quilted cotton-linen everyday tote bag",
          es: "Ilustración 3D de un tote actual acolchado de algodón y lino en tono crema",
        },
      },
      {
        id: "pashminas-scarves-shawls",
        plane: "back-left",
        shortLabel: { en: "Pashminas & scarves", es: "Pashminas y pañuelos" },
        name: {
          en: "Pashminas, scarves, shawls & sashes",
          es: "Pashminas, pañuelos, chales y fajines",
        },
        tooltip: {
          en: "Fine woven pashminas, light scarves, shawls, and kimono or obi sashes.",
          es: "Pashminas tejidas, pañuelos ligeros, chales y fajines estilo kimono u obi.",
        },
        description: {
          en: "Airy pashminas, draped scarves, generous shawls, braided fabric belts, and kimono-style obi sashes dyed to physical swatches.",
          es: "Pashminas ligeras, pañuelos, chales amplios, cinturones textiles trenzados y fajines estilo obi teñidos según muestra física.",
        },
        specs: [
          { en: "Fine natural weaves", es: "Tejidos finos naturales" },
          { en: "Obi sashes & fabric belts", es: "Fajines obi y cinturones" },
        ],
        image: "/images/categories-3d/textile-accessories/pashmina-scarf.webp",
        imageAlt: {
          en: "Illustrative 3D render of a softly draped camel and terracotta woven pashmina shawl with fine fringe",
          es: "Ilustración 3D de una pashmina tejida en tonos camel y terracota con flecos finos",
        },
      },
      {
        id: "toiletry-hair-accessories",
        plane: "mid-left",
        shortLabel: { en: "Toiletry & hair", es: "Neceseres y pelo" },
        name: {
          en: "Toiletry cases & hair accessories",
          es: "Neceseres de viaje y accesorios de pelo",
        },
        tooltip: {
          en: "Toiletry travel cases, padded headbands, turban headwraps, and scrunchies.",
          es: "Neceseres de viaje, diademas con volumen, turbantes y coleteros textiles.",
        },
        description: {
          en: "Quilted travel toiletry bags paired with padded headbands, turban-style headwraps, elastic hair bands, and fabric scrunchies.",
          es: "Neceseres acolchados para viaje junto a diademas con volumen, turbantes, cintas elásticas y coleteros en tejidos naturales.",
        },
        specs: [
          { en: "Quilted travel cases", es: "Neceseres acolchados" },
          { en: "Headbands & scrunchies", es: "Diademas y coleteros" },
        ],
        image:
          "/images/categories-3d/textile-accessories/toiletry-headband.webp",
        imageAlt: {
          en: "Illustrative 3D render of a quilted cream striped cotton toiletry bag beside a sage padded headband and scrunchie",
          es: "Ilustración 3D de un neceser acolchado de rayas junto a una diadema verde salvia y un coletero",
        },
      },
      {
        id: "embroidered-clutches-sleeves",
        plane: "mid-right",
        shortLabel: { en: "Clutches & sleeves", es: "Clutches y fundas" },
        name: {
          en: "Embroidered clutches & fabric sleeves",
          es: "Clutches bordados y fundas textiles",
        },
        tooltip: {
          en: "Evening clutches plus padded fabric sleeves for laptops, books, or glasses.",
          es: "Clutches bordados de noche y fundas textiles para portátil, libros o gafas.",
        },
        description: {
          en: "Sleek embroidered evening clutches alongside protective padded textile sleeves tailored for laptops, notebooks, and eyeglasses.",
          es: "Clutches y bolsos de noche bordados junto a fundas acolchadas a medida para portátil, libros o gafas.",
        },
        specs: [
          { en: "Modern thread embroidery", es: "Bordado actual en hilo" },
          {
            en: "Laptop, book & glass sleeves",
            es: "Fundas de portátil, libro y gafas",
          },
        ],
        image:
          "/images/categories-3d/textile-accessories/embroidered-clutch.webp",
        imageAlt: {
          en: "Illustrative 3D render of a sleek deep forest-green silk-linen embroidered evening clutch",
          es: "Ilustración 3D de un clutch de noche en seda-lino verde bosque con bordado botánico",
        },
      },
    ],
  },
  {
    id: "home-decor",
    querySlug: "home-decor",
    number: "04",
    jumpLabel: {
      en: "Textile home decor",
      es: "Decoración textil",
    },
    name: {
      en: "Textile home decor",
      es: "Decoración textil del hogar",
    },
    showcaseSummary: {
      en: "Cushion covers, wall hangings, Kantha-style bedspreads, recycled-cotton flat-weave dhurries, table runners, tablecloths, and placemats loomed by Indian textile weavers.",
      es: "Fundas de cojín, tapices de pared, colchas estilo Kantha, alfombras dhurrie de algodón reciclado, caminos de mesa, manteles e individuales de tejedores indios.",
    },
    showcaseProof: {
      en: "Physical weave and dye swatches approved in daylight before production.",
      es: "Muestras físicas de tejido y color aprobadas a luz natural.",
    },
    summary: {
      en: "Own-brand textile home decor produced with audited Indian weaving units and women artisan collectives: cushion covers, wall hangings, Kantha-style bedspreads, flat-weave rugs (dhurries) made from recycled cotton, table runners, tablecloths, and placemats.",
      es: "Decoración textil del hogar con tu marca producida con unidades textiles y colectivos de artesanas auditados en la India: fundas de cojín, tapices de pared, colchas estilo Kantha, alfombras dhurrie de algodón reciclado, caminos de mesa, manteles e individuales.",
    },
    details: {
      en: "Recycled cotton yarn, hand-stitched Kantha quilting, breathable slub linen, natural dyes, and sewn-in EU fibre and care labels ready for retail display.",
      es: "Algodón reciclado, pespunte Kantha a mano, lino natural, tintes cuidados y etiquetas europeas de composición y cuidado listas para tienda.",
    },
    tableMaterials: {
      en: "Recycled cotton yarn, slub linen, hand-stitched Kantha cotton layers, hidden zippers, sewn-in EU care labels",
      es: "Hilo de algodón reciclado, lino natural, algodón estilo Kantha pespunteado a mano y etiquetas europeas cosidas",
    },
    tableRegions: {
      en: "Specialist Indian handloom, dhurrie-weaving, and home-textile production units and artisan collectives; supervision from Maharashtra",
      es: "Unidades textiles, tejedores de dhurries y colectivos de artesanas en la India; supervisión desde Maharashtra",
    },
    tableVerification: {
      en: "Daylight weave and colour swatch approval, wash shrinkage and stitch check on physical samples before dispatch",
      es: "Aprobación de tejido y color a luz natural, prueba de lavado y control de remates en muestra antes del envío",
    },
    ctaLabel: {
      en: "Share your textile decor idea",
      es: "Cuéntanos tu idea de decoración textil",
    },
    ctaMicrocopy: {
      en: "Opens your brief in textile home decor. No tech pack needed.",
      es: "Abre el briefing en decoración textil del hogar. Sin ficha técnica previa.",
    },
    image: "/images/culture/maharashtra-handloom-zari-border.jpg",
    imagePosition: "50% 50%",
    imageAlt: {
      en: "Artisan hands weaving a gold and crimson patterned cloth border on a wooden handloom with wooden shuttles beside skeins of natural yarn",
      es: "Manos artesanas tejiendo una cenefa dorada y carmesí en un telar de madera con lanzaderas junto a madejas de hilo natural",
    },
    items: [
      {
        id: "kantha-bedspreads",
        plane: "front",
        shortLabel: { en: "Kantha bedspreads", es: "Colchas Kantha" },
        name: {
          en: "Kantha-style bedspreads",
          es: "Colchas estilo Kantha",
        },
        tooltip: {
          en: "Layered cotton bedspreads and throws finished with fine Kantha running stitch.",
          es: "Colchas y plaids de algodón en capas con fino pespunte estilo Kantha.",
        },
        description: {
          en: "Reversible cotton bedspreads and throws quilted with tonal hand-stitched Kantha lines for soft, breathable weight across seasons.",
          es: "Colchas y plaids reversibles de algodón con finas líneas de pespunte Kantha al tono, suaves y transpirables todo el año.",
        },
        specs: [
          { en: "Hand-stitched Kantha lines", es: "Pespunte Kantha a mano" },
          {
            en: "Reversible layered cotton",
            es: "Algodón reversible en capas",
          },
        ],
        image: "/images/categories-3d/home-decor/kantha-bedspread.webp",
        imageAlt: {
          en: "Illustrative 3D render of a folded ecru and muted terracotta Kantha-style stitched cotton bedspread",
          es: "Ilustración 3D de una colcha de algodón estilo Kantha doblada en tonos crudo y terracota",
        },
      },
      {
        id: "cushion-covers-wall-hangings",
        plane: "back-left",
        shortLabel: { en: "Cushions & wall hangings", es: "Cojines y tapices" },
        name: {
          en: "Cushion covers & wall hangings",
          es: "Fundas de cojín y tapices",
        },
        tooltip: {
          en: "Textured linen and cotton cushion covers plus woven textile wall hangings.",
          es: "Fundas de cojín en lino y algodón con textura y tapices textiles de pared.",
        },
        description: {
          en: "Tactile square and lumbar cushion covers with clean flange seams and hidden zips, alongside woven textile wall hangings.",
          es: "Fundas de cojín cuadradas y lumbares con cremallera oculta y pespunte limpio, junto a tapices textiles de pared.",
        },
        specs: [
          { en: "Slub linen & woven cotton", es: "Lino natural y algodón" },
          {
            en: "Hidden zips & wall hangings",
            es: "Cremallera oculta y tapices",
          },
        ],
        image: "/images/categories-3d/home-decor/cushion-covers.webp",
        imageAlt: {
          en: "Illustrative 3D render of two textured oatmeal linen and muted sage-clay striped cushion covers",
          es: "Ilustración 3D de dos fundas de cojín en lino avena y algodón de rayas salvia y arcilla",
        },
      },
      {
        id: "recycled-cotton-dhurries",
        plane: "mid-left",
        shortLabel: { en: "Recycled dhurries", es: "Alfombras dhurrie" },
        name: {
          en: "Flat-weave dhurries (recycled cotton)",
          es: "Alfombras dhurrie de algodón reciclado",
        },
        tooltip: {
          en: "Lightweight flat-weave dhurrie rugs loomed from recycled cotton yarn.",
          es: "Alfombras ligeras dhurrie tejidas con hilo de algodón reciclado.",
        },
        description: {
          en: "Reversible flat-weave Indian dhurries woven in recycled cotton with understated geometric stripes and tidy braided cotton fringes.",
          es: "Alfombras dhurrie reversibles en algodón reciclado con rayas geométricas limpias y flecos trenzados.",
        },
        specs: [
          { en: "Recycled cotton yarn", es: "Algodón reciclado" },
          { en: "Reversible flat weave", es: "Ligera y reversible" },
        ],
        image: "/images/categories-3d/home-decor/dhurrie-rug.webp",
        imageAlt: {
          en: "Illustrative 3D render of a half-rolled recycled cotton flat-weave dhurrie rug in ivory, sage, and warm ochre stripes",
          es: "Ilustración 3D de una alfombra dhurrie semienrollada de algodón reciclado en rayas marfil, salvia y ocre",
        },
      },
      {
        id: "table-linens",
        plane: "mid-right",
        shortLabel: { en: "Table linens", es: "Ropa de mesa" },
        name: {
          en: "Table runners, tablecloths & placemats",
          es: "Caminos de mesa, manteles e individuales",
        },
        tooltip: {
          en: "Woven cotton and linen tablecloths, table runners, and matching placemats.",
          es: "Manteles, caminos de mesa e individuales a juego en lino y algodón.",
        },
        description: {
          en: "Coordinated natural-fibre dining textiles: slub-linen tablecloths, woven table runners, and textured placemats cut for European tables.",
          es: "Ropa de mesa coordinada en fibras naturales: manteles de lino, caminos de mesa tejidos e individuales para mesas europeas.",
        },
        specs: [
          {
            en: "Runners, cloths & placemats",
            es: "Caminos, manteles e individuales",
          },
          { en: "Pre-washed natural drape", es: "Caída natural prelavada" },
        ],
        image: "/images/categories-3d/home-decor/table-linens.webp",
        imageAlt: {
          en: "Illustrative 3D render of a folded sand linen tablecloth, clay-striped table runner, and stacked braided placemats",
          es: "Ilustración 3D de un mantel de lino arena doblado, camino de mesa con rayas arcilla e individuales trenzados",
        },
      },
    ],
  },
];

export const MANUFACTURING_SELECTION_CRITERIA: readonly WorkshopCriterion[] = [
  {
    id: "materials",
    title: {
      en: "Craft skill and the right machines",
      es: "Oficio y maquinaria adecuada",
    },
    body: {
      en: "Every partner already works your material daily with well-kept skiving, cutting, and stitching machines.",
      es: "Cada fabricante trabaja ya ese material a diario con máquinas bien cuidadas de rebajado, corte y costura.",
    },
  },
  {
    id: "capacity",
    title: {
      en: "A scale that respects your order",
      es: "Una escala que respete tu pedido",
    },
    body: {
      en: "We pair first-time boutique capsules and repeat retail runs with ateliers and factories where your order never gets pushed aside.",
      es: "Emparejamos tanto primeras cápsulas de comercio como pedidos mayores con fábricas donde tu encargo nunca queda relegado.",
    },
  },
  {
    id: "sampling",
    title: {
      en: "Accurate sample revisions",
      es: "Ajustes fieles de muestras",
    },
    body: {
      en: "Pattern makers refine prototypes cleanly and hold those exact linings, finishes, and stitch counts through production.",
      es: "Los patronistas afinan los prototipos con precisión y mantienen esos mismos forros, puntadas y acabados durante toda la producción.",
    },
  },
  {
    id: "open-floors",
    title: {
      en: "Open doors and direct talks with makers",
      es: "Puertas abiertas y trato directo",
    },
    body: {
      en: "We sit beside active stitching lines, check working conditions face to face with the artisans, and walk away from any closed door.",
      es: "Nos sentamos junto a las líneas activas, comprobamos las condiciones cara a cara con los artesanos y descartamos cualquier puerta cerrada.",
    },
  },
];

export const MANUFACTURING_STAGES: readonly ManufacturingStage[] = [
  {
    id: "product-brief",
    stepNumber: "01",
    title: {
      en: "First call and brief",
      es: "Primera llamada y briefing",
    },
    body: {
      en: "Bring a rough sketch or a piece from your shop to a call with Alma. Mutual NDA is ready from day one, and clear meeting notes follow right after.",
      es: "Trae un boceto o una pieza de tu tienda a una llamada con Alma. El acuerdo NDA está listo desde el primer día y recibes por escrito las conclusiones de la reunión al terminar.",
    },
    signOff: {
      en: "Written call summary and optional mutual NDA",
      es: "Resumen de la llamada por escrito y NDA opcional",
    },
    video: "/videos/phases/step-01-brief-review.mp4?v=2",
    poster: "/videos/posters/step-01-brief-review.jpg?v=2",
    mediaLabel: {
      en: "Alma and a client writing notes over open notebooks on a sunlit studio table during a Product Brief session",
      es: "Alma y una clienta anotando un briefing de producto sobre cuadernos abiertos en una mesa de estudio",
    },
  },
  {
    id: "product-study-match",
    stepNumber: "02",
    title: {
      en: "Product study and maker match",
      es: "Estudio y fabricante adecuado",
    },
    body: {
      en: "We check ergonomics, materials, and EU rules, then visit specialist Indian makers in person before sending your written proposal.",
      es: "Revisamos ergonomía, materiales y normativa europea, y visitamos fabricantes especialistas en la India antes de enviarte propuesta.",
    },
    signOff: {
      en: "Feasibility study and tailored proposal",
      es: "Estudio de viabilidad y propuesta a medida",
    },
    video: "/videos/phases/step-02-study-match.mp4?v=2",
    poster: "/videos/posters/step-02-study-match.jpg?v=2",
    mediaLabel: {
      en: "Alma, Shirish, and a pattern designer reviewing leather bag sketches and specs at an Indian studio table",
      es: "Alma, Shirish y una diseñadora revisando bocetos y especificaciones de bolsos de piel en un estudio de la India",
    },
  },
  {
    id: "sample-approval",
    stepNumber: "03",
    title: {
      en: "Colour swatch and sample",
      es: "Color y muestra física",
    },
    body: {
      en: "We never judge colour from phone photos. You approve a physical swatch first, then we inspect the prototype in India and ship it to your hands.",
      es: "Nunca aprobamos el color por fotos. Primero validas una muestra física de color, revisamos el prototipo en la India y te lo enviamos.",
    },
    signOff: {
      en: "Approved colour swatch and physical sample",
      es: "Aprobación de la muestra de color y del prototipo",
    },
    video: "/videos/phases/step-03-sample-approval.mp4?v=2",
    poster: "/videos/posters/step-03-sample-approval.jpg?v=2",
    mediaLabel: {
      en: "Inspecting black leather sample bags, brass hardware, and botanical fabric swatches at the studio",
      es: "Revisión de muestras de bolsos de piel negra, herrajes de latón y tejidos en el estudio",
    },
  },
  {
    id: "materials-contracts",
    stepNumber: "04",
    title: {
      en: "Materials and contracts",
      es: "Materiales y contratos",
    },
    body: {
      en: "Once you approve the sample, Shirish locks hides, fabrics, hardware, EU labels, and written Indian supplier contracts before cutting begins.",
      es: "Cuando apruebas la muestra, Shirish cierra pieles, tejidos, herrajes, etiquetas europeas y contratos bajo ley india antes de cortar.",
    },
    signOff: {
      en: "Signed Indian supplier contract and locked materials",
      es: "Contrato firmado bajo ley india y materiales cerrados",
    },
    video: "/videos/phases/step-04-materials-contracts.mp4?v=2",
    poster: "/videos/posters/step-04-materials-contracts.jpg?v=2",
    mediaLabel: {
      en: "Shirish reviewing printed contract pages and writing production-partner contract terms at his desk in India",
      es: "Shirish revisando y redactando contratos con unidades de producción sobre papel en su escritorio en la India",
    },
  },
  {
    id: "production",
    stepNumber: "05",
    title: {
      en: "Production supervision",
      es: "Supervisión en producción",
    },
    body: {
      en: "We check dye batches, stitching, and finishes directly against your approved counter-sample, with live video calls and progress photos.",
      es: "Comprobamos tintadas, costuras y acabados frente a tu contramuestra aprobada, con videollamadas en directo y fotos de avance.",
    },
    signOff: {
      en: "Inspection log and live production video call",
      es: "Registro de revisión y videollamada en directo",
    },
    video: "/videos/phases/step-05-production-checks.mp4?v=2",
    poster: "/videos/posters/step-05-production-checks.jpg?v=2",
    mediaLabel: {
      en: "Artisans stitching leather panels and Shirish checking seams on a cognac leather tote in India",
      es: "Artesanas cosiendo paneles de piel y Shirish comprobando costuras de un bolso en la India",
    },
  },
  {
    id: "bulk-delivery",
    stepNumber: "06",
    title: {
      en: "Final check and delivery",
      es: "Control final y entrega",
    },
    body: {
      en: "Finished pieces, EU labels, protective packing, and customs documents are verified before shipping to your door across Spain and the rest of Europe.",
      es: "Revisamos piezas terminadas, etiquetas europeas, embalaje protector y aduanas antes de entregar en tu puerta en España o el resto de Europa.",
    },
    signOff: {
      en: "Final quality sign-off, packing list, and customs pack",
      es: "Revisión final de calidad, lista de bultos y aduanas",
    },
    video: "/videos/phases/step-06-export-delivery.mp4?v=2",
    poster: "/videos/posters/step-06-export-delivery.jpg?v=2",
    mediaLabel: {
      en: "Finished leather bags packed in white cotton dust bags and sealed cartons delivered to a European shop",
      es: "Bolsos de piel envueltos en bolsas de algodón y cajas cerradas entregadas en una tienda europea",
    },
  },
];

export const MANUFACTURING_PRE_PRODUCTION_AGREEMENTS: readonly PreProductionAgreement[] =
  [
    {
      id: "reference-sample",
      title: {
        en: "Binding counter-sample",
        es: "Contramuestra vinculante",
      },
      body: {
        en: "Your approved sample and colour swatch stay with the maker as the physical benchmark for every check before packing.",
        es: "Tu prototipo y tu muestra de color aprobados quedan con el fabricante como referencia física para cada revisión.",
      },
    },
    {
      id: "contracts-and-ip",
      title: {
        en: "Indian contracts and mutual NDA",
        es: "Contratos en la India y NDA",
      },
      body: {
        en: "Mutual NDA and NNN protection are ready from day one, and Bar Council advocate Shirish puts tolerances and dates into Indian supplier contracts.",
        es: "Tienes acuerdos mutuos NDA y NNN desde el inicio, y Shirish, abogado colegiado en el Bar Council, fija tolerancias y plazos en contratos bajo ley india.",
      },
    },
    {
      id: "documentation",
      title: {
        en: "EU labels and export paperwork",
        es: "Etiquetado europeo y aduanas",
      },
      body: {
        en: "Sewn-in EU leather and fibre labels, REACH testing where needed, and customs paperwork are cleared before dispatch.",
        es: "Etiquetas europeas cosidas, ensayos REACH cuando proceda y documentación aduanera quedan cerrados antes del envío.",
      },
    },
    {
      id: "lead-times",
      title: {
        en: "Tailored quantities and realistic dates",
        es: "Cantidades a medida y plazos claros",
      },
      body: {
        en: "No rigid minimums or fixed price lists. Quantities and seasonal delivery windows are agreed openly around your calendar.",
        es: "Sin mínimos rígidos ni tarifas cerradas. Acordamos cantidades realistas y fechas de entrega en torno a tu temporada.",
      },
    },
  ];

export const MANUFACTURING_FAQS: readonly ManufacturingFaqItem[] = [
  {
    id: "product-study-without-tech-pack",
    question: {
      en: "Can I start without a finished tech pack?",
      es: "¿Puedo empezar sin tener una ficha técnica cerrada?",
    },
    answer: {
      en: "Yes. Many shop owners and brands start with a rough sketch, reference photos, or an item already in their store. Book a free 15-minute video call with Alma, and we turn your idea into a clear specification and physical sample before talking production.",
      es: "Sí. Muchos comercios y marcas empiezan con un boceto a mano, fotos de referencia o una pieza de su tienda. Reserva una videollamada gratuita de 15 minutos con Alma y convertimos tu idea en especificaciones claras y muestra física antes de pasar a producción.",
    },
  },
  {
    id: "moq-and-pricing",
    question: {
      en: "What are your minimum quantities and pricing?",
      es: "¿Cuáles son las cantidades mínimas y cómo se presupuesta?",
    },
    answer: {
      en: "We do not publish fixed price lists or rigid minimums because leather ateliers, garment makers, and home-textile weavers each run at different scales. We quote your collection directly from your brief, from small first capsules to repeat retail orders.",
      es: "No publicamos tarifas fijas ni mínimos rígidos porque una marroquinería, un confeccionista y un tejedor de hogar trabajan a escalas muy distintas. Presupuestamos tu colección a medida desde tu idea, tanto en primeras cápsulas como en pedidos repetidos.",
    },
  },
  {
    id: "legal-and-payment-protection",
    question: {
      en: "How are my designs and payments protected in India?",
      es: "¿Cómo se protegen mis diseños y pagos en la India?",
    },
    answer: {
      en: "During evaluation only Alma and Shirish see your files, with mutual NDA and NNN agreements ready whenever you want them. Before cutting begins, Shirish puts quality tolerances and delivery dates into a written Indian contract, and production never starts without your approved sample in hand.",
      es: "Durante la valoración solo Alma y Shirish ven tus archivos, con acuerdos mutuos NDA y NNN disponibles cuando quieras. Antes de cortar, Shirish recoge tolerancias y fechas en un contrato bajo ley india, y nunca producimos sin tu muestra aprobada en mano.",
    },
  },
  {
    id: "eu-labelling-and-export",
    question: {
      en: "Do you handle EU labelling and door-to-door delivery?",
      es: "¿Os encargáis del etiquetado europeo y la entrega a puerta?",
    },
    answer: {
      en: "Yes. Sewn-in EU leather and fibre labels, care tags, protective packing, and customs paperwork are planned into your proposal from the start so cartons arrive ready for your shop or warehouse across Spain and the rest of Europe.",
      es: "Sí. Etiquetas europeas cosidas, etiquetas de cuidado, embalaje protector y aduanas quedan planificados en tu propuesta desde el inicio para que las cajas lleguen listas a tu tienda o almacén en España o el resto de Europa.",
    },
  },
  {
    id: "languages-and-visits",
    question: {
      en: "What languages do you work in, and can we visit India?",
      es: "¿En qué idiomas trabajamos y podemos visitar la India?",
    },
    answer: {
      en: "Alma works directly with you in Spanish, English, or Portuguese, while we coordinate in India in English, Hindi, and Marathi. In-person visits can be arranged around active production runs.",
      es: "Alma trabaja contigo directamente en español, inglés o portugués, mientras nos coordinamos en la India en inglés, hindi y maratí. También podemos organizar visitas presenciales cuando hay una producción en marcha.",
    },
  },
];

export const MANUFACTURING_CLOSING_CONVERSATION: ClosingConversationCopy = {
  heading: {
    en: "Tell us what you want to make. We will study what it takes in India.",
    es: "Cuéntanos qué quieres fabricar. Nosotros estudiamos qué hace falta en la India.",
  },
  confidentialityNote: {
    en: "No tech pack needed. Mutual NDA available from day one, and Alma reads your note personally.",
    es: "Sin ficha técnica previa. Acuerdo NDA disponible desde el primer día y Alma lee tu mensaje personalmente.",
  },
  advanceCue: {
    en: "Choose how to start",
    es: "Elige cómo empezar",
  },
  optionsAriaLabel: {
    en: "Three ways to start manufacturing with KarmaRise D Global",
    es: "Tres formas de empezar a fabricar con KarmaRise D Global",
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
        en: "No form needed. Ask about materials, craft hubs, or timelines and hear straight back from Alma.",
        es: "Sin formularios. Consulta materiales, plazos o viabilidad y te responde directamente Alma.",
      },
      external: true,
    },
    {
      id: "book-call",
      tier: "arch-2",
      primary: true,
      eyebrow: {
        en: "Want a feasibility read first",
        es: "Prefieres valorarlo cara a cara",
      },
      title: {
        en: "Book a free call with Alma",
        es: "Reserva una llamada gratis con Alma",
      },
      detail: {
        en: "Free 15-minute video call with zero obligation. Talk through your piece face to face and receive clear meeting notes right after.",
        es: "Videollamada gratuita de 15 minutos sin compromiso. Habla sobre tu pieza cara a cara y recibe por escrito las conclusiones de la reunión al terminar.",
      },
    },
    {
      id: "product-brief",
      tier: "arch-3",
      eyebrow: {
        en: "Ready with a sketch or piece",
        es: "Ya tienes un boceto o una pieza",
      },
      title: {
        en: "Share your product idea",
        es: "Cuéntanos tu idea",
      },
      detail: {
        en: "Three quick steps from a rough sketch or shop item. Saves automatically as you write.",
        es: "Tres pasos breves desde un boceto o un artículo de tu tienda. Se guarda mientras escribes.",
      },
    },
  ],
};
