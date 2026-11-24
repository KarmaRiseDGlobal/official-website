import type { Metadata } from "next";

import { PrivacyPolicyPageClient } from "@/views/privacy-policy-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("privacy-policy", "es");

export default function SpanishPrivacyPolicyPage() {
  return <PrivacyPolicyPageClient lang="es" />;
}
