import type { Metadata } from "next";

import { ContactPageClient } from "@/app/contact/contact-client";
import { getRouteMetadata } from "@/lib/seo";

export const metadata: Metadata = getRouteMetadata("contact", "en");

export default function ContactPage() {
  return <ContactPageClient />;
}
