import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadSession, computeAccuracy } from "@/lib/metrics";
import { loadWordSearchResult } from "@/lib/wordsearch";
import {
  loadSyllablesResult,
  loadMinimalPairsResult,
  loadWordChainsResult,
} from "@/lib/exerciseResults";

type Level = "sujuu" | "jonkin" | "selvia" | "missing";

interface SkillArea {
  label: string;
  level: Level;
  description: string;
}

const LEVEL_LABEL: Record<Level, string> = {
  sujuu: "Sujuu hyvin",
  jonkin: "Jonkin verran haasteita",
  selvia: "Selviä haasteita",
  missing: "Harjoitusta ei tehty",
};

const LEVEL_DOT: Record<Level, string> = {
  sujuu: "bg-green-500",
  jonkin: "bg-amber-400",
  selvia: "bg-red-500",
  missing: "bg-[#d2c5b0]",
};

const LEVEL_TEXT: Record<Level, string> = {
  sujuu: "text-green-700",
  jonkin: "text-amber-700",
  selvia: "text-red-600",
  missing: "text-[#d2c5b0]",
};

const LEVEL_BAR: Record<Level, string> = {
  sujuu: "bg-green-500",
  jonkin: "bg-amber-400",
  selvia: "bg-red-500",
  missing: "bg-[#d2c5b0]",
};

const LEVEL_WIDTH: Record<Level, string> = {
  sujuu: "100%",
  jonkin: "66%",
  selvia: "33%",
  missing: "0%",
};

function scoreToLevel(correct: number, total: number): Level {
  if (total === 0) return "missing";
  const ratio = correct / total;
  if (ratio >= 0.75) return "sujuu";
  if (ratio >= 0.5) return "jonkin";
  return "selvia";
}

const DESCRIPTIONS: Record<string, Record<Level, string>> = {
  sanantunnistus: {
    sujuu: "Todellisten sanojen ja epäsanojen erottaminen onnistui sujuvasti.",
    jonkin: "Todellisten sanojen ja epäsanojen erottamisessa esiintyi jonkin verran epävarmuutta.",
    selvia: "Todellisten sanojen ja epäsanojen erottamisessa oli selviä vaikeuksia.",
    missing: "Harjoitusta ei tehty.",
  },
  tavut: {
    sujuu: "Sanojen rakentaminen tavuista onnistui hyvin.",
    jonkin: "Sanojen rakentamisessa tavuista esiintyi jonkin verran vaikeuksia.",
    selvia: "Sanojen rakentamisessa tavuista oli selviä vaikeuksia.",
    missing: "Harjoitusta ei tehty.",
  },
  lukunopeus: {
    sujuu: "Sanojen löytäminen tekstistä onnistui sujuvasti.",
    jonkin: "Sanojen löytämisessä tekstistä esiintyi jonkin verran hitautta tai epätarkkuutta.",
    selvia: "Sanojen löytämisessä tekstistä oli selviä vaikeuksia.",
    missing: "Harjoitusta ei tehty.",
  },
  pituuserot: {
    sujuu: "Vokaali- ja konsonanttipituuksien erottaminen onnistui hyvin.",
    jonkin: "Vokaali- ja konsonanttipituuksien erottamisessa esiintyi jonkin verran epävarmuutta.",
    selvia: "Vokaali- ja konsonanttipituuksien erottamisessa oli selviä vaikeuksia.",
    missing: "Harjoitusta ei tehty.",
  },
  sanarajat: {
    sujuu: "Sanarajojen tunnistaminen yhteenkirjoitetussa tekstissä onnistui hyvin.",
    jonkin: "Sanarajojen tunnistamisessa yhteenkirjoitetussa tekstissä esiintyi jonkin verran vaikeuksia.",
    selvia: "Sanarajojen tunnistamisessa yhteenkirjoitetussa tekstissä oli selviä haasteita.",
    missing: "Harjoitusta ei tehty.",
  },
};

function buildSummary(areas: SkillArea[]): string {
  const completed = areas.filter(a => a.level !== "missing");
  if (completed.length === 0) {
    return "Yhtään harjoitusta ei ole tehty. Tee harjoitukset nähdäksesi yhteenvedon.";
  }
  const severeCount = completed.filter(a => a.level === "selvia").length;
  const goodCount = completed.filter(a => a.level === "sujuu").length;

  if (goodCount === completed.length) {
    return "Tulokset viittaavat sujuvaan lukutaitoon kaikilla mitatuilla osa-alueilla.";
  }
  if (severeCount >= 2) {
    return "Tulokset viittaavat selkeisiin haasteisiin useammalla osa-alueella. Asiantuntijan arvio voi olla hyödyllinen.";
  }
  if (severeCount === 1) {
    return "Tuloksissa on vaihtelua. Yhdellä osa-alueella esiintyi selviä haasteita, muut sujuivat kohtuullisesti tai hyvin.";
  }
  return "Tulokset viittaavat pääosin sujuvaan lukutaitoon. Yhdellä tai kahdella osa-alueella esiintyi jonkin verran haasteita.";
}

