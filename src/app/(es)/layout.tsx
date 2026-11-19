import type { Metadata } from "next";

import { RootShell } from "@/components/root-shell";
import { getLayoutMetadata } from "@/lib/seo";

import "../globals.css";

export const metadata: Metadata = getLayoutMetadata("es");

export default function SpanishRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <RootShell lang="es">{children}</RootShell>;
}
