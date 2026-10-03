import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { minimalPairItems as allMinimalPairItems } from "./minimalPairItems.fi";
import { saveMinimalPairsResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";
import { TWO_AFC_THRESHOLDS } from "@/lib/levels";
import { cn, shuffleArray } from "@/lib/utils";
import { ExerciseEndScreen } from "@/components/ExerciseEndScreen";
import { ExerciseShell, ItemLine, ItemPill } from "@/components/shell";
import { Sheet } from "@/components/primitives";

const ITEM_COUNT = DEV_FAST ? 2 : 15;
const ITEM_DURATION_MS = DEV_FAST ? 2000 : 6000;
const FEEDBACK_DELAY_MS = 900;

export function MinimalPairExercise() {
  const items = useMemo(() => shuffleArray(allMinimalPairItems).slice(0, ITEM_COUNT), []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentItem = items[currentIndex];
  const total = items.length;

  const advance = useCallback(() => {
    setSelectedAnswer(null);
    if (currentIndex >= total - 1) {
      setIsComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, total]);
  const advanceRef = useRef(advance);
  advanceRef.current = advance;

  // An unanswered item times out and counts as wrong.
  useEffect(() => {
    if (selectedAnswer !== null || isComplete) return;
    const id = setTimeout(() => advanceRef.current(), ITEM_DURATION_MS);
    return () => clearTimeout(id);
  }, [currentIndex, selectedAnswer, isComplete]);

  const handleSelect = (option: string) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(option);
    if (option === currentItem.correctAnswer) setCorrectCount((n) => n + 1);
    setTimeout(() => advanceRef.current(), FEEDBACK_DELAY_MS);
  };

  useEffect(() => {
    if (isComplete) saveMinimalPairsResult({ correct: correctCount, total });
  }, [isComplete, correctCount, total]);

  if (isComplete) {
    return (
      <ExerciseEndScreen
        title="Sanojen pituuden erottaminen"
        correct={correctCount}
        total={total}
        thresholds={TWO_AFC_THRESHOLDS}
      />
    );
  }

  const options = [currentItem.optionA, currentItem.optionB];

  return (
    <ExerciseShell
      width="narrow"
      center
      right={<ItemPill label="Lause" current={currentIndex + 1} total={total} />}
      line={<ItemLine current={currentIndex} total={total} />}
    >
      <div className="flex flex-col gap-6 md:gap-7">
        <h1 className="m-0 font-ui text-h2-sm text-ink md:text-h2">Sanojen pituuden erottaminen</h1>

        <Sheet className="flex flex-col items-center gap-6 px-6 py-8 md:gap-8 md:px-10 md:py-12">
          <p className="m-0 text-center font-ui text-[17px] font-bold leading-none text-ink-2">
            Valitse lauseeseen sopiva sana
          </p>

          <p className="m-0 max-w-[600px] text-center font-text text-[24px] font-bold leading-[34px] text-ink md:text-[32px] md:leading-[44px]">
            {currentItem.sentence}
          </p>

          {/* Per-item countdown: the only continuously moving element here. */}
          <div aria-hidden="true" className="h-1.5 w-[220px] overflow-hidden rounded-[3px] bg-well md:w-[360px]">
            <div
              key={currentIndex}
              className="ml-auto h-full rounded-[3px] bg-time"
              style={{
                animation: `drain ${ITEM_DURATION_MS}ms linear forwards`,
                animationPlayState: selectedAnswer !== null ? "paused" : "running",
              }}
            />
          </div>
        </Sheet>

        <div className="grid grid-cols-2 gap-3 md:gap-4">
          {options.map((option) => {
            const answered = selectedAnswer !== null;
            const isSelected = selectedAnswer === option;
            return (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                disabled={answered}
                aria-pressed={answered ? isSelected : undefined}
                className={cn(
                  "ls-t box-border flex h-16 items-center justify-center rounded-answer border-2 px-3 font-ui text-[18px] font-extrabold leading-none md:h-[92px] md:text-[22px]",
                  !answered && "border-brown bg-surface text-ink hover:bg-recessed active:bg-brown active:text-white",
                  answered && isSelected && "border-brown bg-brown text-white",
                  answered && !isSelected && "border-well bg-well text-ink-2",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    </ExerciseShell>
  );
}
