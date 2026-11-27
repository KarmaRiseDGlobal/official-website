import { OFFICIAL_SOCIALS } from "@/data/socials";
import { escapeHtml, isSafeHttpUrl } from "@/lib/security";

export const EMAIL_FONT_SERIF =
  "Georgia, 'Palatino Linotype', 'Book Antiqua', Palatino, serif";
export const EMAIL_FONT_SANS =
  "'Plus Jakarta Sans', 'Trebuchet MS', 'Gill Sans', Helvetica, Arial, sans-serif";

export const EMAIL_COLORS = {
  outerBg: "#D9DFD3",
  paper: "#F2ECDF",
  paperBorder: "#D4C4AA",
  paperRule: "#E6DAC4",
  paperSoftBox: "#E6DAC4",
  paperDivider: "#D4C4AA",
  forestDeep: "#182D20",
  forestFooter: "#29482F",
  bodyInk: "#25201D",
  bodyMuted: "#584B44",
  signoffWarm: "#4D342F",
  psInk: "#4D342F",
  clay: "#BD7057",
  clayInk: "#833E28",
  buttonBg: "#182D20",
  buttonText: "#F2ECDF",
} as const;

export interface EmailSummaryRow {
  label: string;
  value: string;
  href?: string;
}

export interface EmailCtaButton {
  label: string;
  href: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export interface EmailLetterOptions {
  language: "en" | "es";
  siteBaseUrl: string;
  logoUrl?: string;
  brandTitle: string;
  issueTag: string;
  heading: string;
  preheader: string;
  dateline: string;
  /**
   * Optional raw HTML/Brevo-template greeting line (already safe for insertion),
   * or pass `greetingText` to have it HTML-escaped automatically.
   */
  greetingTemplate?: string;
  greetingText?: string;
  /** Paragraphs before the optional photo (or all body paragraphs if no photo). */
  beforePhotoParagraphs: readonly string[];
  /** Optional candid photograph embedded inside the letter (no visible caption). */
  heroPhoto?: {
    url: string;
    alt: string;
    linkHref?: string;
  } | null;
  /** Paragraphs after the optional photo. */
  afterPhotoParagraphs?: readonly string[];
  /** Optional structured summary card (used for transactional receipts, call prep, or call notes). */
  summaryCard?: {
    title: string;
    rows: readonly EmailSummaryRow[];
    note?: string;
  } | null;
  /** Optional primary pill button + optional secondary inline link. */
  primaryCta?: EmailCtaButton | null;
  /** Optional warm highlight box inviting a direct reply. */
  replyPrompt?: {
    question: string;
    helper: string;
  } | null;
  signoffLead: string;
  signoffName: string;
  signoffLocation: string;
  /** Optional P.S. / P.D. closing block with an inline link. */
  ps?: {
    text?: string;
    ctaLabel?: string;
    ctaHref?: string;
  } | null;
  /**
   * Controls footer mode:
   * - "marketing": shows EN/ES language preference link, calm official socials, and Brevo `{{ unsubscribe }}`.
   * - "transactional": omits marketing unsubscribe and shows direct contact email only.
   */
  footerMode: "marketing" | "transactional";
  footerEmail?: string;
  footerNote?: string;
}

export function resolveCanonicalSiteBase(rawSiteUrl?: string): string {
  const candidate = (
    rawSiteUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://karmarisedglobal.com"
  )
    .trim()
    .replace(/\/$/, "");
  const normalized = candidate.includes("localhost")
    ? "https://karmarisedglobal.com"
    : candidate;
  return isSafeHttpUrl(normalized)
    ? normalized
    : "https://karmarisedglobal.com";
}

export function resolveEmailLogoUrl(
  siteBaseUrl: string,
  explicitLogoUrl?: string,
): string {
  if (explicitLogoUrl?.trim()) {
    return explicitLogoUrl.trim();
  }
  const envOverride = process.env.BREVO_LOGO_CDN_URL?.trim() ?? "";
  if (envOverride && isSafeHttpUrl(envOverride)) {
    return envOverride;
  }
  return `${siteBaseUrl}/brand/main-logo-transparent.png`;
}

/**
 * Formats safe inline markdown (**bold**, *italic*) after HTML escaping,
 * while preserving unescaped string quotes inside Brevo Jinja `{{ ... }}` / `{% ... %}` expressions.
 */
export function formatInlineEmailMarkup(rawText: string): string {
  const escaped = escapeHtml(rawText)
    .replace(/\{\{[\s\S]*?\}\}/g, (match) =>
      match.replaceAll("&quot;", '"').replaceAll("&#39;", "'"),
    )
    .replace(/\{%[\s\S]*?%\}/g, (match) =>
      match.replaceAll("&quot;", '"').replaceAll("&#39;", "'"),
    );
  return escaped
    .replace(
      /\*\*([^*]+)\*\*/g,
      `<strong style="font-weight:600;color:${EMAIL_COLORS.forestDeep};">$1</strong>`,
    )
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

export function stripInlineEmailMarkup(rawText: string): string {
  return rawText
    .replace(/\{\{\s*params\.[A-Z0-9_]+\s*\|\s*default:"([^"]+)"\s*\}\}/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1");
}

export function splitEmailParagraphs(rawText: string | undefined): string[] {
  if (!rawText) {
    return [];
  }
  return rawText
    .split(/\r?\n\s*\r?\n/)
    .map((part) => part.trim())
    .filter((part) => part.length > 0);
}

/**
 * Renders a paragraph, blockquote (`> `), or bullet list (`- ` lines) in KarmaRise serif styling.
 */
function renderContentBlock(block: string): string {
  if (block.startsWith("> ")) {
    const quoteText = formatInlineEmailMarkup(block.slice(2).trim());
    return `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:22px 0;">
      <tr>
        <td style="border-left:3px solid ${EMAIL_COLORS.clay};padding:4px 0 4px 18px;font-family:${EMAIL_FONT_SERIF};font-size:18px;font-style:italic;line-height:1.65;color:${EMAIL_COLORS.forestDeep};">
          ${quoteText}
        </td>
      </tr>
    </table>`;
  }

  const lines = block
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length > 0 && lines.every((line) => line.startsWith("- "))) {
    const itemsHtml = lines
      .map(
        (line) =>
          `<li style="margin:0 0 8px;padding-left:2px;">${formatInlineEmailMarkup(line.slice(2).trim())}</li>`,
      )
      .join("");
    return `<ul style="margin:0 0 20px;padding:0 0 0 20px;font-family:${EMAIL_FONT_SERIF};font-size:16.5px;line-height:1.72;color:${EMAIL_COLORS.bodyInk};">${itemsHtml}</ul>`;
  }

  return `<p style="margin:0 0 18px;font-family:${EMAIL_FONT_SERIF};font-size:17px;line-height:1.78;color:${EMAIL_COLORS.bodyInk};">
    ${formatInlineEmailMarkup(block)}
  </p>`;
}

function resolvePlainTextGreeting(options: EmailLetterOptions): string {
  if (options.greetingText?.trim()) {
    return options.greetingText.trim();
  }
  if (options.greetingTemplate?.trim()) {
    const elseMatch = /\{%\s*else\s*%\}([\s\S]*?)\{%\s*endif\s*%\}/i.exec(
      options.greetingTemplate,
    );
    if (elseMatch?.[1]?.trim()) {
      return elseMatch[1].replace(/<[^>]+>/g, "").trim();
    }
    const stripped = options.greetingTemplate
      .replace(/\{%[\s\S]*?%\}/g, "")
      .replace(/\{\{[\s\S]*?\}\}/g, "")
      .replace(/<[^>]+>/g, "")
      .trim();
    if (stripped) {
      return stripped;
    }
    return options.language === "es" ? "Hola," : "Hi there,";
  }
  return "";
}

/**
 * Renders a complete KarmaRise HTML email matching the brand's warm parchment-and-forest system,
 * with WCAG AA Deep Forest CTAs, responsive mobile padding collapse, dark-mode logo protection,
 * and Outlook MSO structural wrappers.
 */
export function renderEmailLetterHtml(options: EmailLetterOptions): string {
  const isEs = options.language === "es";
  const escapedSiteBase = escapeHtml(options.siteBaseUrl);
  const logoUrl = escapeHtml(
    resolveEmailLogoUrl(options.siteBaseUrl, options.logoUrl),
  );
  const heading = escapeHtml(options.heading);
  const preheader = escapeHtml(options.preheader || options.heading);
  const brandTitle = escapeHtml(options.brandTitle);
  const issueTag = escapeHtml(options.issueTag);
  const dateline = escapeHtml(options.dateline);

  const greetingHtml = options.greetingTemplate
    ? `<p style="margin:0 0 18px;font-family:${EMAIL_FONT_SERIF};font-size:17px;line-height:1.78;color:${EMAIL_COLORS.forestDeep};">
        ${options.greetingTemplate}
      </p>`
    : options.greetingText
      ? `<p style="margin:0 0 18px;font-family:${EMAIL_FONT_SERIF};font-size:17px;line-height:1.78;color:${EMAIL_COLORS.forestDeep};">
          ${escapeHtml(options.greetingText)}
        </p>`
      : "";

  const beforeHtml = options.beforePhotoParagraphs
    .map(renderContentBlock)
    .join("");

  const photoHtml = options.heroPhoto?.url
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 26px;">
        <tr>
          <td style="padding:0;line-height:0;">
            ${
              options.heroPhoto.linkHref
                ? `<a href="${escapeHtml(options.heroPhoto.linkHref)}" style="display:block;text-decoration:none;"><img src="${escapeHtml(options.heroPhoto.url)}" alt="${escapeHtml(options.heroPhoto.alt)}" width="512" style="display:block;width:100%;max-width:512px;height:auto;border-radius:12px;border:0;" /></a>`
                : `<img src="${escapeHtml(options.heroPhoto.url)}" alt="${escapeHtml(options.heroPhoto.alt)}" width="512" style="display:block;width:100%;max-width:512px;height:auto;border-radius:12px;border:0;" />`
            }
          </td>
        </tr>
      </table>`
    : "";

  const afterHtml = (options.afterPhotoParagraphs ?? [])
    .map(renderContentBlock)
    .join("");

  const summaryCardHtml = options.summaryCard
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:22px 0 26px;background-color:${EMAIL_COLORS.paperSoftBox};border-radius:12px;">
        <tr>
          <td style="padding:20px 22px;border-left:3px solid ${EMAIL_COLORS.clayInk};border-radius:12px;">
            <p style="margin:0 0 10px;font-family:${EMAIL_FONT_SANS};font-size:13px;letter-spacing:0.8px;text-transform:uppercase;color:${EMAIL_COLORS.clayInk};font-weight:600;">
              ${escapeHtml(options.summaryCard.title)}
            </p>
            ${options.summaryCard.rows
              .map((row) => {
                const valueHtml = row.href
                  ? `<a href="${escapeHtml(row.href)}" target="_blank" rel="noopener noreferrer" style="color:${EMAIL_COLORS.clayInk};text-decoration:underline;">${escapeHtml(row.value)}</a>`
                  : escapeHtml(row.value);
                return `<p style="margin:0 0 6px;font-family:${EMAIL_FONT_SERIF};font-size:15px;line-height:1.6;color:${EMAIL_COLORS.forestDeep};">
                  <strong style="font-family:${EMAIL_FONT_SANS};font-size:13px;font-weight:600;">${escapeHtml(row.label)}:</strong> ${valueHtml}
                </p>`;
              })
              .join("")}
            ${
              options.summaryCard.note
                ? `<p style="margin:10px 0 0;padding-top:10px;border-top:1px solid ${EMAIL_COLORS.paperDivider};font-family:${EMAIL_FONT_SERIF};font-size:15px;line-height:1.68;color:${EMAIL_COLORS.bodyInk};">${escapeHtml(options.summaryCard.note).replaceAll("\n", "<br />")}</p>`
                : ""
            }
          </td>
        </tr>
      </table>`
    : "";

  const primaryCtaHtml = options.primaryCta
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 26px;">
        <tr>
          <td align="left">
            <table role="presentation" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center" bgcolor="${EMAIL_COLORS.buttonBg}" style="border-radius:999px;background-color:${EMAIL_COLORS.buttonBg};">
                  <a href="${escapeHtml(options.primaryCta.href)}" style="display:inline-block;padding:14px 28px;mso-padding-alt:14px 28px;font-family:${EMAIL_FONT_SANS};font-size:14px;font-weight:600;letter-spacing:0.3px;color:${EMAIL_COLORS.buttonText};text-decoration:none;border-radius:999px;">
                    ${escapeHtml(options.primaryCta.label)}
                  </a>
                </td>
              </tr>
            </table>
            ${
              options.primaryCta.secondaryLabel &&
              options.primaryCta.secondaryHref
                ? `<p style="margin:12px 0 0;font-family:${EMAIL_FONT_SANS};font-size:13.5px;line-height:1.55;color:${EMAIL_COLORS.bodyMuted};">
                    <a href="${escapeHtml(options.primaryCta.secondaryHref)}" style="color:${EMAIL_COLORS.clayInk};font-weight:600;text-decoration:underline;">${escapeHtml(options.primaryCta.secondaryLabel)}</a>
                  </p>`
                : ""
            }
          </td>
        </tr>
      </table>`
    : "";

  const replyPromptHtml = options.replyPrompt
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:24px 0 28px;background-color:${EMAIL_COLORS.paperSoftBox};border-radius:12px;">
        <tr>
          <td style="padding:20px 22px;border-left:3px solid ${EMAIL_COLORS.clay};border-radius:12px;">
            <p style="margin:0 0 8px;font-family:${EMAIL_FONT_SERIF};font-size:17px;line-height:1.65;color:${EMAIL_COLORS.forestDeep};font-weight:600;">
              ${formatInlineEmailMarkup(options.replyPrompt.question)}
            </p>
            <p style="margin:0;font-family:${EMAIL_FONT_SANS};font-size:13.5px;line-height:1.55;color:${EMAIL_COLORS.bodyMuted};">
              ${escapeHtml(options.replyPrompt.helper)}
            </p>
          </td>
        </tr>
      </table>`
    : "";

  const psLabel = isEs ? "P.D." : "P.S.";
  const hasPs = Boolean(
    options.ps &&
    (options.ps.text?.trim() || (options.ps.ctaLabel && options.ps.ctaHref)),
  );
  const psHtml = hasPs
    ? `<table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin-top:26px;border-top:1px solid ${EMAIL_COLORS.paperDivider};">
        <tr>
          <td style="padding-top:22px;font-family:${EMAIL_FONT_SERIF};font-size:15.5px;line-height:1.72;color:${EMAIL_COLORS.psInk};">
            ${
              options.ps?.text?.trim()
                ? `<p style="margin:0 0 ${options.ps.ctaLabel && options.ps.ctaHref ? "12px" : "0"};">
                    <strong style="font-family:${EMAIL_FONT_SANS};font-size:13px;letter-spacing:0.8px;color:${EMAIL_COLORS.clayInk};text-transform:uppercase;">${psLabel}</strong>&nbsp; ${formatInlineEmailMarkup(options.ps.text.trim())}
                  </p>`
                : ""
            }
            ${
              options.ps?.ctaLabel && options.ps?.ctaHref
                ? `<p style="margin:0;font-family:${EMAIL_FONT_SANS};font-size:14px;line-height:1.6;">
                    <a href="${escapeHtml(options.ps.ctaHref)}" style="color:${EMAIL_COLORS.clayInk};font-weight:600;text-decoration:underline;">${escapeHtml(options.ps.ctaLabel)}</a>
                  </p>`
                : ""
            }
          </td>
        </tr>
      </table>`
    : "";

  const footerEmail = options.footerEmail || "stories@karmarisedglobal.com";
  const escapedFooterEmail = escapeHtml(footerEmail);

  const prefEnUrl = escapeHtml(
    `${options.siteBaseUrl}/api/newsletter/preferences?email={{ contact.EMAIL }}&lang=EN`,
  );
  const prefEsUrl = escapeHtml(
    `${options.siteBaseUrl}/api/newsletter/preferences?email={{ contact.EMAIL }}&lang=ES`,
  );

  const defaultMarketingNote = isEs
    ? "Te escribimos porque te apuntaste a Historias de KarmaRise."
    : "You are receiving this letter because you signed up for KarmaRise Stories.";
  const defaultTransactionalNote = isEs
    ? "Este correo confirma tu solicitud directa en karmarisedglobal.com."
    : "This message confirms your direct request on karmarisedglobal.com.";
  const footerNote = escapeHtml(
    options.footerNote ||
      (options.footerMode === "marketing"
        ? defaultMarketingNote
        : defaultTransactionalNote),
  );
  const unsubscribeLabel = isEs
    ? "Darte de baja cuando quieras"
    : "Unsubscribe anytime";

  const marketingSocialsHtml = `<p style="margin:0 0 6px;">
          ${isEs ? "También en:" : "Follow along:"}
          &nbsp;<a href="${escapeHtml(OFFICIAL_SOCIALS.karmariseLinkedIn)}" target="_blank" rel="noopener noreferrer" style="color:${EMAIL_COLORS.clayInk};text-decoration:underline;">LinkedIn</a>
          &nbsp;&middot;&nbsp;
          <a href="${escapeHtml(OFFICIAL_SOCIALS.karmariseInstagram)}" target="_blank" rel="noopener noreferrer" style="color:${EMAIL_COLORS.clayInk};text-decoration:underline;">Instagram</a>
          &nbsp;&middot;&nbsp;
          <a href="${escapeHtml(OFFICIAL_SOCIALS.almariseInstagram)}" target="_blank" rel="noopener noreferrer" style="color:${EMAIL_COLORS.clayInk};text-decoration:underline;">AlmaRise D Brand</a>
        </p>`;

  const footerHtml =
    options.footerMode === "marketing"
      ? `<p style="margin:0 0 6px;">
          ${
            isEs
              ? `Leyendo en español &nbsp;&middot;&nbsp; <a href="${prefEnUrl}" style="color:${EMAIL_COLORS.clayInk};font-weight:600;text-decoration:underline;">Prefer English? Switch here</a>`
              : `Reading in English &nbsp;&middot;&nbsp; <a href="${prefEsUrl}" style="color:${EMAIL_COLORS.clayInk};font-weight:600;text-decoration:underline;">¿Prefieres español? Cambia aquí</a>`
          }
        </p>
        ${marketingSocialsHtml}
        <p style="margin:0 0 4px;">
          ${footerNote}
        </p>
        <p style="margin:0;">
          <a href="mailto:${escapedFooterEmail}" style="color:${EMAIL_COLORS.clayInk};text-decoration:underline;">${escapedFooterEmail}</a>
          &nbsp;&middot;&nbsp;
          <a href="{{ unsubscribe }}" style="color:${EMAIL_COLORS.forestFooter};text-decoration:underline;">${unsubscribeLabel}</a>
        </p>`
      : `<p style="margin:0 0 4px;">
          ${footerNote}
        </p>
        <p style="margin:0;">
          <a href="mailto:${escapedFooterEmail}" style="color:${EMAIL_COLORS.clayInk};text-decoration:underline;">${escapedFooterEmail}</a>
          &nbsp;&middot;&nbsp;
          <a href="${escapedSiteBase}${isEs ? "/es" : ""}" style="color:${EMAIL_COLORS.forestFooter};text-decoration:underline;">karmarisedglobal.com</a>
        </p>`;

  return `<!DOCTYPE html>
<html lang="${options.language}">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${heading}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  <style>
    :root {
      color-scheme: light;
      supported-color-schemes: light;
    }
    @media only screen and (max-width: 600px) {
      .kr-outer { padding: 14px 8px 24px !important; }
      .kr-header { padding: 18px 20px 14px !important; }
      .kr-body { padding: 24px 20px 28px !important; }
      .kr-h1 { font-size: 25px !important; line-height: 1.24 !important; }
      .kr-footer { padding: 18px 12px 6px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${EMAIL_COLORS.outerBg};font-family:${EMAIL_FONT_SERIF};color:${EMAIL_COLORS.bodyInk};-webkit-font-smoothing:antialiased;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${preheader}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" class="kr-outer" style="background-color:${EMAIL_COLORS.outerBg};padding:34px 14px 40px;">
    <tr>
      <td align="center">
        <!--[if mso]>
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" align="center" style="width:600px;">
        <tr><td>
        <![endif]-->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px;background-color:${EMAIL_COLORS.paper};border:1px solid ${EMAIL_COLORS.paperBorder};border-radius:20px;overflow:hidden;box-shadow:0 12px 34px rgba(24,45,32,0.08);">
          <tr>
            <td class="kr-header" style="padding:22px 44px 18px;border-bottom:1px solid ${EMAIL_COLORS.paperRule};background-color:${EMAIL_COLORS.paper};">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="left" valign="middle">
                    <a href="${escapedSiteBase}${isEs ? "/es" : ""}" style="text-decoration:none;display:inline-block;background-color:${EMAIL_COLORS.paper};padding:6px 8px;border-radius:10px;">
                      <img src="${logoUrl}" alt="KarmaRise D Global" width="52" style="display:block;width:52px;height:auto;border:0;" />
                    </a>
                  </td>
                  <td align="right" valign="middle" style="font-family:${EMAIL_FONT_SANS};font-size:13px;line-height:1.5;color:${EMAIL_COLORS.bodyMuted};">
                    <span style="display:block;letter-spacing:1.2px;text-transform:uppercase;color:${EMAIL_COLORS.clayInk};font-weight:600;">${brandTitle}</span>
                    <span style="display:block;color:${EMAIL_COLORS.bodyMuted};">${issueTag}</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td class="kr-body" style="padding:32px 44px 36px;background-color:${EMAIL_COLORS.paper};">
              <h1 class="kr-h1" style="margin:0 0 12px;font-family:${EMAIL_FONT_SERIF};font-size:30px;line-height:1.22;font-weight:400;font-style:italic;color:${EMAIL_COLORS.forestDeep};">
                ${heading}
              </h1>
              <p style="margin:0 0 26px;padding-bottom:18px;border-bottom:1px solid ${EMAIL_COLORS.paperRule};font-family:${EMAIL_FONT_SANS};font-size:13px;letter-spacing:0.3px;color:${EMAIL_COLORS.bodyMuted};">
                ${dateline}
              </p>

              ${greetingHtml}
              ${beforeHtml}
              ${photoHtml}
              ${afterHtml}
              ${summaryCardHtml}
              ${primaryCtaHtml}
              ${replyPromptHtml}

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:8px;">
                <tr>
                  <td>
                    <p style="margin:0 0 4px;font-family:${EMAIL_FONT_SERIF};font-size:16px;font-style:italic;color:${EMAIL_COLORS.signoffWarm};">
                      ${escapeHtml(options.signoffLead)}
                    </p>
                    <p style="margin:0 0 4px;font-family:${EMAIL_FONT_SERIF};font-size:23px;line-height:1.2;color:${EMAIL_COLORS.forestDeep};">
                      ${escapeHtml(options.signoffName)}
                    </p>
                    <p style="margin:0;font-family:${EMAIL_FONT_SANS};font-size:13px;letter-spacing:0.4px;color:${EMAIL_COLORS.clayInk};">
                      ${escapeHtml(options.signoffLocation)}
                    </p>
                  </td>
                </tr>
              </table>

              ${psHtml}
            </td>
          </tr>
        </table>
        <!--[if mso]>
        </td></tr>
        </table>
        <![endif]-->

        <!--[if mso]>
        <table role="presentation" width="560" cellspacing="0" cellpadding="0" border="0" align="center" style="width:560px;">
        <tr><td>
        <![endif]-->
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" class="kr-footer" style="width:100%;max-width:560px;padding:22px 18px 6px;">
          <tr>
            <td align="center" style="font-family:${EMAIL_FONT_SANS};font-size:13px;line-height:1.7;color:${EMAIL_COLORS.forestFooter};">
              ${footerHtml}
            </td>
          </tr>
        </table>
        <!--[if mso]>
        </td></tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Generates a complete plain-text companion body for multipart email delivery.
 */
export function renderEmailLetterText(options: EmailLetterOptions): string {
  const isEs = options.language === "es";
  const lines: string[] = [];

  if (options.heading.trim()) {
    lines.push(options.heading.trim());
  }
  if (options.dateline.trim()) {
    lines.push(options.dateline.trim());
  }
  if (lines.length > 0) {
    lines.push("");
  }

  const greeting = resolvePlainTextGreeting(options);
  if (greeting) {
    lines.push(greeting, "");
  }

  for (const block of options.beforePhotoParagraphs) {
    lines.push(stripInlineEmailMarkup(block), "");
  }

  for (const block of options.afterPhotoParagraphs ?? []) {
    lines.push(stripInlineEmailMarkup(block), "");
  }

  if (options.summaryCard) {
    lines.push(options.summaryCard.title.toUpperCase());
    for (const row of options.summaryCard.rows) {
      lines.push(`${row.label}: ${row.value}`);
    }
    if (options.summaryCard.note) {
      lines.push("", options.summaryCard.note);
    }
    lines.push("");
  }

  if (options.primaryCta) {
    lines.push(`${options.primaryCta.label}: ${options.primaryCta.href}`);
    if (options.primaryCta.secondaryLabel && options.primaryCta.secondaryHref) {
      lines.push(
        `${options.primaryCta.secondaryLabel}: ${options.primaryCta.secondaryHref}`,
      );
    }
    lines.push("");
  }

  if (options.replyPrompt) {
    lines.push(
      stripInlineEmailMarkup(options.replyPrompt.question),
      options.replyPrompt.helper,
      "",
    );
  }

  lines.push(options.signoffLead, options.signoffName, options.signoffLocation);

  if (options.ps?.text?.trim()) {
    lines.push(
      "",
      `${isEs ? "P.D." : "P.S."} ${stripInlineEmailMarkup(options.ps.text.trim())}`,
    );
  }
  if (options.ps?.ctaLabel && options.ps?.ctaHref) {
    lines.push(`${options.ps.ctaLabel}: ${options.ps.ctaHref}`);
  }

  const footerEmail = options.footerEmail || "stories@karmarisedglobal.com";
  const defaultFooterNote =
    options.footerMode === "marketing"
      ? isEs
        ? "Te escribimos porque te apuntaste a Historias de KarmaRise."
        : "You are receiving this letter because you signed up for KarmaRise Stories."
      : isEs
        ? "Este correo confirma tu solicitud directa en karmarisedglobal.com."
        : "This message confirms your direct request on karmarisedglobal.com.";
  const footerNote = options.footerNote || defaultFooterNote;

  lines.push("", "---", footerNote);
  lines.push(
    `${isEs ? "Contacto" : "Contact"}: ${footerEmail} | ${options.siteBaseUrl}${isEs ? "/es" : ""}`,
  );

  if (options.footerMode === "marketing") {
    const switchUrl = `${options.siteBaseUrl}/api/newsletter/preferences?email={{ contact.EMAIL }}&lang=${isEs ? "EN" : "ES"}`;
    lines.push(
      isEs
        ? `Prefer English? Switch here: ${switchUrl}`
        : `¿Prefieres español? Cambia aquí: ${switchUrl}`,
    );
    lines.push(
      `LinkedIn: ${OFFICIAL_SOCIALS.karmariseLinkedIn} | Instagram: ${OFFICIAL_SOCIALS.karmariseInstagram} | AlmaRise D Brand: ${OFFICIAL_SOCIALS.almariseInstagram}`,
    );
    lines.push(
      isEs
        ? "Darte de baja: {{ unsubscribe }}"
        : "Unsubscribe: {{ unsubscribe }}",
    );
  }

  return lines.join("\n").trim();
}
