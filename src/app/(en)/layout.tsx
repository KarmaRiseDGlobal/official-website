import type { Metadata, Viewport } from "next";

import { RootShell } from "@/components/root-shell";
import { getLayoutMetadata } from "@/lib/seo";

import "../globals.css";

export const metadata: Metadata = getLayoutMetadata("en");

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#111914",
};

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootShell lang="en">{children}</RootShell>;
}
