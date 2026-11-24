import type { Metadata } from "next";

import { PrivacyPolicyPageClient } from "@/views/privacy-policy-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("privacy-policy", "en");

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageClient lang="en" />;
}
