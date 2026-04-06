import { useState } from "react";
import { MinimalPairExercise } from "@/features/exercises/minimalPairs/MinimalPairExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: 'Näet lauseen, josta puuttuu yksi sana — sen kohdalla on tyhjä aukko. Alapuolella on kaksi vaihtoehtoa, esimerkiksi "tuli" ja "tulli".',
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Lue lause huolellisesti ja valitse se sana, joka sopii lauseeseen oikein. Sanat eroavat toisistaan vain hieman — yleensä yhden kirjaimen tai äänteen pituuden verran.",
  },
  {
    heading: "Miten valitset",
    text: "Klikkaa oikeaa vaihtoehtoa. Siirryt sen jälkeen automaattisesti seuraavaan lauseeseen.",
  },
  {
    heading: "Vinkki",
    text: "Lue lause äänessä mielessäsi — se auttaa kuulemaan kumpi sana sopii paremmin.",
  },
];

export default function MinimalPairExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Sanojen pituuden erottaminen"
        subtitle="Kumpi sana kuuluu lauseeseen?"
        steps={STEPS}
        onStart={() => setReady(true)}
      />
    );
  }

  return <MinimalPairExercise />;
}
