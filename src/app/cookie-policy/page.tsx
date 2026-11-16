import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "Information about cookies, how they are used on the KarmaRise D Global website, and how to manage or disable them in your browser.",
};

const legalNavLinks = [
  { href: "/privacy-policy", label: "Privacy policy", current: false },
  { href: "/terms", label: "Website terms", current: false },
  { href: "/cookie-policy", label: "Cookie policy", current: true },
  { href: "/legal-notice", label: "Legal notice", current: false },
] as const;

const cookieCategories = [
  {
    title: "Technical and session cookies",
    body: "Allow visitors to navigate the website and use its core features, such as loading pages reliably, maintaining session stability, ensuring secure browsing, and submitting enquiry forms.",
  },
  {
    title: "Preference and customization cookies",
    body: "Remember basic browsing preferences (such as language, region, or display settings) so your experience remains consistent across pages.",
  },
  {
    title: "Statistical and performance cookies",
    body: "Help us understand in aggregate how visitors navigate our pages so we can improve the structure and clarity of our content without identifying individual users.",
  },
] as const;

const browserGuides = [
  {
    browser: "Google Chrome",
    steps: "Settings -> Privacy and security -> Cookies and other site data",
  },
  {
    browser: "Mozilla Firefox",
    steps: "Settings -> Privacy & Security -> Cookies and Site Data",
  },
  {
    browser: "Apple Safari",
    steps: "Preferences / Settings -> Privacy -> Manage Website Data",
  },
  {
    browser: "Microsoft Edge",
    steps:
      "Settings -> Cookies and site permissions -> Manage and delete cookies and site data",
  },
] as const;

export default function CookiePolicyPage() {
  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid max-w-[76ch] gap-[var(--space-2xl)]">
            <div className="grid gap-5">
              <p className="section-index">Legal notice</p>
              <h1 className="text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.02] font-normal">
                Cookie policy
              </h1>
              <p className="lead text-[var(--color-ink-2)]">
                In compliance with Law 34/2002 on Information Society Services
                and Electronic Commerce (LSSI-CE), European Union data
                protection regulations, and applicable Indian law, this page
                explains what cookies are, how they are used on the KarmaRise D
                Global website, and how you can manage them.
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
              id="what-are-cookies"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                1. What are cookies?
              </h2>
              <p className="text-[var(--color-muted)]">
                A cookie is a small text file that a website downloads and
                stores on your computer, tablet, or mobile device when you visit
                certain pages. Cookies allow a website to store and retrieve
                basic information about your browsing session, recognize your
                browser across pages, and ensure the website functions smoothly
                and securely. Cookies do not damage your device and cannot read
                personal files stored on your computer.
              </p>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="types-of-cookies"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                2. Types of cookies used on this website
              </h2>
              <p className="text-[var(--color-muted)]">
                This website uses cookies solely to ensure smooth navigation,
                security, and basic service functionality. We do not use cookies
                to collect sensitive personal information or to serve
                third-party behavioral advertising.
              </p>

              <div className="grid gap-4">
                {cookieCategories.map((item) => (
                  <div
                    key={item.title}
                    className="grid gap-2 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)]"
                  >
                    <p className="font-semibold text-[var(--color-forest-deep)]">
                      {item.title}
                    </p>
                    <p className="text-[var(--color-muted)]">{item.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="browser-settings"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                3. How to disable, block, or delete cookies
              </h2>
              <p className="text-[var(--color-muted)]">
                You can allow, block, or delete the cookies installed on your
                device at any time by configuring the options in your web
                browser. Please note that disabling technical cookies may affect
                the proper functioning of certain sections of the website.
              </p>

              <dl className="m-0 grid gap-3 rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] p-6 text-[length:var(--text-sm)] sm:grid-cols-2">
                {browserGuides.map((item) => (
                  <div key={item.browser} className="grid gap-1">
                    <dt className="font-semibold text-[var(--color-forest-deep)]">
                      {item.browser}
                    </dt>
                    <dd className="m-0 text-[var(--color-muted)]">
                      {item.steps}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>

            <section
              className="grid gap-4 border-t border-[var(--color-rule)] pt-8"
              id="updates-and-contact"
            >
              <h2 className="text-[length:var(--text-2xl)] font-normal">
                4. Updates and contact
              </h2>
              <p className="text-[var(--color-muted)]">
                Karmarise Global LLP may update this Cookie Policy to reflect
                regulatory requirements or changes to the website. If you have
                any questions about our use of cookies, please contact us at{" "}
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
            </section>

            <div className="flex flex-wrap gap-6 border-t border-[var(--color-rule)] pt-6">
              <Link
                className="font-semibold underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href="/privacy-policy"
              >
                View Privacy Policy
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
