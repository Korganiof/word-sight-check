export interface SimpleExerciseResult {
  correct: number;
  total: number;
}

const SYLLABLES_KEY = "dyslexia-syllables-result";
const MINIMAL_PAIRS_KEY = "dyslexia-minimal-pairs-result";
const WORD_CHAINS_KEY = "dyslexia-word-chains-result";
const READING_COMP_KEY = "dyslexia-reading-comp-result";
const SPELLING_ERRORS_KEY = "dyslexia-spelling-errors-result";

function save(key: string, result: SimpleExerciseResult): void {
  sessionStorage.setItem(key, JSON.stringify(result));
}

function load(key: string): SimpleExerciseResult | null {
  const raw = sessionStorage.getItem(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SimpleExerciseResult;
  } catch {
    return null;
  }
}

export const saveSyllablesResult = (r: SimpleExerciseResult) => save(SYLLABLES_KEY, r);
export const loadSyllablesResult = () => load(SYLLABLES_KEY);

export const saveMinimalPairsResult = (r: SimpleExerciseResult) => save(MINIMAL_PAIRS_KEY, r);
export const loadMinimalPairsResult = () => load(MINIMAL_PAIRS_KEY);

export const saveWordChainsResult = (r: SimpleExerciseResult) => save(WORD_CHAINS_KEY, r);
export const loadWordChainsResult = () => load(WORD_CHAINS_KEY);

export const saveReadingCompResult = (r: SimpleExerciseResult) => save(READING_COMP_KEY, r);
export const loadReadingCompResult = () => load(READING_COMP_KEY);

export const saveSpellingErrorsResult = (r: SimpleExerciseResult) => save(SPELLING_ERRORS_KEY, r);
export const loadSpellingErrorsResult = () => load(SPELLING_ERRORS_KEY);
