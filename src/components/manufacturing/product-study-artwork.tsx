import type { ProductStudyPillarId } from "@/data/manufacturing-content";
import type { SiteLanguage } from "@/lib/urls";

interface ProductStudyArtworkProps {
  readonly pillarId: ProductStudyPillarId;
  readonly language: SiteLanguage;
}

export function ProductStudyArtwork({
  pillarId,
  language,
}: ProductStudyArtworkProps) {
  const isEs = language === "es";

  switch (pillarId) {
    case "ergonomics-and-design":
      return (
        <div className="study-card-art study-card-art--ergonomics">
          <div className="study-card-metric">
            <span className="study-card-figure num">4</span>{" "}
            <span className="study-card-caption">
              {isEs
                ? "Líneas de boceto bastan para iniciar el estudio"
                : "Sketch lines are enough to start the study"}
            </span>
          </div>

          <svg
            aria-hidden="true"
            className="study-card-svg"
            viewBox="24 14 176 150"
            fill="none"
          >
            {/* Outer blueprint guide frame */}
            <line
              x1="18"
              y1="156"
              x2="202"
              y2="156"
              stroke="var(--color-rule-2)"
              strokeWidth="1"
              strokeDasharray="3 4"
            />
            {/* Strap drop dimension guide */}
            <line
              x1="44"
              y1="24"
              x2="44"
              y2="74"
              stroke="var(--color-clay)"
              strokeWidth="1.4"
            />
            <line
              x1="39"
              y1="24"
              x2="49"
              y2="24"
              stroke="var(--color-clay)"
              strokeWidth="1.4"
            />
            <line
              x1="39"
              y1="74"
              x2="49"
              y2="74"
              stroke="var(--color-clay)"
              strokeWidth="1.4"
            />
            {/* Curved shoulder strap arch echoing KarmaRise arch */}
            <path
              d="M78 74C78 38 96 22 118 22C140 22 158 38 158 74"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M88 74C88 46 101 34 118 34C135 34 148 46 148 74"
              stroke="var(--color-forest-deep)"
              strokeOpacity="0.45"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            {/* Tapered ergonomic bag silhouette */}
            <path
              d="M68 74H168L180 144C181 150 176 156 170 156H66C60 156 55 150 56 144L68 74Z"
              fill="var(--color-paper)"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            {/* Top YKK zipper seam + brass pull */}
            <line
              x1="74"
              y1="88"
              x2="162"
              y2="88"
              stroke="var(--color-clay)"
              strokeWidth="1.6"
              strokeDasharray="2.5 3.5"
              strokeLinecap="round"
            />
            <circle
              cx="154"
              cy="88"
              r="5"
              fill="var(--color-gold)"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.4"
            />
            {/* Interior light cotton lining pocket contour */}
            <rect
              x="86"
              y="104"
              width="64"
              height="34"
              rx="6"
              stroke="var(--color-forest-deep)"
              strokeOpacity="0.42"
              strokeWidth="1.4"
              strokeDasharray="4 4"
            />
            {/* Brass hardware rings */}
            <circle
              cx="78"
              cy="74"
              r="3.5"
              fill="var(--color-gold)"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.2"
            />
            <circle
              cx="158"
              cy="74"
              r="3.5"
              fill="var(--color-gold)"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.2"
            />
          </svg>
        </div>
      );

    case "material-and-cluster-feasibility":
      return (
        <div className="study-card-art study-card-art--hubs">
          <div className="study-card-metric">
            <span className="study-card-figure num">4+</span>{" "}
            <span className="study-card-caption">
              {isEs
                ? "Calcuta · Kanpur · Agra · Chennai, coordinados desde Maharashtra"
                : "Kolkata · Kanpur · Agra · Chennai, overseen from Maharashtra"}
            </span>
          </div>

          <svg
            aria-hidden="true"
            className="study-card-svg"
            viewBox="0 0 220 176"
            fill="none"
          >
            {/* Subtle concentric coordination rings */}
            <circle
              cx="84"
              cy="104"
              r="62"
              stroke="var(--color-forest-deep)"
              strokeOpacity="0.16"
              strokeWidth="1.2"
              strokeDasharray="3 5"
            />
            <circle
              cx="84"
              cy="104"
              r="34"
              stroke="var(--color-forest-deep)"
              strokeOpacity="0.22"
              strokeWidth="1.2"
            />
            {/* Curved logistics/supervision arcs from Maharashtra to 4 hubs */}
            <path
              d="M84 104Q110 56 146 34"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M84 104Q132 62 178 60"
              stroke="var(--color-clay-ink)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M84 104Q144 92 192 98"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M84 104Q124 134 156 148"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* 4 Specialist hub nodes */}
            <circle
              cx="146"
              cy="34"
              r="6"
              fill="var(--color-white)"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.6"
            />
            <circle
              cx="178"
              cy="60"
              r="6"
              fill="var(--color-white)"
              stroke="var(--color-clay-ink)"
              strokeWidth="1.6"
            />
            <circle
              cx="192"
              cy="98"
              r="6"
              fill="var(--color-white)"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.6"
            />
            <circle
              cx="156"
              cy="148"
              r="6"
              fill="var(--color-white)"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.6"
            />
            {/* Central Maharashtra supervision hub */}
            <circle cx="84" cy="104" r="11" fill="var(--color-forest-deep)" />
            <circle cx="84" cy="104" r="4.5" fill="var(--color-gold)" />
          </svg>
        </div>
      );

    case "written-brief-and-colour-swatch":
      return (
        <div className="study-card-art study-card-art--swatch">
          <div className="study-card-metric">
            <span className="study-card-figure num">1:1</span>{" "}
            <span className="study-card-caption">
              {isEs
                ? "Muestra física de color antes de teñir"
                : "Physical colour swatch before dyeing"}
            </span>
          </div>

          <svg
            aria-hidden="true"
            className="study-card-svg"
            viewBox="0 0 220 176"
            fill="none"
          >
            {/* Fanned physical leather & linen swatch deck */}
            <g transform="rotate(-26 102 134)">
              <rect
                x="86"
                y="28"
                width="62"
                height="122"
                rx="10"
                fill="var(--color-paper)"
                stroke="var(--color-night)"
                strokeOpacity="0.22"
                strokeWidth="1.2"
              />
            </g>
            <g transform="rotate(-10 102 134)">
              <rect
                x="86"
                y="28"
                width="62"
                height="122"
                rx="10"
                fill="var(--color-dune)"
                stroke="var(--color-night)"
                strokeOpacity="0.22"
                strokeWidth="1.2"
              />
            </g>
            <g transform="rotate(8 102 134)">
              <rect
                x="86"
                y="28"
                width="62"
                height="122"
                rx="10"
                fill="var(--color-clay)"
                stroke="var(--color-night)"
                strokeOpacity="0.26"
                strokeWidth="1.2"
              />
            </g>
            <g transform="rotate(26 102 134)">
              <rect
                x="86"
                y="28"
                width="62"
                height="122"
                rx="10"
                fill="var(--color-forest)"
                stroke="var(--color-paper)"
                strokeOpacity="0.35"
                strokeWidth="1.2"
              />
              {/* Fine stitch line along top leather swatch */}
              <rect
                x="93"
                y="35"
                width="48"
                height="108"
                rx="6"
                stroke="var(--color-paper)"
                strokeOpacity="0.4"
                strokeWidth="1.1"
                strokeDasharray="3 4"
              />
            </g>
            {/* Antique Brass binding rivet */}
            <circle
              cx="104"
              cy="132"
              r="9"
              fill="var(--color-gold)"
              stroke="var(--color-wood)"
              strokeWidth="2"
            />
            <circle cx="104" cy="132" r="3" fill="var(--color-wood)" />
          </svg>
        </div>
      );

    case "eu-presentation-and-compliance":
      return (
        <div className="study-card-art study-card-art--eu">
          <div className="study-card-metric">
            <span className="study-card-figure">{isEs ? "UE" : "EU"}</span>{" "}
            <span className="study-card-caption">
              {isEs
                ? "Etiquetado, presentación y aduanas listos"
                : "Labelling, packaging, and customs ready"}
            </span>
          </div>

          <svg
            aria-hidden="true"
            className="study-card-svg"
            viewBox="0 0 220 176"
            fill="none"
          >
            {/* Woven fabric brand & care label behind */}
            <rect
              x="28"
              y="54"
              width="86"
              height="96"
              rx="8"
              fill="var(--color-forest-lush)"
              stroke="var(--color-paper)"
              strokeOpacity="0.38"
              strokeWidth="1.4"
            />
            <line
              x1="36"
              y1="66"
              x2="106"
              y2="66"
              stroke="var(--color-clay-light)"
              strokeWidth="1.4"
              strokeDasharray="3 3"
            />
            <line
              x1="44"
              y1="92"
              x2="92"
              y2="92"
              stroke="var(--color-paper)"
              strokeOpacity="0.55"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="44"
              y1="106"
              x2="82"
              y2="106"
              stroke="var(--color-paper)"
              strokeOpacity="0.38"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="44"
              y1="120"
              x2="90"
              y2="120"
              stroke="var(--color-paper)"
              strokeOpacity="0.38"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Cotton cord loop */}
            <path
              d="M148 16C148 16 158 10 166 18C174 26 164 42 152 46"
              stroke="var(--color-gold)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            {/* Unbleached recycled cardboard care hangtag */}
            <rect
              x="104"
              y="36"
              width="86"
              height="122"
              rx="10"
              fill="var(--color-paper-2)"
              stroke="var(--color-paper)"
              strokeWidth="1.4"
            />
            {/* Brass eyelet */}
            <circle
              cx="147"
              cy="54"
              r="6"
              fill="var(--color-forest-deep)"
              stroke="var(--color-gold)"
              strokeWidth="2"
            />
            {/* Subtle triple-arch atelier stamp on hangtag */}
            <path
              d="M126 108C126 96.4 135.4 87 147 87C158.6 87 168 96.4 168 108"
              stroke="var(--color-forest-deep)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M133 108C133 100.3 139.3 94 147 94C154.7 94 161 100.3 161 108"
              stroke="var(--color-forest-deep)"
              strokeOpacity="0.65"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M140 108C140 104.1 143.1 101 147 101C150.9 101 154 104.1 154 108"
              stroke="var(--color-clay-ink)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="124"
              y1="126"
              x2="170"
              y2="126"
              stroke="var(--color-forest-deep)"
              strokeOpacity="0.45"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
            <line
              x1="132"
              y1="136"
              x2="162"
              y2="136"
              stroke="var(--color-forest-deep)"
              strokeOpacity="0.32"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );

    default: {
      const _exhaustive: never = pillarId;
      return _exhaustive;
    }
  }
}
