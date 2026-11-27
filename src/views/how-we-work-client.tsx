import Image from "next/image";
import Link from "next/link";

import { ClosingConversationSection } from "@/components/home/closing-conversation-section";
import { HomeFaqAccordion } from "@/components/home/home-faq-accordion";
import { HowWeWorkScrollChoreography } from "@/components/how-we-work/how-we-work-scroll-choreography";
import { ResponsibilityStages } from "@/components/how-we-work/responsibility-stages";
import { HeroVideo } from "@/components/motion/hero-video";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import {
  HOW_WE_WORK_CLOSING_CONVERSATION,
  HOW_WE_WORK_DECISIONS,
  HOW_WE_WORK_FAQS,
  HOW_WE_WORK_FOUNDER_ROLES,
  HOW_WE_WORK_HERO_FACTS,
  HOW_WE_WORK_RESPONSIBILITY_ROWS,
  HOW_WE_WORK_VISIBILITY_HABITS,
} from "@/data/how-we-work-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const WHATSAPP_CTA_HREF = {
  en: `https://wa.me/34611722276?text=${encodeURIComponent("Hello Alma, I would like to ask how KarmaRise D Global coordinates manufacturing between Spain and India.")}`,
  es: `https://wa.me/34611722276?text=${encodeURIComponent("Hola Alma, me gustaría consultar cómo coordináis la fabricación entre España y la India en KarmaRise D Global.")}`,
} as const;

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
      <HowWeWorkScrollChoreography />
      <main id="main">
        {/* 1. Full-Bleed Looping Video Hero Banner */}
        <section
          className="hero how-we-work-hero"
          data-chat-avoid
          data-surface="dark"
          id="top"
        >
          <div className="hero-wrapper" data-hero-wrapper>
            <HeroVideo
              eager
              stickyCurtain
              src="/videos/hero/how-we-work-working-banner.mp4"
              poster="/videos/posters/how-we-work-working-banner.jpg"
              label={
                isEs
                  ? "Alma y Shirish coordinando detalles de producción juntos desde la mesa de trabajo"
                  : "Alma and Shirish reviewing product details side by side during a working session"
              }
            />
            <div className="hero-scrim" aria-hidden="true" />
            <div className="hero-content container" data-hero-content>
              <h1 data-hero-title>
                <span className="hero-headline-line" data-hero-line>
                  {isEs
                    ? "Dos fundadores, un equipo"
                    : "Two founders, one team"}
                </span>{" "}
                <span className="hero-headline-line" data-hero-line>
                  {isEs ? "del briefing a tu puerta." : "from brief to door."}
                </span>
              </h1>
              <div className="hero-sub" data-hero-sub>
                <p className="hero-lead">
                  {isEs
                    ? "Planifica cada pieza con Alma mientras supervisamos materiales, muestras físicas, contratos y entrega en la India."
                    : "Plan every piece with Alma while we oversee materials, physical samples, contracts, and delivery in India."}
                </p>
                <div className="hero-actions">
                  <Link
                    className="hero-primary"
                    href={localizeHref("/product-brief")}
                  >
                    {isEs ? "Cuéntanos tu idea" : "Share your product idea"}
                  </Link>
                  <Link
                    className="hero-secondary-cta press-scale inline-flex min-h-[var(--control-height)] items-center justify-center rounded-[var(--radius-pill)] border border-[var(--color-paper)]/55 bg-[var(--color-night)]/40 px-6 py-3 text-center text-[length:var(--text-md)] font-semibold text-[var(--color-paper)] no-underline backdrop-blur-sm transition-colors hover:border-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-night)]"
                    href={localizeHref("/book-a-call?duration=15")}
                  >
                    {isEs
                      ? "Reserva una llamada gratis con Alma"
                      : "Book a free call with Alma"}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Breadcrumb + Warm Parchment Opening Band */}
        <section
          className="bg-[var(--color-paper)] pt-[var(--space-md)] pb-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="founders-roles"
        >
          <div className="container grid gap-[var(--space-xl)] md:gap-[var(--space-2xl)]">
            <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] uppercase">
              <nav
                aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
                className="flex items-center"
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
                  <li aria-hidden="true" className="text-[var(--color-muted)]">
                    /
                  </li>
                  <li
                    aria-current="page"
                    className="inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-clay-ink)]"
                  >
                    {isEs ? "Cómo trabajamos" : "How we work"}
                  </li>
                </ol>
              </nav>
            </div>

            <div className="grid gap-[var(--space-md)] lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="lg:col-span-7">
                <h2
                  data-choreo="how-we-work-section-header"
                  className="m-0 max-w-[20ch] text-[length:var(--text-section)] leading-[1.06] font-normal tracking-[var(--tracking-display)] text-[var(--color-forest-deep)]"
                >
                  {isEs
                    ? "Siempre sabes quién hay detrás de tu pedido"
                    : "You always know who is behind your order"}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 lg:col-span-5 lg:justify-end">
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/about")}
                >
                  <span>
                    {isEs
                      ? "Conoce la historia de Alma y Shirish"
                      : "Read Alma and Shirish's story"}
                  </span>
                  <ArrowIcon />
                </Link>
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                  href={localizeHref("/manufacturing")}
                >
                  <span>
                    {isEs
                      ? "Mira qué fabricamos en toda la India"
                      : "See what we manufacture across India"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="grid gap-x-[var(--gap-columns)] gap-y-[var(--space-2xl)] sm:grid-cols-2">
              {HOW_WE_WORK_FOUNDER_ROLES.map((founder) => (
                <article key={founder.id} className="grid content-start gap-5">
                  <figure className="editorial-photo-frame m-0 aspect-[4/3]">
                    <Image
                      src={founder.image}
                      alt={founder.imageAlt[language]}
                      fill
                      className="object-cover"
                      style={{ objectPosition: founder.imagePosition }}
                      sizes="(max-width: 40rem) 100vw, 48vw"
                    />
                  </figure>
                  <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-2xl)] leading-[1.15] font-normal text-[var(--color-forest-deep)]">
                    {founder.nameAndRegion[language]}
                  </h3>
                  <p className="m-0 max-w-[52ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
                    {founder.roleSummary[language]}
                  </p>
                </article>
              ))}
            </div>

            {/* Borderless Key Operating Standards */}
            <dl className="m-0 grid gap-[var(--gap-columns)] lg:grid-cols-3">
              {HOW_WE_WORK_HERO_FACTS.map((fact) => (
                <div key={fact.id} className="grid content-start gap-2">
                  <dt className="num font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.2] font-normal text-[var(--color-forest-deep)]">
                    {fact.label[language]}
                  </dt>
                  <dd className="m-0 max-w-[44ch] text-[length:var(--text-sm)] leading-[1.62] text-[var(--color-ink-2)]">
                    {fact.detail[language]}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <SectionBridge from="paper" to="forest-deep" size="gentle" />

        {/* 3. Four Moments That Decide an Overseas Order */}
        <section
          className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]"
          data-surface="dark"
          id="decisions-in-practice"
        >
          <div className="container grid gap-[var(--space-xl)] md:gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)] lg:grid-cols-12 lg:items-end lg:gap-[var(--gap-columns)]">
              <div className="lg:col-span-7">
                <h2
                  data-choreo="how-we-work-section-header"
                  className="m-0 max-w-[18ch] text-[length:var(--text-section)] leading-[1.06] font-normal tracking-[var(--tracking-display)] text-[var(--color-paper)]"
                >
                  {isEs
                    ? "Cuatro momentos que deciden un pedido internacional y cómo los resolvemos"
                    : "Four moments that decide an overseas order, and how we handle them"}
                </h2>
              </div>
              <p className="m-0 max-w-[44ch] text-[length:var(--text-md)] leading-[1.65] text-[var(--color-paper-2)] lg:col-span-5">
                {isEs
                  ? "Un tono sale un punto cálido. A la caída del asa le faltan dos centímetros. Se acerca la fecha de montar tu escaparate. Así actuamos en cada situación real."
                  : "A dye shade shifts warm, a bag's strap drop sits two centimetres short, or a seasonal shop-window date closes in. Here is how we resolve each moment in practice."}
              </p>
            </div>

            <div className="grid gap-x-[var(--gap-columns)] gap-y-[var(--space-2xl)] md:grid-cols-2">
              {HOW_WE_WORK_DECISIONS.map((item) => (
                <article key={item.id} className="grid content-start gap-4">
                  <figure className="editorial-photo-frame editorial-photo-frame--dark m-0 aspect-[4/3] w-full">
                    <Image
                      src={item.image}
                      alt={item.imageAlt[language]}
                      fill
                      className="object-cover"
                      style={{ objectPosition: item.imagePosition }}
                      sizes="(max-width: 48rem) 100vw, 48vw"
                    />
                  </figure>
                  <div className="grid gap-2.5">
                    <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.18] font-normal text-[var(--color-paper)]">
                      {item.title[language]}
                    </h3>
                    <p className="m-0 max-w-[50ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-paper-2)]">
                      {item.practice[language]}
                    </p>
                    <p className="m-0 max-w-[50ch] text-[length:var(--text-sm)] leading-[1.6] text-[var(--color-paper-2)]/85">
                      <strong className="font-semibold text-[var(--color-gold)]">
                        {item.proofLabel[language]}:{" "}
                      </strong>
                      {item.proofNote[language]}
                    </p>
                    {item.storyHref && item.storyLabel ? (
                      <Link
                        className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-gold)] underline decoration-[var(--color-clay-light)] underline-offset-4 transition-colors hover:text-[var(--color-paper)]"
                        href={localizeHref(item.storyHref)}
                      >
                        <span>{item.storyLabel[language]}</span>
                        <ArrowIcon />
                      </Link>
                    ) : null}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge from="forest-deep" to="paper" size="gentle" />

        {/* 4. Scroll-Through Stage-by-Stage Spain-India Responsibility Reader */}
        <ResponsibilityStages
          language={language}
          rows={HOW_WE_WORK_RESPONSIBILITY_ROWS}
        />

        <SectionBridge from="paper" to="pale-sage" />

        {/* 5. What You Can See From Europe + Direct WhatsApp Bridge */}
        <section
          className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="client-visibility"
        >
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-6">
              <h2
                data-choreo="how-we-work-section-header"
                className="m-0 max-w-[18ch] text-[length:var(--text-section)] leading-[1.06] font-normal tracking-[var(--tracking-display)] text-[var(--color-forest-deep)]"
              >
                {isEs
                  ? "Seguimos tu pedido del primer material a la puerta de tu negocio"
                  : "We follow your order from raw material to the boxes at your door"}
              </h2>

              <ul className="m-0 grid list-none gap-6 p-0">
                {HOW_WE_WORK_VISIBILITY_HABITS.map((habit) => (
                  <li key={habit.id} className="grid gap-1.5">
                    <h3 className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                      {habit.title[language]}
                    </h3>
                    <p className="m-0 max-w-[48ch] text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-ink-2)]">
                      {habit.body[language]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="grid gap-6 lg:col-span-6">
              <HeroVideo
                className="editorial-photo-frame m-0 overflow-hidden bg-[var(--color-paper)]"
                videoClassName="block aspect-video w-full object-cover"
                poster="/videos/posters/women-artisans-studio-india.jpg"
                label={
                  isEs
                    ? "Artesanas confeccionando prendas en un espacio de producción en la India"
                    : "Women artisans working on garment construction at a partner production unit in India"
                }
                src="/videos/hero/women-artisans-studio-india.mp4"
              />

              <blockquote className="m-0 grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-forest)]/15 bg-[var(--color-white)] p-6 lg:p-7">
                <p className="m-0 font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.3] font-normal text-[var(--color-forest-deep)]">
                  {isEs
                    ? "«Tú céntrate en tu tienda y en tus clientes. Déjanos a nosotros el recorrido, las revisiones y el seguimiento sobre el terreno en la India»."
                    : '"You focus on your shop and your customers. Leave the legwork, checks, and follow-through in India to us."'}
                </p>
                <cite className="text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] text-[var(--color-clay-ink)] uppercase not-italic">
                  {isEs
                    ? "Shirish · Cofundador de KarmaRise D Global"
                    : "Shirish · Co-founder, KarmaRise D Global"}
                </cite>
              </blockquote>
            </div>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="dune" />

        {/* 6. Questions Buyers Ask Before Starting (Shared Interactive Accordion) */}
        <section
          className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
          id="faq"
          data-chat-avoid
        >
          <div className="container grid gap-[var(--space-2xl)] lg:grid-cols-12 lg:items-start lg:gap-[var(--gap-columns)]">
            <div className="grid content-start gap-4 lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:col-span-4">
              <h2
                data-choreo="how-we-work-section-header"
                className="m-0 max-w-[18ch] text-[length:var(--text-section)] leading-[1.06] font-normal tracking-[var(--tracking-display)] text-[var(--color-forest-deep)]"
              >
                {isEs
                  ? "Respuestas claras sobre dar el salto a la India desde España y el resto de Europa"
                  : "Straight answers about producing in India from Spain and the rest of Europe"}
              </h2>
              <p className="m-0 max-w-[38ch] text-[length:var(--text-sm)] leading-[1.65] text-[var(--color-muted)]">
                {isEs
                  ? "Horarios, idiomas, cambios durante el muestreo y seguimiento en directo sin viajar."
                  : "Time zones, call languages, sample adjustments, and live updates without flying."}
              </p>

              <div className="grid gap-1 text-[length:var(--text-sm)]">
                <Link
                  href={localizeHref("/terms")}
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                >
                  <span>
                    {isEs
                      ? "Confidencialidad y propiedad intelectual"
                      : "Read our confidentiality and IP terms"}
                  </span>
                  <ArrowIcon />
                </Link>
                <Link
                  href={localizeHref("/contact")}
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                >
                  <span>
                    {isEs
                      ? "Escribe directamente a Alma y Shirish"
                      : "Write directly to Alma and Shirish"}
                  </span>
                  <ArrowIcon />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8">
              <HomeFaqAccordion
                idPrefix="how-we-work-faq"
                items={HOW_WE_WORK_FAQS}
                language={language}
              />
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="pale-sage" />

        {/* 7. Progressive Botanical Closing Arches (Shared Signature Conversion Band) */}
        <ClosingConversationSection
          copy={HOW_WE_WORK_CLOSING_CONVERSATION}
          language={language}
          whatsappHref={WHATSAPP_CTA_HREF}
        />
      </main>

      <SiteFooter />
    </>
  );
}
