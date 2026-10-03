import { useMemo, useRef, useState } from "react";
import { spellingErrorItems as allItems } from "./spellingErrorItems.fi";
import { saveSpellingErrorsResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";
import { scoreMarking } from "@/lib/levels";
import { shuffleArray } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { useScreeningFlow } from "@/hooks/useScreeningFlow";
import { ExerciseShell, TimerPill, TimeLine, Counter } from "@/components/shell";
import { GridWord } from "@/components/marks";
import { Button } from "@/components/Button";
import { Sheet } from "@/components/primitives";

const DURATION_MS = DEV_FAST ? 30_000 : 210_000;

// The 100 words are read in groups: 4 columns × 5 rows on desktop, 2 × 5 on
// phones, with a wider gap between groups so the eye keeps its place.
const GROUP_DESKTOP = 20;
const GROUP_PHONE = 10;

function chunk<T>(arr: readonly T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

export function SpellingErrorsExercise() {
  const goToNext = useScreeningFlow();

  const items = useMemo(
    () => (DEV_FAST ? allItems.slice(0, 12) : shuffleArray(allItems)),
    [],
  );

  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());

  const finishedRef = useRef(false);
  const markedIdsRef = useRef<Set<string>>(new Set());

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;

    const marked = markedIdsRef.current;
    let hits = 0;
    let falseAlarms = 0;
    let targets = 0;
    for (const item of items) {
      if (item.hasError) {
        targets += 1;
        if (marked.has(item.id)) hits += 1;
      } else if (marked.has(item.id)) {
        falseAlarms += 1;
      }
    }
    saveSpellingErrorsResult(scoreMarking(hits, falseAlarms, targets));
    goToNext();
  };

  const remainingMs = useCountdown({ durationMs: DURATION_MS, onExpire: finish });

  const toggleMark = (id: string) => {
    if (finishedRef.current) return;
    setMarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      markedIdsRef.current = next;
      return next;
    });
  };

  // Groups of 20 made of two halves of 10: on desktop the halves dissolve
  // (`md:contents`) into one 4-column grid, on phones each half is its own
  // 2-column group.
  const groups = useMemo(() => chunk(items, GROUP_DESKTOP).map((g) => chunk(g, GROUP_PHONE)), [items]);

  return (
    <ExerciseShell
      part={4}
      right={<TimerPill remainingMs={remainingMs} />}
      line={<TimeLine durationMs={DURATION_MS} remainingMs={remainingMs} />}
      width="work"
      dock={
        <>
          <Counter value={markedIds.size} unit="merkittyä" />
          <Button variant="secondary" onClick={finish} className="w-[148px] md:h-14 md:w-[220px]">
            Valmis
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3.5 md:gap-7">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-12">
          <h1 className="m-0 font-ui text-h2-sm text-ink md:text-h2">Etsi kirjoitusvirheet</h1>
          <p className="m-0 text-body-sm text-ink md:max-w-[540px] md:text-body">
            Klikkaa kaikki sanat, joissa on kirjoitusvirhe. Voit poistaa valinnan
            klikkaamalla uudelleen. Paina <strong className="font-bold">Valmis</strong>, kun olet valmis —
            tai odota aika loppuun.
          </p>
        </div>

        <Sheet as="section" aria-label="Sanalista" className="flex flex-col gap-[18px] p-2.5 md:gap-6 md:p-6">
          {groups.map((halves, i) => (
            <div key={i} className="flex flex-col gap-[18px] md:grid md:grid-cols-4 md:gap-2">
              {halves.map((half, j) => (
                <div key={j} className="grid grid-cols-2 gap-2 md:contents">
                  {half.map((item) => (
                    <GridWord key={item.id} pressed={markedIds.has(item.id)} onToggle={() => toggleMark(item.id)}>
                      {item.word}
                    </GridWord>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </Sheet>
      </div>
    </ExerciseShell>
  );
}
