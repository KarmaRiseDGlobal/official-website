import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Website terms",
  description:
    "Terms of use, Product Brief intellectual property and confidentiality protections, pre-contractual scope, and governing law for the KarmaRise D Global website operated by Karmarise Global LLP.",
};

const legalNavLinks = [
  { href: "/privacy-policy", label: "Privacy policy", current: false },
  { href: "/terms", label: "Website terms", current: true },
  { href: "/cookie-policy", label: "Cookie policy", current: false },
  { href: "/legal-notice", label: "Legal notice", current: false },
] as const;

export default function TermsPage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid max-w-[76ch] gap-[var(--space-2xl)]">
            <div className="grid gap-5">
              <p className="section-index">Terms of use &amp; IP notice</p>
              <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-normal">
                Website terms
              </h1>
              <p className="lead text-[var(--color-ink-2)]">
                These Website Terms govern access to and use of the KarmaRise D
                Global website, pre-agreement Product Brief submissions, and
                brand assets operated by Karmarise Global LLP.
              </p>
              <p className="text-[length:var(--text-xs)] text-[var(--color-muted)]">
                Effective date: 15 May 2025 · Last updated: 16 November 2026
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
              id="operator"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                1. Legal operator and entity scope
              </h2>
              <p className="text-[var(--color-muted)]">
                This website is owned and operated by{" "}
                <strong className="text-[var(--color-forest-deep)]">
                  Karmarise Global LLP
                </strong>{" "}
                (LLPIN: <code>ACO-3878</code> · GSTIN:{" "}
                <code>27ABDFK8128R1ZL</code>), a Limited Liability Partnership
                incorporated under the laws of India on 15 May 2025 with its
                registered office at 2nd floor, Guru Charan Apartment,
                Ulhasnagar, Maharashtra, India, 421002.{" "}
                <strong className="text-[var(--color-forest-deep)]">
                  KarmaRise D Global
                </strong>{" "}
                is the primary commercial brand of Karmarise Global LLP, and{" "}
                <strong className="text-[var(--color-forest-deep)]">
                  Almarise
                </strong>{" "}
                is a fashion brand owned by Karmarise Global LLP. Full statutory
                registration disclosures are published on our{" "}
                <Link
                  className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4"
                  href="/legal-notice"
                >
                  Legal notice
                </Link>{" "}
                page.
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="confidentiality"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                2. Client intellectual property and Product Brief
                confidentiality
              </h2>
              <p className="text-[var(--color-muted)]">
                We recognize that retail chains, independent retailers, and
                fashion brands share proprietary product ideas when initiating a
                Product Brief. When you submit sketches, technical packs,
                measurements, sample photographs, material specifications, or
                commercial plans through{" "}
                <Link
                  className="underline decoration-[var(--color-clay)] underline-offset-4"
                  href="/product-brief"
                >
                  /product-brief
                </Link>{" "}
                or to any official <code>@karmarisedglobal.com</code> email
                address:
              </p>
              <ul className="m-0 grid gap-3 pl-5 text-[var(--color-muted)]">
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    Client ownership preserved:
                  </strong>{" "}
                  All pre-existing designs, trademarks, sketches, patterns, and
                  product specifications submitted by a prospective Client
                  remain the sole and exclusive intellectual property of that
                  Client. Submitting a Product Brief does not grant Karmarise
                  Global LLP any license to commercialize your designs for third
                  parties.
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    Founder-level evaluation confidentiality:
                  </strong>{" "}
                  During initial evaluation, your Product Brief is reviewed
                  strictly by Shirish and Alma to assess feasibility, material
                  sourcing, and Manufacturing Partner fit.
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    Controlled disclosure to Manufacturing Partners:
                  </strong>{" "}
                  We do not broadcast your designs to public factory directories
                  or open bidding boards. Specifications are shared only with
                  shortlisted Indian Manufacturing Partners as needed to prepare
                  sampling or production quotes, and we execute a formal{" "}
                  <strong>
                    Mutual Non-Disclosure &amp; Non-Circumvention Agreement
                    (NDA)
                  </strong>{" "}
                  upon request prior to detailed technical pack or sample
                  exchange.
                </li>
              </ul>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="pre-agreement-scope"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                3. Separation from commercial Manufacturing Programme contracts
              </h2>
              <p className="text-[var(--color-muted)]">
                Descriptions of Manufacturing Programmes, the four programme
                phases (Design approval, Sample approval, Production, and
                Shipping), product categories, and quality checks on this
                website serve as general commercial orientation and do not
                constitute a legally binding offer or supply contract.
              </p>
              <p className="text-[var(--color-muted)]">
                Specific commercial commitments, including sample fees, pattern
                and tooling ownership, unit pricing, minimum order quantities,
                acceptable quality limits (AQL), construction tolerances,
                production lead times, payment milestones, delivery Incoterms
                (EXW, FOB, or DDP), and liability caps, take effect only when
                agreed in a written{" "}
                <strong className="text-[var(--color-forest-deep)]">
                  Product Brief &amp; Sampling Proposal
                </strong>{" "}
                and a signed{" "}
                <strong className="text-[var(--color-forest-deep)]">
                  Master Manufacturing Programme Agreement
                </strong>{" "}
                between Karmarise Global LLP and the Client.
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="brand-ownership"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                4. Website, brand, and editorial content ownership
              </h2>
              <p className="text-[var(--color-muted)]">
                Unless otherwise stated, Karmarise Global LLP owns all rights,
                title, and interest in this website, the{" "}
                <strong>KarmaRise D Global</strong> name and logo, the{" "}
                <strong>Almarise</strong> fashion brand, the{" "}
                <strong>Women&apos;s Training Initiative</strong> programme
                materials, and all published editorial <strong>Stories</strong>,
                photographs, video footage, and text.
              </p>
              <p className="text-[var(--color-muted)]">
                You may view, link to, and download pages for internal B2B
                evaluation of our Manufacturing Programmes. You may not
                reproduce, republish, or commercially exploit any photography,
                video footage, logo, or editorial text from this website without
                prior written permission from{" "}
                <a
                  className="underline decoration-[var(--color-clay)] underline-offset-4"
                  href="mailto:stories@karmarisedglobal.com"
                >
                  stories@karmarisedglobal.com
                </a>{" "}
                or{" "}
                <a
                  className="underline decoration-[var(--color-clay)] underline-offset-4"
                  href="mailto:support@karmarisedglobal.com"
                >
                  support@karmarisedglobal.com
                </a>
                .
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="acceptable-use"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                5. Acceptable use and accuracy of submissions
              </h2>
              <p className="text-[var(--color-muted)]">
                By using this website or submitting an enquiry, you confirm that
                all information you provide is accurate, that you are acting in
                a legitimate business or professional capacity, and that any
                product references or designs you submit do not knowingly
                infringe the intellectual property rights of third parties.
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="liability"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                6. Limitation of website liability and external links
              </h2>
              <p className="text-[var(--color-muted)]">
                This website and its editorial Stories are provided on an
                &ldquo;as-is&rdquo; informational basis. To the maximum extent
                permitted by applicable law, Karmarise Global LLP excludes
                liability for any indirect, incidental, or consequential loss
                arising from reliance on general website content prior to
                signing a commercial agreement. External links (such as Google
                Maps location links or social platforms) are provided for
                convenience; we do not control third-party websites or their
                independent privacy practices.
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="governing-law"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                7. Governing law and jurisdiction
              </h2>
              <p className="text-[var(--color-muted)]">
                These Website Terms and any non-contractual dispute arising out
                of the use of this website are governed by and construed in
                accordance with the{" "}
                <strong className="text-[var(--color-forest-deep)]">
                  laws of India
                </strong>
                . Subject to any mandatory data-protection or statutory rights
                applicable to European Union visitors in their country of
                residence, the competent courts in{" "}
                <strong className="text-[var(--color-forest-deep)]">
                  Thane and Mumbai, Maharashtra, India
                </strong>{" "}
                (having territorial jurisdiction over Ulhasnagar, PIN 421002)
                shall have exclusive jurisdiction. Commercial disputes under an
                active Manufacturing Programme are governed by the dispute
                resolution clause set out in the signed Master Manufacturing
                Programme Agreement.
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="contact"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                8. Contact for legal, contractual, and billing questions
              </h2>
              <p className="text-[var(--color-muted)]">
                Questions regarding these Website Terms, Mutual NDAs, or
                commercial agreements may be directed to:
              </p>
              <ul className="m-0 grid gap-2 pl-5 text-[length:var(--text-sm)] text-[var(--color-muted)]">
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    Legal &amp; support:
                  </strong>{" "}
                  <a
                    className="underline decoration-[var(--color-clay)] underline-offset-4"
                    href="mailto:support@karmarisedglobal.com"
                  >
                    support@karmarisedglobal.com
                  </a>
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    Client &amp; contract enquiries:
                  </strong>{" "}
                  <a
                    className="underline decoration-[var(--color-clay)] underline-offset-4"
                    href="mailto:hola@karmarisedglobal.com"
                  >
                    hola@karmarisedglobal.com
                  </a>{" "}
                  /{" "}
                  <a
                    className="underline decoration-[var(--color-clay)] underline-offset-4"
                    href="mailto:inquiry@karmarisedglobal.com"
                  >
                    inquiry@karmarisedglobal.com
                  </a>
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    Accounts, billing &amp; GST documentation:
                  </strong>{" "}
                  <a
                    className="underline decoration-[var(--color-clay)] underline-offset-4"
                    href="mailto:accounts@karmarisedglobal.com"
                  >
                    accounts@karmarisedglobal.com
                  </a>
                </li>
                <li>
                  <strong className="text-[var(--color-forest-deep)]">
                    Registered office:
                  </strong>{" "}
                  Karmarise Global LLP, 2nd floor, Guru Charan Apartment,
                  Ulhasnagar, Maharashtra, India, 421002
                </li>
              </ul>
            </section>

            <div className="flex flex-wrap gap-6 border-t border-[var(--color-rule)] pt-6">
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/legal-notice"
              >
                View Corporate &amp; Legal Notice
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
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
