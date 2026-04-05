import { useState } from "react";
import { WordSearchTask } from "@/components/WordSearchTask";
import { wordSearchPassage, wordSearchTargets } from "@/lib/wordsearch";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";
import { DEV_FAST } from "@/lib/devConfig";

export default function WordSearchTaskPage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Sanojen etsiminen tekstistä"
        description="Etsi annetut sanat tekstistä. Aikaraja 3 minuuttia."
        onStart={() => setReady(true)}
      />
    );
  }

  return (
    <WordSearchTask
      text={wordSearchPassage}
      targets={wordSearchTargets}
      durationMs={DEV_FAST ? 20_000 : 3 * 60 * 1000}
    />
  );
}
