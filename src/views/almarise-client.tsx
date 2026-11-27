import Image from "next/image";
import Link from "next/link";

import { AlmariseScrollChoreography } from "@/components/almarise/almarise-scroll-choreography";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { StoryReferenceSegments } from "@/components/stories/story-reference-text";
import { OFFICIAL_SOCIALS } from "@/data/socials";
import { segmentParagraphWithReferences } from "@/data/story-references";
import { localizePath, type SiteLanguage } from "@/lib/urls";

interface TransformationStep {
  readonly id: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imagePosition?: string;
  readonly imageAlt: Record<SiteLanguage, string>;
}

const transformationSteps: readonly TransformationStep[] = [
  {
    id: "source",
    title: {
      en: "Source with respect",
      es: "Seleccionar con respeto",
    },
    body: {
      en: "Families keep wedding and festival sarees for decades, each carrying the memory of its owner. We acquire every piece through fair payment or voluntary donation and inspect the cotton, linen, or silk weave by hand.",
      es: "Muchas familias conservan saris de fiesta durante décadas, cargados de memoria personal. Los adquirimos mediante pago justo o donación voluntaria y revisamos cada trama de algodón, lino o seda a mano.",
    },
    image: "/images/almarise/design-students-saree-stacks-mumbai-studio.jpeg",
    imagePosition: "50% 42%",
    imageAlt: {
      en: "Alma and garment makers inspecting folded stacks of patterned silk sarees by hand at a studio table in India",
      es: "Alma y diseñadoras revisando a mano pilas de saris de seda doblados sobre una mesa de estudio en la India",
    },
  },
  {
    id: "pattern",
    title: {
      en: "One saree, one pattern",
      es: "Un patrón distinto para cada sari",
    },
    body: {
      en: "Every kept saree brings its own cloth weight, decorative pallu end, and woven zari border. We draft an individual pattern from scratch so those borders frame each sleeve or hem, with no second copy anywhere.",
      es: "Cada sari guardado trae su propio peso, su pallu estampado y sus bordes tejidos con hilo zari. Dibujamos un patrón desde cero para que las cenefas encuadren cada manga o bajo, sin copias iguales.",
    },
    image: "/images/almarise/alma-draping-saree-dress-form-studio.jpeg",
    imagePosition: "50% 45%",
    imageAlt: {
      en: "Alma and a garment maker checking pattern placement on an embroidered saree on a dressmaker form",
      es: "Alma revisando con una patronista el encaje de un sari bordado sobre un maniquí",
    },
  },
  {
    id: "tailor",
    title: {
      en: "Tailored for active days",
      es: "Pensado para tu rutina diaria",
    },
    body: {
      en: "Women in our studio in India cut and stitch each saree into breathable shrugs, kimonos, tunics, loose jackets, and dresses that slip straight over basics for work, dinner, or a summer wedding.",
      es: "Artesanas de nuestro espacio de confección cortan y cosen cada sari en shrugs, kimonos, túnicas, chaquetas sueltas y vestidos frescos para ponerte encima de básicos en la oficina, una cena o una boda.",
    },
    image: "/images/almarise/almarise-sewing-studio-wide-view-india.jpg",
    imagePosition: "50% 52%",
    imageAlt: {
      en: "Sunlit garment studio in India with industrial sewing machines, a dressmaker form, and a woman maker seated at the studio table",
      es: "Estudio textil soleado en la India con máquinas de coser industriales, un maniquí y una confeccionista en la mesa de trabajo",
    },
  },
];

interface LookbookItem {
  readonly id: string;
  readonly image: string;
  readonly imagePosition: string;
  readonly alt: Record<SiteLanguage, string>;
}

