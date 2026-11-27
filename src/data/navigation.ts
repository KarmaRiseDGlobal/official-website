import type { SiteLanguage } from "@/lib/urls";

export interface NavLinkItem {
  readonly href: string;
  readonly label: Record<SiteLanguage, string>;
}

export interface MenuShowcaseCard {
  readonly id: string;
  readonly href: string;
  readonly title: Record<SiteLanguage, string>;
  readonly pillLabel: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imagePosition: string;
  readonly imageAlt: Record<SiteLanguage, string>;
}

export const HEADER_COPY = {
  bannerLabel: {
    en: "Site header",
    es: "Cabecera del sitio",
  },
  menuButton: {
    en: "Menu",
    es: "Menú",
  },
  openMenuAria: {
    en: "Open menu",
    es: "Abrir menú",
  },
  closeMenuAria: {
    en: "Close menu",
    es: "Cerrar menú",
  },
  closeButton: {
    en: "Close",
    es: "Cerrar",
  },
  languageNavAria: {
    en: "Language",
    es: "Idioma",
  },
  dialogLabel: {
    en: "Site navigation",
    es: "Navegación del sitio",
  },
  primaryNavAria: {
    en: "Primary navigation",
    es: "Navegación principal",
  },
  secondaryNavAria: {
    en: "Company and direct links",
    es: "Iniciativas y contacto directo",
  },
  showcaseAria: {
    en: "Manufacturing categories",
    es: "Categorías de fabricación",
  },
  showcaseHeading: {
    en: "Start a brief by category",
    es: "Empezar por categoría",
  },
  showcaseHint: {
    en: "No tech pack needed",
    es: "Sin ficha técnica previa",
  },
  brandHomeAria: {
    en: "KarmaRise D Global home",
    es: "Inicio de KarmaRise D Global",
  },
} as const satisfies Record<string, Record<SiteLanguage, string>>;

export const PRIMARY_NAV_LINKS: readonly NavLinkItem[] = [
  { href: "/", label: { en: "Home", es: "Inicio" } },
  {
    href: "/manufacturing",
    label: {
      en: "Manufacturing Programme",
      es: "Programa de producción",
    },
  },
  {
    href: "/how-we-work",
    label: {
      en: "How we work",
      es: "Cómo trabajamos",
    },
  },
  { href: "/about", label: { en: "About", es: "Quiénes somos" } },
  { href: "/stories", label: { en: "Stories", es: "Historias" } },
];

export const SECONDARY_NAV_LINKS: readonly NavLinkItem[] = [
  {
    href: "/almarise",
    label: { en: "AlmaRise D Brand", es: "AlmaRise D Brand" },
  },
  {
    href: "/womens-training-initiative",
    label: {
      en: "Women's Training Initiative",
      es: "Formación para mujeres",
    },
  },
  {
    href: "/book-a-call?duration=15",
    label: {
      en: "Book a video call",
      es: "Reservar videollamada",
    },
  },
  {
    href: "/product-brief",
    label: {
      en: "Start a Product Brief",
      es: "Empezar briefing de producto",
    },
  },
  {
    href: "/contact",
    label: {
      en: "Contact",
      es: "Contacto",
    },
  },
];

export const MENU_SHOWCASE_CARDS: readonly MenuShowcaseCard[] = [
  {
    id: "leather-bags",
    href: "/product-brief?product=bags",
    title: {
      en: "Leather goods",
      es: "Bolsos y artículos de piel",
    },
    pillLabel: {
      en: "Start brief",
      es: "Empezar briefing",
    },
    image: "/images/capabilities/leather-hides.jpg",
    imagePosition: "object-center",
    imageAlt: {
      en: "Smooth brown, slate, and burgundy vegetable-tanned leather hides layered on a wooden table",
      es: "Pieles lisas de curtido vegetal en tonos marrón, pizarra y burdeos sobre una mesa de madera",
    },
  },
  {
    id: "clothing-capsules",
    href: "/product-brief?product=garments",
    title: {
      en: "Clothing",
      es: "Ropa y prendas",
    },
    pillLabel: {
      en: "Start brief",
      es: "Empezar briefing",
    },
    image: "/images/capabilities/natural-fabrics.jpg",
    imagePosition: "object-[50%_72%]",
    imageAlt: {
      en: "Folded stack of olive, terracotta, linen, ochre, and slate fabrics",
      es: "Pila doblada de tejidos naturales en tonos oliva, terracota, lino, ocre y pizarra",
    },
  },
  {
    id: "textile-accessories",
    href: "/product-brief?product=textile-accessories",
    title: {
      en: "Textile accessories",
      es: "Complementos textiles",
    },
    pillLabel: {
      en: "Start brief",
      es: "Empezar briefing",
    },
    image: "/images/capabilities/textile-accessories.jpg",
    imagePosition: "object-center",
    imageAlt: {
      en: "Woven pashmina scarf, quilted cotton-linen tote bag, embroidered evening clutch, and padded linen headband on a sunlit stone surface",
      es: "Pashmina tejida, tote acolchado de algodón y lino, clutch bordado y diadema de lino sobre una superficie de piedra soleada",
    },
  },
  {
    id: "home-decor",
    href: "/product-brief?product=home-decor",
    title: {
      en: "Textile home decor",
      es: "Decoración textil del hogar",
    },
    pillLabel: {
      en: "Start brief",
      es: "Empezar briefing",
    },
    image: "/images/culture/maharashtra-handloom-zari-border.jpg",
    imagePosition: "object-center",
    imageAlt: {
      en: "Artisan hands weaving a gold and crimson patterned cloth border on a wooden handloom with wooden shuttles beside skeins of natural yarn",
      es: "Manos artesanas tejiendo una cenefa dorada y carmesí en un telar de madera con lanzaderas junto a madejas de hilo natural",
    },
  },
];
