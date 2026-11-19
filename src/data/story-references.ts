import type { StoryLanguage } from "@/data/stories";

export type StoryReferenceKind =
  | "place"
  | "spainPlace"
  | "workshop"
  | "craft"
  | "woman"
  | "person"
  | "textile"
  | "script"
  | "tradition"
  | "food";

export type StoryReferenceVisual =
  | {
      readonly kind: "map";
      readonly mapSrc: string;
      readonly alt: Record<StoryLanguage, string>;
    }
  | {
      readonly kind: "photo";
      readonly src: string;
      readonly alt: Record<StoryLanguage, string>;
      readonly objectPosition?: string;
      readonly fit?: "cover" | "contain";
    };

export interface StoryReferenceEntry {
  readonly id: string;
  readonly category: StoryReferenceKind;
  readonly title: Record<StoryLanguage, string>;
  readonly description: Record<StoryLanguage, string>;
  readonly terms: Readonly<Record<StoryLanguage, readonly string[]>>;
  readonly visual?: StoryReferenceVisual;
}

export const REFERENCE_KIND_LABELS: Readonly<
  Record<StoryReferenceKind, Record<StoryLanguage, string>>
> = {
  place: { en: "Place in India", es: "Lugar en la India" },
  spainPlace: { en: "Craft town in Spain", es: "Pueblo artesano en España" },
  workshop: { en: "Workshop role", es: "Oficio en taller" },
  craft: { en: "Leathercraft & cutting", es: "Marroquinería y corte" },
  woman: { en: "Women in the story", es: "Mujeres en la historia" },
  person: { en: "Historical figure", es: "Figura histórica" },
  textile: { en: "Textile & dress", es: "Tejido e indumentaria" },
  script: { en: "Language & script", es: "Lengua y escritura" },
  tradition: { en: "Living tradition", es: "Tradición viva" },
  food: { en: "Home cooking", es: "Cocina casera" },
};

