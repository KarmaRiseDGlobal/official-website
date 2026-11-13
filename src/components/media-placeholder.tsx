interface MediaPlaceholderProps {
  kind: "Photo" | "Video" | "Photo or video";
  ratio: string;
  aspectClass?: string;
  title: string;
  description: string;
  tone?: "light" | "dark" | "dune" | "sage";
  shape?: "card" | "arch";
  className?: string;
}

/**
 * Editorial placeholder frame reserved for unshot photography or video.
 */
export function MediaPlaceholder({
  kind,
  ratio,
  aspectClass = "aspect-[4/3]",
  title,
  description,
  tone = "light",
  shape = "card",
  className = "",
}: MediaPlaceholderProps) {
  const toneClasses = {
    light:
      "border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-forest-deep)]",
    dune: "border-[var(--color-rule-2)]/40 bg-[var(--color-paper)] text-[var(--color-forest-deep)]",
    sage: "border-[var(--color-forest)]/25 bg-[var(--color-paper)] text-[var(--color-forest-deep)]",
    dark: "border-[var(--color-paper)]/20 bg-[var(--color-night)]/45 text-[var(--color-paper)]",
  }[tone];

  const metaClass =
    tone === "dark"
      ? "text-[var(--color-clay-light)]"
      : "text-[var(--color-clay-ink)]";

  const bodyClass =
    tone === "dark"
      ? "text-[var(--color-paper-2)]"
      : "text-[var(--color-muted)]";

  const radiusClass =
    shape === "arch"
      ? "rounded-t-[16rem] rounded-b-[var(--radius-card)]"
      : "rounded-[var(--radius-card)]";

  return (
    <figure
      className={`m-0 flex flex-col justify-between border p-6 sm:p-8 ${aspectClass} ${radiusClass} ${toneClasses} ${className}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-current/15 pb-3 text-[length:var(--text-xs)] font-semibold tracking-[0.04em] uppercase">
        <span className={metaClass}>{kind}</span>
        <span className={bodyClass}>{ratio}</span>
      </div>

      <figcaption className="mt-auto grid gap-2 pt-6">
        <p className="font-[family-name:var(--font-display)] text-[length:var(--text-title)] leading-[1.15] font-medium">
          {title}
        </p>
        <p
          className={`max-w-[44ch] text-[length:var(--text-sm)] leading-[1.55] ${bodyClass}`}
        >
          {description}
        </p>
      </figcaption>
    </figure>
  );
}