const lookbookItems: readonly LookbookItem[] = [
  {
    id: "look-01",
    image:
      "/images/almarise/almarise-reborn-olive-pallu-shrug-madrid-street.jpeg",
    imagePosition: "50% 20%",
    alt: {
      en: "Maria walking across a sunlit brick street in Madrid wearing a sheer saree shrug over a plain black dress",
      es: "María paseando por una calle soleada de Madrid con un shrug vaporoso sobre un vestido negro liso",
    },
  },
  {
    id: "look-02",
    image:
      "/images/almarise/almarise-reborn-geometric-saree-tunic-madrid-station.jpeg",
    imagePosition: "50% 18%",
    alt: {
      en: "Outdoor portrait of Maria in Madrid wearing an asymmetric rust and black geometric saree tunic",
      es: "Retrato al aire libre de María en Madrid con una túnica asimétrica de dibujo geométrico en tono teja y negro",
    },
  },
  {
    id: "look-03",
    image: "/images/almarise/almarise-reborn-bandhani-saree-shrug-madrid.jpeg",
    imagePosition: "50% 25%",
    alt: {
      en: "Seated outdoor portrait in Madrid pairing an orange and yellow bandhani saree kimono with denim jeans",
      es: "Retrato sentado en exterior en Madrid combinando un kimono bandhani naranja y amarillo con vaqueros",
    },
  },
  {
    id: "look-04",
    image:
      "/images/almarise/almarise-reborn-coral-zari-saree-portrait-madrid.jpeg",
    imagePosition: "50% 15%",
    alt: {
      en: "Close portrait in Madrid wearing a sheer coral pink silk saree overlay trimmed with woven gold zari",
      es: "Retrato cercano en Madrid con una prenda ligera translúcida de seda coral rematada con cenefa dorada zari",
    },
  },
  {
    id: "look-05",
    image: "/images/almarise/almarise-reborn-red-saree-shrug-madrid-steps.jpeg",
    imagePosition: "50% 20%",
    alt: {
      en: "Woman wearing a flowing red garment cut from an Indian saree on stone steps in daylight in Madrid",
      es: "Mujer vestida con una prenda fluida en rojo cortada de un sari indio sobre una escalinata de piedra en Madrid",
    },
  },
  {
    id: "look-06",
    image:
      "/images/almarise/almarise-reborn-magenta-saree-shrug-principe-pio.jpeg",
    imagePosition: "50% 20%",
    alt: {
      en: "Outdoor portrait beneath stone arches in Madrid wearing a flowing magenta saree kimono with gold motifs over black",
      es: "Retrato exterior bajo arcos de piedra en Madrid con un kimono fucsia de motivos dorados sobre vestido negro",
    },
  },
];

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 16 16"
      width="15"
      height="15"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="editorial-arrow-icon shrink-0"
    >
      <path d="M3.5 8h9m0 0-3.5-3.5M12.5 8 9 11.5" />
    </svg>
  );
}

