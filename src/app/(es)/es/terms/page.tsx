import type { Metadata } from "next";

import { TermsPageClient } from "@/views/terms-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("terms", "es");

export default function SpanishTermsPage() {
  return <TermsPageClient lang="es" />;
}
