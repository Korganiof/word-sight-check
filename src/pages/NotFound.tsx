import { ExerciseShell } from "@/components/shell";
import { LinkButton } from "@/components/Button";
import { Label } from "@/components/primitives";

/** The logo motif with blank text lines: a lens that finds nothing. */
function EmptyLens({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 112 112" fill="none" aria-hidden="true" className={className}>
      <rect width="112" height="112" rx="30" fill="#FAF0D2" />
      <circle cx="50" cy="50" r="27" fill="#FFFFFF" stroke="#C69A2B" strokeWidth="7" />
      <path d="M70.5 70.5 87 87" stroke="#C69A2B" strokeWidth="10" strokeLinecap="round" />
      <rect x="36" y="41" width="28" height="6" rx="3" fill="#E5D9C9" />
      <rect x="36" y="53" width="18" height="6" rx="3" fill="#E5D9C9" />
    </svg>
  );
}

// Terminal screen (§ 6.7 rule 2): no docked bar, the one button sits right
// under the content.
export default function NotFound() {
  return (
    <ExerciseShell logoLink width="shell" center>
      <div className="mx-auto flex max-w-[560px] flex-col items-start">
        <EmptyLens className="h-24 w-24 flex-shrink-0 md:h-28 md:w-28" />
        <Label className="mt-7">Virhe 404</Label>
        <h1 className="m-0 mt-3 font-ui text-h1-sm text-ink md:text-h1">Sivua ei löytynyt</h1>
        <p className="m-0 mt-3 text-[17px] leading-[28px] text-ink-2 md:text-lead">
          Osoite on ehkä kirjoitettu väärin, tai sivu on siirretty.
        </p>
        <LinkButton to="/" className="mt-7 w-full md:w-auto">
          Etusivulle
        </LinkButton>
      </div>
    </ExerciseShell>
  );
}
