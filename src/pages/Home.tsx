import { useNavigate } from "react-router-dom";
import { Clock, EyeOff, CheckCircle, AlertTriangle, Type, Layers, Zap, Ruler, Link2 } from "lucide-react";

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
            Seulontatyökalu
          </span>
          <h1 className="text-4xl md:text-5xl font-bold text-[#241a11] leading-tight tracking-tight mb-4">
            Lukihäiriön seulonta
          </h1>
          <p className="text-lg text-[#755e4d] mb-8 leading-relaxed">
            Lyhyt testi, joka antaa viitteitä siitä, liittyykö lukemiseesi haasteita.
          </p>
          <div className="flex flex-wrap gap-3 mb-8">
            <button
              onClick={() => navigate("/consent")}
              className="bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Aloita testi
            </button>
            <a
              href="#mita-testi-tekee"
              className="bg-[#4A3728] hover:bg-[#2F241B] text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Lue lisää
            </a>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-[#755e4d]">
            <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> 10–15 min</span>
            <span className="flex items-center gap-2"><EyeOff className="w-4 h-4" /> Anonyymi</span>
            <span className="flex items-center gap-2"><CheckCircle className="w-4 h-4" /> Ilmainen</span>
          </div>
        </div>

        {/* Decorative card */}
        <div className="hidden md:flex justify-center">
          <div className="bg-[#2F241B] rounded-2xl p-8 w-72 text-white relative">
            <div className="text-5xl mb-4">📖</div>
            <p className="text-sm text-[#d2c5b0] mb-6 leading-relaxed">
              Lukihäiriö on yleinen oppimisvaikeus — arviolta 5–10 % suomalaisista kokee sen vaikutuksia.
            </p>
          </div>
        </div>
      </section>

      {/* What does the test do */}
      <section id="mita-testi-tekee" className="bg-[#f9ede4] px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-[#241a11] tracking-tight mb-2">Mitä tämä testi tekee?</h2>
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
                <p className="text-sm text-[#755e4d]">Testin lopuksi saat kattavan raportin tuloksistasi ja suositukset jatkotoimenpiteistä.</p>
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
            Testin tekeminen vie vain noin 10–15 minuuttia. Varaa itsellesi rauhallinen hetki ja paikka, jossa voit keskittyä.
          </p>
          <button
            onClick={() => navigate("/consent")}
            className="bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold text-lg px-10 py-4 rounded-lg transition-colors mb-4 block mx-auto"
          >
            Aloita testi
          </button>
          <p className="text-xs text-[#d2c5b0]">
            Jatkamalla hyväksyt palvelun{" "}
            <span className="underline cursor-pointer">käyttöehdot</span>
            {" "}ja{" "}
            <span className="underline cursor-pointer">tietosuojaselosteen</span>.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2F241B] text-[#d2c5b0] px-6 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div className="max-w-xs">
            <p className="text-white font-bold text-lg mb-2">LukiSeula</p>
            <p className="text-sm leading-relaxed">Moderni työkalu lukihäiriön tunnistamiseen ja oppimisen tukemiseen.</p>
          </div>
          <div className="flex gap-16 text-sm">
            <div>
              <p className="text-white font-semibold mb-3">Linkit</p>
              <ul className="space-y-2">
                <li><a href="#mita-testi-tekee" className="hover:text-white transition-colors">Tietoa meistä</a></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Saavutettavuus</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Ota yhteyttä</span></li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-3">Laillinen</p>
              <ul className="space-y-2">
                <li><span className="hover:text-white transition-colors cursor-pointer">Tietosuoja</span></li>
                <li><span className="hover:text-white transition-colors cursor-pointer">Käyttöehdot</span></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-10 pt-6 border-t border-[#4A3728] flex flex-col sm:flex-row justify-between text-xs gap-2">
          <p>© 2025 LukiSeula. Kaikki oikeudet pidätetään.</p>
          <p>Suunniteltu Suomessa</p>
        </div>
      </footer>

    </div>
  );
}
