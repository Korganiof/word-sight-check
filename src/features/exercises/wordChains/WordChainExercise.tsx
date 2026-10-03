import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { wordChainItems as allWordChainItems } from "./wordChainItems.fi";
import { saveWordChainsResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";
import { shuffleArray } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { useScreeningFlow } from "@/hooks/useScreeningFlow";
import { ExerciseShell, TimerPill, TimeLine, Counter, Keycap } from "@/components/shell";
import { LetterTape, ItemRail } from "@/components/marks";
import { Button } from "@/components/Button";
import { Sheet } from "@/components/primitives";

// NMI Tekninen 2 has the reader mark word boundaries in ~100 words of chained
// text with a pen in 90 s. Tapping letters is the closest browser equivalent
// (typing the sentence out would measure typing speed). 15 sentences ≈ 60
// words: a fluent reader clears them with time to spare, a slow reader is cut
// off — that is what the timer is for, so unreached sentences count as wrong.
//
// There is no "check" step: once as many boundaries are marked as the sentence
// has, it moves on by itself after a short grace period (a wrong tap can still
// be undone). "Seuraava" skips a sentence the reader is unsure about. Like the
// paper task, no correctness feedback is given.
const ITEM_COUNT = DEV_FAST ? 2 : 15;
const TOTAL_TIME_MS = DEV_FAST ? 30_000 : 90_000;
const COMMIT_DELAY_MS = 500;

/** Character positions at which a new word starts (excluding position 0). */
function boundaryPositions(sentence: string): Set<number> {
  const set = new Set<number>();
  const words = sentence.split(" ");
  let pos = 0;
  for (let i = 0; i < words.length - 1; i++) {
    pos += words[i].length;
    set.add(pos);
  }
  return set;
}

function sameSet(a: Set<number>, b: Set<number>): boolean {
  return a.size === b.size && [...a].every(x => b.has(x));
}

export function WordChainExercise() {
  const goToNext = useScreeningFlow();
  const items = useMemo(() => shuffleArray(allWordChainItems).slice(0, ITEM_COUNT), []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [splits, setSplits] = useState<Set<number>>(new Set());

  const correctRef = useRef(0);
  const doneRef = useRef(false);

  const currentItem = items[currentIndex];
  const expected = useMemo(() => boundaryPositions(currentItem.originalSentence), [currentItem]);

  const finish = useCallback((correct: number) => {
    if (doneRef.current) return;
    doneRef.current = true;
    saveWordChainsResult({ correct, total: items.length });
    goToNext();
  }, [items.length, goToNext]);

  // Score the current sentence as marked and move on (or finish).
  const advance = useCallback((marked: Set<number>) => {
    if (doneRef.current) return;
    if (sameSet(marked, expected)) correctRef.current += 1;
    if (currentIndex < items.length - 1) {
      setSplits(new Set());
      setCurrentIndex(i => i + 1);
    } else {
      finish(correctRef.current);
    }
  }, [expected, currentIndex, items.length, finish]);

  // Auto-advance once every boundary is marked; un-tapping within the grace
  // period cancels it (the effect cleanup clears the timer).
  useEffect(() => {
    if (splits.size === 0 || splits.size !== expected.size) return;
    const id = setTimeout(() => advance(splits), COMMIT_DELAY_MS);
    return () => clearTimeout(id);
  }, [splits, expected, advance]);

  // Time's up: credit a correct sentence still in its grace period, then
  // score everything reached against the full set.
  const handleTimeout = () => {
    const pending = sameSet(splits, expected) ? 1 : 0;
    finish(correctRef.current + pending);
  };

  const remainingMs = useCountdown({ durationMs: TOTAL_TIME_MS, onExpire: handleTimeout, intervalMs: 100 });

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        advance(splits);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [advance, splits]);

  const toggleSplit = (pos: number) => {
    if (doneRef.current) return;
    setSplits(prev => {
      const next = new Set(prev);
      if (next.has(pos)) next.delete(pos);
      else next.add(pos);
      return next;
    });
  };

  return (
    <ExerciseShell
      part={3}
      right={<TimerPill remainingMs={remainingMs} />}
      line={<TimeLine durationMs={TOTAL_TIME_MS} remainingMs={remainingMs} />}
      width="work"
      center
      dock={
        <>
          <Counter value={splits.size} unit={`/ ${expected.size} sanarajaa merkitty`} compact />
          <div className="flex items-center gap-5">
            <p className="m-0 hidden items-center gap-2.5 text-[15px] leading-[22px] text-ink-2 md:flex">
              <Keycap small>Enter</Keycap>
              <span>siirtää seuraavaan lauseeseen.</span>
            </p>
            <Button variant="tertiary" onClick={() => advance(splits)} className="h-[52px] px-5">
              Seuraava
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </>
      }
    >
      <div className="flex flex-col gap-3.5 md:gap-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-12">
          <h1 className="m-0 font-ui text-h2-sm text-ink md:flex-shrink-0 md:whitespace-nowrap md:text-h2">Sanaketjujen erottaminen</h1>
          <p className="m-0 text-body-sm text-ink md:max-w-[520px] md:text-body">
            Napauta sanan viimeistä kirjainta, niin sen perään tulee sanaraja.
            Kun kaikki rajat ovat paikoillaan, lause vaihtuu itsestään.
          </p>
        </div>

        {/* The sentence is keyed so a new one never inherits the old tape's measurement. */}
        <Sheet className="px-4 pb-2 pt-5 md:px-8 md:pb-2 md:pt-7">
          <ItemRail label={`Lause ${currentIndex + 1} / ${items.length}`} current={currentIndex} total={items.length} />
          <div className="select-none py-9 md:py-16" key={currentItem.id}>
            <LetterTape text={currentItem.chainedSentence} marked={splits} onToggle={toggleSplit} />
          </div>
        </Sheet>
      </div>
    </ExerciseShell>
  );
}
