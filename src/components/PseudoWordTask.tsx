import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type WordItem } from "@/lib/pseudowords";
import { type Trial, saveSession } from "@/lib/metrics";

interface PseudoWordTaskProps {
  items: WordItem[];
}

// Simple risk score calculation function
function calculateRiskScore(trials: Trial[]): number {
  if (trials.length === 0) return 0;
  const correctCount = trials.filter(t => t.correct).length;
  const accuracy = correctCount / trials.length;
  const avgRT = trials.reduce((sum, t) => sum + t.rtMs, 0) / trials.length;

  // Example: risk score is 0-100, higher is "riskier" (worse)
  // Lower accuracy and slower RT = higher risk
  // You can adjust the formula as needed
  // We'll use: risk = (1 - accuracy) * 70 + Math.min(avgRT / 2000, 1) * 30
  // (so accuracy is weighted more, RT capped at 2s for risk)
  const risk = (1 - accuracy) * 70 + Math.min(avgRT / 2000, 1) * 30;
  return Math.round(risk);
}

export function PseudoWordTask({ items }: PseudoWordTaskProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // refs for immediate, race-proof state
  const startRef = useRef<number>(0);
  const processingRef = useRef<boolean>(false);

  // button focus refs for a11y / fast keyboard flow
  const realBtnRef = useRef<HTMLButtonElement | null>(null);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  // Start timing when item is shown
  useEffect(() => {
    if (currentItem) {
      startRef.current = performance.now();
      // move focus to the first button each trial for fast enter/space users
      realBtnRef.current?.focus();
    }
  }, [currentIndex, currentItem]);

  const handleAnswer = useCallback(
    (answer: boolean) => {
      if (!currentItem) return;
      if (processingRef.current) return; // hard guard against double-submits
      processingRef.current = true;
      setIsProcessing(true);

      const endTime = performance.now();
      const rtMs = Math.round(endTime - startRef.current);

      const trial: Trial = {
        item: currentItem.text,
        isWord: currentItem.isWord,
        answer,
        correct: answer === currentItem.isWord,
        rtMs,
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
          saveSession(newTrials);

          // Calculate and save risk score in sessionStorage
          const riskScore = calculateRiskScore(newTrials);
          try {
            sessionStorage.setItem("riskScore", riskScore.toString());
          } catch (e) {
            // ignore storage errors
          }

          setTimeout(() => {
            navigate("/result");
          }, 200);
        }

        return newTrials;
      });
    },
    [currentItem, currentIndex, items.length, navigate]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (processingRef.current) return;
      // ignore auto-repeat (holding key down)
      if (e.repeat) return;

      const k = e.key.toLowerCase();
      if (k === "a") {
        e.preventDefault();
        handleAnswer(true);
      } else if (k === "l") {
        e.preventDefault();
        handleAnswer(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleAnswer]);

  if (!currentItem) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Trial {currentIndex + 1} of {items.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Main task card */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-2xl shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Is this a real word?
              </CardTitle>
              <CardDescription className="sr-only">
                Decide if the word shown is a real English word or not
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-8">
              {/* Live announcer for screen readers */}
              <div className="sr-only" aria-live="polite">
                {`Trial ${currentIndex + 1} of ${items.length}. Word: ${currentItem.text}`}
              </div>

              {/* Word display */}
              <div className="text-center py-12">
                <p className="text-5xl font-bold text-foreground tracking-wide">
                  {currentItem.text}
                </p>
              </div>

              {/* Answer buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  ref={realBtnRef}
                  size="lg"
                  variant="outline"
                  onClick={() => handleAnswer(true)}
                  disabled={isProcessing}
                  className="h-16 text-lg"
                  aria-label="Real word (Press A)"
                >
                  <span className="flex flex-col items-center gap-1">
                    <span>Real word</span>
                    <span className="text-xs text-muted-foreground">(Press A)</span>
                  </span>
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => handleAnswer(false)}
                  disabled={isProcessing}
                  className="h-16 text-lg"
                  aria-label="Not a word (Press L)"
                >
                  <span className="flex flex-col items-center gap-1">
                    <span>Not a word</span>
                    <span className="text-xs text-muted-foreground">(Press L)</span>
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t bg-card">
        <div className="container mx-auto px-4 py-4">
          <p className="text-sm text-muted-foreground text-center">
            Take your time and answer as accurately as possible
          </p>
        </div>
      </footer>
    </div>
  );
}