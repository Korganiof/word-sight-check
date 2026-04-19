import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Stethoscope, EyeOff, Info, ArrowRight, Sparkles, GraduationCap } from "lucide-react";

export default function Consent() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
      </nav>

      {/* Progress indicator */}
      <div className="px-6 pb-2 max-w-2xl mx-auto w-full">
        <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-1">
          Valmistelu
        </p>
        <div className="h-1 bg-[#f9e4d6] rounded-full">
          <div className="h-1 bg-[#C69A2B] rounded-full w-0" />
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-6 py-8">
        <div className="w-full max-w-2xl">

          <h1 className="text-3xl font-bold text-[#241a11] tracking-tight mb-2">
            Suostumus ja ymmärrys
          </h1>
          <p className="text-[#755e4d] mb-8 leading-relaxed">
            Ennen kuin aloitamme luku- ja kirjoitusvalmiuksien kartoituksen, pyydämme
            sinua lukemaan ja hyväksymään seuraavat ehdot.
          </p>

          {/* Info blocks */}
          <div className="space-y-4 mb-8">
            <div className="bg-[#ffffff] rounded-xl p-5 flex gap-4" style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}>
              <div className="w-10 h-10 rounded-lg bg-[#f9e4d6] flex items-center justify-center flex-shrink-0">
                <GraduationCap className="w-5 h-5 text-[#785a00]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#241a11] mb-1">Suunniteltu vähintään 15-vuotiaille</h3>
                <p className="text-sm text-[#755e4d] leading-relaxed">
                  Tehtävät on mitoitettu nuorille ja aikuisille — noin 9. luokasta ylöspäin.
                  Nuoremmille lapsille lukemisen arviointi kannattaa tehdä koulussa erityisopettajan
                  kanssa, jolla on ikätasolle sopivat välineet.
                </p>
              </div>
            </div>

            <div className="bg-[#ffffff] rounded-xl p-5 flex gap-4" style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}>
              <div className="w-10 h-10 rounded-lg bg-[#f9e4d6] flex items-center justify-center flex-shrink-0">
                <Stethoscope className="w-5 h-5 text-[#785a00]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#241a11] mb-1">Tämä EI ole diagnoosi</h3>
                <p className="text-sm text-[#755e4d] leading-relaxed">
                  Tämä työkalu tarjoaa vain alustavaa, suuntaa antavaa tietoa. Virallisen
                  diagnoosin saamiseksi tarvitaan aina ammattilaisen, kuten erikoisopettajan
                  tai psykologin tekemä tutkimus.
                </p>
              </div>
            </div>

            <div className="bg-[#ffffff] rounded-xl p-5 flex gap-4" style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}>
              <div className="w-10 h-10 rounded-lg bg-[#f9e4d6] flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-[#785a00]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#241a11] mb-1">Harrasteprojekti, rakennettu tekoälyllä</h3>
                <p className="text-sm text-[#755e4d] leading-relaxed">
                  LukiSeula on yksityishenkilön harrasteprojekti, joka on toteutettu tekoälyn
                  avustuksella. Se ei ole kliininen, ammatillinen eikä tieteellisesti validoitu
                  arviointiväline — vaan harjoitusluonteinen kokeilu.
                </p>
              </div>
            </div>

            <div className="bg-[#ffffff] rounded-xl p-5 flex gap-4" style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}>
              <div className="w-10 h-10 rounded-lg bg-[#f9e4d6] flex items-center justify-center flex-shrink-0">
                <EyeOff className="w-5 h-5 text-[#785a00]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#241a11] mb-1">Käyttö on anonyymia</h3>
                <p className="text-sm text-[#755e4d] leading-relaxed">
                  Emme kerää henkilötietoja. Tuloksesi säilyvät vain tämän istunnon ajan,
                  eikä niitä voida yhdistää sinuun henkilökohtaisesti.
                </p>
              </div>
            </div>

            <div className="bg-[#ffffff] rounded-xl p-5 flex gap-4" style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}>
              <div className="w-10 h-10 rounded-lg bg-[#f9e4d6] flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5 text-[#785a00]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#241a11] mb-1">Hakeudu tarvittaessa tutkimuksiin</h3>
                <p className="text-sm text-[#755e4d] leading-relaxed">
                  Jos kartoituksen tulokset herättävät huolta, suosittelemme ottamaan yhteyttä
                  terveydenhuollon tai oppilaitoksesi asiantuntijoihin lisätutkimuksia varten.
                </p>
              </div>
            </div>
          </div>

          {/* Checkbox */}
          <label className="flex items-start gap-3 cursor-pointer mb-8 bg-[#fff1e8] rounded-xl p-4">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1 w-4 h-4 rounded accent-[#C69A2B] flex-shrink-0"
            />
            <span className="text-sm text-[#241a11] leading-relaxed">
              Ymmärrän, että tämä ei ole <strong>diagnoosi</strong>, että kyseessä on{" "}
              <strong>tekoälyavusteinen harrasteprojekti</strong> ja että käyttökertani on{" "}
              <strong>anonyymi</strong>. Hyväksyn nämä ehdot ja haluan jatkaa seulonnan tekemistä.
            </span>
          </label>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => { if (agreed) { localStorage.setItem("lukiseula_started_at", String(Date.now())); navigate("/start"); } }}
              disabled={!agreed}
              className="flex items-center justify-center gap-2 bg-[#C69A2B] text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#785a00]"
            >
              Jatka tehtävään
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-8 py-3 rounded-lg font-semibold text-[#755e4d] bg-[#f9e4d6] hover:bg-[#f3dfd1] transition-colors"
            >
              Peruuta
            </button>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-[#d2c5b0]">
        LukiSeula © 2025
      </footer>

    </div>
  );
}
