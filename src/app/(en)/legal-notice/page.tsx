import type { Metadata } from "next";

import { LegalNoticePageClient } from "@/views/legal-notice-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("legal-notice", "en");

export default function LegalNoticePage() {
  return <LegalNoticePageClient lang="en" />;
}
