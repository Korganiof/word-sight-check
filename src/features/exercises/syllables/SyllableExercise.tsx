import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { syllableItems as allSyllableItems } from "./syllableItems.fi";
import { DEV_FAST } from "@/lib/devConfig";

const syllableItems = DEV_FAST ? allSyllableItems.slice(0, 2) : allSyllableItems;
import type { SyllableResult } from "./types";
import { saveSyllablesResult } from "@/lib/exerciseResults";

/** How long each individual syllable stays on screen */
const MS_PER_SYLLABLE = 1500;

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

export function SyllableExercise() {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  /** Index of the syllable currently being shown. When it reaches syllables.length, typing begins. */
  const [syllableIndex, setSyllableIndex] = useState(0);
  const [phase, setPhase] = useState<"showing" | "typing" | "feedback">("showing");
  const [inputValue, setInputValue] = useState("");
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);
  const [results, setResults] = useState<SyllableResult[]>([]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const currentItem = syllableItems[currentIndex];

  // Reset and start flashing syllables when the item changes
  useEffect(() => {
    setSyllableIndex(0);
    setPhase("showing");
    setInputValue("");
    setFeedback(null);
  }, [currentIndex]);

  // Advance through syllables one by one, then switch to typing
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

  // Auto-focus input when typing begins
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
        navigate("/exercise/minimal-pairs");
      }
    }, 800);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  const progress = ((currentIndex + 1) / syllableItems.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="container mx-auto px-4 py-8 flex-1 flex flex-col max-w-2xl">
        <div className="mb-8">
          <h1 className="text-xl font-semibold mb-1">Osa 3: Sanojen muodostaminen tavuista</h1>
          <p className="text-sm text-muted-foreground mb-4">
            Katso tavut tarkasti. Muodosta niistä sana ja kirjoita se, kun tavut katoavat.
          </p>
          <div className="flex justify-between text-sm text-muted-foreground mb-2">
            <span>Sana {currentIndex + 1} / {syllableItems.length}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {phase === "showing" ? `Tavu ${syllableIndex + 1} / ${currentItem.syllables.length}` : "Kirjoita sana"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">

              {/* Single syllable flash */}
              <div className="min-h-[8rem] flex items-center justify-center">
                {phase === "showing" ? (
                  <span
                    key={`${currentIndex}-${syllableIndex}`}
                    className="text-6xl font-bold text-foreground tracking-wide"
                    style={{ animation: `syllable-flash ${MS_PER_SYLLABLE}ms ease-in-out forwards` }}
                  >
                    {currentItem.syllables[syllableIndex]}
                  </span>
                ) : (
                  <p className="text-muted-foreground italic text-sm">Tavut piilotettu</p>
                )}
              </div>

              {/* Input — only shown after all syllables have flashed */}
              {phase !== "showing" && (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-foreground">
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
                    className="w-full rounded-md border border-input bg-background px-4 py-3 text-base outline-none transition-colors focus:border-primary"
                  />

                  <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={!inputValue.trim() || phase === "feedback"}
                  >
                    Tarkista
                  </Button>
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
