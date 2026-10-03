import React, { useEffect, useMemo, useRef, useState } from "react";
import { syllableItems as allSyllableItems } from "./syllableItems.fi";
import type { SyllableResult } from "./types";
import { saveSyllablesResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";
import { cn, shuffleArray } from "@/lib/utils";
import { ExerciseEndScreen } from "@/components/ExerciseEndScreen";
import { ExerciseShell, ItemLine } from "@/components/shell";
import { Button } from "@/components/Button";
import { Sheet } from "@/components/primitives";

const ITEM_COUNT = DEV_FAST ? 2 : 12;
const MS_PER_SYLLABLE = 1500;
const FEEDBACK_MS = 800;

type Phase = "showing" | "typing" | "feedback" | "done";

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function SyllableExercise() {
  const items = useMemo(() => shuffleArray(allSyllableItems).slice(0, ITEM_COUNT), []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [syllableIndex, setSyllableIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("showing");
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [results, setResults] = useState<SyllableResult[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const currentItem = items[currentIndex];

  useEffect(() => {
    setSyllableIndex(0);
    setPhase("showing");
    setInputValue("");
    setFeedback(null);
  }, [currentIndex]);

  useEffect(() => {
    if (phase !== "showing") return;
    const timer = setTimeout(() => {
      const next = syllableIndex + 1;
      if (next >= currentItem.syllables.length) {
        setPhase("typing");
      } else {
        setSyllableIndex(next);
      }
    }, MS_PER_SYLLABLE);
    return () => clearTimeout(timer);
  }, [syllableIndex, phase, currentItem.syllables.length]);

  useEffect(() => {
    if (phase === "typing") {
      inputRef.current?.focus();
    }
  }, [phase]);

  function handleSubmit() {
    if (phase !== "typing") return;
    const correct = normalize(inputValue) === normalize(currentItem.correctWord);
    const newResults = [...results, { item: currentItem, userInput: inputValue.trim(), correct }];
    setResults(newResults);
    setFeedback(correct ? "correct" : "incorrect");
    setPhase("feedback");

    setTimeout(() => {
      if (currentIndex < items.length - 1) {
        setCurrentIndex(i => i + 1);
      } else {
        saveSyllablesResult({
          correct: newResults.filter(r => r.correct).length,
          total: newResults.length,
        });
        setPhase("done");
      }
    }, FEEDBACK_MS);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  if (phase === "done") {
    return (
      <ExerciseEndScreen
        title="Sanojen muodostaminen tavuista"
        correct={results.filter(r => r.correct).length}
        total={results.length}
      />
    );
  }

  return (
    <ExerciseShell
      width="narrow"
      center
      right={
        // One text node so the label reads as a unit ("Sana 3 / 12").
        <div className="flex h-9 items-center rounded-pill bg-recessed px-3.5 font-ui text-[15px] font-bold leading-none text-ink tabular-nums md:h-10 md:px-4 md:text-[16px]">
          {`Sana ${currentIndex + 1} / ${items.length}`}
        </div>
      }
      line={<ItemLine current={currentIndex} total={items.length} />}
    >
      <div className="flex flex-col gap-6 md:gap-7">
        <h1 className="m-0 font-ui text-h2-sm text-ink md:text-h2">Sanojen muodostaminen tavuista</h1>

        <Sheet className="flex flex-col gap-6 p-6 md:p-10">
          <p className="m-0 text-center font-ui text-[17px] font-bold leading-none text-ink-2">
            {phase === "showing"
              ? `Tavu ${syllableIndex + 1} / ${currentItem.syllables.length}`
              : "Kirjoita sana"}
          </p>

          {/* Stage */}
          <div className="flex min-h-[160px] items-center justify-center md:min-h-[200px]">
            {phase === "showing" ? (
              <span
                key={`${currentIndex}-${syllableIndex}`}
                className="font-text text-[46px] font-bold leading-[54px] text-ink md:text-[84px] md:leading-[92px]"
                style={{ animation: `syllable-flash ${MS_PER_SYLLABLE}ms ease-in-out forwards` }}
              >
                {currentItem.syllables[syllableIndex]}
              </span>
            ) : (
              <p className="m-0 text-caption text-ink-2">Tavut piilotettu</p>
            )}
          </div>

          {phase !== "showing" && (
            <div className="flex flex-col gap-4 border-t border-line pt-6">
              <label htmlFor="syllable-input" className="font-ui text-[16px] font-bold leading-none text-ink">
                Kirjoita sana:
              </label>
              <input
                id="syllable-input"
                ref={inputRef}
                type="text"
                name={`syllable-input-${currentIndex}`}
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={phase === "feedback"}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck={false}
                data-lpignore="true"
                data-form-type="other"
                placeholder="Kirjoita tähän..."
                className="ls-t h-14 w-full rounded-btn border border-line bg-recessed px-4 font-text text-[19px] text-ink placeholder:text-ink-2 disabled:text-ink-2"
              />

              {feedback && (
                <p
                  className={cn(
                    "m-0 rounded-key px-4 py-2.5 text-center font-ui text-[15px] font-bold",
                    feedback === "correct" ? "bg-level-good-bg text-level-good" : "bg-level-clear-bg text-level-clear",
                  )}
                >
                  {feedback === "correct" ? "Oikein" : `Oikea sana: ${currentItem.correctWord}`}
                </p>
              )}

              <Button
                onClick={handleSubmit}
                disabled={!inputValue.trim() || phase === "feedback"}
                className="w-full"
              >
                Tarkista
              </Button>
            </div>
          )}
        </Sheet>

        <p className="m-0 text-center text-caption text-ink-2">
          Katso tavut tarkasti. Muodosta niistä sana ja kirjoita se, kun tavut katoavat.
        </p>
      </div>
    </ExerciseShell>
  );
}
