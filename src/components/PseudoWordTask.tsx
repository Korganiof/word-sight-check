import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { WordItem } from "@/lib/pseudowords";
import type { Trial } from "@/lib/metrics";
import { saveSession } from "@/lib/metrics";

interface PseudoWordTaskProps {
  items: WordItem[];
  /**
   * Number of initial warm-up trials that should NOT be included
   * in scoring / saved session data.
   */
  warmupCount?: number;
}

const ITEM_TIMEOUT_MS = 3000;

export function PseudoWordTask({ items, warmupCount = 0 }: PseudoWordTaskProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ITEM_TIMEOUT_MS);

  // refs for immediate, race-proof state
  const startRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // button focus refs for a11y / fast keyboard flow
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
      if (processingRef.current) return; // hard guard against double-submits
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

        // Move to next or finish
        if (currentIndex < items.length - 1) {
          // small delay for UI feedback, then advance
          setTimeout(() => {
            setCurrentIndex(i => i + 1);
            setIsProcessing(false);
            processingRef.current = false;
          }, 200);
        } else {
          // Exclude warm-up trials from saved/scored session
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

  // Start timing and countdown when item is shown
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

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (processingRef.current) return;
      // ignore auto-repeat (holding key down)
      if (e.repeat) return;

      const k = e.key.toLowerCase();
      if (k === "a") {
        e.preventDefault();
        handleAnswer(true, false);
      } else if (k === "l") {
        e.preventDefault();
        handleAnswer(false, false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleAnswer]);

  if (!currentItem) return null;

  const progressLabel = isWarmup
    ? `Harjoituskierros ${currentIndex + 1} / ${warmupTotal}`
    : `Tehtävä ${currentIndex - warmupTotal + 1} / ${mainTotal}`;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>{progressLabel}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Onko tämä oikea sana?
              </CardTitle>
              <CardDescription className="sr-only">
                Päätä onko näytetty sana oikea suomen sana vai ei
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="text-center py-12">
                <p className="text-5xl font-bold text-foreground tracking-wide">{currentItem.text}</p>
              </div>

              <div className="w-full bg-secondary rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full transition-none"
                  style={{
                    width: `${(timeLeft / ITEM_TIMEOUT_MS) * 100}%`,
                    backgroundColor: timeLeft < 1000 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))',
                  }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  ref={realBtnRef}
                  variant="outline"
                  className="h-16 text-lg px-8"
                  disabled={isProcessing}
                  aria-label="Oikea sana (A)"
                  onClick={() => handleAnswer(true, false)}
                >
                  <span className="flex flex-col items-center gap-1">
                    <span>Oikea sana</span>
                    <span className="text-xs text-muted-foreground">(A)</span>
                  </span>
                </Button>
                <Button
                  variant="outline"
                  className="h-16 text-lg px-8"
                  disabled={isProcessing}
                  aria-label="Ei sana (L)"
                  onClick={() => handleAnswer(false, false)}
                >
                  <span className="flex flex-col items-center gap-1">
                    <span>Ei sana</span>
                    <span className="text-xs text-muted-foreground">(L)</span>
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Vastaa mahdollisimman tarkasti. Älä kuitenkaan mieti liian pitkään.
          </p>
        </div>
      </footer>
    </div>
  );
}
