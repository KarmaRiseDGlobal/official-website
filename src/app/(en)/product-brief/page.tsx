import type { Metadata } from "next";

import { ProductBriefPageClient } from "@/views/product-brief-client";
import { getRouteMetadata } from "@/lib/seo";
import {
  getProductBriefStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("product-brief", "en");

export default function ProductBriefPage() {
  const structuredData = getProductBriefStructuredData("en");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <ProductBriefPageClient lang="en" />
    </>
  );
}
