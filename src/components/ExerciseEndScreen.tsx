import { useNavigate } from "react-router-dom";
import { LEVEL_META, scoreToLevel, type LevelThresholds } from "@/lib/levels";

interface ExerciseEndScreenProps {
  title: string;
  correct: number;
  total: number;
  thresholds?: LevelThresholds;
}

// End screen for the supplementary exercises, which are not part of the
// screening battery and never reach the report — so they show their score
// here instead of dropping the user back on the list with no feedback.
export function ExerciseEndScreen({ title, correct, total, thresholds }: ExerciseEndScreenProps) {
  const navigate = useNavigate();
  const meta = LEVEL_META[scoreToLevel(correct, total, thresholds)];

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-xl">
        <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-2">
          Harjoitus valmis
        </p>
        <h1 className="text-3xl font-bold text-[#241a11] tracking-tight mb-8">{title}</h1>

        <div
          className="bg-white rounded-xl p-8 mb-6"
          style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
        >
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-2">
            Oikein
          </p>
          <p className="text-5xl font-bold text-[#241a11] tabular-nums tracking-tight mb-5">
            {correct} <span className="text-2xl font-semibold text-[#755e4d]">/ {total}</span>
          </p>
          <div
            className="inline-flex items-center gap-2 px-2.5 py-1 rounded"
            style={{ background: meta.soft, color: meta.color }}
          >
            <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: meta.color }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.08em]">{meta.label}</span>
          </div>
        </div>

        <p className="text-sm text-[#755e4d] leading-relaxed mb-8">
          Lisäharjoitukset eivät vaikuta seulonnan raporttiin — ne antavat vain
          tuntumaa yksittäiseen taitoon.
        </p>

        <button
          onClick={() => navigate("/exercises")}
          className="w-full bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold py-4 rounded-lg transition-colors text-base"
        >
          Takaisin harjoituksiin
        </button>
      </div>
    </div>
  );
}
