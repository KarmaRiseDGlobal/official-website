import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How Karmarise Global LLP (operating KarmaRise D Global) handles contact details, Product Brief enquiries, and personal data under European and Indian data protection laws.",
};

const legalNavLinks = [
  { href: "/privacy-policy", label: "Privacy policy", current: true },
  { href: "/terms", label: "Website terms", current: false },
  { href: "/cookie-policy", label: "Cookie policy", current: false },
  { href: "/legal-notice", label: "Legal notice", current: false },
] as const;

export default function PrivacyPolicyPage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid max-w-[76ch] gap-[var(--space-2xl)]">
            <div className="grid gap-5">
              <p className="section-index">Legal notice</p>
              <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-normal">
                Privacy policy
              </h1>
              <p className="lead text-[var(--color-ink-2)]">
                This Privacy Policy explains how Karmarise Global LLP, operating
                the KarmaRise D Global brand, handles contact information and
                project enquiries shared through this website.
              </p>

              <nav
                aria-label="Legal documents"
                className="flex flex-wrap gap-2 border-y border-[var(--color-rule)] py-4"
              >
                {legalNavLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={item.current ? "page" : undefined}
                    className={
                      item.current
                        ? "rounded-full bg-[var(--color-forest-deep)] px-4 py-1.5 text-[length:var(--text-xs)] font-semibold text-[var(--color-paper)] no-underline"
                        : "rounded-full border border-[var(--color-rule)] bg-[var(--color-paper-2)] px-4 py-1.5 text-[length:var(--text-xs)] font-medium text-[var(--color-forest-deep)] no-underline hover:border-[var(--color-forest-deep)]"
                    }
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="controller"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                1. Responsible entity (Data Controller)
              </h2>
              <p className="text-[var(--color-muted)]">
                In accordance with the European Union General Data Protection
                Regulation (GDPR), Spain&apos;s Organic Law 3/2018 (LOPDGDD),
                and India&apos;s Digital Personal Data Protection Act, 2023, the
                entity responsible for processing data collected through this
                website is:
              </p>
              <dl className="m-0 grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)] sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    Legal entity name
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    Karmarise Global LLP (trading as KarmaRise D Global)
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    Registration (LLPIN &amp; GSTIN)
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    Registered address
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    2nd floor, Guru Charan Apartment, Ulhasnagar, Maharashtra,
                    India, 421002
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-semibold text-[var(--color-forest-deep)]">
                    Privacy &amp; Grievance Contact
                  </dt>
                  <dd className="m-0 text-[var(--color-muted)]">
                    Shirish (Designated Partner &amp; Grievance Officer) ·{" "}
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4"
                      href="mailto:support@karmarisedglobal.com"
                    >
                      support@karmarisedglobal.com
                    </a>{" "}
                    ·{" "}
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4"
                      href="tel:+918530009798"
                    >
                      +91 8530009798
                    </a>
                    <br />
                    European Client Contact (Spain): Alma ·{" "}
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4"
                      href="mailto:hola@karmarisedglobal.com"
                    >
                      hola@karmarisedglobal.com
                    </a>{" "}
                    ·{" "}
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4"
                      href="tel:+34611722276"
                    >
                      +34 611722276
                    </a>
                  </dd>
                </div>
              </dl>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="data-collected"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                2. Information we collect and purpose of use
              </h2>
              <p className="text-[var(--color-muted)]">
                We only collect the contact and project details that you
                voluntarily share with us:
              </p>
              <ul className="m-0 grid gap-3 pl-5 text-[var(--color-muted)]">
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    Product Brief and commercial enquiries:
                  </strong>{" "}
                  Your name, company or brand name, email address, preferred
                  language, product category, and project notes shared to
                  evaluate your request, schedule a consultation, and prepare a
                  Manufacturing Programme proposal (processed on the basis of
                  pre-contractual measures and legitimate business interest).
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    General contact and partner introductions:
                  </strong>{" "}
                  Information shared by visitors, press, or Indian workshops to
                  respond to your enquiry and manage professional relationships.
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    Stories and updates subscription:
                  </strong>{" "}
                  Your email address when you subscribe to receive occasional
                  Stories and company updates (processed on the basis of your
                  consent, which you may withdraw at any time).
                </li>
              </ul>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="confidentiality"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                3. Confidentiality and data sharing
              </h2>
              <p className="text-[var(--color-muted)]">
                We do not sell, rent, or trade your personal or commercial
                information to third parties. Product Brief notes, sketches, and
                contact details are reviewed directly by our team in Spain and
                India solely to evaluate your project and coordinate
                Manufacturing Programmes.
              </p>
              <p className="text-[var(--color-muted)]">
                Access to your data is restricted to authorized personnel of
                Karmarise Global LLP and essential service providers (such as
                secure email, communication, and hosting providers) bound by
                strict confidentiality and data protection obligations, or where
                disclosure is required by law.
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="retention"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                4. Data retention
              </h2>
              <p className="text-[var(--color-muted)]">
                Enquiry information is retained only for as long as necessary to
                attend to your request, manage an active commercial
                relationship, or comply with applicable legal, tax, and
                accounting obligations. Newsletter subscriptions are kept until
                you unsubscribe or request removal.
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="rights"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                5. Your rights
              </h2>
              <p className="text-[var(--color-muted)]">
                You may request access to, rectification of, deletion of,
                restriction of, or portability of your personal data, or object
                to its processing and withdraw consent at any time by writing to{" "}
                <a
                  className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                  href="mailto:support@karmarisedglobal.com"
                >
                  support@karmarisedglobal.com
                </a>{" "}
                or{" "}
                <a
                  className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                  href="mailto:hola@karmarisedglobal.com"
                >
                  hola@karmarisedglobal.com
                </a>
                .
              </p>
              <p className="text-[var(--color-muted)]">
                We acknowledge privacy and grievance requests within 24 hours
                and resolve them within 15 days. European visitors also have the
                right to lodge a complaint with the Spanish Data Protection
                Agency (<em>Agencia Española de Protección de Datos</em>,{" "}
                <a
                  className="underline decoration-[var(--color-clay)] underline-offset-4"
                  href="https://www.aepd.es"
                  rel="noreferrer"
                  target="_blank"
                >
                  www.aepd.es
                </a>
                ) or their local supervisory authority, and Indian visitors may
                approach the Data Protection Board of India.
              </p>
            </section>

            <div className="flex flex-wrap gap-6 border-t border-[var(--color-rule)] pt-6">
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/cookie-policy"
              >
                View Cookie Policy
              </Link>
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/legal-notice"
              >
                View Corporate &amp; Legal Notice
              </Link>
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/terms"
              >
                View Website Terms
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
