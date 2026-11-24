"use client";

import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type MouseEvent,
} from "react";

import { SCROLL_TOP_EVENT } from "@/components/motion/smooth-scroll";
import { useLanguage } from "@/context/language-context";
import {
  HEADER_COPY,
  MENU_SHOWCASE_CARDS,
  PRIMARY_NAV_LINKS,
  SECONDARY_NAV_LINKS,
} from "@/data/navigation";
import { resolveAdaptiveLightHeaderBg } from "@/lib/adaptive-header-surface";
import { localizePath, stripLocalePrefix } from "@/lib/urls";

const DARK_HERO_ROUTES = new Set(["/", "/about", "/how-we-work", "/almarise"]);
const SCROLL_THRESHOLD = 120;
const SCROLL_HIDE_DELTA = 8;
const SCROLL_SHOW_DELTA = 14;
const TRANSITION_ENABLE_DELAY_MS = 180;
const DESKTOP_MENU_MIN_WIDTH = 860;

type ScrollDirection = "down" | "up" | null;

interface HeaderScrollState {
  readonly scrolled: boolean;
  readonly hidden: boolean;
  readonly hasTransitions: boolean;
}

const INITIAL_SCROLL_STATE: HeaderScrollState = {
  scrolled: false,
  hidden: false,
  hasTransitions: false,
};

