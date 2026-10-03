import { LEVEL_META, type Level } from "@/lib/levels";
import { cn } from "@/lib/utils";

/*
 * Level chip and level bar (HANDOFF.md § 7.6). The glyph shape, the fill
 * count and the words all carry the level, so it holds up without colour and
 * in black-and-white print. Three steps on purpose: a 12-segment bar filled
 * to 4 reads as a score, and the report never shows scores.
 */

function LevelGlyph({ level, color, size = 16 }: { level: Level; color: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", "aria-hidden": true as const, className: "flex-shrink-0" };
  switch (level) {
    case "sujuu":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9.5" fill="none" stroke={color} strokeWidth="2.4" />
          <path d="m8 12.4 2.8 2.8L16.2 9.6" fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "jonkin":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9.5" fill="none" stroke={color} strokeWidth="2.4" />
          <path d="M12 2.5a9.5 9.5 0 0 0 0 19z" fill={color} />
        </svg>
      );
    case "selvia":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="10.5" fill={color} />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9.5" fill="none" stroke={color} strokeWidth="2.4" strokeDasharray="3.2 3.6" />
        </svg>
      );
  }
}

interface LevelChipProps {
  level: Level;
  /** 32 px by default; `dense` is 28 px for tight rows. */
  dense?: boolean;
  className?: string;
}

export function LevelChip({ level, dense = false, className }: LevelChipProps) {
  const m = LEVEL_META[level];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-pill font-ui font-bold leading-none",
        dense ? "h-7 pl-2 pr-2.5 text-[13px]" : "h-8 pl-[9px] pr-3 text-[14px]",
        // Print: 1.5 px outline in near-black, no fill — nothing depends on colour.
        "print:border-[1.5px] print:border-[#111] print:!bg-transparent print:!text-[#111]",
        className,
      )}
      style={{ background: m.soft, color: m.color }}
    >
      <span className="print:hidden">
        <LevelGlyph level={level} color={m.color} size={dense ? 14 : 16} />
      </span>
      <span className="hidden print:inline">
        <LevelGlyph level={level} color="#111111" size={14} />
      </span>
      <span>{m.label}</span>
    </span>
  );
}

/** Three segments 34 × 8, filled 3 / 2 / 1 / 0 in the level colour. */
export function LevelBar({ level, className }: { level: Level; className?: string }) {
  const m = LEVEL_META[level];
  return (
    <span aria-hidden="true" className={cn("inline-flex gap-1", className)}>
      {[0, 1, 2].map(i => {
        const filled = i < m.steps;
        return (
          <span
            key={i}
            className={cn(
              "box-border h-2 w-[34px] rounded",
              filled ? "print:!bg-[#111]" : "bg-line print:border print:border-[#111] print:bg-transparent",
            )}
            style={filled ? { background: m.color } : undefined}
          />
        );
      })}
    </span>
  );
}
