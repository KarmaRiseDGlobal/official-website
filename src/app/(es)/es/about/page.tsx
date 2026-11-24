import type { Metadata } from "next";

import { AboutPageClient } from "@/views/about-client";
import { getRouteMetadata } from "@/lib/seo";
import { getAboutStructuredData, serializeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("about", "es");

export default function SpanishAboutPage() {
  const structuredData = getAboutStructuredData("es");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <AboutPageClient lang="es" />
    </>
  );
}
