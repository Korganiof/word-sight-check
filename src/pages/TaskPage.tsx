import { useMemo } from "react";
import { PseudoWordTask } from "@/components/PseudoWordTask";
import { warmupList, mainList } from "@/lib/pseudowords";
import { shuffleArray } from "@/lib/utils";

export default function TaskPage() {
  const items = useMemo(() => {
    const shuffledMain = shuffleArray(mainList);
    return [...warmupList, ...shuffledMain];
  }, []);

  return <PseudoWordTask items={items} warmupCount={warmupList.length} />;
}
