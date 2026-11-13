import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "How KarmaRise D Global handles contact details and Product Brief enquiries shared through this website.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid max-w-[68ch] gap-[var(--space-xl)]">
            <div className="grid gap-4">
              <p className="section-index">Legal notice</p>
              <h1 className="text-[clamp(3rem,6vw,5.5rem)] leading-[0.92] font-medium">
                Privacy policy
              </h1>
              <p className="lead text-[var(--color-ink-2)]">
                This notice explains how KarmaRise D Global handles enquiry
                information shared through this website.
              </p>
            </div>

            <section className="grid gap-3 border-t border-[var(--color-rule)] pt-6">
              <h2 className="text-[length:var(--text-2xl)] font-medium">
                What information we ask for
              </h2>
              <p className="text-[var(--color-muted)]">
                When you prepare a Product Brief or general message, you share
                your name, company or brand name, email address, preferred
                language, and project details. Right now, online form delivery
                is in pre-launch preparation and prepared notes open in your
                email client for direct sending to hola@karmarisedglobal.com.
              </p>
            </section>

            <section className="grid gap-3 border-t border-[var(--color-rule)] pt-6">
              <h2 className="text-[length:var(--text-2xl)] font-medium">
                How your project information is used
              </h2>
              <p className="text-[var(--color-muted)]">
                Product Brief notes, sketches, and contact details sent to
                KarmaRise D Global are reviewed directly by founders Alma and
                Shirish solely to evaluate your enquiry, prepare proposals, and
                communicate with you about a Manufacturing Programme or related
                company question.
              </p>
            </section>

            <section className="grid gap-3 border-t border-[var(--color-rule)] pt-6">
              <h2 className="text-[length:var(--text-2xl)] font-medium">
                Your rights and contact
              </h2>
              <p className="text-[var(--color-muted)]">
                European Clients and visitors may request access to, correction
                of, or deletion of personal contact details at any time by
                writing to{" "}
                <a
                  className="underline decoration-[var(--color-clay)] underline-offset-4"
                  href="mailto:hola@karmarisedglobal.com"
                >
                  hola@karmarisedglobal.com
                </a>
                .
              </p>
            </section>

            <div className="pt-4">
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/contact"
              >
                Go to Contact details
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
