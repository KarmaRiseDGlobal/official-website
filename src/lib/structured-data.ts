import "server-only";

import { ABOUT_FAQS, ABOUT_LAST_REVIEWED } from "@/data/about-content";
import {
  BOOK_CALL_FAQS,
  CONTACT_DEPARTMENTS,
  PRODUCT_BRIEF_POST_STEPS,
} from "@/data/conversion-content";
import { HOME_CAPABILITIES, HOME_FAQS } from "@/data/home-content";
import {
  HOW_WE_WORK_FAQS,
  HOW_WE_WORK_LAST_REVIEWED,
  HOW_WE_WORK_STEPS,
} from "@/data/how-we-work-content";
import {
  MANUFACTURING_CATEGORIES,
  MANUFACTURING_FAQS,
  MANUFACTURING_LAST_REVIEWED,
  MANUFACTURING_STAGES,
} from "@/data/manufacturing-content";
import {
  getLocalizedStory,
  type StoryEntry,
  type StorySummary,
} from "@/data/story-types";
import { localizePath, siteUrl, type SiteLanguage } from "@/lib/urls";

export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

function buildOrganizationNode(lang: SiteLanguage): Record<string, unknown> {
  const isEs = lang === "es";
  const organizationId = `${siteUrl}/#organization`;

  return {
    "@type": "Organization",
    "@id": organizationId,
    name: "KarmaRise D Global",
    alternateName: "KarmaRise",
    legalName: "Karmarise Global LLP",
    url: siteUrl,
    logo: {
      "@type": "ImageObject",
      url: `${siteUrl}/brand/main-logo-transparent.png`,
      width: 701,
      height: 815,
    },
    foundingDate: "2025-05-15",
    description: isEs
      ? "KarmaRise D Global desarrolla y fabrica bolsos de piel y otros artículos de piel, ropa en tejidos naturales y variados, complementos confeccionados a medida y decoración del hogar en unidades de producción auditadas de la India (Calcuta, Kanpur, Agra y Chennai, supervisados desde Maharashtra) para comercios y marcas de España y el resto de Europa."
      : "KarmaRise D Global develops and manufactures own-brand leather bags and other leather goods, clothing in natural and varied fabrics, custom sewn accessories, and home decor across vetted production units in India (Kolkata, Kanpur, Agra, and Chennai, overseen from Maharashtra) for shops and brands in Spain and the rest of Europe.",
    founder: [
      {
        "@type": "Person",
        name: "Alma",
        jobTitle: isEs
          ? "Cofundadora, desarrollo de producto y relación con clientes en España y el resto de Europa"
          : "Co-founder, client alignment and product development across Spain and the rest of Europe",
        knowsLanguage: ["es", "en", "pt"],
      },
      {
        "@type": "Person",
        name: "Shirish",
        jobTitle: isEs
          ? "Cofundador, abogado colegiado en el Bar Council de la India y dirección de operaciones sobre el terreno"
          : "Co-founder, registered Bar Council advocate in India and operations lead",
        knowsLanguage: ["en", "mr", "hi"],
      },
    ],
    areaServed: [
      {
        "@type": "Country",
        name: isEs ? "España" : "Spain",
      },
      {
        "@type": "Place",
        name: isEs ? "Europa" : "Europe",
      },
    ],
    knowsLanguage: ["es", "en", "pt"],
    knowsAbout: isEs
      ? [
          "Estudio de producto y viabilidad de fabricación en la India",
          "Diseño y desarrollo ergonómico de producto para marcas europeas",
          "Fabricación de ropa en tejidos naturales y variados en la India",
          "Fabricación de bolsos de piel y marroquinería en la India",
          "Decoración del hogar y complementos confeccionados a medida",
          "Unidades de producción familiares y colectivos de artesanas en la India",
          "Control de calidad sobre muestra física y exportación a la UE",
        ]
      : [
          "Product study and manufacturing feasibility in India",
          "Product design and ergonomic development for European brands",
          "Private-label clothing manufacturing in natural and varied fabrics in India",
          "Leather bag and small leather goods manufacturing in India",
          "Own-brand home decor and custom sewn accessories",
          "Vetted family-run production units and women artisan collectives in India",
          "Physical sample review, on-site quality supervision, and EU export delivery",
        ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: isEs
          ? "Consultas comerciales en España y el resto de Europa"
          : "Client enquiries in Spain and the rest of Europe",
        email: "hola@karmarisedglobal.com",
        telephone: "+34-611-722-276",
        availableLanguage: ["es", "en", "pt"],
        areaServed: ["ES", "EU"],
      },
      {
        "@type": "ContactPoint",
        contactType: isEs
          ? "Operaciones y unidades de producción en la India"
          : "Operations and Manufacturing Partners in India",
        email: "namaste@karmarisedglobal.com",
        telephone: "+91-8530009798",
        availableLanguage: ["en", "es"],
        areaServed: "IN",
      },
    ],
  };
}

