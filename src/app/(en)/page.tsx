import type { Metadata } from "next";

import { HomeClient } from "@/components/home-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("home", "en");

export default function HomePage() {
  return <HomeClient />;
}
