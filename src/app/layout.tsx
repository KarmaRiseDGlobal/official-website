import type { Metadata } from "next";
import { Marcellus, Plus_Jakarta_Sans } from "next/font/google";

import { SiteMenu } from "@/components/site-menu";

import "./globals.css";

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
