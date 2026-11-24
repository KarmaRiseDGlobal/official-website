import { NextResponse } from "next/server";

import {
  localizeOptionForConfirmation,
  MAX_FILE_BYTES,
  MAX_TOTAL_UPLOAD_BYTES,
  MAX_UPLOAD_FILES,
} from "@/data/product-brief-options";
import { sendResendEmail, type ResendAttachment } from "@/lib/resend";
import {
  escapeHtml,
  guardFormRequest,
  isSafeHttpUrl,
  readJsonObject,
  validateUploadedFile,
} from "@/lib/security";
import type { SiteLanguage } from "@/lib/urls";
import { isValidEmail, readTrimmedString } from "@/lib/validation";

const MAX_JSON_BYTES = 64 * 1024;
const MAX_MULTIPART_BYTES = 11 * 1024 * 1024;

interface ParsedBriefFields {
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
}

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
        error: "Uploaded payload exceeds the 11 MB limit.",
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
            error: "Uploaded payload exceeds the 11 MB limit.",
          };
        }
        chunks.push(value);
      }
    } catch {
      return {
        ok: false,
        status: 400,
        error: "Unable to read uploaded form payload.",
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
          error: "Uploaded payload exceeds the 11 MB limit.",
        };
      }
      bodyBytes = new Uint8Array(arrayBuffer);
    } catch {
      return {
        ok: false,
        status: 400,
        error: "Unable to read uploaded form payload.",
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
      error: "Invalid multipart form payload.",
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

function buildConfirmationEmail({
  confirmationLanguage,
  fields,
  attachmentNames,
  recipientEmail,
}: {
  confirmationLanguage: SiteLanguage;
  fields: ParsedBriefFields;
  attachmentNames: string[];
  recipientEmail: string;
}): { subject: string; text: string; html: string } {
  const safeName = escapeHtml(fields.name);
  const safeCompany = fields.company ? escapeHtml(fields.company) : "";
  const subjectLabel = fields.company || fields.name;
  const localizedProduct = localizeOptionForConfirmation(
    fields.product,
    confirmationLanguage,
  );
  const localizedReadiness = localizeOptionForConfirmation(
    fields.readiness,
    confirmationLanguage,
  );
  const safeProduct = escapeHtml(localizedProduct);
  const safeReadiness = escapeHtml(localizedReadiness);
  const safeQuantity = fields.quantity ? escapeHtml(fields.quantity) : "";
  const safeReferenceUrl = fields.referenceUrl
    ? escapeHtml(fields.referenceUrl)
    : "";
  const safeRecipient = escapeHtml(recipientEmail);
  const safeBriefHtml = fields.brief
    ? escapeHtml(fields.brief).replaceAll("\n", "<br />")
    : "";
  const safeAttachmentNames = attachmentNames.map((item) => escapeHtml(item));

  if (confirmationLanguage === "es") {
    const subject = `Hemos recibido tu Product Brief (${subjectLabel}) · KarmaRise D Global`;
    const text = [
      `Hola ${fields.name},`,
      "",
      fields.company
        ? `Gracias por enviarnos tu Product Brief para ${fields.company}. Lo hemos recibido en ${recipientEmail}.`
        : `Gracias por enviarnos tu Product Brief. Lo hemos recibido en ${recipientEmail}.`,
      "",
      "Alma revisará tus detalles en primer lugar y, junto con Shirish, preparará los siguientes pasos antes de responderte directamente a este correo.",
      "",
      fields.company ? `Empresa: ${fields.company}` : null,
      `Tipo de producto: ${localizedProduct}`,
      `Fase actual: ${localizedReadiness}`,
      fields.quantity ? `Cantidad estimada: ${fields.quantity}` : null,
      fields.referenceUrl
        ? `Enlace de referencia: ${fields.referenceUrl}`
        : null,
      attachmentNames.length > 0
        ? `Archivos adjuntos (${attachmentNames.length}): ${attachmentNames.join(", ")}`
        : null,
      ...(fields.brief
        ? ["", "Resumen de tu Product Brief:", fields.brief]
        : []),
      "",
      "Si quieres añadir alguna aclaración o enviar referencias adicionales, puedes responder directamente a este correo.",
      "",
      "Un saludo cercano,",
      "Alma y Shirish",
      "KarmaRise D Global · España e India",
    ]
      .filter((line): line is string => line !== null)
      .join("\n");

    const html = `<!doctype html>
<html lang="es">
  <body style="margin:0;padding:24px;background-color:#F2ECDF;color:#182D20;font-family:Georgia, 'Times New Roman', serif;">
    <div style="max-width:620px;margin:0 auto;background-color:#FFFFFF;border:1px solid #CDBB9C;border-radius:12px;padding:32px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#833E28;font-family:Arial,sans-serif;font-weight:700;">
        KarmaRise D Global · España e India
      </p>
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#182D20;font-weight:500;">
        Hemos recibido tu Product Brief, ${safeName}.
      </h1>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#182D20;">
        ${
          safeCompany
            ? `Gracias por compartir los detalles para <strong>${safeCompany}</strong>.`
            : "Gracias por compartir los detalles de tu proyecto."
        } Tu Product Brief ha quedado registrado en <a href="mailto:${safeRecipient}" style="color:#833E28;">${safeRecipient}</a>.
      </p>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#182D20;">
        Alma revisará tus referencias y te escribirá directamente a este correo. Si quieres añadir algo más mientras lo evaluamos, puedes responder a este mismo mensaje.
      </p>
      <div style="background-color:#F2ECDF;border-left:3px solid #833E28;padding:16px 18px;border-radius:6px;margin:0 0 22px;">
        <p style="margin:0 0 10px;font-size:13px;font-family:Arial,sans-serif;color:#833E28;font-weight:700;">
          Resumen del Product Brief
        </p>
        ${safeCompany ? `<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Empresa:</strong> ${safeCompany}</p>` : ""}
        <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Producto:</strong> ${safeProduct}</p>
        <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Fase actual:</strong> ${safeReadiness}</p>
        ${safeQuantity ? `<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Cantidad estimada:</strong> ${safeQuantity}</p>` : ""}
        ${safeReferenceUrl ? `<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Enlace de referencia:</strong> <a href="${safeReferenceUrl}" target="_blank" rel="noopener noreferrer" style="color:#833E28;">${safeReferenceUrl}</a></p>` : ""}
        ${safeAttachmentNames.length > 0 ? `<p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Archivos adjuntos:</strong> ${safeAttachmentNames.join(", ")}</p>` : ""}
        ${safeBriefHtml ? `<p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#182D20;">${safeBriefHtml}</p>` : ""}
      </div>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#182D20;">
        Un saludo cercano,<br />
        <strong>Alma y Shirish</strong><br />
        <span style="color:#833E28;font-size:13px;">KarmaRise D Global · España e India</span>
      </p>
    </div>
  </body>
</html>`;

    return { subject, text, html };
  }

  const subject = `We received your Product Brief (${subjectLabel}) · KarmaRise D Global`;
  const text = [
    `Hello ${fields.name},`,
    "",
    fields.company
      ? `Thank you for sending your Product Brief for ${fields.company}. We have received it at ${recipientEmail}.`
      : `Thank you for sending your Product Brief. We have received it at ${recipientEmail}.`,
    "",
    "Alma will review your brief first and reply directly to your email address. If you want to add any clarification or extra references in the meantime, simply reply to this message.",
    "",
    fields.company ? `Company: ${fields.company}` : null,
    `Product type: ${localizedProduct}`,
    `Current stage: ${localizedReadiness}`,
    fields.quantity
      ? `Estimated Bulk Order quantity: ${fields.quantity}`
      : null,
    fields.referenceUrl ? `Reference link: ${fields.referenceUrl}` : null,
    attachmentNames.length > 0
      ? `Attached files (${attachmentNames.length}): ${attachmentNames.join(", ")}`
      : null,
    ...(fields.brief ? ["", "Product Brief notes:", fields.brief] : []),
    "",
    "Warm regards,",
    "Alma and Shirish",
    "KarmaRise D Global · India & Spain",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");

  const html = `<!doctype html>
<html lang="en">
  <body style="margin:0;padding:24px;background-color:#F2ECDF;color:#182D20;font-family:Georgia, 'Times New Roman', serif;">
    <div style="max-width:620px;margin:0 auto;background-color:#FFFFFF;border:1px solid #CDBB9C;border-radius:12px;padding:32px;">
      <p style="margin:0 0 12px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#833E28;font-family:Arial,sans-serif;font-weight:700;">
        KarmaRise D Global · India &amp; Spain
      </p>
      <h1 style="margin:0 0 16px;font-size:24px;line-height:1.25;color:#182D20;font-weight:500;">
        We received your Product Brief, ${safeName}.
      </h1>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:#182D20;">
        ${
          safeCompany
            ? `Thank you for sharing the details for <strong>${safeCompany}</strong>.`
            : "Thank you for sharing your project details."
        } Your Product Brief has been received at <a href="mailto:${safeRecipient}" style="color:#833E28;">${safeRecipient}</a>.
      </p>
      <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:#182D20;">
        Alma will review your references and reply directly to your email address. If you would like to add anything while we evaluate it, feel free to reply to this message.
      </p>
      <div style="background-color:#F2ECDF;border-left:3px solid #833E28;padding:16px 18px;border-radius:6px;margin:0 0 22px;">
        <p style="margin:0 0 10px;font-size:13px;font-family:Arial,sans-serif;color:#833E28;font-weight:700;">
          Product Brief summary
        </p>
        ${safeCompany ? `<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Company:</strong> ${safeCompany}</p>` : ""}
        <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Product type:</strong> ${safeProduct}</p>
        <p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Current stage:</strong> ${safeReadiness}</p>
        ${safeQuantity ? `<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Estimated Bulk Order quantity:</strong> ${safeQuantity}</p>` : ""}
        ${safeReferenceUrl ? `<p style="margin:0 0 6px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Reference link:</strong> <a href="${safeReferenceUrl}" target="_blank" rel="noopener noreferrer" style="color:#833E28;">${safeReferenceUrl}</a></p>` : ""}
        ${safeAttachmentNames.length > 0 ? `<p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:#182D20;"><strong>Attached files:</strong> ${safeAttachmentNames.join(", ")}</p>` : ""}
        ${safeBriefHtml ? `<p style="margin:8px 0 0;font-size:14px;line-height:1.6;color:#182D20;">${safeBriefHtml}</p>` : ""}
      </div>
      <p style="margin:0;font-size:15px;line-height:1.6;color:#182D20;">
        Warm regards,<br />
        <strong>Alma and Shirish</strong><br />
        <span style="color:#833E28;font-size:13px;">KarmaRise D Global · India &amp; Spain</span>
      </p>
    </div>
  </body>
</html>`;

  return { subject, text, html };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  const isMultipart = contentType.includes("multipart/form-data");

  let rawCompanyWebsite: unknown = "";
  let rawTurnstileToken: unknown = "";
  let rawFields: Record<string, unknown> = {};
  let uploadedFiles: File[] = [];

  if (isMultipart) {
    const multipartResult = await readBoundedMultipartFormData(
      request,
      MAX_MULTIPART_BYTES,
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
    };
    uploadedFiles = extractUploadedFiles(formData);
  } else {
    const jsonResult = await readJsonObject(request, MAX_JSON_BYTES);
    if (!jsonResult.ok) {
      return NextResponse.json(
        { ok: false, error: jsonResult.error },
        { status: jsonResult.status },
      );
    }

    rawFields = jsonResult.data;
    rawCompanyWebsite = rawFields.companyWebsite;
    rawTurnstileToken = rawFields.turnstileToken;
  }

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
      { ok: false, error: guard.error },
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
  const language = readTrimmedString(rawFields.language, 80, {
    singleLine: true,
  });
  const siteLanguage = readTrimmedString(rawFields.siteLanguage, 16, {
    singleLine: true,
  });
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

  const confirmationLanguage = resolveConfirmationLanguage(
    language,
    siteLanguage,
  );
  const resolvedLanguage =
    language || (confirmationLanguage === "es" ? "Spanish" : "English");

  if (!name || !isValidEmail(email) || !product || !readiness) {
    return NextResponse.json(
      {
        ok: false,
        error:
          confirmationLanguage === "es"
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
          error:
            confirmationLanguage === "es"
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
        error:
          confirmationLanguage === "es"
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
          error:
            confirmationLanguage === "es"
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
          error:
            confirmationLanguage === "es"
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
        { ok: false, error: validated.error },
        { status },
      );
    }

    totalValidatedBytes += validated.size;
    if (totalValidatedBytes > MAX_TOTAL_UPLOAD_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error:
            confirmationLanguage === "es"
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
    ${attachmentNames.length > 0 ? `<p style="margin:0 0 12px;"><strong>Attachments:</strong> ${attachmentNames.map((item) => escapeHtml(item)).join(", ")}</p>` : ""}
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
      { ok: false, error: internalResult.error },
      { status: internalResult.status },
    );
  }

  const fields: ParsedBriefFields = {
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
  };

  const confirmation = buildConfirmationEmail({
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

  if (!confirmationResult.ok) {
    console.error(
      "Product brief confirmation email failed:",
      confirmationResult.error,
    );
    return NextResponse.json({ ok: true, confirmationSent: false });
  }

  return NextResponse.json({ ok: true, confirmationSent: true });
}
