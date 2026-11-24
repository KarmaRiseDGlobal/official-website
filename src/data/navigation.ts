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
    en: "Manufacturing categories and AlmaRise D Brand",
    es: "Categorías de fabricación y AlmaRise D Brand",
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
      en: "Leather bags & leather goods",
      es: "Bolsos y otros artículos de piel",
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
      en: "Clothing in natural & varied fabrics",
      es: "Prendas de diversos tejidos",
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
    id: "custom-sewn-goods",
    href: "/product-brief?product=other",
    title: {
      en: "Custom sewn accessories",
      es: "Complementos a medida",
    },
    pillLabel: {
      en: "Start brief",
      es: "Empezar briefing",
    },
    image: "/images/capabilities/sewn-accessories-machine.jpg",
    imagePosition: "object-[50%_62%]",
    imageAlt: {
      en: "Cast-iron stitching machine in a sunlit sewing studio",
      es: "Máquina de coser de hierro fundido en un espacio de confección soleado",
    },
  },
  {
    id: "home-decor",
    href: "/product-brief?product=home-decor",
    title: {
      en: "Home decor",
      es: "Decoración del hogar",
    },
    pillLabel: {
      en: "Start brief",
      es: "Empezar briefing",
    },
    image: "/images/capabilities/home-decor-ceramics.jpg",
    imagePosition: "object-[50%_65%]",
    imageAlt: {
      en: "Matte ceramic vessels, dried grasses, and linen books on a sunlit table",
      es: "Jarrones cerámicos mate, espigas secas y libros de lino sobre una mesa soleada",
    },
  },
  {
    id: "almarise",
    href: "/almarise",
    title: {
      en: "AlmaRise D Brand",
      es: "AlmaRise D Brand",
    },
    pillLabel: {
      en: "Explore AlmaRise D Brand",
      es: "Ver AlmaRise D Brand",
    },
    image:
      "/images/almarise/almarise-reborn-olive-pallu-shrug-madrid-street.jpeg",
    imagePosition: "object-[50%_18%]",
    imageAlt: {
      en: "Model wearing an AlmaRise D Reborn embroidered saree shrug on a Madrid street",
      es: "Modelo vistiendo un shrug bordado de AlmaRise D Reborn en una calle de Madrid",
    },
  },
];
