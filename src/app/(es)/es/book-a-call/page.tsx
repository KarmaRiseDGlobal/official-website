import type { Metadata } from "next";

import { BookACallPageClient } from "@/views/book-a-call-client";
import { getRouteMetadata } from "@/lib/seo";
import {
  getBookACallStructuredData,
  serializeJsonLd,
} from "@/lib/structured-data";

export const metadata: Metadata = getRouteMetadata("book-a-call", "es");

export default function SpanishBookACallPage() {
  const structuredData = getBookACallStructuredData("es");

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
      />
      <BookACallPageClient lang="es" />
    </>
  );
}
