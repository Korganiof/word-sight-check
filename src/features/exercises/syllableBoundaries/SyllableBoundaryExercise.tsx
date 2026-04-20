import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { syllableBoundaryItems as allItems } from "./syllableBoundaryItems.fi";
import { saveSyllableBoundariesResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";

export function SyllableBoundaryExercise() {
  const navigate = useNavigate();

  const items = useMemo(() => (DEV_FAST ? allItems.slice(0, 3) : allItems), []);

  const [index, setIndex] = useState(0);
  const [boundaries, setBoundaries] = useState<Set<number>>(new Set());
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [correctCount, setCorrectCount] = useState(0);

  const current = items[index];

  const expectedBoundaries = useMemo(() => {
    const set = new Set<number>();
    let pos = 0;
    for (let i = 0; i < current.syllables.length - 1; i++) {
      pos += current.syllables[i].length;
      set.add(pos);
    }
    return set;
  }, [current]);

  const toggleBoundary = (pos: number) => {
    if (feedback !== null) return;
    setBoundaries((prev) => {
      const next = new Set(prev);
      if (next.has(pos)) next.delete(pos);
      else next.add(pos);
      return next;
    });
  };

  const check = useCallback(() => {
    if (feedback !== null) return;
    const matches =
      boundaries.size === expectedBoundaries.size &&
      [...boundaries].every((b) => expectedBoundaries.has(b));
    if (matches) setCorrectCount((n) => n + 1);
    setFeedback(matches ? "correct" : "incorrect");

    setTimeout(() => {
      setFeedback(null);
      setBoundaries(new Set());
      if (index < items.length - 1) {
        setIndex((i) => i + 1);
      } else {
        saveSyllableBoundariesResult({
          correct: correctCount + (matches ? 1 : 0),
          total: items.length,
        });
        navigate("/exercises");
      }
    }, 900);
  }, [boundaries, expectedBoundaries, feedback, index, items.length, correctCount, navigate]);

  const chars = current.word.split("");

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
      </nav>

      <div className="px-6 pb-2 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
            Tavurajojen merkitseminen
          </p>
          <p className="text-xs text-[#d2c5b0]">
            Sana {index + 1} / {items.length}
          </p>
        </div>
        <div className="h-1 bg-[#f9e4d6] rounded-full">
          <div
            className="h-1 bg-[#C69A2B] rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / items.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <div
            className="bg-white rounded-xl p-8"
            style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
          >
            <p className="text-sm text-[#755e4d] mb-6 text-center">
              Klikkaa kirjainten välistä merkitäksesi tavurajan. Klikkaa uudelleen poistaaksesi.
            </p>

            <div className="flex items-center justify-center flex-wrap bg-[#f9ede4] rounded-xl px-4 py-8 mb-6 select-none">
              {chars.map((ch, i) => (
                <span key={`ch-${i}`} className="flex items-center">
                  <span className="text-3xl font-bold text-[#241a11] tracking-tight">
                    {ch}
                  </span>
                  {i < chars.length - 1 && (
                    <button
                      onClick={() => toggleBoundary(i + 1)}
                      disabled={feedback !== null}
                      className="mx-0.5 w-2 h-9 flex items-center justify-center transition-colors"
                      aria-label={`Tavuraja kohdassa ${i + 1}`}
                    >
                      <span
                        className={`w-[2px] h-7 transition-colors ${
                          boundaries.has(i + 1)
                            ? "bg-[#C69A2B]"
                            : "bg-[#d2c5b0] opacity-40 hover:opacity-100"
                        }`}
                      />
                    </button>
                  )}
                </span>
              ))}
            </div>

            {feedback && (
              <div className="text-center text-sm font-semibold py-2 rounded-lg mb-4 bg-[#f9e4d6] text-[#785a00]">
                {feedback === "correct" ? "Oikein" : `Oikea: ${current.syllables.join("-")}`}
              </div>
            )}

            <button
              onClick={check}
              disabled={feedback !== null}
              className="w-full bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Tarkista
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
