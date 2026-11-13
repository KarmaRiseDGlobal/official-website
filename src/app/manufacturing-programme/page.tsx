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
      "Structured leather bags, soft carryalls, small leather goods, canvas and leather combinations, hardware sourcing, and custom linings developed with specialist workshops.",
    slotTitle: "Leather goods and hardware bench",
    slotDescription:
      "Portrait photo (4:5): unrolled vegetable-tanned or drum-dyed leather hides beside brass hardware, edge-painted straps, and a partially stitched bag body on a workbench.",
  },
  {
    name: "Garments and clothing",
    summary:
      "Woven apparel, small-to-mid and scaled cut-and-sew runs, seasonal capsule collections, patterned textiles, and tailored finishes matched to specialized garment units.",
    slotTitle: "Garment draping and pattern adjustment",
    slotDescription:
      "Portrait photo (4:5): a pattern maker or seamstress adjusting draped woven fabric on a dress form or sewing machine inside a bright Indian studio.",
  },
  {
    name: "Custom and adjacent products",
    summary:
      "If your retail store or brand needs another sewn, textile, or crafted item produced in India, we evaluate technical feasibility and Manufacturing Partner fit during the Product Brief review.",
    slotTitle: "Material studies and trim prototypes",
    slotDescription:
      "Portrait photo (4:5): tactile material studies, woven fabrics, trims, buttons, woven labels, and packaging prototypes arranged on pale wood or linen.",
  },
] as const;

