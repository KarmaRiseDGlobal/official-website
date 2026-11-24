import { Marcellus, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";
import { preconnect, prefetchDNS } from "react-dom";

import { ChatWidget } from "@/components/chat/chat-widget";
import { PageTransition } from "@/components/motion/page-transition";
import { SmoothScroll } from "@/components/motion/smooth-scroll";
import { SiteMenu } from "@/components/shell/site-menu";
import { LanguageProvider } from "@/context/language-context";
import { LOADER_PREPAINT_SCRIPT } from "@/lib/loader";
import type { SiteLanguage } from "@/lib/urls";

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

  return (
    <html
      lang={lang}
      className={`${primary.variable} ${display.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: LOADER_PREPAINT_SCRIPT }} />
        <LanguageProvider
          initialLanguage={detectLanguageFromPath ? undefined : lang}
        >
          <SmoothScroll />
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
