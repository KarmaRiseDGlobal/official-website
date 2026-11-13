import type { Metadata } from "next";
import Link from "next/link";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Women's Training Initiative",
  description:
    "A planned programme by KarmaRise D Global to train women in Maharashtra in garment design and stitching, with employment opportunities as a long-term aim.",
};

const trainingPillars = [
  {
    number: "01",
    title: "Stitching and garment construction",
    body: "Industrial and studio machine handling, seam consistency, pressing, and finishing standards expected in export-ready and contemporary garment making.",
    slotTitle: "Machine stitching bench",
    slotDescription:
      "4:5 portrait photo of hands guiding fabric carefully under a sewing machine presser foot, with clear daylight on the seam line.",
  },
  {
    number: "02",
    title: "Garment design and pattern literacy",
    body: "Learning how garments are drafted, measured, laid onto woven fabric or existing sarees, and adjusted for fit so trainees build creative understanding alongside technical speed.",
    slotTitle: "Pattern drafting and drape study",
    slotDescription:
      "4:5 portrait photo of pattern drafting paper, French curve, tailor's chalk, and fabric draped on a dress form.",
  },
  {
    number: "03",
    title: "Pathways toward employment",
    body: "Long-term aim: connecting trained women to real income opportunities through future Almarise production, KarmaRise D Global studio work, or partner garment workshops in Maharashtra.",
    slotTitle: "Collaborative garment review",
    slotDescription:
      "4:5 portrait photo of two women collaborating at a garment inspection table, checking a finished sleeve or hem together.",
  },
] as const;

const roadmapStages = [
  {
    stage: "Now",
    title: "Commercial and studio groundwork",
    body: "Growing KarmaRise D Global's Manufacturing Programmes and developing Almarise in Maharashtra so real garment work exists to anchor future training.",
  },
  {
    stage: "Next",
    title: "Curriculum and workshop readiness",
    body: "Structuring training modules, selecting qualified instructors and master tailors, and preparing safe, accessible workspace infrastructure in Maharashtra.",
  },
  {
    stage: "Long-term aim",
    title: "First training cohorts and work links",
    body: "Opening initial training cohorts for women in Maharashtra and connecting graduates with realistic employment opportunities.",
  },
] as const;

export default function WomensTrainingInitiativePage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-lg)]">
              <p className="section-index">Planned initiative · Maharashtra</p>
              <h1 className="max-w-[13ch] text-[clamp(3.75rem,7.5vw,7.5rem)] leading-[0.88] font-medium">
                Garment design and stitching skills built toward real work.
              </h1>
              <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
                KarmaRise D Global is planning a structured training initiative
                in Maharashtra to equip women with garment design and stitching
                skills, with dignified employment opportunities as the long-term
                aim.
              </p>
              <p className="w-fit rounded-[var(--radius-pill)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-5 py-2 text-[length:var(--text-sm)] font-medium text-[var(--color-forest-deep)]">
                Current status: in the planning stage, not yet open for student
                intake.
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
            <p className="section-index text-[var(--color-clay-light)]">
              The intention
            </p>
            <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[0.94] font-medium text-[var(--color-paper)]">
              Training matters most when it leads to real workshops and fair
              pay.
            </h2>
            <p className="lead max-w-[58ch] text-[var(--color-paper-2)]">
              Working across garment units in Maharashtra showed Shirish and
              Alma a persistent gap: everyday talent exists everywhere, yet
              accessible training that connects foundational stitching with
              modern design understanding and steady paid work is rare.
            </p>
            <p className="max-w-[58ch] text-[var(--color-paper-2)]/85">
              We are planning this initiative inside KarmaRise D Global rather
              than as an external charity or NGO, so skills taught at the bench
              stay tied to real production standards.
            </p>
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <p className="section-index">Three pillars</p>
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                From basic machine control to finished garments.
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-3">
              {trainingPillars.map((pillar) => (
                <article
                  key={pillar.number}
                  className="grid content-start gap-4"
                >
                  <MediaPlaceholder
                    kind="Photo"
                    ratio="4:5 portrait"
                    aspectClass="aspect-[4/5]"
                    tone="light"
                    title={pillar.slotTitle}
                    description={pillar.slotDescription}
                  />
                  <span className="num text-[length:var(--text-sm)] font-semibold text-[var(--color-clay-ink)]">
                    {pillar.number}
                  </span>
                  <h3 className="text-[length:var(--text-2xl)] font-medium">
                    {pillar.title}
                  </h3>
                  <p className="text-[var(--color-muted)]">{pillar.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <p className="section-index">Current stage</p>
              <h2 className="max-w-[17ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Building the foundation before opening doors.
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
              <p className="section-index">Stay connected</p>
              <h2 className="max-w-[18ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Pattern masters, educators, or local collaborators in
                Maharashtra.
              </h2>
              <p className="max-w-[54ch] text-[var(--color-ink-2)]">
                While applications are not open yet, we welcome conversations
                with experienced garment trainers, pattern makers, and local
                collaborators in Maharashtra who share this aim.
              </p>
            </div>
            <div className="grid gap-4 lg:col-span-5">
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/contact"
              >
                Write to us via Contact
              </Link>
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/stories"
              >
                Follow Company Progress Stories
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
