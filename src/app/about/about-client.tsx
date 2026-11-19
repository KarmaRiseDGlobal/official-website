"use client";

import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { useLanguage, type SiteLanguage } from "@/context/language-context";

import styles from "./about.module.css";

const companyPrinciples: ReadonlyArray<{
  id: string;
  title: Record<SiteLanguage, string>;
  body: Record<SiteLanguage, string>;
}> = [
  {
    id: "feasible-early",
    title: {
      en: "Say what is feasible early",
      es: "Decir qué es viable desde el principio",
    },
    body: {
      en: "We flag material, quantity, or timing problems before you commit money or set a launch date.",
      es: "Señalamos cualquier problema de materiales, cantidades o plazos antes de que comprometas presupuesto o fijes una fecha de lanzamiento.",
    },
  },
  {
    id: "clear-terms",
    title: {
      en: "Agree on clear terms with workshops",
      es: "Acordar condiciones claras con cada taller",
    },
    body: {
      en: "A Manufacturing Partner needs fair commercial terms and a specification they can build from. We agree on both together.",
      es: "Un socio de fabricación necesita condiciones justas y una especificación clara sobre la que trabajar. Cerramos ambos puntos juntos.",
    },
  },
  {
    id: "stay-involved",
    title: {
      en: "Stay involved after approval",
      es: "Seguir presentes después de aprobar la muestra",
    },
    body: {
      en: "We follow the work in person through sampling, bulk production, and export dispatch.",
      es: "Acompañamos el trabajo en persona durante el muestreo, la producción en serie y la salida del pedido.",
    },
  },
  {
    id: "repeat-work",
    title: {
      en: "Build for repeat work",
      es: "Construir relaciones para futuros pedidos",
    },
    body: {
      en: "We want a Client and a workshop to be able to work together again smoothly on the next Bulk Order.",
      es: "Queremos que cada cliente y cada taller puedan volver a trabajar juntos con total confianza en el siguiente pedido.",
    },
  },
];

