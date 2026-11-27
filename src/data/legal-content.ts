import type { SiteLanguage } from "@/lib/urls";

export interface LegalNavLinkItem {
  readonly href:
    "/privacy-policy" | "/terms" | "/cookie-policy" | "/legal-notice";
  readonly label: Record<SiteLanguage, string>;
}

export const LEGAL_NAV_LINKS: readonly LegalNavLinkItem[] = [
  {
    href: "/privacy-policy",
    label: { en: "Privacy policy", es: "Política de privacidad" },
  },
  {
    href: "/terms",
    label: { en: "Website terms", es: "Condiciones de uso" },
  },
  {
    href: "/cookie-policy",
    label: { en: "Cookie policy", es: "Política de cookies" },
  },
  {
    href: "/legal-notice",
    label: { en: "Legal notice", es: "Aviso legal" },
  },
];

export const LEGAL_DATES = {
  effective: {
    en: "15 May 2025",
    es: "15 de mayo de 2025",
  },
  updated: {
    en: "27 November 2026",
    es: "27 de noviembre de 2026",
  },
} as const;

export const LEGAL_REGISTERED_OFFICE =
  "2nd floor, Guru Charan Apartment, Ulhasnagar, Maharashtra, India, 421002";

export interface OfficialEmailItem {
  readonly email: string;
  readonly department: Record<SiteLanguage, string>;
}

export interface OfficialEmailGroup {
  readonly id: string;
  readonly heading: Record<SiteLanguage, string>;
  readonly items: readonly OfficialEmailItem[];
}

export const OFFICIAL_EMAIL_GROUPS: readonly OfficialEmailGroup[] = [
  {
    id: "client-intake",
    heading: {
      en: "Commercial and Client enquiries",
      es: "Consultas comerciales y atención a clientes",
    },
    items: [
      {
        email: "hola@karmarisedglobal.com",
        department: {
          en: "Client intake in Spain, the rest of Europe, and internationally (Spanish, English, and Portuguese)",
          es: "Atención a clientes en España, el resto de Europa e internacional (español, inglés y portugués)",
        },
      },
      {
        email: "namaste@karmarisedglobal.com",
        department: {
          en: "India Client and general commercial intake",
          es: "Atención comercial general y clientes en la India",
        },
      },
      {
        email: "inquiry@karmarisedglobal.com",
        department: {
          en: "Product Brief and new Manufacturing Programme enquiries",
          es: "Consultas de briefing de producto y nuevos Programas de producción",
        },
      },
    ],
  },
  {
    id: "founders-and-partners",
    heading: {
      en: "Founders and Manufacturing Partners in India",
      es: "Fundadores y unidades de producción en la India",
    },
    items: [
      {
        email: "alma@karmarisedglobal.com",
        department: {
          en: "Alma, Co-Founder and Client operations across Spain, the rest of Europe, and India",
          es: "Alma, cofundadora y operaciones con clientes en España, el resto de Europa y la India",
        },
      },
      {
        email: "shirish@karmarisedglobal.com",
        department: {
          en: "Shirish, Designated Partner and India operations",
          es: "Shirish, socio director y operaciones en la India",
        },
      },
      {
        email: "partners@karmarisedglobal.com",
        department: {
          en: "Manufacturing Partners, production units, and artisans in India",
          es: "Unidades de producción colaboradoras y artesanos en la India",
        },
      },
    ],
  },
  {
    id: "support-editorial-accounts",
    heading: {
      en: "Support, editorial, and invoicing",
      es: "Soporte, área editorial y facturación",
    },
    items: [
      {
        email: "support@karmarisedglobal.com",
        department: {
          en: "Client support, data protection, and Statutory Grievance Officer",
          es: "Soporte a clientes, protección de datos y responsable de reclamaciones",
        },
      },
      {
        email: "stories@karmarisedglobal.com",
        department: {
          en: "Editorial Stories, press, media, and AlmaRise D Brand enquiries",
          es: "Historias editoriales, prensa, medios y consultas sobre AlmaRise D Brand",
        },
      },
      {
        email: "accounts@karmarisedglobal.com",
        department: {
          en: "Billing, invoicing, export paperwork, and GST documentation",
          es: "Facturación, documentación de exportación y gestión GST",
        },
      },
    ],
  },
];

