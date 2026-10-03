import { useEffect, useMemo, useState } from "react";
import { CircleCheck, Download, Signpost } from "lucide-react";
import { loadSession } from "@/lib/metrics";
import { loadScreeningStartedAt } from "@/lib/screeningSession";
import { loadWordSearchResult } from "@/lib/wordsearch";
import {
  loadWordChainsResult,
  loadSpellingErrorsResult,
  loadReadingCompResult,
} from "@/lib/exerciseResults";
import { TWO_AFC_THRESHOLDS, scoreMarking, scoreToLevel, type Level } from "@/lib/levels";
import {
  AREA_STATIC,
  DESCRIPTIONS,
  RESOURCES,
  type SkillArea,
} from "@/lib/finalResultsContent";
import {
  buildSummary,
  buildInterpretation,
  shouldFlagSupportNeed,
} from "@/lib/finalResultsCopy";
import { AppBar } from "@/components/shell";
import { Button, LinkButton } from "@/components/Button";
import { LevelChip, LevelBar } from "@/components/LevelChip";
import {
  IconTile,
  Label,
  NoteBlock,
  NumberedStep,
  ResourceLink,
  Sheet,
  SiteFooter,
} from "@/components/primitives";
import "./finalResults.print.css";

const NEXT_STEPS = [
  "Jos huoli on voimakas tai lukeminen kuormittaa arjessa, varaa aika erikoisopettajalle, oppilaitoksesi opinto-ohjaajalle tai terveydenhuoltoon.",
  "Keskustele havainnoistasi luotetun henkilön — opettajan, läheisen tai työterveyden — kanssa.",
  "Tutustu alla oleviin tukisivuihin. Sieltä löytyy sekä taustatietoa että konkreettisia harjoitteita.",
];

const METHOD = [
  {
    title: "Sanantunnistus",
    text: "Dekoodaustaito — todellisten sanojen ja pseudosanojen erottaminen mittaa automaattista sanamuotojen tunnistusta. Toimii kirjallisena vastineena NMI:n sanelukirjoitus-osiolle.",
  },
  {
    title: "Lukunopeus ja hahmottaminen",
    text: "Visuaalinen sanamuotojen tunnistus ja valikoiva tarkkaavaisuus. Suomen säännöllisessä ortografiassa pelkkä tarkkuus saavuttaa katon aikuisiässä — lukunopeus erottaa lukivaikeuksia herkemmin.",
  },
  {
    title: "Sanarajat, kirjoitusvirheet ja luetun ymmärtäminen",
    text: "Nämä kolme vastaavat Niilo Mäki Instituutin nuorten ja aikuisten lukiseulan (Holopainen ym. 2004) ydinmittareita — Tekninen 2, Tekninen 1 ja Luetun ymmärtäminen. Aikarajat vastaavat NMI:n normeja; tehtävien laajuus on sovitettu selaimessa tehtäväksi. Tuen tarpeen selvittelyn raja-arvo perustuu näihin kolmeen.",
  },
];

// ─────────────────────────────────────────────────────────────
// Pieces
// ─────────────────────────────────────────────────────────────

function SectionTitle({ children, aside }: { children: string; aside?: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <h2 className="m-0 font-ui text-h2-sm text-ink">{children}</h2>
      {aside && <span className="text-caption text-ink-2">{aside}</span>}
    </div>
  );
}

