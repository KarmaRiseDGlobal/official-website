"use client";

import Link from "next/link";

import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/context/language-context";

export function NotFoundView() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-3xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)]">
          <div className="container grid max-w-[54rem] gap-[var(--space-xl)]">
            <p className="section-index">404</p>
            <h1 className="max-w-[16ch] text-[clamp(2.5rem,5.4vw,4.75rem)] leading-[0.98] font-medium">
              {isEs
                ? "No hemos encontrado esta página."
                : "We could not find this page."}
            </h1>
            <p className="lead max-w-[46ch] text-[var(--color-ink-2)]">
              {isEs
                ? "Es posible que el enlace haya cambiado o que la dirección no esté escrita correctamente. Puedes volver al inicio o iniciar directamente un Product Brief."
                : "The link may have moved or the address may be mistyped. You can head back to the homepage or start a Product Brief directly."}
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Link className="primary-button" href={localizeHref("/")}>
                {isEs ? "Volver al inicio" : "Back to home"}
              </Link>
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/product-brief")}
              >
                {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
              </Link>
              <Link
                className="font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/manufacturing-programme")}
              >
                {isEs
                  ? "Ver el Programa de fabricación"
                  : "Explore the Manufacturing Programme"}
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