export interface CookieInventoryItem {
  readonly id: string;
  readonly name: Record<SiteLanguage, string>;
  readonly storageType: Record<SiteLanguage, string>;
  readonly provider: Record<SiteLanguage, string>;
  readonly purpose: Record<SiteLanguage, string>;
  readonly duration: Record<SiteLanguage, string>;
  readonly category: Record<SiteLanguage, string>;
  readonly isOptional?: boolean;
}

export const COOKIE_INVENTORY: readonly CookieInventoryItem[] = [
  {
    id: "assistant-session",
    name: {
      en: "Website Assistant session",
      es: "Sesión del asistente del sitio web",
    },
    storageType: {
      en: "First-party security cookie",
      es: "Cookie propia de seguridad",
    },
    provider: {
      en: "KarmaRise D Global",
      es: "KarmaRise D Global",
    },
    purpose: {
      en: "Maintains an active Website Assistant session and enforces anti-abuse limits.",
      es: "Mantiene activa la sesión del asistente del sitio web y aplica límites frente a usos abusivos.",
    },
    duration: {
      en: "2 hours",
      es: "2 horas",
    },
    category: {
      en: "Strictly necessary",
      es: "Estrictamente necesaria",
    },
  },
  {
    id: "bot-protection",
    name: {
      en: "Form and chat bot protection",
      es: "Protección antibots en formularios y chat",
    },
    storageType: {
      en: "Third-party security cookie",
      es: "Cookie de seguridad de terceros",
    },
    provider: {
      en: "Security provider",
      es: "Proveedor de seguridad",
    },
    purpose: {
      en: "Verifies human submissions and protects enquiry forms, chat, and preference controls against automated spam.",
      es: "Verifica envíos humanos y protege los formularios de consulta, el asistente y las preferencias frente al correo automatizado.",
    },
    duration: {
      en: "Session",
      es: "Sesión",
    },
    category: {
      en: "Strictly necessary",
      es: "Estrictamente necesaria",
    },
  },
  {
    id: "language-preference",
    name: {
      en: "Language preference",
      es: "Preferencia de idioma",
    },
    storageType: {
      en: "Browser storage",
      es: "Almacenamiento del navegador",
    },
    provider: {
      en: "KarmaRise D Global",
      es: "KarmaRise D Global",
    },
    purpose: {
      en: "Remembers whether you browse the site in English or Spanish across visits.",
      es: "Recuerda el idioma seleccionado entre español e inglés entre visitas.",
    },
    duration: {
      en: "Until cleared",
      es: "Hasta su eliminación",
    },
    category: {
      en: "Essential preference",
      es: "Preferencia esencial",
    },
  },
  {
    id: "cookie-consent",
    name: {
      en: "Cookie preference choice",
      es: "Elección de preferencias de cookies",
    },
    storageType: {
      en: "Browser storage",
      es: "Almacenamiento del navegador",
    },
    provider: {
      en: "KarmaRise D Global",
      es: "KarmaRise D Global",
    },
    purpose: {
      en: "Records your cookie choice (essential only or all) so the site respects your selection.",
      es: "Guarda su elección de cookies (solo esenciales o todas) para que el sitio respete su decisión.",
    },
    duration: {
      en: "Until cleared",
      es: "Hasta su eliminación",
    },
    category: {
      en: "Strictly necessary",
      es: "Estrictamente necesaria",
    },
  },
  {
    id: "brief-draft",
    name: {
      en: "In-progress Product Brief draft",
      es: "Borrador del briefing de producto",
    },
    storageType: {
      en: "Device browser storage",
      es: "Almacenamiento local del navegador",
    },
    provider: {
      en: "KarmaRise D Global",
      es: "KarmaRise D Global",
    },
    purpose: {
      en: "Auto-saves unfinished Product Brief fields on your own device so work in progress is not lost.",
      es: "Guarda automáticamente en su dispositivo los campos en curso del briefing de producto para evitar la pérdida del borrador.",
    },
    duration: {
      en: "14 days or until submitted",
      es: "14 días o hasta el envío",
    },
    category: {
      en: "User-requested",
      es: "Solicitada por usted",
    },
  },
  {
    id: "tab-continuity",
    name: {
      en: "Active tab form and chat continuity",
      es: "Continuidad de formularios y chat en la pestaña",
    },
    storageType: {
      en: "Temporary tab storage",
      es: "Almacenamiento temporal de pestaña",
    },
    provider: {
      en: "KarmaRise D Global",
      es: "KarmaRise D Global",
    },
    purpose: {
      en: "Carries enquiry details between pages, keeps your active assistant conversation while the tab stays open, and smooths page transitions.",
      es: "Transfiere datos entre pasos de los formularios, conserva la conversación activa del asistente mientras la pestaña siga abierta y suaviza la navegación.",
    },
    duration: {
      en: "Current tab session",
      es: "Sesión de la pestaña actual",
    },
    category: {
      en: "Strictly necessary",
      es: "Estrictamente necesaria",
    },
  },
  {
    id: "referral-attribution",
    name: {
      en: "Referral and campaign attribution",
      es: "Atribución de referencias y campañas",
    },
    storageType: {
      en: "Browser storage",
      es: "Almacenamiento del navegador",
    },
    provider: {
      en: "KarmaRise D Global",
      es: "KarmaRise D Global",
    },
    purpose: {
      en: "Remembers which newsletter or partner introduction brought you here, activated only when you accept optional cookies.",
      es: "Recuerda qué carta o colaborador le presentó nuestro proyecto; solo se activa si usted acepta las cookies opcionales.",
    },
    duration: {
      en: "Up to 30 days",
      es: "Hasta 30 días",
    },
    category: {
      en: "Optional (consent)",
      es: "Opcional (consentimiento)",
    },
    isOptional: true,
  },
];

