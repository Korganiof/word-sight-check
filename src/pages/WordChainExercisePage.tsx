import { useState } from "react";
import { WordChainExercise } from "@/features/exercises/wordChains/WordChainExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: 'Näet lauseen, jossa kaikki sanat on kirjoitettu yhteen ilman välilyöntejä. Esimerkiksi: "kissaistuumatolla" tarkoittaa "kissa istuu matolla".',
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: 'Kirjoita lause uudelleen tekstikenttään niin, että lisäät välilyönnit oikeisiin kohtiin ja lause muodostuu järkeväksi — esimerkiksi "kissa istuu matolla".',
  },
  {
    heading: "Miten hyväksyt vastauksesi",
    text: "Kun olet kirjoittanut lauseen, paina Tarkista-painiketta (tai Enter). Siirryt sen jälkeen seuraavaan lauseeseen.",
  },
  {
    heading: "Aikaraja",
    text: "Sinulla on 1,5 minuuttia aikaa. Etene rauhallisesti mutta älä jää liikaa miettimään yhtä lausetta.",
  },
];

export default function WordChainExercisePage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Sanaketjujen erottaminen"
        subtitle="Missä kohtaa yksi sana loppuu ja toinen alkaa?"
        steps={STEPS}
        onStart={() => setReady(true)}
      />
    );
  }

  return <WordChainExercise />;
}
