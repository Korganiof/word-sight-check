import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { syllableItems as allSyllableItems } from "./syllableItems.fi";
import { DEV_FAST } from "@/lib/devConfig";
import { shuffleArray } from "@/lib/utils";

const syllableItems = DEV_FAST
  ? allSyllableItems.slice(0, 2)
  : shuffleArray(allSyllableItems).slice(0, 12);
import type { SyllableResult } from "./types";
import { saveSyllablesResult } from "@/lib/exerciseResults";

const MS_PER_SYLLABLE = 1500;

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function SyllableExercise() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [syllableIndex, setSyllableIndex] = useState(0);
  const [phase, setPhase] = useState<"showing" | "typing" | "feedback">("showing");
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [results, setResults] = useState<SyllableResult[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const currentItem = syllableItems[currentIndex];

  useEffect(() => {
    setSyllableIndex(0);
    setPhase("showing");
    setInputValue("");
    setFeedback(null);
  }, [currentIndex]);

  useEffect(() => {
    if (phase !== "showing") return;
    const timer = setTimeout(() => {
      const next = syllableIndex + 1;
      if (next >= currentItem.syllables.length) {
        setPhase("typing");
      } else {
        setSyllableIndex(next);
      }
    }, MS_PER_SYLLABLE);
    return () => clearTimeout(timer);
  }, [syllableIndex, phase, currentItem.syllables.length]);

  useEffect(() => {
    if (phase === "typing") {
      inputRef.current?.focus();
    }
  }, [phase]);

  function handleSubmit() {
    if (phase !== "typing") return;
    const correct = normalize(inputValue) === normalize(currentItem.correctWord);
    setFeedback(correct ? "correct" : "incorrect");
    setPhase("feedback");

    setTimeout(() => {
      const newResults = [...results, { item: currentItem, userInput: inputValue.trim(), correct }];
      if (currentIndex < syllableItems.length - 1) {
        setResults(newResults);
        setCurrentIndex(i => i + 1);
      } else {
        saveSyllablesResult({ correct: newResults.filter(r => r.correct).length, total: newResults.length });
        navigate("/exercises");
      }
    }, 800);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  const progress = ((currentIndex + 1) / syllableItems.length) * 100;

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
            Sanojen muodostaminen tavuista
          </p>
          <p className="text-xs text-[#d2c5b0]">Sana {currentIndex + 1} / {syllableItems.length}</p>
        </div>
        <div className="h-1 bg-[#f9e4d6] rounded-full">
          <div
            className="h-1 bg-[#C69A2B] rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-xl">

          <div
            className="bg-white rounded-xl"
            style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
          >
            {/* Phase label */}
            <div className="px-6 pt-6 pb-2 text-center">
              <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
                {phase === "showing"
                  ? `Tavu ${syllableIndex + 1} / ${currentItem.syllables.length}`
                  : "Kirjoita sana"}
              </p>
            </div>

            {/* Syllable display */}
            <div className="min-h-36 flex items-center justify-center px-6 py-8">
              {phase === "showing" ? (
                <span
                  key={`${currentIndex}-${syllableIndex}`}
                  className="text-6xl font-bold text-[#241a11] tracking-tight"
                  style={{ animation: `syllable-flash ${MS_PER_SYLLABLE}ms ease-in-out forwards` }}
                >
                  {currentItem.syllables[syllableIndex]}
                </span>
              ) : (
                <p className="text-[#d2c5b0] text-sm italic">Tavut piilotettu</p>
              )}
            </div>

            {/* Input section */}
            {phase !== "showing" && (
              <div className="px-6 pb-6 space-y-4">
                {feedback && (
                  <div className="text-center text-sm font-semibold py-2 rounded-lg bg-[#f9e4d6] text-[#785a00]">
                    Vastaus tallennettu
                  </div>
                )}

                <label className="block text-sm font-semibold text-[#241a11]">
                  Kirjoita sana:
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={e => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={phase === "feedback"}
                  placeholder="Kirjoita tähän..."
                  className="w-full rounded-lg bg-[#fff8f5] px-4 py-3 text-base text-[#241a11] outline-none transition-colors placeholder:text-[#d2c5b0]"
                  style={{ border: "1.5px solid #f9e4d6" }}
                  onFocus={e => (e.currentTarget.style.borderColor = "#C69A2B")}
                  onBlur={e => (e.currentTarget.style.borderColor = "#f9e4d6")}
                />

                <button
                  onClick={handleSubmit}
                  disabled={!inputValue.trim() || phase === "feedback"}
                  className="w-full bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Tarkista
                </button>
              </div>
            )}
          </div>

          <p className="text-center text-sm text-[#d2c5b0] mt-6">
            Katso tavut tarkasti. Muodosta niistä sana ja kirjoita se, kun tavut katoavat.
          </p>
        </div>
      </div>

    </div>
  );
}
