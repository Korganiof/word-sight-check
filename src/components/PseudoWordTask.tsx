import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type WordItem } from "@/lib/pseudowords";
import { type Trial, saveSession } from "@/lib/metrics";

interface PseudoWordTaskProps {
  items: WordItem[];
}

export function PseudoWordTask({ items }: PseudoWordTaskProps) {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [startTime, setStartTime] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentItem = items[currentIndex];
  const progress = ((currentIndex + 1) / items.length) * 100;

  // Start timing when item is shown
  useEffect(() => {
    if (currentItem) {
      setStartTime(performance.now());
    }
  }, [currentIndex, currentItem]);

  const handleAnswer = useCallback(
    (answer: boolean) => {
      if (isProcessing || !currentItem) return;

      setIsProcessing(true);
      const endTime = performance.now();
      const rtMs = Math.round(endTime - startTime);

      const trial: Trial = {
        item: currentItem.text,
        isWord: currentItem.isWord,
        answer,
        correct: answer === currentItem.isWord,
        rtMs,
      };

      const newTrials = [...trials, trial];
      setTrials(newTrials);

      // Move to next or finish
      if (currentIndex < items.length - 1) {
        setTimeout(() => {
          setCurrentIndex(currentIndex + 1);
          setIsProcessing(false);
        }, 300);
      } else {
        saveSession(newTrials);
        setTimeout(() => {
          navigate("/result");
        }, 300);
      }
    },
    [currentItem, currentIndex, items.length, isProcessing, navigate, startTime, trials]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isProcessing) return;
      
      if (e.key.toLowerCase() === "a") {
        handleAnswer(true);
      } else if (e.key.toLowerCase() === "l") {
        handleAnswer(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleAnswer, isProcessing]);

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
              {/* Word display */}
              <div className="text-center py-12">
                <p className="text-5xl font-bold text-foreground tracking-wide">
                  {currentItem.text}
                </p>
              </div>

              {/* Answer buttons */}
              <div className="grid grid-cols-2 gap-4">
                <Button
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
