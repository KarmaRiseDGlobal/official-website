import type { Metadata } from "next";

import { ContactPageClient } from "@/views/contact-client";
import { getRouteMetadata } from "@/lib/seo";
import {
  getContactStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("contact", "es");

export default function SpanishContactPage() {
  const structuredData = getContactStructuredData("es");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <ContactPageClient lang="es" />
    </>
  );
}
