import type { ReactNode } from "react";
import { CornerDownRight } from "lucide-react";
import { Label, Sheet } from "@/components/primitives";
import { cn } from "@/lib/utils";

/*
 * The example cards on the ready screens (HANDOFF.md § 8.3). Each is a
 * picture, not a control: one `role="img"` with a Finnish label, everything
 * inside aria-hidden. The contents are sample material that does not appear
 * in the real exercises.
 */

interface ExampleCardProps {
  /** Finnish description of the picture for screen readers. */
  description: string;
  children: ReactNode;
}

export function ExampleCard({ description, children }: ExampleCardProps) {
  return (
    <Sheet as="aside" aria-label="Esimerkki" className="flex flex-col gap-4 p-5 md:rounded-sheet md:p-6">
      <Label>Esimerkki</Label>
      <div role="img" aria-label={description}>
        <div aria-hidden="true">{children}</div>
      </div>
    </Sheet>
  );
}

// ── Osa 1 ────────────────────────────────────────────────────────────────────

function MiniKey({ k, children }: { k: string; children: ReactNode }) {
  return (
    <span className="box-border flex h-[52px] flex-1 basis-0 items-center justify-center gap-2.5 rounded-btn border-2 border-brown bg-surface font-ui text-[15px] font-extrabold leading-none text-ink">
      <kbd className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-[10px] border border-b-[3px] border-line-strong bg-surface px-2.5 font-mono text-[13px] font-bold leading-none text-ink">
        {k}
      </kbd>
      <span>{children}</span>
    </span>
  );
}

export function PseudoWordExample() {
  return (
    <ExampleCard description="Esimerkki: sana talo ja painikkeet Oikea sana ja Ei sana">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col items-center gap-2 rounded-tile bg-recessed px-4 pb-5 pt-[18px]">
          <span className="font-ui text-[14px] font-bold leading-5 text-ink-2">Onko tämä oikea sana?</span>
          <span className="font-text text-[44px] font-bold leading-[52px] text-ink">talo</span>
          <span className="mt-1 flex h-[5px] w-40 overflow-hidden rounded-[3px] bg-well">
            <span className="w-[70%] bg-time" />
          </span>
        </div>
        <div className="flex gap-2.5">
          <MiniKey k="A">Oikea sana</MiniKey>
          <MiniKey k="L">Ei sana</MiniKey>
        </div>
      </div>
    </ExampleCard>
  );
}

// ── Osa 2 ────────────────────────────────────────────────────────────────────

function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="flex h-8 items-center whitespace-nowrap rounded-[9px] bg-recessed px-[11px] font-ui text-[13px] font-extrabold uppercase leading-none tracking-[0.05em] text-ink">
      {children}
    </span>
  );
}

export function WordSearchExample() {
  return (
    <ExampleCard description="Esimerkki: tavoitesanat satamaan ja lokit, ja tekstissä löydetty sana satamaan korostettuna">
      <div className="flex flex-col gap-3.5">
        <div className="flex gap-2">
          <Chip>satamaan</Chip>
          <Chip>lokit</Chip>
        </div>
        <div className="h-px bg-line" />
        <p className="m-0 text-[19px] leading-9 text-ink">
          Laiva saapui{" "}
          <span className="ls-mark -mx-[3px] inline-block rounded-mark px-[3px] leading-[30px]">satamaan</span>{" "}
          aamulla, ja lokit kiersivät mastoja.
        </p>
      </div>
    </ExampleCard>
  );
}

// ── Osa 3 ────────────────────────────────────────────────────────────────────

const TAPE = "kissaistuumatolla";
// Boundaries after "kissa" and "istuu" (0-based index of the last letter).
const TAPE_MARKS = new Set([4, 9]);

export function WordChainExample() {
  const chars = Array.from(TAPE);
  return (
    <ExampleCard description="Esimerkki: kissaistuumatolla, sanarajat merkitty: kissa istuu matolla">
      <div className="flex flex-col gap-3.5">
        <div className="flex">
          {chars.map((ch, i) => {
            const marked = TAPE_MARKS.has(i);
            return (
              <span
                key={i}
                className={cn(
                  "relative box-border h-[52px] w-[18px] text-center font-mono text-[26px] font-semibold leading-[52px] text-ink md:h-[60px] md:w-[21px] md:text-[30px] md:leading-[60px]",
                  i === 0 && "rounded-l-key",
                  i === chars.length - 1 && "rounded-r-key",
                  marked ? "z-[2] bg-gold-wash" : "z-[1] bg-recessed",
                )}
              >
                {ch}
                {marked && (
                  <span className="absolute -right-0.5 bottom-2.5 top-2.5 w-1 rounded-sm bg-gold-ink" />
                )}
              </span>
            );
          })}
        </div>
        <p className="m-0 flex items-center gap-2 text-[17px] leading-[26px] text-ink-2">
          <CornerDownRight className="h-[17px] w-[17px] flex-shrink-0" strokeWidth={2.2} />
          <span>kissa istuu matolla</span>
        </p>
      </div>
    </ExampleCard>
  );
}

// ── Osa 4 ────────────────────────────────────────────────────────────────────

const GRID = [
  { word: "kukka", marked: false },
  { word: "lusika", marked: true },
  { word: "hiiri", marked: false },
  { word: "lintu", marked: false },
];

export function SpellingErrorsExample() {
  return (
    <ExampleCard description="Esimerkki: sanoista kukka, lusika, hiiri ja lintu on merkitty lusika, jossa on kirjoitusvirhe">
      <div className="grid grid-cols-2 gap-2">
        {GRID.map(({ word, marked }) => (
          <span
            key={word}
            className={cn(
              "box-border flex h-12 items-center justify-center rounded-key font-text text-[18px] font-medium leading-none tracking-[0.01em] text-ink",
              marked ? "ls-mark" : "bg-recessed",
            )}
          >
            {word}
          </span>
        ))}
      </div>
    </ExampleCard>
  );
}
