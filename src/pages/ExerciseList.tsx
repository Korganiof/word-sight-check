import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronRight,
  Layers,
  AudioLines,
  SeparatorVertical,
  SpellCheck,
  TextSearch,
  WholeWord,
} from "lucide-react";
import { ExerciseShell } from "@/components/shell";
import { Button } from "@/components/Button";
import { IconTile, Label, Sheet, SiteFooter } from "@/components/primitives";

const exercises = [
  {
    icon: <WholeWord />,
    title: "Pseudosanojen tunnistus",
    desc: "Päätä, onko sana oikea vai keksitty. Mittaa sanantunnistuksen tarkkuutta ja nopeutta.",
    route: "/task/pseudowords",
    part: "Osa 1",
  },
  {
    icon: <TextSearch />,
    title: "Sanojen etsiminen tekstistä",
    desc: "Etsi annetut sanat tekstistä aikarajan puitteissa. 3 min.",
    route: "/task/word-search",
    part: "Osa 2",
  },
  {
    icon: <SeparatorVertical />,
    title: "Sanaketjujen erottaminen",
    desc: "Merkitse sanojen rajat yhteenkirjoitettuun lauseeseen. 1,5 min.",
    route: "/exercise/word-chains",
    part: "Osa 3",
  },
  {
    icon: <SpellCheck />,
    title: "Etsi kirjoitusvirheet",
    desc: "Merkitse sanalistasta ne sanat, joissa on kirjoitusvirhe. 3,5 min.",
    route: "/exercise/spelling-errors",
    part: "Osa 4",
  },
  {
    icon: <BookOpen />,
    title: "Luetun ymmärtäminen",
    desc: "Lue lyhyt teksti ja merkitse sanat, jotka eivät sovi yhteyteen. 4 min.",
    route: "/exercise/reading-comp",
    part: "Osa 5",
  },
  {
    icon: <Layers />,
    title: "Sanojen muodostaminen tavuista",
    desc: "Katso tavut ja kirjoita niistä muodostuva sana.",
    route: "/exercise/syllables",
    part: "Lisäharjoitus",
  },
  {
    icon: <AudioLines />,
    title: "Sanojen pituuden erottaminen",
    desc: "Valitse lauseeseen sopiva sana. Testaa vokaali- ja konsonanttipituuden erottamista.",
    route: "/exercise/minimal-pairs",
    part: "Lisäharjoitus",
  },
];

export default function ExerciseList() {
  const navigate = useNavigate();

  return (
    <ExerciseShell logoLink width="shell">
      <div className="mx-auto flex max-w-[800px] flex-col md:py-6">
        <Label>Yksittäiset harjoitukset</Label>
        <h1 className="mb-3 mt-3 font-ui text-title-sm text-ink md:text-title">Harjoitukset</h1>
        <p className="mb-8 max-w-[600px] text-body text-ink-2 md:mb-10 md:text-lead">
          Voit tehdä harjoitukset yksitellen tai aloittaa koko seulonnan alusta.
          Tulokset tallentuvat istunnon ajaksi.
        </p>

        <Sheet as="ul" className="m-0 mb-8 flex list-none flex-col overflow-hidden p-0 md:mb-10">
          {exercises.map((ex, i) => (
            <li key={ex.route} className={i > 0 ? "border-t border-line" : undefined}>
              <button
                type="button"
                onClick={() => navigate(ex.route)}
                className="ls-t flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-recessed md:gap-[18px] md:px-7 md:py-5"
              >
                <IconTile icon={ex.icon} size={48} />
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <Label as="span" muted>{ex.part}</Label>
                  <span className="font-ui text-[18px] font-extrabold leading-[26px] tracking-[-0.01em] text-ink">
                    {ex.title}
                  </span>
                  <span className="text-body-sm text-ink-2">{ex.desc}</span>
                </span>
                <ChevronRight className="h-[22px] w-[22px] flex-shrink-0 text-gold-ink" strokeWidth={2} aria-hidden="true" />
              </button>
            </li>
          ))}
        </Sheet>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button onClick={() => navigate("/consent")}>Aloita koko seulonta</Button>
          <Button variant="outline" onClick={() => navigate("/results")}>
            Katso tulokset
          </Button>
        </div>
      </div>

      <SiteFooter className="mt-12 md:mt-16" />
    </ExerciseShell>
  );
}
