import type { Metadata } from "next";

import { ProductBriefPageClient } from "@/app/product-brief/product-brief-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("product-brief", "en");

export default function ProductBriefPage() {
  return <ProductBriefPageClient />;
}
