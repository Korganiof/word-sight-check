import { useState } from "react";
import { SyllableExercise } from "@/features/exercises/syllables/SyllableExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

export default function SyllableExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Sanojen muodostaminen tavuista"
        description="Katso tavut tarkasti. Muodosta niistä sana ja kirjoita se, kun tavut katoavat."
        onStart={() => setReady(true)}
      />
    );
  }

  return <SyllableExercise />;
}
