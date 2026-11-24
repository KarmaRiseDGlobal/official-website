"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

import { NewsletterForm } from "@/components/forms/newsletter-form";
import { useLanguage } from "@/context/language-context";

const email = "hola@karmarisedglobal.com";
const whatsappHref = "https://wa.me/34611722276";

interface SiteFooterProps {
  hideNewsletter?: boolean;
}

export function SiteFooter({ hideNewsletter = false }: SiteFooterProps = {}) {
  const { language, localizeHref } = useLanguage();
  const pathname = usePathname();
  const isEs = language === "es";
  const homeHref = localizeHref("/");

  function handleHomeLogoClick(event: MouseEvent<HTMLAnchorElement>) {
    const normalizedCurrent = (pathname || "/").replace(/\/+$/, "") || "/";
    const normalizedHome = homeHref.replace(/\/+$/, "") || "/";
    if (normalizedCurrent === normalizedHome) {
      event.preventDefault();
      if (window.location.hash) {
        window.history.replaceState(null, "", homeHref);
      }
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: reducedMotion ? "auto" : "smooth",
      });
    }
  }

  return (
    <footer className="site-footer">
      {!hideNewsletter ? (
        <div className="border-b border-[var(--color-paper)]/15 py-[var(--space-2xl)]">
          <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
            <div className="grid gap-2 lg:col-span-5">
              <p className="footer-group-heading">
                {isEs ? "Historias y cartas" : "Stories & letters"}
              </p>
              <p className="text-[length:var(--text-lg)] font-medium text-[var(--color-paper)]">
                {isEs
                  ? "Notas sobre el terreno, hallazgos de piel o tejido y cartas entre España y la India."
                  : "Field notes, leather and cloth finds, and letters between Spain and India."}
              </p>
            </div>
            <div className="lg:col-span-7">
              <NewsletterForm
                variant="footer"
                source="Footer"
                defaultTrack="choose"
              />
            </div>
          </div>
        </div>
      ) : null}

      <div className="footer-inner container">
        <div className="footer-brand">
          <Link
            href={homeHref}
            className="shrink-0"
            aria-label="KarmaRise D Global"
            onClick={handleHomeLogoClick}
          >
            <Image
              className="footer-logo"
              src="/brand/main-logo-transparent.png"
              alt=""
              width={701}
              height={815}
              sizes="(max-width: 44rem) 112px, (max-width: 80rem) 12vw, 154px"
            />
          </Link>
          <p>
            {isEs
              ? "Tu producto, acompañado de principio a fin."
              : "Your product, carried through."}
          </p>
        </div>

        <nav
          className="footer-links"
          aria-label={
            isEs ? "Navegación del pie de página" : "Footer navigation"
          }
        >
          <div className="footer-link-group">
            <h2 className="footer-group-heading">
              {isEs ? "Fabricación" : "Manufacturing"}
            </h2>
            <Link href={localizeHref("/product-brief")}>
              {isEs ? "Empezar briefing de producto" : "Start a Product Brief"}
            </Link>
            <Link href={localizeHref("/book-a-call")}>
              {isEs ? "Reservar videollamada" : "Book a video call"}
            </Link>
            <Link href={localizeHref("/manufacturing")}>
              {isEs ? "Programa de producción" : "Manufacturing Programme"}
            </Link>
            <Link href={localizeHref("/how-we-work")}>
              {isEs ? "Cómo trabajamos" : "How we work"}
            </Link>
            <Link href={localizeHref("/about")}>
              {isEs ? "Quiénes somos" : "About"}
            </Link>
          </div>
          <div className="footer-link-group">
            <h2 className="footer-group-heading">
              {isEs
                ? "Historias, iniciativas y contacto"
                : "Stories, initiatives and contact"}
            </h2>
            <Link href={localizeHref("/stories")}>
              {isEs ? "Historias" : "Stories"}
            </Link>
            <Link href={localizeHref("/almarise")}>AlmaRise D Brand</Link>
            <Link href={localizeHref("/womens-training-initiative")}>
              {isEs ? "Formación para mujeres" : "Women's Training Initiative"}
            </Link>
            <Link href={localizeHref("/contact")}>
              {isEs ? "Contacto" : "Contact"}
            </Link>
          </div>
        </nav>

        <div className="footer-contact">
          <h2>{isEs ? "Contacto" : "Contact"}</h2>
          <address>
            <a
              className="underline"
              href="https://www.google.com/maps/place/Guru+Charan/@19.2324905,73.1534675,49m/data=!3m1!1e3!4m6!3m5!1s0x3be7943c1ba890cf:0x3c332f2cfae05f64!8m2!3d19.2325!4d73.1536!16s%2Fg%2F1pyqv_7by?entry=ttu&g_ep=EgoyMDI2MTExMC4wIKXMDSoASAFQAw%3D%3D"
            >
              2nd floor, Guru Charan Apartment
              <br />
              Ulhasnagar, Maharashtra, India, 421002
            </a>
            <a className="underline" href={`mailto:${email}`}>
              {email}
            </a>
            <a className="underline" href="mailto:namaste@karmarisedglobal.com">
              namaste@karmarisedglobal.com
            </a>
            <a className="underline" href="tel:+918530009798">
              +91 8530009798
            </a>
            <a className="underline" href="tel:+34611722276">
              +34 611 722 276
            </a>
          </address>
          <ul
            className="footer-channels"
            aria-label={isEs ? "Canales de contacto" : "Contact channels"}
            role="list"
          >
            <li>
              <a
                className="footer-channel"
                href={`mailto:${email}`}
                aria-label={isEs ? "Enviar correo electrónico" : "Email"}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m4 7 8 6 8-6" />
                </svg>
              </a>
            </li>
            <li>
              <a
                className="footer-channel"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
              >
                <span
                  className="footer-channel-icon"
                  style={{ maskImage: "url(/brand/icons/whatsapp.svg)" }}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--color-paper)]/12 pt-6 pb-24 text-[length:var(--text-xs)] text-[var(--color-paper-2)]/75 xl:py-6">
        <div className="container flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-8 xl:pe-52">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <p className="m-0 font-medium text-[var(--color-paper)]/90">
              &copy; {new Date().getFullYear()} KarmaRise D Global
            </p>
            <div className="num flex flex-wrap items-center gap-x-5 gap-y-1 text-[var(--color-paper-2)]/80">
              <span className="whitespace-nowrap">
                <span className="tracking-[var(--tracking-label)] text-[var(--color-paper-2)]/72 uppercase">
                  LLPIN
                </span>{" "}
                ACO-3878
              </span>
              <span className="whitespace-nowrap">
                <span className="tracking-[var(--tracking-label)] text-[var(--color-paper-2)]/72 uppercase">
                  GSTIN
                </span>{" "}
                27ABDFK8128R1ZL
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-0">
            <Link
              className="inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-paper-2)]/70 no-underline transition-colors hover:text-[var(--color-paper)]"
              href={localizeHref("/legal-notice")}
            >
              {isEs ? "Aviso legal" : "Legal notice"}
            </Link>
            <Link
              className="inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-paper-2)]/70 no-underline transition-colors hover:text-[var(--color-paper)]"
              href={localizeHref("/privacy-policy")}
            >
              {isEs ? "Privacidad" : "Privacy"}
            </Link>
            <Link
              className="inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-paper-2)]/70 no-underline transition-colors hover:text-[var(--color-paper)]"
              href={localizeHref("/cookie-policy")}
            >
              {isEs ? "Cookies" : "Cookies"}
            </Link>
            <Link
              className="inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-paper-2)]/70 no-underline transition-colors hover:text-[var(--color-paper)]"
              href={localizeHref("/terms")}
            >
              {isEs ? "Condiciones" : "Terms"}
            </Link>
            <a
              className="inline-flex min-h-[var(--tap-min)] items-center text-[var(--color-paper-2)]/70 no-underline transition-colors hover:text-[var(--color-paper)]"
              href="/llms.txt"
            >
              llms.txt
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
