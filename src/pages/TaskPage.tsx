import { useMemo } from "react";
import { PseudoWordTask } from "@/components/PseudoWordTask";
import { warmupList, realWords, pseudoWords } from "@/lib/pseudowords";
import { shuffleArray } from "@/lib/utils";
import { DEV_FAST } from "@/lib/devConfig";

// 15 real + 15 pseudo per session, so the base rate is always 50 %.
const MAIN_PER_CLASS = 15;

export default function TaskPage() {
  const items = useMemo(() => {
    const main = shuffleArray([
      ...shuffleArray(realWords).slice(0, MAIN_PER_CLASS),
      ...shuffleArray(pseudoWords).slice(0, MAIN_PER_CLASS),
    ]);
    const all = [...warmupList, ...main];
    return DEV_FAST ? all.slice(0, 3) : all;
  }, []);

  return <PseudoWordTask items={items} warmupCount={DEV_FAST ? 1 : warmupList.length} />;
}
