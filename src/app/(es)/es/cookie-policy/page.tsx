import type { Metadata } from "next";

import { CookiePolicyPageClient } from "@/views/cookie-policy-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("cookie-policy", "es");

export default function SpanishCookiePolicyPage() {
  return <CookiePolicyPageClient lang="es" />;
}
