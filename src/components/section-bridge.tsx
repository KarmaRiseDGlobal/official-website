export type BridgeSurface =
  "paper" | "dune" | "pale-sage" | "forest-deep" | "wood" | "night";

interface SectionBridgeProps {
  from: BridgeSurface;
  to: BridgeSurface;
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

// Calibrated multi-stop blends so high-contrast transitions pass through organic
// intermediate tones (mirroring the homepage .ownership dissolve) without turning grey.
const BRIDGE_GRADIENTS: Partial<
  Record<`${BridgeSurface}->${BridgeSurface}`, string>
> = {
  "paper->forest-deep":
    "linear-gradient(180deg, var(--color-paper) 0%, var(--color-dune) 28%, var(--color-pale-sage) 52%, #5a725e 78%, var(--color-forest-deep) 100%)",
  "forest-deep->paper":
    "linear-gradient(180deg, var(--color-forest-deep) 0%, #5a725e 22%, var(--color-pale-sage) 48%, var(--color-dune) 72%, var(--color-paper) 100%)",
  "paper->night":
    "linear-gradient(180deg, var(--color-paper) 0%, var(--color-dune) 24%, #8e917e 50%, var(--color-forest-deep) 76%, var(--color-night) 94%, var(--color-night) 100%)",
  "dune->forest-deep":
    "linear-gradient(180deg, var(--color-dune) 0%, var(--color-pale-sage) 36%, #5a725e 70%, var(--color-forest-deep) 100%)",
  "dune->night":
    "linear-gradient(180deg, var(--color-dune) 0%, #a8a18c 28%, #4d5948 56%, var(--color-forest-deep) 76%, var(--color-night) 94%, var(--color-night) 100%)",
  "pale-sage->forest-deep":
    "linear-gradient(180deg, var(--color-pale-sage) 0%, #8da08c 34%, #3d5943 70%, var(--color-forest-deep) 100%)",
  "forest-deep->pale-sage":
    "linear-gradient(180deg, var(--color-forest-deep) 0%, #3d5943 30%, #8da08c 66%, var(--color-pale-sage) 100%)",
  "pale-sage->night":
    "linear-gradient(180deg, var(--color-pale-sage) 0%, #7d917c 28%, #344d39 54%, var(--color-forest-deep) 74%, var(--color-night) 94%, var(--color-night) 100%)",
  "night->pale-sage":
    "linear-gradient(180deg, var(--color-night) 0%, var(--color-forest-deep) 18%, #344d39 40%, #7d917c 72%, var(--color-pale-sage) 100%)",
  "paper->wood":
    "linear-gradient(180deg, var(--color-paper) 0%, var(--color-dune) 28%, #b9a48d 56%, #7d6253 80%, var(--color-wood) 100%)",
  "wood->paper":
    "linear-gradient(180deg, var(--color-wood) 0%, #7d6253 20%, #b9a48d 44%, var(--color-dune) 72%, var(--color-paper) 100%)",
  "pale-sage->wood":
    "linear-gradient(180deg, var(--color-pale-sage) 0%, #c8c5b8 28%, #978373 58%, #6c5046 82%, var(--color-wood) 100%)",
  "wood->pale-sage":
    "linear-gradient(180deg, var(--color-wood) 0%, #6c5046 18%, #978373 42%, #c8c5b8 72%, var(--color-pale-sage) 100%)",
  "forest-deep->wood":
    "linear-gradient(180deg, var(--color-forest-deep) 0%, #2d3027 50%, var(--color-wood) 100%)",
  "wood->night":
    "linear-gradient(180deg, var(--color-wood) 0%, #2c221d 55%, var(--color-night) 100%)",
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

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none relative z-[1] -my-px w-full select-none ${
        isHighContrast
          ? "h-[clamp(72px,12svh,168px)]"
          : "h-[clamp(56px,8svh,104px)]"
      } ${className}`}
      style={{ background: gradient }}
    />
  );
}