export function AboutPageClient() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main className={styles.about} id="main">
        <section className={styles.hero}>
          <div className={`${styles.heroInner} container`}>
            <div className={styles.heroCopy}>
              <h1>{isEs ? "Alma y Shirish" : "Alma and Shirish"}</h1>
              <p className={styles.heroIntro}>
                {isEs
                  ? "Los fundadores de KarmaRise D Global trabajan en ambos lados del Product Brief: con clientes en España y Europa y en persona con talleres especializados en toda la India."
                  : "The founders of KarmaRise D Global work on both sides of a Product Brief, with Clients in Spain and across Europe and on the ground with workshops across India."}
              </p>
            </div>
          </div>
        </section>

        <section className={styles.founder} id="alma">
          <div className={`${styles.founderGrid} container`}>
            <figure className={styles.founderPortrait}>
              <Image
                src="/images/alma (1).jpeg"
                alt={
                  isEs
                    ? "Alma en un mirador junto a la costa en España"
                    : "Alma at a coastal hillside overlook in Spain"
                }
                fill
                sizes="(max-width: 60rem) 100vw, 50vw"
                priority
              />
            </figure>
            <div className={styles.founderCopy}>
              <h2>Alma</h2>
              <p className={styles.founderLead}>
                {isEs
                  ? "Empresaria española afincada entre España y la India, Alma sabe por experiencia propia lo que cuesta levantar una marca y defender un producto en tienda."
                  : "A Spanish business owner working between Spain and India, Alma knows first-hand what it takes to build a label and put a product on the shelf."}
              </p>
              <p className="max-w-[48ch] text-[var(--color-muted)]">
                {isEs
                  ? "Habla directamente con clientes en España y Europa para entender qué necesita cada pieza y qué espera quien la compra. En la India, visita fábricas junto a Shirish, revisa pieles y tejidos a mano, desarrolla Almarise y mantiene viva la conversación durante el muestreo y la producción."
                  : "She speaks directly with Clients in Spain and across Europe to understand what each piece needs to do. On the ground in India alongside Shirish, she visits factories, inspects hides and textiles by hand, develops Almarise, and keeps the conversation connected through sampling and production."}
              </p>
              <dl className="m-0 grid gap-2 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)]">
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    {isEs ? "Idiomas" : "Languages"}
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    {isEs ? "Español e inglés" : "Spanish and English"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className={`${styles.founder} ${styles.founderShirish}`}>
          <div className={`${styles.founderGrid} container`}>
            <div className={styles.founderCopy}>
              <h2>Shirish</h2>
              <p className={styles.founderLead}>
                {isEs
                  ? "Abogado de profesión en la India, Shirish creció con un profundo sentido del trato justo y la palabra cumplida."
                  : "A lawyer by profession in India, Shirish grew up with a strong sense of fairness and clear commitments."}
              </p>
              <p className="max-w-[48ch] text-[var(--color-muted)]">
                {isEs
                  ? "Visita talleres en toda la India, estructura acuerdos claros con cada socio de fabricación y comprueba en persona cómo responde el Product Brief cuando hay una muestra física sobre la mesa."
                  : "He audits workshops in person across India, structures clear agreements with Manufacturing Partners, and checks how the Product Brief holds up once a physical sample is on the table."}
              </p>
              <dl className="m-0 grid gap-2 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)]">
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    {isEs ? "Base de operaciones" : "Operations"}
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    {isEs ? "Toda la India" : "Across India"}
                  </dd>
                </div>
              </dl>
            </div>
            <figure
              className={`${styles.founderPortrait} ${styles.shirishPortrait}`}
            >
              <Image
                src="/images/shirish_posing (1).jpeg"
                alt={
                  isEs
                    ? "Shirish sentado en su escritorio en la oficina en la India"
                    : "Shirish seated at his office desk in India"
                }
                fill
                sizes="(max-width: 60rem) 100vw, 50vw"
              />
            </figure>
          </div>
        </section>

        <section className={styles.origin}>
          <div className={`${styles.originStory} section-intro container`}>
            <h2>{isEs ? "Un vuelo a la India" : "A flight to India"}</h2>
            <p className="lead">
              {isEs
                ? "Alma y Shirish conectaron primero por su interés común en las personas y en la forma en que se trabaja en cada lugar. Pocos meses después, ella voló desde España a la India y pusieron en marcha KarmaRise D Global juntos."
                : "Alma and Shirish first connected over a shared interest in people and how things are made. A few months later she flew from Spain to India, where the two started KarmaRise D Global together."}
            </p>
          </div>
        </section>

        <section className={styles.meaning}>
          <div className="container grid gap-[var(--space-2xl)]">
            <div className={styles.meaningGrid}>
              <div className={styles.meaningTitle}>
                <h2>{isEs ? "¿Por qué KarmaRise?" : "Why KarmaRise?"}</h2>
              </div>
              <div className={styles.meaningCopy}>
                <p className={styles.largeCopy}>
                  {isEs
                    ? "Para Alma y Shirish, el nombre resume una convicción sencilla: quien tiene una buena idea de producto debe poder fabricarla con personas en las que confía."
                    : "For Alma and Shirish, the name reflects a straightforward belief: people with good product ideas should be able to make them with people they trust."}
                </p>
              </div>
            </div>

            <figure className="relative m-0 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)]">
              <Image
                src="/images/alma_with_the_team.jpeg"
                alt={
                  isEs
                    ? "Alma y el equipo en el estudio en la India mostrando bolsas guardapolvo terminadas frente a la pizarra de trabajo"
                    : "Alma and the team in our studio in India holding finished dust bags in front of the project whiteboard"
                }
                fill
                sizes="(max-width: 80rem) 100vw, 1280px"
                className="object-cover"
              />
            </figure>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs
                  ? "Cómo trabajamos con las personas"
                  : "How we work with people"}
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              {companyPrinciples.map((principle) => (
                <article
                  key={principle.id}
                  className="grid content-start gap-3 border-t border-[var(--color-rule)] pt-5"
                >
                  <h3 className="text-[length:var(--text-title)] font-medium">
                    {principle.title[language]}
                  </h3>
                  <p className="text-[var(--color-muted)]">
                    {principle.body[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.india}>
          <div className="container grid gap-[var(--space-2xl)]">
            <div className={styles.indiaGrid}>
              <figure className={styles.indiaImage}>
                <Image
                  src="/images/alam_with_the_warehouse_owners (3).jpeg"
                  alt={
                    isEs
                      ? "Alma y tres especialistas revisando pieles de color coñac sobre la mesa de un taller en la India"
                      : "Alma and three workshop specialists inspecting cognac leather hides on a table in India"
                  }
                  fill
                  sizes="(max-width: 44rem) 100vw, 58vw"
                />
              </figure>
              <div className={styles.indiaCopy}>
                <h2>
                  {isEs
                    ? "¿Qué taller encaja con cada producto?"
                    : "Which workshop fits the work?"}
                </h2>
                <p>
                  {isEs
                    ? "Trabajar piel estructurada exige una maquinaria y unas manos muy distintas a las de cortar y coser prendas de tejido ligero. Alma y Shirish visitan talleres por toda la India para comprobar qué hace bien cada uno y qué Product Brief puede asumir."
                    : "Working with structured leather takes a different setup from cutting and sewing woven garments. Alma and Shirish visit workshops across India to see what each does well and which Product Briefs it can take on."}{" "}
                  <Link href={localizeHref("/manufacturing-programme")}>
                    {isEs
                      ? "Descubre cómo seleccionamos a cada socio de fabricación."
                      : "See how we choose a Manufacturing Partner."}
                  </Link>
                </p>
              </div>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              <figure className="relative m-0 aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-2)]">
                <Image
                  src="/images/shirish_with_workers_at_warehouse (1).jpeg"
                  alt={
                    isEs
                      ? "Shirish saludando al maestro cortador junto a la mesa de trabajo en el taller de piel"
                      : "Shirish greeting a master cutter at the leather workshop table in India"
                  }
                  fill
                  sizes="(max-width: 48rem) 100vw, 48vw"
                  className="object-cover"
                />
              </figure>
              <figure className="relative m-0 aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-2)]">
                <Image
                  src="/images/shirish_with_workers_at_warehouse (3).jpeg"
                  alt={
                    isEs
                      ? "Shirish y una artesana revisando forros de algodón a rayas y cremalleras antes del montaje"
                      : "Shirish and an artisan inspecting striped cotton linings and zippers before assembly"
                  }
                  fill
                  sizes="(max-width: 48rem) 100vw, 48vw"
                  className="object-cover"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-md)] lg:col-span-5">
              <h2 className="max-w-[14ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs ? "Dónde trabajamos" : "Where we work"}
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2 lg:col-span-7">
              <article className="grid content-start gap-2 border-t border-[var(--color-rule-2)]/45 pt-4">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  {isEs ? "Operaciones en la India" : "India operations"}
                </h3>
                <p className="text-[var(--color-ink-2)]">
                  {isEs
                    ? "Con estudio propio cerca de Mumbai y visitas presenciales a fábricas, revisión de muestras y coordinación con talleres especializados en toda la India."
                    : "With our studio near Mumbai and direct factory visits, sample reviews, and Manufacturing Partner coordination across all of India."}
                </p>
              </article>

              <article className="grid content-start gap-2 border-t border-[var(--color-rule-2)]/45 pt-4">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  {isEs ? "España y Europa" : "Spain & Europe"}
                </h3>
                <p className="text-[var(--color-ink-2)]">
                  {isEs
                    ? "Centrados principalmente en marcas y comercios de España junto al resto de Europa, hablando directamente en español e inglés."
                    : "Focused primarily on brands and retailers in Spain alongside wider Europe, speaking directly in Spanish and English."}
                </p>
                <div className="pt-2">
                  <Link
                    className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={localizeHref("/contact")}
                  >
                    {isEs ? "Ver datos de contacto" : "View contact details"}
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.future}>
          <div className={`${styles.futureGrid} container`}>
            <div className={styles.futureHeading}>
              <h2>
                {isEs
                  ? "Qué más estamos desarrollando en la India"
                  : "What else we are developing in India"}
              </h2>
            </div>
            <article>
              <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)]">
                <Image
                  src="/images/maria_4.jpeg"
                  alt={
                    isEs
                      ? "Prenda exterior fucsia con bordado dorado zari confeccionada por Almarise a partir de un sari indio"
                      : "Contemporary magenta and gold zari outer garment tailored by Almarise from an Indian saree"
                  }
                  fill
                  sizes="(max-width: 60rem) 100vw, 33vw"
                  className="object-cover object-top"
                />
              </figure>
              <h3>Almarise</h3>
              <p>
                {isEs
                  ? "Nuestra marca propia de moda transforma saris existentes de la India en prendas contemporáneas para mujeres en España y Europa."
                  : "Our fashion brand turns existing Indian sarees into contemporary women's clothing for Spain and Europe."}
              </p>
              <Link
                className="w-fit font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/almarise")}
              >
                {isEs ? "Conocer Almarise" : "Explore Almarise"}
              </Link>
            </article>
            <article>
              <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)]">
                <Image
                  src="/images/alma_with_diid.jpeg"
                  alt={
                    isEs
                      ? "Alma y una artesana textil mostrando un sari burdeos con cenefa dorada en nuestro estudio en la India"
                      : "Alma and a garment maker holding a burgundy and gold woven textile in our studio in India"
                  }
                  fill
                  sizes="(max-width: 60rem) 100vw, 33vw"
                  className="object-cover"
                />
              </figure>
              <h3>
                {isEs
                  ? "Iniciativa de formación para mujeres"
                  : "Women's Training Initiative"}
              </h3>
              <p>
                {isEs
                  ? "Un programa en preparación para formar a mujeres en la India en diseño de prendas y costura, con el empleo remunerado como meta a largo plazo."
                  : "A planned programme in India for garment design and stitching skills, with paid employment opportunities as a long-term aim."}
              </p>
              <Link
                className="w-fit font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/womens-training-initiative")}
              >
                {isEs
                  ? "Leer sobre la iniciativa en preparación"
                  : "Read about the planned initiative"}
              </Link>
            </article>
          </div>
        </section>

        <section className={styles.invitation}>
          <div className={`${styles.invitationInner} container`}>
            <h2>
              {isEs
                ? "Cuéntanos qué quieres fabricar."
                : "Tell us what you want to make."}
            </h2>
            <div className={styles.invitationActions}>
              <Link
                className={styles.primaryAction}
                href={localizeHref("/product-brief")}
              >
                {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
              </Link>
              <Link
                className={styles.secondaryAction}
                href={localizeHref("/manufacturing-programme")}
              >
                {isEs
                  ? "Ver el Programa de fabricación"
                  : "View the Manufacturing Programme"}
              </Link>
            </div>
          </div>
        </section>

        <figure className={styles.togetherPortrait}>
          <Image
            src="/images/alma_and_shirish_at_a_zoo (1).jpg"
            alt={
              isEs
                ? "Alma y Shirish juntos al aire libre"
                : "Alma and Shirish standing together outdoors"
            }
            fill
            sizes="100vw"
          />
        </figure>
      </main>

      <SiteFooter />
    </>
  );
}
