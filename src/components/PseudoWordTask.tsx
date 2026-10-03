import { useState, useEffect, useCallback, useRef } from "react";
import type { WordItem } from "@/lib/pseudowords";
import type { Trial } from "@/lib/metrics";
import { saveSession } from "@/lib/metrics";
import { useScreeningFlow } from "@/hooks/useScreeningFlow";
import { Badge, ExerciseShell, ItemLine, ItemPill, Keycap } from "@/components/shell";
import { cn } from "@/lib/utils";

interface PseudoWordTaskProps {
  items: WordItem[];
  warmupCount?: number;
}

// Per-item limit. A timeout is recorded as a wrong answer — the Start page
// tells the user this.
const ITEM_TIMEOUT_MS = 3000;
const ADVANCE_DELAY_MS = 200;

const DESKTOP_QUERY = "(min-width: 768px)";

// The two answer keys are rendered once and placed either under the stage
// (desktop) or in the docked bar (phones), so there is never a duplicate
// pair of buttons in the DOM.
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

export function PseudoWordTask({ items, warmupCount = 0 }: PseudoWordTaskProps) {
  const goToNext = useScreeningFlow();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ITEM_TIMEOUT_MS);
  const isDesktop = useIsDesktop();

  const trialsRef = useRef<Trial[]>([]);
  const startRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const advanceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const realBtnRef = useRef<HTMLButtonElement | null>(null);

  const currentItem = items[currentIndex];
  const warmupTotal = Math.max(0, warmupCount);
  const isWarmup = currentIndex < warmupTotal;
  const mainTotal = Math.max(0, items.length - warmupTotal);
  const mainIndex = currentIndex - warmupTotal;

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (advanceRef.current) clearTimeout(advanceRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
    advanceRef.current = null;
  }, []);

  const handleAnswer = useCallback(
    (answer: boolean | null, timedOut = false) => {
      if (!currentItem || processingRef.current) return;
      processingRef.current = true;
      setIsProcessing(true);
      clearTimers();

      const rtMs = Math.round(performance.now() - startRef.current);
      trialsRef.current.push({
        item: currentItem.text,
        isWord: currentItem.isWord,
        answer,
        correct: answer === currentItem.isWord,
        rtMs,
        ...(timedOut && { timedOut: true }),
      });

      const isLast = currentIndex >= items.length - 1;
      if (isLast) {
        // Warm-up trials are practice only and never scored.
        saveSession(trialsRef.current.slice(warmupTotal));
      }

      advanceRef.current = setTimeout(() => {
        advanceRef.current = null;
        if (isLast) {
          goToNext();
          return;
        }
        processingRef.current = false;
        setIsProcessing(false);
        setCurrentIndex(i => i + 1);
      }, ADVANCE_DELAY_MS);
    },
    [currentItem, currentIndex, items.length, warmupTotal, goToNext, clearTimers]
  );

  useEffect(() => {
    if (!currentItem) return;
    clearTimers();
    startRef.current = performance.now();
    setTimeLeft(ITEM_TIMEOUT_MS);
    realBtnRef.current?.focus();

    intervalRef.current = setInterval(() => {
      setTimeLeft(Math.max(0, ITEM_TIMEOUT_MS - (performance.now() - startRef.current)));
    }, 50);

    timeoutRef.current = setTimeout(() => {
      handleAnswer(null, true);
    }, ITEM_TIMEOUT_MS);

    return clearTimers;
  }, [currentIndex, currentItem, clearTimers, handleAnswer]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (processingRef.current) return;
      if (e.repeat) return;
      const k = e.key.toLowerCase();
      if (k === "a") { e.preventDefault(); handleAnswer(true, false); }
      else if (k === "l") { e.preventDefault(); handleAnswer(false, false); }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleAnswer]);

  if (!currentItem) return null;

  const timeRatio = timeLeft / ITEM_TIMEOUT_MS;

  // Both keys share one neutral style so neither reads as the recommended answer.
  const keyClass = cn(
    "ls-t box-border flex flex-1 basis-0 items-center justify-center gap-3.5 rounded-answer border-2 border-brown bg-surface px-4 font-ui font-extrabold leading-none tracking-[-0.01em] text-ink",
    "hover:bg-recessed active:bg-brown active:text-white disabled:cursor-not-allowed disabled:opacity-60",
    isDesktop ? "h-[92px] text-[22px]" : "h-16 text-[18px]",
  );

  const answerKeys = (
    <div className={cn("flex w-full", isDesktop ? "gap-4" : "gap-3")}>
      <button
        ref={realBtnRef}
        type="button"
        disabled={isProcessing}
        onClick={() => handleAnswer(true, false)}
        aria-label="Oikea sana (A)"
        className={keyClass}
      >
        {isDesktop && <Keycap>A</Keycap>}
        <span>Oikea sana</span>
      </button>
      <button
        type="button"
        disabled={isProcessing}
        onClick={() => handleAnswer(false, false)}
        aria-label="Ei sana (L)"
        className={keyClass}
      >
        {isDesktop && <Keycap>L</Keycap>}
        <span>Ei sana</span>
      </button>
    </div>
  );

  // Screen-reader progress text; the pill in the app bar shows the same numbers.
  const progressText = isWarmup
    ? `Harjoituskierros ${currentIndex + 1} / ${warmupTotal}`
    : `Tehtävä ${mainIndex + 1} / ${mainTotal}`;

  return (
    <ExerciseShell
      part={1}
      width="narrow"
      center
      right={
        <>
          {isWarmup && <Badge>Harjoittelu</Badge>}
          {isWarmup ? (
            <ItemPill label="Harjoitus" current={currentIndex + 1} total={warmupTotal} />
          ) : (
            <ItemPill current={mainIndex + 1} total={mainTotal} />
          )}
          <span className="sr-only" aria-live="polite">{progressText}</span>
        </>
      }
      line={<ItemLine current={isWarmup ? -1 : mainIndex} total={mainTotal} />}
      dock={isDesktop ? undefined : answerKeys}
    >
      <div className="flex flex-col gap-4 md:gap-5">
        <h1 className="m-0 font-ui text-h2-sm text-ink md:text-h2">Sanantunnistus</h1>

        <section
          aria-live="polite"
          className="box-border flex min-h-[340px] flex-col items-center justify-center gap-6 rounded-sheet border border-line bg-surface shadow-sheet md:h-[340px] md:gap-[30px] md:rounded-sheet-lg"
        >
          <p className="m-0 font-ui text-[16px] font-bold leading-[22px] text-ink-2 md:text-[17px] md:leading-6">
            Onko tämä oikea sana?
          </p>
          <p className="m-0 max-w-full break-words px-4 text-center font-text text-[46px] font-bold leading-[54px] text-ink md:text-[84px] md:leading-[92px] md:tracking-[0.005em]">
            {currentItem.text}
          </p>
          {/* The 3 s bar: the only continuously moving element in the product. */}
          <div
            role="progressbar"
            aria-label="Aikaa tälle sanalle"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(timeRatio * 100)}
            className="h-1.5 w-[220px] overflow-hidden rounded-[3px] bg-well md:w-[360px]"
          >
            <div className="h-1.5 rounded-[3px] bg-time" style={{ width: `${timeRatio * 100}%` }} />
          </div>
        </section>

        {isDesktop && answerKeys}
      </div>
    </ExerciseShell>
  );
}
