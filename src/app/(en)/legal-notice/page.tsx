import type { Metadata } from "next";

import { getRouteMetadata } from "@/lib/seo";
import {
  getLegalPageStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";
import { LegalNoticePageClient } from "@/views/legal-notice-client";

export const metadata: Metadata = getRouteMetadata("legal-notice", "en");

export default function LegalNoticePage() {
  const structuredData = getLegalPageStructuredData("en", "legalNotice");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <LegalNoticePageClient lang="en" />
    </>
  );
}
