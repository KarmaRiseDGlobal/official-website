import Image from "next/image";
import Link from "next/link";

import { ABOUT_FOUNDERS, ABOUT_SPAIN_INDIA_BRIDGE } from "@/data/about-content";
import { OFFICIAL_SOCIALS } from "@/data/socials";
import {
  INDIA_MAP_GEOMETRY,
  SPAIN_MAP_GEOMETRY,
} from "@/data/spain-india-maps";
import { localizePath, type SiteLanguage } from "@/lib/urls";
import styles from "@/views/about.module.css";

interface SpainIndiaFoundersSectionProps {
  readonly language: SiteLanguage;
}

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

function SpainSilhouette() {
  return (
    <svg
      viewBox={SPAIN_MAP_GEOMETRY.viewBox}
      className={styles.countryMapSvg}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        {SPAIN_MAP_GEOMETRY.paths.map((d, index) => (
          <path key={`spain-path-${index}`} d={d} />
        ))}
      </g>
    </svg>
  );
}

function IndiaSilhouette() {
  return (
    <svg
      viewBox={INDIA_MAP_GEOMETRY.viewBox}
      className={styles.countryMapSvg}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="currentColor">
        {INDIA_MAP_GEOMETRY.paths.map((d, index) => (
          <path key={`india-path-${index}`} d={d} />
        ))}
      </g>
    </svg>
  );
}

export function SpainIndiaFoundersSection({
  language,
}: SpainIndiaFoundersSectionProps) {
  const isEs = language === "es";
  const bridge = ABOUT_SPAIN_INDIA_BRIDGE;
  const alma = ABOUT_FOUNDERS[0]!;
  const shirish = ABOUT_FOUNDERS[1]!;

  return (
    <section
      className={styles.bridgeSection}
      id="founders"
      aria-labelledby="founders-bridge-heading"
    >
      <div className="relative z-[2] container pb-[var(--space-xl)]">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[length:var(--text-xs)] font-semibold tracking-[var(--tracking-label)] uppercase">
          <nav
            aria-label={isEs ? "Ruta de navegación" : "Breadcrumb"}
            className="flex items-center"
          >
            <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
              <li>
                <Link
                  className="inline-flex min-h-[var(--tap-min)] min-w-[var(--tap-min)] items-center text-[var(--color-muted)] no-underline transition-colors hover:text-[var(--color-forest-deep)]"
                  href={localizePath("/", language)}
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
                {isEs ? "Quiénes somos" : "About"}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Giant Half-Visible Spain (left) & India (right) Maps Framing Centered Founder Stories */}
      <div className={styles.geoStage} data-choreo="geo-bridge-stage">
        <div className={styles.geoMapsBackdrop} aria-hidden="true">
          <div className={styles.geoMapsFrame}>
            <div
              className={`${styles.geoMapWing} ${styles.geoMapWingSpain}`}
              data-choreo="geo-map-spain"
            >
              <div className={styles.countryMapWrapSpain}>
                <SpainSilhouette />
              </div>
              <p className={styles.geoLabelSpain}>
                <span className={styles.geoPreposition}>
                  {bridge.origin.preposition[language]}
                </span>
                <span>{bridge.origin.country[language]}</span>
              </p>
            </div>

            <div
              className={`${styles.geoMapWing} ${styles.geoMapWingIndia}`}
              data-choreo="geo-map-india"
            >
              <div className={styles.countryMapWrapIndia}>
                <IndiaSilhouette />
              </div>
              <p className={styles.geoLabelIndia}>
                <span className={styles.geoPreposition}>
                  {bridge.destination.preposition[language]}
                </span>
                <span>{bridge.destination.country[language]}</span>
              </p>
            </div>
          </div>
        </div>

        <div className={styles.centerCorridor} data-choreo="geo-corridor">
          <header
            className={styles.geoIntro}
            data-choreo="about-section-header"
          >
            <h2 id="founders-bridge-heading" className={styles.geoHeading}>
              {bridge.heading[language]}
            </h2>
            <p className={styles.geoSummary}>{bridge.summary[language]}</p>
          </header>

          <div className={styles.foundersStream} data-choreo="founders-spread">
            {[alma, shirish].map((founder) => {
              const linkedInHref =
                founder.id === "alma"
                  ? OFFICIAL_SOCIALS.almaLinkedIn
                  : OFFICIAL_SOCIALS.shirishLinkedIn;
              const linkedInLabel =
                founder.id === "alma"
                  ? isEs
                    ? "Conectar con Alma en LinkedIn"
                    : "Connect with Alma on LinkedIn"
                  : isEs
                    ? "Conectar con Shirish en LinkedIn"
                    : "Connect with Shirish on LinkedIn";

              return (
                <article
                  key={founder.id}
                  id={founder.id}
                  className={styles.founderStoryCard}
                  data-choreo={
                    founder.id === "alma"
                      ? "founder-story-spain"
                      : "founder-story-india"
                  }
                >
                  <figure className={styles.founderFrame}>
                    <Image
                      src={founder.image}
                      alt={founder.imageAlt[language]}
                      fill
                      sizes="(max-width: 46rem) calc(100vw - 2rem), 576px"
                      className={
                        founder.id === "alma"
                          ? styles.almaPortraitImg
                          : styles.shirishPortraitImg
                      }
                    />
                  </figure>

                  <div className={styles.founderCopyBlock}>
                    <div className={styles.founderHeader}>
                      <h3 className={styles.founderName}>{founder.name}</h3>
                      <span className={styles.founderPlace}>
                        {founder.place[language]}
                      </span>
                    </div>
                    <p className={styles.founderLead}>
                      {founder.lead[language]}
                    </p>
                    <p className={styles.founderBody}>
                      {founder.body[language]}
                    </p>
                    <a
                      href={linkedInHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] w-fit items-center gap-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                    >
                      <span>{linkedInLabel}</span>
                      <ArrowIcon />
                      <span className="sr-only">
                        {isEs
                          ? " (se abre en una pestaña nueva)"
                          : " (opens in a new tab)"}
                      </span>
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
