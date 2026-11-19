import type { Metadata } from "next";

import { WorkingAcrossDistancePageClient } from "@/app/working-across-distance/working-across-distance-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata(
  "working-across-distance",
  "en",
);

export default function WorkingAcrossDistancePage() {
  return <WorkingAcrossDistancePageClient />;
}
