import { useState } from "react";
import { ReadingCompExercise } from "@/features/exercises/readingComp/ReadingCompExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: "Näet lyhyen tekstin. Lue se rauhassa — aikarajaa ei ole. Tekstien jälkeen vastaat muutamaan kysymykseen sisällöstä.",
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Lue teksti tarkasti ja yritä painaa mieleen, mitä siinä tapahtuu. Et voi palata takaisin tekstiin sen jälkeen, kun olet aloittanut kysymykset.",
  },
  {
    heading: "Miten vastaat",
    text: "Kuhunkin kysymykseen on kolme vastausvaihtoehtoa. Valitse se, joka parhaiten vastaa tekstin sisältöä. Siirryt automaattisesti seuraavaan kysymykseen.",
  },
  {
    heading: "Vinkki",
    text: "Kysymykset koskevat vain tekstissä mainittuja asioita — älä arvaile yleistiedon perusteella.",
  },
];

export default function ReadingCompExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Luetun ymmärtäminen"
        subtitle="Lue lyhyt teksti ja vastaa kysymyksiin sen sisällöstä."
        steps={STEPS}
        onStart={() => setReady(true)}
      />
    );
  }

  return <ReadingCompExercise />;
}
