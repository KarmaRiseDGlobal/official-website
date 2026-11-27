import "server-only";

import type { AutomatedEmailTemplate } from "@/data/email-sequences";
import { appendEmailUtm } from "@/lib/email-analytics";
import {
  renderEmailLetterHtml,
  renderEmailLetterText,
  resolveCanonicalSiteBase,
  type EmailLetterOptions,
} from "@/lib/email-layout";
import { isSafeHttpUrl } from "@/lib/security";

export interface RenderedSequenceEmail {
  templateIdKey: string;
  templateName: string;
  language: "en" | "es";
  senderName: string;
  subject: string;
  previewText: string;
  html: string;
  text: string;
}

export function resolveSequenceSenderName(
  narrator: AutomatedEmailTemplate["narrator"],
  language: "en" | "es",
): string {
  if (narrator === "alma") {
    return "Alma · KarmaRise D Global";
  }
  if (narrator === "shirish") {
    return "Shirish · KarmaRise D Global";
  }
  return language === "es"
    ? "Alma y Shirish · KarmaRise D Global"
    : "Alma & Shirish · KarmaRise D Global";
}

function buildDestinationUrl(
  siteBase: string,
  pathOrUrl: string,
  campaign: string,
  content: string,
): string {
  const fullUrl = isSafeHttpUrl(pathOrUrl)
    ? pathOrUrl
    : `${siteBase}${pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`}`;

  // Preserve Brevo merge tags like `{{ contact.EMAIL }}` without percent-encoding braces.
  if (fullUrl.includes("{{")) {
    const separator = fullUrl.includes("?") ? "&" : "?";
    return `${fullUrl}${separator}utm_source=brevo&utm_medium=email&utm_campaign=${encodeURIComponent(campaign)}&utm_content=${encodeURIComponent(content)}`;
  }

  return appendEmailUtm(fullUrl, {
    source: "brevo",
    campaign,
    content,
  });
}

function resolvePhotoUrl(
  localHeroImage: string | undefined,
  siteBase: string,
  overrideUrl?: string,
): string | null {
  if (overrideUrl?.trim()) {
    return overrideUrl.trim();
  }
  if (!localHeroImage?.trim()) {
    return null;
  }
  const encodedPath = localHeroImage
    .split("/")
    .map((segment) => encodeURIComponent(segment))
    .join("/");
  return `${siteBase}${encodedPath}`;
}

export function renderAutomatedSequenceEmail(
  template: AutomatedEmailTemplate,
  language: "en" | "es",
  options?: {
    siteBaseUrl?: string;
    logoUrl?: string;
    heroImageUrl?: string;
    /** When true, substitutes human preview greetings instead of raw Brevo Jinja syntax. */
    previewMode?: boolean;
  },
): RenderedSequenceEmail {
  const siteBase = resolveCanonicalSiteBase(options?.siteBaseUrl);
  const copy = language === "es" ? template.es : template.en;
  const campaignSlug = `${template.campaignSlugBase}-${language}`;

  const primaryCta = copy.primaryCta
    ? {
        label: copy.primaryCta.label,
        href: buildDestinationUrl(
          siteBase,
          copy.primaryCta.path,
          campaignSlug,
          copy.primaryCta.contentSlug,
        ),
        ...(copy.primaryCta.secondaryLabel && copy.primaryCta.secondaryPath
          ? {
              secondaryLabel: copy.primaryCta.secondaryLabel,
              secondaryHref: buildDestinationUrl(
                siteBase,
                copy.primaryCta.secondaryPath,
                campaignSlug,
                copy.primaryCta.secondaryContentSlug ?? "secondary-cta",
              ),
            }
          : {}),
      }
    : null;

  const psBlock = copy.ps
    ? {
        text: copy.ps.text,
        ...(copy.ps.ctaLabel && copy.ps.ctaPath
          ? {
              ctaLabel: copy.ps.ctaLabel,
              ctaHref: buildDestinationUrl(
                siteBase,
                copy.ps.ctaPath,
                campaignSlug,
                copy.ps.ctaContentSlug ?? "ps-cta",
              ),
            }
          : {}),
      }
    : null;

  const resolvedHeroUrl = resolvePhotoUrl(
    template.localHeroImage,
    siteBase,
    options?.heroImageUrl,
  );
  const heroLinkHref = primaryCta?.href ?? psBlock?.ctaHref;

  const normalizePreviewPlaceholders = (text: string): string => {
    if (!options?.previewMode) {
      return text;
    }
    return text.replace(
      /\{\{\s*params\.[A-Z0-9_]+\s*\|\s*default:"([^"]+)"\s*\}\}/g,
      "$1",
    );
  };

  const letterOptions: EmailLetterOptions = {
    language,
    siteBaseUrl: siteBase,
    logoUrl: options?.logoUrl,
    brandTitle: copy.brandTitle,
    issueTag: copy.issueTag,
    heading: copy.heading,
    preheader: copy.previewText,
    dateline: copy.dateline,
    ...(options?.previewMode
      ? { greetingText: copy.greetingPreview }
      : { greetingTemplate: copy.greetingTemplate }),
    beforePhotoParagraphs: copy.beforePhotoParagraphs.map(
      normalizePreviewPlaceholders,
    ),
    heroPhoto: resolvedHeroUrl
      ? {
          url: resolvedHeroUrl,
          alt: copy.heroImageAlt || copy.heading,
          linkHref: heroLinkHref,
        }
      : null,
    afterPhotoParagraphs: copy.afterPhotoParagraphs?.map(
      normalizePreviewPlaceholders,
    ),
    primaryCta,
    replyPrompt: copy.replyPrompt ?? null,
    signoffLead: copy.signoffLead,
    signoffName: copy.signoffName,
    signoffLocation: copy.signoffLocation,
    ps: psBlock,
    footerMode: template.footerMode,
    footerEmail:
      template.footerMode === "transactional"
        ? "alma@karmarisedglobal.com"
        : "stories@karmarisedglobal.com",
  };

  return {
    templateIdKey: `${template.id}-${language}`,
    templateName: copy.templateName,
    language,
    senderName: resolveSequenceSenderName(template.narrator, language),
    subject: copy.subject,
    previewText: copy.previewText,
    html: renderEmailLetterHtml(letterOptions),
    text: renderEmailLetterText(letterOptions),
  };
}
