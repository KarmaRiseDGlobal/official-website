import type { Metadata } from "next";
import Link from "next/link";

import { MediaPlaceholder } from "@/components/media-placeholder";
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
    title: "Brief review",
    body: "Alma reads your notes and responds directly in English, Spanish, or Portuguese.",
  },
  {
    number: "02",
    title: "Video conversation",
    body: "We schedule a call to understand your brand, retail context, and practical expectations.",
  },
  {
    number: "03",
    title: "Evaluation and proposal",
    body: "We assess material, partner fit, sampling approach, and indicative Bulk Order scope, then send a proposal.",
  },
  {
    number: "04",
    title: "Programme kickoff",
    body: "Once the proposal is approved, we move into Design approval and sampling.",
  },
] as const;

const checklistItems = [
  "Product category and intended retail quality standard",
  "Visual references, mood boards, sketches, or existing item links",
  "Preferred materials, trims, or finish expectations (if already known)",
  "Indicative Bulk Order quantity and whether you need a smaller first run",
  "Destination country and target launch or delivery window",
] as const;

export default function ProductBriefPage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-lg)]">
            <p className="section-index">Start a Product Brief</p>
            <h1 className="max-w-[12ch] text-[clamp(3.75rem,7.5vw,7.5rem)] leading-[0.88] font-medium">
              Turn what your brand knows into a Product Brief.
            </h1>
            <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
              You do not need finished factory blueprints to write to us. Bring
              a product idea, a physical reference, or an existing line you want
              to produce with an Indian Manufacturing Partner.
            </p>
          </div>
        </section>

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-xl)]">
            <div className="grid gap-2">
              <p className="section-index">What happens next</p>
              <h2 className="text-[length:var(--text-2xl)] font-medium">
                From first note to Manufacturing Programme proposal.
              </h2>
            </div>

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

        <section className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-start gap-[var(--space-2xl)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-xl)] lg:col-span-5">
              <div className="grid gap-4">
                <p className="section-index text-[var(--color-clay-light)]">
                  Preparation guide
                </p>
                <h2 className="text-[length:var(--text-display-s)] leading-[0.96] font-medium text-[var(--color-paper)]">
                  What helps us evaluate your project faster.
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

              <div className="rounded-[var(--radius-card)] border border-[var(--color-paper)]/15 bg-[var(--color-night)]/30 p-6">
                <p className="text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-light)]">
                  Confidential handling
                </p>
                <p className="mt-2 text-[length:var(--text-sm)] text-[var(--color-paper-2)]">
                  Your product references, designs, and commercial goals are
                  read only by KarmaRise D Global&apos;s founders during
                  evaluation.
                </p>
              </div>

              <MediaPlaceholder
                kind="Photo"
                ratio="4:3 horizontal"
                aspectClass="aspect-[4/3]"
                tone="dark"
                title="Materials and specification desk"
                description="4:3 studio photograph of a clean worktable holding fabric cuttings, leather strips, brass buckles, a pencil sketch, and a measuring tape in soft natural light."
              />
            </div>

            <div className="lg:col-span-7">
              <div className="mb-8 grid gap-3">
                <p className="section-index text-[var(--color-clay-light)]">
                  Your Product Brief
                </p>
                <h2 className="text-[length:var(--text-2xl)] font-medium text-[var(--color-paper)]">
                  Share the essentials and we will take it from there.
                </h2>
              </div>
              <ProductBriefForm />
            </div>
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
              Open Contact page for all channels
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
