interface ImageLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

const SANITY_CDN_PREFIX = "https://cdn.sanity.io/images/";

export default function karmariseImageLoader({
  src,
  width,
  quality,
}: ImageLoaderParams): string {
  if (src.startsWith(SANITY_CDN_PREFIX)) {
    try {
      const parsed = new URL(src);
      parsed.searchParams.set("w", String(width));
      parsed.searchParams.set("q", String(quality ?? 78));
      parsed.searchParams.set("auto", "format");
      parsed.searchParams.set("fit", "max");
      return parsed.toString();
    } catch {
      return src;
    }
  }

  return src;
}