export function getHomeStructuredData(
  lang: SiteLanguage,
): Record<string, unknown> {
  const isEs = lang === "es";
  const pageUrl =
    lang === "es" ? `${siteUrl}${localizePath("/", "es")}` : siteUrl;
  const pageIdBase = lang === "es" ? `${siteUrl}/es` : `${siteUrl}/`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const serviceId = `${pageIdBase}#manufacturing-service`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(lang),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "KarmaRise D Global",
        alternateName: "KarmaRise",
        url: siteUrl,
        inLanguage: ["en-GB", "es-ES"],
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageIdBase}#webpage`,
        url: pageUrl,
        name: isEs
          ? "Fabricación de marca propia en la India | KarmaRise"
          : "Own-brand manufacturing in India | KarmaRise D Global",
        description: isEs
          ? "Fabrica en la India tus bolsos de piel, ropa, complementos y decoración del hogar con Alma y Shirish sobre el terreno. Muestra física primero. Empieza hoy."
          : "Manufacture own-brand leather bags, clothing, sewn accessories, and home decor in India with Alma and Shirish on site. Samples first. Start your brief.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": serviceId,
        },
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: isEs
          ? "Programa de producción de bolsos de piel, ropa, complementos y decoración del hogar en la India"
          : "Own-brand leather goods, clothing, sewn accessories, and home decor Manufacturing Programme in India",
        serviceType: isEs
          ? "Fabricación gestionada de marca propia en la India"
          : "Managed own-brand product development and manufacturing in India",
        description: isEs
          ? "Servicio integral de desarrollo y fabricación de bolsos de piel, prendas en diversos tejidos, complementos confeccionados y decoración del hogar en unidades de producción auditadas de la India para marcas y comercios de España y el resto de Europa. Cada proyecto se valora a medida según el briefing de producto."
          : "End-to-end own-brand development and manufacturing of leather goods, clothing in natural and varied fabrics, custom sewn accessories, and home decor across audited Indian production units for brands and shops in Spain and the rest of Europe. Each programme is scoped individually per Product Brief.",
        provider: {
          "@id": organizationId,
        },
        areaServed: [
          {
            "@type": "Country",
            name: isEs ? "España" : "Spain",
          },
          {
            "@type": "Place",
            name: isEs ? "Europa" : "Europe",
          },
        ],
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${siteUrl}${localizePath("/product-brief", lang)}`,
          availableLanguage: ["es", "en", "pt"],
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: isEs
            ? "Categorías de fabricación en la India"
            : "Manufacturing categories in India",
          itemListElement: HOME_CAPABILITIES.map((capability) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: capability.title[lang],
              description: capability.summary[lang],
            },
          })),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${pageIdBase}#faq`,
        url: pageUrl,
        inLanguage: isEs ? "es-ES" : "en-GB",
        mainEntity: HOME_FAQS.map((item) => ({
          "@type": "Question",
          name: item.question[lang],
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer[lang],
          },
        })),
      },
    ],
  };
}

