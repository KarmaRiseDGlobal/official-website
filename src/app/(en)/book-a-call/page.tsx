import type { Metadata } from "next";

import { BookACallPageClient } from "@/app/book-a-call/book-a-call-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("book-a-call", "en");

export default function BookACallPage() {
  return <BookACallPageClient />;
}
