"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { TurnstileField } from "@/components/turnstile-field";
import { useLanguage } from "@/context/language-context";
import { isValidEmail } from "@/lib/validation";

const contactEmail = "inquiry@karmarisedglobal.com";
const IS_TURNSTILE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
);
const MAX_UPLOAD_FILES = 3;
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_TOTAL_UPLOAD_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_BY_EXT = new Map<string, string>([
  ["jpg", "image/jpeg"],
  ["jpeg", "image/jpeg"],
  ["png", "image/png"],
  ["webp", "image/webp"],
  ["pdf", "application/pdf"],
]);

function isClientSafeHttpUrl(rawValue: string): boolean {
  if (/[\u0000-\u001F\u007F]/.test(rawValue)) {
    return false;
  }

  const trimmed = rawValue.trim();
  if (!trimmed || trimmed.length > 2000) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    return (
      (parsed.protocol === "http:" || parsed.protocol === "https:") &&
      Boolean(parsed.hostname) &&
      !parsed.username &&
      !parsed.password
    );
  } catch {
    return false;
  }
}

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function getFileExtension(filename: string): string {
  const lastDot = filename.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === filename.length - 1) {
    return "";
  }
  return filename.slice(lastDot + 1).toLowerCase();
}

export function ProductBriefForm() {
  const { language: siteLanguage, localizeHref } = useLanguage();
  const isEs = siteLanguage === "es";

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);

  function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";

    if (incoming.length === 0) {
      return;
    }

    if (selectedFiles.length + incoming.length > MAX_UPLOAD_FILES) {
      setFileError(
        isEs
          ? "Puedes adjuntar un máximo de 3 archivos en total."
          : "You can attach up to 3 files in total.",
      );
      return;
    }

    let combinedBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    const accepted: File[] = [];

    for (const file of incoming) {
      if (file.size <= 0) {
        setFileError(
          isEs
            ? `El archivo "${file.name}" está vacío.`
            : `The file "${file.name}" is empty.`,
        );
        return;
      }

      const ext = getFileExtension(file.name);
      const expectedMime = ALLOWED_MIME_BY_EXT.get(ext);
      const declaredMime = file.type.trim().toLowerCase();

      if (!expectedMime || declaredMime !== expectedMime) {
        setFileError(
          isEs
            ? `Formato no admitido en "${file.name}". Usa JPG, PNG, WebP o PDF.`
            : `Unsupported format for "${file.name}". Use JPG, PNG, WebP, or PDF.`,
        );
        return;
      }

      if (file.size > MAX_FILE_BYTES) {
        setFileError(
          isEs
            ? `"${file.name}" supera el límite de 4 MB por archivo.`
            : `"${file.name}" exceeds the 4 MB per-file limit.`,
        );
        return;
      }

      combinedBytes += file.size;
      if (combinedBytes > MAX_TOTAL_UPLOAD_BYTES) {
        setFileError(
          isEs
            ? "El peso total de los archivos adjuntos no puede superar los 10 MB."
            : "Total attached file size cannot exceed 10 MB.",
        );
        return;
      }

      accepted.push(file);
    }

    setFileError("");
    setSelectedFiles((previous) => [...previous, ...accepted]);
  }

  function handleRemoveFile(indexToRemove: number) {
    setFileError("");
    setSelectedFiles((previous) =>
      previous.filter((_, index) => index !== indexToRemove),
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;

    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const company = String(data.get("company") ?? "").trim();
    const profile = String(data.get("profile") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const language = String(data.get("language") ?? "").trim();
    const product = String(data.get("product") ?? "").trim();
    const readiness = String(data.get("readiness") ?? "").trim();
    const quantity = String(data.get("quantity") ?? "").trim();
    const referenceUrl = String(data.get("referenceUrl") ?? "").trim();
    const brief = String(data.get("brief") ?? "").trim();
    const companyWebsite = String(data.get("companyWebsite") ?? "").trim();

    if (
      !form.checkValidity() ||
      !name ||
      !company ||
      !profile ||
      !isValidEmail(email) ||
      !language ||
      !product ||
      !readiness ||
      !brief
    ) {
      setIsError(true);
      setMailtoHref(null);
      setMessage(
        isEs
          ? "Completa los campos obligatorios con un correo válido antes de continuar."
          : "Complete the required fields with a valid email before continuing.",
      );
      form.reportValidity();
      return;
    }

    if (referenceUrl && !isClientSafeHttpUrl(referenceUrl)) {
      setIsError(true);
      setMailtoHref(null);
      setMessage(
        isEs
          ? "Introduce un enlace válido que empiece por http:// o https://."
          : "Enter a valid reference link starting with http:// or https://.",
      );
      return;
    }

    const totalFileBytes = selectedFiles.reduce(
      (sum, file) => sum + file.size,
      0,
    );
    if (
      selectedFiles.length > MAX_UPLOAD_FILES ||
      selectedFiles.some((file) => file.size > MAX_FILE_BYTES) ||
      totalFileBytes > MAX_TOTAL_UPLOAD_BYTES
    ) {
      setIsError(true);
      setMailtoHref(null);
      setMessage(
        isEs
          ? "Revisa los archivos adjuntos: máximo 3 archivos, 4 MB cada uno y 10 MB en total."
          : "Check your attached files: up to 3 files, 4 MB each, and 10 MB total.",
      );
      return;
    }

    if (IS_TURNSTILE_ENABLED && !turnstileToken) {
      setIsError(true);
      setMailtoHref(null);
      setMessage(
        isEs
          ? "Completa la verificación de seguridad antes de enviar tu Product Brief."
          : "Please complete the security check before submitting your Product Brief.",
      );
      return;
    }

    const subject = encodeURIComponent(
      `Product Brief: ${company} (${product})`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${name}`,
        `Company: ${company}`,
        `Profile: ${profile}`,
        `Work email: ${email}`,
        `Preferred language: ${language}`,
        `Product type: ${product}`,
        `Current stage: ${readiness}`,
        quantity ? `Estimated Bulk Order quantity: ${quantity}` : null,
        referenceUrl ? `Reference link: ${referenceUrl}` : null,
        selectedFiles.length > 0
          ? `Selected files (attach manually): ${selectedFiles.map((file) => file.name).join(", ")}`
          : null,
        "",
        "Project notes:",
        brief,
      ]
        .filter((line): line is string => line !== null)
        .join("\n"),
    );
    const fallbackHref = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    setIsSubmitting(true);
    setIsError(false);
    setMailtoHref(null);
    setMessage("");

    let didAttemptRequest = false;
    try {
      didAttemptRequest = true;
      let response: Response;

      if (selectedFiles.length > 0) {
        const payloadFormData = new FormData();
        payloadFormData.append("name", name);
        payloadFormData.append("company", company);
        payloadFormData.append("profile", profile);
        payloadFormData.append("email", email);
        payloadFormData.append("language", language);
        payloadFormData.append("siteLanguage", siteLanguage);
        payloadFormData.append("product", product);
        payloadFormData.append("readiness", readiness);
        payloadFormData.append("quantity", quantity);
        payloadFormData.append("referenceUrl", referenceUrl);
        payloadFormData.append("brief", brief);
        payloadFormData.append("companyWebsite", companyWebsite);
        payloadFormData.append("turnstileToken", turnstileToken);
        for (const file of selectedFiles) {
          payloadFormData.append("attachments", file);
        }

        response = await fetch("/api/product-brief", {
          method: "POST",
          body: payloadFormData,
        });
      } else {
        response = await fetch("/api/product-brief", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            company,
            profile,
            email,
            language,
            siteLanguage,
            product,
            readiness,
            quantity,
            referenceUrl,
            brief,
            companyWebsite,
            turnstileToken,
          }),
        });
      }

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        confirmationSent?: boolean;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setIsError(true);
        if (response.status >= 500) {
          setMailtoHref(fallbackHref);
          setMessage(
            result.error ??
              (isEs
                ? "No se ha podido enviar directamente. Puedes enviarnos tu Product Brief desde tu aplicación de correo."
                : "Direct delivery failed. You can still send your Product Brief via your email app."),
          );
        } else {
          setMailtoHref(null);
          setMessage(
            result.error ??
              (isEs
                ? "Revisa los campos o archivos adjuntos e inténtalo de nuevo."
                : "Please review your details or attached files and try again."),
          );
        }
        return;
      }

      form.reset();
      setSelectedFiles([]);
      setFileError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setIsError(false);
      setMailtoHref(null);
      setMessage(
        result.confirmationSent === false
          ? isEs
            ? "Hemos recibido tu Product Brief en KarmaRise D Global. Te responderemos muy pronto a tu correo profesional."
            : "Your Product Brief has been sent to KarmaRise D Global. We will reply to your work email shortly."
          : isEs
            ? "Hemos recibido tu Product Brief en KarmaRise D Global. Te hemos enviado un correo de confirmación y te responderemos muy pronto."
            : "Your Product Brief has been sent to KarmaRise D Global. We have sent a confirmation email and will reply shortly.",
      );
    } catch {
      setIsError(true);
      setMailtoHref(fallbackHref);
      setMessage(
        isEs
          ? "No hemos podido conectar con el servidor ahora mismo. Puedes enviarnos tu Product Brief desde tu aplicación de correo."
          : "Unable to reach the server right now. You can still send your Product Brief via your email app.",
      );
    } finally {
      setIsSubmitting(false);
      if (didAttemptRequest && IS_TURNSTILE_ENABLED) {
        setTurnstileToken("");
        setTurnstileResetSignal((value) => value + 1);
      }
    }
  }

  return (
    <form
      className="brief-form min-w-0"
      data-endpoint="/api/product-brief"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="hidden" aria-hidden="true">
        <label htmlFor="brief-company-website">Company website</label>
        <input
          id="brief-company-website"
          name="companyWebsite"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>
      <div className="field-row">
        <div className="field min-w-0">
          <label htmlFor="brief-name">{isEs ? "Tu nombre" : "Your name"}</label>
          <input
            id="brief-name"
            name="name"
            autoComplete="name"
            required
            disabled={isSubmitting}
          />
        </div>
        <div className="field min-w-0">
          <label htmlFor="brief-company">
            {isEs ? "Empresa o marca" : "Company or brand"}
          </label>
          <input
            id="brief-company"
            name="company"
            autoComplete="organization"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field min-w-0">
          <label htmlFor="brief-profile">
            {isEs ? "Perfil de empresa" : "Company profile"}
          </label>
          <select
            id="brief-profile"
            name="profile"
            defaultValue=""
            required
            disabled={isSubmitting}
            className="min-w-0"
          >
            <option value="" disabled>
              {isEs ? "Selecciona una opción" : "Select one"}
            </option>
            <option value="Retail chain">
              {isEs ? "Cadena comercial" : "Retail chain"}
            </option>
            <option value="Independent retailer">
              {isEs ? "Comercio independiente" : "Independent retailer"}
            </option>
            <option value="Fashion brand">
              {isEs ? "Marca de moda" : "Fashion brand"}
            </option>
            <option value="Other business">
              {isEs ? "Otra empresa de producto" : "Other business"}
            </option>
          </select>
        </div>
        <div className="field min-w-0">
          <label htmlFor="brief-email">
            {isEs ? "Correo profesional" : "Work email"}
          </label>
          <input
            id="brief-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="field-row">
        <div className="field min-w-0">
          <label htmlFor="brief-language">
            {isEs ? "Idioma preferido" : "Preferred language"}
          </label>
          <select
            key={siteLanguage}
            id="brief-language"
            name="language"
            defaultValue={isEs ? "Spanish" : "English"}
            required
            disabled={isSubmitting}
            className="min-w-0"
          >
            <option value="Spanish">{isEs ? "Español" : "Spanish"}</option>
            <option value="English">{isEs ? "Inglés" : "English"}</option>
          </select>
        </div>
        <div className="field min-w-0">
          <label htmlFor="brief-product">
            {isEs ? "Tipo de producto" : "Product type"}
          </label>
          <select
            id="brief-product"
            name="product"
            defaultValue=""
            required
            disabled={isSubmitting}
            className="min-w-0"
          >
            <option value="" disabled>
              {isEs ? "Selecciona una opción" : "Select one"}
            </option>
            <option value="Bags and accessories">
              {isEs ? "Bolsos y accesorios" : "Bags and accessories"}
            </option>
            <option value="Garments and clothing">
              {isEs ? "Prendas y confección" : "Garments and clothing"}
            </option>
            <option value="Another product">
              {isEs ? "Otro producto" : "Another product"}
            </option>
          </select>
        </div>
      </div>

      <div className="field-row">
        <div className="field min-w-0">
          <label htmlFor="brief-readiness">
            {isEs ? "Fase actual del proyecto" : "Current stage"}
          </label>
          <select
            id="brief-readiness"
            name="readiness"
            defaultValue=""
            required
            disabled={isSubmitting}
            className="min-w-0"
          >
            <option value="" disabled>
              {isEs ? "Selecciona una opción" : "Select one"}
            </option>
            <option value="Concept or reference items only">
              {isEs
                ? "Idea inicial o piezas de referencia"
                : "Concept or reference items only"}
            </option>
            <option value="Sketches or early tech pack">
              {isEs
                ? "Bocetos o ficha técnica preliminar"
                : "Sketches or early tech pack"}
            </option>
            <option value="Physical sample ready">
              {isEs ? "Muestra física lista" : "Physical sample ready"}
            </option>
            <option value="Existing product moving to India">
              {isEs
                ? "Producto existente que pasa a fabricarse en la India"
                : "Existing product moving to India"}
            </option>
          </select>
        </div>
        <div className="field min-w-0">
          <label htmlFor="brief-quantity">
            {isEs
              ? "Cantidad estimada del pedido (opcional)"
              : "Estimated Bulk Order quantity (optional)"}
          </label>
          <input
            id="brief-quantity"
            name="quantity"
            disabled={isSubmitting}
            placeholder={
              isEs
                ? "Por ejemplo, 300 unidades por modelo"
                : "For example, 300 units per style"
            }
          />
        </div>
      </div>

      <div className="field min-w-0">
        <label htmlFor="brief-reference-url">
          {isEs
            ? "Enlace de referencia (opcional)"
            : "Reference link (optional)"}
        </label>
        <input
          id="brief-reference-url"
          name="referenceUrl"
          type="url"
          inputMode="url"
          autoComplete="url"
          maxLength={2000}
          disabled={isSubmitting}
          placeholder={
            isEs
              ? "https://ejemplo.com/referencia"
              : "https://example.com/reference"
          }
        />
        <p className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/75">
          {isEs
            ? "Enlace http:// o https:// a una pieza existente, carpeta de referencias o ficha."
            : "An http:// or https:// link to an existing product, moodboard, or shared folder."}
        </p>
      </div>

      <div className="grid gap-2">
        <span className="text-[length:var(--text-sm)] text-[var(--color-paper-2)]">
          {isEs
            ? "Bocetos o fotos de muestra (opcional)"
            : "Sketches or sample photos (optional)"}
        </span>
        <input
          ref={fileInputRef}
          id="brief-files"
          name="attachments"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
          className="peer sr-only"
          disabled={isSubmitting || selectedFiles.length >= MAX_UPLOAD_FILES}
          onChange={handleFilesChange}
        />
        <label
          htmlFor="brief-files"
          className={`flex min-h-[44px] flex-wrap items-center justify-between gap-3 rounded-[0.75rem] border border-[var(--color-paper)]/25 bg-[var(--color-paper)]/10 px-4 py-3 text-[length:var(--text-sm)] text-[var(--color-paper)] transition-colors peer-focus-visible:border-[var(--color-gold)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-gold)]/40 ${
            isSubmitting || selectedFiles.length >= MAX_UPLOAD_FILES
              ? "cursor-not-allowed opacity-55"
              : "cursor-pointer hover:border-[var(--color-paper-2)]"
          }`}
        >
          <span className="font-medium">
            {isEs
              ? selectedFiles.length >= MAX_UPLOAD_FILES
                ? "Límite de 3 archivos alcanzado"
                : "Añadir bocetos, fotos o PDF"
              : selectedFiles.length >= MAX_UPLOAD_FILES
                ? "Maximum 3 files attached"
                : "Add sketches, photos, or PDF"}
          </span>
          <span className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
            {selectedFiles.length}/{MAX_UPLOAD_FILES}
          </span>
        </label>
        <p className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/75">
          {isEs
            ? "Hasta 3 archivos (JPG, PNG, WebP o PDF), máx. 4 MB cada uno y 10 MB en total."
            : "Up to 3 files (JPG, PNG, WebP, or PDF), max 4 MB each and 10 MB total."}
        </p>

        {fileError ? (
          <p
            role="alert"
            className="text-[length:var(--text-xs)] text-[var(--color-gold)]"
          >
            {fileError}
          </p>
        ) : null}

        {selectedFiles.length > 0 ? (
          <ul className="m-0 grid list-none gap-2 p-0 pt-1">
            {selectedFiles.map((file, index) => (
              <li
                key={`${file.name}-${file.size}-${index}`}
                className="flex items-center justify-between gap-3 rounded-[0.6rem] border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/8 py-1 pr-1 pl-3 text-[length:var(--text-xs)] text-[var(--color-paper)]"
              >
                <span className="min-w-0 truncate">
                  {file.name}{" "}
                  <span className="text-[var(--color-paper-2)]/75">
                    ({formatFileSize(file.size)})
                  </span>
                </span>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRemoveFile(index)}
                  aria-label={
                    isEs ? `Quitar ${file.name}` : `Remove ${file.name}`
                  }
                  className="inline-flex min-h-[44px] shrink-0 cursor-pointer items-center px-3 font-semibold text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)] disabled:cursor-not-allowed disabled:opacity-55"
                >
                  {isEs ? "Quitar" : "Remove"}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="field min-w-0">
        <label htmlFor="brief-notes">
          {isEs ? "¿Qué quieres fabricar?" : "What do you want to make?"}
        </label>
        <textarea
          id="brief-notes"
          name="brief"
          rows={5}
          disabled={isSubmitting}
          placeholder={
            isEs
              ? "Describe materiales, detalles constructivos, mercado de destino, fechas previstas o enlaces de referencia."
              : "Describe materials, construction details, destination market, target timeline, or reference links."
          }
          required
        />
      </div>

      <TurnstileField
        onTokenChange={setTurnstileToken}
        language={siteLanguage}
        resetSignal={turnstileResetSignal}
        theme="dark"
      />

      <div className="form-footer">
        <button
          className="primary-button"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? isEs
              ? "Enviando..."
              : "Sending..."
            : isEs
              ? "Enviar Product Brief"
              : "Send Product Brief"}
        </button>
        <div
          className={
            isError
              ? "form-message min-w-0 text-[var(--color-gold)]"
              : "form-message min-w-0"
          }
          aria-live="polite"
        >
          {message ? <p>{message}</p> : null}
          {message && !isError ? (
            <p className="mt-2">
              <Link
                className="inline-flex min-h-[44px] items-center font-semibold text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)]"
                href={localizeHref("/book-a-call")}
              >
                {isEs
                  ? "Si prefieres comentarlo en directo, reserva una videollamada con Alma."
                  : "Want to talk it through live? Book a video call with Alma."}
              </Link>
            </p>
          ) : null}
          {mailtoHref ? (
            <p className="mt-2">
              <a
                className="inline-flex min-h-[44px] items-center font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)]"
                href={mailtoHref}
              >
                {isEs
                  ? `Abrir correo preparado para ${contactEmail}`
                  : `Open prepared email to ${contactEmail}`}
              </a>
            </p>
          ) : null}
        </div>
      </div>

      <p className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
        {isEs ? (
          <>
            Los diseños de tu Product Brief siguen siendo de tu exclusiva
            propiedad intelectual según nuestras{" "}
            <Link
              className="underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
              href={localizeHref("/terms#confidentiality")}
            >
              Condiciones de uso
            </Link>{" "}
            y se tratan conforme a nuestra{" "}
            <Link
              className="underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
              href={localizeHref("/privacy-policy")}
            >
              Política de privacidad
            </Link>
            .
          </>
        ) : (
          <>
            Your Product Brief designs remain your sole intellectual property
            under our{" "}
            <Link
              className="underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
              href={localizeHref("/terms#confidentiality")}
            >
              Website terms
            </Link>{" "}
            and are processed in accordance with our{" "}
            <Link
              className="underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
              href={localizeHref("/privacy-policy")}
            >
              Privacy policy
            </Link>
            .
          </>
        )}
      </p>
    </form>
  );
}
