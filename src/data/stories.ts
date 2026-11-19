export type StoryCategory =
  | "Heritage & Culture"
  | "Sustainable Fashion"
  | "People & Craftsmanship"
  | "Art & Design"
  | "India Meets Europe"
  | "Inside KarmaRise"
  | "KarmaRise Journal";

export type StoryLanguage = "en" | "es";

export interface StoryCategoryDetail {
  slug: string;
  title: StoryCategory;
  displayTitle: string;
  spanishTitle: string;
  shortLabel: string;
  description: string;
  spanishDescription: string;
  coverImage: string;
  coverAlt: string;
  spanishCoverAlt?: string;
}

export interface StoryImage {
  url: string;
  alt: string;
  caption?: string;
  aspectRatio?: "16:9" | "4:3" | "4:5";
  objectPosition?: string;
}

export interface StoryAuthor {
  name: string;
  role: string;
  spanishRole?: string;
  location: string;
  spanishLocation?: string;
  portraitUrl?: string;
}

export interface StoryPullQuote {
  text: string;
  attribution?: string;
}

export interface StoryTextSpan {
  _key: string;
  text: string;
  marks?: string[];
}

export interface StoryMarkDef {
  _key: string;
  _type: "link";
  href: string;
  blank?: boolean;
}

export type StoryBodyBlock =
  | {
      _key: string;
      _type: "block";
      style: "normal" | "h2" | "h3" | "blockquote";
      listItem?: "bullet" | "number";
      children: StoryTextSpan[];
      markDefs?: StoryMarkDef[];
    }
  | {
      _key: string;
      _type: "image";
      url: string;
      alt: string;
      caption?: string;
      aspectRatio?: "16:9" | "4:3" | "4:5";
      objectPosition?: string;
    }
  | {
      _key: string;
      _type: "pullQuoteBlock";
      text: string;
      attribution?: string;
    };

export interface StorySection {
  heading: string;
  paragraphs: string[];
  images?: StoryImage[];
}

export interface StoryEntry {
  slug: string;
  featured?: boolean;
  newsletterEligible?: boolean;
  language: StoryLanguage;
  issueNumber: string;
  publishedAt: string;
  readingTimeMinutes: number;
  category: StoryCategory;
  location: string;
  spanishLocation?: string;
  title: string;
  spanishTitle?: string;
  summary: string;
  spanishSummary?: string;
  author: StoryAuthor;
  tags: string[];
  spanishTags?: string[];
  leadImage?: StoryImage;
  spanishLeadAlt?: string;
  spanishLeadCaption?: string;
  leadSlot: {
    kind: "Photo" | "Video" | "Photo or video";
    ratio: string;
    title: string;
    description: string;
  };
  pullQuote?: StoryPullQuote;
  spanishPullQuote?: StoryPullQuote;
  pairImages?: StoryImage[];
  spanishPairAlts?: string[];
  spanishPairCaptions?: string[];
  pairSlots: [
    {
      title: string;
      description: string;
    },
    {
      title: string;
      description: string;
    },
  ];
  body?: StoryBodyBlock[];
  sections: StorySection[];
  spanishSections?: StorySection[];
  takeaway: string;
  spanishTakeaway?: string;
  seo?: {
    title?: string;
    description?: string;
    spanishTitle?: string;
    spanishDescription?: string;
  };
}

export const storyCategoryDetails: StoryCategoryDetail[] = [
  {
    slug: "heritage-and-culture",
    title: "Heritage & Culture",
    displayTitle: "Heritage & Culture",
    spanishTitle: "Cultura y raíces",
    shortLabel: "Heritage",
    description:
      "India's craft regions, textile towns, and architectural history, and how they shape the way we build.",
    spanishDescription:
      "Las regiones artesanas de la India, sus pueblos textiles y su arquitectura, y cómo marcan nuestra forma de trabajar.",
    coverImage: "/images/forts (4).jpg",
    coverAlt:
      "Historic stone fort walls and courtyard rising above the valley in India",
    spanishCoverAlt:
      "Murallas y patio de un fuerte histórico de piedra sobre el valle en la India",
  },
  {
    slug: "sustainable-fashion",
    title: "Sustainable Fashion",
    displayTitle: "Sustainable Fashion",
    spanishTitle: "Moda sostenible",
    shortLabel: "Sustainability",
    description:
      "How Almarise selects existing Indian silk and cotton sarees and tailors them into one-of-a-kind contemporary garments for Spain and Europe.",
    spanishDescription:
      "Cómo en Almarise seleccionamos saris existentes de seda y algodón en la India para transformarlos en prendas contemporáneas únicas para España y Europa.",
    coverImage: "/images/maria_7.jpeg",
    coverAlt:
      "Contemporary outer layer cut from an Indian saree with striped purple sleeves and paisley border worn in Spain",
    spanishCoverAlt:
      "Prenda exterior contemporánea confeccionada a partir de un sari indio con mangas listadas y cenefa de cachemira en España",
  },
  {
    slug: "people-and-craftsmanship",
    title: "People & Craftsmanship",
    displayTitle: "People & Craftsmanship",
    spanishTitle: "Oficios y talleres",
    shortLabel: "Craftsmanship",
    description:
      "Inside the leather and garment workshops we partner with across India, and the specialists who run them.",
    spanishDescription:
      "Por dentro de los talleres de piel y confección con los que trabajamos en toda la India y los especialistas que están al frente.",
    coverImage:
      "/media (ai generated)/shirish_with_workers_at_warehouse_(5).jpeg_98406e06_2K.jpg",
    coverAlt:
      "Shirish standing beside a master machinist stitching a leather strap inside an Indian workshop",
    spanishCoverAlt:
      "Shirish junto a un maestro artesano cosiendo una correa de piel en un taller de la India",
  },
  {
    slug: "art-and-design",
    title: "Art & Design",
    displayTitle: "Art & Design",
    spanishTitle: "Diseño y materiales",
    shortLabel: "Design",
    description:
      "Turning a Product Brief into an approved physical sample: selecting hides, testing hardware, and refining patterns in India.",
    spanishDescription:
      "El paso de un Product Brief a una muestra física aprobada: elección de pieles, pruebas de herrajes y ajuste de patrones en la India.",
    coverImage:
      "/media (ai generated)/alma_at_the_warehouse_(4).jpeg_dd90eea7_2K.jpg",
    coverAlt:
      "Alma inspecting a leather bag prototype against full-grain hides in an Indian workshop",
    spanishCoverAlt:
      "Alma revisando un prototipo de bolso sobre pieles naturales en un taller de la India",
  },
  {
    slug: "india-meets-europe",
    title: "India Meets Europe",
    displayTitle: "India Meets Europe",
    spanishTitle: "Entre India y Europa",
    shortLabel: "India & Europe",
    description:
      "How Alma and Shirish connect Spanish and European brands with production and everyday culture across India.",
    spanishDescription:
      "Cómo Alma y Shirish conectan las marcas de España y Europa con la producción y la vida cotidiana en toda la India.",
    coverImage: "/images/alma_and_shirish_sitting_at_table (2).jpeg",
    coverAlt:
      "Shirish and Alma reviewing fabric swatches and a Product Brief together",
    spanishCoverAlt:
      "Shirish y Alma revisando juntos muestras de tela y especificaciones de producto",
  },
  {
    slug: "karmarise-journal",
    title: "Inside KarmaRise",
    displayTitle: "Inside KarmaRise",
    spanishTitle: "Día a día en KarmaRise",
    shortLabel: "Inside KarmaRise",
    description:
      "Progress from our studio in India, completed Bulk Order dispatches, and the groundwork for our planned Women's Training Initiative.",
    spanishDescription:
      "Avances desde nuestro estudio en la India, envíos de pedidos completados y los primeros pasos de nuestra futura formación para mujeres.",
    coverImage:
      "/media (ai generated)/shirish_at_warehouse.jpeg_e957969b_2K.jpg",
    coverAlt:
      "Shirish at the review desk in an Indian leather workshop surrounded by samples",
    spanishCoverAlt:
      "Shirish en la mesa de revisión de un taller de marroquinería en la India rodeado de muestras",
  },
];

export const storyCategories: ("All Stories" | StoryCategory)[] = [
  "All Stories",
  ...storyCategoryDetails.map((item) => item.title),
];

