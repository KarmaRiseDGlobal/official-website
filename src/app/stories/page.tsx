import type { Metadata } from "next";
import Link from "next/link";

import { NewsletterForm } from "@/components/newsletter-form";
import { SiteFooter } from "@/components/site-footer";
import { StoriesBrowser } from "@/components/stories-browser";
import { storyCategoryDetails } from "@/data/stories";
import { getStories } from "@/lib/sanity";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Stories · The KarmaRise Journal",
  description:
    "Editorial accounts of Indian heritage, sustainable saree fashion, workshop craftsmanship, design sampling, and cross-continental work between Spain and India.",
};

export default async function StoriesPage() {
  const allStories = await getStories();

  return (
    <>
      <main id="main">
        {/* Editorial Journal Masthead */}
        <section className="bg-[var(--color-forest-deep)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--space-3xl)] text-[var(--color-paper)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-paper)]/15 pb-5 text-[length:var(--text-xs)] font-semibold tracking-[0.06em] uppercase">
              <span className="text-[var(--color-clay-light)]">
                The KarmaRise Journal · Edition 01
              </span>
              <span className="num text-[var(--color-paper-2)]">
                {allStories.length} Published Stories · English &amp; Español
              </span>
            </div>

            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-lg)] lg:col-span-7">
                <h1 className="max-w-[15ch] text-[clamp(2.75rem,5.8vw,5.5rem)] leading-[0.98] font-medium text-[var(--color-paper)]">
                  Stories from the workshop table, the road and two continents.
                </h1>
              </div>

              <div className="grid gap-5 lg:col-span-5">
                <p className="lead text-[var(--color-paper-2)]">
                  Editorial accounts of how products are developed with Indian
                  Manufacturing Partners, how existing sarees become
                  contemporary clothing, and what we learn between Spain and
                  Maharashtra.
                </p>
                <div className="flex flex-wrap items-center gap-6 text-[length:var(--text-sm)]">
                  <a
                    href="#journal-stories"
                    className="font-semibold text-[var(--color-gold)] underline decoration-[var(--color-gold)] underline-offset-4 hover:text-[var(--color-paper)]"
                  >
                    Browse Stories
                  </a>
                  <a
                    href="#journal-newsletter"
                    className="font-semibold text-[var(--color-paper)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-clay-light)]"
                  >
                    Subscribe to the Journal
                  </a>
                </div>
              </div>
            </div>

            {/* Six Pillars Strip */}
            <div className="grid gap-4 border-t border-[var(--color-paper)]/15 pt-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
              {storyCategoryDetails.map((pillar) => (
                <div
                  key={pillar.slug}
                  className="grid content-start gap-1 border-l border-[var(--color-paper)]/20 pl-3.5"
                >
                  <span className="num text-[length:var(--text-xs)] font-semibold text-[var(--color-gold)]">
                    {pillar.number}
                  </span>
                  <p className="text-[length:var(--text-sm)] font-medium text-[var(--color-paper)]">
                    {pillar.title}
                  </p>
                  <p className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/75">
                    {pillar.spanishTitle}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Interactive Journal Browser */}
        <section
          id="journal-stories"
          className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]"
        >
          <div className="container">
            <StoriesBrowser stories={allStories} />
          </div>
        </section>

        {/* Journal Subscription Section */}
        <section
          id="journal-newsletter"
          className="scroll-mt-24 bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]"
        >
          <div className="container grid items-start gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-4 lg:col-span-5">
              <p className="section-index">Curated bilingual editions</p>
              <h2 className="max-w-[15ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                Receive the KarmaRise Journal in your language.
              </h2>
              <p className="max-w-[48ch] text-[var(--color-ink-2)]">
                Every two to four weeks, we select two to four published Stories
                and send a curated edition in English or Spanish. No automated
                daily blasts.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-6 pt-2">
                <Link className="primary-button" href="/product-brief">
                  Start a Product Brief
                </Link>
                <Link
                  className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href="/contact"
                >
                  Write to Alma &amp; Shirish
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <NewsletterForm variant="journal" source="Stories Journal Page" />
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
