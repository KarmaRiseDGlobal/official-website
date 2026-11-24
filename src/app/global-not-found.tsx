import type { Metadata } from "next";

import { NotFoundView } from "@/components/shell/not-found-view";
import { RootShell } from "@/components/shell/root-shell";

import "./globals.css";

export const metadata: Metadata = {
  title: "404 | KarmaRise D Global",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <RootShell lang="en" detectLanguageFromPath>
      <NotFoundView />
    </RootShell>
  );
}
