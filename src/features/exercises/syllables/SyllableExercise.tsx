import React, { useEffect, useMemo, useRef, useState } from "react";
import { CircleCheck, Info } from "lucide-react";
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
const DESKTOP_QUERY = "(min-width: 768px)";

type Phase = "showing" | "typing" | "feedback" | "done";

// The submit button is rendered once: beside the input on desktop, in the
// docked bar on phones.
function useIsDesktop(): boolean {
  const [desktop, setDesktop] = useState(() =>
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia(DESKTOP_QUERY).matches
      : true,
  );
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia(DESKTOP_QUERY);
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return desktop;
}

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
  const isDesktop = useIsDesktop();
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

  const answering = phase !== "showing";
  const canSubmit = phase === "typing" && inputValue.trim() !== "";
  // One submit button, placed beside the input (desktop) or in the docked bar
  // (phones) — never two copies in the DOM.
  const submitButton = (
    <Button
      variant="secondary"
      onClick={handleSubmit}
      disabled={!canSubmit}
      className={cn("flex-shrink-0", isDesktop ? "h-[72px] rounded-tile px-8" : "w-full")}
    >
      Tarkista
    </Button>
  );

  return (
    <ExerciseShell
      width="narrow"
      center
      centerLabel="Lisäharjoitus"
      right={
        <>
          {/* One text node so the label reads as a unit ("Sana 3 / 12"). */}
          <div className="flex h-9 items-center rounded-pill bg-recessed px-3.5 font-ui text-[15px] font-bold leading-none text-ink tabular-nums md:h-10 md:px-4 md:text-[16px]">
            {`Sana ${currentIndex + 1} / ${items.length}`}
          </div>
        </>
      }
      line={<ItemLine current={currentIndex} total={items.length} />}
      dock={isDesktop ? undefined : <div className="w-full py-3">{submitButton}</div>}
    >
      <div className="flex flex-col gap-5 md:gap-7 md:pb-6 md:pt-4">
        <h1 className="m-0 font-ui text-h2-sm text-ink md:text-h2">Sanojen muodostaminen tavuista</h1>

        <Sheet className="flex min-h-[360px] flex-col items-center justify-center gap-6 px-5 py-8 md:min-h-[340px] md:px-12 md:py-10">
          {!answering ? (
            <div aria-live="polite" className="flex flex-col items-center gap-5">
              <p className="m-0 font-ui text-[16px] font-bold leading-none text-ink-2">
                {`Tavu ${syllableIndex + 1} / ${currentItem.syllables.length}`}
              </p>
              <span
                key={`${currentIndex}-${syllableIndex}`}
                className="font-text text-[84px] font-bold leading-[92px] text-ink md:text-[112px] md:leading-[120px]"
                style={{ animation: `syllable-flash ${MS_PER_SYLLABLE}ms ease-in-out forwards` }}
              >
                {currentItem.syllables[syllableIndex]}
              </span>
              <span aria-hidden="true" className="flex gap-1">
                {currentItem.syllables.map((_, i) => (
                  <span
                    key={i}
                    className={cn(
                      "h-1.5 w-[34px] rounded-[3px]",
                      i < syllableIndex ? "bg-brown" : i === syllableIndex ? "bg-gold" : "bg-line",
                    )}
                  />
                ))}
              </span>
            </div>
          ) : (
            <div className="flex w-full max-w-[560px] flex-col items-center gap-4">
              <label htmlFor="syllable-input" className="font-ui text-[16px] font-bold leading-none text-ink-2">
                Kirjoita sana:
              </label>
              <div className="flex w-full items-stretch gap-3">
                <input
                  id="syllable-input"
                  ref={inputRef}
                  type="text"
                  name={`syllable-input-${currentIndex}`}
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  readOnly={phase === "feedback"}
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  data-lpignore="true"
                  data-form-type="other"
                  placeholder="Kirjoita tähän..."
                  className={cn(
                    "ls-t h-16 min-w-0 flex-1 rounded-tile border-2 bg-surface px-4 text-center font-text text-[30px] font-semibold text-ink placeholder:text-[19px] placeholder:font-normal placeholder:text-ink-2 md:h-[72px] md:text-[34px]",
                    phase === "feedback" ? "border-line-strong" : "border-brown",
                  )}
                />
                {isDesktop && submitButton}
              </div>

              <div aria-live="polite" className="min-h-[28px]">
                {feedback === "correct" && (
                  <p className="m-0 flex items-center gap-2 font-ui text-[18px] font-extrabold leading-7 text-level-good">
                    <CircleCheck className="h-5 w-5 flex-shrink-0" strokeWidth={2.2} aria-hidden="true" />
                    Oikein
                  </p>
                )}
                {feedback === "incorrect" && (
                  <p className="m-0 flex items-center gap-2 text-[18px] leading-7 text-ink">
                    <Info className="h-5 w-5 flex-shrink-0 text-ink-2" strokeWidth={2.2} aria-hidden="true" />
                    {`Oikea sana: ${currentItem.correctWord}`}
                  </p>
                )}
              </div>
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
