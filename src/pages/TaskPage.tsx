import { useMemo } from "react";
import { PseudoWordTask } from "@/components/PseudoWordTask";
import { warmupList, mainList } from "@/lib/pseudowords";
import { shuffleArray } from "@/lib/utils";
import { DEV_FAST } from "@/lib/devConfig";

export default function TaskPage() {
  const items = useMemo(() => {
    const shuffledMain = shuffleArray(mainList);
    const allItems = [...warmupList, ...shuffledMain];
    return DEV_FAST ? allItems.slice(0, 3) : allItems;
  }, []);

  return <PseudoWordTask items={items} warmupCount={DEV_FAST ? 1 : warmupList.length} />;
}
