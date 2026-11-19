const CONTROL_CHARS_PRESERVING_WHITESPACE =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const DISALLOWED_EMAIL_CHARS = /[\u0000-\u001F\u007F\s]/;
const EMAIL_LOCAL_PATTERN = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+$/;
const DOMAIN_LABEL_PATTERN = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?$/;
const DOMAIN_TLD_PATTERN = /^(?:[A-Za-z]{2,63}|xn--[A-Za-z0-9-]{2,59})$/i;

export function readTrimmedString(
  value: unknown,
  maxLength = 2000,
  options?: { singleLine?: boolean },
): string {
  if (typeof value !== "string") {
    return "";
  }

  const normalized = value
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARS_PRESERVING_WHITESPACE, "");
  const collapsed = options?.singleLine
    ? normalized.replace(/[\n\t]+/g, " ")
    : normalized;

  return collapsed.trim().slice(0, maxLength);
}

export function isValidEmail(value: string): boolean {
  if (
    typeof value !== "string" ||
    value.length < 3 ||
    value.length > 320 ||
    DISALLOWED_EMAIL_CHARS.test(value)
  ) {
    return false;
  }

  const parts = value.split("@");
  if (parts.length !== 2) {
    return false;
  }

  const [local, domain] = parts;
  if (!local || !domain) {
    return false;
  }

  if (
    local.length > 64 ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..") ||
    !EMAIL_LOCAL_PATTERN.test(local)
  ) {
    return false;
  }

  if (
    domain.length < 3 ||
    domain.length > 255 ||
    domain.startsWith(".") ||
    domain.endsWith(".") ||
    domain.includes("..")
  ) {
    return false;
  }

  const labels = domain.split(".");
  if (labels.length < 2) {
    return false;
  }

  for (const label of labels) {
    if (!DOMAIN_LABEL_PATTERN.test(label)) {
      return false;
    }
  }

  const tld = labels[labels.length - 1];
  if (!tld || !DOMAIN_TLD_PATTERN.test(tld)) {
    return false;
  }

  return true;
}