export function getManufacturingProgrammeStructuredData(
  lang: SiteLanguage,
): Record<string, unknown> {
  const isEs = lang === "es";
  const homeUrl =
    lang === "es" ? `${siteUrl}${localizePath("/", "es")}` : siteUrl;
  const pageUrl = `${siteUrl}${localizePath("/manufacturing", lang)}`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const serviceId = `${pageUrl}#service`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const howToId = `${pageUrl}#process`;
  const faqId = `${pageUrl}#faq`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(lang),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "KarmaRise D Global",
        alternateName: "KarmaRise",
        url: siteUrl,
        inLanguage: ["en-GB", "es-ES"],
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: isEs
          ? "Estudio de producto, diseño y fabricación gestionada en la India para marcas europeas"
          : "Product study, design, and managed manufacturing across India for European brands",
        description: isEs
          ? "Diseña y fabrica bolsos de piel, ropa, complementos y decoración del hogar en la India. Unidades auditadas, muestra física y entrega en tu negocio."
          : "Develop own-brand leather goods, clothing, sewn accessories, and home decor in India. Product study, vetted production units, samples, and EU delivery.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        dateModified: MANUFACTURING_LAST_REVIEWED.iso,
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": serviceId,
        },
        breadcrumb: {
          "@id": breadcrumbId,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEs ? "Inicio" : "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isEs ? "Fabricación" : "Manufacturing",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "Service",
        "@id": serviceId,
        name: isEs
          ? "Estudio de producto, diseño y Programa de producción en la India"
          : "Product study, design, and managed Manufacturing Programme in India",
        serviceType: isEs
          ? "Desarrollo de producto y fabricación gestionada con unidades de producción y artesanos en la India"
          : "Product development, design study, and managed manufacturing with vetted Indian production units and artisans",
        description: isEs
          ? "Servicio integral de estudio de producto, diseño ergonómico, búsqueda de materiales, auditoría presencial de unidades de producción, fábricas de corte familiar y colectivos de artesanas en la India, muestras para valoración y entrega en España y el resto de Europa."
          : "End-to-end product study, ergonomic design refinement, material sourcing, in-person vetting of production units, family-run factories, and women artisan collectives across India, reviewed physical sampling, and EU export delivery.",
        provider: {
          "@id": organizationId,
        },
        areaServed: [
          {
            "@type": "Country",
            name: isEs ? "España" : "Spain",
          },
          {
            "@type": "Place",
            name: isEs ? "Europa" : "Europe",
          },
        ],
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: `${siteUrl}${localizePath("/product-brief", lang)}`,
          availableLanguage: ["es", "en", "pt"],
        },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: isEs
            ? "Servicios y categorías del Programa de producción en la India"
            : "Manufacturing Programme services and categories in India",
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: isEs
                  ? "Estudio de producto, viabilidad y diseño ergonómico"
                  : "Product study, regional feasibility, and ergonomic design",
                description: isEs
                  ? "Evaluación comercial y ergonómica, selección de materiales y regiones especialistas, briefing de producto por escrito con retal físico de color y planificación de etiquetado europeo."
                  : "Commercial and ergonomic review, regional craft feasibility check, written Product Brief with physical colour swatch, and EU labelling and customs planning.",
              },
            },
            ...MANUFACTURING_CATEGORIES.map((category) => ({
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: category.name[lang],
                description: `${category.summary[lang]} ${category.details[lang]}`,
              },
            })),
          ],
        },
      },
      {
        "@type": "HowTo",
        "@id": howToId,
        name: isEs
          ? "Cómo fabricar tu propia colección en la India para España y el resto de Europa en seis fases"
          : "How to develop and manufacture own-brand products in India for Europe in six stages",
        description: isEs
          ? "Proceso paso a paso desde el briefing de producto y el estudio de viabilidad hasta la aprobación de muestras físicas, la supervisión en planta y la entrega en Europa."
          : "Step-by-step process from Product Brief and feasibility study through physical sample sign-off, on-site production supervision, and European export delivery.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        step: MANUFACTURING_STAGES.map((stage, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: stage.title[lang],
          text: stage.body[lang],
          url: `${pageUrl}#stage-${stage.id}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: pageUrl,
        inLanguage: isEs ? "es-ES" : "en-GB",
        mainEntity: MANUFACTURING_FAQS.map((item) => ({
          "@type": "Question",
          name: item.question[lang],
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer[lang],
          },
        })),
      },
    ],
  };
}

export function getHowWeWorkStructuredData(
  lang: SiteLanguage,
): Record<string, unknown> {
  const isEs = lang === "es";
  const homeUrl =
    lang === "es" ? `${siteUrl}${localizePath("/", "es")}` : siteUrl;
  const pageUrl = `${siteUrl}${localizePath("/how-we-work", lang)}`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const howToId = `${pageUrl}#workflow`;
  const faqId = `${pageUrl}#faq`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(lang),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "KarmaRise D Global",
        alternateName: "KarmaRise",
        url: siteUrl,
        inLanguage: ["en-GB", "es-ES"],
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: isEs
          ? "Crea tu propia colección en la India, con dos fundadores sobre el terreno"
          : "Make your own collection in India, with two founders on the ground",
        description: isEs
          ? "Descubre cómo Alma y Shirish dirigen tu producción en la India: conclusiones de reunión, muestras de color, revisión previa, control en planta y envío."
          : "See how Alma and Shirish manage India manufacturing for Europe: call conclusions, physical colour swatches, reviewed samples, on-site checks, and EU delivery.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        dateModified: HOW_WE_WORK_LAST_REVIEWED.iso,
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": organizationId,
        },
        breadcrumb: {
          "@id": breadcrumbId,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEs ? "Inicio" : "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isEs ? "Cómo trabajamos" : "How we work",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "HowTo",
        "@id": howToId,
        name: isEs
          ? "Cómo coordinar fabricación en la India desde España y el resto de Europa sin viajar en cada fase"
          : "How to coordinate Indian manufacturing from Spain and the rest of Europe without flying out for every revision",
        description: isEs
          ? "Flujo de trabajo en cinco pasos entre tu comercio o marca en Europa, Alma y Shirish, y las unidades de producción en la India."
          : "Five-step operating workflow connecting European brands and shops with Alma, Shirish, and vetted production units across India.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        step: HOW_WE_WORK_STEPS.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.name[lang],
          text: step.text[lang],
          url: `${pageUrl}${step.anchor}`,
        })),
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: pageUrl,
        inLanguage: isEs ? "es-ES" : "en-GB",
        mainEntity: HOW_WE_WORK_FAQS.map((item) => ({
          "@type": "Question",
          name: item.question[lang],
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer[lang],
          },
        })),
      },
    ],
  };
}

