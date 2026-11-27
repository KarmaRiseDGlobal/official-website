import type { Metadata } from "next";

import { getRouteMetadata } from "@/lib/seo";
import {
  getLegalPageStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";
import { TermsPageClient } from "@/views/terms-client";

export const metadata: Metadata = getRouteMetadata("terms", "es");

export default function SpanishTermsPage() {
  const structuredData = getLegalPageStructuredData("es", "terms");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <TermsPageClient lang="es" />
    </>
  );
}