const selectionCriteria = [
  {
    number: "01",
    title: "Product and material specialization",
    body: "Matching each Product Brief with workshops that already excel in the specific construction and material requested.",
  },
  {
    number: "02",
    title: "Realistic capacity for your Bulk Order",
    body: "Aligning order volume with factory line minimums so small runs are not pushed aside and larger runs stay on schedule.",
  },
  {
    number: "03",
    title: "Willingness to iterate during sampling",
    body: "Selecting partners who engage openly on sample revisions and construction tolerances before bulk material is cut.",
  },
  {
    number: "04",
    title: "Direct site verification",
    body: "Evaluating workshops through in-person visits across India rather than picking names from online directories.",
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
              <p className="section-index">The Manufacturing Programme</p>
              <h1 className="max-w-[8ch] text-[clamp(4rem,8vw,8.5rem)] leading-[0.86] font-medium text-[var(--color-forest-deep)]">
                How do we do it?
              </h1>
              <p className="lead max-w-[46ch] text-[var(--color-ink-2)]">
                Write to us or give us a call. We schedule a video conversation
                to get to know each other, hear about your project, evaluate it
                and prepare a proposal.
              </p>
              <p className="max-w-[52ch] text-[var(--color-muted)]">
                Once the proposal is approved, we stay directly involved from
                first design review through Bulk Order delivery.
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
                  className="block aspect-[3/4] w-full object-cover"
                  controls
                  loop
                  muted
                  playsInline
                  poster="/media/product-brief-material-bench.webp"
                  preload="none"
                  src="/media/product-brief-material-bench.mp4"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <p className="section-index">Ownership across the whole run</p>
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                One accountable programme instead of fragmented sourcing.
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              <article className="grid content-start gap-4 border-t border-[var(--color-rule-2)]/45 pt-6">
                <h3 className="text-[length:var(--text-2xl)] font-medium">
                  What a Manufacturing Programme is
                </h3>
                <p className="text-[var(--color-ink-2)]">
                  KarmaRise D Global turns a Client&apos;s Product Brief into a
                  managed Manufacturing Programme. We match the product to a
                  suitable Indian Manufacturing Partner, oversee design
                  translation, validate samples, monitor production on the
                  floor, and keep delivery responsibilities clear.
                </p>
              </article>

              <article className="grid content-start gap-4 border-t border-[var(--color-rule-2)]/45 pt-6">
                <h3 className="text-[length:var(--text-2xl)] font-medium">
                  What we avoid
                </h3>
                <p className="text-[var(--color-muted)]">
                  We do not hand you a list of factory contacts and step away,
                  and we do not treat manufacturing as a blind price auction.
                  You keep a single working relationship from specification to
                  final dispatch.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <p className="section-index">Product categories</p>
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Built around physical goods that depend on materials and make.
              </h2>
              <p className="lead text-[var(--color-muted)]">
                Our Manufacturing Programmes focus on categories where material
                selection, construction detail, and handwork decide whether the
                final product belongs on your shelf.
              </p>
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
                <p className="section-index">Partner matching</p>
                <h2 className="max-w-[15ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                  Not every factory fits every Product Brief.
                </h2>
                <p className="text-[var(--color-ink-2)]">
                  A European independent retailer commissioning an initial
                  capsule needs a different workshop setup from a retail chain
                  placing a high-volume repeat Bulk Order. Shirish and Alma
                  travel across India to meet Manufacturing Partners in person
                  and match each programme to a unit suited to its material,
                  tooling, quality level, and quantity.
                </p>
              </div>
              <div className="lg:col-span-6">
                <figure className="m-0 overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-forest)]/25 bg-[var(--color-paper)]">
                  <video
                    aria-label="Shirish and Alma visiting an Indian Manufacturing Partner workshop and reviewing textile and sewing benches with a floor supervisor"
                    autoPlay
                    className="aspect-[16/9] h-full w-full object-cover"
                    loop
                    muted
                    playsInline
                    poster="/warehouse visit images/working_together.jpeg"
                    preload="metadata"
                    src="/warehouse visit images/manufacturing-partner-floor-visit.mp4"
                  />
                </figure>
              </div>
            </div>

            <ol className="m-0 grid list-none gap-[var(--gap-columns)] p-0 sm:grid-cols-2 lg:grid-cols-4">
              {selectionCriteria.map((item) => (
                <li
                  key={item.number}
                  className="grid content-start gap-3 border-t border-[var(--color-forest)]/25 pt-5"
                >
                  <span className="num text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-ink)]">
                    {item.number}
                  </span>
                  <h3 className="text-[length:var(--text-title)] font-medium">
                    {item.title}
                  </h3>
                  <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <p className="section-index">Before bulk production begins</p>
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Testing, compliance and quantities scoped upfront.
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              <article className="grid content-start gap-3 border-t border-[var(--color-rule)] pt-5">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  Quality inspections
                </h3>
                <p className="text-[var(--color-muted)]">
                  Every Bulk Order is checked against the approved reference
                  sample, covering stitching, colour consistency, hardware
                  function, and finishing before packing.
                </p>
              </article>

              <article className="grid content-start gap-3 border-t border-[var(--color-rule)] pt-5">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  Testing and market documentation
                </h3>
                <p className="text-[var(--color-muted)]">
                  Requirements differ by product and destination country. Lab
                  testing, fibre composition labels, care instructions, and
                  export documentation are scoped around the product and market
                  inside the Product Brief before production starts.
                </p>
              </article>

              <article className="grid content-start gap-3 border-t border-[var(--color-rule)] pt-5">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  Order quantities and lead times
                </h3>
                <p className="text-[var(--color-muted)]">
                  Minimums and timelines depend on material sourcing, custom
                  hardware or dyeing, and factory capacity. We discuss realistic
                  quantities and schedule milestones during the first evaluation
                  call instead of hiding behind generic estimates.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="programme-persistence">
          <div className="programme-persistence-inner container">
            <p className="section-index">One little flaw</p>
            <h2>We are incredibly persistent.</h2>
            <p className="lead">
              We stay by the client&apos;s side through every phase so no detail
              is left unsupervised.
            </p>
            <p className="max-w-[54ch] text-[var(--color-paper-2)]">
              In daily work, persistence means checking dye batches, comparing
              sample revisions side by side against written notes, and catching
              stitch or hardware drift before bulk materials are cut.
            </p>
          </div>
        </section>

        <section className="programme-missions">
          <div className="programme-missions-inner container">
            <article>
              <p className="section-index">Your mission</p>
              <h2>Create, sell and build customer loyalty.</h2>
              <p className="max-w-[44ch] text-[var(--color-paper-2)]">
                Your energy belongs with your collection, your retail spaces,
                and the customers who trust your label.
              </p>
            </article>
            <article>
              <p className="section-index">Our mission</p>
              <h2>Give you peace of mind through transparency and trust.</h2>
              <p className="max-w-[44ch] text-[var(--color-paper-2)]">
                You know what stage your product is in, what decisions were
                agreed, and who is standing in the workshop checking the result.
              </p>
            </article>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <p className="section-index">Before we begin</p>
              <h2 className="max-w-[20ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Common questions about starting a Manufacturing Programme.
              </h2>
            </div>

            <dl className="m-0 grid gap-6 md:grid-cols-2">
              {commonQuestions.map((item) => (
                <div
                  key={item.question}
                  className="grid content-start gap-3 border-t border-[var(--color-rule-2)]/45 pt-5"
                >
                  <dt className="font-[family-name:var(--font-display)] text-[length:var(--text-xl)] leading-[1.15] font-medium">
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
              <p className="section-index text-[var(--color-clay-light)]">
                One conversation away
              </p>
              <h2 className="max-w-[12ch] text-[length:var(--text-display)] leading-[0.92] font-medium text-[var(--color-paper)]">
                Ever thought about taking this leap?
              </h2>
              <p className="lead text-[var(--color-paper-2)]">
                Tell us what you want to make and what stage your idea is at. We
                will schedule a video conversation to review it together.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-6 lg:col-span-5 lg:justify-end">
              <Link className="primary-button" href="/product-brief">
                Start your Product Brief
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