function MetaList({ items, className = "" }: { items: Array<[string, string]>; className?: string }) {
  return (
    <dl className={`m-0 ${className}`}>
      {items.map(([k, v]) => (
        <div key={k} className="flex flex-col gap-1">
          <dt className="text-caption text-ink-2">{k}</dt>
          <dd className="m-0 font-ui text-[19px] font-extrabold leading-[26px] tabular-nums text-ink">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

function DetailRow({ area, index }: { area: SkillArea; index: number }) {
  const num = String(index + 1).padStart(2, "0");
  return (
    <li className="report-row grid grid-cols-[32px_minmax(0,1fr)] gap-x-4 gap-y-2.5 p-5 md:grid-cols-[48px_minmax(0,1fr)_auto] md:gap-x-6 md:gap-y-3 md:px-8 md:py-7 [&+&]:border-t [&+&]:border-line">
      <div className="pt-px">
        <span className="font-ui text-caption font-extrabold tabular-nums text-ink-2">{num}</span>
      </div>
      <div className="flex min-w-0 flex-col gap-1.5">
        <span className="text-caption text-ink-2">
          {area.part} · {area.sub}
        </span>
        <h3 className="m-0 font-ui text-h2-sm text-ink">{area.label}</h3>
      </div>
      <div className="col-start-2 flex flex-wrap items-center gap-3 md:col-start-3 md:flex-col md:items-end md:gap-3.5">
        <LevelChip level={area.level} />
        <LevelBar level={area.level} />
      </div>
      <p className="col-start-2 m-0 max-w-[620px] text-body text-ink md:col-span-2">{area.description}</p>
    </li>
  );
}

// ─────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────
export default function FinalResults() {
  const [areas, setAreas] = useState<SkillArea[]>([]);
  const [startedAt] = useState<number>(() => loadScreeningStartedAt() ?? Date.now());

  useEffect(() => {
    const trials = loadSession() ?? [];
    const wordSearch = loadWordSearchResult();
    const levelOf = (r: { correct: number; total: number } | null): Level =>
      r ? scoreToLevel(r.correct, r.total) : "missing";

    const levels: Record<string, Level> = {
      // Two-alternative task: chance is 50 %, so it gets its own cut-offs.
      sanantunnistus: scoreToLevel(trials.filter(t => t.correct).length, trials.length, TWO_AFC_THRESHOLDS),
      // Word search stores raw counts; score it like the other marking tasks.
      lukunopeus: levelOf(
        wordSearch && scoreMarking(wordSearch.foundCorrect, wordSearch.incorrectClicks, wordSearch.totalTargets),
      ),
      sanarajat: levelOf(loadWordChainsResult()),
      kirjoitusvirheet: levelOf(loadSpellingErrorsResult()),
      luetunYmmartaminen: levelOf(loadReadingCompResult()),
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

  const meta: Array<[string, string]> = [
    ["Osa-alueita tehty", `${completed} / ${areas.length || 5}`],
    ["Kesto", `${durationMin} min`],
    ["Raportin tyyppi", "Suuntaa antava"],
  ];

  const actions = (
    <>
      <Button onClick={handlePrint} className="w-full px-5">
        <Download aria-hidden="true" />
        Tallenna PDF
      </Button>
      <LinkButton to="/" variant="outline" className="h-[52px] w-full px-5 text-[16px]">
        Takaisin etusivulle
      </LinkButton>
    </>
  );

  return (
    <div className="report flex min-h-screen flex-col bg-paper text-ink">
      <AppBar
        logoLink
        right={
          <span className="font-ui text-[14px] font-semibold leading-5 tabular-nums text-ink-2">
            Raportti · {dateStr}
          </span>
        }
      />

      {/* Print-only masthead (the app bar is hidden in print). */}
      <div className="report-print-head hidden">
        <span className="report-print-wordmark">LukiSeula</span>
        <span>Raportti · {dateStr}</span>
      </div>

      <main className="flex-1">
        <div className="mx-auto flex w-full flex-col px-gutter pb-16 pt-8 md:max-w-[1224px] md:flex-row md:items-start md:gap-16 md:px-8 md:pb-24 md:pt-14">

          {/* Sticky rail (desktop) */}
          <Sheet
            as="aside"
            className="report-rail sticky top-6 hidden w-[296px] flex-shrink-0 flex-col gap-6 p-7 md:flex"
          >
            <div className="flex flex-col gap-1.5">
              <Label>Raportti</Label>
              <p className="m-0 font-ui text-[26px] font-extrabold leading-8 tracking-[-0.02em] tabular-nums text-ink">
                {dateStr}
              </p>
            </div>
            <MetaList items={meta} className="flex flex-col gap-4 border-y border-line py-6" />
            <div className="report-actions flex flex-col gap-2.5">{actions}</div>
          </Sheet>

          {/* Report column */}
          <div className="report-body flex min-w-0 flex-1 flex-col md:max-w-[800px]">
            <header className="flex flex-col gap-3 md:gap-3.5">
              <Label>
                Seulonnan tulokset
                <span className="md:hidden"> · {dateStr}</span>
              </Label>
              <h1 className="m-0 font-ui text-title-xs text-ink md:text-title-lg">Lukutaidon koonti.</h1>
            </header>

            {/* Meta (phone) */}
            <MetaList items={meta} className="report-meta mt-6 grid grid-cols-3 gap-3 md:hidden" />

            {/* Summary */}
            <Sheet as="section" className="report-summary mt-8 flex flex-col p-6 md:mt-10 md:p-10">
              <Label className="mb-4">Yhteenveto</Label>
              <p className="m-0 mb-4 font-ui text-[24px] font-bold leading-[32px] tracking-[-0.02em] text-ink md:text-[28px] md:leading-[38px]">
                {summary}
              </p>
              {interpretation && (
                <p className="m-0 max-w-measure text-[17px] leading-[28px] text-ink md:text-[18px] md:leading-[30px]">
                  {interpretation}
                </p>
              )}

              {(strengths.length > 0 || challenges.length > 0) && (
                <>
                  <div aria-hidden="true" className="my-6 h-px bg-line md:my-8" />
                  <div className="report-split flex flex-col gap-6 md:flex-row md:gap-8">
                    <div className="flex min-w-0 flex-col gap-2.5 md:w-[200px] md:flex-shrink-0">
                      <h3 className="m-0 font-ui text-caption font-extrabold text-level-good">Missä sujui hyvin</h3>
                      {strengths.length === 0 ? (
                        <p className="m-0 text-caption text-ink-2">
                          Ei sujuneita osa-alueita tällä kertaa — se ei tarkoita mitään yksittäisenä tuloksena.
                        </p>
                      ) : (
                        <ul className="m-0 flex list-none flex-col p-0">
                          {strengths.map(a => (
                            <li key={a.key} className="flex min-h-[44px] items-center gap-3">
                              <CircleCheck
                                className="h-5 w-5 flex-shrink-0 text-level-good"
                                strokeWidth={2.2}
                                aria-hidden="true"
                              />
                              <span className="font-ui text-[17px] font-bold leading-6 text-ink">{a.label}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div aria-hidden="true" className="hidden w-px bg-line md:block" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2.5">
                      <h3 className="m-0 font-ui text-caption font-extrabold text-level-clear">Missä oli haasteita</h3>
                      {challenges.length === 0 ? (
                        <p className="m-0 text-caption text-ink-2">Ei selviä haasteita tällä kertaa.</p>
                      ) : (
                        <ul className="m-0 flex list-none flex-col p-0">
                          {challenges.map(a => (
                            <li
                              key={a.key}
                              className="flex min-h-[30px] flex-wrap items-center justify-between gap-x-3 gap-y-1.5 py-[9px]"
                            >
                              <span className="font-ui text-[16px] font-bold leading-6 text-ink">{a.label}</span>
                              <LevelChip level={a.level} dense />
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </>
              )}
            </Sheet>

            {/* NMI support-need flag */}
            {supportNeedFlag && (
              <section className="report-support mt-6 flex gap-4 rounded-[22px] border-2 border-brown bg-surface p-5 md:flex-row md:gap-6 md:rounded-sheet-lg md:p-8">
                <IconTile icon={<Signpost strokeWidth={2} />} size={44} dark />
                <div className="flex min-w-0 flex-1 flex-col gap-3.5">
                  <h3 className="m-0 font-ui text-[16px] font-extrabold leading-5 text-brown">Tuen tarpeen selvittely</h3>
                  <p className="m-0 text-body text-ink">
                    <strong>Tuen tarpeen selvittely on vähintään suositeltavaa.</strong> Useammalla niistä osa-alueista,
                    joita käytetään tieteellisessä lukiseulassa (sanarajat, kirjoitusvirheet, luetun ymmärtäminen),
                    esiintyi selviä haasteita. Tämä kaava vastaa Niilo Mäki Instituutin nuorten ja aikuisten lukiseulan
                    (Holopainen ym. 2004) ohjaavaa raja-arvoa, jota myös Panulan (2013) väitöstutkimus käyttää.
                  </p>
                  <p className="m-0 text-caption leading-6 text-ink-2">
                    LukiSeulan katkaisupiste on heuristinen, ei kliinisesti normeerattu. Tuloksia ei tule tulkita
                    diagnoosina — ammattilaisen arvio tuo selkeyttä.
                  </p>
                </div>
              </section>
            )}

            {/* Detail rows */}
            <section className="mt-12 flex flex-col gap-5 md:mt-16">
              <SectionTitle aside={`${areas.length} kohtaa`}>Tarkemmat tulokset</SectionTitle>
              <Sheet as="ol" className="report-rows m-0 flex list-none flex-col p-0">
                {areas.map((area, i) => (
                  <DetailRow key={area.key} area={area} index={i} />
                ))}
              </Sheet>
            </section>

            {/* Disclaimer */}
            <NoteBlock className="report-note mt-8">
              <p className="m-0 max-w-read">
                <strong>Tämä seulonta ei diagnosoi lukihäiriötä.</strong> Tulokset ovat vain suuntaa antavia. Jos ne
                herättävät huolta, käänny erikoisopettajan, psykologin tai terveydenhuollon ammattilaisen puoleen.
                LukiSeula on yksityishenkilön tekoälyn avustuksella rakentama harrasteprojekti — ei kliininen eikä
                tieteellisesti validoitu arviointiväline.
              </p>
            </NoteBlock>

            {/* Next steps */}
            <section className="report-steps mt-12 flex flex-col gap-5 md:mt-16">
              <SectionTitle>Mitä voit tehdä seuraavaksi</SectionTitle>
              <ol className="m-0 flex list-none flex-col gap-5 p-0">
                {NEXT_STEPS.map((text, i) => (
                  <NumberedStep key={i} n={i + 1} tone="tint">
                    <p className="m-0 max-w-measure text-[18px] leading-[30px] text-ink">{text}</p>
                  </NumberedStep>
                ))}
              </ol>
            </section>

            {/* Resources */}
            <section className="report-links mt-12 flex flex-col gap-5 md:mt-16">
              <SectionTitle>Tukisivuja ja lisätietoa</SectionTitle>
              <Sheet as="ul" className="m-0 flex list-none flex-col overflow-hidden p-0">
                {RESOURCES.map(r => (
                  <li key={r.href} className="[&+&]:border-t [&+&]:border-line">
                    <ResourceLink href={r.href} title={r.label} description={r.desc} showUrl />
                  </li>
                ))}
              </Sheet>
            </section>

            {/* Method */}
            <section className="report-method mt-12 flex flex-col gap-5 md:mt-16">
              <SectionTitle>Menetelmä — mitä osa-alueet mittaavat</SectionTitle>
              <dl className="m-0 flex flex-col gap-5">
                {METHOD.map(m => (
                  <div key={m.title} className="flex max-w-measure flex-col gap-1.5">
                    <dt className="font-ui text-[17px] font-extrabold leading-6 text-ink">{m.title}</dt>
                    <dd className="m-0 text-body-sm text-ink-2">{m.text}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Actions (phone) */}
            <div className="report-actions mt-12 flex flex-col gap-2.5 md:hidden">{actions}</div>
          </div>
        </div>
      </main>

      <footer className="report-credit border-t border-line">
        <div className="mx-auto flex w-full flex-col gap-2 px-gutter py-7 text-caption leading-6 text-ink-2 md:max-w-[1224px] md:flex-row md:justify-between md:px-8">
          <span>LukiSeula · Harrasteprojekti</span>
          <span>Perustuu suomalaiseen lukivaikeustutkimukseen — Panula, 2013, Helsingin yliopisto.</span>
        </div>
      </footer>
      <div className="report-print-foot hidden">Suuntaa antava seulonta — ei diagnoosi.</div>
      <SiteFooter />
    </div>
  );
}
