import type { ReactNode } from "react";
import { Highlighter, Timer } from "lucide-react";
import { Logo } from "@/components/Logo";
import { formatMmSs } from "@/lib/utils";
import { cn } from "@/lib/utils";

/*
 * The persistent app shell every exercise and ready screen sits in:
 * a white app bar (logo · battery rail · right slot), a 4 px segmented time
 * line under it, one scrollable <main>, and a docked action bar at the bottom.
 * See HANDOFF.md § 6.
 */

export const BATTERY_PARTS = 5;

// ── Battery rail ─────────────────────────────────────────────────────────────

/** `OSA n / 5` with five segments: completed brown, current gold, upcoming line. */
export function BatteryRail({ part, className }: { part: number; className?: string }) {
  return (
    <div className={cn("flex items-center gap-2.5 md:gap-3.5", className)}>
      <span className="font-ui text-[12px] font-extrabold uppercase tracking-[0.1em] leading-none text-gold-ink tabular-nums whitespace-nowrap md:text-[13px]">
        Osa {part} / {BATTERY_PARTS}
      </span>
      <span aria-hidden="true" className="flex gap-1">
        {Array.from({ length: BATTERY_PARTS }, (_, i) => {
          const n = i + 1;
          return (
            <span
              key={n}
              className={cn(
                "h-1 w-[18px] rounded-[3px] md:h-1.5 md:w-[34px]",
                n < part ? "bg-brown" : n === part ? "bg-gold" : "bg-line",
              )}
            />
          );
        })}
      </span>
    </div>
  );
}

// ── Right-slot pills ─────────────────────────────────────────────────────────

/** Timer pill. Last 30 s: brown with white text — no red, no blink, no pulse. */
export function TimerPill({ remainingMs }: { remainingMs: number }) {
  const low = remainingMs <= 30_000;
  return (
    <div
      role="timer"
      aria-label="Aikaa jäljellä"
      className={cn(
        "ls-t flex h-9 items-center gap-2 rounded-pill pl-3 pr-3.5 md:h-10 md:pl-3.5 md:pr-4",
        low ? "bg-brown text-white" : "bg-recessed text-ink",
      )}
    >
      <Timer className="h-[18px] w-[18px] flex-shrink-0" strokeWidth={2.2} aria-hidden="true" />
      <span className="hidden font-ui text-[13px] font-semibold leading-none md:inline">Aikaa jäljellä</span>
      <span className="font-ui text-[17px] font-extrabold leading-none tabular-nums tracking-[0.01em] md:text-[18px]">
        {formatMmSs(remainingMs)}
      </span>
    </div>
  );
}

/** Osa 1 item pill: "Tehtävä 12 / 30". */
export function ItemPill({ label = "Tehtävä", current, total }: { label?: string; current: number; total: number }) {
  return (
    <div className="flex h-9 items-center gap-2 rounded-pill bg-recessed px-3.5 text-ink md:h-10 md:px-4">
      <span className="font-ui text-[13px] font-semibold leading-none">{label}</span>
      <span className="font-ui text-[16px] font-extrabold leading-none tabular-nums">
        {current} / {total}
      </span>
    </div>
  );
}

/** Small label pill: `HARJOITTELU`, `SEULONTATYÖKALU · YLI 15-VUOTIAILLE`. */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-pill bg-gold-tint px-3 font-ui text-[12px] font-extrabold uppercase leading-none tracking-[0.12em] text-gold-ink whitespace-nowrap",
        className,
      )}
    >
      {children}
    </span>
  );
}

// ── Time line ────────────────────────────────────────────────────────────────

export const TIME_SEGMENT_MS = 30_000;

interface TimeLineProps {
  durationMs: number;
  remainingMs: number;
}

/**
 * 4 px strip under the app bar, one segment per 30 seconds. Spent segments
 * are `line`, remaining ones `time`; the single last segment turns brown-deep
 * in the low-time state. It changes once per 30 s, never drains continuously.
 */
export function TimeLine({ durationMs, remainingMs }: TimeLineProps) {
  const total = Math.max(1, Math.ceil(durationMs / TIME_SEGMENT_MS));
  const remaining = Math.min(total, Math.ceil(remainingMs / TIME_SEGMENT_MS));
  const low = remainingMs <= TIME_SEGMENT_MS && remaining === 1;
  return (
    <div aria-hidden="true" className="flex h-1 flex-shrink-0 gap-1 bg-paper">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "ls-t h-1 flex-1",
            i < remaining ? (low ? "bg-brown-deep" : "bg-time") : "bg-line",
          )}
        />
      ))}
    </div>
  );
}

/** Osa 1 variant: one segment per item — done gold, current brown, upcoming line. */
export function ItemLine({ current, total }: { current: number; total: number }) {
  return (
    <div aria-hidden="true" className="flex h-1 flex-shrink-0 gap-1 bg-paper">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn("ls-t h-1 flex-1", i < current ? "bg-gold" : i === current ? "bg-brown" : "bg-line")}
        />
      ))}
    </div>
  );
}

