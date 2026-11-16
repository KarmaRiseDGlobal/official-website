import type { Metadata } from "next";
import Link from "next/link";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { PhaseJourney } from "@/components/phase-journey";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Manufacturing Programme",
  description:
    "See how a KarmaRise D Global Manufacturing Programme moves from the Product Brief through design, sampling, partner selection, production and delivery.",
};

const productCategories = [
  {
    name: "Bags and accessories",
    summary:
      "Structured leather bags, soft carryalls and small leather goods. We work with specialist workshops on canvas-and-leather construction, custom linings and hardware.",
    slotTitle: "Leather goods and hardware bench",
    slotDescription:
      "Portrait photo (4:5): unrolled vegetable-tanned or drum-dyed leather hides beside brass hardware, edge-painted straps, and a partially stitched bag body on a workbench.",
  },
  {
    name: "Garments and clothing",
    summary:
      "Woven apparel and seasonal capsule collections. We match the cut, finish and size of the run to a garment workshop.",
    slotTitle: "Garment draping and pattern adjustment",
    slotDescription:
      "Portrait photo (4:5): a pattern maker or seamstress adjusting draped woven fabric on a dress form or sewing machine inside a bright Indian studio.",
  },
  {
    name: "Other sewn or crafted products",
    summary:
      "Show us what you want to make. During the Product Brief review, we check whether a Manufacturing Partner can make it to your specifications.",
    slotTitle: "Material studies and trim prototypes",
    slotDescription:
      "Portrait photo (4:5): tactile material studies, woven fabrics, trims, buttons, woven labels, and packaging prototypes arranged on pale wood or linen.",
  },
] as const;

const selectionCriteria = [
  {
    title: "Materials and construction",
    body: "Has the workshop worked with this material and construction before?",
  },
  {
    title: "Capacity",
    body: "Does the order meet the workshop's minimum, and can it fit into the production schedule?",
  },
  {
    title: "Sampling",
    body: "Can the team revise samples and agree on tolerances before cutting bulk materials?",
  },
  {
    title: "Workshop visits",
    body: "What can we see for ourselves when we visit the production floor?",
  },
] as const;

const commonQuestions = [
  {
    question: "Do I need finished technical drawings before reaching out?",
    answer:
      "No. A clear product vision, a physical reference item, or material and design direction is enough to open the conversation. Detailed specifications are shaped with you before sampling begins.",
  },
  {
    question:
      "Can we review physical samples before committing to a Bulk Order?",
    answer:
      "Yes. Sample approval is Phase 02 of every Manufacturing Programme. Bulk production starts only after physical samples are inspected and signed off.",
  },
  {
    question: "What languages can we work in?",
    answer:
      "Alma works directly with Clients in Spanish, English, and Portuguese, while Shirish coordinates directly on the ground across India.",
  },
  {
    question:
      "Can you work with both independent retailers and larger retail chains?",
    answer:
      "Yes, provided the intended Bulk Order quantity and product scope fit a Manufacturing Partner's realistic line capacity, which we evaluate transparently from the first call.",
  },
  {
    question: "Can we visit Manufacturing Partners in India?",
    answer:
      "Visits to workshops and Manufacturing Partners in India can be discussed and arranged around active Manufacturing Programmes.",
  },
] as const;

