"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const primaryLinks = [
  { href: "/", label: "Home" },
  { href: "/manufacturing-programme", label: "Manufacturing Programme" },
  { href: "/working-across-distance", label: "Working across distance" },
  { href: "/about", label: "About" },
  { href: "/stories", label: "Stories" },
  { href: "/product-brief", label: "Start a Product Brief" },
];

const secondaryLinks = [
  { href: "/almarise", label: "Almarise" },
  { href: "/womens-training-initiative", label: "Women's Training Initiative" },
  { href: "/contact", label: "Contact" },
];

const darkHeroRoutes = new Set([
  "/",
  "/about",
  "/working-across-distance",
  "/almarise",
]);

export function SiteMenu() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const heroTone = darkHeroRoutes.has(pathname) ? "dark" : "light";
  const pageToScroll = useRef<string | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((current) => !current)}
          >
            <span className="menu-trigger-lines" aria-hidden="true">
              <span />
              <span />
            </span>
            <span>Menu</span>
          </button>

          <Link
            className="brand-lockup"
            href="/"
            aria-label="KarmaRise D Global home"
          >
            <Image
              src="/brand/main-logo-transparent.png"
              alt=""
              width={701}
              height={815}
              priority
            />
          </Link>

          <Link
            className="header-brief"
            href="/product-brief"
            onClick={() => setOpen(false)}
          >
            Start a Product Brief
          </Link>
        </div>
      </header>

      <div
        ref={panelRef}
        className="menu-panel"
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        data-open={open}
        aria-hidden={!open}
        inert={!open}
      >
        <div className="menu-panel-inner container">
          <div className="menu-panel-heading">
            <p>Product Brief to Bulk Order delivery</p>
            <button
              ref={closeRef}
              className="menu-close"
              type="button"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <nav className="menu-links" aria-label="Primary navigation">
            {primaryLinks.map((link) => {
              const isCurrent =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href ||
                    pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  href={link.href}
                  key={link.href}
                  aria-current={isCurrent ? "page" : undefined}
                  onClick={(event) => handleNavigate(link.href, event)}
                >
                  {link.label}
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
              <h2>Your product, carried through.</h2>
              <Link
                href="/product-brief"
                onClick={(event) => handleNavigate("/product-brief", event)}
              >
                Start your Product Brief
              </Link>

              <div className="menu-secondary">
                <p className="menu-secondary-label">
                  Wider company story and direct contact
                </p>
                <nav
                  className="menu-secondary-links"
                  aria-label="Secondary navigation"
                >
                  {secondaryLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={pathname === link.href ? "page" : undefined}
                      onClick={(event) => handleNavigate(link.href, event)}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
