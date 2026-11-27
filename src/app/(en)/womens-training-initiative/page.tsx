import type { Metadata } from "next";

import { getRouteMetadata } from "@/lib/seo";
import {
  getWomensTrainingInitiativeStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";
import { WomensTrainingInitiativePageClient } from "@/views/womens-training-initiative-client";

export const metadata: Metadata = getRouteMetadata(
  "womens-training-initiative",
  "en",
);

export default function WomensTrainingInitiativePage() {
  const structuredData = getWomensTrainingInitiativeStructuredData("en");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <WomensTrainingInitiativePageClient lang="en" />
    </>
  );
}
