"use client";

import Image from "next/image";
import Link from "next/link";

import { SectionBridge } from "@/components/section-bridge";
import { SiteFooter } from "@/components/site-footer";
import {
  segmentParagraphWithReferences,
  StoryReferenceSegments,
} from "@/components/story-reference-text";
import { useLanguage, type SiteLanguage } from "@/context/language-context";

const transformationSteps: ReadonlyArray<{
  number: string;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
  image: string;
  imageAlt: Record<SiteLanguage, string>;
}> = [
  {
    number: "01",
    title: {
      en: "Source with respect",
      es: "Seleccionar con respeto",
    },
    body: {
      en: "Across India, families keep treasured wedding and festival sarees folded in cupboards long after they stop wearing them. We acquire these pieces for a fair payment or by donation, inspect the weave by hand, and plan to share each saree's story when its owner agrees.",
      es: "En toda la India, las familias guardan en el armario saris muy queridos de bodas y celebraciones que ya no se ponen. Los adquirimos mediante un pago justo o donación, revisamos la fibra a mano y prevemos contar la historia de cada pieza cuando su dueña nos da permiso.",
    },
    image:
      "/media (ai generated)/Stone_archway_framing_garment_wo…_7378e9b7_2K.jpg",
    imageAlt: {
      en: "Garment makers examining woven Indian textiles inside a traditional studio space",
      es: "Artesanas revisando tejidos tradicionales en un estudio textil en la India",
    },
  },
  {
    number: "02",
    title: {
      en: "One saree, one pattern",
      es: "Un sari, un único patrón",
    },
    body: {
      en: "Bulk manufacturing cuts a hundred or two hundred identical garments off one pattern. Because every five-to-nine-yard saree is unique, we draft an individual pattern so its pallu and woven zari borders frame a sleeve, lapel, or hem.",
      es: "La fabricación en serie corta cien o doscientas prendas iguales con un solo patrón. Como cada sari de entre cinco y ocho metros es irrepetible, trazamos un patrón exclusivo para que el pallu y las cenefas zari enmarquen mangas, solapas o bajos.",
    },
    image:
      "/media (ai generated)/alma_taking_a_look_at_design_(2).jpeg_45737972_2K.jpg",
    imageAlt: {
      en: "Alma and a garment maker checking pattern placement on an embroidered saree textile on a dress form",
      es: "Alma y una sastre comprobando la colocación de un sari bordado sobre un maniquí en el estudio",
    },
  },
  {
    number: "03",
    title: {
      en: "Tailored for active days",
      es: "Pensado para vestir a diario",
    },
    body: {
      en: "A woman's saree in India is cut and stitched by women in our studio into shrugs, loose jackets, and dresses that slip on in seconds for work and daily life in Spain and Europe.",
      es: "El sari de una mujer en la India lo cortan y cosen mujeres en nuestro estudio para convertirlo en chaquetas ligeras, kimonos y vestidos fáciles de llevar al trabajo y a diario en España y Europa.",
    },
    image:
      "/media (ai generated)/Women_working_in_garment_workshop_dfe4f85c_2K.jpg",
    imageAlt: {
      en: "Women artisans cutting and stitching garments at a sunlit studio worktable and sewing machine in India",
      es: "Artesanas cortando y cosiendo prendas en nuestro estudio soleado en la India",
    },
  },
];

