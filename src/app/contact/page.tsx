import type { Metadata } from "next";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Reach KarmaRise D Global in India and Europe in English, Spanish, or Portuguese for Manufacturing Programmes, partner introductions, Almarise, or general enquiries.",
};

export default function ContactPage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-lg)]">
              <p className="section-index">Contact</p>
              <h1 className="max-w-[14ch] text-[clamp(3.75rem,7.5vw,7.5rem)] leading-[0.88] font-medium">
                Two offices of conversation between Spain and India.
              </h1>
              <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
                Reach KarmaRise D Global directly in English, Spanish, or
                Portuguese.
              </p>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              <article className="grid content-between gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-7">
                <div className="grid gap-3">
                  <h2 className="text-[length:var(--text-2xl)] font-medium">
                    Commissioning a product or Bulk Order
                  </h2>
                  <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    Ready to discuss manufacturing bags, garments, or another
                    product in India?
                  </p>
                </div>
                <Link className="primary-button w-fit" href="/product-brief">
                  Start a Product Brief
                </Link>
              </article>

              <article className="grid content-between gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-7">
                <div className="grid gap-3">
                  <h2 className="text-[length:var(--text-2xl)] font-medium">
                    Indian Manufacturing Partners and artisans
                  </h2>
                  <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    Workshops in India interested in collaborating on
                    Manufacturing Programmes can write with workshop location,
                    product specialization, and capacity overview.
                  </p>
                </div>
                <a
                  className="w-fit font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href="mailto:hola@karmarisedglobal.com?subject=Manufacturing%20Partner%20Introduction"
                >
                  Email hola@karmarisedglobal.com
                </a>
              </article>

              <article className="grid content-between gap-5 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper)] p-7">
                <div className="grid gap-3">
                  <h2 className="text-[length:var(--text-2xl)] font-medium">
                    Almarise, Stories and training collaboration
                  </h2>
                  <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    Press questions, editorial notes, Almarise enquiries, or
                    Maharashtra Women&apos;s Training Initiative conversations.
                  </p>
                </div>
                <a
                  className="w-fit font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href="#general-note"
                >
                  Write via the form below
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-xl)] lg:col-span-6">
              <div className="grid gap-3">
                <p className="section-index text-[var(--color-clay-light)]">
                  Direct details
                </p>
                <h2 className="text-[length:var(--text-display-s)] leading-[0.96] font-medium text-[var(--color-paper)]">
                  Speak with us in India or Europe.
                </h2>
              </div>

              <dl className="m-0 grid gap-6 text-[var(--color-paper-2)]">
                <div className="grid gap-1 border-t border-[var(--color-paper)]/15 pt-4">
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                    India studio address
                  </dt>
                  <dd className="m-0">
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-paper)]"
                      href="https://www.google.com/maps/place/Guru+Charan/@19.2324905,73.1534675,49m/data=!3m1!1e3!4m6!3m5!1s0x3be7943c1ba890cf:0x3c332f2cfae05f64!8m2!3d19.2325!4d73.1536!16s%2Fg%2F1pyqv_7by?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D"
                    >
                      2nd floor, Guru Charan Apartment, Ulhasnagar, Maharashtra,
                      India, 421002
                    </a>
                  </dd>
                </div>

                <div className="grid gap-1 border-t border-[var(--color-paper)]/15 pt-4">
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                    Email
                  </dt>
                  <dd className="m-0">
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-paper)]"
                      href="mailto:hola@karmarisedglobal.com"
                    >
                      hola@karmarisedglobal.com
                    </a>
                  </dd>
                </div>

                <div className="grid gap-6 border-t border-[var(--color-paper)]/15 pt-4 sm:grid-cols-2">
                  <div className="grid gap-1">
                    <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                      India phone
                    </dt>
                    <dd className="m-0">
                      <a
                        className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-paper)]"
                        href="tel:+918530009798"
                      >
                        +91 8530009798
                      </a>
                    </dd>
                  </div>
                  <div className="grid gap-1">
                    <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                      Spain and Europe phone
                    </dt>
                    <dd className="m-0">
                      <a
                        className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-paper)]"
                        href="tel:+34611722276"
                      >
                        +34 611722276
                      </a>
                    </dd>
                  </div>
                </div>

                <div className="grid gap-1 border-t border-[var(--color-paper)]/15 pt-4">
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-light)] uppercase">
                    Social channels
                  </dt>
                  <dd className="m-0 text-[length:var(--text-sm)] text-[var(--color-paper-2)]/85">
                    WhatsApp, Instagram, TikTok, and YouTube links will be
                    connected before launch.
                  </dd>
                </div>
              </dl>
            </div>

            <div className="lg:col-span-6">
              <MediaPlaceholder
                kind="Photo"
                ratio="4:3 horizontal"
                aspectClass="aspect-[4/3]"
                tone="dark"
                title="Ulhasnagar studio workspace"
                description="4:3 interior photograph of the Ulhasnagar studio desk with fabric samples, leather swatches, and warm daylight through the window blinds."
              />
            </div>
          </div>
        </section>

        <section
          className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]"
          id="general-note"
        >
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-4 lg:col-span-5">
              <p className="section-index text-[var(--color-clay-light)]">
                General message
              </p>
              <h2 className="text-[length:var(--text-display-s)] leading-[0.96] font-medium text-[var(--color-paper)]">
                Send a general note.
              </h2>
              <p className="text-[var(--color-paper-2)]">
                For new product enquiries, use the structured{" "}
                <Link
                  className="underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-paper)]"
                  href="/product-brief"
                >
                  Product Brief page
                </Link>{" "}
                so we can review your scope right away.
              </p>
            </div>

            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
