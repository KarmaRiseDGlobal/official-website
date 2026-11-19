import type { Metadata } from "next";

import { TermsPageClient } from "@/app/terms/terms-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("terms", "es");

export default function SpanishTermsPage() {
  return <TermsPageClient />;
}
