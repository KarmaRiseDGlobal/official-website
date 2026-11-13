import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { StoriesBrowser } from "@/components/stories-browser";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "Editorial accounts of manufacturing, materials, people, completed work, and company progress published by KarmaRise D Global.",
};

export default function StoriesPage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--space-2xl)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-lg)]">
            <p className="section-index">Stories</p>
            <h1 className="max-w-[14ch] text-[clamp(3.75rem,7.5vw,7.5rem)] leading-[0.88] font-medium">
              Notes from workshops, materials and the work as it unfolds.
            </h1>
            <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
              Editorial accounts of how products are developed with Indian
              Manufacturing Partners, what we learn on the ground, and how
              KarmaRise D Global grows.
            </p>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container">
            <StoriesBrowser />
          </div>
        </section>

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container flex flex-wrap items-center justify-between gap-6">
            <div className="grid gap-2">
              <p className="section-index">Follow progress</p>
              <h2 className="text-[length:var(--text-2xl)] font-medium">
                Want to discuss a product or follow upcoming Stories?
              </h2>
              <p className="max-w-[54ch] text-[var(--color-muted)]">
                New Stories are added as workshops, sampling runs, and company
                milestones progress.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <Link className="primary-button" href="/product-brief">
                Start a Product Brief
              </Link>
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/contact"
              >
                Write to us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
