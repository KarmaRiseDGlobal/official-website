import { NextResponse } from "next/server";

import {
  MAX_FILE_BYTES,
  MAX_TOTAL_UPLOAD_BYTES,
  MAX_UPLOAD_FILES,
} from "@/data/product-brief-options";
import { trackBrevoEvent } from "@/lib/brevo";
import {
  attributionToEventProperties,
  EMAIL_ANALYTICS_EVENTS,
  extractRequestAttribution,
  formatAttributionLine,
} from "@/lib/email-analytics";
import { sendResendEmail, type ResendAttachment } from "@/lib/resend";
import {
  escapeHtml,
  guardFormRequest,
  isSafeHttpUrl,
  readJsonObject,
  validateUploadedFile,
} from "@/lib/security";
import {
  buildProductBriefConfirmationEmail,
  type ProductBriefConfirmationFields,
} from "@/lib/transactional-emails";
import type { SiteLanguage } from "@/lib/urls";
import { isValidEmail, readTrimmedString } from "@/lib/validation";

const MAX_JSON_BYTES = 64 * 1024;
const MAX_MULTIPART_BYTES = 11 * 1024 * 1024;

function resolveConfirmationLanguage(
  preferredLanguage: string,
  siteLanguage?: string,
): SiteLanguage {
  const normalizedPreferred = preferredLanguage.trim().toLowerCase();
  if (
    normalizedPreferred === "spanish" ||
    normalizedPreferred === "es" ||
    normalizedPreferred.startsWith("es-") ||
    normalizedPreferred === "español" ||
    normalizedPreferred === "espanol"
  ) {
    return "es";
  }

  if (
    normalizedPreferred === "english" ||
    normalizedPreferred === "en" ||
    normalizedPreferred.startsWith("en-") ||
    normalizedPreferred === "inglés" ||
    normalizedPreferred === "ingles"
  ) {
    return "en";
  }

  const normalizedSite = siteLanguage?.trim().toLowerCase() ?? "";
  return normalizedSite.startsWith("es") ? "es" : "en";
}

function localizeGuardError(
  status: 400 | 403 | 429,
  fallbackError: string,
  isEs: boolean,
): string {
  if (!isEs) {
    return fallbackError;
  }
  if (status === 429) {
    return "Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.";
  }
  if (status === 400) {
    return "Completa la verificación de seguridad antes de enviar.";
  }
  return "No pudimos completar la verificación de seguridad. Inténtalo de nuevo.";
}

function localizeUploadValidationError(
  fallbackError: string,
  isEs: boolean,
): string {
  if (!isEs) {
    return fallbackError;
  }
  const lower = fallbackError.toLowerCase();
  if (lower.includes("empty")) {
    return "El archivo adjunto está vacío.";
  }
  if (lower.includes("exceeds") || lower.includes("limit")) {
    return "Cada archivo adjunto debe pesar 4 MB o menos.";
  }
  if (lower.includes("extension") || lower.includes("supported")) {
    return "Solo se admiten archivos JPG, PNG, WebP y PDF.";
  }
  if (lower.includes("match")) {
    return "El contenido del archivo no coincide con el formato indicado.";
  }
  return "No pudimos validar uno de los archivos adjuntos.";
}

function localizeDeliveryError(
  status: number,
  fallbackError: string,
  isEs: boolean,
): string {
  if (!isEs) {
    return fallbackError;
  }
  if (status === 500) {
    return "El envío de correos todavía no está configurado en este entorno.";
  }
  return "No pudimos enviar tu briefing de producto ahora mismo. Inténtalo de nuevo o escríbenos a inquiry@karmarisedglobal.com.";
}

function combineUint8Chunks(
  chunks: Uint8Array[],
  totalBytes: number,
): Uint8Array<ArrayBuffer> {
  const buffer = new ArrayBuffer(totalBytes);
  const combined = new Uint8Array(buffer);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return combined;
}

async function readBoundedMultipartFormData(
  request: Request,
  maxBytes: number,
  isEs: boolean,
): Promise<
  | { ok: true; formData: FormData }
  | { ok: false; status: 400 | 413; error: string }
