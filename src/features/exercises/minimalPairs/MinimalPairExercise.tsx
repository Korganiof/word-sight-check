import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { minimalPairItems as allMinimalPairItems } from "./minimalPairItems.fi";
import { saveMinimalPairsResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";
import { shuffleArray } from "@/lib/utils";

const minimalPairItems = DEV_FAST
  ? allMinimalPairItems.slice(0, 2)
  : shuffleArray(allMinimalPairItems).slice(0, 15);

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

  const advanceRef = useRef<() => void>(() => {});
  advanceRef.current = useCallback(() => {
    setSelectedAnswer(null);
    if (currentIndex >= total - 1) {
      setIsComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, total]);

  useEffect(() => {
    if (selectedAnswer !== null) return;
    const id = setTimeout(() => { advanceRef.current(); }, ITEM_DURATION_MS);
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
      navigate("/exercises");
    }
  }, [isComplete, correctCount, total, navigate]);

  const options = [currentItem.optionA, currentItem.optionB];

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
      </nav>

      {/* Progress */}
      <div className="px-6 pb-2 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
            Pituuserojen tunnistaminen
          </p>
          <p className="text-xs text-[#d2c5b0]">Kysymys {currentIndex + 1} / {total}</p>
        </div>
        <div className="h-1 bg-[#f9e4d6] rounded-full">
          <div
            className="h-1 bg-[#C69A2B] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Item countdown bar */}
      <div className="px-6 pt-2 max-w-2xl mx-auto w-full">
        <div className="h-0.5 bg-[#f9e4d6] rounded-full overflow-hidden">
          <div
            key={currentIndex}
            className="h-full bg-[#d2c5b0] rounded-full"
            style={{
              animation: `drain ${ITEM_DURATION_MS}ms linear forwards`,
              animationPlayState: selectedAnswer !== null ? "paused" : "running",
            }}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">

          <div
            className="bg-white rounded-xl p-8"
            style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
          >
            <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-6">
              Valitse lauseeseen sopiva sana
            </p>

            <p className="text-2xl font-bold text-[#241a11] leading-relaxed mb-8">
              {currentItem.sentence}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {options.map((option) => {
                const isSelected = selectedAnswer === option;

                let buttonClass =
                  "flex-1 h-20 rounded-xl text-2xl font-bold transition-colors ";

                if (selectedAnswer !== null) {
                  if (isSelected) {
                    buttonClass += "bg-[#C69A2B] text-white";
                  } else {
                    buttonClass += "bg-[#f9ede4] text-[#d2c5b0]";
                  }
                } else {
                  buttonClass +=
                    "bg-[#f9e4d6] text-[#241a11] hover:bg-[#C69A2B] hover:text-white cursor-pointer";
                }

                return (
                  <button
                    key={option}
                    className={buttonClass}
                    onClick={() => handleSelect(option)}
                    disabled={selectedAnswer !== null}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
