import type { NewsletterNarrator } from "@/lib/newsletter-tracks";

export type AutomatedSequenceFamily =
  "welcome" | "lead-followup" | "reengagement";

export interface AutomatedEmailLocaleCopy {
  templateName: string;
  subject: string;
  previewText: string;
  brandTitle: string;
  issueTag: string;
  heading: string;
  dateline: string;
  /** Safe Brevo Jinja greeting or plain text greeting when rendered outside Brevo. */
  greetingTemplate: string;
  greetingPreview: string;
  beforePhotoParagraphs: readonly string[];
  afterPhotoParagraphs?: readonly string[];
  heroImageAlt?: string;
  primaryCta?: {
    label: string;
    path: string;
    contentSlug: string;
    secondaryLabel?: string;
    secondaryPath?: string;
    secondaryContentSlug?: string;
  };
  replyPrompt?: {
    question: string;
    helper: string;
  };
  signoffLead: string;
  signoffName: string;
  signoffLocation: string;
  ps?: {
    text: string;
    ctaLabel?: string;
    ctaPath?: string;
    ctaContentSlug?: string;
  };
}

export interface AutomatedEmailTemplate {
  id: string;
  family: AutomatedSequenceFamily;
  stepNumber: number;
  sendTiming: string;
  narrator: NewsletterNarrator;
  campaignSlugBase: string;
  footerMode: "marketing" | "transactional";
  localHeroImage?: string;
  /** Optional Brevo env var override keys so existing Welcome templates (#3/#4) stay backwards-compatible. */
  envIdKeyEn?: string;
  envIdKeyEs?: string;
  goal: string;
  trigger: string;
  exitConditions: string;
  en: AutomatedEmailLocaleCopy;
  es: AutomatedEmailLocaleCopy;
}

