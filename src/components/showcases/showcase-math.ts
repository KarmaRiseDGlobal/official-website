import { HOME_WORKING_PRINCIPLES } from "@/data/home-content";

// Timeline progress landmarks (0.00 -> 1.00)
// Act I carries the 4 Spain/Europe-to-India coordination steps; immediately after
// Card 04's reading breath, a single continuous horizontal pan glides directly
// into the focused enquiry stage on Raw Wood.
export const ACT1_END = 0.64;
export const PAN_END = 0.88;
export const ENQUIRE_STOP_PROGRESS = 0.94;

export interface StepPacingWeights {
  readonly startDwell: number;
  readonly midDwell: number;
  readonly endDwell: number;
  readonly transition: number;
}

export const ACT1_PACING: StepPacingWeights = {
  // Card 1 is already visible as the section pins; Card 4 gets a crisp reading
  // breath before the continuous horizontal pan begins with zero dead zone.
  startDwell: 0.18,
  midDwell: 0.34,
  endDwell: 0.28,
  transition: 1,
};

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function smoothstep(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

function getDwellWeight(
  index: number,
  steps: number,
  weights: StepPacingWeights,
): number {
  if (index <= 0) return weights.startDwell;
  if (index >= steps - 1) return weights.endDwell;
  return weights.midDwell;
}

function getTotalWeight(steps: number, weights: StepPacingWeights): number {
  if (steps <= 1) return Math.max(1, weights.startDwell);
  const middleCount = Math.max(0, steps - 2);
  return (
    weights.startDwell +
    middleCount * weights.midDwell +
    weights.endDwell +
    (steps - 1) * weights.transition
  );
}

/**
 * Maps normalized progress t in [0, 1] across `steps` items (0 .. steps-1)
 * with brief resting plateaus and LINEAR transition ramps between them.
 *
 * Keeping the ramp linear here ensures downstream geometry applies easing
 * exactly once (no double-smoothstep velocity spike or dead-zone feeling).
 */
export function getSteppedProgress(
  t: number,
  steps: number,
  weights: StepPacingWeights = ACT1_PACING,
): number {
  if (steps <= 1) return 0;
  const clamped = Math.max(0, Math.min(1, t));
  const totalWeight = getTotalWeight(steps, weights);
  const targetWeight = clamped * totalWeight;

  let cursor = 0;
  for (let i = 0; i < steps - 1; i += 1) {
    const dwellW = getDwellWeight(i, steps, weights);
    const dwellEnd = cursor + dwellW;
    if (targetWeight <= dwellEnd) {
      return i;
    }

    const transEnd = dwellEnd + weights.transition;
    if (targetWeight <= transEnd) {
      return i + (targetWeight - dwellEnd) / weights.transition;
    }

    cursor = transEnd;
  }

  return steps - 1;
}

/**
 * Returns the center progress [0, 1] of the plateau for item `index` out of `steps`.
 */
export function getPlateauCenterProgress(
  index: number,
  steps: number,
  weights: StepPacingWeights = ACT1_PACING,
): number {
  if (steps <= 1) return 0;
  const clampedIdx = Math.max(0, Math.min(steps - 1, index));
  const totalWeight = getTotalWeight(steps, weights);

  let cursor = 0;
  for (let i = 0; i < clampedIdx; i += 1) {
    cursor += getDwellWeight(i, steps, weights) + weights.transition;
  }

  const ownDwell = getDwellWeight(clampedIdx, steps, weights);
  return (cursor + ownDwell * 0.5) / totalWeight;
}

export const STOP_PROGRESS: readonly number[] = [
  ...Array.from(
    { length: HOME_WORKING_PRINCIPLES.length },
    (_, i) =>
      getPlateauCenterProgress(i, HOME_WORKING_PRINCIPLES.length, ACT1_PACING) *
      ACT1_END,
  ),
  ENQUIRE_STOP_PROGRESS,
];

function chooseDirectionalStep(
  continuousIdx: number,
  direction: number,
  maxIdx: number,
): number {
  const lower = Math.floor(continuousIdx);
  const frac = continuousIdx - lower;
  const threshold = direction > 0 ? 0.36 : direction < 0 ? 0.64 : 0.5;
  const target = frac >= threshold ? lower + 1 : lower;
  return Math.max(0, Math.min(maxIdx, target));
}

/**
 * Computes a gentle idle settle target ONLY when the user comes to a full stop
 * partway through a card morph or the horizontal pan into Enquiry. Returns null
 * when already resting on a card plateau, on the enquiry plateau, or near
 * section entry/exit boundaries.
 */
export function getNearestSettleProgress(
  progress: number,
  direction: number,
): number | null {
  if (progress <= 0.015 || progress >= 0.905) {
    return null;
  }

  if (progress <= ACT1_END) {
    const cardIdx = getSteppedProgress(
      progress / ACT1_END,
      HOME_WORKING_PRINCIPLES.length,
      ACT1_PACING,
    );
    if (Math.abs(cardIdx - Math.round(cardIdx)) < 0.08) {
      return null;
    }
    const targetCard = chooseDirectionalStep(
      cardIdx,
      direction,
      HOME_WORKING_PRINCIPLES.length - 1,
    );
    return (
      getPlateauCenterProgress(
        targetCard,
        HOME_WORKING_PRINCIPLES.length,
        ACT1_PACING,
      ) * ACT1_END
    );
  }

  if (progress < PAN_END) {
    const panT = (progress - ACT1_END) / (PAN_END - ACT1_END);
    if (panT <= 0.08 || panT >= 0.92) {
      return null;
    }
    const threshold = direction > 0 ? 0.38 : direction < 0 ? 0.62 : 0.5;
    return panT >= threshold
      ? ENQUIRE_STOP_PROGRESS
      : (STOP_PROGRESS[HOME_WORKING_PRINCIPLES.length - 1] ?? ACT1_END);
  }

  return null;
}
