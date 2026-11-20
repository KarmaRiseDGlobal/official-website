"use client";

import { BookCallScheduler } from "@/components/book-call-scheduler";
import { SectionBridge } from "@/components/section-bridge";
import { SiteFooter } from "@/components/site-footer";
import { useLanguage } from "@/context/language-context";

export function BookACallPageClient() {
  const { language } = useLanguage();
  const isEs = language === "es";

  return (
    <>
      <main id="main">
        <section className="bg-[var(--color-paper)] pt-[calc(var(--nav-height)+var(--space-lg))] pb-[var(--section-gap)] text-[var(--color-forest-deep)] xl:pt-[calc(var(--nav-height)+var(--space-3xl))]">
          <div className="container grid gap-[var(--space-xl)] xl:gap-[var(--space-2xl)]">
            <div className="grid gap-[var(--space-md)]">
              <h1 className="max-w-[16ch] text-[clamp(2.4rem,5.2vw,4.75rem)] leading-[0.98] font-medium">
                {isEs ? "Reservar videollamada" : "Book a video call"}
              </h1>
              <p className="lead max-w-[54ch] text-[var(--color-ink-2)]">
                {isEs
                  ? "Elige una hora con Alma por Google Meet para hablar sobre tu Product Brief, materiales, muestreo o plazos en la India."
                  : "Pick a time with Alma on Google Meet to talk through your Product Brief, materials, sampling, or delivery timeline in India."}
              </p>
            </div>

            <BookCallScheduler />
          </div>
        </section>

        <SectionBridge from="paper" to="night" />
      </main>

      <SiteFooter />
    </>
  );
}
