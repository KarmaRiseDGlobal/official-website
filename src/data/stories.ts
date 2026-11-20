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
      portraitUrl: "/images/alma-and-shirish-avatar.jpg",
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
    spanishLeadAlt:
      "Alma sonriendo frente a un thali metálico con idlis oscuros al vapor, sambar y chutney en nuestra mesa en la India",
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
    spanishPairAlts: [
      "Biryani casero de pollo servido en una fuente de cristal junto a raita y salsa especiada",
      "Croquetas españolas grandes de carne picada abiertas en un plato mostrando la bechamel cremosa por dentro",
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
      spanishTitle:
        "Tres biryanis en Eid: Alma sobre la comida entre la India, España y Europa",
      spanishDescription:
        "Alma cuenta en primera persona cómo cambia la relación con la comida entre la India, España y Europa: chakli de Diwali, tres biryanis en Eid y las croquetas de su madre.",
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
    readingTimeMinutes: 6,
    category: "People & Craftsmanship",
    location: "Across India",
    spanishLocation: "Por toda la India",
    title:
      "Chasing a soft leather across two Indian states, and why we walk away from closed factory doors",
    spanishTitle:
      "Persiguiendo una piel suave por dos estados de la India, y por qué nos marchamos cuando un taller cierra sus puertas",
    summary:
      "When a boutique in Donostia asked for leather that felt goxo-goxo, every first sample we paid for missed the mark. Splitting the hides and the stitching across India, sitting on the workshop floor with the makers, and walking away from secrecy taught us what matching a Manufacturing Partner actually takes.",
    spanishSummary:
      "Cuando una tienda de Donostia nos pidió una piel con tacto goxo-goxo, todas las primeras muestras que pagamos fallaron al tocarlas. Dividir el curtido y la confección entre dos estados de la India, sentarnos en el taller con quienes cosen y descartar cualquier fábrica opaca nos enseñó lo que cuesta de verdad elegir al socio adecuado.",
    author: {
      name: "Shirish",
      role: "Co-founder, KarmaRise D Global",
      spanishRole: "Cofundador de KarmaRise D Global",
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
      url: "/media (ai generated)/shirish_with_workers_at_warehouse_(5).jpeg_98406e06_2K.jpg",
      alt: "Shirish standing beside a leather craftsman stitching a black strap on an industrial sewing machine in India",
      caption:
        "Standing beside a machine operator on the workshop floor while he runs a black leather strap under a heavy stitching head.",
    },
    spanishLeadAlt:
      "Shirish junto a un artesano de la piel cosiendo una correa negra en una máquina industrial en la India",
    spanishLeadCaption:
      "Junto a un maquinista en la nave del taller mientras cose una correa de piel negra en una máquina industrial.",
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Standing beside a strap-stitching operator",
      description:
        "Candid workshop floor photo of Shirish standing beside a craftsman running a black leather strap under an industrial sewing machine.",
    },
    pullQuote: {
      text: 'I do not look at a European founder as a "client" on an invoice. They are an entrepreneur building a brand. Focus on your business and your marketing, and leave the manufacturing in India to us.',
      attribution: "Shirish",
    },
    spanishPullQuote: {
      text: 'Yo no miro a un fundador europeo como a un "cliente" más en una factura. Es un emprendedor levantando su marca. Céntrate en tu negocio y en tu marketing, y déjanos a nosotros la fabricación en la India.',
      attribution: "Shirish",
    },
    pairImages: [
      {
        url: "/images/shirish_with_workers_at_warehouse (7).jpeg",
        alt: "Shirish flexing a soft tan leather panel in both hands at the cutting table while a craftsman watches",
        caption:
          "Testing the drape and softness of a tan hide in my hands at the cutting table. Photographs never tell you if a skin actually feels right.",
      },
      {
        url: "/images/shirish_with_workers_at_warehouse (6).jpeg",
        alt: "Shirish checking a soft tan suede-feel bag over a stack of black leather bags while male and female artisans work beside him",
        caption:
          "Checking a finished tan piece over a stack of black leather bags on the assembly floor, right beside the artisans trimming and finishing the batch.",
      },
    ],
    spanishPairAlts: [
      "Shirish doblando con ambas manos una piel blanda en tono tan sobre la mesa de corte mientras observa un artesano",
      "Shirish revisando un bolso en tono tan sobre una pila de bolsos de piel negra junto a artesanos que rematan el lote",
    ],
    spanishPairCaptions: [
      "Comprobando con las manos la caída y suavidad de una piel en tono tan en la mesa de corte. Una foto nunca te dice cómo se siente de verdad.",
      "Revisando un bolso en tono tan sobre una pila de bolsos negros en plena línea de montaje, junto a los artesanos que rematan el lote.",
    ],
    pairSlots: [
      {
        title: "Testing hide hand-feel at the cutting table",
        description:
          "Portrait photo 4:5: Shirish flexing a soft tan hide in both hands at the cutting table.",
      },
      {
        title: "Inspecting black and tan bags on the assembly floor",
        description:
          "Portrait photo 4:5: Shirish inspecting a tan bag over stacked black bags flanked by workshop artisans.",
      },
    ],
    sections: [
      {
        heading: "The Basque word that failed every first sample",
        paragraphs: [
          "When an independent leather-goods boutique in Donostia came to us to produce four bag styles in black and tan, the founder did not hand us a tannery code. He gave us a Basque phrase. He wanted the leather to feel goxo-goxo: silky, warm, supple, the kind of soft skin you want to keep touching when you pick a bag up off a counter.",
          "Over phone calls and email, almost every workshop in India will say yes to that brief. In person, the story changes fast. Alma and I travelled to leather workshops across India, checked hides under the lights, and paid out of our own pocket for trial samples. The first pieces looked decent in photographs. The moment we held them, they felt too stiff, too dry, or too lifeless. They were not goxo-goxo.",
          'I never think of a European founder as just a "client" ticking boxes on an invoice. They are an entrepreneur putting their name and savings into a brand. When I sit with them, my promise is plain: focus on your business and your marketing, and leave Indian manufacturing to us. Keeping that promise meant admitting that the easy single-factory route was not going to deliver the feel this collection needed.',
        ],
      },
      {
        heading: "Splitting one bag across Indian states",
        paragraphs: [
          "I hold to a simple rule whenever a production problem refuses to budge: the solution lies in the problem itself. If one workshop cannot nail both the leather finish and the bag construction, stop forcing one roof to do both jobs.",
          "We went back to the raw material and studied leather treatments and vegetable tanning until we understood why the earlier samples felt wrong. India's manufacturing strength is spread across specialist clusters, not concentrated inside a single city. We had the hides tanned in Kolkata, where the tanneries know how to achieve that supple, natural-hand finish, and then moved the finished leather to Uttar Pradesh, where the workshop had stronger stitching lines and cleaner assembly for soft structured bags. We managed coordination, hide checks, and oversight from our base near Mumbai.",
          'Working across states only works when your Manufacturing Partner cares about the unglamorous details as much as you do. When Alma wanted a Spanish hangtag printed on unbleached recycled cardboard rather than bright bleached paper, our partner spent ten to fifteen days hunting down the exact board instead of pushing whatever sat in their storeroom. Before a single tan hide was cut, because "tan" is a vague word that drifts toward mustard or mud in a dye drum, Alma flew in and worked elbow-to-elbow with the factory team for a full week checking the batch. Between checks, she ran live video calls walking the boutique founder through the workshop and introducing him straight to the makers. As Alma put it later, that is the difference between buying a shirt off a rack and having one tailor-made: you watch your own piece take shape.',
        ],
        images: [
          {
            url: "/images/alam_with_the_warehouse_owners (3).jpeg",
            alt: "Alma inspecting full tan leather hides beside a finished tan bag while three workshop specialists look on",
            caption:
              'Alma checking the tan hides side by side with the workshop team before cutting started. "Tan" means something different in every dye drum unless you verify it in person.',
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading: "Walking past the owner's office onto the floor",
        paragraphs: [
          "Most foreign buyers fly into India, shake hands in the factory owner's air-conditioned office, review a tray of samples, and head back to the airport. They never speak a word to the people cutting the hides, gluing the linings, or running the heavy strap machines.",
          'Alma and I do the opposite. When we audit a workshop, we walk onto the floor, sit beside the workers, and ask about their work and their lives. "Is this step hard? Explain it to me." You see the shift in the room immediately. People who are used to being ignored behind a partition straighten up, smile, and show you how they guide a thick leather strap under the needle or stack striped cotton linings cleanly. Once a maker feels respected as a craftsman, quality stops being a rule shouted by a supervisor and becomes personal pride: "this bag will be great because of my work."',
          "That is also where we draw a hard line. When we first approach a workshop, initial hesitation about letting outsiders onto the floor is normal. Owners worry about competitors or buyers copying their setup, and we respect that while we earn their trust. If a factory still refuses open floor access after we have built a relationship, they are hiding something. At that point the conversation ends and we walk away.",
        ],
        images: [
          {
            url: "/images/shirish_with_workers_at_warehouse (8).jpeg",
            alt: "Smiling woman artisan at a workshop bench with yellow-and-white striped cotton linings, glue bottle, hammer, and trimmed leather straps beside Shirish",
            caption:
              "Stopping at the lining and strap bench to talk through the day's assembly instead of walking straight back to the owner's office.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading:
          "Clear agreements, first-time freight shocks, and eight bags in a Donostia window",
        paragraphs: [
          'Because I am a registered Bar Council lawyer in India, I handle our workshop negotiations and put every commitment in clear, fair writing. Spoken promises are where both sides get hurt: European founders fear paying a deposit and receiving substandard cartons, and honest Indian workshops fear buyers moving goalposts at the last minute. Clear agreements protect everyone, yet we never treat a signed contract as a permanent pass. As Alma always says, "the best" Manufacturing Partner means both craft quality and reliable responsiveness, and every partner keeps proving themselves run after run. Our research never stops either, because new workshops open across India every week, including the Indian vegan-leather makers we are evaluating right now.',
          'Matching the right workshops is not the last hurdle, either, and I will not pretend our first leather run went smoothly to the airport. Production finished cleanly, eleven export cartons wrapped and labelled by style and colour. Then reality hit: we had never exported on our own before and had no corporate courier account. The first freight quotes came back at six to seven lakh rupees, higher than the entire production cost. We kept digging until we found a freight contact who was still learning the ropes but genuinely willing to work with us, linked up with a customs specialist in Delhi, and got the consignment into the air. Even then, I barely slept for three nights, waking up in the dark to refresh tracking after the courier posted a false "customs hold" notice in Spain without ever requesting a missing document.',
          'Two or three days later, the pallet landed cleanly outside the boutique\'s door in Donostia. The founder had already teased his followers online with nothing more than one of our sample dust bags ("no spoilers, it comes in this bag"). The minute the cartons arrived, he sent us a photograph from his doorway shouting, "We got it! They\'re here!" On our next video call, he turned the camera toward the street: all four bag styles in black and all four in tan filled his entire downtown shop window.',
        ],
        images: [
          {
            url: "/images/leather-bags-export-cartons.jpeg",
            alt: "Eleven stretch-wrapped export cartons numbered and labelled by bag style and colour ready for air freight from India to Spain",
            caption:
              "Eleven cartons packed, wrapped, and labelled by black and tan style codes before our eventful first air shipment to Spain.",
            aspectRatio: "4:3",
          },
        ],
      },
    ],
    spanishSections: [
      {
        heading: "La palabra vasca que tumbó todas las primeras muestras",
        paragraphs: [
          "Cuando una tienda independiente de bolsos de piel en Donostia acudió a nosotros para producir cuatro modelos en negro y en tono tan, el dueño no nos dio un código técnico de curtiduría. Nos dio una expresión en euskera. Quería una piel goxo-goxo: sedosa, cálida, flexible, de esas que apetece seguir tocando en cuanto coges el bolso del mostrador.",
          "Por correo electrónico o por teléfono, casi cualquier taller de la India te dirá que sí a ese encargo. En persona, la historia cambia enseguida. Alma y yo recorrimos talleres de marroquinería por toda la India, revisamos pieles bajo la luz y pagamos de nuestro bolsillo varias muestras de prueba. En foto daban el pego. En cuanto las teníamos en la mano, resultaban demasiado rígidas, secas o sin caída. Aquello no era goxo-goxo.",
          'Nunca miro a un fundador europeo como a un simple "cliente" de una lista. Es un emprendedor que pone su nombre y sus ahorros en una marca. Cuando hablo con ellos, mi compromiso es directo: céntrate en tu negocio y en tu marketing, y déjanos a nosotros la fabricación en la India. Cumplir esa palabra implicaba aceptar que el camino cómodo de meterlo todo en una sola fábrica no iba a dar el tacto que esta colección pedía.',
        ],
      },
      {
        heading: "Dividir un mismo bolso entre dos estados de la India",
        paragraphs: [
          "Sigo una regla sencilla cuando un problema de producción se enquista: la solución está dentro del propio problema. Si un solo taller no clava a la vez el acabado de la piel y la costura del bolso, deja de forzar un único techo para dos oficios distintos.",
          "Volvimos a la materia prima y estudiamos tratamientos de piel y curtición vegetal hasta entender por qué fallaban las pruebas anteriores. La fuerza industrial de la India está repartida en polos especializados, no encerrada en una sola ciudad. Mandamos curtir las pieles en Calcuta, donde las curtidurías dominan ese tacto suave y natural, y trasladamos la piel terminada a Uttar Pradesh, donde el taller tenía mejores líneas de costura y un armado más limpio para bolsos blandos. Desde nuestra base cerca de Bombay coordinamos los tiempos, los acuerdos y las revisiones en persona.",
          'Trabajar entre estados solo funciona cuando tu socio de fabricación se toma en serio los detalles que nadie aplaude. Cuando Alma quiso imprimir una etiqueta colgante en español sobre cartón reciclado sin blanquear en lugar de papel blanqueado normal, el taller pasó entre diez y quince días buscando exactamente ese cartón en vez de colocarnos lo que ya tenía en el almacén. Antes de cortar una sola piel en tono tan, porque "tan" es una palabra engañosa que en el bombo de tinte puede irse hacia el mostaza o apagarse demasiado, Alma viajó y trabajó codo con codo con el equipo del taller durante una semana entera revisando la partida. Entre revisión y revisión hacía videollamadas en directo paseando al fundador de la tienda por el taller y presentándole directamente a quienes hacían sus bolsos. Como dijo Alma después, es la diferencia entre comprar una camisa hecha o hacértela a medida: ves nacer tu pieza paso a paso.',
        ],
        images: [
          {
            url: "/images/alam_with_the_warehouse_owners (3).jpeg",
            alt: "Alma revisando pieles enteras en tono tan junto a un bolso terminado mientras tres responsables del taller observan",
            caption:
              'Alma revisando las pieles en tono tan mano a mano con el equipo del taller antes de cortar. El "tan" cambia en cada bombo de tinte si no se comprueba en persona.',
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading: "Pasar de largo el despacho del dueño y sentarse en el taller",
        paragraphs: [
          "La mayoría de los compradores extranjeros aterrizan en la India, dan la mano en el despacho con aire acondicionado del dueño, miran una bandeja de muestras y vuelven al aeropuerto. No cruzan ni una palabra con quienes cortan las pieles, preparan los forros o llevan las máquinas de costura pesada.",
          'Alma y yo hacemos justo lo contrario. Cuando evaluamos un taller, entramos en la nave, nos sentamos junto a los trabajadores y les preguntamos por su trabajo y por su día a día. "¿Es difícil este paso? Explícamelo". El ambiente cambia al instante. Gente acostumbrada a que nadie la mire detrás de un tabique se endereza, sonríe y te enseña cómo guía una correa gruesa bajo la aguja o cómo ordena los forros de algodón a rayas. Cuando un artesano se siente tratado como persona y no como mano de obra invisible, la calidad deja de ser una orden del encargado y pasa a ser orgullo propio: "este bolso va a salir impecable porque lo he hecho yo".',
          "Ahí también marcamos una línea roja. Al principio es normal que un taller dude antes de abrir la zona de producción a alguien que acaba de conocer; temen a la competencia o a que alguien copie su montaje, y lo entendemos mientras nos ganamos su confianza. Pero si después de trabajar la relación siguen cerrando la puerta del taller, es que esconden algo. En ese momento se acaba la conversación y nos vamos.",
        ],
        images: [
          {
            url: "/images/shirish_with_workers_at_warehouse (8).jpeg",
            alt: "Artesana sonriendo en su mesa de trabajo con forros de algodón a rayas, bote de cola, martillo y correas de piel junto a Shirish",
            caption:
              "Parando en la mesa de forros y correas para hablar del montaje del día en lugar de volver directamente al despacho del dueño.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading:
          "Acuerdos claros, sustos de primera exportación y ocho bolsos en un escaparate de Donostia",
        paragraphs: [
          "Como abogado colegiado en el Bar Council de la India, llevo las negociaciones con los talleres y dejo cada compromiso por escrito, claro y justo para ambas partes. Las promesas de palabra son el terreno donde todos pierden: las marcas europeas temen adelantar dinero y recibir cajas defectuosas, y los talleres serios temen que el comprador cambie las reglas a mitad del pedido. Un contrato claro protege a los dos, pero nunca es un cheque en blanco. Como repite siempre Alma, el mejor socio de fabricación combina oficio y respuesta fiable, y se lo tiene que ganar pedido tras pedido. Por eso nunca dejamos de buscar talleres nuevos en toda la India, incluidos los fabricantes de piel vegana que estamos evaluando ahora mismo.",
          "Acertar con los talleres tampoco es el último obstáculo, y no voy a fingir que nuestra primera exportación de piel fue un camino de rosas. La producción salió impecable, once cajas precintadas y etiquetadas por modelo y color. Y entonces llegó el golpe: nunca habíamos exportado por nuestra cuenta y no teníamos cuenta corporativa de mensajería. Los primeros presupuestos de envío salieron por seis o siete lakhs de rupias, más caros que la producción entera. Seguimos buscando hasta dar con un contacto de carga que todavía estaba aprendiendo pero tenía ganas de ayudar, nos coordinamos con un especialista en aduanas en Delhi y conseguimos subir la mercancía al avión. Aun así, apenas dormí durante tres noches, despertándome de madrugada para refrescar el seguimiento después de que el sistema marcara por error una retención aduanera en España sin pedirnos jamás ningún documento extra.",
          'Dos o tres días después, el palé aterrizó sin incidencias a la puerta de la tienda en Donostia. El dueño ya había publicado un pequeño adelanto en redes enseñando solo una de las bolsas guardapolvo de muestra ("sin spoilers, viene dentro de esta bolsa"). En cuanto llegaron las cajas, nos mandó una foto desde la puerta gritando: "¡Lo tenemos! ¡Ya están aquí!". En la siguiente videollamada giró la cámara hacia la calle: los cuatro modelos en negro y los cuatro en tono tan ocupaban entero el escaparate principal de su tienda en el centro.',
        ],
        images: [
          {
            url: "/images/leather-bags-export-cartons.jpeg",
            alt: "Once cajas de exportación flejadas y numeradas con etiquetas de modelo y color listas para envío aéreo desde la India a España",
            caption:
              "Once cajas embaladas, flejadas y etiquetadas por modelo en negro y tan antes de nuestro movido primer envío aéreo a España.",
            aspectRatio: "4:3",
          },
        ],
      },
    ],
    takeaway: "",
    spanishTakeaway: "",
    seo: {
      title: "Matching a Workshop to the Product Across India",
      description:
        "How Shirish and Alma split leather tanning in Kolkata and bag assembly in Uttar Pradesh for a Donostia boutique, audit workshop floors in person, and walk away from closed doors.",
      spanishTitle:
        "Cómo elegimos el taller adecuado para cada producto en la India",
      spanishDescription:
        "Cómo Shirish y Alma dividieron el curtido en Calcuta y la costura en Uttar Pradesh para una tienda de Donostia, auditan talleres en persona y descartan fábricas opacas.",
    },
  },
  {
    slug: "why-sample-approval-decides-bulk",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "01",
    publishedAt: "2026-11-04",
    readingTimeMinutes: 7,
    category: "Art & Design",
    location: "India & Spain",
    spanishLocation: "India y España",
    title:
      "I hide bad samples, switch your zippers, and point out the flaws you missed",
    spanishTitle:
      "Escondo las muestras malas, cambio tus cremalleras y señalo los fallos que no has visto",
    summary:
      "A rough four-line sketch never tells you if a metal zipper will ruin a winter coat or if a screen photo will delay dyeing by months. Here is how I test, question, and filter every sample in India before a Bulk Order is cut.",
    spanishSummary:
      "Un boceto de cuatro líneas no te avisa de si una cremallera metálica estropeará un abrigo en invierno ni de si una foto en pantalla retrasará un tinte meses. Así pruebo, cuestiono y filtro cada muestra en la India antes de cortar el pedido.",
    author: {
      name: "Alma",
      role: "Co-founder, KarmaRise D Global",
      spanishRole: "Cofundadora de KarmaRise D Global",
      location: "India & Spain",
      spanishLocation: "India y España",
      portraitUrl: "/images/alma.jpeg",
    },
    tags: ["Sampling", "Quality control", "Leather & textiles", "Bulk Order"],
    spanishTags: [
      "Muestras",
      "Control de calidad",
      "Piel y textil",
      "Producción",
    ],
    leadImage: {
      url: "/images/alma_taking_a_look_at_design (2).jpeg",
      alt: "Alma and a garment maker pinning embroidered teal fabric on a dress form in our studio in India",
      caption:
        "Adjusting and pinning a garment sample on the form in our studio in India with our team. If something pulls or hangs wrong here, it never reaches the Client.",
    },
    spanishLeadAlt:
      "Alma y una modista ajustando con alfileres una tela bordada en tono turquesa sobre el maniquí en nuestro estudio en la India",
    spanishLeadCaption:
      "Ajustando con alfileres una muestra sobre el maniquí en nuestro estudio en la India. Si algo tira o cae mal aquí, ni siquiera llega al cliente.",
    leadSlot: {
      kind: "Photo",
      ratio: "16:9 horizontal",
      title: "Sample fitting in our studio in India",
      description:
        "Horizontal documentary photograph of Alma and a garment maker pinning and checking a physical prototype on a dress form.",
    },
    pullQuote: {
      text: "Even if a Client looks at a sample and loves it, if I notice a small flaw they missed, I bring it up myself: I am not 100% happy with this, and this will be changed.",
      attribution: "Alma",
    },
    spanishPullQuote: {
      text: "Aunque el cliente mire una muestra y le encante, si yo veo un detalle que se le ha pasado, lo saco yo misma: no estoy al cien por cien contenta con esto y esto se va a cambiar.",
      attribution: "Alma",
    },
    pairImages: [
      {
        url: "/images/alam_with_the_warehouse_owners (5).jpeg",
        alt: "Alma inspecting a dark leather swatch across a glass table while a workshop specialist checks a swatch binder",
        caption:
          "Comparing leather swatches across the workshop table before a single prototype is cut.",
      },
      {
        url: "/images/alam_with_the_warehouse_owners (6).jpeg",
        alt: "Alma checking brown leather hides beside a finished brown crossbody bag sample with brass hardware",
        caption:
          "Checking brown hides beside a finished crossbody sample with brass hardware. Even when a piece looks ready, I look for what needs fixing before bulk.",
      },
    ],
    spanishPairAlts: [
      "Alma revisando una muestra de piel oscura sobre una mesa de cristal mientras un especialista del taller consulta una carta de pieles",
      "Alma comprobando pieles marrones junto a un bolso bandolera de muestra terminado con herrajes en latón",
    ],
    spanishPairCaptions: [
      "Comparando muestras de piel sobre la mesa del taller antes de cortar el primer prototipo.",
      "Revisando pieles marrones junto a un bolso bandolera de muestra con herrajes en latón. Aunque la pieza parezca lista, busco qué hay que corregir antes de producir.",
    ],
    pairSlots: [
      {
        title: "Leather swatch review",
        description:
          "Portrait photo (4:5): comparing leather swatches across the workshop table before cutting the first prototype.",
      },
      {
        title: "Hide and sample inspection",
        description:
          "Portrait photo (4:5): checking brown leather hides beside a finished crossbody sample with brass hardware.",
      },
    ],
    sections: [
      {
        heading: "From four rough lines to a bag that works in real life",
        paragraphs: [
          "When a Client comes to us to manufacture for the first time, they usually know what their customers buy, not what breaks between a rough sketch and a packed carton. When we developed a leather bag collection for a leather-goods boutique in Donostia, the owner picked silhouettes from his own sales history, and Shirish still laughs that the starting sketch for the signature backpack was literally four rough lines.",
          "We never do a copy-paste of another brand's piece sitting on a shop shelf, and we never follow a drawing blindly. Looking at that boxy rectangle as a woman who carries a bag every day, we tapered it into a subtle pyramid, narrower at the top and wider at the bottom, so it sits cleanly on a woman's back without swallowing her whole torso. We watched every gram because leather already has weight and nobody wants a heavy bag anymore. We integrated a top grab handle so you can lift the bag or hold it open with one hand without it collapsing, removed the four metal bottom studs, upgraded the hardware to antique brass, and swapped the usual dark lining for a light lining so you can actually see your keys inside. After a few cloth drafts, it took only two leather samples to lock that shape in.",
          'Because first-time founders cannot predict where production slips, I also ask the awkward questions before a single hide or bolt of cloth is cut. What happens if a deadline moves by a week? What is your real margin before a seasonal window? And I prefer calling anything that goes wrong during sampling an issue rather than a problem. "Problems" sounds terrible, as if the whole run is ruined, when most of the time what you actually have is a specific issue on a seam, a dye lot, or a strap that needs a clear fix before bulk begins.',
        ],
      },
      {
        heading:
          'Japanese plastic zippers, a "too small" bag, and the flaws you missed',
        paragraphs: [
          "Real sample approval is where honest pushback saves a Client from complaints six months later. On that same backpack, we used top-grade Japanese zippers, yet I advised the boutique owner to choose moulded plastic teeth instead of metal teeth. Metal teeth look smart on a bench, until a woman reaches into her bag and scratches the back of her hand. Put a metal zipper on a rear back pocket and it rubs against a wool coat all winter until it ruins the fabric, or scratches bare skin in summer. I told him plainly: we will do whatever you prefer, but I suggest plastic teeth, otherwise your shoppers will love the bag and complain about the zip.",
          'Something similar happened with two smaller styles that were supposed to be the same size, first sampled in black while we waited longer for the tan hides. When I walked into his shop with the samples, he measured the second one immediately and said, "This is too small." I told him it was smaller, yes, not too small, and that I would happily order another sample if he wanted. Then I asked him to look at how women actually wear them. One was sporty and casual; the other was dressier, for evenings out when you carry less. Why stock two bags in the exact same size when two different uses give the same shopper a reason to buy both? He agreed and kept the smaller size.',
          'Most of my filtering happens even earlier, before a Client ever holds a piece in their hands. Whenever a workshop finishes a sample, I examine it first. If I am not happy with how it hangs, feels, or closes, I do not even show it to the Client. It goes straight back to the bench. And even when a pre-production sample moves from the sample room onto the real production line with bulk hides, linings, and hardware, I never settle for a quick "yes." Clients are often relieved to see their idea made real and miss tiny physical flaws my eye goes straight to: two panels cut from slightly different dye lots, a snap pulling on soft leather because backing reinforcement was skipped, or a seam puckering on a faster line machine.',
          'When I spot anything like that, even if the Client did not see it, I point it out myself: "I am not 100% happy with this, and this will be changed." I want complete transparency from day one. If tomorrow something slips past me that I genuinely did not catch, no Client will ever believe I tried to hide it.',
        ],
        images: [
          {
            url: "/images/alma_at_the_warehouse (3).jpeg",
            alt: "Alma inspecting stacked natural canvas fabric on a cutting table in an Indian workshop",
            caption:
              "Checking natural canvas weight and weave on the workshop floor before approving the sample run.",
            aspectRatio: "4:5",
          },
          {
            url: "/images/alam_with_the_warehouse_owners (2).jpeg",
            alt: "Alma and two workshop specialists examining the drape and colour of a purple leather hide",
            caption:
              "Checking leather drape and dye tone in person with our workshop partners. You cannot match an exact shade through a screen.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading:
          "Why you cannot match a colour on a screen, and why Europe blames India faster",
        paragraphs: [
          "That same run gave us a permanent onboarding rule we now enforce with every Client before dyeing begins: never match a colour through a screen. It does not matter how sharp a photograph or video looks, you cannot match an exact leather dye shade digitally. Because we could not send a physical reference in the exact tan tone he wanted until August, dyeing the leather was delayed when it could have happened months earlier. Today, at zero extra cost to us, every Client hands over a physical colour reference upfront, whether a purse, a belt, or a garment from their shop or home, unless they specifically want us to experiment with a new tone.",
          'I will not pretend there were no sleepless nights on that order. Leather bags were a new category for us too, and we were learning every nuance on the floor alongside our Manufacturing Partners. Even if a Client has spoken with me for ten meetings or ten months, on their first Bulk Order they still do not truly know how we perform until the cartons land. Too many people in sourcing say "yes, I do, I do, I do" to win a deposit and then fail at the end.',
          "I also feel a sharper hesitation in Europe whenever India is on the table. Years ago, before KarmaRise D Global, I helped European companies import from China. When China first opened up to global buyers, cheating and quiet material swaps happened all the time. Over the years that changed, largely because China built standardized high-volume export lines and reached a point where it could no longer afford to lose Europe. Growing European brands come to India for soft natural leathers, hand-finishing, and manageable runs of a few hundred pieces rather than massive Chinese minimums. Yet because smaller Indian workshops vary widely from one door to the next, India does not carry that same automatic credit in Europe. Whenever anything feels uncertain, it is very easy to blame India as a whole. Words never change that mindset. Proving someone wrong through delivery does.",
        ],
      },
      {
        heading:
          'The inner label, five-time checks, and "I give my life before I fail a client"',
        paragraphs: [
          "Sample approval also catches the quiet compliance and finishing details that decide whether cartons clear customs cleanly and feel complete in a boutique. European rules for leather bags are simpler than for textiles, which require full stitched composition labels, yet for clean EU customs clearance you still need a small, undetachable label stitched inside stating genuine leather and Made in India. On top of that minimum, I worked with him on an eco-conscious Spanish hangtag, writing the text while he handled the layout, so the finished piece felt cared for the moment a shopper picked it up.",
          "I will never promise a Client that weather, transport, or a dye batch will never nudge a schedule, because those are not always in my hands. What I promise is that every stage is checked double, triple, and five times over, from pre-production sample sign-off through the first pieces coming off the line and final packing, so that when bulk ships, there are zero errors inside the boxes.",
          "From the Maratha stories Shirish has shared with me since I moved to India, I sometimes tell Clients: I am Maratha in a way. I give my life before I fail a client. Shirish holds that exact same line, and we expect it from every Manufacturing Partner we bring onto a Manufacturing Programme. Yesterday, when we met a new textile maker, I told him plainly: we open our door to anyone who wants to work transparently, clearly, and honestly. Anything less simply does not work for us.",
        ],
      },
    ],
    spanishSections: [
      {
        heading:
          "De cuatro líneas en un papel a un bolso que funciona de verdad",
        paragraphs: [
          "Cuando un cliente viene a fabricar con nosotros por primera vez, suele saber muy bien qué compran sus clientas, pero muy poco sobre todo lo que puede fallar entre un boceto y una caja cerrada. Cuando desarrollamos la colección de bolsos de piel para una boutique de marroquinería en Donostia, el dueño eligió los modelos mirando su propio historial de ventas, y Shirish todavía se ríe recordando que el punto de partida para la mochila principal eran literalmente cuatro líneas.",
          "Nunca hacemos un corta y pega de un bolso que ya esté en la tienda, ni seguimos un dibujo a ciegas. Mirando aquel rectángulo rígido como mujer que usa bolsos todos los días, le dimos una ligera forma de pirámide, más estrecha arriba y más ancha abajo, para que apoye bien en la espalda sin tapar todo el torso. Medimos cada gramo porque la piel ya pesa de por sí y hoy nadie quiere cargar con bolsos pesados. Integramos un asa superior para poder cogerla o sujetarla abierta con una mano sin que se venza, quitamos los cuatro topes metálicos de la base, subimos los herrajes a latón envejecido y cambiamos el típico forro oscuro por un forro claro para poder ver de verdad lo que llevas dentro. Tras varios borradores en tela, bastaron solo dos muestras en piel para clavar la forma.",
          'Como quien fabrica por primera vez no puede adivinar dónde suelen atascarse los pedidos, también hago las preguntas incómodas antes de cortar una sola piel o un rollo de tela. ¿Qué pasa si una fecha se mueve una semana? ¿Qué margen real tienes antes de una campaña? Y prefiero hablar de incidencias en lugar de problemas cuando algo falla en esta fase. La palabra "problemas" suena fatal, como si el pedido entero estuviera perdido, cuando casi siempre lo que tienes delante es un ajuste concreto en una costura, un tinte o una correa antes de arrancar la producción.',
        ],
      },
      {
        heading:
          'Cremalleras japonesas de plástico, un bolso "demasiado pequeño" y los fallos que no ves',
        paragraphs: [
          "En la aprobación de la muestra es donde llevar la contraria a tiempo le ahorra quejas a un cliente seis meses después. En esa misma mochila montamos cremalleras japonesas de primera calidad, pero le aconsejé al dueño poner dientes de plástico en lugar de metal. El metal queda muy bien sobre la mesa del taller, hasta que una mujer mete la mano en el bolso y se araña los nudillos. Si además va en el bolsillo trasero, en invierno roza contra el abrigo hasta estropear el tejido y en verano araña la espalda descubierta. Se lo dije claro: haremos lo que tú prefieras, pero yo te aconsejo plástico; si no, a tus clientas les encantará el bolso pero se quejarán de la cremallera.",
          'Algo parecido pasó con dos modelos más pequeños que en principio iban a tener el mismo tamaño, y que primero sacamos en negro mientras esperábamos más tiempo por las pieles en tono tan. Al entrar en su tienda con las muestras, midió el segundo enseguida y dijo: "Esto es demasiado pequeño". Le contesté que era más pequeño, sí, no demasiado pequeño, y que si quería pedíamos otra muestra sin problema. Luego le pedí que mirara cómo los usan de verdad las mujeres. Uno tenía un aire más deportivo y diario; el otro era más de vestir, para salir por la tarde o la noche cuando llevas menos cosas. ¿Para qué tener dos bolsos del mismo tamaño si dos usos distintos le dan a la misma clienta un motivo para llevarse los dos? Me dio la razón y se quedó con el tamaño pequeño.',
          'La mayor parte de mi filtro ocurre incluso antes de que el cliente toque la pieza. Cada vez que un taller termina una muestra, la reviso yo primero. Si no me convence cómo cae, cómo cierra o qué tacto tiene, ni siquiera se la enseño al cliente: vuelve directa al banco de trabajo. E incluso cuando la muestra de preproducción pasa de la sala de prototipos a la línea real del taller con las pieles, forros y herrajes definitivos del pedido, nunca doy por bueno un "sí" rápido. Muchas veces el cliente respira aliviado al ver su idea hecha realidad y pasa por alto fallos físicos pequeños a los que a mí se me va la vista enseguida: dos paneles cortados de partidas de tinte ligeramente distintas, un broche que tira de una piel blanda porque faltó refuerzo interior o una costura que frunce al pasar a una máquina rápida de producción.',
          'Cuando veo algo así, aunque el cliente no lo haya notado, lo digo abiertamente: "No estoy al cien por cien contenta con esto y esto se va a cambiar". Quiero transparencia total desde el primer día. Si mañana se me escapa algo que de verdad no vi, ningún cliente podrá pensar jamás que intenté ocultárselo.',
        ],
        images: [
          {
            url: "/images/alma_at_the_warehouse (3).jpeg",
            alt: "Alma revisando pilas de lona cruda sobre la mesa de corte en un taller de la India",
            caption:
              "Comprobando el gramaje y la trama de la lona cruda en el taller antes de dar el visto bueno a la muestra.",
            aspectRatio: "4:5",
          },
          {
            url: "/images/alam_with_the_warehouse_owners (2).jpeg",
            alt: "Alma y dos especialistas del taller examinando la caída y el color de una piel morada",
            caption:
              "Comprobando en persona la caída y el tono del tinte junto al taller. Un color exacto nunca se iguala a través de una pantalla.",
            aspectRatio: "4:5",
          },
        ],
      },
      {
        heading:
          "Por qué no se puede igualar un color en pantalla, y por qué Europa desconfía antes de la India",
        paragraphs: [
          "De aquel mismo pedido salió una norma fija que hoy aplicamos a todo cliente antes de teñir: nunca igualar un color a través de una pantalla. Da igual lo buena que sea la foto o el vídeo, un tono exacto de piel no se puede copiar en digital. Como no pudimos enviar una referencia física en el tono tan exacto que buscaba hasta agosto, el teñido de la piel se retrasó cuando habría podido estar listo meses antes. Hoy, sin ningún coste extra para nosotros, todo cliente nos entrega al principio una pieza física en el color que busca, ya sea un monedero, un cinturón o una prenda de su tienda o de su casa, salvo que quiera expresamente experimentar con un tono nuevo.",
          'No voy a fingir que no pasé noches sin dormir en aquel pedido. Los bolsos de piel también eran una categoría nueva para nosotros y estábamos aprendiendo cada detalle sobre el terreno junto a los talleres. Aunque un cliente lleve diez reuniones o diez meses hablando conmigo, en su primer pedido grande no sabe de verdad cómo trabajamos hasta que llegan las cajas. Hay demasiada gente en este sector que dice "sí, sí, claro, yo lo hago" para cobrar una señal y luego falla al final.',
          "También noto una desconfianza previa más rápida en Europa cada vez que se habla de la India. Hace años, antes de KarmaRise D Global, ayudé a empresas europeas a importar desde China. Cuando China empezó a fabricar para el mundo, los engaños y los cambios silenciosos de material eran constantes. Con los años eso cambió, sobre todo porque China montó líneas de exportación muy estandarizadas para grandes volúmenes y llegó un punto en que no podía permitirse perder a Europa. Muchas marcas europeas en crecimiento miran hoy hacia la India buscando pieles naturales suaves, acabados artesanales y tiradas asumibles de unos cientos de unidades en lugar de los mínimos enormes de China. Pero como los talleres pequeños en la India varían muchísimo de una puerta a otra, el país todavía no tiene ese crédito automático en Europa. En cuanto algo genera dudas, resulta muy fácil echarle la culpa a la India entera. Las palabras no cambian esa idea de nadie; lo único que la cambia es demostrar con hechos que se equivocan al entregar bien el pedido.",
        ],
      },
      {
        heading:
          'La etiqueta interior, revisar cinco veces y "doy la vida antes que fallarle a un cliente"',
        paragraphs: [
          "Aprobar la muestra también atrapa los detalles discretos de normativa y acabado que deciden si las cajas pasan la aduana sin sustos y si la pieza llega redonda a la tienda. Las normas europeas para bolsos de piel son más sencillas que en textil, donde hace falta una etiqueta cosida completa con toda la composición, pero para entrar limpiamente por aduana en Europa conviene llevar cosida en el interior una pequeña etiqueta no desprendible que indique piel auténtica y Made in India. Por encima de ese mínimo, trabajé con él en una etiqueta colgante en español de corte más ecológico, escribiendo yo los textos mientras él se ocupaba del diseño, para que el bolso transmitiera cuidado desde el primer vistazo en tienda.",
          "Nunca le prometeré a un cliente que el clima, el transporte o una partida de tinte jamás moverán una fecha, porque no siempre depende de mí. Lo que sí prometo es revisar cada fase dos, tres y hasta cinco veces, desde la muestra de preproducción hasta las primeras piezas que salen de la línea y el embalaje final, para que cuando salga el pedido no vaya ni un solo error dentro de las cajas.",
          "Por las historias marathas que Shirish me ha contado desde que vivo en la India, a veces les digo a los clientes: en cierto modo soy maratha, doy la vida antes que fallarle a un cliente. Shirish mantiene exactamente esa misma línea, y se la exigimos a cada taller con el que trabajamos. Ayer mismo, al reunirnos con un nuevo fabricante textil, se lo dije claro: abrimos la puerta a quien quiera trabajar con transparencia, claridad y honestidad total. Todo lo que sea menos que eso simplemente no nos sirve.",
        ],
      },
    ],
    takeaway: "",
    spanishTakeaway: "",
    seo: {
      title: "Why Sample Approval Decides Bulk Quality",
      description:
        "Alma shares real sample decisions from India: switching to Japanese plastic-tooth zippers, requiring physical colour references, hiding bad samples, and checking production five times over.",
      spanishTitle:
        "Por qué la aprobación de la muestra decide la calidad final",
      spanishDescription:
        "Alma cuenta decisiones reales de muestreo en la India: cremalleras japonesas de plástico, referencias físicas de color, filtrar muestras malas y revisar cinco veces antes de enviar.",
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
        aspectRatio: "4:3",
      },
      {
        url: "/images/alma_with_a_woman (2).jpeg",
        alt: "Alma inside a Maharashtra home beside a local woman holding a folded orange saree with a purple and gold zari border",
        caption:
          "Alma inside a home here in Maharashtra with a woman holding one of her kept family sarees, woven with a purple and gold zari border.",
        aspectRatio: "4:5",
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
            aspectRatio: "4:3",
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
            aspectRatio: "4:3",
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
      spanishTitle:
        "El Maharashtra detrás de los monumentos: fuertes de basalto, escritura modi y cenefas tejidas",
      spanishDescription:
        "Shirish cuenta cómo los fuertes marathas, la escritura modi, los reformadores sociales, los telares Paithani y los saris guardados en casa dan forma a KarmaRise D Global y Almarise.",
    },
  },
  {
    slug: "preparing-womens-garment-training-maharashtra",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "01",
    publishedAt: "2026-10-22",
    readingTimeMinutes: 6,
    category: "Inside KarmaRise",
    location: "India & Spain",
    spanishLocation: "India y España",
    title:
      "Why we walked away from charity, and why our Women's Training Initiative has not started yet",
    spanishTitle:
      "Por qué nos alejamos de la caridad y por qué nuestra iniciativa de formación para mujeres aún no ha empezado",
    summary:
      "Before we open a single training seat in India, we want to be plain about two things: our Women's Training Initiative is still in preparation, and a month in Rajasthan taught me why pity and handouts never last.",
    spanishSummary:
      "Antes de abrir una sola plaza de formación en la India, prefiero dejar dos cosas claras: nuestra iniciativa para mujeres todavía está en preparación, y un mes en Rajastán me enseñó por qué la lástima y la limosna nunca construyen nada duradero.",
    author: {
      name: "Alma",
      role: "Co-founder, KarmaRise D Global",
      spanishRole: "Cofundadora de KarmaRise D Global",
      location: "India & Spain",
      spanishLocation: "India y España",
      portraitUrl: "/images/alma.jpeg",
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
      alt: "Sunlit studio room in India with two industrial sewing tables and a dress form under protective plastic covers and an open travel suitcase on the floor",
      caption:
        "Our studio room in India while everything is still in preparation: sewing tables and a dress form under dust covers, fabric bundles waiting on the benches, and my suitcase still open on the floor.",
    },
    spanishLeadAlt:
      "Habitación soleada de nuestro estudio en la India con dos mesas de máquinas de coser industriales y un maniquí bajo plásticos protectores y una maleta abierta en el suelo",
    spanishLeadCaption:
      "Nuestro estudio en la India todavía en plena preparación: las mesas de costura y el maniquí aún bajo fundas, bultos de tela esperando y mi maleta abierta en el suelo.",
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Studio room in India in preparation",
      description:
        "4:3 daylight photograph of our studio room in India with industrial sewing tables and dress form under dust covers while groundwork is underway.",
    },
    pullQuote: {
      text: "We are not here to hand out food to anyone. We are here to teach women how to fish, put the rod in their hands, and make sure real paid work is waiting when they finish.",
      attribution: "Alma",
    },
    spanishPullQuote: {
      text: "No estamos aquí para repartir comida a nadie. Queremos enseñar a pescar, entregar la caña y asegurarnos de que haya trabajo real y pagado al terminar.",
      attribution: "Alma",
    },
    pairImages: [
      {
        url: "/images/alma_with_a_woman (3).jpeg",
        alt: "Alma smiling face to face with an Indian woman holding a folded stack of green, orange, and magenta silk sarees inside a home near Mumbai",
        caption:
          "Standing face to face with a woman in her home near Mumbai over a stack of her kept sarees. For me, working with women starts as equals, never from pity.",
      },
      {
        url: "/images/shirish_with_workers_at_warehouse (3).jpeg",
        alt: "Shirish standing beside a woman artisan preparing stacks of yellow-and-white striped cotton bag linings and cut black panels on an assembly table in India",
        caption:
          "Shirish beside a woman artisan preparing striped cotton linings during a commercial run. Paid, steady work on real orders is what we want our planned training to lead toward.",
      },
    ],
    spanishPairAlts: [
      "Alma sonriendo frente a frente con una mujer india que sostiene una pila doblada de saris de seda verde, naranja y magenta en una casa cerca de Bombay",
      "Shirish junto a una artesana preparando pilas de forros de algodón a rayas amarillas y blancas y paneles negros cortados sobre una mesa de montaje en la India",
    ],
    spanishPairCaptions: [
      "Frente a frente con una mujer en su casa cerca de Bombay, con una pila de sus saris guardados entre las dos. Para mí, trabajar con mujeres empieza siempre de igual a igual, nunca desde la lástima.",
      "Shirish junto a una artesana preparando forros de algodón a rayas durante un pedido real. Un trabajo estable y remunerado es la meta a la que queremos que conduzca nuestra futura formación.",
    ],
    pairSlots: [
      {
        title: "Meeting women as equals",
        description:
          "Portrait photo (4:5): Alma face to face with a woman in India holding folded sarees.",
      },
      {
        title: "Paid skilled work on the floor",
        description:
          "Portrait photo (4:5): Shirish beside a woman artisan preparing striped cotton linings during a commercial production run.",
      },
    ],
    sections: [
      {
        heading: "First, the honest update: we have not started yet",
        paragraphs: [
          "If you have seen our planned Women's Training Initiative mentioned elsewhere on this website, I want to clear one thing up straight away: we have not started yet. Not a single trainee has walked through our door for a class.",
          "Right now, our studio room in India holds industrial sewing tables, a dress form, and stacks of fabric used between Almarise sample runs. Most days those machines sit under dust covers while we focus on commercial production and paperwork. Nothing has been dressed up for a brochure.",
          "Too many projects talk about a future plan as if it were already running. Shirish and I refuse to do that. We are building our commercial work first and laying the legal and practical groundwork slowly, because I already saw firsthand what happens when good intentions run ahead of reality.",
        ],
      },
      {
        heading: "Three houses in Spain, and one month in Rajasthan",
        paragraphs: [
          "By training, I am a certified English-as-a-foreign-language teacher. Years before I ever set foot in India, I volunteered in Spain with a small organisation that ran three transitional houses for single immigrant mothers, including women from Morocco and one woman from India. What worked there was simple and unsentimental. Each woman had a roof for a year, learned Spanish, trained in a practical trade, and got help stepping into a real job. Nobody kept them dependent. The whole point was giving them a bridge to stand on their own feet.",
          "In January 2023, I made my first trip to India to visit my friend Virginia in Pushkar, in Rajasthan. Virginia has been coming to India for more than twenty-five years and ran a small desert project working with Dalit and nomadic families and tiny rural schools. When I walked into those classrooms and saw that neither the children nor their English teachers spoke fluent English, I slipped straight into teacher mode. I offered to write a proper English syllabus, stay three months, and raise money for a screen and a router so I could keep teaching online once I flew back to Spain.",
          'Virginia sat me down and gave me the truth I could not see as a newcomer. In rural Rajasthan, caste walls still blocked those children from reaching college even if their English improved. Meanwhile, the children who needed cash for their families already spoke sharper street English than any classroom textbook, walking up to travellers saying, "I will come with you and bargain for you," to earn commissions from local shops. Worse, I saw a public school Virginia had paid to refurbish, complete with clean toilets and proper desks, stripped bare and ruined shortly afterward. I spent nearly a month pushing to find a way around those walls before I finally accepted that the project could not work.',
        ],
      },
      {
        heading: "The 100-rupee milk lesson, and why I want to work with women",
        paragraphs: [
          'That month also cured me of any patience for Western pity. I get goosebumps, in the bad sense, whenever I hear foreigners talk about India in that soft voice: "Oh, poor people, let us give them food, let us hand out money."',
          "Virginia gave me a rule on the street that stayed with me. Never buy milk for someone carrying a baby outside a shop. You hand over a hundred rupees, walk away feeling pleased with yourself, and five minutes later they take the milk straight back to the shopkeeper and pocket ninety rupees in cash. Your charity becomes a steady side business for the shop. Saying no face to face is genuinely hard, I will not pretend otherwise, so I settled on a clear line instead: exchange, not handouts. Come learn something real, put in honest work, and earn your own pay in return. We are not here to hand out food to anyone. We are here to teach people how to fish and put the rod in their hands.",
          "Rajasthan forced one more honest admission out of me, a personal one. That project meant teaching children, and I am simply not cut out for it. I adore babies, truly, yet I get bored trying to entertain kids all day. Working with adult women is a completely different world. You sit across from another adult, speak plainly, and build a skill together. I have believed all my life that there is no age limit for learning. There is only will, or no will.",
        ],
      },
      {
        heading:
          "Commercial work first, Section 8 paperwork next, then the training room",
        paragraphs: [
          "When I got to know Shirish well after we began working together, one of the things that convinced me we could build something serious was how genuinely he cares about women standing on their own. I tease him that he is 150% Indian and 190% Marathi, stubborn about doing things properly and unwilling to cut corners. When he talks about Almarise, he puts the whole purpose into one line: the saree belonged to a woman, a woman cuts and stitches it in our studio, and a woman wears it on the other side of the world.",
          "That is the circle our planned Women's Training Initiative is meant to join. It is not an NGO handing out certificates that lead nowhere, and it is not charity. Our aim is to train women in garment design, pattern work, and stitching to real commercial standards, with steady paid employment as the long-term goal.",
          "Two foundations have to be solid before we invite a single woman to enrol. The first is real commercial demand: growing our Manufacturing Programmes for Clients in Spain and across Europe, and building Almarise so there is paid garment work waiting when trainees are ready. The second is the legal structure. Shirish, who is a lawyer here in India, is steering the setup of a formal Section 8 non-profit foundation for the training work. Because I am a Spanish national joining as a co-founder, the compliance takes extra steps and patience, from Indian director registrations to apostilled Spanish paperwork, and we are taking the time to do every piece by the book.",
          "For now, the sewing machines in that sunlit room remain part of our studio setup while commercial orders and Almarise grow, and while the legal papers move forward step by step. The day we pull the dust covers off for our first group of women, we will tell you right here. Until then, we would rather show you what is real today than sell you a programme that has not begun.",
        ],
        images: [
          {
            url: "/images/alma_and_shirish_sitting_at_table (2).jpeg",
            alt: "Shirish and Alma sitting face to face across a small table with a tablet in front of a bright window in India discussing company plans",
            caption:
              "Talking through our plans with Shirish by the window in India. Commercial orders and legal groundwork come first, before we promise a single training seat.",
            aspectRatio: "4:3",
          },
        ],
      },
    ],
    spanishSections: [
      {
        heading: "Primero, la verdad por delante: todavía no hemos empezado",
        paragraphs: [
          "Si has visto mencionada nuestra futura iniciativa de formación para mujeres en algún rincón de esta web, quiero dejar una cosa clara desde la primera línea: todavía no ha empezado. A día de hoy no ha entrado ninguna alumna a dar clase.",
          "Ahora mismo, nuestro estudio en la India reúne mesas de máquinas de coser industriales, un maniquí y pilas de tela que usamos entre prueba y prueba de Almarise. Muchos días esas máquinas siguen tapadas con fundas mientras nos centramos en la producción comercial y el papeleo. Aquí no hemos maquillado nada para un folleto.",
          "Demasiados proyectos hablan de un plan futuro como si ya estuviera en marcha. Shirish y yo nos negamos a hacer eso. Primero estamos consolidando la actividad comercial y resolviendo despacio la base legal y técnica, porque yo ya vi con mis propios ojos lo que pasa cuando las buenas intenciones corren más que la realidad.",
        ],
      },
      {
        heading: "Tres pisos en España y un mes en Rajastán",
        paragraphs: [
          "Por formación soy profesora titulada de inglés como lengua extranjera. Años antes de pisar la India, fui voluntaria en España en una pequeña asociación que llevaba tres pisos de acogida para madres solteras inmigrantes, entre ellas mujeres marroquíes y una mujer india. Lo que funcionaba allí era sencillo y sin dramatismos: un año de vivienda, clases de español, un oficio práctico y acompañamiento para encontrar un empleo real. Nadie las mantenía dependientes. El objetivo era tender un puente para que pudieran valerse por sí mismas.",
          "En enero de 2023 viajé por primera vez a la India para visitar a mi amiga Virginia en Pushkar, en Rajastán. Virginia lleva más de veinticinco años viniendo a la India y llevaba un pequeño proyecto en el desierto con familias dalit y nómadas y escuelitas rurales. Al entrar en aquellas aulas y comprobar que ni los niños ni sus profesores hablaban inglés con soltura, me salió enseguida el instinto de profesora. Me ofrecí a preparar un temario en condiciones, quedarme tres meses y reunir dinero para comprar una pantalla y un router y seguir dándoles clase online cuando volviera a España.",
          'Virginia se sentó conmigo y me contó la realidad que una recién llegada no ve. En el Rajastán rural, el muro de las castas seguía cerrando a esos niños el acceso a la universidad por mucho inglés que aprendieran. Mientras tanto, los chavales que necesitaban llevar dinero a casa ya dominaban un inglés de calle más afilado que cualquier libro de texto, acercándose a los viajeros con un "vengo contigo y regateo por ti" para llevarse comisión en las tiendas. Peor todavía: vi una escuela pública que Virginia había pagado para rehabilitar, con baños nuevos y pupitres en condiciones, desmantelada y destrozada al poco tiempo. Pasé casi un mes intentando buscarle una vuelta hasta que tuve que aceptar que aquel proyecto no era viable.',
        ],
      },
      {
        heading:
          "La lección de la leche de cien rupias y por qué quiero trabajar con mujeres",
        paragraphs: [
          'Aquel mes también me quitó cualquier paciencia con la lástima occidental. Se me pone la piel de gallina, y no para bien, cada vez que oigo a extranjeros hablar de la India con ese tono lastimero de "pobrecitos, vamos a darles comida o dinero".',
          "Virginia me dio en la calle una norma que no he olvidado. Nunca compres leche para alguien que te la pida con un bebé en brazos a la puerta de una tienda. Pagas cien rupias, te marchas pensando que has hecho una buena obra y cinco minutos después devuelven la leche al tendero y se quedan noventa rupias en mano. Tu caridad acaba convertida en un negocio paralelo para la tienda. Decir que no a la cara cuesta muchísimo, no voy a fingir que sea fácil, así que me fijé otra regla: intercambio, no limosna. Ven a aprender un oficio de verdad, haz un trabajo honesto y gana tu propio sueldo a cambio. No estamos aquí para repartir comida a nadie; estamos para enseñar a pescar y poner la caña en sus manos.",
          "Rajastán me obligó además a reconocer otra verdad muy personal. Aquel proyecto consistía en enseñar a niños, y yo no sirvo para eso. Los bebés me encantan, de verdad, pero entretener a niños todo el día me aburre. Trabajar con mujeres adultas es otro mundo. Te sientas frente a otra adulta, hablas claro y construyes una habilidad juntas. Llevo toda la vida convencida de que no hay edad para aprender; solo existen las ganas o la falta de ganas.",
        ],
      },
      {
        heading:
          "Primero el trabajo comercial, luego la Fundación Section 8 y después el aula",
        paragraphs: [
          "Cuando empecé a conocer bien a Shirish trabajando juntos, una de las cosas que me convenció de que podíamos levantar algo serio fue ver cuánto le importa de verdad que las mujeres salgan adelante. Siempre bromeo con que es 150% indio y 190% maratí, cabezota para hacer las cosas bien y enemigo de los atajos. Cuando habla de Almarise resume el sentido de todo en una frase: el sari perteneció a una mujer, otra mujer lo corta y lo cose en nuestro estudio y otra mujer lo viste al otro lado del mundo.",
          "Ese es el círculo al que queremos sumar nuestra futura iniciativa de formación para mujeres. No es una ONG que reparte diplomas sin salida, ni es caridad. Nuestro objetivo es formar a mujeres en diseño de prendas, patronaje y confección con estándares profesionales reales, con el empleo remunerado y estable como meta a largo plazo.",
          "Antes de invitar a una sola mujer a apuntarse, tienen que estar firmes dos pilares. El primero es una demanda comercial constante: hacer crecer nuestros programas de fabricación para clientes en España y Europa y consolidar Almarise para que haya trabajo textil pagado esperando al terminar la formación. El segundo es la estructura legal. Shirish, que es abogado aquí en la India, está dirigiendo la constitución de una fundación sin ánimo de lucro bajo el marco Section 8 para esta labor formativa. Como soy ciudadana española y entro como cofundadora, el expediente lleva trámites adicionales y mucha paciencia, desde registros de dirección en la India hasta documentación española apostillada, y estamos dedicando el tiempo necesario para hacerlo todo conforme a la ley.",
          "De momento, las máquinas de coser de aquella habitación soleada siguen formando parte de nuestro estudio mientras crecen los pedidos comerciales y Almarise, y mientras el papeleo legal avanza paso a paso. El día que quitemos los plásticos para recibir al primer grupo de mujeres, te lo contaremos aquí mismo. Hasta entonces, preferimos enseñarte lo que es real hoy antes que venderte un programa que aún no ha empezado.",
        ],
        images: [
          {
            url: "/images/alma_and_shirish_sitting_at_table (2).jpeg",
            alt: "Shirish y Alma sentados frente a frente ante una pequeña mesa con una tableta junto a una ventana luminosa en la India repasando planes",
            caption:
              "Repasando planes con Shirish junto a la ventana en la India. Primero consolidamos los pedidos comerciales y el papeleo legal, antes de prometer una sola plaza de formación.",
            aspectRatio: "4:3",
          },
        ],
      },
    ],
    takeaway: "",
    spanishTakeaway: "",
    seo: {
      title: "Why Our Planned Women's Training Initiative Has Not Started Yet",
      description:
        "Alma explains why a month in Rajasthan turned her away from handout charity, how commercial orders and Section 8 legal groundwork come first, and where KarmaRise D Global's planned Women's Training Initiative stands today.",
      spanishTitle:
        "Por qué nuestra iniciativa de formación para mujeres aún no ha empezado",
      spanishDescription:
        "Alma cuenta por qué un mes en Rajastán la alejó de la caridad asistencial, por qué el trabajo comercial y la fundación Section 8 van primero y en qué punto real está la futura formación textil de KarmaRise D Global.",
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
