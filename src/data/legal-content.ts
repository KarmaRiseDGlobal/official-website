import type { SiteLanguage } from "@/lib/urls";

export interface LegalNavLinkItem {
  readonly href:
    "/privacy-policy" | "/terms" | "/cookie-policy" | "/legal-notice";
  readonly label: Record<SiteLanguage, string>;
}

export const LEGAL_NAV_LINKS: readonly LegalNavLinkItem[] = [
  {
    href: "/privacy-policy",
    label: { en: "Privacy policy", es: "Política de privacidad" },
  },
  {
    href: "/terms",
    label: { en: "Website terms", es: "Condiciones de uso" },
  },
  {
    href: "/cookie-policy",
    label: { en: "Cookie policy", es: "Política de cookies" },
  },
  {
    href: "/legal-notice",
    label: { en: "Legal notice", es: "Aviso legal" },
  },
];
