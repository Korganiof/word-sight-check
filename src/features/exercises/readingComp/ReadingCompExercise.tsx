import { useMemo, useRef, useState } from "react";
import { readingCompPassages } from "./readingCompItems.fi";
import { parseParagraph } from "./parse";
import { saveReadingCompResult } from "@/lib/exerciseResults";
import { DEV_FAST } from "@/lib/devConfig";
import { scoreMarking } from "@/lib/levels";
import { splitTrailingPunctuation } from "@/lib/text";
import { useCountdown } from "@/hooks/useCountdown";
import { useScreeningFlow } from "@/hooks/useScreeningFlow";
import { ExerciseShell, TimerPill, TimeLine, Counter } from "@/components/shell";
import { WordToggle, WordProse } from "@/components/marks";
import { Button } from "@/components/Button";
import { Sheet, Label } from "@/components/primitives";

const DURATION_MS = DEV_FAST ? 30_000 : 240_000;

export function ReadingCompExercise() {
  const goToNext = useScreeningFlow();

  const passage = readingCompPassages[0];

  const paragraphs = useMemo(
    () => passage.paragraphs.map((text, i) => parseParagraph(text, i)),
    [passage],
  );

  const totalErrors = useMemo(() => {
    let count = 0;
    for (const para of paragraphs) {
      for (const t of para) if (t.kind === "word" && t.isError) count += 1;
    }
    return count;
  }, [paragraphs]);

  const [isFinished, setIsFinished] = useState(false);
  const [markedIds, setMarkedIds] = useState<Set<string>>(new Set());

  const finishedRef = useRef(false);
  const markedIdsRef = useRef<Set<string>>(new Set());

  const finish = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsFinished(true);

    const marked = markedIdsRef.current;
    let hits = 0;
    let falseAlarms = 0;
    for (const para of paragraphs) {
      for (const t of para) {
        if (t.kind !== "word" || !marked.has(t.id)) continue;
        if (t.isError) hits += 1;
        else falseAlarms += 1;
      }
    }
    saveReadingCompResult(scoreMarking(hits, falseAlarms, totalErrors));
    goToNext();
  };

  const remainingMs = useCountdown({ durationMs: DURATION_MS, onExpire: finish });

  const toggleMark = (id: string) => {
    if (finishedRef.current) return;
    setMarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      markedIdsRef.current = next;
      return next;
    });
  };

  return (
    <ExerciseShell
      part={5}
      right={<TimerPill remainingMs={remainingMs} />}
      line={<TimeLine durationMs={DURATION_MS} remainingMs={remainingMs} />}
      width="work-wide"
      dock={
        <>
          <Counter value={markedIds.size} unit="merkittyä" />
          <Button variant="secondary" onClick={finish} disabled={isFinished} className="md:h-14 md:w-[220px]">
            Olen valmis
          </Button>
        </>
      }
    >
      <div className="flex flex-col gap-3.5 md:flex-row md:items-start md:gap-12">
        {/* Title + instruction: a 340 px aside on desktop, stacked on phones. */}
        <aside className="flex flex-col gap-3 md:w-[340px] md:flex-shrink-0 md:gap-[18px]">
          <h1 className="m-0 font-ui text-h2-sm text-ink md:text-h2">Luetun ymmärtäminen</h1>
          <p className="m-0 text-body-sm text-ink md:text-body">
            Lue tarina rauhassa. Siihen on vaihdettu <strong className="font-bold">12 sanaa</strong>, jotka eivät
            sovi lauseen merkitykseen — sana on oikeaa suomea, mutta se tekee lauseesta
            järjettömän. Napauta jokaista sanaa, joka ei sovi. Sinun ei tarvitse tietää, mikä
            sana siinä kuuluisi olla. Napauta uudelleen, jos haluat poistaa merkinnän.
          </p>
        </aside>

        <Sheet as="article" className="min-w-0 flex-1 rounded-sheet-sm px-[18px] pb-5 pt-[18px] md:rounded-sheet md:px-12 md:pb-10 md:pt-9">
          <Label className="mb-2 md:mb-2.5">Teksti</Label>
          <h2 className="m-0 mb-2 font-ui text-[22px] font-extrabold leading-7 tracking-[-0.02em] text-ink md:mb-[18px] md:text-[28px] md:leading-[34px]">
            {passage.title}
          </h2>

          {paragraphs.map((tokens, pIdx) => (
            <WordProse key={pIdx} className="mb-3 last:mb-0 md:mb-[18px]">
              {tokens.map((t) => {
                // The word gap is the toggle's own margin (see WordToggle), so
                // whitespace tokens render nothing.
                if (t.kind === "whitespace") return null;
                // A dash standing on its own is not a word to judge.
                if (!/\p{L}/u.test(t.text)) return <span key={t.id} className="mr-[0.34em]">{t.text}</span>;
                const { word, trail } = splitTrailingPunctuation(t.text);
                return (
                  <WordToggle
                    key={t.id}
                    trail={trail}
                    pressed={markedIds.has(t.id)}
                    onToggle={() => toggleMark(t.id)}
                    disabled={isFinished}
                  >
                    {word}
                  </WordToggle>
                );
              })}
            </WordProse>
          ))}
        </Sheet>
      </div>
    </ExerciseShell>
  );
}
