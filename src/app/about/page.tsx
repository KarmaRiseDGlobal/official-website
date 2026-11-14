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
    title: "Directness before agreement",
    body: "If a quantity, timeline, or material target does not fit reality, we say so before you commit budget or launch dates.",
  },
  {
    title: "Respect for the maker",
    body: "Good products come from Manufacturing Partners treated as collaborators, with fair terms and clear specifications.",
  },
  {
    title: "Stay until the end",
    body: "Our responsibility does not finish when an order is placed. We stay close through sampling, production, and dispatch.",
  },
  {
    title: "Long-term work over quick wins",
    body: "KarmaRise D Global is built for repeating client relationships, not one-off transactions.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <main className={styles.about} id="main">
        <section className={styles.hero}>
          <div className={`${styles.heroInner} container`}>
            <div className={styles.heroCopy}>
              <h1>Spain and India. One shared destiny.</h1>
              <p className={styles.heroIntro}>
                Alma and Shirish built KarmaRise D Global between Spain and
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
              <p className={styles.eyebrow}>Alma · Spain</p>
              <h2>
                Experience earned by building, falling and beginning again.
              </h2>
              <p className={styles.founderLead}>
                A self-made European entrepreneur, Alma brings the resolve of a
                woman who has always known how to get back up after a setback.
              </p>
              <p>
                She stays close to the client: listening for the ambition behind
                the product, shaping it into a clear Product Brief and keeping
                the conversation open as the work moves forward.
              </p>
              <dl className="m-0 grid gap-2 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)]">
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    Languages:
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    Spanish, English, Portuguese
                  </dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    Programme role:
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    Client conversations, shaping the Product Brief, and keeping
                    European retail expectations clear
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className={`${styles.founder} ${styles.founderShirish}`}>
          <div className={`${styles.founderGrid} container`}>
            <div className={styles.founderCopy}>
              <p className={styles.eyebrow}>Shirish · India</p>
              <h2>A lawyer by profession and at heart.</h2>
              <p className={styles.founderLead}>
                Shirish brings the fresh perspective of a young man shaped by
                his Maratha heritage and a belief in a fairer world.
              </p>
              <p>
                In India, he builds relationships with manufacturing partners
                and artisans, following the Product Brief into the places where
                decisions become materials, samples and finished products.
              </p>
              <dl className="m-0 grid gap-2 border-t border-[var(--color-rule)] pt-4 text-[length:var(--text-sm)]">
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    Base:
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    Ulhasnagar, Maharashtra, India
                  </dd>
                </div>
                <div className="flex flex-wrap gap-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    Programme role:
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    Manufacturing Partner selection, workshop visits,
                    agreements, and production oversight
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
            <p className={styles.eyebrow}>Where their paths met</p>
            <h2>Humanity brought them together.</h2>
            <p className="lead">
              A common passion for people and their diversity connected Alma and
              Shirish. A few months later, Alma boarded a plane. In India, they
              joined forces and brought KarmaRise D Global to life.
            </p>
          </div>
        </section>

        <section className={styles.meaning}>
          <div className="container grid gap-[var(--space-2xl)]">
            <div className={styles.meaningGrid}>
              <div className={styles.meaningTitle}>
                <p className={styles.eyebrow}>The name</p>
                <h2>KarmaRise was never chosen at random.</h2>
              </div>
              <div className={styles.meaningCopy}>
                <p className={styles.largeCopy}>
                  It carries a way of thinking shared by two people from
                  different worlds: help bold, creative people thrive without
                  losing care, trust or devotion along the way.
                </p>
                <p>
                  East and West meet here, bringing the perspective of both
                  cultures into one working relationship.
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
              <p className={styles.eyebrow}>Our principles</p>
              <h2 className="max-w-[16ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Work carried with clarity and care.
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
                <p className={styles.eyebrow}>Across India</p>
                <h2>From north to south, the work stays personal.</h2>
                <p>
                  Alma and Shirish have travelled across India, and continue to
                  do so, to connect clients with the right manufacturing
                  partners and artisans. The aim is not simply to make a
                  product, but to help it become something distinct.
                </p>
                <p>
                  From workshops in Maharashtra to specialist clusters across
                  northern and southern India, each region carries its own
                  materials, skills, and traditions. Travelling in person lets
                  us choose the right hands for each Product Brief instead of
                  forcing different products through one factory.
                </p>
                <Link href="/manufacturing-programme">
                  Follow the Manufacturing Programme
                </Link>
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
              <p className={styles.eyebrow}>Two homes</p>
              <h2 className="max-w-[14ch] text-[length:var(--text-display-s)] leading-[0.96] font-medium">
                Rooted in Maharashtra. Connected to Europe.
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
              <p className={styles.eyebrow}>What grows from here</p>
              <h2>A company with more than one horizon.</h2>
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
                A future fashion brand that will transform existing
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
            <p className={styles.eyebrow}>Build with KarmaRise D Global</p>
            <h2>Bring the idea. They will stay close to the work.</h2>
            <div className={styles.invitationActions}>
              <Link className={styles.primaryAction} href="/product-brief">
                Start a Product Brief
              </Link>
              <Link
                className={styles.secondaryAction}
                href="/manufacturing-programme"
              >
                See how the work unfolds
              </Link>
            </div>
          </div>
        </section>

        <section className={styles.together}>
          <div className={`${styles.togetherHeading} container`}>
            <p className={styles.eyebrow}>Alma and Shirish</p>
            <h2>East and West, united.</h2>
          </div>
          <figure className={styles.togetherPortrait}>
            <Image
              src="/togehter_improved.jpg"
              alt="Alma and Shirish standing together in the woods"
              fill
              sizes="100vw"
            />
          </figure>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
