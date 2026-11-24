"use client";

import Link from "next/link";

import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { useLanguage } from "@/context/language-context";

export function NotFoundView() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-2xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)] sm:pt-[calc(var(--nav-height)+var(--space-3xl))]">
          <div className="container grid max-w-[54rem] gap-[var(--space-xl)]">
            <p className="section-index">404</p>
            <h1 className="max-w-[16ch] text-[length:var(--text-display)] leading-[1.02] font-normal">
              {isEs
                ? "No hemos encontrado esta página."
                : "We could not find this page."}
            </h1>
            <p className="lead max-w-[46ch] text-[var(--color-ink-2)]">
              {isEs
                ? "Es posible que el enlace haya cambiado o que la dirección no esté escrita correctamente. Puedes volver al inicio o empezar directamente un briefing de producto."
                : "The link may have moved or the address may be mistyped. You can head back to the homepage or start a Product Brief directly."}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              <Link className="primary-button" href={localizeHref("/")}>
                {isEs ? "Volver al inicio" : "Back to home"}
              </Link>
              <Link
                className="inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/product-brief")}
              >
                {isEs
                  ? "Empezar briefing de producto"
                  : "Start a Product Brief"}
              </Link>
              <Link
                className="inline-flex min-h-[var(--tap-min)] items-center font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/manufacturing")}
              >
                {isEs
                  ? "Ver el Programa de producción"
                  : "Explore the Manufacturing Programme"}
              </Link>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="night" />
      </main>

      <SiteFooter />
    </>
  );
}
