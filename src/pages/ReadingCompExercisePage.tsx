import { useState } from "react";
import { ReadingCompExercise } from "@/features/exercises/readingComp/ReadingCompExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: "Näet lyhyen tarinan. Siihen on vaihdettu 12 sanaa toisiksi niin, ettei lause ole enää järkevä — esimerkiksi ”hän joi lasillisen leipää”.",
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Lue teksti ja napauta jokaista sanaa, joka ei sovi lauseeseen. Sinun ei tarvitse keksiä oikeaa sanaa — riittää, että huomaat, ettei sana sovi. Napauta uudelleen, jos haluat poistaa merkinnän.",
  },
  {
    heading: "Aikaraja",
    text: "Sinulla on 4 minuuttia aikaa. Voit painaa Olen valmis -painiketta heti, kun olet käynyt tekstin läpi.",
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
