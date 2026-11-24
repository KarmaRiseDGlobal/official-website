"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { useLanguage } from "@/context/language-context";
import { stripLocalePrefix } from "@/lib/urls";

const ChatDrawer = dynamic(
  () => import("@/components/chat/chat-drawer").then((mod) => mod.ChatDrawer),
  { ssr: false },
);

// Suppress floating chat on focused conversion pages and statutory legal routes
// so it never competes with active forms or overlaps mobile submit buttons.
const HIDDEN_CHAT_ROUTES = new Set([
  "/product-brief",
  "/book-a-call",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/cookie-policy",
  "/legal-notice",
]);

function getLauncherLabel(
  basePath: string,
  isEs: boolean,
): { desktop: string; mobile: string } {
  if (basePath === "/almarise") {
    return isEs
      ? { desktop: "Dudas sobre AlmaRise D Brand", mobile: "Pregúntanos" }
      : { desktop: "Ask about AlmaRise D Brand", mobile: "Ask us" };
  }
  if (basePath === "/womens-training-initiative") {
    return isEs
      ? { desktop: "Dudas sobre formación", mobile: "Pregúntanos" }
      : { desktop: "Ask about training", mobile: "Ask us" };
  }
  return isEs
    ? { desktop: "Dudas sobre fabricación", mobile: "Pregúntanos" }
    : { desktop: "Ask about manufacturing", mobile: "Ask us" };
}

export function ChatWidget() {
  const { language } = useLanguage();
  const pathname = usePathname() || "/";
  const basePath = stripLocalePrefix(pathname);
  const isEs = language === "es";
  const isHome = basePath === "/";

  const [isOpen, setIsOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [avoidingActionZone, setAvoidingActionZone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isHome) {
      return;
    }

    const onScroll = () => {
      const hero = document.querySelector<HTMLElement>(".hero");
      const threshold = hero ? Math.max(320, hero.offsetHeight - 40) : 320;
      setScrolledPastHero(window.scrollY > threshold);
    };

    const rafId = requestAnimationFrame(onScroll);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [isHome]);

  useEffect(() => {
    if (HIDDEN_CHAT_ROUTES.has(basePath)) {
      return;
    }

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(
        "[data-chat-avoid], footer.site-footer",
      ),
    );

    if (targets.length === 0) {
      const rafId = requestAnimationFrame(() => setAvoidingActionZone(false));
      return () => cancelAnimationFrame(rafId);
    }

    const intersecting = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target);
          } else {
            intersecting.delete(entry.target);
          }
        }
        setAvoidingActionZone(intersecting.size > 0);
      },
      {
        rootMargin: "-68% 0px 0px 0px",
        threshold: 0,
      },
    );

    for (const target of targets) {
      observer.observe(target);
    }

    return () => observer.disconnect();
  }, [basePath, pathname]);

  function handleClose() {
    setIsOpen(false);
    requestAnimationFrame(() => launcherRef.current?.focus());
  }

  if (HIDDEN_CHAT_ROUTES.has(basePath)) {
    return null;
  }

  const label = getLauncherLabel(basePath, isEs);
  const isLauncherVisible =
    isOpen || ((!isHome || scrolledPastHero) && !avoidingActionZone);

  return (
    <div
      ref={containerRef}
      className="chat-widget-anchor pointer-events-none fixed end-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[var(--z-modal)] sm:end-6 sm:bottom-[max(1.5rem,env(safe-area-inset-bottom))]"
    >
      {!isOpen ? (
        <button
          ref={launcherRef}
          type="button"
          onClick={() => setIsOpen(true)}
          aria-expanded="false"
          aria-controls="karmarise-chat-drawer"
          aria-hidden={!isLauncherVisible}
          tabIndex={isLauncherVisible ? 0 : -1}
          data-visible={isLauncherVisible}
          className="chat-launcher press-scale inline-flex min-h-[var(--tap-min)] cursor-pointer items-center gap-2.5 rounded-[var(--radius-pill)] border border-[var(--color-rule-2)] bg-[var(--color-paper)] py-2 ps-2.5 pe-4 text-[length:var(--text-sm)] font-medium text-[var(--color-ink)] shadow-[var(--shadow-card)] hover:border-[var(--color-wood)] hover:bg-[var(--color-white)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--color-forest)]/30 bg-[var(--color-forest-deep)] p-1"
          >
            <Image
              src="/brand/main-logo-transparent.png"
              alt=""
              width={701}
              height={815}
              sizes="28px"
              className="h-full w-full object-contain [filter:var(--filter-logo-light)]"
            />
          </span>
          <span className="sm:hidden">{label.mobile}</span>
          <span className="hidden sm:inline">{label.desktop}</span>
        </button>
      ) : (
        <div className="pointer-events-auto">
          <ChatDrawer
            pathname={pathname}
            basePath={basePath}
            containerRef={containerRef}
            onClose={handleClose}
          />
        </div>
      )}
    </div>
  );
}
