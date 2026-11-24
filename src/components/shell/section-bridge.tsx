export type BridgeSurface =
  "paper" | "dune" | "pale-sage" | "forest-deep" | "wood" | "night";

interface SectionBridgeProps {
  from: BridgeSurface;
  to: BridgeSurface;
  size?: "default" | "gentle";
  className?: string;
}

const SURFACE_COLOR: Record<BridgeSurface, string> = {
  paper: "var(--color-paper)",
  dune: "var(--color-dune)",
  "pale-sage": "var(--color-pale-sage)",
  "forest-deep": "var(--color-forest-deep)",
  wood: "var(--color-wood)",
  night: "var(--color-night)",
};

const LIGHT_SURFACES = new Set<BridgeSurface>(["paper", "dune", "pale-sage"]);

// Calibrated 9-stop oklab S-curve blends over canonical surface tokens so
// high-contrast transitions melt smoothly without Mach-band creases or grey bands.
const BRIDGE_GRADIENTS: Partial<
  Record<`${BridgeSurface}->${BridgeSurface}`, string>
> = {
  "paper->forest-deep":
    "linear-gradient(180deg, var(--color-paper) 0%, color-mix(in oklab, var(--color-paper) 95%, var(--color-forest-deep)) 14%, color-mix(in oklab, var(--color-paper) 82%, var(--color-forest-deep)) 28%, color-mix(in oklab, var(--color-paper) 62%, var(--color-forest-deep)) 42%, color-mix(in oklab, var(--color-paper) 40%, var(--color-forest-deep)) 56%, color-mix(in oklab, var(--color-forest-deep) 80%, var(--color-paper)) 70%, color-mix(in oklab, var(--color-forest-deep) 94%, var(--color-paper)) 84%, color-mix(in oklab, var(--color-forest-deep) 98%, var(--color-paper)) 94%, var(--color-forest-deep) 100%)",
  "forest-deep->paper":
    "linear-gradient(180deg, var(--color-forest-deep) 0%, color-mix(in oklab, var(--color-forest-deep) 95%, var(--color-paper)) 14%, color-mix(in oklab, var(--color-forest-deep) 82%, var(--color-paper)) 28%, color-mix(in oklab, var(--color-forest-deep) 62%, var(--color-paper)) 42%, color-mix(in oklab, var(--color-forest-deep) 40%, var(--color-paper)) 56%, color-mix(in oklab, var(--color-paper) 80%, var(--color-forest-deep)) 70%, color-mix(in oklab, var(--color-paper) 94%, var(--color-forest-deep)) 84%, color-mix(in oklab, var(--color-paper) 98%, var(--color-forest-deep)) 94%, var(--color-paper) 100%)",
  "paper->night":
    "linear-gradient(180deg, var(--color-paper) 0%, color-mix(in oklab, var(--color-paper) 95%, var(--color-forest-deep)) 14%, color-mix(in oklab, var(--color-paper) 82%, var(--color-forest-deep)) 28%, color-mix(in oklab, var(--color-paper) 60%, var(--color-forest-deep)) 42%, color-mix(in oklab, var(--color-paper) 36%, var(--color-forest-deep)) 56%, color-mix(in oklab, var(--color-forest-deep) 82%, var(--color-paper)) 70%, color-mix(in oklab, var(--color-night) 78%, var(--color-forest-deep)) 84%, color-mix(in oklab, var(--color-night) 96%, var(--color-forest-deep)) 94%, var(--color-night) 100%)",
  "night->paper":
    "linear-gradient(180deg, var(--color-night) 0%, color-mix(in oklab, var(--color-night) 72%, var(--color-forest-deep)) 14%, color-mix(in oklab, var(--color-forest-deep) 92%, var(--color-paper)) 28%, color-mix(in oklab, var(--color-forest-deep) 68%, var(--color-paper)) 42%, color-mix(in oklab, var(--color-forest-deep) 42%, var(--color-paper)) 56%, color-mix(in oklab, var(--color-paper) 78%, var(--color-forest-deep)) 70%, color-mix(in oklab, var(--color-paper) 93%, var(--color-forest-deep)) 84%, color-mix(in oklab, var(--color-paper) 98%, var(--color-forest-deep)) 94%, var(--color-paper) 100%)",
  "dune->forest-deep":
    "linear-gradient(180deg, var(--color-dune) 0%, color-mix(in oklab, var(--color-dune) 95%, var(--color-forest-deep)) 14%, color-mix(in oklab, var(--color-dune) 82%, var(--color-forest-deep)) 28%, color-mix(in oklab, var(--color-dune) 62%, var(--color-forest-deep)) 42%, color-mix(in oklab, var(--color-dune) 40%, var(--color-forest-deep)) 56%, color-mix(in oklab, var(--color-forest-deep) 80%, var(--color-dune)) 70%, color-mix(in oklab, var(--color-forest-deep) 94%, var(--color-dune)) 84%, color-mix(in oklab, var(--color-forest-deep) 98%, var(--color-dune)) 94%, var(--color-forest-deep) 100%)",
  "forest-deep->dune":
    "linear-gradient(180deg, var(--color-forest-deep) 0%, color-mix(in oklab, var(--color-forest-deep) 95%, var(--color-dune)) 14%, color-mix(in oklab, var(--color-forest-deep) 82%, var(--color-dune)) 28%, color-mix(in oklab, var(--color-forest-deep) 62%, var(--color-dune)) 42%, color-mix(in oklab, var(--color-forest-deep) 40%, var(--color-dune)) 56%, color-mix(in oklab, var(--color-dune) 80%, var(--color-forest-deep)) 70%, color-mix(in oklab, var(--color-dune) 94%, var(--color-forest-deep)) 84%, color-mix(in oklab, var(--color-dune) 98%, var(--color-forest-deep)) 94%, var(--color-dune) 100%)",
  "dune->night":
    "linear-gradient(180deg, var(--color-dune) 0%, color-mix(in oklab, var(--color-dune) 95%, var(--color-forest-deep)) 14%, color-mix(in oklab, var(--color-dune) 82%, var(--color-forest-deep)) 28%, color-mix(in oklab, var(--color-dune) 60%, var(--color-forest-deep)) 42%, color-mix(in oklab, var(--color-dune) 36%, var(--color-forest-deep)) 56%, color-mix(in oklab, var(--color-forest-deep) 82%, var(--color-dune)) 70%, color-mix(in oklab, var(--color-night) 78%, var(--color-forest-deep)) 84%, color-mix(in oklab, var(--color-night) 96%, var(--color-forest-deep)) 94%, var(--color-night) 100%)",
  "night->dune":
    "linear-gradient(180deg, var(--color-night) 0%, color-mix(in oklab, var(--color-night) 72%, var(--color-forest-deep)) 14%, color-mix(in oklab, var(--color-forest-deep) 92%, var(--color-dune)) 28%, color-mix(in oklab, var(--color-forest-deep) 68%, var(--color-dune)) 42%, color-mix(in oklab, var(--color-forest-deep) 42%, var(--color-dune)) 56%, color-mix(in oklab, var(--color-dune) 78%, var(--color-forest-deep)) 70%, color-mix(in oklab, var(--color-dune) 93%, var(--color-forest-deep)) 84%, color-mix(in oklab, var(--color-dune) 98%, var(--color-forest-deep)) 94%, var(--color-dune) 100%)",
  "pale-sage->forest-deep":
    "linear-gradient(180deg, var(--color-pale-sage) 0%, color-mix(in oklab, var(--color-pale-sage) 95%, var(--color-forest-deep)) 14%, color-mix(in oklab, var(--color-pale-sage) 82%, var(--color-forest-deep)) 28%, color-mix(in oklab, var(--color-pale-sage) 62%, var(--color-forest-deep)) 42%, color-mix(in oklab, var(--color-pale-sage) 40%, var(--color-forest-deep)) 56%, color-mix(in oklab, var(--color-forest-deep) 80%, var(--color-pale-sage)) 70%, color-mix(in oklab, var(--color-forest-deep) 94%, var(--color-pale-sage)) 84%, color-mix(in oklab, var(--color-forest-deep) 98%, var(--color-pale-sage)) 94%, var(--color-forest-deep) 100%)",
  "forest-deep->pale-sage":
    "linear-gradient(180deg, var(--color-forest-deep) 0%, color-mix(in oklab, var(--color-forest-deep) 95%, var(--color-pale-sage)) 14%, color-mix(in oklab, var(--color-forest-deep) 82%, var(--color-pale-sage)) 28%, color-mix(in oklab, var(--color-forest-deep) 62%, var(--color-pale-sage)) 42%, color-mix(in oklab, var(--color-forest-deep) 40%, var(--color-pale-sage)) 56%, color-mix(in oklab, var(--color-pale-sage) 80%, var(--color-forest-deep)) 70%, color-mix(in oklab, var(--color-pale-sage) 94%, var(--color-forest-deep)) 84%, color-mix(in oklab, var(--color-pale-sage) 98%, var(--color-forest-deep)) 94%, var(--color-pale-sage) 100%)",
  "pale-sage->night":
    "linear-gradient(180deg, var(--color-pale-sage) 0%, color-mix(in oklab, var(--color-pale-sage) 95%, var(--color-forest-deep)) 14%, color-mix(in oklab, var(--color-pale-sage) 82%, var(--color-forest-deep)) 28%, color-mix(in oklab, var(--color-pale-sage) 60%, var(--color-forest-deep)) 42%, color-mix(in oklab, var(--color-pale-sage) 36%, var(--color-forest-deep)) 56%, color-mix(in oklab, var(--color-forest-deep) 82%, var(--color-pale-sage)) 70%, color-mix(in oklab, var(--color-night) 78%, var(--color-forest-deep)) 84%, color-mix(in oklab, var(--color-night) 96%, var(--color-forest-deep)) 94%, var(--color-night) 100%)",
  "night->pale-sage":
    "linear-gradient(180deg, var(--color-night) 0%, color-mix(in oklab, var(--color-night) 72%, var(--color-forest-deep)) 14%, color-mix(in oklab, var(--color-forest-deep) 92%, var(--color-pale-sage)) 28%, color-mix(in oklab, var(--color-forest-deep) 68%, var(--color-pale-sage)) 42%, color-mix(in oklab, var(--color-forest-deep) 42%, var(--color-pale-sage)) 56%, color-mix(in oklab, var(--color-pale-sage) 78%, var(--color-forest-deep)) 70%, color-mix(in oklab, var(--color-pale-sage) 93%, var(--color-forest-deep)) 84%, color-mix(in oklab, var(--color-pale-sage) 98%, var(--color-forest-deep)) 94%, var(--color-pale-sage) 100%)",
  "paper->wood":
    "linear-gradient(180deg, var(--color-paper) 0%, color-mix(in oklab, var(--color-paper) 74%, var(--color-dune)) 14%, color-mix(in oklab, var(--color-dune) 88%, var(--color-wood)) 28%, color-mix(in oklab, var(--color-dune) 64%, var(--color-wood)) 42%, color-mix(in oklab, var(--color-dune) 40%, var(--color-wood)) 56%, color-mix(in oklab, var(--color-wood) 80%, var(--color-dune)) 70%, color-mix(in oklab, var(--color-wood) 93%, var(--color-dune)) 84%, color-mix(in oklab, var(--color-wood) 98%, var(--color-dune)) 94%, var(--color-wood) 100%)",
  "wood->paper":
    "linear-gradient(180deg, var(--color-wood) 0%, color-mix(in oklab, var(--color-wood) 95%, var(--color-dune)) 14%, color-mix(in oklab, var(--color-wood) 82%, var(--color-dune)) 28%, color-mix(in oklab, var(--color-wood) 60%, var(--color-dune)) 42%, color-mix(in oklab, var(--color-wood) 36%, var(--color-dune)) 56%, color-mix(in oklab, var(--color-dune) 84%, var(--color-wood)) 70%, color-mix(in oklab, var(--color-paper) 76%, var(--color-dune)) 84%, color-mix(in oklab, var(--color-paper) 95%, var(--color-dune)) 94%, var(--color-paper) 100%)",
  "dune->wood":
    "linear-gradient(180deg, var(--color-dune) 0%, color-mix(in oklab, var(--color-dune) 95%, var(--color-wood)) 14%, color-mix(in oklab, var(--color-dune) 82%, var(--color-wood)) 28%, color-mix(in oklab, var(--color-dune) 62%, var(--color-wood)) 42%, color-mix(in oklab, var(--color-dune) 40%, var(--color-wood)) 56%, color-mix(in oklab, var(--color-wood) 80%, var(--color-dune)) 70%, color-mix(in oklab, var(--color-wood) 94%, var(--color-dune)) 84%, color-mix(in oklab, var(--color-wood) 98%, var(--color-dune)) 94%, var(--color-wood) 100%)",
  "wood->dune":
    "linear-gradient(180deg, var(--color-wood) 0%, color-mix(in oklab, var(--color-wood) 95%, var(--color-dune)) 14%, color-mix(in oklab, var(--color-wood) 82%, var(--color-dune)) 28%, color-mix(in oklab, var(--color-wood) 62%, var(--color-dune)) 42%, color-mix(in oklab, var(--color-wood) 40%, var(--color-dune)) 56%, color-mix(in oklab, var(--color-dune) 80%, var(--color-wood)) 70%, color-mix(in oklab, var(--color-dune) 94%, var(--color-wood)) 84%, color-mix(in oklab, var(--color-dune) 98%, var(--color-wood)) 94%, var(--color-dune) 100%)",
  "pale-sage->wood":
    "linear-gradient(180deg, var(--color-pale-sage) 0%, color-mix(in oklab, var(--color-pale-sage) 95%, var(--color-wood)) 14%, color-mix(in oklab, var(--color-pale-sage) 82%, var(--color-wood)) 28%, color-mix(in oklab, var(--color-pale-sage) 62%, var(--color-wood)) 42%, color-mix(in oklab, var(--color-pale-sage) 40%, var(--color-wood)) 56%, color-mix(in oklab, var(--color-wood) 80%, var(--color-pale-sage)) 70%, color-mix(in oklab, var(--color-wood) 94%, var(--color-pale-sage)) 84%, color-mix(in oklab, var(--color-wood) 98%, var(--color-pale-sage)) 94%, var(--color-wood) 100%)",
  "wood->pale-sage":
    "linear-gradient(180deg, var(--color-wood) 0%, color-mix(in oklab, var(--color-wood) 95%, var(--color-pale-sage)) 14%, color-mix(in oklab, var(--color-wood) 82%, var(--color-pale-sage)) 28%, color-mix(in oklab, var(--color-wood) 62%, var(--color-pale-sage)) 42%, color-mix(in oklab, var(--color-wood) 40%, var(--color-pale-sage)) 56%, color-mix(in oklab, var(--color-pale-sage) 80%, var(--color-wood)) 70%, color-mix(in oklab, var(--color-pale-sage) 94%, var(--color-wood)) 84%, color-mix(in oklab, var(--color-pale-sage) 98%, var(--color-wood)) 94%, var(--color-pale-sage) 100%)",
  "forest-deep->wood":
    "linear-gradient(180deg, var(--color-forest-deep) 0%, color-mix(in oklab, var(--color-forest-deep) 95%, var(--color-wood)) 14%, color-mix(in oklab, var(--color-forest-deep) 82%, var(--color-wood)) 28%, color-mix(in oklab, var(--color-forest-deep) 62%, var(--color-wood)) 42%, color-mix(in oklab, var(--color-forest-deep) 40%, var(--color-wood)) 56%, color-mix(in oklab, var(--color-wood) 80%, var(--color-forest-deep)) 70%, color-mix(in oklab, var(--color-wood) 94%, var(--color-forest-deep)) 84%, color-mix(in oklab, var(--color-wood) 98%, var(--color-forest-deep)) 94%, var(--color-wood) 100%)",
  "wood->night":
    "linear-gradient(180deg, var(--color-wood) 0%, color-mix(in oklab, var(--color-wood) 48%, var(--color-night)) 55%, var(--color-night) 100%)",
  "forest-deep->night":
    "linear-gradient(180deg, var(--color-forest-deep) 0%, var(--color-night) 100%)",
};

/**
 * Non-destructive gradient seam that blends two adjacent section surfaces
 * cleanly without altering either section's own background color.
 */
export function SectionBridge({
  from,
  to,
  size = "default",
  className = "",
}: SectionBridgeProps) {
  if (from === to) {
    return null;
  }

  const key = `${from}->${to}` as const;
  const gradient =
    BRIDGE_GRADIENTS[key] ??
    `linear-gradient(180deg, ${SURFACE_COLOR[from]} 0%, ${SURFACE_COLOR[to]} 100%)`;

  const isHighContrast = LIGHT_SURFACES.has(from) !== LIGHT_SURFACES.has(to);
  const heightClass =
    size === "gentle"
      ? "h-[clamp(128px,22svh,240px)]"
      : isHighContrast
        ? "h-[clamp(72px,12svh,168px)]"
        : "h-[clamp(56px,8svh,104px)]";

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative z-[var(--z-base)] -my-px w-full select-none ${heightClass} ${className}`}
      style={{ background: gradient }}
    />
  );
}
