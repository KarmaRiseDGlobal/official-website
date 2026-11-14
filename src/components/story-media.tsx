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
}

/** Renders a Sanity Story image when present, or the editorial MediaPlaceholder otherwise. */
export function StoryMedia({
  image,
  kind,
  ratio,
  aspectClass,
  title,
  description,
  sizes,
  priority = false,
}: StoryMediaProps) {
  if (image?.url) {
    return (
      <div
        className={`relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)] ${aspectClass}`}
      >
        <Image
          src={image.url}
          alt={image.alt || title}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
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
    />
  );
}
