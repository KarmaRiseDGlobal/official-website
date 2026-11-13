import Image from "next/image";
import Link from "next/link";

import { HeroVideo } from "@/components/hero-video";
import { ManufacturingProgramme } from "@/components/manufacturing-programme";
import { SiteFooter } from "@/components/site-footer";
import { WorkingAcrossDistance } from "@/components/working-across-distance";

export default function Home() {
  return (
    <>
      <main id="main">
        <section className="hero" id="top">
          <HeroVideo />
          <div className="hero-scrim" aria-hidden="true" />
          <div className="hero-content container">
            <p className="hero-context">From Product Brief to Bulk Order</p>
            <h1>Turn your point of view into a product.</h1>
            <p className="hero-lead">
              KarmaRise D Global develops and delivers own-brand products
              through Indian manufacturing.
            </p>
            <div className="hero-actions">
              <Link className="hero-primary" href="/product-brief">
                Start a Product Brief
              </Link>
              <Link className="hero-secondary" href="/manufacturing-programme">
                Follow the programme
              </Link>
            </div>
          </div>
        </section>

        <section className="ownership" id="work">
          <div className="ownership-grid container">
            <div className="ownership-copy">
              <p className="section-index">Where the work begins</p>
              <h2>Your knowledge becomes the starting point.</h2>
              <p className="lead">
                You know what people ask for, what is missing and what should be
                made differently. The Product Brief turns that knowledge into
                decisions about design, materials, quantity, quality and
                delivery.
              </p>
              <p className="max-w-[var(--measure-narrow)] text-[var(--color-muted)]">
                KarmaRise D Global carries those decisions into manufacturing
                and stays involved until the finished Bulk Order is ready for
                delivery.
              </p>
              <div>
                <Link
                  className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href="/working-across-distance"
                >
                  Read how we work across distance
                </Link>
              </div>
            </div>

            <figure className="ownership-image">
              <Image
                src="/warehouse visit images/working_together.jpeg"
                alt="A garment workspace with people working at sewing and cutting tables"
                fill
                sizes="(max-width: 60rem) 100vw, 52vw"
              />
              <figcaption>Garment work in progress</figcaption>
            </figure>
          </div>
        </section>

        <ManufacturingProgramme />

        <WorkingAcrossDistance />

        <section className="founders" id="company-story">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-5">
              <p className="section-index">Behind the work</p>
              <h2 className="text-[length:var(--text-display-s)] leading-[0.96] font-medium text-[var(--color-forest-deep)]">
                Two founders between Spain and India.
              </h2>
              <p className="lead text-[var(--color-ink-2)]">
                Alma works directly with European clients in Spanish, English
                and Portuguese. Shirish works across India with Manufacturing
                Partners and artisans.
              </p>
              <p className="text-[var(--color-muted)]">
                Together they keep one Product Brief at the center of every
                project, alongside longer-term work in Almarise and Maharashtra.
              </p>

              <div className="flex flex-wrap gap-x-6 gap-y-3 pt-2 font-semibold text-[var(--color-forest-deep)]">
                <Link
                  className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href="/about"
                >
                  Meet Alma and Shirish
                </Link>
                <Link
                  className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href="/stories"
                >
                  Read Stories from the work
                </Link>
              </div>

              <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                <span>Wider company story:</span>
                <Link
                  className="underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  href="/almarise"
                >
                  Almarise
                </Link>
                <Link
                  className="underline decoration-[var(--color-rule-2)] underline-offset-4 hover:text-[var(--color-forest-deep)]"
                  href="/womens-training-initiative"
                >
                  Women&apos;s Training Initiative
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <Image
                className="h-auto w-full rounded-[var(--radius-card)]"
                src="/founders/alma-shirish-leather-review-v2.webp"
                alt="Alma and Shirish examining a leather hide at a workshop cutting table"
                width={1584}
                height={990}
                sizes="(max-width: 64rem) 100vw, 58vw"
              />
            </div>
          </div>

          <div className="founders-color-bridge" aria-hidden="true" />
        </section>

        <section className="enquiry" id="enquire">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="enquiry-copy lg:col-span-7">
              <p className="section-index">Begin the conversation</p>
              <h2>What should belong to your brand?</h2>
              <p className="lead">
                Bring the product, a physical reference or a clear vision. The
                first step is preparing your Product Brief.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 lg:col-span-5 lg:justify-end">
              <Link className="primary-button" href="/product-brief">
                Prepare your Product Brief
              </Link>
              <Link
                className="font-semibold text-[var(--color-paper)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-clay-light)]"
                href="/contact"
              >
                Direct contact
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
