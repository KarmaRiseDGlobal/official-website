import "server-only";

import { localizeOptionForConfirmation } from "@/data/product-brief-options";
import {
  mapCallLanguageOptionValue,
  type CallDuration,
  type CallLanguage,
} from "@/lib/cal";
import { appendEmailUtm, type SessionAttribution } from "@/lib/email-analytics";
import {
  renderEmailLetterHtml,
  renderEmailLetterText,
  resolveCanonicalSiteBase,
  type EmailSummaryRow,
} from "@/lib/email-layout";
import type { SiteLanguage } from "@/lib/urls";

export interface ProductBriefConfirmationFields {
  name: string;
  company: string;
  profile: string;
  email: string;
  language: string;
  siteLanguage: string;
  product: string;
  readiness: string;
  quantity: string;
  referenceUrl: string;
  brief: string;
  attribution?: SessionAttribution;
}

export function buildProductBriefConfirmationEmail({
  confirmationLanguage,
  fields,
  attachmentNames,
  recipientEmail,
}: {
  confirmationLanguage: SiteLanguage;
  fields: ProductBriefConfirmationFields;
  attachmentNames: string[];
  recipientEmail: string;
}): { subject: string; preheader: string; text: string; html: string } {
  const isEs = confirmationLanguage === "es";
  const siteBase = resolveCanonicalSiteBase();
  const subjectLabel = fields.company || fields.name;
  const localizedProduct = localizeOptionForConfirmation(
    fields.product,
    confirmationLanguage,
  );
  const localizedReadiness = localizeOptionForConfirmation(
    fields.readiness,
    confirmationLanguage,
  );

  const bookCallUrl = appendEmailUtm(
    `${siteBase}${isEs ? "/es" : ""}/book-a-call?duration=15`,
    {
      source: "resend",
      campaign: isEs ? "brief-confirmation-es" : "brief-confirmation-en",
      content: "book-call-cta",
    },
  );

  const summaryRows: EmailSummaryRow[] = [
    ...(fields.company
      ? [{ label: isEs ? "Empresa o marca" : "Company", value: fields.company }]
      : []),
    {
      label: isEs ? "Tipo de producto" : "Product type",
      value: localizedProduct,
    },
    {
      label: isEs ? "Fase actual" : "Current stage",
      value: localizedReadiness,
    },
    ...(fields.quantity
      ? [
          {
            label: isEs ? "Cantidad estimada" : "Estimated Bulk Order quantity",
            value: fields.quantity,
          },
        ]
      : []),
    ...(fields.referenceUrl
      ? [
          {
            label: isEs ? "Enlace de referencia" : "Reference link",
            value: fields.referenceUrl,
            href: fields.referenceUrl,
          },
        ]
      : []),
    ...(attachmentNames.length > 0
      ? [
          {
            label: isEs
              ? `Archivos adjuntos (${attachmentNames.length})`
              : `Attached files (${attachmentNames.length})`,
            value: attachmentNames.join(", "),
          },
        ]
      : []),
  ];

  const letterOptions = isEs
    ? {
        language: "es" as const,
        siteBaseUrl: siteBase,
        brandTitle: "KarmaRise D Global",
        issueTag: "Briefing de producto · Recibido",
        heading: `Ya tenemos tu briefing de producto, ${fields.name}.`,
        preheader:
          "Alma leerá tu briefing de producto personalmente, lo valorará con Shirish y te responderá en 1 o 2 días laborables.",
        dateline: "De Alma y Shirish · España e India",
        greetingText: `Hola ${fields.name},`,
        beforePhotoParagraphs: [
          fields.company
            ? `¡Qué alegría recibir los detalles para **${fields.company}**! Lo hemos registrado en ${recipientEmail} y nos hace mucha ilusión revisar cada proyecto nuevo que llega a nuestra bandeja.`
            : `¡Qué alegría recibir tu proyecto! Hemos registrado tu briefing de producto en ${recipientEmail} y nos hace mucha ilusión leer cada idea nueva que llega a nuestra bandeja.`,
          "Alma leerá tus notas y referencias personalmente y lo valorará junto con Shirish antes de responderte directamente a este correo en 1 o 2 días laborables. Alma te escribirá con primeras impresiones claras y los siguientes pasos prácticos.",
          "Durante toda la valoración solo nosotros dos vemos tus bocetos y archivos, y tienes disponible un acuerdo mutuo NDA en cuanto lo necesites. Si prefieres verlo en directo, también puedes elegir una videollamada gratuita de 15 minutos con Alma.",
        ],
        summaryCard: {
          title: "Resumen de tu briefing de producto",
          rows: summaryRows,
          note: fields.brief || undefined,
        },
        primaryCta: {
          label: "Reservar videollamada con Alma",
          href: bookCallUrl,
        },
        replyPrompt: {
          question:
            "¿Te apetece añadir un boceto rápido, fotos o algún detalle más?",
          helper:
            "Responde directamente a este correo y llegará entero a la bandeja de Alma y Shirish.",
        },
        signoffLead: "Un abrazo,",
        signoffName: "Alma y Shirish",
        signoffLocation: "KarmaRise D Global · España e India",
        footerMode: "transactional" as const,
        footerEmail: recipientEmail,
        footerNote:
          "Confirmación automática de tu briefing de producto en karmarisedglobal.com.",
      }
    : {
        language: "en" as const,
        siteBaseUrl: siteBase,
        brandTitle: "KarmaRise D Global",
        issueTag: "Product Brief · Received",
        heading: `We have your Product Brief, ${fields.name}.`,
        preheader:
          "Alma will read your Product Brief personally, review it with Shirish, and reply within 1 to 2 business days.",
        dateline: "From Alma & Shirish · Spain & India",
        greetingText: `Hi ${fields.name},`,
        beforePhotoParagraphs: [
          fields.company
            ? `Thank you for sharing what you want to build for **${fields.company}**. Your brief has landed in ${recipientEmail}, and seeing a new project take shape genuinely makes our day.`
            : `Thank you for sharing what you want to build. Your Product Brief has landed in ${recipientEmail}, and seeing a new project take shape genuinely makes our day.`,
          "Alma reads every brief herself and reviews it with Shirish before writing straight back to this address within 1 to 2 business days with clear first thoughts and practical next steps.",
          "Only the two of us review your sketches and references during evaluation, and a mutual NDA is ready whenever you want one. If talking it through live feels faster, you can also pick a free 15-minute video call with Alma below.",
        ],
        summaryCard: {
          title: "Your Product Brief summary",
          rows: summaryRows,
          note: fields.brief || undefined,
        },
        primaryCta: {
          label: "Book a call with Alma",
          href: bookCallUrl,
        },
        replyPrompt: {
          question:
            "Want to add a quick photo, sketch, or note while we review?",
          helper:
            "Hit reply straight to this email and it lands directly with Alma and Shirish.",
        },
        signoffLead: "Warmly,",
        signoffName: "Alma & Shirish",
        signoffLocation: "KarmaRise D Global · Spain & India",
        footerMode: "transactional" as const,
        footerEmail: recipientEmail,
        footerNote:
          "Automatic confirmation of your Product Brief on karmarisedglobal.com.",
      };

  const fullSubject = isEs
    ? `Hemos recibido tu briefing de producto (${subjectLabel})`
    : `We received your Product Brief (${subjectLabel})`;
  const subject =
    fullSubject.length <= 55
      ? fullSubject
      : isEs
        ? "Hemos recibido tu briefing de producto"
        : "We received your Product Brief";

  return {
    subject,
    preheader: letterOptions.preheader,
    text: renderEmailLetterText(letterOptions),
    html: renderEmailLetterHtml(letterOptions),
  };
}

