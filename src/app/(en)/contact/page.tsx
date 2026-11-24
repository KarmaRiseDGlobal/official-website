import type { Metadata } from "next";

import { ContactPageClient } from "@/views/contact-client";
import { getRouteMetadata } from "@/lib/seo";
import {
  getContactStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("contact", "en");

export default function ContactPage() {
  const structuredData = getContactStructuredData("en");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <ContactPageClient lang="en" />
    </>
  );
}
