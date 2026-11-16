import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { HeroVideo } from "@/components/hero-video";
import { MediaPlaceholder } from "@/components/media-placeholder";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Working across distance",
  description:
    "How Alma in Spain and Shirish in India keep European Clients connected to Indian Manufacturing Partners from the Product Brief through Bulk Order delivery.",
};

const principlesInPractice = [
  {
    title: "A correction comes in from Europe",
    practice:
      "You talk through the change with Alma in your preferred language. Shirish takes it to the pattern maker or workshop in India, using the same Product Brief.",
    image: "/warehouse visit images/at_the_plant.jpeg",
    imageAlt:
      "A group reviewing leather and finished bags during a factory visit",
  },
  {
    title: "The workshop needs a colour to match",
    practice:
      "We put the colour reference in the Product Brief, alongside the material, dimensions and tolerances. That gives the workshop something precise to check before it orders bulk materials.",
    image: "/warehouse visit images/working.jpeg",
    imageAlt: "Two people reviewing patterned textiles at a worktable",
  },
  {
    title: "A seam needs reinforcing",
    practice:
      "We look at the seam on site with the Manufacturing Partner. If the construction needs to change, we agree on the adjustment with you before production moves ahead.",
    image: "/warehouse visit images/working_together.jpeg",
    imageAlt: "People working with garments in a production studio",
  },
  {
    title: "The Bulk Order has a launch date to meet",
    practice:
      "We discuss feasible quantities, packing and who handles delivery at the proposal stage. You can plan your launch and budget around what the workshop can deliver.",
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
    title: "Physical samples",
    body: "We send samples to your team in Europe so you can test them before approving the Bulk Order.",
  },
  {
    title: "Photos and video from the workshop",
    body: "See materials as they arrive, the first pieces off the line and how the finished order is packed.",
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
                <h1 className="max-w-[16ch] text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium text-[var(--color-paper)]">
                  Working across distance
                </h1>
              </div>
              <p className="lead text-[var(--color-paper-2)] lg:col-span-5">
                If you change a detail in Spain, who checks it on the workshop
                floor in India? Alma and Shirish keep that conversation
                connected through one Product Brief.
              </p>
            </div>

            <HeroVideo
              className="m-0 overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-night)]"
              videoClassName="block aspect-video w-full object-cover"
              label="A worktable with textiles, leather swatches, and an open sketchbook"
              poster="/media/working-desk-connecting-two-continents.webp"
              src="/media/working-desk-connecting-two-continents.mp4"
            />
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[20ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                Who you work with
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              <article className="grid content-start gap-5">
                <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-2)]">
                  <Image
                    src="/founders/alma-reviewing-garment-spain.webp"
                    alt="Alma comparing material samples beside a stack of fabric swatches"
                    fill
                    className="object-cover"
                    sizes="(max-width: 48rem) 100vw, 48vw"
                  />
                </figure>
                <h3 className="text-[length:var(--text-2xl)] font-medium">
                  Alma in Spain
                </h3>
                <p className="text-[var(--color-muted)]">
                  You can speak with Alma in Spanish, English or Portuguese. She
                  brings the details that matter to your retail team, such as
                  fit, finish and launch dates, into the Product Brief.
                </p>
              </article>

              <article className="grid content-start gap-5">
                <figure className="relative m-0 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-2)]">
                  <Image
                    src="/founders/shirish-reviewing-leather-india.webp"
                    alt="Shirish inspecting a leather seam at a workshop table"
                    fill
                    className="object-cover"
                    sizes="(max-width: 48rem) 100vw, 48vw"
                  />
                </figure>
                <h3 className="text-[length:var(--text-2xl)] font-medium">
                  Shirish in India
                </h3>
                <p className="text-[var(--color-muted)]">
                  Shirish works directly with Manufacturing Partners and
                  artisans. A lawyer by training, he works through agreements
                  and material commitments with the workshops where samples and
                  Bulk Orders are made.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid gap-[var(--space-3xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.02] font-medium text-[var(--color-paper)]">
                Decisions between Spain and India
              </h2>
            </div>

            <div className="grid gap-[var(--space-3xl)]">
              {principlesInPractice.map((item, index) => (
                <article
                  key={item.title}
                  className="grid items-center gap-[var(--gap-columns)] border-t border-[var(--color-paper)]/15 pt-[var(--space-2xl)] lg:grid-cols-12"
                >
                  <div
                    className={`grid gap-4 lg:col-span-6 ${index % 2 === 1 ? "lg:order-2" : ""}`}
                  >
                    <h3 className="text-[length:var(--text-2xl)] leading-[1.14] font-medium text-[var(--color-paper)]">
                      {item.title}
                    </h3>
                    <p className="max-w-[48ch] text-[length:var(--text-lg)] text-[var(--color-paper-2)]">
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
              <h2 className="max-w-[14ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                What you can see from Europe
              </h2>
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
              <HeroVideo
                className="m-0 overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper)]"
                videoClassName="block aspect-video w-full object-cover"
                label="Hands measuring a leather bag with a metal ruler beside an open notebook"
                poster="/media/measuring-leather-bag-and-garment.webp"
                src="/media/measuring-leather-bag-and-garment.mp4"
              />
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-wood)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-7">
              <h2 className="max-w-[13ch] text-[length:var(--text-display)] leading-[1.02] font-medium text-[var(--color-paper)]">
                Let&apos;s talk about your product.
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
