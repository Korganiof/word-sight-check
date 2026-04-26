import { useState } from "react";
import { SyllableExercise } from "@/features/exercises/syllables/SyllableExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: 'Sana näytetään sinulle palasina — esimerkiksi "au" + "to". Tavut näkyvät vain hetken, sitten ne katoavat.',
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Muista tavut, yhdistä ne mielessäsi sanaksi ja kirjoita sana tekstikenttään. Paina Enter tai klikkaa Valmis.",
  },
  {
    heading: "Nopeus ei ole pääasia",
    text: "Tehtävässä ei ole aikarajaa. Kirjoita sana rauhassa — tärkeintä on, että sana on oikein kirjoitettu.",
  },
];

export default function SyllableExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Sanojen muodostaminen tavuista"
        subtitle="Muistatko sanan, kun se katoaa?"
        steps={STEPS}
        onStart={() => setReady(true)}
      />
    );
  }

  return <SyllableExercise />;
}
