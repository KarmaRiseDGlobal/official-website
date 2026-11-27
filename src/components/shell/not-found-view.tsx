"use client";

import Link from "next/link";

import { SectionBridge } from "@/components/shell/section-bridge";
import { SiteFooter } from "@/components/shell/site-footer";
import { useLanguage } from "@/context/language-context";

function ArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="editorial-arrow-icon shrink-0"
      width="15"
      height="15"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3.5 8h9" />
      <path d="m8.75 4.25 3.75 3.75-3.75 3.75" />
    </svg>
  );
}

export function NotFoundView() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main id="main" tabIndex={-1}>
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-2xl))] pb-[var(--section-gap)] text-[var(--color-forest-deep)] sm:pt-[calc(var(--nav-height)+var(--space-3xl))]">
          <div className="container grid max-w-[54rem] gap-[var(--space-xl)]">
            <h1 className="max-w-[16ch] text-[length:var(--text-display)] leading-[1.06] font-normal">
              {isEs
                ? "No hemos encontrado esta página."
                : "We could not find this page."}
            </h1>
            <p className="lead max-w-[46ch] text-[var(--color-ink-2)]">
              {isEs
                ? "Es posible que el enlace haya cambiado o que la dirección no esté escrita correctamente. Puedes volver al inicio, empezar un briefing de producto o escribirnos directamente."
                : "The link may have moved or the address may be mistyped. You can head back to the homepage, start a Product Brief, or speak with Alma directly."}
            </p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2">
              <Link className="primary-button-light" href={localizeHref("/")}>
                {isEs ? "Volver al inicio" : "Back to home"}
              </Link>
              <Link
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 transition-colors hover:text-[var(--color-clay-ink)]"
                href={localizeHref("/product-brief")}
              >
                <span>
                  {isEs
                    ? "Empezar briefing de producto"
                    : "Start a Product Brief"}
                </span>
                <ArrowIcon />
              </Link>
              <Link
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                href={localizeHref("/manufacturing")}
              >
                <span>
                  {isEs
                    ? "Ver el Programa de producción"
                    : "Explore the Manufacturing Programme"}
                </span>
                <ArrowIcon />
              </Link>
              <Link
                className="editorial-arrow-link inline-flex min-h-[var(--tap-min)] items-center gap-2 font-medium text-[var(--color-muted)] underline decoration-[var(--color-rule-2)] underline-offset-4 transition-colors hover:text-[var(--color-forest-deep)]"
                href={localizeHref("/book-a-call?duration=15")}
              >
                <span>
                  {isEs ? "Reservar videollamada" : "Book a video call"}
                </span>
                <ArrowIcon />
              </Link>
            </div>
          </div>
        </section>

        <SectionBridge from="paper" to="night" size="gentle" />
      </main>

      <SiteFooter />
    </>
  );
}
