import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Layers, AudioLines, Link2, BookText, SpellCheck } from "lucide-react";
import { PageFooter } from "@/components/PageFooter";

const exercises = [
  {
    icon: <BookOpen className="w-5 h-5 text-[#785a00]" />,
    title: "Pseudosanojen tunnistus",
    desc: "Päätä, onko sana oikea vai keksitty. Mittaa sanantunnistuksen tarkkuutta ja nopeutta.",
    route: "/task/pseudowords",
    part: "Osa 1",
  },
  {
    icon: <Search className="w-5 h-5 text-[#785a00]" />,
    title: "Sanojen etsiminen tekstistä",
    desc: "Etsi annetut sanat tekstistä aikarajan puitteissa. 3 min.",
    route: "/task/word-search",
    part: "Osa 2",
  },
  {
    icon: <Link2 className="w-5 h-5 text-[#785a00]" />,
    title: "Sanaketjujen erottaminen",
    desc: "Merkitse sanojen rajat yhteenkirjoitettuun lauseeseen. 1,5 min.",
    route: "/exercise/word-chains",
    part: "Osa 3",
  },
  {
    icon: <SpellCheck className="w-5 h-5 text-[#785a00]" />,
    title: "Etsi kirjoitusvirheet",
    desc: "Merkitse sanalistasta ne sanat, joissa on kirjoitusvirhe. 3,5 min.",
    route: "/exercise/spelling-errors",
    part: "Osa 4",
  },
  {
    icon: <BookText className="w-5 h-5 text-[#785a00]" />,
    title: "Luetun ymmärtäminen",
    desc: "Lue lyhyt teksti ja merkitse sanat, jotka eivät sovi yhteyteen. 4 min.",
    route: "/exercise/reading-comp",
    part: "Osa 5",
  },
  {
    icon: <Layers className="w-5 h-5 text-[#785a00]" />,
    title: "Sanojen muodostaminen tavuista",
    desc: "Katso tavut ja kirjoita niistä muodostuva sana.",
    route: "/exercise/syllables",
    part: "Lisäharjoitus",
  },
  {
    icon: <AudioLines className="w-5 h-5 text-[#785a00]" />,
    title: "Sanojen pituuden erottaminen",
    desc: "Valitse lauseeseen sopiva sana. Testaa vokaali- ja konsonanttipituuden erottamista.",
    route: "/exercise/minimal-pairs",
    part: "Lisäharjoitus",
  },
];

export default function ExerciseList() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
        <button
          onClick={() => navigate("/")}
          className="text-sm text-[#755e4d] hover:text-[#241a11] transition-colors"
        >
          Etusivulle
        </button>
      </nav>

      <div className="flex-1 px-6 py-8 max-w-3xl mx-auto w-full">

        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#785a00] bg-[#f9e4d6] px-3 py-1 rounded-md mb-6">
          Yksittäiset harjoitukset
        </span>

        <h1 className="text-3xl font-bold text-[#241a11] tracking-tight mb-2">
          Harjoitukset
        </h1>
        <p className="text-[#755e4d] mb-10 leading-relaxed">
          Voit tehdä harjoitukset yksitellen tai aloittaa koko seulonnan alusta.
          Tulokset tallentuvat istunnon ajaksi.
        </p>

        <div className="space-y-3 mb-10">
          {exercises.map((ex) => (
            <button
              key={ex.route}
              type="button"
              onClick={() => navigate(ex.route)}
              className="w-full text-left bg-white rounded-xl p-5 flex items-center justify-between gap-4 group transition-colors hover:bg-[#fffdfb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69A2B]"
              style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#f9e4d6] flex items-center justify-center flex-shrink-0">
                  {ex.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-0.5">
                    {ex.part}
                  </div>
                  <h3 className="font-semibold text-[#241a11]">{ex.title}</h3>
                  <p className="text-sm text-[#755e4d] leading-relaxed">{ex.desc}</p>
                </div>
              </div>
              <span
                aria-hidden="true"
                className="text-[#755e4d] group-hover:text-[#C69A2B] transition-colors flex-shrink-0 text-lg"
              >
                →
              </span>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/consent")}
            className="bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Aloita koko seulonta
          </button>
          <button
            onClick={() => navigate("/results")}
            className="bg-[#4A3728] hover:bg-[#2F241B] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Katso tulokset
          </button>
        </div>

      </div>

      <PageFooter className="mt-8" />

    </div>
  );
}
