import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight, Info, List, Timer } from "lucide-react";
import { Link } from "react-router-dom";
import { ExerciseShell } from "@/components/shell";
import { Button } from "@/components/Button";
import { cn } from "@/lib/utils";

export interface ReadyStep {
  heading: string;
  text: ReactNode;
  /** Extra content under the text (e.g. the A / L keycaps on Osa 1). */
  extra?: ReactNode;
}

/** The part's facts, shown as pills in the docked bar. */
export interface ReadyFacts {
  /** Whole-exercise time, or the per-item time when `perItem` is set. */
  timeMs: number;
  /** Per-item limit, e.g. "sana" → "3 s per sana". */
  perItem?: string;
  count: number;
  /** Unit after the count, in the partitive: "sanaa", "lausetta". */
  unit: string;
}

interface ExerciseReadyScreenProps {
  title: string;
  subtitle?: string;
  /** Battery part (1–5): shows the rail in the app bar. Omit for supplementary exercises. */
  part?: number;
  steps: ReadyStep[];
  onStart: () => void;
  startLabel?: string;
  /** Right column: the example card, or the Osa 5 warm-up. Without it the steps form one column. */
  aside?: ReactNode;
  facts?: ReadyFacts;
  /** When false, the start button is disabled and `startHint` replaces the facts. */
  canStart?: boolean;
  startHint?: string;
  /** "← Etusivulle" in the app bar (only outside the battery: Osa 1). */
  showHomeLink?: boolean;
}

/** 90 000 → "1,5 min", 180 000 → "3 min", 20 000 → "20 s". */
function formatDuration(ms: number): string {
  if (ms < 60_000) return `${Math.round(ms / 1000)} s`;
  const min = ms / 60_000;
  const text = Number.isInteger(min) ? String(min) : min.toFixed(1).replace(".", ",");
  return `${text} min`;
}

function factLabels(f: ReadyFacts): [string, string] {
  const time = f.perItem ? `${Math.round(f.timeMs / 1000)} s per ${f.perItem}` : formatDuration(f.timeMs);
  return [time, `${f.count} ${f.unit}`];
}

function FactPills({ facts }: { facts: ReadyFacts }) {
  const [time, count] = factLabels(facts);
  const pill =
    "inline-flex h-9 items-center gap-2 whitespace-nowrap rounded-pill bg-recessed pl-3 pr-3.5 font-ui text-[15px] font-bold leading-none tabular-nums text-ink [&>svg]:h-4 [&>svg]:w-4 [&>svg]:flex-shrink-0";
  return (
    <ul aria-label="Tehtävän tiedot" className="m-0 hidden list-none items-center gap-2 p-0 md:flex">
      <li className="flex">
        <span className={pill}>
          <Timer strokeWidth={2.2} aria-hidden="true" />
          <span>{time}</span>
        </span>
      </li>
      <li className="flex">
        <span className={pill}>
          <List strokeWidth={2.2} aria-hidden="true" />
          <span>{count}</span>
        </span>
      </li>
    </ul>
  );
}

// Vertical budget: at 1440 × 716 only 568 px sit between the app bar and the
// docked bar (HANDOFF § 6.7 rule 3). The app's step copy is longer than the
// design's, so on short windows the gaps and the step leading tighten rather
// than letting the screen scroll. (Tailwind needs these variant classes
// written out literally: `md:[@media(max-height:820px)]:…`.)

