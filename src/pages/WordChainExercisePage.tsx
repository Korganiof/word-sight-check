import { useState } from "react";
import { WordChainExercise } from "@/features/exercises/wordChains/WordChainExercise";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: 'Näet lauseen, jossa kaikki sanat on kirjoitettu yhteen ilman välilyöntejä. Esimerkiksi "kissaistuumatolla" tarkoittaa "kissa istuu matolla".',
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Napauta jokaisen sanan viimeistä kirjainta — sen perään ilmestyy sanaraja. Napauta uudelleen, jos haluat poistaa merkinnän.",
  },
  {
    heading: "Miten hyväksyt vastauksesi",
    text: "Kun kaikki sanarajat ovat paikoillaan, paina Tarkista (tai Enter). Siirryt sen jälkeen seuraavaan lauseeseen.",
  },
  {
    heading: "Aikaraja",
    text: "Sinulla on 1,5 minuuttia aikaa 15 lauseeseen. Etene ripeästi mutta älä jää liikaa miettimään yhtä lausetta — lauseet, joihin et ehdi, lasketaan vääriksi.",
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
