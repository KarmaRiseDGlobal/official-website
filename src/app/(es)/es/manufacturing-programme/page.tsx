import type { Metadata } from "next";

import { ManufacturingProgrammePageClient } from "@/app/manufacturing-programme/manufacturing-programme-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata(
  "manufacturing-programme",
  "es",
);

export default function SpanishManufacturingProgrammePage() {
  return <ManufacturingProgrammePageClient />;
}