export const automatedEmailTemplates: readonly AutomatedEmailTemplate[] = [
  // =========================================================================
  // SEQUENCE 1: AUTOMATED WELCOME SEQUENCE (5 EMAILS OVER 14 DAYS)
  // =========================================================================
  {
    id: "welcome-01",
    family: "welcome",
    stepNumber: 1,
    sendTiming: "Immediate (Day 0)",
    narrator: "both",
    campaignSlugBase: "welcome-01",
    footerMode: "marketing",
    localHeroImage: "/images/client/client 2.jpeg",
    envIdKeyEn: "BREVO_WELCOME_TEMPLATE_ID_EN",
    envIdKeyEs: "BREVO_WELCOME_TEMPLATE_ID_ES",
    goal: "Deliver a warm human welcome, set the biweekly expectation across all four KarmaRise categories and AlmaRise D Brand, and earn a genuine reply.",
    trigger:
      "Subscriber joins KarmaRise Stories (EN or ES) via /api/newsletter",
    exitConditions: "Unsubscribe or hard bounce",
    en: {
      templateName: "Welcome - KarmaRise Stories (EN)",
      subject: "Glad you are here · Alma & Shirish",
      previewText:
        "Welcome to KarmaRise Stories. Hit reply and tell us where you are reading from and what caught your eye.",
      brandTitle: "KarmaRise Stories",
      issueTag: "Welcome · Spain & India",
      heading: "Glad you are here.",
      dateline: "From Alma & Shirish · Our studio in India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hi {{ contact.FIRSTNAME }},{% else %}Hi there,{% endif %}",
      greetingPreview: "Hi there,",
      beforePhotoParagraphs: [
        "Seeing your email arrive here genuinely brightens our day. When Alma flew from Spain to India to build **KarmaRise D Global** alongside Shirish, we made one plain promise: tell the real story from the ground, with our own hands on the hides, fabrics, and stitching lines.",
        '{{ params.TRACK_NOTE | default:"Every two weeks you will receive one short letter signed by one of us, Alma or Shirish. We alternate real scenes from family-run factories and production units across India (leather goods, natural-fabric clothing, textile accessories, and textile home decor) with AlmaRise D Brand updates, everyday life between Spain and India, and honest progress on our planned Women\'s Training Initiative." }}',
      ],
      heroImageAlt:
        "Alma and Shirish smiling side by side while reviewing notes on a tablet at a desk in India",
      afterPhotoParagraphs: [
        "We keep our letters human and unhurried. You will hear from us when a physical sample reveals a small detail worth fixing, a production unit teaches us something concrete, a kept Indian saree turns into a new AlmaRise D Brand garment, or a shared meal reminds us how closely Spain and India connect.",
      ],
      replyPrompt: {
        question:
          "Before our next letter lands: where are you reading from, and what drew you to KarmaRise?",
        helper:
          "Hit reply right now. Every message comes straight to Alma and Shirish, and we answer each one ourselves.",
      },
      signoffLead: "Warmly,",
      signoffName: "Alma & Shirish",
      signoffLocation: "Spain · India",
      ps: {
        text: "If you feel like reading today, our first first-person Stories are live on the website, from three biryanis on Eid to splitting one leather bag collection across Indian states.",
        ctaLabel: "Read our first Stories",
        ctaPath: "/stories",
        ctaContentSlug: "ps-stories-cta",
      },
    },
    es: {
      templateName: "Bienvenida - Historias KarmaRise (ES)",
      subject: "Qué alegría tenerte por aquí · Alma y Shirish",
      previewText:
        "Te damos la bienvenida a Historias de KarmaRise. Respóndenos y cuéntanos desde dónde nos lees.",
      brandTitle: "Historias de KarmaRise",
      issueTag: "Bienvenida · España e India",
      heading: "Qué alegría tenerte por aquí.",
      dateline: "De Alma y Shirish · Desde nuestro estudio en la India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hola {{ contact.FIRSTNAME }},{% else %}Hola,{% endif %}",
      greetingPreview: "Hola,",
      beforePhotoParagraphs: [
        "Ver llegar tu correo a nuestra lista nos alegra el día de verdad. Cuando Alma voló desde España a la India para levantar **KarmaRise D Global** junto a Shirish, nos hicimos una promesa muy sencilla: contar cómo se trabaja aquí sobre el terreno, con nuestras propias manos en las pieles, los tejidos y los acabados.",
        '{{ params.TRACK_NOTE | default:"Cada dos semanas recibirás una carta breve firmada por uno de los dos, Alma o Shirish. Alternamos escenas reales desde fábricas de corte familiar y unidades de producción por toda la India (bolsos y artículos de piel, ropa de tejidos naturales, complementos y decoración textil del hogar) con relatos de AlmaRise D Brand, sobremesas entre España y la India y avances honestos de nuestra futura formación textil." }}',
      ],
      heroImageAlt:
        "Alma y Shirish sonriendo uno junto al otro mientras revisan notas en una tableta en una mesa en la India",
      afterPhotoParagraphs: [
        "Preferimos escribir despacio y con algo real que contarte. Te escribiremos cuando una muestra física saque a la luz un detalle que merece la pena mejorar, cuando una visita a planta nos deje una lección práctica o cuando un sari guardado cobre una segunda vida en AlmaRise D Brand.",
      ],
      replyPrompt: {
        question:
          "Antes de nuestra próxima carta: ¿desde dónde nos lees y qué te animó a apuntarte?",
        helper:
          "Dale a responder a este correo. Nos llega directo a Alma y a Shirish y contestamos personalmente a todo el mundo.",
      },
      signoffLead: "Un abrazo,",
      signoffName: "Alma y Shirish",
      signoffLocation: "España · India",
      ps: {
        text: "Si te apetece leer hoy mismo, ya tienes publicadas en la web nuestras primeras historias en primera persona, desde tres biryanis seguidos en Eid hasta cómo coordinamos un pedido de bolsos de piel entre varios estados de la India.",
        ctaLabel: "Leer nuestras primeras historias",
        ctaPath: "/es/stories",
        ctaContentSlug: "ps-stories-cta",
      },
    },
  },
  {
    id: "welcome-02",
    family: "welcome",
    stepNumber: 2,
    sendTiming: "Day 2 (09:30 CET/CEST)",
    narrator: "alma",
    campaignSlugBase: "welcome-02",
    footerMode: "marketing",
    localHeroImage:
      "/images/founders/alma-shirish-planning-table-window-india.jpeg",
    goal: "Build personal founder trust by sharing how Alma and Shirish teamed up across Spain and India, and why having real faces on both sides changes manufacturing.",
    trigger: "Day 2 after newsletter_subscribed",
    exitConditions:
      "Unsubscribe, bounce, or conversion event (optional skip on W5)",
    en: {
      templateName:
        "[AUTO][EN] Welcome 02 · Why we built this across two countries",
      subject: "Why we built this across two countries",
      previewText:
        "How a Spanish business owner and an Indian lawyer teamed up so brands never feel alone in India.",
      brandTitle: "KarmaRise Stories",
      issueTag: "Welcome 02 · How we started",
      heading: "Why we built this across two countries.",
      dateline: "From Alma · Between Spain and India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hi {{ contact.FIRSTNAME }},{% else %}Hi there,{% endif %}",
      greetingPreview: "Hi there,",
      beforePhotoParagraphs: [
        "Most people think producing in India means sending messages into a screen and hoping the cartons that arrive in Europe match the photos. Having imported from Asia for years before ever landing in Mumbai, I know how exhausting that distance feels.",
        "Shirish and I met after lockdown at an online international language conference, when he asked me to help sharpen his English. Those early talks about Indian craft, family businesses, and European shops grew into **KarmaRise D Global**.",
      ],
      heroImageAlt:
        "Alma and Shirish seated across a wooden table by a sunlit window in India reviewing production notes on a tablet",
      afterPhotoParagraphs: [
        "Today we work as one continuous team. I stay close to shop owners and brand founders in Spain and the rest of Europe, translating real retail habits into a clear Product Brief. Shirish, a registered Bar Council advocate in India, structures enforceable Indian supplier contracts, audits production units in person, and oversees quality and export paperwork on the ground.",
        "We also design and stitch our own label, **AlmaRise D Brand**, right here in India. Testing fabrics, adjusting cuts, and checking seams on our own pieces every week keeps our advice practical and grounded.",
        "Because we show up with face and eyes, every video call ends with clear written meeting notes, and every step happens openly before you commit to production.",
      ],
      primaryCta: {
        label: "See how we work step by step",
        path: "/how-we-work",
        contentSlug: "primary-cta",
      },
      signoffLead: "Warmly,",
      signoffName: "Alma",
      signoffLocation: "Co-founder · KarmaRise D Global",
      ps: {
        text: "In three days, Shirish will write to you with the exact story of how our very first leather bag samples failed in our hands, and what we changed to get them right.",
      },
    },
    es: {
      templateName:
        "[AUTO][ES] Bienvenida 02 · Por qué levantamos esto entre dos países",
      subject: "Por qué montamos esto entre dos países",
      previewText:
        "Cómo una emprendedora española y un abogado indio unimos fuerzas para acompañar cada pedido a pie de obra.",
      brandTitle: "Historias de KarmaRise",
      issueTag: "Bienvenida 02 · Cómo empezamos",
      heading: "Por qué levantamos esto entre dos países.",
      dateline: "Escrito por Alma · Entre España y la India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hola {{ contact.FIRSTNAME }},{% else %}Hola,{% endif %}",
      greetingPreview: "Hola,",
      beforePhotoParagraphs: [
        "Mucha gente piensa que dar el salto a fabricar en la India consiste en mandar correos al vacío y cruzar los dedos cuando llegan las cajas. Como yo ya había ayudado antes a importar desde Asia, sé perfectamente la incertidumbre que da trabajar a distancia sin tener ojos de confianza allí.",
        "Shirish y yo nos conocimos después del confinamiento en un encuentro internacional de idiomas online, cuando me escribió para practicar inglés. Aquellas conversaciones sobre oficios indios, comercios de barrio en España y ganas de hacer las cosas bien terminaron dando forma a **KarmaRise D Global**.",
      ],
      heroImageAlt:
        "Alma y Shirish sentados frente a frente en una mesa de madera junto a una ventana luminosa en la India revisando notas en una tableta",
      afterPhotoParagraphs: [
        "Hoy trabajamos como una sola pieza. Yo acompaño de cerca a tiendas y marcas de España y el resto de Europa para convertir lo que pasa cada día en el mostrador en un briefing de producto claro. Shirish, abogado colegiado en el Bar Council de la India, redacta los contratos bajo ley india, audita las unidades de producción en persona y supervisa la calidad y la exportación sobre el terreno.",
        "Además levantamos nuestra propia marca, **AlmaRise D Brand**, aquí mismo en la India. Probar telas, afinar patrones y revisar costuras en nuestras propias prendas cada semana hace que cualquier consejo que te demos nazca de la práctica real.",
        "Porque damos la cara de tú a tú, tras cada videollamada te envío por correo las conclusiones de la reunión para que nada se quede en el aire.",
      ],
      primaryCta: {
        label: "Ver cómo trabajamos paso a paso",
        path: "/es/how-we-work",
        contentSlug: "primary-cta",
      },
      signoffLead: "Un abrazo,",
      signoffName: "Alma",
      signoffLocation: "Cofundadora · KarmaRise D Global",
      ps: {
        text: "Dentro de tres días te escribe Shirish para contarte cómo fallaron al tacto nuestras primeras muestras de bolsos de piel y qué cambiamos para dar en el clavo.",
      },
    },
  },
  {
    id: "welcome-03",
    family: "welcome",
    stepNumber: 3,
    sendTiming: "Day 5 (09:30 CET/CEST)",
    narrator: "shirish",
    campaignSlugBase: "welcome-03",
    footerMode: "marketing",
    localHeroImage:
      "/images/workshops/brown-black-leather-panels-brass-hardware.jpg",
    goal: "Deliver a concrete operational quick win and craft proof: why physical colour swatches and multi-hub matching prevent costly mistakes before cutting starts.",
    trigger: "Day 5 after newsletter_subscribed",
    exitConditions: "Unsubscribe or bounce",
    en: {
      templateName:
        "[AUTO][EN] Welcome 03 · Why phone photos lie about tan leather",
      subject: "Why phone photos lie about tan leather",
      previewText:
        "One simple rule from our Donostia leather run that saves months of wasted samples in India.",
      brandTitle: "KarmaRise Stories",
      issueTag: "Welcome 03 · Craft proof",
      heading: "Why phone photos lie about tan leather.",
      dateline: "From Shirish · Our studio near Mumbai",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hi {{ contact.FIRSTNAME }},{% else %}Hi there,{% endif %}",
      greetingPreview: "Hi there,",
      beforePhotoParagraphs: [
        "When an independent boutique in Donostia asked us to develop four leather bag styles in black and tan, the owner gave us a Basque phrase for the feel he wanted: *goxo-goxo*. Warm, silky, and soft enough that shoppers keep touching the leather.",
        "Our first trial samples looked completely acceptable in phone photos. The second Alma and I held them in our own hands, they felt dry and stiff. That single afternoon taught us two rules we follow on every single order today.",
      ],
      heroImageAlt:
        "Cut brown and black vegetable-tanned leather panels fitted with antique brass D-rings on a production table in India",
      afterPhotoParagraphs: [
        "**First, match each step to India's specialist cities.** We had the hides vegetable-tanned in Kolkata, moved the finished leather to Uttar Pradesh for cleaner soft-bag stitching, and coordinated checks from our studio near Mumbai. Across India, hubs like Kolkata, Kanpur, Agra, and Chennai each excel at different materials and finishes.",
        "**Second, lock colour on a physical swatch before dyeing.** Every phone screen shifts warm tones differently. We guide you on what the dye lot needs, create a physical colour swatch for your sign-off, and review every prototype ourselves so cutting starts only after you hold and approve the physical sample in hand.",
        "Eleven numbered export cartons landed straight at that boutique's door in Donostia, and two days later all eight bags filled the main downtown window.",
      ],
      primaryCta: {
        label: "Read the full Donostia leather Story",
        path: "/stories/matching-a-workshop-to-the-product",
        contentSlug: "primary-cta",
      },
      signoffLead: "Best regards,",
      signoffName: "Shirish",
      signoffLocation: "Co-founder · KarmaRise D Global",
      ps: {
        text: "If you have ever been burned by a sample that looked great online and disappointing in person, hit reply and tell me what happened. I read every note.",
      },
    },
    es: {
      templateName:
        "[AUTO][ES] Bienvenida 03 · Por qué una foto engaña con el color",
      subject: "Por qué una foto engaña con el tono de la piel",
      previewText:
        "La regla práctica de nuestro primer encargo en Donostia que ahorra meses de muestras perdidas.",
      brandTitle: "Historias de KarmaRise",
      issueTag: "Bienvenida 03 · Prueba sobre el terreno",
      heading: "Por qué una foto engaña con el tono de la piel.",
      dateline: "Escrito por Shirish · Desde nuestro estudio cerca de Bombay",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hola {{ contact.FIRSTNAME }},{% else %}Hola,{% endif %}",
      greetingPreview: "Hola,",
      beforePhotoParagraphs: [
        "Cuando una tienda independiente de Donostia nos pidió desarrollar cuatro modelos de bolso en negro y tono tan, su dueño usó una expresión en euskera para describir el tacto que buscaba: *goxo-goxo*. Suave, cálido y con esa caída sedosa que invita a seguir tocándolo.",
        "Las primeras pruebas daban el pego en fotos de móvil. En cuanto Alma y yo las tuvimos en la mano, resultaron secas y rígidas. Aquella tarde nos dejó dos normas que hoy aplicamos a rajatabla en cada pedido de producción.",
      ],
      heroImageAlt:
        "Paneles cortados de piel marrón y negra de curtido vegetal con anillas de latón envejecido sobre una mesa de trabajo en la India",
      afterPhotoParagraphs: [
        "**Primera norma: llevar cada fase a la ciudad especialista adecuada.** Mandamos hacer el curtido vegetal en Calcuta, llevamos la piel terminada a Uttar Pradesh para una confección mucho más limpia en bolsos blandos y supervisamos todo desde nuestro estudio cerca de Bombay. Por toda la India, polos como Calcuta, Kanpur, Agra y Chennai destacan cada uno en su oficio.",
        "**Segunda norma: cerrar siempre el color con una muestra física.** Cada pantalla altera los tonos cálidos a su manera. Te orientamos sobre lo que necesita la partida de tinte, preparamos una muestra física de color para tu visto bueno y revisamos cada prototipo antes de enviártelo, de modo que nunca empezamos a cortar hasta que sostienes y apruebas la muestra física en tu mano.",
        "Las once cajas numeradas llegaron directas a la puerta de aquella tienda en Donostia y, dos días después, los ocho modelos llenaban su escaparate principal.",
      ],
      primaryCta: {
        label: "Leer la historia completa del pedido de Donostia",
        path: "/es/stories/matching-a-workshop-to-the-product",
        contentSlug: "primary-cta",
      },
      signoffLead: "Un saludo cordial,",
      signoffName: "Shirish",
      signoffLocation: "Cofundador · KarmaRise D Global",
      ps: {
        text: "Si alguna vez te llegó una muestra estupenda en foto que luego decepcionó al tocarla, responde a este correo y cuéntame qué falló. Leo cada respuesta.",
      },
    },
  },
  {
    id: "welcome-04",
    family: "welcome",
    stepNumber: 4,
    sendTiming: "Day 9 (09:30 CET/CEST)",
    narrator: "alma",
    campaignSlugBase: "welcome-04",
    footerMode: "marketing",
    localHeroImage:
      "/images/almarise/alma-draping-saree-dress-form-studio.jpeg",
    goal: "Broaden awareness to all four manufacturing categories plus AlmaRise D Brand (Reborn, Organic, Home Decor), while defusing key objections (NDA, no tech pack needed, ethical audits).",
    trigger: "Day 9 after newsletter_subscribed",
    exitConditions: "Unsubscribe or bounce",
    en: {
      templateName:
        "[AUTO][EN] Welcome 04 · What we make across India, and why",
      subject: "What we make across India, and why",
      previewText:
        "Four own-brand manufacturing categories, AlmaRise D Brand, mutual NDAs, and open-door audits.",
      brandTitle: "KarmaRise Stories",
      issueTag: "Welcome 04 · What we build",
      heading: "What we make across India, and why.",
      dateline: "From Alma · Spain & India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hi {{ contact.FIRSTNAME }},{% else %}Hi there,{% endif %}",
      greetingPreview: "Hi there,",
      beforePhotoParagraphs: [
        "Many readers find us through one leather bag story or one saree photo and assume that is all we do. In reality, our weeks in India cover two closely linked worlds that make each other stronger.",
        "**1. Own-brand Manufacturing Programmes across four categories** for shops and brands in Spain and the rest of Europe:",
        "- **Leather goods:** contemporary hobo bags, everyday backpacks, small crossbodies, pouches, wallets, belts, and travel bags with thoughtful details like proper strap drop, light cotton linings, and high-quality Japanese plastic YKK zippers.\n- **Clothing in natural and varied fabrics:** cotton and linen midi dresses and skirts, unique denim pieces, blouses, jumpsuits, and outerwear.\n- **Textile accessories:** pashminas, scarves, shawls, thick canvas and linen totes, quilted bags, embroidered clutches, padded headbands, and fabric belts.\n- **Textile home decor:** cushion covers, wall hangings, Kantha-style bedspreads, recycled-cotton flat-weave dhurries, table runners, tablecloths, and placemats.",
      ],
      heroImageAlt:
        "Alma draping a patterned Indian saree on a dressmaker form in our studio in India",
      afterPhotoParagraphs: [
        "**2. Our own label, AlmaRise D Brand**, spanning three lines: **AlmaRise D Reborn** (one-of-a-kind garments cut from treasured Indian sarees, *thevnitlya sadya*, that women have kept and that carry a story), **AlmaRise D Organic** (organic dyes and plant or fruit-waste fabrics such as sugarcane, orange, banana, and pineapple, among others), and **AlmaRise D Home Decor**.",
        "Three ground rules sit underneath all of it: you never need a finished tech pack to begin, mutual NDA confidentiality is available from day one, and we audit every family-run factory and women artisan collective in person with a strict zero-exploitation standard. That steady commercial foundation is also what will allow us to launch our planned **Women's Training Initiative** properly once the Section 8 groundwork is complete.",
      ],
      primaryCta: {
        label: "Explore our four manufacturing categories",
        path: "/manufacturing",
        contentSlug: "primary-cta",
      },
      signoffLead: "Warmly,",
      signoffName: "Alma",
      signoffLocation: "Co-founder · KarmaRise D Global",
      ps: {
        text: "Curious about our own kept-saree and plant-waste pieces, or have a specific material question? Explore AlmaRise D Brand below or hit reply anytime.",
        ctaLabel: "Discover AlmaRise D Brand",
        ctaPath: "/almarise",
        ctaContentSlug: "ps-almarise-link",
      },
    },
    es: {
      templateName:
        "[AUTO][ES] Bienvenida 04 · Qué fabricamos en la India y cómo",
      subject: "Qué fabricamos en la India y por qué",
      previewText:
        "Nuestras cuatro categorías de producción, AlmaRise D Brand, acuerdos NDA y auditorías presenciales.",
      brandTitle: "Historias de KarmaRise",
      issueTag: "Bienvenida 04 · Qué hacemos",
      heading: "Qué fabricamos en la India y por qué.",
      dateline: "Escrito por Alma · España e India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hola {{ contact.FIRSTNAME }},{% else %}Hola,{% endif %}",
      greetingPreview: "Hola,",
      beforePhotoParagraphs: [
        "Mucha gente nos descubre por una historia de bolsos de piel o por una foto de un sari y piensa que solo hacemos eso. En realidad, nuestras semanas en la India unen dos mundos que se alimentan uno al otro.",
        "**1. Programas de producción a medida en cuatro categorías** para comercios, tiendas y marcas de España y el resto de Europa:",
        "- **Bolsos y artículos de piel:** bolsones, mochilas cómodas, bandoleras pequeñas, monederos, neceseres, cinturones y bolsas de viaje, cuidando detalles como la caída del asa, forros claros de algodón y cremalleras japonesas YKK de plástico de alta calidad.\n- **Ropa y prendas de diversos tejidos:** vestidos midi y faldas de algodón o lino, prendas vaqueras con personalidad, blusas, monos y prendas exteriores.\n- **Complementos textiles:** pashminas, pañuelos, chales, bolsas de lona o lino grueso, bolsos acolchados, bolsos de mano bordados, diademas acolchadas y cinturones de tela.\n- **Decoración textil del hogar:** fundas de cojín, tapices de pared, colchas estilo Kantha, alfombras dhurrie de algodón reciclado, caminos de mesa, manteles y manteles individuales.",
      ],
      heroImageAlt:
        "Alma ajustando un sari indio estampado sobre un maniquí de costura en nuestro estudio en la India",
      afterPhotoParagraphs: [
        "**2. Nuestra propia firma, AlmaRise D Brand**, con tres líneas: **AlmaRise D Reborn** (prendas únicas para el día a día cortadas a partir de saris que mujeres indias han guardado con cariño y que tienen una historia que contar, *thevnitlya sadya*), **AlmaRise D Organic** (tintes orgánicos y tejidos de residuos vegetales y frutales como caña de azúcar, naranja, plátano y piña, entre otros) y **AlmaRise D Home Decor**.",
        "Todo descansa sobre tres pilares muy claros: no necesitas una ficha técnica cerrada para empezar, tienes disponible acuerdo mutuo de confidencialidad NDA desde el primer día y auditamos en persona cada fábrica de corte familiar y colectivo de artesanas con tolerancia cero ante la explotación. Esa base comercial sólida es también la que nos permitirá abrir con garantías nuestra futura **Iniciativa de formación para mujeres**, todavía en preparación.",
      ],
      primaryCta: {
        label: "Ver las cuatro categorías de fabricación",
        path: "/es/manufacturing",
        contentSlug: "primary-cta",
      },
      signoffLead: "Un abrazo,",
      signoffName: "Alma",
      signoffLocation: "Cofundadora · KarmaRise D Global",
      ps: {
        text: "¿Te apetece ver de cerca nuestras prendas de saris guardados y tejidos vegetales o preguntar por algún material concreto? Descubre AlmaRise D Brand debajo o responde a este correo.",
        ctaLabel: "Conocer AlmaRise D Brand",
        ctaPath: "/es/almarise",
        ctaContentSlug: "ps-almarise-link",
      },
    },
  },
  {
    id: "welcome-05",
    family: "welcome",
    stepNumber: 5,
    sendTiming: "Day 14 (09:30 CET/CEST)",
    narrator: "both",
    campaignSlugBase: "welcome-05",
    footerMode: "marketing",
    localHeroImage: "/images/workshops/alma-shirish-india-office-meeting.jpg",
    goal: "Offer a calm, zero-pressure conversion invite to start a Product Brief or book a 15-min call with Alma, and transition Story readers smoothly into biweekly issues.",
    trigger:
      "Day 14 after newsletter_subscribed (skipped if product_brief_submitted or call_booked already occurred)",
    exitConditions:
      "Unsubscribe, bounce, product_brief_submitted, or call_booked",
    en: {
      templateName:
        "[AUTO][EN] Welcome 05 · Whenever an idea is ready on your desk",
      subject: "Whenever an idea is ready on your desk",
      previewText:
        "Two easy ways to move forward if you have a product in mind, or stay put for our biweekly letters.",
      brandTitle: "KarmaRise Stories",
      issueTag: "Welcome 05 · Two quiet doors",
      heading: "Whenever an idea is ready on your desk.",
      dateline: "From Alma & Shirish · Spain & India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hi {{ contact.FIRSTNAME }},{% else %}Hi there,{% endif %}",
      greetingPreview: "Hi there,",
      beforePhotoParagraphs: [
        "Over the past two weeks we have shared how we started, how we verify colours and samples in India, and what we make across KarmaRise D Global and AlmaRise D Brand. From here, our regular biweekly letters will arrive every two weeks with fresh scenes from Spain and India.",
        "If you are here purely to read our Stories and follow AlmaRise D Brand, you do not need to do a thing. Sit back and enjoy the next letter.",
      ],
      heroImageAlt:
        "Alma and Shirish seated around the table with their team at the India office reviewing project documents",
      afterPhotoParagraphs: [
        "And if you run an independent shop, a growing brand, or a retail team in Spain or elsewhere in Europe and have a bag, garment, accessory, or home decor piece on your mind, two simple doors are open whenever the timing fits you:",
        "- **Start a 1-minute Product Brief:** share a rough sketch, phone photo, or idea. Alma reads it personally and writes back within 1 to 2 business days.\n- **Book a free 15-minute video call with Alma:** talk freely in English, Spanish, or Portuguese, and receive clear meeting notes by email straight after.",
        "Every Manufacturing Programme is scoped individually around your Product Brief, with mutual NDA protection available and physical sample sign-off before cutting starts.",
      ],
      primaryCta: {
        label: "Start your Product Brief",
        path: "/product-brief",
        contentSlug: "primary-cta",
        secondaryLabel: "Or book a free video call with Alma",
        secondaryPath: "/book-a-call?duration=15",
        secondaryContentSlug: "secondary-call-link",
      },
      signoffLead: "Warmly,",
      signoffName: "Alma & Shirish",
      signoffLocation: "KarmaRise D Global · Spain & India",
      ps: {
        text: "Our next biweekly Story lands in your inbox in two weeks. Hit reply anytime you want to say hello.",
      },
    },
    es: {
      templateName:
        "[AUTO][ES] Bienvenida 05 · Cuando tengas una idea sobre la mesa",
      subject: "Cuando tengas una idea sobre la mesa",
      previewText:
        "Dos caminos sencillos si estás pensando en crear colección propia, o sigue disfrutando de las cartas.",
      brandTitle: "Historias de KarmaRise",
      issueTag: "Bienvenida 05 · Dos puertas abiertas",
      heading: "Cuando tengas una idea sobre la mesa.",
      dateline: "De Alma y Shirish · España e India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hola {{ contact.FIRSTNAME }},{% else %}Hola,{% endif %}",
      greetingPreview: "Hola,",
      beforePhotoParagraphs: [
        "Durante estas dos semanas te hemos contado cómo empezamos, cómo aseguramos el color y cada muestra física en la India y qué fabricamos entre KarmaRise D Global y AlmaRise D Brand. A partir de ahora recibirás nuestra carta habitual cada dos semanas desde España y la India.",
        "Si estás aquí simplemente para leer nuestras historias y seguir de cerca AlmaRise D Brand, no tienes que hacer nada más: la próxima carta llegará sola a tu bandeja.",
      ],
      heroImageAlt:
        "Alma y Shirish reunidos alrededor de la mesa con su equipo en la oficina de la India revisando documentación de proyectos",
      afterPhotoParagraphs: [
        "Y si llevas una tienda independiente, una marca o un comercio en España o en algún lugar de Europa y te ronda la cabeza lanzar un bolso, una prenda, un complemento o una pieza de decoración del hogar, tienes dos puertas abiertas cuando te venga bien:",
        "- **Completar tu briefing de producto:** en un minuto nos cuentas tu idea con un boceto rápido o una foto del móvil, y Alma te contesta personalmente en 1 o 2 días laborables.\n- **Reservar una videollamada gratuita de 15 minutos con Alma:** hablamos con calma en español, inglés o portugués y recibes las conclusiones de la reunión por escrito justo al terminar.",
        "Cada Programa de producción se valora a medida según tu briefing, con acuerdo mutuo NDA disponible y aprobación de la muestra física en tu mano antes de empezar a cortar.",
      ],
      primaryCta: {
        label: "Empezar tu briefing de producto",
        path: "/es/product-brief",
        contentSlug: "primary-cta",
        secondaryLabel: "O reservar una videollamada gratuita con Alma",
        secondaryPath: "/es/book-a-call?duration=15",
        secondaryContentSlug: "secondary-call-link",
      },
      signoffLead: "Un abrazo,",
      signoffName: "Alma y Shirish",
      signoffLocation: "KarmaRise D Global · España e India",
      ps: {
        text: "Dentro de dos semanas llega la siguiente entrega de Historias de KarmaRise. Puedes responder a cualquier carta cuando te apetezca charlar.",
      },
    },
  },

  // =========================================================================
  // SEQUENCE 2: B2B LEAD FOLLOW-UP & FOUNDER CALL RECAP TEMPLATES
  // =========================================================================
  {
    id: "brief-followup-01",
    family: "lead-followup",
    stepNumber: 1,
    sendTiming: "Day 4 after Product Brief (only if no call booked)",
    narrator: "alma",
    campaignSlugBase: "brief-followup-01",
    footerMode: "transactional",
    goal: "Give Product Brief submitters a warm, zero-pressure shortcut to a 15-minute screen-share walkthrough if they have not booked a call yet.",
    trigger:
      "Day 4 after product_brief_submitted when call_booked has not occurred",
    exitConditions: "call_booked event or manual reply/CRM handoff",
    en: {
      templateName: "[AUTO][EN] Brief Follow-Up Day 4 · Quick note from Alma",
      subject: "Quick note on your Product Brief · Alma",
      previewText:
        "Would a quick 15-minute video call help walk through your reference piece or materials together?",
      brandTitle: "KarmaRise D Global",
      issueTag: "Product Brief · Follow-up",
      heading: "Would a quick video chat help?",
      dateline: "From Alma · KarmaRise D Global (Spain & India)",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hi {{ contact.FIRSTNAME }},{% else %}Hi there,{% endif %}",
      greetingPreview: "Hi there,",
      beforePhotoParagraphs: [
        "Thank you again for sending over your Product Brief earlier this week. Sometimes putting leather feel, drape, or sizing into a text box takes longer than simply holding a favourite shop item up to the camera for ten minutes.",
        "If talking it through live would make things easier, I have open 15-minute Google Meet slots this week in English, Spanish, or Portuguese. Bring whatever you have on your desk, and I will email clear meeting notes right after we speak.",
        "If email works better for your schedule, reply right here and we will keep everything moving in writing.",
      ],
      primaryCta: {
        label: "Pick a call slot with Alma",
        path: "/book-a-call?duration=15",
        contentSlug: "primary-cta",
      },
      signoffLead: "Warmly,",
      signoffName: "Alma",
      signoffLocation: "Co-founder · KarmaRise D Global",
      ps: {
        text: "You can also message me directly on WhatsApp (+34 611 722 276) if it is faster to send a voice note or quick photo.",
      },
    },
    es: {
      templateName:
        "[AUTO][ES] Seguimiento Briefing Día 4 · Nota rápida de Alma",
      subject: "Una nota rápida sobre tu briefing · Alma",
      previewText:
        "¿Te vendría bien una videollamada de 15 minutos para ver juntos materiales o una pieza de referencia?",
      brandTitle: "KarmaRise D Global",
      issueTag: "Briefing de producto · Seguimiento",
      heading: "¿Te ayudaría comentarlo en 15 minutos?",
      dateline: "Escrito por Alma · KarmaRise D Global (España e India)",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hola {{ contact.FIRSTNAME }},{% else %}Hola,{% endif %}",
      greetingPreview: "Hola,",
      beforePhotoParagraphs: [
        "Gracias de nuevo por enviarnos tu briefing de producto hace unos días. Muchas veces explicar por escrito la caída de una tela, el tacto de una piel o una medida concreta cuesta mucho más que enseñar una pieza delante de la cámara diez minutos.",
        "Si te resulta más cómodo verlo en directo, tengo huecos gratuitos de 15 minutos por Google Meet esta semana (hablamos en español, inglés o portugués). Trae lo que tengas a mano y al terminar te envío por correo las conclusiones de la reunión.",
        "Y si prefieres seguir por correo a tu ritmo, responde directamente a este mensaje y seguimos avanzando por escrito.",
      ],
      primaryCta: {
        label: "Elegir hueco de videollamada con Alma",
        path: "/es/book-a-call?duration=15",
        contentSlug: "primary-cta",
      },
      signoffLead: "Un abrazo,",
      signoffName: "Alma",
      signoffLocation: "Cofundadora · KarmaRise D Global",
      ps: {
        text: "Si te resulta más ágil mandar una foto o un audio rápido, también puedes escribirme por WhatsApp al +34 611 722 276.",
      },
    },
  },
  {
    id: "post-call-conclusions",
    family: "lead-followup",
    stepNumber: 2,
    sendTiming: "Manual send by Alma right after discovery call",
    narrator: "alma",
    campaignSlugBase: "post-call-conclusions",
    footerMode: "transactional",
    goal: "Standardize Alma's signature post-call written meeting conclusions so every client receives crisp, accountable next steps immediately after hanging up.",
    trigger:
      "Triggered manually by Alma via Brevo transactional template or copied into email right after Google Meet",
    exitConditions: "Single manual recap per call",
    en: {
      templateName: "[TEMPLATE][EN] Post-Call Written Conclusions · Alma",
      subject: "Clear notes from our call today · Alma",
      previewText:
        "Here are our written meeting notes, next physical steps, and open questions from today's conversation.",
      brandTitle: "KarmaRise D Global",
      issueTag: "Meeting notes · Spain & India",
      heading: "Clear notes from our call today.",
      dateline: "From Alma · KarmaRise D Global",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hi {{ contact.FIRSTNAME }},{% else %}Hi there,{% endif %}",
      greetingPreview: "Hi Marta,",
      beforePhotoParagraphs: [
        "Thank you for taking the time to talk through your collection today. As promised, here is everything we agreed in writing so nothing gets lost between Spain and India:",
        '- **Project focus:** {{ params.CATEGORY | default:"Own-brand capsule development" }}\n- **Key ergonomic and material points:** {{ params.MATERIAL_NOTES | default:"Leather or natural fabric feel, strap drop and sizing refinements, light cotton lining, and EU care labelling." }}\n- **Confidentiality (NDA):** {{ params.NDA_STATUS | default:"Mutual NDA ready to sign whenever you want before sharing final sketches." }}\n- **Immediate next step:** {{ params.NEXT_STEP | default:"Confirm rough target quantities and share reference photos so Shirish and I can match the right production unit and prepare your written proposal and physical colour swatch plan." }}',
        "Take a quick look and hit reply if I missed any nuance or if you want to adjust a detail before we start checking makers in India.",
      ],
      primaryCta: {
        label: "Review how our sampling process works",
        path: "/how-we-work",
        contentSlug: "primary-cta",
      },
      signoffLead: "Warmly,",
      signoffName: "Alma",
      signoffLocation: "Co-founder · KarmaRise D Global (Spain & India)",
      ps: {
        text: "Shirish is copied on our internal review on the India side so contract, swatch, and production-site planning stay aligned from day one.",
      },
    },
    es: {
      templateName: "[TEMPLATE][ES] Conclusiones de la reunión · Alma",
      subject: "Conclusiones de nuestra reunión de hoy · Alma",
      previewText:
        "Aquí tienes por escrito las conclusiones de nuestra llamada y los próximos pasos acordados.",
      brandTitle: "KarmaRise D Global",
      issueTag: "Conclusiones de la reunión · España e India",
      heading: "Conclusiones de nuestra reunión de hoy.",
      dateline: "Escrito por Alma · KarmaRise D Global",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hola {{ contact.FIRSTNAME }},{% else %}Hola,{% endif %}",
      greetingPreview: "Hola Marta,",
      beforePhotoParagraphs: [
        "Muchas gracias por el rato de hoy y por contarnos con tanta claridad lo que buscas para tu colección. Tal y como quedamos, te dejo aquí las conclusiones de la reunión por escrito para que nada se quede en el aire entre España y la India:",
        '- **Enfoque del proyecto:** {{ params.CATEGORY | default:"Desarrollo de colección propia a medida" }}\n- **Detalles clave de materiales y acabados:** {{ params.MATERIAL_NOTES | default:"Tacto de la piel o tejido natural, caída del asa y ajuste de patrón, forro claro de algodón y etiquetado europeo." }}\n- **Confidencialidad (NDA):** {{ params.NDA_STATUS | default:"Acuerdo mutuo NDA listo para firmar en cuanto quieras antes de compartir bocetos definitivos." }}\n- **Siguiente paso:** {{ params.NEXT_STEP | default:"Confirmar cantidades orientativas y fotos de referencia para que Shirish y yo seleccionemos la unidad de producción adecuada y preparemos tu propuesta clara y el plan de muestra física de color." }}',
        "Échale un vistazo con calma y respóndeme a este correo si se me ha escapado algún matiz o quieres ajustar cualquier punto antes de ponernos en marcha en la India.",
      ],
      primaryCta: {
        label: "Repasar cómo trabajamos las muestras físicas",
        path: "/es/how-we-work",
        contentSlug: "primary-cta",
      },
      signoffLead: "Un abrazo,",
      signoffName: "Alma",
      signoffLocation: "Cofundadora · KarmaRise D Global (España e India)",
      ps: {
        text: "Shirish ya está al tanto desde la India para alinear desde el principio los acuerdos, la muestra física de color y las unidades de producción.",
      },
    },
  },

  // =========================================================================
  // SEQUENCE 4: RE-ENGAGEMENT & LIST HYGIENE (3 EMAILS, DAYS 90 TO 104)
  // =========================================================================
  {
    id: "reengage-01",
    family: "reengagement",
    stepNumber: 1,
    sendTiming: "Day 90 of inactivity (~6 biweekly issues without clicks)",
    narrator: "both",
    campaignSlugBase: "reengage-01",
    footerMode: "marketing",
    localHeroImage: "/images/founders/alma-shirish-team-dinner-india.jpg",
    goal: "Say a warm, cheerful hello with two reader-favourite Stories and make switching between English and Peninsular Spanish effortless.",
    trigger:
      "90 days with zero clicks and zero confirmed unique opens on Stories list",
    exitConditions: "Any link click, language switch, or reply",
    en: {
      templateName:
        "[AUTO][EN] Re-engagement 01 · A warm hello from India and Spain",
      subject: "A warm hello from India and Spain",
      previewText:
        "Two recent KarmaRise Stories readers loved most, plus an easy switch to Spanish if you prefer.",
      brandTitle: "KarmaRise Stories",
      issueTag: "Warm hello · Spain & India",
      heading: "A warm hello from India and Spain.",
      dateline: "From Alma & Shirish · Spain & India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hi {{ contact.FIRSTNAME }},{% else %}Hi there,{% endif %}",
      greetingPreview: "Hi there,",
      beforePhotoParagraphs: [
        "Seasons fly by between Spain and India, and we wanted to drop in with a warm hello and share two recent letters that sparked the liveliest replies from our readers.",
        "If you ever prefer reading our letters in Peninsular Spanish instead of English, you can switch anytime at the bottom of any email.",
      ],
      heroImageAlt:
        "Alma and Shirish smiling around a dinner table in India with Shirish wearing a Spain shirt",
      afterPhotoParagraphs: [
        "Whenever you have five quiet minutes with a coffee, here are two favourites worth opening:",
        "- **Three states for one leather bag:** why we split vegetable tanning in Kolkata and stitching in Uttar Pradesh for a boutique in Donostia.\n- **Nobody pictured it until I opened the bag:** unzipping a suitcase of kept Indian sarees turned into everyday pieces in old Madrid.",
      ],
      primaryCta: {
        label: "Browse our latest Stories",
        path: "/stories",
        contentSlug: "primary-cta",
      },
      signoffLead: "Warmly,",
      signoffName: "Alma & Shirish",
      signoffLocation: "Spain · India",
      ps: {
        text: "Hit reply anytime if you want to say hello or ask us anything about India, leather, or textiles. Both of us read every note.",
      },
    },
    es: {
      templateName:
        "[AUTO][ES] Reactivación 01 · Un saludo desde la India y España",
      subject: "Un saludo desde la India y España",
      previewText:
        "Dos historias recientes muy leídas por si te apetece ponerte al día o cambiar de idioma cuando quieras.",
      brandTitle: "Historias de KarmaRise",
      issueTag: "Un saludo · España e India",
      heading: "Un saludo desde la India y España.",
      dateline: "De Alma y Shirish · España e India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hola {{ contact.FIRSTNAME }},{% else %}Hola,{% endif %}",
      greetingPreview: "Hola,",
      beforePhotoParagraphs: [
        "Las temporadas pasan volando entre España y la India, así que queríamos pasarnos a saludarte con cariño y dejarte dos cartas recientes que generaron un montón de respuestas preciosas.",
        "Y si alguna vez prefieres leernos en inglés en lugar de en español, cambia de idioma cuando quieras al final de cada correo.",
      ],
      heroImageAlt:
        "Alma y Shirish sonriendo durante una cena en la India con Shirish llevando una camiseta de España",
      afterPhotoParagraphs: [
        "Para cuando tengas cinco minutos tranquilos con un café, aquí van dos de las cartas que más gustaron:",
        "- **Tres estados para un solo bolso:** por qué dividimos el curtido vegetal en Calcuta y la confección en Uttar Pradesh para una tienda de Donostia.\n- **Nadie lo veía hasta que abrí la maleta:** abriendo una maleta llena de saris transformados en el Madrid antiguo.",
      ],
      primaryCta: {
        label: "Ver las últimas historias en la web",
        path: "/es/stories",
        contentSlug: "primary-cta",
      },
      signoffLead: "Un abrazo,",
      signoffName: "Alma y Shirish",
      signoffLocation: "España · India",
      ps: {
        text: "Responde cuando te apetezca saludar o preguntarnos cualquier duda sobre la India, la piel o los tejidos. Leemos cada correo personalmente.",
      },
    },
  },
  {
    id: "reengage-02",
    family: "reengagement",
    stepNumber: 2,
    sendTiming: "Day 97 of inactivity (7 days after R1)",
    narrator: "alma",
    campaignSlugBase: "reengage-02",
    footerMode: "marketing",
    localHeroImage:
      "/images/almarise/alma-inspecting-blue-embroidered-saree-studio.jpg",
    goal: "Share two warm, concrete craft takeaways from our latest weeks in India with zero pressure.",
    trigger: "Day 97 if still no click or reply after R1",
    exitConditions: "Any link click or reply",
    en: {
      templateName:
        "[AUTO][EN] Re-engagement 02 · Two things we learned lately",
      subject: "Two things we learned on the ground lately",
      previewText:
        "Why smooth Japanese plastic YKK zippers save winter coats, plus fruit-waste fabrics in AlmaRise D Organic.",
      brandTitle: "KarmaRise Stories",
      issueTag: "Field notes · Spain & India",
      heading: "Two things we learned on the ground lately.",
      dateline: "From Alma · Spain & India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hi {{ contact.FIRSTNAME }},{% else %}Hi there,{% endif %}",
      greetingPreview: "Hi there,",
      beforePhotoParagraphs: [
        "Between factory visits and studio fittings lately, two small craft details had us smiling and I wanted to pass them straight on to you:",
        "**1. The zipper switch shoppers thank you for in winter.** Metal zipper teeth look sharp on a shelf, right until someone reaches into a bag and scratches their hand or catches a wool coat. Switching to high-quality Japanese plastic YKK zippers and light cotton linings removes that friction immediately.",
      ],
      heroImageAlt:
        "Alma and a garment maker holding an embroidered blue saree in daylight inside our studio in India",
      afterPhotoParagraphs: [
        "**2. Plant-waste textiles alongside kept sarees.** Inside **AlmaRise D Brand**, we are developing **AlmaRise D Organic** with organic dyes and fabrics spun from sugarcane, orange, banana, and pineapple waste, among others, alongside our one-of-a-kind **AlmaRise D Reborn** saree pieces and **AlmaRise D Home Decor**.",
        "That is the sort of close-up, hands-on detail we love sharing every two weeks.",
      ],
      primaryCta: {
        label: "See what is new across KarmaRise",
        path: "/manufacturing",
        contentSlug: "primary-cta",
      },
      signoffLead: "Warmly,",
      signoffName: "Alma",
      signoffLocation: "Co-founder · KarmaRise D Global",
    },
    es: {
      templateName:
        "[AUTO][ES] Reactivación 02 · Dos cosas que aprendimos sobre el terreno",
      subject: "Dos cosas que aprendimos sobre el terreno",
      previewText:
        "Por qué las cremalleras YKK de plástico cuidan los abrigos y lo nuevo en AlmaRise D Organic.",
      brandTitle: "Historias de KarmaRise",
      issueTag: "Notas de campo · España e India",
      heading: "Dos cosas que aprendimos sobre el terreno.",
      dateline: "Escrito por Alma · España e India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hola {{ contact.FIRSTNAME }},{% else %}Hola,{% endif %}",
      greetingPreview: "Hola,",
      beforePhotoParagraphs: [
        "Entre visitas a fábricas y pruebas en el estudio últimamente hay dos detalles muy concretos que nos tienen ilusionados y quería compartirlos contigo:",
        "**1. El cambio de cremallera que tus clientas agradecen en invierno.** Los dientes metálicos lucen mucho en el escaparate hasta que alguien mete la mano y se araña o le roza el abrigo de lana. Apostar por cremalleras japonesas YKK de plástico de alta calidad y forros claros de algodón quita ese roce al instante.",
      ],
      heroImageAlt:
        "Alma y una confeccionista sujetando un sari azul bordado con luz natural en nuestro estudio en la India",
      afterPhotoParagraphs: [
        "**2. Tejidos de residuos vegetales junto a los saris guardados.** Dentro de **AlmaRise D Brand**, seguimos desarrollando **AlmaRise D Organic** con tintes orgánicos y tejidos procedentes de caña de azúcar, naranja, plátano y piña, entre otros, junto a las prendas únicas de **AlmaRise D Reborn** y **AlmaRise D Home Decor**.",
        "Ese tipo de detalles reales, contados de cerca y sin adornos, es lo que nos encanta compartir cada dos semanas.",
      ],
      primaryCta: {
        label: "Ver qué estamos fabricando en KarmaRise",
        path: "/es/manufacturing",
        contentSlug: "primary-cta",
      },
      signoffLead: "Un abrazo,",
      signoffName: "Alma",
      signoffLocation: "Cofundadora · KarmaRise D Global",
    },
  },
  {
    id: "reengage-03",
    family: "reengagement",
    stepNumber: 3,
    sendTiming: "Day 104 (7 days after R2 · open-door reader invitation)",
    narrator: "both",
    campaignSlugBase: "reengage-03",
    footerMode: "marketing",
    goal: "Invite quiet readers warmly to tell Alma and Shirish what topics, crafts, or regions they would enjoy reading next, with zero pressure or removal ultimatums.",
    trigger: "Day 104 if still no click or reply after R2",
    exitConditions: "Any link click, language preference update, or reply",
    en: {
      templateName:
        "[AUTO][EN] Re-engagement 03 · What would you love to read next?",
      subject: "What would you love to read next?",
      previewText:
        "Tell Alma and Shirish which materials, Indian hubs, or AlmaRise D Brand stories you would enjoy seeing in upcoming letters.",
      brandTitle: "KarmaRise Stories",
      issueTag: "Open door · Spain & India",
      heading: "What would you love to read next?",
      dateline: "From Alma & Shirish · Spain & India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hi {{ contact.FIRSTNAME }},{% else %}Hi there,{% endif %}",
      greetingPreview: "Hi there,",
      beforePhotoParagraphs: [
        "We write **KarmaRise Stories** like real letters from our desk in India and Spain, and the best issues always come straight from a question a reader sends in.",
        "Over the next few months we are putting together letters on vegetable-tanned leather across Kolkata and Kanpur, natural linen and cotton clothing, textile home decor, and new **AlmaRise D Brand** pieces cut from kept Indian sarees and fruit-waste fabrics.",
      ],
      replyPrompt: {
        question:
          "Is there one material, Indian craft region, or behind-the-scenes question you would love us to cover in a future letter?",
        helper:
          "Hit reply with even a single line. Both of us read every message personally, and we love shaping upcoming letters around what genuinely interests you.",
      },
      primaryCta: {
        label: "Explore our Stories archive",
        path: "/stories",
        contentSlug: "stories-archive-cta",
      },
      signoffLead: "Warmly,",
      signoffName: "Alma & Shirish",
      signoffLocation: "KarmaRise D Global · Spain & India",
      ps: {
        text: "Our regular biweekly letters will keep arriving quietly whenever you have a spare moment. You can also switch between English and Spanish or adjust your preferences anytime right at the bottom.",
      },
    },
    es: {
      templateName:
        "[AUTO][ES] Reactivación 03 · ¿Qué te apetece leer en próximas cartas?",
      subject: "¿Qué te apetece leer en próximas cartas?",
      previewText:
        "Cuéntanos a Alma y a Shirish qué materiales, ciudades de la India o historias de AlmaRise D Brand te gustaría leer.",
      brandTitle: "Historias de KarmaRise",
      issueTag: "Puerta abierta · España e India",
      heading: "¿Qué te apetece leer en próximas cartas?",
      dateline: "De Alma y Shirish · España e India",
      greetingTemplate:
        "{% if contact.FIRSTNAME %}Hola {{ contact.FIRSTNAME }},{% else %}Hola,{% endif %}",
      greetingPreview: "Hola,",
      beforePhotoParagraphs: [
        "Queremos que cada entrega de **Historias de KarmaRise** llegue como una carta personal escrita desde nuestro estudio, y casi siempre las mejores nacen de una duda o curiosidad que nos manda alguien por correo.",
        "Para los próximos meses estamos preparando cartas sobre piel de curtido vegetal entre Calcuta y Kanpur, prendas de lino y algodón natural, decoración textil del hogar y nuevas piezas de **AlmaRise D Brand** hechas con saris guardados y tejidos de residuos frutales.",
      ],
      replyPrompt: {
        question:
          "¿Hay algún material, oficio de la India o duda sobre cómo se fabrica allí que te apetezca ver en una próxima carta?",
        helper:
          "Responde a este correo aunque sea con una sola línea. Los dos leemos cada mensaje personalmente y nos encanta dar forma a las siguientes entregas según lo que de verdad te despierta curiosidad.",
      },
      primaryCta: {
        label: "Explorar el archivo de historias",
        path: "/es/stories",
        contentSlug: "stories-archive-cta",
      },
      signoffLead: "Un abrazo,",
      signoffName: "Alma y Shirish",
      signoffLocation: "KarmaRise D Global · España e India",
      ps: {
        text: "Seguiremos mandándote nuestras cartas cada dos semanas sin prisa, para cuando te apetezca leerlas. Y abajo tienes siempre a mano el cambio entre español e inglés o tus preferencias cuando quieras.",
      },
    },
  },
];
