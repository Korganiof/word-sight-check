export type Level = "sujuu" | "jonkin" | "selvia" | "missing";

export interface LevelMeta {
  label: string;
  short: string;
  ratio: number;
  color: string;
  soft: string;
}

export const LEVEL_META: Record<Level, LevelMeta> = {
  sujuu:   { label: "Sujuu hyvin",             short: "Sujuu",     ratio: 1.00, color: "#4f7a3a", soft: "#e6ebd8" },
  jonkin:  { label: "Jonkin verran haasteita", short: "Vaihtelua", ratio: 0.66, color: "#C69A2B", soft: "#f9e4d6" },
  selvia:  { label: "Selviä haasteita",        short: "Haasteita", ratio: 0.33, color: "#a6442a", soft: "#f1d8ce" },
  missing: { label: "Harjoitusta ei tehty",    short: "Puuttuu",   ratio: 0.00, color: "#d2c5b0", soft: "#f0ece3" },
};

export function scoreToLevel(correct: number, total: number): Level {
  if (total === 0) return "missing";
  const ratio = correct / total;
  if (ratio >= 0.75) return "sujuu";
  if (ratio >= 0.5) return "jonkin";
  return "selvia";
}
