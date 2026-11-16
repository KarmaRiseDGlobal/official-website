import type { Metadata } from "next";
import Link from "next/link";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Women's Training Initiative",
  description:
    "A planned programme by KarmaRise D Global to train women in Maharashtra in garment design and stitching, with employment opportunities as a long-term aim.",
};

const trainingTopics = [
  {
    title: "At the sewing machine",
    body: "Practise guiding fabric through studio and industrial machines, keeping a seam even, pressing it and finishing the inside of a garment.",
    slotTitle: "Machine stitching bench",
    slotDescription:
      "4:5 portrait photo of hands guiding fabric carefully under a sewing machine presser foot, with clear daylight on the seam line.",
  },
  {
    title: "At the cutting table",
    body: "Draft a pattern, place it on woven cloth or an existing saree, then adjust the fit and see what that changes in the finished piece.",
    slotTitle: "Pattern drafting and drape study",
    slotDescription:
      "4:5 portrait photo of pattern drafting paper, French curve, tailor's chalk, and fabric draped on a dress form.",
  },
] as const;

const roadmapStages = [
  {
    stage: "Now",
    title: "Build up garment work",
    body: "We are developing Almarise in Maharashtra and growing KarmaRise D Global's Manufacturing Programmes. That work will help shape what we teach.",
  },
  {
    stage: "Next",
    title: "Prepare the workshop",
    body: "We plan to develop lessons, find instructors and master tailors, and set up a safe, accessible place to learn in Maharashtra.",
  },
  {
    stage: "Long-term aim",
    title: "Open training and connect graduates with work",
    body: "The aim is to help graduates find paid work through future Almarise production, KarmaRise D Global studio work or partner garment workshops in Maharashtra.",
  },
] as const;

export default function WomensTrainingInitiativePage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-lg)]">
              <h1 className="max-w-[18ch] text-[clamp(2.5rem,5.6vw,5.25rem)] leading-[0.98] font-medium">
                Women&apos;s Training Initiative
              </h1>
              <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
                We&apos;re planning garment design and stitching training for
                women in Maharashtra, with paid work as the long-term aim.
              </p>
              <p className="text-[length:var(--text-sm)] font-semibold">
                Applications have yet to open.
              </p>
            </div>

            <MediaPlaceholder
              kind="Photo or video"
              ratio="16:10 horizontal"
              aspectClass="aspect-[16/10]"
              tone="light"
              title="Sunlit Maharashtra garment workspace"
              description="Calm horizontal daylight photograph of a garment studio in Maharashtra with a sewing machine, dress form, measuring tape, and folded fabric waiting on a worktable."
            />
          </div>
        </section>

        <section className="bg-[var(--color-forest-deep)] py-[var(--section-gap)] text-[var(--color-paper)]">
          <div className="container grid gap-[var(--space-xl)]">
            <p className="max-w-[32ch] font-[family-name:var(--font-display)] text-[length:var(--text-display-s)] leading-[1.12] text-[var(--color-paper)]">
              The idea came out of garment workshops in Maharashtra. Alma and
              Shirish saw how hard it could be to find training that teaches
              both stitching and design and gives women a route into paid work.
            </p>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                What the training would cover
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              {trainingTopics.map((topic) => (
                <article key={topic.title} className="grid content-start gap-4">
                  <MediaPlaceholder
                    kind="Photo"
                    ratio="4:5 portrait"
                    aspectClass="aspect-[4/5]"
                    tone="light"
                    title={topic.slotTitle}
                    description={topic.slotDescription}
                  />
                  <h3 className="text-[length:var(--text-2xl)] font-medium">
                    {topic.title}
                  </h3>
                  <p className="text-[var(--color-muted)]">{topic.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[17ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                What needs to happen first
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              {roadmapStages.map((item) => (
                <article
                  key={item.stage}
                  className="grid content-start gap-3 border-t border-[var(--color-rule-2)]/45 pt-5"
                >
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    {item.stage}
                  </p>
                  <h3 className="text-[length:var(--text-2xl)] font-medium">
                    {item.title}
                  </h3>
                  <p className="text-[var(--color-muted)]">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-pale-sage)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-4 lg:col-span-7">
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                Help shape the training
              </h2>
              <p className="max-w-[54ch] text-[var(--color-ink-2)]">
                We&apos;d like to hear from garment trainers, pattern makers and
                others in Maharashtra who could help develop the programme.
              </p>
            </div>
            <div className="grid gap-4 lg:col-span-5">
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/contact"
              >
                Contact us about the initiative
              </Link>
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/stories"
              >
                Read company updates
              </Link>
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/almarise"
              >
                Learn about Almarise
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
