"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useLanguage, type SiteLanguage } from "@/context/language-context";
import { stripLocalePrefix } from "@/lib/seo";

interface NavLinkItem {
  href: string;
  label: Record<SiteLanguage, string>;
}

const primaryLinks: readonly NavLinkItem[] = [
  { href: "/", label: { en: "Home", es: "Inicio" } },
  {
    href: "/manufacturing-programme",
    label: {
      en: "Manufacturing Programme",
      es: "Programa de fabricación",
    },
  },
  {
    href: "/working-across-distance",
    label: {
      en: "Working across distance",
      es: "Trabajar a distancia",
    },
  },
  { href: "/about", label: { en: "About", es: "Quiénes somos" } },
  { href: "/stories", label: { en: "Stories", es: "Historias" } },
];

const secondaryLinks: readonly NavLinkItem[] = [
  { href: "/almarise", label: { en: "Almarise", es: "Almarise" } },
  {
    href: "/womens-training-initiative",
    label: {
      en: "Women's Training Initiative",
      es: "Formación para mujeres",
    },
  },
  {
    href: "/contact",
    label: {
      en: "Contact",
      es: "Contacto",
    },
  },
];

const darkHeroRoutes = new Set([
  "/",
  "/about",
  "/working-across-distance",
  "/almarise",
]);

