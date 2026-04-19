import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { spellingErrorItems as allItems } from "./spellingErrorItems.fi";
import { saveSpellingErrorsResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";
import { shuffleArray } from "@/lib/utils";

const DURATION_MS = DEV_FAST ? 30_000 : 120_000;

export function SpellingErrorsExercise() {
  const navigate = useNavigate();

  const items = useMemo(
    () => (DEV_FAST ? allItems.slice(0, 12) : shuffleArray(allItems)),
    [],
  );

  const [remainingMs, setRemainingMs] = useState(DURATION_MS);
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());

  const startRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const finishedRef = useRef(false);
  const markedIdsRef = useRef<Set<string>>(new Set());

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    const marked = markedIdsRef.current;
    let correct = 0;
    for (const item of items) {
      const isMarked = marked.has(item.id);
      if (isMarked && item.hasError) correct += 1;
      else if (!isMarked && !item.hasError) correct += 1;
    }
    saveSpellingErrorsResult({ correct, total: items.length });
    navigate("/exercise/reading-comp");
  };

  useEffect(() => {
    startRef.current = performance.now();
    timerRef.current = setInterval(() => {
      if (!startRef.current) return;
      const elapsed = performance.now() - startRef.current;
      const remaining = Math.max(0, DURATION_MS - elapsed);
      setRemainingMs(remaining);
      if (remaining <= 0) finish();
    }, 200);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMark = (id: string) => {
    if (finishedRef.current) return;
    setMarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      markedIdsRef.current = next;
      return next;
    });
  };

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const timeProgress = ((DURATION_MS - remainingMs) / DURATION_MS) * 100;
  const isLow = remainingMs < 20_000;

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">
      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
        <div className="text-right">
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
            Aikaa jäljellä
          </p>
          <p
            className="text-xl font-mono font-bold tabular-nums"
            style={{ color: isLow ? "#ef4444" : "#241a11" }}
          >
            {formattedTime}
          </p>
        </div>
      </nav>

      {/* Progress */}
      <div className="px-6 pb-2 max-w-3xl mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
            Osa 4 — Etsi kirjoitusvirheet
          </p>
          <p className="text-xs text-[#d2c5b0]">{markedIds.size} merkittyä</p>
        </div>
        <div className="h-1 bg-[#f9e4d6] rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-none"
            style={{
              width: `${Math.min(100, Math.max(0, timeProgress))}%`,
              backgroundColor: isLow ? "#ef4444" : "#C69A2B",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-6 max-w-3xl mx-auto w-full">
        <div
          className="bg-white rounded-xl p-6 mb-5"
          style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
        >
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-2">
            Ohje
          </p>
          <p className="text-sm text-[#755e4d] leading-relaxed">
            Klikkaa kaikki sanat, joissa on kirjoitusvirhe. Voit poistaa valinnan
            klikkaamalla uudelleen. Paina <strong>Valmis</strong>, kun olet valmis —
            tai odota aika loppuun.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-6">
          {items.map((item) => {
            const isMarked = markedIds.has(item.id);
            return (
              <button
                key={item.id}
                onClick={() => toggleMark(item.id)}
                className={`px-4 py-3 rounded-lg text-base font-semibold transition-colors text-center ${
                  isMarked
                    ? "bg-[#C69A2B] text-white"
                    : "bg-white text-[#241a11] hover:bg-[#f9e4d6]"
                }`}
                style={{ boxShadow: "0 2px 12px rgba(47,36,27,0.04)" }}
              >
                {item.word}
              </button>
            );
          })}
        </div>

        <button
          onClick={finish}
          className="w-full bg-[#4A3728] hover:bg-[#2F241B] text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Valmis
        </button>
      </div>
    </div>
  );
}