function normalizePath(path: string): string {
  const withoutQueryOrHash = path.split(/[?#]/)[0] || "/";
  return withoutQueryOrHash.replace(/\/+$/, "") || "/";
}

function isLinkCurrent(linkHref: string, basePath: string): boolean {
  const targetBase = normalizePath(linkHref);
  const currentBase = normalizePath(basePath);
  if (targetBase === "/") {
    return currentBase === "/";
  }
  return currentBase === targetBase || currentBase.startsWith(`${targetBase}/`);
}

export function SiteMenu() {
  const { language, setLanguage, languages, localizeHref } = useLanguage();
  const pathname = usePathname();
  const basePath = stripLocalePrefix(pathname || "/");
  const heroTone = DARK_HERO_ROUTES.has(normalizePath(basePath))
    ? "dark"
    : "light";

  const [open, setOpen] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [scrollState, setScrollState] =
    useState<HeaderScrollState>(INITIAL_SCROLL_STATE);

  const headerRef = useRef<HTMLElement>(null);
  const menuRootRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const lastScrollYRef = useRef(0);
  const anchorScrollYRef = useRef(0);
  const scrollDirectionRef = useRef<ScrollDirection>(null);
  const transitionTimerRef = useRef<number | null>(null);
  const navigatingOutRef = useRef(false);
  const pageToScrollRef = useRef<string | null>(null);
  const wasOpenRef = useRef(false);

  const clearTransitionTimer = useCallback(() => {
    if (transitionTimerRef.current !== null) {
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = null;
    }
  }, []);

  const clearMenuTimeline = useCallback(() => {
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }
  }, []);

  const finalizeMenuClose = useCallback(() => {
    clearMenuTimeline();
    const root = menuRootRef.current;
    if (surfaceRef.current) {
      gsap.set(surfaceRef.current, { clearProps: "clipPath,opacity" });
    }
    if (backdropRef.current) {
      gsap.set(backdropRef.current, { clearProps: "opacity" });
    }
    if (root) {
      const animatedNodes = root.querySelectorAll<HTMLElement>(
        ".menu-header-bar, .menu-showcase-card, .menu-primary-item, .menu-secondary-text",
      );
      if (animatedNodes.length > 0) {
        gsap.set(animatedNodes, { clearProps: "opacity,transform,filter" });
      }
    }
    setPanelVisible(false);
    delete document.body.dataset.menuOpen;

    if (!navigatingOutRef.current) {
      triggerRef.current?.focus();
    }
    navigatingOutRef.current = false;
  }, [clearMenuTimeline]);

  // Headroom-style scroll state machine with accumulated hysteresis for Lenis and native scroll.
  useEffect(() => {
    const initialY = Math.max(0, window.scrollY);
    lastScrollYRef.current = initialY;
    anchorScrollYRef.current = initialY;
    scrollDirectionRef.current = null;

    const syncInitial = window.requestAnimationFrame(() => {
      const y = Math.max(0, window.scrollY);
      lastScrollYRef.current = y;
      anchorScrollYRef.current = y;
      scrollDirectionRef.current = null;
      if (y > SCROLL_THRESHOLD) {
        setScrollState({
          scrolled: true,
          hidden: false,
          hasTransitions: true,
        });
      } else {
        setScrollState(INITIAL_SCROLL_STATE);
      }
    });

    const onScroll = () => {
      if (document.body.dataset.menuOpen === "true") {
        return;
      }

      const currentY = Math.max(0, window.scrollY);

      if (currentY <= SCROLL_THRESHOLD) {
        clearTransitionTimer();
        lastScrollYRef.current = currentY;
        anchorScrollYRef.current = currentY;
        scrollDirectionRef.current = null;
        setScrollState((prev) =>
          !prev.scrolled && !prev.hidden && !prev.hasTransitions
            ? prev
            : INITIAL_SCROLL_STATE,
        );
        return;
      }

      const step = currentY - lastScrollYRef.current;
      if (step === 0) {
        return;
      }

      const direction: Exclude<ScrollDirection, null> =
        step > 0 ? "down" : "up";
      if (direction !== scrollDirectionRef.current) {
        scrollDirectionRef.current = direction;
        anchorScrollYRef.current = lastScrollYRef.current;
      }
      lastScrollYRef.current = currentY;

      const travel = Math.abs(currentY - anchorScrollYRef.current);
      const maxScroll = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      );
      const atBottomEdge =
        maxScroll > SCROLL_THRESHOLD && currentY >= maxScroll - 2;

      setScrollState((prev) => {
        const wasScrolled = prev.scrolled;
        if (!wasScrolled && transitionTimerRef.current === null) {
          transitionTimerRef.current = window.setTimeout(() => {
            transitionTimerRef.current = null;
            setScrollState((current) =>
              current.scrolled ? { ...current, hasTransitions: true } : current,
            );
          }, TRANSITION_ENABLE_DELAY_MS);
        }

        let nextHidden = prev.hidden;
        if (!wasScrolled) {
          nextHidden = direction === "down";
        } else if (
          direction === "down" &&
          !prev.hidden &&
          travel >= SCROLL_HIDE_DELTA
        ) {
          nextHidden = true;
        } else if (
          direction === "up" &&
          prev.hidden &&
          !atBottomEdge &&
          travel >= SCROLL_SHOW_DELTA
        ) {
          nextHidden = false;
        }

        if (prev.scrolled && prev.hidden === nextHidden) {
          return prev;
        }

        return {
          scrolled: true,
          hidden: nextHidden,
          hasTransitions: prev.hasTransitions,
        };
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.cancelAnimationFrame(syncInitial);
      clearTransitionTimer();
      window.removeEventListener("scroll", onScroll);
    };
  }, [clearTransitionTimer, pathname]);

  // Drop stale header focus when hiding on scroll so focus-visible does not pin the bar open.
  useEffect(() => {
    if (!scrollState.hidden && !open) {
      return;
    }

    const headerEl = headerRef.current;
    const activeEl = document.activeElement;
    if (
      headerEl &&
      activeEl instanceof HTMLElement &&
      headerEl.contains(activeEl)
    ) {
      activeEl.blur();
    }
  }, [scrollState.hidden, open]);

  // Adapt the scrolled navbar surface seamlessly to lighter page sections (never darker shades).
  useEffect(() => {
    const headerEl = headerRef.current;
    if (!headerEl) {
      return;
    }

    if (!scrollState.scrolled) {
      headerEl.style.removeProperty("--header-adaptive-bg");
      return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) {
      return;
    }

    let rafId: number | null = null;
    let lastApplied: string | null = null;

    const syncSurface = () => {
      rafId = null;
      const nextColor = resolveAdaptiveLightHeaderBg(headerEl, ctx);
      if (nextColor === lastApplied) {
        return;
      }
      lastApplied = nextColor;
      if (nextColor) {
        headerEl.style.setProperty("--header-adaptive-bg", nextColor);
      } else {
        headerEl.style.removeProperty("--header-adaptive-bg");
      }
    };

    const scheduleSync = () => {
      if (rafId !== null) {
        return;
      }
      rafId = window.requestAnimationFrame(syncSurface);
    };

    scheduleSync();
    window.addEventListener("scroll", scheduleSync, { passive: true });
    window.addEventListener("resize", scheduleSync, { passive: true });

    return () => {
      if (rafId !== null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleSync);
      window.removeEventListener("resize", scheduleSync);
    };
  }, [scrollState.scrolled, pathname]);

  // Choreographed GSAP menu open / reverse close timeline with reduced-motion fallback.
  useEffect(() => {
    const root = menuRootRef.current;
    const backdrop = backdropRef.current;
    const surface = surfaceRef.current;

    if (!root || !backdrop || !surface) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (open) {
      document.body.dataset.menuOpen = "true";

      if (!wasOpenRef.current) {
        window.requestAnimationFrame(() => {
          closeRef.current?.focus();
        });
      }
      wasOpenRef.current = true;

      if (timelineRef.current) {
        timelineRef.current.timeScale(1).play();
        return;
      }

      const headerBar = root.querySelector<HTMLElement>(".menu-header-bar");
      const showcaseCards = Array.from(
        root.querySelectorAll<HTMLElement>(".menu-showcase-card"),
      );
      const primaryItems = Array.from(
        root.querySelectorAll<HTMLElement>(".menu-primary-item"),
      );
      const secondaryTexts = Array.from(
        root.querySelectorAll<HTMLElement>(".menu-secondary-text"),
      );

      if (reducedMotion) {
        const tl = gsap.timeline({
          onReverseComplete: finalizeMenuClose,
        });
        tl.fromTo(
          [backdrop, surface],
          { opacity: 0 },
          { opacity: 1, duration: 0.16, ease: "power1.out" },
          0,
        );
        timelineRef.current = tl;
        return;
      }

      const isDesktopPanel = window.innerWidth >= DESKTOP_MENU_MIN_WIDTH;
      const panelRadius = isDesktopPanel ? "12px" : "0px";
      const closedClip = `inset(0% 100% 100% 0% round ${panelRadius})`;
      const openClip = `inset(0% 0% 0% 0% round ${panelRadius})`;

      const tl = gsap.timeline({
        onReverseComplete: finalizeMenuClose,
      });

      tl.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.65, ease: "power3.inOut" },
        0,
      );

      tl.fromTo(
        surface,
        { clipPath: closedClip, opacity: 1 },
        { clipPath: openClip, duration: 0.68, ease: "power3.inOut" },
        0,
      );

      if (headerBar) {
        tl.fromTo(
          headerBar,
          { opacity: 0 },
          { opacity: 1, duration: 0.36, ease: "power2.out" },
          0.34,
        );
      }

      if (showcaseCards.length > 0) {
        tl.fromTo(
          showcaseCards,
          { opacity: 0, filter: "blur(8px)", y: 12 },
          {
            opacity: 1,
            filter: "blur(0px)",
            y: 0,
            duration: 0.48,
            ease: "power2.out",
            stagger: 0.08,
            onComplete: () => {
              gsap.set(showcaseCards, { clearProps: "filter" });
            },
          },
          0.42,
        );
      }

      if (primaryItems.length > 0) {
        tl.fromTo(
          primaryItems,
          { y: 20, opacity: 0, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.34,
            ease: "power2.out",
            stagger: 0.05,
            onComplete: () => {
              gsap.set(primaryItems, { clearProps: "filter" });
            },
          },
          0.56,
        );
      }

      if (secondaryTexts.length > 0) {
        tl.fromTo(
          secondaryTexts,
          { yPercent: 105 },
          {
            yPercent: 0,
            duration: 0.32,
            ease: "power2.out",
            stagger: 0.045,
          },
          0.7,
        );
      }

      timelineRef.current = tl;
      return;
    }

    wasOpenRef.current = false;

    if (!panelVisible) {
      return;
    }

    if (navigatingOutRef.current) {
      const frame = window.requestAnimationFrame(finalizeMenuClose);
      return () => window.cancelAnimationFrame(frame);
    }

    if (timelineRef.current) {
      timelineRef.current.timeScale(reducedMotion ? 1 : 1.25).reverse();
      return;
    }

    const frame = window.requestAnimationFrame(finalizeMenuClose);
    return () => window.cancelAnimationFrame(frame);
  }, [open, panelVisible, finalizeMenuClose]);

  // Cleanup on unmount so scroll lock and GSAP timelines are always reverted.
  useEffect(() => {
    return () => {
      clearMenuTimeline();
      delete document.body.dataset.menuOpen;
    };
  }, [clearMenuTimeline]);

  // Escape key & focus trap while the menu dialog is open.
  useEffect(() => {
    if (!open) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        return;
      }

      if (event.key !== "Tab" || !surfaceRef.current) {
        return;
      }

      const focusable = Array.from(
        surfaceRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => el.offsetParent !== null);

      if (focusable.length === 0) {
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) {
        return;
      }

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const onPopState = () => {
      navigatingOutRef.current = true;
      setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    window.addEventListener("popstate", onPopState);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("popstate", onPopState);
    };
  }, [open]);

  // Ensure new page starts scrolled cleanly to top after navigation from menu.
  useEffect(() => {
    if (open || !pageToScrollRef.current) {
      return;
    }
    if (normalizePath(pageToScrollRef.current) !== normalizePath(pathname)) {
      return;
    }

    pageToScrollRef.current = null;
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [open, pathname]);

  function openMenu() {
    navigatingOutRef.current = false;
    setPanelVisible(true);
    setOpen(true);
  }

  function closeMenu() {
    navigatingOutRef.current = false;
    setOpen(false);
  }

  function scrollToTop() {
    delete document.body.dataset.menuOpen;
    window.requestAnimationFrame(() => {
      window.dispatchEvent(new Event(SCROLL_TOP_EVENT));
    });
  }

  function handleNavigate(href: string, event: MouseEvent<HTMLAnchorElement>) {
    const hasQuery = href.includes("?");
    const samePathname = normalizePath(href) === normalizePath(pathname || "/");

    if (samePathname && !hasQuery) {
      event.preventDefault();
      if (window.location.hash) {
        window.history.replaceState(null, "", href);
      }
      navigatingOutRef.current = false;
      setOpen(false);
      scrollToTop();
      return;
    }

    navigatingOutRef.current = true;
    pageToScrollRef.current = href;
    setOpen(false);
  }

  function handleLanguageSelect(
    nextCode: (typeof languages)[number]["code"],
    event: MouseEvent<HTMLAnchorElement>,
  ) {
    event.preventDefault();
    if (nextCode === language) {
      return;
    }
    navigatingOutRef.current = true;
    setOpen(false);
    setLanguage(nextCode);
  }

  const headerClasses = [
    "site-header",
    scrollState.scrolled ? "scrolled" : "",
    scrollState.hidden || open ? "is-hidden" : "",
    scrollState.hasTransitions || open ? "has-transitions" : "",
  ]
    .filter(Boolean)
    .join(" ");

  function renderLanguageSwitcher(variant: "header" | "menu") {
    return (
      <nav
        className={
          variant === "header"
            ? "header-lang-inline"
            : "header-lang-inline menu-lang-inline"
        }
        aria-label={HEADER_COPY.languageNavAria[language]}
      >
        {languages.map((option, index) => {
          const isSelected = option.code === language;
          const targetHref = localizePath(basePath, option.code);
          return (
            <Fragment key={option.code}>
              {index > 0 ? (
                <span className="header-lang-sep" aria-hidden="true">
                  /
                </span>
              ) : null}
              <Link
                href={targetHref}
                hrefLang={option.code}
                aria-current={isSelected ? "true" : undefined}
                className="header-lang-link"
                data-active={isSelected}
                onClick={(event) => handleLanguageSelect(option.code, event)}
              >
                {option.shortLabel}
              </Link>
            </Fragment>
          );
        })}
      </nav>
    );
  }

  return (
    <>
      <header
        ref={headerRef}
        role="banner"
        aria-label={HEADER_COPY.bannerLabel[language]}
        className={headerClasses}
        data-hero-tone={heroTone}
        inert={open}
      >
        <div className="header-inner">
          <button
            ref={triggerRef}
            className="header-link header-menu-toggle"
            type="button"
            aria-label={
              open
                ? HEADER_COPY.closeMenuAria[language]
                : HEADER_COPY.openMenuAria[language]
            }
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => (open ? closeMenu() : openMenu())}
          >
            {HEADER_COPY.menuButton[language]}
          </button>

          <Link
            className="brand-lockup"
            href={localizeHref("/")}
            aria-label={HEADER_COPY.brandHomeAria[language]}
            onClick={(event) => handleNavigate(localizeHref("/"), event)}
          >
            <Image
              className="brand-mark-emblem"
              src="/brand/emblem-transparent.png"
              alt=""
              width={768}
              height={768}
              sizes="32px"
              priority
            />
            <Image
              className="brand-mark-full"
              src="/brand/main-logo-transparent.png"
              alt=""
              width={701}
              height={815}
              sizes="72px"
              priority
            />
          </Link>

          <div className="header-right-actions">
            {renderLanguageSwitcher("header")}
          </div>
        </div>
      </header>

      <div
        ref={menuRootRef}
        className="menu-panel"
        id="site-menu"
        role="dialog"
        aria-modal="true"
        aria-label={HEADER_COPY.dialogLabel[language]}
        data-open={panelVisible}
        aria-hidden={!panelVisible}
        inert={!panelVisible}
      >
        <div
          ref={backdropRef}
          className="menu-backdrop"
          aria-hidden="true"
          onClick={closeMenu}
        />

        <div ref={surfaceRef} className="menu-surface" data-lenis-prevent>
          <div className="menu-header-bar">
            <button
              ref={closeRef}
              className="menu-close"
              type="button"
              aria-label={HEADER_COPY.closeMenuAria[language]}
              onClick={closeMenu}
            >
              {HEADER_COPY.closeButton[language]}
            </button>

            <Link
              className="menu-mobile-logo"
              href={localizeHref("/")}
              aria-label={HEADER_COPY.brandHomeAria[language]}
              onClick={(event) => handleNavigate(localizeHref("/"), event)}
            >
              <Image
                src="/brand/emblem-transparent.png"
                alt=""
                width={768}
                height={768}
                sizes="32px"
              />
            </Link>

            {renderLanguageSwitcher("menu")}
          </div>

          <div className="menu-nav-column" data-lenis-prevent>
            <nav
              className="menu-nav-primary"
              aria-label={HEADER_COPY.primaryNavAria[language]}
            >
              <ul>
                {PRIMARY_NAV_LINKS.map((link) => {
                  const localizedHref = localizeHref(link.href);
                  const isCurrent = isLinkCurrent(link.href, basePath);
                  return (
                    <li key={link.href} className="menu-primary-item">
                      <Link
                        href={localizedHref}
                        aria-current={isCurrent ? "page" : undefined}
                        onClick={(event) =>
                          handleNavigate(localizedHref, event)
                        }
                      >
                        {link.label[language]}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <nav
              className="menu-nav-secondary"
              aria-label={HEADER_COPY.secondaryNavAria[language]}
            >
              <ul>
                {SECONDARY_NAV_LINKS.map((link) => {
                  const localizedHref = localizeHref(link.href);
                  const isCurrent = isLinkCurrent(link.href, basePath);
                  return (
                    <li key={link.href} className="menu-secondary-item">
                      <span className="menu-secondary-text">
                        <Link
                          href={localizedHref}
                          aria-current={isCurrent ? "page" : undefined}
                          onClick={(event) =>
                            handleNavigate(localizedHref, event)
                          }
                        >
                          {link.label[language]}
                        </Link>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          <aside
            className="menu-showcase-column"
            aria-label={HEADER_COPY.showcaseAria[language]}
            data-lenis-prevent
          >
            <div className="menu-showcase-track">
              {MENU_SHOWCASE_CARDS.map((card) => {
                const localizedHref = localizeHref(card.href);
                return (
                  <Link
                    key={card.id}
                    href={localizedHref}
                    className="menu-showcase-card"
                    onClick={(event) => handleNavigate(localizedHref, event)}
                  >
                    <div className="menu-card-media">
                      <Image
                        src={card.image}
                        alt={card.imageAlt[language]}
                        fill
                        sizes="(max-width: 859px) 44vw, 340px"
                        className={`menu-card-img object-cover ${card.imagePosition}`}
                      />
                      <div className="menu-card-pills" aria-hidden="true">
                        <span className="menu-card-pill menu-card-pill-label">
                          {card.pillLabel[language]}
                        </span>
                        <span className="menu-card-pill menu-card-pill-arrow">
                          <svg
                            viewBox="0 0 16 16"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3.5 8h9" />
                            <path d="m8.75 4.25 3.75 3.75-3.75 3.75" />
                          </svg>
                        </span>
                      </div>
                    </div>
                    <span className="menu-card-title">
                      {card.title[language]}
                    </span>
                  </Link>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
