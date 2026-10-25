import { useState } from "react";
import { WordSearchTask } from "@/components/WordSearchTask";
import { wordSearchPassage, wordSearchTargets } from "@/lib/wordsearch";
import { ExerciseReadyScreen } from "@/components/ExerciseReadyScreen";
import { WordSearchExample } from "@/components/ReadyExamples";
import { WORD_SEARCH_DURATION_MS } from "@/lib/battery";

const STEPS = [
  {
    heading: "Mitä ruudulla näkyy",
    text: "Näet lyhyen tekstin ja sen yläpuolella listan sanoista, joita sinun täytyy etsiä.",
  },
  {
    heading: "Mitä sinun pitää tehdä",
    text: "Lue teksti läpi ja etsi sieltä listassa olevat sanat. Kun löydät sanan tekstistä, klikkaa sitä — se korostuu. Klikkaa uudelleen, jos haluat poistaa merkinnän.",
  },
  {
    heading: "Aikaraja",
    text: "Sinulla on 3 minuuttia aikaa. Yritä löytää kaikki sanat ennen kuin aika loppuu.",
  },
];

export default function WordSearchTaskPage() {
  const [ready, setReady] = useState(false);

  if (!ready) {
    return (
      <ExerciseReadyScreen
        part={2}
        title="Sanojen etsiminen tekstistä"
        subtitle="Löydätkö piilossa olevat sanat?"
        steps={STEPS}
        aside={<WordSearchExample />}
        facts={{ timeMs: WORD_SEARCH_DURATION_MS, count: wordSearchTargets.length, unit: "sanaa" }}
        onStart={() => setReady(true)}
      />
    );
  }

  return (
    <WordSearchTask
      text={wordSearchPassage}
      targets={wordSearchTargets}
      durationMs={WORD_SEARCH_DURATION_MS}
    />
  );
}
