"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";

import { ProductBriefConfirmation } from "@/components/forms/product-brief-confirmation";
import { TurnstileField } from "@/components/forms/turnstile-field";
import { useLanguage } from "@/context/language-context";
import {
  ALLOWED_MIME_BY_EXT,
  formatFileSize,
  getFileExtension,
  isClientSafeHttpUrl,
  localizeOptionForConfirmation,
  MAX_FILE_BYTES,
  MAX_TOTAL_UPLOAD_BYTES,
  MAX_UPLOAD_FILES,
  normalizeOptionalReferenceUrl,
  PRODUCT_BRIEF_CONTACT_EMAIL as contactEmail,
  PRODUCT_OPTIONS,
  PROFILE_OPTIONS,
  QUANTITY_PRESETS,
  STAGE_OPTIONS,
  type StepNumber,
} from "@/data/product-brief-options";
import {
  buildFormAttributionPayload,
  clearProductBriefDraft,
  readClientHandoff,
  readProductBriefDraft,
  resolveProductFromQueryParam,
  saveClientHandoff,
  saveProductBriefDraft,
  scrollElementIntoViewSafe,
} from "@/lib/client-handoff";
import { isValidEmail } from "@/lib/validation";

const IS_TURNSTILE_ENABLED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim(),
);

type ReplyLanguage = "English" | "Spanish" | "Portuguese";

const REFERRAL_SUGGESTIONS = {
  en: [
    "LinkedIn",
    "Instagram",
    "Podcast",
    "Newsletter",
    "Word of mouth",
    "Web search",
  ],
  es: [
    "LinkedIn",
    "Instagram",
    "Pódcast",
    "Boletín de Historias",
    "Recomendación personal",
    "Buscador",
  ],
} as const;

const COMPACT_STAGE_LABELS: Record<string, { en: string; es: string }> = {
  "Concept or reference items only": {
    en: "Idea or reference piece",
    es: "Idea o pieza de referencia",
  },
  "Sketches or early tech pack": {
    en: "Sketches or early pack",
    es: "Bocetos o ficha inicial",
  },
  "Physical sample ready": {
    en: "Physical sample ready",
    es: "Muestra física lista",
  },
  "Existing product moving to India": {
    en: "Moving line to India",
    es: "Pasar línea a la India",
  },
};

function ProductBriefQuerySync({
  onQueryProduct,
}: {
  onQueryProduct: (queryProduct: string) => void;
}) {
  const searchParams = useSearchParams();
  const rawParam = searchParams.get("product") ?? searchParams.get("category");

  useEffect(() => {
    const resolved = resolveProductFromQueryParam(rawParam);
    if (resolved) {
      onQueryProduct(resolved);
    }
  }, [rawParam, onQueryProduct]);

  return null;
}

