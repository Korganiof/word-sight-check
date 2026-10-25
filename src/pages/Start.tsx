import { useNavigate } from "react-router-dom";
import { ExerciseReadyScreen, KeyLegend, type ReadyStep } from "@/components/ExerciseReadyScreen";
import { PseudoWordExample } from "@/components/ReadyExamples";
import { PSEUDO_ITEM_TIMEOUT_MS, PSEUDO_MAIN_PER_CLASS } from "@/lib/battery";

const STEPS: ReadyStep[] = [
  {
    heading: "Tehtävän kuvaus",
    text: (
      <>
        Näet sanoja yksi kerrallaan. Tehtäväsi on päättää, onko kukin sana{" "}
        <strong className="font-bold">oikeaa suomea</strong> vai keksitty. Ensin tulee kolme
        harjoitussanaa, joita ei lasketa mukaan.
      </>
    ),
  },
  {
    heading: "Näin vastaat",
    text: "Voit käyttää joko näytön painikkeita tai näppäimistöä:",
    extra: (
      <KeyLegend
        items={[
          { key: "A", label: "Oikea sana" },
          { key: "L", label: "Ei sana" },
        ]}
      />
    ),
  },
  {
    heading: "Kolme sekuntia per sana",
    text: (
      <>
        Jokainen sana näkyy <strong className="font-bold">enintään kolme sekuntia</strong>. Jos et
        ehdi vastata, sana lasketaan vääräksi — luota ensivaikutelmaan ja vastaa heti.
      </>
    ),
  },
];

export default function Start() {
  const navigate = useNavigate();

  return (
    <ExerciseReadyScreen
      part={1}
      showHomeLink
      title="Sanantunnistus"
      subtitle="Todellisten ja epäsanojen erottaminen"
      steps={STEPS}
      aside={<PseudoWordExample />}
      facts={{ timeMs: PSEUDO_ITEM_TIMEOUT_MS, perItem: "sana", count: 2 * PSEUDO_MAIN_PER_CLASS, unit: "sanaa" }}
      startLabel="Aloita harjoitus"
      onStart={() => navigate("/task/pseudowords")}
    />
  );
}
