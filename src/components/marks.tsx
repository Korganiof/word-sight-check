import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { CornerDownLeft } from "lucide-react";
import { cn } from "@/lib/utils";

/*
 * The one mark language (HANDOFF.md § 7.3–7.5): a pale gold highlighter wash
 * with a 3 px pen line under it. Marks never change font weight or size, so
 * text never reflows.
 */

// ── Word toggle in running text (Osa 2, Osa 5, warm-up) ──────────────────────

interface WordToggleProps {
  children: string;
  /** Trailing punctuation, kept outside the button in the nowrap wrapper. */
  trail?: string;
  pressed: boolean;
  onToggle: () => void;
  disabled?: boolean;
  /** Tab-reachable by default; the warm-up removes solved sentences from the tab order. */
  tabIndex?: number;
}

/**
 * Each word is a real <button aria-pressed>. The button is the hit area
 * (36 px on desktop, 44 px on phones); the inner .ls-ink span carries the mark.
 * Rendered inside a `.ls-prose` block (see WordProse).
 */
export function WordToggle({ children, trail = "", pressed, onToggle, disabled, tabIndex }: WordToggleProps) {
  return (
    <span className="inline-block whitespace-nowrap mr-[0.34em]">
      <button
        type="button"
        className={cn(
          "ls-word group -my-0.5 appearance-none border-0 bg-transparent p-0 py-[7px] font-[inherit] text-[length:inherit] leading-[30px] text-inherit md:my-0 md:py-[3px]",
          disabled ? "cursor-default" : "cursor-pointer",
        )}
        aria-pressed={pressed}
        onClick={onToggle}
        disabled={disabled}
        tabIndex={tabIndex}
      >
        <span
          className={cn(
            "ls-ink ls-t inline-block rounded-mark -mx-[3px] px-[3px]",
            pressed ? "ls-mark" : !disabled && "group-hover:bg-gold-tint",
          )}
        >
          {children}
        </span>
      </button>
      {trail}
    </span>
  );
}

/** The reading-style prose block the word toggles sit in: 20 / 40 on desktop, 19 / 40 on phones. */
export function WordProse({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("text-reading-sm text-ink md:text-reading", className)}>{children}</div>;
}

// ── Grid word (Osa 4) ────────────────────────────────────────────────────────

interface GridWordProps {
  children: string;
  pressed: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function GridWord({ children, pressed, onToggle, disabled }: GridWordProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      disabled={disabled}
      className={cn(
        "ls-t box-border h-[52px] min-w-0 truncate rounded-key border-0 px-1.5 text-center font-text text-[17px] font-medium leading-none tracking-[0.01em] text-ink md:text-[19px]",
        pressed ? "ls-mark" : "bg-recessed hover:bg-well active:bg-line",
      )}
    >
      {children}
    </button>
  );
}

// ── Letter tape (Osa 3) ──────────────────────────────────────────────────────

interface LetterTapeProps {
  /** The chained sentence, one cell per character. */
  text: string;
  /** Character positions (1-based: after the n-th letter) that are marked as boundaries. */
  marked: Set<number>;
  onToggle: (pos: number) => void;
  disabled?: boolean;
  /** Static preview (Home hero): no buttons, just the look. */
  preview?: boolean;
}

// Cell width is the only tunable (HANDOFF § 7.5: 34 px desktop, 25 px phones).
// On desktop a long sentence narrows its cells down to MIN_CELL before it is
// allowed to wrap, so the common case stays on one row.
const CELL = { desktop: 34, phone: 25 };
const MIN_CELL = { desktop: 26, phone: 22 };
const GLYPH_W = 17;
const FONT_RATIO = 48 / 34;

/**
 * One row of fixed-width cells; a boundary is a 4 px gold-ink bar drawn over
 * the seam to the next cell. The last letter is not tappable. On narrow
 * screens the sentence wraps into rows of equal length; the first row ends
 * with a corner-down-left glyph. Cells never move when a mark is placed.
 */
