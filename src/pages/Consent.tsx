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
    text: "Tämä työkalu tarjoaa vain alustavaa, suuntaa antavaa tietoa. Virallisen diagnoosin saamiseksi tarvitaan aina ammattilaisen, kuten erikoisopettajan tai psykologin tekemä tutkimus.",
  },
  {
    icon: <Bot />,
    title: "Harrasteprojekti, rakennettu tekoälyllä",
    text: "LukiSeula on yksityishenkilön harrasteprojekti, joka on toteutettu tekoälyn avustuksella. Se ei ole kliininen, ammatillinen eikä tieteellisesti validoitu arviointiväline — vaan harjoitusluonteinen kokeilu.",
  },
  {
    icon: <EyeOff />,
    title: "Käyttö on anonyymia",
    text: "Emme kerää henkilötietoja. Tuloksesi säilyvät vain tämän istunnon ajan, eikä niitä voida yhdistää sinuun henkilökohtaisesti.",
  },
];

const NOTES: Array<{ icon: ReactNode; title: string; text: string }> = [
  {
    icon: <UserCheck />,
    title: "Suunniteltu vähintään 15-vuotiaille",
    text: "Tehtävät on mitoitettu nuorille ja aikuisille — noin 9. luokasta ylöspäin. Nuoremmille lapsille lukemisen arviointi kannattaa tehdä koulussa erityisopettajan kanssa, jolla on ikätasolle sopivat välineet.",
  },
  {
    icon: <Info />,
    title: "Hakeudu tarvittaessa tutkimuksiin",
    text: "Jos kartoituksen tulokset herättävät huolta, suosittelemme ottamaan yhteyttä terveydenhuollon tai oppilaitoksesi asiantuntijoihin lisätutkimuksia varten.",
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
      width="shell"
      right={
        <Link
          to="/"
          className="ls-t inline-flex h-10 items-center gap-2 rounded-key px-3 font-ui text-[15px] font-bold text-gold-ink hover:bg-gold-tint hover:text-gold-ink-deep"
        >
          <ArrowLeft className="h-[18px] w-[18px]" strokeWidth={2.2} aria-hidden="true" />
          Etusivulle
        </Link>
      }
      dockPhoneOnly
      dock={
        <div className="flex w-full items-center justify-between gap-3 py-3">
          <LinkButton to="/" variant="tertiary" className="px-4">
            Peruuta
          </LinkButton>
          <Button onClick={proceed} disabled={!agreed} className="flex-1 px-6">
            Jatka tehtävään
            <ArrowRight aria-hidden="true" />
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-20 md:py-6">
        <div className="flex flex-col md:w-[680px] md:flex-shrink-0">
          <h1 className="m-0 font-ui text-h1-sm text-ink md:text-h1">Suostumus ja ymmärrys</h1>
          <p className="mb-8 mt-3 max-w-[600px] text-lead-sm text-ink md:mb-10 md:mt-4 md:text-lead">
            Ennen kuin aloitamme luku- ja kirjoitusvalmiuksien kartoituksen, pyydämme
            sinua lukemaan ja hyväksymään seuraavat ehdot.
          </p>

          <section className="flex flex-col gap-3">
            <h2 className="m-0 font-ui text-[15px] font-extrabold leading-5 text-gold-ink">
              Ehdot, jotka hyväksyt
            </h2>
            <Sheet as="ul" className="m-0 flex list-none flex-col p-0 md:rounded-sheet">
              {CONDITIONS.map((c, i) => (
                <li
                  key={c.title}
                  className={`flex items-start gap-4 px-5 py-5 md:gap-[18px] md:px-7 md:py-6 ${i > 0 ? "border-t border-line" : ""}`}
                >
                  <IconTile icon={c.icon} size={48} className="rounded-[14px]" />
                  <div className="flex min-w-0 flex-col gap-1">
                    <h3 className="m-0 font-ui text-h4 text-ink">{c.title}</h3>
                    <p className="m-0 text-body text-ink">{c.text}</p>
                  </div>
                </li>
              ))}
            </Sheet>
          </section>

          <section className="mt-8 flex flex-col gap-3.5 md:px-2">
            <h2 className="m-0 font-ui text-[15px] font-extrabold leading-5 text-ink-2">Hyvä tietää</h2>
            <ul className="m-0 flex list-none flex-col gap-[18px] p-0">
              {NOTES.map(n => (
                <li key={n.title} className="flex items-start gap-4">
                  <IconTile icon={n.icon} size={40} muted />
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <h3 className="m-0 font-ui text-[17px] font-extrabold leading-6 text-ink">{n.title}</h3>
                    <p className="m-0 max-w-[560px] text-body-sm text-ink-2">{n.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <Sheet
          as="aside"
          className="flex flex-col gap-6 p-6 md:sticky md:top-6 md:w-[400px] md:flex-shrink-0 md:p-7"
        >
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

          <div className="hidden flex-col gap-2 border-t border-line pt-6 md:flex">
            <Button onClick={proceed} disabled={!agreed} className="h-[60px] w-full">
              Jatka tehtävään
              <ArrowRight aria-hidden="true" />
            </Button>
            <LinkButton to="/" variant="tertiary" className="h-[52px] w-full">
              Peruuta
            </LinkButton>
          </div>
        </Sheet>
      </div>
    </ExerciseShell>
  );
}