export default function ManufacturingProgrammePage() {
  return (
    <>
      <main className="programme-detail" id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <h1 className="text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium break-words text-[var(--color-forest-deep)]">
                The Manufacturing Programme
              </h1>
              <p className="lead max-w-[46ch] text-[var(--color-ink-2)]">
                It starts with a call about what you want to make. We then
                assess what it would take to produce in India and send you a
                proposal.
              </p>
              <div className="flex flex-wrap items-center gap-6 pt-2">
                <Link className="primary-button" href="/product-brief">
                  Start a Product Brief
                </Link>
                <Link
                  className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  href="/working-across-distance"
                >
                  How we work across distance
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <figure className="m-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]">
                <video
                  aria-label="Product Brief and material bench, with close-ups of hands working with patterns, leather and fabric"
                  autoPlay
                  className="block aspect-[3/4] w-full object-cover"
                  loop
                  muted
                  playsInline
                  poster="/media/product-brief-material-bench.webp"
                  src="/media/product-brief-material-bench.mp4"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container">
            <p className="max-w-[32ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-s)] leading-[1.12]">
              The same team that takes your Product Brief follows the work
              through sample approval, production and Bulk Order delivery.
            </p>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                What we make
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              {productCategories.map((category) => (
                <article
                  key={category.name}
                  className="grid content-start gap-5"
                >
                  <MediaPlaceholder
                    kind="Photo"
                    ratio="4:5 portrait"
                    aspectClass="aspect-[4/5]"
                    tone="light"
                    title={category.slotTitle}
                    description={category.slotDescription}
                  />
                  <h3 className="text-[length:var(--text-2xl)] font-medium">
                    {category.name}
                  </h3>
                  <p className="text-[var(--color-muted)]">
                    {category.summary}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <PhaseJourney />

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-md)] lg:col-span-6">
                <h2 className="max-w-[15ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                  How we choose a workshop
                </h2>
                <p className="text-[var(--color-ink-2)]">
                  An independent retailer commissioning a first capsule needs a
                  different workshop setup from a retailer placing a high-volume
                  repeat Bulk Order. Alma and Shirish visit workshops in India
                  to see which ones fit the work.
                </p>
              </div>
              <div className="lg:col-span-6">
                <figure className="m-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-forest)]/25 bg-[var(--color-paper)]">
                  <video
                    aria-label="A workshop visit, from an aerial approach to the sewing room and Shirish reviewing fabric with the team"
                    autoPlay
                    className="aspect-[16/9] h-full w-full object-cover"
                    loop
                    muted
                    playsInline
                    poster="/warehouse visit images/manufacturing-partner-visit-edit.webp"
                    preload="metadata"
                    src="/warehouse visit images/manufacturing-partner-visit-edit.mp4"
                  />
                </figure>
              </div>
            </div>

            <dl className="m-0 grid gap-[var(--gap-columns)] sm:grid-cols-2 lg:grid-cols-4">
              {selectionCriteria.map((item) => (
                <div
                  key={item.title}
                  className="grid content-start gap-3 border-t border-[var(--color-forest)]/25 pt-5"
                >
                  <dt className="text-[length:var(--text-title)] font-medium">
                    {item.title}
                  </dt>
                  <dd className="m-0 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    {item.body}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                What we agree before production
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              <article className="grid content-start gap-3 border-t border-[var(--color-rule)] pt-5">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  The reference sample
                </h3>
                <p className="text-[var(--color-muted)]">
                  Before packing, we check the Bulk Order against the sample you
                  approved. We look at stitching, colour, hardware and
                  finishing.
                </p>
              </article>

              <article className="grid content-start gap-3 border-t border-[var(--color-rule)] pt-5">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  Testing and market documentation
                </h3>
                <p className="text-[var(--color-muted)]">
                  The Product Brief records what your product and destination
                  require, such as lab tests, fibre labels, care instructions
                  and export documents.
                </p>
              </article>

              <article className="grid content-start gap-3 border-t border-[var(--color-rule)] pt-5">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  Order quantities and lead times
                </h3>
                <p className="text-[var(--color-muted)]">
                  Custom hardware or dyeing can affect minimum quantities and
                  lead times. We discuss both on the first call, taking material
                  availability and workshop capacity into account.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                Before you start
              </h2>
            </div>

            <dl className="m-0 grid gap-6 md:grid-cols-2">
              {commonQuestions.map((item) => (
                <div
                  key={item.question}
                  className="grid content-start gap-3 border-t border-[var(--color-rule-2)]/45 pt-5"
                >
                  <dt className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.22] font-medium">
                    {item.question}
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <h2 className="max-w-[13ch] text-[length:var(--text-display)] leading-[1.02] font-medium text-[var(--color-paper)]">
                Let&apos;s look at your product.
              </h2>
              <p className="lead text-[var(--color-paper-2)]">
                Tell us what you want to make and how far along you are.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 lg:col-span-5 lg:justify-end">
              <Link className="primary-button" href="/product-brief">
                Start a Product Brief
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
