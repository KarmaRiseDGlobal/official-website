import type { Metadata } from "next";

import { getRouteMetadata } from "@/lib/seo";
import {
  getLegalPageStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";
import { LegalNoticePageClient } from "@/views/legal-notice-client";

export const metadata: Metadata = getRouteMetadata("legal-notice", "es");

export default function SpanishLegalNoticePage() {
  const structuredData = getLegalPageStructuredData("es", "legalNotice");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <LegalNoticePageClient lang="es" />
    </>
  );
}
