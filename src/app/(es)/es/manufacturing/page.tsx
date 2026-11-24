import type { Metadata } from "next";

import { ManufacturingProgrammePageClient } from "@/views/manufacturing-programme-client";
import { getRouteMetadata } from "@/lib/seo";
import {
  getManufacturingProgrammeStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("manufacturing", "es");

export default function SpanishManufacturingProgrammePage() {
  const structuredData = getManufacturingProgrammeStructuredData("es");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <ManufacturingProgrammePageClient lang="es" />
    </>
  );
}
