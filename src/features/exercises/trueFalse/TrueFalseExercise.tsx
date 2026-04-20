import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { trueFalsePassages as allPassages } from "./trueFalseItems.fi";
import { saveTrueFalseResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";

type Phase = "reading" | "statements" | "done";

export function TrueFalseExercise() {
  const navigate = useNavigate();

  const passages = useMemo(
    () =>
      DEV_FAST
        ? allPassages.slice(0, 1).map((p) => ({ ...p, statements: p.statements.slice(0, 3) }))
        : allPassages,
    [],
  );

  const [passageIndex, setPassageIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("reading");
  const [stmtIndex, setStmtIndex] = useState(0);
  const [selected, setSelected] = useState<boolean | null>(null);
  const [correct, setCorrect] = useState(0);
  const [total, setTotal] = useState(0);

  const passage = passages[passageIndex];
  const stmt = passage.statements[stmtIndex];

  const advance = useCallback(() => {
    setSelected(null);
    if (stmtIndex < passage.statements.length - 1) {
      setStmtIndex((i) => i + 1);
      return;
    }
    if (passageIndex < passages.length - 1) {
      setPassageIndex((i) => i + 1);
      setStmtIndex(0);
      setPhase("reading");
      return;
    }
    setPhase("done");
  }, [stmtIndex, passageIndex, passage.statements.length, passages.length]);

  const handleAnswer = useCallback(
    (answer: boolean) => {
      if (selected !== null) return;
      setSelected(answer);
      setTotal((n) => n + 1);
      if (answer === stmt.isTrue) setCorrect((n) => n + 1);
      setTimeout(advance, 800);
    },
    [selected, stmt, advance],
  );

  useEffect(() => {
    if (phase === "done") {
      saveTrueFalseResult({ correct, total });
      navigate("/exercises");
    }
  }, [phase, correct, total, navigate]);

  const totalStatements = passages.reduce((s, p) => s + p.statements.length, 0);
  const answeredBefore =
    passages.slice(0, passageIndex).reduce((s, p) => s + p.statements.length, 0) +
    stmtIndex;
  const progressPct = Math.round(((answeredBefore + (selected !== null ? 1 : 0)) / totalStatements) * 100);

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
      </nav>

      <div className="px-6 pb-2 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
            Väittämiin vastaaminen
          </p>
          <p className="text-xs text-[#d2c5b0]">
            {phase === "statements"
              ? `Väittämä ${stmtIndex + 1} / ${passage.statements.length}`
              : "Lue teksti"}
          </p>
        </div>
        <div className="h-1 bg-[#f9e4d6] rounded-full">
          <div
            className="h-1 bg-[#C69A2B] rounded-full transition-all duration-300"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-2xl">
          {phase === "reading" && (
            <>
              <h1 className="text-2xl font-bold text-[#241a11] tracking-tight mb-6">
                {passage.title}
              </h1>
              <div
                className="bg-white rounded-xl p-7 mb-6 space-y-4"
                style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
              >
                {passage.paragraphs.map((p, i) => (
                  <p key={i} className="text-[17px] text-[#241a11] leading-[1.7]">
                    {p}
                  </p>
                ))}
              </div>
              <p className="text-sm text-[#755e4d] mb-5">
                Kun olet lukenut tekstin, vastaa väittämiin K (kyllä) tai E (ei).
              </p>
              <button
                onClick={() => setPhase("statements")}
                className="flex items-center justify-center gap-2 bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
              >
                Aloita väittämät
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}

          {phase === "statements" && (
            <div
              className="bg-white rounded-xl p-8"
              style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
            >
              <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-3">
                {passage.title}
              </p>
              <p className="text-xl font-semibold text-[#241a11] leading-relaxed mb-8">
                {stmt.statement}
              </p>
              <div className="flex gap-3">
                {[
                  { label: "Kyllä", value: true },
                  { label: "Ei", value: false },
                ].map((opt) => {
                  const isSelected = selected === opt.value;
                  let cls =
                    "flex-1 px-5 py-4 rounded-xl text-base font-semibold transition-colors ";
                  if (selected !== null) {
                    if (isSelected) cls += "bg-[#C69A2B] text-white";
                    else cls += "bg-[#f9ede4] text-[#d2c5b0]";
                  } else {
                    cls +=
                      "bg-[#f9e4d6] text-[#241a11] hover:bg-[#C69A2B] hover:text-white cursor-pointer";
                  }
                  return (
                    <button
                      key={opt.label}
                      className={cls}
                      onClick={() => handleAnswer(opt.value)}
                      disabled={selected !== null}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
