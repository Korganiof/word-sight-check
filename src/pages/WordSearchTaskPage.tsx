import { WordSearchTask } from "@/components/WordSearchTask";
import { wordSearchPassage, wordSearchTargets } from "@/lib/wordsearch";

export default function WordSearchTaskPage() {
  return (
    <WordSearchTask
      text={wordSearchPassage}
      targets={wordSearchTargets}
      durationMs={2 * 60 * 1000}
    />
  );
}

