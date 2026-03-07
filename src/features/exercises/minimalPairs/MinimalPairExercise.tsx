import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { minimalPairItems } from "./minimalPairItems.fi";

const ITEM_DURATION_MS = 6000;
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

  if (isComplete) {
    return (
      <EndScreen
        correctCount={correctCount}
        total={total}
        onRestart={() => {
          setCurrentIndex(0);
          setSelectedAnswer(null);
          setCorrectCount(0);
          setIsComplete(false);
        }}
      />
    );
  }

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
                const isCorrect = option === currentItem.correctAnswer;
                let variant: "outline" | "default" | "destructive" = "outline";
                if (isSelected) {
                  variant = isCorrect ? "default" : "destructive";
                }

                return (
                  <Button
                    key={option}
                    variant={variant}
                    size="lg"
                    className={cn(
                      "flex-1 text-2xl h-20 font-semibold",
                      isSelected && isCorrect && "bg-green-600 hover:bg-green-600 border-green-600",
                      isSelected && !isCorrect && "bg-red-600 hover:bg-red-600 border-red-600"
                    )}
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

interface EndScreenProps {
  correctCount: number;
  total: number;
  onRestart: () => void;
}

function EndScreen({ correctCount, total, onRestart }: EndScreenProps) {
  const navigate = useNavigate();
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle>Harjoitus valmis</CardTitle>
          <p className="text-sm text-muted-foreground">
            Tuloksesi Sanojen pituuden erottaminen -harjoituksesta
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 rounded-lg bg-muted/50 text-center">
            <p className="text-4xl font-bold">{accuracy}%</p>
            <p className="text-sm text-muted-foreground mt-1">
              {correctCount} / {total} oikein
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button className="flex-1" size="lg" onClick={onRestart}>
              Aloita alusta
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              size="lg"
              onClick={() => navigate("/exercises")}
            >
              Takaisin harjoituslistaan
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
