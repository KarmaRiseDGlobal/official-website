import type { Metadata } from "next";
import Link from "next/link";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Almarise",
  description:
    "Almarise is a fashion brand owned by KarmaRise D Global that will transform existing Maharashtrian sarees into contemporary women's clothing.",
};

const transformationSteps = [
  {
    number: "01",
    title: "Saree selection",
    body: "Existing silk, cotton, and blended sarees in Maharashtra are examined individually for weave strength, colour harmony, and intact borders.",
    slotTitle: "Inspecting existing sarees",
    slotDescription:
      "4:3 photograph of hands inspecting folded Maharashtrian sarees and checking border weave strength in natural daylight.",
  },
  {
    number: "02",
    title: "Pattern and placement",
    body: "Patterns are laid out around the pallu and woven borders so the original work frames collars, cuffs, hems, or drape without needless offcuts.",
    slotTitle: "Cutting layout around woven borders",
    slotDescription:
      "4:3 photograph of pattern paper pinned directly across a patterned saree on a wooden cutting table.",
  },
  {
    number: "03",
    title: "Tailoring and finish",
    body: "Garments are stitched in Maharashtra with clean internal finishes, practical closures, and silhouettes designed to pair effortlessly with modern everyday wear.",
    slotTitle: "Studio stitching and seam finish",
    slotDescription:
      "4:3 photograph of an artisan sewing a garment hem or finishing an interior seam on a sewing machine.",
  },
] as const;

const lookbookSlots = [
  {
    title: "Look 01: Full-length saree silhouette",
    description:
      "3:4 portrait photo: full-length outdoor editorial look wearing an asymmetric tunic or dress tailored from a patterned Indian saree in motion.",
  },
  {
    title: "Look 02: Everyday European street styling",
    description:
      "3:4 portrait photo: seated street portrait pairing a bright orange and yellow patterned saree kimono or wrap with relaxed denim.",
  },
  {
    title: "Look 03: Border and stitch detail",
    description:
      "3:4 portrait photo: close editorial frame highlighting woven border placement along a cuff, neckline, or pocket edge.",
  },
] as const;

export default function AlmarisePage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-forest-deep)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-paper)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid items-end gap-[var(--gap-columns)] lg:grid-cols-12">
              <div className="grid gap-[var(--space-lg)] lg:col-span-7">
                <p className="section-index text-[var(--color-clay-light)]">
                  Owned by KarmaRise D Global
                </p>
                <h1 className="max-w-[11ch] text-[clamp(3.75rem,7.5vw,7.5rem)] leading-[0.88] font-medium text-[var(--color-paper)]">
                  Existing Maharashtrian sarees. Contemporary women&apos;s
                  clothing.
                </h1>
              </div>
              <div className="grid gap-4 lg:col-span-5">
                <p className="lead text-[var(--color-paper-2)]">
                  Almarise is KarmaRise D Global&apos;s own fashion brand,
                  taking existing sarees from Maharashtra and reshaping them
                  into contemporary garments made to be worn every day.
                </p>
                <p className="text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-light)]">
                  In development. Part of the wider KarmaRise D Global story.
                </p>
              </div>
            </div>

            <MediaPlaceholder
              kind="Photo or video"
              ratio="16:10 horizontal or 6s silent loop"
              aspectClass="aspect-[16/10]"
              tone="dark"
              title="Almarise hero lookbook frame"
              description="Full-width portrait or 6-second silent fashion film clip of a woman wearing contemporary outerwear or a dress tailored from a patterned Maharashtrian saree in natural European daylight."
            />
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-lg)] lg:col-span-6">
              <p className="section-index">Why existing sarees</p>
              <h2 className="max-w-[15ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Cloth that already carries skill deserves a second silhouette.
              </h2>
              <p className="text-[var(--color-ink-2)]">
                Across Maharashtra, sarees hold generations of weaving, border
                work, dyeing, and hand skill. Many sit unworn in cupboards for
                decades despite intact fabric and remarkable pattern.
              </p>
              <p className="text-[var(--color-muted)]">
                Almarise starts from those existing sarees instead of
                commissioning new yardage, transforming each piece into
                contemporary women&apos;s clothing while keeping the original
                textile&apos;s character intact.
              </p>
            </div>

            <div className="lg:col-span-6">
              <MediaPlaceholder
                kind="Photo"
                ratio="4:5 portrait"
                aspectClass="aspect-[4/5]"
                tone="light"
                title="Maharashtrian saree border study"
                description="4:5 close-up texture photograph of a draped woven saree border resting beside tailor's chalk and shears on a cutting table."
              />
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <p className="section-index">How pieces are made</p>
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Every garment begins with the border and weave in front of us.
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              {transformationSteps.map((step) => (
                <article key={step.number} className="grid content-start gap-4">
                  <MediaPlaceholder
                    kind="Photo"
                    ratio="4:3 horizontal"
                    aspectClass="aspect-[4/3]"
                    tone="dune"
                    title={step.slotTitle}
                    description={step.slotDescription}
                  />
                  <span className="num text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-ink)]">
                    {step.number}
                  </span>
                  <h3 className="text-[length:var(--text-2xl)] font-medium">
                    {step.title}
                  </h3>
                  <p className="text-[var(--color-muted)]">{step.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <p className="section-index">Early garment studies</p>
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Between Maharashtra and Madrid.
              </h2>
              <p className="lead text-[var(--color-muted)]">
                These pieces place traditional Indian borders, block prints, and
                bandhani patterns into relaxed, structured silhouettes worn
                across everyday European streets.
              </p>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              {lookbookSlots.map((slot) => (
                <MediaPlaceholder
                  key={slot.title}
                  kind="Photo"
                  ratio="3:4 portrait"
                  aspectClass="aspect-[3/4]"
                  tone="light"
                  title={slot.title}
                  description={slot.description}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-md)] lg:col-span-7">
              <p className="section-index">Wider company story</p>
              <h2 className="max-w-[15ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                One company. Two connected paths.
              </h2>
              <p className="text-[var(--color-ink-2)]">
                Almarise is owned by KarmaRise D Global and sits alongside our
                Manufacturing Programmes. Creating our own brand keeps us
                hands-on with fabric sourcing, garment construction, and quality
                standards, while helping build the Maharashtra workshop
                ecosystem connected to our planned Women&apos;s Training
                Initiative.
              </p>
            </div>

            <div className="grid gap-4 lg:col-span-5">
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/manufacturing-programme"
              >
                Looking to manufacture your own brand&apos;s products? Explore
                the Manufacturing Programme
              </Link>
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/womens-training-initiative"
              >
                Read about the planned Women&apos;s Training Initiative
              </Link>
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/contact"
              >
                Follow progress or reach out about Almarise
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
