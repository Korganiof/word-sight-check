// The main screening battery, in order. Each timed task hands off to the next
// step here rather than hard-coding its successor, so the sequence can be
// reordered (or a step inserted) in one place. The final step is the report.
//
// The supplementary exercises (syllables, minimal pairs, and the hidden
// scaffolds) are intentionally NOT part of this chain — they return to the
// exercise list on their own.
export const SCREENING_FLOW = [
  "/task/pseudowords",
  "/task/word-search",
  "/exercise/word-chains",
  "/exercise/spelling-errors",
  "/exercise/reading-comp",
  "/results",
] as const;

export type ScreeningRoute = (typeof SCREENING_FLOW)[number];

/**
 * Returns the route that follows `current` in the screening flow. Falls back to
 * the report ("/results") if `current` isn't a recognised step or is the last
 * one, so a caller can never get stranded.
 */
export function nextRoute(current: string): ScreeningRoute {
  const i = (SCREENING_FLOW as readonly string[]).indexOf(current);
  if (i === -1 || i === SCREENING_FLOW.length - 1) return "/results";
  return SCREENING_FLOW[i + 1];
}
