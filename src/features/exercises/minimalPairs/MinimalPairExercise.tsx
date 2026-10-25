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
const DESKTOP_QUERY = "(min-width: 768px)";

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

export function MinimalPairExercise() {
  const items = useMemo(() => shuffleArray(allMinimalPairItems).slice(0, ITEM_COUNT), []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const isDesktop = useIsDesktop();

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
  const answered = selectedAnswer !== null;
  // The gap is drawn as an underline; the sentence keeps its own spaces, so
  // there is a word space on each side and none before punctuation.
  const [before, after = ""] = currentItem.sentence.split(/_{2,}/);

  // The two keys are rendered once: under the stage (desktop) or in the
  // docked bar (phones).
  const answerKeys = (
    <div className={cn("grid w-full grid-cols-2", isDesktop ? "gap-4" : "gap-3 py-3")}>
      {options.map((option) => {
        const isSelected = selectedAnswer === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            disabled={answered}
            aria-pressed={answered ? isSelected : undefined}
            className={cn(
              "ls-t box-border flex items-center justify-center rounded-answer border-2 px-3 font-text font-bold leading-none",
              isDesktop ? "h-[92px] text-[28px]" : "h-16 text-[22px]",
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
  );

  return (
    <ExerciseShell
      width="narrow"
      center
      centerLabel="Lisäharjoitus"
      right={
        <>
          <ItemPill label="Lause" current={currentIndex + 1} total={total} />
        </>
      }
      line={<ItemLine current={currentIndex} total={total} />}
      dock={isDesktop ? undefined : answerKeys}
    >
      <div className="flex flex-col gap-5 md:gap-7 md:pb-6 md:pt-4">
        <h1 className="m-0 font-ui text-h2-sm text-ink md:text-h2">Sanojen pituuden erottaminen</h1>

        <Sheet className="flex min-h-[360px] flex-col items-center justify-center gap-7 px-5 py-8 md:min-h-[320px] md:gap-8 md:px-12 md:py-10">
          <p className="m-0 text-center font-ui text-[17px] font-bold leading-none text-ink-2">
            Valitse lauseeseen sopiva sana
          </p>

          <p className="m-0 max-w-[640px] text-center font-text text-[26px] font-semibold leading-[40px] text-ink md:text-[40px] md:leading-[56px]">
            {before}
            <span
              aria-hidden="true"
              className="inline-block h-[0.9em] w-[110px] translate-y-[0.12em] border-b-[3px] border-line-strong align-baseline md:w-[150px]"
            />
            <span className="sr-only">(tyhjä kohta)</span>
            {after}
          </p>

          {/* Per-item countdown: the only continuously moving element here. */}
          <div aria-hidden="true" className="h-1.5 w-[220px] overflow-hidden rounded-[3px] bg-well md:w-[360px]">
            <div
              key={currentIndex}
              className="ml-auto h-full rounded-[3px] bg-time"
              style={{
                animation: `drain ${ITEM_DURATION_MS}ms linear forwards`,
                animationPlayState: answered ? "paused" : "running",
              }}
            />
          </div>
        </Sheet>

        {isDesktop && answerKeys}
      </div>
    </ExerciseShell>
  );
}
