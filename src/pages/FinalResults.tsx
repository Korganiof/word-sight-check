import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
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

const LEVEL_COLOR: Record<Level, string> = {
  sujuu: "bg-green-500",
  jonkin: "bg-amber-400",
  selvia: "bg-red-500",
  missing: "bg-muted",
};

const LEVEL_TEXT_COLOR: Record<Level, string> = {
  sujuu: "text-green-700",
  jonkin: "text-amber-700",
  selvia: "text-red-700",
  missing: "text-muted-foreground",
};

const LEVEL_BAR_WIDTH: Record<Level, string> = {
  sujuu: "w-full",
  jonkin: "w-2/3",
  selvia: "w-1/3",
  missing: "w-0",
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
    <div className="py-4 border-b last:border-b-0">
      <div className="flex items-center justify-between mb-2">
        <span className="font-medium text-foreground">{area.label}</span>
        <span className={cn("text-sm font-semibold", LEVEL_TEXT_COLOR[area.level])}>
          {LEVEL_LABEL[area.level]}
        </span>
      </div>

      {/* Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden mb-2">
        <div
          className={cn("h-full rounded-full transition-all", LEVEL_COLOR[area.level], LEVEL_BAR_WIDTH[area.level])}
        />
      </div>

      <p className="text-sm text-muted-foreground">{area.description}</p>
    </div>
  );
}

export default function FinalResults() {
  const navigate = useNavigate();
  const [areas, setAreas] = useState<SkillArea[]>([]);

  useEffect(() => {
    // 1. Sanantunnistus — pseudoword accuracy
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

    // 2. Tavujen käsittely — syllables
    const syllables = loadSyllablesResult();
    const tavutLevel: Level = syllables ? scoreToLevel(syllables.correct, syllables.total) : "missing";

    // 3. Lukunopeus ja hahmottaminen — word search
    const wordSearch = loadWordSearchResult();
    const lukunopeusLevel: Level = wordSearch
      ? scoreToLevel(wordSearch.foundCorrect, wordSearch.totalTargets)
      : "missing";

    // 4. Pituuserojen tunnistaminen — minimal pairs
    const minimalPairs = loadMinimalPairsResult();
    const pituuserotLevel: Level = minimalPairs
      ? scoreToLevel(minimalPairs.correct, minimalPairs.total)
      : "missing";

    // 5. Sanarajojen hahmottaminen — word chains
    const wordChains = loadWordChainsResult();
    const sanarajatLevel: Level = wordChains
      ? scoreToLevel(wordChains.correct, wordChains.total)
      : "missing";

    setAreas([
      {
        label: "Sanantunnistus",
        level: sanantunnistusLevel,
        description: DESCRIPTIONS.sanantunnistus[sanantunnistusLevel],
      },
      {
        label: "Tavujen käsittely",
        level: tavutLevel,
        description: DESCRIPTIONS.tavut[tavutLevel],
      },
      {
        label: "Lukunopeus ja hahmottaminen",
        level: lukunopeusLevel,
        description: DESCRIPTIONS.lukunopeus[lukunopeusLevel],
      },
      {
        label: "Pituuserojen tunnistaminen",
        level: pituuserotLevel,
        description: DESCRIPTIONS.pituuserot[pituuserotLevel],
      },
      {
        label: "Sanarajojen hahmottaminen",
        level: sanarajatLevel,
        description: DESCRIPTIONS.sanarajat[sanarajatLevel],
      },
    ]);
  }, []);

  const summary = buildSummary(areas);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Title */}
        <h1 className="text-4xl font-bold text-foreground mb-3">Tulokset</h1>

        {/* Intro */}
        <p className="text-muted-foreground mb-8">
          Tämä testi antaa suuntaa lukemiseen liittyvistä vahvuuksista ja mahdollisista haasteista.
          Se ei ole virallinen diagnoosi.
        </p>

        {/* Summary */}
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wide">
              Yhteenveto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-foreground">{summary}</p>
          </CardContent>
        </Card>

        {/* Skill areas */}
        <Card className="mb-8 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-muted-foreground uppercase tracking-wide">
              Osa-alueet
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {areas.map(area => (
              <SkillRow key={area.label} area={area} />
            ))}
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <p className="text-sm text-muted-foreground text-center mb-8 px-4">
          Tämä testi ei ole lääketieteellinen diagnoosi. Tarvittaessa käänny asiantuntijan puoleen.
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1" onClick={() => navigate("/exercises")}>
            Harjoituksiin
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate("/")}>
            Etusivulle
          </Button>
        </div>
      </div>
    </div>
  );
}
