import type { Metadata } from "next";

import { AboutPageClient } from "@/views/about-client";
import { getRouteMetadata } from "@/lib/seo";
import { getAboutStructuredData, serializeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("about", "en");

export default function AboutPage() {
  const structuredData = getAboutStructuredData("en");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <AboutPageClient lang="en" />
    </>
  );
}
