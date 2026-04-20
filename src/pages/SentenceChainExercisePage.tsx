import { useState } from "react";
import { SentenceChainExercise } from "@/features/exercises/sentenceChains/SentenceChainExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: "Näet yhteenkirjoitetun tekstin, jossa ei ole pisteitä eikä isoja alkukirjaimia.",
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Kirjoita teksti uudelleen omalle tekstikentälle niin, että lisäät isot alkukirjaimet ja pisteet oikeisiin kohtiin.",
  },
  {
    heading: "Vinkki",
    text: "Mieti, missä yksi ajatus päättyy ja uusi alkaa. Kaikkia välimerkkejä ei tarvita — vain pisteet ja isot kirjaimet.",
  },
];

export default function SentenceChainExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Lauseketjujen erottaminen"
        subtitle="Löydätkö lauseiden rajat yhtenäisestä tekstistä?"
        steps={STEPS}
        onStart={() => setReady(true)}
      />
    );
  }

  return <SentenceChainExercise />;
}
