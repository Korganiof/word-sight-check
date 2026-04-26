import { useState } from "react";
import { ReadingCompExercise } from "@/features/exercises/readingComp/ReadingCompExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: "Näet lyhyen suomenkielisen tekstin. Tekstiin on piilotettu noin tusina väärää sanaa — sanoja, joiden merkitys ei sovi yhteyteen tai joiden sijamuoto on väärä.",
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Lue teksti rauhassa ja klikkaa jokainen sana, jonka mielestäsi pitäisi olla joku toinen. Klikkaamalla uudelleen voit poistaa merkinnän.",
  },
  {
    heading: "Aikaraja",
    text: "Sinulla on 4 minuuttia aikaa. Voit painaa Valmis-painiketta heti, kun olet käynyt tekstin läpi.",
  },
];

export default function ReadingCompExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Luetun ymmärtäminen"
        subtitle="Löydätkö tekstin väärät sanat?"
        steps={STEPS}
        onStart={() => setReady(true)}
      />
    );
  }

  return <ReadingCompExercise />;
}