export function SiteMenu() {
  const { language, setLanguage, languages, localizeHref } = useLanguage();
  const [open, setOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const basePath = stripLocalePrefix(pathname || "/");
  const heroTone = darkHeroRoutes.has(basePath) ? "dark" : "light";
  const pageToScroll = useRef<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const langContainerRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  const isEs = language === "es";
  const activeLanguageOption =
    languages.find((item) => item.code === language) ?? languages[0]!;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!langMenuOpen) return;

    const onPointerDown = (event: MouseEvent) => {
      if (
        langContainerRef.current &&
        event.target instanceof Node &&
        !langContainerRef.current.contains(event.target)
      ) {
        setLangMenuOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setLangMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [langMenuOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!open) return;

      if (event.key === "Escape") {
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.dataset.menuOpen = open ? "true" : "false";

    if (open && !wasOpenRef.current) {
      requestAnimationFrame(() => closeRef.current?.focus());
    } else if (!open && wasOpenRef.current && !pageToScroll.current) {
      triggerRef.current?.focus();
    }
    wasOpenRef.current = open;

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      delete document.body.dataset.menuOpen;
    };
  }, [open]);

  useEffect(() => {
    if (open || pageToScroll.current !== pathname) return;

    pageToScroll.current = null;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [open, pathname]);

  function handleNavigate(
    href: string,
    event: React.MouseEvent<HTMLAnchorElement>,
  ) {
    setOpen(false);
    setLangMenuOpen(false);
    pageToScroll.current = href;
    if (href === pathname) {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <>
      <header
        className={scrolled ? "site-header scrolled" : "site-header"}
        data-hero-tone={heroTone}
      >
        <div className="header-inner">
          <button
            ref={triggerRef}
            className="menu-trigger"
            type="button"
            aria-label={
              open
                ? isEs
                  ? "Cerrar menú"
                  : "Close menu"
                : isEs
                  ? "Abrir menú"
                  : "Open menu"
            }
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => {
              setLangMenuOpen(false);
              setOpen((current) => !current);
            }}
          >
            <span className="menu-trigger-lines" aria-hidden="true">
              <span />
              <span />
            </span>
            <span>{isEs ? "Menú" : "Menu"}</span>
          </button>

          <Link
            className="brand-lockup"
            href={localizeHref("/")}
            aria-label="KarmaRise D Global"
            onClick={() => {
              setOpen(false);
              setLangMenuOpen(false);
            }}
          >
            <Image
              src="/brand/main-logo-transparent.png"
              alt=""
              width={701}
              height={815}
              priority
            />
          </Link>

          <div ref={langContainerRef} className="header-lang">
            <button
              type="button"
              className="header-lang-trigger"
              aria-label={
                isEs ? "Cambiar idioma del sitio" : "Change site language"
              }
              aria-haspopup="listbox"
              aria-expanded={langMenuOpen}
              onClick={() => setLangMenuOpen((current) => !current)}
            >
              <span>{activeLanguageOption.label}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`h-3.5 w-3.5 transition-transform ${
                  langMenuOpen ? "rotate-180" : ""
                }`}
              >
                <path d="m4 6 4 4 4-4" />
              </svg>
            </button>

            {langMenuOpen ? (
              <ul
                role="listbox"
                aria-label={
                  isEs ? "Idiomas disponibles" : "Available languages"
                }
                className="header-lang-menu"
              >
                {languages.map((option) => {
                  const isSelected = option.code === language;
                  return (
                    <li
                      key={option.code}
                      role="option"
                      aria-selected={isSelected}
                    >
                      <button
                        type="button"
                        className="header-lang-option"
                        data-active={isSelected}
                        onClick={() => {
                          setLangMenuOpen(false);
                          setOpen(false);
                          setLanguage(option.code);
                        }}
                      >
                        <span>{option.label}</span>
                        <span className="header-lang-code">
                          {option.shortLabel}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>
      </header>

      <div
        ref={panelRef}
        className="menu-panel"
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={isEs ? "Navegación del sitio" : "Site navigation"}
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="menu-panel-inner container">
          <div className="menu-panel-heading">
            <p>
              {isEs
                ? "KarmaRise D Global · India y España"
                : "KarmaRise D Global · India & Spain"}
            </p>
            <button
              ref={closeRef}
              className="menu-close"
              type="button"
              onClick={() => setOpen(false)}
            >
              {isEs ? "Cerrar" : "Close"}
            </button>
          </div>

          <nav
            className="menu-links"
            aria-label={isEs ? "Navegación principal" : "Primary navigation"}
          >
            {primaryLinks.map((link) => {
              const localizedHref = localizeHref(link.href);
              const isCurrent =
                link.href === "/"
                  ? basePath === "/"
                  : basePath === link.href ||
                    basePath.startsWith(`${link.href}/`);
              return (
                <Link
                  href={localizedHref}
                  key={link.href}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={(event) => handleNavigate(localizedHref, event)}
                >
                  {link.label[language]}
                </Link>
              );
            })}
          </nav>

          <aside className="menu-aside">
            <div className="menu-aside-copy">
              <Image
                className="menu-aside-logo"
                src="/brand/main-logo-transparent.png"
                alt=""
                width={701}
                height={815}
              />
              <h2>
                {isEs
                  ? "Tu producto, acompañado de principio a fin."
                  : "Your product, carried through."}
              </h2>
              <p className="mt-4 max-w-[34ch] text-[length:var(--text-md)] leading-[1.6] text-[var(--color-ink-2)]">
                {isEs
                  ? "Alma y Shirish conectan marcas en España y Europa con fabricación en toda la India, desde el Product Brief hasta la entrega."
                  : "Alma and Shirish connect brands in Spain and across Europe with manufacturing across India, from Product Brief through delivery."}
              </p>

              <Link
                href={localizeHref("/product-brief")}
                aria-current={
                  basePath === "/product-brief" ? "page" : undefined
                }
                onClick={(event) =>
                  handleNavigate(localizeHref("/product-brief"), event)
                }
              >
                {isEs ? "Iniciar un Product Brief" : "Start a Product Brief"}
              </Link>

              <div className="menu-secondary">
                <p className="menu-secondary-label">
                  {isEs
                    ? "Iniciativas y contacto directo"
                    : "Initiatives and direct contact"}
                </p>
                <nav
                  className="menu-secondary-links"
                  aria-label={
                    isEs ? "Navegación secundaria" : "Secondary navigation"
                  }
                >
                  {secondaryLinks.map((link) => {
                    const localizedHref = localizeHref(link.href);
                    return (
                      <Link
                        key={link.href}
                        href={localizedHref}
                        aria-current={
                          basePath === link.href ? "page" : undefined
                        }
                        onClick={(event) =>
                          handleNavigate(localizedHref, event)
                        }
                      >
                        {link.label[language]}
                      </Link>
                    );
                  })}
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
