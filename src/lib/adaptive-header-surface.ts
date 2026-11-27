const LIGHT_SURFACE_MIN_LUMINANCE = 0.72;
const DEFAULT_BASE_RGB: readonly [number, number, number] = [242, 236, 223]; // --color-paper (#f2ecdf)

interface RgbaColor {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

interface GradientStop {
  readonly color: RgbaColor;
  readonly position: number | null;
}

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function splitTopLevelArgs(input: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];
    if (ch === "(") {
      depth += 1;
    } else if (ch === ")") {
      depth = Math.max(0, depth - 1);
    } else if (ch === "," && depth === 0) {
      parts.push(input.slice(start, i).trim());
      start = i + 1;
    }
  }

  const tail = input.slice(start).trim();
  if (tail.length > 0) {
    parts.push(tail);
  }
  return parts;
}

function decodeCssColor(
  ctx: CanvasRenderingContext2D,
  cssColor: string,
): RgbaColor | null {
  const trimmed = cssColor.trim();
  if (!trimmed || trimmed === "transparent" || trimmed === "none") {
    return null;
  }

  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fillStyle = trimmed;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  const a = (data[3] ?? 0) / 255;
  if (a <= 0.004) {
    return null;
  }

  return {
    r: data[0] ?? 0,
    g: data[1] ?? 0,
    b: data[2] ?? 0,
    a,
  };
}

function extractFirstLinearGradient(backgroundImage: string): string | null {
  const marker = "linear-gradient(";
  const start = backgroundImage.indexOf(marker);
  if (start === -1) {
    return null;
  }

  let depth = 0;
  const contentStart = start + marker.length;
  for (let i = contentStart; i < backgroundImage.length; i += 1) {
    const ch = backgroundImage[i];
    if (ch === "(") {
      depth += 1;
    } else if (ch === ")") {
      if (depth === 0) {
        return backgroundImage.slice(contentStart, i);
      }
      depth -= 1;
    }
  }

  return null;
}

function sampleVerticalGradient(
  ctx: CanvasRenderingContext2D,
  backgroundImage: string,
  localPercent: number,
): RgbaColor | null {
  const body = extractFirstLinearGradient(backgroundImage);
  if (!body) {
    return null;
  }

  const tokens = splitTopLevelArgs(body);
  if (tokens.length < 2) {
    return null;
  }

  let stopStartIndex = 0;
  let reverseDirection = false;
  const firstToken = tokens[0]?.toLowerCase() ?? "";

  if (
    firstToken.startsWith("to ") ||
    firstToken.endsWith("deg") ||
    firstToken.endsWith("turn") ||
    firstToken.endsWith("rad")
  ) {
    stopStartIndex = 1;
    if (firstToken === "to top" || firstToken === "0deg") {
      reverseDirection = true;
    } else if (
      firstToken !== "to bottom" &&
      firstToken !== "180deg" &&
      firstToken !== "0.5turn"
    ) {
      // Non-vertical gradients are skipped so horizontal decorations do not miscolor the bar
      return null;
    }
  }

  const rawStops: GradientStop[] = [];
  for (let i = stopStartIndex; i < tokens.length; i += 1) {
    const token = tokens[i] ?? "";
    const percentMatch = /\s+(-?\d+(?:\.\d+)?)%\s*$/.exec(token);
    const colorPart = percentMatch
      ? token.slice(0, percentMatch.index).trim()
      : token.trim();
    const color = decodeCssColor(ctx, colorPart);
    if (!color) {
      continue;
    }
    const position = percentMatch ? Number.parseFloat(percentMatch[1]!) : null;
    rawStops.push({
      color,
      position:
        position !== null && Number.isFinite(position) ? position : null,
    });
  }

  if (rawStops.length === 0) {
    return null;
  }

  const count = rawStops.length;
  const resolvedStops = rawStops.map((stop, idx) => ({
    color: stop.color,
    position: stop.position ?? (count === 1 ? 0 : (idx / (count - 1)) * 100),
  }));

  const targetPct = reverseDirection ? 100 - localPercent : localPercent;
  const firstStop = resolvedStops[0]!;
  const lastStop = resolvedStops[count - 1]!;

  if (targetPct <= firstStop.position) {
    return firstStop.color;
  }
  if (targetPct >= lastStop.position) {
    return lastStop.color;
  }

  for (let i = 0; i < count - 1; i += 1) {
    const a = resolvedStops[i]!;
    const b = resolvedStops[i + 1]!;
    if (targetPct >= a.position && targetPct <= b.position) {
      const span = Math.max(0.0001, b.position - a.position);
      const t = clamp01((targetPct - a.position) / span);
      return {
        r: a.color.r + (b.color.r - a.color.r) * t,
        g: a.color.g + (b.color.g - a.color.g) * t,
        b: a.color.b + (b.color.b - a.color.b) * t,
        a: a.color.a + (b.color.a - a.color.a) * t,
      };
    }
  }

  return lastStop.color;
}

function isIgnoredOverlay(element: Element): boolean {
  return (
    element.closest(
      ".site-header, .menu-panel, .page-transition, .chat-widget-anchor, .site-loader, .cookie-consent-banner",
    ) !== null
  );
}

/**
 * Samples the light page surface directly behind the scrolled header so the
 * bar blends smoothly across light surfaces (paper, dune, pale-sage, white,
 * and light gradients) while never adopting darker brand shades.
 */
export function resolveAdaptiveLightHeaderBg(
  headerEl: HTMLElement,
  ctx: CanvasRenderingContext2D,
): string | null {
  const headerRect = headerEl.getBoundingClientRect();
  const sampleY = Math.max(
    12,
    Math.min(
      window.innerHeight - 12,
      Math.round(headerRect.height * 0.5) || 28,
    ),
  );
  const sampleX = Math.max(
    8,
    Math.min(14, Math.round(window.innerWidth * 0.02)),
  );

  const elements = document.elementsFromPoint(sampleX, sampleY);
  const layers: RgbaColor[] = [];

  for (const el of elements) {
    if (!(el instanceof HTMLElement) || isIgnoredOverlay(el)) {
      continue;
    }

    const style = window.getComputedStyle(el);

    if (style.backgroundImage && style.backgroundImage !== "none") {
      const rect = el.getBoundingClientRect();
      const localPct =
        clamp01((sampleY - rect.top) / Math.max(1, rect.height)) * 100;
      const gradColor = sampleVerticalGradient(
        ctx,
        style.backgroundImage,
        localPct,
      );
      if (gradColor) {
        layers.push(gradColor);
        if (gradColor.a >= 0.99) {
          break;
        }
      }
    }

    const bgColor = decodeCssColor(ctx, style.backgroundColor);
    if (bgColor) {
      layers.push(bgColor);
      if (bgColor.a >= 0.99) {
        break;
      }
    }
  }

  if (layers.length === 0) {
    return null;
  }

  // Composite translucent layers from bottom to top over Warm Parchment base
  let r = DEFAULT_BASE_RGB[0];
  let g = DEFAULT_BASE_RGB[1];
  let b = DEFAULT_BASE_RGB[2];

  for (let i = layers.length - 1; i >= 0; i -= 1) {
    const layer = layers[i]!;
    r = layer.r * layer.a + r * (1 - layer.a);
    g = layer.g * layer.a + g * (1 - layer.a);
    b = layer.b * layer.a + b * (1 - layer.a);
  }

  const perceivedLuminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (perceivedLuminance < LIGHT_SURFACE_MIN_LUMINANCE) {
    // Never adopt dark shades; let CSS fall back cleanly to light Warm Parchment
    return null;
  }

  return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}