function resolveTopicNextStepParagraph(
  topicValue: string,
  language: SiteLanguage,
): string {
  if (language === "es") {
    if (topicValue === "Manufacturing Partner introduction") {
      return "Alma o Shirish revisarán la presentación de tu unidad de producción y te responderán directamente a este correo. Shirish atiende personalmente el contacto con fábricas de corte familiar y colectivos de artesanas en la India que trabajan con puertas abiertas.";
    }
    if (topicValue === "AlmaRise D Brand") {
      return "Alma o Shirish revisarán tu mensaje sobre AlmaRise D Brand (incluyendo AlmaRise D Reborn, AlmaRise D Organic y AlmaRise D Home Decor) y te responderán directamente a este correo en 1 o 2 días laborables.";
    }
    if (topicValue === "Women's Training Initiative") {
      return "Alma o Shirish revisarán tu nota y te responderán directamente a este correo. Para ser totalmente transparentes desde el principio, nuestra Iniciativa de formación para mujeres sigue en preparación y las plazas aún no están abiertas, aunque leemos con mucho cariño cada mensaje de quienes apoyan la formación textil con oficio real.";
    }
    return "Alma o Shirish revisarán tu consulta y te responderán directamente a este correo en 1 o 2 días laborables. Si mientras tanto quieres añadir algún detalle más, responde directamente a este mismo mensaje.";
  }

  if (topicValue === "Manufacturing Partner introduction") {
    return "Alma or Shirish will review your production unit profile and reply directly to this email. Shirish handles Indian partner introductions personally, and we gladly meet family-run factories and women artisan collectives working with open doors.";
  }
  if (topicValue === "AlmaRise D Brand") {
    return "Alma or Shirish will review your message about AlmaRise D Brand (spanning AlmaRise D Reborn, AlmaRise D Organic, and AlmaRise D Home Decor) and reply directly to your email address within 1 to 2 business days.";
  }
  if (topicValue === "Women's Training Initiative") {
    return "Alma or Shirish will review your note and reply directly to your email address. To be plain upfront, our Women's Training Initiative is still in preparation and applications are not open yet, though we gladly read every message from people who share an interest in skilled garment training.";
  }
  return "Alma or Shirish will review your note and reply directly to your email address within 1 to 2 business days. If you want to add another detail in the meantime, simply reply to this message.";
}

