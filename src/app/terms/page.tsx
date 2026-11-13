import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Terms",
  description:
    "Terms covering the KarmaRise D Global website, brand assets, and pre-agreement Manufacturing Programme information.",
};

export default function TermsPage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid max-w-[68ch] gap-[var(--space-xl)]">
            <div className="grid gap-4">
              <p className="section-index">Legal notice</p>
              <h1 className="text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] font-medium">
                Website terms
              </h1>
              <p className="lead text-[var(--color-ink-2)]">
                Information published on this site describes KarmaRise D
                Global&apos;s Manufacturing Programmes and wider company work.
              </p>
            </div>

            <section className="grid gap-3 border-t border-[var(--color-rule)] pt-6">
              <h2 className="text-[length:var(--text-2xl)] font-medium">
                Pre-agreement scope
              </h2>
              <p className="text-[var(--color-muted)]">
                Descriptions of Manufacturing Programmes, phases, sampling, and
                delivery responsibilities on this website serve as general
                orientation. Specific quantities, timelines, pricing, testing
                requirements, and delivery obligations are agreed individually
                in each Client&apos;s written Product Brief and project
                proposal.
              </p>
            </section>

            <section className="grid gap-3 border-t border-[var(--color-rule)] pt-6">
              <h2 className="text-[length:var(--text-2xl)] font-medium">
                Brand and content ownership
              </h2>
              <p className="text-[var(--color-muted)]">
                KarmaRise D Global owns this website, its published editorial
                Stories, and the Almarise fashion brand. Photographs, video
                footage, and text may not be reproduced commercially without
                written permission.
              </p>
            </section>

            <section className="grid gap-3 border-t border-[var(--color-rule)] pt-6">
              <h2 className="text-[length:var(--text-2xl)] font-medium">
                Questions
              </h2>
              <p className="text-[var(--color-muted)]">
                Questions about these terms can be directed to{" "}
                <a
                  className="underline decoration-[var(--color-clay)] underline-offset-4"
                  href="mailto:hola@karmarisedglobal.com"
                >
                  hola@karmarisedglobal.com
                </a>{" "}
                or by post to 2nd floor, Guru Charan Apartment, Ulhasnagar,
                Maharashtra, India, 421002.
              </p>
            </section>

            <div className="pt-4">
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
