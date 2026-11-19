import type { Metadata } from "next";

import { AboutPageClient } from "@/app/about/about-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("about", "en");

export default function AboutPage() {
  return <AboutPageClient />;
}
