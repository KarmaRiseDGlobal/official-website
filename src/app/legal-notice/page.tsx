import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Legal notice",
  description:
    "Statutory corporate registration disclosures (India LLP Act 2008 and Spain LSSI-CE Law 34/2002 Aviso Legal) and official communication channels for Karmarise Global LLP (operating KarmaRise D Global).",
};

const legalNavLinks = [
  { href: "/privacy-policy", label: "Privacy policy", current: false },
  { href: "/terms", label: "Website terms", current: false },
  { href: "/cookie-policy", label: "Cookie policy", current: false },
  { href: "/legal-notice", label: "Legal notice", current: true },
] as const;

const officialEmails = [
  {
    email: "hola@karmarisedglobal.com",
    department:
      "European & international Client intake (Spanish, English, Portuguese)",
  },
  {
    email: "namaste@karmarisedglobal.com",
    department: "India Client & general commercial intake",
  },
  {
    email: "inquiry@karmarisedglobal.com",
    department: "Product Brief & new Manufacturing Programme enquiries",
  },
  {
    email: "partners@karmarisedglobal.com",
    department: "Manufacturing Partners, workshops & artisans in India",
  },
  {
    email: "stories@karmarisedglobal.com",
    department: "Editorial Stories, press, media & Almarise enquiries",
  },
  {
    email: "support@karmarisedglobal.com",
    department: "Client support, data protection & Statutory Grievance Officer",
  },
  {
    email: "accounts@karmarisedglobal.com",
    department: "Billing, invoicing, export paperwork & GST documentation",
  },
  {
    email: "alma@karmarisedglobal.com",
    department: "Alma · Co-Founder & European Client Operations (Spain)",
  },
  {
    email: "shirish@karmarisedglobal.com",
    department: "Shirish · Designated Partner & India Operations (Maharashtra)",
  },
] as const;

export default function LegalNoticePage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid max-w-[76ch] gap-[var(--space-2xl)]">
            <div className="grid gap-5">
              <p className="section-index">
                Statutory disclosures · Aviso Legal
              </p>
              <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-normal">
                Corporate &amp; legal notice
              </h1>
              <p className="lead text-[var(--color-ink-2)]">
                Statutory identification and registration disclosures published
                in compliance with the Indian Limited Liability Partnership Act,
                2008, the Indian Information Technology Act, 2000, and Article
                10 of Spain&apos;s Law 34/2002 on Information Society Services
                and Electronic Commerce (LSSI-CE).
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
              id="entity-registration"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                1. Registered legal entity details
              </h2>
              <dl className="m-0 grid gap-4 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)] sm:grid-cols-2">
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    Registered legal name
                  </dt>
                  <dd className="m-0 mt-1 font-semibold text-[var(--color-forest-deep)]">
                    Karmarise Global LLP
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    Commercial &amp; public brands
                  </dt>
                  <dd className="m-0 mt-1 text-[var(--color-muted)]">
                    KarmaRise D Global (Manufacturing Programmes) · Almarise
                    (Fashion brand)
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    Legal form &amp; registry
                  </dt>
                  <dd className="m-0 mt-1 text-[var(--color-muted)]">
                    Limited Liability Partnership (Ministry of Corporate
                    Affairs, Government of India)
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    LLP Identification Number (LLPIN)
                  </dt>
                  <dd className="m-0 mt-1 font-mono font-semibold text-[var(--color-forest-deep)]">
                    ACO-3878
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    Date of incorporation
                  </dt>
                  <dd className="m-0 mt-1 text-[var(--color-muted)]">
                    15 May 2025
                  </dd>
                </div>
                <div>
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    Goods &amp; Services Tax ID (GSTIN)
                  </dt>
                  <dd className="m-0 mt-1 font-mono font-semibold text-[var(--color-forest-deep)]">
                    27ABDFK8128R1ZL
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    Registered office &amp; principal place of business
                  </dt>
                  <dd className="m-0 mt-1 text-[var(--color-muted)]">
                    2nd floor, Guru Charan Apartment, Ulhasnagar, Maharashtra,
                    India, 421002
                  </dd>
                </div>
              </dl>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="governance-and-operations"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                2. Management, representation, and operational structure
              </h2>
              <p className="text-[var(--color-muted)]">
                All commercial agreements, Manufacturing Programmes, sampling
                proposals, and invoices are issued and executed by{" "}
                <strong className="text-[var(--color-forest-deep)]">
                  Karmarise Global LLP
                </strong>{" "}
                as the sole legal contracting entity:
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid content-start gap-2 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)]">
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    India · Legal representation &amp; production
                  </p>
                  <p className="font-semibold text-[var(--color-forest-deep)]">
                    Shirish · Designated Partner &amp; Grievance Officer
                  </p>
                  <p className="text-[var(--color-muted)]">
                    Oversees statutory governance of Karmarise Global LLP,
                    in-person Manufacturing Partner verification, sampling
                    reviews, production floor supervision, and pre-shipment
                    inspections across India.
                  </p>
                  <p className="pt-1 text-[var(--color-muted)]">
                    Phone:{" "}
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4"
                      href="tel:+918530009798"
                    >
                      +91 8530009798
                    </a>
                  </p>
                </div>

                <div className="grid content-start gap-2 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)]">
                  <p className="text-[length:var(--text-xs)] font-semibold tracking-[0.04em] text-[var(--color-clay-ink)] uppercase">
                    Spain &amp; Europe · Client operations
                  </p>
                  <p className="font-semibold text-[var(--color-forest-deep)]">
                    Alma · Co-Founder &amp; European Client Operations
                  </p>
                  <p className="text-[var(--color-muted)]">
                    Leads European Client relations, Product Brief intake,
                    commercial consultations, and project coordination from
                    Spain in Spanish, English, and Portuguese.
                  </p>
                  <p className="pt-1 text-[var(--color-muted)]">
                    Phone:{" "}
                    <a
                      className="underline decoration-[var(--color-clay)] underline-offset-4"
                      href="tel:+34611722276"
                    >
                      +34 611722276
                    </a>
                  </p>
                </div>
              </div>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="official-emails"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                3. Official email directory
              </h2>
              <p className="text-[var(--color-muted)]">
                All official electronic communications from Karmarise Global LLP
                originate exclusively from the{" "}
                <code>@karmarisedglobal.com</code> domain. Below is the
                directory of authorized mailboxes:
              </p>
              <dl className="m-0 grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)]">
                {officialEmails.map((item) => (
                  <div
                    key={item.email}
                    className="grid gap-1 border-b border-[var(--color-rule)] pb-3 last:border-b-0 last:pb-0 sm:grid-cols-12 sm:items-baseline sm:gap-4"
                  >
                    <dt className="font-semibold text-[var(--color-forest-deep)] sm:col-span-5">
                      <a
                        className="underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                        href={`mailto:${item.email}`}
                      >
                        {item.email}
                      </a>
                    </dt>
                    <dd className="m-0 text-[var(--color-muted)] sm:col-span-7">
                      {item.department}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <div className="flex flex-wrap gap-6 border-t border-[var(--color-rule)] pt-6">
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/terms"
              >
                View Website Terms
              </Link>
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/privacy-policy"
              >
                View Privacy Policy
              </Link>
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/cookie-policy"
              >
                View Cookie Policy
              </Link>
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/contact"
              >
                Go to Contact page
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
