import type { Metadata } from "next";

import { NotFoundView } from "@/components/shell/not-found-view";
import { RootShell } from "@/components/shell/root-shell";
import { siteUrl } from "@/lib/urls";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Page not found | KarmaRise D Global",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <RootShell lang="en" detectLanguageFromPath>
      <NotFoundView />
    </RootShell>
  );
}
