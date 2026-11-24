import type { Metadata } from "next";

import { CookiePolicyPageClient } from "@/views/cookie-policy-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("cookie-policy", "en");

export default function CookiePolicyPage() {
  return <CookiePolicyPageClient lang="en" />;
}
