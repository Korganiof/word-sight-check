import { useState } from "react";
import { WordChainExercise } from "@/features/exercises/wordChains/WordChainExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

export default function WordChainExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Sanaketjujen erottaminen"
        description="Lisää välilyönnit oikeisiin kohtiin yhteenkirjoitetussa lauseessa. Aikaraja 2 minuuttia."
        onStart={() => setReady(true)}
      />
    );
  }

  return <WordChainExercise />;
}
