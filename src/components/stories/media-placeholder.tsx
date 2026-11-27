interface MediaPlaceholderProps {
  kind?:
    "Photo" | "Video" | "Photo or video" | "Foto" | "Vídeo" | "Foto o vídeo";
  ratio?: string;
  aspectClass?: string;
  title?: string;
  description?: string;
  tone?: "light" | "dark" | "dune" | "sage";
  shape?: "card" | "arch";
  variant?: "card" | "editorial";
  className?: string;
}

/**
 * Caption-free warm tonal placeholder frame reserved for unshot or absent media.
 */
export function MediaPlaceholder({
  aspectClass = "aspect-[4/3]",
  tone = "light",
  shape = "card",
  variant = "editorial",
  className = "",
}: MediaPlaceholderProps) {
  const toneClasses = {
    light:
      "bg-[linear-gradient(160deg,var(--color-paper-2),var(--color-paper-3))]",
    dune: "bg-[linear-gradient(160deg,var(--color-paper),var(--color-paper-2))]",
    sage: "bg-[linear-gradient(160deg,var(--color-pale-sage),var(--color-paper))]",
    dark: "bg-[linear-gradient(160deg,var(--color-forest-deep),var(--color-night))]",
  }[tone];

  const radiusClass =
    shape === "arch"
      ? "rounded-t-[var(--radius-arch)] rounded-b-[var(--radius-card)]"
      : variant === "card"
        ? "editorial-photo-frame editorial-photo-frame--nested"
        : "editorial-photo-frame";

  return (
    <div
      aria-hidden="true"
      className={`w-full min-w-0 overflow-hidden ${aspectClass} ${radiusClass} ${toneClasses} ${className}`}
    />
  );
}
