import { useState } from "react";
import { SpellingErrorsExercise } from "@/features/exercises/spellingErrors/SpellingErrorsExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: "Näet listan suomenkielisiä sanoja. Osa sanoista on kirjoitettu oikein, osassa on kirjoitusvirhe.",
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Etsi ja klikkaa kaikki virheelliset sanat. Klikkaamalla uudelleen voit poistaa merkinnän, jos valitsit väärin.",
  },
  {
    heading: "Aikaraja",
    text: "Sinulla on 3,5 minuuttia aikaa. Voit myös painaa Valmis-painiketta heti, kun olet käynyt listan läpi.",
  },
];

export default function SpellingErrorsExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Etsi kirjoitusvirheet"
        subtitle="Huomaatko, missä sanoissa on kirjoitusvirhe?"
        steps={STEPS}
        onStart={() => setReady(true)}
      />
    );
  }

  return <SpellingErrorsExercise />;
}
