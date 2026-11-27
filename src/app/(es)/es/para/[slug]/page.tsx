import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getPartnerLandingBySlug,
  PARTNER_LANDINGS,
} from "@/data/partner-landings";
import { PartnerLandingClient } from "@/views/partner-landing-client";

export const dynamicParams = false;

export function generateStaticParams(): Array<{ slug: string }> {
  return PARTNER_LANDINGS.map((partner) => ({ slug: partner.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const partner = getPartnerLandingBySlug(slug);
  if (!partner) {
    return {
      title: "Página no encontrada",
      robots: { index: false, follow: false },
    };
  }

  const enPath = `/for/${partner.slug}`;
  const esPath = `/es/para/${partner.slug}`;

  return {
    title: { absolute: partner.seo.title.es },
    description: partner.seo.description.es,
    robots: { index: false, follow: true },
    alternates: {
      canonical: esPath,
      languages: {
        en: enPath,
        es: esPath,
        "x-default": enPath,
      },
    },
    openGraph: {
      type: "website",
      siteName: "KarmaRise D Global",
      title: partner.seo.title.es,
      description: partner.seo.description.es,
      url: esPath,
      locale: "es_ES",
      alternateLocale: ["en_GB"],
      images: [
        {
          url: "/opengraph-image.jpg",
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: partner.imageAlt.es,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: partner.seo.title.es,
      description: partner.seo.description.es,
      images: ["/opengraph-image.jpg"],
    },
  };
}

export default async function PartnerLandingEsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const partner = getPartnerLandingBySlug(slug);
  if (!partner) {
    notFound();
  }

  return <PartnerLandingClient partner={partner} lang="es" />;
}