export interface BrowserGuideItem {
  readonly browser: string;
  readonly steps: Record<SiteLanguage, readonly string[]>;
}

export const BROWSER_GUIDES: readonly BrowserGuideItem[] = [
  {
    browser: "Google Chrome",
    steps: {
      en: ["Settings", "Privacy and security", "Cookies and other site data"],
      es: [
        "Configuración",
        "Privacidad y seguridad",
        "Cookies y otros datos de sitios",
      ],
    },
  },
  {
    browser: "Mozilla Firefox",
    steps: {
      en: ["Settings", "Privacy & Security", "Cookies and Site Data"],
      es: ["Ajustes", "Privacidad y seguridad", "Cookies y datos del sitio"],
    },
  },
  {
    browser: "Apple Safari",
    steps: {
      en: ["Settings / Preferences", "Privacy", "Manage Website Data"],
      es: [
        "Ajustes / Preferencias",
        "Privacidad",
        "Gestionar datos de sitios web",
      ],
    },
  },
  {
    browser: "Microsoft Edge",
    steps: {
      en: [
        "Settings",
        "Cookies and site permissions",
        "Manage and delete cookies and site data",
      ],
      es: [
        "Configuración",
        "Cookies y permisos del sitio",
        "Administrar y eliminar cookies y datos del sitio",
      ],
    },
  },
];

export interface DataProcessorItem {
  readonly id: string;
  readonly processor: Record<SiteLanguage, string>;
  readonly role: Record<SiteLanguage, string>;
  readonly dataProcessed: Record<SiteLanguage, string>;
  readonly locationAndSafeguard: Record<SiteLanguage, string>;
}