> {
  const contentTypeHeader = request.headers.get("content-type")?.trim() ?? "";
  const contentLengthRaw = request.headers.get("content-length")?.trim();
  if (contentLengthRaw && /^\d+$/.test(contentLengthRaw)) {
    const declaredLength = Number(contentLengthRaw);
    if (declaredLength > maxBytes) {
      return {
        ok: false,
        status: 413,
        error: isEs
          ? "Los archivos enviados superan el límite total de 11 MB."
          : "Uploaded payload exceeds the 11 MB limit.",
      };
    }
  }

  let bodyBytes: Uint8Array<ArrayBuffer>;
  if (request.body) {
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let totalBytes = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (!value) {
          continue;
        }

        totalBytes += value.byteLength;
        if (totalBytes > maxBytes) {
          await reader.cancel().catch(() => {});
          return {
            ok: false,
            status: 413,
            error: isEs
              ? "Los archivos enviados superan el límite total de 11 MB."
              : "Uploaded payload exceeds the 11 MB limit.",
          };
        }
        chunks.push(value);
      }
    } catch {
      return {
        ok: false,
        status: 400,
        error: isEs
          ? "No pudimos leer los datos enviados en el formulario."
          : "Unable to read uploaded form payload.",
      };
    }

    bodyBytes = combineUint8Chunks(chunks, totalBytes);
  } else {
    try {
      const arrayBuffer = await request.arrayBuffer();
      if (arrayBuffer.byteLength > maxBytes) {
        return {
          ok: false,
          status: 413,
          error: isEs
            ? "Los archivos enviados superan el límite total de 11 MB."
            : "Uploaded payload exceeds the 11 MB limit.",
        };
      }
      bodyBytes = new Uint8Array(arrayBuffer);
    } catch {
      return {
        ok: false,
        status: 400,
        error: isEs
          ? "No pudimos leer los datos enviados en el formulario."
          : "Unable to read uploaded form payload.",
      };
    }
  }

  try {
    const formData = await new Response(bodyBytes, {
      headers: { "content-type": contentTypeHeader },
    }).formData();
    return { ok: true, formData };
  } catch {
    return {
      ok: false,
      status: 400,
      error: isEs
        ? "El formulario enviado no tiene un formato válido."
        : "Invalid multipart form payload.",
    };
  }
}

function readFormString(formData: FormData, key: string): string {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry : "";
}

