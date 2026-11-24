import Image from "next/image";
import Link from "next/link";

import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import {
  ABOUT_COMPANY_FACTS,
  ABOUT_FAQS,
  ABOUT_FOUNDER_QUOTES,
  ABOUT_HERO_FACTS,
  ABOUT_LAST_REVIEWED,
  ABOUT_PRINCIPLES,
} from "@/data/about-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

import styles from "./about.module.css";

const WHATSAPP_CTA_HREF = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma, I read about you and Shirish on KarmaRise D Global and would like to discuss a product idea.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma, acabo de leer vuestra historia en KarmaRise D Global y me gustaría hablar sobre una idea de producto.")}`,
} as const;

export function AboutPageClient({
  lang = "en",
}: {
  lang?: SiteLanguage;
} = {}) {
  const language = lang;
  const localizeHref = (href: string) => localizePath(href, language);
  const isEs = language === "es";

  return (
    <>
      <main className={styles.about} id="main">
        {/* 1. Breadcrumb + Entity Definition Hero + Quick-Facts Strip */}
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
                    {isEs ? "Quiénes somos" : "About"}
                  </li>
                </ol>
              </nav>
              <span className="text-[var(--color-paper-2)]/80">
                {isEs
                  ? "España, resto de Europa e India · Karmarise Global LLP"
                  : "Spain, rest of Europe & India · Karmarise Global LLP"}
              </span>
            </div>

            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-lg)] lg:col-span-7">
                <h1 className="m-0 max-w-[17ch] text-[clamp(2.2rem,3.9vw+0.6rem,4.55rem)] leading-[1.01] font-normal text-[var(--color-paper)]">
                  {isEs
                    ? "Conoce a Alma y Shirish, los fundadores de KarmaRise D Global"
                    : "Meet Alma and Shirish, the founders behind KarmaRise D Global"}
                </h1>
              </div>

              <div className="grid gap-5 lg:col-span-5">
                <p className="lead m-0 text-[var(--color-paper-2)]">
                  {isEs
                    ? "KarmaRise D Global acompaña a comercios, marcas y cadenas de España y el resto de Europa para desarrollar y fabricar en la India sus propios bolsos de piel y otros artículos de cuero, prendas de diversos tejidos, complementos confeccionados a medida y decoración del hogar. Alma dirige la relación con clientes y el criterio de producto desde España. Shirish, abogado colegiado en el Bar Council de la India, redacta los contratos y supervisa cada encargo sobre el terreno."
                    : "KarmaRise D Global helps independent shops, retail chains, and brands in Spain and the rest of Europe develop and manufacture own-brand leather bags and other leather goods, clothing in natural and varied fabrics, custom sewn accessories, and home decor across India. Alma leads Client alignment and product ergonomics from Spain, while Shirish, a registered Bar Council advocate in India, writes supplier contracts and supervises production on site."}
                </p>

                <div className="flex flex-wrap items-center gap-3.5">
                  <Link
                    className="primary-button"
                    href={localizeHref("/product-brief")}
                  >
                    {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
                  </Link>
                  <Link
                    className="inline-flex min-h-[var(--control-height)] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-paper)]/55 bg-[var(--color-night)]/30 px-5 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] no-underline transition-colors hover:border-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-night)]"
                    href={localizeHref("/book-a-call?duration=15")}
                  >
                    {isEs
                      ? "Llamada gratis de 15 min con Alma"
                      : "Book a free 15-min call with Alma"}
                  </Link>
                </div>

                <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
                  {isEs
                    ? "Sin ficha técnica previa. Tus diseños son confidenciales bajo acuerdo mutuo NDA y Alma te envía las conclusiones de la reunión nada más colgar."
                    : "No tech pack needed. Your designs stay confidential under a mutual NDA, and Alma sends written meeting conclusions straight after your call."}
                </p>
              </div>
            </div>

            <dl className="m-0 grid border-t border-l border-[var(--color-paper)]/18 md:grid-cols-3">
              {ABOUT_HERO_FACTS.map((fact) => (
                <div
                  key={fact.number}
                  className="grid content-start gap-2.5 border-r border-b border-[var(--color-paper)]/18 p-6"
                >
                  <span className="num text-[length:var(--text-xs)] font-semibold tracking-[0.1em] text-[var(--color-gold)] uppercase">
                    {fact.number}
                  </span>
                  <dt className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-paper)]">
                    {fact.label[language]}
                  </dt>
                  <dd className="m-0 text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-paper-2)]/85">
                    {fact.detail[language]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <SectionBridge from="forest-deep" to="paper" />

        {/* 2. Alma */}
        <section className={styles.founder} id="alma">
          <div className={`${styles.founderGrid} container`}>
            <figure className={styles.founderPortrait}>
              <Image
                src="/images/founders/alma-spain-hillside-portrait.jpeg"
                alt={
                  isEs
                    ? "Alma en un mirador junto a la costa en España"
                    : "Alma at a coastal hillside overlook in Spain"
                }
                fill
                sizes="(max-width: 64rem) 100vw, 50vw"
              />
            </figure>
            <div className={styles.founderCopy}>
              <h2>Alma</h2>
              <p className={styles.founderLead}>
                {isEs
                  ? "Empresaria española que reparte su calendario entre España y la India, Alma sabe bien lo que cuesta subir el cierre de una tienda cada mañana y responder por cada pieza del escaparate."
                  : "A Spanish business owner working between Spain and India, Alma knows what it takes to open a shop every morning and stand behind every piece in the window."}
              </p>
              <div className="grid gap-4">
                <p className="m-0 max-w-[48ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Antes de fundar KarmaRise D Global, dirigió sus propias compañías y acompañó a clientes internacionales al importar desde Asia. Conoce al detalle el coste real de perder una campaña o sufrir un encargo mal interpretado. Por eso presta atención a esos pequeños detalles que ocurren sobre el terreno y deciden si alguien compra o vuelve a dejar el artículo en su sitio: una caída del asa dos centímetros corta, una cremallera metálica que engancha un abrigo de invierno, un forro oscuro donde desaparecen las llaves o un vestido de lino con un corte incómodo."
                    : "Before co-founding KarmaRise D Global, Alma ran her own companies and helped international Clients import from Asia. She knows what a missed retail season or a vague brief costs. She watches for the everyday retail clues that decide whether a shopper buys an item or sets it back down: a strap drop two centimetres too short, a metal zipper catching a winter coat, a dark lining hiding keys at the bottom of a bag, or a summer linen dress with an uncomfortable cut."}
                </p>
                <p className="m-0 max-w-[48ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Conduce tus videollamadas y te manda por correo las conclusiones de la reunión nada más colgar para que ningún matiz quede en el aire. Sobre el terreno junto a Shirish, palpa pieles, tejidos y acabados a mano, descarta las pruebas flojas y prepara cada muestra para valoración antes de enviártela. También lidera nuestra firma propia de moda y decoración, AlmaRise D Brand."
                    : "She leads your discovery calls and emails written meeting conclusions straight after hanging up so nothing slips between conversations. Working on the ground in India beside Shirish, she checks hides, textiles, and finishing by hand, reviews every prototype first, and sets aside weak drafts so you evaluate clean physical samples before approving production. She also leads our own fashion and lifestyle label, AlmaRise D Brand."}
                </p>
              </div>
              <dl className="m-0 grid gap-2.5 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)]">
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    {isEs ? "Rol" : "Role"}
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    {isEs
                      ? "Cofundadora, relación con clientes, ergonomía comercial y AlmaRise D Brand"
                      : "Co-founder, Client alignment, retail ergonomics, and AlmaRise D Brand"}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    {isEs ? "Enfoque" : "Focus"}
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    {isEs
                      ? "Videollamadas, conclusiones por escrito, revisión de muestras físicas y usabilidad"
                      : "Discovery calls, written meeting conclusions, physical sample reviews, and product ergonomics"}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    {isEs ? "Presencia" : "Presence"}
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    {isEs
                      ? "Entre España, el resto de Europa y puntos de producción en la India"
                      : "Works between Spain, the rest of Europe, and production sites across India"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* 3. Shirish */}
        <section
          className={`${styles.founder} ${styles.founderShirish}`}
          id="shirish"
        >
          <div className={`${styles.founderGrid} container`}>
            <div className={styles.founderCopy}>
              <h2>Shirish</h2>
              <p className={styles.founderLead}>
                {isEs
                  ? "Abogado colegiado en el Bar Council de la India, Shirish redacta contratos vinculantes bajo ley india con cada unidad de producción y vigila el proceso a pie de obra desde la primera tintada hasta las cajas de exportación."
                  : "A registered Bar Council advocate in India, Shirish drafts enforceable Indian supplier contracts and oversees production on the ground from first dye batch to export carton."}
              </p>
              <div className="grid gap-4">
                <p className="m-0 max-w-[48ch] text-[var(--color-muted)]">
                  {isEs
                    ? "A muchas marcas europeas les da respeto dar el salto a la India tras escuchar relatos de anticipos perdidos o fábricas lejanas que responden que sí a todo por correo y luego recortan calidades. Shirish despeja esa inquietud. Visita y audita cada instalación en persona. Fija por escrito las tolerancias de materiales, los hitos de pago, los acuerdos mutuos NDA y NNN y las fechas de entrega. Después mide cada muestra física frente a tu briefing de producto."
                    : "European founders often hold back from manufacturing in India after hearing stories of lost deposits or distant factories promising everything by email and cutting corners later. Shirish removes that uncertainty. He audits specialist production units and family-run factories across India in person, writes material tolerances, payment milestones, mutual NDA and NNN confidentiality protections, and delivery dates into binding contracts under Indian law, and checks every physical sample against your Product Brief."}
                </p>
                <p className="m-0 max-w-[48ch] text-[var(--color-muted)]">
                  {isEs
                    ? "Cuando una colección exige oficios de distintas zonas, coordina núcleos especialistas en Calcuta, Kanpur, Agra y Chennai bajo un solo equipo y con vigilancia de calidad desde Maharashtra. Lleva también la documentación de exportación hacia la UE y dirige el armado jurídico de la futura fundación Section 8 que sostendrá nuestra Iniciativa de formación para mujeres."
                    : "When a collection calls for distinct regional strengths, he coordinates specialist craft hubs across Kolkata, Kanpur, Agra, and Chennai with quality supervision led from Maharashtra under one accountable team. He also manages EU export paperwork and leads the legal preparation for our planned Section 8 foundation behind the Women's Training Initiative."}
                </p>
              </div>
              <dl className="m-0 grid gap-2.5 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)]">
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    {isEs ? "Acreditación legal" : "Legal standing"}
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    {isEs
                      ? "Abogado colegiado en el Bar Council de la India"
                      : "Registered Bar Council advocate in India"}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    {isEs ? "Enfoque" : "Focus"}
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    {isEs
                      ? "Contratos bajo ley india, acuerdos mutuos NDA y NNN, auditorías externas, controles en planta y aduanas UE"
                      : "Indian supplier contracts, mutual NDA and NNN protections, partner audits, on-site checks, and EU export"}
                  </dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    {isEs ? "Operaciones" : "Operations"}
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    {isEs
                      ? "Calcuta, Kanpur, Agra, Chennai y el resto del país, coordinadas desde Maharashtra"
                      : "Across Kolkata, Kanpur, Agra, Chennai, and wider India, coordinated from Maharashtra"}
                  </dd>
                </div>
              </dl>
            </div>
            <figure
              className={`${styles.founderPortrait} ${styles.shirishPortrait}`}
            >
              <Image
                src="/images/founders/shirish-co-founder-office-india.jpeg"
                alt={
                  isEs
                    ? "Shirish, cofundador y abogado colegiado en el Bar Council, sentado en su escritorio en la oficina en la India"
                    : "Shirish, co-founder and registered Bar Council advocate, seated at his office desk in India"
                }
                fill
                sizes="(max-width: 64rem) 100vw, 50vw"
              />
            </figure>
          </div>
        </section>

        <SectionBridge from="paper" to="forest-deep" />

        {/* 4. Origin */}
        <section className={styles.origin} id="origin">
          <div className={`${styles.originStory} section-intro container`}>
            <h2>
              {isEs
                ? "Una conversación entre dos continentes y un vuelo a la India"
                : "A conversation across two continents, and a flight to India"}
            </h2>
            <p className="lead">
              {isEs
                ? "Nos conocimos por internet en una conferencia internacional de idiomas tras el confinamiento, cuando Shirish pidió ayuda a Alma para pulir su inglés. Aquellas sesiones derivaron pronto en largas charlas sobre historia india, oficios manuales y formación remunerada para mujeres. Pocos meses después, Alma subió a un avión rumbo a la India. Recorrimos juntos fábricas de corte familiar, marroquineros y confeccionistas por varios estados, comprobando qué lugares de producción abren sus puertas de par en par y nos dejan conversar directamente con quienes cosen cada jornada. El 15 de mayo de 2025 constituimos Karmarise Global LLP para operar KarmaRise D Global."
                : "We met online at an international language conference after the lockdown, when Shirish asked Alma for help with his English. Those calls grew into long conversations about Indian history, craft, and paid garment skills for women. A few months later, Alma boarded a flight from Spain to India. Together we began visiting family-run factories, leather ateliers, and garment makers across Indian states, sitting beside master cutters and seeing which production sites keep open doors and let us speak directly with the people on the machines. On 15 May 2025 we incorporated Karmarise Global LLP to run KarmaRise D Global."}
            </p>
          </div>
        </section>

        <SectionBridge from="forest-deep" to="pale-sage" />

        {/* 5. Why KarmaRise + Founder Quotes + Team Photo */}
        <section className={styles.meaning} id="why-karmarise">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className={styles.meaningGrid}>
              <div className={styles.meaningTitle}>
                <h2>{isEs ? "¿Por qué KarmaRise?" : "Why KarmaRise?"}</h2>
              </div>
              <div className={styles.meaningCopy}>
                <p className={styles.largeCopy}>
                  {isEs
                    ? "Quienes suben el cierre de su tienda cada día pelean contra la comodidad de comprar online y contra comprar a un mayorista exactamente lo mismo que vende toda la calle. Fundamos KarmaRise D Global para que comercios y marcas puedan ofrecer moda a medida y decoración propia, abrir cajas en la puerta de su negocio y colocar directamente en el escaparate una colección que no tiene nadie más."
                    : "Independent shops face daily pressure from online marketplaces and copy-paste wholesale catalogues. We started KarmaRise D Global so boutique owners, retail chains, and emerging brands can offer tailor-made fashion and home decor, open numbered export cartons at their business door, and place a collection straight into the window that nobody down the street carries."}
                </p>
              </div>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              {ABOUT_FOUNDER_QUOTES.map((item) => (
                <blockquote
                  key={item.id}
                  className="m-0 grid content-between gap-4 border-l-2 border-[var(--color-clay)] bg-[var(--color-paper)]/80 p-6"
                >
                  <p className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.32] text-[var(--color-forest-deep)]">
                    {isEs ? `«${item.quote.es}»` : `"${item.quote.en}"`}
                  </p>
                  <cite className="text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)] uppercase not-italic">
                    {item.attribution[language]}
                  </cite>
                </blockquote>
              ))}
            </div>

            <figure className="relative m-0 aspect-[16/9] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)]">
              <Image
                src="/images/workshops/alma-studio-team-dust-bags-india.jpeg"
                alt={
                  isEs
                    ? "Alma y el equipo en nuestro estudio en la India sosteniendo bolsas guardapolvo de algodón terminadas frente a la pizarra de trabajo"
                    : "Alma and the team in our studio in India holding finished cotton dust bags in front of the project whiteboard"
                }
                fill
                sizes="(max-width: 80rem) 100vw, 1280px"
                className="object-cover"
              />
            </figure>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="paper" />

        {/* 6. Principles */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="principles"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)] lg:flex lg:items-end lg:justify-between">
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                {isEs
                  ? "Cómo trabajamos con las personas"
                  : "How we work with people"}
              </h2>
              <Link
                className="inline-flex min-h-[44px] w-fit items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/how-we-work")}
              >
                {isEs
                  ? "Ver cómo coordinamos España y la India día a día →"
                  : "See how we coordinate Spain and India day to day →"}
              </Link>
            </div>

            <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2">
              {ABOUT_PRINCIPLES.map((principle) => (
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

        {/* 7. Multi-Region Partner Vetting & Stories Proof */}
        <section className={styles.india} id="workshops">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className={styles.indiaGrid}>
              <figure className={styles.indiaImage}>
                <Image
                  src="/images/workshops/alma-cognac-leather-cutting-table.jpeg"
                  alt={
                    isEs
                      ? "Alma y tres especialistas marroquineros inspeccionando pieles de curtido vegetal color coñac en un punto de producción en la India"
                      : "Alma and three leathercraft specialists inspecting cognac vegetable-tanned hides at an Indian production site"
                  }
                  fill
                  sizes="(max-width: 64rem) 100vw, 58vw"
                />
              </figure>
              <div className={styles.indiaCopy}>
                <h2>
                  {isEs
                    ? "Encajar cada producto con la región india que mejor domina su oficio"
                    : "Matching every product to the Indian hub that knows it best"}
                </h2>
                <div className="grid gap-4">
                  <p className="m-0">
                    {isEs
                      ? "Confeccionar bolsos de piel estructurados y pequeña marroquinería requiere maquinaria y destreza muy distintas a las de coser vestidos en tejidos naturales, complementos a medida o artículos de decoración del hogar. Conectamos tu briefing de producto con la unidad adecuada en polos especialistas como Calcuta, Kanpur, Agra y Chennai, llevando el seguimiento de calidad desde Maharashtra."
                      : "Structured leather bags and small leather goods demand different machinery and skill from dresses in natural fabrics, custom sewn accessories, or crafted home decor. We match your Product Brief to the right production unit across India's specialist craft hubs, including Kolkata, Kanpur, Agra, and Chennai, with quality coordination led from Maharashtra."}
                  </p>
                  <p className="m-0">
                    {isEs
                      ? "Para un comercio independiente español coordinamos una colección de bolsos de cuero entre tres regiones bajo un solo equipo: curtido vegetal suave en Calcuta, marroquinería en Uttar Pradesh y supervisión presencial desde Maharashtra. Estilizamos la mochila hacia una silueta más ligera con asa superior de mano, herrajes de latón envejecido, forro claro de algodón y cremalleras japonesas YKK de plástico de alta calidad que cuidan las manos y los abrigos de invierno. Antes de la salida hacia España, repasamos una a una las once cajas de exportación numeradas."
                      : "For an independent boutique in Spain, we coordinated one leather handbag collection across three Indian regions under one team: soft vegetable tanning in Kolkata, leather construction in Uttar Pradesh, and quality supervision from Maharashtra. We reshaped the backpack into a lighter tapered silhouette with a top grab handle, antique brass hardware, light cotton lining, and high-quality Japanese plastic YKK zippers that protect hands and winter coats. Then we inspected all eleven numbered export cartons before dispatch to the Client's shop door in Spain."}
                  </p>
                </div>
                <div className="grid gap-2">
                  <Link
                    href={localizeHref("/manufacturing#artisans-and-workshops")}
                  >
                    {isEs
                      ? "Descubre cómo auditamos y elegimos cada unidad de producción →"
                      : "See how we audit and choose each Manufacturing Partner →"}
                  </Link>
                  <Link
                    className="!font-medium !text-[var(--color-muted)] !decoration-[var(--color-rule-2)] hover:!text-[var(--color-forest-deep)]"
                    href={localizeHref(
                      "/stories/matching-a-workshop-to-the-product",
                    )}
                  >
                    {isEs
                      ? "Lee la Historia sobre cómo elegimos al especialista para cada pieza →"
                      : "Read the Story on matching each maker to your product →"}
                  </Link>
                  <Link
                    className="!font-medium !text-[var(--color-muted)] !decoration-[var(--color-rule-2)] hover:!text-[var(--color-forest-deep)]"
                    href={localizeHref(
                      "/stories/from-spain-to-a-cutting-table-in-india",
                    )}
                  >
                    {isEs
                      ? "Lee cómo una primera llamada en España llega a producción en la India →"
                      : "Read how a first call in Spain moves into production in India →"}
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2">
              <figure className="relative m-0 aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-2)]">
                <Image
                  src="/images/workshops/shirish-master-cutter-seam-inspection.jpeg"
                  alt={
                    isEs
                      ? "Shirish comprobando costuras y piezas de piel junto al maestro cortador en una unidad de producción auditada en la India"
                      : "Shirish inspecting leather seams with a master cutter at a vetted Indian production unit"
                  }
                  fill
                  sizes="(max-width: 40rem) 100vw, 48vw"
                  className="object-cover"
                />
              </figure>
              <figure className="relative m-0 aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-2)]">
                <Image
                  src="/images/workshops/shirish-inspecting-leather-cutting-table.jpeg"
                  alt={
                    isEs
                      ? "Shirish revisando piezas de piel cortadas y patrones durante un control en planta en la India"
                      : "Shirish checking cut leather panels and pattern templates during an on-site check in India"
                  }
                  fill
                  sizes="(max-width: 40rem) 100vw, 48vw"
                  className="object-cover"
                />
              </figure>
            </div>

            {/* 7B. Mid-page CRO Bridge */}
            <div className="grid gap-5 border-t border-[var(--color-rule)] pt-8 lg:grid-cols-12 lg:items-center">
              <div className="grid gap-2 lg:col-span-6">
                <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                  {isEs
                    ? "¿Te preguntas qué unidad de producción en la India encaja con tu idea?"
                    : "Wondering which Indian production unit fits your product idea?"}
                </h3>
                <p className="m-0 max-w-[48ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-muted)]">
                  {isEs
                    ? "Mándanos un boceto rápido o una pieza que ya rote bien en tu tienda, sea marroquinería, ropa, complementos o decoración del hogar. Te diremos con franqueza qué resulta viable antes de que pagues una sola muestra."
                    : "Send a rough sketch or a favourite piece from your shop, whether it is leather goods, clothing, sewn accessories, or home decor. Alma and Shirish will tell you plainly what is feasible before you spend anything on samples."}
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 lg:col-span-6 lg:items-end">
                <div className="flex flex-wrap items-center gap-3 lg:justify-end">
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
                      ? "Llamada gratis de 15 min con Alma"
                      : "Book a free 15-min call with Alma"}
                  </Link>
                </div>
                <a
                  className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={WHATSAPP_CTA_HREF[language]}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {isEs
                    ? "¿Prefieres mandar un mensaje rápido primero? Escribe a Alma por WhatsApp"
                    : "Prefer a quick message first? Message Alma on WhatsApp"}
                </a>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        {/* 8. Where We Work + Structured Company & Founders Fact Table */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="company-structure"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--gap-columns)] lg:grid-cols-12 lg:items-end">
              <div className="grid gap-[var(--space-sm)] lg:col-span-5">
                <p className="section-index m-0">
                  {isEs ? "Estructura y presencia" : "Structure and presence"}
                </p>
                <h2 className="m-0 max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                  {isEs
                    ? "Dónde trabajamos y cómo estamos organizados"
                    : "Where we work and how we are set up"}
                </h2>
              </div>

              <div className="grid gap-3 lg:col-span-7">
                <p className="m-0 max-w-[54ch] text-[var(--color-ink-2)]">
                  {isEs
                    ? "Coordinamos la fabricación por los centros especialistas de la India desde nuestro estudio en Maharashtra, cerca de Mumbai, y atendemos directamente a comercios, marcas de moda y decoración y cadenas de España y el resto de Europa durante las 3,5 a 4,5 horas de coincidencia diaria."
                    : "We coordinate production across India's craft hubs from our studio in Maharashtra, near Mumbai, and work directly with boutiques, fashion and home decor brands, and retail chains across Spain and the rest of Europe during the 3.5 to 4.5 hour daily overlap."}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-1 text-[length:var(--text-sm)]">
                  <Link
                    className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={localizeHref("/contact")}
                  >
                    {isEs
                      ? "Ver datos de contacto →"
                      : "View contact details →"}
                  </Link>
                  <Link
                    className="inline-flex min-h-[44px] items-center font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                    href={localizeHref("/legal-notice")}
                  >
                    {isEs
                      ? "Aviso legal y registro →"
                      : "Legal notice & registration →"}
                  </Link>
                  <Link
                    className="inline-flex min-h-[44px] items-center font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                    href={localizeHref("/terms")}
                  >
                    {isEs
                      ? "Confidencialidad y propiedad intelectual →"
                      : "Confidentiality & IP terms →"}
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid gap-4">
              <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] font-normal text-[var(--color-forest-deep)]">
                {isEs
                  ? "KarmaRise D Global y sus fundadores de un vistazo"
                  : "KarmaRise D Global and founders at a glance"}
              </h3>
              <div className="overflow-x-auto border border-[var(--color-rule-2)]/60 bg-[var(--color-paper)]">
                <table className="w-full min-w-[620px] border-collapse text-left text-[length:var(--text-sm)]">
                  <caption className="sr-only">
                    {isEs
                      ? "Datos clave de KarmaRise D Global, Karmarise Global LLP, cofundadores, idiomas de trabajo, categorías B2B e iniciativas"
                      : "Key company facts for KarmaRise D Global, Karmarise Global LLP, co-founders, working languages, B2B categories, and initiatives"}
                  </caption>
                  <tbody className="divide-y divide-[var(--color-rule)]">
                    {ABOUT_COMPANY_FACTS.map((row) => (
                      <tr key={row.id}>
                        <th
                          scope="row"
                          className="w-[30%] bg-[var(--color-dune)]/35 px-5 py-4 align-top font-semibold text-[var(--color-forest-deep)]"
                        >
                          {row.label[language]}
                        </th>
                        <td className="px-5 py-4 align-top leading-[1.6] text-[var(--color-ink-2)]">
                          {row.value[language]}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* 9. Owned Brand & Planned Initiative */}
        <section className={styles.future} id="initiatives">
          <div className={`${styles.futureGrid} container`}>
            <div className={styles.futureHeading}>
              <h2>
                {isEs
                  ? "Qué más estamos desarrollando en la India"
                  : "What else we are building in India"}
              </h2>
            </div>
            <article>
              <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)]">
                <Image
                  src="/images/almarise/almarise-reborn-magenta-saree-garment.jpeg"
                  alt={
                    isEs
                      ? "Prenda exterior fucsia con bordado dorado zari confeccionada por AlmaRise D Brand a partir de un sari indio guardado"
                      : "Magenta and gold zari everyday outer garment tailored by AlmaRise D Brand from a kept Indian saree"
                  }
                  fill
                  sizes="(max-width: 46rem) 100vw, (max-width: 80rem) 50vw, 33vw"
                  className="object-cover object-top"
                />
              </figure>
              <h3>AlmaRise D Brand</h3>
              <p>
                {isEs ? (
                  <>
                    Cortar, probar y rematar nuestras propias piezas cada semana
                    afina el ojo para la caída, la textura y los acabados de
                    cada encargo comercial. AlmaRise D Brand abarca más de dos
                    líneas: <strong>AlmaRise D Reborn</strong> transforma saris
                    que mujeres indias han guardado y que tienen una historia
                    que contar (<em>thevnitlya sadya</em>) en prendas de uso
                    diario únicas, como shrugs y vestidos;{" "}
                    <strong>AlmaRise D Organic</strong> emplea tintes orgánicos
                    y tejidos de residuos vegetales como caña de azúcar,
                    naranja, plátano y piña, entre otros; y nuestra línea de
                    decoración del hogar traslada ese mismo oficio natural a los
                    espacios de casa.
                  </>
                ) : (
                  <>
                    Cutting, fitting, and finishing our own pieces every week
                    sharpens our eye for fabric drape, texture, and seam quality
                    on every Client production run. AlmaRise D Brand spans more
                    than two lines: <strong>AlmaRise D Reborn</strong> turns
                    Indian sarees that women have kept and that carry a story (
                    <em>thevnitlya sadya</em>) into one-of-a-kind everyday
                    garments such as shrugs and dresses;{" "}
                    <strong>AlmaRise D Organic</strong> works with organic dyes
                    and plant or fruit-waste textiles such as sugarcane, orange,
                    banana, and pineapple, among others; and our AlmaRise D Home
                    Decor line brings that same tactile craft into everyday
                    living spaces.
                  </>
                )}
              </p>
              <div className="grid gap-1">
                <Link
                  className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/almarise")}
                >
                  {isEs
                    ? "Conocer AlmaRise D Brand →"
                    : "Explore AlmaRise D Brand →"}
                </Link>
                <Link
                  className="inline-flex min-h-[44px] w-fit items-center text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  href={localizeHref(
                    "/stories/giving-maharashtrian-sarees-a-second-life",
                  )}
                >
                  {isEs
                    ? "Leer la Historia detrás de AlmaRise D Brand →"
                    : "Read the Story behind AlmaRise D Brand →"}
                </Link>
              </div>
            </article>
            <article>
              <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)]">
                <Image
                  src="/images/culture/alma-colleague-maroon-sawtooth-saree-maharashtra.jpeg"
                  alt={
                    isEs
                      ? "Alma y una confeccionista sosteniendo un sari burdeos con cenefa dorada en nuestro estudio en la India"
                      : "Alma and a garment maker holding a burgundy and gold bordered saree in our studio in India"
                  }
                  fill
                  sizes="(max-width: 46rem) 100vw, (max-width: 80rem) 50vw, 33vw"
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
                  ? "En paralelo a nuestra actividad comercial, preparamos en la India un programa formativo en diseño de prendas y costura bajo una futura fundación Section 8. Su meta es enseñar un oficio real que abra una segunda oportunidad mediante trabajo digno y remunerado, lejos de la caridad. Las inscripciones todavía no están abiertas y publicamos avances sinceros conforme madura el proyecto."
                  : "Alongside our commercial work, we are preparing a garment design and stitching training programme in India under a planned Section 8 foundation. Its goal is practical skills and a real second chance through dignified paid work. Applications are not open yet, and we post candid progress updates as the groundwork moves forward."}
              </p>
              <div className="grid gap-1">
                <Link
                  className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/womens-training-initiative")}
                >
                  {isEs
                    ? "Leer sobre la iniciativa en preparación →"
                    : "Read about the planned initiative →"}
                </Link>
                <Link
                  className="inline-flex min-h-[44px] w-fit items-center text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  href={localizeHref(
                    "/stories/preparing-womens-garment-training-maharashtra",
                  )}
                >
                  {isEs
                    ? "Por qué aún no hemos abierto plazas →"
                    : "Why applications have not opened yet →"}
                </Link>
              </div>
            </article>
          </div>
        </section>

        <SectionBridge from="dune" to="paper" />

        {/* 10. Entity & Founder Trust FAQs + Freshness Attribution */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="faq"
        >
          <div className="container grid gap-[var(--space-2xl)] lg:grid-cols-12 lg:items-start lg:gap-[var(--gap-columns)]">
            <div className="grid gap-4 lg:sticky lg:top-32 lg:col-span-4">
              <p className="section-index m-0">
                {isEs ? "Preguntas frecuentes" : "Frequently asked questions"}
              </p>
              <h2 className="m-0 max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                {isEs
                  ? "Respuestas claras antes de trabajar juntos"
                  : "Straight answers before we work together"}
              </h2>
              <p className="m-0 max-w-[38ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-muted)]">
                {isEs
                  ? "Registro mercantil en la India, auditorías externas en centros especialistas, protección legal y acuerdos NDA para tus diseños, comunicación directa, AlmaRise D Brand y estado actual del programa formativo."
                  : "Company registration in India, on-site audits across specialist hubs, legal and NDA protection for your designs, direct communication, AlmaRise D Brand, and where our planned training programme stands today."}
              </p>

              <div className="grid gap-1.5 text-[length:var(--text-sm)]">
                <Link
                  href={localizeHref("/legal-notice")}
                  className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                >
                  {isEs
                    ? "Ver Aviso legal y datos de Karmarise Global LLP →"
                    : "View Legal notice & Karmarise Global LLP details →"}
                </Link>
                <Link
                  href={localizeHref(
                    "/stories/from-spain-to-a-cutting-table-in-india",
                  )}
                  className="inline-flex min-h-[44px] w-fit items-center font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                >
                  {isEs
                    ? "Leer: De una primera llamada en España a producción en la India →"
                    : "Read: How a first call in Spain moves into production in India →"}
                </Link>
                <Link
                  href={localizeHref("/stories")}
                  className="inline-flex min-h-[44px] w-fit items-center font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                >
                  {isEs
                    ? "Leer todas las Historias de Alma y Shirish →"
                    : "Read all Stories by Alma and Shirish →"}
                </Link>
              </div>

              <p className="m-0 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-muted)]">
                {isEs ? (
                  <>
                    Última revisión de Alma y Shirish el{" "}
                    <time dateTime={ABOUT_LAST_REVIEWED.iso}>
                      {ABOUT_LAST_REVIEWED.es}
                    </time>
                    .
                  </>
                ) : (
                  <>
                    Last reviewed by Alma and Shirish on{" "}
                    <time dateTime={ABOUT_LAST_REVIEWED.iso}>
                      {ABOUT_LAST_REVIEWED.en}
                    </time>
                    .
                  </>
                )}
              </p>
            </div>

            <div className="grid gap-4 lg:col-span-8">
              {ABOUT_FAQS.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-2.5 border border-[var(--color-rule)] bg-[var(--color-white)] p-6"
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
        </section>

        <SectionBridge from="paper" to="forest-deep" />

        {/* 11. Closing Invitation + Woodland Portrait Reveal */}
        <section className={styles.invitation}>
          <div className={`${styles.invitationInner} container`}>
            <h2>
              {isEs
                ? "Ven a contarnos qué quieres fabricar."
                : "Come tell us what you want to make."}
            </h2>
            <p className="lead m-0 max-w-[46ch] text-[var(--color-paper-2)]">
              {isEs
                ? "Tráenos ese bolso de piel que quieres mejorar para tu tienda, un primer boceto para una colección de ropa, complementos a medida o una idea de decoración del hogar. Empieza con un briefing de producto de 1 minuto o reserva una videollamada gratuita y tranquila de 15 minutos con Alma."
                : "Bring a bestselling leather bag you want to refine for your shop, a rough sketch for a clothing capsule, custom sewn accessories, or a home decor idea. Start with a 1-minute Product Brief, or book a relaxed, free 15-minute video call with Alma."}
            </p>
            <div className={styles.invitationActions}>
              <Link
                className={styles.primaryAction}
                href={localizeHref("/product-brief")}
              >
                {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
              </Link>
              <Link
                className={styles.secondaryAction}
                href={localizeHref("/book-a-call?duration=15")}
              >
                {isEs
                  ? "Llamada gratis de 15 min con Alma"
                  : "Book a free 15-min call with Alma"}
              </Link>
              <a
                className={styles.secondaryAction}
                href={WHATSAPP_CTA_HREF[language]}
                rel="noopener noreferrer"
                target="_blank"
              >
                {isEs
                  ? "Escribe a Alma por WhatsApp"
                  : "Message Alma on WhatsApp"}
              </a>
            </div>
            <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
              {isEs
                ? "Sin ficha técnica previa. Tus diseños son confidenciales (NDA) y nunca procedemos a la producción hasta que tengas en mano y apruebes tu muestra física."
                : "No tech pack needed. Your designs stay confidential under a mutual NDA, and cutting never starts until you hold and approve a physical sample."}
            </p>
          </div>
        </section>

        <figure className={styles.togetherPortrait}>
          <Image
            src="/images/founders/alma-and-shirish-woodland-portrait.jpeg"
            alt={
              isEs
                ? "Alma y Shirish, cofundadores de KarmaRise D Global, juntos al aire libre"
                : "Alma and Shirish, co-founders of KarmaRise D Global, standing together outdoors"
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
