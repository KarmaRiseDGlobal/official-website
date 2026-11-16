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
    title: "Read the cloth",
    body: "We start with existing silk, cotton and blended sarees in Maharashtra. We check how strong the weave is and which parts of the border are intact.",
    slotTitle: "Inspecting existing sarees",
    slotDescription:
      "4:3 photograph of hands inspecting folded Maharashtrian sarees and checking border weave strength in natural daylight.",
  },
  {
    number: "02",
    title: "Place the pattern",
    body: "The pallu and woven borders help decide where to cut. A border can become a cuff or hem, with the pattern laid out to limit offcuts.",
    slotTitle: "Cutting layout around woven borders",
    slotDescription:
      "4:3 photograph of pattern paper pinned directly across a patterned saree on a wooden cutting table.",
  },
  {
    number: "03",
    title: "Make it wearable",
    body: "The plan is to stitch the garments in Maharashtra, with tidy seams and closures that make sense for everyday wear.",
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
                <h1 className="text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium text-[var(--color-paper)]">
                  Almarise
                </h1>
              </div>
              <div className="grid gap-4 lg:col-span-5">
                <p className="lead text-[var(--color-paper-2)]">
                  We&apos;re developing a fashion brand that turns existing
                  Maharashtrian sarees into contemporary clothes for women.
                </p>
                <p className="text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-light)]">
                  A fashion brand by KarmaRise D Global
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
              <h2 className="max-w-[15ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                What if the border became a cuff?
              </h2>
              <p className="text-[var(--color-ink-2)]">
                A saree can sit folded for years with its weave and pattern
                intact. Spread it out and look at where the dense border meets
                the body of the cloth. That edge can tell you where a sleeve
                should end.
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
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                How a saree becomes a garment
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
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                Garment studies
              </h2>
              <p className="lead text-[var(--color-muted)]">
                We&apos;re exploring how woven borders, block prints and
                bandhani might work in a tunic, a loose jacket or a dress.
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
              <h2 className="max-w-[15ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                At work in Maharashtra
              </h2>
              <p className="text-[var(--color-ink-2)]">
                Developing Almarise gives us first-hand experience choosing
                cloth, constructing garments and checking finish. In time, we
                hope that work can help create employment opportunities for
                women who take part in our planned training initiative.
              </p>
            </div>

            <div className="grid gap-4 lg:col-span-5">
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/manufacturing-programme"
              >
                Explore the Manufacturing Programme
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
                Ask us about Almarise
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
