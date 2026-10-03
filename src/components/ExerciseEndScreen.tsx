import { useNavigate } from "react-router-dom";
import { scoreToLevel, type LevelThresholds } from "@/lib/levels";
import { ExerciseShell } from "@/components/shell";
import { Button } from "@/components/Button";
import { LevelBar, LevelChip } from "@/components/LevelChip";
import { Label, Sheet } from "@/components/primitives";

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
  const level = scoreToLevel(correct, total, thresholds);

  return (
    <ExerciseShell logoLink width="shell" center>
      <div className="mx-auto flex max-w-[640px] flex-col gap-6 md:py-8">
        <div className="flex flex-col gap-3">
          <Label>Harjoitus valmis</Label>
          <h1 className="m-0 font-ui text-title-sm text-ink md:text-title">{title}</h1>
        </div>

        <Sheet className="flex flex-col gap-5 p-6 md:p-10">
          <Label>Oikein</Label>
          <p className="m-0 font-ui text-[48px] font-extrabold leading-none tracking-[-0.03em] text-ink tabular-nums md:text-[56px]">
            {correct} <span className="text-[24px] font-bold tracking-[-0.01em] text-ink-2 md:text-[28px]">/ {total}</span>
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            <LevelChip level={level} />
            <LevelBar level={level} />
          </div>
        </Sheet>

        <p className="m-0 text-body text-ink-2">
          Lisäharjoitukset eivät vaikuta seulonnan raporttiin — ne antavat vain
          tuntumaa yksittäiseen taitoon.
        </p>

        <Button onClick={() => navigate("/exercises")} className="w-full md:w-auto md:self-start">
          Takaisin harjoituksiin
        </Button>
      </div>
    </ExerciseShell>
  );
}
