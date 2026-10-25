import { useEffect, useMemo, useRef, useState } from "react";
import { saveWordSearchResult, type WordSearchTarget } from "@/lib/wordsearch";
import { splitTrailingPunctuation } from "@/lib/text";
import { useCountdown } from "@/hooks/useCountdown";
import { useScreeningFlow } from "@/hooks/useScreeningFlow";
import { Counter, ExerciseShell, TimeLine, TimerPill } from "@/components/shell";
import { WordProse, WordToggle } from "@/components/marks";
import { Button } from "@/components/Button";
import { Label } from "@/components/primitives";

interface WordSearchTaskProps {
  text: string;
  targets: WordSearchTarget[];
  durationMs: number;
}

interface TokenInfo {
  text: string;
  isWhitespace: boolean;
  isTarget: boolean;
}

function normalizeToken(raw: string): string {
  return raw
    .replace(/[.,:;!?()"“”„–—-]/g, "")
    .trim()
    .toUpperCase();
}

export function WordSearchTask({ text, targets, durationMs }: WordSearchTaskProps) {
  const goToNext = useScreeningFlow();
  const [isFinished, setIsFinished] = useState(false);
  const [clickedIndices, setClickedIndices] = useState<Set<number>>(new Set());

  const startTimeRef = useRef<number>(performance.now());
  const finishedRef = useRef(false);
  const clickedIndicesRef = useRef<Set<number>>(new Set());

  const { tokens, totalTargets } = useMemo(() => {
    const targetSet = new Set(targets.map(t => t.word.toUpperCase()));
    const rawTokens = text.split(/(\s+)/);
    const tokenInfos: TokenInfo[] = [];
    let total = 0;

    for (const tok of rawTokens) {
      const isWhitespace = /^\s+$/.test(tok);
      if (isWhitespace) {
        tokenInfos.push({ text: tok, isWhitespace: true, isTarget: false });
        continue;
      }
      const norm = normalizeToken(tok);
      const isTarget = norm.length > 0 && targetSet.has(norm);
      if (isTarget) total += 1;
      tokenInfos.push({ text: tok, isWhitespace: false, isTarget });
    }

    return { tokens: tokenInfos, totalTargets: total };
  }, [text, targets]);

  // Paragraphs: a whitespace token containing a line break starts a new one.
  // Word identity stays the token index, which is what the scoring reads.
  const paragraphs = useMemo(() => {
    const out: number[][] = [[]];
    tokens.forEach((tok, index) => {
      if (tok.isWhitespace) {
        if (tok.text.includes("\n") && out[out.length - 1].length > 0) out.push([]);
        return;
      }
      out[out.length - 1].push(index);
    });
    return out.filter(p => p.length > 0);
  }, [tokens]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "f" || e.key === "F")) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const finishTask = () => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setIsFinished(true);

    const clicked = clickedIndicesRef.current;
    let foundCorrect = 0;
    for (const idx of clicked) {
      if (tokens[idx] && tokens[idx].isTarget) foundCorrect += 1;
    }

    const incorrectClicks = clicked.size - foundCorrect;
    const missedTargets = Math.max(0, totalTargets - foundCorrect);
    const elapsed = performance.now() - startTimeRef.current;

    saveWordSearchResult({
      foundCorrect,
      incorrectClicks,
      missedTargets,
      totalTargets,
      durationMs: Math.round(Math.min(durationMs, elapsed)),
    });

    goToNext();
  };

  const remainingMs = useCountdown({ durationMs, onExpire: finishTask });

  const handleWordClick = (index: number) => {
    if (isFinished) return;
    const token = tokens[index];
    if (!token || token.isWhitespace) return;

    setClickedIndices(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      clickedIndicesRef.current = next;
      return next;
    });
  };

  const targetPanel = (
    <>
      <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:gap-2.5">
        <Label as="h2">Tavoitesanat</Label>
        <p className="m-0 text-[14px] leading-5 text-ink-2 md:text-caption">Klikkaa ne tekstistä.</p>
      </div>
      <ul className="m-0 flex list-none flex-wrap gap-1.5 p-0 md:gap-2">
        {targets.map(t => (
          <li
            key={t.word}
            className="flex h-7 items-center whitespace-nowrap rounded-[9px] bg-recessed px-[9px] font-ui text-[12px] font-extrabold uppercase leading-none tracking-[0.05em] text-ink md:h-8 md:px-[11px] md:text-[13px]"
          >
            {t.word.toUpperCase()}
          </li>
        ))}
      </ul>
    </>
  );

  return (
    <ExerciseShell
      part={2}
      width="column"
      right={<TimerPill remainingMs={remainingMs} />}
      line={<TimeLine durationMs={durationMs} remainingMs={remainingMs} />}
      dock={
        <>
          <Counter value={clickedIndices.size} unit="valittua" />
          <Button variant="secondary" onClick={finishTask} disabled={isFinished} className="h-[52px] md:h-14 md:w-[220px]">
            Olen valmis
          </Button>
        </>
      }
    >
      {/* One column (840 px on desktop): title and instruction, then the target
          panel stuck to the top of the scrolling main — above the text, as the
          ready screen says — then the text sheet. */}
      <div className="flex flex-col gap-3.5 md:-mt-3 md:gap-0">
        <h1 className="m-0 font-ui text-h2-sm text-ink md:text-h2">Sanojen etsiminen tekstistä</h1>
        <p className="m-0 text-body-sm text-ink md:mt-2 md:max-w-[640px] md:text-body">
          Kun löydät sanan tekstistä, klikkaa sitä — se korostuu.
        </p>

        {/* Phone: a full-bleed white strip. Desktop: a white card on a paper band
            (24 px wider than the column) that hides the text scrolling under it. */}
        <div className="sticky top-0 z-[3] -mx-gutter border-y border-line bg-surface px-gutter pb-3.5 pt-3 shadow-sheet md:-mx-6 md:mt-5 md:border-0 md:bg-paper md:px-6 md:pb-4 md:pt-3 md:shadow-none">
          <section
            aria-label="Tavoitesanat"
            className="flex flex-col gap-2.5 md:gap-3 md:rounded-[20px] md:border md:border-line md:bg-surface md:px-5 md:pb-[18px] md:pt-4 md:shadow-sheet"
          >
            {targetPanel}
          </section>
        </div>

        <article className="min-w-0 flex-1 rounded-sheet-sm border border-line bg-surface px-[18px] pb-5 pt-[18px] shadow-sheet md:rounded-sheet md:px-12 md:pb-10 md:pt-9">
          {paragraphs.map((indices, p) => (
            <WordProse key={p} className={p < paragraphs.length - 1 ? "mb-3 md:mb-[18px]" : ""}>
              {indices.map(index => {
                const { word, trail } = splitTrailingPunctuation(tokens[index].text);
                return (
                  <WordToggle
                    key={index}
                    trail={trail}
                    pressed={clickedIndices.has(index)}
                    onToggle={() => handleWordClick(index)}
                    disabled={isFinished}
                  >
                    {word}
                  </WordToggle>
                );
              })}
            </WordProse>
          ))}
        </article>
      </div>
    </ExerciseShell>
  );
}
