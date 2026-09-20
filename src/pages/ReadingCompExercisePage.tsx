import { useState } from "react";
import { ReadingCompExercise } from "@/features/exercises/readingComp/ReadingCompExercise";
import { ReadingCompDemo } from "@/features/exercises/readingComp/ReadingCompDemo";
import { readingCompPractice } from "@/features/exercises/readingComp/readingCompItems.fi";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: "Näet lyhyen tarinan. Siihen on vaihdettu 12 sanaa toisiksi niin, ettei lause ole enää järkevä. Sanat ovat itsessään oikeaa suomea — ne ovat vain väärässä paikassa.",
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Lue tarina ja napauta jokaista sanaa, joka ei sovi lauseeseen. Sinun ei tarvitse keksiä oikeaa sanaa — riittää, että huomaat, ettei sana sovi. Napauta uudelleen, jos haluat poistaa merkinnän.",
  },
  {
    heading: "Aikaraja",
    text: "Sinulla on 4 minuuttia aikaa. Voit painaa Olen valmis -painiketta heti, kun olet käynyt tekstin läpi.",
  },
];

export default function ReadingCompExercisePage() {
  const [ready, setReady] = useState(false);
  const [solved, setSolved] = useState(0);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Luetun ymmärtäminen"
        subtitle="Löydätkö tekstin väärät sanat?"
        steps={STEPS}
        demo={<ReadingCompDemo sentences={readingCompPractice} onSolvedChange={setSolved} />}
        canStart={solved >= readingCompPractice.length}
        startHint="Ratkaise ensin molemmat harjoituslauseet, niin voit aloittaa."
        onStart={() => setReady(true)}
      />
    );
  }

  return <ReadingCompExercise />;
}