function extractUploadedFiles(formData: FormData): File[] {
  const files: File[] = [];
  for (const fieldName of ["attachments", "files", "file"]) {
    for (const entry of formData.getAll(fieldName)) {
      if (!(entry instanceof File)) {
        continue;
      }
      if (entry.name === "" && entry.size === 0) {
        continue;
      }
      files.push(entry);
    }
  }
  return files;
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  const isMultipart = contentType.includes("multipart/form-data");
  const headerIsEs =
    request.headers.get("accept-language")?.toLowerCase().startsWith("es") ??
    false;

  let rawCompanyWebsite: unknown = "";
  let rawTurnstileToken: unknown = "";
  let rawFields: Record<string, unknown> = {};
  let uploadedFiles: File[] = [];

  if (isMultipart) {
    const multipartResult = await readBoundedMultipartFormData(
      request,
      MAX_MULTIPART_BYTES,
      headerIsEs,
    );
    if (!multipartResult.ok) {
      return NextResponse.json(
        { ok: false, error: multipartResult.error },
        { status: multipartResult.status },
      );
    }

    const { formData } = multipartResult;
    const honeypotEntry = formData.get("companyWebsite");
    rawCompanyWebsite =
      typeof honeypotEntry === "string"
        ? honeypotEntry
        : honeypotEntry instanceof File && honeypotEntry.size > 0
          ? "file"
          : "";
    rawTurnstileToken =
      formData.get("turnstileToken") ?? formData.get("cf-turnstile-response");
    let parsedMultipartAttribution: unknown;
    const rawAttrString = readFormString(formData, "attribution");
    if (rawAttrString) {
      try {
        parsedMultipartAttribution = JSON.parse(rawAttrString);
      } catch {
        parsedMultipartAttribution = undefined;
      }
    }
    rawFields = {
      name: readFormString(formData, "name"),
      company: readFormString(formData, "company"),
      profile: readFormString(formData, "profile"),
      email: readFormString(formData, "email"),
      language: readFormString(formData, "language"),
      siteLanguage: readFormString(formData, "siteLanguage"),
      product: readFormString(formData, "product"),
      readiness: readFormString(formData, "readiness"),
      quantity: readFormString(formData, "quantity"),
      referenceUrl: readFormString(formData, "referenceUrl"),
      brief: readFormString(formData, "brief"),
      attribution: parsedMultipartAttribution,
      referralSource: readFormString(formData, "referralSource") || undefined,
      referralCode: readFormString(formData, "referralCode") || undefined,
      utmSource: readFormString(formData, "utmSource") || undefined,
      utmMedium: readFormString(formData, "utmMedium") || undefined,
      utmCampaign: readFormString(formData, "utmCampaign") || undefined,
      utmContent: readFormString(formData, "utmContent") || undefined,
      utmTerm: readFormString(formData, "utmTerm") || undefined,
      landingPath: readFormString(formData, "landingPath") || undefined,
      attributionConsent:
        readFormString(formData, "attributionConsent") || undefined,
    };
    uploadedFiles = extractUploadedFiles(formData);
  } else {
    const jsonResult = await readJsonObject(request, MAX_JSON_BYTES);
    if (!jsonResult.ok) {
      return NextResponse.json(
        {
          ok: false,
          error: headerIsEs
            ? jsonResult.status === 413
              ? "La solicitud supera el tamaño permitido."
              : "Los datos enviados no son válidos."
            : jsonResult.error,
        },
        { status: jsonResult.status },
      );
    }

    rawFields = jsonResult.data;
    rawCompanyWebsite = rawFields.companyWebsite;
    rawTurnstileToken = rawFields.turnstileToken;
  }

  const language = readTrimmedString(rawFields.language, 80, {
    singleLine: true,
  });
  const siteLanguage = readTrimmedString(rawFields.siteLanguage, 16, {
    singleLine: true,
  });
  const confirmationLanguage = resolveConfirmationLanguage(
    language,
    siteLanguage,
  );
  const isEs = confirmationLanguage === "es";

  const guard = await guardFormRequest(
    request,
    {
      companyWebsite: rawCompanyWebsite,
      turnstileToken: rawTurnstileToken,
    },
    {
      scope: "product-brief",
      limit: 8,
      windowMs: 10 * 60 * 1000,
    },
  );

  if (!guard.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: localizeGuardError(guard.status, guard.error, isEs),
      },
      { status: guard.status },
    );
  }

  // Silently accept honeypot submissions so automated bots do not retry.
  if (guard.honeypotTriggered) {
    return NextResponse.json({ ok: true });
  }

  const name = readTrimmedString(rawFields.name, 160, { singleLine: true });
  const company = readTrimmedString(rawFields.company, 200, {
    singleLine: true,
  });
  const profile = readTrimmedString(rawFields.profile, 160, {
    singleLine: true,
  });
  const email = readTrimmedString(rawFields.email, 320, { singleLine: true });
  const product = readTrimmedString(rawFields.product, 160, {
    singleLine: true,
  });
  const readiness = readTrimmedString(rawFields.readiness, 200, {
    singleLine: true,
  });
  const quantity = readTrimmedString(rawFields.quantity, 160, {
    singleLine: true,
  });
  const referenceUrlRaw =
    typeof rawFields.referenceUrl === "string"
      ? rawFields.referenceUrl.trim()
      : "";
  const brief = readTrimmedString(rawFields.brief, 8000);
  const { attribution, referralSource, referralCode, attributionConsent } =
    extractRequestAttribution(rawFields);

  const resolvedLanguage = language || (isEs ? "Spanish" : "English");

  if (!name || !isValidEmail(email) || !product || !readiness) {
    return NextResponse.json(
      {
        ok: false,
        error: isEs
          ? "Completa tu nombre, correo electrónico, tipo de producto y fase actual antes de enviar."
          : "Complete your name, email, product type, and current stage before sending.",
      },
      { status: 400 },
    );
  }

  if (referenceUrlRaw) {
    if (referenceUrlRaw.length > 2000 || !isSafeHttpUrl(referenceUrlRaw)) {
      return NextResponse.json(
        {
          ok: false,
          error: isEs
            ? "El enlace de referencia debe ser una dirección http:// o https:// válida."
            : "Reference URL must be a valid http:// or https:// link.",
        },
        { status: 400 },
      );
    }
  }

  const resendAttachments: ResendAttachment[] = [];
  if (uploadedFiles.length > MAX_UPLOAD_FILES) {
    return NextResponse.json(
      {
        ok: false,
        error: isEs
          ? "Puedes adjuntar un máximo de 3 archivos."
          : "You can attach up to 3 files.",
      },
      { status: 400 },
    );
  }

  let totalRawBytes = 0;
  let totalValidatedBytes = 0;
  for (const file of uploadedFiles) {
    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: isEs
            ? "Cada archivo adjunto debe pesar 4 MB o menos."
            : "Each uploaded file must be 4 MB or smaller.",
        },
        { status: 413 },
      );
    }

    totalRawBytes += file.size;
    if (totalRawBytes > MAX_TOTAL_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: isEs
            ? "El tamaño total de los archivos adjuntos no puede superar los 10 MB."
            : "Total attached file size must not exceed 10 MB.",
        },
        { status: 413 },
      );
    }

    const validated = await validateUploadedFile(file, {
      maxBytes: MAX_FILE_BYTES,
    });
    if (!validated.ok) {
      const status = file.size > MAX_FILE_BYTES ? 413 : 400;
      return NextResponse.json(
        {
          ok: false,
          error: localizeUploadValidationError(validated.error, isEs),
        },
        { status },
      );
    }

    totalValidatedBytes += validated.size;
    if (totalValidatedBytes > MAX_TOTAL_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: isEs
            ? "El tamaño total de los archivos adjuntos no puede superar los 10 MB."
            : "Total attached file size must not exceed 10 MB.",
        },
        { status: 413 },
      );
    }

    resendAttachments.push({
      filename: validated.filename,
      content: validated.base64Content,
      contentType: validated.contentType,
    });
  }

  const recipient =
    process.env.CONTACT_INQUIRY_EMAIL?.trim() ||
    process.env.CONTACT_TO_EMAIL?.trim() ||
    "inquiry@karmarisedglobal.com";

  const attachmentNames = resendAttachments.map((item) => item.filename);
  const attributionLine = formatAttributionLine(attribution);

  const internalSubjectTarget = company || name;
  const internalText = [
    `Name: ${name}`,
    company ? `Company: ${company}` : null,
    profile ? `Profile: ${profile}` : null,
    `Email: ${email}`,
    `Preferred language: ${resolvedLanguage}`,
    `Product type: ${product}`,
    `Current stage: ${readiness}`,
    quantity ? `Estimated Bulk Order quantity: ${quantity}` : null,
    referenceUrlRaw ? `Reference URL: ${referenceUrlRaw}` : null,
    attachmentNames.length > 0
      ? `Attachments (${attachmentNames.length}): ${attachmentNames.join(", ")}`
      : null,
    referralSource ? `How did you hear about us: ${referralSource}` : null,
    referralCode ? `Referral code: ${referralCode}` : null,
    attributionLine ? `Attribution: ${attributionLine}` : null,
    ...(brief ? ["", "Project notes:", brief] : []),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const safeReferenceUrl = referenceUrlRaw ? escapeHtml(referenceUrlRaw) : "";
  const internalHtml = `<!doctype html>
<html lang="en">
  <body style="font-family:Arial,sans-serif;color:#182D20;line-height:1.6;">
    <h2 style="margin:0 0 12px;color:#182D20;">New Product Brief</h2>
    <p style="margin:0 0 6px;"><strong>Name:</strong> ${escapeHtml(name)}</p>
    ${company ? `<p style="margin:0 0 6px;"><strong>Company:</strong> ${escapeHtml(company)}</p>` : ""}
    ${profile ? `<p style="margin:0 0 6px;"><strong>Profile:</strong> ${escapeHtml(profile)}</p>` : ""}
    <p style="margin:0 0 6px;"><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p style="margin:0 0 6px;"><strong>Preferred language:</strong> ${escapeHtml(resolvedLanguage)}</p>
    <p style="margin:0 0 6px;"><strong>Product type:</strong> ${escapeHtml(product)}</p>
    <p style="margin:0 0 6px;"><strong>Current stage:</strong> ${escapeHtml(readiness)}</p>
    ${quantity ? `<p style="margin:0 0 6px;"><strong>Estimated Bulk Order quantity:</strong> ${escapeHtml(quantity)}</p>` : ""}
    ${safeReferenceUrl ? `<p style="margin:0 0 6px;"><strong>Reference URL:</strong> <a href="${safeReferenceUrl}" target="_blank" rel="noopener noreferrer">${safeReferenceUrl}</a></p>` : ""}
    ${attachmentNames.length > 0 ? `<p style="margin:0 0 6px;"><strong>Attachments:</strong> ${attachmentNames.map((item) => escapeHtml(item)).join(", ")}</p>` : ""}
    ${referralSource ? `<p style="margin:0 0 6px;"><strong>How did you hear about us:</strong> ${escapeHtml(referralSource)}</p>` : ""}
    ${referralCode ? `<p style="margin:0 0 6px;"><strong>Referral code:</strong> ${escapeHtml(referralCode)}</p>` : ""}
    ${attributionLine ? `<p style="margin:0 0 12px;color:#584B44;"><strong>Attribution:</strong> ${escapeHtml(attributionLine)}</p>` : ""}
    ${
      brief
        ? `<div style="margin-top:12px;padding:14px;background:#F2ECDF;border-left:3px solid #833E28;">
      ${escapeHtml(brief).replaceAll("\n", "<br />")}
    </div>`
        : ""
    }
  </body>
</html>`;

  const internalResult = await sendResendEmail({
    to: recipient,
    replyTo: email,
    subject: `Product Brief: ${internalSubjectTarget} (${product})`,
    text: internalText,
    html: internalHtml,
    attachments: resendAttachments.length > 0 ? resendAttachments : undefined,
  });

  if (!internalResult.ok) {
    return NextResponse.json(
      {
        ok: false,
        error: localizeDeliveryError(
          internalResult.status,
          internalResult.error,
          isEs,
        ),
      },
      { status: internalResult.status },
    );
  }

  const fields: ProductBriefConfirmationFields = {
    name,
    company,
    profile,
    email,
    language: resolvedLanguage,
    siteLanguage,
    product,
    readiness,
    quantity,
    referenceUrl: referenceUrlRaw,
    brief,
    attribution,
  };

  const confirmation = buildProductBriefConfirmationEmail({
    confirmationLanguage,
    fields,
    attachmentNames,
    recipientEmail: recipient,
  });

  const confirmationResult = await sendResendEmail({
    to: email,
    replyTo: recipient,
    subject: confirmation.subject,
    text: confirmation.text,
    html: confirmation.html,
  });

  if (process.env.BREVO_API_KEY?.trim() && attributionConsent === true) {
    await trackBrevoEvent({
      email,
      eventName: EMAIL_ANALYTICS_EVENTS.productBriefSubmitted,
      contactProperties: {
        FIRSTNAME: name,
        ...(company ? { COMPANY: company } : {}),
        ...(referralCode ? { REFERRAL_CODE: referralCode } : {}),
        ...(referralSource ? { REFERRAL_SOURCE: referralSource } : {}),
      },
      eventProperties: {
        language: confirmationLanguage,
        product_category: product,
        readiness_stage: readiness,
        has_attachments: attachmentNames.length > 0,
        ...attributionToEventProperties(attribution),
      },
    });
  }

  if (!confirmationResult.ok) {
    console.error(
      "Product brief confirmation email failed:",
      confirmationResult.error,
    );
    return NextResponse.json({ ok: true, confirmationSent: false });
  }

  return NextResponse.json({ ok: true, confirmationSent: true });
}
