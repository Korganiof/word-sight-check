import type { ReactNode } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { ExerciseShell } from "@/components/shell";
import { Button } from "@/components/Button";
import { Label } from "@/components/primitives";
import { cn } from "@/lib/utils";

export interface ReadyStep {
  heading: string;
  text: ReactNode;
  /** Extra content under the text (e.g. the A / L keycaps on Osa 1). */
  extra?: ReactNode;
}

interface ExerciseReadyScreenProps {
  title: string;
  subtitle?: string;
  /** Battery part (1–5). Omit for supplementary exercises (no rail, no label). */
  part?: number;
  /** Uppercase label above the title; defaults to `OSA n / 5 — TITLE`. */
  label?: string;
  steps: ReadyStep[];
  onStart: () => void;
  startLabel?: string;
  /**
   * Right column on desktop (example card, or the Osa 5 warm-up). On phones it
   * flows under the steps. The start button always sits under it.
   */
  aside?: ReactNode;
  /** When false, the start button is disabled and `startHint` explains why. */
  canStart?: boolean;
  startHint?: string;
  /** Show the "← Etusivulle" link in the app bar (only outside the battery). */
  showHomeLink?: boolean;
}

/**
 * Ready screen (HANDOFF.md § 8.3): label, title, subtitle and numbered steps
 * on the left; an optional example / warm-up card and the primary start
 * button on the right. One column on phones with the button docked.
 */
export function ExerciseReadyScreen({
  title,
  subtitle,
  part,
  label,
  steps,
  onStart,
  startLabel = "Aloita harjoitus",
  aside,
  canStart = true,
  startHint,
  showHomeLink = false,
}: ExerciseReadyScreenProps) {
  const labelText = label ?? (part !== undefined ? `Osa ${part} / 5 — ${title}` : undefined);

  const startButton = (
    <Button
      onClick={onStart}
      disabled={!canStart}
      size="hero"
      className="h-14 w-full rounded-tile text-[17px] md:h-16 md:rounded-answer md:text-[19px]"
    >
      {startLabel}
      <ArrowRight aria-hidden="true" />
    </Button>
  );

  return (
    <ExerciseShell
      part={part}
      logoLink={showHomeLink || part === undefined}
      width="shell"
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
      dockPhoneOnly
      dock={
        <div className="flex w-full flex-col items-center gap-2 py-3">
          {startButton}
          {!canStart && startHint && (
            <p className="m-0 text-center text-[14px] leading-5 text-ink-2">{startHint}</p>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-8 md:mx-auto md:max-w-[1120px] md:flex-row md:items-start md:justify-between md:gap-20 md:py-8">
        <div className="flex flex-col gap-8 md:w-[520px] md:flex-shrink-0 md:gap-11">
          <div className="flex flex-col gap-2.5 md:gap-3.5">
            {labelText && <Label>{labelText}</Label>}
            <h1 className="m-0 font-ui text-title-sm text-ink md:text-title">{title}</h1>
            {subtitle && <p className="m-0 text-[17px] leading-[26px] text-ink-2 md:text-[20px] md:leading-[30px]">{subtitle}</p>}
          </div>

          <ol className="m-0 flex list-none flex-col gap-6 p-0 md:gap-7">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-4 md:gap-[18px]">
                <span
                  aria-hidden="true"
                  className="inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-pill border border-line bg-surface font-ui text-[17px] font-extrabold leading-none text-gold-ink"
                >
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-col gap-1 pt-1.5">
                  <h2 className="m-0 font-ui text-h4 text-ink">{step.heading}</h2>
                  <p className="m-0 text-body text-ink">{step.text}</p>
                  {step.extra}
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className={cn("flex flex-col gap-5 md:w-[520px] md:flex-shrink-0")}>
          {aside}
          <div className="hidden md:flex md:flex-col md:gap-3">
            {startButton}
            {!canStart && startHint && (
              <p className="m-0 text-center text-caption text-ink-2">{startHint}</p>
            )}
          </div>
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
