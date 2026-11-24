import type { Metadata } from "next";

import { WomensTrainingInitiativePageClient } from "@/views/womens-training-initiative-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata(
  "womens-training-initiative",
  "es",
);

export default function SpanishWomensTrainingInitiativePage() {
  return <WomensTrainingInitiativePageClient lang="es" />;
}
