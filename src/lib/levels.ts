export type Level = "sujuu" | "jonkin" | "selvia" | "missing";

export interface LevelMeta {
  label: string;
  short: string;
  /** Filled segments of the three-step level bar (3 / 2 / 1 / 0). */
  steps: number;
  /** Text colour of the level chip (all ≥ 6:1 on `soft`). */
  color: string;
  /** Chip background. */
  soft: string;
}

export const LEVEL_META: Record<Level, LevelMeta> = {
  sujuu:   { label: "Sujuu hyvin",             short: "Sujuu",     steps: 3, color: "#35612A", soft: "#E3EDD8" },
  jonkin:  { label: "Jonkin verran haasteita", short: "Vaihtelua", steps: 2, color: "#6E5200", soft: "#F8EBC4" },
  selvia:  { label: "Selviä haasteita",        short: "Haasteita", steps: 1, color: "#8A3B22", soft: "#F6E2D9" },
  missing: { label: "Harjoitusta ei tehty",    short: "Puuttuu",   steps: 0, color: "#64503F", soft: "#EFE8DD" },
};

/** Inclusive lower bounds (as ratios) for the top two tiers. */
export interface LevelThresholds {
  sujuu: number;
  jonkin: number;
}

/** For open-response tasks (find / mark / split), where chance is ~0. */
export const DEFAULT_THRESHOLDS: LevelThresholds = { sujuu: 0.75, jonkin: 0.5 };

/**
 * For two-alternative forced-choice tasks (pseudowords, minimal pairs) chance
 * is 50 %, so the default cut-offs would make "selviä haasteita" mean
 * below-chance performance. These sit above chance instead.
 */
export const TWO_AFC_THRESHOLDS: LevelThresholds = { sujuu: 0.9, jonkin: 0.75 };

// All cut-offs are heuristic — nothing here is clinically normed.
export function scoreToLevel(
  correct: number,
  total: number,
  thresholds: LevelThresholds = DEFAULT_THRESHOLDS,
): Level {
  if (total === 0) return "missing";
  const ratio = correct / total;
  if (ratio >= thresholds.sujuu) return "sujuu";
  if (ratio >= thresholds.jonkin) return "jonkin";
  return "selvia";
}

/**
 * Score for "mark every X in this set" tasks (word search, spelling errors,
 * wrong-word detection). Only hits count, and each false alarm cancels one
 * hit, so neither marking nothing nor marking everything scores well. This
 * mirrors how NMI's Tekninen 1 is scored (errors found) with a guard against
 * indiscriminate clicking.
 */
export function scoreMarking(
  hits: number,
  falseAlarms: number,
  targets: number,
): { correct: number; total: number } {
  return { correct: Math.max(0, hits - falseAlarms), total: targets };
}