const lookbookItems: ReadonlyArray<{
  id: string;
  image: string;
  caption: Record<SiteLanguage, string>;
  alt: Record<SiteLanguage, string>;
}> = [
  {
    id: "look-01",
    image: "/images/maria_7.jpeg",
    caption: {
      en: "Light shrug cut so the striped pallu frames the sleeves and the paisley border forms the hem",
      es: "Chaqueta ligera cortada para que las franjas del pallu enmarquen las mangas y la cenefa dibuje el bajo",
    },
    alt: {
      en: "Maria walking across a sunlit brick street in Spain wearing a sheer saree-derived shrug over a black dress",
      es: "María caminando por una calle soleada en España con una chaqueta ligera confeccionada a partir de un sari sobre un vestido negro",
    },
  },
  {
    id: "look-02",
    image: "/images/maria_1.jpeg",
    caption: {
      en: "One-of-a-kind asymmetric tunic cut from a single geometric saree",
      es: "Túnica asimétrica única cortada a partir de un solo sari geométrico",
    },
    alt: {
      en: "Full-length outdoor portrait of Maria wearing an asymmetric rust and black patterned saree tunic in Spain",
      es: "Retrato de cuerpo entero al aire libre de María con una túnica asimétrica confeccionada a partir de un sari geométrico en España",
    },
  },
  {
    id: "look-03",
    image: "/images/maria_2.jpeg",
    caption: {
      en: "Bandhani saree kimono thrown over denim for everyday wear in Spain",
      es: "Kimono de sari bandhani llevado sobre vaqueros para el día a día en España",
    },
    alt: {
      en: "Seated outdoor portrait pairing an orange and yellow patterned saree kimono with denim",
      es: "Retrato sentado al aire libre combinando un kimono de sari naranja y amarillo con vaqueros",
    },
  },
];

