import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Clock,
  EyeOff,
  Gift,
  Info,
  Lock,
  SeparatorVertical,
  SpellCheck,
  TextSearch,
  Timer,
  UserCheck,
  WholeWord,
} from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";
import { Badge } from "@/components/shell";
import { IconTile, Label, ResourceLink, Sheet, SiteFooter } from "@/components/primitives";
import { LevelBar, LevelChip } from "@/components/LevelChip";
import { cn } from "@/lib/utils";

const CONTAINER = "mx-auto w-full max-w-home px-gutter md:px-8";

const PARTS = [
  {
    icon: <WholeWord />,
    title: "Sanantunnistus",
    desc: "Erottelet todellisia suomen kielen sanoja keksityistä pseudosanoista pelkän kirjoitusasun perusteella. Tehtävä mittaa, kuinka automaattisesti tunnistat sanamuotoja — keskeinen dekoodaustaidon mittari lukivaikeustutkimuksessa.",
  },
  {
    icon: <TextSearch />,
    title: "Lukunopeus ja hahmottaminen",
    desc: "Etsit annettuja sanoja pidemmästä tekstistä aikarajan puitteissa. Tehtävä mittaa lukunopeutta ja visuaalista tarkkaavaisuutta — suomen säännöllisessä ortografiassa juuri nopeus erottaa sujuvan ja työlään lukijan toisistaan.",
  },
  {
    icon: <SeparatorVertical />,
    title: "Sanarajojen hahmottaminen",
    desc: "Lauseessa kaikki sanat on kirjoitettu yhteen ilman välejä — tunnistat, mistä yksi sana loppuu ja toinen alkaa. Mittaa sanahahmojen automaattista tunnistusta lukemisen aikana.",
  },
  {
    icon: <SpellCheck />,
    title: "Kirjoitusvirheiden tunnistus",
    desc: "Käyt läpi sanalistan ja merkitset sanat, joissa on kirjoitusvirhe. Mittaa oikeinkirjoitus­tarkkuutta ja kirjoitettujen sanahahmojen hallintaa.",
  },
  {
    icon: <BookOpen />,
    title: "Luetun ymmärtäminen",
    desc: "Luet lyhyen tarinan, johon on vaihdettu sanoja, jotka eivät sovi lauseen merkitykseen — ja merkitset ne. Mittaa luetun ymmärtämistä: huomaatko, kun teksti ei täsmää. Sama tehtävätyyppi kuin NMI:n nuorten ja aikuisten lukiseulassa.",
  },
];

const FACTS = [
  { icon: <Clock />, label: "10–15 min" },
  { icon: <UserCheck />, label: "Yli 15-vuotiaille" },
  { icon: <EyeOff />, label: "Anonyymi" },
  { icon: <Gift />, label: "Ilmainen" },
];

const RESOURCES = [
  { href: "https://www.lukimat.fi", label: "Lukimat.fi", desc: "harjoituksia ja tietoa lukivaikeudesta" },
  {
    href: "https://www.eoliitto.fi/oppimisvaikeudet/",
    label: "Erilaisten oppijain liitto",
    desc: "neuvontaa ja vertaistukea oppimisvaikeuksiin",
  },
  { href: "https://www.nmi.fi", label: "Niilo Mäki Instituutti", desc: "tutkimustietoa oppimisvaikeuksista" },
  {
    href: "https://www.kuntoutussaatio.fi/toiminta/oppimisen-tuki/",
    label: "Kuntoutussäätiö — oppimisen tuki",
    desc: "tietoa ja tukea oppimisen vaikeuksiin",
  },
];

