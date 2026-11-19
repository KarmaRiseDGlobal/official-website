"use client";

import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";

const trainingTopics: ReadonlyArray<{
  id: string;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
  image: string;
  imageAlt: Record<SiteLanguage, string>;
}> = [
  {
    id: "sewing-machine",
    title: {
      en: "At the sewing machine",
      es: "En la máquina de coser",
    },
    body: {
      en: "Practise guiding fabric through studio and industrial machines, keeping a seam even, pressing it, and finishing the inside of a garment cleanly.",
      es: "Practicar el manejo del tejido en máquinas de estudio e industriales, mantener una costura regular, plancharla y rematar con limpieza el interior de cada prenda.",
    },
    image: "/images/alma_at_the_warehouse (5).jpeg",
    imageAlt: {
      en: "Alma observing artisans operating cutting and preparation machines on a workshop floor in India",
      es: "Alma observando el trabajo de los artesanos con maquinaria de corte y confección en un taller en la India",
    },
  },
  {
    id: "cutting-table",
    title: {
      en: "At the cutting table",
      es: "En la mesa de patronaje y corte",
    },
    body: {
      en: "Draft a pattern, place it on woven cloth or an existing saree, then adjust the fit on a form and see what that changes in the finished piece.",
      es: "Trazar un patrón, situarlo sobre tela plana o sobre un sari existente y ajustar después la caída sobre el maniquí para comprobar cómo responde la prenda terminada.",
    },
    image: "/images/garment-work-in-progress.jpg",
    imageAlt: {
      en: "Adjusting draped teal embroidered fabric on a dress form beside an industrial sewing machine in India",
      es: "Ajustando un tejido bordado sobre el maniquí junto a una máquina de coser industrial en la India",
    },
  },
];

const roadmapStages: ReadonlyArray<{
  id: string;
  stage: Record<SiteLanguage, string>;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
}> = [
  {
    id: "now",
    stage: {
      en: "Now",
      es: "Ahora",
    },
    title: {
      en: "Build up garment work",
      es: "Consolidar el trabajo textil",
    },
    body: {
      en: "We are developing Almarise in India and growing KarmaRise D Global's Manufacturing Programmes. That commercial work shapes what we will teach.",
      es: "Estamos desarrollando Almarise en la India e impulsando los Programas de fabricación de KarmaRise D Global. Esa actividad real marcará el contenido de la formación.",
    },
  },
  {
    id: "next",
    stage: {
      en: "Next",
      es: "Siguiente paso",
    },
    title: {
      en: "Prepare the workshop",
      es: "Preparar el taller formativo",
    },
    body: {
      en: "We plan to structure practical lessons, bring in experienced instructors and master tailors, and equip an accessible learning space in India.",
      es: "Preparamos el plan práctico de aprendizaje, la incorporación de formadoras y maestros sastres y el acondicionamiento del espacio de estudio en la India.",
    },
  },
  {
    id: "long-term",
    stage: {
      en: "Long-term aim",
      es: "Objetivo a largo plazo",
    },
    title: {
      en: "Open training and connect graduates with work",
      es: "Abrir la formación y conectar con el empleo",
    },
    body: {
      en: "The aim is to help graduates move into paid work through future Almarise production, KarmaRise D Global studio work, or partner garment workshops in India.",
      es: "El objetivo es que quienes completen la formación accedan a trabajo remunerado en la producción de Almarise, en el estudio de KarmaRise D Global o en talleres colaboradores en la India.",
    },
  },
];

export function WomensTrainingInitiativePageClient() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-lg)]">
              <h1 className="max-w-[18ch] text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium">
                {isEs
                  ? "Iniciativa de formación para mujeres"
                  : "Women's Training Initiative"}
              </h1>
              <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Estamos preparando un programa en la India para formar a mujeres en diseño de prendas y confección, con el empleo remunerado como objetivo a largo plazo."
                  : "We are planning garment design and stitching training for women in India, with paid work as the long-term aim."}
              </p>
              <p className="text-[length:var(--text-sm)] font-semibold">
                {isEs
                  ? "El plazo de inscripción aún no está abierto."
                  : "Applications have yet to open."}
              </p>
            </div>

            <figure className="relative m-0 aspect-[16/10] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
              <Image
                src="/media (ai generated)/warehouse_reference.jpeg_4d191272_2K.jpg"
                alt={
                  isEs
                    ? "Estudio textil soleado en la India con mesas de costura, maniquí y luz natural"
                    : "Sunlit garment studio in India with sewing benches, dress form, and natural daylight"
                }
                fill
                priority
                sizes="(max-width: 80rem) 100vw, 1280px"
                className="object-cover"
              />
            </figure>
          </div>
        </section>

        <section className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid gap-[var(--space-xl)]">
            <p className="max-w-[32ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-s)] leading-[1.12] text-[var(--color-paper)]">
              {isEs
                ? "La idea nació visitando talleres de confección en la India. Alma y Shirish comprobaron lo difícil que resulta encontrar una formación que enseñe tanto costura como diseño y que conecte directamente a las mujeres con un trabajo remunerado."
                : "The idea came out of visiting garment workshops in India. Alma and Shirish saw how hard it can be to find training that teaches both stitching and design and gives women a clear route into paid work."}
            </p>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs
                  ? "Qué abarcará la formación"
                  : "What the training will cover"}
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              {trainingTopics.map((topic) => (
                <article key={topic.id} className="grid content-start gap-4">
                  <figure className="relative m-0 aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
                    <Image
                      src={topic.image}
                      alt={topic.imageAlt[language]}
                      fill
                      sizes="(max-width: 48rem) 100vw, 48vw"
                      className="object-cover"
                    />
                  </figure>
                  <h3 className="text-[length:var(--text-2xl)] font-medium">
                    {topic.title[language]}
                  </h3>
                  <p className="text-[var(--color-muted)]">
                    {topic.body[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[17ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs
                  ? "Qué pasos damos primero"
                  : "What needs to happen first"}
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              {roadmapStages.map((item) => (
                <article
                  key={item.id}
                  className="grid content-start gap-3 border-t border-[var(--color-rule-2)]/45 pt-5"
                >
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    {item.stage[language]}
                  </p>
                  <h3 className="text-[length:var(--text-2xl)] font-medium">
                    {item.title[language]}
                  </h3>
                  <p className="text-[var(--color-muted)]">
                    {item.body[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-4 lg:col-span-7">
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs
                  ? "Colabora en el diseño de la formación"
                  : "Help shape the training"}
              </h2>
              <p className="max-w-[54ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Nos encantará escuchar a formadoras textiles, patronistas y profesionales en la India que quieran colaborar en la puesta en marcha del programa."
                  : "We would like to hear from garment trainers, pattern makers, and others in India who can help develop the programme."}
              </p>
            </div>
            <div className="grid gap-4 lg:col-span-5">
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/contact")}
              >
                {isEs
                  ? "Escribirnos sobre la iniciativa"
                  : "Contact us about the initiative"}
              </Link>
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/stories")}
              >
                {isEs ? "Leer avances en Historias" : "Read company updates"}
              </Link>
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/almarise")}
              >
                {isEs ? "Conocer Almarise" : "Learn about Almarise"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
