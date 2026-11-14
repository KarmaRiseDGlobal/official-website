export type StoryCategory =
  | "Manufacturing and people"
  | "Materials and sampling"
  | "Working across distance"
  | "Company progress";

export interface StoryImage {
  url: string;
  alt: string;
}

export interface StoryEntry {
  slug: string;
  featured?: boolean;
  category: StoryCategory;
  location: string;
  title: string;
  summary: string;
  leadImage?: StoryImage;
  leadSlot: {
    kind: "Photo" | "Video" | "Photo or video";
    ratio: string;
    title: string;
    description: string;
  };
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
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
  takeaway: string;
}

export const storyCategories: ("All Stories" | StoryCategory)[] = [
  "All Stories",
  "Working across distance",
  "Materials and sampling",
  "Manufacturing and people",
  "Company progress",
];

export const stories: StoryEntry[] = [
  {
    slug: "from-spain-to-a-cutting-table-in-india",
    featured: true,
    category: "Working across distance",
    location: "Spain and Maharashtra",
    title:
      "How one Product Brief travels from a desk in Spain to a cutting table in India",
    summary:
      "Follows how early alignment on dimensions, linings, and packaging prevents misinterpretation across languages and timezones.",
    leadSlot: {
      kind: "Photo",
      ratio: "16:10 horizontal",
      title: "Annotated patterns and material cards on a desk",
      description:
        "Documentary horizontal shot showing printed specification notes, pattern pieces, and fabric or leather cards laid out beside a workshop bench in natural daylight.",
    },
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
          "Most cross-border production issues start before a single piece of leather or fabric is cut. When expectations travel through repeated emails, casual chat messages, and unverified translations, small details around pocket depth, seam allowance, or lining weight drift quietly.",
          "Inside a Manufacturing Programme, the Product Brief works as one shared document held simultaneously by Alma in Spain and Shirish in India.",
        ],
      },
      {
        heading: "Keeping the workshop table aligned",
        paragraphs: [
          "Before sampling begins, materials, hardware specs, sizing notes, and target packaging are confirmed in writing and reviewed directly on the factory floor.",
          "When questions come up during pattern drafting, decisions return to the Client clearly rather than getting improvised silently on the line.",
        ],
      },
    ],
    takeaway:
      "Clear written decisions at the Product Brief stage protect sample timelines and keep Bulk Order quality predictable.",
  },
  {
    slug: "why-sample-approval-decides-bulk",
    category: "Materials and sampling",
    location: "Ulhasnagar, Maharashtra",
    title: "Why sample approval decides everything that happens in bulk",
    summary:
      "Examines what Alma and Shirish check on a pre-production sample before approving bulk material orders.",
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Two prototypes compared side by side",
      description:
        "4:3 documentary photograph of two bag or garment prototypes placed side by side with chalk or pencil adjustment marks on a worktable.",
    },
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
          "A drawing shows proportion, not weight or tension. Phase 02 exists so the Client can hold, wear, pack, and test the real construction before bulk cloth or leather is purchased.",
          "We inspect stitch spacing, lining movement, zipper glide, and seam reinforcement under normal load rather than trusting photos taken at arm's length.",
        ],
      },
      {
        heading: "Documenting every revision",
        paragraphs: [
          "Any change agreed on the sample is written directly back into the Product Brief reference so the Manufacturing Partner works from the approved physical specimen, not from memory.",
        ],
      },
    ],
    takeaway:
      "Treating the approved sample as the binding factory reference prevents costly corrections after bulk production begins.",
  },
  {
    slug: "matching-a-workshop-to-the-product",
    category: "Manufacturing and people",
    location: "Across India",
    title:
      "Matching a workshop to the product rather than forcing the product to fit a workshop",
    summary:
      "Explains why KarmaRise D Global travels across India to understand each Manufacturing Partner's strengths and capacity.",
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Artisan working at a specialised machine",
      description:
        "4:3 candid photo of an artisan or master tailor working at a specialised sewing or leather skiving machine inside an Indian workshop.",
    },
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
          "A workshop built for high-volume basic woven shirts rarely handles structured leather bags or delicate saree silhouettes well. Different products ask for different machines, different bench habits, and different order minimums.",
          "Travelling from Maharashtra to clusters across northern and southern India lets us assess what each Manufacturing Partner builds best with our own eyes.",
        ],
      },
      {
        heading: "Capacity shaped around the Client",
        paragraphs: [
          "Matching a European independent retailer or retail chain with a workshop whose realistic output fits their Bulk Order keeps communication honest on both sides.",
        ],
      },
    ],
    takeaway:
      "Choosing the right Manufacturing Partner upfront protects finish quality and realistic delivery schedules.",
  },
  {
    slug: "giving-maharashtrian-sarees-a-second-life",
    category: "Company progress",
    location: "Maharashtra and Madrid",
    title: "Giving Maharashtrian sarees a second life as contemporary clothing",
    summary:
      "Documents the thinking behind Almarise, how existing sarees are chosen, and how borders and weaves guide modern pattern cutting.",
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Folded Maharashtrian sarees beside a finished garment",
      description:
        "4:3 studio photograph of folded Maharashtrian silk and cotton sarees with rich woven borders resting beside a modern finished garment cut from similar fabric.",
    },
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
          "Almarise belongs to KarmaRise D Global as its own fashion brand, shaped around a direct observation in Maharashtra: countless woven sarees hold extraordinary border work and colour, yet remain folded away.",
          "Instead of ordering fresh fabric yardage, Almarise starts with existing Maharashtrian sarees and designs contemporary women's silhouettes around their natural borders.",
        ],
      },
      {
        heading: "Hands-on garment discipline",
        paragraphs: [
          "Developing Almarise keeps KarmaRise D Global close to pattern cutting, lining choices, and small-batch tailoring inside Maharashtra alongside our primary B2B Manufacturing Programmes.",
        ],
      },
    ],
    takeaway:
      "Working directly on our own garment brand sharpens the practical knowledge we bring to every Client Manufacturing Programme.",
  },
  {
    slug: "preparing-womens-garment-training-maharashtra",
    category: "Company progress",
    location: "Maharashtra, India",
    title:
      "Preparing for women's garment design and stitching training in Maharashtra",
    summary:
      "Honest update on the purpose and groundwork behind the planned Women's Training Initiative.",
    leadSlot: {
      kind: "Photo",
      ratio: "4:3 horizontal",
      title: "Sewing machines and pattern tools in Maharashtra",
      description:
        "4:3 daylight photograph of sewing machines, pattern paper, shears, and measuring tape arranged on a clean worktable in the Maharashtra studio space.",
    },
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
          "The Women's Training Initiative is a planned programme by KarmaRise D Global in Maharashtra, intended to train women in garment design and stitching with dignified employment opportunities as the long-term aim.",
          "Rather than operating as an external charity or NGO, it is being shaped inside a working company so training stays tied to real production quality.",
        ],
      },
      {
        heading: "Honest stage today",
        paragraphs: [
          "The initiative is currently in the planning stage while KarmaRise D Global expands its Manufacturing Programmes and develops Almarise so real garment work can support long-term pathways.",
        ],
      },
    ],
    takeaway:
      "Building durable commercial demand first ensures future training cohorts step toward genuine work opportunities.",
  },
];
