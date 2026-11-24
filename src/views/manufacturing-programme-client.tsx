import Image from "next/image";
import Link from "next/link";

import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { PhaseJourney } from "@/components/showcases/phase-journey";
import { MediaPlaceholder } from "@/components/stories/media-placeholder";
import {
  MANUFACTURING_CATEGORIES,
  MANUFACTURING_COMPARISON_ROWS,
  MANUFACTURING_FAQS,
  MANUFACTURING_HERO_FACTS,
  MANUFACTURING_LAST_REVIEWED,
  MANUFACTURING_PRE_PRODUCTION_AGREEMENTS,
  MANUFACTURING_PRODUCT_STUDY_PILLARS,
  MANUFACTURING_PROOF_METRICS,
  MANUFACTURING_SELECTION_CRITERIA,
} from "@/data/manufacturing-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const WHATSAPP_CTA_HREF = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma, I would like to discuss a product study and manufacturing in India with KarmaRise D Global.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma, me gustaría hablar sobre un estudio de producto y fabricación en la India con KarmaRise D Global.")}`,
} as const;

export function ManufacturingProgrammePageClient({
  lang = "en",
}: {
  lang?: SiteLanguage;
} = {}) {
  const language = lang;
  const localizeHref = (href: string) => localizePath(href, language);
  const isEs = language === "es";

  return (
    <>
      <main className="programme-detail" id="main">
        {/* 1. Breadcrumb + Architectural Hero + Definition Block */}
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-2xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-xl)] lg:gap-[var(--space-2xl)]">
            {/* Top 1px Hairline Breadcrumb & Context Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-[var(--color-rule)] py-3.5 text-[length:var(--text-xs)] font-semibold tracking-[0.08em] uppercase">
              <nav
                aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
                className="flex items-center gap-2"
              >
                <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                  <li>
                    <Link
                      className="text-[var(--color-muted)] no-underline transition-colors hover:text-[var(--color-forest-deep)]"
                      href={localizeHref("/")}
                    >
                      {isEs ? "Inicio" : "Home"}
                    </Link>
                  </li>
                  <li aria-hidden="true" className="text-[var(--color-muted)]">
                    /
                  </li>
                  <li
                    aria-current="page"
                    className="text-[var(--color-clay-ink)]"
                  >
                    {isEs ? "Fabricación" : "Manufacturing"}
                  </li>
                </ol>
              </nav>
              <span className="text-[var(--color-muted)]">
                {isEs
                  ? "España, el resto de Europa y la India · Del estudio de producto a tu puerta"
                  : "Spain, the rest of Europe & India · Product study to your door"}
              </span>
            </div>

            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-lg)] lg:col-span-7">
                <h1 className="max-w-[18ch] text-[clamp(2.1rem,3.4vw+0.55rem,4.15rem)] leading-[1.02] font-normal text-[var(--color-forest-deep)]">
                  {isEs
                    ? "Estudio de producto, diseño y fabricación gestionada en la India para marcas europeas"
                    : "Product study, design, and managed manufacturing across India for Europe"}
                </h1>
                <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "KarmaRise D Global acompaña a comercios independientes, marcas de moda y cadenas de España y el resto de Europa para desarrollar y fabricar en la India sus propios bolsos de piel y otros artículos de piel, prendas de diversos tejidos, complementos confeccionados a medida y decoración del hogar. Alma te guía desde España mientras Shirish coordina la operativa y la parte legal en la India: juntos convertimos tu boceto inicial o una pieza que ya funciona en tu tienda en un briefing de producto por escrito. Seleccionamos sobre el terreno las unidades de producción, fábricas de corte familiar y colectivos de artesanas más adecuados, revisamos cada muestra física antes de que la pruebes en mano y seguimos tu pedido hasta dejar las cajas en la puerta de tu negocio."
                    : "KarmaRise D Global helps independent boutiques, fashion labels, and retail chains in Spain and the rest of Europe develop and manufacture own-brand leather bags and other leather goods, clothing in natural and varied fabrics, custom sewn accessories, and home decor across India. Co-founders Alma in Spain and Shirish in India turn your rough sketch or favourite shop piece into a written Product Brief, match it with vetted Indian production units, family-run factories, and artisan collectives, review every physical sample before you sign it off, and coordinate export delivery straight to your business door."}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Link
                    className="primary-button"
                    href={localizeHref("/product-brief")}
                  >
                    {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
                  </Link>
                  <Link
                    className="inline-flex min-h-[var(--control-height)] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-forest-deep)] px-5 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] no-underline transition-colors hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                    href={localizeHref("/book-a-call?duration=15")}
                  >
                    {isEs
                      ? "Reserva una llamada gratis de 15 min con Alma"
                      : "Book a free 15-min video call with Alma"}
                  </Link>
                </div>
                <p className="m-0 max-w-[54ch] text-[length:var(--text-xs)] text-[var(--color-muted)]">
                  {isEs
                    ? "3 pasos rápidos. Se guarda mientras escribes. No necesitas ficha técnica previa y tus diseños son confidenciales (NDA)."
                    : "3 quick steps. Saves as you go. No tech pack needed. Your designs stay confidential, with mutual NDA available."}
                </p>
              </div>

              <div className="lg:col-span-5">
                <figure className="m-0">
                  <div className="relative aspect-[4/3] overflow-hidden border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
                    <Image
                      src="/images/workshops/alma-cognac-leather-cutting-table.jpeg"
                      alt={
                        isEs
                          ? "Alma y tres especialistas marroquineros revisando pieles color coñac de curtido vegetal en una unidad de producción auditada en la India"
                          : "Alma and three leather specialists inspecting cognac vegetable-tanned hides at a vetted production unit in India"
                      }
                      fill
                      priority
                      sizes="(max-width: 64rem) 100vw, 42vw"
                      className="object-cover"
                    />
                  </div>
                </figure>
              </div>
            </div>

            {/* 1px Architectural Quick-Facts Strip */}
            <dl className="m-0 grid border-t border-l border-[var(--color-rule)] md:grid-cols-3">
              {MANUFACTURING_HERO_FACTS.map((fact) => (
                <div
                  key={fact.number}
                  className="grid content-start gap-2.5 border-r border-b border-[var(--color-rule)] p-6"
                >
                  <span className="num text-[length:var(--text-xs)] font-semibold tracking-[0.1em] text-[var(--color-clay-ink)] uppercase">
                    {fact.number}
                  </span>
                  <dt className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-forest-deep)]">
                    {fact.label[language]}
                  </dt>
                  <dd className="m-0 text-[length:var(--text-sm)] leading-[1.58] text-[var(--color-muted)]">
                    {fact.detail[language]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* 2. Product Study, Feasibility, and Product Design */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="product-study-and-design"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="grid gap-3 lg:col-span-7">
                <p className="section-index">
                  {isEs
                    ? "Estudio y diseño de producto"
                    : "Product study and design"}
                </p>
                <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Estudiamos cómo usará la pieza tu cliente antes de cortar una sola muestra"
                    : "We study how your customer uses the piece before a single sample is cut"}
                </h2>
              </div>
              <p className="m-0 max-w-[50ch] text-[length:var(--text-md)] leading-[1.68] text-[var(--color-ink-2)] lg:col-span-5">
                {isEs
                  ? "Solo tú, que subes el cierre de tu tienda cada día, conoces esos pequeños detalles que ocurren sobre el terreno. Sabes de sobra ese instante en que una clienta dice «es bonito, pero...» y vuelve a dejar el bolso en su sitio. Se enamora de una mochila de piel y se marcha sin ella porque una cremallera metálica le araña la mano o le estropea el abrigo de invierno. Otra persona ve un lino de verano precioso y lo deja en el perchero porque nota un corte incómodo en los hombros. La mayoría de las fábricas copian tu boceto sin decir palabra. Nosotros nos sentamos contigo antes. Cuestionamos cada detalle práctico y convertimos lo que ves a diario en tu tienda en una pieza que tus clientes eligen semana tras semana."
                  : 'Every independent shop owner who lifts the shutter each morning knows the moment a shopper says "it is nice, but..." and puts the piece back. A customer admires a leather backpack, then walks away because metal zipper teeth scratch her hand or catch on her winter coat. Someone loves a summer linen fabric, then leaves the dress on the rail because the cut feels uncomfortable across the shoulders. Most factories copy your sketch without speaking up. We sit down with you first, question every practical detail, and turn what you observe on the ground in your shop into a piece your buyers reach for every week.'}
              </p>
            </div>

            <ol className="m-0 grid list-none border-t border-l border-[var(--color-rule-2)]/60 p-0 md:grid-cols-2">
              {MANUFACTURING_PRODUCT_STUDY_PILLARS.map((pillar) => (
                <li
                  key={pillar.id}
                  className="grid content-start gap-3 border-r border-b border-[var(--color-rule-2)]/60 bg-[var(--color-paper)]/55 p-6 lg:p-8"
                >
                  <span className="num text-[length:var(--text-xs)] font-semibold tracking-[0.1em] text-[var(--color-clay-ink)] uppercase">
                    {pillar.number}
                  </span>
                  <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                    {pillar.title[language]}
                  </h3>
                  <p className="m-0 text-[length:var(--text-sm)] leading-[1.68] text-[var(--color-ink-2)]">
                    {pillar.body[language]}
                  </p>
                </li>
              ))}
            </ol>

            {/* Mid-page CRO bridge #1 */}
            <div className="grid gap-4 border-t border-[var(--color-rule-2)]/50 pt-6 lg:grid-cols-12 lg:items-center">
              <p className="m-0 text-[length:var(--text-md)] font-medium text-[var(--color-forest-deep)] lg:col-span-5">
                {isEs
                  ? "¿Ahora mismo solo tienes un boceto rápido o una pieza de tu tienda?"
                  : "Only have a rough sketch or a piece from your shop right now?"}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 lg:col-span-7 lg:justify-end">
                <Link
                  className="primary-button"
                  href={localizeHref("/product-brief")}
                >
                  {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
                </Link>
                <Link
                  className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/book-a-call?duration=15")}
                >
                  {isEs
                    ? "Reserva una llamada gratis de 15 min con Alma →"
                    : "Book a free 15-min video call with Alma →"}
                </Link>
                <Link
                  className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  href={localizeHref(
                    "/stories/from-spain-to-a-cutting-table-in-india",
                  )}
                >
                  {isEs
                    ? "Lee cómo una primera llamada en España llega a la producción en la India →"
                    : "Read how a first call in Spain reaches production in India →"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* 3. What We Develop and Manufacture + Capability & Regional Craft Matrix */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="product-categories"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="grid gap-2 lg:col-span-6">
                <p className="section-index">
                  {isEs ? "Ámbito de producto" : "Product scope"}
                </p>
                <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Cuatro categorías fabricadas en los centros especialistas de la India"
                    : "Four manufacturing categories crafted across India's specialist hubs"}
                </h2>
              </div>
              <p className="m-0 max-w-[46ch] text-[var(--color-muted)] lg:col-span-6 lg:justify-self-end">
                {isEs
                  ? "La India es inmensa y ninguna planta domina todos los oficios. Conectamos tu briefing de producto con unidades de producción, curtidurías, marroquineros, fábricas de corte familiar y colectivos de artesanas en polos especialistas como Calcuta, Kanpur, Agra y Chennai, con coordinación y control desde Maharashtra."
                  : "India is vast, and no single facility masters every trade. We match your Product Brief to vetted production units, tanneries, leather ateliers, family-run garment makers, and women artisan collectives across specialist hubs including Kolkata, Kanpur, Agra, and Chennai, with coordination and quality oversight from Maharashtra."}
              </p>
            </div>

            <div className="grid border-t border-l border-[var(--color-rule)] md:grid-cols-2">
              {MANUFACTURING_CATEGORIES.map((category) => (
                <article
                  key={category.id}
                  className="grid content-start gap-5 border-r border-b border-[var(--color-rule)] p-6 lg:p-7"
                >
                  {category.image ? (
                    <figure className="relative m-0 aspect-[4/5] overflow-hidden bg-[var(--color-paper-2)]">
                      <Image
                        src={category.image}
                        alt={
                          category.imageAlt?.[language] ??
                          category.name[language]
                        }
                        fill
                        sizes="(max-width: 48rem) 100vw, 50vw"
                        className="object-cover"
                      />
                    </figure>
                  ) : (
                    <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-paper-2)]">
                      <MediaPlaceholder
                        kind="Photo"
                        ratio="4:5"
                        aspectClass="aspect-[4/5]"
                        tone="light"
                        title={
                          category.placeholderTitle?.[language] ??
                          category.name[language]
                        }
                        description={
                          category.placeholderDescription?.[language] ??
                          category.summary[language]
                        }
                        className="rounded-none border-0"
                      />
                    </div>
                  )}
                  <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.16] font-normal">
                    {category.name[language]}
                  </h3>
                  <p className="m-0 text-[length:var(--text-sm)] leading-[1.68] text-[var(--color-ink-2)]">
                    {category.summary[language]}
                  </p>
                  <p className="m-0 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-muted)]">
                    {category.details[language]}
                  </p>
                  <div className="grid gap-1">
                    <Link
                      href={localizeHref(
                        `/product-brief?product=${category.querySlug}`,
                      )}
                      className="inline-flex min-h-[44px] w-fit items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    >
                      {category.ctaLabel[language]} →
                    </Link>
                    <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                      {category.ctaMicrocopy[language]}
                    </p>
                  </div>
                </article>
              ))}
            </div>

            {/* Structured HTML Capability & Regional Craft Matrix */}
            <div className="grid gap-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-normal text-[var(--color-forest-deep)]">
                  {isEs
                    ? "Categorías, materiales y centros especialistas de la India de un vistazo"
                    : "Category, materials, and Indian craft hubs at a glance"}
                </h3>
                <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                  {isEs
                    ? "Cada Programa de producción se plantea a medida a partir de tu briefing de producto."
                    : "Every Manufacturing Programme is scoped individually from your Product Brief."}
                </p>
              </div>
              <div className="overflow-x-auto border border-[var(--color-rule)] bg-[var(--color-white)]">
                <table className="w-full min-w-[720px] border-collapse text-left text-[length:var(--text-sm)]">
                  <caption className="sr-only">
                    {isEs
                      ? "Categorías de fabricación en la India, materiales, centros especialistas y verificación antes de producir"
                      : "Manufacturing categories across India, materials, specialist hubs, and verification before production"}
                  </caption>
                  <thead>
                    <tr className="border-b border-[var(--color-rule)] bg-[var(--color-dune)]/55 text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-forest-deep)] uppercase">
                      <th scope="col" className="px-5 py-4">
                        {isEs ? "Categoría de producto" : "Product category"}
                      </th>
                      <th scope="col" className="px-5 py-4">
                        {isEs
                          ? "Materiales y detalles de oficio"
                          : "Materials and craft details"}
                      </th>
                      <th scope="col" className="px-5 py-4">
                        {isEs
                          ? "Centros especialistas y unidades de producción"
                          : "Specialist hubs and production units"}
                      </th>
                      <th scope="col" className="px-5 py-4">
                        {isEs
                          ? "Verificación antes de producir"
                          : "Verification before production"}
                      </th>
                      <th scope="col" className="px-5 py-4">
                        {isEs ? "Valoración" : "Scoping"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--color-rule)] text-[var(--color-ink-2)]">
                    {MANUFACTURING_CATEGORIES.map((category) => (
                      <tr key={category.id}>
                        <th
                          scope="row"
                          className="px-5 py-4 align-top font-semibold text-[var(--color-forest-deep)]"
                        >
                          {category.name[language]}
                        </th>
                        <td className="px-5 py-4 align-top leading-[1.58]">
                          {category.tableMaterials[language]}
                        </td>
                        <td className="px-5 py-4 align-top leading-[1.58]">
                          {category.tableRegions[language]}
                        </td>
                        <td className="px-5 py-4 align-top leading-[1.58]">
                          {category.tableVerification[language]}
                        </td>
                        <td className="px-5 py-4 align-top leading-[1.58] text-[var(--color-muted)]">
                          {isEs
                            ? "Propuesta a medida según briefing de producto, sin mínimos públicos fijos"
                            : "Custom proposal per Product Brief, with no fixed public minimums"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="pale-sage" />

        {/* 4. Vetted Indian Artisans, Family-Run Production Units & Multi-Region Proof */}
        <section
          className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="artisans-and-workshops"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-md)] lg:col-span-6">
                <p className="section-index">
                  {isEs
                    ? "Unidades de producción y auditoría sobre el terreno"
                    : "Production units and on-ground vetting"}
                </p>
                <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Encontrar fabricantes fiables en la India exige recorrer muchos kilómetros sobre el terreno"
                    : "Finding reliable makers in India takes kilometres on the ground"}
                </h2>
                <p className="m-0 max-w-[54ch] text-[var(--color-ink-2)]">
                  {isEs ? (
                    <>
                      Buscar, seleccionar y auditar cada lugar de producción es
                      la parte más exigente de dar el salto a la India. Abundan
                      las fábricas que responden «sí, sí, claro que lo hacemos»
                      por correo y recortan calidad en cuanto reciben el
                      anticipo. Nosotros descartamos las plantas masivas
                      pensadas para tiradas gigantes de <em>prêt-à-porter</em>.
                      Viajamos en persona por todo el país, desde los polos
                      marroquineros de Calcuta, Kanpur, Agra y Chennai hasta
                      centros textiles y artesanales de distintas regiones, para
                      auditar fábricas de corte familiar bien asentadas donde se
                      cose a mano y en máquinas de pedal, junto a colectivos de
                      artesanas. Pasamos días completos junto a las líneas de
                      costura hablando con el equipo, nunca solo con los
                      propietarios. Si una instalación mantiene las puertas
                      cerradas o incumple nuestra tolerancia cero ante la
                      explotación, tanto de adultos como de menores, nos
                      marchamos al momento. Así de claro.
                    </>
                  ) : (
                    <>
                      Searching, selecting, and auditing Manufacturing Partners
                      is the hardest part of manufacturing in India. Plenty of
                      factories say &ldquo;yes, yes, of course&rdquo; over email
                      and cut corners once a deposit arrives. We skip anonymous
                      mass-production plants built for giant{" "}
                      <em>prêt-à-porter</em> volumes. Alma and Shirish travel
                      across India in person, from leather hubs in Kolkata,
                      Kanpur, Agra, and Chennai to textile and craft clusters
                      nationwide, auditing established family-run factories,
                      production units, leather ateliers, and women artisan
                      collectives where hides and cloth are stitched by hand and
                      on pedal machines. We spend full days beside the stitching
                      lines talking directly with the artisans, never only with
                      facility owners. If a site keeps its doors closed or falls
                      short of our zero-exploitation standard for adults and
                      minors alike, we walk away.
                    </>
                  )}
                </p>
              </div>
              <div className="lg:col-span-6">
                <figure className="m-0">
                  <div className="relative aspect-[16/10] overflow-hidden border border-[var(--color-forest)]/25 bg-[var(--color-paper)]">
                    <Image
                      src="/images/workshops/shirish-greeting-leather-cutter-workshop.jpeg"
                      alt={
                        isEs
                          ? "Shirish y un maestro cortador revisando piezas de piel marrón y patrones en un punto de producción auditado en la India"
                          : "Shirish and a master leather cutter inspecting cut brown leather panels and pattern templates at a vetted production site in India"
                      }
                      fill
                      sizes="(max-width: 64rem) 100vw, 48vw"
                      className="object-cover"
                    />
                  </div>
                </figure>
              </div>
            </div>

            {/* Real Multi-Region Craft Proof Block */}
            <div className="grid gap-5 border-t border-[var(--color-forest)]/25 pt-8 lg:grid-cols-3">
              {MANUFACTURING_PROOF_METRICS.map((metric) => (
                <article
                  key={metric.id}
                  className="grid content-start gap-2.5 border border-[var(--color-forest)]/25 bg-[var(--color-paper)]/75 p-6"
                >
                  <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-ink)] uppercase">
                    {metric.label[language]}
                  </p>
                  <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-forest-deep)]">
                    {metric.value[language]}
                  </h3>
                  <p className="m-0 text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
                    {metric.detail[language]}
                  </p>
                </article>
              ))}
            </div>

            <dl className="m-0 grid border-t border-l border-[var(--color-forest)]/25 md:grid-cols-2 xl:grid-cols-4">
              {MANUFACTURING_SELECTION_CRITERIA.map((item) => (
                <div
                  key={item.id}
                  className="grid content-start gap-3 border-r border-b border-[var(--color-forest)]/25 bg-[var(--color-paper)]/45 p-6"
                >
                  <dt className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[1.2] font-normal">
                    {item.title[language]}
                  </dt>
                  <dd className="m-0 text-[length:var(--text-sm)] leading-[1.62] text-[var(--color-muted)]">
                    {item.body[language]}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-forest)]/20 pt-6">
              <p className="m-0 max-w-[56ch] text-[length:var(--text-sm)] text-[var(--color-ink-2)]">
                {isEs
                  ? "Mira por qué repartimos fases entre centros especialistas de la India cuando un producto pide una textura de piel o una costura concretas."
                  : "See why we split stages across specialist hubs in India when a product demands a specific hide hand-feel or stitch."}
              </p>
              <Link
                className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref(
                  "/stories/matching-a-workshop-to-the-product",
                )}
              >
                {isEs
                  ? "Lee cómo elegimos la unidad de producción adecuada para cada producto en la India →"
                  : "Read how we match each production unit to the product across India →"}
              </Link>
            </div>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="paper" />

        {/* 5. Managed Spain-India Manufacturing vs. Remote Brokers & DIY Outreach */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="why-managed"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="grid gap-3 lg:col-span-7">
                <p className="section-index">
                  {isEs ? "Fiabilidad cara a cara" : "Reliability compared"}
                </p>
                <h2 className="m-0 max-w-[22ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Trabajar directamente con Alma y Shirish frente a intermediarios y directorios de fábricas"
                    : "Working directly with Alma and Shirish compared with brokers and factory directories"}
                </h2>
              </div>
              <p className="m-0 max-w-[48ch] text-[var(--color-muted)] lg:col-span-5">
                {isEs
                  ? "Trabajas con personas con cara y ojos detrás de cada mensaje. Alma sabe bien lo que cuesta subir el cierre de tu tienda cada día frente a la facilidad de comprar por internet, y por qué ofrecer moda a medida te diferencia frente a comprar a un mayorista el mismo género que la calle de al lado. Shirish es abogado colegiado en el Bar Council de la India, redacta contratos escritos con unidades de producción bajo ley india y supervisa la planta sobre el terreno. Tú te centras en tu comercio y tus clientes. Nosotros seguimos tu pedido desde el estudio de producto hasta dejar las cajas en la puerta de tu negocio."
                  : "You work with two founders, real people with faces and eyes behind every message. Alma knows what it takes to lift the shutter of an independent shop every morning against easy online shopping, and why offering tailor-made own-brand pieces beats reselling the same wholesale stock as the street next door. Shirish is a registered Bar Council advocate in India who drafts enforceable written contracts with production units and supervises manufacturing on the ground. You focus on your shop and your customers while we follow your order from product study to the boxes arriving at your business door."}
              </p>
            </div>

            <div className="overflow-x-auto border border-[var(--color-rule)] bg-[var(--color-white)]">
              <table className="w-full min-w-[740px] border-collapse text-left text-[length:var(--text-sm)]">
                <caption className="sr-only">
                  {isEs
                    ? "Comparativa entre el Programa de producción de KarmaRise D Global, intermediarios a distancia y búsqueda directa de fábricas en la India"
                    : "Comparison of KarmaRise D Global Manufacturing Programme vs. remote brokers and direct DIY factory outreach in India"}
                </caption>
                <thead>
                  <tr className="border-b border-[var(--color-rule)] bg-[var(--color-dune)]/55 text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-forest-deep)] uppercase">
                    <th scope="col" className="w-[20%] px-5 py-4">
                      {isEs ? "Criterio de decisión" : "Decision criterion"}
                    </th>
                    <th
                      scope="col"
                      className="w-[30%] bg-[var(--color-forest-deep)] px-5 py-4 text-[var(--color-paper)]"
                    >
                      {isEs
                        ? "Programa de producción KarmaRise D Global"
                        : "KarmaRise D Global Programme"}
                    </th>
                    <th scope="col" className="w-[25%] px-5 py-4">
                      {isEs
                        ? "Intermediarios a distancia y directorios B2B"
                        : "Remote brokers and B2B directories"}
                    </th>
                    <th scope="col" className="w-[25%] px-5 py-4">
                      {isEs
                        ? "Contacto directo por tu cuenta"
                        : "Direct DIY factory outreach"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-rule)]">
                  {MANUFACTURING_COMPARISON_ROWS.map((row) => (
                    <tr key={row.id}>
                      <th
                        scope="row"
                        className="px-5 py-4 align-top font-semibold text-[var(--color-forest-deep)]"
                      >
                        {row.criterion[language]}
                      </th>
                      <td className="bg-[var(--color-pale-sage)]/35 px-5 py-4 align-top leading-[1.6] font-medium text-[var(--color-forest-deep)]">
                        {row.karmarise[language]}
                      </td>
                      <td className="px-5 py-4 align-top leading-[1.6] text-[var(--color-muted)]">
                        {row.brokers[language]}
                      </td>
                      <td className="px-5 py-4 align-top leading-[1.6] text-[var(--color-muted)]">
                        {row.diy[language]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mid-page CRO bridge #2 */}
            <div className="grid gap-5 border-t border-[var(--color-rule)] pt-7">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="m-0 max-w-[44ch] text-[length:var(--text-md)] font-medium text-[var(--color-forest-deep)]">
                  {isEs
                    ? "¿Quieres saber con claridad si tu idea es viable antes de invertir un euro en muestras?"
                    : "Want a straight feasibility check before spending a euro on samples?"}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    className="primary-button"
                    href={localizeHref("/product-brief")}
                  >
                    {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
                  </Link>
                  <Link
                    className="inline-flex min-h-[var(--control-height)] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-forest-deep)] px-5 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] no-underline transition-colors hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                    href={localizeHref("/book-a-call?duration=15")}
                  >
                    {isEs
                      ? "Reserva una llamada gratis de 15 min con Alma"
                      : "Book a free 15-min video call with Alma"}
                  </Link>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-2 text-[length:var(--text-sm)]">
                <Link
                  className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/about")}
                >
                  {isEs
                    ? "Conoce a Alma y Shirish →"
                    : "Meet founders Alma and Shirish →"}
                </Link>
                <Link
                  className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/how-we-work")}
                >
                  {isEs
                    ? "Mira cómo trabajamos entre España y la India →"
                    : "See how we work across Europe and India →"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="night" />

        {/* 6. Interactive 6-Stage Scroll-Scrubbed Wave + Always-Visible Step Grid */}
        <PhaseJourney />

        <SectionBridge from="night" to="paper" />

        {/* 7. What We Agree in Writing Before Production */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="quality-and-compliance"
        >
          <div className="container grid gap-[var(--space-2xl)] lg:grid-cols-12 lg:items-start lg:gap-[var(--gap-columns)]">
            <div className="grid gap-4 lg:sticky lg:top-32 lg:col-span-5">
              <p className="section-index">
                {isEs
                  ? "Antes de empezar a producir"
                  : "Before production begins"}
              </p>
              <h2 className="m-0 max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                {isEs
                  ? "No podemos prometerte que nunca surgirá un contratiempo. Te prometemos que todo se revisa dos, tres y cinco veces."
                  : "We cannot promise nothing will ever hit a snag. We promise everything is checked two, three, five times."}
              </h2>
              <p className="m-0 max-w-[44ch] text-[var(--color-muted)]">
                {isEs
                  ? "Fabricar entre dos continentes siempre tiene muchas piezas que encajar, desde una tintada hasta un despacho de aduanas. La tranquilidad nace de dejar cada criterio por escrito antes de que ninguna planta pida piel o tejido, y de avisarte de cualquier pequeño ajuste antes de que tengas que preguntar."
                  : "Manufacturing across two continents always involves moving parts, from dye batches to customs clearance. Trust comes from putting every benchmark in writing before any production unit orders hides or fabric, and flagging small refinements before you ever have to ask."}
              </p>
              <div className="grid gap-2 pt-2 text-[length:var(--text-sm)]">
                <Link
                  className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref(
                    "/stories/why-sample-approval-decides-bulk",
                  )}
                >
                  {isEs
                    ? "Lee por qué aprobar la muestra física decide la calidad del pedido →"
                    : "Read why physical sample sign-off decides production quality →"}
                </Link>
                <Link
                  className="inline-flex min-h-[44px] w-fit items-center font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  href={localizeHref("/terms")}
                >
                  {isEs
                    ? "Consulta nuestras condiciones de propiedad intelectual y confidencialidad →"
                    : "View our intellectual property and confidentiality terms →"}
                </Link>
              </div>
            </div>

            <div className="grid border-t border-[var(--color-rule)] lg:col-span-7">
              {MANUFACTURING_PRE_PRODUCTION_AGREEMENTS.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-2.5 border-b border-[var(--color-rule)] py-8"
                >
                  <span className="num text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-ink)] uppercase">
                    {item.number}
                  </span>
                  <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.18] font-normal">
                    {item.title[language]}
                  </h3>
                  <p className="m-0 max-w-[56ch] text-[length:var(--text-md)] leading-[1.7] text-[var(--color-muted)]">
                    {item.body[language]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* 8. Frequently Asked Questions (All Visible in Initial HTML for Humans & AI) */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="faq"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-2xl)] lg:grid-cols-12 lg:items-start lg:gap-[var(--gap-columns)]">
              <div className="grid gap-4 lg:sticky lg:top-32 lg:col-span-4">
                <p className="section-index">
                  {isEs ? "Preguntas frecuentes" : "Frequently asked questions"}
                </p>
                <h2 className="m-0 max-w-[15ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Respuestas claras antes de dar el salto a la India"
                    : "Straight answers before you manufacture in India"}
                </h2>
                <p className="m-0 max-w-[36ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-muted)]">
                  {isEs
                    ? "Qué esperar sobre el estudio de producto, nuestras cuatro categorías, las unidades de producción auditadas, el respaldo legal, las cantidades, los idiomas y la entrega en tu negocio."
                    : "What to expect on product study, our four manufacturing categories, vetted Indian production units, legal protection, order quantities, languages, and European delivery."}
                </p>
                <div className="grid gap-1 text-[length:var(--text-sm)]">
                  <Link
                    href={localizeHref("/contact")}
                    className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  >
                    {isEs
                      ? "Escribe directamente a Alma y Shirish →"
                      : "Write directly to Alma and Shirish →"}
                  </Link>
                  <Link
                    href={localizeHref(
                      "/stories/matching-a-workshop-to-the-product",
                    )}
                    className="inline-flex min-h-[44px] w-fit items-center font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  >
                    {isEs
                      ? "Historia: Cómo elegimos la unidad de producción adecuada →"
                      : "Story: Matching each production unit to your product →"}
                  </Link>
                  <Link
                    href={localizeHref(
                      "/stories/why-sample-approval-decides-bulk",
                    )}
                    className="inline-flex min-h-[44px] w-fit items-center font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  >
                    {isEs
                      ? "Historia: Por qué la muestra decide tu producción →"
                      : "Story: Why physical samples decide production quality →"}
                  </Link>
                </div>
                <p className="m-0 border-t border-[var(--color-rule-2)]/50 pt-4 text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-muted)]">
                  {isEs ? (
                    <>
                      Última revisión de Alma y Shirish el{" "}
                      <time dateTime={MANUFACTURING_LAST_REVIEWED.iso}>
                        {MANUFACTURING_LAST_REVIEWED.es}
                      </time>
                      .
                    </>
                  ) : (
                    <>
                      Last reviewed by Alma and Shirish on{" "}
                      <time dateTime={MANUFACTURING_LAST_REVIEWED.iso}>
                        {MANUFACTURING_LAST_REVIEWED.en}
                      </time>
                      .
                    </>
                  )}
                </p>
              </div>

              <div className="grid gap-4 lg:col-span-8">
                {MANUFACTURING_FAQS.map((item) => (
                  <article
                    key={item.id}
                    className="grid gap-2.5 border border-[var(--color-rule-2)]/55 bg-[var(--color-paper)] p-6"
                  >
                    <h3 className="m-0 font-[family-name:var(--font-display)] text-[clamp(1.18rem,1.6vw,1.42rem)] leading-[1.25] font-normal text-[var(--color-forest-deep)]">
                      {item.question[language]}
                    </h3>
                    <p className="m-0 max-w-[62ch] text-[length:var(--text-sm)] leading-[1.7] text-[var(--color-ink-2)]">
                      {item.answer[language]}
                    </p>
                  </article>
                ))}
              </div>
            </div>

            {/* Mid-page CRO bridge #3 */}
            <div className="grid gap-4 border border-[var(--color-rule-2)]/60 bg-[var(--color-paper)] p-6 lg:grid-cols-12 lg:items-center lg:p-8">
              <div className="grid gap-1.5 lg:col-span-5">
                <p className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-forest-deep)]">
                  {isEs
                    ? "¿Sigues dándole vueltas a un material o a una fecha de temporada?"
                    : "Still weighing up a material or a seasonal deadline?"}
                </p>
                <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                  {isEs
                    ? "Sin compromiso. Videollamada gratuita de 15 minutos con conclusiones por escrito justo después."
                    : "Zero obligation. Free 15-minute video call with written meeting conclusions sent straight after."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-3 lg:col-span-7 lg:justify-end">
                <Link
                  className="primary-button"
                  href={localizeHref("/product-brief")}
                >
                  {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
                </Link>
                <Link
                  className="inline-flex min-h-[var(--control-height)] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-forest-deep)] px-5 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] no-underline transition-colors hover:bg-[var(--color-forest-deep)] hover:text-[var(--color-paper)]"
                  href={localizeHref("/book-a-call?duration=15")}
                >
                  {isEs
                    ? "Reserva una llamada gratis de 15 min con Alma"
                    : "Book a free 15-min video call with Alma"}
                </Link>
                <a
                  className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={WHATSAPP_CTA_HREF[language]}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {isEs
                    ? "Escribe a Alma por WhatsApp"
                    : "Message Alma on WhatsApp"}
                </a>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="forest-deep" />

        {/* 9. Closing Conversion Band with Crosshair-Bracketed CTA */}
        <section className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.12em] text-[var(--color-gold)] uppercase">
                {isEs ? "Siguiente paso" : "Next step"}
              </p>
              <h2 className="m-0 max-w-[16ch] text-[length:var(--text-display)] leading-[1.02] font-normal text-[var(--color-paper)]">
                {isEs
                  ? "Cuéntanos qué quieres fabricar. Nosotros estudiamos qué hace falta en la India."
                  : "Tell us what you want to make. We will study what it takes in India."}
              </h2>
              <p className="lead m-0 max-w-[48ch] text-[var(--color-paper-2)]">
                {isEs
                  ? "Comparte un boceto rápido o una pieza que ya te piden en tu tienda. En 1 minuto puedes enviarnos tu idea o reservar una videollamada gratuita de 15 minutos con Alma para recibir conclusiones por escrito y una valoración sincera de viabilidad."
                  : "Share a rough sketch or a piece your customers already ask for. In 1 minute you can send your idea, or book a free 15-minute video call with Alma for clear written meeting conclusions and an honest feasibility read."}
              </p>
            </div>

            <div className="grid justify-items-start gap-4 lg:col-span-5 lg:justify-items-end">
              {/* 3D Discovery-inspired corner crosshair bracket frame */}
              <Link
                className="group relative mx-1 inline-flex min-h-[68px] items-center justify-center bg-[var(--color-gold)] px-6 py-4 text-[length:var(--text-md)] font-semibold text-[var(--color-night)] no-underline transition-colors duration-300 hover:bg-[var(--color-paper)] sm:mx-0 sm:px-9"
                href={localizeHref("/product-brief")}
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2.5 -left-2.5 h-3.5 w-3.5 border-t-2 border-l-2 border-[var(--color-gold)] transition-all duration-300 group-hover:-top-3.5 group-hover:-left-3.5 group-hover:h-4 group-hover:w-4"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-2.5 -right-2.5 h-3.5 w-3.5 border-t-2 border-r-2 border-[var(--color-gold)] transition-all duration-300 group-hover:-top-3.5 group-hover:-right-3.5 group-hover:h-4 group-hover:w-4"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-2.5 -left-2.5 h-3.5 w-3.5 border-b-2 border-l-2 border-[var(--color-gold)] transition-all duration-300 group-hover:-bottom-3.5 group-hover:-left-3.5 group-hover:h-4 group-hover:w-4"
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-2.5 -bottom-2.5 h-3.5 w-3.5 border-r-2 border-b-2 border-[var(--color-gold)] transition-all duration-300 group-hover:-right-3.5 group-hover:-bottom-3.5 group-hover:h-4 group-hover:w-4"
                />
                <span>
                  {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
                </span>
              </Link>

              <Link
                className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-medium text-[var(--color-paper-2)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
                href={localizeHref("/book-a-call?duration=15")}
              >
                {isEs
                  ? "O reserva una llamada gratis de 15 min con Alma"
                  : "Or book a free 15-min video call with Alma"}
              </Link>

              <a
                className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-medium text-[var(--color-paper-2)]/85 underline decoration-[var(--color-paper)]/35 underline-offset-4 hover:text-[var(--color-paper)]"
                href={WHATSAPP_CTA_HREF[language]}
                rel="noopener noreferrer"
                target="_blank"
              >
                {isEs
                  ? "¿Prefieres un mensaje rápido? Escribe a Alma por WhatsApp"
                  : "Prefer a quick message? Write to Alma on WhatsApp"}
              </a>

              <p className="m-0 max-w-[38ch] text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-paper-2)]/75 lg:text-right">
                {isEs
                  ? "No necesitas ficha técnica. Tus diseños son confidenciales (NDA) y Alma lee tu mensaje personalmente."
                  : "No tech pack needed. Your designs stay confidential, with mutual NDA available, and Alma reads your note personally."}
              </p>
            </div>
          </div>
        </section>

        <SectionBridge from="forest-deep" to="night" />
      </main>

      <SiteFooter />
    </>
  );
}
