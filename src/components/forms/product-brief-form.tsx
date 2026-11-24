"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import { ProductBriefConfirmation } from "@/components/forms/product-brief-confirmation";
import { TurnstileField } from "@/components/forms/turnstile-field";
import { useLanguage } from "@/context/language-context";
import {
  ALLOWED_MIME_BY_EXT,
  formatFileSize,
  getFileExtension,
  isClientSafeHttpUrl,
  MAX_FILE_BYTES,
  MAX_TOTAL_UPLOAD_BYTES,
  MAX_UPLOAD_FILES,
  NOTE_PROMPTS,
  PRODUCT_BRIEF_CONTACT_EMAIL as contactEmail,
  PRODUCT_OPTIONS,
  PROFILE_OPTIONS,
  QUANTITY_PRESETS,
  STAGE_OPTIONS,
  type StepNumber,
} from "@/data/product-brief-options";
import {
  clearProductBriefDraft,
  readClientHandoff,
  readProductBriefDraft,
  resolveProductFromQueryParam,
  saveClientHandoff,
  saveProductBriefDraft,
} from "@/lib/client-handoff";
import { isValidEmail } from "@/lib/validation";

const IS_TURNSTILE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
);

export function ProductBriefForm() {
  const { language: siteLanguage, localizeHref } = useLanguage();
  const isEs = siteLanguage === "es";

  const formTopRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const notesRef = useRef<HTMLTextAreaElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const hydratedRef = useRef(false);

  const [step, setStep] = useState<StepNumber>(1);
  const [product, setProduct] = useState("");
  const [readiness, setReadiness] = useState("");
  const [quantityPreset, setQuantityPreset] = useState("");
  const [quantityCustom, setQuantityCustom] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [brief, setBrief] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [profile, setProfile] = useState("");
  const [replyLanguageOverride, setReplyLanguageOverride] = useState<
    "English" | "Spanish" | ""
  >("");
  const [companyWebsite, setCompanyWebsite] = useState("");

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState("");
  const [isDraggingFiles, setIsDraggingFiles] = useState(false);

  const [draftRestored, setDraftRestored] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    referenceUrl?: string;
  }>({});
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [mailtoHref, setMailtoHref] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedState, setSubmittedState] = useState<{
    confirmationSent: boolean;
    recipientName: string;
  } | null>(null);

  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);

  const replyLanguage: "English" | "Spanish" =
    replyLanguageOverride || (isEs ? "Spanish" : "English");

  // Restore saved draft, shared session handoff, and optional ?product= query param on mount.
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;

      const draft = readProductBriefDraft();
      const handoff = readClientHandoff();
      const queryProduct = resolveProductFromQueryParam(
        new URLSearchParams(window.location.search).get("product"),
      );

      if (draft) {
        setStep(queryProduct && !draft.readiness ? 1 : draft.step);
        setProduct(queryProduct || draft.product);
        setReadiness(draft.readiness);
        setQuantityPreset(draft.quantityPreset);
        setQuantityCustom(draft.quantityCustom);
        setReferenceUrl(draft.referenceUrl);
        setBrief(draft.brief);
        setName(draft.name || handoff.name || "");
        setEmail(draft.email || handoff.email || "");
        setCompany(draft.company || handoff.company || "");
        setProfile(draft.profile);
        if (draft.language) {
          setReplyLanguageOverride(draft.language);
        } else if (handoff.preferredLanguage === "es") {
          setReplyLanguageOverride("Spanish");
        } else if (handoff.preferredLanguage === "en") {
          setReplyLanguageOverride("English");
        }
        setDraftRestored(true);
      } else {
        if (queryProduct) {
          setProduct(queryProduct);
        }
        if (handoff.name) setName(handoff.name);
        if (handoff.email) setEmail(handoff.email);
        if (handoff.company) setCompany(handoff.company);
        if (handoff.preferredLanguage === "es") {
          setReplyLanguageOverride("Spanish");
        } else if (handoff.preferredLanguage === "en") {
          setReplyLanguageOverride("English");
        }
      }

      hydratedRef.current = true;
    });

    return () => {
      active = false;
    };
  }, []);

  // Auto-save draft changes in localStorage once hydrated.
  useEffect(() => {
    if (!hydratedRef.current || submittedState) {
      return;
    }
    saveProductBriefDraft({
      step,
      product,
      readiness,
      quantityPreset,
      quantityCustom,
      referenceUrl,
      brief,
      name,
      email,
      company,
      profile,
      language: replyLanguageOverride,
    });
  }, [
    step,
    product,
    readiness,
    quantityPreset,
    quantityCustom,
    referenceUrl,
    brief,
    name,
    email,
    company,
    profile,
    replyLanguageOverride,
    submittedState,
  ]);

  function scrollFormIntoView() {
    formTopRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }

  function processIncomingFiles(incoming: File[]) {
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

  function handleFilesChange(event: React.ChangeEvent<HTMLInputElement>) {
    const incoming = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    processIncomingFiles(incoming);
  }

  function handleDrop(event: React.DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDraggingFiles(false);
    if (isSubmitting || selectedFiles.length >= MAX_UPLOAD_FILES) {
      return;
    }
    const incoming = Array.from(event.dataTransfer.files ?? []);
    processIncomingFiles(incoming);
  }

  function handleRemoveFile(indexToRemove: number) {
    setFileError("");
    setSelectedFiles((previous) =>
      previous.filter((_, index) => index !== indexToRemove),
    );
  }

  function handleInsertNotePrompt(snippet: string) {
    setBrief((prev) => {
      const trimmed = prev.trimEnd();
      if (!trimmed) return snippet;
      return `${trimmed}\n${snippet}`;
    });
    requestAnimationFrame(() => {
      if (notesRef.current) {
        notesRef.current.focus();
        const len = notesRef.current.value.length;
        notesRef.current.setSelectionRange(len, len);
      }
    });
  }

  function handleResetDraft() {
    clearProductBriefDraft();
    setStep(1);
    setProduct("");
    setReadiness("");
    setQuantityPreset("");
    setQuantityCustom("");
    setReferenceUrl("");
    setBrief("");
    setProfile("");
    setSelectedFiles([]);
    setFileError("");
    setDraftRestored(false);
    setMessage("");
    setIsError(false);
    setMailtoHref(null);
    setSubmittedState(null);
  }

  function goToStep(target: StepNumber) {
    setMessage("");
    setIsError(false);
    setFieldErrors({});

    if (target > 1 && (!product || !readiness)) {
      setIsError(true);
      if (!product && !readiness) {
        setMessage(
          isEs
            ? "Elige primero qué tipo de producto quieres fabricar y en qué punto estás."
            : "Choose what you want to make and where you are right now first.",
        );
      } else if (!product) {
        setMessage(
          isEs
            ? "Elige qué tipo de producto quieres fabricar para continuar."
            : "Select what you want to make to continue.",
        );
      } else {
        setMessage(
          isEs
            ? "Elige en qué punto estás ahora para continuar."
            : "Select where you are right now to continue.",
        );
      }
      return;
    }

    if (target === 3) {
      const trimmedUrl = referenceUrl.trim();
      if (trimmedUrl && !isClientSafeHttpUrl(trimmedUrl)) {
        const urlErr = isEs
          ? "Introduce un enlace válido que empiece por http:// o https://."
          : "Enter a valid reference link starting with http:// or https://.";
        setFieldErrors({ referenceUrl: urlErr });
        setIsError(true);
        setMessage(urlErr);
        urlInputRef.current?.focus();
        return;
      }
    }

    setStep(target);
    scrollFormIntoView();
  }

  function resolveFinalQuantity(): string {
    const custom = quantityCustom.trim();
    if (custom) return custom;
    return quantityPreset;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (step === 1) {
      goToStep(2);
      return;
    }
    if (step === 2) {
      goToStep(3);
      return;
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedCompany = company.trim();
    const trimmedReferenceUrl = referenceUrl.trim();
    const trimmedBrief = brief.trim();
    const finalQuantity = resolveFinalQuantity();

    if (!product || !readiness) {
      setStep(1);
      setIsError(true);
      setMessage(
        isEs
          ? "Elige qué tipo de producto quieres fabricar y en qué punto estás."
          : "Choose what you want to make and your current stage.",
      );
      return;
    }

    const nextFieldErrors: {
      name?: string;
      email?: string;
      referenceUrl?: string;
    } = {};
    if (!trimmedName) {
      nextFieldErrors.name = isEs
        ? "Introduce tu nombre para saber a quién dirigirnos."
        : "Enter your name so Alma knows who to reply to.";
    }
    if (!isValidEmail(trimmedEmail)) {
      nextFieldErrors.email = isEs
        ? "Introduce un correo electrónico válido (ej. nombre@empresa.com)."
        : "Enter a valid email address (e.g. name@company.com).";
    }
    if (nextFieldErrors.name || nextFieldErrors.email) {
      setFieldErrors(nextFieldErrors);
      setIsError(true);
      setMailtoHref(null);
      setMessage(
        isEs
          ? "Revisa los campos marcados antes de enviar tu briefing de producto."
          : "Check the highlighted fields before sending your Product Brief.",
      );
      if (nextFieldErrors.name) {
        nameInputRef.current?.focus();
      } else if (nextFieldErrors.email) {
        emailInputRef.current?.focus();
      }
      return;
    }

    setFieldErrors({});

    if (trimmedReferenceUrl && !isClientSafeHttpUrl(trimmedReferenceUrl)) {
      const urlErr = isEs
        ? "Introduce un enlace válido que empiece por http:// o https://."
        : "Enter a valid reference link starting with http:// or https://.";
      setStep(2);
      setFieldErrors({ referenceUrl: urlErr });
      setIsError(true);
      setMailtoHref(null);
      setMessage(urlErr);
      requestAnimationFrame(() => urlInputRef.current?.focus());
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
      setStep(2);
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
          ? "Completa la verificación de seguridad antes de enviar tu briefing de producto."
          : "Please complete the security check before submitting your Product Brief.",
      );
      return;
    }

    // Save contact details to session handoff immediately so switching to /book-a-call pre-fills them.
    saveClientHandoff({
      name: trimmedName,
      email: trimmedEmail,
      company: trimmedCompany,
      preferredLanguage: replyLanguage === "Spanish" ? "es" : "en",
    });

    const subjectTarget = trimmedCompany || trimmedName;
    const subject = encodeURIComponent(
      `Product Brief: ${subjectTarget} (${product})`,
    );
    const body = encodeURIComponent(
      [
        `Name: ${trimmedName}`,
        trimmedCompany ? `Company: ${trimmedCompany}` : null,
        profile ? `Profile: ${profile}` : null,
        `Email: ${trimmedEmail}`,
        `Preferred language: ${replyLanguage}`,
        `Product type: ${product}`,
        `Current stage: ${readiness}`,
        finalQuantity
          ? `Estimated Bulk Order quantity: ${finalQuantity}`
          : null,
        trimmedReferenceUrl ? `Reference link: ${trimmedReferenceUrl}` : null,
        selectedFiles.length > 0
          ? `Selected files (attach manually): ${selectedFiles.map((file) => file.name).join(", ")}`
          : null,
        ...(trimmedBrief ? ["", "Project notes:", trimmedBrief] : []),
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
        payloadFormData.append("name", trimmedName);
        payloadFormData.append("company", trimmedCompany);
        payloadFormData.append("profile", profile);
        payloadFormData.append("email", trimmedEmail);
        payloadFormData.append("language", replyLanguage);
        payloadFormData.append("siteLanguage", siteLanguage);
        payloadFormData.append("product", product);
        payloadFormData.append("readiness", readiness);
        payloadFormData.append("quantity", finalQuantity);
        payloadFormData.append("referenceUrl", trimmedReferenceUrl);
        payloadFormData.append("brief", trimmedBrief);
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
            name: trimmedName,
            company: trimmedCompany,
            profile,
            email: trimmedEmail,
            language: replyLanguage,
            siteLanguage,
            product,
            readiness,
            quantity: finalQuantity,
            referenceUrl: trimmedReferenceUrl,
            brief: trimmedBrief,
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
                ? "No se ha podido enviar directamente. Puedes enviarnos tu briefing de producto desde tu aplicación de correo."
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

      clearProductBriefDraft();
      setSelectedFiles([]);
      setFileError("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setDraftRestored(false);
      setIsError(false);
      setMailtoHref(null);
      setSubmittedState({
        confirmationSent: result.confirmationSent !== false,
        recipientName: trimmedName,
      });
      scrollFormIntoView();
    } catch {
      setIsError(true);
      setMailtoHref(fallbackHref);
      setMessage(
        isEs
          ? "No hemos podido conectar con el servidor ahora mismo. Puedes enviarnos tu briefing de producto desde tu aplicación de correo."
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

  const stepLabels: ReadonlyArray<{ num: StepNumber; label: string }> = [
    { num: 1, label: isEs ? "Tu producto" : "Your product" },
    { num: 2, label: isEs ? "Detalles" : "Scope & files" },
    { num: 3, label: isEs ? "Tu contacto" : "Your details" },
  ];

  const selectedProductLabel =
    PRODUCT_OPTIONS.find((item) => item.value === product)?.title[
      siteLanguage
    ] ?? product;
  const selectedStageLabel =
    STAGE_OPTIONS.find((item) => item.value === readiness)?.title[
      siteLanguage
    ] ?? readiness;

  if (submittedState) {
    return (
      <ProductBriefConfirmation
        formTopRef={formTopRef}
        isEs={isEs}
        recipientName={submittedState.recipientName}
        confirmationSent={submittedState.confirmationSent}
        localizeHref={localizeHref}
        onResetDraft={handleResetDraft}
      />
    );
  }

  return (
    <div ref={formTopRef} className="grid min-w-0 gap-6">
      {/* Step progress header (no per-step timer) */}
      <div className="grid gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <ol className="m-0 flex list-none flex-wrap items-center gap-2 p-0">
            {stepLabels.map((item) => {
              const isCurrent = step === item.num;
              const isComplete = step > item.num;
              const canJump =
                item.num === 1 ||
                (item.num === 2 && Boolean(product && readiness)) ||
                (item.num === 3 && Boolean(product && readiness));

              return (
                <li key={item.num}>
                  <button
                    type="button"
                    disabled={!canJump || isSubmitting}
                    onClick={() => goToStep(item.num)}
                    aria-current={isCurrent ? "step" : undefined}
                    className={`inline-flex min-h-[var(--tap-min)] items-center gap-2 rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold transition-colors ${
                      isCurrent
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-night)]"
                        : isComplete
                          ? "cursor-pointer border-[var(--color-paper)]/30 bg-[var(--color-paper)]/12 text-[var(--color-paper)] hover:border-[var(--color-gold)]"
                          : "cursor-default border-[var(--color-paper)]/15 bg-transparent text-[var(--color-paper-2)]/65"
                    }`}
                  >
                    <span className="num">{item.num}</span>
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <span className="num text-[length:var(--text-xs)] font-medium text-[var(--color-paper-2)]/80">
            {step} / 3
          </span>
        </div>

        {/* Continuous hairline progress bar */}
        <div
          aria-hidden="true"
          className="h-1 w-full overflow-hidden rounded-full bg-[var(--color-paper)]/15"
        >
          <div
            className="h-full rounded-full bg-[var(--color-gold)] transition-[width] duration-[var(--dur-short)] ease-[var(--ease-out)]"
            style={{ width: `${(step / 3) * 100}%` }}
          />
        </div>

        {draftRestored ? (
          <div className="flex flex-wrap items-center justify-between gap-2 text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
            <span>
              {isEs
                ? "Hemos guardado tu borrador automáticamente."
                : "Your draft was saved automatically."}
            </span>
            <button
              type="button"
              onClick={handleResetDraft}
              className="cursor-pointer bg-transparent font-semibold text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)]"
            >
              {isEs ? "Empezar de cero" : "Start over"}
            </button>
          </div>
        ) : null}
      </div>

      <form
        aria-label={
          isEs ? "Formulario de briefing de producto" : "Product Brief form"
        }
        className="brief-form min-w-0"
        data-endpoint="/api/product-brief"
        noValidate
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="language" value={replyLanguage} />
        <div className="hidden" aria-hidden="true">
          <label htmlFor="brief-company-website">Company website</label>
          <input
            id="brief-company-website"
            name="companyWebsite"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={companyWebsite}
            onChange={(event) => setCompanyWebsite(event.target.value)}
          />
        </div>

        <div
          hidden={step !== 1}
          className={step === 1 ? "grid min-w-0 gap-7" : "hidden"}
        >
          <fieldset className="m-0 grid min-w-0 gap-3 border-0 p-0">
            <legend className="mb-1 text-[length:var(--text-md)] font-medium text-[var(--color-paper)]">
              {isEs
                ? "¿Qué te gustaría fabricar?"
                : "What would you love to make?"}
            </legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {PRODUCT_OPTIONS.map((option) => {
                const active = product === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setProduct(option.value);
                      setIsError(false);
                      setMessage("");
                    }}
                    className={`grid min-h-[var(--tap-min)] cursor-pointer content-start gap-1.5 rounded-[var(--radius-input)] border p-4 text-left transition-colors ${
                      active
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)]/18 text-[var(--color-paper)]"
                        : "border-[var(--color-paper)]/22 bg-[var(--color-paper)]/6 text-[var(--color-paper)] hover:border-[var(--color-paper-2)]/65 hover:bg-[var(--color-paper)]/12"
                    }`}
                  >
                    <span className="text-[length:var(--text-sm)] font-semibold">
                      {option.title[siteLanguage]}
                    </span>
                    <span className="text-[length:var(--text-xs)] leading-snug text-[var(--color-paper-2)]/80">
                      {option.hint[siteLanguage]}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <fieldset className="m-0 grid min-w-0 gap-3 border-0 p-0">
            <legend className="mb-1 text-[length:var(--text-md)] font-medium text-[var(--color-paper)]">
              {isEs ? "¿En qué punto estás ahora?" : "Where are you right now?"}
            </legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {STAGE_OPTIONS.map((option) => {
                const active = readiness === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setReadiness(option.value);
                      setIsError(false);
                      setMessage("");
                    }}
                    className={`grid min-h-[var(--tap-min)] cursor-pointer content-start gap-1 rounded-[var(--radius-input)] border p-4 text-left transition-colors ${
                      active
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)]/18 text-[var(--color-paper)]"
                        : "border-[var(--color-paper)]/22 bg-[var(--color-paper)]/6 text-[var(--color-paper)] hover:border-[var(--color-paper-2)]/65 hover:bg-[var(--color-paper)]/12"
                    }`}
                  >
                    <span className="text-[length:var(--text-sm)] font-semibold">
                      {option.title[siteLanguage]}
                    </span>
                    <span className="text-[length:var(--text-xs)] leading-snug text-[var(--color-paper-2)]/80">
                      {option.hint[siteLanguage]}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          {message ? (
            <p
              role="alert"
              className="text-[length:var(--text-sm)] text-[var(--color-gold)]"
            >
              {message}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <p className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/75">
              {isEs
                ? "No necesitas ficha técnica cerrada ni cantidades definitivas."
                : "No finished tech pack or final quantities needed."}
            </p>
            <button type="submit" className="primary-button">
              {isEs ? "Seguir con detalles" : "Continue to details"}
            </button>
          </div>
        </div>

        <div
          hidden={step !== 2}
          className={step === 2 ? "grid min-w-0 gap-6" : "hidden"}
        >
          <fieldset className="m-0 grid min-w-0 gap-3 border-0 p-0">
            <legend className="mb-1 text-[length:var(--text-sm)] font-medium text-[var(--color-paper-2)]">
              {isEs
                ? "Cantidad aproximada (opcional)"
                : "Rough quantity (optional)"}
            </legend>
            <div className="flex flex-wrap gap-2">
              {QUANTITY_PRESETS.map((preset) => {
                const active =
                  quantityPreset === preset.value && !quantityCustom.trim();
                return (
                  <button
                    key={preset.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() => {
                      setQuantityPreset(
                        quantityPreset === preset.value ? "" : preset.value,
                      );
                      setQuantityCustom("");
                    }}
                    className={`inline-flex min-h-[var(--tap-min)] cursor-pointer items-center rounded-[var(--radius-pill)] border px-4 py-2 text-[length:var(--text-xs)] font-semibold transition-colors ${
                      active
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-night)]"
                        : "border-[var(--color-paper)]/25 bg-[var(--color-paper)]/8 text-[var(--color-paper)] hover:border-[var(--color-paper-2)]"
                    }`}
                  >
                    {preset.label[siteLanguage]}
                  </button>
                );
              })}
            </div>
            <input
              aria-label={
                isEs
                  ? "O escribe una cantidad concreta (opcional)"
                  : "Or enter a specific quantity (optional)"
              }
              value={quantityCustom}
              onChange={(event) => {
                setQuantityCustom(event.target.value);
                if (event.target.value.trim()) {
                  setQuantityPreset("");
                }
              }}
              placeholder={
                isEs
                  ? "O escribe algo concreto (ej. 200 unidades en 2 colores)"
                  : "Or type something specific (e.g. 200 units across 2 colours)"
              }
              className="min-h-[var(--tap-min)] w-full rounded-[var(--radius-input)] border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/8 px-4 text-[length:var(--text-sm)] text-[var(--color-paper)] placeholder:text-[var(--color-paper-2)]/55 focus:border-[var(--color-gold)] focus:outline-none"
            />
          </fieldset>

          <div className="field min-w-0">
            <label htmlFor="brief-notes">
              {isEs
                ? "Cuéntanos qué tienes en mente (opcional)"
                : "Tell us what you picture (optional)"}
            </label>
            <textarea
              ref={notesRef}
              id="brief-notes"
              name="brief"
              rows={4}
              value={brief}
              onChange={(event) => setBrief(event.target.value)}
              disabled={isSubmitting}
              placeholder={
                isEs
                  ? "Tacto de la piel, gramaje del tejido, largo del asa, país de destino o fecha de lanzamiento. Déjalo vacío si prefieres contárnoslo en una llamada."
                  : "Leather softness, cloth weight, strap length, destination country, or launch season. Leave blank if you prefer to talk it through on a call."
              }
            />
            <div className="flex flex-wrap gap-2 pt-1">
              {NOTE_PROMPTS.map((prompt) => (
                <button
                  key={prompt.label.en}
                  type="button"
                  onClick={() =>
                    handleInsertNotePrompt(prompt.snippet[siteLanguage])
                  }
                  className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center rounded-[var(--radius-pill)] border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/6 px-3 py-1 text-[length:var(--text-xs)] text-[var(--color-paper-2)] transition-colors hover:border-[var(--color-gold)] hover:text-[var(--color-paper)]"
                >
                  {prompt.label[siteLanguage]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3">
            <span className="text-[length:var(--text-sm)] text-[var(--color-paper-2)]">
              {isEs
                ? "Bocetos, fotos o PDF (opcional)"
                : "Sketches, photos, or PDF (optional)"}
            </span>
            <input
              ref={fileInputRef}
              id="brief-files"
              name="attachments"
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,.pdf,image/jpeg,image/png,image/webp,application/pdf"
              className="peer sr-only"
              disabled={
                isSubmitting || selectedFiles.length >= MAX_UPLOAD_FILES
              }
              onChange={handleFilesChange}
            />
            <label
              htmlFor="brief-files"
              onDragOver={(event) => {
                event.preventDefault();
                setIsDraggingFiles(true);
              }}
              onDragLeave={() => setIsDraggingFiles(false)}
              onDrop={handleDrop}
              className={`flex min-h-[var(--control-height)] flex-wrap items-center justify-between gap-3 rounded-[var(--radius-input)] border border-dashed px-4 py-3 text-[length:var(--text-sm)] text-[var(--color-paper)] transition-colors peer-focus-visible:border-[var(--color-gold)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--color-gold)]/40 ${
                isDraggingFiles
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)]/15"
                  : isSubmitting || selectedFiles.length >= MAX_UPLOAD_FILES
                    ? "cursor-not-allowed border-[var(--color-paper)]/20 bg-[var(--color-paper)]/6 opacity-55"
                    : "cursor-pointer border-[var(--color-paper)]/30 bg-[var(--color-paper)]/8 hover:border-[var(--color-paper-2)]"
              }`}
            >
              <span className="font-medium">
                {isEs
                  ? selectedFiles.length >= MAX_UPLOAD_FILES
                    ? "Límite de 3 archivos alcanzado"
                    : "Arrastra o elige archivos (JPG, PNG, WebP, PDF)"
                  : selectedFiles.length >= MAX_UPLOAD_FILES
                    ? "Maximum 3 files attached"
                    : "Drop or choose files (JPG, PNG, WebP, PDF)"}
              </span>
              <span className="num text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
                {selectedFiles.length}/{MAX_UPLOAD_FILES}
              </span>
            </label>

            {fileError ? (
              <p
                role="alert"
                className="text-[length:var(--text-xs)] text-[var(--color-gold)]"
              >
                {fileError}
              </p>
            ) : null}

            {selectedFiles.length > 0 ? (
              <ul className="m-0 grid list-none gap-2 p-0">
                {selectedFiles.map((file, index) => (
                  <li
                    key={`${file.name}-${file.size}-${index}`}
                    className="flex items-center justify-between gap-3 rounded-[var(--radius-input)] border border-[var(--color-paper)]/20 bg-[var(--color-paper)]/8 py-1 pr-1 pl-3 text-[length:var(--text-xs)] text-[var(--color-paper)]"
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
                      className="inline-flex min-h-[var(--tap-min)] shrink-0 cursor-pointer items-center px-3 font-semibold text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)] disabled:cursor-not-allowed disabled:opacity-55"
                    >
                      {isEs ? "Quitar" : "Remove"}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          <div className="field min-w-0">
            <label htmlFor="brief-reference-url">
              {isEs
                ? "Enlace de referencia (opcional)"
                : "Reference link (optional)"}
            </label>
            <input
              ref={urlInputRef}
              id="brief-reference-url"
              name="referenceUrl"
              type="url"
              inputMode="url"
              autoComplete="url"
              maxLength={2000}
              aria-invalid={Boolean(fieldErrors.referenceUrl) || undefined}
              aria-describedby={
                fieldErrors.referenceUrl
                  ? "brief-reference-url-error"
                  : undefined
              }
              value={referenceUrl}
              onChange={(event) => {
                setReferenceUrl(event.target.value);
                if (fieldErrors.referenceUrl) {
                  setFieldErrors((prev) => ({
                    ...prev,
                    referenceUrl: undefined,
                  }));
                }
                if (isError) {
                  setIsError(false);
                  setMessage("");
                }
              }}
              disabled={isSubmitting}
              placeholder={
                isEs
                  ? "https://ejemplo.com/pieza-o-carpeta"
                  : "https://example.com/item-or-folder"
              }
            />
            {fieldErrors.referenceUrl ? (
              <p
                id="brief-reference-url-error"
                role="alert"
                className="text-[length:var(--text-xs)] text-[var(--color-gold)]"
              >
                {fieldErrors.referenceUrl}
              </p>
            ) : null}
          </div>

          {message ? (
            <p
              role="alert"
              className="text-[length:var(--text-sm)] text-[var(--color-gold)]"
            >
              {message}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center rounded-[var(--radius-pill)] border border-[var(--color-paper)]/25 bg-transparent px-5 py-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] transition-colors hover:border-[var(--color-paper)]"
            >
              {isEs ? "← Atrás" : "← Back"}
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/75">
                {isEs
                  ? "Todo en este paso es opcional."
                  : "Everything on this step is optional."}
              </span>
              <button type="submit" className="primary-button">
                {isEs ? "Seguir a tus datos" : "Continue to your details"}
              </button>
            </div>
          </div>
        </div>

        <div
          hidden={step !== 3}
          className={step === 3 ? "grid min-w-0 gap-6" : "hidden"}
        >
          {/* Compact Step 1 recap */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-input)] border border-[var(--color-paper)]/18 bg-[var(--color-night)]/25 px-4 py-3 text-[length:var(--text-xs)]">
            <div className="flex flex-wrap items-center gap-2 text-[var(--color-paper)]">
              <span className="font-semibold">{selectedProductLabel}</span>
              <span aria-hidden="true" className="text-[var(--color-gold)]">
                ·
              </span>
              <span className="text-[var(--color-paper-2)]">
                {selectedStageLabel}
              </span>
              {resolveFinalQuantity() ? (
                <>
                  <span aria-hidden="true" className="text-[var(--color-gold)]">
                    ·
                  </span>
                  <span className="text-[var(--color-paper-2)]">
                    {resolveFinalQuantity()}
                  </span>
                </>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => goToStep(1)}
              className="cursor-pointer bg-transparent font-semibold text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)]"
            >
              {isEs ? "Cambiar" : "Edit"}
            </button>
          </div>

          <div className="field-row">
            <div className="field min-w-0">
              <label htmlFor="brief-name">
                {isEs ? "Tu nombre" : "Your name"}
              </label>
              <input
                ref={nameInputRef}
                id="brief-name"
                name="name"
                autoComplete="name"
                required
                aria-invalid={Boolean(fieldErrors.name) || undefined}
                aria-describedby={
                  fieldErrors.name ? "brief-name-error" : undefined
                }
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  if (fieldErrors.name) {
                    setFieldErrors((prev) => ({ ...prev, name: undefined }));
                  }
                }}
                disabled={isSubmitting}
                placeholder={isEs ? "Ej. Lucía Navarro" : "e.g. Elena Ruiz"}
              />
              {fieldErrors.name ? (
                <p
                  id="brief-name-error"
                  role="alert"
                  className="text-[length:var(--text-xs)] text-[var(--color-gold)]"
                >
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>
            <div className="field min-w-0">
              <label htmlFor="brief-email">
                {isEs ? "Correo electrónico" : "Email"}
              </label>
              <input
                ref={emailInputRef}
                id="brief-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                aria-invalid={Boolean(fieldErrors.email) || undefined}
                aria-describedby={
                  fieldErrors.email ? "brief-email-error" : undefined
                }
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }
                }}
                disabled={isSubmitting}
                placeholder={isEs ? "tu@correo.com" : "you@example.com"}
              />
              {fieldErrors.email ? (
                <p
                  id="brief-email-error"
                  role="alert"
                  className="text-[length:var(--text-xs)] text-[var(--color-gold)]"
                >
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>
          </div>

          <div className="field min-w-0">
            <label htmlFor="brief-company">
              {isEs
                ? "Empresa, tienda o marca (opcional)"
                : "Company, shop, or brand (optional)"}
            </label>
            <input
              id="brief-company"
              name="company"
              autoComplete="organization"
              value={company}
              onChange={(event) => setCompany(event.target.value)}
              disabled={isSubmitting}
              placeholder={
                isEs
                  ? "Si todavía estás empezando, puedes dejarlo vacío"
                  : "Leave blank if you are still early or exploring"
              }
            />
          </div>

          <fieldset className="m-0 grid min-w-0 gap-2.5 border-0 p-0">
            <legend className="mb-1 text-[length:var(--text-sm)] text-[var(--color-paper-2)]">
              {isEs
                ? "¿Qué te describe mejor? (opcional)"
                : "Which describes you best? (optional)"}
            </legend>
            <div className="flex flex-wrap gap-2">
              {PROFILE_OPTIONS.map((option) => {
                const active = profile === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    aria-pressed={active}
                    disabled={isSubmitting}
                    onClick={() =>
                      setProfile(profile === option.value ? "" : option.value)
                    }
                    className={`inline-flex min-h-[var(--tap-min)] cursor-pointer items-center rounded-[var(--radius-pill)] border px-3.5 py-1.5 text-[length:var(--text-xs)] font-semibold transition-colors ${
                      active
                        ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-night)]"
                        : "border-[var(--color-paper)]/25 bg-[var(--color-paper)]/8 text-[var(--color-paper)] hover:border-[var(--color-paper-2)]"
                    }`}
                  >
                    {option.label[siteLanguage]}
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--color-paper)]/15 pt-4">
            <span className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
              {isEs ? "Idioma de respuesta:" : "Reply language:"}
            </span>
            <div
              role="group"
              aria-label={isEs ? "Idioma preferido" : "Preferred language"}
              className="inline-flex rounded-[var(--radius-pill)] border border-[var(--color-paper)]/22 bg-[var(--color-paper)]/8 p-0.5"
            >
              {(
                [
                  { value: "Spanish" as const, label: "Español" },
                  { value: "English" as const, label: "English" },
                ] as const
              ).map((langOption) => {
                const active = replyLanguage === langOption.value;
                return (
                  <button
                    key={langOption.value}
                    type="button"
                    aria-pressed={active}
                    disabled={isSubmitting}
                    onClick={() => setReplyLanguageOverride(langOption.value)}
                    className={`min-h-[var(--tap-min)] cursor-pointer rounded-[var(--radius-pill)] px-3.5 text-[length:var(--text-xs)] font-semibold transition-colors ${
                      active
                        ? "bg-[var(--color-paper)] text-[var(--color-night)]"
                        : "bg-transparent text-[var(--color-paper-2)] hover:text-[var(--color-paper)]"
                    }`}
                  >
                    {langOption.label}
                  </button>
                );
              })}
            </div>
          </div>

          {step === 3 ? (
            <TurnstileField
              onTokenChange={setTurnstileToken}
              language={siteLanguage}
              resetSignal={turnstileResetSignal}
              theme="dark"
            />
          ) : null}

          {message ? (
            <div
              aria-live="polite"
              className={
                isError
                  ? "grid gap-2 text-[length:var(--text-sm)] text-[var(--color-gold)]"
                  : "grid gap-2 text-[length:var(--text-sm)] text-[var(--color-paper-2)]"
              }
            >
              <p>{message}</p>
              {mailtoHref ? (
                <p>
                  <a
                    className="inline-flex min-h-[var(--tap-min)] items-center font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-gold)] underline underline-offset-4 hover:text-[var(--color-paper)]"
                    href={mailtoHref}
                  >
                    {isEs
                      ? `Abrir correo preparado para ${contactEmail}`
                      : `Open prepared email to ${contactEmail}`}
                  </a>
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => goToStep(2)}
              className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center rounded-[var(--radius-pill)] border border-[var(--color-paper)]/25 bg-transparent px-5 py-2 text-[length:var(--text-sm)] font-semibold text-[var(--color-paper)] transition-colors hover:border-[var(--color-paper)] disabled:opacity-55"
            >
              {isEs ? "← Atrás" : "← Back"}
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
                {isEs
                  ? "Alma responde personalmente en 1 o 2 días laborables."
                  : "Alma replies personally within 1–2 business days."}
              </span>
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
                    ? "Enviar briefing a Alma"
                    : "Send brief to Alma"}
              </button>
            </div>
          </div>
        </div>

        <p className="text-[length:var(--text-xs)] text-[var(--color-paper-2)]/80">
          {isEs ? (
            <>
              Los diseños de tu briefing de producto siguen siendo de tu
              exclusiva propiedad intelectual según nuestras{" "}
              <Link
                className="underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
                href={localizeHref("/terms#confidentiality")}
              >
                Condiciones de uso
              </Link>{" "}
              y nuestra{" "}
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
              Your Product Brief designs stay your sole intellectual property
              under our{" "}
              <Link
                className="underline decoration-[var(--color-clay-light)] underline-offset-4 hover:text-[var(--color-paper)]"
                href={localizeHref("/terms#confidentiality")}
              >
                Website terms
              </Link>{" "}
              and{" "}
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
    </div>
  );
}