export const DATA_PROCESSORS: readonly DataProcessorItem[] = [
  {
    id: "hosting-and-security",
    processor: {
      en: "Hosting, network security, and bot protection",
      es: "Alojamiento web, seguridad y protección antibots",
    },
    role: {
      en: "Website hosting, traffic security, abuse and spam protection on forms and chat, and approximate country-level region detection on newsletter sign-up.",
      es: "Alojamiento del sitio web, seguridad del tráfico, protección frente a abusos y spam en formularios y chat y detección aproximada del país al suscribirse al boletín.",
    },
    dataProcessed: {
      en: "IP address, anti-bot verification signals, temporary abuse-prevention counters, and approximate country on newsletter sign-up.",
      es: "Dirección IP, señales de verificación antibots, contadores temporales de prevención de abusos y país aproximado al suscribirse al boletín.",
    },
    locationAndSafeguard: {
      en: "EU / US and global network (European Commission Standard Contractual Clauses and applicable transfer frameworks).",
      es: "UE / EE. UU. y red global (Cláusulas Contractuales Tipo de la Comisión Europea y garantías aplicables).",
    },
  },
  {
    id: "assistant-inference",
    processor: {
      en: "Website Assistant responses",
      es: "Respuestas del asistente del sitio web",
    },
    role: {
      en: "Generates informational answers inside the Website Assistant chat drawer.",
      es: "Genera respuestas informativas dentro del asistente del sitio web.",
    },
    dataProcessed: {
      en: "Your chat question, recent messages in the active conversation, current page context, and chosen language.",
      es: "Su consulta en el chat, los mensajes recientes de la conversación activa, el contexto de la página actual y el idioma seleccionado.",
    },
    locationAndSafeguard: {
      en: "EU / US cloud infrastructure (Standard Contractual Clauses; transient processing only, no model training on visitor chats).",
      es: "Infraestructura en la nube UE / EE. UU. (Cláusulas Contractuales Tipo; tratamiento transitorio sin entrenamiento de modelos con sus consultas).",
    },
  },
  {
    id: "transactional-email",
    processor: {
      en: "Transactional email delivery",
      es: "Envío de correos transaccionales",
    },
    role: {
      en: "Delivers Product Brief, Book a Call, and Contact messages, uploaded files, and email confirmations.",
      es: "Envía los mensajes, archivos adjuntos y correos de confirmación de briefings de producto, reservas de llamada y contacto.",
    },
    dataProcessed: {
      en: "Form contact details, project notes, reference URLs, and up to 3 uploaded Product Brief files (JPG, PNG, WebP, or PDF up to 10 MB total).",
      es: "Datos de contacto del formulario, notas del proyecto, enlaces de referencia y hasta 3 archivos adjuntos del briefing de producto (JPG, PNG, WebP o PDF hasta 10 MB en total).",
    },
    locationAndSafeguard: {
      en: "EU / US infrastructure (Standard Contractual Clauses).",
      es: "Infraestructura en UE / EE. UU. (Cláusulas Contractuales Tipo).",
    },
  },
  {
    id: "newsletter-provider",
    processor: {
      en: "Newsletter delivery and consent-gated attribution",
      es: "Envío de boletines y atribución sujeta a consentimiento",
    },
    role: {
      en: "Sends biweekly Stories on explicit opt-in, records aggregate delivery and engagement totals, and logs optional referral attribution only when you accept optional cookies.",
      es: "Envía las Historias quincenales previo consentimiento expreso, registra totales agregados de entrega e interacción y guarda referencias de campaña únicamente cuando usted acepta las cookies opcionales.",
    },
    dataProcessed: {
      en: "Subscriber email, language, consent timestamp, approximate country, chosen topic, aggregate engagement counts, and consent-gated referral details.",
      es: "Correo electrónico del suscriptor, idioma, fecha de consentimiento, país aproximado, tema elegido, estadísticas agregadas de interacción y referencias sujetas a consentimiento.",
    },
    locationAndSafeguard: {
      en: "European Union infrastructure subject to EU GDPR and contractual sub-processor safeguards.",
      es: "Infraestructura en la Unión Europea sujeta al RGPD y a garantías contractuales con subencargados.",
    },
  },
  {
    id: "video-scheduling",
    processor: {
      en: "Video call scheduling and meetings",
      es: "Reserva de videollamadas y reuniones",
    },
    role: {
      en: "Confirms open call times on the Book a Call page and creates video meeting links.",
      es: "Confirma la disponibilidad horaria en la página de reserva de llamadas y genera los enlaces de videollamada.",
    },
    dataProcessed: {
      en: "Attendee name, email address, timezone, preferred call language, company name, meeting notes, and referral campaign label when accepted.",
      es: "Nombre del asistente, correo electrónico, zona horaria, idioma preferido de la llamada, empresa, notas de la reunión y parámetro de campaña cuando haya sido aceptado.",
    },
    locationAndSafeguard: {
      en: "EU / US infrastructure (Standard Contractual Clauses and applicable transfer frameworks).",
      es: "Infraestructura en UE / EE. UU. (Cláusulas Contractuales Tipo y garantías aplicables).",
    },
  },
  {
    id: "editorial-hosting",
    processor: {
      en: "Editorial content and media hosting",
      es: "Alojamiento de contenidos editoriales e imágenes",
    },
    role: {
      en: "Serves Stories text and photography, plus anonymous aggregate newsletter totals.",
      es: "Sirve los textos y fotografías de Historias, además de totales agregados anónimos del boletín.",
    },
    dataProcessed: {
      en: "Standard web content and image requests, plus anonymous aggregate delivery, open, and click totals.",
      es: "Peticiones técnicas estándar de carga de imágenes y contenidos, además de totales agregados anónimos de entrega, apertura y clics.",
    },
    locationAndSafeguard: {
      en: "EU / US cloud infrastructure (Standard Contractual Clauses).",
      es: "Infraestructura en la nube UE / EE. UU. (Cláusulas Contractuales Tipo).",
    },
  },
];
