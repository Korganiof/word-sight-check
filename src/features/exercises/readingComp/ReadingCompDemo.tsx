import { useMemo, useState } from "react";
import { CircleCheck, Info } from "lucide-react";
import { parseParagraph } from "./parse";
import type { ReadingCompToken } from "./types";
import { splitTrailingPunctuation } from "@/lib/text";
import { WordToggle, WordProse } from "@/components/marks";
import { Sheet, Label } from "@/components/primitives";

interface ReadingCompDemoProps {
  sentences: string[];
  /** Called with the number of solved sentences whenever it changes. */
  onSolvedChange: (solved: number) => void;
}

const isPunctuationOnly = (s: string) => !/\p{L}/u.test(s);

// Interactive warm-up for the wrong-word task, rendered exactly like the real
// exercise (tappable prose, highlighter mark) but with feedback on every tap —
// the only place in the battery that gives any.
export function ReadingCompDemo({ sentences, onSolvedChange }: ReadingCompDemoProps) {
  const parsed = useMemo(() => sentences.map((s, i) => parseParagraph(s, i)), [sentences]);
  const [solved, setSolved] = useState<boolean[]>(() => sentences.map(() => false));
  const [wrongTap, setWrongTap] = useState<(string | null)[]>(() => sentences.map(() => null));

  const tap = (si: number, token: ReadingCompToken & { kind: "word" }) => {
    if (solved[si]) return;
    if (token.isError) {
      const next = solved.map((v, i) => (i === si ? true : v));
      setSolved(next);
      setWrongTap(prev => prev.map((v, i) => (i === si ? null : v)));
      onSolvedChange(next.filter(Boolean).length);
    } else {
      setWrongTap(prev => prev.map((v, i) => (i === si ? splitTrailingPunctuation(token.text).word : v)));
    }
  };

  return (
    <Sheet as="section" className="flex flex-col gap-4 p-5 md:p-6">
      <div className="flex flex-col gap-1.5">
        <Label as="h2">Kokeile ensin</Label>
        <p className="m-0 text-body text-ink">Napauta kummastakin lauseesta sanaa, joka ei sovi siihen.</p>
      </div>

      {parsed.map((tokens, si) => {
        const error = tokens.find(t => t.kind === "word" && t.isError) as
          | (ReadingCompToken & { kind: "word"; isError: true })
          | undefined;
        const done = solved[si];
        const wrong = wrongTap[si];
        return (
          <div key={si} className="flex flex-col gap-2 rounded-answer bg-recessed px-5 pb-[18px] pt-4">
            <WordProse>
              {tokens.map((t, ti) => {
                if (t.kind === "whitespace") return null;
                if (isPunctuationOnly(t.text)) return <span key={ti}>{t.text}</span>;
                const { word, trail } = splitTrailingPunctuation(t.text);
                return (
                  <WordToggle
                    key={t.id}
                    trail={trail}
                    pressed={done && t.isError}
                    onToggle={() => tap(si, t)}
                    disabled={done}
                    tabIndex={done ? -1 : undefined}
                  >
                    {word}
                  </WordToggle>
                );
              })}
            </WordProse>

            <div aria-live="polite" className="flex flex-col gap-2">
              {done && error && (
                <p className="m-0 flex items-start gap-2.5 text-[16px] leading-[26px] text-level-good">
                  <CircleCheck className="mt-[3px] h-5 w-5 flex-shrink-0" strokeWidth={2.2} aria-hidden="true" />
                  <span>
                    <strong className="font-bold">Juuri näin.</strong> ”{splitTrailingPunctuation(error.text).word}” on oikeaa suomea, mutta se ei sovi
                    lauseeseen — siinä voisi olla vaikkapa ”{error.correctForm}”.
                  </span>
                </p>
              )}
              {!done && wrong && (
                <p className="m-0 flex items-start gap-2.5 text-[16px] leading-[26px] text-ink-2">
                  <Info className="mt-[3px] h-5 w-5 flex-shrink-0" strokeWidth={2.2} aria-hidden="true" />
                  <span>
                    <strong className="font-bold">Ei tämä</strong> — ”{wrong}” sopii lauseeseen. Etsi sana, joka tekee
                    lauseesta järjettömän.
                  </span>
                </p>
              )}
            </div>
          </div>
        );
      })}
    </Sheet>
  );
}
