import { PseudoWordTask } from "@/components/PseudoWordTask";
import { wordList } from "@/lib/pseudowords";

export default function TaskPage() {
  return <PseudoWordTask items={wordList} />;
}
