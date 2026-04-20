import { useState } from "react";
import { SyllableBoundaryExercise } from "@/features/exercises/syllableBoundaries/SyllableBoundaryExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: "Näet yhden sanan kerrallaan. Kirjainten välissä on ohut merkki, jota voit klikata.",
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Merkitse tavurajat klikkaamalla kirjainten välistä. Klikkaa uudelleen poistaaksesi merkinnän.",
  },
  {
    heading: "Vinkki",
    text: "Suomen tavutus noudattaa tavutussääntöjä, esim. kon-sert-ti-sa-lei-hin.",
  },
];

export default function SyllableBoundaryExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Tavurajojen merkitseminen"
        subtitle="Löydätkö sanan tavurajat?"
        steps={STEPS}
        onStart={() => setReady(true)}
      />
    );
  }

  return <SyllableBoundaryExercise />;
}
