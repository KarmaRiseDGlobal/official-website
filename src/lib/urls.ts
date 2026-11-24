export type SiteLanguage = "en" | "es";

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://karmarisedglobal.com"
).replace(/\/$/, "");

function splitPathParts(input: string): {
  path: string;
  search: string;
  hash: string;
} {
  const hashIndex = input.indexOf("#");
  const hash = hashIndex >= 0 ? input.slice(hashIndex) : "";
  const beforeHash = hashIndex >= 0 ? input.slice(0, hashIndex) : input;

  const queryIndex = beforeHash.indexOf("?");
  const search = queryIndex >= 0 ? beforeHash.slice(queryIndex) : "";
  const path = queryIndex >= 0 ? beforeHash.slice(0, queryIndex) : beforeHash;

  return { path, search, hash };
}

function normalizeBasePath(rawPath: string): string {
  const trimmed = rawPath.trim();
  if (!trimmed) {
    return "/";
  }
  const withLeadingSlash = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  if (withLeadingSlash.length > 1) {
    return withLeadingSlash.replace(/\/+$/, "") || "/";
  }
  return withLeadingSlash;
}

export function stripLocalePrefix(pathname: string): string {
  const { path, search, hash } = splitPathParts(pathname);
  const normalized = normalizeBasePath(path);

  let stripped = normalized;
  if (normalized === "/es") {
    stripped = "/";
  } else if (normalized.startsWith("/es/")) {
    stripped = normalized.slice(3) || "/";
  }

  return `${stripped}${search}${hash}`;
}

export function localizePath(href: string, lang: SiteLanguage): string {
  const trimmed = href.trim();
  if (
    !trimmed ||
    trimmed.startsWith("#") ||
    /^(mailto:|tel:|https?:\/\/)/i.test(trimmed) ||
    trimmed === "/api" ||
    trimmed.startsWith("/api/")
  ) {
    return href;
  }

  const { path, search, hash } = splitPathParts(trimmed);
  const basePath = stripLocalePrefix(path);

  const localizedBase =
    lang === "es" ? (basePath === "/" ? "/es" : `/es${basePath}`) : basePath;

  return `${localizedBase}${search}${hash}`;
}
