import Image from "next/image";

import { MediaPlaceholder } from "@/components/stories/media-placeholder";
import type { StoryImage } from "@/data/story-types";

interface StoryMediaProps {
  image?: StoryImage;
  kind: "Photo" | "Video" | "Photo or video";
  ratio: string;
  aspectClass: string;
  title: string;
  description: string;
  sizes: string;
  priority?: boolean;
  interactive?: boolean;
  variant?: "card" | "editorial";
  className?: string;
}

/** Renders a Sanity or local Story photograph, or the editorial MediaPlaceholder when no image exists. */
export function StoryMedia({
  image,
  kind,
  ratio,
  aspectClass,
  title,
  description,
  sizes,
  priority = false,
  interactive = false,
  variant = "card",
  className = "",
}: StoryMediaProps) {
  if (image?.url) {
    const isEditorial = variant === "editorial";

    return (
      <figure className={`m-0 ${className}`}>
        <div
          className={`relative overflow-hidden bg-[var(--color-paper-2)] ${
            isEditorial
              ? "rounded-[var(--radius-input)]"
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
                ? "transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.03]"
                : ""
            }`}
          />
        </div>
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
