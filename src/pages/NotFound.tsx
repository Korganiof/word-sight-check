import { ExerciseShell } from "@/components/shell";
import { LinkButton } from "@/components/Button";
import { Label, SiteFooter } from "@/components/primitives";

export default function NotFound() {
  return (
    <ExerciseShell logoLink width="shell" center>
      <div className="mx-auto flex max-w-[520px] flex-col items-start gap-3.5 md:py-8">
        <Label>Virhe 404</Label>
        <h1 className="m-0 font-ui text-title-sm text-ink md:text-title">Sivua ei löytynyt</h1>
        <p className="m-0 text-[17px] leading-[26px] text-ink-2 md:text-[20px] md:leading-[30px]">
          Osoite on ehkä kirjoitettu väärin, tai sivu on siirretty.
        </p>
        <LinkButton to="/" className="mt-5">
          Etusivulle
        </LinkButton>
      </div>
      <SiteFooter className="mt-16" />
    </ExerciseShell>
  );
}
