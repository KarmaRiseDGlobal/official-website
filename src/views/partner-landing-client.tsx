"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import {
  buildPartnerTrackedHref,
  type PartnerLandingConfig,
} from "@/data/partner-landings";
import { OFFICIAL_SOCIALS } from "@/data/socials";
import { captureSessionAttributionFromUrl } from "@/lib/client-handoff";
import { localizePath, type SiteLanguage } from "@/lib/urls";

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

export function PartnerLandingClient({
  partner,
  lang,
}: {
  partner: PartnerLandingConfig;
  lang: SiteLanguage;
}) {
  const isEs = lang === "es";

  useEffect(() => {
    captureSessionAttributionFromUrl();
  }, [partner.slug]);

  const primaryHref = buildPartnerTrackedHref(
    partner.primaryCta.href,
    partner,
    lang,
    localizePath,
  );
  const secondaryHref = buildPartnerTrackedHref(
    partner.secondaryCta.href,
    partner,
    lang,
    localizePath,
  );

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-md))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <nav
              aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
              className="flex items-center text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] uppercase"
            >
              <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
                <li>
                  <Link
                    className="inline-flex min-h-[var(--tap-min)] min-w-[var(--tap-min)] items-center text-[var(--color-muted)] no-underline transition-colors hover:text-[var(--color-forest-deep)]"
                    href={localizePath("/", lang)}
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
                  {partner.breadcrumbLabel[lang]}
                </li>
              </ol>
            </nav>

            <div className="grid items-center gap-[var(--space-xl)] lg:grid-cols-12 lg:gap-[var(--gap-columns)]">
              <div className="grid gap-[var(--space-lg)] lg:col-span-7">
                <h1 className="m-0 max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                  {partner.headline[lang]}
                </h1>
                <p className="lead m-0 max-w-[52ch] text-[var(--color-ink-2)]">
                  {partner.lead[lang]}
                </p>
                <p className="m-0 max-w-[54ch] text-[length:var(--text-sm)] font-medium text-[var(--color-muted)]">
                  {partner.helperNote[lang]}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href={primaryHref}
                    className="primary-button-light inline-flex min-h-[var(--control-height)] items-center justify-center"
                  >
                    {partner.primaryCta.label[lang]}
                  </Link>
                  <Link
                    href={secondaryHref}
                    className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                  >
                    <span>{partner.secondaryCta.label[lang]}</span>
                    <ArrowIcon />
                  </Link>
                </div>
              </div>

              <figure className="editorial-photo-frame m-0 aspect-[4/3] w-full lg:col-span-5">
                <Image
                  src={partner.image}
                  alt={partner.imageAlt[lang]}
                  fill
                  priority
                  sizes="(max-width: 64rem) 100vw, 42vw"
                  className="object-cover"
                  style={{ objectPosition: partner.imagePosition }}
                />
              </figure>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="dune" />

        <section className="bg-[var(--color-dune)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-4">
              <h2 className="m-0 max-w-[24ch] text-[length:var(--text-section)] leading-[1.06] font-normal">
                {partner.highlightsHeading[lang]}
              </h2>
              <p className="m-0 max-w-[58ch] text-[var(--color-ink-2)]">
                {partner.highlightsIntro[lang]}
              </p>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              {partner.highlights.map((item) => (
                <article key={item.id} className="grid content-start gap-3">
                  <h3 className="m-0 text-[length:var(--text-title)] leading-[1.18] font-normal text-[var(--color-forest-deep)]">
                    {item.title[lang]}
                  </h3>
                  <p className="m-0 text-[length:var(--text-sm)] leading-[1.64] text-[var(--color-muted)]">
                    {item.body[lang]}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <SectionBridge from="dune" to="pale-sage" />

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-4 lg:col-span-6">
              <h2 className="m-0 max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.06] font-normal">
                {partner.closingHeading[lang]}
              </h2>
              <p className="m-0 max-w-[52ch] text-[var(--color-ink-2)]">
                {partner.closingBody[lang]}
              </p>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
                {partner.track === "b2b" ? (
                  <>
                    <Link
                      href={buildPartnerTrackedHref(
                        "/manufacturing",
                        partner,
                        lang,
                        localizePath,
                      )}
                      className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                    >
                      <span>
                        {isEs
                          ? "Ver el Programa de producción"
                          : "Explore the Manufacturing Programme"}
                      </span>
                      <ArrowIcon />
                    </Link>
                    <Link
                      href={buildPartnerTrackedHref(
                        "/how-we-work",
                        partner,
                        lang,
                        localizePath,
                      )}
                      className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                    >
                      <span>
                        {isEs
                          ? "Cómo trabajamos entre España y la India"
                          : "See how we work across Spain and India"}
                      </span>
                      <ArrowIcon />
                    </Link>
                  </>
                ) : (
                  <>
                    <a
                      href={OFFICIAL_SOCIALS.almariseInstagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                    >
                      <span>
                        {isEs
                          ? "Seguir a @almarisedbrand en Instagram"
                          : "Follow @almarisedbrand on Instagram"}
                      </span>
                      <ArrowIcon />
                    </a>
                    <Link
                      href={buildPartnerTrackedHref(
                        "/contact",
                        partner,
                        lang,
                        localizePath,
                      )}
                      className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 text-[length:var(--text-sm)] font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                    >
                      <span>
                        {isEs
                          ? "Escribir a Alma y Shirish"
                          : "Write to Alma and Shirish"}
                      </span>
                      <ArrowIcon />
                    </Link>
                  </>
                )}
              </div>
            </div>

            <div className="lg:col-span-6">
              {partner.showNewsletter ? (
                <NewsletterForm
                  variant="light"
                  source={`Partner Landing: ${partner.slug}`}
                  defaultTrack="almarise"
                />
              ) : (
                <div className="flex flex-wrap items-center gap-4 lg:justify-end">
                  <Link
                    href={primaryHref}
                    className="primary-button-light inline-flex min-h-[var(--control-height)] items-center justify-center"
                  >
                    {partner.primaryCta.label[lang]}
                  </Link>
                  <Link
                    href={secondaryHref}
                    className="secondary-button-light inline-flex min-h-[var(--control-height)] items-center justify-center"
                  >
                    {isEs
                      ? "Empezar briefing de producto"
                      : "Start a Product Brief"}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <SectionBridge from="pale-sage" to="night" size="gentle" />
      </main>

      <SiteFooter hideNewsletter={partner.showNewsletter} />
    </>
  );
}