export function AlmarisePageClient({
  lang = "en",
}: {
  lang?: SiteLanguage;
} = {}) {
  const language = lang;
  const localizeHref = (href: string) => localizePath(href, language);
  const isEs = language === "es";

  const seenReferenceIds = new Set<string>();
  const cupboardParagraphSegments = segmentParagraphWithReferences(
    isEs
      ? "En los hogares indios llaman thevnitlya sadya a esos saris que mujeres indias han guardado durante años y que tienen una historia que contar. Suelen llegar como obsequio en bodas o celebraciones muy señaladas. Envuelta en esa tela de algodón, lino o seda, una madre pudo tener en brazos a su hijo, bailar en una verbena familiar o posar para el retrato que hoy descansa en el aparador."
      : "In Indian homes, families call them thevnitlya sadya. They are treasured sarees gifted for weddings, festivals, and family milestones that women have kept folded away in cupboards for years, each carrying a personal story. Wearing that length of cotton, linen, or silk, a mother may have held her child, danced at a celebration, or posed for a photograph the family still keeps on the shelf.",
    language,
    seenReferenceIds,
  );

  const transformationStepSegments = transformationSteps.map((step) =>
    segmentParagraphWithReferences(
      step.body[language],
      language,
      seenReferenceIds,
    ),
  );

  const trainingPurposeParagraphSegments = segmentParagraphWithReferences(
    isEs
      ? "Detrás de esta marca late también nuestro compromiso humano en la India. En paralelo a la vertiente comercial, tramitamos la figura jurídica de una fundación Section 8 que sostenga la futura Iniciativa de formación para mujeres. El proyecto sigue en preparación y aún no abre plazas. Nuestro objetivo es práctico: enseñar patronaje y confección con rigor, abrir una segunda oportunidad real y generar trabajo remunerado digno con el tiempo."
      : "AlmaRise D Brand also carries the human purpose behind our work in India. Alongside our commercial activity, we are laying the legal groundwork for a Section 8 foundation to back our planned Women's Training Initiative in India. The programme is still in preparation and applications are not yet open. Our aim is practical: teach design and stitching skills with rigour, open a real second chance, and create dignified paid work over time.",
    language,
    seenReferenceIds,
  );

  return (
    <>
      <AlmariseScrollChoreography />
      <main id="main">
        {/* 1. Full-Bleed Dark Editorial Photo Hero */}
        <section
          className="hero almarise-hero"
          data-chat-avoid
          data-surface="dark"
          id="top"
        >
          <div className="hero-wrapper" data-hero-wrapper>
            <div
              className="hero-cover almarise-hero-media"
              data-hero-media
              data-slot="almarise-hero-banner"
            >
              <Image
                src="/images/almarise/alma-inspecting-blue-embroidered-saree-studio.jpg"
                alt={
                  isEs
                    ? "Alma y una confeccionista sujetando un sari azul bordado frente a los ventanales luminosos de nuestro estudio en la India"
                    : "Alma and a garment maker holding an embroidered blue saree in natural daylight inside our studio in India"
                }
                fill
                priority
                sizes="100vw"
                className="object-cover object-[50%_20%]"
              />
            </div>
            <div className="hero-scrim" aria-hidden="true" />

            <div className="hero-content container" data-hero-content>
              <h1 data-hero-title>
                <span className="hero-headline-line" data-hero-line>
                  AlmaRise D Brand,
                </span>{" "}
                <span className="hero-headline-line" data-hero-line>
                  {isEs
                    ? "una segunda vida textil."
                    : "crafted for a second life."}
                </span>
              </h1>

              <div className="hero-sub" data-hero-sub>
                <p className="hero-lead">
                  {isEs
                    ? "Nuestra marca propia de moda sostenible y hogar creada en la India para España y el resto de Europa: AlmaRise D Reborn, AlmaRise D Organic y AlmaRise D Home Decor."
                    : "Our own sustainable fashion and lifestyle label built in India for Spain and the rest of Europe: AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor."}
                </p>
                <div className="hero-actions">
                  <a className="hero-primary" href="#almarise-d-reborn">
                    {isEs
                      ? "Explorar las tres líneas"
                      : "Explore the three lines"}
                  </a>
                  <Link
                    className="hero-secondary-cta press-scale inline-flex min-h-[var(--control-height)] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-paper)]/55 bg-[var(--color-night)]/40 px-6 py-3 text-center text-[length:var(--text-md)] font-semibold text-[var(--color-paper)] no-underline backdrop-blur-sm transition-colors hover:border-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-night)]"
                    href={localizeHref("/contact")}
                  >
                    {isEs
                      ? "Pregúntanos por AlmaRise D Brand"
                      : "Ask about AlmaRise D Brand"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Breadcrumb + Pillar 1: AlmaRise D Reborn */}
        <section
          className="bg-[var(--color-paper)] pt-[var(--space-2xl)] pb-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="almarise-d-reborn"
        >
          <div className="container grid gap-[var(--space-xl)]">
            <nav
              aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
              className="flex items-center gap-2 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] uppercase"
            >
              <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                <li>
                  <Link
                    className="inline-flex min-h-[var(--tap-min)] min-w-[var(--tap-min)] items-center text-[var(--color-muted)] no-underline transition-colors hover:text-[var(--color-forest-deep)]"
                    href={localizeHref("/")}
                  >
                    {isEs ? "Inicio" : "Home"}
                  </Link>
                </li>
                <li aria-hidden="true" className="text-[var(--color-muted)]/60">
                  /
                </li>
                <li
                  aria-current="page"
                  className="inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-clay-ink)]"
                >
                  AlmaRise D Brand
                </li>
              </ol>
            </nav>

            <div className="grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
              <div
                className="grid gap-[var(--space-md)] lg:col-span-6"
                data-choreo="almarise-section-header"
              >
                <Image
                  src="/brand/almarise-d-brand-logo.png"
                  alt="AlmaRise D Brand"
                  width={723}
                  height={607}
                  sizes="(max-width: 40rem) 144px, 180px"
                  className="h-auto w-[144px] sm:w-[176px]"
                />
                <h2 className="m-0 max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                  {isEs
                    ? "AlmaRise D Reborn: saris guardados, cortados para tu día a día"
                    : "AlmaRise D Reborn: kept sarees cut for active days"}
                </h2>
                <p className="lead m-0 max-w-[52ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Todo arrancó aquí. Antes de confeccionar un solo bolso para ningún comercio europeo, soñamos con un proyecto propio que uniera el nombre de Alma con la palabra Rise: levantar buen oficio a plena luz y devolver vida a telas nobles."
                    : "The project started here. Before we produced a single leather bag for a retail client, AlmaRise D Brand paired Alma's name with Rise: lifting good craft into the open and letting fine materials live again."}
                </p>
                <p className="m-0 max-w-[56ch] text-[var(--color-ink-2)]">
                  <StoryReferenceSegments
                    segments={cupboardParagraphSegments}
                    lang={language}
                  />
                </p>
                <p className="m-0 max-w-[56ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Casi nadie tiene tiempo de envolverse en cinco u ocho metros de seda antes del metro, ni una modista enfrente para entallar la blusa. Cortamos cada sari guardado en una prenda lista en segundos sobre unos vaqueros o básicos lisos de tu armario. Empieza siendo el sari de una mujer en la India, lo cosen mujeres en nuestro estudio y lo viste otra mujer en Europa."
                    : "Almost nobody has time to drape five to nine yards of silk before catching the morning metro, or a corner tailor to stitch a fitted blouse. We cut each kept saree into a garment you slip on in seconds over plain black, white, or denim already in your wardrobe. It starts as a woman's saree in India, women stitch it in our studio, and another woman wears it in Europe."}
                </p>
                <div className="grid gap-1 pt-2">
                  <Link
                    className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                    href={localizeHref(
                      "/stories/giving-maharashtrian-sarees-a-second-life",
                    )}
                  >
                    <span>
                      {isEs
                        ? "Leer cómo empezó AlmaRise D Brand y la reacción de María en Madrid"
                        : "Read how AlmaRise D Brand started and Maria's reaction in Madrid"}
                    </span>
                    <ArrowIcon />
                  </Link>
                  <Link
                    className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-clay)]/70 underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                    href={localizeHref(
                      "/stories/stone-forts-and-woven-borders-in-maharashtra",
                    )}
                  >
                    <span>
                      {isEs
                        ? "Leer a Shirish sobre cenefas tejidas y saris guardados en Maharashtra"
                        : "Read Shirish on Maharashtra's handloom borders and kept sarees"}
                    </span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6" data-choreo="almarise-reveal">
                <figure className="editorial-photo-frame relative mx-auto my-0 aspect-[4/5] w-full max-w-[32rem] bg-[var(--color-dune)] lg:max-w-none">
                  <Image
                    src="/images/almarise/indian-family-saree-handover-almarise.jpeg"
                    alt={
                      isEs
                        ? "Alma junto a una mujer en la India sosteniendo saris de seda doblados en naranja, verde y fucsia con remates dorados"
                        : "Alma and an Indian woman holding folded orange, green, and magenta silk sarees with woven gold borders"
                    }
                    fill
                    sizes="(max-width: 64rem) 100vw, 48vw"
                    className="object-cover"
                  />
                </figure>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* 3. Studio Transformation & Madrid Lookbook */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="how-a-saree-becomes-a-garment"
        >
          <div className="container grid gap-[var(--space-xl)] md:gap-[var(--space-2xl)]">
            <div data-choreo="almarise-section-header">
              <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                {isEs
                  ? "Cómo un sari se convierte en una prenda"
                  : "How a saree becomes a garment"}
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-3">
              {transformationSteps.map((step, index) => (
                <article
                  key={step.id}
                  className="grid content-start gap-4"
                  data-choreo="almarise-reveal"
                >
                  <figure className="editorial-photo-frame relative m-0 aspect-[4/3] bg-[var(--color-paper)]">
                    <Image
                      src={step.image}
                      alt={step.imageAlt[language]}
                      fill
                      sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                      className="object-cover"
                      style={
                        step.imagePosition
                          ? { objectPosition: step.imagePosition }
                          : undefined
                      }
                    />
                  </figure>
                  <h3 className="m-0 text-[length:var(--text-2xl)] font-normal">
                    {step.title[language]}
                  </h3>
                  <p className="m-0 max-w-[52ch] text-[var(--color-ink-2)]">
                    <StoryReferenceSegments
                      segments={transformationStepSegments[index] ?? []}
                      lang={language}
                    />
                  </p>
                </article>
              ))}
            </div>

            <div
              className="mt-[var(--space-2xl)] grid gap-[var(--space-xl)] md:gap-[var(--space-2xl)]"
              id="madrid-lookbook"
            >
              <div
                className="grid gap-[var(--space-md)] lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]"
                data-choreo="almarise-section-header"
              >
                <div className="grid gap-3 lg:col-span-5">
                  <h2 className="m-0 max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                    {isEs
                      ? "Piezas irrepetibles en las calles de Madrid"
                      : "One-off pieces on the streets of Madrid"}
                  </h2>
                </div>
                <div className="grid gap-4 lg:col-span-7">
                  <p className="lead m-0 max-w-[48ch] text-[var(--color-ink-2)]">
                    {isEs
                      ? "Describir de palabra cómo sienta un sari reconvertido suele quedarse corto hasta que te lo ves puesto. Cuando Alma aterrizó en Madrid cargando una maleta con los primeros prototipos sin haber adelantado ninguna fotografía, María miró el primer diseño colgado y preguntó: «¿Esto qué es?». No encajaba nada con su estilo habitual."
                      : 'Explaining an upcycled Indian saree garment on paper rarely convinces anyone until they put it on. When Alma carried a suitcase of early AlmaRise D Reborn pieces to Madrid without sending a single preview photo beforehand, Maria looked at the first garment on a hanger and asked, "What is this?" It looked nothing like her usual style.'}
                  </p>
                  <p className="m-0 max-w-[48ch] text-[var(--color-muted)]">
                    {isEs
                      ? "Alma le había puesto una sola condición: llevar básicos suyos en negro, blanco y tela vaquera. Bastó que María pisara las calles madrileñas sabiendo que nadie más poseía aquella pieza para rendirse al resultado. La gente se paraba a preguntar dónde se compraba, y al caer la noche María escogió un diseño y se lo quedó para ella."
                      : "Alma had given her only one instruction: bring plain clothes you already own in black, white, and denim. Once Maria stepped onto the streets of Madrid knowing nobody else owned that garment, everything clicked. Passers-by stopped to ask where the pieces came from, and before nightfall Maria chose one for herself and kept it."}
                  </p>
                </div>
              </div>

              <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-3">
                {lookbookItems.map((item) => (
                  <figure
                    key={item.id}
                    className="m-0"
                    data-choreo="almarise-reveal"
                  >
                    <div className="editorial-photo-frame relative mx-auto aspect-[3/4] w-full max-w-[26rem] bg-[var(--color-paper)] sm:max-w-none">
                      <Image
                        src={item.image}
                        alt={item.alt[language]}
                        fill
                        sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                        className="object-cover"
                        style={{ objectPosition: item.imagePosition }}
                      />
                    </div>
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* 4. Pillar 2: AlmaRise D Organic */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="almarise-d-organic"
        >
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div
              className="grid gap-[var(--space-md)] lg:col-span-6"
              data-choreo="almarise-section-header"
            >
              <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                {isEs
                  ? "AlmaRise D Organic: fibras vegetales y tintes orgánicos con caída natural"
                  : "AlmaRise D Organic: fruit and plant waste spun into breathable cloth"}
              </h2>
              <p className="m-0 max-w-[56ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "AlmaRise D Organic camina junto a AlmaRise D Reborn bajo el mismo pulso: reducir residuo, trabajar fibras naturales y coser ropa ligera que cuida la piel. En vez de sintéticos, empleamos tintes orgánicos y telas transpirables hiladas con residuos de frutas y plantas como caña de azúcar, naranja, plátano y piña, entre otros, con una caída fluida pensada para el clima cálido."
                  : "AlmaRise D Organic walks beside AlmaRise D Reborn under the same rule: reduce waste, honour natural fibres, and stitch airy garments gentle on the skin. Instead of synthetics, we work with organic dyes and breathable cloth spun from fruit and plant waste, including sugarcane, orange, banana, and pineapple, among others, with a fluid natural drape built for warm weather."}
              </p>
              <p className="m-0 max-w-[56ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Ahora mismo afinamos las muestras de AlmaRise D Organic en la India, comprobando tacto, caída, aguante del tinte y respuesta al lavado antes de lanzar ninguna tirada."
                  : "We are refining early AlmaRise D Organic pieces in India, checking drape, colour fastness, and wash behaviour by hand before releasing garments."}
              </p>
            </div>

            <div className="lg:col-span-6" data-choreo="almarise-reveal">
              <figure className="editorial-photo-frame relative mx-auto my-0 aspect-[4/5] w-full max-w-[32rem] bg-[var(--color-dune)] lg:max-w-none">
                <Image
                  src="/images/capabilities/natural-fabrics.jpg"
                  alt={
                    isEs
                      ? "Pila doblada de tejidos naturales de lino y algodón en tonos oliva, crema, terracota, salvia, ocre y pizarra bajo luz natural"
                      : "Folded stack of natural linen and cotton fabrics in olive, cream, terracotta, sage, ochre, and slate tones in warm daylight"
                  }
                  fill
                  sizes="(max-width: 64rem) 100vw, 48vw"
                  className="object-cover object-center"
                />
              </figure>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* 5. Pillar 3: AlmaRise D Home Decor */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="almarise-d-home-decor"
        >
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div
              className="grid gap-[var(--space-md)] lg:col-span-6"
              data-choreo="almarise-section-header"
            >
              <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                {isEs
                  ? "AlmaRise D Home Decor: el mismo oficio en tu casa"
                  : "AlmaRise D Home Decor: carrying the craft into living spaces"}
              </h2>
              <p className="m-0 max-w-[56ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Junto a AlmaRise D Reborn y AlmaRise D Organic, llevamos el mismo listón al hogar: materias naturales francas, color comprobado a luz natural y acabados cuidados con artesanas textiles de la India."
                  : "Alongside AlmaRise D Reborn and AlmaRise D Organic, we are bringing the same standard into living spaces: honest natural materials, colour checked in daylight, and clean hand finishing with Indian textile artisans."}
              </p>
              <p className="m-0 max-w-[56ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Las primeras piezas están tomando forma en el estudio. Apúntate abajo a nuestras cartas para enterarte, o escríbenos si quieres desarrollar una línea textil de hogar para tu propia tienda."
                  : "Our first home pieces are taking shape in India. Join our letters below for updates, or write to us if you want to develop a home textile line for your own shop."}
              </p>
              <div className="pt-2">
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/contact")}
                >
                  <span>
                    {isEs
                      ? "Pregúntanos por AlmaRise D Brand o próximos lanzamientos"
                      : "Ask us about AlmaRise D Brand or upcoming pieces"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6" data-choreo="almarise-reveal">
              <figure className="editorial-photo-frame relative m-0 aspect-[4/3] w-full bg-[var(--color-paper)]">
                <Image
                  src="/images/culture/maharashtra-handloom-zari-border.jpg"
                  alt={
                    isEs
                      ? "Manos artesanas tejiendo una cenefa dorada y carmesí en un telar de madera con lanzaderas junto a madejas de hilo natural"
                      : "Artisan hands weaving a gold and crimson patterned cloth border on a wooden handloom with wooden shuttles beside skeins of natural yarn"
                  }
                  fill
                  sizes="(max-width: 64rem) 100vw, 48vw"
                  className="object-cover object-center"
                />
              </figure>
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="pale-sage" />

        {/* 6. At Work in India + Related Links + Newsletter */}
        <section
          className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="studio-and-letters"
        >
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            <div
              className="grid gap-[var(--space-md)] lg:col-span-7"
              data-choreo="almarise-section-header"
            >
              <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                {isEs
                  ? "Lo que nos enseña levantar nuestra propia marca"
                  : "Why building our own brand makes us better makers"}
              </h2>
              <p className="m-0 max-w-[48ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Sacar adelante AlmaRise D Brand nos mantiene cada semana probando telas, ajustando patrones uno a uno, vigilando tintes orgánicos y repasando costuras en la India. Cualquier duda de una tienda sobre textura, caída o remates la resolvemos primero en nuestras propias piezas."
                  : "Building AlmaRise D Brand keeps our hands on fabric testing, individual patterns, organic dyes, and seam checks every week in India. Every question a shop owner asks about drape, cloth feel, or finishing is one we solve first on our own pieces."}
              </p>
              <p className="m-0 max-w-[48ch] text-[var(--color-ink-2)]">
                <StoryReferenceSegments
                  segments={trainingPurposeParagraphSegments}
                  lang={language}
                />
              </p>
            </div>

            <div
              className="grid gap-1.5 lg:col-span-5 lg:pt-8"
              data-choreo="almarise-reveal"
            >
              <Link
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/manufacturing")}
              >
                <span>
                  {isEs
                    ? "Ver cómo fabricamos para otras marcas"
                    : "See how we manufacture for brands"}
                </span>
                <ArrowIcon />
              </Link>
              <Link
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-medium text-[var(--color-ink-2)] underline decoration-[var(--color-clay)]/70 underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/womens-training-initiative")}
              >
                <span>
                  {isEs
                    ? "Leer sobre la futura Iniciativa de formación para mujeres"
                    : "Read about the planned Women's Training Initiative"}
                </span>
                <ArrowIcon />
              </Link>
              <a
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-medium text-[var(--color-ink-2)] underline decoration-[var(--color-clay)]/70 underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                href={OFFICIAL_SOCIALS.almariseInstagram}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>
                  {isEs
                    ? "Seguir a @almarisedbrand en Instagram"
                    : "Follow @almarisedbrand on Instagram"}
                </span>
                <ArrowIcon />
                <span className="sr-only">
                  {isEs
                    ? " (se abre en una pestaña nueva)"
                    : " (opens in a new tab)"}
                </span>
              </a>
            </div>

            <div
              className="mt-4 grid items-center gap-[var(--gap-columns)] pt-[var(--space-xl)] lg:col-span-12 lg:grid-cols-12"
              data-choreo="almarise-reveal"
            >
              <div className="grid gap-2 lg:col-span-5">
                <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                  {isEs
                    ? "Sigue AlmaRise D Brand y nuestras notas por correo"
                    : "Follow AlmaRise D Brand and our studio notes by email"}
                </h3>
                <p className="m-0 max-w-[52ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Una carta cada dos semanas firmada por Alma o Shirish con avances del estudio, nuevas piezas en camino y vida cotidiana entre España y la India."
                    : "One letter every two weeks from Alma or Shirish with studio updates, new pieces taking shape, and everyday life between Spain and India."}
                </p>
              </div>
              <div className="lg:col-span-7">
                <NewsletterForm
                  variant="light"
                  source="AlmaRise D Brand Page"
                  defaultTrack="almarise"
                />
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="night" size="gentle" />
      </main>

      <SiteFooter hideNewsletter />
    </>
  );
}
