import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { MediaPlaceholder } from "@/components/stories/media-placeholder";
import { StoryReferenceSegments } from "@/components/stories/story-reference-text";
import { segmentParagraphWithReferences } from "@/data/story-references";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const ALMARISE_LAST_UPDATED = {
  iso: "2026-11-24",
  en: "24 November 2026",
  es: "24 de noviembre de 2026",
} as const;

interface PillarOverviewRow {
  readonly id: string;
  readonly anchor: string;
  readonly name: Record<SiteLanguage, string>;
  readonly materialsPrefix: Record<SiteLanguage, string>;
  readonly materialsItalic?: string;
  readonly materialsSuffix?: Record<SiteLanguage, string>;
  readonly creates: Record<SiteLanguage, string>;
  readonly cta: Record<SiteLanguage, string>;
}

const pillarOverviewRows: readonly PillarOverviewRow[] = [
  {
    id: "reborn",
    anchor: "#almarise-reborn",
    name: {
      en: "AlmaRise D Reborn",
      es: "AlmaRise D Reborn",
    },
    materialsPrefix: {
      en: "Kept Indian sarees in breathable cotton, linen, and silk (",
      es: "Saris indios guardados de algodón, lino o seda (",
    },
    materialsItalic: "thevnitlya sadya",
    materialsSuffix: {
      en: ")",
      es: ")",
    },
    creates: {
      en: "One-of-a-kind shrugs, kimonos, tunics, loose jackets, and dresses",
      es: "Shrugs, kimonos, túnicas, chaquetas sueltas y vestidos irrepetibles",
    },
    cta: {
      en: "Explore AlmaRise D Reborn",
      es: "Ver AlmaRise D Reborn",
    },
  },
  {
    id: "organic",
    anchor: "#almarise-organic",
    name: {
      en: "AlmaRise D Organic",
      es: "AlmaRise D Organic",
    },
    materialsPrefix: {
      en: "Organic dyes and breathable plant- and fruit-waste fibres from sugarcane, orange, banana, and pineapple, among others",
      es: "Tintes orgánicos y fibras de residuos de frutas y plantas como caña de azúcar, naranja, plátano y piña, entre otros",
    },
    creates: {
      en: "Fluid everyday garments with natural drape for warm weather",
      es: "Prendas de uso diario frescas con una caída maravillosa",
    },
    cta: {
      en: "Explore AlmaRise D Organic",
      es: "Ver AlmaRise D Organic",
    },
  },
  {
    id: "home-decor",
    anchor: "#almarise-home-decor",
    name: {
      en: "AlmaRise D Home Decor",
      es: "Decoración del hogar de AlmaRise D Brand",
    },
    materialsPrefix: {
      en: "Natural materials and small-batch Indian craft in active studio development",
      es: "Materias naturales y oficio cuidado en fase de creación",
    },
    creates: {
      en: "Tactile objects for living spaces in Spain and the rest of Europe",
      es: "Objetos y piezas para vivir el hogar en España y el resto de Europa",
    },
    cta: {
      en: "Explore AlmaRise D Home Decor",
      es: "Ver decoración del hogar",
    },
  },
];

interface TransformationStep {
  readonly number: string;
  readonly title: Record<SiteLanguage, string>;
  readonly body: Record<SiteLanguage, string>;
  readonly image: string;
  readonly imageAlt: Record<SiteLanguage, string>;
}

