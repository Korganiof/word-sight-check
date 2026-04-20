import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadSession, computeAccuracy } from "@/lib/metrics";
import { loadWordSearchResult } from "@/lib/wordsearch";
import {
  loadWordChainsResult,
  loadSpellingErrorsResult,
  loadReadingCompResult,
} from "@/lib/exerciseResults";

// ─────────────────────────────────────────────────────────────
// Levels & meta — same logic as the prior FinalResults,
// extended with warm status colors that sit inside the palette.
// ─────────────────────────────────────────────────────────────
type Level = "sujuu" | "jonkin" | "selvia" | "missing";

interface LevelMeta {
  label: string;
  short: string;
  ratio: number;
  color: string;
  soft: string;
}

const LEVEL_META: Record<Level, LevelMeta> = {
  sujuu:   { label: "Sujuu hyvin",             short: "Sujuu",     ratio: 1.00, color: "#4f7a3a", soft: "#e6ebd8" },
  jonkin:  { label: "Jonkin verran haasteita", short: "Vaihtelua", ratio: 0.66, color: "#C69A2B", soft: "#f9e4d6" },
  selvia:  { label: "Selviä haasteita",        short: "Haasteita", ratio: 0.33, color: "#a6442a", soft: "#f1d8ce" },
  missing: { label: "Harjoitusta ei tehty",    short: "Puuttuu",   ratio: 0.00, color: "#d2c5b0", soft: "#f0ece3" },
};

function scoreToLevel(correct: number, total: number): Level {
  if (total === 0) return "missing";
  const ratio = correct / total;
  if (ratio >= 0.75) return "sujuu";
  if (ratio >= 0.5) return "jonkin";
  return "selvia";
}

interface SkillArea {
  key: string;
  part: string;
  label: string;
  sub: string;
  level: Level;
  description: string;
}

const DESCRIPTIONS: Record<string, Record<Level, string>> = {
  sanantunnistus: {
    sujuu: "Todellisten sanojen ja epäsanojen erottaminen onnistui sujuvasti.",
    jonkin: "Todellisten sanojen ja epäsanojen erottamisessa esiintyi jonkin verran epävarmuutta.",
    selvia: "Todellisten sanojen ja epäsanojen erottamisessa oli selviä vaikeuksia.",
    missing: "Harjoitusta ei tehty.",
  },
  lukunopeus: {
    sujuu: "Sanojen löytäminen tekstistä onnistui sujuvasti.",
    jonkin: "Sanojen löytämisessä tekstistä esiintyi jonkin verran hitautta tai epätarkkuutta.",
    selvia: "Sanojen löytämisessä tekstistä oli selviä vaikeuksia.",
    missing: "Harjoitusta ei tehty.",
  },
  sanarajat: {
    sujuu: "Sanarajojen tunnistaminen yhteenkirjoitetussa tekstissä onnistui hyvin.",
    jonkin: "Sanarajojen tunnistamisessa yhteenkirjoitetussa tekstissä esiintyi jonkin verran vaikeuksia.",
    selvia: "Sanarajojen tunnistamisessa yhteenkirjoitetussa tekstissä oli selviä haasteita.",
    missing: "Harjoitusta ei tehty.",
  },
  kirjoitusvirheet: {
    sujuu: "Kirjoitusvirheiden tunnistaminen sanalistasta onnistui hyvin.",
    jonkin: "Kirjoitusvirheiden tunnistamisessa esiintyi jonkin verran epätarkkuutta.",
    selvia: "Kirjoitusvirheiden tunnistamisessa oli selviä vaikeuksia.",
    missing: "Harjoitusta ei tehty.",
  },
  luetunYmmartaminen: {
    sujuu: "Luetun ymmärtäminen onnistui hyvin — tekstin sisältö jäsentyi selkeästi.",
    jonkin: "Luetun ymmärtämisessä esiintyi jonkin verran epävarmuutta yksityiskohdissa.",
    selvia: "Luetun ymmärtämisessä oli selviä haasteita.",
    missing: "Harjoitusta ei tehty.",
  },
};