// ── Counter ──────────────────────────────────────────────────────────────────

interface CounterProps {
  value: number | string;
  unit: string;
  /** Hide the highlighter circle (Osa 3 on phones shortens to number + unit). */
  compact?: boolean;
}

/** Live counter in the docked bar: `12 merkittyä`, `3 valittua`, `2 / 4 sanarajaa merkitty`. */
export function Counter({ value, unit, compact = false }: CounterProps) {
  return (
    <div aria-live="polite" className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={cn(
          "ls-mark h-10 w-10 items-center justify-center rounded-pill text-gold-ink-deep",
          compact ? "hidden md:flex" : "flex",
        )}
      >
        <Highlighter className="h-[19px] w-[19px]" strokeWidth={2.2} />
      </span>
      <span className="flex items-baseline gap-[7px]">
        <span className="font-ui text-[24px] font-extrabold leading-none tabular-nums text-ink md:text-[26px]">
          {value}
        </span>
        <span className="text-[16px] leading-none text-ink-2">{unit}</span>
      </span>
    </div>
  );
}

// ── Keycap ───────────────────────────────────────────────────────────────────

/** Desktop-only keyboard hint. */
export function Keycap({ children, small = false, className }: { children: ReactNode; small?: boolean; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex items-center justify-center rounded-[10px] border border-line-strong border-b-[3px] bg-surface font-mono font-bold text-ink",
        small ? "h-[34px] min-w-[34px] px-2 text-[13px]" : "h-10 min-w-[40px] px-2.5 text-[17px]",
        className,
      )}
    >
      {children}
    </kbd>
  );
}

// ── Shell ────────────────────────────────────────────────────────────────────

interface AppBarProps {
  /** Battery part (1–5) to show in the rail; omit to leave the centre empty. */
  part?: number;
  /** Logo links home only outside the battery (Consent, Osa 1 ready screen, Results). */
  logoLink?: boolean;
  right?: ReactNode;
}

export function AppBar({ part, logoLink = false, right }: AppBarProps) {
  return (
    <header className="grid h-appbar-sm flex-shrink-0 grid-cols-[auto_1fr_auto] items-center gap-3 border-b border-line bg-surface px-gutter md:h-appbar md:grid-cols-[1fr_auto_1fr] md:px-8 print:hidden">
      <div className="flex items-center gap-3">
        <Logo link={logoLink} markOnly={part !== undefined} />
        {part !== undefined && <BatteryRail part={part} className="md:hidden" />}
      </div>
      <div className="hidden items-center justify-center md:flex">
        {part !== undefined && <BatteryRail part={part} />}
      </div>
      <div className="flex items-center justify-end gap-3">{right}</div>
    </header>
  );
}

interface ExerciseShellProps extends AppBarProps {
  /** The strip under the app bar (TimeLine / ItemLine). */
  line?: ReactNode;
  /** Contents of the docked bottom bar; omit for no bar. */
  dock?: ReactNode;
  /** Show the docked bar on phones only (ready screens dock their CTA there). */
  dockPhoneOnly?: boolean;
  /** Desktop content width class, e.g. `max-w-work`. */
  width?: "work" | "work-wide" | "narrow" | "shell";
  /** Vertically centre the content in <main> (Osa 1, Osa 3). */
  center?: boolean;
  children: ReactNode;
}

const WIDTH: Record<NonNullable<ExerciseShellProps["width"]>, string> = {
  work: "md:max-w-work",
  "work-wide": "md:max-w-work-wide",
  narrow: "md:max-w-[760px]",
  shell: "md:max-w-shell",
};

/**
 * Full-height frame: app bar + line on top, scrollable main, docked bar below.
 * Children are placed in a centred column with phone gutters.
 */
export function ExerciseShell({
  part,
  logoLink,
  right,
  line,
  dock,
  dockPhoneOnly = false,
  width = "work",
  center = false,
  children,
}: ExerciseShellProps) {
  return (
    <div className="flex h-screen h-[100dvh] flex-col bg-paper text-ink">
      <AppBar part={part} logoLink={logoLink} right={right} />
      {line}
      <main className={cn("ls-enter min-h-0 flex-1 overflow-y-auto", center && "flex flex-col")}>
        <div
          className={cn(
            "mx-auto w-full px-gutter pb-10 pt-6 md:px-0 md:pb-14 md:pt-10",
            WIDTH[width],
            center && "md:my-auto",
          )}
        >
          {children}
        </div>
      </main>
      {dock && (
        <footer
          className={cn(
            "relative z-[2] flex min-h-dock-sm flex-shrink-0 justify-center border-t border-line bg-surface shadow-up md:h-dock print:hidden",
            dockPhoneOnly && "md:hidden",
          )}
        >
          <div
            className={cn(
              "flex w-full items-center justify-between gap-4 px-gutter md:gap-6 md:px-0",
              WIDTH[width],
            )}
          >
            {dock}
          </div>
        </footer>
      )}
    </div>
  );
}