function SkillRow({ area }: { area: SkillArea }) {
  return (
    <div className="py-5">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-[#241a11]">{area.label}</span>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${LEVEL_DOT[area.level]}`} />
          <span className={`text-sm font-semibold ${LEVEL_TEXT[area.level]}`}>
            {LEVEL_LABEL[area.level]}
          </span>
        </div>
      </div>
      <div className="h-1.5 bg-[#f9e4d6] rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full transition-all ${LEVEL_BAR[area.level]}`}
          style={{ width: LEVEL_WIDTH[area.level] }}
        />
      </div>
      <p className="text-sm text-[#755e4d] leading-relaxed">{area.description}</p>
    </div>
  );
}

export default function FinalResults() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState<SkillArea[]>([]);

  useEffect(() => {
    const trials = loadSession();
    const pseudoAccuracy = trials && trials.length > 0 ? computeAccuracy(trials) : null;
    const sanantunnistusLevel: Level =
      pseudoAccuracy === null
        ? "missing"
        : pseudoAccuracy >= 75
        ? "sujuu"
        : pseudoAccuracy >= 50
        ? "jonkin"
        : "selvia";

    const syllables = loadSyllablesResult();
    const tavutLevel: Level = syllables ? scoreToLevel(syllables.correct, syllables.total) : "missing";

    const wordSearch = loadWordSearchResult();
    const lukunopeusLevel: Level = wordSearch
      ? scoreToLevel(wordSearch.foundCorrect, wordSearch.totalTargets)
      : "missing";

    const minimalPairs = loadMinimalPairsResult();
    const pituuserotLevel: Level = minimalPairs
      ? scoreToLevel(minimalPairs.correct, minimalPairs.total)
      : "missing";

    const wordChains = loadWordChainsResult();
    const sanarajatLevel: Level = wordChains
      ? scoreToLevel(wordChains.correct, wordChains.total)
      : "missing";

    setAreas([
      { label: "Sanantunnistus", level: sanantunnistusLevel, description: DESCRIPTIONS.sanantunnistus[sanantunnistusLevel] },
      { label: "Tavujen käsittely", level: tavutLevel, description: DESCRIPTIONS.tavut[tavutLevel] },
      { label: "Lukunopeus ja hahmottaminen", level: lukunopeusLevel, description: DESCRIPTIONS.lukunopeus[lukunopeusLevel] },
      { label: "Pituuserojen tunnistaminen", level: pituuserotLevel, description: DESCRIPTIONS.pituuserot[pituuserotLevel] },
      { label: "Sanarajojen hahmottaminen", level: sanarajatLevel, description: DESCRIPTIONS.sanarajat[sanarajatLevel] },
    ]);
  }, []);

  const summary = buildSummary(areas);

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
      </nav>

      <div className="flex-1 px-6 py-8 max-w-2xl mx-auto w-full">

        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#785a00] bg-[#f9e4d6] px-3 py-1 rounded-md mb-6">
          Seulonnan tulokset
        </span>

        <h1 className="text-3xl font-bold text-[#241a11] tracking-tight mb-2">
          Tulokset
        </h1>
        <p className="text-[#755e4d] mb-10 leading-relaxed">
          Tämä testi antaa suuntaa lukemiseen liittyvistä vahvuuksista ja mahdollisista haasteista.
          Se ei ole virallinen diagnoosi.
        </p>

        {/* Summary */}
        <div
          className="bg-white rounded-xl p-6 mb-6"
          style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
        >
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-3">Yhteenveto</p>
          <p className="text-[#241a11] leading-relaxed">{summary}</p>
        </div>

        {/* Skill areas */}
        <div
          className="bg-white rounded-xl px-6 mb-6"
          style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
        >
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest pt-6 mb-2">Osa-alueet</p>
          {areas.map((area, i) => (
            <div key={area.label}>
              <SkillRow area={area} />
              {i < areas.length - 1 && <div className="h-px bg-[#f9e4d6]" />}
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <p className="text-sm text-[#d2c5b0] text-center mb-8 px-4 leading-relaxed">
          Tämä testi ei ole lääketieteellinen diagnoosi. Tarvittaessa käänny asiantuntijan puoleen.
        </p>

        {/* Resources */}
        <div
          className="bg-white rounded-xl p-6 mb-8"
          style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
        >
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-4">Lisätietoa ja jatkoaskeleet</p>
          <p className="text-sm text-[#755e4d] mb-5 leading-relaxed">
            Jos testi viittaa lukemisen haasteisiin, virallinen arvio kannattaa tehdä asiantuntijan
            kanssa. Dysleksia on oppimisvaikeus, joka voidaan tunnistaa ja jonka kanssa voi oppia
            pärjäämään hyvin oikeilla tukitoimilla.
          </p>
          <ul className="space-y-4 text-sm">
            {[
              {
                href: "https://www.lukimat.fi",
                label: "Lukimat.fi",
                desc: "Niilo Mäki Instituutin lukemisen ja laskemisen tukimateriaali",
              },
              {
                href: "https://www.eoliitto.fi/oppimisvaikeudet/luku-ja-kirjoitusvaikeudet/",
                label: "Erilaisten oppijain liitto",
                desc: "neuvontaa ja vertaistukea oppimisvaikeuksiin",
              },
              {
                href: "https://www.nmi.fi",
                label: "Niilo Mäki Instituutti",
                desc: "tutkimustietoa oppimisvaikeuksista",
              },
              {
                href: "https://www.kuntoutussaatio.fi/henkiloasiakkaat/oppimisen-tuki",
                label: "Kuntoutussäätiö — oppimisen tuki",
                desc: "tietoa ja tukea oppimisen vaikeuksiin",
              },
            ].map(({ href, label, desc }) => (
              <li key={href} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-[#C69A2B] mt-2 flex-shrink-0" />
                <span>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-[#C69A2B] hover:text-[#785a00] transition-colors underline underline-offset-4"
                  >
                    {label}
                  </a>
                  <span className="text-[#755e4d]"> — {desc}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Etusivulle
          </button>
          <button
            onClick={() => navigate("/exercises")}
            className="flex-1 bg-[#4A3728] hover:bg-[#2F241B] text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Harjoituksiin
          </button>
        </div>

      </div>

      {/* Footer */}
      <footer className="px-6 py-4 text-center text-xs text-[#d2c5b0] mt-8">
        LukiSeula © 2025
      </footer>

    </div>
  );
}
