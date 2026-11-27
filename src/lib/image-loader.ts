import { LOCAL_IMAGE_VARIANTS } from "@/lib/local-image-variants";

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

  const variantSet = LOCAL_IMAGE_VARIANTS[src];
  if (variantSet) {
    const selectedWidth =
      variantSet.widths.find((candidate) => candidate >= width) ??
      variantSet.widths[variantSet.widths.length - 1];
    if (selectedWidth !== undefined) {
      return `${variantSet.basePath}-w${selectedWidth}.webp`;
    }
  }

  return src;
}
