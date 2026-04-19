import { useNavigate } from "react-router-dom";
import { Clock, EyeOff, CheckCircle, AlertTriangle, Type, Layers, Zap, Ruler, Link2, GraduationCap } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans">

      {/* Nav */}
      <nav className="px-6 py-4 flex items-center justify-between bg-[#fff8f5]">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
        <a href="#ukk" className="text-sm text-[#755e4d] hover:text-[#241a11] transition-colors">UKK</a>
      </nav>

      {/* Hero */}
      <section className="px-6 py-16 md:py-24 max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-[#785a00] bg-[#f9e4d6] px-3 py-1 rounded-md mb-6">
            Seulontatyökalu · Harrasteprojekti
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#241a11] leading-tight tracking-tight mb-4">
            Lukihäiriön seulonta
          </h1>
          <p className="text-lg text-[#755e4d] mb-6 leading-relaxed">
            Lyhyt seulonta, joka antaa viitteitä siitä, liittyykö lukemiseesi haasteita.
          </p>

          {/* Primary disclaimer — visible above the fold */}
          <div className="mb-8 p-4 rounded-lg bg-[#f9e4d6] border-l-4 border-[#C69A2B]">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#785a00] flex-shrink-0 mt-0.5" />
              <div className="text-sm text-[#4A3728] leading-relaxed">
                <strong className="text-[#241a11]">Tämä seulonta ei diagnosoi lukihäiriötä.</strong>{" "}
                Tulokset ovat vain suuntaa antavia. Jos ne viittaavat haasteisiin, käänny
                erikoisopettajan, psykologin tai terveydenhuollon ammattilaisen puoleen.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => navigate("/consent")}
              className="bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Aloita seulonta
            </button>
            <a
              href="#mita-seulonta-tekee"
              className="bg-[#4A3728] hover:bg-[#2F241B] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Lue lisää
            </a>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-[#755e4d]">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 10–15 min</span>
            <span className="flex items-center gap-2"><GraduationCap className="w-4 h-4" /> Yli 15-vuotiaille</span>
            <span className="flex items-center gap-2"><EyeOff className="w-4 h-4" /> Anonyymi</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Ilmainen</span>
          </div>

          <p className="mt-6 text-xs text-[#755e4d] leading-relaxed">
            Perustuu suomalaiseen lukivaikeus
            <a
              href="https://helda.helsinki.fi/items/1a192f9a-1368-4b3d-a826-7f07c37181d1"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-[#C69A2B] decoration-2 underline-offset-2 hover:text-[#241a11] transition-colors"
            >
              tutkimukseen
            </a>
            {" "}(Panula, 2013, Helsingin yliopisto).
          </p>
        </div>

        {/* Decorative card */}
        <div className="hidden md:flex justify-center">
          <div className="bg-[#2F241B] rounded-2xl p-8 w-72 text-white relative">
            <div className="text-5xl mb-4">📖</div>
            <p className="text-sm text-[#d2c5b0] mb-4 leading-relaxed">
              Lukihäiriö on yleinen oppimisvaikeus — arviolta 5–10 % suomalaisista kokee sen vaikutuksia.
            </p>
            <p className="text-xs text-[#a08d6e] leading-relaxed border-t border-[#4A3728] pt-4">
              Tämä sivusto on yksityishenkilön harrasteprojekti, rakennettu tekoälyn avustuksella.
              Ei kliininen eikä ammatillinen työkalu.
            </p>
          </div>
        </div>
      </section>

      {/* What does the screening do */}
      <section id="mita-seulonta-tekee" className="bg-[#f9ede4] px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#241a11] tracking-tight mb-2">Mitä tämä seulonta tekee?</h2>
          <p className="text-[#755e4d] mb-10">Seulonta on suunniteltu antamaan selkeä kuva lukemisen eri osa-alueista.</p>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <Type className="w-5 h-5" />, title: "Sanojen tunnistus", desc: "Arvioimme, kuinka nopeasti ja tarkasti tunnistat kirjoitettuja sanoja." },
              { icon: <Zap className="w-5 h-5" />, title: "Lukemisnopeus", desc: "Seuraamme lukemisen sujuvuutta ja tekstin prosessointiaikaa." },
              { icon: <Layers className="w-5 h-5" />, title: "Tavujen käsittely", desc: "Mittaamme kykyä hahmottaa sanojen rakenteita ja tavutusta." },
              { icon: <Ruler className="w-5 h-5" />, title: "Pituuserojen hahmotus", desc: "Tarkastelemme tarkkuutta kirjainten ja sanojen kestoeroissa." },
              { icon: <Link2 className="w-5 h-5" />, title: "Sanarajojen hahmotus", desc: "Tunnistamme kykyä erottaa sanat yhteenkirjoitetussa tekstissä." },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-[#ffffff] rounded-xl p-5" style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}>
                <div className="text-[#C69A2B] mb-3">{icon}</div>
                <h3 className="font-semibold text-[#241a11] mb-2">{title}</h3>
                <p className="text-sm text-[#755e4d]">{desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-[#ffffff] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}>
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-[#C69A2B] mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#241a11]">Saat välittömän yhteenvedon</p>
                <p className="text-sm text-[#755e4d]">Seulonnan lopuksi saat kattavan raportin tuloksistasi ja suositukset jatkotoimenpiteistä.</p>
              </div>
            </div>
            <a
              href="#valmis"
              className="bg-[#4A3728] hover:bg-[#2F241B] text-white text-sm font-semibold px-5 py-2.5 rounded-lg whitespace-nowrap transition-colors"
            >
              Miten se toimii?
            </a>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section id="valmis" className="bg-[#fff8f5] px-6 py-20 text-center">
        <div className="max-w-xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-[#f9e4d6] text-[#785a00] text-sm font-medium px-4 py-2 rounded-full mb-8">
            <AlertTriangle className="w-4 h-4" />
            Tämä ei ole virallinen diagnoosi.
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#241a11] tracking-tight mb-4">Valmiina aloittamaan?</h2>
          <p className="text-[#755e4d] mb-8 leading-relaxed">
            Seulonta kestää noin 10–15 minuuttia. Varaa itsellesi rauhallinen hetki ja paikka, jossa voit keskittyä.
          </p>
          <button
            onClick={() => navigate("/consent")}
            className="bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold text-lg px-10 py-4 rounded-lg transition-colors block mx-auto"
          >
            Aloita seulonta
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2F241B] text-[#d2c5b0] px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-white font-bold text-lg mb-2">LukiSeula</p>
          <p className="text-sm leading-relaxed max-w-xl">
            Yksityishenkilön harrasteprojekti, rakennettu tekoälyn avustuksella.
            Ei kliininen eikä ammatillinen työkalu — tulokset ovat vain suuntaa antavia.
          </p>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#4A3728] flex flex-col sm:flex-row justify-between text-xs gap-2">
          <p>© 2025 LukiSeula · Harrasteprojekti</p>
          <p>Rakennettu Suomessa tekoälyn avulla</p>
        </div>
      </footer>

    </div>
  );
}
