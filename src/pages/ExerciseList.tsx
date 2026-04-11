import { useNavigate } from "react-router-dom";
import { BookOpen, Search, Layers, AudioLines, Link2 } from "lucide-react";

const exercises = [
  {
    icon: <BookOpen className="w-5 h-5 text-[#785a00]" />,
    title: "Pseudosanojen tunnistus",
    desc: "Päätä onko sana oikea vai ei. Mittaa tarkkuutta ja reaktioaikaa.",
    route: "/task/pseudowords",
    part: "Osa 1",
  },
  {
    icon: <Search className="w-5 h-5 text-[#785a00]" />,
    title: "Sanojen etsiminen tekstistä",
    desc: "Etsi annetut sanat tekstistä aikarajan puitteissa.",
    route: "/task/word-search",
    part: "Osa 2",
  },
  {
    icon: <Layers className="w-5 h-5 text-[#785a00]" />,
    title: "Sanojen muodostaminen tavuista",
    desc: "Katso tavut ja kirjoita niistä muodostuva sana.",
    route: "/exercise/syllables",
    part: "Osa 3",
  },
  {
    icon: <AudioLines className="w-5 h-5 text-[#785a00]" />,
    title: "Sanojen pituuden erottaminen",
    desc: "Valitse lauseeseen sopiva sana. Testaa vokaali- ja konsonanttipituuden erottamista.",
    route: "/exercise/minimal-pairs",
    part: "Osa 4",
  },
  {
    icon: <Link2 className="w-5 h-5 text-[#785a00]" />,
    title: "Sanaketjujen erottaminen",
    desc: "Lisää välilyönnit oikeisiin kohtiin yhteenkirjoitetussa lauseessa.",
    route: "/exercise/word-chains",
    part: "Osa 5",
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
            <div
              key={ex.route}
              className="bg-white rounded-xl p-5 flex items-center justify-between gap-4 cursor-pointer group"
              style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
              onClick={() => navigate(ex.route)}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-[#f9e4d6] flex items-center justify-center flex-shrink-0">
                  {ex.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-semibold text-[#785a00] uppercase tracking-widest">
                      {ex.part}
                    </span>
                  </div>
                  <h3 className="font-semibold text-[#241a11]">{ex.title}</h3>
                  <p className="text-sm text-[#755e4d] leading-relaxed">{ex.desc}</p>
                </div>
              </div>
              <span className="text-[#d2c5b0] group-hover:text-[#C69A2B] transition-colors flex-shrink-0 text-lg">
                →
              </span>
            </div>
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

      <footer className="px-6 py-4 text-center text-xs text-[#d2c5b0] mt-8">
        LukiSeula © 2025
      </footer>

    </div>
  );
}
