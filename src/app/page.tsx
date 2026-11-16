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
                See how manufacturing works
              </Link>
            </div>
          </div>
        </section>

        <section className="ownership" id="work">
          <div className="ownership-grid container">
            <div className="ownership-copy">
              <h2>What would you change about the pieces on your shelves?</h2>
              <p className="lead">
                Maybe the bag needs a longer strap. Maybe the fabric is right
                but the fit is wrong. Tell us what people reach for and what
                they put back. Those are good clues for what to make under your
                own label.
              </p>
              <p className="max-w-[var(--measure-narrow)] text-[var(--color-muted)]">
                We turn those clues into a Product Brief the workshop can use,
                with decisions about design, materials, quantity, quality and
                delivery.
              </p>
            </div>

            <figure className="ownership-image">
              <Image
                src="/images/garment-work-in-progress.jpg"
                alt="Alma and a garment maker draping embroidered teal fabric on a dressmaker form in the sunlit studio"
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
          <div className="founders-media py-[clamp(8.5rem,18svh,13rem)]">
            <Image
              className="object-cover object-[50%_40%]"
              src="/images/alma-and-shirish-founders.jpg"
              alt="Shirish and Alma in discussion across a sunlit studio table with a tablet and fabric and leather swatches"
              fill
              sizes="100vw"
            />
            <div className="founders-scrim" aria-hidden="true" />

            <div className="relative z-10 container flex flex-col items-center text-center">
              <div className="flex max-w-lg flex-col items-center gap-[var(--space-lg)]">
                <p className="lead text-[var(--color-paper)]">
                  Alma flew from Spain to India a few months after she and
                  Shirish met. They started KarmaRise D Global there. Today Alma
                  works with clients in Europe, and Shirish works with the
                  people making their products in India.
                </p>

                <Link
                  className="inline-flex items-center justify-center rounded-full border border-[var(--color-paper)]/60 bg-[var(--color-night)]/35 px-7 py-3 text-[length:var(--text-sm)] font-semibold tracking-[0.02em] text-[var(--color-paper)] backdrop-blur-sm transition-colors hover:border-[var(--color-paper)] hover:bg-[var(--color-paper)] hover:text-[var(--color-night)]"
                  href="/about"
                >
                  Meet Alma and Shirish
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="enquiry" id="enquire">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="enquiry-copy lg:col-span-7">
              <h2>What do you want to make?</h2>
              <p className="lead">
                A sketch, a piece you already sell or a sample you can point to
                is enough to start.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 lg:col-span-5 lg:justify-end">
              <Link className="primary-button" href="/product-brief">
                Start a Product Brief
              </Link>
              <Link
                className="font-semibold text-[var(--color-paper)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-clay-light)]"
                href="/contact"
              >
                Contact us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
