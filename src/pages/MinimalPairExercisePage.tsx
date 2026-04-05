import { useState } from "react";
import { MinimalPairExercise } from "@/features/exercises/minimalPairs/MinimalPairExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

export default function MinimalPairExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Sanojen pituuden erottaminen"
        description="Valitse lauseeseen sopiva sana. Testaa vokaali- ja konsonanttipituuden erottamista."
        onStart={() => setReady(true)}
      />
    );
  }

  return <MinimalPairExercise />;
}
