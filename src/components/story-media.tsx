import Image from "next/image";

import { MediaPlaceholder } from "@/components/media-placeholder";
import type { StoryImage } from "@/data/stories";

interface StoryMediaProps {
  image?: StoryImage;
  kind: "Photo" | "Video" | "Photo or video";
  ratio: string;
  aspectClass: string;
  title: string;
  description: string;
  sizes: string;
  priority?: boolean;
  showCaption?: boolean;
  figureNumber?: string;
  interactive?: boolean;
  variant?: "card" | "editorial";
  className?: string;
}

/** Renders a Sanity or local Story photograph with optional journal caption, or the editorial MediaPlaceholder otherwise. */
export function StoryMedia({
  image,
  kind,
  ratio,
  aspectClass,
  title,
  description,
  sizes,
  priority = false,
  showCaption = false,
  figureNumber,
  interactive = false,
  variant = "card",
  className = "",
}: StoryMediaProps) {
  if (image?.url) {
    const captionText = image.caption || description;
    const isEditorial = variant === "editorial";

    return (
      <figure className={`m-0 grid gap-3 ${className}`}>
        <div
          className={`relative overflow-hidden bg-[var(--color-paper-2)] ${
            isEditorial
              ? "rounded-none"
              : "rounded-[var(--radius-card)] border border-[var(--color-rule)]/70"
          } ${aspectClass}`}
        >
          <Image
            src={image.url}
            alt={image.alt || title}
            fill
            sizes={sizes}
            priority={priority}
            style={
              image.objectPosition
                ? { objectPosition: image.objectPosition }
                : undefined
            }
            className={`object-cover ${
              interactive
                ? "transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.03]"
                : ""
            }`}
          />
        </div>
        {showCaption && captionText ? (
          <figcaption
            className={`flex flex-wrap items-baseline justify-between gap-2 text-[length:var(--text-xs)] leading-[1.55] text-[var(--color-muted)] ${
              isEditorial
                ? "pt-0.5"
                : "border-b border-[var(--color-rule)]/70 pb-3"
            }`}
          >
            <span>{captionText}</span>
            {figureNumber ? (
              <span className="num shrink-0 font-semibold tracking-[0.06em] text-[var(--color-clay-ink)] uppercase">
                {figureNumber}
              </span>
            ) : null}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  return (
    <MediaPlaceholder
      kind={kind}
      ratio={ratio}
      aspectClass={aspectClass}
      tone="light"
      title={title}
      description={description}
      className={className}
    />
  );
}
