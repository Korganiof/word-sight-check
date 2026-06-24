import React, { useMemo, useRef, useState } from "react";
import { readingCompPassages } from "./readingCompItems.fi";
import type { ReadingCompToken } from "./types";
import { saveReadingCompResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";
import { formatMmSs } from "@/lib/utils";
import { useCountdown } from "@/hooks/useCountdown";
import { useScreeningFlow } from "@/hooks/useScreeningFlow";

const DURATION_MS = DEV_FAST ? 30_000 : 240_000;

const TOKEN_RE = /\[\[([^|\]]+)\|([^\]]+)\]\]|\S+|\s+/g;

function parseParagraph(text: string, paragraphIndex: number): ReadingCompToken[] {
  const tokens: ReadingCompToken[] = [];
  let wordCounter = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(text)) !== null) {
    const [whole, wrong, correct] = match;
    if (wrong !== undefined && correct !== undefined) {
      tokens.push({
        kind: "word",
        id: `p${paragraphIndex}-w${wordCounter++}`,
        text: wrong,
        isError: true,
        correctForm: correct,
      });
    } else if (/^\s+$/.test(whole)) {
      tokens.push({ kind: "whitespace", text: whole });
    } else {
      tokens.push({
        kind: "word",
        id: `p${paragraphIndex}-w${wordCounter++}`,
        text: whole,
        isError: false,
      });
    }
  }
  return tokens;
}

export function ReadingCompExercise() {
  const goToNext = useScreeningFlow();

  const passage = readingCompPassages[0];

  const paragraphs = useMemo(
    () => passage.paragraphs.map((text, i) => parseParagraph(text, i)),
    [passage],
  );

  const totalErrors = useMemo(() => {
    let count = 0;
    for (const para of paragraphs) {
      for (const t of para) if (t.kind === "word" && t.isError) count += 1;
    }
    return count;
  }, [paragraphs]);

  const [isFinished, setIsFinished] = useState(false);
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());

  const finishedRef = useRef(false);
  const markedIdsRef = useRef<Set<string>>(new Set());

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsFinished(true);

    const marked = markedIdsRef.current;
    let hits = 0;
    for (const para of paragraphs) {
      for (const t of para) {
        if (t.kind === "word" && t.isError && marked.has(t.id)) hits += 1;
      }
    }
    saveReadingCompResult({ correct: hits, total: totalErrors });
    goToNext();
  };

  const remainingMs = useCountdown({ durationMs: DURATION_MS, onExpire: finish });

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

  const formattedTime = formatMmSs(remainingMs);
  const timeProgress = ((DURATION_MS - remainingMs) / DURATION_MS) * 100;
  const isLow = remainingMs < 30_000;

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
            Osa 5 — Luetun ymmärtäminen
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
      <div className="flex-1 px-6 py-6 max-w-3xl mx-auto w-full flex flex-col gap-5">

        {/* Instructions */}
        <div
          className="bg-white rounded-xl p-5"
          style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
        >
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-2">
            Ohje
          </p>
          <p className="text-sm text-[#755e4d] leading-relaxed">
            Lue teksti rauhassa. Tekstiin on piilotettu noin tusina <strong>väärää sanaa</strong>
            {" "}— sanoja, joiden merkitys ei sovi yhteyteen tai joiden sijamuoto on väärä.
            Klikkaa jokainen virheellinen sana. Voit poistaa merkinnän klikkaamalla uudelleen.
          </p>
        </div>

        {/* Text passage */}
        <div
          className="bg-white rounded-xl p-6 flex-1"
          style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
        >
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-3">
            Teksti
          </p>
          <h2 className="text-xl font-bold text-[#241a11] tracking-tight mb-4">
            {passage.title}
          </h2>

          <div className="space-y-4">
            {paragraphs.map((tokens, pIdx) => (
              <p key={pIdx} className="leading-relaxed text-[#241a11] text-base md:text-lg">
                {tokens.map((t, tIdx) => {
                  if (t.kind === "whitespace") {
                    return <React.Fragment key={tIdx}>{t.text}</React.Fragment>;
                  }
                  const isMarked = markedIds.has(t.id);
                  let style: React.CSSProperties = { cursor: "pointer" };
                  if (isMarked) {
                    style = {
                      ...style,
                      backgroundColor: "#C69A2B",
                      color: "#ffffff",
                      borderRadius: "3px",
                      padding: "0 2px",
                    };
                  }
                  return (
                    <span
                      key={t.id}
                      style={style}
                      className={isMarked ? "" : "hover:bg-[#f9e4d6] rounded-sm transition-colors"}
                      onClick={() => toggleMark(t.id)}
                    >
                      {t.text}
                    </span>
                  );
                })}
              </p>
            ))}
          </div>
        </div>

        <button
          onClick={finish}
          disabled={isFinished}
          className="self-center px-8 py-3 rounded-xl font-bold text-white transition-all active:scale-95 disabled:opacity-50"
          style={{ background: "#C69A2B" }}
          onMouseOver={(e) => (e.currentTarget.style.background = "#785a00")}
          onMouseOut={(e) => (e.currentTarget.style.background = "#C69A2B")}
        >
          Olen valmis
        </button>
      </div>

    </div>
  );
}
