import type { Metadata } from "next";

import { TermsPageClient } from "@/views/terms-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("terms", "en");

export default function TermsPage() {
  return <TermsPageClient lang="en" />;
}
