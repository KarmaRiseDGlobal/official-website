import type { Metadata } from "next";

import { getRouteMetadata } from "@/lib/seo";
import {
  getLegalPageStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";
import { PrivacyPolicyPageClient } from "@/views/privacy-policy-client";

export const metadata: Metadata = getRouteMetadata("privacy-policy", "es");

export default function SpanishPrivacyPolicyPage() {
  const structuredData = getLegalPageStructuredData("es", "privacyPolicy");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <PrivacyPolicyPageClient lang="es" />
    </>
  );
}
