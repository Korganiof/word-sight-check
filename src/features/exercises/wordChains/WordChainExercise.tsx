import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { wordChainItems as allWordChainItems } from "./wordChainItems.fi";
import type { WordChainResult } from "./types";
import { saveWordChainsResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";
import { shuffleArray } from "@/lib/utils";

const wordChainItems = DEV_FAST
  ? allWordChainItems.slice(0, 2)
  : shuffleArray(allWordChainItems).slice(0, 10);
const TOTAL_TIME_MS = DEV_FAST ? 30_000 : 120_000;

function formatTime(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function normalize(s: string): string {
  return s.trim().replace(/\s+/g, " ").toLowerCase();
}

export function WordChainExercise() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [results, setResults] = useState<WordChainResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [remainingMs, setRemainingMs] = useState(TOTAL_TIME_MS);

  const itemStartRef = useRef<number>(performance.now());
  const exerciseStartRef = useRef<number>(performance.now());
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // keep latest results accessible inside timer callback without re-subscribing
  const resultsRef = useRef<WordChainResult[]>([]);
  const currentIndexRef = useRef<number>(0);
  const feedbackRef = useRef<boolean>(false);

  const currentItem = wordChainItems[currentIndex];

  const finishExercise = useCallback((finalResults: WordChainResult[]) => {
    if (timerRef.current) clearInterval(timerRef.current);
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
    const input = timedOut ? "" : (document.querySelector<HTMLInputElement>("#chain-input")?.value ?? "");
    const correct = !timedOut && normalize(input) === normalize(item.originalSentence);

    const result: WordChainResult = {
      item,
      userInput: input.trim(),
      correct,
      rtMs,
    };

    setFeedback(correct ? "correct" : "incorrect");

    setTimeout(() => {
      feedbackRef.current = false;
      const newResults = [...resultsRef.current, result];
      commitResult(result, newResults);
    }, 600);
  }, [commitResult]);

  // Global countdown timer — starts once on mount
  useEffect(() => {
    exerciseStartRef.current = performance.now();
    timerRef.current = setInterval(() => {
      const elapsed = performance.now() - exerciseStartRef.current;
      const remaining = Math.max(0, TOTAL_TIME_MS - elapsed);
      setRemainingMs(remaining);
      if (remaining === 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        // Auto-submit current item then finish with whatever results we have
        const item = wordChainItems[currentIndexRef.current];
        const input = document.querySelector<HTMLInputElement>("#chain-input")?.value ?? "";
        const correct = !feedbackRef.current && normalize(input) === normalize(item.originalSentence);
        const result: WordChainResult = {
          item,
          userInput: input.trim(),
          correct,
          rtMs: Math.round(performance.now() - itemStartRef.current),
        };
        finishExercise([...resultsRef.current, result]);
      }
    }, 100);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [finishExercise]);

  // Reset per-item state when index changes
  useEffect(() => {
    itemStartRef.current = performance.now();
    setInputValue("");
    setFeedback(null);
  }, [currentIndex]);

  // Focus input once feedback is cleared (input is re-enabled at that point)
  useEffect(() => {
    if (feedback === null) {
      inputRef.current?.focus();
    }
  }, [feedback]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit(false);
  }

  const isLow = remainingMs < 30_000;

  useEffect(() => {
    if (isComplete && results.length > 0) {
      saveWordChainsResult({ correct: results.filter(r => r.correct).length, total: results.length });
      navigate("/results");
    }
  }, [isComplete, results, navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="mb-8 space-y-2">
          <div className="flex justify-between items-center text-sm text-muted-foreground">
            <span>Lause {currentIndex + 1} / {wordChainItems.length}</span>
            <span
              className={`font-mono font-semibold text-base tabular-nums ${isLow ? "text-destructive" : "text-foreground"}`}
            >
              {formatTime(remainingMs)}
            </span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / wordChainItems.length) * 100}%` }}
            />
          </div>
          {/* Global time bar */}
          <div className="w-full bg-secondary rounded-full h-1">
            <div
              className={`h-1 rounded-full transition-none ${isLow ? "bg-destructive" : "bg-primary/40"}`}
              style={{ width: `${(remainingMs / TOTAL_TIME_MS) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sanaketjujen erottaminen
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-center text-sm text-muted-foreground">
                Lisää välilyönnit oikeisiin kohtiin. Kirjoita sanat välilyönneillä erotettuina.
              </p>

              <div className="text-center py-6">
                <p className="text-3xl font-bold tracking-wide break-all">{currentItem.chainedSentence}</p>
              </div>

              <input
                id="chain-input"
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!!feedback}
                placeholder="Kirjoita lause välilyönneillä..."
                className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary"
              />

              <Button
                className="w-full"
                onClick={() => handleSubmit(false)}
                disabled={!inputValue.trim() || !!feedback}
              >
                Tarkista
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Muista lisätä välilyönnit sanojen väliin.
          </p>
        </div>
      </footer>
    </div>
  );
}
