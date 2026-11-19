"use client";

import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/newsletter-form";
import { useLanguage } from "@/context/language-context";

const email = "hola@karmarisedglobal.com";
const whatsappHref = "https://wa.me/34611722276";

export function SiteFooter() {
  const { language, localizeHref } = useLanguage();
  const isEs = language === "es";

  return (
    <footer className="site-footer">
      <div className="border-b border-[var(--color-paper)]/15 py-[var(--space-2xl)]">
        <div className="container grid items-center gap-[var(--gap-columns)] lg:grid-cols-12">
          <div className="grid gap-2 lg:col-span-5">
            <p className="footer-group-heading">
              {isEs ? "Historias y novedades" : "Stories & updates"}
            </p>
            <p className="text-[length:var(--text-lg)] font-medium text-[var(--color-paper)]">
              {isEs
                ? "Recibe nuestras historias sobre talleres, materiales y avances de la empresa."
                : "Follow new Stories from workshops, materials, and company progress."}
            </p>
          </div>
          <div className="lg:col-span-7">
            <NewsletterForm variant="footer" />
          </div>
        </div>
      </div>

      <div className="footer-inner container">
        <div className="footer-brand">
          <Image
            className="footer-logo"
            src="/brand/main-logo-transparent.png"
            alt="KarmaRise D Global"
            width={701}
            height={815}
            sizes="(max-width: 44rem) 112px, (max-width: 80rem) 12vw, 154px"
          />
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
              {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
            </Link>
            <Link href={localizeHref("/manufacturing-programme")}>
              {isEs ? "Programa de fabricación" : "Manufacturing Programme"}
            </Link>
            <Link href={localizeHref("/working-across-distance")}>
              {isEs ? "Trabajar a distancia" : "Working across distance"}
            </Link>
            <Link href={localizeHref("/about")}>
              {isEs ? "Quiénes somos" : "About"}
            </Link>
            <Link href={localizeHref("/stories")}>
              {isEs ? "Historias" : "Stories"}
            </Link>
          </div>
          <div className="footer-link-group">
            <h2 className="footer-group-heading">
              {isEs ? "Empresa y legal" : "Company and legal"}
            </h2>
            <Link href={localizeHref("/almarise")}>Almarise</Link>
            <Link href={localizeHref("/womens-training-initiative")}>
              {isEs ? "Formación para mujeres" : "Women's Training Initiative"}
            </Link>
            <Link href={localizeHref("/contact")}>
              {isEs ? "Contacto" : "Contact"}
            </Link>
            <Link href={localizeHref("/privacy-policy")}>
              {isEs ? "Política de privacidad" : "Privacy policy"}
            </Link>
            <Link href={localizeHref("/terms")}>
              {isEs ? "Condiciones" : "Terms"}
            </Link>
            <Link href={localizeHref("/cookie-policy")}>
              {isEs ? "Política de cookies" : "Cookie policy"}
            </Link>
            <Link href={localizeHref("/legal-notice")}>
              {isEs ? "Aviso legal" : "Legal notice"}
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
              +34 611722276
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
                  strokeWidth="1.75"
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

      <div className="border-t border-[var(--color-paper)]/12 py-5 text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
        <div className="container flex flex-wrap items-center justify-between gap-4">
          <p>
            {isEs ? (
              <>
                KarmaRise D Global es una marca de{" "}
                <strong className="font-semibold text-[var(--color-paper)]">
                  Karmarise Global LLP
                </strong>{" "}
                · LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL · Constituida el 15
                de mayo de 2025 (India)
              </>
            ) : (
              <>
                KarmaRise D Global is a brand of{" "}
                <strong className="font-semibold text-[var(--color-paper)]">
                  Karmarise Global LLP
                </strong>{" "}
                · LLPIN: ACO-3878 · GSTIN: 27ABDFK8128R1ZL · Incorporated 15 May
                2025 (India)
              </>
            )}
          </p>
          <div className="flex flex-wrap gap-4">
            <Link className="underline" href={localizeHref("/legal-notice")}>
              {isEs ? "Aviso legal" : "Legal notice"}
            </Link>
            <Link className="underline" href={localizeHref("/privacy-policy")}>
              {isEs ? "Privacidad" : "Privacy"}
            </Link>
            <Link className="underline" href={localizeHref("/cookie-policy")}>
              {isEs ? "Cookies" : "Cookies"}
            </Link>
            <Link className="underline" href={localizeHref("/terms")}>
              {isEs ? "Condiciones" : "Terms"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