const transformationSteps: readonly TransformationStep[] = [
  {
    number: "01",
    title: {
      en: "Source with respect",
      es: "Seleccionar con respeto",
    },
    body: {
      en: "Families across India keep wedding and festival sarees long after they stop wearing them, and every one carries the memory of the woman who saved it. We never treat these textiles as cast-offs. We acquire each saree through a fair payment or voluntary donation, inspect the cotton, linen, or silk weave by hand, and note the saree's story whenever its owner agrees to share it.",
      es: "Muchas familias conservan saris de fiesta tiempo después de dejar de ponérselos, cargados de memoria personal. Nunca los miramos como sobras. Los adquirimos pagando una suma justa o aceptando una donación voluntaria, examinamos la trama a mano y recogemos el relato de la dueña cuando nos da permiso para contarlo.",
    },
    image: "/images/almarise/stone-archway-garment-studio.jpg",
    imageAlt: {
      en: "Garment makers examining woven Indian textiles inside a bright studio room in India.",
      es: "Modistas examinando textiles tradicionales indios en una sala luminosa.",
    },
  },
  {
    number: "02",
    title: {
      en: "One saree, one pattern",
      es: "Un patrón distinto para cada sari",
    },
    body: {
      en: "Standard factory runs cut a hundred or two hundred identical garments off a single graded pattern. Every kept saree arrives with its own cloth weight, decorative pallu end, and woven zari border. We draft an individual pattern from scratch for each piece so those woven borders naturally frame a sleeve, lapel, or hem. No second copy exists anywhere.",
      es: "Las tiradas industriales cortan doscientas unidades calcadas siguiendo una sola plantilla escalada. Cada sari guardado trae en cambio su propio peso, su pallu estampado y sus bordes tejidos con hilo zari. Dibujamos un molde desde cero para cada tela buscando que las cenefas encuadren justo las mangas o el bajo. No existe otra copia igual.",
    },
    image: "/images/almarise/alma-draping-saree-dress-form-studio.jpeg",
    imageAlt: {
      en: "Alma and a garment maker checking pattern placement on an embroidered saree on a dressmaker form.",
      es: "Alma revisando con una patronista el encaje de un sari bordado sobre un maniquí.",
    },
  },
  {
    number: "03",
    title: {
      en: "Tailored for active days",
      es: "Pensado para tu rutina diaria",
    },
    body: {
      en: "Women in our studio in India cut and stitch each saree into practical shrugs, kimonos, tunics, loose jackets, and dresses that breathe through spring and summer. We keep the word shrug for both open and closed outer pieces because it describes what they do best: throw one on over basics for work, commuting, dinner with friends, or a late-summer wedding.",
      es: "Artesanas de nuestro espacio de confección cortan y cosen cada modelo en shrugs, kimonos, túnicas, chaquetas sueltas y vestidos frescos que dejan respirar la piel cuando sube el calor. Conservamos a propósito la voz shrug tanto para cortes abiertos como cerrados porque clava su utilidad: te lo echas por encima en un momento para ir a la oficina o salir a cenar con amigas, e incluso para arreglarte en una boda al acabar el verano.",
    },
    image: "/images/almarise/women-artisans-garment-workshop.jpg",
    imageAlt: {
      en: "Women artisans cutting and stitching saree garments beside sewing machines in a sunlit studio in India.",
      es: "Costureras trabajando entre máquinas de coser bajo luz natural.",
    },
  },
];

interface LookbookItem {
  readonly id: string;
  readonly image: string;
  readonly alt: Record<SiteLanguage, string>;
}

