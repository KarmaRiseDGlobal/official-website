import type { Metadata } from "next";

import { HowWeWorkPageClient } from "@/views/how-we-work-client";
import { getRouteMetadata } from "@/lib/seo";
import {
  getHowWeWorkStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("how-we-work", "es");

export default function SpanishHowWeWorkPage() {
  const structuredData = getHowWeWorkStructuredData("es");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <HowWeWorkPageClient lang="es" />
    </>
  );
}
