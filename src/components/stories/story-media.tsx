import Image from "next/image";

import { MediaPlaceholder } from "@/components/stories/media-placeholder";
import type { StoryImage } from "@/data/story-types";

interface StoryMediaProps {
  image?: StoryImage;
  kind: "Photo" | "Video" | "Photo or video";
  ratio: string;
  aspectClass: string;
  title: string;
  description?: string;
  sizes: string;
  priority?: boolean;
  interactive?: boolean;
  variant?: "card" | "editorial";
  dark?: boolean;
  className?: string;
}

/** Renders a Sanity or local Story photograph, or a clean caption-free tonal placeholder when absent. */
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
  dark = false,
  className = "",
}: StoryMediaProps) {
  if (image?.url) {
    const frameClass = [
      "editorial-photo-frame",
      variant === "card" ? "editorial-photo-frame--nested" : "",
      dark ? "editorial-photo-frame--dark" : "",
      aspectClass,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <figure className={`m-0 ${className}`}>
        <div className={frameClass}>
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
            className={`story-media-img object-cover ${
              interactive
                ? "motion-safe:transition-transform motion-safe:duration-[var(--dur-slow)] motion-safe:ease-[var(--ease-out)] motion-safe:group-hover:scale-[1.03]"
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
      tone={dark ? "dark" : "light"}
      variant={variant}
      title={title}
      description={description}
      className={className}
    />
  );
}
