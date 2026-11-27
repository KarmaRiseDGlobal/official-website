import type { SiteLanguage } from "@/lib/urls";

export type PartnerLandingTrack = "b2b" | "almarise";

export type PartnerUtmMedium =
  "podcast" | "newsletter-sponsor" | "creator" | "gifting" | "linkedin-partner";

export interface PartnerLandingHighlight {
  readonly id: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
}

export interface PartnerLandingConfig {
  readonly slug: string;
  readonly track: PartnerLandingTrack;
  readonly partnerName: Record<SiteLanguage, string>;
  readonly breadcrumbLabel: Record<SiteLanguage, string>;
  readonly utm: {
    readonly source: string;
    readonly medium: PartnerUtmMedium;
    readonly campaign: string;
    readonly content?: string;
    readonly refCode: string;
  };
  readonly seo: {
    readonly title: Record<SiteLanguage, string>;
    readonly description: Record<SiteLanguage, string>;
  };
  readonly headline: Record<SiteLanguage, string>;
  readonly lead: Record<SiteLanguage, string>;
  readonly helperNote: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imagePosition: string;
  readonly imageAlt: Record<SiteLanguage, string>;
  readonly primaryCta: {
    readonly label: Record<SiteLanguage, string>;
    readonly href: string;
  };
  readonly secondaryCta: {
    readonly label: Record<SiteLanguage, string>;
    readonly href: string;
  };
  readonly highlightsHeading: Record<SiteLanguage, string>;
  readonly highlightsIntro: Record<SiteLanguage, string>;
  readonly highlights: readonly PartnerLandingHighlight[];
  readonly closingHeading: Record<SiteLanguage, string>;
  readonly closingBody: Record<SiteLanguage, string>;
  readonly showNewsletter: boolean;
}

