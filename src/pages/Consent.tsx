import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Bot, EyeOff, Info, Stethoscope, UserCheck } from "lucide-react";
import { markScreeningStarted } from "@/lib/screeningSession";
import { ExerciseShell } from "@/components/shell";
import { Button, LinkButton } from "@/components/Button";
import { IconTile, Sheet } from "@/components/primitives";

// The three cards are exactly what the checkbox asserts (ei diagnoosi ·
// harrasteprojekti · anonyymi); the two notes below are advisory only.
const CONDITIONS: Array<{ icon: ReactNode; title: string; text: string }> = [
  {
    icon: <Stethoscope />,
    title: "Tämä EI ole diagnoosi",
    text: "Seulonta antaa vain alustavaa, suuntaa antavaa tietoa.",
  },
  {
    icon: <Bot />,
    title: "Harrasteprojekti, rakennettu tekoälyllä",
    text: "Lukutaju ei ole kliininen eikä tieteellisesti validoitu arviointiväline.",
  },
  {
    icon: <EyeOff />,
    title: "Käyttö on anonyymia",
    text: "Emme kerää henkilötietoja. Tulokset säilyvät vain tämän istunnon ajan.",
  },
];

const NOTES: Array<{ icon: ReactNode; title: string; text: string }> = [
  {
    icon: <UserCheck />,
    title: "Suunniteltu vähintään 15-vuotiaille",
    text: "Tehtävät on mitoitettu nuorille ja aikuisille, noin 9. luokasta ylöspäin.",
  },
  {
    icon: <Info />,
    title: "Hakeudu tarvittaessa tutkimuksiin",
    text: "Jos tulokset herättävät huolta, käänny erikoisopettajan, psykologin tai terveydenhuollon ammattilaisen puoleen.",
  },
];

export default function Consent() {
  const navigate = useNavigate();
  const [agreed, setAgreed] = useState(false);

  const proceed = () => {
    if (!agreed) return;
    markScreeningStarted();
    navigate("/start");
  };

  return (
    <ExerciseShell
      logoLink
      width="ready"
      center
      right={
        <Link
          to="/"
          className="ls-t inline-flex h-10 items-center gap-2 rounded-key px-3 font-ui text-[15px] font-bold text-gold-ink hover:bg-gold-tint hover:text-gold-ink-deep"
        >
          <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
          Etusivulle
        </Link>
      }
      dock={
        // §6.7: the gated primary lives in the bar, with the reason beside it
        // (left on desktop, above the buttons on phones) until the box is ticked.
        <div className="flex w-full flex-col gap-2.5 py-3 md:flex-row md:items-center md:justify-between md:gap-6 md:py-0">
          <div className="min-w-0">
            {!agreed && (
              <p className="m-0 flex items-start gap-2 text-caption text-ink-2">
                <Info className="mt-0.5 h-[18px] w-[18px] flex-shrink-0" strokeWidth={2.2} aria-hidden="true" />
                <span>Hyväksy ensin ehdot, niin voit jatkaa.</span>
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <LinkButton to="/" variant="tertiary" className="px-3.5 md:px-5">
              Peruuta
            </LinkButton>
            <Button onClick={proceed} disabled={!agreed} className="flex-1 px-5 md:flex-none md:px-7">
              Jatka tehtävään
              <ArrowRight aria-hidden="true" />
            </Button>
          </div>
        </div>
      }
    >
      {/* The shell's top padding is 40; the design uses 28 so the checkbox clears the fold at 1440 × 716. */}
      <div className="flex flex-col md:-mt-3">
        <h1 className="m-0 font-ui text-h1-sm text-ink md:text-h1">Suostumus ja ymmärrys</h1>
        <p className="m-0 mt-3 max-w-[720px] text-lead-sm text-ink md:text-lead">
          Ennen kuin aloitamme luku- ja kirjoitusvalmiuksien kartoituksen, pyydämme
          sinua lukemaan ja hyväksymään seuraavat ehdot.
        </p>

        <section className="mt-7 md:mt-8">
          <h2 className="m-0 font-ui text-[15px] font-extrabold leading-5 text-gold-ink">
            Ehdot, jotka hyväksyt
          </h2>
          {/* Phones: one sheet with hairline rows. Desktop: three cards in a row. */}
          <ul className="m-0 mt-3 flex list-none flex-col overflow-hidden rounded-[22px] border border-line bg-surface p-0 shadow-sheet md:grid md:grid-cols-3 md:gap-4 md:overflow-visible md:rounded-none md:border-0 md:bg-transparent md:shadow-none">
            {CONDITIONS.map((c, i) => (
              <li
                key={c.title}
                className={`flex items-start gap-4 p-5 md:gap-3.5 md:rounded-[20px] md:border md:border-line md:bg-surface md:px-[22px] md:pb-[22px] md:pt-5 md:shadow-sheet ${i > 0 ? "border-t border-line" : ""}`}
              >
                <IconTile icon={c.icon} size={44} className="md:!h-10 md:!w-10 md:rounded-key" />
                <div className="flex min-w-0 flex-col gap-1">
                  <h3 className="m-0 font-ui text-[18px] font-extrabold leading-6 tracking-[-0.015em] text-ink md:mt-2">
                    {c.title}
                  </h3>
                  <p className="m-0 text-body text-ink">{c.text}</p>
                </div>
              </li>
            ))}
          </ul>

          <Sheet className="mt-4 rounded-[20px] px-5 py-5 md:rounded-[20px] md:px-6">
            <label className="flex cursor-pointer items-start gap-3.5">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="mt-px h-[26px] w-[26px] flex-shrink-0 cursor-pointer rounded-[6px] border-2 border-control accent-brown"
              />
              <span className="text-body text-ink">
                Ymmärrän, että tämä ei ole <strong>diagnoosi</strong>, että kyseessä on{" "}
                <strong>tekoälyavusteinen harrasteprojekti</strong> ja että käyttökertani on{" "}
                <strong>anonyymi</strong>. Hyväksyn nämä ehdot ja haluan jatkaa seulonnan tekemistä.
              </span>
            </label>
          </Sheet>
        </section>

        <section className="mt-9">
          <h2 className="m-0 font-ui text-[15px] font-extrabold leading-5 text-ink-2">Hyvä tietää</h2>
          <ul className="m-0 mt-3.5 grid list-none grid-cols-1 gap-[18px] p-0 md:grid-cols-2 md:gap-8">
            {NOTES.map(n => (
              <li key={n.title} className="flex items-start gap-3.5">
                <IconTile icon={n.icon} size={40} muted />
                <div className="flex min-w-0 flex-col gap-0.5">
                  <h3 className="m-0 font-ui text-[17px] font-extrabold leading-6 text-ink">{n.title}</h3>
                  <p className="m-0 text-body-sm text-ink-2">{n.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </ExerciseShell>
  );
}
