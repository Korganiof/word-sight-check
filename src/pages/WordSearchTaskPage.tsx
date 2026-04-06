import { useState } from "react";
import { WordSearchTask } from "@/components/WordSearchTask";
import { wordSearchPassage, wordSearchTargets } from "@/lib/wordsearch";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";
import { DEV_FAST } from "@/lib/devConfig";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: "Näet lyhyen tekstin ja sen yläpuolella listan sanoista, joita sinun täytyy etsiä.",
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Lue teksti läpi ja etsi sieltä listassa olevat sanat. Kun löydät sanan tekstistä, klikkaa sitä. Löydetyt sanat merkitään automaattisesti.",
  },
  {
    heading: "Aikaraja",
    text: "Sinulla on 3 minuuttia aikaa. Yritä löytää kaikki sanat ennen kuin aika loppuu.",
  },
  {
    heading: "Vinkki",
    text: "Etsi yksi sana kerrallaan. Skannaa teksti rivi riviltä — älä jää jumiin, vaan siirry seuraavaan sanaan.",
  },
];

export default function WordSearchTaskPage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        title="Sanojen etsiminen tekstistä"
        subtitle="Löydätkö piilossa olevat sanat?"
        steps={STEPS}
        onStart={() => setReady(true)}
      />
    );
  }

  return (
    <WordSearchTask
      text={wordSearchPassage}
      targets={wordSearchTargets}
      durationMs={DEV_FAST ? 20_000 : 3 * 60 * 1000}
    />
  );
}
