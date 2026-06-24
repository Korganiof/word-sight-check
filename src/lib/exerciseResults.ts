import { createSessionStore } from "./sessionStore";

export interface SimpleExerciseResult {
  correct: number;
  total: number;
}

const stores = {
  syllables: createSessionStore<SimpleExerciseResult>("dyslexia-syllables-result"),
  minimalPairs: createSessionStore<SimpleExerciseResult>("dyslexia-minimal-pairs-result"),
  wordChains: createSessionStore<SimpleExerciseResult>("dyslexia-word-chains-result"),
  readingComp: createSessionStore<SimpleExerciseResult>("dyslexia-reading-comp-result"),
  spellingErrors: createSessionStore<SimpleExerciseResult>("dyslexia-spelling-errors-result"),
  sentenceChains: createSessionStore<SimpleExerciseResult>("dyslexia-sentence-chains-result"),
  trueFalse: createSessionStore<SimpleExerciseResult>("dyslexia-true-false-result"),
  syllableBoundaries: createSessionStore<SimpleExerciseResult>("dyslexia-syllable-boundaries-result"),
};

export const saveSyllablesResult = stores.syllables.save;
export const loadSyllablesResult = stores.syllables.load;

export const saveMinimalPairsResult = stores.minimalPairs.save;
export const loadMinimalPairsResult = stores.minimalPairs.load;

export const saveWordChainsResult = stores.wordChains.save;
export const loadWordChainsResult = stores.wordChains.load;

export const saveReadingCompResult = stores.readingComp.save;
export const loadReadingCompResult = stores.readingComp.load;

export const saveSpellingErrorsResult = stores.spellingErrors.save;
export const loadSpellingErrorsResult = stores.spellingErrors.load;

export const saveSentenceChainsResult = stores.sentenceChains.save;
export const loadSentenceChainsResult = stores.sentenceChains.load;

export const saveTrueFalseResult = stores.trueFalse.save;
export const loadTrueFalseResult = stores.trueFalse.load;

export const saveSyllableBoundariesResult = stores.syllableBoundaries.save;
export const loadSyllableBoundariesResult = stores.syllableBoundaries.load;
