import type { ErrorTag, SyllableItem } from "./types";

/** Double consonant pairs: single vs double (Finnish k/kk, t/tt, p/pp) */
const DOUBLE_CONSONANT_PAIRS = [
  ["k", "kk"],
  ["t", "tt"],
  ["p", "pp"],
] as const;

/** Vowel length pairs: short vs long (u/uu, a/aa, etc.) */
const VOWEL_LENGTH_PAIRS = [
  ["u", "uu"],
  ["a", "aa"],
  ["i", "ii"],
  ["e", "ee"],
  ["o", "oo"],
  ["ä", "ää"],
  ["ö", "öö"],
  ["y", "yy"],
] as const;

function normalizeForCompare(s: string): string {
  return s.toLowerCase().trim();
}

/** Check if two syllable strings differ only by a double consonant (k/kk, t/tt, p/pp) */
function isDoubleConsonantError(got: string, expected: string): boolean {
  const g = normalizeForCompare(got);
  const e = normalizeForCompare(expected);
  if (g === e) return false;

  for (const [single, double] of DOUBLE_CONSONANT_PAIRS) {
    const gSwap = g.replace(new RegExp(double, "g"), single);
    const eSwap = e.replace(new RegExp(double, "g"), single);
    if (gSwap === eSwap) return true;

    const gToDouble = g.replace(new RegExp(`(${single})(?=${single}|$)`, "g"), double);
    const eToDouble = e.replace(new RegExp(`(${single})(?=${single}|$)`, "g"), double);
    if (gToDouble === eToDouble) return true;
  }
  return false;
}

/** Check if two syllable strings differ only by vowel length (u/uu, a/aa, etc.) */
function isVowelLengthError(got: string, expected: string): boolean {
  const g = normalizeForCompare(got);
  const e = normalizeForCompare(expected);
  if (g === e) return false;

  for (const [short, long] of VOWEL_LENGTH_PAIRS) {
    const gNorm = g.replace(new RegExp(long, "g"), short);
    const eNorm = e.replace(new RegExp(long, "g"), short);
    if (gNorm === eNorm) return true;
  }
  return false;
}

/** Check if assembled word matches correct word (exact or via normalization) */
function assembledMatchesCorrect(assembled: string, correct: string): boolean {
  const a = normalizeForCompare(assembled);
  const c = normalizeForCompare(correct);
  return a === c;
}

/** Detect which error tags apply when user's answer is wrong */
export function detectErrorTags(
  assembledSyllables: string[],
  assembledWord: string,
  item: SyllableItem
): ErrorTag[] {
  const tags: ErrorTag[] = [];
  const correct = item.syllablesCorrect;

  if (assembledSyllables.length !== correct.length) {
    tags.push("syllable_order");
    return tags;
  }

  let hasDoubleConsonant = false;
  let hasVowelLength = false;
  let hasOrder = false;

  for (let i = 0; i < assembledSyllables.length; i++) {
    const got = assembledSyllables[i];
    const exp = correct[i];

    if (got === exp) continue;

    if (isDoubleConsonantError(got, exp)) {
      hasDoubleConsonant = true;
    }
    if (isVowelLengthError(got, exp)) {
      hasVowelLength = true;
    }
    if (!hasDoubleConsonant && !hasVowelLength) {
      hasOrder = true;
    }
  }

  if (hasDoubleConsonant) tags.push("double_consonant");
  if (hasVowelLength) tags.push("vowel_length");
  if (hasOrder) tags.push("syllable_order");

  return tags;
}

export interface ScoreResult {
  isCorrect: boolean;
  errorTags: ErrorTag[];
}

/** Score a submission against an item */
export function scoreSubmission(
  assembledSyllables: string[],
  item: SyllableItem
): ScoreResult {
  const assembledWord = assembledSyllables.join("");
  const isCorrect = assembledMatchesCorrect(assembledWord, item.correctWord);

  if (isCorrect) {
    return { isCorrect: true, errorTags: [] };
  }

  const errorTags = detectErrorTags(assembledSyllables, assembledWord, item);
  return { isCorrect: false, errorTags };
}