function CheckBadge({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-[var(--radius-pill)] border transition-colors ${
        active
          ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
          : "border-[var(--color-control-border)] bg-[var(--color-white)] text-transparent"
      }`}
    >
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 6.2 4.8 8.5 9.5 3.5" />
      </svg>
    </span>
  );
}

export function ProductBriefForm() {
  const { language: siteLanguage, localizeHref } = useLanguage();
  const isEs = siteLanguage === "es";

  const formTopRef = useRef<HTMLDivElement | null>(null);
  const stepHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const confirmationHeadingRef = useRef<HTMLHeadingElement | null>(null);
  const firstProductButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstStageButtonRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const nameInputRef = useRef<HTMLInputElement | null>(null);
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const hydratedRef = useRef(false);
  const turnstileTokenRef = useRef("");
  const turnstileFailedRef = useRef(false);

  const [step, setStep] = useState<StepNumber>(1);
  const [product, setProduct] = useState("");
  const [readiness, setReadiness] = useState("");
  const [quantityPreset, setQuantityPreset] = useState("");
  const [referenceUrl, setReferenceUrl] = useState("");
  const [brief, setBrief] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [profile, setProfile] = useState("");
  const [referralSource, setReferralSource] = useState("");
  const [replyLanguageOverride, setReplyLanguageOverride] = useState<
    ReplyLanguage | ""
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
  const [statusAnnouncement, setStatusAnnouncement] = useState("");

  const [turnstileToken, setTurnstileToken] = useState("");
  const [turnstileFailed, setTurnstileFailed] = useState(false);
  const [turnstileResetSignal, setTurnstileResetSignal] = useState(0);

  const replyLanguage: ReplyLanguage =
    replyLanguageOverride || (isEs ? "Spanish" : "English");

  const handleTurnstileTokenChange = useCallback((token: string) => {
    turnstileTokenRef.current = token;
    setTurnstileToken(token);
  }, []);

  const handleTurnstileError = useCallback((failed: boolean) => {
    turnstileFailedRef.current = failed;
    setTurnstileFailed(failed);
  }, []);

  async function waitForTurnstileToken(timeoutMs = 2000): Promise<string> {
    if (turnstileTokenRef.current || turnstileFailedRef.current) {
      return turnstileTokenRef.current;
    }
    const maxAttempts = Math.max(1, Math.ceil(timeoutMs / 120));
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 120));
      if (turnstileTokenRef.current || turnstileFailedRef.current) {
        return turnstileTokenRef.current;
      }
    }
    return turnstileTokenRef.current;
  }

  // Handle same-route ?product= / ?category= transitions cleanly.
  const handleQueryProduct = useCallback((queryProduct: string) => {
    if (!hydratedRef.current) {
      return;
    }
    setProduct((current) => {
      if (current === queryProduct) {
        return current;
      }
      setStep(1);
      setSubmittedState(null);
      setIsError(false);
      setMessage("");
      return queryProduct;
    });
  }, []);

  // Restore saved draft, shared session handoff, and initial ?product=/?category= on mount.
  useEffect(() => {
    let active = true;
    void Promise.resolve().then(() => {
      if (!active) return;

      const draft = readProductBriefDraft();
      const handoff = readClientHandoff();
      const params = new URLSearchParams(window.location.search);
      const queryProduct = resolveProductFromQueryParam(
        params.get("product") ?? params.get("category"),
      );

      if (draft) {
        const categorySwitched = Boolean(
          queryProduct && queryProduct !== draft.product,
        );
        setStep(
          categorySwitched || (queryProduct && !draft.readiness)
            ? 1
            : draft.step,
        );
        setProduct(queryProduct || draft.product);
        setReadiness(draft.readiness);
        setQuantityPreset(draft.quantityPreset);
        setReferenceUrl(draft.referenceUrl);
        setBrief(draft.brief);
        setName(draft.name || handoff.name || "");
        setEmail(draft.email || handoff.email || "");
        setCompany(draft.company || handoff.company || "");
        setProfile(draft.profile);
        setReferralSource(draft.referralSource || "");
        if (draft.language) {
          setReplyLanguageOverride(draft.language);
        } else if (handoff.preferredLanguage === "es") {
          setReplyLanguageOverride("Spanish");
        } else if (handoff.preferredLanguage === "pt") {
          setReplyLanguageOverride("Portuguese");
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
        } else if (handoff.preferredLanguage === "pt") {
          setReplyLanguageOverride("Portuguese");
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
      quantityCustom: "",
      referenceUrl,
      brief,
      name,
      email,
      company,
      profile,
      referralSource,
      language: replyLanguageOverride,
    });
  }, [
    step,
    product,
    readiness,
    quantityPreset,
    referenceUrl,
    brief,
    name,
    email,
    company,
    profile,
    referralSource,
    replyLanguageOverride,
    submittedState,
  ]);

  function scrollFormIntoView(
    focusTarget: "step" | "confirmed" | "none" = "none",
  ) {
    requestAnimationFrame(() => {
      scrollElementIntoViewSafe(formTopRef.current, "start");
      if (focusTarget === "step") {
        stepHeadingRef.current?.focus({ preventScroll: true });
      } else if (focusTarget === "confirmed") {
        confirmationHeadingRef.current?.focus({ preventScroll: true });
      }
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
      const rawMime = file.type.trim().toLowerCase();
      const declaredMime = rawMime === "image/jpg" ? "image/jpeg" : rawMime;

      if (
        !expectedMime ||
        (declaredMime !== "" && declaredMime !== expectedMime)
      ) {
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

  function handleResetDraft() {
    clearProductBriefDraft();
    setStep(1);
    setProduct("");
    setReadiness("");
    setQuantityPreset("");
    setReferenceUrl("");
    setBrief("");
    setProfile("");
    setReferralSource("");
    setSelectedFiles([]);
    setFileError("");
    setDraftRestored(false);
    setMessage("");
    setIsError(false);
    setMailtoHref(null);
    setStatusAnnouncement("");
    setSubmittedState(null);
    scrollFormIntoView("step");
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
        firstProductButtonRef.current?.focus();
      } else if (!product) {
        setMessage(
          isEs
            ? "Elige qué tipo de producto quieres fabricar para continuar."
            : "Select what you want to make to continue.",
        );
        firstProductButtonRef.current?.focus();
      } else {
        setMessage(
          isEs
            ? "Elige en qué punto estás ahora para continuar."
            : "Select where you are right now to continue.",
        );
        firstStageButtonRef.current?.focus();
      }
      return;
    }

    if (target === 3) {
      const normalizedUrl = normalizeOptionalReferenceUrl(referenceUrl);
      if (normalizedUrl !== referenceUrl) {
        setReferenceUrl(normalizedUrl);
      }
      if (normalizedUrl && !isClientSafeHttpUrl(normalizedUrl)) {
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
    scrollFormIntoView("step");
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
    const normalizedReferenceUrl = normalizeOptionalReferenceUrl(referenceUrl);
    if (normalizedReferenceUrl !== referenceUrl) {
      setReferenceUrl(normalizedReferenceUrl);
    }
    const trimmedBrief = brief.trim();
    const trimmedReferralSource = referralSource.trim();
    const finalQuantity = quantityPreset;

    if (!product || !readiness) {
      setStep(1);
      setIsError(true);
      setMessage(
        isEs
          ? "Elige qué tipo de producto quieres fabricar y en qué punto estás."
          : "Choose what you want to make and your current stage.",
      );
      scrollFormIntoView("step");
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

    if (
      normalizedReferenceUrl &&
      !isClientSafeHttpUrl(normalizedReferenceUrl)
    ) {
      const urlErr = isEs
        ? "Introduce un enlace válido que empiece por http:// o https://."
        : "Enter a valid reference link starting with http:// or https://.";
      setStep(2);
      setFieldErrors({ referenceUrl: urlErr });
      setIsError(true);
      setMailtoHref(null);
      setMessage(urlErr);
      scrollFormIntoView("none");
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
      scrollFormIntoView("step");
      return;
    }

    const fallbackLang = isEs ? "es" : "en";
    const localizedProductLabel = localizeOptionForConfirmation(
      product,
      fallbackLang,
    );
    const localizedReadinessLabel = localizeOptionForConfirmation(
      readiness,
      fallbackLang,
    );
    const localizedQuantityLabel = finalQuantity
      ? localizeOptionForConfirmation(finalQuantity, fallbackLang)
      : "";
    const localizedProfileLabel = profile
      ? localizeOptionForConfirmation(profile, fallbackLang)
      : "";
    const subjectTarget = trimmedCompany || trimmedName;
    const subject = encodeURIComponent(
      isEs
        ? `Briefing de producto: ${subjectTarget} (${localizedProductLabel})`
        : `Product Brief: ${subjectTarget} (${localizedProductLabel})`,
    );
    const body = encodeURIComponent(
      (isEs
        ? [
            `Nombre: ${trimmedName}`,
            trimmedCompany ? `Empresa o tienda: ${trimmedCompany}` : null,
            localizedProfileLabel ? `Perfil: ${localizedProfileLabel}` : null,
            `Correo: ${trimmedEmail}`,
            `Idioma preferido: ${replyLanguage}`,
            `Categoría: ${localizedProductLabel}`,
            `Punto actual: ${localizedReadinessLabel}`,
            localizedQuantityLabel
              ? `Cantidad estimada: ${localizedQuantityLabel}`
              : null,
            trimmedReferralSource
              ? `Cómo nos conociste: ${trimmedReferralSource}`
              : null,
            normalizedReferenceUrl
              ? `Enlace de referencia: ${normalizedReferenceUrl}`
              : null,
            selectedFiles.length > 0
              ? `Archivos seleccionados (adjuntar manualmente): ${selectedFiles.map((file) => file.name).join(", ")}`
              : null,
            ...(trimmedBrief ? ["", "Notas del proyecto:", trimmedBrief] : []),
          ]
        : [
            `Name: ${trimmedName}`,
            trimmedCompany ? `Company: ${trimmedCompany}` : null,
            localizedProfileLabel ? `Profile: ${localizedProfileLabel}` : null,
            `Email: ${trimmedEmail}`,
            `Preferred language: ${replyLanguage}`,
            `Product category: ${localizedProductLabel}`,
            `Current stage: ${localizedReadinessLabel}`,
            localizedQuantityLabel
              ? `Estimated quantity: ${localizedQuantityLabel}`
              : null,
            trimmedReferralSource
              ? `How you heard about us: ${trimmedReferralSource}`
              : null,
            normalizedReferenceUrl
              ? `Reference link: ${normalizedReferenceUrl}`
              : null,
            selectedFiles.length > 0
              ? `Selected files (attach manually): ${selectedFiles.map((file) => file.name).join(", ")}`
              : null,
            ...(trimmedBrief ? ["", "Project notes:", trimmedBrief] : []),
          ]
      )
        .filter((line): line is string => line !== null)
        .join("\n"),
    );
    const fallbackHref = `mailto:${contactEmail}?subject=${subject}&body=${body}`;

    let activeTurnstileToken = turnstileTokenRef.current || turnstileToken;
    if (IS_TURNSTILE_ENABLED && !activeTurnstileToken) {
      setIsSubmitting(true);
      activeTurnstileToken = await waitForTurnstileToken(2000);
      if (!activeTurnstileToken) {
        setIsSubmitting(false);
        setIsError(true);
        setMailtoHref(fallbackHref);
        setMessage(
          turnstileFailed || turnstileFailedRef.current
            ? isEs
              ? "No se pudo cargar la verificación de seguridad. Pulsa Reintentar o envíanos tu briefing desde tu aplicación de correo."
              : "Security verification could not load. Retry the check or send your Product Brief via your email app."
            : isEs
              ? "Completa la verificación de seguridad antes de enviar, o usa tu aplicación de correo."
              : "Complete the security check before submitting, or send via your email app.",
        );
        return;
      }
    }

    saveClientHandoff({
      name: trimmedName,
      email: trimmedEmail,
      company: trimmedCompany,
      preferredLanguage:
        replyLanguage === "Spanish"
          ? "es"
          : replyLanguage === "Portuguese"
            ? "pt"
            : "en",
    });

    const attributionPayload = buildFormAttributionPayload(
      trimmedReferralSource,
    );

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
        payloadFormData.append("referenceUrl", normalizedReferenceUrl);
        payloadFormData.append("brief", trimmedBrief);
        if (attributionPayload.referralSource) {
          payloadFormData.append(
            "referralSource",
            attributionPayload.referralSource,
          );
        }
        if (attributionPayload.referralCode) {
          payloadFormData.append(
            "referralCode",
            attributionPayload.referralCode,
          );
        }
        if (attributionPayload.utmSource) {
          payloadFormData.append("utmSource", attributionPayload.utmSource);
        }
        if (attributionPayload.utmMedium) {
          payloadFormData.append("utmMedium", attributionPayload.utmMedium);
        }
        if (attributionPayload.utmCampaign) {
          payloadFormData.append("utmCampaign", attributionPayload.utmCampaign);
        }
        if (attributionPayload.utmContent) {
          payloadFormData.append("utmContent", attributionPayload.utmContent);
        }
        if (attributionPayload.landingPath) {
          payloadFormData.append("landingPath", attributionPayload.landingPath);
        }
        payloadFormData.append(
          "attributionConsent",
          String(attributionPayload.attributionConsent),
        );
        if (attributionPayload.attribution) {
          payloadFormData.append(
            "attribution",
            JSON.stringify(attributionPayload.attribution),
          );
        }
        payloadFormData.append("companyWebsite", companyWebsite);
        payloadFormData.append("turnstileToken", activeTurnstileToken);
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
            referenceUrl: normalizedReferenceUrl,
            brief: trimmedBrief,
            ...attributionPayload,
            companyWebsite,
            turnstileToken: activeTurnstileToken,
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
                : "Review your details or attached files and try again."),
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
      setStatusAnnouncement(
        isEs
          ? `Briefing de producto recibido. Gracias, ${trimmedName}.`
          : `Product Brief received. Thank you, ${trimmedName}.`,
      );
      setSubmittedState({
        confirmationSent: result.confirmationSent !== false,
        recipientName: trimmedName,
      });
      scrollFormIntoView("confirmed");
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
        handleTurnstileTokenChange("");
        setTurnstileResetSignal((value) => value + 1);
      }
    }
  }

  const stepMeta = [
    {
      num: 1 as StepNumber,
      shortLabel: isEs ? "Producto" : "Product",
      heading: isEs
        ? "¿Qué te gustaría fabricar?"
        : "What would you love to make?",
      subtitle: "",
    },
    {
      num: 2 as StepNumber,
      shortLabel: isEs ? "Detalles" : "Details",
      heading: isEs ? "Cuéntanos algún detalle." : "Share a few details.",
      subtitle: isEs
        ? "Todo en este paso es opcional."
        : "Everything on this step is optional.",
    },
    {
      num: 3 as StepNumber,
      shortLabel: isEs ? "Contacto" : "Contact",
      heading: isEs ? "¿Dónde te responde Alma?" : "Where should Alma reply?",
      subtitle: isEs
        ? "Respuesta personal en 1 o 2 días laborables."
        : "Personal reply within 1 to 2 business days.",
    },
  ] as const;

  const activeStepMeta = stepMeta[step - 1] ?? stepMeta[0];

  const selectedProductOption = PRODUCT_OPTIONS.find(
    (item) => item.value === product,
  );
  const selectedProductLabel =
    selectedProductOption?.title[siteLanguage] ?? product;
  const selectedStageLabel =
    COMPACT_STAGE_LABELS[readiness]?.[siteLanguage] ??
    STAGE_OPTIONS.find((item) => item.value === readiness)?.title[
      siteLanguage
    ] ??
    readiness;
  const selectedQuantityLabel =
    QUANTITY_PRESETS.find((item) => item.value === quantityPreset)?.label[
      siteLanguage
    ] ?? quantityPreset;

  return (
    <>
      <Suspense fallback={null}>
        <ProductBriefQuerySync onQueryProduct={handleQueryProduct} />
      </Suspense>

      {/* Persistent pre-mounted polite status region for screen-reader confirmation */}
      <div role="status" aria-live="polite" className="sr-only">
        {statusAnnouncement}
      </div>

      {submittedState ? (
        <div className="mx-auto max-w-[44rem]">
          <ProductBriefConfirmation
            formTopRef={formTopRef}
            headingRef={confirmationHeadingRef}
            isEs={isEs}
            recipientName={submittedState.recipientName}
            confirmationSent={submittedState.confirmationSent}
            localizeHref={localizeHref}
            onResetDraft={handleResetDraft}
          />
        </div>
      ) : (
        <div
          ref={formTopRef}
          className="mx-auto grid w-full max-w-[58rem] min-w-0 scroll-mt-0 gap-4"
        >
          {/* Single calm, symmetrical 3-column step tracker */}
          <div className="grid gap-3">
            <ol className="m-0 mx-auto grid w-full max-w-[30rem] list-none grid-cols-3 gap-3 p-0">
              {stepMeta.map((item) => {
                const isCurrent = step === item.num;
                const isComplete = step > item.num;
                const canJump =
                  item.num === 1 ||
                  (item.num === 2 && Boolean(product && readiness)) ||
                  (item.num === 3 && Boolean(product && readiness));

                return (
                  <li key={item.num} className="min-w-0">
                    <button
                      type="button"
                      disabled={!canJump || isSubmitting}
                      onClick={() => goToStep(item.num)}
                      aria-current={isCurrent ? "step" : undefined}
                      className={`grid min-h-[var(--tap-min)] w-full content-end gap-2 bg-transparent pb-1 text-center transition-colors ${
                        canJump && !isSubmitting
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                    >
                      <span
                        className={`num text-[length:var(--text-xs)] font-semibold ${
                          isCurrent
                            ? "text-[var(--color-forest-deep)]"
                            : isComplete
                              ? "text-[var(--color-clay-ink)]"
                              : "text-[var(--color-muted)]"
                        }`}
                      >
                        {item.num}. {item.shortLabel}
                      </span>
                      <span
                        aria-hidden="true"
                        className={`block h-[2.5px] w-full rounded-[var(--radius-pill)] transition-colors ${
                          isCurrent || isComplete
                            ? "bg-[var(--color-forest-deep)]"
                            : "bg-[var(--color-forest-deep)]/16"
                        }`}
                      />
                    </button>
                  </li>
                );
              })}
            </ol>

            <div className="grid justify-items-center gap-1 text-center">
              <h2
                ref={stepHeadingRef}
                tabIndex={-1}
                className="m-0 text-[length:var(--text-2xl)] leading-[1.16] font-normal text-[var(--color-forest-deep)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]"
              >
                {activeStepMeta.heading}
              </h2>
              {activeStepMeta.subtitle ? (
                <p className="m-0 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                  {activeStepMeta.subtitle}
                </p>
              ) : null}
            </div>

            {draftRestored ? (
              <div className="mx-auto flex flex-wrap items-center justify-center gap-3 text-[length:var(--text-xs)] text-[var(--color-muted)]">
                <span>
                  {isEs
                    ? "Borrador guardado."
                    : "Draft restored automatically."}
                </span>
                <button
                  type="button"
                  onClick={handleResetDraft}
                  className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-1 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
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
            className="grid min-w-0 gap-4"
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

            {/* STEP 1: Symmetrical 4-up visual craft cards + 4-up stage pills */}
            <div
              hidden={step !== 1}
              className={step === 1 ? "grid min-w-0 gap-5" : "hidden"}
            >
              <fieldset className="m-0 grid min-w-0 gap-2.5 border-0 p-0">
                <legend className="sr-only">
                  {isEs
                    ? "¿Qué te gustaría fabricar?"
                    : "What would you love to make?"}
                </legend>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
                  {PRODUCT_OPTIONS.map((option, idx) => {
                    const active = product === option.value;
                    return (
                      <button
                        key={option.value}
                        ref={idx === 0 ? firstProductButtonRef : undefined}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setProduct(option.value);
                          setIsError(false);
                          setMessage("");
                        }}
                        className="group grid min-h-[var(--tap-min)] cursor-pointer content-start gap-2 text-start text-[var(--color-forest-deep)] transition-colors"
                      >
                        <div
                          className={`editorial-photo-frame aspect-[4/3] w-full duration-[var(--dur-short)] motion-safe:transition-transform ${
                            active
                              ? "ring-2 ring-[var(--color-forest-deep)] ring-offset-2 ring-offset-[var(--color-dune)]"
                              : "motion-safe:group-hover:scale-[1.015]"
                          }`}
                        >
                          <Image
                            src={option.image}
                            alt=""
                            fill
                            sizes="(max-width: 48rem) 46vw, 220px"
                            className="object-cover"
                            style={{ objectPosition: option.imagePosition }}
                          />
                        </div>
                        <span className="flex items-center justify-between gap-2 px-0.5">
                          <span className="font-display text-[length:var(--text-md)] leading-snug font-normal text-[var(--color-forest-deep)] group-hover:text-[var(--color-clay-ink)]">
                            {option.title[siteLanguage]}
                          </span>
                          <CheckBadge active={active} />
                        </span>
                      </button>
                    );
                  })}
                </div>
                {selectedProductOption ? (
                  <p className="m-0 text-center text-[length:var(--text-xs)] text-[var(--color-muted)]">
                    <span className="font-semibold text-[var(--color-forest-deep)]">
                      {selectedProductOption.title[siteLanguage]}:
                    </span>{" "}
                    {selectedProductOption.hint[siteLanguage]}
                  </p>
                ) : null}
              </fieldset>

              <fieldset className="m-0 grid min-w-0 gap-2.5 border-0 p-0">
                <legend className="mb-0.5 w-full text-center text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
                  {isEs
                    ? "¿En qué punto estás ahora?"
                    : "Where are you right now?"}
                </legend>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                  {STAGE_OPTIONS.map((option, idx) => {
                    const active = readiness === option.value;
                    const shortTitle =
                      COMPACT_STAGE_LABELS[option.value]?.[siteLanguage] ??
                      option.title[siteLanguage];
                    return (
                      <button
                        key={option.value}
                        ref={idx === 0 ? firstStageButtonRef : undefined}
                        type="button"
                        aria-pressed={active}
                        onClick={() => {
                          setReadiness(option.value);
                          setIsError(false);
                          setMessage("");
                        }}
                        className={`flex min-h-[54px] cursor-pointer items-center justify-between gap-2 rounded-[var(--radius-input)] border px-3.5 py-2.5 text-start transition-colors ${
                          active
                            ? "border-[var(--color-forest-deep)] bg-[var(--color-pale-sage)] text-[var(--color-forest-deep)] ring-2 ring-[var(--color-forest-deep)]"
                            : "border-[var(--color-control-border)] bg-[var(--color-paper)]/85 text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-paper)]"
                        }`}
                      >
                        <span className="text-[length:var(--text-xs)] leading-snug font-semibold text-[var(--color-forest-deep)] sm:text-[length:var(--text-sm)]">
                          {shortTitle}
                        </span>
                        <CheckBadge active={active} />
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              <div className="flex justify-center pt-1">
                <button
                  type="submit"
                  className="primary-button-light min-w-[220px]"
                >
                  {isEs ? "Continuar" : "Continue"}
                </button>
              </div>
            </div>

            {/* STEP 2: Balanced 50/50 symmetrical layout (zero empty column voids) */}
            <div
              hidden={step !== 2}
              className={
                step === 2
                  ? "mx-auto grid w-full max-w-[50rem] min-w-0 gap-4"
                  : "hidden"
              }
            >
              <fieldset className="m-0 grid min-w-0 gap-2 border-0 p-0">
                <legend className="mb-0.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
                  {isEs
                    ? "Cantidad aproximada (opcional)"
                    : "Rough quantity (optional)"}
                </legend>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {QUANTITY_PRESETS.map((preset) => {
                    const active = quantityPreset === preset.value;
                    return (
                      <button
                        key={preset.value}
                        type="button"
                        aria-pressed={active}
                        onClick={() =>
                          setQuantityPreset(
                            quantityPreset === preset.value ? "" : preset.value,
                          )
                        }
                        className={`inline-flex min-h-[var(--tap-min)] w-full cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border px-3 py-2 text-[length:var(--text-xs)] font-semibold transition-colors ${
                          active
                            ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                            : "border-[var(--color-control-border)] bg-[var(--color-paper)]/85 text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-paper)]"
                        }`}
                      >
                        {preset.label[siteLanguage]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Exact 50/50 paired columns matching height */}
              <div className="grid min-w-0 items-stretch gap-5 md:grid-cols-2">
                <div className="atelier-field h-full min-w-0 grid-rows-[auto_1fr]">
                  <label htmlFor="brief-notes">
                    {isEs
                      ? "Notas del proyecto (opcional)"
                      : "Project notes (optional)"}
                  </label>
                  <textarea
                    id="brief-notes"
                    name="brief"
                    rows={5}
                    value={brief}
                    onChange={(event) => setBrief(event.target.value)}
                    disabled={isSubmitting}
                    className="atelier-textarea h-full min-h-[168px]"
                    placeholder={
                      isEs
                        ? "Materiales, colores, unidades concretas o fecha prevista de lanzamiento."
                        : "Materials, colours, exact quantities, or target launch season."
                    }
                  />
                </div>

                <div className="grid min-w-0 content-between gap-3.5">
                  <div className="grid gap-1.5">
                    <span
                      id="brief-files-label"
                      className="text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]"
                    >
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
                      aria-labelledby="brief-files-label brief-files-trigger"
                      aria-invalid={Boolean(fileError) || undefined}
                      aria-describedby={
                        fileError
                          ? "brief-files-hint brief-files-error"
                          : "brief-files-hint"
                      }
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
                      className={`flex min-h-[var(--control-height)] flex-wrap items-center justify-between gap-2 rounded-[var(--radius-input)] border border-dashed px-4 py-3 text-[length:var(--text-sm)] text-[var(--color-forest-deep)] transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--color-focus)] ${
                        isDraggingFiles
                          ? "border-[var(--color-forest-deep)] bg-[var(--color-pale-sage)]/55"
                          : isSubmitting ||
                              selectedFiles.length >= MAX_UPLOAD_FILES
                            ? "cursor-not-allowed border-[var(--color-control-border)] bg-[var(--color-paper)]/45 opacity-55"
                            : "cursor-pointer border-[var(--color-control-border)] bg-[var(--color-paper)]/85 hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-paper)]"
                      }`}
                    >
                      <span id="brief-files-trigger" className="font-medium">
                        {isEs
                          ? selectedFiles.length >= MAX_UPLOAD_FILES
                            ? "Límite de 3 archivos alcanzado"
                            : "Elegir o arrastrar archivos"
                          : selectedFiles.length >= MAX_UPLOAD_FILES
                            ? "Maximum 3 files attached"
                            : "Drop or choose files"}
                      </span>
                      <span className="num text-[length:var(--text-xs)] font-semibold text-[var(--color-muted)]">
                        {selectedFiles.length}/{MAX_UPLOAD_FILES}
                      </span>
                    </label>

                    <p
                      id="brief-files-hint"
                      className="m-0 text-[length:var(--text-xs)] text-[var(--color-muted)]"
                    >
                      {isEs
                        ? "JPG, PNG, WebP o PDF · Hasta 3 archivos, 4 MB por archivo"
                        : "JPG, PNG, WebP or PDF · Up to 3 files, 4 MB each"}
                    </p>

                    <p className="m-0 flex items-center gap-2 text-[length:var(--text-xs)] text-[var(--color-ink-2)]">
                      <svg
                        aria-hidden="true"
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="shrink-0 text-[var(--color-forest)]"
                      >
                        <rect
                          x="3.25"
                          y="7.25"
                          width="9.5"
                          height="6.5"
                          rx="1.75"
                        />
                        <path d="M5.5 7.25V5.25a2.5 2.5 0 0 1 5 0v2" />
                      </svg>
                      <span>
                        {isEs
                          ? "Solo Alma y Shirish ven tus archivos · Acuerdo NDA disponible."
                          : "Only Alma & Shirish see your files · Mutual NDA available."}
                      </span>
                    </p>

                    {fileError ? (
                      <p
                        id="brief-files-error"
                        role="alert"
                        className="m-0 text-[length:var(--text-xs)] font-medium text-[var(--color-clay-ink)]"
                      >
                        {fileError}
                      </p>
                    ) : null}

                    {selectedFiles.length > 0 ? (
                      <ul className="m-0 grid list-none gap-1.5 p-0">
                        {selectedFiles.map((file, index) => (
                          <li
                            key={`${file.name}-${file.size}-${index}`}
                            className="flex items-center justify-between gap-2 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)]/85 py-1 ps-3 pe-1 text-[length:var(--text-xs)] text-[var(--color-forest-deep)]"
                          >
                            <span className="min-w-0 [overflow-wrap:anywhere] break-words">
                              {file.name}{" "}
                              <span className="text-[var(--color-muted)]">
                                ({formatFileSize(file.size)})
                              </span>
                            </span>
                            <button
                              type="button"
                              disabled={isSubmitting}
                              onClick={() => handleRemoveFile(index)}
                              aria-label={
                                isEs
                                  ? `Quitar ${file.name}`
                                  : `Remove ${file.name}`
                              }
                              className="inline-flex min-h-[var(--tap-min)] shrink-0 cursor-pointer items-center px-2.5 font-semibold text-[var(--color-clay-ink)] underline underline-offset-4 hover:text-[var(--color-forest-deep)] disabled:cursor-not-allowed disabled:opacity-55"
                            >
                              {isEs ? "Quitar" : "Remove"}
                            </button>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>

                  <div className="atelier-field min-w-0">
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
                      aria-invalid={
                        Boolean(fieldErrors.referenceUrl) || undefined
                      }
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
                      onBlur={() => {
                        const normalized =
                          normalizeOptionalReferenceUrl(referenceUrl);
                        if (normalized !== referenceUrl) {
                          setReferenceUrl(normalized);
                        }
                      }}
                      disabled={isSubmitting}
                      className="atelier-input"
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
                        className="m-0 text-[length:var(--text-xs)] font-medium text-[var(--color-clay-ink)]"
                      >
                        {fieldErrors.referenceUrl}
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <button
                  type="button"
                  onClick={() => goToStep(1)}
                  className="secondary-button-light gap-2"
                >
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 3.5 5.5 8 10 12.5" />
                  </svg>
                  <span>{isEs ? "Atrás" : "Back"}</span>
                </button>
                <button type="submit" className="primary-button-light">
                  {isEs ? "Continuar" : "Continue"}
                </button>
              </div>
            </div>

            {/* STEP 3: Symmetrical centered 50/50 grid */}
            <div
              hidden={step !== 3}
              className={
                step === 3
                  ? "mx-auto grid w-full max-w-[46rem] min-w-0 gap-3"
                  : "hidden"
              }
            >
              {/* Compact centered recap strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)]/85 px-4 py-1 text-[length:var(--text-xs)]">
                <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[var(--color-forest-deep)]">
                  <span className="font-semibold">{selectedProductLabel}</span>
                  <span aria-hidden="true" className="text-[var(--color-clay)]">
                    ·
                  </span>
                  <span className="text-[var(--color-ink-2)]">
                    {selectedStageLabel}
                  </span>
                  {selectedQuantityLabel ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="text-[var(--color-clay)]"
                      >
                        ·
                      </span>
                      <span className="text-[var(--color-ink-2)]">
                        {selectedQuantityLabel}
                      </span>
                    </>
                  ) : null}
                  {selectedFiles.length > 0 ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="text-[var(--color-clay)]"
                      >
                        ·
                      </span>
                      <span className="text-[var(--color-ink-2)]">
                        {isEs
                          ? `${selectedFiles.length} ${selectedFiles.length === 1 ? "archivo" : "archivos"}`
                          : `${selectedFiles.length} ${selectedFiles.length === 1 ? "file" : "files"}`}
                      </span>
                    </>
                  ) : null}
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => goToStep(1)}
                    className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-1 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  >
                    {isEs ? "Editar producto" : "Edit product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => goToStep(2)}
                    className="inline-flex min-h-[var(--tap-min)] cursor-pointer items-center bg-transparent px-1 font-semibold text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                  >
                    {isEs ? "Editar detalles" : "Edit details"}
                  </button>
                </div>
              </div>

              {/* Row 1: 50/50 Name & Email */}
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="atelier-field min-w-0">
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
                        setFieldErrors((prev) => ({
                          ...prev,
                          name: undefined,
                        }));
                      }
                    }}
                    disabled={isSubmitting}
                    className="atelier-input"
                    placeholder={isEs ? "Ej. Lucía Navarro" : "e.g. Elena Ruiz"}
                  />
                  {fieldErrors.name ? (
                    <p
                      id="brief-name-error"
                      role="alert"
                      className="m-0 text-[length:var(--text-xs)] leading-snug font-medium text-[var(--color-clay-ink)]"
                    >
                      {fieldErrors.name}
                    </p>
                  ) : null}
                </div>
                <div className="atelier-field min-w-0">
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
                        setFieldErrors((prev) => ({
                          ...prev,
                          email: undefined,
                        }));
                      }
                    }}
                    disabled={isSubmitting}
                    className="atelier-input"
                    placeholder={isEs ? "tu@correo.com" : "you@example.com"}
                  />
                  {fieldErrors.email ? (
                    <p
                      id="brief-email-error"
                      role="alert"
                      className="m-0 text-[length:var(--text-xs)] leading-snug font-medium text-[var(--color-clay-ink)]"
                    >
                      {fieldErrors.email}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* Row 2: 50/50 Company & Reply language (matching 54px control height) */}
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="atelier-field min-w-0">
                  <label htmlFor="brief-company">
                    {isEs
                      ? "Empresa o tienda (opcional)"
                      : "Company or shop (optional)"}
                  </label>
                  <input
                    id="brief-company"
                    name="company"
                    autoComplete="organization"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                    disabled={isSubmitting}
                    className="atelier-input"
                    placeholder={
                      isEs
                        ? "Ej. Boutique Sol, Donostia"
                        : "e.g. Boutique Sol, Donostia"
                    }
                  />
                </div>

                <div className="atelier-field min-w-0">
                  <span className="text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
                    {isEs ? "Idioma de respuesta" : "Reply language"}
                  </span>
                  <div
                    role="group"
                    aria-label={
                      isEs ? "Idioma preferido" : "Preferred language"
                    }
                    className="grid min-h-[var(--control-height)] grid-cols-3 items-center gap-1 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)] p-1"
                  >
                    {(
                      [
                        { value: "Spanish" as const, label: "Español" },
                        { value: "English" as const, label: "English" },
                        { value: "Portuguese" as const, label: "Português" },
                      ] as const
                    ).map((langOption) => {
                      const active = replyLanguage === langOption.value;
                      return (
                        <button
                          key={langOption.value}
                          type="button"
                          aria-pressed={active}
                          disabled={isSubmitting}
                          onClick={() =>
                            setReplyLanguageOverride(langOption.value)
                          }
                          className={`min-h-[var(--tap-min)] cursor-pointer rounded-[calc(var(--radius-input)-4px)] px-2 text-[length:var(--text-xs)] font-semibold transition-colors ${
                            active
                              ? "bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                              : "bg-transparent text-[var(--color-forest-deep)] hover:bg-[var(--color-paper-2)]"
                          }`}
                        >
                          {langOption.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Row 3: 4 equal-width profile buttons */}
              <fieldset className="m-0 grid min-w-0 gap-1.5 border-0 p-0">
                <legend className="mb-0.5 text-[length:var(--text-sm)] font-semibold text-[var(--color-forest-deep)]">
                  {isEs
                    ? "¿Qué te describe mejor? (opcional)"
                    : "Which describes you best? (optional)"}
                </legend>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {PROFILE_OPTIONS.map((option) => {
                    const active = profile === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        aria-pressed={active}
                        disabled={isSubmitting}
                        onClick={() =>
                          setProfile(
                            profile === option.value ? "" : option.value,
                          )
                        }
                        className={`inline-flex min-h-[var(--tap-min)] w-full cursor-pointer items-center justify-center rounded-[var(--radius-pill)] border px-3 py-1.5 text-center text-[length:var(--text-xs)] font-semibold transition-colors ${
                          active
                            ? "border-[var(--color-forest-deep)] bg-[var(--color-forest-deep)] text-[var(--color-paper)]"
                            : "border-[var(--color-control-border)] bg-[var(--color-paper)]/85 text-[var(--color-forest-deep)] hover:border-[var(--color-forest-deep)] hover:bg-[var(--color-paper)]"
                        }`}
                      >
                        {option.label[siteLanguage]}
                      </button>
                    );
                  })}
                </div>
              </fieldset>

              {/* Row 4: Compact optional attribution question */}
              <div className="atelier-field min-w-0">
                <label htmlFor="brief-referral-source">
                  {isEs
                    ? "¿Cómo nos conociste? (opcional)"
                    : "How did you hear about us? (optional)"}
                </label>
                <input
                  id="brief-referral-source"
                  name="referralSource"
                  type="text"
                  list="brief-referral-suggestions"
                  maxLength={160}
                  disabled={isSubmitting}
                  value={referralSource}
                  onChange={(event) => setReferralSource(event.target.value)}
                  placeholder={
                    isEs
                      ? "Pódcast, boletín, LinkedIn, creadora o recomendación"
                      : "Podcast, newsletter, LinkedIn, creator, or word of mouth"
                  }
                  className="atelier-input"
                />
                <datalist id="brief-referral-suggestions">
                  {REFERRAL_SUGGESTIONS[siteLanguage].map((option) => (
                    <option key={option} value={option} />
                  ))}
                </datalist>
              </div>

              {step === 3 ? (
                <TurnstileField
                  onTokenChange={handleTurnstileTokenChange}
                  onError={handleTurnstileError}
                  language={siteLanguage}
                  resetSignal={turnstileResetSignal}
                  theme="light"
                />
              ) : null}

              <div className="flex flex-wrap items-center justify-between gap-4 pt-0.5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => goToStep(2)}
                  className="secondary-button-light gap-2"
                >
                  <svg
                    aria-hidden="true"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M10 3.5 5.5 8 10 12.5" />
                  </svg>
                  <span>{isEs ? "Atrás" : "Back"}</span>
                </button>
                <button
                  className="primary-button-light"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? isEs
                      ? "Enviando..."
                      : "Sending..."
                    : isEs
                      ? "Enviar mi briefing a Alma"
                      : "Send my brief to Alma"}
                </button>
              </div>
            </div>

            {/* Always-mounted live region for form errors and fallback mailto */}
            <div
              role={isError ? "alert" : "status"}
              aria-live={isError ? "assertive" : "polite"}
              className={
                message
                  ? isError
                    ? "mx-auto grid w-full max-w-[46rem] gap-1.5 rounded-[var(--radius-input)] border border-[var(--color-control-border)] bg-[var(--color-paper)] px-4 py-2.5 text-center text-[length:var(--text-sm)] font-medium text-[var(--color-clay-ink)]"
                    : "mx-auto grid w-full max-w-[46rem] gap-1.5 rounded-[var(--radius-input)] bg-[var(--color-pale-sage)]/55 px-4 py-2.5 text-center text-[length:var(--text-sm)] text-[var(--color-forest-deep)]"
                  : "sr-only"
              }
            >
              {message ? <p className="m-0">{message}</p> : null}
              {mailtoHref ? (
                <p className="m-0">
                  <a
                    className="inline-flex min-h-[var(--tap-min)] items-center font-semibold [overflow-wrap:anywhere] break-words text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={mailtoHref}
                  >
                    {isEs
                      ? `Abrir correo preparado para ${contactEmail}`
                      : `Open prepared email to ${contactEmail}`}
                  </a>
                </p>
              ) : null}
            </div>

            <p className="m-0 flex flex-wrap items-center justify-center gap-x-1 text-center text-[length:var(--text-xs)] leading-relaxed text-[var(--color-muted)]">
              {isEs ? (
                <>
                  <span>
                    Tus diseños siguen siendo de tu propiedad intelectual ·
                  </span>
                  <Link
                    className="inline-flex min-h-[var(--tap-min)] items-center font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={localizeHref("/terms#confidentiality")}
                  >
                    Condiciones
                  </Link>
                  <span>y</span>
                  <Link
                    className="inline-flex min-h-[var(--tap-min)] items-center font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={localizeHref("/privacy-policy")}
                  >
                    Privacidad
                  </Link>
                  <span>.</span>
                </>
              ) : (
                <>
                  <span>
                    Your designs stay your sole intellectual property ·
                  </span>
                  <Link
                    className="inline-flex min-h-[var(--tap-min)] items-center font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={localizeHref("/terms#confidentiality")}
                  >
                    Terms
                  </Link>
                  <span>and</span>
                  <Link
                    className="inline-flex min-h-[var(--tap-min)] items-center font-medium text-[var(--color-forest-deep)] underline decoration-[var(--color-clay)] underline-offset-4 hover:text-[var(--color-clay-ink)]"
                    href={localizeHref("/privacy-policy")}
                  >
                    Privacy
                  </Link>
                  <span>.</span>
                </>
              )}
            </p>
          </form>
        </div>
      )}
    </>
  );
}
