import { useState } from "react";
import { TrueFalseExercise } from "@/features/exercises/trueFalse/TrueFalseExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: "Ensin luet lyhyen tekstin. Sen jälkeen esitetään väittämiä tekstin sisältöön liittyen.",
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Vastaa jokaiseen väittämään K (kyllä) tai E (ei) sen mukaan, pitääkö väittämä paikkansa tekstin perusteella.",
  },
];

export default function TrueFalseExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Väittämiin vastaaminen"
        subtitle="Pitääkö väittämä paikkansa tekstin perusteella?"
        steps={STEPS}
        onStart={() => setReady(true)}
      />
    );
  }

  return <TrueFalseExercise />;
}
