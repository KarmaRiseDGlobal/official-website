import Image from "next/image";
import Link from "next/link";

import { HeroVideo } from "@/components/motion/hero-video";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import {
  HOW_WE_WORK_DECISIONS,
  HOW_WE_WORK_FAQS,
  HOW_WE_WORK_FOUNDER_ROLES,
  HOW_WE_WORK_HERO_FACTS,
  HOW_WE_WORK_LAST_REVIEWED,
  HOW_WE_WORK_NEXT_STEPS,
  HOW_WE_WORK_RESPONSIBILITY_ROWS,
  HOW_WE_WORK_VISIBILITY_HABITS,
} from "@/data/how-we-work-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const WHATSAPP_CTA_HREF = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma, I would like to ask how KarmaRise D Global coordinates manufacturing between Europe and India.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma, me gustaría consultar cómo coordináis la fabricación entre España y la India en KarmaRise D Global.")}`,
} as const;

export function HowWeWorkPageClient({
  lang = "en",
}: {
  lang?: SiteLanguage;
} = {}) {
  const language = lang;
  const localizeHref = (href: string) => localizePath(href, language);
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        {/* 1. Breadcrumb + Hero + Quick-Facts Strip */}
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
                    {isEs ? "Cómo trabajamos" : "How we work"}
                  </li>
                </ol>
              </nav>
              <span className="text-[var(--color-paper-2)]/80">
                {isEs
                  ? "España, el resto de Europa y la India · Dos fundadores, un equipo"
                  : "Spain, the rest of Europe & India · Two founders, one team"}
              </span>
            </div>

            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-lg)] lg:col-span-7">
                <h1 className="max-w-[18ch] text-[clamp(2.2rem,3.8vw+0.6rem,4.45rem)] leading-[1.01] font-normal text-[var(--color-paper)]">
                  {isEs
                    ? "Crea tu propia colección en la India, con dos fundadores sobre el terreno"
                    : "Make your own collection in India, with two founders on the ground"}
                </h1>
              </div>

              <div className="grid gap-5 lg:col-span-5">
                <p className="lead m-0 text-[var(--color-paper-2)]">
                  {isEs
                    ? "En KarmaRise D Global trabajamos como un mismo equipo a ambos lados de tu producción. Desarrollamos bolsos y otros artículos de piel, prendas de diversos tejidos, complementos confeccionados a medida y decoración del hogar para marcas y comercios de España y el resto de Europa. Planificas cada detalle cara a cara con Alma. Sobre el terreno en la India, Alma y Shirish, abogado colegiado en el Bar Council, auditan fábricas de corte familiar y unidades de producción, preparan muestras físicas de color para tu visto bueno, revisan cada prototipo antes de enviártelo y siguen tu pedido hasta la puerta de tu negocio."
                    : "KarmaRise D Global puts one continuous team on both sides of your production across leather bags and other leather goods, clothing in natural and varied fabrics, custom sewn accessories, and home decor. You plan every piece directly with Alma from Spain or the rest of Europe. On the ground in India, Alma and Bar Council advocate Shirish match audited production units, prepare physical colour swatches for your approval, review every sample first, and follow your order through export delivery to your business door."}
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
                      ? "Charla 15 minutos con Alma (gratis)"
                      : "Chat with Alma for 15 minutes (free)"}
                  </Link>
                </div>

                <p className="m-0 text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-paper-2)]/85">
                  {isEs
                    ? "Empieza con un boceto a mano o una foto de tu tienda. Tus diseños son confidenciales, con acuerdo NDA disponible. Alma suele responder en un día laborable y solo nosotros dos leemos tus notas."
                    : "Start with a rough sketch or a photo from your shop. Your designs stay confidential, with mutual NDA available. Alma usually replies within one working day, and only Alma and Shirish read your notes."}
                </p>
              </div>
            </div>

            <HeroVideo
              eager
              className="m-0 overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-night)]"
              videoClassName="block aspect-video w-full object-cover"
              poster="/videos/posters/spain-india-workshop-banner.jpg"
              label={
                isEs
                  ? "Trabajo conjunto entre España, el resto de Europa y unidades de producción auditadas en la India"
                  : "Working across Spain, the rest of Europe, and vetted Indian production units"
              }
              src="/videos/hero/spain-india-workshop-banner.mp4"
            />

            <dl className="m-0 grid border-t border-l border-[var(--color-paper)]/18 md:grid-cols-3">
              {HOW_WE_WORK_HERO_FACTS.map((fact) => (
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

        {/* 2. Who stands behind your collection */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="founders-roles"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)] lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="grid gap-3 lg:col-span-7">
                <p className="section-index">
                  {isEs ? "Con quién trabajas" : "Who you work with"}
                </p>
                <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Dos fundadores con cara y ojos a ambos lados de tu pedido"
                    : "Two founders with faces and eyes, on both sides of your order"}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:col-span-5 lg:justify-end">
                <Link
                  className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/about")}
                >
                  {isEs
                    ? "Conoce la historia de Alma y Shirish →"
                    : "Read Alma and Shirish's story →"}
                </Link>
                <Link
                  className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  href={localizeHref("/manufacturing")}
                >
                  {isEs
                    ? "Mira qué fabricamos en toda la India →"
                    : "See what we manufacture across India →"}
                </Link>
              </div>
            </div>

            <div className="grid gap-[var(--gap-columns)] sm:grid-cols-2">
              {HOW_WE_WORK_FOUNDER_ROLES.map((founder) => (
                <article
                  key={founder.id}
                  className="grid content-start gap-5 border border-[var(--color-rule)] bg-[var(--color-white)]/65 p-6 lg:p-7"
                >
                  <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-2)]">
                    <Image
                      src={founder.image}
                      alt={founder.imageAlt[language]}
                      fill
                      className="object-cover"
                      sizes="(max-width: 40rem) 100vw, 48vw"
                    />
                  </figure>
                  <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] font-normal">
                    {founder.nameAndRegion[language]}
                  </h3>
                  <p className="m-0 text-[length:var(--text-sm)] leading-[1.68] text-[var(--color-ink-2)]">
                    {founder.roleSummary[language]}
                  </p>
                  <dl className="m-0 grid gap-2.5 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-xs)] leading-[1.55]">
                    <div>
                      <dt className="font-semibold text-[var(--color-forest-deep)]">
                        {founder.standingLabel[language]}
                      </dt>
                      <dd className="m-0 mt-0.5 text-[var(--color-muted)]">
                        {founder.standingValue[language]}
                      </dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-[var(--color-forest-deep)]">
                        {founder.focusLabel[language]}
                      </dt>
                      <dd className="m-0 mt-0.5 text-[var(--color-muted)]">
                        {founder.focusValue[language]}
                      </dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="forest-deep" />

        {/* 3. Four moments that decide an overseas order + Mid-Page CRO Bridge #1 */}
        <section
          className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]"
          id="decisions-in-practice"
        >
          <div className="container grid gap-[var(--space-3xl)]">
            <div className="grid gap-[var(--space-md)] lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="grid gap-3 lg:col-span-7">
                <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.12em] text-[var(--color-gold)] uppercase">
                  {isEs ? "Cómo avanzan las decisiones" : "How decisions move"}
                </p>
                <h2 className="m-0 max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.03] font-normal text-[var(--color-paper)]">
                  {isEs
                    ? "Cuatro momentos que deciden un pedido internacional y cómo los resolvemos"
                    : "Four moments that decide an overseas order, and how we handle them"}
                </h2>
              </div>
              <p className="m-0 max-w-[46ch] text-[length:var(--text-md)] leading-[1.65] text-[var(--color-paper-2)] lg:col-span-5">
                {isEs
                  ? "Un tono sale un punto cálido. A la caída del asa le faltan dos centímetros. Se acerca la fecha de montar tu escaparate. Así actuamos en cada situación real."
                  : "A dye shade shifts warm, a bag's strap drop sits two centimetres short, or a seasonal shop-window date closes in. Here is how we resolve each moment in practice."}
              </p>
            </div>

            <div className="grid gap-[var(--space-3xl)]">
              {HOW_WE_WORK_DECISIONS.map((item, index) => (
                <article
                  key={item.id}
                  className="grid items-center gap-[var(--gap-columns)] border-t border-[var(--color-paper)]/15 pt-[var(--space-2xl)] lg:grid-cols-12"
                >
                  <div
                    className={`grid gap-4 lg:col-span-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <span className="num text-[length:var(--text-xs)] font-semibold tracking-[0.1em] text-[var(--color-gold)] uppercase">
                      {item.number}
                    </span>
                    <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.15] font-normal text-[var(--color-paper)]">
                      {item.title[language]}
                    </h3>
                    <p className="m-0 max-w-[52ch] text-[length:var(--text-md)] leading-[1.7] text-[var(--color-paper-2)]">
                      {item.practice[language]}
                    </p>
                    <p className="m-0 max-w-[52ch] border-l-2 border-[var(--color-gold)]/70 pl-4 text-[length:var(--text-sm)] leading-[1.62] text-[var(--color-paper-2)]/85">
                      <strong className="font-semibold text-[var(--color-gold)]">
                        {item.proofLabel[language]}:{" "}
                      </strong>
                      {item.proofNote[language]}
                    </p>
                    {item.storyHref && item.storyLabel ? (
                      <Link
                        className="inline-flex min-h-[44px] w-fit items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-gold)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
                        href={localizeHref(item.storyHref)}
                      >
                        {item.storyLabel[language]} →
                      </Link>
                    ) : null}
                  </div>

                  <div
                    className={`lg:col-span-6 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                  >
                    <figure className="relative mx-auto my-0 aspect-[4/5] w-full max-w-[32rem] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-night)] lg:max-w-none">
                      <Image
                        src={item.image}
                        alt={item.imageAlt[language]}
                        fill
                        className="object-cover"
                        sizes="(max-width: 64rem) 100vw, 48vw"
                      />
                    </figure>
                  </div>
                </article>
              ))}
            </div>

            {/* Mid-Page CRO Bridge #1 */}
            <div className="grid items-center gap-6 border border-[var(--color-paper)]/20 bg-[var(--color-night)]/35 p-6 lg:grid-cols-12 lg:p-8">
              <div className="grid gap-2 lg:col-span-7">
                <p className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.2] text-[var(--color-paper)]">
                  {isEs
                    ? "¿Quieres una respuesta clara sobre cómo producir tu colección en la India?"
                    : "Want a straight answer on whether your collection can be made in India?"}
                </p>
                <p className="m-0 text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-paper-2)]/80">
                  {isEs
                    ? "Alma suele responder en un día laborable. Trae un boceto rápido, una foto o una pieza de tu tienda. Tus diseños son confidenciales, con acuerdo NDA disponible."
                    : "Alma usually replies within one working day. Bring a rough sketch, a photo, or a piece from your shop. Your designs stay confidential, with mutual NDA available."}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4 lg:col-span-5 lg:justify-end">
                <Link
                  className="primary-button"
                  href={localizeHref("/book-a-call?duration=15")}
                >
                  {isEs
                    ? "Charla 15 minutos con Alma (gratis)"
                    : "Chat with Alma for 15 minutes (free)"}
                </Link>
                <Link
                  className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-gold)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
                  href={localizeHref("/product-brief")}
                >
                  {isEs
                    ? "O completa tu briefing →"
                    : "Or share a 1-minute Product Brief →"}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="forest-deep" to="paper" />

        {/* 4. Structured Spain-India Responsibility Matrix */}
        <section
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="responsibility-matrix"
        >
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-4 lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="grid gap-3 lg:col-span-7">
                <p className="section-index">
                  {isEs
                    ? "Reparto claro de trabajo"
                    : "Clear division of labour"}
                </p>
                <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Tú llevas tu negocio y tu marca. Nosotros seguimos tu pedido sobre el terreno en la India."
                    : "You run your shop and your brand. We run production on the ground in India."}
                </h2>
              </div>
              <p className="m-0 max-w-[46ch] text-[var(--color-muted)] lg:col-span-5">
                {isEs
                  ? "Cada fase tiene un responsable con nombre y apellidos. Así nada se pierde entre tu comercio en España o el resto de Europa y el punto de producción en la India."
                  : "Every stage has one named owner so nothing gets lost between your business in Spain or the rest of Europe and the production site in India."}
              </p>
            </div>

            <div className="overflow-x-auto border border-[var(--color-rule)] bg-[var(--color-white)]">
              <table className="w-full min-w-[780px] border-collapse text-left text-[length:var(--text-sm)]">
                <caption className="sr-only">
                  {isEs
                    ? "Reparto de responsabilidades por fase entre tú en España o el resto de Europa, Alma, Shirish y la unidad de producción en la India"
                    : "Stage-by-stage responsibilities across you in Spain or the rest of Europe, Alma, Shirish, and the Indian production unit"}
                </caption>
                <thead>
                  <tr className="border-b border-[var(--color-rule)] bg-[var(--color-dune)]/55 text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-forest-deep)] uppercase">
                    <th scope="col" className="w-[18%] px-4 py-4">
                      {isEs ? "Fase" : "Stage"}
                    </th>
                    <th scope="col" className="w-[20%] px-4 py-4">
                      {isEs
                        ? "Tú (España y resto de Europa)"
                        : "You (Spain & rest of Europe)"}
                    </th>
                    <th
                      scope="col"
                      className="w-[22%] bg-[var(--color-forest-deep)] px-4 py-4 text-[var(--color-paper)]"
                    >
                      {isEs
                        ? "Alma (España y la India)"
                        : "Alma (Spain & India)"}
                    </th>
                    <th
                      scope="col"
                      className="w-[22%] bg-[var(--color-forest-deep)]/90 px-4 py-4 text-[var(--color-paper)]"
                    >
                      {isEs
                        ? "Shirish (En toda la India)"
                        : "Shirish (Across India)"}
                    </th>
                    <th scope="col" className="w-[18%] px-4 py-4">
                      {isEs
                        ? "Unidad de producción (India)"
                        : "Production unit (India)"}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-rule)]">
                  {HOW_WE_WORK_RESPONSIBILITY_ROWS.map((row) => (
                    <tr key={row.id}>
                      <th
                        scope="row"
                        className="px-4 py-4 align-top font-semibold text-[var(--color-forest-deep)]"
                      >
                        {row.stage[language]}
                      </th>
                      <td className="px-4 py-4 align-top leading-[1.58] text-[var(--color-ink-2)]">
                        {row.client[language]}
                      </td>
                      <td className="bg-[var(--color-pale-sage)]/30 px-4 py-4 align-top leading-[1.58] font-medium text-[var(--color-forest-deep)]">
                        {row.alma[language]}
                      </td>
                      <td className="bg-[var(--color-pale-sage)]/20 px-4 py-4 align-top leading-[1.58] font-medium text-[var(--color-forest-deep)]">
                        {row.shirish[language]}
                      </td>
                      <td className="px-4 py-4 align-top leading-[1.58] text-[var(--color-muted)]">
                        {row.workshop[language]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[var(--color-rule)] pt-6 text-[length:var(--text-sm)]">
              <Link
                className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/manufacturing#quality-and-compliance")}
              >
                {isEs
                  ? "Ver qué dejamos por escrito antes de producir →"
                  : "See what we put in writing before cutting starts →"}
              </Link>
              <Link
                className="inline-flex min-h-[44px] items-center font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                href={localizeHref("/manufacturing#why-managed")}
              >
                {isEs
                  ? "Comparar nuestro modelo con intermediarios y directorios B2B →"
                  : "Compare working with us against brokers and B2B directories →"}
              </Link>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="pale-sage" />

        {/* 5. What you can see from Europe + Mid-Page CRO Bridge #2 */}
        <section
          className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="client-visibility"
        >
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-6">
              <div className="grid gap-3">
                <p className="section-index">
                  {isEs
                    ? "De cerca, sin coger un avión"
                    : "Close to your production, without flying out"}
                </p>
                <h2 className="m-0 max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                  {isEs
                    ? "Seguimos tu pedido del primer material a la puerta de tu negocio"
                    : "We follow your order from raw material to the boxes at your door"}
                </h2>
              </div>

              <ol className="m-0 grid list-none gap-5 p-0">
                {HOW_WE_WORK_VISIBILITY_HABITS.map((habit) => (
                  <li
                    key={habit.id}
                    className="grid gap-1.5 border-t border-[var(--color-forest)]/25 pt-4"
                  >
                    <span className="num text-[length:var(--text-xs)] font-semibold tracking-[0.08em] text-[var(--color-clay-ink)] uppercase">
                      {habit.number}
                    </span>
                    <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-title)] font-normal">
                      {habit.title[language]}
                    </h3>
                    <p className="m-0 text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
                      {habit.body[language]}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="grid gap-6 lg:col-span-6">
              <HeroVideo
                className="m-0 overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper)]"
                videoClassName="block aspect-video w-full object-cover"
                poster="/videos/posters/women-artisans-studio-india.jpg"
                label={
                  isEs
                    ? "Artesanas confeccionando prendas en un espacio de producción en la India"
                    : "Women artisans working on garment construction at a partner production unit in India"
                }
                src="/videos/hero/women-artisans-studio-india.mp4"
              />

              <blockquote className="m-0 grid gap-3 border-l-2 border-[var(--color-clay)] bg-[var(--color-paper)]/75 p-6">
                <p className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.3] text-[var(--color-forest-deep)]">
                  {isEs
                    ? "«No puedo asegurarte que nunca surja un imprevisto, porque eso no está en mi mano. Puedo asegurarte que todo se revisará dos, tres, cinco veces»."
                    : '"I cannot assure you that nothing will ever go off plan, because that is not in my hand. I can assure you everything will be checked two, three, five times."'}
                </p>
                <cite className="text-[length:var(--text-xs)] font-semibold tracking-[0.06em] text-[var(--color-clay-ink)] uppercase not-italic">
                  {isEs
                    ? "Alma · Cofundadora de KarmaRise D Global"
                    : "Alma · Co-founder, KarmaRise D Global"}
                </cite>
              </blockquote>

              {/* Mid-Page CRO Bridge #2 */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-forest)]/25 pt-4 text-[length:var(--text-sm)]">
                <span className="text-[var(--color-ink-2)]">
                  {isEs
                    ? "¿Prefieres mandar un mensaje rápido antes de reservar llamada?"
                    : "Prefer a quick message before booking a call?"}
                </span>
                <a
                  className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href={WHATSAPP_CTA_HREF[language]}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {isEs
                    ? "Escribe a Alma por WhatsApp →"
                    : "Message Alma on WhatsApp →"}
                </a>
              </div>
            </div>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="dune" />

        {/* 6. Questions buyers ask before starting + Freshness Attribution */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="faq"
        >
          <div className="container grid gap-[var(--space-2xl)] lg:grid-cols-12 lg:items-start lg:gap-[var(--gap-columns)]">
            <div className="grid gap-4 lg:sticky lg:top-32 lg:col-span-4">
              <p className="section-index">
                {isEs ? "Preguntas frecuentes" : "Frequently asked questions"}
              </p>
              <h2 className="m-0 max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal">
                {isEs
                  ? "Respuestas claras sobre dar el salto a la India desde España y el resto de Europa"
                  : "Straight answers about producing in India from Spain and the rest of Europe"}
              </h2>
              <p className="m-0 max-w-[38ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-muted)]">
                {isEs
                  ? "Horarios, idiomas de atención, ajustes de muestras, pruebas físicas de color, acuerdos NDA y seguimiento en directo sin subirte a un avión."
                  : "Time zones, call languages, sample revisions, physical colour swatches, NDA protection, and live updates without boarding a flight."}
              </p>

              <div className="grid gap-1.5 text-[length:var(--text-sm)]">
                <Link
                  href={localizeHref("/terms")}
                  className="inline-flex min-h-[44px] w-fit items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                >
                  {isEs
                    ? "Confidencialidad y propiedad intelectual →"
                    : "Read our confidentiality and IP terms →"}
                </Link>
                <Link
                  href={localizeHref("/contact")}
                  className="inline-flex min-h-[44px] w-fit items-center font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                >
                  {isEs
                    ? "Escribe directamente a Alma y Shirish →"
                    : "Write directly to Alma and Shirish →"}
                </Link>
              </div>

              <p className="m-0 border-t border-[var(--color-rule-2)]/50 pt-4 text-[length:var(--text-xs)] leading-[1.6] text-[var(--color-muted)]">
                {isEs ? (
                  <>
                    Última revisión de Alma y Shirish el{" "}
                    <time dateTime={HOW_WE_WORK_LAST_REVIEWED.iso}>
                      {HOW_WE_WORK_LAST_REVIEWED.es}
                    </time>
                    .
                  </>
                ) : (
                  <>
                    Last reviewed by Alma and Shirish on{" "}
                    <time dateTime={HOW_WE_WORK_LAST_REVIEWED.iso}>
                      {HOW_WE_WORK_LAST_REVIEWED.en}
                    </time>
                    .
                  </>
                )}
              </p>
            </div>

            <div className="grid gap-4 lg:col-span-8">
              {HOW_WE_WORK_FAQS.map((item) => (
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
        </section>

        <SectionBridge from="dune" to="wood" />

        {/* 7. Closing Conversion Band */}
        <section className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <p className="m-0 text-[length:var(--text-xs)] font-semibold tracking-[0.12em] text-[var(--color-gold)] uppercase">
                {isEs ? "Empieza sin complicaciones" : "Start gently"}
              </p>
              <h2 className="m-0 max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-normal text-[var(--color-paper)]">
                {isEs
                  ? "Cuéntanos qué tienes en mente. Te diremos con claridad qué hace falta en la India."
                  : "Tell us what you have in mind. We will tell you honestly what it takes in India."}
              </h2>
              <ol className="m-0 grid list-decimal gap-2.5 pl-5 text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-paper-2)]">
                {HOW_WE_WORK_NEXT_STEPS.map((step, index) => (
                  <li key={index}>{step[language]}</li>
                ))}
              </ol>
            </div>
            <div className="flex flex-col items-start gap-4 lg:col-span-5 lg:items-end">
              <div className="flex flex-wrap items-center gap-3.5 lg:justify-end">
                <Link
                  className="primary-button"
                  href={localizeHref("/product-brief")}
                >
                  {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
                </Link>
                <Link
                  className="inline-flex min-h-[var(--control-height)] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-paper)]/55 px-5 py-2.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] no-underline transition-colors hover:border-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-night)]"
                  href={localizeHref("/book-a-call?duration=15")}
                >
                  {isEs
                    ? "Charla 15 minutos con Alma (gratis)"
                    : "Chat with Alma for 15 minutes (free)"}
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:justify-end">
                <a
                  className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-gold)]"
                  href={WHATSAPP_CTA_HREF[language]}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {isEs
                    ? "¿Solo tienes una duda rápida? Escribe a Alma por WhatsApp"
                    : "Just have a quick question? Message Alma on WhatsApp"}
                </a>
                <Link
                  className="inline-flex min-h-[44px] items-center text-[length:var(--text-sm)] font-medium text-[var(--color-paper-2)] underline decoration-[var(--color-paper)]/35 underline-offset-4 hover:text-[var(--color-paper)]"
                  href={localizeHref("/manufacturing#quality-and-compliance")}
                >
                  {isEs
                    ? "Ver qué acordamos por escrito antes de producir"
                    : "See what we agree in writing before production"}
                </Link>
              </div>
              <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80 lg:text-right">
                {isEs
                  ? "Sin ficha técnica previa. Tus diseños son confidenciales, con acuerdo NDA disponible, y siguen siendo 100 % tuyos, sin compromiso."
                  : "No tech pack required. Your designs stay 100% confidential, with mutual NDA available, and zero obligation."}
              </p>
            </div>
          </div>
        </section>

        <SectionBridge from="wood" to="night" />
      </main>

      <SiteFooter />
    </>
  );
}