export const STORY_REFERENCES: readonly StoryReferenceEntry[] = [
  // --- Places & Maps ---
  {
    id: "maharashtra",
    category: "place",
    title: { en: "Maharashtra", es: "Maharashtra" },
    description: {
      en: "Western Indian state spanning the Arabian Sea coast, the Sahyadri hills, and the Deccan plateau.",
      es: "Estado del oeste de la India situado entre el mar Arábigo, los montes Sahyadri y la meseta del Decán.",
    },
    terms: {
      en: ["Maharashtra"],
      es: ["Maharashtra"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-maharashtra.png",
      alt: {
        en: "Map of India highlighting the state of Maharashtra on the western coast",
        es: "Mapa de la India con el estado de Maharashtra destacado en la costa occidental",
      },
    },
  },
  {
    id: "himachal",
    category: "place",
    title: { en: "Himachal Pradesh", es: "Himachal Pradesh" },
    description: {
      en: "Mountain state in northern India set across the western Himalayas.",
      es: "Estado montañoso del norte de la India situado en el Himalaya occidental.",
    },
    terms: {
      en: ["Himachal Pradesh", "Himachal"],
      es: ["Himachal Pradesh", "Himachal"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-himachal.png",
      alt: {
        en: "Map of India highlighting Himachal Pradesh in the northern Himalayas",
        es: "Mapa de la India con Himachal Pradesh destacado en el norte",
      },
    },
  },
  {
    id: "telangana",
    category: "place",
    title: { en: "Telangana", es: "Telangana" },
    description: {
      en: "Southern Deccan state bordering Maharashtra to the southeast, home to GI-registered Narayanpet sarees.",
      es: "Estado del Decán al sureste de Maharashtra, donde se tejen los saris de Narayanpet con indicación geográfica.",
    },
    terms: {
      en: ["Telangana"],
      es: ["Telangana"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-telangana.png",
      alt: {
        en: "Map of India highlighting Telangana southeast of Maharashtra",
        es: "Mapa de la India con el estado de Telangana destacado",
      },
    },
  },
  {
    id: "gujarat",
    category: "place",
    title: { en: "Gujarat", es: "Gujarat" },
    description: {
      en: "Western coastal Indian state bordering Maharashtra immediately to the north.",
      es: "Estado costero del oeste de la India situado justo al norte de Maharashtra.",
    },
    terms: {
      en: ["Gujarat"],
      es: ["Gujarat"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-gujarat.png",
      alt: {
        en: "Map of India highlighting Gujarat on the western coast",
        es: "Mapa de la India con el estado de Gujarat destacado",
      },
    },
  },
  {
    id: "rajasthan",
    category: "place",
    title: { en: "Rajasthan", es: "Rajastán" },
    description: {
      en: "Northwestern Indian desert state widely promoted abroad for its palace cities.",
      es: "Estado del noroeste de la India muy conocido fuera del país por sus ciudades palaciegas.",
    },
    terms: {
      en: ["Rajasthan"],
      es: ["Rajastán"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-rajasthan.png",
      alt: {
        en: "Map of India highlighting Rajasthan in the northwest",
        es: "Mapa de la India con Rajastán destacado en el noroeste",
      },
    },
  },
  {
    id: "deccan",
    category: "place",
    title: { en: "The Deccan plateau", es: "La meseta del Decán" },
    description: {
      en: "Volcanic basalt plateau across interior peninsular India framed by the Western and Eastern Ghats.",
      es: "Gran meseta de roca volcánica en el interior peninsular de la India flanqueada por los Ghates.",
    },
    terms: {
      en: ["Deccan"],
      es: ["Decán"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-deccan.png",
      alt: {
        en: "Map of India highlighting the Deccan plateau across Maharashtra, Telangana, and Karnataka",
        es: "Mapa de la India con la meseta del Decán destacada",
      },
    },
  },
  {
    id: "sahyadri",
    category: "place",
    title: { en: "Sahyadri hills", es: "Montes Sahyadri" },
    description: {
      en: "Marathi name for the Western Ghats mountain range running parallel to Maharashtra's coast.",
      es: "Nombre maratí de la cordillera de los Ghates Occidentales que recorre Maharashtra.",
    },
    terms: {
      en: ["Sahyadri hills", "Sahyadris", "Sahyadri"],
      es: ["montes Sahyadri", "Sahyadri"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-sahyadri.png",
      alt: {
        en: "Map of India and zoomed Maharashtra inset marking the Sahyadri mountain ridge along the western coast",
        es: "Mapa de la India y detalle de Maharashtra marcando la cordillera del Sahyadri",
      },
    },
  },
  {
    id: "shaniwar-wada",
    category: "place",
    title: { en: "Shaniwar Wada, Pune", es: "Shaniwar Wada, Pune" },
    description: {
      en: "Eighteenth-century fortified residence of the Maratha Peshwas in central Pune.",
      es: "Recinto fortificado del siglo XVIII en el centro de Pune, antigua sede de los peshwas marathas.",
    },
    terms: {
      en: ["Shaniwar Wada"],
      es: ["Shaniwar Wada"],
    },
    visual: {
      kind: "photo",
      src: "/references/shaniwar-wada.jpg",
      objectPosition: "50% 48%",
      alt: {
        en: "Stone bastions and spiked main gate of Shaniwar Wada in Pune",
        es: "Murallas de piedra y puerta principal de Shaniwar Wada en Pune",
      },
    },
  },
  {
    id: "raigad-fort",
    category: "place",
    title: { en: "Raigad Fort", es: "Fuerte de Raigad" },
    description: {
      en: "Sahyadri mountain citadel crowned capital of the Maratha Swarajya in 1674.",
      es: "Ciudadela de montaña en el Sahyadri proclamada capital de la Swarajya maratha en 1674.",
    },
    terms: {
      en: ["Raigad Fort"],
      es: ["fuerte de Raigad"],
    },
    visual: {
      kind: "photo",
      src: "/references/raigad-fort.jpg",
      objectPosition: "50% 66%",
      alt: {
        en: "Stone court walls atop the plateau of Raigad Fort in Maharashtra",
        es: "Muros de piedra en la meseta superior del fuerte de Raigad en Maharashtra",
      },
    },
  },
  {
    id: "shivneri-fort",
    category: "place",
    title: { en: "Shivneri Fort", es: "Fuerte de Shivneri" },
    description: {
      en: "Seventeenth-century basalt hill fort in Junnar, Pune district, birthplace of Shivaji Maharaj.",
      es: "Fuerte de montaña en Junnar, distrito de Pune, lugar de nacimiento de Shivaji Maharaj.",
    },
    terms: {
      en: ["Shivneri Fort"],
      es: ["fuerte de Shivneri"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-shivneri.png",
      alt: {
        en: "Map of India and zoomed Maharashtra inset marking Shivneri Fort north of Pune",
        es: "Mapa de la India y detalle de Maharashtra situando el fuerte de Shivneri en el distrito de Pune",
      },
    },
  },
  {
    id: "vijaydurg",
    category: "place",
    title: { en: "Vijaydurg sea fort", es: "Fuerte marítimo de Vijaydurg" },
    description: {
      en: "Coastal fort built with red laterite walls on a peninsula along Maharashtra's Arabian Sea shore.",
      es: "Fuerte costero de murallas de laterita levantado frente al mar Arábigo en Maharashtra.",
    },
    terms: {
      en: ["Vijaydurg"],
      es: ["Vijaydurg"],
    },
    visual: {
      kind: "photo",
      src: "/references/vijaydurg-fort.jpg",
      objectPosition: "50% 48%",
      alt: {
        en: "Laterite walls of Vijaydurg Fort rising directly above the Arabian Sea",
        es: "Murallas de laterita del fuerte de Vijaydurg junto al mar Arábigo",
      },
    },
  },
  {
    id: "paithan",
    category: "place",
    title: { en: "Paithan", es: "Paithan" },
    description: {
      en: "Historic town on the Godavari river in central Maharashtra that gave Paithani silk weaving its name.",
      es: "Villa histórica junto al río Godavari en Maharashtra que dio nombre a los saris de seda Paithani.",
    },
    terms: {
      en: ["Paithan"],
      es: ["Paithan"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-paithan.png",
      alt: {
        en: "Map of India and zoomed Maharashtra inset marking Paithan in central Maharashtra",
        es: "Mapa de la India y detalle de Maharashtra marcando Paithan en el centro del estado",
      },
    },
  },
  {
    id: "yeola",
    category: "place",
    title: { en: "Yeola", es: "Yeola" },
    description: {
      en: "Handloom town in Nashik district, today Maharashtra's largest hub for Paithani silk sarees.",
      es: "Localidad tejedora del distrito de Nashik, hoy principal centro artesanal de saris Paithani.",
    },
    terms: {
      en: ["Yeola"],
      es: ["Yeola"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-yeola.png",
      alt: {
        en: "Map of India and zoomed Maharashtra inset marking Yeola in Nashik district",
        es: "Mapa de la India y detalle de Maharashtra marcando Yeola en el distrito de Nashik",
      },
    },
  },
  {
    id: "bhandara",
    category: "place",
    title: { en: "Bhandara, Vidarbha", es: "Bhandara, Vidarbha" },
    description: {
      en: "District in eastern Maharashtra known for tasar silk Karvati handloom sarees.",
      es: "Distrito del este de Maharashtra conocido por sus saris artesanales Karvati de seda tasar.",
    },
    terms: {
      en: ["Bhandara"],
      es: ["Bhandara"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-bhandara.png",
      alt: {
        en: "Map of India and zoomed Maharashtra inset marking Bhandara in eastern Maharashtra",
        es: "Mapa de la India y detalle de Maharashtra marcando Bhandara en el este del estado",
      },
    },
  },
  {
    id: "solapur",
    category: "place",
    title: { en: "Solapur", es: "Solapur" },
    description: {
      en: "Weaving city in southern Maharashtra known for cotton jacquard textiles and Narayan Peth sarees.",
      es: "Ciudad textil del sur de Maharashtra conocida por sus tejidos de algodón y saris Narayan Peth.",
    },
    terms: {
      en: ["Solapur"],
      es: ["Solapur"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-solapur.png",
      alt: {
        en: "Map of India and zoomed Maharashtra inset marking Solapur in southern Maharashtra",
        es: "Mapa de la India y detalle de Maharashtra marcando Solapur en el sur del estado",
      },
    },
  },
  {
    id: "pandharpur",
    category: "place",
    title: { en: "Pandharpur", es: "Pandharpur" },
    description: {
      en: "Town on the Bhima river in southern Maharashtra at the heart of the Varkari devotional tradition.",
      es: "Localidad a orillas del río Bhima, corazón de la tradición espiritual varkari en Maharashtra.",
    },
    terms: {
      en: ["Pandharpur"],
      es: ["Pandharpur"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-pandharpur.png",
      alt: {
        en: "Map of India and zoomed Maharashtra inset marking Pandharpur in southern Maharashtra",
        es: "Mapa de la India y detalle de Maharashtra marcando Pandharpur en el sur del estado",
      },
    },
  },
  {
    id: "nandurbar",
    category: "place",
    title: { en: "Nandurbar", es: "Nandurbar" },
    description: {
      en: "District in far northwestern Maharashtra bordering Gujarat and Madhya Pradesh.",
      es: "Distrito del extremo noroccidental de Maharashtra junto a Gujarat y Madhya Pradesh.",
    },
    terms: {
      en: ["Nandurbar"],
      es: ["Nandurbar"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-nandurbar.png",
      alt: {
        en: "Map of India and zoomed Maharashtra inset marking Nandurbar in northwestern Maharashtra",
        es: "Mapa de la India y detalle de Maharashtra marcando Nandurbar en el noroeste del estado",
      },
    },
  },
  {
    id: "latur",
    category: "place",
    title: { en: "Latur", es: "Latur" },
    description: {
      en: "District on the Marathwada plateau in southeastern Maharashtra.",
      es: "Distrito situado en la meseta interior de Marathwada, al sureste de Maharashtra.",
    },
    terms: {
      en: ["Latur"],
      es: ["Latur"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-latur.png",
      alt: {
        en: "Map of India and zoomed Maharashtra inset marking Latur in southeastern Maharashtra",
        es: "Mapa de la India y detalle de Maharashtra marcando Latur en el sureste del estado",
      },
    },
  },
  {
    id: "versova",
    category: "place",
    title: { en: "Versova, Mumbai", es: "Versova, Bombay" },
    description: {
      en: "Historic Koli fishing harbour and coastal neighbourhood in western Mumbai.",
      es: "Histórico puerto pesquero de la comunidad koli en la costa occidental de Bombay.",
    },
    terms: {
      en: ["Versova"],
      es: ["Versova"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-versova.png",
      alt: {
        en: "Map of India and zoomed Maharashtra inset marking Versova on the Mumbai coast",
        es: "Mapa de la India y detalle de Maharashtra marcando Versova en la costa de Bombay",
      },
    },
  },

  // --- Women Mentioned Across Stories ---
  {
    id: "savitribai-phule",
    category: "woman",
    title: { en: "Savitribai Phule", es: "Savitribai Phule" },
    description: {
      en: "Nineteenth-century educator and poet from Maharashtra who opened India's first school for girls in Pune in 1848.",
      es: "Educadora y poeta de Maharashtra que abrió en Pune la primera escuela para niñas de la India en 1848.",
    },
    terms: {
      en: ["Savitribai Phule"],
      es: ["Savitribai Phule"],
    },
    visual: {
      kind: "photo",
      src: "/references/savitribai-phule-framed.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Commemorative bronze portrait bust of Savitribai Phule",
        es: "Busto conmemorativo de Savitribai Phule",
      },
    },
  },
  {
    id: "vaishali-shadangule",
    category: "woman",
    title: { en: "Vaishali Shadangule", es: "Vaishali Shadangule" },
    description: {
      en: "Designer born in Vidarbha, Maharashtra, known for bringing handwoven khun and Paithani cloth to international runways.",
      es: "Diseñadora nacida en Maharashtra conocida por llevar los tejidos manuales khun y Paithani a pasarelas internacionales.",
    },
    terms: {
      en: ["Vaishali Shadangule"],
      es: ["Vaishali Shadangule"],
    },
  },
  {
    id: "shashikala-bhosale",
    category: "woman",
    title: {
      en: "Shashikala Ramdas Bhosale",
      es: "Shashikala Ramdas Bhosale",
    },
    description: {
      en: "Maharashtrian owner whose green-bordered twentieth-century Paithani nauvari is preserved in Sydney's Powerhouse Museum.",
      es: "Propietaria del sari nauvari Paithani de cenefa verde del siglo XX conservado en el museo Powerhouse de Sídney.",
    },
    terms: {
      en: ["Shashikala Ramdas Bhosale's", "Shashikala Ramdas Bhosale"],
      es: ["Shashikala Ramdas Bhosale"],
    },
  },
  {
    id: "gauravi-khadye",
    category: "woman",
    title: { en: "Gauravi Khadye", es: "Gauravi Khadye" },
    description: {
      en: "Mumbai dhol drummer interviewed on choosing a nine-yard nauvari saree for Gudi Padwa street processions.",
      es: "Percusionista de Bombay entrevistada sobre por qué viste el sari nauvari de nueve yardas en Gudi Padwa.",
    },
    terms: {
      en: ["Gauravi Khadye"],
      es: ["Gauravi Khadye"],
    },
  },
  {
    id: "amruta-mane",
    category: "woman",
    title: { en: "Amruta Mane", es: "Amruta Mane" },
    description: {
      en: "Mumbai motorcyclist interviewed on riding in a nine-yard nauvari saree at Gudi Padwa rallies.",
      es: "Motorista de Bombay entrevistada por conducir con sari nauvari de nueve yardas en los desfiles de Gudi Padwa.",
    },
    terms: {
      en: ["Amruta Mane"],
      es: ["Amruta Mane"],
    },
  },
  {
    id: "rukhabai-padavi",
    category: "woman",
    title: { en: "Rukhabai Padavi", es: "Rukhabai Padavi" },
    description: {
      en: "Bhil elder in Nandurbar whose memories of her pink cotton wedding saree were recorded by the People's Archive of Rural India.",
      es: "Mujer mayor de Nandurbar cuyo relato sobre su sari rosa de boda recogió el People's Archive of Rural India.",
    },
    terms: {
      en: ["Rukhabai Padavi"],
      es: ["Rukhabai Padavi"],
    },
  },
  {
    id: "koli-women",
    category: "woman",
    title: { en: "Koli women of Mumbai", es: "Mujeres koli de Bombay" },
    description: {
      en: "Women of Mumbai's indigenous fishing community, known for running fish markets in practical working saree drapes.",
      es: "Mujeres de la comunidad pesquera originaria de Bombay, conocidas por dirigir las lonjas con el sari recogido para faenar.",
    },
    terms: {
      en: ["Koli women"],
      es: ["mujeres koli"],
    },
    visual: {
      kind: "photo",
      src: "/references/koli-woman-mumbai.jpg",
      fit: "contain",
      alt: {
        en: "Archival full-length portrait of a Koli woman in Mumbai wearing a tucked working saree and carrying a fish basket",
        es: "Retrato histórico de cuerpo entero de una mujer koli en Bombay con su sari de trabajo y cesto de pesca",
      },
    },
  },
  {
    id: "banjara-women",
    category: "woman",
    title: { en: "Banjara women", es: "Mujeres banjara" },
    description: {
      en: "Community across Maharashtra and the Deccan known for geometric hand embroidery, mirror work, and stacked bangles.",
      es: "Comunidad del Decán y Maharashtra conocida por sus bordados geométricos a mano con espejos y pulseras blancas.",
    },
    terms: {
      en: ["Banjara women"],
      es: ["mujeres banjara"],
    },
    visual: {
      kind: "photo",
      src: "/references/banjara-woman.jpg",
      objectPosition: "50% 34%",
      alt: {
        en: "Banjara woman wearing mirror-embroidered traditional attire, silver ornaments, and stacked bangles",
        es: "Mujer banjara con vestido tradicional bordado con espejos, joyas de plata y pulseras",
      },
    },
  },
  {
    id: "warli-women",
    category: "woman",
    title: { en: "Warli women", es: "Mujeres warli" },
    description: {
      en: "Indigenous Adivasi community of northern Maharashtra known for shorter farm-work saree drapes and geometric paintings of village life.",
      es: "Comunidad indígena del norte de Maharashtra conocida por su sari corto de labranza y su pintura geométrica tradicional.",
    },
    terms: {
      en: ["Warli women"],
      es: ["mujeres warli"],
    },
    visual: {
      kind: "photo",
      src: "/references/warli-painting-thane.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Traditional Warli painting on earthen ground from Thane district showing women and village life",
        es: "Pintura tradicional warli sobre fondo terroso del distrito de Thane que representa la vida comunitaria",
      },
    },
  },

  // --- Historical Figures ---
  {
    id: "shivaji-maharaj",
    category: "person",
    title: {
      en: "Chhatrapati Shivaji Maharaj",
      es: "Chhatrapati Shivaji Maharaj",
    },
    description: {
      en: "Seventeenth-century founder of the Maratha Swarajya, born at Shivneri Fort in 1630.",
      es: "Fundador en el siglo XVII de la Swarajya maratha, nacido en el fuerte de Shivneri en 1630.",
    },
    terms: {
      en: ["Chhatrapati Shivaji Maharaj"],
      es: ["Chhatrapati Shivaji Maharaj"],
    },
    visual: {
      kind: "photo",
      src: "/references/shivaji-maharaj-framed.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Seventeenth-century Rijksmuseum portrait miniature of Chhatrapati Shivaji Maharaj",
        es: "Retrato histórico en miniatura de Chhatrapati Shivaji Maharaj conservado en el Rijksmuseum",
      },
    },
  },
  {
    id: "jyotirao-phule",
    category: "person",
    title: { en: "Jyotirao Phule", es: "Jyotirao Phule" },
    description: {
      en: "Nineteenth-century social reformer from Maharashtra who fought caste injustice and opened schools with Savitribai Phule.",
      es: "Reformador social del siglo XIX en Maharashtra que combatió la discriminación de casta junto a Savitribai Phule.",
    },
    terms: {
      en: ["Jyotirao Phule"],
      es: ["Jyotirao Phule"],
    },
    visual: {
      kind: "photo",
      src: "/references/jyotirao-phule.jpg",
      fit: "contain",
      alt: {
        en: "Historical photograph of Mahatma Jyotirao Phule",
        es: "Fotografía histórica de Jyotirao Phule",
      },
    },
  },
  {
    id: "ambedkar",
    category: "person",
    title: { en: "Dr. Babasaheb Ambedkar", es: "Dr. Babasaheb Ambedkar" },
    description: {
      en: "Jurist, economist, and social reformer who chaired the drafting committee of India's Constitution.",
      es: "Jurista, economista y reformador social que presidió la redacción de la Constitución de la India.",
    },
    terms: {
      en: ["Dr. Babasaheb Ambedkar"],
      es: ["doctor Babasaheb Ambedkar", "Dr. Babasaheb Ambedkar"],
    },
    visual: {
      kind: "photo",
      src: "/references/ambedkar.jpg",
      objectPosition: "55% 20%",
      alt: {
        en: "1922 portrait of Dr. B. R. Ambedkar as a barrister",
        es: "Retrato de 1922 del doctor B. R. Ambedkar como jurista",
      },
    },
  },
  {
    id: "peshwa-madhavrao",
    category: "person",
    title: { en: "Peshwa Madhavrao I", es: "Peshwa Madhavrao I" },
    description: {
      en: "Eighteenth-century Maratha leader who rebuilt administration across India after the 1761 Battle of Panipat.",
      es: "Gobernante maratha del siglo XVIII que reconstruyó la administración tras la batalla de Panipat de 1761.",
    },
    terms: {
      en: ["Peshwa Madhavrao"],
      es: ["peshwa Madhavrao"],
    },
    visual: {
      kind: "photo",
      src: "/references/peshwa-madhavrao-framed.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Eighteenth-century miniature portrait of Peshwa Madhavrao I",
        es: "Retrato en miniatura del siglo XVIII del peshwa Madhavrao I",
      },
    },
  },
  {
    id: "kusumagraj",
    category: "person",
    title: { en: "Kusumagraj", es: "Kusumagraj" },
    description: {
      en: "Pen name of V. V. Shirwadkar, Marathi poet, playwright, and Jnanpith laureate best known for his 1942 poetry collection Vishakha.",
      es: "Seudónimo de V. V. Shirwadkar, poeta y dramaturgo maratí galardonado con el premio Jnanpith y autor del poemario Vishakha.",
    },
    terms: {
      en: ["Kusumagraj"],
      es: ["Kusumagraj"],
    },
    visual: {
      kind: "photo",
      src: "/references/kusumagraj-vishakha.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Marathi cover of Vishakha by Kusumagraj",
        es: "Cubierta en lengua maratí del poemario Vishakha de Kusumagraj",
      },
    },
  },
  {
    id: "xuanzang",
    category: "person",
    title: { en: "Xuanzang", es: "Xuanzang" },
    description: {
      en: "Seventh-century Chinese Buddhist scholar who travelled across India and recorded life in the Deccan.",
      es: "Erudito y viajero chino del siglo VII que recorrió la India y dejó crónicas sobre las gentes del Decán.",
    },
    terms: {
      en: ["Xuanzang"],
      es: ["Xuanzang"],
    },
    visual: {
      kind: "photo",
      src: "/references/xuanzang-framed.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Fourteenth-century scroll painting of the traveller Xuanzang carrying Buddhist manuscripts",
        es: "Pintura histórica en rollo del viajero Xuanzang portando manuscritos",
      },
    },
  },
  {
    id: "yashwantrao-chavan",
    category: "person",
    title: { en: "Yashwantrao Chavan", es: "Yashwantrao Chavan" },
    description: {
      en: "First Chief Minister of Maharashtra in 1960, called to serve as India's Defence Minister in 1962.",
      es: "Primer jefe de gobierno de Maharashtra en 1960, nombrado ministro de Defensa de la India en 1962.",
    },
    terms: {
      en: ["Yashwantrao Chavan"],
      es: ["Yashwantrao Chavan"],
    },
    visual: {
      kind: "photo",
      src: "/references/yashwantrao-chavan-photo.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Archival photograph of Yashwantrao Chavan",
        es: "Fotografía de archivo de Yashwantrao Chavan",
      },
    },
  },
  {
    id: "sant-namdev",
    category: "person",
    title: { en: "Sant Namdev", es: "Sant Namdev" },
    description: {
      en: "Fourteenth-century Varkari saint-poet from Maharashtra whose humane devotional verses live on across India.",
      es: "Poeta y santo varkari del siglo XIV en Maharashtra cuyos versos igualitarios siguen vivos en toda la India.",
    },
    terms: {
      en: ["Sant Namdev"],
      es: ["Sant Namdev"],
    },
    visual: {
      kind: "photo",
      src: "/references/sant-namdev-varkari.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Traditional depiction of Marathi saint-poet Sant Namdev holding a veena and cymbals",
        es: "Representación tradicional del poeta santo maratí Sant Namdev con vina y címbalos",
      },
    },
  },
  {
    id: "sant-dnyaneshwar",
    category: "person",
    title: { en: "Sant Dnyaneshwar", es: "Sant Dnyaneshwar" },
    description: {
      en: "Thirteenth-century Marathi saint-poet and philosopher who wrote in everyday Marathi for ordinary readers.",
      es: "Poeta y filósofo del siglo XIII que escribió en maratí hablado para acercar el saber a todo el pueblo.",
    },
    terms: {
      en: ["Sant Dnyaneshwar"],
      es: ["Sant Dnyaneshwar"],
    },
    visual: {
      kind: "photo",
      src: "/references/sant-dnyaneshwar.jpg",
      objectPosition: "50% 22%",
      alt: {
        en: "Traditional portrait of thirteenth-century Marathi saint-poet Sant Dnyaneshwar",
        es: "Retrato tradicional del poeta y filósofo maratí Sant Dnyaneshwar",
      },
    },
  },
  {
    id: "sant-tukaram",
    category: "person",
    title: { en: "Sant Tukaram", es: "Sant Tukaram" },
    description: {
      en: "Seventeenth-century Varkari poet from Dehu near Pune whose direct abhang verses remain part of spoken Marathi.",
      es: "Poeta popular del siglo XVII cerca de Pune cuyos poemas abhang forman parte del habla maratí actual.",
    },
    terms: {
      en: ["Sant Tukaram"],
      es: ["Sant Tukaram"],
    },
    visual: {
      kind: "photo",
      src: "/references/sant-tukaram-framed.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Portrait of Sant Tukaram with chiplya cymbals and veena by Raja Ravi Varma",
        es: "Retrato de Sant Tukaram con címbalos y vina pintado por Raja Ravi Varma",
      },
    },
  },

  // --- Script, Textiles, Attire & Traditions ---
  {
    id: "modi-script",
    category: "script",
    title: { en: "Modi script", es: "Escritura modi" },
    description: {
      en: "Cursive Marathi script used until the mid-twentieth century for administrative letters, seals, and signatures.",
      es: "Escritura cursiva maratí empleada hasta mediados del siglo XX en cartas oficiales, sellos y firmas.",
    },
    terms: {
      en: ["Modi script", "Modi"],
      es: ["escritura modi", "modi"],
    },
    visual: {
      kind: "photo",
      src: "/references/modi-script-closeup.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Close view of an eighteenth-century Marathi letter written by hand in cursive Modi script",
        es: "Detalle de una carta maratí del siglo XVIII manuscrita en escritura cursiva modi",
      },
    },
  },
  {
    id: "paithani",
    category: "textile",
    title: { en: "Paithani silk weaving", es: "Tejido de seda Paithani" },
    description: {
      en: "Handwoven Maharashtra silk saree with interlocking silk motifs on the pallu and heavy metallic zari borders.",
      es: "Sari artesanal de seda de Maharashtra con motivos entrelazados en el extremo y cenefas densas de hilo zari.",
    },
    terms: {
      en: ["Paithani"],
      es: ["Paithani"],
    },
    visual: {
      kind: "photo",
      src: "/references/paithani-pallu.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Close view of a handwoven silk Paithani pallu with flowering trees and birds",
        es: "Detalle de un pallu artesanal de seda Paithani con motivos florales y aves",
      },
    },
  },
  {
    id: "pallu",
    category: "textile",
    title: { en: "Pallu", es: "Pallu" },
    description: {
      en: "The decorative end section of a saree that falls over the shoulder, woven or embroidered with denser motifs than the body.",
      es: "El extremo más decorado de un sari, tejido o bordado con motivos más densos que el cuerpo central de la tela.",
    },
    terms: {
      en: ["pallu"],
      es: ["pallu"],
    },
  },
  {
    id: "zari",
    category: "textile",
    title: { en: "Zari thread", es: "Hilo zari" },
    description: {
      en: "Fine gold- or silver-toned metallic thread wrapped around a silk or cotton core to weave luminous saree borders.",
      es: "Hilo metálico dorado o plateado enrollado sobre alma de seda o algodón con el que se tejen las cenefas del sari.",
    },
    terms: {
      en: ["zari"],
      es: ["zari"],
    },
  },
  {
    id: "choli",
    category: "textile",
    title: { en: "Choli blouse", es: "Blusa choli" },
    description: {
      en: "Short, tailored blouse cut to match an individual saree, usually stitched to measure by a local Indian tailor.",
      es: "Blusa corta y ajustada que acompaña al sari y suele confeccionarse a medida en un taller local en la India.",
    },
    terms: {
      en: ["choli"],
      es: ["choli"],
    },
  },
  {
    id: "nauvari",
    category: "textile",
    title: {
      en: "Nauvari nine-yard saree",
      es: "Sari nauvari de nueve yardas",
    },
    description: {
      en: "Traditional Maharashtrian saree around eight metres long, tucked between the legs without a petticoat for full stride.",
      es: "Sari tradicional de unos ocho metros que se pasa entre las piernas sin enagua para caminar con total libertad.",
    },
    terms: {
      en: ["Nauvari", "nauvari"],
      es: ["nauvari"],
    },
    visual: {
      kind: "photo",
      src: "/references/nauvari-kashta-drape.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Full-length view of Maharashtrian women wearing nine-yard nauvari sarees tucked between the legs",
        es: "Vista de cuerpo entero de mujeres en Maharashtra vistiendo saris nauvari de nueve yardas",
      },
    },
  },
  {
    id: "thevnitlya-sadya",
    category: "textile",
    title: { en: "Thevnitlya sadya", es: "Thevnitlya sadya" },
    description: {
      en: "Marathi phrase for treasured wedding and festival sarees kept folded in family cupboards across years.",
      es: "Expresión maratí para los saris más queridos de bodas y celebraciones que se guardan doblados en el armario.",
    },
    terms: {
      en: ["thevnitlya sadya"],
      es: ["thevnitlya sadya"],
    },
    visual: {
      kind: "photo",
      src: "/references/thevnitlya-sadya-stack.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Close view of folded family silk sarees with woven gold borders held in an Indian home",
        es: "Detalle de saris familiares de seda doblados con cenefas doradas en una casa de la India",
      },
    },
  },
  {
    id: "khun",
    category: "textile",
    title: { en: "Khun blouse cloth", es: "Tejido khun para blusas" },
    description: {
      en: "Lightweight handloom fabric woven in Maharashtra and northern Karnataka with tiny geometric motifs and contrast borders.",
      es: "Tejido ligero de telar manual elaborado en Maharashtra y el norte de Karnataka con diminutos motivos geométricos y cenefa.",
    },
    terms: {
      en: ["khun"],
      es: ["khun"],
    },
    visual: {
      kind: "photo",
      src: "/references/khun-blouse-weave.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Close view of handloom khun blouse fabric showing tiny geometric motifs and a red and white woven border",
        es: "Detalle de tejido artesanal khun con diminutos motivos geométricos y cenefa roja y blanca",
      },
    },
  },
  {
    id: "nath",
    category: "textile",
    title: { en: "Maharashtrian nath", es: "Nath tradicional" },
    description: {
      en: "Crescent nose ornament set with white pearls and a ruby stone, worn on the left nostril at festive occasions.",
      es: "Joya nasal tradicional engarzada con perlas blancas y piedra roja que se lleva en la aleta izquierda.",
    },
    terms: {
      en: ["pearl nath", "nath"],
      es: ["nath de perlas", "nath"],
    },
    visual: {
      kind: "photo",
      src: "/references/nath-closeup.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Close view of a pearl and ruby Maharashtrian nath worn on the left nostril",
        es: "Primer plano de un nath tradicional de perlas y piedra roja en la aleta izquierda de la nariz",
      },
    },
  },
  {
    id: "thushi",
    category: "textile",
    title: { en: "Gold thushi choker", es: "Gargantilla thushi de oro" },
    description: {
      en: "Closely threaded traditional gold bead choker worn high on the neck across Maharashtra.",
      es: "Gargantilla tradicional de pequeñas cuentas de oro finamente ensartadas típica de Maharashtra.",
    },
    terms: {
      en: ["thushi"],
      es: ["thushi"],
    },
    visual: {
      kind: "photo",
      src: "/references/thushi-choker.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Close view of a traditional Kolhapuri gold bead thushi choker with a ruby pendant",
        es: "Primer plano de una gargantilla tradicional thushi de cuentas de oro con colgante rojo",
      },
    },
  },
  {
    id: "gudi-padwa",
    category: "tradition",
    title: { en: "Gudi Padwa", es: "Gudi Padwa" },
    description: {
      en: "Springtime Marathi New Year marked by raising silk-draped gudis outside homes and festive Shobha Yatra street processions.",
      es: "Año Nuevo maratí en primavera, celebrado alzando estandartes de seda en los hogares y desfiles festivos por las calles.",
    },
    terms: {
      en: ["Gudi Padwa"],
      es: ["Gudi Padwa"],
    },
    visual: {
      kind: "photo",
      src: "/references/gudi-padwa-rally.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Maharashtrian women in silk sarees, turbans, and pearl naths riding motorcycles during a Gudi Padwa Shobha Yatra",
        es: "Mujeres de Maharashtra con saris de seda, turbantes y nath de perlas en motocicleta durante Gudi Padwa",
      },
    },
  },
  {
    id: "vitthal",
    category: "tradition",
    title: { en: "Vitthal at Pandharpur", es: "Vitthal en Pandharpur" },
    description: {
      en: "Form of Vishnu worshipped at Pandharpur, standing hands on hips on the brick tossed by Pundalik while serving his parents.",
      es: "Imagen venerada en Pandharpur que aguarda de pie con las manos en la cintura sobre el ladrillo lanzado por Pundalik.",
    },
    terms: {
      en: ["Lord Vitthal", "Vitthal"],
      es: ["dios Vitthal", "Vitthal"],
    },
    visual: {
      kind: "photo",
      src: "/references/vitthal-on-brick.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Statue of Vitthal standing with both hands on his hips atop a brick",
        es: "Imagen de Vitthal de pie con las manos en la cintura sobre el ladrillo",
      },
    },
  },

  // --- Food & Kitchen Terms Across Stories ---
  {
    id: "puran-poli",
    category: "food",
    title: { en: "Puran poli", es: "Puran poli" },
    description: {
      en: "Festive Maharashtrian flatbread stuffed with sweet cooked split chickpeas, jaggery, and cardamom.",
      es: "Pan plano dulce típico de las fiestas en Maharashtra, relleno de garbanzo partido, panela y cardamomo.",
    },
    terms: {
      en: ["puran poli"],
      es: ["puran poli"],
    },
    visual: {
      kind: "photo",
      src: "/references/puran-poli.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Golden griddled puran poli flatbreads folded on a plate",
        es: "Panes planos dulces puran poli recién dorados a la plancha",
      },
    },
  },
  {
    id: "bhakri",
    category: "food",
    title: { en: "Bhakri flatbread", es: "Pan bhakri" },
    description: {
      en: "Unleavened sorghum or pearl-millet flatbread shaped by hand and roasted on an iron griddle across Maharashtra.",
      es: "Pan plano sin levadura amasado a mano con harina de sorgo o mijo en los hogares de Maharashtra.",
    },
    terms: {
      en: ["bhakri"],
      es: ["bhakri"],
    },
    visual: {
      kind: "photo",
      src: "/references/bhakri.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Three hand-patted jowar bhakri flatbreads on a steel thali",
        es: "Tres panes planos bhakri elaborados a mano sobre una bandeja de acero",
      },
    },
  },
  {
    id: "chakli",
    category: "food",
    title: { en: "Diwali chakli", es: "Chakli de Diwali" },
    description: {
      en: "Crisp savoury spiral snack pressed from spiced rice and gram flour in Indian homes during Diwali.",
      es: "Aperitivo crujiente en espiral de harina de arroz y legumbre especiada preparado en casa por Diwali.",
    },
    terms: {
      en: ["chakli"],
      es: ["chakli"],
    },
    visual: {
      kind: "photo",
      src: "/food and culture/pexels-saveurssecretes-5992263.jpg",
      objectPosition: "50% 55%",
      alt: {
        en: "Crisp spiral chakli snacks served beside hot chai",
        es: "Aperitivos crujientes chakli en espiral junto a dos vasos de chai",
      },
    },
  },
  {
    id: "shankarpali",
    category: "food",
    title: { en: "Shankarpali", es: "Shankarpali" },
    description: {
      en: "Crunchy diamond-cut Diwali pastry bites fried in sweet or lightly salted batches across Maharashtra.",
      es: "Pequeños bocados crujientes cortados en forma de rombo que se preparan en casa durante Diwali.",
    },
    terms: {
      en: ["shankarpali"],
      es: ["shankarpali"],
    },
    visual: {
      kind: "photo",
      src: "/references/shankarpali.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Golden diamond-cut Maharashtrian shankarpali pastry bites",
        es: "Bocados crujientes dorados de shankarpali cortados en forma de rombo",
      },
    },
  },
  {
    id: "brown-idli",
    category: "food",
    title: { en: "Whole-grain brown idli", es: "Idli oscuro integral" },
    description: {
      en: "Steamed savoury cakes fermented from whole-grain or millet batter, nuttier than white rice idlis.",
      es: "Pastelitos al vapor de masa fermentada con grano integral o mijo, de sabor más tostado que el idli blanco.",
    },
    terms: {
      en: ["brown idlis", "idli brown"],
      es: ["idlis oscuros", "idli oscuro"],
    },
    visual: {
      kind: "photo",
      src: "/food and culture/image.png_aa5ceb44_2K.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Steamed brown idlis served with spiced chutney",
        es: "Idlis oscuros al vapor servidos con chutney especiado",
      },
    },
  },

  // --- Craft Hubs & Workshop Terms ---
  {
    id: "ubrique",
    category: "spainPlace",
    title: { en: "Ubrique, Cádiz", es: "Ubrique, Cádiz" },
    description: {
      en: "Town in southern Spain known across Europe for traditional handbag and small leather goods craftsmanship.",
      es: "Localidad gaditana del sur de España reconocida en toda Europa por su tradición marroquinera en bolsos y pequeña piel.",
    },
    terms: {
      en: ["Ubrique"],
      es: ["Ubrique"],
    },
    visual: {
      kind: "map",
      mapSrc: "/references/map-ubrique.jpg",
      alt: {
        en: "Map of Spain and inset of western Andalusia highlighting Ubrique in Cádiz",
        es: "Mapa de España y detalle de Andalucía occidental situando Ubrique en Cádiz",
      },
    },
  },
  {
    id: "kaat-table",
    category: "craft",
    title: {
      en: "Kaat table (Cutting table)",
      es: "Kaat table (Mesa de corte)",
    },
    description: {
      en: "Wide workshop surface where whole hides are unrolled and inspected individually for grain, scratches, and stretch before cutting.",
      es: "Amplia mesa de taller donde cada piel se extiende entera para revisar su flor, marcas naturales y elasticidad antes del corte.",
    },
    terms: {
      en: ["kaat table"],
      es: ["kaat table"],
    },
    visual: {
      kind: "photo",
      src: "/references/kaat-cutting-table.jpg",
      objectPosition: "50% 45%",
      alt: {
        en: "Craftsperson cutting leather pattern pieces by hand across a wide cutting table",
        es: "Artesano cortando piezas de piel a mano sobre una amplia mesa de corte",
      },
    },
  },
  {
    id: "master-ji",
    category: "workshop",
    title: {
      en: "Master-ji (Pattern master)",
      es: "Master-ji (Maestro patronista)",
    },
    description: {
      en: "Respectful title used in Indian workshops for the head pattern master who translates a design into stiff cutting templates.",
      es: "Tratamiento respetuoso que se da en los talleres indios al maestro patronista encargado de pasar un diseño a plantillas físicas de corte.",
    },
    terms: {
      en: ["master-ji"],
      es: ["master-ji"],
    },
    visual: {
      kind: "photo",
      src: "/references/pattern-templates-master.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Heavy paper cutting templates, steel dies, and workshop shears arranged on a pattern wall",
        es: "Plantillas físicas de corte en cartón, troqueles metálicos y tijeras de taller en la zona de patronaje",
      },
    },
  },
  {
    id: "skiving",
    category: "craft",
    title: {
      en: "Skived seam edge",
      es: "Rebaje de cantos",
    },
    description: {
      en: "Shaving a leather edge down to a smooth taper so turned seams and corners fold flat over lining without bulk.",
      es: "Afinar progresivamente el grosor del borde de la piel para que las costuras dobladas giren planas sobre el forro sin abultar.",
    },
    terms: {
      en: ["skived"],
      es: ["rebaje"],
    },
    visual: {
      kind: "photo",
      src: "/references/skiving-edge-seam.jpg",
      fit: "contain",
      alt: {
        en: "Diagram showing a tapered skived leather bevel and the thinned edge folded flat over an ivory lining",
        es: "Diagrama que muestra el rebaje en bisel del canto de piel y el borde doblado plano sobre el forro",
      },
    },
  },
  {
    id: "hide-butt-anatomy",
    category: "craft",
    title: {
      en: "Hide zones: butt vs. belly",
      es: "Zonas de la piel: lomo y crupón",
    },
    description: {
      en: "The centre spine and butt hold the tightest fibres for structured panels, while the outer belly stretches easily.",
      es: "El lomo y el crupón concentran las fibras más firmes para paneles estructurados, mientras que la falda exterior cede con facilidad.",
    },
    terms: {
      en: ["spine and the butt"],
      es: ["lomo y el crupón"],
    },
    visual: {
      kind: "photo",
      src: "/references/hide-anatomy-cut.jpg",
      fit: "contain",
      alt: {
        en: "Illustration of a whole leather hide showing the shoulder, the central butt zone with bag pattern templates, and the stretchy outer belly flanks",
        es: "Ilustración de una piel entera con la zona del cuello, el crupón central con plantillas de bolso y las faldas laterales elásticas",
      },
    },
  },
  {
    id: "karigar",
    category: "workshop",
    title: {
      en: "Karigar (Skilled artisan)",
      es: "Karigar (Artesano de taller)",
    },
    description: {
      en: "Skilled craftsperson on an Indian workshop floor specialising in hand cutting, edge skiving, or heavy-duty stitching.",
      es: "Artesano especializado en los talleres de la India dedicado al corte manual, al rebaje de cantos o al cosido pesado de piel y prendas.",
    },
    terms: {
      en: ["karigars", "karigar"],
      es: ["karigars", "karigar"],
    },
    visual: {
      kind: "photo",
      src: "/references/karigar-leather-tools.jpg",
      objectPosition: "50% 50%",
      alt: {
        en: "Traditional leatherworking bench tools including a half-moon cutting knife, awl, brass buckle, waxed linen thread, shears, and wooden mallet",
        es: "Herramientas tradicionales de marroquinería sobre banco de madera: cuchilla de media luna, lezna, hebilla de latón, hilo encerado, tijeras y mazo",
      },
    },
  },
];
