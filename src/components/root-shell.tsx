import { Marcellus, Plus_Jakarta_Sans } from "next/font/google";
import type { ReactNode } from "react";

import { ChatWidget } from "@/components/chat-widget";
import { SiteMenu } from "@/components/site-menu";
import { SmoothScroll } from "@/components/smooth-scroll";
import { LanguageProvider } from "@/context/language-context";
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
  return (
    <html lang={lang} className={`${primary.variable} ${display.variable}`}>
      <body>
        <LanguageProvider
          initialLanguage={detectLanguageFromPath ? undefined : lang}
        >
          <SmoothScroll />
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