export function getAboutStructuredData(
  lang: SiteLanguage,
): Record<string, unknown> {
  const isEs = lang === "es";
  const homeUrl =
    lang === "es" ? `${siteUrl}${localizePath("/", "es")}` : siteUrl;
  const pageUrl = `${siteUrl}${localizePath("/about", lang)}`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const almaId = `${siteUrl}/#alma`;
  const shirishId = `${siteUrl}/#shirish`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const faqId = `${pageUrl}#faq`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...buildOrganizationNode(lang),
        founder: [{ "@id": almaId }, { "@id": shirishId }],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "KarmaRise D Global",
        alternateName: "KarmaRise",
        url: siteUrl,
        inLanguage: ["en-GB", "es-ES"],
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "Person",
        "@id": almaId,
        name: "Alma",
        url: `${pageUrl}#alma`,
        image: `${siteUrl}/images/founders/alma-spain-hillside-portrait.jpeg`,
        jobTitle: isEs
          ? "Cofundadora, desarrollo de producto y relación con clientes en España y el resto de Europa"
          : "Co-founder, client alignment and product development across Spain and the rest of Europe",
        description: isEs
          ? "Empresaria española que trabaja entre España y la India, guía a clientes europeos, audita unidades de producción y fábricas de corte familiar junto a Shirish y dirige AlmaRise D Brand."
          : "Spanish business owner working between Spain and India who guides European Clients, audits production units and family-run factories with Shirish, and directs AlmaRise D Brand.",
        knowsLanguage: ["es", "en", "pt"],
        knowsAbout: isEs
          ? [
              "Desarrollo y ergonomía de producto para comercios y marcas europeas",
              "Auditoría de unidades de producción, fábricas de corte familiar y colectivos de artesanas en la India",
              "AlmaRise D Reborn, AlmaRise D Organic y decoración del hogar",
            ]
          : [
              "Retail product development and ergonomics for European shops and brands",
              "Auditing production units, family-run factories, and women artisan collectives in India",
              "AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor",
            ],
        worksFor: {
          "@id": organizationId,
        },
      },
      {
        "@type": "Person",
        "@id": shirishId,
        name: "Shirish",
        url: `${pageUrl}#shirish`,
        image: `${siteUrl}/images/founders/shirish-co-founder-office-india.jpeg`,
        jobTitle: isEs
          ? "Cofundador, abogado colegiado en el Bar Council de la India y dirección de operaciones sobre el terreno"
          : "Co-founder, registered Bar Council advocate in India and operations lead",
        description: isEs
          ? "Abogado colegiado en el Bar Council de la India que redacta acuerdos con fábricas colaboradoras, audita unidades de producción en toda la India y supervisa producción y exportación."
          : "Registered Bar Council advocate in India who structures Indian supplier contracts, audits specialist production hubs across India, and supervises production and export dispatch.",
        knowsLanguage: ["en", "mr", "hi"],
        knowsAbout: isEs
          ? [
              "Contratos con unidades de producción bajo legislación india",
              "Auditoría de regiones especialistas de piel, confección y decoración en la India",
              "Control de calidad sobre muestra física y exportación a la UE",
            ]
          : [
              "Supplier contracts and legal compliance under Indian law",
              "Auditing specialist leather, garment, and home decor clusters across India",
              "Physical sample verification and EU export logistics",
            ],
        worksFor: {
          "@id": organizationId,
        },
      },
      {
        "@type": "AboutPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: isEs
          ? "Conoce a Alma y Shirish, los fundadores de KarmaRise D Global"
          : "Meet Alma and Shirish, the founders behind KarmaRise D Global",
        description: isEs
          ? "Conoce a Alma en España y a Shirish, abogado del Bar Council en la India, fundadores de KarmaRise D Global (Karmarise Global LLP). Pide llamada o briefing."
          : "Meet Alma in Spain and Bar Council advocate Shirish in India, founders of KarmaRise D Global (Karmarise Global LLP). Book a free call or send your brief.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        dateModified: ABOUT_LAST_REVIEWED.iso,
        isPartOf: {
          "@id": websiteId,
        },
        mainEntity: {
          "@id": organizationId,
        },
        about: {
          "@id": organizationId,
        },
        breadcrumb: {
          "@id": breadcrumbId,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEs ? "Inicio" : "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isEs ? "Quiénes somos" : "About",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: pageUrl,
        inLanguage: isEs ? "es-ES" : "en-GB",
        mainEntity: ABOUT_FAQS.map((item) => ({
          "@type": "Question",
          name: item.question[lang],
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer[lang],
          },
        })),
      },
    ],
  };
}

