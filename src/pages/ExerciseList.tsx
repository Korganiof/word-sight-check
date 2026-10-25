import type { ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
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
import { IconTile, Sheet, SiteFooter } from "@/components/primitives";
import { cn } from "@/lib/utils";

interface ExerciseRow {
  icon: ReactNode;
  title: string;
  desc: string;
  route: string;
  /** "Osa n" caption; the supplementary exercises have none (their group heading says it). */
  part?: string;
}

const BATTERY: ExerciseRow[] = [
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
];

const EXTRAS: ExerciseRow[] = [
  {
    icon: <Layers />,
    title: "Sanojen muodostaminen tavuista",
    desc: "Katso tavut ja kirjoita niistä muodostuva sana.",
    route: "/exercise/syllables",
  },
  {
    icon: <AudioLines />,
    title: "Sanojen pituuden erottaminen",
    desc: "Valitse lauseeseen sopiva sana. Testaa vokaali- ja konsonanttipituuden erottamista.",
    route: "/exercise/minimal-pairs",
  },
];

function Group({ heading, muted, rows }: { heading: string; muted?: boolean; rows: ExerciseRow[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h2
        className={cn(
          "m-0 font-ui text-[15px] font-extrabold leading-5 tracking-[-0.005em]",
          muted ? "text-ink-2" : "text-gold-ink",
        )}
      >
        {heading}
      </h2>
      <Sheet as="ul" className="m-0 flex list-none flex-col overflow-hidden p-0">
        {rows.map((ex, i) => (
          <li key={ex.route} className={i > 0 ? "border-t border-line" : undefined}>
            <Link
              to={ex.route}
              className="ls-t grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-[18px] py-4 text-ink no-underline hover:bg-recessed hover:text-ink md:gap-[18px] md:px-6 md:py-[18px]"
            >
              <IconTile icon={ex.icon} size={44} muted={muted} className="md:hidden" />
              <IconTile icon={ex.icon} size={48} muted={muted} className="hidden md:inline-flex" />
              <span className="flex min-w-0 flex-col">
                {ex.part && <span className="text-[14px] leading-5 text-ink-2">{ex.part}</span>}
                <span className="font-ui text-[19px] font-extrabold leading-[26px] tracking-[-0.015em] text-ink">
                  {ex.title}
                </span>
                <span className="text-[16px] leading-6 text-ink-2">{ex.desc}</span>
              </span>
              <ChevronRight className="h-[22px] w-[22px] text-gold-ink" strokeWidth={2} aria-hidden="true" />
            </Link>
          </li>
        ))}
      </Sheet>
    </section>
  );
}

export default function ExerciseList() {
  const navigate = useNavigate();

  return (
    <ExerciseShell
      logoLink
      width="narrow"
      right={
        <Link
          to="/"
          className="ls-t inline-flex h-10 items-center gap-2 rounded-key px-3 font-ui text-[15px] font-bold text-gold-ink hover:bg-gold-tint hover:text-gold-ink-deep"
        >
          <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
          Etusivulle
        </Link>
      }
    >
      <div className="flex flex-col md:pb-4 md:pt-4">
        <h1 className="m-0 font-ui text-h1-sm text-ink md:text-h1">Harjoitukset</h1>
        <p className="m-0 mt-2.5 max-w-[620px] text-[17px] leading-[26px] text-ink-2 md:text-[19px] md:leading-[30px]">
          Voit tehdä harjoitukset yksitellen tai aloittaa koko seulonnan alusta.
          Tulokset tallentuvat istunnon ajaksi.
        </p>

        <div className="mt-8 flex flex-col gap-7 md:mt-9">
          <Group heading="Seulonnan osat" rows={BATTERY} />
          <Group heading="Lisäharjoitukset" muted rows={EXTRAS} />
        </div>

        <div className="mt-8 flex flex-col gap-3 md:mt-10 md:flex-row">
          <Button onClick={() => navigate("/consent")} className="w-full md:w-auto">
            Aloita koko seulonta
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button variant="outline" onClick={() => navigate("/results")} className="w-full md:w-auto">
            Katso tulokset
          </Button>
        </div>
      </div>

      <SiteFooter className="mt-12 md:mt-16" />
    </ExerciseShell>
  );
}
