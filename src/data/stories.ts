export type StoryCategory =
  | "Heritage & Culture"
  | "Sustainable Fashion"
  | "People & Craftsmanship"
  | "Art & Design"
  | "India Meets Europe"
  | "KarmaRise Journal";

export type StoryLanguage = "en" | "es";

export interface StoryCategoryDetail {
  number: string;
  slug: string;
  title: StoryCategory;
  spanishTitle: string;
  shortLabel: string;
  description: string;
  spanishDescription: string;
  coverImage: string;
  coverAlt: string;
}

export interface StoryImage {
  url: string;
  alt: string;
  caption?: string;
}

export interface StoryAuthor {
  name: string;
  role: string;
  location: string;
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
    }
  | {
      _key: string;
      _type: "pullQuoteBlock";
      text: string;
      attribution?: string;
    };

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
  title: string;
  spanishTitle?: string;
  summary: string;
  spanishSummary?: string;
  author: StoryAuthor;
  tags: string[];
  leadImage?: StoryImage;
  leadSlot: {
    kind: "Photo" | "Video" | "Photo or video";
    ratio: string;
    title: string;
    description: string;
  };
  pullQuote?: StoryPullQuote;
  pairImages?: StoryImage[];
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
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  takeaway: string;
  seo?: {
    title?: string;
    description?: string;
  };
}