export function getAlmariseStructuredData(
  lang: SiteLanguage,
): Record<string, unknown> {
  const isEs = lang === "es";
  const homeUrl =
    lang === "es" ? `${siteUrl}${localizePath("/", "es")}` : siteUrl;
  const pageUrl = `${siteUrl}${localizePath("/almarise", lang)}`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const brandId = `${siteUrl}/almarise#brand`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(lang),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "KarmaRise D Global",
        alternateName: "KarmaRise",
        url: siteUrl,
        inLanguage: ["en-GB", "es-ES"],
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "Brand",
        "@id": brandId,
        name: "AlmaRise D Brand",
        url: pageUrl,
        logo: {
          "@type": "ImageObject",
          url: `${siteUrl}/brand/main-logo-transparent.png`,
          width: 701,
          height: 815,
        },
        description: isEs
          ? "AlmaRise D Brand es la marca propia de moda sostenible y decoración del hogar de KarmaRise D Global, con AlmaRise D Reborn (prendas únicas a partir de saris que mujeres indias han guardado con una historia que contar), AlmaRise D Organic (tintes orgánicos y tejidos de residuos de caña de azúcar, naranja, plátano y piña, entre otros) y decoración del hogar."
          : "AlmaRise D Brand is the owned sustainable fashion and home decor brand of KarmaRise D Global, spanning AlmaRise D Reborn (one-of-a-kind everyday garments tailored from kept Indian sarees with a story), AlmaRise D Organic (organic dyes and plant-waste fabrics from sugarcane, orange, banana, and pineapple, among others), and AlmaRise D Home Decor.",
        slogan: isEs
          ? "Saris con historia, tejidos vegetales y piezas para el hogar desde la India."
          : "Kept sarees, organic plant-waste textiles, and crafted home decor from India.",
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: isEs
          ? "AlmaRise D Brand: D Reborn, D Organic y hogar | KarmaRise"
          : "AlmaRise D Brand: D Reborn, D Organic & Decor | KarmaRise",
        description: isEs
          ? "AlmaRise D Brand de KarmaRise D Global: prendas AlmaRise D Reborn de saris, tejidos AlmaRise D Organic y decoración del hogar para España y el resto de Europa."
          : "AlmaRise D Brand by KarmaRise D Global: AlmaRise D Reborn sarees, AlmaRise D Organic fabrics, and D Home Decor, made in India for Spain and the rest of Europe.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        dateModified: "2026-11-24",
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": brandId,
        },
        mainEntity: {
          "@id": brandId,
        },
        breadcrumb: {
          "@id": breadcrumbId,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEs ? "Inicio" : "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "AlmaRise D Brand",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function getProductBriefStructuredData(
  lang: SiteLanguage,
): Record<string, unknown> {
  const isEs = lang === "es";
  const homeUrl =
    lang === "es" ? `${siteUrl}${localizePath("/", "es")}` : siteUrl;
  const pageUrl = `${siteUrl}${localizePath("/product-brief", lang)}`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const howToId = `${pageUrl}#after-submission`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(lang),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "KarmaRise D Global",
        alternateName: "KarmaRise",
        url: siteUrl,
        inLanguage: ["en-GB", "es-ES"],
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: isEs
          ? "Empieza tu briefing de producto para la India"
          : "Start your Product Brief for India",
        description: isEs
          ? "Comparte tu briefing de producto en 3 pasos para valorar bolsos de piel, ropa o complementos en la India. Alma responde en 1 o 2 días laborables."
          : "Share your Product Brief in 3 quick steps to scope own-brand leather bags, clothing, or custom sewn goods in India. Alma replies within 1–2 business days.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": organizationId,
        },
        breadcrumb: {
          "@id": breadcrumbId,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEs ? "Inicio" : "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isEs ? "Briefing de producto" : "Start a Product Brief",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "HowTo",
        "@id": howToId,
        name: isEs
          ? "Qué pasa a continuación tras enviar tu briefing de producto"
          : "What happens next after sending your Product Brief",
        description: isEs
          ? "Cuatro pasos desde la lectura personal por Alma en 1 o 2 días laborables hasta la propuesta y el muestreo físico en la India."
          : "Four steps from Alma's personal review within 1–2 business days through proposal and physical sampling in India.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        step: PRODUCT_BRIEF_POST_STEPS.map((step, index) => ({
          "@type": "HowToStep",
          position: index + 1,
          name: step.title[lang],
          text: step.body[lang],
          url: `${pageUrl}#after-submission`,
        })),
      },
    ],
  };
}