export const stories: StoryEntry[] = [
  {
    slug: "from-spain-to-a-cutting-table-in-india",
    featured: true,
    newsletterEligible: true,
    language: "en",
    issueNumber: "01",
    publishedAt: "2026-11-14",
    readingTimeMinutes: 5,
    category: "India Meets Europe",
    location: "Spain & India",
    spanishLocation: "España e India",
    title: "From a first call in Spain to a cutting table in India",
    spanishTitle:
      "De una primera llamada en España a una mesa de corte en la India",
    summary:
      "When a brand in Spain or Portugal commissions a product in India through agents and trading houses, small decisions quietly change long before bulk production starts. Staying present on both sides of the brief keeps the piece intact.",
    spanishSummary:
      "Cuando una marca en España o Portugal encarga su producción en la India a través de agentes y comercializadoras, muchos detalles cambian en silencio antes de empezar a cortar. Estar presentes a ambos lados mantiene la pieza intacta.",
    author: {
      name: "Alma & Shirish",
      role: "Co-founders, KarmaRise D Global",
      spanishRole: "Cofundadores de KarmaRise D Global",
      location: "Spain & India",
      spanishLocation: "España e India",
      portraitUrl: "/images/alma-and-shirish-founders.jpg",
    },
    tags: [
      "Product Brief",
      "Manufacturing Programme",
      "Spain & India",
      "Across India",
    ],
    spanishTags: [
      "Product Brief",
      "Programa de fabricación",
      "España e India",
      "Toda la India",
    ],
    leadImage: {
      url: "/images/alma-and-shirish-founders.jpg",
      alt: "Shirish and Alma reviewing a Product Brief with fabric and leather swatches",
      caption:
        "Reviewing leather hides, lining swatches, and written specifications together in our studio in India.",
    },
    spanishLeadAlt:
      "Shirish y Alma revisando juntos un Product Brief con muestras de piel y tejidos",
    spanishLeadCaption:
      "Revisando juntos pieles, muestras de forro y especificaciones por escrito en nuestro estudio en la India.",
    leadSlot: {
      kind: "Photo",
      ratio: "16:10 horizontal",
      title: "Annotated patterns and material cards",
      description:
        "Documentary horizontal shot showing printed specification notes, pattern pieces, and fabric or leather cards.",
    },
    pullQuote: {
      text: "When middlemen take their cut before an order ever reaches the workshop, the factory has to recover that money out of the material itself. Working directly on both sides keeps the budget inside the product.",
      attribution: "Alma & Shirish · KarmaRise D Global",
    },
    spanishPullQuote: {
      text: "Cuando los intermediarios se llevan su margen antes de que el pedido llegue al taller, la fábrica acaba recuperando ese dinero del propio material. Trabajar de forma directa en ambos extremos mantiene el presupuesto dentro del producto.",
      attribution: "Alma y Shirish · KarmaRise D Global",
    },
    pairImages: [
      {
        url: "/images/alma_at_the_warehouse (4).jpeg",
        alt: "Alma inspecting a finished brown leather sample bag against a whole hide in an Indian workshop",
        caption:
          "Comparing an approved brown leather bag sample directly against a whole hide at the cutting table before cutting begins.",
      },
      {
        url: "/images/shirish_at_warehouse.jpeg",
        alt: "Shirish seated at a factory review desk with specification binders and leather prototypes",
        caption:
          "Reviewing written specifications and sealed sample tags on site with our Manufacturing Partner.",
      },
    ],
    spanishPairAlts: [
      "Alma revisando una muestra terminada de bolso en piel marrón sobre una piel entera en un taller de la India",
      "Shirish en la mesa de revisión de una fábrica con carpetas de especificaciones y prototipos en piel",
    ],
    spanishPairCaptions: [
      "Comparando en la mesa de corte una muestra aprobada de bolso en piel marrón directamente sobre una piel entera antes de empezar a cortar.",
      "Revisando las especificaciones por escrito y las etiquetas precintadas de muestra junto a nuestro socio de fabricación.",
    ],
    pairSlots: [
      {
        title: "Product Brief review",
        description:
          "Portrait photo (4:5): physical reference sample and trim notes being compared during the Product Brief review.",
      },
      {
        title: "Workshop specification check",
        description:
          "Portrait photo (4:5): checking dimensions and material references on site in India.",
      },
    ],
    sections: [
      {
        heading: "Where a product quietly changes hands",
        paragraphs: [
          "When an independent brand in Spain or Portugal decides to manufacture in India, the conversation usually begins in the same place. Makers in towns like Ubrique or around Alicante in Spain, and across northern Portugal around Porto and Guimarães, set a high bar for leather and footwear craft. Yet once a label starts growing, European workshop minimums and capacity ceilings often push founders to look toward India, which already supplies a substantial share of Europe's leather goods and garments.",
          "The trouble rarely begins on the factory floor. It starts in the chain of people standing between the Client and the person holding the cutting knife.",
          "Having built an own-label brand in Spain before setting up in India, we know how founders talk about a piece they have spent months designing. On our calls in Spanish, Portuguese, or English, Clients rarely speak in factory codes. They tell us how a bag needs to sit against a winter coat, or how firm the handle should feel when someone picks it up off a shelf. In a traditional export chain, that brand hands its drawings to a local European sales agent, who takes five to eight percent and forwards the file to an Indian buying house. The buying house takes another eight or ten percent and passes a stripped-down purchase sheet to a workshop owner.",
          "By the time close to twenty percent of the price has been shaved off by people who never touch the leather, the workshop owner is left with a squeezed budget and a vague one-page note. Nobody writes an email to say the specification is changing. Instead, a crisp 220-gram cotton twill lining that gives a bag its quiet interior structure gets swapped for a thin 140-gram poly-cotton blend. Solid brass buckles or sealed zinc-alloy rings give way to cheap barrel-plated hardware that looks bright in a sample photograph, only to pit and tarnish the moment it sits through a humid Maharashtra monsoon or a three-week sea crossing from Nhava Sheva to Valencia or Barcelona.",
          "When we founded KarmaRise D Global together in India, we built it to remove that handoff altogether. The person listening to the Client in Spain sits beside the person walking onto the workshop floor across India.",
        ],
      },
      {
        heading: "Around the cutting table",
        paragraphs: [
          "Walking into an Indian leather workshop is nothing like visiting a garment unit where woven cotton is stacked fifty layers high and sliced with an electric blade. At a leather cutting table, the kaat table, every hide is laid flat and read one by one under the lights.",
          "When we take a new Product Brief to a Manufacturing Partner, we stand at that table beside the owner and the master-ji, the pattern master who cuts the stiff greyboard templates for every panel and gusset. Together we check both the feel of the piece and the economics behind the cut. We run our hands over a 1.3-millimetre hide to judge its temper, lay the approved sample straight against the grain, and check that folded edges are skived thin enough to turn cleanly without bulging, with stitching kept tight at seven or eight stitches per inch.",
          "Across the same hide, we look closely at where those cardboard templates are being placed. A leather skin is not uniform from edge to edge. The tightest, strongest fibres sit along the spine and the butt, where a bag panel needs to hold its shape for years. The shoulder carries natural neck lines, while the outer belly is soft and stretchy.",
          'From our legal and operational work across India, we know most workshop friction begins with an informal job-work slip, a chalan, that says little more than "leather bag as per sample." When a workshop owner has been squeezed on price by a trading house, he tells his cutter, the karigar, to push the pattern templates out into the belly of the hide so nothing goes to waste. A front panel cut from the belly looks identical on the cutting table on Tuesday. Three months later, hanging on a rail in Madrid, it sags out of shape.',
          "So we settle both conversations before a blade touches the skin. Speaking with the workshop owner in Marathi or Hindi, we agree on a fair per-piece price that leaves room to cut only from the prime zones of the hide. Alongside that price, we put the lining weight, hardware alloy, thread, and European REACH limits for chrome and azo dyes into plain written terms so a Bulk Order never stalls at Spanish customs.",
        ],
      },
      {
        heading: "The sealed sample that stays on the floor",
        paragraphs: [
          "Some of the best adjustments come from the workshop floor itself. On a second prototype, a pattern master might suggest shifting a strap anchor by half a centimetre or reinforcing a top seam so a full bag does not pull at the zip. Because we are standing right there, the factory does not have to guess, and an email does not sit unanswered for two weeks. We test the change in the workshop, hold it in our hands, and call the Client in Europe that same afternoon to walk through why it improves the piece.",
          "Once the Client signs off, we never leave bulk production to memory. Before raw materials are ordered for the full run, the workshop builds identical pre-production counter-samples using the exact bulk leather, lining, and hardware. We attach a signed specification tag locked with a tamper-evident wire seal. One sealed sample stays hanging right beside the cutting and finishing tables as the physical benchmark for every karigar. The twin stays with us for pre-shipment inspection, where we check the finished batch against an agreed AQL 2.5 standard before a single carton is sealed for export.",
          "That signed tag protects both sides of the Manufacturing Programme. The workshop owner knows he will be paid fairly and on time for building the piece properly, and the founder in Spain opens the first carton knowing the product in their hands matches the one we talked about on our very first call.",
        ],
      },
    ],
    spanishSections: [
      {
        heading: "Dónde cambia de manos un producto sin hacer ruido",
        paragraphs: [
          "Cuando una marca independiente en España o Portugal decide fabricar en la India, la conversación casi siempre empieza en el mismo punto. Los talleres de Ubrique o la zona de Alicante en España, igual que los polos textiles y de calzado del norte de Portugal entre Oporto y Guimarães, marcan un nivel altísimo. Sin embargo, cuando una firma empieza a crecer, los pedidos mínimos y la capacidad en Europa suelen llevarla a mirar hacia la India, que ya abastece buena parte de la marroquinería y la confección que llega al mercado europeo.",
          "El problema rara vez nace dentro del taller. Nace en la cadena de personas que se interpone entre el cliente y quien sostiene la cuchilla de corte.",
          "Como nosotros mismos levantamos una marca propia en España antes de instalarnos en la India, sabemos cómo explica un fundador una pieza en la que lleva meses trabajando. En nuestras llamadas en español, portugués o inglés, los clientes no hablan en códigos de fábrica. Nos cuentan cómo debe caer un bolso sobre un abrigo de invierno o qué firmeza debe tener el asa al cogerlo de una estantería. En el modelo habitual de exportación, esa marca entrega sus bocetos a un agente comercial en Europa, que se queda entre un cinco y un ocho por ciento y reenvía el archivo a una oficina de compras en la India. Esa oficina añade otro ocho o diez por ciento y pasa una hoja resumida al dueño del taller.",
          "Cuando casi un veinte por ciento del presupuesto se ha quedado por el camino en manos de gente que ni siquiera toca la piel, el taller recibe un margen imposible y una nota vaga de una sola página. Nadie envía un correo avisando de que la ficha va a cambiar. Simplemente, una sarga de algodón de 220 gramos que daba cuerpo al interior se sustituye por un forro fino de poliéster y algodón de 140 gramos. Las hebillas de latón macizo o las anillas de zamak sellado se cambian por herrajes baratos que brillan igual en una foto, pero se pican y oxidan en cuanto pasan un monzón húmedo en Maharashtra o tres semanas de travesía marítima desde Nhava Sheva hasta Valencia o Barcelona.",
          "Cuando fundamos KarmaRise D Global juntos en la India, lo hicimos precisamente para eliminar ese salto. La persona que escucha al cliente en España trabaja codo con codo con quien entra cada semana en los talleres por toda la India.",
        ],
      },
      {
        heading: "Alrededor de la mesa de corte",
        paragraphs: [
          "Entrar en un taller de piel en la India no se parece en nada a visitar una fábrica textil donde se apilan cincuenta capas de algodón bajo una cuchilla eléctrica. En la mesa de corte de piel, la kaat table, cada piel se extiende entera y se lee una por una bajo la luz.",
          "Cuando llevamos un nuevo Product Brief a un socio de fabricación, nos ponemos alrededor de esa mesa junto al propietario y al master-ji, el patronista que recorta en cartón grueso las plantillas de cada panel y fuelle. Comprobamos a la vez el tacto de la pieza y los números reales de su corte. Palpamos una piel de 1,3 milímetros para medir su cuerpo, apoyamos la muestra aprobada directamente sobre la flor del cuero y revisamos que los cantos doblados lleven el rebaje justo para girar limpios sin abultar, con una costura firme de siete u ocho puntadas por pulgada.",
          "Sobre esa misma piel, observamos dónde se están colocando exactamente las plantillas de cartón. Un cuero no es igual de un extremo a otro. Las fibras más compactas y resistentes están en el lomo y el crupón, la zona que permite que el cuerpo de un bolso mantenga su forma durante años. El cuello conserva pliegues naturales, mientras que la falda es blanda y elástica.",
          'Por nuestra experiencia legal y operativa sobre el terreno en la India, sabemos que la mayoría de los roces en los talleres vienen de un albarán informal, un chalan, donde solo pone "bolso de piel según muestra". Si una comercializadora ha apretado el precio al taller, el dueño pide al cortador, el karigar, que encaje los patrones hasta el borde de la falda para aprovechar cada centímetro. Un frontal cortado de la falda parece idéntico sobre la mesa el martes. Tres meses después, colgado en una tienda de Madrid, cede y se deforma.',
          "Por eso cerramos ambas conversaciones antes de que la cuchilla toque la piel. Hablando directamente con el propietario en maratí o hindi, acordamos un precio justo por unidad que permita cortar solo de las zonas nobles del cuero. Y dejamos por escrito el gramaje del forro, la aleación del herraje, el hilo y los límites europeos de REACH para cromo y tintes azoicos, evitando que el pedido quede retenido en la aduana española.",
        ],
      },
      {
        heading: "La muestra precintada que se queda en el taller",
        paragraphs: [
          "Muchas de las mejores correcciones nacen en el propio taller. En un segundo prototipo, el patronista puede detectar que mover medio centímetro el anclaje de la correa o reforzar un vivo superior evita que la cremallera tire cuando el bolso va lleno. Como estamos allí delante, el taller no tiene que adivinar y ningún correo se queda dos semanas sin respuesta. Probamos el ajuste en la mesa, lo valoramos en mano y esa misma tarde llamamos al cliente en Europa para explicarle por qué mejora la pieza.",
          "Cuando el cliente da el visto bueno, nunca dejamos la producción en serie a la memoria. Antes de pedir materiales para todo el lote, el taller fabrica muestras de preproducción idénticas con la piel, el forro y los herrajes definitivos. Colocamos una etiqueta firmada sujeta con un precinto de alambre inviolable. Una muestra precintada se queda colgada junto a las mesas de corte y acabado como referencia física para cada karigar. La copia gemela se queda con nosotros para la inspección previa al embarque, donde revisamos el lote terminado bajo un estándar AQL 2.5 antes de cerrar las cajas para exportación.",
          "Ese precinto protege a las dos partes del programa de fabricación. El dueño del taller sabe que cobrará un precio justo y a tiempo por trabajar bien la pieza, y el fundador en España abre la primera caja con la tranquilidad de tener entre las manos exactamente el producto del que hablamos en nuestra primera llamada.",
        ],
      },
    ],
    takeaway:
      "Keeping a Product Brief intact is not about sending longer documents across borders. It comes from having both founders involved from the first call in Europe to the cutting table in India, locking clear terms and materials before production begins.",
    spanishTakeaway:
      "Mantener intacto un Product Brief no consiste en enviar documentos más largos entre países. Se consigue teniendo a ambos fundadores implicados desde la primera llamada en Europa hasta la mesa de corte en la India, cerrando acuerdos claros y materiales antes de empezar a producir.",
    seo: {
      title: "From a First Call in Spain to a Cutting Table in India",
      description:
        "How Alma and Shirish keep a Product Brief intact from the first call in Spain and Europe to the cutting table and bulk production in India.",
      spanishTitle:
        "De una primera llamada en España a una mesa de corte en la India",
      spanishDescription:
        "Cómo Alma y Shirish mantienen intacto un Product Brief desde la primera llamada en España hasta la mesa de corte y la producción en serie en la India.",
    },
  },
  {
    slug: "three-biryanis-on-eid",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "01",
    publishedAt: "2026-11-17",
    readingTimeMinutes: 5,
    category: "India Meets Europe",
    location: "India & Spain",
    spanishLocation: "India y España",
    title:
      "Three biryanis on Eid, and why we do not understand gathering without food",
    spanishTitle:
      "Tres biryanis en Eid y por qué no entendemos juntarnos sin comida",
    summary:
      "Living in India as a Spaniard has shown me how differently people keep hours around food, whether it is Diwali snacks whose names I still forget, three Eid biryanis in one day, or my mum's croquetas back in Spain for eight.",
    spanishSummary:
      "Vivir en la India siendo española me ha hecho ver lo distinto que medimos los horarios al comer: los aperitivos de Diwali cuyos nombres aún olvido, tres biryanis seguidos en Eid y las croquetas de mi madre en España para ocho.",
    author: {
      name: "Alma",
      role: "Co-founder, KarmaRise D Global",
      spanishRole: "Cofundadora de KarmaRise D Global",
      location: "Spain & India",
      spanishLocation: "España e India",
      portraitUrl: "/images/alma.jpeg",
    },
    tags: [
      "India & Spain",
      "Food & hospitality",
      "Home kitchens",
      "Everyday culture",
    ],
    spanishTags: [
      "India y España",
      "Mesa y hospitalidad",
      "Cocina casera",
      "Cultura cotidiana",
    ],
    leadImage: {
      url: "/food and culture/WhatsApp_Image_2026-11-17_at_12.57.58_04e37ce6_2K.jpg",
      alt: "Alma smiling over a steel thali of steamed brown idlis, sambar, and chutney at the office table in India",
      caption:
        "Having brown idlis with sambar and chutney at our office table in India. It was my first time eating idli brown, and it tastes completely different from the white ones.",
      objectPosition: "50% 78%",
    },
    spanishLeadCaption:
      "Comiendo idlis oscuros con sambar y chutney en nuestra mesa en la India. Era la primera vez que los probaba así y saben completamente distinto a los blancos.",
    leadSlot: {
      kind: "Photo",
      ratio: "16:10 horizontal",
      title: "Eating brown idlis at the table in India",
      description:
        "Horizontal candid photograph of Alma eating brown idlis, sambar, and chutney at the table in India.",
    },
    pullQuote: {
      text: "In India, one recipe tastes completely different between one home and another. Even this brown idli on my plate today tastes nothing like the white ones I had before.",
      attribution: "Alma",
    },
    spanishPullQuote: {
      text: "En la India, una misma receta sabe completamente distinto entre una casa y otra. Hasta este idli oscuro que tengo hoy en el plato no tiene nada que ver con los blancos que había probado antes.",
      attribution: "Alma",
    },
    pairImages: [
      {
        url: "/food and culture/pexels-sabbythefreeelf-36652961.jpg",
        alt: "Home-cooked chicken biryani served in a glass dish alongside raita and spiced gravy",
        caption:
          "Home-cooked chicken biryani with raita and gravy. Last year on Eid, everybody invited us over and I ate three full biryani meals in a single day.",
      },
      {
        url: "/food and culture/image.png_951c836f_2K.jpg",
        alt: "Large oblong Spanish minced-meat croquetas broken open on a plate showing soft creamy béchamel inside",
        caption:
          "Huge minced-meat croquetas in thick béchamel, crisp outside and soft and creamy inside, like the ones my mum rolled for the eight of us in Spain.",
      },
    ],
    spanishPairCaptions: [
      "Biryani casero de pollo con raita y salsa. El año pasado en Eid nos invitaron en tantas casas que comí tres platos completos de biryani el mismo día.",
      "Croquetas grandes de carne picada con bechamel espesa, crujientes por fuera y muy cremosas por dentro, como las que hacía mi madre en España para los ocho de casa.",
    ],
    pairSlots: [
      {
        title: "Home-cooked chicken biryani",
        description:
          "Portrait photo (4:5): home-style chicken biryani served with raita on a family table.",
      },
      {
        title: "Spanish minced-meat croquetas",
        description:
          "Portrait photo (4:5): large oblong croquetas broken open to show soft béchamel inside.",
      },
    ],
    sections: [
      {
        heading: "Why you cannot talk about Europe as one table",
        paragraphs: [
          "People here often ask me to compare eating habits in Europe and India as if Europe were one single place. Really, you cannot talk about one European food culture because the countries are so different. You can group southern countries like Spain, Italy, Portugal, and Greece together a little bit, because we share a way of cooking and gathering. Northern countries in Europe have a completely different idea, and to be quite honest, they have no idea about gastronomy. They have one or two dishes, they hardly cook, and that is it.",
          "Even the schedules change completely across countries. In England, there is very little street social life around food. People are busy with school, college, and work, so that heavy English breakfast with eggs and bacon everyone knows is mostly reserved for weekends now. On weekdays they have breakfast, a very light lunch around twelve, and a heavy dinner, never spicy, at six or seven at the latest. In France, either you stick to the schedule or you do not eat. Most kitchens close for lunch around twelve-thirty or one, and there is no way you can eat after that.",
          "What I found in India, different from any country I have known, is that people eat all the time. There is no strict breakfast, lunch, and dinner. Every time you go out, all those street carts are full of people at any hour, and at night people eat at eleven, twelve, or one in the morning. You might think we do the same thing in Spain, because if you walk through a Spanish city you see a house, a shop, a bar, a house, a shop, a bar, always with somebody inside. When you live here, you realise it is not the same thing. In Spain we stop into a bar for a morning coffee, a cold drink, or a beer, rather than eating all day long. Still, the minute somebody comes into a Spanish house, the first thing we offer is a drink with something alongside it: coffee and biscuits in the morning or early evening, a glass of wine or a beer with snacks after twelve or past seven, or dinner if it is late. That is Spanish. We do not understand gathering without food.",
        ],
        images: [
          {
            url: "/food and culture/images.jpg",
            alt: "Family seated for an early evening roast chicken and potato dinner in England",
            caption:
              "In England, families sit down to a heavy, non-spicy dinner by six or seven in the evening, hours before dinner begins here in India.",
            aspectRatio: "4:3",
          },
          {
            url: "/food and culture/image.png_aa5ceb44_2K.jpg",
            alt: "Close-up of steamed brown idlis served with spiced chutney on a ceramic plate",
            caption:
              "A closer look at brown idlis with spiced chutney. Here in India, proper food is ready at almost any hour of the day or night.",
            aspectRatio: "4:3",
          },
        ],
      },
      {
        heading: "One recipe, two houses, completely different taste",
        paragraphs: [
          "Visiting another state in India does not automatically mean eating new food if you travel together. When we went to Himachal, everyone in our group was coming from Maharashtra, so we tended to order the same sort of dishes we already knew, maybe a different kind of mutton dish at most. Where I really noticed the variety of Indian food was inside people's homes.",
          "Diwali just went by, and I really enjoyed the homemade snacks, even though I still cannot remember their names in Marathi. I remember the spiral one, chakli, which I liked very much, and the smaller sweet ones like croutons, shankarpali. I found a big difference between one home and another in how they make them. In one house a snack can be fiery hot, and in another house it is mild, pleasant, and crunchy to my taste.",
          "It is the same with creamy chicken dishes and with biryani, a dish I love. Sometimes biryani is just rice with pieces of chicken, while other cooks integrate all the flavours right into the rice. Shirish makes a good one, though I must say the best chicken biryani I have eaten so far was made by his friend's sister. Her family are Muslim and invited us home, and that biryani could not be compared to any restaurant or good hotel. It was the texture of the rice and how all the flavours came together.",
        ],
        images: [
          {
            url: "/food and culture/pexels-saveurssecretes-5992263.jpg",
            alt: "Crisp spiral chakli arranged beside a brass press and two glasses of hot chai",
            caption:
              "The spiral Diwali snack, chakli, with hot chai. I still forget the Marathi name, and every home makes it with a different level of spice.",
            aspectRatio: "4:5",
          },
          {
            url: "/food and culture/pexels-paratape-33472114.jpg",
            alt: "Cook plating spiced biryani rice from a wide metal vessel",
            caption:
              "Serving spiced biryani rice. You can tell immediately when a cook integrates every flavour into the grain instead of leaving plain rice beside chicken.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading: "Three biryanis on Eid and my mum's croquetas for eight",
        paragraphs: [
          'Last year on Eid, the day Muslims finish their fasting and cook everywhere, was terrible for my stomach because everybody invited us home. I had biryani three times in one day, three full meals with biryani and all the snacks. By the last house I was virtually sick. I kept saying, "No, no, thank you, no more," and they kept saying, "Oh no, you do not like it? Eat more!"',
          'That happened many times at first, especially at Shirish\'s home. His mum just feeds you, feeds you, and feeds you. In the evening I cannot eat that much, and hot, spicy food at night does not fit what my stomach is used to. I kept saying, "No thank you, baba, I have had enough," and she kept saying, "No, you have eaten very little," until one night I really got sick. Shirish was so mad that he scolded his mum, and I told him, "No, do not do that, they do it out of love." Now that the people I spend time with know me, they never force me, and instead it has become a funny line at the table: "You want this? You want that? Do not feel we are forcing you!"',
          "Thinking of mothers cooking at home always reminds me of my mum in Spain. Mum never liked cooking. She disliked it so much that she thought she did not cook well, yet she had a very good hand and made all kinds of dishes. My favourite was her croquetas. Most people now roll little round balls, and nobody back then made them out of minced meat like she did. She cooked the minced meat, put it into béchamel sauce made with milk and flour, rolled them in breadcrumbs, and fried huge big croquetas. When you bit into them, they were so soft and creamy inside that nobody could match that flavour. We were eight people at home: four kids, mum and dad, and my grandparents. Rolling that many croquetas was very time-consuming, so she does not make them anymore, though they are still my favourite dish in the world.",
        ],
      },
    ],
    spanishSections: [
      {
        heading: "Por qué no se puede hablar de Europa como una sola mesa",
        paragraphs: [
          "Aquí me piden a menudo que compare la forma de comer en Europa y en la India como si Europa entera fuera un mismo lugar. En realidad no se puede hablar de una cultura gastronómica europea porque unos países y otros no tienen nada que ver. Puedes agrupar un poco a los del sur, como España, Italia, Portugal o Grecia, porque compartimos cierta manera de cocinar y de juntarnos. En cambio, en los países del norte de Europa tienen otra idea completamente distinta y, siendo sincera, no tienen ni idea de gastronomía. Tienen uno o dos platos, apenas cocinan y eso es todo.",
          "Hasta los horarios cambian por completo de un país a otro. En Inglaterra apenas hay vida social en la calle alrededor de la comida. La gente va con prisas entre el colegio, la universidad y el trabajo, así que aquel desayuno inglés contundente con huevos y beicon ha quedado reservado para los fines de semana. Entre semana desayunan, toman un almuerzo muy ligero sobre las doce y hacen una cena fuerte, nunca picante, a las seis o a las siete como muy tarde. En Francia, o sigues el horario a rajatabla o no comes: a las doce y media o la una cierran las cocinas y después ya no hay manera de que te den de comer.",
          "Lo que encontré en la India, distinto a cualquier otro país, es que la gente come a todas horas. No existe esa separación rígida de desayuno, comida y cena. Salgas a la hora que salgas, los puestos callejeros están llenos de gente comiendo, y por la noche se cena tranquilamente a las once, a medianoche o a la una de la madrugada. Podrías pensar que en España hacemos lo mismo, porque vas por cualquier ciudad española y ves siempre una casa, una tienda, un bar, una casa, una tienda, un bar, siempre con gente dentro. Pero cuando vives aquí ves que no es igual. En España no tenemos puestos callejeros salvo en fiestas; paramos en los bares a tomar un café por la mañana, un refresco o una cerveza, no a comer platos enteros a cada rato. Eso sí, en cuanto alguien entra en una casa en España, lo primero que ofrecemos es algo de beber y de picar: café con galletas por la mañana o a media tarde, una copa de vino o una cerveza con algo de picoteo pasado el mediodía o a partir de las siete, o algo de cenar si es tarde. Eso es muy español: no entendemos juntarnos sin comida.",
        ],
        images: [
          {
            url: "/food and culture/images.jpg",
            alt: "Familia cenando pollo asado con patatas a primera hora de la tarde en Inglaterra",
            caption:
              "En Inglaterra las familias hacen una cena contundente y sin picante sobre las seis o las siete de la tarde, horas antes de que empiece la cena aquí en la India.",
            aspectRatio: "4:3",
          },
          {
            url: "/food and culture/image.png_aa5ceb44_2K.jpg",
            alt: "Primer plano de idlis oscuros al vapor servidos con chutney especiado",
            caption:
              "Idlis oscuros al vapor con chutney especiado. Aquí en la India encuentras comida recién hecha prácticamente a cualquier hora del día o de la noche.",
            aspectRatio: "4:3",
          },
        ],
      },
      {
        heading: "Una misma receta, dos casas, un sabor completamente distinto",
        paragraphs: [
          "Viajar a otra zona de la India tampoco significa siempre probar platos nuevos cuando vas en grupo. Cuando estuvimos en Himachal, como todos veníamos desde Maharashtra, tendíamos a pedir lo mismo de siempre, quizá algún plato de cordero preparado de otra manera pero poco más. Donde de verdad he notado la variedad de la cocina india es dentro de las casas.",
          "Acaba de pasar Diwali y disfruté muchísimo de los aperitivos caseros, aunque sigo sin acordarme de sus nombres en maratí. Me acuerdo de los de espiral, los chakli, que me encantaron, y de otros pequeñitos y dulces como picatostes, los shankarpali. Me llamó mucho la atención el cambio tan grande de una casa a otra: en una el mismo aperitivo puede picar muchísimo y en la siguiente resulta suave, agradable y crujiente a mi gusto.",
          "Me pasa igual con los platos de pollo en salsa cremosa y con el biryani, que me gusta muchísimo. A veces el biryani es solo arroz con trozos de pollo y otras veces quien cocina consigue integrar todos los sabores en el grano. Shirish hace uno muy bueno, pero tengo que decir que el mejor biryani de pollo que he probado hasta ahora fue en casa de la hermana de un amigo suyo. Son musulmanes, nos invitaron a comer y aquel biryani no tenía comparación con ningún restaurante ni buen hotel, tanto por el punto del arroz como por lo integrados que estaban todos los sabores.",
        ],
        images: [
          {
            url: "/food and culture/pexels-saveurssecretes-5992263.jpg",
            alt: "Chakli crujientes en espiral junto a una prensa de latón y dos vasos de chai caliente",
            caption:
              "Los chakli en espiral de Diwali con chai caliente. Todavía se me olvida el nombre en maratí, y en cada casa cambian por completo de punto de picante.",
            aspectRatio: "4:5",
          },
          {
            url: "/food and culture/pexels-paratape-33472114.jpg",
            alt: "Cocinero sirviendo arroz biryani especiado desde una gran cazuela metálica",
            caption:
              "Sirviendo arroz biryani. Se nota enseguida cuando quien cocina integra todos los sabores en el arroz en lugar de dejar arroz suelto con pollo.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading: "Tres biryanis en Eid y las croquetas de mi madre para ocho",
        paragraphs: [
          'El año pasado en Eid, el día en que los musulmanes terminan el ayuno y cocinan en todas partes, lo pasé fatal del estómago porque todo el mundo nos invitó a su casa. Comí biryani tres veces en un solo día, tres comidas completas con su biryani y todos los entrantes. En la última casa estaba prácticamente enferma. Yo decía: "No, no, gracias, no puedo más", y me decían: "¡Pero cómo, no te gusta? ¡Come más!".',
          'Al principio me pasó muchas veces lo mismo, sobre todo en casa de Shirish. Su madre te da de comer, y te da, y te vuelve a dar. Por la noche yo no puedo comer tanta cantidad, y además una cena fuerte y picante no le sienta bien a mi estómago, acostumbrado a otra comida. Yo decía: "No, gracias, baba, ya he tomado suficiente", y ella insistía en que había comido poquísimo, hasta que un día me puse mala de verdad. Shirish se enfadó tanto que regañó a su madre, y yo le dije: "No, no hagas eso, que lo hacen con todo el cariño". Ahora que la gente con la que más trato me conoce bien, ya no me da apuro decir que estoy llena y no me insisten; al revés, me gastan la broma de decirme: "¿Quieres esto? ¿Quieres lo otro? ¡Pero no sientas que te estamos obligando!".',
          "Hablar de la comida de las madres me lleva siempre a la mía en España. A mi madre nunca le gustó cocinar; le disgustaba tanto que creía que no cocinaba bien, cuando en realidad tenía muy buena mano y hacía platos muy variados. Mi favorito eran sus croquetas. Hoy casi todo el mundo las hace redonditas y pequeñas, y por aquel entonces nadie las hacía de carne picada como ella. Guisaba la carne picada, la mezclaba con una bechamel de leche y harina, las rebozaba en pan rallado y freía unas croquetas enormes. Al morderlas estaban tan tiernas y cremosas por dentro que nadie podía igualar aquel sabor. En casa éramos ocho: cuatro hermanos, mis padres y mis abuelos. Hacer tantísimas croquetas llevaba muchísimo tiempo, así que ya no las prepara, pero siguen siendo mi plato favorito.",
        ],
      },
    ],
    takeaway: "",
    spanishTakeaway: "",
    seo: {
      title:
        "Three Biryanis on Eid: Alma on Food Across India, Spain, and Europe",
      description:
        "Alma shares her first-hand experience of eating across India, Spain, and Europe, including Diwali chakli, three Eid biryanis, and her mum's croquetas.",
    },
  },
  {
    slug: "giving-maharashtrian-sarees-a-second-life",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "01",
    publishedAt: "2026-11-11",
    readingTimeMinutes: 6,
    category: "Sustainable Fashion",
    location: "India & Spain",
    spanishLocation: "India y España",
    title:
      "Cupboard sarees in India, a suitcase in Madrid, and giving two wardrobes a second life",
    spanishTitle:
      "Saris guardados en la India, una maleta en Madrid y una segunda vida para dos armarios",
    summary:
      "Almarise began when we did not have the money for new organic fabric rolls and kept seeing thevnitlya sadya folded inside Indian cupboards. Wearing one over plain jeans or an old black dress in Spain ended up giving two wardrobes a second life at once.",
    spanishSummary:
      "Almarise empezó cuando no teníamos capital para encargar rollos nuevos de algodón orgánico y veíamos los thevnitlya sadya doblados en los armarios de la India. Ponerse uno encima de unos vaqueros o de un vestido negro olvidado acabó dando segunda vida a dos armarios a la vez.",
    author: {
      name: "Alma",
      role: "Co-founder, KarmaRise D Global",
      spanishRole: "Cofundadora de KarmaRise D Global",
      location: "Spain & India",
      spanishLocation: "España e India",
      portraitUrl: "/images/alma.jpeg",
    },
    tags: ["Almarise", "Indian sarees", "One-of-a-kind", "Spain & India"],
    spanishTags: [
      "Almarise",
      "Saris indios",
      "Piezas únicas",
      "España e India",
    ],
    leadImage: {
      url: "/images/alma_taking_a_look_at_design (1).jpeg",
      alt: "Alma and a young Indian tailor fitting an open floor-length turquoise embroidered saree coat on a dressmaker form beside a sewing machine in our studio in India",
      caption:
        "Fitting an open turquoise embroidered saree layer on the form in our studio in India, working one piece at a time.",
    },
    spanishLeadAlt:
      "Alma y una joven sastre ajustando un abrigo largo abierto de sari azul turquesa bordado sobre el maniquí junto a la máquina de coser en nuestro estudio en la India",
    spanishLeadCaption:
      "Ajustando una prenda abierta de sari turquesa bordado sobre el maniquí en nuestro estudio en la India, pieza por pieza.",
    leadSlot: {
      kind: "Photo",
      ratio: "16:9 wide",
      title: "Fitting a saree coat on the dressmaker form",
      description:
        "16:9 studio photograph of Alma and a tailor fitting an open turquoise embroidered saree layer on a dressmaker form beside an industrial sewing machine in India.",
    },
    pullQuote: {
      text: "Nobody could picture what I was talking about until I opened my suitcase in Madrid. When you put a non-worn saree from India over old clothes sitting in the back of your closet in Spain, you give both pieces a second life at the same time.",
      attribution: "Alma",
    },
    spanishPullQuote: {
      text: "Nadie lograba hacerse una idea con mis explicaciones hasta que abrí la maleta en Madrid. Cuando te pones un sari que ya no se usa en la India encima de ropa olvidada en tu armario en España, les das una segunda vida a las dos prendas a la vez.",
      attribution: "Alma",
    },
    pairImages: [
      {
        url: "/images/maria_7.jpeg",
        alt: "Maria walking across a sunlit brick apartment street in Madrid wearing an olive floral saree shrug with purple striped pallu sleeves and paisley hem over a black dress",
        caption:
          "Out walking in Madrid: cut so the saree's striped pallu forms the sleeves and the paisley border runs along the lower hem.",
      },
      {
        url: "/images/maria_1.jpeg",
        alt: "Maria standing on a commuter rail platform in Madrid in front of a red-and-white Renfe Cercanías train wearing an asymmetric tunic cut from a geometric rust-and-black saree",
        caption:
          "An asymmetric tunic cut from one geometric saree on a commuter rail platform in Madrid. No second copy exists anywhere.",
      },
    ],
    spanishPairAlts: [
      "María caminando por una calle madrileña de edificios de ladrillo al sol con un shrug floral oliva de sari con mangas listadas del pallu y bajo de cachemira sobre vestido negro",
      "María en un andén de Madrid frente a un tren de Renfe Cercanías con una túnica asimétrica cortada de un sari geométrico en tono teja y negro",
    ],
    spanishPairCaptions: [
      "Caminando por Madrid: cortado para que las rayas del pallu dibujen las mangas y la cenefa de cachemira remate el bajo.",
      "Una túnica asimétrica cortada a partir de un único sari geométrico en un andén de cercanías en Madrid. No hay otra igual.",
    ],
    pairSlots: [
      {
        title: "Border and pallu street layer",
        description:
          "Portrait photo 4:5: saree-derived shrug worn outdoors in Madrid.",
      },
      {
        title: "Commuter platform asymmetric tunic",
        description:
          "Portrait photo 4:5: one-off asymmetric tunic worn on a commuter rail platform in Madrid.",
      },
    ],
    sections: [
      {
        heading: "Tight funds, full cupboards, and why I call them shrugs",
        paragraphs: [
          "Almarise never started as a neat plan on paper. When Shirish and I first talked about making clothes in India, we wanted to start with organic cotton, and to be completely honest, we did not have the startup money to commission new organic fabric rolls from a mill.",
          "At the same time, stepping into houses across India, we kept seeing what Marathi families call thevnitlya sadya: those treasured wedding and festival sarees women keep folded in cupboards long after they stop wearing them. Instead of buying new fabric by the metre, we decided to ask women if they wanted to pass unused sarees on to Almarise, either as a donation or for a fair payment, and share the previous owner's photo and story online whenever she agrees.",
          'I kept the English word "shrug" for what we make, even though we sew both open and closed styles and "shrug" usually means an open piece. In Spanish the closest option would be sobretodo, an outer coat or wrap, and the two or three other Spanish words I tried all fell short somewhere. Keeping "shrug" is simpler: people start learning right away what kind of piece they are getting. When you wear one over a plain top, jeans, or a black dress that has been hanging in your wardrobe for ages because you got fed up with it, the whole outfit changes in seconds. You take a saree nobody wears anymore in India, pair it with old clothes already sitting in your closet in Europe, and both get a second life at once.',
        ],
        images: [
          {
            url: "/images/alma_with_a_woman (2).jpeg",
            alt: "Alma and Shirish inside a home near Mumbai receiving a bright orange silk saree with woven purple and gold zari border from its owner",
            caption:
              "Receiving an orange silk saree with its woven border inside an Indian home and hearing where it was worn before giving it a second life.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading:
          '"Born in India," a Spanish dress by accident, and the morning commute',
        paragraphs: [
          "In ordinary bulk manufacturing, a client orders fifty, a hundred, or two hundred units of the same design. You cut one pattern, grade the sizes, and two hundred women walk out wearing the exact same thing. An existing five-to-nine-yard saree works the other way around. Each saree has its own fabric weight, its decorative pallu end, and woven zari borders, so we inspect every length by hand and make a single pattern for a single garment.",
          'Our motto for Almarise is "Born in India," not only "Made in India." Most local designers and pattern masters have never dealt with European clients, so when I sat down over stacks of sarees with final-year design students near Mumbai, they did not even know where Spain was. Yet one student picked up a saree and drew a dress straight out of traditional Spanish folklore. I looked at her sketch and asked, "Have you done any research on Spanish dress?" She had no idea what I meant. The saree itself invited her pencil to draw it.',
          "Working around that table also showed me how much everyday routines change between countries. Near Mumbai, women commuting one to three hours toward Nashik for corporate jobs can still drape a saree in the morning because a company cab picks them up right at their gate. Back in Spain or anywhere else in Europe, women take the underground, the commuter train, and the bus, sometimes all three in one day, and nobody down the street is waiting to stitch a fitted choli blouse for you. Whatever we cut from a saree has to go on cleanly in ten seconds before you walk out the door.",
        ],
        images: [
          {
            url: "/images/alma_kalyan_fashion_studio_2_saree_stack_students.jpeg",
            alt: "Alma leaning across a red studio table stacked with turquoise, cream, red bandhani, and pink sarees alongside final-year fashion design students near Mumbai",
            caption:
              "Going through stacks of sarees with final-year design students near Mumbai before sketching silhouettes straight from each weave.",
            aspectRatio: "4:3",
          },
          {
            url: "/images/alma_kalyan_fashion_studio_4_reviewing_student_sketches.jpeg",
            alt: "Alma and a hijab-wearing fashion student looking over printed saree swatch sheets and pencil garment sketches on the studio desk",
            caption:
              "Reviewing pencil garment sketches beside fabric and colour notes to turn Indian drapes into easy European layers.",
            aspectRatio: "4:3",
          },
        ],
      },
      {
        heading:
          "Opening a suitcase in Madrid and wrapping after dark at Estación de Príncipe Pío",
        paragraphs: [
          "In Spain, trying to explain the idea in words got me nowhere. Family, friends, acquaintances, and Maria herself: nobody had any picture in their head of what an upcycled Indian saree looked like. So I stopped talking and set up a shoot in old Madrid without showing a single piece beforehand to Maria or even to the photographer. I gave Maria one rule: bring plain clothes you already own in black, white, and denim.",
          'When we met and I opened my suitcase right there, each piece came out and Maria went, "Ooh! Ooh!" I matched shrugs to what she had brought, and when she asked, "Can I wear shorts with this?" I told her, "Yes, go ahead." Because she moved and walked freely instead of holding stiff catalogue poses, passersby turned their heads immediately. Every time someone stopped to stare, I walked over and asked, "Can I have a word with you?" Almost everybody told me, "Oh wow, that is a good idea." We were so early back then that we had no website, no social page, and no QR code to scan, only a few phone numbers I called afterward. Next time I walk Madrid or Donostia like that, I am carrying a scannable QR code in my pocket.',
          'Late that September evening, we walked down to Estación de Príncipe Pío, Madrid\'s old railway terminal where long-distance trains no longer depart and part of the historic building now hosts concerts and live shows. When I moved closer to the platforms and train wagons without a permit, male security guards stopped us immediately. I told them we were three friends taking amateur photos of garments I had made at home. Then a female security guard stepped up, told her colleague, "I handle this," and quietly coached us to walk down to the far end where nobody would notice, stay quick, and put away the analog camera in favour of a normal everyday one. By the time we finished, it was between ten and ten-thirty at night and completely dark.',
        ],
        images: [
          {
            url: "/images/maria_2.jpeg",
            alt: "Maria sitting outdoors in Madrid wearing an orange and yellow tie-dyed bandhani saree shrug over frayed denim jeans and sandals in front of Puerta de San Vicente",
            caption:
              "Maria beside Puerta de San Vicente and Estación de Príncipe Pío, wearing an orange bandhani saree shrug over the jeans she brought from home.",
            aspectRatio: "4:5",
          },
          {
            url: "/images/maria_5.jpeg",
            alt: "Maria standing under the painted green iron arches of Estación de Príncipe Pío in Madrid wearing an open magenta gold-dot saree shrug over a plain black slip dress",
            caption:
              "Under the green iron arches at Estación de Príncipe Pío during our September shoot, pairing a sheer magenta saree shrug with Maria's black dress.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading: "From a September wedding in Donostia to closing the circle",
        paragraphs: [
          "At the end of the session, I asked Maria which piece she wanted to keep as a gift. She could not decide between everyday wear and something dressier, and finally picked a white shrug she had worn earlier at the station, the very one where strangers kept stopping to ask where to buy it.",
          "Hearing Maria and other women try the pieces on led to our next practical change. Because chiffon and georgette sarees are see-through, pairing an open shrug with an optional plain strap slip dress or light lining turns one garment into two options: an easy layer over trousers, or a full dress on its own.",
          "Walking neighbourhood streets in Donostia at least four days a week during the August second sales, segundas rebajas, showed me why that matters. I saw a kaftan-style shrug in a shop window and stayed listening inside while a customer looked for an outfit for a September wedding. The shopkeeper held up a plain shiny satin slip dress underneath, added a necklace, bangles, and earrings, and showed her how it made a proper wedding outfit, not just dinner clothes. Many Indian sarees already carry mirror work and fine embroidery, so the same garment goes naturally from a September wedding to jeans on a casual evening with friends.",
          "Shirish always puts why we care so much about Almarise in one line: it starts as a woman's saree in India, it is cut and stitched by a woman in our studio, and it is worn by a woman in Spain or across Europe.",
        ],
      },
    ],
    spanishSections: [
      {
        heading: "Poco capital, armarios llenos y por qué los llamo shrugs",
        paragraphs: [
          "Almarise no empezó como un plan cerrado en un despacho. Cuando Shirish y yo empezamos a hablar de hacer ropa en la India, nuestra primera idea era trabajar con algodón orgánico, pero siendo sinceros, no teníamos el capital inicial para encargar rollos de tela nueva a una fábrica.",
          "A la vez, entrando en casas por la India, veíamos una y otra vez lo que las familias maratíes llaman thevnitlya sadya: esos saris tan queridos de bodas y celebraciones que las mujeres guardan doblados cuando dejan de usarlos. En lugar de comprar tela nueva por metros, decidimos preguntar a las mujeres si querían cedernos esos saris que ya no se ponían, bien como donación o con un pago justo, y compartir la historia y el recuerdo de su dueña en la web siempre que ella nos dé permiso.",
          "Para llamar a estas prendas seguí usando la palabra inglesa shrug, aunque hagamos modelos abiertos y cerrados y shrug suene más a prenda abierta. En español la opción más cercana sería sobretodo, y otras dos o tres palabras que probé tenían todas algún fallo. Mantener shrug es más práctico para que la gente sepa de entrada qué prenda va a recibir. Te la pones encima de una camiseta lisa, unos vaqueros o un vestido negro que llevabas años sin sacar del armario porque ya te habías cansado de él, y el conjunto cambia al momento. Juntas un sari sin uso de la India con ropa olvidada en Europa y les das una segunda vida a los dos.",
        ],
        images: [
          {
            url: "/images/alma_with_a_woman (2).jpeg",
            alt: "Alma y Shirish en una casa cerca de Bombay recibiendo un sari de seda naranja con cenefa tejida morada y dorada de manos de su dueña",
            caption:
              "Recogiendo un sari de seda naranja con su cenefa tejida en una casa en la India y escuchando su historia antes de darle una segunda vida.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading:
          "«Nacido en la India», un vestido español por casualidad y el metro de cada día",
        paragraphs: [
          "En la fabricación en serie, un cliente encarga cincuenta, cien o doscientas unidades del mismo modelo. Trazas un patrón, escalas tallas y doscientas mujeres llevan exactamente la misma chaqueta. Con un sari de entre cinco y ocho metros todo funciona al revés. Cada sari tiene su caída, un extremo decorativo llamado pallu y cenefas tejidas con hilo zari, así que revisamos la tela a mano y sacamos un patrón distinto para una sola prenda.",
          "Nuestro lema en Almarise es «Nacido en la India», no solo «Hecho en la India». Como la mayoría de diseñadores y patronistas locales no han tratado nunca con clientas extranjeras, cuando me senté frente a pilas de saris con estudiantes de último año de diseño cerca de Bombay, ni siquiera sabían dónde estaba España. Aun así, una chica cogió un sari y dibujó un vestido casi clavado al traje folclórico español. Al ver la lámina le pregunté: «¿Has buscado algo sobre trajes españoles?». No entendía por qué se lo decía; fue el propio estampado del sari el que la llevó hasta allí.",
          "Aquella tarde también tocó explicar cómo cambia la rutina diaria de un país a otro. Cerca de Bombay, muchas mujeres que trabajan en oficinas a una, dos o tres horas de camino hacia Nashik pueden ir en sari porque un coche de empresa las recoge en la puerta de casa. En España y en Europa vamos en metro, cercanías y autobús, a veces en los tres el mismo día, y nadie en la esquina te cose una blusa choli ajustada a medida. Necesitas una prenda que te pongas en diez segundos antes de salir por la puerta.",
        ],
        images: [
          {
            url: "/images/alma_kalyan_fashion_studio_2_saree_stack_students.jpeg",
            alt: "Alma sobre una mesa roja con pilas de saris turquesa, crema, bandhani rojo y rosa junto a estudiantes de último año de diseño cerca de Bombay",
            caption:
              "Revisando pilas de saris con estudiantes de último año de diseño cerca de Bombay antes de dibujar cada silueta a partir de la tela.",
            aspectRatio: "4:3",
          },
          {
            url: "/images/alma_kalyan_fashion_studio_4_reviewing_student_sketches.jpeg",
            alt: "Alma y una estudiante de moda con hiyab revisando muestras impresas de saris y bocetos a lápiz sobre la mesa del estudio",
            caption:
              "Repasando bocetos a lápiz junto a las muestras de color y tejido para llevar los saris al uso diario en Europa.",
            aspectRatio: "4:3",
          },
        ],
      },
      {
        heading:
          "Abrir la maleta en Madrid y recoger de noche en la Estación de Príncipe Pío",
        paragraphs: [
          "De vuelta en España, explicarlo de palabra no servía de nada. Familiares, amigos, conocidos y la propia María no lograban imaginarse cómo quedaba aquello. Así que dejé de dar vueltas y quedé con María y con un fotógrafo en el Madrid antiguo sin enseñarles ni una sola prenda antes. A María solo le pedí que trajera ropa básica suya en negro, blanco y vaquero.",
          "Cuando nos vimos y abrí la maleta allí mismo, conforme sacaba piezas María solo decía: «¡Oh! ¡Oh!». Fui combinando los shrugs con lo que ella había traído, y cuando me preguntó si podía ponerse pantalones cortos debajo le dije que adelante. Como caminaba con naturalidad en lugar de posar rígida, la gente se giraba por la acera. Cada vez que alguien se paraba a mirar me acercaba a preguntar si podía charlar un minuto, y casi todo el mundo respondía: «Oye, pues es muy buena idea». Todavía íbamos tan al principio que no teníamos web, redes sociales ni un código QR que enseñar, solo unos cuantos teléfonos que apunté para llamar después. La próxima vez que salga así por Madrid o Donostia llevaré un QR listo para escanear en la calle.",
          "Al final de aquella tarde de septiembre fuimos hacia la Estación de Príncipe Pío, el antiguo edificio ferroviario donde ya no salen trenes de largo recorrido y parte de la estación histórica se ha reformado para conciertos y espectáculos. En cuanto me acerqué a la zona de vías y vagones sin permiso, nos pararon varios vigilantes de seguridad. Les expliqué que éramos tres amigos haciendo fotos caseras de ropa hecha en casa. Entonces se acercó una vigilante, miró a su compañero y le dijo: «Yo me encargo». En voz baja nos dijo que nos fuéramos al extremo más apartado para no llamar la atención, que no tardáramos mucho y que guardáramos la cámara analógica para hacer las fotos con una cámara normal, como amigos sacándose recuerdos. Cuando terminamos ya eran entre las diez y las diez y media de la noche y estaba oscuro del todo.",
        ],
        images: [
          {
            url: "/images/maria_2.jpeg",
            alt: "María sentada al aire libre en Madrid con un shrug naranja y amarillo de sari bandhani sobre unos vaqueros desgastados y sandalias frente a la Puerta de San Vicente",
            caption:
              "María junto a la Puerta de San Vicente y la Estación de Príncipe Pío con un shrug naranja de sari bandhani sobre sus propios vaqueros.",
            aspectRatio: "4:5",
          },
          {
            url: "/images/maria_5.jpeg",
            alt: "María bajo los arcos verdes de hierro de la Estación de Príncipe Pío en Madrid con un shrug magenta de topos dorados abierto sobre un vestido liso negro",
            caption:
              "Bajo los arcos verdes de hierro de la Estación de Príncipe Pío en la sesión de septiembre, llevando un shrug magenta sobre su vestido negro.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading: "De una boda en Donostia a cerrar el círculo",
        paragraphs: [
          "Al acabar la sesión le dije a María que eligiera la prenda que quisiera de la maleta para regalársela. Dudó entre algo de diario o algo más arreglado y se quedó un shrug blanco que se había puesto antes en la estación, justo con el que varios viajeros se habían acercado a preguntar dónde comprarlo.",
          "Hablar después con María y con otras mujeres nos dio el siguiente ajuste práctico. Como muchos saris de gasa o georgette dejan pasar la luz, ofrecer el shrug junto a un vestido liso de tirantes o un forro ligero convierte cada pieza en dos opciones: una chaqueta abierta sobre vaqueros o un vestido completo.",
          "Pateando las tiendas de Donostia cuatro días a la semana durante las segundas rebajas de agosto lo vi delante de mí. Había un shrug tipo caftán en un escaparate y me quedé escuchando dentro a una mujer que buscaba conjunto para una boda en septiembre. La dependienta sacó debajo un vestido lencero satinado liso, le sumó un collar, pulseras y pendientes y le demostró que tenía traje para una boda, no solo para salir a cenar. Muchos saris indios llevan espejitos y bordados finos, así que pasan solos de una boda de septiembre a una cena informal con vaqueros.",
          "Shirish resume siempre por qué queremos tanto a Almarise en una frase: empieza siendo el sari de una mujer en la India, lo corta y lo cose una mujer en nuestro estudio y acaba vistiéndolo otra mujer en España o en Europa.",
        ],
      },
    ],
    takeaway: "",
    spanishTakeaway: "",
    seo: {
      title:
        "Almarise: Cupboard Sarees in India, a Suitcase in Madrid, and Giving Two Wardrobes a Second Life",
      description:
        "Alma shares how tight funds, thevnitlya sadya sarees, design students near Mumbai, Estación de Príncipe Pío in Madrid, and Donostia weddings shaped Almarise.",
      spanishTitle:
        "Almarise: saris guardados en la India, una maleta en Madrid y segunda vida para dos armarios",
      spanishDescription:
        "Alma cuenta cómo el capital justo, los saris thevnitlya sadya, estudiantes cerca de Bombay, la Estación de Príncipe Pío y Donostia dieron forma a Almarise.",
    },
  },
  {
    slug: "matching-a-workshop-to-the-product",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "01",
    publishedAt: "2026-11-08",
    readingTimeMinutes: 5,
    category: "People & Craftsmanship",
    location: "Across India",
    spanishLocation: "Por toda la India",
    title:
      "Why we audit workshops across India in person before placing a programme",
    spanishTitle:
      "Por qué visitamos y evaluamos en persona los talleres en la India antes de asignar un proyecto",
    summary:
      "A factory that excels at high-volume cotton shirts is rarely equipped for structured leather goods. Here is how Alma and Shirish select the right Manufacturing Partner for each product.",
    spanishSummary:
      "Una fábrica excelente haciendo camisas de algodón en grandes tiradas rara vez es el lugar adecuado para producir bolsos de piel estructurada. Así elegimos al taller idóneo para cada producto.",
    author: {
      name: "Shirish & Alma",
      role: "Co-founders, KarmaRise D Global",
      spanishRole: "Cofundadores de KarmaRise D Global",
      location: "India & Spain",
      spanishLocation: "India y España",
      portraitUrl: "/images/shirish.jpeg",
    },
    tags: [
      "Manufacturing Partner",
      "Workshop evaluation",
      "Leather & textiles",
      "India",
    ],
    spanishTags: [
      "Socio de fabricación",
      "Evaluación de talleres",
      "Piel y textil",
      "India",
    ],
    leadImage: {
      url: "/images/shirish_with_workers_at_warehouse (5).jpeg",
      alt: "Shirish observing a craftsman stitching a heavy strap on an industrial cylinder-bed machine",
      caption:
        "Shirish on the workshop floor reviewing stitch tension and strap construction with a master machine operator.",
    },
    spanishLeadCaption:
      "Shirish en el taller revisando la tensión de la puntada y el armado de una correa junto a un maestro maquinista.",
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Artisan working at a specialised machine",
      description:
        "4:3 candid photo of an artisan or master tailor working at a specialised sewing or leather skiving machine inside an Indian workshop.",
    },
    pullQuote: {
      text: "Matching a Client's product and order volume to a workshop's actual machinery and daily specialisation is the single most important decision in a Manufacturing Programme.",
      attribution: "Shirish · KarmaRise D Global",
    },
    spanishPullQuote: {
      text: "Hacer coincidir el tipo de producto y el volumen del encargo con la maquinaria real y la especialidad diaria del taller es la decisión más importante de todo el proceso.",
      attribution: "Shirish · KarmaRise D Global",
    },
    pairImages: [
      {
        url: "/images/shirish_with_workers_at_warehouse (8).jpeg",
        alt: "An artisan at a preparation bench with stacked bag components",
        caption:
          "Prepared strap and lining components organised in bundles before assembly.",
      },
      {
        url: "/media (ai generated)/shirish_with_workers_at_warehouse_(8).jpeg_0cb1fe12_2K.jpg",
        alt: "Shirish reviewing striped lining fabric and hardware preparation with a workshop specialist",
        caption:
          "Checking lining cut consistency and zipper preparation on the workshop floor in India.",
      },
    ],
    spanishPairCaptions: [
      "Componentes de correas y forros organizados y listos para entrar en la línea de montaje.",
      "Comprobando la regularidad del corte de los forros y la preparación de cremalleras en el taller en la India.",
    ],
    pairSlots: [
      {
        title: "Workshop line layout",
        description:
          "Portrait photo (4:5): mid-distance view of stitching stations showing light, spacing, and active work in progress.",
      },
      {
        title: "Reviewing regional craft skills",
        description:
          "Portrait photo (4:5): conversation with a Manufacturing Partner lead inspecting finished trim and material handling.",
      },
    ],
    sections: [
      {
        heading: "Specialisation over general promises",
        paragraphs: [
          "Almost any manufacturer will say yes to an enquiry over email. Stepping inside the facility tells a very different story. Structured leather bags require skiving machines, heavy cylinder-bed stitchers, climate-controlled edge-paint drying, and artisans trained to read hide grain. Fine resort wear requires clean flat-bed lines, delicate pressing equipment, and pattern rooms accustomed to lightweight fabrics.",
          "Alma and Shirish travel together across production clusters throughout India to inspect machinery, review current production lines, and speak directly with workshop owners and master tailors.",
        ],
      },
      {
        heading: "Aligning factory scale with order volume",
        paragraphs: [
          "Technical capability is only half of the equation; production scale matters just as much. A large export plant running fifty-thousand-unit programmes will inevitably deprioritise a three-hundred-piece order, while a small boutique workshop will struggle if asked to deliver five thousand units on a tight retail calendar.",
          "We pair each Client with a Manufacturing Partner whose capacity fits their Bulk Order, and Shirish puts clear, fair commercial terms in place so both sides can build a lasting working relationship.",
        ],
      },
    ],
    spanishSections: [
      {
        heading: "Especialización real frente a promesas generales",
        paragraphs: [
          "Por correo electrónico casi cualquier fabricante dirá que puede producir tu colección. Entrar en sus instalaciones cuenta una historia muy distinta. Los bolsos de piel estructurada exigen máquinas de rebajar, costura en brazo cilíndrico, secado cuidadoso para el tinte de los cantos y artesanos acostumbrados a trabajar pieles naturales. Las prendas ligeras requieren líneas planas impecables y equipos de planchado específicos.",
          "Alma y Shirish viajan juntos por distintas zonas productivas de toda la India para inspeccionar la maquinaria, ver qué se está fabricando en ese momento y hablar en persona con los dueños y encargados de cada taller.",
        ],
      },
      {
        heading: "Ajustar la escala del taller al volumen del pedido",
        paragraphs: [
          "La capacidad técnica es solo la mitad de la ecuación; el tamaño del taller importa igual. Una gran planta de exportación centrada en pedidos de cincuenta mil unidades siempre dejará en segundo plano una tirada de trescientas piezas, mientras que un taller pequeño se verá desbordado si se le piden cinco mil unidades en pocas semanas.",
          "Conectamos a cada cliente con un socio de fabricación cuyo ritmo encaje de verdad con su pedido, y Shirish se asegura de dejar cerrados acuerdos claros y justos para que ambas partes puedan trabajar a largo plazo.",
        ],
      },
    ],
    takeaway:
      "Selecting a Manufacturing Partner based on verified machinery, craft specialisation, and matching scale protects both product quality and delivery dates.",
    spanishTakeaway:
      "Elegir el taller adecuado comprobando en persona su maquinaria, su especialidad y su capacidad protege tanto el acabado del producto como los plazos de entrega.",
    seo: {
      title: "How We Audit and Select Indian Manufacturing Partners",
      description:
        "Why Alma and Shirish inspect workshops across India in person to match each Client Product Brief with the right specialist factory.",
    },
  },
  {
    slug: "why-sample-approval-decides-bulk",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "01",
    publishedAt: "2026-11-04",
    readingTimeMinutes: 4,
    category: "Art & Design",
    location: "India & Spain",
    spanishLocation: "India y España",
    title:
      "What we verify on a pre-production sample before bulk materials are ordered",
    spanishTitle:
      "Qué comprobamos en cada muestra de preproducción antes de encargar el material del pedido",
    summary:
      "A technical drawing shows dimensions, not how a leather strap carries weight or how a lining moves. Here is how we review and lock in every pre-production sample.",
    spanishSummary:
      "Un dibujo técnico indica las medidas, pero no cómo responde un asa de piel al peso ni cómo cae un forro. Así revisamos y validamos cada prototipo antes de producir.",
    author: {
      name: "Alma & Shirish",
      role: "Co-founders, KarmaRise D Global",
      spanishRole: "Cofundadores de KarmaRise D Global",
      location: "India & Spain",
      spanishLocation: "India y España",
      portraitUrl: "/images/alma-and-shirish-founders.jpg",
    },
    tags: ["Sampling", "Quality control", "Leather & textiles", "Bulk Order"],
    spanishTags: [
      "Muestras",
      "Control de calidad",
      "Piel y textil",
      "Producción",
    ],
    leadImage: {
      url: "/images/alam_with_the_warehouse_owners (2).jpeg",
      alt: "Alma and two workshop specialists examining the drape and colour of a purple leather hide",
      caption:
        "Alma and workshop specialists examining hide thickness, softness, and dye consistency across whole skins in India.",
    },
    spanishLeadCaption:
      "Alma y los especialistas del taller comprobando el grosor, la suavidad y la uniformidad del tinte en pieles enteras en la India.",
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Two prototypes compared side by side",
      description:
        "4:3 documentary photograph of two bag or garment prototypes placed side by side with adjustment marks.",
    },
    pullQuote: {
      text: "You cannot judge seam tension, zipper glide, or leather temper from a photograph. Every pre-production sample has to be tested in the hand before bulk production begins.",
      attribution: "Alma & Shirish · Sampling review",
    },
    spanishPullQuote: {
      text: "La tensión de una costura, la suavidad de una cremallera o el cuerpo de una piel no se pueden juzgar por foto. Cada muestra hay que ponerla a prueba en mano antes de producir.",
      attribution: "Alma y Shirish · Revisión de muestras",
    },
    pairImages: [
      {
        url: "/images/alma_at_the_warehouse (3).jpeg",
        alt: "Alma inspecting stacked natural canvas fabric in an Indian workshop",
        caption:
          "Checking canvas weight and weave uniformity in the workshop before batch marking.",
      },
      {
        url: "/images/alma_taking_a_look_at_design (2).jpeg",
        alt: "Alma and a garment maker pinning embroidered teal fabric on a dress form in the studio in India",
        caption:
          "Alma and a tailor draping and pinning a garment sample on the form in our studio in India to verify balance and fall.",
      },
    ],
    spanishPairCaptions: [
      "Revisando el gramaje de la lona y la regularidad del tejido en el taller antes del marcado.",
      "Alma y una sastre ajustando con alfileres una muestra sobre el maniquí en nuestro estudio en la India para comprobar su caída y equilibrio.",
    ],
    pairSlots: [
      {
        title: "Stitch density and hardware check",
        description:
          "Portrait photo (4:5): close-up of hands inspecting seam tension, edge finish, and hardware attachment on a prototype.",
      },
      {
        title: "Material swatch verification",
        description:
          "Portrait photo (4:5): approved dye swatch resting beside fresh incoming leather hides or woven textile bolts.",
      },
    ],
    sections: [
      {
        heading: "Testing the physical prototype in India",
        paragraphs: [
          "Drawings and spec sheets establish measurements, but they cannot tell you if a bag loses its posture when packed or if a garment pulls across the shoulders. Sampling exists to answer those questions before bulk leather hides, fabrics, or custom hardware are purchased.",
          "In our studio and on site at our partner workshops across India, Alma and Shirish inspect every prototype by hand, checking stitch density, edge finishing, lining allowance, hardware weight, and structural balance under real use.",
        ],
      },
      {
        heading: "Turning sample feedback into a binding benchmark",
        paragraphs: [
          "A first prototype almost always reveals refinements: shifting a strap anchor by ten millimetres, upgrading to a firmer interlining, or adjusting a dye lot to match the original swatch under daylight.",
          "Once those revisions are approved by the Client, we update the written Product Brief and seal a tagged counter-sample that stays on the production floor as the physical reference for the entire Bulk Order.",
        ],
      },
    ],
    spanishSections: [
      {
        heading: "Probar el prototipo físico sobre el terreno",
        paragraphs: [
          "Los planos y fichas técnicas fijan las dimensiones, pero no revelan si un bolso pierde su estructura al llenarlo o si una prenda tira de sisa al moverse. La fase de muestreo sirve precisamente para resolver esas dudas antes de comprar las pieles, las telas o los herrajes definitivos.",
          "En nuestro estudio y en los propios talleres de la India, Alma y Shirish revisan cada prototipo a mano: comprueban la densidad de puntada, el acabado de los cantos, la holgura de los forros, el peso de los herrajes y el comportamiento de la pieza en uso real.",
        ],
      },
      {
        heading: "Convertir cada ajuste en una referencia firme",
        paragraphs: [
          "El primer prototipo casi siempre permite afinar detalles: desplazar un enganche diez milímetros, elegir una entretela con más cuerpo o ajustar el tinte para clavarlo a la carta de color bajo luz natural.",
          "Una vez que el cliente aprueba esas mejoras, actualizamos el Product Brief y dejamos en la fábrica una muestra gemela etiquetada y firmada que sirve de guía física durante toda la producción.",
        ],
      },
    ],
    takeaway:
      "Rigorous physical sample testing and a signed factory counter-sample prevent costly surprises during bulk production.",
    spanishTakeaway:
      "Una revisión exigente de la muestra física y un prototipo firmado en planta evitan sorpresas costosas cuando arranca la producción en serie.",
    seo: {
      title: "Why Pre-Production Sample Approval Decides Bulk Quality",
      description:
        "How Alma and Shirish inspect physical prototypes in India before ordering bulk materials.",
    },
  },
  {
    slug: "stone-forts-and-woven-borders-in-maharashtra",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "01",
    publishedAt: "2026-10-29",
    readingTimeMinutes: 7,
    category: "Heritage & Culture",
    location: "Maharashtra, India",
    spanishLocation: "Maharashtra, India",
    title:
      "Basalt forts, woven borders, and the Maharashtra behind the monuments",
    spanishTitle:
      "Fuertes de basalto, cenefas tejidas y el Maharashtra que hay detrás de los monumentos",
    summary:
      "Walk past our famous hill forts and you find the real Maharashtra in Modi script signatures, thousand-year Marathi verse, Paithani and Karvati looms, and the sarees women keep in family cupboards.",
    spanishSummary:
      "Más allá de nuestros fuertes de montaña, el verdadero Maharashtra vive en las firmas en escritura modi, mil años de literatura maratí, los telares de Paithani y Karvati y los saris que las mujeres guardan en casa.",
    author: {
      name: "Shirish",
      role: "Co-founder, KarmaRise D Global",
      spanishRole: "Cofundador de KarmaRise D Global",
      location: "India & Spain",
      spanishLocation: "India y España",
      portraitUrl: "/images/shirish.jpeg",
    },
    tags: [
      "Maharashtra",
      "Maratha forts",
      "Paithani & handloom",
      "Women's attire",
    ],
    spanishTags: [
      "Maharashtra",
      "Fuertes marathas",
      "Paithani y telar",
      "Vestimenta femenina",
    ],
    leadImage: {
      url: "/images/forts (4).jpg",
      alt: "Aerial view of stone bastions, courtyard foundations, and arched stone pavilion at Shivneri Fort in Pune district, Maharashtra",
      caption:
        "Shivneri Fort in Pune district, where Chhatrapati Shivaji Maharaj was born. Our hill forts were cut into Sahyadri basalt to hold ground through monsoon rain, though Maharashtra's real story lives in the people who grew up around them.",
    },
    spanishLeadAlt:
      "Vista aérea de las murallas de piedra, los cimientos del patio y el pabellón arqueado del fuerte de Shivneri en el distrito de Pune, Maharashtra",
    spanishLeadCaption:
      "El fuerte de Shivneri, en el distrito de Pune, donde nació Chhatrapati Shivaji Maharaj. Nuestros fuertes de montaña se tallaron en el basalto del Sahyadri para resistir los monzones, aunque la verdadera historia de Maharashtra está en su gente.",
    leadSlot: {
      kind: "Photo",
      ratio: "16:10 horizontal",
      title: "Shivneri Fort stone bastions and courtyard in Maharashtra",
      description:
        "Wide architectural photograph of Shivneri Fort in Pune district in daylight.",
    },
    pullQuote: {
      text: "A Chinese traveller passing through the Deccan over a thousand years ago wrote that people here are fierce in a fight, yet will give their lives for a friend. Our geography made us tough, and just as warm once you know us.",
      attribution: "Shirish",
    },
    spanishPullQuote: {
      text: "Un viajero chino que cruzó el Decán hace más de mil años dejó escrito que aquí la gente es dura en la pelea, pero capaz de dar la vida por un amigo. Nuestra geografía nos hizo recios y, a la vez, profundamente leales.",
      attribution: "Shirish",
    },
    pairImages: [
      {
        url: "/images/maharashtra-festive-paithani-attire.jpg",
        alt: "Maharashtrian woman laughing outdoors in a crimson silk saree with gold zari borders, Paithani peacock pallu, pearl nath, gold thushi, and green glass bangles",
        caption:
          "Festive dress in Maharashtra: a crimson silk saree with woven gold zari borders and Paithani peacock motifs on the pallu, worn with a fitted choli, pearl nath on the left nostril, gold thushi choker, and green glass bangles.",
      },
      {
        url: "/images/alma_with_a_woman (2).jpeg",
        alt: "Alma inside a Maharashtra home beside a local woman holding a folded orange saree with a purple and gold zari border",
        caption:
          "Alma inside a home here in Maharashtra with a woman holding one of her kept family sarees, woven with a purple and gold zari border.",
      },
    ],
    spanishPairAlts: [
      "Mujer de Maharashtra riendo al aire libre con un sari de seda carmesí de cenefas doradas zari, pallu Paithani de pavos reales, nath de perlas, gargantilla thushi de oro y pulseras verdes de cristal",
      "Alma dentro de una casa en Maharashtra junto a una mujer que sostiene un sari naranja doblado con cenefa tejida en púrpura y oro",
    ],
    spanishPairCaptions: [
      "Vestimenta festiva en Maharashtra: sari de seda carmesí con cenefas doradas zari y motivos de pavo real Paithani en el pallu, acompañado de blusa ajustada choli, nath de perlas en la nariz, gargantilla thushi de oro y pulseras verdes de cristal.",
      "Alma en una casa aquí en Maharashtra junto a una mujer que sostiene uno de sus saris familiares guardados, tejido con cenefa en púrpura y oro.",
    ],
    pairSlots: [
      {
        title: "Festive Maharashtrian attire",
        description:
          "Portrait photo 4:5: crimson silk saree with gold zari border, nath, thushi, and green glass bangles.",
      },
      {
        title: "Kept family saree in Maharashtra",
        description:
          "Portrait photo 4:5: Alma visiting a Maharashtra home with a folded zari-bordered saree.",
      },
    ],
    sections: [
      {
        heading: "Wrists forged in basalt, and a friend for life",
        paragraphs: [
          "When people outside our state think of Maharashtra, they usually picture Mumbai or famous landmarks like Shaniwar Wada in Pune, Raigad Fort with its Maha Darwaja gate, Ganga Sagar reservoir, and cliffside Hirakani bastion, or Shivneri Fort, where Chhatrapati Shivaji Maharaj was born. UNESCO recognises twelve Maratha fortifications adapted to very different ground, including dark volcanic basalt ridges in the Sahyadri hills and coastal laterite walls at Vijaydurg on the Arabian Sea. Walk up any of those stone steps and you see almost zero palace vanity. Every bastion and cistern was cut to hold ground.",
          "To understand how that stone shaped our people, listen to the Marathi poet Kusumagraj. Defining what makes someone Maharashtrian regardless of mother tongue, he wrote of wrists and arms forged from dark rock, cliffside fires carried in the chest, and drums that sounded along the road to Kabul and Kandahar, across the long march between Attock and Cuttack. Popular history often skips the hundred and fifty to two hundred years of Maratha Swarajya that stood between Mughal rule and the British, or forgets how after the heavy losses of the Third Battle of Panipat in 1761, the Marathas rebuilt at double strength within a decade. Even in 1962, when Yashwantrao Chavan left Maharashtra to serve as India's Defence Minister, people summed it up in one sentence: the Sahyadris rushed to aid the Himalayas.",
          "In the seventh century, the Chinese Buddhist traveller Xuanzang passed through the Deccan and wrote in his travelogue that the people here were proud, quick to fight when wronged, and willing to give their lives once you earned their friendship. That still describes us. Even the old word Marhatta points to a stubborn streak. Our hard Deccan terrain made us tough on the outside, and deeply loyal once we trust you.",
        ],
        images: [
          {
            url: "/images/shirish-at-maharashtra-fort.jpg",
            alt: "Shirish standing inside a dressed dark basalt archway at a historic fort in Maharashtra with a curved stone bastion behind him",
            caption:
              "Standing inside a dressed basalt archway at a fort in Maharashtra, with a curved stone bastion rising behind me.",
            aspectRatio: "4:5",
          },
          {
            url: "/images/forts (2).jpg",
            alt: "View framed through a stone arch on Sanjivani Machi at Rajgad Fort looking toward Torna Fort across Sahyadri basalt ridges",
            caption:
              "Looking through a stone arch along Sanjivani Machi at Rajgad Fort toward Torna across the Sahyadri hills.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading:
          "My grandfather's Modi signature and a state that argues forward",
        paragraphs: [
          "Swarajya also left its mark on how we speak, read, and govern. At a time when court administration ran in Persian, Chhatrapati Shivaji Maharaj issued indigenous coinage and gave Marathi and Sanskrit full standing in state affairs. His own signature and royal seal were written in Modi, a cursive script used for Marathi records for centuries. My grandfather still signed his name in Modi script. Many people outside Maharashtra assume Indian vernacular literature is young, yet Marathi literature goes back well over a thousand years, earlier even than saint-poets like Sant Dnyaneshwar and Sant Tukaram, and recently received India's Classical Language recognition.",
          "What makes me proudest of Maharashtra is its progressive spine. Savitribai Phule and Jyotirao Phule opened schools here for girls and oppressed communities in the nineteenth century, and Dr. Babasaheb Ambedkar gave all of India its modern Constitution. Even our spiritual tradition puts human dignity ahead of ritual. In Maharashtra we grow up hearing how Sant Namdev chased a stray dog with a small bowl of ghee because the dog had run off with his dry bhakri flatbread and he could not bear for it to eat dry bread. And at Pandharpur, when Lord Vitthal arrived at Pundalik's door while Pundalik was pressing his elderly parents' feet, Pundalik tossed out a brick and told God to stand and wait until he finished caring for his parents. I have never found God inside temple walls or books; you meet God in people and in the duty we owe society.",
          "People across the world know Rajasthan's palaces because Rajasthan promotes its heritage well. Here in Maharashtra we have fallen short at telling our story, often getting caught up arguing among ourselves over small things instead of carrying our culture outward. Sharing Maharashtra never means narrow regionalism. All of India is ours. Across the country and abroad I am Indian first, and at home in Maharashtra I am Marathi, with full respect for Gujarat, North India, and South India alike. Still, if we do not keep our language, Gudi Padwa, and puran poli alive at home, nobody else can do it for us.",
        ],
      },
      {
        heading: "Where fort discipline meets the handloom border",
        paragraphs: [
          "That same respect for structure runs right through Maharashtra's handloom towns. Archival correspondence studied by India's Textiles Committee records Peshwa Madhavrao writing in 1766, five years after Panipat, to commission dupattas woven with Asavali flowering-vine borders in exact colours.",
          "On Paithani looms in Paithan and Yeola, weavers work silk warps by hand without a mechanical jacquard, interlocking bright silk wefts like tapestry for peacock and Asavali motifs on the pallu. Look closely at Shashikala Ramdas Bhosale's green-bordered Paithani nauvari in Sydney's Powerhouse Museum collection and you see why the edge behaves differently from the centre: metallic zari warp threads make the side borders physically heavier than the silk body. Elsewhere in our state, Bhandara weavers in eastern Vidarbha build Karvati sarees with a crisp tasar silk body and a sawtooth cotton border, while weavers in Solapur produce checked Narayan Peth cotton and silk sarees distinct from the GI-registered Narayanpet tradition across the state line in Telangana.",
        ],
        images: [
          {
            url: "/images/maharashtra-handloom-zari-border.jpg",
            alt: "Weaver's hands working wooden shuttles and metallic gold zari spools across silk warp threads on a wooden handloom",
            caption:
              "Silk warp threads, wooden shuttles, and metallic zari spools on a wooden handloom, building a denser woven border along the edge of the cloth.",
            aspectRatio: "4:5",
          },
          {
            url: "/images/alma_with_diid.jpeg",
            alt: "Alma and a young colleague in our studio in Maharashtra inspecting a maroon saree woven with mustard-gold sawtooth triangles and a fringed green pallu",
            caption:
              "Alma and a young colleague in our studio examining a maroon saree woven with rows of mustard-gold sawtooth triangles and a fringed green pallu.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading: "The sarees kept in cupboards, and what travels with them",
        paragraphs: [
          "Across Maharashtra, a saree does not stay on the loom or even at the wedding where it was first worn. Eventually most of them end up folded away in family cupboards. In Marathi we call them thevnitlya sadya, treasured sarees that women keep for decades even after they stop wearing them. A father, a brother, or a husband gave that saree with affection. A mother hugged her children in it, danced in it during festivals, or wore it for a family photograph that still sits in the living room. You cannot throw cloth like that away, because too much of someone's life is folded inside it.",
          "That is how Almarise began when Alma and I were talking about what kind of company we wanted to build. We did not want to be another business shipping anonymous goods out of India. Swami Vivekananda spoke of bringing together East and West, taking the spiritual depth of one and the practical, scientific temper of the other. In our small way, that is what happens when we take a treasured cupboard saree from a home in Maharashtra, with the owner's consent and a fair payment or donation, and recut it into an easy shrug or tunic for a working woman in Spain or Europe. A busy woman in Spain or Europe is not going to drape six or nine yards every morning, yet when she puts that piece on and reads the story of the saree behind it, the cloth keeps living instead of sitting folded in the dark.",
          "For me, the whole circle comes down to one thing: the saree belonged to a woman, a woman cuts and stitches it in our studio, and a woman wears it on the other side of the world. That is also why we are preparing our Women's Training Initiative alongside our commercial Manufacturing Programmes and Almarise. In Maharashtra, we believe you owe a debt back to the society that raised you. Whether we are producing leather bags for a Client in Spain or giving a family saree a second life, we carry our history, our straight dealing, and our people into everything that leaves our hands.",
        ],
      },
    ],
    spanishSections: [
      {
        heading: "Muñecas forjadas en basalto y lealtad de por vida",
        paragraphs: [
          "Cuando alguien de fuera piensa en Maharashtra, suele imaginar Bombay o monumentos célebres como Shaniwar Wada en Pune, el fuerte de Raigad con su puerta Maha Darwaja, el embalse Ganga Sagar y el bastión de Hirakani sobre el precipicio, o el fuerte de Shivneri, donde nació Chhatrapati Shivaji Maharaj. La UNESCO reconoce doce fortificaciones marathas adaptadas a terrenos muy distintos, que van del basalto volcánico oscuro en las cumbres del Sahyadri a las murallas costeras de laterita en Vijaydurg frente al mar Arábigo. Basta subir cualquiera de sus escalinatas de piedra para ver que allí no hay vanidad palaciega: cada muro y cada aljibe se talló para resistir.",
          "Para entender cómo esa piedra moldeó a nuestra gente basta escuchar al poeta maratí Kusumagraj. Al definir qué significa ser de Maharashtra más allá de la lengua materna, escribió sobre muñecas y brazos forjados en roca oscura, fuegos de acantilado guardados en el pecho y tambores que resonaron camino de Kabul y Kandahar, en la larga marcha entre Attock y Cuttack. A menudo se pasan por alto los ciento cincuenta o doscientos años de Swarajya maratha entre el imperio mogol y los británicos, o cómo tras el durísimo golpe de la tercera batalla de Panipat en 1761 los marathas se levantaron con el doble de fuerza en apenas unos años. Incluso en 1962, cuando nombraron ministro de Defensa de la India a Yashwantrao Chavan, en todo el país se repitió una frase: los montes Sahyadri acudieron en ayuda del Himalaya.",
          "En el siglo VII, el viajero budista chino Xuanzang cruzó el Decán y dejó escrito en sus crónicas que la gente de esta tierra era orgullosa y brava en la pelea ante una injusticia, pero capaz de dar la vida si te ganabas su amistad. Esa sigue siendo nuestra forma de ser. Hasta la antigua palabra Marhatta habla de ese carácter tenaz: nuestra geografía dura nos hizo recios por fuera y profundamente leales cuando confiamos en alguien.",
        ],
        images: [
          {
            url: "/images/shirish-at-maharashtra-fort.jpg",
            alt: "Shirish bajo un arco de basalto oscuro labrado en un fuerte histórico de Maharashtra con un bastión curvo de piedra al fondo",
            caption:
              "Bajo un arco de basalto labrado en un fuerte de Maharashtra, con el bastión curvo de piedra alzándose detrás de mí.",
            aspectRatio: "4:5",
          },
          {
            url: "/images/forts (2).jpg",
            alt: "Vista enmarcada por un arco de piedra en Sanjivani Machi en el fuerte de Rajgad mirando hacia el fuerte de Torna en los montes Sahyadri",
            caption:
              "Vista a través de un arco de piedra en Sanjivani Machi, en el fuerte de Rajgad, mirando hacia Torna entre las crestas del Sahyadri.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading:
          "La firma en escritura modi de mi abuelo y una tierra inconformista",
        paragraphs: [
          "La Swarajya también dejó huella en nuestra lengua y en la forma de administrar. En una época en que los documentos de corte se redactaban en persa, Chhatrapati Shivaji Maharaj acuñó moneda propia y dio rango oficial al maratí y al sánscrito. Tanto su firma como su sello real estaban escritos en modi, una escritura cursiva maratí empleada durante siglos. Mi propio abuelo todavía firmaba en escritura modi. Fuera de aquí muchos creen que las literaturas vernáculas de la India son recientes, pero la literatura maratí supera el milenio de historia, es incluso anterior a poetas santos como Sant Dnyaneshwar y Sant Tukaram y acaba de recibir el reconocimiento oficial de lengua clásica de la India.",
          "De lo que más orgulloso me siento es del carácter reformista de Maharashtra. Aquí abrieron escuelas para niñas y comunidades oprimidas Savitribai Phule y Jyotirao Phule en el siglo XIX, y de aquí salió el doctor Babasaheb Ambedkar, artífice de la Constitución india. Hasta nuestra tradición espiritual pone al ser humano por delante del rito. Crecemos escuchando cómo Sant Namdev salió corriendo detrás de un perro callejero con un cuenco de ghee porque el animal se había llevado su pan bhakri seco y no soportaba que lo tragara sin mantequilla clarificada. Y en Pandharpur, cuando el dios Vitthal llegó a casa de Pundalik mientras este masajeaba los pies de sus padres ancianos, Pundalik le lanzó un ladrillo y le pidió que esperase de pie encima hasta que terminara de atender a sus padres. Yo nunca he visto a Dios encerrado en un templo ni en un libro; a Dios lo encuentras en las personas y en lo que debemos devolver a la sociedad.",
          "En medio mundo conocen los palacios del Rajastán porque allí han sabido enseñar muy bien lo suyo. En Maharashtra nos ha faltado contar quiénes somos por quedarnos muchas veces discutiendo entre nosotros por pequeñeces en lugar de abrir nuestra cultura al exterior. Reivindicar Maharashtra no tiene nada que ver con cerrarse en el regionalismo. Toda la India es nuestra: fuera soy indio antes que nada y en mi tierra soy maratí, sin el menor recelo hacia Gujarat, el norte o el sur del país. Ahora bien, si nosotros mismos no cuidamos el maratí, el Año Nuevo de Gudi Padwa o nuestros dulces puran poli, nadie va a venir de fuera a mantenerlos vivos.",
        ],
      },
      {
        heading: "Donde el rigor de la piedra llega a la cenefa del telar",
        paragraphs: [
          "Ese mismo sentido de la estructura recorre los pueblos tejedores de Maharashtra. Un estudio del Textiles Committee de la India recoge correspondencia de 1766, apenas cinco años después de Panipat, en la que el peshwa Madhavrao encargaba dupattas tejidas con cenefas florales Asavali en colores muy precisos.",
          "En los telares de Paithani de Paithan y Yeola, los artesanos trabajan la urdimbre de seda a mano sin máquina jacquard, entrelazando tramas de seda de colores como en un tapiz para formar pavos reales y enredaderas en el pallu, el extremo decorado del sari. Al observar el nauvari Paithani de cenefa verde de Shashikala Ramdas Bhosale conservado en el museo Powerhouse de Sídney se entiende por qué el borde cae con tanto aplomo: los hilos metálicos zari en la urdimbre hacen que las cenefas laterales pesen más que el cuerpo central de seda. En otras comarcas del estado, los tejedores de Bhandara, en Vidarbha, elaboran saris Karvati con cuerpo de seda tasar y cenefa de algodón en diente de sierra, mientras que en Solapur se tejen saris de cuadros Narayan Peth distintos de la tradición de Narayanpet registrada con indicación geográfica en el vecino estado de Telangana.",
        ],
        images: [
          {
            url: "/images/maharashtra-handloom-zari-border.jpg",
            alt: "Manos de un tejedor manejando lanzaderas de madera y bobinas de hilo dorado zari sobre urdimbre de seda en un telar manual",
            caption:
              "Urdimbre de seda, lanzaderas de madera y bobinas de hilo metálico zari en un telar manual, formando la cenefa más tupida del borde.",
            aspectRatio: "4:5",
          },
          {
            url: "/images/alma_with_diid.jpeg",
            alt: "Alma y una joven compañera en nuestro estudio en Maharashtra revisando un sari granate tejido con triángulos dorados en diente de sierra y remate verde",
            caption:
              "Alma y una compañera en nuestro estudio revisando un sari granate tejido con hileras de triángulos dorados en diente de sierra y fleco verde.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading:
          "Los saris guardados en el armario y la historia que viaja con ellos",
        paragraphs: [
          "En Maharashtra, un sari no termina su vida en el telar ni el día de la boda en que se estrena. Con los años, la mayoría acaban doblados al fondo del armario. En maratí los llamamos thevnitlya sadya: esos saris tan queridos que una mujer conserva durante décadas aunque ya no se los ponga. Se lo regaló con cariño su padre, su hermano o su marido; con él abrazó a sus hijos, bailó en una fiesta o posó para esa foto familiar que sigue en el salón. Nadie se atreve a deshacerse de una tela así porque lleva media vida guardada entre sus pliegues.",
          "De ahí nació Almarise cuando Alma y yo empezábamos a pensar qué clase de empresa queríamos levantar. No queríamos limitarnos a exportar mercancía anónima desde la India. Swami Vivekananda hablaba de unir Oriente y Occidente, sumando la profundidad espiritual de un lado y el espíritu práctico y científico del otro. A nuestra escala, eso es lo que ocurre cuando recogemos uno de esos saris familiares en una casa de Maharashtra, bien donado o pagando un precio justo con el permiso de su dueña, y lo transformamos en una prenda ligera para una mujer que trabaja en España o en el resto de Europa. Ninguna mujer con prisas por la mañana va a envolverse en seis u ocho metros de tela antes de salir a trabajar, pero cuando se pone una chaqueta o una túnica cortada de ese sari y sabe a quién perteneció, esa historia sigue viva en lugar de quedarse encerrada a oscuras.",
          "Para mí, todo el sentido del proyecto cabe en una frase: el sari perteneció a una mujer, otra mujer lo corta y lo cose en nuestro estudio y otra mujer lo viste al otro lado del mundo. Por eso también estamos preparando nuestra iniciativa de formación para mujeres junto a los programas de fabricación y a Almarise. Aquí creemos que siempre tenemos una deuda con la sociedad que nos vio crecer. Ya sea fabricando bolsos de piel para un cliente en España o dando una segunda vida a un sari familiar, en todo lo que sale de nuestras manos van nuestra historia, nuestra palabra y nuestra gente.",
        ],
      },
    ],
    takeaway: "",
    spanishTakeaway: "",
    seo: {
      title:
        "Maharashtra Behind the Monuments: Basalt Forts, Modi Script, and Woven Borders",
      description:
        "Shirish shares how Maharashtra's Maratha forts, Modi script, progressive reformers, Paithani looms, and treasured cupboard sarees shape KarmaRise D Global and Almarise.",
    },
  },
  {
    slug: "preparing-womens-garment-training-maharashtra",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "01",
    publishedAt: "2026-10-22",
    readingTimeMinutes: 4,
    category: "Inside KarmaRise",
    location: "India & Spain",
    spanishLocation: "India y España",
    title:
      "Building the foundation in India for our planned Women's Training Initiative",
    spanishTitle:
      "Sentando las bases en la India para nuestra futura iniciativa de formación para mujeres",
    summary:
      "Inside our studio in India, we are laying the commercial and practical groundwork for a programme to train women in garment design and stitching.",
    spanishSummary:
      "Desde nuestro estudio en la India estamos preparando el terreno comercial y técnico para formar a mujeres en diseño de prendas y confección.",
    author: {
      name: "Alma & Shirish",
      role: "Co-founders, KarmaRise D Global",
      spanishRole: "Cofundadores de KarmaRise D Global",
      location: "India & Spain",
      spanishLocation: "India y España",
      portraitUrl: "/images/alma-and-shirish-founders.jpg",
    },
    tags: [
      "Women's Training Initiative",
      "Garment studio",
      "Company progress",
      "India",
    ],
    spanishTags: [
      "Formación para mujeres",
      "Estudio textil",
      "Avances",
      "India",
    ],
    leadImage: {
      url: "/images/warehouse_reference.jpeg",
      alt: "Wide view of the sunlit studio space in India with sewing tables and dress form",
      caption:
        "Our studio space in India, equipped for garment development and sample reviews.",
    },
    spanishLeadCaption:
      "Nuestro estudio en la India, equipado para el desarrollo de prendas y la revisión de muestras.",
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Sewing machines and pattern tools in India",
      description:
        "4:3 daylight photograph of sewing machines, pattern paper, shears, and measuring tape in our studio space in India.",
    },
    pullQuote: {
      text: "Training only creates real independence when it leads to steady, paid work. That is why we are building commercial demand through our Manufacturing Programmes and Almarise first.",
      attribution: "Alma & Shirish · KarmaRise D Global",
    },
    spanishPullQuote: {
      text: "La formación solo genera independencia real cuando desemboca en un empleo estable y remunerado. Por eso estamos consolidando primero la demanda comercial con nuestros programas de fabricación y con Almarise.",
      attribution: "Alma y Shirish · KarmaRise D Global",
    },
    pairImages: [
      {
        url: "/images/shirish_and_alma.jpeg",
        alt: "Alma, Shirish, and a colleague together in India",
        caption:
          "Alma and Shirish working alongside our team in India as we build the commercial foundation for the initiative.",
      },
      {
        url: "/images/snoby_order (1).jpeg",
        alt: "Strapped and wrapped export cartons stacked in the warehouse ready for dispatch",
        caption:
          "Completed Bulk Order cartons strapped and ready for dispatch, building the commercial foundation for our next steps.",
      },
    ],
    spanishPairCaptions: [
      "Alma y Shirish junto a nuestro equipo en la India mientras construimos la base comercial de la iniciativa.",
      "Cajas de un pedido completado listas para su envío, consolidando la base comercial para nuestros próximos pasos.",
    ],
    pairSlots: [
      {
        title: "Machine stitching bench",
        description:
          "Portrait photo (4:5): close study of a clean studio sewing machine and fabric feed in warm natural light.",
      },
      {
        title: "Pattern drafting area",
        description:
          "Portrait photo (4:5): pattern curve, ruler, chalk, and draped cotton fabric.",
      },
    ],
    sections: [
      {
        heading: "Connecting skills directly to paid employment",
        paragraphs: [
          "The Women's Training Initiative is a planned programme by KarmaRise D Global in India designed to train women in both garment design and stitching, with long-term paid employment as the goal.",
          "We feel a clear responsibility to give back to the society around us, and training creates lasting independence when the pattern-making and construction skills women learn connect directly to real garment standards and steady work.",
        ],
      },
      {
        heading: "Where the work stands today",
        paragraphs: [
          "We are deliberate about stating what is operating today and what is in preparation. Right now, our focus is on expanding our Manufacturing Programmes for Spanish and European Clients and developing Almarise so that future trainees step into a business with established demand.",
          "In our studio in India, our sewing machines, dress forms, and pattern area are already active for garment development and prototype reviews, forming the physical base for the programme ahead.",
        ],
      },
    ],
    spanishSections: [
      {
        heading: "Vincular el aprendizaje con el empleo remunerado",
        paragraphs: [
          "La iniciativa de formación para mujeres es un programa planificado por KarmaRise D Global en la India con el propósito de enseñar tanto diseño de prendas como patronaje y costura, orientado a crear oportunidades reales de empleo a largo plazo.",
          "Sentimos el deber de devolver parte de lo recibido a la sociedad que nos rodea, y sabemos que la formación genera verdadera independencia cuando el patronaje y la confección que aprenden las mujeres conectan directamente con estándares profesionales y trabajo estable.",
        ],
      },
      {
        heading: "En qué punto nos encontramos hoy",
        paragraphs: [
          "Nos gusta ser siempre transparentes sobre qué está hoy en pleno funcionamiento y qué se encuentra en fase de preparación. En este momento estamos centrados en impulsar nuestros programas de fabricación para clientes en España y Europa y el desarrollo de Almarise, de modo que las futuras alumnas cuenten con una carga de trabajo sólida.",
          "En nuestro estudio en la India, el equipamiento de costura, los maniquíes y el área de patronaje ya están activos para el desarrollo de muestras, preparando el espacio donde crecerá la iniciativa.",
        ],
      },
    ],
    takeaway:
      "Establishing strong commercial demand first ensures that our planned training programme in India can offer women lasting, dignified employment.",
    spanishTakeaway:
      "Consolidar primero una actividad comercial sólida es la mejor garantía para que nuestra futura formación en la India ofrezca a las mujeres un empleo digno y duradero.",
    seo: {
      title: "Preparing the Women's Training Initiative in India",
      description:
        "Follow the groundwork in India as Alma and Shirish prepare KarmaRise D Global's planned garment design and stitching training programme.",
    },
  },
];

export function getCategoryDetail(
  category: StoryCategory,
): StoryCategoryDetail {
  const normalizedCategory: StoryCategory =
    category === "KarmaRise Journal" ? "Inside KarmaRise" : category;
  return (
    storyCategoryDetails.find((item) => item.title === normalizedCategory) ??
    storyCategoryDetails[5]!
  );
}

export function getLocalizedCategory(
  category: StoryCategory,
  lang: StoryLanguage,
): {
  title: string;
  description: string;
  coverAlt: string;
} {
  const detail = getCategoryDetail(category);
  if (lang === "es") {
    return {
      title: detail.spanishTitle,
      description: detail.spanishDescription,
      coverAlt: detail.spanishCoverAlt || detail.coverAlt,
    };
  }
  return {
    title: detail.displayTitle,
    description: detail.description,
    coverAlt: detail.coverAlt,
  };
}

export function getLocalizedStory(
  story: StoryEntry,
  lang: StoryLanguage,
): {
  title: string;
  summary: string;
  location: string;
  categoryLabel: string;
  authorRole: string;
  authorLocation: string;
  tags: string[];
  leadImage: StoryImage | undefined;
  pullQuote: StoryPullQuote | undefined;
  pairImages: StoryImage[] | undefined;
  sections: StorySection[];
  takeaway: string;
} {
  const isEs = lang === "es";
  const categoryLabel = getLocalizedCategory(story.category, lang).title;

  const leadImage = story.leadImage
    ? {
        ...story.leadImage,
        alt: isEs
          ? story.spanishLeadAlt || story.leadImage.alt
          : story.leadImage.alt,
        caption: isEs
          ? story.spanishLeadCaption || story.leadImage.caption
          : story.leadImage.caption,
      }
    : undefined;

  const pairImages = story.pairImages?.map((img, index) => ({
    ...img,
    alt: isEs ? story.spanishPairAlts?.[index] || img.alt : img.alt,
    caption: isEs
      ? story.spanishPairCaptions?.[index] || img.caption
      : img.caption,
  }));

  return {
    title: isEs ? story.spanishTitle || story.title : story.title,
    summary: isEs ? story.spanishSummary || story.summary : story.summary,
    location: isEs ? story.spanishLocation || story.location : story.location,
    categoryLabel,
    authorRole: isEs
      ? story.author.spanishRole || story.author.role
      : story.author.role,
    authorLocation: isEs
      ? story.author.spanishLocation || story.author.location
      : story.author.location,
    tags: isEs ? story.spanishTags || story.tags : story.tags,
    leadImage,
    pullQuote: isEs
      ? story.spanishPullQuote || story.pullQuote
      : story.pullQuote,
    pairImages,
    sections: isEs
      ? story.spanishSections && story.spanishSections.length > 0
        ? story.spanishSections
        : story.sections
      : story.sections,
    takeaway: isEs ? story.spanishTakeaway || story.takeaway : story.takeaway,
  };
}

export function formatStoryDate(
  isoDate: string,
  lang: StoryLanguage = "en",
): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
