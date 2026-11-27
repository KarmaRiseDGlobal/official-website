import Image from "next/image";
import Link from "next/link";

import { ClosingConversationSection } from "@/components/home/closing-conversation-section";
import { FoundersStorySection } from "@/components/home/founders-story-section";
import { HomeFaqAccordion } from "@/components/home/home-faq-accordion";
import { HomeScrollChoreography } from "@/components/home/home-scroll-choreography";
import { HeroVideo } from "@/components/motion/hero-video";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { HorizontalShowcase } from "@/components/showcases/horizontal-showcase";
import { HOME_CAPABILITIES, HOME_FAQS } from "@/data/home-content";
import { localizePath, type SiteLanguage } from "@/lib/urls";

const HOME_CAPABILITY_PAIRS = [
  [HOME_CAPABILITIES[0]!, HOME_CAPABILITIES[1]!],
  [HOME_CAPABILITIES[2]!, HOME_CAPABILITIES[3]!],
] as const;

export function HomeClient({ lang = "en" }: { lang?: SiteLanguage } = {}) {
  const language = lang;
  const localizeHref = (href: string) => localizePath(href, language);
  const isEs = language === "es";

  return (
    <>
      <HomeScrollChoreography />
      <main id="main">
        <section className="hero" data-surface="dark" id="top">
          <div className="hero-wrapper" data-hero-wrapper>
            <HeroVideo
              eager
              stickyCurtain
              label={
                isEs
                  ? "Imágenes de producción de un Programa de producción de KarmaRise D Global"
                  : "Production footage from a KarmaRise D Global Manufacturing Programme"
              }
            />
            <div className="hero-scrim" aria-hidden="true" />
            <div className="hero-content container" data-hero-content>
              <h1 data-hero-title>
                <span className="hero-headline-line" data-hero-line>
                  {isEs ? "Da vida a tu colección" : "Bring your collection"}
                </span>{" "}
                <span className="hero-headline-line" data-hero-line>
                  {isEs ? "en la India." : "to life in India."}
                </span>
              </h1>
              <div className="hero-sub" data-hero-sub>
                <p className="hero-lead">
                  {isEs
                    ? "Tu propia línea de bolsos y artículos de piel, ropa, complementos textiles y decoración del hogar, hecha en la India y supervisada en persona desde el primer boceto hasta tu puerta."
                    : "Your own line of leather goods, clothing, textile accessories, and home decor, made in India and overseen in person from first sketch to shop door."}
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

        <section className="ownership" id="work">
          <div className="container">
            <div className="ownership-grid">
              <div className="ownership-content">
                <div className="ownership-header" data-choreo="work-header">
                  <h2>
                    {isEs
                      ? "Convierte lo que enamora en tu tienda en una colección que solo tienes tú."
                      : "Turn what people love in your shop into a line that belongs only to you."}
                  </h2>
                </div>

                <div className="ownership-copy" data-choreo="work-copy">
                  <p className="ownership-lead">
                    {isEs
                      ? "Cada mañana escuchas lo que piden de verdad tus clientes: una piel más suave, un corte fresco de verano o un asa que caiga bien sobre un abrigo."
                      : "Every morning you hear what your customers actually ask for: a softer hide, a lighter summer cut, a strap that sits right over a coat."}
                  </p>
                  <p className="ownership-support">
                    {isEs
                      ? "En lugar de comprar a un mayorista exactamente lo mismo que vende la tienda de al lado, crea piezas con tu etiqueta junto a Alma y Shirish en la India."
                      : "Instead of buying the same wholesale stock as the shop next door, build pieces under your own label alongside Alma and Shirish in India."}
                  </p>
                  <Link
                    className="ownership-link editorial-arrow-link"
                    href={localizeHref("/manufacturing")}
                  >
                    <span>
                      {isEs
                        ? "Ver cómo trabajamos la fabricación"
                        : "See how our manufacturing works"}
                    </span>
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
                  </Link>
                </div>
              </div>

              <figure className="ownership-figure" data-choreo="work-media">
                <div className="ownership-image">
                  <Image
                    src="/images/almarise/almarise-saree-design-review.jpeg"
                    alt={
                      isEs
                        ? "Alma y una confeccionista ajustando un tejido bordado en color turquesa sobre un maniquí en nuestro estudio en la India"
                        : "Alma and a garment maker draping embroidered teal fabric on a dressmaker form in our studio in India"
                    }
                    fill
                    sizes="(max-width: 64rem) 100vw, 54vw"
                    className="object-cover object-[56%_36%]"
                  />
                </div>
              </figure>
            </div>
          </div>
        </section>

        <section className="home-capabilities" id="capabilities">
          <div className="container">
            <header className="cap-header" data-choreo="cap-header">
              <div className="grid min-w-0 gap-4 text-start">
                <h2 className="max-w-[24ch] font-[family-name:var(--font-display)] text-[length:var(--text-section)] leading-[1.06] tracking-[var(--tracking-display)] text-[var(--color-forest-deep)]">
                  {isEs
                    ? "Cuatro oficios, hechos donde mejor se dominan."
                    : "Four crafts, made where each trade belongs."}
                </h2>
                <p className="max-w-[48ch] text-[length:var(--text-md)] leading-[1.64] text-[var(--color-muted)]">
                  {isEs
                    ? "Conectamos cada pieza con fábricas familiares, marroquineros y colectivos de artesanas de la India que visitamos en persona."
                    : "We match each piece to family-run factories, leather ateliers, and artisan collectives across India that we have visited in person."}
                </p>
              </div>

              <Link
                className="cap-header-link editorial-arrow-link"
                href={localizeHref("/manufacturing#product-categories")}
              >
                <span>
                  {isEs
                    ? "Ver categorías y proceso"
                    : "Explore categories and process"}
                </span>
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
              </Link>
            </header>

            <div className="cap-pairs">
              {HOME_CAPABILITY_PAIRS.map(([leading, trailing]) => (
                <div
                  key={`${leading.id}-${trailing.id}`}
                  className="cap-pair"
                  data-choreo="cap-pair"
                >
                  {[
                    { item: leading, position: "leading" as const },
                    { item: trailing, position: "trailing" as const },
                  ].map(({ item, position }) => (
                    <article
                      key={item.id}
                      className={`cap-unit cap-unit--${position}`}
                      data-choreo={`cap-unit-${position}`}
                    >
                      <div
                        className="cap-figure-wrap"
                        data-choreo="cap-figure-entry"
                      >
                        <div
                          className="cap-drift-media"
                          data-choreo="cap-drift-media"
                        >
                          <div className="cap-figure">
                            <div
                              className="cap-figure-media"
                              data-choreo="cap-figure-media"
                            >
                              <Image
                                src={item.image}
                                alt={item.imageAlt[language]}
                                fill
                                sizes="(max-width: 40rem) 100vw, (max-width: 64rem) 44vw, 31vw"
                                className="cap-figure-img object-cover object-center"
                              />
                            </div>
                            <div className="cap-veil" aria-hidden="true" />
                            <Link
                              href={localizeHref(
                                `/product-brief?product=${item.querySlug}`,
                              )}
                              className="cap-overlay editorial-arrow-link"
                              data-cap-overlay-link
                            >
                              <span className="cap-cta press-scale">
                                <span>{item.ctaLabel[language]}</span>
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
                              </span>
                            </Link>
                          </div>
                        </div>
                      </div>

                      <div
                        className="cap-aside-wrap"
                        data-choreo="cap-aside-entry"
                      >
                        <div className="cap-aside">
                          <span className="cap-tether" aria-hidden="true" />
                          <div className="cap-aside-content">
                            <div
                              className="cap-drift-name"
                              data-choreo="cap-drift-name"
                            >
                              <h3 className="cap-aside-name">
                                {item.title[language]}
                              </h3>
                            </div>
                            <div
                              className="cap-drift-aside"
                              data-choreo="cap-drift-aside"
                            >
                              <p className="cap-aside-summary">
                                {item.summary[language]}
                              </p>
                              <Link
                                href={localizeHref(
                                  `/product-brief?product=${item.querySlug}`,
                                )}
                                className="cap-aside-link editorial-arrow-link"
                              >
                                <span>{item.ctaLabel[language]}</span>
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
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </section>

        <FoundersStorySection language={language} />

        <HorizontalShowcase />

        <SectionBridge from="wood" to="paper" size="gentle" />

        <section
          className="bg-[var(--color-paper)] pt-[var(--section-gap-s)] text-[var(--color-ink)]"
          id="faq"
          data-chat-avoid
        >
          <div className="container grid gap-12 pb-[var(--section-gap)] lg:grid-cols-12 lg:items-start lg:gap-[var(--gap-columns)]">
            <div className="grid content-start gap-5 lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:col-span-4">
              <h2 className="font-[family-name:var(--font-display)] text-[length:var(--text-section)] leading-[1.06] tracking-[var(--tracking-display)] text-[var(--color-forest-deep)]">
                {isEs
                  ? "Respuestas claras antes de dar el salto a la India."
                  : "Honest answers before you take the leap to India."}
              </h2>
              <p className="max-w-[38ch] text-[length:var(--text-md)] leading-[1.64] text-[var(--color-muted)]">
                {isEs
                  ? "Fabricar en la India por primera vez despierta dudas lógicas. Así llevamos cada paso hasta tu puerta."
                  : "Manufacturing in India for the first time brings fair questions. Here is how we run every step to your door."}
              </p>
              <div className="grid gap-1">
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold [text-wrap:balance] text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  href={localizeHref("/manufacturing#faq")}
                >
                  <span>
                    {isEs
                      ? "Ver las 5 preguntas frecuentes"
                      : "Read all 5 manufacturing FAQs"}
                  </span>
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
                </Link>
                <Link
                  className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-medium [text-wrap:balance] text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                  href={localizeHref("/stories")}
                >
                  <span>
                    {isEs
                      ? "Leer Historias desde la India y España"
                      : "Read Stories from India and Spain"}
                  </span>
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
                </Link>
              </div>
            </div>

            <div className="lg:col-span-8" data-choreo="faq-group">
              <HomeFaqAccordion items={HOME_FAQS} language={language} />
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="pale-sage" />

        <ClosingConversationSection language={language} />
      </main>

      <SiteFooter />
    </>
  );
}