export const PARTNER_LANDINGS: readonly PartnerLandingConfig[] = [
  {
    slug: "b2b-retail-podcast",
    track: "b2b",
    partnerName: {
      en: "Retail & Brand Podcast Listeners",
      es: "Oyentes de pódcast de comercio y marcas",
    },
    breadcrumbLabel: {
      en: "Podcast listeners",
      es: "Oyentes de pódcast",
    },
    utm: {
      source: "b2b-retail-podcast",
      medium: "podcast",
      campaign: "b2b-podcast-intro",
      content: "vanity-landing",
      refCode: "retail-podcast",
    },
    seo: {
      title: {
        en: "Welcome Podcast Listeners | KarmaRise D Global",
        es: "Bienvenidos oyentes de pódcast | KarmaRise D Global",
      },
      description: {
        en: "Heard Alma and Shirish on a retail podcast? Book a free discovery call or share a Product Brief to manufacture own-brand goods in India.",
        es: "¿Nos escuchaste en un pódcast de comercio? Reserva una videollamada gratuita con Alma o envía tu briefing de producto para fabricar en la India.",
      },
    },
    headline: {
      en: "Welcome from the episode. Let us talk through your own-brand line.",
      es: "Gracias por escucharnos. Hablemos de tu colección de marca propia.",
    },
    lead: {
      en: "We help independent shops, emerging labels, and retail buyers across Spain and the rest of Europe develop leather goods, clothing, textile accessories, and textile home decor in India with both founders on the ground.",
      es: "Ayudamos a comercios independientes, marcas emergentes y cadenas de España y el resto de Europa a diseñar y fabricar bolsos y artículos de piel, ropa, complementos textiles y decoración textil del hogar en la India con ambos fundadores sobre el terreno.",
    },
    helperNote: {
      en: "Free 15-minute or 30-minute Google Meet with Alma in English, Spanish, or Portuguese · Written meeting conclusions right after · Mutual NDA available",
      es: "Videollamada gratuita de 15 o 30 minutos por Google Meet con Alma en español, inglés o portugués · Conclusiones por escrito al terminar · Acuerdo NDA disponible",
    },
    image: "/images/founders/alma-shirish-planning-table-window-india.jpeg",
    imagePosition: "50% 38%",
    imageAlt: {
      en: "Alma and Shirish seated face to face across a wooden table with a tablet by a sunlit window in India",
      es: "Alma y Shirish sentados frente a frente con una tableta junto a una ventana luminosa en la India",
    },
    primaryCta: {
      label: {
        en: "Book a free call with Alma",
        es: "Reserva una llamada gratis con Alma",
      },
      href: "/book-a-call?duration=15",
    },
    secondaryCta: {
      label: {
        en: "Share your product idea instead",
        es: "Prefiero contar mi idea por escrito",
      },
      href: "/product-brief",
    },
    highlightsHeading: {
      en: "What makes our India Manufacturing Programme different",
      es: "Qué hace distinto nuestro Programa de producción en la India",
    },
    highlightsIntro: {
      en: "No finished tech packs required on day one. Every project is scoped individually from your Product Brief and checked physically before production begins.",
      es: "No necesitas una ficha técnica cerrada el primer día. Cada proyecto se estudia a medida a partir de tu briefing de producto y se valida físicamente antes de producir.",
    },
    highlights: [
      {
        id: "swatch-and-sample",
        title: {
          en: "Physical swatch and sample before cutting starts",
          es: "Muestra física de color y prenda antes de cortar",
        },
        body: {
          en: "We guide dye specs, create a physical colour swatch for your approval, and review samples in India so you hold and sign off the physical piece before production begins.",
          es: "Te indicamos lo necesario para cada tintada, creamos una muestra física de color y revisamos cada prototipo en la India para que apruebes la muestra en mano antes de producir.",
        },
      },
      {
        id: "regional-matching",
        title: {
          en: "Matched to specialist Indian craft hubs",
          es: "Cada producto en su región especialista",
        },
        body: {
          en: "We audit family-run factories, leather ateliers, garment makers, and women artisan collectives across Kolkata, Kanpur, Agra, and Chennai with supervision from Maharashtra.",
          es: "Auditamos en persona fábricas de corte familiar, marroquineros, confeccionistas y colectivos de artesanas en Calcuta, Kanpur, Agra y Chennai con supervisión desde Maharashtra.",
        },
      },
      {
        id: "legal-and-doorstep",
        title: {
          en: "Bar Council contracts to your shop door",
          es: "Contratos bajo ley india hasta tu puerta",
        },
        body: {
          en: "Shirish structures written Indian supplier contracts and on-site checks while Alma handles European retail ergonomics, EU care labelling, and export delivery.",
          es: "Shirish redacta los contratos bajo legislación india y supervisa en planta, mientras Alma cuida la ergonomía comercial, el etiquetado europeo y la entrega en tu negocio.",
        },
      },
    ],
    closingHeading: {
      en: "Bring a sketch, a reference piece, or a single question.",
      es: "Trae un boceto, una pieza de referencia o una primera duda.",
    },
    closingBody: {
      en: "Pick a time that suits you on Alma's calendar, or explore our four categories and six-stage process first.",
      es: "Elige el hueco que mejor te venga en la agenda de Alma o revisa antes nuestras cuatro categorías y las seis fases del proceso.",
    },
    showNewsletter: false,
  },
  {
    slug: "almarise-madrid-wearers",
    track: "almarise",
    partnerName: {
      en: "AlmaRise D Brand Wearers & Creators",
      es: "Creadoras y comunidad de AlmaRise D Brand",
    },
    breadcrumbLabel: {
      en: "AlmaRise D Brand guests",
      es: "Invitadas de AlmaRise D Brand",
    },
    utm: {
      source: "almarise-madrid-wearers",
      medium: "creator",
      campaign: "almarise-seeding-es",
      content: "vanity-landing",
      refCode: "madrid-wearers",
    },
    seo: {
      title: {
        en: "AlmaRise D Brand: Kept Sarees & Organic Textiles | KarmaRise",
        es: "AlmaRise D Brand: Saris con historia y tejidos orgánicos | KarmaRise",
      },
      description: {
        en: "Discovered AlmaRise D Brand through a creator or wearer? Explore AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor and join our letters.",
        es: "¿Has descubierto AlmaRise D Brand a través de una creadora? Conoce AlmaRise D Reborn, AlmaRise D Organic y AlmaRise D Home Decor y únete a nuestras cartas.",
      },
    },
    headline: {
      en: "Natural cloth with a past, tailored for everyday wear.",
      es: "Tejidos naturales con historia, pensados para vestir a diario.",
    },
    lead: {
      en: "AlmaRise D Brand is our own sustainable fashion and lifestyle label crafted in India for Spain and the rest of Europe: AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor.",
      es: "AlmaRise D Brand es nuestra marca propia de moda sostenible y hogar hecha en la India para España y el resto de Europa: AlmaRise D Reborn, AlmaRise D Organic y AlmaRise D Home Decor.",
    },
    helperNote: {
      en: "One-of-a-kind kept sarees · Organic fruit and plant-waste textiles · Crafted home pieces",
      es: "Saris guardados convertidos en piezas únicas · Tejidos orgánicos vegetales · Piezas para el hogar",
    },
    image:
      "/images/almarise/almarise-reborn-olive-pallu-shrug-madrid-street.jpeg",
    imagePosition: "50% 25%",
    imageAlt: {
      en: "Woman wearing an olive and coral AlmaRise D Reborn saree shrug over dark jeans outdoors in daylight",
      es: "Mujer vistiendo un shrug verde oliva y coral de AlmaRise D Reborn sobre vaqueros oscuros a la luz del día",
    },
    primaryCta: {
      label: {
        en: "Explore AlmaRise D Brand",
        es: "Descubrir AlmaRise D Brand",
      },
      href: "/almarise",
    },
    secondaryCta: {
      label: {
        en: "Read the saree story",
        es: "Leer la historia de los saris",
      },
      href: "/stories/giving-maharashtrian-sarees-a-second-life",
    },
    highlightsHeading: {
      en: "Three lines rooted in real Indian textiles",
      es: "Tres líneas nacidas de tejidos reales de la India",
    },
    highlightsIntro: {
      en: "Each garment starts in our India studio beside local makers and moves straight into everyday European wardrobes.",
      es: "Cada prenda nace en nuestro estudio en la India junto a confeccionistas locales y está pensada para integrarse en armarios reales de España y el resto de Europa.",
    },
    highlights: [
      {
        id: "reborn",
        title: {
          en: "AlmaRise D Reborn",
          es: "AlmaRise D Reborn",
        },
        body: {
          en: "One-of-a-kind shrugs, kimonos, and everyday garments cut from treasured sarees (thevnitlya sadya) that Indian women kept for years.",
          es: "Shrugs, kimonos y prendas de uso diario únicas confeccionadas a partir de saris guardados con historia (thevnitlya sadya) por mujeres en la India.",
        },
      },
      {
        id: "organic",
        title: {
          en: "AlmaRise D Organic",
          es: "AlmaRise D Organic",
        },
        body: {
          en: "Breathable natural pieces dyed with organic pigments and woven from sugarcane, orange, banana, and pineapple plant-waste fibres, among others.",
          es: "Prendas frescas con tintes orgánicos y tejidos obtenidos de residuos de caña de azúcar, naranja, plátano y piña, entre otros.",
        },
      },
      {
        id: "home-decor",
        title: {
          en: "AlmaRise D Home Decor",
          es: "AlmaRise D Home Decor",
        },
        body: {
          en: "Calm tactile textile pieces for the home built from the same natural fibres, dye sensibility, and hand finishing.",
          es: "Piezas textiles para el hogar creadas con las mismas fibras naturales, tintes y acabados artesanales.",
        },
      },
    ],
    closingHeading: {
      en: "Join our letters for upcoming pieces and studio notes.",
      es: "Recibe nuestras cartas con las próximas piezas y notas del estudio.",
    },
    closingBody: {
      en: "Every two weeks Alma and Shirish write from India and Spain about AlmaRise D Brand pieces, kept fabrics, and real life between both countries.",
      es: "Cada dos semanas Alma y Shirish escriben desde la India y España sobre las piezas de AlmaRise D Brand, los tejidos y la vida real entre ambos países.",
    },
    showNewsletter: true,
  },
];

export function getPartnerLandingBySlug(
  slug: string,
): PartnerLandingConfig | undefined {
  const normalized = slug.trim().toLowerCase();
  return PARTNER_LANDINGS.find((entry) => entry.slug === normalized);
}

export function buildPartnerTrackedHref(
  baseHref: string,
  partner: PartnerLandingConfig,
  lang: SiteLanguage,
  localize: (href: string, language: SiteLanguage) => string,
): string {
  const localized = localize(baseHref, lang);
  const [withoutHash, hash] = localized.split("#");
  const [pathname, existingQuery] = (withoutHash ?? "/").split("?");
  const params = new URLSearchParams(existingQuery ?? "");

  params.set("utm_source", partner.utm.source);
  params.set("utm_medium", partner.utm.medium);
  params.set("utm_campaign", partner.utm.campaign);
  if (partner.utm.content) {
    params.set("utm_content", partner.utm.content);
  }
  params.set("ref", partner.utm.refCode);

  const queryString = params.toString();
  const hashSuffix = hash ? `#${hash}` : "";
  return `${pathname || "/"}${queryString ? `?${queryString}` : ""}${hashSuffix}`;
}
