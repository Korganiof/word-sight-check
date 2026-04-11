import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import type { WordItem } from "@/lib/pseudowords";
import type { Trial } from "@/lib/metrics";
import { saveSession } from "@/lib/metrics";

interface PseudoWordTaskProps {
  items: WordItem[];
  warmupCount?: number;
}

const ITEM_TIMEOUT_MS = 3000;

export function PseudoWordTask({ items, warmupCount = 0 }: PseudoWordTaskProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ITEM_TIMEOUT_MS);

  const startRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const realBtnRef = useRef<HTMLButtonElement | null>(null);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;
  const warmupTotal = Math.max(0, warmupCount);
  const isWarmup = currentIndex < warmupTotal;
  const mainTotal = Math.max(0, items.length - warmupTotal);

  const clearTimers = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  }, []);

  const handleAnswer = useCallback(
    (answer: boolean | null, timedOut = false) => {
      if (!currentItem) return;
      if (processingRef.current) return;
      processingRef.current = true;
      setIsProcessing(true);
      clearTimers();

      const endTime = performance.now();
      const rtMs = Math.round(endTime - startRef.current);

      const trial: Trial = {
        item: currentItem.text,
        isWord: currentItem.isWord,
        answer,
        correct: answer === currentItem.isWord,
        rtMs,
        ...(timedOut && { timedOut: true }),
      };

      setTrials(prev => {
        const newTrials = [...prev, trial];

        if (currentIndex < items.length - 1) {
          setTimeout(() => {
            setCurrentIndex(i => i + 1);
            setIsProcessing(false);
            processingRef.current = false;
          }, 200);
        } else {
          const scoredTrials =
            warmupCount > 0 ? newTrials.slice(Math.min(warmupCount, newTrials.length)) : newTrials;
          saveSession(scoredTrials);
          setTimeout(() => {
            navigate("/task/word-search");
          }, 200);
        }

        return newTrials;
      });
    },
    [currentItem, currentIndex, items.length, warmupCount, navigate, clearTimers]
  );

  useEffect(() => {
    if (!currentItem) return;
    clearTimers();
    startRef.current = performance.now();
    setTimeLeft(ITEM_TIMEOUT_MS);
    realBtnRef.current?.focus();

    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 50));
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

  const progressLabel = isWarmup
    ? `Harjoituskierros ${currentIndex + 1} / ${warmupTotal}`
    : `Tehtävä ${currentIndex - warmupTotal + 1} / ${mainTotal}`;

  const timeRatio = timeLeft / ITEM_TIMEOUT_MS;
  const timerColor = timeLeft < 1000 ? "#ef4444" : "#C69A2B";

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
        {isWarmup && (
          <span className="text-xs font-semibold text-[#785a00] bg-[#f9e4d6] px-3 py-1 rounded-md uppercase tracking-widest">
            Harjoittelu
          </span>
        )}
      </nav>

      {/* Progress header */}
      <div className="px-6 pb-2 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
            {progressLabel}
          </p>
          <p className="text-xs text-[#d2c5b0]">{Math.round(progress)}%</p>
        </div>
        <div className="h-1 bg-[#f9e4d6] rounded-full">
          <div
            className="h-1 bg-[#C69A2B] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">

          <div
            className="bg-white rounded-xl"
            style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
          >
            {/* Question label */}
            <div className="px-6 pt-6 pb-2 text-center">
              <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
                Onko tämä oikea sana?
              </p>
            </div>

            {/* Word display */}
            <div className="flex items-center justify-center py-12 px-6">
              <p className="text-5xl font-bold text-[#241a11] tracking-tight">
                {currentItem.text}
              </p>
            </div>

            {/* Timer bar */}
            <div className="mx-6 mb-6 h-1.5 bg-[#f9e4d6] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-none"
                style={{
                  width: `${timeRatio * 100}%`,
                  backgroundColor: timerColor,
                }}
              />
            </div>

            {/* Answer buttons */}
            <div className="grid grid-cols-2 gap-4 px-6 pb-6">
              <button
                ref={realBtnRef}
                disabled={isProcessing}
                onClick={() => handleAnswer(true, false)}
                aria-label="Oikea sana (A)"
                className="h-16 rounded-lg font-semibold text-white text-base bg-[#C69A2B] hover:bg-[#785a00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex flex-col items-center justify-center gap-0.5"
              >
                <span>Oikea sana</span>
                <span className="text-xs opacity-70">(A)</span>
              </button>
              <button
                disabled={isProcessing}
                onClick={() => handleAnswer(false, false)}
                aria-label="Ei sana (L)"
                className="h-16 rounded-lg font-semibold text-white text-base bg-[#4A3728] hover:bg-[#2F241B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex flex-col items-center justify-center gap-0.5"
              >
                <span>Ei sana</span>
                <span className="text-xs opacity-70">(L)</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Footer hint */}
      <footer className="px-6 py-4 text-center">
        <p className="text-sm text-[#d2c5b0]">
          Vastaa mahdollisimman tarkasti. Älä kuitenkaan mieti liian pitkään.
        </p>
      </footer>

    </div>
  );
}
