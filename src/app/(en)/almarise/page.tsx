import type { Metadata } from "next";

import { AlmarisePageClient } from "@/views/almarise-client";
import { getRouteMetadata } from "@/lib/seo";
import {
  getAlmariseStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("almarise", "en");

export default function AlmarisePage() {
  const structuredData = getAlmariseStructuredData("en");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <AlmarisePageClient lang="en" />
    </>
  );
}
