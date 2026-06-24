import React, { useState, useRef, useEffect, useCallback } from "react";
import { wordChainItems as allWordChainItems } from "./wordChainItems.fi";
import type { WordChainResult } from "./types";
import { saveWordChainsResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";
import { formatMmSs, shuffleArray } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { useScreeningFlow } from "@/hooks/useScreeningFlow";

const wordChainItems = DEV_FAST
  ? allWordChainItems.slice(0, 2)
  : shuffleArray(allWordChainItems).slice(0, 10);
const TOTAL_TIME_MS = DEV_FAST ? 30_000 : 90_000;

function normalize(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export function WordChainExercise() {
  const goToNext = useScreeningFlow();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [results, setResults] = useState<WordChainResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  const itemStartRef = useRef<number>(performance.now());
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultsRef = useRef<WordChainResult[]>([]);
  const currentIndexRef = useRef<number>(0);
  const feedbackRef = useRef<boolean>(false);
  const doneRef = useRef(false);

  const currentItem = wordChainItems[currentIndex];

  const finishExercise = useCallback((finalResults: WordChainResult[]) => {
    if (doneRef.current) return;
    doneRef.current = true;
    setResults(finalResults);
    setIsComplete(true);
  }, []);

  const commitResult = useCallback((result: WordChainResult, newResults: WordChainResult[]) => {
    resultsRef.current = newResults;
    if (currentIndexRef.current < wordChainItems.length - 1) {
      setResults(newResults);
      setCurrentIndex(i => {
        const next = i + 1;
        currentIndexRef.current = next;
        return next;
      });
    } else {
      finishExercise(newResults);
    }
  }, [finishExercise]);

  const handleSubmit = useCallback((timedOut = false) => {
    if (feedbackRef.current) return;
    feedbackRef.current = true;

    const rtMs = Math.round(performance.now() - itemStartRef.current);
    const item = wordChainItems[currentIndexRef.current];
    const input = timedOut ? "" : (inputRef.current?.value ?? "");
    const correct = !timedOut && normalize(input) === normalize(item.originalSentence);

    const result: WordChainResult = { item, userInput: input.trim(), correct, rtMs };

    setFeedback(correct ? "correct" : "incorrect");

    setTimeout(() => {
      feedbackRef.current = false;
      const newResults = [...resultsRef.current, result];
      commitResult(result, newResults);
    }, 600);
  }, [commitResult]);

  const handleTimeout = () => {
    if (doneRef.current) return;
    const item = wordChainItems[currentIndexRef.current];
    const input = inputRef.current?.value ?? "";
    const correct = !feedbackRef.current && normalize(input) === normalize(item.originalSentence);
    const result: WordChainResult = {
      item,
      userInput: input.trim(),
      correct,
      rtMs: Math.round(performance.now() - itemStartRef.current),
    };
    finishExercise([...resultsRef.current, result]);
  };

  const remainingMs = useCountdown({ durationMs: TOTAL_TIME_MS, onExpire: handleTimeout, intervalMs: 100 });

  useEffect(() => {
    itemStartRef.current = performance.now();
    setInputValue("");
    setFeedback(null);
  }, [currentIndex]);

  useEffect(() => {
    if (feedback === null) {
      inputRef.current?.focus();
    }
  }, [feedback]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit(false);
  }

  useEffect(() => {
    if (isComplete && results.length > 0) {
      saveWordChainsResult({ correct: results.filter(r => r.correct).length, total: results.length });
      goToNext();
    }
  }, [isComplete, results, goToNext]);

  const isLow = remainingMs < 30_000;
  const timeProgress = (remainingMs / TOTAL_TIME_MS) * 100;
  const itemProgress = ((currentIndex + 1) / wordChainItems.length) * 100;

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
          <p className="text-xs text-[#d2c5b0]">Lause {currentIndex + 1} / {wordChainItems.length}</p>
        </div>
        {/* Item progress */}
        <div className="h-1 bg-[#f9e4d6] rounded-full">
          <div
            className="h-1 bg-[#C69A2B] rounded-full transition-all duration-300"
            style={{ width: `${itemProgress}%` }}
          />
        </div>
        {/* Time progress */}
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
              Lisää välilyönnit oikeisiin kohtiin. Kirjoita sanat välilyönneillä erotettuina.
            </p>

            <div className="bg-[#f9ede4] rounded-xl px-6 py-8 mb-8 text-center">
              <p className="text-2xl font-bold text-[#241a11] tracking-tight break-all leading-relaxed">
                {currentItem.chainedSentence}
              </p>
            </div>

            <input
              id="chain-input"
              ref={inputRef}
              type="text"
              name={`chain-input-${currentIndex}`}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!!feedback}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              data-form-type="other"
              placeholder="Kirjoita lause välilyönneillä..."
              className="w-full rounded-lg bg-[#fff8f5] px-4 py-3 text-base text-[#241a11] outline-none transition-colors placeholder:text-[#d2c5b0] mb-4"
              style={{ border: "1.5px solid #f9e4d6" }}
              onFocus={e => (e.currentTarget.style.borderColor = "#C69A2B")}
              onBlur={e => (e.currentTarget.style.borderColor = "#f9e4d6")}
            />

            <button
              onClick={() => handleSubmit(false)}
              disabled={!inputValue.trim() || !!feedback}
              className="w-full bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tarkista
            </button>
          </div>

          <p className="text-center text-sm text-[#d2c5b0] mt-6">
            Muista lisätä välilyönnit sanojen väliin.
          </p>
        </div>
      </div>

    </div>
  );
}