export function getBookACallStructuredData(
  lang: SiteLanguage,
): Record<string, unknown> {
  const isEs = lang === "es";
  const homeUrl =
    lang === "es" ? `${siteUrl}${localizePath("/", "es")}` : siteUrl;
  const pageUrl = `${siteUrl}${localizePath("/book-a-call", lang)}`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const faqId = `${pageUrl}#faq`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(lang),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "KarmaRise D Global",
        alternateName: "KarmaRise",
        url: siteUrl,
        inLanguage: ["en-GB", "es-ES"],
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: isEs
          ? "Hablemos sobre tu idea de producto"
          : "Let's talk through your product idea",
        description: isEs
          ? "Reserva una videollamada gratuita de 15 o 30 min por Google Meet con Alma en español, inglés o portugués para hablar de tu briefing de producto en la India."
          : "Book a free 15-min or 30-min Google Meet call with Alma in English, Spanish, or Portuguese to discuss your Product Brief and manufacturing in India.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": organizationId,
        },
        breadcrumb: {
          "@id": breadcrumbId,
        },
        potentialAction: {
          "@type": "ScheduleAction",
          name: isEs
            ? "Reservar videollamada por Google Meet"
            : "Schedule a Google Meet video call",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${pageUrl}?duration=15`,
            inLanguage: ["es", "en", "pt"],
            actionPlatform: [
              "https://schema.org/DesktopWebPlatform",
              "https://schema.org/MobileWebPlatform",
            ],
          },
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEs ? "Inicio" : "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isEs ? "Reservar videollamada" : "Book a video call",
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        url: pageUrl,
        inLanguage: isEs ? "es-ES" : "en-GB",
        mainEntity: BOOK_CALL_FAQS.map((item) => ({
          "@type": "Question",
          name: item.question[lang],
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer[lang],
          },
        })),
      },
    ],
  };
}

export function getContactStructuredData(
  lang: SiteLanguage,
): Record<string, unknown> {
  const isEs = lang === "es";
  const homeUrl =
    lang === "es" ? `${siteUrl}${localizePath("/", "es")}` : siteUrl;
  const pageUrl = `${siteUrl}${localizePath("/contact", lang)}`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  const baseOrganization = buildOrganizationNode(lang);
  const existingContactPoints = Array.isArray(baseOrganization.contactPoint)
    ? baseOrganization.contactPoint
    : [];

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...baseOrganization,
        address: {
          "@type": "PostalAddress",
          streetAddress: "2nd floor, Guru Charan Apartment",
          addressLocality: "Ulhasnagar",
          addressRegion: "Maharashtra",
          postalCode: "421002",
          addressCountry: "IN",
        },
        contactPoint: [
          ...existingContactPoints,
          ...CONTACT_DEPARTMENTS.map((dept) => ({
            "@type": "ContactPoint",
            contactType: dept.role[lang],
            email: dept.email,
            availableLanguage: ["es", "en", "pt"],
            areaServed: dept.areaServed,
          })),
          {
            "@type": "ContactPoint",
            contactType: isEs
              ? "Facturación y documentación GST"
              : "Billing, invoicing & GST",
            email: "accounts@karmarisedglobal.com",
            availableLanguage: ["en", "es"],
          },
          {
            "@type": "ContactPoint",
            contactType: isEs
              ? "Privacidad, soporte y reclamaciones"
              : "Support, privacy & Grievance Officer",
            email: "support@karmarisedglobal.com",
            availableLanguage: ["en", "es"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "KarmaRise D Global",
        alternateName: "KarmaRise",
        url: siteUrl,
        inLanguage: ["en-GB", "es-ES"],
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "ContactPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: isEs
          ? "Habla con Alma y Shirish"
          : "Say hello to Alma and Shirish",
        description: isEs
          ? "Contacta con KarmaRise D Global en español o inglés para Programas de producción, unidades en la India, AlmaRise D Brand o consultas generales."
          : "Contact KarmaRise D Global (Karmarise Global LLP) in Spain and India in English or Spanish for Manufacturing Programmes, partners, or AlmaRise D Brand.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        isPartOf: {
          "@id": websiteId,
        },
        mainEntity: {
          "@id": organizationId,
        },
        breadcrumb: {
          "@id": breadcrumbId,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEs ? "Inicio" : "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isEs ? "Contacto" : "Contact",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

function toAbsoluteAssetUrl(rawUrl: string | undefined): string {
  if (!rawUrl?.trim()) {
    return `${siteUrl}/opengraph-image.jpg`;
  }
  const trimmed = rawUrl.trim();
  if (/^https?:\/\//i.test(trimmed)) {
    return trimmed;
  }
  const encodedPath = encodeURI(trimmed)
    .replace(/\(/g, "%28")
    .replace(/\)/g, "%29");
  return `${siteUrl}${encodedPath.startsWith("/") ? encodedPath : `/${encodedPath}`}`;
}

function buildFounderNode(
  founder: "alma" | "shirish",
  lang: SiteLanguage,
): Record<string, unknown> {
  const isEs = lang === "es";
  const aboutUrl = `${siteUrl}${localizePath("/about", lang)}`;
  const organizationId = `${siteUrl}/#organization`;

  if (founder === "alma") {
    return {
      "@type": "Person",
      "@id": `${siteUrl}/#alma`,
      name: "Alma",
      url: `${aboutUrl}#alma`,
      image: `${siteUrl}/images/founders/alma-spain-hillside-portrait.jpeg`,
      jobTitle: isEs
        ? "Cofundadora, desarrollo de producto y relación con clientes en España y el resto de Europa"
        : "Co-founder, client alignment and product development across Spain and the rest of Europe",
      description: isEs
        ? "Empresaria española que trabaja entre España y la India, guía a clientes europeos, audita unidades de producción y fábricas de corte familiar junto a Shirish y dirige AlmaRise D Brand."
        : "Spanish business owner working between Spain and India who guides European Clients, audits production units and family-run factories with Shirish, and directs AlmaRise D Brand.",
      knowsLanguage: ["es", "en", "pt"],
      worksFor: { "@id": organizationId },
    };
  }

  return {
    "@type": "Person",
    "@id": `${siteUrl}/#shirish`,
    name: "Shirish",
    url: `${aboutUrl}#shirish`,
    image: `${siteUrl}/images/founders/shirish-co-founder-office-india.jpeg`,
    jobTitle: isEs
      ? "Cofundador, abogado colegiado en el Bar Council de la India y dirección de operaciones sobre el terreno"
      : "Co-founder, registered Bar Council advocate in India and operations lead",
    description: isEs
      ? "Abogado colegiado en el Bar Council de la India que redacta acuerdos con fábricas colaboradoras, audita unidades de producción en toda la India y supervisa producción y exportación."
      : "Registered Bar Council advocate in India who structures Indian supplier contracts, audits specialist production hubs across India, and supervises production and export dispatch.",
    knowsLanguage: ["en", "mr", "hi"],
    worksFor: { "@id": organizationId },
  };
}

function stripInlineMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

function countStoryWords(story: StoryEntry, lang: SiteLanguage): number {
  const localized = getLocalizedStory(story, lang);
  const chunks: string[] = [localized.title, localized.summary];

  const activeBody =
    lang === "es"
      ? story.spanishBody && story.spanishBody.length > 0
        ? story.spanishBody
        : story.language === "es" &&
            (!story.spanishSections || story.spanishSections.length === 0)
          ? story.body
          : undefined
      : story.body;

  if (activeBody && activeBody.length > 0) {
    for (const block of activeBody) {
      if (block._type === "block") {
        chunks.push(block.children.map((span) => span.text).join(" "));
      } else if (block._type === "pullQuoteBlock") {
        chunks.push(block.text);
      }
    }
  } else {
    for (const section of localized.sections) {
      chunks.push(
        section.heading,
        ...section.paragraphs.map(stripInlineMarkdownLinks),
      );
    }
  }

  if (localized.takeaway) {
    chunks.push(localized.takeaway);
  }

  return chunks.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

export function getStoriesIndexStructuredData(
  lang: SiteLanguage,
  stories: readonly StorySummary[],
): Record<string, unknown> {
  const isEs = lang === "es";
  const homeUrl =
    lang === "es" ? `${siteUrl}${localizePath("/", "es")}` : siteUrl;
  const pageUrl = `${siteUrl}${localizePath("/stories", lang)}`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;
  const listId = `${pageUrl}#stories-list`;

  const latestIso = stories.reduce<string>((latest, entry) => {
    const candidate = entry.updatedAt || entry.publishedAt || "";
    return candidate > latest ? candidate : latest;
  }, "2026-11-24");

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(lang),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "KarmaRise D Global",
        alternateName: "KarmaRise",
        url: siteUrl,
        inLanguage: ["en-GB", "es-ES"],
        publisher: {
          "@id": organizationId,
        },
      },
      {
        "@type": "CollectionPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: isEs
          ? "Historias desde nuestros puntos de producción en la India y nuestra vida en España."
          : "Stories from our production sites in India and our life in Spain.",
        description: isEs
          ? "Historias de Alma y Shirish desde puntos de producción y marroquineros en la India, las líneas de AlmaRise D Brand y el día a día entre España y la India."
          : "First-person Stories by Alma and Shirish from Indian production sites, leather ateliers, AlmaRise D Reborn & D Organic, and shared tables in India and Spain.",
        inLanguage: isEs ? "es-ES" : "en-GB",
        dateModified: latestIso,
        isPartOf: {
          "@id": websiteId,
        },
        about: {
          "@id": organizationId,
        },
        mainEntity: {
          "@id": listId,
        },
        breadcrumb: {
          "@id": breadcrumbId,
        },
      },
      {
        "@type": "ItemList",
        "@id": listId,
        name: isEs
          ? "Historias de KarmaRise D Global"
          : "KarmaRise D Global Stories",
        numberOfItems: stories.length,
        itemListElement: stories.map((story, index) => {
          const localized = getLocalizedStory(story, lang);
          return {
            "@type": "ListItem",
            position: index + 1,
            url: `${siteUrl}${localizePath(`/stories/${story.slug}`, lang)}`,
            name: localized.title,
          };
        }),
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEs ? "Inicio" : "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isEs ? "Historias" : "Stories",
            item: pageUrl,
          },
        ],
      },
    ],
  };
}

