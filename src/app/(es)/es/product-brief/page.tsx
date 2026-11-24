import type { Metadata } from "next";

import { ProductBriefPageClient } from "@/views/product-brief-client";
import { getRouteMetadata } from "@/lib/seo";
import {
  getProductBriefStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("product-brief", "es");

export default function SpanishProductBriefPage() {
  const structuredData = getProductBriefStructuredData("es");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <ProductBriefPageClient lang="es" />
    </>
  );
}
