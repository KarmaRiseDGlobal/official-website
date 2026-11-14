const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function readTrimmedString(value: unknown, maxLength = 2000): string {
  if (typeof value !== "string") {
    return "";
  }
  return value.trim().slice(0, maxLength);
}

export function isValidEmail(value: string): boolean {
  return value.length <= 320 && EMAIL_PATTERN.test(value);
}