export const storyCategoryDetails: StoryCategoryDetail[] = [
  {
    number: "01",
    slug: "heritage-and-culture",
    title: "Heritage & Culture",
    spanishTitle: "Costumbres y raíces",
    shortLabel: "Heritage",
    description:
      "We walk through Maharashtra's stone forts, weaving towns, and local traditions to see where the region's eye for structure and colour comes from.",
    spanishDescription:
      "Recorremos los fuertes de piedra, los pueblos tejedores y las costumbres de Maharashtra para entender de dónde nace su forma de trabajar.",
    coverImage: "/images/forts (3).jpg",
    coverAlt:
      "Historic stone fort walls and archway rising against a clear sky in Maharashtra",
  },
  {
    number: "02",
    slug: "sustainable-fashion",
    title: "Sustainable Fashion",
    spanishTitle: "Moda sostenible",
    shortLabel: "Sustainability",
    description:
      "We unroll vintage Maharashtrian sarees in the morning light and let their woven borders decide where a sleeve, lapel, or hemline belongs.",
    spanishDescription:
      "Extendemos saris antiguos de Maharashtra sobre la mesa de corte y dejamos que sus bordes tejidos decidan dónde nacen el puño y el bajo.",
    coverImage: "/images/maria_2.jpeg",
    coverAlt:
      "Contemporary kimono wrap cut from a yellow and red patterned Indian saree worn outdoors in Madrid",
  },
  {
    number: "03",
    slug: "people-and-craftsmanship",
    title: "People & Craftsmanship",
    spanishTitle: "Nuestra gente y sus oficios",
    shortLabel: "Craftsmanship",
    description:
      "Conversations over chai with pattern masters, leather machinists, and the women and artisans who bring every piece to life.",
    spanishDescription:
      "Charlas frente a un chai con maestros patronistas, artesanos de la piel y las personas que dan vida a cada pieza en el taller.",
    coverImage: "/images/shirish_with_workers_at_warehouse (5).jpeg",
    coverAlt:
      "Shirish standing beside a master machinist stitching a leather strap inside an Indian workshop",
  },
  {
    number: "04",
    slug: "art-and-design",
    title: "Art & Design",
    spanishTitle: "Arte, telas y diseño",
    shortLabel: "Design",
    description:
      "How a sketch becomes something you can hold: touching hides, testing seam tension, and checking every sample on the table.",
    spanishDescription:
      "Cómo un boceto pasa a ser algo que puedes tocar: elegir pieles, probar costuras y revisar cada muestra sobre la mesa.",
    coverImage: "/images/alam_with_the_warehouse_owners (2).jpeg",
    coverAlt:
      "Alma and Manufacturing Partner leads inspecting full-grain leather hides under workshop lights",
  },
  {
    number: "05",
    slug: "india-meets-europe",
    title: "India Meets Europe",
    spanishTitle: "Entre India y España",
    shortLabel: "India & Europe",
    description:
      "Living with one foot in Spain and one in Maharashtra, connecting European Clients and Indian workshops through one shared conversation.",
    spanishDescription:
      "Vivir con un pie en España y otro en Maharashtra, conectando a clientes europeos y talleres indios en una misma conversación.",
    coverImage: "/images/alma-and-shirish-founders.jpg",
    coverAlt:
      "Shirish and Alma reviewing fabric swatches and a Product Brief across a sunlit studio table",
  },
  {
    number: "06",
    slug: "karmarise-journal",
    title: "KarmaRise Journal",
    spanishTitle: "El día a día en KarmaRise",
    shortLabel: "Journal",
    description:
      "Honest notes from our studio in Ulhasnagar, completed Bulk Order dispatches, and the groundwork for our planned Women's Training Initiative.",
    spanishDescription:
      "Notas sinceras desde nuestro estudio en Ulhasnagar, pedidos listos para salir y los pasos previos de nuestra iniciativa de formación para mujeres.",
    coverImage: "/images/warehouse_reference.jpeg",
    coverAlt:
      "Sunlit Maharashtra garment studio with sewing benches, dress form, and wooden floors",
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
    issueNumber: "Edition 01",
    publishedAt: "2026-11-14",
    readingTimeMinutes: 5,
    category: "India Meets Europe",
    location: "Madrid and Ulhasnagar",
    title:
      "How one Product Brief travels from a desk in Spain to a cutting table in India",
    spanishTitle:
      "De una mesa en Madrid a una mesa de corte en la India: así viaja un Product Brief sin perderse por el camino",
    summary:
      "When you change a strap length or a lining in Spain, who makes sure the pattern master in India hears about it? Here is how we keep both tables connected.",
    spanishSummary:
      "Cuando cambias el largo de una correa o un forro desde España, ¿quién se asegura de que el maestro patronista en la India lo tenga claro? Así conectamos ambas mesas.",
    author: {
      name: "Alma & Shirish",
      role: "Co-founders, KarmaRise D Global",
      location: "Spain & Maharashtra",
      portraitUrl: "/images/alma-and-shirish-founders.jpg",
    },
    tags: [
      "Product Brief",
      "Cross-border manufacturing",
      "Spain",
      "Maharashtra",
    ],
    leadImage: {
      url: "/images/alma-and-shirish-founders.jpg",
      alt: "Shirish and Alma discussing a Product Brief with fabric and leather swatches on a wooden table",
      caption:
        "Shirish and Alma reviewing fabric and leather swatches together so the conversation in Spain and the cutting table in India stay on the same page.",
    },
    leadSlot: {
      kind: "Photo",
      ratio: "16:10 horizontal",
      title: "Annotated patterns and material cards on a desk",
      description:
        "Documentary horizontal shot showing printed specification notes, pattern pieces, and fabric or leather cards laid out beside a workshop bench in natural daylight.",
    },
    pullQuote: {
      text: "When a question comes up during pattern drafting, the decision comes straight back to you instead of getting improvised on the sewing line.",
      attribution: "Alma & Shirish · Working across distance",
    },
    pairImages: [
      {
        url: "/images/alma_at_the_warehouse (4).jpeg",
        alt: "Alma inspecting a finished brown leather sample bag against a whole hide on a workshop table",
        caption:
          "Alma comparing an approved leather bag sample directly against the hide grain before cutting starts.",
      },
      {
        url: "/images/shirish_at_warehouse.jpeg",
        alt: "Shirish seated at a factory review desk with specification binders and leather prototypes",
        caption:
          "Shirish going through the written specifications and sample tags on site with our Manufacturing Partner.",
      },
    ],
    pairSlots: [
      {
        title: "European brief review",
        description:
          "Portrait photo (4:5): physical reference sample and trim notes being compared during the Product Brief review in Europe.",
      },
      {
        title: "Workshop cutting table handoff",
        description:
          "Portrait photo (4:5): Shirish and a workshop pattern master checking dimensions on the cutting table in India.",
      },
    ],
    sections: [
      {
        heading: "Where misinterpretation starts",
        paragraphs: [
          "Most cross-border production headaches start long before a single piece of leather or cloth is cut. When a product idea travels through a chain of forwarded emails, quick voice notes, and hasty translations, small details around pocket depth, seam allowance, or lining weight start to drift.",
          "Inside a Manufacturing Programme, we use the Product Brief as one living document held at the same time by Alma in Spain and Shirish in India. Every measurement, hardware finish, and quantity expectation is written down clearly before a workshop even quotes the work.",
        ],
      },
      {
        heading: "Keeping the workshop table aligned",
        paragraphs: [
          "Before sampling begins, we sit down with the Manufacturing Partner on the factory floor to review the materials, hardware specs, sizing notes, and target packaging in person.",
          "Alma talks through the details with our Client in Spanish, English, or Portuguese to capture what their customers actually notice on the shelf. Shirish carries those exact notes to the pattern master in India and checks the first physical cut against the brief.",
        ],
      },
      {
        heading: "One record from sample to dispatch",
        paragraphs: [
          "If a strap needs two extra centimetres or a zipper pull changes during sampling, we update the Product Brief that same week. By the time the Bulk Order goes into production, the workshop is working from a signed physical sample and a clear specification everyone trusts.",
        ],
      },
    ],
    takeaway:
      "Clear written decisions at the Product Brief stage protect sample timelines and keep Bulk Order quality predictable.",
    seo: {
      title: "How a Product Brief Travels from Spain to India",
      description:
        "See how KarmaRise D Global keeps European Clients and Indian Manufacturing Partners aligned through one shared Product Brief.",
    },
  },
  {
    slug: "giving-maharashtrian-sarees-a-second-life",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "Edition 01",
    publishedAt: "2026-11-11",
    readingTimeMinutes: 4,
    category: "Sustainable Fashion",
    location: "Maharashtra and Madrid",
    title: "Giving Maharashtrian sarees a second life as contemporary clothing",
    spanishTitle:
      "Cómo damos una segunda vida a los saris de Maharashtra para llevarlos hoy en día",
    summary:
      "We unroll vintage silk and cotton sarees in Maharashtra and let their woven borders and pallus decide where the sleeve, collar, and hemline belong.",
    spanishSummary:
      "Extendemos saris antiguos de seda y algodón en Maharashtra y dejamos que sus cenefas tejidas nos digan por dónde cortar cada prenda.",
    author: {
      name: "Alma",
      role: "Co-founder & Creative Lead",
      location: "Madrid & Ulhasnagar",
      portraitUrl: "/images/alma.jpeg",
    },
    tags: ["Almarise", "Upcycling", "Maharashtrian sarees", "Circular fashion"],
    leadImage: {
      url: "/images/maria_2.jpeg",
      alt: "Woman in Madrid wearing an orange and yellow patterned saree kimono with denim",
      caption:
        "An Almarise piece photographed in Madrid, cut from an existing patterned saree so the original border frames the sleeve and hem.",
    },
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Folded Maharashtrian sarees beside a finished garment",
      description:
        "4:3 studio photograph of folded Maharashtrian silk and cotton sarees with rich woven borders resting beside a modern finished garment cut from similar fabric.",
    },
    pullQuote: {
      text: "Spread a vintage saree across the cutting table and look at where the dense border meets the field of the cloth. That edge tells you where a cuff or hemline belongs.",
      attribution: "Alma · Almarise studio notes",
    },
    pairImages: [
      {
        url: "/images/maria_6.jpeg",
        alt: "Close portrait showing gold zari and mirror work along the neckline of an Almarise garment",
        caption:
          "Original gold zari and woven border work placed along the neckline and shoulder seam.",
      },
      {
        url: "/images/maria_1.jpeg",
        alt: "Full-length silhouette of an asymmetric tunic cut from a geometric patterned saree",
        caption:
          "Testing how an asymmetric saree tunic moves in everyday Madrid daylight.",
      },
    ],
    pairSlots: [
      {
        title: "Border and pallu placement study",
        description:
          "Portrait photo (4:5): pattern paper pinned directly across a patterned saree border on a wooden cutting table.",
      },
      {
        title: "Contemporary street silhouette",
        description:
          "Portrait photo (4:5): editorial view of the finished saree-derived garment worn outdoors in everyday daylight.",
      },
    ],
    sections: [
      {
        heading: "Respecting the cloth that already exists",
        paragraphs: [
          "Almarise is KarmaRise D Global's own fashion brand, born from something we kept seeing in homes and markets across Maharashtra: stacks of woven sarees with extraordinary border work and colour sitting folded away in trunks.",
          "Instead of ordering new fabric rolls from a mill, Almarise starts with existing Maharashtrian sarees. We unroll each five-to-nine-yard piece in the daylight and check the weave strength, texture, and border by hand before pattern paper ever touches the table.",
        ],
      },
      {
        heading: "Cutting around the border",
        paragraphs: [
          "Standard garment cutting treats fabric as a blank roll. Working with a saree flips that upside down. The decorative pallu and dense woven borders tell us how to lay out the pattern pieces so the craft becomes the cuff, lapel, or hem with very little waste.",
        ],
      },
      {
        heading: "Hands-on garment discipline",
        paragraphs: [
          "Building Almarise keeps our own hands in pattern cutting, French seams, lining choices, and small-batch tailoring inside Maharashtra right alongside our B2B Manufacturing Programmes.",
        ],
      },
    ],
    takeaway:
      "Working directly on our own garment brand sharpens the practical pattern and finishing knowledge we bring to every Client Manufacturing Programme.",
    seo: {
      title: "Upcycling Maharashtrian Sarees into Contemporary Clothing",
      description:
        "How Almarise by KarmaRise D Global transforms existing Indian sarees into modern silhouettes for European wardrobes.",
    },
  },
  {
    slug: "matching-a-workshop-to-the-product",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "Edition 01",
    publishedAt: "2026-11-08",
    readingTimeMinutes: 5,
    category: "People & Craftsmanship",
    location: "Across India",
    title:
      "Matching a workshop to the product rather than forcing the product to fit a workshop",
    spanishTitle:
      "Buscar el taller que mejor sabe hacer tu producto, y no al revés",
    summary:
      "Why we travel across India to sit down with workshop owners, look at their machines, and see what their teams love making every day.",
    spanishSummary:
      "Por qué viajamos por toda la India para sentarnos con los dueños de los talleres, ver sus máquinas y entender qué es lo que mejor saben hacer.",
    author: {
      name: "Shirish",
      role: "Co-founder & India Operations Lead",
      location: "Ulhasnagar, Maharashtra",
      portraitUrl: "/images/shirish.jpeg",
    },
    tags: [
      "Manufacturing Partner",
      "Craftsmanship",
      "Factory audit",
      "Leather and textiles",
    ],
    leadImage: {
      url: "/images/shirish_with_workers_at_warehouse (5).jpeg",
      alt: "Shirish observing a craftsman stitching a heavy strap on an industrial cylinder-bed machine",
      caption:
        "Shirish on the workshop floor checking stitch tension and strap feed with a master machine operator.",
    },
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Artisan working at a specialised machine",
      description:
        "4:3 candid photo of an artisan or master tailor working at a specialised sewing or leather skiving machine inside an Indian workshop.",
    },
    pullQuote: {
      text: "A workshop built for high-volume basic woven shirts rarely handles structured leather bags or delicate saree silhouettes well. The machines and the hands are different.",
      attribution: "Shirish · Workshop assessment notes",
    },
    pairImages: [
      {
        url: "/images/shirish_with_workers_at_warehouse (8).jpeg",
        alt: "An artisan smiling at a cutting and gluing table stacked with prepared bag components",
        caption:
          "Prepared strap and lining components stacked in neat bundles at the bench before assembly.",
      },
      {
        url: "/images/alma_with_a_woman (1).jpeg",
        alt: "Alma embracing women during a regional visit in India",
        caption:
          "Spending time in person with the people and families behind regional craft work.",
      },
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
        heading: "Why generalists fall short",
        paragraphs: [
          "Almost every factory will say yes when you ask if they can make a product. Walk onto the workshop floor, though, and you see the truth in ten minutes. Heavy leather bags need skiving machines, cylinder-bed stitchers, edge-paint racks, and hands that understand hide stretch. Light resort wear needs clean flat-bed machines, careful pressing stations, and dust-free tables.",
          "Travelling from Maharashtra to production clusters across northern and southern India lets us see what each Manufacturing Partner builds every day with our own eyes.",
        ],
      },
      {
        heading: "Capacity shaped around the Client",
        paragraphs: [
          "A giant factory running fifty-thousand-unit export lines will push a three-hundred-piece independent retail order to the back of the queue. At the same time, a ten-person studio will struggle if asked for five thousand pieces in six weeks.",
          "Matching a European retail chain or independent brand with a Manufacturing Partner whose natural rhythm fits their Bulk Order keeps promises realistic on both sides.",
        ],
      },
    ],
    takeaway:
      "Choosing the right Manufacturing Partner upfront protects finish quality and realistic delivery schedules.",
    seo: {
      title: "How We Select Indian Manufacturing Partners",
      description:
        "Why KarmaRise D Global visits workshops across India to match each Client Product Brief with the right specialist factory.",
    },
  },
  {
    slug: "why-sample-approval-decides-bulk",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "Edition 01",
    publishedAt: "2026-11-04",
    readingTimeMinutes: 4,
    category: "Art & Design",
    location: "Ulhasnagar, Maharashtra",
    title: "Why sample approval decides everything that happens in bulk",
    spanishTitle:
      "Por qué tocar y probar la muestra a tiempo decide cómo saldrá todo el pedido",
    summary:
      "What Alma and Shirish check by hand on a pre-production sample before anyone orders bulk leather hides, woven cloth, or hardware.",
    spanishSummary:
      "Lo que Alma y Shirish revisan a mano en cada muestra antes de encargar pieles, telas o herrajes para la producción.",
    author: {
      name: "Alma & Shirish",
      role: "Co-founders, KarmaRise D Global",
      location: "Ulhasnagar, Maharashtra",
      portraitUrl: "/images/alma-and-shirish-founders.jpg",
    },
    tags: ["Sampling", "Quality control", "Materials", "Bulk Order"],
    leadImage: {
      url: "/images/alam_with_the_warehouse_owners (2).jpeg",
      alt: "Alma and two workshop specialists examining the drape and colour of a purple leather hide",
      caption:
        "Checking hide thickness, softness, and dye consistency across whole skins before cutting pre-production samples.",
    },
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Two prototypes compared side by side",
      description:
        "4:3 documentary photograph of two bag or garment prototypes placed side by side with chalk or pencil adjustment marks on a worktable.",
    },
    pullQuote: {
      text: "A drawing shows proportion, not weight or tension. You have to pack the bag, pull the zipper, and test the seam under load before ordering bulk material.",
      attribution: "Phase 02 · Sampling & Approval",
    },
    pairImages: [
      {
        url: "/images/alma_at_the_warehouse (3).jpeg",
        alt: "Alma turning pages of stacked natural canvas fabric on a long blue cutting table",
        caption:
          "Checking canvas weight and weave uniformity on the cutting table before batch marking.",
      },
      {
        url: "/images/garment-work-in-progress.jpg",
        alt: "Alma and a garment maker pinning embroidered teal fabric on a dress form in the Maharashtra studio",
        caption:
          "Draping and pinning a garment sample on the studio form in Ulhasnagar to check fall and balance.",
      },
    ],
    pairSlots: [
      {
        title: "Stitch density and hardware check",
        description:
          "Portrait photo (4:5): close-up of hands inspecting seam tension, edge finish, and hardware attachment on a prototype bag or garment.",
      },
      {
        title: "Material swatch verification",
        description:
          "Portrait photo (4:5): approved dye swatch resting beside fresh incoming leather hides or woven textile bolts.",
      },
    ],
    sections: [
      {
        heading: "Reading the physical prototype",
        paragraphs: [
          "A technical sketch shows shape and measurements, but it cannot tell you if a shoulder strap feels stiff or if a cotton lining pulls at the hem. Phase 02 of a Manufacturing Programme exists so the Client can hold, wear, pack, and test the real piece before bulk cloth or leather is bought.",
          "We check stitch spacing, lining movement, zipper glide, edge-paint finish, and stress points by hand rather than trusting studio photos taken from across the room.",
        ],
      },
      {
        heading: "Documenting every revision",
        paragraphs: [
          "Almost every first sample teaches us one or two things to improve: moving a D-ring by ten millimetres, choosing a firmer collar interlining, or swapping in a heavier brass buckle.",
          "Every adjustment agreed on the sample goes straight back into the Product Brief and onto the tagged counter-sample kept on the factory floor, so the Manufacturing Partner works from a real physical benchmark.",
        ],
      },
    ],
    takeaway:
      "Treating the approved sample as the binding factory reference prevents costly corrections after bulk production begins.",
    seo: {
      title: "Why Pre-Production Sample Approval Decides Bulk Quality",
      description:
        "How physical sample inspection and counter-samples protect Bulk Order consistency in Indian manufacturing.",
    },
  },
  {
    slug: "stone-forts-and-woven-borders-in-maharashtra",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "Edition 01",
    publishedAt: "2026-10-29",
    readingTimeMinutes: 6,
    category: "Heritage & Culture",
    location: "Maharashtra, India",
    title:
      "What Maharashtra's stone forts and woven borders teach us about durable work",
    spanishTitle:
      "Lo que los fuertes de piedra y las cenefas tejidas de Maharashtra nos enseñan sobre hacer las cosas para que duren",
    summary:
      "Walking through the basalt forts and weaving towns of Maharashtra shows you a regional culture built on structure, patience, and honest materials.",
    spanishSummary:
      "Caminar por los fuertes de basalto y los pueblos tejedores de Maharashtra te descubre una cultura que construye con paciencia, estructura y materiales nobles.",
    author: {
      name: "Shirish & Alma",
      role: "Co-founders, KarmaRise D Global",
      location: "Maharashtra, India",
      portraitUrl: "/images/alma-and-shirish-founders.jpg",
    },
    tags: ["Maharashtra", "Heritage", "Maratha history", "Textile traditions"],
    leadImage: {
      url: "/images/forts (3).jpg",
      alt: "Ancient stone citadel and arched gateway standing against a basalt cliff in Maharashtra",
      caption:
        "Basalt stone walls and arched gateways in Maharashtra, built to stand through centuries of monsoon rains.",
    },
    leadSlot: {
      kind: "Photo",
      ratio: "16:10 horizontal",
      title: "Basalt fort walls and courtyard in Maharashtra",
      description:
        "Wide architectural photograph of a historic Maratha stone fort courtyard and gateway in afternoon light.",
    },
    pullQuote: {
      text: "In Maharashtra, beauty is rarely separated from utility. A Paithani or Narayan Peth border is decorative, but its dense weave also weights the edge so the cloth drapes cleanly.",
      attribution: "Field notes · Maharashtra",
    },
    pairImages: [
      {
        url: "/images/forts (5).jpg",
        alt: "Courtyard and bastion walls of a historic stone fort in Maharashtra",
        caption:
          "Interlocking basalt stone blocks at the main gatehouse, where geometry carries the weight.",
      },
      {
        url: "/images/maria_5.jpeg",
        alt: "Woman wearing a pink silk saree-derived outer layer with gold zari motifs",
        caption:
          "Traditional gold zari motifs woven into silk in Maharashtra, tailored into an open contemporary coat.",
      },
    ],
    pairSlots: [
      {
        title: "Stone archway geometry",
        description:
          "Portrait photo (4:5): dressed basalt stone gateway and courtyard paving in Maharashtra.",
      },
      {
        title: "Woven zari border detail",
        description:
          "Portrait photo (4:5): traditional metallic zari motifs woven into silk cloth.",
      },
    ],
    sections: [
      {
        heading: "Architecture built for the terrain",
        paragraphs: [
          "If you want to understand how people in Maharashtra think about making things, spend a morning climbing up to one of the region's hill or coastal forts. Cut from dark Deccan basalt, their gates, water cisterns, and watchtowers were built without fuss. Every arch and corner joint is there to carry weight and outlast the monsoon.",
          "Shirish grew up surrounded by this Maratha heritage, where fairness, plain speech, and doing a job properly the first time are everyday habits.",
        ],
      },
      {
        heading: "Where structure meets the loom",
        paragraphs: [
          "You see that exact same mindset in Maharashtra's weaving towns. Traditional nine-yard and six-yard sarees from the region pair breathable cotton or crisp silk bodies with tightly woven borders and geometric pallus.",
          "That border is not just decoration. Its heavier thread count weights the edge of the cloth, protects the hem from fraying as you walk, and keeps the saree intact through decades of wear.",
        ],
      },
      {
        heading: "Bringing regional pride into modern production",
        paragraphs: [
          "When European Clients work with us at KarmaRise D Global, they are not sending an order into a faceless factory zone. They are working with people from a region that has understood stone, cotton, silk, and leather for generations.",
        ],
      },
    ],
    takeaway:
      "Understanding the cultural and material roots of Maharashtra deepens the respect between European Clients and Indian workshops.",
    seo: {
      title: "Maharashtra Heritage: Stone Forts and Woven Saree Borders",
      description:
        "Exploring how Maharashtra's architectural and textile heritage shapes KarmaRise D Global's approach to durable manufacturing.",
    },
  },
  {
    slug: "preparing-womens-garment-training-maharashtra",
    featured: false,
    newsletterEligible: true,
    language: "en",
    issueNumber: "Edition 01",
    publishedAt: "2026-10-22",
    readingTimeMinutes: 4,
    category: "KarmaRise Journal",
    location: "Ulhasnagar, Maharashtra",
    title:
      "Preparing for women's garment design and stitching training in Maharashtra",
    spanishTitle:
      "Paso a paso en Ulhasnagar: preparando nuestro taller de diseño y costura para mujeres en Maharashtra",
    summary:
      "A look inside our Ulhasnagar studio space and the practical groundwork behind our planned Women's Training Initiative.",
    spanishSummary:
      "Un vistazo a nuestro estudio en Ulhasnagar y a cómo estamos preparando el terreno para la futura formación de mujeres en diseño y costura.",
    author: {
      name: "Alma & Shirish",
      role: "Co-founders, KarmaRise D Global",
      location: "Ulhasnagar, Maharashtra",
      portraitUrl: "/images/alma-and-shirish-founders.jpg",
    },
    tags: [
      "Women's Training Initiative",
      "Ulhasnagar studio",
      "Company progress",
      "Maharashtra",
    ],
    leadImage: {
      url: "/images/warehouse_reference.jpeg",
      alt: "Wide view of the sunlit studio space in Ulhasnagar with sewing tables and dress form",
      caption:
        "Our sunlit studio floor in Ulhasnagar, Maharashtra, where sample tables and sewing machines are taking shape.",
    },
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Sewing machines and pattern tools in Maharashtra",
      description:
        "4:3 daylight photograph of sewing machines, pattern paper, shears, and measuring tape arranged on a clean worktable in the Maharashtra studio space.",
    },
    pullQuote: {
      text: "Training only matters if it leads to real work. That is why we are building commercial demand through Manufacturing Programmes and Almarise first.",
      attribution: "KarmaRise Journal · Studio update",
    },
    pairImages: [
      {
        url: "/images/alma_taking_a_look_at_design (2).jpeg",
        alt: "Alma and a young woman examining a beaded teal saree on a dressmaker form beside an industrial sewing machine",
        caption:
          "Working through garment construction details beside the studio sewing bench in Ulhasnagar.",
      },
      {
        url: "/images/snoby_order (1).jpeg",
        alt: "Strapped and wrapped export cartons stacked in the warehouse ready for dispatch",
        caption:
          "Completed Bulk Order cartons strapped and ready for dispatch, funding the company's next steps.",
      },
    ],
    pairSlots: [
      {
        title: "Machine stitching bench",
        description:
          "Portrait photo (4:5): close study of a clean studio sewing machine and fabric feed in warm natural light.",
      },
      {
        title: "Pattern drafting table",
        description:
          "Portrait photo (4:5): pattern curve, ruler, chalk, and draped cotton fabric on a cutting bench.",
      },
    ],
    sections: [
      {
        heading: "Why skills and employment belong together",
        paragraphs: [
          "The Women's Training Initiative is a planned programme by KarmaRise D Global in Maharashtra, created to teach women both garment design and stitching with paid employment as the long-term goal.",
          "Rather than setting up an outside charity or NGO, we are building this inside our working company so that what women learn at the machine and cutting table connects directly to real production quality.",
        ],
      },
      {
        heading: "Honest stage today",
        paragraphs: [
          "We always want to be honest about what is up and running today and what is still in the works. Right now, the initiative is in the planning stage while we grow KarmaRise D Global's Manufacturing Programmes and develop Almarise.",
          "In our Ulhasnagar space at Guru Charan Apartment, the first sewing machines, dress forms, and cutting tables are already in place for garment trials and sample reviews.",
        ],
      },
    ],
    takeaway:
      "Building durable commercial demand first ensures future training cohorts step toward genuine paid work opportunities.",
    seo: {
      title: "Preparing the Women's Training Initiative in Maharashtra",
      description:
        "Follow the groundwork in Ulhasnagar as KarmaRise D Global prepares its planned garment design and stitching training programme.",
    },
  },
];

export function getCategoryDetail(
  category: StoryCategory,
): StoryCategoryDetail {
  return (
    storyCategoryDetails.find((item) => item.title === category) ??
    storyCategoryDetails[5]!
  );
}

export function formatStoryDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
