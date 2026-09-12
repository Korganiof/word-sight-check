import { Link } from "react-router-dom";
import { PageFooter } from "@/components/PageFooter";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fff8f5] font-sans flex flex-col">
      <nav className="px-6 py-4 flex items-center justify-between">
        <span className="text-lg font-bold text-[#241a11] tracking-tight">LukiSeula</span>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md text-center">
          <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-3">
            Virhe 404
          </p>
          <h1 className="text-3xl font-bold text-[#241a11] tracking-tight mb-3">
            Sivua ei löytynyt
          </h1>
          <p className="text-[#755e4d] leading-relaxed mb-8">
            Osoite on ehkä kirjoitettu väärin, tai sivu on siirretty.
          </p>
          <Link
            to="/"
            className="inline-block bg-[#C69A2B] hover:bg-[#785a00] text-white font-semibold px-8 py-3 rounded-lg transition-colors"
          >
            Etusivulle
          </Link>
        </div>
      </div>

      <PageFooter />
    </div>
  );
}
