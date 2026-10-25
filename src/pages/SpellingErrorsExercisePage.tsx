import { useState } from "react";
import { SpellingErrorsExercise } from "@/features/exercises/spellingErrors/SpellingErrorsExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";
import { SpellingErrorsExample } from "@/components/ReadyExamples";
import { spellingErrorItems } from "@/features/exercises/spellingErrors/spellingErrorItems.fi";
import { SPELLING_DURATION_MS } from "@/lib/battery";
import { DEV_FAST } from "@/lib/devConfig";

// Same item count the exercise uses (it slices to 12 under DEV_FAST).
const ITEM_COUNT = DEV_FAST ? Math.min(12, spellingErrorItems.length) : spellingErrorItems.length;

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
        part={4}
        title="Etsi kirjoitusvirheet"
        subtitle="Huomaatko, missä sanoissa on kirjoitusvirhe?"
        steps={STEPS}
        aside={<SpellingErrorsExample />}
        facts={{ timeMs: SPELLING_DURATION_MS, count: ITEM_COUNT, unit: "sanaa" }}
        onStart={() => setReady(true)}
      />
    );
  }

  return <SpellingErrorsExercise />;
}