export function getStoryDetailStructuredData(
  lang: SiteLanguage,
  story: StoryEntry,
): Record<string, unknown> {
  const isEs = lang === "es";
  const localized = getLocalizedStory(story, lang);
  const homeUrl =
    lang === "es" ? `${siteUrl}${localizePath("/", "es")}` : siteUrl;
  const storiesIndexUrl = `${siteUrl}${localizePath("/stories", lang)}`;
  const pageUrl = `${siteUrl}${localizePath(`/stories/${story.slug}`, lang)}`;
  const organizationId = `${siteUrl}/#organization`;
  const websiteId = `${siteUrl}/#website`;
  const breadcrumbId = `${pageUrl}#breadcrumb`;

  const mentionsAlma = /alma/i.test(story.author.name);
  const mentionsShirish = /shirish/i.test(story.author.name);
  const founderNodes: Array<Record<string, unknown>> = [];
  const authorRefs: Array<Record<string, unknown>> = [];

  if (mentionsAlma) {
    founderNodes.push(buildFounderNode("alma", lang));
    authorRefs.push({ "@id": `${siteUrl}/#alma` });
  }
  if (mentionsShirish) {
    founderNodes.push(buildFounderNode("shirish", lang));
    authorRefs.push({ "@id": `${siteUrl}/#shirish` });
  }
  if (authorRefs.length === 0) {
    authorRefs.push({
      "@type": "Person",
      name: story.author.name,
      jobTitle: localized.authorRole,
      worksFor: { "@id": organizationId },
    });
  }

  const wordCount = countStoryWords(story, lang);

  return {
    "@context": "https://schema.org",
    "@graph": [
      buildOrganizationNode(lang),
      {
        "@type": "WebSite",
        "@id": websiteId,
        name: "KarmaRise D Global",
        alternateName: "KarmaRise",
        url: siteUrl,
        inLanguage: ["en-GB", "es-ES"],
        publisher: {
          "@id": organizationId,
        },
      },
      ...founderNodes,
      {
        "@type": "Article",
        "@id": `${pageUrl}#article`,
        headline: localized.title,
        description: localized.summary,
        image: [toAbsoluteAssetUrl(localized.leadImage?.url)],
        datePublished: story.publishedAt,
        dateModified: story.updatedAt || story.publishedAt,
        inLanguage: isEs ? "es-ES" : "en-GB",
        articleSection: localized.categoryLabel,
        keywords: localized.tags,
        wordCount,
        author: authorRefs.length === 1 ? authorRefs[0] : authorRefs,
        publisher: {
          "@id": organizationId,
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": pageUrl,
        },
        isPartOf: {
          "@id": `${storiesIndexUrl}#webpage`,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": breadcrumbId,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: isEs ? "Inicio" : "Home",
            item: homeUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: isEs ? "Historias" : "Stories",
            item: storiesIndexUrl,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: localized.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };
}
