import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Working across distance",
  description:
    "How Alma in Spain and Shirish in India keep European Clients connected to Indian Manufacturing Partners from the Product Brief through Bulk Order delivery.",
};

const principlesInPractice = [
  {
    number: "01",
    title: "One conversation across countries",
    summary:
      "Alma works directly with clients in Spanish, English and Portuguese. Shirish works with manufacturing partners and artisans in India. The Product Brief remains the common reference between them.",
    practice:
      "In practice: you never relay corrections through an anonymous ticket desk. Feedback spoken in your language reaches the pattern maker or workshop floor through someone who understands both sides.",
    image: "/warehouse visit images/at_the_plant.jpeg",
    imageAlt:
      "A group reviewing leather and finished bags during a factory visit",
  },
  {
    number: "02",
    title: "A Product Brief the factory can work from",
    summary:
      "Design, materials, quantity, quality and delivery expectations are made clear before bulk production. Any documentation or testing scope can be agreed around the product being made.",
    practice:
      "In practice: ambiguity is the main cause of manufacturing disputes. Materials, colour references, tolerances, and packaging specs are agreed in writing before sampling turns into bulk buying.",
    image: "/warehouse visit images/working.jpeg",
    imageAlt: "Two people reviewing patterned textiles at a worktable",
  },
  {
    number: "03",
    title: "Production decisions remain connected",
    summary:
      "KarmaRise D Global stays involved while materials, samples and workmanship are reviewed. The client is not left to manage those conversations from a distance.",
    practice:
      "In practice: when a material batch differs slightly or a seam needs reinforcing, we inspect the issue on site with the Manufacturing Partner and align any decision with you before production advances.",
    image: "/warehouse visit images/working_together.jpeg",
    imageAlt: "People working with garments in a production studio",
  },
  {
    number: "04",
    title: "Quantities and delivery are discussed early",
    summary:
      "The intended order quantity, available flexibility and delivery responsibilities are considered before production begins, not after the product has already been committed.",
    practice:
      "In practice: delivery terms, packing requirements, and realistic Bulk Order quantities are agreed at the proposal stage so budgets and retail launch dates stay grounded.",
    image: null,
    imageAlt:
      "Finished packaged goods beside export cartons and a packing checklist prior to dispatch",
    placeholderTitle: "Bulk Order dispatch and packing verification",
    placeholderDescription:
      "Portrait photo (4:5): finished bags or garments packed cleanly beside labelled export cartons and an inspection sheet in a warehouse before shipping.",
  },
] as const;

const communicationHabits = [
  {
    title: "Scheduled video reviews",
    body: "Regular calls with Alma to walk through progress, sample adjustments, and open questions in Spanish, English, or Portuguese.",
  },
  {
    title: "Physical sample checkpoints",
    body: "Couriers send tangible prototypes to your team in Europe for hands-on testing before any Bulk Order is greenlit.",
  },
  {
    title: "Floor-level photo and video updates",
    body: "Direct visual documentation of material arrivals, first-piece runs, stitching quality, and pre-dispatch packing.",
  },
] as const;

