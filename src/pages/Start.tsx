import { useNavigate } from "react-router-dom";
import { ExerciseReadyScreen, KeyLegend, type ReadyStep } from "@/components/ExerciseReadyScreen";
import { Label, Sheet } from "@/components/primitives";

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

// A non-interactive miniature of the Osa 1 stage: the question, a sample
// word, the 3 s bar and the two answer keys with their keycaps.
function ExampleCard() {
  const keyClass =
    "box-border flex h-16 flex-1 basis-0 items-center justify-center gap-3 rounded-tile border-2 border-brown bg-surface px-3 font-ui text-[17px] font-extrabold leading-none text-ink";
  const kbdClass =
    "inline-flex h-[34px] min-w-[34px] items-center justify-center rounded-[10px] border border-line-strong border-b-[3px] bg-surface px-2.5 font-mono text-[15px] font-bold leading-none text-ink";
  return (
    <Sheet
      as="section"
      role="img"
      aria-label="Esimerkki: sana ja kaksi vastauspainiketta, näppäimet A ja L"
      className="flex flex-col gap-4 p-5 md:p-6"
    >
      <Label>Esimerkki</Label>
      <div aria-hidden="true" className="flex flex-col gap-3">
        <div className="box-border flex h-[188px] flex-col items-center justify-center gap-4 rounded-sheet-sm bg-recessed">
          <span className="font-ui text-caption font-bold text-ink-2">Onko tämä oikea sana?</span>
          <span className="font-text text-[52px] font-bold leading-[1.1] text-ink">talo</span>
          <span className="flex h-[5px] w-[180px] overflow-hidden rounded-[3px] bg-well">
            <span className="w-[70%] bg-time" />
          </span>
        </div>
        <div className="flex gap-3">
          <span className={keyClass}>
            <kbd className={kbdClass}>A</kbd>
            <span>Oikea sana</span>
          </span>
          <span className={keyClass}>
            <kbd className={kbdClass}>L</kbd>
            <span>Ei sana</span>
          </span>
        </div>
      </div>
    </Sheet>
  );
}

export default function Start() {
  const navigate = useNavigate();

  return (
    <ExerciseReadyScreen
      part={1}
      showHomeLink
      title="Sanantunnistus"
      subtitle="Todellisten ja epäsanojen erottaminen"
      steps={STEPS}
      aside={<ExampleCard />}
      startLabel="Aloita harjoitus"
      onStart={() => navigate("/task/pseudowords")}
    />
  );
}