export function AlmarisePageClient() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  const seenReferenceIds = new Set<string>();
  const cupboardParagraphSegments = segmentParagraphWithReferences(
    isEs
      ? "En las casas de la India llaman thevnitlya sadya a los saris regalados en bodas y momentos familiares que acaban doblados durante años en el armario. Colocarse un sari entero lleva tiempo, y en España o en Europa nadie tiene una modista en su calle para coser una blusa de sari a medida."
      : "In Indian homes, families call them thevnitlya sadya: sarees gifted with love at weddings and milestones that sit folded away in cupboards for years. Draping a full saree takes practice, and in Spain or Europe nobody has a tailor down the street to stitch a fitted saree blouse.",
    language,
    seenReferenceIds,
  );
  const mariaParagraphSegments = segmentParagraphWithReferences(
    isEs
      ? "Cuando María vio nuestras primeras prendas colgadas en una percha en España, no iban nada con su estilo. En cuanto salió a la calle sabiendo que nadie más en el mundo tenía esa pieza, se quedó uno de los vestidos para ella."
      : "When Maria first saw our finished pieces on a hanger in Spain, they were nothing like her usual style. Once she stepped outside knowing nobody else in the world owned that piece, she kept one of the dresses for herself.",
    language,
    seenReferenceIds,
  );

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-forest-deep)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-paper)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-lg)] lg:col-span-7">
                <h1 className="text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium text-[var(--color-paper)]">
                  Almarise
                </h1>
              </div>
              <div className="grid gap-4 lg:col-span-5">
                <p className="lead text-[var(--color-paper-2)]">
                  {isEs
                    ? "Transformamos saris guardados con cariño en los armarios de la India en chaquetas ligeras, kimonos y vestidos únicos para el día a día en España y Europa."
                    : "We turn treasured sarees kept in Indian cupboards into one-of-a-kind shrugs, jackets, and dresses for everyday life in Spain and Europe."}
                </p>
                <p className="text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-light)]">
                  {isEs
                    ? "Una marca de moda de KarmaRise D Global"
                    : "A fashion brand by KarmaRise D Global"}
                </p>
              </div>
            </div>

            <figure className="relative m-0 aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-paper)]/15 bg-[var(--color-night)]">
              <Image
                src="/images/maria_3.jpeg"
                alt={
                  isEs
                    ? "Mujer vistiendo un vestido rojo fluido confeccionado a partir de un sari indio sobre una escalinata de piedra en España"
                    : "Woman wearing a flowing red dress tailored from an Indian saree on stone steps in European daylight"
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

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-6">
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs
                  ? "Saris guardados en el armario, cortados para moverse todo el día"
                  : "Cupboard sarees, cut for women on the move"}
              </h2>
              <p className="text-[var(--color-ink-2)]">
                <StoryReferenceSegments
                  segments={cupboardParagraphSegments}
                  lang={language}
                />
              </p>
              <p className="text-[var(--color-ink-2)]">
                {isEs
                  ? "Por eso convertimos cada sari en una prenda práctica que puedas ponerte en segundos encima de unos vaqueros o para ir a trabajar: empieza siendo el sari de una mujer en la India, lo cose una mujer en nuestro estudio y lo viste otra mujer en España o Europa."
                  : "So we cut each saree into an easy piece you can slip on in seconds over jeans or workwear: it starts as a woman's saree in India, it is stitched by a woman in our studio, and it is worn by a woman in Spain or Europe."}
              </p>
              <div>
                <Link
                  className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref(
                    "/stories/giving-maharashtrian-sarees-a-second-life",
                  )}
                >
                  {isEs
                    ? "Leer cómo empezó Almarise y la reacción de María en España"
                    : "Read how Almarise started and Maria's reaction in Spain"}
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <figure className="relative mx-auto my-0 aspect-[4/5] w-full max-w-[32rem] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] lg:max-w-none">
                <Image
                  src="/images/alma_with_a_woman (2).jpeg"
                  alt={
                    isEs
                      ? "Alma y una mujer en la India sosteniendo saris de seda doblados en tonos naranja, verde y fucsia con cenefas doradas"
                      : "Alma and an Indian woman holding folded orange, green, and magenta silk sarees with woven gold borders"
                  }
                  fill
                  sizes="(max-width: 64rem) 100vw, 48vw"
                  className="object-cover"
                />
              </figure>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs
                  ? "Cómo un sari se convierte en una prenda"
                  : "How a saree becomes a garment"}
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-3">
              {transformationSteps.map((step) => (
                <article key={step.number} className="grid content-start gap-4">
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
                  <h3 className="text-[length:var(--text-2xl)] font-medium">
                    {step.title[language]}
                  </h3>
                  <p className="text-[var(--color-muted)]">
                    {step.body[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs ? "Piezas únicas en España" : "One-off pieces in Spain"}
              </h2>
              <p className="lead max-w-[58ch] text-[var(--color-muted)]">
                <StoryReferenceSegments
                  segments={mariaParagraphSegments}
                  lang={language}
                />
              </p>
            </div>

            <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-3">
              {lookbookItems.map((item) => (
                <figure key={item.id} className="m-0 grid content-start gap-3">
                  <div className="relative mx-auto aspect-[3/4] w-full max-w-[26rem] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] sm:max-w-none">
                    <Image
                      src={item.image}
                      alt={item.alt[language]}
                      fill
                      sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 50vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                  <figcaption className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    {item.caption[language]}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="pale-sage" />

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-md)] lg:col-span-7">
              <h2 className="max-w-[15ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs ? "En marcha en la India" : "At work in India"}
              </h2>
              <p className="text-[var(--color-ink-2)]">
                {isEs
                  ? "Desarrollar Almarise nos da experiencia directa seleccionando tejidos, construyendo prendas y revisando acabados en nuestro estudio en la India. Con el tiempo, este trabajo ayudará a generar oportunidades de empleo remunerado para las mujeres que participen en nuestra futura iniciativa de formación."
                  : "Developing Almarise gives us first-hand experience choosing cloth, constructing garments, and checking finish in our studio in India. In time, that work will help create paid employment opportunities for women who take part in our planned training initiative."}
              </p>
            </div>

            <div className="grid gap-2 lg:col-span-5">
              <Link
                className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/manufacturing-programme")}
              >
                {isEs
                  ? "Explorar el Programa de fabricación"
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
                href={localizeHref("/contact")}
              >
                {isEs ? "Preguntarnos por Almarise" : "Ask us about Almarise"}
              </Link>
            </div>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="night" />
      </main>

      <SiteFooter />
    </>
  );
}
