import type { Metadata } from "next";

import { NotFoundView } from "@/components/shell/not-found-view";

export const metadata: Metadata = {
  title: "Página no encontrada | KarmaRise D Global",
  robots: { index: false, follow: false },
};

export default function SpanishNotFound() {
  return <NotFoundView />;
}
