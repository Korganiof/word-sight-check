import { useNavigate } from "react-router-dom";
import { ArrowRight, Keyboard, Timer } from "lucide-react";

export default function Start() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
      </nav>

      {/* Progress */}
      <div className="px-6 pb-2 max-w-2xl mx-auto w-full">
        <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-1">
          Vaihe 1 / 4 — Sanantunnistus
        </p>
        <div className="h-1 bg-[#f9e4d6] rounded-full">
          <div className="h-1 bg-[#C69A2B] rounded-full" style={{ width: "25%" }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-2xl">

          <h1 className="text-3xl font-bold text-[#241a11] tracking-tight mb-2">
            Ennen kuin aloitat
          </h1>
          <p className="text-[#755e4d] mb-8 leading-relaxed">
            Lue nämä ohjeet huolellisesti ennen tehtävän aloittamista.
          </p>

          <div className="space-y-4 mb-8">

            <div
              className="bg-white rounded-xl p-5 flex gap-4"
              style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#f9e4d6] flex items-center justify-center flex-shrink-0">
                <span className="text-sm font-bold text-[#785a00]">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-[#241a11] mb-1">Tehtävän kuvaus</h3>
                <p className="text-sm text-[#755e4d] leading-relaxed">
                  Näet sanoja yksi kerrallaan. Tehtäväsi on päättää, onko kukin sana{" "}
                  <strong className="text-[#241a11]">oikeaa suomea</strong> vai ei.
                </p>
              </div>
            </div>

            <div
              className="bg-white rounded-xl p-5 flex gap-4"
              style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#f9e4d6] flex items-center justify-center flex-shrink-0">
                <Keyboard className="w-5 h-5 text-[#785a00]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#241a11] mb-1">Näin vastaat</h3>
                <p className="text-sm text-[#755e4d] mb-3">
                  Voit käyttää joko näytön painikkeita tai näppäimistöä:
                </p>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-bold bg-[#f9e4d6] text-[#785a00] rounded-md">A</span>
                    <span className="text-sm text-[#241a11] font-semibold">Oikea sana</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 text-xs font-bold bg-[#f9e4d6] text-[#785a00] rounded-md">L</span>
                    <span className="text-sm text-[#241a11] font-semibold">Ei sana</span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="bg-white rounded-xl p-5 flex gap-4"
              style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
            >
              <div className="w-10 h-10 rounded-lg bg-[#f9e4d6] flex items-center justify-center flex-shrink-0">
                <Timer className="w-5 h-5 text-[#785a00]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#241a11] mb-1">Vastaa rauhassa</h3>
                <p className="text-sm text-[#755e4d] leading-relaxed">
                  Tehtävällä ei ole aikarajaa, mutta pyri vastaamaan{" "}
                  <strong className="text-[#241a11]">mahdollisimman nopeasti ja tarkasti</strong>.
                  Usein ensimmäinen tuntuma on oikea.
                </p>
              </div>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/task/pseudowords")}
              className="flex items-center justify-center gap-2 bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
            >
              Jatka tehtävään
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/consent")}
              className="px-8 py-3 rounded-lg font-semibold text-[#755e4d] bg-[#f9e4d6] hover:bg-[#f3dfd1] transition-colors"
            >
              Takaisin
            </button>
          </div>

        </div>
      </div>

    </div>
  );
}
