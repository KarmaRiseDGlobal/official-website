import type { Metadata } from "next";
import { Cormorant_Garamond, Google_Sans_Flex } from "next/font/google";

import { SiteMenu } from "@/components/site-menu";

import "./globals.css";

const primary = Google_Sans_Flex({
  subsets: ["latin"],
  variable: "--font-google-sans-flex",
  axes: ["opsz", "wdth"],
  adjustFontFallback: false,
  display: "swap",
});

const display = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-cormorant",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KarmaRise D Global",
    template: "%s | KarmaRise D Global",
  },
  description:
    "KarmaRise D Global develops and delivers own-brand products through Indian manufacturing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${primary.variable} ${display.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteMenu />
        {children}
      </body>
    </html>
  );
}