export function buildContactConfirmationEmail({
  language,
  name,
  topicValue,
  topicLabel,
  note,
  routedDepartmentEmail,
}: {
  language: SiteLanguage;
  name: string;
  topicValue: string;
  topicLabel: string;
  note: string;
  routedDepartmentEmail: string;
}): { subject: string; preheader: string; text: string; html: string } {
  const isEs = language === "es";
  const siteBase = resolveCanonicalSiteBase();
  const nextStepParagraph = resolveTopicNextStepParagraph(topicValue, language);

  const letterOptions = isEs
    ? {
        language: "es" as const,
        siteBaseUrl: siteBase,
        brandTitle: "KarmaRise D Global",
        issueTag: "Contacto · Recibido",
        heading: `Gracias por escribirnos, ${name}.`,
        preheader:
          "Hemos dirigido tu mensaje directamente a Alma y Shirish. Leemos cada nota y respondemos en 1 o 2 días laborables.",
        dateline: "De Alma y Shirish · España e India",
        greetingText: `Hola ${name},`,
        beforePhotoParagraphs: [
          `Hemos recibido tu mensaje sobre **${topicLabel}** y ya está en la bandeja de nuestro equipo (${routedDepartmentEmail}).`,
          nextStepParagraph,
        ],
        summaryCard: {
          title: "Resumen de tu consulta",
          rows: [{ label: "Asunto", value: topicLabel }],
          note,
        },
        signoffLead: "Un abrazo,",
        signoffName: "Alma y Shirish",
        signoffLocation: "KarmaRise D Global · España e India",
        footerMode: "transactional" as const,
        footerEmail: routedDepartmentEmail,
        footerNote:
          "Confirmación automática de tu mensaje enviado en karmarisedglobal.com.",
      }
    : {
        language: "en" as const,
        siteBaseUrl: siteBase,
        brandTitle: "KarmaRise D Global",
        issueTag: "Contact · Received",
        heading: `Thank you for writing, ${name}.`,
        preheader:
          "Your message has reached Alma and Shirish directly. We read every note and reply within 1 to 2 business days.",
        dateline: "From Alma & Shirish · Spain & India",
        greetingText: `Hi ${name},`,
        beforePhotoParagraphs: [
          `We have received your message on **${topicLabel}** and routed it straight to ${routedDepartmentEmail}.`,
          nextStepParagraph,
        ],
        summaryCard: {
          title: "Summary of your message",
          rows: [{ label: "Topic", value: topicLabel }],
          note,
        },
        signoffLead: "Warmly,",
        signoffName: "Alma & Shirish",
        signoffLocation: "KarmaRise D Global · Spain & India",
        footerMode: "transactional" as const,
        footerEmail: routedDepartmentEmail,
        footerNote:
          "Automatic confirmation of your message on karmarisedglobal.com.",
      };

  const subject = isEs
    ? "Hemos recibido tu mensaje · KarmaRise D Global"
    : "We received your message · KarmaRise D Global";

  return {
    subject,
    preheader: letterOptions.preheader,
    text: renderEmailLetterText(letterOptions),
    html: renderEmailLetterHtml(letterOptions),
  };
}

