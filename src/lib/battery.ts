import { DEV_FAST } from "./devConfig";

// Timers and item counts of the screening battery, in one place so the
// exercises and their ready screens (facts pills) can never disagree. The
// values follow the NMI norms — see CLAUDE.md before changing any of them.

/** Osa 1: per-word limit; a timeout counts as a wrong answer. */
export const PSEUDO_ITEM_TIMEOUT_MS = 3000;
/** Osa 1: real words and pseudowords per session (base rate stays 50 %). */
export const PSEUDO_MAIN_PER_CLASS = 15;

/** Osa 2: word search. */
export const WORD_SEARCH_DURATION_MS = DEV_FAST ? 20_000 : 3 * 60 * 1000;

/** Osa 3: word chains (NMI Tekninen 2). */
export const WORD_CHAIN_ITEM_COUNT = DEV_FAST ? 2 : 15;
export const WORD_CHAIN_DURATION_MS = DEV_FAST ? 30_000 : 90_000;

/** Osa 4: spelling errors (NMI Tekninen 1). */
export const SPELLING_DURATION_MS = DEV_FAST ? 30_000 : 210_000;

/** Osa 5: reading comprehension. */
export const READING_COMP_DURATION_MS = DEV_FAST ? 30_000 : 240_000;