export default function Home() {
  const navigate = useNavigate();
  const start = () => navigate("/consent");

  return (
    <div className="min-h-screen bg-paper text-ink">
      {/* ─── Nav ─── */}
      <nav id="top" aria-label="Päävalikko" className={cn(CONTAINER, "grid h-16 grid-cols-[1fr_auto] items-center md:h-[76px] md:grid-cols-[1fr_auto_1fr]")}>
        <Logo />
        <div className="hidden items-center gap-9 md:flex">
          <a
            href="#top"
            aria-current="page"
            className="rounded-mark px-0.5 py-2 font-ui text-[15px] font-bold leading-5 text-ink no-underline shadow-[inset_0_-2px_0_#C69A2B] hover:text-ink"
          >
            Etusivu
          </a>
          <a href="#mita-mittaa" className="ls-t rounded-mark px-0.5 py-2 font-ui text-[15px] font-bold leading-5 text-ink-2 no-underline hover:text-ink">
            Mitä seulonta mittaa?
          </a>
          <a href="#lisatietoa" className="ls-t rounded-mark px-0.5 py-2 font-ui text-[15px] font-bold leading-5 text-ink-2 no-underline hover:text-ink">
            Lisätietoa ja tukea
          </a>
        </div>
        <div className="flex justify-end">
          <Button size="sm" onClick={start}>
            Aloita seulonta
          </Button>
        </div>
      </nav>

      <main>
        {/* ─── Hero ─── */}
        <section className={cn(CONTAINER, "flex flex-col gap-10 pb-10 pt-4 md:flex-row md:items-center md:justify-between md:gap-[60px] md:pb-14 md:pt-10")}>
          <div className="flex flex-col items-start md:w-[560px] md:flex-shrink-0">
            <Badge className="mb-5 md:mb-6">Seulontatyökalu · Yli 15-vuotiaille</Badge>
            <h1 className="m-0 flex flex-col items-start font-ui text-display-sm text-ink md:text-display">
              <span>Lukihäiriön</span>
              <span className="-ml-2.5 mt-1 rounded-[10px] bg-gold-wash px-2.5 pb-0.5 shadow-mark-lg md:-ml-[17px] md:mt-[5px] md:rounded-[17px] md:px-[17px] md:pb-1">
                seulonta
              </span>
            </h1>
            <p className="mb-7 mt-6 max-w-[520px] text-lead-sm text-ink md:mb-8 md:mt-7 md:text-lead">
              Lyhyt seulonta yli 15-vuotiaille nuorille ja aikuisille. Se antaa viitteitä siitä,
              liittyykö lukemiseesi haasteita — kartoitat omat vahvuutesi ja kehityskohteesi
              viidellä lyhyellä tehtävällä.
            </p>
            <div className="mb-5 flex w-full flex-col items-stretch gap-3 md:mb-6 md:w-auto md:flex-row md:items-center">
              <Button size="hero" onClick={start} className="w-full md:w-auto">
                Aloita seulonta
                <ArrowRight aria-hidden="true" />
              </Button>
              <a
                href="#mita-on-lukihairio"
                className="ls-t order-last inline-flex h-[60px] items-center justify-center rounded-tile px-6 font-ui text-[18px] font-bold leading-none tracking-[-0.005em] text-gold-ink no-underline hover:bg-gold-tint hover:text-gold-ink-deep active:bg-gold-wash md:order-none"
              >
                Lue lisää
              </a>
            </div>
            {/* Disclaimer — kept above the fold */}
            <p className="m-0 flex max-w-[560px] items-start gap-2.5 text-[15px] leading-6 text-ink">
              <Info className="mt-[3px] h-[18px] w-[18px] flex-shrink-0 text-gold-ink" strokeWidth={2.2} aria-hidden="true" />
              <span>
                <strong className="font-bold">Tämä seulonta ei diagnosoi lukihäiriötä.</strong> Tulokset ovat vain
                suuntaa antavia.
              </span>
            </p>
          </div>

          <HeroPreviews />
        </section>

        {/* ─── Facts strip ─── */}
        <section aria-label="Seulonta lyhyesti" className={CONTAINER}>
          <ul className="m-0 grid list-none grid-cols-2 gap-2 p-0 md:grid-cols-4 md:gap-0 md:overflow-hidden md:rounded-sheet md:border md:border-line md:bg-surface md:shadow-sheet">
            {FACTS.map((f, i) => (
              <li
                key={f.label}
                className={cn(
                  "flex min-h-[44px] items-center gap-2.5 rounded-key border border-line bg-surface px-3 py-2 md:gap-4 md:rounded-none md:border-0 md:px-7 md:py-6",
                  i > 0 && "md:border-l md:border-line",
                )}
              >
                <IconTile icon={f.icon} size={36} className="md:hidden" />
                <IconTile icon={f.icon} size={48} className="hidden md:inline-flex" />
                <span className="font-ui text-[15px] font-extrabold leading-5 tracking-[-0.015em] tabular-nums md:text-[20px] md:leading-[26px]">
                  {f.label}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── Mitä on lukihäiriö? ─── */}
        <section id="mita-on-lukihairio" className={cn(CONTAINER, "grid scroll-mt-6 gap-y-5 pt-[72px] md:grid-cols-[5fr_7fr] md:gap-x-[60px] md:pt-32")}>
          <h2 className="m-0 font-ui text-h1-sm text-ink md:text-h1">Mitä on lukihäiriö?</h2>
          <div className="flex max-w-[620px] flex-col gap-5">
            <p className="m-0 text-lead-sm md:text-lead">
              <strong className="font-bold">Lukivaikeus (lukihäiriö eli dysleksia) on yleisin oppimisvaikeus</strong>{" "}
              — arviolta 5–10 % suomalaisista kokee sen vaikutuksia. Se on neurobiologinen ja usein
              perinnöllinen ominaisuus, joka vaikuttaa keskeisesti lukemisen ja kirjoittamisen
              sujuvuuteen sekä tarkkuuteen.
            </p>
            <p className="m-0 text-lead-sm md:text-lead">
              Vaikka haasteet voivat näkyä hitaana lukemisena, toistuvina kirjoitusvirheinä tai
              luetun ymmärtämisen vaikeuksina, on tärkeä muistaa, ettei lukivaikeus ole
              yhteydessä henkilön älykkyyteen. Oikeanlaisilla keinoilla, ymmärryksellä ja tuella
              jokainen voi löytää omat vahvuutensa ja menestyä oppijana.
            </p>
          </div>
        </section>

        {/* ─── Mitä seulonta mittaa? ─── */}
        <section id="mita-mittaa" className={cn(CONTAINER, "flex scroll-mt-6 flex-col gap-6 pt-[72px] md:gap-10 md:pt-32")}>
          <h2 className="m-0 font-ui text-h1-sm text-ink md:text-h1">Mitä seulonta mittaa?</h2>
          <Sheet as="ol" className="m-0 flex list-none flex-col overflow-hidden p-0">
            {PARTS.map((p, i) => (
              <li
                key={p.title}
                className={cn(
                  "grid grid-cols-[44px_1fr] items-center gap-x-4 px-5 py-6 md:grid-cols-[64px_380px_minmax(0,1fr)] md:gap-x-7 md:px-9 md:py-7",
                  i > 0 && "border-t border-line",
                )}
              >
                <IconTile icon={p.icon} size={44} className="md:hidden" />
                <IconTile icon={p.icon} size={56} className="hidden md:inline-flex" />
                <div className="flex flex-col gap-0.5">
                  <span className="text-caption text-ink-2 tabular-nums">Osa {i + 1}</span>
                  <h3 className="m-0 font-ui text-h3-sm text-ink md:text-h3">{p.title}</h3>
                </div>
                <p className="col-span-2 m-0 mt-3 max-w-[560px] text-body-sm md:col-span-1 md:mt-0 md:text-body">
                  {p.desc}
                </p>
              </li>
            ))}
          </Sheet>
        </section>

        {/* ─── Banner ─── */}
        <section className={cn(CONTAINER, "pt-[72px] md:pt-32")}>
          <div className="on-dark flex flex-col gap-8 rounded-hero bg-brown px-[22px] py-8 text-white md:flex-row md:items-center md:justify-between md:gap-[60px] md:p-[72px]">
            <div className="flex max-w-[540px] flex-col items-start">
              <h2 className="m-0 font-ui text-[32px] font-extrabold leading-[38px] tracking-[-0.03em] text-white md:text-[44px] md:leading-[50px]">
                Saat välittömän yhteenvedon
              </h2>
              <p className="mb-7 mt-4 max-w-[520px] text-[17px] leading-7 text-[#F3E9DC] md:mb-8 md:mt-5 md:text-[18px] md:leading-[30px]">
                Seulonnan lopuksi saat yhteenvedon tuloksistasi osa-alueittain sekä vinkkejä
                siitä, mistä hakea lisätietoa tai tukea.
              </p>
              <Button onClick={start}>
                Aloita nyt
                <ArrowRight aria-hidden="true" />
              </Button>
            </div>
            <div
              role="img"
              aria-label="Esimerkki yhteenvedosta"
              className="w-full flex-shrink-0 rounded-sheet bg-surface px-[22px] pb-3 pt-5 text-ink md:w-[400px] md:px-[26px] md:pt-6"
            >
              <Label className="mb-1.5">Yhteenveto</Label>
              <ul aria-hidden="true" className="m-0 list-none p-0">
                {(
                  [
                    ["Sanantunnistus", "sujuu"],
                    ["Lukunopeus ja hahmottaminen", "sujuu"],
                    ["Sanarajojen hahmottaminen", "jonkin"],
                  ] as const
                ).map(([title, level], i) => (
                  <li key={title} className={cn("flex flex-col gap-2 py-3.5", i > 0 && "border-t border-line")}>
                    <span className="font-ui text-[16px] font-extrabold leading-[22px] text-ink">{title}</span>
                    <span className="flex items-center justify-between gap-3">
                      <LevelChip level={level} dense />
                      <LevelBar level={level} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* ─── Tietosuoja + Lisätietoa ─── */}
        <section className={cn(CONTAINER, "grid items-start gap-y-12 pt-[72px] md:grid-cols-[5fr_7fr] md:gap-x-[60px] md:pt-32")}>
          <div id="tietosuoja" className="flex scroll-mt-6 flex-col items-start">
            <div className="mb-5 flex items-center gap-3.5 md:mb-6">
              <IconTile icon={<Lock />} size={40} />
              <h2 className="m-0 font-ui text-h2-sm text-ink md:text-h2">Tietosuoja</h2>
            </div>
            {/* Keep this in sync with what the app actually does — it must be
                revisited if analytics (e.g. PostHog) are ever added. */}
            <p className="m-0 max-w-[440px] text-body">
              LukiSeula ei kerää henkilötietoja, ei käytä evästeitä eikä lähetä tuloksia
              minnekään. Sivusto ei lataa mitään kolmansien osapuolten palveluista. Vastauksesi
              ja tuloksesi säilyvät vain selaimesi istuntomuistissa ja katoavat, kun suljet
              välilehden. Jos haluat tuloksen talteen, tallenna raportti PDF-tiedostoksi
              tulossivulta.
            </p>
          </div>
          <div id="lisatietoa" className="flex scroll-mt-6 flex-col gap-5 md:gap-6">
            <h2 className="m-0 font-ui text-h2-sm text-ink md:text-h2">Lisätietoa ja tukea</h2>
            <Sheet as="ul" className="m-0 flex list-none flex-col divide-y divide-line overflow-hidden p-0">
              {RESOURCES.map(r => (
                <li key={r.href}>
                  <ResourceLink href={r.href} title={r.label} description={r.desc} />
                </li>
              ))}
            </Sheet>
          </div>
        </section>

        {/* ─── Credit + secondary disclaimer ─── */}
        <section className={cn(CONTAINER, "pt-[72px] md:pt-24")}>
          <div className="flex flex-col justify-between gap-6 rounded-sheet-lg bg-well px-6 py-7 md:flex-row md:gap-[60px] md:px-14 md:py-11">
            <div className="flex max-w-[600px] flex-col gap-3">
              <p className="m-0 flex items-center gap-2.5 font-ui text-label uppercase text-brown">
                <Info className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
                Huomio
              </p>
              <p className="m-0 text-body">
                <strong className="font-bold">Tämä seulonta ei diagnosoi lukihäiriötä.</strong> Tulokset ovat vain
                suuntaa antavia. Jos ne viittaavat haasteisiin, käänny erikoisopettajan, psykologin
                tai terveydenhuollon ammattilaisen puoleen.
              </p>
            </div>
            <div className="flex max-w-[400px] flex-col gap-3 text-body-sm text-ink-2">
              <p className="m-0">
                Perustuu suomalaiseen lukivaikeustutkimukseen —{" "}
                <a
                  href="https://helda.helsinki.fi/items/1a192f9a-1368-4b3d-a826-7f07c37181d1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-ink underline decoration-1 underline-offset-[3px] hover:text-gold-ink-deep"
                >
                  Panula, 2013, Helsingin yliopisto
                </a>
                .
              </p>
              <p className="m-0">
                LukiSeula on yksityishenkilön harrasteprojekti, rakennettu tekoälyn avustuksella. Ei
                kliininen eikä ammatillinen työkalu — tulokset ovat vain suuntaa antavia.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter className="mt-[72px] md:mt-24" />
    </div>
  );
}

/* ─────────────────────────────────────────────
   Hero previews — two overlapping product windows (Osa 3 and Osa 5), built
   from the same visual language as the real exercises but static, with
   non-test sentences. Sized for the hero (24 px tape cells), so they do not
   reuse the full-size LetterTape component.
   ───────────────────────────────────────────── */

const PREVIEW_TAPE = "Kissanukkuusohvalla";
const PREVIEW_MARKED = new Set([5]); // after "Kissa"
const PREVIEW_HOVER = 11; // boundary preview after "nukkuu"

function MiniRail({ part, cellClass }: { part: number; cellClass: string }) {
  return (
    <span className="flex items-center gap-3">
      <span className="font-ui text-[11px] font-extrabold uppercase leading-none tracking-[0.1em] text-gold-ink tabular-nums">
        Osa {part} / 5
      </span>
      <span aria-hidden="true" className="flex gap-1">
        {[1, 2, 3, 4, 5].map(n => (
          <span
            key={n}
            className={cn("h-[5px] rounded-sm", cellClass, n < part ? "bg-brown" : n === part ? "bg-gold" : "bg-line")}
          />
        ))}
      </span>
    </span>
  );
}

function HeroPreviews() {
  const chars = Array.from(PREVIEW_TAPE);
  return (
    <div
      role="img"
      aria-label="Esimerkkinäkymä seulonnan tehtävistä: sanaketjun erottaminen ja väärän sanan merkitseminen tekstistä"
      className="pointer-events-none relative w-full select-none md:grid md:h-[356px] md:w-[580px] md:flex-shrink-0"
    >
      {/* Osa 3 window */}
      <div aria-hidden="true" className="md:col-start-1 md:row-start-1 md:justify-self-start md:self-start">
        <div className="w-full overflow-hidden rounded-sheet border border-line bg-surface shadow-float md:w-[520px]">
          <div className="flex h-[52px] items-center justify-between border-b border-line px-5">
            <MiniRail part={3} cellClass="w-5" />
            <span className="inline-flex h-7 items-center gap-1.5 rounded-pill bg-recessed pl-2 pr-2.5 text-ink">
              <Timer className="h-3.5 w-3.5" strokeWidth={2.4} />
              <span className="font-ui text-[13px] font-extrabold leading-none tabular-nums tracking-[0.01em]">1:23</span>
            </span>
          </div>
          <div className="flex h-[3px] gap-1">
            <span className="h-[3px] flex-1 bg-time" />
            <span className="h-[3px] flex-1 bg-time" />
            <span className="h-[3px] flex-1 bg-time" />
          </div>
          <div className="flex flex-col gap-4 p-5 md:p-6">
            <span className="font-ui text-[16px] font-extrabold leading-[22px] tracking-[-0.01em]">Sanaketjujen erottaminen</span>
            <div className="flex justify-center md:justify-start">
              {chars.map((ch, i) => {
                const pos = i + 1;
                const marked = PREVIEW_MARKED.has(pos);
                const hover = pos === PREVIEW_HOVER;
                return (
                  <span
                    key={i}
                    className={cn(
                      "relative box-border h-11 w-4 text-center font-mono text-[20px] font-semibold leading-[44px] text-ink md:h-[60px] md:w-6 md:text-[30px] md:leading-[60px]",
                      i === 0 && "rounded-l-key",
                      i === chars.length - 1 && "rounded-r-key",
                      marked ? "z-[2] bg-gold-wash" : hover ? "z-[2] bg-well" : "z-[1] bg-recessed",
                    )}
                  >
                    {ch}
                    {(marked || hover) && (
                      <span
                        className={cn(
                          "absolute -right-0.5 bottom-1.5 top-1.5 w-1 rounded-sm bg-gold-ink md:bottom-2 md:top-2",
                          hover && !marked && "opacity-35",
                        )}
                      />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex h-12 items-center justify-between border-t border-line px-5 md:px-6">
            <span className="text-[14px] leading-5 text-ink-2 tabular-nums">
              <strong className="font-ui font-extrabold text-ink">1 / 2</strong> sanarajaa merkitty
            </span>
            <span className="flex items-center gap-1.5 font-ui text-[14px] font-extrabold leading-none text-gold-ink">
              Seuraava
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.4} />
            </span>
          </div>
        </div>
      </div>

      {/* Osa 5 snippet */}
      <div aria-hidden="true" className="relative z-[2] -mt-5 ml-auto w-[88%] md:col-start-1 md:row-start-1 md:mt-0 md:w-auto md:justify-self-end md:self-end">
        <div className="flex w-full flex-col gap-2.5 rounded-sheet-sm border border-line bg-surface px-[22px] pb-[22px] pt-5 shadow-float md:w-[340px]">
          <MiniRail part={5} cellClass="w-4" />
          <p className="m-0 text-[17px] leading-8 text-ink">
            Aamulla Liisa söi aamiaiseksi lautasellisen{" "}
            <span className="ls-mark -mx-0.5 rounded-mark px-[5px] py-0.5">kenkiä</span>.
          </p>
        </div>
      </div>
    </div>
  );
}
