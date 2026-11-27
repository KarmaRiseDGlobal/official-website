import type { Metadata } from "next";

import { getRouteMetadata } from "@/lib/seo";
import {
  getLegalPageStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";
import { PrivacyPolicyPageClient } from "@/views/privacy-policy-client";

export const metadata: Metadata = getRouteMetadata("privacy-policy", "en");

export default function PrivacyPolicyPage() {
  const structuredData = getLegalPageStructuredData("en", "privacyPolicy");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <PrivacyPolicyPageClient lang="en" />
    </>
  );
}
