import type { Metadata } from "next";

import { getRouteMetadata } from "@/lib/seo";
import {
  getLegalPageStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";
import { CookiePolicyPageClient } from "@/views/cookie-policy-client";

export const metadata: Metadata = getRouteMetadata("cookie-policy", "en");

export default function CookiePolicyPage() {
  const structuredData = getLegalPageStructuredData("en", "cookiePolicy");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <CookiePolicyPageClient lang="en" />
    </>
  );
}
