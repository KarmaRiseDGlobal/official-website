import { Marcellus, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { preconnect, prefetchDNS, preload } from "react-dom";

import { ChatWidget } from "@/components/chat-widget";
import { PageTransition } from "@/components/page-transition";
import { SiteLoader } from "@/components/site-loader";
import { SiteMenu } from "@/components/site-menu";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LanguageProvider } from "@/context/language-context";
import {
  LOADER_CRITICAL_CSS,
  LOADER_NOSCRIPT_CSS,
  LOADER_PREPAINT_SCRIPT,
} from "@/lib/loader";
import type { SiteLanguage } from "@/lib/seo";

const primary = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jakarta",
  display: "swap",
});

const display = Marcellus({
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
  variable: "--font-marcellus",
  display: "swap",
});

export function RootShell({
  lang,
  detectLanguageFromPath = false,
  children,
}: Readonly<{
  lang: SiteLanguage;
  detectLanguageFromPath?: boolean;
  children: ReactNode;
}>) {
  preconnect("https://cdn.sanity.io", { crossOrigin: "anonymous" });
  prefetchDNS("https://cdn.sanity.io");
  preload("/brand/main-logo-transparent.png", {
    as: "image",
    fetchPriority: "high",
  });

  return (
    <html
      lang={lang}
      className={`${primary.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: LOADER_PREPAINT_SCRIPT }} />
        <style dangerouslySetInnerHTML={{ __html: LOADER_CRITICAL_CSS }} />
        <noscript>
          <style dangerouslySetInnerHTML={{ __html: LOADER_NOSCRIPT_CSS }} />
        </noscript>
        <LanguageProvider
          initialLanguage={detectLanguageFromPath ? undefined : lang}
        >
          <SmoothScroll />
          <SiteLoader />
          <PageTransition />
          <a className="skip-link" href="#main">
            {lang === "es" ? "Saltar al contenido" : "Skip to content"}
          </a>
          <SiteMenu />
          {children}
          <ChatWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