const AREA_STATIC: Array<Pick<SkillArea, "key" | "part" | "label" | "sub">> = [
  { key: "sanantunnistus",     part: "Osa 1", label: "Sanantunnistus",              sub: "Todellisten ja epäsanojen erottaminen" },
  { key: "lukunopeus",         part: "Osa 2", label: "Lukunopeus ja hahmottaminen", sub: "Sanojen löytäminen tekstistä" },
  { key: "sanarajat",          part: "Osa 3", label: "Sanarajojen hahmottaminen",   sub: "Sanojen erottaminen yhteenkirjoitetussa tekstissä" },
  { key: "kirjoitusvirheet",   part: "Osa 4", label: "Kirjoitusvirheiden tunnistus", sub: "Virheellisten sanojen löytäminen sanalistasta" },
  { key: "luetunYmmartaminen", part: "Osa 5", label: "Luetun ymmärtäminen",         sub: "Tekstin sisällön jäsentäminen ja tulkinta" },
];

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

function buildInterpretation(areas: SkillArea[]): string {
  const completed = areas.filter(a => a.level !== "missing");
  if (completed.length === 0) return "";
  const severeCount = completed.filter(a => a.level === "selvia").length;
  const mildCount = completed.filter(a => a.level === "jonkin").length;
  const goodCount = completed.filter(a => a.level === "sujuu").length;

  if (goodCount === completed.length) {
    return "Tämä ei silti sulje pois lukivaikeuksia — seulonnan tarkkuus on rajallinen, ja arki on parempi mittari kuin lyhyt tehtäväsarja. Jos lukeminen tuntuu silti kuormittavalta, aiheesta kannattaa keskustella.";
  }
  if (severeCount >= 2) {
    return "Tämänkaltainen kuvio voi olla yhteydessä lukemisen vaikeuksiin, mutta seulonta ei todenna eikä poissulje mitään. Jos tulokset tuntuvat arjessa tutuilta, ammattilaisen arvio voi tuoda selkeyttä.";
  }
  if (severeCount === 1 || mildCount >= 2) {
    return "Haasteet voivat liittyä lukemisen sujuvuuteen tai tarkkuuteen, mutta yhdestä seulonnasta ei voi tehdä päätelmiä. Vireystila, keskittyminen ja päivän kulku vaikuttavat tuloksiin.";
  }
  return "Yksittäiset epävarmuudet ovat tavallisia eivätkä kerro vielä mistään. Jos lukeminen tuntuu arjessa raskaalta, kannattaa kysyä asiaa ammattilaiselta.";
}

const NMI_ALIGNED_KEYS = ["sanarajat", "kirjoitusvirheet", "luetunYmmartaminen"] as const;

function shouldFlagSupportNeed(areas: SkillArea[]): boolean {
  const nmiAreas = areas.filter(a =>
    (NMI_ALIGNED_KEYS as readonly string[]).includes(a.key) && a.level !== "missing",
  );
  if (nmiAreas.length < 2) return false;
  const severe = nmiAreas.filter(a => a.level === "selvia").length;
  return severe >= 2;
}

const RESOURCES = [
  { href: "https://www.lukimat.fi", label: "Lukimat.fi",
    desc: "Niilo Mäki Instituutin lukemisen ja laskemisen tukimateriaali" },
  { href: "https://www.eoliitto.fi/oppimisvaikeudet/luku-ja-kirjoitusvaikeudet/", label: "Erilaisten oppijain liitto",
    desc: "neuvontaa ja vertaistukea oppimisvaikeuksiin" },
  { href: "https://www.nmi.fi", label: "Niilo Mäki Instituutti",
    desc: "tutkimustietoa oppimisvaikeuksista" },
  { href: "https://www.kuntoutussaatio.fi/henkiloasiakkaat/oppimisen-tuki", label: "Kuntoutussäätiö — oppimisen tuki",
    desc: "tietoa ja tukea oppimisen vaikeuksiin" },
  { href: "https://helda.helsinki.fi/items/1a192f9a-1368-4b3d-a826-7f07c37181d1", label: "Panula, A.-M. (2013)",
    desc: "Lukemisvaikeudet ja osa-aikainen erityisopetus — seurantatutkimus (Helsingin yliopisto, väitöskirja)" },
];