const lookbookItems: readonly LookbookItem[] = [
  {
    id: "look-01",
    image:
      "/images/almarise/almarise-reborn-olive-pallu-shrug-madrid-street.jpeg",
    alt: {
      en: "Maria walking across a sunlit brick street in Madrid wearing a sheer saree shrug over a plain black dress.",
      es: "María paseando por una calle soleada de Madrid con un shrug vaporoso sobre un vestido negro liso.",
    },
  },
  {
    id: "look-02",
    image:
      "/images/almarise/almarise-reborn-geometric-saree-tunic-madrid-station.jpeg",
    alt: {
      en: "Full-length outdoor portrait of Maria in Madrid wearing an asymmetric rust and black geometric saree tunic.",
      es: "Retrato al aire libre de María con una túnica asimétrica de dibujo geométrico en tono teja y negro.",
    },
  },
  {
    id: "look-03",
    image: "/images/almarise/almarise-reborn-bandhani-saree-shrug-madrid.jpeg",
    alt: {
      en: "Seated outdoor portrait in Madrid pairing an orange and yellow bandhani saree kimono with denim jeans.",
      es: "Retrato sentado en exterior combinando un kimono bandhani naranja y amarillo con vaqueros.",
    },
  },
];

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
      ? "Detrás de esta marca late también nuestro compromiso humano en la India. En paralelo a la vertiente comercial, tramitamos la figura jurídica de una fundación Section 8 que sostenga la futura Iniciativa de formación para mujeres. El proyecto sigue en preparación y aún no abre plazas. Nada de esto parte de la caridad: queremos enseñar patronaje y confección con rigor para abrir una segunda oportunidad real hacia un empleo remunerado digno."
      : "AlmaRise D Brand also carries the human purpose behind our work in India. Alongside our commercial activity, we are laying the legal groundwork for a Section 8 foundation to back our planned Women's Training Initiative in India. The programme is still in preparation and applications are not yet open. Our aim is straightforward and has nothing to do with charity: teach practical design and stitching skills, offer a real second chance, and create dignified paid work over time.",
    language,
    seenReferenceIds,
  );

  return (
    <>
      <main id="main">
        {/* 1. Breadcrumb + Entity Definition Hero */}
        <section className="bg-[var(--color-forest-deep)] pt-[calc(var(--nav-height)+var(--space-2xl))] pb-[var(--section-gap-s)] text-[var(--color-paper)]">
          <div className="container grid gap-[var(--space-xl)] lg:gap-[var(--space-2xl)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[var(--color-paper)]/18 py-3.5 text-[length:var(--text-xs)] font-semibold tracking-[0.08em] uppercase">
              <nav
                aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
                className="flex items-center gap-2"
              >
                <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                  <li>
                    <Link
                      className="text-[var(--color-paper-2)]/80 no-underline transition-colors hover:text-[var(--color-paper)]"
                      href={localizeHref("/")}
                    >
                      {isEs ? "Inicio" : "Home"}
                    </Link>
                  </li>
                  <li
                    aria-hidden="true"
                    className="text-[var(--color-paper-2)]/55"
                  >
                    /
                  </li>
                  <li aria-current="page" className="text-[var(--color-gold)]">
                    AlmaRise D Brand
                  </li>
                </ol>
              </nav>
              <span className="text-[var(--color-paper-2)]/80">
                {isEs
                  ? "AlmaRise D Reborn · AlmaRise D Organic · Decoración del hogar"
                  : "AlmaRise D Reborn · AlmaRise D Organic · AlmaRise D Home Decor"}
              </span>
            </div>

            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-md)] lg:col-span-5">
                <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-light)] uppercase">
                  {isEs
                    ? "Una marca de moda y estilo de vida de KarmaRise D Global"
                    : "A fashion and lifestyle brand by KarmaRise D Global"}
                </p>
                <h1 className="text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-normal text-[var(--color-paper)]">
                  AlmaRise D Brand
                </h1>
              </div>

              <div className="grid gap-4 lg:col-span-7">
                <p className="lead m-0 max-w-[58ch] text-[var(--color-paper-2)]">
                  {isEs
                    ? "AlmaRise D Brand es la marca propia de moda sostenible y estilo de vida fundada por Alma y Shirish bajo el paraguas de KarmaRise D Global. Creada en la India para España y el resto de Europa, da una segunda vida a materias naturales a través de tres líneas: AlmaRise D Reborn (prendas de uso diario irrepetibles a partir de saris indios guardados), AlmaRise D Organic (telas transpirables de residuos vegetales con tintes orgánicos) y nuestra apuesta por la decoración del hogar."
                    : "AlmaRise D Brand is the sustainable fashion and lifestyle label founded by Alma and Shirish under KarmaRise D Global. Built in India for Spain and the rest of Europe, it gives natural materials a second life across three lines: AlmaRise D Reborn (one-of-a-kind everyday garments cut from kept Indian sarees), AlmaRise D Organic (breathable fabrics spun from fruit and plant waste with organic dyes), and AlmaRise D Home Decor."}
                </p>
                <p className="m-0 max-w-[58ch] text-[length:var(--text-md)] leading-[1.65] text-[var(--color-paper-2)]/88">
                  {isEs
                    ? "En realidad, todo arrancó aquí. Antes de confeccionar un solo bolso para ningún comercio europeo, soñamos con un proyecto propio que uniera el nombre de Alma con la palabra Rise: levantar buen oficio a plena luz y devolver vida a telas nobles."
                    : "The project actually started here. Before we produced a single leather bag for a retail Client, AlmaRise D Brand carried Alma's name paired with Rise, a quiet wish to lift good work into the open and let fine materials live again."}
                </p>
              </div>
            </div>

            <figure className="relative m-0 aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-paper)]/15 bg-[var(--color-night)]">
              <Image
                src="/images/almarise/almarise-reborn-red-saree-shrug-madrid-steps.jpeg"
                alt={
                  isEs
                    ? "Mujer vestida con un vestido rojo fluido hecho de un sari indio sobre una escalinata de piedra a plena luz en España."
                    : "Woman wearing a flowing red dress cut from an Indian saree on stone steps in daylight in Spain."
                }
                fill
                priority
                sizes="(max-width: 80rem) 100vw, 1280px"
                className="object-cover object-[50%_28%]"
              />
            </figure>
          </div>
        </section>

        <SectionBridge from="forest-deep" to="paper" />

        {/* 2. Three-Pillar Overview Table */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="three-lines"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="grid gap-3 lg:col-span-6">
                <p className="section-index m-0">
                  {isEs ? "Tres líneas" : "Three lines"}
                </p>
                <h2 className="m-0 max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Tres líneas nacidas para dar una segunda vida"
                    : "Three lines built around a second life"}
                </h2>
              </div>
              <p className="m-0 max-w-[54ch] text-[var(--color-ink-2)] lg:col-span-6">
                {isEs
                  ? "Al constituir la empresa tuvimos claro que esta aventura no cabía en un solo perchero. Arrancamos pensando en ropa femenina pensada para primavera y verano, convencidos de que ese mismo respeto por la fibra y el acabado acabaría llegando a las telas orgánicas y al interior de las casas."
                  : "From the day we registered our company in India, AlmaRise D Brand was meant to grow beyond a single clothing rack. We started with women's fashion suited to warm spring and summer days, knowing the same respect for cloth, colour, and human hands would naturally extend into organic textiles and the home."}
              </p>
            </div>

            <div className="overflow-x-auto rounded-[var(--radius-panel)] border border-[var(--color-rule)] bg-[var(--color-white)]">
              <table className="w-full min-w-[680px] border-collapse text-left text-[length:var(--text-sm)]">
                <caption className="sr-only">
                  {isEs
                    ? "Resumen de las tres líneas de AlmaRise D Brand: AlmaRise D Reborn, AlmaRise D Organic y Decoración del hogar de AlmaRise D Brand"
                    : "Overview of the three AlmaRise D Brand lines: AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor"}
                </caption>
                <thead>
                  <tr className="border-b border-[var(--color-rule)] bg-[var(--color-dune)]/65 text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-forest-deep)] uppercase">
                    <th scope="col" className="w-[21%] px-5 py-4">
                      {isEs ? "Línea" : "Line"}
                    </th>
                    <th scope="col" className="w-[31%] px-5 py-4">
                      {isEs ? "Base material" : "Core materials"}
                    </th>
                    <th scope="col" className="w-[28%] px-5 py-4">
                      {isEs ? "Propuesta" : "What it creates"}
                    </th>
                    <th scope="col" className="w-[20%] px-5 py-4">
                      {isEs ? "Acceso directo" : "Jump to section"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-rule)] text-[var(--color-ink-2)]">
                  {pillarOverviewRows.map((row) => (
                    <tr key={row.id}>
                      <th
                        scope="row"
                        className="px-5 py-4 align-top font-semibold text-[var(--color-forest-deep)]"
                      >
                        {row.name[language]}
                      </th>
                      <td className="px-5 py-4 align-top leading-[1.6]">
                        {row.materialsPrefix[language]}
                        {row.materialsItalic ? (
                          <em>{row.materialsItalic}</em>
                        ) : null}
                        {row.materialsSuffix
                          ? row.materialsSuffix[language]
                          : null}
                      </td>
                      <td className="px-5 py-4 align-top leading-[1.6]">
                        {row.creates[language]}
                      </td>
                      <td className="px-5 py-4 align-top">
                        <a
                          href={row.anchor}
                          className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        >
                          {row.cta[language]}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* 3. Pillar 1: AlmaRise D Reborn + 3 Transformation Steps */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="almarise-reborn"
        >
          <div className="container grid gap-[var(--space-3xl)]">
            <div className="grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-md)] lg:col-span-6">
                <p className="section-index m-0">01 · AlmaRise D Reborn</p>
                <h2 className="m-0 max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "AlmaRise D Reborn: saris guardados, cortados para tu día a día"
                    : "AlmaRise D Reborn: kept sarees cut for active days"}
                </h2>
                <p className="m-0 text-[var(--color-ink-2)]">
                  <StoryReferenceSegments
                    segments={cupboardParagraphSegments}
                    lang={language}
                  />
                </p>
                <p className="m-0 text-[var(--color-ink-2)]">
                  {isEs
                    ? "Seamos francos. En España o en algún lugar de Europa casi nadie dispone de tiempo para envolverse en cinco u ocho metros de seda antes de correr al metro o coger el autobús. Tampoco tenemos una modista en la acera de enfrente lista para entallarnos la blusa. Por eso transformamos cada tela en prendas de uso diario pensadas para ponértelas en segundos encima de unos vaqueros o un vestido negro que ya duermen en tu ropero."
                    : "Almost nobody in Spain or elsewhere in Europe has time to drape five to nine yards of silk before catching the morning metro, local train, or bus. Nobody has a corner tailor on their street to stitch a fitted saree blouse either. So we cut each kept saree into an easy everyday garment you can slip on in seconds over plain black, plain white, or denim already hanging in your wardrobe."}
                </p>
                <p className="m-0 text-[var(--color-ink-2)]">
                  {isEs
                    ? "Ganan una segunda vida dos armarios a la vez. Un sari que reposaba doblado durante décadas despierta esos básicos lisos que llevas meses sin sacar de la percha. El círculo se cierra en una frase: empieza siendo el sari de una mujer en la India, lo cortan y cosen mujeres en nuestro estudio y lo viste otra mujer en España o el resto de Europa."
                    : "That way, two wardrobes gain a second life at once. An unworn Indian saree revives the forgotten staples sitting at the back of your closet, and the whole circle closes in one line: it starts as a woman's saree in India, women cut and stitch it in our studio, and a woman wears it in Spain or the rest of Europe."}
                </p>
                <div className="grid gap-1 pt-2">
                  <Link
                    className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={localizeHref(
                      "/stories/giving-maharashtrian-sarees-a-second-life",
                    )}
                  >
                    {isEs
                      ? "Leer cómo empezó AlmaRise D Brand y la reacción de María en Madrid"
                      : "Read how AlmaRise D Brand started and Maria's reaction in Madrid"}
                  </Link>
                  <Link
                    className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={localizeHref(
                      "/stories/stone-forts-and-woven-borders-in-maharashtra",
                    )}
                  >
                    {isEs
                      ? "Leer a Shirish sobre cenefas tejidas y saris guardados en Maharashtra"
                      : "Read Shirish on Maharashtra's handloom borders and kept sarees"}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-6">
                <figure className="relative mx-auto my-0 aspect-[4/5] w-full max-w-[32rem] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule-2)]/40 bg-[var(--color-paper)] lg:max-w-none">
                  <Image
                    src="/images/almarise/indian-family-saree-handover-almarise.jpeg"
                    alt={
                      isEs
                        ? "Alma junto a una mujer en la India sosteniendo saris de seda doblados en naranja, verde y fucsia con remates dorados."
                        : "Alma and an Indian woman holding folded orange, green, and magenta silk sarees with woven gold borders."
                    }
                    fill
                    sizes="(max-width: 64rem) 100vw, 48vw"
                    className="object-cover"
                  />
                </figure>
              </div>
            </div>

            <div className="grid gap-[var(--space-2xl)] border-t border-[var(--color-rule-2)]/40 pt-[var(--space-2xl)]">
              <div className="grid gap-[var(--space-md)]">
                <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Cómo un sari se convierte en una prenda"
                    : "How a saree becomes a garment"}
                </h2>
              </div>

              <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-3">
                {transformationSteps.map((step, index) => (
                  <article
                    key={step.number}
                    className="grid content-start gap-4"
                  >
                    <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule-2)]/40 bg-[var(--color-paper)]">
                      <Image
                        src={step.image}
                        alt={step.imageAlt[language]}
                        fill
                        sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                        className="object-cover"
                      />
                    </figure>
                    <span className="num text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-ink)]">
                      {step.number}
                    </span>
                    <h3 className="m-0 text-[length:var(--text-2xl)] font-normal">
                      {step.title[language]}
                    </h3>
                    <p className="m-0 text-[var(--color-ink-2)]">
                      <StoryReferenceSegments
                        segments={transformationStepSegments[index] ?? []}
                        lang={language}
                      />
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* 4. AlmaRise D Reborn Lookbook in Madrid */}
        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)] lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="grid gap-3 lg:col-span-5">
                <p className="section-index m-0">
                  {isEs ? "Galería en Madrid" : "Lookbook gallery"}
                </p>
                <h2 className="m-0 max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Piezas irrepetibles en las calles de Madrid"
                    : "One-off pieces on the streets of Madrid"}
                </h2>
              </div>
              <div className="grid gap-4 lg:col-span-7">
                <p className="lead m-0 max-w-[58ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Describir de palabra cómo sienta un sari reconvertido suele quedarse corto hasta que te lo ves puesto. Cuando Alma aterrizó en Madrid cargando una maleta con los primeros prototipos sin haber adelantado ninguna fotografía, María miró el primer diseño colgado y preguntó: «¿Esto qué es?». No encajaba nada con su estilo habitual."
                    : 'Explaining an upcycled Indian saree garment on paper rarely convinces anyone until they put it on. When Alma carried a suitcase of early AlmaRise D Reborn pieces to Madrid without sending a single preview photo beforehand, Maria looked at the first garment on a hanger and asked, "What is this?" It looked nothing like her usual style.'}
                </p>
                <p className="m-0 max-w-[58ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Alma le había puesto una sola condición: llevar básicos suyos en negro, blanco y tela vaquera. Bastó que María pisara las calles de ladrillo madrileñas y cruzara los arcos verdes de hierro de la antigua estación ferroviaria, caminando suelta al saber que nadie más poseía aquella pieza, para rendirse al resultado. La gente giraba la cabeza al cruzarse con ella y se paraba a preguntar dónde se compraba. Al caer la noche en aquella tarde de septiembre, María escogió un diseño y se lo quedó para ella."
                    : "Alma had given her only one instruction: bring plain clothes you already own in black, white, and denim. The moment Maria stepped onto the brick streets of Madrid and beneath the iron arches of the old railway station, walking freely knowing nobody else in the world owned that exact garment, everything clicked. Passers-by turned their heads and stopped to ask where the pieces came from. Before that September shoot wrapped at nightfall, Maria chose a piece for herself and kept it."}
                </p>
              </div>
            </div>

            <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-3">
              {lookbookItems.map((item) => (
                <figure key={item.id} className="m-0">
                  <div className="relative mx-auto aspect-[3/4] w-full max-w-[26rem] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] sm:max-w-none">
                    <Image
                      src={item.image}
                      alt={item.alt[language]}
                      fill
                      sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* 5. Pillar 2: AlmaRise D Organic */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="almarise-organic"
        >
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-md)] lg:order-2 lg:col-span-6">
              <p className="section-index m-0">02 · AlmaRise D Organic</p>
              <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                {isEs
                  ? "AlmaRise D Organic: fibras vegetales y tintes orgánicos con caída natural"
                  : "AlmaRise D Organic: fruit and plant waste spun into breathable cloth"}
              </h2>
              <p className="m-0 text-[var(--color-ink-2)]">
                {isEs
                  ? "AlmaRise D Reborn nació con recursos medidos y armarios repletos de recuerdos, aunque el deseo de trabajar materiales orgánicos nos acompaña desde el primer boceto. AlmaRise D Organic camina junto a AlmaRise D Reborn bajo el mismo pulso: reutilizar sobrantes agrícolas y coser ropa ligera que cuida la piel en los meses cálidos."
                  : "AlmaRise D Reborn grew out of full Indian cupboards and tight early funds, yet our original ambition around organic textiles never left the room. AlmaRise D Organic walks side by side with AlmaRise D Reborn under the exact same rule: reduce waste, honour natural fibres, and build airy garments that feel gentle against the skin."}
              </p>
              <p className="m-0 text-[var(--color-ink-2)]">
                {isEs
                  ? "En vez de tirar de sintéticos convencionales, empleamos tintes orgánicos y telas transpirables hiladas con residuos de frutas y plantas como caña de azúcar, naranja, plátano y piña, entre otros. Esas fibras se convierten en géneros suaves con una caída maravillosa, muy agradecidos para el clima de España y el resto de Europa."
                  : "Instead of conventional synthetic cloth, AlmaRise D Organic works with organic dyes and breathable fabrics spun from fruit and plant waste, including sugarcane, orange, banana, and pineapple, among others. Those agricultural fibres turn into light textiles with a fluid, natural drape made for warm weather across Spain and the rest of Europe."}
              </p>
              <p className="m-0 text-[var(--color-ink-2)]">
                {isEs
                  ? "Ahora mismo afinamos las muestras de AlmaRise D Organic junto a nuestra red de unidades de producción auditadas en la India, comprobando tacto, caída, aguante del tinte y respuesta al lavado antes de dar luz verde a ninguna tirada."
                  : "We are developing AlmaRise D Organic pieces directly through our Indian studio and vetted partner network, testing drape, colour fastness, and wash behaviour by hand before releasing garments."}
              </p>
            </div>

            <div className="lg:order-1 lg:col-span-6">
              <MediaPlaceholder
                kind="Photo"
                ratio="4:5"
                aspectClass="aspect-[4/5]"
                tone="dune"
                className="mx-auto max-w-[32rem] lg:max-w-none"
                title={
                  isEs
                    ? "Fotografía de estudio de AlmaRise D Organic próximamente"
                    : "AlmaRise D Organic studio photography coming soon"
                }
                description={
                  isEs
                    ? "Incorporaremos fotografía real de estudio con muestras de telas de caña de azúcar, naranja, plátano y piña y los prototipos teñidos con tintes orgánicos al cerrar esta ronda de pruebas."
                    : "Verified studio photography of AlmaRise D Organic fabric swatches and garment prototypes will be added once the current sampling round is photographed."
                }
              />
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* 6. Pillar 3: AlmaRise D Home Decor */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="almarise-home-decor"
        >
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-md)] lg:col-span-6">
              <p className="section-index m-0">
                {isEs
                  ? "03 · Decoración del hogar de AlmaRise D Brand"
                  : "03 · AlmaRise D Home Decor"}
              </p>
              <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                {isEs
                  ? "Decoración del hogar de AlmaRise D Brand: el mismo oficio en tu casa"
                  : "AlmaRise D Home Decor: carrying the craft into living spaces"}
              </h2>
              <p className="m-0 text-[var(--color-ink-2)]">
                {isEs
                  ? "Desde que arrancó el proyecto sabíamos que esta etiqueta iría más allá del vestidor. Junto a AlmaRise D Reborn y AlmaRise D Organic, ahora llevamos la marca hacia la decoración del hogar."
                  : "When we first imagined AlmaRise D Brand, we knew its purpose reached beyond clothing. Alongside AlmaRise D Reborn and AlmaRise D Organic, we are now expanding AlmaRise D Brand into home decor."}
              </p>
              <p className="m-0 text-[var(--color-ink-2)]">
                {isEs
                  ? "El listón no se mueve. Buscamos materias naturales francas, una textura agradable al tacto, colores trabajados en mano y acabados pulcros junto a unidades familiares de producción y colectivos de artesanas. Igual que nuestra ropa aporta personalidad al vestir cotidiano, esta vertiente traslada ese oficio real a las casas de España y el resto de Europa."
                  : "The standard stays identical. We look for honest natural materials, quiet hand-feel, colour developed in person rather than guessed from a screen, and clean finishing carried out with family-run production units and women artisan collectives in India. Just as our garments bring warmth and originality to everyday wear, AlmaRise D Home Decor brings Indian craft into daily life at home across Spain and the rest of Europe."}
              </p>
              <p className="m-0 text-[var(--color-ink-2)]">
                {isEs
                  ? "La propuesta está tomando forma ahora mismo entre nuestro equipo y los puntos de producción en la India. Si te apetece enterarte a medida que salgan los primeros artículos, apúntate debajo a nuestras cartas quincenales o escríbenos sin rodeos. Si llevas un comercio o una marca y quieres lanzar tu propia línea de decoración del hogar en la India, ya cubrimos esa categoría dentro de nuestro Programa de producción."
                  : "Our home decor line is currently taking shape inside our studio and partner network in India. If you would like early updates as pieces take form, join our biweekly letters below or write to us directly. If you run a retail shop or brand and want to develop your own-brand home decor collection in India, our Manufacturing Programme covers home decor as a core category."}
              </p>
              <div className="pt-2">
                <Link
                  className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/contact")}
                >
                  {isEs
                    ? "Pregúntanos por decoración del hogar y novedades"
                    : "Ask us about AlmaRise D Home Decor or future drops"}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <MediaPlaceholder
                kind="Photo"
                ratio="4:3"
                aspectClass="aspect-[4/3]"
                tone="light"
                title={
                  isEs
                    ? "Fotografía de decoración del hogar de AlmaRise D Brand próximamente"
                    : "AlmaRise D Home Decor photography coming soon"
                }
                description={
                  isEs
                    ? "Incorporaremos fotografía real de estudio de los primeros prototipos de decoración del hogar de AlmaRise D Brand en cuanto cierren las pruebas con nuestras unidades de producción en la India."
                    : "Verified photography of AlmaRise D Home Decor prototypes will be added as soon as our first studio pieces are finalised."
                }
              />
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="pale-sage" />

        {/* 7. At Work in India + Related Links + Freshness + Newsletter */}
        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-md)] lg:col-span-7">
              <p className="section-index m-0">
                {isEs ? "En marcha en la India" : "At work in India"}
              </p>
              <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                {isEs
                  ? "Lo que nos enseña levantar nuestra propia marca"
                  : "Why building our own brand makes us better makers"}
              </h2>
              <p className="m-0 text-[var(--color-ink-2)]">
                {isEs
                  ? "Sacar adelante AlmaRise D Brand nos obliga a tocar cada género, ajustar patrones uno a uno, vigilar tintadas orgánicas y repasar costuras codo con codo con fábricas de corte familiar y colectivos de artesanas. No hablamos de fabricación desde la barrera. Cualquier duda sobre textura o remate que preocupa a un comercio europeo la peleamos antes sobre nuestras propias piezas."
                  : "Developing AlmaRise D Brand puts our own hands on fibre testing, individual pattern drafting, organic dyeing, and seam checks inside our studio and across vetted family-run production units and women artisan collectives in India. We do not speak about Indian manufacturing from a distance. Every challenge a retail Client faces on cloth feel, drape, or finishing is something we solve first on our own pieces."}
              </p>
              <p className="m-0 text-[var(--color-ink-2)]">
                <StoryReferenceSegments
                  segments={trainingPurposeParagraphSegments}
                  lang={language}
                />
              </p>
              <p className="m-0 border-t border-[var(--color-forest-deep)]/15 pt-4 text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-muted)]">
                {isEs ? (
                  <>
                    Actualizado:{" "}
                    <time dateTime={ALMARISE_LAST_UPDATED.iso}>
                      {ALMARISE_LAST_UPDATED.es}
                    </time>
                  </>
                ) : (
                  <>
                    Updated:{" "}
                    <time dateTime={ALMARISE_LAST_UPDATED.iso}>
                      {ALMARISE_LAST_UPDATED.en}
                    </time>
                  </>
                )}
              </p>
            </div>

            <div className="grid gap-1.5 lg:col-span-5 lg:pt-8">
              <Link
                className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/manufacturing")}
              >
                {isEs
                  ? "Conocer el Programa de producción"
                  : "Explore the Manufacturing Programme"}
              </Link>
              <Link
                className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/womens-training-initiative")}
              >
                {isEs
                  ? "Leer sobre la futura Iniciativa de formación para mujeres"
                  : "Read about the planned Women's Training Initiative"}
              </Link>
              <Link
                className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref(
                  "/stories/giving-maharashtrian-sarees-a-second-life",
                )}
              >
                {isEs
                  ? "Leer cómo empezó AlmaRise D Brand y la reacción de María en Madrid"
                  : "Read how AlmaRise D Brand started and Maria's reaction in Madrid"}
              </Link>
              <Link
                className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref(
                  "/stories/stone-forts-and-woven-borders-in-maharashtra",
                )}
              >
                {isEs
                  ? "Leer a Shirish sobre cenefas tejidas y saris guardados en Maharashtra"
                  : "Read Shirish on Maharashtra's handloom borders and kept sarees"}
              </Link>
              <Link
                className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/contact")}
              >
                {isEs
                  ? "Pregúntanos por AlmaRise D Brand"
                  : "Ask us about AlmaRise D Brand"}
              </Link>
            </div>

            <div className="mt-4 grid items-center gap-[var(--gap-columns)] border-t border-[var(--color-forest-deep)]/15 pt-[var(--space-2xl)] lg:col-span-12 lg:grid-cols-12">
              <div className="grid gap-2 lg:col-span-5">
                <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-ink)] uppercase">
                  {isEs ? "Historias de KarmaRise" : "KarmaRise Stories"}
                </p>
                <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                  {isEs
                    ? "Sigue AlmaRise D Brand y nuestras notas por correo"
                    : "Follow AlmaRise D Brand and our studio notes by email"}
                </h3>
                <p className="m-0 text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Una carta cada dos semanas firmada por Alma o Shirish sobre saris guardados de AlmaRise D Reborn, tejidos vegetales de AlmaRise D Organic, avances en decoración del hogar, oficios indios y vida cotidiana entre España y la India."
                    : "One letter every two weeks from Alma or Shirish covering AlmaRise D Reborn kept sarees, AlmaRise D Organic fruit- and plant-waste textiles, our expansion into home decor, craft across India, and everyday life between Spain and India."}
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

        <SectionBridge from="pale-sage" to="night" />
      </main>

      <SiteFooter hideNewsletter />
    </>
  );
}