export function LetterTape({ text, marked, onToggle, disabled, preview = false }: LetterTapeProps) {
  const chars = Array.from(text);
  const ref = useRef<HTMLDivElement>(null);
  const [layout, setLayout] = useState<{ perRow: number; cell: number }>({
    perRow: chars.length,
    cell: CELL.desktop,
  });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const phone = window.innerWidth < 768;
      const full = phone ? CELL.phone : CELL.desktop;
      const min = phone ? MIN_CELL.phone : MIN_CELL.desktop;
      const width = el.clientWidth;
      // One row: use the full cell, or narrow it down to the minimum.
      const oneRow = Math.min(full, Math.floor(width / chars.length));
      if (oneRow >= min) {
        setLayout({ perRow: chars.length, cell: oneRow });
        return;
      }
      const fitsWrapped = Math.max(4, Math.floor((width - GLYPH_W) / full));
      const rows = Math.ceil(chars.length / fitsWrapped);
      setLayout({ perRow: Math.ceil(chars.length / rows), cell: full });
    };
    measure();
    if (typeof ResizeObserver === "undefined") return; // jsdom
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [chars.length]);

  const { perRow, cell } = layout;
  const cellStyle = { width: cell, fontSize: Math.round(cell * FONT_RATIO) };

  const rows: string[][] = [];
  for (let i = 0; i < chars.length; i += perRow) rows.push(chars.slice(i, i + perRow));

  return (
    <div ref={ref} className="flex w-full justify-center">
      <div className="flex flex-col items-start gap-3">
        {rows.map((row, r) => {
          const offset = r * perRow;
          const isLastRow = r === rows.length - 1;
          return (
            <div key={r} className="flex items-center">
              {row.map((ch, i) => {
                const idx = offset + i;
                const pos = idx + 1;
                const isLastChar = idx === chars.length - 1;
                const isMarked = marked.has(pos);
                const first = i === 0;
                const last = i === row.length - 1;
                const radius = cn(
                  first && "rounded-l-[14px] md:rounded-l-tile",
                  last && "rounded-r-[14px] md:rounded-r-tile",
                );
                const bar = (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "ls-bar ls-t pointer-events-none absolute -right-0.5 bottom-3 top-3 w-1 rounded-sm bg-gold-ink md:bottom-3.5 md:top-3.5",
                      isMarked ? "opacity-100" : "opacity-0 group-hover:opacity-35",
                    )}
                  />
                );
                const cellClass = cn(
                  "ls-t group relative box-border h-[88px] border-0 p-0 text-center font-mono font-semibold leading-[88px] text-ink md:h-[104px] md:leading-[104px]",
                  radius,
                  isMarked ? "z-[2] bg-gold-wash" : "z-[1] bg-recessed",
                );
                if (preview || isLastChar) {
                  return (
                    <span key={idx} className={cn(cellClass, "cursor-default")} style={cellStyle}>
                      {ch}
                      {bar}
                    </span>
                  );
                }
                return (
                  <button
                    key={idx}
                    type="button"
                    className={cn(cellClass, !disabled && !isMarked && "hover:bg-well", disabled ? "cursor-default" : "cursor-pointer")}
                    style={cellStyle}
                    aria-pressed={isMarked}
                    aria-label={`${ch} — sanaraja ${isMarked ? "merkitty" : "ei merkitty"}`}
                    onClick={() => onToggle(pos)}
                    disabled={disabled}
                  >
                    {ch}
                    {bar}
                  </button>
                );
              })}
              {!isLastRow && (
                <span
                  aria-hidden="true"
                  className="flex h-[88px] w-[17px] items-center justify-center text-ink-2 md:h-[104px]"
                >
                  <CornerDownLeft className="h-3.5 w-3.5" strokeWidth={2.4} />
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Item progress rail (Osa 3 sentences) ────────────────────────────────────

/** `Lause 3 / 15` + a 15-segment rail: done gold, current brown, upcoming line. */
export function ItemRail({ label, current, total }: { label: string; current: number; total: number }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="font-ui text-[15px] font-bold leading-none text-ink-2">{label}</span>
      <span aria-hidden="true" className="flex gap-1">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 w-[10px] rounded-[3px] md:w-[22px]",
              i < current ? "bg-gold" : i === current ? "bg-brown" : "bg-line",
            )}
          />
        ))}
      </span>
    </div>
  );
}