// ─────────────────────────────────────────────────────────────
// Atoms — using inline hex (matches existing Home.tsx / ExerciseList.tsx style)
// ─────────────────────────────────────────────────────────────
function Chip({ level }: { level: Level }) {
  const m = LEVEL_META[level];
  return (
    <div
      className="inline-flex items-center gap-2 px-2.5 py-1 rounded"
      style={{ background: m.soft, color: m.color }}
    >
      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: m.color }} />
      <span className="text-[11px] font-bold uppercase tracking-[0.08em]">{m.label}</span>
    </div>
  );
}

function SegmentedBar({ level }: { level: Level }) {
  const m = LEVEL_META[level];
  const segs = 12;
  const fill = Math.round(m.ratio * segs);
  return (
    <div className="flex gap-[3px]">
      {Array.from({ length: segs }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-2 rounded-[1px]"
          style={{ background: i < fill ? m.color : "#f9e4d6" }}
        />
      ))}
    </div>
  );
}

function DossierRow({ area, index }: { area: SkillArea; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <div
      className="grid gap-6 py-7"
      style={{ gridTemplateColumns: "60px 1fr" }}
    >
      <div
        className="text-4xl font-extralight leading-none tabular-nums"
        style={{ color: "#d2c5b0", letterSpacing: "-0.02em" }}
      >
        {num}
      </div>

      <div>
        <div className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2" style={{ color: "#785a00" }}>
          {area.part} · {area.sub}
        </div>

        <div className="flex items-baseline justify-between gap-4 mb-3.5">
          <h3 className="m-0 text-2xl font-bold leading-tight" style={{ color: "#241a11", letterSpacing: "-0.02em" }}>
            {area.label}
          </h3>
          <Chip level={area.level} />
        </div>

        <div className="mb-3.5">
          <SegmentedBar level={area.level} />
        </div>

        <p className="m-0 text-[15px] leading-[1.6] max-w-[560px]" style={{ color: "#755e4d" }}>
          {area.description}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function FinalResults() {
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const [areas, setAreas] = useState<SkillArea[]>([]);
  const [startedAt] = useState<number>(() => {
    const raw = localStorage.getItem("lukiseula_started_at");
    return raw ? Number(raw) : Date.now();
  });

  useEffect(() => {
    const trials = loadSession();
    const pseudoAccuracy = trials && trials.length > 0 ? computeAccuracy(trials) : null;
    const sanantunnistusLevel: Level =
      pseudoAccuracy === null ? "missing"
      : pseudoAccuracy >= 75 ? "sujuu"
      : pseudoAccuracy >= 50 ? "jonkin"
      : "selvia";

    const wordSearch = loadWordSearchResult();
    const wordChains = loadWordChainsResult();
    const spellingErrors = loadSpellingErrorsResult();
    const readingComp = loadReadingCompResult();

    const levels: Record<string, Level> = {
      sanantunnistus: sanantunnistusLevel,
      lukunopeus: wordSearch ? scoreToLevel(wordSearch.foundCorrect, wordSearch.totalTargets) : "missing",
      sanarajat: wordChains ? scoreToLevel(wordChains.correct, wordChains.total) : "missing",
      kirjoitusvirheet: spellingErrors ? scoreToLevel(spellingErrors.correct, spellingErrors.total) : "missing",
      luetunYmmartaminen: readingComp ? scoreToLevel(readingComp.correct, readingComp.total) : "missing",
    };

    setAreas(AREA_STATIC.map(a => ({
      ...a,
      level: levels[a.key],
      description: DESCRIPTIONS[a.key][levels[a.key]],
    })));
  }, []);

  const summary = useMemo(() => buildSummary(areas), [areas]);
  const interpretation = useMemo(() => buildInterpretation(areas), [areas]);
  const supportNeedFlag = useMemo(() => shouldFlagSupportNeed(areas), [areas]);
  const strengths = useMemo(() => areas.filter(a => a.level === "sujuu"), [areas]);
  const challenges = useMemo(
    () => areas.filter(a => a.level === "selvia" || a.level === "jonkin"),
    [areas],
  );
  const completed = areas.filter(a => a.level !== "missing").length;

  const now = new Date();
  const dateStr = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
  const durationMin = Math.max(1, Math.round((Date.now() - startedAt) / 60000));

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen font-sans flex flex-col" style={{ background: "#fff8f5" }}>

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between print:hidden">
        <span className="text-lg font-bold tracking-tight" style={{ color: "#241a11" }}>LukiSeula</span>
        <button
          onClick={() => navigate("/")}
          className="text-sm transition-colors hover:text-[#241a11]"
          style={{ color: "#755e4d" }}
        >
          Etusivulle
        </button>
      </nav>

      <div ref={printRef} className="flex-1 w-full max-w-2xl mx-auto px-8 sm:px-16 py-14 print:py-8">

        {/* Masthead */}
        <div className="flex items-baseline justify-between pb-6">
          <div className="text-sm font-bold" style={{ color: "#241a11" }}>LukiSeula</div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#785a00" }}>
            Raportti · {dateStr}
          </div>
        </div>

        <div className="h-0.5 mb-9" style={{ background: "#2F241B" }} />

        {/* Title */}
        <div className="mb-10">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#785a00" }}>
            Seulonnan tulokset
          </div>
          <h1 className="m-0 text-5xl sm:text-6xl font-bold leading-[1.05]" style={{ color: "#241a11", letterSpacing: "-0.03em", textWrap: "balance" as const }}>
            Lukutaidon<br />koonti.
          </h1>
        </div>

        {/* Meta row — alternating bg bands, no lines */}
        <div className="grid grid-cols-3 mb-10" style={{ background: "#ffffff" }}>
          {[
            ["Osa-alueita tehty", `${completed} / ${areas.length || 5}`],
            ["Kesto", `${durationMin} min`],
            ["Raportin tyyppi", "Alustava"],
          ].map(([k, v], i) => (
            <div key={k} className="p-6" style={{ background: i % 2 === 1 ? "#f9ede4" : "#ffffff" }}>
              <div className="text-[10px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "#785a00" }}>{k}</div>
              <div className="text-[22px] font-semibold tabular-nums" style={{ color: "#241a11", letterSpacing: "-0.02em" }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="p-8 mb-8" style={{ background: "#f9ede4" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#785a00" }}>Yhteenveto</div>
          <p className="m-0 text-xl leading-[1.45]" style={{ color: "#241a11", letterSpacing: "-0.01em", textWrap: "balance" as const }}>{summary}</p>
          {interpretation && (
            <p className="mt-4 mb-0 text-[15px] leading-[1.65]" style={{ color: "#4A3728" }}>{interpretation}</p>
          )}
        </div>

        {/* NMI support-need flag */}
        {supportNeedFlag && (
          <div className="p-6 mb-8 border-l-4" style={{ background: "#f1d8ce", borderColor: "#a6442a" }}>
            <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-2" style={{ color: "#a6442a" }}>
              Tuen tarpeen selvittely
            </div>
            <p className="m-0 text-[15px] leading-[1.65]" style={{ color: "#241a11" }}>
              <strong>Tuen tarpeen selvittely on vähintään suositeltavaa.</strong> Useammalla niistä osa-alueista,
              joita käytetään tieteellisessä lukiseulassa (sanarajat, kirjoitusvirheet, luetun ymmärtäminen),
              esiintyi selviä haasteita. Tämä kaava vastaa Niilo Mäki Instituutin nuorten ja aikuisten lukiseulan
              (Holopainen ym. 2004) ohjaavaa raja-arvoa, jota myös Panulan (2013) väitöstutkimus käyttää.
            </p>
            <p className="mt-3 mb-0 text-xs leading-[1.6] italic" style={{ color: "#755e4d" }}>
              LukiSeulan katkaisupiste on heuristinen, ei kliinisesti normeerattu. Tuloksia ei tule tulkita
              diagnoosina — ammattilaisen arvio tuo selkeyttä.
            </p>
          </div>
        )}

        {/* Strengths / challenges split */}
        {(strengths.length > 0 || challenges.length > 0) && (
          <div className="grid md:grid-cols-2 gap-4 mb-10">
            <div className="p-6" style={{ background: "#e6ebd8" }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#4f7a3a" }}>
                Missä sujui hyvin
              </div>
              {strengths.length === 0 ? (
                <p className="m-0 text-sm italic leading-[1.5]" style={{ color: "#755e4d" }}>
                  Ei sujuneita osa-alueita tällä kertaa — se ei tarkoita mitään yksittäisenä tuloksena.
                </p>
              ) : (
                <ul className="m-0 p-0 list-none space-y-1.5">
                  {strengths.map(a => (
                    <li key={a.key} className="text-[15px] leading-[1.5]" style={{ color: "#241a11" }}>
                      {a.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="p-6" style={{ background: "#f1d8ce" }}>
              <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#a6442a" }}>
                Missä oli haasteita
              </div>
              {challenges.length === 0 ? (
                <p className="m-0 text-sm italic leading-[1.5]" style={{ color: "#755e4d" }}>
                  Ei selviä haasteita tällä kertaa.
                </p>
              ) : (
                <ul className="m-0 p-0 list-none space-y-1.5">
                  {challenges.map(a => (
                    <li key={a.key} className="text-[15px] leading-[1.5]" style={{ color: "#241a11" }}>
                      {a.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}

        {/* Section header */}
        <div className="flex items-baseline justify-between mb-2">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: "#785a00" }}>Tarkemmat tulokset</div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: "#d2c5b0" }}>{areas.length} kohtaa</div>
        </div>
        <div className="h-px mb-2" style={{ background: "#241a11" }} />

        {/* Rows — alternating bg */}
        <div className="-mx-5">
          {areas.map((area, i) => (
            <div key={area.key} className="px-5" style={{ background: i % 2 === 0 ? "#fff8f5" : "#f9ede4" }}>
              <DossierRow area={area} index={i} />
            </div>
          ))}
        </div>

        {/* Menetelmä — what each area measures */}
        <div className="mt-12">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: "#785a00" }}>
            Menetelmä — mitä osa-alueet mittaavat
          </div>
          <dl className="m-0 space-y-5">
            <div>
              <dt className="text-[15px] font-semibold mb-1" style={{ color: "#241a11" }}>
                Sanantunnistus
              </dt>
              <dd className="m-0 text-[15px] leading-[1.6]" style={{ color: "#755e4d" }}>
                Dekoodaustaito — todellisten sanojen ja pseudosanojen erottaminen mittaa
                automaattista sanamuotojen tunnistusta. Toimii kirjallisena vastineena NMI:n
                sanelukirjoitus-osiolle.
              </dd>
            </div>
            <div>
              <dt className="text-[15px] font-semibold mb-1" style={{ color: "#241a11" }}>
                Lukunopeus ja hahmottaminen
              </dt>
              <dd className="m-0 text-[15px] leading-[1.6]" style={{ color: "#755e4d" }}>
                Visuaalinen sanamuotojen tunnistus ja valikoiva tarkkaavaisuus.
                Suomen säännöllisessä ortografiassa pelkkä tarkkuus saavuttaa katon
                aikuisiässä — lukunopeus erottaa lukivaikeuksia herkemmin.
              </dd>
            </div>
            <div>
              <dt className="text-[15px] font-semibold mb-1" style={{ color: "#241a11" }}>
                Sanarajat, kirjoitusvirheet ja luetun ymmärtäminen
              </dt>
              <dd className="m-0 text-[15px] leading-[1.6]" style={{ color: "#755e4d" }}>
                Nämä kolme vastaavat Niilo Mäki Instituutin nuorten ja aikuisten lukiseulan
                (Holopainen ym. 2004) ydinmittareita — Tekninen 2, Tekninen 1 ja Luetun
                ymmärtäminen. Aikarajat ja sanamäärät noudattavat NMI:n normeja.
                Tuen tarpeen selvittelyn raja-arvo perustuu näihin kolmeen.
              </dd>
            </div>
          </dl>
        </div>

        {/* Disclaimer */}
        <div className="mt-12 p-6" style={{ background: "#f9e4d6" }}>
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-1.5" style={{ color: "#785a00" }}>Huomio</div>
          <p className="m-0 text-sm leading-[1.6]" style={{ color: "#755e4d" }}>
            <strong style={{ color: "#241a11" }}>Tämä seulonta ei diagnosoi lukihäiriötä.</strong>{" "}
            Tulokset ovat vain suuntaa antavia. Jos ne herättävät huolta, käänny erikoisopettajan,
            psykologin tai terveydenhuollon ammattilaisen puoleen. LukiSeula on yksityishenkilön
            tekoälyn avustuksella rakentama harrasteprojekti — ei kliininen eikä tieteellisesti
            validoitu arviointiväline.
          </p>
        </div>

        {/* Next steps — concrete actions */}
        <div className="mt-12">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: "#785a00" }}>
            Mitä voit tehdä seuraavaksi
          </div>
          <ol className="m-0 p-0 list-none space-y-4">
            {[
              "Jos huoli on voimakas tai lukeminen kuormittaa arjessa, varaa aika erikoisopettajalle, oppilaitoksesi opinto-ohjaajalle tai terveydenhuoltoon.",
              "Keskustele havainnoistasi luotetun henkilön — opettajan, läheisen tai työterveyden — kanssa.",
              "Tutustu alla oleviin tukisivuihin. Sieltä löytyy sekä taustatietoa että konkreettisia harjoitteita.",
            ].map((text, i) => (
              <li key={i} className="grid gap-4" style={{ gridTemplateColumns: "32px 1fr" }}>
                <div className="text-lg font-bold tabular-nums leading-[1.5]" style={{ color: "#C69A2B" }}>
                  {i + 1}.
                </div>
                <p className="m-0 text-[15px] leading-[1.6]" style={{ color: "#241a11" }}>{text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Resources */}
        <div className="mt-12">
          <div className="text-[11px] font-bold uppercase tracking-[0.14em] mb-4" style={{ color: "#785a00" }}>
            Tukisivuja ja lisätietoa
          </div>
          {RESOURCES.map((r) => (
            <div
              key={r.href}
              className="grid gap-6 py-4"
              style={{ gridTemplateColumns: "220px 1fr" }}
            >
              <a
                href={r.href}
                target="_blank"
                rel="noopener noreferrer"
                className="justify-self-start self-start text-[15px] font-bold no-underline"
                style={{
                  color: "#241a11",
                  letterSpacing: "-0.01em",
                  borderBottom: "2px solid #C69A2B",
                }}
              >
                {r.label}
              </a>
              <div className="text-sm leading-[1.5]" style={{ color: "#755e4d" }}>{r.desc}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-12 print:hidden">
          <button
            onClick={handlePrint}
            className="flex-1 text-white font-semibold py-4 rounded-lg transition-colors"
            style={{ background: "#C69A2B" }}
            onMouseOver={e => (e.currentTarget.style.background = "#785a00")}
            onMouseOut={e => (e.currentTarget.style.background = "#C69A2B")}
          >
            Tallenna PDF
          </button>
          <button
            onClick={() => navigate("/exercises")}
            className="flex-1 text-white font-semibold py-4 rounded-lg transition-colors"
            style={{ background: "#4A3728" }}
            onMouseOver={e => (e.currentTarget.style.background = "#2F241B")}
            onMouseOut={e => (e.currentTarget.style.background = "#4A3728")}
          >
            Harjoituksiin
          </button>
        </div>
      </div>

      <footer className="px-6 py-4 text-center text-xs mt-8 print:hidden" style={{ color: "#d2c5b0" }}>
        LukiSeula © 2025
      </footer>
    </div>
  );
}
