import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sentenceChainItems as allItems } from "./sentenceChainItems.fi";
import { saveSentenceChainsResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,;:!?"()]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function countSentences(s: string): number {
  return (s.match(/[.!?]+/g) ?? []).length;
}

export function SentenceChainExercise() {
  const navigate = useNavigate();

  const items = useMemo(() => (DEV_FAST ? allItems.slice(0, 1) : allItems), []);

  const [index, setIndex] = useState(0);
  const [input, setInput] = useState("");
  const [correctCount, setCorrectCount] = useState(0);
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const current = items[index];
  const expectedSentences = useMemo(
    () => countSentences(current.originalText),
    [current],
  );

  const advance = useCallback(() => {
    setFeedback(null);
    setInput("");
    if (index < items.length - 1) {
      setIndex((i) => i + 1);
    } else {
      saveSentenceChainsResult({
        correct: correctCount,
        total: items.length,
      });
      navigate("/exercises");
    }
  }, [index, items.length, correctCount, navigate]);

  const handleSubmit = useCallback(() => {
    if (feedback !== null) return;
    const userSentenceCount = countSentences(input);
    const userNormalized = normalize(input);
    const expectedNormalized = normalize(current.originalText);
    const wordsMatch = userNormalized === expectedNormalized;
    const sentenceCountMatch = userSentenceCount === expectedSentences;
    const isCorrect = wordsMatch && sentenceCountMatch;

    if (isCorrect) setCorrectCount((n) => n + 1);
    setFeedback(isCorrect ? "correct" : "incorrect");
    setTimeout(advance, 900);
  }, [input, feedback, current, expectedSentences, advance]);

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
      </nav>

      <div className="px-6 pb-2 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
            Lauseketjujen erottaminen
          </p>
          <p className="text-xs text-[#d2c5b0]">
            {index + 1} / {items.length}
          </p>
        </div>
        <div className="h-1 bg-[#f9e4d6] rounded-full">
          <div
            className="h-1 bg-[#C69A2B] rounded-full transition-all duration-300"
            style={{ width: `${((index + 1) / items.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          <div
            className="bg-white rounded-xl p-8"
            style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
          >
            <p className="text-sm text-[#755e4d] mb-4">
              Kirjoita teksti uudelleen niin, että merkitset isot kirjaimet ja pisteet
              lauseiden tunnistamiseksi. Odotettu määrä lauseita: <strong>{expectedSentences}</strong>.
            </p>

            <div className="bg-[#f9ede4] rounded-xl px-6 py-5 mb-6">
              <p className="text-base text-[#241a11] leading-relaxed">
                {current.chainedText}
              </p>
            </div>

            <textarea
              name={`sentence-chain-${index}`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={feedback !== null}
              rows={6}
              autoComplete="off"
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck={false}
              data-lpignore="true"
              data-form-type="other"
              placeholder="Kirjoita lauseet isoin alkukirjaimin ja pistein..."
              className="w-full rounded-lg bg-[#fff8f5] px-4 py-3 text-base text-[#241a11] outline-none mb-4 resize-none"
              style={{ border: "1.5px solid #f9e4d6" }}
            />

            {feedback && (
              <div className="text-center text-sm font-semibold py-2 rounded-lg mb-4 bg-[#f9e4d6] text-[#785a00]">
                {feedback === "correct" ? "Oikein" : "Siirrytään eteenpäin"}
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!input.trim() || feedback !== null}
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
