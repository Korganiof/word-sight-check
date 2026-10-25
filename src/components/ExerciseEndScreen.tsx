import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { scoreToLevel, type LevelThresholds } from "@/lib/levels";
import { ExerciseShell } from "@/components/shell";
import { Button } from "@/components/Button";
import { LevelChip } from "@/components/LevelChip";
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
// Terminal screen (§ 6.7 rule 2): no docked bar, the button sits right under
// the last line of content.
export function ExerciseEndScreen({ title, correct, total, thresholds }: ExerciseEndScreenProps) {
  const navigate = useNavigate();
  const level = scoreToLevel(correct, total, thresholds);

  return (
    <ExerciseShell logoLink width="shell" center>
      <div className="mx-auto flex max-w-[720px] flex-col">
        <Label>Harjoitus valmis</Label>
        <h1 className="m-0 mt-3 font-ui text-[30px] font-extrabold leading-[36px] tracking-[-0.03em] text-ink md:text-[44px] md:leading-[50px]">
          {title}
        </h1>

        <Sheet className="mt-7 flex flex-col gap-4 px-6 py-6 md:flex-row md:items-end md:justify-between md:gap-6 md:px-8 md:py-7">
          <div className="flex flex-col gap-2">
            <Label>Oikein</Label>
            <p className="m-0 font-ui text-[52px] font-extrabold leading-none tracking-[-0.03em] text-ink tabular-nums md:text-[64px]">
              {correct}{" "}
              <span className="text-[26px] font-bold tracking-[-0.01em] text-ink-2 md:text-[30px]">/ {total}</span>
            </p>
          </div>
          <LevelChip level={level} className="self-start md:self-end md:mb-2" />
        </Sheet>

        <p className="m-0 mt-6 text-body text-ink-2">
          Lisäharjoitukset eivät vaikuta seulonnan raporttiin — ne antavat vain
          tuntumaa yksittäiseen taitoon.
        </p>

        <Button onClick={() => navigate("/exercises")} className="mt-6 w-full md:w-auto md:self-start">
          <ArrowLeft aria-hidden="true" />
          Takaisin harjoituksiin
        </Button>
      </div>
    </ExerciseShell>
  );
}