function formatCallDateTime(
  isoString: string,
  timeZone: string,
  language: SiteLanguage,
): string {
  try {
    const date = new Date(isoString);
    if (Number.isNaN(date.getTime())) {
      return isoString;
    }
    const formatted = new Intl.DateTimeFormat(
      language === "es" ? "es-ES" : "en-GB",
      {
        dateStyle: "full",
        timeStyle: "short",
        timeZone,
      },
    ).format(date);
    return `${formatted} (${timeZone})`;
  } catch {
    return `${isoString} (${timeZone})`;
  }
}

export function buildPreCallPrepEmail(options: {
  siteLanguage: SiteLanguage;
  name: string;
  company?: string;
  duration: CallDuration;
  callLanguage: CallLanguage;
  startTime: string;
  timeZone: string;
  meetingUrl: string | null;
  notes?: string;
}): { subject: string; preheader: string; text: string; html: string } {
  const isEs = options.siteLanguage === "es";
  const siteBase = resolveCanonicalSiteBase();
  const formattedTime = formatCallDateTime(
    options.startTime,
    options.timeZone,
    options.siteLanguage,
  );
  const callLanguageLabel = mapCallLanguageOptionValue(
    options.siteLanguage,
    options.callLanguage,
  );
  const callTitle =
    options.duration === "15"
      ? isEs
        ? "Consulta rápida (15 minutos)"
        : "Quick intro call (15 minutes)"
      : isEs
        ? "Revisión de briefing de producto (30 minutos)"
        : "Product Brief review (30 minutes)";

  const summaryRows: EmailSummaryRow[] = [
    { label: isEs ? "Sesión" : "Session", value: callTitle },
    { label: isEs ? "Fecha y hora" : "Date and time", value: formattedTime },
    {
      label: isEs ? "Idioma de la llamada" : "Call language",
      value: callLanguageLabel,
    },
    ...(options.company
      ? [
          {
            label: isEs ? "Empresa o tienda" : "Company",
            value: options.company,
          },
        ]
      : []),
    ...(options.meetingUrl
      ? [
          {
            label: "Google Meet",
            value: options.meetingUrl,
            href: options.meetingUrl,
          },
        ]
      : []),
  ];

  const letterOptions = isEs
    ? {
        language: "es" as const,
        siteBaseUrl: siteBase,
        brandTitle: "KarmaRise D Global",
        issueTag: "Videollamada confirmada · Preparación",
        heading: `Qué ganas de charlar contigo, ${options.name}.`,
        preheader:
          "Tu videollamada con Alma por Google Meet está confirmada. Trae tu boceto o pieza de referencia, sin ficha técnica cerrada.",
        dateline: "De Alma · KarmaRise D Global (España e India)",
        greetingText: `Hola ${options.name},`,
        beforePhotoParagraphs: [
          `Tu hueco en Google Meet ya está reservado. Hablaremos en ${callLanguageLabel.toLowerCase()}, y podemos cambiar entre español, inglés o portugués cuando quieras.`,
          "No hace falta ficha técnica cerrada. Trae solo lo que ya tengas a mano:",
          "- Un boceto sencillo, fotos del móvil o una pieza de tu tienda para mejorar.\n- Tu categoría (piel, ropa, complementos o decoración del hogar) y fecha orientativa.\n- Dudas sobre muestras físicas de color, aprobación antes de cortar, acuerdo NDA o envíos.",
          "Justo al colgar te enviaré por correo las conclusiones de la reunión por escrito.",
        ],
        summaryCard: {
          title: "Detalles de tu videollamada",
          rows: summaryRows,
          note: options.notes || undefined,
        },
        ...(options.meetingUrl
          ? {
              primaryCta: {
                label: "Abrir enlace de Google Meet",
                href: options.meetingUrl,
              },
            }
          : {}),
        replyPrompt: {
          question: "¿Quieres mover la hora o adelantarme alguna foto?",
          helper:
            "Responde a este correo o escríbeme por WhatsApp al +34 611 722 276.",
        },
        signoffLead: "Un abrazo,",
        signoffName: "Alma",
        signoffLocation: "Cofundadora · KarmaRise D Global (España e India)",
        footerMode: "transactional" as const,
        footerEmail: "alma@karmarisedglobal.com",
        footerNote:
          "Nota de preparación para tu videollamada reservada en karmarisedglobal.com.",
      }
    : {
        language: "en" as const,
        siteBaseUrl: siteBase,
        brandTitle: "KarmaRise D Global",
        issueTag: "Video call confirmed · Prep note",
        heading: `Looking forward to talking, ${options.name}.`,
        preheader:
          "Your Google Meet call with Alma is confirmed. Bring whatever sketch or shop piece you have, with no tech pack needed.",
        dateline: "From Alma · KarmaRise D Global (Spain & India)",
        greetingText: `Hi ${options.name},`,
        beforePhotoParagraphs: [
          `Your Google Meet slot is booked. We will speak in ${callLanguageLabel}, and I can switch between English, Spanish, and Portuguese anytime.`,
          "No tech pack needed. Bring whatever sits on your desk:",
          "- A rough sketch, phone photos, or a shop item you want to refine.\n- Your category (leather goods, clothing, textile accessories, or textile home decor) and launch window.\n- Questions on colour swatches, sample approval before cutting starts, mutual NDAs, or doorstep delivery.",
          "Right after we speak, I will email clear meeting notes so every point stays in writing.",
        ],
        summaryCard: {
          title: "Your call details",
          rows: summaryRows,
          note: options.notes || undefined,
        },
        ...(options.meetingUrl
          ? {
              primaryCta: {
                label: "Open Google Meet link",
                href: options.meetingUrl,
              },
            }
          : {}),
        replyPrompt: {
          question: "Need to move the time or share a photo early?",
          helper:
            "Reply to this email or message me on WhatsApp at +34 611 722 276.",
        },
        signoffLead: "Warmly,",
        signoffName: "Alma",
        signoffLocation: "Co-founder · KarmaRise D Global (Spain & India)",
        footerMode: "transactional" as const,
        footerEmail: "alma@karmarisedglobal.com",
        footerNote:
          "Preparation note for your video call booked on karmarisedglobal.com.",
      };

  const subject = isEs
    ? "Nos vemos pronto en Google Meet · Alma (KarmaRise D Global)"
    : "Looking forward to our call · Alma (KarmaRise D Global)";

  return {
    subject,
    preheader: letterOptions.preheader,
    text: renderEmailLetterText(letterOptions),
    html: renderEmailLetterHtml(letterOptions),
  };
}
