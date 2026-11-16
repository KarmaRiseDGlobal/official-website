import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { MediaPlaceholder } from "@/components/media-placeholder";
import { SiteFooter } from "@/components/site-footer";

import styles from "./about.module.css";

export const metadata: Metadata = {
  title: "About",
  description:
    "The story of Alma and Shirish, the two founders connecting clients with Indian manufacturing through KarmaRise D Global.",
};

const companyPrinciples = [
  {
    title: "Say what is feasible early",
    body: "We flag material, quantity or timing problems before you commit money or set a launch date.",
  },
  {
    title: "Agree on clear terms with workshops",
    body: "A Manufacturing Partner needs fair terms and a specification they can work from. We agree both together.",
  },
  {
    title: "Stay involved after approval",
    body: "We follow the work through sampling, production and dispatch.",
  },
  {
    title: "Build for repeat work",
    body: "We want a client and workshop to be able to work together again on the next Bulk Order.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <main className={styles.about} id="main">
        <section className={styles.hero}>
          <div className={`${styles.heroInner} container`}>
            <div className={styles.heroCopy}>
              <h1>Alma and Shirish</h1>
              <p className={styles.heroIntro}>
                The founders of KarmaRise D Global work on both sides of a
                Product Brief, with clients in Europe and workshops across
                India.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.founder} id="alma">
          <div className={`${styles.founderGrid} container`}>
            <figure className={styles.founderPortrait}>
              <Image
                src="/founders/alma.jpeg"
                alt="Alma at a hillside overlook"
                fill
                sizes="(max-width: 60rem) 100vw, 50vw"
                priority
              />
            </figure>
            <div className={styles.founderCopy}>
              <h2>Alma</h2>
              <p className={styles.founderLead}>
                Alma built her own business and knows what it takes to start
                again after a setback.
              </p>
              <p className="max-w-[48ch] text-[var(--color-muted)]">
                From Spain, she asks clients what they want the product to do
                and what their customers expect. She turns those answers into a
                Product Brief and keeps the conversation going through sampling
                and production.
              </p>
              <dl className="m-0 grid gap-2 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)]">
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    Languages
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    Spanish, English, Portuguese
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className={`${styles.founder} ${styles.founderShirish}`}>
          <div className={`${styles.founderGrid} container`}>
            <div className={styles.founderCopy}>
              <h2>Shirish</h2>
              <p className={styles.founderLead}>
                A lawyer by profession, Shirish grew up with a strong sense of
                fairness informed by his Maratha heritage.
              </p>
              <p className="max-w-[48ch] text-[var(--color-muted)]">
                He visits workshops, talks through agreements with Manufacturing
                Partners and checks how the Product Brief holds up once
                there&apos;s a sample on the table.
              </p>
              <dl className="m-0 grid gap-2 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)]">
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    Based in
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    Ulhasnagar, Maharashtra, India
                  </dd>
                </div>
              </dl>
            </div>
            <figure
              className={`${styles.founderPortrait} ${styles.shirishPortrait}`}
            >
              <Image
                src="/shirish/shirish_clearest_image.png"
                alt="Shirish seated at his desk"
                fill
                sizes="(max-width: 60rem) 100vw, 50vw"
              />
            </figure>
          </div>
        </section>

        <section className={styles.origin}>
          <div className={`${styles.originStory} section-intro container`}>
            <h2>A flight to India</h2>
            <p className="lead">
              Alma and Shirish first connected over a shared interest in people
              and the different ways they live. A few months later she flew to
              India, where the two started the company.
            </p>
          </div>
        </section>

        <section className={styles.meaning}>
          <div className="container grid gap-[var(--space-2xl)]">
            <div className={styles.meaningGrid}>
              <div className={styles.meaningTitle}>
                <h2>Why KarmaRise?</h2>
              </div>
              <div className={styles.meaningCopy}>
                <p className={styles.largeCopy}>
                  For Alma and Shirish, the name reflects a belief that people
                  with good ideas should be able to make them with people they
                  trust.
                </p>
              </div>
            </div>

            <MediaPlaceholder
              kind="Photo"
              ratio="16:9 wide"
              aspectClass="aspect-[16/9]"
              tone="sage"
              title="Materials, notes and travel across Spain and India"
              description="Wide horizontal photograph showing textile books, leather swatches, and travel notes on a table where European design preparation meets Indian production."
            />
          </div>
        </section>

        <section className="bg-[var(--color-paper)] py-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                How we work with people
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              {companyPrinciples.map((principle) => (
                <article
                  key={principle.title}
                  className="grid content-start gap-3 border-t border-[var(--color-rule)] pt-5"
                >
                  <h3 className="text-[length:var(--text-title)] font-medium">
                    {principle.title}
                  </h3>
                  <p className="text-[var(--color-muted)]">{principle.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.india}>
          <div className="container grid gap-[var(--space-2xl)]">
            <div className={styles.indiaGrid}>
              <figure className={styles.indiaImage}>
                <Image
                  src="/warehouse visit images/working.jpeg"
                  alt="Alma and a colleague reviewing patterned textiles at a worktable"
                  fill
                  sizes="(max-width: 44rem) 100vw, 58vw"
                />
              </figure>
              <div className={styles.indiaCopy}>
                <h2>Which workshop fits the work?</h2>
                <p>
                  Working with leather takes a different setup from cutting and
                  sewing woven garments. Alma and Shirish visit workshops in
                  Maharashtra and across India to see what each does well and
                  which Product Briefs it can take on.{" "}
                  <Link href="/manufacturing-programme">
                    See how we choose a Manufacturing Partner.
                  </Link>
                </p>
              </div>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2">
              <figure className="relative m-0 aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-2)]">
                <Image
                  src="/media/workers-arriving-at-textile-workshop.webp"
                  alt="Visitors greeting a textile worker at the workshop entrance"
                  fill
                  sizes="(max-width: 48rem) 100vw, 48vw"
                  className="object-cover"
                />
              </figure>
              <figure className="relative m-0 aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-[var(--color-paper-2)]">
                <Image
                  src="/media/hands-inspecting-fabric-and-leather.webp"
                  alt="Hands feeling woven fabric and a tan leather hide beside a window"
                  fill
                  sizes="(max-width: 48rem) 100vw, 48vw"
                  className="object-cover"
                />
              </figure>
            </div>
          </div>
        </section>

        <section className="bg-[var(--color-dune)] py-[var(--section-gap-s)] text-[var(--color-forest-deep)]">
          <div className="container grid gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-[var(--space-md)] lg:col-span-5">
              <h2 className="max-w-[14ch] text-[length:var(--text-display-s)] leading-[1.04] font-medium">
                Where we work
              </h2>
            </div>

            <div className="grid gap-[var(--gap-columns)] md:grid-cols-2 lg:col-span-7">
              <article className="grid content-start gap-2 border-t border-[var(--color-rule-2)]/45 pt-4">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  India office
                </h3>
                <p className="text-[var(--color-ink-2)]">
                  2nd floor, Guru Charan Apartment, Ulhasnagar, Maharashtra,
                  India, 421002. Our base for Manufacturing Partner
                  coordination, sample review, and regional travel.
                </p>
              </article>

              <article className="grid content-start gap-2 border-t border-[var(--color-rule-2)]/45 pt-4">
                <h3 className="text-[length:var(--text-title)] font-medium">
                  Spain connection
                </h3>
                <p className="text-[var(--color-ink-2)]">
                  Direct client coordination across Spain and Europe in Spanish,
                  English, and Portuguese.
                </p>
                <div className="pt-2">
                  <Link
                    className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href="/contact"
                  >
                    View contact details
                  </Link>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className={styles.future}>
          <div className={`${styles.futureGrid} container`}>
            <div className={styles.futureHeading}>
              <h2>What we&apos;re developing in Maharashtra</h2>
            </div>
            <article>
              <MediaPlaceholder
                kind="Photo"
                ratio="4:3 horizontal"
                aspectClass="aspect-[4/3]"
                tone="dune"
                title="Almarise garment preview"
                description="Editorial photograph showing contemporary women's clothing tailored from an existing patterned Maharashtrian saree."
              />
              <h3>Almarise</h3>
              <p>
                Our fashion brand in development will turn existing
                Maharashtrian sarees into contemporary women&apos;s clothing.
              </p>
              <Link
                className="w-fit font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/almarise"
              >
                Explore Almarise
              </Link>
            </article>
            <article>
              <MediaPlaceholder
                kind="Photo"
                ratio="4:3 horizontal"
                aspectClass="aspect-[4/3]"
                tone="dune"
                title="Maharashtra garment studio bench"
                description="Sunlit Maharashtra workshop view showing a sewing bench, dress form, pattern paper, and shears."
              />
              <h3>Women&apos;s Training Initiative</h3>
              <p>
                A planned programme for garment design and stitching skills,
                with dignified employment opportunities as a long-term aim.
              </p>
              <Link
                className="w-fit font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/womens-training-initiative"
              >
                Read about the planned initiative
              </Link>
            </article>
          </div>
        </section>

        <section className={styles.invitation}>
          <div className={`${styles.invitationInner} container`}>
            <h2>Tell us what you want to make.</h2>
            <div className={styles.invitationActions}>
              <Link className={styles.primaryAction} href="/product-brief">
                Start a Product Brief
              </Link>
              <Link
                className={styles.secondaryAction}
                href="/manufacturing-programme"
              >
                View the Manufacturing Programme
              </Link>
            </div>
          </div>
        </section>

        <figure className={styles.togetherPortrait}>
          <Image
            src="/togehter_improved.jpg"
            alt="Alma and Shirish standing together in the woods"
            fill
            sizes="100vw"
          />
        </figure>
      </main>

      <SiteFooter />
    </>
  );
}
