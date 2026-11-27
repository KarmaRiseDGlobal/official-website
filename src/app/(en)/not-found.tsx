import type { Metadata } from "next";

import { NotFoundView } from "@/components/shell/not-found-view";

export const metadata: Metadata = {
  title: "Page not found | KarmaRise D Global",
  robots: { index: false, follow: false },
};

export default function EnglishNotFound() {
  return <NotFoundView />;
}
