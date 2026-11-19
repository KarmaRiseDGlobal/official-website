import type { Metadata } from "next";

import { LegalNoticePageClient } from "@/app/legal-notice/legal-notice-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("legal-notice", "es");

export default function SpanishLegalNoticePage() {
  return <LegalNoticePageClient />;
}
