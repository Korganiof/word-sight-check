import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The custom type scale in tailwind.config.ts (`text-body`, `text-label` …)
// must be declared here, otherwise tailwind-merge treats those classes as
// text *colours* and drops them when a `text-ink` follows.
const FONT_SIZES = [
  "display", "display-sm",
  "title", "title-lg", "title-sm", "title-xs",
  "h1", "h1-sm", "h2", "h2-sm", "h3", "h3-sm", "h4",
  "lead", "lead-sm", "body", "body-sm", "reading", "reading-sm",
  "caption", "label", "button", "counter", "counter-sm", "tape", "tape-sm",
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: FONT_SIZES }],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a millisecond duration as "m:ss" (e.g. 90_000 → "1:30").
export function formatMmSs(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

export function shuffleArray<T>(arr: readonly T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
