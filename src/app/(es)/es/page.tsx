import type { Metadata } from "next";

import { HomeClient } from "@/views/home-client";
import { getRouteMetadata } from "@/lib/seo";
import { getHomeStructuredData, serializeJsonLd } from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("home", "es");

export default function SpanishHomePage() {
  const structuredData = getHomeStructuredData("es");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <HomeClient lang="es" />
    </>
  );
}
