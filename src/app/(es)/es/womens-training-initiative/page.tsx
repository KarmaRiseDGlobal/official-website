import type { Metadata } from "next";

import { getRouteMetadata } from "@/lib/seo";
import {
  getWomensTrainingInitiativeStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";
import { WomensTrainingInitiativePageClient } from "@/views/womens-training-initiative-client";

export const metadata: Metadata = getRouteMetadata(
  "womens-training-initiative",
  "es",
);

export default function SpanishWomensTrainingInitiativePage() {
  const structuredData = getWomensTrainingInitiativeStructuredData("es");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <WomensTrainingInitiativePageClient lang="es" />
    </>
  );
}