function Steps({ steps }: { steps: ReadyStep[] }) {
  return (
    <ol className="m-0 list-none p-0">
      {steps.map((step, i) => {
        const last = i === steps.length - 1;
        return (
          <li
            key={i}
            className={cn(
              "relative grid grid-cols-[28px_minmax(0,1fr)] gap-x-4 md:grid-cols-[30px_minmax(0,1fr)]",
              !last && "pb-5 md:[@media(max-height:820px)]:pb-3",
            )}
          >
            {!last && (
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-[13px] top-8 w-0.5 rounded-[1px] bg-line md:left-[14px] md:top-[34px]"
              />
            )}
            <span
              aria-hidden="true"
              className="relative z-[1] flex h-7 w-7 items-center justify-center rounded-pill bg-gold-tint font-ui text-[15px] font-extrabold leading-none text-gold-ink md:h-[30px] md:w-[30px]"
            >
              {i + 1}
            </span>
            <div className="min-w-0">
              <h2 className="m-0 mt-0.5 font-ui text-[18px] font-extrabold leading-6 tracking-[-0.015em] text-ink md:text-h4">
                {step.heading}
              </h2>
              <p className="m-0 mt-1 text-body text-ink md:[@media(max-height:820px)]:mt-0.5 md:[@media(max-height:820px)]:leading-[26px]">
                {step.text}
              </p>
              {step.extra}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Ready screen (HANDOFF.md § 8.3, v2): a full-width title block, the steps
 * beside the example card (the warm-up on Osa 5), and the docked bar with the
 * part's facts and the primary "Aloita harjoitus". The block is centred in a
 * scrolling <main> with margin-block auto (§ 6.7 rule 4).
 */
export function ExerciseReadyScreen({
  title,
  subtitle,
  part,
  steps,
  onStart,
  startLabel = "Aloita harjoitus",
  aside,
  facts,
  canStart = true,
  startHint,
  showHomeLink = false,
}: ExerciseReadyScreenProps) {
  const showHint = !canStart && !!startHint;

  const dock = (
    <div className="flex w-full flex-col gap-2 py-3 md:flex-row md:items-center md:justify-between md:gap-6 md:py-0">
      <div className="min-w-0 md:flex-1">
        {showHint ? (
          <p className="m-0 flex items-start justify-center gap-2 text-[15px] leading-[22px] text-ink-2 md:justify-start md:text-[16px] md:leading-6">
            <Info className="mt-0.5 h-[18px] w-[18px] flex-shrink-0" strokeWidth={2.2} aria-hidden="true" />
            <span>{startHint}</span>
          </p>
        ) : (
          facts && <FactPills facts={facts} />
        )}
      </div>
      <Button
        onClick={onStart}
        disabled={!canStart}
        className="h-14 w-full flex-shrink-0 rounded-tile text-[18px] md:w-auto md:rounded-btn md:text-[17px]"
      >
        {startLabel}
        <ArrowRight aria-hidden="true" />
      </Button>
    </div>
  );

  return (
    <ExerciseShell
      part={part}
      logoLink={showHomeLink || part === undefined}
      width="ready"
      center
      right={
        showHomeLink ? (
          <Link
            to="/"
            className="ls-t inline-flex h-10 items-center gap-2 rounded-key px-3 font-ui text-[15px] font-bold text-gold-ink hover:bg-gold-tint hover:text-gold-ink-deep"
          >
            <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
            Etusivulle
          </Link>
        ) : undefined
      }
      dock={dock}
    >
      {/* The shell's own content padding (40 / 56 px on desktop) is cancelled
          here: the ready screen needs that height and sets its own 20 px. */}
      <div className="flex flex-col md:-mb-14 md:-mt-10 md:py-5 md:[@media(max-height:820px)]:py-1">
        <h1 className="m-0 font-ui text-[32px] font-extrabold leading-[38px] tracking-[-0.03em] text-ink md:text-h1">
          {title}
        </h1>
        {subtitle && (
          <p className="m-0 mt-2 text-[17px] leading-[26px] text-ink-2 md:text-[19px] md:leading-[30px]">{subtitle}</p>
        )}

        <div
          className={cn(
            "mt-6 flex flex-col gap-7 md:grid md:items-start md:gap-x-10 md:gap-y-0",
            "md:[@media(max-height:820px)]:mt-4",
            aside ? "md:grid-cols-[580px_420px]" : "md:grid-cols-[minmax(0,640px)]",
          )}
        >
          <Steps steps={steps} />
          {aside}
        </div>
      </div>
    </ExerciseShell>
  );
}

/** `A · Oikea sana` row used by the Osa 1 ready screen (desktop keycaps). */
export function KeyLegend({ items }: { items: Array<{ key: string; label: string }> }) {
  return (
    <div className="mt-2.5 flex flex-wrap gap-x-6 gap-y-2.5">
      {items.map(it => (
        <span key={it.key} className="flex items-center gap-2.5 font-ui text-[16px] font-bold leading-none text-ink">
          <kbd className="inline-flex h-9 min-w-[36px] items-center justify-center rounded-[10px] border border-line-strong border-b-[3px] bg-surface px-2.5 font-mono text-[15px] font-bold leading-none text-ink">
            {it.key}
          </kbd>
          <span>{it.label}</span>
        </span>
      ))}
    </div>
  );
}
