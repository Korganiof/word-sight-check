import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { wordChainItems as allWordChainItems } from "./wordChainItems.fi";
import { saveWordChainsResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";
import { formatMmSs, shuffleArray } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { useScreeningFlow } from "@/hooks/useScreeningFlow";

// NMI Tekninen 2 has the reader mark word boundaries in ~100 words of chained
// text with a pen in 90 s. Tapping letters is the closest browser equivalent
// (typing the sentence out would measure typing speed). 15 sentences ≈ 60
// words: a fluent reader clears them with time to spare, a slow reader is cut
// off — that is what the timer is for, so unreached sentences count as wrong.
const ITEM_COUNT = DEV_FAST ? 2 : 15;
const TOTAL_TIME_MS = DEV_FAST ? 30_000 : 90_000;
const FEEDBACK_MS = 600;

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
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const correctRef = useRef(0);
  const doneRef = useRef(false);
  const feedbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentItem = items[currentIndex];
  const expected = useMemo(() => boundaryPositions(currentItem.originalSentence), [currentItem]);

  const finish = useCallback((correct: number) => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
    saveWordChainsResult({ correct, total: items.length });
    goToNext();
  }, [items.length, goToNext]);

  const handleCheck = useCallback(() => {
    if (feedback !== null || doneRef.current) return;
    const correct = sameSet(splits, expected);
    if (correct) correctRef.current += 1;
    setFeedback(correct ? "correct" : "incorrect");

    feedbackTimerRef.current = setTimeout(() => {
      feedbackTimerRef.current = null;
      if (currentIndex < items.length - 1) {
        setSplits(new Set());
        setFeedback(null);
        setCurrentIndex(i => i + 1);
      } else {
        finish(correctRef.current);
      }
    }, FEEDBACK_MS);
  }, [feedback, splits, expected, currentIndex, items.length, finish]);

  // Time's up: credit a correct but not-yet-checked answer, then score
  // everything reached against the full set.
  const handleTimeout = () => {
    const pending = feedback === null && sameSet(splits, expected) ? 1 : 0;
    finish(correctRef.current + pending);
  };

  const remainingMs = useCountdown({ durationMs: TOTAL_TIME_MS, onExpire: handleTimeout, intervalMs: 100 });

  useEffect(() => () => {
    if (feedbackTimerRef.current) clearTimeout(feedbackTimerRef.current);
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleCheck();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleCheck]);

  const toggleSplit = (pos: number) => {
    if (feedback !== null || doneRef.current) return;
    setSplits(prev => {
      const next = new Set(prev);
      if (next.has(pos)) next.delete(pos);
      else next.add(pos);
      return next;
    });
  };

  const chars = currentItem.chainedSentence.split("");
  const barColor =
    feedback === "correct" ? "#4f7a3a" : feedback === "incorrect" ? "#a6442a" : "#C69A2B";

  const isLow = remainingMs < 30_000;
  const timeProgress = (remainingMs / TOTAL_TIME_MS) * 100;
  const itemProgress = ((currentIndex + 1) / items.length) * 100;

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
        <span
          className="font-mono font-bold text-lg tabular-nums"
          style={{ color: isLow ? "#ef4444" : "#241a11" }}
        >
          {formatMmSs(remainingMs)}
        </span>
      </nav>

      {/* Progress bars */}
      <div className="px-6 pb-2 max-w-2xl mx-auto w-full space-y-1.5">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
            Osa 3 — Sanarajojen hahmottaminen
          </p>
          <p className="text-xs text-[#755e4d]">Lause {currentIndex + 1} / {items.length}</p>
        </div>
        <div className="h-1 bg-[#f9e4d6] rounded-full">
          <div
            className="h-1 bg-[#C69A2B] rounded-full transition-all duration-300"
            style={{ width: `${itemProgress}%` }}
          />
        </div>
        <div className="h-0.5 bg-[#f9e4d6] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-none"
            style={{
              width: `${timeProgress}%`,
              backgroundColor: isLow ? "#ef4444" : "#d2c5b0",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">

          <div
            className="bg-white rounded-xl p-8"
            style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
          >
            <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-2">
              Sanaketjujen erottaminen
            </p>
            <p className="text-sm text-[#755e4d] mb-8">
              Napauta sanan viimeistä kirjainta, niin sen perään tulee sanaraja.
              Napauta uudelleen, jos haluat poistaa sen.
            </p>

            <div className="bg-[#f9ede4] rounded-xl px-4 py-8 mb-8 select-none">
              <p className="flex flex-wrap items-center justify-center leading-relaxed">
                {chars.map((ch, i) => {
                  const pos = i + 1;
                  const isLast = i === chars.length - 1;
                  const split = splits.has(pos);
                  return (
                    <span key={i} className="flex items-center">
                      <button
                        type="button"
                        onClick={() => toggleSplit(pos)}
                        disabled={isLast || feedback !== null}
                        aria-pressed={isLast ? undefined : split}
                        aria-label={isLast ? ch : `${ch} — sanaraja ${split ? "merkitty" : "ei merkitty"}`}
                        className="px-[3px] py-1 rounded-sm text-2xl font-bold text-[#241a11] tracking-tight touch-manipulation transition-colors hover:bg-[#f9e4d6] disabled:hover:bg-transparent"
                      >
                        {ch}
                      </button>
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className={`inline-block w-[2px] h-7 rounded-full transition-all ${split ? "mx-2 opacity-100" : "mx-0 opacity-0"}`}
                          style={{ backgroundColor: barColor }}
                        />
                      )}
                    </span>
                  );
                })}
              </p>
            </div>

            <button
              onClick={handleCheck}
              disabled={splits.size === 0 || feedback !== null}
              className="w-full bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tarkista
            </button>
          </div>

          <p className="text-center text-sm text-[#755e4d] mt-6">
            Enter tarkistaa vastauksen.
          </p>
        </div>
      </div>

    </div>
  );
}
