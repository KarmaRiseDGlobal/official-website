import type { Metadata } from "next";

import { HomeClient } from "@/views/home-client";
import { getRouteMetadata } from "@/lib/seo";
import { getHomeStructuredData, serializeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("home", "en");

export default function HomePage() {
  const structuredData = getHomeStructuredData("en");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <HomeClient lang="en" />
    </>
  );
}
