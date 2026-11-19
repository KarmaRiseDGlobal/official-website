import type { Metadata } from "next";

import { RootShell } from "@/components/root-shell";
import { getLayoutMetadata } from "@/lib/seo";

import "../globals.css";

export const metadata: Metadata = getLayoutMetadata("en");

export default function EnglishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootShell lang="en">{children}</RootShell>;
}
