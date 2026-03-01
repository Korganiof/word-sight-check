import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
    .replace(/[.,:;!?()"“”–-]/g, "")
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

  // Start timer on mount
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
      if (timerIdRef.current !== null) {
        clearInterval(timerIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [durationMs]);

  // Prevent Ctrl+F / Cmd+F during the task
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isFindShortcut =
        (e.ctrlKey || e.metaKey) && (e.key === "f" || e.key === "F");
      if (isFindShortcut) {
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

    if (timerIdRef.current !== null) {
      clearInterval(timerIdRef.current);
    }

    const clicked = clickedIndicesRef.current;
    let foundCorrect = 0;

    for (const idx of clicked) {
      if (tokens[idx] && tokens[idx].isTarget) {
        foundCorrect += 1;
      }
    }

    const incorrectClicks = clicked.size - foundCorrect;
    const missedTargets = Math.max(0, totalTargets - foundCorrect);

    const now = performance.now();
    const elapsed =
      startTimeRef.current != null ? now - startTimeRef.current : durationMs;

    saveWordSearchResult({
      foundCorrect,
      incorrectClicks,
      missedTargets,
      totalTargets,
      durationMs: Math.round(Math.min(durationMs, elapsed)),
    });

    navigate("/result/word-search");
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

      // If all targets found, finish early
      if (totalTargets > 0) {
        let correctCount = 0;
        for (const idx of next) {
          if (tokens[idx] && tokens[idx].isTarget) {
            correctCount += 1;
          }
        }
        if (correctCount >= totalTargets && !finishedRef.current) {
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
  const timeProgress =
    durationMs > 0 ? ((durationMs - remainingMs) / durationMs) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="w-full bg-primary text-primary-foreground py-4 px-6 shadow">
        <h1 className="text-lg font-semibold">Sanojen etsiminen tekstistä</h1>
      </div>

      <div className="container mx-auto px-4 py-6 flex-1 flex flex-col gap-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Etsi sanat tekstistä</h2>
            <p className="text-sm text-muted-foreground">
              Klikkaa kaikki alla luetellut sanat tekstistä. Selaimen hakutoiminto
              (Ctrl+F / Cmd+F) on poistettu käytöstä.
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              Aikaa jäljellä
            </p>
            <p className="text-2xl font-mono font-semibold">{formattedTime}</p>
          </div>
        </div>

        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${Math.min(100, Math.max(0, timeProgress))}%` }}
          />
        </div>

        <Card className="flex-1 flex flex-col">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Tavoitesanat
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 flex-1 flex flex-col">
            <div className="flex flex-wrap gap-2 pb-2 border-b">
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
                    className={[
                      "px-3 py-1 rounded-full text-xs font-semibold tracking-wide",
                      isFound
                        ? "bg-yellow-300 text-black"
                        : "bg-muted text-muted-foreground",
                    ].join(" ")}
                  >
                    {upper}
                  </span>
                );
              })}
            </div>

            <div className="flex-1 overflow-auto mt-2">
              <p className="leading-relaxed text-foreground text-sm md:text-base">
                {tokens.map((tok, index) => {
                  if (tok.isWhitespace) {
                    return tok.text;
                  }

                  const isClicked = clickedIndices.has(index);
                  const isTarget = tok.isTarget;

                  const className = [
                    "cursor-pointer transition-colors",
                    isClicked && isTarget
                      ? "bg-yellow-300"
                      : isClicked && !isTarget
                        ? "bg-red-200"
                        : "hover:bg-muted",
                  ].join(" ");

                  return (
                    <span
                      key={index}
                      className={className}
                      onClick={() => handleWordClick(index)}
                    >
                      {tok.text}
                    </span>
                  );
                })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

