import type { Metadata } from "next";

import { getRouteMetadata } from "@/lib/seo";
import {
  getLegalPageStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";
import { TermsPageClient } from "@/views/terms-client";

export const metadata: Metadata = getRouteMetadata("terms", "en");

export default function TermsPage() {
  const structuredData = getLegalPageStructuredData("en", "terms");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <TermsPageClient lang="en" />
    </>
  );
}
