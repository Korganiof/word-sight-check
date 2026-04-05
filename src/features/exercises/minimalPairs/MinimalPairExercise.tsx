import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { minimalPairItems as allMinimalPairItems } from "./minimalPairItems.fi";
import { saveMinimalPairsResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";

const minimalPairItems = DEV_FAST ? allMinimalPairItems.slice(0, 2) : allMinimalPairItems;

const ITEM_DURATION_MS = DEV_FAST ? 2000 : 6000;
const FEEDBACK_DELAY_MS = 900;

export function MinimalPairExercise() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const currentItem = minimalPairItems[currentIndex];
  const total = minimalPairItems.length;
  const progressPct = Math.min(100, ((currentIndex + 1) / total) * 100);

  // Ref so the timeout callback never captures a stale advance function
  const advanceRef = useRef<() => void>(() => {});
  advanceRef.current = useCallback(() => {
    setSelectedAnswer(null);
    if (currentIndex >= total - 1) {
      setIsComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, total]);

  // Auto-advance on timeout. Clears itself if user answers first.
  useEffect(() => {
    if (selectedAnswer !== null) return;

    const id = setTimeout(() => {
      advanceRef.current();
    }, ITEM_DURATION_MS);

    return () => clearTimeout(id);
  }, [currentIndex, selectedAnswer]);

  const handleSelect = useCallback(
    (option: string) => {
      if (selectedAnswer !== null) return;

      const isCorrect = option === currentItem.correctAnswer;
      setSelectedAnswer(option);
      if (isCorrect) setCorrectCount((n) => n + 1);

      setTimeout(() => advanceRef.current(), FEEDBACK_DELAY_MS);
    },
    [selectedAnswer, currentItem]
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (isComplete) {
      saveMinimalPairsResult({ correct: correctCount, total });
      navigate("/exercise/word-chains");
    }
  }, [isComplete, correctCount, total, navigate]);

  const options = [currentItem.optionA, currentItem.optionB];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col gap-6 max-w-2xl">
        <div>
          <h1 className="text-2xl font-bold">Sanojen pituuden erottaminen</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Valitse lauseeseen sopiva sana.
          </p>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Kysymys {currentIndex + 1} / {total}
          </span>
        </div>

        <Progress value={progressPct} className="h-2" />

        {/* Per-item countdown bar */}
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            key={currentIndex}
            className="h-full bg-primary rounded-full"
            style={{
              animation: `drain ${ITEM_DURATION_MS}ms linear forwards`,
              animationPlayState: selectedAnswer !== null ? "paused" : "running",
            }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium leading-relaxed">
              {currentItem.sentence}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              {options.map((option) => {
                const isSelected = selectedAnswer === option;

                return (
                  <Button
                    key={option}
                    variant={isSelected ? "default" : "outline"}
                    size="lg"
                    className={cn("flex-1 text-2xl h-20 font-semibold")}
                    onClick={() => handleSelect(option)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </Button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

