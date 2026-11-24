import type { Metadata } from "next";

import { WomensTrainingInitiativePageClient } from "@/views/womens-training-initiative-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata(
  "womens-training-initiative",
  "en",
);

export default function WomensTrainingInitiativePage() {
  return <WomensTrainingInitiativePageClient lang="en" />;
}
