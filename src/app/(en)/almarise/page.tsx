import type { Metadata } from "next";

import { AlmarisePageClient } from "@/app/almarise/almarise-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("almarise", "en");

export default function AlmarisePage() {
  return <AlmarisePageClient />;
}
