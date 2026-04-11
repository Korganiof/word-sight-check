import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { saveWordSearchResult, type WordSearchTarget } from "@/lib/wordsearch";

interface WordSearchTaskProps {
  text: string;
  targets: WordSearchTarget[];
  durationMs: number;
}

interface TokenInfo {
  text: string;
  isWhitespace: boolean;
  isTarget: boolean;
}

function normalizeToken(raw: string): string {
  return raw
    .replace(/[.,:;!?()"""–-]/g, "")
    .trim()
    .toUpperCase();
}

export function WordSearchTask({ text, targets, durationMs }: WordSearchTaskProps) {
  const navigate = useNavigate();
  const [remainingMs, setRemainingMs] = useState(durationMs);
  const [isFinished, setIsFinished] = useState(false);
  const [clickedIndices, setClickedIndices] = useState<Set<number>>(new Set());

  const startTimeRef = useRef<number | null>(null);
  const timerIdRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const clickedIndicesRef = useRef<Set<number>>(new Set());

  const { tokens, totalTargets } = useMemo(() => {
    const targetSet = new Set(targets.map(t => t.word.toUpperCase()));
    const rawTokens = text.split(/(\s+)/);
    const tokenInfos: TokenInfo[] = [];
    let total = 0;

    for (const tok of rawTokens) {
      const isWhitespace = /^\s+$/.test(tok);
      if (isWhitespace) {
        tokenInfos.push({ text: tok, isWhitespace: true, isTarget: false });
        continue;
      }
      const norm = normalizeToken(tok);
      const isTarget = norm.length > 0 && targetSet.has(norm);
      if (isTarget) total += 1;
      tokenInfos.push({ text: tok, isWhitespace: false, isTarget });
    }

    return { tokens: tokenInfos, totalTargets: total };
  }, [text, targets]);

  useEffect(() => {
    startTimeRef.current = performance.now();

    timerIdRef.current = window.setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsed = performance.now() - startTimeRef.current;
      const remaining = Math.max(0, durationMs - elapsed);
      setRemainingMs(remaining);
      if (remaining <= 0 && !finishedRef.current) {
        finishTask();
      }
    }, 250);

    return () => {
      if (timerIdRef.current !== null) clearInterval(timerIdRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const finishTask = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsFinished(true);

    if (timerIdRef.current !== null) clearInterval(timerIdRef.current);

    const clicked = clickedIndicesRef.current;
    let foundCorrect = 0;
    for (const idx of clicked) {
      if (tokens[idx] && tokens[idx].isTarget) foundCorrect += 1;
    }

    const incorrectClicks = clicked.size - foundCorrect;
    const missedTargets = Math.max(0, totalTargets - foundCorrect);
    const now = performance.now();
    const elapsed = startTimeRef.current != null ? now - startTimeRef.current : durationMs;

    saveWordSearchResult({
      foundCorrect,
      incorrectClicks,
      missedTargets,
      totalTargets,
      durationMs: Math.round(Math.min(durationMs, elapsed)),
    });

    navigate("/exercise/syllables");
  };

  const handleWordClick = (index: number) => {
    if (isFinished) return;
    const token = tokens[index];
    if (!token || token.isWhitespace) return;

    setClickedIndices(prev => {
      if (prev.has(index)) return prev;
      const next = new Set(prev);
      next.add(index);
      clickedIndicesRef.current = next;

      if (totalTargets > 0) {
        let correctCount = 0;
        for (const idx of next) {
          if (tokens[idx] && tokens[idx].isTarget) correctCount += 1;
        }
        if (correctCount >= totalTargets && !finishedRef.current) {
          finishedRef.current = true;
          finishTask();
        }
      }

      return next;
    });
  };

  const totalSeconds = Math.ceil(remainingMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const formattedTime = `${minutes}:${seconds.toString().padStart(2, "0")}`;
  const timeProgress = durationMs > 0 ? ((durationMs - remainingMs) / durationMs) * 100 : 0;
  const isLow = remainingMs < 30_000;

  const foundCount = useMemo(() => {
    let count = 0;
    for (const idx of clickedIndices) {
      if (tokens[idx] && tokens[idx].isTarget) count++;
    }
    return count;
  }, [clickedIndices, tokens]);

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
        <div className="text-right">
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">Aikaa jäljellä</p>
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
            Osa 2 — Sanojen etsiminen tekstistä
          </p>
          <p className="text-xs text-[#d2c5b0]">{foundCount} / {totalTargets} löydetty</p>
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
      <div className="flex-1 px-6 py-6 max-w-3xl mx-auto w-full flex flex-col gap-5">

        {/* Instructions + target words */}
        <div
          className="bg-white rounded-xl p-5"
          style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
        >
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-3">
            Tavoitesanat — klikkaa ne tekstistä
          </p>
          <div className="flex flex-wrap gap-2">
            {targets.map(t => {
              const upper = t.word.toUpperCase();
              const isFound = tokens.some(
                (tok, idx) =>
                  tok.isTarget &&
                  clickedIndices.has(idx) &&
                  normalizeToken(tok.text) === upper
              );

              return (
                <span
                  key={t.word}
                  className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide transition-colors"
                  style={{
                    backgroundColor: isFound ? "#C69A2B" : "#f9e4d6",
                    color: isFound ? "#ffffff" : "#785a00",
                  }}
                >
                  {upper}
                </span>
              );
            })}
          </div>
        </div>

        {/* Text passage */}
        <div
          className="bg-white rounded-xl p-6 flex-1"
          style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
        >
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-4">Teksti</p>
          <p className="leading-relaxed text-[#241a11] text-base md:text-lg">
            {tokens.map((tok, index) => {
              if (tok.isWhitespace) return tok.text;

              const isClicked = clickedIndices.has(index);
              const isTarget = tok.isTarget;

              let style: React.CSSProperties = { cursor: "pointer" };
              if (isClicked && isTarget) {
                style = { ...style, backgroundColor: "#C69A2B", color: "#ffffff", borderRadius: "3px", padding: "0 2px" };
              } else if (isClicked && !isTarget) {
                style = { ...style, backgroundColor: "#fee2e2", color: "#991b1b", borderRadius: "3px", padding: "0 2px" };
              }

              return (
                <span
                  key={index}
                  style={style}
                  className={isClicked ? "" : "hover:bg-[#f9e4d6] rounded-sm transition-colors"}
                  onClick={() => handleWordClick(index)}
                >
                  {tok.text}
                </span>
              );
            })}
          </p>
        </div>

        <p className="text-center text-sm text-[#d2c5b0]">
          Selaimen hakutoiminto (Ctrl+F / Cmd+F) on poistettu käytöstä.
        </p>
      </div>

    </div>
  );
}