export default function WorkingAcrossDistancePage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-forest-deep)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-paper)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-lg)] lg:col-span-7">
                <p className="section-index text-[var(--color-clay-light)]">
                  Working across distance
                </p>
                <h1 className="max-w-[11ch] text-[clamp(3.75rem,7.5vw,7.5rem)] leading-[0.88] font-medium text-[var(--color-paper)]">
                  Distance breaks products when nobody holds both ends.
                </h1>
              </div>
              <p className="lead text-[var(--color-paper-2)] lg:col-span-5">
                Designing in Europe and manufacturing in India fails when specs
                get translated three times and nobody checks the result on the
                floor. KarmaRise D Global keeps both sides in one continuous
                conversation.
              </p>
            </div>

            <MediaPlaceholder
              kind="Photo or video"
              ratio="16:9 wide"
              aspectClass="aspect-[16/9]"
              tone="dark"
              title="Two-continent working desk"
              description="Atmospheric wide photograph or slow silent loop showing Indian textiles and leather swatches beside a notebook or laptop, connecting a European design desk and an Indian workshop."
            />
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <p className="section-index">Spain and India</p>
              <h2 className="max-w-[20ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Local fluency on the client side. Legal and workshop presence on
                the making side.
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              <article className="grid content-start gap-5">
                <MediaPlaceholder
                  kind="Photo"
                  ratio="4:3 horizontal"
                  aspectClass="aspect-[4/3]"
                  tone="light"
                  title="Alma in Europe"
                  description="4:3 candid portrait of Alma on a video conversation or reviewing a garment and bag sample beside fabric swatches in natural European daylight."
                />
                <h3 className="text-[length:var(--text-2xl)] font-medium">
                  In Europe · Alma in Spain
                </h3>
                <p className="text-[var(--color-muted)]">
                  Clients work directly with Alma in Spanish, English or
                  Portuguese. She understands European retail expectations,
                  store calendars, fit and finish standards, and commercial
                  clarity. Nothing gets softened or lost when a Product Brief is
                  drafted.
                </p>
              </article>

              <article className="grid content-start gap-5">
                <MediaPlaceholder
                  kind="Photo"
                  ratio="4:3 horizontal"
                  aspectClass="aspect-[4/3]"
                  tone="light"
                  title="Shirish at an Indian workshop"
                  description="4:3 candid photograph of Shirish speaking with workshop staff or inspecting leather and stitching details on a factory floor in India."
                />
                <h3 className="text-[length:var(--text-2xl)] font-medium">
                  In India · Shirish in Maharashtra and across India
                </h3>
                <p className="text-[var(--color-muted)]">
                  Shirish works directly with Manufacturing Partners and
                  artisans in India. Trained as a lawyer, he approaches
                  agreements, material commitments, and workshop relationships
                  with precision, staying present where samples and bulk runs
                  are produced.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid gap-[var(--space-3xl)]">
            <div className="grid gap-[var(--space-md)]">
              <p className="section-index text-[var(--color-clay-light)]">
                Four working principles
              </p>
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[0.94] font-medium text-[var(--color-paper)]">
                How the Product Brief holds across timezones.
              </h2>
            </div>

            <div className="grid gap-[var(--space-3xl)]">
              {principlesInPractice.map((item, index) => (
                <article
                  key={item.number}
                  className="grid items-center gap-[var(--gap-columns)] border-t border-[var(--color-paper)]/15 pt-[var(--space-2xl)] lg:grid-cols-12"
                >
                  <div
                    className={`grid gap-4 lg:col-span-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <span className="num text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-light)]">
                      {item.number}
                    </span>
                    <h3 className="text-[length:var(--text-2xl)] leading-[1.08] font-medium text-[var(--color-paper)]">
                      {item.title}
                    </h3>
                    <p className="text-[length:var(--text-lg)] text-[var(--color-paper-2)]">
                      {item.summary}
                    </p>
                    <p className="border-t border-[var(--color-paper)]/15 pt-4 text-[var(--color-paper-2)]/85">
                      {item.practice}
                    </p>
                  </div>

                  <div
                    className={`lg:col-span-6 ${index % 2 === 1 ? "lg:order-1" : ""}`}
                  >
                    {item.image ? (
                      <figure className="relative m-0 aspect-[4/5] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-night)]">
                        <Image
                          src={item.image}
                          alt={item.imageAlt}
                          fill
                          className="object-cover"
                          sizes="(max-width: 64rem) 100vw, 48vw"
                        />
                      </figure>
                    ) : (
                      <MediaPlaceholder
                        kind="Photo"
                        ratio="4:5 portrait"
                        aspectClass="aspect-[4/5]"
                        tone="dark"
                        title={item.placeholderTitle}
                        description={item.placeholderDescription}
                      />
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-6">
              <p className="section-index">Visibility without guesswork</p>
              <h2 className="max-w-[14ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Seeing the work between milestones.
              </h2>
              <p className="text-[var(--color-ink-2)]">
                Distance feels risky only when silence sets in between deposit
                and delivery. Throughout your Manufacturing Programme, visual
                documentation and structured check-ins keep the factory floor
                legible from your office.
              </p>
              <ul className="m-0 grid list-none gap-5 p-0">
                {communicationHabits.map((habit) => (
                  <li
                    key={habit.title}
                    className="grid gap-1 border-t border-[var(--color-forest)]/25 pt-4"
                  >
                    <h3 className="text-[length:var(--text-title)] font-medium">
                      {habit.title}
                    </h3>
                    <p className="text-[length:var(--text-sm)] text-[var(--color-muted)]">
                      {habit.body}
                    </p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-6">
              <MediaPlaceholder
                kind="Video"
                ratio="4:5 or 5 to 8s silent loop"
                aspectClass="aspect-[4/5]"
                tone="sage"
                title="Sample measurement and inspection loop"
                description="Silent 5 to 8 second video loop (or 2-up photo pair) showing hands measuring a finished bag or garment with a metal ruler beside inspection notes in natural factory light."
              />
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <p className="section-index text-[var(--color-clay-light)]">
                Ready to review your project?
              </p>
              <h2 className="max-w-[13ch] text-[length:var(--text-display)] leading-[0.92] font-medium text-[var(--color-paper)]">
                Bring your product across the table.
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-6 lg:col-span-5 lg:justify-end">
              <Link className="primary-button" href="/product-brief">
                Start a Product Brief
              </Link>
              <Link
                className="font-semibold text-[var(--color-paper)] underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-clay-light)]"
                href="/manufacturing-programme"
              >
                See the Manufacturing Programme
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
