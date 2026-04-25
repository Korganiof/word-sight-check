import { useNavigate } from "react-router-dom";
import {
  Clock,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  GraduationCap,
  ShieldCheck,
  SpellCheck,
  Gauge,
  AlignLeft,
  PenLine,
  Brain,
  ArrowRight,
  BarChart3,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans text-[#28180b]">
      {/* ─── Floating glass nav ─── */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl rounded-2xl bg-white/75 backdrop-blur-xl flex justify-between items-center px-6 py-3.5 z-50 shadow-[0_8px_24px_-4px_rgba(120,90,0,0.08)]">
        <div className="text-xl font-bold tracking-tight text-[#28180b]">LukiSeula</div>
        <div className="hidden md:flex items-center gap-7 text-sm font-medium">
          <a className="text-[#785a00] border-b-2 border-[#c69a2b] pb-0.5 transition-colors" href="#">
            Etusivu
          </a>
          <a className="text-[#4e4636] hover:text-[#28180b] transition-colors" href="#mita-mittaa">
            Mitä mittaa
          </a>
        </div>
        <button
          onClick={() => navigate("/consent")}
          className="bg-[#c69a2b] hover:bg-[#b8902a] text-white px-5 py-2 rounded-xl font-bold text-sm transition-all active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(120,90,0,0.15),0_8px_24px_-8px_rgba(120,90,0,0.35)]"
        >
          Aloita seulonta
        </button>
      </nav>

      <main className="pt-28 pb-20">
        {/* ─── Hero card ─── */}
        <section className="max-w-6xl mx-auto px-6 mb-12">
          <div className="relative overflow-hidden bg-[#fff1e9] rounded-[2rem] p-8 md:p-16 flex flex-col items-center text-center gap-7">
            {/* background ornaments */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[#c69a2b]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-[#f8dac5]/30 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 max-w-3xl flex flex-col items-center gap-7">
              <span className="inline-block px-4 py-1.5 bg-[#785a00]/10 text-[#785a00] rounded-full text-xs font-bold tracking-[0.16em] uppercase">
                Seulontatyökalu · Harrasteprojekti
              </span>

              <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-[#28180b] leading-[1.02] text-balance">
                Lukihäiriön seulonta
              </h1>

              <p className="text-lg md:text-xl text-[#4e4636] max-w-2xl leading-relaxed text-balance">
                Lyhyt seulonta, joka antaa viitteitä siitä, liittyykö lukemiseesi haasteita.
                Kartoitat omat vahvuutesi ja kehityskohteesi viidellä lyhyellä tehtävällä.
              </p>

              {/* Disclaimer — kept above the fold */}
              <div className="bg-[#ffe3cf]/70 rounded-xl px-5 py-4 max-w-xl flex items-start gap-3 text-left">
                <AlertTriangle className="w-5 h-5 text-[#785a00] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#4e4636] leading-relaxed">
                  <strong className="text-[#28180b]">Tämä seulonta ei diagnosoi lukihäiriötä.</strong>{" "}
                  Tulokset ovat vain suuntaa antavia. Jos ne viittaavat haasteisiin, käänny
                  erikoisopettajan, psykologin tai terveydenhuollon ammattilaisen puoleen.
                </p>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap justify-center gap-3">
                <button
                  onClick={() => navigate("/consent")}
                  className="bg-[#c69a2b] hover:bg-[#b8902a] text-white px-7 py-3.5 rounded-xl text-base font-bold flex items-center gap-2 transition-all active:scale-95 shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_1px_2px_rgba(120,90,0,0.15),0_8px_24px_-8px_rgba(120,90,0,0.35)]"
                >
                  Aloita seulonta
                  <ArrowRight className="w-5 h-5" />
                </button>
                <a
                  href="#mita-on-lukihairio"
                  className="bg-[#fbddc7]/60 hover:bg-[#fbddc7] text-[#28180b] px-7 py-3.5 rounded-xl text-base font-semibold transition-colors"
                >
                  Lue lisää
                </a>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-[#4e4636] pt-2">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-[18px] h-[18px]" />
                  10–15 min
                </span>
                <span className="flex items-center gap-1.5">
                  <GraduationCap className="w-[18px] h-[18px]" />
                  Yli 15-vuotiaille
                </span>
                <span className="flex items-center gap-1.5">
                  <EyeOff className="w-[18px] h-[18px]" />
                  Anonyymi
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle className="w-[18px] h-[18px]" />
                  Ilmainen
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Mitä on lukihäiriö? ─── */}
        <section id="mita-on-lukihairio" className="max-w-6xl mx-auto px-6 mb-24">
          <div className="bg-[#ffeadc] px-8 py-12 md:p-16 rounded-[2rem] max-w-4xl mx-auto text-left">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#28180b] mb-6 flex items-center gap-3">
              <ShieldCheck className="w-9 h-9 text-[#785a00]" />
              Mitä on lukihäiriö?
            </h2>
            <div className="text-base md:text-lg text-[#4e4636] leading-relaxed space-y-4">
              <p>
                <strong className="text-[#28180b]">
                  Lukivaikeus (lukihäiriö eli dysleksia) on yleisin oppimisvaikeus
                </strong>{" "}
                — arviolta 5–10 % suomalaisista kokee sen vaikutuksia. Se on neurobiologinen ja usein
                perinnöllinen ominaisuus, joka vaikuttaa keskeisesti lukemisen ja kirjoittamisen
                sujuvuuteen sekä tarkkuuteen.
              </p>
              <p>
                Vaikka haasteet voivat näkyä hitaana lukemisena, toistuvina kirjoitusvirheinä tai
                luetun ymmärtämisen vaikeuksina, on tärkeä muistaa, ettei lukivaikeus ole
                yhteydessä henkilön älykkyyteen. Oikeanlaisilla keinoilla, ymmärryksellä ja tuella
                jokainen voi löytää omat vahvuutensa ja menestyä oppijana.
              </p>
            </div>
          </div>
        </section>

        {/* ─── Mitä seulonta mittaa? (Bento) ─── */}
        <section id="mita-mittaa" className="max-w-6xl mx-auto px-6 mb-24">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-[#28180b] mb-2">
              Mitä seulonta mittaa?
            </h2>
            <div className="h-1 w-20 bg-[#c69a2b] rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            {/* Sanantunnistus (wide) */}
            <BentoCard
              cols={3}
              size="lg"
              icon={<SpellCheck className="w-5 h-5" />}
              title="Sanantunnistus"
              desc="Erottelet todellisia suomen kielen sanoja keksityistä pseudosanoista pelkän kirjoitusasun perusteella. Tehtävä mittaa, kuinka automaattisesti tunnistat sanamuotoja — keskeinen dekoodaustaidon mittari lukivaikeustutkimuksessa."
            />
            {/* Lukunopeus (wide) */}
            <BentoCard
              cols={3}
              size="lg"
              icon={<Gauge className="w-5 h-5" />}
              title="Lukunopeus ja hahmottaminen"
              desc="Etsit annettuja sanoja pidemmästä tekstistä aikarajan puitteissa. Tehtävä mittaa lukunopeutta ja visuaalista tarkkaavaisuutta — suomen säännöllisessä ortografiassa juuri nopeus erottaa sujuvan ja työlään lukijan toisistaan."
            />
            {/* Sanarajat */}
            <BentoCard
              cols={2}
              icon={<AlignLeft className="w-5 h-5" />}
              title="Sanarajojen hahmottaminen"
              desc="Lauseessa kaikki sanat on kirjoitettu yhteen ilman välejä — tunnistat, mistä yksi sana loppuu ja toinen alkaa. Mittaa sanahahmojen automaattista tunnistusta lukemisen aikana."
            />
            {/* Kirjoitusvirheet */}
            <BentoCard
              cols={2}
              icon={<PenLine className="w-5 h-5" />}
              title="Kirjoitusvirheiden tunnistus"
              desc="Käyt läpi sanalistan ja merkitset sanat, joissa on kirjoitusvirhe. Mittaa oikeinkirjoitus­tarkkuutta ja kirjoitettujen sanahahmojen hallintaa."
            />
            {/* Luetun ymmärtäminen */}
            <BentoCard
              cols={2}
              icon={<Brain className="w-5 h-5" />}
              title="Luetun ymmärtäminen"
              desc="Luet lyhyen tekstin ja vastaat sen sisältöä koskeviin kysymyksiin. Mittaa kykyä jäsentää ja tulkita lukemaa — oma ulottuvuutensa lukunopeuden ja oikeinkirjoituksen rinnalla."
            />
          </div>
        </section>

        {/* ─── Saat välittömän yhteenvedon (banner) ─── */}
        <section className="max-w-6xl mx-auto px-6 mb-24">
          <div className="bg-[#705a49] text-white rounded-[2rem] p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
            <div className="relative z-10 flex-1">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 className="w-6 h-6 text-[#ffdf9d]" />
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                  Saat välittömän yhteenvedon
                </h2>
              </div>
              <p className="text-white/85 text-base md:text-lg max-w-xl leading-relaxed">
                Seulonnan lopuksi saat kattavan raportin tuloksistasi ja suositukset
                jatkotoimenpiteistä. Tiedät tarkalleen, miten edetä.
              </p>
            </div>
            <div className="relative z-10">
              <button
                onClick={() => navigate("/consent")}
                className="bg-white text-[#705a49] hover:bg-[#ffdf9d] transition-all px-8 py-4 rounded-xl font-black text-base tracking-wide shadow-xl active:scale-95"
              >
                ALOITA NYT
              </button>
            </div>
            {/* decorative circles */}
            <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/5 rounded-full pointer-events-none" />
            <div className="absolute -right-40 -top-20 w-72 h-72 bg-[#ffdf9d]/5 rounded-full pointer-events-none" />
          </div>
        </section>

        {/* ─── Citation + secondary disclaimer ─── */}
        <section className="max-w-3xl mx-auto px-6">
          <div className="text-center space-y-3">
            <p className="text-sm text-[#4e4636] leading-relaxed">
              Perustuu suomalaiseen lukivaikeustutkimukseen —{" "}
              <a
                href="https://helda.helsinki.fi/items/1a192f9a-1368-4b3d-a826-7f07c37181d1"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#785a00] hover:text-[#28180b] transition-colors underline decoration-[#d2c5b0] hover:decoration-[#c69a2b] decoration-1 underline-offset-[3px]"
              >
                Panula, 2013, Helsingin yliopisto
              </a>
              .
            </p>
            <p className="text-xs text-[#4e4636]/70 max-w-xl mx-auto leading-relaxed">
              LukiSeula on yksityishenkilön harrasteprojekti, rakennettu tekoälyn avustuksella. Ei
              kliininen eikä ammatillinen työkalu — tulokset ovat vain suuntaa antavia.
            </p>
          </div>
        </section>
      </main>

      {/* ─── Footer ─── */}
      <footer className="bg-[#fff1e9] w-full py-12 px-6 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <div className="text-base font-bold tracking-tight text-[#28180b]">LukiSeula</div>
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-2 text-[#4e4636] text-xs uppercase tracking-[0.14em] font-medium">
            <a className="hover:text-[#785a00] transition-colors" href="#">
              Tietosuoja
            </a>
          </div>
          <div className="text-[#4e4636]/80 text-xs">© 2026 LukiSeula · Harrasteprojekti</div>
        </div>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────
   BentoCard — local helper for the measurement grid
   ───────────────────────────────────────────── */
function BentoCard({
  cols,
  size = "md",
  icon,
  title,
  desc,
}: {
  cols: 2 | 3;
  size?: "md" | "lg";
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  const colSpan = cols === 3 ? "md:col-span-3" : "md:col-span-2";
  const padding = size === "lg" ? "p-8" : "p-7";
  const iconBox = size === "lg" ? "w-12 h-12 mb-6" : "w-11 h-11 mb-5";
  const titleSize = size === "lg" ? "text-xl" : "text-lg";
  const descSize = size === "lg" ? "text-base" : "text-sm";

  return (
    <div
      className={`${colSpan} ${padding} group bg-white rounded-3xl hover:bg-[#ffe3cf] transition-all duration-300 shadow-[0_4px_16px_-4px_rgba(120,90,0,0.06)]`}
    >
      <div
        className={`${iconBox} bg-[#785a00]/5 rounded-2xl flex items-center justify-center text-[#785a00] group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <h3 className={`${titleSize} font-bold mb-2 tracking-tight text-[#28180b]`}>{title}</h3>
      <p className={`${descSize} text-[#4e4636] leading-relaxed`}>{desc}</p>
    </div>
  );
}
