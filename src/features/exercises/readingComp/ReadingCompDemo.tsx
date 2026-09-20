import { useMemo, useState } from "react";
import { parseParagraph } from "./parse";
import type { ReadingCompToken } from "./types";

interface ReadingCompDemoProps {
  sentences: string[];
  /** Called with the number of solved sentences whenever it changes. */
  onSolvedChange: (solved: number) => void;
}

const isPunctuationOnly = (s: string) => !/\p{L}/u.test(s);

// Interactive warm-up for the wrong-word task, rendered exactly like the real
// exercise (tappable prose, gold mark) but with feedback on every tap.
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
      setWrongTap(prev => prev.map((v, i) => (i === si ? token.text : v)));
    }
  };

  return (
    <div
      className="bg-white rounded-xl p-5"
      style={{ boxShadow: "0 4px 24px rgba(47,36,27,0.05)" }}
    >
      <p className="text-xs font-semibold text-[#785a00] uppercase tracking-widest mb-1">
        Kokeile ensin
      </p>
      <p className="text-sm text-[#755e4d] leading-relaxed mb-4">
        Napauta kummastakin lauseesta sanaa, joka ei sovi siihen.
      </p>

      <div className="space-y-3">
        {parsed.map((tokens, si) => {
          const error = tokens.find(t => t.kind === "word" && t.isError) as
            | (ReadingCompToken & { kind: "word"; isError: true })
            | undefined;
          const done = solved[si];
          const wrong = wrongTap[si];
          return (
            <div key={si} className="bg-[#f9ede4] rounded-xl px-5 py-4">
              <p className="leading-relaxed text-[#241a11] text-base md:text-lg">
                {tokens.map((t, ti) => {
                  if (t.kind === "whitespace" || isPunctuationOnly(t.text)) {
                    return <span key={ti}>{t.text}</span>;
                  }
                  const marked = done && t.isError;
                  return (
                    <span
                      key={t.id}
                      role="button"
                      tabIndex={done ? -1 : 0}
                      aria-pressed={marked}
                      onClick={() => tap(si, t)}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          tap(si, t);
                        }
                      }}
                      className={
                        marked
                          ? "rounded-[3px] px-0.5 bg-[#C69A2B] text-white"
                          : done
                            ? ""
                            : "cursor-pointer rounded-sm transition-colors hover:bg-[#f9e4d6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C69A2B]"
                      }
                    >
                      {t.text}
                    </span>
                  );
                })}
              </p>

              {done && error && (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#4f7a3a" }}>
                  <strong>Juuri näin.</strong> ”{error.text}” on oikeaa suomea, mutta se ei sovi
                  lauseeseen — siinä voisi olla vaikkapa ”{error.correctForm}”.
                </p>
              )}
              {!done && wrong && (
                <p className="mt-3 text-sm leading-relaxed" style={{ color: "#a6442a" }}>
                  <strong>Ei tämä</strong> — ”{wrong}” sopii lauseeseen. Etsi sana, joka tekee
                  lauseesta järjettömän.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
