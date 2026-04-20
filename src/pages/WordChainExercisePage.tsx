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
    text: "Lisää välilyönnit oikeisiin kohtiin niin, että lause muodostuu järkeväksi. Klikkaa kirjainten väliin lisätäksesi välilyönnin — klikkaa uudelleen poistaaksesi sen.",
  },
  {
    heading: "Miten hyväksyt vastauksesi",
    text: "Kun olet tyytyväinen, paina Valmis-painiketta. Siirryt sen jälkeen seuraavaan lauseeseen.",
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
