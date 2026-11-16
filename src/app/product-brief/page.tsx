import type { Metadata } from "next";
import Link from "next/link";

import { ProductBriefForm } from "@/components/product-brief-form";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Start a Product Brief",
  description:
    "Prepare and share a Product Brief with KarmaRise D Global to evaluate design, materials, Manufacturing Partner fit, quantity and delivery.",
};

const postSubmissionSteps = [
  {
    number: "01",
    title: "Alma reads your brief",
    body: "She replies in English, Spanish or Portuguese.",
  },
  {
    number: "02",
    title: "We talk it through",
    body: "On a video call, we ask about your brand, where you sell and what you need the product to do.",
  },
  {
    number: "03",
    title: "You get a proposal",
    body: "We assess materials, workshop fit, sampling and the likely Bulk Order scope before sending it.",
  },
  {
    number: "04",
    title: "Design gets underway",
    body: "Once you approve the proposal, we work through design approval and sampling.",
  },
] as const;

const checklistItems = [
  "What you want to make and the quality you expect",
  "References such as sketches, sample photos or links to existing products",
  "Any materials, trims or finishes you already have in mind",
  "Estimated Bulk Order quantity, including any smaller first run",
  "Destination country and target launch or delivery date",
] as const;

export default function ProductBriefPage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-lg)]">
            <h1 className="max-w-[17ch] text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium">
              Start a Product Brief
            </h1>
            <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
              Start with what you have. A sketch, a physical sample or an
              existing product you want to make in India gives us something to
              discuss.
            </p>
          </div>
        </section>

        <section className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-start gap-[var(--space-2xl)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-xl)] lg:col-span-5">
              <div className="grid gap-4">
                <h2 className="text-[length:var(--text-display-s)] leading-[1.04] font-medium text-[var(--color-paper)]">
                  What to include
                </h2>
                <ul className="m-0 grid list-none gap-3 p-0 text-[var(--color-paper-2)]">
                  {checklistItems.map((item) => (
                    <li
                      key={item}
                      className="border-t border-[var(--color-paper)]/15 pt-3 text-[length:var(--text-sm)]"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="max-w-[46ch] border-t border-[var(--color-paper)]/15 pt-4 text-[length:var(--text-sm)] text-[var(--color-paper-2)]">
                Only the founders of KarmaRise D Global review your product
                references, designs and commercial goals during evaluation.
              </p>
            </div>

            <div className="lg:col-span-7">
              <h2 className="mb-6 text-[length:var(--text-2xl)] font-medium text-[var(--color-paper)]">
                Your Product Brief
              </h2>
              <ProductBriefForm />
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-xl)]">
            <h2 className="text-[length:var(--text-2xl)] font-medium">
              After you send your brief
            </h2>

            <ol className="m-0 grid list-none gap-[var(--gap-columns)] p-0 sm:grid-cols-2 lg:grid-cols-4">
              {postSubmissionSteps.map((step) => (
                <li
                  key={step.number}
                  className="grid content-start gap-3 border-t border-[var(--color-forest)]/25 pt-5"
                >
                  <span className="num text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-ink)]">
                    {step.number}
                  </span>
                  <h3 className="text-[length:var(--text-title)] font-medium">
                    {step.title}
                  </h3>
                  <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[var(--color-paper-2)] py-[var(--space-2xl)] text-[var(--color-forest-deep)]">
          <div className="container flex flex-wrap items-center justify-between gap-6">
            <div className="grid gap-1">
              <p className="font-semibold">Prefer to call or write directly?</p>
              <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                Reach Alma in Europe on +34 611722276, Shirish in India on +91
                8530009798, or write to hola@karmarisedglobal.com.
              </p>
            </div>
            <Link
              className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
              href="/contact"
            >
              View contact details
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
