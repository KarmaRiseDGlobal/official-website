import {
  getLocalizedCategory,
  stories as fallbackStories,
  storyCategoryDetails,
  type StoryCategory,
} from "@/data/stories";
import type { SanityNewsletterIssue } from "@/lib/sanity";
import { escapeHtml, isSafeHttpUrl } from "@/lib/security";

const BREVO_CAMPAIGNS_API_URL = "https://api.brevo.com/v3/emailCampaigns";

function appendQueryParams(url: string, params: string): string {
  return `${url}${url.includes("?") ? "&" : "?"}${params}`;
}

function parsePositiveInt(raw: string | undefined): number | null {
  if (!raw) return null;
  const parsed = Number.parseInt(raw.trim(), 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

const DEFAULT_STORY_CATEGORY: StoryCategory = (
  storyCategoryDetails.find(
    (item) => item.displayTitle === "Inside KarmaRise",
  ) ?? storyCategoryDetails[storyCategoryDetails.length - 1]!
).title;

const LEGACY_STORY_CATEGORY_ALIASES: Record<string, StoryCategory> = {
  "working across distance": "India Meets Europe",
  "materials and sampling": "Art & Design",
  "manufacturing and people": "People & Craftsmanship",
  "company progress": DEFAULT_STORY_CATEGORY,
};

const SPANISH_LOCATION_FALLBACKS: Record<string, string> = {
  "India & Spain": "India y España",
  "Spain & India": "España e India",
  "Across India": "Por toda la India",
  "Spain, Europe & India": "España, Europa e India",
  "India, Spain & Europe": "India, España y Europa",
  "Spain & Europe": "España y Europa",
  India: "India",
  Spain: "España",
};

function resolveNewsletterCategoryLabel(
  rawCategory: string | undefined,
  language: "en" | "es",
): string {
  const trimmed = rawCategory?.trim();
  if (!trimmed) {
    return getLocalizedCategory(DEFAULT_STORY_CATEGORY, language).title;
  }

  const aliased =
    LEGACY_STORY_CATEGORY_ALIASES[trimmed.toLowerCase()] ?? trimmed;
  const normalized = aliased.toLowerCase();
  const matchedDetail = storyCategoryDetails.find(
    (item) =>
      item.title.toLowerCase() === normalized ||
      item.displayTitle.toLowerCase() === normalized ||
      item.spanishTitle.toLowerCase() === normalized ||
      item.shortLabel.toLowerCase() === normalized,
  );

  const categoryKey = matchedDetail?.title ?? DEFAULT_STORY_CATEGORY;
  return getLocalizedCategory(categoryKey, language).title;
}

function resolveNewsletterLocationLabel(
  story: NonNullable<SanityNewsletterIssue["selectedStories"]>[number],
  language: "en" | "es",
): string {
  if (language !== "es") {
    return story.location || "India & Spain";
  }

  const explicitSpanish = story.spanishLocation?.trim();
  if (explicitSpanish) {
    return explicitSpanish;
  }

  const localMatch = story.slug
    ? fallbackStories.find((entry) => entry.slug === story.slug)
    : undefined;
  if (localMatch?.spanishLocation) {
    return localMatch.spanishLocation;
  }

  const rawLocation = story.location?.trim();
  if (rawLocation && rawLocation in SPANISH_LOCATION_FALLBACKS) {
    return SPANISH_LOCATION_FALLBACKS[rawLocation]!;
  }

  return rawLocation || "India y España";
}

/** Renders the KarmaRise Stories HTML email template for English or Spanish editions. */
export function renderNewsletterHtml(
  issue: SanityNewsletterIssue,
  language: "en" | "es",
): string {
  const isEs = language === "es";
  const rawSiteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://karmarisedglobal.com"
  )
    .trim()
    .replace(/\/$/, "");
  const candidateBase = rawSiteUrl.includes("localhost")
    ? "https://karmarisedglobal.com"
    : rawSiteUrl;
  const assetBase = isSafeHttpUrl(candidateBase)
    ? candidateBase
    : "https://karmarisedglobal.com";
  const escapedAssetBase = escapeHtml(assetBase);

  const fontSerif =
    "'Lora', 'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif";
  const fontSans =
    "'Plus Jakarta Sans', 'Trebuchet MS', 'Gill Sans', Helvetica, sans-serif";

  const rawIssueNumber =
    issue.issueNumber?.trim() || (isEs ? "Edición #001" : "Issue #001");
  const issueNumber = escapeHtml(
    isEs
      ? rawIssueNumber.trim().replace(/^Issue\b/i, "Edición")
      : rawIssueNumber,
  );
  const headingText =
    (isEs ? issue.titleEs || issue.titleEn : issue.titleEn) ||
    (isEs
      ? "Historias entre España y la India"
      : "Stories from Spain and India");
  const heading = escapeHtml(headingText);
  const preheader = escapeHtml(
    (isEs ? issue.previewTextEs || issue.previewTextEn : issue.previewTextEn) ||
      headingText,
  );
  const intro = escapeHtml(
    (isEs ? issue.introEs || issue.introEn : issue.introEn) ||
      (isEs
        ? "Te escribimos entre España y la India para compartir contigo las últimas historias en las que hemos estado trabajando."
        : "Writing to you from Spain and India with the latest Stories from our workshops and travels."),
  );
  const closing = escapeHtml(
    (isEs ? issue.closingEs || issue.closingEn : issue.closingEn) ||
      (isEs
        ? "Dale a responder cuando quieras y cuéntanos qué te ha parecido. Los correos nos llegan directamente a nosotros dos."
        : "Hit reply anytime and tell us what caught your eye. Every message lands straight in our inbox."),
  );
  const ctaLabel = escapeHtml(
    (isEs ? issue.ctaTextEs || issue.ctaTextEn : issue.ctaTextEn) ||
      (isEs ? "Ven a leer nuestras historias" : "Read our latest Stories"),
  );
  const rawCtaUrl = issue.ctaUrl?.trim() ?? "";
  const ctaUrl = escapeHtml(
    isSafeHttpUrl(rawCtaUrl) ? rawCtaUrl : `${assetBase}/stories`,
  );
  const readMoreLabel = isEs ? "Leer esta historia →" : "Read this Story →";
  const signoff = isEs ? "Un abrazo enorme," : "Can't wait to hear from you,";
  const founders = isEs ? "Alma y Shirish" : "Alma & Shirish";
  const footerNote = isEs
    ? "Te escribimos porque te apuntaste para recibir nuestras historias en KarmaRise."
    : "You are receiving this letter because you signed up for KarmaRise Stories.";
  const unsubscribeLabel = isEs
    ? "Darte de baja cuando quieras"
    : "Unsubscribe anytime";

  const logoUrl = escapeHtml(`${assetBase}/brand/main-logo-transparent.png`);
  const rawHeroImageUrl = issue.heroImageUrl?.trim() ?? "";
  const heroImageUrl = escapeHtml(
    isSafeHttpUrl(rawHeroImageUrl)
      ? appendQueryParams(rawHeroImageUrl, "w=1100&q=85&auto=format")
      : `${assetBase}/images/alma-and-shirish-founders.jpg`,
  );

  const storiesHtml = (issue.selectedStories ?? [])
    .filter((story) =>
      Boolean(
        story.slug && (story.title?.trim() || story.spanishTitle?.trim()),
      ),
    )
    .map((story) => {
      const title = escapeHtml(
        (isEs
          ? story.spanishTitle?.trim() || story.title?.trim()
          : story.title?.trim() || story.spanishTitle?.trim()) || "",
      );
      const summary = escapeHtml(
        (isEs
          ? story.spanishSummary || story.summary
          : story.summary || story.spanishSummary) || "",
      );
      const category = escapeHtml(
        resolveNewsletterCategoryLabel(story.category, language),
      );
      const location = escapeHtml(
        resolveNewsletterLocationLabel(story, language),
      );
      const storyUrl = escapeHtml(
        `${assetBase}/stories/${encodeURIComponent(story.slug || "")}`,
      );
      const rawLeadImageUrl = story.leadImageUrl?.trim() ?? "";
      const safeLeadImageUrl = isSafeHttpUrl(rawLeadImageUrl)
        ? escapeHtml(
            appendQueryParams(rawLeadImageUrl, "w=960&q=82&auto=format"),
          )
        : "";
      const storyImageHtml = safeLeadImageUrl
        ? `<a href="${storyUrl}" style="display:block;margin-bottom:14px;text-decoration:none;"><img src="${safeLeadImageUrl}" alt="${title}" width="492" style="display:block;width:100%;max-width:492px;height:auto;border-radius:12px;border:0;" /></a>`
        : "";

      return `
        <tr>
          <td style="padding: 24px 0; border-bottom: 1px solid #CDBB9C;">
            ${storyImageHtml}
            <p style="margin: 0 0 8px; font-family: ${fontSans}; font-size: 11px; font-weight: 600; letter-spacing: 1.2px; text-transform: uppercase; color: #833E28;">
              ${category} &middot; ${location}
            </p>
            <h2 style="margin: 0 0 10px; font-family: ${fontSerif}; font-size: 22px; font-weight: 500; line-height: 1.25; color: #182D20;">
              <a href="${storyUrl}" style="color: #182D20; text-decoration: none;">${title}</a>
            </h2>
            <p style="margin: 0 0 14px; font-family: ${fontSerif}; font-size: 16px; line-height: 1.7; color: #25201D;">
              ${summary}
            </p>
            <a href="${storyUrl}" style="font-family: ${fontSans}; font-size: 13px; font-weight: 600; color: #833E28; text-decoration: underline;">
              ${readMoreLabel}
            </a>
          </td>
        </tr>
      `;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${heading}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:#D9DFD3;font-family:${fontSerif};color:#25201D;-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
    ${preheader}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color:#D9DFD3;padding:40px 14px;">
    <tr>
      <td align="center">
        <table role="presentation" width="580" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:580px;background-color:#F2ECDF;border-radius:24px;overflow:hidden;box-shadow:0 14px 38px rgba(24,45,32,0.08);">
          <tr>
            <td align="center" style="padding:42px 36px 20px;background-color:#F2ECDF;">
              <a href="${escapedAssetBase}" style="text-decoration:none;display:inline-block;">
                <img src="${logoUrl}" alt="KarmaRise" width="84" style="display:block;width:84px;height:auto;margin:0 auto;border:0;" />
              </a>
              <p style="margin:14px 0 0;font-family:${fontSans};font-size:11px;letter-spacing:1.8px;text-transform:uppercase;color:#BD7057;font-weight:600;">
                ${isEs ? "Historias de KarmaRise" : "KarmaRise Stories"} &middot; ${issueNumber}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:10px 44px 28px;background-color:#F2ECDF;">
              <h1 style="margin:0 0 20px;font-family:${fontSerif};font-size:30px;line-height:1.22;font-weight:400;font-style:italic;color:#182D20;text-align:center;">
                ${heading}
              </h1>
              <p style="margin:0;font-family:${fontSerif};font-size:17px;line-height:1.8;color:#25201D;">
                ${intro}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0;line-height:0;font-size:0;">
              <a href="${ctaUrl}" style="display:block;text-decoration:none;">
                <img src="${heroImageUrl}" alt="${heading}" width="580" style="display:block;width:100%;max-width:580px;height:auto;border:0;" />
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 44px 36px;background-color:#F2ECDF;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                ${storiesHtml}
              </table>
              <p style="margin:28px 0 28px;font-family:${fontSerif};font-size:17px;font-style:italic;line-height:1.75;color:#833E28;">
                ${closing}
              </p>
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 36px;">
                <tr>
                  <td align="center" bgcolor="#BD7057" style="border-radius:999px;background-color:#BD7057;">
                    <a href="${ctaUrl}" style="display:inline-block;padding:15px 36px;font-family:${fontSans};font-size:14px;font-weight:600;letter-spacing:0.4px;color:#FAF6EE;text-decoration:none;border-radius:999px;">
                      ${ctaLabel}
                    </a>
                  </td>
                </tr>
              </table>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #CDBB9C;padding-top:24px;">
                <tr>
                  <td>
                    <p style="margin:0 0 6px;font-family:${fontSerif};font-size:16px;font-style:italic;color:#4D342F;">
                      ${signoff}
                    </p>
                    <p style="margin:0 0 4px;font-family:${fontSerif};font-size:22px;color:#182D20;">
                      ${founders}
                    </p>
                    <p style="margin:0;font-family:${fontSans};font-size:12px;letter-spacing:0.6px;color:#833E28;">
                      ${isEs ? "España &middot; India" : "Spain &middot; India"}
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
        <table role="presentation" width="540" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:540px;padding:24px 20px 8px;">
          <tr>
            <td align="center" style="font-family:${fontSans};font-size:12px;line-height:1.7;color:#29482F;">
              <p style="margin:0 0 4px;">
                ${footerNote}
              </p>
              <p style="margin:0;">
                <a href="mailto:stories@karmarisedglobal.com" style="color:#833E28;text-decoration:underline;">stories@karmarisedglobal.com</a>
                &nbsp;&middot;&nbsp;
                <a href="{{ unsubscribe }}" style="color:#29482F;text-decoration:underline;">${unsubscribeLabel}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

async function upsertBrevoEmailCampaignDraft(options: {
  apiKey: string;
  existingCampaignId?: number;
  name: string;
  subject: string;
  previewText?: string;
  htmlContent: string;
  listIds: number[];
  senderName: string;
  senderEmail: string;
  replyTo: string;
}): Promise<{ ok: true; id: number } | { ok: false; error: string }> {
  const payload = {
    name: options.name,
    subject: options.subject,
    previewText: options.previewText || options.subject,
    sender: {
      name: options.senderName,
      email: options.senderEmail,
    },
    replyTo: options.replyTo,
    htmlContent: options.htmlContent,
    recipients: {
      listIds: options.listIds,
    },
  };

  if (options.existingCampaignId && options.existingCampaignId > 0) {
    let updateRes: Response;
    try {
      updateRes = await fetch(
        `${BREVO_CAMPAIGNS_API_URL}/${options.existingCampaignId}`,
        {
          method: "PUT",
          headers: {
            "api-key": options.apiKey,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        },
      );
    } catch (error) {
      console.error("Brevo campaign draft update request failed:", error);
      return {
        ok: false,
        error: "Brevo campaign update request failed.",
      };
    }

    if (updateRes.ok) {
      return { ok: true, id: options.existingCampaignId };
    }

    const errorBody = await updateRes.text().catch(() => "");
    if (updateRes.status !== 404) {
      console.error(
        "Brevo campaign draft update failed:",
        updateRes.status,
        errorBody,
      );
      return {
        ok: false,
        error: `Brevo campaign update failed (${updateRes.status}).`,
      };
    }
  }

  let createRes: Response;
  try {
    createRes = await fetch(BREVO_CAMPAIGNS_API_URL, {
      method: "POST",
      headers: {
        "api-key": options.apiKey,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error("Brevo campaign draft creation request failed:", error);
    return {
      ok: false,
      error: "Brevo campaign creation request failed.",
    };
  }

  if (!createRes.ok) {
    console.error(
      "Brevo campaign draft creation failed:",
      createRes.status,
      await createRes.text().catch(() => ""),
    );
    return {
      ok: false,
      error: `Brevo campaign creation failed (${createRes.status}).`,
    };
  }

  try {
    const created = (await createRes.json()) as { id?: number };
    if (typeof created.id === "number") {
      return { ok: true, id: created.id };
    }
  } catch (error) {
    console.error(
      "Brevo campaign draft creation returned invalid JSON:",
      error,
    );
    return {
      ok: false,
      error: "Brevo campaign creation returned invalid JSON.",
    };
  }

  return {
    ok: false,
    error: "Brevo campaign creation returned no ID.",
  };
}

/**
 * Creates or updates English and Spanish campaign drafts in Brevo for an approved Sanity NewsletterIssue.
 * Never automatically sends campaigns: drafts remain in Brevo for human review and scheduling.
 */
export async function syncNewsletterIssueToBrevo(
  issue: SanityNewsletterIssue,
): Promise<{
  ok: boolean;
  brevoCampaignIdEn?: number;
  brevoCampaignIdEs?: number;
  error?: string;
}> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  const masterListId = parsePositiveInt(process.env.BREVO_LIST_ID);
  const enListId =
    parsePositiveInt(process.env.BREVO_LIST_ID_EN) ?? masterListId;
  const esListId =
    parsePositiveInt(process.env.BREVO_LIST_ID_ES) ?? masterListId;

  if (!apiKey || !masterListId) {
    return {
      ok: false,
      error: "BREVO_API_KEY and BREVO_LIST_ID must be configured.",
    };
  }

  const senderName =
    process.env.BREVO_SENDER_NAME?.trim() || "Alma & Shirish · KarmaRise";
  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() || "stories@karmarisedglobal.com";
  const replyTo = process.env.BREVO_REPLY_TO_EMAIL?.trim() || senderEmail;

  const audience = issue.targetAudience || "both";
  let brevoCampaignIdEn = issue.brevoCampaignIdEn;
  let brevoCampaignIdEs = issue.brevoCampaignIdEs;
  const errors: string[] = [];

  if (audience === "both" || audience === "en") {
    const htmlEn = renderNewsletterHtml(issue, "en");
    const enResult = await upsertBrevoEmailCampaignDraft({
      apiKey,
      existingCampaignId: issue.brevoCampaignIdEn,
      name: `[EN] ${issue.internalName || issue.issueNumber || "KarmaRise Newsletter"}`,
      subject:
        issue.subjectEn || issue.titleEn || "KarmaRise Stories · New Edition",
      previewText: issue.previewTextEn,
      htmlContent: htmlEn,
      listIds: [enListId!],
      senderName,
      senderEmail,
      replyTo,
    });
    if (enResult.ok) {
      brevoCampaignIdEn = enResult.id;
    } else {
      brevoCampaignIdEn = undefined;
      errors.push(`EN: ${enResult.error}`);
    }
  }

  if (audience === "both" || audience === "es") {
    const htmlEs = renderNewsletterHtml(issue, "es");
    const esResult = await upsertBrevoEmailCampaignDraft({
      apiKey,
      existingCampaignId: issue.brevoCampaignIdEs,
      name: `[ES] ${issue.internalName || issue.issueNumber || "Historias de KarmaRise"}`,
      subject:
        issue.subjectEs ||
        issue.titleEs ||
        issue.subjectEn ||
        "Historias de KarmaRise · Nueva edición",
      previewText: issue.previewTextEs || issue.previewTextEn,
      htmlContent: htmlEs,
      listIds: [esListId!],
      senderName,
      senderEmail,
      replyTo,
    });
    if (esResult.ok) {
      brevoCampaignIdEs = esResult.id;
    } else {
      brevoCampaignIdEs = undefined;
      errors.push(`ES: ${esResult.error}`);
    }
  }

  if (errors.length > 0) {
    return {
      ok: false,
      brevoCampaignIdEn,
      brevoCampaignIdEs,
      error: errors.join(" "),
    };
  }

  return {
    ok: Boolean(brevoCampaignIdEn || brevoCampaignIdEs),
    brevoCampaignIdEn,
    brevoCampaignIdEs,
  };
}
